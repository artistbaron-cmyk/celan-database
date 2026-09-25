import csv, json, hashlib
from pathlib import Path
from collections import OrderedDict
from xml.sax.saxutils import escape
import reportlab
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.pagesizes import letter
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[2]
source=ROOT/'data/dictionary_entries.csv';out=ROOT/'outputs/dictionary_pdf/Celan_Complete_Dictionary.pdf'
fontdir=Path(reportlab.__file__).parent/'fonts'
pdfmetrics.registerFont(TTFont('Vera',str(fontdir/'Vera.ttf')))
pdfmetrics.registerFont(TTFont('VeraBold',str(fontdir/'VeraBd.ttf')))
pdfmetrics.registerFontFamily('Vera',normal='Vera',bold='VeraBold',italic='Vera',boldItalic='VeraBold')
rows=list(csv.DictReader(source.open()));groups=OrderedDict()
for r in rows:groups.setdefault(r['headword'],[]).append(r)
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='Entry',fontName='VeraBold',fontSize=15,leading=19,spaceBefore=16,spaceAfter=5,keepWithNext=True,textColor=colors.HexColor('#18364b')))
styles.add(ParagraphStyle(name='TextPDF',fontName='Vera',fontSize=9,leading=12,spaceAfter=5,splitLongWords=True))
styles.add(ParagraphStyle(name='SmallPDF',parent=styles['TextPDF'],fontSize=8,leading=10.5,textColor=colors.HexColor('#45535d')))
styles.add(ParagraphStyle(name='SensePDF',parent=styles['TextPDF'],fontName='VeraBold',spaceBefore=7,keepWithNext=True))
styles.add(ParagraphStyle(name='TitlePDF',fontName='VeraBold',fontSize=28,leading=34,spaceAfter=20))
def p(text,sty='TextPDF'):return Paragraph(escape(str(text)).replace('\n','<br/>'),styles[sty])
def field(label,value,sty='TextPDF'):return Paragraph('<b>'+escape(label)+':</b> '+escape(value).replace('\n','<br/>'),styles[sty])
story=[p('Celan\nComplete Dictionary','TitlePDF'),p(f'{len(groups):,} headwords • {len(rows):,} meanings and uses'),p('Full conversion of dictionary_entries.csv'),Spacer(1,18),p('This searchable PDF preserves all nonempty fields from the dictionary export: pronunciations, meanings, usage notes, derivations, roots, related words, provenance, and the examples included in that file. Information shared by multiple meanings of a word is printed once.'),p('The CSV includes up to five examples per row. Where the example count is larger, additional examples are available in the app but are not contained in this source file.'),p('Source: data/dictionary_entries.csv','SmallPDF'),PageBreak()]
labels={'pronunciation':'Pronunciation','approval_batch':'Approval batch','root_word':'Root word','usage_note':'Usage note','derivation':'Derivation','origin_nation':'Origin nation','national_usage':'National usage','variant_forms':'Variant forms','variant_pronunciations':'Variant pronunciations','family_roots':'Root families','related_words':'Related words','source_entry_ids':'Source entry IDs','example_count':'Available example count'}
metadata=list(labels)
for word,senses in groups.items():
 story.append(p(word,'Entry'))
 shared={key:senses[0][key] for key in metadata if senses[0][key] and all(r[key]==senses[0][key] for r in senses)}
 for key in ['pronunciation','variant_forms','variant_pronunciations']:
  if key in shared:story.append(field(labels[key],shared[key]))
 for r in senses:
  story.append(p(f"Use {r['use_index']} · {r['use_type']}",'SensePDF'));story.append(p(r['meaning']))
  for key in metadata:
   if key not in shared and r[key]:story.append(field(labels[key],r[key],'SmallPDF' if key in ['source_entry_ids','related_words'] else 'TextPDF'))
  exkeys=[f'example_{i}_{part}' for i in range(1,6) for part in ['celan','translation']]
  shared_examples=all(all(x[k]==senses[0][k] for k in exkeys) for x in senses)
  if not shared_examples:
   for i in range(1,6):
    if r[f'example_{i}_celan'] or r[f'example_{i}_translation']:
     story.append(field(f'Example {i}',r[f'example_{i}_celan']));story.append(p(r[f'example_{i}_translation']))
 for key in metadata:
  if key in shared and key not in ['pronunciation','variant_forms','variant_pronunciations','source_entry_ids','related_words']:story.append(field(labels[key],shared[key]))
 if shared_examples:
  r=senses[0]
  for i in range(1,6):
   if r[f'example_{i}_celan'] or r[f'example_{i}_translation']:
    story.append(field(f'Example {i}',r[f'example_{i}_celan']));story.append(p(r[f'example_{i}_translation']))
 for key in ['related_words','source_entry_ids']:
  if key in shared:story.append(field(labels[key],shared[key],'SmallPDF'))
def footer(c,d):
 c.setFont('Vera',8);c.setFillColor(colors.HexColor('#667580'));c.drawString(44,24,'CELAN • Complete dictionary');c.drawRightString(letter[0]-44,24,str(d.page))
doc=SimpleDocTemplate(str(out),pagesize=letter,rightMargin=44,leftMargin=44,topMargin=40,bottomMargin=43,title='Celan Complete Dictionary',author='Celan Dictionary',pageCompression=1)
doc.build(story,onFirstPage=footer,onLaterPages=footer)
reader=PdfReader(out);text='\n'.join(page.extract_text() for page in reader.pages)
missing=[word for word in groups if word not in text];assert not missing,missing
assert all(r['meaning'][:45] in text or ' '.join(r['meaning'].split())[:45] in ' '.join(text.split()) for r in rows),'Missing meaning'
result={'file':str(out),'headwords':len(groups),'uses':len(rows),'pages':len(reader.pages),'bytes':out.stat().st_size,'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'verification':'All headwords and meanings found in extracted PDF text.'}
(out.parent/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
