import json,re,unicodedata,collections
from pathlib import Path
x=json.loads((Path(__file__).parent/'snapshot.json').read_text())
def norm(s):return unicodedata.normalize('NFKC',s).lower().replace('’',"'")
def present(g,text):
 text=norm(text); tokens=re.findall(r"[-\w']+",text)
 forms=[g['term'],*g['aliases'],*[v.strip() for e in g['entries'] for v in e.get('variant_forms','').split(';') if v.strip()]]
 for form in forms:
  f=norm(form)
  if f.startswith('-'):
   if any(t.endswith(f) and len(t)>len(f) for t in tokens):return True
  elif f.endswith('-'):
   if any(t.startswith(f) and len(t)>len(f) for t in tokens):return True
  else:
   fs={f,f+('n' if f[-1:] in 'aeiou' else 'in')}
   for token in tokens:
    t=token
    t=re.sub(r'^(tha|nor|ver|li)-','',t)
    t=re.sub(r'-(ian|ya|eshen|ka|esh|en)$','',t)
    if token in fs or t in fs:return True
 return False
if __name__=='__main__':
 misses=[]
 for g in x['entries']:
  for e in g['examples'][:5]:
   if not present(g,e['celan_text']):misses.append((g,e))
 print('miss links',len(misses),'headwords',len({g['id'] for g,e in misses}))
 for g,e in misses[:100]:print(g['term'],'::',e['celan_text'],'::',e.get('translation'))
