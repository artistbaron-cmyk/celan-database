#!/usr/bin/env node

const fsp = require("fs/promises");
const path = require("path");
const vm = require("vm");

function findProjectRoot(start) {
  let current = path.resolve(start);
  while (current !== path.dirname(current)) {
    try {
      require.resolve(path.join(current, "dictionary", "script.js"));
      return current;
    } catch (_) {
      current = path.dirname(current);
    }
  }
  throw new Error("Run this script from inside the Celan project.");
}

function elementStub() {
  return {
    innerHTML: "",
    textContent: "",
    value: "",
    onclick: null,
    dataset: {},
    appendChild() {},
    addEventListener() {},
    setAttribute() {},
    getAttribute() { return ""; },
    querySelectorAll() { return []; },
    classList: { add() {}, remove() {} }
  };
}

async function loadAppState(projectRoot) {
  const dictionaryDir = path.join(projectRoot, "dictionary");
  const scriptPath = path.join(dictionaryDir, "script.js");
  const source = await fsp.readFile(scriptPath, "utf8");
  const exposed = `${source}\nglobalThis.__celanAudit = { state, displayUses, parseCsv, rowsToObjects };`;
  const elements = new Map();
  const document = {
    documentElement: { dataset: {} },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, elementStub());
      return elements.get(id);
    },
    createElement() { return elementStub(); }
  };
  const context = {
    console,
    setTimeout,
    clearTimeout,
    window: { EMBEDDED_DATA: null },
    document,
    fetch: async (requestedPath) => {
      const text = await fsp.readFile(path.resolve(dictionaryDir, requestedPath), "utf8");
      return { ok: true, async text() { return text; } };
    }
  };

  vm.createContext(context);
  vm.runInContext(exposed, context, { filename: scriptPath });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (context.__celanAudit.state.groupedEntries.length) return context.__celanAudit;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("The dictionary app did not finish assembling its data.");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function main() {
  const projectRoot = findProjectRoot(__dirname);
  const { state, displayUses, parseCsv, rowsToObjects } = await loadAppState(projectRoot);
  const appCsv = await fsp.readFile(path.join(projectRoot, "dictionary/app_data/dictionary_entries.csv"), "utf8");
  const appEntries = rowsToObjects(parseCsv(appCsv));
  const expansionEntries = appEntries.filter((entry) =>
    String(entry.source_entry_ids || "").includes("LX-NE") || entry.approval_batch
  );
  const expansionIds = new Set(expansionEntries.map((entry) => entry.id));
  const expansionGroups = state.groupedEntries.filter((group) => expansionIds.has(group.id));
  const missingPronunciation = expansionEntries
    .filter((entry) => !String(entry.pronunciation || "").trim())
    .map((entry) => entry.headword);
  const nations = {};
  const batches = {};
  for (const entry of expansionEntries) {
    const metadata = JSON.parse(entry.metadata_json || "null") || {};
    const nation = (metadata.origins || []).join("; ") || "Universal / no national origin";
    nations[nation] = (nations[nation] || 0) + 1;
    const batch = String(entry.approval_batch || "Unspecified").trim() || "Unspecified";
    batches[batch] = (batches[batch] || 0) + 1;
  }
  const variants = unique(appEntries.flatMap((entry) =>
    ((JSON.parse(entry.metadata_json || "null") || {}).variants || []).map((variant) => variant.form)
  ));
  const displayedSenseRows = state.groupedEntries.reduce((total, group) => {
    return total + displayUses(group).length;
  }, 0);
  const report = {
    appHeadwords: state.groupedEntries.length,
    displayedSenseRows,
    assembledEntryRecords: appEntries.length,
    expansionRows: expansionEntries.length,
    expansionHeadwords: expansionGroups.length,
    euphonicOrAliasVariants: variants.length,
    missingExpansionPronunciation: missingPronunciation,
    expansionRowsByBatch: batches,
    expansionRowsByOriginNation: nations
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(`Celan app headwords: ${report.appHeadwords}`);
  console.log(`Displayed dictionary senses: ${report.displayedSenseRows}`);
  console.log(`Dictionary headword rows: ${report.assembledEntryRecords}`);
  console.log(`Approved expansion rows: ${report.expansionRows}`);
  console.log(`Expansion headwords in app: ${report.expansionHeadwords}`);
  console.log(`Stored euphonic/alias variants: ${report.euphonicOrAliasVariants} (not separate headwords)`);
  console.log(`Missing expansion pronunciations: ${missingPronunciation.length}`);
  console.log("Expansion rows by batch:");
  Object.entries(batches).sort().forEach(([name, count]) => console.log(`  ${name}: ${count}`));
  console.log("Expansion rows by origin nation:");
  Object.entries(nations).sort().forEach(([name, count]) => console.log(`  ${name}: ${count}`));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
