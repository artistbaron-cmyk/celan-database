# Celan 1,000-Headword Milestone Audit

**Audit date:** 2026-09-12  
**Scope:** Dictionary health, twelve controlled scene tests, controlled polysemy review, and a prioritized findings report  
**Canon status:** Read-only audit. No headword, sense, category, origin, visibility rule, or example was changed.

## Executive finding

Celan has crossed the numerical milestone with its structure intact. The assembled dictionary contains **1,022 headwords** and **1,092 displayed senses**. The expansion layer validates cleanly, approved polysemy remains additive, hidden senses have not been broadly re-exposed, and the recent vocabulary can carry most concrete scenes without resorting to English nouns.

The milestone does not reveal a need to redesign Celan's grammar or word-building system. It reveals a smaller and more useful next problem: a handful of ordinary functional meanings are missing between the now-rich specialist domains. The most consequential gaps are conversational repair, literacy and evidence, ordinary material failure, cargo handling, recreation, and general magical action. A separate controlled [polysemy audit](celan_polysemy_audit_1000.md) tests which apparent gaps may be filled by natural cultural extension rather than a new headword.

Two technical cleanup items should precede another large lexical batch:

1. Expansion entries categorized as **Measure** lose that category in the generated dictionary display.
2. Expansion/example CSV files contain mixed line endings, which the app accepts but stricter CSV readers reject.

## 1. Automated health check

| Check | Result | Assessment |
|---|---:|---|
| Assembled app headwords | 1,022 | Milestone exceeded by 22 |
| Displayed senses | 1,092 | Confirms intentional polysemy and multiple senses are being retained |
| Underlying source records | 1,198 | Includes source records that are merged, suppressed, or otherwise not counted as separate displayed headwords |
| Expansion headwords | 462 | All expansion rows have unique headword forms |
| Expansion variants | 129 | Variants remain alternatives, not duplicate headwords |
| Missing expansion pronunciations | 0 | Pass |
| Expansion entries with fewer than two linked examples | 0 | Pass |
| Duplicate expansion headwords | 0 | Pass |
| Variant/headword collisions | 0 | Pass |
| Duplicate variant spellings | 0 | Pass |
| Missing required expansion fields | 0 | Pass |
| Duplicate expanded-root forms | 0 | Pass |
| Expansion batches validated | 17 of 17 | Pass |

### Expected validation exception

The **Lun Polysemy Correction 1** batch reports that `Lun` already exists as `LX-V2-0077`. This is expected and correct: the later **Moon** sense was approved as additive polysemy beside the established **Lake** sense. The assembled dictionary retains both rather than replacing the earlier definition.

### Category integrity issue

Three approved expansion entries are categorized as **Measure** in the source expansion data but appear without a word type in the generated dictionary:

- `Jorvar` (`LX-TVO1-0025`)
- `Lianrethshen` (`LX-PFM1-0036`)
- `Vaarshen` (`LX-PFM1-0037`)

The source data is correct. The loss occurs in the app's expansion-category inference path, which does not currently pass **Measure** through to the display. `Ven` (`DM-RM-V3-0019`) is also uncategorized in the generated dictionary and should receive a separate source-level review; it is not part of the same expansion defect.

### Data interoperability issue

`data/lexicon_expansions.csv` and/or `data/phrases_and_examples.csv` contain mixed CRLF and LF line endings. The dictionary's parser tolerates them, but strict CSV tooling can stop with a malformed-newline error. This has not altered the lexical content, but the files should be normalized in a dedicated repair so future audits and exports behave consistently.

### Shape of the current lexicon

The expansion layer adds 322 nouns, 107 verbs, 14 adjectives, 7 prepositions, 6 particles, 3 measures, and a small number of conjunctions, quantifiers, and interjections. This is appropriately noun-heavy for a world-building expansion, but it also explains why remaining weaknesses are most visible in ordinary interaction and clause-building rather than in objects or institutions.

Only **13 of 1,022 headwords** are thirteen letters or longer—about 1.3%. Long forms are therefore a localized cadence concern, not a system-wide length problem. The more useful test is spoken burden: whether several compounds accumulate in one sentence.

The most frequently reused elements in recent derivations include `Vek`, `Bel`, `Pral`, `Mek`, `Xar`, `Zhir`, `Nor`, `Ral`, `Dren`, `Shara`, and `Shan`. This is not proof of misuse. It is a watchlist for semantic overextension and repetitive sound during future review, especially for `Vek` and `Bel`.

## 2. Twelve controlled scene tests

These are diagnostic scene frames, not approved phrasebank translations. A **Pass** means the scene can be expressed with established vocabulary and grammar. **Partial** means its central action works but one ordinary distinction requires circumlocution. **Gap** means an important part of the interaction lacks a dedicated, natural expression.

| # | Scene | Result | What Celan can carry | What strains or fails |
|---:|---|---|---|---|
| 1 | A person puts a cracked bowl on a table, tries to repair it, and notices that it still leaks | **Partial** | `Dor`, `Siv`, `Zhaelpralaen`, `Kes`, `Nethnor`, `Drenvor`, and `Pralor` carry the action sequence | No clean general vocabulary for a crack, a cracked condition, or leaking |
| 2 | A healer holds an injured hand, cleans it, applies medicine, and waits for the pain to ease | **Pass** | Holding, injury, cleaning, healing, medicine, waiting, and bodily pain are available | No blocking gap in the tested scene |
| 3 | Two partners discuss birth, death, sex, and whether they will protect a newborn together | **Pass** | The approved `Shalbal`, `Duma`, and `Tlamor` families combine with choice, uncertainty, protection, and `Servok` | A broader verb meaning everyday care or nurture would make related scenes less formal |
| 4 | One speaker interrupts, says they did not understand, disagrees, refuses the proposal, and apologizes | **Gap** | Interruption, uncertainty, negation, `Ka` as an ordinary “no,” emphatic `Verka`, reasons, mistakes, and solutions exist | No dedicated ordinary headwords surfaced for understand, disagree, or apologize. A lexical verb “refuse” remains absent, but the existing response construction may be sufficient |
| 5 | A water steward closes a canal gate and allocates enough water because a heatwave is coming | **Pass** | `Droral`, `Droshara`, `Shental`, `Weltalaen`, `Worlian`, `Xaraen`, and `Krezrek` support the full civic scene | No blocking gap |
| 6 | During a storm, a sled operator slows before a bridge and waits for visibility to return | **Pass** | Vehicle operation, sled, storm, before, bridge, waiting, and visibility language support the sequence | No blocking gap |
| 7 | A technician repairs an energy weapon beside a lightning-management tower, then tests it | **Pass** | `Mekral`, `Ngarzhel`, `Thalorimor`, repair, energy, and testing vocabulary carry the technical action | No blocking gap |
| 8 | A caravan follows a star route, detects an anomaly boundary, avoids it, and waits at a safe distance | **Pass** | `Sharavok`, `Dralshara`, `Lianrethxar`, `Kasharaen`, `Dar`, and `Vaarshen` cover the survival procedure | `Vaarshen` currently loses its Measure label in the app, though its meaning remains present |
| 9 | A council votes on a permit, then arbitrates a dispute about a contract | **Pass** | `Khumkel`, `Keltharaen`, `Belrinpel`, `Thalkelrethaen`, `Kelreth`, and `Kelvok` distinguish the institutional steps | No blocking gap |
| 10 | A forest practitioner cultivates a living structure, heals damage, and stabilizes an anomaly | **Partial** | Cultivation, healing, living material, and anomaly stabilization are strong | General-purpose words for magic, spell, casting, and magical capacity remain thin compared with named techniques |
| 11 | A ship reaches a harbor, docks, and its crew unloads cargo before the tide changes | **Partial** | Ship, sailing, harbor, dock, crew movement, tide, and sequence are available | General load/unload cargo verbs are not clearly established; disembarking people is not the same action |
| 12 | A sensor detects a grid failure; an engineer reads the data, records evidence, and reports the finding | **Partial** | Sensors, detection, grid failure, repair, measurement, and calibration are well covered | No dedicated general read/write vocabulary surfaced, and evidence/proof/reporting distinctions are weak |

### Scene-test result

- **Pass:** 7 scenes
- **Partial:** 4 scenes
- **Gap:** 1 scene

The result is strong for a lexicon that has just crossed 1,000 headwords. More importantly, the failures cluster coherently. Celan is not randomly porous; it is rich in concrete world activity and comparatively thin in a few connective human activities.

## 3. Findings and priorities

### Repair before expansion

1. Preserve and display the **Measure** category for expansion entries.
2. Review the source category of `Ven` without inventing a new category.
3. Normalize CSV line endings without changing any cells, order, IDs, or approved senses.
4. Re-run the same counts and all seventeen batch validations after the repairs.

### Highest-value lexical gaps

The next lexical work should be compact and driven by repeated scene need, not by a numerical target alone.

**Conversational repair and cognition**

- understand or comprehend
- disagree
- refuse or decline as a lexical verb only if scene tests show that ordinary `Ka` cannot carry the speech act
- apologize
- help, care for, or nurture in ordinary life

**Literacy, evidence, and reporting**

- read
- write or record
- evidence or proof
- report or finding

**Ordinary material and logistical states**

- crack and cracked
- leak and leaking
- load cargo
- unload cargo
- scarce, if `Felin` proves insufficient in scene use

**Recreation and expressive culture**

- play and game
- sport or contest as an ordinary category
- win and lose, distinct from generic succeeding and failing
- music, song, and dance as general activities rather than named ceremonies

**General magical action**

- magic as a broad phenomenon
- spell or working
- cast or perform magic
- magical capacity or aptitude

These meanings should first be checked against established roots, possible compounds, and the controlled polysemy candidate ledger. New primitives are justified only where reuse would distort an existing root. Polysemy is not a sense-count target: a candidate must preserve the established semantic center, remain clear in ordinary context, respect hidden-root policy, and enrich Celan more naturally than a new compound.

### Acceptable circumlocution

Not every English distinction requires a Celan headword. For example, scarcity may be expressible through `Felin` plus context, and some specialized magical actions may properly remain technique-specific. A circumlocution is healthy when it sounds native, remains short, and preserves the intended distinction. It is a real gap when speakers repeatedly need a long explanation for an ordinary action or cannot contrast two common situations.

## Recommended next sequence

1. Make the two mechanical repairs: category passthrough and newline normalization.
2. Re-run this audit to prove the repairs did not alter headword or sense counts.
3. Review the three strongest polysemy candidates—`Kel` as bounded text, and the `Anvekaen`/`Thalvekaen` cargo pair—without treating approval as automatic.
4. Scene-test the conditional `Keldoraen` and `Njor` extensions and keep productive metaphors such as “carry a responsibility” in usage rather than inflating displayed senses.
5. Recheck the semantic gap list after any approved extensions; remove meanings already covered by a natural Celan sense or concise construction.
6. Build one small approved batch only for the **conversational repair, literacy, and evidence** meanings that remain genuinely missing.
7. Test that batch in dialogue before addressing recreation, material states, or general magic.
8. Begin a teachability layer—core frequency vocabulary versus specialist vocabulary—without changing canon meanings.

The central conclusion is encouraging: Celan does not need more rules. It needs a few carefully chosen bridges between the strong domains it already possesses.
