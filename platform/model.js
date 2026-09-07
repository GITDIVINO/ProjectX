(function(root){
'use strict';
const CargoCatalog=typeof module!=='undefined'&&module.exports?require('./cargo-catalog'):root.ProjectXCargoCatalog;
function isBulkCargo(c){return !c?.physicalForm||c.physicalForm==='solid';}

const ok=(x,p=false)=>typeof x==='number'&&Number.isFinite(x)&&(p?x>0:x>=0);
const {Rational}=typeof module!=='undefined'&&module.exports?require('./arithmetic'):root.ProjectXArithmetic;
const sum=a=>a.reduce((n,x)=>n+x,0),R=x=>Rational.from(x),cents=x=>R(x).roundCents();
// Invalid fields are validated by need(); these placeholders never produce a published budget.
const rInput=x=>typeof x==='number'&&Number.isFinite(x)?R(x):R(0);
const ratio=(a,b)=>b.n===0n?R(0):a.div(b);
const rsum=xs=>xs.reduce((n,x)=>n.add(x),R(0));
const port=name=>({name,rate:null,terms:'SHINC',calendar:null,turn:0,extra:0,da:null,working:4.8,idle:2.7,aux:null,fuel:'eca'});
const leg=(from,to)=>({from,to,distance:null,eca:null,speed:12.5,burn:16,ecaBurn:null,aux:null,margin:0});
const standardVessel=(id,name,values)=>({id,name,direction:'',revision:'standard-vessels-2026-09-07',bale:null,tanktop:null,ecaBurn:null,boiler:null,holds:5,cranes:4,craneSWL:30,grabs:true,...values});
const VESSELS=[
 standardVessel('tbn-1','TBN 34K',{model:'HDD34',source:'User-supplied average profile, 7 September 2026',dwt:33465,draft:9.85,tpc:50.7,loa:180,beam:30,grain:45517,gt:24079,nrt:10640,speed:12.5,burn:15.4,ballastSpeed:12.5,ballastBurn:13.5,working:3.2,idle:2.1,aux:0.1,auxWorking:0,auxIdle:0,holdData:[7781.4,9489.1,9484.5,9487.6,9274.2].map((volume,i)=>({id:i+1,volume,massLimit:null}))}),
 standardVessel('tbn-2','TBN 37K',{model:'SEAHORSE 375',source:'User-supplied average profile, 7 September 2026',dwt:37667,draft:10.65,tpc:51,loa:180,beam:30,grain:46732,gt:24199,nrt:12798,speed:12.5,burn:16,ballastSpeed:12.5,ballastBurn:16,working:4.8,idle:2.7,aux:0.1,auxWorking:0,auxIdle:0,holdData:[7948.3,9790.4,9782.9,9782.8,9428.2].map((volume,i)=>({id:i+1,volume,massLimit:null}))}),
 standardVessel('tbn-3','TBN 57K',{model:'DOLPHIN 57',source:'User-supplied average profile, 7 September 2026',dwt:56565.45,draft:12.8,tpc:58.8,loa:199.99,beam:32.26,grain:71634,gt:33033,nrt:19132,speed:12,burn:30,ballastSpeed:12,ballastBurn:28,working:5.5,idle:3.5,aux:0.1,auxWorking:0.1,auxIdle:0.1,holdData:[13009.86,15333.25,14553.08,15333.27,13404.64].map((volume,i)=>({id:i+1,volume,massLimit:null}))})
];
const CATALOG_ADDITIONS='ports-vessels-2026-09-06';
const PORT_PROFILE_REVISION='port-profiles-2026-09-07';
const PORT_PROFILES={
 'Murmansk':{terminal:'Murmansk Sea Commercial Port',restrictions:'Berth 4: draft 11.0 m, beam 32.2 m, LOA 230 m. Berth 7: draft 10.0 m, beam 32 m, LOA 225 m. Berths 9/10: draft 10.5 m, beam 36 m, LOA 240 m. Berth 13: draft 12.5 m, beam 36 m, LOA 240 m. Berth 6: draft 7.0 m, beam 16 m, LOA 120 m. Air draft 14.5 m at all berths. Confirm the assigned berth.'},
 'St. Petersburg':{terminal:'Sea Port of Saint Petersburg, First and Second Cargo Areas',restrictions:'Operator lists 31 dry cargo berths. Confirm the assigned berth and its current permissible draft.'},
 'Ust-Luga':{terminal:'European Sulphur Terminal / EuroChem Ust-Luga Terminal',restrictions:'EuroChem berth 1: LOA 334 m, draft 13.1 m. Berth 2: LOA 295 m, draft 8.5 m. Status of berths 3-4 to be confirmed.'},
 'Santos':{terminal:'STS20, Outeirinhos, berths 22/23',restrictions:'Combined berth face 283 m, depth 11.3 m in the source study. Check the current operational draft in the port table.'},
 'Paranaguá':{terminal:'TEFER, public fertilizer terminal',restrictions:'Published draft 12.5 m. A 2023 announcement gives 12.8 m at fertilizer berths 209/211. Confirm before fixing.'},
 'Itaqui':{terminal:'COPI / public berths 100-103',restrictions:'Confirm the exact berth and the current draft, LOA and beam with EMAP/COPI.'},
 'Santarem':{terminal:'Solid Bulk Terminal, Pier 400 berth 401',restrictions:'About 250 m, depth 16 m, up to 60,000 DWT. Confirm fertilizer handling and the river level.'},
 'Vitoria':{terminal:'Vports, Vila Velha terminal',restrictions:'Berth assignment and current limits are absent from the public profile used. Confirm with Vports.'},
 'Rio Grande':{terminal:'Yara Brasil Fertilizantes, North/South',restrictions:'South draft 12.19 m, North 10.0 m. The terminal limit prevails over the channel.'},
 'San Francisco do Sul':{terminal:'Public berth 201 / Bulk Terminal',restrictions:'Draft 14 m, max LOA 250 m. Confirm the current structural and operational limits.'},
 'Suape':{terminal:'SUA Graneis, quay 5',restrictions:'Quay 343-344 m, max operational draft 15 m, max LOA 300 m. Confirm fertilizer handling.'},
 'Aratu':{terminal:'TGS, Pier 1 North/South',restrictions:'South max LOA 250 m, North 200 m, depth 12 m. Another source page reports a lower South draft: confirmation required.'},
 'Pecem':{terminal:'Pier 3 / TMUT',restrictions:'TMUT berths 7-9 draft 15.3 m. Pier 1 internal 14 m, external 15 m. Confirm the berth and the fertilizer scheme.'}
};
const normalizePortName=name=>String(name??'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function portProfileOf(name){const key=normalizePortName(name);const match=Object.keys(PORT_PROFILES).find(n=>normalizePortName(n)===key||(n==='San Francisco do Sul'&&key==='sao francisco do sul'));return match?PORT_PROFILES[match]:null;}
function portRecord(id,name){const profile=portProfileOf(name);return {id,name,terminal:profile?.terminal??'',restrictions:profile?.restrictions??'',da:null};}
function mergePortProfiles(s){
 if(s.portProfileRevision===PORT_PROFILE_REVISION)return;
 for(const p of s.portRecords||[]){
  const profile=portProfileOf(p.name);
  if(!profile)continue;
  if(!String(p.terminal??'').trim())p.terminal=profile.terminal;
  if(!String(p.restrictions??'').trim())p.restrictions=profile.restrictions;
 }
 s.portProfileRevision=PORT_PROFILE_REVISION;
}
function mergeRequestedCatalogs(s){
 if(s.catalogAdditions?.includes(CATALOG_ADDITIONS))return;
 const normalized=name=>name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const ports=['St. Petersburg','Murmansk','Itaqui','Santarem','Vitoria','Rio Grande','San Francisco do Sul','Suape','Aratu','Pecem'];
 for(const [i,name] of ports.entries()){
  if(s.portRecords.some(p=>normalized(p.name)===normalized(name)||(name==='San Francisco do Sul'&&normalized(p.name)==='sao francisco do sul')))continue;
  let id='port-seed-'+i;while(s.portRecords.some(p=>p.id===id))id+='-new';
  s.portRecords.push(portRecord(id,name));
 }
 for(const v of VESSELS.slice(1)){
  if(s.vesselProfiles.some(p=>normalized(p.name)===normalized(v.name)))continue;
  const copy=JSON.parse(JSON.stringify(v));while(s.vesselProfiles.some(p=>p.id===copy.id))copy.id+='-reference';
  s.vesselProfiles.push(copy);
 }
 s.catalogAdditions=[...(s.catalogAdditions||[]),CATALOG_ADDITIONS];
}
const vesselOf=s=>(s.vesselSnapshot?.id===s.vesselId?s.vesselSnapshot:null)||VESSELS.find(v=>v.id===(s.vesselId||'tbn-1'));
const LOAD_PORT=['Ust-Luga','Murmansk','St. Petersburg'];
const loadOf=(s,l)=>l.loadPort??s.ports[0].name;
const callsOf=s=>s.ports.filter(p=>active(s).some(l=>loadOf(s,l)===p.name||l.port===p.name));
const CARGO_TYPES=[{name:'BULK SULPHUR APP C',group:''},{name:'Crushed lump sulphur',group:'B',un:'1350'}];
function initial(){const s={version:2,vesselId:'tbn-1',cargoTypes:JSON.parse(JSON.stringify(CARGO_TYPES)),sales:[],portRecords:[portRecord('P4','Murmansk'),portRecord('P5','St. Petersburg'),portRecord('P1','Ust-Luga'),portRecord('P2','Santos'),portRecord('P3','Paranaguá')],demo:false,notes:'',lots:[],holds:JSON.parse(JSON.stringify(VESSELS[0].holdData)),allocations:[],stage:'load',deductions:{fuel:null,water:null,ballast:null,constant:null,lubes:null,slops:null},ports:[port('Ust-Luga'),port('Santos'),port('Paranaguá')],legs:[leg('Ust-Luga','Santos'),leg('Santos','Paranaguá')],ballastEnabled:false,ballast:leg('Vessel position','Ust-Luga'),prices:{main:null,eca:null,aux:null},hire:null,commission:0,freight:null,extraIncome:0,costs:[],allocation:'route'};ensureCatalogs(s);ensureBusinessData(s);applyVessel(s,'tbn-1');s.tbnSourceRevision=VESSELS[0].revision;return s;}
function demo(){const s=initial();s.lots=[{id:'S1',name:'BULK SULPHUR APP C',cargoId:'cargo-1',saleId:'SALE-S1',color:'#d5ae60',selected:true,quantity:24000,sf:.9,loadPort:'Ust-Luga',port:'Santos'},{id:'S2',name:'Crushed lump sulphur',cargoId:'cargo-2',saleId:'SALE-S2',color:'#829fcb',selected:true,quantity:6000,sf:.9,loadPort:'Ust-Luga',port:'Paranaguá',group:'B',un:'1350'}];s.sales=[{id:'SALE-S1',dealDate:'',cargoId:'cargo-1',cargoName:'BULK SULPHUR APP C',quantity:24000,loadPort:'Ust-Luga',dischargePort:'Santos',shipmentFrom:'',shipmentTo:'',fob:null,legacyLotId:'S1'},{id:'SALE-S2',dealDate:'',cargoId:'cargo-2',cargoName:'Crushed lump sulphur',quantity:6000,loadPort:'Ust-Luga',dischargePort:'Paranaguá',shipmentFrom:'',shipmentTo:'',fob:null,legacyLotId:'S2'}];s.vesselSnapshot={...s.vesselSnapshot,dwt:37667};s.holds=[7948,9790,9782,9782,9428].map((volume,i)=>({id:i+1,volume,massLimit:null}));s.ports=[port('Ust-Luga'),port('Santos'),port('Paranaguá')];s.legs=[leg('Ust-Luga','Santos'),leg('Santos','Paranaguá')];s.ports.forEach(p=>{delete p.auxWorking;delete p.auxIdle;delete p.boiler;delete p.boilerDays;delete p.boilerFuel;p.working=4.8;p.idle=2.7;});s.demo=true;s.deductions={fuel:950,water:200,ballast:300,constant:450,lubes:35,slops:40};s.hire=13500;s.freight=50;s.commission=1.25;s.prices={main:540,eca:800,aux:800};s.ports.forEach((p,i)=>Object.assign(p,{rate:i?5000:8000,da:[65000,55000,42000][i],aux:0,fuel:i?'main':'eca'}));s.legs.forEach((l,i)=>Object.assign(l,{distance:i?180:7200,speed:12.5,burn:16,eca:i?0:1000,ecaBurn:16,aux:0,margin:5}));s.allocations=allocate(s);return s;}
function active(s){return s.lots.filter(l=>l.selected);}
function allocate(s,trace=[]){
 const out=[],lots=active(s).filter(l=>isBulkCargo(s.cargoTypes?.find(c=>c.id===l.cargoId))&&ok(l.quantity,true)&&ok(l.sf,true));
 const capacity=(l,h)=>{
  const value=Math.min(h.volume/l.sf,h.massLimit??Infinity);
  trace.push({label:l.id+' / hold '+h.id+' · automatic capacity',formula:'min(hold volume / SF, entered mass limit)',substitution:`min(${h.volume} m³ / ${l.sf} m³/t, ${h.massLimit??'no mass cap'})`,result:value,unit:'t'});return value;
 };
 if(lots.length===1){
  const l=lots[0],holds=s.holds.map(h=>({h,capacity:capacity(l,h)})).filter(x=>ok(x.capacity,true)),total=sum(holds.map(x=>x.capacity)),target=Math.min(l.quantity,total);
  trace.push({label:l.id+' · automatic target',formula:'min(sale quantity, sum of hold capacities)',substitution:`min(${l.quantity}, ${holds.map(x=>x.capacity).join(' + ')||'0'})`,result:target,unit:'t'});
  let assigned=0;
  holds.forEach((x,i)=>{const last=i===holds.length-1,q=last?target-assigned:target*x.capacity/total;
   trace.push({label:l.id+' / hold '+x.h.id+' · automatic suggestion',formula:last?'Target − quantities already assigned':'Target × hold capacity / total capacity',substitution:last?`${target} − ${assigned}`:`${target} × ${x.capacity} / ${total}`,result:q,unit:'t'});
   if(ok(q,true)){out.push({lot:l.id,hold:x.h.id,quantity:q});assigned+=q;}
  });return out;
 }
 for(const l of lots){let left=l.quantity;for(const h of s.holds){
  if(out.some(a=>a.hold===h.id))continue;
  const available=capacity(l,h),q=Math.min(left,available);
  trace.push({label:l.id+' / hold '+h.id+' · automatic suggestion',formula:'min(unassigned quantity, capacity of next empty hold)',substitution:`min(${left}, ${available})`,result:q,unit:'t'});
  if(ok(q,true)){out.push({lot:l.id,hold:h.id,quantity:q});left-=q;}if(left<1e-9)break;
 }}return out;
}
function stowage(s){const lots=active(s),errors=[],warnings=[];const intake=['fuel','water','ballast','constant','lubes','slops'].every(k=>ok(s.deductions[k]))&&ok(vesselOf(s)?.dwt,true)?(vesselOf(s)?.dwt??NaN)-sum(['fuel','water','ballast','constant','lubes','slops'].map(k=>s.deductions[k])):null;const quantity=lots.every(l=>ok(l.quantity,true))?sum(lots.map(l=>l.quantity)):null;
if(new Set(s.holds.map(h=>h.id)).size!==s.holds.length)errors.push('Duplicate hold ID');if(intake===null)warnings.push('Preliminary intake is unknown: complete DWT and every deduction');
for(const l of lots){if(!ok(l.sf,true))errors.push(l.id+': enter a positive shipment SF');if(['reference-upper-bound','SDS-loose-density'].includes(l.sfBasis))warnings.push(l.id+': SF — reference estimate; confirm the shipment value');if(!isBulkCargo(s.cargoTypes?.find(c=>c.id===l.cargoId)))errors.push(l.name+': carriage mode is not supported by a bulk carrier');}
for(const a of s.allocations){const l=lots.find(l=>l.id===a.lot);if(!l||!s.holds.some(h=>h.id===a.hold)||!ok(a.quantity))errors.push('Invalid stowage entry');}
const holds=s.holds.map(h=>{const all=s.allocations.filter(a=>a.hold===h.id&&lots.some(l=>l.id===a.lot));const q=all.every(a=>ok(a.quantity))?sum(all.map(a=>a.quantity)):null;const volume=all.every(a=>ok(a.quantity)&&ok(lots.find(l=>l.id===a.lot).sf,true))?sum(all.map(a=>a.quantity*lots.find(l=>l.id===a.lot).sf)):null;if(!ok(h.volume,true))errors.push('Enter volume for hold №'+h.id);if(h.massLimit!==null&&!ok(h.massLimit,true))errors.push('Check mass limit for hold №'+h.id);if(volume!==null&&volume>h.volume+1e-7)errors.push('Volume exceeded in hold №'+h.id);if(h.massLimit!==null&&q>h.massLimit+1e-7)errors.push('Mass exceeded in hold №'+h.id);if(new Set(all.filter(a=>a.quantity>0).map(a=>a.lot)).size>1)warnings.push('Mixed stowage in №'+h.id+' requires a compatibility check');return {...h,quantity:q,used:volume,fill:volume===null?null:100*volume/h.volume};});
const remaining=lots.map(l=>{const cells=s.allocations.filter(a=>a.lot===l.id),q=cells.every(a=>ok(a.quantity))?sum(cells.map(a=>a.quantity)):null;if(ok(l.quantity)&&q!==null&&q>l.quantity+1e-7)errors.push(l.id+': allocated quantity exceeds sale quantity');return {id:l.id,quantity:ok(l.quantity)&&q!==null?l.quantity-q:null};});if(intake!==null&&quantity!==null&&quantity>intake)errors.push('Total mass exceeds DWT less deductions');if(intake!==null&&intake<0)errors.push('Deductions exceed DWT');return {intake,quantity,holds,remaining,errors:[...new Set(errors)],warnings};}
function splitCents(total,weights){if(!Number.isSafeInteger(total)||total<0||weights.some(w=>!ok(w)))throw Error('Invalid allocation basis');const denominator=rsum(weights.map(R));if(denominator.n===0n)throw Error('No allocation basis');const shares=weights.map(w=>R(total).mul(w).div(denominator));const out=shares.map(x=>Number(x.n/x.d));const order=shares.map((x,i)=>({i,n:x.n%x.d,d:x.d})).sort((a,b)=>{const difference=b.n*a.d-a.n*b.d;return difference>0n?1:difference<0n?-1:a.i-b.i;});const remainder=total-sum(out);for(let i=0;i<remainder;i++)out[order[i].i]++;return out;}
function compute(s){try{return computeChecked(s);}catch(error){return {errors:['Calculation stopped: '+error.message],ship:stowage(s),budget:null};}}
function computeChecked(s){
 const errors=[],lots=active(s),ship=stowage(s),trace={legs:[],ports:[],extras:[],totals:[]};
 const need=(x,label,p=false)=>{if(!ok(x,p))errors.push(label);};
 const text=x=>x instanceof Rational?String(x.number()):String(x??'unknown');
 const explain=(section,label,formula,substitution,value,unit)=>{const exact=R(value);trace[section].push({label,formula,substitution,result:exact.number(),unit,exact:exact.n+'/'+exact.d});};
 if(new Set(s.lots.map(l=>l.id)).size!==s.lots.length)errors.push('Duplicate ID of sales');
 if(s.vesselSnapshot&&s.vesselSnapshot.id!==s.vesselId)errors.push('Vessel profile does not match the selected type');
 if(!vesselOf(s))errors.push('Select a vessel');
 if(!lots.length)errors.push('Select a sale');
 for(const l of lots){need(l.quantity,l.id+': tonnage',true);if(!s.portRecords?.some(p=>p.name===l.port))errors.push(l.id+': port');if(!s.portRecords?.some(p=>p.name===loadOf(s,l)))errors.push(l.id+': load port');}
 need(s.hire,'Hire rate');need(s.commission,'Commission');if(s.commission>=100)errors.push('Commission must be less than 100%');need(s.extraIncome,'Additional income');if(s.freight!==null)need(s.freight,'Freight rate');
 const names=s.ports.map(p=>p.name);
 if(new Set(names).size!==names.length||!names.length)errors.push('Check the route');
 for(const l of lots){if(!names.includes(loadOf(s,l))||names.indexOf(loadOf(s,l))>=names.indexOf(l.port))errors.push(l.id+': loading must precede discharge');}
 if(lots.some(l=>lots.some(other=>loadOf(s,l)===other.port)))errors.push('A port used for both loading and discharge requires an operation sequence; this planner supports separate loading and discharge calls only');
 if(!['route','tonnage'].includes(s.allocation))errors.push('Allocation method');
 const calls=callsOf(s),legs=[];
 for(let i=1;i<calls.length;i++){const x=s.legs.find(l=>l.from===calls[i-1].name&&l.to===calls[i].name);if(!x)errors.push('Distance '+calls[i-1].name+' → '+calls[i].name+': rebuild the route');else legs.push(x);}
 if(s.ballastEnabled){if(s.ballast.to!==calls[0]?.name)errors.push('Ballast approach must end at the first port');legs.unshift(s.ballast);}
 // Validate common inputs before exact arithmetic. Unknown inputs must never appear as zero in the trace.
 if(errors.length)return {errors:[...new Set(errors)],ship,budget:null};
 const quantityR=rsum(lots.map(l=>R(l.quantity))),q=quantityR.number();
 let seaR=R(0),workTotalR=R(0),idleTotalR=R(0);
 const usageR={main:R(0),eca:R(0),aux:R(0)},usageParts={main:[],eca:[],aux:[]},rows=[],legResults=[],portResults=[];
 let section='legs',label='';
 const add=(name,amount,eligible,kind,formula,substitution)=>{
  const value=cents(amount);if(value<0)errors.push(name+': negative cost');
  rows.push({name,cents:value,eligible:eligible.map(l=>l.id),kind});
  explain(section,name,formula,substitution+'; round to cents',R(value).div(100),'USD');
 };
 const fuelCost=(fuel,mass)=>{
  mass=R(mass);if(mass.n===0n)return R(0);
  need(s.prices[fuel],'Fuel price '+fuel);usageR[fuel]=usageR[fuel].add(mass);usageParts[fuel].push(text(mass));
  const cost=mass.mul(rInput(s.prices[fuel]));
  explain(section,label+' · '+fuel+' fuel value','Fuel mass × price (before rounding)',text(mass)+' t × '+text(s.prices[fuel])+' USD/t',cost,'USD');return cost;
 };
 for(const l of legs){
  label=l.from+' → '+l.to;
  for(const [k,p] of [['distance',true],['speed',true],['burn',false],['eca',false],['margin',false],['aux',false]])need(l[k],label+': '+k,p);
  if(l.eca>l.distance)errors.push(label+': ECA exceeds total distance');
  if(l.eca>0)need(l.ecaBurn,label+': consumption ECA');
  else if(l.ecaBurn!==null&&l.ecaBurn!==undefined)need(l.ecaBurn,label+': consumption ECA');
  const factor=rInput(l.margin).div(100).add(1),daysR=ratio(rInput(l.distance),rInput(l.speed).mul(24)).mul(factor),ecaR=ratio(rInput(l.eca),rInput(l.speed).mul(24)).mul(factor);
  const before=s.ports.findIndex(p=>p.name===l.from),eligible=l===s.ballast?lots:lots.filter(x=>s.ports.findIndex(p=>p.name===loadOf(s,x))<=before&&s.ports.findIndex(p=>p.name===x.port)>before);
  const mainR=daysR.sub(ecaR).mul(rInput(l.burn)),ecaMassR=ecaR.mul(rInput(l.ecaBurn)),auxR=daysR.mul(rInput(l.aux));
  explain(section,label+' · time','Distance / (speed × 24) × (1 + weather / 100)',`${text(l.distance)} NM / (${text(l.speed)} kn × 24) × (1 + ${text(l.margin)} / 100)`,daysR,'days');
  explain(section,label+' · ECA time','ECA distance / (speed × 24) × (1 + weather / 100)',`${text(l.eca)} NM / (${text(l.speed)} kn × 24) × (1 + ${text(l.margin)} / 100)`,ecaR,'days');
  explain(section,label+' · main mass','(Total days − ECA days) × main burn',`(${text(daysR)} − ${text(ecaR)}) days × ${text(l.burn)} t/day`,mainR,'t');
  explain(section,label+' · ECA mass','ECA days × ECA burn',l.eca===0?'0 ECA days; ECA burn is not used':`${text(ecaR)} days × ${text(l.ecaBurn)} t/day`,ecaMassR,'t');
  explain(section,label+' · Aux mass','Total days × additional Aux burn',`${text(daysR)} days × ${text(l.aux)} t/day`,auxR,'t');
  const costR=fuelCost('main',mainR).add(fuelCost('eca',ecaMassR)).add(fuelCost('aux',auxR));seaR=seaR.add(daysR);
  add(label+' · fuel',costR,eligible,'fuel','Round(sum of fuel values for this leg, 2)',text(costR)+' USD');
  add(label+' · hire',daysR.mul(s.hire),eligible,'hire','Round(leg days × hire, 2)',text(daysR)+' days × '+s.hire+' USD/day');
  legResults.push({...l,days:daysR.number(),ecaDays:ecaR.number(),massMain:mainR.number(),massEca:ecaMassR.number(),massAux:auxR.number(),cost:costR.number()});
 }
 section='ports';
 for(const p of calls){
  label=p.name;const eligible=lots.filter(l=>loadOf(s,l)===p.name||l.port===p.name),cargoR=rsum(eligible.map(l=>R(l.quantity)));
  need(p.rate,p.name+': handling rate',true);for(const k of ['turn','extra','da','working','idle'])need(p[k],p.name+': '+k);
  const auxWorking=p.auxWorking===undefined?p.aux:p.auxWorking,auxIdle=p.auxIdle===undefined?p.aux:p.auxIdle;
  need(auxWorking,p.name+': Aux working');need(auxIdle,p.name+': Aux idle');
  if(!['main','eca'].includes(p.fuel))errors.push(p.name+': fuel');if(!['SHINC','manual'].includes(p.terms))errors.push(p.name+': handling terms');
  const workR=ratio(cargoR,rInput(p.rate));
  if(p.terms==='manual'){need(p.calendar,p.name+': calendar handling days',true);if(rInput(p.calendar).sub(workR).n<0n)errors.push(p.name+': calendar period is shorter than working days');}
  const calendarR=p.terms==='manual'?rInput(p.calendar):workR,idleR=rInput(p.turn).add(rInput(p.extra)).div(24).add(calendarR).sub(workR),daysR=workR.add(idleR);
  explain(section,label+' · cargo','Sum of selected sales handled at this call',eligible.map(l=>l.id+': '+l.quantity+' t').join(' + '),cargoR,'t');
  explain(section,label+' · working time','Handled cargo / handling rate',`${text(cargoR)} t / ${text(p.rate)} t/day`,workR,'days');
  explain(section,label+' · idle time','(Turn + waiting) / 24 + calendar − working days',`(${text(p.turn)} + ${text(p.extra)}) h / 24 + ${text(calendarR)} − ${text(workR)} days`,idleR,'days');
  explain(section,label+' · total time','Working + idle time',`${text(workR)} + ${text(idleR)} days`,daysR,'days');
  let boilerCost=R(0);
  if(p.boiler!==undefined&&p.boiler!==null){
   need(p.boiler,p.name+': boiler t/day');if(p.boiler!==0)need(p.boilerDays,p.name+': boiler operating time, days');
   if(p.boilerDays!==null&&p.boilerDays!==undefined){need(p.boilerDays,p.name+': boiler operating time, days');if(rInput(p.boilerDays).sub(daysR).n>0n)errors.push(p.name+': boiler operating time exceeds time in port');}
   if(p.boilerDays>0&&p.boiler>0){
    if(!['main','eca','aux'].includes(p.boilerFuel))errors.push(p.name+': boiler fuel');
    else{const mass=rInput(p.boilerDays).mul(p.boiler);explain(section,label+' · boiler mass','Boiler days × separate boiler burn',`${p.boilerDays} days × ${p.boiler} t/day`,mass,'t');boilerCost=fuelCost(p.boilerFuel,mass);}
   }
  }else if(p.boilerDays>0)errors.push(p.name+': boiler consumption is required when operating days are entered');
  const mainR=workR.mul(rInput(p.working)).add(idleR.mul(rInput(p.idle))),auxR=workR.mul(rInput(auxWorking)).add(idleR.mul(rInput(auxIdle)));
  explain(section,label+' · '+p.fuel+' mass','Working days × working burn + idle days × idle burn',`${text(workR)} × ${text(p.working)} + ${text(idleR)} × ${text(p.idle)}`,mainR,'t');
  explain(section,label+' · Aux mass','Working days × Aux working + idle days × Aux idle',`${text(workR)} × ${text(auxWorking)} + ${text(idleR)} × ${text(auxIdle)}`,auxR,'t');
  const costR=(['main','eca'].includes(p.fuel)?fuelCost(p.fuel,mainR):R(0)).add(fuelCost('aux',auxR)).add(boilerCost);
  workTotalR=workTotalR.add(workR);idleTotalR=idleTotalR.add(idleR);
  add(p.name+' · DA',rInput(p.da),eligible,'ports','Round(entered DA for this call, 2)',text(p.da)+' USD');
  add(p.name+' · fuel',costR,eligible,'fuel','Round(main + Aux + separate boiler fuel values, 2)',text(costR)+' USD');
  add(p.name+' · hire',daysR.mul(s.hire),eligible,'hire','Round(port days × hire, 2)',text(daysR)+' days × '+s.hire+' USD/day');
  portResults.push({...p,cargo:cargoR.number(),workDays:workR.number(),idleDays:idleR.number(),days:daysR.number(),cost:costR.number()});
 }
 section='extras';
 for(const c of s.costs){
  label=c.name;need(c.amount,c.name+': amount');need(c.days,c.name+': days');need(c.burn,c.name+': consumption');if(!['main','eca'].includes(c.fuel))errors.push(c.name+': fuel');
  add(c.name,rInput(c.amount),lots,'other','Round(entered additional amount, 2)',text(c.amount)+' USD');
  const mass=rInput(c.days).mul(rInput(c.burn));explain(section,label+' · fuel mass','Additional days × stop burn',`${text(c.days)} days × ${text(c.burn)} t/day`,mass,'t');
  const cost=['main','eca'].includes(c.fuel)?fuelCost(c.fuel,mass):R(0);
  add(c.name+' · fuel',cost,lots,'fuel','Round(stop fuel value, 2)',text(cost)+' USD');
  add(c.name+' · hire',rInput(c.days).mul(s.hire),lots,'hire','Round(additional days × hire, 2)',text(c.days)+' days × '+s.hire+' USD/day');
  idleTotalR=idleTotalR.add(rInput(c.days));
 }
 const totalDaysR=seaR.add(workTotalR).add(idleTotalR),days=totalDaysR.number();if(!ok(days,true))errors.push('Voyage duration');
 if(errors.length)return {errors:[...new Set(errors)],ship,budget:null};
 const totalCents=sum(rows.map(r=>r.cents));if(!Number.isSafeInteger(totalCents))throw RangeError('Amount is outside the exact monetary range');
 const allocation=lots.map(l=>({id:l.id,cents:0,quantity:l.quantity}));
 for(const row of rows){
  const weights=lots.map(l=>(s.allocation==='tonnage'||row.eligible.includes(l.id))?l.quantity:0),weightR=rsum(weights.map(R)),portions=splitCents(row.cents,weights);
  row.basis=weightR.number();row.weights=Object.fromEntries(lots.map((l,i)=>[l.id,weights[i]]));
  row.rounding=Object.fromEntries(lots.map((l,i)=>{const exact=R(row.cents).mul(weights[i]).div(weightR);return [l.id,portions[i]-Number(exact.n/exact.d)];}));
  portions.forEach((x,i)=>allocation[i].cents+=x);row.shares=Object.fromEntries(lots.map((l,i)=>[l.id,portions[i]]));
 }
 const total=totalCents/100,hireCents=sum(rows.filter(r=>r.kind==='hire').map(r=>r.cents)),hire=hireCents/100,voyageCents=totalCents-hireCents,voyage=voyageCents/100;
 const grossCents=s.freight===null?null:cents(quantityR.mul(s.freight)),commissionCents=grossCents===null?null:cents(R(grossCents).div(100).mul(s.commission).div(100)),extraCents=cents(s.extraIncome);
 const safeInteger=n=>{const v=Number(n);if(!Number.isSafeInteger(v))throw RangeError('Income or P&L is outside the exact monetary range');return v;};
 const netCents=grossCents===null?null:safeInteger(BigInt(grossCents)-BigInt(commissionCents)+BigInt(extraCents)),pnlCents=netCents===null?null:safeInteger(BigInt(netCents)-BigInt(totalCents));
 const gross=grossCents===null?null:grossCents/100,commission=commissionCents===null?null:commissionCents/100,net=netCents===null?null:netCents/100;
 const neededNetCents=Math.max(0,totalCents-extraCents),grossNeeded=R(neededNetCents).div(R(1).sub(R(s.commission).div(100))),grossNeededCents=(grossNeeded.n+grossNeeded.d-1n)/grossNeeded.d;
 const rateUnits=R(grossNeededCents).div(quantityR),quoteUnits=(rateUnits.n+rateUnits.d-1n)/rateUnits.d,requiredFreightQuote=R(quoteUnits).div(100).number();
 if(!Number.isSafeInteger(Number(quoteUnits)))throw RangeError('Covering freight quote is outside the exact monetary range');
 const requiredR=R(neededNetCents).div(100).div(quantityR.mul(R(1).sub(R(s.commission).div(100)))),unitR=R(totalCents).div(100).div(quantityR),tceR=netCents===null?null:R(BigInt(netCents)-BigInt(voyageCents)).div(100).div(totalDaysR);
 explain('totals','Selected cargo','Sum of selected sale quantities',lots.map(l=>l.id+': '+l.quantity+' t').join(' + '),quantityR,'t');
 explain('totals','Voyage time','Sea + working + idle / additional stops',`${text(seaR)} + ${text(workTotalR)} + ${text(idleTotalR)}`,totalDaysR,'days');
 for(const kind of ['hire','fuel','ports','other']){const grouped=rows.filter(row=>row.kind===kind);explain('totals',kind+' subtotal','Sum of rounded cost lines',grouped.map(row=>text(R(row.cents).div(100))).join(' + ')||'0',R(sum(grouped.map(row=>row.cents))).div(100),'USD');}
 explain('totals','Model cost','Sum of all rounded cost lines',rows.map(row=>text(R(row.cents).div(100))).join(' + '),R(totalCents).div(100),'USD');
 explain('totals','Cost excluding hire','Model cost − rounded hire subtotal',`${text(total)} − ${text(hire)}`,R(voyageCents).div(100),'USD');
 explain('totals','Model cost per tonne','Model cost / selected cargo',`${text(total)} USD / ${text(quantityR)} t`,unitR,'USD/t');
 explain('totals','Other income net','Round(entered other income, 2)',text(s.extraIncome),R(extraCents).div(100),'USD');
 if(grossCents!==null){
  explain('totals','Gross freight','Round(selected cargo × gross freight rate, 2)',`${text(quantityR)} t × ${s.freight} USD/t`,R(grossCents).div(100),'USD');
  explain('totals','Commission','Round(rounded gross freight × commission / 100, 2)',`${text(gross)} USD × ${s.commission} / 100`,R(commissionCents).div(100),'USD');
  explain('totals','Net income','Rounded gross − rounded commission + rounded other income',`${text(gross)} − ${text(commission)} + ${extraCents/100}`,R(netCents).div(100),'USD');
  explain('totals','TCE before hire','(Net income − cost excluding hire) / voyage days',`(${text(net)} − ${text(voyage)}) USD / ${text(totalDaysR)} days`,tceR,'USD/day');
  explain('totals','P&L after hire','Net income − model cost',`${text(net)} − ${text(total)}`,R(pnlCents).div(100),'USD');
 }
 explain('totals','Unrounded covering freight','max(0, cost − rounded other income) / (cargo × (1 − commission / 100))',`max(0, ${text(total)} − ${extraCents/100}) / (${text(quantityR)} × (1 − ${s.commission}/100))`,requiredR,'USD/t');
 explain('totals','Covering quote','Round required gross income UP to a cent, divide by cargo, round rate UP to a cent',`${text(grossNeeded.div(100))} USD → ${text(R(grossNeededCents).div(100))} USD / ${text(quantityR)} t → ${text(requiredFreightQuote)} USD/t`,R(quoteUnits).div(100),'USD/t');
 for(const fuel of ['main','eca','aux'])explain('totals',fuel+' consumption','Sum of all phase masses (including separate boiler)',usageParts[fuel].join(' + ')||'0',usageR[fuel],'t');
 return {errors:[],ship,budget:{q,days,sea:seaR.number(),work:workTotalR.number(),idle:idleTotalR.number(),usage:Object.fromEntries(Object.entries(usageR).map(([k,v])=>[k,v.number()])),rows,legs:legResults,ports:portResults,totalCents,total,hire,voyage,requiredFreightQuote,unit:unitR.number(),requiredFreight:requiredR.number(),gross,commission,net,tce:tceR?.number()??null,pnl:pnlCents===null?null:pnlCents/100,allocation,trace}};
}
function stageAllocations(s){if(s.stage==='load')return s.allocations;const index=s.ports.findIndex(p=>p.name===s.stage);return s.allocations.filter(a=>{const l=s.lots.find(l=>l.id===a.lot);return l&&s.ports.findIndex(p=>p.name===loadOf(s,l))<=index&&s.ports.findIndex(p=>p.name===l.port)>index;});}
function changeLoadPort(s,name,code=''){if(!name.trim()||s.ports.slice(1).some(p=>p.name===name))throw Error('Select a load port, different from the discharge port');const old=s.ports[0].name;if(old===name&&s.ports[0].code===code)return;s.lots.forEach(l=>l.loadPort=name);s.ports[0]={...port(name),code};s.legs=s.legs.filter(l=>l.from!==old&&l.to!==old);s.ballast=leg('Vessel position',name);s.stage='load';}
function addLot(s,data){if(!data.name?.trim())throw Error('Enter a cargo type');if(!ok(data.quantity,true)||!ok(data.sf,true))throw Error('Enter positive tonnage and SF');if(!['Santos','Paranaguá'].includes(data.port))throw Error('Select a discharge port');if(data.loadPort&&!LOAD_PORT.includes(data.loadPort))throw Error('Select a load port');const ids=new Set(s.lots.map(l=>l.id));let n=1;while(ids.has('S'+n))n++;s.cargoTypes??=JSON.parse(JSON.stringify(CARGO_TYPES));const known=s.cargoTypes.find(l=>l.name.toLowerCase()===data.name.trim().toLowerCase());if(known&&!isBulkCargo(known))throw Error('This product requires another carriage mode and cannot be planned in bulk carrier holds');if(!known)s.cargoTypes.push({name:data.name.trim(),group:''});const l={id:'S'+n,name:known?.name||data.name.trim(),selected:true,quantity:data.quantity,cargoId:known?.id,sf:data.sf,sfBasis:known&&data.sf===known.sfDefault?known.sfBasis:'user-entered',propertySource:known?.propertyUrl||'',hazardClass:known?.hazardClass||'',loadPort:data.loadPort||'Ust-Luga',port:data.port,color:'hsl('+((n*137.508)%360).toFixed(2)+' 48% 64%)',group:known?.group||'',un:known?.un||''};s.lots.push(l);return l;}
function ensureBusinessData(s){
 const migratePorts=!Array.isArray(s.portRecords);
 s.sales??=[];s.portRecords??=[];
 for(const l of s.lots){
  if(l.saleId)continue;
  let sale=s.sales.find(x=>x.legacyLotId===l.id);
  if(!sale){sale={id:'SALE-'+l.id,legacyLotId:l.id,dealDate:'',cargoId:l.cargoId||'',cargoName:l.name,quantity:l.quantity,loadPort:l.loadPort||'Ust-Luga',dischargePort:l.port,shipmentFrom:'',shipmentTo:'',fob:null};s.sales.push(sale);}
  l.saleId=sale.id;
 }
 if(migratePorts)for(const name of [...new Set(s.ports.map(p=>p.name))])s.portRecords.push({id:'P'+(s.portRecords.length+1),name,terminal:'',restrictions:'',da:s.ports.find(p=>p.name===name)?.da??null});
}
function syncSalesToLots(s){ensureBusinessData(s);for(const l of s.lots){const sale=s.sales.find(x=>x.id===l.saleId);if(sale){l.quantity=sale.quantity;l.loadPort=sale.loadPort;l.port=sale.dischargePort;}}syncRoute(s);}
function validateSale(s,data,{legacy=false}={}){
 const cargo=s.cargoTypes.find(c=>c.id===data.cargoId);
 if(!cargo||!isBulkCargo(cargo))throw Error('Select a bulk cargo from CARGO');
 if(!ok(data.quantity,true))throw Error('Enter a positive sale quantity');
 if(!(legacy&&data.fob===null)&&!ok(data.fob))throw Error('Enter a non-negative FOB price');
 const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
 if(!(legacy&&!data.dealDate&&!data.shipmentFrom&&!data.shipmentTo)&&![data.dealDate,data.shipmentFrom,data.shipmentTo].every(validDate))throw Error('Enter valid deal and shipment dates');
 if(data.shipmentFrom>data.shipmentTo)throw Error('Shipment start cannot be later than shipment end');
 const load=s.portRecords.find(p=>p.name===data.loadPort),discharge=s.portRecords.find(p=>p.name===data.dischargePort);
 if(!load||!discharge||!load.name.trim()||!discharge.name.trim())throw Error('Select load and discharge ports from PORT');
 if(load.name===discharge.name)throw Error('Load and discharge ports must be different');
 return {...data,loadPortId:load.id,dischargePortId:discharge.id,cargoName:cargo.name};
}
function addSale(s,data){
 ensureCatalogs(s);
 const validated=validateSale(s,data);
 let n=1;while(s.sales.some(x=>x.id==='SALE-'+n))n++;
 const sale={...validated,id:'SALE-'+n};s.sales.push(sale);return sale;
}
function updateSale(s,id,changes){
 const index=s.sales.findIndex(x=>x.id===id);if(index<0)throw Error('Sale not found');
 const previous=s.sales[index],candidate={...previous,...changes,id:previous.id};
 const validated=validateSale(s,candidate,{legacy:!!previous.legacyLotId});
 s.sales[index]=validated;syncSalesToLots(s);return validated;
}
function removePortRecord(s,index){
 const record=s.portRecords[index];if(!record)return;
 if(s.sales.some(x=>x.loadPort===record.name||x.dischargePort===record.name)||s.lots.some(x=>x.loadPort===record.name||x.port===record.name))throw Error('This port is used by a sale. Reassign the sale before removing the port.');
 s.portRecords.splice(index,1);
}
function updatePortRecord(s,index,key,value){
 const record=s.portRecords[index];if(!record)throw Error('Port not found');
 if(key==='name'){
  value=value.trim();
  if(!value)throw Error('Enter a port name');
  if(s.portRecords.some((p,i)=>i!==index&&p.name===value))throw Error('This port name already exists');
  if(value!==record.name&&(s.sales.some(x=>x.loadPort===record.name||x.dischargePort===record.name)||s.lots.some(x=>x.loadPort===record.name||x.port===record.name)))throw Error('This port is used by a sale. Reassign the sale before renaming the port.');
 }
 if(key==='da'&&value!==null&&!ok(value))throw Error('DA must be non-negative');
 record[key]=value;return record;
}
function addSaleToPlanner(s,saleId){ensureCatalogs(s);const sale=s.sales.find(x=>x.id===saleId);if(!sale)throw Error('Sale not found');validateSale(s,sale,{legacy:!!sale.legacyLotId});if(s.lots.some(l=>l.saleId===saleId))throw Error('Sale is already added to PLANNER');const cargo=s.cargoTypes.find(c=>c.id===sale.cargoId);if(!cargo||!isBulkCargo(cargo))throw Error('This cargo is unavailable for bulk planning');const ids=new Set(s.lots.map(l=>l.id));let n=1;while(ids.has('S'+n))n++;const l={id:'S'+n,saleId:sale.id,name:cargo.name,selected:true,quantity:sale.quantity,cargoId:cargo.id,sf:cargo.sf,sfBasis:cargo.sf===cargo.sfDefault?cargo.sfBasis:'catalog',propertySource:cargo.propertyUrl||'',hazardClass:cargo.hazardClass||'',loadPort:sale.loadPort,port:sale.dischargePort,color:'hsl('+((n*137.508)%360).toFixed(2)+' 48% 64%)',group:cargo.group||'',un:cargo.un||''};s.lots.push(l);syncRoute(s);return l;}
function syncRoute(s){const alias={"Ust'-Luga":'Ust-Luga','Saint Petersburg (ex Leningrad)':'St. Petersburg'};for(const l of s.lots)l.loadPort??=alias[s.ports[0]?.name]||s.ports[0]?.name||'Ust-Luga';const selected=active(s),loadNames=[...new Set(selected.map(l=>l.loadPort).filter(Boolean))],dischargeNames=[...new Set(selected.map(l=>l.port).filter(Boolean))],needed=new Set([...loadNames,...dischargeNames]),old=s.ports;s.portCache??={};for(const p of old)s.portCache[p.name]=JSON.parse(JSON.stringify(p));const ordered=[...old.map(p=>alias[p.name]||p.name).filter(n=>needed.has(n)),...loadNames.filter(n=>!old.some(p=>(alias[p.name]||p.name)===n)),...dischargeNames.filter(n=>!old.some(p=>(alias[p.name]||p.name)===n))];const unique=[...new Set(ordered)];unique.sort((a,b)=>(loadNames.includes(a)?0:1)-(loadNames.includes(b)?0:1));s.ports=unique.map(name=>{const found=old.find(p=>(alias[p.name]||p.name)===name)||s.portCache[name],record=s.portRecords?.find(p=>p.name===name);return found?{...found,name,da:found.da??record?.da??null}:{...port(name),da:record?.da??null,...(s.vesselSnapshot?{working:s.vesselSnapshot.working,idle:s.vesselSnapshot.idle,aux:s.vesselSnapshot.aux,auxWorking:s.vesselSnapshot.auxWorking,auxIdle:s.vesselSnapshot.auxIdle,boiler:s.vesselSnapshot.boiler,boilerDays:null,boilerFuel:null}:{})};});const calls=callsOf(s);if(calls.length&&s.ballast.to!==calls[0].name)s.ballast={...leg('Vessel position',calls[0].name),...(s.vesselSnapshot?{speed:s.vesselSnapshot.ballastSpeed,burn:s.vesselSnapshot.ballastBurn,ecaBurn:s.vesselSnapshot.ecaBurn,aux:s.vesselSnapshot.aux}:{})};for(let i=1;i<calls.length;i++)if(!s.legs.some(l=>l.from===calls[i-1].name&&l.to===calls[i].name))s.legs.push({...leg(calls[i-1].name,calls[i].name),...(s.vesselSnapshot?{speed:s.vesselSnapshot.speed,burn:s.vesselSnapshot.burn,ecaBurn:s.vesselSnapshot.ecaBurn,aux:s.vesselSnapshot.aux}:{})});if(s.stage!=='load'&&!s.ports.some(p=>p.name===s.stage))s.stage='load';}
function moveCall(s,name,direction){if(![-1,1].includes(direction))return false;const loadNames=new Set(active(s).map(l=>l.loadPort)),isLoad=loadNames.has(name),group=callsOf(s).filter(p=>loadNames.has(p.name)===isLoad);const index=group.findIndex(p=>p.name===name),target=index+direction;if(index<0||target<0||target>=group.length)return false;const a=s.ports.indexOf(group[index]),b=s.ports.indexOf(group[target]);[s.ports[a],s.ports[b]]=[s.ports[b],s.ports[a]];syncRoute(s);s.stage='load';return true;}
function ensureCatalogs(s){s.cargoTypes??=JSON.parse(JSON.stringify(CARGO_TYPES));CargoCatalog.merge(s);s.cargoTypes.forEach((c,i)=>{c.id??='cargo-'+(i+1);c.sf??=null;c.source??='';});s.lots.forEach(l=>{const c=s.cargoTypes.find(c=>c.id===l.cargoId)||s.cargoTypes.find(c=>c.name===l.name);l.cargoId??=c?.id;l.group??=c?.group||'';l.un??=c?.un||'';});if(!s.vesselProfiles){s.vesselProfiles=JSON.parse(JSON.stringify(VESSELS));}ensureBusinessData(s);mergeRequestedCatalogs(s);mergePortProfiles(s);}
function applyCargo(s,id){ensureCatalogs(s);const c=s.cargoTypes.find(c=>c.id===id);if(c&&!isBulkCargo(c))throw Error('This product is unavailable for bulk calculation');if(!c||!c.name.trim()||!ok(c.sf,true))throw Error('Enter a name and a positive SF');if(!['','A','B','C','A & B'].includes(c.group))throw Error('Check the cargo group');for(const l of s.lots.filter(l=>l.cargoId===id)){Object.assign(l,{name:c.name,sf:c.sf,sfBasis:c.sf===c.sfDefault?c.sfBasis:'user-entered',propertySource:c.propertyUrl||'',hazardClass:c.hazardClass||'',group:c.group,un:c.un||''});} }
function applyVessel(s,id){ensureCatalogs(s);const v=s.vesselProfiles.find(v=>v.id===id);if(!v||!v.name.trim())throw Error('Enter a vessel name');for(const k of ['dwt','draft','tpc','loa','beam','grain','speed','ballastSpeed'])if(!ok(v[k],true))throw Error('Check vessel parameter: '+k);for(const k of ['bale','gt','nrt','tanktop','boiler'])if(v[k]!==null&&v[k]!==undefined&&!ok(v[k]))throw Error('Check vessel parameter: '+k);for(const k of ['burn','ballastBurn','working','idle','aux','auxWorking','auxIdle'])if(!ok(v[k]))throw Error('Check consumption: '+k);if(v.ecaBurn!==null&&!ok(v.ecaBurn))throw Error('Check consumption ECA');if(v.holdData.some(h=>!ok(h.volume,true)||(h.massLimit!==null&&!ok(h.massLimit,true))))throw Error('Check hold parameters');if(!v.holdData.length)throw Error('Add holds');v.holds=v.holdData.length;s.vesselId=id;s.vesselSnapshot=JSON.parse(JSON.stringify(v));s.holds=JSON.parse(JSON.stringify(v.holdData));s.legs.forEach(l=>Object.assign(l,{speed:v.speed,burn:v.burn,ecaBurn:v.ecaBurn,aux:v.aux}));Object.assign(s.ballast,{speed:v.ballastSpeed,burn:v.ballastBurn,ecaBurn:v.ecaBurn,aux:v.aux});[...s.ports,...Object.values(s.portCache||{})].forEach(p=>Object.assign(p,{working:v.working,idle:v.idle,aux:v.aux,auxWorking:v.auxWorking,auxIdle:v.auxIdle,boiler:v.boiler,boilerDays:p.boilerDays??null,boilerFuel:p.boilerFuel??null}));}
function migrateBaltic(s){ensureCatalogs(s);if(s.tbnSourceRevision===VESSELS[0].revision)return false;s.previousVesselProfile={profile:s.vesselProfiles.find(v=>v.id==='tbn-1'),snapshot:s.vesselSnapshot,holds:JSON.parse(JSON.stringify(s.holds)),constant:s.deductions.constant};for(const standard of VESSELS){const i=s.vesselProfiles.findIndex(v=>v.id===standard.id);const copy=JSON.parse(JSON.stringify(standard));if(i<0)s.vesselProfiles.push(copy);else s.vesselProfiles[i]=copy;}applyVessel(s,s.vesselProfiles.some(v=>v.id===s.vesselId)?s.vesselId:'tbn-1');s.tbnSourceRevision=VESSELS[0].revision;return true;}
function anonymizeProfiles(s){
 const oldDefaults={"\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0439 \u0431\u0430\u043b\u043a\u0435\u0440":"Standard bulk carrier","\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c TBN 1":"Standard profile TBN 1","\u0420\u043e\u0441\u0441\u0438\u044f \u2192 \u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f":"Russia → Brazil"};
 const clean=v=>{
  if(!v)return;
  if(v.id==='tbn-1'&&v.revision&&!['standard-tbn1-v1','standard-vessels-2026-09-07','custom'].includes(v.revision)){v.model='Standard bulk carrier';v.source='Standard profile TBN 1';v.revision='standard-tbn1-v1';}
  for(const field of ['model','source','direction'])if(Object.hasOwn(oldDefaults,v[field]))v[field]=oldDefaults[v[field]];
  delete v.imo;delete v.imo_number;delete v.vessel_name;
 };
 s.vesselProfiles?.forEach(clean);clean(s.vesselSnapshot);
 if(s.previousVesselProfile){clean(s.previousVesselProfile.profile);clean(s.previousVesselProfile.snapshot);}
 if(s.ballast?.from==="\u041f\u043e\u0437\u0438\u0446\u0438\u044f \u0441\u0443\u0434\u043d\u0430")s.ballast.from='Vessel position';
 for(const item of s.costs||[])if(item.name==="\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u0430\u044f \u0441\u0442\u0430\u0442\u044c\u044f")item.name='Additional item';
}
function addVesselType(s){ensureCatalogs(s);let n=1;while(s.vesselProfiles.some(v=>v.id==='type-'+n))n++;const base=s.vesselProfiles.find(v=>v.id===s.vesselId)||s.vesselProfiles[0];const v=JSON.parse(JSON.stringify(base));v.id='type-'+n;v.name='New type '+n;v.source='Parameters copied from '+base.name;v.model='Standard bulk carrier';v.revision='custom';s.vesselProfiles.push(v);return v;}
const api={validateSale,updateSale,removePortRecord,updatePortRecord,PORT_PROFILES,portProfileOf,isBulkCargo,anonymizeProfiles,addVesselType,migrateBaltic,ensureCatalogs,ensureBusinessData,syncSalesToLots,addSale,addSaleToPlanner,applyCargo,applyVessel,VESSELS,vesselOf,moveCall,LOAD_PORT,loadOf,callsOf,syncRoute,CARGO_TYPES,changeLoadPort,addLot,initial,demo,allocate,stowage,compute,stageAllocations,splitCents,ok};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXModel=api;
})(globalThis);
