"""Prepare a read-only meaning review for historical inventory items 51–100.

The selected examples are review leads, never automatic sense assignments.
"""

import csv
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


# (existing example ID, call, reason, recommendation, exact decision requested)
REVIEW = {
    "kal-s1": ("PE-ER2-0074", "Clear example lead", "Kal names strength in the hammer.", "Link this sentence to the noun.", "Approve this link?"),
    "kal-s2": ("", "No clear example selected", "The inspected Kal sentences use kal as strength or strengthen; none clearly uses standalone kal to mean strong.", "Keep the adjective meaning separate while its use is checked.", "Does standalone kal mean strong, and what sentence shows it?"),
    "kal-s3": ("PE-FAP1-0001", "Clear example lead", "Kal is the strengthening action in the farming sentence.", "Link this sentence to the verb.", "Approve this link?"),
    "kalor-s1": ("PE-V3-0110", "Possible example", "Go in strength and balance fits courage or strength of spirit, but does not name courage explicitly.", "Keep the two Kalor definitions separate for now.", "Does this sentence show courage, and is that distinct from item 55?"),
    "kalor-s2": ("PE-V3-0110", "Possible duplicate", "The same sentence could fit both Kalor definitions; the difference is not clear from the current page.", "Consider one meaning if these are the same idea.", "Are items 54 and 55 separate meanings or one?"),
    "seren-s1": ("PE-ER2-0029", "Clear example lead", "Seren is the guardian who defends the fortress.", "Link this sentence to the guardian noun.", "Approve the link and consider merging item 57?"),
    "seren-s2": ("PE-ER2-0029", "Likely duplicate", "Guardian / Protector and Guardian/Protector say the same thing.", "Merge into one meaning if you agree.", "May I merge item 57 into item 56?"),
    "vaar-s1": ("PE-S3-0014", "Clear example lead", "Vaar is peace in I go in peace.", "Link this sentence to the noun.", "Approve this link?"),
    "vaar-s2": ("", "No clear example selected", "The page uses vaar as peace or peaceful; it does not plainly say good.", "Keep good unlinked until shown directly.", "Does standalone vaar also mean good?"),
    "vaar-s3": ("", "No clear example selected", "None of the ten current sentences uses vaar as a spoken Phew!", "Keep the interjection unlinked until shown directly.", "Is Phew! an active Vaar use?"),
    "lorin-s1": ("PE-CNE1-0028", "Clear example lead", "Lorin is the guide who states the choice.", "Link to the guide noun.", "Approve this link?"),
    "lorin-s2": ("PE-CNE1-0028", "Possible overlap", "This shows guide. It does not demonstrate teacher as an additional role.", "Decide whether teacher is part of the same meaning or a separate use needing an example.", "Are items 61 and 62 one meaning?"),
    "lorin-s3": ("PE-ER2-0026", "Clear example lead", "Lorin is the action guides in Time guides my path.", "Link to the verb.", "Approve this link?"),
    "rath-s1": ("PE-V2-0037", "Clear example lead", "Rath is the enemy in Charge the enemy!", "Link to the enemy noun.", "Approve this link?"),
    "rath-s2": ("PE-V3-0028", "Clear example lead", "Rath introduces the if clause.", "Link to the conditional particle if these two definitions are consolidated.", "Approve the example and merge items 65–66?"),
    "rath-s3": ("PE-V3-0028", "Likely duplicate", "Conditional If and Conditional marker: if describe the same function.", "Merge into one if meaning if you agree.", "May I merge item 66 into item 65?"),
    "fah-s1": ("PE-V3-0060", "Partial example", "This shows darkness. It does not by itself show fear or night.", "Link only as an illustration of darkness; keep the broader wording for review.", "Does Fah also independently mean fear and night?"),
    "fah-s2": ("", "No clear example selected", "None of the three current sentences uses Fah as a spoken Ugh! or Bah!", "Keep the interjection unlinked.", "Is this interjection current Celan?"),
    "reth-s1": ("PE-ICAES1-0057", "Clear example lead", "Reth is uncertainty caused in the information.", "Link to the noun; the sentence shows uncertainty specifically.", "Approve this link?"),
    "reth-s2": ("PE-V4-0083", "Clear example lead", "Reth joins water or comfort drink.", "Link to the conjunction.", "Approve this link?"),
    "dral-s1": ("PE-V3-0064", "Partial example", "Dral means heavens here. The sentence does not show wonder as a separate noun meaning.", "Link for heavens only and review the broader wording.", "Does Dral independently mean wonder?"),
    "dral-s2": ("", "No clear example selected", "Neither current sentence uses Dral as the spoken exclamation Wow! or Heavens!", "Keep the interjection unlinked.", "Is this interjection current Celan?"),
    "tal-s1": ("PE-V2-0044", "Clear example lead", "Tal is give in We give an offering with peace.", "Link to Give / Offer.", "Approve this link?"),
    "tal-s2": ("PE-NE1-0033", "Clear example lead", "Tal is take in I take the herbal remedy.", "Link to Take / Receive.", "Approve this link?"),
    "lun-s1": ("PE-FAP1-0025", "Clear example lead", "Lun is the lake holding the aquatic creature.", "Link to lake.", "Approve this link?"),
    "lun-s3": ("PE-LPC1-0001", "Clear example lead", "Capitalized Lun is the Moon in the sky.", "Link to moon.", "Approve this link?"),
    "kaleth-s1": ("PE-SP2-0004", "Clear example lead", "Kaleth is the old fortress.", "Link to fortress.", "Approve this link?"),
    "kaleth-s2": ("PE-TM1-0003", "Clear example lead", "Kaleth describes the machine as powerful.", "Link to the adjective; other uses such as high readings need separate review.", "Approve this link for powerful?"),
    "krezor-s1": ("PE-TM1-0020", "Possible duplicate", "Forge is already included in items 80 and 81.", "Consider one forge meaning and keep hearth as an additional use if intended.", "May I merge item 79 with the forge meaning?"),
    "krezor-s2": ("PE-TM1-0020", "Possible duplicate", "Forge / Place of Fire overlaps both other Krezor definitions.", "Decide whether this is a single place-of-fire meaning or distinct from hearth.", "How should items 79–81 be divided?"),
    "krezor-s3": ("PE-V4-0023", "Clear example lead", "The sentence clearly calls Krezor a hearth.", "Link to the hearth use; retain forge only if it is also intended.", "Approve the hearth link and the division among 79–81?"),
    "phelvin-s1": ("PE-V4-0059", "Clear example lead", "Phelvin is the comforting drink that you drink.", "Link one drink meaning.", "Approve the link and merge item 83?"),
    "phelvin-s2": ("PE-V4-0059", "Likely duplicate", "Comforting drink and Comfort Drink name the same thing.", "Merge into one meaning if you agree.", "May I merge item 83 into item 82?"),
    "jorvak-s1": ("PE-V2-0057", "Clear example lead", "The English explicitly calls Jorvak a bursting stew.", "Link to the stew meaning.", "Approve this link?"),
    "jorvak-s2": ("PE-V2-0019", "Meaning question", "Another sentence translates Jorvak as warmth. The two translations suggest different things.", "Keep both meanings until you decide whether this is a stew, warmth, or both.", "Does Jorvak independently mean bursting warmth?"),
    "welrim-s1": ("", "No clear example selected", "The current sentences show a feast; none makes its continuous duration clear.", "Keep continuous feast unlinked until its distinct meaning is shown.", "Does continuous describe a distinct Welrim meaning?"),
    "welrim-s2": ("PE-V2-0023", "Clear example lead", "The sentence says the feast is shared with friends.", "Link to shared feast.", "Approve this link?"),
    "xilvar-s1": ("PE-V2-0027", "Partial example", "The English calls Xilvar hidden spice, but the sentence alone does not show what is hidden about it.", "Link only if the existing meaning note supplies that context.", "Approve this illustration of hidden spice?"),
    "xilvar-s2": ("PE-V2-0065", "Meaning question", "The same Celan word is translated salt here and hidden spice elsewhere.", "Keep the two established meanings visible while checking whether both are intended.", "Is Fragmented Salt a distinct Xilvar meaning?"),
    "belshara-s1": ("", "No clear example selected", "None of the five direct sentences describes a coordinated troop maneuver or tactical path.", "Leave this meaning without a direct example until a suitable sentence is found.", "Is this tactical meaning still current?"),
    "belshara-s2": ("PE-ER2-0012", "Clear example lead", "Belshara is duty guiding us.", "Link to Duty.", "Approve this link?"),
    "belshara-s3": ("PE-V4-0002", "Clear example lead", "Var I belshara is translated I must go, showing the modal use.", "Link to Must / Have to.", "Approve this link?"),
    "belshara-s4": ("PE-V4-0072", "Clear example lead", "Belshara is duty or obligation with us in this sentence.", "Link to the necessity noun if distinct from Duty.", "Is item 93 a distinct noun meaning from item 91?"),
    "felorin-s1": ("", "No clear example selected", "The three current berry sentences do not mention a coral reef.", "Keep this specific origin unlinked pending an example or clarification.", "Are Felorin specifically reef berries?"),
    "felorin-s2": ("PE-V2-0084", "Clear example lead", "Felorin are berries by the water.", "Link to berry / small fruit.", "Approve this link?"),
    "zhelvek-s1": ("PE-V2-0077", "Clear example lead", "The English calls Zhelvek an energy bar.", "Link to the food meaning.", "Approve this link?"),
    "zhelvek-s2": ("PE-CNE1-0014", "Clear example lead", "The mechanic turns an energy carrier, a different object from a snack bar.", "Link to the device meaning.", "Approve this distinct use?"),
    "eshvelaneth-s1": ("PE-V2-0122", "Clear example lead", "The English calls Eshvelaneth a hailstorm striking the mountain.", "Link to hailstorm.", "Approve this link?"),
    "eshvelaneth-s2": ("PE-V3-0098", "Partial example", "The English says snowstorm guidance passes to the family; it does not explicitly identify a ritual.", "Keep the ritual meaning visible while its wording and example are reviewed.", "Is Snowstorm Guidance Ritual the intended second meaning?"),
    "lianor-s1": ("PE-V4-0074", "Clear example lead", "Lianor-ya is your thought in You speak your thought.", "Link to idea / thought; its place of truth gloss needs no proof from this sentence.", "Approve this link?"),
}

CREATOR_DECISIONS = {
    "kal-s1": ("Approved: kal is the standalone noun strength in the hammer sentence.", "Applied"),
    "kal-s2": ("Remove the standalone adjective Strong from Kal; Kaleth carries strong/powerful.", "Removed from current app"),
    "kal-s3": ("Approved: kal is the verb strengthens in Farming strengthens the family.", "Applied"),
    "kalor-s1": ("Merge 54–55 as one noun: courage / strength of spirit / willpower. Use Go in strength and balance!", "Applied"),
    "kalor-s2": ("Merge into item 54; preserve the old wording in the audit archive.", "Merged"),
    "seren-s1": ("Keep one guardian / protector noun and use The Respected Guardian defends the fortress.", "Applied"),
    "seren-s2": ("Exact duplicate of item 56; merge it into that noun.", "Merged"),
    "vaar-s1": ("Approved noun wording Peace / Unity / Calm and I go in peace.", "Applied"),
    "vaar-s2": ("Remove the standalone adjective Good from Vaar; Vaareth carries good/peaceful.", "Removed from current app"),
    "vaar-s3": ("Keep the interjection visible but unlinked; Vaar'a! already exists as an approved expression, while no dictionary sentence is linked here.", "On hold"),
    "lorin-s1": ("Merge the two guide nouns as Guide / Mentor and link the guide-states-the-choice sentence.", "Applied"),
    "lorin-s2": ("Merge into item 61; teacher is not retained as a separate Lorin meaning.", "Merged"),
    "lorin-s3": ("Link Time guides my path to the verb to guide.", "Applied"),
    "rath-s1": ("Link Charge the enemy! to the enemy noun.", "Applied"),
    "rath-s2": ("Merge the two conditional-if meanings and link the water/coinage conditional.", "Applied"),
    "rath-s3": ("Duplicate if meaning merged into item 65.", "Merged"),
    "fah-s1": ("Focus the noun on Darkness / The Void and link They hate the darkness. Night as a time period is distinct.", "Applied"),
    "fah-s2": ("Keep Ugh! / Bah! visible without a linked sentence until a dialogue example is reviewed.", "On hold"),
    "reth-s1": ("Keep uncertainty, confusion, and doubt as the noun; link the signal-interference sentence.", "Applied"),
    "reth-s2": ("Link the water-or-comfort-drink question to the conjunction or.", "Applied"),
    "dral-s1": ("Remove noun wonder; lowercase dral is physical sky and capitalized Dral is the heavens. Link We wonder at the heavens to the capitalized use.", "Applied"),
    "dral-s2": ("Keep Wow! / Heavens! visible without a linked sentence until dialogue is reviewed.", "On hold"),
    "tal-s1": ("Link We give an offering with peace to Give / Offer.", "Applied"),
    "tal-s2": ("Link I take the herbal remedy to Take / Receive.", "Applied"),
    "lun-s1": ("Link The aquatic creature is in the lake to lake.", "Applied"),
    "lun-s3": ("Link The Moon is in the sky to capitalized Lun, the Moon.", "Applied"),
    "kaleth-s1": ("Link The village is at the old fortress to fortress.", "Applied"),
    "kaleth-s2": ("Link The machine is powerful to the adjective; the larger range remains in its established meaning.", "Applied"),
    "krezor-s1": ("Merge 79–80 into Forge / Place of Fire; link The tongs are at the forge.", "Applied"),
    "krezor-s2": ("Duplicate forge meaning merged into item 79.", "Merged"),
    "krezor-s3": ("Keep Hearth / Fireplace distinct and link The hearth is hot.", "Applied"),
    "phelvin-s1": ("Merge the two drink nouns as Comforting drink / warm herbal beverage; link You drink the comforting drink.", "Applied"),
    "phelvin-s2": ("Duplicate drink meaning merged into item 82.", "Merged"),
    "jorvak-s1": ("Link The bursting stew is shared by the water to the concrete dish.", "Applied"),
    "jorvak-s2": ("Bursting warmth was an old figurative translation, not a current dictionary meaning. Archived the sense and all student placements of its old sentence.", "Archived"),
    "welrim-s1": ("Continuous feast was an unneeded old definition. Archived it; shared feast remains current.", "Archived"),
    "welrim-s2": ("Link The feast is shared with friends and water to Shared feast / communal banquet.", "Applied"),
    "xilvar-s1": ("Keep Hidden spice / secret seasoning blend and link The hidden spice rests by the water.", "Applied"),
    "xilvar-s2": ("Fragmented Salt was an older loose gloss. Archived the sense and all student placements of its old salt sentence.", "Archived"),
    "belshara-s1": ("Tactical maneuver was a superseded draft meaning. Archived it; duty and the must modal remain current.", "Archived"),
    "belshara-s2": ("Merge Duty and Obligation as one noun; link both duty sentences.", "Applied"),
    "belshara-s3": ("Link I must go to the modal Must / Have to.", "Applied"),
    "belshara-s4": ("Necessity / Obligation noun merged into item 91.", "Merged"),
    "felorin-s1": ("Keep the reef-specific meaning unlinked; current sentences do not mention reefs.", "On hold"),
    "felorin-s2": ("Link The berries rest by the water to Berry / Small Fruit.", "Applied"),
    "zhelvek-s1": ("Link the energy-bar sentence to the food use; retain the separate engineering use.", "Applied"),
    "zhelvek-s2": ("Link the mechanic sentence to Energy carrier / power cell.", "Applied"),
    "eshvelaneth-s1": ("Link The hailstorm strikes the mountain to hailstorm.", "Applied"),
    "eshvelaneth-s2": ("Keep the Nivveilian snowstorm-guidance ritual as a distinct cultural sense and link the existing family sentence.", "Applied"),
    "lianor-s1": ("Keep Idea / Thought as the noun; word origin stays in the usage note. Link You speak your thought.", "Applied"),
}

CURRENT_LABELS = {
    "kal-s2": "Retired: Strong (standalone adjective)",
    "kalor-s1": "Courage / Strength of Spirit / Willpower",
    "kalor-s2": "Merged: Strength (of the mind or spirit)",
    "seren-s2": "Merged: Guardian/Protector",
    "vaar-s1": "Peace / Unity / Calm",
    "vaar-s2": "Retired: Good (standalone adjective)",
    "lorin-s1": "Guide / Mentor",
    "lorin-s2": "Merged: Guide / Teacher",
    "rath-s2": "Conditional: if",
    "rath-s3": "Merged: Conditional marker: if",
    "fah-s1": "Darkness / The Void",
    "reth-s1": "Uncertainty / Confusion / Doubt",
    "dral-s1": "Sky / Heavens / Celestial Expanse",
    "krezor-s1": "Forge / Place of Fire",
    "krezor-s2": "Merged: Forge / Place of Fire",
    "krezor-s3": "Hearth / Fireplace",
    "phelvin-s1": "Comforting drink / warm herbal beverage",
    "phelvin-s2": "Merged: Comfort Drink",
    "jorvak-s2": "Archived: Bursting warmth",
    "welrim-s1": "Archived: Continuous Feast",
    "welrim-s2": "Shared feast / communal banquet",
    "xilvar-s1": "Hidden spice / secret seasoning blend",
    "xilvar-s2": "Archived: Fragmented Salt",
    "belshara-s1": "Archived: Coordinated Maneuver / Tactical Path",
    "belshara-s2": "Duty / Obligation (Bound Path)",
    "belshara-s3": "Must / Have to",
    "belshara-s4": "Merged: Necessity / Obligation",
    "zhelvek-s1": "Energy bar / dense food ration",
    "zhelvek-s2": "Energy carrier / power cell",
    "lianor-s1": "Idea / Thought",
}

old_batch_words = {"Aenor", "Vok", "Thalesh", "Thalor", "Morldren", "Xarvel", "Kar", "Shentalzhael"}
inventory = [row for row in read(HERE / "unassigned_meanings_181.csv") if row["headword"] not in old_batch_words]
selected = inventory[50:100]
assert len(selected) == 50
assert {row["sense_id"] for row in selected} == set(REVIEW)

examples = read(APP / "dictionary_examples.csv")
direct = {(row["headword_id"], row["entry_id"]): row for row in examples if row["section"] == "direct"}
archived = read(HERE / "unassigned_85_89_legacy_sentence_placements.csv")
archived_direct = {(row["headword_id"], row["entry_id"]): row for row in archived if row["section"] == "direct"}
words = {row["headword"].lower() for row in selected}
page_examples = [row for row in examples if row["headword_id"] in words and row["section"] == "direct" and row["display_kind"] == "sentence"]

rows = []
for number, sense in enumerate(selected, 51):
    example_id, call, reason, recommendation, decision = REVIEW[sense["sense_id"]]
    example = direct.get((sense["headword"].lower(), example_id)) if example_id else None
    example_status = "current" if example else ""
    if example_id and not example:
        example = archived_direct.get((sense["headword"].lower(), example_id))
        example_status = "archived" if example else ""
    assert not example_id or (example and example["display_kind"] == "sentence"), (sense["sense_id"], example_id)
    rows.append({
        "number": number,
        "headword": sense["headword"],
        "sense_id": sense["sense_id"],
        "word_type": sense["word_type"],
        "current_meaning": CURRENT_LABELS.get(sense["sense_id"], sense["meaning"]),
        "existing_example_id": example_id,
        "existing_celan": example["celan_text"] if example else "",
        "existing_english": example["translation"] if example else "",
        "example_status": example_status,
        "review_call": call,
        "why": reason,
        "recommendation": recommendation,
        "decision_needed": decision,
        "creator_decision": CREATOR_DECISIONS.get(sense["sense_id"], ("", ""))[0],
        "status": CREATOR_DECISIONS.get(sense["sense_id"], ("", "Awaiting creator review"))[1],
    })

csv_path = HERE / "unassigned_51_100_for_review.csv"
with csv_path.open("w", newline="", encoding="utf-8") as handle:
    writer = csv.DictWriter(handle, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)

pool_path = HERE / "unassigned_51_100_page_sentences.csv"
with pool_path.open("w", newline="", encoding="utf-8") as handle:
    fields = ["headword_id", "entry_id", "celan_text", "translation", "sense_id", "display_kind"]
    writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore", lineterminator="\n")
    writer.writeheader()
    writer.writerows(page_examples)

lines = [
    "# Meanings 51–100 for your review",
    "",
    "This continues the original 181-meaning review after items 1–50, skipping the eight words already handled in the earlier correction batch. These are **50 meanings on 22 word pages**. They are historical inventory numbers, not a claim that 100 problems remain today.",
    "",
    "I first checked the app data for each meaning and the ordinary sentences on its page. The sentence shown was the review lead; the creator decision and status now say whether it became a linked example, remained unlinked, or was archived. A sentence link is not a certification of every translation on its page. A blank lead means I found no clear match among the inspected page sentences; it does not prove that no suitable sentence exists elsewhere.",
    "",
    "**Review status:** The creator has decided all items 51–100. Approved matches and merges have been applied. Superseded meanings at 85, 86, 89, and 90 and the two old sentences at 85 and 89 were archived from the student app. Interjections 60, 68, and 72 and Felorin 94 remain visible without linked sentences. The [CSV review sheet](unassigned_51_100_for_review.csv) records each status. The [page-sentence pool](unassigned_51_100_page_sentences.csv) lists the current ordinary direct sentences under these 22 words.",
    "",
    "## At a glance",
    "",
    "- **Clear example leads:** a current sentence plainly uses the listed meaning. You can approve the link without approving every other sentence on that page.",
    "- **Possible duplicates or overlaps:** the definitions may repeat one another. These need your decision before any meaning is merged.",
    "- **Meaning questions:** current sentences appear to use the same word in materially different ways. Both uses remain visible while you decide.",
    "- **Missing direct demonstration:** I found no page sentence that clearly illustrates the specified use. Existing meanings remain in place.",
    "",
]
last_word = None
for row in rows:
    if row["headword"] != last_word:
        last_word = row["headword"]
        lines += [f"## {last_word}", ""]
    lines.append(f"**{row['number']}. {row['word_type']} — {row['current_meaning']}**")
    if row["existing_example_id"]:
        label = "Archived earlier sentence" if row["example_status"] == "archived" else "Current page sentence"
        lines.append(f"- {label}: `{row['existing_celan']}` — “{row['existing_english']}”")
    else:
        lines.append("- Current page sentence selected: none clearly demonstrates this meaning.")
    lines.append(f"- **What I found:** {row['review_call']}. {row['why']}")
    if row["creator_decision"]:
        lines.append(f"- **Earlier review suggestion:** {row['recommendation']}")
        lines.append(f"- **Earlier question:** {row['decision_needed']}")
        lines.append(f"- **Creator decision and status:** {row['creator_decision']} **{row['status']}.**")
    else:
        lines.append(f"- **My recommendation:** {row['recommendation']}")
        lines.append(f"- **Your decision:** {row['decision_needed']}")
    lines.append("")

(HERE / "unassigned_51_100_for_review.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Prepared {len(rows)} meanings on {len(words)} pages and {len(page_examples)} current sentence placements")
