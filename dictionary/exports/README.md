# Dictionary exports

`dictionary_entries.csv` is a generated copy of the assembled dictionary for review and distribution. It is **not** an input to the browser app. The app's source files are in `../app_data/`.

The full export includes every field formerly provided by the shorter `dictionary_report.csv`. It has one row per visible meaning. The five `example_*` slots preview ordinary sentences only; a meaning-linked sentence appears on its meaning's row, and an unassigned word-level sentence appears once on the first row. Each preview has an `example_*_sense_id` field. `example_count` is the total number of direct placements for the headword, including phrases, idioms, and teaching illustrations. Separate count columns show the kinds that are not in the ordinary-sentence preview. The complete 9,251 example placements, including related, teaching, and historical material, are in `../app_data/dictionary_examples.csv`.

Rebuild from the project root with `node dictionary/export_dictionary_csv.js`. Do not edit the generated CSV by hand.
