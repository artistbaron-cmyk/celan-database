"""One-time, source-backed word-building correction for the Dictionary App.

The existing components and provenance remain in dictionary_families.json. A
breakdown with unresolved spelling or sense scope is marked open and stays off
reader pages. The output CSVs record every affected entry and disposition.
"""

import csv
import itertools
import json
import re
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"
FAMILY_PATH = APP / "dictionary_families.json"


def rows(name):
    with (APP / name).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def plain(value):
    return re.sub(r"[^a-z0-9]", "", value.casefold())


def exact_orders(headword, components):
    matches = []
    for order in itertools.permutations(components):
        if plain("".join(part["form"] for part in order)) == plain(headword):
            if not any([part["id"] for part in order] == [part["id"] for part in old] for old in matches):
                matches.append(order)
    return matches


def origin_forms(origin):
    forms = []
    for segment in origin.split("+"):
        match = re.match(r"\s*([-A-Za-z]+)", segment)
        if not match:
            return []
        forms.append(match.group(1))
    return forms


def one_smoothing_vowel(headword, components):
    found = []
    for order in itertools.permutations(components):
        forms = [plain(part["form"]) for part in order]
        for boundary in range(1, len(forms)):
            left, right = "".join(forms[:boundary]), "".join(forms[boundary:])
            for vowel in "aeo":
                if left + vowel + right == plain(headword):
                    key = (tuple(part["id"] for part in order), vowel, boundary)
                    if key not in found:
                        found.append(key)
    return found


entries = rows("dictionary_entries.csv")
by_id = {row["id"]: row for row in entries}
by_form = {row["headword"].casefold(): row for row in entries}
senses = defaultdict(list)
for row in rows("dictionary_senses.csv"):
    if row["visible"] == "Yes":
        senses[row["headword_id"]].append(row)
families = json.loads(FAMILY_PATH.read_text(encoding="utf-8"))
assert len(entries) == len(families) == 1496
assert "morphologyReview" not in families["arthaxar"], "Pass 2 has already been applied"

# These mappings use only the current app's meaning rows and recorded word
# origins. A number means that sense_order; "all" means every visible sense.
morphology_scope = {
    "aenor": [2], "morldren": "all", "krezor": "all",
    "phelvin": "all", "jorvak": [1], "welrim": "all", "xilvar": [2],
    "xarvel": "all", "belshara": [1, 2], "felorin": "all",
    "zhelvek": "all", "eshvelaneth": [1], "lianor": [1],
    "shalaen": "all", "drenkorath": [1], "lianrethshen": "all",
    "vaarshen": "all", "keldoraen": "all", "anvekaen": "all",
    "thalvekaen": "all", "jorvar": "all", "shentalzhael": "all",
    "thalesh": "all", "thalor": "all", "nor-ka": [2],
}

# A whole family link set is shown only when its recorded connection can be
# assigned to the listed sense(s) as a group. Mixed or unclear sets stay open.
family_all = {
    "ilin", "ka", "an", "nor", "dren", "shal", "shara", "kal",
    "seren", "lorin", "dral", "tal", "morldren", "krezor",
    "phelvin", "jorvak", "welrim", "xarvel", "felorin", "kel",
    "talaen", "thar-ka", "lianrethshen", "vaarshen", "keldoraen",
    "ruvan", "anvekaen", "thalvekaen", "jorvar", "njor", "sel",
    "thael", "shentalzhael", "im", "thalesh", "thalor", "vanesh",
    "kar", "jor", "bren", "xar", "shan",
}
family_partial = {
    "ya": [2], "var": [1], "esh": [1, 2], "morl": [1],
    "terra": [1], "krez": [1], "thar": [1], "lian": [1],
    "rath": [1], "fah": [1], "reth": [1], "aenor": [2],
    "lianor": [1], "nor-ka": [2],
}


def selected_sense_ids(headword_id, selection):
    available = senses[headword_id]
    if selection == "all":
        return [row["sense_id"] for row in available]
    wanted = {int(number) for number in selection}
    chosen = [row["sense_id"] for row in available if int(row["sense_order"]) in wanted]
    assert len(chosen) == len(wanted), (headword_id, selection)
    return chosen


def part_for(form, existing, origin, headword_id):
    for index, part in enumerate(existing):
        if plain(part["form"]) == plain(form):
            chosen = existing.pop(index)
            if not chosen.get("meaning"):
                target = by_form.get(form.casefold())
                assert target, (headword_id, form)
                chosen["meaning"] = senses[target["id"]][0]["meaning"]
            return chosen
    target = by_form.get(form.casefold())
    assert target, (headword_id, form)
    target_id = target["id"]
    return {
        "form": form, "description": "", "source": origin,
        "id": f"word:{headword_id}:{target_id}",
        "kind": "affix" if form.startswith("-") or form.endswith("-") else "word",
        "target": target_id, "meaning": senses[target_id][0]["meaning"],
        "entryId": by_id[headword_id]["source_entry_ids"].split(";")[0].strip(),
    }


before_no_exact = []
order_changes = []
review_rows = []
for row in entries:
    key, word = row["id"], row["headword"]
    family = families[key]
    components = [part for part in family.get("components", []) if part.get("form") and part.get("meaning")]
    if not components:
        continue
    before = " + ".join(part["form"] for part in components)
    matches = exact_orders(word, components)
    if len(matches) == 1:
        order = list(matches[0])
        if [part["id"] for part in order] != [part["id"] for part in components]:
            family["components"] = order
            order_changes.append({
                "headword": word, "before": before,
                "after": " + ".join(part["form"] for part in order),
                "source_entry_ids": "; ".join(dict.fromkeys(part.get("entryId", "") for part in order)),
                "basis": "The recorded parts join exactly to spell the headword in this order.",
            })
        continue
    if matches:
        # Several spellings orders remain possible. No arbitrary order is chosen.
        family["morphologyReview"] = {"status": "open", "reason": "More than one recorded part order spells this word."}
        continue
    before_no_exact.append(key)
    metadata = json.loads(row["metadata_json"] or "null") or {}
    origins = metadata.get("derivations") or []
    exact_origin = next((
        (origin, forms) for origin in origins if "+" in origin
        if (forms := origin_forms(origin)) and plain("".join(forms)) == plain(word)
        and all(by_form.get(form.casefold()) or any(plain(part["form"]) == plain(form) for part in components) for form in forms)
    ), None)
    status, detail = "open_hidden", "The recorded parts do not simply spell this word; no supported correction is recorded."
    if exact_origin:
        origin, forms = exact_origin
        remaining = list(family["components"])
        corrected = [part_for(form, remaining, origin, key) for form in forms]
        assert not remaining, (word, remaining)
        assert plain("".join(part["form"] for part in corrected)) == plain(word)
        family["components"] = corrected
        status, detail = "fixed_from_recorded_origin", origin
    elif key == "krezor":
        family["morphologyAnalyses"] = [{"componentIds": ["root:krez", "suffix:or"]}]
        status, detail = "fixed_recorded_alternative", "The recorded Krez + -or analysis is complete; the alternate Krez + or components remain in the source record."
    elif key == "shalaen":
        family["morphologyAnalyses"] = [{"componentIds": ["root:shal", "suffix:aen"]}]
        status, detail = "fixed_recorded_alternative", "The recorded Shal + -aen analysis is complete; the parsed From token remains in the source record."
    elif key == "velmarin":
        family["morphologyAnalyses"] = [
            {"componentIds": ["root:vel", "root:marin"], "senseIds": selected_sense_ids(key, [1])},
            {"componentIds": ["root:vel", "local:velmarin:mar", "local:velmarin:in"], "senseIds": selected_sense_ids(key, [2])},
        ]
        status, detail = "fixed_recorded_alternatives", "Both recorded analyses spell Velmarin; each is shown with its supported meaning."
    elif key in {"arthaxar", "mahrowek", "morlatharim", "nkathal", "tavojorin", "velalivar"}:
        matches = one_smoothing_vowel(word, components)
        assert len(matches) == 1, (word, matches)
        ids, vowel, _ = matches[0]
        family["morphologyAnalyses"] = [{
            "componentIds": list(ids),
            "spellingNote": f"A smoothing vowel ({vowel}) joins these parts in the written word.",
        }]
        status, detail = "shown_with_smoothing", f"The current Grammar Guide permits a smoothing vowel; this word adds {vowel} between recorded parts."
    elif key == "theren":
        family["morphologyAnalyses"] = [{
            "componentIds": [part["id"] for part in components],
            "spellingNote": "Ter becomes Ther- when this word is formed.",
        }]
        status, detail = "shown_with_recorded_change", "The existing word origin explicitly approves the Ter → Ther- aspiration."
    elif key == "zhivor":
        family["morphologyAnalyses"] = [{
            "componentIds": [part["id"] for part in components],
            "spellingNote": "Zhir + Vor is historically smoothed to Zhivor.",
        }]
        status, detail = "shown_with_recorded_change", "The existing word origin explicitly records historical smoothing."
    else:
        forms = {plain(part["form"]) for part in components}
        if forms & {"from", "usage", "reason", "hypothetical"}:
            detail = "A parsed editorial word appears among the parts; the raw record is kept but the breakdown is hidden."
        elif len(components) == 1:
            detail = "Only one part is recorded for a longer word; the breakdown is hidden."
        family["morphologyReview"] = {"status": "open", "reason": detail}
    review_rows.append({
        "headword": word, "before": before,
        "after": " + ".join(part["form"] for part in family["components"]),
        "status": status, "reason": detail,
        "source_entry_ids": "; ".join(dict.fromkeys(part.get("entryId", "") for part in family["components"])),
    })

assert len(order_changes) == 228, len(order_changes)
assert len(before_no_exact) == len(review_rows) == 107, len(review_rows)

family_rows = []
for key, visible in senses.items():
    if len(visible) < 2:
        continue
    family = families[key]
    if family.get("components"):
        selection = morphology_scope.get(key)
        if selection:
            family["morphologySenseIds"] = selected_sense_ids(key, selection)
        elif not family.get("morphologyReview") and not family.get("morphologyAnalyses"):
            family["morphologyReview"] = {"status": "open", "reason": "The recorded breakdown cannot yet be assigned to a particular meaning."}
    if not family.get("relatedEntries"):
        continue
    selection = "all" if key in family_all else family_partial.get(key)
    if selection:
        family["familySenseIds"] = selected_sense_ids(key, selection)
        status = "scoped"
    else:
        family["familyReview"] = {"status": "open", "reason": "The complete link set cannot yet be assigned to a particular meaning without implying an unsupported origin."}
        status = "open_hidden"
    family_rows.append({
        "headword": by_id[key]["headword"], "status": status,
        "sense_ids": "; ".join(family.get("familySenseIds", [])),
        "related_words": "; ".join(item["term"] for item in family["relatedEntries"]),
        "reason": "Current recorded family connection applies to the listed meanings." if selection else family["familyReview"]["reason"],
    })

assert len(family_rows) == 82, len(family_rows)
assert sum(len(v) > 1 and bool(families[k].get("components")) for k, v in senses.items()) == 26
assert all(families[key].get("morphologySenseIds") or families[key].get("morphologyReview") or families[key].get("morphologyAnalyses") for key, v in senses.items() if len(v) > 1 and families[key].get("components"))
FAMILY_PATH.write_text(json.dumps(families, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_csv(name, data):
    with (HERE / name).open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(data[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(data)


write_csv("pass2_order_changes.csv", order_changes)
write_csv("pass2_morphology_review.csv", review_rows)
write_csv("pass2_family_scope.csv", family_rows)

# The original inventory remains a baseline. Update its single full findings
# list with the disposition of every Pass 2 item, preserving other pass queues.
finding_path = HERE / "affected_items.csv"
with finding_path.open(newline="", encoding="utf-8") as handle:
    findings = list(csv.DictReader(handle))
order_by_name = {row["headword"]: row for row in order_changes}
review_by_name = {row["headword"]: row for row in review_rows}
scope_by_name = {row["headword"]: row for row in family_rows}
for finding in findings:
    issue, name = finding["issue"], finding["headword"]
    status = note = ""
    if issue == "morphology_order":
        status, note = "fixed", order_by_name[name]["after"]
    elif issue == "morphology_needs_individual_review":
        status, note = review_by_name[name]["status"], review_by_name[name]["reason"]
    elif issue == "morphology_sense_scope_review":
        family = families[by_form[name.casefold()]["id"]]
        status = "scoped" if family.get("morphologySenseIds") or family.get("morphologyAnalyses") else "open_hidden"
        note = "; ".join(family.get("morphologySenseIds", [])) or family.get("morphologyReview", {}).get("reason", "")
    elif issue == "family_sense_scope_review":
        status, note = scope_by_name[name]["status"], scope_by_name[name]["sense_ids"] or scope_by_name[name]["reason"]
    elif issue == "origin_repeats_morphology":
        status, note = "suppressed_on_reader_page", "The repeated line is hidden when the cards are shown; uncertain breakdowns are hidden altogether."
    elif issue == "morphology_parts_same_color":
        status, note = "fixed", "Part colors now follow their written position."
    finding["pass2_status"], finding["pass2_note"] = status, note
with finding_path.open("w", newline="", encoding="utf-8") as handle:
    writer = csv.DictWriter(handle, fieldnames=list(findings[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(findings)

print(json.dumps({
    "exact_orders_fixed": len(order_changes),
    "nonexact_reviews": len(review_rows),
    "nonexact_resolved_or_explained": sum(row["status"] != "open_hidden" for row in review_rows),
    "nonexact_open_hidden": sum(row["status"] == "open_hidden" for row in review_rows),
    "multi_meaning_families_scoped": sum(row["status"] == "scoped" for row in family_rows),
    "multi_meaning_families_open_hidden": sum(row["status"] == "open_hidden" for row in family_rows),
}, indent=2))
