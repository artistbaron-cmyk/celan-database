import json,re,collections,csv,unicodedata
from pathlib import Path
out=Path(__file__).parent
s=json.loads((out/'snapshot.json').read_text());d=json.loads((out/'source_tables.json').read_text())
lookup={g['id']:g for g in s}
examples={}
for g in s:
 for i,e in enumerate(g['examples']):
  k=(e.get('celan_text',''),e.get('translation',''))
  bucket=examples.setdefault(k,{'celan':k[0],'english':k[1],'ids':set(),'headwords':set(),'visible_on':set(),'types':set()})
  bucket['ids'].add(e.get('entry_id','OVERRIDE'));bucket['headwords'].add(g['term']);bucket['types'].add(e.get('example_type',''))
  if i<5:bucket['visible_on'].add(g['term'])
ex=[{k:sorted(v) if isinstance(v,set) else v for k,v in e.items()} for e in examples.values()]
(out/'examples.json').write_text(json.dumps(ex,ensure_ascii=False,indent=2)+'\n')
bycel=collections.defaultdict(list)
for e in ex:bycel[e['celan'].lower().strip()].append(e)
conflicts=[v for v in bycel.values() if len({e['english'].lower().strip() for e in v if e['english']})>1]
first=collections.defaultdict(list);unknown=collections.defaultdict(list)
forms={g['id']:g['id'] for g in s}
for g in s:
 for e in g['entries']:
  for v in e.get('variant_forms','').split(';'):
   if v.strip():forms[v.lower().strip()]=g['id']
for e in ex:
 tokens=re.findall("[a-z]+(?:['‘’’-][a-z]+)*",e['celan'].lower())
 if tokens and tokens[0] in forms:
  g=lookup[forms[tokens[0]]]
  if not any(u['type'] in ['Verb','Interjection','Particle','Preposition','Conjunction','Modal'] for u in g['uses']):first[g['term']].append(e)
 for token in set(tokens):
  options=[token,token.replace('‘',"'").replace('’',"'")]
  options += [token[:-len(suffix)] for suffix in ['in','n','al','ath','as'] if token.endswith(suffix)]
  if not any(t in forms for t in options) and not all(t in forms or t+'-' in forms or '-'+t in forms for t in token.split('-')):unknown[token].append(e)
def serial(x):return json.dumps(x,ensure_ascii=False,indent=2)+'\n'
(out/'translation_conflicts.json').write_text(serial(conflicts))
(out/'noun_first_examples.json').write_text(serial(first))
(out/'unknown_tokens.json').write_text(serial(unknown))
print('unique example pairs',len(ex),'visible pairs',sum(bool(e['visible_on']) for e in ex))
print('same text different translations',len(conflicts))
print('noun-first headwords',[(k,len(v)) for k,v in first.items()])
print('unmatched tokens',len(unknown),sorted([(k,len(v)) for k,v in unknown.items()],key=lambda x:-x[1])[:80])
