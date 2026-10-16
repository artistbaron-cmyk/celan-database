"""Keep the variant manifest in sync with user-renamed or replaced MP3s."""

import csv
import hashlib
import pathlib
import re
import subprocess


VOLUME = pathlib.Path(__file__).resolve().parent / "volume_001"


def variant_id_from_filename(name):
    match = re.fullmatch(r"(?:ERROR_)?HV-(.+)-(v\d{2}) - .*\.mp3", name)
    return f"{match.group(1)}#{match.group(2)}" if match else None


def duration(path):
    result = subprocess.run(["afinfo", str(path)], capture_output=True, text=True)
    if result.returncode:
        raise ValueError(f"Unreadable audio: {path}")
    match = re.search(r"estimated duration:\s*([\d.]+) sec", result.stdout)
    if not match:
        raise ValueError(f"Unknown audio duration: {path}")
    return str(round(float(match.group(1)), 2))


def main():
    manifest = VOLUME / "manifest.csv"
    with manifest.open(newline="") as handle:
        reader = csv.DictReader(handle)
        fields, rows = reader.fieldnames, list(reader)
    files_by_id = {}
    for path in VOLUME.glob("*.mp3"):
        ident = variant_id_from_filename(path.name)
        if ident:
            files_by_id.setdefault(ident, []).append(path)
    updated, unresolved = [], []
    for row in rows:
        matches = files_by_id.get(row["variant_id"], [])
        if len(matches) != 1:
            unresolved.append(row["variant_id"])
            continue
        actual = matches[0]
        digest = hashlib.sha256(actual.read_bytes()).hexdigest()
        if row["audio_file"] == actual.name and row["sha256"] == digest:
            continue
        replaced = digest != row["sha256"]
        row["audio_file"] = actual.name
        row["audio_review_status"] = (
            "Needs correction" if actual.name.startswith("ERROR_")
            else "User replacement; awaiting confirmation" if replaced
            else row["audio_review_status"]
        )
        if replaced:
            row["sha256"] = digest
            row["bytes"] = str(actual.stat().st_size)
            row["duration_seconds"] = duration(actual)
            row["voice_name"] = "User maintained"
            row["voice_id"] = ""
            row["model_id"] = ""
            row["generation_id"] = ""
            row["generation_prompt"] = ""
        updated.append(row["variant_id"])
    if updated:
        with manifest.open("w", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            writer.writerows(rows)
    print(f"Reconciled {len(updated)} variant audio changes: {', '.join(updated)}")
    if unresolved:
        raise SystemExit(f"Unresolved variant audio files: {', '.join(unresolved)}")


if __name__ == "__main__":
    main()
