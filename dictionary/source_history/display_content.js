// Dictionary App content records. Edit this file for app-only display decisions.

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

const EXPRESSION_CATEGORY_TYPES = {
  "Greetings": "Greeting or farewell",
  "Culturally Specific Greeting/Farewell": "Greeting or farewell",
  "Interjection / Exclamation": "Interjection",
  "Oath/Curse": "Oath or curse",
  "Nuanced Affirmation/Disagreement": "Expressive response",
  "Basic Response": "Expressive response",
  "Hesitation Sound": "Hesitation",
  "Discourse Particle": "Discourse expression",
  "Slur": "Slur"
};

const EXPRESSION_NATIONS = ["Arvan", "Jasara", "Marakor", "Mechuma", "Nivveil", "Pelagae", "Trerra", "Valkeldor", "Verdalris", "Zarithan"];

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
  },
  belar: {
    uses: [
      {
        type: "Noun",
        meaning: "A blending spice; a seasoning used primarily to unite, balance, or mellow several flavors in a dish",
        usage: "The source gloss “Binding spice” is preserved and clarified by culinary function."
      }
    ]
  },
  belmor: {
    uses: [
      {
        type: "Noun",
        meaning: "A root spice; a seasoning made from the root or rhizome of a plant",
        usage: "The source gloss “Root Spice” is preserved and clarified by botanical source."
      }
    ]
  },
  jekvor: {
    uses: [
      {
        type: "Noun",
        meaning: "A spiraling spice; a seasoning recognizable by a curled, coiled, or twisted physical form",
        usage: "The source gloss “Spiraling spice” is preserved and clarified by physical form."
      }
    ]
  },
  jelvor: {
    uses: [
      {
        type: "Noun",
        meaning: "A zesty spice; a seasoning distinguished by a bright, sharp, lively flavor",
        usage: "The source gloss “Zesty spice” is preserved and clarified by flavor."
      }
    ]
  },
  xilvar: {
    uses: [
      {
        type: "Noun",
        meaning: "A hidden spice; a seasoning or blend whose composition or preparation is deliberately concealed",
        usage: "The source gloss “Hidden spice” is preserved and clarified by concealed composition or preparation."
      },
      {
        type: "Noun",
        meaning: "Fragmented Salt",
        usage: "The separate established salt sense remains unchanged."
      }
    ]
  },
  shan: {
    showRootSense: true
  },
  sel: {
    showRootSense: true
  },
  thael: {
    showRootSense: true
  }
};

// ED-0037: exact user-approved review senses; merged without discarding existing example overrides.
const APPROVED_REVIEW_DISPLAY = {
  "arthen'taleth": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Sacrifice for Destiny Ritual (noun).",
        "usage": ""
      }
    ]
  },
  "kor'taleth": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Offering to Power Source Ritual (noun).",
        "usage": ""
      }
    ]
  },
  "phelrin": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Comfort Food",
        "usage": "Phel = warmth + rin = essence"
      }
    ]
  },
  "phelvin": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Comforting drink",
        "usage": "Phel + vin = pulled/essence"
      },
      {
        "type": "Noun",
        "meaning": "Comfort Drink",
        "usage": "Phel + vin = soothing essence"
      }
    ]
  },
  "thal'taleth": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Act/Ritual of Sacrifice (general noun).",
        "usage": ""
      }
    ]
  },
  "thar'taleth": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Life/Heart Sacrifice Ritual (noun).",
        "usage": ""
      }
    ]
  },
  "jorvar": {
    "uses": [
      {
        "type": "Measure",
        "meaning": "Speed; the rate at which a person creature object or vehicle moves through distance",
        "usage": ""
      },
      {
        "type": "Noun",
        "meaning": "Speed; the rate at which a person creature object or vehicle moves through distance",
        "usage": ""
      }
    ]
  },
  "lianrethshen": {
    "uses": [
      {
        "type": "Measure",
        "meaning": "An anomaly reading; a measured value describing the intensity or instability of a reality anomaly",
        "usage": ""
      },
      {
        "type": "Noun",
        "meaning": "An anomaly reading; a measured value describing the intensity or instability of a reality anomaly",
        "usage": ""
      }
    ]
  },
  "vaarshen": {
    "uses": [
      {
        "type": "Measure",
        "meaning": "A safe clearance distance established between a hazard and an unprotected person or place",
        "usage": ""
      },
      {
        "type": "Noun",
        "meaning": "A safe clearance distance established between a hazard and an unprotected person or place",
        "usage": ""
      }
    ]
  },
  "belshara": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Coordinated Maneuver / Formation Movement / Tactical Path. Refers to moving troops in a specific, planned way.",
        "usage": "Bel (bind/weave) + Shara (path/journey)"
      },
      {
        "type": "Noun",
        "meaning": "Duty (Bound Path)",
        "usage": "Bel (bind) + Shara (path)"
      },
      {
        "type": "Modal",
        "meaning": "Necessity (Must/Have to)",
        "usage": "\"on a bound path\""
      },
      {
        "type": "Noun",
        "meaning": "Necessity / Obligation",
        "usage": ""
      }
    ]
  },
  "lianeth": {
    "uses": [
      {
        "type": "Modal",
        "meaning": "Ability (Can/Able to)",
        "usage": "\"having true quality\""
      },
      {
        "type": "Verb",
        "meaning": "Ability (Can/Able to)",
        "usage": ""
      },
      {
        "type": "Adjective",
        "meaning": "Reliable / Sound / Dependable / Accurate / True to function",
        "usage": ""
      }
    ]
  },
  "rethlian": {
    "uses": [
      {
        "type": "Modal",
        "meaning": "Possibility (May/Might)",
        "usage": "\"maybe/perhaps\""
      },
      {
        "type": "Interjection",
        "meaning": "Maybe",
        "usage": "“Rethlian, I nor var dren.” – “Maybe, I will go to the water.”"
      },
      {
        "type": "Particle",
        "meaning": "Possibility (May/Might)",
        "usage": ""
      }
    ]
  },
  "thar-ka": {
    "uses": [
      {
        "type": "Modal",
        "meaning": "Desire (Want to)",
        "usage": "\"by heart's desire\""
      },
      {
        "type": "Noun",
        "meaning": "Desire",
        "usage": "Translation note: thar-ka means desire in the abstract. In the original example Ohmaen I an thar-ka., the English rendering “my desire” is contextual, driven by the subject pronoun I; “my” is not encoded in thar-ka itself. This explains that example, rather than making I a general possessive marker."
      }
    ]
  },
  "lorin": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Guide",
        "usage": ""
      },
      {
        "type": "Noun",
        "meaning": "Guide / Teacher",
        "usage": ""
      },
      {
        "type": "Verb",
        "meaning": "To guide",
        "usage": ""
      }
    ]
  },
  "ven": {
    "uses": [
      {
        "type": "Particle",
        "meaning": "Subtraction marker meaning minus/subtract",
        "usage": "Corrected to match the actual subtraction pattern used elsewhere in the canon data."
      }
    ]
  },
  "jin": {
    "uses": [
      {
        "type": "Adjective",
        "meaning": "Unique or rare (e.g., exotic or specialty foods).",
        "usage": "Original expanded vocabulary root preserved."
      }
    ]
  },
  "aen": {
    "uses": [
      {
        "type": "Verb",
        "meaning": "Speak / Tell / Breathe",
        "usage": "Formal/poetic use: deeper or ritual speaking. Use in rituals, court, formal address, writing, and when emphasizing depth. Combine with Li- / -en."
      },
      {
        "type": "Conjunction",
        "meaning": "That"
      },
      {
        "type": "Suffix",
        "meaning": "-aen (verb-forming)"
      },
      {
        "type": "Noun",
        "meaning": "Breath of Life",
        "usage": ""
      }
    ]
  },
  "-eth": {
    "uses": [
      {
        "type": "Suffix",
        "meaning": "Suffix that marks inherent quality or essential manifestation",
        "usage": "Common adjectival examples: Shal -> Shaleth, Wor -> Woreth, Gorm -> Gormeth, Kal -> Kaleth."
      },
      {
        "type": "Suffix",
        "meaning": "Also used for abstract or ritual nouns",
        "usage": "Ritual/nominal examples: Shal'taleth, Aen'Moreth."
      }
    ]
  },
  "-in": {
    "uses": [
      {
        "type": "Suffix",
        "meaning": "Plural marker added to nouns ending in consonants",
        "usage": "Original root/morpheme entry preserved."
      },
      {
        "type": "Suffix",
        "meaning": "Person or participant connected to a bond, place, or category",
        "usage": "Additional participant sense; the existing consonant-noun plural sense remains valid. Interpret the established word in context."
      }
    ]
  },
  "lumor": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Light (enlightenment or insight)",
        "usage": ""
      },
      {
        "type": "Noun",
        "meaning": "Talisman",
        "usage": ""
      }
    ]
  },
  "zhelvek": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Energy Bar",
        "usage": "Zhel = spark/energy + vek = carrier"
      },
      {
        "type": "Noun",
        "meaning": "Energy carrier",
        "usage": ""
      }
    ]
  },
  "drenkorath": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Oasis Blessing Ceremony",
        "usage": "Derived From: Dren (water) + kor (source/strength) + ath (balance). Meaning: A ritual where families gather to honor and protect their oasis or water source."
      },
      {
        "type": "Noun",
        "meaning": "Sacred spring",
        "usage": ""
      }
    ]
  },
  "kaleth": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Fortress / Stronghold",
        "usage": ""
      },
      {
        "type": "Adjective",
        "meaning": "Strong / Powerful / Intense / High in magnitude or reading",
        "usage": ""
      }
    ]
  },
  "nor-ka": {
    "uses": [
      {
        "type": "Particle",
        "meaning": "passive voice echo particle",
        "usage": "Original root/morpheme entry preserved."
      },
      {
        "type": "Particle",
        "meaning": "Now / In this moment / At present",
        "usage": ""
      }
    ]
  },
  "tenar": {
    "uses": [
      {
        "type": "Number",
        "meaning": "Ten",
        "usage": ""
      },
      {
        "type": "Noun",
        "meaning": "Radiance / Steady glow / Visible light",
        "usage": ""
      }
    ]
  },
  "shen": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Coinage / Currency"
      },
      {
        "type": "Measure",
        "meaning": "Unit of weight / measure"
      },
      {
        "type": "Verb",
        "meaning": "To measure / To count",
        "usage": ""
      }
    ]
  },
  "kal": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Strength / Power"
      },
      {
        "type": "Adjective",
        "meaning": "Strong"
      },
      {
        "type": "Verb",
        "meaning": "To strengthen",
        "usage": ""
      }
    ]
  },
  "bren": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Harvest (e.g., the act or result of gathering food).",
        "usage": "Conceptual range: Gathering; harvest; collected yield"
      },
      {
        "type": "Verb",
        "meaning": "To harvest / To gather",
        "usage": ""
      }
    ]
  },
  "vanesh": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Commerce; formal trade; merchant work",
        "usage": "Builds words for trade, market action, bargaining, goods, and merchant activity."
      },
      {
        "type": "Verb",
        "meaning": "To trade / To conduct commerce",
        "usage": ""
      }
    ]
  },
  "jor": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Surge or burst (symbolizing sudden movements or energetic flows).",
        "usage": "Conceptual range: Surge; burst; energetic flow"
      },
      {
        "type": "Verb",
        "meaning": "To surge / To burst forth",
        "usage": ""
      }
    ]
  },
  "kar": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Strike; mechanical force; tool-work",
        "usage": "Builds words for striking, tool-use, applied force, and mechanical action."
      },
      {
        "type": "Verb",
        "meaning": "To strike / To apply force",
        "usage": ""
      }
    ]
  },
  "shara": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Path / Journey",
        "usage": ""
      },
      {
        "type": "Verb",
        "meaning": "To follow a path / To navigate / To track",
        "usage": ""
      }
    ]
  },
  "xar": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Shadow or cover (tied to concealed or protective qualities).",
        "usage": "Conceptual range: Cover; veil; concealment for protection"
      },
      {
        "type": "Verb",
        "meaning": "To cover / To shelter / To close off",
        "usage": ""
      }
    ]
  },
  "shentalzhael": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Medical triage; measured assignment of treatment priority and limited care resources according to urgency",
        "usage": ""
      },
      {
        "type": "Verb",
        "meaning": "To triage / To prioritize treatment",
        "usage": ""
      }
    ]
  },
  "i": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "I / Me (1st Person Singular)",
        "usage": "Remains simple and universal."
      }
    ]
  },
  "ya": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "You (2nd Person Singular)",
        "usage": "A straightforward pronoun for “you.”"
      },
      {
        "type": "Possessive",
        "meaning": "Your (direct personal suffix -ya)",
        "usage": "Attach -ya to the possessed noun for body parts, inner states, and personal clothing."
      }
    ],
    "aliases": [
      "-ya"
    ]
  },
  "la": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "He / She / They (3rd Person Singular)",
        "usage": "Neutral pronoun meaning “he/she/they.”"
      }
    ]
  },
  "ilin": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "We / Us [Inclusive] (1st Person Plural)",
        "usage": "Represents \"we\" as a group bound by common purpose."
      },
      {
        "type": "Pronoun",
        "meaning": "Inclusive We: I + You (+ others). This is the communal, default \"we.\"",
        "usage": ""
      }
    ]
  },
  "imen": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "We / Us [Exclusive]",
        "usage": ""
      }
    ]
  },
  "inko": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "We two / Us two [Dual]",
        "usage": ""
      }
    ]
  },
  "yako": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "You two [Dual]",
        "usage": ""
      }
    ]
  },
  "yalin": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "You all / You / Y’all (2nd Person Plural)",
        "usage": "\"You all.\" Signifies a collective of individuals addressed."
      }
    ]
  },
  "lako": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "They two [Dual]",
        "usage": ""
      }
    ]
  },
  "lalin": {
    "uses": [
      {
        "type": "Pronoun",
        "meaning": "They / Them (3rd Person Plural)",
        "usage": "Means “they” (a group not including speaker or addressee)."
      }
    ]
  },
  "-ka": {
    "uses": [
      {
        "type": "Particle",
        "meaning": "Possessive/linking marker",
        "usage": "Always hyphenated to the possessor: Ilin-ka emil (our meal); La-ka kelvor (their mouth). Standalone ka means without or no."
      }
    ]
  },
  "ka": {
    "uses": [
      {
        "type": "Preposition",
        "meaning": "Without",
        "usage": "Standalone ka is exclusively without or no. Ownership uses a hyphenated possessor-ka form."
      },
      {
        "type": "Interjection",
        "meaning": "No",
        "usage": "Standalone ka is exclusively without or no. Ownership uses a hyphenated possessor-ka form."
      }
    ]
  },
  "ian": {
    "uses": [
      {
        "type": "Possessive",
        "meaning": "My / Direct Possession marker",
        "usage": "Direct personal suffix -ian, attached after the possessed noun. My. Third-person possessor-ka is also permitted, including for body parts."
      }
    ],
    "aliases": [
      "-ian"
    ]
  },
  "eshen": {
    "uses": [
      {
        "type": "Possessive",
        "meaning": "His/Her/Their / Direct Possession marker",
        "usage": "Direct personal suffix -eshen, attached after the possessed noun. His / Her / Their. Third-person possessor-ka is also permitted, including for body parts."
      }
    ],
    "aliases": [
      "-eshen"
    ]
  },
  "tharvin-wek": {
    "aliases": [
      "tharvinwek"
    ],
    "usageNote": "Year / annual cycle. Tharvinwek is the fused spelling of this established entry."
  },
  "thar": {
    "aliases": [
      "Thaar"
    ],
    "usageNote": "Thaar is the approved Arvan regional spelling of Thar (heart / emotional core)."
  },
  "terra- / terra-": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Earth, ground, soil, land; lowercase terra is mundane physical ground; capitalized Terra is the world as living spiritual entity.",
        "usage": "Root record containing alternative forms. The slash and trailing hyphens describe the roots; do not write the entire heading as one word."
      }
    ]
  },
  "reth- / rethvok-": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Reth: uncertainty, confusion, doubt, a question, or. Rethvok: chaos, disorder, un-ordered state.",
        "usage": "Root record containing alternative forms. The slash and trailing hyphens describe the roots; do not write the entire heading as one word."
      }
    ]
  },
  "em": {
    "uses": [
      {
        "type": "Interjection",
        "meaning": "Um / Uh (hesitation or thinking particle)"
      },
      {
        "type": "Particle",
        "meaning": "Conversational hesitation / Thinking particle"
      }
    ]
  },
  "vrak": {
    "uses": [
      {
        "type": "Adjective",
        "meaning": "Gone / Missing / Depleted / Dry (Trerran dialect)"
      },
      {
        "type": "Particle",
        "meaning": "Gone / Missing / Depleted (Trerran dialect)"
      }
    ]
  },
  "im": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Device / Instrument / Implement / Internal mechanism"
      },
      {
        "type": "Particle",
        "meaning": "Device / Instrument / Internal mechanism"
      }
    ]
  },
  "thalesh": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Ritual / Sacred balance ceremony"
      },
      {
        "type": "Verb",
        "meaning": "To perform a balance rite"
      }
    ]
  },
  "thalor": {
    "uses": [
      {
        "type": "Noun",
        "meaning": "Outside / Exterior / Outer place"
      },
      {
        "type": "Adverb",
        "meaning": "Outside"
      }
    ]
  }
};

const REVIEWED_EXAMPLE_SENSES = {
  'PE-S3-0005': {talaen:'To Take (contextual), To Receive', thal:'From / Out of'},
  'PE-S3-0011': {talaen:'To give/offer (used for simpler offerings).'},
  'PE-EGE1-0018': {jor:'Surge or burst (symbolizing sudden movements or energetic flows).'},
  'PE-EGE1-0049': {jor:'Surge or burst (symbolizing sudden movements or energetic flows).'},
  'PE-EGE1-0058': {jor:'Surge or burst (symbolizing sudden movements or energetic flows).'}
};

// Approved display distinctions that supplement the source root tables.
const ROOT_ANALYSIS_SUPPRESSED_FORMS = new Set(["tesh", "riv", "num", "nol", "tov", "mav", "gav"]);
const ROOT_KA_DISPLAY = {
  standalone: "Standalone ka means without or no. Possession uses attached -ka.",
  suffix: "Possession: hyphenate -ka to the possessor. Standalone ka is negative."
};
