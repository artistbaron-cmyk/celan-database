# Dictionary audio storage

Store up to 200 clips in each `volume_NNN` folder. Keep adding to the current volume until it has 200 MP3s, then create the next numbered volume. Do not create a folder for each generation pass.

Name each MP3 `<source ID> - <readable Celan text>.mp3`. `EX-` identifies an Expressions entry; `PE-` identifies a dictionary example or teaching form. Each volume has one `manifest.csv` with the source kind, exact Celan text, meaning, generation metadata, checksum, and audio review status. The stable source ID links the recording to the dictionary app.

Automated batches include approved app examples with standalone Celan `I`. The manifest records the actual generation prompt and voice for each clip. Volumes 6 through 12 used the listener's chosen speech prompts: standalone `I` becomes `-ee`, and written `x` becomes `ks` in the ElevenLabs prompt only. The dictionary text and filenames keep Celan spelling. The supplied Revised Celan Phonetic Guide describes both KH and KS readings of X as valid. On 2026-10-16, 61 user-approved Ayinde retakes replaced flagged expression recordings; their originals are archived under [retakes](../retakes/README.md). The 208-example completion pass used Ayinde with ElevenLabs v4.

Current folder: [volume_012](volume_012/README.md), with 174 clips and room for 26 more.

All 2,288 distinct example texts currently shown in the dictionary app have an exact-text recording. The [gap audit](app_missing_audio.csv) is empty. The selector now treats visible app examples as the approved recording list; earlier source-file review flags do not exclude them. All 107 entries in the separate Expressions view now have a play control: 96 use their own recording and 11 single-word entries reuse their headword recording.
