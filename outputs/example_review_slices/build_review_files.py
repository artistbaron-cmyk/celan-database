"""Make small, lossless review copies of the app's dictionary examples.

The app continues to read dictionary/app_data/dictionary_examples.csv.
Run from anywhere with: python3 outputs/example_review_slices/build_review_files.py
"""

import csv
from collections import Counter, defaultdict
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[2]
SOURCE = PROJECT / "dictionary/app_data/dictionary_examples.csv"
ENTRIES = PROJECT / "dictionary/app_data/dictionary_entries.csv"
DESTINATION = Path(__file__).resolve().parent
MAX_ROWS = 200


def read_csv(path):
    with path.open("r", encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        return reader.fieldnames, list(reader)


def write_csv(path, fields, rows):
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def bucket(word):
    first = word[0].upper() if word else ""
    return first if "A" <= first <= "Z" else "symbols"


def main():
    fields, source_rows = read_csv(SOURCE)
    _, entries = read_csv(ENTRIES)
    names = {row["id"]: row["headword"] for row in entries}
    groups = defaultdict(list)
    for row in source_rows:
        word_id = row["headword_id"]
        if word_id not in names:
            raise ValueError(f"Example points to a missing word: {word_id}")
        groups[word_id].append(row)

    # Keep each word together when possible. Long pages are split into parts.
    chunks = []
    current = []
    current_bucket = None
    for word_id in sorted(groups, key=lambda key: (names[key].casefold(), key)):
        word_bucket = bucket(names[word_id])
        rows = groups[word_id]
        if current and (word_bucket != current_bucket or len(current) + len(rows) > MAX_ROWS):
            chunks.append((current_bucket, current))
            current = []
        current_bucket = word_bucket
        if len(rows) > MAX_ROWS:
            for start in range(0, len(rows), MAX_ROWS):
                part = rows[start : start + MAX_ROWS]
                if len(part) == MAX_ROWS or start + MAX_ROWS < len(rows):
                    chunks.append((word_bucket, part))
                else:
                    current = part
        else:
            current.extend(rows)
    if current:
        chunks.append((current_bucket, current))

    file_counts = Counter()
    index_rows = []
    word_files = defaultdict(list)
    copied_rows = []
    generated_files = []
    for word_bucket, rows in chunks:
        file_counts[word_bucket] += 1
        filename = f"examples_{word_bucket}_{file_counts[word_bucket]:02d}.csv"
        write_csv(DESTINATION / filename, fields, rows)
        generated_files.append(filename)
        copied_rows.extend(rows)
        word_ids = list(dict.fromkeys(row["headword_id"] for row in rows))
        for word_id in word_ids:
            word_files[word_id].append(filename)
        index_rows.append({
            "file": filename,
            "first_word": names[rows[0]["headword_id"]],
            "last_word": names[rows[-1]["headword_id"]],
            "example_rows": len(rows),
            "words": len(word_ids),
        })

    if Counter(tuple(row[field] for field in fields) for row in copied_rows) != Counter(
        tuple(row[field] for field in fields) for row in source_rows
    ):
        raise ValueError("Review files do not exactly match the app source")

    write_csv(DESTINATION / "index.csv", ["file", "first_word", "last_word", "example_rows", "words"], index_rows)
    word_index = [
        {
            "word": names[word_id],
            "headword_id": word_id,
            "example_rows": len(groups[word_id]),
            "review_files": "; ".join(word_files[word_id]),
        }
        for word_id in sorted(groups, key=lambda key: (names[key].casefold(), key))
    ]
    write_csv(DESTINATION / "find_word.csv", ["word", "headword_id", "example_rows", "review_files"], word_index)
    print(f"Created {len(chunks)} review files with {len(copied_rows)} rows for {len(groups)} words.")
    print(f"Maximum rows in one review file: {max(len(rows) for _, rows in chunks)}")
    print("Every source row appears exactly once, with all columns unchanged.")


if __name__ == "__main__":
    main()
