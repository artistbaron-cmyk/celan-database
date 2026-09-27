# Data Layers

One of the most important patterns in this project is that not every file is trying to do the same job.

This matters because some files need to preserve source structure, while others need to be shaped for use.

## Source-facing files

These stay closer to the original extracted or canonical structure.

Examples include:

- `/Users/admin/Documents/CELAN_DATABASE/data/grammar_rules.csv`

These files are useful as a base, but they are not always pleasant or practical to build from directly.

## Clean copies

These are more organized versions of source-facing files.

They may add order, grouping, or hierarchy without fully changing the underlying row model.

Examples include:

- `/Users/admin/Documents/CELAN_DATABASE/data/grammar_rules_clean.csv`

These are better for sorting and navigating, but they still may not be the best working layer.

## Working files

These are the files shaped for actual use.

They are allowed to merge overlaps, normalize examples, and restructure material so it can support the app, teaching flow, or future phrase work.

Examples include:

- `/Users/admin/Documents/CELAN_DATABASE/data/grammar_rules_working.csv`
- `/Users/admin/Documents/CELAN_DATABASE/data/lexicon_expansions.csv`
- `/Users/admin/Documents/CELAN_DATABASE/data/expressions.csv`

This is usually the layer that matters most when we want something to feel usable rather than merely preserved.

`lexicon_expansions.csv` holds explicitly approved new vocabulary created after the source volumes. It stores app-facing meanings, pronunciations, roots, optional national origin and usage when genuinely relevant, euphonic variants, approval batch, and example links without rewriting the extracted source lexicon.

The app's complete Expressions view is now stored in `dictionary/app_data/expressions_app.json`. Historical `expressions.csv` and older source records are preserved under `dictionary/source_history/` and are not app inputs.

## Generated app and report files

The current local app reads its content only from `dictionary/app_data/` (see that folder's README). The older `data/` files remain historical or working material; editing them alone does not change the app. After an app-data change, refresh the snapshot and reports with:

```text
node dictionary/build_embedded_data.js
node dictionary/export_dictionary_csv.js
```

Do not edit `dictionary/app_data/embedded_data.js` or `dictionary/exports/dictionary_entries.csv` by hand. The export has every visible headword and sense, but limits example columns; `dictionary/app_data/dictionary_examples.csv` holds every placed example. The app does not read exports. The old export copies in `data/` are preserved snapshots, not current app outputs.

## Support files

The Phrase Builder support files form another kind of working layer:

- phrasebank
- evaluation
- concepts
- retrieval
- Phrase Builder docs

These are not source archives. They are support structures.

## The practical rule

Before changing a file, it helps to ask:

- is this preserving source material
- organizing source material
- or reshaping material for use

That one question prevents a lot of confusion.

## Reviewed example display (ED-0044)

`phrases_and_examples.csv` retains source records after duplicate consolidation. `app_canonical_id` points to the displayed record; `app_headwords` adds reviewed placements; `app_excluded_headwords` removes a specific placement (`*` means grammar-only). `app_previous_texts` maps old inline copies to their approved replacement. `app_grammar_group` places teaching illustrations in the grammar browser. These fields affect presentation, not dictionary headword definitions. Source notes and the review's before/after journal preserve provenance.
