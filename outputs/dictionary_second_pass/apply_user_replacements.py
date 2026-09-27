"""Apply the user's 32 proposed repairs where current Celan supports the gloss.

The nine proposals with a concrete remaining conflict stay historical until clarified.
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
SOURCE = ROOT / 'data/phrases_and_examples.csv'

# Number, source ID, user-supplied Celan, user-supplied English, disposition.
PROPOSALS = [
    (1, 'PE-V1-0006', 'rinaen ser-ian Kadron kaleth.', 'My friend is a strong man.', 'apply'),
    (2, 'PE-V1-0010', 'rinaen Azon an eshthael.', 'The feminine man is near the breeze.', 'hold'),
    (3, 'PE-V1-0011', 'shalil Theon-ian ser dren.', 'My neutral companion flows with the water.', 'hold'),
    (4, 'PE-V2-0002', 'kal kinnmor ser dren ser shal.', 'The morning strengthens with water and light.', 'apply'),
    (5, 'PE-V2-0007', 'tal I dren nor kilvlum an veth.', 'I receive water at midnight in shadow.', 'apply'),
    (6, 'PE-V2-0078', 'vanesh velmek an van.', 'The synthetic protein is traded at the market.', 'hold'),
    (7, 'PE-V2-0085', 'kal tharmor an dren ser morl.', 'The rootbread strengthens at the water with the mountain.', 'apply'),
    (8, 'PE-V2-0093', 'rinaen velthamor an dren ser morl.', 'The frozen root mash is at the water with the mountain.', 'apply'),
    (9, 'PE-V2-0098', 'kal kreztorin an dren ser morl.', 'The smoked meat strengthens at the water with the mountain.', 'apply'),
    (10, 'PE-V2-0109', 'shalil Zhaelor an dren.', 'Spring flows lightly at the water.', 'apply'),
    (11, 'PE-V2-0110', 'kal Fenrek an dren.', 'Summer strengthens at the water.', 'apply'),
    (12, 'PE-V2-0111', 'thal Tharvin dren ser morl.', 'Autumn balances the water with the mountain.', 'hold'),
    (13, 'PE-V2-0112', 'shalil Velthaen an morl.', 'Winter flows lightly at the mountain.', 'apply'),
    (14, 'PE-V2-0117', 'shalil drenalor esh dren.', 'The rain flows lightly over the water.', 'apply'),
    (15, 'PE-V2-0118', 'alor eshvelor an dren ser morl.', 'The snow falls at the water with the mountain.', 'apply'),
    (16, 'PE-V3-0041', 'kalaen Velpralor ser Velar an dren.', 'The elder partner strengthens with the elder by the water.', 'apply'),
    (17, 'PE-V3-0087', 'kalaen Drenvokesh an Belvok an dren.', 'The water unity strengthens the family by the water.', 'apply'),
    (18, 'PE-V3-0088', 'shalilaen Eshlorien an dren an Zhaelor.', 'The wave naming flows by the water in spring.', 'apply'),
    (19, 'PE-V3-0091', 'kalaen Kreztharim an dren.', 'The fire heart strengthens by the water.', 'apply'),
    (20, 'PE-V3-0094', 'shalilaen Zhirelorim ser Dralorim.', 'The coming-of-age flows with the celestial storm.', 'apply'),
    (21, 'PE-V3-0095', 'shalilaen Morlatharim an dren.', 'The stone heart flows by the water.', 'apply'),
    (22, 'PE-V3-0099', 'lianaen Drenkorath an dren.', 'The oasis blessing speaks to the water.', 'apply'),
    (23, 'PE-V3-0118', 'nor-vaneshaen Varadan ser Ya.', 'The merchant will trade with you.', 'apply'),
    (24, 'PE-V3-0125', 'va varshelaen, Serilin, an dren!', 'Sister, walk the road to the water.', 'hold'),
    (25, 'PE-V3-0128', 'emil ka shena? nor-var I an Eshvan an felnor.', 'No food coins? I will go to the shop soon.', 'hold'),
    (26, 'PE-V3-0131', 'nor-var Varadan var Ya ser shenakar.', 'The merchant will come to you with coinage.', 'apply'),
    (27, 'PE-V3-0141', 'var Theren an Kaleth Rathor.', 'The village stands at the ancient fortress-home.', 'hold'),
    (28, 'PE-V3-0145', 'ra ver var emil an teremil?', 'Is the meal at home not ready?', 'hold'),
    (29, 'PE-V3-0023', 'Ser Lior var an dren.', 'The friend who goes to the water.', 'apply'),
    (30, 'PE-V3-0024', 'var I an terra ser Ser Lior var an dren.', 'I go home with the friend who goes to the water.', 'apply'),
    (31, 'PE-V3-0028', 'rath var Ya an dren, nor-talaen I shena.', 'If you go to the water, I will bring coinage.', 'hold'),
    (32, 'PE-V3-0029', 'rath tha-var Ya an dren, tha-talaen I emil.', 'If you had gone to the water, I would have gotten food.', 'apply'),
]

with SOURCE.open(newline='', encoding='utf-8') as handle:
    reader = csv.DictReader(handle)
    fields = reader.fieldnames
    rows = list(reader)
by_id = {row['entry_id']: row for row in rows}
journal = []
for number, entry_id, celan, english, action in PROPOSALS:
    row = by_id[entry_id]
    before = row.copy()
    if action == 'apply':
        assert row['example_type'] == 'Historical example pending correction', entry_id
        row['celan_text'] = celan
        row['translation'] = english
        row['example_type'] = 'Reviewed usage example' if number not in (29, 30, 32) else 'Complex sentence example'
        row['analysis'] = 'User-supplied modern Celan; reviewed against current word meanings and sentence structure.'
        row['notes'] = (row['notes'] + ' ED-0047 user-supplied replacement; prior wording in user_32_replacements.json.').strip()
    journal.append({'number': number, 'entry_id': entry_id, 'action': action,
                    'proposed_celan': celan, 'proposed_english': english,
                    'before': before, 'after': row.copy()})
with SOURCE.open('w', newline='', encoding='utf-8') as handle:
    writer = csv.DictWriter(handle, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)
(HERE / 'user_32_replacements.json').write_text(json.dumps(journal, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"Applied {sum(x['action'] == 'apply' for x in journal)}; held {sum(x['action'] == 'hold' for x in journal)}")
