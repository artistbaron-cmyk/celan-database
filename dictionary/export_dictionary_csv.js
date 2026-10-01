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
const rows=[];
for(const headword of headwords.sort((a,b)=>a.headword.localeCompare(b.headword))){
  const family=families[headword.id]||{familyRoots:[],relatedEntries:[]};
  const override=JSON.parse(headword.override_json||'{}');
  const metadata=JSON.parse(headword.metadata_json||'null')||{};
  const uses=byHeadword.get(headword.id)||[];
  const placed=byExample.get(headword.id)||{direct:[],related:[]};
  const roots=family.familyRoots.filter(root=>normalize(root.replace(/-+$/g,''))!==normalize(headword.headword.replace(/-+$/g,'')));
  const related=override.familyTerms?.length?family.relatedEntries.filter(entry=>override.familyTerms.includes(entry.term)):family.relatedEntries;
  uses.forEach((use,index)=>{
    const row={
      source_entry_ids:headword.source_entry_ids, approval_batch:headword.approval_batch,
      headword:headword.headword, pronunciation:headword.pronunciation,
      use_type:use.word_type,
      root_word:use.root_word==='Yes'?'Yes':'',
      meaning:use.meaning, usage_note:displayUsageNote(use.usage_note),
      derivation:(metadata.derivations||[]).join('; '),
      origin_nation:(metadata.origins||[]).join('; '),
      national_usage:(metadata.nationalUses||[]).join('; '),
      variant_forms:(metadata.variants||[]).map(variant=>variant.form).join('; '),
      variant_pronunciations:(metadata.variants||[]).map(variant=>variant.pronunciation).join('; '),
      family_roots:roots.join('; '), related_words:related.map(entry=>entry.term).join('; '),
      example_count:placed.direct.length, related_example_count:placed.related.length,
      example_scope:uses.length>1?'Word level; meanings not assigned':'Word level',
      use_index:index+1, sense_id:use.sense_id
    };
    if(index===0){
      placed.direct.slice(0,5).forEach((example,i)=>{row[`example_${i+1}_celan`]=example.celan_text;row[`example_${i+1}_translation`]=example.translation;});
      placed.related.slice(0,2).forEach((example,i)=>{row[`related_example_${i+1}_celan`]=example.celan_text;row[`related_example_${i+1}_translation`]=example.translation;});
    }
    rows.push(row);
  });
}
const headers=['source_entry_ids','approval_batch','headword','pronunciation','use_type','root_word','meaning','usage_note','derivation','origin_nation','national_usage','variant_forms','variant_pronunciations','family_roots','related_words','example_count','related_example_count','example_scope','use_index','sense_id','example_1_celan','example_1_translation','example_2_celan','example_2_translation','example_3_celan','example_3_translation','example_4_celan','example_4_translation','example_5_celan','example_5_translation','related_example_1_celan','related_example_1_translation','related_example_2_celan','related_example_2_translation'];
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,[headers.join(','),...rows.map(row=>headers.map(header=>csvEscape(row[header])).join(','))].join('\n'));
console.log(`Wrote ${rows.length} dictionary rows to ${output}`);
