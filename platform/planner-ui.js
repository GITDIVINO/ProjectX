(function(root){
'use strict';
const {esc,numberFormat:sharedFormat}=typeof module!=='undefined'&&module.exports?require('./ui-format'):root.ProjectXFormat;
// One formatter per digit count; the shared cache keys on the pair, so both digits match here.
const numberFormat=digits=>sharedFormat(digits,digits);
function create(env){
 const {M,P,getState,changed}=env,$=id=>document.getElementById(id);
 const n=x=>Number.isFinite(x)?String(x):'—',fmt=(x,d=2)=>Number.isFinite(x)?numberFormat(d).format(x):'—';
 const btn=(action,label,attrs='')=>`<button type="button" data-action="${action}" ${attrs}>${label}</button>`;
 const table=(head,rows)=>`<div class="table-wrap"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
 function state(){return getState();}
 function motionSnapshot(){const map=new Map();if(typeof document==='undefined'||typeof document.querySelectorAll!=='function'||typeof getComputedStyle!=='function')return map;document.querySelectorAll('.cargo-fill').forEach(el=>map.set(el.dataset.fillKey+'|'+el.closest('svg')?.getAttribute('class'),getComputedStyle(el).transform));return map;}
 function animate(map){if(!map.size||typeof matchMedia!=='function'||matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('print').matches)return;document.querySelectorAll('.cargo-fill').forEach(el=>{const target=el.style.transform,from=map.get(el.dataset.fillKey+'|'+el.closest('svg')?.getAttribute('class'))||el.dataset.fillFrom||'translate(0px, 215px) scale(1, 0)';if(el.animate&&from!==getComputedStyle(el).transform)el.animate([{transform:from},{transform:target}],{duration:280,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});});}

 // Two views of the same plan, holds at the same x in both: the profile states how full each hold is,
 // the plan states what is in it and where that cargo is loaded.
 const holdBars=(h,lots,x,w,floor,depth)=>{
  let bottom=floor,bars='';
  for(const l of lots){
   const cells=h.cells.filter(a=>a.lot===l.id),q=cells.every(a=>M.ok(a.quantity))?P.exactSum(cells.map(a=>a.quantity)):0;
   const volume=M.ok(l.sf,true)?q*l.sf:0,height=M.ok(h.volume,true)?Math.max(0,Math.min(floor-(floor-depth),volume/h.volume*depth)):0;
   bars+=`<rect class="cargo-fill" data-fill-key="${esc(h.id+'|'+l.id)}" data-fill-from="translate(0px, ${floor}px) scale(1, 0)" x="${x+1}" y="0" width="${w-2}" height="1" fill="${esc(l.color)}" opacity=".7" style="transform:translate(0px, ${bottom-height}px) scale(1, ${height});transform-origin:0 0"/>`;
   bottom-=height;
  }
  return bars;
 };
 const holdClass=(h,flagged)=>`hold ${h.fill>100?'hold-exceeded':''} ${flagged.has(h.id)?'hold-review':''}`;
 function draw(s,patterns){
  const summary=P.stageSummary(s),lots=s.lots.filter(l=>l.selected),pattern=currentPattern(s,patterns||P.loadingPatterns(s)),flagged=new Set(pattern?.issues.flatMap(x=>x.holds)||[]);
  const n=s.holds.length,w=815/n-17,at=i=>180+i*(w+17),hold=i=>summary.holds[n-1-i];
  // Both views are drawn to the same length, 44 to 1096, so the profile stands over the plan frame for frame.
  // The profile follows the sections a bulk carrier actually has: a single deck with hatch coamings above it,
  // topside tanks cutting the upper corners of each hold and hopper tanks cutting the lower ones.
  const DECK=68,KEEL=186,HOLD_TOP=68,HOLD_FOOT=176,TOPSIDE=[20,12],HOPPER=[16,18];
  const holdShape=x=>[[x+TOPSIDE[0],HOLD_TOP],[x+w-TOPSIDE[0],HOLD_TOP],[x+w,HOLD_TOP+TOPSIDE[1]],[x+w,HOLD_FOOT-HOPPER[1]],[x+w-HOPPER[0],HOLD_FOOT],[x+HOPPER[0],HOLD_FOOT],[x,HOLD_FOOT-HOPPER[1]],[x,HOLD_TOP+TOPSIDE[1]]].map(p=>p.join(',')).join(' ');
  let plan='',profile='';
  for(let i=0;i<n;i++){
   const h=hold(i),x=at(i),contents=lots.filter(l=>h.cells.some(a=>a.lot===l.id&&a.quantity>0));
   const names=contents.map(l=>l.name).join(', ')||'Empty';
   // Profile: how full the hold is, in the same colours as the plan below it.
   profile+=`<g data-hold="${esc(h.id)}" class="${holdClass(h,flagged)}" aria-label="Hold ${h.id}: ${fmt(h.fill,1)} percent full; ${fmt(h.mass,1)} t"><polygon class="hold-outline" points="${holdShape(x)}"/><g clip-path="url(#hold-clip-${i})">${holdBars(h,lots,x,w,HOLD_FOOT,HOLD_FOOT-HOLD_TOP)}</g><polygon class="hold-edge" points="${holdShape(x)}"/><text class="profile-hold" x="${x+w/2}" y="${HOLD_TOP+26}" text-anchor="middle">HOLD №${h.id}</text><text class="profile-fill" x="${x+w/2}" y="${HOLD_TOP+56}" text-anchor="middle">${fmt(h.fill,1)} %</text><text class="profile-mass" x="${x+w/2}" y="${HOLD_TOP+78}" text-anchor="middle">${fmt(h.mass,1)} t</text><text class="profile-volume" x="${x+w/2}" y="${HOLD_TOP+98}" text-anchor="middle">${fmt(h.volume)} m³</text></g>`;
   // Plan: the cargo itself and the port each parcel is loaded at.
   plan+=`<g data-hold="${esc(h.id)}" class="${holdClass(h,flagged)}" aria-label="Hold ${h.id}: ${esc(names)}"><title>${esc(contents.map(l=>l.name).join(' / ')||'Empty hold')}</title><rect class="hold-outline" x="${x}" y="86" width="${w}" height="128" rx="3"/>${holdBars(h,lots,x,w,214,128)}<foreignObject x="${x+7}" y="94" width="${w-14}" height="112"><div xmlns="http://www.w3.org/1999/xhtml" class="hold-names">${contents.map(l=>`<div>${esc(l.name)}<small>${esc(l.loadPort||'Load port not set')} → ${esc(l.port||'Discharge port not set')}</small></div>`).join('')||'<span class="muted">Empty</span>'}</div></foreignObject></g>`;
  }
  const clips=Array.from({length:n},(_,i)=>`<clipPath id="hold-clip-${i}"><polygon points="${holdShape(at(i))}"/></clipPath>`).join('');
  const coamings=Array.from({length:n},(_,i)=>`<rect class="ship-hatch" x="${at(i)+TOPSIDE[0]}" y="${DECK-11}" width="${w-TOPSIDE[0]*2}" height="11"/>`).join('');
  // Stern counter, poop, a stepped house with its funnel, the main deck, a forecastle step and a raked stem.
  const profileHull=`<path class="ship-hull" d="M44 ${DECK} V150 Q56 178 140 ${KEEL} H1000 Q1074 176 1090 138 L1096 56 V${DECK-12} H990 L990 ${DECK} H170 V50 H142 V36 H114 V22 H78 V${DECK} Z"/>`
   +`<rect class="ship-hull" x="84" y="6" width="24" height="16"/>`
   +`<path class="ship-deckline" d="M230 ${DECK} H990"/>`+coamings;
  const planHull=`<path class="ship-hull" d="M44 94 Q44 66 76 66 H1000 Q1056 78 1096 150 Q1056 222 1000 234 H76 Q44 234 44 206 Z"/>`;
  return `<svg class="ship ship-profile" viewBox="0 0 1120 192" role="group" aria-label="How full each hold is: aft left, forward right"><defs>${clips}</defs>${profileHull}<text class="ship-end" x="150" y="${DECK+40}" font-size="10" text-anchor="middle">AFT</text>${profile}<text class="ship-end" x="1030" y="${DECK+40}" font-size="10" text-anchor="middle">FWD</text></svg>`
   +`<svg class="ship" viewBox="0 60 1120 180" role="group" aria-label="Stowage: aft left, forward right">${planHull}<text class="ship-end" x="106" y="154" font-size="10" text-anchor="middle">AFT</text>${plan}<text class="ship-end" x="1032" y="154" font-size="10" text-anchor="middle">FWD</text></svg>`;
 }

 // Every arrival and departure draft follows from that state's own displacement.
 const stateLabel=r=>(r.phase==='arrival'?'Arrival · ':'Departure · ')+r.call;
 function draftTable(s,rows){
 const cell=(r,k)=>r.computed?fmt(r.computed[k],2):'—';
 const body=rows.map(r=>{
   const label=stateLabel(r);
   return `<tr><td class="name">${esc(label)}</td><td>${fmt(r.cargo,0)}</td><td>${fmt(r.deadweight,0)}</td><td>${cell(r,'mid')}</td><td>${cell(r,'aft')}</td><td>${cell(r,'fwd')}</td><td>${r.deepest===null?'—':fmt(r.deepest,2)}${r.basis==='computed'?'':' <small>'+esc(r.basis)+'</small>'}</td></tr>`;});
  return table(['State','Cargo, t','Deadweight, t','Mean, m','Aft, m','Fwd, m','Deepest, m'],body)
   +'<p class="form-note">Average-vessel estimate: SW mean = reference draft − (reference DWT − state deadweight) / (100 × TPC); port mean = SW mean × 1.025 / port density. Lightship is not required. Cargo follows the selected parcels; bunkers follow the voyage consumption when available, otherwise Deductions. State inputs override stores. Aft and forward split the stored trim about amidships, not a stability calculation. A surveyed or entered state draft, where one is stored, governs the berth check instead.</p>';
 }
 // Hidden by default; the summary keeps the binding state, and any breach, in view.
 function draftsBlock(s,budget,rows){
  rows=rows||P.stateDrafts(s,budget);
  if(!rows.length)return '<h3>Drafts</h3><p class="muted">Add sales to the voyage to calculate departure and arrival drafts.</p>';
  const measured=rows.filter(r=>r.deepest!==null);
  const over=rows.filter(r=>r.margin!==null&&r.margin<0);
  // A draft with no berth limit beside it is unverified, not clear: it must not read as an all-clear.
  const unchecked=rows.filter(r=>r.margin===null);
  const deepest=measured.length?measured.reduce((a,b)=>b.deepest>a.deepest?b:a):null;
  const tightest=rows.filter(r=>r.margin!==null).sort((a,b)=>a.margin-b.margin)[0]||null;
  const parts=[];
  if(over.length)parts.push(`<strong class="over-limit">${over.length} over the berth limit</strong>`);
  if(unchecked.length)parts.push(`${unchecked.length} not checked against a berth limit`);
  if(deepest)parts.push(`deepest <strong>${fmt(deepest.deepest,2)} m</strong> at ${esc(stateLabel(deepest))}`);
  if(tightest&&!over.length)parts.push(`tightest margin ${fmt(tightest.margin,2)} m at ${esc(stateLabel(tightest))}`);
  // Always collapsed on open: the summary carries the alarm, and the claim is repeated under the table.
  return `<details id="drafts" class="fold"><summary><strong>Drafts</strong><span>${parts.join(' · ')||'No draft calculated'}</span></summary><div class="fold-body">${draftTable(s,rows)}</div></details>`;
 }
 function currentPattern(s,patterns){return s.stage==='load'?patterns.plan:patterns.states.find(x=>x.key===P.resolveStage(s)?.key)||patterns.plan;}
 function patternText(row){if(row.status==='empty')return 'No cargo · ballast condition not checked';if(row.status==='incomplete')return row.missing.join('; ')||'Complete the cargo allocation';return row.issues.length?row.issues.map(x=>x.text).join('; '):'No listed pattern found · ship-specific checks still required';}
 function loadingPatternBody(s,patterns){
  if(!s.lots.some(l=>l.selected))return '';
  patterns=patterns||P.loadingPatterns(s);
  const current=currentPattern(s,patterns),departures=patterns.states.filter(x=>x.phase==='departure'&&x.status==='attention'),incomplete=patterns.states.filter(x=>x.status==='incomplete');
  const attention=['attention','incomplete'].includes(current.status)?current:departures[0]||patterns.states.find(x=>['attention','incomplete'].includes(x.status));
  const heading=departures.length?departures.length+' departure '+(departures.length===1?'state needs':'states need')+' review':incomplete.length?'Cargo allocation incomplete':'Preliminary pattern check';
  const alert=attention?`<p class="loading-pattern-alert"><strong>${esc(attention.label)}</strong> · ${esc(patternText(attention))} ${attention.key!==current.key?btn('loading-state','Show state',`data-id="${esc(attention.key)}"`):''}</p>`:`<p class="loading-pattern-neutral">${esc(patternText(current))}</p>`;
  const groups=`<p class="loading-group-mass">Current state · FWD group ${fmt(current.foreMass,1)} t · MID ${fmt(current.middleMass,1)} t · AFT group ${fmt(current.aftMass,1)} t</p>`;
  const rows=[patterns.plan,...patterns.states].map(row=>`<tr class="${row.status==='attention'?'loading-pattern-row':''}" data-loading-state="${esc(row.key)}" aria-current="${row.key===current.key?'true':'false'}"><td class="name">${btn('loading-state',esc(row.label),`class="text-action" data-id="${esc(row.key)}"`)}</td>${row.masses.map(h=>`<td>${fmt(h.mass,1)}</td>`).join('')}<td>${fmt(row.quantity,1)}</td><td class="loading-pattern-text">${esc(patternText(row))}</td></tr>`);
  // What the flags mean, and what they are not. Said on the page because a screening prompt
  // read as an approval is the expensive mistake here.
  const FLAG_NOTE='<p class="form-note">Flags: cargo only forward or aft; a single occupied hold; empty holds between loaded holds; a partial block; more than half of the cargo in one hold (3+ holds). These are review prompts, not allowable loading limits. Groups follow the forward-to-aft hold order; the middle group is the central hold when the count is odd.</p>';
  const BASIS_NOTE='<p class="form-note">Basis: <a href="https://iacs.org.uk/resolutions/recommendations/41-60/rec-46-rev2-cln" target="_blank" rel="noopener noreferrer">IACS Recommendation 46</a> and <a href="https://www.imo.org/en/ourwork/safety/pages/blu-code-and-blu-manual.aspx" target="_blank" rel="noopener noreferrer">IMO BLU Code</a>. Pattern recognition is a ProjectX planning aid, not an IMO or class approval.</p>';
  return `<div class="loading-pattern-heading"><h3>Cargo distribution</h3>`+
   `<span class="${departures.length?'notice':'muted'}">${esc(heading)}</span></div>`+
   alert+groups+
   `<details id="loading-pattern-states" class="fold"><summary>All port states and screening rules</summary>`+
   `<div class="fold-body">`+
   table(['State',...s.holds.map(h=>'№'+h.id+', t'),'Cargo, t','Check'],rows)+
   FLAG_NOTE+BASIS_NOTE+
   `</div></details>`;
 }
 // Section 3: what is in which hold, at the chosen state of the voyage. The table is
 // editable only while the plan is being built; once a state is chosen it is a reading of
 // that state, not a place to type.
 const stageOptions=(s,editable)=>
  `<option value="load" ${editable?'selected':''}>After all loadings · edit plan</option>`+
  P.events(s).map(e=>`<option value="${esc(e.key)}" ${P.resolveStage(s)?.key===e.key?'selected':''}>${esc(e.label)}</option>`).join('');

 const holdCell=(s,l,h,summary,editable)=>{
  const q=summary.allocations.filter(a=>a.lot===l.id&&a.hold===h.id).reduce((n,a)=>n+(a.quantity??0),0);
  return `<td>${editable
   ?`<input type="text" inputmode="decimal" data-lot="${esc(l.id)}" data-hold="${h.id}" aria-label="${esc(l.name)} hold ${h.id}" value="${q?fmt(q,1):''}" placeholder="—">`
   :fmt(q,1)}</td>`;
 };

 const allocationRow=(s,l,summary,editable)=>
  `<tr><td class="name"><span class="tag" style="background:${esc(l.color)}"></span>`+
  `<small>${esc(l.saleId||l.id)}</small><br>${esc(l.name)}</td>`+
  s.holds.map(h=>holdCell(s,l,h,summary,editable)).join('')+
  `<td data-unassigned="${esc(l.id)}">${fmt(l.unassigned,1)}</td>`+
  `<td>${fmt(l.onBoard,1)}</td></tr>`;

 function section3(s,budget,report){
  const summary=P.stageSummary(s);
  report=report||P.check(s,budget);
  const editable=s.stage==='load';
  return `<section id="stowage-section">`+
   `<div class="heading"><h2>3. Stowage by hold</h2><div class="button-row">`+
   btn('allocate','Allocate by volume',!summary.rows.length?'disabled':'')+
   (s.planning?.undo?btn('undo-plan','Undo'):'')+
   btn('planning-checks','Checks')+
   `</div></div>`+
   `<div class="route"><select data-path="stage" aria-label="Cargo plan stage">${stageOptions(s,editable)}</select>`+
   `<span data-stage-total>${(fmt(summary.quantity,1)+' t on board').toUpperCase()}</span>`+
   (!editable?btn('edit-plan','Edit loading plan'):'')+
   (report.technical==='not-reviewed'?'':`<span class="planning-status">${esc('Technical review: '+report.technical)}</span>`)+
   `</div>`+
   `<div class="ship-wrap">${draw(s,report.loadingPatterns)}</div>`+
   `<div id="loading-patterns">${loadingPatternBody(s,report.loadingPatterns)}</div>`+
   `<div class="table-wrap"><table class="allocation"><thead><tr><th>Sale / cargo</th>`+
   s.holds.map(h=>`<th>№${h.id}</th>`).join('')+
   `<th>Unassigned, t</th><th>On board, t</th></tr></thead><tbody>`+
   summary.rows.map(l=>allocationRow(s,l,summary,editable)).join('')+
   `</tbody></table></div>`+
   draftsBlock(s,budget,report.drafts)+
   `<div id="plan-errors">${report.errors.map(x=>`<p class="error">${esc(x)}</p>`).join('')}</div>`+
   `</section>`;
 }
 function refresh(){const s=state(),wrap=document.querySelector('#stowage-section .ship-wrap');if(!wrap)return;const before=motionSnapshot(),report=P.check(s);wrap.innerHTML=draw(s,report.loadingPatterns);animate(before);const summary=P.stageSummary(s);document.querySelectorAll('[data-unassigned]').forEach(el=>el.textContent=fmt(summary.rows.find(l=>l.id===el.dataset.unassigned)?.unassigned,1));const errors=$('plan-errors');if(errors)errors.innerHTML=report.errors.map(x=>`<p class="error">${esc(x)}</p>`).join('');const panel=$('loading-patterns'),open=$('loading-pattern-states')?.open;if(panel){panel.innerHTML=loadingPatternBody(s,report.loadingPatterns);if(open&&$('loading-pattern-states'))$('loading-pattern-states').open=true;}}
 function modal(title,body,onSave,label='Save'){const d=document.createElement('dialog');d.className='planning-dialog';d.innerHTML=`<form><div class="heading"><h2>${esc(title)}</h2><button type="button" data-close aria-label="Close">×</button></div>${body}<p class="error" role="alert"></p>${onSave?`<button type="submit" class="primary">${esc(label)}</button>`:''}</form>`;document.body.appendChild(d);d.querySelector('[data-close]').onclick=()=>{d.close();d.remove();};d.addEventListener('close',()=>d.remove());d.querySelector('form').onsubmit=e=>{e.preventDefault();if(!onSave)return;try{onSave(new FormData(e.target));d.close();d.remove();changed();}catch(error){d.querySelector('.error').textContent=error.message;}};d.showModal();return d;}
 const field=(key,label,value='',type='text',required=false)=>`<label class="field">${label}<input name="${key}" type="${type}" value="${esc(value??'')}" ${type==='number'?'step="any" min="0"':''} ${required?'required':''}></label>`;
 const select=(key,label,value,options)=>`<label class="field">${label}<select name="${key}">${options.map(o=>{const [v,t]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${v===value?'selected':''}>${esc(t)}</option>`;}).join('')}</select></label>`;
 const val=(f,k)=>String(f.get(k)||'').trim(),number=(f,k)=>val(f,k)===''?null:Number(f.get(k)), grid=x=>`<div class="grid">${x}</div>`;
 function passport(lotId,edit=false){const s=state(),l=s.lots.find(l=>l.id===lotId);if(!l)return;P.ensure(s);const p=l.passport,c=s.cargoTypes.find(c=>c.id===l.cargoId);
  if(!edit){const d=modal(l.name,`<dl class="evidence"><dt>Sale</dt><dd>${esc(l.saleId)}</dd><dt>Shipment SF</dt><dd>${n(l.sf)} m³/t · ${esc(p.basis)}</dd><dt>Source</dt><dd>${esc(p.source||'Not entered')} · ${esc(p.date||'No date')}</dd><dt>BCSN</dt><dd>${esc(p.bcsn||'Not declared')}</dd><dt>Current catalogue SF</dt><dd>${n(c?.sf)} m³/t ${c?.sf!==l.sf?`· volume difference ${fmt((c.sf-l.sf)*l.quantity)} m³`:''}</dd><dt>Volume</dt><dd>${n(l.quantity)} × ${n(l.sf)} = ${fmt(l.quantity*l.sf)} m³</dd><dt>Version</dt><dd>${p.version}</dd></dl>${btn('source-in-sale','Edit shipment source in SALE')}`);d.querySelector('[data-action="source-in-sale"]').onclick=()=>{d.close();d.remove();env.openTab('sale');passport(lotId,true);};return;}
  // The shipment passport: what the stowage factor is, where it came from, and what the
  // referenced source permits. Every field is saved with the snapshot, so the figure in the
  // plan can be traced to the document it came from.
  modal('Shipment properties · '+l.saleId,grid(field('value','Source SF / bulk density',p.value??l.sf,'number',true)
   +select('unit','Original unit',p.unit||'m3/t',[['m3/t','m³/t'],['ft3/metric-ton','ft³ / metric ton'],['ft3/long-ton','ft³ / long ton'],['ft3/short-ton','ft³ / short ton'],['kg/m3','Bulk density, kg/m³']])
   +select('basis','Basis',p.basis,[['reference','Reference'],['declared','Declared shipment'],['density-estimate','Estimated from density']])
   +field('source','Source document / reference',p.source)
   +field('date','Source date',p.date,'date')
   +field('bcsn','BCSN',p.bcsn)
   +field('specification','Specification / physical form',p.specification)
   +select('group','IMSBC group',l.group||'',['','A','B','C','A & B'])
   +field('hazardClass','Hazard class',p.hazardClass??l.hazardClass)
   +field('un','UN number',p.un??l.un)
   +field('minSf','Minimum SF, m³/t',p.minSf,'number')
   +field('maxSf','Maximum SF, m³/t',p.maxSf,'number')
   +field('codeVersion','IMSBC edition / amendment',p.codeVersion)
   +field('mc','Moisture certificate reference, if applicable',p.mc)
   +field('tml','TML certificate reference, if applicable',p.tml)
   +field('plannedQuantity','Planned quantity, t',l.quantity,'number',true)
   +field('minQuantity','Permitted minimum, t',p.minQuantity,'number')
   +field('maxQuantity','Permitted maximum, t',p.maxQuantity,'number')
   +select('splitAllowed','Quantity variation / split allowed',p.splitAllowed?'yes':'no',[['no','Not established'],['yes','Allowed by referenced source']])
   +field('quantitySource','Quantity permission source',p.quantitySource))+`<p class="muted">Updates this shipment snapshot. The previous version is retained.</p>`,f=>{P.updatePassport(s,lotId,{value:number(f,'value'),unit:val(f,'unit'),basis:val(f,'basis'),source:val(f,'source'),date:val(f,'date'),bcsn:val(f,'bcsn'),specification:val(f,'specification'),group:val(f,'group'),minSf:number(f,'minSf'),maxSf:number(f,'maxSf'),codeVersion:val(f,'codeVersion'),mc:val(f,'mc'),tml:val(f,'tml'),hazardClass:val(f,'hazardClass'),un:val(f,'un'),plannedQuantity:number(f,'plannedQuantity'),minQuantity:number(f,'minQuantity'),maxQuantity:number(f,'maxQuantity'),splitAllowed:val(f,'splitAllowed')==='yes',quantitySource:val(f,'quantitySource')});});
 }
 // Where the vessel's particulars came from. A nominated vessel has to name its IMO, its
 // source and the date of it; a reference type is allowed to stay a reference type.
 function vesselBasis(){
  const s=state();P.ensure(s);
  const b=s.planning.vesselBasis||{},g=P.grain(s);
  const capacity=`<p>Vessel basis: ${esc(P.vesselBasisStatus(s))}</p>`+
   `<p>Hold total ${fmt(g.total)} m³ · declared grain ${fmt(g.declared)} m³ · difference ${fmt(g.difference)} m³</p>`;
  const form=grid(
   select('kind','Vessel basis',b.kind||'reference',[['reference','Reference type'],['nominated','Nominated vessel']])+
   field('imo','IMO',b.imo)+
   field('source','Particulars source',b.source||M.vesselOf(s)?.source)+
   field('date','Source date',b.date,'date')+
   field('dwtBasis','DWT / load-line basis',b.dwtBasis)+
   field('density','Reference water density, t/m³',b.density,'number')+
   field('lightship','Lightship, t',b.lightship,'number')+
   field('tpcRangeCm','TPC valid deviation from reference draft, cm',b.tpcRangeCm,'number')+
   field('tpcSource','TPC range / hydrostatic source',b.tpcSource));
  modal('Vessel source and capacity',capacity+form,f=>{
   const kind=val(f,'kind'),imo=val(f,'imo');
   if(kind==='nominated'&&(!/^\d{7}$/.test(imo)||!val(f,'source')||!val(f,'date')))
    throw Error('A nominated vessel needs IMO, particulars source and date');
   s.planning.vesselBasis={vesselKey:JSON.stringify(M.vesselOf(s)),kind,imo,source:val(f,'source'),date:val(f,'date'),
    dwtBasis:val(f,'dwtBasis'),density:number(f,'density'),lightship:number(f,'lightship'),
    tpcRangeCm:number(f,'tpcRangeCm'),tpcSource:val(f,'tpcSource')};
  });
 }
 function intakeBasis(){const s=state();P.ensure(s);const b=s.planning.intakeBasis;modal('Intake basis',grid(field('state','Deductions refer to',b.state)+field('source','Deductions source',b.source)+field('date','Source date',b.date,'date')+field('constantIncludes','Constant includes',b.constantIncludes)+field('draftLossSource','Draft loss calculation / source',b.draftLossSource)+field('draftLossCall','Limiting call / state',b.draftLossCall))+(b.legacyDraftLoss?'<p class="muted">Draft loss 0 was inherited from the previous calculation; its source is not confirmed.</p>':''),f=>{s.planning.intakeBasis=Object.fromEntries(['state','source','date','constantIncludes','draftLossSource','draftLossCall'].map(k=>[k,val(f,k)]));});}
 // The solved plan applies straight away; Undo restores the allocation it replaced.
 function allocate(){const s=state(),r=P.solve(s);if(r.status!=='feasible'){modal('Automatic plan',`<p>${r.status==='search-limit'?'Search limit reached. No complete plan found yet.':'No complete plan found under the separate-hold search model.'}</p><p class="muted">${esc(r.scope||'Complete cargo SF, quantities and hold volumes.')} Existing allocations are unchanged.</p>`);return;}
 P.applyPlan(s,r);}
 function compatibility(){const s=state(),lots=s.lots.filter(l=>l.selected);let pairs=[];for(let i=0;i<lots.length;i++)for(let j=i+1;j<lots.length;j++)pairs.push([lots[i],lots[j]]);modal('Cargo compatibility',pairs.map(([a,b],i)=>{const r=s.planning.compatibility.find(r=>[r.a,r.b].includes(a.id)&&[r.a,r.b].includes(b.id))||{};return `<fieldset><legend>${esc(a.name)} / ${esc(b.name)}</legend>`+grid(select('rule'+i,'Relationship',r.rule||'unknown',[['unknown','Not established'],['same-hold','Same hold permitted'],['separate-holds','Separate holds required'],['non-adjacent','Non-adjacent holds required']])+field('source'+i,'Source / conditions',r.source))+'</fieldset>';}).join('')||'<p>Add two selected parcels to define a relationship.</p>',f=>{s.planning.compatibility=pairs.map(([a,b],i)=>{const rule=val(f,'rule'+i),source=val(f,'source'+i);if(rule!=='unknown'&&!source)throw Error('Every established relationship needs a source');return {a:a.id,b:b.id,rule,source};});});}
 function technicalReport(){const s=state();modal('Record external technical review',grid(field('reference','Report document / reference','','text',true)+field('reviewer','Reviewer','','text',true)+field('date','Review date','','date',true)+select('result','Result','conditional',[['conditional','Conditional'],['accepted','Accepted'],['rejected','Rejected']])+field('conditions','Conditions'))+`<fieldset><legend>States covered by this report</legend>${P.events(s).map(e=>`<label class="check-line"><input type="checkbox" name="covered" value="${esc(e.key)}"> ${esc(e.label)}</label>`).join('')}</fieldset>`,f=>P.addReport(s,{reference:val(f,'reference'),reviewer:val(f,'reviewer'),date:val(f,'date'),result:val(f,'result'),conditions:val(f,'conditions'),covered:f.getAll('covered')}),'Record review');}
 // The checks panel: the plan's status, what is wrong with it, each state against its limit,
 // and the actions that resolve them. Saved plan versions are listed last.
 function checks(){
  const s=state(),r=P.check(s);
  const problems=r.errors.map(x=>`<p class="error">${esc(x)}</p>`).join('')+
   r.warnings.map(x=>`<p class="muted">${esc(x)}</p>`).join('');
  const stateRow=st=>
   `<tr><td>${esc(st.label)}</td><td>${fmt(st.quantity,1)}</td><td>${fmt(st.limit,1)}</td>`+
   `<td>${fmt(st.margin,1)}</td>`+
   `<td class="state-check-text">${esc([...st.issues,...st.missing].join('; ')||st.status)}</td></tr>`;
  const actions=`<div class="button-row">`+
   btn('vessel-basis','Vessel source')+btn('intake-basis','Intake basis')+
   btn('compatibility','Cargo compatibility')+btn('technical-report','Record technical review')+
   btn('freeze-plan','Save plan version')+`</div>`;
  const snapshots=(s.planning.snapshots||[])
   .map((x,i)=>btn('view-snapshot',esc(x.createdAt),`data-index="${i}"`)).join('')
   ||'<p class="muted">None saved yet.</p>';
  const d=modal('Planner checks',
   `<p>Loading plan: ${esc(r.status)} · technical review: ${esc(r.technical)}</p>`+problems+
   table(['State','On board, t','Cargo limit, t','Margin, t','Check'],r.states.map(stateRow))+
   actions+`<h3>Saved plan versions</h3>`+snapshots);
 d.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;d.close();d.remove();action(b.dataset.action,b);});}
 // Printed evidence: what the plan was calculated from, beside what it concluded. A printed
 // package that states only its result cannot be checked by the person approving it.
 const evidenceParcel=l=>
  `<tr><td>${esc(l.saleId)} · ${esc(l.name)}</td><td>${esc(l.passport?.basis)}</td>`+
  `<td>${n(l.sf)}</td>`+
  `<td>${esc(l.passport?.source||'Not entered')} · ${esc(l.passport?.date||'No date')}</td></tr>`;

 const evidenceState=(st,r)=>
  `<tr><td>${esc(st.label)}</td><td>${fmt(st.quantity,1)}</td><td>${fmt(st.limit,1)}</td>`+
  `<td>${fmt(st.draft?.deadweight,1)}</td><td>${fmt(st.draft?.deepest,2)}</td>`+
  `<td>${esc(st.draft?.basis||'unavailable')}</td>`+
  `<td>${esc([...st.issues,...st.missing].join('; ')||st.status)}</td>`+
  `<td>${esc(patternText(r.loadingPatterns.states.find(x=>x.key===st.key)||r.loadingPatterns.plan))}</td></tr>`;

 // Said on the page itself, not only in the documentation: hold masses are a screening signal.
 const SCREENING_LIMITS=' · preliminary signals from hold masses only. It is not a stability, trim or strength calculation, and it does not replace the approved loading conditions of the nominated vessel.';

 function printEvidence(s,budget,report){
  const r=report||P.check(s,budget);
  const vesselSource=s.planning?.vesselBasis?.source||M.vesselOf(s)?.source||'No source';
  return `<div class="print-evidence"><h3>Planner evidence</h3>`+
   `<p>Vessel basis: ${esc(P.vesselBasisStatus(s))} · ${esc(vesselSource)} · ${esc(s.planning?.vesselBasis?.date||'No date')}</p>`+
   `<p>Intake state: ${esc(s.planning?.intakeBasis?.state)} · source ${esc(s.planning?.intakeBasis?.source||'Not entered')}`+
   ` · draft loss ${esc(s.planning?.intakeBasis?.draftLossSource||'Not sourced')}</p>`+
   table(['Sale','Shipment basis','SF, m³/t','Source / date'],s.lots.filter(l=>l.selected).map(evidenceParcel))+
   table(['State','Cargo, t','Limit, t','Deadweight, t','Draft, m','Draft basis','Check','Cargo distribution'],
    r.states.map(st=>evidenceState(st,r)))+
   `<p>Cargo distribution screening: ${esc(r.loadingPatterns.method)}${SCREENING_LIMITS}</p>`+
   `<p>Technical review: ${esc(r.technical)}. Volume allocation is not a stability or strength calculation.</p>`+
   `</div>`;
 }
 function action(name,el){P.ensure(state());switch(name){
  case'loading-state':{const key=el.dataset.id;if(key==='load'||P.events(state()).some(e=>e.key===key)){state().stage=key;changed();document.querySelector('[data-path="stage"]')?.focus();}return true;}
  case'allocate':allocate();changed();return true;
  case'undo-plan':try{P.undo(state());changed();}catch(e){modal('Previous plan',`<p>${esc(e.message)}</p>`);}return true;
  case'edit-plan':state().stage='load';changed();return true;
  case'parcel-passport':passport(el.dataset.id);return true;
  case'edit-passport':passport(el.dataset.id,true);return true;
  case'vessel-basis':vesselBasis();return true;
  case'intake-basis':intakeBasis();return true;
  case'planning-checks':checks();return true;
  case'compatibility':compatibility();return true;
  case'technical-report':technicalReport();return true;
  case'freeze-plan':P.freeze(state());changed();checks();return true;
  case'view-snapshot':{const x=state().planning.snapshots[Number(el.dataset.index)];modal('Saved plan · '+x.createdAt,`<p>Read-only snapshot · ${esc(x.check.status)}</p>${table(['Sale','Cargo','Quantity, t','SF, m³/t','Source'],x.input.lots.map(l=>`<tr><td>${esc(l.saleId)}</td><td>${esc(l.name)}</td><td>${fmt(l.quantity,1)}</td><td>${n(l.sf)}</td><td>${esc(l.passport?.source||'Not entered')}</td></tr>`))}${table(['Hold','Cargo','Allocated, t'],x.input.allocations.map(a=>`<tr><td>№${a.hold}</td><td>${esc(x.input.lots.find(l=>l.id===a.lot)?.name)}</td><td>${fmt(a.quantity,1)}</td></tr>`))}`);return true;}
  default:return false;}}
 return {draw,section3,printEvidence,motionSnapshot,animate,refresh,action};
}
const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXPlannerUI=api;
})(globalThis);
