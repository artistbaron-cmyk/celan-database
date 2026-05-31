const fsp = require("fs/promises");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const dictionaryDir = __dirname;
const outputPath = path.join(rootDir, "data", "dictionary_report.csv");

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
    if (exports.state.groupedEntries.length) return exports;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Dictionary state did not finish loading.");
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function dedupeRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = [
      row.headword.toLowerCase(),
      row.pronunciation.toLowerCase(),
      row.use_type.toLowerCase(),
      row.root_word.toLowerCase(),
      row.meaning.toLowerCase(),
      row.usage_note.toLowerCase()
    ].join("::");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  const {
    state,
    relatedExamples,
    headwordOverride,
    buildPronunciation,
    displayUsageNote,
    isRootUse,
    normalizeHeadword
  } = await loadDictionaryState();

  const rows = [];
  const grouped = [...state.groupedEntries].sort((a, b) => (a.term || "").localeCompare(b.term || ""));

  grouped.forEach((group) => {
    const family = state.familyIndex.get(group.id) || { familyRoots: [], relatedEntries: [] };
    const override = headwordOverride(group.term);
    const pronunciation = clean(buildPronunciation(group.term));
    const rootWords = family.familyRoots
      .filter((rootTerm) => normalizeHeadword(rootTerm.replace(/-+$/g, "")) !== normalizeHeadword(group.term.replace(/-+$/g, "")))
      .slice(0, 3)
      .join("; ");
    const relatedWords = (override?.familyTerms?.length
      ? family.relatedEntries.filter((entry) => override.familyTerms.includes(entry.term))
      : family.relatedEntries
    )
      .map((entry) => entry.term)
      .slice(0, 10)
      .join("; ");
    const examples = override?.examples?.length ? override.examples : relatedExamples(group);
    const primaryUses = group.uses.some((use) => !isRootUse(use))
      ? group.uses.filter((use) => !isRootUse(use))
      : group.uses;
    const example = examples[0] || {};

    primaryUses.forEach((use) => {
      rows.push({
        headword: clean(group.term),
        pronunciation,
        use_type: clean(use.type),
        root_word: clean(rootWords),
        meaning: clean(use.meaning),
        usage_note: clean(displayUsageNote(use)),
        related_words: clean(relatedWords),
        example_celan: clean(example.celan_text),
        example_translation: clean(example.translation),
        source_entry_ids: clean(group.entries.map((entry) => entry.entry_id).join("; "))
      });
    });
  });

  const finalRows = dedupeRows(rows);
  const headers = [
    "headword",
    "pronunciation",
    "use_type",
    "root_word",
    "meaning",
    "usage_note",
    "related_words",
    "example_celan",
    "example_translation",
    "source_entry_ids"
  ];

  const csv = [
    headers.join(","),
    ...finalRows.map((row) => headers.map((header) => csvEscape(row[header] || "")).join(","))
  ].join("\n");

  await fsp.writeFile(outputPath, csv, "utf8");
  console.log(`Wrote ${finalRows.length} report rows to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
