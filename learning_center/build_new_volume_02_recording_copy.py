"""Build the performance copy from the learner-facing Celan dialogue."""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "everyday_conversations_volume_02_celan_vernacular.md"
OUTPUT = ROOT / "new_volume_02_recording_copy.md"

# One cue per speaker turn. The cue shapes delivery; it is not Celan text.
MOODS = {
    1: "curious sheepish surprised sheepish reassuring".split(),
    2: "inviting hopeful matter_of_fact playful teasing earnest".split(),
    3: "asking apologetic hopeful offering warm".split(),
    4: "planning matter_of_fact adjusting uncertain patient".split(),
    5: "asking helpful puzzled correcting surprised sheepish".split(),
    6: "checking certain checking confused teasing sheepish".split(),
    7: "searching helpful checking guiding surprised".split(),
    8: "asking checking reassuring agreeable".split(),
    9: "asking strained correcting amused conceding".split(),
    10: "asking practical cooperative guiding checking confirming".split(),
    11: "welcoming hesitant helpful concerned understanding".split(),
    12: "tentative caring polite reassuring accepting offering".split(),
    13: "asking apologetic urgent helpful checking reassuring".split(),
    14: "inquiring matter_of_fact checking deadpan surprised playful relieved".split(),
    15: "sheepish reassuring checking encouraging promising".split(),
    16: "careful clear concerned firm careful reassuring".split(),
    17: "upset surprised explaining apologetic cautious helpful".split(),
    18: "asking confirming surprised helpful understanding".split(),
    19: "polite welcoming checking explaining agreeable".split(),
    20: "offering generous concerned matter_of_fact curious amused".split(),
    21: "uncertain clear strained emphatic understanding".split(),
    22: "instructing checking urgent confirming reassuring".split(),
    23: "polite busy checking explaining agreeable welcoming".split(),
    24: "concerned warning asking reassuring accepting".split(),
    25: "checking frustrated planning hopeful agreeing".split(),
    26: "concerned quietly gently softly reassuring".split(),
    27: "tired focused vulnerable understanding relieved".split(),
    28: "uncertain explaining apologetic gently asking reassuring".split(),
    29: "softly concerned hushed understanding".split(),
    30: "checking steady concerned reassuring curious playful".split(),
}


def spoken(line: str) -> str:
    """Keep spelling unless a known English-reader pronunciation needs help."""
    line = re.sub(r"\bI\b", "ee", line)
    line = re.sub(r"\bInko\b", "eenko", line, flags=re.I)
    line = re.sub(r"\bLialor\b", "lee-ahlohr", line, flags=re.I)
    line = re.sub(r"\bAivaen\b", "eye-vah-ehn", line, flags=re.I)
    line = re.sub(r"\bTovaenath\b", "toh-vah-eh-nahth", line, flags=re.I)
    line = line.replace("x", "ks").replace("X", "Ks")
    line = line.replace(".", "").replace(",", "")
    return line.strip()


def main() -> None:
    source = SOURCE.read_text()
    parts = re.split(r"(?=^## \d+\. )", source, flags=re.M)[1:]
    out = [
        "# New Volume 2 — ElevenLabs performance copy",
        "",
        "This derives from [the written Celan scenes](everyday_conversations_volume_02_celan_vernacular.md).",
        "Tags and sound spellings are for recording only. Do not use this text as learner spelling or subtitles.",
        "Nara: Ayinde. Toren: Lily. Give Varadan a distinct third voice.",
        "Periods and commas are omitted to keep the acting moving; question marks remain.",
        "",
    ]
    if len(parts) != 30:
        raise ValueError(f"Expected 30 scenes, found {len(parts)}")
    for part in parts:
        heading = part.splitlines()[0]
        number = int(re.match(r"## (\d+)\.", heading).group(1))
        rows = re.findall(r"^\| (Nara|Toren|Varadan) \| `([^`]+)` \| ([^|]+) \|$", part, re.M)
        moods = MOODS[number]
        if len(rows) != len(moods):
            raise ValueError(f"Scene {number}: {len(rows)} rows, {len(moods)} cues")
        out += [heading, "", "```text"]
        for (speaker, celan, _english), mood in zip(rows, moods):
            out.append(f"{speaker}: [{mood.replace('_', ' ')}] {spoken(celan)}")
        out += ["```", ""]
    OUTPUT.write_text("\n".join(out))


if __name__ == "__main__":
    main()
