---
name: celan-expansion
description: Audit, propose, review, and integrate new Celan headwords through explicitly approved lexical batches. Use when expanding Celan vocabulary, assessing expressive coverage toward a milestone, developing national vocabulary with universal meanings, or adding approved terms to the Ohnosha dictionary app. Do not use for ordinary lore writing or translation unless lexical development is requested.
---

# Celan Expansion

Grow Celan by making it more speakable, not merely more countable.

## Authority

Work only inside the current Celan project. Treat the assembled dictionary app as the operational standard and the source-facing files as preserved witnesses. Before making lexical decisions, read the project's `docs/data_layers.md` and `knowledgebase/11_editorial_canon_policy.md`.

Never copy the live lexicon or canon policy into this skill. Read the current project files so the workflow does not become stale.

## Choose the Mode

### Audit

Use when the user asks how many words Celan has, where it is thin, what should come next, or whether a milestone is meaningful.

1. Run `node .agents/skills/celan-expansion/scripts/audit_lexicon.js` from the project root.
2. Read [references/audit-framework.md](references/audit-framework.md).
3. Report capabilities and lexical gaps, not only counts. Distinguish app headwords, sense rows, roots, affixes, names, variants, phrases, and expansion entries when those distinctions affect the conclusion.

### Develop or Review Candidates

Use when brainstorming, comparing, or refining possible terms.

1. Read [references/audit-framework.md](references/audit-framework.md) to select a genuine capability gap.
2. Read [references/headword-admission.md](references/headword-admission.md).
3. Check the app-facing lexicon, roots, examples, and canon policy before proposing forms.
4. Discuss meaning, derivation, sound, pronunciation, likely use, national application, variants, and collisions with the user.
5. Keep candidates outside canon until the user explicitly approves them. Do not write candidate ideas into the approved expansion CSV.

Prefer coherent batches of up to about 40 terms, but let semantic difficulty determine the batch size. Do not fill a numerical quota with weak derivatives.

### Integrate an Approved Batch

Use only after the user has explicitly approved the terms or directly asked to add a clearly identified approved set.

1. Read [references/data-contract.md](references/data-contract.md).
2. Add only the approved entries, pronunciations, examples, variants, and necessary root or editorial decisions.
3. Run the batch validator before rebuilding.
4. Rebuild the embedded app data and generated exports.
5. Run the validator and lexicon audit again.
6. Report the exact app-headword increase and any unresolved warnings.

Approval applies to the discussed entries, not to every mechanically possible derivative. A productive construction is not blanket authorization to create its full paradigm.

## Non-Negotiable Invariants

- Every new headword requires explicit human approval.
- Pronunciation is mandatory for expansion entries.
- Give each entry a stable universal core meaning. National origin records where a word is characteristic, not who is allowed to use it.
- Treat national voice as a cross-cutting cultural lens across ordinary life, not as a closed vocabulary bucket.
- Euphonic alternatives share one meaning and one app entry. Store them as searchable variants; do not count them as separate headwords.
- Euphony is optional unless a later approved editorial decision says otherwise. For `Wek` as the second root, use `-ewek` or `-owek`, never `-awek`.
- Check for semantic collisions, overbroad definitions, existing synonyms, overused roots, and false derivations before recommending a term.
- A derivative deserves a headword only when its meaning or use is independently lexicalized; transparent possibility alone is insufficient.
- Preserve source witnesses. Put approved new vocabulary in the app-facing expansion layer.
- Domains are overlapping audit lenses. Never reject a useful Celan concept merely because it falls outside the current taxonomy.

## Completion Standard

An expansion batch is complete only when its approved entries are represented correctly in the app, their variants do not inflate the count, pronunciation and linked examples are present, generated files have been refreshed, and validation passes. A milestone is complete only numerically; claims of conversational independence require scene-based capability audits.
