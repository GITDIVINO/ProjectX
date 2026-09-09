'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),M=require('./model'),P=require('./planning');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const base=()=>{const s=M.demo();P.ensure(s);s.vesselSnapshot={...M.vesselOf(s),dwt:57329,draft:12.8,tpc:58.94};s.deductions={fuel:1000,water:400,ballast:0,constant:200,draftLoss:0};for(const b of s.portRecords){b.maxDraft=30;b.waterDensity=1.025;}return s;};
test('Density-aware berth fallback is conservative by cargo capacity, not depth',()=>{
 const s=base(),b=s.portRecords.find(p=>p.name==='Ust-Luga');b.maxDraft=11.5;
 s.portRecords.push({...b,id:'fresh-deeper',berth:'Test B',maxDraft:11.6,waterDensity:1});
 const r=P.autoDraftLoss(s);assert.equal(r.limiting.berth,'fresh-deeper');
 close(r.loss,(12.8*1.025-11.6)*100*58.94/1.025);
 assert.match(r.warnings.join(),/most restrictive/);assert.equal(s.ports[0].planning.berthId,'');
 s.ports[0].planning.berthId=b.id;close(P.autoDraftLoss(s).loss,(12.8-11.5)*100*58.94);
 s.ports[0].planning.berthId='not-a-berth';assert.equal(P.autoDraftLoss(s).loss,null);
});
test('Unknown alternative berth data cannot certify a conservative fallback',()=>{
 const s=base(),b=s.portRecords.find(p=>p.name==='Ust-Luga');s.portRecords.push({...b,id:'unknown',waterDensity:null});
 assert.equal(P.autoDraftLoss(s).loss,null);s.ports[0].planning.berthId=b.id;assert.equal(P.autoDraftLoss(s).loss,0);
});
test('Late discharge limits total intake through the remaining cargo fraction',()=>{
 const s=base();s.lots[0].quantity=1000;s.lots[1].quantity=50000;
 const b=s.portRecords.find(p=>p.name==='Paranaguá');b.maxDraft=10;
 P.syncAutoDraftLoss(s);const r=s.planning.autoDraftLoss,expected=(55729-(12.8-10)*100*58.94)/(50000/51000);
 assert.equal(r.limiting.call,'Paranaguá');close(M.intakeLimits(s).dwt,expected);assert.ok(expected<51000);
 const full=base();full.lots[0].quantity=50000;full.lots[1].quantity=1000;full.portRecords.find(p=>p.name==='Paranaguá').maxDraft=10;
 assert.equal(P.autoDraftLoss(full).loss,0,'a small final parcel does not impose the full-load port loss on the whole voyage');
});
test('Early loading uses only cargo already loaded; all calls remain checked',()=>{
 const s=base();s.lots[0].quantity=1000;s.lots[1].quantity=50000;s.lots[1].loadPort='St. Petersburg';M.syncRoute(s);P.ensure(s);
 s.portRecords.find(p=>p.name==='Ust-Luga').maxDraft=10;const r=P.autoDraftLoss(s);
 assert.equal(r.loss,0);close(r.rows.find(p=>p.call==='Ust-Luga').fraction,1000/51000);assert.equal(r.rows.length,4);
});
test('One hundred independent route bounds agree with density-scaled state drafts',()=>{
 for(let i=0;i<100;i++){
  const s=base();s.lots[0].quantity=1000+300*i;s.lots[1].quantity=40000-200*i;
  const b=s.portRecords.find(p=>p.name==='Paranaguá');b.waterDensity=1+(i%31)/1000;b.maxDraft=8+(i%40)/10;
  P.syncAutoDraftLoss(s);const limit=M.intakeLimits(s).dwt,f=s.lots[1].quantity/(s.lots[0].quantity+s.lots[1].quantity);
  // Invert the independent state-draft equation at this berth, then scale its cargo share.
  const portCargo=57329-1600+100*58.94*(b.maxDraft*b.waterDensity/1.025-12.8);
  close(limit,Math.min(55729,portCargo/f));
  const draft=(12.8-(57329-(limit*f+1600))/(100*58.94))*1.025/b.waterDensity;
  assert.ok(draft<=b.maxDraft+1e-9);assert.ok(limit<=55729);
 }
});
test('Missing stores stop intake; optional vessel source and financial inputs do not affect it',()=>{
 const s=base();s.portRecords.find(p=>p.name==='Ust-Luga').maxDraft=11;const loss=P.autoDraftLoss(s).loss;
 s.hire=null;s.prices.main=null;s.planning.vesselBasis={density:1,lightship:1e6,vesselKey:'old'};
 close(P.autoDraftLoss(s).loss,loss);
 for(const k of ['fuel','water','ballast','constant']){const copy=JSON.parse(JSON.stringify(s));copy.deductions[k]=null;assert.equal(P.autoDraftLoss(copy).loss,null);}
});
test('Estimated port draft requires known density, not lightship; measured drafts retain priority',()=>{
 const s=base(),c=s.ports[0],b=s.portRecords.find(p=>p.name===c.name);c.planning.berthId=b.id;b.waterDensity=1;
 const row=()=>P.stateDrafts(s).find(r=>r.call===c.name&&r.phase==='departure');
 close(row().mean,row().meanRef*1.025);assert.equal(row().displacement,null);
 b.waterDensity=null;assert.equal(row().mean,null);assert.equal(row().margin,null);
 c.planning.departure.draft=10;assert.equal(row().deepest,10);assert.equal(row().basis,'entered');
});
