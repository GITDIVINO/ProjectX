(function(){
'use strict';
const M=window.ProjectXModel,$=id=>document.getElementById(id),key='projectx-current-v2',backupKey=key+'-backup',tabKey='projectx-current-tab',tabs=['planner','sale','cargo','ports','vessel','market','guide'];
let marketReport='',marketRegion='';
try{const view=JSON.parse(sessionStorage.getItem('projectx-market-view')||'null');if(view){marketReport=view.report;marketRegion=view.region;}}catch{}
function renderMarket(){
 $('app').innerHTML=window.ProjectXMarket.render(marketReport,marketRegion);
}
$('app').addEventListener('change',e=>{
 if(e.target.id!=='market-report'&&e.target.id!=='market-region')return;
 const focus=e.target.id;
 if(focus==='market-report'){marketReport=e.target.value;marketRegion='';}else marketRegion=e.target.value;
 try{sessionStorage.setItem('projectx-market-view',JSON.stringify({report:marketReport,region:marketRegion}));}catch{}
 renderMarket();$(focus)?.focus();
});
let currentTab='planner',startupMessage='';
const P=window.ProjectXPlanning;
const plannerUI=window.ProjectXPlannerUI.create({M,P,getState:()=>state,changed,openTab:tab=>{currentTab=tab;syncWorkspace();render();}});
try{const savedTab=sessionStorage.getItem(tabKey);if(tabs.includes(savedTab))currentTab=savedTab;}catch{}
function readSave(text){
 const saved=JSON.parse(text);
 if(!saved||saved.version!==2||!['lots','ports','holds','legs','allocations','costs'].every(k=>Array.isArray(saved[k]))||!['deductions','prices','ballast'].every(k=>saved[k]&&typeof saved[k]==='object'))throw Error('Invalid saved calculation');
 M.ensureCatalogs(saved);M.syncRoute(saved);M.compute(saved);
 return saved;
}
let state=M.initial();
try{
 const saved=localStorage.getItem(key);
 if(saved)try{state=readSave(saved);}catch{
  startupMessage='The saved calculation could not be opened. The original save has been preserved.';
  try{const backup=localStorage.getItem(backupKey);if(backup){state=readSave(backup);startupMessage='The last valid backup was restored. The unreadable save has been preserved.';}}catch{}
 }
}catch{startupMessage='Browser storage is unavailable. Changes cannot be saved in this browser.';}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));// toLocaleString builds a fresh Intl.NumberFormat on every call; one per option pair is the same output.
const numberFormats=new Map();
const numberFormat=(min,max)=>{const key=min+':'+max;let f=numberFormats.get(key);if(!f){f=new Intl.NumberFormat('en-GB',{minimumFractionDigits:min,maximumFractionDigits:max});numberFormats.set(key,f);}return f;};
const fmt=(x,d=1)=>x===null||x===undefined||!Number.isFinite(x)?'—':numberFormat(d,d).format(x);
function get(path){return path.split('.').reduce((a,k)=>a[k],state);}function set(path,value){const bits=path.split('.'),last=bits.pop();bits.reduce((a,k)=>a[k],state)[last]=value;}
function input(path,label,options={}){
 if(options.tonnage)return `<input aria-label="${esc(label)}" data-path="${path}" type="text" inputmode="decimal" data-format="tonnage" value="${esc(fmt(get(path),1))}" placeholder="—" ${options.disabled?'disabled':''}>`;
 return `<input aria-label="${esc(label)}" data-path="${path}" type="${options.type||'number'}" ${options.type?'':'min="0" step="any"'} value="${esc(get(path))}" placeholder="—" ${options.disabled?'disabled':''}>`;}
function select(path,label,values){return `<select aria-label="${esc(label)}" data-path="${path}">${values.map(v=>{const [id,name]=Array.isArray(v)?v:[v,v];return `<option value="${esc(id)}" ${String(get(path)??'')===String(id)?'selected':''}>${esc(name)}</option>`;}).join('')}</select>`;}
function field(path,label,options){return `<label class="field">${label}${input(path,label,options)}</label>`;}
const chosen=()=>state.lots.filter(l=>l.selected);
function grainCapacityLine(){
 const total=M.cargoVolume(state).holdTotal;
 if(total===null)return '<small class="grain-capacity muted">Grain capacity: — · enter every hold volume.</small>';
 return `<small class="grain-capacity">Grain capacity: ${state.holds.map(h=>num(h.volume)).join(' + ')} = ${fmt(total,2)} m³</small>`;
}
function draftLossLine(){
 const r=state.planning?.autoDraftLoss;
 if(!r||r.loss===null)return `<small class="draft-formula muted">Draft loss: — · ${esc(r?.reason||'Automatic TPC estimate')}</small>`;
 const b=r.limiting,head=`${esc(b.call)} ${num(b.maxDraft)} m`;
 const body=`draft ${num(b.draft)} × 1.025 ÷ ρ ${num(b.density)} = ${num(round(b.permissible,3))} m · max(0, ${num(round(b.permissible,3))} − ${num(b.maxDraft)}) × 100 × TPC ${num(b.tpc)} × ${num(b.density)} ÷ 1.025 = ${fmt(b.portLoss,1)} t`;
 const share=b.fraction===1?'':` · cargo on board ${fmt(b.fraction*100,2)}% · voyage loss max(0, ${fmt(r.baseIntake,1)} − (${fmt(r.baseIntake,1)} − ${fmt(b.portLoss,1)}) ÷ ${num(round(b.fraction,6))}) = ${fmt(r.loss,1)} t`;
 return `<small class="draft-formula">Draft loss: ${head} · ${body}${share}</small>`+(r.warnings.length?`<small class="muted">${esc(r.warnings.join('; '))}</small>`:'');
}
function cargoVolumeLine(){
 const v=M.cargoVolume(state);
 if(v.volume===null)return '<small class="cargo-volume muted">Cargo volume: — · needs a selected sale with a quantity and an SF.</small>';
 const terms=v.terms.map(t=>`${num(t.quantity)} × ${num(t.sf)}`).join(' + ');
 return `<small class="cargo-volume">Cargo volume: ${terms} = ${fmt(v.volume,2)} m³</small>`;
}
// Deductions and holds fold away once the intake is settled; the summary keeps the result in view.
function intakeCalculator(ship){
 const labels={fuel:'Fuel, t',water:'Fresh water, t',ballast:'Ballast, t',constant:'Constant, t',draftLoss:'Loss due to draft, t'};
 const limits=M.intakeLimits(state);
 const deductions=Object.entries(labels).map(([k,l])=>k==='draftLoss'
  ?`<label class="field">${l}<input aria-label="${l}" readonly value="${fmt(state.deductions.draftLoss,1)}"></label>`
  :field('deductions.'+k,l)).join('');
 const body=`<div class="heading compact-heading"><h3>Deductions</h3></div><div class="grid">${deductions}</div>${draftLossLine()}`
  +`<p class="intake-line">Restricted intake DWT: ${intakeShown()?`DWT ${num(M.vesselOf(state)?.dwt)} − fuel ${num(state.deductions.fuel)} − fresh water ${num(state.deductions.water)} − ballast ${num(state.deductions.ballast)} − constant ${num(state.deductions.constant)} − draft loss ${num(state.deductions.draftLoss)} = <strong>${fmt(ship.intake,2)} t</strong>`:`<strong>—</strong><button data-action="calc-intake" ${ship.intake===null||ship.intake<0?'disabled':''}>Calculate intake</button>`}</p>`
  +`<h3>Holds</h3><div class="grid holds-grid">${state.holds.map((h,i)=>field('holds.'+i+'.volume','Hold №'+h.id+', m³')).join('')}</div>`
  +grainCapacityLine()
  +(intakeShown()&&limits.cubic!==null?`<p class="cubic-intake">Cubics limit: ${fmt(limits.holdTotal,2)} m³ ÷ mix SF ${fmt(limits.weightedSf,5)} m³/t = <strong>${fmt(limits.cubic,2)} t</strong></p><p class="restricted-intake">Restricted intake DWT/cubics: min(${fmt(limits.dwt,2)} t, ${fmt(limits.cubic,2)} t) = <strong>${fmt(limits.restricted,2)} t</strong></p>`:intakeShown()?'<p class="restricted-intake muted">Cubics not checked · complete every hold volume and selected shipment SF.</p>':'')
  +cargoVolumeLine()+'<p class="form-note">Average-vessel estimate · SW reference 1.025 t/m³ · all cargo calls, constant stores and proportional cargo mix. Hold allocation and nominated-vessel checks remain separate.</p>';
 const intake=intakeShown()?(limits.restricted!==null?`${fmt(limits.restricted,2)} t estimated restricted intake`:`${fmt(limits.dwt,2)} t DWT only · cubics not checked`):ship.intake!==null&&ship.intake<0?'No feasible intake · deductions exceed DWT':'Intake not calculated';
 return `<details id="intake-calculator" class="fold"><summary><strong>Intake Calculator</strong><span>${intake}</span></summary><div class="fold-body">${body}</div></details>`;
}

// The voyage on an equirectangular world. The drawn track is the check on the distance beside it:
// a leg that loops out to sea and back is visible long before the number looks wrong.
const Sea=typeof window!=='undefined'?window.ProjectXSeaRoute:null;
const portAnchor=name=>{const p=state.portRecords.find(p=>p.name===name&&Number.isFinite(p.lat)&&Number.isFinite(p.lon));return p?[p.lon,p.lat]:null;};
function voyageLegs(){
 const calls=M.callsOf(state),out=[];
 for(let i=0;i<calls.length-1;i++){
  const from=portAnchor(calls[i].name),to=portAnchor(calls[i+1].name);
  const leg=state.legs.find(l=>l.from===calls[i].name&&l.to===calls[i+1].name)||null;
  out.push({from:calls[i].name,to:calls[i+1].name,a:from,b:to,leg,
   route:Sea&&from&&to?Sea.route(from,to):null});
 }
 return out;
}
function syncRouteDistances(){
 if(!Sea)return;
 for(const l of voyageLegs()){
  const leg=l.leg;if(!leg||leg.distanceSource==='entered')continue;
  if(l.route?.reliable&&Number.isFinite(l.route.distance)){leg.distance=round(l.route.distance,0);leg.distanceSource='estimated';}
  else if(leg.distanceSource==='estimated'){leg.distance=null;leg.distanceSource=null;}
 }
}
// Typing into a leg distance makes it the user's figure; clearing it hands the leg back to the estimate.
function noteManualEntry(path,value){
 const m=/^legs\.(\d+)\.distance$/.exec(path||'');
 if(m&&state.legs[m[1]])state.legs[m[1]].distanceSource=value===null?null:'entered';
}
let coastCache=null;
const coastMarkup=()=>coastCache??=Sea.coastline().map(ring=>`<path d="M${ring.map(p=>p[0].toFixed(2)+' '+(-p[1]).toFixed(2)).join('L')}Z"/>`).join('');
// Pan and zoom live outside the voyage: they belong to this browsing session, not to the saved calculation.
let mapZoom=null;
const mapKey=box=>box.map(n=>n.toFixed(1)).join(' ');
function mapView(fitted){
 if(!mapZoom||mapZoom.key!==mapKey(fitted))mapZoom={key:mapKey(fitted),fitted:fitted.slice(),box:fitted.slice()};
 return mapZoom.box;
}
// The view may travel one full frame beyond the voyage in each direction and no further.
function clampView(fitted,box){
 const min=Math.min(fitted[2],fitted[3])/60,max=Math.max(fitted[2]*3,fitted[3]*3);
 const ratio=fitted[2]/fitted[3];
 let [x,y,w,h]=box;
 w=Math.min(Math.max(w,min*ratio),Math.min(max*ratio,360));
 h=w/ratio;
 x=Math.min(Math.max(x,fitted[0]-fitted[2]),fitted[0]+2*fitted[2]-w);
 y=Math.min(Math.max(y,fitted[1]-fitted[3]),fitted[1]+2*fitted[3]-h);
 return [x,y,w,h];
}
function zoomMap(factor,at){
 if(!mapZoom)return;
 const [x,y,w,h]=mapZoom.box;
 const cx=at?at.x:x+w/2,cy=at?at.y:y+h/2;
 mapZoom.box=clampView(mapZoom.fitted,[cx-(cx-x)*factor,cy-(cy-y)*factor,w*factor,h*factor]);
 paintMapView();
}
function panMap(dx,dy){
 if(!mapZoom)return;
 const [x,y,w,h]=mapZoom.box;
 mapZoom.box=clampView(mapZoom.fitted,[x-dx,y-dy,w,h]);
 paintMapView();
}
function resetMap(){if(mapZoom){mapZoom.box=mapZoom.fitted.slice();paintMapView();}}
// Screen pixels mean nothing to a viewBox in degrees; the element's own matrix does the conversion.
function mapPoint(svg,event){
 const ctm=svg.getScreenCTM();
 if(!ctm)return null;
 const p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;
 return p.matrixTransform(ctm.inverse());
}
function paintMapView(){
 const svg=document.querySelector('.voyage-map svg');
 if(svg&&mapZoom)svg.setAttribute('viewBox',mapZoom.box.map(n=>n.toFixed(3)).join(' '));
}
function voyageMap(){
 if(!Sea)return '';
 const legs=voyageLegs(),drawn=legs.filter(l=>l.route?.path);
 const anchors=[...new Set(M.callsOf(state).map(c=>c.name))].map(name=>[name,portAnchor(name)]).filter(([,p])=>p);
 if(!anchors.length)return '<div class="voyage-map-empty"><p class="muted">The route is drawn once the voyage calls have coordinates. Enter them in PORT.</p></div>';
 const all=[...anchors.map(([,p])=>p),...drawn.flatMap(l=>l.route.path)];
 let minLon=Math.min(...all.map(p=>p[0])),maxLon=Math.max(...all.map(p=>p[0]));
 let minLat=Math.min(...all.map(p=>p[1])),maxLat=Math.max(...all.map(p=>p[1]));
 const padLon=Math.max((maxLon-minLon)*.12,4),padLat=Math.max((maxLat-minLat)*.12,4);
 minLon-=padLon;maxLon+=padLon;minLat-=padLat;maxLat+=padLat;
 const width=maxLon-minLon,height=maxLat-minLat;
 // y grows south, so latitude is negated; nothing else about the projection is needed at this scale.
 const fitted=[minLon,-maxLat,width,height];
 const box=mapView(fitted);
 const unit=Math.max(box[2],box[3])/100;
 const coast=coastMarkup();
 const tracks=drawn.map(l=>`<polyline class="${l.route.reliable?'sea-track':'sea-track sea-track-doubtful'}" points="${l.route.path.map(p=>p[0].toFixed(2)+','+(-p[1]).toFixed(2)).join(' ')}"/>`).join('');
 // A label on the eastern half is written back towards the middle, so it cannot run off the edge.
 const middle=minLon+width/2;
 const placed=[];
 const marks=anchors.map(([name,p])=>{
  const east=p[0]>middle,gap=unit*(east?-2:2);
  let y=-p[1]+unit*.8;
  while(placed.some(q=>Math.abs(q[1]-y)<unit*2.6&&Math.abs(q[0]-p[0])<unit*26))y+=unit*2.8;
  placed.push([p[0],y]);
  return `<g class="sea-port"><circle cx="${p[0].toFixed(2)}" cy="${(-p[1]).toFixed(2)}" r="${(unit*.9).toFixed(2)}"/><text x="${(p[0]+gap).toFixed(2)}" y="${y.toFixed(2)}" text-anchor="${east?'end':'start'}" font-size="${(unit*2.4).toFixed(2)}">${esc(name)}</text></g>`;}).join('');
 return `<div class="voyage-map"><div class="map-controls"><button data-action="map-zoom" data-factor="0.7" aria-label="Zoom in">+</button><button data-action="map-zoom" data-factor="1.45" aria-label="Zoom out">−</button><button data-action="map-reset" aria-label="Fit the voyage">Fit</button></div><svg viewBox="${box.map(n=>n.toFixed(3)).join(' ')}" role="img" aria-label="Voyage route map" preserveAspectRatio="xMidYMid meet"><g class="sea-land">${coast}</g>${tracks}${marks}</svg></div>`;
}
function voyageDistanceLine(){
 if(!Sea)return '';
 const legs=voyageLegs().filter(l=>l.leg);
 if(!legs.length)return '';
 const rows=legs.map(l=>{
  const source=l.leg.distanceSource==='entered'?'Entered'
   :l.leg.distanceSource==='estimated'?'Estimated over the lane network'
   :l.route&&!l.route.reliable?'Coastal leg · no lane near these ports; enter it from a distance table'
   :'No route · check the port positions in PORT';
  return `<tr><td class="name">${esc(l.from)} → ${esc(l.to)}</td><td>${M.ok(l.leg.distance,true)?fmt(l.leg.distance,0):'—'}</td><td>${l.route?.distance?fmt(l.route.distance,0):'—'}</td><td>${esc(source)}</td></tr>`;});
 return table(['Leg','In the calculation, nm','Estimate, nm','Source'],rows,'sea-distances')
  +'<p class="form-note">A leg with no entered distance takes the estimate: great-circle legs over the ORNL / Eurostat shipping-lane network, from the port positions in PORT. Type a distance and it governs; clear it and the estimate returns. A proposal, not a passage plan — it holds no draft, weather, traffic separation or canal transit.</p>';
}
const round=(x,d)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:x;
// Allocation cells are printed in the table's own format, so the grouping goes back out before the number is read.
const tonnage=text=>{const clean=String(text).replace(/[\s,\u00a0\u202f]/g,'');return clean===''?0:Number(clean);};
const num=x=>Number.isFinite(x)?numberFormat(0,20).format(x):'—';
const intakeKey=()=>JSON.stringify([P.INTAKE_METHOD,M.vesselOf(state)?.dwt,...M.DEDUCTIONS.map(k=>state.deductions[k])]);
const intakeShown=()=>{if(state.intakeShownFor!==intakeKey())return false;const {dwt}=M.intakeLimits(state);return dwt!==null&&dwt>=0;};
const table=(heads,rows,cls='')=>`<div class="table-wrap"><table class="${cls}"><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
function calculationDetails(id,entries,fallback='Complete the voyage inputs to see substituted values.'){
 return `<details id="calc-${id}" class="calculation-details"><summary>How calculated</summary>${entries?.length?table(['Calculation','Formula and values','Result'],entries.map(e=>`<tr><td>${esc(e.label)}</td><td class="calculation-expression"><span>${esc(e.formula)}</span><code>${esc(e.substitution)}</code></td><td class="calculation-result" ${e.exact?`title="Exact result: ${esc(e.exact)}"`:''}>${esc(Number.isFinite(e.result)?String(e.result):'Unknown')} ${esc(e.unit)}</td></tr>`)):`<p class="muted">${esc(fallback)}</p>`}<p class="form-note">Values come from the current calculation. Displayed decimals may be shortened; time and fuel are not rounded between steps. Each cost line is rounded to USD cents before totals and allocation. Unknown is not zero.</p></details>`;
}
const operand=x=>Number.isFinite(x)?String(x):'unknown';
function allocationCalculation(b){
 if(!b)return calculationDetails('allocation',null,'Cost share = rounded line cost × eligible sale tonnage / total eligible tonnage. Complete voyage inputs to see each share.');
 const lots=chosen();return `<details id="calc-allocation" class="calculation-details"><summary>How calculated</summary><p class="form-note">${state.allocation==='tonnage'?'Every line is shared by all selected sales in proportion to tonnage.':'Leg lines are shared by sales on board; port lines by sales handled at that call; ballast and additional items by all selected sales.'} Exact share in cents = line cents × sale tonnes / eligible tonnes. First take whole cents downward; distribute remaining cents to the largest fractional remainders. Ties follow the displayed sale order. The correction below is added to the downward-rounded share.</p>${table(['Line','Sale','Calculation, cents','Remainder correction','Allocated, USD'],b.rows.flatMap(row=>lots.map(l=>`<tr><td>${esc(row.name)}</td><td>${esc(l.saleId||l.id)} · ${esc(l.id)}</td><td class="calculation-expression"><code>${row.cents} × ${operand(row.weights[l.id])} t / ${operand(row.basis)} t</code>${row.weights[l.id]===0?'<small>Not eligible for this line</small>':''}</td><td>+${row.rounding[l.id]} cent</td><td>${fmt(row.shares[l.id]/100,2)}</td></tr>`)))}${table(['Sale','Total calculation, USD','USD/t calculation'],b.allocation.map(a=>`<tr><td>${esc(a.id)}</td><td class="calculation-expression"><code>${b.rows.map(row=>fmt(row.shares[a.id]/100,2)).join(' + ')} = ${fmt(a.cents/100,2)}</code></td><td>${fmt(a.cents/100,2)} / ${operand(a.quantity)} = ${operand(a.cents/100/a.quantity)}</td></tr>`))}<p>Reconciliation: ${b.allocation.map(a=>fmt(a.cents/100,2)).join(' + ')} = ${fmt(b.total,2)} USD. Difference: ${fmt((b.totalCents-b.allocation.reduce((n,a)=>n+a.cents,0))/100,2)} USD.</p></details>`;
}
function rotationList(title,isLoad){const loadNames=new Set(chosen().map(l=>l.loadPort)),group=M.callsOf(state).filter(p=>loadNames.has(p.name)===isLoad);return `<div><h3>${title}</h3><ol class="port-order">${group.map((p,i)=>{const parcels=chosen().filter(l=>(isLoad?l.loadPort:l.port)===p.name),q=parcels.every(l=>M.ok(l.quantity,true))?parcels.reduce((n,l)=>n+l.quantity,0):null;return `<li><span class="port-number">${i+1}</span><div class="port-caption"><strong>${esc(p.name)}</strong><small>${fmt(q,0)} t ${parcels.map(l=>`<span class="tag" style="background:${l.color}" title="${esc(l.name)}"></span>`).join('')}</small></div><div class="port-actions"><button data-action="move-port" data-port="${esc(p.name)}" data-direction="-1" aria-label="${esc(p.name)} earlier" ${i===0?'disabled':''}>↑</button><button data-action="move-port" data-port="${esc(p.name)}" data-direction="1" aria-label="${esc(p.name)} later" ${i===group.length-1?'disabled':''}>↓</button></div></li>`;}).join('')}</ol>${group.length?'':'<p class="muted">Add sales from SALE to the planner</p>'}</div>`;}
function render(){if(currentTab==='market'){renderMarket();return;}if(currentTab==='guide'){$('app').innerHTML=window.ProjectXGuide.render();return;}if(currentTab!=='planner'){renderCatalog();return;}P.syncAutoDraftLoss(state);syncRouteDistances();const motion=plannerUI.motionSnapshot();const open=[...document.querySelectorAll('details[open]')].map(d=>d.id);const r=M.compute(state),b=r.budget,ship=r.ship;const lots=chosen();let html=`${state.demo?'<p class="notice">Demo example. Tonnage, SF, distances and prices are illustrative; replace the inputs before using the calculation.</p>':''}<section><div class="heading"><h2>1. Sales in voyage</h2><button data-action="add-lot">+ Add sale</button></div>`;
html+=state.lots.length?table(['In voyage','Sale / cargo','Quantity <small>MT</small>','SF <small>m³/t</small>','Loading','Discharge',''],state.lots.map((l,i)=>`<tr><td><input type="checkbox" data-path="lots.${i}.selected" aria-label="Include ${esc(l.name)}" ${l.selected?'checked':''}></td><td class="name"><span class="tag" style="background:${l.color}"></span><small>${esc(l.saleId||'Legacy')}</small><br><button class="text-action" data-action="parcel-passport" data-id="${esc(l.id)}">${esc(l.name)}</button></td><td>${fmt(l.quantity,1)}</td><td>${fmt(l.sf,2)}</td><td>${esc(l.loadPort)}</td><td>${esc(l.port)}</td><td><button data-action="remove-lot" data-index="${i}" aria-label="Remove sale ${l.saleId||l.id} from voyage">×</button></td></tr>`)): '<div class="empty-state planner-empty"><strong>No sales in voyage yet</strong><span>Add a sale from SALE to start planning this voyage.</span></div>';html+='<p class="form-note">Only sales from SALE can be added to PLANNER. Edit commercial fields and shipment properties in SALE; reference properties in CARGO. Shipment properties are read-only in PLANNER.</p></section>';
html+=`<section><div class="heading"><h2>2. Vessel and rotation</h2></div><div class="vessel-choice"><label class="field">Vessel${select('vesselId','Vessel',(state.vesselProfiles||M.VESSELS).map(v=>[v.id,v.name]))}</label><span class="muted">${fmt(M.vesselOf(state)?.dwt,0)} DWT · ${M.vesselOf(state)?.holds} holds · ${esc(M.vesselOf(state)?.model)} · LOA ${fmt(M.vesselOf(state)?.loa)} m · Beam ${fmt(M.vesselOf(state)?.beam)} m · Draft ${fmt(M.vesselOf(state)?.draft,2)} m · TPC ${fmt(M.vesselOf(state)?.tpc)} · Grain ${fmt(M.vesselOf(state)?.grain,0)} m³</span></div>${intakeCalculator(ship)}<div class="rotation-grid">${rotationList('Loading',true)}${rotationList('Discharge',false)}</div></section>`;
// One planner check per render; both the section and the print evidence read the same result.
const report=P.check(state,b);
html+=plannerUI.section3(state,b,report)+plannerUI.printEvidence(state,b,report);
html+=`<section><div class="heading"><h2>4. Voyage calculation</h2><small>Vessel cost model · recalculated when a field changes</small></div><div class="metrics">${[['Cargo, t',ship.quantity,0],['Voyage, days',b?.days,2],['Model cost, USD',b?.total,2],['Model cost, USD/t',b?.unit,2]].map(([t,v,d])=>`<div class="metric"><small>${t}</small><strong>${fmt(v,d)}</strong></div>`).join('')}</div>${r.errors.length?`<details id="missing" open><summary>Complete the following ${r.errors.length} fields / conditions</summary><ul class="errors">${r.errors.map(e=>`<li>${esc(e)}</li>`).join('')}</ul></details>`:''}`;
html+=voyageMap()+voyageDistanceLine();
html+=`<h3>Legs</h3><label class="muted"><input type="checkbox" data-path="ballastEnabled" ${state.ballastEnabled?'checked':''}> Include ballast approach to ${esc(M.callsOf(state)[0]?.name||'the first load port')}</label>`;
const activePorts=M.callsOf(state);const displayedLegs=[];if(state.ballastEnabled)displayedLegs.push({l:state.ballast,path:'ballast'});for(let i=1;i<activePorts.length;i++){const j=state.legs.findIndex(l=>l.from===activePorts[i-1].name&&l.to===activePorts[i].name);if(j>=0)displayedLegs.push({l:state.legs[j],path:'legs.'+j});}
html+=table(['Leg','Total <small>NM</small>','Of which ECA <small>NM</small>','Speed <small>kn</small>','Weather <small>% time</small>','Outside ECA <small>t/day</small>','In ECA <small>t/day</small>','Aux <small>t/day</small>','Days'],displayedLegs.map(({l,path})=>`<tr><td class="name">${esc(l.from)} → ${esc(l.to)}</td>${['distance','eca','speed','margin','burn','ecaBurn','aux'].map(k=>`<td>${input(path+'.'+k,l.from+' '+k)}</td>`).join('')}<td>${fmt(b?.legs.find(x=>x.from===l.from&&x.to===l.to)?.days,3)}</td></tr>`));html+=`<p class="form-note">Speeds and consumption come from the selected vessel type. Working values are in the legs table. Consumption under the fuel regime for ECA requires confirmation. The margin increases time and consumption; ECA is included in the total distance.</p>${calculationDetails('legs',b?.trace.legs,'Days = distance / (speed × 24) × (1 + weather / 100). ECA is part of total distance. Main mass = non-ECA days × burn; ECA mass = ECA days × burn; Aux mass = all sea days × additional burn. Fuel value = mass × price; hire = days × daily hire. Complete voyage inputs for values.')}`;
html+=`<h3>Ports</h3>`+table(['Port','Cargo <small>MT</small>','Handling rate <small>t/day</small>','Handling terms','Calendar <small>days</small>','Turn time <small>h</small>','Waiting <small>h</small>','DA <small>USD</small>','Days'],activePorts.map(p=>{const i=state.ports.indexOf(p),path='ports.'+i;return `<tr><td>${esc(p.name)}</td><td>${fmt(lots.filter(l=>l.loadPort===p.name||l.port===p.name).reduce((n,l)=>n+(l.quantity||0),0),0)}</td><td>${input(path+'.rate',p.name+' handling rate')}</td><td>${select(path+'.terms',p.name+' terms',[['SHINC','24/7 · SHINC'],['manual','Manual calendar']])}</td><td>${input(path+'.calendar',p.name+' calendar days',{disabled:p.terms==='SHINC'})}</td><td>${input(path+'.turn',p.name+' turn time')}</td><td>${input(path+'.extra',p.name+' waiting')}</td><td>${input(path+'.da',p.name+' DA')}</td><td>${fmt(b?.ports.find(x=>x.name===p.name)?.days,3)}</td></tr>`;}));
html+=`<p class="form-note">For SHEX/SSHEX enter the calendar handling period separately. It includes pauses during handling; turn time and waiting are counted outside that period only. This is a time budget, not a contractual calculation of laytime/demurrage.</p>${calculationDetails('ports',b?.trace.ports,'Work days = handled tonnes / handling rate. Idle days = (turn + waiting hours) / 24 + calendar days − work days. Total = work + idle. Main and Aux mass = work days × work burn + idle days × idle burn. Separate boiler = entered days × burn. Fuel values = masses × prices. DA is an entered call amount.')}<details id="portfuel"><summary>Port fuel consumption</summary>${table(['Port','Main fuel','Main work <small>t/day</small>','Main idle <small>t/day</small>','Aux work <small>t/day</small>','Aux idle <small>t/day</small>','Boiler <small>t/day</small>','Boiler operating time <small>days</small>','Boiler fuel'],activePorts.map(p=>{const path='ports.'+state.ports.indexOf(p);return `<tr><td>${esc(p.name)}</td><td>${select(path+'.fuel',p.name+' fuel',[['main','Outside ECA'],['eca','ECA']])}</td>${['working','idle','auxWorking','auxIdle','boiler','boilerDays'].map(k=>`<td>${input(path+'.'+k,p.name+' '+k)}</td>`).join('')}<td>${select(path+'.boilerFuel','Boiler fuel',[[null,'Select'],['main','Main outside ECA'],['eca','Main ECA'],['aux','Aux']])}</td></tr>`;}))}</details>`;
html+=`<h3>Hire, bunkers and freight</h3><div class="grid">${field('hire','Effective hire / target TCE, USD/day')}${field('prices.main','Main outside ECA, USD/t')}${field('prices.eca','Main ECA, USD/t')}${field('prices.aux','Additional Aux, USD/t')}${field('freight','Estimated gross freight, USD/t · optional')}${field('commission','Commission on gross freight, %')}${field('extraIncome','Other income net, USD')}</div><p class="form-note">Fuel grades and prices are set by voyage phase. Enter prices and consumption explicitly for each zone. Aux is added to main consumption; enter 0 only if it is already included or not used.</p><details id="costs"><summary>Additional costs and stops (${state.costs.length})</summary>${table(['Item','Amount <small>USD</small>','Additional time <small>days</small>','Consumption <small>t/day</small>','Fuel',''],state.costs.map((c,i)=>`<tr><td>${input('costs.'+i+'.name','Item name',{type:'text'})}</td><td>${input('costs.'+i+'.amount','Item amount')}</td><td>${input('costs.'+i+'.days','Additional time')}</td><td>${input('costs.'+i+'.burn','Stop consumption')}</td><td>${select('costs.'+i+'.fuel','Stop fuel',[['main','Outside ECA'],['eca','ECA']])}</td><td><button data-action="remove-cost" data-index="${i}" aria-label="Remove item ${i+1}">Remove</button></td></tr>`))}<button data-action="add-cost">Add item</button><p class="form-note">Canals, additional insurance, carbon payments and other costs — enter as separate amounts with sources in the notes. Additional time must not duplicate time counted in legs or ports. Automatic regulatory calculation for ETS/FuelEU is not available.</p>${calculationDetails('extras',b?.trace.extras,state.costs.length?'Additional total = entered amount + days × burn × fuel price + days × hire. Complete voyage inputs to see values.':'No additional items or stops entered.')}</details>`;
html+=calculationDetails('totals',b?.trace.totals,'Model cost = sum of rounded cost lines; unit cost = model cost / selected tonnes. Gross freight = tonnes × rate; commission = gross freight × commission %; net income = gross − commission + other net income. TCE = (net income − costs excluding hire) / voyage days; P&L = net income − total model cost. Covering freight adjusts for commission and other income. Complete voyage inputs for values.');
if(b){const amount=kind=>b.rows.filter(r=>r.kind===kind).reduce((n,r)=>n+r.cents,0)/100;html+=`<div class="split"><div><h3>Costs</h3><table class="totals"><tbody>${[['Hire',b.hire],['Bunkers',amount('fuel')],['Ports',amount('ports')],['Other',amount('other')],['Total',b.total]].map(([k,v])=>`<tr><td>${k}</td><td>${fmt(v,2)} USD</td></tr>`).join('')}</tbody></table></div><div><h3>Freight estimate</h3><table class="totals"><tbody>${[['Gross freight',b.gross],['Commission',b.commission],['Net income',b.net],['TCE before hire, USD/day',b.tce],['P&L after hire, USD',b.pnl],['Freight required to cover model cost, USD/t',b.requiredFreightQuote]].map(([k,v])=>`<tr><td>${k}</td><td>${fmt(v,2)}</td></tr>`).join('')}</tbody></table></div></div><details id="audit"><summary>Review calculation lines and fuel consumption</summary><p class="muted">At sea ${fmt(b.sea,3)} day · Working ${fmt(b.work,3)} day · Waiting / stops ${fmt(b.idle,3)} day</p><p class="muted">Fuel: outside ECA ${fmt(b.usage.main,3)} t · ECA ${fmt(b.usage.eca,3)} t · Aux ${fmt(b.usage.aux,3)} t</p>${table(['Item','USD',...lots.map(l=>l.id+' · USD')],b.rows.map(row=>`<tr><td>${esc(row.name)}</td><td>${fmt(row.cents/100,2)}</td>${lots.map(l=>`<td>${fmt(row.shares[l.id]/100,2)}</td>`).join('')}</tr>`))}</details>`;}
html+=`${ship.errors.length||ship.remaining.some(x=>x.quantity===null||Math.abs(x.quantity)>.01)?'<p class="notice">The cargo plan is incomplete or exceeds limits. The financial result does not confirm voyage feasibility.</p>':''}<p class="form-note">This is a vessel cost model. Under voyage chartering, the exporter budget consists of contractual freight and applicable surcharges: do not add hire and bunkers from this model again.</p></section><section><div class="heading"><h2>5. Cost by sale</h2>${select('allocation','Allocation method',[['route','By legs and ports'],['tonnage','Entire budget by tonnage']])}</div>${b?table(['Sale','Port','Tonnage','Allocated, USD','USD/t'],b.allocation.map(a=>{const l=state.lots.find(l=>l.id===a.id);return `<tr><td class="name"><span class="tag" style="background:${l.color}"></span>${esc(l.name)}</td><td>${esc(l.port)}</td><td>${fmt(a.quantity,1)}</td><td>${fmt(a.cents/100,2)}</td><td>${fmt(a.cents/100/a.quantity,2)}</td></tr>`;})):'<p class="empty">Allocation appears after the voyage calculation is complete.</p>'}<p class="form-note">Proposed method: leg costs — to cargo on board; port call costs — to handled sales; ballast and additional items — to all cargo. This is allocated cost, not the incremental cost of adding a sale.</p>${allocationCalculation(b)}<details id="notes"><summary>Calculation sources and notes</summary><textarea data-path="notes" aria-label="Calculation sources" placeholder="Enter sources and dates for distances, PDA, rates, SF and vessel data">${esc(state.notes)}</textarea></details></section>`;
$('app').innerHTML=html;plannerUI.animate(motion);open.forEach(id=>{if($(id))$(id).open=true;});}
function ensureLegs(){state.vesselId??='tbn-1';M.ensureCatalogs(state);M.anonymizeProfiles(state);M.migrateBaltic(state);M.syncRoute(state);P.ensure(state);P.syncAutoDraftLoss(state);}
function changed(){ensureLegs();$('status').textContent='';saveCalculation(false);render();}
function editableLotField(path){return !path?.startsWith('lots.')||/^lots\.\d+\.selected$/.test(path);}
$('app').addEventListener('change',e=>{const el=e.target;if(!editableLotField(el.dataset.path)){$('status').textContent='Cargo properties are read-only in PLANNER. Edit them in CARGO.';render();return;}if(el.dataset.path==='vesselId'){try{M.applyVessel(state,el.value);changed();}catch(error){$('status').textContent=error.message;render();}return;}if(el.dataset.path){let value=el.type==='checkbox'?el.checked:el.dataset.format==='tonnage'?(el.value.trim()===''?null:tonnage(el.value)):el.type==='number'?(el.value===''?null:Number(el.value)):el.value;noteManualEntry(el.dataset.path,value);if(el.dataset.path.startsWith('sales.')){
 const [,index,fieldName]=el.dataset.path.split('.');
 try{M.updateSale(state,state.sales[Number(index)].id,{[fieldName]:value});changed();}catch(error){render();$('status').textContent=error.message;}
 return;
}
if(el.dataset.path.startsWith('portRecords.')){
 const [,index,fieldName]=el.dataset.path.split('.');
 try{M.updatePortRecord(state,Number(index),fieldName,value);changed();}catch(error){render();$('status').textContent=error.message;}
 return;
}
if(el.dataset.path.startsWith('cargoTypes.')&&el.dataset.path.endsWith('.sf')&&!M.ok(value,true)){el.value=get(el.dataset.path);$('status').textContent='Enter a positive planning SF';return;}
if(/\.planning\.(arrival|departure)\.(aft|mid|fwd)$/.test(el.dataset.path)&&value!==null&&!M.ok(value,true)){el.value=get(el.dataset.path)??'';$('status').textContent='Enter a positive draft';return;}
if(/\.planning\.(arrival|departure)\.trim$/.test(el.dataset.path)&&value!==null&&(!Number.isFinite(value)||Math.abs(value)>10)){el.value=get(el.dataset.path)??'';$('status').textContent='Enter trim in metres, positive by the stern';return;}set(el.dataset.path,value);if(el.dataset.path.endsWith('.sf')){const prefix=el.dataset.path.slice(0,-3);set(prefix+'.sfBasis','user-entered');}if(el.dataset.path.endsWith('.selected'))state.allocations=state.allocations.filter(a=>chosen().some(l=>l.id===a.lot));if(el.dataset.path.startsWith('sales.'))M.syncSalesToLots(state);changed();}else if(el.dataset.lot){if(state.stage!=='load')return;const quantity=tonnage(el.value),lot=el.dataset.lot,hold=Number(el.dataset.hold);if(!M.ok(quantity)){el.value='';$('status').textContent='Enter non-negative tonnage';return;}state.allocations=state.allocations.filter(a=>!(a.lot===lot&&a.hold===hold));if(quantity>0)state.allocations.push({lot,hold,quantity});$('status').textContent='';saveCalculation(false);}});
$('app').addEventListener('wheel',e=>{
 const svg=e.target.closest?.('.voyage-map svg');if(!svg)return;
 e.preventDefault();zoomMap(e.deltaY<0?.85:1.18,mapPoint(svg,e));
},{passive:false});
$('app').addEventListener('pointerdown',e=>{
 const svg=e.target.closest?.('.voyage-map svg');if(!svg||e.button)return;
 let last=mapPoint(svg,e);if(!last)return;
 svg.setPointerCapture(e.pointerId);svg.classList.add('sea-dragging');
 const move=event=>{const now=mapPoint(svg,event);if(!now)return;panMap(now.x-last.x,now.y-last.y);last=mapPoint(svg,event);};
 const stop=()=>{svg.classList.remove('sea-dragging');svg.removeEventListener('pointermove',move);svg.removeEventListener('pointerup',stop);svg.removeEventListener('pointercancel',stop);};
 svg.addEventListener('pointermove',move);svg.addEventListener('pointerup',stop);svg.addEventListener('pointercancel',stop);
});
$('app').addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;if(plannerUI.action(el.dataset.action,el))return;switch(el.dataset.action){case'new-sale':showSaleDialog();return;
 case'map-zoom':zoomMap(Number(el.dataset.factor));return;
 case'map-reset':resetMap();return;case'new-port':state.portRecords.push({id:'P'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),name:'',country:'',terminal:'',berth:'Berth 1',notes:'',da:null,...Object.fromEntries(M.PORT_LIMIT_FIELDS.map(k=>[k,null]))});break;case'remove-sale':{const sale=state.sales[Number(el.dataset.index)];if(state.lots.some(l=>l.saleId===sale.id)){$('status').textContent='First remove the sale from PLANNER';return;}state.sales.splice(Number(el.dataset.index),1);break;}case'remove-port-record':try{M.removePortRecord(state,Number(el.dataset.index));}catch(error){$('status').textContent=error.message;return;}break;case'new-vessel':M.addVesselType(state);changed();$('status').textContent='';return;case'new-cargo':showCargoDialog();return;case'apply-cargo':try{M.applyCargo(state,el.dataset.id);changed();$('status').textContent='';}catch(error){$('status').textContent=error.message;}return;case'apply-vessel':try{M.applyVessel(state,el.dataset.id);changed();$('status').textContent='';}catch(error){$('status').textContent=error.message;}return;case'add-lot':showLotDialog();return;case'remove-lot':{const l=state.lots[Number(el.dataset.index)];state.allocations=state.allocations.filter(a=>a.lot!==l.id);state.lots.splice(Number(el.dataset.index),1);break;}case'move-port':M.moveCall(state,el.dataset.port,Number(el.dataset.direction));break;case'calc-intake':state.intakeShownFor=intakeKey();break;case'add-cost':state.costs.push({name:'Additional item',amount:null,days:0,burn:2.7,fuel:'main'});break;case'remove-cost':state.costs.splice(Number(el.dataset.index),1);break;}changed();if(el.dataset.action==='add-cost')$('costs').open=true;});
function saveCalculation(clearStatus=true){
 try{
  const previous=localStorage.getItem(key);
  if(previous){try{readSave(previous);localStorage.setItem(backupKey,previous);}catch{}}
  localStorage.setItem(key,JSON.stringify(state));if(clearStatus)$('status').textContent='';return true;
 }catch{$('status').textContent='Storage is unavailable. Your changes have not been saved.';return false;}
}
$('save').onclick=()=>saveCalculation(true);

$('reset').onclick=()=>{if(!confirm('Clear the current calculation and its local save?'))return;const catalogs={cargoTypes:state.cargoTypes,vesselProfiles:state.vesselProfiles,sales:state.sales,portRecords:state.portRecords};state=M.initial();Object.assign(state,catalogs);ensureLegs();try{localStorage.setItem(key,JSON.stringify(state));}catch{}$('status').textContent='';render();};
$('pdf').onclick=()=>{window.print();};
function showLotDialog(){const available=state.sales.filter(s=>!state.lots.some(l=>l.saleId===s.id));const dialog=document.createElement('dialog');dialog.innerHTML=`<form id="lot-form"><div class="heading"><h2>Add sale</h2><button type="button" id="close-lot" aria-label="Close">×</button></div>${available.length?`<label class="field">Sale<select name="saleId" required>${available.map(s=>`<option value="${esc(s.id)}">${esc(s.id+' · '+s.cargoName+' · '+fmt(s.quantity,1)+' MT · '+s.loadPort+' → '+s.dischargePort)}</option>`).join('')}</select></label>`:'<p class="empty">No sales available. First add a sale in SALE.</p>'}<p id="lot-error" class="error" role="alert"></p><button type="submit" class="primary" ${available.length?'':'disabled'}>Add to voyage</button></form>`;document.body.appendChild(dialog);dialog.querySelector('#close-lot').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove());dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);try{M.addSaleToPlanner(state,f.get('saleId'));dialog.close();changed();}catch(error){dialog.querySelector('#lot-error').textContent=error.message;}};dialog.showModal();}
function showSaleDialog(){const ports=[...new Set(state.portRecords.map(p=>p.name?.trim()).filter(Boolean))],portOptions='<option value="">Select port</option>'+ports.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join(''),dialog=document.createElement('dialog');dialog.innerHTML=`<form id="sale-form"><div class="heading"><h2>New sale</h2><button type="button" id="close-sale" aria-label="Close">×</button></div><div class="grid"><label class="field">Deal date<input name="dealDate" type="date" required></label><label class="field">Cargo<select name="cargoId" required>${state.cargoTypes.filter(c=>M.isBulkCargo(c)&&M.ok(c.sf,true)).map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select></label><label class="field">Volume, MT<input name="quantity" type="number" min="0.001" step="any" required></label><label class="field">Price FOB, USD/MT<input name="fob" type="number" min="0" step="any" required></label><label class="field">Load port<select name="loadPort" required>${portOptions}</select></label><label class="field">Load berth<select name="loadPortId" data-berth-for="loadPort"><option value="">Select a port first</option></select></label><label class="field">Discharge port<select name="dischargePort" required>${portOptions}</select></label><label class="field">Discharge berth<select name="dischargePortId" data-berth-for="dischargePort"><option value="">Select a port first</option></select></label><label class="field">Shipment from<input name="shipmentFrom" type="date" required></label><label class="field">Shipment to<input name="shipmentTo" type="date" required></label></div><p id="sale-error" class="error" role="alert">${ports.length?'':'First add ports in PORT.'}</p><button type="submit" class="primary" ${ports.length?'':'disabled'}>Add sale</button></form>`;document.body.appendChild(dialog);
 // The berth list belongs to the chosen port, so it is refilled whenever that port changes.
 for(const berth of dialog.querySelectorAll('[data-berth-for]')){const port=dialog.querySelector(`[name="${berth.dataset.berthFor}"]`);const fill=()=>{const rows=state.portRecords.filter(p=>p.name===port.value);berth.innerHTML=rows.length?rows.map(p=>`<option value="${esc(p.id)}">${esc(p.berth||p.name)}</option>`).join(''):'<option value="">Select a port first</option>';};port.addEventListener('change',fill);fill();}
 dialog.querySelector('#close-sale').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove());dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);try{M.addSale(state,{dealDate:f.get('dealDate'),cargoId:f.get('cargoId'),quantity:Number(f.get('quantity')),fob:Number(f.get('fob')),loadPort:f.get('loadPort'),dischargePort:f.get('dischargePort'),loadPortId:f.get('loadPortId'),dischargePortId:f.get('dischargePortId'),shipmentFrom:f.get('shipmentFrom'),shipmentTo:f.get('shipmentTo')});dialog.close();changed();}catch(error){dialog.querySelector('#sale-error').textContent=error.message;}};dialog.showModal();}
function showCargoDialog(){
 const dialog=document.createElement('dialog');
 dialog.innerHTML='<form><div class="heading"><h2>New bulk cargo</h2><button type="button" data-close aria-label="Close">×</button></div><div class="grid"><label class="field">Cargo name<input name="name" required></label><label class="field">Planning SF, m³/t<input name="sf" type="number" min="0.000001" step="any" required></label><label class="field">IMSBC group<select name="group"><option value="">Pending</option><option>A</option><option>B</option><option>C</option><option>A &amp; B</option></select></label></div><p class="error" role="alert"></p><button type="submit">Add cargo</button></form>';
 document.body.appendChild(dialog);
 dialog.querySelector('[data-close]').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>dialog.remove());
 dialog.querySelector('form').onsubmit=e=>{
  e.preventDefault();const data=new FormData(e.target),name=String(data.get('name')).trim(),sf=Number(data.get('sf'));
  if(!name||!M.ok(sf,true)){dialog.querySelector('.error').textContent='Enter a cargo name and a positive SF';return;}
  if(state.cargoTypes.some(c=>c.name.toLowerCase()===name.toLowerCase())){dialog.querySelector('.error').textContent='This cargo name already exists';return;}
  let n=1;while(state.cargoTypes.some(c=>c.id==='cargo-'+n))n++;
  state.cargoTypes.push({id:'cargo-'+n,name,sf,physicalForm:'solid',group:data.get('group'),sfBasis:'user-entered',source:'User-entered'});
  dialog.close();changed();
 };dialog.showModal();
}
function cargoDetails(c){const range=v=>v?v.map(n=>numberFormat(0,4).format(Number(n))).join('–'):'SDS required';const link=(url,label)=>url&&/^https:\/\//.test(url)?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`:'';return `<details class="cargo-properties"><summary>${esc(c.propertyStatus||'Properties required')}</summary><dl><dt>BCSN</dt><dd>${esc(c.bcsn||'Shipper declaration required')}</dd><dt>Reference SF, m³/t</dt><dd>${esc(range(c.sfRange))}</dd><dt>Bulk density, kg/m³</dt><dd>${esc(range(c.bulkDensityRange))}</dd><dt>Angle of repose</dt><dd>${esc(c.angleOfRepose||'Not established')}</dd><dt>Applicability</dt><dd>${esc(c.propertyNote||'Confirm the exact product and shipping conditions.')}</dd></dl>${link(c.propertyUrl,'Property source')} ${link(c.sdsUrl,'SDS')} ${link(c.catalogUrl,'Product catalogue')}</details>`;}
const portNames=()=>[...new Set(state.portRecords.filter(p=>p.name.trim()).map(p=>p.name))].map(name=>[name,name]);
// A port with one registered row has nothing to choose; the row still carries the terminal and its limits.
const berthOptions=name=>state.portRecords.filter(p=>p.name===name).map(p=>[p.id,p.berth||p.name]);
const berthSelect=(path,label,name)=>{const options=berthOptions(name);return options.length?select(path,label,options):'';};
function renderCatalog(){M.ensureCatalogs(state);if(currentTab==='sale'){$('app').innerHTML=`<section><div class="heading"><div><h2>SALE</h2><p class="section-intro">Register of concluded sales for voyage planning.</p></div><button data-action="new-sale">+ Add sale</button></div>${state.sales.length?table(['Deal','Date','Cargo','Volume, MT','Loading','Discharge','Shipment','FOB, USD/MT',''],state.sales.map((s,i)=>`<tr><td>${esc(s.id)}</td><td>${input('sales.'+i+'.dealDate','Deal date',{type:'date'})}</td><td class="name">${esc(s.cargoName)}</td><td>${input('sales.'+i+'.quantity','Sale quantity',{tonnage:true})}</td><td><div class="port-cell">${select('sales.'+i+'.loadPort','Load port',portNames())}${berthSelect('sales.'+i+'.loadPortId','Load berth',s.loadPort)}</div></td><td><div class="port-cell">${select('sales.'+i+'.dischargePort','Discharge port',portNames())}${berthSelect('sales.'+i+'.dischargePortId','Discharge berth',s.dischargePort)}</div></td><td><div class="date-range">${input('sales.'+i+'.shipmentFrom','Shipment from',{type:'date'})}${input('sales.'+i+'.shipmentTo','Shipment to',{type:'date'})}</div></td><td>${input('sales.'+i+'.fob','Price FOB')}${state.lots.filter(l=>l.saleId===s.id).map(l=>`<button class="inline-action" data-action="edit-passport" data-id="${esc(l.id)}">Shipment source</button>`).join('')}</td><td><button data-action="remove-sale" data-index="${i}" aria-label="Remove sale ${esc(s.id)}">×</button></td></tr>`)):'<div class="empty-state"><strong>No sales yet</strong><span>Add the first deal. Cargo is selected from CARGO only.</span></div>'}<p class="form-note">A sale already added to PLANNER cannot be deleted until it is removed from the voyage.</p></section>`;return;}if(currentTab==='ports'){const limitCols=[['maxDraft','Max draft, m'],['maxBeam','Max beam, m'],['maxLoa','Max LOA, m'],['maxAirDraft','Max air draft, m'],['maxDwt','Max DWT']];$('app').innerHTML=`<section><div class="heading"><div><h2>PORT</h2><p class="section-intro">Port and berth register with published size limits.</p></div><button data-action="new-port">+ Add port</button></div>${table(['Country','Port','Terminal','Berth','Water density, t/m³',...limitCols.map(([,label])=>label),''],state.portRecords.map((p,i)=>`<tr><td>${input('portRecords.'+i+'.country','Country',{type:'text'})}</td><td>${input('portRecords.'+i+'.name','Port name',{type:'text'})}</td><td>${input('portRecords.'+i+'.terminal','Terminal',{type:'text'})}</td><td>${input('portRecords.'+i+'.berth','Berth',{type:'text'})}</td><td>${select('portRecords.'+i+'.waterDensity','Water density for '+(p.name||'new port'),[['','Not entered'],...Array.from({length:31},(_,j)=>{const v=(1+j/1000).toFixed(3);return [Number(v),v+(j===0?' · Fresh':j===25?' · Sea':'')];})])}</td>${limitCols.map(([key,label])=>`<td class="limit-cell">${input('portRecords.'+i+'.'+key,label+' for '+(p.name||'new port'))}</td>`).join('')}<td><button data-action="remove-port-record" data-index="${i}" aria-label="Remove port ${esc(p.name)}">×</button></td></tr>`),'port-table')}</section>`;return;}if(currentTab==='cargo'){$('app').innerHTML=`<section><div class="heading"><div><h2>CARGO</h2><p class="section-intro">Cargo register for creating sales.</p></div><button data-action="new-cargo">+ Add cargo type</button></div><div class="catalog-toolbar"><input id="cargo-search" type="search" aria-label="Search cargo" placeholder="Name, grade, manufacturer" class="catalog-search"><select id="cargo-family" aria-label="Cargo category"><option value="">All categories</option>${[...new Set(state.cargoTypes.filter(c=>M.isBulkCargo(c)&&M.ok(c.sf,true)).map(c=>c.family||'Other cargoes'))].map(f=>`<option>${esc(f)}</option>`).join('')}</select></div>${table(['Cargo','Planning SF, m³/t','IMSBC Group'],state.cargoTypes.map((c,i)=>({c,i})).filter(({c})=>M.isBulkCargo(c)&&M.ok(c.sf,true)).map(({c,i})=>`<tr data-family="${esc(c.family||'Other cargoes')}" data-catalog-name="${esc([c.name,c.aliases,c.producer,c.family].filter(Boolean).join(' ').toLowerCase())}"><td class="cargo-name-cell">${input('cargoTypes.'+i+'.name','Cargo name',{type:'text'})}</td><td class="cargo-sf-cell">${input('cargoTypes.'+i+'.sf','Planning stowage factor',{disabled:!M.isBulkCargo(c)})}</td><td class="cargo-group-cell">${select('cargoTypes.'+i+'.group','IMSBC group',[['',M.isBulkCargo(c)?'Pending':'N/A'],'A','B','C','A & B'])}</td></tr>`))}<p class="form-note">Planning SF is a reference estimate and must be confirmed for the shipment. IMSBC Group must match the exact product.</p></section>`;return;}
$('app').innerHTML='<div class="heading"><div><h2>VESSEL TYPES</h2><p class="section-intro">Standard vessel types for cargo carriage.</p></div><button data-action="new-vessel">+ Add vessel type</button></div>'+state.vesselProfiles.map((v,i)=>{const path='vesselProfiles.'+i;return `<details class="vessel-card"><summary><strong>VESSEL · ${esc(v.name)}</strong><span>${esc(v.model)} · ${fmt(v.dwt,0)} DWT</span></summary><div class="vessel-card-body"><div class="heading vessel-apply"><span></span><button data-action="apply-vessel" data-id="${esc(v.id)}">Apply to voyage</button></div><div class="grid">${[['name','Name'],['model','Project / model'],['source','Parameter source']].map(([k,l])=>field(path+'.'+k,l,{type:'text'})).join('')}${[['dwt','DWT, MT'],['draft','Draft SSW, m'],['tpc','TPC, t/cm'],['loa','LOA, m'],['beam','Beam, m'],['airDraft','Air draft, m'],['grain','Grain capacity, m³'],['bale','Bale capacity, m³'],['gt','GRT'],['nrt','NRT'],['cranes','Cranes, qty'],['craneSWL','Crane SWL, MT'],['tanktop','Tank top, t/m²']].map(([k,l])=>field(path+'.'+k,l)).join('')}</div><h3>Speed and consumption</h3><div class="grid">${[['speed','Laden speed, kn'],['burn','Laden main fuel, t/day'],['ballastSpeed','Ballast speed, kn'],['ballastBurn','Ballast main fuel, t/day'],['aux','Sea LSMGO, t/day'],['working','Port main working, t/day'],['idle','Port main idle, t/day'],['auxWorking','Port LSMGO working, t/day'],['auxIdle','Port LSMGO idle, t/day'],['boiler','Separate boiler, t/day'],['ecaBurn','ECA main fuel, t/day']].map(([k,l])=>field(path+'.'+k,l)).join('')}</div><h3>Holds</h3><div class="grid holds-grid">${v.holdData.map((h,j)=>field(path+'.holdData.'+j+'.volume','Hold №'+h.id+', m³')).join('')}</div></div></details>`;}).join('');}
function setupChrome(){if(document.documentElement)document.documentElement.lang='en';}
function syncWorkspace(){for(const name of tabs)$('tab-'+name).setAttribute('aria-selected',String(name===currentTab));const outsidePlanner=currentTab!=='planner';$('planner-actions').hidden=outsidePlanner;$('planner-footer').hidden=false;if($('reset-top'))$('reset-top').hidden=outsidePlanner;}
for(const tab of tabs)$('tab-'+tab).onclick=()=>{currentTab=tab;try{sessionStorage.setItem(tabKey,tab);}catch{}syncWorkspace();render();};
function filterCargo(){const q=($('cargo-search')?.value||'').toLowerCase().trim();const family=$('cargo-family')?.value||'';document.querySelectorAll('[data-catalog-name]').forEach(row=>row.hidden=!(q.split(/\s+/).every(word=>row.dataset.catalogName.includes(word))&&(!family||row.dataset.family===family)));}
$('app').addEventListener('input',e=>{
 const el=e.target;if(el.id==='cargo-search'){filterCargo();return;}
 if(currentTab!=='planner')return;
 if(el.dataset.path&&editableLotField(el.dataset.path)){
  const value=el.type==='checkbox'?el.checked:el.type==='number'?(el.value===''?null:Number(el.value)):el.value;
  noteManualEntry(el.dataset.path,value);set(el.dataset.path,value);saveCalculation(false);return;
 }
 if(el.dataset.lot){
  if(state.stage!=='load')return;
  const quantity=tonnage(el.value),hold=Number(el.dataset.hold);
  if(!M.ok(quantity))return;
  state.allocations=state.allocations.filter(a=>!(a.lot===el.dataset.lot&&a.hold===hold));
  if(quantity>0)state.allocations.push({lot:el.dataset.lot,hold,quantity});
  saveCalculation(false);plannerUI.refresh();
 }
});
$('app').addEventListener('change',e=>{if(e.target.id==='cargo-family')filterCargo();});

if(window.addEventListener)window.addEventListener('beforeprint',()=>document.querySelectorAll('.cargo-fill').forEach(el=>el.getAnimations?.().forEach(a=>a.finish())));
if(document.addEventListener){document.addEventListener('invalid',e=>{const el=e.target;if(el.setCustomValidity)el.setCustomValidity(el.validity.valueMissing?'Complete this field.':'Enter a valid value for this field.');},true);document.addEventListener('input',e=>{if(e.target.setCustomValidity)e.target.setCustomValidity('');},true);}
window.ProjectXApp={getState:()=>JSON.parse(JSON.stringify(state)),getResult:()=>M.compute(state),getPlanningResult:()=>P.check(state)};ensureLegs();setupChrome();syncWorkspace();render();if(startupMessage)$('status').textContent=startupMessage;
})();
