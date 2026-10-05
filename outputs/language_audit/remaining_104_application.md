# Application of the 104-meaning review — 2026-10-05

The creator requested the whole Dictionary App update after reviewing the batch. The current app files are the source of truth. The [104-row review](remaining_104_meanings_review.csv) remains an evidence snapshot from before this update; it was not overwritten.

## Changes applied

- Moved the relational `-esh` suffix off the standalone sky/air **Esh** page. **Kalvokesh** now links to the separate `-esh` family. Its earlier sentence wording is preserved in [the original-example archive](kalvokesh_original_example.csv); the current sentence has verb-first order and appears consistently under all five prior headwords and as a related form under `-esh`.
- Kept **Lianeth** as the ability word and **-aen** as the verb-forming ending. Removed the duplicate ability meaning from **Lian** and the duplicate suffix meaning from **Aen**.
- Kept **Vaar** as the peace noun and added the already approved **Vaar'a!** relief exclamation as its own dictionary entry. The Vaar page links readers to it.
- Kept **Thalor** as “outside; not within something.” Removed the conflicting “exterior / outer place” noun meaning and clarified that the word does not name a separate place.
- Combined the duplicate honorific meanings of **-en** and **Li-**, while preserving the distinct bonded-partner meaning of `-en`.
- Kept the approved waterway distinction: **Dren** water, **Dro** river/waterway in geographical use, **Drenfel** stream/brook. The earlier Dren river sense is archived in [the river record](river_scope_retired_sense.csv).

The exact seven other retired meaning rows and reasons are in [the retired-sense archive](remaining_104_retired_senses.csv). No old meaning was silently deleted from the review history.

## Examples added to the student app

These are **new editorial examples**, written for this update with the currently approved meanings and vocabulary. They are visible in the app but are **not labeled as individually creator-reviewed**. This record separates their provenance from earlier creator-approved sentences. Their links indicate the intended meaning; the automated checks validate placement and data integrity, not linguistic truth.

| ID | Meaning shown | Celan | English |
| --- | --- | --- | --- |
| PE-AUD104-0001 | Dren, symbolic water | `shalil dren an thar-ian.` | Water flows gently in my heart. |
| PE-AUD104-0002 | Aen, Breath of Life | `rinaen Aen an shalrin.` | The Breath of Life is in the living being. |
| PE-AUD104-0003 | Aenor, ear | `rinaen aiv an aenor-ian.` | My ear hurts. |
| PE-AUD104-0004 | Morldren, waterfall | `kes I morldren an morl.` | I notice the waterfall on the mountain. |
| PE-AUD104-0005 | Kel, informal talk | `kel ser.` | The friend talks. |
| PE-AUD104-0006 | Thar-ka, desire as noun | `rinaen thar-ka an thar-ian.` | There is desire in my heart. |
| PE-AUD104-0007 | Vok, betray as verb | `vok ser I.` | The friend betrays me. |
| PE-AUD104-0008 | Thalesh, perform a balance rite | `thalesh ser an shalor.` | The friend performs a balance rite at the sanctuary. |
| PE-AUD104-0009 | Vanesh, commerce as noun | `rinaen vanesh an Varthas.` | There is commerce in the city. |
| PE-AUD104-0010 | Kar, mechanical force as noun | `rinaen kar an kareth.` | There is force in the hammer. |
| PE-AUD104-0011 | Krez, frustration interjection | `Krez! ver var I.` | Blast! I am not going. |
| PE-AUD104-0012 | Fah, frustration interjection | `Fah! va ver aen Ya!` | Ugh! Do not speak! |
| PE-AUD104-0013 | Dral, heavens interjection | `Dral!` | Heavens! |
| PE-AUD104-0014 | Vaar'a!, relief interjection | `Vaar'a!` | Phew! |

The interjection-only examples are marked as phrases, not ordinary sentences. The **Kalvokesh** example retains its earlier `PE-V3-0046` ID because it is an edit to an existing example, not a new one. Its additional `-esh` placement is a related-word illustration.

## Deliberate holds and limits

- **Felorin** “berry from coral reefs,” **Kor** as a handspan, **Pral** as a bare “make” verb, and **Thael** as an adjective still lack a suitable direct model. Earlier decisions kept these meanings unlinked pending real evidence; this update did not invent a use just to satisfy a count.
- Formed-word illustrations for roots and endings remain related examples. They should not be counted as ordinary sentences proving every possible meaning of the root.
- The remaining broader sentence-accuracy audit is open. The app build and export checks cannot certify that every older Celan/English pair has the right meaning.
- **Velmarin** and **Drenkorath** still have open word-origin questions in [the findings list](findings.md); their established meanings were not reopened.

## Technical checks

Rebuilt `embedded_data.js` and the spreadsheet export from the app-owned content files. The app-data check verifies unique IDs, links, example positions, family links, offline bundle parity, and export sense coverage. The edit-and-rebuild check verifies that changes to meaning, pronunciation, example, origin, search, preview, and export reach the rendered data. Structural coverage was recalculated separately; its counts are not linguistic judgments.

The live browser view was not checked in this pass: the local preview server was stopped, and this session could not start a local server. The source-to-app and export checks above passed; visual placement in a running browser remains unchecked.
