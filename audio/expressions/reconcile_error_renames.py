"""Match user-renamed ERROR_ MP3s to manifest rows without touching the audio."""

import csv
import hashlib
import pathlib
import re


AUDIO = pathlib.Path(__file__).resolve().parent


def main():
    updated = []
    unresolved = []
    for manifest in sorted(AUDIO.glob("volume_???/manifest.csv")):
        with manifest.open(newline="") as handle:
            reader = csv.DictReader(handle)
            fields = reader.fieldnames
            rows = list(reader)
        changed = False
        for row in rows:
            expected = manifest.parent / row["audio_file"]
            if expected.is_file():
                continue
            renamed = manifest.parent / f"ERROR_{row['audio_file']}"
            if not renamed.is_file() or hashlib.sha256(renamed.read_bytes()).hexdigest() != row["sha256"]:
                unresolved.append(row["source_id"])
                continue
            row["audio_file"] = renamed.name
            row["audio_review_status"] = "Needs correction"
            attention = row["pronunciation_attention"]
            if "User marked ERROR_" not in attention:
                attention = "; ".join(filter(None, (attention, "User marked ERROR_")))
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
    print(f"Reconciled {len(updated)} ERROR_ renames: {', '.join(updated)}")
    if unresolved:
        raise SystemExit(f"Unresolved manifest files: {', '.join(unresolved)}")


if __name__ == "__main__":
    main()
