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
const source = fs.readFileSync(path.join(__dirname, '../../dictionary/script.js'), 'utf8');
vm.runInContext(source.slice(0, source.lastIndexOf('init().catch')), context);
const run = code => vm.runInContext(code, context);
const csv = name => fs.readFileSync(path.join(__dirname, '../../data', name + '.csv'), 'utf8');
context.datasets = Object.fromEntries(['lexicon', 'lexicon_expansions', 'roots_and_morphology', 'expanded_root_database', 'ohnosha_creatures', 'phrases_and_examples', 'grammar_rules', 'expressions'].map(name => [name, csv(name)]));
run(`const data = Object.fromEntries(Object.entries(datasets).map(([key, text]) => [key, rowsToObjects(parseCsv(text))]));
state.phrases = data.phrases_and_examples;
state.groupedEntries = buildGroupedEntries([
  ...data.lexicon.filter(isWordEntry), ...data.lexicon_expansions.filter(isWordEntry),
  ...buildRootEntries(data.expanded_root_database), ...buildMorphologyEntries(data.roots_and_morphology),
  ...buildSupplementalDictionaryEntries(), ...buildCreatureEntries(data.ohnosha_creatures)
]);`);


run(`state.roots = data.roots_and_morphology;
state.expandedRoots = data.expanded_root_database;
state.familyIndex = buildFamilyIndex(state.groupedEntries, state.expandedRoots, state.roots);`);
const snapshot = run(`state.groupedEntries.map(g => ({
 id:g.id, term:g.term, uses:displayUses(g), entries:g.entries,
 pronunciation:buildPronunciation(g.term,g.entries), metadata:expansionMetadata(g),
 examples:(headwordOverride(g.term)?.examples?.length ? headwordOverride(g.term).examples : relatedExamples(g)),
 family:state.familyIndex.get(g.id), englishSenses:g.englishSenses
}))`);
fs.writeFileSync(path.join(__dirname,'integration/before_snapshot.json'),JSON.stringify(snapshot,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'integration/before_tables.json'),JSON.stringify(run('data'),null,2)+'\n');
const crypto=require('node:crypto');
const files=['dictionary/script.js','dictionary/embedded_data.js',...Object.keys(context.datasets).map(n=>'data/'+n+'.csv')];
fs.writeFileSync(path.join(__dirname,'integration/before_manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(), files:Object.fromEntries(files.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../..',file))).digest('hex')]))},null,2)+'\n');
console.log(JSON.stringify({headwords:snapshot.length,senses:snapshot.reduce((n,g)=>n+g.uses.length,0),exampleLinks:snapshot.reduce((n,g)=>n+g.examples.length,0),visibleExampleLinks:snapshot.reduce((n,g)=>n+Math.min(5,g.examples.length),0),uniqueExamples:new Set(snapshot.flatMap(g=>g.examples.map(e=>e.celan_text+'::'+e.translation))).size}));
