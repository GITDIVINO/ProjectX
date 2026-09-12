'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./model'),P=require('./planning');
const Schema=require('./schema'),Local=require('./storage-local'),Session=require('./session');

function fakeStore(seed={}){
 const map=new Map(Object.entries(seed));
 return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>{map.set(k,String(v));},removeItem:k=>{map.delete(k);}};
}

// An adapter with no synchronous path and a recorded call log, so the asynchronous route is
// exercised on its own rather than riding on the local adapter's shortcut.
function asyncStorage(seed={}){
 const calls=[];
 const inner=Local.create({store:fakeStore(seed)});
 const wrapped={calls};
 for(const name of ['ready','user','loadCatalogs','saveCatalogs','listSales','saveSale','deleteSale',
  'loadRegisters','saveRegisterRow','deleteRegisterRow',
  'listVoyages','loadVoyage','createVoyage','saveVoyage','renameVoyage','deleteVoyage','snapshot','snapshots']){
  wrapped[name]=async(...args)=>{
   calls.push(name==='saveRegisterRow'||name==='deleteRegisterRow'?name+':'+args[0]:name);
   await Promise.resolve();
   return inner[name](...args);
  };
 }
 return wrapped;                      // deliberately no openSync
}

const open=async(storage,preferred)=>Session.create(storage,{fresh:()=>M.initial()}).open(preferred);

test('A saved calculation comes back whole, through the three stored documents',()=>{
 const saved=M.demo();P.ensure(saved);
 const storage=Local.create({store:fakeStore({'projectx-current-v2':JSON.stringify(saved)})});
 const session=Session.create(storage,{fresh:()=>M.initial()});

 const opened=session.openSync();
 assert.ok(opened,'the local adapter answers at once, so the page renders the saved work on first paint');
 assert.deepEqual(opened.state.lots,saved.lots);
 assert.deepEqual(opened.state.cargoTypes,saved.cargoTypes);
 assert.deepEqual(opened.state.sales,saved.sales);
 assert.equal(opened.voyage.revision,1);
});

test('An adapter that cannot answer at once is awaited instead',async()=>{
 const saved=M.demo();P.ensure(saved);
 const storage=asyncStorage({'projectx-current-v2':JSON.stringify(saved)});
 const session=Session.create(storage,{fresh:()=>M.initial()});

 assert.equal(session.openSync(),null,'no shortcut is offered');
 const {state,voyage}=await session.open();
 assert.deepEqual(state.lots,saved.lots);
 assert.deepEqual(state.cargoTypes,saved.cargoTypes);
 assert.ok(voyage.id);
});

test('An empty workspace opens with one calculation to write into',async()=>{
 const storage=asyncStorage();
 const session=Session.create(storage,{fresh:()=>M.initial(),firstName:'Calculation 1'});
 const {state,voyage}=await session.open();
 assert.equal(voyage.name,'Calculation 1');
 assert.equal((await session.list()).length,1);
 assert.equal(state.version,2,'a usable blank state, not an empty object');
});

test('A new workspace stores its seeded registers when it opens',async()=>{
 const storage=asyncStorage();
 const session=Session.create(storage,{fresh:()=>M.initial()});
 const {state}=await session.open();
 // The registers are rows now, so that is where they have to be found.
 const rows=await storage.loadRegisters();
 assert.equal(rows.cargoTypes.length,state.cargoTypes.length,'the reference cargo register is on disk, not only on screen');
 assert.deepEqual(rows.cargoTypes.map(r=>r.document),state.cargoTypes);
 assert.equal(rows.portRecords.length,state.portRecords.length);
 assert.equal(rows.vesselProfiles.length,state.vesselProfiles.length);
 assert.equal(rows.sales.length,state.sales.length);
 // And the catalogs document keeps only the housekeeping markers.
 const markers=await storage.loadCatalogs();
 assert.equal(markers.document.cargoTypes,undefined,'the registers no longer travel in one document');
});

test('A keystroke in the voyage does not touch the shared registers',async()=>{
 const storage=asyncStorage();
 const session=Session.create(storage,{fresh:()=>M.initial()});
 const {state}=await session.open();

 storage.calls.length=0;
 state.hire=13500;
 assert.equal((await session.save(state)).ok,true);
 assert.equal(storage.calls.filter(c=>c.startsWith('saveRegisterRow')).length,0,'no register row was written');
 assert.equal(storage.calls.filter(c=>c==='saveCatalogs').length,0,'and neither were the markers');
 assert.equal(storage.calls.filter(c=>c==='saveVoyage').length,1);

 storage.calls.length=0;
 state.cargoTypes[0].sf=1.11;
 assert.equal((await session.save(state)).ok,true);
 assert.deepEqual(storage.calls.filter(c=>c.startsWith('saveRegisterRow')),['saveRegisterRow:cargoTypes'],
  'one cargo changed, so one cargo row is written and nothing else');
});

test('Only the sale that changed is written, and a removed sale is deleted',async()=>{
 const saved=M.demo();P.ensure(saved);
 const storage=asyncStorage({'projectx-current-v2':JSON.stringify(saved)});
 const session=Session.create(storage,{fresh:()=>M.initial()});
 const {state}=await session.open();
 assert.ok(state.sales.length>=2,'the fixture carries more than one deal');

 storage.calls.length=0;
 state.sales[0].fob=321;
 assert.equal((await session.save(state)).ok,true);
 assert.deepEqual(storage.calls.filter(c=>c.startsWith('saveRegisterRow')),['saveRegisterRow:sales'],
  'the untouched deal is not rewritten');

 const removed=state.sales.pop();
 storage.calls.length=0;
 assert.equal((await session.save(state)).ok,true);
 assert.deepEqual(storage.calls.filter(c=>c.startsWith('deleteRegisterRow')),['deleteRegisterRow:sales']);
 const left=(await storage.loadRegisters()).sales;
 assert.ok(!left.some(x=>x.id===removed.id));
});

test('Repeated edits are written in order and the last one wins',async()=>{
 const storage=asyncStorage();
 const session=Session.create(storage,{fresh:()=>M.initial()});
 const {state,voyage}=await session.open();

 const first={...state,hire:1};
 const second={...state,hire:2};
 const third={...state,hire:3};
 const results=await Promise.all([session.save(first),session.save(second),session.save(third)]);
 for(const result of results)assert.equal(result.ok,true);

 const stored=await storage.loadVoyage(voyage.id);
 assert.equal(stored.document.hire,3,'the newest state is what is stored');
 assert.equal(session.busy,false,'nothing is left in flight');
});

// Two people at the same desk: each on their own calculation, both on the shared registers.
// That is the arrangement the per-row registers exist for.
async function twoPeople(){
 const store=fakeStore({'projectx-current-v2':JSON.stringify(M.demo())});
 const shared=Local.create({store});
 const anna=Session.create(shared,{fresh:()=>M.initial()});
 const a=await anna.open();
 const hers=await anna.createNamed('Anna',a.state);
 const boris=Session.create(shared,{fresh:()=>M.initial()});
 const b=await boris.open();
 await boris.createNamed('Boris',b.state);
 return {shared,anna,boris,a,b,hers};
}

test('Two people editing different cargoes do not collide',async()=>{
 // The reason the registers are rows. As one document per organisation, the second writer was
 // refused although nothing they touched overlapped.
 const {shared,anna,boris,a,b}=await twoPeople();
 assert.ok(a.state.cargoTypes.length>2);

 a.state.cargoTypes[0].sf=1.11;
 b.state.cargoTypes[1].sf=2.22;
 assert.equal((await anna.save(a.state)).ok,true);
 assert.equal((await boris.save(b.state)).ok,true,'the second writer is not refused');

 const rows=await shared.loadRegisters();
 const byId=id=>rows.cargoTypes.find(r=>r.id===id).document;
 assert.equal(byId(a.state.cargoTypes[0].id).sf,1.11,"Anna's edit survives");
 assert.equal(byId(b.state.cargoTypes[1].id).sf,2.22,"and so does Boris's");
});

test('Two people editing the same cargo is still reported',async()=>{
 const {shared,anna,boris,a,b}=await twoPeople();
 a.state.cargoTypes[0].sf=1.11;
 b.state.cargoTypes[0].sf=2.22;
 assert.equal((await anna.save(a.state)).ok,true);
 const second=await boris.save(b.state);
 assert.equal(second.ok,false,'the same record is a real conflict');
 assert.equal(second.reason,'conflict');

 const rows=await shared.loadRegisters();
 assert.equal(rows.cargoTypes.find(r=>r.id===a.state.cargoTypes[0].id).document.sf,1.11,
  'and the first write survives it');
});

test('A port and a vessel edited at the same time are independent',async()=>{
 const {shared,anna,boris,a,b}=await twoPeople();
 a.state.portRecords[0].terminal='Berth research';
 b.state.vesselProfiles[0].source='Questionnaire 2026';
 assert.equal((await anna.save(a.state)).ok,true);
 assert.equal((await boris.save(b.state)).ok,true);

 const rows=await shared.loadRegisters();
 assert.equal(rows.portRecords.find(r=>r.id===a.state.portRecords[0].id).document.terminal,'Berth research');
 assert.equal(rows.vesselProfiles.find(r=>r.id===b.state.vesselProfiles[0].id).document.source,'Questionnaire 2026');
});

test('Only the record that changed is written',async()=>{
 const storage=asyncStorage({'projectx-current-v2':JSON.stringify(M.demo())});
 const session=Session.create(storage,{fresh:()=>M.initial()});
 const {state}=await session.open();
 await session.save(state);

 storage.calls.length=0;
 state.cargoTypes[0].sf=1.5;
 assert.equal((await session.save(state)).ok,true);
 const writes=storage.calls.filter(c=>c.startsWith('saveRegisterRow')).length;
 assert.equal(writes,1,`one cargo changed, so one row is written, not ${state.cargoTypes.length}`);
});

test('A record with no id is reported rather than silently dropped',()=>{
 const state=M.initial();
 state.cargoTypes.push({name:'No identifier',group:''});
 const missing=Schema.unkeyed(state);
 assert.equal(missing.cargoTypes.length,1);
 assert.equal(missing.cargoTypes[0].name,'No identifier');
 assert.deepEqual(Schema.unkeyed(M.demo()),{},'the seeded catalogue is all keyed');
});

test('A calculation changed elsewhere is reported, not overwritten',async()=>{
 const storage=asyncStorage();
 const session=Session.create(storage,{fresh:()=>M.initial()});
 const {state,voyage}=await session.open();
 await session.save({...state,hire:10});

 // Somebody else writes the same calculation between our read and our write.
 const theirs=await storage.loadVoyage(voyage.id);
 await storage.saveVoyage(voyage.id,{...theirs.document,hire:99},theirs.revision);

 const result=await session.save({...state,hire:11});
 assert.equal(result.ok,false);
 assert.equal(result.reason,'conflict');
 const stored=await storage.loadVoyage(voyage.id);
 assert.equal(stored.document.hire,99,'the other write survives');
});

test('Calculations are listed, named, switched between and removed',async()=>{
 const storage=asyncStorage();
 const session=Session.create(storage,{fresh:()=>M.initial()});
 const {state,voyage}=await session.open();
 await session.save({...state,hire:100});

 const second=await session.createNamed('Santos option',{...state,hire:200});
 await session.save({...state,hire:200});
 assert.equal((await session.list()).length,2);

 const back=await session.switchTo(voyage.id);
 assert.equal(back.ok,true);
 assert.equal(back.state.hire,100,'each calculation keeps its own figures');
 assert.deepEqual(back.state.cargoTypes,state.cargoTypes,'and they share one catalog');

 assert.equal((await session.rename(second.id,'Paranagua option')).ok,true);
 assert.ok((await session.list()).some(x=>x.name==='Paranagua option'));

 assert.equal((await session.remove(second.id)).ok,true);
 assert.equal((await session.list()).length,1);
});

test('A workspace that cannot be read says so instead of opening blank',async()=>{
 const storage=asyncStorage();
 storage.loadCatalogs=async()=>({ok:false,error:'permission denied for table catalogs'});
 const result=await open(storage);
 assert.match(result.error,/permission denied/);
 assert.equal(result.state,undefined,'no blank workspace is handed back over a failed read');
});

test('Saving before a calculation is open is refused rather than silently dropped',async()=>{
 const session=Session.create(asyncStorage(),{fresh:()=>M.initial()});
 assert.deepEqual(await session.save(M.initial()),{ok:false,reason:'no-calculation'});
});

test('What the session assembles is what the split would produce',async()=>{
 const saved=M.demo();P.ensure(saved);
 const storage=asyncStorage({'projectx-current-v2':JSON.stringify(saved)});
 const {state}=await open(storage);
 assert.deepEqual(Schema.merge(Schema.split(state)),state);
 assert.doesNotThrow(()=>M.compute(state));
});
