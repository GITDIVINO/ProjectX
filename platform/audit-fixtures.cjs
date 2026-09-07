const fs=require('node:fs'),M=require('./model');
let seed=5719;const next=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const val=(low,high)=>Math.round((low+(high-low)*next())*1000)/1000,fixtures=[];
for(let i=0;i<240;i++){
 const s=M.demo();
 s.lots[0].quantity=val(1000,20000);s.lots[1].quantity=val(500,8000);
 if(i%2)s.lots[1].loadPort='Murmansk';
 if(i>=120){
  const destinations=['Santos','Paranaguá','Itaqui','Vitoria','Suape','Pecem'];
  s.lots=destinations.map((port,j)=>({...s.lots[0],id:'S'+(j+1),saleId:'TEST-'+j,quantity:val(100,6000),sf:val(.5,1.5),loadPort:['Ust-Luga','Murmansk','St. Petersburg'][j%3],port}));
  s.allocation=i%2?'tonnage':'route';
 }
 M.syncRoute(s);
 if(i>=120){M.moveCall(s,'Pecem',-1);if(i%3===0)M.moveCall(s,'Murmansk',-1);}
 const fillLeg=l=>Object.assign(l,{distance:val(10,9000),speed:val(8,14),burn:val(10,25),ecaBurn:val(10,25),aux:val(.1,3),margin:val(0,15)});
 s.legs.forEach(l=>{fillLeg(l);l.eca=Math.round(l.distance*next()*1000)/1000;});
 if(i>=120&&i%3!==0){s.ballastEnabled=true;fillLeg(s.ballast);s.ballast.eca=Math.round(s.ballast.distance*next()*1000)/1000;}
 s.ports.forEach((p,j)=>{
  Object.assign(p,{rate:val(1000,15000),turn:val(0,48),extra:val(0,80),da:val(1000,90000),working:val(0,5),idle:val(0,4),auxWorking:val(.1,4),auxIdle:val(.1,3),boiler:1,boilerDays:0,fuel:j%2?'main':'eca'});
  if(i>=120){
   const work=s.lots.filter(l=>l.loadPort===p.name||l.port===p.name).reduce((n,l)=>n+l.quantity,0)/p.rate;
   if(j%2===0){p.terms='manual';p.calendar=Math.ceil(work)+val(1,4);}
   p.boilerDays=.01;p.boiler=val(.1,2);p.boilerFuel=['main','eca','aux'][j%3];
  }
 });
 s.hire=val(5000,25000);s.prices={main:val(400,800),eca:val(700,1000),aux:val(700,1000)};
 s.freight=i>=120&&i%7===0?null:val(20,100);s.commission=val(0,10);s.extraIncome=val(0,2000);
 s.costs=[{name:'misc',amount:val(0,30000),days:val(0,3),burn:val(0,3),fuel:i%2?'main':'eca'}];
 s.allocations=M.allocate(s);fixtures.push({input:s,result:M.compute(s)});
}
fs.writeFileSync(process.argv[2],JSON.stringify(fixtures));
