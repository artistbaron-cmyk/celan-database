"""Apply approved decisions in items 61–100; preserve held meanings.

Jorvak 85, Welrim 86, Xilvar 89, and Belshara 90 are left visible and
unlinked until the creator clarifies whether "keep unlinked" means archive.
Felorin 94 and the three held interjections remain visible and unlinked.
"""

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
old_values = {
    "lorin-s1": "Guide", "lorin-s2": "Guide / Teacher",
    "rath-s2": "Conditional “If”", "rath-s3": "Conditional marker: if",
    "fah-s1": "Darkness / Fear / Night",
    "reth-s1": "Confusion / Uncertainty",
    "dral-s1": "Sky / Wonder / Heavens",
    "krezor-s1": "forge", "krezor-s2": "Forge / Place of Fire",
    "krezor-s3": "Hearth, Fireplace, Forge",
    "phelvin-s1": "Comforting drink", "phelvin-s2": "Comfort Drink",
    "welrim-s2": "Shared feast",
    "xilvar-s1": "A hidden spice; a seasoning or blend whose composition or preparation is deliberately concealed",
    "belshara-s2": "Duty (Bound Path)", "belshara-s3": "Necessity (Must/Have to)",
    "belshara-s4": "Necessity / Obligation",
    "zhelvek-s1": "Energy Bar", "zhelvek-s2": "Energy carrier",
    "lianor-s1": "Idea, Thought (Place of truth)",
}
for sid, old in old_values.items():
    assert by_id[sid]["meaning"] == old, (sid, by_id[sid]["meaning"])

retire = {"lorin-s2", "rath-s3", "krezor-s2", "phelvin-s2", "belshara-s4"}
write(HERE / "unassigned_61_100_merged_senses.csv", fields,
      [row.copy() for row in senses if row["sense_id"] in retire])
assert sum(row["sense_id"] in retire for row in senses) == len(retire)

new_meanings = {
    "lorin-s1": "Guide / Mentor",
    "rath-s2": "Conditional: if",
    "fah-s1": "Darkness / The Void",
    "reth-s1": "Uncertainty / Confusion / Doubt",
    "dral-s1": "Sky / Heavens / Celestial Expanse",
    "krezor-s1": "Forge / Place of Fire",
    "krezor-s3": "Hearth / Fireplace",
    "phelvin-s1": "Comforting drink / warm herbal beverage",
    "welrim-s2": "Shared feast / communal banquet",
    "xilvar-s1": "Hidden spice / secret seasoning blend",
    "belshara-s2": "Duty / Obligation (Bound Path)",
    "belshara-s3": "Must / Have to",
    "zhelvek-s1": "Energy bar / dense food ration",
    "zhelvek-s2": "Energy carrier / power cell",
    "lianor-s1": "Idea / Thought",
}
for sid, new in new_meanings.items():
    by_id[sid]["meaning"] = new

by_id["rath-s2"]["usage_note"] = "Introduces a conditional clause: if."
by_id["fah-s1"]["usage_note"] = "Darkness is the core sense; fear and despair may arise metaphorically. A period of night is distinct; Kilvlum specifically names midnight."
by_id["dral-s1"]["usage_note"] = "Lowercase dral refers to the physical sky; capitalized Dral names the heavens or celestial expanse. Wonder is expressed by thaalaen in the example."
by_id["phelvin-s1"]["usage_note"] = "Phel + vin: a comforting drink; the herbal and warm reading is part of the approved food use."
by_id["xilvar-s1"]["usage_note"] = "A spice or seasoning blend whose composition or preparation is concealed."
by_id["eshvelaneth-s2"]["usage_note"] = "Nivveilian ceremonial use: a snowstorm guidance ritual; distinct from the general hailstorm meaning."
by_id["lianor-s1"]["usage_note"] = "Lian (truth) + -or (domain/place); the current noun means an idea or thought."
by_id["krezor-s3"]["usage_note"] = "Domestic or social fire place; distinct from the craft forge use."
by_id["krezor-s1"]["usage_note"] = "Krez (fire) + -or (place); the craft or industrial fire place."

for keeper, merged in [
    ("lorin-s1", "lorin-s2"), ("rath-s2", "rath-s3"),
    ("krezor-s1", "krezor-s2"), ("phelvin-s1", "phelvin-s2"),
    ("belshara-s2", "belshara-s4"),
]:
    old_ids = [part.strip() for part in by_id[keeper]["source_entry_ids"].split(";") if part.strip()]
    merged_ids = [part.strip() for part in by_id[merged]["source_entry_ids"].split(";") if part.strip()]
    by_id[keeper]["source_entry_ids"] = "; ".join(dict.fromkeys(old_ids + merged_ids))

write(senses_path, fields, [row for row in senses if row["sense_id"] not in retire])

assign = {
    ("lorin", "PE-CNE1-0028"): "lorin-s1",
    ("lorin", "PE-ER2-0026"): "lorin-s3",
    ("rath", "PE-V2-0037"): "rath-s1",
    ("rath", "PE-V3-0028"): "rath-s2",
    ("fah", "PE-V3-0060"): "fah-s1",
    ("reth", "PE-ICAES1-0057"): "reth-s1",
    ("reth", "PE-V4-0083"): "reth-s2",
    ("dral", "PE-V3-0064"): "dral-s1",
    ("tal", "PE-V2-0044"): "tal-s1",
    ("tal", "PE-NE1-0033"): "tal-s2",
    ("lun", "PE-FAP1-0025"): "lun-s1",
    ("lun", "PE-LPC1-0001"): "lun-s3",
    ("kaleth", "PE-SP2-0004"): "kaleth-s1",
    ("kaleth", "PE-TM1-0003"): "kaleth-s2",
    ("krezor", "PE-TM1-0020"): "krezor-s1",
    ("krezor", "PE-V4-0023"): "krezor-s3",
    ("phelvin", "PE-V4-0059"): "phelvin-s1",
    ("jorvak", "PE-V2-0057"): "jorvak-s1",
    ("welrim", "PE-V2-0023"): "welrim-s2",
    ("xilvar", "PE-V2-0027"): "xilvar-s1",
    ("belshara", "PE-ER2-0012"): "belshara-s2",
    ("belshara", "PE-V4-0002"): "belshara-s3",
    ("belshara", "PE-V4-0072"): "belshara-s2",
    ("felorin", "PE-V2-0084"): "felorin-s2",
    ("zhelvek", "PE-V2-0077"): "zhelvek-s1",
    ("zhelvek", "PE-CNE1-0014"): "zhelvek-s2",
    ("eshvelaneth", "PE-V2-0122"): "eshvelaneth-s1",
    ("eshvelaneth", "PE-V3-0098"): "eshvelaneth-s2",
    ("lianor", "PE-V4-0074"): "lianor-s1",
}
examples_path = APP / "dictionary_examples.csv"
fields, examples = read(examples_path)
seen = set()
changed = []
for example in examples:
    original = example.copy()
    key = example["headword_id"], example["entry_id"]
    if key in assign:
        assert example["section"] == "direct" and example["display_kind"] == "sentence"
        assert example["sense_id"] in {"", assign[key]}
        example["sense_id"] = assign[key]
        seen.add(key)
    if example["sense_id"] in new_meanings or key in assign:
        assert example["sense_id"] in by_id, key
        example["sense_meaning"] = by_id[example["sense_id"]]["meaning"]
    if example["entry_id"] == "PE-V2-0037":
        assert example["translation"] in {"Command: Charge the enemy!", "Charge the enemy!"}
        example["translation"] = "Charge the enemy!"
    if example != original:
        changed.append(original)
assert seen == set(assign)
write(HERE / "unassigned_61_100_original_example_rows.csv", fields, changed)
write(examples_path, fields, examples)

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

print(f"Applied {len(assign)} example links and 5 meaning merges; held meanings remain untouched")
