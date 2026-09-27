// One-time migration tool: capture the current app-facing records before switching sources.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const appDir = __dirname;
const outDir = path.join(appDir, 'app_data');
const elements = new Map();
function element() { return { innerHTML:'', textContent:'', value:'', children:[], dataset:{}, classList:{add(){},remove(){},toggle(){}}, append(){}, appendChild(){}, addEventListener(){}, querySelectorAll(){return []}, scrollIntoView(){} }; }
const document = { getElementById(id) { if (!elements.has(id)) elements.set(id,element()); return elements.get(id); }, createElement:element, querySelector:element };
const window = { EMBEDDED_DATA:null, location:null, addEventListener(){}, matchMedia(){return {matches:false}}, requestAnimationFrame(fn){fn()} };
const context = vm.createContext({ console, window, document, setTimeout, clearTimeout });
const html = fs.readFileSync(path.join(appDir,'index.html'),'utf8');
for (const [,src] of html.matchAll(/<script src="([^"]+)"/g)) {
  const filename = path.resolve(appDir,src);
  vm.runInContext(fs.readFileSync(filename,'utf8'),context,{filename});
}
vm.runInContext('globalThis.__capture = {state,displayUses,headwordOverride,buildPronunciation,expansionMetadata,entryExampleSections,relatedExamples,buildRootLookup,RULE_LESSONS,RULE_COMPANIONS,CULTURAL_LENSES,RETRIEVAL_PACKS,REVIEWED_EXAMPLE_SENSES};',context);
const clean = value => JSON.parse(JSON.stringify(value));
const csv = value => { const text=String(value??''); return /[",\n\r]/.test(text) ? `"${text.replace(/"/g,'""')}"` : text; };
function writeCsv(name,headers,rows) { fs.writeFileSync(path.join(outDir,name),[headers.join(','),...rows.map(row=>headers.map(key=>csv(row[key])).join(','))].join('\n')+'\n'); }
function writeJson(name,value) { fs.writeFileSync(path.join(outDir,name),JSON.stringify(clean(value),null,2)+'\n'); }

(async()=>{
  const api=context.__capture;
  for(let i=0;i<200&&!api.state.groupedEntries.length;i++) await new Promise(resolve=>setTimeout(resolve,50));
  if(!api.state.groupedEntries.length) throw new Error('App did not load');
  const headwords=[],senses=[],examples=[],families={};
  for(const group of api.state.groupedEntries){
    const override=clean(api.headwordOverride(group.term)||{});
    delete override.examples; // Every placed example has its own row below.
    const metadata=clean(api.expansionMetadata(group));
    const visible=new Set(api.displayUses(group));
    headwords.push({id:group.id,headword:group.term,pronunciation:api.buildPronunciation(group.term,group.entries),preview:group.preview,search_text:group.searchText,has_root_word:group.hasRootWord?'Yes':'',source_entry_ids:group.entries.map(e=>e.entry_id).join('; '),override_json:JSON.stringify(override),metadata_json:JSON.stringify(metadata)});
    group.uses.forEach((use,index)=>senses.push({headword_id:group.id,sense_order:index+1,visible:visible.has(use)?'Yes':'',word_type:use.type||'',meaning:use.meaning||'',usage_note:use.usage||'',root_word:use.rootWord?'Yes':'',source_entry_ids:(use.sourceEntries||[]).join('; ')}));
    const displayExamples=api.headwordOverride(group.term)?.examples?.length?api.headwordOverride(group.term).examples:api.relatedExamples(group);
    const sections=api.entryExampleSections(group,displayExamples);
    for(const [section,items] of Object.entries(sections)) items.forEach((e,index)=>examples.push({headword_id:group.id,section,display_order:index+1,entry_id:e.entry_id||'',celan_text:e.celan_text||'',translation:e.translation||'',example_type:e.example_type||'',analysis:e.analysis||'',source_volume:e.source_volume||'',source_section:e.source_section||'',notes:e.notes||'',sense_meaning:api.REVIEWED_EXAMPLE_SENSES[e.entry_id]?.[group.id]||''}));
    families[group.id]=clean(api.state.familyIndex.get(group.id)||{familyRoots:[],relatedEntries:[]});
  }
  writeCsv('dictionary_entries.csv',['id','headword','pronunciation','preview','search_text','has_root_word','source_entry_ids','override_json','metadata_json'],headwords);
  writeCsv('dictionary_senses.csv',['headword_id','sense_order','visible','word_type','meaning','usage_note','root_word','source_entry_ids'],senses);
  writeCsv('dictionary_examples.csv',['headword_id','section','display_order','entry_id','celan_text','translation','example_type','analysis','source_volume','source_section','notes','sense_meaning'],examples);
  writeJson('dictionary_families.json',families);
  writeJson('grammar_guide.json',{rules:api.state.grammarRules,lessons:api.RULE_LESSONS,companions:api.RULE_COMPANIONS});
  writeJson('expressions_app.json',api.state.expressions);
  writeJson('phrase_builder.json',{forgeParts:api.state.forgeParts,rootLookup:api.buildRootLookup(api.state.expandedRoots,api.state.roots),culturalLenses:api.CULTURAL_LENSES,retrievalPacks:api.RETRIEVAL_PACKS});
  console.log(`Captured ${headwords.length} headwords, ${senses.length} senses, ${examples.length} placed examples, ${api.state.grammarRules.length} grammar records, ${api.state.expressions.length} expressions.`);
})().catch(error=>{console.error(error);process.exit(1)});
