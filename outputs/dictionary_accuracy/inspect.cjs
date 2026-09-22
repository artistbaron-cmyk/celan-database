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
context.datasets = Object.fromEntries(['lexicon', 'lexicon_expansions', 'roots_and_morphology', 'expanded_root_database', 'ohnosha_creatures', 'phrases_and_examples'].map(name => [name, csv(name)]));
run(`const data = Object.fromEntries(Object.entries(datasets).map(([key, text]) => [key, rowsToObjects(parseCsv(text))]));
state.phrases = data.phrases_and_examples;
state.groupedEntries = buildGroupedEntries([
  ...data.lexicon.filter(isWordEntry), ...data.lexicon_expansions.filter(isWordEntry),
  ...buildRootEntries(data.expanded_root_database), ...buildMorphologyEntries(data.roots_and_morphology),
  ...buildSupplementalDictionaryEntries(), ...buildCreatureEntries(data.ohnosha_creatures)
]);`);

const findings = run(`(() => {
 const key = u => u.type.toLowerCase() + '::' + u.meaning.toLowerCase();
 return {
  counts: {headwords: state.groupedEntries.length, senses: state.groupedEntries.reduce((n,g)=>n+displayUses(g).length,0), expansions: data.lexicon_expansions.length},
  missingExpansionSenses: data.lexicon_expansions.flatMap(e => {
    const g=state.groupedEntries.find(g=>g.id===normalizeHeadword(e.celan_term));
    return buildUses(e).filter(u=>!g || !displayUses(g).some(v=>key(u)===key(v))).map(u=>({id:e.entry_id,term:e.celan_term,meaning:u.meaning}));
  }),
  generatedPronunciations: state.groupedEntries.filter(g=>!g.entries.some(e=>e.pronunciation) && !PRONUNCIATION_OVERRIDES[g.id]).map(g=>g.term),
  searchOnly: state.groupedEntries.flatMap(g => g.englishSenses.filter(u => !displayUses(g).some(v => key(u) === key(v))).map(u => ({term:g.term, type:u.type, meaning:u.meaning, sources:u.sourceEntries}))),
  explicitTypeMismatch: state.groupedEntries.flatMap(g => g.entries.filter(e => /^(Noun|Verb|Adjective|Adverb|Particle|Interjection)$/i.test(e.category)).flatMap(e => buildUses(e).filter(u => u.type !== e.category).map(u => ({term:g.term,id:e.entry_id,category:e.category,inferred:u.type,meaning:u.meaning})))),
  untyped: state.groupedEntries.flatMap(g => displayUses(g).filter(u => !u.type).map(u => ({term:g.term, meaning:u.meaning, sources:u.sourceEntries}))),
  unreviewed: data.lexicon.filter(isWordEntry).filter(e => e.review_status !== 'Approved').map(e => ({term:e.celan_term,id:e.entry_id,status:e.review_status,reason:e.review_reason,meaning:e.english_meaning})),
  droppedFragments: data.lexicon.concat(data.lexicon_expansions).filter(e => parseExplicitUses(e).length && e.english_meaning.split(/\\s*;\\s*/).some(p => !/^([A-Za-z()\\/ -]+):\\s*(.+)$/.test(p))).map(e => ({id:e.entry_id,term:e.celan_term,meaning:e.english_meaning})),
  overrides: state.groupedEntries.filter(g => headwordOverride(g.term)?.uses).map(g => ({term:g.term, displayed:displayUses(g), rows:g.entries})),
  empty:state.groupedEntries.filter(g => !displayUses(g).length || displayUses(g).some(u=>!u.meaning)).map(g=>g.term)
 };
})()`);
fs.writeFileSync(path.join(__dirname, 'current_findings.json'), JSON.stringify(findings, null, 2)+'\n');
for (const [k,v] of Object.entries(findings)) console.log(k, Array.isArray(v) ? v.length : v);
console.log(JSON.stringify(findings.explicitTypeMismatch,null,2));
console.log('Dropped fragments', JSON.stringify(findings.droppedFragments,null,2));
