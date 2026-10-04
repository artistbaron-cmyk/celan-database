"""Make a review sheet for the first 50 remaining unassigned meanings.

The examples below are individually selected review leads. They are not new
meaning links and do not certify the full sentence or translation.
"""

import csv
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


first_batch_words = {"Aenor", "Vok", "Thalesh", "Thalor", "Morldren", "Xarvel", "Kar", "Shentalzhael"}
inventory = [row for row in read(HERE / "unassigned_meanings_181.csv")
             if row["headword"] not in first_batch_words][:50]
assert len(inventory) == 50
examples = read(APP / "dictionary_examples.csv")
example_by_placement = {(row["headword_id"], row["entry_id"]): row
                        for row in examples if row["section"] == "direct"}
page_sentence_count = {}
for example in examples:
    if example["section"] == "direct" and example["display_kind"] == "sentence":
        page_sentence_count[example["headword_id"]] = page_sentence_count.get(example["headword_id"], 0) + 1

# sense_id: (current page example ID, review call, plain-English reason)
review = {
    "ilin-s1": ("PE-V4-0058", "Approved match", "The sentence shows Ilin in use. Its inclusive meaning is defined by the grammar rule, not proved by this one sentence."),
    "ilin-s2": ("", "Merged with item 1", "The two Ilin definitions repeated the same inclusive pronoun meaning."),
    "ya-s1": ("PE-V4-0059", "Likely match", "Ya is the person drinking: you."),
    "ya-s2": ("PE-V4-0074", "Likely match", "lianor-ya shows the attached your form; the example also uses Ya as a pronoun."),
    "var-s1": ("PE-SP2-0002", "Likely match", "nor-var is the future form of go."),
    "var-s2": ("PE-EGE1-0011", "Possible match; review grammar", "The translation says toward the coast; confirm that var is the preposition here."),
    "ser-s1": ("PE-V1-0002", "Likely match", "ser is the friend."),
    "ser-s2": ("PE-V1-0011", "Likely match", "ser marks with the water."),
    "ser-s3": ("PE-V4-0082", "Likely match", "ser joins bread and water as and."),
    "thal-s1": ("PE-ER2-0013", "Likely match", "thal is balance given to the group."),
    "ka-s1": ("PE-V1-0034", "Likely match", "ka marks without light."),
    "ka-s2": ("PE-ER2-0025", "Likely match", "ka is spoken alone as no."),
    "an-s1": ("", "Merged with item 14", "The creator combined the duplicate place meanings under the spatial locative."),
    "an-s2": ("PE-V2-0007", "Approved match", "an veth marks a place while nor kilvlum marks a time."),
    "nor-s1": ("PE-ER2-0026", "Likely match", "nor is time guiding a path."),
    "nor-s2": ("PE-V2-0007", "Likely match", "nor introduces midnight as a time."),
    "esh-s1": ("PE-EGE1-0058", "Likely match", "esh is the sky."),
    "esh-s2": ("PE-V1-0037", "Likely match", "esh marks above the water."),
    "esh-s3": ("", "No direct match selected", "An -esh ending inside another word needs a formed-word illustration, not a sentence using standalone esh."),
    "morl-s1": ("PE-S4A-0001", "Likely match", "morl is the mountain."),
    "morl-s3": ("PE-ER2-0036", "Likely match", "morl marks beneath the tree."),
    "terra-s1": ("PE-V4-0061", "Likely match", "Lowercase terra is physical ground."),
    "terra-s2": ("PE-ER2-0044", "Possible match; meaning unclear", "Capitalized Terra gives plenty, but the sentence alone does not define the mystical-force meaning."),
    "dren-s1": ("PE-V1-0001", "Likely match", "dren is physical water."),
    "dren-s2": ("", "No direct match selected", "A sentence with physical water alone cannot establish symbolic water."),
    "dren-s3": ("", "No direct match selected", "The page has many water sentences; none selected here establishes river as a separate meaning."),
    "shal-s1": ("PE-V1-0034", "Partial match", "This shows light, not all the listed new-beginnings/fate extensions."),
    "shal-s2": ("", "No direct match selected", "The inspected direct examples use shal as light; no verb hope example selected."),
    "krez-s1": ("PE-CNE1-0051", "Likely match", "krez is fire."),
    "krez-s2": ("", "No direct match selected", "No standalone Blast!/Damn! use selected from the eight ordinary page sentences."),
    "thar-s1": ("PE-V3-0076", "Likely match", "thar is the heart."),
    "thar-s2": ("", "Moved to Thar-ka", "The desire sentence uses the formed modal thar-ka, not standalone Thar."),
    "vethor-s1": ("PE-ER2-0012", "Likely match", "vethor is shadow."),
    "vethor-s2": ("", "No direct match selected", "The three ordinary page sentences do not use vethor as sleep."),
    "shara-s1": ("PE-ER2-0018", "Likely match", "shara is a path."),
    "shara-s2": ("PE-EGE1-0052", "Likely match", "shara is the action follows; check its broader navigate/track wording separately."),
    "rathor-s1": ("PE-V3-0141", "Possible match; meaning unclear", "Kaleth Rathor is translated ancient fortress-home, not plainly old city."),
    "rathor-s2": ("PE-NE1-0063", "Likely match", "rathor is translated history."),
    "shalor-s1": ("", "No direct match selected", "The inspected sentences mainly use shalor as sanctuary, not light as vision/hope."),
    "shalor-s2": ("", "No direct match selected", "The inspected sentences do not establish new beginnings or fate."),
    "shalor-s3": ("PE-V2-0042", "Likely match", "shalor is the sanctuary."),
    "thaal-s1": ("PE-ER2-0028", "Likely match", "thaal is the unknown."),
    "thaal-s2": ("PE-ER2-0027", "Likely match", "thaal marks the brightest superlative."),
    "lian-s1": ("PE-V3-0076", "Likely match", "lian is truth."),
    "lian-s2": ("", "No direct match selected", "The page sentences examined use lian as truth; lianaen is a different formed verb."),
    "lian-s3": ("", "No direct match selected", "A modal can/able use was not selected from the page sentences."),
    "aen-s1": ("PE-DR2-0015", "Partial match", "This clearly shows speak; tell and breathe need separate attention."),
    "aen-s2": ("PE-DR2-0006", "Likely match", "aen introduces the clause translated that you go."),
    "aen-s3": ("", "No direct match selected", "The -aen ending needs a formed-word illustration, not standalone aen."),
    "aen-s4": ("", "No direct match selected", "The inspected page sentences do not clearly use aen as Breath of Life."),
}

creator_decisions = {
    "ilin-s1": "Creator clarified that the dictionary example should simply show Ilin in a sentence. Its inclusive meaning belongs in the established grammar rule. The existing bread sentence is linked to the one Ilin meaning.",
    "ilin-s2": "Duplicate Ilin definition merged into item 1. No Imen contrast sentence is needed on the Ilin page.",
    "ya-s1": "Approved. Link Drenaen Ya phelvin. to the pronoun meaning.",
    "ya-s2": "Approved. Link aen Ya lianor-ya. to the possessive meaning; the same sentence also contains pronoun Ya.",
    "var-s1": "Approved. Link nor-var I an Eshvan. to the motion verb.",
    "var-s2": "Approved. In the water/glacier/coast sentence, var means toward; link to the preposition.",
    "ser-s1": "Approved. Link ra var ser? to the friend noun.",
    "ser-s2": "Approved. Link shalil Theon-ian ser dren. to with.",
    "ser-s3": "Approved. Link Rinaen morlak ser dren. to and.",
    "thal-s1": "Approved. Link tal theon thal an Ilin. to balance.",
    "ka-s1": "Approved. Link var I ka shal. to without.",
    "ka-s2": "Approved. Link aen ser: \"ka.\" to the spoken no meaning.",
    "an-s1": "Merge into item 14; this was a duplicate spatial locative definition.",
    "an-s2": "Approved. Keep this spatial locative meaning and link tal I dren nor kilvlum an veth. to it.",
    "nor-s1": "Approved. Link lorin nor shara-ian. to the time noun.",
    "nor-s2": "Approved. Link tal I dren nor kilvlum an veth. to the time preposition.",
    "esh-s1": "Approved. Link rinaen jor an esh. to sky / air.",
    "esh-s2": "Approved. Link var I esh dren. to above / over.",
    "esh-s3": "Hold. A relational -esh ending needs an indexed formed-word illustration; standalone esh sentences do not show the suffix.",
    "morl-s1": "Approved. Link var kadron an morl. to mountain.",
    "morl-s3": "Approved. Link rinaen veth morl verdmarin. to under / beneath.",
    "terra-s1": "Approved. Lowercase terra is physical ground; link moraen I an terra.",
    "terra-s2": "Approved. Capitalized Terra is the living world-force; link tal Terra wor an Ilin.",
    "dren-s1": "Approved. Link var I an dren. to physical water.",
    "dren-s2": "Hold for a sentence showing symbolic emotional or spiritual flow.",
    "dren-s3": "Hold for a sentence that supports river/current specifically.",
    "shal-s1": "Approved for light. Link var I ka shal.; this sentence does not demonstrate every abstract extension.",
    "shal-s2": "Move the hope verb to Shalaen; existing Shalaen sentence about hoping in the dawn is linked there.",
    "krez-s1": "Approved. Link rinaen krez zhirkor. to fire.",
    "krez-s2": "Hold for a reviewed standalone Krez! exclamation.",
    "thar-s1": "Approved. Link aen thar lian. to heart / inner self.",
    "thar-s2": "Move the desire modal to Thar-ka; link the existing want-to-go sentence there.",
    "vethor-s1": "Approved. Link lorin belshara Ilin shan vethor. to shadow / mystery.",
    "vethor-s2": "Move sleep to Vethoraen; link the existing child-sleeps sentence there.",
    "shara-s1": "Approved. Link var I an shara. to path / journey.",
    "shara-s2": "Approved. Link shara rathzor gavin shan verdor. to follow/track.",
    "rathor-s1": "Approved as a compound use. Link the ancient fortress-home sentence to ancient place.",
    "rathor-s2": "Approved. Link rinaen rathor an liankavor. to past / history.",
    "shalor-s1": "Consolidate abstract light with Shal; Shalor means sanctuary.",
    "shalor-s2": "Consolidate new beginnings/fate with Shal; Shalor means sanctuary.",
    "shalor-s3": "Approved. Link the elder-goes-to-the-sanctuary sentence to sanctuary.",
    "thaal-s1": "Approved. Link fahaen ser thaal. to the unknown.",
    "thaal-s2": "Approved. Link rinaen dren-ian shaleth thaal. to the superlative particle.",
    "lian-s1": "Approved. Link aen thar lian. to truth.",
    "lian-s2": "Move the prayer verb to Lianaen; link the existing elder-goes-to-pray sentence there.",
    "lian-s3": "Hold for an explicit ability use of modal Lian.",
    "aen-s1": "Approved for speak/tell. Link aen serathrin ser khumrel.",
    "aen-s2": "Approved. Link varin I aen var Ya an teremil. to conjunction that.",
    "aen-s3": "Hold for a formed-verb illustration of -aen; no standalone aen sentence proves a suffix.",
    "aen-s4": "Hold for a clear Breath of Life phrase; proposed Aen Terra was not published.",
}

merged_ids = {"ilin-s2", "an-s1", "shalor-s1", "shalor-s2"}
moved_ids = {"shal-s2", "thar-s2", "vethor-s2", "lian-s2"}
hold_ids = {"esh-s3", "dren-s2", "dren-s3", "krez-s2", "lian-s3", "aen-s3", "aen-s4"}

assert {row["sense_id"] for row in inventory} == set(review)
rows = []
for number, sense in enumerate(inventory, 1):
    entry_id, call, reason = review[sense["sense_id"]]
    example = example_by_placement.get((sense["headword"].lower(), entry_id)) if entry_id else None
    assert not entry_id or (example and example["display_kind"] == "sentence"), (sense["sense_id"], entry_id)
    rows.append({
        "number": number,
        "headword": sense["headword"],
        "sense_id": sense["sense_id"],
        "word_type": sense["word_type"],
        "current_meaning": (
            "We / us (inclusive)" if sense["sense_id"] == "ilin-s1"
            else "At / in / on (spatial place)" if sense["sense_id"] == "an-s2"
            else "Heart / inner self" if sense["sense_id"] == "thar-s1"
            else "Water (physical)" if sense["sense_id"] == "dren-s1"
            else "Retired: " + sense["meaning"] if sense["sense_id"] in merged_ids | moved_ids
            else sense["meaning"]
        ),
        "ordinary_sentences_on_page": page_sentence_count[sense["headword"].lower()],
        "review_example_id": entry_id,
        "review_example_celan": example["celan_text"] if example else "",
        "review_example_english": example["translation"] if example else "",
        "provisional_call": call,
        "reason_or_question": reason,
        "suggested_next_step": (
            "This meaning was retired; the use remains under its approved root or formed word." if sense["sense_id"] in merged_ids | moved_ids
            else "Keep this meaning unlinked until its distinct use is demonstrated." if sense["sense_id"] in hold_ids
            else "Already linked in the app." if sense["sense_id"] in creator_decisions
            else "Link this existing sentence to this meaning after review." if call == "Likely match"
            else "Keep the meaning; inspect more sentences or write a focused example later." if call == "No direct match selected"
            else "Use only for the part of the meaning it actually shows." if call == "Partial match"
            else "Do not count this as a direct example; it shows a related form." if call == "Related form only"
            else "Settle the meaning or grammatical role before assigning the example."
        ),
        "creator_decision": creator_decisions.get(sense["sense_id"], ""),
        "application_status": "Merged" if sense["sense_id"] in merged_ids else "Moved to formed word" if sense["sense_id"] in moved_ids else "On hold" if sense["sense_id"] in hold_ids else "Applied" if sense["sense_id"] in creator_decisions else "Awaiting review",
    })

output = HERE / "unassigned_first_50_for_review.csv"
with output.open("w", newline="", encoding="utf-8") as handle:
    writer = csv.DictWriter(handle, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)

all_examples = [row for row in examples if row["headword_id"] in {sense["headword"].lower() for sense in inventory}
                and row["section"] == "direct" and row["display_kind"] == "sentence"]
pool = HERE / "unassigned_first_50_page_sentences.csv"
with pool.open("w", newline="", encoding="utf-8") as handle:
    fields = ["headword_id", "entry_id", "celan_text", "translation", "sense_id", "display_kind"]
    writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore", lineterminator="\n")
    writer.writeheader()
    writer.writerows(all_examples)

page = HERE / "unassigned_first_50_for_review.md"
lines = [
    "# First 50 meanings for your review",
    "",
    "These were the first 50 meanings selected after the eight-word correction batch, in the order of the original 181-meaning inventory. They cover 22 words. The creator has now reviewed all 50. Approved matches are linked; duplicate or wrongly placed meanings were merged or moved; distinct uses marked hold remain unassigned.",
    "",
    "For each meaning, I selected one existing sentence when I found a useful lead. A lead is not proof that every word and translation in the sentence is accurate. An empty lead does **not** prove that no suitable sentence exists. The [CSV review sheet](unassigned_first_50_for_review.csv) has a blank decision column, and the [complete page-sentence pool](unassigned_first_50_page_sentences.csv) has all 2,108 current ordinary sentence placements under these 22 words.",
    "",
    "**Review status:** the creator's decisions are recorded beside each item. The proposed hold examples are leads only; they were not published. See [decision record 03](unassigned_first_50_decisions_03.md) for the complete latest review and exact app actions.",
    "",
]
last_word = None
for row in rows:
    if row["headword"] != last_word:
        last_word = row["headword"]
        lines += [f"## {last_word}", ""]
    lines.append(f"**{row['number']}. {row['word_type']} — {row['current_meaning']}**")
    if row["review_example_id"]:
        lines.append(f"- Existing sentence: `{row['review_example_celan']}` — “{row['review_example_english']}” ({row['review_example_id']})")
    else:
        lines.append("- Existing sentence selected for this meaning: none yet.")
    lines.append(f"- My provisional call: **{row['provisional_call']}**. {row['reason_or_question']}")
    lines.append(f"- Suggested next step: {row['suggested_next_step']}")
    if row["creator_decision"]:
        lines.append(f"- **Your decision:** {row['creator_decision']} **Status:** {row['application_status']}.")
    lines.append("")
page.write_text("\n".join(lines) + "\n", encoding="utf-8")

print(f"Wrote {len(rows)} meanings and {len(all_examples)} page sentence placements")
