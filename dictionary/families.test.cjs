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
const family = term => run(`state.familyIndex.get(normalizeHeadword(${JSON.stringify(term)}))`);
const before = JSON.parse(fs.readFileSync(path.join(__dirname,'../outputs/root_family_audit/snapshot.json'),'utf8'));
const after = run(`state.groupedEntries.map(g=>({id:g.id,term:g.term,uses:displayUses(g),pronunciation:buildPronunciation(g.term,g.entries),family:state.familyIndex.get(g.id)}))`);
assert.equal(after.length,1496);
for (const previous of before.entries) {
  const current=after.find(g=>g.id===previous.id);
  const actualUses = JSON.parse(JSON.stringify(current.uses));
  if (previous.id === 'thar-ka') {
    const noun = actualUses.find(u=>u.type==='Noun');
    assert.match(noun.usage, /my desire.*contextual/);
    noun.usage = previous.meanings.find(u=>u.type==='Noun').usage; // ED-0042 adds only a gloss note.
  }
  assert.deepEqual(actualUses,previous.meanings,previous.term+' senses unchanged');
}
for(const affix of ['-ka','-esh','-el','-vel','-ath','-or']) {
  assert.equal(family(affix).familyRoots.length,0,affix+' must not be assigned to a free root');
  assert.ok(family(affix).sharedAffixes.includes(affix));
  assert.equal(run(`findBestLexiconMatch(${JSON.stringify(affix)}).id`),affix);
}
for(const term of ['Em','Varin']) assert.equal(family(term).relatedEntries.length,0);
assert.ok(family('Velkrel').components.some(p=>p.form==='Velk'&&p.target==='velk'));
assert.ok(family('Velk').relatedEntries.some(p=>p.term==='Velkrel'));
assert.ok(family('Emilpral').components.some(p=>p.form==='Emil'&&p.target==='emil'));
assert.ok(family('Emil').relatedEntries.some(p=>p.term==='Emilpral'));
assert.ok(family('Serilin').components.some(p=>p.form==='-il'&&p.kind==='local'&&!p.target));
assert.ok(family('Varral').components.some(p=>p.form==='-ral'&&p.kind==='local'&&!p.target));
assert.ok(!family('Varral').familyRoots.includes('RAL'));
assert.ok(family('Vorkaral').components.some(p=>p.form==='-al'&&p.kind==='local'));
assert.ok(family('Shenakar').components.some(p=>p.form==='akar'&&p.kind==='local'));
assert.ok(family('Pralaen').familyRoots.includes('PRAL'));
assert.ok(family('Pralaen').sharedAffixes.includes('-aen'));
assert.ok(!family('Lun').familyRoots.includes('WEK'),'A note about Lunwek is not a derivation of Lun');
assert.ok(family('Aen').relatedEntries.some(p=>p.term==='Aenvor'));
assert.ok(family('-eth').relatedEntries.some(p=>p.term==='Shaleth'));
assert.ok(family('Dren').relatedEntries.length>16);
for(const g of after) {
 assert.ok(g.family.familyRoots.every(r=>!r.includes('/')),g.term+' has no combined heading as a root');
 assert.ok(g.family.components.every(p=>!p.target || after.some(g=>g.id===p.target)),g.term+' component targets exist');
 assert.ok(g.family.relatedEntries.every(r=>after.some(g=>g.id===r.id)),g.term+' family targets exist');
 assert.equal(new Set(g.family.relatedEntries.map(r=>r.id)).size,g.family.relatedEntries.length);
}
assert.equal(run(`buildRootLookup(state.expandedRoots,state.roots).find(r=>r.id==='root:ka').meaning.includes('depending on context')`),false);
assert.equal(run(`extractEvidenceTerms('Var + Ok = To Command / To Direct').length`),0);
assert.equal(run(`extractEvidenceTerms('Varok; Var (go); -ka').join('|')`),'Varok|Var|-ka');
const markup=run(`renderComponentLinks(state.familyIndex.get('varral').components)`);
assert.ok(markup.includes('(component in this word)'));
assert.ok(!markup.includes('data-headword="ral"'));
// Capture the actual detail HTML to ensure the complete list is reachable in the UI.
Object.defineProperty(elements.get('detailView'),'innerHTML',{value:'',writable:true,configurable:true});
run(`renderDetail(state.groupedEntries.find(g=>g.id==='dren'))`);
assert.match(elements.get('detailView').innerHTML,/View all \d+ related words/);
const dren=family('Dren');
for(const r of dren.relatedEntries) assert.ok(elements.get('detailView').innerHTML.includes(`data-headword="${r.term}"`),r.term+' appears in full list');
fs.writeFileSync(path.join(__dirname,'../outputs/root_family_audit/after_families.json'),JSON.stringify(after.map(g=>({id:g.id,term:g.term,family:g.family})),null,2)+'\n');
console.log('PASS: all-headword sense preservation, distinct suffix identities, scoped components, reciprocal base-word links, complete families, reviewed links, protected independent words, and rendered full-list access.');
