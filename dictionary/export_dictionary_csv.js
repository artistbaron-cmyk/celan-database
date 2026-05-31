const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const dictionaryDir = __dirname;
const outputPath = path.join(rootDir, "data", "dictionary_entries.csv");

function createElementStub() {
  return {
    innerHTML: "",
    textContent: "",
    value: "",
    onclick: null,
    appendChild() {},
    addEventListener() {},
    querySelectorAll() { return []; },
    classList: {
      add() {},
      remove() {}
    }
  };
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

async function loadDictionaryState() {
  const scriptPath = path.join(dictionaryDir, "script.js");
  const source = await fsp.readFile(scriptPath, "utf8");
  const exposedSource = `${source}
globalThis.__dictExports = {
  state,
  relatedExamples,
  headwordOverride,
  buildPronunciation,
  displayUsageNote,
  displayRootWordMarker,
  isRootUse,
  normalizeHeadword
};`;

  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, createElementStub());
      }
      return elements.get(id);
    },
    createElement() {
      return createElementStub();
    }
  };

  const context = {
    console,
    setTimeout,
    clearTimeout,
    window: { EMBEDDED_DATA: null },
    document,
    fetch: async (requestedPath) => {
      const resolved = path.resolve(dictionaryDir, requestedPath);
      const text = await fsp.readFile(resolved, "utf8");
      return {
        ok: true,
        async text() {
          return text;
        }
      };
    }
  };

  vm.createContext(context);
  vm.runInContext(exposedSource, context, { filename: scriptPath });

  const exports = context.__dictExports;
  for (let i = 0; i < 100; i += 1) {
    if (exports.state.groupedEntries.length) {
      return exports;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Dictionary state did not finish loading.");
}

async function main() {
  const {
    state,
    relatedExamples,
    headwordOverride,
    buildPronunciation,
    displayUsageNote,
    displayRootWordMarker,
    isRootUse,
    normalizeHeadword
  } = await loadDictionaryState();

  const rows = [];
  const grouped = [...state.groupedEntries].sort((a, b) => (a.term || "").localeCompare(b.term || ""));

  grouped.forEach((group) => {
    const family = state.familyIndex.get(group.id) || { familyRoots: [], relatedEntries: [] };
    const override = headwordOverride(group.term);
    const pronunciation = buildPronunciation(group.term);
    const familyRoots = family.familyRoots
      .filter((rootTerm) => normalizeHeadword(rootTerm.replace(/-+$/g, "")) !== normalizeHeadword(group.term.replace(/-+$/g, "")))
      .slice(0, 3);
    const relatedEntries = (override?.familyTerms?.length
      ? family.relatedEntries.filter((entry) => override.familyTerms.includes(entry.term))
      : family.relatedEntries
    ).slice(0, 10);
    const examples = override?.examples?.length ? override.examples : relatedExamples(group);
    const primaryUses = group.uses.some((use) => !isRootUse(use))
      ? group.uses.filter((use) => !isRootUse(use))
      : group.uses;

    primaryUses.forEach((use, index) => {
      const exampleRows = examples.slice(0, 5);
      const row = {
        headword: group.term,
        pronunciation,
        use_type: use.type || "",
        root_word: displayRootWordMarker(group, use) ? "Yes" : "",
        meaning: use.meaning || "",
        usage_note: displayUsageNote(use),
        family_roots: familyRoots.join("; "),
        related_words: relatedEntries.map((entry) => entry.term).join("; "),
        example_count: examples.length,
        source_entry_ids: group.entries.map((entry) => entry.entry_id).join("; "),
        use_index: index + 1
      };

      exampleRows.forEach((example, exampleIndex) => {
        row[`example_${exampleIndex + 1}_celan`] = example.celan_text || "";
        row[`example_${exampleIndex + 1}_translation`] = example.translation || "";
      });

      rows.push(row);
    });
  });

  const headers = [
    "source_entry_ids",
    "headword",
    "pronunciation",
    "use_type",
    "root_word",
    "meaning",
    "usage_note",
    "family_roots",
    "related_words",
    "example_count",
    "use_index",
    "example_1_celan",
    "example_1_translation",
    "example_2_celan",
    "example_2_translation",
    "example_3_celan",
    "example_3_translation",
    "example_4_celan",
    "example_4_translation",
    "example_5_celan",
    "example_5_translation"
  ];

  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header] || "")).join(","))
  ].join("\n");

  await fsp.writeFile(outputPath, csv, "utf8");
  console.log(`Wrote ${rows.length} dictionary rows to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
