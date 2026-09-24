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
const changes=JSON.parse(fs.readFileSync(path.join(__dirname,'../outputs/example_sentence_audit/applied_changes.json'),'utf8'));
for(const c of changes.sentences) {
 const row=run(`state.phrases.find(p=>p.entry_id===${JSON.stringify(c.after.entry_id)})`);
 assert.equal(row.celan_text,c.after.celan_text);assert.equal(row.translation,c.after.translation);
}
assert.ok(sections('Kavel').teaching.some(e=>e.entry_id==='PE-EGE1-0019'));
assert.ok(!sections('Kavel').direct.some(e=>e.entry_id==='PE-EGE1-0019'));
assert.ok(sections('Kavel').direct.some(e=>e.entry_id==='PE-DR2-0014'));
assert.ok(sections('Ka').direct.every(e=>!/\b(?:I|Ilin)-ka\b/.test(e.celan_text)));
for(const id of ['PE-EGE1-0018','PE-EGE1-0049','PE-EGE1-0058']) assert.ok(sections('Jor').direct.some(e=>e.entry_id===id));
assert.ok(!sections('Mahrwel').direct.some(e=>e.entry_id==='PE-EGE1-0018'));
assert.ok(sections('Talaen').direct.some(e=>e.celan_text==='talaen I drenvor thal pralor.'));
assert.ok(sections('Talaen').direct.some(e=>e.celan_text==='talaen I morlak an Felka.'));
assert.ok(sections('Thal').direct.some(e=>e.entry_id==='PE-S3-0005')); // thal now illustrates from, not balance.
assert.ok(!sections('Ohm').direct.some(e=>e.entry_id==='PE-S3-0011'));
assert.ok(sections('Kalkel').direct.some(e=>e.celan_text==='Kalrin-ka kalkel'));
assert.ok(!sections('Kelka').direct.some(e=>e.entry_id==='PE-S3-0022'));
assert.ok(!sections('Var').direct.some(e=>/counterexample/i.test(e.example_type)));
assert.ok(sections('Var').teaching.some(e=>/counterexample/i.test(e.example_type)));
assert.match(run(`renderExampleSections(state.groupedEntries.find(g=>g.id==='talaen'))`),/To Take \(contextual\), To Receive/);
assert.match(run(`renderExampleSections(state.groupedEntries.find(g=>g.id==='jor'))`),/Noun: Surge or burst/);
const all=run(`state.groupedEntries.map(g=>({id:g.id,term:g.term,senses:displayUses(g).length,sections:entryExampleSections(g)}))`);
let large=all.find(g=>g.sections.direct.length>5);assert.ok(large);
assert.match(run(`renderExampleSections(state.groupedEntries.find(g=>g.id===${JSON.stringify(large.id)}))`),/View all \d+ usage examples/);
assert.ok(all.every(g=>g.sections.direct.every(e=>!/historical|counterexample/i.test(e.example_type||''))));
assert.equal(run(`state.phrases.find(p=>p.entry_id==='PE-S4B-0008').celan_text`),'ohmaen I Ya.');
assert.match(group('Thar-ka').uses.find(u=>u.type==='Noun').usage,/contextual/);
fs.writeFileSync(path.join(__dirname,'../outputs/example_sentence_audit/after_coverage.json'),JSON.stringify(all.map(g=>({id:g.id,term:g.term,direct:g.sections.direct.length,related:g.sections.related.length,teaching:g.sections.teaching.length,senses:g.senses})),null,2)+'\n');
console.log('PASS: approved sentence edits, corrected links, direct/related/teaching separation, sense labels, View all, and preserved Thar-ka clarification.');
