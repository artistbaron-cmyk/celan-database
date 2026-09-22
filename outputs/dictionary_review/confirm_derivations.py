import csv,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'outputs/dictionary_review'
confirmed={
'Velkrel':'Velk ice/frozen water, from Vel coolness/stillness + -rel soft flow or gentle movement; the established breeze word evokes the soft flow of cool air. Velk retains its physical ice meaning.',
'Shalil':'Shal light/radiance/hope + -il continuous light motion; motion imagined as effortless light across a surface.',
'Zhivor':'Zhir lineage or thread through time + Vor place of bond or active role; the approved historical smoothing of this word yields Zhivor.',
'Evan':'Established non-productive locative noun related to Van commercial place; e- is not established as a general productive prefix.',
'Shenakar':'Shen measure/coin + historical akar currency or exchange unit; akar is recorded only as a component of this word, not a new productive root.',
'Em':'Independent conversational hesitation sound. No historical or etymological connection to Emil food/meal.',
'Varin':'Independent cognition verb. No etymological connection to the marine component with matching spelling in Jekvarin.',
'Shena':'Established individual noun formation from Shen measure/currency. This does not establish -a as a universal noun-forming suffix.',
'Vrak':'Trerran desert dialect word; unsegmented primitive.',
'Theren':'Ter dwelling/home place + -en collective or settlement place; the approved euphonic aspiration in this word changes Ter to Ther-. This does not replace honorific -en.',
'Serilin':'Ser friend/kin + -il affectionate kinship diminutive + -in individual participant. The dedicated everyday meaning is sister/female sibling; the components do not broaden the headword to generic kin or sibling.',
'Aelin':'Ael young/growing + -in individual participant.',
'Im':'Physical concrete extension of IM internal essence, underlying mechanism, or abstract result-state: device, instrument, mechanism.',
'Varshel':'Var travel/move + shel pathway or route component.',
'Varral':'Var move + -ral agent/practitioner: one who carries out the activity. Independent Ral retains caretaker/watcher meanings.',
'Vorkaral':'Vor active role/place of action + Kar tool-work/mechanical force + nominal agent -al one engaged in continuous work. This records the explicit approved component breakdown for this word; verbal continuous -al remains distinct.',
'Khumrel':'Khum reconciliation/listening circle + -rel soft flow or gentle expression; the same soft-flow component used in Velkrel, here describing compassion.'}
p=ROOT/'data/lexicon_expansions.csv'; rows=list(csv.DictReader(p.open(newline='')));changes=[]
for r in rows:
 if r['approval_batch']=='Dictionary Review 1' and r['celan_term'] in confirmed:
  old=dict(r);r['derivation']=confirmed[r['celan_term']];r['notes']+=' ED-0039: user-confirmed word-specific derivation; no automatic productive root or suffix expansion.'
  if r['celan_term']=='Serilin':assert r['english_meaning']=='Sister / Female sibling'
  changes.append({'entry_id':r['entry_id'],'term':r['celan_term'],'before':old,'after':dict(r)})
assert len(changes)==17
with p.open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
record={'decision_id':'ED-0039','status':'Applied locally','scope':'Specific internal components of these 17 headwords only. Serilin means sister/female sibling. No automatic global grammar rules or additional root headwords.','vorkaral_note':'The detailed Vor + Kar + -al breakdown governs the entry. The later shorthand reference to -ral is not used to replace that explicit segmentation.','changes':changes}
(OUT/'integration/confirmed_derivations.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
by={r['entry_id']:r for r in rows};added=json.loads((OUT/'integration/added_entries.json').read_text());res=json.loads((OUT/'resolutions.json').read_text())
for a in added:
 if a['entry']['celan_term'] not in confirmed:continue
 a['entry']=by[a['entry']['entry_id']];id=a['flag'];res[id]['lookup_followup']=[v for v in res[id]['lookup_followup'] if 'derivation' not in v.lower()];res[id]['summary']+=' Word-specific derivation confirmed under ED-0039.'
 rp=OUT/'integration'/f'{id}.json';r=json.loads(rp.read_text());r['followups']=[v for v in r['followups'] if 'derivation' not in v.lower()];r['added_entry']=a;r['confirmed_derivation']=confirmed[a['entry']['celan_term']];r['summary']=res[id]['summary'];rp.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
(OUT/'integration/added_entries.json').write_text(json.dumps(added,ensure_ascii=False,indent=2)+'\n');(OUT/'resolutions.json').write_text(json.dumps(res,ensure_ascii=False,indent=2)+'\n')
p=OUT/'integration/outcomes.json';d=json.loads(p.read_text());d['derivations_pending']=[];d['derivations_confirmed']=list(confirmed);p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=OUT/'completion.md';lines=p.read_text().splitlines();lines=[line for line in lines if not line.startswith('Follow-up: The word meaning is approved')];lines=['**Derivations:** All 17 confirmed under ED-0039. Serilin remains the dedicated word for sister/female sibling. See [the exact records](integration/confirmed_derivations.json).' if line.startswith('**Derivations pending verification:**') else line for line in lines];p.write_text('\n'.join(lines)+'\n')
p=ROOT/'knowledgebase/11_editorial_canon_policy.md';p.write_text(p.read_text()+'''\n## ED-0039: Confirmed Origins of 17 Restored Words\n\nStatus: Approved and applied locally.\n\nAll seventeen previously pending derivations are settled by the user's explicit confirmations, recorded in `outputs/dictionary_review/integration/confirmed_derivations.json`. These decisions concern the listed words' internal histories and do not automatically promote all components to productive roots or universal suffix rules. The approved historical spellings Zhivor and Theren remain primary.\n\nSerilin specifically and primarily means sister / female sibling in everyday Celan. Its Ser + -il + -in history does not broaden its dictionary meaning to generic kin or sibling. Em is unrelated to Emil; the cognition verb Varin is unrelated to the marine component in Jekvarin. Vrak is an unsegmented Trerran dialect primitive. Evan does not create a productive e- prefix, Shena does not create universal noun-forming -a, and Shenakar's historical akar is not promoted to a productive root.\n\nThe detailed Vorkaral derivation is Vor + Kar + nominal agent -al; retain the separate continuous verbal -al. Varral uses agent/practitioner -ral while independent Ral retains its caretaker/watcher sense. The two functions of -il are recorded in Shalil and Serilin, and the shared soft-flow -rel in Velkrel and Khumrel, without unrestricted new derivative creation.\n''')
print('Applied 17 confirmed derivations; Serilin meaning preserved; pending derivations now zero.')
