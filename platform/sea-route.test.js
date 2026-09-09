'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),S=require('./sea-route'),M=require('./model');
const at=name=>{const p=M.PORT_PROFILES[name];return [p.lon,p.lat];};
test('Ocean legs match published distances within a few per cent',()=>{
 // References are round figures from ordinary distance tables, so the tolerance is generous by design.
 for(const [from,to,reference,tolerance] of [['Ust-Luga','Santos',6900,.05],['Itaqui','Vitoria',1700,.05],['Ust-Luga','Itaqui',5800,.08],['Murmansk','Santos',6600,.08]]){
  const r=S.route(at(from),at(to));
  assert.ok(r.distance>0,from+' → '+to+' has no route');
  assert.ok(Math.abs(r.distance-reference)/reference<=tolerance,`${from} → ${to}: ${r.distance.toFixed(0)} nm against ${reference} nm`);
  assert.ok(r.reliable,from+' → '+to+' should not be flagged');
  assert.ok(r.path.length>2,'the drawn track passes through the network, not straight over land');
 }
});
test('A coastal leg the network cannot see is flagged, not quietly answered',()=>{
 // The lane network has no node near these ports: the approach legs are the whole route.
 for(const [from,to] of [['Santos','Paranaguá'],['Paranaguá','San Francisco do Sul'],['Suape','Pecem']]){
  const r=S.route(at(from),at(to));
  assert.ok(r.distance>0,from+' → '+to+' still returns a figure');
  assert.equal(r.reliable,false,from+' → '+to+' must be flagged as unreliable');
 }
});
test('Every registered port has an anchor the router can use',()=>{
 for(const [name,profile] of Object.entries(M.PORT_PROFILES)){
  assert.ok(Number.isFinite(profile.lat)&&Math.abs(profile.lat)<=90,name+' has no usable latitude');
  assert.ok(Number.isFinite(profile.lon)&&Math.abs(profile.lon)<=180,name+' has no usable longitude');
  const near=S.route([profile.lon,profile.lat],at('Santos'));
  assert.ok(near.distance!==null,name+' is not connected to the network');
 }
});
test('Missing coordinates answer with a reason instead of a number',()=>{
 assert.equal(S.route(null,at('Santos')).distance,null);
 assert.match(S.route(null,null).reason,/coordinates/);
});
test('The route is symmetric and the coastline decodes',()=>{
 const there=S.route(at('Ust-Luga'),at('Santos')).distance,back=S.route(at('Santos'),at('Ust-Luga')).distance;
 assert.ok(Math.abs(there-back)/there<.02,'the same leg measures the same in both directions');
 const coast=S.coastline();
 assert.ok(coast.length>50&&coast.every(ring=>ring.length>2),'the drawn coastline survives the encoding');
});
