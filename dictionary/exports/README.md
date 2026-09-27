# Dictionary exports

`dictionary_entries.csv` is a generated copy of the assembled dictionary for review and distribution. It is **not** an input to the browser app. The app's source files are in `../app_data/`.

The full export includes every field formerly provided by the shorter `dictionary_report.csv`. The report's first direct and related examples correspond to `example_1_*` and `related_example_1_*` here.

Rebuild from the project root with `node dictionary/export_dictionary_csv.js`. Do not edit the generated CSV by hand.
