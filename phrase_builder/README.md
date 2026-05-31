# Phrase Builder Layer

This folder holds the prepared materials for the Phrase Builder side of the Celan app.

The main dictionary and grammar guide remain the canon-facing core of the project. This folder exists to support phrase-level work: how a user might ask for a sentence, how Celan might answer it, and how we test whether that answer feels true to the language.

## What lives here

- `phrasebank/phrasebank.csv`
  - A curated phrasebook layer.
  - Stores English prompts, Celan phrasing, literal sense, tone, cultural voice, and source support.
  - This is not a replacement for the canon. It is a canon-grounded phrase layer.

- `evaluation/evaluation_set.csv`
  - A test set for the Phrase Builder.
  - Stores prompts we care about, target Celan answers, and the reason each prompt matters.
  - This file helps us measure whether the builder is actually improving.

- `concepts/`
  - Reserved for future concept maps, meaning families, or intent groupings.

- `retrieval/`
  - Reserved for future extraction notes or prepared support material the builder may use.

- `docs/`
  - Supporting notes, conventions, workflow, and system explanations for the Phrase Builder layer.

## Core working principle

If it is here, it is canon.

The main question is not whether something is legitimate enough to exist.
The real question is whether it is expressed in proper Celan form.

That means this layer is mainly concerned with:

- phrase shaping
- sentence movement
- English-to-Celan meaning transfer
- cultural voice
- testing whether phrasing actually feels like Celan

## Current purpose

Right now this folder is a foundation.

It gives us:

- a phrasebank to ground future phrase work
- an evaluation set to test future builder behavior
- a clean place to grow the Phrase Builder without disturbing the canon source files
