"""Build an ElevenLabs performance copy from the written Volume 1 dialogue."""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "everyday_conversations_volume_01.md"
OUTPUT = ROOT / "everyday_conversations_volume_01_recording_copy.md"

# One mood cue per turn. Cues guide performance and are never learner spelling.
MOODS = {
    1: "curious warm checking friendly".split(),
    2: "asking welcoming polite encouraging".split(),
    3: "respectful warm asking encouraging pleased".split(),
    4: "checking correcting checking helpful helpful".split(),
    5: "noticing concerned explaining generous concerned reassuring".split(),
    6: "checking correcting noticing recognizing relieved".split(),
    7: "matter_of_fact checking disappointed offering grateful".split(),
    8: "curious clear curious warm understanding".split(),
    9: "instructing focused checking certain".split(),
    10: "checking confirming polite welcoming delighted".split(),
    11: "curious uncertain eager agreeable".split(),
    12: "inviting hesitant guiding ready".split(),
    13: "inviting declining adjusting eager".split(),
    14: "inviting competitive playful teasing agreeable".split(),
    15: "noticing hopeful firm accepting".split(),
    16: "assuming correcting surprised warm".split(),
    17: "counting asking generous focused focused".split(),
    18: "uncomfortable noticing hopeful agreeable".split(),
    19: "noticing curious guiding delighted surprised".split(),
    20: "alert noticing practical cooperative".split(),
    21: "quietly noticing awed softly warm".split(),
    22: "checking honest helpful cooperative".split(),
    23: "focused offering directing cooperative satisfied".split(),
    24: "offering cautious gentle appreciative".split(),
    25: "testing helpful trying checking relieved".split(),
    26: "respectful warm tentative inviting confident".split(),
    27: "pointing curious encouraging moved".split(),
    28: "teasing firm apologetic offering agreeable".split(),
    29: "searching gently remembering warm".split(),
    30: "warm curious inviting joining gently soft".split(),
}


def spoken(line: str) -> str:
    """Apply established sound cues and keep punctuation light."""
    line = re.sub(r"\bI\b", "ee", line)
    line = re.sub(r"\bInko\b", "eenko", line, flags=re.I)
    line = re.sub(r"\bLialor\b", "lee-ahlohr", line, flags=re.I)
    line = line.replace("x", "ks").replace("X", "Ks")
    return line.replace(".", "").replace(",", "").strip()


def main() -> None:
    source = SOURCE.read_text()
    parts = re.split(r"(?=^## \d+\. )", source, flags=re.M)[1:]
    if len(parts) != 30:
        raise ValueError(f"Expected 30 scenes, found {len(parts)}")
    out = [
        "# Volume 1 — ElevenLabs performance copy",
        "",
        "This derives from [the written Celan scenes](everyday_conversations_volume_01.md).",
        "Tags and sound spellings are for audio generation only; use the written script for subtitles.",
        "Keep one voice per character: Nara (Ayinde), Toren (Lily), and Liorin (Ehshara).",
        "Periods and commas are omitted for flow; question marks remain.",
        "",
    ]
    for part in parts:
        heading = part.splitlines()[0]
        number = int(re.match(r"## (\d+)\.", heading).group(1))
        rows = re.findall(
            r"^\| (Nara|Toren|Liorin) \| `([^`]+)` \| ([^|]+) \|$",
            part,
            flags=re.M,
        )
        moods = MOODS[number]
        if len(rows) != len(moods):
            raise ValueError(f"Scene {number}: {len(rows)} turns, {len(moods)} moods")
        out.extend([heading, "", "```text"])
        for (speaker, celan, _english), mood in zip(rows, moods):
            out.append(f"{speaker}: [{mood.replace('_', ' ')}] {spoken(celan)}")
        out.extend(["```", ""])
    OUTPUT.write_text("\n".join(out))


if __name__ == "__main__":
    main()
