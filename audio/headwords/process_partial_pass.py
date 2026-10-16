"""Recover a partially generated headword pass without remaking finished takes."""

import json
import pathlib
import sys

from record_batch import main as record_batch


ROOT = pathlib.Path(__file__).resolve().parent


def paths(volume_number, label):
    assert label in {"04a", "04b"}
    volume = ROOT / f"volume_{volume_number:03}"
    return (
        volume,
        volume / f".pending_batch_{volume_number:03}.json",
        volume / f".results_pass_{label}.json",
        volume / f".pending_downloads_pass_{label}.json",
    )


def prepare(volume_number, label):
    volume, journal, results_path, queue_path = paths(volume_number, label)
    state = json.loads(journal.read_text())
    results = json.loads(results_path.read_text())
    assert 1 <= len(results) <= 30 and not queue_path.exists()
    queue = []
    for result in results:
        index = result["index"]
        item = state["items"][index]
        assert item["status"] == "selected"
        assert result["status"] == "completed"
        assert result["prompt"] == item["generation_prompt"]
        assert result["model_id"] == state["model_id"] == "eleven_v4"
        assert result["generation_id"] == result["id"]
        assert result["content_url"] and float(result["duration_secs"]) > 0
        assert not (volume / item["audio_file"]).exists()
        item["generation_id"] = result["id"]
        item["duration_seconds"] = result["duration_secs"]
        item["status"] = "generated"
        queue.append({"audio_file": item["audio_file"], "content_url": result["content_url"]})
    journal.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
    queue_path.write_text(json.dumps(queue, ensure_ascii=False, indent=2) + "\n")
    print(queue_path)


def finish(volume_number, label):
    volume, journal, results_path, queue_path = paths(volume_number, label)
    assert not queue_path.exists(), f"Download queue remains: {queue_path}"
    state = json.loads(journal.read_text())
    results = json.loads(results_path.read_text())
    items = []
    for result in results:
        item = state["items"][result["index"]]
        assert item["status"] == "generated"
        assert (volume / item["audio_file"]).is_file()
        row = {key: item[key] for key in (
            "headword_id", "headword", "dictionary_pronunciation", "source_entry_ids",
            "generation_prompt", "audio_file", "volume", "generation_id", "duration_seconds"
        )}
        row.update(voice_name=state["voice_name"], voice_id=state["voice_id"], model_id=state["model_id"])
        items.append(row)
    record_batch(f"pass_{label}", items)
    for result in results:
        state["items"][result["index"]]["status"] = "recorded"
    journal.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
    results_path.unlink()
    if all(item["status"] == "recorded" for item in state["items"]):
        journal.rename(journal.with_name(f".completed_batch_{volume_number:03}.json"))


if __name__ == "__main__":
    command, volume_number, label = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    if command == "prepare":
        prepare(volume_number, label)
    elif command == "finish":
        finish(volume_number, label)
    else:
        raise ValueError(command)
