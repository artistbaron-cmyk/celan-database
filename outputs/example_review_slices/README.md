# Dictionary example review files

The app still reads **`dictionary/app_data/dictionary_examples.csv`**. That large file has not been replaced. The `examples_*.csv` files here are smaller copies for reviewing and planning edits.

- Open **`find_word.csv`** and search for a Celan word. The last column tells you which small file or files contain its examples.
- Open **`index.csv`** to see the word range and size of every small file.
- Open an **`examples_*.csv`** file to review the examples. Each has the same columns as the app file. A word with many examples can span several numbered files.

These copies are sorted by word. Each row keeps its original content, including any existing notes or labels. A row's `headword_id`, `section`, and `display_order` identify its placement in the app file. Editing a review copy alone will **not** change the app. Approved edits must be applied to the app file, then the review copies refreshed.

To refresh the copies after app edits, run:

```sh
python3 outputs/example_review_slices/build_review_files.py
```

The script checks that all source rows have been copied exactly once.
