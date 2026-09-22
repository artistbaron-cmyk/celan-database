import csv,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'outputs/dictionary_review'
examples=[
('Velkrel','rinaen velkrel an verdor.','There is a breeze in the forest.'),
('Varan','varan serilin an teremil.','The sister resides at home.'),
('Serathrin','aen serathrin lian.','The confidant speaks the truth.'),
('Zhivor','rinaen zhivor an Varthas.','The ancestral household is in the city.'),
('Em','em, dar I.','Um, I will wait.'),
('Varin','varin I aen var Ya an teremil.','I know that you go to the home.'),
('Nkathal','rinaen nkathal an thar-ian.','There is sadness in my heart.'),
('Vrak','rinaen shena vrak.','The money is gone.'),
('Varshel','var I shan varshel.','I go across the road.'),
('Noraen','noraen liorin aelin.','The teacher instructs the pupil.'),
('Thalesh','rinaen thalesh an shalor.','The sacred balance ceremony is at the sanctuary.'),
('Thalor','rinaen mekral thalor.','The mechanic is outside.'),
('Karjor','rinaen karjor kaleth.','The impact is powerful.'),
('Kavel','rinaen kavel an lianor-ian.','There is a memory gap in my thought.'),
('Khumrel','aen serathrin ser khumrel.','The confidant speaks with compassion.'),
('Terrarav','rinaen terrarav an thar-ian.','There is yearning for home in my heart.'),
('Zhirrathor','rinaen zhirrathor an zhivor.','There is historical continuity in the family line.')]
# Plain present-tense hesitation: do not introduce an unmarked future claim.
examples=[(t,c,'Um, I wait.' if t=='Em' else e) for t,c,e in examples]
def read(name):return list(csv.DictReader((ROOT/'data'/name).open(newline='')))
def write(name,rs):
 with (ROOT/'data'/name).open('w',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rs[0]),lineterminator='\n');w.writeheader();w.writerows(rs)
lex=read('lexicon_expansions.csv');phr=read('phrases_and_examples.csv');by={r['celan_term']:r for r in lex if r['approval_batch']=='Dictionary Review 1'};ids={r['entry_id'] for r in phr};records=[]
for n,(term,celan,english) in enumerate(examples,1):
 id=f'PE-DR2-{n:04}';assert id not in ids
 entry=by[term];row={k:'' for k in phr[0]};row.update(entry_id=id,source_volume='Dictionary Review 1: Second Examples',source_section='Reviewed usage > '+term,celan_text=celan,translation=english,example_type='Reviewed usage example',analysis='Checked against approved headword senses, verb-first order, and ED-0038 possession where used.',canon_status='Canon',notes='ED-0040: user requested the second reviewed examples; authored and checked during integration.',related_entry_ids=entry['entry_id'],relationship_type='related usage',review_status='Approved');phr.append(row);entry['related_entry_ids']+='; '+id;records.append({'term':term,'flag':next(a['flag'] for a in json.load(open(OUT/'integration/added_entries.json')) if a['entry']['entry_id']==entry['entry_id']),'entry':row})
write('lexicon_expansions.csv',lex);write('phrases_and_examples.csv',phr)
(OUT/'integration/second_examples.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
added=json.load(open(OUT/'integration/added_entries.json'));res=json.load(open(OUT/'resolutions.json'));byid={r['entry_id']:r for r in lex}
for a in added:
 a['entry']=byid[a['entry']['entry_id']];a['example_count']=len(a['entry']['related_entry_ids'].split(';'));id=a['flag'];res[id]['lookup_followup']=[s for s in res[id]['lookup_followup'] if 'second reviewed example' not in s.lower()];rp=OUT/'integration'/f'{id}.json';r=json.loads(rp.read_text());r['added_entry']=a;r['followups']=[s for s in r['followups'] if 'second reviewed example' not in s.lower()];rp.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
res['F048']['lookup_followup']=[];res['F048']['summary']+=' Standalone Shalilaen/Welaen follow-up closed at the user’s request.'
(OUT/'resolutions.json').write_text(json.dumps(res,ensure_ascii=False,indent=2)+'\n');(OUT/'integration/added_entries.json').write_text(json.dumps(added,ensure_ascii=False,indent=2)+'\n')
p=OUT/'integration/outcomes.json';d=json.loads(p.read_text());d['second_examples_needed']=[];d['second_examples_added']=17;d['standalone_followup_closed_by_user']=['Shalilaen','Welaen'];p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=OUT/'completion.md';lines=p.read_text().splitlines();lines=[s for s in lines if not s.startswith('Follow-up: This restored word has one') and not s.startswith('Follow-up: Shalilaen and Welaen')];lines=['**Second reviewed examples:** All 17 added; see [sentences and translations](second_examples.md).' if s.startswith('**Second reviewed examples:**') else '**Standalone lookup follow-up:** Closed at the user’s request; no new entries for Shalilaen or Welaen.' if s.startswith('**Standalone lookup entries not added:**') else 'The ordinary expansion coverage requirement is now met: each restored entry has at least two linked examples.' if s.startswith('The normal expansion validator reports') else s for s in lines];p.write_text('\n'.join(lines)+'\n')
lines=['# Second reviewed examples','','The user requested these 17 additions. All use approved dictionary meanings.','', '| Word | Celan | English |','|---|---|---|']
for t,c,e in examples:lines.append(f'| {t} | {c} | {e} |')
(OUT/'second_examples.md').write_text('\n'.join(lines)+'\n')
p=ROOT/'knowledgebase/11_editorial_canon_policy.md';p.write_text(p.read_text()+'''\n## ED-0040: Second Reviewed Examples\n\nStatus: Approved by the user's instruction to add the 17 second reviewed examples.\n\nPE-DR2-0001 through PE-DR2-0017 supply an additional usage sentence for each previously single-example restored entry. Each sentence is linked bidirectionally to its headword and checked against the approved senses and current possession rules. Full text is recorded in `outputs/dictionary_review/second_examples.md`. The user also closed the standalone-entry follow-up for Shalilaen and Welaen; no additional headwords are introduced.\n''')
print('Added and linked 17 second examples; closed the two standalone-entry follow-ups.')
