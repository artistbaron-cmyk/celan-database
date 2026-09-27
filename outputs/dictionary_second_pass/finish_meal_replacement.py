"""Finish #28 after the user's clarification that ready means cooked."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
source = ROOT / 'data/phrases_and_examples.csv'
journal_path = HERE / 'user_32_replacements.json'
with source.open(newline='', encoding='utf-8') as handle:
    reader = csv.DictReader(handle)
    fields = reader.fieldnames
    rows = list(reader)
row = next(row for row in rows if row['entry_id'] == 'PE-V3-0145')
assert row['example_type'] == 'Historical example pending correction'
row['celan_text'] = 'ra ver rinaen emil emilpraleth an teremil?'
row['translation'] = 'Is the meal at home not ready?'
row['example_type'] = 'Reviewed usage example'
row['analysis'] = 'Here ready means cooked, as clarified by the user; emilpraleth is the established cooked-state adjective.'
row['notes'] = (row['notes'] + ' ED-0047 user clarification; original and first proposal in user_32_replacements.json.').strip()
with source.open('w', newline='', encoding='utf-8') as handle:
    writer = csv.DictWriter(handle, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)
journal = json.loads(journal_path.read_text(encoding='utf-8'))
item = next(item for item in journal if item['number'] == 28)
item['action'] = 'applied with cooked-state clarification'
item['after'] = row.copy()
journal_path.write_text(json.dumps(journal, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Applied all 32 replacements')
