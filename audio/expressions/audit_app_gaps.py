"""List visible dictionary example texts that lack an active recording."""

import csv
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
EXAMPLES = ROOT / "dictionary/app_data/dictionary_examples.csv"
SOURCES = ROOT / "data/phrases_and_examples.csv"
AUDIO = ROOT / "audio/expressions"
OUTPUT = AUDIO / "app_missing_audio.csv"


def read_csv(path):
    with path.open(newline="") as handle:
        return list(csv.DictReader(handle))


def distinct(rows, field):
    return "; ".join(dict.fromkeys(row[field] for row in rows if row[field]))


def main():
    recorded_texts = set()
    for manifest in sorted(AUDIO.glob("volume_???/manifest.csv")):
        for row in read_csv(manifest):
            if row["audio_file"].lstrip().startswith("ERROR_"):
                continue
            recorded_texts.add(row["celan_text"].strip().casefold())

    source_by_id = {row["entry_id"]: row for row in read_csv(SOURCES)}
    missing = defaultdict(list)
    for row in read_csv(EXAMPLES):
        text = row["celan_text"].strip()
        if text and text.casefold() not in recorded_texts:
            missing[text.casefold()].append(row)

    fields = (
        "celan_text", "translation", "entry_ids", "placement_count",
        "headwords", "display_kinds", "source_statuses",
    )
    with OUTPUT.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for rows in missing.values():
            ids = list(dict.fromkeys(row["entry_id"] for row in rows if row["entry_id"]))
            statuses = []
            for entry_id in ids:
                source = source_by_id.get(entry_id)
                status = (f"{source['canon_status']}/{source['review_status']}"
                          if source else "No matching recording-source row")
                if status not in statuses:
                    statuses.append(status)
            writer.writerow({
                "celan_text": rows[0]["celan_text"],
                "translation": distinct(rows, "translation"),
                "entry_ids": "; ".join(ids),
                "placement_count": len(rows),
                "headwords": distinct(rows, "headword_id"),
                "display_kinds": distinct(rows, "display_kind"),
                "source_statuses": "; ".join(statuses),
            })

    print(f"{len(missing)} distinct unrecorded texts across {sum(map(len, missing.values()))} placements: {OUTPUT}")


if __name__ == "__main__":
    main()
