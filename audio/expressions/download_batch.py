"""Download approved Celan speech generations from a JSON queue.

Each queue item has ``audio_file`` and a short-lived ElevenLabs ``content_url``.
The script only writes new MP3s under volumes 7 through 10, or the volume 10
voice review folder, and never replaces a file.
"""

import json
import os
import pathlib
import sys
import urllib.parse
import urllib.request


AUDIO = pathlib.Path(__file__).resolve().parent
ALLOWED_PATH = "/xi-backend/database/workspace/f11dacdb41c24801a857b71a40aec625/content_generation/"


def main(queue_path):
    queue = pathlib.Path(queue_path).resolve()
    volume = queue.parent
    normal_volume = volume.parent == AUDIO and volume.name in {"volume_007", "volume_008", "volume_009", "volume_010"}
    review_folder = volume == AUDIO / "volume_010" / "voice_review"
    if not (normal_volume or review_folder):
        raise ValueError("Queue must be inside a permitted volume or volume_010/voice_review")
    if not queue.name.startswith(".pending_downloads_pass_") or queue.suffix != ".json":
        raise ValueError("Unexpected queue filename")
    items = json.loads(queue.read_text())
    if not isinstance(items, list) or not 1 <= len(items) <= 30:
        raise ValueError("Queue must contain 1 to 30 clips")
    names = [item["audio_file"] for item in items]
    if len(names) != len(set(names)):
        raise ValueError("Duplicate output filenames")

    for item in items:
        name = item["audio_file"]
        url = item["content_url"]
        parsed = urllib.parse.urlparse(url)
        if pathlib.Path(name).name != name or not name.startswith("PE-") or not name.endswith(".mp3"):
            raise ValueError(f"Invalid output filename: {name}")
        if parsed.scheme != "https" or parsed.hostname != "storage.googleapis.com" or not parsed.path.startswith(ALLOWED_PATH):
            raise ValueError("Unexpected download URL")
        if (volume / name).exists():
            raise FileExistsError(volume / name)

    for item in items:
        path = volume / item["audio_file"]
        fd = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o644)
        try:
            with os.fdopen(fd, "wb") as output, urllib.request.urlopen(item["content_url"], timeout=60) as response:
                while chunk := response.read(1024 * 1024):
                    output.write(chunk)
            if path.stat().st_size <= 1000:
                raise ValueError(f"Downloaded file is too small: {path}")
            print(path.name, flush=True)
        except Exception:
            path.unlink(missing_ok=True)
            raise
    queue.unlink()


if __name__ == "__main__":
    main(sys.argv[1])
