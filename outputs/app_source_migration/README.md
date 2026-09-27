# Dictionary App source migration — 2026-09-27

The app now loads its approved content from `dictionary/app_data/`. The old lexicon, expansion, roots, phrases, grammar, expression tables, and display overlays were moved to `dictionary/source_history/`. Project-level `data/` was left untouched.

## Current app sources

- `dictionary_entries.csv`: 1,496 headwords
- `dictionary_senses.csv`: 1,697 recorded senses, of which 1,607 are visible
- `dictionary_examples.csv`: 9,163 placements of examples across headwords
- `dictionary_families.json`: word-family links and components
- `grammar_guide.json`: 48 guide records plus lessons and companion pages
- `expressions_app.json`: 107 Expressions records
- `phrase_builder.json` and `phrase_builder_content.js`: Phrase Builder source content

`embedded_data.js` is generated from the seven CSV/JSON files for offline use. `dictionary/exports/dictionary_entries.csv` is a generated spreadsheet export, not an app input. Its example columns are limited; all placements live in `dictionary_examples.csv`.

## Comparison and checks

- `before_surface.json` and `after_surface.json` record SHA-256 hashes of the rendered HTML for **every** dictionary entry, every grammar detail page, and every expression detail page. Counts and hashes match exactly: 0 differences across 1,496 dictionary entries, 48 grammar records, and 107 expressions.
- The regenerated spreadsheet export is byte-for-byte identical to the pre-migration `data/dictionary_entries.csv` snapshot (SHA-256 `65ba100f04ec4e30ea74badb521a15d9b8f3971f55f11756a672fa2ac0646e10`).
- `node --test dictionary/app_data.test.cjs dictionary/app_runtime.test.cjs` passes. These check source and bundle parity, every sense/example placement, family link targets, sample search/navigation, and rendering of dictionary, grammar, and expressions.
- `node --check` for the app and export scripts and `git diff --check` pass.
- A live browser smoke check opened the app, searched for Gorm, opened its entry, followed a related-word link to Gormeth, returned through word history, opened Grammar Guide and an Expression, and submitted a Phrase Builder question. Those actions worked.

This migration preserves what the current app displays. It is **not** a linguistic audit of every sentence or meaning. The app's existing wording, including content that may still need review, remains in the new app sources.
The 90 senses marked `visible=No` and the existing `search_text` values were also preserved so current filtering and search behavior do not change. They are explicit columns in the app-facing files, not reads from the old lexicon.

## Still unchecked or unresolved

- The browser check covered representative paths, not every search, navigation path, grammar link, or Phrase Builder response.
- The before/after comparison used rendered HTML hashes; it was not a side-by-side visual screenshot review of every page.
- No edit-and-rebuild test has yet changed a source sense or example and confirmed that every app view and export updates together. In particular, entry previews and all-fields search currently read saved `preview` and `search_text` columns; changing a sense alone would leave those columns stale until edited too.
- The headword file still has both app display metadata (`metadata_json`) and flat fields retained for the spreadsheet export. Editing one representation alone could make the app and export disagree. These fields need one authoritative representation before the source model is fully settled.
- The old assembly functions remain in `dictionary/script.js` even though startup no longer calls them. Historical tests were archived with their old inputs; the current tests do not replace every behavioral check those tests covered.
