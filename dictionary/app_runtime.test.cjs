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
 assert.match(elements.get('detailView').innerHTML,/Related words/);
 const grammar=api.state.grammarRules[0];
 api.renderRuleDetail(grammar);
 assert.ok(elements.get('ruleDetailView').innerHTML.length>100);
 api.renderExpressionDetail(api.state.expressions[0]);
 assert.ok(elements.get('expressionDetailView').innerHTML.length>100);
 assert.ok(api.state.rootLookup.length>0);
 assert.ok(api.state.forgeParts.length>0);
 console.log('PASS: approved sources load and dictionary lookup, family links, examples, grammar, expressions, and Phrase Builder inputs remain available.');
})().catch(error=>{console.error(error);process.exit(1)});
