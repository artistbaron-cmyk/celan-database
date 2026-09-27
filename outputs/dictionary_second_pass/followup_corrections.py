"""Close newly exposed complex-clause examples found during final grammar collation."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CSV = ROOT / 'data/phrases_and_examples.csv'
JOURNAL = Path(__file__).with_name('complex_clause_changes.json')
REWRITE = {'PE-V3-0022': ('varin I aen var Ya dren.', 'I know that you go to the water.')}
HISTORICAL = {'PE-V3-0023', 'PE-V3-0024', 'PE-V3-0028', 'PE-V3-0029'}

def main():
    assert not JOURNAL.exists(), 'Complex-clause changes already applied'
    with CSV.open(newline='', encoding='utf-8') as handle:
        reader = csv.DictReader(handle)
        fields, rows = reader.fieldnames, list(reader)
    changed = []
    for row in rows:
        entry_id = row['entry_id']
        if entry_id not in REWRITE and entry_id not in HISTORICAL:
            continue
        before = row.copy()
        if entry_id in REWRITE:
            row['celan_text'], row['translation'] = REWRITE[entry_id]
        else:
            row['example_type'] = 'Historical example pending correction'
            row['analysis'] = ('Source witness for an unestablished relative or counterfactual construction; '
                               'do not use as an ordinary sentence model.')
        row['notes'] = (row['notes'].rstrip() + ' ED-0045 complex-clause follow-up; before/after in '
                        'outputs/dictionary_second_pass/complex_clause_changes.json.').strip()
        changed.append({'entry_id': entry_id, 'before': before, 'after': row.copy()})
    assert len(changed) == len(REWRITE) + len(HISTORICAL)
    with CSV.open('w', newline='', encoding='utf-8') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)
    JOURNAL.write_text(json.dumps(changed, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Applied {len(changed)} complex-clause dispositions')

if __name__ == '__main__':
    main()
