"""Publish the twelve reviewed lexical coverage examples approved in this pass."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CSV = ROOT / 'data/phrases_and_examples.csv'
JOURNAL = Path(__file__).with_name('coverage_changes.json')
EXAMPLES = [
    ('Kadon', 'var kadon an teremil.', 'The masculine woman goes home.'),
    ('Zhilva', 'Zhilva!', 'Hello!'),
    ('Amthaen', 'Amthaen!', 'Hi!'),
    ('Nekvar', 'Nekvar!', 'Good morning!'),
    ('Kelithor', 'Kelithor!', 'Good afternoon!'),
    ('Tlosen', 'Tlosen!', 'Good evening!'),
    ('Jexhaer', 'Jexhaer!', 'Good night!'),
    ('Revalen', 'Revalen!', 'Farewell!'),
    ('Zharinor', 'Zharinor!', 'See you soon!'),
    ('Vrekthael', 'Vrekthael!', 'Greetings!'),
    ('Vial', 'rinaen vial an thar-ian.', 'There is joy in my heart.'),
    ('Aenvor', 'drenselaen I aenvor-ian.', 'I wash my nose.'),
]

def main():
    assert not JOURNAL.exists(), 'Coverage batch already applied'
    with CSV.open(newline='', encoding='utf-8') as handle:
        reader = csv.DictReader(handle)
        fields, rows = reader.fieldnames, list(reader)
    ids = {row['entry_id'] for row in rows}
    added = []
    for index, (headword, celan, english) in enumerate(EXAMPLES, 1):
        entry_id = f'PE-SP2C-{index:04d}'
        assert entry_id not in ids
        row = dict.fromkeys(fields, '')
        row.update(entry_id=entry_id, source_volume='Second-pass dictionary review',
                   source_section='Lexical coverage batch 1', page_number='2026-09-27',
                   celan_text=celan, translation=english, example_type='Reviewed usage example',
                   canon_status='Canon', notes='ED-0045; reviewed from draft_batch_1.md.',
                   relationship_type='reviewed lexical usage', review_status='Approved',
                   review_reason='Approved by user instruction to make justified corrections.',
                   app_headwords=headword)
        rows.append(row)
        added.append(row)
    with CSV.open('w', newline='', encoding='utf-8') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)
    JOURNAL.write_text(json.dumps(added, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Added {len(added)} reviewed lexical examples')

if __name__ == '__main__':
    main()
