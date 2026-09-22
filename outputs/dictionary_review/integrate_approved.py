"""One-time integration of the user's 99 responses and subsequent clarifications.
Before files are preserved in integration/before. Do not rerun on an edited tree.
"""
import csv, io, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'outputs/dictionary_review'
before = json.loads((OUT/'integration/before_snapshot.json').read_text())
base = {e['term'].lower(): e for e in before}
flags = {f['id']: f for f in json.loads((OUT/'flags.json').read_text())}
changes = []

def read(name):
    return list(csv.DictReader((ROOT/'data'/name).open(newline='')))

def write(name, rows):
    with (ROOT/'data'/name).open('w', newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)

phrases=read('phrases_and_examples.csv'); byid={r['entry_id']:r for r in phrases}
def update(id, flag, celan=None, english=None, analysis=None, kind=None):
    row=byid[id]; old=dict(row)
    if celan is not None: row['celan_text']=celan
    if english is not None: row['translation']=english
    if analysis is not None: row['analysis']=analysis
    if kind is not None: row['example_type']=kind
    if row==old:return
    row['notes'] += f' ED-0037 {flag}: user-approved review correction; prior wording retained in integration/applied_changes.json.'
    row['review_status']='Approved';row['review_reason']=''
    changes.append({'flag':flag,'entry_id':id,'before':old,'after':dict(row)})

update('PE-V3-0211','F020',english='4,787 (4,000 + 700 + 80 + 7)')
update('PE-FAP2-0007','F021',english='The oil is stored with the water in the cupboard.')
update('PE-HTS1-0054','F022',english='The restorative healer brews a liquid for the patient with heatstroke.')
for i in ['PE-EGE1-0017','PE-EGE1-0023']:
    update(i,'F023',celan=byid[i]['celan_text'].replace('moraen','vekaen',1))
update('PE-EGE1-0062','F023',celan=byid['PE-EGE1-0062']['celan_text'].replace('moraen','var',1))
for i in ['PE-V3-0065','PE-V3-0124']:
    update(i,'F024',celan=re.sub('teremil','emil',byid[i]['celan_text'],flags=re.I))
update('PE-CWM1-0047','F024',english='The home is made of canvas.')
update('PE-V1-0041','F025',celan='Tha-var La thal Shalor.')
update('PE-HTS1-0040','F029',english="The salve protects the friend's face.")
for e in flags['F030']['examples']:
    update(e['source_id'],'F030',english=e['english'].replace('again','still'))
for e in flags['F034']['examples']:
    update(e['source_id'],'F034',english='The technician puts an encoded text in the data center.')
for e in flags['F035']['examples']:
    update(e['source_id'],'F035',english=re.sub(r'\bfriend\b','guardian',e['english'],flags=re.I))
for e in flags['F037']['examples']:
    update(e['source_id'],'F037',english=e['english'].replace('Lalin races','They race'))
# F048's exact approved replacements already include the grain/storm corrections.
direct={
'PE-V3-0034':'Pralin ser dren morl morl.',
'PE-V3-0044':'Zharin ser dren morl Tharvok.',
'PE-V3-0092':'Zhivokesh shalil morl morl.',
'PE-V3-0100':'kal Shalorveth ser Tharvok an thal.',
'PE-V3-0104':'rinaen Kalorinath ser Tharvok an thal.',
'PE-OC1-0009':'rinaen vethbel morl njor.',
'PE-PSAC1-0002':'aenaen I aennor vethvar teremil.'}
for i,t in direct.items(): update(i,'F038',celan=t)
for flag,english in [('F039','There is survival from the ship.'),('F041','The mechanic puts oil on the toolkit.'),('F043','A blessing rests on the home and a curse on chaos.')]:
    for e in flags[flag]['examples']:update(e['source_id'],flag,english=english)
for flag,old,new in [('F040','whiteout','fog'),('F042','tool','carrier')]:
    for e in flags[flag]['examples']:update(e['source_id'],flag,english=re.sub(r'\b'+old+r'\b',new,e['english'],flags=re.I))
update('PE-V2-0003','F044',english='I receive the water at noon.')
update('PE-V2-0007','F044',english="I receive water at midnight by the water's shadow.")
update('PE-RABFE2-0016','F045',celan='keshenaen zhaelral nderun.')
update('PE-GCI1-0019','F046',celan='keltharaen welrinin an welkelthar.')
for e in flags['F078']['examples']: update(e['source_id'],'F078',celan=re.sub(r'\bkarvok\b','kavok',byid[e['source_id']]['celan_text'],flags=re.I))
translations={
'PE-V1-0033':'They went from the living world.',
'PE-V1-0034':'I go without light.',
'PE-V1-0035':'I am residing in the city.',
'PE-V1-0036':'I will go to the city.',
'PE-V1-0037':'I go above the water.',
'PE-V1-0038':'I go under the water.'}
for i,t in translations.items():update(i,'F091',english=t)
update('PE-V1-0036','F091',celan='Nor-var I an Varthas.')
update('PE-S1-0009','F092',english='Clan / Apex Predator / Might',kind='Phonology illustration',analysis='Examples of permitted smooth consonant clusters.')
update('PE-S4B-0001','F092',english='I go to the water.',analysis='Correct: sentence-initial lowercasing.')
update('PE-S4B-0002','F092',english='I go to the water.',kind='Incorrect counterexample',analysis='Incorrect initial capitalization: this example demonstrates what not to write.')

# Apply the user's strict spacing rule only where the translation establishes possession.
# Negative examples (including I ka shal / trakor / thera) remain unchanged.
for r in list(phrases):
    t=r['celan_text']; trans=r['translation'].lower()
    if ' ka ' not in t:continue
    new=t
    if ('my ' in trans or 'your ' in trans) and r['entry_id'].startswith(('PE-BIAOBF1-','PE-RABFE2-')):
        new=re.sub(r'\bI ka ([A-Za-z]+)',r'\1-ian',new)
        new=re.sub(r'\bYa ka ([A-Za-z]+)',r'\1-ya',new)
    if "child's" in trans:new=new.replace('felka ka ','felka-ka ')
    if r['entry_id']=='PE-V1-0003':new='I-ka dren'
    if new!=t:update(r['entry_id'],'F050',celan=new)

def add_example(id,celan,english,links):
    assert id not in byid
    r={k:'' for k in phrases[0]};r.update(entry_id=id,source_volume='Dictionary Review 2026-09-22',source_section='User-approved examples',celan_text=celan,translation=english,example_type='Reviewed example',canon_status='Canon',notes='ED-0037: example supplied by user; possession follows subsequent clarification.',related_entry_ids='; '.join(links),relationship_type='related usage',review_status='Approved')
    phrases.append(r);byid[id]=r
new_examples=[
('elan, var I an dren.','Well, I am going to the water.','LX-V3-0030'),
('elan, va aen lian!','Well then, speak the truth!','LX-V3-0030'),
("thaal'ra var ser an Varthas.",'I wonder if the friend is going to the city.','LX-V3-0037'),
("thaal'ra rinaen dren an krezor.",'I wonder if there is water at the hearth.','LX-V3-0037'),
('var I an dren kora rinaen krezor feneth.','I go to the water because the hearth is hot.','LX-V3-0145'),
('drenaen La dren kora rinaen La-ka kelvor kadreneth.','They drink water because their mouth is dry.','LX-V3-0145')]
for n,(c,e,link) in enumerate(new_examples,1):add_example(f'PE-DR1-{n:04}',c,e,[link])

# Explicit reviewed display senses. Preserve every unaffected sense on a reused headword.
overrides={}
def uses(term):
    key=term.lower()
    if key not in overrides:
        overrides[key]={'uses':[{k:u[k] for k in ['type','meaning','usage'] if k in u} for u in base[key]['uses']]}
    return overrides[key]['uses']
def add(term,kind,meaning,usage=''):
    us=uses(term)
    if not any(u['type']==kind and u['meaning']==meaning for u in us):us.append({'type':kind,'meaning':meaning,'usage':usage})
for id in ['F001','F004','F009','F010','F012','F014']:
    f=flags[id]
    for u in uses(f['words'][0]):
        if u['meaning']==f['what_the_app_says']['displayed_meaning']:u['type']='Noun'
for term in ['Jorvar','Lianrethshen','Vaarshen']:
    us=uses(term);meaning=us[0]['meaning'];us[0]['type']='Measure';add(term,'Noun',meaning)
for term in ['Belshara','Lianeth','Rethlian','Thar-ka']:
    for u in uses(term):
        if u['type']=='Verb':u['type']='Modal'
add('Belshara','Noun','Necessity / Obligation')
add('Thar-ka','Noun','Desire')
add('Rethlian','Particle','Possibility (May/Might)')
add('Lianeth','Verb','Ability (Can/Able to)')
add('Lianeth','Adjective','Reliable / Sound / Dependable / Accurate / True to function')
for u in uses('Lorin'):u['type']='Noun'
add('Lorin','Verb','To guide')
uses('Ven')[0]['type']='Particle'
uses('Jin')[0]['type']='Adjective'
for u in uses('Aen'):
    if u['type']=='Verb':u['meaning']='Speak / Tell / Breathe'
add('Aen','Noun','Breath of Life')
for u in uses('-eth'):u['type']='Suffix'
add('-in','Suffix','Person or participant connected to a bond, place, or category','Additional participant sense; the existing consonant-noun plural sense remains valid. Interpret the established word in context.')
for term,typ,meaning in [
('Lumor','Noun','Talisman'),('Zhelvek','Noun','Energy carrier'),('Drenkorath','Noun','Sacred spring'),
('Kaleth','Adjective','Strong / Powerful / Intense / High in magnitude or reading'),
('nor-ka','Particle','Now / In this moment / At present'),('Tenar','Noun','Radiance / Steady glow / Visible light'),
('Shen','Verb','To measure / To count'),('Kal','Verb','To strengthen'),('Bren','Verb','To harvest / To gather'),
('Vanesh','Verb','To trade / To conduct commerce'),('Jor','Verb','To surge / To burst forth'),
('Kar','Verb','To strike / To apply force'),('Shara','Verb','To follow a path / To navigate / To track'),
('Xar','Verb','To cover / To shelter / To close off'),('Shentalzhael','Verb','To triage / To prioritize treatment')]:add(term,typ,meaning)
for u in uses('Tenar'):
    if u['meaning']=='Ten':u['type']='Number'
pronouns={'I':'I / Me (1st Person Singular)','Ya':'You (2nd Person Singular)','La':'He / She / They (3rd Person Singular)','Ilin':'We / Us [Inclusive] (1st Person Plural)','Imen':'We / Us [Exclusive]','Inko':'We two / Us two [Dual]','Yako':'You two [Dual]','Yalin':"You all / You / Y’all (2nd Person Plural)",'Lako':'They two [Dual]','Lalin':'They / Them (3rd Person Plural)'}
for term,meaning in pronouns.items():uses(term)[0]['meaning']=meaning
uses('-ka')[0]['usage']='Always hyphenated to the possessor: Ilin-ka emil (our meal); La-ka kelvor (their mouth). Standalone ka means without or no.'
for u in uses('Ka'):u['usage']='Standalone ka is exclusively without or no. Ownership uses a hyphenated possessor-ka form.'
for term,marker,meaning in [('Ian','-ian','My'),('Eshen','-eshen','His / Her / Their')]:
    uses(term)[0]['usage']=f'Direct personal suffix {marker}, attached after the possessed noun. {meaning}. Third-person possessor-ka is also permitted, including for body parts.'
    overrides[term.lower()]['aliases']=[marker]
overrides['ya']['aliases']=['-ya']
add('Ya','Possessive','Your (direct personal suffix -ya)','Attach -ya to the possessed noun for body parts, inner states, and personal clothing.')
overrides['tharvin-wek']={'aliases':['tharvinwek'],'usageNote':'Year / annual cycle. Tharvinwek is the fused spelling of this established entry.'}
overrides.setdefault('thar',{})['aliases']=['Thaar']
overrides['thar']['usageNote']='Thaar is the approved Arvan regional spelling of Thar (heart / emotional core).'
for term in ['terra- / Terra-','Reth- / Rethvok-']:
    for u in uses(term):u['usage']='Root record containing alternative forms. The slash and trailing hyphens describe the roots; do not write the entire heading as one word.'
(OUT/'integration/approved_display_overrides.json').write_text(json.dumps(overrides,ensure_ascii=False,indent=2)+'\n')

# Restore explicitly approved, already-attested example vocabulary as headwords.
# Derivation guesses remain outside canon; the exact supplied proposals are archived.
new_words=[
('F051','Tera','Noun','Home / Dwelling / Homestead (informal form of Teremil)',None),
('F052','Velkrel','Noun','Breeze / Cool breeze / Light wind',None),
('F053','Varan','Verb','To reside / To stay / To be located at a physical place','/vah-rahn/'),
('F054','Shalil','Verb','To flow lightly / To move smoothly / To glide / To drift','/shah-leel/'),
('F055','Serathrin','Noun','Confidant / Trusted inner friend / Sworn ally','/sehr-ah-three-n/'),
('F056','Zhivor','Noun','Family line / Ancestral household / Kin group','/zhee-vohr/'),
('F057','Tharvok','Noun','Family / Heart-bonded family / Clan','/thahr-vohk/'),
('F058','Evan','Noun','Market / Marketplace / Trading plaza','/eh-vahn/'),
('F059','Shenakar','Noun','Coinage / Currency system / Official trade money','/sheh-nah-kahr/'),
('F060','Em','Interjection','Um / Uh (hesitation or thinking particle)','/ehm/'),
('F061','Varin','Verb','To know / To be aware of','/vah-reen/'),
('F062','Shena','Noun','Coin / Coins / Physical money','/sheh-nah/'),
('F063','Nkathal','Noun','Sadness / Grief / Sorrow / Enduring emotional pain','/nkah-thahl/'),
('F065','Vrak','Adjective','Gone / Missing / Depleted / Dry (Trerran dialect)','/vrahk/'),
('F066','Theren','Noun','Village / Settlement / Local community','/theh-rehn/'),
('F067','Serilin','Noun','Sister / Female sibling','/seh-ree-leen/'),
('F068','Aelin','Noun','Youth / Young person / Student / Pupil','/ah-eh-leen/'),
('F069','Im','Noun','Device / Instrument / Implement / Internal mechanism','/eem/'),
('F070','Dreshal','Noun','Crystal device / Crystal implement','/drehsh-ahl/'),
('F072','Varshel','Noun','Road / Travel path / Highway','/vahr-shehl/'),
('F073','Eshvan','Noun','Shop / Store / Market stall','/ehsh-vahn/'),
('F074','Noraen','Verb','To guide / To lead through time or experience / To instruct','/nohr-ah-ehn/'),
('F075','Thalesh','Noun','Ritual / Sacred balance ceremony','/thah-lehsh/'),
('F076','Thalor','Noun','Outside / Exterior / Outer place','/thah-lohr/'),
('F079','Daraen','Verb','To wait / To pause / To remain pending','/dahr-ah-ehn/'),
('F080','Varral','Noun','Traveler / Wanderer / Person on a journey','/vahr-rahl/'),
('F081','Karjor','Noun','Impact / Mechanical surge / Strike force / Burst of energy','/kahr-johr/'),
('F082','Kavel','Noun','Forgetfulness / Memory gap / Loss of awareness','/kah-vehl/'),
('F083','Vorkaral','Noun','Worker / Mechanic / Laborer / Tool-operator','/vohr-kahr-ahl/'),
('F084','Noral','Noun','Night / Nighttime / Nocturnal hours','/nohr-ahl/'),
('F085','Khumrel','Noun','Compassion / Empathetic listening / Circle of care','/khoom-rehl/'),
('F086','Terrarav','Noun',"Pull of one's homeland / Yearning for home",'/tehr-rah-rahv/'),
('F087','Zhirrathor','Noun','Thread to the past / Historical continuity / Lineage link','/zheer-rah-thohr/')]
exp=read('lexicon_expansions.csv'); additions=[]
for n,(flag,term,typ,meaning,pron) in enumerate(new_words,1):
    assert term.lower() not in base,term
    row={k:'' for k in exp[0]};id=f'LX-DR1-{n:04}'
    aliases=['serilín'] if term=='Serilin' else []
    related=[r for r in phrases if any(re.search(r'(?<![\w])'+re.escape(t)+r'(?![\w])',r['celan_text'],re.I) for t in [term]+aliases)]
    assert related,term
    derivation='Established example word restored by user decision; detailed derivation pending verification.'
    if term=='Varan':derivation='Var movement + An location; specialized locative-stative form, not continuous -al.'
    if term=='Noral':derivation='Nor time + -al duration; lexicalized nighttime meaning approved by user.'
    if term=='Tera':derivation='Informal conversational form of Teremil.'
    row.update(entry_id=id,celan_term=term,pronunciation=pron or {'Tera':'/teh-rah/','Velkrel':'/vehl-krehl/'}[term],english_meaning=meaning,category=typ,derivation=derivation,canon_status='Canon',approval_batch='Dictionary Review 1',notes=f'User-approved restoration of existing example vocabulary; ED-0037 {flag}. Uses existing reviewed attestations; no unapproved illustrative sentences or productive roots added.',related_entry_ids='; '.join(r['entry_id'] for r in related))
    if term=='Vrak':row.update(origin_nation='Trerra',national_usage='Dialect use for severe scarcity or absence.')
    if term=='Serilin':row.update(variant_forms='serilín',variant_pronunciations=pron)
    for r in related:
        ids=[v.strip() for v in r['related_entry_ids'].split(';') if v.strip()]
        if id not in ids:ids.append(id)
        r['related_entry_ids']='; '.join(ids)
    exp.append(row);additions.append({'flag':flag,'entry':row,'example_count':len(related)})
    if term in ['Em','Vrak','Im','Thalesh','Thalor']:
        extra={'Em':('Particle','Conversational hesitation / Thinking particle'),'Vrak':('Particle','Gone / Missing / Depleted (Trerran dialect)'),'Im':('Particle','Device / Instrument / Internal mechanism'),'Thalesh':('Verb','To perform a balance rite'),'Thalor':('Adverb','Outside')}[term]
        overrides[term.lower()]={'uses':[{'type':typ,'meaning':meaning},{'type':extra[0],'meaning':extra[1]}]}

# Persist only sanctioned meanings; user derivation proposals remain in the response file.
(OUT/'integration/approved_display_overrides.json').write_text(json.dumps(overrides,ensure_ascii=False,indent=2)+'\n')
(OUT/'integration/added_entries.json').write_text(json.dumps(additions,ensure_ascii=False,indent=2)+'\n')
write('phrases_and_examples.csv',phrases);write('lexicon_expansions.csv',exp)
(OUT/'integration/applied_changes.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2)+'\n')
print(f'Applied {len(changes)} example corrections, added {len(new_examples)} user-supplied examples and {len(additions)} approved lookup entries.')
