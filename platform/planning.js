(function(root){
'use strict';
const M=typeof module!=='undefined'&&module.exports?require('./model'):root.ProjectXModel;
const {Rational}=typeof module!=='undefined'&&module.exports?require('./arithmetic'):root.ProjectXArithmetic;
const copy=x=>JSON.parse(JSON.stringify(x)), valid=M.ok, active=s=>s.lots.filter(l=>l.selected);
const exactSum=xs=>xs.reduce((a,x)=>a.add(x),Rational.from(0)).number();
const product=(a,b)=>Rational.from(a).mul(b).number();
const id=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
const SEA_DENSITY=1.025,INTAKE_METHOD='average-vessel-1';
const validDensity=x=>valid(x,true)&&x>=1&&x<=1.03;
function ensure(s){
 s.planning??={};const p=s.planning;p.revision=1;p.compatibility??=[];p.limits??=[];p.reports??=[];p.snapshots??=[];
 p.intakeBasis??={state:'After final loading',source:'',date:'',draftLossSource:'',draftLossCall:'',constantIncludes:'',legacyDraftLoss:s.deductions?.draftLoss===0};
 for(const call of s.ports){call.callId??=id('call');call.planning??={berthId:'',arrival:{},departure:{}};}
 for(const lot of s.lots){lot.passport??={version:1,basis:'reference',source:lot.propertySource||'',date:'',bcsn:'',specification:'',unit:'m3/t',value:lot.sf,history:[]};}
 return p;
}
function events(s){return M.callsOf(s).flatMap(c=>['arrival','departure'].map(phase=>({key:(c.callId||c.name)+':'+phase,call:c,phase,label:(phase==='arrival'?'Arrival · ':'After ')+c.name})));}
function resolveStage(s,stage=s.stage){if(stage==='load')return null;return events(s).find(e=>e.key===stage)||events(s).find(e=>e.phase==='departure'&&e.call.name===stage)||null;}
// Resolving the stage rebuilds the event list and the call names; do it once per stage, not once per parcel.
function stageContext(s,stage=s.stage){
 if(stage==='load')return {all:true};
 const e=resolveStage(s,stage);if(!e)return {none:true};
 const names=M.callsOf(s).map(c=>c.name);
 return {names,i:names.indexOf(e.call.name),phase:e.phase};
}
function onBoardIn(ctx,lot){
 if(ctx.all)return true;if(ctx.none)return false;
 const a=ctx.names.indexOf(lot.loadPort),b=ctx.names.indexOf(lot.port);
 return ctx.phase==='arrival'?a<ctx.i&&b>=ctx.i:a<=ctx.i&&b>ctx.i;
}
const onBoard=(s,lot,stage=s.stage)=>onBoardIn(stageContext(s,stage),lot);
function stageSummary(s,stage=s.stage){
 const lots=active(s),ctx=stageContext(s,stage),byId=new Map(lots.map(l=>[l.id,l]));
 const allocations=s.allocations.filter(a=>byId.has(a.lot)&&onBoardIn(ctx,byId.get(a.lot)));
 const holds=s.holds.map(h=>{const cells=allocations.filter(a=>a.hold===h.id),known=cells.every(a=>valid(a.quantity)&&valid(byId.get(a.lot)?.sf,true));const mass=known?exactSum(cells.map(a=>a.quantity)):null,volume=known?exactSum(cells.map(a=>product(a.quantity,byId.get(a.lot).sf))):null;return {...h,mass,used:volume,fill:volume!==null&&valid(h.volume,true)?volume/h.volume*100:null,cells};});
 const rows=lots.map(l=>{const cells=s.allocations.filter(a=>a.lot===l.id),known=cells.every(a=>valid(a.quantity)),assigned=known?exactSum(cells.map(a=>a.quantity)):null;return {...l,onBoard:onBoardIn(ctx,l)?l.quantity:0,assigned,unassigned:valid(l.quantity)&&assigned!==null?Rational.from(l.quantity).sub(assigned).number():null};});
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
 return clean({model:INTAKE_METHOD,vessel:M.vesselOf(s),lots:active(s),holds:s.holds,allocations:s.allocations,deductions:s.deductions,calls:M.callsOf(s),berths:M.callsOf(s).map(c=>s.portRecords.find(p=>p.id===c.planning?.berthId)||null),intakeBasis:s.planning?.intakeBasis,compatibility:s.planning?.compatibility||[],limits:s.planning?.limits||[],vesselBasis:s.planning?.vesselBasis});
}
const inputKey=s=>JSON.stringify(snapshotInput(s));
const vesselBasisStatus=s=>!s.planning?.vesselBasis?'reference':s.planning.vesselBasis.vesselKey!==JSON.stringify(M.vesselOf(s))?'outdated':s.planning.vesselBasis.kind;
function reportStatus(s){const latest=s.planning?.reports?.at(-1);return !latest?'not-reviewed':latest.inputKey!==inputKey(s)?'outdated':events(s).some(e=>!latest.covered.includes(e.key))?'partial':latest.result;}
function addReport(s,data){ensure(s);if(!data.reference?.trim()||!data.reviewer?.trim()||!data.date)throw Error('Enter report reference, reviewer and date');if(!['accepted','conditional','rejected'].includes(data.result))throw Error('Select report result');const expected=events(s).map(e=>e.key);if(!expected.length)throw Error('Add voyage calls first');if(!data.covered?.length||data.covered.some(k=>!expected.includes(k)))throw Error('Select covered arrival/departure states');s.planning.reports.push({...data,id:id('review'),inputKey:inputKey(s),createdAt:new Date().toISOString()});}
function freeze(s){ensure(s);const item={id:id('snapshot'),createdAt:new Date().toISOString(),input:snapshotInput(s),check:check(s)};s.planning.snapshots.push(item);return item;}
// Automatic preliminary TPC estimate from existing voyage and registry data.
function autoDraftLoss(s){
 ensure(s);const v=M.vesselOf(s),lots=active(s),calls=M.callsOf(s),warnings=[],rows=[];
 const incomplete=reason=>({method:INTAKE_METHOD,loss:null,reason,rows,warnings});
 if(!lots.length)return incomplete('Add cargo to the voyage');
 if(!valid(v?.dwt,true)||!valid(v?.draft,true)||!valid(v?.tpc,true))return incomplete('Enter vessel DWT, draft and TPC in VESSEL');
 if(!lots.every(l=>valid(l.quantity,true)))return incomplete('Complete selected cargo quantities');
 if(!STORES.every(k=>valid(s.deductions?.[k])))return incomplete('Complete fuel, fresh water, ballast and constant');
 const names=calls.map(c=>c.name);
 if(lots.some(l=>!names.includes(l.loadPort)||!names.includes(l.port)||names.indexOf(l.loadPort)>=names.indexOf(l.port))||lots.some(l=>lots.some(x=>x.port===l.loadPort)))return incomplete('Complete a loading-before-discharge route');
 const quantity=exactSum(lots.map(l=>l.quantity)),stores=exactSum(STORES.map(k=>s.deductions[k])),baseIntake=Rational.from(v.dwt).sub(stores).number();
 for(const [i,c] of calls.entries()){
  const mass=phase=>exactSum(lots.filter(l=>onBoardIn({names,i,phase},l)).map(l=>l.quantity));
  const arrival=mass('arrival'),departure=mass('departure'),onBoard=Math.max(arrival,departure),fraction=onBoard/quantity;
  if(!onBoard)continue;
  const candidates=s.portRecords.filter(p=>p.name===c.name),selected=candidates.find(p=>p.id===c.planning?.berthId);
  if(c.planning?.berthId&&!selected)return incomplete('Select a valid berth for '+c.name);
  const berths=selected?[selected]:candidates;
  if(!berths.length||berths.some(b=>!valid(b.maxDraft,true)))return incomplete('Complete max draft for '+c.name+' in PORT');
  if(berths.some(b=>!validDensity(b.waterDensity)))return incomplete('Select water density (1.000–1.030) for '+c.name+' in PORT');
  if(!selected&&berths.length>1)warnings.push(c.name+': most restrictive estimated berth intake');
  const estimates=berths.map(berth=>{
   // Agreed average-vessel approximation: SW draft and TPC, no lightship/FWA.
   const density=berth.waterDensity,permissible=v.draft*SEA_DENSITY/density,tpcPort=v.tpc*density/SEA_DENSITY;
   const shortfallCm=Math.max(0,product(permissible,100)-product(berth.maxDraft,100)),portLoss=product(shortfallCm,tpcPort);
   const cargoLimit=Rational.from(baseIntake).sub(portLoss).number(),voyageLimit=cargoLimit/fraction;
   const loss=fraction===1?portLoss:Math.max(0,baseIntake-voyageLimit);
   return {call:c.name,berth:berth.id,maxDraft:berth.maxDraft,density,referenceDensity:SEA_DENSITY,permissible,tpcPort,shortfallCm,densityApplied:true,tpc:v.tpc,draft:v.draft,portLoss,loss,cargoLimit,voyageLimit,fraction,onBoard,phase:arrival>=departure?'arrival':'departure'};
  });
  rows.push(estimates.reduce((a,b)=>b.loss>a.loss||b.loss===a.loss&&b.maxDraft<a.maxDraft?b:a));
 }
 if(!rows.length)return incomplete('Add voyage ports');
 const limiting=rows.reduce((a,b)=>b.loss>a.loss||b.loss===a.loss&&b.maxDraft<a.maxDraft?b:a);
 const reason=limiting.loss>0?'Average-vessel estimate · '+limiting.call+' · '+limiting.maxDraft+' m':'No draft restriction on the estimated cargo mix';
 return {method:INTAKE_METHOD,loss:limiting.loss,limiting,rows,warnings,reason,baseIntake,quantity,stores};
}
function syncAutoDraftLoss(s){const r=autoDraftLoss(s);if(!s.planning.autoDraftLoss)s.planning.previousDraftLoss=s.deductions.draftLoss;s.deductions.draftLoss=r.loss;s.planning.autoDraftLoss=r;return r;}
// Draft at every voyage state from that state's own displacement.
// Mean draft only: no MCTC or LCF is held, so aft and forward follow the entered trim about amidships.
const STORES=['fuel','water','ballast','constant'];
const stateKey=(call,phase)=>(call.callId||call.name)+':'+phase;
// Bunkers on board at each state, chained from the intake figure through the voyage consumption.
function bunkerRob(s,budget){
 const rob=new Map();if(!budget||!valid(s.deductions?.fuel))return rob;
 const calls=M.callsOf(s),lots=active(s);
 const anchorCall=[...calls].reverse().find(c=>lots.some(l=>l.loadPort===c.name));
 if(!anchorCall)return rob;
 const order=calls.flatMap(c=>['arrival','departure'].map(phase=>({call:c,phase})));
 const anchor=order.findIndex(x=>x.call===anchorCall&&x.phase==='departure');
 if(anchor<0)return rob;
 const portBurn=c=>{const p=budget.ports.find(p=>p.name===c.name),parts=[p?.massMain,p?.massAux,p?.massBoiler];return parts.every(x=>valid(x))?exactSum(parts):null;};
 const legBurn=(from,to)=>{const l=budget.legs.find(l=>l.from===from.name&&l.to===to.name),parts=[l?.massMain,l?.massEca,l?.massAux];return parts.every(x=>valid(x))?exactSum(parts):null;};
 // Between order[i] and order[i+1] lies the port stay when i is an arrival, otherwise the sea leg.
 const burnAfter=i=>order[i].phase==='arrival'?portBurn(order[i].call):legBurn(order[i].call,order[i+1].call);
 rob.set(stateKey(anchorCall,'departure'),s.deductions.fuel);
 let value=s.deductions.fuel;
 for(let i=anchor;i<order.length-1;i++){const burn=burnAfter(i);if(burn===null)break;value=Rational.from(value).sub(burn).number();rob.set(stateKey(order[i+1].call,order[i+1].phase),value);}
 value=s.deductions.fuel;
 for(let i=anchor;i>0;i--){const burn=burnAfter(i-1);if(burn===null)break;value=Rational.from(value).add(burn).number();rob.set(stateKey(order[i-1].call,order[i-1].phase),value);}
 return rob;
}
function stateDrafts(s,budget,summaries){
 ensure(s);const v=M.vesselOf(s),b=s.planning.vesselBasis||{},current=vesselBasisStatus(s)!=='outdated';
 const referenceDensity=SEA_DENSITY;
 const lightship=current&&valid(b.lightship,true)?b.lightship:null;
 const rob=bunkerRob(s,budget===undefined?M.compute(s).budget:budget);
 const hydrostatics=valid(v?.draft,true)&&valid(v?.dwt,true)&&valid(v?.tpc,true);
 return events(s).map(e=>{
  const d=e.call.planning?.[e.phase]||{},missing=[],notes=[],cargo=(summaries?.get(e.key)||stageSummary(s,e.key)).quantity;
  const stores={},storeBasis={};
  for(const k of STORES){
   if(valid(d[k])){stores[k]=d[k];storeBasis[k]='state';}
   else if(k==='fuel'&&rob.has(e.key)){stores[k]=rob.get(e.key);storeBasis[k]='voyage';}
   else if(valid(s.deductions?.[k])){stores[k]=s.deductions[k];storeBasis[k]='intake';}
   else{stores[k]=null;storeBasis[k]='missing';}
  }
  const absent=STORES.filter(k=>stores[k]===null);
  if(cargo===null)missing.push('Complete the cargo plan');
  if(absent.length)missing.push('Enter '+absent.join(', ')+' for this state or in Deductions');
  if(!hydrostatics)missing.push('Enter vessel draft, DWT and TPC in VESSEL');
  if(stores.fuel!==null&&stores.fuel<0)notes.push('Chained bunkers run out before this state');
  const deadweight=cargo!==null&&!absent.length?exactSum([cargo,...STORES.map(k=>stores[k])]):null;
  const berth=s.portRecords.find(p=>p.id===e.call.planning?.berthId&&p.name===e.call.name);
  const density=berth?.waterDensity??null;
  let meanRef=null,mean=null,sinkageCm=null,densityApplied=false;
  if(deadweight!==null&&hydrostatics){
   // Immersion from the load-line reference: every tonne short of reference DWT lifts the hull by 1/TPC cm.
   meanRef=v.draft-(v.dwt-deadweight)/(100*v.tpc);mean=meanRef;
   if(validDensity(density)){
    mean=meanRef*referenceDensity/density;sinkageCm=(mean-meanRef)*100;densityApplied=true;
   }else {mean=null;missing.push(berth?'Select berth water density':'Select a berth to estimate port draft');}
   notes.push('Average-vessel estimate · SW draft scaled by 1.025 / port density');
  }
  const deltaCm=mean===null?null:product(mean-v.draft,100);
  const inRange=deltaCm!==null&&valid(b.tpcRangeCm,true)&&Math.abs(deltaCm)<=b.tpcRangeCm&&!!b.tpcSource;
  if(mean!==null&&!inRange)notes.push('TPC extrapolated '+deltaCm.toFixed(0)+' cm from the reference draft');
  const trim=Number.isFinite(d.trim)?d.trim:null;
  const computed=mean===null?null:{aft:mean+(trim??0)/2,mid:mean,fwd:mean-(trim??0)/2};
  const surveyed=['aft','mid','fwd'].map(k=>d[k]).filter(x=>valid(x,true));
  // Measured drafts govern the berth check; the computed state draft fills the usual gap.
  const basis=surveyed.length?'surveyed':valid(d.draft,true)?'entered':computed?'computed':'unavailable';
  const deepest=basis==='surveyed'?Math.max(...surveyed):basis==='entered'?d.draft:basis==='computed'?Math.max(computed.aft,computed.mid,computed.fwd):null;
  return {key:e.key,label:e.label,call:e.call.name,callId:e.call.callId||null,phase:e.phase,cargo,stores,storeBasis,deadweight,
   displacement:deadweight===null||lightship===null?null:exactSum([lightship,deadweight]),
   density,densityApplied,meanRef,sinkageCm,mean,trim,computed,surveyed:surveyed.length?{aft:d.aft??null,mid:d.mid??null,fwd:d.fwd??null}:null,
   basis,trimBasis:trim===null?'even-keel':'entered',deepest,maxDraft:berth?.maxDraft??null,
   margin:deepest===null||!valid(berth?.maxDraft,true)?null:berth.maxDraft-deepest,
   deltaCm,inRange,missing,notes};
 });
}
function limitsAt(s,key){return (s.planning?.limits||[]).filter(l=>l.stage===key&&l.source?.trim()&&valid(l.max,true));}
function stateCheck(s,event,drafts,summaries){
 const data=event.call.planning?.[event.phase]||{},stage=summaries?.get(event.key)||stageSummary(s,event.key),issues=[],missing=[];
 const keys=['fuel','water','ballast','constant'],nonCargo=keys.every(k=>valid(data[k]))?exactSum(keys.map(k=>data[k])):null;
 const mode=data.mode||'dwt',allowable=mode==='displacement'?(valid(data.displacement,true)&&valid(s.planning?.vesselBasis?.lightship,true)&&vesselBasisStatus(s)!=='outdated'?data.displacement-s.planning.vesselBasis.lightship:null):(valid(data.allowableDwt,true)?data.allowableDwt:null);
 const limit=allowable!==null&&nonCargo!==null?allowable-nonCargo:null;
 if(limit===null)missing.push('Enter allowed mass and all four non-cargo masses');
 if(!data.source?.trim()||!data.date)missing.push('State source and date');
 if(data.plannedAt&&!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(data.plannedAt))issues.push('Event time needs an explicit UTC offset');
 if(limit!==null&&stage.quantity!==null&&stage.quantity>limit+1e-7)issues.push('Cargo exceeds state limit by '+(stage.quantity-limit).toFixed(3)+' t');
 const berth=s.portRecords.find(p=>p.id===event.call.planning?.berthId),v=M.vesselOf(s);
 // Measured drafts govern; otherwise the state draft is computed from this state's own displacement.
 const draft=(drafts||stateDrafts(s)).find(r=>r.key===event.key)||null;
 const governingDraft=draft?.deepest??null;
 if(draft&&draft.basis==='unavailable')missing.push(...draft.missing);
 if(!berth)missing.push('Select a berth');else{
  const pairs=[['maxLoa',v?.loa,'LOA'],['maxBeam',v?.beam,'Beam'],['maxDwt',v?.dwt,'Vessel DWT'],['maxDraft',governingDraft,draft?.basis==='computed'?'Computed state draft':'State draft'],['maxAirDraft',data.airDraft,'State air draft']];
  // The comparison stays exact; a calculated draft is quoted to the millimetre rather than to fifteen decimals.
  for(const [k,n,label] of pairs){if(!valid(berth[k],true)||!valid(n))missing.push(label+' comparison unavailable');else if(n>berth[k])issues.push(label+' '+Number(n.toFixed(3))+' exceeds '+berth[k]);}
 }
 for(const rule of limitsAt(s,event.key)){const ids=rule.holds||[],h=stage.holds.filter(h=>ids.includes(h.id));if(h.length!==ids.length||h.some(h=>h.mass===null))missing.push('Invalid hold mass limit');else if(exactSum(h.map(h=>h.mass))>rule.max+1e-7)issues.push('Hold '+ids.join(' + ')+' mass exceeds '+rule.max+' t');}
 return {key:event.key,label:event.label,quantity:stage.quantity,nonCargo,limit,margin:limit!==null&&stage.quantity!==null?limit-stage.quantity:null,draft,issues,missing:[...new Set(missing)],status:issues.length?'exceeded':missing.length?'incomplete':'within-entered-limits'};
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
function check(s,budget){
 const errors=[],warnings=[],lots=active(s),base=M.stowage(s),summary=stageSummary(s,'load');errors.push(...base.errors);
 if(!lots.length)warnings.push('Select a sale');
 // One call, one berth: sales that disagree are reported rather than silently averaged.
 for(const call of M.callsOf(s)){const ids=M.berthsAt(s,call);if(ids.length>1)warnings.push(call.name+': sales name different berths in SALE; the first is used');}
 const names=M.callsOf(s).map(c=>c.name);for(const l of lots){if(!names.includes(l.loadPort)||!names.includes(l.port)||names.indexOf(l.loadPort)>=names.indexOf(l.port))errors.push(l.id+': loading must precede discharge');if(!l.passport?.source||l.passport.basis!=='declared')warnings.push(l.id+': shipment properties are not declared');}
 if(lots.some(l=>lots.some(other=>other.port===l.loadPort)))errors.push('Mixed loading/discharge calls require a separate operation sequence');
 const ev=events(s);
 // One summary per state, shared by the draft calculation and the state check instead of one each.
 const summaries=new Map(ev.map(e=>[e.key,stageSummary(s,e.key)]));
 const drafts=stateDrafts(s,budget,summaries),states=ev.map(e=>stateCheck(s,e,drafts,summaries));
 for(const row of drafts.filter(r=>r.stores.fuel!==null&&r.stores.fuel<0))warnings.push(row.label+': chained bunkers run out before this state');
 let last=null;for(const e of ev){const value=e.call.planning?.[e.phase]?.plannedAt;if(value){const t=Date.parse(value);if(!Number.isFinite(t))errors.push(e.label+': invalid event time');else {if(last!==null&&t<last)errors.push(e.label+': event precedes the previous event');last=t;}}
 if(e.phase==='departure'&&value)for(const l of lots.filter(l=>l.loadPort===e.call.name)){const sale=s.sales.find(x=>x.id===l.saleId),d=value.slice(0,10);if(sale?.shipmentFrom&&d<sale.shipmentFrom||sale?.shipmentTo&&d>sale.shipmentTo)warnings.push(l.id+': planned loading departure is outside the sale shipment window');}}
 for(const l of lots){const sale=s.sales.find(x=>x.id===l.saleId);if(sale&&l.quantity>sale.quantity+1e-7)errors.push(l.id+': planned quantity exceeds the current sale');}
 for(const st of states)errors.push(...st.issues.map(x=>st.label+': '+x));
 for(const rule of limitsAt(s,'load')){const h=summary.holds.filter(h=>rule.holds.includes(h.id));if(h.length!==rule.holds.length||h.some(h=>h.mass===null))errors.push('Invalid hold limit');else if(exactSum(h.map(h=>h.mass))>rule.max+1e-7)errors.push('Loading plan · hold '+rule.holds.join(' + ')+': mass limit exceeded');}
 for(const item of pairIssues(s,summary))(item.level==='error'?errors:warnings).push(item.text);
 const unassigned=summary.rows.some(l=>l.unassigned===null||Math.abs(l.unassigned)>1e-7);
 return {errors:[...new Set(errors)],warnings:[...new Set(warnings)],states,drafts,unassigned,technical:reportStatus(s),status:errors.length?'exceeded':unassigned?'unassigned':'volume-allocated'};
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
const api={INTAKE_METHOD,autoDraftLoss,syncAutoDraftLoss,stateDrafts,bunkerRob,ensure,events,resolveStage,onBoard,stageSummary,grain,sfValue,updatePassport,inputKey,snapshotInput,vesselBasisStatus,addReport,reportStatus,freeze,stateCheck,check,solve,applyPlan,undo,exactSum,product};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXPlanning=api;
})(globalThis);
