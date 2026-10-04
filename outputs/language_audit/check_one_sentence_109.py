"""Check the 2026-10-03 review snapshot against today's zero-sentence meanings.

This checks placement and bookkeeping only. It does not certify Celan or English.
"""

import csv
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


inventory = read(ROOT / "outputs/language_audit/coverage_inventory.csv")
entries = read(ROOT / "dictionary/app_data/dictionary_entries.csv")
examples = read(ROOT / "dictionary/app_data/dictionary_examples.csv")
proposals = read(ROOT / "outputs/language_audit/one_sentence_109.csv")

id_by_name = {row["headword"]: row["id"] for row in entries}
sentence_counts = Counter(
    row["headword_id"]
    for row in examples
    if row["section"] == "direct" and row["display_kind"] == "sentence"
)
expected = {
    row["sense_id"]
    for row in inventory
    if int(row["minimum_shortfall_if_all_candidates_pass"]) > 0
    and sentence_counts[id_by_name[row["headword"]]] == 0
}
actual = [row["sense_id"] for row in proposals]
assert len(actual) == len(set(actual)) == 109, "Duplicate or missing snapshot rows"
assert set(actual) - expected == {'eth-s1', 'eth-s2'}, "Unexpected retired meaning in snapshot"
assert expected - set(actual) == {'eth-s3'}, "Unexpected current meaning missing from snapshot"
assert all(bool(row["celan"]) == bool(row["english"]) for row in proposals), "Unpaired sentence or translation"
assert all(row["kind"] in {"ordinary", "construction"} for row in proposals)

filled = sum(bool(row["celan"]) for row in proposals)
print(f"109-row review snapshot accounted for; {filled} have candidate sentences. The current 108 zero-sentence meanings include new standalone Eth, which still needs review.")
print("This check does not assess linguistic accuracy or approve app placement.")
