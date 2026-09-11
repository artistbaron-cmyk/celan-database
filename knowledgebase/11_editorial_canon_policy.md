# Editorial Canon Policy

This policy defines how Ohnosha 2.0 treats source inconsistencies, AI artifacts, and human-approved corrections moving forward.

The source PDFs and supplemental files remain preserved as source witnesses. The knowledgebase is the current curated canon edition.

## Core Principle

Preserve the source record, but do not allow known AI artifacts, outdated names, or corrected spellings to keep reproducing as current canon.

When a conflict exists between an older source form and a human-approved editorial decision, the database should use the approved editorial decision as the current working canon while keeping the older source traceable through notes, source references, or potential tension records.

## Source Witness vs. Canon Edition

Source witnesses are the original PDFs, supplemental files, extracted wording, page numbers, and source-section references. They show where a form came from.

The canon edition is the cleaned, current database layer used for lookup, writing, Notion import, and future language development.

Do not edit original PDFs. Do not erase source history. Do not pretend a source said something it did not say.

Do update the editable knowledgebase and CSV layer when the user approves a correction.

## Review Status Treatment

Use `Approved` when a form is accepted as current canon or when an editorial cleanup has been approved.

Use `Needs Human Review` when the form may be correct but needs a canon decision.

Use `Extraction Uncertain` when the issue may come from PDF extraction, OCR, table parsing, or formatting loss.

Use `Source Ambiguity` when the source itself is unclear, provisional, internally uncertain, or marked as proposed.

Approved rows should have a blank `review_reason`.

Non-approved rows should have a short `review_reason`.

## ED-0001: Hyphen and Apostrophe Cleanup

Status: Approved.

Hyphens are used for grammatical scaffolding: tense markers, honorifics, number-building, possession, relational suffixes, modality, passive/echo particles, and other explicitly grammatical attachments.

Root-root compounds are fused into one word unless the source or an approved editorial rule explicitly requires separation.

Do not treat hyphenated and fused root-root compounds as semantically different unless the source clearly defines such a distinction.

Apostrophes are preserved for ritual/spiritual terms, interjections, discourse particles, sacred names, and approved expressive or register-marked forms.

Apostrophe style is normalized to the straight apostrophe character: `'`.

Do not invent a universal apostrophe rule from pattern alone.

Examples of approved fused forms:

- `Morldren`
- `Belshara`
- `Rathvethor`
- `Talrin`
- `Rinvarash`
- `Vellian`
- `Terrarav`
- `zhirrathor`
- `Kalrin`
- `Drenkaesh`
- `Tharfah`
- `Varkareth`
- `Eshreth`
- `Vethordrenka`
- `Rathorkinash`

Examples of grammatical hyphens to preserve:

- `Tha-var`
- `Nor-var`
- `Li-Ser`
- `Ilin-ka`
- `Kadron-esh`
- `Ten-del`
- `Hek-unar`
- `thar-ka`
- `nor-ka`

## ED-0002: Source Identity and Legacy Naming

Status: Approved.

Use `Ohnosha` for the current English/world/project name.

Use `Ohnoshan` where older material says `Alterran`.

Use `Terra` for the Celan sacred/world term.

Use `terra` for physical land, earth, or ground.

`Alterra` and `Alterran` are legacy/outdated names and should not be used in the current database layer except when discussing historical source identity or legacy naming cleanup.

## ED-0003: Optional Euphony

Status: Approved.

Euphonic smoothing is a speaker choice, not a mandatory grammatical repair. An unsmoothed root-root construction remains valid even when most or all national voices prefer a smoother form.

The neutral connecting vowel is often `a`; `e` and `o` may also be used through vowel harmony. When `Wek` is the second root, the approved euphonic choices are `-ewek` and `-owek`, not `-awek`, preserving the independent root `Awek` meaning a natural water spring.

Euphonic forms remain variants of the same lexical entry. They keep the same universal core meaning, resolve to the same app entry, and do not increase the unique-headword count.

Source-witness rows describing mandatory smoothing remain preserved. The current app-facing grammar guide follows this approved editorial decision.

## ED-0004: National Expansion Batch 1

Status: Approved.

National Expansion 1 adds forty universal Celan headwords developed through the practical domains of Ohnosha's eight nations. Each entry has a universal core definition, a nation of origin, characteristic national usage, explicit pronunciation, derivation, and linked examples.

National origin does not restrict a word to one nation. Other nations may use the same headword with a close contextual application while preserving its core meaning. Stable euphonic choices are stored as variants rather than separate headwords.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-NE1-0001` through `LX-NE1-0040`.

## ED-0005: Conversational and Narrative Engine 1

Status: Approved.

Approval date: 2026-09-11.

Conversational and Narrative Engine 1 adds forty approved entries for ordinary physical action, attempts and outcomes, thought and memory, aspect and coordination, causal explanation, conversational repair, and spatial or temporal scene description. The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-CNE1-0001` through `LX-CNE1-0040`.

`Dor`, `Dar`, `Siv`, and `Kes` are approved as new primitive roots with the meanings recorded in the expanded root database. Approval of these roots does not authorize unlisted derivative families. Only the derivatives included in this approved batch are canon.

`Shan` gains the approved prepositional sense “through or across from one side or boundary to another” while retaining its established passing and transfer meaning.

For this batch and as the default for future expansion review, the unsmoothed construction is the primary headword and optional euphonic forms are searchable variants of that entry. A specifically approved exception may use an euphonic form as its display headword. This decision does not retroactively rename previously approved entries.

Expansion vocabulary reuses existing dictionary categories. A new category requires a separate explicit schema decision; descriptive labels such as primitive root, result-state, temporal use, or new sense belong in root, derivation, usage, or editorial metadata rather than the category field.

Ordinary remembering and forgetting remain distinct from ritual or memorial remembrance. `Velzhiraen` and `Kavelzhiraen` cover ordinary memory while `Rathorimaen` retains its memorial and ceremonial force.

## NotebookLM Standardization Text

Use the following text as a NotebookLM source or instruction note when analyzing Celan/Ohnosha materials:

```text
Ohnosha 2.0 Editorial Canon Policy

Treat the original PDFs and supplemental files as source witnesses, not automatically as the final cleaned canon. The current knowledgebase is the curated canon edition.

Do not resolve contradictions by inventing explanations. If older materials conflict, preserve the source trace but prefer human-approved editorial decisions as the current working canon.

Current naming:
- Use Ohnosha for the world/project name in English.
- Use Ohnoshan where older material says Alterran.
- Do not use Alterra or Alterran as current canon names.
- Use Terra for the Celan sacred/world concept.
- Use terra for physical land, earth, or ground.

Hyphen rule:
- Preserve hyphens for grammatical scaffolding: tense, honorifics, possession, relational suffixes, number-building, modality, passive/echo particles, and other explicit grammatical markers.
- Root-root compounds are fused into one word unless an approved source explicitly defines a separated form.
- Do not treat hyphenated and fused root-root compounds as different meanings unless canon explicitly says so.

Approved fused forms include:
Morldren, Belshara, Rathvethor, Talrin, Rinvarash, Vellian, Terrarav, zhirrathor, Kalrin, Drenkaesh, Tharfah, Varkareth, Eshreth, Vethordrenka, Rathorkinash.

Apostrophe rule:
- Preserve apostrophes in ritual/spiritual terms, interjections, discourse particles, sacred names, and approved expressive/register-marked forms.
- Normalize apostrophes to the straight apostrophe character: '.
- Do not invent a broad apostrophe grammar rule from pattern alone.

When analyzing examples:
- Do not smooth, rewrite, or rationalize old errors automatically.
- Flag likely AI artifacts, sentence-structure errors, outdated names, or inconsistent spellings.
- Distinguish between source witness wording and current canon-edition wording.
- If uncertain, mark the case as Needs Human Review rather than resolving it.
```

## Future Editorial Decisions

Future corrections should receive decision IDs.

Recommended pattern:

- `ED-0001`: Hyphen and Apostrophe Cleanup
- `ED-0002`: Source Identity and Legacy Naming
- `ED-0003`: Sentence Structure / Canon Example Corrections
- `ED-0004`: Vocabulary Form Standardization

Each decision should record:

- status
- date or approval context when useful
- approved rule
- affected forms or entries
- whether source wording was preserved, corrected, deprecated, or flagged

## Operating Rule

Preserve first. Correct only after approval. Cross-link where useful. Flag unresolved uncertainty. Treat approved editorial decisions as true moving forward.
