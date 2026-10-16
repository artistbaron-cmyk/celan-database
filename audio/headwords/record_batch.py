"""Validate and record downloaded headword takes without replacing existing rows."""

import csv
import hashlib
import json
import pathlib
import subprocess
import sys


ROOT = pathlib.Path(__file__).resolve().parents[2]
AUDIO = ROOT / "audio" / "headwords"
ENTRIES = ROOT / "dictionary" / "app_data" / "dictionary_entries.csv"


def read_csv(path):
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)


def main(pass_name, items):
    assert items and len(items) <= 30
    source = {row["id"]: row for row in read_csv(ENTRIES)[1]}
    manifests = sorted(AUDIO.glob("volume_???/manifest.csv"))
    existing = [row for path in manifests for row in read_csv(path)[1]]
    ids = {row["headword_id"] for row in existing}
    words = {row["headword"].strip().casefold() for row in existing}
    generations = {row["generation_id"] for row in existing if row["generation_id"]}
    by_volume = {}
    for item in items:
        ident, word = item["headword_id"], item["headword"]
        origin = source[ident]
        assert word == origin["headword"] and item["dictionary_pronunciation"] == origin["pronunciation"]
        assert item["source_entry_ids"] == origin["source_entry_ids"]
        assert ident not in ids and word.strip().casefold() not in words
        assert item["generation_id"] not in generations
        ids.add(ident)
        words.add(word.strip().casefold())
        generations.add(item["generation_id"])
        assert item["voice_name"] == "Ehshara"
        assert item["voice_id"] == "ej0ekewUzWvTFUiKsxvp"
        assert item["model_id"] == "eleven_v4"
        assert item["generation_prompt"] and float(item["duration_seconds"]) > 0
        volume = AUDIO / item["volume"]
        path = volume / item["audio_file"]
        assert path.parent == volume and path.name == item["audio_file"]
        assert path.is_file() and path.stat().st_size > 1000
        assert subprocess.run(["afinfo", str(path)], capture_output=True).returncode == 0
        by_volume.setdefault(volume, []).append(item)
    for volume, group in by_volume.items():
        assert len(list(volume.glob("*.mp3"))) <= 200
        manifest = volume / "manifest.csv"
        fields, rows = read_csv(manifest)
        assert {row["audio_file"] for row in rows}.isdisjoint({item["audio_file"] for item in group})
        if "source_pass" not in fields:
            fields.append("source_pass")
            for row in rows:
                row["source_pass"] = "pilot_01"
        for item in group:
            path = volume / item["audio_file"]
            rows.append(dict(
                slot=str(len(rows) + 1),
                headword_id=item["headword_id"],
                headword=item["headword"],
                dictionary_pronunciation=item["dictionary_pronunciation"],
                source_entry_ids=item["source_entry_ids"],
                audio_file=item["audio_file"],
                voice_name=item["voice_name"],
                voice_id=item["voice_id"],
                model_id=item["model_id"],
                generation_id=item["generation_id"],
                generation_prompt=item["generation_prompt"],
                duration_seconds=str(item["duration_seconds"]),
                bytes=str(path.stat().st_size),
                sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
                audio_review_status="Pending human listening review",
                app_integration_status="Not integrated",
                source_pass=pass_name,
            ))
        with manifest.open("w", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            writer.writerows(rows)
    print(json.dumps({"recorded": len(items), "volumes": {path.parent.name: len(read_csv(path)[1]) for path in manifests}}))


if __name__ == "__main__":
    main(sys.argv[1], json.loads(sys.argv[2]))
