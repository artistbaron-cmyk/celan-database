"""List every current app headword without implying linguistic verification."""

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
entries = json.loads((ROOT / "outputs/dictionary_second_pass/app_inventory_after.json").read_text())["entries"]

with (HERE / "entry_review.csv").open("w", newline="", encoding="utf-8") as target:
    writer = csv.DictWriter(target, fieldnames=[
        "headword", "pronunciation", "sense_count", "displayed_senses",
        "derivations", "variants", "family_roots", "direct_example_count",
        "related_example_count", "teaching_example_count", "linguistic_review_status", "finding",
    ])
    writer.writeheader()
    for entry in entries:
        writer.writerow({
            "headword": entry["headword"],
            "pronunciation": entry["pronunciation"],
            "sense_count": len(entry["senses"]),
            "displayed_senses": " | ".join(
                f"{sense['type']}: {sense['meaning']}" for sense in entry["senses"]
            ),
            "derivations": " | ".join(map(str, entry.get("derivations", []))),
            "variants": "; ".join(map(str, entry.get("variants", []))),
            "family_roots": "; ".join(map(str, entry.get("family_roots", []))),
            "direct_example_count": len(entry.get("direct", [])),
            "related_example_count": len(entry.get("related", [])),
            "teaching_example_count": len(entry.get("teaching", [])),
            "linguistic_review_status": "Not individually reviewed in readiness audit",
            "finding": "",
        })
print(len(entries))
