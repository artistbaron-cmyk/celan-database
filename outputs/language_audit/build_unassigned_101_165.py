"""Prepare review leads for historical inventory items 101–165; do not edit app data."""

import csv
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


# Existing example ID, plain-English assessment, proposed review action.
# A lead is not a claim that every detail of the sentence has been linguistically certified.
LEADS = {
    101: ("PE-V3-0058", "This sentence calls Lianor ‘Sir’; the other four page sentences use it for thought.", "Link only if Sir remains a distinct intended meaning."),
    102: ("", "The page shows kel as text, word, or naming; none clearly uses it as an informal speaking verb.", "Keep unlinked; decide whether this verb use is current."),
    103: ("PE-PFM1-0001", "The elder names a timeline, but kel is the verb in that sentence, not a noun meaning name.", "Do not link this to the noun; find or write a noun example if intended."),
    104: ("PE-HLPS1-0008", "‘I notice humor in the words’ uses kel for words.", "Propose linking to Word."),
    105: ("PE-SCP1-0001", "‘The text is on the writing tablet’ uses kel for a written text.", "Propose linking to Text."),
    106: ("PE-V4-0003", "‘I might go’ shows rethlian marking possibility after the clause.", "Propose linking to the modal; review whether the separate particle label describes another use."),
    107: ("PE-V3-0013", "‘Maybe, I will go’ uses Rethlian as a separate spoken response.", "Propose linking to the interjection."),
    108: ("PE-V4-0003", "The same ‘I might go’ sentence could also be called a particle use; the page does not show a distinct particle construction.", "Decide whether Modal and Particle are two roles or duplicate labels."),
    109: ("PE-V4-0068", "‘The ancient tree is old’ plainly shows the tree meaning.", "Propose linking to Ancient Tree."),
    110: ("PE-V3-0050", "‘The honorary elder moves lightly’ plainly shows the person meaning.", "Propose linking to Honorary Elder."),
    111: ("PE-V3-0057", "‘We hope in the dawn’ is already linked to this meaning.", "Already settled; leave in place."),
    112: ("PE-V4-0053", "‘I see the pack hunter’ uses shalaen for seeing.", "Propose linking to See / Perceive."),
    113: ("PE-V3-0099", "‘The oasis blessing speaks to the water’ names the blessing, but personifies it and does not clearly show the ceremony as an event.", "Hold for a clearer ceremony sentence or confirm this illustrative use."),
    114: ("PE-V4-0106", "‘I go to the sacred Spring’ directly names a place.", "Propose linking to Sacred spring."),
    115: ("PE-V3-0203", "‘Tenar unar’ means eleven, so it contains ten, but it is a number expression rather than an ordinary sentence.", "Use as a number illustration if that category is acceptable; do not label it a sentence."),
    116: ("PE-GMMP1-0036", "‘The practitioner shapes radiance’ uses tenar as the radiance object.", "Propose linking to Radiance."),
    117: ("PE-V4-0001", "‘I can speak’ shows the ability use.", "Propose linking to Modal; review item 118 as a possible duplicate role."),
    118: ("PE-V4-0001", "The same sentence shows ability, but does not clearly show a separate verb use apart from the modal.", "Decide whether Verb is a distinct established use or duplicate labeling."),
    119: ("PE-NE1-0074", "‘The wind bearing is reliable’ clearly uses lianeth as an adjective.", "Propose linking to Reliable."),
    120: ("PE-V4-0004", "‘I want to go’ is already linked to this modal meaning.", "Already settled; leave in place."),
    121: ("", "The sole page sentence uses thar-ka as ‘want to,’ not as a noun for desire.", "Keep unlinked until a noun use is shown, or decide if noun is needed."),
    122: ("PE-ER2-0032", "‘I give currency to the merchant’ directly uses shen as money.", "Propose linking to Coinage."),
    123: ("PE-V4-0091", "‘Five measures of grain’ uses shen for a measure, but does not establish a precise weight.", "Propose linking as a measure example; retain the unit definition only to the extent already established."),
    124: ("PE-HTS1-0027", "‘The healer measures the dose’ uses shen as the measuring verb.", "Propose linking to the verb."),
    125: ("", "The two page sentences use kor for center; neither shows source or strength.", "Keep unlinked and review whether this meaning is still intended."),
    126: ("", "The two page sentences use kor for center; neither gives a handspan measurement.", "Keep unlinked pending a measurement example."),
    127: ("PE-SRD1-0006", "‘I put the cargo in the center’ directly uses kor for the middle.", "Propose linking to Center."),
    128: ("", "None of the three page sentences uses pral for a table.", "Keep unlinked; check whether the table word is another form."),
    129: ("PE-ICAES1-0050", "‘Before working’ may use pral as an action, but does not say make.", "Do not link without confirming this verb meaning."),
    130: ("PE-ER2-0034", "‘I notice detail on the hammer’ directly uses pral for detail.", "Propose linking to Detail."),
    131: ("PE-WRT1-0028", "‘Ownership of the vehicle passes to the friend’ uses shan for transfer, with no ‘through’ location.", "Propose linking to the passing/transfer use."),
    132: ("PE-CNE1-0071", "‘I go through the door’ directly uses shan as the preposition.", "Propose linking to Through / Across."),
    133: ("PE-PFM1-0071", "‘The anomaly reading is high’ shows the reading, but does not distinguish the Measure label from Noun.", "Decide whether this is a measured-value subtype or a separate word type."),
    134: ("PE-PFM1-0072", "‘The elder checks the anomaly reading’ shows the same object as item 133.", "Propose a single meaning unless Measure and Noun have distinct functions."),
    135: ("PE-PFM1-0073", "‘The caravan waits at the safe distance’ shows the distance, but not a separate Measure role.", "Decide whether Measure and Noun are truly distinct here."),
    136: ("PE-PFM1-0074", "‘The guardian marks the safe distance’ shows the same distance as item 135.", "Propose one meaning unless separate roles are established."),
    137: ("PE-PFM1-0074", "‘The guardian marks the safe distance’ shows marking a location or boundary.", "Propose linking to Mark a location."),
    138: ("PE-SCP1-0008", "‘The record keeper inscribes the identity record on slate’ shows writing on a surface.", "Propose linking to Write / Inscriptions."),
    139: ("PE-SCP1-0013", "‘There is corruption in the government’ shows social or institutional corruption.", "Propose linking to this meaning."),
    140: ("PE-FAP2-0053", "‘There is rot in the storage jar’ shows organic spoilage.", "Propose linking to Rot."),
    141: ("PE-TVO1-0041", "‘I board the train’ shows a person entering transport.", "Propose linking to Board."),
    142: ("PE-SCP1-0003", "‘The operator loads cargo into the wagon’ shows goods being loaded.", "Propose linking to Load cargo."),
    143: ("PE-TVO1-0043", "‘I disembark from the train’ shows a person leaving transport.", "Propose linking to Disembark."),
    144: ("PE-SCP1-0005", "‘The operator unloads cargo from the wagon’ shows goods being removed.", "Propose linking to Unload cargo."),
    145: ("PE-TVO1-0050", "‘The speed is displayed on the gauge’ names a measured rate, but does not distinguish Measure from Noun.", "Decide whether the Measure label adds a distinct use."),
    146: ("PE-TVO1-0049", "‘The driver notices the speed’ shows the same speed meaning as item 145.", "Propose one meaning unless Measure and Noun are distinct roles."),
    147: ("PE-SCP1-0009", "‘The council is a bridge between the clan and government’ is figurative.", "Propose linking to the people/systems bridge."),
    148: ("PE-BSPI1-0044", "‘The bridge is above the water’ describes a physical bridge.", "Propose linking to the structural bridge."),
    149: ("PE-SCP1-0011", "‘There is clarity in my thought’ shows mental clarity.", "Propose linking to the mental meaning."),
    150: ("PE-SCP1-0015", "‘The water is clear’ shows physical clarity; the Celan uses the noun sel in a locative construction.", "Propose linking to physical clarity, with translation reviewed for naturalness."),
    151: ("PE-PSAC1-0008", "‘The dancer follows the rhythm of the music’ shows a recurring beat.", "Propose linking to Rhythm."),
    152: ("", "The page sentences use thael as a noun for rhythm; none clearly uses it as an adjective for gentle motion.", "Keep unlinked; decide whether this adjective use is current."),
    153: ("PE-DR2-0005", "‘Um, I wait’ shows a spoken hesitation.", "Propose linking to the interjection."),
    154: ("PE-DR2-0005", "The same ‘Um’ could be called a particle, but the page gives no distinct particle construction.", "Decide whether this is a separate grammatical role or a duplicate label."),
    155: ("PE-DR2-0008", "‘The money is gone’ shows vrak after the noun as a description.", "Propose linking to the adjective for Gone; Dry needs separate evidence."),
    156: ("PE-DR2-0008", "The same sentence does not distinguish a separate particle from the adjective.", "Decide whether the particle label marks an established distinct use."),
    157: ("", "All 15 page sentences use vanesh for trading action or a traded item; none clearly uses it as a noun meaning commerce.", "Keep unlinked until a noun use is found or composed."),
    158: ("PE-OC1-0026", "‘The merchant trades during the war’ clearly uses vanesh as a verb.", "Propose linking to Trade."),
    159: ("PE-EGE1-0059", "‘Plant blight surges through the field’ uses jor as the action.", "Propose linking to Surge."),
    160: ("PE-ER2-0053", "‘The wagon carries the harvest’ uses bren as a noun.", "Propose linking to Harvest."),
    161: ("PE-FAP1-0018", "‘The farmer harvests the orchard’ uses bren as the verb.", "Propose linking to Harvest / Gather."),
    162: ("PE-ER2-0056", "‘A cover is over the building’ uses xar as a noun.", "Propose linking to Cover; this sentence does not establish Shadow separately."),
    163: ("PE-EGE1-0028", "‘The patrol closes the route’ uses xar as a verb.", "Propose linking to Close off; other verb shades may need their own examples."),
    164: ("PE-V4-0009", "‘The tunic was made’ demonstrates passive nor-ka.", "Propose linking to the passive particle."),
    165: ("PE-V4-0105", "‘In this moment’ shows the present-time use of nor-ka.", "Propose linking to Now / In this moment; retain the passive use separately."),
}

old_batch_words = {"Aenor", "Vok", "Thalesh", "Thalor", "Morldren", "Xarvel", "Kar", "Shentalzhael"}
inventory = [row for row in read(HERE / "unassigned_meanings_181.csv") if row["headword"] not in old_batch_words]
selected = inventory[100:]
assert len(selected) == 65 and set(LEADS) == set(range(101, 166))

current_senses = {row["sense_id"]: row for row in read(APP / "dictionary_senses.csv")}
examples = read(APP / "dictionary_examples.csv")
direct = {(row["headword_id"], row["entry_id"]): row for row in examples if row["section"] == "direct"}
by_sense = defaultdict(list)
for row in examples:
    if row["section"] == "direct" and row["sense_id"]:
        by_sense[row["sense_id"]].append(row["entry_id"])

rows = []
for number, old in enumerate(selected, 101):
    current = current_senses[old["sense_id"]]
    example_id, issue, proposal = LEADS[number]
    example = direct.get((old["headword"].lower(), example_id)) if example_id else None
    assert not example_id or example, (number, old["headword"], example_id)
    linked = by_sense[old["sense_id"]]
    status = "Already settled" if linked else "For creator review"
    rows.append({
        "number": number,
        "headword": old["headword"],
        "sense_id": old["sense_id"],
        "word_type": current["word_type"],
        "current_meaning": current["meaning"],
        "current_usage_note": current["usage_note"],
        "existing_example_id": example_id,
        "existing_celan": example["celan_text"] if example else "",
        "existing_english": example["translation"] if example else "",
        "already_linked_example_ids": "; ".join(linked),
        "problem_or_evidence": issue,
        "recommendation": proposal,
        "decision_needed": "None; already applied." if linked else f"Do you approve this action: {proposal}",
        "status": status,
    })

with (HERE / "unassigned_101_165_for_review.csv").open("w", newline="", encoding="utf-8") as handle:
    writer = csv.DictWriter(handle, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)

words = {row["headword"].lower() for row in rows}
page_examples = [row for row in examples if row["headword_id"] in words and row["section"] == "direct" and row["display_kind"] == "sentence"]
with (HERE / "unassigned_101_165_page_sentences.csv").open("w", newline="", encoding="utf-8") as handle:
    fields = ["headword_id", "entry_id", "celan_text", "translation", "sense_id", "display_kind"]
    writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore", lineterminator="\n")
    writer.writeheader()
    writer.writerows(page_examples)

lines = [
    "# Meanings 101–165 for review",
    "",
    "This finishes the numbered historical list after 1–100. It covers **65 meanings on 30 word pages**. Numbers are references to the original review inventory; they are not a count of current errors. The app data was read on 2026-10-05. **No app content was changed for this review.**",
    "",
    "Items **111** (Shalaen ‘hope’) and **120** (Thar-ka ‘want to’) already have their approved sentences linked. The other **63** need review before any change. An existing page sentence is a possible lead, not a proof that the whole meaning or sentence is correct. A blank lead means none of the page sentences plainly showed that use.",
    "",
    "[Complete CSV review sheet](unassigned_101_165_for_review.csv) · [All current direct page sentences for these words](unassigned_101_165_page_sentences.csv)",
    "",
    "## What needs a meaning or word-type decision",
    "",
    "- **102–103 Kel:** No clear page sentence for informal ‘say/talk’ or the noun ‘name’. The existing ‘elder names the timeline’ sentence uses *kel* as a verb.",
    "- **106–108 Rethlian; 117–118 Lianeth; 153–154 Em; 155–156 Vrak:** A sentence illustrates the form, but does not establish two distinct word types. Decide whether each pair is intentional.",
    "- **113 Drenkorath:** The blessing ‘speaks’ in a personified sentence. It does not plainly describe a ceremony taking place.",
    "- **115 Tenar:** The available ten example is a number expression, not a sentence.",
    "- **121 Thar-ka; 125–126 Kor; 128–129 Pral; 152 Thael; 157 Vanesh:** No clear current page sentence shows the particular noun, verb, or adjective use requested.",
    "- **133–136 Lianrethshen and Vaarshen; 145–146 Jorvar:** Measure and Noun have the same wording. The examples show the thing measured, but do not distinguish two grammatical uses.",
    "- **162 Xar:** The cover example shows ‘cover’; it does not by itself show ‘shadow.’",
    "",
    "## Item-by-item review",
    "",
]
for row in rows:
    lines.extend([
        f"### {row['number']}. {row['headword']} — {row['word_type']}: {row['current_meaning']}",
        "",
        f"**Current page sentence:** {row['existing_celan']} — “{row['existing_english']}” ({row['existing_example_id']})." if row["existing_example_id"] else "**Current page sentence:** None clearly matches this meaning.",
        "",
        f"**What I found:** {row['problem_or_evidence']}",
        "",
        f"**Recommendation:** {row['recommendation']}",
        "",
        f"**Decision:** {row['decision_needed']} **Status:** {row['status']}.",
        "",
    ])
(HERE / "unassigned_101_165_for_review.md").write_text("\n".join(lines), encoding="utf-8")
print(f"Prepared {len(rows)} meaning rows on {len(words)} pages; {len(page_examples)} current direct sentences; {sum(bool(r['already_linked_example_ids']) for r in rows)} already settled.")
