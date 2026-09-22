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

const checks = run(`({
 englishPronouns:['i','ya','la','yalin','lalin'].map(id=>({id,meaning:state.groupedEntries.find(g=>g.id===id).uses,queries:({i:['I','me'],ya:['you'],la:['he','she','it','they'],yalin:['you'],lalin:['they','them']})[id].map(q=>({q,matches:findEnglishMatches(state.groupedEntries.find(g=>g.id===id),q).length}))})),
 apostrophes:state.groupedEntries.filter(g=>/[‘’]/.test(g.term)).map(g=>({term:g.term,straight:g.term.replace(/[‘’]/g,"'"),found:g.searchText.includes(g.term.replace(/[‘’]/g,"'").toLowerCase())})),
 rootLinks:state.groupedEntries.flatMap(g=>(state.familyIndex.get(g.id)?.familyRoots||[]).filter(root=>!state.groupedEntries.some(c=>c.id===normalizeHeadword(root))).map(root=>({term:g.term,root,actual:findBestLexiconMatch(root)?.term}))),
 variantCollisions:[],
 wordTypes:availableWordTypes()
})`);
fs.writeFileSync(path.join(__dirname,'runtime_checks.json'),JSON.stringify(checks,null,2)+'\n');
console.log(JSON.stringify(checks,null,2));
