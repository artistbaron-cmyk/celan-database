"""Stage and record one completed ElevenLabs headword pass.

The intermediate results file is written after polling the connector. Run
``prepare`` to make a download queue, the project downloader on that queue,
then ``finish`` to validate the MP3s and append the manifest rows.
"""

import json
import pathlib
import sys

from record_pending_pass import main as record_pending_pass


ROOT = pathlib.Path(__file__).resolve().parent


def paths(volume, number):
    assert 1 <= number <= 7
    return (
        volume / f".results_pass_{number:02}.json",
        volume / f".pending_downloads_pass_{number:02}.json",
    )


def group_for(state, number):
    return state["items"][(number - 1) * 30 : number * 30]


def prepare(volume_number, number):
    volume = ROOT / f"volume_{volume_number:03}"
    journal = volume / f".pending_batch_{volume_number:03}.json"
    results_path, queue_path = paths(volume, number)
    state = json.loads(journal.read_text())
    group = group_for(state, number)
    results = json.loads(results_path.read_text())
    assert len(results) == len(group) and len(group) <= 30
    assert not queue_path.exists()
    queue = []
    for offset, (item, result) in enumerate(zip(group, results)):
        assert result["index"] == (number - 1) * 30 + offset
        assert result["status"] == "completed"
        assert result["prompt"] == item["generation_prompt"]
        assert result["model_id"] == state["model_id"] == "eleven_v4"
        assert result["generation_id"] == result["id"]
        assert result["content_url"] and float(result["duration_secs"]) > 0
        assert item["status"] == "selected"
        assert not (volume / item["audio_file"]).exists()
        item["generation_id"] = result["id"]
        item["duration_seconds"] = result["duration_secs"]
        item["status"] = "generated"
        queue.append({"audio_file": item["audio_file"], "content_url": result["content_url"]})
    journal.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
    queue_path.write_text(json.dumps(queue, ensure_ascii=False, indent=2) + "\n")
    print(queue_path)


def finish(volume_number, number):
    volume = ROOT / f"volume_{volume_number:03}"
    journal = volume / f".pending_batch_{volume_number:03}.json"
    results_path, queue_path = paths(volume, number)
    assert not queue_path.exists(), f"Download queue remains: {queue_path}"
    state = json.loads(journal.read_text())
    group = group_for(state, number)
    assert all(item["status"] == "generated" for item in group)
    assert all((volume / item["audio_file"]).is_file() for item in group)
    for item in group:
        item["status"] = "downloaded"
    journal.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
    record_pending_pass(volume_number, number)
    results_path.unlink()


if __name__ == "__main__":
    command, volume_number, number = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    if command == "prepare":
        prepare(volume_number, number)
    elif command == "finish":
        finish(volume_number, number)
    else:
        raise ValueError(command)
