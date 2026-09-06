'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./model'),C=require('./cargo-catalog');
test('95 sourced entries have unique IDs and names, no guessed transport properties',()=>{
 assert.equal(C.entries.length,95);assert.equal(new Set(C.entries.map(c=>c.id)).size,95);assert.equal(new Set(C.entries.map(c=>c.name)).size,95);
 for(const c of C.entries){assert.match(c.catalogUrl,/^https:\/\//);assert.ok(c.producer&&c.family);assert.doesNotMatch(c.name,/[а-яё]/i);assert.ok(c.propertyStatus);if(c.sf!==null){assert.ok(c.sfRange&&c.propertyUrl);assert.ok(c.sf>=c.sfRange[0]&&c.sf<=c.sfRange[1]);}assert.equal(c.shipmentVerified,false);}
});
test('Saved two-cargo state receives seeds once without altering original parcels or edits',()=>{
 const s=M.demo();s.cargoTypes=s.cargoTypes.slice(0,2);delete s.importedCargoSeeds;M.ensureCatalogs(s);
 const lots=JSON.stringify(s.lots);s.cargoTypes[0].sf=.91;M.ensureCatalogs(s);assert.equal(s.cargoTypes.length,97);
 const c=s.cargoTypes.find(c=>c.id==='rf-urea-granular');c.name='Мой карбамид';c.sf=.77;M.ensureCatalogs(s);
 assert.equal(s.cargoTypes.length,97);assert.equal(c.name,'Мой карбамид');assert.equal(c.sf,.77);assert.equal(s.cargoTypes[0].sf,.91);assert.equal(JSON.stringify(s.lots),lots);
});
test('A matching pre-existing product name is preserved and does not duplicate after rename',()=>{
 const s=M.initial();s.cargoTypes=[{id:'custom',name:C.entries[0].name,sf:1}];delete s.importedCargoSeeds;
 M.ensureCatalogs(s);assert.equal(s.cargoTypes.length,95);s.cargoTypes[0].name='Моя марка';M.ensureCatalogs(s);assert.equal(s.cargoTypes.length,95);assert.equal(s.cargoTypes[0].sf,1);
});
test('Solid fertilizer creates a linked lot with supplied SF, never a guessed SF',()=>{
 const s=M.initial(),c=s.cargoTypes.find(c=>c.id==='rf-urea-granular');
 assert.throws(()=>M.addLot(s,{name:c.name,quantity:100,sf:null,port:'Santos'}));
 const l=M.addLot(s,{name:c.name,quantity:100,sf:1.25,port:'Santos'});assert.equal(l.cargoId,c.id);assert.equal(l.sf,1.25);assert.equal(l.group,'C');assert.equal(l.sfBasis,'user-entered');
});
test('Liquids, gas and packaged products cannot enter bulk planning by manual name',()=>{
 const s=M.initial();for(const c of s.cargoTypes.filter(c=>!M.isBulkCargo(c))){assert.throws(()=>M.addLot(s,{name:c.name,quantity:100,sf:1,port:'Santos'}),/carriage mode/);c.sf=1;assert.throws(()=>M.applyCargo(s,c.id),/bulk/);}
 assert.equal(s.lots.length,0);
});
test('Unsupported product in restored state is excluded from allocation and flagged',()=>{
 const s=M.demo();s.lots[0].cargoId='rf-app';assert.ok(M.stowage(s).errors.some(e=>e.includes('carriage mode')));assert.ok(M.allocate(s).every(a=>a.lot!==s.lots[0].id));
});

test('English/property migration updates seed names once and retains shipment SF and user overrides',()=>{
 const s=M.initial(),c=s.cargoTypes.find(c=>c.id==='rf-urea-granular');c.name=c.legacyName;delete c.propertyRevision;c.sf=.99;c.group='B';c.source='My declaration';s.lots.push({id:'S3',cargoId:c.id,name:c.name,sf:1.01});
 M.ensureCatalogs(s);assert.equal(c.name,'Granular urea · Urea N 46.2');assert.equal(c.sf,.99);assert.equal(c.group,'B');assert.equal(c.source,'My declaration');assert.equal(s.lots.at(-1).sf,1.01);assert.equal(s.lots.at(-1).name,c.name);const before=JSON.stringify(s);M.ensureCatalogs(s);assert.equal(JSON.stringify(s),before);
});
test('Reference SF has provenance and is explicitly flagged in stowage',()=>{
 const s=M.initial(),c=s.cargoTypes.find(c=>c.id==='rf-urea-granular');const l=M.addLot(s,{name:c.name,quantity:100,sf:c.sf,port:'Santos'});assert.equal(l.sfBasis,'reference-upper-bound');assert.ok(l.propertySource);assert.ok(M.stowage(s).warnings.some(x=>x.includes(l.id+': SF')));
});
test('Specific manufacturer SDS distinguishes AN from AN-based mixtures',()=>{
 const c=C.entries.find(c=>c.id==='rf-an');assert.equal(c.un,'1942');assert.equal(c.group,'B');assert.equal(c.hazardClass,'5.1');assert.equal(c.sf,1);assert.ok(c.propertyNote.includes('Uralchem Azot'));
 const unknown=C.entries.find(c=>c.name==='NPK 22:11:11');assert.equal(unknown.group,'');assert.equal(unknown.sf,null);assert.equal(unknown.propertyStatus,'SDS required');
});
test('Loose density conversion and sulphur scope retain their separate meanings',()=>{
 const c=C.entries.find(c=>c.name==='NPKS 10:26:26:2');assert.equal(c.sf,1.25);assert.equal(c.group,'C');assert.equal(c.bulkDensityRange[0],800);
 const s=M.initial();assert.equal(s.cargoTypes[1].sf,.95);assert.equal(s.cargoTypes[1].onlyHold,4);assert.equal(s.cargoTypes[0].sf,null);assert.equal(s.cargoTypes[0].group,'');assert.deepEqual(s.lots,[]);
});

test('KCKK SDS maps SAN and NS30:7 to UN2067 without treating relative density as bulk',()=>{const s=M.initial();for(const id of ['rf-san','rf-sulphonitrate']){const c=s.cargoTypes.find(c=>c.id===id);assert.equal(c.un,'2067');assert.equal(c.group,'B');assert.equal(c.hazardClass,'5.1');}assert.equal(s.cargoTypes.find(c=>c.id==='rf-sulphonitrate').sf,1000/1030);assert.equal(s.cargoTypes.find(c=>c.id==='rf-can').sf,null);assert.equal(s.cargoTypes.find(c=>c.id==='rf-can').group,'');assert.equal(s.cargoTypes.find(c=>c.id==='rf-cns').group,'C');});
