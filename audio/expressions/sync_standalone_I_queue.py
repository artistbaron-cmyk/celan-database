"""Refresh recorded status and file paths in the standalone-I review queue."""

import csv
import pathlib


AUDIO = pathlib.Path(__file__).resolve().parent
QUEUE = AUDIO / "standalone_I_review_queue.csv"


def read_csv(path):
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)


def main():
    fields, queue = read_csv(QUEUE)
    recorded = {}
    for manifest in sorted(AUDIO.glob("volume_???/manifest.csv")):
        for row in read_csv(manifest)[1]:
            recorded[row["source_id"]] = (manifest.parent.name, row)

    changed = 0
    for row in queue:
        match = recorded.get(row["source_id"])
        status = match[1]["audio_review_status"] if match else "Not generated"
        audio_file = f"{match[0]}/{match[1]['audio_file']}" if match else ""
        if row["audio_status"] != status or row["existing_audio_file"] != audio_file:
            row["audio_status"] = status
            row["existing_audio_file"] = audio_file
            changed += 1

    if changed:
        with QUEUE.open("w", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            writer.writerows(queue)
    print(f"Refreshed {changed} queue rows")


if __name__ == "__main__":
    main()
