# Celan Grammar Guide visual mock

This is a standalone prototype for a question-led grammar lesson. It does not replace the current Grammar Guide or change the dictionary data.

Open `index.html` to view the lesson. All art is local to `assets/`, so the page has no external image or font dependencies.

## Lesson content

The lesson teaches the approved `deni`, `denya`, and `denla` distinctions from editorial decision ED-0030. Its three full-sentence examples come from `dictionary/app_data/dictionary_examples.csv`:

- PE-SRD1-0007 — `dor Ya karvek deni an pralor.`
- PE-SRD1-0009 — `talaen Ya drenvor denya var I.`
- PE-SRD1-0011 — `kes I mekor denla.`

## Mock assets

- `assets/pointing-hero.svg`: editorial scene for the lesson opening.
- `assets/pointing-scene.svg`: labeled teaching diagram.
- `styles.css`: standalone warm black and orange design.
- `script.js`: three-word switcher and one practice question.

For an app-wide rollout, the same lesson layout can be reused with a new question, diagram, examples, and practice prompt for each grammar subject.
