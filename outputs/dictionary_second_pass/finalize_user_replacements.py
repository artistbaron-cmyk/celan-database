"""Finish the user's 32 example replacements after checking approved word senses."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
SOURCE = ROOT / 'data/phrases_and_examples.csv'
JOURNAL = HERE / 'user_32_replacements.json'
records = json.loads(JOURNAL.read_text(encoding='utf-8'))

# Retain the user's English; use established vocabulary where the proposed Celan
# would otherwise change a word's meaning. #28 awaits the sense of "ready".
REPAIRS = {
    2: 'rinaen Azon an eshthael.',
    3: 'shalil Theon-ian ser dren.',
    6: 'vanesh velmek an van nor-ka.',
    12: "thal'vokaen Tharvin dren ser morl.",
    24: 'va min Ya varshel an dren, Serilin!',
    25: 'emil ka shena? nor-var I an Eshvan nor aenor.',
    27: 'moraen Theren an Kaleth Rathor.',
    31: 'rath var Ya an dren, nor-vekaen I shena var Ya.',
}
with SOURCE.open(newline='', encoding='utf-8') as handle:
    reader = csv.DictReader(handle)
    fields = reader.fieldnames
    rows = list(reader)
by_id = {row['entry_id']: row for row in rows}
for item in records:
    number = item['number']
    row = by_id[item['entry_id']]
    if number == 28:
        item['action'] = 'held: general readiness is not established'
        item['after'] = row.copy()
        continue
    if number in REPAIRS:
        assert row['example_type'] == 'Historical example pending correction', number
        row['celan_text'] = REPAIRS[number]
        row['translation'] = item['proposed_english']
        row['example_type'] = 'Reviewed usage example'
        row['analysis'] = 'User-approved meaning expressed with established Celan vocabulary.'
        row['notes'] = (row['notes'] + ' ED-0047 reviewed replacement; original and user proposal in user_32_replacements.json.').strip()
        item['action'] = 'applied with semantic repair' if row['celan_text'] != item['proposed_celan'] else 'applied as supplied'
    else:
        # The user's explicit "English Translation (Unchanged)" controls #16-32.
        if 16 <= number <= 32:
            row['translation'] = item['proposed_english']
        item['action'] = 'applied as supplied'
    item['after'] = row.copy()
with SOURCE.open('w', newline='', encoding='utf-8') as handle:
    writer = csv.DictWriter(handle, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)
JOURNAL.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Applied', sum(item['action'].startswith('applied') for item in records), 'of 32; held #28')
