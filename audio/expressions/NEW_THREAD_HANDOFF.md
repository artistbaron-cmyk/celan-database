# Celan dictionary audio — new-thread handoff

## Current state — Volume 10 complete (2026-10-15)

The user selected **Taiwo - Young African Female - Realistic Voice** (`RAVWJW17BPoSIf05iXxf`) for **Volume 10** after rejecting the new Braon sound. Volume 10 is complete: 200 Taiwo / `eleven_v4` dictionary-example MP3s in `pass_61` through `pass_67` (30, 30, 30, 30, 30, 30, 20). The speech prompt uses standalone `I`→`-ee` and written `x`→`ks`, while filenames and manifest `celan_text` preserve source spelling.

Final audit found **2,000 clips and 2,000 manifest rows** across volumes 1–10, 200 per volume. Filenames and manifest rows match; all source IDs and normalized Celan texts are unique. All 200 Volume 10 MP3s decode and match their recorded byte sizes and SHA-256 checksums, Taiwo voice ID, `eleven_v4` model, and speech prompts. `record_batch.py` checked each source was Canon/Approved. Reconcile and standalone-I queue sync reported zero changes. Audio awaits human listening review and is not integrated into the dictionary app. **Stop before Volume 11 until the user chooses its voice and asks to start.**

The 30 rejected local Braon takes and original manifest are preserved in `volume_010/voice_review/rejected_braon_pass_61/`; they are not counted as Volume 10 clips. Another 30 Braon takes from the original `pass_62` were generated remotely but never downloaded or recorded; their IDs remain in `volume_010/.pending_generation_pass_62.json`. The manual Braon reference is in `volume_010/voice_review/Braon-manual-reference-v4.mp3`. All sections below are historical; their older stop points and voice instructions have been superseded.

## Historical Volume 10 Braon voice issue — 2026-10-15

The user requested Braon for volume 10, then reported that the new voice sounded different from the Braon version used earlier. At that point, generation was paused. The original Braon `pass_61` had 30 local MP3s and manifest rows flagged `Needs correction — voice does not match earlier Braon recordings`; those files and rows were later archived as noted above. The original Braon `pass_62` had 30 completed remote takes that were not downloaded or recorded; session and generation identifiers are preserved in `volume_010/.pending_generation_pass_62.json`.

Investigation: old Braon rows from volumes 1–5 and rejected volume 10 Braon rows both record voice ID `X4Lh5Ftnso6JSt25plzX` and model `eleven_v4`. ElevenLabs returned `eleven_v4` for all 60 rejected takes, and the first rejected flow node confirms that model and voice ID. Metadata did not explain the audible mismatch. The connected voice search found a Braon voice at that ID but exposed no version selector.

The user confirmed `volume_005/PE-BSPI1-0030 - rinaen ser an mekeshpral.mp3` as the older target and supplied a manual v4 Braon take of the same sentence, saved in `volume_010/voice_review/Braon-manual-reference-v4.mp3`. See `volume_010/VOICE_REVIEW.md` for the screenshot settings, sample metadata, test flow, and prepared direct API test. The user then chose Taiwo for Volume 10, so no Braon correction test was run.

## Historical update — after volume 9 (2026-10-15)

The user chose **Olaniyi Victor** (`U7wWSnxIJwCjioxt86mk`) for **volume 9** and explicitly asked to start. Volume 9 is complete: 200 Olaniyi Victor / `eleven_v4` dictionary-example MP3s in `pass_54` through `pass_60` (30, 30, 30, 30, 30, 30, 20). The current speech prompt uses standalone `I`→`-ee` and written `x`→`ks`, while filenames and manifest `celan_text` preserve source spelling. All 200 volume 9 rows await human listening review; no audio was integrated into the dictionary app.

Final audit found **1,800 clips and 1,800 manifest rows** across volumes 1–9, 200 in each. Every volume has matching filenames and rows; all source IDs and normalized Celan texts are unique. All volume 9 MP3s decode, match their recorded SHA-256 checksums, voice ID, model, and speech prompts. `record_batch.py` validated that each source was Canon/Approved when recorded. **Stop before volume 10; ask for its voice and a new start instruction.**

During `pass_57`, a bookkeeping error lost download references for 29 completed remote takes. The user authorized regeneration if recovery failed. The connector's available flow tools confirmed the takes but did not expose their download references, so those 29 sentences were regenerated once and the replacement files were downloaded and recorded. No original MP3s were overwritten. The completed original flow is `fD3TPoS5ewIo04zJJARY` if later account review is needed.

## Earlier update — after volume 8

The user selected **Lily - Velvety Actress** (`pFZP5JQG7iQjIQuC4Bku`) for **volume 8 only** and explicitly asked to start it. Volume 8 is complete: 200 Lily / `eleven_v4` dictionary-example MP3s in `pass_47` through `pass_53` (30, 30, 30, 30, 30, 30, 20). Across volumes 1–8 there were 1,600 clips and manifest rows. Final checks confirmed every volume had 200 matching files and rows; all source IDs and normalized Celan texts were unique; all volume 8 sources were Canon/Approved; each volume 8 MP3 decoded and matched its recorded checksum, voice, model, and I/X speech prompt. All 200 volume 8 rows await human listening review.

## Earlier update — after volume 7

The user resumed generation for **volume 7 only**, kept Ehshara for that volume, and asked to stop before volume 8 so they can choose a voice. Volume 7 is complete: 200 Ehshara / `eleven_v4` dictionary-example MP3s in `pass_40` through `pass_46` (30, 30, 30, 30, 30, 30, 20). Across volumes 1–7 there are 1,400 clips and manifest rows. Final checks confirmed every volume has 200 matching files and rows; all source IDs and normalized Celan texts are unique; all volume 7 sources remain Canon/Approved; each volume 7 MP3 decodes and matches its recorded checksum, voice, model, and I/X speech prompt. All 200 volume 7 rows await human listening review. **Do not generate volume 8 until the user chooses its voice and explicitly asks to continue.** The older volume 7 procedure and counts below are historical.

The network sandbox prompted separately for individual `curl` downloads. For volume 7, a project-scoped `download_batch.py` fetched each remaining batch in one command without overwriting existing files. It accepts only ElevenLabs storage URLs and writes only new MP3s in `volume_007`. Its temporary signed-URL queues were removed after successful downloads.

## Historical handoff — before volume 7

The remainder of this document records the state and procedure from before the user resumed volume 7. Do not restart a scheduled automation without a separate request.

## Goal and verified state

- Record one intelligible ElevenLabs v4 take for each unique Canon/Approved dictionary example sentence, preserving the written Celan text for the app and a stable source ID for later linking.
- `audio/expressions/volume_001` through `volume_006` each contain 200 MP3s and 200 manifest rows: **1,200 clips**, including **1,107 dictionary examples** and **93 Expressions entries**. All 1,200 manifest source IDs and normalized Celan texts are unique. These counts were checked on 2026-10-15.
- `audio/expressions/next_examples.py --count 30` currently selects 30 more examples for `volume_007`; the full selector currently finds **963** eligible unrecorded examples. These counts can change if the dictionary or manifests change. The next pass label is `pass_40` after `pass_39`.
- Audio has not been integrated into the dictionary app. Most rows await human listening review. `ERROR_` files and `Needs correction` rows are user review flags, not permission to overwrite a take.

## Source of truth and file layout

- [Dictionary example selection](next_examples.py) reads `dictionary/app_data/dictionary_examples.csv` and `data/phrases_and_examples.csv`. It selects display-kind `sentence` rows whose source is `Canon` and `Approved`, then excludes IDs and normalized texts already represented in any `volume_???/manifest.csv`.
- Each volume holds at most **200 MP3s** and one `manifest.csv`. Filenames are `<source ID> - <readable Celan text>.mp3`; `PE-` means dictionary example, `EX-` means Expressions entry. No folder per pass and no listening HTML page.
- Each manifest records exact dictionary spelling, source ID, translation, voice, model, generation ID, duration, actual generation prompt, checksum, and review status. The source ID is the future app link key. See [storage conventions](README.md).
- [Reconcile user changes](reconcile_error_renames.py) updates manifest paths and checksums for user-renamed or replaced files; [sync the standalone-I queue](sync_standalone_I_queue.py) updates its review list. Preserve all user edits and flags. `EX-SRC-LX-V3-0030` (standalone **Elan**) is user maintained: never regenerate or replace it.

## Voice and pronunciation

- New batches since `pass_29` use the connected ElevenLabs **Ehshara** voice ID `ej0ekewUzWvTFUiKsxvp`, model `eleven_v4`, one take per sentence. Earlier Braon clips remain as they are. A previous ElevenLabs flow filled up; the last known newer flow was `RBV3ow3JjLUcp2XZyjOp`. Check capacity when resuming and create a fresh flow if needed; never regenerate a completed take just because a flow fills.
- The user's [Revised Celan Phonetic Guide](../../Celan_Phonetic_Guide_Report_Revised.pdf) permits **KH or KS for X anywhere**; the user selected **KS** for the trial. The guide gives single-vowel **I** the sound **EE**. For volume 6, the speech prompt replaced standalone `I` with `-ee` and written `x` with `ks` using [pronunciation_prompt.py](pronunciation_prompt.py). Dictionary spelling and filenames were left intact. The helper is named `for_volume_006`; adapt it explicitly if continuing that prompt convention in volume 7, and save each actual spoken prompt in `generation_prompt`.
- The guide also permits W/V and several `ae` realizations. Those can vary; do not silently rewrite all previous clips to force one realization. Keep listening review separate from source approval.

## Safe continuation procedure once the user resumes

1. Read this handoff and the current [audio README](README.md). Inspect the newest volume, manifests, and any user changes before writing. Do not assume this snapshot is still current.
2. Run `python3 audio/expressions/reconcile_error_renames.py` and `python3 audio/expressions/sync_standalone_I_queue.py` from the project root. Resolve any reported mismatch without overwriting a user file.
3. Run `python3 audio/expressions/next_examples.py --count 30`. Verify each selected source remains Canon/Approved, is unique by ID and text, and points to an available volume slot. At the present state, this should create `volume_007`.
4. Generate at most 30 selected sentences through the connected ElevenLabs account with Ehshara and `eleven_v4`, one take each. Apply the user-chosen pronunciation prompt only to speech input, and keep the source `celan_text` untouched. Capture each generation ID, duration, and exact prompt. If the connector requires a new flow, create one and continue the unfinished items.
5. Download each MP3 to the selector's exact readable filename. Never overwrite an existing MP3, including an `ERROR_` file. Keep each volume at 200 MP3s or fewer.
6. Run [record_batch.py](record_batch.py) with the next `pass_NN` label and the selector's JSON items augmented with `generation_id`, `duration_seconds`, `generation_prompt`, `voice_name`, `voice_id`, and `model_id`. Its second argument is the JSON array; pass it safely as a process argument rather than hand-building a shell command around Celan text.
7. Rerun the reconcile and queue-sync scripts. Verify `afinfo` can decode each new MP3, manifest rows and filenames correspond, source IDs and normalized texts remain unique, source approval holds, and new rows have Ehshara / `eleven_v4` metadata. Report the batch count and any actual failure. No dictionary app integration or new listening page is authorized by this handoff.

The user previously allowed routine batches without asking each time, but later limited the run to **finishing volume 6**. Treat the later limit as the current boundary. Once the user resumes in the new thread, carry their stated scope forward without repeated permission requests. Connector or sandbox approvals may still be enforced by the host and cannot be bypassed.

## Copy into a new thread

> Work in `/Users/admin/Documents/CELAN_DATABASE` only. Read `audio/expressions/NEW_THREAD_HANDOFF.md`, inspect current manifests and user edits, and continue the Celan dictionary example audio from volume 7 in batches of at most 30 when I tell you to resume. Use Ehshara, ElevenLabs v4, the current I→`-ee` and X→`ks` speech-prompt preferences, and preserve exact Celan spelling, existing MP3s, `ERROR_` flags, and user replacements. Verify and record every batch. Do not integrate audio into the app or restart the old automation unless I ask.
