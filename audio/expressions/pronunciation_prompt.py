"""Build the user-selected ElevenLabs prompt without changing dictionary text.

For the remainder of volume 6, standalone Celan I is sounded as ``-ee`` and
written x is sounded as ``ks``. The user's Revised Celan Phonetic Guide lists
both KH and KS readings of X; this prompt chooses KS for these recordings
without changing spelling. The actual prompt belongs in generation_prompt.
"""

import re


def for_volume_006(celan_text):
    prompt = re.sub(r"(?<!\w)I(?!\w)", "-ee", celan_text)
    return prompt.replace("X", "Ks").replace("x", "ks")
