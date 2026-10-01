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
vm.runInContext('globalThis.appTest={state,findEnglishMatches,findBestLexiconMatch,renderDetail,renderRuleDetail,renderExpressionDetail,analyzeForgeTerm,buildPronunciation,displayUses}',context);
(async()=>{
 const api=context.appTest;
 for(let i=0;i<100&&!api.state.groupedEntries.length;i++)await new Promise(resolve=>setTimeout(resolve,50));
 assert.equal(api.state.groupedEntries.length,1496);
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
 assert.equal(visibleCount,1607);
 assert.equal(api.state.groupedEntries.reduce((count,group)=>count+api.displayUses(group).length,0),1607);
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
   assert.equal((page.match(/class="sense-block"/g)||[]).length,visible.length,`${group.term} has an incorrect number of visible meanings`);
   assert.equal((page.match(/class="sense-type"/g)||[]).length,visible.filter(sense=>sense.type).length,`${group.term} is missing a word type`);
   assert.doesNotMatch(page,/Sense assignment pending review|Retain as-is|Preserved as standalone root\/morpheme because source clearly defines it|The source gloss|Builds the approved|Source uses Ohnoshan|Names the organ without embedding an unapproved theory/i,`${group.term} exposes an internal note`);
 }
 assert.equal(senseIds.size,1607);
 api.renderDetail(api.findBestLexiconMatch('Aenor'));
 let page=elements.get('detailView').innerHTML;
 assert.match(page,/data-sense-id="aenor-s1"/);
 assert.match(page,/data-sense-id="aenor-s2"/);
 assert.match(page,/<p class="sense-meaning">Ear<\/p>/);
 assert.match(page,/<p class="sense-meaning">Moment \/ Instant<\/p>/);
 assert.doesNotMatch(page,/<h3>Morphology<\/h3>|<h3>Word Family<\/h3>/);
 api.renderDetail(api.findBestLexiconMatch('An'));
 page=elements.get('detailView').innerHTML;
 assert.equal((page.match(/class="sense-block"/g)||[]).length,2);
 assert.match(page,/Preposition/);
 api.renderDetail(api.findBestLexiconMatch('Aen'));
 page=elements.get('detailView').innerHTML;
 for(const type of ['Verb','Conjunction','Suffix','Noun'])assert.match(page,new RegExp(`class="sense-type">${type}<`));
 api.renderDetail(api.findBestLexiconMatch('Aivkorxar'));
 page=elements.get('detailView').innerHTML;
 assert.match(page,/<h3>Variant forms<\/h3>/);
 assert.match(page,/<strong class="variant-form">Aivakorxar<\/strong>/);
 assert.match(page,/<span class="variant-pronunciation">\/ah-ee-vah-kohr-xahr\/<\/span>/);
 api.renderDetail(api.findBestLexiconMatch('Morl'));
 page=elements.get('detailView').innerHTML;
 assert.doesNotMatch(page,/<p class="sense-meaning">Mountain; stone; endurance; the unchanging past<\/p>/);
 console.log('PASS: approved sources load and dictionary lookup, family links, examples, grammar, expressions, and Phrase Builder inputs remain available.');
})().catch(error=>{console.error(error);process.exit(1)});
