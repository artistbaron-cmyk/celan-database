"""Record one downloaded pass from a headword volume journal."""

import json
import pathlib
import sys

from record_batch import main as record_batch


ROOT = pathlib.Path(__file__).resolve().parent


def main(volume_number, pass_number):
    assert volume_number >= 2 and 1 <= pass_number <= 7
    volume = ROOT / f"volume_{volume_number:03}"
    journal = volume / f".pending_batch_{volume_number:03}.json"
    state = json.loads(journal.read_text())
    group = state["items"][(pass_number - 1) * 30 : pass_number * 30]
    assert group and all(item["status"] == "downloaded" for item in group)
    items = []
    for item in group:
        row = {key: item[key] for key in (
            "headword_id", "headword", "dictionary_pronunciation", "source_entry_ids",
            "generation_prompt", "audio_file", "volume", "generation_id", "duration_seconds"
        )}
        row.update(voice_name=state["voice_name"], voice_id=state["voice_id"], model_id=state["model_id"])
        items.append(row)
    record_batch(f"pass_{pass_number:02}", items)
    for item in group:
        item["status"] = "recorded"
    journal.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
    if all(item["status"] == "recorded" for item in state["items"]):
        journal.rename(journal.with_name(f".completed_batch_{volume_number:03}.json"))


if __name__ == "__main__":
    main(int(sys.argv[1]), int(sys.argv[2]))
