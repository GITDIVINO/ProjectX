'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./model'),Schema=require('./schema');

const desk=()=>{const s=M.initial();return {s,cargo:s.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true))};};
const quote=(cargo,over={})=>({cargoId:cargo.id,destination:'Santos',month:'2026-10',
 basis:'CFR',value:445,source:'Profercy',date:'2026-09-11',...over});

test('An assessment is a price for a cargo, a destination and a month',()=>{
 const {s,cargo}=desk();
 const a=M.addAssessment(s,quote(cargo));
 assert.equal(a.id,'PA-1');
 assert.equal(a.cargoName,cargo.name,'shown under the name the cargo has now');
 assert.equal(s.priceAssessments.length,1);
});

test('A figure without a source or a date is not an assessment',()=>{
 const {s,cargo}=desk();
 assert.throws(()=>M.addAssessment(s,quote(cargo,{source:'  '})),/source/);
 assert.throws(()=>M.addAssessment(s,quote(cargo,{date:'2026-09'})),/date/);
 assert.throws(()=>M.addAssessment(s,quote(cargo,{date:'2026-02-30'})),/date/);
 assert.equal(s.priceAssessments.length,0,'nothing was stored');
});

test('A month is a month, and a price is positive',()=>{
 const {s,cargo}=desk();
 for(const month of ['2026-13','2026-00','2026-1','October 2026','2026-10-03'])
  assert.throws(()=>M.addAssessment(s,quote(cargo,{month})),/YYYY-MM/,month);
 assert.throws(()=>M.addAssessment(s,quote(cargo,{value:0})),/positive/,'zero is not a market price');
 assert.throws(()=>M.addAssessment(s,quote(cargo,{value:null})),/positive/);
 assert.throws(()=>M.addAssessment(s,quote(cargo,{basis:'DAP'})),/basis/);
});

test('The cargo and the destination must be ones the registers know',()=>{
 const {s,cargo}=desk();
 assert.throws(()=>M.addAssessment(s,quote(cargo,{cargoId:'cargo-nowhere'})),/CARGOES/);
 assert.throws(()=>M.addAssessment(s,quote(cargo,{destination:'Atlantis'})),/PORTS/);
 const bagged=s.cargoTypes.find(c=>!M.isBulkCargo(c));
 if(bagged)assert.throws(()=>M.addAssessment(s,quote(cargo,{cargoId:bagged.id})),/CARGOES/);
});

test('One figure per cell: a second for the same cargo, destination and month is refused',()=>{
 const {s,cargo}=desk();
 M.addAssessment(s,quote(cargo));
 assert.throws(()=>M.addAssessment(s,quote(cargo,{value:448,source:'ICIS'})),/already exists/,
  'a matrix that chooses between two figures for one cell chooses silently');
 // The same month at a different destination, and the same destination in another month, are
 // different cells and both are accepted.
 M.addAssessment(s,quote(cargo,{destination:'Paranaguá'}));
 M.addAssessment(s,quote(cargo,{month:'2026-11',value:452}));
 assert.equal(s.priceAssessments.length,3);
});

test('An assessment is corrected in place, keeping its id',()=>{
 const {s,cargo}=desk();
 const a=M.addAssessment(s,quote(cargo));
 const fixed=M.updateAssessment(s,a.id,{value:447,date:'2026-09-12'});
 assert.equal(fixed.id,a.id);
 assert.equal(fixed.value,447);
 assert.equal(s.priceAssessments.length,1,'corrected, not duplicated');
 assert.throws(()=>M.updateAssessment(s,a.id,{value:-1}),/positive/);
 assert.equal(s.priceAssessments[0].value,447,'a refused correction leaves the stored figure alone');
 assert.throws(()=>M.updateAssessment(s,'PA-99',{value:1}),/not found/);
});

test('A correction may not move an assessment onto a cell that is taken',()=>{
 const {s,cargo}=desk();
 M.addAssessment(s,quote(cargo));
 const second=M.addAssessment(s,quote(cargo,{month:'2026-11',value:452}));
 assert.throws(()=>M.updateAssessment(s,second.id,{month:'2026-10'}),/already exists/);
 // Rewriting a row onto its own cell is not a clash with itself.
 assert.equal(M.updateAssessment(s,second.id,{month:'2026-11',value:453}).value,453);
});

test('Removing one leaves the rest',()=>{
 const {s,cargo}=desk();
 M.addAssessment(s,quote(cargo));
 const second=M.addAssessment(s,quote(cargo,{month:'2026-11',value:452}));
 M.removeAssessment(s,second.id);
 assert.deepEqual(s.priceAssessments.map(a=>a.month),['2026-10']);
 M.removeAssessment(s,'PA-99');
 assert.equal(s.priceAssessments.length,1,'removing what is not there removes nothing');
});

test('A renamed cargo is renamed in the assessments that quote it',()=>{
 const {s,cargo}=desk();
 M.addAssessment(s,quote(cargo));
 s.cargoTypes.find(c=>c.id===cargo.id).name='Urea granular, prilled';
 M.ensureCatalogs(s);
 assert.equal(s.priceAssessments[0].cargoName,'Urea granular, prilled');
});

test('The assessments are a shared register, stored a row at a time',()=>{
 const {s,cargo}=desk();
 M.addAssessment(s,quote(cargo));
 assert.ok(Schema.REGISTER_KEYS.includes('priceAssessments'),
  'a curve is entered by many people at once, and one document would refuse the second');
 const parts=Schema.split(s);
 assert.equal(parts.registers.priceAssessments.length,1);
 assert.equal(parts.voyage.priceAssessments,undefined,'not a copy inside every calculation');
 assert.deepEqual(Schema.merge(parts).priceAssessments,s.priceAssessments);
 assert.deepEqual(Schema.unkeyed(s).priceAssessments,undefined,'every row has an id to be keyed by');
});

test('A workspace saved before the register existed gains an empty one',()=>{
 const s=M.initial();
 delete s.priceAssessments;
 M.ensureCatalogs(s);
 assert.deepEqual(s.priceAssessments,[],'empty, not absent: the screen can read it without asking');
});
