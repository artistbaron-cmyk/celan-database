"""One-time example placement classification from current Dictionary App records.

This adds reader-facing kind and permanent sense links to the app's example
CSV. It does not change Celan, translations, existing sections, or source notes.
"""

import csv
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"
EXAMPLES = APP / "dictionary_examples.csv"


def read(name):
    with (APP / name).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def write(path, rows, headers):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


rows = read("dictionary_examples.csv")
assert len(rows) == 9163
assert "display_kind" not in rows[0], "Pass 3 has already been applied"
original_columns = list(rows[0])

visible_senses = defaultdict(list)
for sense in read("dictionary_senses.csv"):
    if sense["visible"] == "Yes":
        visible_senses[sense["headword_id"]].append(sense)


def display_kind(row):
    section, kind = row["section"], row["example_type"].casefold()
    if section == "teaching":
        return "historical" if kind.startswith("historical example") else "teaching"
    if section == "related":
        if "idiom" in kind or "proverb" in kind:
            return "related_idiom"
        return "related_phrase" if "phrase" in kind else "related"
    assert section == "direct", section
    if "idiom" in kind or "proverb" in kind:
        return "idiom"
    if "phrase" in kind:
        return "phrase"
    if kind == "capitalization example":
        return "teaching"
    return "sentence"


for row in rows:
    row["display_kind"] = display_kind(row)
    row["sense_id"] = ""
    if row["sense_meaning"]:
        matching = [sense for sense in visible_senses[row["headword_id"]]
                    if sense["meaning"] == row["sense_meaning"]]
        assert len(matching) == 1, (row["headword_id"], row["entry_id"], row["sense_meaning"])
        row["sense_id"] = matching[0]["sense_id"]

assert sum(bool(row["sense_id"]) for row in rows) == 6
write(EXAMPLES, rows, original_columns + ["display_kind", "sense_id"])

placements = defaultdict(Counter)
for row in rows:
    placements[row["headword_id"]].update([row["section"]])

no_direct = []
for headword in read("dictionary_entries.csv"):
    key = headword["id"]
    counts = placements[key]
    if counts["direct"]:
        continue
    types = "; ".join(dict.fromkeys(sense["word_type"] for sense in visible_senses[key]))
    attached = all(sense["word_type"] in {"Prefix", "Suffix"} for sense in visible_senses[key])
    if attached and counts["related"]:
        treatment = "Show recorded construction examples; no standalone example is expected."
    elif attached:
        treatment = "Show a concise attached-form note; no construction example is recorded."
    elif counts["related"] or counts["teaching"]:
        treatment = "Show the recorded related or teaching examples in their own section."
    else:
        treatment = "No example is recorded; do not invent one in this display pass."
    no_direct.append({
        "headword": headword["headword"], "word_types": types,
        "related_count": counts["related"], "teaching_count": counts["teaching"],
        "reader_treatment": treatment,
    })
assert len(no_direct) == 99, len(no_direct)
write(HERE / "pass3_no_direct_examples.csv", no_direct, list(no_direct[0]))

finding_path = HERE / "affected_items.csv"
with finding_path.open(newline="", encoding="utf-8") as handle:
    findings = list(csv.DictReader(handle))
for finding in findings:
    issue = finding["issue"]
    if issue == "example_overload":
        finding["pass3_status"] = "all_accessible_five_initially_visible"
        finding["pass3_note"] = "The first five examples are visible; the rest open with More examples."
    elif issue == "no_direct_example":
        finding["pass3_status"] = "source_retained_no_example_invented"
        finding["pass3_note"] = "See pass3_no_direct_examples.csv for this word's page treatment."
    elif issue == "example_sense_unassigned":
        finding["pass3_status"] = "neutral_word_level_placement"
        finding["pass3_note"] = "Unassigned ordinary sentences remain at word level; phrases, idioms, and teaching items keep their own sections."
    elif issue == "identical_meaning_rows":
        finding["pass3_status"] = "open_meaning_review"
        finding["pass3_note"] = "Meanings were preserved; deciding whether these are duplicates is outside the display pass."
    else:
        finding["pass3_status"] = ""
        finding["pass3_note"] = ""
write(finding_path, findings, list(findings[0]))

print("Example display kinds:", dict(Counter(row["display_kind"] for row in rows)))
print("Approved sense links:", sum(bool(row["sense_id"]) for row in rows))
print("No direct example:", len(no_direct))
