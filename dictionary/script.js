function parseCsv(text) {
  const rows = [];
  let i = 0;
  let cell = "";
  let row = [];
  let inQuotes = false;
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(cell);
      cell = "";
      i++;
      continue;
    }
    if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      i++;
      continue;
    }
    if (ch !== "\r") {
      cell += ch;
    }
    i++;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function rowsToObjects(rows) {
  const [header, ...rest] = rows;
  return rest.map((r) => {
    const obj = {};
    header.forEach((h, idx) => {
      obj[h] = (r[idx] || "").trim();
    });
    return obj;
  });
}

function splitIds(ids) {
  if (!ids) return [];
  return ids.split(";").map((v) => v.trim()).filter(Boolean);
}

const PRONUNCIATION_OVERRIDES = {
  "var": "/var/",
  "lian": "/lee-ahn/",
  "thaal": "/thahl/",
  "shal": "/shahl/",
  "dren": "/dren/",
  "morldren": "/morl-dren/",
  "belshara": "/bel-shah-rah/",
  "rathvethor": "/rahth-veh-thor/",
  "talrin": "/tahl-rin/",
  "rinvarash": "/rin-vah-rahsh/",
  "vellian": "/vel-lee-ahn/",
  "ohm": "/ohm/",
  "thar": "/thar/",
  "ser": "/ser/",
  "ra": "/rah/",
  "va": "/vah/",
  "nor": "/nor/",
  "tha": "/thah/",
  "liorinen": "/lee-or-in-en/",
  "lia'ka": "/lee-ah-kah/",
  "lia'ser": "/lee-ah-ser/",
  "lian'lia": "/lee-ahn-lee-ah/"
};

const state = {
  lexicon: [],
  wordEntries: [],
  groupedEntries: [],
  grammarRules: [],
  expandedRoots: [],
  familyIndex: new Map(),
  forgeParts: [],
  roots: [],
  phrases: [],
  filtered: [],
  filteredRules: [],
  selectedId: null,
  selectedRuleId: null,
  activeLetter: "ALL",
  activeWordType: "ALL",
  activeView: "dictionary",
  forgeLastSubmitted: "",
  forgeIsLoading: false
};

const RULE_LESSONS = [
  {
    id: "LESSON-PRONUNCIATION",
    title: "Pronunciation",
    description: "How Celan sounds in the mouth: vowels, consonants, and the flow of euphony.",
    featuredRuleId: "RG-PRONUNCIATION"
  },
  {
    id: "LESSON-SENTENCE-SHAPE",
    title: "Sentence Shape",
    description: "How Celan builds a sentence: action first, questions, commands, negation, and conditions.",
    featuredRuleId: "LESSON-SENTENCE-SHAPE"
  },
  {
    id: "LESSON-WORD-BUILDING",
    title: "Word Building",
    description: "How roots, suffixes, and compounds grow into new meaning.",
    featuredRuleId: "LESSON-WORD-BUILDING"
  },
  {
    id: "LESSON-POSSESSION-RELATION",
    title: "Possession and Relation",
    description: "How belonging, relation, place, and connection are marked.",
    featuredRuleId: "LESSON-POSSESSION-RELATION"
  },
  {
    id: "LESSON-NUMBER-MEASURE",
    title: "Number and Measure",
    description: "How Celan counts, scales, measures, and handles simple quantity.",
    featuredRuleId: "LESSON-NUMBER-MEASURE"
  },
  {
    id: "LESSON-GENDER-ADDRESS-SOCIAL",
    title: "Gender, Address, and Social Use",
    description: "How social nuance, address, identity, and cultural tone shape expression.",
    featuredRuleId: "LESSON-GENDER-ADDRESS-SOCIAL"
  },
  {
    id: "LESSON-WRITING-CONVENTIONS",
    title: "Writing Conventions",
    description: "How Celan handles capitalization, emphasis, and written form.",
    featuredRuleId: "LESSON-WRITING-CONVENTIONS"
  }
];

const RULE_COMPANIONS = [
  {
    id: "PAGE-CULTURAL-VOICE",
    title: "Cultural Voice",
    description: "How one universal tongue takes on different national voices across Ohnosha."
  }
];

const els = {
  dictionaryViewBtn: document.getElementById("dictionaryViewBtn"),
  rulesViewBtn: document.getElementById("rulesViewBtn"),
  forgeViewBtn: document.getElementById("forgeViewBtn"),
  dictionaryView: document.getElementById("dictionaryView"),
  rulesView: document.getElementById("rulesView"),
  forgeView: document.getElementById("forgeView"),
  searchInput: document.getElementById("searchInput"),
  wordTypeFilter: document.getElementById("wordTypeFilter"),
  ruleSearchInput: document.getElementById("ruleSearchInput"),
  forgeForm: document.getElementById("forgeForm"),
  forgeInput: document.getElementById("forgeInput"),
  forgeCultureSelect: document.getElementById("forgeCultureSelect"),
  forgeSubmitBtn: document.getElementById("forgeSubmitBtn"),
  forgeOutput: document.getElementById("forgeOutput"),
  azBar: document.getElementById("azBar"),
  lessonStrip: document.getElementById("lessonStrip"),
  companionStrip: document.getElementById("companionStrip"),
  ruleSearchResults: document.getElementById("ruleSearchResults"),
  resultList: document.getElementById("resultList"),
  resultCount: document.getElementById("resultCount"),
  emptyState: document.getElementById("emptyState"),
  ruleEmptyState: document.getElementById("ruleEmptyState"),
  ruleDetailView: document.getElementById("ruleDetailView"),
  detailView: document.getElementById("detailView")
};

const CULTURAL_LENSES = {
  neutral: {
    label: "Neutral Celan",
    movementVerb: "var",
    speakingVerb: "aen",
    voice: "Balanced, readable, and not strongly tied to one national voice.",
    courtesy: "Celan keeps the phrasing direct, and politeness is carried more by restraint than by piling on extra words."
  },
  verdalrisian: {
    label: "Verdalrisian",
    movementVerb: "lorin",
    speakingVerb: "aen",
    voice: "Lyrical, patient, and guided by natural imagery.",
    courtesy: "This lens prefers guiding language and living metaphors over blunt force."
  },
  pelagaean: {
    label: "Pelagaean",
    movementVerb: "shalil",
    speakingVerb: "aen",
    voice: "Fluid, communal, and tide-like.",
    courtesy: "This lens prefers flow-language and soft relational movement rather than hard confrontation."
  },
  zarithan: {
    label: "Zarithan",
    movementVerb: "min",
    speakingVerb: "kel",
    voice: "Pragmatic, blunt, and survival-minded.",
    courtesy: "This lens cuts ornament and keeps only what the moment needs."
  },
  valkeldorian: {
    label: "Valkeldorian",
    movementVerb: "var",
    speakingVerb: "aen",
    voice: "Harsh, disciplined, and command-forward.",
    courtesy: "This lens tolerates harder edges if they sound resolute and controlled."
  },
  mechuman: {
    label: "Mechuman",
    movementVerb: "var",
    speakingVerb: "aen",
    voice: "Systematic, exact, and efficient.",
    courtesy: "This lens trims emotional spillover and favors clear functional phrasing."
  },
  nivveilian: {
    label: "Nivveilian",
    movementVerb: "var",
    speakingVerb: "aen",
    voice: "Sparse, patient, and cool in emotional temperature.",
    courtesy: "This lens often softens intensity through restraint rather than through more words."
  },
  jasaran: {
    label: "Jasaran",
    movementVerb: "lorin",
    speakingVerb: "aen",
    voice: "Balanced, elegant, and gently mystical.",
    courtesy: "This lens seeks equilibrium between firmness and beauty."
  },
  marakorian: {
    label: "Marakorian",
    movementVerb: "var",
    speakingVerb: "aen",
    voice: "Formal, order-conscious, and tradition-minded.",
    courtesy: "This lens leans ceremonial and proper rather than casual."
  }
};

const RETRIEVAL_PACKS = {
  blessings: {
    id: "blessings",
    title: "Blessings",
    cues: "Blessings, parting words, spiritual goodwill, and elevated hopes for another person.",
    notes: "Celan blessings often lean on peace, path, light, guidance, or hopeful invocation rather than flat statements.",
    examples: [
      { celan: "vael vaar an shara-ya.", english: "May peace be on your path." },
      { celan: "shal lorin ser.", english: "Let the light guide you." },
      { celan: "va var kalor thal!", english: "Go in strength and balance!" }
    ]
  },
  longing: {
    id: "longing",
    title: "Longing",
    cues: "Longing, yearning, desire, intimate wanting, and heart-pulled expression.",
    notes: "This family often spreads across heart, desire, yearning, and nearness rather than one narrow English-style want-word.",
    examples: [
      { celan: "Theraen La Shalor.", english: "I yearn for the Sanctuary." },
      { celan: "ohmaen I sharaka.", english: "I love freedom." },
      { celan: "aen thar lian.", english: "The heart speaks truth." }
    ]
  },
  time_questions: {
    id: "time_questions",
    title: "Time Questions",
    cues: "Questions about time, timing, sequence, and the present moment.",
    notes: "Time questions are their own phrase family. The support is real, but the exact current-time question remains thin in the canon-facing material.",
    examples: [
      { celan: "vaar I thal nor.", english: "I seek peace in the balance of time." },
      { celan: "nor-var I nor Varthas.", english: "I will go to the city / I go in time-setting toward the city." },
      { celan: "Tal I dren an Kinnlin.", english: "I drink the water at noon." }
    ]
  },
  boundaries: {
    id: "boundaries",
    title: "Boundaries",
    cues: "Commands, refusals, distancing language, personal limits, and pushing something away.",
    notes: "English idioms in this family often need reshaping into distance, refusal, or removal language.",
    examples: [
      { celan: "va var dren!", english: "Go to the water!" },
      { celan: "ver var I ka trakor.", english: "I do not go without shoes." },
      { celan: "ver var I dren, li-ser.", english: "I cannot go, respected friend." }
    ]
  },
  affection: {
    id: "affection",
    title: "Affection",
    cues: "Affection, care, love, emotional closeness, and warmly directed feeling.",
    notes: "Affection may move through connection, heart, or presence rather than only blunt declaration.",
    examples: [
      { celan: "ohmaen I sharaka.", english: "I love freedom." },
      { celan: "aen thar lian.", english: "The heart speaks truth." },
      { celan: "dral shal thaar.", english: "The heavens light the heart." }
    ]
  },
  requests: {
    id: "requests",
    title: "Requests",
    cues: "Requests, asks, polite instructions, and formal or practical inquiries.",
    notes: "A request is not always a command. Celan can carry asking, directing, or inviting differently.",
    examples: [
      { celan: "ra aen ya belshen velrin?", english: "Do you speak the price of the food?" },
      { celan: "li-ya, nor aen lian?", english: "May we now speak truth?" },
      { celan: "va var dren!", english: "Go to the water!" }
    ]
  },
  movement_direction: {
    id: "movement_direction",
    title: "Movement and Direction",
    cues: "Going, heading, guiding, arriving, traveling, and path-centered phrasing.",
    notes: "Movement is one of the clearest structural centers of Celan.",
    examples: [
      { celan: "ra var ser?", english: "Where does the friend go?" },
      { celan: "ra var evan emil dren?", english: "Where is the market?" },
      { celan: "lorin dren morl.", english: "The mountain guides the water." }
    ]
  },
  truth_speaking: {
    id: "truth_speaking",
    title: "Truth-Speaking",
    cues: "Truth, honesty, declaration, moral speech, and aligned speech.",
    notes: "Truth in Celan often reaches beyond bare fact into right naming, order, and moral alignment.",
    examples: [
      { celan: "aen thar lian.", english: "The heart speaks truth." },
      { celan: "Lorin belthal Ilin.", english: "Order guides us." },
      { celan: "li-ya, nor aen lian?", english: "May we now speak truth?" }
    ]
  },
  grief_and_fear: {
    id: "grief_and_fear",
    title: "Grief and Fear",
    cues: "Fear, grief, dread, sorrow, despair, loss, and burdened feeling.",
    notes: "Celan often ties grief to darkness, time, or the heart rather than isolating emotion into a separate grammar.",
    examples: [
      { celan: "fahaen I ar!", english: "I am terrified!" },
      { celan: "nkathalaen velar Rathor.", english: "The elder grieves for history." },
      { celan: "vershalaen la nor fah.", english: "They despair in the darkness." }
    ]
  }
};

async function loadCsv(path) {
  const embedded = window.EMBEDDED_DATA;
  if (embedded) {
    const normalized = path.replace(/^\.{2}\//, "");
    const basename = normalized.split("/").pop();
    const embeddedText = embedded[normalized] || embedded[basename];
    if (embeddedText) {
      return rowsToObjects(parseCsv(embeddedText));
    }
  }
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return rowsToObjects(parseCsv(await res.text()));
}

function azBucket(term) {
  const first = ((term || "").trim()[0] || "").toUpperCase();
  if (!first) return "";
  return /[A-Z]/.test(first) ? first : "-";
}

function renderAzBar() {
  const letters = ["ALL", "-", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  const availableLetters = new Set(
    state.groupedEntries
      .map((group) => azBucket(group.term))
      .filter(Boolean)
  );
  els.azBar.innerHTML = "";
  letters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.className = state.activeLetter === letter ? "active" : "";
    const disabled = letter !== "ALL" && !availableLetters.has(letter);
    if (disabled) {
      btn.disabled = true;
      btn.classList.add("disabled");
    }
    btn.onclick = () => {
      if (disabled) return;
      state.activeLetter = letter;
      renderAzBar();
      applyFilters();
    };
    els.azBar.appendChild(btn);
  });
}

function availableWordTypes() {
  const seen = new Set();
  state.groupedEntries.forEach((group) => {
    (group.uses || []).forEach((use) => {
      const type = (use.type || "").trim();
      if (type) seen.add(type);
    });
  });
  return Array.from(seen).sort((a, b) => a.localeCompare(b));
}

function renderWordTypeFilter() {
  if (!els.wordTypeFilter) return;
  const previous = state.activeWordType || "ALL";
  const options = ["ALL", ...availableWordTypes()];
  els.wordTypeFilter.innerHTML = "";
  options.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value === "ALL" ? "All word types" : value;
    els.wordTypeFilter.appendChild(option);
  });
  state.activeWordType = options.includes(previous) ? previous : "ALL";
  els.wordTypeFilter.value = state.activeWordType;
}

function renderActiveView() {
  const dictionaryActive = state.activeView === "dictionary";
  const rulesActive = state.activeView === "rules";
  const forgeActive = state.activeView === "forge";
  els.dictionaryView.classList.toggle("hidden", !dictionaryActive);
  els.rulesView.classList.toggle("hidden", !rulesActive);
  els.forgeView.classList.toggle("hidden", !forgeActive);
  els.dictionaryViewBtn.classList.toggle("active", dictionaryActive);
  els.rulesViewBtn.classList.toggle("active", rulesActive);
  els.forgeViewBtn.classList.toggle("active", forgeActive);
}

function isWordEntry(row) {
  const term = (row.celan_term || "").trim();
  if (!term) return false;
  if (term.includes(" ")) return false;
  if (/[,.!?;:/()]/.test(term)) return false;
  return true;
}

function normalizeHeadword(term) {
  return (term || "").trim().toLowerCase();
}

function cleanAlpha(term) {
  return (term || "").toLowerCase().replace(/[^a-z]/g, "");
}

function normalizeForge(term) {
  return cleanAlpha(term || "");
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function normalizeUseType(rawType) {
  const text = (rawType || "").trim().toLowerCase();
  if (!text) return "";
  if (text.startsWith("noun")) return "Noun";
  if (text.startsWith("verb")) return "Verb";
  if (text.startsWith("adjective")) return "Adjective";
  if (text.startsWith("adverb")) return "Adverb";
  if (text.startsWith("pronoun")) return "Pronoun";
  if (text.startsWith("preposition")) return "Preposition";
  if (text.startsWith("conjunction")) return "Conjunction";
  if (text.startsWith("interjection")) return "Interjection";
  if (text.startsWith("suffix")) return "Suffix";
  if (text.startsWith("prefix")) return "Prefix";
  if (text.startsWith("complementizer")) return "Conjunction";
  if (text.startsWith("modal")) return "Modal";
  if (text.startsWith("root")) return "Root";
  if (text.startsWith("unit")) return "Measure";
  if (text.startsWith("connector")) return "Conjunction";
  return titleCase(rawType.trim());
}

function formatRootHeadword(form) {
  const raw = (form || "").trim().replace(/-+$/g, "");
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

function categoryMatches(category, phrases) {
  return phrases.some((phrase) => category.includes(phrase));
}

function inferTypeLabel(entry, meaning) {
  const category = (entry.category || "").toLowerCase();
  const text = (meaning || entry.english_meaning || "").toLowerCase();
  const startsWithVerbInfinitive = text.startsWith("to ");
  const leadingVerbGloss = /^(go|move|speak|tell|breathe|use|pray|love|believe|hear|see|make|yearn|long|betray|forgive|attune|cherish|comfort|guide|drink|eat|bring|take|give|rest|sit|flow|protect|defend|command|direct)\b/.test(text);
  const leadingNounGloss = /^(friend|ally|truth|honesty|water|balance|harmony|past|history|light|darkness|fear|night|peace|calm|strength|power|guardian|protector|destiny|purpose|longing|yearning|confusion|uncertainty|joy|happiness|fabric|spice|food|drink|bread|grain|carving|fruit|feast|earth|time|stew|meal|home|merchant|waterfall|spring|soil|horizon|forge)\b/.test(text);
  const nounCategories = [
    "kinship term",
    "body",
    "nature",
    "nature and landscapes",
    "community",
    "food vocabulary",
    "staple foods",
    "prepared dishes",
    "specialty ingredients",
    "beverages",
    "urban and mystical spaces",
    "times of day",
    "seasons",
    "weather terms",
    "mundane objects & tools",
    "clothing & worn items",
    "flora & fauna",
    "abstract concepts",
    "elements of wonder",
    "measurement unit",
    "title / role",
    "gendered and neutral terms",
    "refined relationships",
    "slur",
    "market jargon",
    "battle jargon",
    "temple jargon",
    "national ceremonial term",
    "ritual noun",
    "mourning/remembrance noun",
    "spiritual unity noun",
    "number"
  ];
  const conceptNounCategories = [
    "time & mysticism",
    "emotions",
    "strength & empowerment",
    "expanded vocabulary",
    "compounding example"
  ];
  const adjectiveCategories = [
    "basic & sensory adjectives",
    "colors"
  ];
  const verbCategories = [
    "essential verbs",
    "emotion verb",
    "ritual verb",
    "spiritual unity verb",
    "mourning/remembrance verb",
    "stative verb"
  ];
  const interjectionCategories = [
    "greetings",
    "interjection",
    "oath/curse",
    "hesitation sound",
    "culturally specific greeting/farewell",
    "basic response",
    "nuanced affirmation/disagreement"
  ];
  const particleCategories = [
    "particle",
    "emotional intensity marker",
    "discourse particle",
    "modal adverb",
    "conditionals",
    "questions and imperatives"
  ];
  if (category.includes("root")) return "Root";
  if (category.includes("relative pronoun")) return "Pronoun";
  if (category.includes("pronoun")) return "Pronoun";
  if (category.includes("preposition")) return "Preposition";
  if (category.includes("conjunction")) return "Conjunction";
  if (category.includes("quantifier")) return "Quantifier";
  if (category.includes("suffix")) return "Suffix";
  if (category.includes("prefix")) return "Prefix";
  if (category.includes("possession")) return "Possessive";
  if (category.includes("clusivity")) return "Pronoun";
  if (text.includes("relative pronoun")) return "Pronoun";
  if (text.includes("direct possession marker")) return "Possessive";
  if (text.includes("complementizer")) return "Conjunction";
  if (text.includes("diminisher")) return "Particle";
  if (text.includes("superlative marker") || text.includes("comparative marker") || text.includes("conditional marker") || text.includes("intensifier")) return "Particle";
  if (categoryMatches(category, verbCategories)) return "Verb";
  if (startsWithVerbInfinitive) return "Verb";
  if (leadingVerbGloss) return "Verb";
  if (category.includes("verb")) return "Verb";
  if (category.includes("noun")) return "Noun";
  if (categoryMatches(category, adjectiveCategories)) return "Adjective";
  if ((category.includes("everyday life") || category.includes("formal vocabulary") || category.includes("informal vocabulary")) && leadingNounGloss) return "Noun";
  if (categoryMatches(category, conceptNounCategories) && !startsWithVerbInfinitive && !leadingVerbGloss) return "Noun";
  if (categoryMatches(category, nounCategories)) return "Noun";
  if (categoryMatches(category, particleCategories)) return "Particle";
  if (categoryMatches(category, interjectionCategories)) return "Interjection";
  if (category.includes("affirmation") || category.includes("response")) return "Particle";
  if (category.includes("formal vocabulary") && startsWithVerbInfinitive) return "Verb";
  return "";
}

function inferRootDisplayType(entry, meaning) {
  const text = (meaning || entry.english_meaning || "").trim().toLowerCase();
  const firstSegment = text.split(/[;,/]/)[0].trim();
  const firstWords = firstSegment.split(/\s+/).filter(Boolean);
  const firstWord = firstWords[0] || "";
  const secondWord = firstWords[1] || "";
  const nounHints = /^(essence|presence|blanket|system|systems|civilization|truth|light|darkness|shadow|mystery|shade|balance|harmony|power|strength|force|history|time|source|connection|unity|order|law|quality|water|earth|fire|sky|air|heart|peace|relief|safety|fate|wonder|ritual|name|word|measure|weight|ground|flow)$/;
  const adjectiveHints = /^(warm|cold|hot|soft|hard|bright|dark|wet|dry|full|empty|clean|dirty|old|new|strong|gentle|hidden)$/;

  if (!text) return "";
  if (text.startsWith("to ")) return "Verb";
  if (firstWords.length === 1 && /ing$/.test(firstWord)) return "Verb";
  if (nounHints.test(secondWord) || nounHints.test(firstWord)) return "Noun";
  if (adjectiveHints.test(firstWord)) return "Adjective";
  if (/ing$/.test(firstWord)) return "Verb";
  return "Noun";
}

function parseExplicitUses(entry) {
  const meaning = (entry.english_meaning || "").trim();
  if (!/:/.test(meaning) || !/;\s*/.test(meaning)) return [];
  return meaning.split(/\s*;\s*/).map((part) => part.trim()).map((part) => {
    const match = part.match(/^([A-Za-z()\/ -]+):\s*(.+)$/);
    if (!match) return null;
    return {
      type: normalizeUseType(match[1].trim()),
      meaning: match[2].trim(),
      usage: (entry.usage_context || "").trim(),
      sourceEntries: [entry.entry_id]
    };
  }).filter(Boolean);
}

function buildUses(entry) {
  const explicitUses = parseExplicitUses(entry);
  if (explicitUses.length) return explicitUses;
  const inferredType = inferTypeLabel(entry);
  return [{
    type: inferredType === "Root" ? inferRootDisplayType(entry) : inferredType,
    rootWord: inferredType === "Root",
    meaning: (entry.english_meaning || "").trim(),
    usage: (entry.usage_context || "").trim(),
    sourceEntries: [entry.entry_id]
  }];
}

function buildRootEntries(expandedRoots) {
  return expandedRoots
    .filter((row) => (row.entry_type || "").toLowerCase() === "root")
    .map((row) => {
      const term = formatRootHeadword(row.form);
      if (!term) return null;
      const evidence = (row.evidence_hint || "").split(";").map((value) => value.trim()).filter(Boolean);
      return {
        entry_id: `XR-${cleanAlpha(row.form)}`,
        celan_term: term,
        english_meaning: row.core_meaning || "",
        category: "Root",
        usage_context: row.function_in_use || "",
        original_wording: evidence.length
          ? `Root family evidence: ${evidence.join(", ")}`
          : (row.notes || ""),
        related_entry_ids: (row.source_reference || "").split(";").map((value) => value.trim()).filter(Boolean).join("; "),
        notes: row.notes || "",
        canon_status: row.status || "Canon"
      };
    })
    .filter(Boolean);
}

function buildMorphologyEntries(roots) {
  return roots
    .filter((row) => isFamilyAnchorType(row.type) || /prefix|suffix|particle|preposition/i.test(row.type || ""))
    .map((row) => {
      const term = (row.root_or_morpheme || "").trim();
      if (term === "Fah- / Vethor-") return null;
      if (!term) return null;
      return {
        entry_id: `DM-${row.entry_id}`,
        celan_term: term,
        english_meaning: row.meaning_or_function || "",
        category: row.type || "Morphology",
        usage_context: row.notes || "",
        original_wording: row.original_wording || row.derived_forms || "",
        related_entry_ids: row.related_entry_ids || "",
        notes: "Dictionary-layer entry surfaced from roots_and_morphology.csv.",
        canon_status: row.canon_status || "Canon"
      };
    })
    .filter(Boolean);
}

function buildSupplementalDictionaryEntries() {
  return [
    {
      entry_id: "DX-rinaen",
      celan_term: "Rinaen",
      english_meaning: "To be; to exist in essence; is-in-essence",
      category: "Stative Verb",
      usage_context: "Rin (essence) + Aen (breath/speaking) as a stative verb expressing essential being or existence.",
      original_wording: "High-frequency dictionary-layer entry surfaced from canon usage audit. Source extraction remains unchanged.",
      related_entry_ids: "RM-S3-0012; RM-S3-0019",
      notes: "Dictionary-layer entry added from repeated canon usage. Source files unchanged.",
      canon_status: "Canon"
    },
    {
      entry_id: "DX-emil",
      celan_term: "Emil",
      english_meaning: "Food; meal",
      category: "Noun",
      usage_context: "Common everyday word for sustenance in both casual and formal contexts.",
      original_wording: "Dictionary-layer entry surfaced from repeated canon usage. Source extraction remains unchanged.",
      related_entry_ids: "",
      notes: "Added to dictionary layer from canon usage audit.",
      canon_status: "Canon"
    },
    {
      entry_id: "DX-teremil",
      celan_term: "Teremil",
      english_meaning: "Home",
      category: "Noun",
      usage_context: "Frequent conversational location word, often appearing in family and household examples.",
      original_wording: "Dictionary-layer entry surfaced from repeated canon usage. Source extraction remains unchanged.",
      related_entry_ids: "",
      notes: "Added to dictionary layer from canon usage audit.",
      canon_status: "Canon"
    },
    {
      entry_id: "DX-serin",
      celan_term: "Serin",
      english_meaning: "Friends",
      category: "Plural Noun",
      usage_context: "Ser (friend/ally/with) + -in (plural suffix). Plural form of Ser.",
      original_wording: "Dictionary-layer entry surfaced from repeated canon usage. Source extraction remains unchanged.",
      related_entry_ids: "RM-S3-0023; RM-V2-0029",
      notes: "Added to dictionary layer from canon usage audit.",
      canon_status: "Canon"
    },
    {
      entry_id: "DX-varadan",
      celan_term: "Varadan",
      english_meaning: "Merchant",
      category: "Noun",
      usage_context: "Frequent marketplace word for the person who trades, bargains, or brings goods.",
      original_wording: "Dictionary-layer entry surfaced from repeated canon usage. Source extraction remains unchanged.",
      related_entry_ids: "",
      notes: "Added to dictionary layer from canon usage audit.",
      canon_status: "Canon"
    }
  ];
}

function isFamilyAnchorType(value) {
  const text = (value || "").toLowerCase();
  return text.includes("root") || text.includes("morpheme") || text.includes("marker");
}

function uniqueStrings(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function collectForgeParts(groupedEntries, roots) {
  const partMap = new Map();

  function addPart(term, meta) {
    const raw = (term || "").trim();
    const normalized = normalizeForge(raw);
    if (!raw || normalized.length < 2) return;
    if (!partMap.has(normalized)) {
      partMap.set(normalized, {
        normalized,
        forms: new Set(),
        labels: new Set(),
        meanings: new Set(),
        sourceIds: new Set()
      });
    }
    const bucket = partMap.get(normalized);
    bucket.forms.add(raw);
    if (meta.label) bucket.labels.add(meta.label);
    if (meta.meaning) bucket.meanings.add(meta.meaning);
    if (meta.sourceId) bucket.sourceIds.add(meta.sourceId);
  }

  groupedEntries.forEach((group) => {
    const hasRootWord = group.uses.some((use) => use.rootWord);
    const suffixLike = /^[-']/.test(group.term);
    const prefixLike = /-$/.test(group.term);
    if (!hasRootWord && !suffixLike && !prefixLike) return;
    const primaryMeaning = (group.uses[0]?.meaning || "").trim();
    let label = "";
    if (suffixLike) label = "Suffix";
    else if (prefixLike) label = "Prefix";
    else if (hasRootWord) label = "Root Word";
    addPart(group.term, {
      label,
      meaning: primaryMeaning,
      sourceId: group.entries.map((entry) => entry.entry_id).join("; ")
    });
  });

  roots.forEach((row) => {
    const term = (row.root_or_morpheme || "").trim();
    if (!term || term === "Fah- / Vethor-") return;
    let label = row.type || "";
    if (/suffix/i.test(label)) label = "Suffix";
    else if (/prefix/i.test(label)) label = "Prefix";
    else if (isFamilyAnchorType(label)) label = "Root Word";
    addPart(term, {
      label,
      meaning: row.meaning_or_function || "",
      sourceId: row.entry_id || ""
    });
  });

  return Array.from(partMap.values())
    .map((part) => ({
      normalized: part.normalized,
      forms: Array.from(part.forms),
      labels: Array.from(part.labels),
      meanings: Array.from(part.meanings),
      sourceIds: Array.from(part.sourceIds)
    }))
    .sort((a, b) => b.normalized.length - a.normalized.length);
}

function segmentForgeTerm(rawTerm, parts) {
  const normalized = normalizeForge(rawTerm);
  if (!normalized) return { covered: 0, tokens: [] };
  const tokens = [];
  let index = 0;

  while (index < normalized.length) {
    const match = parts.find((part) => normalized.startsWith(part.normalized, index));
    if (!match) {
      tokens.push({
        type: "Unknown",
        text: normalized.slice(index, index + 1),
        meaning: ""
      });
      index += 1;
      continue;
    }
    tokens.push({
      type: match.labels[0] || "Known Part",
      text: match.forms[0] || match.normalized,
      meaning: match.meanings[0] || "",
      sourceIds: match.sourceIds
    });
    index += match.normalized.length;
  }

  const covered = tokens.filter((token) => token.type !== "Unknown").reduce((sum, token) => sum + normalizeForge(token.text).length, 0);
  return { covered, tokens };
}

function findParallelForms(rawTerm) {
  const normalized = normalizeForge(rawTerm);
  if (!normalized) return [];
  return state.groupedEntries
    .filter((group) => normalizeForge(group.term) === normalized && normalizeHeadword(group.term) !== normalizeHeadword(rawTerm))
    .map((group) => group.term);
}

function tokenizeMeaningQuery(value) {
  const stopwords = new Set([
    "a", "an", "the", "to", "of", "and", "or", "for", "with", "from", "in", "on",
    "at", "my", "your", "their", "our", "his", "her", "is", "are", "be", "that",
    "this", "get", "out", "please"
  ]);
  return (value || "")
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => !stopwords.has(token));
}

function normalizeMeaningToken(token) {
  const raw = (token || "").toLowerCase().trim();
  if (!raw) return "";
  if (raw.endsWith("ies") && raw.length > 3) return `${raw.slice(0, -3)}y`;
  if (raw.endsWith("s") && !raw.endsWith("ss") && raw.length > 3) return raw.slice(0, -1);
  return raw;
}

function findExactCanonSupport(tokens) {
  const support = new Map();
  const wanted = new Set(tokens.map((token) => normalizeMeaningToken(token)).filter(Boolean));
  if (!wanted.size) return support;

  state.groupedEntries.forEach((group) => {
    group.uses.forEach((use) => {
      const words = `${use.meaning || ""} ${use.usage || ""}`
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .split(/\s+/)
        .map((word) => normalizeMeaningToken(word))
        .filter(Boolean);
      words.forEach((word) => {
        if (wanted.has(word) && !support.has(word)) {
          support.set(word, {
            term: group.term,
            use
          });
        }
      });
    });
  });

  return support;
}

function scoreMeaningMatch(tokens, text) {
  const haystack = (text || "").toLowerCase();
  if (!haystack) return 0;
  let score = 0;
  tokens.forEach((token) => {
    if (haystack.includes(token)) {
      score += haystack.includes(` ${token} `) ? 3 : 2;
    }
  });
  return score;
}

function findCanonMeaningMatches(query, tokens) {
  const scored = state.groupedEntries.map((group) => {
    const useScores = group.uses.map((use) => {
      const score = scoreMeaningMatch(tokens, `${use.meaning} ${use.usage || ""}`);
      return { use, score };
    });
    const bestUse = useScores.sort((a, b) => b.score - a.score)[0];
    const phraseBoost = scoreMeaningMatch(tokens, group.searchText || "");
    const total = (bestUse?.score || 0) + phraseBoost;
    return {
      group,
      use: bestUse?.use || null,
      score: total
    };
  }).filter((item) => item.score > 0);

  return scored
    .sort((a, b) => b.score - a.score || a.group.term.localeCompare(b.group.term))
    .slice(0, 6);
}

function findMeaningParts(tokens) {
  return state.forgeParts
    .map((part) => {
      const meaningText = part.meanings.join(" ; ").toLowerCase();
      const score = scoreMeaningMatch(tokens, meaningText);
      return {
        ...part,
        score
      };
    })
    .filter((part) => part.score > 0)
    .sort((a, b) => {
      const labelA = partPriority(a.labels[0] || "");
      const labelB = partPriority(b.labels[0] || "");
      return b.score - a.score || labelA - labelB || a.forms[0].localeCompare(b.forms[0]);
    })
    .slice(0, 8);
}

function partPriority(label) {
  const text = (label || "").toLowerCase();
  if (text.includes("root")) return 1;
  if (text.includes("prefix")) return 2;
  if (text.includes("suffix")) return 3;
  return 4;
}

function displayPartMeaning(part) {
  return part.meanings[0] || "";
}

function combinePartForms(left, right) {
  const leftForm = (left || "").replace(/-+$/g, "").replace(/^'+|'+$/g, "");
  const rightForm = (right || "").replace(/^-+/g, "").replace(/^'+|'+$/g, "");
  if (!leftForm || !rightForm) return "";
  return `${leftForm}${rightForm}`;
}

function buildMeaningIdeas(parts) {
  const roots = parts.filter((part) => (part.labels[0] || "").toLowerCase().includes("root"));
  const ideas = [];
  for (let i = 0; i < roots.length; i += 1) {
    for (let j = i + 1; j < roots.length; j += 1) {
      const first = roots[i];
      const second = roots[j];
      const suggestion = combinePartForms(first.forms[0], second.forms[0]);
      if (!suggestion) continue;
      ideas.push({
        suggestion: suggestion.charAt(0).toUpperCase() + suggestion.slice(1),
        breakdown: `${first.forms[0]} + ${second.forms[0]}`,
        meaning: `${displayPartMeaning(first)} + ${displayPartMeaning(second)}`
      });
      if (ideas.length >= 4) return ideas;
    }
  }
  return ideas;
}

function selectedCultureLens() {
  return CULTURAL_LENSES[els.forgeCultureSelect?.value || "neutral"] || CULTURAL_LENSES.neutral;
}

function detectPhraseIntent(query) {
  const text = (query || "").toLowerCase();
  const politeness = /\bplease\b/.test(text);
  const insulted = /\b(jerk|idiot|fool|intruder|enemy|hostile|rude)\b/.test(text);

  if (/\bwhat time is it\b|\bwhat hour is it\b|\bwhat time\b/.test(text)) {
    return {
      kind: "ask-time",
      politeness,
      insulted
    };
  }

  if (
    /out of my face|out of my hair|away from me|go away|leave me alone|get out of here|get away from me/.test(text) ||
    ((/\bget\b/.test(text) || /\bneed\b/.test(text) || /\bwant\b/.test(text)) &&
      (/\bout\b/.test(text) || /\baway\b/.test(text)) &&
      /\b(my face|my hair|me|here)\b/.test(text))
  ) {
    return {
      kind: "dismiss-boundary",
      politeness,
      insulted
    };
  }

  if (/\bwhere\b/.test(text) && /\b(going|headed|heading|path|destination)\b/.test(text)) {
    return {
      kind: "ask-direction",
      politeness,
      insulted
    };
  }

  if (/\bpeace\b/.test(text) && /\b(path|follow|be on|with you)\b/.test(text)) {
    return {
      kind: "blessing-path",
      politeness,
      insulted
    };
  }

  if (
    /\b(want|desire|need|long)\b/.test(text) &&
    /\b(see|look at|look upon|behold)\b/.test(text) &&
    /\b(you|your|eyes|face)\b/.test(text)
  ) {
    return {
      kind: "desire-vision",
      politeness,
      insulted,
      exactEyes: /\beyes\b/.test(text),
      exactFace: /\bface\b/.test(text)
    };
  }

  return {
    kind: "open-meaning",
    politeness,
    insulted
  };
}

function retrievalPackIdsForIntent(intent, query, tokens = []) {
  const text = (query || "").toLowerCase();
  const ids = [];
  const add = (id) => {
    if (RETRIEVAL_PACKS[id] && !ids.includes(id)) ids.push(id);
  };

  switch (intent.kind) {
    case "blessing-path":
      add("blessings");
      add("movement_direction");
      break;
    case "ask-direction":
      add("movement_direction");
      add("requests");
      break;
    case "dismiss-boundary":
      add("boundaries");
      break;
    case "desire-vision":
      add("longing");
      add("affection");
      break;
    case "ask-time":
      add("time_questions");
      add("requests");
      break;
    default:
      break;
  }

  if (/\b(love|affection|beloved|care|heart)\b/.test(text)) add("affection");
  if (/\b(long|yearn|miss|desire|want)\b/.test(text)) add("longing");
  if (/\b(truth|honest|honesty|real|order|balance)\b/.test(text)) add("truth_speaking");
  if (/\b(grief|grieve|fear|terrified|terror|despair|sorrow|sad)\b/.test(text)) add("grief_and_fear");
  if (/\b(go|going|headed|where|path|destination|arrive|toward)\b/.test(text)) add("movement_direction");
  if (/\b(please|can you|could you|would you|speak|price|market)\b/.test(text)) add("requests");
  if (/\b(out of my|away from me|leave me|go away|stop)\b/.test(text)) add("boundaries");
  if (!ids.length && tokens.includes("time")) add("time_questions");

  return ids;
}

function collectRetrievalPacks(intent, query, tokens = []) {
  return retrievalPackIdsForIntent(intent, query, tokens)
    .map((id) => RETRIEVAL_PACKS[id])
    .filter(Boolean);
}

function summarizeRetrievalPacks(packs) {
  if (!packs?.length) return "";
  const titles = packs.map((pack) => pack.title).join(", ");
  return `The builder first looked toward: ${titles}.`;
}

function buildRetrievalFallback(query, culture, intent, packs) {
  if (!packs?.length) return null;
  const leadPack = packs[0];
  const examples = packs.flatMap((pack) => pack.examples || []).slice(0, 3);
  return {
    kind: "retrieval-help",
    retrievalPacks: packs,
    headline: "I do not have a clean full Celan phrasing for this yet.",
    explanation: [
      `This sounds like the \`${leadPack.title}\` family, so the builder did at least look in the right neighborhood before stopping.`,
      leadPack.notes
    ],
    examples,
    culturalNote: `${culture.label} would still shape the tone here, but the deeper phrase pattern needs stronger support before the builder should pretend certainty.`
  };
}

function interpretOpenMeaning(query, exactCanonSupport = new Map()) {
  const text = (query || "").toLowerCase();
  const has = (pattern) => pattern.test(text);
  const concepts = [];

  if (has(/\b(want|desire|need|long|yearn|miss)\b/)) concepts.push("desire");
  if (has(/\b(breathe|breath|air|sky)\b/)) concepts.push("breath-air");
  if (has(/\b(near|close|presence|with you|your air|your breath)\b/)) concepts.push("closeness");
  if (has(/\b(you|your)\b/)) concepts.push("second-person");
  if (has(/\b(please|gently|softly)\b/)) concepts.push("gentle");

  const exactTerms = Array.from(exactCanonSupport.values()).map((item) => item.term.toLowerCase());
  if (exactTerms.includes("esh")) concepts.push("canon-air");
  if (exactTerms.includes("aen")) concepts.push("canon-breath");
  if (exactTerms.includes("thar-ka") || exactTerms.includes("ravokhaen")) concepts.push("canon-desire");

  let family = "open";
  if (concepts.includes("desire") && concepts.includes("breath-air") && concepts.includes("second-person")) {
    family = "intimacy-presence";
  }

  return {
    family,
    concepts,
    poetic: has(/\b(breathe your air|breathe your breath|miss you|long for you)\b/)
  };
}

function buildReasoningEvidence(query, tokens, exactCanonSupport) {
  return {
    exactCanonSupport,
    canonMatches: findCanonMeaningMatches(query, tokens),
    partMatches: findMeaningParts(tokens)
  };
}

function generateReasonedCandidates(query, culture, interpretation, evidence) {
  const candidates = [];
  const cultureId = Object.entries(CULTURAL_LENSES).find(([, value]) => value === culture)?.[0] || "neutral";

  if (interpretation.family === "intimacy-presence") {
    const airTerm = evidence.exactCanonSupport.get("air")?.term || evidence.exactCanonSupport.get("sky")?.term || "Esh";
    const desireTerm = evidence.exactCanonSupport.get("want")?.term || evidence.exactCanonSupport.get("desire")?.term || "thar-ka";
    const breathTerm = evidence.exactCanonSupport.get("breathe")?.term || evidence.exactCanonSupport.get("breath")?.term || "Aen";
    const direct = {
      celan: `${breathTerm} I ${desireTerm.toLowerCase()} anen ${airTerm.toLowerCase()}.`,
      why: `This keeps the English image intact by using canon footing for breath, desire, and air. It treats the phrase as an intimate longing rather than a literal medical statement.`,
      wordSense: [
        `\`${breathTerm}\` = breathe / breath of life`,
        "`I` = I / me",
        `\`${desireTerm.toLowerCase()}\` = want / desire`,
        "`anen` = your / direct possession marker",
        `\`${airTerm.toLowerCase()}\` = air`
      ],
      culturalNote: `${culture.label} can carry this line. The main difference is how lush or restrained the feeling sounds in the voice.`,
      alternate: null,
      score: 10
    };

    const softer = {
      celan: cultureId === "pelagaean" || cultureId === "verdalrisian"
        ? `Ohmaen I an ${airTerm.toLowerCase()}-ya.`
        : `Ohmaen I an ${airTerm.toLowerCase()}-ya.`,
      why: "This softens the image into connection and nearness: not just breath, but the feeling of being within the other person's atmosphere.",
      wordSense: [
        "`Ohmaen` = love / cherish / feel connection",
        "`I` = I / me",
        "`an` = in / within relation to",
        `\`${airTerm.toLowerCase()}-ya\` = your air / atmosphere`
      ],
      culturalNote: `${culture.label} may prefer this version when the feeling matters more than the literal image.`,
      alternate: null,
      score: interpretation.poetic ? 9 : 7
    };

    candidates.push(direct, softer);
  }

  return candidates.sort((a, b) => b.score - a.score);
}

function reasonPhrasePlan(query, culture, tokens, exactCanonSupport) {
  const interpretation = interpretOpenMeaning(query, exactCanonSupport);
  const evidence = buildReasoningEvidence(query, tokens, exactCanonSupport);
  const candidates = generateReasonedCandidates(query, culture, interpretation, evidence);
  if (!candidates.length) return null;
  const chosen = candidates[0];
  return {
    ...chosen,
    kind: "reasoned-open",
    alternate: candidates[1] ? `Alternate turn: \`${candidates[1].celan}\`` : chosen.alternate,
    reasoningTrace: {
      interpretation,
      evidence
    }
  };
}

function phrasePlanForIntent(query, culture, exactCanonSupport = new Map(), tokens = []) {
  const intent = detectPhraseIntent(query);
  const retrievalPacks = collectRetrievalPacks(intent, query, tokens);

  if (intent.kind === "ask-direction") {
    const byCulture = {
      neutral: {
        celan: "ra var ya?",
        why: "This keeps the question simple and action-first: question signpost, movement verb, then the person being asked.",
        wordSense: ["`ra` = question signpost", "`var` = purposeful go / move", "`ya` = you"]
      },
      verdalrisian: {
        celan: "lorin shara ya an Kinnmor, Li-Ser?",
        why: "Verdalrisian speech often treats movement as guidance and path rather than blunt travel.",
        wordSense: ["`lorin` = guide", "`shara` = path", "`ya` = your / you", "`Kinnmor` = morning", "`Li-Ser` = respected friend"]
      },
      pelagaean: {
        celan: "ra shalil ya, Ser?",
        why: "Pelagaean speech often turns movement into flow-language, so going becomes flowing.",
        wordSense: ["`ra` = question signpost", "`shalil` = flow / move fluidly", "`ya` = you", "`Ser` = friend"]
      },
      zarithan: {
        celan: "ra min ya, Ser?",
        why: "Zarithan speech cuts to the practical point. `min` gives the question a more casual, direct edge.",
        wordSense: ["`ra` = question signpost", "`min` = head over / go casually", "`ya` = you", "`Ser` = friend"]
      },
      valkeldorian: {
        celan: "aen shara-ya, Ser!",
        why: "Valkeldorian phrasing can sound more like a demanded accounting of purpose than a soft invitation.",
        wordSense: ["`aen` = speak / state", "`shara-ya` = your path", "`Ser` = friend"]
      },
      mechuman: {
        celan: "aen ya varash, Ser.",
        why: "Mechuman speech prefers exact destination-language over decorative movement imagery.",
        wordSense: ["`aen` = state / speak", "`ya` = your / you", "`varash` = destination / future-directed path", "`Ser` = friend"]
      },
      nivveilian: {
        celan: "an eshreth, ra var ya, Ser?",
        why: "Nivveilian speech often places atmosphere quietly around the sentence rather than over-explaining emotion.",
        wordSense: ["`an eshreth` = in this hazy sky", "`ra` = question signpost", "`var` = go", "`ya` = you", "`Ser` = friend"]
      },
      jasaran: {
        celan: "shal lorin shara-ya an nor-ka, Ser?",
        why: "Jasaran phrasing often balances practical motion with guiding light and present-moment awareness.",
        wordSense: ["`shal` = light", "`lorin` = guide", "`shara-ya` = your path", "`nor-ka` = this moment / temporal frame", "`Ser` = friend"]
      },
      marakorian: {
        celan: "ra rinaen shara-ya lian, Li-Ser?",
        why: "Marakorian speech often turns even simple questions toward propriety, correctness, and formal bearing.",
        wordSense: ["`ra` = question signpost", "`rinaen` = be / exist in essence", "`shara-ya` = your path", "`lian` = true / proper", "`Li-Ser` = respected friend"]
      }
    };
    const chosen = byCulture[Object.keys(CULTURAL_LENSES).find((id) => CULTURAL_LENSES[id] === culture) || "neutral"] || byCulture.neutral;
    return {
      kind: intent.kind,
      celan: chosen.celan,
      why: chosen.why,
      wordSense: chosen.wordSense,
      culturalNote: `${culture.label} favors a ${culture.voice.toLowerCase()} voice here.`,
      alternate: null,
      retrievalPacks
    };
  }

  if (intent.kind === "blessing-path") {
    return {
      kind: intent.kind,
      celan: "vael vaar an shara-ya.",
      why: "Celan already has a graceful poetic structure for path-blessings, so the builder leans on that instead of inventing a harder literal phrasing.",
      wordSense: ["`vael` = wish / may it be", "`vaar` = peace", "`an` = upon / in relation to", "`shara-ya` = your path"],
      culturalNote: culture.label === "Pelagaean" || culture.label === "Verdalrisian"
        ? `${culture.label} especially suits this kind of blessing because it already leans lyrical and relational.`
        : `${culture.label} can still use this line, but it will sound more elevated and ceremonial than ordinary speech.`,
      alternate: null,
      retrievalPacks
    };
  }

  if (intent.kind === "desire-vision") {
    const cultureId = Object.entries(CULTURAL_LENSES).find(([, value]) => value === culture)?.[0] || "neutral";
    const eyeTerm = exactCanonSupport.get("eye")?.term || exactCanonSupport.get("eyes")?.term || "";
    const eyePhrase = eyeTerm ? `anen ${eyeTerm.toLowerCase()}in` : "ya";
    const celan = cultureId === "pelagaean" || cultureId === "verdalrisian"
      ? `Shalaen I thar-ka ${eyePhrase}.`
      : `Shalaen I thar-ka ${eyePhrase}.`;
    const explanation = intent.exactEyes && eyeTerm
      ? `Celan already gives us the canon word \`${eyeTerm}\` for eye, so the builder uses it directly and pluralizes it to carry \`eyes\`.`
      : intent.exactEyes
        ? "Celan can carry this desire cleanly, but the builder still needs a secure canon body-word here before it should get more literal."
      : intent.exactFace
        ? "Celan usually prefers the person over the English body-image here, so the line keeps the desire to see you rather than forcing a face-idiom."
        : "Celan handles this neatly through an action-first sentence with desire marked directly in the clause.";

    return {
      kind: intent.kind,
      celan,
      why: explanation,
      wordSense: [
        "`Shalaen` = see / perceive with light",
        "`I` = I / me",
        "`thar-ka` = by heart's desire / want to",
        ...(intent.exactEyes && eyeTerm
          ? ["`anen` = your / direct possession marker", `\`${eyeTerm.toLowerCase()}in\` = eyes (from \`${eyeTerm}\`)`]
          : ["`ya` = you / your"])
      ],
      culturalNote: `${culture.label} does not need to change the structure much here. The main difference is whether the line lands more direct, more lyrical, or more formal in tone.`,
      alternate: intent.exactEyes && eyeTerm ? "Softer alternate: `Shalaen I thar-ka ya.`" : null,
      retrievalPacks
    };
  }

  if (intent.kind === "dismiss-boundary") {
    const cultureId = Object.entries(CULTURAL_LENSES).find(([, value]) => value === culture)?.[0] || "neutral";
    const movementVerb = culture.movementVerb;
    const useEnemyWord = intent.insulted || cultureId === "zarithan" || cultureId === "valkeldorian";
    const celan = `${movementVerb === "aen" ? "va var" : `va ${movementVerb}`} thal I${useEnemyWord ? ", rath" : ""}.`;
    const alternate = cultureId === "pelagaean" || cultureId === "verdalrisian"
      ? "Softer alternate: `va shalil thal I.`"
      : (cultureId === "zarithan" ? "Softer alternate: `va min thal I.`" : null);

    return {
      kind: intent.kind,
      celan,
      why: "Celan does not naturally keep the English face-idiom. Instead, it makes the social action explicit: move away from me. When the English carries insult, the phrasing can sharpen that boundary with `rath` (enemy / hostile one).",
      wordSense: [
        `\`${movementVerb === "aen" ? "va var" : `va ${movementVerb}`}\` = command + movement`,
        "`thal` = from / away from",
        "`I` = me / I",
        ...(useEnemyWord ? ["`rath` = enemy / hostile one"] : [])
      ],
      culturalNote: `${culture.label} shapes the command through ${culture.voice.toLowerCase()} voice. ${culture.courtesy}`,
      alternate,
      retrievalPacks
    };
  }

  if (intent.kind === "ask-time") {
    return {
      kind: intent.kind,
      celan: "I do not have a settled current-time line yet.",
      why: "The builder recognizes this as a time-question family, but the current phrase support does not yet give it a trustworthy ready-made answer for asking the present time directly.",
      wordSense: [
        "`Nor` = time / the flow of events",
        "`Kinnlin` = noon / daylight culmination"
      ],
      culturalNote: `${culture.label} can shape tone around this kind of question, but the missing piece right now is the stable question pattern itself, not the culture lens.`,
      alternate: null,
      retrievalPacks,
      unresolved: true
    };
  }

  if (intent.kind === "open-meaning") {
    const reasoned = reasonPhrasePlan(query, culture, tokens, exactCanonSupport);
    if (reasoned) {
      reasoned.retrievalPacks = retrievalPacks;
    }
    return reasoned;
  }

  return null;
}

function analyzeForgeTerm(rawTerm, culture) {
  const query = (rawTerm || "").trim();
  if (!query) return null;

  const tokens = tokenizeMeaningQuery(query);
  const exactCanonSupport = findExactCanonSupport(tokens);

  const phrasePlan = phrasePlanForIntent(query, culture, exactCanonSupport, tokens);
  if (phrasePlan) {
    return {
      mode: "phrase",
      query,
      phrasePlan,
      canonMatches: findCanonMeaningMatches(query, tokens),
      exactCanonSupport
    };
  }

  const intent = detectPhraseIntent(query);
  const retrievalPacks = collectRetrievalPacks(intent, query, tokens);
  const retrievalFallback = buildRetrievalFallback(query, culture, intent, retrievalPacks);
  if (retrievalFallback) {
    return {
      mode: "retrieval-help",
      query,
      retrievalFallback,
      canonMatches: findCanonMeaningMatches(query, tokens),
      exactCanonSupport
    };
  }

  const exactHeadword = state.groupedEntries.find((group) => normalizeHeadword(group.term) === normalizeHeadword(query));
  if (exactHeadword) {
    return {
      mode: "headword",
      query,
      exact: exactHeadword,
      parallelForms: findParallelForms(query),
      segmentation: segmentForgeTerm(query, state.forgeParts)
    };
  }

  const canonMatches = findCanonMeaningMatches(query, tokens);
  const partMatches = findMeaningParts(tokens);
  const buildIdeas = buildMeaningIdeas(partMatches);

  return {
    mode: "meaning",
    query,
    tokens,
    canonMatches,
    partMatches,
    buildIdeas
  };
}

function renderForgeIdle() {
  els.forgeOutput.textContent = "Type a phrase, press send, and the builder will shape it into Celan.";
}

function renderForgeLoading() {
  els.forgeOutput.innerHTML = `
    <div class="forge-panel">
      <span class="forge-subhead">Working</span>
      <div class="forge-block">Celan is shaping the phrase in the background...</div>
    </div>
  `;
}

function renderForge() {
  const raw = (state.forgeLastSubmitted || "").trim();
  const culture = selectedCultureLens();
  if (!raw) {
    renderForgeIdle();
    return;
  }
  const analysis = analyzeForgeTerm(raw, culture);
  if (!analysis) {
    renderForgeIdle();
    return;
  }

  const blocks = [];
  const pushPanel = (title, body) => {
    blocks.push(`<div class="forge-panel"><span class="forge-subhead">${title}</span>${body}</div>`);
  };
  if (analysis.mode === "phrase") {
    const plan = analysis.phrasePlan;
    const explanationBits = [plan.why, plan.culturalNote];
    const retrievalSummary = summarizeRetrievalPacks(plan.retrievalPacks);
    if (retrievalSummary) {
      explanationBits.push(retrievalSummary);
    }
    if (plan.wordSense?.length) {
      explanationBits.push(`Key words: ${plan.wordSense.map((line) => line.replace(/`/g, "")).join(" • ")}`);
    }
    if (plan.alternate) {
      explanationBits.push(`Alternate turn: ${plan.alternate.replace(/`/g, "")}`);
    }
    if (analysis.canonMatches?.length) {
      explanationBits.push(`Canon footing nearby: ${analysis.canonMatches.slice(0, 3).map((item) => item.group.term).join(", ")}`);
    }

    pushPanel("Translation", `<div class="forge-phrase">${formatRuleText(plan.celan)}</div>`);
    pushPanel("Explanation", explanationBits.map((bit) => `<div class="forge-block">${formatRuleText(bit)}</div>`).join(""));
  } else if (analysis.mode === "retrieval-help") {
    const help = analysis.retrievalFallback;
    const explanationBits = [...help.explanation, help.culturalNote];
    if (help.examples?.length) {
      explanationBits.push(`Closest support examples: ${help.examples.map((example) => `${example.celan} (${example.english})`).join(" • ")}`);
    }
    pushPanel("Translation", `<div class="forge-phrase">${formatRuleText(help.headline)}</div>`);
    pushPanel("Explanation", explanationBits.map((bit) => `<div class="forge-block">${formatRuleText(bit)}</div>`).join(""));
  } else if (analysis.mode === "headword") {
    const types = uniqueStrings(analysis.exact.uses.map((use) => use.type));
    const meanings = uniqueStrings(analysis.exact.uses.map((use) => use.meaning)).slice(0, 4);
    pushPanel("Translation", `<div class="forge-phrase">${formatRuleText(analysis.exact.term)}</div>`);
    const explanationBits = [
      "This word already exists in the current Celan dictionary, so the builder does not need to invent a new phrasing first.",
      `Known as: ${types.join(", ") || "Dictionary entry"}`,
      `Meaning: ${meanings.join(" / ")}`
    ];
    if (analysis.parallelForms.length) {
      explanationBits.push(`Parallel forms: ${analysis.parallelForms.join(", ")}`);
    }
    const knownTokens = analysis.segmentation.tokens.filter((token) => token.type !== "Unknown");
    if (knownTokens.length) {
      explanationBits.push(`Known parts: ${knownTokens.map((token) => `${token.text}${token.meaning ? ` (${token.type}: ${token.meaning})` : ` (${token.type})`}`).join(" + ")}`);
    }
    pushPanel("Explanation", explanationBits.map((bit) => `<div class="forge-block">${formatRuleText(bit)}</div>`).join(""));
  } else {
    pushPanel("Translation", `<div class="forge-phrase">I do not have a clean Celan phrasing for this yet.</div>`);
    const explanationBits = [
      "Right now the builder does not understand this phrase well enough to give you a trustworthy line. I hid the old parts-dump so it does not pretend otherwise."
    ];
    if (analysis.canonMatches.length) {
      explanationBits.push(`Closest footing nearby: ${analysis.canonMatches.slice(0, 3).map((item) => {
        const meaning = item.use?.meaning || item.group.preview || "";
        return `${item.group.term}${meaning ? ` (${meaning})` : ""}`;
      }).join(" • ")}`);
    }
    if (analysis.buildIdeas.length) {
      explanationBits.push(`Possible direction later: ${analysis.buildIdeas.slice(0, 2).map((idea) => `${idea.suggestion} (${idea.meaning})`).join(" • ")}`);
    } else {
      explanationBits.push("Try a shorter emotional core or a simpler action first while we teach the builder more phrase types.");
    }
    pushPanel("Explanation", explanationBits.map((bit) => `<div class="forge-block">${formatRuleText(bit)}</div>`).join(""));
  }

  els.forgeOutput.innerHTML = blocks.join("");
}

async function submitForge() {
  const raw = (els.forgeInput.value || "").trim();
  state.forgeLastSubmitted = raw;
  if (!raw) {
    renderForgeIdle();
    return;
  }
  state.forgeIsLoading = true;
  if (els.forgeSubmitBtn) {
    els.forgeSubmitBtn.disabled = true;
    els.forgeSubmitBtn.textContent = "Working...";
  }
  renderForgeLoading();
  await new Promise((resolve) => window.setTimeout(resolve, 150));
  renderForge();
  state.forgeIsLoading = false;
  if (els.forgeSubmitBtn) {
    els.forgeSubmitBtn.disabled = false;
    els.forgeSubmitBtn.textContent = "Send";
  }
}

function buildRulePreview(rule) {
  const sample = ((rule.original_wording || "").trim() || (rule.examples || "").trim())
    .replace(/●/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!sample) return "Grammar rule";
  const sentence = sample.match(/^[^.!?]+[.!?]?/);
  return (sentence ? sentence[0] : sample).trim();
}

function friendlyRuleCategory(rawCategory) {
  const category = (rawCategory || "").toLowerCase();
  if (category.includes("phonology") || category.includes("phonetics")) return "Pronunciation";
  if (category.includes("orthography")) return "Writing Conventions";
  if (category.includes("syntax") || category.includes("complex syntax") || category.includes("questions/imperatives") || category.includes("conditionals")) return "Sentence Structure";
  if (category.includes("morphology") || category.includes("derivation")) return "Word Building";
  if (category.includes("usage") || category.includes("politeness")) return "Usage and Register";
  if (
    category.includes("pronouns") ||
    category.includes("possession") ||
    category.includes("prepositions") ||
    category.includes("case markers") ||
    category.includes("articles") ||
    category.includes("quantification") ||
    category.includes("numbering") ||
    category.includes("math") ||
    category.includes("tense/aspect") ||
    category.includes("negation") ||
    category.includes("modality") ||
    category.includes("mood") ||
    category.includes("passive voice") ||
    category.includes("conjunctions")
  ) return "Grammar Tools";
  return "Grammar Tools";
}

function shortRulePurpose(rule) {
  const name = (rule.rule_name || "").toLowerCase();
  const group = friendlyRuleCategory(rule.category);
  if (name.includes("vowel")) return "How Celan vowel sounds should land in the mouth.";
  if (name.includes("verb-subject-object") || name.includes("vso")) return "The default action-first word order for a sentence.";
  if (name.includes("plural")) return "How Celan turns one thing into many.";
  if (name.includes("politeness")) return "How respect and social distance change phrasing.";
  if (name.includes("possess")) return "How ownership and belonging are marked.";
  if (name.includes("preposition")) return "How Celan handles relation, direction, place, and position.";
  if (name.includes("math")) return "How Celan expresses addition and subtraction in number phrases.";
  if (name.includes("question")) return "How Celan asks, commands, and pushes a sentence forward.";
  if (name.includes("conditional")) return "How Celan sets up if-then logic and possibility.";
  if (name.includes("article")) return "How Celan marks definiteness and indefiniteness.";
  if (name.includes("conjunction")) return "How Celan links words, clauses, and ideas together.";
  if (name.includes("euphony")) return "When sounds shift to keep Celan flowing well.";
  if (group === "Pronunciation") return "How this sound pattern is meant to be spoken.";
  if (group === "Sentence Structure") return "How this sentence pattern is meant to work.";
  if (group === "Word Building") return "How parts combine to build new meaning.";
  if (group === "Usage and Register") return "How social tone and cultural nuance shape this form.";
  return "How this part of Celan is meant to work.";
}

function existingHeadwords(terms) {
  const known = new Set(state.groupedEntries.map((group) => group.term));
  return terms.filter((term, index, all) => term && known.has(term) && all.indexOf(term) === index);
}

function createSyntheticRule(entry) {
  return {
    ...entry,
    synthetic: true,
    preview: buildRulePreview(entry),
    searchText: [
      entry.id,
      entry.rule_name,
      entry.category,
      entry.displayCategory,
      entry.original_wording,
      entry.examples,
      entry.notes,
      ...(entry.relatedHeadwords || [])
    ].join(" ").toLowerCase()
  };
}

function makeGuideSection(title, body, list) {
  return { title, body, list };
}

function buildSyntheticRuleEntries(rawById) {
  const synthetic = [];
  const consumed = new Set();

  function take(id) {
    consumed.add(id);
    return rawById.get(id);
  }

  const vowels = take("GR-V1-0001");
  const consonants = take("GR-V1-0002");
  const pronunciationRules = take("GR-V1-0003");
  const euphony1 = take("GR-S1-0001");
  const euphony2 = take("GR-S1-0002");
  const euphony3 = take("GR-S1-0003");
  const euphony4 = take("GR-S1-0004");
  const euphony5 = take("GR-S1-0005");
  if (vowels && consonants && pronunciationRules && euphony1 && euphony2 && euphony3 && euphony4 && euphony5) {
    synthetic.push(createSyntheticRule({
      id: "RG-PRONUNCIATION",
      rule_name: "The Phonetics of Celan: Clarity, Flow, and Euphony",
      category: "Phonetics + advanced phonology",
      displayCategory: "Pronunciation",
      purpose: "Clarity, flow, and euphony.",
      original_wording: [
        "Celan balances the firmness of its structure with the smooth flow of its breath.",
        "Its sound system depends on clear vowels, supportive consonants, and euphonic smoothing when a compound grows too harsh."
      ].join("\n"),
      guideSections: [
        makeGuideSection(
          "The Core Philosophy of Sound",
          "Say Celan cleanly and distinctly. The language balances the firmness of its structure with the smooth flow of its breath, avoiding swallowed syllables, English-style silent letters, or complex tonal variations. The sound should remain stable across contexts rather than becoming overly decorative or dramatic."
        ),
        makeGuideSection(
          "The Anchor Vowels",
          "Vowels in Celan are long and flowing, symbolizing natural forces like water, air, and light. They stay open and clear, and they are the first sounds a new reader should learn well.",
          [
            '`A` = "ah" as in "father"',
            '`E` = "eh" as in "bed"',
            '`I` = "ee" as in "machine"',
            '`O` = "oh" as in "go"',
            '`U` = "oo" as in "flu"'
          ]
        ),
        makeGuideSection(
          "The Supportive Consonants",
          "Consonants provide the grounded structure of the language. K, T, S, and R are especially frequent, giving Celan its sharp, defined clarity and supporting the flowing vowels."
        ),
        makeGuideSection(
          "The Rule of Euphony (Sound-Smoothing)",
          "When fusing roots creates a harsh or clumsy consonant cluster, Celan inserts a smoothing vowel, usually a, to maintain rhythmic flow. How and when this happens depends on the severity of the cluster and the cultural style of the speaker.",
          [
            {
              title: "Mandatory Smoothing (Tier 1)",
              copy: "Harsh, repetitive, or dissonant clusters must be broken up. `Morl` + `Thar` -> `Morlathar`; `Rath` + `Thar` -> `Rathathar`; `Vok` + `Thal` -> `Vokathar`."
            },
            {
              title: "Stylistic Contrast (Tier 2)",
              copy: "For clunky but pronounceable clusters, smoothing becomes a cultural choice. A pragmatic Zarithan or Valkeldorian may prefer `Krezthal` or `Belshara`, while a poetic Pelagaean or Verdalrisian may prefer `Krezathal` or `Belashara`."
            },
            {
              title: "Never Smoothed (Tier 3)",
              copy: "Naturally smooth clusters stay untouched, and ancient phonetic fossils remain unchanged. Smooth: `Kalvok`, `Kalrath`, `Rethlian`. Fossils: `Belthal`, `Rethvok`."
            }
          ]
        ),
        makeGuideSection(
          "Canonical Pronunciation Examples",
          "Pronounce each syllable distinctly to keep the rhythmic quality of the language audible.",
          [
            "`Aen` -> ah-ehn",
            "`Azan` -> ah-zahn",
            "`Pelagae` -> peh-lah-gah-eh",
            "`Shaleth` -> shah-leth",
            "`Belshara` -> bel-shah-rah",
            "`Morlathar` -> mor-lah-thar"
          ]
        )
      ],
      examples: "",
      notes: "",
      relatedHeadwords: existingHeadwords(["Aen", "Azan", "Pelagae", "Shaleth", "Belshara", "Morlathar"]),
      related_entry_ids: "",
      source_volume: vowels.source_volume,
      source_section: "Pronunciation",
      page_number: vowels.page_number,
      canon_status: "Canon"
    }));
  }

  const numbers = take("GR-V3-0007");
  const math = take("GR-V3-0008");
  if (numbers && math) {
    synthetic.push(createSyntheticRule({
      id: "RG-NUMBERS-MATH",
      rule_name: "Numbers and Basic Math",
      category: "Numbering + Math",
      displayCategory: "Grammar Tools",
      purpose: "How Celan counts, scales numbers, and handles simple arithmetic.",
      original_wording: [
        "Celan starts with a base set of number words, then builds upward with prefixes for tens, hundreds, thousands, and beyond.",
        "Addition is usually shown by additive number building, while subtraction uses the marker Ven between number forms."
      ].join("\n"),
      examples: [
        "Base numbers: Verin (0), Unar (1), Del (2), Tren (3), Quen (4), Peth (5), Senar (6), Sethe (7), Oven (8), Nevar (9), Tenar (10)",
        "Tens: Ten-del = 20",
        "Mixed number: Tenar unar = 11",
        "Hundreds: Hek-unar = 100",
        "Thousands: Mel-unar = 1,000",
        "Ten-thousands: Fen-unar = 10,000",
        "Hundred-thousands: Hek-Mel-unar = 100,000",
        "Addition: Hek-quen Ten-peth = 450 (400 + 50)",
        "Subtraction: Hek-quen Ven Hek-del = 400 - 200 = 200"
      ].join("\n"),
      notes: "",
      relatedHeadwords: existingHeadwords(["Verin", "Unar", "Del", "Tren", "Quen", "Peth", "Senar", "Sethe", "Oven", "Nevar", "Tenar", "Hek-", "Mel-", "Fen-", "Hek-Mel-"]),
      related_entry_ids: "",
      source_volume: numbers.source_volume,
      source_section: "Numbering System and Basic Math in Celan",
      page_number: numbers.page_number,
      canon_status: "Canon"
    }));
  }

  const basicPreps = take("GR-V1-0018");
  const spatialPrep = take("GR-V1-0019");
  if (basicPreps && spatialPrep) {
    synthetic.push(createSyntheticRule({
      id: "RG-PREPOSITIONS",
      rule_name: "The Architecture of Relation: Prepositions, Place, and Time",
      category: "Prepositions",
      displayCategory: "Grammar Tools",
      purpose: "How Celan uses prepositions as the structural joints of relation, place, and time.",
      original_wording: [
        "Because Celan relies on a strict Verb-Subject-Object flow, prepositions do immense structural work.",
        "They act as the architectural joints of a sentence, defining movement, accompaniment, absence, elevation, location, and temporal setting."
      ].join("\n"),
      guideSections: [
        makeGuideSection(
          "The Structural Role of Prepositions",
          "In Celan, prepositions do an immense amount of structural work. Because the language relies on a strict Verb-Subject-Object flow, these small forms act as the architectural joints of a sentence, defining the precise nature of movement, accompaniment, absence, and elevation."
        ),
        makeGuideSection(
          "The Core Relational Prepositions",
          "These are the primary markers a new learner should recognize first to navigate the world.",
          [
            { title: "var", copy: "to, towards — direction or movement toward a destination." },
            { title: "ser", copy: "with — accompaniment or shared presence." },
            { title: "thal", copy: "from, out of — origin, or movement away from a source." },
            { title: "ka", copy: "without — absence, lack, or separation from something." },
            { title: "esh", copy: "above, over — elevation or superior positioning." },
            { title: "morl", copy: "under, beneath — positioned below or physically grounded." }
          ]
        ),
        makeGuideSection(
          "The Great Distinction: Space vs. Time",
          "A common trap for beginners is treating location and time as interchangeable because languages like English often reuse the same small words. Celan demands precision, separating the physical realm from the temporal flow.",
          [
            { title: "an (Place)", copy: "strictly used for physical or spatial location: at, in, into." },
            { title: "nor (Time)", copy: "strictly used for temporal settings: at, during, in the time of." }
          ]
        ),
        makeGuideSection(
          "Canonical examples",
          null,
          [
            "var dren. — To the water.",
            "var I ser ser. — I go with a friend.",
            "tha-var la thal Terra. — They went from the Earth.",
            "var I ka shal. — I go without light.",
            "moraen I an Varthas. — I stand at the city.",
            "nor-var I nor Kinnmor. — I will go in the morning.",
            "var I esh dren. — I go above the water.",
            "var I morl dren. — I go beneath the water."
          ]
        ),
        makeGuideSection(
          "What to notice",
          "Celan is not trying to be ambiguous. The strict separation of an and nor ensures that even in complex or poetic sentences, the listener always knows where the action is grounded and when it is flowing."
        )
      ],
      examples: "",
      notes: "",
      relatedHeadwords: existingHeadwords(["Var", "Ser", "Thal", "Ka", "An", "Nor", "Esh", "Morl"]),
      related_entry_ids: "",
      source_volume: basicPreps.source_volume,
      source_section: "Prepositions and Case Markers",
      page_number: basicPreps.page_number,
      canon_status: "Canon"
    }));
  }

  const vso = take("GR-V1-0004");
  const vsoPhilosophy = take("GR-S4A-0001");
  if (vso && vsoPhilosophy) {
    synthetic.push(createSyntheticRule({
      id: "RG-VSO",
      rule_name: "Action-First Sentence Structure",
      category: "Syntax + cultural grammar",
      displayCategory: "Sentence Structure",
      purpose: "How Celan builds a default sentence and why that order matters.",
      original_wording: [
        "Celan primarily follows Verb-Subject-Object (VSO) order.",
        "This action-first structure reflects a worldview that foregrounds movement, relation, and what is being done before who is doing it."
      ].join("\n"),
      examples: [
        'Var I dren. — "I go to the water."',
        'Var Kadron an morl.',
        'Rinaen Terra vaar.',
        'Ohmaen I Ya.'
      ].join("\n"),
      notes: "",
      relatedHeadwords: existingHeadwords(["Var", "Rinaen", "Ohmaen"]),
      related_entry_ids: "",
      source_volume: vso.source_volume,
      source_section: "Basic Sentence Structure and Syntax Philosophy",
      page_number: vso.page_number,
      canon_status: "Canon"
    }));
  }

  const formQuestions = take("GR-V1-0005");
  const questionImperative = take("GR-V1-0016");
  if (formQuestions && questionImperative) {
    synthetic.push(createSyntheticRule({
      id: "RG-QUESTIONS-COMMANDS",
      rule_name: "Questions and Commands",
      category: "Questions/Imperatives",
      displayCategory: "Sentence Structure",
      purpose: "How Celan asks, negates a question, and gives a command.",
      original_wording: [
        "Start ordinary questions with Ra.",
        "For a negative question, place Ver before the verb.",
        "For a direct command, start the sentence with Va."
      ].join("\n"),
      examples: [
        'Ra var Ser? — "Where does the friend go?"',
        'Ra ver var Ser? — "Does the friend not go?"',
        'Va var dren! — "Go to the water!"'
      ].join("\n"),
      notes: "",
      relatedHeadwords: existingHeadwords(["Ra", "Va", "Ver"]),
      related_entry_ids: "",
      source_volume: formQuestions.source_volume,
      source_section: "Questions and Imperatives",
      page_number: formQuestions.page_number,
      canon_status: "Canon"
    }));
  }

  const cap1 = take("GR-S4B-0001");
  const cap2 = take("GR-S4B-0002");
  const cap3 = take("GR-S4B-0003");
  const cap4 = take("GR-S4B-0004");
  const cap5 = take("GR-S4B-0005");
  if (cap1 && cap2 && cap3 && cap4 && cap5) {
    synthetic.push(createSyntheticRule({
      id: "RG-CAPS",
      rule_name: "Capitalization and Emphasis",
      category: "Orthography",
      displayCategory: "Writing Conventions",
      purpose: "How Celan uses capitalization for structure, sacred weight, names, and emotional emphasis.",
      original_wording: [
        "Celan normally begins sentences with lowercase unless the opening word already qualifies for capitalization.",
        "Capitals are used for archetypal concepts, names, nations, specific titles, the pronoun I, and sometimes for poetic or emotional emphasis."
      ].join("\n"),
      examples: [
        "Sentence start: var I an dren. (not Var I an dren.)",
        "Archetypal concepts: Terra vs. terra; Dral vs. dral; Rathor vs. rathor",
        "Names and titles: Velmarin; Eh'lara; Ka'tharyn",
        'Pronoun I: I',
        'Poetic emphasis: Standard "Ohmaen I an thar-ka." / Poetic "Rinaen I an Thar-ka."'
      ].join("\n"),
      notes: "",
      relatedHeadwords: existingHeadwords(["I", "Terra", "Dral", "Rathor"]),
      related_entry_ids: "",
      source_volume: cap1.source_volume,
      source_section: "Capitalization and Emphasis",
      page_number: cap1.page_number,
      canon_status: "Canon"
    }));
  }

  return { synthetic, consumed };
}

function buildRuleEntries(rows) {
  const rawEntries = rows
    .filter((row) => (row.canon_status || "").toLowerCase() === "canon")
    .map((row) => ({
      ...row,
      id: row.entry_id,
      displayCategory: friendlyRuleCategory(row.category),
      purpose: shortRulePurpose(row),
      preview: buildRulePreview(row),
      searchText: [
        row.entry_id,
        row.rule_name,
        row.category,
        friendlyRuleCategory(row.category),
        row.source_section,
        row.original_wording,
        row.examples,
        row.notes
      ].join(" ").toLowerCase()
    }));
  const rawById = new Map(rawEntries.map((entry) => [entry.id, entry]));
  const { synthetic, consumed } = buildSyntheticRuleEntries(rawById);
  const remainingRaw = rawEntries.filter((entry) => !consumed.has(entry.id));
  const lessonMapped = [...synthetic, ...remainingRaw].map((rule) => ({
    ...rule,
    lessonId: assignRuleLesson(rule)
  }));
  return [
    ...buildLessonOverviewEntries(lessonMapped),
    ...buildCompanionPageEntries(),
    ...lessonMapped
  ];
}

function assignRuleLesson(rule) {
  const text = `${rule.rule_name || ""} ${rule.category || ""} ${rule.displayCategory || ""} ${rule.source_section || ""}`.toLowerCase();
  if (
    rule.id === "RG-PRONUNCIATION" ||
    text.includes("phonetic") ||
    text.includes("phonology") ||
    text.includes("pronunciation") ||
    text.includes("vowel") ||
    text.includes("consonant") ||
    text.includes("euphony")
  ) return "LESSON-PRONUNCIATION";

  if (
    rule.id === "RG-VSO" ||
    rule.id === "RG-QUESTIONS-COMMANDS" ||
    text.includes("syntax") ||
    text.includes("question") ||
    text.includes("command") ||
    text.includes("imperative") ||
    text.includes("negation") ||
    text.includes("conditional") ||
    text.includes("tense") ||
    text.includes("aspect") ||
    text.includes("comparative") ||
    text.includes("superlative") ||
    text.includes("passive voice") ||
    text.includes("complex syntax")
  ) return "LESSON-SENTENCE-SHAPE";

  if (
    text.includes("morphology") ||
    text.includes("derivation") ||
    text.includes("compound") ||
    text.includes("plural") ||
    text.includes("suffix") ||
    text.includes("prefix") ||
    text.includes("modality") ||
    text.includes("mood")
  ) return "LESSON-WORD-BUILDING";

  if (
    rule.id === "RG-PREPOSITIONS" ||
    text.includes("possess") ||
    text.includes("preposition") ||
    text.includes("case marker") ||
    text.includes("relation") ||
    text.includes("ian") ||
    text.includes("-esh")
  ) return "LESSON-POSSESSION-RELATION";

  if (
    rule.id === "RG-NUMBERS-MATH" ||
    text.includes("number") ||
    text.includes("math") ||
    text.includes("quantif") ||
    text.includes("article")
  ) return "LESSON-NUMBER-MEASURE";

  if (
    text.includes("politeness") ||
    text.includes("gender") ||
    text.includes("cultural") ||
    text.includes("poetic") ||
    text.includes("clusivity") ||
    text.includes("dual number") ||
    text.includes("pronoun")
  ) return "LESSON-GENDER-ADDRESS-SOCIAL";

  if (
    rule.id === "RG-CAPS" ||
    text.includes("orthography") ||
    text.includes("capitalization") ||
    text.includes("lowercase") ||
    text.includes("emphasis") ||
    text.includes("writing convention")
  ) return "LESSON-WRITING-CONVENTIONS";

  return "LESSON-SENTENCE-SHAPE";
}

function lessonMeta(lessonId) {
  return RULE_LESSONS.find((lesson) => lesson.id === lessonId);
}

function companionMeta(companionId) {
  return RULE_COMPANIONS.find((page) => page.id === companionId);
}

function resolveLessonSelection(lessonId) {
  const lesson = lessonMeta(lessonId);
  return lesson?.featuredRuleId || lessonId;
}

function lessonPageContent(lesson, childTitles) {
  if (lesson.id === "LESSON-SENTENCE-SHAPE") {
    return {
      ruleName: "Sentence Shape: How Celan Moves",
      purpose: "How Celan moves through action, questions, commands, negation, and conditions.",
      guideSections: [
        makeGuideSection(
          "The Core Idea: Action Comes First",
          "In Celan, what is happening is always more important than who is doing it. The language focuses on the event itself. When you speak Celan, you are not just an individual forcing your will on the world; you are a participant in a larger action."
        ),
        makeGuideSection(
          "Default Word Order: Verb-Subject-Object (VSO)",
          "Because the action is the most important part of the story, a standard Celan sentence begins with the Verb, then the Subject, and finally the Object or destination.",
          [
            "English: I go to the water. (Actor -> Action -> Target)",
            "Celan: `Go I to the water.` (Action -> Actor -> Target)"
          ]
        ),
        makeGuideSection(
          "Forming Questions and Commands",
          "Celan keeps sentence-shaping simple. Instead of relying on tone or heavy rearrangement, it places a small signpost word at the very beginning of the sentence to announce its shape.",
          [
            "Questions: place `ra` at the start of the sentence to make it a question.",
            "Commands: place `va` at the start of the sentence to give an instruction or command."
          ]
        ),
        makeGuideSection(
          "Negation (Saying \"No\" or \"Not\")",
          "To make a sentence negative, place `ver` directly in front of the verb. In a negative question, `ver` slides between the question signpost `ra` and the verb."
        ),
        makeGuideSection(
          "Conditionals (\"If\" sentences)",
          "To say if, place `rath` at the beginning of the sentence. This tells the listener that the action is conditional or hypothetical."
        ),
        makeGuideSection(
          "What to Notice",
          null,
          [
            {
              title: "The action arrives before the actor",
              copy: "Because the verb comes first, your listener knows what is happening before they know who is involved."
            },
            {
              title: "Signposts are structural",
              copy: "Words like `ra` and `va` are not decorative. They sit at the front of the sentence to frame what is about to happen before the action even arrives."
            },
            {
              title: "The lowercase rule still applies",
              copy: "Sentences begin with lowercase unless the first word is a name, a grand concept, or the pronoun `I`. Because of this, signposts like `ra`, `va`, `rath`, and `ver` will usually be lowercase."
            }
          ]
        )
      ],
      examples: [
        "Plain VSO Sentence: `var I an dren.` (I go to the water.)",
        "Question: `ra var ser?` (Where does the friend go?)",
        "Negative Question: `ra ver var ser?` (Does the friend not go?)",
        "Command: `va var dren!` (Go to the water!)",
        "Conditional Pair: `rath var ser, nor-var I an dren.` (If the friend goes, I will go to the water.)"
      ].join("\n")
    };
  }

  if (lesson.id === "LESSON-WORD-BUILDING") {
    return {
      ruleName: "Word Building: How Celan Grows Words",
      purpose: "How roots, compounds, suffixes, and sound-shaping grow Celan words from core ideas.",
      guideSections: [
        makeGuideSection(
          "The Core Idea: Roots as Seeds",
          "In Celan, words are not random strings of letters. The language is built like a set of blocks. Every word starts with a Root, a core and powerful idea. Think of a root as the seed of the meaning. For example, `Krez` means Fire or Heat, and `Dren` means Water. Every word you build from these seeds carries a piece of that original meaning."
        ),
        makeGuideSection(
          "Compounding (Smashing Ideas Together)",
          "To make a new concept, you simply fuse two roots together into one single word. The main idea goes first, and the descriptive idea goes second.",
          [
            "Important Rule: We do not use hyphens to fuse roots together. They are completely merged.",
            "Example: `Morl` (Mountain) + `Dren` (Water) seamlessly becomes `Morldren` (Waterfall).",
            "Example: `Bel` (Binding / weaving) + `Shara` (Path / journey) becomes `Belshara` (woven path / structured journey)."
          ]
        ),
        makeGuideSection(
          "Derivation (Adding Suffixes and Prefixes)",
          "You can attach small grammatical tags to a root to change how the word behaves.",
          [
            "Making Verbs: Add the suffix `-aen` to turn a noun into an action. `Dren` (Water) becomes `drenaen` (To drink).",
            "Time Travel (Tense): While English uses separate words like will or did, Celan builds time directly onto the verb using a hyphen. Add `nor-` for the future or `tha-` for the past. `var` (go) becomes `nor-var` (will go)."
          ]
        ),
        makeGuideSection(
          "Pluralization (Making Things Plural)",
          "Making a word plural in Celan is incredibly simple. If the word ends in a consonant, add `-in`. If it ends in a vowel, add `-n`.",
          [
            "Example: `Ser` (Friend) becomes `serin` (Friends).",
            "If a noun already ends in a vowel, the plural stays light: you simply add `-n`."
          ]
        ),
        makeGuideSection(
          "The Magic of `-eth`",
          "This is one of the most important suffixes in the language. Adding `-eth` to a word means having the quality of or the essence of. It is the easiest way to turn a noun into a descriptive adjective.",
          [
            "Example: `Kal` (Strength) becomes `kaleth` (Strong).",
            "Example: `Wor` (Abundance) becomes `woreth` (Full / abundant)."
          ]
        ),
        makeGuideSection(
          "What to Notice",
          null,
          [
            {
              title: "Valid builds vs. canon",
              copy: "Because Celan is a language of building blocks, you can mathematically combine almost any two roots into a valid build. However, native speakers have culturally agreed-upon canon forms."
            },
            {
              title: "Sound smoothing (Euphony)",
              copy: "If smashing two roots together creates an ugly, clunky consonant sound, Celan inserts a smoothing vowel, usually a, to make it flow beautifully. For example, `Morl` + `Thar` becomes the smooth `morlathar`, not the clunky `morlthar`."
            },
            {
              title: "Culture shapes the word",
              copy: "Different nations build the exact same word differently. A tough, practical warrior from the desert might skip the smoothing vowel entirely because they prefer harsh sounds, while an elegant poet from the ocean will always smooth the word out."
            }
          ]
        )
      ],
      examples: [
        "One Clean Compound: `Morldren` (Waterfall) (Built from `Morl` / Mountain + `Dren` / Water)",
        "One Suffix-Based Derivation: `Shalaen` (To see) (Built from `Shal` / Light + `-aen` / action suffix)",
        "One Plural Form: `Serin` (Friends) (Built from `Ser` / Friend + `-in` / plural suffix)",
        "One `-eth` Form: `Woreth` (Full / Abundant) (Built from `Wor` / Abundance + `-eth` / having the quality of)",
        "One \"Same Idea, Different Build\" Contrast: To say Dynamic Equilibrium (balancing a fierce, fiery energy):",
        "A tough Valkeldorian warrior builds it harsh: `Krezthal`.",
        "A poetic Jasaran philosopher builds it smooth: `Krezathal`."
      ].join("\n")
    };
  }

  if (lesson.id === "LESSON-POSSESSION-RELATION") {
    return {
      ruleName: "Possession and Relation: How Celan Connects the World",
      purpose: "How Celan distinguishes ownership, belonging, and relation between people, things, and places.",
      guideSections: [
        makeGuideSection(
          "The Core Idea: The Philosophy of Relation",
          "In Celan, you do not just own the world around you; you are woven into it. The language makes a distinction between things you actually possess and people or places you are simply connected to. Possession is not about dominance. It is about defining your place in the network of life."
        ),
        makeGuideSection(
          "Direct Ownership (ian)",
          "When you want to show clear, personal possession of something, you use `ian` (my). You place it right before the thing you own. This is used for everyday objects, your physical home, or your own thoughts and feelings.",
          [
            "Example: `ian tera` (my home).",
            "Example: `ian morlak` (my bread)."
          ]
        ),
        makeGuideSection(
          "Relational Belonging (The `-esh` Suffix)",
          "You cannot truly own another person, so Celan offers a softer, more respectful way to show that someone belongs in your life. By attaching `-esh` to the end of a word, you show a deep relational tie. It translates closer to connected to me or bonded to rather than mine.",
          [
            "Example: `kadron-esh` (the man connected to me).",
            "Example: `kalvok-esh` (the spouse's family / the family connected to one through marriage)."
          ]
        ),
        makeGuideSection(
          "Prepositions: Connecting People, Things, and Places",
          "Prepositions in Celan do not just give directions. They act as the structural glue of society. Words like `ser` (with) and `an` (at/in) define how we relate to our environment and each other. In fact, the word for friend is built from the same relational world as with, because friendship is an act of being with someone."
        ),
        makeGuideSection(
          "What to Notice",
          null,
          [
            {
              title: "Possession is not only ownership",
              copy: "Celan asks you to think about whether you own something with `ian` or whether you are simply sharing a bond with it through `-esh`."
            },
            {
              title: "Relation is structural and often social",
              copy: "The little linking words tell you exactly how the pieces of a community fit together, making sentence structure a reflection of social bonds."
            },
            {
              title: "The kind of relation matters",
              copy: "Your choice of form reveals the nature of the bond. Saying my tool uses completely different grammar than saying my partner."
            }
          ]
        )
      ],
      examples: [
        "One Personal Possession: `ian morlak` (My bread — indicating clear, personal ownership of an object).",
        "One Relational/Belonging Phrase: `kalvok-esh` (The spouse's family — indicating an extended group bonded or connected to you).",
        "Contrast Between Two Possessive Strategies: `ian kadron` (My man — feels like direct, literal ownership).",
        "`kadron-esh` (The man connected to me — feels like a mutual, relational bond).",
        "One Place Relation: `var I ser ser an tera.` (I go with a friend to the home — showing the structural relation of who is accompanying you and where you are grounded in space)."
      ].join("\n")
    };
  }

  if (lesson.id === "LESSON-NUMBER-MEASURE") {
    return {
      ruleName: "Number and Measure: How Celan Counts the World",
      purpose: "How Celan builds numbers, scales them upward, handles subtraction, and expresses quantity without articles.",
      guideSections: [
        makeGuideSection(
          "Base Numbers (0–10)",
          "In Celan, you only need to memorize eleven core numbers. Every other number in the entire language is built from these basic seeds.",
          [
            "0 = `verin`",
            "1 = `unar`",
            "2 = `del`",
            "3 = `tren`",
            "4 = `quen`",
            "5 = `peth`",
            "6 = `senar`",
            "7 = `sethe`",
            "8 = `oven`",
            "9 = `nevar`",
            "10 = `tenar`"
          ]
        ),
        makeGuideSection(
          "Scaling Prefixes (Growing the Numbers)",
          "Instead of learning entirely new words for twenty, thirty, or a hundred, Celan attaches a scale marker to the front of a base number.",
          [
            "Tens: add `Ten-` (for example, `Ten-del` = 20, literally Two tens).",
            "Hundreds: add `Hek-` (for example, `Hek-quen` = 400).",
            "Thousands: add `Mel-` (for example, `Mel-unar` = 1,000).",
            "Tens of Thousands: add `Fen-` (for example, `Fen-peth` = 50,000)."
          ]
        ),
        makeGuideSection(
          "Building Larger Numbers (Stacking)",
          "To make a larger, complex number, you stack the blocks from largest to smallest. The language naturally treats this as addition.",
          [
            "Example: `tenar unar` = 11, built by placing 10 and 1 next to each other.",
            "Example: `Ten-del peth` = 25, built by stating twenty and then five."
          ]
        ),
        makeGuideSection(
          "Simple Arithmetic",
          "Addition is invisible. It happens naturally just by stating the numbers together in order. To subtract, use the specific word `Ven` (minus). It acts as a structural wall between the two numbers."
        ),
        makeGuideSection(
          "Quantification and Articles",
          "Celan does not waste breath on small, empty words. There are no direct translations for the English words a or the. If you say `dren`, the listener understands from context whether you mean water or the water. When you need to describe quantity without an exact number, place a quantifier right before the noun.",
          [
            "`ilinor` = all",
            "`melen` = many",
            "`som` = some / a few",
            "`felin` = few",
            "`ekor` = each / every"
          ]
        ),
        makeGuideSection(
          "What to Notice",
          null,
          [
            {
              title: "Numbers are built, not just memorized",
              copy: "Once you learn 0–10 and the four scaling prefixes, you can mathematically construct any number you need."
            },
            {
              title: "Scale markers matter",
              copy: "The tiny prefix you choose completely changes the size of your statement. `unar` is one, but `Mel-unar` becomes a thousand."
            },
            {
              title: "Subtraction has visible logic",
              copy: "Addition is as simple as placing number blocks together, but subtraction requires the explicit marker `Ven` so the listener knows something is being taken away."
            }
          ]
        )
      ],
      examples: [
        "Base List: `verin`, `unar`, `del`, `tren`... (0, 1, 2, 3...).",
        "One Teen Form: `tenar unar` (11 — built by combining 10 and 1).",
        "One Tens Form: `Ten-del` (20 — built as Two tens).",
        "One Hundreds Form: `Hek-quen` (400 — built as Four hundreds).",
        "One Additive Example: `Ten-del peth` (25 — Twenty plus five).",
        "One Subtraction Example: `Hek-quen Ven Hek-del` (400 minus 200 = 200)."
      ].join("\n")
    };
  }

  if (lesson.id === "LESSON-GENDER-ADDRESS-SOCIAL") {
    return {
      ruleName: "Gender, Address, and Social Use: How Celan Connects People",
      purpose: "How Celan handles identity, respect, address, and social nuance through form choice.",
      guideSections: [
        makeGuideSection(
          "The Core Idea: Identity is an Essence, Not a Box",
          "In Celan, who you are is not a rigid, unchanging label assigned at birth. Identity is based on your essence and the qualities you embody right now. Because the Ohnoshan worldview values flow and change, identity is seen as a journey (`Shara`); the word you use to describe yourself may evolve as you grow older or change your path in life."
        ),
        makeGuideSection(
          "Gender Terms (The Seeds of Identity)",
          "Instead of relying only on strict biological labels, Celan uses three core seeds of essence to describe people.",
          [
            "`Kadren`: Masculine essence (strength, groundedness).",
            "`Azan`: Feminine essence (nurturing, fluidity).",
            "`Thee`: Neutral essence (balance, unity).",
            "From these seeds come standard terms like `Kadron` (man), `Azron` (woman), and `Theon` (neutral person).",
            "Because identity is fluid, you can also mix these roots. A man who embodies feminine, nurturing qualities is an `Azon`, and a woman who embodies fierce, masculine traits is a `Kadon`."
          ]
        ),
        makeGuideSection(
          "Combining Qualities and Poetic Expressions",
          "Celan encourages you to layer these terms to capture human nuance. You can combine forms to describe someone as a `Kadron-Azon`, a man with both masculine and feminine qualities. These terms can also be used poetically to describe how someone interacts with the world, such as a neutral person who brings balance to a situation.",
          [
            "Example: `Kadron-Azon` marks a man carrying both masculine and feminine qualities.",
            "Example: `Theon` can be used poetically for someone whose presence brings balance into a tense situation."
          ]
        ),
        makeGuideSection(
          "Politeness and Address Forms (Showing Respect)",
          "In English, we often show respect through tone of voice. In Celan, respect is built directly into the words themselves by adding honorific tags and choosing elevated titles.",
          [
            "The Respect Tag (`Li-`): attach this to the front of a name or title to show polite respect to a stranger or elder. Example: `Li-Ser` = Respected friend.",
            "The High Honor Tag (`-en`): attach this to the end of a title for immense, formal reverence. Example: `Liorinen` = Honored Elder.",
            "Specific respectful titles also exist, such as `Liana` (Lady), `Lianor` (Sir), or `Seren` (Guardian)."
          ]
        ),
        makeGuideSection(
          "Cultural Variation (Reading the Room)",
          "Different nations and situations require different levels of formality. A speaker's choice of words tells you immediately how they view the social dynamic.",
          [
            "Formal vs. Casual: in a royal court or sacred temple, you use elevated words like `aen` (to speak) and `var` (to purposefully go). In a marketplace or among friends, you might use casual words like `kel` (to chat) and `min` (to wander or head over).",
            "Regional Flavors: the oceanic people of Pelagae value fluidity and may use `Azon` frequently for their spiritual men. The mountain warriors of Valkeldor value strength and may favor `Kadon` to honor their warrior women."
          ]
        ),
        makeGuideSection(
          "What to Notice",
          null,
          [
            {
              title: "Celan does social work through form choice",
              copy: "Adding a tiny sound like `Li-` immediately changes the social boundary between two speakers."
            },
            {
              title: "Respect is not a tiny side feature",
              copy: "It is architectural. If you want to be polite, you cannot just smile; you must actually construct your words differently."
            },
            {
              title: "Some forms are literal, some relational, some culturally charged",
              copy: "Calling someone a `Theon` may be a literal description of their identity, but in some places it can also be a culturally charged compliment honoring balance."
            }
          ]
        )
      ],
      examples: [
        "One Direct Respectful Address: `var I dren, Li-Ser.` (I go to the water, respected friend).",
        "One Gender-Term Usage Example: `Azon` (A feminine man — showing the fluidity of combining the `Azan` feminine essence with a male subject).",
        "One Cultural/Register Contrast: Formal: `aen` (to speak deep truths) vs. Informal: `kel` (to casually chat).",
        "One Poetic/Socially Elevated Phrasing Example: `vael vaar an shara-ya.` (May peace be on your path — using the poetic wish particle `vael` to offer a gentle, elevated blessing)."
      ].join("\n")
    };
  }

  if (lesson.id === "LESSON-WRITING-CONVENTIONS") {
    return {
      ruleName: "Writing Conventions: How Celan Appears on the Page",
      purpose: "How Celan uses lowercase, capitals, reverence, and emphasis to make meaning visible on the page.",
      guideSections: [
        makeGuideSection(
          "The Core Idea: Meaning Over Mechanics",
          "In English, we capitalize the first letter of a sentence automatically. In Celan, capitalization is not automatic; it is deeply meaningful. You only capitalize a word when you want to give it philosophical weight, emotional power, or deep respect. The way a sentence looks on the page instantly tells the reader what matters most to the speaker."
        ),
        makeGuideSection(
          "The Sentence-Initial Lowercase Rule",
          "This is the most striking difference for a new learner: sentences in Celan almost always begin with a lowercase letter. Because the first word of a sentence is usually just the verb or a structural signpost like `ra`, it does not get a capital letter unless it happens to be a sacred name or concept."
        ),
        makeGuideSection(
          "The Sanctity of `I`",
          "There is one pronoun that is always capitalized, no matter where it sits in the sentence: the first-person singular `I`. This honors the sanctity, independence, and importance of the individual's consciousness. Meanwhile, pronouns for other people, like `ya` (you) or `la` (they), remain strictly lowercase mid-sentence.",
          [
            "Example: `var I an dren.` keeps `var` lowercase but preserves the capital `I`.",
            "Example: `ra var ya?` leaves `ya` lowercase because only `I` receives that standing automatically."
          ]
        ),
        makeGuideSection(
          "Names, Titles, and Sacred Concepts",
          "When do you capitalize words? Capitalization appears where the culture wants reverence or distinction to be visible.",
          [
            "Names and Nations: proper names like `Kaikoa` and nations like `Mechuma` get capital letters.",
            "Titles of Respect: when addressing an elder or official, their title is capitalized to show immense reverence, like `Velmarin` for an Honorary Elder.",
            "Archetypal Forces: if a word represents a grand, primordial force, it is capitalized. For example, `terra` means mundane dirt, but `Terra` refers to the living, spiritual Heart of the world."
          ]
        ),
        makeGuideSection(
          "Poetic and Emotional Capitalization",
          "In poetry or highly emotional speech, you can capitalize a completely normal word to elevate it to the level of a cosmic force. It is a way of telling the reader: this is not just a normal feeling; this is everything to me right now."
        ),
        makeGuideSection(
          "What to Notice",
          null,
          [
            {
              title: "Celan does not use capitals the way English does",
              copy: "You will constantly see sentences starting with lowercase letters and important words towering in the middle."
            },
            {
              title: "Capitalization is meaningful, not automatic",
              copy: "Every capital letter is a deliberate choice by the writer to add emphasis or reverence."
            },
            {
              title: "Written form carries tone and hierarchy",
              copy: "You can immediately see the social dynamics or spiritual beliefs of the writer just by looking at which words they chose to capitalize and which they kept humble."
            }
          ]
        )
      ],
      examples: [
        "One Normal Lowercase Sentence: `var kadron an morl.` (The man goes to the mountain — entirely lowercase because no specific names or grand concepts are used).",
        "One Sentence with `I`: `var I an dren.` (I go to the water — the verb `var` is lowercase, but the `I` stands tall).",
        "One Sacred/Archetypal Contrast: `terra` (mundane soil/dirt) vs. `Terra` (the mystical Heart of the world).",
        "One Poetic Emphasis Contrast: Standard: `ohmaen I an thar-ka.` (I love my desire.)",
        "Poetic: `rinaen I an Thar-ka.` (I am Desire itself — elevating personal desire into a grand, archetypal force)."
      ].join("\n")
    };
  }

  return {
    ruleName: lesson.title,
    purpose: lesson.description,
    guideSections: [
      makeGuideSection(
        "What this lesson is for",
        lesson.description
      ),
      makeGuideSection(
        "This lesson includes",
        null,
        childTitles.slice(0, 12)
      )
    ],
    examples: ""
  };
}

function buildCompanionPageEntries() {
  return RULE_COMPANIONS.map((page) => createSyntheticRule({
    id: page.id,
    rule_name: "Cultural Voice: How Ohnosha Speaks Celan Differently",
    category: "Advanced Companion",
    displayCategory: "Advanced Companion",
    purpose: "How one universal language develops distinct national voices without breaking into separate dialects.",
    original_wording: page.description,
    guideSections: [
      makeGuideSection(
        "The Core Idea: One Language, Many Voices",
        "While Celan is the universal tongue of Ohnosha, its application across the world is not monolithic. Generations of local use have given rise to distinct Cultural Voices or National Vernaculars. These are not separate dialects with different grammar rules. They are different habits of vocabulary choice, metaphor, sentence texture, and phonetic preference."
      ),
      makeGuideSection(
        "What Changes from Culture to Culture",
        "Cultural Voice appears in word choice, metaphor, sentence feel, and especially in how a people applies the Rule of Euphony. Some cultures smooth words into flowing musical forms. Others deliberately keep harsh consonant clusters to sound practical, martial, or severe."
      ),
      makeGuideSection(
        "The Eight National Vernaculars",
        null,
        [
          {
            title: "Verdalrisian (Poetic & Harmonious)",
            copy: "Deeply connected to the living forests, the Verdalrisian voice is lyrical, patient, and rich with natural metaphor. Because beauty in speech matters deeply to them, they are the most likely to use advanced vowel harmony and highly smoothed forms."
          },
          {
            title: "Pelagaean (Fluid & Melodic)",
            copy: "Reflecting their oceanic origins, Pelagaean speech is fluid, communal, and poetic. Their vernacular is saturated with metaphors of water, tides, and flow. Like the Verdalrisians, they heavily prefer smoothed, euphonic pronunciations."
          },
          {
            title: "Zarithan (Pragmatic & Guttural)",
            copy: "Shaped by barren deserts and a nomadic survivalist spirit, the Zarithan voice is practical and direct. They value clarity and efficiency above all else, and often break euphonic expectations to preserve harsh consonant clusters such as `Krezthal` instead of `Krezathal`."
          },
          {
            title: "Valkeldorian (Conservative & Harsh)",
            copy: "Grounded in stone, mountains, and resilience, Valkeldorian language is strong and resolute. Like the Zarithans, they often prefer harder, non-euphonic forms to reflect martial strength and unyielding endurance."
          },
          {
            title: "Mechuman (Systematic & Standardized)",
            copy: "Reflecting a society built on technology, magic, and ordered systems, Mechumans value efficiency, logic, and purpose. In speech, they apply Celan phonetic and grammatical rules with exact, systematic consistency."
          },
          {
            title: "Nivveilian (Patient & Minimalist)",
            copy: "Shaped by the icy north, Nivveilians are reserved, patient, and stoic. Their vernacular is understated and highly economical, making every sound count."
          },
          {
            title: "Jasaran (Balanced & Elegant)",
            copy: "As oasis dwellers, Jasarans blend Zarithan practicality with water-centered mysticism. Their speech seeks careful balance and often aims for a poised, elegant phonetic equilibrium."
          },
          {
            title: "Marakorian (Formal & Archaic)",
            copy: "Marakorian speech values discipline, order, refinement, and reverence for tradition. Their Cultural Voice is highly formal and often leans into older, more archaic forms."
          }
        ]
      ),
      makeGuideSection(
        "Cultural Voice in Practice",
        "These are not separate grammars. They are different ways of inhabiting the same language. The clearest way to feel the shift is to hear each nation ask or frame something in its own voice. For consistency, the examples below follow the writing conventions used elsewhere in this guide.",
        [
          {
            title: "Verdalrisian",
            copy: "`lorin shara ya an Kinnmor, Li-Ser?` — “Where does your path guide you this morning, Respected-Friend?” Listen for the lyrical phrasing, the guided-path imagery, and the patient tone."
          },
          {
            title: "Pelagaean",
            copy: "`ra shalil ya, Ser?` — “Where do you flow, Friend?” Listen for how movement becomes water-language instead of blunt travel-language."
          },
          {
            title: "Zarithan",
            copy: "`ra min ya, Ser?` — “Where are you headed, Friend?” Listen for the directness: fewer flourishes, less metaphor, more survival-minded clarity."
          },
          {
            title: "Valkeldorian",
            copy: "`aen shara-ya, Ser!` — “State your path, Friend!” Listen for the command-like firmness and strong, disciplined tone."
          },
          {
            title: "Mechuman",
            copy: "`aen ya varash, Ser.` — “State your destination, Friend.” Listen for the precision: clear, exact, and almost procedural in its phrasing."
          },
          {
            title: "Nivveilian",
            copy: "`an eshreth, ra var ya, Ser?` — “In this hazy sky, where are you going, Friend?” Listen for the spare, quiet atmosphere and restrained emotional temperature."
          },
          {
            title: "Jasaran",
            copy: "`shal lorin shara-ya an nor-ka, Ser?` — “Does the light guide your path in this moment, Friend?” Listen for the balance of practicality and mysticism."
          },
          {
            title: "Marakorian",
            copy: "`ra rinaen shara-ya lian, Li-Ser?` — “Is your path a proper one, Respected-Friend?” Listen for the formal, judging, order-conscious register."
          }
        ]
      ),
      makeGuideSection(
        "What to Notice",
        null,
        [
          {
            title: "These are voices, not dialects",
            copy: "The underlying language remains Celan. What changes is how a people inhabits it."
          },
          {
            title: "Euphony is one of the clearest markers",
            copy: "A listener can often hear cultural alignment immediately in the choice between a harsh cluster and a smoothed form."
          },
          {
            title: "Vocabulary and metaphor matter too",
            copy: "Cultural Voice is not only about sound. It also lives in the metaphors, titles, and preferred registers a people reaches for."
          }
        ]
      )
    ],
    examples: [
      "Verdalrisian: `lorin shara ya an Kinnmor, Li-Ser?` (Where does your path guide you this morning, Respected-Friend?)",
      "Pelagaean: `ra shalil ya, Ser?` (Where do you flow, Friend?)",
      "Zarithan: `ra min ya, Ser?` (Where are you headed, Friend?)",
      "Valkeldorian: `aen shara-ya, Ser!` (State your path, Friend!)",
      "Mechuman: `aen ya varash, Ser.` (State your destination, Friend.)",
      "Nivveilian: `an eshreth, ra var ya, Ser?` (In this hazy sky, where are you going, Friend?)",
      "Jasaran: `shal lorin shara-ya an nor-ka, Ser?` (Does the light guide your path in this moment, Friend?)",
      "Marakorian: `ra rinaen shara-ya lian, Li-Ser?` (Is your path a proper one, Respected-Friend?)"
    ].join("\n"),
    notes: "",
    relatedHeadwords: existingHeadwords(["Krezthal", "Krezathal", "Azon", "Kadon", "Theon", "Li-Ser", "Liorinen"]),
    related_entry_ids: "",
    source_volume: "",
    source_section: "",
    page_number: "",
    canon_status: "Canon"
  }));
}

function viewerRuleEntries() {
  const visibleIds = new Set([
    ...RULE_LESSONS.map((lesson) => resolveLessonSelection(lesson.id)),
    ...RULE_COMPANIONS.map((page) => page.id)
  ]);
  return state.grammarRules.filter((rule) => visibleIds.has(rule.id));
}

function buildLessonOverviewEntries(rules) {
  return RULE_LESSONS.map((lesson) => {
    const lessonRules = rules.filter((rule) => rule.lessonId === lesson.id);
    const featured = lessonRules.find((rule) => rule.synthetic) || lessonRules[0];
    const childRuleIds = lessonRules
      .filter((rule) => !rule.id.startsWith("LESSON-"))
      .sort((a, b) => (a.rule_name || "").localeCompare(b.rule_name || ""))
      .map((rule) => rule.id);
    const childTitles = lessonRules
      .filter((rule) => !rule.id.startsWith("LESSON-"))
      .map((rule) => rule.rule_name);
    const page = lessonPageContent(lesson, childTitles);
    return createSyntheticRule({
      id: lesson.id,
      rule_name: page.ruleName,
      category: "Lesson",
      displayCategory: "Lesson",
      purpose: page.purpose,
      original_wording: page.purpose,
      guideSections: page.guideSections,
      examples: page.examples,
      notes: "",
      relatedHeadwords: featured?.relatedHeadwords || [],
      related_entry_ids: "",
      childRuleIds,
      source_volume: "",
      source_section: "",
      page_number: "",
      canon_status: "Canon",
      lessonId: lesson.id
    });
  });
}

function renderLessonStrip() {
  const selected = state.grammarRules.find((rule) => rule.id === state.selectedRuleId);
  const activeLessonId = selected?.lessonId || state.selectedRuleId;
  els.lessonStrip.innerHTML = RULE_LESSONS.map((lesson) => `
    <button class="lesson-card${activeLessonId === lesson.id ? " active" : ""}" type="button" data-lesson-id="${lesson.id}">
      <span class="lesson-card-title">${lesson.title}</span>
      <span class="lesson-card-copy">${lesson.description}</span>
    </button>
  `).join("");

  els.lessonStrip.querySelectorAll(".lesson-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedRuleId = resolveLessonSelection(btn.dataset.lessonId);
      renderLessonStrip();
      applyRuleFilters();
    });
  });
}

function renderCompanionStrip() {
  const selected = state.grammarRules.find((rule) => rule.id === state.selectedRuleId);
  const activeCompanionId = companionMeta(selected?.id) ? selected.id : null;
  els.companionStrip.innerHTML = RULE_COMPANIONS.map((page) => `
    <button class="companion-card${activeCompanionId === page.id ? " active" : ""}" type="button" data-companion-id="${page.id}">
      <span class="lesson-card-title">${page.title}</span>
      <span class="lesson-card-copy">${page.description}</span>
    </button>
  `).join("");

  els.companionStrip.querySelectorAll(".companion-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedRuleId = btn.dataset.companionId;
      renderLessonStrip();
      renderCompanionStrip();
      applyRuleFilters();
    });
  });
}

function renderRuleSearchResults() {
  const needle = (els.ruleSearchInput.value || "").trim();
  if (!needle) {
    els.ruleSearchResults.classList.add("hidden");
    els.ruleSearchResults.innerHTML = "";
    return;
  }

  const results = state.filteredRules
    .slice(0, 10)
    .map((rule) => {
      const lesson = lessonMeta(rule.lessonId);
      const companion = companionMeta(rule.id);
      return `
        <button class="rule-result-card" type="button" data-rule-id="${rule.id}">
          <span class="rule-result-kicker">${companion?.title || lesson?.title || rule.displayCategory}</span>
          <span class="rule-result-title">${rule.rule_name}</span>
          <span class="rule-result-copy">${rule.preview || rule.purpose}</span>
        </button>
      `;
    })
    .join("");

  els.ruleSearchResults.classList.remove("hidden");
  els.ruleSearchResults.innerHTML = `
    <h3>${state.filteredRules.length ? `Search results (${state.filteredRules.length})` : "No matching rules yet"}</h3>
    ${state.filteredRules.length ? `<div class="rule-result-list">${results}</div>` : `<p class="empty">Try a broader rule name or a simpler example.</p>`}
  `;

  els.ruleSearchResults.querySelectorAll(".rule-result-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedRuleId = btn.dataset.ruleId;
      renderLessonStrip();
      renderCompanionStrip();
      renderRuleSearchResults();
      const selected = state.grammarRules.find((rule) => rule.id === state.selectedRuleId);
      if (selected) renderRuleDetail(selected);
    });
  });
}

function applyRuleFilters() {
  const needle = (els.ruleSearchInput.value || "").trim().toLowerCase();
  const visibleEntries = viewerRuleEntries();
  state.filteredRules = visibleEntries.filter((rule) => !needle || rule.searchText.includes(needle));
  state.filteredRules.sort((a, b) => (a.rule_name || "").localeCompare(b.rule_name || ""));

  const selected = visibleEntries.find((rule) => rule.id === state.selectedRuleId) || visibleEntries.find((rule) => rule.id === "RG-PRONUNCIATION") || visibleEntries[0];
  state.selectedRuleId = selected?.id || null;

  renderRuleSearchResults();
  renderLessonStrip();
  renderCompanionStrip();

  if (selected) {
    renderRuleDetail(selected);
  } else {
    els.ruleEmptyState.classList.remove("hidden");
    els.ruleDetailView.classList.add("hidden");
    els.ruleDetailView.innerHTML = "";
  }
}

function splitRuleLines(text) {
  return (text || "")
    .split(/\n+/)
    .map((line) => line.replace(/^●\s*/g, "").trim())
    .filter(Boolean);
}

function formatRuleText(text) {
  return String(text || "").replace(/`([^`]+)`/g, '<span class="celan-inline">$1</span>');
}

function renderRuleBody(text) {
  const lines = splitRuleLines(text);
  if (!lines.length) return "";
  if (lines.length === 1 && !/●/.test(text || "")) {
    return `<p>${formatRuleText(lines[0])}</p>`;
  }
  return `<ul class="rule-list">${lines.map((line) => `<li>${formatRuleText(line)}</li>`).join("")}</ul>`;
}

function renderGuideSections(sections) {
  return sections.map((section) => `
    <section class="guide-section">
      <h4>${formatRuleText(section.title)}</h4>
      ${section.body ? `<p>${formatRuleText(section.body)}</p>` : ""}
      ${section.list?.length ? `<ul class="rule-list">${section.list.map((item) => {
        if (typeof item === "string") {
          return `<li>${formatRuleText(item)}</li>`;
        }
        return `<li class="guide-point"><span class="guide-point-title">${formatRuleText(item.title)}</span>${item.copy ? `<span class="guide-point-copy">${formatRuleText(item.copy)}</span>` : ""}</li>`;
      }).join("")}</ul>` : ""}
    </section>
  `).join("");
}

function getRuleBodyText(rule) {
  const original = (rule.original_wording || "").trim();
  const normalizedOriginal = original.toLowerCase();
  const normalizedName = (rule.rule_name || "").trim().toLowerCase();
  if (!original || normalizedOriginal === normalizedName) {
    if (normalizedName.includes("basic prepositions")) {
      return "Core Celan prepositions cover direction, accompaniment, origin, absence, place, time, elevation, and position.";
    }
    if (normalizedName.includes("basic math")) {
      return "Celan expresses addition through additive number building and subtraction with the marker Ven.";
    }
    return rule.purpose;
  }
  return original;
}

function shouldDisplayRuleNote(noteText) {
  const note = (noteText || "").trim().toLowerCase();
  if (!note) return false;
  if (note === "bullet/list structure preserved.") return false;
  if (note === "bullet structure preserved in examples field.") return false;
  if (note === "bullet structure preserved in original_wording field.") return false;
  if (note.includes("source table flattened")) return false;
  if (note.includes("markdown preserves table structure")) return false;
  return true;
}

function findHeadwordsForSourceIds(ids) {
  const wanted = new Set(ids);
  return state.groupedEntries
    .filter((group) => (group.entries || []).some((entry) => wanted.has(entry.entry_id)))
    .map((group) => group.term)
    .filter((term, index, all) => all.indexOf(term) === index)
    .sort((a, b) => a.localeCompare(b));
}

function renderRuleDetail(rule) {
  const relatedIds = splitIds(rule.related_entry_ids).filter((id) => /^(LX|RM|DM|DX|XR)-/i.test(id));
  const relatedHeadwords = rule.relatedHeadwords?.length ? rule.relatedHeadwords : findHeadwordsForSourceIds(relatedIds);
  const exampleText = (rule.examples || "").trim();
  const noteText = (rule.notes || "").trim();
  const bodyText = getRuleBodyText(rule);
  const showNote = shouldDisplayRuleNote(noteText);
  const hasGuideSections = Array.isArray(rule.guideSections) && rule.guideSections.length > 0;
  const isGuidePage = rule.id.startsWith("LESSON-") || rule.id.startsWith("RG-") || rule.id.startsWith("PAGE-");

  els.ruleEmptyState.classList.add("hidden");
  els.ruleDetailView.classList.remove("hidden");
  els.ruleDetailView.innerHTML = `
    <h2 class="entry-word">${rule.rule_name}</h2>
    <p class="entry-kicker">${companionMeta(rule.id) ? "Advanced Companion" : (rule.id.startsWith("LESSON-") || rule.id.startsWith("RG-") ? "Lesson" : rule.displayCategory)}</p>
    <p class="entry-meta">${rule.purpose}</p>
    <div class="detail-grid">
      <section class="card">
        <h3>${companionMeta(rule.id) ? "How This Companion Works" : (isGuidePage ? "How This Lesson Works" : "What This Rule Does")}</h3>
        ${hasGuideSections ? renderGuideSections(rule.guideSections) : renderRuleBody(bodyText)}
      </section>
      ${exampleText ? `
      <section class="card">
        <h3>${isGuidePage ? "Useful Examples" : "Canon Examples"}</h3>
        ${renderRuleBody(exampleText)}
      </section>
      ` : ""}
      ${relatedHeadwords.length ? `
      <section class="card">
        <h3>Related words</h3>
        <p class="family-line">${renderFamilyLinks(relatedHeadwords, "data-headword")}</p>
      </section>
      ` : ""}
      ${showNote ? `
      <section class="card">
        <h3>Editorial Note</h3>
        <p class="source-note">${noteText}</p>
      </section>
      ` : ""}
    </div>
  `;

  els.ruleDetailView.querySelectorAll(".family-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeView = "dictionary";
      renderActiveView();
      jumpToHeadword(btn.dataset.headword);
    });
  });
}

function useSortRank(use) {
  const type = (use.type || "").toLowerCase();
  const ranks = {
    "pronoun": 1,
    "noun": 2,
    "verb": 3,
    "adjective": 4,
    "adverb": 5,
    "preposition": 6,
    "conjunction": 7,
    "particle": 8,
    "connector": 9,
    "grammar word": 10,
    "possessive": 11,
    "modal": 12,
    "interjection": 13,
    "prefix": 14,
    "suffix": 15,
    "measure": 16,
    "root": 17,
    "complementizer": 18
  };
  return ranks[type] || 20;
}

const HEADWORD_DISPLAY_OVERRIDES = {
  "-en": {
    examples: [
      {
        celan_text: "Li-Seren-en, var nor Varthas shenakar?",
        translation: "Honored guardian, do we proceed to the city's exchange now?"
      },
      {
        celan_text: "Var Liorinen lianaen an shalor.",
        translation: "The Honored Elder goes to pray in the sanctuary."
      },
      {
        celan_text: "Ohmaen Ya Kalvok-en.",
        translation: "You love your bonded partner."
      }
    ]
  },
  "-aen": {
    examples: [
      {
        celan_text: "Shalaen I vethral an verdor.",
        translation: "I see the pack hunter in the forest."
      },
      {
        celan_text: "Pralaen I krezor.",
        translation: "I am making a hearth."
      },
      {
        celan_text: "Velaen Ilin morlak.",
        translation: "We eat the bread."
      }
    ]
  },
  "-eth": {
    uses: [
      {
        type: "Adjective",
        meaning: "Suffix that marks inherent quality or essential manifestation",
        usage: "Common adjectival examples: Shal -> Shaleth, Wor -> Woreth, Gorm -> Gormeth, Kal -> Kaleth."
      },
      {
        type: "Noun",
        meaning: "Also used for abstract or ritual nouns",
        usage: "Ritual/nominal examples: Shal'taleth, Aen'Moreth."
      }
    ],
    familyTerms: ["Shaleth", "Woreth", "Gormeth", "Kaleth"],
    examples: [
      {
        celan_text: "Rinaen drenvor woreth.",
        translation: "The bowl is full."
      },
      {
        celan_text: "Rinaen krezor feneth.",
        translation: "The hearth is hot."
      },
      {
        celan_text: "Rinaen shena shaleth.",
        translation: "The coin is gold."
      }
    ]
  },
  aen: {
    uses: [
      {
        type: "Verb",
        meaning: "Speak / Tell / Breathe / Breath of Life",
        usage: "Formal/poetic use: deeper or ritual speaking. Use in rituals, court, formal address, writing, and when emphasizing depth. Combine with Li- / -en."
      },
      {
        type: "Conjunction",
        meaning: "That"
      },
      {
        type: "Suffix",
        meaning: "-aen (verb-forming)"
      }
    ],
    familyTerms: ["Aenaen", "Aenor", "Aenvor"]
  },
  var: {
    uses: [
      {
        type: "Verb",
        meaning: "Go / Move",
        usage: "Formal/purposeful use: deliberate or directed movement."
      },
      {
        type: "Preposition",
        meaning: "To / Towards"
      }
    ]
  },
  nor: {
    uses: [
      {
        type: "Noun",
        meaning: "Time / Flow of Time"
      },
      {
        type: "Preposition",
        meaning: "At / In (time)"
      }
    ]
  },
  shal: {
    uses: [
      {
        type: "Noun",
        meaning: "Light / New Beginnings / Fate"
      },
      {
        type: "Verb",
        meaning: "Hope"
      }
    ]
  },
  reth: {
    uses: [
      {
        type: "Noun",
        meaning: "Confusion / Uncertainty"
      },
      {
        type: "Conjunction",
        meaning: "Or"
      }
    ]
  },
  fah: {
    uses: [
      {
        type: "Noun",
        meaning: "Darkness / Fear / Night"
      },
      {
        type: "Interjection",
        meaning: "Ugh! / Bah!"
      }
    ]
  },
  krez: {
    uses: [
      {
        type: "Noun",
        meaning: "Fire"
      },
      {
        type: "Interjection",
        meaning: "Blast! / Damn!"
      }
    ]
  },
  dral: {
    uses: [
      {
        type: "Noun",
        meaning: "Sky / Wonder / Heavens"
      },
      {
        type: "Interjection",
        meaning: "Wow! / Heavens!"
      }
    ]
  },
  aenor: {
    uses: [
      {
        type: "Noun",
        meaning: "Ear"
      },
      {
        type: "Noun",
        meaning: "Moment / Instant"
      }
    ]
  },
  terra: {
    uses: [
      {
        type: "Noun",
        meaning: "Earth / Physical ground"
      },
      {
        type: "Noun",
        meaning: "The Heart of Terra / Mystical force"
      }
    ]
  },
  thal: {
    uses: [
      {
        type: "Noun",
        meaning: "Balance / Harmony"
      },
      {
        type: "Preposition",
        meaning: "From / Out of"
      }
    ]
  },
  esh: {
    uses: [
      {
        type: "Noun",
        meaning: "Sky / Air"
      },
      {
        type: "Preposition",
        meaning: "Above / Over"
      },
      {
        type: "Suffix",
        meaning: "-esh (relational)"
      }
    ]
  },
  kal: {
    uses: [
      {
        type: "Noun",
        meaning: "Strength / Power"
      },
      {
        type: "Adjective",
        meaning: "Strong"
      }
    ]
  },
  ser: {
    uses: [
      {
        type: "Noun",
        meaning: "Friend / Ally"
      },
      {
        type: "Preposition",
        meaning: "With"
      },
      {
        type: "Conjunction",
        meaning: "And"
      }
    ]
  },
  vaar: {
    uses: [
      {
        type: "Noun",
        meaning: "Peace / Unity"
      },
      {
        type: "Adjective",
        meaning: "Good"
      },
      {
        type: "Interjection",
        meaning: "Relief / Phew"
      }
    ]
  },
  lian: {
    uses: [
      {
        type: "Noun",
        meaning: "Truth / Honesty"
      },
      {
        type: "Verb",
        meaning: "Pray"
      },
      {
        type: "Modal",
        meaning: "Can / Able to"
      }
    ]
  },
  thar: {
    uses: [
      {
        type: "Noun",
        meaning: "Heart"
      },
      {
        type: "Modal",
        meaning: "Want to"
      }
    ]
  },
  tal: {
    uses: [
      {
        type: "Verb",
        meaning: "Give / Offer"
      },
      {
        type: "Verb",
        meaning: "Take / Receive"
      }
    ]
  },
  vethor: {
    uses: [
      {
        type: "Noun",
        meaning: "Shadow / Mystery"
      },
      {
        type: "Verb",
        meaning: "Sleep"
      }
    ]
  },
  kor: {
    uses: [
      {
        type: "Noun",
        meaning: "Source / Strength"
      },
      {
        type: "Measure",
        meaning: "Unit of length / handspan measure"
      }
    ]
  },
  pral: {
    uses: [
      {
        type: "Noun",
        meaning: "Table"
      },
      {
        type: "Verb",
        meaning: "Make"
      },
      {
        type: "Noun",
        meaning: "Intricacy / Detail"
      }
    ]
  },
  vok: {
    uses: [
      {
        type: "Noun",
        meaning: "Unity / Bond"
      },
      {
        type: "Verb",
        meaning: "Betray"
      }
    ]
  },
  kel: {
    uses: [
      {
        type: "Verb",
        meaning: "Say / Talk (informal)"
      },
      {
        type: "Noun",
        meaning: "Name"
      },
      {
        type: "Noun",
        meaning: "Word"
      }
    ]
  },
  shen: {
    uses: [
      {
        type: "Noun",
        meaning: "Coinage / Currency"
      },
      {
        type: "Measure",
        meaning: "Unit of weight / measure"
      }
    ]
  }
};

function headwordOverride(term) {
  return HEADWORD_DISPLAY_OVERRIDES[normalizeHeadword(term)] || null;
}

function buildGroupedEntries(entries) {
  const groups = new Map();
  entries.forEach((entry) => {
    const key = normalizeHeadword(entry.celan_term);
    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        term: entry.celan_term,
        entries: []
      });
    }
    groups.get(key).entries.push(entry);
  });
  return Array.from(groups.values()).map((group) => {
    const useMap = new Map();
    group.entries.forEach((entry) => {
      buildUses(entry).forEach((use) => {
        const key = `${(use.type || "").toLowerCase()}::${use.meaning.toLowerCase()}`;
        if (!useMap.has(key)) {
          useMap.set(key, {
            type: use.type,
            rootWord: !!use.rootWord,
            meaning: use.meaning,
            usage: use.usage,
            sourceEntries: [...use.sourceEntries]
          });
        } else {
          const existing = useMap.get(key);
          if (!existing.usage && use.usage) existing.usage = use.usage;
          existing.rootWord = existing.rootWord || !!use.rootWord;
          existing.sourceEntries = Array.from(new Set(existing.sourceEntries.concat(use.sourceEntries)));
        }
      });
    });
    let uses = Array.from(useMap.values()).sort((a, b) => {
      const rankDiff = useSortRank(a) - useSortRank(b);
      if (rankDiff !== 0) return rankDiff;
      return a.meaning.localeCompare(b.meaning);
    });
    const isRootOnly = uses.length > 0 && uses.every((use) => use.rootWord);
    if (isRootOnly) {
      const preferredEntries = [...group.entries].sort((a, b) => {
        const aScore = a.entry_id.startsWith("XR-") ? 2 : 1;
        const bScore = b.entry_id.startsWith("XR-") ? 2 : 1;
        return aScore - bScore;
      });
      const primaryEntry = preferredEntries[0];
      const primaryMeaning = (primaryEntry?.english_meaning || "").trim();
      const primaryType = inferRootDisplayType(primaryEntry, primaryMeaning);
      const supportingMeanings = preferredEntries
        .slice(1)
        .map((entry) => (entry.english_meaning || "").trim())
        .filter(Boolean)
        .filter((meaning) => meaning.toLowerCase() !== primaryMeaning.toLowerCase());
      const usageNotes = preferredEntries
        .map((entry) => (entry.usage_context || "").trim())
        .filter(Boolean);
      const usage = [
        ...supportingMeanings.map((meaning) => `Conceptual range: ${meaning}`),
        ...usageNotes
      ].find(Boolean) || "";
      uses = [{
        type: primaryType,
        rootWord: true,
        meaning: primaryMeaning,
        usage,
        sourceEntries: preferredEntries.map((entry) => entry.entry_id)
      }];
    }
    const override = headwordOverride(group.term);
    if (override?.uses?.length) {
      const hasRootWord = uses.some((use) => use.rootWord);
      uses = override.uses.map((use) => ({
        ...use,
        rootWord: hasRootWord,
        sourceEntries: group.entries.map((entry) => entry.entry_id)
      }));
    }
    const preview = uses.slice(0, 2).map((use) => {
      return use.type ? `${use.type}: ${use.meaning}` : use.meaning;
    }).join(" ; ");
    return {
      ...group,
      uses,
      preview,
      searchText: group.entries.map((entry) => [
        entry.celan_term,
        entry.english_meaning,
        entry.category,
        entry.original_wording,
        entry.usage_context
      ].join(" ")).join(" ").toLowerCase()
    };
  });
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function buildRootLookup(expandedRoots, roots) {
  const seen = new Map();

  expandedRoots
    .filter((row) => isFamilyAnchorType(row.entry_type))
    .forEach((row) => {
      const form = (row.form || "").trim();
      const normalized = cleanAlpha(form);
      if (!normalized || normalized.length < 3) return;
      seen.set(normalized, {
        form,
        normalized,
        meaning: row.core_meaning || "",
        evidence: extractEvidenceTerms(row.evidence_hint),
        evidenceTerms: extractEvidenceTerms(row.evidence_hint),
        linkedEntryIds: [],
        anchorType: (row.entry_type || "").toLowerCase(),
        status: row.status || ""
      });
    });

  roots
    .filter((row) => isFamilyAnchorType(row.type))
    .forEach((row) => {
      const form = (row.root_or_morpheme || "").trim();
      const normalized = cleanAlpha(form);
      if (!normalized || normalized.length < 3) return;
      if (!seen.has(normalized)) {
        seen.set(normalized, {
          form,
          normalized,
          meaning: row.meaning_or_function || "",
          evidence: extractEvidenceTerms(row.derived_forms),
          evidenceTerms: extractEvidenceTerms(row.derived_forms),
          linkedEntryIds: splitIds(row.related_entry_ids).filter((id) => id.startsWith("LX-")),
          anchorType: (row.type || "").toLowerCase(),
          status: "canon-root"
        });
      } else {
        const existing = seen.get(normalized);
        existing.evidence = Array.from(new Set(existing.evidence.concat(extractEvidenceTerms(row.derived_forms))));
        existing.evidenceTerms = Array.from(new Set(existing.evidenceTerms.concat(extractEvidenceTerms(row.derived_forms))));
        existing.linkedEntryIds = Array.from(new Set(existing.linkedEntryIds.concat(splitIds(row.related_entry_ids).filter((id) => id.startsWith("LX-")))));
      }
    });

  return Array.from(seen.values()).sort((a, b) => b.normalized.length - a.normalized.length);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractEvidenceTerms(value) {
  return (value || "")
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => chunk.split("(")[0].trim())
    .map((chunk) => chunk.split(",")[0].trim())
    .filter(Boolean);
}

function extractDerivationAnchors(text, rootLookup) {
  const source = (text || "").trim();
  if (!source) return [];
  return rootLookup.filter((root) => {
    const token = escapeRegex(formatRootHeadword(root.form).replace(/-+$/g, ""));
    if (!token) return false;
    const pattern = new RegExp(`(^|[^A-Za-z-])${token}(?=[^A-Za-z]|$)`, "i");
    return pattern.test(source);
  });
}

function derivationSource(entry) {
  const usage = (entry.usage_context || "").trim();
  const original = (entry.original_wording || "").trim();
  const derivationUsage = /(\+|=|derived from|derivation:|root:|built from|shortened from|re-purposed from)/i.test(usage)
    ? usage
    : "";
  const derivationMatch = original.match(/(?:Derivation:|Derived From:|Root:|Built From:)\s*([^/\n]+)/i);
  const derivationOnlyOriginal = derivationMatch ? derivationMatch[1].trim() : "";
  return [derivationUsage, derivationOnlyOriginal].filter(Boolean).join(" ");
}

function detectFamilyRoots(group, rootLookup) {
  const term = cleanAlpha(group.term);
  const directMatches = [];
  rootLookup.forEach((root) => {
    if (!root.normalized) return;
    const evidenceMatch = (root.evidenceTerms || []).some((hint) => cleanAlpha(hint) === term);
    const linkedIdMatch = group.entries.some((entry) => root.linkedEntryIds.includes(entry.entry_id));
    const exact = root.normalized === term;
    const morphemeEdgeMatch = (root.anchorType || "").includes("morpheme") || (root.anchorType || "").includes("marker")
      ? (term.startsWith(root.normalized) || term.endsWith(root.normalized))
      : false;
    if (exact || evidenceMatch || linkedIdMatch || morphemeEdgeMatch) {
      directMatches.push(root);
    }
  });
  const derivationMatches = group.entries.flatMap((entry) => {
    return extractDerivationAnchors(derivationSource(entry), rootLookup);
  });
  const merged = Array.from(new Map([...directMatches, ...derivationMatches].map((root) => [root.normalized, root])).values());
  const exactRoots = merged.filter((root) => root.normalized === term);
  return exactRoots.length ? exactRoots : merged.slice(0, 4);
}

function buildFamilyIndex(groupedEntries, expandedRoots, roots) {
  const rootLookup = buildRootLookup(expandedRoots, roots);
  const detectedRootsByGroup = new Map();
  const membersByRoot = new Map();

  groupedEntries.forEach((group) => {
    const detectedRoots = detectFamilyRoots(group, rootLookup);
    detectedRootsByGroup.set(group.id, detectedRoots);
  });

  rootLookup.forEach((root) => {
    const members = groupedEntries.filter((group) => {
      const isRootEntry = group.id === root.normalized;
      const linkedIdMatch = group.entries.some((entry) => root.linkedEntryIds.includes(entry.entry_id));
      const evidenceMatch = (root.evidenceTerms || []).some((hint) => cleanAlpha(hint) === group.id);
      const derivationMatch = detectFamilyRoots(group, [root]).some((candidateRoot) => candidateRoot.normalized === root.normalized);
      return isRootEntry || linkedIdMatch || evidenceMatch || derivationMatch;
    });
    membersByRoot.set(root.normalized, members);
  });

  const index = new Map();
  groupedEntries.forEach((group) => {
    const detectedRoots = detectedRootsByGroup.get(group.id) || [];
    const familyRoots = detectedRoots.map((root) => root.form);
    const relatedEntries = uniqueById(
      detectedRoots
        .flatMap((root) => membersByRoot.get(root.normalized) || [])
        .filter((candidate) => candidate.id !== group.id)
        .map((candidate) => ({
          id: candidate.id,
          term: candidate.term
        }))
    ).slice(0, 16);
    index.set(group.id, {
      familyRoots,
      relatedEntries
    });
  });
  return index;
}

function applyFilters() {
  const q = els.searchInput.value.toLowerCase().trim();
  const selectedType = state.activeWordType;
  state.filtered = state.groupedEntries.filter((group) => {
    if (state.activeLetter !== "ALL") {
      const starts = azBucket(group.term) === state.activeLetter;
      if (!starts) return false;
    }
    if (selectedType !== "ALL") {
      const matchesType = (group.uses || []).some((use) => (use.type || "").trim() === selectedType);
      if (!matchesType) return false;
    }
    return !q || group.searchText.includes(q);
  });
  state.filtered.sort((a, b) => (a.term || "").localeCompare(b.term || ""));
  renderList();
}

function renderList() {
  els.resultList.innerHTML = "";
  els.resultCount.textContent = `${state.filtered.length} results`;
  state.filtered.slice(0, 400).forEach((group) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = group.id === state.selectedId ? "active" : "";
    btn.innerHTML = `<span class="term">${group.term}</span><span class="sub">${group.preview || "No gloss"}</span>`;
    btn.onclick = () => {
      state.selectedId = group.id;
      renderList();
      renderDetail(group);
    };
    li.appendChild(btn);
    els.resultList.appendChild(li);
  });
}

function relatedRoots(entries) {
  const ids = Array.from(new Set(entries.flatMap((entry) => splitIds(entry.related_entry_ids)).filter((id) => id.startsWith("RM-"))));
  return state.roots.filter((r) => ids.includes(r.entry_id));
}

function sourceIdsForGroup(group) {
  const ids = new Set();
  (group.entries || []).forEach((entry) => {
    if (entry.entry_id) {
      if (entry.entry_id.startsWith("DM-")) {
        ids.add(entry.entry_id.replace(/^DM-/, ""));
      } else if (!entry.entry_id.startsWith("DX-")) {
        ids.add(entry.entry_id);
      }
    }
    splitIds(entry.related_entry_ids).forEach((id) => {
      if (/^(LX|RM|DX|DM|XR)-/i.test(id)) {
        ids.add(id);
      }
    });
  });
  return ids;
}

function relatedExamples(group) {
  const entries = group.entries || [];
  const explicitIds = Array.from(new Set(entries.flatMap((entry) => splitIds(entry.related_entry_ids)).filter((id) => id.startsWith("PE-"))));
  const explicitExamples = state.phrases.filter((p) => explicitIds.includes(p.entry_id));
  const sourceIds = sourceIdsForGroup(group);
  const reverseLinkedExamples = state.phrases.filter((phrase) => {
    const ids = splitIds(phrase.related_entry_ids);
    return ids.some((id) => sourceIds.has(id));
  });

  const term = normalizeHeadword(group.term);
  const termRegex = term
    ? new RegExp(`(^|[^a-z])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`, "i")
    : null;

  const matchedExamples = termRegex
    ? state.phrases.filter((phrase) => termRegex.test((phrase.celan_text || "").toLowerCase()))
    : [];

  const merged = [...explicitExamples];
  [...reverseLinkedExamples, ...matchedExamples].forEach((phrase) => {
    if (!merged.some((existing) => existing.entry_id === phrase.entry_id)) {
      merged.push(phrase);
    }
  });

  const deduped = [];
  const seen = new Set();
  merged.forEach((phrase) => {
    const key = `${(phrase.celan_text || "").trim()}::${(phrase.translation || "").trim()}`;
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(phrase);
  });

  if (!deduped.length) {
    return extractInlineExamples(entries);
  }

  return deduped;
}

function extractInlineExamples(entries) {
  const extracted = [];
  const seen = new Set();
  const pattern = /(?:Example:\s*)?([^()]+?\.)\s*\((?:[“"])?([^)”"]+)(?:[”"])?\)/g;

  entries.forEach((entry) => {
    const text = (entry.original_wording || "").trim();
    if (!text) return;
    const headword = (entry.celan_term || "").trim();

    let match;
    while ((match = pattern.exec(text)) !== null) {
      const celanText = cleanInlineExampleText(headword, (match[1] || "").trim());
      const translation = (match[2] || "").trim();
      if (!celanText || !translation) continue;
      const key = `${celanText}::${translation}`;
      if (seen.has(key)) continue;
      seen.add(key);
      extracted.push({
        entry_id: `INLINE-${entry.entry_id}-${extracted.length + 1}`,
        celan_text: celanText,
        translation
      });
    }
  });

  return extracted;
}

function cleanInlineExampleText(headword, rawText) {
  let text = (rawText || "").replace(/^[/\s]*Example:\s*/i, "").replace(/^[/\s]+/, "").trim();
  const sentenceParts = text.split(/(?<=\.)\s+/).filter(Boolean);
  if (sentenceParts.length > 1) {
    text = sentenceParts[sentenceParts.length - 1].trim();
  }
  if (headword && text.startsWith(`${headword} `)) {
    const repeatIndex = text.toLowerCase().indexOf(` ${headword.toLowerCase()} `);
    if (repeatIndex !== -1) {
      text = text.slice(repeatIndex + 1).trim();
    }
  }
  return text;
}

function buildPronunciation(term) {
  const raw = (term || "").trim();
  if (!raw) return "";
  const lookup = raw.toLowerCase();
  if (PRONUNCIATION_OVERRIDES[lookup]) {
    return PRONUNCIATION_OVERRIDES[lookup];
  }
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z'\/\-\s]/g, "")
    .trim();
  if (!cleaned) return "";

  const vowels = new Set(["a", "e", "i", "o", "u"]);
  const vowelSounds = {
    a: "ah",
    e: "eh",
    i: "ee",
    o: "oh",
    u: "oo"
  };

  function syllabifyChunk(chunk) {
    if (!chunk) return "";
    let out = "";
    for (let i = 0; i < chunk.length; i++) {
      const ch = chunk[i];
      const prev = chunk[i - 1] || "";
      const next = chunk[i + 1] || "";
      out += ch;

      if (ch === "'") continue;

      const isVowel = vowels.has(ch);
      const nextIsVowel = vowels.has(next);
      const prevIsVowel = vowels.has(prev);

      if (isVowel && nextIsVowel) {
        out += "-";
        continue;
      }

      if (
        isVowel &&
        next &&
        !nextIsVowel &&
        chunk[i + 2] &&
        vowels.has(chunk[i + 2]) &&
        !prevIsVowel
      ) {
        out += "-";
      }
    }
    return out.replace(/--+/g, "-").replace(/^-|-$/g, "");
  }

  function soundifyChunk(chunk) {
    if (!chunk) return "";
    let out = "";
    for (let i = 0; i < chunk.length; i++) {
      const ch = chunk[i];
      if (ch === "'" || ch === "-") {
        out += ch;
        continue;
      }
      out += vowelSounds[ch] || ch;
    }
    return out;
  }

  const spoken = cleaned
    .split(/\s+/)
    .map((word) => word
      .split(/([\/-])/)
      .map((piece) => {
        if (piece === "/" || piece === "-") return piece;
        return soundifyChunk(syllabifyChunk(piece));
      })
      .join("")
    )
    .join(" ");

  return `/${spoken}/`;
}

function findBestLexiconMatch(rootTerm) {
  const needle = (rootTerm || "").toLowerCase();
  if (!needle) return null;
  const exact = state.groupedEntries.find((group) => normalizeHeadword(group.term) === needle);
  if (exact) return exact;
  const starts = state.groupedEntries.find((group) => normalizeHeadword(group.term).startsWith(needle));
  if (starts) return starts;
  const contains = state.groupedEntries.find((group) => normalizeHeadword(group.term).includes(needle));
  return contains || null;
}

function jumpToWordFamily(rootTerm) {
  state.activeLetter = "ALL";
  renderAzBar();
  els.searchInput.value = rootTerm;
  applyFilters();
  const match = findBestLexiconMatch(rootTerm);
  if (match) {
    state.selectedId = match.id;
    renderList();
    renderDetail(match);
  }
}

function jumpToHeadword(headword) {
  const match = state.groupedEntries.find((group) => group.id === normalizeHeadword(headword));
  if (!match) return;
  state.activeLetter = "ALL";
  renderAzBar();
  els.searchInput.value = "";
  applyFilters();
  state.selectedId = match.id;
  renderList();
  renderDetail(match);
}

function renderFamilyLinks(items, attributeName) {
  return items.map((item, index) => {
    const label = typeof item === "string" ? item : (attributeName === "data-root-term" ? item : item.term);
    const suffix = index < items.length - 1 ? '<span class="family-separator">, </span>' : "";
    return `<button class="family-link" ${attributeName}="${label}">${label}</button>${suffix}`;
  }).join("");
}

function isRootUse(use) {
  return !!use.rootWord || (use.type || "").toLowerCase() === "root";
}

function displayUseType(group, use) {
  return use.type || "";
}

function displayRootWordMarker(group, use) {
  const hasRootUse = group.uses.some((candidate) => candidate.rootWord);
  return hasRootUse ? "Root Word" : "";
}

function displayUsageNote(use) {
  const usage = (use.usage || "").trim();
  if (!usage) return "";
  if (/^original .* preserved\.$/i.test(usage)) return "";
  if (/^dictionary-layer entry/i.test(usage)) return "";
  if (/^source extraction remains unchanged\.$/i.test(usage)) return "";
  if (/^source files unchanged\.$/i.test(usage)) return "";
  if (/^root family evidence:/i.test(usage)) return "";
  return usage;
}

function renderDetail(group) {
  const roots = relatedRoots(group.entries);
  const examples = relatedExamples(group);
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
  const hasFamilyContent = familyRoots.length || relatedEntries.length;
  const displayExamples = override?.examples?.length ? override.examples : examples;
  const primaryUses = group.uses.some((use) => !isRootUse(use))
    ? group.uses.filter((use) => !isRootUse(use))
    : group.uses;
  const useMarkup = primaryUses.map((use) => {
    const displayType = displayUseType(group, use);
    const rootWordMarker = displayRootWordMarker(group, use);
    const usageNote = displayUsageNote(use);
    return `
      <section class="sense-block">
        ${displayType ? `<p class="sense-type">${displayType}</p>` : ""}
        ${rootWordMarker ? `<p class="sense-marker">${rootWordMarker}</p>` : ""}
        <p>${use.meaning || "No meaning available."}</p>
        ${usageNote ? `<p class="sense-usage">${usageNote}</p>` : ""}
      </section>
    `;
  }).join("");

  els.emptyState.classList.add("hidden");
  els.detailView.classList.remove("hidden");
  els.detailView.innerHTML = `
    <h2 class="entry-word">${group.term}</h2>
    <p class="entry-pronunciation">${pronunciation || "Pronunciation not available."}</p>
    <div class="detail-grid">
      <section class="card">
        <h3>Meaning</h3>
        ${useMarkup}
      </section>
      ${hasFamilyContent ? `
      <section class="card">
        <h3>Word Family</h3>
        ${familyRoots.length
          ? `<div class="family-group"><p class="family-label">Root</p><p class="family-line">${renderFamilyLinks(familyRoots, "data-root-term")}</p></div>`
          : ""}
        ${relatedEntries.length
          ? `<div class="family-group"><p class="family-label">Related words</p><p class="family-line">${renderFamilyLinks(relatedEntries, "data-headword")}</p></div>`
          : (!familyRoots.length ? `` : `<p>No related word family listed.</p>`)}
      </section>
      ` : ""}
      ${displayExamples.length ? `
      <section class="card sentence-card">
        <h3>Used In A Sentence</h3>
        <p>${displayExamples.slice(0, 5).map((e) => `${e.celan_text}\n${e.translation ? `"${e.translation}"` : ""}`).join("\n\n")}</p>
      </section>
      ` : ""}
    </div>
  `;

  els.detailView.querySelectorAll(".family-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.headword) {
        jumpToHeadword(btn.dataset.headword);
        return;
      }
      jumpToWordFamily(btn.dataset.rootTerm || "");
    });
  });
}

async function init() {
  const [lexicon, roots, phrases, expandedRoots, grammarRules] = await Promise.all([
    loadCsv("../data/lexicon.csv"),
    loadCsv("../data/roots_and_morphology.csv"),
    loadCsv("../data/phrases_and_examples.csv"),
    loadCsv("../data/expanded_root_database.csv"),
    loadCsv("../data/grammar_rules.csv")
  ]);
  state.lexicon = lexicon;
  const rootEntries = buildRootEntries(expandedRoots);
  const morphologyEntries = buildMorphologyEntries(roots);
  const supplementalEntries = buildSupplementalDictionaryEntries();
  state.wordEntries = lexicon.filter(isWordEntry).concat(rootEntries, morphologyEntries, supplementalEntries);
  state.groupedEntries = buildGroupedEntries(state.wordEntries);
  state.expandedRoots = expandedRoots;
  state.roots = roots;
  state.phrases = phrases;
  state.grammarRules = buildRuleEntries(grammarRules);
  state.familyIndex = buildFamilyIndex(state.groupedEntries, state.expandedRoots, state.roots);
  state.forgeParts = collectForgeParts(state.groupedEntries, state.roots);
  renderActiveView();
  renderWordTypeFilter();
  renderAzBar();
  applyFilters();
  applyRuleFilters();
  renderForgeIdle();
}

els.searchInput.addEventListener("input", applyFilters);
els.wordTypeFilter?.addEventListener("change", () => {
  state.activeWordType = els.wordTypeFilter.value || "ALL";
  applyFilters();
});
els.ruleSearchInput.addEventListener("input", applyRuleFilters);
els.forgeForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitForge();
});
els.dictionaryViewBtn.addEventListener("click", () => {
  state.activeView = "dictionary";
  renderActiveView();
});
els.rulesViewBtn.addEventListener("click", () => {
  state.activeView = "rules";
  renderActiveView();
});
els.forgeViewBtn.addEventListener("click", () => {
  state.activeView = "forge";
  renderActiveView();
});

init().catch((err) => {
  els.emptyState.classList.remove("hidden");
  els.emptyState.textContent = `Failed to load dictionary data: ${err.message}`;
});
