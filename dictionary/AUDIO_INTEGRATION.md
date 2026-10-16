# Dictionary audio playback

The local dictionary app plays the active MP3s in the sibling `audio/` folder. The user approved every active clip without an `ERROR_` marker for app playback on 2026-10-16. The app uses the current recordings, including approved retakes that replaced flagged originals.

## What is linked

| Content | Playable recordings | App link key |
| --- | ---: | --- |
| Headwords | 1,495 | `dictionary_entries.csv.id` |
| Listed variant forms | 197 | Parent headword ID plus `#vNN` in metadata order |
| Examples and expressions | 2,374 | Example `entry_id` or expression `expression_id` |

The 2,374 phrase recordings include 2,278 dictionary example recordings and 96 Expressions recordings. All 2,288 distinct example texts displayed in the dictionary have an exact-text recording; some examples share a recording through the catalog's ID aliases. A sentence may appear under several words, and each placement points to the same take. All 107 entries in the separate Expressions view have a play control: 96 have their own recording and 11 single-word entries play the matching headword recording.

The original recording selector read a narrower source file and only took rows displayed as `sentence`. That left 208 visible app example texts without audio. The 2026-10-16 completion pass used the user's approval of all visible app examples and recorded those 208 texts with Ayinde v4. Run `python3 audio/expressions/audit_app_gaps.py` to refresh the [gap audit](../audio/expressions/app_missing_audio.csv) after app content changes.

The controls appear beside a headword, a listed variant, an example, or an expression when a linked recording exists. The browser loads an MP3 when its play button is pressed. Only one recording plays at a time.

## Maintain the link map

The generated [audio catalog](app_data/audio_catalog.js) maps stable IDs to URL-encoded paths under `audio/`. Do not edit it by hand. After changing an active MP3 or its manifest, run this from the project root:

```sh
python3 dictionary/build_audio_catalog.py
node dictionary/app_data.test.cjs
node dictionary/app_runtime.test.cjs
```

The builder reads active volume manifests, excludes `ERROR_` names, checks each file's SHA-256 against its manifest row, and checks headword and variant IDs against the app data. Under the user's playback policy, every unflagged active clip is available in the app. A file that has been edited needs its active manifest hash updated before rebuilding.

## Local use and eventual publishing

For local use, open [index.html](index.html) with the `dictionary/` and `audio/` folders in their existing positions. The app's default audio base is `../audio`.

If the app is later published, serve the audio files as static assets alongside the dictionary, keeping the same paths, or set `window.CELAN_AUDIO_BASE` to the public base URL for the `audio/` folder before `script.js` loads. Publish the generated catalog with the app. The current active audio totals about 184 MiB; individual MP3s load only when played. A separate paid audio service is unnecessary for local use. Hosting or publishing has not been done here.
