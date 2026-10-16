"""Reconcile user-renamed or replaced headword MP3s without touching audio."""

import csv
import hashlib
import pathlib
import re
import subprocess


AUDIO = pathlib.Path(__file__).resolve().parent


def headword_id_from_filename(name):
    match = re.match(r"\s*(?:ERROR_)?HW-(.+?) - .*\.mp3$", name)
    return match.group(1).replace("__", " / ") if match else None


def duration(path):
    result = subprocess.run(["afinfo", str(path)], capture_output=True, text=True)
    if result.returncode:
        raise ValueError(f"Unreadable audio: {path}")
    match = re.search(r"estimated duration:\s*([\d.]+) sec", result.stdout)
    if not match:
        raise ValueError(f"Unknown audio duration: {path}")
    return str(round(float(match.group(1)), 2))


def main():
    updated = []
    unresolved = []
    for manifest in sorted(AUDIO.glob("volume_???/manifest.csv")):
        with manifest.open(newline="") as handle:
            reader = csv.DictReader(handle)
            fields = reader.fieldnames
            rows = list(reader)
        files_by_id = {}
        for path in manifest.parent.glob("*.mp3"):
            ident = headword_id_from_filename(path.name)
            if ident:
                files_by_id.setdefault(ident, []).append(path)
        changed = False
        for row in rows:
            matches = files_by_id.get(row["headword_id"], [])
            if len(matches) != 1:
                unresolved.append(row["headword_id"])
                continue
            actual = matches[0]
            digest = hashlib.sha256(actual.read_bytes()).hexdigest()
            if row["audio_file"] == actual.name and row["sha256"] == digest:
                continue
            replaced = digest != row["sha256"]
            row["audio_file"] = actual.name
            row["audio_review_status"] = (
                "Needs correction" if actual.name.lstrip().startswith("ERROR_")
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
                row["source_pass"] = "user_edit"
            updated.append(row["headword_id"])
            changed = True
        if changed:
            with manifest.open("w", newline="") as handle:
                writer = csv.DictWriter(handle, fieldnames=fields)
                writer.writeheader()
                writer.writerows(rows)
    print(f"Reconciled {len(updated)} headword audio changes: {', '.join(updated)}")
    if unresolved:
        raise SystemExit(f"Unresolved headword audio files: {', '.join(unresolved)}")


if __name__ == "__main__":
    main()
