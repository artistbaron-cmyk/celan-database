# Grammar Guide CSV migration — 2026-10-05

The Dictionary App now reads [grammar_guide.csv](../../dictionary/app_data/grammar_guide.csv) as its single current Grammar Guide source. The previous JSON was preserved in [source history](../../dictionary/source_history/grammar_guide_before_csv_2026-10-05.json); the app no longer reads it.

The CSV contains all **48 grammar rules, 7 lesson cards, and 1 companion page**. A round-trip comparison found every original content field unchanged. No Celan grammar decision or sentence was changed during this migration.

The offline app bundle was rebuilt. The data, full app rendering, and edit-and-rebuild checks passed. The latter changed a grammar title in a temporary copy and confirmed that the changed title reached both the Grammar Guide page and grammar search. The app rebuild reads the CSV directly; the dictionary spreadsheet export remains separate and unchanged by this migration.
