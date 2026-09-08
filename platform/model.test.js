'use strict';const test=require('node:test'),assert=require('node:assert/strict'),M=require('./model');const close=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
test('Empty estimate never fabricates a budget or cargo intake',()=>{const r=M.compute(M.initial());assert.equal(r.budget,null);assert.equal(r.ship.intake,null);assert.ok(r.errors.length>0);});
test('PLANNER starts clean while reference catalogs remain available',()=>{const s=M.initial();assert.deepEqual(s.lots,[]);assert.deepEqual(s.sales,[]);assert.equal(s.cargoTypes.length,97);assert.equal(s.vesselProfiles.length,3);});
test('Independent closed-form benchmark: one sea leg, work, main/aux, hire and DA',()=>{const s=M.demo();s.lots[0].quantity=24000;s.lots[1].selected=false;s.ports[0].rate=12000;s.ports[1].rate=6000;s.ports[0].da=100;s.ports[1].da=200;s.ports.forEach(p=>{p.fuel='main';p.working=5;p.aux=1;});Object.assign(s.legs[0],{distance:2400,speed:10,eca:0,burn:20,margin:0,aux:1});s.prices={main:100,eca:200,aux:300};s.hire=1000;const b=M.compute(s).budget;assert.ok(b);close(b.days,16);close(b.usage.main,230);close(b.usage.aux,16);close(b.total,44100);close(b.unit,1.8375);});
test('Signal screenshot loading arithmetic 55000/20000 +24h+288h',()=>{const s=M.demo();s.lots[0].quantity=55000;s.lots[1].selected=false;Object.assign(s.ports[0],{rate:20000,turn:24,extra:288});const p=M.compute(s).budget.ports[0];close(p.workDays,2.75);close(p.days,15.75);});
test('Signal screenshot gross freight and commission',()=>{const s=M.demo();s.lots[0].quantity=55000;s.lots[1].selected=false;s.freight=50;s.commission=1.25;const b=M.compute(s).budget;assert.equal(b.gross,2750000);assert.equal(b.commission,34375);assert.equal(b.net,2715625);});
test('Independent Historical benchmark deadweight reference arithmetic',()=>{const displacement=67680.9,lightship=10857.5,deductions=[730.5,458,0,300,34.5,200,108,500,650];close(displacement-lightship-deductions.reduce((a,b)=>a+b,0),53842.4);});
test('ECA is split from total distance, never charged twice; weather applies equally',()=>{const s=M.demo();Object.assign(s.legs[0],{distance:2400,eca:1200,speed:10,margin:10,burn:20,ecaBurn:10,aux:0});const l=M.compute(s).budget.legs[0];close(l.days,11);close(l.ecaDays,5.5);close(l.massMain,110);close(l.massEca,55);});
test('Reject ECA longer than route and zero speed',()=>{for(const change of [{eca:99999},{speed:0},{distance:null},{burn:-1}]){const s=M.demo();Object.assign(s.legs[0],change);assert.equal(M.compute(s).budget,null);}});
test('Zero aux does not require irrelevant price, missing aux is not zero',()=>{const s=M.demo();s.prices.aux=null;assert.ok(M.compute(s).budget);s.legs[0].aux=null;assert.equal(M.compute(s).budget,null);});
test('Unknown used fuel price blocks calculation',()=>{const s=M.demo();s.prices.eca=null;assert.equal(M.compute(s).budget,null);});
test('Ballast uses separate profile and adds cost/time to all parcels',()=>{const s=M.demo();const base=M.compute(s).budget;Object.assign(s.ballast,{distance:240,eca:0,speed:10,margin:0,burn:18,aux:0});s.ballastEnabled=true;const b=M.compute(s).budget;close(b.days-base.days,1);close(b.total-base.total,13500+18*540);assert.ok(b.rows.find(r=>r.name.startsWith('Vessel position')).eligible.length===2);});
test('No commission discount on hire, gross-up algebra recovers total',()=>{const s=M.demo();s.commission=10;const b=M.compute(s).budget;close(b.requiredFreight*b.q*.9+s.extraIncome,b.total);close(b.hire,Math.round(b.days*s.hire*100)/100,.03);});
test('100 percent commission blocked; missing freight leaves cost available',()=>{const s=M.demo();s.commission=100;assert.equal(M.compute(s).budget,null);s.commission=0;s.freight=null;const b=M.compute(s).budget;assert.ok(b);assert.equal(b.tce,null);});
test('Manual calendar separates productive and idle days',()=>{const s=M.demo();Object.assign(s.ports[0],{terms:'manual',calendar:5,rate:10000,turn:24,extra:48});const p=M.compute(s).budget.ports[0];close(p.workDays,3);close(p.idleDays,5);close(p.days,8);s.ports[0].calendar=2;assert.equal(M.compute(s).budget,null);});
test('No calendar default for SHEX mode',()=>{const s=M.demo();s.ports[0].terms='manual';assert.equal(M.compute(s).budget,null);});
test('Automatic stowage conserves parcels and respects volume',()=>{const s=M.demo(),r=M.stowage(s);assert.deepEqual(r.errors,[]);r.remaining.forEach(x=>close(x.quantity,0));r.holds.forEach(h=>assert.ok(h.fill<=100));});
test('Automatic stowage distributes one unrestricted cargo across every available hold',()=>{const s=M.demo();s.lots=s.lots.slice(0,1);s.lots[0].quantity=10000;s.allocations=M.allocate(s);assert.deepEqual(s.allocations.map(a=>a.hold),[1,2,3,4,5]);close(s.allocations.reduce((n,a)=>n+a.quantity,0),10000);const fills=M.stowage(s).holds.map(h=>h.fill);fills.forEach(fill=>close(fill,fills[0]));});
test('Single-cargo distribution respects every hold mass limit and leaves excess unassigned',()=>{const s=M.demo();s.lots=s.lots.slice(0,1);s.lots[0].quantity=30000;s.holds.forEach((h,i)=>h.massLimit=1000+i*100);s.allocations=M.allocate(s);assert.deepEqual(s.allocations.map(a=>a.quantity),[1000,1100,1200,1300,1400]);close(M.stowage(s).remaining[0].quantity,24000);});
test('Cargo SF changes volume, not mass',()=>{const s=M.demo();const a=M.stowage(s).holds[3];s.lots[1].sf=1;const b=M.stowage(s).holds[3];close(b.quantity,a.quantity);close(b.used,6000);assert.ok(b.fill>a.fill);});
test('Any hold allowed; overvolume, mass and parcel overassignment detected',()=>{let s=M.demo();s.allocations=[{lot:'S2',hold:1,quantity:6000}];assert.deepEqual(M.stowage(s).errors,[]);s=M.demo();s.allocations=[{lot:'S2',hold:4,quantity:20000}];assert.ok(M.stowage(s).errors.length>=2);s=M.demo();s.holds[3].massLimit=5000;assert.ok(M.stowage(s).errors.some(e=>e.includes('Mass')));});
test('Volume allocation honours supplied hold mass limit and retains unassigned quantity',()=>{const s=M.demo();s.lots=s.lots.slice(1);s.holds=s.holds.slice(3,4);s.holds[0].massLimit=5000;s.allocations=M.allocate(s);close(M.stowage(s).remaining.find(x=>x.id==='S2').quantity,1000);});
test('Stages discharge only destination parcels',()=>{const s=M.demo();s.stage='Santos';assert.ok(M.stageAllocations(s).every(a=>a.lot==='S2'));s.stage='Paranaguá';assert.deepEqual(M.stageAllocations(s),[]);});
test('Post-Santos leg and Paranagua port costs belong solely to S2',()=>{const b=M.compute(M.demo()).budget;const rows=b.rows.filter(r=>r.name.startsWith('Santos → Paranaguá')||r.name.startsWith('Paranaguá ·'));assert.ok(rows.length>=5);rows.forEach(r=>assert.equal(r.shares.S1,0));});
test('Allocation reconciles exact cents, route and tonnage bases',()=>{for(const allocation of ['route','tonnage']){const s=M.demo();s.allocation=allocation;const b=M.compute(s).budget;assert.equal(b.allocation.reduce((n,a)=>n+a.cents,0),b.totalCents);b.rows.forEach(r=>assert.equal(Object.values(r.shares).reduce((a,b)=>a+b,0),r.cents));}});
test('Deterministic largest remainder penny allocation',()=>{assert.deepEqual(M.splitCents(100,[1,1,1]),[34,33,33]);assert.deepEqual(M.splitCents(1,[1,1]),[1,0]);assert.throws(()=>M.splitCents(100,[0,0]));});
test('Missing direct leg after skipped Santos cannot reuse Santos distance',()=>{const s=M.demo();s.lots[0].selected=false;assert.equal(M.compute(s).budget,null);s.legs.push({...s.legs[0],to:'Paranaguá'});assert.ok(M.compute(s).budget);assert.equal(M.compute(s).budget.ports.length,2);});
test('Extra stop adds independent time, hire, fuel and fee once',()=>{const s=M.demo(),base=M.compute(s).budget;s.costs.push({name:'Transit',amount:500,days:2,burn:3,fuel:'main'});const b=M.compute(s).budget;close(b.days-base.days,2);close(b.total-base.total,500+27000+6*540);});
test('No selected cargo blocks division and allocation',()=>{const s=M.demo();s.lots.forEach(l=>l.selected=false);assert.equal(M.compute(s).budget,null);});
test('Economic calculation never implies stowage feasibility',()=>{const s=M.demo();s.lots[0].quantity=60000;const r=M.compute(s);assert.ok(r.budget);assert.ok(r.ship.errors.some(e=>e.includes('DWT')));});
test('Changing load port clears port/approach assumptions and charges whole cargo at new load',()=>{const s=M.demo();M.changeLoadPort(s,'Murmansk','RUMMK');assert.equal(s.ports[0].da,null);assert.equal(s.ballast.to,'Murmansk');assert.ok(s.legs.every(l=>l.from!=='Ust-Luga'));assert.equal(M.compute(s).budget,null);Object.assign(s.ports[0],{rate:10000,da:100,aux:0,boilerDays:0});s.legs.unshift({...M.demo().legs[0],from:'Murmansk'});const b=M.compute(s).budget;assert.ok(b);assert.equal(b.ports[0].cargo,30000);});
test('New crushed sulphur has no inherited case hold restriction',()=>{const s=M.initial();const l=M.addLot(s,{name:'CRUSHED LUMP SULPHUR',quantity:30000,sf:.95,port:'Santos'});assert.equal(l.onlyHold,undefined);assert.equal(l.group,'B');s.allocations=M.allocate(s);assert.equal(s.allocations.length,5);close(M.stowage(s).remaining[0].quantity,0);});
test('Legacy sulphur hold migration preserves quantities, SF, allocations and removes all hold bindings',()=>{const s=M.demo();delete s.sulphurHoldScopeMigrated;s.cargoTypes[1].onlyHold=4;s.lots[0].onlyHold=3;const before=JSON.stringify(s.allocations),sf=s.lots[1].sf,q=s.lots[1].quantity;M.ensureCatalogs(s);assert.equal(s.cargoTypes[1].onlyHold,undefined);assert.equal(s.lots[1].onlyHold,undefined);assert.equal(s.lots[0].onlyHold,undefined);assert.equal(s.lots[1].sf,sf);assert.equal(s.lots[1].quantity,q);assert.equal(JSON.stringify(s.allocations),before);s.lots[1].onlyHold=4;M.ensureCatalogs(s);assert.equal(s.lots[1].onlyHold,undefined);});
test('Catalog accommodates 1000 planner lots from a clean default',()=>{const s=M.initial();const base=s.cargoTypes.length;for(let i=0;i<1000;i++)M.addLot(s,{name:'Product '+i,quantity:10,sf:1,port:'Santos'});assert.equal(s.cargoTypes.length,base+1000);assert.equal(new Set(s.lots.map(l=>l.id)).size,1000);assert.ok(s.lots.every(l=>l.color));});
test('Two load ports: port quantities and leg cost eligibility track loading events',()=>{const s=M.demo();s.lots[1].loadPort='Murmansk';M.syncRoute(s);assert.deepEqual(s.ports.map(p=>p.name),['Ust-Luga','Murmansk','Santos','Paranaguá']);assert.equal(M.compute(s).budget,null);s.ports.forEach(p=>Object.assign(p,{rate:10000,da:100,aux:0,boilerDays:0}));s.legs.forEach(l=>Object.assign(l,{distance:240,eca:0,speed:10,burn:10,ecaBurn:10,aux:0,margin:0}));const b=M.compute(s).budget;assert.ok(b);assert.equal(b.ports.find(p=>p.name==='Ust-Luga').cargo,24000);assert.equal(b.ports.find(p=>p.name==='Murmansk').cargo,6000);assert.equal(b.rows.find(r=>r.name==='Ust-Luga → Murmansk · hire').shares.S2,0);s.stage='Ust-Luga';assert.ok(M.stageAllocations(s).every(a=>a.lot==='S1'));s.stage='Murmansk';assert.equal(M.stageAllocations(s).length,s.allocations.length);assert.equal(b.allocation.reduce((n,a)=>n+a.cents,0),b.totalCents);});
test('New parcel carries its own load port and sync adds only selected load calls',()=>{const s=M.demo();M.addLot(s,{name:'New cargo',quantity:100,sf:1,loadPort:'St. Petersburg',port:'Santos'});M.syncRoute(s);assert.ok(s.ports.some(p=>p.name==='St. Petersburg'));s.lots[2].selected=false;M.syncRoute(s);assert.ok(!s.ports.some(p=>p.name==='St. Petersburg'));});
test('Legacy shared load port migrates into each parcel',()=>{const s=M.demo();s.ports[0].name='Murmansk';s.lots.forEach(l=>delete l.loadPort);M.syncRoute(s);assert.ok(s.lots.every(l=>l.loadPort==='Murmansk'));});
test('Moving loading calls preserves PDA, parcel assignments and resets ballast destination',()=>{const s=M.demo();s.lots[1].loadPort='Murmansk';M.syncRoute(s);s.ports.find(p=>p.name==='Murmansk').da=12345;assert.equal(M.moveCall(s,'Murmansk',-1),true);assert.deepEqual(M.callsOf(s).map(p=>p.name),['Murmansk','Ust-Luga','Santos','Paranaguá']);assert.equal(s.ballast.to,'Murmansk');assert.equal(s.ports[0].da,12345);assert.equal(s.lots[1].loadPort,'Murmansk');assert.equal(s.legs.find(l=>l.from==='Murmansk'&&l.to==='Ust-Luga').distance,null);M.syncRoute(s);assert.equal(s.ports[0].name,'Murmansk');assert.equal(M.moveCall(s,'Murmansk',-1),false);});
test('Discharge moves stay within group and update stowage stages',()=>{const s=M.demo();assert.equal(M.moveCall(s,'Paranaguá',-1),true);assert.deepEqual(M.callsOf(s).map(p=>p.name),['Ust-Luga','Paranaguá','Santos']);s.stage='Paranaguá';assert.ok(M.stageAllocations(s).every(a=>a.lot==='S1'));assert.equal(M.moveCall(s,'Paranaguá',-1),false);});
test('Cargo catalog apply updates linked parcels, preserves amount and endpoints',()=>{const s=M.demo();M.ensureCatalogs(s);const c=s.cargoTypes[0];c.sf=1;c.name='Renamed sulphur';const before=s.lots[0].quantity;M.applyCargo(s,c.id);assert.equal(s.lots[0].sf,1);assert.equal(s.lots[0].name,'Renamed sulphur');assert.equal(s.lots[0].quantity,before);assert.equal(s.lots[0].port,'Santos');assert.equal(s.lots[1].sf,.9);});
test('Vessel catalog edits are staged until applied, then affect actual costs and intake',()=>{const s=M.demo();M.ensureCatalogs(s);const v=s.vesselProfiles[0];v.dwt=38000;v.speed=10;v.burn=20;v.ecaBurn=20;v.aux=0;assert.equal(M.vesselOf(s).dwt,37667);M.applyVessel(s,v.id);assert.equal(M.vesselOf(s).dwt,38000);assert.equal(s.legs[0].speed,10);assert.equal(s.legs[0].burn,20);assert.equal(M.stowage(s).intake,38000-1975);v.speed=9;assert.equal(s.legs[0].speed,10);s.lots[1].loadPort='Murmansk';M.syncRoute(s);assert.equal(s.legs.find(l=>l.to==='Murmansk').speed,10);});
test('Invalid catalog parameters cannot be applied',()=>{const s=M.demo();M.ensureCatalogs(s);s.cargoTypes[1].sf=-1;assert.throws(()=>M.applyCargo(s,s.cargoTypes[1].id));s.vesselProfiles[0].speed=0;assert.throws(()=>M.applyVessel(s,'tbn-1'));assert.equal(s.legs[0].speed,12.5);});
test('User-supplied TBN 34K values and actual hold sum are preserved',()=>{const s=M.initial(),v=M.vesselOf(s);assert.equal(v.name,'TBN 34K');assert.equal(v.model,'HDD34');assert.equal(v.dwt,33465);assert.equal(v.draft,9.85);assert.equal(v.speed,12.5);assert.equal(v.ballastSpeed,12.5);assert.equal(v.burn,15.4);assert.equal(v.ballastBurn,13.5);assert.equal(v.aux,.1);assert.equal(v.grabs,true);close(s.holds.reduce((n,h)=>n+h.volume,0),45516.8);assert.ok(s.holds.every(h=>h.massLimit===null));assert.equal(s.deductions.constant,null);});
test('All three standard vessel profiles are complete and can be applied',()=>{const s=M.initial();for(const [id,dwt,grain,holdSum] of [['tbn-1',33465,45517,45516.8],['tbn-2',37667,46732,46732.6],['tbn-3',56565.45,71634,71634.1]]){M.applyVessel(s,id);assert.equal(M.vesselOf(s).dwt,dwt);assert.equal(M.vesselOf(s).grain,grain);close(s.holds.reduce((n,h)=>n+h.volume,0),holdSum);assert.equal(M.vesselOf(s).cranes,4);assert.equal(M.vesselOf(s).craneSWL,30);}});
test('Older saved vessel migrates once with backup, keeps parcel and commercial inputs',()=>{const s=M.demo();delete s.tbnSourceRevision;const q=s.lots[0].quantity,hire=s.hire;assert.equal(M.migrateBaltic(s),true);assert.equal(M.vesselOf(s).dwt,33465);assert.equal(s.previousVesselProfile.snapshot.dwt,37667);assert.equal(s.lots[0].quantity,q);assert.equal(s.hire,hire);assert.equal(M.migrateBaltic(s),false);});
test('New vessel type is independent and applies different hold count and deadweight',()=>{const s=M.initial();const v=M.addVesselType(s);v.name='TBN 2';v.dwt=50000;v.holdData.push({id:6,volume:5000,massLimit:null});M.applyVessel(s,v.id);assert.equal(s.vesselId,v.id);assert.equal(s.holds.length,6);assert.equal(M.vesselOf(s).holds,6);assert.equal(M.vesselOf(s).dwt,50000);assert.equal(s.vesselProfiles[0].holdData.length,5);assert.equal(s.vesselProfiles[0].dwt,33465);});
test('Profile anonymization removes historic identity from current and previous profile',()=>{const s=M.initial();s.vesselSnapshot.source='Historic vessel name';s.vesselSnapshot.revision='old';s.vesselSnapshot.imo=1234567;s.previousVesselProfile={snapshot:{id:'tbn-1',revision:'old',model:'Historic vessel',imo:1234567}};M.anonymizeProfiles(s);assert.equal(s.vesselSnapshot.source,'Standard profile TBN 1');assert.equal(s.vesselSnapshot.imo,undefined);assert.equal(s.previousVesselProfile.snapshot.model,'Standard bulk carrier');});
test('SALE accepts only catalog cargo and PORTS entries and becomes the only source for planner lots',()=>{const s=M.initial();s.lots=[];s.sales=[];const cargo=s.cargoTypes.find(c=>M.isBulkCargo(c)),data={cargoId:cargo.id,quantity:1234,fob:215.5,dealDate:'2026-09-01',shipmentFrom:'2026-09-10',shipmentTo:'2026-09-20',loadPort:'Ust-Luga',dischargePort:'Santos'};assert.throws(()=>M.addSale(s,{...data,cargoId:'missing'}));assert.throws(()=>M.addSale(s,{...data,loadPort:'Not in PORTS'}),/PORT/);assert.throws(()=>M.addSale(s,{...data,dischargePort:'Not in PORTS'}),/PORT/);assert.throws(()=>M.addSale(s,{...data,dischargePort:'Ust-Luga'}),/must be different/);const sale=M.addSale(s,data);const lot=M.addSaleToPlanner(s,sale.id);assert.equal(lot.saleId,sale.id);assert.equal(lot.quantity,1234);assert.equal(lot.name,cargo.name);assert.throws(()=>M.addSaleToPlanner(s,sale.id));});
test('Changes to a sale flow into its planner lot without overwriting voyage SF',()=>{const s=M.demo(),lot=s.lots[0],sale=s.sales.find(x=>x.id===lot.saleId);lot.sf=.91;sale.quantity=7777;sale.loadPort='Murmansk';sale.dischargePort='Paranaguá';M.syncSalesToLots(s);assert.equal(lot.quantity,7777);assert.equal(lot.loadPort,'Murmansk');assert.equal(lot.port,'Paranaguá');assert.equal(lot.sf,.91);});
test('PORTS records seed new calls with reference DA',()=>{const s=M.initial();s.lots=[];s.sales=[];s.ports=[];s.portRecords.push({id:'P9',name:'Custom Port',terminal:'Terminal 1',restrictions:'Draft 10 m',da:12345});const cargo=s.cargoTypes.find(c=>M.isBulkCargo(c));const sale=M.addSale(s,{cargoId:cargo.id,quantity:1000,fob:1,dealDate:'2026-09-01',shipmentFrom:'2026-09-10',shipmentTo:'2026-09-20',loadPort:'Custom Port',dischargePort:'Santos'});M.addSaleToPlanner(s,sale.id);assert.equal(s.ports.find(p=>p.name==='Custom Port').da,12345);});

test('Default port rows carry a sourced country, terminal, notes and numeric limits where published',()=>{const s=M.initial();assert.equal(s.portRecords.length,17,'12 single-row ports plus five Murmansk berths');assert.equal(new Set(s.portRecords.map(p=>p.name)).size,13);for(const p of s.portRecords){assert.ok(p.terminal.trim(),'terminal missing for '+p.name);assert.ok(p.notes.trim(),'notes missing for '+p.name);assert.ok(p.country.trim(),'country missing for '+p.name);for(const k of M.PORT_LIMIT_FIELDS)assert.ok(p[k]===null||M.ok(p[k],true),k+' must be a positive number or null for '+p.name);}const murmansk=s.portRecords.filter(p=>p.name==='Murmansk');assert.deepEqual(murmansk.map(p=>[p.berth,p.maxDraft,p.maxLoa,p.maxBeam,p.maxAirDraft]),[['Berth 4',11,230,32.2,14.5],['Berth 6',7,120,16,14.5],['Berth 7',10,225,32,14.5],['Berth 9/10',10.5,240,36,14.5],['Berth 13',12.5,240,36,14.5]]);assert.ok(murmansk.every(p=>p.terminal==='Murmansk Sea Commercial Port'),'every berth row keeps the terminal');const spb=s.portRecords.find(p=>p.name==='St. Petersburg');assert.equal(spb.maxDraft,11,'user-supplied fresh water draft');assert.equal(spb.maxLoa,null,'an unpublished limit stays empty rather than zero');assert.equal(s.portRecords.find(p=>p.name==='Santarem').maxDwt,60000);assert.ok(murmansk.every(p=>p.country==='Russia'));assert.equal(s.portRecords.find(p=>p.name==='Suape').country,'Brazil');});

test('Port limit breaches flag only a limit the vessel actually exceeds',()=>{const s=M.initial();const santos=s.portRecords.find(p=>p.name==='Santos');const spb={name:'Unlimited',maxDraft:null,maxBeam:null,maxLoa:null,maxAirDraft:null,maxDwt:null};assert.deepEqual(M.portLimitBreaches(santos,{draft:9.85,loa:180,beam:30,dwt:33465}),[]);assert.deepEqual(M.portLimitBreaches(santos,{draft:12.8,loa:180,beam:30,dwt:33465}),['maxDraft']);assert.deepEqual(M.portLimitBreaches(spb,{draft:20,loa:400,beam:60,dwt:99999}),[],'an empty limit never flags');assert.deepEqual(M.portLimitBreaches(santos,null),[]);});

test('Air draft is optional on a vessel and only screens ports once it is entered',()=>{const s=M.initial();const vessel=M.vesselOf(s);assert.equal(vessel.airDraft,null,'no air draft is invented for the reference profiles');
 const berth4=s.portRecords.find(p=>p.berth==='Berth 4');assert.equal(berth4.maxAirDraft,14.5);
 assert.deepEqual(M.portLimitBreaches(berth4,{draft:9.85,beam:30,loa:180,dwt:33465,airDraft:null}),[],'an unknown air draft cannot rule a berth out');
 assert.deepEqual(M.portLimitBreaches(berth4,{draft:9.85,beam:30,loa:180,dwt:33465,airDraft:16.2}),['maxAirDraft']);
 assert.deepEqual(M.portLimitBreaches(berth4,{draft:9.85,beam:30,loa:180,dwt:33465,airDraft:14.5}),[],'equal to the limit still fits');
 const profile=s.vesselProfiles[0];assert.doesNotThrow(()=>M.applyVessel(s,profile.id),'an empty air draft does not block Apply');
 profile.airDraft=-1;assert.throws(()=>M.applyVessel(s,profile.id),/Check vessel parameter: airDraft/);
 profile.airDraft=15.4;M.applyVessel(s,profile.id);assert.equal(M.vesselOf(s).airDraft,15.4);
 const legacy=M.initial();delete legacy.vesselProfiles[0].airDraft;delete legacy.vesselSnapshot.airDraft;M.ensureCatalogs(legacy);
 assert.equal(legacy.vesselProfiles[0].airDraft,null,'a saved profile from before the field reads as empty, not undefined');});

test('Port limits reject zero and negative values but accept empty',()=>{const s=M.initial();assert.throws(()=>M.updatePortRecord(s,0,'maxDraft',0),/positive or empty/);assert.throws(()=>M.updatePortRecord(s,0,'maxLoa',-1),/positive or empty/);M.updatePortRecord(s,0,'maxDraft',null);assert.equal(s.portRecords[0].maxDraft,null);M.updatePortRecord(s,0,'maxDraft',9.5);assert.equal(s.portRecords[0].maxDraft,9.5);});

test('Saved ports gain profiles once, keep user text and migrate legacy restrictions',()=>{const s=M.initial();delete s.portProfileRevision;const ustLuga=s.portRecords.find(p=>p.name==='Ust-Luga');ustLuga.terminal='My own berth';ustLuga.notes='';const santos=s.portRecords.find(p=>p.name==='Santos');santos.terminal='';santos.notes='';delete santos.maxDraft;const spb=s.portRecords.find(p=>p.name==='St. Petersburg');delete spb.notes;delete spb.country;spb.restrictions='My own survey note';const vitoria=s.portRecords.find(p=>p.name==='Vitoria');vitoria.country='Brasil';M.ensureCatalogs(s);assert.equal(spb.country,'Russia','a missing country is filled from the profile');assert.equal(vitoria.country,'Brasil','a country the user spelled their own way survives');assert.equal(ustLuga.terminal,'My own berth');assert.ok(ustLuga.notes.includes('EuroChem'));assert.ok(santos.terminal.includes('Outeirinhos'));assert.equal(santos.maxDraft,11.3,'a missing limit is filled from the profile');assert.equal(spb.notes,'My own survey note','legacy free text survives as notes');assert.ok(!('restrictions' in spb));santos.terminal='';M.ensureCatalogs(s);assert.equal(santos.terminal,'','a second pass must not refill a cleared field');});

test('A saved aggregate Murmansk row becomes its berth and the other berths are added once',()=>{const s=M.initial();const kept=s.portRecords.filter(p=>p.name!=='Murmansk');s.portRecords=[{id:'OLD',name:'Murmansk',country:'Russia',terminal:'My own terminal',notes:'My note',da:9000,maxDraft:12.5,maxLoa:240,maxBeam:36,maxAirDraft:14.5,maxDwt:null},...kept];delete s.portBerthRevision;M.ensureCatalogs(s);
 const rows=s.portRecords.filter(p=>p.name==='Murmansk');
 assert.equal(rows.length,5,'the aggregate row is relabelled, not duplicated');
 const old=rows.find(p=>p.id==='OLD');
 assert.equal(old.berth,'Berth 13','the aggregate held the most permissive berth');
 assert.equal(old.terminal,'My own terminal');assert.equal(old.notes,'My note');assert.equal(old.da,9000);
 assert.deepEqual(rows.map(p=>p.berth).sort(),['Berth 13','Berth 4','Berth 6','Berth 7','Berth 9/10']);
 assert.ok(rows.every(p=>p.da===9000),'a new berth row inherits the DA already entered for the port');
 const before=JSON.stringify(s.portRecords);M.ensureCatalogs(s);assert.equal(JSON.stringify(s.portRecords),before,'a second pass adds nothing');});

test('An edited Murmansk row is not relabelled and a removed port is not restored',()=>{const s=M.initial();const edited=s.portRecords.filter(p=>p.name!=='Murmansk');s.portRecords=[{id:'OLD',name:'Murmansk',country:'Russia',terminal:'Mine',notes:'',da:null,maxDraft:9.9,maxLoa:240,maxBeam:36,maxAirDraft:14.5,maxDwt:null},...edited];delete s.portBerthRevision;M.ensureCatalogs(s);
 const rows=s.portRecords.filter(p=>p.name==='Murmansk');
 assert.equal(rows.find(p=>p.id==='OLD').berth,'','an edited row keeps its own numbers and no berth label');
 assert.equal(rows.length,6,'the five berth rows are added alongside it');
 const gone=M.initial();gone.portRecords=gone.portRecords.filter(p=>p.name!=='Murmansk');delete gone.portBerthRevision;M.ensureCatalogs(gone);
 assert.equal(gone.portRecords.filter(p=>p.name==='Murmansk').length,0,'a port the user removed stays removed');});

test('Berth rows share a port name but must differ by berth',()=>{const s=M.initial();const i=s.portRecords.findIndex(p=>p.berth==='Berth 4');assert.throws(()=>M.updatePortRecord(s,i,'berth','Berth 13'),/already exist/);M.updatePortRecord(s,i,'berth','Berth 4A');assert.equal(s.portRecords[i].berth,'Berth 4A');
 const sale=M.addSale(s,{cargoId:s.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true)).id,quantity:1000,fob:250,dealDate:'2026-09-01',shipmentFrom:'2026-09-10',shipmentTo:'2026-09-20',loadPort:'Murmansk',dischargePort:'Santos'});
 assert.ok(sale.loadPortId);
 assert.doesNotThrow(()=>M.removePortRecord(s,i),'one of several berth rows can go while the port is in use');
 while(s.portRecords.filter(p=>p.name==='Murmansk').length>1)M.removePortRecord(s,s.portRecords.findIndex(p=>p.name==='Murmansk'));
 assert.throws(()=>M.removePortRecord(s,s.portRecords.findIndex(p=>p.name==='Murmansk')),/used by a sale/,'the last row of a used port is protected');});

test('Removed lubricants and slops fold into the constant so a saved intake does not change',()=>{
 assert.deepEqual(M.DEDUCTIONS,['fuel','water','ballast','constant','draftLoss']);
 const s=M.demo();s.deductions={fuel:950,water:200,ballast:300,constant:450,lubes:35,slops:40};
 // What the superseded six-deduction formula gave for this save.
 const historic=37667-(950+200+300+450+35+40);
 M.ensureCatalogs(s);
 assert.deepEqual(Object.keys(s.deductions).sort(),['ballast','constant','draftLoss','fuel','water']);
 assert.equal(s.deductions.constant,525);assert.equal(s.deductions.draftLoss,0,'a save from before the field carried no draft loss');
 assert.equal(M.stowage(s).intake,historic,'the saved intake survives the migration');
 const unknown=M.demo();unknown.deductions={fuel:950,water:200,ballast:300,constant:null,lubes:35,slops:40};
 M.ensureCatalogs(unknown);
 assert.equal(unknown.deductions.constant,null,'an unknown constant stays unknown rather than absorbing only part of the total');
 assert.equal(M.stowage(unknown).intake,null);
 const fresh=M.initial();assert.deepEqual(Object.keys(fresh.deductions),['fuel','water','ballast','constant','draftLoss']);assert.equal(fresh.deductions.draftLoss,null,'a new voyage asks for it like every other deduction');});

test('Cargo volume is quantity times SF, weighted by tonnage, and never guesses a missing input',()=>{
 const s=M.demo();let v=M.cargoVolume(s);
 close(v.volume,24000*0.9+6000*0.9);close(v.quantity,30000);close(v.weightedSf,0.9);
 close(v.holdTotal,s.holds.reduce((n,h)=>n+h.volume,0));close(v.free,v.holdTotal-v.volume);
 s.lots[1].sf=1.2;v=M.cargoVolume(s);
 close(v.volume,24000*0.9+6000*1.2);close(v.weightedSf,(24000*0.9+6000*1.2)/30000,1e-12);
 assert.notEqual(v.weightedSf,(0.9+1.2)/2,'weighted by tonnage, not a plain average');
 const noSf=M.demo();noSf.lots[0].sf=null;assert.equal(M.cargoVolume(noSf).volume,null);
 const noQty=M.demo();noQty.lots[0].quantity=null;assert.equal(M.cargoVolume(noQty).volume,null);
 const none=M.demo();none.lots.forEach(l=>l.selected=false);assert.equal(M.cargoVolume(none).volume,null);
 const noHolds=M.demo();noHolds.holds[0].volume=null;const partial=M.cargoVolume(noHolds);
 assert.ok(partial.volume>0,'cargo volume still stands without hold volumes');
 assert.equal(partial.holdTotal,null);assert.equal(partial.free,null,'free room is unknown, not zero');});

test('Every default berth carries one assumed water density inside the selectable range',()=>{
 const s=M.initial();
 const options=Array.from({length:31},(_,j)=>Number((1+j/1000).toFixed(3)));
 for(const p of s.portRecords){
  assert.ok(M.ok(p.waterDensity,true),'no density for '+p.name);
  assert.ok(p.waterDensity>=1&&p.waterDensity<=1.03,'density outside the PORT select range for '+p.name);
  assert.ok(options.includes(p.waterDensity),'density is not one of the PORT select options for '+p.name);
 }
 const d=name=>s.portRecords.find(p=>p.name===name).waterDensity;
 assert.equal(d('Santarem'),1,'an Amazon river berth is fresh water');
 assert.equal(d('St. Petersburg'),1,'the user quotes the Neva Bay draft in fresh water');
 assert.equal(d('Murmansk'),1.025,'Kola Bay is open sea water');
 assert.ok(d('St. Petersburg')<d('Ust-Luga')&&d('Ust-Luga')<d('Santos')&&d('Santos')<d('Pecem'),'densities rise from river to open ocean');
 for(const brackish of ['Santos','Paranaguá','Itaqui','Vitoria'])assert.equal(d(brackish),1.015,'every brackish Brazilian estuary shares one figure: '+brackish);
 assert.ok(s.portRecords.filter(p=>p.name==='Murmansk').every(p=>p.waterDensity===1.025),'every berth of one port shares its water');
});

test('A max draft that was never published is seeded into an older save',()=>{
 const s=M.initial();const spb=s.portRecords.find(p=>p.name==='St. Petersburg');
 spb.maxDraft=null;delete s.portProfileRevision;M.ensureCatalogs(s);
 assert.equal(s.portRecords.find(p=>p.name==='St. Petersburg').maxDraft,11,'a null limit is filled once the figure exists');
 for(const [name,draft] of [['Itaqui',12],['Vitoria',12]])assert.equal(M.initial().portRecords.find(p=>p.name===name).maxDraft,draft,name);
 const kept=M.initial();const santos=kept.portRecords.find(p=>p.name==='Santos');santos.maxDraft=10.8;
 delete kept.portProfileRevision;M.ensureCatalogs(kept);
 assert.equal(kept.portRecords.find(p=>p.name==='Santos').maxDraft,10.8,'a figure the user entered is never replaced');
});

test('A density the user picked survives the seeding migration',()=>{
 const s=M.initial();const berth=s.portRecords.find(p=>p.name==='Santos');berth.waterDensity=1.019;
 delete s.portProfileRevision;M.ensureCatalogs(s);
 assert.equal(s.portRecords.find(p=>p.name==='Santos').waterDensity,1.019,'a chosen density is never overwritten');
 const blank=M.initial();const spb=blank.portRecords.find(p=>p.name==='St. Petersburg');delete spb.waterDensity;
 delete blank.portProfileRevision;M.ensureCatalogs(blank);
 assert.equal(blank.portRecords.find(p=>p.name==='St. Petersburg').waterDensity,1,'a record from before the field is seeded');
});

test('Port profile lookup ignores accents and the Sao spelling',()=>{assert.equal(M.portProfileOf('Paranagua'),M.PORT_PROFILES['Paranaguá']);assert.equal(M.portProfileOf('Sao Francisco do Sul'),M.PORT_PROFILES['San Francisco do Sul']);assert.equal(M.portProfileOf('Unknown Port'),null);});
