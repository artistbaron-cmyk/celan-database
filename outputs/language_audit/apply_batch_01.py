"""Apply the user-approved first language example batch to the Dictionary App.

The two obsolete source lines are copied to the audit record before their
student-facing placements are removed. This script is deliberately one-time.
"""

import csv
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"
EXAMPLES = APP / "dictionary_examples.csv"


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def write(path, rows, headers):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


rows = read(EXAMPLES)
headers = list(rows[0])
assert len(rows) == 9163, "Batch 01 expected the untouched Pass 3 example count"
assert not any(row["entry_id"].startswith("PE-LA1-") for row in rows), "Batch 01 is already applied"

senses = {row["sense_id"]: row for row in read(APP / "dictionary_senses.csv")}
by_id = Counter(row["entry_id"] for row in rows)
assert by_id["PE-V1-0009"] == 2
assert by_id["PE-V1-0015"] == 4
assert by_id["PE-V1-0012"] == 4

for row in rows:
    if row["entry_id"] == "PE-V1-0009":
        assert row["celan_text"] == "Kadfel ohmbaen"
        row["display_kind"] = "phrase"

retired = [row.copy() for row in rows if row["entry_id"] in {"PE-V1-0015", "PE-V1-0012"}]
assert len(retired) == 8
write(HERE / "batch_01_retired_examples.csv", retired, headers)
rows = [row for row in rows if row["entry_id"] not in {"PE-V1-0015", "PE-V1-0012"}]

approved = [
    ("kadfel-s1", "drenaen kadfel dren.", "The boy drinks water."),
    ("kadfel-s1", "var kadfel an teremil.", "The boy goes home."),
    ("azfel-s1", "shalaen azfel eshlin.", "The girl sees a bird."),
    ("azfel-s1", "drenaen azfel dren.", "The girl drinks water."),
    ("theefel-s1", "shalaen theefel eshlin.", "The neutral child sees a bird."),
    ("theefel-s1", "var theefel an teremil.", "The neutral child goes home."),
    ("kadon-s1", "drenaen kadon dren.", "The masculine woman drinks water."),
    ("aenvor-s1", "keshenaen zhaelral aenvor-ian.", "The healer examines my nose."),
    ("sorl-s1", "keshenaen zhaelral sorl-ian.", "The healer examines my neck."),
    ("kalvar-s1", "rinaen aiv an kalvar-ian.", "There is pain in my arm."),
    ("sharvar-s1", "drenselaen I sharvar-ian.", "I wash my leg."),
    ("morlka-s1", "rinaen aiv an morlka-ian.", "There is pain in my foot."),
]
assert len(approved) == 12
assert all(senses[sense_id]["visible"] == "Yes" for sense_id, _, _ in approved)
assert len({(celan, english) for _, celan, english in approved}) == len(approved)

retained_links = {
    "PE-SP2C-0001": "kadon-s1",
    "PE-SP2C-0012": "aenvor-s1",
    "PE-SP2C-0013": "sorl-s1",
    "PE-SP2C-0014": "kalvar-s1",
    "PE-SP2C-0015": "sharvar-s1",
    "PE-SP2C-0016": "morlka-s1",
}
linked_retained = []
for row in rows:
    if row["entry_id"] in retained_links and row["headword_id"] == senses[retained_links[row["entry_id"]]]["headword_id"]:
        sense_id = retained_links[row["entry_id"]]
        assert row["section"] == "direct" and row["display_kind"] == "sentence"
        assert not row["sense_id"]
        row["sense_id"] = sense_id
        row["sense_meaning"] = senses[sense_id]["meaning"]
        linked_retained.append(row["entry_id"])
assert sorted(linked_retained) == sorted(retained_links)

next_order = Counter()
for row in rows:
    if row["section"] == "direct":
        next_order[row["headword_id"]] = max(next_order[row["headword_id"]], int(row["display_order"]))
for index, (sense_id, celan, english) in enumerate(approved, 1):
    sense = senses[sense_id]
    headword_id = sense["headword_id"]
    next_order[headword_id] += 1
    row = dict.fromkeys(headers, "")
    row.update({
        "headword_id": headword_id,
        "section": "direct",
        "display_order": str(next_order[headword_id]),
        "entry_id": f"PE-LA1-{index:04d}",
        "celan_text": celan,
        "translation": english,
        "example_type": "Reviewed usage example",
        "source_volume": "Language Audit Batch 01",
        "source_section": "User-approved new examples",
        "notes": "Approved in chat on 2026-10-01; see outputs/language_audit/batch_01.md.",
        "sense_meaning": sense["meaning"],
        "display_kind": "sentence",
        "sense_id": sense_id,
    })
    rows.append(row)

assert len(rows) == 9167
keys = [(row["headword_id"], row["section"], row["display_order"]) for row in rows]
assert len(keys) == len(set(keys)), "Duplicate placement order"
write(EXAMPLES, rows, headers)
print("Preserved 8 retired placements; reclassified 2 phrase placements; added 12 approved sentences")
