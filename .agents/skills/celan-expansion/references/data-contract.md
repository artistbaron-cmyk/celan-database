# Expansion Data Contract

Read this reference before integrating an approved batch.

## Authoritative Layers

- `data/lexicon_expansions.csv`: approved app-facing vocabulary created after the source volumes
- `data/phrases_and_examples.csv`: linked usage examples
- `data/expanded_root_database.csv` and `data/expanded_root_crosswalk.csv`: update only when a new productive root is explicitly approved
- `knowledgebase/11_editorial_canon_policy.md`: add a numbered decision when the batch establishes or changes a reusable canon rule
- `dictionary/embedded_data.js`: generated; never edit by hand
- `data/dictionary_entries.csv` and `data/dictionary_report.csv`: generated; never edit by hand

The project's `docs/data_layers.md` governs conflicts between these layers.

## Expansion Row Requirements

Every row in `data/lexicon_expansions.csv` requires:

- unique `entry_id`
- `celan_term`
- explicit `pronunciation`
- `english_meaning`
- `category`
- meaningful `derivation`
- `canon_status`
- `approval_batch`
- at least two IDs in `related_entry_ids`

Leave `origin_nation` and `national_usage` blank for vocabulary intended to be universal overall. Fill both fields only when the word or its characteristic use is specifically associated with a nation. If that distinction is unclear and changes the record, ask whether the word is universal or nation-specific before integration.

When optional euphony exists, use the unsmoothed construction as `celan_term` and store the euphonic form in `variant_forms`. Store semicolon-separated variants and matching semicolon-separated `variant_pronunciations` in the same order. Variants must not also appear as independent expansion headwords unless the user explicitly approves a separate lexical meaning.

Before adding a new sense to an existing headword, record its currently displayed definitions. The added row is additive by default: after rebuilding, every earlier semantically distinct definition and the new definition must appear in the app and generated exports. Replacement or deprecation requires explicit approval and a traceable editorial decision.

## Example Requirements

Each approved headword normally has at least two rows in `data/phrases_and_examples.csv`:

- one ordinary or universal use
- one nationally characteristic or contrasting use when that adds value

Each example must link back to the expansion `entry_id` through `related_entry_ids`. Examples should demonstrate natural speech or narration, not merely restate the English definition.

## Integration Sequence

1. Record the existing displayed senses of every reused headword, then add the approved expansion and example rows with `apply_patch`.
2. Add only explicitly approved roots or editorial decisions.
3. Run:

   ```text
   node .agents/skills/celan-expansion/scripts/validate_expansion_batch.js "<approval batch>" --assembled
   node dictionary/build_embedded_data.js
   node dictionary/export_dictionary_csv.js
   node dictionary/export_dictionary_report.js
   node .agents/skills/celan-expansion/scripts/validate_expansion_batch.js "<approval batch>"
   node .agents/skills/celan-expansion/scripts/audit_lexicon.js
   ```

4. Inspect the diff for accidental changes and generated-file consistency. Compare reused headwords before and after the rebuild and fail the integration if an established sense disappeared.

Do not report a headword increase from raw CSV row counts. Use the assembled app audit.
