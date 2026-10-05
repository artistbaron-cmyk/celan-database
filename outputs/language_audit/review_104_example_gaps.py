"""Account for every meaning with zero possible ordinary sentence in the coverage inventory.

This is editorial triage, not a claim that a linked example is linguistically sound.
Read-only for app data; writes review files in this audit folder.
"""

import csv
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


inventory = [row for row in read(HERE / "coverage_inventory.csv")
             if int(row["possible_sentences_before_accuracy_review"]) == 0]
assert len(inventory) == 104
examples = read(APP / "dictionary_examples.csv")
by_headword = defaultdict(list)
by_sense = defaultdict(list)
for row in examples:
    by_headword[row["headword_id"]].append(row)
    if row["sense_id"]:
        by_sense[row["sense_id"]].append(row)

# (classification, evidence id or external expression, plain-English finding, next action)
SPECIAL = {
    1: ("Needs a clearer formed-word illustration", "PE-S3-0010", "Bel-esh appears as a teaching form, while the linked Thalesh ceremony does not demonstrate deep personal ties.", "Keep the suffix. Review a sentence with a relational -esh word before claiming this meaning has a representative example."),
    2: ("Meaning lacks a clear example", "", "The water sentences on Dren's page show physical water, not the symbolic flow meaning.", "Find an existing symbolic use or write and review one example; preserve the physical meaning."),
    3: ("Meaning lacks a clear example", "", "The Dren page has water sentences, but none directly identifies dren as a river/current.", "Find or compose a river-context example if this remains a standalone Dren meaning."),
    4: ("Canonical interjection exists in Expressions", "EX-SRC-LX-V2-0222", "Krez! already appears as the approved ‘Blast! / Damn!’ expression.", "No new word meaning is needed. Decide later whether an exchange sentence should also appear on the dictionary page."),
    5: ("Meaning needs a scope decision", "", "Lian's modal ‘can’ has no matching page sentence; the app grammar names Lianeth for ability, and Lianeth now has the approved modal sentence.", "Decide whether standalone Lian still has a distinct modal use before adding an example."),
    6: ("Meaning needs a scope decision", "PE-109B2-0054", "Aen carries a verb-forming -aen meaning, while a separate -aen headword and the grammar guide already teach that ending with formed verbs.", "Decide whether the suffix should appear only under -aen or also as a separate Aen meaning."),
    7: ("Meaning lacks a clear example", "", "Aen's page has speaking examples, but none clearly shows Aen as the noun ‘Breath of Life.’", "Review a poetic or ceremonial noun use before assigning an example."),
    8: ("Related expression exists; form differs", "EX-SRC-LX-V2-0221", "The approved expression is Vaar'a! for ‘Phew!’; the Vaar page labels standalone Vaar as the interjection.", "Decide whether standalone Vaar! is also approved or the dictionary should point to Vaar'a!."),
    9: ("Canonical interjection exists in Expressions", "EX-SRC-LX-V2-0220", "Fah! already appears as the approved ‘Ugh! / Bah!’ expression.", "No new word meaning is needed. Decide later whether to show a dialogue example on the word page."),
    10: ("Meaning lacks a clear example", "", "Aenor's two page sentences show ‘moment/soon’; neither shows its distinct Ear noun.", "Create or find one reviewed example for Ear if this homograph remains current."),
    11: ("Canonical interjection exists in Expressions", "EX-SRC-LX-V2-0219", "Dral! already appears as the approved ‘Wow! / Heavens!’ expression.", "No new word meaning is needed. Decide later whether to show a dialogue example on the word page."),
    12: ("Meaning lacks a clear example", "", "Morldren has no example placement on its page; the grammar guide names it as a compound for waterfall, but supplies no sentence using it.", "Find or compose a waterfall sentence and review its translation."),
    13: ("Meaning lacks a clear example", "", "Felorin's page sentences say berries, but never mention a coral reef origin.", "Keep reef-specific meaning unlinked until a reef example is reviewed, as previously decided."),
    14: ("Meaning lacks a clear example", "", "Kel's page now demonstrates naming, word, and text; none clearly uses it to say/talk informally.", "Keep the informal verb unlinked until an actual dialogue use is reviewed."),
    15: ("Existing related-form illustration", "PE-V1-0006", "My friend uses the possessive -ian form; Ian's page has many such related sentences.", "Already illustrated as a form. Do not require standalone Ian in a sentence solely to satisfy the count."),
    16: ("Existing related-form illustration", "PE-109B1-0005", "‘Your bread is on the table’ shows anen modifying bread.", "Existing formed-use example is available; no new sentence solely for this count."),
    17: ("Existing related-form illustration", "PE-SP2C-0037", "‘Their mouth is dry’ shows the -eshen possessive form.", "Existing formed-use example is available; no new sentence solely for this count."),
    18: ("Existing related-form illustration", "PE-109B1-0007", "‘Our bread is on the table’ shows velian modifying bread.", "Existing formed-use example is available; no new sentence solely for this count."),
    19: ("Approved number illustration", "PE-V3-0203", "Tenar unar is the approved 10 + 1 number illustration, intentionally not an ordinary sentence.", "Already settled; keep this as a number illustration."),
    20: ("Teaching example exists; noun use still open", "PE-S4B-0009", "‘I am Desire itself’ uses capitalized Thar-ka as an archetypal teaching illustration, not an ordinary noun example.", "Keep the noun unlinked as approved; review an everyday noun use if one is wanted."),
    21: ("Meaning lacks a clear example", "", "Kor's page sentences show center; none gives a handspan length.", "Keep the specialized measure unlinked pending a measurement example."),
    22: ("Meaning lacks a clear example", "", "Pral's current sentences show detail or ‘working,’ not the verb ‘make.’", "Keep standalone Make unlinked; if it is active, find a sentence distinct from Pralaen."),
    23: ("Meaning lacks a clear example", "", "Vok's direct sentences show bond/unity, never betrayal.", "Find or review a sentence that actually means betray, without changing the approved unity use."),
    24: ("Meaning lacks a clear example", "", "Thael's page sentences use it as the noun rhythm, not a gentle-motion adjective.", "Keep the adjective unlinked as approved; decide whether standalone Thael can act adjectivally."),
    25: ("Existing phrase needs sentence review", "PE-V3-0144", "A direct phrase is translated ‘Perform the ritual at the water's light,’ but it is labeled a phrase and has not been checked as an ordinary verb sentence.", "Review whether this phrase demonstrates the verb; retain its phrase label until then."),
    26: ("Meaning wording needs a decision", "", "The page still lists a noun ‘Exterior / outer place,’ although the creator said Thalor means outside, not a location.", "Reconcile this old noun meaning with the approved outside use before adding an example."),
    27: ("Meaning lacks a clear example", "", "Vanesh's page sentences use trading as an action; none clearly uses Vanesh as the noun commerce.", "Keep the noun unlinked as approved until a noun sentence is reviewed."),
    28: ("Meaning lacks a clear example", "", "Kar's direct sentences use kar to strike; none clearly uses it as the noun strike/force/tool-work.", "Review a noun example or narrow this compound meaning."),
    66: ("Related illustration does not separate senses", "PE-V2-0042", "An honored elder illustrates respectful -en, but does not distinguish this wording from item 67.", "Keep the shared illustration; review whether the two honorific -en meanings are distinct."),
    67: ("Related illustration does not separate senses", "PE-V2-0042", "The same honored-elder form also fits item 66; one sentence cannot establish a second role.", "Review whether items 66 and 67 should be one meaning."),
    69: ("Existing partial word-form illustration", "PE-109B2-0053", "Eshlin shows a -lin word, but does not demonstrate both collective and diminutive functions.", "Keep it as a linked-word illustration, not a proof of the whole suffix rule."),
    72: ("Related illustration does not separate senses", "PE-109B2-0056", "Li-Ya shows respect, but does not distinguish the two Li- labels.", "Review whether items 72 and 73 should be one meaning."),
    73: ("Related illustration does not separate senses", "PE-109B2-0056", "The same Li-Ya form also fits item 72; no separate function is shown.", "Review whether items 72 and 73 should be one meaning."),
    74: ("Needs a clearer formed-word illustration", "PE-S3-0010", "Bel-esh is a teaching form; Thalesh is ceremonial and does not prove deep personal ties.", "Review a relational -esh sentence before treating the suffix as illustrated."),
}

rows = []
for index, sense in enumerate(inventory, 1):
    if index in SPECIAL:
        status, evidence_id, finding, action = SPECIAL[index]
        evidence = next((row for row in by_headword[sense["headword"].lower()] if row["entry_id"] == evidence_id), None)
        if evidence_id.startswith("EX-"):
            evidence = None  # Expression lives in expressions_app.json, not dictionary_examples.csv.
    else:
        linked = [row for row in by_sense[sense["sense_id"]] if row["section"] == "related"]
        assert linked, (index, sense["sense_id"])
        evidence = linked[0]
        evidence_id = evidence["entry_id"]
        status = "Existing related-form illustration"
        finding = "The page already shows a sentence using this root or ending in a related word. This illustrates its form, not every nuance of the full definition."
        action = "Do not add a standalone sentence solely for the count; check wording and accuracy in the separate sentence review."
    rows.append({
        "number": index,
        "headword": sense["headword"],
        "sense_id": sense["sense_id"],
        "word_type": sense["word_type"],
        "current_meaning": sense["meaning"],
        "classification": status,
        "evidence_id": evidence_id,
        "evidence_celan": evidence["celan_text"] if evidence else "",
        "evidence_english": evidence["translation"] if evidence else "",
        "finding": finding,
        "next_action": action,
    })

assert len(rows) == 104 and len({row["sense_id"] for row in rows}) == 104
out = HERE / "remaining_104_meanings_review.csv"
with out.open("w", newline="", encoding="utf-8") as handle:
    writer = csv.DictWriter(handle, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)

counts = Counter(row["classification"] for row in rows)
lines = [
    "# What remains after reviewing the 104 flagged meanings",
    "",
    "This review read every one of the **104 visible meanings** flagged by the current sentence-count sheet, their app-page example placements, already approved related examples, the four relevant approved entries in Expressions, and the relevant grammar and phrase-builder mentions for apparent gaps. It **did not alter the app** or certify Celan/English sentence accuracy. The [complete 104-row sheet](remaining_104_meanings_review.csv) has one row per meaning, including the exact available example or the reason none fits.",
    "",
    "The earlier count said 104 meanings lacked an identified complete sentence for that meaning. That is a **counting result**, not 104 new sentences to write. **78** already have another appropriate kind of illustration on the app (74 related forms, three approved standalone interjections in Expressions, and Ten as a number). **13** have no clear example of their particular meaning. The other **13** need a scope, label, word-form, or phrase decision before their status can be settled. This classification does not certify example accuracy.",
    "",
    "## What the review found",
    "",
]
for label, count in counts.most_common():
    lines.append(f"- **{count}** — {label}.")
lines += [
    "",
    "## Item-by-item result",
    "",
]
for row in rows:
    lines += [
        f"### {row['number']}. {row['headword']} — {row['word_type']}: {row['current_meaning']}",
        "",
        f"**Result:** {row['classification']}. {row['finding']}",
        "",
        (f"**Existing illustration:** `{row['evidence_celan']}` — “{row['evidence_english']}” ({row['evidence_id']})." if row["evidence_celan"] else f"**Existing evidence:** {row['evidence_id']}." if row["evidence_id"] else "**Existing illustration:** None that clearly demonstrates this meaning."),
        "",
        f"**Next:** {row['next_action']}",
        "",
    ]
(HERE / "remaining_104_meanings_review.md").write_text("\n".join(lines), encoding="utf-8")
print("Reviewed", len(rows), "meanings")
for label, count in counts.most_common():
    print(f"{count:3} {label}")
