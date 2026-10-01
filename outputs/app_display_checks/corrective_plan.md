# Three-pass corrective plan for the Dictionary App

**Scope:** Fix how the current dictionary presents words, meanings, word parts, families, variants, and examples. Preserve the current approved meanings and all underlying records. **Sentence translation and grammar accuracy are reserved for a later audit.** Counts below come from the October 1 [display checks](findings.md); groups overlap.

## Pass 1 — Make every meaning clear

**Reader's page**

- Give **each meaning its own equally prominent block**. Put its word type beside that meaning, even when the next meaning has a different type. A noun/verb word must show a noun block and a verb block; a two-noun word must show two clear noun meanings. Do not make the second meaning look like a footnote.
- Use the same simple page structure for words without a known breakdown. Do not fill an empty morphology area or invent a root. Show a root label only when that label is useful and approved.
- Put variant spellings in a clearly labeled area with the variant word in bold and its pronunciation underneath.
- Remove reader-facing review and source language, including “Sense assignment pending review,” “Retain as-is,” and “Preserved ... because source ...”. Keep those records in the files.
- Give each meaning a stable behind-the-scenes identifier so word parts, family links, and examples can later point to the right meaning. Do not show these identifiers to readers.

**Checks before calling this pass done**

- All 1,496 headwords and 1,607 visible meanings still appear. Check all **89** words with multiple meanings, including the **50** that have more than one word type.
- Inspect representative pages: An (simple preposition), Aenor (two noun meanings), Aen (several word types), Aivkorxar (variant and word parts), a root, an ending, and a word with no known family.
- No internal review or source note appears in the reader view. Search and Back/Forward still reach every headword.

## Pass 2 — Make word building truthful and readable

- Give word-part cards distinct colors by **position in the written word**, with readable text and visible `+` signs. The current records have at most five displayed parts. Color never supplies the meaning by itself.
- Put parts in spelling order when the existing parts clearly join to spell the headword. **228** entries have one clear corrected order; check each result. **107** do not join exactly and require individual review. A sound change or shortening may be legitimate; do not force an order or invent a part.
- Attach morphology and family links to the meaning they actually explain. **26** multi-meaning entries have morphology and **82** have family links to inspect. For Aenor, *Aen* + *-or* explains “moment/instant”; it must not appear to explain “ear.”
- Remove an origin line when it exactly repeats the cards (**829** entries). Keep origin information that adds something else, such as history or a genuinely distinct explanation.
- Keep word-family links navigable, but do not imply that similar-looking words share an origin without recorded support.

**Checks before calling this pass done**

- Aivkorxar reads `Aivkor + Xar`; morphology is absent where the app has no established parts.
- Every changed breakdown can be traced to the current app record. The 107 non-exact cases each have a recorded disposition or remain explicitly open; an unresolved case is not silently displayed as certain.
- Morphology, origin, and family links do not contradict the meaning blocks from Pass 1.

## Pass 3 — Organize examples and check the whole app

**This pass checks placement, not whether the Celan sentence and English translation are accurate.**

- Show multiple examples when available, without turning common-word pages into enormous lists. Recommended display: show up to five direct examples on the page and a clear **“More examples”** control for the rest. Keep every example record in the app data. Example order is not an accuracy endorsement.
- Put examples under a particular meaning only when the record already has a clear, supported sense link. If the link is absent, keep the sentence in a neutral **“Examples using this word”** area, without an internal pending-review message or a false sense claim. **84** headwords have this problem, covering **2,825** direct placements.
- Keep teaching and historical illustrations distinct from ordinary usage. Keep related forms out of the ordinary example list. An's one related record does not contain standalone *an* and must not be presented as its direct use.
- Review page length for the **99** words with more than ten direct examples. Review the **99** words with no direct example using the right page type; an ending may need a construction illustration rather than a standalone sentence.
- Check search results, word navigation, all family buttons, example counts, and the app export after the display rules change. Check narrow and wide screens, including the single-row A–Z bar.

**Checks before calling this pass done**

- Every one of the 9,163 example placements is accounted for in the data; none is deleted by the presentation change.
- No page shows an internal label, source citation, or literal gloss. Example counts and “More examples” match what readers can access.
- Walk through the main page types in the running app, then run the existing app data and edit-and-rebuild checks. Record anything still unresolved.

## Later, separate language audit

Read the Celan and English of each example for meaning, grammar, and natural use. The three corrective passes above **must not be reported as proof that the sentences are accurate**. Corrections found in that later audit should go through the approved dictionary data and the normal rebuild.
