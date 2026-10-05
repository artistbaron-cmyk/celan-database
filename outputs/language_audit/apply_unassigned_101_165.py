"""Apply the creator's 2026-10-05 decisions for historical review items 101–165.

Keep original rows in adjacent archives. Do not infer general morphology rules from
word-specific explanations that disagree with current root/ending entries.
"""

import csv
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"


def read(path):
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)


def write(path, fields, rows):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


senses_path = APP / "dictionary_senses.csv"
sense_fields, senses = read(senses_path)
by_id = {row["sense_id"]: row for row in senses}

# Keep one sense for each genuinely distinct grammatical or semantic use.
retire_into = {
    "rethlian-s3": "rethlian-s1",
    "lianeth-s2": "lianeth-s1",
    "kor-s1": "kor-s3",
    "lianrethshen-s1": "lianrethshen-s2",
    "vaarshen-s1": "vaarshen-s2",
    "jorvar-s1": "jorvar-s2",
    "em-s2": "em-s1",
    "vrak-s2": "vrak-s1",
}
retire = set(retire_into) | {"pral-s1"}
assert retire <= set(by_id)
write(HERE / "unassigned_101_165_retired_senses.csv", sense_fields,
      [row.copy() for row in senses if row["sense_id"] in retire])

for old_id, keeper_id in retire_into.items():
    keeper = by_id[keeper_id]
    old = by_id[old_id]
    ids = [part.strip() for part in (keeper["source_entry_ids"] + ";" + old["source_entry_ids"]).split(";") if part.strip()]
    keeper["source_entry_ids"] = "; ".join(dict.fromkeys(ids))

new_meanings = {
    "lianor-s2": "Sir / Respected Master",
    "kel-s2": "To name / to designate",
    "kel-s3": "Word / spoken or written unit",
    "kel-s4": "Text / inscribed passage",
    "rethlian-s1": "Possibility (may / might)",
    "rethlian-s2": "Maybe / Perhaps",
    "drenkorath-s2": "Sacred spring / oasis spring",
    "tenar-s2": "Radiance / steady glow / visible light",
    "lianeth-s1": "Ability (can / able to)",
    "lianeth-s3": "Reliable / sound / dependable / accurate / true to function",
    "shen-s2": "Unit of quantity / measure",
    "kor-s3": "Center / Core / Middle; central position or functional interior within a whole",
    "pral-s3": "Intricacy / Detail / Craftsmanship",
    "shan-s1": "To pass / to transfer / to hand off",
    "lianrethshen-s2": "Anomaly reading; a measured value describing the intensity or instability of a reality anomaly",
    "vaarshen-s2": "Safe clearance distance established between a hazard and an unprotected person or place",
    "jorvar-s2": "Speed; rate of movement through distance",
    "thael-s1": "Rhythm / beat / recurring pulse",
    "em-s1": "Um / Uh; hesitation or thinking expression",
    "vrak-s1": "Gone / Missing / Depleted / Dry (Trerran dialect)",
    "xar-s1": "Cover / physical shelter",
    "xar-s2": "To cover / to shelter / to close off / to seal",
    "nor-ka-s1": "Passive voice echo particle",
    "nor-ka-s2": "Now / in this moment / at present",
}
for sid, meaning in new_meanings.items():
    by_id[sid]["meaning"] = meaning
by_id["kel-s2"]["word_type"] = "Verb"
by_id["lianor-s2"]["usage_note"] = "Honorific title of address; distinct from Lianor meaning idea or thought."
by_id["kel-s1"]["usage_note"] = "Informal say/talk use remains without a direct example; ordinary speaking also uses Aen and Kelaen."
by_id["kel-s2"]["usage_note"] = "Sentence-initial Kel means to name or designate. The noun for a name is Kelrin; do not read this verb example as a noun."
by_id["rethlian-s1"]["usage_note"] = "Modal particle after a clause: may or might. Distinct from introductory Maybe."
by_id["rethlian-s2"]["usage_note"] = "Standalone introductory Maybe or Perhaps."
by_id["velmarin-s2"]["usage_note"] = "Honorary Elder is a cultural extension of the ancient-tree name."
by_id["drenkorath-s1"]["usage_note"] = "Jasaran oasis blessing ceremony. Its poetic example personifies the blessing as speaking to the water."
by_id["drenkorath-s2"]["usage_note"] = "A sacred spring or oasis spring; in the example Drenkorath is a place reached by the speaker."
by_id["tenar-s1"]["usage_note"] = "Tenar unar is a number-system illustration: ten plus one makes eleven."
by_id["lianeth-s1"]["usage_note"] = "Modal particle of ability after a clause: can or able to."
by_id["thar-ka-s2"]["usage_note"] = "Desire / inner drive as a noun; no ordinary noun sentence has been assigned yet."
by_id["shen-s2"]["usage_note"] = "A measure or count unit following a numeral; the current sentence names five measures."
by_id["kor-s3"]["usage_note"] = "Spatial center or functional core. Strength/power belongs to Kal; Kor's handspan measure is a separate specialized use."
by_id["pral-s2"]["usage_note"] = "Standalone make/craft verb remains without a direct example. Pralaen is the established active craft verb."
by_id["em-s1"]["usage_note"] = "Spoken hesitation or thinking filler."
by_id["vrak-s1"]["usage_note"] = "Trerran predicate describing something gone, missing, or depleted. Dry is a contextual extension."
by_id["vanesh-s1"]["usage_note"] = "Commerce or formal trade as a noun; no ordinary noun sentence has been assigned yet."
by_id["xar-s1"]["usage_note"] = "A cover or protective enclosure. Physical shadow is generally Veth or Vethor."
by_id["nor-ka-s2"]["usage_note"] = "In the phrase an nor-ka: in this present moment. Distinct from passive nor-ka."

write(senses_path, sense_fields, [row for row in senses if row["sense_id"] not in retire])

# Every link is to an example already on that headword's page. The source wording
# is preserved, including the number expression and the two-clause Jor example.
assign = {
    ("lianor", "PE-V3-0058"): "lianor-s2",
    ("kel", "PE-PFM1-0001"): "kel-s2",
    ("kel", "PE-HLPS1-0008"): "kel-s3",
    ("kel", "PE-SCP1-0001"): "kel-s4",
    ("rethlian", "PE-V4-0003"): "rethlian-s1",
    ("rethlian", "PE-V3-0013"): "rethlian-s2",
    ("velmarin", "PE-V4-0068"): "velmarin-s1",
    ("velmarin", "PE-V3-0050"): "velmarin-s2",
    ("shalaen", "PE-V4-0053"): "shalaen-s2",
    ("drenkorath", "PE-V3-0099"): "drenkorath-s1",
    ("drenkorath", "PE-V4-0106"): "drenkorath-s2",
    ("tenar", "PE-V3-0203"): "tenar-s1",
    ("tenar", "PE-GMMP1-0036"): "tenar-s2",
    ("lianeth", "PE-V4-0001"): "lianeth-s1",
    ("lianeth", "PE-NE1-0074"): "lianeth-s3",
    ("shen", "PE-ER2-0032"): "shen-s1",
    ("shen", "PE-V4-0091"): "shen-s2",
    ("shen", "PE-HTS1-0027"): "shen-s3",
    ("kor", "PE-SRD1-0006"): "kor-s3",
    ("pralor", "PE-V4-0020"): "pralor-s1",
    ("pral", "PE-ER2-0034"): "pral-s3",
    ("shan", "PE-WRT1-0028"): "shan-s1",
    ("shan", "PE-CNE1-0071"): "shan-s2",
    ("lianrethshen", "PE-PFM1-0071"): "lianrethshen-s2",
    ("lianrethshen", "PE-PFM1-0072"): "lianrethshen-s2",
    ("vaarshen", "PE-PFM1-0073"): "vaarshen-s2",
    ("vaarshen", "PE-PFM1-0074"): "vaarshen-s2",
    ("keldoraen", "PE-PFM1-0074"): "keldoraen-s1",
    ("keldoraen", "PE-SCP1-0008"): "keldoraen-s2",
    ("ruvan", "PE-SCP1-0013"): "ruvan-s1",
    ("ruvan", "PE-FAP2-0053"): "ruvan-s2",
    ("anvekaen", "PE-TVO1-0041"): "anvekaen-s1",
    ("anvekaen", "PE-SCP1-0003"): "anvekaen-s2",
    ("thalvekaen", "PE-TVO1-0043"): "thalvekaen-s1",
    ("thalvekaen", "PE-SCP1-0005"): "thalvekaen-s2",
    ("jorvar", "PE-TVO1-0050"): "jorvar-s2",
    ("jorvar", "PE-TVO1-0049"): "jorvar-s2",
    ("njor", "PE-SCP1-0009"): "njor-s1",
    ("njor", "PE-BSPI1-0044"): "njor-s3",
    ("sel", "PE-SCP1-0011"): "sel-s1",
    ("sel", "PE-SCP1-0015"): "sel-s2",
    ("thael", "PE-PSAC1-0008"): "thael-s1",
    ("em", "PE-DR2-0005"): "em-s1",
    ("vrak", "PE-DR2-0008"): "vrak-s1",
    ("vanesh", "PE-OC1-0026"): "vanesh-s2",
    ("jor", "PE-EGE1-0059"): "jor-s2",
    ("bren", "PE-ER2-0053"): "bren-s1",
    ("bren", "PE-FAP1-0018"): "bren-s2",
    ("xar", "PE-ER2-0056"): "xar-s1",
    ("xar", "PE-EGE1-0028"): "xar-s2",
    ("nor-ka", "PE-V4-0009"): "nor-ka-s1",
    ("nor-ka", "PE-V4-0105"): "nor-ka-s2",
}
examples_path = APP / "dictionary_examples.csv"
example_fields, examples = read(examples_path)
seen = set()
original_rows = []
for row in examples:
    before = row.copy()
    key = row["headword_id"], row["entry_id"]
    if key in assign:
        assert row["section"] == "direct", key
        assert row["sense_id"] in {"", assign[key]}, (key, row["sense_id"])
        row["sense_id"] = assign[key]
        seen.add(key)
    if row["sense_id"] in new_meanings or key in assign:
        row["sense_meaning"] = by_id[row["sense_id"]]["meaning"]
    if key == ("tenar", "PE-V3-0203"):
        assert row["example_type"] == "Number/math example"
        row["display_kind"] = "teaching"
        row["analysis"] = "Number-system illustration: ten plus one makes eleven; this is an expression, not a sentence."
    if row != before:
        original_rows.append(before)
assert seen == set(assign), set(assign) - seen
write(HERE / "unassigned_101_165_original_example_rows.csv", example_fields, original_rows)
write(examples_path, example_fields, examples)

families_path = APP / "dictionary_families.json"
families = json.loads(families_path.read_text(encoding="utf-8"))

def remove_retired(value):
    if isinstance(value, dict):
        return {key: remove_retired(item) for key, item in value.items()}
    if isinstance(value, list):
        return [remove_retired(item) for item in value if not (isinstance(item, str) and item in retire)]
    return value

families = remove_retired(families)
families_path.write_text(json.dumps(families, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"Applied {len(assign)} page-example links, merged {len(retire_into)} meanings, moved Table from Pral to existing Pralor, and archived all original rows.")
