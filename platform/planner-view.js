(function(root){
'use strict';
// The PLANNER screen: the sales in the voyage, the vessel and rotation, the stowage, the
// voyage calculation and what it leaves.
//
// It is the screen the whole project exists for, and it was the last thing still built inline
// in app.js — nine of its table definitions were single lines over 500 characters, four of
// them over a thousand. app.js keeps the dispatch and the document work; what the screen says
// is here.
//
// markup() is handed the computed result rather than computing it, because the caller already
// needed it for the planner checks and the print evidence: one compute per render, not three.

function create(env){
 const {M,P,getState,esc,fmt,num,orDash,round,table,foldBlock,sumOf,field,input,select,
  chosen,plannerUI,voyageMap,voyageDistanceLine,voyageLegs,shipmentWindow,cargoDetails,portNames}=env;
 const state=getState;

 function vesselSummary(){
  const v=M.vesselOf(state());
  const text=`${fmt(v?.dwt,0)} DWT · ${v?.holds??''} holds · ${v?.model??''} · LOA ${fmt(v?.loa)} m · Beam ${fmt(v?.beam)} m · Draft ${fmt(v?.draft,2)} m · TPC ${fmt(v?.tpc)} · Grain ${fmt(v?.grain,0)} m³`;
  return `<span class="muted vessel-summary">${esc(text.toUpperCase())}</span>`;
 }
 function grainCapacityLine(){
  const total=M.cargoVolume(state()).holdTotal;
  if(total===null)return '<small class="grain-capacity muted">Grain capacity: — · enter every hold volume.</small>';
  return `<small class="grain-capacity">Grain capacity: ${state().holds.map(h=>num(h.volume)).join(' + ')} = ${fmt(total,2)} m³</small>`;
 }
 function draftLossLine(){
  const r=state().planning?.autoDraftLoss;
  if(!r||r.loss===null)return `<small class="draft-formula muted">Draft loss: — · ${esc(r?.reason||'Automatic TPC estimate')}</small>`;
  const b=r.limiting,head=`${esc(b.call)} ${num(b.maxDraft)} m`;
  const body=`draft ${num(b.draft)} × 1.025 ÷ ρ ${num(b.density)} = ${num(round(b.permissible,3))} m · max(0, ${num(round(b.permissible,3))} − ${num(b.maxDraft)}) × 100 × TPC ${num(b.tpc)} × ${num(b.density)} ÷ 1.025 = ${fmt(b.portLoss,1)} t`;
  const share=b.fraction===1?'':` · cargo on board ${fmt(b.fraction*100,2)}% · voyage loss max(0, ${fmt(r.baseIntake,1)} − (${fmt(r.baseIntake,1)} − ${fmt(b.portLoss,1)}) ÷ ${num(round(b.fraction,6))}) = ${fmt(r.loss,1)} t`;
  return `<small class="draft-formula">Draft loss: ${head} · ${body}${share}</small>`+(r.warnings.length?`<small class="muted">${esc(r.warnings.join('; '))}</small>`:'');
 }
 function intakeCalculator(ship){
  const labels={fuel:'Fuel, t',water:'Fresh water, t',ballast:'Ballast, t',constant:'Constant, t',draftLoss:'Loss due to draft, t'};
  const limits=M.intakeLimits(state());
  const deductions=Object.entries(labels).map(([k,l])=>k==='draftLoss'
   ?`<label class="field">${l}<input aria-label="${l}" readonly value="${fmt(state().deductions.draftLoss,1)}"></label>`
   :field('deductions.'+k,l)).join('');
  const body=`<div class="heading compact-heading"><h3>Deductions</h3></div><div class="grid">${deductions}</div>${draftLossLine()}`
   +`<p class="intake-line">DWT limit: ${intakeShown()?`DWT ${num(M.vesselOf(state())?.dwt)} − fuel ${num(state().deductions.fuel)} − fresh water ${num(state().deductions.water)} − ballast ${num(state().deductions.ballast)} − constant ${num(state().deductions.constant)} − draft loss ${num(state().deductions.draftLoss)} = <strong>${fmt(ship.intake,2)} t</strong>`:`<strong>—</strong><button data-action="calc-intake" ${ship.intake===null||ship.intake<0?'disabled':''}>Calculate intake</button>`}</p>`
   +`<h3>Holds</h3><div class="grid holds-grid">${state().holds.map((h,i)=>field('holds.'+i+'.volume','Hold №'+h.id+', m³')).join('')}</div>`
   +grainCapacityLine()
   +(intakeShown()&&limits.cubic!==null?`<p class="cubic-intake">Cubics limit: ${fmt(limits.holdTotal,2)} m³ ÷ mix SF ${fmt(limits.weightedSf,5)} m³/t = <strong>${fmt(limits.cubic,2)} t</strong></p><p class="restricted-intake">Restricted intake DWT/cubics: min(${fmt(limits.dwt,2)} t, ${fmt(limits.cubic,2)} t) = <strong>${fmt(limits.restricted,2)} t</strong></p>`:intakeShown()?'<p class="restricted-intake muted">Cubics not checked · complete every hold volume and selected shipment SF.</p>':'')
   ;
  const intake=(intakeShown()?(limits.restricted!==null?`${fmt(limits.restricted,2)} t estimated restricted intake`:`${fmt(limits.dwt,2)} t DWT only · cubics not checked`):ship.intake!==null&&ship.intake<0?'No feasible intake · deductions exceed DWT':'Intake not calculated').toUpperCase();
  return `<details id="intake-calculator" class="fold"><summary><strong>Intake Calculator</strong><span>${intake}</span></summary><div class="fold-body">${body}</div></details>`;
 }
 // followed without opening a single table.
 // Section 4 is a stack of folds: each block keeps its own result on the summary line,
 // so the voyage can be read without opening anything and edited by opening one block.
 function legsSummary(rows){
  const days=sumOf(rows.map(({l})=>M.legDays(l))),miles=sumOf(rows.map(({l})=>l.distance));
  return `${rows.length} ${rows.length===1?'leg':'legs'} · ${orDash(miles,0,' NM')} · <strong>${orDash(days,2,' days at sea')}</strong>`;
 }
 function portsSummary(calls){
  const days=sumOf(calls.map(p=>M.portDays(state(),p))),da=sumOf(calls.map(p=>p.da));
  return `${calls.length} ${calls.length===1?'call':'calls'} · DA ${orDash(da,0,' USD')} · <strong>${orDash(days,2,' days in port')}</strong>`;
 }
 function moneySummary(){
  const price=state().prices.main,freight=state().freight;
  return `Hire ${orDash(state().hire,0,' USD/day')} · Main fuel ${orDash(price,0,' USD/t')} · Freight ${freight===null?'not entered':fmt(freight,2)+' USD/t'}`;
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
 // Allocation cells are printed in the table's own format, so the grouping goes back out before the number is read.
 const intakeKey=()=>JSON.stringify([P.INTAKE_METHOD,M.vesselOf(state())?.dwt,...M.DEDUCTIONS.map(k=>state().deductions[k])]);
 const intakeShown=()=>{if(state().intakeShownFor!==intakeKey())return false;const {dwt}=M.intakeLimits(state());return dwt!==null&&dwt>=0;};
 // The rotation, as an ordered list that can be reordered. A call carries the parcels that
 // load or discharge there, with their colour tag so the same parcel is recognisable in the
 // hold plan. The colour is generated by the model, but it travels inside a saved voyage, so
 // it is escaped like any other stored value before it reaches a style attribute.
 const parcelTag=l=>`<span class="tag" style="background:${esc(l.color)}" title="${esc(l.name)}"></span>`;
 const moveButton=(name,direction,label,disabled)=>
  `<button data-action="move-port" data-port="${esc(name)}" data-direction="${direction}" aria-label="${esc(name)} ${label}" ${disabled?'disabled':''}>${direction<0?'↑':'↓'}</button>`;

 function rotationList(title,isLoad){
  const loadNames=new Set(chosen().map(l=>l.loadPort));
  const group=M.callsOf(state()).filter(p=>loadNames.has(p.name)===isLoad);
  const call=(p,i)=>{
   const parcels=chosen().filter(l=>(isLoad?l.loadPort:l.port)===p.name);
   // A total is only a total when every parcel in it has a tonnage.
   const q=parcels.every(l=>M.ok(l.quantity,true))?parcels.reduce((n,l)=>n+l.quantity,0):null;
   return `<li><span class="port-number">${i+1}</span>`+
    `<div class="port-caption"><strong>${esc(p.name)}</strong>`+
    `<small>${fmt(q,0)} t ${parcels.map(parcelTag).join('')}</small></div>`+
    `<div class="port-actions">`+
    moveButton(p.name,-1,'earlier',i===0)+
    moveButton(p.name,1,'later',i===group.length-1)+
    `</div></li>`;
  };
  return `<div><h3>${title}</h3><ol class="port-order">${group.map(call).join('')}</ol>`+
   (group.length?'':'<p class="muted">Add sales from SALE to the planner</p>')+
   `</div>`;
 }

 // The PLANNER screen, section by section, in the order it is read.
 function markup(r,b,ship,lots){
 let html=`${state().demo?'<p class="notice">Demo example. Tonnage, SF, distances and prices are illustrative; replace the inputs before using the calculation.</p>':''}<section><div class="heading"><h2>1. Sales in voyage</h2><button data-action="add-lot">+ Add sale</button></div>`;
 // Section 1: the parcels in the voyage. Each row links back to the deal it came from and to
 // the shipment source behind its stowage factor, so a figure can be traced without leaving.
 const VOYAGE_COLUMNS=['In voyage','Sale / cargo','Quantity, MT','SF, m³/t','Loading','Discharge','Shipment',''];
 const saleLink=l=>state().sales.some(s=>s.id===l.saleId)
  ? `<button class="text-action sale-link" data-action="open-sale" data-id="${esc(l.saleId)}" aria-label="Open ${esc(l.saleId)} in SALE">${esc(l.saleId)}</button>`
  : esc(l.saleId||'Legacy');
 const voyageRow=(l,i)=>
  `<tr>`+
  `<td><input type="checkbox" data-path="lots.${i}.selected" aria-label="Include ${esc(l.name)}" ${l.selected?'checked':''}></td>`+
  `<td class="name"><span class="tag" style="background:${esc(l.color)}"></span><small>${saleLink(l)}</small><br>`+
  `<button class="text-action" data-action="parcel-passport" data-id="${esc(l.id)}">${esc(l.name)}</button></td>`+
  `<td>${fmt(l.quantity,1)}</td>`+
  `<td>${fmt(l.sf,2)}</td>`+
  `<td>${esc(l.loadPort)}</td>`+
  `<td>${esc(l.port)}</td>`+
  `<td class="shipment-window">${shipmentWindow(state().sales.find(s=>s.id===l.saleId))}</td>`+
  `<td><button data-action="remove-lot" data-index="${i}" aria-label="Remove sale ${esc(l.saleId||l.id)} from voyage">×</button></td>`+
  `</tr>`;
 const VOYAGE_EMPTY='<div class="empty-state planner-empty"><strong>No sales in voyage yet</strong><span>Add a sale from SALE to start planning this voyage.</span></div>';
 html+=state().lots.length?table(VOYAGE_COLUMNS,state().lots.map(voyageRow),'voyage-sales-table'): VOYAGE_EMPTY;html+='</section>';
 html+=`<section><div class="heading"><h2>2. Vessel and rotation</h2></div><div class="vessel-choice"><label class="field">${select('vesselId','Vessel',(state().vesselProfiles||M.VESSELS).map(v=>[v.id,v.name]))}</label>${vesselSummary()}</div>${intakeCalculator(ship)}<div class="rotation-grid">${rotationList('Loading',true)}${rotationList('Discharge',false)}</div></section>`;
 // One planner check per render; both the section and the print evidence read the same result.
 const report=P.check(state(),b);
 html+=plannerUI.section3(state(),b,report)+plannerUI.printEvidence(state(),b,report);
 html+=`<section><div class="heading"><h2>4. Voyage calculation</h2></div>${voyageChain(b,ship)}`;
 html+=`<details id="voyage-map" class="fold"><summary><strong>Voyage map</strong></summary><div class="fold-body">${voyageMap()}</div></details>`;
 const distances=voyageDistanceLine(),drawnLegs=voyageLegs().filter(l=>l.leg);
 if(distances)html+=foldBlock('voyage-distances','Distances',`${drawnLegs.length} ${drawnLegs.length===1?'leg':'legs'} · ${orDash(sumOf(drawnLegs.map(l=>l.leg.distance)),0,' NM')}`,distances);
 const activePorts=M.callsOf(state());const displayedLegs=[];if(state().ballastEnabled)displayedLegs.push({l:state().ballast,path:'ballast'});for(let i=1;i<activePorts.length;i++){const j=state().legs.findIndex(l=>l.from===activePorts[i-1].name&&l.to===activePorts[i].name);if(j>=0)displayedLegs.push({l:state().legs[j],path:'legs.'+j});}
 const legsHead=`<div class="ballast-line"><label class="muted"><input type="checkbox" data-path="ballastEnabled" ${state().ballastEnabled?'checked':''}> Include ballast approach to ${esc(M.callsOf(state())[0]?.name||'the first load port')}</label>${state().ballastEnabled?`<label class="field delivery-port">Delivery port${input('deliveryPort','Delivery port',{type:'text',placeholder:M.DELIVERY_PLACEHOLDER,list:'delivery-ports'})}</label><datalist id="delivery-ports">${portNames().map(([name])=>`<option value="${esc(name)}"></option>`).join('')}</datalist>`:''}</div>`;
 const legsTable=table(['Leg','Total, NM','Of which ECA, NM','Speed, kn','Weather, % time','Outside ECA, t/day','In ECA, t/day','Aux, t/day','Days'],displayedLegs.map(({l,path})=>`<tr><td class="name">${esc(l.from)} → ${esc(l.to)}</td>${['distance','eca','speed','margin','burn','ecaBurn','aux'].map(k=>`<td>${input(path+'.'+k,l.from+' '+k)}</td>`).join('')}<td>${fmt(b?.legs.find(x=>x.from===l.from&&x.to===l.to)?.days??M.legDays(l),3)}</td></tr>`));// The calendar period belongs to manual handling terms only: the column appears with the call that needs it.
 html+=foldBlock('voyage-legs','Legs',legsSummary(displayedLegs),legsHead+legsTable);
 const manualTerms=activePorts.some(p=>p.terms==='manual');
 const portsTable=table(['Port','Cargo, MT','Handling rate, t/day','Handling terms',...(manualTerms?['Calendar, days']:[]),'Turn time, h','Waiting, h','DA, USD','Days'],activePorts.map(p=>{const i=state().ports.indexOf(p),path='ports.'+i;return `<tr><td>${esc(p.name)}</td><td>${fmt(lots.filter(l=>l.loadPort===p.name||l.port===p.name).reduce((n,l)=>n+(l.quantity||0),0),0)}</td><td>${input(path+'.rate',p.name+' handling rate')}</td><td>${select(path+'.terms',p.name+' terms',[['SHINC','24/7 · SHINC'],['manual','Manual calendar']])}</td>${manualTerms?`<td>${input(path+'.calendar',p.name+' calendar days',{disabled:p.terms==='SHINC'})}</td>`:''}<td>${input(path+'.turn',p.name+' turn time')}</td><td>${input(path+'.extra',p.name+' waiting')}</td><td>${input(path+'.da',p.name+' DA')}</td><td>${fmt(b?.ports.find(x=>x.name===p.name)?.days??M.portDays(state(),p),3)}</td></tr>`;}));
 const portFuel=`<details id="portfuel"><summary>Port fuel consumption</summary>${table(['Port','Main fuel','Main work, t/day','Main idle, t/day','Aux work, t/day','Aux idle, t/day','Boiler, t/day','Boiler operating time, days','Boiler fuel'],activePorts.map(p=>{const path='ports.'+state().ports.indexOf(p);return `<tr><td>${esc(p.name)}</td><td>${select(path+'.fuel',p.name+' fuel',[['main','Outside ECA'],['eca','ECA']])}</td>${['working','idle','auxWorking','auxIdle','boiler','boilerDays'].map(k=>`<td>${input(path+'.'+k,p.name+' '+k)}</td>`).join('')}<td>${select(path+'.boilerFuel','Boiler fuel',[[null,'Select'],['main','Main outside ECA'],['eca','Main ECA'],['aux','Aux']])}</td></tr>`;}))}</details>`;
 html+=foldBlock('voyage-ports','Ports',portsSummary(activePorts),portsTable+portFuel);
 // Hire, bunker prices and what the voyage earns. Fuel is priced per zone rather than once,
 // because a leg inside an ECA burns a different grade from the same leg outside it.
 const MONEY_FIELDS=[
  ['hire','Effective hire / target TCE, USD/day'],
  ['prices.main','Main outside ECA, USD/t'],
  ['prices.eca','Main ECA, USD/t'],
  ['prices.aux','Additional Aux, USD/t'],
  ['freight','Estimated gross freight, USD/t · optional'],
  ['commission','Commission on gross freight, %'],
  ['extraIncome','Other income net, USD']
 ];
 const FUEL_NOTE='<p class="form-note">Fuel grades and prices are set by voyage phase. Enter prices and consumption explicitly for each zone. Aux is added to main consumption; enter 0 only if it is already included or not used.</p>';
 // A cost can carry time and consumption of its own: a canal transit is a stop, not just a fee.
 const COST_COLUMNS=['Item','Amount, USD','Additional time, days','Consumption, t/day','Fuel',''];
 const costRow=(c,i)=>
  `<tr><td>${input('costs.'+i+'.name','Item name',{type:'text'})}</td>`+
  `<td>${input('costs.'+i+'.amount','Item amount')}</td>`+
  `<td>${input('costs.'+i+'.days','Additional time')}</td>`+
  `<td>${input('costs.'+i+'.burn','Stop consumption')}</td>`+
  `<td>${select('costs.'+i+'.fuel','Stop fuel',[['main','Outside ECA'],['eca','ECA']])}</td>`+
  `<td><button data-action="remove-cost" data-index="${i}" aria-label="Remove item ${i+1}">Remove</button></td></tr>`;
 const costsBlock=()=>state().costs.length
  ? `<h3>Additional costs and stops</h3>`+table(COST_COLUMNS,state().costs.map(costRow))+`<button data-action="add-cost">Add item</button>`
  : `<button class="inline-action" data-action="add-cost">+ Add cost or stop</button>`;
 const moneyBody=`<div class="grid">`+MONEY_FIELDS.map(([path,label])=>field(path,label)).join('')+`</div>`+
  FUEL_NOTE+costsBlock();
 html+=foldBlock('voyage-money','Hire, bunkers and freight',moneySummary(),moneyBody);
 if(b){const amount=kind=>b.rows.filter(r=>r.kind===kind).reduce((n,r)=>n+r.cents,0)/100;html+=`<div class="split"><div><h3>Costs</h3><table class="totals"><tbody>${[['Hire',b.hire],['Bunkers',amount('fuel')],['Ports',amount('ports')],['Other',amount('other')],['Total',b.total]].map(([k,v])=>`<tr><td>${k}</td><td>${fmt(v,2)} USD</td></tr>`).join('')}</tbody></table></div><div><h3>Freight estimate</h3><table class="totals"><tbody>${[['Gross freight',b.gross],['Commission',b.commission],['Net income',b.net],['TCE before hire, USD/day',b.tce],['P&L after hire, USD',b.pnl],['Freight required to cover model cost, USD/t',b.requiredFreightQuote]].map(([k,v])=>`<tr><td>${k}</td><td>${fmt(v,2)}</td></tr>`).join('')}</tbody></table></div></div>`;}
 // A financial result over an incomplete or over-limit cargo plan is not a feasible voyage,
 // and says so rather than letting the number stand on its own.
 const INFEASIBLE='<p class="notice">The cargo plan is incomplete or exceeds limits. The financial result does not confirm voyage feasibility.</p>';
 const planIncomplete=ship.errors.length||ship.remaining.some(x=>x.quantity===null||Math.abs(x.quantity)>.01);

 // Section 5: what each sale carries of the voyage. The method is the open question Q-005,
 // so it is a choice on the screen rather than a rule buried in the engine.
 const allocationRow=a=>{
  const l=state().lots.find(l=>l.id===a.id);
  return `<tr><td class="name"><span class="tag" style="background:${esc(l.color)}"></span>${esc(l.name)}</td>`+
   `<td>${esc(l.port)}</td><td>${fmt(a.quantity,1)}</td>`+
   `<td>${fmt(a.cents/100,2)}</td><td>${fmt(a.cents/100/a.quantity,2)}</td></tr>`;
 };
 const allocationTable=()=>b
  ? table(['Sale','Port','Tonnage','Allocated, USD','USD/t'],b.allocation.map(allocationRow))
  : '<p class="empty">Allocation appears after the voyage calculation is complete.</p>';
 // The sources editor is shown for a calculation that already carries notes, so section 5
 // ends with the allocation itself for everyone else.
 const notesBlock=()=>String(state().notes||'').trim()
  ? `<details id="notes"><summary>Calculation sources and notes</summary><textarea data-path="notes" aria-label="Calculation sources" placeholder="Enter sources and dates for distances, PDA, rates, SF and vessel data">${esc(state().notes)}</textarea></details>`
  : '';

 html+=(planIncomplete?INFEASIBLE:'')+`</section><section>`+
  `<div class="heading"><h2>5. Cost by sale</h2>`+
  select('allocation','Allocation method',[['route','By legs and ports'],['tonnage','Entire budget by tonnage']])+
  `</div>`+allocationTable()+notesBlock()+`</section>`;
  return html;
 }

 // intakeKey is exported because the action that calculates an intake stamps it onto the
 // state, and the view is what decides when a stamped key is still the current one.
 return {markup,intakeKey,intakeShown,vesselSummary,intakeCalculator,legsSummary,portsSummary,moneySummary,voyageChain,rotationList};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXPlannerView=api;
})(globalThis);
