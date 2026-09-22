(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('review-data').textContent);
  const resolutions = data.resolutions || {};
  const key = 'celan-review-decisions:' + data.revision;
  const labels = {applied:'Applied locally', pending:'Not reviewed', draft:'Draft — not approved', approved:'Approved as suggested', edited:'Approved with your changes', kept:'Keep current entry', deferred:'Decide later'};
  let decisions = {};
  let storageOK = true;
  const panel = document.createElement('section');
  panel.className = 'panel'; panel.id = 'review-actions';
  panel.innerHTML = '<h2>Your decisions</h2><p>Approve a suggestion, write your preferred change, keep the current entry, or leave it for later. For suggestions that offer several options, write the option you want before approving.</p><p>Decisions save in this browser when storage is available. <b>Download your decisions</b> to keep a portable copy and send it back here for application to the dictionary. These controls record your instructions; they do not change the Dictionary App.</p><div class="actions"><button id="export-decisions" class="primary">Download decisions</button><button id="import-decisions">Load saved decisions</button><input id="import-file" type="file" accept=".json,application/json" hidden></div><p id="save-status" role="status"></p><p id="decision-progress"></p><label>Review status<select id="decision-filter"><option value="">All review statuses</option></select></label>';
  document.querySelector('.controls').before(panel);
  const status = document.getElementById('save-status');
  const selector = document.getElementById('decision-filter');
  Object.entries(labels).forEach(([value, label]) => {const o=document.createElement('option');o.value=value;o.textContent=label;selector.append(o);});
  const byId = new Map(data.flags.map(f => [f.id, f]));
  function validate(input) {
    if (!input || input.schema !== 'celan-dictionary-decisions-v1' || input.revision !== data.revision || !Array.isArray(input.decisions)) throw Error('This file does not match this dictionary review. Your current decisions have been kept.');
    const result = {};
    for (const d of input.decisions) {
      if (!d || !byId.has(d.id) || result[d.id] || (!Object.hasOwn(labels,d.status) || d.status === 'applied') || typeof d.text !== 'string' || typeof d.notes !== 'string' || ((d.status === 'approved' || d.status === 'edited') && !d.text.trim())) throw Error('The decisions file contains an invalid item. Your current decisions have been kept.');
      if (d.status === 'approved' && d.text !== byId.get(d.id).decision) throw Error('An approved suggestion has different wording. Your current decisions have been kept.');
      result[d.id] = {id:d.id,status:d.status,text:d.text,notes:d.notes,updatedAt:typeof d.updatedAt === 'string' ? d.updatedAt : ''};
    }
    return result;
  }
  function payload() {return {schema:'celan-dictionary-decisions-v1',revision:data.revision,exportedAt:new Date().toISOString(),appliedResolutions:resolutions,decisions:Object.values(decisions).filter(d=>!resolutions[d.id]).map(d => ({...d,title:byId.get(d.id).title,originalSuggestion:byId.get(d.id).decision}))};}
  try {const saved=localStorage.getItem(key);if(saved)decisions=validate(JSON.parse(saved));} catch(e) {storageOK=false;status.textContent='Browser saving is unavailable or saved data could not be read. Download your decisions before closing this page.';}
  function persist(){try{localStorage.setItem(key,JSON.stringify(payload()));storageOK=true;status.textContent='Saved in this browser. Download a copy when you finish reviewing.';}catch(e){storageOK=false;status.textContent='Browser saving is unavailable. Download your decisions before closing this page.';}}
  function current(f){if(resolutions[f.id])return {id:f.id,status:'applied',text:resolutions[f.id].summary,notes:''};return decisions[f.id] || {id:f.id,status:'pending',text:f.decision,notes:''};}
  function updateCounts(){const tally={};data.flags.forEach(f=>{const s=current(f).status;tally[s]=(tally[s]||0)+1;});document.getElementById('decision-progress').textContent=(tally.applied||0)+' applied · '+((tally.approved||0)+(tally.edited||0))+' approved · '+(tally.kept||0)+' kept · '+(tally.deferred||0)+' deferred · '+(tally.draft||0)+' drafts · '+(tally.pending||0)+' not reviewed';}
  const originalFilter = window.filter;
  window.filter = function(){originalFilter();let n=0;document.querySelectorAll('.flag').forEach(card=>{if(selector.value && current(byId.get(card.id)).status!==selector.value)card.hidden=true;if(!card.hidden)n++;});document.getElementById('count').textContent=n+' of '+data.flags.length+' flags';};
  selector.addEventListener('change',window.filter);
  ['search','category','certainty'].forEach(id=>document.getElementById(id).addEventListener('input',window.filter));
  const refreshers = [];
  data.flags.forEach(f=>{
    if(resolutions[f.id])return;
    const card=document.getElementById(f.id), box=document.createElement('section');box.className='decision-box';
    box.innerHTML='<h3>Your decision</h3><p class="decision-state" aria-live="polite"></p><label for="change-'+f.id+'">Suggested change — edit this to say exactly what you want<textarea id="change-'+f.id+'"></textarea></label><p class="decision-help">Editing creates a draft. Use “Approve this wording” to approve your edited instructions.</p><label for="note-'+f.id+'">Your notes (optional)<textarea id="note-'+f.id+'" placeholder="Explain your choice or add context"></textarea></label><div class="actions"><button class="primary" data-action="approve">Approve suggestion</button><button data-action="kept">Keep current entry</button><button data-action="deferred">Decide later</button><button data-action="pending">Mark unreviewed</button></div>';
    card.append(box);const text=box.querySelector('#change-'+f.id), notes=box.querySelector('#note-'+f.id), approve=box.querySelector('[data-action="approve"]');
    function paint(){const d=current(f);text.value=d.text;notes.value=d.notes;box.dataset.status=d.status;box.querySelector('.decision-state').textContent=labels[d.status];approve.textContent=d.text===f.decision?'Approve suggestion':'Approve this wording';}
    function save(next){decisions[f.id]={...current(f),...next,updatedAt:new Date().toISOString()};persist();paint();updateCounts();window.filter();}
    text.addEventListener('input',()=>save({text:text.value,status:'draft'}));
    notes.addEventListener('input',()=>save({notes:notes.value}));
    box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{let s=b.dataset.action;if(s==='approve'){if(!text.value.trim()){text.setCustomValidity('Write the change you want to approve.');text.reportValidity();return;}s=text.value===f.decision?'approved':'edited';}save({status:s,text:text.value,notes:notes.value});}));
    text.addEventListener('input',()=>text.setCustomValidity(''));
    refreshers.push(paint);paint();
  });
  document.querySelectorAll('.flaglink').forEach(a=>a.addEventListener('click',()=>{selector.value='';window.filter();}));
  document.getElementById('export-decisions').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(payload(),null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='celan-dictionary-decisions-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Download requested. Keep the file and send it back here when you want your approved decisions applied.';});
  const file=document.getElementById('import-file');document.getElementById('import-decisions').addEventListener('click',()=>file.click());
  file.addEventListener('change',async()=>{try{if(!file.files[0])return;const imported=validate(JSON.parse(await file.files[0].text()));const conflicts=Object.keys(imported).filter(id=>decisions[id] && JSON.stringify(decisions[id])!==JSON.stringify(imported[id]));if(conflicts.length && !window.confirm('Replace '+conflicts.length+' existing decision(s) with the choices in this file?'))return;decisions={...decisions,...imported};persist();refreshers.forEach(fn=>fn());updateCounts();window.filter();status.textContent='Loaded '+Object.keys(imported).length+' saved decisions.'+(storageOK?' Saved in this browser.':' Download a copy before closing.');}catch(e){status.textContent=e.message;}finally{file.value='';}});
  updateCounts();if(storageOK)status.textContent='Ready. Your choices will save in this browser; download a copy to keep and share.';
})();
