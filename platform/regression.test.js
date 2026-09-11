'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),cp=require('node:child_process'),M=require('./model');
const saleData=s=>({cargoId:s.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true)).id,quantity:1000,fob:250,dealDate:'2026-09-01',shipmentFrom:'2026-09-10',shipmentTo:'2026-09-20',loadPort:'Ust-Luga',dischargePort:'Santos'});
test('MARKET import preserves the eight existing reports byte-for-byte',()=>{
 const {createHash}=require('node:crypto'),market=require('./market');
 const expected=[["dry-bulk-2026-07-09","55c7b2be5838d26d98b7edf4efbc564d5d7da59b4f6e31731b705c95ce7be15a"],["dry-bulk-2026-07-02","7c83559204676ed2f88465d79ee5f048bf5f7740540553ffe4bb148bf8ae0c74"],["dry-bulk-2026-06-25","4e2bcc0ad95f3ea9359fecaf9d84c8b5322f72592b569d8ed05fa15de3555515"],["dry-bulk-2026-06-18","8ecb0625f43c166cfc030a1c5ad38a1cb8462b97c755d37d1e79f9518dd6b2fa"],["dry-bulk-2026-06-11","cd76eb0f91b739655e6653023735250901481d14213409aaec2157086fc7939a"],["dry-bulk-2026-06-04","0cf9618af6a2e6ae87d60dd808cf1fa46cb5a23659b1e99a62b70d7d875aede2"],["dry-bulk-2026-05-28","6839c053f3cac79f8fa336c1f1bbdc4d9ce653c33fa10324bbe381823bbb6afd"],["dry-bulk-2026-05-21","0755f84c578c34b7157803c4d8a21c1b2165e77888bacbaa2809f17caa307210"]];
 for(const [id,hash]of expected)assert.equal(createHash('sha256').update(JSON.stringify(market.reports.find(r=>r.id===id))).digest('hex'),hash,id);
 assert.equal(market.reports.filter(r=>r.source).length,22);
});
test('MARKET keeps source date conflicts visible, with no duplicate next-day imports',()=>{
 const market=require('./market');
 assert.equal(market.reports[0].publishedDate,'2026-09-02');
 assert.deepEqual(market.reports.filter(r=>r.dateStatus==='unconfirmed').map(r=>r.publishedDate),['2025-03-04','2025-02-25','2025-02-11','2025-02-05']);
 for(const r of market.reports.filter(r=>r.dateStatus==='unconfirmed'))assert.match(market.render(r.id),/Date unconfirmed:.*2026/);
 for(const d of ['2026-05-20','2026-06-03','2026-06-10','2026-06-17','2026-06-24','2026-07-01','2026-07-08'])assert.ok(!market.reports.some(r=>r.publishedDate===d),d);
 assert.match(market.render('dry-bulk-2026-05-13'),/no year printed/);
 assert.match(market.render('dry-bulk-2026-03-11'),/outer heading and subject say 2025/);
});
test('MARKET source text includes checked image rates and latest September guidance',()=>{
 const market=require('./market'),may=market.render('dry-bulk-2026-05-13'),latest=market.render();
 for(const value of ['NOPAC: | 19,000','RECA TA I63 | 31,000 USD','SBRAZ FH T58 | 16,250+625K USD','AG | 6 | 10 | (5 / 6)','RSEA | 4 | 7 | (9 / 12)','CONT–BALTIC/WAFR (non HRA) | 16,500 USD SKAW'])assert.ok(may.includes(value),value);
 assert.ok(latest.includes('NOPAC | USD 20,000'));assert.ok(latest.includes('WEEKLY MARKET SCORECARD'));
 for(const r of market.reports.filter(r=>r.source))assert.doesNotMatch(JSON.stringify(r),/@|mailto:|https?:|rgds|as brokers only|\\bAlex\\b|\\bBarbara\\b|<html|\\[cid:|[А-Яа-яЁё]/i,r.id);
});
test('MARKET escapes imported source, date warnings and region sections',()=>{
 const market=require('./market'),r=market.reports[0],section=r.basins[0].regions[0].sections[0],before=JSON.stringify(r);
 try{
  const attack='<img src=x onerror=alert(1)>';
  r.source.name=attack;r.source.dateNote=attack;section.name=attack;section.paragraphs=[attack];
  const html=market.render(r.id);
  assert.doesNotMatch(html,/<img/);assert.ok((html.match(/&lt;img/g)||[]).length>=4);
 }finally{Object.keys(r).forEach(k=>delete r[k]);Object.assign(r,JSON.parse(before));}
});
test('MARKET archive has dated reports, complete regional content and escaped rendering',()=>{
 const market=require('./market');assert.equal(market.reports.length,30);
 assert.doesNotMatch(fs.readFileSync(path.join(__dirname,'market.js'),'utf8'),/faox/i,'no source tool name left in the module');
 assert.equal(new Set(market.reports.map(r=>r.id)).size,30);
 let previous='9999-12-31';
 for(const r of market.reports){
  assert.ok(r.publishedDate<previous);previous=r.publishedDate;
  assert.equal(r.id,'dry-bulk-'+r.publishedDate);assert.ok(r.overview.paragraphs.length);
  const html=market.render(r.id);assert.ok(html.includes('Updates are not automatic'));
  assert.doesNotMatch(html,/faox/i,'the archive is presented without the source tool name');
  for(const b of r.basins)for(const region of b.regions){
   if(r.source){assert.ok(region.sections.length);assert.ok(region.sections.every(s=>s.paragraphs.length));}
   else{assert.ok(region.forecast);assert.ok(region.cargoes.length);}
   const filtered=market.render(r.id,region.name);assert.equal((filtered.match(/class="market-region"/g)||[]).length,1);
   assert.doesNotMatch(filtered,/faox/i,region.name);
  }
 }
 const report=market.reports[0],old=report.summary;
 try{report.summary='<img src=x onerror=alert(1)>';const html=market.render(report.id);assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));}finally{report.summary=old;}
 assert.ok(market.render('invalid','invalid').includes('All regions'));
});
test('Requested reference catalogs migrate once without overwriting saved edits or the voyage',()=>{
 const s=M.demo();M.ensureCatalogs(s);delete s.catalogAdditions;delete s.portProfileRevision;
 s.portRecords=[{id:'CUSTOM',name:'Murmansk',terminal:'Keep',da:123,restrictions:'User data'}];
 s.vesselProfiles=[{...s.vesselProfiles[0],name:'Custom 33K'}, {...s.vesselProfiles[1],id:'USER',dwt:39000}];
 const snapshot=JSON.stringify(s.vesselSnapshot),lots=JSON.stringify(s.lots);
 M.ensureCatalogs(s);
 assert.equal(s.portRecords.length,22,'ten requested call ports and twelve delivery positions');assert.equal(s.portRecords[0].da,123);
 assert.equal(s.portRecords[0].terminal,'Keep');assert.equal(s.portRecords[0].notes,'User data');assert.equal(s.portRecords[0].maxDraft,12.5);
 assert.equal(s.vesselProfiles.length,3);assert.equal(s.vesselProfiles[1].dwt,39000);
 assert.equal(JSON.stringify(s.vesselSnapshot),snapshot);assert.equal(JSON.stringify(s.lots),lots);
 M.removePortRecord(s,s.portRecords.findIndex(p=>p.name==='Itaqui'));
 const saved=JSON.parse(JSON.stringify(s));M.ensureCatalogs(saved);
 assert.ok(!saved.portRecords.some(p=>p.name==='Itaqui'));assert.equal(saved.vesselProfiles.length,3);
});
test('New defaults contain requested ports and three complete editable vessel profiles',()=>{
 const s=M.initial();assert.equal(s.portRecords.length,29,'13 call ports with Murmansk as five berth rows, plus twelve delivery positions');assert.equal(s.vesselProfiles.length,3);
 for(const name of ['St. Petersburg','Itaqui','Santarem','Vitoria','Rio Grande','San Francisco do Sul','Suape','Aratu','Pecem'])assert.equal(s.portRecords.filter(p=>p.name===name).length,1);
 assert.deepEqual(s.portRecords.filter(p=>p.name==='Murmansk').map(p=>p.berth),['Berth 4','Berth 6','Berth 7','Berth 9/10','Berth 13']);
 for(const id of ['tbn-2','tbn-3']){
  const v=s.vesselProfiles.find(v=>v.id===id);assert.equal(v.holdData.length,5);assert.equal(v.aux,.1);assert.equal(v.boiler,null);
  assert.doesNotThrow(()=>M.applyVessel(s,id));assert.equal(s.vesselId,id);
 }
 const sale=M.addSale(s,{...saleData(s),loadPort:'St. Petersburg',dischargePort:'Itaqui'});M.addSaleToPlanner(s,sale.id);
 assert.equal(s.lots[0].port,'Itaqui');
});
test('The shipped HTML preserves script bytes and every embedded script parses',()=>{
 cp.execFileSync(process.execPath,[path.join(__dirname,'build.cjs')]);
 const html=fs.readFileSync(path.join(__dirname,'ProjectX.html'),'utf8');
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 assert.equal(scripts.length,16);
 ['arithmetic.js','cargo-catalog.js','model.js','market.js','guide.js','sea-data.js','sea-table.js','sea-route.js','planning.js','planner-ui.js','schema.js','storage-local.js','storage-supabase.js','storage.js','session.js','app.js'].forEach((name,i)=>{
  assert.equal(scripts[i],fs.readFileSync(path.join(__dirname,name),'utf8').replace(/<\/script/gi,'<\\/script'));
  assert.doesNotThrow(()=>new vm.Script(scripts[i]));
 });
 assert.ok(!html.includes('<script src='));
});
test('UI templates and model messages are English without a runtime translator',()=>{
 for(const file of ['app.js','model.js','market.js','guide.js','arithmetic.js','index.html'])assert.doesNotMatch(fs.readFileSync(path.join(__dirname,file),'utf8'),/[А-Яа-яЁё]/,file);
 const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
 assert.doesNotMatch(app,/translateHtml|translateDom|MutationObserver/);
});
test('Sale updates are validated before mutation and cannot extend PORT',()=>{
 const s=M.initial(),sale=M.addSale(s,saleData(s));M.addSaleToPlanner(s,sale.id);
 const before=JSON.stringify(s);
 for(const changes of [{loadPort:'Unlisted'},{dischargePort:'Unlisted'},{loadPort:'Santos'},{quantity:-1},{quantity:null},{fob:-2},{shipmentFrom:'2026-10-01'},{dealDate:'2026-02-30'}]){
  assert.throws(()=>M.updateSale(s,sale.id,changes));assert.equal(JSON.stringify(s),before);
 }
 M.updateSale(s,sale.id,{loadPort:'Murmansk',quantity:900});
 assert.equal(s.lots[0].loadPort,'Murmansk');assert.equal(s.lots[0].quantity,900);
 assert.equal(s.sales[0].loadPortId,s.portRecords.find(p=>p.name==='Murmansk').id);
});
test('SALE owns the berth and the call carries it; the planner offers no berth dialog',()=>{
 const s=M.initial(),sale=M.addSale(s,saleData(s));M.addSaleToPlanner(s,sale.id);
 const rows=s.portRecords.filter(p=>p.name===sale.loadPort);
 assert.equal(s.sales[0].loadPortId,rows[0].id,'a sale without an explicit berth takes the first registered row');
 const call=s.ports.find(c=>c.name===sale.loadPort);
 assert.equal(call.planning.berthId,rows[0].id,'the choice reaches the call it belongs to');
 if(rows.length>1){
  M.updateSale(s,sale.id,{loadPortId:rows[1].id});
  assert.equal(s.ports.find(c=>c.name===sale.loadPort).planning.berthId,rows[1].id,'changing the berth in SALE moves the call');
 }
 M.updateSale(s,sale.id,{loadPortId:'not-a-berth'});
 assert.equal(s.sales[0].loadPortId,rows[0].id,'a row that does not belong to the port falls back to the first, as a changed port must');
});
test('Registry deletions persist; used ports cannot be removed or renamed',()=>{
 const s=M.initial(),sale=M.addSale(s,saleData(s));
 const index=s.portRecords.findIndex(p=>p.name===sale.loadPort);
 assert.throws(()=>M.removePortRecord(s,index),/used by a sale/);
 assert.throws(()=>M.updatePortRecord(s,index,'name','Different'),/used by a sale/);
 M.removePortRecord(s,s.portRecords.findIndex(p=>p.name==='Paranaguá'));
 M.ensureCatalogs(s);M.ensureCatalogs(s);
 assert.ok(!s.portRecords.some(p=>p.name==='Paranaguá'));
});
test('A tampered saved sale cannot add an unregistered port to PLANNER',()=>{
 const s=M.initial(),sale=M.addSale(s,saleData(s));sale.loadPort='Unknown';
 const count=s.portRecords.length;
 assert.throws(()=>M.addSaleToPlanner(s,sale.id),/PORT/);
 assert.equal(s.lots.length,0);assert.equal(s.portRecords.length,count);
});
test('Any registered route can calculate without requiring Santos and Paranagua',()=>{
 const s=M.demo();s.portRecords.push({id:'CUSTOM',name:'Custom destination',da:100});
 s.lots.forEach(l=>l.port='Custom destination');M.syncRoute(s);
 s.ports.forEach(p=>Object.assign(p,{rate:10000,da:100,working:0,idle:0,aux:0,boiler:0}));
 s.legs.forEach(l=>Object.assign(l,{distance:240,eca:0,speed:10,margin:0,burn:10,aux:0}));
 const result=M.compute(s);assert.ok(result.budget,JSON.stringify(result.errors));
 assert.equal(s.ports.length,2);
});
