# Explicit dictionary variant audio

[Volume 001](volume_001/manifest.csv) contains one `eleven_v4` MP3 for each of the 197 alternate forms listed in `dictionary/app_data/dictionary_entries.csv` metadata on 2026-10-16. The original batch used Ehshara; 13 flagged recordings were replaced with user-approved Taiwo takes. These forms belong to 193 parent headwords. This collection covers the variants explicitly listed by the dictionary; it does not infer additional euphonic forms.

Each filename begins with `HV-` and includes the parent headword ID and variant number. The manifest preserves the exact parent ID, parent spelling, variant form, written pronunciation, generation prompt, generation ID, duration, checksum, and review status. The stable `variant_id` is `<parent_headword_id>#vNN`, where `NN` is the variant's order in the source metadata. The local dictionary app uses this ID to show a play button beside each listed variant.

All 197 active variant clips were approved for app playback on 2026-10-16, including 13 Taiwo retakes. The superseded recordings are preserved under [retakes](../../retakes/README.md).
