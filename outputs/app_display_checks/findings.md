# Dictionary page checks — October 1, 2026

This records the **app-facing dictionary before the corrective passes**. It identifies display problems and review queues. Pass 1 has since changed the page presentation; its results and remaining work are recorded below. No Celan meaning or example sentence was rewritten.

The full list of affected words is in [affected_items.csv](affected_items.csv). [entry_inventory.csv](entry_inventory.csv) has one row for every word. The counts overlap: one word can appear in several groups.

## Clear problems to fix in the next display pass

| What the reader sees | How widely it occurs | What to do |
| --- | ---: | --- |
| All word parts use the same orange | 1,027 words have at least two displayed parts | Give parts distinct, readable colors by their place in the word. |
| Parts appear in an order that does not spell the headword | 228 words have one clear spelling order different from the saved order | Put those parts in spelling order; review the resulting page. Aivkorxar is one example. |
| “Word origin” repeats exactly what the morphology cards already say | 829 words | Show the breakdown once. Keep a separate origin note only when it adds information. |
| Variant spelling has little visual weight | 193 words have variants | Make the variant form prominent and its pronunciation secondary. |
| Internal review language appears as a usage note | 30 words match specific visible-note patterns | Keep these notes in the files; remove them from the reader's page. An and Tavan are examples. |
| “Sense assignment pending review” appears above examples | 2,825 direct-example placements across 84 words lack a sense assignment while the word has multiple displayed meanings | Remove the internal message and place each example under its supported meaning after review. An and Aenor are confirmed examples. |

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

The running app was checked on **An, Aenor, Aen, Aivkorxar, Jek, -or, and Quen**. Search, a family link, and Back/Forward were exercised in the browser. Automated checks rendered all 1,496 headwords, counted every visible meaning card and word-type label, and searched their rendered pages for the identified internal phrases. The source/bundle check, edit-and-rebuild check, and whitespace check passed. These are **technical display checks**, not linguistic approval of the sentences.

**Still open:** the wrong part order and repeated origin line on Aivkorxar; position-based part colors; 107 breakdowns whose parts do not simply spell the word; sense-specific word building and families; long example lists; example-to-meaning placement; and the six repeated meaning wordings. The detailed affected-item list is the pre-fix inventory and still names every item for the later passes. The [corrective plan](corrective_plan.md) gives the order of work.

## Three pages examined closely

- **Aivkorxar:** The saved parts are `Xar + Aivkor`; the spelling and recorded origin give `Aivkor + Xar`. Its origin sentence repeats the parts. `Aivakorxar` is a variant but is visually easy to miss.
- **An:** Its two displayed meanings substantially restate “at/in.” The page shows 875 direct examples, including many that merely contain this common preposition. Its usage note exposes source commentary. The single “related” sentence does not contain the standalone word *an*.
- **Aenor:** Both “ear” and “moment/instant” are current meanings. The recorded *Aen* + *-or* explanation explicitly applies to the moment meaning and distinguishes it from “ear.” Both displayed examples illustrate “moment,” yet both show the internal pending-review label. The word family needs the same sense-specific treatment.

## What was checked

- All **1,496** app-facing headwords, **1,607** visible sense rows, **9,163** example placements, all 1,496 word-family records, and the dictionary page's rendering rules and colors.
- For every headword: variant presence, displayed part count and spelling order, exact origin/morphology repetition, example counts and blank sense assignments, exact duplicate meaning text, and visible usage notes matching internal-review patterns.
- Checked Aivkorxar, An, and Aenor against their current app records, not just the screenshots.

## What this check does not establish

- It did **not** judge the meaning or grammar of all 9,163 example placements. Automated counts cannot establish whether a sentence is a good or accurate illustration.
- “No exact spelling match” does **not** mean the morphology is wrong. A sound change, shortened form, or incomplete recorded breakdown may explain it.
- A multi-meaning word with morphology or family links is a review candidate, not automatically an error. Aenor has a specific recorded distinction that confirms its display problem.
- This pass did not re-audit the Grammar Guide, Expressions, Phrase Builder, exports, pronunciations, or every page visually in a browser.

At the time of the read-only check, the app-facing content files were unchanged. Pass 1 subsequently added sense IDs and updated the app and export presentation, as recorded above.
