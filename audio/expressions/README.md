# Dictionary audio storage

Store up to 200 clips in each `volume_NNN` folder. Keep adding to the current volume until it has 200 MP3s, then create the next numbered volume. Do not create a folder for each generation pass.

Name each MP3 `<source ID> - <readable Celan text>.mp3`. `EX-` identifies an Expressions entry; `PE-` identifies a dictionary example sentence. Each volume has one `manifest.csv` with the source kind, exact Celan text, meaning, generation metadata, checksum, and audio review status. The stable source ID is the link key for later dictionary integration.

Automated batches include approved examples with standalone Celan `I`. The manifest records the actual generation prompt and voice for each clip. Volumes 6 through 11 use the listener's chosen speech prompts: standalone `I` becomes `-ee`, and written `x` becomes `ks` in the ElevenLabs prompt only. The dictionary text and filenames keep Celan spelling. The supplied Revised Celan Phonetic Guide describes both KH and KS readings of X as valid. Existing review flags, user-edited audio, and user-renamed `ERROR_` files remain untouched. Volume 11 uses Ayinde with ElevenLabs v4.

Current folder: [volume_011](volume_011/README.md), with 163 clips. The selector currently finds no remaining unique Canon/Approved dictionary example sentences. All clips await human listening review and are not integrated into the dictionary app.
