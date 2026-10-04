"""Check reviewed 109-item placements and bookkeeping, not linguistic accuracy."""

import csv
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


app = ROOT / "dictionary/app_data"
proposals = read(ROOT / "outputs/language_audit/one_sentence_109.csv")
entries = {row["id"]: row for row in read(app / "dictionary_entries.csv")}
senses = {row["sense_id"]: row for row in read(app / "dictionary_senses.csv")}
examples = read(app / "dictionary_examples.csv")
coverage = read(ROOT / "outputs/language_audit/coverage_inventory.csv")

assert len(proposals) == len({row["sense_id"] for row in proposals}) == 109
assert all(row["status"].startswith(("approved_", "moved_to_")) for row in proposals)
for number, row in enumerate(proposals, 1):
    target = "-eth" if number in (8, 9) else senses[row["sense_id"]]["headword_id"]
    matching = [example for example in examples
                if example["headword_id"] == target
                and example["celan_text"].casefold() == row["celan"].casefold()
                and example["translation"] == row["english"]]
    assert matching, f"Review item {number} has no matching app placement on {target}"

visible = [row for row in senses.values() if row["visible"] == "Yes"]
illustrated = {row["headword_id"] for row in examples
               if row["display_kind"] in {"sentence", "related"}}
empty_pages = [row["headword_id"] for row in visible if row["headword_id"] not in illustrated]
assert not empty_pages, f"Visible headword pages without a sentence or related illustration: {empty_pages[:10]}"
assert any(row["headword_id"] == "eth" and row["sense_id"] == "eth-s3"
           and row["celan_text"] == "shalaen I eth an shalor."
           for row in examples)
shortfalls = sum(int(row["minimum_shortfall_if_all_candidates_pass"]) > 0 for row in coverage)
print(f"All 109 review items have a matching app placement. No visible headword page lacks a sentence or related illustration. {shortfalls} visible meanings still have fewer than two possible ordinary direct sentences.")
print("This check does not certify the Celan, English, or full meaning coverage of those placements.")
