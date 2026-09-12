(function(root){
'use strict';
// The voyage map: the route, the coastline under it, the port marks and the distance line.
//
// It is the largest single subject in the planner and it sat mixed in with budget tables and
// dialogs. Here it stands on its own: the projection, the zoom box, the label placement and
// the marks are one subject, and the rest of app.js no longer scrolls past them.
//
// The document is reached for in three places only — the rendered <svg> is measured to fit
// the frame and to convert a pointer position — and it arrives through env, so nothing here
// depends on a global.

function create(env){
 const {M,getState,document,esc,fmt,round,table,ringPath,linePath,Sea}=env;
 const state=getState;

 const portAnchor=name=>{const p=state().portRecords.find(p=>p.name===name&&Number.isFinite(p.lat)&&Number.isFinite(p.lon));return p?[p.lon,p.lat]:null;};
 const legRoute=(fromName,toName,leg,ballast)=>{
  const a=portAnchor(fromName),b=portAnchor(toName);
  return {from:fromName,to:toName,a,b,leg,ballast,
   route:Sea&&a&&b?Sea.route(a,b):null,
   published:Sea?Sea.published(M.portProfileOf(fromName)?.pub151,M.portProfileOf(toName)?.pub151):null};
 };
 function voyageLegs(){
  const calls=M.callsOf(state()),out=[];
  // The approach is measured from the delivery port, so it is routed and drawn like the loaded legs.
  if(state().ballastEnabled&&calls.length)out.push(legRoute(state().ballast.from,calls[0].name,state().ballast,true));
  for(let i=0;i<calls.length-1;i++){
   out.push(legRoute(calls[i].name,calls[i+1].name,state().legs.find(l=>l.from===calls[i].name&&l.to===calls[i+1].name)||null,false));
  }
  return out;
 }
 function syncRouteDistances(){
  if(!Sea)return;
  for(const l of voyageLegs()){
   const leg=l.leg;if(!leg||leg.distanceSource==='entered')continue;
   // A printed distance outranks a routed one; both step aside for a figure the user typed.
   if(l.published){leg.distance=l.published.distance;leg.distanceSource='published';}
   else if(l.route?.reliable&&Number.isFinite(l.route.distance)){leg.distance=round(l.route.distance,0);leg.distanceSource='estimated';}
   else if(leg.distanceSource==='published'||leg.distanceSource==='estimated'){leg.distance=null;leg.distanceSource=null;}
  }
 }
 let coastCache=null,depthCache=null,borderCache=null;
 const coastMarkup=()=>coastCache??=Sea.coastline().map(ringPath).join('');
 const borderMarkup=()=>borderCache??=Sea.borders().map(linePath).join('');
 // Shallow water first, each deeper band painted over it, so the shelf reads lighter than the abyss.
 const depthMarkup=()=>depthCache??=Sea.depths().map(d=>`<g class="sea-depth" data-depth="${d.level}">${d.rings.map(ringPath).join('')}</g>`).join('');
 // A graticule at a step the fitted view can carry: it gives the eye a scale the coastline alone does not.
 function graticule(box){
  const span=Math.max(box[2],box[3]);
  const step=span>120?30:span>60?15:span>24?10:span>10?5:span>4?2:1;
  const lines=[];
  for(let lon=-180;lon<=180;lon+=step)lines.push(`<line x1="${lon}" y1="-90" x2="${lon}" y2="90"/>`);
  for(let lat=-90;lat<=90;lat+=step)lines.push(`<line x1="-180" y1="${lat}" x2="180" y2="${lat}"/>`);
  return `<g class="sea-graticule">${lines.join('')}</g>`;
 }
 // Pan and zoom live outside the voyage: they belong to this browsing session, not to the saved calculation.
 let mapZoom=null;
 const mapKey=box=>box.map(n=>n.toFixed(1)).join(' ');
 function mapView(fitted){
  if(!mapZoom||mapZoom.key!==mapKey(fitted))mapZoom={key:mapKey(fitted),fitted:fitted.slice(),box:fitted.slice()};
  return mapZoom.box;
 }
 // Zooming out stops where the world itself fills the frame. Past that the drawing would
 // shrink into the middle of an empty box, which is not a smaller map but a lost one.
 function clampView(fitted,box){
  let [x,y,w,h]=box;
  const ratio=w/h,min=Math.min(fitted[2],fitted[3])/60;
  const maxW=Math.min(360,180*ratio);
  w=Math.min(Math.max(w,min*ratio),maxW);h=w/ratio;
  // Inside the world the view is free; once it spans the world it is centred on it.
  x=w>=360?-w/2:Math.min(Math.max(x,-180),180-w);
  y=h>=180?-h/2:Math.min(Math.max(y,-90),90-h);
  return [x,y,w,h];
 }
 // preserveAspectRatio letterboxes whatever the box and the frame disagree about, and the
 // frame's shape is only known once the page has laid out. The box is widened or heightened
 // to match it, which reveals more ocean and never hides the voyage.
 function fitMapFrame(){
  const svg=document.querySelector?.('.voyage-map svg');
  if(!svg?.getBoundingClientRect||!mapZoom)return;
  const rect=svg.getBoundingClientRect();
  if(!rect.width||!rect.height)return;
  const frame=rect.width/rect.height,[x,y,w,h]=mapZoom.box;
  if(Math.abs(frame-w/h)>.01){
   const nw=frame>w/h?h*frame:w,nh=frame>w/h?h:w/frame;
   mapZoom.box=clampView(mapZoom.fitted,[x-(nw-w)/2,y-(nh-h)/2,nw,nh]);
  }
  paintMapView();
 }
 function zoomMap(factor,at){
  if(!mapZoom)return;
  const [x,y,w,h]=mapZoom.box;
  const cx=at?at.x:x+w/2,cy=at?at.y:y+h/2;
  mapZoom.box=clampView(mapZoom.fitted,[cx-(cx-x)*factor,cy-(cy-y)*factor,w*factor,h*factor]);
  paintMapView();
 }
 function panMap(dx,dy){
  if(!mapZoom)return;
  const [x,y,w,h]=mapZoom.box;
  mapZoom.box=clampView(mapZoom.fitted,[x-dx,y-dy,w,h]);
  paintMapView();
 }
 function resetMap(){if(mapZoom){mapZoom.box=mapZoom.fitted.slice();fitMapFrame();}}
 // Screen pixels mean nothing to a viewBox in degrees; the element's own matrix does the conversion.
 function mapPoint(svg,event){
  const ctm=svg.getScreenCTM();
  if(!ctm)return null;
  const p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;
  return p.matrixTransform(ctm.inverse());
 }
 function paintMapView(){
  const svg=document.querySelector?.('.voyage-map svg');
  if(!svg||!mapZoom)return;
  svg.setAttribute('viewBox',mapZoom.box.map(n=>n.toFixed(3)).join(' '));
  const width=svg.getBoundingClientRect?.().width;
  if(!width)return;
  const unit=mapZoom.box[2]/width,marks=svg.querySelector?.('.sea-marks'),places=svg.querySelector?.('.sea-places');
  if(marks&&mapZoom.anchors)marks.innerHTML=markMarkup(mapZoom.anchors,mapZoom.box,unit);
  if(places)places.innerHTML=placeMarkup(mapZoom.box,unit);
 }
 // A marker is a fixed number of screen pixels, like the strokes beside it: sizing it as a
 // fraction of the frame made a 44-pixel label on a wide monitor. `unit` is map units per pixel,
 // so every measurement below reads as the pixels it will occupy.
 const LABEL_RANK=[[200,2,2],[90,3,2],[40,4,4],[15,5,5],[0,6,6]];
 function placeMarkup(box,unit){
  const span=Math.max(box[2],box[3]),[,countryRank,seaRank]=LABEL_RANK.find(([from])=>span>from)||LABEL_RANK[LABEL_RANK.length-1];
  const inside=p=>p.lon>=box[0]&&p.lon<=box[0]+box[2]&&-p.lat>=box[1]&&-p.lat<=box[1]+box[3];
  const {countries,seas}=Sea.places();
  // Two names in the same place read as neither, so the more important one keeps the ground.
  const taken=[];
  const draw=(list,rank,cls,size)=>[...list].filter(p=>p.rank<=rank&&inside(p)).sort((a,b)=>a.rank-b.rank)
   .map(p=>{
    const height=unit*size,width=p.name.length*height*(cls==='country-name'?.68:.5),x=p.lon,y=-p.lat;
    if(taken.some(q=>Math.abs(q[0]-x)<(q[2]+width)/2&&Math.abs(q[1]-y)<(q[3]+height)*.7))return '';
    taken.push([x,y,width,height]);
    return `<text class="${cls}" x="${x.toFixed(3)}" y="${y.toFixed(3)}" font-size="${height.toFixed(3)}">${esc(p.name)}</text>`;
   }).join('');
  return draw(seas,seaRank,'sea-name',12)+draw(countries,countryRank,'country-name',9);
 }
 const MARK={ring:4.5,dot:1.6,label:11,gap:8,line:13,crowd:130};
 function markMarkup(anchors,box,unit){
  const middle=box[0]+box[2]/2,placed=[];
  return anchors.map(([name,p])=>{
   const east=p[0]>middle,gap=unit*MARK.gap*(east?-1:1);
   let y=-p[1]+unit*MARK.label*.35;
   while(placed.some(q=>Math.abs(q[1]-y)<unit*MARK.line&&Math.abs(q[0]-p[0])<unit*MARK.crowd))y+=unit*MARK.line;
   placed.push([p[0],y]);
   const x=p[0].toFixed(3),cy=(-p[1]).toFixed(3);
   return `<g class="sea-port"><circle class="sea-port-ring" cx="${x}" cy="${cy}" r="${(unit*MARK.ring).toFixed(3)}"/><circle class="sea-port-dot" cx="${x}" cy="${cy}" r="${(unit*MARK.dot).toFixed(3)}"/><text x="${(p[0]+gap).toFixed(3)}" y="${y.toFixed(3)}" text-anchor="${east?'end':'start'}" font-size="${(unit*MARK.label).toFixed(3)}">${esc(name)}</text></g>`;
  }).join('');
 }
 // Before the page has laid out there is no width to measure; the first draw assumes a common
 // one and paintMapView corrects it as soon as the real frame is known.
 const mapUnit=box=>box[2]/(document.querySelector?.('.voyage-map svg')?.getBoundingClientRect?.().width||1100);
 function voyageMap(){
  if(!Sea)return '';
  const legs=voyageLegs(),drawn=legs.filter(l=>l.route?.path);
  const names=[...new Set([...legs.filter(l=>l.ballast).map(l=>l.from),...M.callsOf(state()).map(c=>c.name)])];
  const anchors=names.map(name=>[name,portAnchor(name)]).filter(([,p])=>p);
  if(!anchors.length)return '<div class="voyage-map-empty"><p class="muted">The route is drawn once the voyage calls have coordinates. Enter them in PORT.</p></div>';
  const all=[...anchors.map(([,p])=>p),...drawn.flatMap(l=>l.route.path)];
  let minLon=Math.min(...all.map(p=>p[0])),maxLon=Math.max(...all.map(p=>p[0]));
  let minLat=Math.min(...all.map(p=>p[1])),maxLat=Math.max(...all.map(p=>p[1]));
  const padLon=Math.max((maxLon-minLon)*.12,4),padLat=Math.max((maxLat-minLat)*.12,4);
  minLon-=padLon;maxLon+=padLon;minLat-=padLat;maxLat+=padLat;
  const width=maxLon-minLon,height=maxLat-minLat;
  // y grows south, so latitude is negated; nothing else about the projection is needed at this scale.
  const fitted=[minLon,-maxLat,width,height];
  const box=mapView(fitted);
  mapZoom.anchors=anchors;
  const coast=coastMarkup();
  const tracks=drawn.map(l=>{
   const points=l.route.path.map(p=>p[0].toFixed(2)+','+(-p[1]).toFixed(2)).join(' ');
   const kind=(l.route.reliable?'':' sea-track-doubtful')+(l.ballast?' sea-track-ballast':'');
   return `<polyline class="sea-glow${kind}" points="${points}"/><polyline class="sea-track${kind}" points="${points}"/>`;
  }).join('');
  const marks=markMarkup(anchors,box,mapUnit(box));
  return `<div class="voyage-map"><div class="map-controls"><button data-action="map-zoom" data-factor="0.7" aria-label="Zoom in">+</button><button data-action="map-zoom" data-factor="1.45" aria-label="Zoom out">−</button><button data-action="map-reset" aria-label="Fit the voyage">Fit</button></div><svg viewBox="${box.map(n=>n.toFixed(3)).join(' ')}" role="img" aria-label="Voyage route map" preserveAspectRatio="xMidYMid meet">${depthMarkup()}${graticule(fitted)}<g class="sea-land">${coast}</g><g class="sea-borders">${borderMarkup()}</g><g class="sea-places">${placeMarkup(box,mapUnit(box))}</g>${tracks}<g class="sea-marks">${marks}</g></svg></div>`;
 }
 function voyageDistanceLine(){
  if(!Sea)return '';
  const legs=voyageLegs().filter(l=>l.leg);
  if(!legs.length)return '';
  const rows=legs.map(l=>{
   const source=l.leg.distanceSource==='entered'?'Entered'
    :l.leg.distanceSource==='published'?'NGA Pub. 151, published'
    :l.leg.distanceSource==='estimated'?'Estimated over the lane network'
    :l.route&&!l.route.reliable?'Coastal leg · no lane near these ports and no printed pair; enter it from a distance table'
    :l.ballast&&!String(state().deliveryPort||'').trim()?'Ballast approach · enter the delivery port to measure it'
    :l.ballast&&!l.a?'Delivery port is not a registered port with a position; add it in PORT or enter the distance'
    :'No route · check the port positions in PORT';
   return `<tr><td class="name">${esc(l.from)} → ${esc(l.to)}</td><td>${M.ok(l.leg.distance,true)?fmt(l.leg.distance,0):'—'}</td><td>${l.published?fmt(l.published.distance,0):'—'}</td><td>${l.route?.distance?fmt(l.route.distance,0):'—'}</td><td>${esc(source)}</td></tr>`;});
  return table(['Leg','In the calculation, nm','Pub. 151, nm','Estimate, nm','Source'],rows,'sea-distances');
 }
 return {voyageLegs,syncRouteDistances,fitMapFrame,zoomMap,panMap,resetMap,mapPoint,paintMapView,voyageMap,voyageDistanceLine};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXVoyageMap=api;
})(globalThis);
