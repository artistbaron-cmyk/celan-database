#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function findProjectRoot(start) {
  let current = path.resolve(start);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, "data", "lexicon_expansions.csv"))) return current;
    current = path.dirname(current);
  }
  throw new Error("Run this script from inside the Celan project.");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell.length || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  const [headers, ...body] = rows;
  return body.filter((values) => values.some((value) => value.trim())).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), String(values[index] || "").trim()]))
  );
}

function split(value) {
  return String(value || "").split(";").map((item) => item.trim()).filter(Boolean);
}

function normalize(value) {
  return String(value || "").toLocaleLowerCase().replace(/[\s'’-]+/g, "");
}

function duplicates(values) {
  const seen = new Set();
  return [...new Set(values.filter((value) => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  }))];
}

function readRows(projectRoot, filename) {
  return parseCsv(fs.readFileSync(path.join(projectRoot, "data", filename), "utf8"));
}

function main() {
  const projectRoot = findProjectRoot(__dirname);
  const requestedBatch = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const checkAssembled = process.argv.includes("--assembled");
  const expansions = readRows(projectRoot, "lexicon_expansions.csv");
  const phrases = readRows(projectRoot, "phrases_and_examples.csv");
  const sourceLexicon = readRows(projectRoot, "lexicon.csv");
  const expandedRoots = readRows(projectRoot, "expanded_root_database.csv");
  const selected = requestedBatch
    ? expansions.filter((entry) => entry.approval_batch === requestedBatch)
    : expansions;
  const errors = [];
  const warnings = [];
  const rootSenseDisplayExceptions = new Set(["shan", "sel", "thael"]);
  const required = [
    "entry_id", "celan_term", "pronunciation", "english_meaning", "category",
    "derivation", "canon_status",
    "approval_batch", "related_entry_ids"
  ];
  const phraseById = new Map(phrases.map((entry) => [entry.entry_id, entry]));
  const allHeadwords = new Map();
  sourceLexicon.forEach((entry) => allHeadwords.set(normalize(entry.celan_term), entry.entry_id));

  if (requestedBatch && !selected.length) errors.push(`No expansion rows found for approval batch: ${requestedBatch}`);

  const duplicateEntryIds = duplicates([
    ...sourceLexicon.map((entry) => entry.entry_id),
    ...expansions.map((entry) => entry.entry_id)
  ]);
  duplicateEntryIds.forEach((id) => errors.push(`Duplicate lexicon entry ID: ${id}`));

  const expansionTermGroups = new Map();
  expansions.forEach((entry) => {
    const term = normalize(entry.celan_term);
    if (!expansionTermGroups.has(term)) expansionTermGroups.set(term, []);
    expansionTermGroups.get(term).push(entry);
  });
  expansionTermGroups.forEach((entries, term) => {
    if (entries.length < 2) return;
    const baseRows = entries.filter((entry) => !/\bapproved additive displayed sense\b/i.test(entry.notes || ""));
    const additiveRows = entries.filter((entry) => /\bapproved additive displayed sense\b/i.test(entry.notes || ""));
    const duplicateBatches = duplicates(entries.map((entry) => entry.approval_batch));
    if (baseRows.length !== 1 || additiveRows.length !== entries.length - 1 || duplicateBatches.length) {
      errors.push(`Duplicate expansion headword without an explicit additive-sense record: ${term}`);
    }
  });

  const expansionTerms = new Map();
  expansions.forEach((entry) => {
    const term = normalize(entry.celan_term);
    if (!expansionTerms.has(term)) expansionTerms.set(term, new Set());
    expansionTerms.get(term).add(entry.entry_id);
  });
  for (const entry of selected) {
    for (const field of required) {
      if (!entry[field]) errors.push(`${entry.entry_id || "Unidentified row"}: missing ${field}`);
    }
    if (!!entry.origin_nation !== !!entry.national_usage) {
      errors.push(`${entry.entry_id}: origin_nation and national_usage must either both be filled or both be blank`);
    }
    const sourceCollision = allHeadwords.get(normalize(entry.celan_term));
    const isApprovedAdditiveSense = /\bapproved additive displayed sense\b/i.test(entry.notes || "");
    if (sourceCollision && !isApprovedAdditiveSense) {
      warnings.push(`${entry.entry_id}: headword also exists in source lexicon as ${sourceCollision}`);
    }

    const variants = split(entry.variant_forms);
    const variantPronunciations = split(entry.variant_pronunciations);
    if (variants.length !== variantPronunciations.length) {
      errors.push(`${entry.entry_id}: ${variants.length} variants but ${variantPronunciations.length} variant pronunciations`);
    }
    for (const variant of variants) {
      const independent = expansionTerms.get(normalize(variant));
      const conflictingIds = independent ? [...independent].filter((id) => id !== entry.entry_id) : [];
      if (conflictingIds.length) {
        errors.push(`${entry.entry_id}: variant ${variant} is also an expansion headword (${conflictingIds.join(", ")})`);
      }
    }
    if (/\+\s*wek\b/i.test(entry.derivation)) {
      [...variants, entry.celan_term].forEach((form) => {
        if (/awek$/i.test(form)) errors.push(`${entry.entry_id}: ${form} uses disallowed -awek euphony for Wek`);
      });
    }

    const exampleIds = split(entry.related_entry_ids);
    if (exampleIds.length < 2) errors.push(`${entry.entry_id}: fewer than two linked examples`);
    for (const exampleId of exampleIds) {
      const example = phraseById.get(exampleId);
      if (!example) {
        errors.push(`${entry.entry_id}: missing linked example ${exampleId}`);
      } else if (!split(example.related_entry_ids).includes(entry.entry_id)) {
        errors.push(`${entry.entry_id}: example ${exampleId} does not link back to the headword`);
      }
    }
  }

  if (checkAssembled) {
    const displayedEntries = readRows(projectRoot, "dictionary_entries.csv");
    const displayedByHeadword = new Map();
    displayedEntries.forEach((entry) => {
      const key = normalize(entry.headword);
      if (!displayedByHeadword.has(key)) displayedByHeadword.set(key, new Set());
      displayedByHeadword.get(key).add(String(entry.meaning || "").trim().toLocaleLowerCase());
    });
    const rootsByHeadword = new Map(expandedRoots
      .filter((entry) => String(entry.entry_type || "").toLocaleLowerCase() === "root")
      .map((entry) => [normalize(entry.form), entry]));

    for (const entry of selected) {
      const key = normalize(entry.celan_term);
      const displayedMeanings = displayedByHeadword.get(key) || new Set();
      const expectedMeanings = [entry.english_meaning];
      const establishedRoot = rootsByHeadword.get(key);
      if (rootSenseDisplayExceptions.has(key) && establishedRoot?.core_meaning) {
        expectedMeanings.push(establishedRoot.core_meaning);
      }
      for (const meaning of expectedMeanings) {
        if (!displayedMeanings.has(String(meaning).trim().toLocaleLowerCase())) {
          errors.push(`${entry.entry_id}: assembled dictionary is missing the approved sense “${meaning}”`);
        }
      }
    }
  }

  console.log(`Validated ${selected.length} expansion row(s)${requestedBatch ? ` in ${requestedBatch}` : ""}.`);
  warnings.forEach((warning) => console.log(`WARNING: ${warning}`));
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  if (errors.length) {
    console.error(`Validation failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
    process.exit(1);
  }
  console.log(`Validation passed with ${warnings.length} warning(s).${checkAssembled ? " Assembled senses are preserved." : ""}`);
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
