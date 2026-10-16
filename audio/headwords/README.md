# Celan headword audio

[Volume 001](volume_001/README.md), [002](volume_002/README.md), [003](volume_003/README.md), [004](volume_004/README.md), [005](volume_005/README.md), [006](volume_006/README.md), and [007](volume_007/README.md) each contain 200 unique dictionary headword MP3s. [Volume 008](volume_008/README.md) contains the remaining 95, for 1,495 recorded clips in total. This covers every current headword in `dictionary/app_data/dictionary_entries.csv`; there are no source headwords for volume 009 yet. All clips use Ehshara and `eleven_v4`. Each filename begins with `HW-` and a filesystem-safe form of the stable source ID; each manifest preserves the exact ID and maps clips to headwords, written pronunciations, generation prompts, voice, generation IDs, durations, checksums, and listening review states.

The user approved the no-H spelling takes for **Rinaen** (`Ree-na-en`) and **Aen** (`Aa-en`) on 2026-10-15. Their original pilot takes and other pronunciation trials remain in [pronunciation_trials](pronunciation_trials/README.md). Other `aen` and `x` words in the first volume use selected speech prompts and still need listening review. Written dictionary data were not changed.

User-renamed `ERROR_` clips are retained and marked `Needs correction` in the manifest. The clips are not integrated into the dictionary app. Volume 008 includes affix headwords and two entries with alternate forms; their speech prompts are recorded in its manifest for listening review.

The dictionary's 197 explicitly listed alternate forms have their own audio set in [variants](variants/README.md), linked to their 193 parent headwords. These are separate from the 1,495 headword clips and are awaiting listening review.
