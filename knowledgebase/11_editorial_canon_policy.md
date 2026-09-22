# Editorial Canon Policy

This policy defines how Ohnosha 2.0 treats source inconsistencies, AI artifacts, and human-approved corrections moving forward.

The source PDFs and supplemental files remain preserved as source witnesses. The Dictionary App is the official source of truth for Celan; the knowledgebase and other supporting materials must be reconciled to it.

## Dictionary App Authority — 2026-09-21

User-established policy: the Dictionary App is the official, correct version of Celan. Its established meanings, word types, pronunciations, and usage are the canonical baseline. Existing pronunciations are treated as verified, including those produced by the app's pronunciation algorithm; no estimate labels are displayed.

Authority does not prevent correction. Suspected internal inconsistencies, including nouns labeled as verbs, should be flagged with the exact app wording, evidence, a proposed correction, and any uncertainty. Present these for user review before changing established linguistic content. Older source rules or unresolved source flags do not automatically override the app. Preserve legitimate polysemy and distinguish a noun sense from a related verb sense.

Technical consistency fixes may align search, exports, and supporting files with established app content without redefining that content. This authority policy supersedes earlier wording below wherever the knowledgebase or an older source would otherwise be treated as superior to the Dictionary App.

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

## ED-0015: Built Spaces and Public Infrastructure 1

Status: Approved.

Approval date: 2026-09-12.

Built Spaces and Public Infrastructure 1 adds forty approved universal headwords for structural anatomy, rooms and civic places, passage and transport infrastructure, water infrastructure, and ordinary constructed features. The batch distinguishes buildings, walls, roofs, floors, ceilings, windows, screens, foundations, pillars, storeys, rooms, halls, courtyards, plazas, balconies, libraries, laboratories, observatories, data centers, control rooms, workshops, bridges, roads, stairs, tunnels, transit tubes, stations, platforms, elevators, docks, harbors, garages, parking areas, canals, aqueducts, towers, domes, fountains, furniture, and fixed vertical levels.

`Ndara`, `Njor`, and `Ndavi` are approved primitive roots with only the meanings and derivatives explicitly listed in this batch. `Nd-`, `Nj-`, and the inherited `Mb-` are articulated consonant clusters: every written consonant contributes audibly and must not be treated as decorative or silent. Approval of these roots does not authorize automatic word families.

`Mbalanmor` is the literal architectural pillar or column. It remains a separate headword and does not add a physical pillar sense to established `Mbalan`, whose ordinary meaning remains a person relied upon as a pillar of the community. `Drokav` remains the cistern or protected water reserve; no duplicate reservoir word is added. `Awekshara` remains a spring-fed canal beneath the generic `Droshara`. `Liankavor` remains an archive and is not absorbed by `Velkelor` library. `Thalorimor` remains a specialized lightning-management structure beneath the generic `Eshmekor` tower.

`Varbelor` covers both station and terminal at the ordinary level. `Vekxaror` and `Vekpralor` distinguish an enclosed vehicle shelter from a designated parking area. `Nethmek` is the collective category furniture while established `Nethor`, `Nethlor`, and `Pralor` remain specific furnishings.

All forty entries are universal overall, so national origin and national usage remain blank. The primary forms are unsmoothed. `Eshaxar`, `Morlapral`, `Aneshaxar`, `Woraxaror`, `Welapralor`, `Mekeshapral`, `Shenapralor`, `Belazhirakavor`, `Mekapralor`, `Brosashara`, `Morlashan`, `Eshapralor`, `Mahrapralor`, `Mahraxaror`, `Vekaxaror`, `Vekapralor`, `Wekaxar`, and `Nethamek` are optional searchable euphonic variants of their corresponding entries and do not count as separate headwords.

The approval applies the no-silent-letter requirement to this approved batch without silently reanalyzing or respelling inherited `th` words elsewhere in the language. A language-wide phonetic review of inherited `th` remains a separate possible editorial task.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-BSPI1-0001` through `LX-BSPI1-0040`.

## ED-0016: Lun Lake–Moon Polysemy

Status: Approved.

Approval date: 2026-09-12.

`Lun` is officially polysemous as a Noun meaning both “lake” and “Moon; Ohnosha's natural satellite or lunar body.” The established `Lake` definition is preserved unchanged. `Moon` is added as a second displayed lexical sense rather than left as an inferred root association.

The Moon sense is directly supported by the Volume 4 derivation of `Lunwek` as `Lun (Lake/Moon) + Wek (Cycle)`, describing a full lunar cycle. This is source-attested lexical evidence, not the automatic exposure of a normally suppressed technical root description and not a newly invented primitive.

`Lunor` retains its lake and blue-color association. `Lunwek` remains “month” through the lunar-cycle sense. Context distinguishes standalone `Lun` as lake or Moon. This additive decision creates no new headword and removes no existing meaning.

The approved added sense is maintained in `data/lexicon_expansions.csv` under ID `LX-LPC1-0001`.

## ED-0017: Government and Civic Institutions 1

Status: Approved.

Approval date: 2026-09-12.

Government and Civic Institutions 1 adds twenty-eight approved universal headwords for institutions, government, governing, councils, representatives, rulers, clan leaders, public officials, elections, voting, policy, decrees, permits, allocation, distribution, disputes, arbitration, citizenship, districts, borders, contracts, vetoes, and the public/private distinction.

The batch introduces no new primitive roots and creates no new dictionary category. `Belor` names an organized institution generally, while `Lorbel` names government specifically and `Belthal` remains the broader condition of social or systemic order. `Lorbelaen` means to govern over time and does not replace `Varok` as an individual act of command or direction.

`Khumkel` is the approved civic council headword. Established `Khumlor` remains “chosen family, circle of belonging”; the latent source-analysis possibility “council” is not exposed as a second displayed sense. `Khumkelral` and `Lorbelral` use `Ral` only for entrusted civic roles and do not authorize `-ral` as an unrestricted generic person or occupation suffix.

`Kalrin` is promoted from the canonical phrase `kelka an Kalrin`, “a king's decree,” into a standalone gender-neutral ruler or sovereign headword. The source phrase remains unchanged. `Belvoklor` is the narrower chieftain or clan-leader role and does not automatically imply sovereignty.

`Welkelthar` names the collective election process, while `Keltharaen` names one participant's formal act of voting and `Tharsharaen` remains ordinary deciding or choosing. `Lorshara`, `Thalbel`, and `Kalkel` distinguish policy, codified law, and a particular official decree. `Belrinpel` is an institutional permit and leaves `Rinpel` as the physical or authenticating seal or stamp.

`Shental` and `Shentalaen` concern measured resource assignment; `Weltal` and `Weltalaen` concern delivery or division among recipients. `Kelreth` is an active dispute. `Thalkelreth` and `Thalkelrethaen` concern binding arbitration and remain distinct from `Khumelaen` relational reconciliation.

`Welrin` is a citizen, `Welrinath` is citizenship, `Felbelor` is an administrative district, and `Lorzhir` is a jurisdictional border. `Lorzhir` does not replace `Lianrethxar` an anomaly boundary or `Ndara` a physical wall. `Kelvok` is a stated formal contract and remains distinct from `Nkuvath` an intimate or informal promise or bond of trust.

`Verkalkelaen` means institutional veto only; ordinary refusal remains `Ka` or `Verka`. `Weleth` and `Kaweleth` establish public and private as an access distinction. `Kaweleth` does not mean hidden, mysterious, selfish, secretive, or antisocial.

All twenty-eight entries are universal overall, so national origin and national usage remain blank. The primary forms are unsmoothed. `Khumakel`, `Khumakelral`, `Belvokalor`, `Kalakel`, `Belrinapel`, `Thalakelreth`, and `Thalakelrethaen` are optional searchable euphonic variants of their corresponding entries and do not count as separate headwords.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-GCI1-0001` through `LX-GCI1-0028`.

## ED-0018: Work Roles and Trade 1

Status: Approved.

Approval date: 2026-09-12.

Work Roles and Trade 1 adds fourteen approved universal headwords for stewardship, apprenticeship, skilled making, metalwork, masonry, engineering, scholarship, courier work, navigation, buying, selling, importing, exporting, and ownership.

The batch introduces no new primitive roots and creates no new dictionary category. `Ral` is promoted from its established caretaker, watcher, and entrusted-role use into a standalone Noun meaning steward or caretaker. This promotion does not expose a second technical root-analysis sense and does not authorize `Ral` as an unrestricted suffix for any person who performs an activity. Existing specialized roles such as `Droral`, `Kavral`, `Mekral`, `Zhaelral`, `Balral`, `Gavral`, `Neshbrenral`, `Belzorral`, `Lorvekral`, and `Eshlorral` retain their narrower meanings.

`Pralilan` is a supervised practical apprentice and remains narrower than established `Ilan` student or follower. `Pralral` is the broad artisan or craftsperson, while `Krenral` and `Mormekral` identify metalworking and masonry. `Lormekral` designs, analyzes, directs, or maintains complex constructed systems and remains distinct from `Mekral`, the mechanic or systems technician. `Shenral` formalizes the scholar or researcher form already used in approved Built Spaces examples. `Kelvekral` is responsible for an entrusted message or small delivery rather than vehicle operation. `Sharalorin` determines and guides routes across environments; it does not replace drivers, pilots, ordinary guides, or `Lormahr` ocean-navigation skill.

`Anvanesh` and `Thalvanesh` distinguish buying and selling through inward and outward commercial perspective while `Vanesh` remains trade generally. `Lorzhiranshan` and `Lorzhirthalshan` distinguish commercial import and export across a jurisdictional border; neither receives a generic border-crossing meaning. `Ianath` names ownership as an established state or recognized right of direct possession. It does not alter `Ian`, `Anen`, `Eshen`, or `Velian`, and it must never extend property ownership to people, kin, partners, sacred relations, communities, or other inalienable belonging.

All fourteen entries are universal overall, so national origin and national usage remain blank. The primary forms are unsmoothed. `Pralaral`, `Krenaral`, `Mormekaral`, `Lormekaral`, `Shenaral`, and `Kelvekaral` are optional searchable euphonic variants and do not count as separate headwords.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-WRT1-0001` through `LX-WRT1-0014`.

## ED-0019: Defense and Weapons 1

Status: Approved.

Approval date: 2026-09-12.

Defense and Weapons 1 adds nine approved universal Noun headwords for weapon, sword, spear, bow, arrow, shield, firearm, energy weapon, and ammunition.

`Ngar` is an approved new primitive meaning weapon or purpose-built harmful implement. Initial `Ng-` is articulated as an audible nasal-plus-stop onset. Approval authorizes only `Ngar` and the explicitly listed derivatives `Ngarpel`, `Ngarzhir`, `Ngarjor`, `Ngarzhel`, `Ngarvek`, `Ngarwel`, and `Ngarjoraen`; it does not authorize an automatic word family.

Existing vocabulary remains intact. `Peleth` stays knife or blade, `Arthlor` stays a defensive formation or shield wall, `Arthaxar` stays armor, `Karmek` stays a general working tool, and `Jorkal` stays an attack or forceful offensive push. `Arthkal` names one external attack-intercepting shield and can be physical, worn, generated, or projected. `Ngarjor` is restricted to controlled material-projectile firearms, while `Ngarzhel` names weapons whose primary discharge is electrical, magical, kinetic, radiant, or comparable non-material energy. `Ngarvek` is the functional ammunition category; an ordinary battery remains `Zhelkav` unless deliberately serving as a consumable weapon charge.

All nine entries are universal overall, so national origin and national usage remain blank. The primary forms are unsmoothed. `Ngarapel`, `Ngarazhir`, `Ravajor`, `Ravajorvek`, `Arthakal`, `Ngarajor`, `Ngarazhel`, and `Ngaravek` are optional searchable euphonic variants and do not count as separate headwords.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-DW1-0001` through `LX-DW1-0009`.

## ED-0020: Organized Conflict 1

Status: Approved.

Approval date: 2026-09-12.

Organized Conflict 1 adds fourteen approved universal headwords for militia, army, patrol, siege, trap, target, aiming, firing, blocking or parrying, retreat, surrender, poison, war, and battle. It creates no additional primitive root and no new dictionary category.

`Welarth` is a locally rooted community-defense body whose members commonly retain civilian roles; `Ngarwel` is a formally organized armed force prepared for sustained operations. `Kesvar` is explicitly approved with bounded activity-and-group polysemy: it can name the recurring security journey or the group performing it. `Xarkaleth` is an operation imposed around a fortified place rather than the defending position. `Vethbel` is the batch's only new `Bel` compound and uses binding or restraint literally; it does not broaden `Bel` into a default compound element.

`Lorpel` is a neutral selected focus and does not imply hostility. `Lorpelaen` aligns attention, a body, a tool, a weapon, or a projected action toward such a target. `Ngarjoraen` is restricted to launching a projectile or directed weapon discharge. `Arthkaraen` intercepts one incoming attack and does not replace general `Arth` protection. `Vethvaraen` is purposeful withdrawal preserving cohesion or future action. `Kaarthaen` means to cease resistance and submit to opposing control; ordinary refusal remains `Ka` or `Verka`.

`Mavmor` names a harmful substance rather than the resulting illness `Mav`. `Rathnor` means sustained organized armed conflict and remains distinct from both an ordinary dispute and `Rathor` past or history; its medial n is fully pronounced. `Rathjor` is one bounded armed encounter within or apart from a larger war. Existing `Belshara` remains the word for a coordinated maneuver, formation movement, tactical path, or tactic, with all its previously displayed senses preserved; no duplicate tactic headword was added.

All fourteen entries are universal overall, so national origin and national usage remain blank. The primary forms are unsmoothed. `Ngarawel`, `Kesavar`, `Vethabel`, `Lorapel`, `Ngarajoraen`, `Arthakaraen`, `Vethavaraen`, `Mavamor`, `Rathanor`, and `Rathajor` are optional searchable euphonic variants and do not count as separate headwords.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-OC1-0001` through `LX-OC1-0014`.

## ED-0021: Sex, Birth, and Death 1

Status: Approved.

Approval date: 2026-09-12.

Sex, Birth, and Death 1 adds nine approved universal headwords covering the core noun, ordinary verb, and descriptive adjective for sex, birth, and death. It creates no new dictionary category.

`Tlamor` means sexual activity or intercourse through the combination of `Tla` intimate connection and `Mor` physical embodiment. It does not inherently encode love, marriage, reproduction, consent status, participant gender, or biological sex classification. `Tlamoraen` is the ordinary action verb and `Tlamoreth` means pertaining to sexual activity or bodily sexual function; the adjective does not mean sexually attractive.

`Shalbal` means birth as emergence into independent life through `Shal` life or beginning and `Bal` budding growth. It can describe human, nonhuman, egg-based, pod-based, or comparable magical modes of birth. `Shalbalaen` is active “to give birth”; its passive construction `shalbalaen nor-ka` means “to be born.” `Shalbaleth` means newborn or newly born. `Shalabal` and `Shalabaleth` are optional searchable euphonic variants and do not count as separate headwords.

`Duma` is an approved new two-syllable primitive meaning death or the irreversible end of bodily life. `Dumaen` means to die and `Dumeth` means dead or deceased. These forms do not by themselves define the condition of a soul, identity, memory, afterlife, ritual status, or metaphysical persistence. They remain distinct from sleep, unconsciousness, injury, disappearance, killing, destruction, and the ontological un-making associated with The Diminishing. Approval authorizes only `Duma`, `Dumaen`, and `Dumeth`, not an automatic derivative family.

All nine entries are universal overall, so national origin and national usage remain blank. The earlier discussed form `Kathaen` never entered canon and is superseded at the proposal level by `Duma`; no canonical definition was removed or replaced.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-SBD1-0001` through `LX-SBD1-0009`.

## ED-0022: Semantic Continuity and Polysemy 1

Status: Approved.

Approval date: 2026-09-13.

Semantic Continuity and Polysemy 1 adds seven explicitly approved senses to existing Canon Dictionary headwords. It adds no headwords, primitive roots, variants, categories, or national origins. Every earlier displayed sense and established example remains canonical.

`Kel` adds the Noun sense “a text; a connected body of written or encoded words.” It does not mean information or data generally and does not replace established `Kel` as informal say or talk, name, or word.

`Anvekaen` adds “to load cargo into transport,” while retaining its established passenger sense “to board.” `Thalvekaen` adds “to unload cargo from transport,” while retaining its established passenger sense “to disembark.” Participant type and object structure distinguish the paired readings: a traveler boards or disembarks; an operator loads or unloads `Vekmor` cargo.

`Keldoraen` adds the narrow sense “to write or inscribe visible language on a surface.” It retains every established use involving the marking of a location, boundary, sign, name, target, or warning and does not extend to generic recording, authorship, measurement, or data entry.

`Njor` adds a relational or conceptual bridge between separated people, groups, systems, or ideas. It retains the literal structural bridge. The extended sense requires a meaningful division being crossed and does not replace `Ohm` connection or empathy, `Bel` binding or order, `Zhir` continuity through time, or `Shan` passage and transfer.

`Sel` adds mental clarity as an unobscured and internally ordered state of thought. It retains physical clarity, purity, and absence of grime and does not mean truth, evidence, proof, or correctness; those distinctions remain separate from `Lian`. Because the physical sense was already displayed from its root record before this decision, `Sel` joins `Shan` as a specifically approved exception in which that established root sense remains visible beside a later lexical sense.

`Ruvan` adds moral, institutional, or social corruption through the Ohnoshan metaphor of living rot spreading through a community or organized system. It retains literal organic rot in food, tissue, and once-living material and does not become the generic word for failure, disorder, evil, technical malfunction, or physical destruction.

This decision formalizes the **Ohnoshan Metaphor Test**: a Celan word may develop a new meaning when speakers could naturally reach it through established Celan semantic relationships, Ohnoshan lived experience, or attested internal grammatical development. The fact that an English word carries both meanings is not sufficient evidence. Proposed extensions must be classified as a displayed sense, ordinary usage, idiom, better compound, or rejection and must preserve every established phrase using the earlier meaning.

When an approved additive sense repeats a spelling already present in `data/lexicon_expansions.csv`, the earlier row remains unchanged and the new sense receives its own entry ID, approval batch, linked contrastive examples, and the explicit `Approved additive displayed sense` marker. This is a controlled polysemy exception, not permission for accidental duplicate expansion rows.

The seven approved sense rows are maintained in `data/lexicon_expansions.csv` under IDs `LX-SCP1-0001` through `LX-SCP1-0007`.

## ED-0023: Recreation, Competition, Performance, Story Arts, and Celebration

Status: Approved.

Approval date: 2026-09-13.

Recreation and Competition 1 adds twenty-two approved universal headwords. Performance, Story Arts, and Celebration 1 adds twenty-five new universal headwords and one additive Noun sense to the existing headword `Thael`. Together the two passes add forty-seven headwords and forty-eight displayed senses. They create no new dictionary category.

`Dov` is an approved new primitive for voluntary play or recreation undertaken primarily for enjoyment. `Nak` is an approved new primitive for organized competition whose outcomes are compared without inherently implying hostility. Approval authorizes only the forms explicitly listed in these passes; it does not create automatic `Dov` or `Nak` families. `Dov`, game, player, and sport remain distinct from joy, work, training, and competition. `Nak`, competitor, opponent, rules, officials, rewards, results, and races remain distinct from attempt, disagreement, battle, and generic success or failure.

The matched result system is `Shalnak` for victory, `Vethnak` for defeat, and `Thalnak` for a tie. The associated verbs are competition-specific; generic success remains `Sivathaen` and generic failure remains `Sivrethaen`. Generic skating is `Trakshalilaen`, whose surface or equipment context supplies ice, wheels, or another low-friction mode; the rejected proposal `Velshalilaen` is not canonical. `Mahrshalilaen` names surfing or controlled current-gliding on moving water.

`Aennor` formalizes the source-defined `Aen` plus `Nor` formation for music. It supports the explicitly approved musician, song, singing, chorus, percussion, dance, melody, story, expressive-art, live-performance, audience, and stage vocabulary without converting every transparent combination into an automatic headword. `Thael` adds the Noun sense “rhythm or beat; a recurring pattern of pulse, sound, or movement.” Its established Adjective and root sense “gentle motion; breeze-like rhythm” remains unchanged and visible. This is an approved additive sense under the preservation rules of ED-0022.

`Rim` is promoted as a latent root meaning celebration or festive shared observance from the established compound `Welrim`. `Welrim` remains specifically a continuous shared feast centered on food. The promotion authorizes `Rim`, `Rimaen`, and `Rimor`; it does not create an unrestricted derivative family. `Rim` celebration, `Rimaen` celebrate, and `Rimor` festival remain distinct from joy itself, a meal or feast, and sacred ritual generally.

All entries are universal overall, so national origin and national usage remain blank. Primary forms are the unsmoothed canonical forms. The recorded smoothed forms are optional searchable euphonic variants and do not count as separate headwords: `Sivavok`, `Nakashara`, `Nakalorral`, `Nakatal`, `Vethanak`, `Vethanakaen`, `Trakashalilaen`, `Mahrashalilaen`, `Aenthaelaral`, `Karathael`, `Karathaelaen`, `Karathaelaral`, `Thaelaral`, `Zhirkelaral`, `Rinpralaral`, and `Norpralaral`.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-RC1-0001` through `LX-RC1-0022` and `LX-PSAC1-0001` through `LX-PSAC1-0026`.

## ED-0024: Health, Treatment, and Survival 1

Status: Approved.

Approval date: 2026-09-13.

Health, Treatment, and Survival 1 adds forty-four approved universal headwords in two semantic passes: health, diagnosis, and treatment; then exposure, rescue, and survival procedure. It creates no new dictionary category and adds no new sense to an existing headword.

The batch establishes a three-layer register practice rather than a new grammatical rule. Frequent household and conversational concepts favor compact common forms. Longer compounds remain appropriate where their components carry clinical, emergency, or institutional precision. Predictable meanings remain transparent phrases when a separate long derivative would add no useful lexical distinction. This is a tendency governed by frequency and semantic value, not an absolute syllable limit.

`Ndem` is an approved one-syllable primitive for anatomical blood, with both `n` and `d` articulated. `Ndemaen` means to bleed. These forms remain distinct from `Dren` symbolic water or life-flow, `Dro` physical water, `Mor` matter, and `Shal` life or beginning. Approval authorizes only `Ndem` and `Ndemaen`, not an automatic blood family.

`Sava` is an approved two-syllable common-register primitive for ordinary health care or treatment. `Savaen` means to care for or treat in ordinary speech, `Savin` means patient, and `Savor` means clinic or infirmary. `Talzhael` remains a narrower technical term for a defined therapeutic intervention or planned course, while `Talzhaelaen` means to administer or carry out that defined treatment. Approval authorizes only the four listed `Sava` forms.

`Mavkes`, `Keshen`, and `Keshenath` distinguish symptom or clinical sign, the examination process, and the concluded diagnosis. `Zhaelphel` is medicine generally while `Fennilphel` remains specifically herbal remedy. `Zhaelshen` is one measured medicinal dose. A dosage schedule remains a transparent construction. `Morzhael` is bodily recovery occurring in the patient and remains distinct from treatment applied by a caregiver and from `Zhaelpralaen`, repair of objects or systems.

`Mavkrez` fever is internally generated illness heat and remains distinct from `Rekmav`, severe systemic illness caused by environmental heat. `Velmav` is systemic cold illness or hypothermia, while `Velaivkor` is localized frostbite and `Riv` remains shivering. `Kadromav` is bodily dehydration and does not replace thirst, ordinary dryness, or deliberate drying of food or material.

`Mavbal` biological infection remains distinct from illness generally, poison, and organic rot. `Mavbaleth` means infected; `Mavbalshaneth` means capable of transmitting infection. `Mavbalshanaen` is the technical verb for transmitting infection. `Mavbalxar` is health-directed quarantine of people, animals, objects, or areas and does not mean imprisonment or generic isolation. The predictable act of placing something under quarantine remains an ordinary phrase rather than receiving the withdrawn long verb `Mavbalxaraen`.

`Kesrin`, `Kakesrin`, `Kakesrineth`, and `Kesrinaen` distinguish wakeful consciousness, unconsciousness, the unconscious state, and regaining consciousness. They do not replace mental clarity, noticing, sleep, dreaming, collective consciousness, sedation, spiritual absence, or death.

`Vaarshan` and `Vaarshanaen` center an endangered or trapped being brought into relative safety. `Thalwelvar` and `Thalwelvaraen` center organized preventive or emergency removal from a dangerous place. Both remain distinct from carrying, retreat, and ordinary transport. `Rathlorkel` is a warning or alert noun; ordinary warning uses existing speaking or giving syntax rather than the withdrawn derivative `Rathlorkelaen`.

`Shalkav` is survival as continued bodily life or essential function through danger. `Kavaen` is the shorter common verb to endure, last, or survive; context distinguishes living survival from an object, system, or institution remaining functional. `Vaarbelwek` is an executable safety or emergency protocol, `Nethvek` is a supported casualty carrier or stretcher, and `Shentalzhael` is medical triage as measured treatment priority under limited resources.

`Zhaelolan`, `Aivkorxar`, `Jorzhael`, `Mavmorzhael`, and `Rekrathlor` distinguish medicinal salve, bandage or wound dressing, first aid, antidote, and emergency. All entries are universal overall, so national origin and national usage remain blank.

Primary forms are unsmoothed. The following are optional searchable euphonic variants and do not count as separate headwords: `Talazhael`, `Zhaelaphel`, `Morazhael`, `Mavakrez`, `Mavabal`, `Aivakorxar`, `Mavamorzhael`, `Rekarathlor`, `Velamav`, `Rekamav`, `Mavabalxar`, `Shalakav`, and `Nethavek`.

The withdrawn proposal forms `Talzhaelin`, `Talzhaelor`, `Morzhaelaen`, `Morzhaeleth`, `Rathlorkelaen`, `Mavbalxaraen`, and `Shalkavaen` are not canonical aliases or variants. The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-HTS1-0001` through `LX-HTS1-0044`.

## ED-0025: Environment, Geography, and Ecology 1

Status: Approved.

Approval date: 2026-09-13.

Environment, Geography, and Ecology 1 adds seventy-two approved universal headwords in two semantic passes. Pass 1 covers physical landforms, waterways, weather, climate, atmospheric conditions, sediment, and natural hazards. Pass 2 covers plants, fungal life, ecological organization, animal relationships, migration, food relationships, environmental damage, conservation, restoration, and resource conditions. It creates no new dictionary category and adds no new sense to an existing headword.

`Mbu` is an approved one-syllable primitive for fungus or fungal life, with both `m` and `b` articulated. It remains biologically distinct from `Verd` plant life, `Zor` animal life, and `Ruvan` organic rot. Approval authorizes only `Mbu`, not an automatic derivative family.

`Nali` is an approved two-syllable primitive for species as a recognized biological kind or lineage extending across organisms and generations. `Nalior`, `Welnali`, `Kornali`, `Shannali`, `Rathshannali`, `Dumanali`, and `Rathnali` distinguish habitat, population, native species, introduced species, invasive species, extinction, and endangered species. Foreign introduction is not treated as danger by default: `Shannali` remains neutral unless ecological harm justifies `Rathshannali`. Approval authorizes only the listed family.

`Sul` is an approved one-syllable primitive for a usable supply, substance, energy source, or environmental provision available to meet a need. `Worsul`, `Kasul`, `Kavsul`, `Weksul`, and `Versul` distinguish resource abundance, resource scarcity, a deliberately preserved reserve, a replenishable resource, and material treated as waste. A renewable resource is not necessarily inexhaustible, and waste may return to resource status through recovery or reuse. Approval authorizes only the listed family.

`Gorm` is promoted as a visible Noun meaning dirt, grime, or unwanted soiling matter from the source-established analysis of `Gormeth`, dirty or soiled. This promotion preserves `Gormeth` unchanged and authorizes the environmental compound `Welgorm`, pollution dispersed through shared surroundings. It does not expose or invent another hidden root-analysis sense.

`Felmorl`, `Delmorl`, `Pelmorl`, `Morlshara`, `Xarmorl`, `Shanmorl`, `Selmor`, `Ndavimor`, `Kadromor`, `Brossadar`, and `Velkmorl` expand natural landform description without replacing established mountain, stone, soil, sand, permafrost, or built-infrastructure vocabulary. `Shanmorl` is an open natural canyon or gorge and remains distinct from established `Morlshan`, an enclosed or built tunnel.

`Terramahr`, `Drenfel`, `Fellun`, `Drenverd`, `Mahrmorl`, `Drenjor`, and `Mahrwel` distinguish coastline, small flowing water, small still water, wetland, submerged reef structure, surface wave, and sustained current. `Drenverd` is the general wetland class for marshes, swamps, and bogs unless later usage proves narrower headwords necessary. `Mahrmorl` remains distinct from `Neshmorl`, coral as a biological or material substance.

`Eshnor` is present or near-term weather while `Eshweknor` is the recurring long-duration climate pattern. `Drenesh`, `Eshkar`, `Eshjor`, `Eshdren`, `Kadro`, `Drenrek`, `Morkar`, `Morljor`, `Sadarjor`, `Velxar`, `Felsadar`, and `Krezshen` distinguish cloud, thunder, gale, humidity, drought, flood, earthquake, landslide, sandstorm, frost, silt, and temperature without replacing established rain, snow, fog, storm, heatwave, cold snap, ice, fertile soil, or mud vocabulary.

`Verdin`, `Verdmarin`, `Morlzhir`, `Verdxar`, `Zhirverd`, `Verdpel`, `Balvek`, and `Balshan` distinguish an individual plant, tree, plant root, bark, vine, grass, seed, and pollination. `Shalrin` names one organism and `Ohmshal` the connected living community and physical environment. `Gavin`, `Rathzor`, `Welzor`, `Zornethor`, and `Wekvaraen` distinguish prey, predator, animal group, animal shelter, and migration. `Welzor` is the universal umbrella for herd, flock, pack, school, and swarm; species or context provides narrower readings.

`Emilzhir` is a directional food chain while `Emilbel` is an interconnected food web. `Terramav`, `Mavverd`, `Welgorm`, `Pelnor`, and `Xilnalior` distinguish ecological degradation, plant blight, pollution, erosion, and habitat fragmentation. `Terrakav` protects what remains through conservation while `Terrazhael` assists recovery through ecological restoration. `Ruvan` organic rot and `Mavmor` poison retain their established meanings.

All entries are universal overall, so national origin and national usage remain blank. Primary forms are unsmoothed. `Velkamorl`, `Eshwekenor`, `Rathashannali`, and `Wekavaraen` are optional searchable euphonic variants of their corresponding entries and do not count as separate headwords. Every letter in both primary and optional forms remains articulated.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-EGE1-0001` through `LX-EGE1-0072`.

## ED-0026: Information, Computation, Automation, and Electrical Systems 1

Status: Approved.

Approval date: 2026-09-13.

Information, Computation, Automation, and Electrical Systems 1 adds fifty-seven approved universal headwords in two semantic passes: thirty-five for information, computation, and automation; and twenty-two for electrical systems, diagnostics, and technical control. It creates no new dictionary category and adds no new sense to an existing headword.

`Dava` is an approved new two-syllable primitive for information as meaningful content capable of being known, communicated, represented, or stored. It remains distinct from `Kel` language or text, `Lian` truth, `Vel` wisdom or deep memory, and `Shen` measurement or assigned value. `Shendava`, `Kavdava`, `Davaxar`, `Beldava`, `Davapral`, and `Zheldava` distinguish data, record, file, database, display, and signal. `Davaxar` is information given a bounded retrievable container, while `Xardava` is information placed under protective concealment; their reversed root order is deliberate.

`Raku` is an approved new two-syllable primitive for rule-governed computation over numbers, symbols, states, or information. `Rakumek` is a complete computing device while `Rakufelmek` is its computational processor component. `Rakushara`, `Rakukel`, and `Belraku` distinguish algorithm, code, and program. `Varokraku` names automation as the transfer of moment-to-moment execution to an instruction-governed system; it does not imply intelligence, consciousness, autonomy, or freedom from human responsibility. `Belwek` remains the broader ordered recurring process and may be manual, biological, mechanical, magical, or automated.

The approved information actions distinguish neutral transmission, copying, upload, download, saving or recording, search or query, synchronization, encryption, and decryption. `Mekreth`, `Felmekreth`, `Rekmekreth`, and `Rethdava` distinguish system malfunction, bounded defect or bug, abrupt crash, and corrupted information. Existing `Keldoraen` remains visible writing or inscription, `Rinshen` remains an official identifying record, `Liankavor` remains an archive, `Belzhir` remains a communications network, and `Belzhirkavor` remains the physical data-center facility.

`Zhel` retains its established broad meaning of spark, energy, charge, or quick power-flash and can identify ordinary electricity through context. The approved electrical family adds current, circuit, electrical potential, conductor, insulator, capacitor, switch, terminal, surge, overload, outage, fault, short circuit, energizing, charging, discharging, circuit protection, grounding, diagnostics, control units, and signal interference without replacing `Zhelbel`, `Zhelkor`, `Zhelkav`, `Krenzhir`, `Shanmek`, `Kesmek`, `Shenmek`, or `Lormekor`.

All fifty-seven entries are universal overall, so national origin and national usage remain blank. Primary forms are unsmoothed. `Kavadeldava`, `Felmekareth`, `Rekamekreth`, `Rethazhelshara`, `Arthazhelshara`, and `Rethazheldava` are optional searchable euphonic variants and do not count as separate headwords. Every letter in primary and optional forms remains articulated.

Approval authorizes only `Dava`, `Raku`, and the explicitly listed derivatives in this batch, not automatic word families. Artificial intelligence, cybernetic personhood, implants, prosthetics, holography, surveillance doctrine, and detailed information ethics remain outside this decision.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-ICAES1-0001` through `LX-ICAES1-0057`.

## ED-0027: Science, Astronomy, and Cosmology 1

Status: Approved.

Approval date: 2026-09-13.

Science, Astronomy, and Cosmology 1 adds fifty-five approved universal headwords in two semantic passes: twenty-seven for astronomy, cosmology, and physical space; and twenty-eight for scientific inquiry, testing, and instruments. It creates no new dictionary category and adds no new sense to an existing headword.

`Dral` remains heaven, sky, celestial awe, and the experienced heavens. It is not expanded to mean universe, cosmos, star, or planet. `Songa` is the approved new two-syllable primitive for the total physical universe or cosmos. `Nyel` is the approved new one-syllable primitive for an individual self-luminous star. `Vora` is the approved new two-syllable primitive for a planet. Approval authorizes only those roots and the explicitly listed derivatives in this batch, not automatic word families.

`Songaeth`, `Songazun`, and `Songashen` distinguish cosmic relation, outer space, and cosmology. `Nyel`, `Kreznyel`, `Nyelbel`, `Wornyelbel`, and `Nyelzhir` distinguish star, relational sun, star system, galaxy, and constellation. `Zhirnyel` is an appearance-based “thread-star” term for comet and does not classify a comet scientifically as a star. `Vora`, `Voraeth`, and `Felvora` distinguish planet, planetary relation, and asteroid or minor planet. `Lun` retains its established Moon sense and `Luneth` supplies lunar relation.

`Ravwek`, `Ravwekaen`, and `Ravwekin` distinguish orbit, orbiting, and a natural or constructed satellite through pull plus recurrence rather than through `Dral`. `Dralxar`, `Dralfel`, `Krezdralfel`, `Mordralfel`, `Dralshen`, and `Drallor` retain `Dral` only where the experienced heavens genuinely motivate eclipse, celestial fragments, meteor phenomena, astronomy, or a heaven-directed instrument.

The approved scientific-method vocabulary distinguishes science, scientific relation, formal observation, evidence, experiment, hypothesis, theory, model, simulation, sample, variable, experimental control, probability, measurement uncertainty, accuracy, precision, evidence-derived prediction, replication, lens, telescope, and microscope. `Kesdava` evidence is not automatically truth. `Sivkel` hypothesis is provisional and testable. `Belkes` theory is supported and revisable rather than a casual guess or final certainty. `Rinmek` and `Varrinmek` are representations rather than the reality represented.

`Rethshen` measures likelihood under uncertainty while `Shenreth` states uncertainty surrounding a measurement. `Shenlianeth` means accurate relative to a trusted reference while `Pelsheneth` means precise or narrowly resolved; neither entails the other. `Shenvarash` is an evidence-derived prediction and does not replace prophecy or intention. `Weksivshen` is experimental replication and does not replace ordinary repetition.

All fifty-five entries are universal overall, so national origin and national usage remain blank. Primary forms are unsmoothed. `Krezenyel`, `Worenyelbel`, `Nyelezhir`, `Zhiranyel`, `Krezadralfel`, `Moradralfel`, `Vararinmek`, `Vararinmekaen`, `Dralalor`, and `Felalor` are optional searchable euphonic variants and do not count as separate headwords. Every letter in primary and optional forms remains articulated.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-SAC1-0001` through `LX-SAC1-0055`.

## ED-0028: General Magic and Metaphysical Practice 1

Status: Approved.

Approval date: 2026-09-13.

General Magic and Metaphysical Practice 1 adds fifty-three approved universal headwords in two semantic passes: twenty-two shared terms for magic, practitioners, domains, spells, channeling, enchantment, protection, containment, blessings, curses, artifacts, focuses, and technomancy; and thirty-one terms for spiritual practice, elemental shaping, biomancy, mental or perceptual effects, strain, instability, and consequences. It creates no new dictionary category and adds no new displayed sense to an existing headword.

`Aru` is the approved new two-syllable primitive for magic in general. Its family is deliberately restricted to the twelve explicitly approved `Aru`-bearing headwords in this batch. Earlier unapproved forms from the overextended `Aru` proposal are not headwords, aliases, or automatic derivatives.

`Rinaru`, `Kalaru`, and `Esharu` describe overlapping spiritual, physical, and mental domains. They are ordinary Noun headwords, not new app categories and not exclusive schools. A practice may be described through more than one domain when its mechanism genuinely crosses them. `Mekaru` describes magical practice integrated with constructed systems rather than creating a fourth magical substance.

`Arukel` treats a spell as a bounded repeatable formulation and does not restrict spells to spoken words. `Rinbel` names a sustained extraordinary property or directive bound into operative identity; it does not make every magical effect an enchantment. `Arthrin` protects while `Xarrin` seals or contains. `Vaarrin` and `Rathrin` distinguish beneficial and hostile conferred conditions without changing the existing meanings of their roots.

`Thaenin` is an agentive spirit-being and is not automatically a dead person, ancestor, god, Echo, or trustworthy presence. `Thaenohm` contact does not entail control, worship, agreement, or correct interpretation. Spirit-binding and release do not predetermine consent or ethics.

The elemental proposals are verbs of shaping rather than a mechanically complete set of “-mancy” nouns. `Dropralaen` uses `Dro` for physical water and does not weaken symbolic or relational `Dren`. `Esharu` selects the thought and intellect range of `Esh`, while `Eshpralaen` selects its air and wind range. `Tenarpralaen` and `Vethpralaen` preserve the rule that light and shadow do not inherently encode moral good and evil. `Shalrinaen` names biomantic alteration broadly; it is not automatically healing, consensual, or ecologically safe.

`Vethshal`, `Tharbel`, and `Kesxar` distinguish illusion, compulsion, and perceptual veiling. These effects are method-neutral and may be magical, technological, chemical, ritual, artistic, or psychological; context or a domain term identifies the method. An illusion supplies a constructed appearance, a compulsion binds choice or will, and a perceptual veil blocks or redirects notice.

`Worshankal`, `Rethkal`, `Shantham`, and `Ohmreth` distinguish unsafe channel load, unstable power, harmful return through a working, and disruption within an attunement. `Kaohmaen` deliberately severs an attunement and is not ordinary relational separation or the dispelling of an external effect.

Existing `Terra`, `Zhel`, `Ohm`, `Rin`, `Thaen`, `Khumeth`, `Kal`, and Echo terminology retain their established meanings. Magic is not universally reducible to the Heart of Terra, energy, attunement, spirit, ritual, power, or post-Fracture phenomena. Existing healing, temporal, spatial, ritual, anomaly, and detection terms remain primary where they already express the intended action.

All fifty-three entries are universal overall, so national origin and national usage remain blank. Primary forms are unsmoothed. `Artharin`, `Xararin`, `Ratharin`, `Krezapralaen`, `Vethapralaen`, `Worashankal`, and `Rethakal` are optional searchable euphonic variants and do not count as separate headwords. Every written letter in primary and optional forms remains articulated.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-GMMP1-0001` through `LX-GMMP1-0053`.

## ED-0029: Living Celan 1 and the Expressions Layer

Status: Approved.

Approval date: 2026-09-14.

Living Celan 1 approves the expressions in proposal Passes 1A, 1B, 2, and 4. Pass 3 remains exploratory and is not integrated. The approved set adds twelve elevated metaphorical expressions, ten contemporary Ohnoshan idioms, eight clipped or reanalyzed colloquial forms, and eight nationally characteristic expressions. These are expression records rather than new dictionary headwords or added dictionary senses.

The app gains a first-class Expressions index assembled from `data/expressions.csv` and established expressive source records. Existing greetings and farewells, interjections, hesitation sounds, expressive responses, discourse expressions, oaths and curses, source idioms and proverbs, and the eight inherited national slurs are cross-listed without being removed from or duplicated within their authoritative lexicon and phrase sources. National origin marks characteristic development or use rather than exclusive ownership.

The Phrase Builder phrasebank is explicitly excluded from the Expressions index. A sentence or translation prompt does not become an expression merely because it is stored at phrase level. Expression admission requires conventional social meaning, recognizable expressive function, or established source classification.

The national slurs remain documented as offensive language. Cross-listing does not resolve their `Source Ambiguity` status, approve their derivations, or make them neutral forms of address. The Expressions interface must preserve their source and review status and display a clear usage warning.

`Ilin-ka` and `Inko-ka` are approved as colloquial ellipses in which an understood possessed noun is omitted. `Ver-ilin` is approved as a socially marked contraction meaning “not us” or “not one of us,” not as a replacement for ordinary standard negation. `Nor-ka`, `Wek'aen`, and `Athnor` retain their established grammatical or discourse meanings while functioning as whole utterances in shared context.

The approved records are maintained in `data/expressions.csv` under IDs `EX-LC1A-0001` through `EX-LC1A-0012`, `EX-LC1B-0001` through `EX-LC1B-0010`, `EX-LC1C-0001` through `EX-LC1C-0008`, and `EX-LC1E-0001` through `EX-LC1E-0008`.

## ED-0030: Spatial Reference and Deixis 1

Status: Approved.

Approval date: 2026-09-14.

Spatial Reference and Deixis 1 adds nine approved universal headwords and one additive spatial sense to existing `Kor`. It establishes ordinary left and right, center or middle, a three-way demonstrative system, interior and exterior location, generic entry and exit, and speaker-directed “come here” without creating a separate motion verb.

`Naku` and `Sora` are approved two-syllable primitive roots for left-side and right-side relation within an oriented frame. A person or animal normally supplies its own facing; a vehicle, tool, or building may supply a functional front; a route may supply direction of travel; and a map may supply its stated orientation. If no frame is recoverable, the speaker must establish one. Neither word is an absolute geographic direction. `Naku` does not mean remaining or abandoned, and `Sora` does not mean correct, acceptable, entitled, or politically right.

`Kor` adds the displayed Noun sense “Center or middle; the central position or region within a bounded whole.” Its established source/strength and handspan-measure senses remain visible. `Kordel` is not an approved headword in this batch. As a transparent construction it can only identify the core or midpoint of two stated references because `Del` means two; it is not the general word for middle.

`Den` is an approved one-syllable bound grammatical primitive for deictic reference. It is not an independent headword or noun. `Deni`, `Denya`, and `Denla` are Particle headwords marking a referent in the speaker's immediate sphere, the listener's immediate sphere, or away from both. They follow the noun they mark. A bare particle may occur through ordinary omission of an understood noun without becoming a Noun sense. The particles do not inflect for number. Existing `An` forms the locatives `an deni` “here,” `an denya` “there by you,” and `an denla` “over there/yonder.”

`Anor` names an interior or inside area. `Kaan` lexicalizes `Ka` without/not having + `An` in/at as the spatial Preposition “outside or beyond; not within a stated or understood boundary.” It remains distinct from general `Ka`, from motion-source `Thal`, and from a completed boundary crossing. The isolated source-example form `thalor` is preserved as a source witness but is not promoted as the current outside term because of its strong surface overlap with `Thalorim` lightning.

`Anshanaen` and `Thalshanaen` are the generic physical verbs enter and exit. They entail crossing a boundary and remain distinct from `Anvekaen` board/load transport and `Thalvekaen` disembark/unload transport. After a motion verb, existing `An` may mark a reached or entered goal; in a static clause it continues to mark location. Speaker-directed motion uses this analytic structure, as in `va var Ya an deni` “come here,” rather than adding a separate primitive for come.

The batch does not establish cardinal directions or a universal mountain-ward, sea-ward, light-ward, or shadow-ward frame. Existing star routes, wind bearings, compasses, maps, currents, passes, destinations, and contextual orientation remain the long-range navigation layer.

All nine new headwords and the additive `Kor` sense are universal overall, so national origin and national usage remain blank. Approval authorizes only `Naku`, `Sora`, `Deni`, `Denya`, `Denla`, `Anor`, `Kaan`, `Anshanaen`, `Thalshanaen`, the added `Kor` sense, and the grammatical constructions stated here—not automatic derivative families.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-SRD1-0001` through `LX-SRD1-0010`.

## ED-0031: Humor, Laughter, and Playful Speech 1

Status: Approved.

Approval date: 2026-09-14.

Humor, Laughter, and Playful Speech 1 adds thirteen approved universal headwords for laughter, laughing, funniness, humor, jokes, joking and playful teasing, wordplay, wit, comic performance, mockery, ridicule, irony, and sarcasm. It establishes one new primitive root, `Hav`, and creates no new dictionary category or expression record.

`Hav` names laughter as an embodied vocal, breath-driven, facial, or bodily response. It does not by itself imply joy, humor, kindness, consent, or ridicule. `Havaen` is the ordinary verb laugh. `Haveth` evaluates something as funny or amusing in a particular context rather than declaring it universally funny. `Vial` remains joy or happiness, `Dov` remains play or recreation, and `Aen` remains speech, breath, and sound generally.

`Dovhav` names humor or a comic frame by combining play with the possibility of amused response. `Dovkel` is one bounded joke conveyed through an utterance, story beat, gesture, or act. `Dovkelaen` means to joke; with a person as direct object it means to tease that person playfully. `Ser` can establish mutual joking, as in `dovkelaen I ser Ya` “I joke with you.” A recoverable playful frame distinguishes joking from deception but does not permit a speaker to erase harmful social effects merely by claiming that an act was a joke.

`Keljek` names wordplay or a pun through language plus a turn in sound, wording, segmentation, or multiple meaning. `Pralhav` names wit as comic skill rather than intelligence, wisdom, education, or truth. `Dovhavral` names a person with a practiced comic role and does not classify every funny person as a comedian or professional performer. The approved smoother variants `Dovahav` and `Dovahavral` remain searchable forms of their unsmoothed headwords and do not add entries.

`Havrath` and `Havrathaen` name ridicule and the act of mocking when laughter or comic treatment is used to diminish, expose, or socially lower a target. The adversarial force describes the act's social orientation rather than declaring every participant a permanent enemy. Mutual joking and teasing remain `Dovkelaen`; a speaker's private intent does not automatically override a target's or observer's accurate recognition of mockery.

`Jekkel` names irony as an understood contrast between surface wording or apparent circumstances and intended evaluation or actual outcome. Irony expects the contrast to become recoverable through context, shared knowledge, tone, or events and is therefore not identical to deception. `Peljekkel` names sarcasm as pointed irony used to criticize, sting, challenge, or teasingly rebuke. Sarcasm may be affectionate or hostile but remains distinct from ridicule unless social diminishment becomes part of the act. `Jekakel` and `Pelajekkel` are optional euphonic variants and do not add headwords.

All thirteen entries are universal overall, so national origin and national usage remain blank. National voices may develop characteristic comic timing, metaphor, understatement, repetition, or performance habits without owning separate meanings. Approval authorizes only `Hav`, `Havaen`, `Haveth`, `Dovhav`, `Dovkel`, `Dovkelaen`, `Keljek`, `Pralhav`, `Dovhavral`, `Havrath`, `Havrathaen`, `Jekkel`, and `Peljekkel`, not automatic derivative families.

Separate headwords for smiling, specific laughter manners, dark or gallows humor, parody, satire, slapstick, farce, setups, punchlines, callbacks, and humorous national expressions remain deferred for later evidence-led development.

The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-HLPS1-0001` through `LX-HLPS1-0013`.

## ED-0032: Understanding, Helping, and Emotional Interiority 1

Status: Approved.

Approval date: 2026-09-15.

Understanding, Helping, and Emotional Interiority 1 adds twenty-one approved universal headwords and two approved colloquial expressions. The batch supplies general comprehension, misunderstanding, explaining, clarifying, ordinary help, and distinct vocabulary for envy, jealousy, embarrassment, boredom, loneliness, resentment, and anxiety. It creates no new dictionary category and adds no displayed sense to an existing headword.

`Nem` is an approved new one-syllable primitive for understanding or comprehension as a coherent mental grasp. It remains distinct from `Khum` patient or hearing-centered knowing, `Kes` noticing, `Sel` mental clarity, `Lian` truth, and `Vel` wisdom. `Nemaen`, `Rethnem`, `Rethnemaen`, `Kelnemaen`, and `Selnemaen` distinguish understanding, misunderstanding, explaining, and clarifying. Explanation aims to produce comprehension, while clarification removes obscurity or ambiguity from something already stated or partly grasped. Neither guarantees truth, agreement, or obedience.

`Mbaen` reuses the established `Mb-` support family as the ordinary verb help or assist. Both `m` and `b` are articulated. It remains distinct from rescue, repair, bodily healing, and emotional comfort. Offering, requesting, needing, accepting, and refusing help use ordinary questions, imperatives, modality, passive construction, and the established `Lia`, `Ka`, and `Ver` forms rather than receiving separate headwords in this batch.

`Zev` is an approved new one-syllable primitive for envy as painful comparative desire for what another has. `Fahohm` uses fear plus connection for jealousy as feared displacement within a valued bond, attention, or relational place. Envy and jealousy are therefore not synonyms: envy concerns another's advantage or possession, while jealousy concerns threatened relation.

`Mira` is an approved new two-syllable primitive for embarrassment as immediate self-conscious social discomfort. It remains lighter and more situational than established `Veth'tharaen` shame or guilt and does not imply wrongdoing. `Hav` laughter may arise from embarrassment but does not replace it.

`Daku` is an approved new two-syllable primitive for boredom as unpleasant or restless under-engagement. It does not make `Neth` rest, `Vaar` calm, leisure, or physical stillness inherently negative. A person may be bored while active or peacefully inactive without boredom.

`Ravohm` uses yearning plus connection for loneliness as painful felt absence or insufficiency of connection. It does not mean physical solitude, separation, or chosen privacy. `Kavkrez` uses preservation through time plus fire or anger for resentment as anger or grievance retained because something feels unanswered; immediate anger remains `Krezaen`. `Fahreth` uses fear plus uncertainty for anxiety as sustained or recurring apprehensive activation under uncertain or anticipated threat; immediate fear remains `Fahaen`, and ordinary concern or worry remains `Rethaen`.

`Rethanem`, `Rethanemaen`, `Kavakrez`, and `Kavakrezaen` are optional searchable euphonic variants of their corresponding unsmoothed primary headwords and do not add entries. Approval authorizes only `Nem`, `Nemaen`, `Rethnem`, `Rethnemaen`, `Kelnemaen`, `Selnemaen`, `Mbaen`, `Zev`, `Zevaen`, `Fahohm`, `Fahohmaen`, `Mira`, `Miraen`, `Daku`, `Dakuaen`, `Ravohm`, `Ravohmaen`, `Kavkrez`, `Kavkrezaen`, `Fahreth`, and `Fahrethaen`, not automatic derivative families.

`Nem ka.` and `Ra mbaen?` are approved colloquial expression records rather than additional dictionary headwords. The first means “That makes no sense; I am not following” and is blunter than `Ver nemaen I.` The second is a cooperative elliptical offer meaning “Want help?” or “Need a hand?”

All entries are universal overall, so national origin and national usage remain blank. The approved headwords are maintained in `data/lexicon_expansions.csv` under IDs `LX-UHEI1-0001` through `LX-UHEI1-0021`; the expressions are maintained in `data/expressions.csv` under IDs `EX-UHEI1-0001` and `EX-UHEI1-0002`.

## ED-0033: Body, Internal Anatomy, and Ordinary Bodily Functions 1

Status: Approved.

Approval date: 2026-09-15.

Body, Internal Anatomy, and Ordinary Bodily Functions 1 adds forty-four approved universal headwords. It supplies missing everyday body regions, joints and digits, living tissues, major internal organs, bodily pathways, common reflexes, bodily secretions and waste, menstruation, and fainting. It creates twenty new roots: `Doran`, `Breka`, `Vesh`, `Davel`, `Gora`, `Pir`, `Metha`, `Zek`, `Lera`, `Tash`, `Khelu`, `Lumar`, `Kedir`, `Lesh`, `Khos`, `Zer`, `Suv`, `Nar`, `Uren`, and `Fek`.

The root admissions are deliberately connected rather than arbitrary. `Gora` produces a joint family in `Kalvargora`, `Koringora`, `Sharvargora`, and `Morlkagora`; `Pir` produces finger and `Morlkapir` toe; `Metha` produces flesh, `Xarmetha` living skin, and `Kalmetha` muscle; `Tash` produces the general organ category, `Aentash` lung, and `Emiltash` stomach. `Uren` links urine, `Urenaen` urination, and `Urenvek` urinary bladder. `Khos`, `Zer`, `Suv`, `Nar`, and `Fek` each support compact noun-verb families for frequent embodied events. Existing roots remain active in the transparent compounds `Korkalvar`, `Korsharvar`, `Numor`, `Emilshan`, `Ndemshan`, `Ndemwek`, `Ndemwekaen`, and `Kakesrinaen`.

The direct organ roots `Khelu`, `Lumar`, and `Kedir` are theory-neutral. They name physical organs without forcing the lexicon to encode a speculative medical model through mind, memory, filtration, waste, or control metaphors. `Lesh` similarly names a nerve without reducing it to thread, pain, sensation, will, or strength. `Vesh` bodily back remains distinct from `Vethvar` positional behind. `Xarmetha` living skin remains distinct from `Rask` hide, and `Metha` living flesh remains distinct from `Torin` meat as food.

`Zek` means tooth. Possible historical or derivational relationships among teeth, smiling, grinning, and biting remain open for later development, but approval does not assign those additional senses automatically. `Nar` names nausea while `Naraen` is the lexicalized verb vomit; the state and event are related but not identical. `Ndemwek` and `Ndemwekaen` treat menstruation as an ordinary recurring bodily function rather than an injury or illness. `Kakesrinaen` is intransitive: it means that the subject faints, not that the subject causes someone else to become unconscious.

All forty-four entries are universal overall, so national origin and national usage remain blank. Approval authorizes only the listed headwords and their recorded senses, not automatic derivative families. The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-BIAOBF1-0001` through `LX-BIAOBF1-0044`, with linked examples under `PE-BIAOBF1-0001` through `PE-BIAOBF1-0088`.

## ED-0034: Reproductive Anatomy, Bodily Fluids, and Extremities 2

Status: Approved.

Approval date: 2026-09-15.

Reproductive Anatomy, Bodily Fluids, and Extremities 2 adds twenty approved universal headwords for vulva, vagina, clitoris, uterus, cervix, ovary, penis, testicle, scrotum, urethra, anus, sexual arousal, orgasm, saliva, tears, thumb, heel, and human hair. The arousal and orgasm concepts receive both noun and verb forms. The batch creates nine roots: `Noka`, `Kiri`, `Mara`, `Seki`, `Tava`, `Nderu`, `Fena`, `Leya`, and `Ruma`.

Anatomical structures are independent of `Azan` feminine essence and `Kadren` masculine essence. A person's anatomy does not determine gendered essence, and gendered essence does not predict anatomy. The approved terms are therefore direct anatomical vocabulary usable for any person who has the named structure. `Noka` vulva and `Nokashan` vagina remain distinct: the former names external genital anatomy and the latter the internal muscular canal. `Mara`, `Marasorl`, and `Nokashan` separately name uterus, cervix, and vagina. `Nderu` testicle remains distinct from `Nderuxar` scrotum. `Urenshan` urethra remains distinct from both vagina and urinary bladder.

`Shan` is used only where physical passage is central, in `Nokashan` and `Urenshan`. `Vek` is not a generic label for every hollow organ, and `Tash` is not mechanically attached to every internal structure. `Marasorl` uses the established neck relation for the lower narrow part of the uterus. `Nderuxar` uses protective covering for the scrotal sac. `Korpir` specifies the thumb when generic `Pir` digit is insufficient, while `Morlkavesh` names the rear weight-bearing part of `Morlka` foot through the approved bodily-back root `Vesh`.

`Leya` and `Leyaen` name sexual physiological arousal and becoming or being aroused. Arousal does not establish desire, consent, willingness, pleasure, or intended action. `Leyajor` and `Leyajoraen` name orgasm as a bounded bodily event and do not establish consent, satisfaction, fertility, ejaculation, or reproduction. Sexual activity remains `Tlamor`; psychological longing remains `Thera`.

`Kelvordren` saliva and `Lorinshaldren` tears use `Dren` as bodily fluid or flow without making saliva drinking water or tears evidence of sadness. `Ruma` human or person hair is historically and phonologically related to `Sura` animal hair or fur. Their formal resemblance records related bodily material, but neither is a transparent compound or an added sense of the other.

`Urenashan`, `Kelvoradren`, and `Lorinshaladren` are optional searchable euphonic variants of `Urenshan`, `Kelvordren`, and `Lorinshaldren`; they do not add headwords. Approval authorizes only the listed headwords and their recorded senses, not automatic terms for labia, rectum, sperm, semen, ovum, erection, lubrication, ejaculation, contraception, infertility, pregnancy, or other mechanically possible derivatives.

All twenty entries are universal overall, so national origin and national usage remain blank. The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-RABFE2-0001` through `LX-RABFE2-0020`, with linked examples under `PE-RABFE2-0001` through `PE-RABFE2-0040`.

## ED-0035: Short Interrogative Particles and the Optional Question Frame

Status: Approved.

Approval date: 2026-09-17.

Short Interrogative Particles 1 adds six approved universal Particle headwords: `Mu` what, `Nu` when, `Zhe` why, `Sha` how, `Lo` where, and `Ri` who. They form a closed grammatical family rather than six productive lexical roots. They do not authorize compounds, suffixed derivatives, additional noun meanings, or additions to the productive root database.

Standard questions continue to begin with `Ra`. A content question may optionally close with one of the six short particles to state the missing answer category explicitly. The closing particle is grammatically correct but never mandatory. A shorter form such as `ra var ser?` remains grammatical when situation, prior speech, gesture, or shared knowledge makes the requested information recoverable. The explicit `ra var ser lo?` is available when the speaker wants to identify place directly or prevent misunderstanding.

The approved optional Question Frame is `ra + what is known + missing-answer particle?`. `Ra` opens an unresolved thought, the clause establishes known structure, and the final particle names the missing anchor that an answer would supply. This is an ordinary practical interpretation suited to diagnosis, navigation, repair, testimony, and coordination; it is not a compulsory ceremonial pattern.

`Mu`, `Nu`, `Zhe`, `Sha`, and `Ri` are historically and phonologically related to `Mor`, `Nor`, `Zhir`, `Shara`, and `Rin` without becoming transparent modern derivatives or adding interrogative meanings to those older roots. `Lo` is historically related to place-bearing `-or`; the precise diachronic path remains open, but its living grammatical function is settled and it does not add a new sense to `Lor`. The differentiated forms avoid exact collision with ordinary lexical material in complex questions.

`Ri` requests identity and does not divide English “who” from “whom.” Celan uses one particle; clause structure and context establish the participant's role.

All six particles are universal overall, so national origin and national usage remain blank. The approved entries are maintained in `data/lexicon_expansions.csv` under IDs `LX-SIP1-0001` through `LX-SIP1-0006`, with linked examples under `PE-SIP1-0001` through `PE-SIP1-0012`. The app-facing grammar rules are maintained under `GR-SIP1-0001` and `GR-SIP1-0002`.

## ED-0036: F048 Legacy Example Corrections

Status: Approved and applied locally.

Approval date: 2026-09-22. The user supplied “Complete Corrected Database Mappings” in response to review flag F048.

Apply the user's exact 50 sentence replacements: 29 resting examples using `Nethaen`, 14 flowing examples using `Shalilaen`, and seven sharing examples using `Welaen`, with the accompanying preposition, word-order, and translation corrections. Preserve `PE-UHEI1-0035` (`ver rinaen ravohm nor neth.`) exactly as supplied; its temporal use of `nor` is accepted and the original flag was overinclusive for that sentence.

The complete approved mappings are preserved in `outputs/dictionary_review/F048_user_mappings.txt`. The before/after records, entry IDs, and literal glosses are in `outputs/dictionary_review/F048_applied.json`. Original source witnesses remain unchanged. Approval is for these exact examples, not a new unrestricted passive or derivation rule. `Shalilaen` and `Welaen` have no standalone dictionary entries at application time; their lookup coverage remains a separate follow-up, without invented headwords or pronunciations.

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

## ED-0037: Dictionary Accuracy Review Decisions

Status: Approved; integrated locally from all 99 review responses and subsequent clarifications.

The exact user export is preserved in `outputs/dictionary_review/user_responses_2026_09_22.json`; subsequent clarifications are recorded in `user_clarifications_round_2.json`. The later explicit choices supersede tentative alternatives in the export. F048 retains ED-0036's exact mappings.

The approved set includes sense-specific word labels, retained polysemy, corrected sentence pairs, restored lookup entries, and app search/family/display repairs. Zhelvek means both an energy carrier and a food energy bar. Shalor is used for the sanctuary place example. Lianeth retains separate Modal and Verb ability labels and gains the Adjective reliability sense. Noral means night/nighttime, not generic duration. Varan is a specialized locative-stative form; -al remains the universal continuous suffix. Both reviewed multi-verb orders are allowed.

Preserve all earlier meanings unless the user explicitly corrected them. Thaar is a regional variant of Thar; serilín is a variant of Serilin; tharvinwek resolves to Tharvin-Wek. These do not create duplicate headwords. The approved new dictionary entries restore already-used example vocabulary. Proposed derivations that are not established in the current app remain pending; they do not create new productive roots or suffixes. Existing pronunciations remain verified.

The integration retains available reviewed attestations instead of inventing extra example sentences to meet a count. Seventeen restored entries currently have one reviewed example each; the ordinary expansion validator's two-example requirement remains an outstanding coverage check, not evidence that the approved meaning is invalid.

## ED-0038: Possessive Spacing and Personal Suffixes

Status: Approved. The final user clarification explicitly accepts `La-ka kelvor`.

Standalone ka is exclusively without or no. Possessive -ka must be hyphenated to the possessor. Body parts, inner states, personal clothes, and primary personal gear use post-nominal -ian (my), -ya (your), or -eshen (his/her/their). Collective, titled, compound, and other third-person possessors use possessor-ka. The user explicitly permits La-ka kelvor for their mouth, including this third-person body-part construction. -ian never means their. Relational -esh indicates a bond; it does not by itself specify a third-person owner.

Approved examples: `rinaen aiv an doran-ian.`; `rinaen ndemwek-ian nor shara.`; `drenselaen I noka-ian.`; `drenaen La dren kora rinaen La-ka kelvor kadreneth.` Genuine negative uses such as `Var I ka shal.` remain unchanged.

The app grammar cards and working grammar layer follow this decision. Earlier source rules remain preserved as witnesses and are superseded where they conflict.

## ED-0039: Confirmed Origins of 17 Restored Words

Status: Approved and applied locally.

All seventeen previously pending derivations are settled by the user's explicit confirmations, recorded in `outputs/dictionary_review/integration/confirmed_derivations.json`. These decisions concern the listed words' internal histories and do not automatically promote all components to productive roots or universal suffix rules. The approved historical spellings Zhivor and Theren remain primary.

Serilin specifically and primarily means sister / female sibling in everyday Celan. Its Ser + -il + -in history does not broaden its dictionary meaning to generic kin or sibling. Em is unrelated to Emil; the cognition verb Varin is unrelated to the marine component in Jekvarin. Vrak is an unsegmented Trerran dialect primitive. Evan does not create a productive e- prefix, Shena does not create universal noun-forming -a, and Shenakar's historical akar is not promoted to a productive root.

The detailed Vorkaral derivation is Vor + Kar + nominal agent -al; retain the separate continuous verbal -al. Varral uses agent/practitioner -ral while independent Ral retains its caretaker/watcher sense. The two functions of -il are recorded in Shalil and Serilin, and the shared soft-flow -rel in Velkrel and Khumrel, without unrestricted new derivative creation.
