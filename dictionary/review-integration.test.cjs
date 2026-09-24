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
const get = term => run(`state.groupedEntries.find(g=>normalizeHeadword(g.term)===normalizeHeadword(${JSON.stringify(term)}))`);
const has = (term,type,meaning) => get(term).uses.some(u=>u.type===type && u.meaning.toLowerCase().includes(meaning.toLowerCase()));
for(const term of ["Arthen'taleth","Kor'taleth","Thal'taleth","Thar'taleth",'Phelrin','Phelvin']) assert.ok(has(term,'Noun',term.includes('taleth')?'noun':'comfort'),term);
for(const term of ['Jorvar','Lianrethshen','Vaarshen']) for(const type of ['Noun','Measure']) assert.ok(has(term,type,''),term+type);
for(const term of ['Belshara','Thar-ka']) {assert.ok(has(term,'Modal',''));assert.ok(has(term,'Noun',''));}
for(const type of ['Modal','Verb','Adjective']) assert.ok(has('Lianeth',type,''));
for(const type of ['Modal','Particle','Interjection']) assert.ok(has('Rethlian',type,''));
assert.ok(has('Lorin','Noun','Guide'));assert.ok(has('Lorin','Verb','guide'));
assert.ok(has('Aen','Noun','Breath of Life'));assert.ok(has('Aen','Verb','Breathe'));
assert.ok(has('Jin','Adjective','Unique'));assert.ok(has('Ven','Particle','minus'));
assert.ok(get('-eth').uses.every(u=>u.type==='Suffix'));
for(const [term,type,meaning] of [['Lumor','Noun','Talisman'],['Zhelvek','Noun','Energy Bar'],['Zhelvek','Noun','Energy carrier'],['Drenkorath','Noun','Sacred spring'],['Drenkorath','Noun','Oasis Blessing'],['Kaleth','Noun','Fortress'],['Kaleth','Adjective','Strong'],['nor-ka','Particle','passive'],['nor-ka','Particle','Now'],['Tenar','Number','Ten'],['Tenar','Noun','Radiance']]) assert.ok(has(term,type,meaning),term+meaning);
for(const term of ['Shen','Kal','Bren','Vanesh','Jor','Kar','Shara','Xar','Shentalzhael']) assert.ok(has(term,'Verb',''),term);
const before=JSON.parse(fs.readFileSync(path.join(__dirname,'../outputs/dictionary_review/integration/before_snapshot.json'),'utf8'));
const wordingChanges=new Set(['I','Ilin','Ya','Yalin','La','Lalin','Aen','Inko','Yako','Lako','Imen']);
for(const old of before){
 const current=get(old.term);assert.ok(current,'Lost headword '+old.term);
 assert.equal(run(`buildPronunciation(${JSON.stringify(old.term)},state.groupedEntries.find(g=>g.id===normalizeHeadword(${JSON.stringify(old.term)})).entries)`),old.pronunciation,'Changed pronunciation '+old.term);
 if(!wordingChanges.has(old.term)) for(const sense of old.uses) {
   // The approved Lorin verb reading is explicitly retained as "To guide".
   assert.ok(current.uses.some(u=>u.meaning===sense.meaning),'Lost established meaning '+old.term+': '+sense.meaning);
 }
}
const additions=JSON.parse(fs.readFileSync(path.join(__dirname,'../outputs/dictionary_review/integration/added_entries.json'),'utf8'));
assert.equal(additions.length,33);assert.equal(run('state.groupedEntries.length'),before.length+33);
for(const addition of additions) assert.ok(has(addition.entry.celan_term,addition.entry.category,addition.entry.english_meaning));
assert.ok(has('Noral','Noun','Night'));assert.ok(has('Varan','Verb','reside'));
assert.ok(get('Varan').entries[0].derivation.includes('not continuous -al'));
assert.equal(get('Thaar'),undefined);assert.equal(get('Tharvinwek'),undefined);assert.equal(get('serilín'),undefined);
for(const [term,alias] of [['Thar','thaar'],['Tharvin-Wek','tharvinwek'],['Serilin','serilín'],["Reth‘thal","reth'thal"],["Lia‘ser","lia'ser"]]) assert.ok(get(term).searchText.includes(alias),term);
for(const [term,q] of [['I','me'],['Ya','you'],['La','they'],['Lalin','them'],['Ilin','we'],['Yalin','you']]) assert.ok(run(`findEnglishMatches(state.groupedEntries.find(g=>g.id===normalizeHeadword(${JSON.stringify(term)})),${JSON.stringify(q)}).length`));
const phrase = id => run(`state.phrases.find(p=>p.entry_id===${JSON.stringify(id)})`);
assert.equal(phrase('PE-V3-0211').translation,'4,787 (4,000 + 700 + 80 + 7)');
assert.equal(phrase('PE-GMMP1-0003').translation,'The carrier is nonmagical; the guardian practices magic in the sanctuary.');
assert.equal(phrase('PE-HTS1-0066').translation,'The friend is still regaining consciousness.');
assert.equal(phrase('PE-V1-0041').celan_text,'Tha-var La thal Shalor.');
assert.equal(phrase('PE-RABFE2-0016').celan_text,'keshenaen zhaelral nderun.');
assert.equal(phrase('PE-GCI1-0019').celan_text,'keltharaen welrinin an welkelthar.');
assert.equal(phrase('PE-GCI1-0042').celan_text,'keltharaen welrin an welkelthar.');
assert.equal(phrase('PE-BIAOBF1-0001').celan_text,'rinaen aiv an doran-ian.');
assert.equal(phrase('PE-BIAOBF1-0083').celan_text,'rinaen ndemwek-ian nor shara.');
assert.equal(phrase('PE-RABFE2-0001').celan_text,'drenselaen I noka-ian.');
assert.equal(phrase('PE-DR1-0006').celan_text,'drenaen La dren kora rinaen La-ka kelvor kadreneth.');
for(const id of ['PE-V1-0034','PE-V4-0045','PE-RABFE2-0026']) assert.ok(phrase(id).celan_text.includes('I ka '),'Negative changed '+id);
assert.equal(run(`state.phrases.filter(p=>/\b(?:my|your)\b/i.test(p.translation) && /\b(?:I|Ya) ka /.test(p.celan_text)).length`),0);
const f48=JSON.parse(fs.readFileSync(path.join(__dirname,'../outputs/dictionary_review/F048_applied.json'),'utf8'));
const round2=JSON.parse(fs.readFileSync(path.join(__dirname,'../outputs/example_sentence_audit/round2_changes.json'),'utf8'));
const latestExamples=new Map(round2.changes.map(c=>[c.after.entry_id,c.after]));
for(const change of f48.changes) assert.equal(phrase(change.entry_id).celan_text,(latestExamples.get(change.entry_id)||change.after).celan_text,'F048 regression '+change.entry_id);
assert.equal(phrase('PE-UHEI1-0035').celan_text,f48.kept_entry.celan_text);
const changes=JSON.parse(fs.readFileSync(path.join(__dirname,'../outputs/dictionary_review/integration/applied_changes.json'),'utf8'));
const lastById=new Map(changes.map(c=>[c.entry_id,c]));
for(const c of lastById.values())for(const field of ['celan_text','translation'])assert.equal(phrase(c.entry_id)[field],(latestExamples.get(c.entry_id)||c.after)[field],c.entry_id+field);
for(const term of ['Elan',"Thaal'ra",'Kora']) {
 assert.equal(run(`extractInlineExamples(state.groupedEntries.find(g=>g.id===normalizeHeadword(${JSON.stringify(term)})).entries).length`),0);
 assert.ok(run(`relatedExamples(state.groupedEntries.find(g=>g.id===normalizeHeadword(${JSON.stringify(term)}))).length`)>=2);
}
assert.equal(phrase('PE-S4B-0002').example_type,'Incorrect counterexample');
assert.equal(phrase('PE-S4B-0002').translation,'I go to the water.');
for(const term of ['Aentash','Emiltash'])assert.ok(!run(`state.familyIndex.get(normalizeHeadword(${JSON.stringify(term)})).familyRoots`).includes('ASH'));
for(const term of ['Kalrath','Havrath'])assert.ok(!run(`state.familyIndex.get(normalizeHeadword(${JSON.stringify(term)})).familyRoots`).includes('ATH'));
assert.ok(run(`state.familyIndex.get('mbaen').familyRoots`).includes('MB'));
const brewFamily=run(`state.familyIndex.get('drenpralaen')`);
assert.ok(brewFamily.familyRoots.includes('DREN') && brewFamily.familyRoots.includes('PRAL'));
assert.ok(!brewFamily.familyRoots.includes('OR'));
assert.ok(brewFamily.relatedEntries.slice(0,10).some(e=>e.term.startsWith('Pral')));
assert.equal(run(`findBestLexiconMatch('definitely-missing-root')`),null);
assert.equal(run(`findBestLexiconMatch('-ka').term`),'-ka');
for(const [root,wrong] of [['ATH','Athnor'],['DEN','Deni'],['ASH','Varash']]) assert.notEqual(run(`findBestLexiconMatch(${JSON.stringify(root)})?.term`),wrong);
const rules=run('buildRuleEntries(data.grammar_rules)');
for(const id of ['GR-DR1-0001','GR-DR1-0002','GR-DR1-0003','GR-DR1-0004'])assert.ok(rules.some(r=>r.id===id),id);
assert.ok(!rules.some(r=>['GR-V1-0007','GR-V1-0020','GR-V3-0006'].includes(r.id)));
console.log('PASS: approved senses, preservation of all earlier headwords/pronunciations, 33 additions, corrected examples, F048 preservation, strict possession, lookup, family links, example labels, and grammar.');
assert.equal(run(`phrasePlanForIntent('I want to see your eyes', CULTURAL_LENSES.neutral, new Map([['eye',{term:'Lorinshal'}]])).celan`), 'Shalaen I thar-ka lorinshalin-ya.');
assert.ok(run(`generateReasonedCandidates('', CULTURAL_LENSES.neutral, {family:'intimacy-presence'}, {exactCanonSupport:new Map()})[0].celan`).includes('esh-ya'));
console.log('PASS: final phrase-generator personal possession uses -ya.');
