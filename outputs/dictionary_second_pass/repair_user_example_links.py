"""Remove source links to words the user's replacement no longer contains."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent

def edit_csv(path, updates):
    with path.open(newline='', encoding='utf-8') as handle:
        reader = csv.DictReader(handle)
        fields = reader.fieldnames
        rows = list(reader)
    for row in rows:
        replacement = updates.get(row['entry_id'])
        if replacement is not None:
            row['related_entry_ids'] = replacement
    with path.open('w', newline='', encoding='utf-8') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    return {row['entry_id']: row for row in rows}

lexicon = ROOT / 'data/lexicon_expansions.csv'
with lexicon.open(newline='', encoding='utf-8') as handle:
    before = {row['entry_id']: row['related_entry_ids'] for row in csv.DictReader(handle)}
remove = {
    'LX-DR1-0001': 'PE-V3-0141',  # Tera is absent from the new village line.
    'LX-DR1-0002': 'PE-V1-0010',  # Eshthael replaces Velkrel.
    'LX-DR1-0004': 'PE-V3-0095',  # Shalilaen replaces Shalil.
    'LX-DR1-0008': 'PE-V2-0078',  # Van replaces Evan.
}
lexicon_updates = {}
for entry_id, phrase_id in remove.items():
    ids = [value.strip() for value in before[entry_id].split(';')]
    assert phrase_id in ids, (entry_id, phrase_id)
    lexicon_updates[entry_id] = '; '.join(value for value in ids if value != phrase_id)
edit_csv(lexicon, lexicon_updates)

phrase_updates = {
    'PE-V1-0010': 'GR-V1-0009; LX-V2-0203',
    'PE-V2-0078': 'LX-V2-0168',
    'PE-V3-0095': 'LX-V3-0115',
    'PE-V3-0141': 'LX-DR1-0015',
}
phrases = edit_csv(ROOT / 'data/phrases_and_examples.csv', phrase_updates)
journal_path = HERE / 'user_32_replacements.json'
journal = json.loads(journal_path.read_text(encoding='utf-8'))
for item in journal:
    if item['entry_id'] in phrase_updates:
        item['after'] = phrases[item['entry_id']].copy()
journal_path.write_text(json.dumps(journal, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(HERE / 'user_32_link_changes.json').write_text(json.dumps({
    'lexicon_before': {entry_id: before[entry_id] for entry_id in remove},
    'lexicon_after': lexicon_updates,
    'phrase_after': phrase_updates,
}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Removed four stale word/example links')
