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
assert.equal(examples.length,9163);
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
const exportRows=parseCsv(fs.readFileSync(path.join(appDir,'exports','dictionary_entries.csv'),'utf8'));
assert.equal(exportRows.length,1607,'spreadsheet export is missing visible senses');
assert.deepEqual(new Set(exportRows.map(row=>row.sense_id)),new Set(senses.filter(row=>row.visible==='Yes').map(row=>row.sense_id)),'export sense IDs differ from visible app meanings');
for(const row of exportRows)assert.doesNotMatch(row.usage_note,/Retain as-is|Preserved as standalone root\/morpheme because source clearly defines it|The source gloss|Builds the approved|Source uses Ohnoshan|Names the organ without embedding an unapproved theory/i,'internal note leaked to export: '+row.sense_id);
for(const row of exportRows)assert.doesNotMatch(row.example_scope,/pending review|assignment pending/i,'internal review label leaked to export: '+row.sense_id);
console.log('PASS: the app reads only its seven approved content files; every placed sense and example has a headword; the offline bundle matches.');
