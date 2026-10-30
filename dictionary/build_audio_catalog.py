"""Build the app's ID-to-audio catalog from the active audio manifests."""

import csv
import hashlib
import json
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "audio"
OUTPUT = ROOT / "dictionary/app_data/audio_catalog.js"
COLLECTIONS = (
    ("headwords", AUDIO / "headwords", "headword_id"),
    ("variants", AUDIO / "headwords/variants", "variant_id"),
    ("phrases", AUDIO / "expressions", "source_id"),
)


def rows(path):
    with path.open(newline="") as handle:
        return list(csv.DictReader(handle))


def encoded_path(path):
    return "/".join(quote(part, safe="-._~") for part in path.parts)


def main():
    catalog = {name: {} for name, _, _ in COLLECTIONS}
    recorded_phrase_texts = {}
    for name, folder, id_field in COLLECTIONS:
        for manifest in sorted(folder.glob("volume_???/manifest.csv")):
            for row in rows(manifest):
                filename = row["audio_file"]
                if filename.lstrip().startswith("ERROR_"):
                    continue
                key = row[id_field]
                assert key and key not in catalog[name], f"Duplicate {name} ID: {key}"
                file = manifest.parent / filename
                assert file.is_file(), f"Missing audio: {file}"
                assert hashlib.sha256(file.read_bytes()).hexdigest() == row["sha256"], f"Changed audio: {file}"
                relative = file.relative_to(AUDIO)
                catalog[name][key] = {
                    "path": encoded_path(relative),
                    "voice": row["voice_name"],
                }
                if name == "phrases":
                    recorded_phrase_texts.setdefault(row["celan_text"].strip().lower(), set()).add(key)

    app_headwords = {row["id"] for row in rows(ROOT / "dictionary/app_data/dictionary_entries.csv")}
    assert set(catalog["headwords"]) == app_headwords, "Headword audio and app IDs differ"
    variants = set()
    for row in rows(ROOT / "dictionary/app_data/dictionary_entries.csv"):
        metadata = json.loads(row["metadata_json"] or "null") or {}
        for index, _ in enumerate(metadata.get("variants") or [], 1):
            variants.add(f"{row['id']}#v{index:02d}")
    pending_audio = json.loads((ROOT / "dictionary/audio_pending.json").read_text())
    pending_variants = set(pending_audio.get("variants") or [])
    assert not set(catalog["variants"]) & pending_variants, "Recorded variant marked pending"
    assert set(catalog["variants"]) | pending_variants == variants, "Variant audio and pending IDs differ from app"
    examples = rows(ROOT / "dictionary/app_data/dictionary_examples.csv")
    example_ids = {row["entry_id"] for row in examples if row["entry_id"]}
    expression_ids = {item["expression_id"] for item in json.loads((ROOT / "dictionary/app_data/expressions_app.json").read_text())}
    assert set(catalog["phrases"]) <= example_ids | expression_ids, "Phrase audio has no app destination"

    # Some placed examples reuse a recorded sentence under another source ID.
    # Only alias identical written text with exactly one available recording.
    aliases = {}
    for row in examples:
        if row["entry_id"] in catalog["phrases"]:
            continue
        text = row["celan_text"].strip().lower()
        sources = recorded_phrase_texts.get(text, set())
        if len(sources) != 1:
            continue
        alias = row["entry_id"] or f"text:{text}"
        source = next(iter(sources))
        assert alias not in aliases or aliases[alias] == source, f"Conflicting example alias: {alias}"
        aliases[alias] = source

    ordered = {name: dict(sorted(items.items())) for name, items in catalog.items()}
    ordered["exampleAliases"] = dict(sorted(aliases.items()))
    OUTPUT.write_text("window.CELAN_AUDIO_CATALOG = " + json.dumps(ordered, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print("Built audio catalog:", ", ".join(f"{name}={len(items)}" for name, items in ordered.items()))


if __name__ == "__main__":
    main()
