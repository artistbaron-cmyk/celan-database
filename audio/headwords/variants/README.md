# Explicit dictionary variant audio

[Volume 001](volume_001/manifest.csv) contains one Ehshara `eleven_v4` MP3 for each of the 197 alternate forms listed in `dictionary/app_data/dictionary_entries.csv` metadata on 2026-10-16. These forms belong to 193 parent headwords. This collection covers the variants explicitly listed by the dictionary; it does not infer additional euphonic forms.

Each filename begins with `HV-` and includes the parent headword ID and variant number. The manifest preserves the exact parent ID, parent spelling, variant form, written pronunciation, generation prompt, generation ID, duration, checksum, and review status. The stable `variant_id` is `<parent_headword_id>#vNN`, where `NN` is the variant's order in the source metadata. This provides an app mapping without changing the dictionary data or app.

All clips await human listening review. Rename a mispronounced file by adding `ERROR_` to its filename, then run `python3 audio/headwords/variants/reconcile_error_renames.py` from the project root to update the manifest while retaining the flagged MP3. Replacements are also preserved. No variant clip is integrated into the app yet.
