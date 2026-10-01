"""Read-only structural checks of the current app-facing dictionary files.

This script reports review candidates. It does not decide Celan meanings or edit app data.
"""

import csv
import itertools
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent.parent / "dictionary" / "app_data"


def csv_rows(name):
    with (APP / name).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def plain(text):
    return re.sub(r"[^a-z0-9]", "", (text or "").lower())


def morphology_order(headword, parts):
    forms = [part["form"] for part in parts]
    if not forms:
        return "none", ""
    spelling = plain(headword)
    if "".join(map(plain, forms)) == spelling:
        return "in_order", " + ".join(forms)
    matches = {
        order for order in itertools.permutations(forms)
        if "".join(map(plain, order)) == spelling
    }
    if len(matches) == 1:
        return "unique_reorder", " + ".join(next(iter(matches)))
    if matches:
        return "ambiguous_reorder", " | ".join(" + ".join(order) for order in sorted(matches))
    return "no_exact_spelling_match", " + ".join(forms)


def displayed_usage_note(note, parts):
    note = note.strip()
    if not note or any(re.search(pattern, note, re.IGNORECASE) for pattern in (
        r"^original .* preserved\.$", r"^dictionary-layer entry",
        r"^source extraction remains unchanged\.$", r"^source files unchanged\.$",
        r"^root family evidence:")):
        return ""
    if any(part.get("source", "").strip() == note for part in parts):
        return ""
    return note


entries = csv_rows("dictionary_entries.csv")
senses = defaultdict(list)
examples = defaultdict(list)
families = json.loads((APP / "dictionary_families.json").read_text(encoding="utf-8"))
for row in csv_rows("dictionary_senses.csv"):
    if row["visible"] == "Yes":
        senses[row["headword_id"]].append(row)
for row in csv_rows("dictionary_examples.csv"):
    examples[row["headword_id"]].append(row)

inventory = []
issues = []
for entry in entries:
    key = entry["id"]
    headword = entry["headword"]
    uses = senses[key]
    placements = examples[key]
    family = families[key]
    metadata = json.loads(entry["metadata_json"] or "null") or {}
    parts = [part for part in family.get("components", []) if part.get("form") and part.get("meaning")]
    order, spelling_order = morphology_order(headword, parts)
    direct = [row for row in placements if row["section"] == "direct"]
    related = [row for row in placements if row["section"] == "related"]
    teaching = [row for row in placements if row["section"] == "teaching"]
    unassigned = [row for row in direct if len(uses) > 1 and not row["sense_meaning"]]
    variants = metadata.get("variants") or []
    origin = metadata.get("derivations") or []
    part_sources = {part.get("source", "").strip().casefold() for part in parts}
    repeated_origin = [text for text in origin if text.strip().casefold() in part_sources]
    internal_notes = [note for use in uses if (note := displayed_usage_note(use["usage_note"], parts)) and re.search(
        r"preserved as standalone|original (?:root|expanded)|retain as-is|"
        r"the source gloss|source (?:clearly|extraction|files)|"
        r"(?:user|editorial)[- ]approved|unapproved|builds the approved|"
        r"translation note:|review pending|^ED-[0-9]|^LX-[A-Z0-9]",
        note, re.IGNORECASE)]
    meanings = [plain(use["meaning"]) for use in uses]
    duplicate_meanings = len(meanings) - len(set(meanings))
    row = {
        "headword": headword,
        "visible_senses": len(uses),
        "direct_examples": len(direct),
        "related_records": len(related),
        "teaching_illustrations": len(teaching),
        "unassigned_direct_examples": len(unassigned),
        "variant_forms": len(variants),
        "morphology_parts": len(parts),
        "morphology_order": order,
        "spelling_order_if_unique": spelling_order if order == "unique_reorder" else "",
        "repeated_word_origin": len(repeated_origin),
        "internal_usage_notes": len(internal_notes),
        "identical_meaning_rows": duplicate_meanings,
        "related_words": len(family.get("relatedEntries", [])),
    }
    inventory.append(row)

    def flag(code, detail, affected=""):
        issues.append({"headword": headword, "issue": code, "detail": detail,
                       "affected_record_ids": affected})

    if variants:
        flag("variant_needs_visual_weight", "; ".join(v.get("form", "") for v in variants))
    if len(parts) > 1:
        flag("morphology_parts_same_color", f"{len(parts)} word parts use the same accent color")
    if order == "unique_reorder":
        flag("morphology_order", f"Shown: {' + '.join(p['form'] for p in parts)}; spelling order: {spelling_order}")
    elif order == "no_exact_spelling_match":
        flag("morphology_needs_individual_review", f"Parts: {' + '.join(p['form'] for p in parts)}")
    elif order == "ambiguous_reorder":
        flag("morphology_order_ambiguous", spelling_order)
    if repeated_origin:
        flag("origin_repeats_morphology", "; ".join(repeated_origin))
    if len(uses) > 1 and parts:
        flag("morphology_sense_scope_review", "; ".join(use["meaning"] for use in uses))
    if len(uses) > 1 and family.get("relatedEntries"):
        flag("family_sense_scope_review", "; ".join(use["meaning"] for use in uses))
    if unassigned:
        flag("example_sense_unassigned", f"{len(unassigned)} of {len(direct)} direct examples",
             "; ".join(row["entry_id"] for row in unassigned))
    if len(direct) > 10:
        flag("example_overload", f"{len(direct)} direct examples", "; ".join(row["entry_id"] for row in direct))
    if not direct:
        flag("no_direct_example", "No direct example is placed under this word")
    if internal_notes:
        flag("internal_usage_note", " | ".join(internal_notes),
             "; ".join(use["source_entry_ids"] for use in uses if use["usage_note"] in internal_notes))
    if duplicate_meanings:
        flag("identical_meaning_rows", f"{duplicate_meanings + 1} rows have identical wording")

inventory.sort(key=lambda row: row["headword"].casefold())
issues.sort(key=lambda row: (row["issue"], row["headword"].casefold()))
for name, rows in (("entry_inventory.csv", inventory), ("affected_items.csv", issues)):
    with (HERE / name).open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

counts = Counter(row["issue"] for row in issues)
(HERE / "counts.json").write_text(json.dumps({
    "entries_checked": len(entries),
    "visible_senses_checked": sum(map(len, senses.values())),
    "example_placements_checked": sum(map(len, examples.values())),
    "issues_by_type": dict(sorted(counts.items())),
}, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"entries": len(entries), "issues_by_type": dict(sorted(counts.items()))}, indent=2))
