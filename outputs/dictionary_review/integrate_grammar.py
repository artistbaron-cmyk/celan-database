import csv, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'outputs/dictionary_review'
possession=('Standalone ka is exclusively without or no. Possessive -ka must be hyphenated to the possessor. '
 'Body parts, inner states, personal clothes, and primary personal gear use post-nominal -ian (my), -ya (your), or -eshen (his/her/their). '
 'Collective, titled, compound, and other third-person possessors use possessor-ka. The user explicitly permits La-ka kelvor for their mouth, including this third-person body-part construction. '
 '-ian never means their. Relational -esh indicates a bond; it does not by itself specify a third-person owner.')
rules=[
('GR-DR1-0001','Possession: spacing and suffix hierarchy','Possession',possession,'I-ka dren — My water.\nIlin-ka emil — Our meal.\nrinaen aiv an doran-ian. — There is pain in my torso.\ndr enselaen I noka-ian. — I wash my vulva.\nLa-ka kelvor — Their mouth.\nVar I ka shal. — I go without light.'.replace('dr enselaen','drenselaen'),'GR-V1-0007; GR-V1-0020; GR-V3-0006'),
('GR-DR1-0002','Two permitted orders for a governing verb and its complement','Syntax','Both V1 + Subject + V2 + Object and V1 + V2 + Subject + Object are permitted. The first places the subject directly after the governing verb; the second presents the combined action before the subject.','siv I pralaen krezor. — I try to make the hearth.\nsiv gavaen I zor. — I try to hunt the animal.\nsivrethaen belnoraen rakumek nor mekreth. — The computers fail to synchronize during the system malfunction.',''),
('GR-DR1-0003','Varan and the universal continuous suffix','Aspect and location','-al remains the universal continuous suffix. Varan is the lexicalized locative-stative form Var + An: to reside, stay, or be located at a physical place. It does not establish continuous -an. An supplies physical location; Nor supplies time.','Varal I dren. — I am going to the water.\nVaran I an Varthas. — I am residing in the city.\nNor-var I an Varthas. — I will go to the city.','GR-V1-0019'),
('GR-DR1-0004','Plural and participant senses of -in','Morphology','The existing plural rule remains: consonant-final nouns take -in; vowel-final nouns take -n. Separately, -in has an approved person/participant sense connecting a person or group to a bond, place, or category. That sense does not replace ordinary plurals.','nderun — testicles.\nwelrinin — citizens.\nShalor-in — one belonging to the sanctuary.','GR-V2-0001')]
p=ROOT/'data/grammar_rules.csv';rows=list(csv.DictReader(p.open(newline='')));original=list(rows)
for id,title,category,meaning,examples,related in rules:
 assert not any(r['entry_id']==id for r in rows)
 r={k:'' for k in rows[0]};r.update(entry_id=id,source_volume='Dictionary Review 1',source_section='User-approved grammar decisions',rule_name=title,category=category,original_wording=meaning,examples=examples,canon_status='Canon',notes='ED-0037 / ED-0038: user-approved review and subsequent possession clarification.',related_entry_ids=related,relationship_type='clarifies or supersedes earlier wording',review_status='Approved');rows.append(r)
with p.open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
# Canon source wording remains traceable; the app replaces conflicting older rule cards.
supersedes={'GR-V1-0007':'GR-DR1-0001','GR-V1-0020':'GR-DR1-0001','GR-V3-0006':'GR-DR1-0001'}
(OUT/'integration/grammar_decisions.json').write_text(json.dumps({'rules':rows[-4:],'supersedes':supersedes},ensure_ascii=False,indent=2)+'\n')
working=ROOT/'data/grammar_rules_working.csv';wr=list(csv.DictReader(working.open(newline='')))
for r in wr:
 if r['unit_title'] in ['Basic Possession','Case Marking by Order and Particles'] or r['source_ids']=='GR-V1-0007':
  r.update(core_rule=possession,example_1_celan='I-ka dren',example_1_english='My water.',example_2_celan='La-ka kelvor',example_2_english='Their mouth.',source_ids=r['source_ids']+'; GR-DR1-0001')
 if 'Relational Possession' in r['unit_title']:
  r.update(core_rule=possession,why_it_matters='Hyphenation distinguishes ownership from absence. Personal suffixes identify the owner; -esh marks relational belonging.',example_1_celan='korin-ian',example_1_english='My hands.',example_2_celan='La-ka kelvor',example_2_english='Their mouth.',source_ids=r['source_ids']+'; GR-DR1-0001')
 if r['unit_title']=='Space and Time: An and Nor':
  r.update(example_2_celan='Nor-var I an Varthas.',example_2_english='I will go to the city.',core_rule=rules[2][3],source_ids=r['source_ids']+'; GR-DR1-0003')
with working.open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(wr[0]),lineterminator='\n');w.writeheader();w.writerows(wr)
policy=ROOT/'knowledgebase/11_editorial_canon_policy.md'
text='''
## ED-0037: Dictionary Accuracy Review Decisions

Status: Approved; integrated locally from all 99 review responses and subsequent clarifications.

The exact user export is preserved in `outputs/dictionary_review/user_responses_2026_09_22.json`; subsequent clarifications are recorded in `user_clarifications_round_2.json`. The later explicit choices supersede tentative alternatives in the export. F048 retains ED-0036's exact mappings.

The approved set includes sense-specific word labels, retained polysemy, corrected sentence pairs, restored lookup entries, and app search/family/display repairs. Zhelvek means both an energy carrier and a food energy bar. Shalor is used for the sanctuary place example. Lianeth retains separate Modal and Verb ability labels and gains the Adjective reliability sense. Noral means night/nighttime, not generic duration. Varan is a specialized locative-stative form; -al remains the universal continuous suffix. Both reviewed multi-verb orders are allowed.

Preserve all earlier meanings unless the user explicitly corrected them. Thaar is a regional variant of Thar; serilín is a variant of Serilin; tharvinwek resolves to Tharvin-Wek. These do not create duplicate headwords. The approved new dictionary entries restore already-used example vocabulary. Proposed derivations that are not established in the current app remain pending; they do not create new productive roots or suffixes. Existing pronunciations remain verified.

The integration retains available reviewed attestations instead of inventing extra example sentences to meet a count. Seventeen restored entries currently have one reviewed example each; the ordinary expansion validator's two-example requirement remains an outstanding coverage check, not evidence that the approved meaning is invalid.

## ED-0038: Possessive Spacing and Personal Suffixes

Status: Approved. The final user clarification explicitly accepts `La-ka kelvor`.

'''+possession+'''

Approved examples: `rinaen aiv an doran-ian.`; `rinaen ndemwek-ian nor shara.`; `drenselaen I noka-ian.`; `drenaen La dren kora rinaen La-ka kelvor kadreneth.` Genuine negative uses such as `Var I ka shal.` remain unchanged.

The app grammar cards and working grammar layer follow this decision. Earlier source rules remain preserved as witnesses and are superseded where they conflict.
'''
policy.write_text(policy.read_text()+text)
kb=ROOT/'knowledgebase/02_grammar_rules.md';t=kb.read_text();kb.write_text('# Current approved grammar\n\nPossession now follows ED-0038: '+possession+'\n\nMulti-verb order and Varan follow GR-DR1-0002/0003. The source-rule transcript below is preserved as historical evidence; conflicting older possession wording is superseded.\n\n'+t)
print('Recorded four approved grammar rules; updated working grammar and canon policy.')
