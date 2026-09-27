"""Cross-check reviewed dispositions against the rebuilt app and exports."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent

def rows(path):
    with path.open(newline='', encoding='utf-8') as handle:
        return list(csv.DictReader(handle))

affected = rows(HERE / 'affected_items.csv')
phrases = {r['entry_id']: r for r in rows(ROOT / 'data/phrases_and_examples.csv')}
expressions = {r['expression_id']: r for r in rows(ROOT / 'data/expressions.csv')}
entries = rows(ROOT / 'data/dictionary_entries.csv')
report = rows(ROOT / 'data/dictionary_report.csv')
app = json.loads((HERE / 'app_inventory_after.json').read_text(encoding='utf-8'))
by_word = {r['headword']: r for r in app['entries']}
changes = json.loads((HERE / 'applied_changes.json').read_text(encoding='utf-8'))
changed_ids = {r['entry_id'] for r in changes['phrase_changes']}

assert len(app['entries']) == 1496
assert len(entries) == len(report) == 1607
assert all(r['example_count'].isdigit() for r in entries)
assert all(not r['example_1_celan'] for r in entries if r['use_index'] != '1')
assert all(not r['related_example_1_celan'] for r in entries if r['use_index'] != '1')
seen_report_headwords = set()
for row in report:
    if row['headword'] in seen_report_headwords:
        assert not row['example_celan']
        assert not row['related_example_celan']
    seen_report_headwords.add(row['headword'])
assert 'family_roots' in report[0] and 'root_word' not in report[0]
assert all(r['example_scope'] for r in entries + report)

for finding in ('SP-03', 'SP-04', 'SP-11'):
    ids = {r['identifier'] for r in affected if r['finding'] == finding}
    assert ids <= changed_ids, (finding, sorted(ids - changed_ids))
    for entry_id in ids:
        phrase = phrases[entry_id]
        if phrase['example_type'] == 'Historical example pending correction':
            assert all(entry_id not in group['direct'] for group in app['entries'])
            assert any(entry_id in group['teaching'] for group in app['entries']), entry_id

for index in range(1, 7):
    entry_id = f'PE-SP2-{index:04d}'
    assert entry_id in phrases
    assert any(entry_id in group['direct'] for group in app['entries'])
for index in range(1, 13):
    entry_id = f'PE-SP2C-{index:04d}'
    assert entry_id in phrases
    assert any(entry_id in group['direct'] for group in app['entries'])

remaining = json.loads((HERE / 'remaining_57_changes.json').read_text(encoding='utf-8'))
assert len(remaining) == 58
assert len({row['app_headwords'] for row in remaining}) == 57
for row in remaining:
    group = by_word[row['app_headwords']]
    target_section = 'related' if row['app_headwords'] in {'Eshen', 'Eth'} else 'direct'
    assert row['entry_id'] in group[target_section], (row['app_headwords'], row['entry_id'])
    assert row['celan_text'] and row['translation']
entries_by_word = {}
report_by_word = {}
for row in entries:
    entries_by_word.setdefault(row['headword'], []).append(row)
for row in report:
    report_by_word.setdefault(row['headword'], []).append(row)
assert entries_by_word['Eshen'][0]['related_example_1_celan'] == 'rinaen kelvor-eshen kadreneth.'
assert entries_by_word['Eth'][0]['related_example_count'] == '2'
assert entries_by_word['Eth'][0]['related_example_1_celan']
assert entries_by_word['Eth'][0]['related_example_2_celan']
assert report_by_word['Eth'][0]['related_example_celan']
assert report_by_word['Eth'][0]['related_example_2_celan']
baseline = json.loads((HERE / 'app_inventory.json').read_text(encoding='utf-8'))
baseline_by_word = {row['headword']: row for row in baseline['entries']}
for term, group in by_word.items():
    assert group['pronunciation'] == baseline_by_word[term]['pronunciation'], term
    assert group['senses'] == baseline_by_word[term]['senses'], term

assert expressions['EX-LC1C-0002']['dictionary_headwords'] == 'Ilin; -ka'
assert expressions['EX-LC1C-0004']['dictionary_headwords'] == 'Inko; -ka'
assert expressions['EX-LC1C-0006']['dictionary_headwords'] == 'nor-ka'
assert expressions['EX-LC1C-0006']['source_entry_ids'] == 'RM-V4-0003'
assert 'RM-V4-0003' in {r['entry_id'] for r in rows(ROOT / 'data/roots_and_morphology.csv')}

grammar = {r['id']: r for r in app['grammar']}
assert 'var I dren.' in grammar['RG-VSO']['examples']
assert 'var I an dren.' in grammar['RG-VSO']['examples']
assert 'La-ka dren' in grammar['GR-V3-0004']['examples']
assert 'Theon ian kal nor dren' not in str(app['grammar'])
assert all(not r['direct'] or len(set(r['direct'])) == len(r['direct']) for r in app['entries'])
print('PASS: all 57 coverage entries, affected examples, historical placement, links, grammar, and export scope')
