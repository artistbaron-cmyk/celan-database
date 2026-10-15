"""Build the user-selected ElevenLabs prompt without changing dictionary text.

For volumes 6 through 11, standalone Celan I is sounded as ``-ee`` and
written x is sounded as ``ks``. The user's Revised Celan Phonetic Guide lists
both KH and KS readings of X; this prompt chooses KS for these recordings
without changing spelling. The actual prompt belongs in generation_prompt.
"""

import re


def for_volume_010(celan_text):
    prompt = re.sub(r"(?<!\w)I(?!\w)", "-ee", celan_text)
    return prompt.replace("X", "Ks").replace("x", "ks")


def for_volume_011(celan_text):
    return for_volume_010(celan_text)


def for_volume_009(celan_text):
    return for_volume_010(celan_text)


def for_volume_008(celan_text):
    return for_volume_009(celan_text)


def for_volume_007(celan_text):
    return for_volume_009(celan_text)


def for_volume_006(celan_text):
    return for_volume_009(celan_text)
