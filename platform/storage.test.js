'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./model'),P=require('./planning');
const Schema=require('./schema'),Local=require('./storage-local'),Supabase=require('./storage-supabase'),Storage=require('./storage');

// ---------------------------------------------------------------------------
// Test doubles
// ---------------------------------------------------------------------------

function fakeStore(seed={}){
 const map=new Map(Object.entries(seed));
 return {
  getItem:key=>map.has(key)?map.get(key):null,
  setItem:(key,value)=>{map.set(key,String(value));},
  removeItem:key=>{map.delete(key);},
  keys:()=>[...map.keys()],
  raw:map
 };
}

// Mimics the supabase-js builder chain closely enough to exercise the query shapes, the
// revision match and the error path. Every call is recorded so a test can assert that a read
// was scoped to the organisation rather than trusting the adapter.
function fakeClient(tables={},user={id:'user-1',email:'planner@example.com'}){
 const calls=[];
 const data=JSON.parse(JSON.stringify(tables));
 function builder(table){
  const state={table,op:'select',filters:[],payload:null,ordered:null};
  const chain={
   select(){return chain;},
   insert(row){state.op='insert';state.payload=row;return chain;},
   update(row){state.op='update';state.payload=row;return chain;},
   delete(){state.op='delete';return chain;},
   eq(column,value){state.filters.push([column,value]);return chain;},
   order(column,options){state.ordered=[column,options];return chain;},
   maybeSingle(){state.single=true;return chain;},
   then(resolve,reject){return Promise.resolve(run(state)).then(resolve,reject);}
  };
  return chain;
 }
 function match(row,filters){return filters.every(([column,value])=>row[column]===value);}
 function run(state){
  calls.push({table:state.table,op:state.op,filters:state.filters,ordered:state.ordered});
  const rows=data[state.table]||(data[state.table]=[]);
  if(state.op==='insert'){
   const row={id:state.payload.id||'generated-'+(rows.length+1),created_at:'2026-09-11T00:00:00Z',updated_at:'2026-09-11T00:00:00Z',...state.payload};
   rows.push(row);
   return {data:state.single?row:[row],error:null};
  }
  const hit=rows.filter(row=>match(row,state.filters));
  if(state.op==='update'){
   hit.forEach(row=>Object.assign(row,state.payload,{updated_at:'2026-09-11T01:00:00Z'}));
   return {data:state.single?(hit[0]||null):hit,error:null};
  }
  if(state.op==='delete'){
   data[state.table]=rows.filter(row=>!match(row,state.filters));
   return {data:null,error:null};
  }
  return {data:state.single?(hit[0]||null):hit,error:null};
 }
 return {
  from:builder,
  auth:{getUser:async()=>({data:{user},error:null})},
  calls,
  tables:data
 };
}

// ---------------------------------------------------------------------------
// Schema split — audit finding P-03
// ---------------------------------------------------------------------------

test('Splitting a state into catalogs, sales and voyage loses nothing on the way back',()=>{
 const state=M.demo();P.ensure(state);
 const parts=Schema.split(state);
 assert.deepEqual(Schema.merge(parts),state);

 const empty=M.initial();
 assert.deepEqual(Schema.merge(Schema.split(empty)),empty);
});

test('The voyage document no longer carries a private copy of the shared catalogs',()=>{
 const state=M.demo();P.ensure(state);
 const {catalogs,voyage,total}=Schema.sizes(state);

 // The prototype stored one blob: 96 % of it was catalogs. After the split the voyage that a
 // calculation actually owns is a small document, and the catalogs are stored once.
 assert.ok(catalogs/total>0.9,`catalogs should dominate the old blob, were ${(catalogs/total*100).toFixed(1)} %`);
 assert.ok(voyage/total<0.1,`the voyage should be a small document, was ${(voyage/total*100).toFixed(1)} %`);
 assert.ok(voyage<20000,`the voyage document should stay small, was ${voyage} bytes`);
});

test('A field the model adds later stays with the voyage instead of reaching shared data',()=>{
 const state=M.initial();
 state.somethingAddedLater={secret:'commercial'};
 const parts=Schema.split(state);
 assert.equal(parts.catalogs.somethingAddedLater,undefined);
 assert.equal(parts.sales.somethingAddedLater,undefined);
 assert.deepEqual(parts.voyage.somethingAddedLater,{secret:'commercial'});
});

test('Splitting copies rather than shares: editing one document cannot reach another',()=>{
 const state=M.demo();
 const parts=Schema.split(state);
 parts.catalogs.cargoTypes[0].name='Edited in the catalog';
 assert.notEqual(state.cargoTypes[0].name,'Edited in the catalog');
});

test('A merged state still satisfies the shape the application accepts on load',()=>{
 const state=M.demo();P.ensure(state);
 const merged=Schema.merge(Schema.split(state));
 assert.equal(merged.version,2);
 for(const key of ['lots','ports','holds','legs','allocations','costs'])assert.ok(Array.isArray(merged[key]),key+' must survive as an array');
 for(const key of ['deductions','prices','ballast'])assert.ok(merged[key]&&typeof merged[key]==='object',key+' must survive as an object');
 assert.doesNotThrow(()=>M.compute(merged));
});

test('A voyage records the catalog revision it was planned against',()=>{
 const parts=Schema.split(M.demo());
 assert.equal(Schema.stamp(parts.voyage,7).catalogRevision,7);
});

// ---------------------------------------------------------------------------
// Browser-local adapter
// ---------------------------------------------------------------------------

test('The prototype save is migrated into the split layout, and the original key is kept',async()=>{
 const state=M.demo();P.ensure(state);
 const store=fakeStore({[Local.LEGACY_KEY]:JSON.stringify(state)});
 const storage=Local.create({store});

 const voyages=await storage.listVoyages();
 assert.equal(voyages.length,1);
 const loaded=await storage.loadVoyage(voyages[0].id);
 assert.deepEqual(loaded.document.lots,state.lots);

 const catalogs=await storage.loadCatalogs();
 assert.deepEqual(catalogs.document.cargoTypes,state.cargoTypes);

 // Nothing is destroyed: an older build still opens the same calculation from its own key.
 assert.equal(store.getItem(Local.LEGACY_KEY),JSON.stringify(state));
});

test('Migration runs once and does not duplicate the imported calculation',async()=>{
 const store=fakeStore({[Local.LEGACY_KEY]:JSON.stringify(M.demo())});
 const storage=Local.create({store});
 await storage.listVoyages();
 await storage.listVoyages();
 await storage.loadCatalogs();
 assert.equal((await storage.listVoyages()).length,1);
});

test('Damaged legacy data is left alone instead of producing a half-migrated workspace',async()=>{
 const store=fakeStore({[Local.LEGACY_KEY]:'{not json'});
 const storage=Local.create({store});
 assert.deepEqual(await storage.listVoyages(),[]);
 assert.equal(store.getItem(Local.CATALOG_KEY),null);
});

test('A calculation saved by an older build is taken in again when it changes',async()=>{
 const first=M.demo();first.hire=100;
 const store=fakeStore({[Local.LEGACY_KEY]:JSON.stringify(first)});
 const storage=Local.create({store});

 const [initial]=await storage.listVoyages();
 assert.equal((await storage.loadVoyage(initial.id)).document.hire,100);

 // The same browser opens the offline page, saves there, and comes back.
 const second=M.demo();second.hire=200;
 store.setItem(Local.LEGACY_KEY,JSON.stringify(second));
 const list=await storage.listVoyages();
 assert.equal(list.length,1,'the import updates the calculation rather than adding another');
 assert.equal((await storage.loadVoyage(list[0].id)).document.hire,200);

 // Unchanged contents are not re-imported, so local edits are not undone on every read.
 await storage.saveVoyage(list[0].id,{...(await storage.loadVoyage(list[0].id)).document,hire:300},list[0].revision);
 await storage.listVoyages();
 const after=await storage.listVoyages();
 assert.equal((await storage.loadVoyage(after[0].id)).document.hire,300,'a local edit survives a later read');
});

test('Unreadable contents in the old key are noted once and never retried',async()=>{
 const store=fakeStore({[Local.LEGACY_KEY]:'{not json'});
 const storage=Local.create({store});
 assert.deepEqual(await storage.listVoyages(),[]);
 assert.equal(store.getItem(Local.LEGACY_KEY),'{not json','the original is left exactly as it was');
});

test('Several named calculations live side by side',async()=>{
 const storage=Local.create({store:fakeStore()});
 const first=await storage.createVoyage('Ust-Luga → Santos',{lots:[{id:'A'}]});
 const second=await storage.createVoyage('Ust-Luga → Paranagua',{lots:[{id:'B'}]});

 const list=await storage.listVoyages();
 assert.deepEqual(list.map(x=>x.name).sort(),['Ust-Luga → Paranagua','Ust-Luga → Santos']);
 assert.deepEqual((await storage.loadVoyage(first.id)).document.lots,[{id:'A'}]);
 assert.deepEqual((await storage.loadVoyage(second.id)).document.lots,[{id:'B'}]);

 await storage.deleteVoyage(first.id);
 assert.equal((await storage.listVoyages()).length,1);
 assert.equal(await storage.loadVoyage(first.id),null);
});

test('A write against a revision somebody else has moved is refused, not applied',async()=>{
 const storage=Local.create({store:fakeStore()});
 const created=await storage.createVoyage('Shared calculation',{note:'first'});

 const mine=created.revision;                                   // both sides read revision 1
 const theirs=await storage.saveVoyage(created.id,{note:'them'},mine);
 assert.equal(theirs.ok,true);

 const conflict=await storage.saveVoyage(created.id,{note:'me'},mine);
 assert.equal(conflict.ok,false);
 assert.equal(conflict.reason,'conflict');
 assert.equal(conflict.current.revision,2);
 assert.deepEqual((await storage.loadVoyage(created.id)).document,{note:'them'},'the first write must survive');
});

test('The catalogs carry the same revision rule as a calculation',async()=>{
 const storage=Local.create({store:fakeStore()});
 const first=await storage.saveCatalogs({cargoTypes:[{id:'c1'}]},0);
 assert.equal(first.ok,true);
 assert.equal((await storage.saveCatalogs({cargoTypes:[]},0)).reason,'conflict');
 assert.deepEqual((await storage.loadCatalogs()).document,{cargoTypes:[{id:'c1'}]});
});

test('Two traders editing different sales do not collide',async()=>{
 const storage=Local.create({store:fakeStore()});
 await storage.saveSale('SALE-1',{cargoName:'Urea',fob:300},0);
 await storage.saveSale('SALE-2',{cargoName:'DAP',fob:520},0);

 await storage.saveSale('SALE-1',{cargoName:'Urea',fob:310},1);
 const sales=await storage.listSales();
 assert.equal(sales.length,2);
 assert.equal(sales.find(x=>x.id==='SALE-1').document.fob,310);
 assert.equal(sales.find(x=>x.id==='SALE-2').document.fob,520,'the untouched deal keeps its own value');

 assert.equal((await storage.saveSale('SALE-2',{fob:999},1)).ok,true);
 assert.equal((await storage.saveSale('SALE-2',{fob:1},1)).reason,'conflict');
});

test('A snapshot pins the catalogs as they were, and a later correction does not reach it',async()=>{
 const storage=Local.create({store:fakeStore()});
 await storage.saveCatalogs({cargoTypes:[{id:'c1',sf:0.9}]},0);
 const voyage=await storage.createVoyage('Approved package',{lots:[{id:'A',sf:0.9}]},1);

 const pinned=await storage.snapshot(voyage.id,'Sent to the head of freight');
 assert.equal(pinned.ok,true);

 await storage.saveCatalogs({cargoTypes:[{id:'c1',sf:1.2}]},1);
 await storage.saveVoyage(voyage.id,{lots:[{id:'A',sf:1.2}]},1);

 const [kept]=await storage.snapshots(voyage.id);
 assert.deepEqual(kept.catalogs.cargoTypes,[{id:'c1',sf:0.9}],'an approved package keeps the inputs it was approved on');
 assert.deepEqual(kept.document.lots,[{id:'A',sf:0.9}]);
 assert.equal(kept.label,'Sent to the head of freight');
});

// ---------------------------------------------------------------------------
// Supabase adapter — query shape, scoping and concurrency, without a project
// ---------------------------------------------------------------------------

test('Every read is scoped to the organisation before it leaves the page',async()=>{
 const client=fakeClient({voyages:[],catalogs:[]});
 const storage=Supabase.create({client,orgId:'org-1'});
 await storage.listVoyages();
 await storage.loadCatalogs();
 await storage.listSales();
 for(const call of client.calls)assert.ok(
  call.filters.some(([column,value])=>column==='org_id'&&value==='org-1'),
  `${call.table}.${call.op} left the page without an organisation filter`
 );
});

test('A shared write matches on the revision that was read',async()=>{
 const client=fakeClient({voyages:[{id:'v1',org_id:'org-1',name:'Shared',document:{note:'first'},revision:1,catalog_revision:1}]});
 const storage=Supabase.create({client,orgId:'org-1'});

 const first=await storage.saveVoyage('v1',{note:'them'},1);
 assert.equal(first.ok,true);
 assert.equal(first.revision,2);

 const update=client.calls.find(c=>c.op==='update');
 assert.ok(update.filters.some(([column,value])=>column==='revision'&&value===1),'the update must carry the expected revision');

 const conflict=await storage.saveVoyage('v1',{note:'me'},1);
 assert.equal(conflict.ok,false);
 assert.equal(conflict.reason,'conflict');
 assert.equal(conflict.current.revision,2);
 assert.deepEqual(client.tables.voyages[0].document,{note:'them'},'the first write must survive');
});

test('A missing calculation is reported as missing, not as a conflict',async()=>{
 const storage=Supabase.create({client:fakeClient({voyages:[]}),orgId:'org-1'});
 assert.equal((await storage.saveVoyage('gone',{},1)).reason,'missing');
 assert.equal(await storage.loadVoyage('gone'),null);
});

test('A database error is returned as a failure instead of an empty workspace',async()=>{
 const client=fakeClient({voyages:[]});
 client.from=()=>({select(){return this;},eq(){return this;},order(){return this;},maybeSingle(){return this;},
  then(resolve){return Promise.resolve({data:null,error:{message:'permission denied for table voyages'}}).then(resolve);}});
 const storage=Supabase.create({client,orgId:'org-1'});
 const result=await storage.listVoyages();
 assert.equal(result.ok,false);
 assert.match(result.error,/permission denied/);
});

test('A signed-out visitor is told so rather than shown a blank calculation',async()=>{
 const client=fakeClient({},null);
 const storage=Supabase.create({client,orgId:'org-1'});
 assert.deepEqual(await storage.ready(),{ok:false,reason:'signed-out'});
 assert.equal(await storage.user(),null);
});

test('The shared adapter exposes no way to rewrite or remove an approval snapshot',()=>{
 const storage=Supabase.create({client:fakeClient(),orgId:'org-1'});
 assert.equal(typeof storage.snapshot,'function');
 assert.equal(typeof storage.snapshots,'function');
 assert.equal(storage.updateSnapshot,undefined);
 assert.equal(storage.deleteSnapshot,undefined);
});

test('Both adapters answer the same contract',()=>{
 const local=Local.create({store:fakeStore()});
 const shared=Supabase.create({client:fakeClient(),orgId:'org-1'});
 const contract=['ready','user','loadCatalogs','saveCatalogs','listSales','saveSale','deleteSale',
  'listVoyages','loadVoyage','createVoyage','saveVoyage','renameVoyage','deleteVoyage','snapshot','snapshots'];
 for(const method of contract){
  assert.equal(typeof local[method],'function',`the local adapter is missing ${method}`);
  assert.equal(typeof shared[method],'function',`the shared adapter is missing ${method}`);
 }
 assert.equal(local.shared,false);
 assert.equal(shared.shared,true);
});

// ---------------------------------------------------------------------------
// Adapter selection
// ---------------------------------------------------------------------------

test('With no configuration the application stays in this browser',()=>{
 const storage=Storage.create({config:null,store:fakeStore()});
 assert.equal(storage.kind,'local');
 assert.equal(Storage.configured(null),false);
 assert.equal(Storage.configured({supabaseUrl:'https://x.supabase.co'}),false,'a URL without a key is not configured');
 assert.equal(Storage.configured({supabaseUrl:'https://x.supabase.co',supabaseAnonKey:'anon'}),true);
});

test('Configuration selects the shared adapter and carries the organisation',()=>{
 const client=fakeClient();
 const storage=Storage.create({
  config:{supabaseUrl:'https://x.supabase.co',supabaseAnonKey:'anon',orgId:'org-7'},
  createClient:()=>client
 });
 assert.equal(storage.kind,'supabase');
 assert.equal(storage.orgId,'org-7');
});

test('If the client library is missing the page says so instead of losing writes silently',()=>{
 const storage=Storage.create({
  config:{supabaseUrl:'https://x.supabase.co',supabaseAnonKey:'anon'},
  createClient:null,
  store:fakeStore()
 });
 assert.equal(storage.kind,'local');
 assert.match(storage.degraded,/this browser only/);
});
