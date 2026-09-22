// State and persistence tests without a browser or changes to real review decisions.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const flags = JSON.parse(fs.readFileSync(__dirname + '/flags.json', 'utf8')).slice(0, 2);
const script = fs.readFileSync(__dirname + '/decisions.js', 'utf8');
function boot(store = new Map(), blocked = false, resolutions = {}) {
  const ids = new Map(), boxes = [], downloads = [];
  class El {
    constructor(){this.children=[];this.listeners={};this.value='';this.dataset={};this.textContent='';this.hidden=false;}
    set id(v){this._id=v;ids.set(v,this);} get id(){return this._id;}
    set innerHTML(v){this.html=v;for(const match of v.matchAll(/<(input|select|textarea|button|p)[^>]*\bid="([^"]+)"/g)){const e=new El();e.id=match[2];this.children.push(e);}if(v.includes('decision-state')){this.state=new El();this.children.push(this.state);for(const a of ['approve','kept','deferred','pending']){const e=new El();e.dataset.action=a;this.children.push(e);}}}
    append(e){this.children.push(e);if(e.className==='decision-box')boxes.push(e);}
    before(){} remove(){} setCustomValidity(v){this.error=v;} reportValidity(){}
    addEventListener(k,f){(this.listeners[k]??=[]).push(f);}
    async fire(k){for(const f of this.listeners[k]||[])await f({target:this});}
    click(){return this.fire('click');}
    querySelector(s){if(s.startsWith('#'))return ids.get(s.slice(1));if(s==='.decision-state')return this.state;return this.children.find(e=>e.dataset.action===s.match(/"([^"]+)"/)[1]);}
    querySelectorAll(){return this.children.filter(e=>e.dataset.action);}
  }
  for(const id of ['review-data','search','category','certainty','count']){const e=new El();e.id=id;}
  ids.get('review-data').textContent=JSON.stringify({revision:'test-revision',flags,resolutions});
  const cards=flags.map(f=>{const e=new El();e.id=f.id;return e;});
  const doc={createElement:()=>new El(),getElementById:id=>ids.get(id),querySelector:()=>new El(),querySelectorAll:s=>s==='.flag'?cards:[],body:new El()};
  const win={filter:()=>cards.forEach(e=>e.hidden=false),confirm:()=>true};
  const context={document:doc,window:win,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return store.get(k);},setItem:(k,v)=>{if(blocked)throw Error('blocked');store.set(k,v);}},Blob,URL:{createObjectURL:b=>{downloads.push(b);return 'blob:test';},revokeObjectURL:()=>{}},setTimeout:()=>{}};
  vm.runInNewContext(script,context);
  return {ids,boxes,downloads,cards,store};
}
(async()=>{
  let app=boot();const id=flags[0].id;
  const button=(a,action)=>a.boxes[0].querySelector('[data-action="'+action+'"]');
  await button(app,'approve').click();
  assert.equal(app.boxes[0].dataset.status,'approved');
  const t=app.ids.get('change-'+id);t.value='My preferred wording';await t.fire('input');
  assert.equal(app.boxes[0].dataset.status,'draft');
  await button(app,'approve').click();assert.equal(app.boxes[0].dataset.status,'edited');
  app=boot(app.store);assert.equal(app.ids.get('change-'+id).value,'My preferred wording');assert.equal(app.boxes[0].dataset.status,'edited');
  await app.ids.get('export-decisions').click();
  const exported=JSON.parse(await app.downloads[0].text());assert.equal(exported.decisions[0].text,'My preferred wording');
  const fresh=boot();const input=fresh.ids.get('import-file');input.files=[{text:async()=>JSON.stringify(exported)}];await input.fire('change');assert.equal(fresh.boxes[0].dataset.status,'edited');
  input.files=[{text:async()=>JSON.stringify({...exported,revision:'wrong'})}];await input.fire('change');assert.equal(fresh.boxes[0].dataset.status,'edited');assert.match(fresh.ids.get('save-status').textContent,/does not match/);
  const selector=fresh.ids.get('decision-filter');selector.value='pending';await selector.fire('change');assert.equal(fresh.cards[0].hidden,true);assert.equal(fresh.cards[1].hidden,false);
  await button(fresh,'kept').click();assert.equal(fresh.boxes[0].dataset.status,'kept');
  await button(fresh,'deferred').click();assert.equal(fresh.boxes[0].dataset.status,'deferred');
  await button(fresh,'pending').click();assert.equal(fresh.boxes[0].dataset.status,'pending');
  const empty=fresh.ids.get('change-'+id);empty.value=' ';await empty.fire('input');await button(fresh,'approve').click();assert.equal(fresh.boxes[0].dataset.status,'draft');assert.ok(empty.error);
  const unavailable=boot(new Map(),true);await button(unavailable,'approve').click();assert.match(unavailable.ids.get('save-status').textContent,/unavailable/);await unavailable.ids.get('export-decisions').click();assert.equal(unavailable.downloads.length,1);
  const resolved=boot(app.store,false,{[id]:{summary:'Applied locally'}});
  assert.equal(resolved.boxes.length,1);
  assert.match(resolved.ids.get('decision-progress').textContent,/1 applied/);
  await resolved.ids.get('export-decisions').click();
  const resolvedExport=JSON.parse(await resolved.downloads[0].text());
  assert.ok(!resolvedExport.decisions.some(d=>d.id===id));
  assert.ok(resolvedExport.appliedResolutions[id]);
  console.log('PASS: approval, editing, persistence, export/import, filters, storage fallback, and applied resolutions overriding stale browser decisions.');
})().catch(e=>{console.error(e);process.exitCode=1;});
