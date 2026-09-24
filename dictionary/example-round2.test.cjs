const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Exercise the browser's actual data builders, filters and event handlers.
const elements = new Map();
function element() {
  return { value: '', children: [], classList: { add() {}, remove() {}, toggle() {} },
    appendChild(child) { this.children.push(child); }, append(...children) { this.children.push(...children); },
    addEventListener(name, fn) { this[name] = fn; }, querySelectorAll() { return []; },
    set innerHTML(value) { this.children = []; }, get innerHTML() { return ''; } };
}
const context = vm.createContext({ console, document: {
  getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); },
  createElement: element
}, window: {} });
const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
vm.runInContext(source.slice(0, source.lastIndexOf('init().catch')), context);
const run = code => vm.runInContext(code, context);
const csv = name => fs.readFileSync(path.join(__dirname, '../data', name + '.csv'), 'utf8');
context.datasets = Object.fromEntries(['lexicon', 'lexicon_expansions', 'roots_and_morphology', 'expanded_root_database', 'ohnosha_creatures', 'phrases_and_examples', 'grammar_rules', 'expressions'].map(name => [name, csv(name)]));
run(`const data = Object.fromEntries(Object.entries(datasets).map(([key, text]) => [key, rowsToObjects(parseCsv(text))]));
state.phrases = data.phrases_and_examples;
state.groupedEntries = buildGroupedEntries([
  ...data.lexicon.filter(isWordEntry), ...data.lexicon_expansions.filter(isWordEntry),
  ...buildRootEntries(data.expanded_root_database), ...buildMorphologyEntries(data.roots_and_morphology),
  ...buildSupplementalDictionaryEntries(), ...buildCreatureEntries(data.ohnosha_creatures)
]);`);

run(`state.roots=data.roots_and_morphology; state.expandedRoots=data.expanded_root_database;
state.familyIndex=buildFamilyIndex(state.groupedEntries,state.expandedRoots,state.roots);`);
const group = term=>run(`state.groupedEntries.find(g=>g.id===normalizeHeadword(${JSON.stringify(term)}))`);
const sections=term=>run(`entryExampleSections(state.groupedEntries.find(g=>g.id===normalizeHeadword(${JSON.stringify(term)})))`);
const audit=path.join(__dirname,'../outputs/example_sentence_audit');
const plan=JSON.parse(fs.readFileSync(path.join(audit,'round2_plan.json'),'utf8'));
const journal=JSON.parse(fs.readFileSync(path.join(audit,'round2_changes.json'),'utf8'));
const original=JSON.parse(fs.readFileSync(path.join(audit,'snapshot.json'),'utf8'));
const rows=run('state.phrases'), byId=new Map(rows.map(r=>[r.entry_id,r]));
assert.equal(Object.keys(journal.outcomes).length,135);
assert.equal(byId.size,rows.length);
for(const row of original.phrases)assert.ok(byId.has(row.entry_id),'Source record lost: '+row.entry_id);
for(const c of journal.changes)assert.deepEqual(JSON.parse(JSON.stringify(byId.get(c.after.entry_id))),c.after);
const key=t=>t.replace(/[\s.!?"“”]+/g,' ').trim().toLowerCase();
for(const [id,p] of Object.entries(plan)) {
  assert.ok(journal.outcomes[id]);
  if(p.kind==='merge')for(const retired of p.retire)assert.equal(byId.get(retired).app_canonical_id,p.canonical);
  for(const [celan] of p.examples)assert.ok(rows.some(r=>!r.app_canonical_id&&key(r.celan_text)===key(celan)),id+' missing '+celan);
  if(p.kind==='placement')for(const word of p.headwords){
    assert.ok(group(word),'Missing headword '+word);
    const displayed=Object.values(sections(word)).flat();
    for(const eid of journal.outcomes[id].examples)assert.ok(displayed.some(e=>e.entry_id===eid),id+' not displayed '+eid);
  }
}
const fixes=[['Theon','tal theon thal an Ilin.'],['Belshara','lorin belshara Ilin shan vethor.'],['Azon','nethaen azon an nethor.'],['Thaal','rinaen dren-ian shaleth thaal.'],['Tren','var tren serin an dren.']];
for(const [word,text] of fixes)assert.ok(sections(word).direct.some(e=>e.celan_text===text),word+' correction missing');
assert.ok(sections('Unar').direct.some(e=>e.celan_text==='ver aen I unar kelka.'));
const all=run('state.groupedEntries.map(g=>({term:g.term,sections:entryExampleSections(g)}))');
for(const g of all){
 const examples=Object.values(g.sections).flat();
 assert.equal(new Set(examples.map(e=>e.entry_id||key(e.celan_text))).size,examples.length,'Repeated identity '+g.term);
 assert.ok(examples.every(e=>!e.app_canonical_id&&!e.app_grammar_group),'Retired/grammar record displayed '+g.term);
 assert.ok(g.sections.direct.every(e=>!/^Teaching note:/.test(e.example_type)),'Teaching item shown as usage '+g.term);
}
const rules=run('buildRuleEntries(data.grammar_rules)');
for(const eid of journal.grammar)assert.ok(rules.some(r=>String(r.examples).includes(eid)),'Grammar illustration missing '+eid);
assert.equal(run('state.groupedEntries.length'),1496);
const embedded=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(__dirname,'embedded_data.js'),'utf8'),embedded);
for(const [name,text] of Object.entries(context.datasets))assert.equal(embedded.window.EMBEDDED_DATA[name+'.csv'],text,'Embedded parity '+name);
console.log('PASS: all 135 decisions accounted for, five corrections visible, unmarked instruction applied, canonical duplicates, source preservation, placement, teaching separation and grammar relocation.');
