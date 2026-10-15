# Volume 10 Braon voice review

**Outcome:** The user chose Taiwo - Young African Female - Realistic Voice for Volume 10. All 200 Volume 10 clips now use Taiwo. The 30 rejected local Braon `pass_61` MP3s and their original manifest are preserved in `voice_review/rejected_braon_pass_61/`; the 30 remote Braon `pass_62` takes remain unrecorded in `.pending_generation_pass_62.json`. The investigation below is historical.

The user identified `../volume_005/PE-BSPI1-0030 - rinaen ser an mekeshpral.mp3` as the earlier Braon sound to match and reported that the new Volume 10 batch sounded bad. Generation was paused while the voice was investigated.

Older Braon rows in volumes 1–5 and the new takes record voice ID `X4Lh5Ftnso6JSt25plzX` and model `eleven_v4`. The connected service also reports `eleven_v4` for the new generations. The approved old and rejected new sample are both mono, 44.1 kHz, 128 kbps MP3s. These checks do not establish that the voice sounds the same.

One comparison take of the **exact old sentence** was generated using Braon / `eleven_v4` with explicit `language_code: en`, as a possible way to avoid automatic language detection changing the accent. It is available in flow `uaYUCR4E5ZydNVpVClmy`, node `NiayWcvIOrhsJdo7Cgzl`, session `F4vxGxfC1QERk4hGl1kv`, generation `uSWJKX8ZJNzZGHXkMlzu`. It has not been added to a dictionary volume. The user's later screenshot shows **Auto** language for the desired manual take, so do not use the English setting as the volume fix.

The user then supplied a manual ElevenLabs v4 take of the same sentence and a screenshot. The screenshot shows Braon, Eleven v4, **Auto** language, stability near the middle, and similarity near the high end. The original downloaded filename includes `sp90_s57`; tentatively use similarity `0.90` and stability `0.57` for a test, then check against the manual take. The attached manual MP3 was copied byte-for-byte to `voice_review/Braon-manual-reference-v4.mp3` (SHA-256 `52b27290dc78eef6544ebc99a4cb6c04fe9054a714033c6ff1f7301d5d57a039`). It is not a dictionary clip.

The connected ElevenLabs creative TTS tool and v4 node schema do not expose stability or similarity. ElevenLabs' direct text-to-speech API supports request-level `voice_settings`; `../generate_braon_v4_test.py` prepares a single take with Braon, `eleven_v4`, Auto language, stability `0.57`, and similarity `0.90`. Its dry run passed. No direct API generation ran. The user then chose Taiwo, and no further Braon generation is needed for Volume 10.
