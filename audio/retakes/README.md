# Pronunciation comparison takes

`volume_001` contains 143 new ElevenLabs v4 takes for audio files flagged `ERROR_` at selection time, including one expression whose old filename had a leading space before the marker:

| Collection | Voice | Takes |
| --- | --- | ---: |
| Expressions | Ayinde | 61 |
| Headwords | Taiwo | 69 |
| Headword variants | Taiwo | 13 |

All 143 retakes were approved by the user on 2026-10-16. The user edited the audio bytes of 45 retakes before approval. The approved files were copied into their original expression, headword, and variant volumes, replacing the flagged active recordings. The old recordings and their former manifest rows are preserved in [superseded_originals](superseded_originals/before_swap.json). The retake files remain here as approved masters. The local dictionary app plays the active volume copies, linked through the generated audio catalog. The [manifest](volume_001/manifest.csv) maps each retake filename to its source ID, dictionary text and pronunciation, original file and hash, generation prompt, voice, original generation hash, current file hash, and edit/approval status. The retake's filename begins with `Ayinde_` or `Taiwo_`; the rest is the readable source filename without `ERROR_`.

For expressions, the spoken prompts use the existing dictionary or prior generation text, with `I` written `-ee`, `Elan` written `ehlan`, and `x` written `ks` where present. These prompt spellings help steer the voice; the manifest keeps the original dictionary text separately. Headword and variant prompts reuse their previous generation prompts, or their written forms when no prior prompt exists.

All 143 retakes were checked for readable MP3 data, file and manifest hashes, source linkage, unique source IDs and generation IDs, and voice/model metadata. The manifest's `generated_sha256` preserves the downloaded generation hash; `sha256` records the current approved file.
