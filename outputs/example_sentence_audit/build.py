import json,re,collections,html,hashlib,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).parent))
from inspect import present,norm
b=Path(__file__).parent;x=json.loads((b/'snapshot.json').read_text());entries=x['entries'];phrases=x['phrases'];source={r['entry_id']:r for r in phrases};links=collections.defaultdict(list);allrows=dict(source)
for g in entries:
 for rank,e in enumerate(g['examples']):
  eid=e.get('entry_id') or 'OVERRIDE-'+hashlib.sha256((e['celan_text']+'|'+e.get('translation','')).encode()).hexdigest()[:12]
  allrows.setdefault(eid,dict(e,entry_id=eid))
  links[eid].append(dict(headword=g['term'],headword_id=g['id'],visible=rank<5,rank=rank+1))
flags=[]
def flag(key,category,title,why,proposal,ids=(),heads=(),confidence='Review needed',celan='',english=''):
 records=[dict(id=i,celan=allrows[i]['celan_text'],english=allrows[i].get('translation',''),type=allrows[i].get('example_type','Inline/override'),previous_approval=allrows[i].get('review_status',''),notes=allrows[i].get('notes',''),displayed_under=[v['headword'] for v in links[i] if v['visible']]) for i in ids]
 flags.append(dict(id=key,category=category,title=title,why=why,proposal=proposal,confidence=confidence,records=records,headwords=list(heads),suggested_celan=celan,suggested_english=english))
# App-wide behavior, individually evidenced below.
flag('APP-01','App presentation','The app does not separate direct usage from word-family or teaching examples','The picker combines explicit links, reverse links and spelling matches, then puts the first five under Used In A Sentence. Those are different kinds of evidence.','Show Direct usage, Related forms, and Teaching notes separately. Prefer reviewed direct examples; retain source provenance.',confidence='Confirmed app behavior')
flag('APP-02','App presentation','Additional examples are hidden after the first five','The app returns more than five examples for some entries but renders only the first five, with no way to view the rest.','Add a count and View all examples. Keep a short preview.',heads=[g['term'] for g in entries if len(g['examples'])>5],confidence='Confirmed app behavior')
flag('APP-03','App presentation','Examples are attached to a whole word, not to its individual senses','A word with multiple meanings has one shared example list. The reader cannot tell which meaning each sentence demonstrates.','Associate reviewed examples with the sense they illustrate; label examples awaiting that assignment. Do not infer sense assignments from spelling alone.',heads=[g['term'] for g in entries if len(g['uses'])>1 and g['examples']],confidence='Confirmed app behavior')
flag('APP-04','Coverage','Some headwords have no example','These entries have no example returned by the app. That is a coverage gap, not proof that the words are wrong. Roots and affixes may need a labeled construction instead of a sentence.','Develop examples in reviewed batches; do not insert generated sentences automatically.',heads=[g['term'] for g in entries if not g['examples']],confidence='Confirmed coverage gap')
# Concrete linguistic conflicts, referenced against current app meanings.
manual=[
('PE-EGE1-0019','Kavel is translated as while','Kavel means forgetfulness / memory gap / loss of awareness, not while. The same line also renders jor as changes, although the displayed verb is surge / burst forth.','Remove this from ordinary usage examples pending a replacement. Keep the approved Kavel memory-gap example; repair the environmental sentence separately.','',''),
('PE-S3-0019','Khumrel is treated as the verb listen','The approved Khumrel entry is the noun compassion / empathetic listening. This English gloss turns it into an infinitive. The source marks the phrase as a conceptual metaphor.','Label the old line as a historical metaphor note. Use the already-reviewed sentence below as ordinary usage.','aen serathrin ser khumrel.','The confidant speaks with compassion.'),
('PE-S3-0022','Word becomes decree, and an is used to imply ownership','Kelka means a word or speech particle; Kalkel is decree. An means at/in, while titled possession uses possessor-ka.','Replace the phrase with the established decree word and the approved possession pattern. It remains a phrase, not a complete sentence.','Kalrin-ka kalkel',"The sovereign’s decree"),
('PE-S3-0005','Talaen is translated as find','Talaen is displayed as give/offer or take/receive. Find is not a displayed sense.','Decide whether to revise the English gloss or supply a different Celan phrase. Keep it out of ordinary sentence examples until resolved.','',''),
('PE-S3-0011','Talaen is again translated as find','The same give/take verb is glossed as find connection. A metaphor may be intended, but it is not explained as one in the normal example presentation.','Explain the intended metaphor or replace the phrase with a reviewed example of the displayed meaning.','',''),
('PE-S4B-0008','The translation adds my without a my marker','The English says my desire, but there is no -ian. Thar-ka is an established desire headword; its ending should not be interpreted automatically as a possessive for I.','Review the intended possession. Either supply the approved personal possession construction or remove my from the English after checking the entire sentence.','',''),
('PE-S4A-0005','A literal analysis is presented as natural English','Is-in-essence Connection/Love with Us is an analytical gloss, not natural English.','Use the natural translation below and retain the literal gloss as a teaching note.','Rinaen Ohm ser Ilin.','Connection is with us.'),
]
for idx,(eid,title,why,proposal,c,e) in enumerate(manual,1):flag('LANG-'+str(idx).zfill(3),'Meaning / translation',title,why,proposal,[eid],confidence='Conflict or distinction evidenced in the app',celan=c,english=e)
manualids={r[0] for r in manual}
for word,eng,meaning in [('jor',r'\b(change[sd]?|changing|spreads?|increases?|worsens?)\b','surge / burst forth'),('wel',r'\b(flow[sz]?|flows|flowing)\b','sharing / unity')]:
 for r in phrases:
  if r['entry_id'] in manualids:continue
  if re.search(r'(?<![\w\-])'+word+r'(?![\w\-])',norm(r['celan_text'])) and re.search(eng,r['translation'],re.I):
   flag('SENSE-'+r['entry_id'],'Meaning / translation',f'{word.capitalize()} uses a broader English meaning',f'The app displays {word} as {meaning}. This translation uses {re.search(eng,r["translation"],re.I)[0]}. It may be an intended metaphor, but the sentence does not explain that extension.','Confirm the intended meaning. Revise the sentence/translation or explicitly document this usage; do not automatically add a new dictionary sense.',[r['entry_id']])
# Teaching material and fragments are not asserted to be bad Celan.
for eid,r in allrows.items():
 text=r['celan_text'];typ=r.get('example_type','');vis=any(l['visible'] for l in links[eid])
 if not text.strip() or not r.get('translation','').strip():flag('EMPTY-'+eid,'Missing content','Example is missing a sentence or translation','Both fields are needed to serve as a bilingual example.','Supply the missing content or keep this record outside ordinary examples.',[eid],confidence='Confirmed missing field')
 if re.search('counterexample|phonology',typ,re.I) and vis:
  flag('TEACH-'+eid,'App presentation','Teaching or incorrect example occupies an ordinary sentence slot','The app labels this record, but still places it inside Used In A Sentence. A warning label does not make it a recommended example.','Move it to a separate Teaching notes / What not to write section.',[eid],confidence='Confirmed placement')
 elif (re.search(r'\+|->|→|\s/\s|\d+\s*[+=]',text) or len(text.split())==1 and not text.endswith(('!','?','.')) or re.search('Conceptual metaphor|Phonetic fossil|Standard form|Poetic form|Capitalization contrast',typ,re.I)) and vis:
  flag('FORM-'+eid,'App presentation','A phrase, word form, or teaching illustration is shown as a sentence','This record is a word, phrase, comparison, or formation illustration. Such material can be useful, but its type is not distinguished in the sentence section.','Keep the example under a suitable label such as Phrase, Word formation, Metaphor, or Capitalization illustration; review any separate language flag on this record.',[eid],confidence='Confirmed source/display distinction')
# All suspicious placement links, kept distinct from language corrections.
for g in entries:
 misses=[e for e in g['examples'][:5] if not present(g,e['celan_text'])]
 if not misses:continue
 ids=[e.get('entry_id') or 'OVERRIDE-'+hashlib.sha256((e['celan_text']+'|'+e.get('translation','')).encode()).hexdigest()[:12] for e in misses]
 rootlike=g['term'].endswith('-') or any(u.get('rootWord') for u in g['uses'])
 suffix=g['term'].startswith('-')
 reason='The displayed headword is not found as a separate word or a recognized inflected form in these examples. Some use a derived word or a bound component instead; others are reverse-linked teaching notes.'
 if suffix:reason='These examples may demonstrate the suffix in a fused or inflected form. They need an explicit breakdown identifying the suffix and its function, rather than being offered without explanation.'
 if rootlike:reason+=' This is a root-related entry, so a labeled derivative demonstration may be appropriate.'
 flag('LINK-'+g['id'],'Example placement',g['term']+': distinguish direct usage from related forms',reason,'Review each attachment. Keep a labeled construction/derivative illustration where appropriate; otherwise detach it from this entry. Preserve the sentence at its proper word.',ids,[g['term']])
# Known homonym boundary errors deserve a definite explanation rather than a regex flag.
for f in flags:
 if f['id']=='LINK-ka':f['why']='The Ka entry means without/no. I-ka dren and Ilin-ka emil demonstrate possessive -ka, which your approved rule treats separately. Those phrases do not illustrate negative standalone ka.';f['proposal']='Place the possessive phrases under -ka. Keep negative examples under Ka. Review ka-shen as a compound separately.';f['confidence']='Confirmed conflict with ED-0038'
# Duplicates and translation variants: do not conflate synonyms with contradictions or ignore Terra case.
pairs=collections.defaultdict(list);sentences=collections.defaultdict(list)
for r in phrases:
 pairs[(r['celan_text'].strip(),r['translation'].strip())].append(r['entry_id']);sentences[r['celan_text'].strip()].append(r['entry_id'])
for pair,ids in pairs.items():
 if len(ids)>1:flag('DUP-'+ids[0],'Duplicate records','The same bilingual example is stored more than once','The Celan and English fields are identical. The app deduplicates exact pairs within an entry, but each source record can still acquire different links or editorial notes.','Keep source records and provenance; give the app one canonical example identity with all source references.',ids,confidence='Confirmed duplicate data')
for sentence,ids in sentences.items():
 if len({source[i]['translation'].strip() for i in ids})>1:flag('VAR-'+ids[0],'Translation variants','The same Celan sentence has different English versions','These may be valid paraphrases or synonyms, not contradictions. Separate English wording causes the app to treat them as different examples.','Review the variants, select a preferred display translation, and preserve valid alternatives as notes.',ids,confidence='Confirmed wording variation; not automatically an error')
# Every source/inline record and every headword appears in coverage.
coverage=[]
for eid,r in allrows.items():
 fs=[f['id'] for f in flags if any(v['id']==eid for v in f['records'])]
 coverage.append(dict(id=eid,celan=r['celan_text'],english=r.get('translation',''),type=r.get('example_type','Inline/override'),flags=fs,placements=links[eid],status='Flagged for review' if fs else 'No issue identified by the applied checks; not individually certified'))
headwords=[dict(id=g['id'],term=g['term'],available=len(g['examples']),visible=min(5,len(g['examples'])),senses=len(g['uses'])) for g in entries]
summary=dict(capturedAt=x['capturedAt'],headwords=len(entries),source_records=len(phrases),source_and_inline_records=len(allrows),visible_placements=sum(h['visible'] for h in headwords),headwords_without_examples=sum(not g['examples'] for g in entries),headwords_with_hidden_examples=sum(len(g['examples'])>5 for g in entries),flags=len(flags),flagged_sentence_records=sum(bool(r['flags']) for r in coverage),categories=dict(collections.Counter(f['category'] for f in flags)),scope='Dictionary entry example sections; all source phrase records and all app-selected inline/override examples. Grammar-guide examples, expression cards and generated Phrase Builder replies are separate surfaces and are not certified by this audit.',limits='Full inventory and structural checks, with targeted semantic review against current dictionary meanings. No claim that every unflagged translation or grammatical construction has been independently verified. No sentences or app files changed.')
for name,obj in [('findings',flags),('coverage',coverage),('headword_coverage',headwords),('summary',summary)]: (b/(name+'.json')).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,indent=2))
