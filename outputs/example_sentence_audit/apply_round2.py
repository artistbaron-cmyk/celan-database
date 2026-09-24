"""Apply the user's September 24 batch and five explicit follow-up approvals once."""
import csv,json,re,copy
from pathlib import Path
b=Path(__file__).parent;root=b.parents[1]
assert not (b/'round2_changes.json').exists(),'Already applied'
plan=json.loads((b/'round2_plan.json').read_text())
snap=json.loads((b/'snapshot.json').read_text()); originals={r['entry_id']:r for r in snap['phrases']}
path=root/'data/phrases_and_examples.csv';rows=list(csv.DictReader(path.open()));before=copy.deepcopy(rows)
fields=list(rows[0])+['app_canonical_id','app_headwords','app_excluded_headwords','app_previous_texts','app_grammar_group']
for r in rows:
 for f in fields:r.setdefault(f,'')
byid={r['entry_id']:r for r in rows};outcomes={};grammar=[];added=[]
def norm(t):return re.sub(r'[\s.!?"“”]+',' ',t).strip().lower()
def join(*values):return '; '.join(dict.fromkeys(v.strip() for value in values for v in value.split(';') if v.strip()))
def mark(r,key):
 r['notes']=join(r['notes'],'ED-0044 '+key);r['review_status']='Approved';r['review_reason']='User-approved September 24 example review.'
def update(r,c,e,key):
 old=r['celan_text']
 if norm(old)!=norm(c):r['app_previous_texts']=json.dumps(list(dict.fromkeys(json.loads(r['app_previous_texts'] or '[]')+[old])),ensure_ascii=False)
 if r['translation'].strip('“”"')!=e:r['notes']+=' Previous translation: '+r['translation']
 r.update(celan_text=c,translation=e,example_type='Reviewed usage example');mark(r,key)
def make(c,e,key):
 eid=f'PE-ER2-{len(added)+1:04d}';r={f:'' for f in fields};r.update(entry_id=eid,source_volume='User-reviewed dictionary examples',source_section='September 24, 2026',celan_text=c,translation=e,example_type='Reviewed usage example',canon_status='Canon',relationship_type='reviewed usage');mark(r,key)
 rows.append(r);byid[eid]=r;added.append(eid);return r
def merge(dst,src,key):
 dst['related_entry_ids']=join(dst['related_entry_ids'],src['related_entry_ids']);dst['app_headwords']=join(dst['app_headwords'],src['app_headwords'])
 dst['notes']+=f" Source record {src['entry_id']}: {src['source_volume']} / {src['source_section']} / page {src['page_number']}; {src['notes']}"
 src['app_canonical_id']=dst['entry_id'];mark(src,key);mark(dst,key)
# Explicit duplicate identities; retain every original row for provenance.
for k,p in plan.items():
 if p['kind']!='merge':continue
 r=byid[p['canonical']]
 if p['examples']:update(r,*p['examples'][0],k)
 else:update(r,r['celan_text'][0].lower()+r['celan_text'][1:],r['translation'].strip('“”"'),k)
 m=re.search(r'Note Saved:\s*(.+)',p['notes'])
 if m:r['analysis']=join(r['analysis'],m[1])
 if k=='VAR-PE-V1-0002':r['analysis']=join(r['analysis'],'Also valid: ra var ser lo?')
 for eid in p['retire']:merge(r,byid[eid],k)
 outcomes[k]={'records':[r['entry_id']],'retired':p['retire'],'summary':'One example shown; all source records retained.'}
# The eight approved translations.
for k,p in plan.items():
 if p['kind']=='translation':
  r=byid[p['records'][0]];update(r,*p['examples'][0],k)
  if 'wel ' in r['celan_text']:r['analysis']='Wel is rendered as continuous flow in this user-approved example.'
  if k=='SENSE-PE-EGE1-0045':r['translation']=r['translation'].replace(' [destabilizes in a surge]','');r['analysis']='Here, surges means destabilizes in a surge.'
  outcomes[k]={'records':[r['entry_id']],'summary':'Approved translation applied.'}
labels={
 'PE-S1-0003':'Compound Derivation Formula','PE-S1-0004':'Compound Derivation Formula','PE-S1-0007':'Headword Citation Form','PE-S1-0009':'Phonology Word List','PE-S1-0010':'Headword Citation Form','PE-S1-0011':'Word Form / Citation',
 'PE-S3-0001':'Conceptual Metaphor','PE-S3-0002':'Idiomatic Phrase','PE-S3-0005':'Idiomatic Phrase','PE-S3-0006':'Philosophical Note','PE-S3-0007':'Metaphorical Phrase','PE-S3-0008':'Philosophical Phrase','PE-S3-0009':'Idiomatic Phrase','PE-S3-0010':'Inflected / Bound Form','PE-S3-0011':'Idiomatic Phrase','PE-S3-0012':'Idiomatic Metaphor','PE-S3-0013':'Idiomatic Metaphor','PE-S3-0015':'Proverbial Phrase','PE-S3-0016':'Traditional Title','PE-S3-0017':'Proverbial Phrase','PE-S3-0018':'Compound Form','PE-S3-0019':'Idiomatic Phrase','PE-S3-0020':'Poetic Phrase','PE-S3-0021':'Compound Form','PE-S3-0022':'Noun Phrase','PE-S4B-0005':'Capitalization Contrast Note','PE-S4B-0007':'Capitalization Note'}
teaching_heads={'PE-S3-0001':'Fah','PE-S3-0002':'Pralaen; Morl','PE-S3-0005':'Talaen; Thal','PE-S3-0006':'Thal; Reth','PE-S3-0007':'Thar; Rethvok','PE-S3-0008':'Nor','PE-S3-0009':'Shalaen; Rin','PE-S3-0010':'Bel; -esh','PE-S3-0011':'Talaen; Ohm','PE-S3-0012':'Thar','PE-S3-0013':'Thar','PE-S3-0015':'Var; Shara','PE-S3-0016':'Dral; Aen','PE-S3-0017':'Pralaen; Shara','PE-S3-0018':'Rav; Terra','PE-S3-0019':'Khumrel; Thar','PE-S3-0020':'Zhirin; Arthen','PE-S3-0021':'Zhir; Rathor','PE-S3-0022':'Kelka; Kalrin','PE-S1-0007':'Belshara','PE-S1-0010':'Belthal','PE-S1-0011':'Rethvok'}
for k,p in plan.items():
 if p['kind']!='form':continue
 eid=p['records'][0];r=byid[eid]
 if eid in ['PE-V1-0013','PE-V1-0014','PE-S3-0014']:
  update(r,*p['examples'][0],k);outcomes[k]={'records':[eid],'summary':'Approved sentence replacement applied.'};continue
 # Four source fragments were already replaced in round one: keep both versions distinct.
 if eid in ['PE-S3-0005','PE-S3-0011','PE-S3-0019','PE-S3-0022']:
  r=make(originals[eid]['celan_text'],originals[eid]['translation'],k)
  r['notes']+=' Original fragment from '+eid+'; the earlier approved replacement remains at that ID.'
 r['example_type']='Teaching note: '+('Number System / Scaled Form' if eid.startswith('PE-V3-02') else labels[eid]);mark(r,k)
 r['app_headwords']=teaching_heads.get(eid,'')
 group='Number System' if eid.startswith('PE-V3-02') else 'Euphony' if eid in ['PE-S1-0003','PE-S1-0004'] else 'Phonology' if eid=='PE-S1-0009' else 'Capitalization' if eid in ['PE-S4B-0005','PE-S4B-0007'] else ''
 if group:r['app_grammar_group']=group;r['app_excluded_headwords']='*';grammar.append(r['entry_id'])
 outcomes[k]={'records':[r['entry_id']],'summary':'Original material labeled and moved; approved sentence examples added.'}
# Additional number formulas identified only in placement findings belong in Number System too.
for k,p in plan.items():
 if p['kind']!='placement':continue
 for eid in p['records']:
  if eid not in byid:continue
  r=byid[eid]
  if re.match(r'PE-V[34]-0(?:2\d\d|084)$',eid) and re.search('number|math',r['example_type'],re.I):
   r['example_type']='Teaching note: Number System / Scaled Form';r['app_grammar_group']='Number System';r['app_excluded_headwords']='*';grammar.append(eid);mark(r,k)
# Add/reuse the approved direct examples. Never create a second copy for repeated instructions.
for k,p in plan.items():
 if p['kind'] not in ['form','placement']:continue
 targets='; '.join(p['headwords']);used=[]
 for c,e in p['examples']:
  matches=[r for r in rows if not r['app_canonical_id'] and not r['example_type'].startswith('Teaching note:') and norm(r['celan_text'])==norm(c)]
  r=next((r for r in matches if r['example_type'].startswith('Reviewed')),matches[0] if matches else None)
  if r is None:r=make(c,e,k)
  elif not r['example_type'].startswith('Reviewed'):update(r,c,e,k)
  elif r['translation']!=e and e not in r['analysis']:
   r['analysis']=join(r['analysis'],'Also translated: '+e)
  r['app_headwords']=join(r['app_headwords'],targets);mark(r,k);used.append(r['entry_id'])
  if k=='LINK--aen':r['analysis']=join(r['analysis'],{'shalaen':'Shal + -aen → Shalaen (see).','pralaen':'Pral + -aen → Pralaen (make).','velaen':'Vel + -aen → Velaen (eat).'}[c.split()[0]])
  if k=='LINK--eth':r['analysis']=join(r['analysis'],{'woreth':'Wor + -eth → Woreth (full).','feneth':'Fen + -eth → Feneth (hot).','shaleth':'Shal + -eth → Shaleth (gold/bright).'}[c.split()[-1].rstrip('.')])
  # Existing copies of this approved sentence share one identity, including inline display resolution.
  for other in matches:
   if other is not r:merge(r,other,k)
 if k not in outcomes:outcomes[k]={'records':[],'summary':'Approved examples attached; unrelated examples detached from this entry.'}
 outcomes[k]['examples']=list(dict.fromkeys(used))
 if p['kind']=='placement' and k not in ['LINK--aen','LINK--eth']:
  for eid in p['records']:
   if eid in byid and eid not in used:
    byid[eid]['app_excluded_headwords']=join(byid[eid]['app_excluded_headwords'],targets);mark(byid[eid],k)
# Apply the five corrections to old exact copies as well as newly supplied examples.
corrections={'theon dren kal thal':'tal theon thal an Ilin.','lorin Ilin belshara an vethor.':'lorin belshara Ilin shan vethor.','I dren shaleth thaal.':'rinaen dren-ian shaleth thaal.','var Ilin an tren kinn.':'var tren serin an dren.'}
for old,new in corrections.items():
 dst=next(r for r in rows if norm(r['celan_text'])==norm(new) and not r['app_canonical_id'])
 dst['app_previous_texts']=json.dumps(list(dict.fromkeys(json.loads(dst['app_previous_texts'] or '[]')+[old])),ensure_ascii=False)
 for r in rows:
  if r is not dst and norm(r['celan_text'])==norm(old):merge(dst,r,'follow-up approvals')
# Possessive examples are attached to the suffix, not negative Ka.
for eid in ['PE-V1-0003','PE-V1-0005']:byid[eid]['app_headwords']=join(byid[eid]['app_headwords'],'-ka')
# Resolve any aliases formed through overlapping approvals.
for r in rows:
 seen=set()
 while r['app_canonical_id'] and byid[r['app_canonical_id']]['app_canonical_id']:
  assert r['entry_id'] not in seen;seen.add(r['entry_id']);r['app_canonical_id']=byid[r['app_canonical_id']]['app_canonical_id']
for o in outcomes.values():
 for f in ['records','examples']:
  if f in o:o[f]=list(dict.fromkeys(byid[e]['app_canonical_id'] or e for e in o[f]))
# Relink forward references to canonical examples without discarding their source rows.
linkchanges=[]
for name in ['lexicon','lexicon_expansions']:
 pth=root/'data'/f'{name}.csv';rs=list(csv.DictReader(pth.open()));changed=False
 for r in rs:
  old=r['related_entry_ids'];new=join('; '.join(byid[i]['app_canonical_id'] or i if i in byid else i for i in map(str.strip,old.split(';')) if i))
  if new!=old:r['related_entry_ids']=new;changed=True;linkchanges.append({'file':name,'id':r['entry_id'],'before':old,'after':new})
 if changed:
  with pth.open('w',newline='') as f:w=csv.DictWriter(f,fieldnames=list(rs[0]),lineterminator='\n');w.writeheader();w.writerows(rs)
with path.open('w',newline='') as f:w=csv.DictWriter(f,fieldnames=fields,lineterminator='\n');w.writeheader();w.writerows(rows)
oldby={r['entry_id']:r for r in before}
changes=[{'before':oldby.get(r['entry_id']),'after':r} for r in rows if oldby.get(r['entry_id']) is None or any(r.get(f,'')!=oldby[r['entry_id']].get(f,'') for f in fields)]
(b/'round2_changes.json').write_text(json.dumps({'changes':changes,'links':linkchanges,'outcomes':outcomes,'added':added,'grammar':list(dict.fromkeys(grammar))},ensure_ascii=False,indent=2)+'\n')
print({'findings':len(outcomes),'added_records':len(added),'changed_existing':len(changes)-len(added),'retired_duplicate_records':sum(bool(r['app_canonical_id']) for r in rows),'grammar_records':len(set(grammar))})
