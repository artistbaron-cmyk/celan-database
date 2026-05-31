# Missing Core Words Audit

Purpose: identify high-frequency Celan forms that behave like core dictionary words in examples but do not currently appear as standalone searchable headwords in the dictionary layer.

Scope: audit only. No canon wording changed. No new headwords created.

## Method

- Count repeated forms in `phrases_and_examples.csv`.
- Compare those forms against current dictionary headwords:
  - standalone lexicon words from `lexicon.csv`
  - root headwords currently surfaced from `expanded_root_database.csv`
- Separate likely missing core words from grammatical builds, possession forms, and clearly inflected compounds.

## Confirmed Priority Cases

### 1. `Rinaen`

- Current dictionary headword: missing
- Phrase/example occurrences observed: `52`
- Seen across:
  - Volume 4 adjective/object examples
  - comparative dialogue
  - Supplement 4A VSO examples
  - Supplement 4B capitalization examples
- Example attestations:
  - `Rinaen zhirin an pralor.`
  - `Rinaen morlak ser dren.`
  - `Rinaen Terra vaar.`
  - `Rinaen Ohm ser Ilin.`
- Why it matters:
  - this behaves like a core structural word, not a rare fragment
  - its absence is noticeable in normal dictionary use
- Current audit judgment:
  - **High-priority missing core headword**
  - likely needs either a dedicated lexicon-style entry, a grammar helper entry, or a canon decision about how it should be surfaced

### 2. `Emil`

- Current dictionary headword: missing
- Phrase/example occurrences observed: `19`
- Example attestations:
  - `Ilin-ka emil`
  - `Ka var I emil?`
  - `Rinaen emil esh pralor.`
  - `Shena ser emil teremil.`
- Why it matters:
  - appears as an ordinary everyday noun-like content word in many examples
  - seems too common to remain dictionary-invisible
- Current audit judgment:
  - **Probable missing standalone headword**

### 3. `Teremil`

- Current dictionary headword: missing
- Phrase/example occurrences observed: `11`
- Example attestations:
  - `Rinaen teremil zun.`
  - `Belvok ser dren an Teremil.`
  - `Emil teremil ka var?`
- Why it matters:
  - appears repeatedly as a stable everyday concept
  - seems to function like a lookup-worthy lexical item rather than just an incidental phrase component
- Current audit judgment:
  - **Probable missing standalone headword**

## Secondary Candidates

These also appear repeatedly and may deserve future review, but they are lower confidence than the three above:

- `Serin` — `7` occurrences
- `Varadan` — `6` occurrences
- `Shena` — `5` occurrences
- `Aelin` — `3` occurrences
- `Theren` — `3` occurrences

Current audit judgment:

- **Needs targeted review**
- these may be missing headwords, but they were not prioritized ahead of `Rinaen`, `Emil`, and `Teremil`

## Not Flagged As Missing Headwords Yet

These forms appeared frequently in examples, but they do not automatically count as missing dictionary words:

- `Nor-var`
- `Tha-var`
- `Li-Ser`
- `Li-Ya`
- `Nor-ka`
- `Shara-ya`
- `Thar-ian`
- `Ten-del`
- `Hek-unar`
- `Ten-quen`
- `Ten-peth`

Reason:

- these look like grammatical builds, possession forms, addressed forms, or number constructions rather than missing base headwords

## Important Clarification

Some repeated forms are already covered through the root layer and should not be flagged as missing only because they lack a standalone lexicon row.

Examples:

- `Vanesh`
- `Shan`
- `Ohm`
- `Vael`

If they are already surfaced through the accepted root database, they are not part of this missing-core-words problem.

## Recommendation

Use this order for follow-up:

1. `Rinaen`
2. `Emil`
3. `Teremil`
4. `Serin`
5. `Varadan`

## Suggested Next Step

Do a dedicated review pass for `Rinaen` first:

- trace every usage pattern
- determine whether it is already implicitly defined in canon
- decide whether it should surface as:
  - a standalone dictionary headword
  - a grammar/helper entry
  - or a flagged unresolved core form
