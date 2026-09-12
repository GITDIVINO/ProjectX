'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./model'),P=require('./planning');

// A voyage with both parcels priced on the given basis.
function priced(price,basis){
 const s=M.demo();P.ensure(s);
 s.sales.forEach(x=>{x.price=price;x.priceBasis=basis;});
 return s;
}

test('On FOB the freight was never ours, so nothing comes off',()=>{
 const s=priced(430,'FOB');
 const {budget}=M.compute(s);
 for(const row of budget.allocation)assert.equal(row.netbackUnit,430,'the netback is the price itself');
 // The voyage netback is the revenue, with no voyage cost deducted anywhere.
 const revenue=budget.allocation.reduce((n,r)=>n+r.revenueCents,0);
 assert.equal(budget.netbackCents,revenue);
});

test('On CFR the voyage cost allocated to a parcel comes off its price',()=>{
 const s=priced(430,'CFR');
 const {budget}=M.compute(s);
 for(const row of budget.allocation){
  const expected=430-row.cents/100/row.quantity;
  assert.ok(Math.abs(row.netbackUnit-expected)<1e-9,`${row.id}: ${row.netbackUnit} vs ${expected}`);
  assert.ok(row.netbackUnit<430,'delivering it cost something');
 }
});

test('CIF deducts the freight the same way CFR does',()=>{
 const cfr=M.compute(priced(430,'CFR')).budget;
 const cif=M.compute(priced(430,'CIF')).budget;
 assert.equal(cif.netbackCents,cfr.netbackCents,'insurance is a cost item, not a different rule');
});

test('The netback is exact to the cent, and the parts add to the whole',()=>{
 const s=priced(437.25,'CFR');
 const {budget}=M.compute(s);
 for(const row of budget.allocation){
  assert.ok(Number.isSafeInteger(row.revenueCents),'revenue is whole cents');
  assert.ok(Number.isSafeInteger(row.netbackCents),'so is the netback');
  assert.equal(row.netbackCents,row.revenueCents-row.cents,'price less the cost allocated to it');
 }
 const revenue=budget.allocation.reduce((n,r)=>n+r.revenueCents,0);
 const allocated=budget.allocation.reduce((n,r)=>n+r.cents,0);
 assert.equal(budget.netbackCents,revenue-allocated,'no cent is created or lost in the total');
 assert.equal(allocated,budget.totalCents,'and the whole voyage cost was allocated');
});

test('A parcel with no price has no netback, and nor does the voyage',()=>{
 const s=priced(430,'CFR');
 s.sales[1].price=null;
 const {budget}=M.compute(s);
 const unpriced=budget.allocation.find(r=>r.price===null);
 const stillPriced=budget.allocation.find(r=>r.price!==null);
 assert.equal(unpriced.netbackUnit,null,'unknown, not zero: zero would read as a sale that earns nothing');
 assert.equal(unpriced.netbackCents,null);
 assert.ok(stillPriced.netbackUnit>0,'the priced parcel still has one');
 assert.equal(budget.netback,null,'a total is only a total when every part of it is known');
});

test('A voyage with no prices at all still calculates its cost',()=>{
 const s=M.demo();P.ensure(s);
 const {budget}=M.compute(s);
 assert.ok(budget.totalCents>0,'the cost is unaffected by the absence of prices');
 assert.equal(budget.netback,null);
 for(const row of budget.allocation)assert.equal(row.netbackUnit,null);
});

test('Each parcel is netted against its own basis, not the voyage average',()=>{
 const s=priced(430,'CFR');
 s.sales[0].priceBasis='FOB';
 const {budget}=M.compute(s);
 const [first,second]=budget.allocation;
 assert.equal(first.netbackUnit,430,'the FOB parcel keeps its price');
 assert.ok(second.netbackUnit<430,'the CFR parcel pays for its carriage');
 assert.equal(budget.netbackCents,first.revenueCents+(second.revenueCents-second.cents));
});

test('A price is quoted on a basis, and an unsupported one is refused',()=>{
 const s=M.initial();
 const cargo=s.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true));
 const base={cargoId:cargo.id,quantity:1000,price:250,dealDate:'2026-09-01',
  shipmentFrom:'2026-09-10',shipmentTo:'2026-09-20',
  loadPort:'Ust-Luga',dischargePort:'Santos'};
 assert.ok(M.addSale(s,{...base,priceBasis:'CFR'}).id,'CFR is accepted');
 assert.throws(()=>M.addSale(s,{...base,priceBasis:'EXW'}),/delivery basis/,'EXW is not a basis this tool prices on');
 assert.throws(()=>M.addSale(s,{...base,price:-1,priceBasis:'FOB'}),/non-negative price/);
});

test('A sale saved before the basis existed is read as FOB, under the name it was entered by',()=>{
 // The field used to be called fob, so whatever is in it was entered as an FOB price.
 const s=M.demo();
 s.sales[0]={...s.sales[0],fob:312,price:undefined,priceBasis:undefined};
 delete s.sales[0].price;delete s.sales[0].priceBasis;
 M.ensureCatalogs(s);
 assert.equal(s.sales[0].price,312,'the number is kept');
 assert.equal(s.sales[0].priceBasis,'FOB','and read on the basis its field was named for');
 assert.equal(s.sales[0].fob,undefined,'the misleading name is gone');
});

test('Netback survives the split and the round trip through storage',()=>{
 const Schema=require('./schema');
 const s=priced(430,'CFR');
 const before=M.compute(s).budget.netbackCents;
 const back=Schema.merge(Schema.split(s));
 assert.equal(M.compute(back).budget.netbackCents,before);
});
