"""Integrate the four explicitly approved words into the current app layer."""
import csv
import io
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / 'dictionary/app_data'
OUT = Path(__file__).parent
BATCH = 'Distance and Quantity Limits 1'

def read(name):
    return list(csv.DictReader((APP / name).open()))

def append_csv(path, rows):
    with path.open() as f:
        fields = next(csv.reader(f))
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=fields, lineterminator='\n')
    writer.writerows([{k: row.get(k, '') for k in fields} for row in rows])
    with path.open('a', newline='') as f:
        f.write(buf.getvalue())

def write_csv(path, rows):
    fields = list(rows[0])
    with path.open('w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)

entries, senses, examples, grammar = [read(n) for n in (
    'dictionary_entries.csv', 'dictionary_senses.csv',
    'dictionary_examples.csv', 'grammar_guide.csv')]
assert not any(r['id'] in {'nevu', 'arin', 'mbetu', 'senu'} for r in entries), 'Already integrated'
before = {name: read(name) for name in (
    'dictionary_entries.csv', 'dictionary_senses.csv', 'dictionary_examples.csv', 'grammar_guide.csv')}
(OUT / 'integration_before.json').write_text(json.dumps(before, ensure_ascii=False, indent=2) + '\n')

words = [
    ('nevu', 'Nevu', '/neh-voo/', 'Adjective',
     'Near; a short spatial distance from a stated or understood reference point',
     'New independent primitive for spatial proximity; not derived from intimacy, smallness, or participant deixis.'),
    ('arin', 'Arin', '/ah-reen/', 'Adjective',
     'Far; a long spatial distance from a stated or understood reference point',
     'Independent spatial adjective developed from the far-reaching component recorded in Zharin. Zharin retains its established distant-relative meaning.'),
    ('mbetu', 'Mbetu', '/m-beh-too/', 'Particle',
     'At least; the stated quantity or any greater quantity, including the stated boundary',
     'New independent quantity-limit particle; no compound derivation. Initial mb is articulated together.'),
    ('senu', 'Senu', '/seh-noo/', 'Particle',
     'At most; the stated quantity or any smaller quantity, including the stated boundary',
     'New independent quantity-limit particle; no compound derivation.'),
]
new_entries, new_senses = [], []
for i, (key, term, pronunciation, category, meaning, derivation) in enumerate(words, 1):
    source = f'LX-DQL1-{i:04}'
    metadata = {'origins': [], 'nationalUses': [], 'derivations': [derivation], 'variants': []}
    new_entries.append(dict(id=key, headword=term, pronunciation=pronunciation,
                            source_entry_ids=source, override_json='{}', metadata_json=json.dumps(metadata), approval_batch=BATCH))
    note = ('Use thal to name the reference point. Near/far do not by themselves specify route length, travel time, contact, or reachability. See GR-DQL1-0001.'
            if key in {'nevu', 'arin'} else
            'Place directly before the number and its noun or measure phrase. The boundary itself is included. See GR-DQL1-0003.')
    new_senses.append(dict(headword_id=key, sense_order='1', visible='Yes', word_type=category,
                           meaning=meaning, usage_note=note, source_entry_ids=source, sense_id=key+'-s1'))
new_senses.append(dict(headword_id='sha', sense_order=str(max(int(s['sense_order']) for s in senses if s['headword_id']=='sha')+1),
    visible='Yes', word_type='Particle', meaning='How far; closing question particle in the spatial distance question arin ... sha?',
    usage_note='In ra rinaen [place] arin [thal reference] sha?, asks the degree of spatial separation without assuming the place is far. Limited distance construction; see GR-DQL1-0002. The established manner/method use remains valid.',
    source_entry_ids='GR-DQL1-0002', sense_id='sha-s2'))
append_csv(APP/'dictionary_entries.csv', new_entries)
append_csv(APP/'dictionary_senses.csv', new_senses)

sentences = [
    ('rinaen evan nevu thal deni.', 'The market is near here.', ['nevu']),
    ('rinaen evan nevu thal theren.', 'The market is near the village.', ['nevu']),
    ('rinaen evan arin thal deni.', 'The market is far from here.', ['arin']),
    ('rinaen theren arin thal evan.', 'The village is far from the market.', ['arin']),
    ('ra rinaen evan arin thal deni sha?', 'How far is the market from here?', ['arin', 'sha']),
    ('rinaen evan nevu ther theren.', 'The market is nearer than the village.', ['nevu']),
    ('rinaen evan arin thaal.', 'The market is farthest.', ['arin']),
    ('tal I mbetu peth shena.', 'I give at least five coins.', ['mbetu']),
    ('va tal mbetu peth shen morlak var I.', 'Give me at least five measures of grain.', ['mbetu']),
    ('tal I senu peth shena.', 'I give at most five coins.', ['senu']),
    ('va tal senu del shen morlak var I.', 'Give me no more than two measures of grain.', ['senu']),
]
new_examples = []
for i, (text, translation, placements) in enumerate(sentences, 1):
    for key in placements:
        sense_id = 'sha-s2' if key=='sha' else key+'-s1'
        sense = next(s for s in new_senses if s['sense_id']==sense_id)
        order = 1 + sum(r['headword_id']==key and r['section']=='direct' for r in examples+new_examples)
        note = 'Approved Distance and Quantity Limits 1. Text example; audio recording pending.'
        if i==6: note += 'Both destinations are compared from the same understood reference point.'
        if i==7: note += 'The context identifies the compared destinations and their shared reference point.'
        new_examples.append(dict(headword_id=key, section='direct', display_order=str(order),
            entry_id=f'PE-DQL1-{i:04}', celan_text=text, translation=translation,
            example_type='Approved usage example', analysis='', source_volume='Editorial Canon Expansion',
            source_section=BATCH, notes=note, sense_meaning=sense['meaning'], display_kind='sentence', sense_id=sense_id))
append_csv(APP/'dictionary_examples.csv', new_examples)

definitions = [
    ('GR-DQL1-0001', 'Near, far, and the reference point',
     'Nevu means near and arin means far in physical space. Use rinaen + place/person/object + nevu/arin, optionally followed by thal + reference point. Without thal, context supplies the reference point. Deni means the speaker\'s sphere; denya means the listener\'s sphere. Existing ther and thaal comparisons apply: nevu ther is nearer, arin ther is farther, nevu thaal is nearest, and arin thaal is farthest. Comparisons use the same reference point and superlatives require an understood comparison set. These words do not by themselves specify travel time, route length, contact, safety, or reachability. Not-near does not necessarily mean far.',
     'rinaen evan nevu thal deni. — The market is near here.\nrinaen theren arin thal evan. — The village is far from the market.\nrinaen evan nevu ther theren. — The market is nearer than the village.\nrinaen evan arin thaal. — The market is farthest.', ['Nevu','Arin','Thal','Ther','Thaal']),
    ('GR-DQL1-0002', 'Asking how far',
     'To ask for spatial distance, use ra rinaen + place/person/object + arin + optional thal reference + sha? In this construction, closing sha asks the degree of spatial separation. It does not assume the destination is far; a valid answer may say it is near or supply a distance. Without sha, ra rinaen [place] arin? ordinarily asks whether the place is far. Sha retains its established manner/method use elsewhere. This is a specific distance-question extension, not a general rule for how many, how much, or every adjective.',
     'ra rinaen evan arin thal deni sha? — How far is the market from here?\nrinaen evan nevu thal deni. — The market is near here.\nra rinaen evan arin thal deni? — Is the market far from here?', ['Arin','Nevu','Sha','Ra','Thal']),
    ('GR-DQL1-0003', 'At least and at most',
     'Place mbetu or senu directly before a numerical quantity and its noun or measure phrase. Mbetu means at least: that amount or more. Senu means at most: that amount or less. Both include the stated boundary. Mbetu peth permits five and larger quantities; senu peth permits five and smaller quantities. These limits describe quantity, not whether it is sufficient for a purpose. Worlian retains its meaning enough. A unit or counted noun must be stated or understood; these particles do not establish new units or a new noun-plural rule.',
     'tal I mbetu peth shena. — I give at least five coins.\nva tal mbetu peth shen morlak var I. — Give me at least five measures of grain.\ntal I senu peth shena. — I give at most five coins.\nva tal senu del shen morlak var I. — Give me no more than two measures of grain.', ['Mbetu','Senu','Shen','Shena','Worlian']),
]
template = next(r for r in grammar if r['id']=='GR-SIP1-0001')
new_rules = []
for key, title, wording, usage, links in definitions:
    rule = {k:'' for k in template}
    rule.update(record_type='rule', id=key, entry_id=key, rule_name=title, category='Syntax',
        displayCategory='Sentence Structure', purpose=title+'.', original_wording=wording,
        examples=usage, notes='User-approved 2026-10-29; Distance and Quantity Limits 1.',
        relatedHeadwords=json.dumps(links), source_volume='Editorial Canon Expansion',
        source_section=BATCH, page_number='2026-10-29', canon_status='Canon', lessonId='LESSON-SENTENCE-SHAPE',
        preview=wording.split('. ')[0]+'.', relationship_type='expansion', review_status='Approved')
    rule['_fields']=json.dumps([k for k,v in rule.items() if v and not k.startswith('_')])
    rule['_types']=json.dumps({'relatedHeadwords':'json'})
    new_rules.append(rule)
for rule in grammar:
    if rule['record_type']=='rule' and rule['id']=='LESSON-SENTENCE-SHAPE':
        rule['childRuleIds']=json.dumps(json.loads(rule['childRuleIds'])+[r['id'] for r in new_rules])
    if rule['id']=='GR-SIP1-0001':
        rule['notes'] += ' GR-DQL1-0002 adds the specific arin ... sha? distance-degree question.'
write_csv(APP/'grammar_guide.csv', grammar+new_rules)

families = json.loads((APP/'dictionary_families.json').read_text())
for key, *_ in words:
    families[key] = dict(familyRoots=[], sharedAffixes=[], components=[], notes=[], relatedEntries=[], relatedGroups=[])
    families[key]['notes'] = [next(w[5] for w in words if w[0]==key)]
families['arin']['relatedEntries']=[{'id':'zharin','term':'Zharin'}]
for component in families['zharin']['components']:
    if component['form']=='arin':
        component.update(id='word:arin', kind='word', target='arin')
families['zharin']['relatedEntries'].append({'id':'arin','term':'Arin'})
families['zharin']['relatedGroups'].append({'key':'word:arin','label':'Arin','entries':[{'id':'arin','term':'Arin'}]})
(APP/'dictionary_families.json').write_text(json.dumps(families, ensure_ascii=False, indent=2)+'\n')

# Record primitives without authorizing an unreviewed derivative family.
root_rows=[]
for i,(key,term,pronunciation,category,meaning,derivation) in enumerate(words,1):
    root_rows.append(dict(form=term.upper(), entry_type='morpheme' if category=='Particle' else 'root',
        status='promoted_root' if key=='arin' else ('created_morpheme' if category=='Particle' else 'created_root'),
        source_reference=f'LX-DQL1-{i:04}', core_meaning=meaning,
        function_in_use='Independent approved '+category.lower()+'; no unlisted derivatives authorized.',
        evidence_hint=term, notes='User-approved 2026-10-29. '+derivation))
append_csv(ROOT/'data/expanded_root_database.csv',root_rows)

manifest = dict(batch=BATCH, approval_date='2026-10-29', words=new_entries, senses=new_senses,
                examples=new_examples, grammar_rules=[r['id'] for r in new_rules],
                audio_pending_ids=sorted({r['entry_id'] for r in new_examples}),
                before_counts=dict(headwords=len(entries),visible_senses=sum(s['visible']=='Yes' for s in senses),example_placements=len(examples)),
                note='Current app files are authoritative per docs/data_layers.md. Historical expansion/source CSVs were not rewritten.')
(OUT/'approved_integration.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'headwords_added':len(new_entries),'senses_added':len(new_senses),'sentences_added':len(sentences),'placements_added':len(new_examples),'rules_added':len(new_rules)}))
