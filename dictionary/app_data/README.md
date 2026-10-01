# Dictionary App content

This folder contains **everything the current app reads to display dictionary entries, examples, grammar, expressions, and Phrase Builder responses**. Edit these files to change what students see. The older lexicon and working files are preserved in `../source_history/` and the project `data/` folder; the app does not read them.

| Edit this file | What it controls |
| --- | --- |
| `dictionary_entries.csv` | One row per headword: spelling, pronunciation, word-origin metadata, source IDs, and headword display settings |
| `dictionary_senses.csv` | Every sense, word type, meaning, and usage note; `visible=Yes` means the sense appears to students. `sense_id` is a permanent link key for that meaning, separate from its display order |
| `dictionary_examples.csv` | Every placed example, with Celan, English, source, placement, display kind, and any established link to a meaning |
| `dictionary_families.json` | Built-from components, roots, affixes, related words, and family notes |
| `grammar_guide.json` | The complete Grammar Guide: rules, lessons, and companion pages |
| `expressions_app.json` | Every entry in the Expressions view |
| `phrase_builder.json` | Phrase Builder root data, word parts, culture descriptions, and retrieval packs |
| `phrase_builder_content.js` | Phrase Builder's conditional example responses and explanation text |

`dictionary_entries.csv` is the headword list the app reads. Meanings are in `dictionary_senses.csv`, and all examples are in `dictionary_examples.csv` so no example has to be squeezed into a fixed number of columns. The `override_json` and `metadata_json` cells in the headword file hold the few structured display details that do not fit a simple text field. The app builds result previews and all-fields search from the current visible senses and metadata; there are no separate preview or search-text cells to keep in sync. The export also reads word-origin details from `metadata_json`.

When adding or reordering meanings, keep each existing `sense_id` with its meaning. Assign a new ID only to a new meaning. The ID is for data links and is not printed on the reader's page.

In `dictionary_examples.csv`, `section` records the placement as direct usage, a related form, or a teaching illustration. `display_kind` lets the page separate sentences, phrases, idioms, teaching illustrations, and historical material. `sense_id` links an example to one visible meaning **only when that link has been reviewed**. Leave it blank when the example belongs to the word generally or its exact meaning has not been established. Do not fill it by matching English keywords alone. Keep `display_order` stable within each section.

There are currently 1,496 headwords, 1,607 visible senses, and 9,163 placements of examples across entries. A sentence can appear under several words, so placements outnumber distinct sentences.

## Rebuild after an edit

From the project root:

```sh
node dictionary/build_embedded_data.js
node dictionary/export_dictionary_csv.js
node dictionary/app_data.test.cjs
node dictionary/edit_rebuild.test.cjs
```

`embedded_data.js` is generated from the seven CSV/JSON files so the app also works offline. The app reads the same source content whether it loads these files directly or uses that bundle. Do not edit the bundle by hand.

`../exports/dictionary_entries.csv` is a generated spreadsheet export. The app does **not** read it. It has one row per visible meaning. Its five preview slots contain ordinary sentence examples appropriate to that row: meaning-linked examples on their own row, plus unassigned word-level examples once on the first row. Each preview includes its `sense_id` if it has one. The count columns distinguish meaning-linked sentences, unassigned sentences, phrases, idioms, and related examples. `example_count` is the total number of direct placements, including phrases, idioms, and teaching illustrations; it repeats on every meaning row for that headword. The full set of examples remains in `dictionary_examples.csv`.

The app's layout and interaction code are `../index.html`, `../styles.css`, and `../script.js`.
