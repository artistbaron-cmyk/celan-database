# Celan readiness audit

This is a fresh read-only linguistic review. The prior second-pass audit and automated checks are evidence, not a substitute for judging each example. The source CSVs and app data are unchanged by this audit.

- Example rows in scope: 2,275.
- Fully cleared after sense, translation, placement, and grammar review: 2 (`PE-NE1-0015` and `PE-HTS1-0069`). Twenty-four source rows currently have a specific finding or question in the review queue; no other row is silently counted as verified.
- Dictionary headwords in scope: 1,496. Existing structural checks are retained; headword meanings and usage need independent review.
- Grammar, example placement, visual app presentation, and exports remain in scope.
- Readiness verdict: not established.

A row is marked reviewed only after its Celan text, English meaning, word placement, and relevant grammar have been judged. Automated checks alone do not change that status.

The source table's existing `Approved` flag records prior editorial acceptance. It does not mean this readiness audit has independently checked the row; several newly found conflicts are in rows carrying that flag.

The [example review queue](example_review.csv) names every source example, and the [headword review queue](entry_review.csv) names every current app headword with its displayed senses and placements. An untouched status in either queue means it remains open; the queues are coverage records, not certificates.

## Current screening progress

All 2,275 source example rows have been screened for obvious sentence and translation conflicts. They have **not** been marked linguistically verified: each linked sense, contextual interpretation, example placement, and applicable grammar still require line-by-line judgment. The 2,275-row full-review queue remains explicitly open. This screen found additional concrete errors beyond the user's screenshots, including actor changes in three recreation examples and unencoded actions in ecology examples.

The current CSV exports have 1,496 headwords and 1,607 senses. The PDF and plain-text dictionaries are older than those exports; see R-08 in the findings. This is a technical comparison, not a linguistic judgment about their individual entries.

The fresh [technical snapshot](technical_check.json) found 1,496 unique app headwords, no blank spelling/pronunciation/type/meaning fields in the 1,607 exported sense rows, matching sense/type/meaning keys across the two current CSV exports, 2,275 unique example IDs, and no app example placement pointing to a missing example row. These checks establish record integrity only. They do not judge whether a pronunciation, meaning, derivation, family link, or example is linguistically correct.

Fresh regression runs passed `dictionary/search.test.cjs`, `navigation.test.cjs`, `families.test.cjs`, `example-round2.test.cjs`, `review-integration.test.cjs`, and `outputs/dictionary_second_pass/verify_after.py`. These exercise lookup, navigation, family links, prior decisions, and export structure. They do not catch the newly found Celan–English mismatches and cannot support a readiness verdict by themselves.

An automated first-token screen produced 76 possible noun-first ordinary examples in [noun_first_candidates.csv](noun_first_candidates.csv). It includes legitimate fragments and names as well as likely old-order sentences, so its rows are **candidates**, not 76 confirmed errors. The older Volume 2 food and weather examples contain several clear mismatches and require individual review.

The candidate list includes known exceptions that must not be "fixed" mechanically: the approved `Ser Lior ...` relative-clause phrase, the user's approved elliptical `emil ka shena?` question, and a number-building teaching illustration. It also includes an unplaced historical example. Most of the other candidates are still visible as direct app usage; their exact IDs remain in the queue for individual disposition.

The previously claimed Weksharaen `an kinnmor` error is now a grammar question. The user's later approved `an Zhaelor` (“in spring”) conflicts with the broad statement that `an` is spatial and `nor` temporal. No time-expression example should be changed mechanically until that distinction is resolved.
