import csv
import json
from pathlib import Path

base = Path(__file__).resolve().parent
root = base.parent.parent
app = json.loads((base / 'app_inventory.json').read_text())
phrases = {row['entry_id']: row for row in csv.DictReader((root / 'data/phrases_and_examples.csv').open())}
expressions = {row['expression_id']: row for row in csv.DictReader((root / 'data/expressions.csv').open())}
grammar = {row['id']: row for row in app['grammar']}
items = []


def add(finding, surface, identifier, current, detail=''):
    items.append(dict(finding=finding, surface=surface, identifier=identifier,
                      current_wording=current, detail=detail))


for identifier in ['RG-VSO', 'RG-QUESTIONS-COMMANDS', 'GR-V1-0014', 'GR-V1-0015',
                   'GR-V1-0017', 'GR-V3-0001', 'GR-V3-0004',
                   'LESSON-GENDER-ADDRESS-SOCIAL']:
    row = grammar[identifier]
    add('SP-01', 'App grammar card', identifier, row['examples'] or row['wording'])

for identifier in ['PE-V2-0033', 'PE-V3-0118', 'PE-V3-0128', 'PE-V3-0131',
                   'PE-V3-0141', 'PE-V3-0145']:
    row = phrases[identifier]
    add('SP-02' if identifier == 'PE-V2-0033' else 'SP-03', 'Example', identifier,
        f"{row['celan_text']} — {row['translation']}", row['example_type'])

for identifier in ['PE-V1-0004', 'PE-V1-0006', 'PE-V1-0011', 'PE-V3-0025',
                   'PE-V3-0027', 'PE-V3-0148', 'PE-V4-0074', 'PE-V4-0076',
                   'PE-BIAOBF1-0004', 'PE-BIAOBF1-0006', 'PE-BIAOBF1-0010',
                   'PE-BIAOBF1-0027', 'PE-BIAOBF1-0034', 'PE-BIAOBF1-0035',
                   'PE-BIAOBF1-0038', 'PE-RABFE2-0036']:
    row = phrases[identifier]
    add('SP-04', 'Example', identifier,
        f"{row['celan_text']} — {row['translation']}", row['example_type'])

for identifier in [
    'PE-V1-0010', 'PE-V1-0011', 'PE-V2-0002', 'PE-V2-0007',
    'PE-V2-0078', 'PE-V2-0085', 'PE-V2-0093', 'PE-V2-0098',
    'PE-V2-0109', 'PE-V2-0110', 'PE-V2-0111', 'PE-V2-0112',
    'PE-V2-0113', 'PE-V2-0117', 'PE-V2-0118', 'PE-V3-0030',
    'PE-V3-0033', 'PE-V3-0035', 'PE-V3-0039', 'PE-V3-0041',
    'PE-V3-0045', 'PE-V3-0050', 'PE-V3-0087', 'PE-V3-0088',
    'PE-V3-0091', 'PE-V3-0094', 'PE-V3-0095', 'PE-V3-0099',
    'PE-V3-0108', 'PE-V3-0125'
]:
    row = phrases[identifier]
    add('SP-11', 'Example', identifier,
        f"{row['celan_text']} — {row['translation']}", row['example_type'])

for identifier in ['EX-LC1C-0002', 'EX-LC1C-0004', 'EX-LC1C-0006']:
    row = expressions[identifier]
    add('SP-05', 'Expression link', identifier,
        f"{row['celan_expression']} → {row['dictionary_headwords']}",
        f"source_entry_ids: {row['source_entry_ids']}")

for row in app['entries']:
    if not row['direct']:
        add('SP-07', 'App headword', row['headword'],
            ' | '.join(f"{use['type']}: {use['meaning']}" for use in row['senses']),
            f"source IDs: {'; '.join(row['source_ids'])}; related={len(row['related'])}; teaching={len(row['teaching'])}")
    if len(row['senses']) > 1:
        add('SP-08', 'Multi-sense headword', row['headword'],
            ' | '.join(f"{use['type']}: {use['meaning']}" for use in row['senses']),
            f"direct examples={len(row['direct'])}")

row = phrases['PE-EGE1-0019']
add('SP-09', 'Historical example', 'PE-EGE1-0019',
    f"{row['celan_text']} — {row['translation']}", row['example_type'])

with (base / 'affected_items.csv').open('w', newline='') as out:
    writer = csv.DictWriter(out, fieldnames=['finding', 'surface', 'identifier',
                                              'current_wording', 'detail'])
    writer.writeheader()
    writer.writerows(items)
print(f'Wrote {len(items)} affected-item references')
