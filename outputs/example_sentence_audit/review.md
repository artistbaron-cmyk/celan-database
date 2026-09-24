# Dictionary example sentence audit

{
  "capturedAt": "2026-09-23T13:23:40.591Z",
  "headwords": 1496,
  "source_records": 2119,
  "source_and_inline_records": 2128,
  "visible_placements": 3681,
  "headwords_without_examples": 144,
  "headwords_with_hidden_examples": 199,
  "flags": 149,
  "flagged_sentence_records": 167,
  "categories": {
    "App presentation": 43,
    "Coverage": 1,
    "Meaning / translation": 18,
    "Example placement": 57,
    "Duplicate records": 19,
    "Translation variants": 11
  },
  "scope": "Dictionary entry example sections; all source phrase records and all app-selected inline/override examples. Grammar-guide examples, expression cards and generated Phrase Builder replies are separate surfaces and are not certified by this audit.",
  "limits": "Full inventory and structural checks, with targeted semantic review against current dictionary meanings. No claim that every unflagged translation or grammatical construction has been independently verified. No sentences or app files changed."
}

## APP-01 — The app does not separate direct usage from word-family or teaching examples

Confirmed app behavior · App presentation

The picker combines explicit links, reverse links and spelling matches, then puts the first five under Used In A Sentence. Those are different kinds of evidence.

Proposed action: Show Direct usage, Related forms, and Teaching notes separately. Prefer reviewed direct examples; retain source provenance.


## APP-02 — Additional examples are hidden after the first five

Confirmed app behavior · App presentation

The app returns more than five examples for some entries but renders only the first five, with no way to view the rest.

Proposed action: Add a count and View all examples. Keep a short preview.


Affected entries: I, Ilin, Ya, La, Kadron, Azron, Var, Ser, Thal, Ka, An, Nor, Esh, Morl, Terra, Dren, Shal, Krez, Thar, Shara, Rathor, Shalor, Lian, Aen, Arth, Kal, Seren, Vaar, Lorin, Rath, Fah, Reth, Korin, Dral, Tal, Verdor, Mahr, Lun, Kaleth, Varthas, Krezor, Belrin, Phelvin, Belshara, Morlak, Teravin, Liorin, Kel, Dro, Felka, Belvok, Ian, Talaen, Unar, Del, Quen, Peth, Nethor, Zhirin, Vorkor, Kareth, Pralor, Drenvor, Kadreneth, Belkor, Xaresh, Pralaen, Karethaen, Nethaen, Shen, Drobel, Awekshara, Mahrvek, Zhelbel, Mekral, Fennilphel, Zhaelral, Xarphelor, Mormek, Liankavor, Kavral, Rinshen, Dralshara, Karvek, Sharavok, Dor, Vekaen, Korinaen, Kaxaraen, Xaraen, Jekaen, Sharaen, Dar, Tharsharaen, Kes, Velzhiraen, Nethnor, Shalvar, Shan, Shalnor, Kavvek, Xarvek, Aiv, Selpralaen, Zem, Kren, Drenselaen, Aivkor, Mav, Lianrethor, Keldoraen, Balral, Sov, Gavral, Nesh, Neshbrenral, Zor, Belzor, Belzorral, Pelaen, Belxar, Belxaraen, Kalmek, Zhaelpralaen, Shenmek, Kesmek, Varvek, Morvek, Kormekvek, Belzhirvek, Anvekaen, Vekmor, Vekin, Lorvekral, Mekor, Xaror, Welpralor, Velkelor, Njor, Lorbel, Khumkel, Kalrin, Lorbelral, Kalkel, Kelreth, Welrin, Felbelor, Shenral, Kesvar, Dovath, Dovin, Nakaen, Sivvok, Naklorral, Jornak, Aennorral, Zhirkel, Khumkes, Norpralor, Rimor, Keshenaen, Savin, Savor, Mavbal, Aivkorxar, Verdin, Nalior, Davaxar, Vora, Arural, Rinvek, Ohmpel, Thaenin, Dovkel, Mbaen, Tera, Shalil, Tharvok, Evan, Shenakar, Shena, Varral, Bel, Mor, Vanesh, Jor, Bren, Wel, Vilor, Torin, Ver, Ra, Va, nor-ka, Rinaen, Emil, Teremil, Serin, Varadan

## APP-03 — Examples are attached to a whole word, not to its individual senses

Confirmed app behavior · App presentation

A word with multiple meanings has one shared example list. The reader cannot tell which meaning each sentence demonstrates.

Proposed action: Associate reviewed examples with the sense they illustrate; label examples awaiting that assignment. Do not infer sense assignments from spelling alone.


Affected entries: Ilin, Ya, Var, Ser, Thal, Ka, An, Nor, Esh, Morl, Terra, Dren, Shal, Krez, Thar, Vethor, Shara, Rathor, Shalor, Thaal, Lian, Lumor, Aen, Kal, Kalor, Seren, Vaar, Lorin, Rath, Fah, Reth, Aenor, Dral, Tal, Morldren, Lun, Kaleth, Krezor, Phelvin, Jorvak, Welrim, Xilvar, Xarvel, Belshara, Felorin, Zhelvek, Eshvelaneth, Lianor, Kel, Rethlian, Velmarin, Talaen, Shalaen, Drenkorath, Tenar, Lianeth, Thar-ka, Shen, Kor, Pral, Vok, Shan, Lianrethshen, Vaarshen, Keldoraen, Ruvan, Anvekaen, Thalvekaen, Jorvar, Njor, Sel, Thael, Shentalzhael, Em, Vrak, Im, Thalesh, Thalor, Vanesh, Kar, Jor, Bren, Xar, -en, -eth, nor-ka

## APP-04 — Some headwords have no example

Confirmed coverage gap · Coverage

These entries have no example returned by the app. That is a coverage gap, not proof that the words are wrong. Roots and affixes may need a labeled construction instead of a sentence.

Proposed action: Develop examples in reviewed batches; do not insert generated sentences automatically.


Affected entries: Kadon, Zhilva, Amthaen, Nekvar, Kelithor, Tlosen, Jexhaer, Revalen, Zharinor, Vrekthael, Vial, Aenvor, Sorl, Kalvar, Sharvar, Morlka, Terlin, Lorash, Norvaar, Terradren, Drenshal, Terraesh, Liana, Lorinen, Mmm, Vara, Thalka, Sera, Tek, Rathka, Lialor'ka, Reth‘thal, Lia‘ser, Lian'lia, Verka, Anen, Eshen, Velian, Rathorim, Fah'thar, Vel'rathor, Rathorimaen, Fah'tharaen, Ohm'rin, Thal'vok, Ohm'aen, Thal'vokaen, Shal'taleth, Bel'Rathorimeth, Aen'Moreth, Lorin'Ohmeth, Thal'talaen, Thal'taleth, Thar'taleth, Arthen'taleth, Kor'taleth, Varkareth, Drenkaesh, Tharfah, Krez-verin, Rathorkinash, Vethordrenka, Morl-karash, Verin, Nevar, Eth, Trak, Kav, Zhir, Khum, Tla, Lor, Vin, Nk, Nku, Mb, Rek, Rav, Thaen, Elor, Livar, Marin, Alor, Tarin, Soril, Tham, Lak, Kadren, Azan, Thee, Tha-, -al, -ath, -as, -ka, Kilv, Nk-, Mb-, Tla-, Zhae-, Nku-, Tl-, -in, -n, -or, -lin, Ver-, Li-, -esh, -el, -vel, Ten-, Hek-, Mel-, Fen-, Hek-Mel-, Shal-, Krez-, Dren-, Esh-, Lian-, Vok-, Rath-, Zharrel, Tharnspinners, Veilgliders, Velshen, Shavrek, Mossquill, Rynarth, Vroshan, Brinnek, Thravic, Fennlur, Vexflit, Grivol, Rethal, Lumora, Thryssal, Braskal, Selkari, Zhenlor, Zharak, Lorynth

## LANG-001 — Kavel is translated as while

Conflict or distinction evidenced in the app · Meaning / translation

Kavel means forgetfulness / memory gap / loss of awareness, not while. The same line also renders jor as changes, although the displayed verb is surge / burst forth.

Proposed action: Remove this from ordinary usage examples pending a replacement. Keep the approved Kavel memory-gap example; repair the environmental sentence separately.

- PE-EGE1-0019: jor eshnor; kavel rinaen eshweknor. — Weather changes, while climate endures.

## LANG-002 — Khumrel is treated as the verb listen

Conflict or distinction evidenced in the app · Meaning / translation

The approved Khumrel entry is the noun compassion / empathetic listening. This English gloss turns it into an infinitive. The source marks the phrase as a conceptual metaphor.

Proposed action: Label the old line as a historical metaphor note. Use the already-reviewed sentence below as ordinary usage.

- PE-S3-0019: Khumrel an thar — to listen to one's heart

## LANG-003 — Word becomes decree, and an is used to imply ownership

Conflict or distinction evidenced in the app · Meaning / translation

Kelka means a word or speech particle; Kalkel is decree. An means at/in, while titled possession uses possessor-ka.

Proposed action: Replace the phrase with the established decree word and the approved possession pattern. It remains a phrase, not a complete sentence.

- PE-S3-0022: kelka an Kalrin — a king's decree

## LANG-004 — Talaen is translated as find

Conflict or distinction evidenced in the app · Meaning / translation

Talaen is displayed as give/offer or take/receive. Find is not a displayed sense.

Proposed action: Decide whether to revise the English gloss or supply a different Celan phrase. Keep it out of ordinary sentence examples until resolved.

- PE-S3-0005: talaen an thal — find balance

## LANG-005 — Talaen is again translated as find

Conflict or distinction evidenced in the app · Meaning / translation

The same give/take verb is glossed as find connection. A metaphor may be intended, but it is not explained as one in the normal example presentation.

Proposed action: Explain the intended metaphor or replace the phrase with a reviewed example of the displayed meaning.

- PE-S3-0011: talaen an ohm — to find connection

## LANG-006 — The translation adds my without a my marker

Conflict or distinction evidenced in the app · Meaning / translation

The English says my desire, but there is no -ian. Thar-ka is an established desire headword; its ending should not be interpreted automatically as a possessive for I.

Proposed action: Review the intended possession. Either supply the approved personal possession construction or remove my from the English after checking the entire sentence.

- PE-S4B-0008: Ohmaen I an thar-ka. — I love my desire.

## LANG-007 — A literal analysis is presented as natural English

Conflict or distinction evidenced in the app · Meaning / translation

Is-in-essence Connection/Love with Us is an analytical gloss, not natural English.

Proposed action: Use the natural translation below and retain the literal gloss as a teaching note.

- PE-S4A-0005: Rinaen Ohm ser Ilin. — Is-in-essence Connection/Love with Us.

## SENSE-PE-EGE1-0018 — Jor uses a broader English meaning

Review needed · Meaning / translation

The app displays jor as surge / burst forth. This translation uses change. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0018: jor mahrwel nor eshnor. — The current surges during the weather change.

## SENSE-PE-EGE1-0045 — Jor uses a broader English meaning

Review needed · Meaning / translation

The app displays jor as surge / burst forth. This translation uses changes. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0045: jor ohmshal nor fel rinaen welnali. — The ecosystem changes when the population is small.

## SENSE-PE-EGE1-0049 — Jor uses a broader English meaning

Review needed · Meaning / translation

The app displays jor as surge / burst forth. This translation uses spreads. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0049: jor rathshannali an nalior; var nali var dumanali. — The invasive species spreads in the habitat; another species moves toward extinction.

## SENSE-PE-EGE1-0058 — Jor uses a broader English meaning

Review needed · Meaning / translation

The app displays jor as surge / burst forth. This translation uses changes. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0058: jor emilbel nor terramav an ohmshal. — The food web changes when environmental degradation affects the ecosystem.

## SENSE-PE-EGE1-0059 — Jor uses a broader English meaning

Review needed · Meaning / translation

The app displays jor as surge / burst forth. This translation uses spreads. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0059: rinaen terramav an verd; jor mavverd an sov. — Environmental degradation affects plant life; blight spreads through the field.

## SENSE-PE-EGE1-0062 — Jor uses a broader English meaning

Review needed · Meaning / translation

The app displays jor as surge / burst forth. This translation uses worsens. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0062: var welgorm shan drenfel; jor pelnor an terramahr. — Pollution moves through the stream; erosion worsens on the coast.

## SENSE-PE-EGE1-0063 — Jor uses a broader English meaning

Review needed · Meaning / translation

The app displays jor as surge / burst forth. This translation uses increases. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0063: pel pelnor nalior; jor xilnalior. — Erosion cuts the habitat; fragmentation increases.

## SENSE-PE-EGE1-0006 — Wel uses a broader English meaning

Review needed · Meaning / translation

The app displays wel as sharing / unity. This translation uses flows. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0006: wel dren shan shanmorl an selmor. — Water flows through the canyon into the plain.

## SENSE-PE-EGE1-0011 — Wel uses a broader English meaning

Review needed · Meaning / translation

The app displays wel as sharing / unity. This translation uses flows. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0011: wel dren thal velkmorl var terramahr. — Water flows from the glacier toward the coast.

## SENSE-PE-EGE1-0012 — Wel uses a broader English meaning

Review needed · Meaning / translation

The app displays wel as sharing / unity. This translation uses flows. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0012: wel drenfel var terramahr. — The stream flows toward the coast.

## SENSE-PE-EGE1-0013 — Wel uses a broader English meaning

Review needed · Meaning / translation

The app displays wel as sharing / unity. This translation uses flows. It may be an intended metaphor, but the sentence does not explain that extension.

Proposed action: Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.

- PE-EGE1-0013: wel drenfel an fellun. — The stream flows into the pond.

## FORM-PE-V1-0013 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V1-0013: Kadron-Azon — A man with both masculine and feminine qualities.

## FORM-PE-V1-0014 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V1-0014: Azron-Theon — A woman embodying neutrality and balance.

## FORM-PE-V3-0200 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0200: Ten-del — 20 (Two tens)

## FORM-PE-V3-0201 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0201: Ten-tren — 30 (Three tens)

## FORM-PE-V3-0202 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0202: Ten-quen — 40 (Four tens)

## FORM-PE-V3-0206 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0206: Hek-unar — 100 (One hundred)

## FORM-PE-V3-0207 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0207: Hek-quen — 400 (Four hundred)

## FORM-PE-V3-0209 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0209: Mel-unar — 1,000 (One thousand)

## FORM-PE-V3-0210 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0210: Mel-quen — 4,000 (Four thousand)

## FORM-PE-V3-0212 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0212: Fen-unar — 10,000 (Ten thousand)

## FORM-PE-V3-0213 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0213: Fen-peth — 50,000 (Fifty thousand)

## FORM-PE-V3-0214 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-V3-0214: Hek-Mel-unar — 100,000 (One hundred thousand)

## FORM-PE-S1-0003 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S1-0003: Vok + Thal -> Vokathar — A Harmonious Union

## FORM-PE-S1-0004 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S1-0004: Vok + Nor -> Voknor / Vokanor / Vokonor — The unity of time / a moment of perfect synchronicity

## FORM-PE-S1-0007 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S1-0007: Belshara — Duty

## TEACH-PE-S1-0009 — Teaching or incorrect example occupies an ordinary sentence slot

Confirmed placement · App presentation

The app labels this record, but still places it inside Used In A Sentence. A warning label does not make it a recommended example.

Proposed action: Move it to a separate Teaching notes / What not to write section.

- PE-S1-0009: Kalvok; Kalrath; Rethlian — Clan / Apex Predator / Might

## FORM-PE-S1-0010 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S1-0010: Belthal — Order

## FORM-PE-S1-0011 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S1-0011: Rethvok — Chaos

## FORM-PE-S3-0001 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0001: Fah tha-var — A darkness has occurred

## FORM-PE-S3-0002 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0002: pralaen an morl — written in stone

## FORM-PE-S3-0005 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0005: talaen an thal — find balance

## FORM-PE-S3-0006 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0006: ver thal — without balance

## FORM-PE-S3-0007 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0007: thar an rethvok — a heart of chaos

## FORM-PE-S3-0008 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0008: ka nor — without time

## FORM-PE-S3-0009 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0009: shalaen an rin — to see the essence

## FORM-PE-S3-0010 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0010: bel-esh — to be bound

## FORM-PE-S3-0011 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0011: talaen an ohm — to find connection

## FORM-PE-S3-0012 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0012: thar an kaleth — a strong heart / courage

## FORM-PE-S3-0013 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0013: thar an fah — a dark heart / despair

## FORM-PE-S3-0014 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0014: Var I an vaar — I go in peace / I am peaceful

## FORM-PE-S3-0015 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0015: Var an shara — to go on a path

## FORM-PE-S3-0016 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0016: Aen Dral — The Heavens Speak

## FORM-PE-S3-0017 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0017: Pralaen an shara — to make a path

## FORM-PE-S3-0018 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0018: Terrarav — the pull of one's homeland

## FORM-PE-S3-0019 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0019: Khumrel an thar — to listen to one's heart

## FORM-PE-S3-0020 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0020: zhirin an Arthen — threads of fate

## FORM-PE-S3-0021 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0021: zhirrathor — thread to the past

## FORM-PE-S3-0022 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S3-0022: kelka an Kalrin — a king's decree

## FORM-PE-S4B-0005 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S4B-0005: Terra / terra — Heart of Terra / mundane earth, soil, or ground

## FORM-PE-S4B-0007 — A phrase, word form, or teaching illustration is shown as a sentence

Confirmed source/display distinction · App presentation

This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.

Proposed action: Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.

- PE-S4B-0007: Rathor / rathor — The Past / a specific past event or memory

## LINK-kadron — Kadron: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V1-0013: Kadron-Azon — A man with both masculine and feminine qualities.

Affected entries: Kadron

## LINK-azron — Azron: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V1-0014: Azron-Theon — A woman embodying neutrality and balance.

Affected entries: Azron

## LINK-theon — Theon: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V1-0014: Azron-Theon — A woman embodying neutrality and balance.

Affected entries: Theon

## LINK-azon — Azon: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V1-0013: Kadron-Azon — A man with both masculine and feminine qualities.

Affected entries: Azon

## LINK-ka — Ka: distinguish direct usage from related forms

Confirmed conflict with ED-0038 · Example placement

The Ka entry means without/no. I-ka dren and Ilin-ka emil demonstrate possessive -ka, which your approved rule treats separately. Those phrases do not illustrate negative standalone ka.

Proposed action: Place the possessive phrases under -ka. Keep negative examples under Ka. Review ka-shen as a compound separately.

- PE-V1-0003: I-ka dren — “My water”
- PE-V1-0005: Ilin-ka emil — “Our meal”
- PE-V2-0050: Vanesh Ilin ka-shen lialor. — We trade via barter indeed.

Affected entries: Ka

## LINK-nor — Nor: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V1-0019: Nor-var I dren. — “I will go to the water.”
- PE-V1-0029: Rath Nor-var ser, Nor-var I dren. — “If the friend will go, I will go to the water.”

Affected entries: Nor

## LINK-thaal — Thaal: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-DR1-0003: thaal'ra var ser an Varthas. — I wonder if the friend is going to the city.
- PE-DR1-0004: thaal'ra rinaen dren an krezor. — I wonder if there is water at the hearth.

Affected entries: Thaal

## LINK-vaar — Vaar: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V3-0069: Vaar'kelaen I an shal. — I feel relief in the light.

Affected entries: Vaar

## LINK-li-seren — Li-Seren: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V3-0005: Li-Seren-en, var nor Varthas shenakar? — Honored guardian, do we proceed to the city's exchange now?

Affected entries: Li-Seren

## LINK-unar — Unar: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V3-0206: Hek-unar — 100 (One hundred)
- PE-V3-0209: Mel-unar — 1,000 (One thousand)
- PE-V3-0212: Fen-unar — 10,000 (Ten thousand)
- PE-V3-0214: Hek-Mel-unar — 100,000 (One hundred thousand)

Affected entries: Unar

## LINK-del — Del: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V3-0200: Ten-del — 20 (Two tens)
- PE-V3-0204: Ten-del peth — 25 (20 + 5)
- PE-V3-0216: Hek-quen Ven Hek-del — 400 - 200 = 200
- PE-V4-0084: Rinaen zhirin Ten-del korineth. — The rope is 20 handspans long.

Affected entries: Del

## LINK-tren — Tren: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V3-0201: Ten-tren — 30 (Three tens)

Affected entries: Tren

## LINK-quen — Quen: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V3-0202: Ten-quen — 40 (Four tens)
- PE-V3-0205: Ten-quen senar — 46 (40 + 6)
- PE-V3-0207: Hek-quen — 400 (Four hundred)
- PE-V3-0208: Hek-oven Ten-quen del — 842 (800 + 40 + 2)
- PE-V3-0210: Mel-quen — 4,000 (Four thousand)

Affected entries: Quen

## LINK-peth — Peth: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V3-0213: Fen-peth — 50,000 (Fifty thousand)
- PE-V3-0219: Mel-quen Ven Hek-peth — 4,000 - 500 = 3,500

Affected entries: Peth

## LINK-oven — Oven: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V3-0208: Hek-oven Ten-quen del — 842 (800 + 40 + 2)
- PE-V3-0211: Mel-quen Hek-sethe Ten-oven sethe — 4,787 (4,000 + 700 + 80 + 7)

Affected entries: Oven

## LINK-shen — Shen: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0050: Vanesh Ilin ka-shen lialor. — We trade via barter indeed.

Affected entries: Shen

## LINK-pral — Pral: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0017: Pralmor kal dren. — The carving strengthens with water.

Affected entries: Pral

## LINK-rin — Rin: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V4-0096: Theraen thar-ian an awek. Rinaen an-rin lian morlak kadreneth. — My heart longs for the spring. It feels like the truth of dry bread.

Affected entries: Rin

## LINK-bel — Bel: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0008: Belrin kal dren. — The woven fabric strengthens with water.
- PE-V2-0009: Nethaen belar an dren. — The binding spice rests by the water.

Affected entries: Bel

## LINK-veth — Veth: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V3-0067: Veth'tharaen Kadron nor lian ver. — The man feels shame for the untruth.

Affected entries: Veth

## LINK-jor — Jor: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0018: Shalilaen jorlin an shal. — The bursting water flows by the light.
- PE-V2-0019: Jorvak kal dren. — The warmth strengthens by the water.

Affected entries: Jor

## LINK-jek — Jek: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0020: Nethaen jekvor an dren. — The spiraling spice rests by the water.

Affected entries: Jek

## LINK-wek — Wek: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0025: Nethaen weknor an dren. — The cyclical time rests by the water.
- PE-CNE1-0064: rakel. va aen Ya wek'aen. — Pardon? Say it again.

Affected entries: Wek

## LINK-wor — Wor: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0026: Worvenak kal dren. — The abundant stew strengthens by the water.

Affected entries: Wor

## LINK-phel — Phel: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0013: Nethaen phelvin an dren. — The comforting drink rests by the water.

Affected entries: Phel

## LINK-prak — Prak: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0014: Prakorin shalil an dren. — The tender bread flows lightly by the water.

Affected entries: Prak

## LINK-bros — Bros: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0010: Brosrin vanesh dren. — The layered food trades by the water.

Affected entries: Bros

## LINK-bal — Bal: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0011: Balrin var dren. — The sprouting food grows by the water.

Affected entries: Bal

## LINK-bren — Bren: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0012: Brenmor kal dren. — The harvested roots strengthen by the water.

Affected entries: Bren

## LINK-jel — Jel: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0021: Jelvor vanesh dren. — The zesty spice trades by the water.

Affected entries: Jel

## LINK-wel — Wel: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0023: Welaen welrim ser dren ser Serin. — The feast is shared with friends and water.
- PE-V2-0024: Welmor vanesh dren. — The flowing earth trades by the water.

Affected entries: Wel

## LINK-xar — Xar: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0028: Nethaen xarvel an dren. — The covered meal rests by the water.

Affected entries: Xar

## LINK-xil — Xil: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0027: Nethaen xilvar an dren. — The hidden spice rests by the water.

Affected entries: Xil

## LINK-nor- — Nor-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0008: ka nor — without time

Affected entries: Nor-

## LINK-pel — Pel: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0015: Nethaen pelvar an dren. — The sharp grain rests by the water.
- PE-V2-0016: Shalilaen peldren morl shal. — The piercing water flows under the light.

Affected entries: Pel

## LINK-jin — Jin: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V2-0022: Nethaen jindral an dren. — The rare fruit rests by the water.

Affected entries: Jin

## LINK-rav- — Rav-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0018: Terrarav — the pull of one's homeland

Affected entries: Rav-

## LINK-ohm- — Ohm-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0011: talaen an ohm — to find connection
- PE-S4A-0003: Ohmaen I Ya. — I love you.
- PE-S4A-0005: Rinaen Ohm ser Ilin. — Is-in-essence Connection/Love with Us.

Affected entries: Ohm-

## LINK-khum- — Khum-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0019: Khumrel an thar — to listen to one's heart

Affected entries: Khum-

## LINK--en — -en: distinguish direct usage from related forms

Review needed · Example placement

These examples may demonstrate the suffix in a fused or inflected form. They need an explicit breakdown identifying the suffix and its function, rather than being offered without explanation.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- OVERRIDE-800077fbe9a1: Var Liorinen lianaen an shalor. — The Honored Elder goes to pray in the sanctuary.

Affected entries: -en

## LINK--aen — -aen: distinguish direct usage from related forms

Review needed · Example placement

These examples may demonstrate the suffix in a fused or inflected form. They need an explicit breakdown identifying the suffix and its function, rather than being offered without explanation.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- OVERRIDE-c0f3cb0d926e: Shalaen I vethral an verdor. — I see the pack hunter in the forest.
- OVERRIDE-5fa075482c2b: Pralaen I krezor. — I am making a hearth.
- OVERRIDE-15bcc5e60ea2: Velaen Ilin morlak. — We eat the bread.

Affected entries: -aen

## LINK--eth — -eth: distinguish direct usage from related forms

Review needed · Example placement

These examples may demonstrate the suffix in a fused or inflected form. They need an explicit breakdown identifying the suffix and its function, rather than being offered without explanation.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- OVERRIDE-53c78d5c8fab: Rinaen drenvor woreth. — The bowl is full.
- OVERRIDE-9f4c89568e03: Rinaen krezor feneth. — The hearth is hot.
- OVERRIDE-5b1c1f0c2761: Rinaen shena shaleth. — The coin is gold.

Affected entries: -eth

## LINK-nor-ka — nor-ka: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-V4-0008: Pralaen an Azron an belkor. — The woman makes the tunic.

Affected entries: nor-ka

## LINK-morl- — Morl-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0002: pralaen an morl — written in stone

Affected entries: Morl-

## LINK-terra- / terra- — terra- / Terra-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0003: Moraen I an terra. — I stand on the ground.
- PE-S3-0004: Ver ohmaen Mechuma lian Thal Terra. — Mechuma does not honor the truth of the Balance of Terra.
- PE-S3-0018: Terrarav — the pull of one's homeland
- PE-S4A-0002: Rinaen Terra vaar. — The Earth is peaceful / Peace exists on Earth.
- PE-S4B-0005: Terra / terra — Heart of Terra / mundane earth, soil, or ground

Affected entries: terra- / Terra-

## LINK-thal- — Thal-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0005: talaen an thal — find balance
- PE-S3-0006: ver thal — without balance

Affected entries: Thal-

## LINK-reth- / rethvok- — Reth- / Rethvok-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0006: ver thal — without balance
- PE-S3-0007: thar an rethvok — a heart of chaos

Affected entries: Reth- / Rethvok-

## LINK-rin- — Rin-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0009: shalaen an rin — to see the essence

Affected entries: Rin-

## LINK-kal- — Kal-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0022: kelka an Kalrin — a king's decree

Affected entries: Kal-

## LINK-shara- — Shara-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0015: Var an shara — to go on a path
- PE-S3-0017: Pralaen an shara — to make a path

Affected entries: Shara-

## LINK-thar- — Thar-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0012: thar an kaleth — a strong heart / courage
- PE-S3-0013: thar an fah — a dark heart / despair

Affected entries: Thar-

## LINK-var- — Var-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0014: Var I an vaar — I go in peace / I am peaceful
- PE-S3-0015: Var an shara — to go on a path
- PE-S4A-0001: Var Kadron an morl. — The Man goes to the mountain.

Affected entries: Var-

## LINK-aen- — Aen-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0016: Aen Dral — The Heavens Speak

Affected entries: Aen-

## LINK-pralaen- — Pralaen-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0017: Pralaen an shara — to make a path

Affected entries: Pralaen-

## LINK-ser- — Ser-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S4A-0004: Seraen I an Nys'aleth. — I believe in balance.
- PE-S4A-0005: Rinaen Ohm ser Ilin. — Is-in-essence Connection/Love with Us.

Affected entries: Ser-

## LINK-zhir- — Zhir-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0020: zhirin an Arthen — threads of fate
- PE-S3-0021: zhirrathor — thread to the past

Affected entries: Zhir-

## LINK-kel- — Kel-: distinguish direct usage from related forms

Review needed · Example placement

The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes. This is a root-related entry, so a labeled derivative demonstration may be appropriate.

Proposed action: Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.

- PE-S3-0022: kelka an Kalrin — a king's decree

Affected entries: Kel-

## DUP-PE-V1-0001 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-V1-0001: Var I dren. — “I go to the water.”
- PE-V1-0017: Var I dren. — “I go to the water.”

## DUP-PE-V4-0016 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-V4-0016: Nethaen Azron an nethor. — The woman sits on the chair.
- PE-V4-0060: Nethaen Azron an nethor. — The woman sits on the chair.

## DUP-PE-V4-0022 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-V4-0022: Rinaen drenvor woreth. — The bowl is full.
- PE-V4-0031: Rinaen drenvor woreth. — The bowl is full.

## DUP-PE-V4-0023 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-V4-0023: Rinaen krezor feneth. — The hearth is hot.
- PE-V4-0036: Rinaen krezor feneth. — The hearth is hot.

## DUP-PE-V4-0035 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-V4-0035: Var vethral joreth. — The pack hunter goes fast.
- PE-V4-0064: Var vethral joreth. — The pack hunter goes fast.

## DUP-PE-DSL1-0004 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-DSL1-0004: drentalaen I dren an krezvek. — I pour water into the cooking pot.
- PE-DSL1-0057: drentalaen I dren an krezvek. — I pour water into the cooking pot.

## DUP-PE-DSL1-0006 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-DSL1-0006: pelvaraen I krezpral. — I scrape the pan.
- PE-DSL1-0051: pelvaraen I krezpral. — I scrape the pan.

## DUP-PE-PFM1-0045 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-PFM1-0045: kasharaen sharavok lianrethor. — The caravan avoids the anomaly zone.
- PE-PFM1-0077: kasharaen sharavok lianrethor. — The caravan avoids the anomaly zone.

## DUP-PE-PFM1-0055 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-PFM1-0055: keldoraen seren lianrethxar. — The guardian marks the anomaly boundary.
- PE-PFM1-0075: keldoraen seren lianrethxar. — The guardian marks the anomaly boundary.

## DUP-PE-FAP1-0007 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-FAP1-0007: balpralaen I verdsov. — I cultivate the garden.
- PE-FAP1-0016: balpralaen I verdsov. — I cultivate the garden.

## DUP-PE-TVO1-0030 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-TVO1-0030: ravvekaen mahrvek mahrpral. — The ship tows the raft.
- PE-TVO1-0058: ravvekaen mahrvek mahrpral. — The ship tows the raft.

## DUP-PE-TVO1-0040 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-TVO1-0040: eshvaraen eshlorral eshvek. — The pilot flies the aircraft.
- PE-TVO1-0067: eshvaraen eshlorral eshvek. — The pilot flies the aircraft.

## DUP-PE-GCI1-0005 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-GCI1-0005: lorbelaen khumkel felbelor. — The council governs the district.
- PE-GCI1-0046: lorbelaen khumkel felbelor. — The council governs the district.

## DUP-PE-DW1-0010 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-DW1-0010: arth arthkal seren thal ravjorvek. — The shield protects the guardian from the arrow.
- PE-DW1-0011: arth arthkal seren thal ravjorvek. — The shield protects the guardian from the arrow.

## DUP-PE-DW1-0012 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-DW1-0012: arth arthkal varvek thal ngarzhel. — The shield protects the vehicle from the energy weapon.
- PE-DW1-0016: arth arthkal varvek thal ngarzhel. — The shield protects the vehicle from the energy weapon.

## DUP-PE-DW1-0013 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-DW1-0013: rinaen ngarjor ka ngarvek. — The firearm is without ammunition.
- PE-DW1-0018: rinaen ngarjor ka ngarvek. — The firearm is without ammunition.

## DUP-PE-PSAC1-0008 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-PSAC1-0008: sharaen thaelral thael aennor. — The dancer follows the rhythm of the music.
- PE-PSAC1-0025: sharaen thaelral thael aennor. — The dancer follows the rhythm of the music.

## DUP-PE-PSAC1-0012 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-PSAC1-0012: aenthaelaen welaenthael servok. — The chorus sings together.
- PE-PSAC1-0015: aenthaelaen welaenthael servok. — The chorus sings together.

## DUP-PE-PSAC1-0033 — The same bilingual example is stored more than once

Confirmed duplicate data · Duplicate records

The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.

Proposed action: Keep source records and provenance; give the app one canonical example identity with all source references.

- PE-PSAC1-0033: pralaen rinpralral rinpral. — The artist makes art.
- PE-PSAC1-0035: pralaen rinpralral rinpral. — The artist makes art.

## VAR-PE-V1-0002 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-V1-0002: Ra var ser? — "Where does the friend go?"
- PE-V1-0025: Ra var ser? — “Where does the friend go?”

## VAR-PE-V1-0027 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-V1-0027: Va var dren! — “Go to the water!”
- PE-V3-0006: Va var dren! — Go to the water!

## VAR-PE-V1-0037 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-V1-0037: Var I esh dren. — I go above the water.
- PE-V1-0044: Var I esh dren. — “I go above the water.”

## VAR-PE-V1-0038 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-V1-0038: Var I morl dren. — I go under the water.
- PE-V1-0045: Var I morl dren. — “I go under the water.”

## VAR-PE-V2-0028 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-V2-0028: Nethaen xarvel an dren. — The covered meal rests by the water.
- PE-V2-0061: Nethaen xarvel an dren. — The veiled meal rests by the water.

## VAR-PE-NE1-0005 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-NE1-0005: arth droral drobel. — The water keeper protects the waterworks.
- PE-NE1-0008: arth droral drobel. — The water keeper protects the water-distribution system.

## VAR-PE-NE1-0034 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-NE1-0034: tal zhaelral fennilphel an ser. — The healer gives an herbal remedy to the friend.
- PE-NE1-0040: tal zhaelral fennilphel an ser. — The healer gives the herbal remedy to the friend.

## VAR-PE-TM1-0007 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-TM1-0007: zhaelpralaen mekral kormek. — The mechanic repairs the engine.
- PE-TM1-0052: zhaelpralaen mekral kormek. — The mechanic repairs the motor.

## VAR-PE-TVO1-0005 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-TVO1-0005: vekaen morvek vekmor. — The wagon carries the cargo.
- PE-TVO1-0061: vekaen morvek vekmor. — The wagon carries cargo.

## VAR-PE-BSPI1-0020 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-BSPI1-0020: var ndavivek an ndavior. — The elevator moves to the storey.
- PE-BSPI1-0058: var ndavivek an ndavior. — The elevator moves to the building level.

## VAR-PE-GCI1-0011 — The same Celan sentence has different English versions

Confirmed wording variation; not automatically an error · Translation variants

These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.

Proposed action: Review the variants, select a preferred display translation, and preserve valid alternatives as notes.

- PE-GCI1-0011: aen kalrin kalkel. — The sovereign speaks a decree.
- PE-GCI1-0023: aen kalrin kalkel. — The ruler issues a decree.
