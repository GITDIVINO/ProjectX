'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./model'),P=require('./planning');

function fixture(masses){
 const s=M.demo();
 s.lots=[{...s.lots[0],quantity:P.exactSum(masses),sf:1}];
 s.holds=masses.map((_,i)=>({id:i+1,volume:100000,massLimit:null}));
 s.allocations=masses.flatMap((quantity,i)=>quantity>0?[{lot:'S1',hold:i+1,quantity}]:[]);
 M.syncRoute(s);P.ensure(s);return s;
}
const codes=row=>row.issues.map(x=>x.code);
const at=(r,call,phase)=>r.states.find(x=>x.call===call&&x.phase===phase);

test('Forward holds 1 and 2 are identified at departure and following arrival, without technical rejection',()=>{
 const s=fixture([5000,5000,0,0,0]),r=P.check(s),p=r.loadingPatterns;
 assert.equal(p.method,'cargo-pattern-2');
 assert.equal(p.plan.key,'load');assert.equal(p.plan.label,'After all loadings');
 for(const row of [p.plan,at(p,'Ust-Luga','departure'),at(p,'Santos','arrival')]){
  assert.equal(row.status,'attention');assert.deepEqual(codes(row),['end-only-forward']);
  assert.deepEqual(row.issues[0].holds,[1,2]);assert.equal(row.quantity,10000);
  assert.deepEqual([row.foreMass,row.middleMass,row.aftMass],[10000,0,0]);
 }
 assert.equal(at(p,'Ust-Luga','departure').label,'Departure · Ust-Luga');
 assert.equal(at(p,'Santos','arrival').label,'Arrival · Santos');
 assert.equal(r.status,'volume-allocated');assert.deepEqual(r.errors,[]);assert.equal(r.technical,'not-reviewed');
 assert.ok(r.warnings.every(x=>!x.includes('forward')&&!x.includes('hull-strength')));
});

test('A full distributed plan still exposes forward-only cargo after an earlier discharge',()=>{
 const s=M.demo();s.lots[0].quantity=6000;s.lots[1].quantity=4000;
 s.holds=Array.from({length:5},(_,i)=>({id:i+1,volume:10000,massLimit:null}));
 s.allocations=[3,4,5].map(hold=>({lot:'S1',hold,quantity:2000})).concat([1,2].map(hold=>({lot:'S2',hold,quantity:2000})));
 M.syncRoute(s);P.ensure(s);const p=P.loadingPatterns(s);
 assert.equal(p.plan.status,'no-pattern');
 assert.deepEqual(codes(at(p,'Santos','departure')),['end-only-forward']);
 assert.deepEqual(at(p,'Santos','departure').occupied,[1,2]);
 assert.equal(at(p,'Santos','departure').quantity,4000);
 assert.deepEqual(codes(at(p,'Paranaguá','arrival')),['end-only-forward']);
 assert.equal(at(p,'Paranaguá','departure').status,'empty');
});

test('Several load ports are screened before later cargo fills the empty end',()=>{
 const s=M.demo();s.lots[0].quantity=4000;s.lots[1].quantity=6000;s.lots[1].loadPort='Murmansk';
 s.allocations=[1,2].map(hold=>({lot:'S1',hold,quantity:2000})).concat([3,4,5].map(hold=>({lot:'S2',hold,quantity:2000})));
 M.syncRoute(s);P.ensure(s);const p=P.loadingPatterns(s);
 assert.deepEqual(codes(at(p,'Ust-Luga','departure')),['end-only-forward']);
 assert.deepEqual(codes(at(p,'Murmansk','arrival')),['end-only-forward']);
 assert.equal(at(p,'Murmansk','departure').status,'no-pattern');
 assert.equal(p.plan.status,'no-pattern');
});

test('Aft-only and central single-hold cargo are distinct patterns with no duplicate single alert',()=>{
 const aft=P.loadingPatterns(fixture([0,0,0,5000,5000])).plan;
 assert.deepEqual(codes(aft),['end-only-aft']);assert.deepEqual(aft.issues[0].holds,[4,5]);
 assert.deepEqual([aft.foreMass,aft.middleMass,aft.aftMass],[0,0,10000]);
 assert.deepEqual(codes(P.loadingPatterns(fixture([0,0,0,0,10000])).plan),['end-only-aft']);
 const central=P.loadingPatterns(fixture([0,0,10000,0,0])).plan;
 assert.deepEqual(codes(central),['single-hold']);assert.deepEqual(central.issues[0].holds,[3]);
});

test('An empty interior hold is a review pattern even with equal end masses',()=>{
 const ends=P.loadingPatterns(fixture([5000,0,0,0,5000])).plan;
 assert.deepEqual(codes(ends),['gapped']);assert.deepEqual(ends.issues[0].holds,[2,3,4]);
 assert.deepEqual([ends.foreMass,ends.middleMass,ends.aftMass],[5000,0,5000]);
 const oneGap=P.loadingPatterns(fixture([2000,2000,0,3000,3000])).plan;
 assert.deepEqual(codes(oneGap),['gapped']);assert.deepEqual(oneGap.issues[0].holds,[3]);
 assert.equal(P.loadingPatterns(fixture([2000,2000,2000,2000,2000])).plan.status,'no-pattern');
});

test('A partial central or end-to-middle continuous block requests the applicable loading condition',()=>{
 // A block amidships is only a block; the same block pushed to one end is also a mass gathered there.
 for(const [masses,expected] of [[[0,3000,4000,3000,0],['partial-block']],[[3000,3000,4000,0,0],['partial-block','end-heavy']]]){
  const row=P.loadingPatterns(fixture(masses)).plan;
  assert.deepEqual(codes(row),expected);assert.match(row.issues[0].text,/approved loading condition/);
 }
});

test('A fully loaded ship whose mass sits in one end is raised, and a balanced one is not',()=>{
 // Every hold is occupied, so no pattern above sees it; the end groups are what carries the trim risk.
 const forward=P.check(fixture([12000,12000,2000,2000,2000])).loadingPatterns.plan;
 assert.equal(forward.status,'attention');assert.deepEqual(codes(forward),['end-heavy']);
 assert.match(forward.issues[0].text,/gathered forward: the end groups differ by 67 % of the cargo on board/);
 assert.deepEqual(forward.issues[0].holds,[1,2],'the heavy end is what the diagram marks');
 assert.deepEqual([forward.foreMass,forward.middleMass,forward.aftMass],[24000,2000,4000]);
 const aft=P.check(fixture([2000,2000,2000,12000,12000])).loadingPatterns.plan;
 assert.deepEqual(codes(aft),['end-heavy']);assert.match(aft.issues[0].text,/gathered aft/);
 assert.deepEqual(aft.issues[0].holds,[4,5]);
 // Balanced ends stay quiet, and the threshold is a strict one quarter of the cargo on board.
 assert.equal(P.check(fixture([7000,8000,7000,4000,4000])).loadingPatterns.plan.status,'no-pattern','ends within a quarter of each other are not raised');
 assert.deepEqual(codes(P.check(fixture([7500,7500,7500,3750,3750])).loadingPatterns.plan),[],'exactly a quarter apart is not raised');
 assert.deepEqual(codes(P.check(fixture([7600,7600,7300,3750,3750])).loadingPatterns.plan),['end-heavy'],'a hair over it is');
 // It never repeats what a stronger signal already said.
 for(const masses of [[5000,5000,0,0,0],[0,0,0,5000,5000],[0,0,10000,0,0]])
  assert.ok(!codes(P.check(fixture(masses)).loadingPatterns.plan).includes('end-heavy'),'end-only and single-hold speak for themselves: '+masses);
});
test('A majority in one hold is descriptive and starts strictly above half of cargo mass',()=>{
 const major=P.loadingPatterns(fixture([1000,1000,6000,1000,1000])).plan;
 assert.deepEqual(codes(major),['majority-hold']);assert.deepEqual(major.issues[0].holds,[3]);
 assert.match(major.issues[0].text,/more than half of the cargo mass/);
 assert.equal(P.loadingPatterns(fixture([1250,1250,5000,1250,1250])).plan.status,'no-pattern');
});

test('Missing allocations, over-allocation, invalid quantities and unknown hold IDs cannot look screened',()=>{
 for(const mutate of [
  s=>s.allocations=[],
  s=>s.allocations.pop(),
  s=>s.allocations[0].quantity+=1,
  s=>s.allocations[0].quantity=null,
  s=>s.allocations[0].quantity=-1,
  s=>s.allocations[0].quantity=Infinity,
  s=>s.allocations[0].hold=99,
  s=>s.holds[1].id=s.holds[0].id,
  s=>s.holds=[],
  s=>s.lots[0].quantity=null,
  s=>s.allocations.push({lot:'missing-lot',hold:3,quantity:1})
 ]){
  const s=fixture([5000,5000,0,0,0]);mutate(s);const p=P.loadingPatterns(s);
  for(const row of [p.plan,at(p,'Ust-Luga','departure')]){
   assert.equal(row.status,'incomplete');assert.ok(row.missing.length);assert.deepEqual(row.issues,[]);
  }
 }
});

test('Each onboard parcel must reconcile even if short and excess allocations cancel in the total',()=>{
 const s=M.demo();P.ensure(s);
 s.lots.forEach(l=>l.quantity=5000);
 s.allocations=[{lot:'S1',hold:1,quantity:4000},{lot:'S2',hold:5,quantity:6000}];
 const row=P.loadingPatterns(s).plan;
 assert.equal(row.quantity,10000);assert.equal(row.foreMass+row.middleMass+row.aftMass,10000);
 assert.equal(row.status,'incomplete');assert.equal(row.missing.filter(x=>x.includes('full on-board quantity')).length,2);
});

test('Unknown SF hides volume but retains known hold mass and cargo patterns',()=>{
 const s=fixture([5000,5000,0,0,0]);s.lots[0].sf=null;
 const summary=P.stageSummary(s,'load');
 assert.deepEqual(summary.holds.map(h=>h.mass),[5000,5000,0,0,0]);
 assert.deepEqual(summary.holds.map(h=>h.used),[null,null,0,0,0]);
 const p=P.loadingPatterns(s);assert.equal(p.plan.status,'attention');assert.deepEqual(codes(p.plan),['end-only-forward']);
 assert.deepEqual(p.plan.missing,[]);assert.ok(P.check(s).errors.some(x=>x.includes('SF')));
});

test('SF and cubic fill cannot change a mass distribution pattern',()=>{
 const s=fixture([2000,2000,2000,2000,2000]),before=P.loadingPatterns(s);
 s.holds.forEach((h,i)=>h.volume=(i+1)*10000);s.lots[0].sf=2;
 assert.deepEqual(P.loadingPatterns(s),before);
});

test('Actual zero-cargo states are empty; a positive unallocated parcel is incomplete',()=>{
 const s=fixture([2000,2000,2000,2000,2000]),p=P.loadingPatterns(s);
 for(const row of [at(p,'Ust-Luga','arrival'),at(p,'Santos','departure')]){
  assert.equal(row.status,'empty');assert.equal(row.quantity,0);assert.deepEqual(row.occupied,[]);assert.deepEqual(row.issues,[]);
 }
 s.allocations=[];assert.equal(P.loadingPatterns(s).plan.status,'incomplete');
 const empty=M.initial();P.ensure(empty);assert.equal(P.loadingPatterns(empty).plan.status,'empty');
 const zero=fixture([0,0,0,0,0]);assert.equal(P.loadingPatterns(zero).plan.status,'empty');
 zero.allocations=[{lot:'S1',hold:1,quantity:1}];assert.equal(P.loadingPatterns(zero).plan.status,'incomplete');
});

test('Unknown allocations for a later parcel do not invalidate an earlier known cargo state',()=>{
 const s=M.demo();s.lots[0].quantity=4000;s.lots[1].loadPort='Murmansk';
 s.allocations=[{lot:'S1',hold:1,quantity:2000},{lot:'S1',hold:2,quantity:2000}];
 M.syncRoute(s);P.ensure(s);const p=P.loadingPatterns(s);
 assert.equal(at(p,'Ust-Luga','departure').status,'attention');
 assert.equal(at(p,'Murmansk','departure').status,'incomplete');assert.equal(p.plan.status,'incomplete');
});

test('Three, five and seven holds use vessel order rather than hard-coded hold numbers',()=>{
 for(const size of [3,5,7]){
  const half=Math.floor(size/2),masses=Array.from({length:size},(_,i)=>i<half?1000:0),s=fixture(masses);
  s.holds.forEach((h,i)=>h.id=70-i*3);
  s.allocations.forEach((a,i)=>a.hold=s.holds[i].id);
  const row=P.loadingPatterns(s).plan;
  assert.deepEqual(codes(row),['end-only-forward']);assert.deepEqual(row.occupied,s.holds.slice(0,half).map(h=>h.id));
  assert.equal(row.foreMass,half*1000);assert.equal(row.middleMass,0);assert.equal(row.aftMass,0);
  const full=P.loadingPatterns(fixture(Array(size).fill(1000))).plan;
  assert.equal(full.foreMass,half*1000);assert.equal(full.middleMass,1000);assert.equal(full.aftMass,half*1000);
  assert.equal(full.status,'no-pattern');
 }
 const even=P.loadingPatterns(fixture([1000,1000,1000,1000])).plan;
 assert.deepEqual([even.foreMass,even.middleMass,even.aftMass],[2000,0,2000]);
 assert.equal(P.loadingPatterns(fixture([1000])).plan.status,'no-pattern');
});

test('Route changes change affected states while an unresolved route remains incomplete',()=>{
 const s=M.demo();s.lots.forEach(l=>l.quantity=4000);
 s.allocations=[{lot:'S1',hold:1,quantity:2000},{lot:'S1',hold:2,quantity:2000},{lot:'S2',hold:4,quantity:2000},{lot:'S2',hold:5,quantity:2000}];
 P.ensure(s);assert.deepEqual(codes(at(P.loadingPatterns(s),'Santos','departure')),['end-only-aft']);
 M.moveCall(s,'Paranaguá',-1);
 assert.deepEqual(codes(at(P.loadingPatterns(s),'Paranaguá','departure')),['end-only-forward']);
 s.lots[0].loadPort='Missing load port';
 assert.ok(P.loadingPatterns(s).states.every(row=>row.status==='incomplete'));
});

test('Screening has no mutation, financial effect, solver effect, or inferred technical acceptance',()=>{
 const s=M.demo();P.ensure(s);const input=JSON.stringify(s),budget=M.compute(s).budget,solved=P.solve(s);
 const p=P.loadingPatterns(s),cached=new Map([['load',P.stageSummary(s,'load')],...P.events(s).map(e=>[e.key,P.stageSummary(s,e.key)])]);
 assert.deepEqual(P.loadingPatterns(s,cached),p);assert.equal(JSON.stringify(s),input);
 assert.deepEqual(M.compute(s).budget,budget);assert.deepEqual(P.solve(s),solved);
 const report=P.check(s,budget);assert.equal(report.technical,'not-reviewed');assert.equal(JSON.stringify(s),input);
 assert.deepEqual(report.loadingPatterns,p);
 P.addReport(s,{reference:'External report',reviewer:'Reviewer',date:'2026-09-10',result:'accepted',covered:P.events(s).map(e=>e.key)});
 assert.equal(P.check(s,budget).technical,'accepted');assert.deepEqual(P.loadingPatterns(s),p);
 assert.ok(p.states.every(row=>!['safe','stable','approved','accepted'].includes(row.status)));
});
