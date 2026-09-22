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
assert.equal(run(`displayDerivation('New two-syllable primitive: plant-produced sweet liquid')`), '');
assert.equal(run(`displayDerivation('New primitive Gav living-quarry pursuit + -aen')`), 'Gav living-quarry pursuit + -aen');
assert.equal(run(`displayDerivation('Zor animal + Nelar nectar')`), 'Zor animal + Nelar nectar');
assert.equal(run(`displayDerivation('Existing Shan passing extended grammatically')`), '');
assert.equal(run(`displayDerivation('Latent material root promoted from established Dreshal crystal device')`), '');
assert.equal(run(`relatedExamples(state.groupedEntries.find(group => group.id === 'nelar')).map(example => example.entry_id).join('|')`),
  'PE-FAP1-0051|PE-FAP1-0052');
assert.equal(run(`relatedExamples(state.groupedEntries.find(group => group.id === 'dresh')).map(example => example.entry_id).join('|')`),
  'PE-CWM2-0015|PE-CWM2-0016|PE-SCP1-0016');
assert.equal(run(`state.groupedEntries.find(group => group.id === 'nelar').preview`),
  'Noun: Nectar; a sweet liquid naturally produced by a plant, especially in flowers, that may be gathered as food');
assert.equal(run(`state.groupedEntries.find(group => group.id === 'nelar').searchText.includes('builds words for nectar')`), false);
assert.equal(run(`state.groupedEntries.find(group => group.id === 'nelar').searchText.includes('new two-syllable primitive')`), false);
assert.equal(run(`expansionMetadata(state.groupedEntries.find(group => group.id === 'nelar'))`), null);
assert.ok(run(`findEnglishMatches(state.groupedEntries.find(group => group.id === 'thal'), 'from', 'Preposition').length > 0`));
assert.ok(run(`findEnglishMatches(state.groupedEntries.find(group => group.id === 'thal'), 'balance', 'Noun').length > 0`));
assert.equal(run(`displayRootWordMarker(state.groupedEntries.find(group => group.id === 'thal'), displayUses(state.groupedEntries.find(group => group.id === 'thal'))[0])`), 'Root Word');
assert.equal(run(`displayUses(state.groupedEntries.find(group => group.id === 'shan')).map(use => use.type + ':' + use.meaning).join('|')`),
  'Verb:Passing; transfer; handoff between states|Preposition:Through or across from one side or boundary to another');
assert.equal(run(`data.phrases_and_examples.find(example => example.entry_id === 'PE-NE1-0015').celan_text`), 'drenaen I drosel.');
assert.equal(run(`data.phrases_and_examples.find(example => example.entry_id === 'PE-FAP2-0008').celan_text`), 'dor mekral olan an karvek.');
assert.equal(run(`data.phrases_and_examples.find(example => example.entry_id === 'PE-CNE1-0064').celan_text`), "rakel. va aen Ya wek'aen.");
assert.equal(run(`(() => {
  const phrasesById = new Map(data.phrases_and_examples.map(example => [example.entry_id, example]));
  const mismatches = [];
  data.lexicon_expansions.forEach(entry => {
    const forms = [entry.celan_term, ...splitIds(entry.variant_forms)]
      .map(form => cleanAlpha(form.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))
      .filter(Boolean);
    splitIds(entry.related_entry_ids).filter(id => id.startsWith('PE-')).forEach(id => {
      const example = phrasesById.get(id);
      if (!example) {
        mismatches.push(entry.celan_term + ':missing:' + id);
        return;
      }
      const tokens = (example.celan_text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().match(/[a-z]+/g) || [];
      // GR-V2-0001: consonants take -in; vowels take -n. Match the whole
      // inflected token so unrelated compounds still fail this check.
      const attestedForms = entry.category === 'Noun'
        ? forms.flatMap(form => [form, form + (/[aeiou]$/.test(form) ? 'n' : 'in')]) : forms;
      if (!attestedForms.some(form => tokens.includes(form))) mismatches.push(entry.celan_term + ':' + id);
    });
  });
  return mismatches.join('|');
})()`), '');
assert.equal(run(`englishMeaningScore('To drink; sip', ' DRINK ')`), 3);
assert.equal(run(`englishMeaningScore('Heart', 'art')`), 0);
assert.equal(run(`englishMeaningScore('Fresh-water (noun)', 'fresh water')`), 3);
assert.equal(run(`englishMeaningScore('A vessel for water', 'water')`), 2);
assert.equal(run(`englishMeaningScore('Water', '!!!')`), 0);
assert.equal(run(`englishMeaningScore('Friend', 'companion')`), 0);
assert.equal(run(`findEnglishMatches({ englishSenses: [
  { type: 'Noun', meaning: 'Light' }, { type: 'Verb', meaning: 'To guide' }
] }, 'light', 'Verb').length`), 0);
assert.equal(run(`findEnglishMatches({ searchText: 'water in the notes', englishSenses: [
  { type: 'Noun', meaning: 'Fire' }
] }, 'water').length`), 0);


assert.equal(run(`displayUses(state.groupedEntries.find(group => group.id === 'lianaen'))[0].type`), 'Verb');
assert.equal(run(`data.lexicon_expansions.filter(entry => {
  const group = state.groupedEntries.find(group => group.id === normalizeHeadword(entry.celan_term));
  return !group || buildUses(entry).some(use => !displayUses(group).some(shown => shown.type === use.type && shown.meaning === use.meaning));
}).map(entry => entry.entry_id).join('|')`), '');

// Source tables must not silently shift columns due to unquoted commas.
for (const filename of fs.readdirSync(path.join(__dirname, '../data')).filter(name => name.endsWith('.csv'))) {
  context.checkedCsv = fs.readFileSync(path.join(__dirname, '../data', filename), 'utf8');
  assert.equal(run(`(() => { const rows = parseCsv(checkedCsv); return rows.slice(1).filter(row => row.length !== rows[0].length).length; })()`), 0, filename);
}

// Search may not revive raw source senses omitted by editorial display rules.
assert.equal(run(`state.groupedEntries.filter(group =>
  JSON.stringify(group.englishSenses) !== JSON.stringify(displayUses(group))
).map(group => group.term).join('|')`), '');
// Every indexed sense must retrieve its own headword, including its word-type filter.
const coverage = run(`(() => {
  let count = 0;
  for (const group of state.groupedEntries) {
    for (const sense of group.englishSenses) {
      if (!normalizeEnglishSearch(sense.meaning).replace(/^to /, '')) continue;
      if (!findEnglishMatches(group, sense.meaning, sense.type).length) throw new Error(group.term + ': ' + sense.meaning);
      count++;
    }
  }
  return { headwords: state.groupedEntries.length, senses: count };
})()`);
assert.equal(run(`(() => {
  const missing = [];
  for (const group of state.groupedEntries) {
    for (const use of displayUses(group)) {
      const key = ((use.type || '').trim().toLowerCase() + '::' + (use.meaning || '').trim().toLowerCase());
      const indexed = group.englishSenses.some(sense =>
        ((sense.type || '').trim().toLowerCase() + '::' + (sense.meaning || '').trim().toLowerCase()) === key
      );
      if (!indexed) missing.push(group.term + ':' + key);
    }
  }
  return missing.join('|');
})()`), '');
run(`state.activeLetter = 'Z'; els.searchInput.value = 'water'; els.searchMode.value = 'english'; els.searchMode.change();`);
assert.equal(run(`state.activeLetter`), 'ALL');
assert.equal(run(`els.azBar.hidden`), true);
assert.ok(run(`state.filtered.some(group => group.term.toLowerCase() === 'dren')`));
assert.equal(run(`findEnglishMatches(state.filtered[0], 'water')[0].score`), 3);
run(`els.wordTypeFilter.value = 'Verb'; els.wordTypeFilter.change();`);
assert.ok(run(`state.filtered.every(group => findEnglishMatches(group, 'water', 'Verb').length)`));
run(`els.searchInput.value = 'zzzznonexistent'; els.searchInput.input();`);
assert.equal(run(`state.filtered.length`), 0);
assert.match(run(`els.resultList.children[0].textContent`), /No matching English/);
run(`jumpToHeadword('dren');`);
assert.equal(run(`state.searchMode`), 'all');
assert.equal(run(`state.activeWordType`), 'ALL');
assert.equal(run(`state.selectedId`), 'dren');
assert.equal(run(`els.azBar.hidden`), false);
run(`els.searchInput.value = 'dren'; els.searchInput.input();`);
assert.ok(run(`state.filtered.some(group => group.id === 'dren')`));
run(`els.searchInput.value = ''; applyFilters();`);
assert.equal(run(`els.resultList.children.length`), 100);
assert.equal(run(`els.resultCount.textContent`), `Showing 100 of ${coverage.headwords} results`);
assert.equal(run(`els.loadMoreResults.hidden`), false);
run(`els.loadMoreResults.click();`);
assert.equal(run(`els.resultList.children.length`), 200);
run(`els.resultList.children[150].children[0].onclick();`);
assert.equal(run(`els.resultList.children.length`), 200);
run(`while (!els.loadMoreResults.hidden) els.loadMoreResults.click();`);
assert.equal(run(`els.resultList.children.length`), coverage.headwords);
assert.equal(run(`els.loadMoreResults.hidden`), true);
assert.equal(run(`els.resultList.children.map(li => li.children[0].children[0].textContent).join('|')`),
  run(`state.filtered.map(group => group.term).join('|')`));
run(`els.searchInput.value = 'dren'; els.searchInput.input();`);
assert.equal(run(`state.visibleResultCount`), 100);
assert.equal(run(`els.loadMoreResults.hidden`), run(`state.filtered.length <= 100`));
run(`els.searchInput.value = 'zzzznonexistent'; els.searchInput.input();`);
assert.equal(run(`els.loadMoreResults.hidden`), true);
assert.equal(run(`els.resultCount.textContent`), 'Showing 0 of 0 results');
run(`els.searchInput.value = ''; setSearchMode('english'); els.loadMoreResults.click();`);
assert.equal(run(`els.resultList.children.length`), 200);
run(`els.wordTypeFilter.value = 'Verb'; els.wordTypeFilter.change();`);
assert.equal(run(`state.visibleResultCount`), 100);
run(`jumpToHeadword(state.groupedEntries.slice().sort((a, b) => a.term.localeCompare(b.term)).at(-1).term);`);
assert.ok(run(`state.filtered.slice(0, state.visibleResultCount).some(group => group.id === state.selectedId)`));

// Offline/file usage receives the same datasets as HTTP CSV loading.
vm.runInContext(fs.readFileSync(path.join(__dirname, 'embedded_data.js'), 'utf8'), context);
for (const [name, text] of Object.entries(context.datasets)) {
  assert.ok(context.window.EMBEDDED_DATA['data/' + name + '.csv'] === text || context.window.EMBEDDED_DATA[name + '.csv'] === text, name + ' embedded data drift');
}
console.log('English lookup passed:', coverage);
