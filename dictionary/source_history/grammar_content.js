// Dictionary App grammar lesson and guide content.

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
          "When fused roots create a harsh or clumsy consonant cluster, a Celan speaker may choose a smoothing vowel to maintain rhythmic flow. The unsmoothed construction remains valid. The neutral choice is often a, while e or o may appear through vowel harmony; before Wek, an euphonic choice uses e or o rather than a.",
          [
            {
              title: "Strong Smoothing Choice",
              copy: "Harsh, repetitive, or dissonant clusters are the most likely to be smoothed, but smoothing is not grammatically mandatory. Examples include `Morl` + `Thar` -> `Morlathar`, `Rath` + `Thar` -> `Rathathar`, and `Vok` + `Thal` -> `Vokathar`."
            },
            {
              title: "Stylistic and National Contrast",
              copy: "For clunky but pronounceable clusters, smoothing becomes a cultural choice. A pragmatic Zarithan or Valkeldorian may prefer `Krezthal` or `Belshara`, while a poetic Pelagaean or Verdalrisian may prefer `Krezathal` or `Belashara`."
            },
            {
              title: "Forms Normally Left Unsmoothed",
              copy: "Naturally smooth clusters need no euphonic option, and ancient phonetic fossils normally remain unchanged. Smooth: `Kalvok`, `Kalrath`, `Rethlian`. Fossils: `Belthal`, `Rethvok`."
            },
            {
              title: "Euphony Before Wek",
              copy: "When `Wek` is the second root, the euphonic choices are `-ewek` and `-owek`, not `-awek`. This keeps the independent root `Awek` (water spring) distinct. Examples: `Belwek` / `Belewek` / `Belowek`; `Kalwek` / `Kalewek` / `Kalowek`; chosen headword `Mahrowek`, with unsmoothed `Mahrwek` as a variant."
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
        'var I dren. — "I go to the water." (attested bare goal with var)',
        'var I an dren. — "I go to the water." (explicit destination with an)',
        'var kadron an morl.',
        'rinaen Terra vaar.',
        'ohmaen I Ya.'
      ].join("\n"),
      notes: "Both destination forms are attested with var. This pair does not establish bare goals for every motion verb.",
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
        "Start ordinary questions with ra.",
        "For a negative question, place Ver before the verb.",
        "For a direct command, start the sentence with va."
      ].join("\n"),
      examples: [
        'ra var ser an dren? — "Does the friend go to the water?"',
        'ra ver var ser an dren? — "Does the friend not go to the water?"',
        'va var an dren! — "Go to the water!"'
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
        'Capitalization examples: Ordinary "ohmaen I Ya." / Poetic "Rinaen I an Thar-ka."'
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
      ruleName: "Possession and Relation",
      purpose: "Distinguish ownership, personal possession, relational bonds, and absence.",
      guideSections: [
        makeGuideSection("Spacing changes the meaning", "Standalone ka means without or no. Possessive -ka is always hyphenated to its possessor.", ["I-ka dren — My water.", "Ilin-ka emil — Our meal.", "Var I ka shal. — I go without light."]),
        makeGuideSection("Personal suffixes", "Body parts, inner states, personal clothing, and primary personal gear use -ian (my), -ya (your), or -eshen (his/her/their) after the possessed noun. -ian never means their.", ["doran-ian — my torso", "noka-ya — your vulva"]),
        makeGuideSection("Groups and third-person possessors", "Collective, titled, compound, and other third-person possessors use possessor-ka. Third-person body-part possession may also use this form.", ["La-ka kelvor — their mouth", "Varthas-ka vorkor — the city's gate", "Seren-ka arthkal — the guardian's shield"]),
        makeGuideSection("Relational belonging", "-esh expresses a bond or relationship. It does not by itself mean their or identify a third-person owner.")
      ],
      examples: "rinaen aiv an doran-ian. — There is pain in my torso.\ndr enselaen I noka-ian. — I wash my vulva.\ndrenaen La dren kora rinaen La-ka kelvor kadreneth. — They drink water because their mouth is dry.".replace('dr enselaen', 'drenselaen')
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
        "Ordinary sentence opening: `ohmaen I Ya.` (I love you.)",
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

const REVIEWED_GRAMMAR_EXAMPLES = {
    'GR-S4B-0005': 'Ordinary sentence: ohmaen I Ya. (I love you.) / Poetic emphasis: Rinaen I an Thar-ka.',
    'GR-V1-0014': 'Present: var I dren. / I go to the water.\nPast: tha-var I dren. / I went to the water.\nFuture: nor-var I dren. / I will go to the water.\nContinuous: varal I dren. / I am going to the water.\nPerfective: varath I dren. / I have gone to the water.\nHabitual: varas I dren. / I usually go to the water.\nAlso attested with explicit destination: var I an dren. The bare goal is attested for var; do not generalize it to every motion verb.',
    'GR-V1-0015': 'ver var I dren. — I do not go to the water.',
    'GR-V1-0017': 'rath var ser, var I dren. — If the friend goes, I go to the water.\nrath nor-var ser, nor-var I dren. — If the friend will go, I will go to the water.',
    'GR-V1-0008': 'tal theon thal an Ilin. — The neutral person gives balance to us.\nnethaen azon an nethor. — The feminine man rests on the seat.',
    'GR-V1-0009': 'nethaen azon an nethor. — The feminine man rests on the seat.',
    'GR-V1-0011': 'tal theon thal an Ilin. — The neutral person gives balance to us.',
    'GR-V3-0001': 'var I dren, Ser. — I go to the water, friend.\nvar I dren, Li-Ser. — I go to the water, respected friend.\nvar Li-Ya dren. — You, respected one, go to the water.',
    'GR-V3-0003': 'Ser Lior var an dren. — The friend who goes to the water.\nvar I an terra ser Ser Lior var an dren. — I go home with the friend who goes to the water.',
    'GR-V3-0004': 'rinaen dren-ian shaleth ther La-ka dren. — My water is brighter than their water.\nrinaen dren-ian shaleth thaal. — My water is brightest.\nrinaen dren-ian shaleth thaal morldren. — My water is brightest of mountain waters.',
    'GR-V3-0005': 'rath var Ya dren, nor-var I dren. — If you go to the water, I will go to the water.\nrath tha-var Ya an dren, tha-talaen I emil. — If you had gone to the water, I would have gotten food.',
    'GR-V4-0004': 'Active: pralaen Azron belkor. — The woman makes the tunic.\nPassive: pralaen belkor an Azron nor-ka. — The tunic was made by the woman.',
    'GR-DR1-0003': 'varal I dren. — I am going to the water.\nvaran I an Varthas. — I am residing in the city.\nnor-var I an Varthas. — I will go to the city.'
  };

const SUPERSEDED_GRAMMAR_IDS = ['GR-V1-0007', 'GR-V1-0020', 'GR-V3-0006', 'GR-V1-0013', 'GR-V3-0002'];
const REVIEWED_GRAMMAR_GROUP_TEXT = {
  source_volume: 'September 24 dictionary review',
  original_wording: 'These are teaching illustrations, not ordinary sentence examples.',
  notes: 'ED-0044: moved from dictionary sentence examples by user approval.'
};
