"""Select explicit dictionary variant forms for a separate audio collection."""

import csv
import json
import pathlib


ROOT = pathlib.Path(__file__).resolve().parents[3]
SOURCE = ROOT / "dictionary/app_data/dictionary_entries.csv"
VOLUME = pathlib.Path(__file__).resolve().parent / "volume_001"
FIELDS = [
    "slot", "variant_id", "parent_headword_id", "parent_headword", "variant_form",
    "dictionary_pronunciation", "audio_file", "voice_name", "voice_id", "model_id",
    "generation_id", "generation_prompt", "duration_seconds", "bytes", "sha256",
    "audio_review_status", "app_integration_status",
]


def prompt_for(form, pronunciation):
    if "aen" not in form.casefold() and "x" not in form.casefold() and form.isascii():
        return form
    prompt = pronunciation.strip("/").replace("kh", "ks")
    for old, new in (("ah-ehn", "a-en"), ("ah", "a"), ("eh", "e"), ("oh", "o")):
        prompt = prompt.replace(old, new)
    return prompt[0].upper() + prompt[1:]


def main():
    assert not VOLUME.exists(), f"Volume already exists: {VOLUME}"
    entries = list(csv.DictReader(SOURCE.open(newline="")))
    headwords = {row["headword"].strip().casefold() for row in entries}
    items = []
    seen = set()
    for row in entries:
        metadata = json.loads(row["metadata_json"] or "{}") or {}
        for number, variant in enumerate(metadata.get("variants", []), 1):
            form = variant["form"].strip()
            pronunciation = variant["pronunciation"].strip()
            assert form and pronunciation and form.casefold() not in seen
            assert form.casefold() not in headwords
            assert "/" not in form and "\\" not in form
            seen.add(form.casefold())
            ident = f"{row['id']}#v{number:02}"
            items.append(dict(
                variant_id=ident,
                parent_headword_id=row["id"],
                parent_headword=row["headword"],
                variant_form=form,
                dictionary_pronunciation=pronunciation,
                generation_prompt=prompt_for(form, pronunciation),
                audio_file=f"HV-{row['id']}-v{number:02} - {form}.mp3",
                status="selected",
            ))
    assert len(items) <= 200
    VOLUME.mkdir(parents=True)
    state = dict(voice_name="Ehshara", voice_id="ej0ekewUzWvTFUiKsxvp", model_id="eleven_v4", items=items)
    (VOLUME / ".pending_batch.json").write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
    with (VOLUME / "manifest.csv").open("w", newline="") as handle:
        csv.DictWriter(handle, fieldnames=FIELDS).writeheader()
    print(f"Selected {len(items)} explicit variants")


if __name__ == "__main__":
    main()
