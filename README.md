# CELAN Database

This project contains the working Celan language database and local browser app.

The app currently includes:

- Dictionary
- Grammar Guide
- Phrase Builder

The broader project also includes structured data files, phrase builder support materials, concept notes, evaluation prompts, and project documentation.

## Language Design

- [Celan Language Design Lineage](docs/celan_language_design_lineage.md)
  - Creator-facing explanation of the real-world linguistic, musical, contact-language, and anthropological systems that informed Celan.

## Main Folders

- `dictionary/`
  - The browser app.

- `data/`
  - Canon and working CSV data used by the app and reports.

- `docs/`
  - App-wide project documentation.

- `phrase_builder/`
  - Phrase Builder support layer, including phrasebank, retrieval packs, concepts, evaluation, and local docs.

- `knowledgebase/`
  - Project knowledge and source tracking notes.

- `source_pdfs/` and `source_texts/`
  - Source material used to support the language database.

## Local Use

Open:

```text
dictionary/index.html
```

in a browser to use the current local app.

Choose **English → Celan** beside the dictionary search box and enter an English
word or phrase. Exact recorded meanings appear first, followed by definitions
containing that word or phrase. Each result shows the matching meaning and word
type. The word-type filter applies to the matching sense; the Celan A–Z filter
is hidden in this mode. Choose **All dictionary fields** to search Celan spellings,
notes, categories, and other fields as before.

Results initially show 100 matches, with a “Showing X of Y results” count.
Use **Load more** to reveal the next 100. Changing a search or filter starts a
fresh batch; all matches remain accessible in their original ranked order.

English lookup covers the combined dictionary sources, including vocabulary
expansions, roots, morphology, supplemental entries, and creatures. Capitalization,
punctuation, and an initial “to” in verb meanings are normalized. It does not infer
unrecorded synonyms or invent translations. New entries are indexed when the app
loads; regenerate embedded data using the existing build process after data edits.

Run search checks with `node dictionary/search.test.cjs`. These check lookup
coverage, ranking, filters, navigation, and parity between CSV and embedded data.
