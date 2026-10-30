"""Build mood-matched ElevenLabs dialogue input from the Volume 3 learner script."""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "everyday_conversations_volume_03_celan_vernacular.md"
OUTPUT = ROOT / "everyday_conversations_volume_03_recording_copy.md"

# These cues describe the line's intention, not its meaning. One cue per turn.
MOODS = {
    1: "certain checking sheepish helpful apologetic checking warm".split(),
    2: "puzzled explaining checking clear understanding".split(),
    3: "firm sheepish testing agreeable dry".split(),
    4: "counting noticing sheepish practical concerned offering relieved".split(),
    5: "concerned matter_of_fact defensive dry realizing".split(),
    6: "protective honest helpful checking reassuring".split(),
    7: "confident correcting defensive precise understanding".split(),
    8: "checking firm curious explaining cooperative appreciative".split(),
    9: "planning checking focused impatient measured urgent hurrying relieved".split(),
    10: "certain noticing surprised concerned generous".split(),
    11: "reporting correcting firm sheepish cooperative".split(),
    12: "checking precise puzzled confirming dry".split(),
    13: "clear mishearing correcting sheepish helpful".split(),
    14: "strained checking practical helpful relieved".split(),
    15: "certain explaining puzzled dry conceding".split(),
    16: "urgent puzzled guiding finding strained".split(),
    17: "asking checking correcting apologetic confirming".split(),
    18: "frustrated noticing checking correcting relieved".split(),
    19: "guiding confused clarifying understanding helpful".split(),
    20: "asking explaining urgent confirming concerned reassuring".split(),
    21: "searching helpful frustrated responding relieved".split(),
    22: "checking answering explaining guiding finding".split(),
    23: "checking frustrated suggesting firm guiding tired".split(),
    24: "firm protesting practical complying welcoming".split(),
    25: "decided checking explaining helping appreciative".split(),
    26: "asking reassuring deciding checking confirming guiding".split(),
    27: "puzzled cautioning incredulous firm accepting caring".split(),
    28: "counting concerned reassuring urgent concentrating checking relieved ready".split(),
    29: "firm concerned asking offering agreeing checking dry".split(),
    30: "noticing tired reporting checking exhausted warm".split(),
}


def spoken(text: str) -> str:
    """Change sound cues only; the learner text remains untouched."""
    text = re.sub(r"\bI\b", "ee", text)
    text = re.sub(r"\bInko\b", "eenko", text, flags=re.I)
    text = re.sub(r"\bLialor\b", "lee-ahlohr", text, flags=re.I)
    # New precision words have approved dictionary pronunciations.
    sound_spellings = {
        "nevu": "neh-voo",
        "arin": "ah-reen",
        "mbetu": "mbeh-too",
        "senu": "seh-noo",
        "korineth": "koh-ree-nehth",
        "drenkavvek": "drehn-kahv-vehk",
        "drenkavvekin": "drehn-kahv-veh-keen",
        "feldrenaen": "fehl-dreh-nah-ehn",
    }
    for written, sound in sound_spellings.items():
        text = re.sub(rf"\b{written}\b", sound, text, flags=re.I)
    # Continue the chosen x reading used in the first two dialogue volumes.
    text = text.replace("x", "ks").replace("X", "Ks")
    text = text.replace(".", "").replace(",", "")
    return text.strip()


def main() -> None:
    source = SOURCE.read_text()
    scenes = re.split(r"(?=^## \d+\. )", source, flags=re.M)[1:]
    if len(scenes) != 30:
        raise ValueError(f"Expected 30 scenes, found {len(scenes)}")
    out = [
        "# Volume 3 — ElevenLabs dialogue performance copy",
        "",
        "Derived from [the written Celan and English scenes](everyday_conversations_volume_03_celan_vernacular.md).",
        "Savi: Lily. Dalen: Ayinde. Meva: Ehshara. Use Eleven v4 Dialogue mode.",
        "Tags and sound spellings are recording instructions only. Subtitles use the written Celan.",
        "Periods and commas are omitted so the acting can flow; question marks remain.",
        "",
    ]
    total_turns = 0
    for number, scene in enumerate(scenes, 1):
        heading = scene.splitlines()[0]
        if not heading.startswith(f"## {number}. "):
            raise ValueError(f"Unexpected heading: {heading}")
        rows = re.findall(r"^\| (Savi|Dalen|Meva) \| `([^`]+)` \| ([^|]+) \|$", scene, re.M)
        cues = MOODS[number]
        if len(rows) != len(cues):
            raise ValueError(f"Scene {number}: {len(rows)} turns but {len(cues)} cues")
        out.extend((heading, "", "```text"))
        for (speaker, celan, _english), cue in zip(rows, cues):
            out.append(f"{speaker}: [{cue.replace('_', ' ')}] {spoken(celan)}")
        out.extend(("```", ""))
        total_turns += len(rows)
    if total_turns != 168:
        raise ValueError(f"Expected 168 turns, found {total_turns}")
    OUTPUT.write_text("\n".join(out))


if __name__ == "__main__":
    main()
