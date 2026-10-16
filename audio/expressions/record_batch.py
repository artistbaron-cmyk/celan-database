"""Validate and record one downloaded v4 dictionary example batch.

Usage: python3 record_batch.py pass_29 '<JSON array from next_examples.py plus generation_id, duration_seconds, voice_name, voice_id, and model_id>'
"""

import csv
import hashlib
import json
import pathlib
import re
import subprocess
import sys


PROJECT = pathlib.Path(__file__).resolve().parents[2]
AUDIO = PROJECT / "audio" / "expressions"
EXAMPLES = PROJECT / "dictionary" / "app_data" / "dictionary_examples.csv"


def read_csv(path):
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)


def write_csv(path, fields, rows):
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main(pass_name, items):
    assert items and len(items) <= 30
    _, app = read_csv(EXAMPLES)
    app_pairs = {
        (row["entry_id"], row["celan_text"])
        for row in app
        if row["entry_id"]
    }
    manifest_paths = sorted(AUDIO.glob("volume_???/manifest.csv"))
    existing = [row for path in manifest_paths for row in read_csv(path)[1]]
    existing_ids = {row["source_id"] for row in existing}
    existing_texts = {row["celan_text"].strip().casefold() for row in existing}
    fields = read_csv(manifest_paths[0])[0]
    by_volume = {}

    # Validate the whole batch before changing a manifest.
    for item in items:
        ident, text = item["entry_id"], item["celan_text"]
        assert (ident, text) in app_pairs
        assert ident not in existing_ids and text.strip().casefold() not in existing_texts
        existing_ids.add(ident)
        existing_texts.add(text.strip().casefold())
        path = AUDIO / item["volume"] / item["audio_file"]
        assert path.is_file() and path.stat().st_size > 1000, path
        assert subprocess.run(["afinfo", str(path)], capture_output=True).returncode == 0, path
        assert item["generation_id"] and item["duration_seconds"]
        assert item["voice_name"] and item["voice_id"]
        assert item["model_id"] == "eleven_v4"
        by_volume.setdefault(item["volume"], []).append(item)

    for volume_name, group in by_volume.items():
        volume = AUDIO / volume_name
        manifest = volume / "manifest.csv"
        rows = read_csv(manifest)[1] if manifest.exists() else []
        assert len(list(volume.glob("*.mp3"))) <= 200
        for item in group:
            text = item["celan_text"]
            path = volume / item["audio_file"]
            attention = []
            if re.search(r"(?<!\w)I(?!\w)", text):
                attention.append("Review standalone I pronunciation")
            if "x" in text.casefold():
                attention.append("Review x pronunciation")
            if "ae" in text.casefold():
                attention.append("Review ae vowel")
            rows.append(
                dict(
                    slot=str(len(rows) + 1),
                    source_id=item["entry_id"],
                    source_kind="Dictionary example",
                    celan_text=text,
                    pronunciation="",
                    natural_meaning=item["translation"],
                    source_review_status="Approved in dictionary app by user",
                    audio_file=item["audio_file"],
                    voice_name=item["voice_name"],
                    voice_id=item["voice_id"],
                    model_id=item["model_id"],
                    generation_id=item["generation_id"],
                    duration_seconds=str(item["duration_seconds"]),
                    bytes=str(path.stat().st_size),
                    sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
                    audio_review_status="Unflagged; available for app playback",
                    pronunciation_attention="; ".join(attention),
                    app_integration_status="Integrated in local dictionary app after catalog rebuild",
                    source_pass=pass_name,
                    generation_prompt=item.get("generation_prompt", text),
                )
            )
        write_csv(manifest, fields, rows)

        count = len(list(volume.glob("*.mp3")))
        kinds = {kind: sum(row["source_kind"] == kind for row in rows) for kind in ("Expression", "Dictionary example")}
        readme = volume / "README.md"
        if readme.exists():
            body = readme.read_text()
            body = re.sub(
                r"^Capacity: 200 clips\. Currently:.*$",
                f"Capacity: 200 clips. Currently: {count} clips: {kinds['Expression']} Expressions entries and {kinds['Dictionary example']} dictionary example sentences. Add future clips here until the folder reaches 200; then start the next volume.",
                body,
                count=1,
                flags=re.MULTILINE,
            )
        else:
            body = (
                f"# Celan dictionary audio · {volume_name.replace('_', ' ')}\n\n"
                f"Capacity: 200 clips. Currently: {count} clips: {kinds['Expression']} Expressions entries and {kinds['Dictionary example']} dictionary example sentences. Add future clips here until the folder reaches 200; then start the next volume.\n\n"
                "Each MP3 starts with its stable source ID and includes readable Celan text. The manifest records the source, translation, voice, model, checksum, and review state. Unflagged audio is available in the local dictionary app after its catalog is rebuilt.\n"
            )
        readme.write_text(body)

    volume_counts = {
        path.name: len(list(path.glob("*.mp3")))
        for path in sorted(AUDIO.glob("volume_???"))
        if path.is_dir()
    }
    current = max(volume_counts)
    root_readme = AUDIO / "README.md"
    body = root_readme.read_text()
    body = re.sub(
        r"^Current folder:.*$",
        f"Current folder: [{current}]({current}/README.md), with {volume_counts[current]} clips and room for {200 - volume_counts[current]} more.",
        body,
        count=1,
        flags=re.MULTILINE,
    )
    root_readme.write_text(body)
    print(json.dumps({"recorded": len(items), "volume_counts": volume_counts}))


if __name__ == "__main__":
    main(sys.argv[1], json.loads(sys.argv[2]))
