const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const names = [
  'lexicon', 'lexicon_expansions', 'roots_and_morphology',
  'expanded_root_database', 'ohnosha_creatures', 'phrases_and_examples',
  'grammar_rules', 'expressions'
];
const stub = () => ({
  value: '', children: [],
  classList: { add() {}, remove() {}, toggle() {} },
  append() {}, appendChild() {}, addEventListener() {}, querySelectorAll() { return []; }
});
const context = vm.createContext({
  console,
  document: { getElementById: stub, createElement: stub },
  window: {}
});
const source = fs.readFileSync(path.join(root, 'dictionary/script.js'), 'utf8');
vm.runInContext(source.slice(0, source.lastIndexOf('init().catch')), context);
context.datasets = Object.fromEntries(names.map(name => [
  name, fs.readFileSync(path.join(root, 'data', `${name}.csv`), 'utf8')
]));
const result = vm.runInContext(`(() => {
  const data = Object.fromEntries(Object.entries(datasets).map(([key, value]) => [
    key, rowsToObjects(parseCsv(value))
  ]));
  state.phrases = data.phrases_and_examples;
  state.roots = data.roots_and_morphology;
  state.expandedRoots = data.expanded_root_database;
  state.groupedEntries = buildGroupedEntries([
    ...data.lexicon.filter(isWordEntry),
    ...data.lexicon_expansions.filter(isWordEntry),
    ...buildRootEntries(data.expanded_root_database),
    ...buildMorphologyEntries(data.roots_and_morphology),
    ...buildSupplementalDictionaryEntries(),
    ...buildCreatureEntries(data.ohnosha_creatures)
  ]);
  state.familyIndex = buildFamilyIndex(state.groupedEntries, state.expandedRoots, state.roots);
  state.grammarRules = buildRuleEntries(data.grammar_rules);
  const entries = state.groupedEntries.map(group => {
    const sections = entryExampleSections(group);
    const family = state.familyIndex.get(group.id) || {};
    return {
      headword: group.term,
      id: group.id,
      pronunciation: buildPronunciation(group.term, group.entries),
      senses: displayUses(group).map(use => ({ type: use.type, meaning: use.meaning, usage: displayUsageNote(use) })),
      source_ids: group.entries.map(entry => entry.entry_id),
      derivations: [...new Set(group.entries.map(entry => displayDerivation(entry.derivation)).filter(Boolean))],
      variants: [...new Set(group.entries.flatMap(entry => splitIds(entry.variant_forms)))],
      family_roots: family.familyRoots || [],
      related_words: (family.relatedEntries || []).map(entry => entry.term),
      direct: sections.direct.map(example => example.entry_id),
      related: sections.related.map(example => example.entry_id),
      teaching: sections.teaching.map(example => example.entry_id)
    };
  });
  return {
    entries,
    grammar: state.grammarRules.map(rule => ({
      id: rule.id, name: rule.rule_name, wording: rule.original_wording,
      examples: rule.examples
    }))
  };
})()`, context);
const output = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, 'app_inventory.json');
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Captured ${result.entries.length} app headwords and ${result.grammar.length} grammar cards`);
