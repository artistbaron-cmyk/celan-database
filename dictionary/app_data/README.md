# Dictionary App content

This folder contains **everything the current app reads to display dictionary entries, examples, grammar, expressions, and Phrase Builder responses**. Edit these files to change what students see. The older lexicon and working files are preserved in `../source_history/` and the project `data/` folder; the app does not read them.

| Edit this file | What it controls |
| --- | --- |
| `dictionary_entries.csv` | One row per headword: spelling, pronunciation, search terms, source IDs, and headword display settings |
| `dictionary_senses.csv` | Every sense, word type, meaning, and usage note; `visible=Yes` means the sense appears to students |
| `dictionary_examples.csv` | Every placed example, with Celan, English, source, sense label, and whether it is direct usage, a related form, or a teaching note |
| `dictionary_families.json` | Built-from components, roots, affixes, related words, and family notes |
| `grammar_guide.json` | The complete Grammar Guide: rules, lessons, and companion pages |
| `expressions_app.json` | Every entry in the Expressions view |
| `phrase_builder.json` | Phrase Builder root data, word parts, culture descriptions, and retrieval packs |
| `phrase_builder_content.js` | Phrase Builder's conditional example responses and explanation text |

`dictionary_entries.csv` is the headword list the app reads. Meanings are in `dictionary_senses.csv`, and all examples are in `dictionary_examples.csv` so no example has to be squeezed into a fixed number of columns. The `override_json` and `metadata_json` cells in the headword file hold the few structured display details that do not fit a simple text field. `search_text` is the app's current all-fields search index; review it when changing an entry's terms.

There are currently 1,496 headwords, 1,607 visible senses, and 9,163 placements of examples across entries. A sentence can appear under several words, so placements outnumber distinct sentences.

## Rebuild after an edit

From the project root:

```sh
node dictionary/build_embedded_data.js
node dictionary/export_dictionary_csv.js
node dictionary/app_data.test.cjs
```

`embedded_data.js` is generated from the seven CSV/JSON files so the app also works offline. The app reads the same source content whether it loads these files directly or uses that bundle. Do not edit the bundle by hand.

`../exports/dictionary_entries.csv` is a generated spreadsheet export. The app does **not** read it. It has one row per visible sense and includes at most five direct examples and two related examples per headword; `dictionary_examples.csv` contains **all** examples.

The app's layout and interaction code are `../index.html`, `../styles.css`, and `../script.js`.
