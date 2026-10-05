"""Keep approved local word parts from creating false root-family links."""

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
path = HERE.parent.parent / "dictionary" / "app_data" / "dictionary_families.json"
families = json.loads(path.read_text(encoding="utf-8"))

before = {key: families[key] for key in ("xilvar", "krezor")}
(HERE / "unassigned_61_100_family_before.json").write_text(
    json.dumps(before, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)

xilvar = families["xilvar"]
assert xilvar["familyRoots"] == ["XIL", "Var-"]
assert [part["form"] for part in xilvar["components"]] == ["Xil", "var"]
xilvar["familyRoots"] = ["XIL"]
xilvar["components"][0]["description"] = "hidden; secret"
xilvar["components"][0]["meaning"] = "hidden; secret"
xilvar["components"][1].update({
    "description": "seasoning substance (local word part)",
    "source": "Xil (hidden) + var (seasoning substance); approved Xilvar explanation",
    "id": "local:xilvar:var",
    "kind": "local",
    "target": None,
    "meaning": "seasoning substance",
})
var_entries = {item["id"] for group in xilvar["relatedGroups"] if group["key"] == "root:var" for item in group["entries"]}
xilvar["relatedEntries"] = [item for item in xilvar["relatedEntries"] if item["id"] not in var_entries]
xilvar["relatedGroups"] = [group for group in xilvar["relatedGroups"] if group["key"] != "root:var"]
xilvar["morphologySenseIds"] = ["xilvar-s1"]

removed_backlinks = 0
for family in families.values():
    for group in family.get("relatedGroups", []):
        if group.get("key") != "root:var":
            continue
        old_len = len(group["entries"])
        group["entries"] = [item for item in group["entries"] if item["id"] != "xilvar"]
        if len(group["entries"]) != old_len:
            removed_backlinks += 1
            family["relatedEntries"] = [item for item in family["relatedEntries"] if item["id"] != "xilvar"]

krezor = families["krezor"]
assert [part["form"] for part in krezor["components"]] == ["Krez", "or", "-or"]
assert krezor["morphologyAnalyses"] == [{"componentIds": ["root:krez", "suffix:or"]}]
krezor["components"] = [part for part in krezor["components"] if part["id"] != "root:or"]

path.write_text(json.dumps(families, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Removed Xilvar from {removed_backlinks} unrelated Var-family displays; Krezor now shows Krez + -or")
