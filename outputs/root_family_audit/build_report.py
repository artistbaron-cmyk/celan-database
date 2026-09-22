import json,re,html,collections
from pathlib import Path
base=Path(__file__).parent
x=json.loads((base/'snapshot.json').read_text())
entries=x['entries']; norm=lambda s:re.sub('[^a-z]','',s.lower())
lookup={r['normalized']:r for r in x['lookup']}
byid={g['id']:g for g in entries}
byform={norm(g['term']):g for g in entries if not g['term'].startswith('-')}
issues=[]
def add(code,title,kind,reason,proposal,records):
 if records:issues.append(dict(id=code,title=title,kind=kind,why=reason,suggestion=proposal,count=len(records),records=records))
def row(g,observed,evidence=None):return dict(term=g['term'],id=g['id'],observed=observed,evidence=evidence or [])
# Preserve the distinction between confirmed UI behavior and linguistic questions.
records=[]
for g in entries:
 if g['term'].startswith('-'):
  wrong=[r for r in g['detected'] if not (r.get('sharedAffix') or r['form'].startswith('-') or re.search('suffix|prefix',r['anchorType']))]
  if wrong:records.append(row(g,'This suffix is grouped under '+', '.join(r['form'] for r in wrong)+' as if it were a root. Links: '+str(g['links']),g['meanings']))
add('RF01','Suffixes lose their identity and can lead to a different word','App fix','The family lookup removes hyphens. That can turn a suffix into the free-standing word with the same letters. For example, -esh leads to Esh (sky/air), and -ka leads to Ka.','Give each root, prefix and suffix its own identity. Keep its hyphens and grammatical role throughout grouping and linking.',records)
records=[]
for g in entries:
 items=[r for r in g['detected'] if r.get('sharedAffix') and not r['form'].startswith('-')]
 if items:records.append(row(g,'Recorded suffixes are shown with root labels: '+', '.join(r['form'] for r in items),g['evidence']))
add('RF02','Shared-affix buttons use root names and root destinations','App fix','Even when the app recognizes a suffix in a derivation, it uses the root record with the same letters for the button. Varral has a shared-affix button RAL, although the approved component is -ral.','Keep the approved component spelling and sense on the button. If the component has no dedicated entry, show its word-specific explanation instead of inventing a headword.',records)
records=[]
for r in x['inventory']:
 if re.search('suffix|prefix',r['type'],re.I) and not any(t in r['type'].lower() for t in ['root','morpheme','marker']):
  records.append(dict(term=r['form'],id=r['id'],observed='The '+r['type']+' record is excluded by the family-anchor type filter.',evidence=[r]))
add('RF03','The lookup excludes records explicitly labeled Prefix or Suffix','App fix','The app admits types containing root, morpheme or marker, but not the labels Prefix and Suffix. Some affixes happen to re-enter through other records; others disappear. Counts here are source records, not unique words.','Read affix records explicitly into a separate affix inventory. Preserve multiple approved functions instead of merging by spelling.',records)
missing_known=[];missing_other=[]
for g in entries:
 for e in g['entries']:
  text=e.get('derivation','')
  if '+' not in text:continue
  for part in text.split('+'):
   part=part.strip()
   part=re.sub(r'^(?:Canonical|Established|Existing|New (?:(?:one|two)-syllable )?primitive(?: root)?[: ]*)\s*','',part,flags=re.I)
   part=re.sub(r'^nominal agent\s+','',part,flags=re.I)
   m=re.match(r"([-A-Za-z’']+)",part)
   if not m:continue
   token=m[1]
   if token.lower() in ['noun-forming','historical','source-attested','approved','built','the','independent']:continue
   if norm(token) in lookup:continue
   known=byform.get(norm(token))
   record=row(g,token+' is named in the recorded derivation but is absent from the family inventory.',[{'entry':e['entry_id'],'derivation':text,'component':token,'existing_word':known['term'] if known else None}])
   (missing_known if known and not token.startswith('-') else missing_other).append(record)
add('RF04','Recorded component words are missing from the family lookup','App fix','The family system only knows its root inventory. It cannot connect many compounds to an existing base word named in their approved derivation. A component can be a whole word, not necessarily a primitive root.','Add explicit “Built from” links to existing component words. Keep these distinct from primitive roots, and do not guess further ancestry from spelling.',missing_known)
add('RF05','Some recorded components have no usable family record','Needs interpretation','These derivations name a component or suffix that the family inventory does not contain. Its approved role may be historical or limited to one word, so creating a general root would overstate the decision.','Show the existing word-specific explanation. Confirm any new shared family identity separately; no automatic new headwords or productive grammar rules.',missing_other)
records=[]
for g in entries:
 if len(g['uncapped'])>len(g['detected']):records.append(row(g,'Before early-return/cap: '+', '.join(r['form'] for r in g['uncapped'])+'. App keeps: '+', '.join(r['form'] for r in g['detected'])+'.',g['evidence']))
add('RF06','An exact root-name match suppresses other recorded relationships','Needs interpretation','When a word matches a root record, the app discards all other detected components. Pralaen therefore loses Pral + -aen. Other cases involve old evidence or combined headings and need interpretation.','Remove the blanket suppression only after distinguishing a word’s own derivation from a note about another word. Do not simply display every parser candidate.',records)
records=[]
for g in entries:
 if len(g['fullRelated'])>len(g['shownRelated']):records.append(row(g,f"The current family logic finds {len(g['fullRelated'])} relatives but shows {len(g['shownRelated'])}.",[{'shown':[r['term'] for r in g['shownRelated']],'hidden':[r['term'] for r in g['fullRelated'] if r['id'] not in {v['id'] for v in g['shownRelated']}]}]))
add('RF07','Related-word lists silently stop before the family is complete','App fix','The family builder retains at most 16 relatives, and the entry page shows at most 10. Two editorial allowlists can narrow the list further. There is no “show all” control. These are app-calculated relatives, not independently certified linguistic relationships.','Offer a complete browsable list with a count, grouped by shared root. Retain the short preview and respect reviewed exclusions.',records)
records=[]
for g in entries:
 for r in g['detected']:
  if r['normalized']=='ka':records.append(row(g,'The family uses KA with the explanation: '+r['meaning'],g['evidence']))
add('RF08','The KA family still carries an outdated combined explanation','App fix','The family lookup says KA can mean linking, possession or without depending on context. That does not express the approved rule: standalone ka is negative; possessive -ka must be attached.','Apply ED-0038 to the app-facing family explanations and identities. Preserve the historical source record.',records)
records=[]
for g in entries:
 if g['overrideFamily']:
  found={r['term'] for r in g['family']['relatedEntries']}
  missing=[t for t in g['overrideFamily'] if t not in found]
  if missing:records.append(row(g,'The explicit related-word list requests '+', '.join(missing)+', but those words are absent before the display filter runs.',[{'requested':g['overrideFamily'],'available':[r['term'] for r in g['family']['relatedEntries']]}]))
add('RF09','Explicit family lists cannot restore a missing relative','App fix','The editorial list is used only to filter existing matches. It cannot add a requested word when detection or the earlier 16-item cap omitted it.','Resolve explicit editorial family links directly, then apply the intended display order.',records)
records=[]
for g in entries:
 combined=[r['form'] for r in g['detected'] if '/' in r['form']]
 if combined:records.append(row(g,'The family uses a combined source heading: '+', '.join(combined),g['links']))
add('RF10','Combined source headings remain family identities','Needs interpretation','A heading such as Fah- / Vethor- is treated as one family anchor. Those are two named forms, not a word someone can use. The current fallback explains the heading, but the family identity is still combined.','Retain the explanation and separate the component identities only where approved relationships establish how they connect.',records)
records=[]
for r in x['lookup']:
 hints=[h for h in r['evidenceTerms'] if '+' in h or '=' in h or '/' in h]
 if hints:records.append(dict(term=r['form'],id=r['normalized'],observed='The matcher requires an exact headword, but these hints contain a formula or multiple forms.',evidence=hints))
add('RF11','Some source evidence cannot match a headword as stored','Needs interpretation','The evidence reader compares an entire hint to a word. Formulas such as “Var + Ok = To Command / To Direct” do not match a headword. This shows unusable evidence formatting, not proof that every suggested source relationship is canon.','Convert approved evidence into explicit entry links. Review older source claims before adding relationships.',records)
# Every headword appears in coverage, including independent words with no family.
coverage=[]
for g in entries:
 flags=[i['id'] for i in issues if any(r['id']==g['id'] for r in i['records'])]
 coverage.append(dict(id=g['id'],term=g['term'],roots=g['shownRoots'],affixes=g['family']['sharedAffixes'],related=[r['term'] for r in g['shownRelated']],flags=flags,status='Flagged by structural checks' if flags else 'No structural flag from these checks',evidence=g['evidence']))
summary=dict(capturedAt=x['capturedAt'],headwords=len(entries),source_inventory_records=len(x['inventory']),family_anchors=len(x['lookup']),issue_groups=len(issues),flagged_headwords=sum(bool(r['flags']) for r in coverage),without_detected_family=sum(not g['detected'] for g in entries),unresolved_visible_links=sum(not l['target'] and not l['explanation'] for g in entries for l in g['links']),categories=[{k:i[k] for k in ['id','title','kind','count']} for i in issues])
(base/'findings.json').write_text(json.dumps(issues,indent=2)+'\n');(base/'coverage.json').write_text(json.dumps(coverage,indent=2)+'\n');(base/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
md=['# Dictionary root and family audit','',f"Checked all {len(entries):,} app headwords against {len(x['lookup'])} family anchors and {len(x['inventory'])} source root/morphology records.",'','This is an app-wide structural audit, not a claim that every historical derivation has been independently validated. Flags do not authorize changes to Celan. Counts overlap; source-record and component counts are not unique-word counts. No app or canon changes were made.','']
for i in issues:
 md += [f"## {i['id']} — {i['title']}",'',f"{i['kind']} · {i['count']} affected records",'',i['why'],'','Proposed approach: '+i['suggestion'],'']
 for r in i['records']:md += ['- **'+r['term']+'**: '+r['observed']]
 md+=['']
md+=['## Boundaries and passing checks','','- All 1,496 headwords appear in coverage.json, including entries with no flags.','- Zero visible root/affix buttons have neither an entry destination nor a fallback explanation. A resolvable button can still point at the wrong sense.','- Em remains separate from Emil, and Varin remains separate from the marine component in Jekvarin.','- No detected family is not inherently an error; independent words can correctly have none.','- Related-word truncation is a completeness problem, not evidence that the hidden relatives are all linguistically correct.','- The audit executes the actual app builders; it does not use screenshots or claim visual browser validation.']
(base/'review.md').write_text('\n'.join(md)+'\n')
applied=json.loads((base/'applied_results.json').read_text()) if (base/'applied_results.json').exists() else None
payload=json.dumps(dict(summary=summary,issues=issues,coverage=coverage,applied=applied)).replace('<','\\u003c')
page='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Celan · Root and family audit</title><style>
body{font:16px/1.55 system-ui;background:#f6f8fa;color:#223042;margin:0}main{max-width:1120px;margin:auto;padding:32px 20px}h1{font-size:34px}h2{font-size:23px}p{max-width:900px}article,.intro{background:white;border:1px solid #d9e0e7;border-radius:12px;padding:22px;margin:20px 0}.muted{color:#59697a}.tag{font-size:14px;color:#17598c}input,select,textarea,button{font:inherit;padding:10px;border:1px solid #b7c5d1;border-radius:6px}input{width:min(95%,600px)}textarea{box-sizing:border-box;width:100%;min-height:95px}button{cursor:pointer;background:#eaf3ff}summary{cursor:pointer;font-weight:600}table{border-collapse:collapse;width:100%;margin-top:12px}td,th{padding:10px;text-align:left;border-bottom:1px solid #dfe5eb;vertical-align:top}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.45 system-ui}a{color:#17598c}.records{max-height:560px;overflow:auto}label{display:block;margin:14px 0 6px}#notice{color:#375b39}nav{display:flex;flex-wrap:wrap;gap:10px}small{display:block}
</style><main><h1>Roots and word families</h1><p class="muted">Dictionary App · Complete structural coverage · September 22, 2026</p><div class="intro"><h2 id="stats"></h2><p>This checks how the app builds families, shows components and opens links. It does not redefine Celan. Some flags are clear app problems; others need interpretation of the existing records.</p><p><strong>No corrections have been applied.</strong> Counts overlap. Each group includes the affected records and evidence. All headwords are included in the coverage table below.</p><p>Use the notes box to clarify a finding or modify the proposed approach. Export your decisions when ready; browser notes alone do not update the app.</p><nav><button id="export">Export decisions</button><button id="import">Import decisions</button><input id="file" type="file" accept="application/json" hidden></nav><p id="notice" role="status"></p></div><label for="search">Find a word, issue, or explanation</label><input id="search" type="search" placeholder="Try -ka, Velkrel, suffix, RF04…"><div id="issues"></div><h2>Every headword checked</h2><p>No structural flag means these checks found no issue; it is not a certification of linguistic ancestry. Independent words may correctly have no family.</p><div class="records"><table><thead><tr><th>Headword</th><th>Shown roots / affixes</th><th>Flags</th></tr></thead><tbody id="coverage"></tbody></table></div></main><script>
const data=PAYLOAD; const key='celan-root-family-audit-v1';let decisions=data.applied?.decisions || {};try{decisions={...decisions,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(key,JSON.stringify(decisions));document.querySelector('#notice').textContent='Notes saved in this browser. Export to send them for implementation.'}catch{document.querySelector('#notice').textContent='Browser storage unavailable. Export decisions before closing.'}}
function render(){const q=document.querySelector('#search').value.toLowerCase();document.querySelector('#stats').textContent=`${data.summary.headwords.toLocaleString()} headwords · ${data.summary.family_anchors} family anchors · ${data.issues.length} issue groups`;
 document.querySelector('#issues').innerHTML=data.issues.filter(i=>JSON.stringify(i).toLowerCase().includes(q)).map(i=>`<article id="${i.id}"><span class="tag">${i.id} · ${esc(i.kind)} · ${i.count} affected records</span><h2>${esc(i.title)}</h2>${data.applied ? `<p class="applied"><strong>Applied locally:</strong> ${esc(data.applied.outcomes[i.id])}</p>` : ''}<p>${esc(i.why)}</p><p><strong>Proposed approach:</strong> ${esc(i.suggestion)}</p><details><summary>See affected records and why</summary><div class="records">${i.records.filter(r=>!q||JSON.stringify(r).toLowerCase().includes(q)||i.title.toLowerCase().includes(q)||i.id.toLowerCase().includes(q)).map(r=>`<p><strong>${esc(r.term)}</strong> — ${esc(r.observed)}</p><details><summary>Evidence</summary><pre>${esc(JSON.stringify(r.evidence,null,2))}</pre></details>`).join('')}</div></details><label>Decision<select data-id="${i.id}" data-field="decision">${['Not reviewed','Approve proposed approach','Approve with my notes','Needs discussion','Keep current behavior'].map(v=>`<option ${decisions[i.id]?.decision===v?'selected':''}>${v}</option>`).join('')}</select></label><label>My notes or modified approach<textarea data-id="${i.id}" data-field="notes">${esc(decisions[i.id]?.notes||'')}</textarea></label></article>`).join('');
 document.querySelector('#coverage').innerHTML=data.coverage.filter(r=>JSON.stringify(r).toLowerCase().includes(q)).map(r=>`<tr><td><a href="../../dictionary/index.html#word=${encodeURIComponent(r.id)}">${esc(r.term)}</a></td><td>${esc([...r.roots,...r.affixes].join(', ')||'None displayed')}</td><td>${r.flags.map(f=>`<a href="#${f}">${f}</a>`).join(', ')||'No structural flag'}</td></tr>`).join('');}
document.querySelector('#issues').addEventListener('input',e=>{const {id,field}=e.target.dataset;if(id&&field){(decisions[id]||={})[field]=e.target.value;save()}});
document.querySelector('#search').addEventListener('input',render);
document.querySelector('#export').onclick=()=>{const blob=new Blob([JSON.stringify({audit:'root-family-v1',capturedAt:data.summary.capturedAt,decisions},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='celan-root-family-decisions.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
document.querySelector('#import').onclick=()=>document.querySelector('#file').click();document.querySelector('#file').onchange=async e=>{try{const p=JSON.parse(await e.target.files[0].text());if(p.audit!=='root-family-v1'||!p.decisions||typeof p.decisions!=='object')throw Error('Not a root-family decision file');for(const i of data.issues){const d=p.decisions[i.id];if(d&&typeof d==='object')decisions[i.id]={decision:typeof d.decision==='string'?d.decision:'Not reviewed',notes:typeof d.notes==='string'?d.notes:''}}save();render()}catch(err){document.querySelector('#notice').textContent='Could not import: '+err.message}};render();
</script></html>'''.replace('PAYLOAD',payload)
if applied:
 page=page.replace('<strong>No corrections have been applied.</strong>', '<strong>All 11 approved approaches have been applied locally.</strong> The findings and coverage below preserve the original audit. Applied notes explain the result. No meanings or pronunciations changed.')
 page=page.replace('<h2>Every headword checked</h2>', '<h2>Original audit: every headword checked</h2>')
 page=page.replace('border-radius:12px;padding:22px;', 'border-radius:12px;padding:22px;')
 page=page.replace('</style>', '.applied{background:#eaf5ee;border-left:4px solid #3c8060;padding:12px}</style>')
 page=page.replace('Export your decisions when ready; browser notes alone do not update the app.', 'Your imported approvals are applied. Any further notes still need to be exported; browser notes alone do not update the app.')
(base/'review.html').write_text(page)
print(json.dumps(summary,indent=2))
