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
    appendChild() {},
    addEventListener() {},
    querySelectorAll() { return []; },
    classList: { add() {}, remove() {} }
  };
}

async function loadAppState(projectRoot) {
  const dictionaryDir = path.join(projectRoot, "dictionary");
  const scriptPath = path.join(dictionaryDir, "script.js");
  const source = await fsp.readFile(scriptPath, "utf8");
  const exposed = `${source}\nglobalThis.__celanAudit = { state, buildPronunciation, isRootUse };`;
  const elements = new Map();
  const document = {
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
  const { state, buildPronunciation, isRootUse } = await loadAppState(projectRoot);
  const expansionEntries = state.wordEntries.filter((entry) =>
    String(entry.entry_id || "").startsWith("LX-NE") || entry.approval_batch
  );
  const expansionGroups = state.groupedEntries.filter((group) =>
    group.entries.some((entry) => expansionEntries.includes(entry))
  );
  const missingPronunciation = expansionGroups
    .filter((group) => !String(buildPronunciation(group.term, group.entries) || "").trim())
    .map((group) => group.term);
  const nations = {};
  const batches = {};
  for (const entry of expansionEntries) {
    const nation = String(entry.origin_nation || "Unspecified").trim() || "Unspecified";
    nations[nation] = (nations[nation] || 0) + 1;
    const batch = String(entry.approval_batch || "Unspecified").trim() || "Unspecified";
    batches[batch] = (batches[batch] || 0) + 1;
  }
  const variants = unique(expansionEntries.flatMap((entry) =>
    String(entry.variant_forms || "").split(";").map((value) => value.trim())
  ));
  const displayedSenseRows = state.groupedEntries.reduce((total, group) => {
    const uses = group.uses.some((use) => !isRootUse(use))
      ? group.uses.filter((use) => !isRootUse(use))
      : group.uses;
    return total + uses.length;
  }, 0);
  const report = {
    appHeadwords: state.groupedEntries.length,
    displayedSenseRows,
    assembledEntryRecords: state.wordEntries.length,
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
  console.log(`Underlying records assembled by the app: ${report.assembledEntryRecords}`);
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
