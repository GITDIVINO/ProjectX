(function(root){
'use strict';
const M=typeof module!=='undefined'&&module.exports?require('./model'):root.ProjectXModel;
const {Rational}=typeof module!=='undefined'&&module.exports?require('./arithmetic'):root.ProjectXArithmetic;
const copy=x=>JSON.parse(JSON.stringify(x)), valid=M.ok, active=s=>s.lots.filter(l=>l.selected);
const exactSum=xs=>xs.reduce((a,x)=>a.add(x),Rational.from(0)).number();
const product=(a,b)=>Rational.from(a).mul(b).number();
const id=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
function ensure(s){
 s.planning??={};const p=s.planning;p.revision=1;p.compatibility??=[];p.limits??=[];p.reports??=[];p.snapshots??=[];
 p.intakeBasis??={state:'After final loading',source:'',date:'',draftLossSource:'',draftLossCall:'',constantIncludes:'',legacyDraftLoss:s.deductions?.draftLoss===0};
 for(const call of s.ports){call.callId??=id('call');call.planning??={berthId:'',arrival:{},departure:{}};}
 for(const lot of s.lots){lot.passport??={version:1,basis:'reference',source:lot.propertySource||'',date:'',bcsn:'',specification:'',unit:'m3/t',value:lot.sf,history:[]};}
 return p;
}
function events(s){return M.callsOf(s).flatMap(c=>['arrival','departure'].map(phase=>({key:(c.callId||c.name)+':'+phase,call:c,phase,label:(phase==='arrival'?'Arrival · ':'After ')+c.name})));}
function resolveStage(s,stage=s.stage){if(stage==='load')return null;return events(s).find(e=>e.key===stage)||events(s).find(e=>e.phase==='departure'&&e.call.name===stage)||null;}
function onBoard(s,lot,stage=s.stage){if(stage==='load')return true;const e=resolveStage(s,stage);if(!e)return false;const names=M.callsOf(s).map(c=>c.name),i=names.indexOf(e.call.name),a=names.indexOf(lot.loadPort),b=names.indexOf(lot.port);return e.phase==='arrival'?a<i&&b>=i:a<=i&&b>i;}
function stageSummary(s,stage=s.stage){
 const lots=active(s),allocations=s.allocations.filter(a=>lots.some(l=>l.id===a.lot)&&onBoard(s,lots.find(l=>l.id===a.lot),stage));
 const holds=s.holds.map(h=>{const cells=allocations.filter(a=>a.hold===h.id),known=cells.every(a=>valid(a.quantity)&&valid(lots.find(l=>l.id===a.lot)?.sf,true));const mass=known?exactSum(cells.map(a=>a.quantity)):null,volume=known?exactSum(cells.map(a=>product(a.quantity,lots.find(l=>l.id===a.lot).sf))):null;return {...h,mass,used:volume,fill:volume!==null&&valid(h.volume,true)?volume/h.volume*100:null,cells};});
 const rows=lots.map(l=>{const cells=s.allocations.filter(a=>a.lot===l.id),known=cells.every(a=>valid(a.quantity)),assigned=known?exactSum(cells.map(a=>a.quantity)):null;return {...l,onBoard:onBoard(s,l,stage)?l.quantity:0,assigned,unassigned:valid(l.quantity)&&assigned!==null?Rational.from(l.quantity).sub(assigned).number():null};});
 return {stage,allocations,holds,rows,quantity:rows.every(l=>valid(l.onBoard))?exactSum(rows.map(l=>l.onBoard)):null};
}
function grain(s){const total=s.holds.length&&s.holds.every(h=>valid(h.volume,true))?exactSum(s.holds.map(h=>h.volume)):null,declared=M.vesselOf(s)?.grain??null;return {total,declared,difference:total!==null&&valid(declared)?Rational.from(total).sub(declared).number():null};}
function sfValue(value,unit){if(!valid(value,true))throw Error('Enter a positive SF or bulk density');const factors={'m3/t':1,'ft3/metric-ton':.028316846592,'ft3/long-ton':.028316846592/1.0160469088,'ft3/short-ton':.028316846592/.90718474};if(unit==='kg/m3')return 1000/value;if(!(unit in factors))throw Error('Select an explicit SF unit');return value*factors[unit];}
function updatePassport(s,lotId,data){
 const l=s.lots.find(l=>l.id===lotId);if(!l)throw Error('Sale is no longer in this voyage');
 const sf=sfValue(data.value,data.unit);if(!['reference','declared','density-estimate'].includes(data.basis))throw Error('Select the source basis');
 if(data.basis==='declared'&&(!data.source?.trim()||!data.date||!data.bcsn?.trim()))throw Error('Declared shipment properties need a source, date and BCSN');
 if(data.unit==='kg/m3'&&data.basis!=='density-estimate')throw Error('Bulk density produces an estimate; select Estimated from density');
 if(data.minSf!==null&&!valid(data.minSf,true)||data.maxSf!==null&&!valid(data.maxSf,true))throw Error('SF range must be positive or empty');
 if(data.minSf!==null&&data.maxSf!==null&&data.minSf>data.maxSf)throw Error('SF range is reversed');
 if(data.minSf!==null&&sf<data.minSf||data.maxSf!==null&&sf>data.maxSf)throw Error('Selected SF is outside the entered range');
 if(!['','A','B','C','A & B'].includes(data.group))throw Error('Invalid cargo group');
 const sale=s.sales.find(x=>x.id===l.saleId);
 if(data.plannedQuantity!==undefined){
  if(!valid(data.plannedQuantity,true)||!sale)throw Error('Enter a positive planned quantity');
  if(data.plannedQuantity!==sale.quantity&&(!data.quantitySource?.trim()||!data.splitAllowed))throw Error('A changed quantity needs permission to split / vary and its source');
  if(data.plannedQuantity>sale.quantity)throw Error('Planned quantity exceeds the sale');
  if(data.minQuantity!==null&&data.minQuantity!==undefined&&(!valid(data.minQuantity)||data.plannedQuantity<data.minQuantity)||data.maxQuantity!==null&&data.maxQuantity!==undefined&&(!valid(data.maxQuantity,true)||data.plannedQuantity>data.maxQuantity))throw Error('Planned quantity is outside the permitted range');
 }
 ensure(s);const prev=copy(l.passport);delete prev.history;
 l.passport={...data,version:l.passport.version+1,history:[...l.passport.history,prev],updatedAt:new Date().toISOString()};l.sf=sf;l.sfBasis=data.basis;l.group=data.group;l.hazardClass=data.hazardClass||'';l.un=data.un||'';if(data.plannedQuantity!==undefined){l.plannedQuantity=data.plannedQuantity;l.quantity=data.plannedQuantity;}
}
function snapshotInput(s){
 const clean=x=>{if(Array.isArray(x))return x.map(clean);if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,clean(x[k])]));return x;};
 return clean({model:'planning-1',vessel:M.vesselOf(s),lots:active(s),holds:s.holds,allocations:s.allocations,deductions:s.deductions,calls:M.callsOf(s),berths:M.callsOf(s).map(c=>s.portRecords.find(p=>p.id===c.planning?.berthId)||null),intakeBasis:s.planning?.intakeBasis,compatibility:s.planning?.compatibility||[],limits:s.planning?.limits||[],vesselBasis:s.planning?.vesselBasis});
}
const inputKey=s=>JSON.stringify(snapshotInput(s));
const vesselBasisStatus=s=>!s.planning?.vesselBasis?'reference':s.planning.vesselBasis.vesselKey!==JSON.stringify(M.vesselOf(s))?'outdated':s.planning.vesselBasis.kind;
function reportStatus(s){const latest=s.planning?.reports?.at(-1);return !latest?'not-reviewed':latest.inputKey!==inputKey(s)?'outdated':events(s).some(e=>!latest.covered.includes(e.key))?'partial':latest.result;}
function addReport(s,data){ensure(s);if(!data.reference?.trim()||!data.reviewer?.trim()||!data.date)throw Error('Enter report reference, reviewer and date');if(!['accepted','conditional','rejected'].includes(data.result))throw Error('Select report result');const expected=events(s).map(e=>e.key);if(!expected.length)throw Error('Add voyage calls first');if(!data.covered?.length||data.covered.some(k=>!expected.includes(k)))throw Error('Select covered arrival/departure states');s.planning.reports.push({...data,id:id('review'),inputKey:inputKey(s),createdAt:new Date().toISOString()});}
function freeze(s){ensure(s);const item={id:id('snapshot'),createdAt:new Date().toISOString(),input:snapshotInput(s),check:check(s)};s.planning.snapshots.push(item);return item;}
// Automatic preliminary TPC estimate from existing voyage and registry data.
function autoDraftLoss(s){
 ensure(s);const v=M.vesselOf(s),lots=active(s),calls=M.callsOf(s),warnings=[],rows=[];
 if(!lots.length)return {loss:null,reason:'Add cargo to the voyage',rows,warnings};
 if(!valid(v?.draft,true)||!valid(v?.tpc,true))return {loss:null,reason:'Enter vessel draft and TPC in VESSEL',rows,warnings};
 const loadCalls=calls.filter(c=>lots.some(l=>l.loadPort===c.name)),firstDischarge=calls.find(c=>lots.some(l=>l.port===c.name));
 const relevant=[...loadCalls,...(firstDischarge&&!loadCalls.includes(firstDischarge)?[firstDischarge]:[])];
 for(const c of relevant){const candidates=s.portRecords.filter(p=>p.name===c.name),selected=candidates.find(p=>p.id===c.planning?.berthId);
 // Without a nominated berth use the conservative registered draft, not an assumed best berth.
 const berth=selected||candidates.filter(p=>valid(p.maxDraft,true)).sort((a,b)=>a.maxDraft-b.maxDraft)[0];
 if(!berth||(!selected&&candidates.some(p=>!valid(p.maxDraft,true))))return {loss:null,reason:'Complete max draft for '+c.name+' in PORT',rows,warnings};
 if(!valid(berth.maxDraft,true))return {loss:null,reason:'Complete max draft for '+c.name+' in PORT',rows,warnings};
 if(!selected&&candidates.length>1)warnings.push(c.name+': lowest registered berth limit');
 let loss=Math.max(0,product(product(v.draft-berth.maxDraft,100),v.tpc));
 const density=berth.waterDensity,b=s.planning.vesselBasis||{},referenceDensity=vesselBasisStatus(s)!=='outdated'&&valid(b.density,true)?b.density:1.025,lightship=valid(b.lightship,true)&&vesselBasisStatus(s)!=='outdated'?b.lightship:null;
 if(valid(density,true)&&density!==referenceDensity){if(lightship!==null&&valid(v.dwt,true)){const displacement=(lightship+v.dwt+100*(berth.maxDraft-v.draft)*v.tpc)*density/referenceDensity;loss=Math.max(0,v.dwt-(displacement-lightship));}else warnings.push(c.name+': density correction unavailable without lightship; reference-density estimate');}
 else if(!valid(density,true))warnings.push(c.name+': density unknown; reference-density estimate');
 rows.push({call:c.name,berth:berth.id,maxDraft:berth.maxDraft,density:density??null,loss});
 }
 if(!rows.length)return {loss:null,reason:'Add voyage ports',rows,warnings};
 const limiting=rows.reduce((a,b)=>b.loss>a.loss?b:a);return {loss:limiting.loss,limiting,rows,warnings,reason:'TPC estimate · '+limiting.call+' · '+limiting.maxDraft+' m'};
}
function syncAutoDraftLoss(s){const r=autoDraftLoss(s);if(!s.planning.autoDraftLoss)s.planning.previousDraftLoss=s.deductions.draftLoss;s.deductions.draftLoss=r.loss;s.planning.autoDraftLoss=r;return r;}
// Local linear hydrostatic estimate. Reference draft, DWT and TPC share one density/basis.
function draftEstimate(s){
 ensure(s);const v=M.vesselOf(s),b=s.planning.vesselBasis||{},keys=['fuel','water','ballast','constant'],total=active(s).every(l=>valid(l.quantity,true))?exactSum(active(s).map(l=>l.quantity)):null;
 const referenceMass=keys.every(k=>valid(s.deductions[k]))?exactSum(keys.map(k=>s.deductions[k])):null;
 const rows=events(s).map(e=>{const berth=s.portRecords.find(p=>p.id===e.call.planning?.berthId&&p.name===e.call.name),d=e.call.planning?.[e.phase]||{},missing=[],q=stageSummary(s,e.key).quantity;
 if(!berth)missing.push('Select berth in Berth / states');
 if(!valid(berth?.maxDraft,true))missing.push('Enter max draft in PORT');
 if(!valid(berth?.waterDensity,true)||berth.waterDensity<1||berth.waterDensity>1.03)missing.push('Select water density in PORT');
 if(!valid(v?.draft,true)||!valid(v?.dwt,true)||!valid(v?.tpc,true))missing.push('Enter reference draft, DWT and TPC');
 if(!valid(b.density,true)||b.density<1||b.density>1.03||!b.source||!b.date||!b.dwtBasis||vesselBasisStatus(s)==='outdated')missing.push('Complete current vessel source, date, load-line basis and reference density');
 const nonCargo=keys.every(k=>valid(d[k]))?exactSum(keys.map(k=>d[k])):null;
 if(nonCargo===null)missing.push('Enter four state non-cargo masses');
 if(!d.source||!d.date)missing.push('Enter state source and date');
 const different=berth?.waterDensity!==b.density;
 if(different&&!valid(b.lightship,true))missing.push('Density correction requires lightship');
 const deltaCm=valid(berth?.maxDraft,true)&&valid(v?.draft,true)?100*(berth.maxDraft-v.draft):null;
 // Port displacement is density-corrected and capped by the reference load-line DWT.
 const allowedDwt=missing.length?null:Math.min(v.dwt,different?((b.lightship+v.dwt+deltaCm*v.tpc)*berth.waterDensity/b.density-b.lightship):v.dwt+deltaCm*v.tpc);
 const cargoLimit=allowedDwt!==null?allowedDwt-nonCargo:null;
 const inRange=deltaCm!==null&&valid(b.tpcRangeCm,true)&&Math.abs(deltaCm)<=b.tpcRangeCm&&!!b.tpcSource;
 return {key:e.key,label:e.label,berth:berth?[berth.name,berth.terminal,berth.berth].filter(Boolean).join(' · '):'',density:berth?.waterDensity??null,maxDraft:berth?.maxDraft??null,deltaCm,allowedDwt,cargoLimit,quantity:q,margin:cargoLimit===null||q===null?null:cargoLimit-q,fullLoad:total>0&&q===total,nonCargo,missing,inRange};});
 const full=rows.filter(r=>r.fullLoad),complete=full.length>0&&referenceMass!==null&&full.every(r=>r.cargoLimit!==null&&r.cargoLimit>=0&&r.inRange);
 const limiting=full.filter(r=>r.cargoLimit!==null).sort((a,b)=>a.cargoLimit-b.cargoLimit)[0]||null;
 const loss=complete?Math.max(0,v.dwt-referenceMass-limiting.cargoLimit):null;
 return {rows,loss,limiting,referenceMass,complete};
}
function applyDraftEstimate(s,expectedKey){if(expectedKey!==inputKey(s))throw Error('Inputs changed; reopen the estimate');const r=draftEstimate(s);if(!r.complete)throw Error('Complete sources and TPC applicability for every full-load state');s.deductions.draftLoss=r.loss;s.planning.intakeBasis.draftLossSource='TPC estimate · '+s.planning.vesselBasis.tpcSource;s.planning.intakeBasis.draftLossCall=r.limiting.label;s.planning.intakeBasis.legacyDraftLoss=false;s.planning.draftEstimate={createdAt:new Date().toISOString(),rows:copy(r.rows),loss:r.loss};s.planning.draftEstimate.inputKey=inputKey(s);return r;}
function limitsAt(s,key){return (s.planning?.limits||[]).filter(l=>l.stage===key&&l.source?.trim()&&valid(l.max,true));}
function stateCheck(s,event){
 const data=event.call.planning?.[event.phase]||{},stage=stageSummary(s,event.key),issues=[],missing=[];
 const keys=['fuel','water','ballast','constant'],nonCargo=keys.every(k=>valid(data[k]))?exactSum(keys.map(k=>data[k])):null;
 const mode=data.mode||'dwt',allowable=mode==='displacement'?(valid(data.displacement,true)&&valid(s.planning?.vesselBasis?.lightship,true)&&vesselBasisStatus(s)!=='outdated'?data.displacement-s.planning.vesselBasis.lightship:null):(valid(data.allowableDwt,true)?data.allowableDwt:null);
 const limit=allowable!==null&&nonCargo!==null?allowable-nonCargo:null;
 if(limit===null)missing.push('Enter allowed mass and all four non-cargo masses');
 if(!data.source?.trim()||!data.date)missing.push('State source and date');
 if(data.plannedAt&&!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(data.plannedAt))issues.push('Event time needs an explicit UTC offset');
 if(limit!==null&&stage.quantity!==null&&stage.quantity>limit+1e-7)issues.push('Cargo exceeds state limit by '+(stage.quantity-limit).toFixed(3)+' t');
 const berth=s.portRecords.find(p=>p.id===event.call.planning?.berthId),v=M.vesselOf(s);
 if(!berth)missing.push('Select a berth');else{
  const pairs=[['maxLoa',v?.loa,'LOA'],['maxBeam',v?.beam,'Beam'],['maxDwt',v?.dwt,'Vessel DWT'],['maxDraft',data.draft,'State draft'],['maxAirDraft',data.airDraft,'State air draft']];
  for(const [k,n,label] of pairs){if(!valid(berth[k],true)||!valid(n))missing.push(label+' comparison unavailable');else if(n>berth[k])issues.push(label+' '+n+' exceeds '+berth[k]);}
 }
 for(const rule of limitsAt(s,event.key)){const ids=rule.holds||[],h=stage.holds.filter(h=>ids.includes(h.id));if(h.length!==ids.length||h.some(h=>h.mass===null))missing.push('Invalid hold mass limit');else if(exactSum(h.map(h=>h.mass))>rule.max+1e-7)issues.push('Hold '+ids.join(' + ')+' mass exceeds '+rule.max+' t');}
 return {key:event.key,label:event.label,quantity:stage.quantity,nonCargo,limit,margin:limit!==null&&stage.quantity!==null?limit-stage.quantity:null,issues,missing,status:issues.length?'exceeded':missing.length?'incomplete':'within-entered-limits'};
}
function pairIssues(s,summary){
 const out=[],lots=active(s),rules=s.planning?.compatibility||[];
 for(let i=0;i<lots.length;i++)for(let j=i+1;j<lots.length;j++){
  const a=lots[i],b=lots[j],ah=summary.holds.filter(h=>h.cells.some(c=>c.lot===a.id&&c.quantity>0)),bh=summary.holds.filter(h=>h.cells.some(c=>c.lot===b.id&&c.quantity>0));if(!ah.length||!bh.length)continue;
  const rule=rules.find(r=>[r.a,r.b].includes(a.id)&&[r.a,r.b].includes(b.id)),same=ah.some(h=>bh.some(g=>g.id===h.id)),adjacent=ah.some(h=>bh.some(g=>Math.abs(s.holds.indexOf(s.holds.find(x=>x.id===h.id))-s.holds.indexOf(s.holds.find(x=>x.id===g.id)))===1));
  if(!rule?.source?.trim()||rule.rule==='unknown'){out.push({level:'unknown',text:a.id+' / '+b.id+': compatibility not established'});continue;}
  if(rule.rule==='separate-holds'&&same||rule.rule==='non-adjacent'&&(same||adjacent))out.push({level:'error',text:a.id+' / '+b.id+': separation requirement violated'});
 }
 return out;
}
function check(s){
 const errors=[],warnings=[],lots=active(s),base=M.stowage(s),summary=stageSummary(s,'load');errors.push(...base.errors);
 if(!s.planning?.autoDraftLoss&&s.planning?.draftEstimate?.inputKey&&s.planning.draftEstimate.inputKey!==inputKey(s))warnings.push('Applied draft loss estimate is outdated; reopen Estimate draft loss');
 if(!lots.length)warnings.push('Select a sale');
 const names=M.callsOf(s).map(c=>c.name);for(const l of lots){if(!names.includes(l.loadPort)||!names.includes(l.port)||names.indexOf(l.loadPort)>=names.indexOf(l.port))errors.push(l.id+': loading must precede discharge');if(!l.passport?.source||l.passport.basis!=='declared')warnings.push(l.id+': shipment properties are not declared');}
 if(lots.some(l=>lots.some(other=>other.port===l.loadPort)))errors.push('Mixed loading/discharge calls require a separate operation sequence');
 const ev=events(s),states=ev.map(e=>stateCheck(s,e));
 let last=null;for(const e of ev){const value=e.call.planning?.[e.phase]?.plannedAt;if(value){const t=Date.parse(value);if(!Number.isFinite(t))errors.push(e.label+': invalid event time');else {if(last!==null&&t<last)errors.push(e.label+': event precedes the previous event');last=t;}}
 if(e.phase==='departure'&&value)for(const l of lots.filter(l=>l.loadPort===e.call.name)){const sale=s.sales.find(x=>x.id===l.saleId),d=value.slice(0,10);if(sale?.shipmentFrom&&d<sale.shipmentFrom||sale?.shipmentTo&&d>sale.shipmentTo)warnings.push(l.id+': planned loading departure is outside the sale shipment window');}}
 for(const l of lots){const sale=s.sales.find(x=>x.id===l.saleId);if(sale&&l.quantity>sale.quantity+1e-7)errors.push(l.id+': planned quantity exceeds the current sale');}
 for(const st of states)errors.push(...st.issues.map(x=>st.label+': '+x));
 for(const rule of limitsAt(s,'load')){const h=summary.holds.filter(h=>rule.holds.includes(h.id));if(h.length!==rule.holds.length||h.some(h=>h.mass===null))errors.push('Invalid hold limit');else if(exactSum(h.map(h=>h.mass))>rule.max+1e-7)errors.push('Loading plan · hold '+rule.holds.join(' + ')+': mass limit exceeded');}
 for(const item of pairIssues(s,summary))(item.level==='error'?errors:warnings).push(item.text);
 const unassigned=summary.rows.some(l=>l.unassigned===null||Math.abs(l.unassigned)>1e-7);
 return {errors:[...new Set(errors)],warnings:[...new Set(warnings)],states,unassigned,technical:reportStatus(s),status:errors.length?'exceeded':unassigned?'unassigned':'volume-allocated'};
}
// Exhaustive assignment of whole holds to parcels (parcels may split across holds).
// Search is bounded and never labels an interrupted search as infeasible.
function solve(s,maxNodes=100000){
 const lots=active(s).slice().sort((a,b)=>String(a.id).localeCompare(String(b.id))),holds=s.holds.slice().sort((a,b)=>a.id-b.id);
 if(!lots.length||lots.some(l=>!valid(l.quantity,true)||!valid(l.sf,true))||holds.some(h=>!valid(h.volume,true)||h.massLimit!==null&&h.massLimit!==undefined&&!valid(h.massLimit,true)))return {status:'missing-inputs',allocations:[],nodes:0};
 const capacities=lots.map(l=>holds.map(h=>Math.min(h.volume/l.sf,h.massLimit??Infinity,...limitsAt(s,'load').filter(r=>r.holds.length===1&&r.holds[0]===h.id).map(r=>r.max))));
 let nodes=0,answer=null,exhausted=false;const owned=holds.map(()=>-1),capacity=lots.map(()=>0);
 function materialize(){const out=[];for(let i=0;i<lots.length;i++){
  const cells=holds.map((h,j)=>({h,j})).filter(x=>owned[x.j]===i),weights=cells.map(x=>capacities[i][x.j]);
  if(!cells.length)return null;
  let portions=null,scale=1000;
  for(let digits=3;digits<=12;digits++,scale*=10){
   const units=Rational.from(lots[i].quantity).mul(scale);if(units.d!==1n||units.n>BigInt(Number.MAX_SAFE_INTEGER))continue;
   const cap=weights.map(w=>{const r=Rational.from(w).mul(scale);return Number(r.n/r.d);});
   if(cap.reduce((a,b)=>a+b,0)<Number(units.n))continue;
   portions=M.splitCents(Number(units.n),weights).map((q,j)=>Math.min(q,cap[j]));
   let left=Number(units.n)-portions.reduce((a,b)=>a+b,0);
   for(let j=0;j<portions.length&&left;j++){const add=Math.min(left,cap[j]-portions[j]);portions[j]+=add;left-=add;}
   if(!left)break;portions=null;
  }
  if(!portions)return null;
  cells.forEach((x,j)=>{if(portions[j])out.push({lot:lots[i].id,hold:x.h.id,quantity:Rational.from(portions[j]).div(scale).number()});});
 }return out;}
 function candidateValid(out){if(!out)return false;const st={...s,allocations:out},stages=['load',...events(s).map(e=>e.key)];for(const stage of stages){const summary=stageSummary(st,stage);if(pairIssues(st,summary).some(x=>x.level==='error'))return false;for(const rule of limitsAt(s,stage)){const h=summary.holds.filter(h=>rule.holds.includes(h.id));if(h.length!==rule.holds.length||exactSum(h.map(h=>h.mass))>rule.max+1e-7)return false;}}return true;}
 function search(j){if(++nodes>maxNodes){exhausted=true;return;}if(lots.every((l,i)=>capacity[i]>=l.quantity-1e-8)){const out=materialize();if(candidateValid(out))answer=out;return;}if(j===holds.length)return;
  if(lots.some((l,i)=>capacity[i]+exactSum(capacities[i].slice(j))<l.quantity-1e-8))return;
  const choices=lots.map((l,i)=>i).filter(i=>capacity[i]<lots[i].quantity-1e-8).sort((a,b)=>(lots[b].quantity-capacity[b])-(lots[a].quantity-capacity[a])||a-b);
  for(const i of [...choices,-1]){owned[j]=i;if(i>=0)capacity[i]+=capacities[i][j];search(j+1);if(i>=0)capacity[i]-=capacities[i][j];if(answer||exhausted)return;}owned[j]=-1;
 }
 // Preserve the useful proportional single-parcel plan over all holds.
 if(lots.length===1&&exactSum(capacities[0])>=lots[0].quantity-1e-8){owned.fill(0);const out=materialize();if(candidateValid(out))answer=out;owned.fill(-1);}
 if(!answer)search(0);
 return {status:answer?'feasible':exhausted?'search-limit':'no-solution-in-search-model',allocations:answer||[],nodes,scope:'Separate holds per parcel; proportional split within assigned holds. Volume and entered mass/separation constraints only.'};
}
function applyPlan(s,result){if(result.status!=='feasible')throw Error('No complete plan to apply');ensure(s);s.planning.undo={allocations:copy(s.allocations),basis:planBasis(s)};s.allocations=copy(result.allocations);s.stage='load';}
const planBasis=s=>JSON.stringify({lots:active(s).map(l=>({id:l.id,q:l.quantity,sf:l.sf})),holds:s.holds});
function undo(s){if(!s.planning?.undo)throw Error('No previous plan');if(s.planning.undo.basis!==planBasis(s))throw Error('Cargo or holds changed; the previous plan cannot be restored automatically');s.allocations=copy(s.planning.undo.allocations);delete s.planning.undo;s.stage='load';}
const api={autoDraftLoss,syncAutoDraftLoss,draftEstimate,applyDraftEstimate,ensure,events,resolveStage,onBoard,stageSummary,grain,sfValue,updatePassport,inputKey,snapshotInput,vesselBasisStatus,addReport,reportStatus,freeze,stateCheck,check,solve,applyPlan,undo,exactSum,product};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXPlanning=api;
})(globalThis);
