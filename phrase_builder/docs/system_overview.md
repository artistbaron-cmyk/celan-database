# System Overview

The Phrase Builder support layer exists because a dictionary and grammar guide, by themselves, do not automatically produce good phrases.

Celan phrase work needs more than word lookup. It needs examples, concept structure, testing, and clear rules about form. This folder tree is where that support is being built.

## The current parts

### `phrasebank/phrasebank.csv`

This is the phrase shelf.

It holds known phrases and phrase-like material in a structured form so we can see how Celan already handles things like blessings, requests, longing, questions, and boundaries.

Its job is not to be a copy machine. Its job is to give the future builder real phrase material to learn from.

### `evaluation/evaluation_set.csv`

This is the test bench.

It holds prompts we care about and the target answers we would want the system to reach. Without this file, it becomes too easy to confuse "different" with "better."

### `concepts/`

This is the meaning layer.

It holds the larger conceptual fields that keep showing up across the language, such as:

- world and element
- truth, balance, and order
- heart, desire, and longing
- action and movement
- relation, connection, and belonging

Its job is to help future phrase work understand meaning neighborhoods instead of treating every request as isolated vocabulary.

### `retrieval/`

This is the lookup-prep layer.

It does not do much yet, but this is where prepared support materials should live if the phrase side later needs compact snippets, grouped references, or smaller context packs to look at before answering.

### `docs/`

This is the explanation layer for humans.

It exists so the support system stays understandable and does not turn into a pile of mysterious helper files.

### `output/`

This is where polished artifacts go.

If we generate a PDF, a preview, or some other finished support artifact, it should land here instead of getting mixed into the working source files.

## The current split

Right now the project has two different jobs happening side by side.

### 1. The canon-facing core

This is the part people can already use:

- dictionary
- grammar guide
- cultural voice guide

### 2. The Phrase Builder support layer

This is the backstage preparation:

- phrasebank
- evaluation
- concepts
- working grammar source
- support docs

The first side already teaches the language.

The second side is there to make sure future phrase work is not forced to guess from loose words and half-remembered patterns.
