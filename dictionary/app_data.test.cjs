const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const appDir = __dirname;
const dataDir = path.join(appDir, 'app_data');
const sourceFiles = [
  'dictionary_entries.csv', 'dictionary_senses.csv', 'dictionary_examples.csv',
  'dictionary_families.json', 'grammar_guide.csv', 'expressions_app.json',
  'phrase_builder.json'
];
const html = fs.readFileSync(path.join(appDir, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1].split('?')[0]);
assert.deepEqual(scripts, [
  './app_data/embedded_data.js',
  './app_data/phrase_builder_content.js',
  './script.js'
]);
const bundleContext = vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(dataDir,'embedded_data.js'),'utf8'),bundleContext);
const bundle = bundleContext.window.EMBEDDED_DATA;
assert.deepEqual(Object.keys(bundle).sort(),sourceFiles.slice().sort());
for(const name of sourceFiles){
  assert.equal(bundle[name],fs.readFileSync(path.join(dataDir,name),'utf8'),name+' differs from offline bundle');
}
const appScript = fs.readFileSync(path.join(appDir,'script.js'),'utf8');
for(const name of sourceFiles){
  assert.match(appScript,new RegExp('\\./app_data/'+name.replaceAll('.','\\.')));
}
for(const oldName of ['lexicon.csv','phrases_and_examples.csv','grammar_rules.csv','display_content.js','grammar_content.js']){
  assert.equal(fs.existsSync(path.join(dataDir,oldName)),false,oldName+' belongs in source_history');
}
const parseCsv=text=>{
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const ch=text[i];if(quoted){if(ch==='"'&&text[i+1]==='"'){cell+='"';i++;}else if(ch==='"')quoted=false;else cell+=ch;}else if(ch==='"')quoted=true;else if(ch===','){row.push(cell);cell='';}else if(ch==='\n'){row.push(cell);rows.push(row);row=[];cell='';}else if(ch!=='\r')cell+=ch;}
  if(row.length||cell){row.push(cell);rows.push(row);}const [headers,...data]=rows;return data.map(cells=>Object.fromEntries(headers.map((h,i)=>[h,cells[i]||''])));
};
const entries=parseCsv(bundle['dictionary_entries.csv']);
const senses=parseCsv(bundle['dictionary_senses.csv']);
const examples=parseCsv(bundle['dictionary_examples.csv']);
const families=JSON.parse(bundle['dictionary_families.json']);
const grammarRows=parseCsv(bundle['grammar_guide.csv']);
const grammar={
  rules:grammarRows.filter(row=>row.record_type==='rule'),
  lessons:grammarRows.filter(row=>row.record_type==='lesson'),
  companions:grammarRows.filter(row=>row.record_type==='companion')
};
assert.equal(fs.existsSync(path.join(dataDir,'grammar_guide.json')),false,'old grammar JSON must not be a second app source');
const expressions=JSON.parse(bundle['expressions_app.json']);
assert.equal(entries.length,1495);
assert.equal(senses.filter(row=>row.visible==='Yes').length,1565);
assert.equal(examples.length,9266);
assert.equal(grammar.rules.length,48);
assert.equal(grammar.lessons.length,7);
assert.equal(grammar.companions.length,1);
assert.equal(new Set(grammarRows.map(row=>`${row.record_type}:${row.id}`)).size,grammarRows.length,'duplicate grammar CSV record');
for(const row of grammarRows){
  assert.ok(['rule','lesson','companion'].includes(row.record_type),'invalid grammar CSV row type');
  assert.ok(JSON.parse(row._fields).includes('id'),'grammar CSV row is missing its ID field');
  JSON.parse(row._types);
  for(const field of ['guideSections','relatedHeadwords','childRuleIds'])if(row[field])JSON.parse(row[field]);
}
assert.equal(expressions.length,107);
const ids=new Set(entries.map(row=>row.id));
assert.equal(ids.size,entries.length,'duplicate headword ids');
for(const row of senses)assert.ok(ids.has(row.headword_id),'orphan sense: '+row.headword_id);
for(const row of examples){assert.ok(ids.has(row.headword_id),'orphan example: '+row.headword_id);assert.ok(['direct','related','teaching'].includes(row.section),'invalid example section');}
for(const row of entries){
  const family=families[row.id];
  assert.ok(family,'missing family record: '+row.id);
  assert.equal(new Set((family.relatedEntries||[]).map(related=>related.id)).size,(family.relatedEntries||[]).length,row.id+' has duplicate related words');
  JSON.parse(row.override_json);JSON.parse(row.metadata_json);
  for(const related of family.relatedEntries||[])assert.ok(ids.has(related.id),row.id+' has broken related-word link to '+related.id);
  for(const component of family.components||[])if(component.target)assert.ok(ids.has(component.target),row.id+' has broken component link to '+component.target);
  const visibleSenseIds=new Set(senses.filter(sense=>sense.headword_id===row.id&&sense.visible==='Yes').map(sense=>sense.sense_id));
  const componentIds=new Set((family.components||[]).map(component=>component.id));
  for(const scope of [family.morphologySenseIds||[],family.familySenseIds||[]])for(const senseId of scope)assert.ok(visibleSenseIds.has(senseId),row.id+' has a broken word-building meaning link: '+senseId);
  for(const analysis of family.morphologyAnalyses||[]){
    for(const componentId of analysis.componentIds)assert.ok(componentIds.has(componentId),row.id+' has a broken word-part link: '+componentId);
    for(const senseId of analysis.senseIds||[])assert.ok(visibleSenseIds.has(senseId),row.id+' has a broken analysis meaning link: '+senseId);
  }
}
const orderReport=parseCsv(fs.readFileSync(path.join(appDir,'..','outputs','app_display_checks','pass2_order_changes.csv'),'utf8'));
assert.equal(orderReport.length,228,'Pass 2 order review is incomplete');
const letters=value=>value.toLowerCase().replace(/[^a-z]/g,'');
for(const row of orderReport){
  const entry=entries.find(entry=>entry.headword===row.headword);
  assert.ok(entry,'order review names a missing headword: '+row.headword);
  const actual=families[entry.id].components.map(part=>part.form).join(' + ');
  assert.equal(actual,row.after,row.headword+' has not kept its reviewed word-part order');
  assert.equal(letters(actual),letters(row.headword),row.headword+' parts do not spell the headword');
}
const senseKeys=new Set();
const senseIds=new Set();
for(const row of senses){
  const key=row.headword_id+'/'+row.sense_order;
  assert.ok(!senseKeys.has(key),'duplicate sense position: '+key);senseKeys.add(key);
  assert.ok(row.sense_id,'missing permanent sense id: '+key);
  assert.ok(!senseIds.has(row.sense_id),'duplicate permanent sense id: '+row.sense_id);
  senseIds.add(row.sense_id);
}
const exampleKeys=new Set();
for(const row of examples){const key=row.headword_id+'/'+row.section+'/'+row.display_order;assert.ok(!exampleKeys.has(key),'duplicate example position: '+key);exampleKeys.add(key);}
const kinds=new Set(['sentence','phrase','idiom','teaching','historical','related','related_phrase','related_idiom']);
const visibleById=new Map(senses.filter(row=>row.visible==='Yes').map(row=>[row.sense_id,row]));
let explicitExampleLinks=0;
for(const row of examples){
  assert.ok(kinds.has(row.display_kind),'missing example display kind: '+row.headword_id+'/'+row.display_order);
  if(row.sense_id){
    explicitExampleLinks++;
    assert.equal(visibleById.get(row.sense_id)?.headword_id,row.headword_id,'broken example meaning link: '+row.sense_id);
    assert.equal(visibleById.get(row.sense_id)?.meaning,row.sense_meaning,'example meaning wording differs from its link: '+row.sense_id);
  }
}
assert.equal(explicitExampleLinks,286,'meaning links should remain explicit');
for(const retiredId of ['esh-s3','lian-s3','aen-s3','vaar-s3','thalor-s1','-en-s2','li--s2']){
  assert.ok(!senses.some(row=>row.sense_id===retiredId),'retired duplicate meaning remains visible: '+retiredId);
}
for(let n=1;n<=14;n++){
  const entryId=`PE-AUD104-${String(n).padStart(4,'0')}`;
  assert.equal(examples.filter(row=>row.entry_id===entryId).length,1,'missing new editorial example: '+entryId);
}
assert.equal(examples.filter(row=>row.entry_id==='PE-V3-0046').length,6,'Kalvokesh example should appear under five words and as a related -esh form');
assert.ok(examples.filter(row=>row.entry_id==='PE-V3-0046').every(row=>row.celan_text==='rinaen kalvokesh an dren ser belvok.'),'Kalvokesh wording differs across pages');
assert.deepEqual(families['kalvokesh'].components.map(part=>part.form),['Kalvok','-esh']);
assert.ok(families['-esh'].relatedEntries.some(row=>row.id==='kalvokesh'));
assert.equal(expressions.find(row=>row.expression_id==='EX-SRC-LX-V2-0221')?.dictionary_headwords,"Vaar'a!",'relief expression must link to its dictionary page');
assert.ok(!senses.some(row=>row.sense_id==='dren-s3'),'retired Dren river meaning remains visible');
assert.equal(senses.find(row=>row.sense_id==='dro-s3')?.meaning,'River / waterway; a flowing body of physical water');
assert.equal(examples.find(row=>row.headword_id==='dro'&&row.entry_id==='PE-GCI1-0048')?.sense_id,'dro-s3');
assert.equal(examples.find(row=>row.headword_id==='dro'&&row.entry_id==='PE-SRD1-0014')?.sense_id,'dro-s2');
for(const senseId of ['rethlian-s3','lianeth-s2','kor-s1','pral-s1','lianrethshen-s1','vaarshen-s1','jorvar-s1','em-s2','vrak-s2']){
  assert.ok(!senses.some(row=>row.sense_id===senseId),'merged or moved 101–165 meaning remains in the app: '+senseId);
}
assert.equal(senses.find(row=>row.sense_id==='kel-s2')?.word_type,'Verb','Kel names as a verb, not a noun');
assert.equal(senses.find(row=>row.sense_id==='pralor-s1')?.meaning,'Table, Flat Surface','Table remains under Pralor');
for(const [headword,entryId,senseId] of [
  ['lianor','PE-V3-0058','lianor-s2'],['kel','PE-PFM1-0001','kel-s2'],
  ['rethlian','PE-V4-0003','rethlian-s1'],['rethlian','PE-V3-0013','rethlian-s2'],
  ['velmarin','PE-V4-0068','velmarin-s1'],['velmarin','PE-V3-0050','velmarin-s2'],
  ['drenkorath','PE-V3-0099','drenkorath-s1'],['drenkorath','PE-V4-0106','drenkorath-s2'],
  ['pralor','PE-V4-0020','pralor-s1'],['lianeth','PE-V4-0001','lianeth-s1'],
  ['lianrethshen','PE-PFM1-0071','lianrethshen-s2'],['vaarshen','PE-PFM1-0074','vaarshen-s2'],
  ['jorvar','PE-TVO1-0050','jorvar-s2'],['em','PE-DR2-0005','em-s1'],
  ['vrak','PE-DR2-0008','vrak-s1'],['nor-ka','PE-V4-0009','nor-ka-s1'],
  ['nor-ka','PE-V4-0105','nor-ka-s2']
]){
  assert.equal(examples.find(row=>row.headword_id===headword&&row.entry_id===entryId)?.sense_id,senseId,'approved 101–165 meaning link: '+headword+'/'+entryId);
}
assert.equal(examples.find(row=>row.headword_id==='tenar'&&row.entry_id==='PE-V3-0203')?.display_kind,'teaching','ten plus one is a number illustration, not a sentence');
for(const senseId of ['kor-s2','pral-s2','thael-s2']){
  assert.ok(!examples.some(row=>row.sense_id===senseId),'101–165 held meaning received a direct link: '+senseId);
}
for(const senseId of ['kal-s2','kalor-s2','seren-s2','vaar-s2']){
  assert.ok(!senses.some(row=>row.sense_id===senseId),'retired meaning remains in the app: '+senseId);
}
assert.equal(senses.find(row=>row.sense_id==='kalor-s1')?.meaning,'Courage / Strength of Spirit / Willpower');
assert.equal(senses.find(row=>row.sense_id==='vaar-s1')?.meaning,'Peace / Unity / Calm');
for(const [headword,entryId,senseId] of [
  ['kal','PE-ER2-0074','kal-s1'],['kal','PE-FAP1-0001','kal-s3'],
  ['kalor','PE-V3-0110','kalor-s1'],['seren','PE-ER2-0029','seren-s1'],
  ['vaar','PE-S3-0014','vaar-s1']
]){
  assert.equal(examples.find(row=>row.headword_id===headword&&row.entry_id===entryId)?.sense_id,senseId,'approved 51–60 meaning link: '+headword+'/'+entryId);
}
assert.ok(!senses.some(row=>row.sense_id==='vaar-s3'),'Vaar interjection should use its own Vaar\'a! headword');
assert.equal(examples.find(row=>row.headword_id==="vaar'a"&&row.entry_id==='PE-AUD104-0014')?.sense_id,"vaar'a-s1");
assert.equal(examples.filter(row=>row.entry_id==='PE-V3-0110'&&row.translation==='Go in strength and balance!').length,4,'Kalor command translation should agree on every page');
for(const senseId of ['lorin-s2','rath-s3','krezor-s2','phelvin-s2','belshara-s4','jorvak-s2','welrim-s1','xilvar-s2','belshara-s1']){
  assert.ok(!senses.some(row=>row.sense_id===senseId),'merged or superseded 61–100 meaning remains in the app: '+senseId);
}
for(const [headword,entryId,senseId] of [
  ['lorin','PE-CNE1-0028','lorin-s1'],['lorin','PE-ER2-0026','lorin-s3'],
  ['rath','PE-V2-0037','rath-s1'],['rath','PE-V3-0028','rath-s2'],
  ['fah','PE-V3-0060','fah-s1'],['reth','PE-ICAES1-0057','reth-s1'],
  ['reth','PE-V4-0083','reth-s2'],['dral','PE-V3-0064','dral-s1'],
  ['tal','PE-V2-0044','tal-s1'],['tal','PE-NE1-0033','tal-s2'],
  ['lun','PE-FAP1-0025','lun-s1'],['lun','PE-LPC1-0001','lun-s3'],
  ['kaleth','PE-SP2-0004','kaleth-s1'],['kaleth','PE-TM1-0003','kaleth-s2'],
  ['krezor','PE-TM1-0020','krezor-s1'],['krezor','PE-V4-0023','krezor-s3'],
  ['phelvin','PE-V4-0059','phelvin-s1'],['jorvak','PE-V2-0057','jorvak-s1'],
  ['welrim','PE-V2-0023','welrim-s2'],['xilvar','PE-V2-0027','xilvar-s1'],
  ['belshara','PE-ER2-0012','belshara-s2'],['belshara','PE-V4-0002','belshara-s3'],
  ['belshara','PE-V4-0072','belshara-s2'],['felorin','PE-V2-0084','felorin-s2'],
  ['zhelvek','PE-V2-0077','zhelvek-s1'],['zhelvek','PE-CNE1-0014','zhelvek-s2'],
  ['eshvelaneth','PE-V2-0122','eshvelaneth-s1'],['eshvelaneth','PE-V3-0098','eshvelaneth-s2'],
  ['lianor','PE-V4-0074','lianor-s1']
]){
  assert.equal(examples.find(row=>row.headword_id===headword&&row.entry_id===entryId)?.sense_id,senseId,'approved 61–100 meaning link: '+headword+'/'+entryId);
}
assert.ok(!examples.some(row=>row.sense_id==='felorin-s1'),'unsupported coral-reef meaning received an example');
for(const entryId of ['PE-V2-0019','PE-V2-0065'])assert.ok(!examples.some(row=>row.entry_id===entryId),'old sentence still visible: '+entryId);
assert.deepEqual(families['xilvar'].familyRoots,['XIL'],'Xilvar must not inherit the unrelated movement Var family');
assert.equal(families['xilvar'].components.find(part=>part.form==='var')?.kind,'local','Xilvar var is a local seasoning part');
assert.ok(!families['var'].relatedEntries.some(row=>row.id==='xilvar'),'Var must not link to the unrelated spice');
assert.ok(!families['var-'].relatedEntries.some(row=>row.id==='xilvar'),'Var- must not link to the unrelated spice');
assert.deepEqual(families['krezor'].components.map(part=>part.form),['Krez','-or'],'Krezor must show the approved two-part spelling');
assert.deepEqual(senses.filter(row=>row.headword_id==='morldren').map(row=>row.meaning),['Waterfall'],'Morldren has one approved meaning');
assert.deepEqual(senses.filter(row=>row.headword_id==='xarvel').map(row=>row.meaning),['Veiled meal (covered meal)'],'Xarvel has one meaning with both English wordings');
assert.equal(senses.find(row=>row.sense_id==='thalor-s2')?.meaning,'Outside; not within something');
assert.ok(!examples.some(row=>row.entry_id==='PE-V3-0027'),'the mountain-waters mismatch must not reach students');
assert.ok(!JSON.stringify(grammar).toLowerCase().includes('mountain waters'),'the mountain-waters mismatch must not remain in the grammar guide');
for(const [entryId,senseId] of [['PE-DR2-0012','thalor-s2'],['PE-V4-0085','thalor-s2'],['PE-HTS1-0087','shentalzhael-s2'],['PE-HTS1-0088','shentalzhael-s1']]){
  assert.equal(examples.find(row=>row.entry_id===entryId&&row.headword_id===senseId.split('-s')[0])?.sense_id,senseId,'wrong reviewed meaning link: '+entryId);
}
for(const [headword,entryId,senseId] of [
  ['ya','PE-V4-0059','ya-s1'],['ya','PE-V4-0074','ya-s2'],
  ['var','PE-SP2-0002','var-s1'],['var','PE-EGE1-0011','var-s2'],
  ['ser','PE-V1-0002','ser-s1'],['ser','PE-V1-0011','ser-s2'],
  ['ser','PE-V4-0082','ser-s3'],['thal','PE-ER2-0013','thal-s1']
]){
  assert.equal(examples.find(row=>row.headword_id===headword&&row.entry_id===entryId)?.sense_id,senseId,'approved first-50 meaning link: '+entryId);
}
assert.equal(examples.find(row=>row.headword_id==='ilin'&&row.entry_id==='PE-V4-0058')?.sense_id,'ilin-s1','Ilin bread sentence should show the single inclusive pronoun meaning');
assert.ok(!senses.some(row=>row.sense_id==='ilin-s2'),'duplicate Ilin meaning must be merged');
assert.ok(!senses.some(row=>row.sense_id==='an-s1'),'duplicate spatial An meaning must be merged');
assert.equal(senses.find(row=>row.sense_id==='an-s2')?.meaning,'At / in / on (spatial place)');
for(const [headword,entryId,senseId] of [
  ['ka','PE-V1-0034','ka-s1'],['ka','PE-ER2-0025','ka-s2'],
  ['an','PE-V2-0007','an-s2'],['nor','PE-ER2-0026','nor-s1'],
  ['nor','PE-V2-0007','nor-s2'],['esh','PE-EGE1-0058','esh-s1'],
  ['esh','PE-V1-0037','esh-s2'],['morl','PE-S4A-0001','morl-s1'],
  ['morl','PE-ER2-0036','morl-s3']
]){
  assert.equal(examples.find(row=>row.headword_id===headword&&row.entry_id===entryId)?.sense_id,senseId,'approved first-50 meaning link: '+entryId);
}
assert.ok(!examples.some(row=>row.headword_id==='esh'&&row.sense_id==='esh-s3'),'relational -esh illustration remains on hold');
for(const senseId of ['shal-s2','thar-s2','vethor-s2','lian-s2','shalor-s1','shalor-s2']){
  assert.ok(!senses.some(row=>row.sense_id===senseId),'moved or duplicate meaning remains visible: '+senseId);
}
for(const [headword,entryId,senseId] of [
  ['terra','PE-V4-0061','terra-s1'],['terra','PE-ER2-0044','terra-s2'],
  ['dren','PE-V1-0001','dren-s1'],['shal','PE-V1-0034','shal-s1'],
  ['shalaen','PE-V3-0057','shalaen-s1'],['krez','PE-CNE1-0051','krez-s1'],
  ['thar','PE-V3-0076','thar-s1'],['thar-ka','PE-V4-0004','thar-ka-s1'],
  ['vethor','PE-ER2-0012','vethor-s1'],['vethoraen','PE-V4-0024','vethoraen-s1'],
  ['shara','PE-ER2-0018','shara-s1'],['shara','PE-EGE1-0052','shara-s2'],
  ['rathor','PE-V3-0141','rathor-s1'],['rathor','PE-NE1-0063','rathor-s2'],
  ['shalor','PE-V2-0042','shalor-s3'],['thaal','PE-ER2-0028','thaal-s1'],
  ['thaal','PE-ER2-0027','thaal-s2'],['lian','PE-V3-0076','lian-s1'],
  ['lianaen','PE-V2-0042','lianaen-s1'],['aen','PE-DR2-0015','aen-s1'],
  ['aen','PE-DR2-0006','aen-s2']
]){
  assert.equal(examples.find(row=>row.headword_id===headword&&row.entry_id===entryId)?.sense_id,senseId,'approved first-50 meaning link: '+headword+'/'+entryId);
}
assert.equal(examples.find(row=>row.headword_id==='thar'&&row.entry_id==='PE-V4-0004')?.section,'related','Thar-ka sentence should not be direct usage of Thar');
for(const senseId of ['dren-s3','lian-s3','aen-s3']){
  assert.ok(!examples.some(row=>row.sense_id===senseId),'held meaning received an example: '+senseId);
}
assert.equal(examples.filter(row=>row.headword_id==='li-'&&row.celan_text==='var Li-Ya an dren.').length,1,'overlapping Li- meanings should share one general illustration');
assert.equal(examples.find(row=>row.headword_id==='-el'&&row.celan_text==='rinaen Ohmbaen-el an shalor.')?.translation,'The beloved is at the sanctuary.','-el illustration must not add an unexpressed possessor');
assert.equal(senses.find(row=>row.sense_id==='eth-s3')?.word_type,'Noun','standalone Eth must be a noun');
assert.equal(examples.filter(row=>row.headword_id==='eth'&&row.entry_id==='PE-109-ETH-0001'&&row.sense_id==='eth-s3').length,1,'standalone Eth example must appear on its own page');
assert.ok(!examples.some(row=>row.headword_id==='eth'&&row.section==='related'),'suffix illustrations must not remain on standalone Eth');
assert.ok(!senses.some(row=>row.sense_id==='eth-s1'||row.sense_id==='eth-s2'),'old duplicate Eth suffix meanings must be retired');
assert.equal(senses.find(row=>row.sense_id==='-eth-s1')?.word_type,'Suffix','quality -eth must remain a suffix');
assert.equal(senses.find(row=>row.sense_id==='-eth-s2')?.word_type,'Suffix','ritual -eth must remain a suffix');
assert.equal(examples.filter(row=>row.entry_id==='PE-ER2-0007'&&row.celan_text.includes('trakorin')).length,6,'counted boots must use the approved plural on every page');
assert.ok(!ids.has('tl-') && !ids.has('-vel'),'retired root and suffix must not appear as app headwords');
assert.equal(senses.find(row=>row.sense_id==='im-s2').visible,'No','unsettled Im particle must be hidden');
assert.equal(examples.find(row=>row.entry_id==='PE-SET1-0001').sense_id,'-el-s1','approved affectionate form must appear under -el');
assert.equal(families['azfel'].familyRoots.includes('EL'),false,'Azfel must not inherit affectionate -el');
assert.equal(families['azfel'].components.map(part=>part.form).join(' + '),'Az + Fel','Azfel must show its approved parts');
assert.ok(families['fel'].relatedEntries.some(row=>row.id==='azfel'),'Azfel must appear in the Fel family');
assert.equal(families['xarvel'].familyRoots.includes('VEL'),false,'Xarvel must not inherit the wisdom root');
assert.ok(families['zhae-'].relatedEntries.some(row=>row.id==='zhaeaen'),'Zhaeaen must appear under Zhae-');
for(const retiredId of ['PE-V1-0015','PE-V1-0012'])assert.ok(!examples.some(row=>row.entry_id===retiredId),'retired sentence still appears in the app: '+retiredId);
assert.equal(examples.filter(row=>row.entry_id==='PE-V1-0009'&&row.display_kind==='phrase').length,2,'the old beloved boy phrase should appear as a phrase on both pages');
for(let i=1;i<=12;i++)assert.equal(examples.filter(row=>row.entry_id===`PE-LA1-${String(i).padStart(4,'0')}`&&row.sense_id&&row.display_kind==='sentence').length,1,'missing approved batch 01 sentence '+i);
const exportRows=parseCsv(fs.readFileSync(path.join(appDir,'exports','dictionary_entries.csv'),'utf8'));
assert.equal(exportRows.length,1565,'spreadsheet export is missing visible senses');
assert.deepEqual(new Set(exportRows.map(row=>row.sense_id)),new Set(senses.filter(row=>row.visible==='Yes').map(row=>row.sense_id)),'export sense IDs differ from visible app meanings');
const exportedSense=id=>exportRows.find(row=>row.sense_id===id);
for(const id of ['kadfel-s1','azfel-s1','theefel-s1','kadon-s1','aenvor-s1','sorl-s1','kalvar-s1','sharvar-s1','morlka-s1']){
  assert.equal(exportedSense(id).meaning_example_count,'2','approved batch 01 meaning needs two sentences: '+id);
}
assert.equal(exportedSense('aenor-s1').word_parts,'','ear must not inherit the moment breakdown');
assert.equal(exportedSense('aenor-s1').related_words,'','ear must not inherit the moment family');
assert.equal(exportedSense('aenor-s2').word_parts,'Aen + -or');
assert.ok(exportedSense('aenor-s2').related_words.includes('Aenaen'));
assert.equal(exportedSense('aivkorxar-s1').word_parts,'Aivkor + Xar');
assert.equal(exportedSense('dumaen-s1').word_parts,'','unresolved parts must stay out of the reader export');
for(const row of exportRows)assert.doesNotMatch(row.usage_note,/Retain as-is|Preserved as standalone root\/morpheme because source clearly defines it|The source gloss|Builds the approved|Source uses Ohnoshan|Names the organ without embedding an unapproved theory/i,'internal note leaked to export: '+row.sense_id);
for(const row of exportRows)assert.doesNotMatch(row.example_scope,/pending review|assignment pending/i,'internal review label leaked to export: '+row.sense_id);
const entryByName=new Map(entries.map(row=>[row.headword,row]));
for(const row of exportRows){
  const headword=entryByName.get(row.headword);
  const direct=examples.filter(example=>example.headword_id===headword.id&&example.section==='direct');
  const ordinary=direct.filter(example=>example.display_kind==='sentence');
  assert.equal(Number(row.example_count),direct.length,'wrong total example count: '+row.headword);
  assert.equal(Number(row.meaning_example_count),ordinary.filter(example=>example.sense_id===row.sense_id).length,'wrong meaning example count: '+row.sense_id);
  if(row.use_index==='1'){
    assert.equal(Number(row.word_example_count),ordinary.filter(example=>!example.sense_id).length,'wrong word-level example count: '+row.headword);
    assert.equal(Number(row.phrase_count),direct.filter(example=>example.display_kind==='phrase').length,'wrong phrase count: '+row.headword);
    assert.equal(Number(row.idiom_count),direct.filter(example=>example.display_kind==='idiom').length,'wrong idiom count: '+row.headword);
  }
  for(let i=1;i<=5;i++){
    if(!row[`example_${i}_celan`])continue;
    assert.ok(ordinary.some(example=>example.celan_text===row[`example_${i}_celan`]&&example.translation===row[`example_${i}_translation`]&&example.sense_id===row[`example_${i}_sense_id`]),'export preview differs from app example: '+row.sense_id);
    assert.ok(!row[`example_${i}_sense_id`]||row[`example_${i}_sense_id`]===row.sense_id,'example preview is on the wrong meaning: '+row.sense_id);
  }
}
console.log('PASS: the app reads only its seven approved content files; every placed sense and example has a headword; the offline bundle matches.');
