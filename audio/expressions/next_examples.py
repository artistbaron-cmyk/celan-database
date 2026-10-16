"""Select the next unique example shown in the approved dictionary app.

Read only. The JSON output includes the destination volume and readable filename.
Selections are spread across source volumes so each review batch is varied.
Standalone Celan I examples are included alongside all other approved examples.
"""

import argparse
import collections
import csv
import json
import pathlib
import re


PROJECT = pathlib.Path(__file__).resolve().parents[2]
AUDIO = PROJECT / "audio" / "expressions"
EXAMPLES = PROJECT / "dictionary" / "app_data" / "dictionary_examples.csv"


def read_csv(path):
    with path.open(newline="") as handle:
        return list(csv.DictReader(handle))


def filename(entry_id, text):
    readable = re.sub(r"[.!?]+$", "", text.strip())
    readable = re.sub(r"[/\\:]", "-", readable)
    readable = re.sub(r"\s+", " ", readable).strip()
    while len(readable.encode("utf-8")) > 140:
        readable = readable[:-1]
    return f"{entry_id} - {readable}.mp3"


def select(count):
    app_rows = read_csv(EXAMPLES)
    source_volume_by_id = {row["entry_id"]: row["source_volume"] or "Dictionary app examples" for row in app_rows if row["entry_id"]}
    manifests = sorted(AUDIO.glob("volume_???/manifest.csv"))
    recorded = [row for manifest in manifests for row in read_csv(manifest)]
    used_ids = {row["source_id"] for row in recorded}
    used_texts = {row["celan_text"].strip().casefold() for row in recorded}

    candidates = collections.OrderedDict()
    seen_texts = set()
    for row in app_rows:
        text = row["celan_text"].strip()
        key = text.casefold()
        if (
            not row["entry_id"]
            or not text
            or row["entry_id"] in used_ids
            or key in used_texts
            or key in seen_texts
        ):
            continue
        seen_texts.add(key)
        volume = row["source_volume"] or "Dictionary app examples"
        candidates.setdefault(volume, []).append(row)

    made_by_source = collections.Counter()
    for row in recorded:
        if row["source_kind"] == "Dictionary example":
            made_by_source[source_volume_by_id.get(row["source_id"], "Dictionary app examples")] += 1

    volume_counts = {
        path.name: len(list(path.glob("*.mp3")))
        for path in sorted(AUDIO.glob("volume_???"))
        if path.is_dir()
    }
    if not volume_counts:
        volume_counts["volume_001"] = 0

    result = []
    while len(result) < count:
        available = [name for name, rows in candidates.items() if rows]
        if not available:
            break
        source_name = min(
            available,
            key=lambda name: (made_by_source[name], list(candidates).index(name)),
        )
        row = candidates[source_name].pop(0)
        made_by_source[source_name] += 1

        destination = max(volume_counts)
        if volume_counts[destination] >= 200:
            destination = f"volume_{int(destination[-3:]) + 1:03d}"
            volume_counts.setdefault(destination, 0)
        volume_counts[destination] += 1
        result.append(
            {
                "entry_id": row["entry_id"],
                "celan_text": row["celan_text"],
                "translation": row["translation"],
                "source_volume": source_name,
                "audio_file": filename(row["entry_id"], row["celan_text"]),
                "volume": destination,
            }
        )
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--count", type=int, default=30)
    args = parser.parse_args()
    print(json.dumps(select(args.count), ensure_ascii=False))
