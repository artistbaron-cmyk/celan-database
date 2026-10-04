"""Render the dated 109-row review sheet in plain-language batches of ten."""

import csv
from pathlib import Path

HERE = Path(__file__).resolve().parent


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


inventory = {row["sense_id"]: row for row in read(HERE / "coverage_inventory.csv")}
retired_eth = {
    "eth-s1": {"headword": "-eth", "meaning": "Adjectival quality suffix"},
    "eth-s2": {"headword": "-eth", "meaning": "Elevated / ritual noun suffix"},
}
rows = read(HERE / "one_sentence_109.csv")
lines = [
    "# First 109-row example review — 2026-10-03 snapshot",
    "",
    "Items 1–50 have now been reviewed and placed in the app. Item 50 is a general illustration because its two honorific meanings overlap. Items 8 and 9 moved from the old Eth suffix rows to the two -eth meanings. Standalone Eth also received a separate approved sentence. The other rows remain drafts. A word-building illustration shows a formed word rather than using a root or ending by itself. See [the review notes](one_sentence_109_review.md).",
    "",
]
for index, row in enumerate(rows, 1):
    if (index - 1) % 10 == 0:
        lines.extend([f"## Meanings {index}–{min(index + 9, len(rows))}", ""])
    item = inventory.get(row["sense_id"], retired_eth.get(row["sense_id"]))
    if item is None:
        raise ValueError(f"Unknown review meaning: {row['sense_id']}")
    kind = "Word-building illustration" if row["kind"] == "construction" else "Ordinary sentence"
    if not row["celan"]:
        lines.append(f"{index}. **{item['headword']} — {item['meaning']}**: Needs a grammar decision before a sentence can be written.")
    else:
        caution = " **Needs a grammar decision before use.**" if row["status"].startswith("needs_") else ""
        if row["status"].startswith("approved_") or row["status"].startswith("moved_to_"):
            caution = " **Approved and placed.**"
        if row["status"] == "approved_general_illustration_sense_overlap":
            caution = " **Approved as a general illustration; exact sense remains open.**"
        lines.append(
            f"{index}. **{item['headword']} — {item['meaning']}** ({kind}): "
            f"`{row['celan']}` — “{row['english']}”{caution}"
        )
    lines.append("")

(HERE / "one_sentence_109_for_review.md").write_text("\n".join(lines), encoding="utf-8")
print(f"Rendered {len(rows)} meanings in groups of ten")
