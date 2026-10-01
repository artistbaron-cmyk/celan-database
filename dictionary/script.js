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

const RESULT_BATCH_SIZE = 100;
let RULE_LESSONS = [];
let RULE_COMPANIONS = [];
let CULTURAL_LENSES = {};
let RETRIEVAL_PACKS = [];
const appHeadwords = new Map();

const state = {
  visibleResultCount: RESULT_BATCH_SIZE,
  lexicon: [],
  wordEntries: [],
  groupedEntries: [],
  grammarRules: [],
  expandedRoots: [],
  familyIndex: new Map(),
  forgeParts: [],
  roots: [],
  phrases: [],
  expressions: [],
  filteredExpressions: [],
  filtered: [],
  filteredRules: [],
  selectedId: null,
  selectedExpressionId: null,
  selectedRuleId: null,
  activeLetter: "ALL",
  activeWordType: "ALL",
  searchMode: "all",
  activeView: "dictionary",
  forgeLastSubmitted: "",
  forgeIsLoading: false
};

const els = {
  dictionaryViewBtn: document.getElementById("dictionaryViewBtn"),
  expressionsViewBtn: document.getElementById("expressionsViewBtn"),
  rulesViewBtn: document.getElementById("rulesViewBtn"),
  forgeViewBtn: document.getElementById("forgeViewBtn"),
  dictionaryView: document.getElementById("dictionaryView"),
  expressionsView: document.getElementById("expressionsView"),
  rulesView: document.getElementById("rulesView"),
  forgeView: document.getElementById("forgeView"),
  searchInput: document.getElementById("searchInput"),
  loadMoreResults: document.getElementById("loadMoreResults"),
  searchMode: document.getElementById("searchMode"),
  searchHelp: document.getElementById("searchHelp"),
  wordTypeFilter: document.getElementById("wordTypeFilter"),
  expressionSearchInput: document.getElementById("expressionSearchInput"),
  expressionTypeFilter: document.getElementById("expressionTypeFilter"),
  expressionNationFilter: document.getElementById("expressionNationFilter"),
  expressionResultList: document.getElementById("expressionResultList"),
  expressionResultCount: document.getElementById("expressionResultCount"),
  expressionEmptyState: document.getElementById("expressionEmptyState"),
  expressionDetailView: document.getElementById("expressionDetailView"),
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
  entryBack: document.getElementById("entryBack"),
  entryForward: document.getElementById("entryForward"),
  entryHistoryStatus: document.getElementById("entryHistoryStatus"),
  detailView: document.getElementById("detailView")
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

async function loadJson(path) {
  const embedded = window.EMBEDDED_DATA;
  const basename = path.split('/').pop();
  const text = embedded && (embedded[path.replace(/^\.\//, '')] || embedded[basename]);
  if (text) return JSON.parse(text);
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return JSON.parse(await response.text());
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
    displayUses(group).forEach((use) => {
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
  const expressionsActive = state.activeView === "expressions";
  const rulesActive = state.activeView === "rules";
  const forgeActive = state.activeView === "forge";
  els.dictionaryView.classList.toggle("hidden", !dictionaryActive);
  els.expressionsView.classList.toggle("hidden", !expressionsActive);
  els.rulesView.classList.toggle("hidden", !rulesActive);
  els.forgeView.classList.toggle("hidden", !forgeActive);
  els.dictionaryViewBtn.classList.toggle("active", dictionaryActive);
  els.expressionsViewBtn.classList.toggle("active", expressionsActive);
  els.rulesViewBtn.classList.toggle("active", rulesActive);
  els.forgeViewBtn.classList.toggle("active", forgeActive);
}

function escapeMarkup(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inferExpressionNation(text) {
  const source = String(text || "").toLowerCase();
  return EXPRESSION_NATIONS.find((nation) => source.includes(nation.toLowerCase())) || "";
}

function expressionKey(value) {
  return String(value || "").trim().toLowerCase().replace(/[.!?]+$/g, "");
}

function joinExpressionValues(left, right, separator = " / ") {
  const values = [...String(left || "").split(separator), ...String(right || "").split(separator)]
    .map((value) => value.trim()).filter(Boolean);
  return [...new Set(values)].join(separator);
}

function buildExpressionEntries(expressionRows, lexiconRows, phraseRows) {
  const entries = [];

  lexiconRows.filter((row) => EXPRESSION_CATEGORY_TYPES[row.category]).forEach((row) => {
    const type = EXPRESSION_CATEGORY_TYPES[row.category];
    const isSlur = type === "Slur";
    entries.push({
      expression_id: `EX-SRC-${row.entry_id}`,
      celan_expression: row.celan_term,
      pronunciation: buildPronunciation(row.celan_term, [row]),
      natural_meaning: row.english_meaning,
      literal_meaning: "",
      expression_type: type,
      register: row.category,
      origin_nation: inferExpressionNation(`${row.source_section} ${row.usage_context}`),
      social_context: row.usage_context,
      tone_or_risk: isSlur ? "Offensive language targeting a national community. Source wording is preserved for cultural documentation." : "",
      source_entry_ids: row.entry_id,
      dictionary_headwords: row.celan_term,
      canon_status: row.canon_status,
      review_status: row.review_status,
      review_reason: row.review_reason,
      approval_batch: "Source canon",
      notes: row.notes
    });
  });

  phraseRows.filter((row) => row.example_type === "Idiom/Proverb").forEach((row) => {
    const literal = (row.analysis.match(/Literal:\s*([^;]+)/i) || [])[1] || "";
    const theme = (row.analysis.match(/Theme:\s*(.+)$/i) || [])[1] || row.source_section;
    entries.push({
      expression_id: `EX-SRC-${row.entry_id}`,
      celan_expression: row.celan_text,
      pronunciation: buildPronunciation(row.celan_text, []),
      natural_meaning: row.translation,
      literal_meaning: literal,
      expression_type: "Idiom or proverb",
      register: "Proverbial",
      origin_nation: inferExpressionNation(`${row.translation} ${row.analysis}`),
      social_context: theme,
      tone_or_risk: "",
      source_entry_ids: row.entry_id,
      dictionary_headwords: "",
      canon_status: row.canon_status,
      review_status: row.review_status,
      review_reason: row.review_reason,
      approval_batch: "Source canon",
      notes: row.notes
    });
  });

  expressionRows.forEach((row) => entries.push({ ...row }));

  const deduped = new Map();
  entries.forEach((entry) => {
    const key = expressionKey(entry.celan_expression);
    if (!deduped.has(key)) {
      deduped.set(key, { ...entry });
      return;
    }
    const existing = deduped.get(key);
    existing.natural_meaning = joinExpressionValues(existing.natural_meaning, entry.natural_meaning);
    existing.source_entry_ids = joinExpressionValues(existing.source_entry_ids, entry.source_entry_ids, "; ");
    existing.dictionary_headwords = joinExpressionValues(existing.dictionary_headwords, entry.dictionary_headwords, "; ");
    existing.review_status = joinExpressionValues(existing.review_status, entry.review_status);
    existing.review_reason = joinExpressionValues(existing.review_reason, entry.review_reason);
    existing.notes = joinExpressionValues(existing.notes, entry.notes);
    existing.tone_or_risk = joinExpressionValues(existing.tone_or_risk, entry.tone_or_risk);
  });

  return [...deduped.values()].map((entry) => ({
    ...entry,
    searchText: Object.values(entry).join(" ").toLowerCase()
  })).sort((a, b) => (a.celan_expression || "").localeCompare(b.celan_expression || ""));
}

function renderExpressionFilters() {
  const populate = (select, values, allLabel) => {
    select.innerHTML = "";
    ["ALL", ...values].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value === "ALL" ? allLabel : value;
      select.appendChild(option);
    });
  };
  populate(els.expressionTypeFilter, [...new Set(state.expressions.map((entry) => entry.expression_type).filter(Boolean))].sort(), "All expression types");
  populate(els.expressionNationFilter, [...new Set(state.expressions.map((entry) => entry.origin_nation).filter(Boolean))].sort(), "All cultural origins");
}

function applyExpressionFilters() {
  const query = els.expressionSearchInput.value.trim().toLowerCase();
  const type = els.expressionTypeFilter.value || "ALL";
  const nation = els.expressionNationFilter.value || "ALL";
  state.filteredExpressions = state.expressions.filter((entry) => {
    if (type !== "ALL" && entry.expression_type !== type) return false;
    if (nation !== "ALL" && entry.origin_nation !== nation) return false;
    return !query || entry.searchText.includes(query);
  });
  renderExpressionList();
}

function renderExpressionList() {
  els.expressionResultList.innerHTML = "";
  els.expressionResultCount.textContent = `${state.filteredExpressions.length} results`;
  if (!state.filteredExpressions.length) {
    const item = document.createElement("li");
    item.textContent = "No expressions match these filters.";
    els.expressionResultList.appendChild(item);
    return;
  }
  state.filteredExpressions.forEach((entry) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = entry.expression_id === state.selectedExpressionId ? "active" : "";
    const kicker = document.createElement("span");
    kicker.className = "expression-kicker";
    kicker.textContent = [entry.expression_type, entry.origin_nation].filter(Boolean).join(" · ");
    const term = document.createElement("span");
    term.className = "term";
    term.textContent = entry.celan_expression;
    const meaning = document.createElement("span");
    meaning.className = "sub";
    meaning.textContent = entry.natural_meaning;
    button.append(kicker, term, meaning);
    button.addEventListener("click", () => {
      state.selectedExpressionId = entry.expression_id;
      renderExpressionList();
      renderExpressionDetail(entry);
    });
    item.appendChild(button);
    els.expressionResultList.appendChild(item);
  });
}

function expressionHeadwords(entry) {
  const listed = splitIds(entry.dictionary_headwords);
  return listed.filter((headword) => {
    const clean = headword.replace(/[.!?]+$/g, "");
    return state.groupedEntries.some((group) => group.id === normalizeHeadword(clean));
  }).map((headword) => headword.replace(/[.!?]+$/g, ""));
}

function renderExpressionDetail(entry) {
  const isSlur = entry.expression_type === "Slur";
  const headwords = expressionHeadwords(entry);
  const tags = [entry.expression_type, entry.register, entry.origin_nation]
    .filter(Boolean).map((value) => `<span class="expression-tag">${escapeMarkup(value)}</span>`).join("");
  els.expressionEmptyState.classList.add("hidden");
  els.expressionDetailView.classList.remove("hidden");
  els.expressionDetailView.innerHTML = `
    <h2 class="entry-word">${escapeMarkup(entry.celan_expression)}</h2>
    <p class="entry-pronunciation">${escapeMarkup(entry.pronunciation || "Pronunciation not available.")}</p>
    <div class="expression-meta">${tags}</div>
    ${isSlur ? `<p class="expression-warning"><strong>Offensive language:</strong> This entry documents how national hostility appears in Celan. It should not be treated as neutral address.</p>` : ""}
    <div class="detail-grid">
      <section class="card"><h3>Conventional meaning</h3><p>${escapeMarkup(entry.natural_meaning)}</p></section>
      ${entry.social_context ? `<section class="card"><h3>Where it lives</h3><p>${escapeMarkup(entry.social_context)}</p></section>` : ""}
      ${entry.tone_or_risk ? `<section class="card"><h3>Tone and boundaries</h3><p>${escapeMarkup(entry.tone_or_risk)}</p></section>` : ""}
      ${headwords.length ? `<section class="card"><h3>Related dictionary words</h3><div class="expression-headwords">${headwords.map((headword) => `<button class="expression-headword-link" type="button" data-expression-headword="${escapeMarkup(headword)}">${escapeMarkup(headword)}</button>`).join("")}</div></section>` : ""}
    </div>
  `;
  els.expressionDetailView.querySelectorAll("[data-expression-headword]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeView = "dictionary";
      renderActiveView();
      jumpToHeadword(button.dataset.expressionHeadword);
    });
  });
}

function isWordEntry(row) {
  const term = (row.celan_term || "").trim();
  if (!term) return false;
  if (term.includes(" ")) return false;
  if (/[,.!?;:/()]/.test(term)) return false;
  return true;
}

function normalizeHeadword(term) {
  return (term || "").normalize("NFKC").replace(/[‘’ʼ]/g, "'").trim().toLowerCase();
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
  if (category === "measure") return "Measure";
  if (category === "adverb") return "Adverb";
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
  if (category.includes("adjective")) return "Adjective";
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

// These primitives either have deliberate lexical entries or were approved only
// as derivational roots. Keep the internal records available for family analysis,
// but do not surface their technical descriptions as extra dictionary senses.
function buildRootEntries(expandedRoots) {
  return expandedRoots
    .filter((row) => (row.entry_type || "").toLowerCase() === "root")
    .filter((row) => !ROOT_ANALYSIS_SUPPRESSED_FORMS.has(cleanAlpha(row.form)))
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

function buildCreatureEntries(creatures) {
  return (creatures || [])
    .map((row, index) => {
      const name = (row.name || "").trim();
      if (!name) return null;
      const region = (row.region || "").trim();
      const creatureType = (row.creature_type || "").trim();
      const description = (row.description || "").trim();
      const role = (row.cultural_role || "").trim();
      const notes = (row.notes || "").trim();
      const usageParts = [];
      if (region) usageParts.push(region);
      if (description) usageParts.push(description);
      if (role) usageParts.push(`Cultural role: ${role}`);
      return {
        entry_id: `OHC-${String(index + 1).padStart(4, "0")}`,
        celan_term: name,
        english_meaning: creatureType || "Noun",
        category: "Noun",
        usage_context: usageParts.join("; "),
        original_wording: description || `${name} is a canon creature.`,
        notes: notes || "User-defined canon creature.",
        canon_status: row.canon_status || "Canon"
      };
    })
    .filter(Boolean);
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

function buildRuleEntries(rows) {
  // App-facing decisions take precedence; source grammar rows remain unchanged as witnesses.

  rows = rows.map(row => REVIEWED_GRAMMAR_EXAMPLES[row.entry_id] ? {...row, examples: REVIEWED_GRAMMAR_EXAMPLES[row.entry_id]} : row);
  const superseded = new Set(rows.some(row => row.entry_id === 'GR-DR1-0001')
    ? SUPERSEDED_GRAMMAR_IDS : []);
  const reviewGroups = [...new Set(state.phrases.map(p=>p.app_grammar_group).filter(Boolean))];
  rows = [...rows, ...reviewGroups.map((name,i)=>({
    entry_id:`GR-ER2-${String(i+1).padStart(4,'0')}`, rule_name:`${name}: reviewed illustrations`,
    category:name, source_section:name, source_volume:REVIEWED_GRAMMAR_GROUP_TEXT.source_volume, canon_status:'Canon',
    original_wording:REVIEWED_GRAMMAR_GROUP_TEXT.original_wording,
    examples:state.phrases.filter(p=>p.app_grammar_group===name).map(p=>`${p.celan_text} — ${p.translation} [${p.entry_id}]`).join('\n'),
    notes:REVIEWED_GRAMMAR_GROUP_TEXT.notes
  }))];
  const rawEntries = rows
    .filter(row => !superseded.has(row.entry_id))
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
      scrollRuleDetailIntoView();
    });
  });
}

function scrollRuleDetailIntoView() {
  if (!window.matchMedia("(max-width: 950px)").matches) return;
  const target = els.ruleDetailView.classList.contains("hidden")
    ? document.querySelector(".rules-detail-panel")
    : els.ruleDetailView;
  if (!target) return;
  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
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
      scrollRuleDetailIntoView();
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
      if (selected) {
        renderRuleDetail(selected);
        scrollRuleDetailIntoView();
      }
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
  const exampleText = (rule.examples || "").replace(/\s*\[[A-Z]{2,3}-[A-Z0-9-]+\]/g, "").trim();
  const bodyText = getRuleBodyText(rule);
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

function headwordOverride(term) {
  return appHeadwords.get(normalizeHeadword(term))?.override || null;
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
    const hasRootWord = uses.some((use) => use.rootWord);
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
      const overrideUses = override.uses.map((use) => ({
        ...use,
        rootWord: false,
        sourceEntries: group.entries.map((entry) => entry.entry_id)
      }));
      const additiveUses = group.entries
        .filter((entry) => /\bapproved additive displayed sense\b/i.test(entry.notes || ""))
        .flatMap(buildUses);
      const overrideKeys = new Set(overrideUses.map((use) =>
        `${(use.type || "").toLowerCase()}::${(use.meaning || "").toLowerCase()}`
      ));
      uses = overrideUses.concat(additiveUses.filter((use) => {
        const key = `${(use.type || "").toLowerCase()}::${(use.meaning || "").toLowerCase()}`;
        return !overrideKeys.has(key);
      }));
    }
    const visibleUses = displayUses({ term: group.term, uses });
    const hasVisibleLexicalEntry = group.entries.some((entry) => buildUses(entry).some((use) => !isRootUse(use)));
    const searchableEntries = hasVisibleLexicalEntry && !headwordOverride(group.term)?.showRootSense
      ? group.entries.filter((entry) => buildUses(entry).some((use) => !isRootUse(use)))
      : group.entries;
    const preview = visibleUses.slice(0, 2).map((use) => {
      return use.type ? `${use.type}: ${use.meaning}` : use.meaning;
    }).join(" ; ");
    return {
      ...group,
      uses,
      hasRootWord,
      preview,
      // English lookup must use the same curated senses as the detail view.
      // Reintroducing source rows here bypasses overrides and root suppression.
      englishSenses: visibleUses,
      searchText: normalizeHeadword(searchableEntries.map((entry) => [
        entry.celan_term,
        entry.english_meaning,
        entry.category,
        entry.original_wording,
        entry.usage_context,
        displayDerivation(entry.derivation),
        entry.origin_nation,
        entry.national_usage,
        entry.variant_forms
      ].join(" ")).join(" ") + " " + (override?.aliases || []).join(" ") + " " + preview)
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

// Family identities distinguish a free root from a prefix or suffix with the same letters.
function familyIdentity(form, type = "") {
  const word = normalizeHeadword(form);
  if (word.startsWith('-') || /^suffix/i.test(type)) return `suffix:${cleanAlpha(word)}`;
  if (/^(?:prefix|numeric\/math prefix)/i.test(type)) return `prefix:${cleanAlpha(word)}`;
  return `root:${cleanAlpha(word)}`;
}

function buildRootLookup(expandedRoots, roots) {
  const seen = new Map();
  const add = (form, type, meaning, evidence, ids = []) => {
    if (!form || form.includes('/')) return; // Comparison headings are not single roots.
    const id = familyIdentity(form, type);
    const affix = /^(suffix|prefix):/.test(id);
    const label = id.startsWith('suffix:') ? `-${cleanAlpha(form)}`
      : id.startsWith('prefix:') ? `${form.replace(/-+$/, '')}-` : form;
    const terms = extractEvidenceTerms(evidence);
    if (seen.has(id)) {
      const old = seen.get(id);
      old.evidenceTerms = uniqueStrings([...old.evidenceTerms, ...terms]);
      old.linkedEntryIds = uniqueStrings([...old.linkedEntryIds, ...ids]);
      old.meanings = uniqueStrings([...old.meanings, meaning]);
      old.meaning = old.meanings.join('; ');
      return;
    }
    seen.set(id, {id, form:label, normalized:cleanAlpha(form), meaning, meanings:[meaning],
      evidenceTerms:terms, evidence:terms, linkedEntryIds:ids, anchorType:type.toLowerCase(), sharedAffix:affix});
  };
  expandedRoots.filter(r => isFamilyAnchorType(r.entry_type)).forEach(r =>
    add(r.form, r.entry_type, r.core_meaning || '', r.evidence_hint));
  roots.filter(r => isFamilyAnchorType(r.type) || /suffix|prefix|particle|preposition/i.test(r.type)).forEach(r =>
    add(r.root_or_morpheme, r.type, r.meaning_or_function || '', r.derived_forms,
      splitIds(r.related_entry_ids).filter(id => id.startsWith('LX-'))));
  // ED-0038 supersedes the old combined KA explanation in the app-facing layer.
  if (seen.has('root:ka')) Object.assign(seen.get('root:ka'), {
    meaning:ROOT_KA_DISPLAY.standalone,
    evidenceTerms:seen.get('root:ka').evidenceTerms.filter(t => !normalizeHeadword(t).startsWith('-'))
  });
  if (seen.has('suffix:ka')) seen.get('suffix:ka').meaning = ROOT_KA_DISPLAY.suffix;
  return [...seen.values()].sort((a,b) => b.normalized.length-a.normalized.length);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractEvidenceTerms(value) {
  // Accept only actual forms; equations and prose remain source evidence, not inferred words.
  return uniqueStrings((value || '').split(';').flatMap(chunk => {
    if (/[+=]/.test(chunk)) return [];
    return chunk.replace(/\([^)]*\)/g, '').split(/[,/]/).map(t => t.trim())
      .filter(t => /^[-\p{L}’']+$/u.test(t));
  }));
}

function derivationSource(entry) {
  if (entry.derivation) return entry.derivation.trim();
  const original = (entry.original_wording || '').match(/(?:Derivation:|Derived From:|Root:|Built From:)\s*([^\n]+)/i);
  if (original) return original[1].trim();
  const usage = entry.usage_context || '';
  return /\+|derived from|derivation:|root:|built from/i.test(usage) ? usage.trim() : '';
}

function recordedComponents(text) {
  if (!text || !text.includes('+') || /^Source-attested polysemy|^Independent|^Unsegmented/i.test(text)) return [];
  return text.split('+').flatMap((raw, index) => {
    const part = raw.trim().replace(/^(?:derivation:|derived from:?|built from:?|built on:?|root:|canonical|established|existing|new (?:(?:one|two)-syllable )?primitive(?: root)?[: ]*|nominal agent|historical)\s*/i,'');
    const match = part.match(/^([-A-Za-z‘’']+)(.*)$/s);
    if (!match || /^(noun-forming|source-attested|approved|the)$/i.test(match[1])) return [];
    return [{form:match[1], description:match[2].trim().split(/[.;]/)[0], source:text}];
  });
}

function componentIdentity(form, rootLookup) {
  const prefix = familyIdentity(form, 'prefix');
  return form.endsWith('-') && rootLookup.some(r=>r.id===prefix) ? prefix : familyIdentity(form);
}

function extractDerivationAnchors(text, rootLookup) {
  return recordedComponents(text).flatMap(part => {
    const id = componentIdentity(part.form, rootLookup);
    return rootLookup.filter(root => root.id === id);
  });
}

function detectFamilyRoots(group, rootLookup) {
  if (group.entries.every(e => (e.entry_id || '').startsWith('OHC-'))) return [];
  const own = familyIdentity(group.term, displayUses(group)[0]?.type || '');
  const direct = rootLookup.filter(root => (!/^(suffix|prefix):/.test(own) || root.id === own) && (root.id === own ||
    root.evidenceTerms.some(t => normalizeHeadword(t) === normalizeHeadword(group.term)) ||
    group.entries.some(e => root.linkedEntryIds.includes(e.entry_id))));
  const explicit = group.entries.flatMap(e => extractDerivationAnchors(derivationSource(e), rootLookup));
  // Exact root-name matches must not hide an explicitly recorded derivation.
  return [...new Map([...direct,...explicit].map(root => [root.id,root])).values()];
}

function isSharedAffix(root) {
  return !!root.sharedAffix || /^-/.test(root.form) || /^(?:suffix|prefix|numeric\/math prefix)/.test(root.anchorType);
}

function buildFamilyIndex(groupedEntries, expandedRoots, roots) {
  const lookup = buildRootLookup(expandedRoots, roots);
  const groups = new Map(groupedEntries.map(g => [g.id,g]));
  const lookupById = new Map(lookup.map(r=>[r.id,r]));
  const componentWord = form => groups.get(normalizeHeadword(form)) ||
    (!form.startsWith('-') && !form.endsWith('-') ? groups.get(normalizeHeadword(form.replace(/-$/, ''))) : null);
  const partsByGroup = new Map();
  const members = new Map();
  const addMember = (key,group) => { if(!members.has(key)) members.set(key,[]); members.get(key).push(group); };
  groupedEntries.forEach(group => {
    const explicit = group.entries.flatMap(entry => recordedComponents(derivationSource(entry)).map(part => {
      const componentId = componentIdentity(part.form, lookup);
      const affix = /^(suffix|prefix):/.test(componentId);
      const anchor = lookupById.get(componentId);
      const word = componentWord(part.form);
      // ED-0039 explanations are scoped to their specific words, especially homonymous suffixes.
      const scoped = (affix && /ED-0039/.test(entry.notes || ''))
        || (group.id === 'jekvarin' && normalizeHeadword(part.form) === 'varin'); // ED-0039: marine homonym, not cognition.
      return {...part, id:scoped || (!anchor && !word) ? `local:${group.id}:${part.form}` : anchor?.id || `word:${word.id}`,
        kind:scoped ? 'local' : affix ? (anchor ? 'affix' : 'local') : anchor ? 'root' : word ? 'word' : 'local',
        target:scoped ? null : word?.id || null,
        meaning:part.description || anchor?.meaning || '',
        entryId:entry.entry_id};
    }));
    const rootsFound = detectFamilyRoots(group,lookup);
    // A scoped affix must never be replaced by the inventory's different sense.
    const scopedForms = new Set(explicit.filter(p=>p.kind==='local').map(p=>normalizeHeadword(p.form)));
    const parts = rootsFound.filter(r=>!scopedForms.has(normalizeHeadword(r.form))).map(r=>({
      id:r.id, form:r.form, kind:isSharedAffix(r)?'affix':'root', meaning:r.meaning,
      target:componentWord(r.form)?.id || null
    }));
    const all = [...new Map([...parts,...explicit].map(p=>[p.id,p])).values()];
    partsByGroup.set(group.id,all);
    all.filter(p=>p.kind!=='local').forEach(p=>addMember(p.id,group));
    // Existing base words get a reciprocal family, even if they are not primitive roots.
    addMember(`word:${group.id}`,group);
  });
  const index = new Map();
  groupedEntries.forEach(group => {
    const parts = partsByGroup.get(group.id);
    const ownId = familyIdentity(group.term, displayUses(group)[0]?.type || '');
    const keys = uniqueStrings([...parts.filter(p=>p.kind==='root'||p.kind==='word').map(p=>p.id),
      `word:${group.id}`, ...(/^(suffix|prefix):/.test(ownId) ? [ownId] : [])]);
    const allowed = headwordOverride(group.term)?.familyTerms;
    const buckets = keys.map(key=>({key,label:lookupById.get(key)?.form || groups.get(key.replace(/^word:/,''))?.term || key,
      entries:uniqueById(members.get(key)||[]).filter(g=>g.id!==group.id && (!allowed || allowed.includes(g.term)))
        .sort((a,b)=> Number(cleanAlpha(b.term)===cleanAlpha(lookupById.get(key)?.form || '')) - Number(cleanAlpha(a.term)===cleanAlpha(lookupById.get(key)?.form || '')) || a.term.localeCompare(b.term))})).filter(b=>b.entries.length);
    const curated = (allowed || []).map(term=>groups.get(normalizeHeadword(term))).filter(Boolean);
    if(curated.length) buckets.unshift({key:'reviewed',label:'Reviewed links',entries:curated});
    const interleaved = Array.from({length:Math.max(0,...buckets.map(b=>b.entries.length))},(_,i)=>buckets.map(b=>b.entries[i]).filter(Boolean)).flat();
    index.set(group.id,{
      familyRoots:parts.filter(p=>p.kind==='root').map(p=>lookupById.get(p.id)?.form || p.form),
      sharedAffixes:parts.filter(p=>p.kind==='affix').map(p=>p.form),
      components:parts.filter(p=>p.entryId && normalizeHeadword(p.form)!==normalizeHeadword(group.term)),
      notes:group.entries.filter(e=>e.derivation && !recordedComponents(e.derivation).length).map(e=>e.derivation),
      relatedEntries:uniqueById(interleaved).map(g=>({id:g.id,term:g.term})),
      relatedGroups:buckets.map(b=>({...b,entries:b.entries.map(g=>({id:g.id,term:g.term}))}))
    });
  });
  return index;
}

function renderComponentLinks(components) {
  return components.map(part => {
    const label = escapeMarkup(part.form);
    const link = part.target ? `<button class="family-link" data-headword="${escapeMarkup(part.target)}">${label}</button>`
      : part.kind === 'root' || part.kind === 'affix' ? renderFamilyLinks([part.form], 'data-root-term') : `<strong>${label}</strong>`;
    return `<li>${link}${part.meaning ? ` — ${escapeMarkup(part.meaning)}` : ''}${part.kind==='local' ? ' <span class="sense-usage">(component in this word)</span>' : ''}</li>`;
  }).join('');
}

function normalizeEnglishSearch(value) {
  return (value || "").normalize("NFKC").toLowerCase()
    .replace(/[’']/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

function englishMeaningScore(meaning, query) {
  const q = normalizeEnglishSearch(query).replace(/^to /, "");
  if (!q) return 0;
  const exact = meaning.split(/[;,/]|\s+or\s+/i).some((sense) =>
    normalizeEnglishSearch(sense.replace(/\([^)]*\)/g, "")).replace(/^to /, "") === q);
  if (exact) return 3;
  const text = normalizeEnglishSearch(meaning);
  return (` ${text} `).includes(` ${q} `) ? 2 : 0;
}

function findEnglishMatches(group, query, type = "ALL") {
  return (group.englishSenses || []).filter((sense) => type === "ALL" || sense.type === type)
    .map((sense) => ({ ...sense, score: englishMeaningScore(sense.meaning, query) }))
    .filter((sense) => sense.score > 0).sort((a, b) => b.score - a.score);
}

function setSearchMode(mode) {
  state.searchMode = mode;
  els.searchMode.value = mode;
  state.activeLetter = "ALL";
  els.azBar.hidden = mode === "english";
  els.azBar.classList.toggle("hidden", mode === "english");
  els.searchInput.placeholder = mode === "english" ? "Enter an English word or phrase…" : "Search Celan term, meaning, or category...";
  els.searchHelp.textContent = mode === "english"
    ? "Exact meanings first, then definitions containing your word or phrase. Searches recorded meanings; unlisted synonyms may need different wording."
    : "Search all fields, or choose English → Celan to look up an English meaning.";
  renderAzBar();
  applyFilters();
}

function applyFilters() {
  state.visibleResultCount = RESULT_BATCH_SIZE;
  const q = normalizeHeadword(els.searchInput.value);
  const selectedType = state.activeWordType;
  state.filtered = state.groupedEntries.filter((group) => {
    if (state.searchMode !== "english" && state.activeLetter !== "ALL") {
      const starts = azBucket(group.term) === state.activeLetter;
      if (!starts) return false;
    }
    if (state.searchMode === "english" && q) {
      return findEnglishMatches(group, q, selectedType).length > 0;
    }
    if (selectedType !== "ALL") {
      const matchesType = displayUses(group).some((use) => (use.type || "").trim() === selectedType);
      if (!matchesType) return false;
    }
    return !q || group.searchText.includes(q);
  });
  const scores = new Map(state.searchMode === "english" && q
    ? state.filtered.map((group) => [group.id, findEnglishMatches(group, q, selectedType)[0].score]) : []);
  state.filtered.sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0)
    || (a.term || "").localeCompare(b.term || ""));
  renderList();
}

function renderList(appendFrom = 0) {
  if (!appendFrom) els.resultList.innerHTML = "";
  const shown = Math.min(state.visibleResultCount, state.filtered.length);
  const remaining = state.filtered.length - shown;
  els.resultCount.textContent = `Showing ${shown} of ${state.filtered.length} results`;
  els.loadMoreResults.hidden = remaining === 0;
  els.loadMoreResults.textContent = `Load ${Math.min(RESULT_BATCH_SIZE, remaining)} more`;
  if (!state.filtered.length) {
    const message = document.createElement("li");
    message.textContent = state.searchMode === "english"
      ? "No matching English meaning. Try another word or phrase, or choose All word types."
      : "No matches. Try another search or clear your filters.";
    els.resultList.appendChild(message);
  }
  state.filtered.slice(appendFrom, shown).forEach((group) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = group.id === state.selectedId ? "active" : "";
    const matches = state.searchMode === "english"
      ? findEnglishMatches(group, els.searchInput.value, state.activeWordType) : [];
    const preview = matches.length ? [...new Set(matches.map((sense) => sense.meaning))].join(" ; ") : (displayUses(group)[0]?.meaning || group.preview);
    const term = document.createElement("span");
    term.className = "term";
    term.textContent = group.term;
    const gloss = document.createElement("span");
    gloss.className = "sub";
    gloss.textContent = preview || "No gloss";
    btn.append(term, gloss);
    btn.onclick = () => {
      navigateEntry({ kind: "word", value: group.id }, () => {
        state.selectedId = group.id;
        renderList();
        renderDetail(group);
      });
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
  });
  return ids;
}

// ED-0044: source rows retain their identities; the app follows reviewed canonical links.
const exampleReviewIndexes = new WeakMap();
function exampleReviewIndex() {
  if (!exampleReviewIndexes.has(state.phrases)) {
    const byId = new Map(state.phrases.map(p => [p.entry_id,p]));
    const byText = new Map();
    for (const p of state.phrases) {
      if (p.app_canonical_id) continue;
      if (/^Reviewed|^Teaching note:/.test(p.example_type || '')) byText.set(exampleTextKey(p.celan_text),p);
      for (const old of JSON.parse(p.app_previous_texts || '[]')) byText.set(exampleTextKey(old),p);
    }
    for (const p of state.phrases) if (p.app_canonical_id && byId.has(p.app_canonical_id)) byText.set(exampleTextKey(p.celan_text),byId.get(p.app_canonical_id));
    exampleReviewIndexes.set(state.phrases,{byId,byText});
  }
  return exampleReviewIndexes.get(state.phrases);
}
function exampleTextKey(text) { return String(text || '').replace(/[\s.!?"“”]+/g,' ').trim().toLowerCase(); }
function reviewedExample(example) {
  const {byId,byText}=exampleReviewIndex();
  const row=byId.get(example.entry_id) || example;
  return row.app_canonical_id ? byId.get(row.app_canonical_id) || row : byText.get(exampleTextKey(row.celan_text)) || row;
}
function exampleAllowed(group,example) {
  const excluded=splitIds(example.app_excluded_headwords).map(normalizeHeadword);
  return !excluded.includes('*') && !excluded.includes(normalizeHeadword(group.term));
}

function relatedExamples(group) {
  if (group.canonicalExamples) return group.canonicalExamples.direct.concat(group.canonicalExamples.related, group.canonicalExamples.teaching);
  const entries = group.entries || [];
  const lexicalEntries = entries.filter((entry) => !/^(XR|DM)-/i.test(entry.entry_id || ""));
  const explicitIds = Array.from(new Set(lexicalEntries.flatMap((entry) => splitIds(entry.related_entry_ids)).filter((id) => id.startsWith("PE-"))));
  const explicitExamples = state.phrases.filter((p) => explicitIds.includes(p.entry_id));
  const sourceIds = sourceIdsForGroup(group);
  const reverseLinkedExamples = state.phrases.filter((phrase) => {
    const ids = splitIds(phrase.related_entry_ids);
    return ids.some((id) => sourceIds.has(id));
  });

  const forms = [group.term, ...(headwordOverride(group.term)?.aliases || []), ...entries.flatMap(e => splitIds(e.variant_forms))].map(normalizeHeadword).filter(Boolean);
  const termRegex = forms.length
    ? new RegExp(`(^|[^\\p{L}])(?:${forms.map(escapeRegex).join('|')})([^\\p{L}]|$)`, "iu")
    : null;

  const matchedExamples = termRegex
    ? state.phrases.filter((phrase) => termRegex.test(normalizeHeadword(phrase.celan_text)))
    : [];

  const attached = state.phrases.filter(p => splitIds(p.app_headwords).map(normalizeHeadword).includes(normalizeHeadword(group.term)));
  const merged = [...explicitExamples, ...attached];
  [...reverseLinkedExamples, ...matchedExamples].forEach((phrase) => {
    if (!merged.some((existing) => existing.entry_id === phrase.entry_id)) {
      merged.push(phrase);
    }
  });

  const deduped = [];
  const seen = new Set();
  merged.forEach((source) => {
    const phrase = reviewedExample(source);
    if (!exampleAllowed(group,phrase)) return;
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

// ED-0043: example provenance and a related form are not proof of direct usage.
function isDirectExample(group, text) {
  const tokens = normalizeHeadword(text).match(/[-\p{L}’']+/gu) || [];
  const forms = uniqueStrings([group.term, ...(headwordOverride(group.term)?.aliases || []),
    ...group.entries.flatMap(e=>splitIds(e.variant_forms))].map(normalizeHeadword));
  return forms.some(form => {
    if (/^-|-$/.test(form)) return false; // Bound forms belong in the construction section.
    const accepted = new Set([form]);
    if (displayUses(group).some(use=>use.type==='Noun')) accepted.add(form + (/[aeiou]$/.test(form) ? 'n' : 'in'));
    return tokens.some(token => {
      if (accepted.has(token)) return true;
      const stem = token.replace(/^(tha|nor|ver|li)-/, '').replace(/-(ian|ya|eshen|ka|esh|en)$/, '');
      return accepted.has(stem);
    });
  });
}

function entryExampleSections(group, examples = null) {
  if (group.canonicalExamples) return group.canonicalExamples;
  const override = headwordOverride(group.term);
  const candidates = [...(examples || override?.examples || []), ...relatedExamples(group)];
  const seen = new Set();
  const sections = {direct:[], related:[], teaching:[]};
  for (const source of candidates) {
    const example = reviewedExample(source);
    if (!exampleAllowed(group,example)) continue;
    const identity = example.entry_id || exampleTextKey(example.celan_text);
    if (seen.has(identity)) continue;
    seen.add(identity);
    const kind = example.example_type || '';
    const teaching = /teaching note:|counterexample|phonology|historical|conceptual metaphor|phonetic fossil|capitalization contrast|euphony|standard form|poetic form/i.test(kind)
      || /\+|->|→|\s\/\s/.test(example.celan_text || '');
    if (teaching) sections.teaching.push(example);
    else if (isDirectExample(group,example.celan_text)) sections.direct.push(example);
    else sections.related.push(example);
  }
  // Stable sorting retains source order within each review tier.
  sections.direct.sort((a,b)=>Number(/^Reviewed/i.test(b.example_type || ''))-Number(/^Reviewed/i.test(a.example_type || '')));
  return sections;
}

function renderExampleSections(group, examples) {
  const sections = entryExampleSections(group,examples);
  const uses = displayUses(group);
  const render = (e, direct = false) => {
    const meaning = e.sense_meaning || '';
    const sense = meaning ? uses.find(u=>u.meaning===meaning) : null;
    // An example without a recorded sense link belongs to the word as a whole.
    const senseLabel = direct && uses.length>1 && sense ? `${sense.type}: ${sense.meaning}` : '';
    return `<div class="sentence-example">${senseLabel ? `<p class="sense-usage">${escapeMarkup(senseLabel)}</p>` : ''}<p class="example-celan">${escapeMarkup(e.celan_text)}</p>${e.translation ? `<p class="example-english">“${escapeMarkup(e.translation)}”</p>` : ''}</div>`;
  };
  const groups = [];
  if (sections.direct.length) groups.push(`<section class="card sentence-card"><h3>Examples (${sections.direct.length})</h3><div class="example-list">${sections.direct.map(e=>render(e,true)).join('')}</div></section>`);
  else {
    const attachedForm = uses.every(use => use.type === 'Suffix') ||
      uses.some(use => /attached after the possessed noun/i.test(use.usage || ''));
    const message = attachedForm && sections.related.length
      ? 'This form attaches to another word. See its examples under Related forms and constructions below.'
      : 'No direct usage example is available yet.';
    groups.push(`<section class="card sentence-card"><h3>Examples</h3><p>${message}</p></section>`);
  }
  if(sections.related.length) groups.push(`<section class="card sentence-card"><h3>Related forms and constructions (${sections.related.length})</h3><p class="example-section-note">These show the word as part of another form or construction.</p><div class="example-list">${sections.related.map(e=>render(e)).join('')}</div></section>`);
  if(sections.teaching.length) groups.push(`<section class="card sentence-card"><h3>Teaching illustrations (${sections.teaching.length})</h3><p class="example-section-note">These include historical forms and counterexamples; they are not all recommended usage.</p><div class="example-list">${sections.teaching.map(e=>render(e)).join('')}</div></section>`);
  return groups.join('');
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
      // A headword followed by a colon is a definition, not an example sentence.
      if (/^[^.!?]*:/.test(celanText) || /^(?:usage|meaning|definition)\b/i.test(celanText)) continue;
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

function buildPronunciation(term, entries = null) {
  const canonical = appHeadwords.get(normalizeHeadword(term));
  if (canonical) return canonical.pronunciation;
  const raw = (term || "").trim();
  if (!raw) return "";
  const sourceEntries = entries || state.groupedEntries.find((group) => group.id === normalizeHeadword(raw))?.entries || [];
  const explicitPronunciation = sourceEntries
    .map((entry) => (entry.pronunciation || "").trim())
    .find(Boolean);
  if (explicitPronunciation) return explicitPronunciation;
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

function expansionMetadata(group) {
  if (group.canonicalMetadata !== undefined) return group.canonicalMetadata;
  const expansionEntries = (group.entries || []).filter((entry) =>
    entry.origin_nation || entry.national_usage || entry.variant_forms || entry.derivation
  );
  if (!expansionEntries.length) return null;

  const origins = uniqueStrings(expansionEntries.flatMap((entry) =>
    (entry.origin_nation || "").split(";").map((value) => value.trim()).filter(Boolean)
  ));
  const nationalUses = uniqueStrings(expansionEntries
    .map((entry) => (entry.national_usage || "").trim())
    .filter(Boolean));
  const derivations = uniqueStrings(expansionEntries
    .map((entry) => displayDerivation(entry.derivation, /ED-0039/.test(entry.notes || '')))
    .filter(Boolean));
  const variants = [];

  expansionEntries.forEach((entry) => {
    const forms = (entry.variant_forms || "").split(";").map((value) => value.trim()).filter(Boolean);
    const pronunciations = (entry.variant_pronunciations || "").split(";").map((value) => value.trim()).filter(Boolean);
    forms.forEach((form, index) => {
      if (normalizeHeadword(form) === normalizeHeadword(group.term)) return;
      if (variants.some((variant) => normalizeHeadword(variant.form) === normalizeHeadword(form))) return;
      variants.push({ form, pronunciation: pronunciations[index] || "" });
    });
  });

  const metadata = { origins, nationalUses, derivations, variants };
  return Object.values(metadata).some((values) => values.length) ? metadata : null;
}

function displayDerivation(value, confirmedOrigin = false) {
  const derivation = (value || "").trim();
  if (!derivation) return "";
  if (!derivation.includes("+") && !confirmedOrigin) return "";

  const primitiveNote = /^New (?:(?:one|two)-syllable )?(?:primitive(?: root)?|root)\b(?::|\s+for)?\s*/i;
  if (!primitiveNote.test(derivation)) return derivation;
  return derivation.replace(primitiveNote, "").trim();
}

function findBestLexiconMatch(rootTerm) {
  const original = normalizeHeadword(rootTerm);
  const direct = state.groupedEntries.find(group => normalizeHeadword(group.term) === original);
  if (direct) return direct;
  // A leading hyphen identifies a suffix and must not resolve to a free word.
  const needle = original.startsWith('-') ? original : original.replace(/-$/, "");
  if (!needle) return null;
  return state.groupedEntries.find((group) => normalizeHeadword(group.term) === needle
    || (headwordOverride(group.term)?.aliases || []).some(alias => normalizeHeadword(alias) === needle)) || null;
}

// Each word/root is a browser-history destination; rendering alone never adds history.
const entryNavigation = { ready: false, index: 0, last: 0, target: null };

function entrySnapshot() {
  return {
    target: entryNavigation.target, query: els.searchInput.value,
    mode: state.searchMode, type: state.activeWordType, letter: state.activeLetter,
    visible: state.visibleResultCount, scrollX: window.scrollX || 0, scrollY: window.scrollY || 0
  };
}

function entryURL(target) {
  return target ? `#${target.kind}=${encodeURIComponent(target.value)}` : window.location.pathname + window.location.search;
}

function updateEntryNavigation() {
  if (els.entryBack) els.entryBack.disabled = entryNavigation.index === 0;
  if (els.entryForward) els.entryForward.disabled = entryNavigation.index >= entryNavigation.last;
  if (els.entryHistoryStatus) els.entryHistoryStatus.textContent = entryNavigation.target
    ? "Word history" : "Select a word to begin";
}

function saveEntryHistory(method) {
  window.history[method]({ celanEntry: entrySnapshot(), index: entryNavigation.index,
    last: entryNavigation.last }, "", entryURL(entryNavigation.target));
}

function navigateEntry(target, render) {
  if (!entryNavigation.ready) { render(); return; }
  const changed = JSON.stringify(target) !== JSON.stringify(entryNavigation.target);
  saveEntryHistory("replaceState");
  render();
  entryNavigation.target = target;
  if (changed) {
    entryNavigation.index += 1;
    entryNavigation.last = entryNavigation.index;
  }
  saveEntryHistory(changed ? "pushState" : "replaceState");
  updateEntryNavigation();
}

function restoreEntry(snapshot) {
  entryNavigation.target = snapshot.target;
  state.activeView = "dictionary";
  renderActiveView();
  els.searchInput.value = snapshot.query || "";
  state.activeWordType = snapshot.type || "ALL";
  els.wordTypeFilter.value = state.activeWordType;
  setSearchMode(snapshot.mode || "all");
  state.activeLetter = snapshot.letter || "ALL";
  renderAzBar();
  applyFilters();
  state.visibleResultCount = snapshot.visible || RESULT_BATCH_SIZE;
  const target = snapshot.target;
  const match = target?.kind === "word" ? findBestLexiconMatch(target.value) : null;
  state.selectedId = match?.id || null;
  if (match) {
    revealSelectedResult();
    renderDetail(match);
  } else if (target?.kind === "root") {
    const root = state.rootLookup.find(r => normalizeHeadword(r.form) === normalizeHeadword(target.value));
    els.emptyState.classList.add("hidden");
    els.detailView.classList.remove("hidden");
    els.detailView.innerHTML = `<h2>${escapeMarkup(target.value)}</h2><p>Root or morpheme</p><p>${escapeMarkup(root?.meaning || 'No standalone word entry is recorded for this root.')}</p>`;
  } else {
    els.detailView.classList.add("hidden");
    els.emptyState.classList.remove("hidden");
    els.emptyState.textContent = target ? "This word could not be found. Search the dictionary to continue." : "Select a term to view details.";
  }
  renderList();
  updateEntryNavigation();
  window.scrollTo?.(snapshot.scrollX || 0, snapshot.scrollY || 0);
}

function entryFromHash() {
  const match = /^#(word|root)=(.*)$/.exec(window.location.hash);
  if (!match) return null;
  try { return { kind: match[1], value: decodeURIComponent(match[2]) }; }
  catch { return null; }
}

function initEntryNavigation() {
  if (!window.history || !window.location) return;
  const saved = window.history.state;
  entryNavigation.index = saved?.celanEntry ? saved.index : 0;
  entryNavigation.last = saved?.celanEntry ? saved.last : 0;
  entryNavigation.ready = true;
  restoreEntry(saved?.celanEntry || { target: entryFromHash() });
  saveEntryHistory("replaceState");
  window.history.scrollRestoration = "manual";
  window.addEventListener("popstate", event => {
    if (event.state?.celanEntry) {
      entryNavigation.index = event.state.index;
      restoreEntry(event.state.celanEntry);
      saveEntryHistory("replaceState");
    } else {
      entryNavigation.index += 1;
      entryNavigation.last = entryNavigation.index;
      restoreEntry({ target: entryFromHash() });
      saveEntryHistory("replaceState");
    }
  });
  // Keep the current destination current even when Back is used in browser chrome.
  const remember = () => saveEntryHistory("replaceState");
  els.searchInput.addEventListener("input", remember);
  els.searchMode.addEventListener("change", remember);
  els.wordTypeFilter.addEventListener("change", remember);
  els.azBar.addEventListener("click", remember);
  els.loadMoreResults.addEventListener("click", remember);
  window.addEventListener("scroll", remember, { passive: true });
  window.addEventListener("pagehide", remember);
  els.entryBack?.addEventListener("click", () => {
    if (entryNavigation.index > 0) { saveEntryHistory("replaceState"); window.history.back(); }
  });
  els.entryForward?.addEventListener("click", () => {
    if (entryNavigation.index < entryNavigation.last) { saveEntryHistory("replaceState"); window.history.forward(); }
  });
}

function jumpToWordFamily(rootTerm) {
  const match = findBestLexiconMatch(rootTerm);
  navigateEntry({ kind: match ? "word" : "root", value: match?.id || rootTerm }, () => openWordFamily(rootTerm));
}

function openWordFamily(rootTerm) {
  state.activeWordType = "ALL";
  els.wordTypeFilter.value = "ALL";
  setSearchMode("all");
  state.activeLetter = "ALL";
  renderAzBar();
  els.searchInput.value = rootTerm;
  applyFilters();
  const match = findBestLexiconMatch(rootTerm);
  if (match) {
    state.selectedId = match.id;
    revealSelectedResult();
    renderList();
    renderDetail(match);
  } else {
    const root = state.rootLookup.find(r => normalizeHeadword(r.form) === normalizeHeadword(rootTerm));
    state.selectedId = null;
    els.emptyState.classList.add("hidden");
    els.detailView.classList.remove("hidden");
    els.detailView.innerHTML = `<h2>${escapeMarkup(rootTerm)}</h2><p>Root or morpheme</p><p>${escapeMarkup(root?.meaning || 'No standalone word entry is recorded for this root.')}</p>`;
  }
}

function jumpToHeadword(headword) {
  const match = state.groupedEntries.find(group => group.id === normalizeHeadword(headword));
  if (match) navigateEntry({ kind: "word", value: match.id }, () => openHeadword(headword));
}

function openHeadword(headword) {
  const match = state.groupedEntries.find((group) => group.id === normalizeHeadword(headword));
  if (!match) return;
  state.activeWordType = "ALL";
  els.wordTypeFilter.value = "ALL";
  setSearchMode("all");
  state.activeLetter = "ALL";
  renderAzBar();
  els.searchInput.value = "";
  applyFilters();
  state.selectedId = match.id;
  revealSelectedResult();
  renderList();
  renderDetail(match);
}

function revealSelectedResult() {
  const index = state.filtered.findIndex((group) => group.id === state.selectedId);
  state.visibleResultCount = Math.max(state.visibleResultCount,
    Math.ceil((index + 1) / RESULT_BATCH_SIZE) * RESULT_BATCH_SIZE);
}

function renderFamilyLinks(items, attributeName) {
  return items.map((item, index) => {
    const label = typeof item === "string" ? item : (attributeName === "data-root-term" ? item : item.term);
    return `<button class="family-link" ${attributeName}="${escapeMarkup(label)}">${escapeMarkup(label)}</button>`;
  }).join("");
}

function isRootUse(use) {
  return !!use.rootWord || (use.type || "").toLowerCase() === "root";
}

function displayUses(group) {
  const seen = new Set();
  // The app-facing sense file marks older source senses as hidden. They must not
  // reappear on the page simply because they remain in the full source record.
  const hasVisibleSenses = Array.isArray(group.englishSenses);
  const distinctUses = (hasVisibleSenses ? group.englishSenses : group.uses || []).filter((use) => {
    const key = `${(use.type || "").trim().toLowerCase()}::${(use.meaning || "").trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (hasVisibleSenses) return distinctUses;
  const showRootSense = !!headwordOverride(group.term)?.showRootSense;
  return !showRootSense && distinctUses.some((use) => !isRootUse(use))
    ? distinctUses.filter((use) => !isRootUse(use))
    : distinctUses;
}

function displayUseType(group, use) {
  return use.type || "";
}

function displayRootWordMarker(group, use) {
  if (headwordOverride(group.term)?.showRootSense) {
    return isRootUse(use) ? "Root Word" : "";
  }
  return use.rootWord ? "Root Word" : "";
}

function displayUsageNote(use) {
  const usage = (use.usage || "").trim();
  if (!usage) return "";
  if (/^original .* preserved\.$/i.test(usage)) return "";
  if (/^dictionary-layer entry/i.test(usage)) return "";
  if (/^source extraction remains unchanged\.$/i.test(usage)) return "";
  if (/^source files unchanged\.$/i.test(usage)) return "";
  if (/^root family evidence:/i.test(usage)) return "";
  if (/^retain as-is\.?$/i.test(usage)) return "";
  if (/^preserved as standalone root\/morpheme because source clearly defines it\.?$/i.test(usage)) return "";
  if (/^the source gloss\b/i.test(usage)) return "";
  if (/^builds the approved\b/i.test(usage)) return "";
  if (/^names the organ without embedding an unapproved theory\b/i.test(usage)) return "";
  if (/^source uses\b/i.test(usage)) return "";
  return usage;
}

function wordBuildingScope(senseIds, uses) {
  if (!senseIds?.length || senseIds.length === uses.length) return "";
  const matching = uses.filter(use => senseIds.includes(use.senseId));
  if (!matching.length) return "";
  return `For: ${matching.map(use => `${use.meaning} (${use.type})`).join("; ")}`;
}

function visibleWordBuilding(group, family, primaryUses, metadata) {
  const components = (family.components || []).filter(part => part.form && part.meaning);
  const componentsById = new Map(components.map(part => [part.id, part]));
  const recordedAnalyses = family.morphologyAnalyses?.length
    ? family.morphologyAnalyses.map(analysis => ({
        parts: analysis.componentIds.map(id => componentsById.get(id)),
        senseIds: analysis.senseIds || family.morphologySenseIds || [],
        spellingNote: analysis.spellingNote || ""
      }))
    : [{parts: components, senseIds: family.morphologySenseIds || [], spellingNote: ""}];
  const hasMultipleMeanings = primaryUses.length > 1;
  const morphologyAnalyses = family.morphologyReview?.status === "open" ? [] : recordedAnalyses.filter(analysis =>
    analysis.parts.length && analysis.parts.every(Boolean) &&
    (!hasMultipleMeanings || analysis.senseIds.length) &&
    (analysis.spellingNote || cleanAlpha(analysis.parts.map(part => part.form).join("")) === cleanAlpha(group.term)));
  const displayedSources = new Set(morphologyAnalyses.flatMap(analysis => analysis.parts)
    .map(part => part.source?.trim().toLowerCase()).filter(Boolean));
  const visibleDerivations = (metadata?.derivations || []).filter(origin =>
    !/\b(?:source-attested|LX-[A-Z0-9-]+|RM-[A-Z0-9-]+|ED-[A-Z0-9-]+)\b/i.test(origin) &&
    (!hasMultipleMeanings || morphologyAnalyses.length) &&
    !displayedSources.has(origin.trim().toLowerCase()) &&
    !(family.morphologyReview?.status === "open" && origin.includes("+")));
  return {morphologyAnalyses, displayedSources, visibleDerivations};
}

function renderDetail(group) {
  const examples = relatedExamples(group);
  const family = state.familyIndex.get(group.id) || { familyRoots: [], relatedEntries: [] };
  const override = headwordOverride(group.term);
  const pronunciation = buildPronunciation(group.term, group.entries);
  const metadata = expansionMetadata(group);
  const relatedEntries = override?.familyTerms?.length
    ? family.relatedEntries.filter(entry => override.familyTerms.includes(entry.term))
    : family.relatedEntries;
  const hasFamilyContent = relatedEntries.length > 0;
  const displayExamples = override?.examples?.length ? override.examples : examples;
  const primaryUses = displayUses(group);
  const hasMultipleMeanings = primaryUses.length > 1;
  const {morphologyAnalyses, displayedSources, visibleDerivations} = visibleWordBuilding(group, family, primaryUses, metadata);
  const hasVisibleMetadata = metadata && (metadata.origins.length || metadata.nationalUses.length || visibleDerivations.length);
  const showFamily = hasFamilyContent && (!hasMultipleMeanings || family.familySenseIds?.length);
  const familyScope = wordBuildingScope(family.familySenseIds, primaryUses);
  const useMarkup = primaryUses.map((use) => {
    const displayType = displayUseType(group, use);
    const rootWordMarker = displayRootWordMarker(group, use);
    const usageNote = displayUsageNote(use);
    const repeatedInMorphology = displayedSources.has(usageNote.toLowerCase());
    return `
      <section class="sense-block" data-sense-id="${escapeMarkup(use.senseId || '')}">
        <div class="sense-heading">${displayType ? `<span class="sense-type">${escapeMarkup(displayType)}</span>` : ""}${rootWordMarker ? `<span class="sense-marker">${escapeMarkup(rootWordMarker)}</span>` : ""}</div>
        <p class="sense-meaning">${escapeMarkup(use.meaning || "No meaning available.")}</p>
        ${usageNote && !repeatedInMorphology ? `<p class="sense-usage">${escapeMarkup(usageNote)}</p>` : ""}
      </section>
    `;
  }).join("");

  els.emptyState.classList.add("hidden");
  els.detailView.classList.remove("hidden");
  els.detailView.innerHTML = `
    <div class="entry-title-row"><h2 class="entry-word">${escapeMarkup(group.term)}</h2></div>
    <p class="entry-pronunciation">${escapeMarkup(pronunciation || "Pronunciation not available.")}</p>
    <div class="detail-grid">
      <section class="card meaning-card">
        ${useMarkup}
        ${override?.usageNote && displayUsageNote({usage:override.usageNote}) ? `<p class="sense-usage">${escapeMarkup(override.usageNote)}</p>` : ""}
      </section>
      ${metadata?.variants?.length ? `<section class="card variant-card"><h3>Variant forms</h3><div class="variant-list">${metadata.variants.map(variant => `<div class="variant-item"><strong class="variant-form">${escapeMarkup(variant.form)}</strong>${variant.pronunciation ? `<span class="variant-pronunciation">${escapeMarkup(variant.pronunciation)}</span>` : ''}</div>`).join('')}</div></section>` : ''}
      ${morphologyAnalyses.length ? `<section class="card morphology-card"><h3>Morphology</h3>${morphologyAnalyses.map(analysis => `
        <div class="morphology-analysis">
          ${wordBuildingScope(analysis.senseIds, primaryUses) ? `<p class="word-building-scope">${escapeMarkup(wordBuildingScope(analysis.senseIds, primaryUses))}</p>` : ''}
          <div class="morphology-parts">${analysis.parts.map((part, index) => `<div class="morphology-part morphology-part--${Math.min(index + 1, 5)}"><strong>${escapeMarkup(part.form)}</strong><span>${escapeMarkup(part.meaning.replace(/^=\s*/, ''))}</span></div>`).join('<span class="morphology-plus" aria-hidden="true">+</span>')}</div>
          ${analysis.spellingNote ? `<p class="morphology-spelling-note">${escapeMarkup(analysis.spellingNote)}</p>` : ''}
        </div>`).join('')}</section>` : ''}
      ${hasVisibleMetadata ? `
      <section class="card">
        <h3>Usage</h3>
        ${metadata.origins.length ? `<div class="family-group"><p class="family-label">Origin</p><p class="family-line">${metadata.origins.map(escapeMarkup).join(", ")}</p></div>` : ""}
        ${metadata.nationalUses.length ? `<div class="family-group"><p class="family-label">National use</p><p class="family-line">${metadata.nationalUses.map(escapeMarkup).join(" ")}</p></div>` : ""}
        ${visibleDerivations.length ? `<div class="family-group"><p class="family-label">Word origin</p>${hasMultipleMeanings && morphologyAnalyses.length ? `<p class="word-building-scope">${escapeMarkup(wordBuildingScope(family.morphologySenseIds || morphologyAnalyses.flatMap(analysis => analysis.senseIds), primaryUses))}</p>` : ''}<p class="family-line">${visibleDerivations.map(escapeMarkup).join("; ")}</p></div>` : ""}
      </section>
      ` : ""}
      ${renderExampleSections(group, displayExamples)}
      ${showFamily ? `
      <section class="card">
        <h3>Word Family</h3>
        ${familyScope ? `<p class="word-building-scope">${escapeMarkup(familyScope)}</p>` : ''}
        ${relatedEntries.length
          ? `<div class="family-group"><p class="family-line">${renderFamilyLinks(relatedEntries.slice(0,10), "data-headword")}</p>${relatedEntries.length > 10 ? `<details class="family-all"><summary>View all ${relatedEntries.length} related words</summary><p class="family-line">${renderFamilyLinks(relatedEntries.slice(10), "data-headword")}</p></details>` : ''}</div>`
          : `<p>No related words listed.</p>`}
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
  const [headwords, senses, examples, families, grammar, expressions, phraseBuilder] = await Promise.all([
    loadCsv("./app_data/dictionary_entries.csv"),
    loadCsv("./app_data/dictionary_senses.csv"),
    loadCsv("./app_data/dictionary_examples.csv"),
    loadJson("./app_data/dictionary_families.json"),
    loadJson("./app_data/grammar_guide.json"),
    loadJson("./app_data/expressions_app.json"),
    loadJson("./app_data/phrase_builder.json")
  ]);
  const byId = new Map();
  state.groupedEntries = headwords.map(row => {
    const override = JSON.parse(row.override_json || '{}');
    const group = {
      id: row.id, term: row.headword, pronunciation: row.pronunciation,
      preview: '', searchText: '',
      hasRootWord: row.has_root_word === 'Yes', override,
      canonicalMetadata: JSON.parse(row.metadata_json || 'null'),
      entries: splitIds(row.source_entry_ids).map(entry_id => ({entry_id})),
      uses: [], englishSenses: [], canonicalExamples: {direct:[],related:[],teaching:[]}
    };
    appHeadwords.set(row.id, group);
    byId.set(row.id, group);
    return group;
  });
  senses.forEach(row => {
    const group = byId.get(row.headword_id);
    if (!group) throw new Error(`Unknown headword in senses: ${row.headword_id}`);
    const use = {senseId:row.sense_id, type:row.word_type, meaning:row.meaning, usage:row.usage_note,
      rootWord:row.root_word === 'Yes', sourceEntries:splitIds(row.source_entry_ids)};
    group.uses.push(use);
    if (row.visible === 'Yes') group.englishSenses.push(use);
  });
  // Search and result previews follow the current app-facing senses and metadata.
  // Keeping copied preview/search strings in the headword file made sense edits stale.
  state.familyIndex = new Map(Object.entries(families));
  state.groupedEntries.forEach(group => {
    const visible = displayUses(group);
    group.preview = visible.slice(0, 2).map(use => use.type
      ? `${use.type}: ${use.meaning}` : use.meaning).join(' ; ');
    const metadata = group.canonicalMetadata || {};
    const family = state.familyIndex.get(group.id) || {};
    const {morphologyAnalyses, visibleDerivations} = visibleWordBuilding(group, family, visible, metadata);
    group.searchText = normalizeHeadword([
      group.term,
      ...(group.override.aliases || []),
      ...visible.flatMap(use => [use.type, use.meaning, displayUsageNote(use)]),
      ...(metadata.origins || []),
      ...(metadata.nationalUses || []),
      ...visibleDerivations,
      ...morphologyAnalyses.flatMap(analysis => analysis.parts.flatMap(part => [part.form, part.meaning])),
      ...(visible.length === 1 || family.familySenseIds?.length
        ? (group.override.familyTerms?.length
          ? (family.relatedEntries || []).filter(entry => group.override.familyTerms.includes(entry.term))
          : (family.relatedEntries || [])).map(entry => entry.term)
        : []),
      ...(metadata.variants || []).flatMap(variant => [variant.form, variant.pronunciation])
    ].join(' '));
  });
  examples.forEach(row => {
    const group = byId.get(row.headword_id);
    if (!group || !group.canonicalExamples[row.section]) throw new Error(`Unknown example placement: ${row.headword_id}/${row.section}`);
    group.canonicalExamples[row.section].push(row);
  });
  state.grammarRules = grammar.rules;
  RULE_LESSONS = grammar.lessons;
  RULE_COMPANIONS = grammar.companions;
  state.expressions = expressions;
  state.filteredExpressions = [...state.expressions];
  state.forgeParts = phraseBuilder.forgeParts;
  state.rootLookup = phraseBuilder.rootLookup;
  CULTURAL_LENSES = phraseBuilder.culturalLenses;
  RETRIEVAL_PACKS = phraseBuilder.retrievalPacks;
  renderActiveView();
  renderWordTypeFilter();
  renderExpressionFilters();
  renderAzBar();
  applyFilters();
  applyExpressionFilters();
  applyRuleFilters();
  renderForgeIdle();
  initEntryNavigation();
}

els.searchInput.addEventListener("input", applyFilters);
els.loadMoreResults.addEventListener("click", () => {
  const shown = Math.min(state.visibleResultCount, state.filtered.length);
  state.visibleResultCount += RESULT_BATCH_SIZE;
  renderList(shown);
});
els.searchMode.addEventListener("change", () => setSearchMode(els.searchMode.value));
els.expressionSearchInput?.addEventListener("input", applyExpressionFilters);
els.expressionTypeFilter?.addEventListener("change", applyExpressionFilters);
els.expressionNationFilter?.addEventListener("change", applyExpressionFilters);
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
els.expressionsViewBtn.addEventListener("click", () => {
  state.activeView = "expressions";
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
