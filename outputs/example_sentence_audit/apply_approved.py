import csv,json
from pathlib import Path
b=Path(__file__).parent;root=b.parents[1]
export=json.loads((b/'approved_decisions.json').read_text());assert export['revision']==json.loads((b/'summary.json').read_text())['capturedAt']
if (b/'applied_changes.json').exists():raise SystemExit('Already applied; do not rerun this one-shot integration.')
rows=list(csv.DictReader((root/'data/phrases_and_examples.csv').open()));before={r['entry_id']:dict(r) for r in rows};snap=json.loads((b/'snapshot.json').read_text());byterm={g['term'].lower():g for g in snap['entries']}
targets={'PE-S3-0005':['Talaen','Drenvor','Pralor'],'PE-S3-0011':['Talaen','Morlak','Felka'],'PE-S3-0019':['Aen','Serathrin','Khumrel'],'PE-S3-0022':['Kalrin','Kalkel'],'PE-S4A-0005':['Rinaen','Ohm','Ilin'],'PE-EGE1-0018':['Var','Jor','Dren'],'PE-EGE1-0049':['Shalaen','Jor'],'PE-EGE1-0058':['Rinaen','Jor','Esh']}
changes=[]
for key,d in export['decisions'].items():
 if d['decision']!='Approve proposal':continue
 for eid,edit in d['edits'].items():
  r=next(r for r in rows if r['entry_id']==eid)
  if key=='LANG-001':
   r['example_type']='Historical example pending correction';r['analysis']='Not recommended for ordinary use: kavel is not while. Retained as a source note pending correction.'
  else:
   assert edit['celan'] and edit['english'];r['celan_text']=edit['celan'].strip();r['translation']=edit['english'].strip()
   r['example_type']='Reviewed phrase' if key=='LANG-003' else 'Reviewed usage example'
   r['analysis']='User-reviewed replacement for '+key+'.'
   ids=[e['entry_id'] for t in targets[r['entry_id']] for e in byterm[t.lower()]['entries'] if e['entry_id'].startswith('LX-')]
   r['related_entry_ids']='; '.join(dict.fromkeys(ids))
  r['notes']+=' ED-0043: applied approved sentence-audit decision '+key+'; prior record in outputs/example_sentence_audit/applied_changes.json.'
  changes.append({'finding':key,'before':before[eid],'after':dict(r)})
with (root/'data/phrases_and_examples.csv').open('w',newline='') as f:w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
# Remove stale forward references when the replacement no longer demonstrates the linked word.
linkchanges=[]
for name in ['lexicon','lexicon_expansions']:
 p=root/'data'/f'{name}.csv';rs=list(csv.DictReader(p.open()));dirty=False
 for r in rs:
  old=r['related_entry_ids'];ids=[s.strip() for s in old.split(';') if s.strip()]
  ids=[i for i in ids if i not in targets or r['celan_term'].lower() in [t.lower() for t in targets[i]]]
  if ids!=[s.strip() for s in old.split(';') if s.strip()]:r['related_entry_ids']='; '.join(ids);dirty=True;linkchanges.append({'file':name,'id':r['entry_id'],'before':old,'after':r['related_entry_ids']})
 if dirty:
  with p.open('w',newline='') as f:w=csv.DictWriter(f,fieldnames=list(rs[0]),lineterminator='\n');w.writeheader();w.writerows(rs)
(b/'applied_changes.json').write_text(json.dumps({'sentences':changes,'links':linkchanges},ensure_ascii=False,indent=2)+'\n')
print('Applied',len(changes),'sentence decisions and corrected',len(linkchanges),'stale entry links.')
