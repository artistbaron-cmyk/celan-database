"""Find existing ordinary sentences that may help fill coverage gaps.

Matches are suggestions only. Exact spelling in Celan does not establish the
right meaning, grammatical use, or translation. No app source is edited.
"""

import csv
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


entries = {row["id"]: row["headword"] for row in read(APP / "dictionary_entries.csv")}
id_by_headword = {value: key for key, value in entries.items()}
coverage = read(HERE / "coverage_inventory.csv")
examples = [row for row in read(APP / "dictionary_examples.csv")
            if row["section"] == "direct" and row["display_kind"] == "sentence"]

shortfalls = [row for row in coverage if int(row["minimum_shortfall_if_all_candidates_pass"]) > 0]
candidate_rows = []
summary_rows = []
for sense in shortfalls:
    headword = sense["headword"]
    headword_id = id_by_headword[headword]
    # A bound form such as -in is not a standalone token; inspecting its
    # construction needs a separate linguistic review.
    if headword.startswith("-") or headword.endswith("-") or len(headword) < 3:
        summary_rows.append({"sense_id": sense["sense_id"], "headword": headword,
                             "possible_other_page_sentences": 0, "search_note": "Bound or very short form; manual construction search needed."})
        continue
    token = re.compile(r"(?<![A-Za-z])" + re.escape(headword) + r"(?![A-Za-z])", re.I)
    own_pairs = {(row["celan_text"].casefold(), row["translation"].casefold())
                 for row in examples if row["headword_id"] == headword_id}
    matches = [row for row in examples if row["headword_id"] != headword_id
               and token.search(row["celan_text"])
               and (row["celan_text"].casefold(), row["translation"].casefold()) not in own_pairs]
    # A source sentence may have several placements. Keep one candidate for
    # each distinct Celan/English pair, retaining its first source placement.
    seen = set()
    unique = []
    for row in matches:
        key = (row["celan_text"].casefold(), row["translation"].casefold())
        if key not in seen:
            seen.add(key)
            unique.append(row)
    summary_rows.append({"sense_id": sense["sense_id"], "headword": headword,
                         "possible_other_page_sentences": len(unique), "search_note": "Exact standalone spelling only; meaning not reviewed."})
    for row in unique[:8]:
        candidate_rows.append({
            "sense_id": sense["sense_id"], "headword": headword,
            "word_type": sense["word_type"], "meaning": sense["meaning"],
            "source_headword": entries[row["headword_id"]],
            "source_entry_id": row["entry_id"], "celan": row["celan_text"],
            "english": row["translation"], "review_result": "",
        })

for name, rows, headers in [
    ("existing_candidate_summary.csv", summary_rows,
     ["sense_id", "headword", "possible_other_page_sentences", "search_note"]),
    ("existing_candidate_samples.csv", candidate_rows,
     ["sense_id", "headword", "word_type", "meaning", "source_headword",
      "source_entry_id", "celan", "english", "review_result"]),
]:
    with (HERE / name).open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

print("Shortfall meanings:", len(shortfalls))
print("Meanings with at least one exact-word candidate elsewhere:",
      sum(int(row["possible_other_page_sentences"]) > 0 for row in summary_rows))
print("Candidate sample rows for individual review:", len(candidate_rows))
