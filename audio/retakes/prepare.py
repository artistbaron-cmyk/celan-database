"""Select currently flagged dictionary audio for a separate voice comparison pass."""

import csv
import json
import pathlib
import re


ROOT = pathlib.Path(__file__).resolve().parents[2]
VOLUME = pathlib.Path(__file__).resolve().parent / "volume_001"
FIELDS = [
    "slot", "collection", "source_id", "source_text", "dictionary_pronunciation",
    "original_file", "original_sha256", "candidate_file", "voice_name", "voice_id",
    "model_id", "generation_id", "generation_prompt", "duration_seconds", "bytes",
    "sha256", "audio_review_status", "app_integration_status",
]


def read_csv(path):
    with path.open(newline="") as handle:
        return list(csv.DictReader(handle))


def expression_prompt(row):
    prompt = row.get("generation_prompt", "").strip() or row["celan_text"]
    prompt = re.sub(r"\bI\b", "-ee", prompt)
    prompt = re.sub(r"\bElan\b", "ehlan", prompt, flags=re.IGNORECASE)
    prompt = prompt.replace("x", "ks").replace("X", "Ks")
    return prompt


def main():
    assert not VOLUME.exists(), f"Review volume already exists: {VOLUME}"
    collections = (
        ("expressions", ROOT / "audio/expressions", "source_id", "celan_text", "pronunciation", "Ayinde - young British Nigerian", "77aEIu0qStu8Jwv1EdhX"),
        ("headwords", ROOT / "audio/headwords", "headword_id", "headword", "dictionary_pronunciation", "Taiwo - Young African Female - Realistic Voice", "RAVWJW17BPoSIf05iXxf"),
        ("variants", ROOT / "audio/headwords/variants", "variant_id", "variant_form", "dictionary_pronunciation", "Taiwo - Young African Female - Realistic Voice", "RAVWJW17BPoSIf05iXxf"),
    )
    items = []
    for collection, folder, id_key, text_key, pronunciation_key, voice_name, voice_id in collections:
        for manifest in sorted(folder.glob("volume_???/manifest.csv")):
            for row in read_csv(manifest):
                if not row["audio_file"].startswith("ERROR_"):
                    continue
                original = manifest.parent / row["audio_file"]
                assert original.is_file()
                base = row["audio_file"][len("ERROR_"):]
                voice_label = "Ayinde" if collection == "expressions" else "Taiwo"
                item = dict(
                    collection=collection,
                    source_id=row[id_key],
                    source_text=row[text_key],
                    dictionary_pronunciation=row.get(pronunciation_key, ""),
                    original_file=str(original.relative_to(ROOT)),
                    original_sha256=row["sha256"],
                    candidate_file=f"{voice_label}_{base}",
                    voice_name=voice_name,
                    voice_id=voice_id,
                    generation_prompt=(expression_prompt(row) if collection == "expressions" else row["generation_prompt"] or row[text_key]),
                    status="selected",
                )
                items.append(item)
    assert len(items) <= 200
    assert len({item["candidate_file"] for item in items}) == len(items)
    assert len({(item["collection"], item["source_id"]) for item in items}) == len(items)
    assert all(item["generation_prompt"] for item in items)
    VOLUME.mkdir(parents=True)
    state = dict(model_id="eleven_v4", items=items)
    (VOLUME / ".pending_batch.json").write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
    with (VOLUME / "manifest.csv").open("w", newline="") as handle:
        csv.DictWriter(handle, fieldnames=FIELDS).writeheader()
    print(json.dumps({name:sum(item["collection"] == name for item in items) for name,*_ in collections}))


if __name__ == "__main__":
    main()
