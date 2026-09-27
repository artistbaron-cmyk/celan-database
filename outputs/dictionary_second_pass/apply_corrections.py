"""Apply the approved second-pass corrections with a complete before/after journal."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PHRASES = ROOT / 'data/phrases_and_examples.csv'
EXPRESSIONS = ROOT / 'data/expressions.csv'
JOURNAL = Path(__file__).with_name('applied_changes.json')

# Only rewrite wording when the existing dictionary licenses the whole sentence.
REWRITE = {
    'PE-V2-0033': ('moraen mbalan an dren an Varthas.', 'A pillar of the community stands at the water in the city.'),
    'PE-V1-0004': ('Ya-ka tera', 'Your home (singular).'),
    'PE-V3-0025': ('rinaen dren-ian shaleth ther La-ka dren.', 'My water is brighter than their water.'),
    'PE-V3-0027': ('rinaen dren-ian shaleth thaal morldren.', 'My water is the brightest of the mountain waters.'),
    'PE-V3-0148': ('rinaen thar-ian kal an tera.', 'My heart is strong at home.'),
    'PE-V4-0074': ('aen Ya lianor-ya.', 'You speak your thought.'),
    'PE-V4-0076': ('ra aen Ya kelrin-ya?', 'Do you speak your name?'),
    'PE-BIAOBF1-0004': ('khosaen I ser aiv an breka-ian.', 'I cough with pain in my chest.'),
    'PE-BIAOBF1-0006': ('va drenselaen vesh-ya.', 'Wash your back.'),
    'PE-BIAOBF1-0010': ('vekaen I kavvek an korkalvar-ian.', 'I carry the jar on my shoulder.'),
    'PE-BIAOBF1-0027': ('drenselaen I xarmetha-ian.', 'I wash my skin.'),
    'PE-BIAOBF1-0034': ('kelvorthamaen I emil ser zekin-ian.', 'I chew food with my teeth.'),
    'PE-BIAOBF1-0035': ('jelaen I emil ser lera-ian.', 'I taste food with my tongue.'),
    'PE-BIAOBF1-0038': ('numaen I dren shan numor-ian.', 'I swallow water through my throat.'),
    'PE-RABFE2-0036': ('karethaen I mek ser korpir-ian.', 'I use the tool with my thumb.'),
    'PE-V2-0113': ('shalil eshthael an dren.', 'The breeze drifts by the water.'),
    'PE-V3-0030': ('shalil tavan ser felka.', 'The parent moves lightly with the child.'),
    'PE-V3-0033': ('shalil velar an dren.', 'The elder moves lightly by the water.'),
    'PE-V3-0035': ('aen velkavor var Terra.', 'The ancestor speaks to the Earth.'),
    'PE-V3-0039': ('rinaen zhivorin ser tavan an dren.', 'The sibling-in-law is with the parent by the water.'),
    'PE-V3-0045': ('aen velxorin var Terra.', 'The elder ancestor speaks to the Earth.'),
    'PE-V3-0050': ('shalil velmarin an dren.', 'The honorary elder moves lightly by the water.'),
    'PE-V3-0108': ('tha-var ser dren.', 'The friend went to the water.'),
}

HISTORICAL = {
    # SP-03: claims participants, timing, readiness, or posture that the text lacks.
    'PE-V3-0118', 'PE-V3-0128', 'PE-V3-0131', 'PE-V3-0141', 'PE-V3-0145',
    # SP-04: several distinct claims cannot be repaired by a possession suffix alone.
    'PE-V1-0006', 'PE-V1-0011',
    # SP-11: nor is temporal; these lines also need a new sentence or interpretation.
    'PE-V1-0010', 'PE-V2-0002', 'PE-V2-0007', 'PE-V2-0078', 'PE-V2-0085',
    'PE-V2-0093', 'PE-V2-0098', 'PE-V2-0109', 'PE-V2-0110', 'PE-V2-0111',
    'PE-V2-0112', 'PE-V2-0117', 'PE-V2-0118', 'PE-V3-0041', 'PE-V3-0087',
    'PE-V3-0088', 'PE-V3-0091', 'PE-V3-0094', 'PE-V3-0095', 'PE-V3-0099',
    'PE-V3-0125',
}

NEW_EXAMPLES = [
    ('PE-SP2-0001', 'vanesh varadan ser Ya.', 'The merchant trades with you.', 'Varadan; Vanesh', 'PE-V3-0118'),
    ('PE-SP2-0002', 'nor-var I an Eshvan.', 'I will go to the shop.', 'Eshvan; Var', 'PE-V3-0128'),
    ('PE-SP2-0003', 'nor-var varadan var Ya ser shenakar.', 'The merchant will go toward you with coinage.', 'Varadan; Shenakar', 'PE-V3-0131'),
    ('PE-SP2-0004', 'rinaen theren an kaleth kaveth.', 'The village is at the old fortress.', 'Theren; Kaleth', 'PE-V3-0141'),
    ('PE-SP2-0005', 'ra rinaen emil an tera?', 'Is the meal at home?', 'Emil; Tera', 'PE-V3-0145'),
    ('PE-SP2-0006', 'drenvaraen eshnor. rinaen eshweknor belwek.', 'Weather changes. Climate is a recurring pattern.', 'Eshnor; Eshweknor; Drenvaraen; Belwek', 'PE-EGE1-0019'),
]

EXPRESSION_FIXES = {
    'EX-LC1C-0002': {'dictionary_headwords': 'Ilin; -ka'},
    'EX-LC1C-0004': {'dictionary_headwords': 'Inko; -ka'},
    'EX-LC1C-0006': {'dictionary_headwords': 'nor-ka', 'source_entry_ids': 'RM-V4-0003'},
}


def read_csv(path):
    with path.open(newline='', encoding='utf-8') as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)


def write_csv(path, fields, rows):
    with path.open('w', newline='', encoding='utf-8') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)


def main():
    assert not JOURNAL.exists(), 'Journal already exists; corrections were already applied'
    fields, phrases = read_csv(PHRASES)
    by_id = {row['entry_id']: row for row in phrases}
    assert len(by_id) == len(phrases)
    assert not (set(REWRITE) & HISTORICAL)
    assert set(REWRITE) | HISTORICAL <= set(by_id)
    changes = []
    for entry_id, row in by_id.items():
        if entry_id not in REWRITE and entry_id not in HISTORICAL:
            continue
        before = row.copy()
        if entry_id in REWRITE:
            row['celan_text'], row['translation'] = REWRITE[entry_id]
        else:
            row['example_type'] = 'Historical example pending correction'
            row['analysis'] = ('Retained as a source witness. The current Celan text does not fully '
                               'support its English gloss or current grammar; do not model ordinary usage on it.')
        row['notes'] = (row['notes'].rstrip() + ' ED-0045 second-pass review; original wording in '
                        'outputs/dictionary_second_pass/applied_changes.json.').strip()
        changes.append({'entry_id': entry_id, 'before': before, 'after': row.copy()})
    for entry_id, celan, english, headwords, source_id in NEW_EXAMPLES:
        assert entry_id not in by_id
        row = dict.fromkeys(fields, '')
        row.update(entry_id=entry_id, source_volume='Second-pass dictionary review',
                   source_section='Reviewed replacement examples', page_number='2026-09-27',
                   celan_text=celan, translation=english, example_type='Reviewed usage example',
                   canon_status='Canon', notes=f'ED-0045 replacement for {source_id}; original retained as historical.',
                   related_entry_ids=source_id, relationship_type='reviewed replacement',
                   review_status='Approved', review_reason='Approved by user instruction to make justified corrections.',
                   app_headwords=headwords)
        phrases.append(row)
        changes.append({'entry_id': entry_id, 'before': None, 'after': row.copy()})
    efields, expressions = read_csv(EXPRESSIONS)
    expression_changes = []
    for row in expressions:
        if row['expression_id'] in EXPRESSION_FIXES:
            before = row.copy()
            row.update(EXPRESSION_FIXES[row['expression_id']])
            expression_changes.append({'expression_id': row['expression_id'], 'before': before, 'after': row.copy()})
    assert len(expression_changes) == len(EXPRESSION_FIXES)
    write_csv(PHRASES, fields, phrases)
    write_csv(EXPRESSIONS, efields, expressions)
    JOURNAL.write_text(json.dumps({'phrase_changes': changes, 'expression_changes': expression_changes},
                                  ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Applied {len(changes)} phrase changes and {len(expression_changes)} expression fixes')


if __name__ == '__main__':
    main()
