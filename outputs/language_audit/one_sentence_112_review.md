# First sentence for each zero-sentence meaning — review

**Historical snapshot from before the 2026-10-03 settlement.** The current review sheet is [109 meanings](one_sentence_109_for_review.md). The older 112 rows below are preserved so the decisions and original gaps remain traceable.

The [review sheet](one_sentence_112.csv) accounts for **all 112 visible meanings** whose word pages currently have no ordinary sentence. Each row has the exact meaning ID, one proposed Celan sentence and English translation when a responsible candidate is available, a label showing whether the sentence is ordinary usage or a word-building illustration, and its review status. This is a **proposal file**; the app and exports have not been changed.

**Current result:** 108 rows have candidate sentences. Four are intentionally blank because an example would otherwise pretend an unexplained word type or unconfirmed root/ending is established. Three of the 108 (*Anen*, *Velian*, and the first *Eth* meaning) are conditional drafts that must not be published until their grammar status is resolved. The [coverage check](check_one_sentence_112.py) confirms all 112 IDs are present once and that each Celan candidate has an English translation. That check does not judge language accuracy.

## What counts as an illustration

The user approved showing a sentence with a formed word for roots and endings. For example, *drenaen I dren* (“I drink water”) illustrates the root **Dren-** through the formed verb *drenaen*. Such a sentence should appear as a **word-building illustration** on the root page. It should not be labeled as direct use of the standalone root or as proof that every similar-looking word belongs to its family.

## Four entries needing a decision before a sentence can be supplied

| Entry and current meaning | Why a sentence is withheld | Recommended decision |
| --- | --- | --- |
| **Im**, particle meaning — “Device / Instrument / Internal mechanism” | The same word has a noun meaning; no grammar explains how it functions as a particle. A sentence with a device noun would demonstrate the noun, not the particle. | Define the particle's position and contribution, or remove/retitle the particle label if it duplicates the noun. |
| **Tl-** — “Movement, flow” | The app's phrase builder mentions *Tlenav* as evidence, and an older root chart also names *Tlekhamin*. Neither is a confirmed dictionary headword or an approved ordinary sentence. Similar-looking *Tla* words are a separate family. | Confirm a formed word and its meaning for current use, or mark this root as historical. |
| **-el** — “Beloved bound to them” | The app's phrase builder mentions *Ohmbaen-el* as evidence. An older possession chart gives the same form, but flags the rule for human review. No approved ordinary sentence demonstrates it. | Confirm the form and attachment rule for current use, or mark this ending as historical. |
| **-vel** — “Bread shared among us” | An older possession chart gives *Morlak-vel* but flags the rule for human review. It is not a confirmed dictionary headword or an approved ordinary sentence. | Confirm the form and attachment rule for current use, or mark this ending as historical. |

**Three conditional drafts:** The app already shows `anen morlak` (“your bread”) and `velian morlak` (“our bread”) as phrases. The review sheet extends each phrase into a location sentence, but the grammar also teaches `-ya`, `Ya-ka`, and `Ilin-ka` possession; it does not explain the scope of *Anen* or *Velian*. Likewise, `rinaen kalmek kaleth` is a valid example of the approved *-eth* quality suffix, but it cannot count for the separate **Eth** entry until the relationship between **Eth** and **-eth** is settled.

## Candidates that need extra care

- **Tharnspinners** and **Veilgliders:** each has a candidate sentence, but their species names end in an English-looking `-s`. Decide whether each is a singular Celan species name before using singular English translations.
- **Zhae-:** *zhaeaen* means empathize and fits the root's theme, but the app family data does not explicitly link the form to this chart root. The sentence is a lead, not a confirmed derivation.
- **-esh:** *thalesh* is explicitly segmented with *-esh*, but its current ritual meaning does not by itself demonstrate the entry's “deep relational ties” wording. Check the semantic link before counting it.
- **-en** and **Li-:** each has two near-overlapping visible meanings. The same illustration can show the form, but it cannot establish a distinction between those meanings.
- **Terra-/terra-** and **Reth-/Rethvok-:** each combines more than one idea in one entry. The candidate illustrates only the lowercase ground sense or the *Rethvok* chaos side, respectively.
- **Nk/Nk-** and **-lin:** their candidates show a linked word but not the full range claimed by the root or suffix meaning. Keep them labeled as illustrations, not rule proofs.

## Placement before publication

The ordinary candidates can be reviewed for direct placement under their exact meanings. Construction candidates belong in a labeled word-building section, with their formed word identified. Earlier approved decisions require example additions in reviewed batches. No candidate in this file was automatically inserted into the student app.
