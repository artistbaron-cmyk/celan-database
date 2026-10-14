"""Reconcile user-renamed or replaced MP3s without touching the audio."""

import csv
import hashlib
import pathlib
import re
import subprocess


AUDIO = pathlib.Path(__file__).resolve().parent


def source_id_from_filename(name):
    match = re.match(r"\s*(?:ERROR_)?(\S+?) - .*\.mp3$", name)
    return match.group(1) if match else None


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
        changed = False
        files_by_id = {}
        for path in manifest.parent.glob("*.mp3"):
            ident = source_id_from_filename(path.name)
            if ident:
                files_by_id.setdefault(ident, []).append(path)
        for row in rows:
            expected = manifest.parent / row["audio_file"]
            matches = files_by_id.get(row["source_id"], [])
            if len(matches) != 1:
                unresolved.append(row["source_id"])
                continue
            actual = matches[0]
            digest = hashlib.sha256(actual.read_bytes()).hexdigest()
            if expected == actual and digest == row["sha256"]:
                continue
            replaced = digest != row["sha256"]
            row["audio_file"] = actual.name
            is_error = actual.name.lstrip().startswith("ERROR_")
            row["audio_review_status"] = (
                "Needs correction" if is_error else "Pending human listening review"
            )
            attention = row["pronunciation_attention"]
            if is_error and "User marked ERROR_" not in attention:
                attention = "; ".join(filter(None, (attention, "User marked ERROR_")))
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
                if "User replaced audio" not in attention:
                    attention = "; ".join(filter(None, (attention, "User replaced audio")))
            if re.search(r"(?<!\w)I(?!\w)", row["celan_text"]) and "standalone I" not in attention:
                attention = "; ".join(filter(None, (attention, "Review standalone I pronunciation")))
            row["pronunciation_attention"] = attention
            updated.append(row["source_id"])
            changed = True
        if changed:
            with manifest.open("w", newline="") as handle:
                writer = csv.DictWriter(handle, fieldnames=fields)
                writer.writeheader()
                writer.writerows(rows)
    print(f"Reconciled {len(updated)} audio file changes: {', '.join(updated)}")
    if unresolved:
        raise SystemExit(f"Unresolved manifest files: {', '.join(unresolved)}")


if __name__ == "__main__":
    main()
