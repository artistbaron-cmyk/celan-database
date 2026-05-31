# Ohnosha 2.0 Celan Knowledgebase

Canon handling rule: material is reorganized only. Source wording is preserved where possible. Duplications, overlaps, inconsistencies, or contradictions are not resolved; they are flagged in Potential Tensions.

Overlap handling rule: preserve separate entries first, cross-link them second, and flag them third. Do not merge, rewrite, standardize, or resolve canon unless the source text itself explicitly resolves it.

## Source-Control Status

- Source PDFs copied into `/source_pdfs`.
- Backup PDFs copied into `/backup`.
- Original root PDFs were not overwritten or moved.
- Volume 1 extraction status: Complete.
- Volume 2 extraction status: Complete.
- Volume 3 extraction status: Complete.
- Volume 4 extraction status: Complete.
- Supplement 1 extraction status: Complete.
- Supplement 2 extraction status: Complete.
- Supplement 3 extraction status: Complete.
- Supplement 4A extraction status: Complete.
- Supplement 4B extraction status: Complete.
- Complete source-section coverage details are maintained in `knowledgebase/01_source_volumes.md`.

## Source Inventory

| Source | Source file | Backup file | Status |
|---|---|---|---|
| Volume 1: Fundamentals | `source_pdfs/Volume_1.pdf` | `backup/Volume_1.pdf` | Complete |
| Volume 2: Dictionary and Word Formation | `source_pdfs/Volume_2.pdf` | `backup/Volume_2.pdf` | Complete |
| Volume 3: Culture, Context, and Advanced Expression | `source_pdfs/Volume_3.pdf` | `backup/Volume_3.pdf` | Complete |
| Volume 4: Expansion, Tangible Lexicon, Modality, and National Speech | `source_pdfs/Volume_4.pdf` | `backup/Volume_4.pdf` | Complete |
| Supplement 1: The Rule of Euphony and Historical Variance | `source_pdfs/Supplement_1_Rule_of_Euphony_and_Historical_Variance.pdf` | `backup/Supplement_1_Rule_of_Euphony_and_Historical_Variance.pdf` | Complete |
| Supplement 2: Ohnosha Nations and Cultures 3.0 | `source_pdfs/Supplement_2_Ohnosha_Nations_Cultures_3_0.pdf` | `backup/Supplement_2_Ohnosha_Nations_Cultures_3_0.pdf` | Complete |
| Supplement 3: The Conceptual Lexicon | `source_pdfs/Supplement_3_The_Conceptual_Lexicon.pdf` | `backup/Supplement_3_The_Conceptual_Lexicon.pdf` | Complete |
| Supplement 4A: VSO Cultural Notes | `source_texts/Supplement_4A_VSO_Cultural_Notes.md` | `backup/Supplement_4A_VSO_Cultural_Notes.md` | Complete |
| Supplement 4B: Celan Capitalization Rules | `source_texts/Supplement_4B_Celan_Capitalization_Rules.md` | `backup/Supplement_4B_Celan_Capitalization_Rules.md` | Complete |

## Databases

| Database | Markdown | CSV |
|---|---|---|
| Source Volumes | `knowledgebase/01_source_volumes.md` | n/a |
| Grammar Rules | `knowledgebase/02_grammar_rules.md` | `data/grammar_rules.csv` |
| Lexicon | `knowledgebase/03_lexicon.md` | `data/lexicon.csv` |
| Roots and Morphology | `knowledgebase/04_roots_and_morphology.md` | `data/roots_and_morphology.csv` |
| Culture and Context | `knowledgebase/05_culture_and_context.md` | `data/culture_and_context.csv` |
| Phrases and Examples | `knowledgebase/06_phrases_and_examples.md` | `data/phrases_and_examples.csv` |
| Potential Tensions | `knowledgebase/07_potential_tensions.md` | `data/potential_tensions.csv` |

## Supplemental Editorial Databases

These datasets are acknowledged as intentional editorial/analysis layers. They do not replace the canon extraction databases above.

| Database | Markdown | CSV | Role |
|---|---|---|---|
| Expanded Root Audit | `knowledgebase/12_expanded_root_audit.md` | n/a | Working taxonomy and audit for expanded root strategy. |
| Expanded Root Database | `knowledgebase/12_expanded_root_audit.md` | `data/expanded_root_database.csv` | Expanded root/morpheme intelligence layer (`established`, `promoted`, `created`) for analysis and controlled future canon decisions. |
| Expanded Root Crosswalk | `knowledgebase/12_expanded_root_audit.md` | `data/expanded_root_crosswalk.csv` | Traceability map from expanded entries back to canon evidence and source entry IDs. |

## Import Support

- Notion import guide: `knowledgebase/08_notion_import_guide.md`
- Source identity policy: `knowledgebase/09_source_identity_policy.md`
- Editorial canon policy: `knowledgebase/11_editorial_canon_policy.md`

## Source Section Master Index

This section mirrors the source-section coverage inventory so the master index can be used as the top-level Notion import/checklist page. Detailed extraction notes remain in `knowledgebase/01_source_volumes.md`.

| Volume | Section | Status | Destination |
|---|---|---|---|
| Volume 1 | Table of Contents: Volume 1 | Indexed only | `01_source_volumes.md` |
| Volume 1 | Introduction > The Origins of Celan | Extracted | `culture_and_context.csv` |
| Volume 1 | Introduction > Purpose of the Guide | Extracted | `culture_and_context.csv` |
| Volume 1 | Phonetics and Pronunciation > Vowels | Extracted | `grammar_rules.csv` |
| Volume 1 | Phonetics and Pronunciation > Consonants | Extracted | `grammar_rules.csv` |
| Volume 1 | Phonetics and Pronunciation > Pronunciation Rules | Extracted | `grammar_rules.csv` |
| Volume 1 | Basic Sentence Structure > Verb-Subject-Object (VSO) | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv` |
| Volume 1 | Basic Sentence Structure > Forming Questions | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv` |
| Volume 1 | Pronouns and Person Markers > Personal Pronouns | Extracted | `grammar_rules.csv`; `lexicon.csv` |
| Volume 1 | Pronouns and Person Markers > Possessive Forms | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `roots_and_morphology.csv` |
| Volume 1 | Gendered and Neutral Terms | Extracted | All applicable databases |
| Volume 1 | Grammar > Tenses and Aspects | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` |
| Volume 1 | Grammar > Negation | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` |
| Volume 1 | Grammar > Questions and Imperatives | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` |
| Volume 1 | Grammar > Conditionals | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` |
| Volume 1 | Grammar > Prepositions and Case Markers | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 2 | Table of Contents: Volume 2 | Indexed only | `01_source_volumes.md` |
| Volume 2 | Volume Description | Extracted | `culture_and_context.csv` |
| Volume 2 | Vocabulary > Nature | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Greetings | Extracted | `lexicon.csv` |
| Volume 2 | Vocabulary > Time & Mysticism | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Strength & Empowerment | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Community | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Emotions | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Body | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Elements of Wonder | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Everyday Life | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Nature and Landscapes | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Urban and Mystical Spaces | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Vocabulary > Words for Times of Day | Extracted | `culture_and_context.csv`; `lexicon.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv` |
| Volume 2 | Vocabulary > Expanded Vocabulary | Extracted | `roots_and_morphology.csv`; `lexicon.csv`; `phrases_and_examples.csv` |
| Volume 2 | Vocabulary > Root Words in Celan | Extracted | `roots_and_morphology.csv` |
| Volume 2 | Vocabulary > Refined Relationships Chart | Extracted | `lexicon.csv`; `phrases_and_examples.csv` |
| Volume 2 | JARGON: (BATTLE, TEMPLE, MARKET) | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 2 | Word Formation and Morphology > Pluralization | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv` |
| Volume 2 | Word Formation and Morphology > Derivation and Word Formation | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv` |
| Volume 2 | Word Formation and Morphology > Compounding | Extracted | `grammar_rules.csv`; `lexicon.csv`; `potential_tensions.csv` |
| Volume 2 | Food Vocabulary | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 2 | Seasons | Extracted | `lexicon.csv`; `phrases_and_examples.csv` |
| Volume 2 | Weather Terms | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv` |
| Volume 2 | Nuances of Quantification and Specificity | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 2 | Interjections and Exclamations | Extracted | `lexicon.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 3 | Table of Contents: Volume 3 | Indexed only | `01_source_volumes.md` |
| Volume 3 | Volume Description | Extracted | `culture_and_context.csv` |
| Volume 3 | Politeness and Honorifics | Extracted | `grammar_rules.csv`; `lexicon.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 3 | Register Markers | Extracted | `lexicon.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 3 | Pragmatic Usage and Discourse Markers | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 3 | Complex Sentence Structures | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 3 | Kinship Terms | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv` |
| Volume 3 | Possession (Detailed) | Extracted | `grammar_rules.csv`; `lexicon.csv`; `roots_and_morphology.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 3 | Cultural & Ritual Expressions | Extracted | `lexicon.csv`; `potential_tensions.csv` |
| Volume 3 | Core Emotion Verbs | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 3 | Idioms/Proverbs | Extracted | `phrases_and_examples.csv` |
| Volume 3 | Language Use Across the Nations of Ohnosha | Extracted | `culture_and_context.csv`; `phrases_and_examples.csv`; `lexicon.csv`; `potential_tensions.csv` |
| Volume 3 | Slurs for each of the eight nations | Extracted | `lexicon.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 3 | Sample Phrases and Sentences | Extracted | `phrases_and_examples.csv` |
| Volume 3 | Numbering System and Basic Math in Celan | Extracted | `grammar_rules.csv`; `lexicon.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `culture_and_context.csv` |
| Volume 3 | Conclusion | Extracted | `culture_and_context.csv` |
| Volume 4 | Table of Contents: Volume 4 | Indexed only | `01_source_volumes.md` |
| Volume 4 | Volume Description | Extracted | `culture_and_context.csv` |
| Volume 4 | Introduction: From the Abstract to the Tangible | Indexed only | `potential_tensions.csv` |
| Volume 4 | Systemic Expansion > The Adjectival Suffix -eth | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 4 | Systemic Expansion > Verb Mood and Modality | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 4 | Systemic Expansion > Passive Voice / nor-ka | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 4 | Systemic Expansion > Advanced Pronouns | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 4 | Living Lexicon > Mundane Objects & Tools | Extracted | `lexicon.csv`; `phrases_and_examples.csv` |
| Volume 4 | Living Lexicon > Basic & Sensory Adjectives | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 4 | Living Lexicon > Clothing & Worn Items | Extracted | `lexicon.csv`; `phrases_and_examples.csv` |
| Volume 4 | Living Lexicon > Colors | Extracted | `lexicon.csv`; `phrases_and_examples.csv` |
| Volume 4 | Living Lexicon > Essential Verbs of Action & Sensation | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 4 | Living Lexicon > Essential Conjunctions | Extracted | `grammar_rules.csv`; `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 4 | Living Lexicon > Archetypal Flora & Fauna | Extracted | `lexicon.csv`; `phrases_and_examples.csv` |
| Volume 4 | Living Lexicon > Abstract Social & Personal Concepts | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Volume 4 | Living Lexicon > Measurement | Extracted | `lexicon.csv`; `phrases_and_examples.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 4 | Expanded Interjections, Oaths, & Expressions | Extracted | `lexicon.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 4 | Polysemy and Context in Celan | Extracted | `lexicon.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Volume 4 | National Vernaculars and Comparative Dialogue | Extracted | `culture_and_context.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 1 | Table of Contents / PDF Metadata | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 1 | Section 5:1: Advanced Phonology - The Rule of Euphony and Historical Variance | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 1 | Tiers of Application > Tier 1: Mandatory Application | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 1 | Tiers of Application > Tier 2: Optional / Stylistic Application | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 1 | Tiers of Application > Tier 3: Never Applied | Extracted | `grammar_rules.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 1 | It's Not a Universal Rule; It's a "Cultural Voice" Indicator | Extracted | `grammar_rules.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 1 | The Rule of Euphony: A National Brief | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Document Overview | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Valkeldor Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Nivveil Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Verdalris Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Mechuma Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Marakor Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Pelagae Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Jasara Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Zarithan Profile | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 2 | Top 5 Jobs in each nation | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 3 | Introduction: The Soul of the Roots | Extracted | `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 3 | Part 1: The Primordial Forces | Extracted | `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 3 | Part 2: The Elemental Pillars | Extracted | `roots_and_morphology.csv`; `culture_and_context.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 3 | Clarification on Terra vs. Ohnosha | Extracted | `culture_and_context.csv`; `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 3 | Part 3: The Metaphysical Concepts | Extracted | `roots_and_morphology.csv`; `culture_and_context.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 3 | Part 4: The Social & Personal Concepts | Extracted | `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 3 | Part 5: The Concepts of Action & Being | Extracted | `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 3 | Part 6: The Concepts of Society & Culture | Extracted | `roots_and_morphology.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 4A | The Heart of Action: VSO Cultural Notes | Extracted | `grammar_rules.csv`; `culture_and_context.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 4A | Prioritizing the Action | Extracted | `grammar_rules.csv`; `culture_and_context.csv`; `phrases_and_examples.csv` |
| Supplement 4A | De-emphasizing the "Self" as the Sole Initiator | Extracted | `culture_and_context.csv`; `phrases_and_examples.csv` |
| Supplement 4A | Implications for Expressing Core Concepts | Extracted | `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 4B | The Rules of Celan Capitalization | Extracted | `grammar_rules.csv`; `culture_and_context.csv`; `potential_tensions.csv` |
| Supplement 4B | Rule 1: Sentence-initial lowercase | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 4B | Rule 2: Archetypal and Primordial Concepts | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 4B | Rule 3: Nations, Titles, Proper Names, and Four Pillars | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
| Supplement 4B | Rule 4: Capitalized Pronoun I | Extracted | `grammar_rules.csv` |
| Supplement 4B | Rule 5: Poetic and Emotional Emphasis | Extracted | `grammar_rules.csv`; `phrases_and_examples.csv`; `potential_tensions.csv` |
