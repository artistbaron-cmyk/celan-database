// Dictionary App Phrase Builder content and scenario responses.

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
      celan: `${breathTerm} I ${desireTerm.toLowerCase()} ${airTerm.toLowerCase()}-ya.`,
      why: `This keeps the English image intact by using canon footing for breath, desire, and air. It treats the phrase as an intimate longing rather than a literal medical statement.`,
      wordSense: [
        `\`${breathTerm}\` = breathe / breath of life`,
        "`I` = I / me",
        `\`${desireTerm.toLowerCase()}\` = want / desire`,
        "`-ya` = your / personal possessive suffix",
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
    const eyePhrase = eyeTerm ? `${eyeTerm.toLowerCase()}${/[aeiou]$/i.test(eyeTerm) ? 'n' : 'in'}-ya` : "ya";
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
          ? ["`-ya` = your / personal possessive suffix", `\`${eyePhrase}\` = your eyes (from \`${eyeTerm}\`)`]
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
