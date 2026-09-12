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
3. Check the app-facing lexicon, examples, canon policy, `data/roots_and_morphology.csv`, and `data/expanded_root_database.csv` before proposing forms. Treat approved created roots as part of the active root inventory with the same reuse consideration as source-established roots.
4. Perform a root-reuse pass for every candidate. Identify the semantically relevant original and newly approved roots, test whether one root or a natural combination expresses the concept, and record the selected roots. When a plausible root is not used, record the concrete semantic, grammatical, or euphonic reason. Prefer reuse when it preserves the intended meaning, but do not force a misleading construction merely to avoid a new primitive.
5. Propose a new primitive only after the root-reuse pass shows that the active inventory would duplicate, distort, or overload the intended meaning. Record that conclusion in the candidate review so primitive creation remains auditable.
6. Run a lineage-and-cadence review using `docs/celan_language_design_lineage.md`. Test candidates together in spoken phrases, not only as isolated compounds, and preserve Celan's characteristic balance of rhythmic attack, open-vowel release, and clearly articulated syllables. Treat established Bantu-influenced roots and phonotactic forms as active material that may develop when their meanings support the new concept; do not reduce them to decorative spellings, force them into every batch, or impose a sound quota.
7. Discuss meaning, derivation, sound, pronunciation, likely use, variants, and collisions with the user. Discuss national origin only when the term appears characteristic of a particular nation. If that distinction is unclear and would change the entry, ask one simple question: “Is this universal Celan, or is it specifically characteristic of a nation?”
8. Keep candidates outside canon until the user explicitly approves them. Do not write candidate ideas into the approved expansion CSV.

Prefer coherent batches of up to about 40 terms, but let semantic difficulty determine the batch size. Do not fill a numerical quota with weak derivatives.

### Integrate an Approved Batch

Use only after the user has explicitly approved the terms or directly asked to add a clearly identified approved set.

1. Read [references/data-contract.md](references/data-contract.md).
2. Add only the approved entries, pronunciations, examples, variants, and necessary root or editorial decisions. When an approved headword already exists, treat the new meaning as an additional sense unless the user explicitly approves replacement or deprecation.
3. Run the batch validator before rebuilding.
4. Rebuild the embedded app data and generated exports.
5. Run the validator and lexicon audit again.
6. Report the exact app-headword increase and any unresolved warnings.

Approval applies to the discussed entries, not to every mechanically possible derivative. A productive construction is not blanket authorization to create its full paradigm.

## Non-Negotiable Invariants

- Every new headword requires explicit human approval.
- Pronunciation is mandatory for expansion entries.
- Give each entry a stable universal core meaning. Leave national origin and national usage blank for vocabulary intended to be universal overall. Record a nation only when the word or use is specifically characteristic of that nation; national origin never limits who may use the word.
- Treat national voice as a cross-cutting cultural lens across ordinary life, not as a closed vocabulary bucket.
- Euphonic alternatives share one meaning and one app entry. The unsmoothed construction is the primary headword; the optional form is always the euphonic variant. Store the euphonic form as a searchable variant and do not count it as a separate headword. Preserve older source witnesses, but never make an unsmoothed form the optional variant of a newly developed euphonic headword.
- Euphony remains a speaker option, not a required repair. For `Wek` as the second root, optional euphony uses `-ewek` or `-owek`, never `-awek`.
- Never remove, hide, or overwrite a previously displayed lexical definition merely because a new sense is added to the same headword. Preserve the dictionary's intentional suppression of root-analysis descriptions when an ordinary lexical definition already represents that root. Expose a root description as an additional sense only when the user explicitly approves that specific exception, as with `Shan`. Replacement or deprecation requires separate explicit user approval and a traceable editorial record.
- Check for semantic collisions, overbroad definitions, existing synonyms, overused roots, and false derivations before recommending a term.
- Include both source-established and user-approved created roots in every root-reuse review. A recently approved root is not secondary or invisible during later word formation.
- Keep the whole inherited sound-and-root inventory available during expansion, including Bantu-influenced roots and forms. Root reuse must not collapse into repeated dependence on only the most productive compound roots. Extend those inherited families where the semantic relationship is genuine, while preserving Celan as an Ohnoshan blend rather than imitating or cosmetically marking any single Earth language.
- A derivative deserves a headword only when its meaning or use is independently lexicalized; transparent possibility alone is insufficient.
- A newly created primitive root may contain one or two syllables, but never more than two. Do not treat one syllable as inherently preferable: choose one or two according to semantic distinctiveness, productive usefulness, collision avoidance, and natural Celan sound. This limit applies to primitive roots, not to compounds or derived headwords.
- Preserve source witnesses. Put approved new vocabulary in the app-facing expansion layer.
- Domains are overlapping audit lenses. Never reject a useful Celan concept merely because it falls outside the current taxonomy.

## Completion Standard

An expansion batch is complete only when its approved entries are represented correctly in the app, all pre-existing displayed lexical senses of reused headwords remain visible, intentional root-description hiding remains intact except for explicitly approved exceptions, their variants do not inflate the count, pronunciation and linked examples are present, generated files have been refreshed, and validation passes. Compare every reused headword before and after integration; do not rely on the total headword count to detect sense loss. A milestone is complete only numerically; claims of conversational independence require scene-based capability audits.
