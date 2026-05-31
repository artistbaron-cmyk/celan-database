# Source Volumes

## Audit Plan

### 1. Content Belonging in Each Database

**Grammar Rules**

Rules for phonetics, pronunciation, sentence order, questions, pronouns, possession, tenses, aspects, negation, imperatives, conditionals, prepositions, case markers, politeness registers, discourse markers, complex sentence structures, modality, passive voice, dual and clusivity, adjectival suffixes, conjunctions, and other grammatical systems.

**Lexicon**

Individual Celan words and phrases treated as vocabulary entries, including meanings, usage notes, categories, national or cultural variants, tangible-object vocabulary, food vocabulary, kinship terms when presented as vocabulary, colors, verbs, interjections, oaths, and expressions.

**Roots and Morphology**

Root words, derivational families, suffixes, prefixes, pluralization rules, compounding rules, morphology examples, word-formation patterns, and any stated relationship between roots and derived forms.

**Culture and Context**

Origin narratives, Ohnoshan cultural context, national speech patterns, ceremonial or ritual contexts, pragmatic use, politeness culture, social registers, kinship systems as cultural systems, idioms, etiquette, social norms, and usage by nation or community.

**Phrases and Examples**

Every sentence example, translation, analysis line, sample conversation, formulaic expression, oath, greeting, farewell, and usage example. Where an example also illustrates a rule, it should link back to the relevant grammar or morphology entry through shared source volume, section, and optional related entry IDs.

**Potential Tensions**

Overlaps, duplicated definitions, competing explanations, possible inconsistencies, extraction uncertainty, OCR/text-order problems, and places where a later volume appears to expand, formalize, or complicate an earlier rule.

### 2. Recommended Fields

**grammar_rules.csv**

`entry_id,source_volume,source_section,page_number,rule_name,category,original_wording,examples,canon_status,notes,related_entry_ids,relationship_type,potential_tension_id,review_status,review_reason`

**lexicon.csv**

`entry_id,source_volume,source_section,page_number,celan_term,english_meaning,category,usage_context,original_wording,canon_status,notes,related_entry_ids,relationship_type,potential_tension_id,review_status,review_reason`

**roots_and_morphology.csv**

`entry_id,source_volume,source_section,page_number,root_or_morpheme,type,meaning_or_function,derived_forms,original_wording,canon_status,notes,related_entry_ids,relationship_type,potential_tension_id,review_status,review_reason`

**culture_and_context.csv**

`entry_id,source_volume,source_section,page_number,topic,culture_or_context,original_wording,canon_status,notes,related_entry_ids,relationship_type,potential_tension_id,review_status,review_reason`

**phrases_and_examples.csv**

`entry_id,source_volume,source_section,page_number,celan_text,translation,example_type,analysis,canon_status,notes,related_entry_ids,relationship_type,potential_tension_id,review_status,review_reason`

**potential_tensions.csv**

`entry_id,source_volume,source_section,page_number,related_source_volume,related_source_section,issue_type,original_wording,description,canon_status,notes,related_entry_ids,relationship_type,potential_tension_id,review_status,review_reason`

### 2a. Cross-Linking and Review Fields

**related_entry_ids**

Entry IDs for preserved separate entries that should be read alongside this entry. Multiple IDs should be separated with semicolons.

**relationship_type**

Approved labels: `duplicate`, `expansion`, `refinement`, `related usage`, `possible contradiction`, `terminology overlap`, `source ambiguity`.

**potential_tension_id**

The matching row ID in `potential_tensions.csv`, if the relationship requires explicit tracking. Leave blank for ordinary cross-links that do not create tension.

**review_status**

Approved values: `Approved`, `Needs Human Review`, `Extraction Uncertain`, `Source Ambiguity`.

**review_reason**

Short metadata-only reason for non-approved review statuses. Leave blank when `review_status` is `Approved`.

Preserve first. Cross-link second. Flag third. Never resolve unless the source itself explicitly resolves it.

### 3. Sections That May Overlap Across Volumes

- Volume 1 `Pronouns and Person Markers` may overlap with Volume 4 `Advanced Pronouns (Dual & Clusivity)`.
- Volume 1 `Possessive Forms` and `Case Markers` may overlap with Volume 3 `Possession (Detailed)`.
- Volume 1 `Questions and Imperatives` may overlap with Volume 3 `Negative and Imperative Forms`.
- Volume 1 `Conditionals` may overlap with Volume 3 `Complex Sentence Structures` and Volume 4 `Verb Mood and Modality`.
- Volume 1 `Tenses and Aspects` may overlap with Volume 2 morphology material and Volume 4 modality.
- Volume 1 `Gendered and Neutral Terms` may overlap with Volume 2 relationship vocabulary and Volume 3 kinship material.
- Volume 2 `Root Words in Celan`, `Word Formation and Morphology`, and Volume 4 `The Adjectival Suffix` likely overlap in derivation and suffix treatment.
- Volume 2 vocabulary themes may overlap with Volume 4 `The Living Lexicon`.
- Volume 3 politeness, ritual language, discourse markers, and Volume 4 interjections, oaths, expressions, and national speech may overlap in pragmatic/cultural usage.

### 4. Recommended Extraction Order

1. Create a section inventory from all PDF outlines and tables of contents.
2. Extract Volume 1 first as the baseline grammar and fundamentals layer.
3. Extract Volume 2 lexicon and morphology next, preserving thematic groupings.
4. Extract Volume 3 cultural, pragmatic, advanced grammar, kinship, and discourse material.
5. Extract Volume 4 expansions last so formalizations and later additions can be flagged without overwriting earlier canon.
6. Run a final source-section coverage pass so every source section has a knowledgebase entry or index reference.
7. Run a potential-tensions pass across all databases.

### 5. PDF Extraction and OCR Risks

- The PDFs contain selectable text, so OCR may not be required.
- Extracted text sometimes has unusual spacing and line breaks.
- Tables may lose column structure and need careful human-readable preservation.
- Bullets and nested outlines may flatten during extraction.
- Page numbers are extractable by PDF page index, but printed page numbers may differ if the PDFs include cover/table-of-contents pages.
- Some sections begin near page boundaries, so entries may need multiple page references or conservative `Needs Human Review` notes.

## Source Inventory Snapshot

| Source Volume | File | Page Count | Extraction Status |
|---|---|---:|---|
| Volume 1: Fundamentals | `source_pdfs/Volume_1.pdf` | 9 | Complete |
| Volume 2: Dictionary and Word Formation | `source_pdfs/Volume_2.pdf` | 23 | Complete |
| Volume 3: Culture, Context, and Advanced Expression | `source_pdfs/Volume_3.pdf` | 32 | Complete |
| Volume 4: Expansion, Tangible Lexicon, Modality, and National Speech | `source_pdfs/Volume_4.pdf` | 29 | Complete |
| Supplement 1: The Rule of Euphony and Historical Variance | `source_pdfs/Supplement_1_Rule_of_Euphony_and_Historical_Variance.pdf` | 5 | Complete |
| Supplement 2: Ohnosha Nations and Cultures 3.0 | `source_pdfs/Supplement_2_Ohnosha_Nations_Cultures_3_0.pdf` | 45 | Complete |
| Supplement 3: The Conceptual Lexicon | `source_pdfs/Supplement_3_The_Conceptual_Lexicon.pdf` | 17 | Complete |
| Supplement 4A: VSO Cultural Notes | `source_texts/Supplement_4A_VSO_Cultural_Notes.md` | text | Complete |
| Supplement 4B: Celan Capitalization Rules | `source_texts/Supplement_4B_Celan_Capitalization_Rules.md` | text | Complete |


## Volume 1 Section Coverage

| Section | Status | Destination | Notes |
|---|---|---|---|
| Table of Contents: Volume 1 | Indexed only | `01_source_volumes.md` | Navigation/outline page, not extracted as canon content entries. |
| Introduction > The Origins of Celan | Extracted | `culture_and_context.csv` | Original wording preserved. |
| Introduction > Purpose of the Guide | Extracted | `culture_and_context.csv` | Original wording preserved. |
| Phonetics and Pronunciation > Vowels | Extracted | `grammar_rules.csv` | Bullet examples preserved. |
| Phonetics and Pronunciation > Consonants | Extracted | `grammar_rules.csv` | Bullet examples preserved. |
| Phonetics and Pronunciation > Pronunciation Rules | Extracted | `grammar_rules.csv` | Bullet list preserved. |
| Basic Sentence Structure > Verb-Subject-Object (VSO) | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv` | Cross-linked with examples. |
| Basic Sentence Structure > Forming Questions | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv` | Cross-linked with examples. |
| Pronouns and Person Markers > Personal Pronouns | Extracted | `grammar_rules.csv`; `lexicon.csv` | Source table flattened in CSV and preserved in Markdown entries. |
| Pronouns and Person Markers > Possessive Forms | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `roots_and_morphology.csv` | Ka/-ka terminology overlap flagged. |
| Gendered and Neutral Terms | Extracted | All applicable databases | Roots, vocabulary, usage examples, and culture entries extracted separately. |
| Grammar > Tenses and Aspects | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` | Source table flattened in CSV and preserved in Markdown entries. |
| Grammar > Negation | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` | Bullet structure preserved. |
| Grammar > Questions and Imperatives | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` | Bullet structure preserved. |
| Grammar > Conditionals | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` | Bullet structure preserved. |
| Grammar > Prepositions and Case Markers | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Terminology overlaps flagged, not resolved. |

## Volume 2 Section Coverage

| Section | Status | Destination | Notes |
|---|---|---|---|
| Table of Contents: Volume 2 | Indexed only | `01_source_volumes.md` | Navigation/outline page; volume description extracted as context. |
| Volume Description | Extracted | `culture_and_context.csv` | Original description preserved. |
| Vocabulary > Nature | Extracted | `lexicon.csv`; `potential_tensions.csv` | Vocabulary table rows preserved. Overlapping terms flagged where they affect lookup. |
| Vocabulary > Greetings | Extracted | `lexicon.csv` | Vocabulary table rows preserved. |
| Vocabulary > Time & Mysticism | Extracted | `lexicon.csv`; `potential_tensions.csv` | Vocabulary table rows preserved. |
| Vocabulary > Strength & Empowerment | Extracted | `lexicon.csv`; `potential_tensions.csv` | Vocabulary table rows preserved. |
| Vocabulary > Community | Extracted | `lexicon.csv`; `potential_tensions.csv` | Vocabulary table rows preserved. |
| Vocabulary > Emotions | Extracted | `lexicon.csv`; `potential_tensions.csv` | Vocabulary table rows preserved. |
| Vocabulary > Body | Extracted | `lexicon.csv`; `potential_tensions.csv` | Body list preserved as lexicon rows. |
| Vocabulary > Elements of Wonder | Extracted | `lexicon.csv`; `potential_tensions.csv` | Vocabulary table rows preserved. |
| Vocabulary > Everyday Life | Extracted | `lexicon.csv`; `potential_tensions.csv` | Vocabulary table rows preserved. |
| Vocabulary > Nature and Landscapes | Extracted | `lexicon.csv`; `potential_tensions.csv` | Vocabulary table rows preserved. |
| Vocabulary > Urban and Mystical Spaces | Extracted | `lexicon.csv`; `potential_tensions.csv` | Vocabulary table rows preserved. |
| Vocabulary > Words for Times of Day | Extracted | `culture_and_context.csv`; `lexicon.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` | Numbered list structure preserved in original wording fields. |
| Vocabulary > Expanded Vocabulary | Extracted | `roots_and_morphology.csv`; `lexicon.csv`; `phrases_and_examples.csv` | Roots and their examples preserved separately. |
| Vocabulary > Root Words in Celan | Extracted | `roots_and_morphology.csv` | Root chart rows preserved. |
| Vocabulary > Refined Relationships Chart | Extracted | `lexicon.csv`; `phrases_and_examples.csv` | Relationship terms and example sentences preserved. |
| JARGON: (BATTLE, TEMPLE, MARKET) | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Source uncertainty in derivations flagged instead of resolved. |
| Word Formation and Morphology > Pluralization | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv` | Bullet rules and examples preserved. |
| Word Formation and Morphology > Derivation and Word Formation | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv` | Suffixes and prefixes preserved as morpheme rows. |
| Word Formation and Morphology > Compounding | Extracted | `grammar_rules.csv`; `lexicon.csv`; `potential_tensions.csv` | Rule and examples preserved. |
| Food Vocabulary | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Food terms, examples, summary, and national variants preserved. |
| Seasons | Extracted | `lexicon.csv`; `phrases_and_examples.csv` | Numbered list entries preserved. |
| Weather Terms | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv` | Weather terms and summary table preserved. |
| Nuances of Quantification and Specificity | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Source uncertainty preserved and flagged. |
| Interjections and Exclamations | Extracted | `lexicon.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Interjection entries preserved. |

## Volume 3 Section Coverage

| Section | Status | Destination | Notes |
|---|---|---|---|
| Table of Contents: Volume 3 | Indexed only | `01_source_volumes.md` | Navigation/outline page; volume description extracted as context. |
| Volume Description | Extracted | `culture_and_context.csv` | Original description preserved. |
| Politeness and Honorifics | Extracted | `grammar_rules.csv`; `lexicon.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Li- and -en refinement flagged. |
| Register Markers | Extracted | `lexicon.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Formal/informal terms and intensity markers preserved. |
| Pragmatic Usage and Discourse Markers | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Kora source uncertainty flagged. |
| Complex Sentence Structures | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Subordinate, relative, comparative, superlative, and conditional rules preserved. |
| Kinship Terms | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv` | Kinship lists and summary table represented as linked rows. |
| Possession (Detailed) | Extracted | `grammar_rules.csv`; `lexicon.csv`; `roots_and_morphology.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Ian/-esh systems preserved separately from earlier possession material. |
| Cultural & Ritual Expressions | Extracted | `lexicon.csv`; `potential_tensions.csv` | Tentative ritual-noun wording flagged as source ambiguity. |
| Core Emotion Verbs | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Hypothetical or not-yet-defined grammar notes flagged. |
| Idioms/Proverbs | Extracted | `phrases_and_examples.csv` | Idioms preserved with source meanings and themes. |
| Language Use Across the Nations of Ohnosha | Extracted | `culture_and_context.csv`; `phrases_and_examples.csv`; `lexicon.csv`; `potential_tensions.csv` | Language familiarity, Arvan/Trerran, national rituals, and regional summary preserved. |
| Slurs for each of the eight nations | Extracted | `lexicon.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Source describes slurs as proposed; flagged as source ambiguity. |
| Sample Phrases and Sentences | Extracted | `phrases_and_examples.csv` | General and national sample phrases preserved. |
| Numbering System and Basic Math in Celan | Extracted | `grammar_rules.csv`; `lexicon.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `culture_and_context.csv` | Numbering/math rules, base numbers, numeric prefixes, and examples preserved. |
| Conclusion | Extracted | `culture_and_context.csv` | Mastering Celan and Next Steps preserved. |

## Volume 4 Section Coverage

| Section | Status | Destination | Notes |
|---|---|---|---|
| Table of Contents: Volume 4 | Indexed only | `01_source_volumes.md` | Navigation/outline page; volume description extracted as context. |
| Volume Description | Extracted | `culture_and_context.csv` | Original description preserved. |
| Introduction: From the Abstract to the Tangible | Indexed only | `potential_tensions.csv` | Listed in TOC but no separate extracted body section found. |
| Systemic Expansion > The Adjectival Suffix -eth | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Formal -eth explanation preserved; earlier tension left unchanged. |
| Systemic Expansion > Verb Mood and Modality | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Modal adverbs and subjunctive mood preserved. |
| Systemic Expansion > Passive Voice / nor-ka | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Extraction gap in rule line flagged as source ambiguity. |
| Systemic Expansion > Advanced Pronouns | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Dual and clusivity preserved as expansion. |
| Living Lexicon > Mundane Objects & Tools | Extracted | `lexicon.csv`; `phrases_and_examples.csv` | Table rows preserved as linked entries. |
| Living Lexicon > Basic & Sensory Adjectives | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | -eth derivations cross-linked. |
| Living Lexicon > Clothing & Worn Items | Extracted | `lexicon.csv`; `phrases_and_examples.csv` | Table rows preserved. |
| Living Lexicon > Colors | Extracted | `lexicon.csv`; `phrases_and_examples.csv` | Table rows preserved. |
| Living Lexicon > Essential Verbs of Action & Sensation | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Contextual Tal/Talaen overlap flagged. |
| Living Lexicon > Essential Conjunctions | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Ser/Reth conjunction polysemy flagged. |
| Living Lexicon > Archetypal Flora & Fauna | Extracted | `lexicon.csv`; `phrases_and_examples.csv` | Table rows preserved. |
| Living Lexicon > Abstract Social & Personal Concepts | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Overlapping forms flagged where needed. |
| Living Lexicon > Measurement | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Aenor/Shen/Kinn measurement polysemy flagged. |
| Expanded Interjections, Oaths, & Expressions | Extracted | `lexicon.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Expanded expressions preserved as entries. |
| Polysemy and Context in Celan | Extracted | `lexicon.csv`; `culture_and_context.csv`; `potential_tensions.csv` | 25 polysemy entries preserved. |
| National Vernaculars and Comparative Dialogue | Extracted | `culture_and_context.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Cultural lenses and dialogue lines preserved. |

## Supplement 1 Section Coverage

| Section | Status | Destination | Notes |
|---|---|---|---|
| Table of Contents / PDF Metadata | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | User-designated supplement title used as canonical source name; internal PDF title mismatch flagged. |
| Section 5:1: Advanced Phonology - The Rule of Euphony and Historical Variance | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Core euphony rule, compound examples, and expansion of phonetics/compounding preserved. |
| Tiers of Application > Tier 1: Mandatory Application | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Mandatory insertion examples preserved; ambiguous Vok + Thal form flagged. |
| Tiers of Application > Tier 2: Optional / Stylistic Application | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Standard and poetic variant forms preserved separately. |
| Tiers of Application > Tier 3: Never Applied | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Smooth clusters and phonetic fossils preserved. |
| It's Not a Universal Rule; It's a "Cultural Voice" Indicator | Extracted | `grammar_rules.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Euphony as national/cultural voice expansion preserved. |
| The Rule of Euphony: A National Brief | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Eight national tendencies preserved as culture/context rows. |

## Supplement 2 Section Coverage

| Section | Status | Destination | Notes |
|---|---|---|---|
| Document Overview | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Supplemental world/culture canon; used to inform national language nuance without creating grammar rules. |
| Valkeldor Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Profile, language-nuance context, and occupation context preserved. |
| Nivveil Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Profile, language-nuance context, and occupation context preserved. |
| Verdalris Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Profile, language-nuance context, and occupation context preserved. |
| Mechuma Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Profile, language-nuance context, and occupation context preserved. |
| Marakor Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Profile, language-nuance context, and occupation context preserved. |
| Pelagae Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Profile, language-nuance context, and occupation context preserved. |
| Jasara Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Profile, language-nuance context, and occupation context preserved. |
| Zarithan Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Profile, language-nuance context, and occupation context preserved. |
| Top 5 Jobs in each nation | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Job titles preserved as culture/context only; not converted into Celan lexicon rows. |

## Supplement 3 Section Coverage

| Section | Status | Destination | Notes |
|---|---|---|---|
| Introduction: The Soul of the Roots | Extracted | `culture_and_context.csv`; `potential_tensions.csv` | Source framing preserved; "highest authority" wording flagged as source-authority metadata, not used to overwrite earlier entries. |
| Part 1: The Primordial Forces | Extracted | `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Shal and Fah/Vethor conceptual dimensions preserved as conceptual-root rows. |
| Part 2: The Elemental Pillars | Extracted | `roots_and_morphology.csv`; `culture_and_context.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Krez, Dren, Morl, Esh, and terra/Terra conceptual dimensions preserved. |
| Clarification on Terra vs. Ohnosha | Extracted | `culture_and_context.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Current naming applied: Ohnosha is the current world name. |
| Part 3: The Metaphysical Concepts | Extracted | `roots_and_morphology.csv`; `culture_and_context.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Lian, Thal, Reth/Rethvok, Nor, and Rin conceptual dimensions preserved. Rin identity basis cross-linked to identity context. |
| Part 4: The Social & Personal Concepts | Extracted | `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Bel, Kal, Shara, Ohm, and Thar conceptual dimensions preserved. |
| Part 5: The Concepts of Action & Being | Extracted | `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Var, Aen, Pralaen, Rav, and Vok conceptual dimensions preserved. Aen/Aenor and Vok polysemy flagged as refinements. |
| Part 6: The Concepts of Society & Culture | Extracted | `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Ser, Rath, Khum, Zhir, and Kel conceptual dimensions preserved. Multifunction roots cross-linked to earlier grammar/lexicon rows. |

## Supplement 4A Section Coverage

| Section | Status | Destination | Notes |
|---|---|---|---|
| The Heart of Action: How Celan's VSO Structure Reflects Ohnoshan Worldview | Extracted | `grammar_rules.csv`; `culture_and_context.csv`; `potential_tensions.csv` | VSO cultural philosophy preserved as supplemental refinement, not a replacement for the Volume 1 syntax rule. |
| Prioritizing the Action | Extracted | `grammar_rules.csv`; `culture_and_context.csv`; `phrases_and_examples.csv` | Action-first interpretation and examples preserved. |
| De-emphasizing the "Self" as the Sole Initiator | Extracted | `culture_and_context.csv`; `phrases_and_examples.csv` | Relational participant framing preserved. |
| Implications for Expressing Core Concepts | Extracted | `phrases_and_examples.csv`; `potential_tensions.csv` | Belief/love examples preserved; example-only forms flagged for lookup review. |
| Conclusion: Celan as a Reflection of Ohnosha | Extracted | `culture_and_context.csv` | Meaning-first-in-the-verb conclusion preserved. |

## Supplement 4B Section Coverage

| Section | Status | Destination | Notes |
|---|---|---|---|
| The Rules of Celan Capitalization | Extracted | `grammar_rules.csv`; `culture_and_context.csv`; `potential_tensions.csv` | Semantic capitalization philosophy preserved as supplemental orthography layer. |
| Rule 1: The First Word of a Sentence is NOT Capitalized | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Existing older examples preserved unchanged and flagged where sentence-initial capitalization may conflict. |
| Rule 2: Capitalize Archetypal and Primordial Concepts | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Terra/terra expanded to Dral/dral and Rathor/rathor contrasts. |
| Rule 3: Capitalize Names of Nations, Specific Titles, and Proper Names | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Nations, proper names, reverential titles, and Four Pillars capitalization preserved. |
| Rule 4: Capitalize the Pronoun "I" | Extracted | `grammar_rules.csv` | Self-pronoun capitalization rule preserved. |
| Rule 5: Poetic and Emotional Emphasis | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` | Poetic capitalization examples preserved; no older examples rewritten. |
