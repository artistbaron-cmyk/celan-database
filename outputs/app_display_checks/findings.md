# Dictionary page checks — October 1, 2026

This records the **app-facing dictionary before the corrective passes** and what changed in Passes 1, 2, and 3. No Celan meaning or example sentence was rewritten in these passes.

The one complete findings list is [affected_items.csv](affected_items.csv). Its Pass 2 and Pass 3 columns say what happened to each affected word. [entry_inventory.csv](entry_inventory.csv) has one row for every word. The counts overlap: one word can appear in several groups.

## Problems found in the original display

| What the reader sees | How widely it occurs | What to do |
| --- | ---: | --- |
| All word parts use the same orange | 1,027 words have at least two displayed parts | Give parts distinct, readable colors by their place in the word. |
| Parts appear in an order that does not spell the headword | 228 words have one clear spelling order different from the saved order | Put those parts in spelling order; review the resulting page. Aivkorxar is one example. |
| “Word origin” repeats exactly what the morphology cards already say | 829 words | Show the breakdown once. Keep a separate origin note only when it adds information. |
| Variant spelling has little visual weight | 193 words have variants | Make the variant form prominent and its pronunciation secondary. |
| Internal review language appears as a usage note | 30 words match specific visible-note patterns | Keep these notes in the files; remove them from the reader's page. An and Tavan are examples. |
| “Sense assignment pending review” appears above examples | 2,825 direct-example placements across 84 words lack a sense assignment while the word has multiple displayed meanings | Remove the internal message. Keep each example at word level until its particular meaning has been reviewed. An and Aenor are examples. |

## Decisions that require reading individual words

| Review queue | Size | Why a person must check it |
| --- | ---: | --- |
| Multiple meanings with morphology | 26 words | The word parts may explain only one meaning. Aenor is confirmed: *Aen* + *-or* explains “moment,” not “ear.” Keep both meanings. |
| Multiple meanings with a word family | 82 words | Family links may belong to one meaning rather than every meaning. Aenor is a confirmed example. |
| Parts do not simply join to spell the word | 107 words | Some may have legitimate sound or spelling changes; others may have missing or wrongly linked parts. Do not reorder or discard them automatically. |
| More than ten direct examples | 99 words | Frequent words naturally occur in many sentences. Choose useful teaching examples for the main page; retain the other records without presenting them as a lesson. An has 875. |
| No direct example | 99 words | Some are affixes or other forms that need a different kind of illustration. Sixty-five are nouns; their pages deserve individual review. Lack of a direct example does not invalidate a word. |
| Exactly repeated meaning wording | 6 words: Jorvar, Lianeth, Lianrethshen, Rethlian, Seren, Vaarshen | Check whether the page repeats one sense or whether the records mark a real distinction not shown to readers. Do not remove a meaning on this check alone. |

## Pass 1 completed — meaning and word type display

| Finding | Current status |
| --- | --- |
| Meanings with different word types, or several meanings of one type, were not equally clear | **Fixed on the page.** Each of the 1,607 visible meaning rows now has its own card and word-type label. This includes all 89 words with multiple meanings and all 50 with multiple word types. No wording was changed. |
| Hidden older meanings could still appear because the page read the complete sense list | **Fixed.** The reader page and word-type filter now follow `visible=Yes`. The 90 hidden rows remain in the source file but do not appear as meanings. |
| Variant forms had little visual weight (193 words) | **Fixed on the page.** Variants now have their own area, with a bold spelling and a separate pronunciation line. |
| Internal review language appeared in usage notes | **Fixed for the identified note patterns.** These notes remain in the app data for editors, but the reader page and spreadsheet export omit them. |
| “Sense assignment pending review” appeared above 2,825 examples on 84 words | **The internal label is removed.** The examples remain at word level; assigning each to the right meaning is Pass 3 work. |
| A word-level breakdown or family could falsely seem to explain every meaning | **Temporarily withheld on multi-meaning pages.** This affects recorded morphology on 26 words, family links on 82, and origin lines on 13. All underlying records remain. Pass 2 will attach them to the meaning they explain and restore supported displays. Aenor's *Aen* + *-or* explanation is one such case. |
| The app had no permanent identifier for each meaning | **Fixed in the source data.** All 1,697 sense rows have a distinct `sense_id`; 1,607 of them are visible. IDs are not printed on reader pages. |

In Pass 1, the running app was checked on **An, Aenor, Aen, Aivkorxar, Jek, -or, and Quen**. Search, a family link, and Back/Forward were exercised. Automated checks rendered all 1,496 headwords and counted their visible meaning cards and word-type labels. These were technical display checks, not linguistic approval of the sentences.

## Pass 2 completed — word parts and families

| Finding | Current result |
| --- | --- |
| All parts had the same color | **Fixed on the page.** The first through fifth parts have different readable colors. The `+` signs and written order also identify the parts. |
| 228 words had recorded parts in the wrong order | **Corrected.** In each case the reordered parts join exactly to spell the headword. The complete before/after list is [pass2_order_changes.csv](pass2_order_changes.csv). Aivkorxar now shows `Aivkor + Xar`. |
| 107 breakdowns did not simply spell the word | **All 107 have a recorded disposition after comparison with the saved parts and origins.** Thirty-one were completed from an already recorded origin; three had an existing alternative analysis (including Velmarin's two meaning-specific analyses); six use a smoothing vowel permitted by the Grammar Guide; and two have an explicitly recorded spelling change. The other **65 remain open and are hidden on reader pages**. This is a structural check, not full linguistic approval. See [pass2_morphology_review.csv](pass2_morphology_review.csv) for every word and reason. |
| 26 words had several meanings and word parts | **Scoped.** Each displayed breakdown names the meaning it explains where needed. Aenor's `Aen + -or` is labeled for “moment/instant,” not “ear.” Velmarin has two distinct recorded analyses, one per meaning. |
| 82 multi-meaning words had family links | **56 link sets now have a recorded meaning scope; 26 remain open and hidden** rather than being attached to every meaning. The item-by-item list is [pass2_family_scope.csv](pass2_family_scope.csv). A recorded family connection does not prove that every linked word shares one exact historical origin. |
| 829 words had an origin line that repeated the word-part cards | **Fixed in presentation.** The page omits an origin line that exactly repeats displayed parts. A distinct explanation can still appear. Unresolved breakdowns are hidden with their decomposition-based origin lines. |
| Spreadsheet export repeated word-level parts or families beside unrelated meanings | **Updated.** The rebuilt export has `word_parts` and `word_parts_note` columns and leaves those fields blank on meanings they do not explain. It also leaves unscoped family links blank. All 1,607 visible meaning rows remain. |
| Search could still match an origin line hidden from the page | **Updated.** General search follows the visible word parts, family links, and distinct origin text. It no longer indexes a duplicate or unresolved breakdown solely because it remains in the source record. |

The 65 unresolved breakdowns and 26 unresolved family link sets are **review items, not declared language errors**. Their source records remain in the app's data folder. Some component descriptions drawn from older records are long or awkward; tightening that wording is an optional later editing pass and should not change approved meanings by inference.

The app's source of truth remains the seven files in `dictionary/app_data`. The embedded offline data and spreadsheet export were rebuilt from those files. The export is a flat editing view: it repeats each headword once per visible meaning and includes only the word parts and family links assigned to that meaning. The reader page groups those meanings under one headword.

**Taken into Pass 3:** long example lists; example-to-meaning placement; and words with no direct example. Six exactly repeated meaning wordings still need a meaning review. The [corrective plan](corrective_plan.md) describes the agreed scope. The separate language audit of sentence accuracy remains later work.

Pass 2's automated checks rendered all 1,496 headwords, checked every visible meaning card and word type, verified the 228 saved part orders, checked that open breakdowns and unscoped family sets stay hidden, checked displayed origin text against word-part sources, and confirmed the app bundle and export match the current source files. The edit-and-rebuild and whitespace checks passed. Aenor and Aivkorxar were revisited in the running browser. These are **technical display checks**, not linguistic approval of every derivation or example.

## Pass 3 completed — example display and app checks

| Finding | Current result |
| --- | --- |
| Long pages hid the difference between a few useful examples and a large record set | **Changed on the page.** Each section shows its first five items, then a “More examples” control with the exact remaining count. All records remain reachable. The 99 words with more than ten direct placements are listed in [affected_items.csv](affected_items.csv). |
| Ordinary usage, phrases, idioms, teaching illustrations, historical items, and related constructions appeared together | **Separated by recorded example type and placement.** The 9,163 placements now have an explicit display kind: 8,624 ordinary sentences, 196 phrases, 33 direct idioms, 77 teaching illustrations, 5 historical examples, and 228 related placements (including four phrases and one idiom). This labels the kind recorded in the app; it is not a fresh grammar or translation judgment. |
| Examples could appear to support a particular meaning without a reviewed link | **Six previously recorded links now put those examples inside the supported meaning card:** three on Jor, two on Talaen, and one on Thal. The other **2,825 direct placements across 84 multi-meaning words remain unassigned**. Of those, 2,662 ordinary sentences appear in “Examples using this word”; the phrases, idioms, and teaching items remain in their own sections. No meaning was inferred from English keywords. |
| An's related construction looked like direct use of standalone *an* | **Corrected on the page.** It appears only in “Related forms and constructions.” An's 872 ordinary sentences show five initially and 867 in “More examples”; its phrase and 14 teaching illustrations have separate sections. |
| Words with no direct placement received an unhelpful empty direct-example area | **Reviewed as page types.** All 99 are itemized in [pass3_no_direct_examples.csv](pass3_no_direct_examples.csv). Pages with related or teaching material show that material in its own section. Pages with no recorded example say so plainly; attached forms without a construction example get an attached-form note. No sentence was invented. |
| The flat export could imply that a preview sentence supported the wrong meaning | **Corrected in the generated export.** Ordinary sentence previews now carry a `sense_id` when linked. Unassigned word-level previews appear once, on the first row; linked previews appear only on their meaning's row. Counts separately show meaning-linked sentences, unassigned sentences, phrases, idioms, and related placements. The complete example file remains the app's source. |

The **technical checks** rendered all 1,496 word pages and matched every one of the 9,163 source placements to exactly one rendered card, including cards behind “More examples.” They checked every visible meaning count, every generated word-family button target, all six meaning links, display-kind values, export preview links and counts, and the rebuilt offline bundle. The edit-and-rebuild check confirmed that a changed source example reaches the app and export. In the running browser, I checked An, Aenor, Jor, Thal, Eth, Trak, and Aivkorxar; opened An's “More examples”; followed Aenor's family link and used Back; searched for “bandage”; and checked that the A–Z strip stays on one scrollable row at narrow width and one row at wide width. No source notes, literal glosses, or pending-review labels appeared on those pages.

**Still open:** The 2,825 direct placements without a reviewed meaning link need individual linguistic placement review. The 99 words without direct examples remain candidates for new, accurate examples; the app does not fabricate them. The six exactly repeated meaning wordings, 65 unresolved breakdowns, and 26 unscoped family link sets remain in the single findings list. This pass did **not** read every Celan and English example for sentence accuracy, judge all pronunciation or derivation claims, or re-audit the Grammar Guide, Expressions, and Phrase Builder as language systems. The technical checks show that the app displays and keeps its records consistently; they do not certify the language content.

## Three original pages examined closely before correction

- **Aivkorxar:** The saved parts were `Xar + Aivkor`; the spelling and recorded origin gave `Aivkor + Xar`. Its origin sentence repeated the parts. `Aivakorxar` is a variant. The part order, repetition, and variant display were corrected in Passes 1 and 2.
- **An:** Its two displayed meanings substantially restate “at/in.” The page has 875 direct placements, including many that merely contain this common preposition. Its usage note formerly exposed source commentary. The single “related” sentence does not contain the standalone word *an* and now stays in the related constructions section.
- **Aenor:** Both “ear” and “moment/instant” are current meanings. The recorded *Aen* + *-or* explanation explicitly applies to the moment meaning and distinguishes it from “ear.” Its morphology and family are now labeled for “moment/instant.” Its two examples have no approved meaning links, so they remain together under “Examples using this word.”

## What was checked

- All **1,496** app-facing headwords, **1,607** visible sense rows, **9,163** example placements, all 1,496 word-family records, and the dictionary page's rendering rules and colors.
- For every headword: variant presence, displayed part count and spelling order, exact origin/morphology repetition, example counts and blank sense assignments, exact duplicate meaning text, and visible usage notes matching internal-review patterns.
- Checked Aivkorxar, An, and Aenor against their current app records, not just the screenshots.

## What this check does not establish

- It did **not** judge the meaning or grammar of all 9,163 example placements. Automated counts cannot establish whether a sentence is a good or accurate illustration.
- “No exact spelling match” does **not** mean the morphology is wrong. A sound change, shortened form, or incomplete recorded breakdown may explain it.
- A multi-meaning word with morphology or family links is a review candidate, not automatically an error. Aenor has a specific recorded distinction that confirms its display problem.
- This pass did not re-audit the full Grammar Guide, Expressions, Phrase Builder, pronunciations, or every page visually in a browser. It checked the Grammar Guide's recorded smoothing-vowel rule and the export fields touched by Pass 2.

At the time of the original read-only check, the app-facing content files were unchanged. Passes 1 and 2 subsequently updated the app-facing data and presentation, as recorded above.
