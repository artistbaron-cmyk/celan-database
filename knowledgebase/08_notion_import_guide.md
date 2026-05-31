# Notion Import Guide

This guide prepares the Ohnosha 2.0 Celan knowledgebase for Notion import. It does not change canon content. The CSV files remain the canonical import source for Notion databases, while the Markdown files remain readable reference pages.

## Supplemental Editorial Layer (Acknowledged)

Alongside the six canon extraction CSVs, the project now includes an acknowledged supplemental editorial layer:

- `data/expanded_root_database.csv`
- `data/expanded_root_crosswalk.csv`
- `knowledgebase/12_expanded_root_audit.md`

Use this layer for expanded root intelligence, traceability, and controlled future canon decisions. Do not treat it as a direct replacement for `data/roots_and_morphology.csv`.

## Import Order

Import the six CSV files in this order:

1. `data/potential_tensions.csv`
2. `data/grammar_rules.csv`
3. `data/roots_and_morphology.csv`
4. `data/lexicon.csv`
5. `data/culture_and_context.csv`
6. `data/phrases_and_examples.csv`

Reason: Potential tensions should exist first because other databases may reference `potential_tension_id`. Grammar and morphology should come before lexicon and examples because many vocabulary and phrase rows point back to rules or morphemes.

Optional supplemental import after the six core CSVs:

7. `data/expanded_root_database.csv`
8. `data/expanded_root_crosswalk.csv`

Reason: These are editorial/supporting datasets and should be loaded after the canon layer is already stable.

## Optional Supplemental Property Types

### Expanded Root Database

| Property | Type |
|---|---|
| `form` | Title |
| `entry_type` | Select |
| `status` | Select |
| `source_reference` | Text |
| `core_meaning` | Long Text |
| `function_in_use` | Long Text |
| `evidence_hint` | Long Text |
| `notes` | Long Text |

### Expanded Root Crosswalk

| Property | Type |
|---|---|
| `form` | Title |
| `entry_type` | Select |
| `expanded_status` | Select |
| `source_status` | Select |
| `source_entry_type` | Text |
| `source_refs` | Text |
| `core_meaning` | Long Text |
| `attested_evidence` | Long Text |
| `promotion_reason` | Long Text |
| `canon_confidence` | Select |
| `notes` | Long Text |

Recommended optional relation:

- Add `Canonical Root Entry` relation from `Expanded Root Crosswalk` to `Roots and Morphology` where `source_refs` contains canonical `RM-` IDs.

## Basic Import Steps

1. In Notion, create a parent page named `Ohnosha 2.0 Celan Knowledgebase`.
2. Import each CSV as a full database, not as a simple table inside a page.
3. Name each imported database after the CSV:
   - `Potential Tensions`
   - `Grammar Rules`
   - `Roots and Morphology`
   - `Lexicon`
   - `Culture and Context`
   - `Phrases and Examples`
4. Keep `entry_id` visible in every database. This is the stable key for cross-linking.
5. After import, convert property types according to the property list below.
6. Only after all six CSVs are imported, create Notion relation properties and connect rows using `related_entry_ids` and `potential_tension_id`.

## Database Relationship Map

The CSVs use stable text IDs. In Notion, keep these ID fields as text, then add relation properties where useful.

| Source Field | Meaning | Recommended Notion Relation |
|---|---|---|
| `related_entry_ids` | Semicolon-separated IDs for entries that should be read alongside this entry. | Relation to all six imported databases where possible. |
| `potential_tension_id` | Semicolon-separated IDs pointing to rows in `Potential Tensions`. | Relation to `Potential Tensions`. |
| `source_volume` | Source volume name. | Select or text; optionally relation to a future `Source Volumes` database. |
| `source_section` | Source section name. | Text; optionally relation to a future `Source Sections` database. |

Recommended relation properties:

| Database | Add Relation Property | Connects To | Based On |
|---|---|---|---|
| Grammar Rules | Related Entries | All content databases | `related_entry_ids` |
| Grammar Rules | Potential Tensions | Potential Tensions | `potential_tension_id` |
| Lexicon | Related Entries | All content databases | `related_entry_ids` |
| Lexicon | Potential Tensions | Potential Tensions | `potential_tension_id` |
| Roots and Morphology | Related Entries | All content databases | `related_entry_ids` |
| Roots and Morphology | Potential Tensions | Potential Tensions | `potential_tension_id` |
| Culture and Context | Related Entries | All content databases | `related_entry_ids` |
| Culture and Context | Potential Tensions | Potential Tensions | `potential_tension_id` |
| Phrases and Examples | Related Entries | All content databases | `related_entry_ids` |
| Phrases and Examples | Potential Tensions | Potential Tensions | `potential_tension_id` |
| Potential Tensions | Related Entries | All content databases | `related_entry_ids` |
| Potential Tensions | Self Reference | Potential Tensions | `potential_tension_id` when it points to its own row |

## Converting ID Fields Into Relations

Notion will import `related_entry_ids` and `potential_tension_id` as text. Leave the text fields in place as audit fields, then add relation fields beside them.

### Potential Tension Relations

1. In each database, add a relation property named `Potential Tensions`.
2. Point it to the `Potential Tensions` database.
3. Filter each database for rows where `potential_tension_id` is not empty.
4. For each ID listed in `potential_tension_id`, find the matching `entry_id` in `Potential Tensions`.
5. Add that tension row to the relation property.

If a field contains multiple IDs, split on semicolons and relate each one separately.

### Related Entry Relations

`related_entry_ids` may point across database boundaries. The prefix identifies the likely destination:

| Prefix | Database |
|---|---|
| `GR-` | Grammar Rules |
| `LX-` | Lexicon |
| `RM-` | Roots and Morphology |
| `CC-` | Culture and Context |
| `PE-` | Phrases and Examples |
| `PT-` | Potential Tensions |

Use the prefix to find the matching database, then search by `entry_id` and add the relation. Keep the original `related_entry_ids` field even after relations are created.

## Recommended Property Types

### Grammar Rules

| Property | Type |
|---|---|
| `entry_id` | Title or Text |
| `source_volume` | Select |
| `source_section` | Text |
| `page_number` | Text |
| `rule_name` | Title if `entry_id` is Text; otherwise Text |
| `category` | Select |
| `original_wording` | Long Text |
| `examples` | Long Text |
| `canon_status` | Select |
| `notes` | Long Text |
| `related_entry_ids` | Text |
| `relationship_type` | Multi-select |
| `potential_tension_id` | Text |
| `review_status` | Select |
| `review_reason` | Select or Text |
| `Related Entries` | Relation |
| `Potential Tensions` | Relation |

### Lexicon

| Property | Type |
|---|---|
| `entry_id` | Title or Text |
| `source_volume` | Select |
| `source_section` | Text |
| `page_number` | Text |
| `celan_term` | Title if `entry_id` is Text; otherwise Text |
| `english_meaning` | Text |
| `category` | Select or Multi-select |
| `usage_context` | Long Text |
| `original_wording` | Long Text |
| `canon_status` | Select |
| `notes` | Long Text |
| `related_entry_ids` | Text |
| `relationship_type` | Multi-select |
| `potential_tension_id` | Text |
| `review_status` | Select |
| `review_reason` | Select or Text |
| `Related Entries` | Relation |
| `Potential Tensions` | Relation |

### Roots and Morphology

| Property | Type |
|---|---|
| `entry_id` | Title or Text |
| `source_volume` | Select |
| `source_section` | Text |
| `page_number` | Text |
| `root_or_morpheme` | Title if `entry_id` is Text; otherwise Text |
| `type` | Select |
| `meaning_or_function` | Long Text |
| `derived_forms` | Long Text |
| `original_wording` | Long Text |
| `canon_status` | Select |
| `notes` | Long Text |
| `related_entry_ids` | Text |
| `relationship_type` | Multi-select |
| `potential_tension_id` | Text |
| `review_status` | Select |
| `review_reason` | Select or Text |
| `Related Entries` | Relation |
| `Potential Tensions` | Relation |

### Culture and Context

| Property | Type |
|---|---|
| `entry_id` | Title or Text |
| `source_volume` | Select |
| `source_section` | Text |
| `page_number` | Text |
| `topic` | Title if `entry_id` is Text; otherwise Text |
| `culture_or_context` | Select or Multi-select |
| `original_wording` | Long Text |
| `canon_status` | Select |
| `notes` | Long Text |
| `related_entry_ids` | Text |
| `relationship_type` | Multi-select |
| `potential_tension_id` | Text |
| `review_status` | Select |
| `review_reason` | Select or Text |
| `Related Entries` | Relation |
| `Potential Tensions` | Relation |

Note: `Culture and Context` now includes both language-culture material from the Celan language sources and broader world/lore supplements such as `Supplement 2: Ohnosha Nations and Cultures 3.0`, conceptual-culture material from `Supplement 3: The Conceptual Lexicon`, and syntax/orthography philosophy from `Supplement 4A` and `Supplement 4B`. Treat these as one database with filtered views, not as competing sources. Language-culture rows explain usage, register, ritual language, and context inside Celan; world/lore rows provide national background that can inform metaphor, voice, social values, and cultural nuance; conceptual rows explain root philosophy and source-framing context.

Suggested views for this database:

| View Name | Filter | Purpose |
|---|---|---|
| Language Culture / Context | `source_volume` does not contain `Supplement 2` and `source_volume` does not contain `Supplement 3` | Culture/context entries tied directly to Celan language use. |
| National / World Context | `source_volume` contains `Supplement 2` | Nation and lore entries used to inform national voice, metaphor, register, and cultural nuance. |
| Supplement Context | `source_volume` contains `Supplement` | Supplemental context from non-core source documents. |
| National Voice Support | `culture_or_context` contains `national` or `voice` | Entries that help interpret nation-specific speech patterns. |
| Conceptual Root Context | `source_volume` contains `Supplement 3` | Root philosophy, conceptual authority framing, Terra/terra naming context, and identity-metaphysics support. |
| Syntax / Orthography Philosophy | `source_volume` contains `Supplement 4A` or `source_volume` contains `Supplement 4B` | VSO worldview notes and semantic capitalization philosophy. |

### Phrases and Examples

| Property | Type |
|---|---|
| `entry_id` | Title or Text |
| `source_volume` | Select |
| `source_section` | Text |
| `page_number` | Text |
| `celan_text` | Title if `entry_id` is Text; otherwise Text |
| `translation` | Long Text |
| `example_type` | Select or Multi-select |
| `analysis` | Long Text |
| `canon_status` | Select |
| `notes` | Long Text |
| `related_entry_ids` | Text |
| `relationship_type` | Multi-select |
| `potential_tension_id` | Text |
| `review_status` | Select |
| `review_reason` | Select or Text |
| `Related Entries` | Relation |
| `Potential Tensions` | Relation |

### Potential Tensions

| Property | Type |
|---|---|
| `entry_id` | Title |
| `source_volume` | Select |
| `source_section` | Text |
| `page_number` | Text |
| `related_source_volume` | Text |
| `related_source_section` | Text |
| `issue_type` | Select |
| `original_wording` | Long Text |
| `description` | Long Text |
| `canon_status` | Select |
| `notes` | Long Text |
| `related_entry_ids` | Text |
| `relationship_type` | Multi-select |
| `potential_tension_id` | Text |
| `review_status` | Select |
| `review_reason` | Select or Text |
| `Related Entries` | Relation |
| `Self Reference` | Relation |

## Review Queue Guide

There are 395 non-approved rows:

| Review Status | Count |
|---|---:|
| Needs Human Review | 350 |
| Source Ambiguity | 45 |
| Extraction Uncertain | 0 |

By database:

| Database | Non-approved Rows |
|---|---:|
| Grammar Rules | 24 |
| Lexicon | 127 |
| Roots and Morphology | 35 |
| Culture and Context | 27 |
| Phrases and Examples | 99 |
| Potential Tensions | 83 |

Recommended Notion views:

| View Name | Filter | Sort |
|---|---|---|
| Review Queue | `review_status` is not `Approved` | `source_volume`, then `source_section` |
| Source Ambiguity | `review_status` is `Source Ambiguity` | `source_volume`, then `page_number` |
| Needs Human Review | `review_status` is `Needs Human Review` | `review_reason`, then `source_volume` |
| Potential Tensions | `potential_tension_id` is not empty | `potential_tension_id` |
| By Relationship Type | `relationship_type` is not empty | `relationship_type` |

Recommended review order:

1. `Source Ambiguity`
2. `possible overlap with earlier rule`
3. `terminology overlap`
4. `contextual meaning overlap`
5. `possible derivation uncertainty`
6. `variant form overlap`

Human review should decide whether the metadata label is useful, whether extra cross-links are needed, or whether a row can be marked `Approved`. It should not rewrite canon text unless a source document itself explicitly resolves the issue.

## Post-Import Checklist

- Confirm all six databases imported with the expected row counts:
  - Grammar Rules: 50
  - Lexicon: 511
  - Roots and Morphology: 105
  - Culture and Context: 103
  - Phrases and Examples: 504
  - Potential Tensions: 83
- Confirm `entry_id` remains unique and visible in every database.
- Confirm `source_volume`, `source_section`, and `page_number` are visible in every database.
- Confirm `review_status` has these values: `Approved`, `Needs Human Review`, `Extraction Uncertain`, `Source Ambiguity`.
- Confirm approved rows have blank `review_reason`.
- Confirm non-approved rows have a populated `review_reason`.
- Convert `relationship_type` to a multi-select with these labels: `duplicate`, `expansion`, `refinement`, `related usage`, `possible contradiction`, `terminology overlap`, `source ambiguity`.
- Create relations from `potential_tension_id` to `Potential Tensions`.
- Create relations from `related_entry_ids` using ID prefixes.
- Keep raw ID fields after relation creation so the import remains auditable.
- Create dashboard views for grammar, lexicon, morphology, culture, phrases, and review queue.
- Do not merge overlapping entries during cleanup. Preserve separate entries and use relations.
