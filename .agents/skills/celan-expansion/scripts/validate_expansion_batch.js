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
  const expansions = readRows(projectRoot, "lexicon_expansions.csv");
  const phrases = readRows(projectRoot, "phrases_and_examples.csv");
  const sourceLexicon = readRows(projectRoot, "lexicon.csv");
  const selected = requestedBatch
    ? expansions.filter((entry) => entry.approval_batch === requestedBatch)
    : expansions;
  const errors = [];
  const warnings = [];
  const required = [
    "entry_id", "celan_term", "pronunciation", "english_meaning", "category",
    "derivation", "origin_nation", "national_usage", "canon_status",
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

  const duplicateExpansionTerms = duplicates(expansions.map((entry) => normalize(entry.celan_term)));
  duplicateExpansionTerms.forEach((term) => errors.push(`Duplicate expansion headword: ${term}`));

  const expansionTerms = new Map(expansions.map((entry) => [normalize(entry.celan_term), entry.entry_id]));
  for (const entry of selected) {
    for (const field of required) {
      if (!entry[field]) errors.push(`${entry.entry_id || "Unidentified row"}: missing ${field}`);
    }
    const sourceCollision = allHeadwords.get(normalize(entry.celan_term));
    if (sourceCollision) warnings.push(`${entry.entry_id}: headword also exists in source lexicon as ${sourceCollision}`);

    const variants = split(entry.variant_forms);
    const variantPronunciations = split(entry.variant_pronunciations);
    if (variants.length !== variantPronunciations.length) {
      errors.push(`${entry.entry_id}: ${variants.length} variants but ${variantPronunciations.length} variant pronunciations`);
    }
    for (const variant of variants) {
      const independent = expansionTerms.get(normalize(variant));
      if (independent && independent !== entry.entry_id) {
        errors.push(`${entry.entry_id}: variant ${variant} is also an expansion headword (${independent})`);
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

  console.log(`Validated ${selected.length} expansion row(s)${requestedBatch ? ` in ${requestedBatch}` : ""}.`);
  warnings.forEach((warning) => console.log(`WARNING: ${warning}`));
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  if (errors.length) {
    console.error(`Validation failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
    process.exit(1);
  }
  console.log(`Validation passed with ${warnings.length} warning(s).`);
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
