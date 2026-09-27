"""Align working lesson examples while preserving prior text in a journal."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CSV = ROOT / 'data/grammar_rules_working.csv'
JOURNAL = Path(__file__).with_name('working_grammar_changes.json')
FIXES = {
    'The Core Idea: Action Comes First': {'example_1_celan': 'var I dren.', 'example_2_celan': 'ohmaen I Ya.'},
    'Default Word Order: Verb-Subject-Object': {
        'core_rule': 'A standard Celan sentence begins with the verb, followed by the subject and then the object or destination. With var, a destination may be bare or explicitly marked with an.',
        'example_1_celan': 'var I dren.', 'example_2_celan': 'var I an dren.',
        'example_2_english': 'I go to the water (explicit destination).'},
    'Questions and Commands': {'example_1_celan': 'ra var Ya?', 'example_2_celan': 'va var dren!'},
    'Negation': {'example_1_celan': 'ver var I dren.', 'example_2_celan': 'ra ver var ser?'},
    'Conditionals': {
        'example_1_celan': 'rath var ser, nor-var I dren.',
        'example_2_celan': 'rath var Ya dren, nor-var I dren.',
        'example_2_english': 'If you go to the water, I will go to the water.'},
    'Personal Pronouns': {'example_1_celan': 'var I dren.', 'example_2_celan': 'ra var Ya?'},
    'Core Prepositions': {'example_1_celan': 'var dren', 'example_2_celan': 'var I ser ser'},
    'Space and Time: An and Nor': {'example_1_celan': 'varan I an Varthas.', 'example_2_celan': 'nor-var I an Varthas.'},
    'Identity as Essence': {'example_1_celan': 'tal theon thal an Ilin.', 'example_1_english': 'The neutral person gives balance to us.'},
    'Gendered and Neutral Terms in Use': {
        'example_1_celan': 'tal theon thal an Ilin.',
        'example_1_english': 'The neutral person gives balance to us.',
        'example_2_celan': 'nethaen azon an nethor.',
        'example_2_english': 'The feminine man rests on the seat.'},
    'Politeness and Respect Marking': {
        'example_1_celan': 'var I dren, Li-Ser.',
        'example_2_celan': 'aen I var Li-Seren-en an Varthas.',
        'example_2_english': 'I speak to the honored guardian in the city.'},
    'Cultural Variation in Social Speech': {
        'example_1_celan': 'aen Ya varash, Ser.',
        'example_1_english': 'You speak of the future, friend.',
        'example_2_celan': 'var I dren, Li-Ser.'},
}

def main():
    assert not JOURNAL.exists(), 'Working grammar was already updated'
    with CSV.open(newline='', encoding='utf-8') as handle:
        reader = csv.DictReader(handle)
        fields, rows = reader.fieldnames, list(reader)
    changes = []
    for row in rows:
        if row['unit_title'] not in FIXES:
            continue
        before = row.copy()
        row.update(FIXES[row['unit_title']])
        if row != before:
            changes.append({'unit_title': row['unit_title'], 'before': before, 'after': row.copy()})
    assert len(changes) == len(FIXES)
    with CSV.open('w', newline='', encoding='utf-8') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)
    JOURNAL.write_text(json.dumps(changes, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Updated {len(changes)} working grammar lessons')

if __name__ == '__main__':
    main()
