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
const audit = run(`(() => {
 const lookup = buildRootLookup(state.expandedRoots, state.roots);
 const expanded = state.expandedRoots.map(r => ({form:r.form,type:r.entry_type,meaning:r.core_meaning,id:r.source_reference,status:r.status}));
 const morphology = state.roots.map(r => ({form:r.root_or_morpheme,type:r.type,meaning:r.meaning_or_function,id:r.entry_id,status:r.review_status}));
 const inventory = [...expanded,...morphology];
 const uncapped = eval('(' + detectFamilyRoots.toString().replace('return exactRoots.length ? exactRoots : merged.sort', 'return merged.sort').replace('.slice(0, 4)', '') + ')');
 const fullIndex = eval('(' + buildFamilyIndex.toString().replace('.slice(0, 16)', '') + ')')(state.groupedEntries,state.expandedRoots,state.roots);
 return {
 lookup, inventory,
 entries: state.groupedEntries.map(g => {
 const detected = detectFamilyRoots(g, lookup);
 const family = state.familyIndex.get(g.id);
 const override = headwordOverride(g.term);
 const shownRoots = family.familyRoots.filter(r => !family.sharedAffixes.includes(r)).filter(r => normalizeHeadword(r.replace(/-+$/g,'')) !== normalizeHeadword(g.term.replace(/-+$/g,''))).slice(0,3);
 const shownRelated = (override?.familyTerms?.length ? family.relatedEntries.filter(e=>override.familyTerms.includes(e.term)) : family.relatedEntries).slice(0,10);
 return {id:g.id, term:g.term, meanings:displayUses(g), entries:g.entries, detected, uncapped:uncapped(g,lookup), family, fullRelated:fullIndex.get(g.id).relatedEntries, shownRoots, shownRelated, overrideFamily:override?.familyTerms || [],
 evidence:g.entries.map(e=>({id:e.entry_id,text:derivationSource(e)})).filter(e=>e.text),
 links:[...shownRoots,...family.sharedAffixes].map(form=>{const target=findBestLexiconMatch(form);return {form,target:target?.term || null,targetId:target?.id || null,explanation:lookup.find(r=>normalizeHeadword(r.form)===normalizeHeadword(form))?.meaning || null};})};
 })
 };
})()`);
const crypto = require('node:crypto');
const embeddedContext = vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../../dictionary/embedded_data.js'),'utf8'), embeddedContext);
audit.embeddedMismatches = Object.entries(context.datasets).filter(([name,text]) => embeddedContext.window.EMBEDDED_DATA[name+'.csv'] !== text).map(([name])=>name);
assert.deepEqual(audit.embeddedMismatches, [], 'Embedded app data must match audited CSV sources');
audit.capturedAt = new Date().toISOString();
audit.manifest = Object.fromEntries(['dictionary/script.js', ...Object.keys(context.datasets).map(n=>'data/'+n+'.csv')].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../..',file))).digest('hex')]));
fs.writeFileSync(path.join(__dirname,'snapshot.json'),JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify({entries:audit.entries.length, anchors:audit.lookup.length, inventory:audit.inventory.length}));
