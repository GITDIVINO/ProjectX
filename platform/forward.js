(function(root){
'use strict';
// The forward margin matrix: for each destination and each month, what a tonne leaves once
// the cost of delivering it is off.
//
//   margin(cargo, destination, month) = assessment(cargo, destination, month) − cost per tonne
//
// The assessment is a market figure and is entered with its source and date, like every other
// figure in this tool. The cost is not taken from an index: it is computed by the same engine
// that costs a real voyage, on a single-parcel reference voyage to that destination. That is
// the whole point — an exporter that costs its own delivery precisely sees a netback that
// somebody reading freight off an index cannot.
//
// What this does NOT do: vary hire and bunker prices by month. The cost of every cell is on
// the assumptions of the calculation that is open, and the screen says so. A month-by-month
// freight curve is the next step, and FAOX already holds one.

function create(env){
 const {M,Sea,getState}=env;
 const state=getState;
 const ok=M.ok;

 // ---- assessments ------------------------------------------------------------------------

 // A month is a month, not a date: an assessment is for October, not for the 3rd of October.
 const MONTH=/^\d{4}-(0[1-9]|1[0-2])$/;
 const isMonth=value=>typeof value==='string'&&MONTH.test(value);

 const assessments=()=>state().priceAssessments||[];

 // The assessment that applies: the one for that cargo, that destination and that month.
 // Nothing is interpolated between months and nothing is carried over from a neighbour — an
 // absent assessment is absent, and the cell says so.
 const assessmentFor=(cargoId,destination,month)=>
  assessments().find(a=>a.cargoId===cargoId&&a.destination===destination&&a.month===month)||null;

 // ---- assumptions ------------------------------------------------------------------------

 // A reference handling rate and disbursement are what the cost of a hypothetical voyage
 // needs, and they are assumptions, not register facts. They deliberately do not live in
 // PORTS: decision D-018 keeps that register to terminals and published limits, and the
 // disbursement of an actual call stays in the calculation that makes it. Here they are
 // labelled as what they are, so nobody reads a matrix figure as a confirmed berth cost.
 //
 // They are a list and not an object keyed by port name, because the screen addresses a field
 // by a dotted path and "St. Petersburg" carries a full stop of its own.
 const assumptions=()=>state().forward||{};
 const portAssumptions=()=>{const list=assumptions().ports;return Array.isArray(list)?list:[];};
 const portAssumption=name=>portAssumptions().find(p=>p&&p.name===name)||{};

 // The assumptions a screen is about to ask for. A port is added with nothing stated rather
 // than with a plausible figure, and one that stops being compared keeps the rate somebody
 // entered for it: it was their figure, and deleting it is their decision.
 function ensure(names){
  const s=state();
  s.forward??={};
  s.forward.origin??=(M.LOAD_PORT.find(name=>s.portRecords?.some(p=>p.name===name))||M.LOAD_PORT[0]);
  s.forward.quantity??=null;
  s.forward.cargoId??=null;
  if(!Array.isArray(s.forward.ports))s.forward.ports=[];
  for(const name of names||[])
   if(name&&!s.forward.ports.some(p=>p&&p.name===name))s.forward.ports.push({name,rate:null,da:null});
  return s.forward;
 }

 // ---- the reference voyage ---------------------------------------------------------------

 const portRecord=name=>state().portRecords?.find(p=>p.name===name)||null;
 const anchor=name=>{const p=portRecord(name);return p&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)?[p.lon,p.lat]:null;};

 // A published distance outranks a routed one, exactly as it does in a real calculation.
 function distanceBetween(from,to){
  if(!Sea)return {distance:null,source:null};
  const published=Sea.published(M.portProfileOf(from)?.pub151,M.portProfileOf(to)?.pub151);
  if(published&&ok(published.distance,true))return {distance:published.distance,source:'published'};
  const a=anchor(from),b=anchor(to);
  const routed=a&&b?Sea.route(a,b):null;
  if(routed&&routed.reliable&&ok(routed.distance,true))
   return {distance:Math.round(routed.distance),source:'routed'};
  return {distance:null,source:null};
 }

 // One parcel, one origin, one destination, on the open calculation's vessel and prices. This
 // is a costing of a hypothetical voyage, not a plan of one: no stowage, no states, no checks.
 function referenceVoyage({cargoId,quantity,origin,destination}){
  const current=state();
  const s=M.initial();
  s.vesselProfiles=JSON.parse(JSON.stringify(current.vesselProfiles));
  s.portRecords=JSON.parse(JSON.stringify(current.portRecords));
  s.cargoTypes=JSON.parse(JSON.stringify(current.cargoTypes));
  s.vesselId=current.vesselId;
  s.hire=current.hire;
  s.prices=JSON.parse(JSON.stringify(current.prices||{}));
  s.deductions=JSON.parse(JSON.stringify(current.deductions||{}));
  s.commission=current.commission??0;
  // The approach to the load port is not part of a per-tonne delivered cost: it belongs to
  // the vessel's position, which a forward month does not have.
  s.ballastEnabled=false;
  s.freight=null;
  s.extraIncome=0;
  s.costs=[];

  const cargo=s.cargoTypes.find(c=>c.id===cargoId);
  if(!cargo)return {ok:false,missing:['cargo is not in the register']};
  if(!ok(quantity,true))return {ok:false,missing:['reference parcel size']};
  // An assessment quoted at the load port is an FOB assessment, and there is no voyage to
  // cost. Said plainly rather than costed as a call at the same port twice.
  if(!destination||destination===origin)
   return {ok:false,missing:['a destination other than the load port']};

  s.lots=[{id:'R1',saleId:null,name:cargo.name,cargoId:cargo.id,selected:true,quantity,
   sf:cargo.sf,loadPort:origin,port:destination,color:'#888'}];
  s.sales=[];
  s.allocations=[];
  M.applyVessel(s,s.vesselId);
  M.syncRoute(s);
  // syncRoute keeps a leg the route no longer uses. compute() ignores it, because it reads
  // the legs between consecutive calls, but a state carrying a leg to a port it never visits
  // is not the voyage being costed, and anything reading its legs would be reading a fiction.
  const calls=M.callsOf(s).map(c=>c.name);
  s.legs=s.legs.filter(l=>{const i=calls.indexOf(l.from);return i>=0&&calls[i+1]===l.to;});

  // The stated assumptions for each call. An unstated one stays null, and compute names it.
  for(const call of s.ports){
   const a=portAssumption(call.name);
   if(ok(a.rate,true))call.rate=a.rate;
   if(ok(a.da))call.da=a.da;
  }

  // Distances, from the same two sources a real leg uses.
  for(const leg of s.legs){
   const found=distanceBetween(leg.from,leg.to);
   leg.distance=found.distance;
   leg.distanceSource=found.source;
  }
  return {ok:true,state:s};
 }

 // What is missing is named, not guessed. A cell with an unknown input says which one.
 const MISSING_LABELS=[
  [/distance/i,'distance'],
  [/handling rate/i,'handling rate'],
  [/\bda\b/i,'port disbursement'],
  [/hire/i,'hire'],
  [/price|fuel|bunker/i,'bunker price']
 ];
 const shorten=error=>{
  for(const [pattern,label] of MISSING_LABELS)if(pattern.test(error))return label;
  return error;
 };

 function deliveredCost({cargoId,quantity,origin,destination}){
  const built=referenceVoyage({cargoId,quantity,origin,destination});
  if(!built.ok)return {ok:false,missing:built.missing};
  const result=M.compute(built.state);
  if(!result.budget)
   return {ok:false,missing:[...new Set(result.errors.map(shorten))]};
  const costCents=result.budget.totalCents;
  const legs=built.state.legs;
  // The steamed distance, and only when every leg of it is known: a partial sum would read
  // as a shorter voyage rather than as an unknown one.
  const distance=legs.length&&legs.every(l=>ok(l.distance,true))
   ? legs.reduce((total,l)=>total+l.distance,0) : null;
  return {
   ok:true,
   costCents,
   unit:costCents/100/quantity,
   days:result.budget.days,
   distance,
   distanceSource:legs.length===1?legs[0].distanceSource:null
  };
 }

 // ---- the matrix -------------------------------------------------------------------------

 // One cell. The cost is computed once per destination, not once per month, because nothing
 // in it varies by month yet — that is stated rather than hidden behind identical numbers.
 function cell({cargoId,destination,month,cost}){
  const a=assessmentFor(cargoId,destination,month);
  const priced=cost.ok?cost:null;
  if(!a)return {month,assessment:null,cost:priced,margin:null,missing:['assessment']};
  // An FOB assessment has no freight in it, so there is nothing to take off — and nothing to
  // work out either: the cell stands whether the delivered cost is known or not.
  if(!M.FREIGHT_IS_OURS(a.basis))
   return {month,assessment:a,cost:priced,margin:a.value,missing:[]};
  if(!cost.ok)return {month,assessment:a,cost:null,margin:null,missing:[...cost.missing]};
  return {month,assessment:a,cost,margin:a.value-cost.unit,missing:[]};
 }

 function matrix({cargoId,origin,destinations,months,quantity}){
  const rows=destinations.map(destination=>{
   const cost=deliveredCost({cargoId,quantity,origin,destination});
   return {destination,cost,cells:months.map(month=>cell({cargoId,destination,month,cost}))};
  });
  return {cargoId,origin,quantity,months,rows};
 }

 // The months an assessment exists for, in order, so the matrix shows the curve that is
 // actually there rather than a window somebody chose.
 function monthsPresent(cargoId){
  return [...new Set(assessments().filter(a=>!cargoId||a.cargoId===cargoId).map(a=>a.month))]
   .filter(isMonth).sort();
 }
 function destinationsPresent(cargoId){
  return [...new Set(assessments().filter(a=>!cargoId||a.cargoId===cargoId).map(a=>a.destination))]
   .filter(Boolean).sort();
 }

 // Everything the screen needs, in one call. The cargo is the one chosen, or the first that
 // can be planned: a screen that opens on an empty selection teaches nobody anything. This is
 // also where the assumption rows the screen is about to show are brought into being, so the
 // view itself never has to write to the state it is drawing.
 function prepare(){
  const s=state();
  ensure([]);
  const plannable=(s.cargoTypes||[]).filter(c=>M.isBulkCargo(c)&&M.ok(c.sf,true));
  const chosen=plannable.some(c=>c.id===s.forward.cargoId)?s.forward.cargoId:(plannable[0]?.id??null);
  s.forward.cargoId=chosen;
  const months=monthsPresent(chosen),destinations=destinationsPresent(chosen);
  ensure([s.forward.origin,...destinations]);
  return {
   cargoId:chosen,origin:s.forward.origin,quantity:s.forward.quantity,months,destinations,
   result:matrix({cargoId:chosen,origin:s.forward.origin,quantity:s.forward.quantity,destinations,months}),
   cargoes:plannable.map(c=>[c.id,c.name]),
   loadPorts:M.LOAD_PORT.filter(name=>(s.portRecords||[]).some(p=>p.name===name)).map(n=>[n,n]),
   assumptions:portAssumptions(),
   basis:(()=>{
    const vessel=s.vesselSnapshot||M.vesselOf(s)||{};
    return {vessel:vessel.name||'',dwt:vessel.dwt??null,hire:s.hire??null,
     main:s.prices?.main??null,aux:s.prices?.aux??null};
   })()
  };
 }

 return {isMonth,assessmentFor,assumptions,portAssumption,portAssumptions,ensure,prepare,
  distanceBetween,referenceVoyage,deliveredCost,cell,matrix,monthsPresent,destinationsPresent};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXForward=api;
})(globalThis);
