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

## ED-0006: Expansion Sense Preservation, Euphony, and National Origin

Status: Approved.

Approval date: 2026-09-11.

Adding a meaning to an existing headword is additive by default. Every previously displayed lexical definition must remain visible in the dictionary and generated exports. Root-analysis descriptions remain intentionally hidden when an ordinary lexical definition already represents the root; they are not automatically promoted into additional dictionary meanings. A root sense is displayed alongside another lexical sense only through a specific approved exception. `Shan` is such an exception: its established passing/transfer verb sense remains visible beside its newer through/across prepositional sense. A previous definition may be replaced or deprecated only through separate explicit approval, with its earlier record kept traceable.

For newly developed or revised expansion entries, the unsmoothed construction is the primary headword and the optional alternative is always the euphonic form. The euphonic form is stored as a searchable variant of the same entry and does not increase the headword count. This rule does not silently rename preserved source witnesses or earlier approved entries that are not under revision.

National origin is optional expansion metadata. Leave national origin and national usage blank when a word is intended to be universal overall. Record both only when the word or its characteristic use is specifically associated with a nation. When that distinction is unclear and materially changes the entry, ask whether the word is universal or nation-specific before integration.

## ED-0007: Domestic and Sensory Life 1

Status: Approved.

Approval date: 2026-09-11.

Domestic and Sensory Life 1 adds forty-five approved universal entries for kitchen implements, household storage and furniture, ordinary materials, bodily pain and discomfort, sensory perception, meal actions, cleaning, bodily needs, illness, and injury. The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-DSL1-0001` through `LX-DSL1-0045`.

`Shem`, `Rask`, `Lem`, `Tir`, `Aiv`, `Tesh`, `Riv`, `Zem`, `Kren`, `Num`, `Nol`, `Tov`, and `Mav` are approved as new primitive roots with the meanings recorded in the expanded root database. Approval authorizes only the roots and derivatives explicitly listed in this batch, not automatic word families.

Primitive-root approval does not automatically create an additional dictionary headword. In a separate explicit decision, `Tesh`, `Riv`, `Num`, `Nol`, `Tov`, and `Mav` are approved as independently lexicalized nouns: an itch, a shiver or tremor, a swallow, the sense of smell, a touch, and illness. Their technical root-analysis descriptions remain suppressed because the approved noun definitions now represent the roots in ordinary language. This preserves the dictionary's intentional root-sense hiding rules and does not create a user-facing `Root` category. `Shan` remains the separately approved exception in which a root description is displayed alongside another lexical sense.

`Lemath` uses the established completed or enduring force of `-ath` for fired clay or ceramic. `Tirkal` lexicalizes bronze specifically as strengthened copper and does not mean every copper alloy. `Pelvokaen` extends bond-breaking into a physical snap without replacing or weakening the established social meaning of `Vokaen`. `Aivkor` names a bodily wound or injured place independently of whether it still hurts; `Aiv` remains the sensation of pain.

`Mekmor` is not approved and does not enter canon. The approved primitive `Kren` supplies generic metal without treating metal as merely forged earth or constructed matter.

The primary forms are unsmoothed. `Krezapral`, `Kavavek`, `Eshapral`, `Drenatalaen`, `Jekathamaen`, `Emilarav`, and `Aivakor` are optional euphonic variants of their corresponding entries and do not count as separate headwords.

All entries in this batch are universal overall, so national origin and national usage remain blank. The batch uses only established dictionary categories: Noun, Verb, and Adjective. Internal root status is derivational metadata rather than a dictionary word category.

## ED-0008: Post-Fracture Mechanics 1

Status: Approved.

Approval date: 2026-09-11.

Post-Fracture Mechanics 1 adds forty approved universal entries for timelines, temporal stability and sickness, fractures, skips, overlaps, recursive loops, temporal rate and displacement, non-agential Echoes, cross-timeline memory conditions, reality anomalies, abnormal gravity, field measurement, safe clearance, marking, avoidance, and anchoring. The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-PFM1-0001` through `LX-PFM1-0040`.

The batch reuses the established and previously approved root inventory and introduces no new primitive roots. Approval applies only to the forty listed entries, not to additional mechanically possible derivatives.

`Vethvelrathor` names an Echo as a residual memory-pattern without thought, intention, or agency. It does not mean a spirit, dream, hallucination, sound echo, or intentional ghost, and it does not alter the grammatical `nor-ka` echo particle. `Shanvelrathor` and `Shanvelzhiraen` are limited to authentic memories crossing from another timeline; ordinary and ritual remembrance remain distinct.

`Kalrav` and its approved derivatives use `Kal` to constrain `Rav` to physical gravitational force. They do not replace the emotional, fated, or destination-oriented senses of the ordinary `Rav` family. `Lianreth` names incoherence in reality or natural law and does not mean deception, ordinary doubt, or generic chaos.

`Retheweknor`, `Vethavelrathor`, `Rethamor`, `Lianrethaxar`, `Jekakalrav`, and `Lianrethashen` are optional euphonic variants of their corresponding unsmoothed primary headwords and do not count separately.

The proper names *The Wound*, *the Veilwrought*, *the Vengeance Stone*, and *the Shard* are outside this batch and receive no automatic Celan dictionary translations. The progressive stages of *The Diminishing* remain reserved for separate lexical review.

For this expansion phase, justified new headwords remain eligible even where a later polysemy review might consolidate or reinterpret part of the system. The user selected the 1,000-app-headword milestone as the point to revisit polysemy deliberately. This scheduling decision does not authorize current sense replacement, silent merging, or weakening of the dictionary's sense-preservation rules.

## ED-0009: Primitive Root Length

Status: Approved.

Approval date: 2026-09-11.

A newly created primitive Celan root may contain one or two syllables, but never more than two. One-syllable roots are not automatically preferable. Select one or two syllables according to semantic distinctiveness, productive usefulness, collision avoidance, and natural Celan sound.

This limit applies to the primitive root itself, not to compounds, derivatives, inflected forms, preserved source witnesses, or established words being analyzed historically. Root length does not authorize a new root: every primitive must still pass semantic-necessity, reuse, sound, and collision review and receive explicit approval.

## ED-0010: Food, Agriculture, and Preservation 1–2

Status: Approved.

Approval date: 2026-09-11.

Food, Agriculture, and Preservation 1 and 2 add sixty-three approved universal headwords. Pass 1 covers cultivation, managed growing places, foraging, hunting, fishing, livestock, milk, gathered plant materials, nectar, honey, seasoning, infusions, and beverages. Pass 2 covers wheat, flour, dough, oil, fat, ingredients, recipes, cooking methods, brewing, distillation, fermentation, smoke, drying, curing, cold preservation, freshness, organic decay, raw and cooked states, and feeding.

`Sov`, `Gav`, `Nesh`, `Zor`, `Nelar`, `Saren`, `Olan`, `Mura`, and `Ruvan` are approved primitive roots with only the meanings and derivatives explicitly listed in these two batches. Their approval does not authorize automatic word families.

`Gav` is approved as an independent Noun meaning “a hunt; the purposeful pursuit of living quarry.” Its related approved lexical entries remain `Gavaen` “to hunt” and `Gavral` “hunter.” The ordinary noun now represents the root in the dictionary, while the separate technical root-analysis description remains intentionally suppressed. `Shan` remains the only approved exception in which a root description is displayed as an additional lexical sense.

The shortened everyday cooking and preservation forms `Xarkrezaen`, `Eshkrezaen`, `Pelkrezaen`, `Olankrezaen`, `Eshdrenaen`, `Drenpralaen`, `Muraen`, `Vindrenaen`, and `Livaraen` are canonical. Their longer discarded candidate constructions are not aliases or euphonic variants. This records the approved preference for speakable lexicalization when a repeated domain root would make an ordinary word unnecessarily long; it does not impose a new absolute syllable limit on compounds.

All sixty-three entries are universal overall, so national origin and national usage remain blank. Primary headwords use their unsmoothed constructions, while explicitly listed smoother forms are optional searchable variants and do not count as separate headwords.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-FAP1-0001` through `LX-FAP1-0031` and `LX-FAP2-0001` through `LX-FAP2-0032`.

## ED-0011: Conversational Spice Distinctions

Status: Approved.

Approval date: 2026-09-12.

The established spice glosses are clarified for ordinary conversation without altering their headwords or erasing their source wording. `Belar` is a blending spice classified by its function of uniting, balancing, or mellowing flavors. `Belmor` is a root spice classified by its botanical source in a plant root or rhizome. `Jekvor` is a spiraling spice classified by its curled, coiled, or twisted physical form. `Jelvor` is a zesty spice classified by its bright, sharp, lively flavor. `Xilvar` as hidden spice is classified by the deliberate concealment of its composition or preparation.

These categories describe different salient properties and therefore need not be mutually exclusive in the physical world; the selected noun tells the listener which property matters in the conversation. `Jelkor` remains the universal umbrella term for a spice or seasoning. `Xilvar` also retains its separately established “Fragmented Salt” sense unchanged. The original Volume 2 glosses remain preserved in the source-facing lexicon, while the app-facing dictionary displays these approved clarifications.

## ED-0012: Clothing, Wearable Protection, and Ordinary Materials 1–2

Status: Approved.

Approval date: 2026-09-12.

Clothing, Wearable Protection, and Ordinary Materials 1 and 2 add forty-four approved universal headwords. Pass 1 covers general garments and wearing, climate-specific footwear and outerwear, head and face coverings, straps, harnesses, mechanical fasteners, gloves, goggles, visors, uniforms, fibers, fur, wool, linen, silk, canvas, oilskin, waterproofing, insulation, and energetic conductivity. Pass 2 covers common architectural stone classes, sand, sandstone, iron, bone, crystal, coral, shell, wax, resin, color, pigment or dye material, dyeing, and alloy.

`Rema`, `Sura`, `Sadar`, `Eran`, `Osar`, and `Hir` are approved primitive roots with only the meanings and derivatives explicitly listed in these batches. `Dresh` is approved as the latent crystal-material root supported by the established `Dreshal` crystal-device usage; this promotion does not alter `Dreshal` or authorize an automatic family. No other unlisted derivatives are authorized.

`Morl` remains the general stone or mountain term and `Mormek` remains worked masonry stone. `Kalmorl`, `Krezmorl`, `Brosmorl`, and `Sadarmorl` lexicalize granite, basalt, slate, and sandstone through narrow whole-word meanings; they do not make the contributing roots scientifically diagnostic. `Kren` remains metal generally, `Tir` copper, and `Tirkal` bronze. `Belkren` supplies alloy as the general class of deliberately combined metals, with bronze as one possible subtype.

`Zorxar` names an animal-made shell and its material, while `Xarnesh` remains a shellfish. `Neshmorl` names coral across the living colony and the hard mineral structure or material it produces. `Kavolan` wax remains distinct from `Olan` oil and `Morolan` fat. `Verdbel` resin remains distinct from general sap, oil, and manufactured adhesive. `Hir`, `Hirmor`, and `Hiraen` distinguish color, colorant material, and the act of imparting color without replacing established individual color adjectives.

Tallow is deliberately deferred rather than rejected. `Morolan` continues to cover ordinary fat; a separate tallow headword should be reconsidered with candles, wicks, soap, grease, rendering, and household fuel. No tallow headword is approved by this decision.

All forty-four entries are universal overall, so national origin and national usage remain blank. The primary forms are unsmoothed constructions. `Velpralatrakor`, `Pelvelatrakor`, `Lorinshalaxar`, `Remashalaxar`, `Verdeselzhir`, `Kalamorl`, `Krezamorl`, `Brosamorl`, `Neshamorl`, `Verdabel`, and `Belakren` are optional euphonic variants of their corresponding entries and do not count as separate headwords.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-CWM1-0001` through `LX-CWM1-0028` and `LX-CWM2-0001` through `LX-CWM2-0016`.

## ED-0013: Tools and Machines 1

Status: Approved.

Approval date: 2026-09-12.

Tools and Machines 1 adds forty approved universal headwords for general tools and machines, repair, crushing and cutting implements, liquid vessels, seals, writing and navigation instruments, measurement and sensing, energy production and storage, pipes, wire, filtration, pumps, valves, and foundational mechanical parts.

The batch introduces no new primitive roots. It deliberately reuses the active source-established and previously approved root inventory. `Karmek` means one general working tool and remains distinct from `Karvek` a portable toolkit. `Kalmek` is a machine as a connected force- or energy-transforming system, while `Kormek` is specifically an engine or motor serving as a machine's functional power-to-motion core. `Felmek` is a constructed component and does not replace `Pralfel` as an ingredient in a prepared mixture.

`Zhaelpralaen` names repair of objects and systems and does not replace bodily healing. `Kesmek` is a detecting device, while `Kes` remains a person's act of noticing. `Zhelkor`, `Zhelkav`, and established `Zhelbel` distinguish energy generation, storage, and distribution. `Selshan` and `Selshanaen` are limited to selective physical-material passage and do not automatically extend to software, social, legal, or cognitive filtering.

`Shanmek` covers enclosed pipes and protective conduits. `Krenzhir` covers metallic wire and conductive cable while leaving `Zhirin` rope or cord, `Zhirbel` strap, and `Belzhir` communications network unchanged. `Jekkal` is a mechanical stored-force spring and does not replace `Awek` natural water spring or `Zhaelor` the blooming season.

All forty entries are universal overall, so national origin and national usage remain blank. The primary forms are unsmoothed. `Drenakavvek`, `Krezadrenvek`, `Belapralmek`, `Jekazhirvek`, `Krenazhir`, `Korewek`, `Korowek`, `Jekemek`, `Ravekar`, and `Wekarav` are optional searchable euphonic variants of their corresponding entries and do not count as separate headwords.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-TM1-0001` through `LX-TM1-0040`.

## ED-0014: Transportation and Vehicle Operations 1

Status: Approved.

Approval date: 2026-09-12.

Transportation and Vehicle Operations 1 adds thirty-five approved universal headwords for general vehicles, common land, rail, air, underwater, cable-supported, and flat watercraft classes, riding and vehicle control, boarding and disembarking, repeated travel, parking, speed control, towing, routes, cargo, passengers, operators, pilots, and traffic.

The batch introduces no new primitive roots. `Varvek` is the general constructed transport carrier and remains distinct from `Sharavok`, a traveling company or caravan. `Mahrvek` remains the established general boat or ship. `Felvek`, `Morvek`, `Pralvek`, `Kormekvek`, `Delkormek`, `Delwek`, `Zhirvek`, `Belzhirvek`, `Shalilvek`, `Eshvek`, `Mahrxarvek`, `Krenzhirvek`, and `Mahrpral` are narrow whole-word vehicle meanings; their contributing roots do not become automatic vehicle classifiers beyond these approved entries.

`Zhirvek` is one railcar, `Belzhirvek` is an operating train, and `Zhirshara` is the fixed railway or rail route. The separately discussed derivative `Zhirsharaen` is explicitly not approved and is not added; ordinary travel by rail remains expressible through established motion syntax with `Zhirshara` or `Belzhirvek`.

`Vekvaraen` means traveling while carried rather than operating the conveyance. `Kormekaen` concerns powered operation, while `Lorvekaen` concerns directional control. `Anvekaen` and `Thalvekaen` form the board/disembark pair. `Dorvekaen` covers deliberate parking or berthing without naming the stopping location. `Jorvar`, `Jorvaraen`, `Velvaraen`, and `Belvekaen` distinguish speed, acceleration, deceleration, and controlled braking. `Ravvekaen` uses the approved physical-pull sense of `Rav` for towing.

`Vekmor`, `Vekin`, `Lorvekral`, and `Eshlorral` distinguish cargo, passenger or rider, general transport operator, and pilot. `Welvek` names interacting collective traffic rather than parked vehicles, and `Felshara` names one designated lane rather than an entire road or railway.

All thirty-five entries are universal overall, so national origin and national usage remain blank. The primary forms are unsmoothed constructions. `Varavek`, `Kormekavek`, `Delewek`, `Delowek`, `Krenazhirvek`, `Lorvekaral`, and `Eshloraral` are optional searchable euphonic variants of their corresponding entries and do not count as separate headwords.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-TVO1-0001` through `LX-TVO1-0035`.

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
