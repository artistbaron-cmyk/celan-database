const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {spawnSync} = require('node:child_process');

const sourceDir = __dirname;
const fixtureDir = fs.mkdtempSync(path.join(sourceDir, '.edit-rebuild-check-'));
const marker = 'Test-only surface material';
const exampleMarker = 'Test-only example translation.';
const originMarker = 'Test-only word origin';

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
  return {headers,rows:data.map(cells=>Object.fromEntries(headers.map((header,index)=>[header,cells[index]||''])))};
}
function csvEscape(value){const text=String(value??'');return /[",\n\r]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;}
function editCsv(filename,change) {
  const filenamePath=path.join(fixtureDir,'app_data',filename);
  const {headers,rows}=parseCsv(fs.readFileSync(filenamePath,'utf8'));
  change(rows);
  fs.writeFileSync(filenamePath,[headers.join(','),...rows.map(row=>headers.map(header=>csvEscape(row[header])).join(','))].join('\n')+'\n');
}
function run(filename){
  const result=spawnSync(process.execPath,[path.join(fixtureDir,filename)],{encoding:'utf8'});
  assert.equal(result.status,0,`${filename} failed:\n${result.stdout}\n${result.stderr}`);
}
function element(){return {innerHTML:'',textContent:'',value:'',children:[],dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},append(){},appendChild(){},addEventListener(){},querySelectorAll(){return []},scrollIntoView(){}};}
async function readApp(){
  const elements=new Map();
  const document={getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},createElement:element,querySelector:element};
  const window={EMBEDDED_DATA:null,location:null,addEventListener(){},matchMedia(){return {matches:false}},requestAnimationFrame(fn){fn();}};
  const context=vm.createContext({console,window,document,setTimeout,clearTimeout});
  const html=fs.readFileSync(path.join(fixtureDir,'index.html'),'utf8');
  for(const [,src] of html.matchAll(/<script src="([^"]+)"/g)){
    const filename=path.resolve(fixtureDir,src);
    vm.runInContext(fs.readFileSync(filename,'utf8'),context,{filename});
  }
  vm.runInContext('globalThis.probe={state,renderDetail,findEnglishMatches,applyFilters};',context);
  for(let i=0;i<100&&!context.probe.state.groupedEntries.length;i++)await new Promise(resolve=>setTimeout(resolve,50));
  assert.ok(context.probe.state.groupedEntries.length,'test app did not load');
  return {api:context.probe,elements};
}

(async()=>{
  try{
    fs.cpSync(path.join(sourceDir,'app_data'),path.join(fixtureDir,'app_data'),{recursive:true});
    for(const filename of ['index.html','script.js','build_embedded_data.js','export_dictionary_csv.js']){
      fs.copyFileSync(path.join(sourceDir,filename),path.join(fixtureDir,filename));
    }
    editCsv('dictionary_entries.csv',rows=>{
      const gorm=rows.find(row=>row.id==='gorm');
      assert.ok(gorm);
      gorm.pronunciation='/test-only/';
      const anshanaen=rows.find(row=>row.id==='anshanaen');
      assert.ok(anshanaen);
      const metadata=JSON.parse(anshanaen.metadata_json);
      metadata.derivations=[originMarker];
      anshanaen.metadata_json=JSON.stringify(metadata);
    });
    editCsv('dictionary_senses.csv',rows=>{
      const sense=rows.find(row=>row.headword_id==='gorm'&&row.visible==='Yes');
      assert.ok(sense);
      sense.meaning=marker;
    });
    editCsv('dictionary_examples.csv',rows=>{
      const example=rows.find(row=>row.headword_id==='gorm'&&row.section==='direct'&&row.display_order==='1');
      assert.ok(example);
      example.translation=exampleMarker;
    });
    run('build_embedded_data.js');
    run('export_dictionary_csv.js');
    const {api,elements}=await readApp();
    const gorm=api.state.groupedEntries.find(group=>group.id==='gorm');
    const anshanaen=api.state.groupedEntries.find(group=>group.id==='anshanaen');
    api.renderDetail(gorm);
    const gormHtml=elements.get('detailView').innerHTML;
    api.renderDetail(anshanaen);
    const anshanaenHtml=elements.get('detailView').innerHTML;
    const exportRows=parseCsv(fs.readFileSync(path.join(fixtureDir,'exports','dictionary_entries.csv'),'utf8')).rows;
    const gormExport=exportRows.find(row=>row.headword==='Gorm');
    const anshanaenExport=exportRows.find(row=>row.headword==='Anshanaen');
    const checks={
      entryMeaning:gormHtml.includes(marker),
      entryPronunciation:gormHtml.includes('/test-only/'),
      entryExample:gormHtml.includes(exampleMarker),
      englishSearch:api.findEnglishMatches(gorm,marker).length>0,
      resultPreview:gorm.preview.includes(marker),
      allFieldsSearch:gorm.searchText.includes(marker.toLowerCase()),
      entryOrigin:anshanaenHtml.includes(originMarker),
      exportMeaning:gormExport?.meaning===marker,
      exportPronunciation:gormExport?.pronunciation==='/test-only/',
      exportExample:gormExport?.example_1_translation===exampleMarker,
      exportOrigin:anshanaenExport?.derivation===originMarker
    };
    console.log(JSON.stringify(checks,null,2));
    assert.deepEqual(Object.keys(checks).filter(key=>!checks[key]),[],'source edits did not reach every app and export surface');
    console.log('PASS: test-only source edits reached the app, search, previews, and export after rebuild.');
  } finally {
    // Only the directory created above is removed; real app files were never edited.
    fs.rmSync(fixtureDir,{recursive:true,force:true});
  }
})().catch(error=>{console.error(error);process.exit(1)});
