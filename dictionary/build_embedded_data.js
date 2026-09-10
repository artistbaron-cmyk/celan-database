const fsp = require("fs/promises");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(__dirname, "embedded_data.js");
const dataFiles = [
  "lexicon.csv",
  "lexicon_expansions.csv",
  "roots_and_morphology.csv",
  "phrases_and_examples.csv",
  "expanded_root_database.csv",
  "grammar_rules.csv",
  "ohnosha_creatures.csv"
];

async function main() {
  const embedded = {};
  for (const filename of dataFiles) {
    embedded[filename] = await fsp.readFile(path.join(rootDir, "data", filename), "utf8");
  }
  await fsp.writeFile(outputPath, `window.EMBEDDED_DATA = ${JSON.stringify(embedded)};\n`, "utf8");
  console.log(`Embedded ${dataFiles.length} data files in ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
