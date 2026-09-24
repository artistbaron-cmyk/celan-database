import json,re
from pathlib import Path
b=Path(__file__).parent
x=json.loads((b/'received_decisions_2026_09_24.json').read_text())['decisions']
f={f['id']:f for f in json.loads((b/'findings.json').read_text())}
plan={}
for k,d in x.items():
 n=d['notes']; pairs=[]
 # Explicit Celan/translation blocks.
 for m in re.finditer(r'Celan:\s*([^\n]+)\n(?:Gloss:[^\n]*\n)?(?:Revised Translation|Translation|English):\s*"([^"\n]+)"',n):
  cel=re.sub(r'\s*\((?:LX|PE)-[^)]+\)','',m[1]).strip();pairs.append([cel,m[2]])
 # Inline quoted translations.
 for line in n.splitlines():
  m=re.search(r'(.+?)\s*\("([^"\n]+)"',line)
  if m:
   cel=m[1].strip()
   if ': ' in cel:cel=cel.split(': ',1)[1]
   pairs.append([cel,m[2]])
  elif ' = ' in line:
   a,c=line.split(' = ',1);pairs.append([a.strip(),c.strip()])
 # Special format for the updated valid sentence.
 if k=='FORM-PE-S3-0014':pairs=[['var I an vaar.','I go in peace.']]
 if k in ['LINK--aen','LINK--eth']:
  pairs=[[r['celan'],r['english']] for r in f[k]['records']]
 corrections={
  'theon dren kal thal.':['tal theon thal an Ilin.','The neutral person gives balance to us.'],
  'lorin ilin belshara an vethor.':['lorin belshara Ilin shan vethor.','Duty guides us through the shadow.'],
  'i dren shaleth thaal.':['rinaen dren-ian shaleth thaal.','My water is the brightest.'],
  'var ilin an tren kinn.':['var tren serin an dren.','Three friends go to the water.'],
 }
 if k=='LINK-azon':pairs=[['nethaen azon an nethor.','The feminine man sits on the chair.']]
 clean=[]
 for cel,eng in pairs:
  if cel=='inaen oven morthera an shara.':cel='rinaen oven morthera an shara.'
  cel,eng=corrections.get(cel.lower(),[cel,eng])
  # Preserve proper names, I, and deliberately emphasized entities inside sentences.
  cel=cel[0].lower()+cel[1:] if cel else cel
  if cel and cel.rstrip('"')[-1] not in '.!?':cel+='.'
  if [cel,eng] not in clean:clean.append([cel,eng])
 if k.startswith(('DUP-','VAR-')):
  ids=[r['id'] for r in f[k]['records']];canon=ids[0]
  m=re.search(r'(?:Canonical Record to Keep:|Merge into)\s*(PE-[A-Z0-9-]+)',n)
  if m:canon=m[1]
  cel=re.search(r'(?:Standardized Celan|Canonical Text|Corrected Canonical Text):\s*([^\n]+)',n)
  english=re.search(r'Display Translation:\s*"([^"\n]+)"',n)
  if cel:
   c=cel[1].split(' (')[0].strip().removeprefix('Celan: ')
   e=english[1] if english else (clean[-1][1] if clean else None)
   if e:clean=[[c,e]]
  plan[k]={'kind':'merge','canonical':canon,'retire':[i for i in ids if i!=canon],'examples':clean,'notes':n}
 else:plan[k]={'kind':'translation' if k.startswith('SENSE-') else 'form' if k.startswith(('FORM-','TEACH-')) else 'placement','records':[r['id'] for r in f[k]['records']],'headwords':f[k]['headwords'],'examples':clean,'notes':n}
assert len(plan)==135
for k,p in plan.items():
 if p['kind']!='merge':assert p['examples'],k
(b/'round2_plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
for k,p in plan.items():
 print(k, p['examples'])
