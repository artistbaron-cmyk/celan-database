"""Install the user-approved final Ayinde correction and archive its flagged take."""

import csv
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
from urllib.parse import urlparse
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[2]
RETAKES = ROOT / "audio/retakes/volume_001"
SOURCE = ROOT / "audio/expressions/volume_007"
ARCHIVE = ROOT / "audio/retakes/superseded_originals"
SOURCE_ID = "PE-ER2-0078"
FILENAME = "PE-ER2-0078 - var ser an dren.mp3"
VOICE_ID = "77aEIu0qStu8Jwv1EdhX"
VOICE_NAME = "Ayinde - young British Nigerian"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def csv_data(path):
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)


def save_csv(path, fields, rows):
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main():
    result_path = ROOT / "audio/retakes/.final_result.json"
    result = json.loads(result_path.read_text())
    assert result["status"] == "completed"
    assert result["model_id"] == "eleven_v4"
    assert result["prompt"] == "var ser an dren."
    assert result["generation_id"]
    url = urlparse(result["content_url"])
    assert url.scheme == "https" and url.hostname == "storage.googleapis.com"
    assert url.path.startswith("/xi-backend/database/workspace/f11dacdb41c24801a857b71a40aec625/content_generation/")

    original = SOURCE / ("ERROR_" + FILENAME)
    target = SOURCE / FILENAME
    candidate = RETAKES / ("Ayinde_" + FILENAME)
    archived = ARCHIVE / "expressions/volume_007" / ("original_" + FILENAME)
    source_manifest = SOURCE / "manifest.csv"
    retake_manifest = RETAKES / "manifest.csv"
    archive_index = ARCHIVE / "before_swap.json"
    source_fields, source_rows = csv_data(source_manifest)
    retake_fields, retake_rows = csv_data(retake_manifest)
    archive_rows = json.loads(archive_index.read_text())
    assert len(retake_rows) == len(archive_rows) == 142
    matched = [r for r in source_rows if r["source_id"] == SOURCE_ID]
    assert len(matched) == 1
    row = matched[0]
    before = dict(row)
    assert row["audio_file"] == original.name
    assert row["celan_text"] == result["prompt"]
    assert row["audio_review_status"] == "Needs correction"
    assert row["source_review_status"] == "Approved"
    assert original.is_file() and digest(original) == row["sha256"]
    assert not target.exists() and not candidate.exists() and not archived.exists()
    assert not any(r["source_id"] == SOURCE_ID for r in retake_rows)

    # Download and validate before altering the active volume.
    temp_download = RETAKES / (".download_" + FILENAME)
    with temp_download.open("xb") as output, urlopen(result["content_url"], timeout=60) as response:
        while chunk := response.read(1024 * 1024):
            output.write(chunk)
    assert temp_download.stat().st_size > 1000
    info = subprocess.run(["afinfo", str(temp_download)], capture_output=True, text=True)
    assert info.returncode == 0
    duration = re.search(r"estimated duration:\s*([0-9.]+) sec", info.stdout)
    assert duration and float(duration.group(1)) > 0
    checksum = digest(temp_download)
    size = str(temp_download.stat().st_size)

    archived.parent.mkdir(parents=True, exist_ok=True)
    with archived.open("xb") as output, original.open("rb") as input_file:
        shutil.copyfileobj(input_file, output)
    assert digest(archived) == before["sha256"]
    temp_target = SOURCE / (".swap_" + FILENAME)
    with temp_target.open("xb") as output, temp_download.open("rb") as input_file:
        shutil.copyfileobj(input_file, output)
    assert digest(temp_target) == checksum

    retake = {key: "" for key in retake_fields}
    retake.update(
        slot=str(len(retake_rows) + 1), collection="expressions", source_id=SOURCE_ID,
        source_text=row["celan_text"], dictionary_pronunciation=row["pronunciation"],
        original_file=str(original.relative_to(ROOT)), original_sha256=before["sha256"],
        candidate_file=candidate.name, voice_name=VOICE_NAME, voice_id=VOICE_ID,
        model_id="eleven_v4", generation_id=result["generation_id"],
        generation_prompt=result["prompt"], duration_seconds=str(result["duration_secs"]),
        bytes=size, sha256=checksum, audio_review_status="Approved by user",
        app_integration_status="Not integrated", generated_bytes=size,
        generated_sha256=checksum, current_duration_seconds=duration.group(1),
        user_edited_audio="No", approved_on="2026-10-16",
    )
    retake_rows.append(retake)
    row.update(
        audio_file=target.name, voice_name=VOICE_NAME, voice_id=VOICE_ID,
        model_id="eleven_v4", generation_id=result["generation_id"],
        generation_prompt=result["prompt"], duration_seconds=duration.group(1),
        bytes=size, sha256=checksum, audio_review_status="Approved by user",
        pronunciation_attention="",
    )
    archive_rows.append({
        "collection": "expressions", "source_id": SOURCE_ID,
        "original_file": str(original.relative_to(ROOT)),
        "archived_file": str(archived.relative_to(ROOT)),
        "promoted_file": str(target.relative_to(ROOT)),
        "approved_retake_file": str(candidate.relative_to(ROOT)),
        "source_manifest": str(source_manifest.relative_to(ROOT)),
        "source_row_before_swap": before,
    })
    source_tmp = SOURCE / ".swap_manifest.csv"
    retake_tmp = RETAKES / ".swap_manifest.csv"
    archive_tmp = ARCHIVE / ".swap_before_swap.json"
    assert not source_tmp.exists() and not retake_tmp.exists() and not archive_tmp.exists()
    save_csv(source_tmp, source_fields, source_rows)
    save_csv(retake_tmp, retake_fields, retake_rows)
    archive_tmp.write_text(json.dumps(archive_rows, ensure_ascii=False, indent=2) + "\n")

    os.replace(temp_download, candidate)
    os.replace(temp_target, target)
    os.replace(source_tmp, source_manifest)
    os.replace(retake_tmp, retake_manifest)
    os.replace(archive_tmp, archive_index)
    assert digest(candidate) == digest(target) == checksum
    original.unlink()
    result_path.unlink()
    print(f"Installed final approved retake: {SOURCE_ID}")


if __name__ == "__main__":
    main()
