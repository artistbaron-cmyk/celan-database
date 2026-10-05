"""Apply the creator's clarified decisions for review items 51–60."""

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


senses_path = APP / "dictionary_senses.csv"
fields, senses = read(senses_path)
by_id = {row["sense_id"]: row for row in senses}
assert by_id["kalor-s1"]["meaning"] in {"Courage / Strength of Spirit", "Courage / Strength of Spirit / Willpower"}
assert by_id["seren-s1"]["meaning"] == "Guardian / Protector"
assert by_id["vaar-s1"]["meaning"] in {"Peace / Unity", "Peace / Unity / Calm"}

retire = {"kal-s2", "kalor-s2", "seren-s2", "vaar-s2"}
retired = [row.copy() for row in senses if row["sense_id"] in retire]
assert len(retired) == 4
write(HERE / "unassigned_51_60_retired_senses.csv", fields, retired)

by_id["kalor-s1"]["meaning"] = "Courage / Strength of Spirit / Willpower"
by_id["kalor-s1"]["source_entry_ids"] = "LX-V2-0042; LX-V2-0032"
by_id["seren-s1"]["source_entry_ids"] = "LX-V2-0033; LX-V3-0007"
by_id["vaar-s1"]["meaning"] = "Peace / Unity / Calm"
write(senses_path, fields, [row for row in senses if row["sense_id"] not in retire])

examples_path = APP / "dictionary_examples.csv"
fields, examples = read(examples_path)
assign = {
    ("kal", "PE-ER2-0074"): "kal-s1",
    ("kal", "PE-FAP1-0001"): "kal-s3",
    ("kalor", "PE-V3-0110"): "kalor-s1",
    ("seren", "PE-ER2-0029"): "seren-s1",
    ("vaar", "PE-S3-0014"): "vaar-s1",
}
seen = set()
changed = []
for example in examples:
    original = example.copy()
    key = example["headword_id"], example["entry_id"]
    if key in assign:
        assert example["section"] == "direct" and example["display_kind"] == "sentence"
        assert example["sense_id"] in {"", assign[key]}
        if example["sense_id"] == "":
            example["sense_id"] = assign[key]
            example["sense_meaning"] = by_id[assign[key]]["meaning"]
        seen.add(key)
    if example["entry_id"] == "PE-V3-0110":
        assert example["translation"] in {"Go in strength and balance! (command)", "Go in strength and balance!"}
        if example["translation"].endswith(" (command)"):
            example["translation"] = "Go in strength and balance!"
    if example != original:
        changed.append(original)
assert seen == set(assign)
write(HERE / "unassigned_51_60_original_example_rows.csv", fields, changed)
write(examples_path, fields, examples)

families_path = APP / "dictionary_families.json"
families = json.loads(families_path.read_text(encoding="utf-8"))
assert families["kal"]["familySenseIds"] in (["kal-s1", "kal-s2", "kal-s3"], ["kal-s1", "kal-s3"])
families["kal"]["familySenseIds"] = ["kal-s1", "kal-s3"]
assert families["seren"]["familySenseIds"] in (["seren-s1", "seren-s2"], ["seren-s1"])
families["seren"]["familySenseIds"] = ["seren-s1"]
families_path.write_text(json.dumps(families, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print("Applied 5 example links, 2 meaning merges, removed 2 unsupported standalone adjectives, updated Vaar's noun wording, and cleaned one shared translation")
