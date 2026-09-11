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
 return `<input aria-label="${esc(label)}" data-path="${path}" type="${options.type||'number'}" ${options.type?'':'min="0" step="any"'} value="${esc(get(path))}" placeholder="${esc(options.placeholder||'—')}" ${options.list?`list="${esc(options.list)}"`:''} ${options.disabled?'disabled':''}>`;}
function select(path,label,values){return `<select aria-label="${esc(label)}" data-path="${path}">${values.map(v=>{const [id,name]=Array.isArray(v)?v:[v,v];return `<option value="${esc(id)}" ${String(get(path)??'')===String(id)?'selected':''}>${esc(name)}</option>`;}).join('')}</select>`;}
function field(path,label,options){return `<label class="field">${label}${input(path,label,options)}</label>`;}
const chosen=()=>state.lots.filter(l=>l.selected);
// The particulars are one plate in upper case. The case is in the text, not in a style rule,
// so the line carries it wherever it goes: on screen, in print, and in a copy of it.
function vesselSummary(){
 const v=M.vesselOf(state);
 const text=`${fmt(v?.dwt,0)} DWT · ${v?.holds??''} holds · ${v?.model??''} · LOA ${fmt(v?.loa)} m · Beam ${fmt(v?.beam)} m · Draft ${fmt(v?.draft,2)} m · TPC ${fmt(v?.tpc)} · Grain ${fmt(v?.grain,0)} m³`;
 return `<span class="muted vessel-summary">${esc(text.toUpperCase())}</span>`;
}
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
function intakeCalculator(ship){
 const labels={fuel:'Fuel, t',water:'Fresh water, t',ballast:'Ballast, t',constant:'Constant, t',draftLoss:'Loss due to draft, t'};
 const limits=M.intakeLimits(state);
 const deductions=Object.entries(labels).map(([k,l])=>k==='draftLoss'
  ?`<label class="field">${l}<input aria-label="${l}" readonly value="${fmt(state.deductions.draftLoss,1)}"></label>`
  :field('deductions.'+k,l)).join('');
 const body=`<div class="heading compact-heading"><h3>Deductions</h3></div><div class="grid">${deductions}</div>${draftLossLine()}`
  +`<p class="intake-line">DWT limit: ${intakeShown()?`DWT ${num(M.vesselOf(state)?.dwt)} − fuel ${num(state.deductions.fuel)} − fresh water ${num(state.deductions.water)} − ballast ${num(state.deductions.ballast)} − constant ${num(state.deductions.constant)} − draft loss ${num(state.deductions.draftLoss)} = <strong>${fmt(ship.intake,2)} t</strong>`:`<strong>—</strong><button data-action="calc-intake" ${ship.intake===null||ship.intake<0?'disabled':''}>Calculate intake</button>`}</p>`
  +`<h3>Holds</h3><div class="grid holds-grid">${state.holds.map((h,i)=>field('holds.'+i+'.volume','Hold №'+h.id+', m³')).join('')}</div>`
  +grainCapacityLine()
  +(intakeShown()&&limits.cubic!==null?`<p class="cubic-intake">Cubics limit: ${fmt(limits.holdTotal,2)} m³ ÷ mix SF ${fmt(limits.weightedSf,5)} m³/t = <strong>${fmt(limits.cubic,2)} t</strong></p><p class="restricted-intake">Restricted intake DWT/cubics: min(${fmt(limits.dwt,2)} t, ${fmt(limits.cubic,2)} t) = <strong>${fmt(limits.restricted,2)} t</strong></p>`:intakeShown()?'<p class="restricted-intake muted">Cubics not checked · complete every hold volume and selected shipment SF.</p>':'')
  ;
 const intake=(intakeShown()?(limits.restricted!==null?`${fmt(limits.restricted,2)} t estimated restricted intake`:`${fmt(limits.dwt,2)} t DWT only · cubics not checked`):ship.intake!==null&&ship.intake<0?'No feasible intake · deductions exceed DWT':'Intake not calculated').toUpperCase();
 return `<details id="intake-calculator" class="fold"><summary><strong>Intake Calculator</strong><span>${intake}</span></summary><div class="fold-body">${body}</div></details>`;
}

// The voyage on an equirectangular world. The drawn track is the check on the distance beside it:
// a leg that loops out to sea and back is visible long before the number looks wrong.
const Sea=typeof window!=='undefined'?window.ProjectXSeaRoute:null;
const portAnchor=name=>{const p=state.portRecords.find(p=>p.name===name&&Number.isFinite(p.lat)&&Number.isFinite(p.lon));return p?[p.lon,p.lat]:null;};
const legRoute=(fromName,toName,leg,ballast)=>{
 const a=portAnchor(fromName),b=portAnchor(toName);
 return {from:fromName,to:toName,a,b,leg,ballast,
  route:Sea&&a&&b?Sea.route(a,b):null,
  published:Sea?Sea.published(M.portProfileOf(fromName)?.pub151,M.portProfileOf(toName)?.pub151):null};
};
function voyageLegs(){
 const calls=M.callsOf(state),out=[];
 // The approach is measured from the delivery port, so it is routed and drawn like the loaded legs.
 if(state.ballastEnabled&&calls.length)out.push(legRoute(state.ballast.from,calls[0].name,state.ballast,true));
 for(let i=0;i<calls.length-1;i++){
  out.push(legRoute(calls[i].name,calls[i+1].name,state.legs.find(l=>l.from===calls[i].name&&l.to===calls[i+1].name)||null,false));
 }
 return out;
}
function syncRouteDistances(){
 if(!Sea)return;
 for(const l of voyageLegs()){
  const leg=l.leg;if(!leg||leg.distanceSource==='entered')continue;
  // A printed distance outranks a routed one; both step aside for a figure the user typed.
  if(l.published){leg.distance=l.published.distance;leg.distanceSource='published';}
  else if(l.route?.reliable&&Number.isFinite(l.route.distance)){leg.distance=round(l.route.distance,0);leg.distanceSource='estimated';}
  else if(leg.distanceSource==='published'||leg.distanceSource==='estimated'){leg.distance=null;leg.distanceSource=null;}
 }
}
// Typing into a leg distance makes it the user's figure; clearing it hands the leg back to the estimate.
function noteManualEntry(path,value){
 if(path==='ballast.distance'){state.ballast.distanceSource=value===null?null:'entered';return;}
 const m=/^legs\.(\d+)\.distance$/.exec(path||'');
 if(m&&state.legs[m[1]])state.legs[m[1]].distanceSource=value===null?null:'entered';
}
const ringPath=ring=>`<path d="M${ring.map(p=>p[0].toFixed(2)+' '+(-p[1]).toFixed(2)).join('L')}Z"/>`;
const linePath=line=>`<path d="M${line.map(p=>p[0].toFixed(2)+' '+(-p[1]).toFixed(2)).join('L')}"/>`;
let coastCache=null,depthCache=null,borderCache=null;
const coastMarkup=()=>coastCache??=Sea.coastline().map(ringPath).join('');
const borderMarkup=()=>borderCache??=Sea.borders().map(linePath).join('');
// Shallow water first, each deeper band painted over it, so the shelf reads lighter than the abyss.
const depthMarkup=()=>depthCache??=Sea.depths().map(d=>`<g class="sea-depth" data-depth="${d.level}">${d.rings.map(ringPath).join('')}</g>`).join('');
// A graticule at a step the fitted view can carry: it gives the eye a scale the coastline alone does not.
function graticule(box){
 const span=Math.max(box[2],box[3]);
 const step=span>120?30:span>60?15:span>24?10:span>10?5:span>4?2:1;
 const lines=[];
 for(let lon=-180;lon<=180;lon+=step)lines.push(`<line x1="${lon}" y1="-90" x2="${lon}" y2="90"/>`);
 for(let lat=-90;lat<=90;lat+=step)lines.push(`<line x1="-180" y1="${lat}" x2="180" y2="${lat}"/>`);
 return `<g class="sea-graticule">${lines.join('')}</g>`;
}
// Pan and zoom live outside the voyage: they belong to this browsing session, not to the saved calculation.
let mapZoom=null;
const mapKey=box=>box.map(n=>n.toFixed(1)).join(' ');
function mapView(fitted){
 if(!mapZoom||mapZoom.key!==mapKey(fitted))mapZoom={key:mapKey(fitted),fitted:fitted.slice(),box:fitted.slice()};
 return mapZoom.box;
}
// Zooming out stops where the world itself fills the frame. Past that the drawing would
// shrink into the middle of an empty box, which is not a smaller map but a lost one.
function clampView(fitted,box){
 let [x,y,w,h]=box;
 const ratio=w/h,min=Math.min(fitted[2],fitted[3])/60;
 const maxW=Math.min(360,180*ratio);
 w=Math.min(Math.max(w,min*ratio),maxW);h=w/ratio;
 // Inside the world the view is free; once it spans the world it is centred on it.
 x=w>=360?-w/2:Math.min(Math.max(x,-180),180-w);
 y=h>=180?-h/2:Math.min(Math.max(y,-90),90-h);
 return [x,y,w,h];
}
// preserveAspectRatio letterboxes whatever the box and the frame disagree about, and the
// frame's shape is only known once the page has laid out. The box is widened or heightened
// to match it, which reveals more ocean and never hides the voyage.
function fitMapFrame(){
 const svg=document.querySelector?.('.voyage-map svg');
 if(!svg?.getBoundingClientRect||!mapZoom)return;
 const rect=svg.getBoundingClientRect();
 if(!rect.width||!rect.height)return;
 const frame=rect.width/rect.height,[x,y,w,h]=mapZoom.box;
 if(Math.abs(frame-w/h)>.01){
  const nw=frame>w/h?h*frame:w,nh=frame>w/h?h:w/frame;
  mapZoom.box=clampView(mapZoom.fitted,[x-(nw-w)/2,y-(nh-h)/2,nw,nh]);
 }
 paintMapView();
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
function resetMap(){if(mapZoom){mapZoom.box=mapZoom.fitted.slice();fitMapFrame();}}
// Screen pixels mean nothing to a viewBox in degrees; the element's own matrix does the conversion.
function mapPoint(svg,event){
 const ctm=svg.getScreenCTM();
 if(!ctm)return null;
 const p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;
 return p.matrixTransform(ctm.inverse());
}
function paintMapView(){
 const svg=document.querySelector?.('.voyage-map svg');
 if(!svg||!mapZoom)return;
 svg.setAttribute('viewBox',mapZoom.box.map(n=>n.toFixed(3)).join(' '));
 const width=svg.getBoundingClientRect?.().width;
 if(!width)return;
 const unit=mapZoom.box[2]/width,marks=svg.querySelector?.('.sea-marks'),places=svg.querySelector?.('.sea-places');
 if(marks&&mapZoom.anchors)marks.innerHTML=markMarkup(mapZoom.anchors,mapZoom.box,unit);
 if(places)places.innerHTML=placeMarkup(mapZoom.box,unit);
}
// A marker is a fixed number of screen pixels, like the strokes beside it: sizing it as a
// fraction of the frame made a 44-pixel label on a wide monitor. `unit` is map units per pixel,
// so every measurement below reads as the pixels it will occupy.
const LABEL_RANK=[[200,2,2],[90,3,2],[40,4,4],[15,5,5],[0,6,6]];
function placeMarkup(box,unit){
 const span=Math.max(box[2],box[3]),[,countryRank,seaRank]=LABEL_RANK.find(([from])=>span>from)||LABEL_RANK[LABEL_RANK.length-1];
 const inside=p=>p.lon>=box[0]&&p.lon<=box[0]+box[2]&&-p.lat>=box[1]&&-p.lat<=box[1]+box[3];
 const {countries,seas}=Sea.places();
 // Two names in the same place read as neither, so the more important one keeps the ground.
 const taken=[];
 const draw=(list,rank,cls,size)=>[...list].filter(p=>p.rank<=rank&&inside(p)).sort((a,b)=>a.rank-b.rank)
  .map(p=>{
   const height=unit*size,width=p.name.length*height*(cls==='country-name'?.68:.5),x=p.lon,y=-p.lat;
   if(taken.some(q=>Math.abs(q[0]-x)<(q[2]+width)/2&&Math.abs(q[1]-y)<(q[3]+height)*.7))return '';
   taken.push([x,y,width,height]);
   return `<text class="${cls}" x="${x.toFixed(3)}" y="${y.toFixed(3)}" font-size="${height.toFixed(3)}">${esc(p.name)}</text>`;
  }).join('');
 return draw(seas,seaRank,'sea-name',12)+draw(countries,countryRank,'country-name',9);
}
const MARK={ring:4.5,dot:1.6,label:11,gap:8,line:13,crowd:130};
function markMarkup(anchors,box,unit){
 const middle=box[0]+box[2]/2,placed=[];
 return anchors.map(([name,p])=>{
  const east=p[0]>middle,gap=unit*MARK.gap*(east?-1:1);
  let y=-p[1]+unit*MARK.label*.35;
  while(placed.some(q=>Math.abs(q[1]-y)<unit*MARK.line&&Math.abs(q[0]-p[0])<unit*MARK.crowd))y+=unit*MARK.line;
  placed.push([p[0],y]);
  const x=p[0].toFixed(3),cy=(-p[1]).toFixed(3);
  return `<g class="sea-port"><circle class="sea-port-ring" cx="${x}" cy="${cy}" r="${(unit*MARK.ring).toFixed(3)}"/><circle class="sea-port-dot" cx="${x}" cy="${cy}" r="${(unit*MARK.dot).toFixed(3)}"/><text x="${(p[0]+gap).toFixed(3)}" y="${y.toFixed(3)}" text-anchor="${east?'end':'start'}" font-size="${(unit*MARK.label).toFixed(3)}">${esc(name)}</text></g>`;
 }).join('');
}
// Before the page has laid out there is no width to measure; the first draw assumes a common
// one and paintMapView corrects it as soon as the real frame is known.
const mapUnit=box=>box[2]/(document.querySelector?.('.voyage-map svg')?.getBoundingClientRect?.().width||1100);
function voyageMap(){
 if(!Sea)return '';
 const legs=voyageLegs(),drawn=legs.filter(l=>l.route?.path);
 const names=[...new Set([...legs.filter(l=>l.ballast).map(l=>l.from),...M.callsOf(state).map(c=>c.name)])];
 const anchors=names.map(name=>[name,portAnchor(name)]).filter(([,p])=>p);
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
 mapZoom.anchors=anchors;
 const coast=coastMarkup();
 const tracks=drawn.map(l=>{
  const points=l.route.path.map(p=>p[0].toFixed(2)+','+(-p[1]).toFixed(2)).join(' ');
  const kind=(l.route.reliable?'':' sea-track-doubtful')+(l.ballast?' sea-track-ballast':'');
  return `<polyline class="sea-glow${kind}" points="${points}"/><polyline class="sea-track${kind}" points="${points}"/>`;
 }).join('');
 const marks=markMarkup(anchors,box,mapUnit(box));
 return `<div class="voyage-map"><div class="map-controls"><button data-action="map-zoom" data-factor="0.7" aria-label="Zoom in">+</button><button data-action="map-zoom" data-factor="1.45" aria-label="Zoom out">−</button><button data-action="map-reset" aria-label="Fit the voyage">Fit</button></div><svg viewBox="${box.map(n=>n.toFixed(3)).join(' ')}" role="img" aria-label="Voyage route map" preserveAspectRatio="xMidYMid meet">${depthMarkup()}${graticule(fitted)}<g class="sea-land">${coast}</g><g class="sea-borders">${borderMarkup()}</g><g class="sea-places">${placeMarkup(box,mapUnit(box))}</g>${tracks}<g class="sea-marks">${marks}</g></svg></div>`;
}
function voyageDistanceLine(){
 if(!Sea)return '';
 const legs=voyageLegs().filter(l=>l.leg);
 if(!legs.length)return '';
 const rows=legs.map(l=>{
  const source=l.leg.distanceSource==='entered'?'Entered'
   :l.leg.distanceSource==='published'?'NGA Pub. 151, published'
   :l.leg.distanceSource==='estimated'?'Estimated over the lane network'
   :l.route&&!l.route.reliable?'Coastal leg · no lane near these ports and no printed pair; enter it from a distance table'
   :l.ballast&&!String(state.deliveryPort||'').trim()?'Ballast approach · enter the delivery port to measure it'
   :l.ballast&&!l.a?'Delivery port is not a registered port with a position; add it in PORT or enter the distance'
   :'No route · check the port positions in PORT';
  return `<tr><td class="name">${esc(l.from)} → ${esc(l.to)}</td><td>${M.ok(l.leg.distance,true)?fmt(l.leg.distance,0):'—'}</td><td>${l.published?fmt(l.published.distance,0):'—'}</td><td>${l.route?.distance?fmt(l.route.distance,0):'—'}</td><td>${esc(source)}</td></tr>`;});
 return table(['Leg','In the calculation, nm','Pub. 151, nm','Estimate, nm','Source'],rows,'sea-distances');
}
// The voyage stated as the chain it is: time, then what it costs, then what it earns,
// then what is left. Every line is an equation with its own parts, so the total can be
// followed without opening a single table.
// Section 4 is a stack of folds: each block keeps its own result on the summary line,
// so the voyage can be read without opening anything and edited by opening one block.
const foldBlock=(id,title,summary,body)=>`<details id="${id}" class="fold"><summary><strong>${esc(title)}</strong><span>${summary}</span></summary><div class="fold-body">${body}</div></details>`;
const sumOf=xs=>xs.every(x=>x!==null&&x!==undefined&&Number.isFinite(x))?xs.reduce((a,x)=>a+x,0):null;
const orDash=(x,d=0,unit='')=>x===null?'—':fmt(x,d)+unit;
function legsSummary(rows){
 const days=sumOf(rows.map(({l})=>M.legDays(l))),miles=sumOf(rows.map(({l})=>l.distance));
 return `${rows.length} ${rows.length===1?'leg':'legs'} · ${orDash(miles,0,' NM')} · <strong>${orDash(days,2,' days at sea')}</strong>`;
}
function portsSummary(calls){
 const days=sumOf(calls.map(p=>M.portDays(state,p))),da=sumOf(calls.map(p=>p.da));
 return `${calls.length} ${calls.length===1?'call':'calls'} · DA ${orDash(da,0,' USD')} · <strong>${orDash(days,2,' days in port')}</strong>`;
}
function moneySummary(){
 const price=state.prices.main,freight=state.freight;
 return `Hire ${orDash(state.hire,0,' USD/day')} · Main fuel ${orDash(price,0,' USD/t')} · Freight ${freight===null?'not entered':fmt(freight,2)+' USD/t'}`;
}
function voyageChain(b,ship){
 if(!b)return '';
 const usd=x=>fmt(x,2),day=x=>fmt(x,2);
 const line=(name,result,unit,parts)=>`<div class="chain-line"><span class="chain-name">${name}</span><span class="chain-result">${result} <small>${unit}</small></span><span class="chain-parts">${parts}</span></div>`;
 const kind=k=>b.rows.filter(r=>r.kind===k).reduce((n,r)=>n+r.cents,0)/100;
 const bunkers=kind('fuel'),ports=kind('ports'),other=kind('other');
 const chain=[
  line('Voyage time',day(b.days),'days',`at sea ${day(b.sea)} + working ${day(b.work)} + waiting and stops ${day(b.idle)}`),
  line('Model cost',usd(b.total),'USD',`hire ${usd(b.hire)} + bunkers ${usd(bunkers)} + port charges ${usd(ports)} + other ${usd(other)}`),
  line('Cost per tonne',fmt(b.unit,2),'USD/t',`${usd(b.total)} USD / ${fmt(ship.quantity,0)} t of cargo`)];
 if(b.gross!==null)chain.push(
  line('Net revenue',usd(b.net),'USD',`gross freight ${usd(b.gross)} − commission ${usd(b.commission)} + other income ${usd(b.net-b.gross+b.commission)}`),
  line('Result after hire',usd(b.pnl),'USD',`net revenue ${usd(b.net)} − model cost ${usd(b.total)}`),
  line('TCE before hire',fmt(b.tce,0),'USD/day',`(net revenue ${usd(b.net)} − cost excluding hire ${usd(b.total-b.hire)}) / ${day(b.days)} days`));
 else chain.push(line('Freight not entered','—','',`the revenue side stays unstated; ${fmt(b.requiredFreightQuote,2)} USD/t would cover the model cost`));
 chain.push(line('Freight to cover cost',fmt(b.requiredFreightQuote,2),'USD/t',`(model cost ${usd(b.total)} − other income ${usd(b.net===null?0:b.net-b.gross+b.commission)}) / (1 − commission) / ${fmt(ship.quantity,0)} t, rounded up`));
 return `<div class="voyage-chain">${chain.join('')}</div>`;
}
const round=(x,d)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:x;
// Allocation cells are printed in the table's own format, so the grouping goes back out before the number is read.
const tonnage=text=>{const clean=String(text).replace(/[\s,\u00a0\u202f]/g,'');return clean===''?0:Number(clean);};
const num=x=>Number.isFinite(x)?numberFormat(0,20).format(x):'—';
const intakeKey=()=>JSON.stringify([P.INTAKE_METHOD,M.vesselOf(state)?.dwt,...M.DEDUCTIONS.map(k=>state.deductions[k])]);
const intakeShown=()=>{if(state.intakeShownFor!==intakeKey())return false;const {dwt}=M.intakeLimits(state);return dwt!==null&&dwt>=0;};
const table=(heads,rows,cls='')=>`<div class="table-wrap"><table class="${cls}"><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
function rotationList(title,isLoad){const loadNames=new Set(chosen().map(l=>l.loadPort)),group=M.callsOf(state).filter(p=>loadNames.has(p.name)===isLoad);return `<div><h3>${title}</h3><ol class="port-order">${group.map((p,i)=>{const parcels=chosen().filter(l=>(isLoad?l.loadPort:l.port)===p.name),q=parcels.every(l=>M.ok(l.quantity,true))?parcels.reduce((n,l)=>n+l.quantity,0):null;return `<li><span class="port-number">${i+1}</span><div class="port-caption"><strong>${esc(p.name)}</strong><small>${fmt(q,0)} t ${parcels.map(l=>`<span class="tag" style="background:${l.color}" title="${esc(l.name)}"></span>`).join('')}</small></div><div class="port-actions"><button data-action="move-port" data-port="${esc(p.name)}" data-direction="-1" aria-label="${esc(p.name)} earlier" ${i===0?'disabled':''}>↑</button><button data-action="move-port" data-port="${esc(p.name)}" data-direction="1" aria-label="${esc(p.name)} later" ${i===group.length-1?'disabled':''}>↓</button></div></li>`;}).join('')}</ol>${group.length?'':'<p class="muted">Add sales from SALE to the planner</p>'}</div>`;}
function render(){if(currentTab==='market'){renderMarket();return;}if(currentTab==='guide'){$('app').innerHTML=window.ProjectXGuide.render();return;}if(currentTab!=='planner'){renderCatalog();return;}P.syncAutoDraftLoss(state);syncRouteDistances();const motion=plannerUI.motionSnapshot();const open=[...document.querySelectorAll('details[open]')].map(d=>d.id);const r=M.compute(state),b=r.budget,ship=r.ship;const lots=chosen();let html=`${state.demo?'<p class="notice">Demo example. Tonnage, SF, distances and prices are illustrative; replace the inputs before using the calculation.</p>':''}<section><div class="heading"><h2>1. Sales in voyage</h2><button data-action="add-lot">+ Add sale</button></div>`;
html+=state.lots.length?table(['In voyage','Sale / cargo','Quantity, MT','SF, m³/t','Loading','Discharge','Shipment',''],state.lots.map((l,i)=>`<tr><td><input type="checkbox" data-path="lots.${i}.selected" aria-label="Include ${esc(l.name)}" ${l.selected?'checked':''}></td><td class="name"><span class="tag" style="background:${l.color}"></span><small>${state.sales.some(s=>s.id===l.saleId)?`<button class="text-action sale-link" data-action="open-sale" data-id="${esc(l.saleId)}" aria-label="Open ${esc(l.saleId)} in SALE">${esc(l.saleId)}</button>`:esc(l.saleId||'Legacy')}</small><br><button class="text-action" data-action="parcel-passport" data-id="${esc(l.id)}">${esc(l.name)}</button></td><td>${fmt(l.quantity,1)}</td><td>${fmt(l.sf,2)}</td><td>${esc(l.loadPort)}</td><td>${esc(l.port)}</td><td class="shipment-window">${shipmentWindow(state.sales.find(s=>s.id===l.saleId))}</td><td><button data-action="remove-lot" data-index="${i}" aria-label="Remove sale ${l.saleId||l.id} from voyage">×</button></td></tr>`),'voyage-sales-table'): '<div class="empty-state planner-empty"><strong>No sales in voyage yet</strong><span>Add a sale from SALE to start planning this voyage.</span></div>';html+='</section>';
html+=`<section><div class="heading"><h2>2. Vessel and rotation</h2></div><div class="vessel-choice"><label class="field">${select('vesselId','Vessel',(state.vesselProfiles||M.VESSELS).map(v=>[v.id,v.name]))}</label>${vesselSummary()}</div>${intakeCalculator(ship)}<div class="rotation-grid">${rotationList('Loading',true)}${rotationList('Discharge',false)}</div></section>`;
// One planner check per render; both the section and the print evidence read the same result.
const report=P.check(state,b);
html+=plannerUI.section3(state,b,report)+plannerUI.printEvidence(state,b,report);
html+=`<section><div class="heading"><h2>4. Voyage calculation</h2></div>${voyageChain(b,ship)}`;
html+=`<details id="voyage-map" class="fold"><summary><strong>Voyage map</strong></summary><div class="fold-body">${voyageMap()}</div></details>`;
const distances=voyageDistanceLine(),drawnLegs=voyageLegs().filter(l=>l.leg);
if(distances)html+=foldBlock('voyage-distances','Distances',`${drawnLegs.length} ${drawnLegs.length===1?'leg':'legs'} · ${orDash(sumOf(drawnLegs.map(l=>l.leg.distance)),0,' NM')}`,distances);
const activePorts=M.callsOf(state);const displayedLegs=[];if(state.ballastEnabled)displayedLegs.push({l:state.ballast,path:'ballast'});for(let i=1;i<activePorts.length;i++){const j=state.legs.findIndex(l=>l.from===activePorts[i-1].name&&l.to===activePorts[i].name);if(j>=0)displayedLegs.push({l:state.legs[j],path:'legs.'+j});}
const legsHead=`<div class="ballast-line"><label class="muted"><input type="checkbox" data-path="ballastEnabled" ${state.ballastEnabled?'checked':''}> Include ballast approach to ${esc(M.callsOf(state)[0]?.name||'the first load port')}</label>${state.ballastEnabled?`<label class="field delivery-port">Delivery port${input('deliveryPort','Delivery port',{type:'text',placeholder:M.DELIVERY_PLACEHOLDER,list:'delivery-ports'})}</label><datalist id="delivery-ports">${portNames().map(([name])=>`<option value="${esc(name)}"></option>`).join('')}</datalist>`:''}</div>`;
const legsTable=table(['Leg','Total, NM','Of which ECA, NM','Speed, kn','Weather, % time','Outside ECA, t/day','In ECA, t/day','Aux, t/day','Days'],displayedLegs.map(({l,path})=>`<tr><td class="name">${esc(l.from)} → ${esc(l.to)}</td>${['distance','eca','speed','margin','burn','ecaBurn','aux'].map(k=>`<td>${input(path+'.'+k,l.from+' '+k)}</td>`).join('')}<td>${fmt(b?.legs.find(x=>x.from===l.from&&x.to===l.to)?.days??M.legDays(l),3)}</td></tr>`));// The calendar period belongs to manual handling terms only: the column appears with the call that needs it.
html+=foldBlock('voyage-legs','Legs',legsSummary(displayedLegs),legsHead+legsTable);
const manualTerms=activePorts.some(p=>p.terms==='manual');
const portsTable=table(['Port','Cargo, MT','Handling rate, t/day','Handling terms',...(manualTerms?['Calendar, days']:[]),'Turn time, h','Waiting, h','DA, USD','Days'],activePorts.map(p=>{const i=state.ports.indexOf(p),path='ports.'+i;return `<tr><td>${esc(p.name)}</td><td>${fmt(lots.filter(l=>l.loadPort===p.name||l.port===p.name).reduce((n,l)=>n+(l.quantity||0),0),0)}</td><td>${input(path+'.rate',p.name+' handling rate')}</td><td>${select(path+'.terms',p.name+' terms',[['SHINC','24/7 · SHINC'],['manual','Manual calendar']])}</td>${manualTerms?`<td>${input(path+'.calendar',p.name+' calendar days',{disabled:p.terms==='SHINC'})}</td>`:''}<td>${input(path+'.turn',p.name+' turn time')}</td><td>${input(path+'.extra',p.name+' waiting')}</td><td>${input(path+'.da',p.name+' DA')}</td><td>${fmt(b?.ports.find(x=>x.name===p.name)?.days??M.portDays(state,p),3)}</td></tr>`;}));
const portFuel=`<details id="portfuel"><summary>Port fuel consumption</summary>${table(['Port','Main fuel','Main work, t/day','Main idle, t/day','Aux work, t/day','Aux idle, t/day','Boiler, t/day','Boiler operating time, days','Boiler fuel'],activePorts.map(p=>{const path='ports.'+state.ports.indexOf(p);return `<tr><td>${esc(p.name)}</td><td>${select(path+'.fuel',p.name+' fuel',[['main','Outside ECA'],['eca','ECA']])}</td>${['working','idle','auxWorking','auxIdle','boiler','boilerDays'].map(k=>`<td>${input(path+'.'+k,p.name+' '+k)}</td>`).join('')}<td>${select(path+'.boilerFuel','Boiler fuel',[[null,'Select'],['main','Main outside ECA'],['eca','Main ECA'],['aux','Aux']])}</td></tr>`;}))}</details>`;
html+=foldBlock('voyage-ports','Ports',portsSummary(activePorts),portsTable+portFuel);
const moneyBody=`<div class="grid">${field('hire','Effective hire / target TCE, USD/day')}${field('prices.main','Main outside ECA, USD/t')}${field('prices.eca','Main ECA, USD/t')}${field('prices.aux','Additional Aux, USD/t')}${field('freight','Estimated gross freight, USD/t · optional')}${field('commission','Commission on gross freight, %')}${field('extraIncome','Other income net, USD')}</div><p class="form-note">Fuel grades and prices are set by voyage phase. Enter prices and consumption explicitly for each zone. Aux is added to main consumption; enter 0 only if it is already included or not used.</p>${state.costs.length?`<h3>Additional costs and stops</h3>`+table(['Item','Amount, USD','Additional time, days','Consumption, t/day','Fuel',''],state.costs.map((c,i)=>`<tr><td>${input('costs.'+i+'.name','Item name',{type:'text'})}</td><td>${input('costs.'+i+'.amount','Item amount')}</td><td>${input('costs.'+i+'.days','Additional time')}</td><td>${input('costs.'+i+'.burn','Stop consumption')}</td><td>${select('costs.'+i+'.fuel','Stop fuel',[['main','Outside ECA'],['eca','ECA']])}</td><td><button data-action="remove-cost" data-index="${i}" aria-label="Remove item ${i+1}">Remove</button></td></tr>`))+`<button data-action="add-cost">Add item</button>`:`<button class="inline-action" data-action="add-cost">+ Add cost or stop</button>`}`;
html+=foldBlock('voyage-money','Hire, bunkers and freight',moneySummary(),moneyBody);
if(b){const amount=kind=>b.rows.filter(r=>r.kind===kind).reduce((n,r)=>n+r.cents,0)/100;html+=`<div class="split"><div><h3>Costs</h3><table class="totals"><tbody>${[['Hire',b.hire],['Bunkers',amount('fuel')],['Ports',amount('ports')],['Other',amount('other')],['Total',b.total]].map(([k,v])=>`<tr><td>${k}</td><td>${fmt(v,2)} USD</td></tr>`).join('')}</tbody></table></div><div><h3>Freight estimate</h3><table class="totals"><tbody>${[['Gross freight',b.gross],['Commission',b.commission],['Net income',b.net],['TCE before hire, USD/day',b.tce],['P&L after hire, USD',b.pnl],['Freight required to cover model cost, USD/t',b.requiredFreightQuote]].map(([k,v])=>`<tr><td>${k}</td><td>${fmt(v,2)}</td></tr>`).join('')}</tbody></table></div></div>`;}
html+=`${ship.errors.length||ship.remaining.some(x=>x.quantity===null||Math.abs(x.quantity)>.01)?'<p class="notice">The cargo plan is incomplete or exceeds limits. The financial result does not confirm voyage feasibility.</p>':''}</section><section><div class="heading"><h2>5. Cost by sale</h2>${select('allocation','Allocation method',[['route','By legs and ports'],['tonnage','Entire budget by tonnage']])}</div>${b?table(['Sale','Port','Tonnage','Allocated, USD','USD/t'],b.allocation.map(a=>{const l=state.lots.find(l=>l.id===a.id);return `<tr><td class="name"><span class="tag" style="background:${l.color}"></span>${esc(l.name)}</td><td>${esc(l.port)}</td><td>${fmt(a.quantity,1)}</td><td>${fmt(a.cents/100,2)}</td><td>${fmt(a.cents/100/a.quantity,2)}</td></tr>`;})):'<p class="empty">Allocation appears after the voyage calculation is complete.</p>'}${String(state.notes||'').trim()?`<details id="notes"><summary>Calculation sources and notes</summary><textarea data-path="notes" aria-label="Calculation sources" placeholder="Enter sources and dates for distances, PDA, rates, SF and vessel data">${esc(state.notes)}</textarea></details>`:''}</section>`;
$('app').innerHTML=html;plannerUI.animate(motion);open.forEach(id=>{if($(id))$(id).open=true;});fitMapFrame();}
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
$('app').addEventListener('toggle',e=>{
 if(e.target.id==='voyage-map'&&e.target.open)fitMapFrame();
},true);
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
$('app').addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;if(plannerUI.action(el.dataset.action,el))return;switch(el.dataset.action){case'open-sale':openSale(el.dataset.id);return;case'new-sale':showSaleDialog();return;
 case'map-zoom':zoomMap(Number(el.dataset.factor));return;
 case'map-reset':resetMap();return;case'new-port':state.portRecords.push({id:'P'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),name:'',country:'',terminal:'',berth:'Berth 1',notes:'',da:null,...Object.fromEntries(M.PORT_LIMIT_FIELDS.map(k=>[k,null]))});break;case'remove-sale':{const sale=state.sales[Number(el.dataset.index)];if(state.lots.some(l=>l.saleId===sale.id)){$('status').textContent='First remove the sale from PLANNER';return;}state.sales.splice(Number(el.dataset.index),1);break;}case'remove-port-record':try{M.removePortRecord(state,Number(el.dataset.index));}catch(error){$('status').textContent=error.message;return;}break;case'new-vessel':M.addVesselType(state);changed();$('status').textContent='';return;case'new-cargo':showCargoDialog();return;case'apply-cargo':try{M.applyCargo(state,el.dataset.id);changed();$('status').textContent='';}catch(error){$('status').textContent=error.message;}return;case'apply-vessel':try{M.applyVessel(state,el.dataset.id);changed();$('status').textContent='';}catch(error){$('status').textContent=error.message;}return;case'add-lot':showLotDialog();return;case'remove-lot':{const l=state.lots[Number(el.dataset.index)];state.allocations=state.allocations.filter(a=>a.lot!==l.id);state.lots.splice(Number(el.dataset.index),1);break;}case'move-port':M.moveCall(state,el.dataset.port,Number(el.dataset.direction));break;case'calc-intake':state.intakeShownFor=intakeKey();break;case'add-cost':state.costs.push({name:'Additional item',amount:null,days:0,burn:2.7,fuel:'main'});break;case'remove-cost':state.costs.splice(Number(el.dataset.index),1);break;}changed();});
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
function shipmentWindow(sale){
 const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')&&Number.isFinite(Date.parse(value))
  ?new Date(value+'T00:00:00Z').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}):'—';
 if(!sale?.shipmentFrom&&!sale?.shipmentTo)return '—';
 return esc(date(sale.shipmentFrom)+' – '+date(sale.shipmentTo));
}
function openSale(saleId){
 if(!state.sales.some(s=>s.id===saleId))return;
 currentTab='sale';try{sessionStorage.setItem(tabKey,currentTab);}catch{}
 syncWorkspace();render();
 const row=$('sale-row-'+saleId);
 row?.focus({preventScroll:true});row?.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
}
function showLotDialog(){
 const dialog=document.createElement('dialog'),selected=new Set(),added=new Set(state.lots.map(l=>l.saleId));
 dialog.className='sale-picker';dialog.setAttribute('aria-labelledby','sale-picker-title');
 const portOptions=field=>[...new Set(state.sales.map(s=>s[field]).filter(Boolean))].sort().map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('');
 dialog.innerHTML=`<form id="lot-form"><div class="heading"><h2 id="sale-picker-title">Add sales</h2><button type="button" id="close-lot" aria-label="Close">×</button></div><div class="sale-picker-filters"><label class="field sale-search-field">Search<input id="sale-search" type="search" placeholder="Sale number or cargo" autocomplete="off"></label><label class="field">Loading<select id="sale-load"><option value="">All loading ports</option>${portOptions('loadPort')}</select></label><label class="field">Discharge<select id="sale-discharge"><option value="">All discharge ports</option>${portOptions('dischargePort')}</select></label><label class="field">Shipment from<input id="sale-from" type="date"></label><label class="field">Shipment to<input id="sale-to" type="date"></label></div><div id="sale-picker-results" class="sale-picker-results"></div><p id="lot-error" class="error" role="alert"></p><div class="sale-picker-footer"><button type="button" id="sale-clear-filters">Clear filters</button><button type="submit" class="primary" id="sale-add-selected" disabled>Add selected</button></div></form>`;
 document.body.appendChild(dialog);
 const find=selector=>dialog.querySelector(selector),search=find('#sale-search'),load=find('#sale-load'),discharge=find('#sale-discharge'),from=find('#sale-from'),to=find('#sale-to'),results=find('#sale-picker-results'),submit=find('#sale-add-selected'),error=find('#lot-error');
 const updateButton=()=>{submit.disabled=!selected.size||!!(from.value&&to.value&&from.value>to.value);submit.textContent=selected.size?'Add selected ('+selected.size+')':'Add selected';};
 function filter(){
  error.textContent='';to.setCustomValidity('');
  if(from.value&&to.value&&from.value>to.value){error.textContent='Shipment from cannot be later than shipment to.';to.setCustomValidity(error.textContent);results.innerHTML='';updateButton();return;}
  const words=search.value.toLowerCase().trim().split(/\s+/).filter(Boolean),hasDates=!!(from.value||to.value);
  const visible=state.sales.filter(s=>words.every(word=>(s.id+' '+s.cargoName).toLowerCase().includes(word))&&(!load.value||s.loadPort===load.value)&&(!discharge.value||s.dischargePort===discharge.value)&&(!hasDates||(s.shipmentFrom&&s.shipmentTo&&(!from.value||s.shipmentTo>=from.value)&&(!to.value||s.shipmentFrom<=to.value))));
  const selectable=visible.filter(s=>!added.has(s.id));
  const rows=visible.map(s=>`<tr data-sale-id="${esc(s.id)}" class="${added.has(s.id)?'sale-already-added':selected.has(s.id)?'sale-picked':''}"><td>${added.has(s.id)?'<span class="muted">In voyage</span>':`<input type="checkbox" name="saleId" value="${esc(s.id)}" aria-label="Select ${esc(s.id)}" ${selected.has(s.id)?'checked':''}>`}</td><td class="name"><small>${esc(s.id)}</small><br>${esc(s.cargoName)}</td><td>${fmt(s.quantity,1)}</td><td>${esc(s.loadPort)}</td><td>${esc(s.dischargePort)}</td><td class="shipment-window">${shipmentWindow(s)}</td></tr>`);
  results.innerHTML=visible.length?table(['<input type="checkbox" id="sale-select-visible" aria-label="Select all available sales shown">','Sale / cargo','Quantity, MT','Loading','Discharge','Shipment'],rows,'sale-picker-table'):`<p class="empty">${state.sales.length?'No sales match these filters.':'No sales yet. Add a sale in SALE first.'}</p>`;
  const all=find('#sale-select-visible');if(all){const count=selectable.filter(s=>selected.has(s.id)).length;all.disabled=!selectable.length;all.checked=!!count&&count===selectable.length;all.indeterminate=count>0&&count<selectable.length;
   all.onchange=()=>{for(const s of selectable)all.checked?selected.add(s.id):selected.delete(s.id);filter();find('#sale-select-visible')?.focus();};
  }
  updateButton();
 }
 results.addEventListener('change',e=>{if(e.target.name!=='saleId')return;const el=e.target;el.checked?selected.add(el.value):selected.delete(el.value);const value=el.value;filter();[...results.querySelectorAll('input[name="saleId"]')].find(x=>x.value===value)?.focus();});
 search.addEventListener('input',filter);for(const el of [load,discharge,from,to])el.addEventListener('change',filter);
 find('#sale-clear-filters').onclick=()=>{for(const el of [search,load,discharge,from,to])el.value='';filter();search.focus();};
 find('#close-lot').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove());
 find('form').onsubmit=e=>{e.preventDefault();if(!selected.size)return;try{
  // Commit the complete selection together; an invalid sale must not leave a partial addition.
  const candidate=JSON.parse(JSON.stringify(state));for(const s of state.sales.filter(s=>selected.has(s.id)))M.addSaleToPlanner(candidate,s.id);
  state=candidate;dialog.close();changed();
 }catch(err){error.textContent=err.message;}};
 filter();dialog.showModal();search.focus();
}
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
function renderCatalog(){M.ensureCatalogs(state);if(currentTab==='sale'){$('app').innerHTML=`<section><div class="heading"><div><h2>SALE</h2><p class="section-intro">Register of concluded sales for voyage planning.</p></div><button data-action="new-sale">+ Add sale</button></div>${state.sales.length?table(['Deal','Date','Cargo','Volume, MT','Loading','Discharge','Shipment','FOB, USD/MT',''],state.sales.map((s,i)=>`<tr id="${esc('sale-row-'+s.id)}" class="sale-record" tabindex="-1"><td>${esc(s.id)}</td><td>${input('sales.'+i+'.dealDate','Deal date',{type:'date'})}</td><td class="name">${esc(s.cargoName)}</td><td>${input('sales.'+i+'.quantity','Sale quantity',{tonnage:true})}</td><td><div class="port-cell">${select('sales.'+i+'.loadPort','Load port',portNames())}${berthSelect('sales.'+i+'.loadPortId','Load berth',s.loadPort)}</div></td><td><div class="port-cell">${select('sales.'+i+'.dischargePort','Discharge port',portNames())}${berthSelect('sales.'+i+'.dischargePortId','Discharge berth',s.dischargePort)}</div></td><td><div class="date-range">${input('sales.'+i+'.shipmentFrom','Shipment from',{type:'date'})}${input('sales.'+i+'.shipmentTo','Shipment to',{type:'date'})}</div></td><td>${input('sales.'+i+'.fob','Price FOB')}${state.lots.filter(l=>l.saleId===s.id).map(l=>`<button class="inline-action" data-action="edit-passport" data-id="${esc(l.id)}">Shipment source</button>`).join('')}</td><td><button data-action="remove-sale" data-index="${i}" aria-label="Remove sale ${esc(s.id)}">×</button></td></tr>`)):'<div class="empty-state"><strong>No sales yet</strong><span>Add the first deal. Cargo is selected from CARGO only.</span></div>'}<p class="form-note">A sale already added to PLANNER cannot be deleted until it is removed from the voyage.</p></section>`;return;}if(currentTab==='ports'){const limitCols=[['maxDraft','Max draft, m'],['maxBeam','Max beam, m'],['maxLoa','Max LOA, m'],['maxAirDraft','Max air draft, m'],['maxDwt','Max DWT']];$('app').innerHTML=`<section><div class="heading"><div><h2>PORT</h2><p class="section-intro">Port and berth register with published size limits.</p></div><button data-action="new-port">+ Add port</button></div>${table(['Country','Port','Terminal','Berth','Water density, t/m³',...limitCols.map(([,label])=>label),''],state.portRecords.map((p,i)=>`<tr><td>${input('portRecords.'+i+'.country','Country',{type:'text'})}</td><td>${input('portRecords.'+i+'.name','Port name',{type:'text'})}</td><td>${input('portRecords.'+i+'.terminal','Terminal',{type:'text'})}</td><td>${input('portRecords.'+i+'.berth','Berth',{type:'text'})}</td><td>${select('portRecords.'+i+'.waterDensity','Water density for '+(p.name||'new port'),[['','Not entered'],...Array.from({length:31},(_,j)=>{const v=(1+j/1000).toFixed(3);return [Number(v),v+(j===0?' · Fresh':j===25?' · Sea':'')];})])}</td>${limitCols.map(([key,label])=>`<td class="limit-cell">${input('portRecords.'+i+'.'+key,label+' for '+(p.name||'new port'))}</td>`).join('')}<td><button data-action="remove-port-record" data-index="${i}" aria-label="Remove port ${esc(p.name)}">×</button></td></tr>`),'port-table')}</section>`;return;}if(currentTab==='cargo'){$('app').innerHTML=`<section><div class="heading"><div><h2>CARGO</h2><p class="section-intro">Cargo register for creating sales.</p></div><button data-action="new-cargo">+ Add cargo type</button></div><div class="catalog-toolbar"><input id="cargo-search" type="search" aria-label="Search cargo" placeholder="Name, grade, manufacturer" class="catalog-search"><select id="cargo-family" aria-label="Cargo category"><option value="">All categories</option>${[...new Set(state.cargoTypes.filter(c=>M.isBulkCargo(c)&&M.ok(c.sf,true)).map(c=>c.family||'Other cargoes'))].map(f=>`<option>${esc(f)}</option>`).join('')}</select></div>${table(['Cargo','Planning SF, m³/t','IMSBC Group'],state.cargoTypes.map((c,i)=>({c,i})).filter(({c})=>M.isBulkCargo(c)&&M.ok(c.sf,true)).map(({c,i})=>`<tr data-family="${esc(c.family||'Other cargoes')}" data-catalog-name="${esc([c.name,c.aliases,c.producer,c.family].filter(Boolean).join(' ').toLowerCase())}"><td class="cargo-name-cell">${input('cargoTypes.'+i+'.name','Cargo name',{type:'text'})}</td><td class="cargo-sf-cell">${input('cargoTypes.'+i+'.sf','Planning stowage factor',{disabled:!M.isBulkCargo(c)})}</td><td class="cargo-group-cell">${select('cargoTypes.'+i+'.group','IMSBC group',[['',M.isBulkCargo(c)?'Pending':'N/A'],'A','B','C','A & B'])}</td></tr>`))}<p class="form-note">Planning SF is a reference estimate and must be confirmed for the shipment. IMSBC Group must match the exact product.</p></section>`;return;}
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
if(window.addEventListener)window.addEventListener('resize',fitMapFrame);
if(document.addEventListener){document.addEventListener('invalid',e=>{const el=e.target;if(el.setCustomValidity)el.setCustomValidity(el.validity.valueMissing?'Complete this field.':'Enter a valid value for this field.');},true);document.addEventListener('input',e=>{if(e.target.setCustomValidity)e.target.setCustomValidity('');},true);}
window.ProjectXApp={getState:()=>JSON.parse(JSON.stringify(state)),getResult:()=>M.compute(state),getPlanningResult:()=>P.check(state)};ensureLegs();setupChrome();syncWorkspace();render();if(startupMessage)$('status').textContent=startupMessage;
})();
