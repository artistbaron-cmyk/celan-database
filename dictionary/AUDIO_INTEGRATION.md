# Dictionary audio playback

The local dictionary app plays the active MP3s in the sibling `audio/` folder. The user approved every active clip without an `ERROR_` marker for app playback on 2026-10-16. The app uses the current recordings, including approved retakes that replaced flagged originals.

## What is linked

| Content | Playable recordings | App link key |
| --- | ---: | --- |
| Headwords | 1,495 | `dictionary_entries.csv.id` |
| Listed variant forms | 197 | Parent headword ID plus `#vNN` in metadata order |
| Example sentences and expressions | 2,163 | Example `entry_id` or expression `expression_id` |

The 2,163 phrase recordings include 2,070 distinct dictionary example IDs. Those examples may appear under several words; each placement points to the same recording. Fifteen additional placements or IDs can play an existing recording of the exact same written text. This includes the `-en` example “Li-Seren-en, var nor Varthas shenakar?” shown under other words with its recorded ID. After those links, 213 example IDs covering 208 distinct texts still have no recording; the examples under `-in` and `-lin` shown in the user's screenshots are in this group. Of 107 entries in the Expressions view, 93 have their own recording and 11 single-word entries can play the matching headword recording. The remaining three do not show a play control: `Ka-dren!`, `Lia'ka!`, and `Verka an dral!`.

The original sentence recording pass selected rows that were both `Canon` and `Approved` in `data/phrases_and_examples.csv` and displayed as `sentence`. Among the 213 unrecorded IDs, 89 have no row in that source file, 53 still say `Needs Human Review`, and 71 are approved there but displayed as another kind of example. This explains why the earlier selector reported that its queue was empty. The current app leaves these examples visible without a play control rather than inventing an audio link.

The controls appear beside a headword, a listed variant, an example, or an expression when a linked recording exists. The browser loads an MP3 when its play button is pressed. Only one recording plays at a time.

## Maintain the link map

The generated [audio catalog](app_data/audio_catalog.js) maps stable IDs to URL-encoded paths under `audio/`. Do not edit it by hand. After changing an active MP3 or its manifest, run this from the project root:

```sh
python3 dictionary/build_audio_catalog.py
node dictionary/app_data.test.cjs
node dictionary/app_runtime.test.cjs
```

The builder reads active volume manifests, requires an approved review status, excludes `ERROR_` names, checks each file's SHA-256 against its manifest row, and checks headword and variant IDs against the app data. A file that has been edited needs its active manifest hash updated before rebuilding.

## Local use and eventual publishing

For local use, open [index.html](index.html) with the `dictionary/` and `audio/` folders in their existing positions. The app's default audio base is `../audio`.

If the app is later published, serve the audio files as static assets alongside the dictionary, keeping the same paths, or set `window.CELAN_AUDIO_BASE` to the public base URL for the `audio/` folder before `script.js` loads. Publish the generated catalog with the app. The current active audio totals about 174 MiB; individual MP3s load only when played. A separate paid audio service is unnecessary for local use. Hosting or publishing has not been done here.
