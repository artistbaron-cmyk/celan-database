"""Archive superseded meanings and their misleading old sentence placements."""

import csv
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)


def write(path, fields, rows):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


retire = {"jorvak-s2", "welrim-s1", "xilvar-s2", "belshara-s1"}
senses_path = APP / "dictionary_senses.csv"
fields, senses = read(senses_path)
old = [row.copy() for row in senses if row["sense_id"] in retire]
assert len(old) == 4
write(HERE / "unassigned_85_90_legacy_senses.csv", fields, old)
write(senses_path, fields, [row for row in senses if row["sense_id"] not in retire])

examples_path = APP / "dictionary_examples.csv"
fields, examples = read(examples_path)
sentence_ids = {"PE-V2-0019", "PE-V2-0065"}
assert not any(row["sense_id"] in retire for row in examples)
old_examples = [row.copy() for row in examples if row["entry_id"] in sentence_ids]
assert len(old_examples) == 6
write(HERE / "unassigned_85_89_legacy_sentence_placements.csv", fields, old_examples)
write(examples_path, fields, [row for row in examples if row["entry_id"] not in sentence_ids])

families_path = APP / "dictionary_families.json"
families = json.loads(families_path.read_text(encoding="utf-8"))


def remove_retired(value):
    if isinstance(value, dict):
        return {key: remove_retired(item) for key, item in value.items()}
    if isinstance(value, list):
        return [remove_retired(item) for item in value if not (isinstance(item, str) and item in retire)]
    return value


families = remove_retired(families)
families_path.write_text(json.dumps(families, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Archived 4 superseded meanings and 6 placements of two old sentences")
