"""Add one meaning-checked example for each remaining coverage entry.

Eshen and Eth are shown as attached forms; the app should place those examples
among related constructions rather than mislabel them as standalone usage.
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
PHRASES = ROOT / 'data/phrases_and_examples.csv'
JOURNAL = HERE / 'remaining_57_changes.json'
READABLE = HERE / 'remaining_57_examples.md'

# headword, Celan, English, contextual note. Quotes mark reported insults, not endorsement.
EXAMPLES = [
    ('Sorl', 'rinaen aiv an sorl-ian.', 'There is pain in my neck.', 'Body-part suffix -ian marks my.'),
    ('Kalvar', 'drenselaen I kalvar-ian.', 'I wash my arm.', 'Body-part suffix -ian marks my.'),
    ('Sharvar', 'keshenaen zhaelral sharvar-ian.', 'The healer examines my leg.', 'Body-part suffix -ian marks my.'),
    ('Morlka', 'drenselaen I morlka-ian.', 'I wash my foot.', 'Body-part suffix -ian marks my.'),
    ('Terlin', 'nethaen I an terlin.', 'I rest on the beach.', 'Terlin also has an island reading; this sentence uses beach.'),
    ('Lorash', 'var I an lorash.', 'I go to the shrine.', 'An marks a physical destination.'),
    ('Norvaar', 'moraen I an norvaar.', 'I stand at the time gateway.', 'The gateway is a place; nor remains temporal.'),
    ('Terradren', 'rinaen terradren an theren.', 'There is fertile soil in the village.', 'Uses the approved fertile-soil meaning.'),
    ('Drenshal', 'shalaen I drenshal an terlin.', 'I see a reflective pool on the beach.', 'Uses the reflective-pool meaning.'),
    ('Terraesh', 'shalaen I terraesh thal terlin.', 'I see the horizon from the beach.', 'Thal marks the viewpoint of origin.'),
    ('Liana', 'aen liana var I.', 'The lady speaks to me.', 'Var marks the addressee.'),
    ('Lorinen', 'aen lorinen var I an lorash.', 'The honored guide speaks to me at the shrine.', 'Uses the honored-guide title.'),
    ('Mmm', 'Mmm.', 'Hmm (considering).', 'A complete thoughtful-response utterance.'),
    ('Vara', 'var I an evan. vara vanesh I emil.', 'I go to the market. Then I trade food.', 'Vara opens the next clause.'),
    ('Thalka', 'var I an evan. thalka ver vanesh I emil.', 'I go to the market, but I do not trade food.', 'Thalka opens a contrasting clause.'),
    ('Sera', 'var I an evan. var Ya sera an evan.', 'I go to the market. You also go to the market.', 'Sera follows the subject it adds.'),
    ('Tek', 'shalaen I tek unar ser.', 'I see only one friend.', 'Tek limits the number to one.'),
    ('Rathka', 'rathka rinaen I lorinen!', 'As if I were an honored guide!', 'A hypothetical exclamation, not a factual identity claim.'),
    ("Lialor'ka", "Lialor'ka?", 'Really?', 'A surprised response, not a question-forming rule.'),
    ('Reth‘thal', 'reth‘thal nor-var I an evan.', 'Perhaps I will go to the market.', 'Sentence-initial doubt.'),
    ('Lia‘ser', 'Lia‘ser.', 'Understood.', 'A response to an instruction.'),
    ("Lian'lia", "Lian'lia!", 'Exactly!', 'A strong agreement response.'),
    ('Verka', 'Verka!', 'Absolutely not!', 'An emphatic refusal response.'),
    ('Anen', 'anen morlak.', 'Your bread.', 'Direct-possession phrase with a thing; no ownership of a person is implied.'),
    ('Eshen', 'rinaen kelvor-eshen kadreneth.', 'Their mouth is dry.', 'The approved third-person personal suffix is attached to the possessed noun.'),
    ('Velian', 'velian morlak.', 'Our bread.', 'Direct-possession phrase with a thing; no ownership of a person is implied.'),
    ('Rathorim', 'rinaen rathorim an lorash.', 'There is an act of remembrance at the shrine.', 'The noun denotes the act of remembering.'),
    ("Fah'thar", "rinaen fah'thar an thar-ian.", 'There is grief in my heart.', 'Thar-ian explicitly marks my heart.'),
    ("Vel'rathor", "rinaen vel'rathor an thar-ian.", 'There is an enduring memory in my heart.', 'The noun itself carries endurance.'),
    ('Rathorimaen', 'rathorimaen I ser.', 'I remember the friend.', 'Uses the remember verb with a person as object.'),
    ("Fah'tharaen", "fah'tharaen I ser.", 'I mourn the friend.', 'Uses the mourn verb with a person as object.'),
    ("Ohm'rin", "rinaen ohm'rin an lorash.", 'There is attunement at the shrine.', 'Uses the essence-connection noun.'),
    ("Thal'vok", "rinaen thal'vok an lorash.", 'There is harmonious unity at the shrine.', 'Uses the balanced-unity noun.'),
    ("Ohm'aen", "ohm'aen I Ya.", 'I attune to you.', 'Uses the attune/connect verb.'),
    ("Thal'vokaen", "thal'vokaen lorinen belvok.", 'The honored guide brings the family into harmony.', 'Uses the harmonize verb.'),
    ("Shal'taleth", "rinaen shal'taleth an lorash.", 'There is a light-offering ritual at the shrine.', 'Names the specific ritual without inventing its steps.'),
    ("Bel'Rathorimeth", "rinaen bel'rathorimeth an lorash.", 'There is a memory-weaving ritual at the shrine.', 'Names the specific ritual without inventing its steps.'),
    ("Aen'Moreth", "rinaen aen'moreth an lorash.", 'There is a breath-into-stone ritual at the shrine.', 'Names the specific ritual without inventing its steps.'),
    ("Lorin'Ohmeth", "rinaen lorin'ohmeth an lorash.", 'There is a guidance-seeking ritual at the shrine.', 'Names the specific ritual without inventing its steps.'),
    ("Thal'talaen", "thal'talaen I emil an lorash.", 'I relinquish food at the shrine.', 'Uses the general relinquish verb; does not claim a particular rite.'),
    ("Thal'taleth", "rinaen thal'taleth an lorash.", 'There is a sacrifice ritual at the shrine.', 'Uses the general sacrifice-ritual noun.'),
    ("Thar'taleth", "rinaen thar'taleth an lorash.", 'There is a heart-sacrifice ritual at the shrine.', 'Names the specific ritual without inventing its steps.'),
    ("Arthen'taleth", "rinaen arthen'taleth an lorash.", 'There is a sacrifice-for-destiny ritual at the shrine.', 'Names the specific ritual without inventing its steps.'),
    ("Kor'taleth", "rinaen kor'taleth an lorash.", 'There is an offering-to-a-power-source ritual at the shrine.', 'Names the specific ritual without inventing its steps.'),
    ('Varkareth', 'aen ser "varkareth" var mekral.', 'The friend says “metal-mover” to the mechanic.', 'A pejorative quotation about reliance on machinery.'),
    ('Drenkaesh', 'aen ser "drenkaesh" var varadan.', 'The friend says “water-waster” to the merchant.', 'A pejorative quotation, not neutral description.'),
    ('Tharfah', 'aen ser "tharfah" var lorinen.', 'The friend says “weak-hearted” to the honored guide.', 'A pejorative quotation, not neutral description.'),
    ('Krez-verin', 'aen ser "krez-verin" var varadan.', 'The friend says “ash-breather” to the merchant.', 'A pejorative quotation, not neutral description.'),
    ('Rathorkinash', 'aen ser "rathorkinash" var lorinen.', 'The friend says “ancient-prattler” to the honored guide.', 'A pejorative quotation, not neutral description.'),
    ('Vethordrenka', 'aen ser "vethordrenka" var varadan.', 'The friend says “shadow-water leech” to the merchant.', 'A pejorative quotation, not neutral description.'),
    ('Morl-karash', 'aen ser "morl-karash" var mekral.', 'The friend says “stone-brained” to the mechanic.', 'A pejorative quotation, not neutral description.'),
    ('Verin', 'rinaen verin serin an lorash.', 'There are zero friends at the shrine.', 'The zero limit is explicit in both languages.'),
    ('Senar', 'var senar serin an evan.', 'Six friends go to the market.', 'Numeral directly modifies the plural noun.'),
    ('Sethe', 'nethaen sethe serin an lorash.', 'Seven friends rest at the shrine.', 'Numeral directly modifies the plural noun.'),
    ('Nevar', 'var nevar serin an terlin.', 'Nine friends go to the beach.', 'Numeral directly modifies the plural noun.'),
    ('Kinn', 'var I an evan nor kinn.', 'I go to the market during the day.', 'Nor marks time, not place.'),
    ('Eth', 'rinaen dren shaleth.', 'The water is bright.', 'Shaleth illustrates the adjectival -eth quality ending.'),
    ('Eth', "shalaen I shal'taleth an lorash.", 'I see a light-offering ritual at the shrine.', "Shal'taleth illustrates the ritual-noun use of -eth."),
]


def main():
    assert not JOURNAL.exists(), 'The 57-entry batch was already applied'
    affected = list(csv.DictReader((HERE / 'affected_items.csv').open(newline='', encoding='utf-8')))
    original_69 = [row['identifier'] for row in affected if row['finding'] == 'SP-07'][:69]
    already_added = {row['app_headwords'] for row in json.loads((HERE / 'coverage_changes.json').read_text())}
    target = set(original_69) - already_added
    terms = {term for term, _, _, _ in EXAMPLES}
    assert len(EXAMPLES) == 58 and len(terms) == 57
    assert terms == target, f'Missing: {sorted(target - terms)}; extra: {sorted(terms - target)}'
    app = json.loads((HERE / 'app_inventory_after.json').read_text(encoding='utf-8'))
    by_word = {entry['headword']: entry for entry in app['entries']}
    assert all(not by_word[term]['direct'] for term in terms)
    with PHRASES.open(newline='', encoding='utf-8') as handle:
        reader = csv.DictReader(handle)
        fields, rows = reader.fieldnames, list(reader)
    ids = {row['entry_id'] for row in rows}
    normalized_existing = {row['celan_text'].strip().lower() for row in rows}
    added = []
    for index, (term, celan, english, note) in enumerate(EXAMPLES, 1):
        entry_id = f'PE-SP2C-{index + 12:04d}'
        assert entry_id not in ids
        assert celan.strip().lower() not in normalized_existing, (term, celan)
        row = dict.fromkeys(fields, '')
        row.update(entry_id=entry_id, source_volume='Second-pass dictionary review',
                   source_section='Lexical coverage batch 2', page_number='2026-09-27',
                   celan_text=celan, translation=english,
                   example_type='Reviewed phrase' if term in {'Anen', 'Velian'} else 'Reviewed usage example',
                   analysis=note, canon_status='Canon',
                   notes='ED-0046: user-requested accurate example; linguistic rationale in remaining_57_examples.md.',
                   related_entry_ids='; '.join(by_word[term]['source_ids']),
                   relationship_type='reviewed usage', review_status='Approved',
                   review_reason='User requested examples for all remaining 57 entries.',
                   app_headwords=term)
        rows.append(row)
        added.append(row)
        normalized_existing.add(celan.strip().lower())
    with PHRASES.open('w', newline='', encoding='utf-8') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)
    JOURNAL.write_text(json.dumps(added, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    lines = ['# Examples for the remaining 57 entries', '',
             'Each row uses the Dictionary meaning. Eshen and Eth appear in attached forms, as their grammar requires.', '',
             '| Dictionary entry | Celan | English | Why this use fits |',
             '| --- | --- | --- | --- |']
    for term, celan, english, note in EXAMPLES:
        lines.append(f'| {term} | `{celan}` | {english} | {note} |')
    READABLE.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Added {len(added)} examples covering {len(terms)} entries')


if __name__ == '__main__':
    main()
