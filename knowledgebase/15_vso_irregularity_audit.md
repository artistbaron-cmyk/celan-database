# 15 VSO Irregularity Audit

Purpose: identify canon-preserved examples that appear to bend or break the stated Verb-Subject-Object baseline, without rewriting or resolving them.

Method:
- Checked the current phrase corpus against the stated VSO rule and later complex-syntax notes.
- Flagged examples that appear to begin with a subject, noun, or pronoun before a likely verb.
- Separated fragments and likely special constructions from stronger review candidates.

Important note:
- This is a review aid, not a correction file.
- Some entries below may reflect real exceptions, discourse conventions, vocatives, nation/register variation, or compressed phrase style.

## Baseline

- Core rule: Celan primarily follows Verb-Subject-Object (VSO).
- Later material also introduces:
  - subordinate clauses with `Aen`
  - relative clauses with `Lior`
  - conditionals with `Rath`
  - modal adverbs placed after the subject in a VSO sentence

## Not Strong Problems

These look non-VSO on the surface, but are probably not the best targets for correction because they are fragments, possession phrases, or other reduced constructions.

- `PE-V1-0003` — `I ka dren`
  - Possessive phrase, not a full clause.
- `PE-V1-0004` — `Ya tera`
  - Possessive phrase, not a full clause.
- `PE-V3-0025` — `I dren shaleth ther La dren.`
  - Comparative structure.
- `PE-V3-0026` — `I dren shaleth thaal.`
  - Superlative structure.
- `PE-V3-0027` — `I dren shaleth thaal morldren.`
  - Superlative structure.
- `PE-V3-0005` — `Li-Seren-en, var nor Varthas shenakar?`
  - Likely vocative opening followed by the main clause.
- `PE-V4-0001` — `Aen I lianeth.`
  - Starts with `Aen`; likely not a VSO problem.
- `PE-V4-0013` — `Ra aen Yako an I?`
  - Question/connector structure; not a clean simple-clause VSO test.
- `PE-V4-0074` — `Aen Ya lianor.`
  - Imperative/connector-like opening; not a clean simple-clause VSO test.
- `PE-V4-0076` — `Ra aen Ya kelrin?`
  - Question/connector structure.
- `PE-V4-0077` — `Ver aen I unar kelka.`
  - Negated connector-like structure.
- `PE-V4-0097` — `Aen Ya varash, Ser.`
  - Address/discourse function may be involved.

## Likely Intentional or Register-Driven Surface Variation

These may still deserve review, but they could plausibly be compressed, nation-specific, or stylistically loosened rather than accidental.

- `PE-V3-0125` — `Serilin var varshel nor dren.`
- `PE-V3-0129` — `Ser var tera dren vanesh.`
- `PE-V3-0130` — `Ka var dren, ka emil.`
- `PE-V3-0134` — `Aelin var tera emil ser lian.`
- `PE-V3-0135` — `Lumor var ser dren.`
- `PE-V3-0138` — `Serilin var emil tera, shal nor.`
- `PE-V3-0140` — `Dreshal var im.`
- `PE-V3-0144` — `Thalesh var dren shal.`
- `PE-V3-0149` — `Serilin var kareth emil.`
- `PE-V4-0106` — `Lia, var I an Drenkorath. Rinaen vethor an thar-ian.`
  - First clause looks normal; second clause may represent existential/state phrasing rather than a simple action clause.

## Strong Review Candidates

These are the entries that most strongly look like subject-first or otherwise out of step with the stated VSO baseline.

- `PE-V1-0016` — `Kadron var thal nor.`
  - Reads like subject before verb.
- `PE-V2-0011` — `Balrin var dren.`
  - Reads like noun/subject before verb.
- `PE-V2-0016` — `Peldren var shal.`
  - Reads like noun/subject before verb.
- `PE-V2-0031` — `Khumlor var dren.`
  - Reads like noun/subject before verb.
- `PE-V2-0054` — `Teravin var dren.`
  - Reads like noun/subject before verb.
- `PE-V3-0003` — `Li-Ya var dren.`
  - Respect marker on subject still appears to leave subject before verb.
- `PE-V3-0022` — `I varin Aen Ya var dren.`
  - Main clause appears subject-first.
  - Subordinate clause also appears subject-first.
  - This is the clearest stress-test example.
- `PE-V3-0085` — `Kal var morl.`
  - Reads like noun/subject before verb.
- `PE-V3-0107` — `Dral aen lian.`
  - May be intentional poetic compression, but surface order is still worth reviewing.
- `PE-V3-0131` — `Varadan nor-var ser shenakar.`
  - Reads like subject before future verb.
- `PE-V3-0141` — `Theren var tera Kaleth Rathor.`
  - Reads like subject before verb.
- `PE-S3-0001` — `Fah tha-var`
  - May be existential or stylized, but surface order is still non-baseline.

## Best Next Review Order

If you want to check these by hand efficiently, I’d start here:

1. `PE-V3-0022` — `I varin Aen Ya var dren.`
2. `PE-V3-0003` — `Li-Ya var dren.`
3. `PE-V1-0016` — `Kadron var thal nor.`
4. `PE-V3-0131` — `Varadan nor-var ser shenakar.`
5. `PE-V3-0141` — `Theren var tera Kaleth Rathor.`

These are the most likely to tell us whether we are seeing:
- true canon exceptions
- a second allowed surface order in specific contexts
- or source-level slips that should be corrected later

## Recommendation

Do not mass-correct anything from this audit.

Instead:
- preserve these as canon witnesses
- review the strong candidates first
- decide later whether Celan has:
  - strict VSO with a few source inconsistencies
  - VSO plus specific exception patterns
  - or a broader sentence-order flexibility than the earlier rule suggests
