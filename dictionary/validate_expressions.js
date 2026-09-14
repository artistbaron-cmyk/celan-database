const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function readCsv(filename) {
  const rows = parseCsv(fs.readFileSync(path.join(rootDir, "data", filename), "utf8"));
  const headers = rows.shift();
  return rows.filter((row) => row.some(Boolean)).map((row) => Object.fromEntries(
    headers.map((header, index) => [header, (row[index] || "").trim()])
  ));
}

function key(value) {
  return String(value || "").trim().toLowerCase().replace(/[.!?]+$/g, "");
}

const expressionCategories = new Set([
  "Greetings",
  "Culturally Specific Greeting/Farewell",
  "Interjection / Exclamation",
  "Oath/Curse",
  "Nuanced Affirmation/Disagreement",
  "Basic Response",
  "Hesitation Sound",
  "Discourse Particle",
  "Slur"
]);

const expressions = readCsv("expressions.csv");
const lexicon = readCsv("lexicon.csv");
const phrases = readCsv("phrases_and_examples.csv");
const sourceExpressions = lexicon.filter((row) => expressionCategories.has(row.category));
const sourceIdioms = phrases.filter((row) => row.example_type === "Idiom/Proverb");
const slurs = sourceExpressions.filter((row) => row.category === "Slur");
const assembledKeys = new Set([
  ...sourceExpressions.map((row) => key(row.celan_term)),
  ...sourceIdioms.map((row) => key(row.celan_text)),
  ...expressions.map((row) => key(row.celan_expression))
]);

const errors = [];
if (expressions.length !== 38) errors.push(`Expected 38 approved Living Celan records; found ${expressions.length}.`);
if (expressions.some((row) => !row.expression_id || !row.celan_expression || !row.pronunciation || !row.natural_meaning)) {
  errors.push("Every approved expression needs an ID, Celan form, pronunciation, and conventional meaning.");
}
if (expressions.some((row) => row.canon_status !== "Canon" || row.review_status !== "Approved")) {
  errors.push("Every Living Celan expression row must be marked Canon and Approved.");
}
if (slurs.length !== 8) errors.push(`Expected 8 inherited slurs; found ${slurs.length}.`);
if (slurs.some((row) => row.review_status !== "Source Ambiguity")) {
  errors.push("Every inherited national slur must retain Source Ambiguity status.");
}

const buildSource = fs.readFileSync(path.join(__dirname, "build_embedded_data.js"), "utf8");
const appSource = fs.readFileSync(path.join(__dirname, "script.js"), "utf8");
if (!buildSource.includes('"expressions.csv"') || !appSource.includes('loadCsv("../data/expressions.csv")')) {
  errors.push("The Expressions data file is not connected to both the embedded build and app loader.");
}
if (buildSource.includes("phrasebank") || appSource.includes("phrasebank")) {
  errors.push("The Phrase Builder phrasebank must not feed the Expressions index.");
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log(`Approved Living Celan expressions: ${expressions.length}`);
console.log(`Established expressive lexicon records: ${sourceExpressions.length}`);
console.log(`Established source idioms/proverbs: ${sourceIdioms.length}`);
console.log(`Inherited slurs cross-listed: ${slurs.length}`);
console.log(`Assembled unique expressions: ${assembledKeys.size}`);
console.log("Phrasebank feed: excluded");
