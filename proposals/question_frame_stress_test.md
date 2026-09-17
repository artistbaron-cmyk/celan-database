# Celan Question Frame Stress Test

**Status:** Exploratory grammar test — nothing in this file is canon  
**Date:** 2026-09-17  
**Question under test:** Can content questions use the frame `ra ... answer-category?` while reusing `rin`, `mor`, `or`, `nor`, `zhir`, and `shara` as the final answer-category cues?

## Why test the frame

The Question Frame has an attractive Celan rhythm:

```text
ra + event and participants + kind of answer sought
```

It preserves the established sentence-opening `ra`, allows the action to arrive early, and closes by telling the listener whether the speaker seeks a person, thing, place, time, cause, or method.

The concern is lexical collision. Except for bound `-or`, every proposed tail already has an ordinary Celan life:

| Tail | Ordinary Celan field | Proposed question use |
|---|---|---|
| `rin` | essence, inner spirit, true self | who? |
| `mor` | matter, physical substance, grounding | what? |
| `or` | bound place/domain suffix | where? |
| `nor` | time; at/in a time; future marking in `nor-` | when? |
| `zhir` | lineage, thread, continuity through time | why? |
| `shara` | path, route, journey, life-direction | how? |

The test therefore asks two different questions:

1. Does the frame sound usable when the tail cannot be mistaken for an ordinary clause element?
2. Does the frame remain unambiguous when the same form appears normally inside the sentence or at its end?

## Proposed bare frame

```text
ra [ordinary Celan clause] [answer-category root]?
```

The opening `ra` marks the utterance as a question. The unmarked final root identifies what kind of information is missing.

## Pass 1: short favorable examples

These examples give the frame its best conditions. The tail does not have a strong competing ordinary reading in the immediate sentence.

| Intended question | Experimental Celan | Initial result |
|---|---|---|
| Who goes to the city? | `ra var an Varthas rin?` | Understandable once the frame has been taught. |
| What does the healer examine? | `ra keshenaen zhaelral mor?` | Understandable as “what,” but `mor` can also be the literal object “matter.” |
| Where does the friend go? | `ra var ser or?` | The cleanest member because standalone `or` does not currently function as an ordinary noun. |
| When does the caravan leave? | `ra thalshanaen sharavok nor?` | Understandable, but the temporal reading of ordinary `nor` is already nearby. |
| Why does the keeper preserve the record? | `ra kav kavral kavdava zhir?` | Recoverable if final `zhir` is known as a question tail. |
| How does the mechanic repair the machine? | `ra zhaelpralaen mekral kalmek shara?` | Recoverable, though ordinary “path/route” remains possible. |

**Short-form finding:** the cadence works. `ra` opens the request, the verb still arrives early, and the final element creates a satisfying spoken closure. This explains the appeal of the system.

## Pass 2: exact collision tests

The following strings support two legitimate readings without changing any word. Punctuation and spelling cannot tell the reader which one was intended.

### `mor`

```text
ra kes Ya mor?
```

- Yes/no reading: **Do you notice the matter/material?**
- content-question reading: **What do you notice?**

### `nor`

```text
ra var ser nor?
```

- Yes/no reading: **Does the friend go at that time?**
- content-question reading: **When does the friend go?**

### `zhir`

```text
ra kav kavral zhir?
```

- Yes/no reading: **Does the keeper preserve the lineage/thread?**
- content-question reading: **Why does the keeper preserve it?**

### `shara`

```text
ra lorin sharalorin shara?
```

- Yes/no reading: **Does the navigator guide the route?**
- content-question reading: **How does the navigator guide?**

### `rin`

```text
ra kes arural rin?
```

- Yes/no reading: **Does the practitioner perceive the essence/spirit?**
- content-question reading: **Whom does the practitioner perceive?**

**Collision finding:** five of the six tails can create an exact ambiguity. This is not an edge case caused only by elaborate prose. It occurs in short ordinary clauses.

`or` avoids the same direct collision only because it is currently bound as a place/domain suffix. Making it a free-standing question tail would itself be a new grammatical use.

## Pass 3: longer sentences containing the same semantic roots

Long sentences do not necessarily become impossible, but they expose repetition, delayed interpretation, and the need to reinterpret the last word after hearing the whole clause.

### Asking when while discussing time

```text
ra var sharavok an Varthas nor Lunwek nor?
```

Intended: **When does the caravan go to the city during the lunar month?**

The first `nor` is the ordinary temporal preposition. The second is supposed to mean “when?” A listener must wait until the final position to decide that the repeated word has changed grammatical function.

### Asking why while discussing lineage

```text
ra kav kavral zhir an liankavor nor Norreth zhir?
```

Intended: **Why does the keeper preserve the lineage in the archive during temporal instability?**

The first `zhir` is the object being preserved. The second is the proposed “why?” tail. The sentence is recoverable after instruction, but `zhir ... zhir` feels like repetition rather than a naturally distinct interrogative form.

### Asking how while discussing a route

```text
ra doraen sharalorin sharashen an shara shara?
```

Intended: **How does the navigator place the map on the route?**

The ordinary route `shara` is immediately followed by interrogative `shara`. The result is pronounceable but poorly differentiated in speech: `shara shara?`

### Asking what about material

```text
ra keshenaen mekral mor an kalmek ser kesmek mor?
```

Intended: **What material does the mechanic examine in the machine with the sensor?**

This example exposes a deeper issue. If the sought answer is itself a material, ordinary `mor` belongs naturally inside the clause as its semantic category. The final unmarked `mor` does not clearly tell the listener whether it is the missing object, a broad category label, or an interrogative tail.

### Asking who while discussing essence

```text
ra kes arural rin an vorkor nor rethkal rin?
```

Intended: **Whom does the practitioner perceive at the gate during unstable power?**

If `rin` also names the essence being perceived, the final `rin` can be heard either as an ordinary object or as the human/agentive answer category. The frame provides no visible distinction.

## Pass 4: embedded and multi-clause questions

Celan does not yet have a fully approved system for every embedded-question pattern, but complex speech still needs to distinguish the main question from information inside subordinate or conditional material.

Consider:

```text
ra aen kavral kora kav la zhir nor Norreth zhir?
```

Intended: **Why does the keeper say that they preserved the lineage during temporal instability?**

The listener hears ordinary causal `kora`, object `zhir`, temporal `nor`, and final interrogative `zhir`. The final position eventually makes the intended question recoverable, but only after several related causal and temporal forms compete for interpretation.

The Question Frame is therefore strongest in short oral exchanges and weakest in testimony, instructions, technical reporting, law, medical questioning, and any sentence where accuracy must survive noise or transcription.

## Result for the unmarked-root frame

The bare system:

```text
ra ... rin/mor/or/nor/zhir/shara?
```

**does not pass as a complete general solution.**

Its rhythm is good. Its semantic categories are memorable. Its failure is that the tail has no grammatical marking separating “ordinary root used normally” from “root naming the answer being requested.” Context frequently helps, but exact double readings remain possible.

This does not mean the Question Frame itself should be abandoned. It means the frame needs an unmistakable closing signal.

## Repair A: marked semantic tails

One repair would retain the familiar semantic roots but mark their interrogative use with a dedicated closing clitic.

For illustration only, an unapproved reduced relative of `ra`, written here as **`-re`**, produces:

| Meaning | Experimental marked tail |
|---|---|
| who? | `rin-re` |
| what? | `mor-re` |
| where? | `or-re` |
| when? | `nor-re` |
| why? | `zhir-re` |
| how? | `shara-re` |

Examples:

```text
ra kes Ya mor-re?
ra var sharavok an Varthas nor Lunwek nor-re?
ra kav kavral zhir an liankavor nor Norreth zhir-re?
ra doraen sharalorin sharashen an shara shara-re?
```

Now `mor` and `mor-re`, `nor` and `nor-re`, `zhir` and `zhir-re`, and `shara` and `shara-re` are audibly and visibly different.

### Strengths

- preserves the opening-and-closing Question Frame;
- retains the conceptual families the creator liked;
- resolves exact collisions;
- uses one productive marking rule rather than six unrelated derivations;
- provides redundancy useful in noise: the listener hears both the opening question signal and the requested answer class.

### Costs

- introduces a new bound grammatical marker;
- creates double question marking, although natural languages often tolerate or prefer redundant marking;
- requires a historical and phonological decision explaining why closing `-re` is related to opening `ra`;
- produces mixed cadence quality: `mor-re` and `nor-re` flow well, while `or-re` and `shara-re` need spoken testing.

`-re` is a test symbol, not a recommendation or approved morpheme.

## Repair B: dedicated question-tail particles

The frame can instead use six short grammatical particles that do not double as ordinary roots:

```text
ra [clause] [WHO-tail / WHAT-tail / WHERE-tail / WHEN-tail / WHY-tail / HOW-tail]?
```

These particles could have opaque Day One histories, or distant historical relationships to `rin`, `mor`, `or`, `nor`, `zhir`, and `shara` without remaining identical to them.

### Strengths

- strongest protection against lexical collision;
- keeps the exact question rhythm the creator likes;
- permits short, high-frequency forms shaped for rapid speech;
- allows historical irregularity and contact-language depth.

### Costs

- requires creating and learning six grammatical forms;
- risks feeling arbitrary if the sounds are selected without a credible contact history;
- gives up some immediate transparency.

This is the best version if the Question Frame itself matters more than visible root reuse.

## Repair C: fixed front analytical cues

As a control, the semantic root can appear immediately after opening `ra`:

```text
ra mor kes Ya?
ra nor var sharavok an Varthas nor Lunwek?
ra zhir kav kavral zhir an liankavor nor Norreth?
ra shara doraen sharalorin sharashen an shara?
```

The first position after `ra` marks the root as interrogative; later appearances retain ordinary meanings.

### Strengths

- resolves the collision without creating a new morpheme;
- makes the requested answer category known before a long clause begins;
- remains transparent and highly reliable in writing or noise.

### Costs

- loses the closing rhythm of the Question Frame;
- delays the verb behind two framing elements;
- can feel more deliberately engineered than a historical set of question particles.

## Comparative judgment

| System | Short speech | Long speech | Collision resistance | New material required | Preserves Question Frame |
|---|---:|---:|---:|---:|---:|
| Bare roots at tail | Strong | Weak | Poor | None | Yes |
| Marked semantic tails | Strong | Strong | Strong | One new clitic | Yes |
| Dedicated tail particles | Strong | Strong | Very strong | Six short forms | Yes |
| Fixed front analytical cues | Strong | Very strong | Strong | None | No |

## Recommendation from the test

Keep the **Question Frame as a serious design direction**, but do not approve bare `rin`, `mor`, `nor`, `zhir`, and `shara` as unmarked question tails.

The next creative pass should compare:

1. **marked semantic tails**, preserving recognizable Celan ancestry through one closing marker; and
2. **dedicated historical tail particles**, preserving the frame while allowing question words to become a small irregular grammatical family.

The test should prioritize sound and sentence rhythm rather than deciding in advance that visible root reuse is superior. The original root family may remain part of the historical explanation even if living question tails have shortened or changed enough to avoid collision.

Regardless of the eventual system, the source-witness example `ra var ser?` cannot remain the app-facing model for “Where does the friend go?” because no current element in that sentence identifies place as the information sought.
