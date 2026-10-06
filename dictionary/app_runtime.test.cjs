const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const elements=new Map();
function element(){return {innerHTML:'',textContent:'',value:'',children:[],dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},append(){},appendChild(){},addEventListener(){},querySelectorAll(){return []},scrollIntoView(){}}}
const document={getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)},createElement:element,querySelector:element};
const window={EMBEDDED_DATA:null,location:null,addEventListener(){},matchMedia(){return {matches:false}},requestAnimationFrame(fn){fn()}};
const context=vm.createContext({console,window,document,setTimeout,clearTimeout});
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
for(const [,src] of html.matchAll(/<script src="([^"]+)"/g)){
 const filename=path.resolve(__dirname,src);
 vm.runInContext(fs.readFileSync(filename,'utf8'),context,{filename});
}
vm.runInContext('globalThis.appTest={state,findEnglishMatches,findBestLexiconMatch,renderDetail,renderRuleDetail,renderExpressionDetail,analyzeForgeTerm,buildPronunciation,displayUses,normalizeHeadword}',context);
(async()=>{
 const api=context.appTest;
 for(let i=0;i<100&&!api.state.groupedEntries.length;i++)await new Promise(resolve=>setTimeout(resolve,50));
 assert.equal(api.state.groupedEntries.length,1495);
 const dren=api.findBestLexiconMatch('Dren');
 assert.ok(dren);
 assert.ok(api.findEnglishMatches(dren,'water').length);
 assert.ok(api.findBestLexiconMatch('Serilin'));
 assert.equal(api.findBestLexiconMatch('Thaar')?.term,'Thar');
 const gorm=api.findBestLexiconMatch('Gorm');
 api.renderDetail(gorm);
 assert.match(elements.get('detailView').innerHTML,/The farmer notices blight/);
 assert.match(elements.get('detailView').innerHTML,/data-headword="Gormeth"/);
 assert.equal((elements.get('detailView').innerHTML.match(/class="sentence-example"/g)||[]).length,3);
 assert.doesNotMatch(elements.get('detailView').innerHTML,/<summary>Source<\/summary>|Literal gloss|Expansion example/);
 const jekvarin=api.findBestLexiconMatch('Jekvarin');
 api.renderDetail(jekvarin);
 assert.match(elements.get('detailView').innerHTML,/<h3>Morphology<\/h3>/);
 assert.doesNotMatch(elements.get('detailView').innerHTML,/Root: JEK/);
 const grammar=api.state.grammarRules[0];
 api.renderRuleDetail(grammar);
 assert.ok(elements.get('ruleDetailView').innerHTML.length>100);
 api.renderExpressionDetail(api.state.expressions[0]);
 assert.ok(elements.get('expressionDetailView').innerHTML.length>100);
 assert.ok(api.state.rootLookup.length>0);
 assert.ok(api.state.forgeParts.length>0);
 const visibleCount=api.state.groupedEntries.reduce((count,group)=>count+group.englishSenses.length,0);
 assert.equal(visibleCount,1565);
 assert.equal(api.state.groupedEntries.reduce((count,group)=>count+api.displayUses(group).length,0),1565);
 const senseIds=new Set();
 for(const group of api.state.groupedEntries){
   const visible=api.displayUses(group);
   for(const sense of visible){
     assert.ok(sense.senseId,`${group.term} has a sense without an ID`);
     assert.ok(!senseIds.has(sense.senseId),`duplicate sense ID: ${sense.senseId}`);
     senseIds.add(sense.senseId);
   }
   api.renderDetail(group);
   const page=elements.get('detailView').innerHTML;
   const placements=[...page.matchAll(/data-example-placement="([^"]+)"/g)].map(match=>match[1]);
   const sourcePlacements=Object.values(group.canonicalExamples).flat().map(example=>`${example.section}:${example.display_order}`);
   assert.equal(placements.length,sourcePlacements.length,`${group.term} is missing an example placement`);
   assert.deepEqual(new Set(placements),new Set(sourcePlacements),`${group.term} displays an example twice or under the wrong headword`);
   assert.doesNotMatch(page,/Sense assignment pending review|Literal gloss|<summary>Source<\/summary>/i,`${group.term} exposes example editing data`);
   for(const [,target] of page.matchAll(/data-headword="([^"]+)"/g)){
     assert.ok(api.state.groupedEntries.some(entry=>entry.id===api.normalizeHeadword(target)),`${group.term} links to a missing word: ${target}`);
   }
   assert.equal((page.match(/class="sense-block"/g)||[]).length,visible.length,`${group.term} has an incorrect number of visible meanings`);
   assert.equal((page.match(/class="sense-type"/g)||[]).length,visible.filter(sense=>sense.type).length,`${group.term} is missing a word type`);
   assert.doesNotMatch(page,/Sense assignment pending review|Retain as-is|Preserved as standalone root\/morpheme because source clearly defines it|The source gloss|Builds the approved|Source uses Ohnoshan|Names the organ without embedding an unapproved theory/i,`${group.term} exposes an internal note`);
   const family=api.state.familyIndex.get(group.id)||{};
   if(family.morphologyReview?.status==='open')assert.doesNotMatch(page,/<h3>Morphology<\/h3>/,`${group.term} displays an unresolved breakdown`);
   if(visible.length>1&&family.familyReview?.status==='open')assert.doesNotMatch(page,/<h3>Word Family<\/h3>/,`${group.term} displays unscoped family links`);
   if(page.includes('<h3>Morphology</h3>')){
     const originLine=page.match(/<p class="family-label">Word origin<\/p>[\s\S]*?<p class="family-line">([^<]*)<\/p>/)?.[1]||'';
     const parts=family.morphologyAnalyses?.length
       ? family.morphologyAnalyses.flatMap(analysis=>analysis.componentIds.map(id=>family.components.find(part=>part.id===id)))
       : family.components||[];
     for(const part of parts){
       const escaped=String(part.source||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
       if(escaped)assert.ok(!originLine.includes(escaped),`${group.term} repeats its morphology as a word origin`);
     }
   }
 }
 assert.equal(senseIds.size,1565);
 api.renderDetail(api.findBestLexiconMatch('Aenor'));
 let page=elements.get('detailView').innerHTML;
 assert.match(api.findBestLexiconMatch('Aenor').searchText,/breath/,'search must include visible word parts');
 assert.match(page,/data-sense-id="aenor-s1"/);
 assert.match(page,/data-sense-id="aenor-s2"/);
 assert.match(page,/<p class="sense-meaning">Ear<\/p>/);
 assert.match(page,/<p class="sense-meaning">Moment \/ Instant<\/p>/);
 assert.match(page,/<h3>Morphology<\/h3>/);
 assert.match(page,/<h3>Word Family<\/h3>/);
 assert.match(page,/For: Moment \/ Instant \(Noun\)/);
 assert.match(page,/<strong>Aen<\/strong>[\s\S]*<strong>-or<\/strong>/);
 api.renderDetail(api.findBestLexiconMatch('An'));
 page=elements.get('detailView').innerHTML;
 assert.equal((page.match(/class="sense-block"/g)||[]).length,1);
 assert.match(page,/Preposition/);
 assert.match(page,/<h3>Examples \(869\)<\/h3>/);
 assert.match(page,/<summary>More examples \(864\)<\/summary>/);
 assert.match(page,/<h3>Phrases \(1\)<\/h3>/);
 assert.match(page,/<h3>Related forms and constructions \(1\)<\/h3>/);
 assert.match(page,/<h3>Teaching illustrations \(14\)<\/h3>/);
 assert.equal((page.match(/data-example-placement="related:1"/g)||[]).length,1);
 api.renderDetail(api.findBestLexiconMatch('Jor'));
 page=elements.get('detailView').innerHTML;
 assert.match(page,/<h3>Historical examples \(1\)<\/h3>/);
 assert.match(page,/Examples for this meaning \(3\)/);
 api.renderDetail(api.findBestLexiconMatch('Thal'));
 page=elements.get('detailView').innerHTML;
 assert.match(page,/<h3>Idioms and sayings \(2\)<\/h3>/);
 assert.match(page,/data-sense-id="thal-s2"[\s\S]*?data-example-placement="direct:3"/);
 api.renderDetail(api.findBestLexiconMatch('Aen'));
 page=elements.get('detailView').innerHTML;
 for(const type of ['Verb','Conjunction','Noun'])assert.match(page,new RegExp(`class="sense-type">${type}<`));
 assert.doesNotMatch(page,/class="sense-type">Suffix</);
 api.renderDetail(api.findBestLexiconMatch('Aivkorxar'));
 page=elements.get('detailView').innerHTML;
 assert.doesNotMatch(api.findBestLexiconMatch('Aivkorxar').searchText,/aivkor wound \+ xar protective covering/,'search must not index a hidden duplicate origin line');
 assert.match(page,/<h3>Variant forms<\/h3>/);
 assert.match(page,/<strong class="variant-form">Aivakorxar<\/strong>/);
 assert.match(page,/<span class="variant-pronunciation">\/ah-ee-vah-kohr-xahr\/<\/span>/);
 assert.match(page,/<strong>Aivkor<\/strong>[\s\S]*<strong>Xar<\/strong>/);
 assert.doesNotMatch(page,/<p class="family-label">Word origin<\/p>/);
 assert.match(page,/morphology-part--1/);
 assert.match(page,/morphology-part--2/);
 api.renderDetail(api.findBestLexiconMatch('Velmarin'));
 page=elements.get('detailView').innerHTML;
 assert.match(page,/For: [^<]+\(Noun\)/);
 assert.equal((page.match(/class="morphology-analysis"/g)||[]).length,2);
 api.renderDetail(api.findBestLexiconMatch('Dumaen'));
 page=elements.get('detailView').innerHTML;
 assert.doesNotMatch(page,/<h3>Morphology<\/h3>/);
 api.renderDetail(api.findBestLexiconMatch('Morl'));
 page=elements.get('detailView').innerHTML;
 assert.doesNotMatch(page,/<p class="sense-meaning">Mountain; stone; endurance; the unchanging past<\/p>/);
 console.log('PASS: approved sources load and dictionary lookup, family links, examples, grammar, expressions, and Phrase Builder inputs remain available.');
})().catch(error=>{console.error(error);process.exit(1)});
