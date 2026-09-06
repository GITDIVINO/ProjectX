'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),cp=require('node:child_process'),M=require('./model');
const saleData=s=>({cargoId:s.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true)).id,quantity:1000,fob:250,dealDate:'2026-09-01',shipmentFrom:'2026-09-10',shipmentTo:'2026-09-20',loadPort:'Ust-Luga',dischargePort:'Santos'});
test('MARKET archive has dated reports, complete regional content and escaped rendering',()=>{
 const market=require('./market');assert.equal(market.reports.length,8);
 assert.equal(new Set(market.reports.map(r=>r.id)).size,8);
 let previous='9999-12-31';
 for(const r of market.reports){
  assert.ok(r.publishedDate<previous);previous=r.publishedDate;
  assert.equal(r.id,'dry-bulk-'+r.publishedDate);assert.ok(r.overview.paragraphs.length);
  const html=market.render(r.id);assert.ok(html.includes('Updates are not automatic'));
  for(const b of r.basins)for(const region of b.regions){
   assert.ok(region.forecast);assert.ok(region.cargoes.length);
   const filtered=market.render(r.id,region.name);assert.equal((filtered.match(/class="market-region"/g)||[]).length,1);
  }
 }
 const report=market.reports[0],old=report.summary;
 try{report.summary='<img src=x onerror=alert(1)>';const html=market.render(report.id);assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));}finally{report.summary=old;}
 assert.ok(market.render('invalid','invalid').includes('All regions'));
});
test('Requested reference catalogs migrate once without overwriting saved edits or the voyage',()=>{
 const s=M.demo();M.ensureCatalogs(s);delete s.catalogAdditions;
 s.portRecords=[{id:'CUSTOM',name:'Murmansk',terminal:'Keep',da:123,restrictions:'User data'}];
 s.vesselProfiles=[{...s.vesselProfiles[0],name:'Custom 33K'}, {...s.vesselProfiles[1],id:'USER',dwt:39000}];
 const snapshot=JSON.stringify(s.vesselSnapshot),lots=JSON.stringify(s.lots);
 M.ensureCatalogs(s);
 assert.equal(s.portRecords.length,10);assert.equal(s.portRecords[0].da,123);
 assert.equal(s.vesselProfiles.length,3);assert.equal(s.vesselProfiles[1].dwt,39000);
 assert.equal(JSON.stringify(s.vesselSnapshot),snapshot);assert.equal(JSON.stringify(s.lots),lots);
 M.removePortRecord(s,s.portRecords.findIndex(p=>p.name==='Itaqui'));
 const saved=JSON.parse(JSON.stringify(s));M.ensureCatalogs(saved);
 assert.ok(!saved.portRecords.some(p=>p.name==='Itaqui'));assert.equal(saved.vesselProfiles.length,3);
});
test('New defaults contain requested ports and incomplete reference vessels cannot silently replace the voyage',()=>{
 const s=M.initial();assert.equal(s.portRecords.length,13);assert.equal(s.vesselProfiles.length,3);
 for(const name of ['St. Petersburg','Murmansk','Itaqui','Santarem','Vitoria','Rio Grande','San Francisco do Sul','Suape','Aratu','Pecem'])assert.equal(s.portRecords.filter(p=>p.name===name).length,1);
 for(const id of ['tbn-2','tbn-3']){
  const v=s.vesselProfiles.find(v=>v.id===id);assert.equal(v.holdData.length,5);assert.equal(v.aux,null);assert.equal(v.boiler,null);
  const before=JSON.stringify(s);assert.throws(()=>M.applyVessel(s,id));assert.equal(JSON.stringify(s),before);
 }
 const sale=M.addSale(s,{...saleData(s),loadPort:'St. Petersburg',dischargePort:'Itaqui'});M.addSaleToPlanner(s,sale.id);
 assert.equal(s.lots[0].port,'Itaqui');
});
test('The shipped HTML preserves script bytes and every embedded script parses',()=>{
 cp.execFileSync(process.execPath,[path.join(__dirname,'build.cjs')]);
 const html=fs.readFileSync(path.join(__dirname,'ProjectX.html'),'utf8');
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 assert.equal(scripts.length,5);
 ['arithmetic.js','cargo-catalog.js','model.js','market.js','app.js'].forEach((name,i)=>{
  assert.equal(scripts[i],fs.readFileSync(path.join(__dirname,name),'utf8').replace(/<\/script/gi,'<\\/script'));
  assert.doesNotThrow(()=>new vm.Script(scripts[i]));
 });
 assert.ok(!html.includes('<script src='));
});
test('UI templates and model messages are English without a runtime translator',()=>{
 for(const file of ['app.js','model.js','market.js','arithmetic.js','index.html'])assert.doesNotMatch(fs.readFileSync(path.join(__dirname,file),'utf8'),/[А-Яа-яЁё]/,file);
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
