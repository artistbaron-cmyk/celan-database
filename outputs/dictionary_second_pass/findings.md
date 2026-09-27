# Celan Dictionary App — second-pass findings

**Status, September 27:** The sections below preserve the read-only audit as it stood on September 26. The user subsequently authorized justified corrections. The implementation record and remaining limits are at the end of this file; [the after inventory](app_inventory_after.json) and [before/after journal](applied_changes.json) show the present app state. Earlier user notes and decisions remain preserved.

September 26, 2026. Read-only audit. No canon data, app code, generated export, or previous decision was changed. The [app inventory](app_inventory.json) records every current headword, sense, pronunciation, derivation shown by the app, variant, family link, and example placement. The [affected-item index](affected_items.csv) makes every item in a grouped finding accessible by ID and current wording. Previous user notes and decisions remain in `outputs/dictionary_review/`, `outputs/example_sentence_audit/`, `outputs/root_family_audit/`, and `knowledgebase/11_editorial_canon_policy.md`.

## Authority and scope

I read ED-0001–ED-0044, the 99 resolved dictionary flags, the 135 September 24 example instructions and their five follow-up corrections, and the root/family decisions before making judgments. The current app and those later approvals control. Source PDFs and earlier CSV wording are historical witnesses. I did not infer a new origin from spelling resemblance or treat a plausible new derivative as an approved word.

The app currently assembles **1,496 headwords and 1,607 displayed senses** from 1,732 underlying app records. Its eight embedded CSV datasets match the current source CSV bytes. The 1,607 sense/type/meaning keys match both generated CSV exports; their shared descriptive fields also match. All 1,496 app headwords have a pronunciation. No stored variant collides with a different current headword, and every displayed related-word target resolves. The 945 expansion rows all have a derivation, pronunciation, and linked example IDs. These are structural checks, not independent linguistic certification.

Five expansion headwords have two approved sense rows each—Anvekaen, Thalvekaen, Keldoraen, Njor, and Ruvan. The app groups each pair as one headword with multiple meanings. I found no separate accidental headword from these pairs.

The example table has **2,199 source records**, all with Celan and English text. The app currently has 8,576 direct placements, 161 related-construction placements, and 68 teaching placements across headwords; one example can appear under several headwords. I inspected the complete records and placements mechanically, then read the identified semantic and grammar candidates against current meanings. I have **not** independently translated all 2,199 sentences word by word, checked every original PDF page, or visually tested a hosted deployment. Unflagged text should not be called verified on the strength of these checks.

## Confirmed inconsistencies

### SP-01 — Live grammar cards still teach superseded examples

**Current wording.** `RG-VSO` teaches `Var I dren.` for “I go to the water.” `GR-V1-0014` repeats `Var I dren.`, `Tha-var I dren.`, `Nor-var I dren.`, `Varal I dren.`, `Varath I dren.`, and `Varas I dren.` The app's Sentence Shape overview and ED-0044 instead use `var I an dren.`; the capitalization card explicitly says *not* `Var I an dren.` `RG-QUESTIONS-COMMANDS` displays `Ra var Ser?`, while the approved question is `ra var ser?`. `GR-V3-0004` teaches bare `I dren` and `La dren` as possessives despite ED-0038. `GR-V1-0015`, `GR-V1-0017`, `GR-V3-0001`, and the Gender/Address overview contain related older water and conditional examples. [All eight affected cards](affected_items.csv) are indexed under SP-01.

**Why it matters.** A learner following the detailed VSO or tense card will write a different form from the approved introductory example; the comparative card teaches a possession pattern the later rule replaced.

**Recommendation.** Update the app-facing card examples to the approved spatial `an`, lowercase opening, and possession forms. Preserve the earlier source grammar rows as witnesses. Check the complete tense/conditional examples one by one rather than applying blind substitutions.

**Decision needed.** Approve app-facing grammar example alignment with ED-0038 and ED-0044 while leaving source-witness wording intact.

### SP-02 — A community pillar becomes a leader, and standing appears without a verb

**Current wording.** `PE-V2-0033`: `Mbalan ser dren an Varthas.` → “The community leader stands by the water in the city.” The app defines **Mbalan** as “Pillar of the community, a relied-upon figure.” `Ser` means with/and/friend; `an` marks place. The sentence has no standing verb.

**Why it matters.** A respected community member need not be the leader. The translation also teaches that a bare noun can encode “stands.”

**Recommendation.** Use a reviewed full sentence such as `moraen mbalan an dren an Varthas.` → “A pillar of the community stands at the water in the city.” `Moraen` is already the app's verb for standing. Keep the old source wording in the audit trail.

**Decision needed.** Approve this sentence/translation correction, or specify an intended leader sense of Mbalan and a different way to express standing.

### SP-03 — Five older national sample phrases add content absent from Celan

**Current wording and problem.** The [five exact pairs](affected_items.csv) are indexed under SP-03:

| ID | Current English claim not supported by the current Celan wording |
| --- | --- |
| `PE-V3-0118` | “with **you**”; the Celan ends in `ser` and has no `Ya`. It also starts with the noun `Varadan` rather than a future trade verb. |
| `PE-V3-0128` | “**I** will go … **soon**”; the Celan has no `I`, and bare temporal `nor` does not establish “soon.” |
| `PE-V3-0131` | “come **to you**”; the Celan has no `Ya` and uses `ser shenakar` (“with coinage”), not an addressee. |
| `PE-V3-0141` | “**stands** at the ancient fortress-home”; the Celan begins `Theren var tera Kaleth Rathor`, with no standing verb. |
| `PE-V3-0145` | “not **ready**”; the Celan has no recorded readiness word or construction, and no normal `ra` question opening. |

**Why it matters.** These are ordinary examples in the app, so a speaker may reuse them to express a participant, time limit, or action that the words do not actually supply. These are not objections to natural English articles or harmless paraphrase.

**Recommendation.** Move these five to clearly marked historical/teaching material while full replacements are reviewed. Recompose with existing vocabulary before considering any new headword; for example, `nor-var I an Eshvan.` can say “I will go to the shop” without silently adding “soon.”

**Decision needed.** Approve temporary historical placement and a reviewed replacement for each of the five, or provide an attested grammar/idiomatic reading that licenses the current translation.

### SP-05 — Three expression links confuse grammatical `-ka` with standalone `Ka`

**Current wording.** `EX-LC1C-0002` (`Ilin-ka.`) links to `Ilin; Ka`; `EX-LC1C-0004` (`Inko-ka.`) links to `Inko; Ka`; `EX-LC1C-0006` (`Nor-ka.`) links to `Nor; Ka`. Clicking `Ka` opens “without/no,” not possessive `-ka`, and clicking `Nor` opens time, not the `nor-ka` echo particle. `EX-LC1C-0006` also cites nonexistent source ID `RM-V1-0015`; the current echo-particle record is `RM-V4-0003`, while the possessive `-ka` record is `RM-V1-0014`.

**Why it matters.** The linked explanation reverses the very distinction established by ED-0038 and ED-0041. The broken source ID cannot be traced.

**Recommendation.** Link the two possessive expressions to `-ka`, link the echo expression to `nor-ka`, and replace its nonexistent source ID with `RM-V4-0003` if that record is the intended provenance.

**Decision needed.** Confirm the intended provenance for `EX-LC1C-0006`; the three dictionary-link targets can then be corrected without changing any meanings.

### SP-06 — Export columns can misstate what a row means

**Current wording.** In `data/dictionary_entries.csv`, `root_word` is a Yes/blank marker (`Shan` has `Yes`), while `data/dictionary_report.csv` uses the same column name for a list of family components (`Belshara` has `BEL; SHARA`). Also, the 166 headwords with no direct usage example have a **blank** `example_count` in `dictionary_entries.csv`, because the exporter writes numeric zero as an empty value.

**Why it matters.** A reader or importer cannot safely interpret `root_word` across exports, and a blank example count looks like missing data rather than zero.

**Recommendation.** Give the report's family-component column its own name, such as `family_roots`, and serialize zero example counts as `0`. Keep the app's established root marker and family identities distinct.

**Decision needed.** Approve this export-schema correction; no lexical decision is needed.

## Questions requiring a language or presentation decision

### SP-04 — Direct examples still vary in how they express possession

**Current wording.** Sixteen live direct examples are indexed under SP-04. Clear older forms include `PE-V1-0004` `Ya tera` → “Your home,” `PE-V3-0025` `I dren ... La dren` → “My water ... their water,” and `PE-V3-0027` `I dren ...` → “My water ...”. ED-0038 requires possessive `-ka` on the possessor or postnominal personal suffixes. Later body-part examples such as `PE-BIAOBF1-0006` `va drenselaen Ya vesh.` → “Wash your back” and `PE-BIAOBF1-0027` `drenselaen I xarmetha.` → “I wash my skin” infer ownership from context without `-ya` or `-ian`.

**Why it matters.** Readers may learn a bare-pronoun possessive pattern from old examples or think a body-part suffix is optional when the current rule presents it as the normal construction. ED-0042 permits a *specific contextual gloss* for `Thar-ka`; it does not establish an unrestricted possessive exception.

**Recommendation.** Correct the clearly bare older possessives to an approved construction. For body-part and inner-state examples, decide whether contextual ownership is a permitted omission; if it is, add that narrow explanation to the grammar. Otherwise revise those sentences with the personal suffixes. Preserve natural English paraphrases when the Celan construction is clear.

**Decisions needed.** (1) May ordinary body-part ownership be inferred from the subject without a suffix? (2) Should the older `Ya tera`, `I dren`, and similar direct examples be rewritten to ED-0038 forms?

### SP-11 — Older direct examples use temporal `nor` for space or association

**Current wording.** The app defines prepositional `Nor` as “At / In (time),” and its Space and Time guide calls `nor` strictly temporal. Yet 30 current direct examples appear to use it for a place, person, or physical relation. For instance, `PE-V3-0108` has `Tha-var ser nor dren.` → “The friend went to the water,” where `nor dren` is translated as a destination. `PE-V3-0035` has `Velkavor lian nor Terra.` → “The ancestor speaks to the Earth,” where `nor Terra` marks an addressee. `PE-V1-0010` has `Azon nor velkrel` → “A feminine man near the breeze.” [All 30 exact pairs](affected_items.csv) are indexed under SP-11. Some also have other syntax issues; this group records the shared `nor` issue only.

**Why it matters.** A speaker following these examples could use the time marker to say “to,” “near,” “by,” or “with,” contradicting the app's explicit space/time distinction. Changing all `nor` tokens to one substitute would be unsafe: destination, location, accompaniment, and address require different constructions.

**Recommendation.** Keep the established temporal rule and review these 30 sentences individually. Use approved `an`, `var`, `ser`, or a restructured sentence where the intended relationship is clear; put any unresolved source line in the historical/teaching section while preserving it as a witness.

**Decision needed.** Confirm that `nor` remains temporal only, with no approved spatial or addressee use. Then approve individual sentence repairs or historical placement; do not treat this as a new `Nor` meaning by default.

### SP-08 — Sense-specific example review remains pending

**Current wording.** The app has 89 headwords with multiple displayed senses. The UI labels most direct examples on these entries “Sense assignment pending review,” as approved in ED-0043. Both exports currently repeat the same examples for every sense row: the Lianeth adjective row starts with `Aen I lianeth.` → “I can speak,” and the Zhelvek “Energy carrier” row starts with an example translated as an “energy bar.” There are 105 non-first sense rows with a populated first-example field. [Every multi-sense headword](affected_items.csv) is indexed under SP-08.

**Why it matters.** The entry-level UI admits the assignment is pending, but a per-sense CSV row can appear to claim that its example proves that specific meaning. This is especially confusing for legitimate polysemy, which should remain intact.

**Recommendation.** Review example-to-sense assignments with linguistic judgment, retain pending labels where evidence is insufficient, and make exports explicit about entry-level versus sense-level examples. Do not infer a sense from a spelling match alone.

**Decision needed.** Approve a separate sense-placement review and choose whether the exports should leave unassigned sense example fields empty or add an explicit assignment-status column.

### SP-09 — Known Kavel/weather historical line is still awaiting replacement

**Current wording.** `PE-EGE1-0019`: `jor eshnor; kavel rinaen eshweknor.` → “Weather changes, while climate endures.” The record is already labeled **Historical example pending correction** and excluded from ordinary usage under ED-0043. `Kavel` means forgetfulness or memory gap, not “while.”

**Why it matters.** The current app treatment is appropriately cautious, but the intended environmental contrast remains unsupplied as a usable Celan sentence.

**Recommendation.** Preserve the historical note and compose a reviewed weather/climate sentence using existing vocabulary when this topic is next edited.

**Decision needed.** Supply or approve a replacement sentence if this contrast is important for ordinary use. No redefinition of Kavel is proposed.

## Optional improvements

### SP-07 — Direct-example coverage remains uneven

**Current state.** 166 headwords have no direct usage example: 69 lexical expansion headwords, 76 morphology/root headings, and 21 creature names. Of these, 141 have no app example in any of the three sections. [Every headword and its current meaning](affected_items.csv) is indexed under SP-07. A root heading or creature name may reasonably lack a normal sentence; this is not itself a linguistic error.

**Why it matters.** Some ordinary lexical entries still lack a model for use. The earlier 12 draft examples remain drafts and are not canon.

**Recommendation.** Prioritize the 69 lexical headwords for a reviewed example batch. Treat root headings and creature names according to their actual teaching need rather than a blanket count requirement.

**Decision needed.** Choose whether to commission the lexical coverage batch now; each authored sentence still needs review before entering canon.

### SP-10 — One older example test expects a removed placement

**Current state.** `node dictionary/example-review.test.cjs` fails because it expects a capitalization counterexample under Var's teaching examples. ED-0044 moved number, euphony, phonology, and capitalization references into the grammar browser. The newer `example-round2.test.cjs` passes and checks that relocation.

**Why it matters.** The failing test can falsely suggest an app regression and obscure future failures.

**Recommendation.** Update that one assertion to check the approved grammar-browser placement; retain its other coverage checks. No language decision is needed.

## Communication stress test

I tried ordinary messages with existing words and constructions before considering vocabulary additions. These are composition probes, not approved dictionary examples:

| Situation | Celan probe | Intended message / result |
| --- | --- | --- |
| Logistics email | `nor-var I an evan nor noral. ra var Ya an evan nu?` | I will go to the market at night. When do you go? Existing future, place, time, and question forms suffice. |
| Request and reply | `ra mbaen Ya I? mbaen I Ya.` | Will you help me? I help you. Existing help verb and question opener suffice. |
| Hazard instruction | `va kasharaen lianrethor. va keldoraen lianrethxar.` | Avoid the anomaly zone. Mark its boundary. Existing verbs and post-Fracture nouns suffice. |
| Personal story | `tha-var I an tera. nethaen I nor noral.` | I went home. I rested at night. Existing tense, place, and night vocabulary suffice. |
| Market scene | `thalvanesh varadan phelvin an welpralor.` | The merchant sells a warm drink in the plaza. This is an existing approved example, not a new construction. |
| Ohnoshan emergency | `shentalzhael zhaelral savin nor rekrathlor.` | The healer triages patients during the emergency. This is an existing approved example. |

These probes found no compelling new headword. They also show why precision in pronouns, possession, and example translations matters more here than adding English-equivalent words. A longer exchange with deadlines, quantities, and shifting speakers would be a useful later stress test.

## Intentional layer differences

- `data/lexicon.csv` and `data/grammar_rules.csv` preserve older source wording. The app combines those records with approved expansion rows and explicit display overrides. Some technical root descriptions are intentionally hidden when an ordinary lexical sense represents the root, while approved exceptions such as Shan keep an additional displayed sense. That is why 1,732 assembled records yield 1,607 displayed senses; it is not evidence of missing words by itself.
- The older grammar source still describes mandatory euphony and optional spaced possession. The app-facing grammar implements optional euphony (ED-0003) and attached possessive `-ka` (ED-0038). The historical source conflict is intentional; SP-01 identifies the narrower problem of old example text still visible on live cards.
- Source example rows are preserved even when approved duplicates point to a canonical app example or reviewed teaching material moves to the grammar browser. The app's direct, related, and teaching counts are placements, so they should not equal the 2,199 source-row count.
- `data/dictionary_entries.csv` intentionally has up to five entry-level examples per sense row; `data/dictionary_report.csv` carries one. The shared sense fields agree. SP-06 and SP-08 describe the remaining schema and sense-presentation problems, rather than treating these export formats as identical.

## Checks performed and limits

- Read current editorial decisions, resolved review notes, current CSVs, app builders, working grammar, and prior audit outcomes. Compared historical source rules only as evidence; optional euphony, specialized Varan, approved word-specific derivations, and legitimate multiple meanings remain settled.
- Enumerated all 1,496 current app entries, their 1,607 senses, pronunciations, shown derivations, variants, family/related links, and direct/related/teaching placements. Checked all 2,199 example records for populated text, identifiers, canonical links, and placement metadata. Identified one nonexistent reference in `expressions.csv` and no missing family target or variant collision.
- Compared the eight embedded datasets byte for byte with current CSVs; compared the app's sense keys and shared export fields with both generated CSVs. Ran search, navigation, family, round-two example, review-integration, root-family, and sentence-audit checks successfully. The older example-review test fails only at the stale placement assertion described in SP-10; its later assertions did not run.
- Read current grammar cards against the working grammar and approved examples for sentence shape, tense, questions, capitalization, possession, euphony, plurality, and root/family identity. Checked translation candidates for added people, roles, actions, spatial/temporal markers, possession, and number wording, then manually examined the findings listed here.
- No all-page PDF collation, exhaustive independent semantic translation of every unflagged example, human phonetic re-evaluation of accepted pronunciations, hosted deployment check, or Phrase Builder output corpus test was performed. A local `file:` browser visit was rejected by the browser's URL policy, so visual UI behavior was not checked; app-building functions and navigation tests were exercised locally instead. This document therefore reports specific findings and structural coverage, not blanket certification.

## After decisions

Apply only approved corrections, preserving the before/after record and source witnesses. Rebuild `dictionary/embedded_data.js`, `data/dictionary_entries.csv`, and `data/dictionary_report.csv`; then rerun the checks above and verify the changed examples in the app. Keep unresolved items in this single list until a later decision closes them.

## September 27 implementation and remaining items

The user's follow-up authorized me to choose supported corrections. The original findings above remain the baseline record; this section states their disposition. ED-0045 in the editorial policy records the decisions. Every changed source row is in `applied_changes.json`, `coverage_changes.json`, `working_grammar_changes.json`, or `complex_clause_changes.json`.

In the table, a **usage example** is a sentence or phrase meant to show someone how to use a word. A **historical example** stays available for reference but is clearly marked as unsuitable to copy as a model.

| Finding | Disposition |
| --- | --- |
| SP-01 | **Corrected with an intentional exception.** The app now teaches both attested `var I dren.` and `var I an dren.`. This does not generalize bare goals to every motion verb. App-facing grammar examples and 12 working lessons were aligned with lowercase openings, possession, and accurate translations; older source grammar rows remain historical witnesses. Three unsupported app-facing source grammar cards were suppressed because their clause or poetic examples could not be safely repaired. |
| SP-02 | **Corrected.** `PE-V2-0033` now uses `moraen` for standing and “pillar of the community” for Mbalan. |
| SP-03 | **Resolved for ordinary app usage.** The five unsupported national lines are labeled historical and removed from direct usage. `PE-SP2-0001`–`0005` provide narrower, ordinary replacement messages without adding “soon,” “ready,” or an unexpressed participant. Their original meanings remain accessible in the journal. |
| SP-04 | **Resolved for the 16 identified examples.** Fourteen were rewritten with explicit possession, including personal body-part suffixes; two lines with additional problems are historical. ED-0038 remains the rule; no broad ownership-omission exception was added. |
| SP-05 | **Corrected.** The three expressions now target `-ka` or `nor-ka` as appropriate; `EX-LC1C-0006` cites `RM-V4-0003`. |
| SP-06 | **Corrected.** The report uses `family_roots`; detailed export zero counts are `0`. |
| SP-07 | **All 57 remaining entries now have examples.** Fifty-five show the word or phrase directly. **Eshen** and **Eth** are shown attached to other words, which is how those forms are used. Eth has two examples to show both its quality and ritual meanings. Together with the earlier 12 examples, this covers all 69 entries in the original group. Read every new Celan and English pair in the [example list](remaining_57_examples.md). Separate root headings and creature names were outside this 69-entry group. |
| SP-08 | **Presentation corrected; linguistic assignment remains open.** Exports now say `Headword; sense assignment pending` for multi-sense entries, put example text only on the first row, and leave later sense rows empty. The app retains its honest pending labels. No meaning or pronunciation was changed. Reviewing individual example-to-sense assignments remains a linguistic task, not a technical failure. |
| SP-09 | **Corrected for ordinary use.** The Kavel line remains a labeled historical witness. `PE-SP2-0006` says `drenvaraen eshnor. rinaen eshweknor belwek.` → “Weather changes. Climate is a recurring pattern.” It expresses a supportable contrast with existing words rather than asserting that Kavel means “while.” |
| SP-10 | **Corrected.** The stale test checks the approved capitalization placement in the grammar browser and passes. |
| SP-11 | **Resolved for ordinary app usage, with historical remainder.** Eight of the 30 identified lines received contextual rewrites; 22 are labeled historical because a simple preposition swap would leave an unsupported action or relation. All 30 retain an accessible before/after disposition in the journal. Temporal `nor` is unchanged. |
| SP-12 | **New finding during final grammar collation; resolved for ordinary app usage.** `PE-V3-0022`–`0024` and `PE-V3-0028`–`0029` teach inverted VSO clauses, an unestablished relative-clause pattern, or a counterfactual/coinage claim absent from the words. For example, `Rath Ya var dren, Nor-var I shena.` says “If you go to the water, I will bring coinage” without a “bring” verb. `PE-V3-0022` was rewritten as `varin I aen var Ya dren.` → “I know that you go to the water.” The other four are historical witnesses pending an attested construction. The [affected-item index](affected_items.csv) has all five originals, and `complex_clause_changes.json` has each disposition. |

### Remaining decisions and limitations

- **No further linguistic approval is required for the corrections above.** If any of the 32 newly historical lines must again be ordinary usage, each needs an attested reading or a fully reauthored Celan/English pair. The current app explicitly keeps them out of direct usage.
- **Sense assignment:** 89 multi-sense headwords still need sentence-by-sentence linguistic assignment where evidence warrants it. The export fix prevents a false sense-level claim while preserving legitimate multiple meanings.
- **Other entries without examples:** Some root headings, grammar pieces, and creature names still lack a standalone sentence. Eshen and Eth have examples showing how they attach to other words. A missing standalone sentence does not make any of these Dictionary entries incorrect.
- **Linguistic reach:** I did not independently translate every unflagged source line, re-evaluate accepted pronunciations, collate every PDF page, or visually exercise the hosted app. The after inventory is exhaustive for structural fields and placement, not a blanket semantic certification.
- **PDF export:** The existing searchable PDF is stale: its recorded source SHA-256 is `a9dc79ea…`, while the rebuilt detailed CSV is `40ca0458…`. Its builder was updated to label examples at the headword level. The project Python lacks `reportlab`; rebuilding the PDF with the bundled runtime at `/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3` awaits the path-specific permission requested under AGENTS.md. The CSV exports are current.

### Final checks

The app rebuilt from 2,275 example records and still has 1,496 headwords and 1,607 displayed senses. The after inventory records 8,707 direct placements, 221 related placements, and 222 teaching placements; 114 headwords have no standalone direct example after the historical reclassifications and coverage additions. Both exports have 1,607 rows, zero counts are numeric text, and later sense rows contain no entry-level example text. Related-form examples for Eshen and Eth have their own clearly named export fields. Search, navigation, families, example-review, round-two preservation, integration, root-family, expansion, and [second-pass verification](verify_after.py) checks passed. The browser's local-file URL policy blocked visual UI inspection, so that check remains unperformed.
