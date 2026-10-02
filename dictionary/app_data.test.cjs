const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const appDir = __dirname;
const dataDir = path.join(appDir, 'app_data');
const sourceFiles = [
  'dictionary_entries.csv', 'dictionary_senses.csv', 'dictionary_examples.csv',
  'dictionary_families.json', 'grammar_guide.json', 'expressions_app.json',
  'phrase_builder.json'
];
const html = fs.readFileSync(path.join(appDir, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
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
const grammar=JSON.parse(bundle['grammar_guide.json']);
const expressions=JSON.parse(bundle['expressions_app.json']);
assert.equal(entries.length,1496);
assert.equal(senses.filter(row=>row.visible==='Yes').length,1607);
assert.equal(examples.length,9167);
assert.equal(grammar.rules.length,48);
assert.equal(expressions.length,107);
const ids=new Set(entries.map(row=>row.id));
assert.equal(ids.size,entries.length,'duplicate headword ids');
for(const row of senses)assert.ok(ids.has(row.headword_id),'orphan sense: '+row.headword_id);
for(const row of examples){assert.ok(ids.has(row.headword_id),'orphan example: '+row.headword_id);assert.ok(['direct','related','teaching'].includes(row.section),'invalid example section');}
for(const row of entries){
  const family=families[row.id];
  assert.ok(family,'missing family record: '+row.id);
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
let approvedExampleLinks=0;
for(const row of examples){
  assert.ok(kinds.has(row.display_kind),'missing example display kind: '+row.headword_id+'/'+row.display_order);
  if(row.sense_id){
    approvedExampleLinks++;
    assert.equal(visibleById.get(row.sense_id)?.headword_id,row.headword_id,'broken example meaning link: '+row.sense_id);
    assert.equal(visibleById.get(row.sense_id)?.meaning,row.sense_meaning,'example meaning wording differs from its link: '+row.sense_id);
  }
}
assert.equal(approvedExampleLinks,24,'the existing and batch 01 meaning links should remain explicit');
for(const retiredId of ['PE-V1-0015','PE-V1-0012'])assert.ok(!examples.some(row=>row.entry_id===retiredId),'retired sentence still appears in the app: '+retiredId);
assert.equal(examples.filter(row=>row.entry_id==='PE-V1-0009'&&row.display_kind==='phrase').length,2,'the old beloved boy phrase should appear as a phrase on both pages');
for(let i=1;i<=12;i++)assert.equal(examples.filter(row=>row.entry_id===`PE-LA1-${String(i).padStart(4,'0')}`&&row.sense_id&&row.display_kind==='sentence').length,1,'missing approved batch 01 sentence '+i);
const exportRows=parseCsv(fs.readFileSync(path.join(appDir,'exports','dictionary_entries.csv'),'utf8'));
assert.equal(exportRows.length,1607,'spreadsheet export is missing visible senses');
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
