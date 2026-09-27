"""Read-only structural snapshot for the fresh readiness audit."""

import csv
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent


def rows(name):
    with (ROOT / name).open(newline="", encoding="utf-8") as source:
        return list(csv.DictReader(source))


entries = rows("data/dictionary_entries.csv")
report = rows("data/dictionary_report.csv")
examples = rows("data/phrases_and_examples.csv")
inventory = json.loads((ROOT / "outputs/dictionary_second_pass/app_inventory_after.json").read_text())
example_ids = [row["entry_id"] for row in examples]
headwords = [row["headword"] for row in inventory["entries"]]
sense_key = lambda row: (row["headword"], row["use_type"], row["meaning"])
entry_keys = Counter(map(sense_key, entries))
report_keys = Counter(map(sense_key, report))
placements = [
    (word["headword"], section, example_id)
    for word in inventory["entries"]
    for section in ("direct", "related", "teaching")
    for example_id in word.get(section, [])
    if example_id is not None
]
current_hash = hashlib.sha256((ROOT / "data/dictionary_entries.csv").read_bytes()).hexdigest()
pdf_verification = json.loads((ROOT / "outputs/dictionary_pdf/verification.json").read_text())
result = {
    "headwords": len(headwords),
    "unique_headwords": len(set(headwords)),
    "entry_senses": len(entries),
    "report_senses": len(report),
    "sense_key_multisets_match": entry_keys == report_keys,
    "missing_headword_fields": {
        key: [row["headword"] for row in entries if not row[key].strip()]
        for key in ("headword", "pronunciation", "use_type", "meaning")
    },
    "duplicate_sense_keys": [list(key) + [count] for key, count in entry_keys.items() if count > 1],
    "example_rows": len(examples),
    "duplicate_example_ids": [key for key, count in Counter(example_ids).items() if count > 1],
    "placements": len(placements),
    "placement_ids_not_in_example_table": sorted({item[2] for item in placements} - set(example_ids)),
    "pdf_source_hash_matches_current_csv": pdf_verification["source_sha256"] == current_hash,
    "current_csv_sha256": current_hash,
    "pdf_recorded_source_sha256": pdf_verification["source_sha256"],
}
(HERE / "technical_check.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({key: (len(value) if isinstance(value, list) else value) for key, value in result.items()}, indent=2))
