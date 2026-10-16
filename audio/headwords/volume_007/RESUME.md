# Volume 007 completion record

Volume 007 was completed on 2026-10-16. All 200 MP3s are recorded in [manifest.csv](manifest.csv), and the journal is now [.completed_batch_007.json](.completed_batch_007.json). The instructions below document the recovery process that was used; do not run it again.

The journal [.pending_batch_007.json](.pending_batch_007.json) is the source of truth. Indices 0–98 are `recorded`; 99–199 remain `selected`. The [manifest](manifest.csv) has 99 rows and there are 99 MP3s. Volume 006 is complete. Do not regenerate or replace any recorded clip, and preserve any user `ERROR_` renames by running `python3 audio/headwords/reconcile_error_renames.py` before and after new work.

Use connected ElevenLabs voice **Ehshara** (`ej0ekewUzWvTFUiKsxvp`), model `eleven_v4`, one take per selected word. Use each journal item's exact `generation_prompt`. Stop after volume 007.

1. Generate journal indices 99–119 (21 takes). For each, capture index, generation ID, session ID, flow ID, completed status, exact prompt, model ID, duration, and content URL. Save the completed records as `.results_pass_04b.json` in this folder. Run `python3 audio/headwords/process_partial_pass.py prepare 7 04b`, `python3 audio/expressions/download_batch.py audio/headwords/volume_007/.pending_downloads_pass_04b.json`, and `python3 audio/headwords/process_partial_pass.py finish 7 04b` from the project root.
2. Generate indices 120–149, 150–179, and 180–199 as passes 05, 06, and 07. For each pass, save completed result records to `.results_pass_NN.json` and run `python3 audio/headwords/process_pending_pass.py prepare 7 N`, the project downloader on `.pending_downloads_pass_NN.json`, then `python3 audio/headwords/process_pending_pass.py finish 7 N`. The last finish renames the journal to `.completed_batch_007.json`.
3. Reconcile user renames; verify 200 decodable MP3s and 200 manifest rows in volume 007, unique headword IDs and normalized texts across all volumes, source text/pronunciation matches, per-file bytes and SHA-256, Ehshara v4 metadata, and no pending download queues. Update the headword README files to the final count. Do not start volume 008.

If the daily limit still applies, stop generation immediately. Keep the journal and files intact and resume after the next reset without retrying completed takes.
