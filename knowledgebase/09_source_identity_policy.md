# Source Identity Policy

This policy controls how supplemental source titles, PDF metadata titles, and table-of-contents labels are handled in Ohnosha 2.0.

## Canonical Source Name

Use the user-approved source name as the canonical source name in the knowledgebase.

Examples:

| File / PDF Label | Canonical Knowledgebase Name |
|---|---|
| `Volume 5.pdf`; metadata `Celan_Ancient_Language: Volume 4C`; visible TOC `Table of Contents: Volume 4` | `Supplement 1: The Rule of Euphony and Historical Variance` |
| `Ohnosha_Nations-Cultures 3.0.pdf`; metadata `Ohnosha_Nations-Cultures 3.0` | `Supplement 2: Ohnosha Nations and Cultures 3.0` |
| `The Conceptual Lexicon_CELAN.pdf`; visible title `The Conceptual Lexicon` | `Supplement 3: The Conceptual Lexicon` |
| `Supplement_4A_VSO_Cultural_Notes.md` | `Supplement 4A: VSO Cultural Notes` |
| `Supplement_4B_Celan_Capitalization_Rules.md` | `Supplement 4B: Celan Capitalization Rules` |

## Legacy World Names

Current naming policy: use `Ohnosha` for the world/project name in English/context metadata, `Terra` for the Celan sacred/world term, and `terra` for physical land or ground.

Current naming treatment:

- `Ohnosha`: current world/project name in ordinary English/context metadata.
- `Terra`: Celan sacred/world term for the living/spiritual world concept.
- `terra`: Celan physical land, earth, or ground.
- Outdated world-name references should be updated to `Ohnosha` in extracted metadata and documentation.

## Metadata and TOC Labels

PDF metadata titles, visible document titles, file names, and table-of-contents headings are source evidence, but they do not override the user-approved canonical source name.

If these labels conflict, preserve the mismatch as metadata. Do not normalize the source text, rewrite the title, or infer that one title replaces another.

## Where Mismatches Go

Title, metadata, TOC, or file-name mismatches should be documented in `potential_tensions.csv` only when they affect source trust, lookup, import clarity, or canon interpretation.

Use:

- `relationship_type`: `source ambiguity`
- `review_status`: `Source Ambiguity`
- `review_reason`: `source ambiguity`

## Source Volume Field

For extracted supplemental entries, use the canonical user-approved source name in `source_volume`.

Do not use conflicting internal labels like `Volume 4C` or `Table of Contents: Volume 4` as the main `source_volume` unless the user explicitly approves that name.

## Notes Field

When useful, record internal labels in `notes`, not in canon wording.

Example note:

`PDF metadata title is "Celan_Ancient_Language: Volume 4C"; visible TOC says "Table of Contents: Volume 4"; user-designated source is "Supplement 1: The Rule of Euphony and Historical Variance."`

## Preservation Rule

Preserve first. Identify second. Cross-link third. Flag only when the mismatch could confuse lookup, source trust, or canon interpretation.
