(function(root){
'use strict';
const Data=typeof module!=='undefined'&&module.exports?require('./sea-data'):root.ProjectXSeaData;
const Table=typeof module!=='undefined'&&module.exports?require('./sea-table'):root.ProjectXSeaTable;
const NM=3440.065,rad=d=>d*Math.PI/180;
// Great-circle distance in nautical miles. Every edge weight and every port approach uses this one measure.
function haversine(a,b){
 const dLat=rad(b[1]-a[1]),dLon=rad(b[0]-a[0]);
 const h=Math.sin(dLat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dLon/2)**2;
 return 2*NM*Math.asin(Math.min(1,Math.sqrt(h)));
}
const dec=(text,i)=>parseInt(text.slice(i,i+3),36);
function points(text){
 const out=[];
 for(let i=0;i<text.length;i+=6)out.push([(dec(text,i)-Data.lonOffset)/Data.scale,(dec(text,i+3)-Data.latOffset)/Data.scale]);
 return out;
}
let graph=null;
// Decoded once and kept: the network never changes inside a session.
function network(){
 if(graph)return graph;
 const nodes=points(Data.nodes),adjacency=nodes.map(()=>[]);
 for(let i=0;i<Data.edges.length;i+=6){
  const a=dec(Data.edges,i),b=dec(Data.edges,i+3),w=haversine(nodes[a],nodes[b]);
  adjacency[a].push([b,w]);adjacency[b].push([a,w]);
 }
 graph={nodes,adjacency};
 return graph;
}
const coastline=()=>Data.coast.map(points);
// Shallowest band first: each is the sea deeper than its own level, so they nest.
const depths=()=>(Data.depths||[]).map(d=>({level:d.level,rings:d.rings.map(points)}));
// The nearest network nodes to a position, nearest first.
function nearest(position,count){
 const {nodes}=network(),best=[];
 for(let i=0;i<nodes.length;i++){
  const d=haversine(position,nodes[i]);
  if(best.length<count||d<best[best.length-1][0]){
   best.push([d,i]);best.sort((x,y)=>x[0]-y[0]);if(best.length>count)best.pop();
  }
 }
 return best;
}
// A port is not on the network, so it enters through its nearest nodes and leaves the same way.
// Dijkstra runs over the network alone; the approach legs are the search's start and end costs.
const cache=new Map();
// A render redraws every leg, so a pair already solved is answered from the last result.
function route(from,to,options){
 if(!Array.isArray(from)||!Array.isArray(to))return solve(from,to,options);
 const key=[from,to,options?.approaches??3].join(',');
 if(!cache.has(key)){if(cache.size>200)cache.clear();cache.set(key,solve(from,to,options));}
 return cache.get(key);
}
function solve(from,to,{approaches=3}={}){
 if(!Array.isArray(from)||!Array.isArray(to))return {distance:null,reason:'Enter coordinates for both ports'};
 const {nodes,adjacency}=network();
 const direct=haversine(from,to);
 const starts=nearest(from,approaches),ends=new Map(nearest(to,approaches).map(([d,i])=>[i,d]));
 const dist=new Float64Array(nodes.length).fill(Infinity),previous=new Int32Array(nodes.length).fill(-1);
 const queue=[];
 const push=(d,node)=>{queue.push([d,node]);let i=queue.length-1;
  while(i>0){const parent=(i-1)>>1;if(queue[parent][0]<=queue[i][0])break;[queue[parent],queue[i]]=[queue[i],queue[parent]];i=parent;}};
 const pop=()=>{const top=queue[0],last=queue.pop();
  if(queue.length){queue[0]=last;let i=0;
   for(;;){const l=2*i+1,r=l+1;let small=i;
    if(l<queue.length&&queue[l][0]<queue[small][0])small=l;
    if(r<queue.length&&queue[r][0]<queue[small][0])small=r;
    if(small===i)break;[queue[small],queue[i]]=[queue[i],queue[small]];i=small;}}
  return top;};
 for(const [d,i] of starts){dist[i]=d;push(d,i);}
 const done=new Uint8Array(nodes.length);
 let best=Infinity,bestExit=-1;
 while(queue.length){
  const [d,u]=pop();
  if(done[u])continue;done[u]=1;
  if(d>=best)break;
  if(ends.has(u)&&d+ends.get(u)<best){best=d+ends.get(u);bestExit=u;}
  for(const [v,w] of adjacency[u])if(!done[v]&&d+w<dist[v]){dist[v]=d+w;previous[v]=u;push(dist[v],v);}
 }
 if(bestExit<0)return {distance:null,reason:'No sea route found between these positions'};
 const legs=[];for(let u=bestExit;u>=0;u=previous[u])legs.push(nodes[u]);
 legs.reverse();
 const path=[from,...legs,to];
 // An approach longer than the lanes it joins means the network has nothing near this port.
 const approach=haversine(from,legs[0])+haversine(legs[legs.length-1],to);
 return {distance:best,direct,path,approach,
  detour:direct>0?best/direct:null,
  reliable:approach<=best/4};
}
// Pub. 151 is a sparse table, and only the pairs it prints are used. Its junction figures
// are distances along a route the publication has in mind, so adding two of them invents a
// passage the book never states: Santos to Sao Francisco do Sul came out at 8,937 miles
// through Gibraltar that way. A pair the table omits is left to the routed estimate.
let table=null;
function published(from,to){
 if(!Table||!from||!to)return null;
 if(!table){
  const names=Table.names.split('\n'),index=new Map(names.map((n,i)=>[n,i])),legs=new Map();
  for(let i=0;i<Table.pairs.length;i+=9)legs.set(dec(Table.pairs,i)+':'+dec(Table.pairs,i+3),dec(Table.pairs,i+6));
  table={names,index,legs};
 }
 const a=table.index.get(from),b=table.index.get(to);
 if(a===undefined||b===undefined)return null;
 // A pair may be printed one way only, and the two directions may differ; both are honoured as printed.
 const miles=table.legs.get(a+':'+b)??table.legs.get(b+':'+a);
 return miles===undefined?null:{distance:miles};
}
const api={haversine,route,published,network,coastline,depths,points,NM};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXSeaRoute=api;
})(globalThis);
