'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./model'),P=require('./planning'),Sea=require('./sea-route');
const Forward=require('./forward');

// A workspace with assumptions stated and a small forward curve entered.
function desk({assessments,ports,basis='CFR'}={}){
 const s=M.demo();P.ensure(s);
 s.hire=13500;
 s.prices={main:520,eca:760,aux:760};
 // The open calculation is a real one: a vessel approaching from somewhere, extra income,
 // cost items of its own. None of that belongs in a per-tonne forward cost, and the fixture
 // states it so that the reference voyage has something to leave behind.
 s.deliveryPort='Rotterdam';
 s.ballastEnabled=true;
 s.ballast={...s.ballast,from:'Rotterdam',to:'Ust-Luga',distance:1180,speed:12.5,consumption:22,zone:'main'};
 s.extraIncome=45000;
 s.costs=[{id:'c1',name:'Surveyor',amount:12000}];
 const cargo=s.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true));
 s.forward={origin:'Ust-Luga',quantity:30000,ports:ports??[
  {name:'Ust-Luga',rate:8000,da:60000},
  {name:'Santos',rate:6000,da:85000},
  {name:'Paranaguá',rate:6000,da:80000}
 ]};
 s.priceAssessments=assessments??[
  {id:'a1',cargoId:cargo.id,destination:'Santos',month:'2026-10',basis,value:445,source:'Profercy',date:'2026-09-11'},
  {id:'a2',cargoId:cargo.id,destination:'Santos',month:'2026-11',basis,value:452,source:'Profercy',date:'2026-09-11'},
  {id:'a3',cargoId:cargo.id,destination:'Paranaguá',month:'2026-10',basis,value:448,source:'Profercy',date:'2026-09-11'}
 ];
 const f=Forward.create({M,Sea,getState:()=>s});
 return {s,cargo,f,
  matrix:()=>f.matrix({cargoId:cargo.id,origin:'Ust-Luga',quantity:30000,
   destinations:f.destinationsPresent(cargo.id),months:f.monthsPresent(cargo.id)})};
}

test('A month is a month, and nothing else is one',()=>{
 const {f}=desk();
 for(const good of ['2026-01','2026-10','2026-12'])assert.ok(f.isMonth(good),good);
 for(const bad of ['2026-13','2026-00','2026-1','26-01','2026-10-03','',null,undefined])
  assert.ok(!f.isMonth(bad),JSON.stringify(bad)+' is not a month');
});

test('The margin is the assessment less what delivering it costs',()=>{
 const {matrix}=desk();
 const m=matrix();
 const santos=m.rows.find(r=>r.destination==='Santos');
 assert.ok(santos.cost.ok,'the reference voyage costed');
 const october=santos.cells.find(c=>c.month==='2026-10');
 assert.ok(Math.abs(october.margin-(445-santos.cost.unit))<1e-9);
 const november=santos.cells.find(c=>c.month==='2026-11');
 assert.ok(Math.abs(november.margin-(452-santos.cost.unit))<1e-9);
 assert.ok(november.margin>october.margin,'the curve rises because the assessment does');
});

test('The better destination is not always the cheaper one to reach',()=>{
 const {matrix}=desk();
 const m=matrix();
 const santos=m.rows.find(r=>r.destination==='Santos');
 const paranagua=m.rows.find(r=>r.destination==='Paranaguá');
 const at=(row,month)=>row.cells.find(c=>c.month===month).margin;
 assert.ok(paranagua.cost.unit>santos.cost.unit,'Paranaguá costs more to reach');
 assert.ok(at(paranagua,'2026-10')>at(santos,'2026-10'),'and still leaves more, because the assessment is higher');
});

test('An FOB assessment has no freight in it, so none is taken off',()=>{
 const cfr=desk({basis:'CFR'}).matrix();
 const fob=desk({basis:'FOB'}).matrix();
 const santosFob=fob.rows.find(r=>r.destination==='Santos');
 assert.equal(santosFob.cells.find(c=>c.month==='2026-10').margin,445,'the margin is the assessment itself');
 const santosCfr=cfr.rows.find(r=>r.destination==='Santos');
 assert.ok(santosCfr.cells.find(c=>c.month==='2026-10').margin<445);
});

test('An FOB assessment stands even when the delivered cost cannot be worked out',()=>{
 // Nothing stated about any port, so no reference voyage can be costed.
 const {matrix}=desk({ports:[],basis:'FOB'});
 const santos=matrix().rows.find(r=>r.destination==='Santos');
 assert.equal(santos.cost.ok,false);
 const october=santos.cells.find(c=>c.month==='2026-10');
 assert.equal(october.margin,445,'an FOB price has no freight in it, so none is needed to net it');
 assert.deepEqual(october.missing,[]);
});

test('The load port is not a destination, and the cell says which one is wanted',()=>{
 const {cargo,f}=desk();
 const cost=f.deliveredCost({cargoId:cargo.id,quantity:30000,origin:'Ust-Luga',destination:'Ust-Luga'});
 assert.equal(cost.ok,false);
 assert.deepEqual(cost.missing,['a destination other than the load port']);
});

test('A month with no assessment says so instead of borrowing its neighbour',()=>{
 const {matrix}=desk();
 const paranagua=matrix().rows.find(r=>r.destination==='Paranaguá');
 const november=paranagua.cells.find(c=>c.month==='2026-11');
 assert.equal(november.margin,null);
 assert.deepEqual(november.missing,['assessment']);
 assert.equal(november.assessment,null,'nothing was interpolated from October');
});

test('An unstated assumption is named, not guessed',()=>{
 // No handling rate and no disbursement anywhere.
 const {matrix}=desk({ports:[]});
 const santos=matrix().rows.find(r=>r.destination==='Santos');
 assert.equal(santos.cost.ok,false);
 assert.ok(santos.cost.missing.includes('handling rate'),santos.cost.missing.join(', '));
 assert.ok(santos.cost.missing.includes('port disbursement'));
 for(const c of santos.cells){
  assert.equal(c.margin,null,'no cell pretends to a margin');
  assert.ok(c.missing.includes('handling rate'));
 }
});

test('A destination the router cannot reach is reported as a missing distance',()=>{
 const {s,cargo,f}=desk();
 // A port with no coordinates and no published pair cannot be routed to.
 s.portRecords.push({id:'PX',name:'Nowhere',country:'',terminal:'',berth:'Berth 1',
  waterDensity:null,lat:null,lon:null,notes:'',da:null});
 s.forward.ports.push({name:'Nowhere',rate:6000,da:50000});
 const cost=f.deliveredCost({cargoId:cargo.id,quantity:30000,origin:'Ust-Luga',destination:'Nowhere'});
 assert.equal(cost.ok,false);
 assert.ok(cost.missing.includes('distance'),cost.missing.join(', '));
});

test('The reference voyage is a costing, not a plan',()=>{
 const {cargo,f}=desk();
 const built=f.referenceVoyage({cargoId:cargo.id,quantity:30000,origin:'Ust-Luga',destination:'Santos'});
 assert.ok(built.ok);
 assert.equal(built.state.lots.length,1,'one parcel');
 assert.equal(built.state.ballastEnabled,false,'no approach: a forward month has no vessel position');
 assert.equal(built.state.freight,null,'and no revenue assumption of its own');
 assert.equal(built.state.extraIncome,0,'nor any other income');
 assert.deepEqual(built.state.costs,[],'nor any additional items carried over');
 assert.deepEqual(built.state.ports.map(p=>p.name),['Ust-Luga','Santos'],'two calls and no others');
 assert.equal(built.state.legs.length,1,'and one leg between them');
 assert.ok(!built.state.legs.some(l=>l.from==='Rotterdam'),'the approach from Rotterdam is gone');
});

test('The approach to the load port is not charged to the tonne',()=>{
 const {s,cargo,f}=desk();
 const withApproach=f.deliveredCost({cargoId:cargo.id,quantity:30000,origin:'Ust-Luga',destination:'Santos'});
 s.ballastEnabled=false;
 const without=f.deliveredCost({cargoId:cargo.id,quantity:30000,origin:'Ust-Luga',destination:'Santos'});
 assert.equal(withApproach.costCents,without.costCents,
  'a forward month has no vessel position, so 1,180 miles of approach cannot be in the cost');
});

test('The row reports the distance it was costed on',()=>{
 const {cargo,f}=desk();
 const cost=f.deliveredCost({cargoId:cargo.id,quantity:30000,origin:'Ust-Luga',destination:'Santos'});
 assert.equal(cost.distance,6818,'the one leg of the reference voyage, and nothing else');
 assert.equal(cost.distanceSource,'routed');
 assert.ok(cost.days>0);
});

test('The reference voyage does not disturb the calculation it borrowed from',()=>{
 const {s,cargo,f}=desk();
 const before=JSON.stringify(s);
 const m=f.matrix({cargoId:cargo.id,origin:'Ust-Luga',quantity:30000,
  destinations:['Santos','Paranaguá'],months:['2026-10','2026-11']});
 assert.ok(m.rows.every(r=>r.cost.ok)&&m.rows.some(r=>r.cells.some(c=>c.margin!==null)),
  'the matrix did the work whose side effects are being checked for');
 assert.equal(JSON.stringify(s),before,'costing a hypothetical voyage changed nothing real');
});

test('A published distance outranks a routed one, as in a real leg',()=>{
 const {f}=desk();
 // Pub. 151 prints Santos to Paranagua at 163 miles. The router's own estimate of that pair
 // is 160 and it reports it as unreliable, so here the publication is not merely preferred:
 // it is the only figure there is.
 const short=f.distanceBetween('Santos','Paranaguá');
 assert.equal(short.source,'published');
 assert.equal(short.distance,163);
 assert.ok(!Sea.route([-46.3,-23.98],[-48.52,-25.5]).reliable,
  'and the estimate it displaced was not fit to use');
 // Ust-Luga is not in the table, so the leg the reference voyage actually sails is routed.
 const long=f.distanceBetween('Ust-Luga','Santos');
 assert.equal(long.source,'routed');
 assert.equal(long.distance,6818);
});

test('The matrix shows the months that exist, in order',()=>{
 const {cargo,f}=desk();
 assert.deepEqual(f.monthsPresent(cargo.id),['2026-10','2026-11']);
 assert.deepEqual(f.destinationsPresent(cargo.id),['Paranaguá','Santos']);
});

test('The screen is given a row for every port it is about to ask about',()=>{
 const {s,cargo,f}=desk({ports:[{name:'Santos',rate:6000,da:85000}]});
 const settled=f.ensure(['Ust-Luga','Santos','Paranaguá']);
 assert.deepEqual(settled.ports.map(p=>p.name),['Santos','Ust-Luga','Paranaguá']);
 assert.deepEqual(settled.ports.find(p=>p.name==='Paranaguá'),{name:'Paranaguá',rate:null,da:null},
  'added with nothing stated, not with a plausible figure');
 assert.equal(settled.ports.find(p=>p.name==='Santos').rate,6000,'what was stated is untouched');
 // Asking twice does not add the same port twice, and dropping a destination from the matrix
 // does not discard the rate somebody entered for it.
 f.ensure(['Ust-Luga','Santos']);
 assert.equal(s.forward.ports.length,3);
 assert.equal(cargo&&true,true);
});

test('A workspace with no assumptions at all is given the shape of them',()=>{
 const {s,f}=desk();
 delete s.forward;
 const settled=f.ensure([]);
 assert.equal(settled.origin,'Ust-Luga','the first load port the registers hold');
 assert.equal(settled.quantity,null);
 assert.deepEqual(settled.ports,[]);
});

test('An empty register gives an empty matrix rather than an error',()=>{
 const {cargo,f}=desk({assessments:[]});
 assert.deepEqual(f.monthsPresent(cargo.id),[]);
 const m=f.matrix({cargoId:cargo.id,origin:'Ust-Luga',quantity:30000,destinations:[],months:[]});
 assert.deepEqual(m.rows,[]);
});

test('An assessment carries the source and date it came from',()=>{
 const {cargo,f}=desk();
 const a=f.assessmentFor(cargo.id,'Santos','2026-10');
 assert.equal(a.source,'Profercy');
 assert.equal(a.date,'2026-09-11');
 assert.equal(a.basis,'CFR','a price without its basis cannot be netted');
});
