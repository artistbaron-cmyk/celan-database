import csv,json
from pathlib import Path
b=Path(__file__).parent;root=b.parents[1]
j=json.loads((b/'round2_changes.json').read_text());rows=list(csv.DictReader((root/'data/phrases_and_examples.csv').open()));byid={r['entry_id']:r for r in rows}
p=b/'applied_results.json';status=json.loads(p.read_text())
lines=['# Applied example review — September 24, 2026','','All 135 submitted instructions were applied locally, including the unmarked Unar item and the five follow-up corrections.','', 'Duplicate source records are retained but share one example in the app. This does not certify unreviewed sentences or complete the separate missing-example draft queue.','']
for key,o in j['outcomes'].items():
 ids=o.get('examples',o.get('records',[]));detail=' '.join(byid[i]['celan_text']+' — '+byid[i]['translation'] for i in ids)
 status['outcomes'][key]=o['summary']+' '+detail
 lines+=['## '+key,'',o['summary'],'']
 for i in ids:lines+=['- '+byid[i]['celan_text']+' — '+byid[i]['translation']+' ('+i+')']
 if o.get('retired'):lines+=['','Source records sharing this example: '+', '.join(o['retired'])+'.']
 lines+=['']
status['round2']={'instructions_applied':135,'followup_corrections':5,'unmarked_item':'FORM-PE-V3-0206','changes':'round2_changes.json','readable_changes':'round2_applied.md'}
p.write_text(json.dumps(status,ensure_ascii=False,indent=2)+'\n');(b/'round2_applied.md').write_text('\n'.join(lines))
p=b/'received_decisions_2026_09_24_status.json';s=json.loads(p.read_text());s['status']='Applied locally; five follow-up corrections approved and applied.';s['clarification_topics_resolved']=s.pop('clarification_topics');s['followup_approval']='User approved replacement for question 1 and answered yes to questions 2–5.';p.write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
