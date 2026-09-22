import json
import html
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent
flags = json.loads((ROOT / 'flags.json').read_text())
coverage = json.loads((ROOT / 'entry_coverage.json').read_text())
summary = json.loads((ROOT / 'summary.json').read_text())
resolutions = json.loads((ROOT / 'resolutions.json').read_text()) if (ROOT / 'resolutions.json').exists() else {}
esc = lambda v: html.escape(str(v))

def values(value):
    if isinstance(value, dict):
        return '<dl>' + ''.join('<dt>' + esc(k.replace('_', ' ')) + '</dt><dd>' + values(v) + '</dd>' for k,v in value.items()) + '</dl>'
    if isinstance(value, list):
        return '<ul>' + ''.join('<li>' + values(v) + '</li>' for v in value) + '</ul>'
    return esc(value)

cards = []
md = ['# Celan Dictionary — complete review inventory', '', 'September 21, 2026', '',
      '**99 review flags across all 1,463 headwords and 1,542 meanings. These are not 99 confirmed errors.**', '',
      'The Dictionary App is the official Celan reference. Its existing pronunciations are accepted as verified. No dictionary content was changed during this review. Suggested decisions below are proposals, not applied corrections.', '',
      'Coverage: 2,096 source example rows read; 2,076 unique example pairs associated by the app; 912 expansion records and 196 registered variant records included. Repeated examples are counted once in the unique-pair total. The review uses the local app data and its actual entry-building functions; it does not certify a separately deployed copy.', '',
      'Every entry is recorded in entry_coverage.json. No specific concern identified means this review found none; it is not a guarantee that a word can never need revision. A flag can affect several entries or examples.', '',
      'A direct mismatch means two pieces of information disagree. Grammar questions need a language decision. Lookup gaps mean a form used in an example has no standalone or registered lookup; that does not by itself make the form invalid. App display flags concern how information is presented.', '',
      'Example locations distinguish the first five examples shown on an entry from other examples associated by the app. All associated examples were included in scope.', '']
for category, count in summary['categories'].items():
    md.append(f'- {category}: {count}')
for f in flags:
    evidence = ''
    for e in f['examples']:
        evidence += '<div class="example"><b>' + esc(e['source_id']) + '</b><p lang="und">' + esc(e['celan']) + '</p><p>' + esc(e['english']) + '</p><small>Shown among first five on: ' + esc(', '.join(e['shown_on']) or 'None') + '<br>Associated with: ' + esc(', '.join(e['available_on']) or 'None') + '</small></div>'
    if evidence:
        evidence = '<details><summary>Read all ' + str(len(f['examples'])) + ' supporting example(s)</summary>' + evidence + '</details>'
    cards.append('<article class="flag" id="' + f['id'] + '" data-category="' + esc(f['category']) + '" data-certainty="' + esc(f['certainty']) + '"><div class="meta">' + f['id'] + ' · ' + esc(f['category']) + ' · ' + esc(f['certainty']) + '</div><h2>' + esc(f['title']) + '</h2><h3>What the app says</h3>' + values(f['what_the_app_says']) + '<h3>Why I flagged it</h3><p>' + esc(f['why_flagged']) + '</p><h3>What needs deciding</h3><p>' + esc(f['decision']) + '</p>' + evidence + '</article>')
    if f['id'] in resolutions:
        r = resolutions[f['id']]
        notice = '<section class="panel"><h3>Applied locally · ' + esc(r['date']) + '</h3><p>' + esc(r['summary']) + '</p><p>' + esc(' '.join(r['lookup_followup'])) + '</p><p><a href="' + esc(r['record']) + '">Read the exact before-and-after record</a></p><small>The original finding below is preserved as audit history.</small></section>'
        cards[-1] = cards[-1].replace('<h3>What the app says</h3>', notice + '<h3>What the app said when audited</h3>')
    md += ['', f"## {f['id']} · {f['title']}", '', f"{f['category']} · {f['certainty']}", '', '**What the app says**', '', '```json', json.dumps(f['what_the_app_says'], ensure_ascii=False, indent=2), '```', '', '**Why I flagged it**', '', f['why_flagged'], '', '**What needs deciding**', '', f['decision']]
    for e in f['examples']:
        md += ['', f"- **{e['source_id']}** — {e['celan']}", f"  - English: {e['english']}", f"  - Shown among first five on: {', '.join(e['shown_on']) or 'None'}", f"  - Associated with: {', '.join(e['available_on']) or 'None'}"]

rows = ''.join('<tr class="entry"><td>' + esc(c['headword']) + '</td><td>' + str(c['sense_count']) + '</td><td>' + str(c['examples_reviewed']) + '</td><td>' + (' '.join('<a href="#' + i + '" class="flaglink">' + i + '</a>' for i in c['flag_ids']) or 'No specific concern identified') + '</td></tr>' for c in coverage)
options = lambda items: ''.join('<option>' + esc(i) + '</option>' for i in items)
page = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Celan Dictionary Review</title><style>
:root{font-family:system-ui,sans-serif;color:#23352f;background:#f5f4ee;line-height:1.55}body{max-width:1060px;margin:auto;padding:32px 24px 80px}h1{font-size:clamp(30px,5vw,48px);line-height:1.1;margin:12px 0 20px}h2{font-size:23px;line-height:1.3}h3{font-size:15px;margin:24px 0 8px}a{color:#16624c}p{margin:8px 0 16px}.eyebrow,.meta{font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:#52695f}.intro{font-size:19px}.panel,.flag{background:white;border:1px solid #d5dfd6;border-radius:12px;padding:25px;margin:20px 0}.flag{scroll-margin-top:20px}.stats{display:flex;gap:25px;flex-wrap:wrap}.stats strong{display:block;font-size:29px}.stats span{font-size:14px}.controls{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}input,select{font:inherit;border:1px solid #adbdb3;border-radius:7px;background:white;padding:12px}input{flex:1;min-width:200px}label{display:flex;flex-direction:column;font-size:13px;gap:5px}label:first-child{flex:1}dt{font-size:13px;color:#52695f}dd{margin:0 0 9px}dl dl{margin-left:15px}.example{border-left:3px solid #bdd4c2;padding:15px;margin:18px 0;background:#f5f8f4}.example p{margin:7px 0}summary{cursor:pointer;font-weight:600;padding:8px 0}small{color:#52695f}table{border-collapse:collapse;width:100%;font-size:14px}td,th{text-align:left;padding:10px;border-bottom:1px solid #ddd;vertical-align:top}.tablewrap{overflow:auto;max-height:650px}.flaglink{display:inline-block;margin-right:7px}[hidden]{display:none!important}.count{font-weight:600}@media print{.controls{display:none}.flag{break-inside:avoid}body{max-width:none;padding:0}.tablewrap{max-height:none}}
</style><main><div class="eyebrow">September 21, 2026 · Local app audit</div><h1>Celan Dictionary review</h1><p class="intro">The complete flag list, with a plain-English explanation for every item.</p><div class="panel"><div class="stats"><span><strong>1,463</strong>headwords reviewed</span><span><strong>1,542</strong>meanings reviewed</span><span><strong>2,076</strong>unique app example pairs</span><span><strong>99</strong>review flags</span></div><p><b>99 flags does not mean 99 confirmed errors.</b> Some are clear contradictions; others need your decision about Celan or how the app should explain it.</p><p>The Dictionary App is the official reference. Existing pronunciations remain accepted as verified. <b>No dictionary content was changed during this review.</b> Every proposed decision below remains unapplied.</p><details><summary>What was covered and how to read this</summary><p>All 1,463 headwords and 1,542 displayed meanings, 912 expansion records, 196 registered variant records, and 2,096 source example rows were included. The app associates 2,076 unique example pairs with entries; 2,023 appear within an entry’s first five. An example can appear under several words.</p><p><b>Direct mismatch:</b> two pieces of information disagree. <b>Missing information:</b> a label or explanation is absent. <b>Needs a decision:</b> a possible grammar or meaning issue needs a language decision. <b>Lookup gap:</b> an example form has no standalone or registered lookup; this alone does not make it invalid. <b>Display issue:</b> app behavior obscures or misrepresents information.</p><p>Evidence distinguishes examples shown among the first five from all examples associated with an entry. Findings use the local app data and its actual entry-building functions; a separately deployed copy was not certified. Input hashes remained unchanged during the review.</p><p>Every entry has a coverage record below. “No specific concern identified” means none was found in this review, not a guarantee of perfection. Flags attached through examples may concern another word in the sentence.</p><p><a href="review.md">Full Markdown report</a> · <a href="flags.json">All flags and evidence</a> · <a href="entry_coverage.json">Complete entry coverage</a> · <a href="manifest.json">Input record</a></p></details></div>
<div class="controls"><label>Search flags<input id="search" placeholder="Word, flag number, or explanation"></label><label>Category<select id="category"><option value="">All categories</option>__CATEGORIES__</select></label><label>Finding type<select id="certainty"><option value="">All types</option>__CERTAINTIES__</select></label></div><p id="count" class="count" aria-live="polite">99 of 99 flags</p><div id="flags">__CARDS__</div><section class="panel"><h2>Every entry reviewed</h2><p>Search the coverage inventory to find a word and its associated flags. Pronunciations are accepted as verified throughout.</p><label>Find an entry<input id="entrySearch" placeholder="Search headwords"></label><p id="entryCount">1,463 entries</p><div class="tablewrap"><table><thead><tr><th>Headword</th><th>Meanings</th><th>Associated examples</th><th>Review flags</th></tr></thead><tbody>__ROWS__</tbody></table></div></section></main><script>
const cards=[...document.querySelectorAll('.flag')], fields=['search','category','certainty'].map(id=>document.getElementById(id));
function filter(){let n=0;const [q,c,t]=fields.map(x=>x.value.toLocaleLowerCase());cards.forEach(x=>{const show=(!q||x.textContent.toLocaleLowerCase().includes(q))&&(!c||x.dataset.category.toLocaleLowerCase()===c)&&(!t||x.dataset.certainty.toLocaleLowerCase()===t);x.hidden=!show;if(show)n++});document.getElementById('count').textContent=n+' of 99 flags'}fields.forEach(x=>x.addEventListener('input',filter));
document.getElementById('entrySearch').addEventListener('input',e=>{let n=0;const q=e.target.value.toLocaleLowerCase();document.querySelectorAll('.entry').forEach(x=>{x.hidden=!x.children[0].textContent.toLocaleLowerCase().includes(q);if(!x.hidden)n++});document.getElementById('entryCount').textContent=n+' of 1,463 entries'});
document.querySelectorAll('.flaglink').forEach(x=>x.addEventListener('click',()=>{fields.forEach(f=>f.value='');filter()}));
</script></html>'''
page = page.replace('__CATEGORIES__', options(summary['categories'])).replace('__CERTAINTIES__', options(summary['certainty'])).replace('__CARDS__', '\n'.join(cards)).replace('__ROWS__', rows)
if resolutions:
    notice = 'User-approved changes for ' + str(len(resolutions)) + ' review items have been applied locally. The original findings remain below as history; each item lists any remaining follow-up.'
    page = page.replace('<b>No dictionary content was changed during this review.</b> Every proposed decision below remains unapplied.', notice)
    md[0:0] = ['> Update: ' + notice, '', *['> ' + k + ': ' + v['summary'] + ' See ' + v['record'] + '.' for k,v in resolutions.items()], '']
    if (ROOT / 'completion.md').exists():
        panel = '<section class="panel"><h2>Implementation complete locally</h2><p><b>99 decisions processed · 33 headwords added · 1,496 current headwords</b></p><p>The approved changes are applied. Nothing has been published. The counts and evidence below describe the original audit.</p><p>Follow-ups are listed separately: 17 restored words need a second reviewed example; 17 derivations remain unverified. Shalilaen and Welaen still have no separately approved standalone entries.</p><p><a href="completion.md">Read the completion report and exact follow-up lists</a></p></section>'
        outcomes = json.loads((ROOT / 'integration/outcomes.json').read_text())
        if not outcomes.get('derivations_pending'):
            panel = panel.replace('17 derivations remain unverified.', 'all 17 word derivations are now confirmed, including Serilin as sister/female sibling.')
        page = page.replace('<div class="controls">', panel + '<div class="controls">', 1)
        md = [line.replace('No dictionary content was changed during this review. Suggested decisions below are proposals, not applied corrections.', 'The original suggestions are preserved as audit history. Consult the applied record for each flag and completion.md for remaining follow-ups.') for line in md]
review_data = json.dumps({'revision': hashlib.sha256((ROOT / 'flags.json').read_bytes()).hexdigest(), 'flags': flags, 'resolutions': resolutions}, ensure_ascii=False).replace('<', '\\u003c')
page = page.replace('</style>', (ROOT / 'decisions.css').read_text() + '</style>')
page = page.replace('</body>', '')
page = page.replace('</html>', '<script id="review-data" type="application/json">' + review_data + '</script><script>' + (ROOT / 'decisions.js').read_text() + '</script></html>')
(ROOT / 'review.html').write_text(page)
(ROOT / 'review.md').write_text('\n'.join(md) + '\n')
assert page.count('class="flag"') == 99
assert page.count('class="entry"') == 1463
assert len({f['id'] for f in flags}) == 99
assert all(set(c['flag_ids']) <= {f['id'] for f in flags} for c in coverage)
print('Rendered and checked 99 flags and 1,463 coverage rows.')
