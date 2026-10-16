"""Promote approved retakes into their original audio volumes, preserving old takes."""

import csv
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess


ROOT = Path(__file__).resolve().parents[2]
RETAKES = ROOT / "audio/retakes/volume_001"
ARCHIVE = ROOT / "audio/retakes/superseded_originals"
ID_KEYS = {"expressions": "source_id", "headwords": "headword_id", "variants": "variant_id"}
TEXT_KEYS = {"expressions": "celan_text", "headwords": "headword", "variants": "variant_form"}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_manifest(path):
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)


def write_manifest(path, fields, rows):
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main():
    rows = read_manifest(RETAKES / "manifest.csv")[1]
    assert len(rows) == 142
    assert len({(r["collection"], r["source_id"]) for r in rows}) == len(rows)
    assert len({r["candidate_file"] for r in rows}) == len(rows)
    assert not ARCHIVE.exists(), f"Archive already exists: {ARCHIVE}"

    source_manifests = {}
    changes = []
    for retake in rows:
        collection = retake["collection"]
        assert collection in ID_KEYS
        assert retake["audio_review_status"] == "Approved by user"
        assert retake["model_id"] == "eleven_v4"
        assert retake["approved_on"] == "2026-10-16"
        original = ROOT / retake["original_file"]
        candidate = RETAKES / retake["candidate_file"]
        assert original.is_file() and original.name.startswith("ERROR_")
        target = original.with_name(original.name.removeprefix("ERROR_"))
        archive = ARCHIVE / collection / original.parent.name / ("original_" + target.name)
        staged = target.with_name(".swap_" + target.name)
        assert not target.exists() and not archive.exists() and not staged.exists()
        assert candidate.is_file()
        assert digest(original) == retake["original_sha256"]
        assert digest(candidate) == retake["sha256"]
        assert candidate.stat().st_size == int(retake["bytes"])
        assert subprocess.run(["afinfo", str(candidate)], capture_output=True).returncode == 0

        manifest_path = original.parent / "manifest.csv"
        if manifest_path not in source_manifests:
            source_manifests[manifest_path] = read_manifest(manifest_path)
        fields, source_rows = source_manifests[manifest_path]
        matches = [r for r in source_rows if r[ID_KEYS[collection]] == retake["source_id"]]
        assert len(matches) == 1
        source = matches[0]
        assert source["audio_file"] == original.name
        assert source["sha256"] == retake["original_sha256"]
        assert source[TEXT_KEYS[collection]] == retake["source_text"]
        assert source["audio_review_status"] == "Needs correction"
        changes.append((retake, source, original, candidate, target, archive, staged, manifest_path))

    assert "EX-SRC-LX-V3-0030" not in {r["source_id"] for r in rows}
    assert len({x[4] for x in changes}) == len(changes)
    assert len({x[5] for x in changes}) == len(changes)

    # Back up old audio and complete a written inventory before changing active volumes.
    archive_rows = []
    for retake, source, original, candidate, target, archive, staged, manifest_path in changes:
        archive.parent.mkdir(parents=True, exist_ok=True)
        with archive.open("xb") as output, original.open("rb") as input_file:
            shutil.copyfileobj(input_file, output)
        assert digest(archive) == retake["original_sha256"]
        archive_rows.append({
            "collection": retake["collection"], "source_id": retake["source_id"],
            "original_file": str(original.relative_to(ROOT)),
            "archived_file": str(archive.relative_to(ROOT)),
            "promoted_file": str(target.relative_to(ROOT)),
            "approved_retake_file": str(candidate.relative_to(ROOT)),
            "source_manifest": str(manifest_path.relative_to(ROOT)),
            "source_row_before_swap": dict(source),
        })
    (ARCHIVE / "before_swap.json").write_text(json.dumps(archive_rows, ensure_ascii=False, indent=2) + "\n")

    # Stage the approved audio. The original manifest and flagged files remain usable here.
    for retake, source, original, candidate, target, archive, staged, manifest_path in changes:
        with staged.open("xb") as output, candidate.open("rb") as input_file:
            shutil.copyfileobj(input_file, output)
        assert digest(staged) == retake["sha256"]

        source.update(
            audio_file=target.name,
            voice_name=retake["voice_name"],
            voice_id=retake["voice_id"],
            model_id=retake["model_id"],
            generation_id=retake["generation_id"],
            generation_prompt=retake["generation_prompt"],
            duration_seconds=retake["current_duration_seconds"],
            bytes=retake["bytes"],
            sha256=retake["sha256"],
            audio_review_status="Approved by user",
        )
        if "pronunciation_attention" in source:
            source["pronunciation_attention"] = ""

    staged_manifests = []
    for manifest_path, (fields, source_rows) in source_manifests.items():
        staged_manifest = manifest_path.with_name(".swap_manifest.csv")
        assert not staged_manifest.exists()
        write_manifest(staged_manifest, fields, source_rows)
        staged_manifests.append((staged_manifest, manifest_path))

    # Install new files, then their manifests, then remove the flagged active copies.
    for retake, source, original, candidate, target, archive, staged, manifest_path in changes:
        os.replace(staged, target)
    for staged_manifest, manifest_path in staged_manifests:
        os.replace(staged_manifest, manifest_path)
    for retake, source, original, candidate, target, archive, staged, manifest_path in changes:
        assert digest(target) == retake["sha256"] and digest(archive) == retake["original_sha256"]
        original.unlink()
    print(f"Promoted {len(changes)} approved retakes across {len(source_manifests)} manifests")


if __name__ == "__main__":
    main()
