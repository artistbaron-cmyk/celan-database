const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const appDir = __dirname;
const output = process.argv[2];
if (!output) throw new Error('Pass an output JSON path.');
const elements = new Map();
function element() {
  return {
    innerHTML: '', textContent: '', value: '', children: [], dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    append() {}, appendChild() {}, addEventListener() {}, querySelectorAll() { return []; },
    scrollIntoView() {}
  };
}
const document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, element());
    return elements.get(id);
  },
  createElement: element,
  querySelector() { return element(); }
};
const window = { location: null, EMBEDDED_DATA: null, addEventListener() {}, matchMedia() { return { matches: false }; }, requestAnimationFrame(fn) { fn(); } };
const context = vm.createContext({ console, window, document, setTimeout, clearTimeout });
const html = fs.readFileSync(path.join(appDir, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
for (const script of scripts) {
  const filename = path.resolve(appDir, script);
  vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
}
vm.runInContext('globalThis.__audit = { state, renderDetail, renderRuleDetail, renderExpressionDetail, displayUses, buildPronunciation, entryExampleSections, expansionMetadata, headwordOverride, buildRootLookup, RULE_LESSONS, RULE_COMPANIONS, CULTURAL_LENSES, RETRIEVAL_PACKS };', context);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
(async () => {
  const api = context.__audit;
  for (let i = 0; i < 200 && !api.state.groupedEntries.length; i += 1) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  if (!api.state.groupedEntries.length) throw new Error('App did not load.');
  const dictionary = [];
  for (const group of api.state.groupedEntries) {
    api.renderDetail(group);
    dictionary.push({ id: group.id, hash: hash(elements.get('detailView').innerHTML) });
  }
  const grammar = [];
  for (const rule of api.state.grammarRules) {
    api.renderRuleDetail(rule);
    grammar.push({ id: rule.id, hash: hash(elements.get('ruleDetailView').innerHTML) });
  }
  const expressions = [];
  for (const entry of api.state.expressions) {
    api.renderExpressionDetail(entry);
    expressions.push({ id: entry.expression_id, hash: hash(elements.get('expressionDetailView').innerHTML) });
  }
  const result = {
    headwords: dictionary.length,
    senses: api.state.groupedEntries.reduce((total, group) => total + api.displayUses(group).length, 0),
    grammarRules: grammar.length,
    expressionsCount: expressions.length,
    dictionary, grammar, expressions
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
  console.log(`Captured ${result.headwords} headwords, ${result.senses} senses, ${result.grammarRules} grammar records, and ${result.expressionsCount} expressions.`);
})().catch(error => { console.error(error); process.exit(1); });
