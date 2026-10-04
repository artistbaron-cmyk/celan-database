"""Inventory possible examples for the approved two-per-visible-meaning standard.

This is a structural count, not a judgment of Celan or English accuracy.
It reads only the Dictionary App's current source files and writes this folder's CSV.
"""

import csv
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"


def read(name):
    with (APP / name).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


entries = {row["id"]: row for row in read("dictionary_entries.csv")}
senses = [row for row in read("dictionary_senses.csv") if row["visible"] == "Yes"]
examples = [row for row in read("dictionary_examples.csv")
            if row["section"] == "direct" and row["display_kind"] == "sentence"]
meaning_count = Counter(row["headword_id"] for row in senses)
by_headword = defaultdict(list)
for example in examples:
    by_headword[example["headword_id"]].append(example)

rows = []
for sense in senses:
    headword_id = sense["headword_id"]
    placed = by_headword[headword_id]
    linked = sum(example["sense_id"] == sense["sense_id"] for example in placed)
    unassigned = sum(not example["sense_id"] for example in placed)
    # On a one-meaning page, a word-level sentence is an obvious candidate for
    # that one meaning. On a multi-meaning page, it needs an individual review.
    possible = linked + (unassigned if meaning_count[headword_id] == 1 else 0)
    rows.append({
        "headword": entries[headword_id]["headword"],
        "sense_id": sense["sense_id"],
        "word_type": sense["word_type"],
        "meaning": sense["meaning"],
        "visible_meanings_for_word": meaning_count[headword_id],
        "meaning_linked_sentence_candidates": linked,
        "unassigned_word_level_sentences": unassigned,
        "possible_sentences_before_accuracy_review": possible,
        "minimum_shortfall_if_all_candidates_pass": max(0, 2 - possible),
        "accurate_sentences_confirmed": "",
    })

assert rows and len({row['sense_id'] for row in rows}) == len(rows)
output = HERE / "coverage_inventory.csv"
with output.open("w", newline="", encoding="utf-8") as handle:
    writer = csv.DictWriter(handle, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)

print("Visible meanings:", len(rows))
print("Two or more possible sentences:", sum(int(row["possible_sentences_before_accuracy_review"]) >= 2 for row in rows))
print("Fewer than two possible sentences:", sum(int(row["possible_sentences_before_accuracy_review"]) < 2 for row in rows))
print("Linguistic accuracy is not measured by this script; see the reviewed batch records")
