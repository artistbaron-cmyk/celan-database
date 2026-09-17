import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const baseDir = new URL("./", import.meta.url).pathname;
const projectDir = new URL("../../", import.meta.url).pathname;
const sourcePath = `${baseDir}celan_learning_sentence_assets.xlsx`;

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
  const headers = rows.shift().map((value) => value.trim());
  return rows
    .filter((values) => values.some((value) => value.trim()))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
}

const norm = (value) => String(value || "")
  .normalize("NFKD")
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/[^\p{L}\p{N}'-]+/gu, " ")
  .trim()
  .toLowerCase();

const wordCount = (value) => norm(value).split(/\s+/).filter(Boolean).length;

const manualUnits = {
  U04: [
    "PE-V1-0027", "PE-SRD1-0001", "PE-SRD1-0003", "PE-SRD1-0008", "PE-SRD1-0012",
    "PE-SRD1-0017", "PE-SRD1-0020", "PE-UHEI1-0014", "PE-V3-0018", "PE-V3-0019",
    "PE-V4-0076", "PE-SRD1-0010", "PE-UHEI1-0003", "PE-UHEI1-0013", "PE-V1-0023",
    "PE-V1-0024", "PE-V3-0008", "PE-V4-0045", "PE-UHEI1-0004", "PE-UHEI1-0031",
  ],
  U05: [
    "PE-V1-0017", "PE-V1-0018", "PE-V1-0019", "PE-V1-0020", "PE-V1-0021",
    "PE-V1-0022", "PE-V2-0001", "PE-V2-0002", "PE-V2-0003", "PE-V2-0004",
    "PE-V2-0005", "PE-V2-0006", "PE-V2-0007", "PE-V2-0109", "PE-V2-0110",
    "PE-V2-0111", "PE-V2-0112", "PE-V3-0108", "PE-V3-0109", "PE-V4-0062",
  ],
  U06: [
    "PE-FAP1-0053", "PE-FAP1-0055", "PE-FAP1-0057", "PE-FAP1-0058", "PE-FAP1-0059",
    "PE-FAP1-0060", "PE-FAP2-0003", "PE-FAP2-0004", "PE-FAP2-0005", "PE-FAP2-0009",
    "PE-FAP2-0013", "PE-FAP2-0015", "PE-FAP2-0017", "PE-FAP2-0019", "PE-FAP2-0021",
    "PE-FAP2-0023", "PE-FAP2-0029", "PE-FAP2-0031", "PE-FAP2-0033", "PE-FAP2-0035",
  ],
  U08: [
    "PE-TVO1-0011", "PE-TVO1-0013", "PE-TVO1-0015", "PE-TVO1-0017", "PE-TVO1-0018",
    "PE-TVO1-0024", "PE-TVO1-0028", "PE-TVO1-0029", "PE-TVO1-0033", "PE-TVO1-0041",
    "PE-EGE1-0001", "PE-EGE1-0002", "PE-EGE1-0003", "PE-EGE1-0004", "PE-EGE1-0005",
    "PE-EGE1-0007", "PE-EGE1-0008", "PE-EGE1-0012", "PE-EGE1-0013", "PE-EGE1-0023",
  ],
  U10: [
    "PE-HTS1-0001", "PE-HTS1-0002", "PE-HTS1-0004", "PE-HTS1-0005", "PE-HTS1-0006",
    "PE-HTS1-0007", "PE-HTS1-0008", "PE-HTS1-0009", "PE-HTS1-0010", "PE-HTS1-0011",
    "PE-HTS1-0012", "PE-HTS1-0013", "PE-HTS1-0014", "PE-HTS1-0015", "PE-UHEI1-0010",
    "PE-UHEI1-0012", "PE-UHEI1-0015", "PE-UHEI1-0016", "PE-UHEI1-0017", "PE-UHEI1-0045",
  ],
  U15: [
    "PE-V3-0022", "PE-V3-0023", "PE-V3-0024", "PE-V3-0025", "PE-V3-0026",
    "PE-V3-0027", "PE-V3-0028", "PE-V3-0029", "PE-V4-0005", "PE-V4-0006",
    "PE-V4-0007", "PE-V3-0111", "PE-V4-0012", "PE-V4-0013", "PE-V4-0014",
    "PE-V4-0015", "PE-V3-0011", "PE-V3-0013", "PE-V3-0014", "PE-V3-0017",
  ],
};

const unitConfigs = [
  { id: "U01", title: "Action First", stage: 1, theme: "Simple action-first sentences", match: (r) => r.source_volume === "Conversational Narrative Engine 1" && r.source_section.startsWith("Common Celan") },
  { id: "U02", title: "People and Relationships", stage: 1, theme: "People, relationships, and basic pronouns", match: (r) => ["Kinship example", "Relationship example", "Emotion verb example"].includes(r.example_type), groups: [
    { count: 8, match: (r) => r.example_type === "Relationship example" },
    { count: 8, match: (r) => r.example_type === "Kinship example" },
    { count: 4, match: (r) => r.example_type === "Emotion verb example" },
  ] },
  { id: "U03", title: "Home and Objects", stage: 1, theme: "Everyday spaces, objects, and sensory language", match: (r) => r.source_volume === "Domestic and Sensory Life 1" || r.example_type === "Mundane Objects & Tools example", groups: [
    { count: 16, match: (r) => r.source_volume === "Domestic and Sensory Life 1" },
    { count: 4, match: (r) => r.example_type === "Mundane Objects & Tools example" },
  ] },
  { id: "U04", title: "Questions Commands and Negation", stage: 2, theme: "Ask, direct, and negate", manual: true },
  { id: "U05", title: "Time and Aspect", stage: 2, theme: "Present, past, future, aspect, and time settings", manual: true },
  { id: "U06", title: "Food and Daily Needs", stage: 2, theme: "Food, meals, water, and practical needs", manual: true },
  { id: "U07", title: "Place and Direction", stage: 3, theme: "Location, direction, buildings, and spatial reference", match: (r) => ["Spatial Reference and Deixis 1", "Built Spaces and Public Infrastructure 1"].includes(r.source_volume), groups: [
    { count: 8, match: (r) => r.source_volume === "Spatial Reference and Deixis 1" },
    { count: 12, match: (r) => r.source_volume === "Built Spaces and Public Infrastructure 1" },
  ] },
  { id: "U08", title: "Travel and Environment", stage: 3, theme: "Movement, transport, weather, and the environment", manual: true },
  { id: "U09", title: "Body and Senses", stage: 3, theme: "The body, ordinary functions, and sensory experience", match: (r) => r.source_volume === "Body, Internal Anatomy, and Ordinary Bodily Functions 1" || (r.source_volume === "Domestic and Sensory Life 1" && /taste|chew|smell|touch|hungry|thirst|swallow|shiver|drip/i.test(r.translation)), groups: [
    { count: 10, match: (r) => r.source_volume === "Body, Internal Anatomy, and Ordinary Bodily Functions 1" },
    { count: 10, match: (r) => r.source_volume === "Domestic and Sensory Life 1" && /taste|chew|smell|touch|hungry|thirst|swallow|shiver|drip/i.test(r.translation) },
  ] },
  { id: "U10", title: "Health Help and Safety", stage: 3, theme: "Symptoms, treatment, help, and safety", manual: true },
  { id: "U11", title: "Work Tools and Trade", stage: 4, theme: "Work, tools, machines, exchange, and responsibilities", match: (r) => ["Tools and Machines 1", "Work Roles and Trade 1"].includes(r.source_volume), groups: [
    { count: 12, match: (r) => r.source_volume === "Tools and Machines 1" },
    { count: 8, match: (r) => r.source_volume === "Work Roles and Trade 1" },
  ] },
  { id: "U12", title: "Community and Civic Life", stage: 4, theme: "Public life, institutions, services, and shared spaces", match: (r) => r.source_volume === "Government and Civic Institutions 1" || (r.source_volume === "Built Spaces and Public Infrastructure 1" && /public|city|road|bridge|market|school|library|clinic|station|hall/i.test(r.translation)), groups: [
    { count: 14, match: (r) => r.source_volume === "Government and Civic Institutions 1" },
    { count: 6, match: (r) => r.source_volume === "Built Spaces and Public Infrastructure 1" && /public|city|road|bridge|market|school|library|clinic|station|hall/i.test(r.translation) },
  ] },
  { id: "U13", title: "Information and Science", stage: 4, theme: "Information, computation, systems, science, and observation", match: (r) => ["Information, Computation, Automation, and Electrical Systems 1", "Science, Astronomy, and Cosmology 1"].includes(r.source_volume), groups: [
    { count: 10, match: (r) => r.source_volume === "Information, Computation, Automation, and Electrical Systems 1" },
    { count: 10, match: (r) => r.source_volume === "Science, Astronomy, and Cosmology 1" },
  ] },
  { id: "U14", title: "Emotion and Conversation", stage: 4, theme: "Understanding, emotion, humor, performance, and conversation", match: (r) => ["Understanding, Helping, and Emotional Interiority 1", "Humor, Laughter, and Playful Speech 1", "Performance, Story Arts, and Celebration 1"].includes(r.source_volume), groups: [
    { count: 10, match: (r) => r.source_volume === "Understanding, Helping, and Emotional Interiority 1" },
    { count: 5, match: (r) => r.source_volume === "Humor, Laughter, and Playful Speech 1" },
    { count: 5, match: (r) => r.source_volume === "Performance, Story Arts, and Celebration 1" },
  ] },
  { id: "U15", title: "Complex and Flexible Sentences", stage: 5, theme: "Conditions, clauses, comparisons, modality, and advanced pronouns", manual: true },
  { id: "U16", title: "Regional and Figurative Speech", stage: 5, theme: "National voice, dialogue choices, idioms, and figurative meaning", match: (r) => ["National sample phrase", "National ceremonial example", "Comparative dialogue line", "Idiom/Proverb"].includes(r.example_type), groups: [
    { count: 8, match: (r) => r.example_type === "National sample phrase" },
    { count: 4, match: (r) => r.example_type === "Comparative dialogue line" },
    { count: 4, match: (r) => r.example_type === "Idiom/Proverb" },
    { count: 4, match: (r) => r.example_type === "National ceremonial example" },
  ] },
];

const excludedTerms = /\b(sex|orgasm|urinate|defecate|menstruat|genital|weapon|kill|enemy|slur)\b/i;

const unitRuleMap = {
  U01: ["GR-V1-0004"],
  U02: ["GR-V1-0006"],
  U03: ["GR-V1-0004", "GR-V1-0019"],
  U04: ["GR-V1-0005", "GR-V1-0015", "GR-V1-0016"],
  U05: ["GR-V1-0014"],
  U06: ["GR-V1-0004"],
  U07: ["GR-V1-0018", "GR-V1-0019"],
  U08: ["GR-V1-0004", "GR-V1-0019"],
  U09: ["GR-V1-0004", "GR-V1-0006"],
  U10: ["GR-V1-0004", "GR-V1-0005"],
  U11: ["GR-V1-0004"],
  U12: ["GR-V1-0004"],
  U13: ["GR-V1-0004"],
  U14: ["GR-V1-0004", "GR-V1-0015"],
  U15: ["GR-V1-0017", "GR-V3-0002", "GR-V3-0003", "GR-V3-0004", "GR-V3-0005", "GR-V4-0003", "GR-V4-0005"],
  U16: ["GR-V3-0001", "GR-S4A-0001"],
};

const objectiveDefinitions = {
  U01: [
    ["Recognize core actions", "Match common Celan action words to their approved meanings.", "Build Words"],
    ["Read a short action sentence", "Understand who acts and what the action affects in a short sentence.", "Both"],
    ["Arrange action-first order", "Put the action before the actor and the remaining information.", "Fix Sentences"],
    ["Produce a short action sentence", "Write a familiar action-first sentence without seeing the finished form.", "Fix Sentences"],
  ],
  U02: [
    ["Recognize people and relationship words", "Match common people and relationship terms to their approved meanings.", "Build Words"],
    ["Identify people in a sentence", "Understand who is acting and which person or relationship is described.", "Both"],
    ["Arrange sentences about people", "Keep action-first order when a sentence contains relationship vocabulary.", "Fix Sentences"],
    ["Describe a person or relationship", "Produce a familiar sentence about family, friendship, or emotion.", "Both"],
  ],
  U03: [
    ["Recognize household vocabulary", "Match common household objects and materials to their approved meanings.", "Build Words"],
    ["Connect objects with actions", "Understand what is being used, moved, opened, closed, or placed.", "Both"],
    ["Build home and location sentences", "Arrange action, actor, object, and location in the approved order.", "Fix Sentences"],
    ["Describe an everyday home action", "Produce a familiar sentence about an object or domestic task.", "Both"],
  ],
  U04: [
    ["Recognize Ra Va and Ver", "Identify the approved question, command, and negation signposts.", "Build Words"],
    ["Distinguish sentence purpose", "Tell whether a sentence asks, commands, states, or negates.", "Both"],
    ["Place the signpost correctly", "Repair a question, command, or negative sentence by placing its signpost correctly.", "Fix Sentences"],
    ["Ask command or negate", "Produce an appropriate question, command, or negative response from a prompt.", "Fix Sentences"],
  ],
  U05: [
    ["Recognize time and aspect forms", "Identify approved tense, aspect, time-of-day, and season forms.", "Build Words"],
    ["Understand when an action happens", "Distinguish present, past, future, continuing, completed, and habitual action.", "Both"],
    ["Repair time and aspect", "Restore the approved marker or time setting without changing the rest of the sentence.", "Fix Sentences"],
    ["Place an action in time", "Produce a familiar sentence with the requested time or aspect meaning.", "Fix Sentences"],
  ],
  U06: [
    ["Recognize food and preparation words", "Match food, drink, ingredient, and cooking words to their approved meanings.", "Build Words"],
    ["Understand a food action", "Identify what is prepared, moved, heated, served, or stored.", "Both"],
    ["Build practical food sentences", "Arrange food actions, objects, and locations in the approved sentence order.", "Fix Sentences"],
    ["State a food need or task", "Produce a familiar sentence about preparing or handling food and drink.", "Both"],
  ],
  U07: [
    ["Recognize place and direction words", "Match location, direction, room, and building terms to approved meanings.", "Build Words"],
    ["Locate a person or object", "Understand where something is and how it relates to nearby places.", "Both"],
    ["Arrange movement and location", "Build a sentence with the approved action, actor, destination, and spatial phrase.", "Fix Sentences"],
    ["Give or follow a direction", "Produce a familiar sentence that locates or moves someone or something.", "Both"],
  ],
  U08: [
    ["Recognize travel and environment words", "Match transport, route, landform, water, and weather words to approved meanings.", "Build Words"],
    ["Understand movement through a setting", "Identify who travels, the means of travel, and the surrounding environment.", "Both"],
    ["Build travel sentences", "Arrange travel actions, actors, vehicles, routes, and destinations correctly.", "Fix Sentences"],
    ["Describe a journey or landscape", "Produce a familiar sentence about travel or the natural world.", "Both"],
  ],
  U09: [
    ["Recognize body and sense words", "Match body parts and sensory actions to their approved meanings.", "Build Words"],
    ["Understand a bodily experience", "Identify the body part, sensation, or ordinary physical action being described.", "Both"],
    ["Build body and sense sentences", "Arrange an approved sentence about a body part or sensory action.", "Fix Sentences"],
    ["Describe a sensation", "Produce a familiar sentence about pain, taste, smell, touch, or another sensation.", "Both"],
  ],
  U10: [
    ["Recognize health and help words", "Match symptom, care, treatment, understanding, and help words to approved meanings.", "Build Words"],
    ["Understand a health or help situation", "Identify the symptom, care action, misunderstanding, or request for help.", "Both"],
    ["Build care and clarification sentences", "Arrange a sentence about health, care, explanation, or help.", "Fix Sentences"],
    ["Ask for or give help", "Produce a familiar sentence for care, clarification, help, or safety.", "Both"],
  ],
  U11: [
    ["Recognize work tool and trade words", "Match tools, work roles, machines, and exchange terms to approved meanings.", "Build Words"],
    ["Understand a work action", "Identify who works, what tool or material is involved, and what is done.", "Both"],
    ["Build work and tool sentences", "Arrange a sentence about making, repairing, using, buying, or selling.", "Fix Sentences"],
    ["Describe a task or exchange", "Produce a familiar sentence about work, tools, or trade.", "Both"],
  ],
  U12: [
    ["Recognize civic vocabulary", "Match public places, institutions, roles, and shared-service words to approved meanings.", "Build Words"],
    ["Understand a public situation", "Identify the institution, civic role, service, place, or public action.", "Both"],
    ["Build civic sentences", "Arrange a sentence about a public place, institution, decision, or service.", "Fix Sentences"],
    ["Describe community life", "Produce a familiar sentence about a civic place or shared activity.", "Both"],
  ],
  U13: [
    ["Recognize information and science words", "Match data, system, observation, astronomy, and science terms to approved meanings.", "Build Words"],
    ["Understand a technical statement", "Identify what is recorded, measured, processed, observed, or predicted.", "Both"],
    ["Build technical sentences", "Arrange a sentence about information, a system, or scientific observation.", "Fix Sentences"],
    ["Describe a system or observation", "Produce a familiar technical or scientific sentence.", "Both"],
  ],
  U14: [
    ["Recognize emotion and conversation words", "Match understanding, emotion, humor, and performance words to approved meanings.", "Build Words"],
    ["Interpret tone and feeling", "Understand the feeling, social action, humor, or performance described.", "Both"],
    ["Build conversational sentences", "Arrange a sentence about explanation, feeling, humor, music, or performance.", "Fix Sentences"],
    ["Express a thought or feeling", "Produce a familiar sentence for emotion, conversation, humor, or performance.", "Both"],
  ],
  U15: [
    ["Recognize complex markers and pronouns", "Identify approved condition, clause, comparison, modality, and advanced-pronoun forms.", "Build Words"],
    ["Understand a multi-part meaning", "Follow the relationship between clauses, conditions, comparisons, or points of view.", "Both"],
    ["Repair a complex sentence", "Restore the approved order and markers in a sentence with more than one grammatical relationship.", "Fix Sentences"],
    ["Produce a flexible sentence", "Write a familiar conditional, complex, modal, or discourse-framed sentence.", "Fix Sentences"],
  ],
  U16: [
    ["Recognize regional and figurative language", "Match national, ceremonial, dialogue, and idiomatic forms to approved meanings.", "Build Words"],
    ["Interpret meaning beyond the literal words", "Understand the intended meaning, tone, or cultural use of an advanced expression.", "Both"],
    ["Distinguish voice and register", "Choose or repair a sentence so its form fits the recorded regional or social voice.", "Fix Sentences"],
    ["Respond in context", "Produce or select an approved advanced expression for a familiar situation.", "Both"],
  ],
};

function candidateScore(row, unit) {
  let score = 0;
  const count = wordCount(row.celan_text);
  if (row.source_section.startsWith("Common Celan")) score += 30;
  if (row.related_entry_ids.includes("LX-")) score += 14;
  if (count >= 3 && count <= 6) score += 12;
  else if (count === 2 || count === 7) score += 7;
  if (row.translation.length <= 90) score += 8;
  if (/^I\b|^We\b|^You\b|^The\b|^There\b|^Please\b|^Turn\b|^Go\b|^Help\b/i.test(row.translation.replace(/[“”"]/g, ""))) score += 4;
  if (row.celan_text.includes(";")) score -= unit.stage < 4 ? 12 : 2;
  if (row.celan_text.includes(",")) score -= unit.stage < 3 ? 5 : 0;
  score -= Math.max(0, count - 7) * 4;
  return score;
}

async function selectCurriculum() {
  const phrases = parseCsv(await fs.readFile(`${projectDir}data/phrases_and_examples.csv`, "utf8"));
  const approved = phrases.filter((row) =>
    row.canon_status === "Canon" && row.review_status === "Approved" && row.celan_text && row.translation && !excludedTerms.test(row.translation)
  );
  const byId = new Map(approved.map((row) => [row.entry_id, row]));
  const usedForms = new Set();
  const selected = [];
  for (const unit of unitConfigs) {
    let rows;
    if (unit.manual) {
      rows = manualUnits[unit.id].map((id) => {
        const row = byId.get(id);
        if (!row) throw new Error(`Missing approved manual source ${id}`);
        return row;
      });
    } else {
      const localSeen = new Set();
      const ranked = (matcher) => approved
        .filter(matcher)
        .filter((row) => !usedForms.has(norm(row.celan_text)))
        .filter((row) => wordCount(row.celan_text) >= 2 && wordCount(row.celan_text) <= (unit.stage >= 4 ? 9 : 7))
        .sort((a, b) => candidateScore(b, unit) - candidateScore(a, unit) || a.entry_id.localeCompare(b.entry_id));
      rows = [];
      const take = (candidates, count) => {
        for (const row of candidates) {
          const key = norm(row.celan_text);
          if (localSeen.has(key)) continue;
          localSeen.add(key);
          rows.push(row);
          if (rows.length === count) break;
        }
      };
      if (unit.groups) {
        let target = 0;
        for (const group of unit.groups) {
          target += group.count;
          take(ranked((row) => unit.match(row) && group.match(row)), target);
          if (rows.length !== target) throw new Error(`${unit.id} group selected ${rows.length}, expected ${target}`);
        }
      }
      if (rows.length < 20) take(ranked(unit.match), 20);
    }
    if (rows.length !== 20) throw new Error(`${unit.id} selected ${rows.length}, expected 20`);
    for (const row of rows) {
      const key = norm(row.celan_text);
      if (usedForms.has(key)) throw new Error(`Duplicate sentence selected: ${row.celan_text}`);
      usedForms.add(key);
      selected.push({ ...row, unit_id: unit.id, unit_title: unit.title, stage: unit.stage, unit_theme: unit.theme });
    }
  }
  if (selected.length !== 320) throw new Error(`Selected ${selected.length}, expected 320`);
  return selected;
}

const functionWords = new Set([
  "i", "ya", "la", "ilin", "imen", "inko", "yako", "lako", "an", "ser", "thal", "esh", "morl",
  "ka", "nor", "va", "ra", "ver", "rath", "vael", "lia", "som", "felin", "aen",
]);

async function loadEvidence() {
  const [lexicon, dictionary, rules] = await Promise.all([
    fs.readFile(`${projectDir}data/lexicon.csv`, "utf8").then(parseCsv),
    fs.readFile(`${projectDir}data/dictionary_entries.csv`, "utf8").then(parseCsv),
    fs.readFile(`${projectDir}data/grammar_rules.csv`, "utf8").then(parseCsv),
  ]);
  const lexiconById = new Map(lexicon.map((row) => [row.entry_id, row]));
  const ruleById = new Map(rules.map((row) => [row.entry_id, row]));
  const dictBySourceId = new Map();
  const dictByHeadword = new Map();
  for (const row of dictionary) {
    for (const id of row.source_entry_ids.split(";").map((value) => value.trim()).filter(Boolean)) {
      if (!dictBySourceId.has(id)) dictBySourceId.set(id, row);
    }
    const key = norm(row.headword);
    if (!dictByHeadword.has(key)) dictByHeadword.set(key, row);
  }
  return { lexiconById, ruleById, dictBySourceId, dictByHeadword };
}

function attachEvidence(row, evidence) {
  const relatedIds = row.related_entry_ids.split(";").map((value) => value.trim()).filter(Boolean);
  const lexiconId = relatedIds.find((id) => evidence.lexiconById.has(id));
  const lexiconRow = lexiconId ? evidence.lexiconById.get(lexiconId) : null;
  const dictionarySourceId = relatedIds.find((id) => evidence.dictBySourceId.has(id));
  let dictionaryRow = dictionarySourceId ? evidence.dictBySourceId.get(dictionarySourceId) : (lexiconId ? evidence.dictBySourceId.get(lexiconId) : null);
  let focusHeadword = lexiconRow?.celan_term || dictionaryRow?.headword || "";
  if (!dictionaryRow && focusHeadword) dictionaryRow = evidence.dictByHeadword.get(norm(focusHeadword));
  if (!focusHeadword || !norm(row.celan_text).includes(norm(focusHeadword))) {
    const tokens = norm(row.celan_text).split(/\s+/).filter((token) => token && !functionWords.has(token));
    const allTokens = norm(row.celan_text).split(/\s+/).filter(Boolean);
    const token = tokens.find((value) => evidence.dictByHeadword.has(value))
      || allTokens.find((value) => evidence.dictByHeadword.has(value))
      || tokens[0]
      || allTokens[0]
      || "";
    dictionaryRow = evidence.dictByHeadword.get(token) || dictionaryRow;
    focusHeadword = dictionaryRow?.headword || token;
  }
  const focusMeaning = lexiconRow?.english_meaning || dictionaryRow?.meaning || "";
  const ruleIds = relatedIds.filter((id) => id.startsWith("GR-"));
  const linkedRules = ruleIds.map((id) => evidence.ruleById.get(id)).filter(Boolean);
  const ruleReview = !ruleIds.length
    ? "No linked grammar rule"
    : linkedRules.every((rule) => rule.review_status === "Approved")
      ? "Approved"
      : "Needs review";
  return {
    ...row,
    related_ids: relatedIds,
    lexicon_id: lexiconId || "",
    focus_headword: focusHeadword,
    focus_meaning: focusMeaning,
    pronunciation: dictionaryRow?.pronunciation || "",
    family_roots: dictionaryRow?.family_roots || "",
    derivation: dictionaryRow?.derivation || "",
    related_words: dictionaryRow?.related_words || "",
    dictionary_examples: dictionaryRow?.example_count || "",
    word_type: dictionaryRow?.use_type || lexiconRow?.category || "",
    root_word: dictionaryRow?.root_word || "",
    rule_ids: ruleIds,
    linked_rules: linkedRules,
    rule_review: ruleReview,
    evidence_status: focusHeadword && focusMeaning ? "Linked" : "Review needed",
  };
}

const excelColumn = (index) => {
  let value = index + 1;
  let name = "";
  while (value > 0) {
    value -= 1;
    name = String.fromCharCode(65 + (value % 26)) + name;
    value = Math.floor(value / 26);
  }
  return name;
};

const normalizeAnswer = (value) => norm(String(value || "").replace(/[.!?]+$/g, ""));

function buildObjectives(sentences) {
  const objectives = [];
  const byUnit = new Map(unitConfigs.map((unit) => [unit.id, []]));
  for (const sentence of sentences) byUnit.get(sentence.unit_id).push(sentence);
  let counter = 1;
  let previousUnitFinal = "";
  for (const unit of unitConfigs) {
    const ids = byUnit.get(unit.id).map((row) => row.asset_id);
    const unitObjectiveIds = [];
    objectiveDefinitions[unit.id].forEach(([title, goal, path], index) => {
      const objectiveId = `OBJ-${String(counter).padStart(3, "0")}`;
      unitObjectiveIds.push(objectiveId);
      objectives.push({
        objective_id: objectiveId,
        unit_id: unit.id,
        unit_title: unit.title,
        stage: unit.stage,
        title,
        goal,
        path,
        required: "Yes",
        prerequisite: index === 0 ? previousUnitFinal : unitObjectiveIds[index - 1],
        sentence_range: `${ids[0]}:${ids.at(-1)}`,
        rule_ids: (unitRuleMap[unit.id] || []).join("; "),
        status: "Draft",
      });
      counter += 1;
    });
    previousUnitFinal = unitObjectiveIds.at(-1);
  }
  return objectives;
}

function unitObjectiveIds(objectives, unitId) {
  return objectives.filter((row) => row.unit_id === unitId).map((row) => row.objective_id);
}

function buildExercises(sentences, objectives) {
  const rows = [];
  let counter = 1;
  const byUnit = new Map(unitConfigs.map((unit) => [unit.id, sentences.filter((row) => row.unit_id === unit.id)]));
  const supportByStage = {
    1: "Use the choices and the approved translation.",
    2: "Use the word bank and look for the sentence signpost.",
    3: "Find the action first, then place the actor and remaining information.",
    4: "Use the meaning and the known pattern; no full model is shown.",
    5: "Work from meaning, register, and structure with minimal support.",
  };
  const add = (sentence, objectiveId, path, exerciseType, prompt, options, correct, hint, feedback) => {
    rows.push({
      exercise_id: `EX-${String(counter).padStart(4, "0")}`,
      sentence_id: sentence.asset_id,
      unit_id: sentence.unit_id,
      objective_id: objectiveId,
      stage: sentence.stage,
      path,
      exercise_type: exerciseType,
      prompt,
      options,
      correct_answer: correct,
      accepted_answer: normalizeAnswer(correct),
      hint: hint || supportByStage[sentence.stage],
      feedback,
      source_example_id: sentence.entry_id,
      rule_ids: Array.from(new Set([...sentence.rule_ids, ...(unitRuleMap[sentence.unit_id] || [])])).join("; "),
      status: "Draft",
    });
    counter += 1;
  };
  for (const sentence of sentences) {
    const unitRows = byUnit.get(sentence.unit_id);
    const index = unitRows.findIndex((row) => row.asset_id === sentence.asset_id);
    const others = [...unitRows.slice(index + 1), ...unitRows.slice(0, index)]
      .filter((row) => row.focus_headword !== sentence.focus_headword);
    const headwordOptions = [sentence.focus_headword, ...others.map((row) => row.focus_headword).filter(Boolean)].filter((value, i, all) => all.indexOf(value) === i).slice(0, 3);
    const meaningOptions = [sentence.focus_meaning, ...others.map((row) => row.focus_meaning).filter(Boolean)].filter((value, i, all) => all.indexOf(value) === i).slice(0, 3);
    const ids = unitObjectiveIds(objectives, sentence.unit_id);
    add(
      sentence,
      ids[0],
      "Build Words",
      "Choose headword",
      `Which Celan headword matches this approved meaning: ${sentence.focus_meaning}`,
      headwordOptions.join(" | "),
      sentence.focus_headword,
      supportByStage[sentence.stage],
      `${sentence.focus_headword} is linked to “${sentence.focus_meaning}” in the project dictionary.`
    );
    add(
      sentence,
      ids[1],
      "Build Words",
      "Choose meaning",
      `What does ${sentence.focus_headword} mean in this lesson?`,
      meaningOptions.join(" | "),
      sentence.focus_meaning,
      supportByStage[sentence.stage],
      `The approved meaning used here is “${sentence.focus_meaning}”.`
    );
    const tokens = sentence.celan_text.split(/\s+/).filter(Boolean);
    const scrambled = tokens.length > 1 ? [...tokens.slice(1), tokens[0]] : tokens;
    add(
      sentence,
      ids[2],
      "Fix Sentences",
      "Reorder sentence",
      `Put these pieces back into the approved Celan sentence: ${sentence.translation}`,
      scrambled.join(" | "),
      sentence.celan_text,
      supportByStage[sentence.stage],
      `Approved form: ${sentence.celan_text}`
    );
    add(
      sentence,
      ids[1],
      "Fix Sentences",
      "Read for meaning",
      `Translate this approved Celan sentence into English: ${sentence.celan_text}`,
      "Free response",
      sentence.translation,
      supportByStage[sentence.stage],
      `Approved translation: ${sentence.translation}`
    );
    add(
      sentence,
      ids[3],
      "Fix Sentences",
      "Produce sentence",
      `Write the approved Celan sentence for: ${sentence.translation}`,
      sentence.stage <= 2 ? tokens.join(" | ") : "Free response",
      sentence.celan_text,
      supportByStage[sentence.stage],
      `Approved form: ${sentence.celan_text}`
    );
  }
  return rows;
}

function applyBaseStyle(sheet, usedRange) {
  sheet.showGridLines = false;
  sheet.getRange(usedRange).format.verticalAlignment = "center";
}

function writeTitle(sheet, title, subtitle) {
  sheet.getRange("A2").values = [[title]];
  sheet.getRange("A2").format.font = { name: "Arial", size: 15, bold: true, color: "#17324D" };
  sheet.getRange("A3").values = [[subtitle]];
  sheet.getRange("A3").format.font = { name: "Arial", size: 10, italic: true, color: "#5B6470" };
}

function writeTable(sheet, startRow, headers, data, tableName, widths = []) {
  const startIndex = startRow - 1;
  const rowCount = data.length + 1;
  const colCount = headers.length;
  sheet.getRangeByIndexes(startIndex, 0, rowCount, colCount).values = [headers, ...data];
  const lastColumn = excelColumn(colCount - 1);
  const lastRow = startRow + data.length;
  const table = sheet.tables.add(`A${startRow}:${lastColumn}${lastRow}`, true, tableName);
  table.style = "TableStyleMedium2";
  const header = sheet.getRange(`A${startRow}:${lastColumn}${startRow}`);
  header.format = {
    fill: "#17324D",
    font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "inside", style: "thin", color: "#D9E6EF" },
  };
  header.format.rowHeight = 30;
  sheet.getRangeByIndexes(startIndex + 1, 0, data.length, colCount).format.font = { name: "Arial", size: 10, color: "#1F2937" };
  widths.forEach((width, index) => {
    if (!width) return;
    sheet.getRangeByIndexes(startIndex, index, rowCount, 1).format.columnWidth = width;
  });
  sheet.getRangeByIndexes(startIndex + 1, 0, data.length, colCount).format.rowHeight = 20;
  return { lastRow, lastColumn, table };
}

async function buildWorkbook() {
  const evidence = await loadEvidence();
  const selected = (await selectCurriculum()).map((row, index) => ({
    ...attachEvidence(row, evidence),
    asset_id: `SEN-${String(index + 1).padStart(3, "0")}`,
    lesson_order: (index % 20) + 1,
  }));
  const objectives = buildObjectives(selected);
  const exercises = buildExercises(selected, objectives);
  const workbook = Workbook.create();
  const overview = workbook.worksheets.add("Overview");
  const curriculum = workbook.worksheets.add("Curriculum");
  const sentenceBank = workbook.worksheets.add("Sentence Bank");
  const exerciseSheet = workbook.worksheets.add("Exercises");
  const objectiveSheet = workbook.worksheets.add("Objectives");
  const wordLinks = workbook.worksheets.add("Word Links");
  const ruleReview = workbook.worksheets.add("Rule Review");

  overview.tabColor = "#17324D";
  curriculum.tabColor = "#2D7C7A";
  sentenceBank.tabColor = "#2D7C7A";
  exerciseSheet.tabColor = "#4F86A6";
  objectiveSheet.tabColor = "#4F86A6";
  wordLinks.tabColor = "#8BBCC9";
  ruleReview.tabColor = "#A66B2D";

  writeTitle(overview, "Celan learning release curriculum", "320 approved-source sentences supporting Build Words and Fix Sentences.");
  overview.getRange("A5:C5").values = [["Metric", "Value", "What it means"]];
  overview.getRange("A6:C12").values = [
    ["Sentence assets", null, "Canonical source sentences selected for the release course"],
    ["Units", null, "Twenty sentences in each unit"],
    ["Learning objectives", null, "Four objectives in each unit"],
    ["Exercise records", null, "Five deterministic exercises per sentence"],
    ["Source-approved sentences", null, "Sentence source rows marked Canon and Approved"],
    ["Grammar rules needing review", null, "Linked source rules that still need human review"],
    ["Reviewer-approved curriculum sentences", null, "Curriculum rows approved in this workbook"],
  ];
  overview.getRange("B6:B12").formulas = [
    ["=COUNTA('Sentence Bank'!A10:A329)"],
    ["=COUNTA(Curriculum!A10:A25)"],
    ["=COUNTA(Objectives!A10:A73)"],
    ["=COUNTA(Exercises!A10:A1609)"],
    ["=COUNTIF('Sentence Bank'!U10:U329,\"Approved\")"],
    ["=COUNTIF('Rule Review'!D10:D40,\"Needs Human Review\")"],
    ["=COUNTIF('Sentence Bank'!X10:X329,\"Approved\")"],
  ];
  overview.getRange("A5:C12").format.borders = { preset: "outside", style: "thin", color: "#9FB6C5" };
  overview.getRange("A5:C18").format.font = { name: "Arial", size: 10, color: "#1F2937" };
  overview.getRange("A5:C5").format = { fill: "#17324D", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
  overview.getRange("B6:B12").format.font = { name: "Arial", size: 12, bold: true, color: "#17324D" };
  overview.getRange("A14:C18").values = [
    ["Release rule", "Status", "Meaning"],
    ["Sentence source", "Met", "Every sentence comes from a Canon + Approved phrase row."],
    ["Curriculum placement", "Draft", "Unit, stage, objective, and exercise assignments are new teaching work."],
    ["Word formation", "Controlled", "Only recorded dictionary roots and derivations are shown; blanks are not guessed."],
    ["Grammar review", "Mixed", "Linked grammar rules keep their own source review status."],
  ];
  overview.getRange("A14:C14").format = { fill: "#2D7C7A", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
  overview.getRange("A14:C18").format.borders = { preset: "outside", style: "thin", color: "#9FB6C5" };
  overview.getRange("A5:A18").format.columnWidth = 38;
  overview.getRange("B5:B18").format.columnWidth = 18;
  overview.getRange("C5:C18").format.columnWidth = 76;
  overview.getRange("C15:C18").format.wrapText = true;
  overview.getRange("A15:C18").format.rowHeight = 38;
  applyBaseStyle(overview, "A1:C18");

  writeTitle(curriculum, "Release curriculum", "Sixteen units share one progression across both study paths.");
  const curriculumRows = unitConfigs.map((unit, index) => {
    const ids = unitObjectiveIds(objectives, unit.id);
    const coreRules = unitRuleMap[unit.id] || [];
    const reviews = coreRules.map((id) => evidence.ruleById.get(id)?.review_status || "Missing");
    const review = reviews.includes("Missing") ? "Missing rule" : reviews.every((value) => value === "Approved") ? "Approved" : "Needs review";
    return [
      unit.id,
      unit.stage,
      unit.title,
      unit.theme,
      20,
      null,
      objectiveDefinitions[unit.id][0][1],
      objectiveDefinitions[unit.id][2][1],
      ids.join("; "),
      coreRules.join("; "),
      review,
      "Draft",
    ];
  });
  writeTable(curriculum, 9, ["Unit ID", "Stage", "Unit", "Unit goal", "Target sentences", "Actual sentences", "Build Words focus", "Fix Sentences focus", "Objective IDs", "Core rule IDs", "Rule review", "Status"], curriculumRows, "CurriculumTable", [11, 8, 28, 46, 16, 16, 54, 54, 28, 34, 17, 14]);
  curriculum.getRange("F10").formulas = [["=COUNTIF('Sentence Bank'!$B$10:$B$329,A10)"]];
  curriculum.getRange("F10:F25").fillDown();
  curriculum.getRange("A10:L25").format.verticalAlignment = "top";
  curriculum.getRange("D10:H25").format.wrapText = true;
  curriculum.getRange("D10:H25").format.rowHeight = 48;
  curriculum.getRange("L10:L25").dataValidation = { rule: { type: "list", values: ["Draft", "Approved", "Revise"] } };
  curriculum.getRange("K10:L25").format.fill = "#FCE8B2";
  curriculum.freezePanes.freezeRows(9);
  curriculum.freezePanes.freezeColumns(3);
  applyBaseStyle(curriculum, "A1:L25");

  writeTitle(sentenceBank, "Canonical sentence bank", "Every sentence is source-approved. Curriculum and teaching decisions remain reviewable.");
  const sentenceRows = selected.map((row) => {
    const objectiveIds = unitObjectiveIds(objectives, row.unit_id);
    return [
      row.asset_id, row.unit_id, row.unit_title, row.stage, row.lesson_order, row.celan_text, row.translation,
      row.example_type, row.focus_headword, row.focus_meaning, row.pronunciation, row.family_roots, row.derivation,
      row.entry_id, row.source_volume, row.source_section, row.related_entry_ids, row.rule_ids.join("; "),
      (unitRuleMap[row.unit_id] || []).join("; "), row.rule_review, row.review_status, objectiveIds.join("; "),
      "Draft", "Unreviewed", "",
    ];
  });
  writeTable(sentenceBank, 9, ["Asset ID", "Unit ID", "Unit", "Stage", "Order", "Celan", "English", "Example type", "Focus headword", "Focus meaning", "Pronunciation", "Family roots", "Recorded derivation", "Source example ID", "Source volume", "Source section", "Source related IDs", "Source rule IDs", "Curriculum rule IDs", "Source rule review", "Source review", "Objective IDs", "Curriculum status", "Reviewer decision", "Reviewer notes"], sentenceRows, "SentenceBankTable", [12, 9, 29, 8, 8, 34, 42, 24, 20, 36, 18, 24, 42, 18, 37, 48, 38, 28, 36, 19, 15, 34, 17, 19, 42]);
  sentenceBank.getRange("W10:W329").dataValidation = { rule: { type: "list", values: ["Draft", "Approved", "Revise"] } };
  sentenceBank.getRange("X10:X329").dataValidation = { rule: { type: "list", values: ["Unreviewed", "Approved", "Revise", "Reject"] } };
  sentenceBank.getRange("W10:Y329").format.fill = "#FCE8B2";
  sentenceBank.freezePanes.freezeRows(9);
  sentenceBank.freezePanes.freezeColumns(5);
  applyBaseStyle(sentenceBank, "A1:Y329");

  writeTitle(exerciseSheet, "Exercise map", "Five deterministic exercises are tied to each sentence and shared objectives.");
  const exerciseRows = exercises.map((row) => [
    row.exercise_id, row.sentence_id, row.unit_id, row.objective_id, row.stage, row.path, row.exercise_type,
    row.prompt, row.options, row.correct_answer, row.accepted_answer, row.hint, row.feedback, row.source_example_id,
    row.rule_ids, row.status,
  ]);
  writeTable(exerciseSheet, 9, ["Exercise ID", "Sentence ID", "Unit ID", "Objective ID", "Stage", "Path", "Exercise type", "Prompt", "Tokens or options", "Correct answer", "Normalized accepted answer", "Hint", "Feedback", "Source example ID", "Rule IDs", "Status"], exerciseRows, "ExerciseMapTable", [13, 13, 9, 13, 8, 16, 20, 66, 58, 42, 38, 44, 58, 19, 36, 14]);
  exerciseSheet.getRange("P10:P1609").dataValidation = { rule: { type: "list", values: ["Draft", "Approved", "Revise"] } };
  exerciseSheet.getRange("P10:P1609").format.fill = "#FCE8B2";
  exerciseSheet.freezePanes.freezeRows(9);
  exerciseSheet.freezePanes.freezeColumns(4);
  applyBaseStyle(exerciseSheet, "A1:P1609");

  writeTitle(objectiveSheet, "Shared learning objectives", "Each objective supports one or both study paths and points to a fixed sentence range.");
  const objectiveRows = objectives.map((row) => [
    row.objective_id, row.unit_id, row.unit_title, row.stage, row.title, row.goal, row.path, row.required,
    row.prerequisite, row.sentence_range, row.rule_ids, row.status,
  ]);
  writeTable(objectiveSheet, 9, ["Objective ID", "Unit ID", "Unit", "Stage", "Title", "Plain-English goal", "Path", "Required", "Prerequisite ID", "Sentence range", "Rule IDs", "Status"], objectiveRows, "ObjectivesTable", [13, 9, 29, 8, 33, 64, 17, 11, 17, 22, 39, 14]);
  objectiveSheet.getRange("F10:F73").format.wrapText = true;
  objectiveSheet.getRange("A10:L73").format.rowHeight = 34;
  objectiveSheet.getRange("L10:L73").dataValidation = { rule: { type: "list", values: ["Draft", "Approved", "Revise"] } };
  objectiveSheet.getRange("L10:L73").format.fill = "#FCE8B2";
  objectiveSheet.freezePanes.freezeRows(9);
  objectiveSheet.freezePanes.freezeColumns(4);
  applyBaseStyle(objectiveSheet, "A1:L73");

  writeTitle(wordLinks, "Build Words links", "Recorded dictionary evidence for the focus word in each sentence. Blank morphology fields are not guessed.");
  const wordRows = selected.map((row, index) => [
    `WL-${String(index + 1).padStart(3, "0")}`, row.asset_id, row.unit_id, row.focus_headword, row.focus_meaning,
    row.word_type, row.pronunciation, row.root_word, row.family_roots, row.derivation, row.related_words,
    row.lexicon_id, row.dictionary_examples ? Number(row.dictionary_examples) : null, row.evidence_status, "Draft",
  ]);
  writeTable(wordLinks, 9, ["Link ID", "Sentence ID", "Unit ID", "Focus headword", "Approved meaning", "Word type", "Pronunciation", "Root word", "Family roots", "Recorded derivation", "Related words", "Source lexicon ID", "Dictionary example count", "Evidence status", "Review status"], wordRows, "WordLinksTable", [12, 13, 9, 21, 44, 21, 18, 12, 26, 46, 42, 20, 20, 16, 16]);
  wordLinks.getRange("O10:O329").dataValidation = { rule: { type: "list", values: ["Draft", "Approved", "Revise"] } };
  wordLinks.getRange("O10:O329").format.fill = "#FCE8B2";
  wordLinks.freezePanes.freezeRows(9);
  wordLinks.freezePanes.freezeColumns(4);
  applyBaseStyle(wordLinks, "A1:O329");

  const usedRuleIds = Array.from(new Set([
    ...selected.flatMap((row) => row.rule_ids),
    ...Object.values(unitRuleMap).flat(),
  ])).sort();
  writeTitle(ruleReview, "Grammar rule review", "Source rule status is kept separate from curriculum approval.");
  const ruleRows = usedRuleIds.map((id) => {
    const rule = evidence.ruleById.get(id);
    const units = unitConfigs.filter((unit) => (unitRuleMap[unit.id] || []).includes(id)).map((unit) => unit.id).join("; ");
    return [
      id, rule?.rule_name || "Missing rule", rule?.category || "", rule?.review_status || "Missing",
      rule?.canon_status || "", units, rule?.source_volume || "", rule?.page_number || "",
      rule?.original_wording || "", rule?.examples || "", "Review before approving lessons that depend on this rule.", "Unreviewed",
    ];
  });
  const ruleEnd = 9 + ruleRows.length;
  writeTable(ruleReview, 9, ["Rule ID", "Rule name", "Category", "Source review", "Canon status", "Used by units", "Source volume", "Page", "Original wording", "Source examples", "Curriculum note", "Reviewer decision"], ruleRows, "RuleReviewTable", [18, 34, 22, 20, 15, 22, 42, 10, 72, 66, 52, 20]);
  ruleReview.getRange(`L10:L${ruleEnd}`).dataValidation = { rule: { type: "list", values: ["Unreviewed", "Approved", "Revise", "Block release"] } };
  ruleReview.getRange(`L10:L${ruleEnd}`).format.fill = "#FCE8B2";
  ruleReview.getRange(`I10:K${ruleEnd}`).format.wrapText = true;
  ruleReview.getRange(`A10:L${ruleEnd}`).format.rowHeight = 95;
  ruleReview.freezePanes.freezeRows(9);
  ruleReview.freezePanes.freezeColumns(2);
  applyBaseStyle(ruleReview, `A1:L${ruleEnd}`);

  workbook.recalculate();

  const checks = [];
  for (const [sheetName, range] of [
    ["Overview", "A1:C18"], ["Curriculum", "A1:L25"], ["Sentence Bank", "A1:Y30"],
    ["Exercises", "A1:P30"], ["Objectives", "A1:L30"], ["Word Links", "A1:O30"], ["Rule Review", `A1:L${Math.min(ruleEnd, 28)}`],
  ]) {
    const inspection = await workbook.inspect({ kind: "table", range: `${sheetName}!${range}`, include: "values,formulas", tableMaxRows: 30, tableMaxCols: 25, maxChars: 12000 });
    checks.push(inspection.ndjson);
    const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
    await fs.writeFile(`${baseDir}final_${sheetName.toLowerCase().replaceAll(" ", "_")}.png`, new Uint8Array(await preview.arrayBuffer()));
  }
  const errors = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
    options: { useRegex: true, maxResults: 300 },
    summary: "final formula error scan",
  });
  checks.push(errors.ndjson);
  await fs.writeFile(`${baseDir}full_curriculum_checks.ndjson`, checks.join("\n"), "utf8");
  const outputPath = `${baseDir}celan_learning_release_curriculum.xlsx`;
  const output = await SpreadsheetFile.exportXlsx(workbook);
  await output.save(outputPath);

  const saved = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));
  const savedSummary = await saved.inspect({ kind: "workbook,sheet,table", maxChars: 12000, tableMaxRows: 4, tableMaxCols: 8 });
  await fs.writeFile(`${baseDir}saved_full_curriculum_inspect.ndjson`, savedSummary.ndjson, "utf8");
  console.log(JSON.stringify({
    outputPath,
    sentences: selected.length,
    units: unitConfigs.length,
    objectives: objectives.length,
    exercises: exercises.length,
    wordLinks: wordRows.length,
    rules: ruleRows.length,
    focusLinks: selected.filter((row) => row.evidence_status === "Linked").length,
  }));
}

if (process.argv.includes("--inspect")) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
  const summary = await workbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 8000,
    tableMaxRows: 8,
    tableMaxCols: 10,
    tableMaxCellChars: 120,
  });
  await fs.writeFile(`${baseDir}existing_workbook_inspect.ndjson`, summary.ndjson, "utf8");
  for (const sheetName of ["Sentence Bank", "Exercises", "Objectives"]) {
    const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
    await fs.writeFile(`${baseDir}existing_${sheetName.toLowerCase().replaceAll(" ", "_")}.png`, new Uint8Array(await preview.arrayBuffer()));
  }
}

if (process.argv.includes("--select")) {
  const evidence = await loadEvidence();
  const selected = (await selectCurriculum()).map((row) => attachEvidence(row, evidence));
  const lines = ["unit\tstage\tid\ttype\tcelan\tenglish\tsource"];
  for (const row of selected) {
    lines.push([row.unit_id, row.stage, row.entry_id, row.example_type, row.celan_text, row.translation, row.source_volume].join("\t"));
  }
  await fs.writeFile(`${baseDir}curriculum_selection.tsv`, lines.join("\n"), "utf8");
  console.log(JSON.stringify(Object.fromEntries(unitConfigs.map((unit) => [unit.id, selected.filter((row) => row.unit_id === unit.id).length]))));
  const missing = selected.filter((row) => row.evidence_status !== "Linked");
  console.log(`focus_links=${selected.length - missing.length}/${selected.length}`);
  if (missing.length) console.log(missing.map((row) => `${row.entry_id}\t${row.celan_text}\t${row.focus_headword}\t${row.focus_meaning}`).join("\n"));
}

if (process.argv.includes("--build")) {
  await buildWorkbook();
}
