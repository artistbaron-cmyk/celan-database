// Spreadsheet export from the app's approved source files.
const fs = require('node:fs');
const path = require('node:path');
const source = path.join(__dirname, 'app_data');
const output = path.join(__dirname, 'exports', 'dictionary_entries.csv');
function parseCsv(text) {
  const rows=[]; let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(quoted){if(ch==='"'&&text[i+1]==='"'){cell+='"';i++;}else if(ch==='"')quoted=false;else cell+=ch;}
    else if(ch==='"')quoted=true;
    else if(ch===','){row.push(cell);cell='';}
    else if(ch==='\n'){row.push(cell);rows.push(row);row=[];cell='';}
    else if(ch!=='\r')cell+=ch;
  }
  if(row.length||cell){row.push(cell);rows.push(row);}
  const [headers,...data]=rows;
  return data.map(cells=>Object.fromEntries(headers.map((header,index)=>[header,cells[index]||''])));
}
const readCsv=name=>parseCsv(fs.readFileSync(path.join(source,name),'utf8'));
const readJson=name=>JSON.parse(fs.readFileSync(path.join(source,name),'utf8'));
const normalize=value=>String(value||'').trim().toLowerCase();
function csvEscape(value){const text=String(value??'');return /[",\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;}
function displayUsageNote(value){
  const usage=(value||'').trim();
  if(!usage)return '';
  if(/^original .* preserved\.$/i.test(usage))return '';
  if(/^dictionary-layer entry/i.test(usage))return '';
  if(/^source extraction remains unchanged\.$/i.test(usage))return '';
  if(/^source files unchanged\.$/i.test(usage))return '';
  if(/^root family evidence:/i.test(usage))return '';
  if(/^retain as-is\.?$/i.test(usage))return '';
  if(/^preserved as standalone root\/morpheme because source clearly defines it\.?$/i.test(usage))return '';
  if(/^the source gloss\b/i.test(usage))return '';
  if(/^builds the approved\b/i.test(usage))return '';
  if(/^names the organ without embedding an unapproved theory\b/i.test(usage))return '';
  if(/^source uses\b/i.test(usage))return '';
  return usage;
}
const headwords=readCsv('dictionary_entries.csv');
const senses=readCsv('dictionary_senses.csv');
const examples=readCsv('dictionary_examples.csv');
const families=readJson('dictionary_families.json');
const byHeadword=new Map();
for(const sense of senses){if(!byHeadword.has(sense.headword_id))byHeadword.set(sense.headword_id,[]);if(sense.visible==='Yes')byHeadword.get(sense.headword_id).push(sense);}
const byExample=new Map();
for(const example of examples){if(!byExample.has(example.headword_id))byExample.set(example.headword_id,{direct:[],related:[]});if(example.section==='direct'||example.section==='related')byExample.get(example.headword_id)[example.section].push(example);}
const exampleKind=example=>example.display_kind||'sentence';
const ordinaryExample=example=>exampleKind(example)==='sentence';
const letters=value=>String(value||'').toLowerCase().replace(/[^a-z]/g,'');
function visibleAnalyses(family,headword,uses){
  if(family.morphologyReview?.status==='open')return [];
  const parts=family.components||[];
  const byId=new Map(parts.map(part=>[part.id,part]));
  const candidates=family.morphologyAnalyses?.length?family.morphologyAnalyses.map(analysis=>({
    parts:analysis.componentIds.map(id=>byId.get(id)),
    senseIds:analysis.senseIds||family.morphologySenseIds||[],
    note:analysis.spellingNote||''
  })):[{parts,senseIds:family.morphologySenseIds||[],note:''}];
  return candidates.filter(analysis=>analysis.parts.length&&analysis.parts.every(part=>part?.form&&part?.meaning)&&
    (uses.length===1||analysis.senseIds.length)&&
    (analysis.note||letters(analysis.parts.map(part=>part.form).join(''))===letters(headword)));
}
const rows=[];
for(const headword of headwords.sort((a,b)=>a.headword.localeCompare(b.headword))){
  const family=families[headword.id]||{familyRoots:[],relatedEntries:[]};
  const override=JSON.parse(headword.override_json||'{}');
  const metadata=JSON.parse(headword.metadata_json||'null')||{};
  const uses=byHeadword.get(headword.id)||[];
  const placed=byExample.get(headword.id)||{direct:[],related:[]};
  const ordinary=placed.direct.filter(ordinaryExample);
  const wordExamples=ordinary.filter(example=>!example.sense_id);
  const roots=family.familyRoots.filter(root=>normalize(root.replace(/-+$/g,''))!==normalize(headword.headword.replace(/-+$/g,'')));
  const related=override.familyTerms?.length?family.relatedEntries.filter(entry=>override.familyTerms.includes(entry.term)):family.relatedEntries;
  const analyses=visibleAnalyses(family,headword.headword,uses);
  const shownSources=new Set(analyses.flatMap(analysis=>analysis.parts.map(part=>normalize(part.source))).filter(Boolean));
  uses.forEach((use,index)=>{
    const meaningExamples=ordinary.filter(example=>example.sense_id===use.sense_id);
    const previews=placed.direct.filter(example=>ordinaryExample(example)&&
      (example.sense_id===use.sense_id||(index===0&&!example.sense_id))).slice(0,5);
    const scopedAnalyses=analyses.filter(analysis=>uses.length===1||analysis.senseIds.includes(use.sense_id));
    const showFamily=uses.length===1||family.familySenseIds?.includes(use.sense_id);
    const visibleDerivations=(metadata.derivations||[]).filter(origin=>
      !/\b(?:source-attested|LX-[A-Z0-9-]+|RM-[A-Z0-9-]+|ED-[A-Z0-9-]+)\b/i.test(origin)&&
      (uses.length===1||scopedAnalyses.length)&&
      !shownSources.has(normalize(origin))&&
      !(family.morphologyReview?.status==='open'&&origin.includes('+')));
    const row={
      source_entry_ids:headword.source_entry_ids, approval_batch:headword.approval_batch,
      headword:headword.headword, pronunciation:headword.pronunciation,
      use_type:use.word_type,
      root_word:use.root_word==='Yes'?'Yes':'',
      meaning:use.meaning, usage_note:displayUsageNote(use.usage_note),
      derivation:visibleDerivations.join('; '),
      word_parts:scopedAnalyses.map(analysis=>analysis.parts.map(part=>part.form).join(' + ')).join('; '),
      word_parts_note:scopedAnalyses.map(analysis=>analysis.note).filter(Boolean).join('; '),
      origin_nation:(metadata.origins||[]).join('; '),
      national_usage:(metadata.nationalUses||[]).join('; '),
      variant_forms:(metadata.variants||[]).map(variant=>variant.form).join('; '),
      variant_pronunciations:(metadata.variants||[]).map(variant=>variant.pronunciation).join('; '),
      family_roots:showFamily?roots.join('; '):'', related_words:showFamily?related.map(entry=>entry.term).join('; '):'',
      example_count:placed.direct.length,
      meaning_example_count:meaningExamples.length,
      word_example_count:index===0?wordExamples.length:0,
      phrase_count:index===0?placed.direct.filter(example=>exampleKind(example)==='phrase').length:0,
      idiom_count:index===0?placed.direct.filter(example=>exampleKind(example)==='idiom').length:0,
      related_example_count:placed.related.length,
      example_scope:previews.length
        ? (previews.some(example=>example.sense_id)&&previews.some(example=>!example.sense_id)
          ? 'Meaning-specific and word-level'
          : previews.some(example=>example.sense_id)?'Meaning-specific':'Word level')
        : '',
      use_index:index+1, sense_id:use.sense_id
    };
    previews.forEach((example,i)=>{
      row[`example_${i+1}_celan`]=example.celan_text;
      row[`example_${i+1}_translation`]=example.translation;
      row[`example_${i+1}_sense_id`]=example.sense_id;
    });
    if(index===0){
      placed.related.slice(0,2).forEach((example,i)=>{row[`related_example_${i+1}_celan`]=example.celan_text;row[`related_example_${i+1}_translation`]=example.translation;});
    }
    rows.push(row);
  });
}
const headers=['source_entry_ids','approval_batch','headword','pronunciation','use_type','root_word','meaning','usage_note','derivation','word_parts','word_parts_note','origin_nation','national_usage','variant_forms','variant_pronunciations','family_roots','related_words','example_count','meaning_example_count','word_example_count','phrase_count','idiom_count','related_example_count','example_scope','use_index','sense_id','example_1_celan','example_1_translation','example_1_sense_id','example_2_celan','example_2_translation','example_2_sense_id','example_3_celan','example_3_translation','example_3_sense_id','example_4_celan','example_4_translation','example_4_sense_id','example_5_celan','example_5_translation','example_5_sense_id','related_example_1_celan','related_example_1_translation','related_example_2_celan','related_example_2_translation'];
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,[headers.join(','),...rows.map(row=>headers.map(header=>csvEscape(row[header])).join(','))].join('\n'));
console.log(`Wrote ${rows.length} dictionary rows to ${output}`);
