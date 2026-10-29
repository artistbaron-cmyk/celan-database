"""Build the 36 beginner lesson packs from approved Dictionary App content.

The pack data is compact and editable. Internal keys and headwords are checked
against the app data before writing the learner-facing Markdown files.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "learning_center" / "lessons"
GUIDE = ROOT / "dictionary" / "app_data" / "grammar_guide.csv"
ENTRIES = ROOT / "dictionary" / "app_data" / "dictionary_entries.csv"
EXPRESSIONS = ROOT / "dictionary" / "app_data" / "expressions_app.json"
EXAMPLES = ROOT / "dictionary" / "app_data" / "dictionary_examples.csv"


def pack(week, letter, title, goal, rules, word_a, word_b, model_a, model_b, notice, hint, scene):
    return dict(week=week, letter=letter, title=title, goal=goal,
                rules=rules.split(), words=(word_a, word_b),
                models=(model_a, model_b), notice=notice, hint=hint, scene=scene)


# Each model is (Celan, English). Model lines come from the current learner-facing
# Grammar Guide or expression records. Isolated headwords are used where a full
# sentence would introduce untaught grammar.
SPECS = [
    # Week 1: first motion
    pack(1, "A", "Hear the action", "Identify the action before its participants.", "RG-PRONUNCIATION RG-VSO", ("Var", "go or move"), ("I", "I or me, pronounced ee"), ("var I dren.", "I go to the water."), ("ohmaen I Ya.", "I love or cherish you."), "Both clauses lead with the verb. The pronoun I follows it and sounds like ee.", "Listen for the first word; it names the action.", "Point to the action in each line before translating."),
    pack(1, "B", "Give a command", "Use va at the front of a direct command.", "RG-QUESTIONS-COMMANDS", ("Va", "command marker"), ("An", "at, in, or on a physical place"), ("var I an dren.", "I go to the water."), ("va var an dren!", "Go to the water!"), "Va turns the second line into a direct instruction.", "The command signpost comes before the verb.", "Guide someone toward water with one short instruction."),
    pack(1, "C", "First Motion scene", "Choose a command and a gentle offer in context.", "RG-QUESTIONS-COMMANDS", ("Dro", "water"), ("Var", "go or move"), ("va var an dren!", "Go to the water!"), ("Dro?", "Water?; a gentle offer of care."), "The first line directs action; the second offers care without requiring explanation.", "Decide whether the person needs direction or an offer.", "At a doorway, give a direction; afterward, offer water."),
    # Week 2: people and questions
    pack(2, "A", "Speaker and listener", "Recognize I and Ya in a short VSO clause.", "GR-V1-0006 RG-VSO", ("I", "I or me, pronounced ee"), ("Ya", "you, one listener"), ("var I dren.", "I go to the water."), ("ohmaen I Ya.", "I love or cherish you."), "I is the speaker; Ya is the listener. The verb still comes first.", "Ask who is speaking and who is addressed.", "Identify speaker and listener in each model."),
    pack(2, "B", "One person or a group", "Select the six basic personal pronouns by role and number.", "GR-V1-0006", ("Ilin", "we"), ("Yalin", "you all"), ("Ilin", "we"), ("Yalin", "you all"), "The -lin forms name groups; Ilin includes the speaker and Yalin addresses a group.", "Use the pronoun chart before trying a sentence.", "Label a two-person speaker group and a group being addressed."),
    pack(2, "C", "Open a question", "Recognize ra as the opening of an ordinary question.", "RG-QUESTIONS-COMMANDS", ("Ra", "question marker"), ("Ser", "friend"), ("var I dren.", "I go to the water."), ("ra var ser an dren?", "Does the friend go to the water?"), "Ra opens the question; the verb remains ahead of the subject.", "Look at the first word before reading the rest.", "Ask whether the friend goes to the water."),
    # Week 3: negatives and missing information
    pack(3, "A", "Say no to an action", "Place ver directly before the verb for a negative statement.", "GR-V1-0015", ("Ver", "negation marker"), ("Var", "go or move"), ("var I dren.", "I go to the water."), ("ver var I dren.", "I do not go to the water."), "Ver before var negates the action.", "The negative sign sits immediately before the action.", "Tell a companion that you are not going to the water."),
    pack(3, "B", "Ask a negative question", "Recognize the order ra ver plus verb.", "RG-QUESTIONS-COMMANDS", ("Ra", "question marker"), ("Ver", "negation marker"), ("ra var ser an dren?", "Does the friend go to the water?"), ("ra ver var ser an dren?", "Does the friend not go to the water?"), "Ra opens the question; ver negates the verb after it.", "Read the two signposts in order.", "Ask whether the friend is not going to the water."),
    pack(3, "C", "Name the missing answer", "Recognize optional lo at the end of a where-question.", "GR-SIP1-0001 GR-SIP1-0002", ("Ra", "question marker"), ("Lo", "where-question tail"), ("ra var ser?", "Where does the friend go? Context supplies place."), ("ra var ser lo?", "Where does the friend go? Lo makes place explicit."), "Lo names the missing answer as a place; the question can also work without it.", "The final particle is optional, not a second verb.", "In a noisy setting, make the place question explicit."),
    # Week 4: word building
    pack(4, "A", "Roots as seeds", "Trace a recorded water word without inventing a suffix.", "GR-V2-0002", ("Dren", "water"), ("Drenaen", "to drink or take liquid"), ("Dren", "water"), ("Drenaen", "to drink or take liquid"), "Drenaen is an approved headword; the verb-forming ending is -aen.", "Check the recorded word before guessing from a pattern.", "Explain the relation between water and drinking."),
    pack(4, "B", "Meaning from compounds", "Use recorded components to interpret approved compounds.", "GR-V2-0003", ("Morl", "mountain"), ("Morldren", "waterfall"), ("Morldren", "waterfall"), ("Terradren", "fertile soil or well-irrigated land"), "The whole-word meanings are recorded; the parts help memory but do not license every possible compound.", "First name the parts, then check the dictionary meaning.", "Explain a waterfall and irrigated land using their approved words."),
    pack(4, "C", "One and many", "Choose -in or -n by the noun's ending.", "GR-V2-0001 GR-DR1-0004", ("Ser", "friend"), ("Tera", "home"), ("Serin", "friends"), ("Teran", "homes"), "Ser ends in a consonant and takes -in; Tera ends in a vowel and takes -n.", "Inspect the last sound of the singular noun.", "Make friend and home plural without changing the root."),
    # Week 5: time
    pack(5, "A", "Present and past", "Recognize the past prefix tha- on a familiar verb.", "GR-V1-0014", ("Var", "go or move"), ("Dren", "water"), ("var I dren.", "I go to the water."), ("tha-var I dren.", "I went to the water."), "Tha- marks the second event as past.", "The time prefix attaches to the verb.", "Report a journey that already happened."),
    pack(5, "B", "Look ahead", "Recognize the future prefix nor- on a familiar verb.", "GR-V1-0014", ("Var", "go or move"), ("Nor", "time"), ("var I dren.", "I go to the water."), ("nor-var I dren.", "I will go to the water."), "Nor- marks the second action as future; here it is a verb prefix.", "Look for the prefix before var.", "State an intended trip to water."),
    pack(5, "C", "Ongoing versus located", "Distinguish continuous -al from the established word Varan.", "GR-DR1-0003", ("Var", "go or move"), ("An", "physical location marker"), ("varal I dren.", "I am going to the water."), ("varan I an Varthas.", "I am residing in the city."), "-al marks continuous action; Varan is a separate locative-stative word, not a general -an ending.", "Do not read the last two letters of Varan as a continuous suffix.", "Say whether a line describes ongoing movement or residence."),
    # Week 6: space and movement
    pack(6, "A", "Mark a place", "Recognize an as a physical place relation.", "RG-PREPOSITIONS RG-VSO", ("An", "at, in, or on a physical place"), ("Dren", "water"), ("var I dren.", "I go to the water."), ("var I an dren.", "I go to the water, with an explicit destination."), "The second line states the destination with an; the bare goal is also attested with var.", "Do not extend the bare-goal pattern to every motion verb.", "Identify the explicit destination in a route line."),
    pack(6, "B", "Movement or residence", "Distinguish going somewhere from staying there.", "RG-PREPOSITIONS GR-DR1-0003", ("Var", "go or move"), ("Varan", "reside, stay, or be located"), ("var kadron an morl.", "The man goes to the mountain."), ("varan I an Varthas.", "I am residing in the city."), "Var describes going; Varan is the established word for residence or location.", "Read the whole verb, not just its first three letters.", "Choose whether a traveler is moving or staying."),
    pack(6, "C", "Ask where", "Use an explicit place-question tail when needed.", "GR-SIP1-0001", ("Ra", "question marker"), ("Lo", "where-question tail"), ("ra var ser?", "Where does the friend go? Context supplies place."), ("ra var ser lo?", "Where does the friend go? Lo makes place explicit."), "Both questions can be grammatical; lo explicitly names the missing place.", "Ask what answer the speaker expects.", "Ask a companion where the friend goes in a noisy scene."),
    # Week 7: belonging
    pack(7, "A", "Possession or absence", "Distinguish attached -ka from standalone ka.", "GR-DR1-0001", ("Ka", "without or no when standalone"), ("I", "I or me"), ("I-ka dren", "my water"), ("var I ka shal.", "I go without light."), "The hyphen changes the relation: I-ka is possessive; standalone ka means without.", "Check whether ka is attached to the possessor.", "Choose between owning water and going without light."),
    pack(7, "B", "Personal belongings", "Recognize the suffix after the possessed item.", "GR-DR1-0001", ("Korin", "hand"), ("Noka", "vulva"), ("doran-ian", "my torso"), ("noka-ya", "your vulva"), "The suffix follows the possessed body part: -ian is my and -ya is your.", "Find the hyphen after the noun.", "Identify whose body part each phrase names."),
    pack(7, "C", "Groups and third persons", "Read possessor-ka before the possessed item.", "GR-DR1-0001", ("Ilin", "we"), ("La", "he, she, or singular they"), ("Ilin-ka emil", "our meal"), ("La-ka kelvor", "their mouth"), "The possessor carries -ka; the following noun is what is possessed.", "Ask which word names the owner.", "Identify the owner and item in each phrase."),
    # Week 8: number and exchange
    pack(8, "A", "The first numbers", "Recognize the first two base number words.", "RG-NUMBERS-MATH", ("Unar", "one"), ("Del", "two"), ("Unar", "one"), ("Del", "two"), "These are base words; later numbers are built from them and other bases.", "Say the amount, not the spelling pattern.", "Count one item, then two."),
    pack(8, "B", "Build upward", "Read a mixed number and a scaled number.", "RG-NUMBERS-MATH GR-ER2-0001", ("Tenar", "ten"), ("Quen", "four"), ("Tenar unar", "eleven"), ("Hek-quen Ten-peth", "four hundred fifty"), "Larger unit first: ten plus one, then hundreds before tens.", "Separate the larger unit from the added part.", "Read a count of eleven and a count of four hundred fifty."),
    pack(8, "C", "Count in an exchange", "Distinguish a built quantity from subtraction.", "RG-NUMBERS-MATH", ("Ven", "subtraction marker"), ("Ten-del", "twenty"), ("Ten-del", "twenty"), ("Hek-quen Ven Hek-del", "four hundred minus two hundred, yielding two hundred"), "Ven marks subtraction; a built number without Ven expresses a quantity.", "Look for Ven before calculating.", "Tell whether a market note names a quantity or a subtraction."),
    # Week 9: social use and cultural voice
    pack(9, "A", "Respectful address", "Recognize the Li- respect marker in address.", "GR-V3-0001", ("Ser", "friend"), ("Li-", "respect marker"), ("var I dren, Ser.", "I go to the water, friend."), ("var I dren, Li-Ser.", "I go to the water, respected friend."), "The event stays the same; the address gains respect through Li-.", "Compare the address at the end of each line.", "Address a friend respectfully without changing the journey."),
    pack(9, "B", "Care and action", "Choose a gentle offer or direct practical instruction by context.", "PAGE-CULTURAL-VOICE", ("Dro", "water"), ("Va", "command marker"), ("Dro?", "Water?; a gentle offer of care."), ("Va tal dro; va ver kel.", "Give water; do not talk; prove care through action."), "The first offers space; the second is a direct Zarithan expression for practical help.", "Consider relationship, urgency, and tone.", "Pick a line for a distressed friend and one for urgent work."),
    pack(9, "C", "Different social settings", "Interpret an expression through its recorded context and tone.", "PAGE-CULTURAL-VOICE", ("Belnoraen", "synchronize"), ("Mura", "smoke"), ("Ra belnoraen Ilin?", "Are we synchronized or ready together?"), ("Kel La ser mura.", "They speak with smoke; they evade a usable answer."), "One is a Mechuman coordination check; the other can accuse someone of evasion.", "Do not treat an idiom as a literal report.", "Choose an expression for team readiness and one for evasive talk."),
    # Week 10: writing and reading
    pack(10, "A", "Sentence openings and I", "Keep ordinary sentence openings lowercase while capitalizing I.", "RG-CAPS", ("I", "I or me, always capitalized"), ("Var", "go or move"), ("var I an dren.", "I go to the water."), ("ohmaen I Ya.", "I love or cherish you."), "The first ordinary verb is lowercase; the pronoun I remains capitalized.", "Capitalization follows meaning and named exceptions, not English sentence starts.", "Edit two ordinary sentences for Celan capitals."),
    pack(10, "B", "Meaningful capitals", "Distinguish mundane ground from archetypal Earth in the guide.", "RG-CAPS GR-ER2-0004", ("Terra", "Earth or ground, with meaning shaped by context and capitalization"), ("I", "I or me, always capitalized"), ("terra", "ordinary earth, soil, or ground"), ("Terra", "archetypal Earth or the Heart of Terra"), "Capital T signals archetypal force in this teaching contrast.", "Do not capitalize a word merely because it starts a sentence.", "Explain why a writer chose Terra instead of terra."),
    pack(10, "C", "Read a short exchange", "Read known sentence shapes without translating word by word.", "RG-VSO RG-QUESTIONS-COMMANDS RG-CAPS", ("Ra", "question marker"), ("Ser", "friend"), ("var I an dren.", "I go to the water."), ("ra var ser an dren?", "Does the friend go to the water?"), "The first line states an action; the second asks about another participant.", "Mark the opening signpost before translating.", "Read the two-line exchange and answer who goes where."),
    # Week 11: linked ideas
    pack(11, "A", "If a friend goes", "Recognize rath introducing an if-clause.", "GR-V1-0017", ("Rath", "if or conditional marker"), ("Ser", "friend"), ("rath var ser, var I dren.", "If the friend goes, I go to the water."), ("rath nor-var ser, nor-var I dren.", "If the friend will go, I will go to the water."), "Rath opens the condition; both clauses keep an action before their participants.", "Read each clause separately before joining them.", "Explain what depends on the friend's action."),
    pack(11, "B", "The friend who goes", "Recognize Lior after the noun it describes.", "GR-V3-0003", ("Lior", "who or which in a relative clause"), ("Ser", "friend"), ("Ser Lior var an dren.", "The friend who goes to the water."), ("var I an terra ser Ser Lior var an dren.", "I go home with the friend who goes to the water."), "Lior introduces information about Ser; it does not begin a new independent question.", "Find the noun immediately before Lior.", "Identify which friend is meant in the longer line."),
    pack(11, "C", "Link a condition and a description", "Tell an if-clause from a noun description.", "GR-V1-0017 GR-V3-0003", ("Rath", "if or conditional marker"), ("Lior", "who or which in a relative clause"), ("rath var ser, var I dren.", "If the friend goes, I go to the water."), ("Ser Lior var an dren.", "The friend who goes to the water."), "Rath connects a condition and outcome; Lior describes a noun.", "Ask whether the line predicts a result or identifies someone.", "Choose the correct linked form for a condition and a description."),
    # Week 12: operate and review
    pack(12, "A", "Repair and retrieve", "Retrieve question, negation, and possession patterns together.", "RG-QUESTIONS-COMMANDS GR-DR1-0001", ("Ver", "negation marker"), ("Ilin", "we"), ("ra ver var ser an dren?", "Does the friend not go to the water?"), ("Ilin-ka emil", "our meal"), "The first uses ra plus ver before the verb; the second attaches -ka to the possessor.", "Name the job of each marker before answering.", "Explain a negative question and a group possession phrase."),
    pack(12, "B", "Rehearse an exchange", "Choose lines for care and team coordination.", "PAGE-CULTURAL-VOICE", ("Dro", "water"), ("Belnoraen", "synchronize"), ("Dro?", "Water?; a gentle offer of care."), ("Ra belnoraen Ilin?", "Are we synchronized or ready together?"), "The same learner can speak gently to one person and check readiness with a group.", "Choose a line by audience and purpose.", "Open a brief scene with care, then check group readiness."),
    pack(12, "C", "Capstone: live in the language", "Combine known form, meaning, and social choice in a bounded task.", "RG-VSO RG-QUESTIONS-COMMANDS RG-CAPS", ("Var", "go or move"), ("Ohmaen", "love, cherish, or feel connection"), ("var I an dren.", "I go to the water."), ("ohmaen I Ya.", "I love or cherish you."), "Both clauses begin with an action, preserve meaningful capitals, and can sit inside a longer scene.", "Use the taught forms and label each new line with the model you adapted.", "Compose six to eight lines using at least four taught patterns; cite the models you adapted."),
]


def load_sources():
    with GUIDE.open(newline="") as f:
        guide_rows = list(csv.DictReader(f))
        guide = {r["id"]: r for r in guide_rows if r["record_type"] == "rule"}
    with ENTRIES.open(newline="") as f:
        words = {r["headword"].casefold() for r in csv.DictReader(f)}
    expressions = {e["celan_expression"]: e for e in json.loads(EXPRESSIONS.read_text())}
    example_ids = {}
    with EXAMPLES.open(newline="") as f:
        for row in csv.DictReader(f):
            if row["entry_id"]:
                example_ids.setdefault(row["celan_text"].casefold(), set()).add(row["entry_id"])
    source_text = "\n".join(str(value) for row in guide_rows for value in row.values())
    source_text += "\n" + "\n".join(expressions)
    source_text += "\n" + "\n".join(example_ids)
    return guide, words, expressions, example_ids, source_text.casefold()


SCENE_KEYS = {
    (1, "A"): "Point to var in A and ohmaen in B before translating.",
    (1, "B"): "va var an dren! is the direct instruction.",
    (1, "C"): "Use model A for the direction, then model B for the offer.",
    (2, "A"): "In A, I is the speaker. In B, I is the speaker and Ya is the listener.",
    (2, "B"): "Ilin names the speaker's group; Yalin addresses a group.",
    (2, "C"): "ra var ser an dren? asks whether the friend goes to the water.",
    (3, "A"): "ver var I dren. is the negative statement.",
    (3, "B"): "ra ver var ser an dren? is the negative question.",
    (3, "C"): "ra var ser lo? makes the missing place explicit.",
    (4, "A"): "Dren is water; Drenaen is the approved verb to drink.",
    (4, "B"): "Morldren names a waterfall; Terradren names fertile or well-irrigated land.",
    (4, "C"): "Ser becomes Serin; Tera becomes Teran.",
    (5, "A"): "tha-var I dren. reports the completed past trip.",
    (5, "B"): "nor-var I dren. states the future trip.",
    (5, "C"): "A is ongoing movement; B is residence in a city.",
    (6, "A"): "an dren in B explicitly marks the destination.",
    (6, "B"): "A describes movement toward the mountain; B describes residence in the city.",
    (6, "C"): "ra var ser lo? asks explicitly for a place.",
    (7, "A"): "I-ka dren means my water; var I ka shal. means I go without light.",
    (7, "B"): "The owner is the speaker in A and the addressee in B.",
    (7, "C"): "Ilin is the possessor of emil; La is the possessor of kelvor.",
    (8, "A"): "Unar counts one; Del counts two.",
    (8, "B"): "Tenar unar is eleven; Hek-quen Ten-peth is four hundred fifty.",
    (8, "C"): "A is the quantity twenty. B is subtraction: four hundred minus two hundred.",
    (9, "A"): "var I dren, Li-Ser. uses the respectful address.",
    (9, "B"): "Use Dro? for a gentle offer; use Va tal dro; va ver kel. for a direct call to useful action.",
    (9, "C"): "Use Ra belnoraen Ilin? to check readiness; Kel La ser mura. to describe evasion.",
    (10, "A"): "Both lines open with lowercase verbs, while I remains capitalized.",
    (10, "B"): "Terra signals archetypal Earth in this contrast; terra means ordinary ground.",
    (10, "C"): "A says I go to the water; B asks whether the friend goes to the water.",
    (11, "A"): "The result clause depends on the friend's going; B also marks both clauses as future.",
    (11, "B"): "Ser Lior var an dren. identifies the friend by their action.",
    (11, "C"): "A is a conditional result; B identifies a particular friend.",
    (12, "A"): "A has ra + ver before the verb; B attaches -ka to the group possessor.",
    (12, "B"): "Use Dro? for individual care, then Ra belnoraen Ilin? for group readiness.",
}


# Two lesson-specific practice checks follow the shared vocabulary and reading
# prompts. Answers use only the cited models or the rule's explicit terminology.
FOCUS_TASKS = {
    (1, "A"): ("In model A, label the action, speaker, and destination.", "var / I / dren", "How is the written pronoun I pronounced?", "ee"),
    (1, "B"): ("Which model is a command?", "B", "What word makes it a command?", "va"),
    (1, "C"): ("Which model directs movement?", "A", "Which model offers help without demanding an explanation?", "B"),
    (2, "A"): ("Who speaks in both models?", "I", "Who is addressed in model B?", "Ya"),
    (2, "B"): ("Which form includes the speaker?", "Ilin", "Which form addresses several listeners?", "Yalin"),
    (2, "C"): ("Identify the opening question marker in B.", "ra", "Identify the action and subject in B.", "var / ser"),
    (3, "A"): ("Find the negation marker in B.", "ver", "Where does it stand relative to the verb?", "Immediately before var"),
    (3, "B"): ("Name the two signposts at the start of B, in order.", "ra, then ver", "Which model asks a negative question?", "B"),
    (3, "C"): ("Which model makes the missing place explicit?", "B", "Is lo required in every where-question?", "No; it is optional"),
    (4, "A"): ("Which model is the water noun?", "A: Dren", "Which is the approved verb meaning to drink?", "B: Drenaen"),
    (4, "B"): ("Which model names a waterfall?", "A: Morldren", "What does Terradren mean as an approved whole word?", "Fertile soil or well-irrigated land"),
    (4, "C"): ("What ending makes Ser plural?", "-in", "What ending makes Tera plural?", "-n"),
    (5, "A"): ("Which model refers to a completed past trip?", "B", "What prefix marks that time?", "tha-"),
    (5, "B"): ("Which model locates the trip in the future?", "B", "What prefix marks that time?", "nor-"),
    (5, "C"): ("Which model uses the general continuous suffix?", "A: varal", "Does Varan establish a general continuous -an ending?", "No; it is a separate established word"),
    (6, "A"): ("Which model makes the destination explicit with an?", "B", "Can the bare-goal pattern with var automatically be used with every motion verb?", "No"),
    (6, "B"): ("Which model describes movement?", "A", "Which model describes residence?", "B"),
    (6, "C"): ("Which model includes the optional where tail?", "B", "What answer category does lo request?", "Place, location, source, or destination"),
    (7, "A"): ("In A, is ka attached or standalone?", "Attached to I as -ka", "In B, what does standalone ka mean?", "Without"),
    (7, "B"): ("Which suffix means my?", "-ian", "Which suffix means your?", "-ya"),
    (7, "C"): ("Who possesses emil in A?", "Ilin, the speaker's group", "Who possesses kelvor in B?", "La, a third-person singular referent"),
    (8, "A"): ("Which form means one?", "Unar", "Which form means two?", "Del"),
    (8, "B"): ("In Tenar unar, what is the total?", "11", "In Hek-quen Ten-peth, what is the total?", "450"),
    (8, "C"): ("Which model is a quantity without subtraction?", "A", "What does Ven signal in B?", "Subtraction"),
    (9, "A"): ("Which address is more respectful?", "B: Li-Ser", "What visible piece adds respect?", "Li-"),
    (9, "B"): ("Which model offers care without asking for a story?", "A: Dro?", "Which model demands practical action?", "B: Va tal dro; va ver kel."),
    (9, "C"): ("Which model is a coordination check?", "A", "Which model can accuse someone of evasion?", "B"),
    (10, "A"): ("Correct the ordinary opening in Var I an dren.", "var I an dren.", "What capital stays in both models?", "I"),
    (10, "B"): ("Which model refers to ordinary soil?", "A: terra", "Which model treats Earth as archetypal?", "B: Terra"),
    (10, "C"): ("Which model is a question?", "B", "Who is the subject of that question?", "ser, the friend"),
    (11, "A"): ("What word introduces the condition?", "rath", "Which model marks both clauses as future?", "B"),
    (11, "B"): ("What noun does Lior describe?", "Ser", "Which model adds a main going-home clause?", "B"),
    (11, "C"): ("Which model states a condition and result?", "A", "Which model identifies a particular friend?", "B"),
    (12, "A"): ("Name the question and negative markers in A.", "ra and ver", "Name the attached possessive marker in B.", "-ka"),
    (12, "B"): ("Which line suits a person who may need quiet help?", "A: Dro?", "Which line checks a group's readiness?", "B: Ra belnoraen Ilin?"),
    (12, "C"): ("Which model has an explicit place relation?", "A: an dren", "Which pronoun in both models must be read ee?", "I"),
}


def render(p, expressions, example_ids, guide):
    w, letter = p["week"], p["letter"]
    (wa, ma), (wb, mb) = p["words"]
    (a, ea), (b, eb) = p["models"]
    q5, a5, q6, a6 = FOCUS_TASKS[(w, letter)]
    topics = ", ".join(guide[r]["rule_name"] for r in p["rules"])
    if (w, letter) == (12, "C"):
        independent = ("Write a six-to-eight-line Celan exchange or description using at least four "
                       "taught patterns: an action-first clause, a question or command, a time or "
                       "negation marker, and a relation or possession form. Annotate each line "
                       "with the rule or model you used.")
        independent_key = ("Rubric: six to eight intelligible lines; four taught patterns used "
                           "correctly; pronoun I read as ee; meaningful capitals and hyphens "
                           "preserved; every non-model form checked against the current guide. "
                           "Models A and B are safe starting lines, not a complete sample response.")
    else:
        independent = p["scene"] + " Use the two models as choices or frames; answer without looking."
        independent_key = SCENE_KEYS.get((w, letter), f"An appropriate response is model B: `{b}` — {eb}")
    extra = ""
    if (w, letter) == (1, "B"):
        extra = """## Command bank for the Week 1 mastery check

These five approved examples give the learner several useful commands. Introduce the extra vocabulary by meaning first; the learner does not need to analyze every word yet.

| Celan | Meaning |
| --- | --- |
| `va var an dren!` | Go to the water! |
| `va var Ya an deni.` | Come here. |
| `va jekaen Ya naku.` | Turn left. |
| `va jekaen Ya sora.` | Turn right. |
| `va mbaen Ya I.` | Help me. |

For the five-command check, give the scene or English intention, then accept these recorded lines with punctuation tolerance while preserving their words and order.

"""
    return f"""# Week {w}, Lesson {letter}: {p['title']}

**Objective:** {p['goal']}

**Source links:** [Grammar Guide](../../dictionary/app_data/grammar_guide.csv) · [Dictionary headwords](../../dictionary/app_data/dictionary_entries.csv) · [Dictionary examples](../../dictionary/app_data/dictionary_examples.csv) · [Expressions](../../dictionary/app_data/expressions_app.json).  
**Grammar topics:** {topics}. **Focus forms:** `{wa}`, `{wb}`.

**Suggested session:** 3 minutes with models, 10 minutes practice, 8 minutes independent use, then a brief review.

## Model and explanation

| Celan | Meaning |
| --- | --- |
| `{a}` | {ea} |
| `{b}` | {eb} |

{p['notice']}

{extra}## Practice

### Build Words

1. What does `{wa}` mean in this lesson?
2. Write the Celan form for **{mb}**.

### Read, build, and fix meaning

3. Read model A. What does it mean in English?
4. Read model B. What does it mean in English?
5. {q5}
6. {q6}

## Independent task

{independent}

## Hint

{p['hint']}

## Answer key and feedback

1. **{ma}.**
2. **`{wb}`.**
3. **{ea}**
4. **{eb}**
5. **{a5}**
6. **{a6}**

**Independent response guide:** {independent_key}

**Review tomorrow:** Revisit the two headwords, then reproduce model B without looking. Review it again after three and seven days if correct.
"""


def main():
    guide, words, expressions, example_ids, source_text = load_sources()
    assert len(SPECS) == 36
    assert len({(p["week"], p["letter"]) for p in SPECS}) == 36
    assert set(FOCUS_TASKS) == {(p["week"], p["letter"]) for p in SPECS}
    assert set(SCENE_KEYS) == {(p["week"], p["letter"]) for p in SPECS} - {(12, "C")}
    for p in SPECS:
        for r in p["rules"]:
            if r not in guide:
                raise ValueError(f"Unknown rule {r} in week {p['week']}{p['letter']}")
        for w, _ in p["words"]:
            if w.casefold() not in words and w not in {"Ten-del"}:
                raise ValueError(f"Unknown headword {w} in week {p['week']}{p['letter']}")
        for celan, _ in p["models"]:
            if celan.casefold() not in source_text:
                raise ValueError(f"Model absent from current guide and expressions: {celan}")
    OUT.mkdir(exist_ok=True)
    index = ["# The 36 Celan lesson packs", "",
             "Three lessons per week. Each pack has two models from the approved Dictionary App, six practice items, an independent task, a hint, an answer guide, and links to the current app content.", "",
             "These are editable text teaching drafts. Test lesson pacing and accepted answer variants with learners before using the packs for automated grading.", ""]
    index += ["The editable source for these generated files is [`build_lesson_packs.py`](../build_lesson_packs.py). Regenerate with `python3 learning_center/build_lesson_packs.py` from the project root.", ""]
    for p in SPECS:
        path = OUT / f"week_{p['week']:02d}_lesson_{p['letter'].lower()}.md"
        path.write_text(render(p, expressions, example_ids, guide))
        index.append(f"- Week {p['week']:02d}{p['letter']}: [{p['title']}]({path.name})")
    (OUT / "README.md").write_text("\n".join(index) + "\n")
    print(f"Wrote {len(SPECS)} lesson packs to {OUT}")


if __name__ == "__main__":
    main()
