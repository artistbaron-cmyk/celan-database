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

`expressions.csv` holds explicitly approved idioms, colloquialisms, and nationally characteristic expressions that should be searchable without being counted as dictionary headwords. The app combines this file with established expressive lexicon entries and source idioms. The Phrase Builder phrasebank is not an Expressions source.

## Generated app and report files

The local app opens from an embedded snapshot. After an approved data change, refresh the snapshot and reports with:

```text
node dictionary/build_embedded_data.js
node dictionary/export_dictionary_csv.js
node dictionary/export_dictionary_report.js
```

Do not edit `dictionary/embedded_data.js`, `data/dictionary_entries.csv`, or `data/dictionary_report.csv` by hand.

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
