"""Create one Braon v4 comparison take with explicit voice settings.

Requires ELEVENLABS_API_KEY in the process environment. The key is never
written to disk or printed. Run with --dry-run to inspect the request without
using credits. The output stays in volume_010/voice_review and is never added
to a volume manifest automatically.
"""

import argparse
import getpass
import json
import os
import pathlib
import urllib.error
import urllib.request


ROOT = pathlib.Path(__file__).resolve().parent
OUTPUT_DIR = ROOT / "volume_010" / "voice_review"
VOICE_ID = "X4Lh5Ftnso6JSt25plzX"
ENDPOINT = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128"


def fraction(value):
    result = float(value)
    if not 0 <= result <= 1:
        raise argparse.ArgumentTypeError("Value must be between 0 and 1")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--text", default="rinaen ser an mekeshpral.")
    parser.add_argument("--stability", type=fraction, default=0.57)
    parser.add_argument("--similarity", type=fraction, default=0.90)
    parser.add_argument("--filename", default="Braon-v4-manual-settings-test.mp3")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--prompt-key", action="store_true", help="Read API key privately from the terminal instead of the environment")
    args = parser.parse_args()

    if pathlib.Path(args.filename).name != args.filename or not args.filename.endswith(".mp3"):
        parser.error("--filename must be one MP3 basename")
    if not args.text.strip() or len(args.text) > 500:
        parser.error("--text must contain 1 to 500 characters")

    payload = {
        "text": args.text,
        "model_id": "eleven_v4",
        "voice_settings": {
            "stability": args.stability,
            "similarity_boost": args.similarity,
        },
    }
    output = OUTPUT_DIR / args.filename
    if args.dry_run:
        print(json.dumps({"endpoint": ENDPOINT, "payload": payload, "output": str(output)}))
        return

    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key and args.prompt_key:
        key = getpass.getpass("ElevenLabs API key (input hidden): ")
    if not key:
        parser.error("Set ELEVENLABS_API_KEY or use --prompt-key in a local terminal")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if output.exists():
        parser.error(f"Output already exists: {output}")

    request = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            audio = response.read()
    except urllib.error.HTTPError as error:
        raise SystemExit(f"ElevenLabs returned HTTP {error.code}; no file was written") from error
    if len(audio) <= 1000 or not audio.startswith(b"ID3"):
        raise SystemExit("ElevenLabs response was not a valid sized MP3; no file was written")
    with output.open("xb") as handle:
        handle.write(audio)
    print(json.dumps({"output": str(output), "bytes": len(audio), "model_id": "eleven_v4", "voice_id": VOICE_ID, "voice_settings": payload["voice_settings"]}))


if __name__ == "__main__":
    main()
