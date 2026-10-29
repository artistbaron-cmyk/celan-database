"""Build the Volume 2 ElevenLabs performance copies from the written scripts.

Scene 1 is the approved listening reference and is intentionally left untouched.
The mood cues affect performance only; they are never part of the Celan text.
"""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "everyday_conversations_volume_02.md"

# One cue per speaker turn, in the order of the written script. A few turns use
# a second cue at a sentence boundary where the speaker's intent changes.
CUES = {
    2: ["[flustered]", "[curious]", "[sheepish]", "[patiently]", "[hurriedly]", "[gently]", "[apologetic]"],
    3: ["[concerned]", "[matter-of-factly]", "[curious]", "[decisive]", "[concerned]", "[regretful]", "[determined]", "[warmly]"],
    4: ["[shivering]", "[concerned]", "[tired]", "[reassuring]", "[hopeful]", "[calmly]", "[relieved]"],
    5: ["[guiding]", "[uncertain]", "[gently]", "[apologetic]", "[encouraging]", "[pleased]"],
    6: ["[satisfied]", "[tired]", "[playful]", "[sheepish]", "[amused]", "[suspicious]", "[teasing]"],
    7: ["[searching]", "[briefly]", "[surprised]", "[helpfully]", "[practical]", "[agreeable]"],
    8: ["[friendly]", "[helpfully]", "[agreeable]", "[calmly]", "[curious]", "[reassuring]"],
    9: ["[concerned]", "[curious]", "[clarifying]", "[helpfully]", "[grateful]", "[ready]"],
    10: ["[instructive]", "[focused]", "[noticing]", "[curious]", "[confident]", "[patiently]"],
    11: ["[gently]", "[confused]", "[clarifying]", "[apologetic]", "[encouraging]", "[patiently]"],
    12: ["[hungry]", "[reassuring]", "[impatient]", "[focused]", "[patiently]", "[warmly]"],
    13: ["[friendly]", "[friendly]", "[hopeful]", "[regretful]", "[surprised]", "[helpfully]", "[accepting]"],
    14: ["[hopeful]", "[disappointed]", "[hungry]", "[suggesting]", "[decisive]", "[agreeable]"],
    15: ["[curious]", "[matter-of-factly]", "[thinking]", "[confirming]", "[considering]"],
    16: ["[alarmed]", "[curious]", "[embarrassed]", "[helpfully]", "[patiently]", "[warmly]"],
    17: ["[relieved]", "[pleased]", "[businesslike]", "[friendly]", "[hungry]", "[warmly]"],
    18: ["[satisfied]", "[pleased]", "[hungry]", "[warmly]", "[helpfully]", "[content]"],
    19: ["[brightly]", "[curious]", "[calmly]", "[eager]", "[inviting]", "[pleased]"],
    20: ["[tired]", "[checking]", "[hesitant]", "[concerned]", "[overwhelmed]", "[quietly]"],
    21: ["[apologetic]", "[openly]", "[carefully]", "[confused]", "[tired]", "[understanding]"],
    22: ["[gently]", "[quietly]", "[offering]", "[tired]", "[caring]", "[relieved]"],
    23: ["[warmly]", "[brighter]", "[concerned]", "[reassuring]", "[hopeful]", "[pleased]"],
    24: ["[calmly]", "[cheerful]", "[inviting]", "[warmly]", "[patiently]", "[content]"],
    25: ["[frustrated]", "[helpfully]", "[grateful]", "[ready]", "[focused]", "[patiently]"],
    26: ["[hopeful]", "[frustrated]", "[noticing]", "[confused]", "[encouraging]", "[discouraged]"],
    27: ["[realizing]", "[reassuring]", "[focused]", "[inviting]", "[confident]"],
    28: ["[encouraging]", "[carefully]", "[hopeful]", "[relieved]", "[pleased]"],
    29: ["[tired]", "[caring]", "[hopeful]", "[reassuring]", "[relieved]", "[warmly]"],
    30: ["[content]", "[hungry]", "[warmly]", "[content]", "[softly]", "[softly]"],
}

# Change tone within a turn only when the speaker really changes what they
# are doing. The string here names the first words that receive the new cue.
INLINE_CUES = {
    (2, 3): ("rinaen karvek", "[explaining]"),
    (7, 3): ("kes ee", "[pointing out]"),
    (15, 3): ("del shena?", "[surprised]"),
    (21, 5): ("ver var", "[clearer]"),
}


def normalize_for_speech(line: str) -> str:
    speaker, celan = line.split(": ", 1)
    celan = re.sub(r"\bI\b", "ee", celan)
    celan = celan.lower().replace("x", "ks").replace(",", "").replace(".", "")
    return speaker, celan


def main() -> None:
    source = SOURCE.read_text()
    scenes = re.findall(r"### (\d+)\. ([^\n]+)\n.*?```text\n(.*?)\n```", source, re.S)
    assert len(scenes) == 30, f"Expected 30 scenes, found {len(scenes)}"

    for scene_number, _title, block in scenes:
        number = int(scene_number)
        if number == 1:
            continue
        lines = block.splitlines()
        cues = CUES[number]
        assert len(lines) == len(cues), f"Scene {number}: {len(lines)} turns, {len(cues)} cues"
        output = []
        for turn_number, (line, cue) in enumerate(zip(lines, cues), start=1):
            assert cue.startswith("[") and cue.endswith("]")
            speaker, celan = normalize_for_speech(line)
            inline = INLINE_CUES.get((number, turn_number))
            if inline:
                words, next_cue = inline
                assert celan.count(words) == 1, f"Scene {number}, turn {turn_number}: {words!r}"
                celan = celan.replace(words, f"{next_cue} {words}", 1)
            output.append(f"{speaker}: {cue} {celan}")
        path = ROOT / f"elevenlabs_upload_volume_02_scene_{number:02d}_mood.txt"
        path.write_text("\n".join(output) + "\n")


if __name__ == "__main__":
    main()
