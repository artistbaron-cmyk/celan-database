const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function harness(hash = '') {
  const elements = new Map();
  function element() {
    const listeners = {};
    return { value: '', children: [], innerHTML: '', classList: { add() {}, remove() {}, toggle() {} },
      appendChild(child) { this.children.push(child); }, append(...children) { this.children.push(...children); },
      addEventListener(name, fn) { (listeners[name] ||= []).push(fn); },
      dispatch(name) { for (const fn of listeners[name] || []) fn({}); }, querySelectorAll() { return []; } };
  }
  const listeners = {};
  const window = { location: { pathname: '/dictionary/index.html', search: '', hash }, scrollX: 0, scrollY: 0,
    scrollTo(x, y) { this.scrollX = x; this.scrollY = y; },
    addEventListener(name, fn) { (listeners[name] ||= []).push(fn); } };
  const entries = [{ state: null, url: hash }];
  let index = 0;
  const setURL = url => { window.location.hash = url.includes('#') ? url.slice(url.indexOf('#')) : ''; };
  function move(delta) {
    if (!entries[index + delta]) return;
    index += delta; setURL(entries[index].url);
    for (const fn of listeners.popstate || []) fn({ state: entries[index].state });
  }
  window.history = {
    get state() { return entries[index].state; },
    replaceState(state, _, url) { entries[index] = { state: structuredClone(state), url }; setURL(url); },
    pushState(state, _, url) { entries.splice(index + 1); entries.push({ state: structuredClone(state), url }); index++; setURL(url); },
    back() { move(-1); }, forward() { move(1); }
  };
  const context = vm.createContext({ console, window, document: {
    getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); },
    createElement: element
  } });
  const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
  vm.runInContext(source.slice(0, source.lastIndexOf('init().catch')), context);
  const run = code => vm.runInContext(code, context);
  for (const name of ['lexicon', 'lexicon_expansions', 'roots_and_morphology', 'expanded_root_database', 'phrases_and_examples']) {
    context[name] = fs.readFileSync(path.join(__dirname, '../data', name + '.csv'), 'utf8');
  }
  run(`state.roots = rowsToObjects(parseCsv(roots_and_morphology));
    state.expandedRoots = rowsToObjects(parseCsv(expanded_root_database));
    state.phrases = rowsToObjects(parseCsv(phrases_and_examples));
    state.groupedEntries = buildGroupedEntries([
      ...rowsToObjects(parseCsv(lexicon)).filter(isWordEntry),
      ...rowsToObjects(parseCsv(lexicon_expansions)).filter(isWordEntry),
      ...buildRootEntries(state.expandedRoots), ...buildMorphologyEntries(state.roots)
    ]);
    state.familyIndex = buildFamilyIndex(state.groupedEntries, state.expandedRoots, state.roots);
    initEntryNavigation();`);
  return { run, window, elements, entries };
}
const { run, window, elements, entries } = harness();
assert.equal(elements.get('entryBack').disabled, true);
run(`jumpToHeadword('Serilin')`);
assert.equal(window.location.hash, '#word=serilin');
// The result-list path must record history too, preserving English search context.
run(`els.searchInput.value = 'sister'; setSearchMode('english'); state.activeWordType = 'Noun';
  els.wordTypeFilter.value = 'Noun'; applyFilters();`);
window.scrollY = 420;
run(`jumpToWordFamily('Ser')`);
assert.equal(run('state.selectedId'), 'ser');
window.history.back();
assert.equal(run('state.selectedId'), 'serilin');
assert.equal(elements.get('searchInput').value, 'sister');
assert.equal(run('state.searchMode'), 'english');
assert.equal(run('state.activeWordType'), 'Noun');
assert.equal(window.scrollY, 420);
assert.equal(elements.get('entryForward').disabled, false);
elements.get('entryForward').dispatch('click');
assert.equal(run('state.selectedId'), 'ser');
const before = entries.length;
run(`jumpToHeadword('Ser')`);
assert.equal(entries.length, before, 'Repeated selection does not add a step');
run(`jumpToWordFamily('unlisted-root')`);
assert.equal(window.location.hash, '#root=unlisted-root');
window.history.back();
assert.equal(run('state.selectedId'), 'ser');
window.history.back();
run(`jumpToHeadword('Thar')`);
assert.equal(elements.get('entryForward').disabled, true, 'New navigation drops old forward path');
window.history.back();
window.history.forward();
assert.equal(run('state.selectedId'), 'thar');
assert.equal(elements.get('entryForward').disabled, true, 'Older states cannot resurrect discarded forward steps');
window.history.back(); window.history.back();
assert.equal(run('state.selectedId'), null);
assert.equal(elements.get('entryBack').disabled, true);
const deep = harness('#word=serilin');
assert.equal(deep.run('state.selectedId'), 'serilin');
const invalid = harness('#word=not-a-record');
assert.match(invalid.elements.get('emptyState').textContent, /could not be found/);
const malformed = harness('#word=%E0%A4');
assert.equal(malformed.run('state.selectedId'), null);
console.log('PASS: word/root history, Back/Forward, search/filter/scroll restoration, duplicate selection, branching, deep links, and invalid links.');
