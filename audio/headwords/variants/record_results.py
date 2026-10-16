"""Download and record completed variant speech takes without overwrites."""

import csv
import hashlib
import json
import os
import pathlib
import subprocess
import sys
import urllib.parse
import urllib.request

from prepare import FIELDS, ROOT, VOLUME


ALLOWED_PATH = "/xi-backend/database/workspace/f11dacdb41c24801a857b71a40aec625/content_generation/"


def write_json(path, value):
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    os.replace(temp, path)


def write_csv(path, rows):
    temp = path.with_suffix(path.suffix + ".tmp")
    with temp.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    os.replace(temp, path)


def main(results_path):
    journal = VOLUME / ".pending_batch.json"
    manifest = VOLUME / "manifest.csv"
    state = json.loads(journal.read_text())
    rows = list(csv.DictReader(manifest.open(newline="")))
    results = json.loads(pathlib.Path(results_path).read_text())
    assert 1 <= len(results) <= 30
    for result in results:
        index = result["index"]
        item = state["items"][index]
        if item["status"] == "recorded":
            assert any(row["variant_id"] == item["variant_id"] and row["generation_id"] == result["id"] for row in rows)
            continue
        assert item["status"] == "selected"
        assert result["status"] == "completed"
        assert result["prompt"] == item["generation_prompt"]
        assert result["model_id"] == state["model_id"] == "eleven_v4"
        assert result["id"] == result["generation_id"]
        assert float(result["duration_secs"]) > 0
        assert not any(row["variant_id"] == item["variant_id"] or row["generation_id"] == result["id"] for row in rows)
        url = urllib.parse.urlparse(result["content_url"])
        assert url.scheme == "https" and url.hostname == "storage.googleapis.com" and url.path.startswith(ALLOWED_PATH)
        path = VOLUME / item["audio_file"]
        assert path.parent == VOLUME and path.name == item["audio_file"] and not path.exists()
        fd = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o644)
        try:
            with os.fdopen(fd, "wb") as output, urllib.request.urlopen(result["content_url"], timeout=60) as response:
                while chunk := response.read(1024 * 1024):
                    output.write(chunk)
            assert path.stat().st_size > 1000
            assert subprocess.run(["afinfo", str(path)], capture_output=True).returncode == 0
        except Exception:
            path.unlink(missing_ok=True)
            raise
        row = dict(
            slot=str(len(rows) + 1), variant_id=item["variant_id"],
            parent_headword_id=item["parent_headword_id"], parent_headword=item["parent_headword"],
            variant_form=item["variant_form"], dictionary_pronunciation=item["dictionary_pronunciation"],
            audio_file=item["audio_file"], voice_name=state["voice_name"], voice_id=state["voice_id"],
            model_id=state["model_id"], generation_id=result["id"], generation_prompt=item["generation_prompt"],
            duration_seconds=str(result["duration_secs"]), bytes=str(path.stat().st_size),
            sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
            audio_review_status="Pending human listening review", app_integration_status="Not integrated",
        )
        rows.append(row)
        write_csv(manifest, rows)
        item["status"] = "recorded"
        item["generation_id"] = result["id"]
        write_json(journal, state)
    pathlib.Path(results_path).unlink()
    print(f"Recorded {len(rows)} of {len(state['items'])} variants")
    if all(item["status"] == "recorded" for item in state["items"]):
        journal.rename(VOLUME / ".completed_batch.json")


if __name__ == "__main__":
    main(sys.argv[1])
