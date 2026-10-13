# Dictionary audio storage

Store up to 200 clips in each `volume_NNN` folder. Keep adding to the current volume until it has 200 MP3s, then create the next numbered volume. Do not create a folder for each generation pass.

Name each MP3 `<source ID> - <readable Celan text>.mp3`. `EX-` identifies an Expressions entry; `PE-` identifies a dictionary example sentence. Each volume has one `manifest.csv` with the source kind, exact Celan text, meaning, generation metadata, checksum, and audio review status. The stable source ID is the link key for later dictionary integration.

Automated Braon batches include approved examples with standalone Celan `I`. These use the dictionary text as the generation prompt; the existing review flags and user-renamed `ERROR_` files remain untouched.

Current folder: [volume_004](volume_004/README.md), with 30 clips and room for 170 more.
