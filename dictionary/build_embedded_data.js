const fsp = require("fs/promises");
const path = require("path");

const appDataDir = path.join(__dirname, "app_data");
const outputPath = path.join(appDataDir, "embedded_data.js");
const dataFiles = [
  "dictionary_entries.csv",
  "dictionary_senses.csv",
  "dictionary_examples.csv",
  "dictionary_families.json",
  "grammar_guide.csv",
  "expressions_app.json",
  "phrase_builder.json"
];

async function main() {
  const embedded = {};
  for (const filename of dataFiles) {
    embedded[filename] = await fsp.readFile(path.join(appDataDir, filename), "utf8");
  }
  await fsp.writeFile(outputPath, `window.EMBEDDED_DATA = ${JSON.stringify(embedded)};\n`, "utf8");
  console.log(`Embedded ${dataFiles.length} data files in ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
