'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),M=require('./model'),P=require('./planning');
const {Rational:R}=require('./arithmetic');
const base=()=>{const s=M.demo();P.ensure(s);return s;};
const nearly=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('Physical sums preserve decimal SF and reconcile declared grain without rewriting inputs',()=>{const s=base();s.lots[0].quantity=30000;s.lots[0].sf=.955;s.lots[1].selected=false;assert.equal(M.cargoVolume(s).volume,28650);const initial=M.initial();assert.equal(P.grain(initial).total,45516.8);assert.equal(P.grain(initial).difference,-.2);assert.equal(M.vesselOf(initial).grain,45517);});
test('Arrival and departure have different cargo balances; unassigned remains a loading-plan residual',()=>{const s=base(),events=P.events(s),arrival=events.find(e=>e.call.name==='Santos'&&e.phase==='arrival'),departure=events.find(e=>e.call.name==='Santos'&&e.phase==='departure');assert.equal(P.stageSummary(s,arrival.key).quantity,30000);assert.equal(P.stageSummary(s,departure.key).quantity,6000);assert.equal(P.stageSummary(s,departure.key).rows[0].unassigned,0);assert.equal(P.stageSummary(s,departure.key).rows[0].onBoard,0);assert.ok(P.stageSummary(s,departure.key).allocations.every(a=>a.lot==='S2'));s.stage=arrival.key;M.syncRoute(s);assert.equal(s.stage,arrival.key);});
test('Early loading stage excludes cargo not yet loaded',()=>{const s=base();s.lots[1].loadPort='Murmansk';M.syncRoute(s);P.ensure(s);const e=P.events(s).find(e=>e.call.name==='Murmansk'&&e.phase==='arrival');assert.equal(P.stageSummary(s,e.key).quantity,24000);});
test('New solver handles the order-dependent counterexample and preserves exact tonnes',()=>{for(const reverse of [false,true]){const s=base();s.holds=[{id:1,volume:10,massLimit:null},{id:2,volume:20,massLimit:null}];s.lots.forEach((l,i)=>Object.assign(l,{quantity:i?10:20,sf:1}));if(reverse)s.lots.reverse();const result=P.solve(s);assert.equal(result.status,'feasible');assert.equal(result.allocations.find(a=>a.lot==='S1').hold,2);assert.equal(result.allocations.find(a=>a.lot==='S2').hold,1);}});
test('Independent exhaustive ownership oracle agrees on 128 small packing problems',()=>{let seed=83;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed%12+1;};for(let k=0;k<128;k++){const capacities=[rnd(),rnd(),rnd()],quantities=[rnd(),rnd()];let feasible=false;for(let mask=0;mask<27;mask++){let m=mask,sums=[0,0];for(let h=0;h<3;h++){const owner=m%3;m=Math.floor(m/3);if(owner<2)sums[owner]+=capacities[h];}if(sums.every((q,i)=>q>=quantities[i]))feasible=true;}const s=base();s.holds=capacities.map((volume,i)=>({id:i+1,volume,massLimit:null}));s.lots.forEach((l,i)=>Object.assign(l,{quantity:quantities[i],sf:1}));const out=P.solve(s);assert.equal(out.status==='feasible',feasible,JSON.stringify({capacities,quantities,out}));if(feasible){const check=M.stowage({...s,allocations:out.allocations});assert.deepEqual(check.errors,[]);check.remaining.forEach(r=>nearly(r.quantity,0));}}});
test('Solver keeps one parcel distributed over all holds, uses bounded decimal quantities',()=>{const s=base();s.lots[1].selected=false;s.lots[0].quantity=10000.0001;const result=P.solve(s);assert.equal(result.status,'feasible');assert.equal(result.allocations.length,5);const q=result.allocations.reduce((sum,a)=>sum.add(a.quantity),R.from(0));assert.equal(q.sub(s.lots[0].quantity).n,0n);result.allocations.forEach(a=>assert.ok(String(a.quantity).length<15));});
test('Infeasible and interrupted searches never replace a manual plan',()=>{const s=base(),old=JSON.stringify(s.allocations);s.holds.forEach(h=>h.volume=1);assert.equal(P.solve(s).status,'no-solution-in-search-model');assert.throws(()=>P.applyPlan(s,P.solve(s)));assert.equal(JSON.stringify(s.allocations),old);const other=base();assert.equal(P.solve(other,0).status,'search-limit');});
test('Apply and undo preserve the exact manual allocation and survive serialization',()=>{let s=base();const old=JSON.stringify(s.allocations);P.applyPlan(s,P.solve(s));s=JSON.parse(JSON.stringify(s));P.undo(s);assert.equal(JSON.stringify(s.allocations),old);P.applyPlan(s,P.solve(s));s.holds[0].volume++;assert.throws(()=>P.undo(s),/changed/);});
test('Known limits and separation requirements are validated independently from solver output',()=>{const s=base();s.planning.limits=[{stage:'load',holds:[1,2],max:100,source:'Manual'}];assert.ok(P.check(s).errors.some(x=>x.includes('mass limit')));s.planning.compatibility=[{a:'S1',b:'S2',rule:'non-adjacent',source:'Declared separation'}];s.allocations=[{lot:'S1',hold:1,quantity:100},{lot:'S2',hold:2,quantity:100}];assert.ok(P.check(s).errors.some(x=>x.includes('separation')));});
test('Departure passes while arrival has the documented 400 tonne excess',()=>{const s=base(),e=P.events(s),load=e.find(x=>x.phase==='departure'&&x.call.name==='Ust-Luga'),arrival=e.find(x=>x.phase==='arrival'&&x.call.name==='Santos');load.call.planning.departure={allowableDwt:32500,fuel:1000,water:200,ballast:300,constant:500};arrival.call.planning.arrival={allowableDwt:31200,fuel:600,water:200,ballast:300,constant:500};assert.equal(P.stateCheck(s,load).margin,500);assert.equal(P.stateCheck(s,arrival).margin,-400);assert.ok(P.stateCheck(s,arrival).issues.some(x=>x.includes('400.000')));});
test('Unknown non-cargo masses do not become zero and displacement does not subtract draft loss twice',()=>{const s=base(),e=P.events(s)[0];e.call.planning.arrival={allowableDwt:32000,fuel:0,water:0,constant:0};assert.equal(P.stateCheck(s,e).limit,null);s.planning.vesselBasis={lightship:5000,vesselKey:JSON.stringify(M.vesselOf(s)),kind:'nominated'};s.deductions.draftLoss=1200;e.call.planning.arrival={mode:'displacement',displacement:37000,fuel:1000,water:200,ballast:300,constant:500};assert.equal(P.stateCheck(s,e).limit,30000);});
test('Berth screening uses state draft rather than reference profile draft',()=>{const s=base(),e=P.events(s).find(e=>e.call.name==='Santos'),berth=s.portRecords.find(p=>p.name==='Santos');berth.maxDraft=8;e.call.planning.berthId=berth.id;e.call.planning.arrival={draft:7};assert.ok(!P.stateCheck(s,e).issues.some(x=>x.includes('State draft')));e.call.planning.arrival.draft=9;assert.ok(P.stateCheck(s,e).issues.some(x=>x.includes('State draft')));});
test('Unit normalization distinguishes three kinds of ton and density basis',()=>{assert.equal(P.sfValue(800,'kg/m3'),1.25);assert.equal(P.sfValue(1,'ft3/metric-ton'),.028316846592);nearly(P.sfValue(1,'ft3/long-ton'),.027869625);assert.ok(P.sfValue(1,'ft3/short-ton')>P.sfValue(1,'ft3/metric-ton'));assert.throws(()=>P.sfValue(1,'ft3/ton'));});
const passport=()=>({value:.955,unit:'m3/t',basis:'declared',source:'Declaration 1',date:'2026-09-08',bcsn:'Declared material',group:'C',minSf:.9,maxSf:1});
test('Shipment properties retain versions and are not changed by catalogue edits',()=>{const s=base(),old=s.lots[0].sf;P.updatePassport(s,'S1',passport());s.cargoTypes[0].sf=1.2;M.ensureCatalogs(s);M.applyCargo(s,s.cargoTypes[0].id);assert.equal(s.lots[0].sf,.955);assert.equal(s.lots[0].passport.history[0].value,old);assert.equal(s.lots[0].passport.version,2);assert.throws(()=>P.updatePassport(s,'S1',{...passport(),source:''}));});
test('Planned quantity needs explicit permission and survives SALE synchronization',()=>{const s=base();assert.throws(()=>P.updatePassport(s,'S1',{...passport(),plannedQuantity:10000}));P.updatePassport(s,'S1',{...passport(),plannedQuantity:10000,quantitySource:'Split allowed',splitAllowed:true,minQuantity:9000,maxQuantity:12000});M.syncSalesToLots(s);assert.equal(s.lots[0].quantity,10000);assert.equal(s.sales[0].quantity,24000);});
test('Technical review covers explicit states and invalidates on berth input changes',()=>{const s=base(),first=P.events(s)[0];P.addReport(s,{reference:'Report',reviewer:'Surveyor',date:'2026-09-08',result:'accepted',covered:[first.key]});assert.equal(P.reportStatus(s),'partial');P.addReport(s,{reference:'Report all',reviewer:'Surveyor',date:'2026-09-08',result:'accepted',covered:P.events(s).map(e=>e.key)});assert.equal(P.reportStatus(s),'accepted');const c=s.ports[0];c.planning.berthId=s.portRecords.find(p=>p.name===c.name).id;assert.equal(P.reportStatus(s),'outdated');});
test('A saved snapshot remains reproducible after inputs change and after reload',()=>{const s=base(),x=P.freeze(s),original=JSON.stringify(x.input);s.lots[0].quantity=1;s.holds[0].volume=2;P.ensure(s);assert.equal(JSON.stringify(s.planning.snapshots[0].input),original);assert.equal(JSON.stringify(JSON.parse(JSON.stringify(s)).planning.snapshots[0].input),original);});
test('Invalid chronological events and shipment window differences are explicit',()=>{const s=base(),c=s.ports[0];c.planning.arrival.plannedAt='2026-09-10T10:00+03:00';c.planning.departure.plannedAt='2026-09-09T10:00+03:00';assert.ok(P.check(s).errors.some(x=>x.includes('previous event')));});

function draftFixture(){const s=base(),v=M.vesselOf(s);Object.assign(v,{dwt:30000,draft:10,tpc:50});s.planning.vesselBasis={kind:'reference',vesselKey:JSON.stringify(v),density:1.025,lightship:5000,source:'Particulars',date:'2026-09-08',dwtBasis:'Summer',tpcRangeCm:100,tpcSource:'Hydrostatic range'};Object.assign(s.deductions,{fuel:500,water:100,ballast:0,constant:400});for(const c of s.ports){const b=s.portRecords.find(p=>p.name===c.name);Object.assign(b,{maxDraft:9.8,waterDensity:1.025});c.planning.berthId=b.id;for(const phase of ['arrival','departure'])Object.assign(c.planning[phase],{fuel:500,water:100,ballast:0,constant:400,source:'Stores',date:'2026-09-08'});}return s;}
test('Draft estimate reconciles TPC and density without a fresh-water cargo bonus',()=>{const s=draftFixture();nearly(P.draftEstimate(s).loss,1000);for(const b of s.portRecords)b.waterDensity=1;const r=P.draftEstimate(s);nearly(r.limiting.allowedDwt,34000/1.025-5000);assert.ok(r.loss>1000);for(const b of s.portRecords){b.waterDensity=1.025;b.maxDraft=10.5;}nearly(P.draftEstimate(s).loss,0);});
test('Draft estimate uses state stores and requires range and all full-load states',()=>{const s=draftFixture(),c=s.ports.find(c=>c.name==='Santos');c.planning.arrival.fuel=200;nearly(P.draftEstimate(s).loss,1000);s.ports[0].planning.departure.fuel=100;nearly(P.draftEstimate(s).loss,700);s.planning.vesselBasis.tpcRangeCm=10;assert.equal(P.draftEstimate(s).loss,null);assert.throws(()=>P.applyDraftEstimate(s,P.inputKey(s)));s.planning.vesselBasis.tpcRangeCm=100;delete c.planning.arrival.water;assert.equal(P.draftEstimate(s).loss,null);});
test('Density selection validates, clears and invalidates a draft preview',()=>{const s=draftFixture(),key=P.inputKey(s),idx=s.portRecords.findIndex(p=>p.id===s.ports[0].planning.berthId);M.updatePortRecord(s,idx,'waterDensity','1.02');assert.equal(s.portRecords[idx].waterDensity,1.02);assert.throws(()=>P.applyDraftEstimate(s,key));assert.throws(()=>M.updatePortRecord(s,idx,'waterDensity','1020'));M.updatePortRecord(s,idx,'waterDensity','');assert.equal(s.portRecords[idx].waterDensity,null);assert.equal(P.draftEstimate(s).complete,false);});
test('Applying a draft estimate preserves evidence and never deducts old draft loss twice',()=>{const s=draftFixture();s.deductions.draftLoss=999;const r=P.applyDraftEstimate(s,P.inputKey(s));nearly(s.deductions.draftLoss,1000);assert.equal(s.planning.draftEstimate.rows.length,P.events(s).length);nearly(P.draftEstimate(s).loss,r.loss);assert.ok(!P.check(s).warnings.some(x=>x.includes('draft loss estimate is outdated')));s.portRecords.find(p=>p.id===s.ports[0].planning.berthId).waterDensity=1.02;assert.ok(P.check(s).warnings.some(x=>x.includes('draft loss estimate is outdated')));});

test('Automatic draft loss requires no source forms and follows vessel and route limits',()=>{const s=base();for(const b of s.portRecords){b.maxDraft=20;b.waterDensity=1.025;}const first=s.portRecords.find(p=>p.name===s.ports[0].name);first.maxDraft=M.vesselOf(s).draft-.3;nearly(P.syncAutoDraftLoss(s).loss,M.vesselOf(s).tpc*30);assert.equal(s.planning.vesselBasis,undefined);first.maxDraft=20;nearly(P.syncAutoDraftLoss(s).loss,0);first.maxDraft=null;assert.equal(P.syncAutoDraftLoss(s).loss,null);});
test('Automatic density correction never invents lightship or changes the selected berth',()=>{const s=base();for(const b of s.portRecords){b.maxDraft=M.vesselOf(s).draft;b.waterDensity=1;}let r=P.autoDraftLoss(s);assert.ok(r.warnings.some(x=>x.includes('needs lightship')));assert.ok(!r.rows.some(x=>x.densityApplied));assert.equal(r.loss,0);const v=M.vesselOf(s);s.planning.vesselBasis={lightship:5000,density:1.025,vesselKey:JSON.stringify(v)};r=P.autoDraftLoss(s);assert.ok(r.loss>0);assert.ok(s.ports.every(c=>!c.planning.berthId));});

test('A voyage with no draft restriction says so and names the shallowest limit',()=>{
 const s=M.demo();M.applyVessel(s,'tbn-1');P.ensure(s);
 const r=P.autoDraftLoss(s);
 assert.equal(r.loss,0,'a 9.85 m draft clears every limit on this rotation');
 assert.match(r.reason,/^No draft restriction/,'zero reads as an answer, not a failure');
 assert.equal(r.limiting.call,'Santos','the tightest call is named, not the first');
 assert.ok(r.rows.every(x=>x.maxDraft>=r.limiting.maxDraft),'no call has a shallower limit');
 const deep=M.demo();M.applyVessel(deep,'tbn-3');P.ensure(deep);
 const restricted=P.autoDraftLoss(deep);
 assert.ok(restricted.loss>0);
 assert.match(restricted.reason,/^TPC estimate · Santos/,'a real restriction still names its call');
});

test('The density note names the actual obstacle, not a generic one',()=>{
 const basis=s=>({vesselKey:JSON.stringify(M.vesselOf(s)),kind:'reference',source:'P',date:'2026-09-08',dwtBasis:'Summer SW',density:1.025,lightship:10800,tpcRangeCm:200,tpcSource:'Hydro'});
 const fresh=M.demo();M.applyVessel(fresh,'tbn-3');P.ensure(fresh);
 assert.match(P.autoDraftLoss(fresh).densityNote,/enter lightship in Vessel source/,'nothing recorded yet');
 const stale=M.demo();M.applyVessel(stale,'tbn-1');P.ensure(stale);stale.planning.vesselBasis=basis(stale);
 M.applyVessel(stale,'tbn-3');
 const note=P.autoDraftLoss(stale).densityNote;
 assert.match(note,/recorded for another vessel/,'lightship was entered, so asking for it again would be wrong');
 assert.doesNotMatch(note,/enter lightship/,'the stale basis must not read as a missing lightship');
 const ready=M.demo();M.applyVessel(ready,'tbn-3');P.ensure(ready);ready.planning.vesselBasis=basis(ready);
 const r=P.autoDraftLoss(ready);
 assert.equal(r.densityNote,null,'a complete basis leaves no note');
 assert.ok(r.rows.every(x=>x.densityApplied),'and every call is density corrected');
});

test('Draft loss follows the load-line arithmetic and reproduces the reference calculator',()=>{
 // Reference intake calculator: 57,329 DWT, 12.80 m SSW, TPC 58.94, stores 1,600 t, lightship 10,426 t.
 const s=M.demo();const v=M.vesselOf(s);v.dwt=57329;v.draft=12.80;v.tpc=58.94;s.vesselSnapshot={...v};
 s.deductions={fuel:1000,water:400,ballast:0,constant:200,draftLoss:0};
 P.ensure(s);
 s.planning.vesselBasis={vesselKey:JSON.stringify(M.vesselOf(s)),kind:'reference',source:'ref',date:'2026-09-08',dwtBasis:'Summer SW',density:1.025,lightship:10426,tpcRangeCm:400,tpcSource:'Hydrostatics'};
 const load=s.portRecords.find(p=>p.name==='Ust-Luga'),discharge=s.portRecords.find(p=>p.name==='Santos');
 discharge.maxDraft=99;discharge.waterDensity=1.025;
 const intakeAt=(density,limit)=>{load.waterDensity=density;load.maxDraft=limit;return 57329-1600-P.autoDraftLoss(s).loss;};
 assert.equal(Math.round(intakeAt(1,11.00)),43726,'Saint Petersburg 11 m fresh matches the reference to the tonne');
 assert.ok(Math.abs(Math.round(intakeAt(1.0124,11.30))-46161)<=8,'Santos 11.3 m brackish is within the reference density preset');
 assert.equal(Math.round(intakeAt(1,13.10)),55729,'a berth deeper than the permissible draft takes nothing');
 const row=P.autoDraftLoss(s).rows.find(x=>x.call==='Ust-Luga');
 assert.ok(Math.abs(row.fwaCm-28.74)<0.02,'FWA = displacement / (40 × TPC)');
 assert.ok(Math.abs(row.dwaCm-row.fwaCm)<1e-9,'fresh water takes the whole allowance');
 assert.ok(Math.abs(row.tpcPort-v.tpc/1.025)<1e-9,'TPC is scaled into the water the ship floats in');
});

test('The berth limit bites on the deepest recorded draft, not the mean',()=>{
 const s=M.demo();P.ensure(s);
 const call=s.ports.find(p=>p.name==='Santos'),berth=s.portRecords.find(p=>p.name==='Santos');
 berth.maxDraft=10.3;call.planning.berthId=berth.id;
 Object.assign(call.planning.arrival,{aft:10.4,mid:10.2,fwd:10.0,source:'Survey',date:'2026-09-08',allowableDwt:35000,fuel:400,water:150,ballast:0,constant:450});
 const event=P.events(s).find(e=>e.call.name==='Santos'&&e.phase==='arrival');
 assert.ok(P.stateCheck(s,event).issues.some(x=>x.includes('State draft 10.4 exceeds 10.3')),'a trimmed-by-the-stern arrival is caught');
 Object.assign(call.planning.arrival,{aft:10.2,mid:10.1,fwd:10.0});
 assert.ok(!P.stateCheck(s,event).issues.some(x=>x.includes('State draft')),'all three inside the limit passes');
 delete call.planning.arrival.aft;delete call.planning.arrival.mid;delete call.planning.arrival.fwd;
 call.planning.arrival.draft=10.5;
 assert.ok(P.stateCheck(s,event).issues.some(x=>x.includes('10.5 exceeds 10.3')),'the single draft field still works when no survey is recorded');
});

function loadedFixture(){
 const s=base(),v=M.vesselOf(s);Object.assign(v,{dwt:30000,draft:10,tpc:50});s.vesselSnapshot={...v};
 s.lots[0].quantity=20000;s.lots[1].quantity=4000;s.sales.forEach(x=>x.quantity=24000);
 s.allocations=M.allocate(s);
 s.planning.vesselBasis={kind:'reference',vesselKey:JSON.stringify(M.vesselOf(s)),density:1.025,lightship:5000,source:'Particulars',date:'2026-09-08',dwtBasis:'Summer',tpcRangeCm:150,tpcSource:'Hydrostatic range'};
 Object.assign(s.deductions,{fuel:500,water:100,ballast:0,constant:400});
 for(const c of s.ports){const b=s.portRecords.find(p=>p.name===c.name);Object.assign(b,{maxDraft:12,waterDensity:1.025});c.planning.berthId=b.id;
  for(const phase of ['arrival','departure'])Object.assign(c.planning[phase],{fuel:500,water:100,ballast:0,constant:400,source:'Stores',date:'2026-09-08'});}
 return s;
}
const departure=(s,name)=>P.stateDrafts(s).find(r=>r.call===name&&r.phase==='departure');
test('A state draft follows its own deadweight and the water the ship floats in',()=>{
 const s=loadedFixture(),row=departure(s,'Ust-Luga');
 assert.equal(row.cargo,24000,'the stowage plan supplies the cargo on board');
 nearly(row.deadweight,25000);nearly(row.displacement,30000);
 // 5000 t short of the reference deadweight lifts her 5000 / 50 = 100 cm off the 10 m load line.
 nearly(row.mean,9);assert.equal(row.basis,'computed');
 s.portRecords.find(p=>p.id===s.ports[0].planning.berthId).waterDensity=1;
 // Fresh water sinks her by the state's own FWA: 30000 / (40 × 50) = 15 cm.
 nearly(departure(s,'Ust-Luga').mean,9.15);
 assert.ok(departure(s,'Ust-Luga').densityApplied);
 delete s.planning.vesselBasis.lightship;
 const off=departure(s,'Ust-Luga');nearly(off.mean,9);
 assert.ok(!off.densityApplied&&off.notes.some(x=>x.includes('enter lightship')),'the correction names what it lacks instead of guessing');
});
test('Discharging and burning bunkers lift the ship between states',()=>{
 const s=loadedFixture();
 const rows=P.stateDrafts(s),at=(name,phase)=>rows.find(r=>r.call===name&&r.phase===phase);
 assert.ok(at('Ust-Luga','arrival').mean<at('Ust-Luga','departure').mean,'she arrives at the load berth empty and leaves loaded');
 nearly(at('Santos','arrival').cargo,24000);nearly(at('Santos','departure').cargo,4000);
 assert.ok(at('Santos','departure').mean<at('Santos','arrival').mean,'discharging 20,000 t lifts her');
 nearly(at('Santos','departure').mean,at('Santos','arrival').mean-20000/5000);
});
test('Bunkers on board are chained from the intake figure through legs and port stays',()=>{
 const s=base();P.ensure(s);
 for(const c of s.ports)for(const phase of ['arrival','departure'])for(const k of ['fuel','water','ballast','constant'])delete c.planning[phase][k];
 const budget=M.compute(s).budget,rob=P.bunkerRob(s,budget);
 const leg=budget.legs.find(l=>l.from==='Ust-Luga'),port=budget.ports.find(p=>p.name==='Ust-Luga');
 const key=(name,phase)=>s.ports.find(p=>p.name===name).callId+':'+phase;
 nearly(rob.get(key('Ust-Luga','departure')),s.deductions.fuel);
 nearly(rob.get(key('Santos','arrival')),s.deductions.fuel-(leg.massMain+leg.massEca+leg.massAux));
 nearly(rob.get(key('Ust-Luga','arrival')),s.deductions.fuel+port.massMain+port.massAux+port.massBoiler);
 const row=P.stateDrafts(s,budget).find(r=>r.call==='Santos'&&r.phase==='arrival');
 assert.equal(row.storeBasis.fuel,'voyage');assert.equal(row.storeBasis.water,'intake');
 assert.ok(row.stores.fuel<s.deductions.fuel,'the ocean leg is burned off before Santos');
 const none=P.stateDrafts(s,null).find(r=>r.call==='Santos'&&r.phase==='arrival');
 assert.equal(none.storeBasis.fuel,'intake','without a voyage budget the intake figure is held, not invented');
});
test('Trim splits about amidships and a measured draft still governs the berth check',()=>{
 const s=loadedFixture(),call=s.ports.find(p=>p.name==='Ust-Luga');
 call.planning.departure.trim=0.6;
 const trimmed=departure(s,'Ust-Luga');
 nearly(trimmed.computed.aft,9.3);nearly(trimmed.computed.fwd,8.7);nearly(trimmed.deepest,9.3);
 assert.equal(trimmed.trimBasis,'entered');
 Object.assign(call.planning.departure,{aft:11.4,mid:11.2,fwd:11});
 const surveyed=departure(s,'Ust-Luga');
 assert.equal(surveyed.basis,'surveyed');nearly(surveyed.deepest,11.4);
 nearly(surveyed.mean,9,'the calculated draft is still shown beside the survey');
 s.portRecords.find(p=>p.id===call.planning.berthId).maxDraft=11.3;
 const event=P.events(s).find(e=>e.call.name==='Ust-Luga'&&e.phase==='departure');
 assert.ok(P.stateCheck(s,event).issues.some(x=>x.includes('State draft 11.4 exceeds 11.3')));
});
test('A calculated draft over the berth limit is named as calculated',()=>{
 const s=loadedFixture(),call=s.ports.find(p=>p.name==='Ust-Luga');
 s.portRecords.find(p=>p.id===call.planning.berthId).maxDraft=8.5;
 const event=P.events(s).find(e=>e.call.name==='Ust-Luga'&&e.phase==='departure');
 assert.ok(P.stateCheck(s,event).issues.some(x=>x.includes('Computed state draft 9 exceeds 8.5')),'the source of the figure is on the face of the check');
});
test('A calculated draft is quoted to the millimetre, not to fifteen decimals',()=>{
 const s=loadedFixture(),call=s.ports.find(p=>p.name==='Ust-Luga');
 call.planning.departure.trim=0.123456789;
 s.portRecords.find(p=>p.id===call.planning.berthId).maxDraft=9;
 const event=P.events(s).find(e=>e.call.name==='Ust-Luga'&&e.phase==='departure');
 const issue=P.stateCheck(s,event).issues.find(x=>x.includes('exceeds'));
 assert.equal(issue,'Computed state draft 9.062 exceeds 9','the reader gets millimetres, not floating-point noise');
 assert.ok(P.stateDrafts(s).find(r=>r.call==='Ust-Luga'&&r.phase==='departure').deepest>9,'the comparison itself stays exact');
});
