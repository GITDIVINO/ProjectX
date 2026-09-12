'use strict';const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),M=require('./model'),P=require('./planning');
// Boot smoke test with a minimal document sink, not a browser or visual test.
test('PLANNER displays SF as text and preserves stored cargo properties',()=>{
 const s=M.demo();s.lots[0].sf=0.98765;
 const {app,elements}=boot(JSON.stringify(s));const html=elements.get('app').innerHTML;
 assert.match(html,/<td>0\.99<\/td>/,'the register column is uniform to two decimals');
 assert.ok(!html.includes('data-path="lots.0.sf"'));assert.ok(html.includes('data-path="lots.0.selected"'));
 assert.equal(app.getState().lots[0].sf,0.98765);
 elements.get('tab-cargo').onclick();assert.match(elements.get('app').innerHTML,/data-path="cargoTypes\.\d+\.sf"/);
});
test('PLANNER empty sales placeholder appears only with no added sales',()=>{
 const blank=boot(null).elements.get('app').innerHTML;
 assert.ok(blank.includes('empty-state planner-empty'));assert.ok(blank.includes('No sales in voyage yet'));
 assert.ok(!blank.includes('<th scope="col">Sale / cargo</th>'));
 const saved=M.demo();assert.ok(!boot(JSON.stringify(saved)).elements.get('app').innerHTML.includes('planner-empty'));
 saved.lots.forEach(l=>l.selected=false);
 assert.ok(!boot(JSON.stringify(saved)).elements.get('app').innerHTML.includes('planner-empty'));
});
test('MARKET restores as a read-only archive and does not change the saved voyage',()=>{
 const saved=M.demo();const {app,elements}=boot(JSON.stringify(saved),'market');
 const before=JSON.stringify(app.getState());
 const html=elements.get('app').innerHTML;
 assert.ok(html.includes('2 September 2026'));assert.ok(html.includes('not a live market feed'));
 assert.ok(html.includes('US Gulf'));assert.ok(html.includes('IFCHOR GALBRAITHS'));
 elements.get('tab-planner').onclick();elements.get('tab-market').onclick();
 assert.equal(JSON.stringify(app.getState()),before);
 assert.equal(elements.get('planner-actions').hidden,true);
});
function boot(saved,savedTab=null){const elements=new Map(),tabWrites=[];
 // A real key-value store, not one value for every key: the storage layer keeps the catalogs,
 // the sales and each calculation under keys of their own, and seeds from the prototype's key.
 const written=new Map(saved?[['projectx-current-v2',saved]]:[]);
 const store={getItem:k=>written.has(k)?written.get(k):null,setItem:(k,v)=>{written.set(k,String(v));},removeItem:k=>{written.delete(k);}};const document={getElementById:id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',addEventListener(){},setAttribute(name,value){this[name]=value;}});return elements.get(id);},querySelectorAll:()=>[]};const context={window:{ProjectXModel:M,ProjectXPlanning:require('./planning'),ProjectXPlannerUI:require('./planner-ui'),ProjectXMarket:require('./market'),ProjectXGuide:require('./guide'),ProjectXSeaRoute:require('./sea-route'),ProjectXSchema:require('./schema'),ProjectXStorage:require('./storage'),ProjectXStorageLocal:require('./storage-local'),ProjectXStorageSupabase:require('./storage-supabase'),ProjectXSession:require('./session'),ProjectXFormat:require('./ui-format'),ProjectXCatalogViews:require('./catalog-views'),ProjectXVoyageMap:require('./voyage-map'),ProjectXDialogs:require('./dialogs'),ProjectXSignIn:require('./sign-in'),ProjectXPlannerView:require('./planner-view')},document,localStorage:store,sessionStorage:{getItem:()=>savedTab,setItem:(key,value)=>tabWrites.push([key,value])},console,Blob,URL,setTimeout};vm.runInNewContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);return {app:context.window.ProjectXApp,elements,tabWrites,store:written};}
test('Allocate by volume applies the plan itself, with no preview dialog',()=>{
 const s=M.demo();P.ensure(s);let renders=0;
 const ui=require('./planner-ui').create({M,P,getState:()=>s,changed:()=>renders++});
 const before=JSON.stringify(s.allocations);
 assert.equal(ui.action('allocate'),true,'the action is handled');
 assert.notEqual(JSON.stringify(s.allocations),before,'the button applies the solved plan on its own');
 assert.ok(s.planning.undo,'and leaves a restorable copy for Undo');
 assert.equal(renders,1,'the section is redrawn once');
 assert.ok(!fs.readFileSync(__dirname+'/planner-ui.js','utf8').includes('Preview complete allocation'),'no preview dialog is built');
});
test('The berth is chosen in SALE, and the rotation no longer opens a berth dialog',()=>{
 const s=M.demo();P.ensure(s);
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 for(const gone of ['data-action="call-source"','Berth / states'])assert.ok(!html.includes(gone),gone+' is still in the rotation');
 const {elements}=boot(JSON.stringify(s));elements.get('tab-sale').onclick();
 const sale=elements.get('app').innerHTML;
 assert.ok(sale.includes('data-path="sales.0.loadPortId"'),'the load berth is chosen in the SALE register');
 assert.ok(sale.includes('data-path="sales.0.dischargePortId"'),'so is the discharge berth');
});
test('Cargo tonnage is printed the same way everywhere it appears',()=>{
 const s=M.demo();P.ensure(s);
 const {elements}=boot(JSON.stringify(s));
 const planner=elements.get('app').innerHTML;
 assert.ok(planner.includes('<td>24,000.0</td>'),'the sale row in PLANNER carries one decimal');
 assert.match(planner,/<td data-unassigned="S1">0\.0<\/td>/,'so does the unassigned column');
 assert.ok(planner.includes('<td>30,000.0</td>'),'and the printed state table, where the same tonnage is repeated');
 elements.get('tab-sale').onclick();
 const sale=elements.get('app').innerHTML;
 assert.match(sale,/data-path="sales.0.quantity" type="text" inputmode="decimal" data-format="tonnage" value="24,000.0"/,'the SALE register prints the same format in its editable field');
});
test('Values stand in the middle of their column, and the first column reads from the left',()=>{
 const css=fs.readFileSync(__dirname+'/styles.css','utf8');
 assert.match(css,/\btd\{[^}]*text-align:center/,'the cell rule centres values');
 assert.match(css,/td:first-child\{text-align:left\}/,'the first column of every table is the exception');
 assert.match(css,/td input,td input\[type=number\],td select\{text-align:center\}/,'a field follows its column, outranking the number input rule');
 assert.ok(!/(?:^|[,}])[^,{}]*td:nth-child\([^)]*\)[^{]*\{[^}]*text-align:(left|right)/m.test(css),'no column is pinned aside any more');
 // The sale and its cargo name in section 1 are read from the left, beside the first column.
 assert.match(css,/\.voyage-sales-table td\.name\{text-align:left\}/);
 // Wrapped prose is read rather than compared, so it keeps its left edge.
 assert.match(css,/\.state-check-text,\.snapshot-data\{text-align:left\}/);
 assert.match(css,/\.loading-pattern-text\{[^}]*text-align:left/);
 // Fields outside a table are not a column and keep their own alignment.
 assert.match(css,/input\[type=number\]\{width:104px;text-align:right\}/);
});
test('Every table heads its columns the same way: centred, with the unit after a comma',()=>{
 const {elements}=boot(JSON.stringify(M.demo()));
 const css=fs.readFileSync(__dirname+'/styles.css','utf8');
 assert.match(css,/thead th,thead th:first-child\{text-align:center/,'one rule centres every header');
 assert.ok(!/[^d]th:nth-child\([^)]*\)[^{]*\{[^}]*text-align:(left|right)/.test(css),'and nothing left- or right-aligns a header again');
 for(const tab of ['planner','sale','cargo','ports','vessel']){
  if(tab!=='planner')elements.get('tab-'+tab).onclick();
  const html=elements.get('app').innerHTML;
  for(const head of html.match(/<th[^>]*>.*?<\/th>/g)||[])assert.ok(!head.includes('<small>'),tab+': a unit is still set below the name — '+head);
 }
 elements.get('tab-planner').onclick();
 const html=elements.get('app').innerHTML;
 for(const head of ['Total, NM','Of which ECA, NM','Speed, kn','Weather, % time','Aux, t/day','Cargo, MT','Handling rate, t/day','Turn time, h','DA, USD','Quantity, MT','SF, m³/t'])
  assert.ok(html.includes('<th scope="col">'+head+'</th>'),head+' is not headed that way');
});
test('Section 4 draws the voyage and proposes a distance for every leg',()=>{
 const s=M.demo();P.ensure(s);
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(html.includes('class="voyage-map"'),'the map is drawn');
 assert.equal((html.match(/class="sea-track/g)||[]).length,2,'one track per leg of the demo rotation');
 assert.ok(html.includes('sea-track-doubtful'),'the coastal leg is drawn differently');
 assert.ok(html.indexOf('class="voyage-map"')<html.indexOf('id="voyage-legs"'),'the map sits above the legs it measures');
 assert.ok(html.includes('sea-distances'),'the distances are listed with their source');
 assert.ok(html.includes('>Entered<'),'a distance already in the file keeps governing');
 assert.ok(!html.includes('A leg takes the distance')&&!html.includes('Neither is a passage plan'),'the explanatory paragraph below the distance table is removed');
 assert.ok(html.includes('data-action="map-zoom"')&&html.includes('data-action="map-reset"'),'the map can be scaled without a wheel');
 assert.match(html,/<svg viewBox="[-\d. ]+" role="img" aria-label="Voyage route map"/,'the view is a plain viewBox, so zoom is just a box change');
 assert.equal((html.match(/<g class="sea-land">/g)||[]).length,1,'the coastline is one layer');
 assert.equal((html.match(/class="sea-depth"/g)||[]).length,3,'three depth bands sit under it');
 assert.ok(html.includes('class="sea-graticule"'),'and a graticule gives the eye a scale');
 assert.ok(html.includes('class="sea-borders"'),'country borders are drawn');
 assert.match(html,/<text class="country-name"/,'and country names');
 assert.match(html,/<text class="sea-name"/,'and the names of the seas crossed');
 assert.ok(html.includes('>North Atlantic Ocean<'),'the ocean this voyage crosses is named');
 const blank=boot(null).elements.get('app').innerHTML;
 assert.ok(!blank.includes('class="sea-track'),'an empty voyage draws no track');
});
test('A printed distance is taken over the estimate, and an unprinted pair falls back to it',()=>{
 const s=M.demo();P.ensure(s);
 for(const leg of s.legs){leg.distance=null;leg.distanceSource=null;}
 const {app,elements}=boot(JSON.stringify(s));
 const legs=app.getState().legs;
 // Ust-Luga is not in Pub. 151, so this ocean leg can only be estimated.
 const ocean=legs.find(l=>l.from==='Ust-Luga'&&l.to==='Santos');
 assert.equal(ocean.distanceSource,'estimated','the unprinted ocean leg is filled by the estimate');
 assert.ok(Math.abs(ocean.distance-6818)<5,'and carries the routed figure: '+ocean.distance);
 // Santos to Paranagua is printed, and the publication governs even though the estimate exists.
 const coastal=legs.find(l=>l.from==='Santos');
 assert.equal(coastal.distanceSource,'published','the printed pair is taken from Pub. 151');
 assert.equal(coastal.distance,163,'exactly as printed, not as routed');
 const html=elements.get('app').innerHTML;
 assert.ok(html.includes('NGA Pub. 151, published'),'and the table names the publication');
 assert.ok(html.includes('Estimated over the lane network'),'while the other leg is named an estimate');
});
test('A pair in neither source is left empty rather than guessed',()=>{
 const s=M.demo();P.ensure(s);
 for(const leg of s.legs){leg.distance=null;leg.distanceSource=null;}
 // Two coastal ports the publication does not print and the lane network cannot see.
 s.sales.forEach(sale=>{if(sale.dischargePort==='Santos')sale.dischargePort='Suape';});
 M.syncSalesToLots(s);
 const {app,elements}=boot(JSON.stringify(s));
 const coastal=app.getState().legs.find(l=>l.from==='Suape');
 if(coastal){
  assert.equal(coastal.distance,null,'no figure is invented');
  assert.ok(elements.get('app').innerHTML.includes('Coastal leg'),'and the table says why');
 }
});
test('The ballast approach carries an editable delivery port',()=>{
 const off=M.demo();P.ensure(off);
 const closed=boot(JSON.stringify(off)).elements.get('app').innerHTML;
 assert.ok(!closed.includes('data-path="deliveryPort"'),'no field while the approach is not included');
 const s=M.demo();P.ensure(s);s.ballastEnabled=true;
 const {app,elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 assert.ok(html.includes('class="ballast-line"'),'the field stands beside the checkbox that opens the leg');
 assert.match(html,/Delivery port<input aria-label="Delivery port" data-path="deliveryPort" type="text"\s+value="" placeholder="Vessel position"/,'an empty, labelled text field, not a number box');
 assert.ok(html.indexOf('data-path="deliveryPort"')<html.indexOf('data-path="ballast.distance"'),'and above the leg it starts');
 assert.ok(html.includes('>Vessel position \u2192 Ust-Luga<'),'an empty field leaves the leg named a position');
 const entered=M.demo();P.ensure(entered);entered.ballastEnabled=true;entered.deliveryPort='Rotterdam';
 const named=boot(JSON.stringify(entered));
 assert.equal(named.app.getState().ballast.from,'Rotterdam','the saved port names the leg on load');
 assert.ok(named.elements.get('app').innerHTML.includes('>Rotterdam \u2192 Ust-Luga<'),'and the legs table prints it');
 assert.equal(app.getState().deliveryPort,'','an unentered port is stored as empty text, not as the placeholder');
});
test('A delivery port in PORT routes, draws and measures the ballast approach',()=>{
 const s=M.demo();P.ensure(s);s.ballastEnabled=true;s.deliveryPort='Murmansk';
 Object.assign(s.ballast,{eca:0,aux:0});// the approach still needs its own ECA and Aux before a budget exists
 const {app,elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 const ballast=app.getState().ballast;
 assert.equal(ballast.distanceSource,'estimated','the approach takes the routed figure');
 assert.ok(Math.abs(ballast.distance-2340)<60,'around the North Cape and into the Baltic: '+ballast.distance);
 assert.equal((html.match(/class="sea-track/g)||[]).length,3,'the approach is drawn with the two loaded legs');
 assert.equal((html.match(/sea-track-ballast/g)||[]).length,2,'in its own style, glow and track');
 assert.ok(html.includes('>Murmansk<'),'and the delivery port is marked on the map');
 const table=html.slice(html.indexOf('class="sea-distances"'));
 assert.ok(table.indexOf('Murmansk \u2192 Ust-Luga')<table.indexOf('Ust-Luga \u2192 Santos'),'the approach heads the distance table');
 assert.equal(app.getResult().budget.legs[0].distance,ballast.distance,'and the same figure reaches the budget');
});
test('An unregistered delivery port is answered with a reason, never with a distance',()=>{
 const s=M.demo();P.ensure(s);s.ballastEnabled=true;s.deliveryPort='Off Ushant';
 const {app,elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 assert.equal(app.getState().ballast.distance,null,'no figure is invented for a place with no position');
 assert.ok(html.includes('Delivery port is not a registered port with a position'),'the table says what is missing');
 assert.equal((html.match(/class="sea-track/g)||[]).length,2,'and nothing is drawn for it');
 const empty=M.demo();P.ensure(empty);empty.ballastEnabled=true;
 assert.ok(boot(JSON.stringify(empty)).elements.get('app').innerHTML.includes('enter the delivery port to measure it'),'an empty field asks for the port');
});
test('A ballast distance already in the file outranks the estimate',()=>{
 const s=M.demo();P.ensure(s);s.ballastEnabled=true;s.deliveryPort='Murmansk';
 Object.assign(s.ballast,{distance:2400,distanceSource:null});
 const {app,elements}=boot(JSON.stringify(s));
 assert.equal(app.getState().ballast.distance,2400,'the saved figure is kept');
 assert.equal(app.getState().ballast.distanceSource,'entered','and counts as the user own');
 assert.ok(elements.get('app').innerHTML.includes('>Entered<'));
});
test('The legs and ports tables stand on their own, without an explanation or a How calculated',()=>{
 for(const state of [M.initial(),M.demo()]){
  const html=boot(JSON.stringify(state)).elements.get('app').innerHTML;
  for(const gone of ['The ballast leg starts at the entered delivery port','Speeds and consumption come from the selected vessel type','Consumption under the fuel regime for ECA requires confirmation','id="calc-legs"','Days = distance / (speed × 24)',
   'For SHEX/SSHEX enter the calendar handling period','not a contractual calculation of laytime','id="calc-ports"','Work days = handled tonnes / handling rate'])
   assert.ok(!html.includes(gone),gone+' is still printed under the tables');
  assert.ok(html.includes('<details id="portfuel">'),'the port fuel block is not what was removed');
 }
 const {app,elements}=boot(JSON.stringify(M.demo())),html=elements.get('app').innerHTML;
 assert.ok(html.includes('id="voyage-legs"')&&html.includes('data-path="legs.0.distance"'),'the table itself is untouched');
 assert.ok(app.getResult().budget.trace.legs.length>0&&app.getResult().budget.trace.ports.length>0,'and the evidence stays in the result the audit reads');
});
test('A leg and a call state their days before the rest of the voyage is complete',()=>{
 // Time is the row's own arithmetic; a missing hire rate or DA says nothing about it.
 const s=M.demo();P.ensure(s);s.hire=null;s.prices={main:null,eca:null,aux:null};s.ports[1].da=null;
 const {app,elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 assert.equal(app.getResult().budget,null,'the budget is still refused');
 const legs=html.slice(html.indexOf('id="voyage-legs"'),html.indexOf('id="voyage-ports"'));
 assert.ok(legs.includes('<td>25.200</td>'),'7,200 nm at 12.5 kn with 5 % weather is 25.200 days');
 const ports=html.slice(html.indexOf('id="voyage-ports"'));
 assert.ok(ports.includes('<td>3.750</td>'),'and the call with no DA still states its own time');
 // An incomplete row of its own says nothing rather than guessing.
 const partial=M.demo();P.ensure(partial);partial.legs[0].speed=null;partial.ports[0].rate=null;
 const empty=boot(JSON.stringify(partial)).elements.get('app').innerHTML;
 const emptyLegs=empty.slice(empty.indexOf('id="voyage-legs"'),empty.indexOf('id="voyage-ports"'));
 assert.ok(emptyLegs.includes('<td>—</td>'),'a leg with no speed has no time');
 assert.equal(M.legDays(partial.legs[0]),null);assert.equal(M.portDays(partial,partial.ports[0]),null);
 // The figure a complete voyage prints is the same one the budget carries.
 const full=M.demo();const b=M.compute(full).budget;
 assert.equal(M.legDays(full.legs[0]),b.legs[0].days,'one arithmetic, not two');
 assert.equal(M.portDays(full,full.ports[0]),b.ports[0].days);
});
test('Section 4 opens with a chain whose parts add up to the result it states',()=>{
 const s=M.demo();P.ensure(s);
 const {app,elements}=boot(JSON.stringify(s));
 const html=elements.get('app').innerHTML,b=app.getResult().budget;
 assert.ok(html.includes('class="voyage-chain"'),'the chain is the first thing in section 4');
 assert.ok(html.indexOf('voyage-chain')<html.indexOf('id="voyage-legs"'),'it stands above the tables it summarises');
 for(const name of ['Voyage time','Model cost','Cost per tonne','Net revenue','Result after hire','TCE before hire','Freight to cover cost'])
  assert.ok(html.includes('>'+name+'<'),name+' is missing from the chain');
 // Every part printed beside a result must be the result: the chain may not merely look like arithmetic.
 const kind=k=>b.rows.filter(r=>r.kind===k).reduce((n,r)=>n+r.cents,0);
 assert.equal(kind('hire')+kind('fuel')+kind('ports')+kind('other'),Math.round(b.total*100),'the cost parts are the whole cost');
 assert.equal(Math.round(b.sea*100)+Math.round(b.work*100)+Math.round(b.idle*100),Math.round(b.days*100),'the time parts are the whole voyage');
 assert.ok(Math.abs(b.net-b.pnl-b.total)<0.005,'the result is net revenue less the model cost');
 assert.ok(Math.abs(b.tce*b.days-(b.net-(b.total-b.hire)))<0.01,'TCE before hire is that result per day, hire aside');
});
test('Section 4 hides routine prompts without accepting an incomplete voyage',()=>{
 const incomplete=M.demo();incomplete.hire=null;
 for(const s of [M.initial(),incomplete,M.demo()]){
  const {app,elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
  for(const gone of ['The chain appears once','Complete the following','Vessel cost model · recalculated','id="missing"','<li>Hire rate</li>'])assert.ok(!html.includes(gone),gone);
  assert.ok(html.includes('data-path="hire"'),'the hire input remains editable');
  if(s.hire===null){assert.equal(app.getResult().budget,null);assert.ok(!html.includes('class="voyage-chain"'));}
 }
 const result=boot(JSON.stringify(incomplete)).app.getResult();
 assert.ok(result.errors.includes('Hire rate'),'validation still identifies the missing input');
});
test('Section 1 ends with its table, and the empty state still points at SALE',()=>{
 const s=M.demo();P.ensure(s);
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 const section=html.slice(html.indexOf('1. Sales in voyage'),html.indexOf('2. Vessel and rotation'));
 assert.ok(!section.includes('Commercial data from SALE'),'the note under the table is gone');
 assert.ok(!section.includes('class="form-note"'),'and no other note took its place');
 assert.ok(section.includes('voyage-sales-table')&&section.includes('data-action="add-lot"'),'the table and the way to add a sale are untouched');
 // An empty planner still says where sales come from, in its own placeholder.
 const blank=boot(null).elements.get('app').innerHTML;
 assert.ok(blank.includes('Add a sale from SALE to start planning this voyage.'),'the empty state keeps that sentence');
});
test('Section 4 is a stack of folds, each carrying its own result on the summary line',()=>{
 const s=M.demo();P.ensure(s);s.ballastEnabled=true;s.deliveryPort='Murmansk';Object.assign(s.ballast,{eca:0,aux:0});
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 const folds=[...html.matchAll(/<details id="(voyage-[a-z]+)" class="fold"><summary><strong>([^<]*)<\/strong><span>(.*?)<\/span>/g)].map(m=>[m[1],m[2],m[3]]);
 assert.deepEqual(folds.map(f=>f[0]),['voyage-distances','voyage-legs','voyage-ports','voyage-money'],'four blocks, in the order they are worked');
 assert.deepEqual(folds.map(f=>f[1]),['Distances','Legs','Ports','Hire, bunkers and freight']);
 assert.match(folds[1][2],/3 legs · [\d,]+ NM · <strong>[\d.]+ days at sea<\/strong>/,'the legs line counts the ballast approach with them');
 assert.match(folds[2][2],/3 calls · DA [\d,]+ USD · <strong>[\d.]+ days in port<\/strong>/);
 assert.match(folds[3][2],/Hire 13,500 USD\/day · Main fuel 540 USD\/t · Freight 50.00 USD\/t/);
 // The working fields are inside their own fold, not loose in the section.
 for(const [id,marker] of [['voyage-legs','data-path="legs.0.distance"'],['voyage-ports','data-path="ports.0.rate"'],['voyage-money','data-path="hire"']]){
  const start=html.indexOf('id="'+id+'"'),end=html.indexOf('</details>',html.indexOf('fold-body',start));
  assert.ok(html.indexOf(marker)>start&&html.indexOf(marker)<end,marker+' is not inside '+id);
 }
 // An incomplete voyage still states what each block knows rather than nothing.
 const partial=M.demo();P.ensure(partial);partial.hire=null;partial.ports[0].rate=null;
 const rough=boot(JSON.stringify(partial)).elements.get('app').innerHTML;
 const lines=[...rough.matchAll(/<details id="voyage-([a-z]+)" class="fold"><summary><strong>[^<]*<\/strong><span>(.*?)<\/span>/g)].map(m=>[m[1],m[2]]);
 assert.match(lines.find(l=>l[0]==='legs')[1],/days at sea/,'the legs are complete, so their time is stated');
 assert.match(lines.find(l=>l[0]==='ports')[1],/DA [\d,]+ USD · <strong>—<\/strong>/,'one call without a rate makes the total unknown rather than partial');
 assert.match(lines.find(l=>l[0]==='money')[1],/Hire —/,'and the missing hire is named as missing, not as zero');
});
test('Section 5 ends with the allocation itself',()=>{
 const s=M.demo();P.ensure(s);
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 for(const gone of ['Proposed method: leg costs','not the incremental cost of adding a sale','id="calc-allocation"','Calculation sources and notes','data-path="notes"'])
  assert.ok(!html.includes(gone),gone+' is still printed under the allocation');
 assert.ok(html.includes('5. Cost by sale')&&html.includes('Allocation method'),'the section and its table are untouched');
 assert.ok(!fs.readFileSync(__dirname+'/app.js','utf8').includes('allocationCalculation'),'and the builder behind the block is gone, not left unused');
 // Notes already written stay reachable: the sources of a saved calculation are not swallowed.
 const written=M.demo();P.ensure(written);written.notes='Pub. 151 distances checked 10.09.2026';
 const kept=boot(JSON.stringify(written)).elements.get('app').innerHTML;
 assert.ok(kept.includes('Calculation sources and notes')&&kept.includes('Pub. 151 distances checked'),'the note and its editor are still there');
});
test('Additional costs appear with the first item, and nothing is folded around a count of none',()=>{
 const none=M.demo();P.ensure(none);
 const html=boot(JSON.stringify(none)).elements.get('app').innerHTML;
 for(const gone of ['Additional costs and stops (','id="costs"','id="calc-extras"','Canals, additional insurance','Additional total = entered amount'])
  assert.ok(!html.includes(gone),gone+' is still printed for a voyage with no additional items');
 // The way to enter the first one is still there, and it is the whole block.
 assert.match(html,/<button class="inline-action" data-action="add-cost">\+ Add cost or stop<\/button>/);
 assert.ok(!html.includes('data-path="costs.0.name"'),'no empty row is drawn');
 // With an item, the table itself is drawn - the money in the budget is visible and editable.
 const some=M.demo();P.ensure(some);some.costs=[{name:'Kiel Canal',amount:42000,days:.5,burn:2,fuel:'main'}];
 const {app,elements}=boot(JSON.stringify(some)),withItem=elements.get('app').innerHTML;
 assert.ok(withItem.includes('<h3>Additional costs and stops</h3>'),'the heading names what the table is');
 assert.match(withItem,/data-path="costs\.0\.name"[^>]*value="Kiel Canal"/);
 assert.ok(withItem.includes('data-action="remove-cost"')&&withItem.includes('data-action="add-cost"'),'with its own add and remove');
 assert.ok(!withItem.includes('id="calc-extras"'),'and still no How calculated');
 assert.ok(app.getResult().budget.rows.some(r=>r.name.includes('Kiel Canal')),'the item reaches the budget as before');
});
test('The calendar column is only there for a call that is handled on a manual calendar',()=>{
 const shinc=M.demo();P.ensure(shinc);
 const plain=boot(JSON.stringify(shinc)).elements.get('app').innerHTML;
 const ports=plain.slice(plain.indexOf('id="voyage-ports"'),plain.indexOf('id="portfuel"'));
 assert.ok(!ports.includes('Calendar, days'),'nothing is headed for a period no call keeps');
 assert.ok(!ports.includes('.calendar'),'and no field is drawn for it');
 assert.ok(ports.includes('Handling terms')&&ports.includes('Turn time, h'),'the columns beside it are untouched');
 assert.equal((ports.match(/<th scope="col">/g)||[]).length,8,'eight columns, one fewer than before');
 // Choosing the manual calendar brings the field back where it is needed.
 const manual=M.demo();P.ensure(manual);manual.ports[1].terms='manual';manual.ports[1].calendar=6;
 const html=boot(JSON.stringify(manual)).elements.get('app').innerHTML;
 const withCalendar=html.slice(html.indexOf('id="voyage-ports"'),html.indexOf('id="portfuel"'));
 assert.ok(withCalendar.includes('Calendar, days'),'the column is back');
 assert.match(withCalendar,/data-path="ports\.1\.calendar"[^>]*value="6"/,'with the period of that call');
 assert.match(withCalendar,/data-path="ports\.0\.calendar"[^>]*disabled/,'while a call on SHINC keeps its cell closed');
});
test('Section 4 says nothing where the result would be until the voyage is calculated',()=>{
 const s=M.demo();P.ensure(s);s.hire=null;s.ports[1].da=null;s.ports[1].rate=null;
 const {app,elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 assert.equal(app.getResult().budget,null,'the budget is still refused');
 for(const gone of ['chain-missing','Voyage not calculated','Complete the following','id="missing"','class="voyage-chain"'])
  assert.ok(!html.includes(gone),gone+' is still printed in section 4');
 assert.ok(!fs.readFileSync(__dirname+'/styles.css','utf8').includes('.chain-missing'),'and its style is gone with it');
 // What each row can measure on its own is still stated.
 assert.ok(html.includes('<td>25.200</td>'),'the leg still states its days');
 assert.ok(app.getResult().errors.includes('Hire rate'),'validation still identifies the missing input');
});
test('Voyage map folds like Intake Calculator, while distance inputs stay outside',()=>{
 for(const s of [M.initial(),M.demo()]){
  const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
  assert.match(html,/<details id="voyage-map" class="fold"><summary><strong>Voyage map<\/strong><\/summary><div class="fold-body">/);
  const start=html.indexOf('<details id="voyage-map"'),end=html.indexOf('</details>',start);
  assert.ok(end<html.indexOf('id="voyage-legs"'),'the legs fold stands beside the map, not inside it');
  if(s.lots.length){assert.ok(html.indexOf('class="voyage-map"')<end);assert.ok(html.indexOf('class="sea-distances"')>end);}
 }
});
test('The chain says nothing about revenue until a freight rate is entered',()=>{
 const s=M.demo();P.ensure(s);s.freight=null;
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(html.includes('Freight not entered'),'the revenue side is named as unstated');
 for(const gone of ['>Net revenue<','>Result after hire<','>TCE before hire<'])
  assert.ok(!html.includes(gone),gone+' must not appear without a freight rate');
 assert.ok(html.includes('Freight to cover cost'),'the covering rate is still worth knowing');
});
test('App boots with a clean PLANNER and no saved calculation',()=>{const {app,elements}=boot(null);assert.equal(app.getResult().budget,null);assert.equal(app.getState().lots.length,0);assert.equal(app.getState().sales.length,0);assert.ok(elements.get('app').innerHTML.includes('Allocate by volume'));assert.ok(!elements.get('app').innerHTML.includes('SALE-S1'));});
test('Every accepted change is autosaved while manual Save remains available',()=>{
 const source=fs.readFileSync(__dirname+'/app.js','utf8');
 assert.match(source,/function changed\(\).*ensureLegs\(\).*saveCalculation\(false\);render\(\);\}/);
 assert.match(source,/\$\('save'\)\.onclick=\(\)=>saveCalculation\(true\)/);
 assert.match(source,/currentTab!=='planner'/);assert.match(source,/saveCalculation\(false\)/);
});
test('App restores a saved voyage and the active workspace tab',()=>{const saved=M.demo();const {app,elements}=boot(JSON.stringify(saved),'cargo');assert.ok(app.getResult().budget);assert.equal(app.getState().lots.length,2);assert.equal(elements.get('tab-cargo')['aria-selected'],'true');assert.equal(elements.get('planner-actions').hidden,true);assert.ok(elements.get('app').innerHTML.includes('Planning SF, m³/t'));});
test('Corrupt or obsolete saved state falls back to blank',()=>{for(const value of ['{broken',JSON.stringify({version:1}),JSON.stringify({version:2,lots:[{},{}],ports:[{},{},{}]})])assert.equal(boot(value).app.getResult().budget,null);});

test('CARGO retains catalog records while rendering the simplified register',()=>{const {app,elements}=boot(null);elements.get('tab-cargo').onclick();const html=elements.get('app').innerHTML;assert.equal((html.match(/data-catalog-name=/g)||[]).length,25);assert.ok(app.getState().cargoTypes.length>=97);assert.ok(html.includes('Planning SF, m³/t'));assert.ok(html.includes('IMSBC Group'));for(const removed of ['Hold restriction','Properties / source','Apply to parcels','UN number','Transport hazard class','SDS / declaration required','Reference estimate','N/A to this carriage mode','cargo-meta'])assert.ok(!html.includes(removed));});
test('SALE and PORTS tabs render their business registers',()=>{const {elements}=boot(null);elements.get('tab-sale').onclick();assert.ok(elements.get('app').innerHTML.includes('Register of concluded sales'));assert.ok(elements.get('app').innerHTML.includes('Add the first deal'));elements.get('tab-ports').onclick();const ports=elements.get('app').innerHTML;assert.ok(ports.includes('Ust-Luga'));assert.ok(ports.includes('European Sulphur Terminal'));assert.ok(!ports.includes('DA, USD'));assert.match(ports,/<div class="heading"><div><h2>PORT<\/h2><p class="section-intro">Port and berth register with published size limits\.<\/p><\/div>/,'PORT is headed like the other registers');assert.ok(!ports.includes('Charterer port and terminal register'),'not the intro line the user removed earlier');assert.match(ports,/<th scope="col">Country<\/th><th scope="col">Port<\/th><th scope="col">Terminal<\/th><th scope="col">Berth<\/th><th scope="col">Water density, t\/m³<\/th><th scope="col">Max draft, m<\/th><th scope="col">Max beam, m<\/th><th scope="col">Max LOA, m<\/th><th scope="col">Max air draft, m<\/th><th scope="col">Max DWT<\/th>/,'columns follow the source table: draft, beam, LOA');assert.ok(ports.includes('value="Russia"')&&ports.includes('value="Brazil"'));assert.ok(!ports.includes('>Notes<'),'the Notes column is not rendered');assert.ok(!ports.includes('Compared with'),'no comparison line above the register');assert.ok(ports.includes('Berth 13'),'Murmansk berths are separate rows');assert.ok(!ports.includes('limit-exceeded')&&!ports.includes('limit-flag'),'PORT is a register only: breaches are shown in PLANNER');});

test('The DWT limit appears only after Calculate intake and never outlives its inputs',()=>{
 const blank=boot(null).elements.get('app').innerHTML;
 for(const gone of ['Lubricants, t','Slops, t','deductions.lubes','deductions.slops'])assert.ok(!blank.includes(gone),gone+' is still in PLANNER');
 for(const kept of ['Fuel, t','Fresh water, t','Ballast, t','Constant, t','Loss due to draft, t'])assert.ok(blank.includes(kept),kept);
 assert.match(blank,/data-action="calc-intake" disabled/,'no deductions entered yet, so the button is disabled');
 const s=M.demo();
 assert.match(boot(JSON.stringify(s)).elements.get('app').innerHTML,/DWT limit: <strong>—<\/strong><button data-action="calc-intake" >/,'a complete voyage offers the button but shows no figure yet');
 s.intakeShownFor=JSON.stringify([P.INTAKE_METHOD,37667,950,200,300,525,0]);
 const shown=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(shown.includes('− draft loss 0 = <strong>35,692.00 t</strong>'),'the calculated figure is shown');
 assert.ok(shown.includes('Cubics limit: 46,730.00 m³ ÷ mix SF 0.90000 m³/t = <strong>51,922.22 t</strong>'),'the cubic limit is written out on its own line');
 assert.ok(shown.includes('Restricted intake DWT/cubics: min(35,692.00 t, 51,922.22 t) = <strong>35,692.00 t</strong>'),'the combined limit is the minimum, not the cubic branch');
 assert.ok(!shown.includes('calc-intake'),'the button steps aside once the figure is shown');
 s.deductions.fuel=951;
 const stale=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(stale.includes('DWT limit: <strong>—</strong>'),'an edited deduction withdraws the figure');
 assert.ok(stale.includes('calc-intake'),'and brings the button back');
 assert.ok(!blank.includes('does not verify draft'),'the caveat line is replaced by the calculation');
 assert.ok(!blank.includes('− draft loss'),'no calculation before the figure is asked for');
 assert.ok(shown.includes('DWT limit: DWT 37,667 − fuel 950 − fresh water 200 − ballast 300 − constant 525 − draft loss 0 = <strong>35,692.00 t</strong>'),'the result carries its own substitution on one line');
 const restricted=M.demo();restricted.deductions.draftLoss=1200;restricted.intakeShownFor=JSON.stringify([37667,950,200,300,525,1200]);
 const less=boot(JSON.stringify(restricted)).elements.get('app').innerHTML;
 assert.ok(less.includes('DWT limit: <strong>—</strong>'),'old manual draft loss invalidates the displayed intake');assert.match(less,/aria-label="Loss due to draft, t" readonly value="0.0"/);assert.ok(!less.includes('data-action="draft-estimate"'));assert.ok(!less.includes('data-action="intake-basis"'));});

test('Vessel particulars sit on the DWT line and drop bale capacity',()=>{const html=boot(null).elements.get('app').innerHTML;
 // Upper case in the text, not in a style rule, so a copy of the line carries it too.
 assert.match(html,/<span class="muted vessel-summary">33,465 DWT · 5 HOLDS · HDD34 · LOA 180\.0 M · BEAM 30\.0 M · DRAFT 9\.85 M · TPC 50\.7 · GRAIN 45,517 M³<\/span>/);
 const line=html.match(/<span class="muted vessel-summary">([^<]*)</)[1];
 assert.equal(line,line.toUpperCase(),'nothing in the line is left in lower case: '+line);
 assert.ok(!fs.readFileSync(__dirname+'/styles.css','utf8').includes('.vessel-summary{text-transform'),'the case does not depend on a style rule');
 assert.ok(!/Bale/.test(html),'bale capacity is not shown in PLANNER');
 assert.match(html,/<h3>Deductions<\/h3>.*<div class="grid">/,'the block is a permanent heading, not a disclosure');
 assert.ok(!html.includes('id="vessel"'),'nothing left to collapse');});

test('The plates read in upper case, and section 2 lets the vessel name itself',()=>{
 const s=M.demo();P.ensure(s);s.intakeShownFor=JSON.stringify([37667,950,200,300,525,0].map(Number));
 const {elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 // The selector carries the vessel's name, so the caption above it said nothing the list did not.
 assert.ok(!html.includes('class="field">Vessel<select'),'the caption is gone');
 assert.match(html,/<label class="field"><select aria-label="Vessel" data-path="vesselId"/,'the selector and its label for a reader stay');
 // Both plates are upper case in the text itself, so a copy of them carries it.
 const intake=html.match(/<summary><strong>Intake Calculator<\/strong><span>([^<]*)<\/span>/)[1];
 assert.equal(intake,intake.toUpperCase(),'the intake summary: '+intake);
 const onBoard=html.match(/<span data-stage-total>([^<]*)<\/span>/)[1];
 assert.equal(onBoard,onBoard.toUpperCase(),'the cargo on board: '+onBoard);
 assert.match(onBoard,/T ON BOARD$/);
 // The scope note under the stowage section is gone with them.
 for(const gone of ['Trim, stability, hull strength and ballast compensation','Intermediate loading/unloading steps are not modelled','loading-pattern-scope'])
  assert.ok(!html.includes(gone),gone+' is still printed under section 3');
});
test('The intake calculator states its limits and nothing else',()=>{
 const s=M.demo();P.ensure(s);s.intakeShownFor=null;
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 const block=html.slice(html.indexOf('<details id="intake-calculator"'),html.indexOf('rotation-grid'));
 for(const gone of ['Cargo volume:','class="cargo-volume"','Average-vessel estimate','Hold allocation and nominated-vessel checks remain separate'])
  assert.ok(!block.includes(gone),gone+' is still printed in the calculator');
 assert.ok(!fs.readFileSync(__dirname+'/app.js','utf8').includes('cargoVolumeLine'),'the builder behind the line is gone, not left unused');
 // What the block is for stays: the deductions, the holds, the draft loss and the limits themselves.
 for(const kept of ['data-path="deductions.fuel"','data-path="holds.0.volume"','draft-formula','grain-capacity','DWT limit:'])
  assert.ok(block.includes(kept),kept+' left the calculator');
 // The mix SF the removed line showed is still stated where the cubic limit is worked out.
 const calculated=M.demo();P.ensure(calculated);
 const {app,elements}=boot(JSON.stringify(calculated));
 elements.get('app').innerHTML.includes('Cubics limit');
 assert.ok(M.cargoVolume(app.getState()).volume>0,'and the model still measures the cargo volume for it');
});
test('The draft loss calculation is printed and the field is not editable',()=>{
 const plain=M.demo();M.applyVessel(plain,'tbn-3');
 const html=boot(JSON.stringify(plain)).elements.get('app').innerHTML;
 assert.ok(html.includes('Draft loss: Santos 11.3 m · draft 12.8 × 1.025 ÷ ρ 1.015 = 12.926 m'),'the density conversion is shown');
 assert.ok(html.includes('× TPC 58.8 × 1.015 ÷ 1.025 = 9,468.2 t'),'the arithmetic is shown, not only the result');
 const formula=html.slice(html.indexOf('<small class="draft-formula"'),html.indexOf('</small>',html.indexOf('<small class="draft-formula"')));
 assert.ok(!formula.includes('Ust-Luga'),'only the binding call is printed; the calls that do not bind are left out');
 assert.match(html,/aria-label="Loss due to draft, t" readonly/,'the platform owns this figure');
 assert.ok(!html.includes('data-path="deductions.draftLoss"'),'no input path, so it cannot be typed into');
 const clear=M.demo();M.applyVessel(clear,'tbn-1');
 assert.ok(boot(JSON.stringify(clear)).elements.get('app').innerHTML.includes('max(0, 9.947 − 11.3)'),'a voyage with room states the zero-loss formula');
 const corrected=M.demo();M.applyVessel(corrected,'tbn-3');P.ensure(corrected);
 corrected.planning.vesselBasis={vesselKey:JSON.stringify(M.vesselOf(corrected)),kind:'reference',source:'P',date:'2026-09-08',dwtBasis:'Summer SW',density:1.025,lightship:10800,tpcRangeCm:200,tpcSource:'Hydro'};
 const dense=boot(JSON.stringify(corrected)).elements.get('app').innerHTML;
 assert.ok(dense.includes('× TPC 58.8 × 1.015 ÷ 1.025 = 9,468.2 t'),'saved lightship does not change the agreed average-vessel model');
 assert.ok(!dense.includes('FWA '));
});

test('Every call gets a departure and an arrival draft calculated from its own loading',()=>{
 const s=M.demo();P.ensure(s);
 for(const c of s.ports){const b=s.portRecords.find(p=>p.name===c.name);if(b)c.planning.berthId=b.id;}
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 const drafts=html.slice(html.indexOf('<details id="drafts"'),html.indexOf('id="plan-errors"'));
 for(const head of ['Cargo, t','Deadweight, t','Mean, m','Aft, m','Fwd, m','Deepest, m'])assert.ok(drafts.includes(head),head);
 for(const removed of ['Trim, m','Berth limit, m','Margin, m','Basis / note','planning.departure.trim'])assert.ok(!drafts.includes(removed),removed+' is no longer a Drafts column');
 for(const name of ['Ust-Luga','Santos','Paranaguá'])for(const phase of ['Arrival · ','Departure · '])assert.ok(drafts.includes(phase+name),phase+name);
 assert.ok(!/data-path="ports\.\d+\.planning\.\w+\.(aft|mid|fwd)"/.test(drafts),'the three drafts are calculated, not typed');
 assert.ok(!drafts.includes('.planning.departure.trim'),'trim is retained in state but no longer shown as a Drafts column');
 const blank=boot(null).elements.get('app').innerHTML;
 assert.ok(blank.includes('Add sales to the voyage to calculate departure and arrival drafts.'),'an empty voyage says what is missing');});

test('PLANNER lays hold volumes out as fields, not as a table',()=>{const html=boot(null).elements.get('app').innerHTML;
 assert.ok(html.includes('<h3>Holds</h3>'));
 assert.ok(html.includes('class="grid holds-grid"'));
 for(const n of [1,2,3,4,5])assert.ok(html.includes('Hold №'+n+', m³'),'missing hold '+n);
 assert.ok(!html.includes('Grain, m³'),'the one-row-per-hold table is gone');
 assert.match(html,/data-path="holds\.4\.volume"/,'each hold volume stays editable');
 assert.ok(!html.includes('massLimit'),'no mass limit input anywhere in PLANNER');});

test('GUIDE explains the order of work and never touches the voyage',()=>{
 const saved=M.demo();const {app,elements}=boot(JSON.stringify(saved),'guide');
 const before=JSON.stringify(app.getState());
 const html=elements.get('app').innerHTML;
 assert.match(html,/<h2>GUIDE<\/h2><p class="section-intro">How a voyage is put together, tab by tab\.<\/p>/);
 assert.ok(html.includes('<svg viewBox="0 0 900 330"'),'the flow diagram is drawn inline');
 assert.equal((html.match(/class="guide-box[ "]/g)||[]).length,5,'four registers and the planner');
 for(const tab of ['CARGO','PORT','VESSEL','SALE','PLANNER'])assert.ok(html.includes('>'+tab+'<'),tab+' is missing from the diagram or the steps');
 assert.equal((html.match(/<ul class="guide-notes">(.*?)<\/ul>/)?.[1].match(/<li>/g)||[]).length,4,'the closing notes');
 assert.equal((html.match(/guide-step-head/g)||[]).length,10,'five tabs plus five planner sections');
 assert.ok(html.includes('stored in this browser only'),'the storage limit is stated');
 elements.get('tab-planner').onclick();elements.get('tab-guide').onclick();
 assert.equal(JSON.stringify(app.getState()),before,'reading the guide changes nothing');
 assert.equal(elements.get('planner-actions').hidden,true,'no calculation controls over the guide');});

test('VESSEL heads its register like the other tabs',()=>{const {elements}=boot(null);elements.get('tab-vessel').onclick();
 assert.match(elements.get('app').innerHTML,/<div class="heading"><div><h2>VESSEL TYPES<\/h2><p class="section-intro">Standard vessel types for cargo carriage\.<\/p><\/div>/);
 elements.get('tab-sale').onclick();
 assert.match(elements.get('app').innerHTML,/<div class="heading"><div><h2>SALE<\/h2><p class="section-intro">/,'the same shape SALE uses');});

test('VESSEL lays hold volumes out as fields, not as a table',()=>{const {elements}=boot(null);elements.get('tab-vessel').onclick();const html=elements.get('app').innerHTML;
 assert.ok(html.includes('<h3>Holds</h3>'));
 assert.ok(html.includes('class="grid holds-grid"'),'holds use the field grid used by the parameters above');
 for(const n of [1,2,3,4,5])assert.ok(html.includes('Hold №'+n+', m³'),'missing hold '+n);
 assert.ok(!html.includes('Grain volume, m³'),'the one-row-per-hold table is gone');
 assert.match(html,/data-path="vesselProfiles\.0\.holdData\.4\.volume"/,'each hold volume stays editable');
 assert.ok(html.includes('Air draft, m'),'air draft is editable on the vessel card');
 assert.match(html,/data-path="vesselProfiles\.0\.airDraft"/);});

test('ProjectX footer is shared across tabs; calculation controls remain in PLANNER',()=>{const html=fs.readFileSync(__dirname+'/index.html','utf8');assert.ok(html.includes('id="planner-actions"'));assert.ok(html.includes('id="planner-footer" class="projectx-footer"'));assert.ok(html.includes('Voyage Planner Prototype'));assert.ok(html.includes('id="pdf">Save PDF'));const {elements}=boot(null);for(const tab of ['planner','sale','cargo','ports','vessel','market']){elements.get('tab-'+tab).onclick();assert.equal(elements.get('planner-actions').hidden,tab!=='planner');assert.equal(elements.get('planner-footer').hidden,false);}});
test('Section 4 keeps its result and nothing that explains it',()=>{
 const s=M.demo();s.costs=[{name:'Extra stop',amount:100,days:1,burn:2,fuel:'main'}];
 const {app,elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 for(const gone of ['class="calculation-details"','How calculated','Review calculation lines and fuel consumption','id="audit"','This is a vessel cost model','Model cost per tonne'])
  assert.ok(!html.includes(gone),gone+' is still printed');
 assert.ok(!fs.readFileSync(__dirname+'/app.js','utf8').includes('calculationDetails'),'the builder behind those blocks is gone, not left unused');
 // The result itself, and the warning that the plan does not confirm it, stay.
 for(const kept of ['<h3>Costs</h3>','<h3>Freight estimate</h3>','TCE before hire, USD/day','P&L after hire, USD','Freight required to cover model cost, USD/t'])
  assert.ok(html.includes(kept),kept+' is missing from the result');
 const b=app.getResult().budget;
 assert.ok(b.trace.totals.length&&b.rows.length,'and the evidence stays in the result the audit tests read');
});
test('Calculation evidence escapes labels and updates when selected stage changes',()=>{
 const s=M.demo();s.costs=[{name:'<img src=x onerror=alert(1)>',amount:0,days:0,burn:0,fuel:'main'}];s.stage='Paranaguá';
 const {elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));
 for(const gone of ['id="calc-stowage"','id="technical"','Click a hold to edit','Cargo plan validation limits','Automatic suggestions above'])assert.ok(!html.includes(gone),gone+' should be gone from section 3');
 assert.ok(!html.includes('class="calculation-details"'),'no How calculated block is left to escape into');
 assert.ok(html.includes('data-path="costs.0.name"'),'the item is still editable, with its name escaped in the field');
});

test('Deductions and holds fold into one Intake Calculator that keeps its result on the summary',()=>{
 const blank=boot(null).elements.get('app').innerHTML;
 const block=blank.slice(blank.indexOf('<details id="intake-calculator"'),blank.indexOf('rotation-grid'));
 for(const inside of ['<h3>Deductions</h3>','<h3>Holds</h3>','holds-grid','data-path="deductions.fuel"','data-path="holds.0.volume"','draft-formula','intake-line','grain-capacity'])
  assert.ok(block.includes(inside),inside+' left the calculator');
 assert.ok(blank.indexOf('vessel-choice')<blank.indexOf('id="intake-calculator"'),'the vessel line stays above it');
 assert.ok(blank.indexOf('id="intake-calculator"')<blank.indexOf('rotation-grid'),'the rotation stays below it');
 assert.ok(block.includes('<summary><strong>Intake Calculator</strong>'),'the block names itself on the summary');
 assert.match(block,/<details id="intake-calculator" class="fold">/,'the calculator is folded on open even before intake is calculated');
 assert.ok(block.includes('INTAKE NOT CALCULATED'),'the summary says so rather than showing a stale figure, and reads as a plate');
 const s=M.demo();s.intakeShownFor=JSON.stringify([P.INTAKE_METHOD,37667,950,200,300,525,0]);
 const shown=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.match(shown,/<details id="intake-calculator" class="fold">/,'a settled intake remains folded by default');
 assert.match(shown,/<summary><strong>Intake Calculator<\/strong><span>35,692\.00 T ESTIMATED RESTRICTED INTAKE<\/span>/,'the result stays readable while collapsed, in the case the plates use');
});

test('Drafts stay hidden by default and the summary still names the binding state',()=>{
 const s=M.demo();P.ensure(s);
 for(const c of s.ports){const b=s.portRecords.find(p=>p.name===c.name);if(b)c.planning.berthId=b.id;}
 const tag=html=>html.slice(html.indexOf('<details id="drafts"'),html.indexOf('</summary>',html.indexOf('<details id="drafts"')));
 const settled=tag(boot(JSON.stringify(s)).elements.get('app').innerHTML);
 assert.match(settled,/^<details id="drafts" class="fold">/,'the table is folded away on open');
 assert.ok(settled.includes('<summary><strong>Drafts</strong>'),'the block names itself');
 assert.match(settled,/deepest <strong>8\.91 m<\/strong> at Departure · Ust-Luga/,'the deepest state stays readable while collapsed');
 assert.match(settled,/tightest margin 2\.57 m at Arrival · Santos/,'so does the state with the least room');
 const tight=JSON.parse(JSON.stringify(s));
 tight.portRecords.find(p=>p.id===tight.ports[0].planning.berthId).maxDraft=8.5;
 const html=boot(JSON.stringify(tight)).elements.get('app').innerHTML;
 const exceeded=tag(html);
 assert.match(exceeded,/^<details id="drafts" class="fold">/,'a breach does not force the table open');
 assert.ok(exceeded.includes('<strong class="over-limit">1 over the berth limit</strong>'),'it reaches the reader on the summary instead');
 assert.ok(!exceeded.includes('tightest margin'),'a breach replaces the margin note rather than sitting beside it');
 assert.ok(html.slice(html.indexOf('id="plan-errors"')).includes('exceeds 8.5'),'and the claim is repeated under the table, outside the fold');
 const noBerth=JSON.parse(JSON.stringify(s));
 noBerth.ports.forEach(c=>c.planning.berthId='');
 const partial=tag(boot(JSON.stringify(noBerth)).elements.get('app').innerHTML);
 assert.ok(partial.includes('6 not checked against a berth limit'),'an unverified draft must not read as an all-clear');
});

test('Cargo distribution screening reaches the plan, the diagram and the printed evidence',()=>{
 // The case the task names: everything in the two forward holds, and the same again after a discharge.
 const s=M.demo();P.ensure(s);
 s.allocations=[{lot:'S1',hold:1,quantity:12000},{lot:'S1',hold:2,quantity:12000},{lot:'S2',hold:1,quantity:3000},{lot:'S2',hold:2,quantity:3000}];
 const {app,elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 assert.ok(html.includes('id="loading-patterns"'),'the screening stands in section 3');
 assert.ok(html.includes('Cargo only in forward holds №1, №2'),'and names the pattern in words');
 assert.ok(html.includes('2 departure states need review'),'the heading counts the departures, discharge included');
 assert.equal((html.match(/hold-review/g)||[]).length,4,'both loaded holds are marked, in the profile and in the plan');
 const patterns=app.getPlanningResult().loadingPatterns;
 assert.equal(patterns.method,'cargo-pattern-2');
 assert.equal(patterns.states.find(x=>x.label==='Departure · Santos').issues[0].code,'end-only-forward','the state after the Santos discharge is screened too');
 // The printed evidence carries the same verdict and the same caveat.
 const evidence=html.slice(html.indexOf('class="print-evidence"'));
 assert.ok(evidence.includes('Cargo distribution'),'the printed states table has its own column');
 assert.ok(evidence.includes('Cargo only in forward holds'),'with the verdict of each state');
 assert.match(evidence,/not a stability, trim or strength calculation/,'and the caveat that it is a preliminary signal');
});
test('A cargo spread over every hold stays quiet, and a later state is raised on its own',()=>{
 // Both parcels across all five holds: every state of the voyage keeps every hold loaded.
 const quiet=M.demo();P.ensure(quiet);
 quiet.allocations=[1,2,3,4,5].flatMap(hold=>[{lot:'S1',hold,quantity:4800},{lot:'S2',hold,quantity:1200}]);
 const {app,elements}=boot(JSON.stringify(quiet)),html=elements.get('app').innerHTML;
 assert.ok(!html.includes('loading-pattern-alert'),'nothing is raised');
 assert.ok(!html.includes('hold-review'),'and no hold is marked on the diagram');
 assert.ok(html.includes('No listed pattern found · ship-specific checks still required'),'the line still refuses to approve the state');
 assert.ok(app.getPlanningResult().loadingPatterns.states.every(x=>['no-pattern','empty'].includes(x.status)),'every state of the voyage is clean');
 // A plan that is clean now but empties into one end still raises that later state, and offers to open it.
 const later=M.demo();P.ensure(later);
 later.allocations=[1,2,3,5].map(hold=>({lot:'S1',hold,quantity:6000})).concat([{lot:'S2',hold:4,quantity:6000}]);
 const raised=boot(JSON.stringify(later)).elements.get('app').innerHTML;
 assert.equal(raised.match(/<p class="loading-pattern-alert"><strong>([^<]*)</)[1],'Departure · Santos','the alert belongs to the state that needs it, not to the current one');
 assert.ok(raised.includes('Cargo only in aft holds №4'),'and says what will be wrong there');
 assert.ok(raised.includes('data-action="loading-state"'),'with a way to open that state');
});
test('Section 3 draws two views: how full each hold is, and what is in it',()=>{
 const s=M.demo();P.ensure(s);
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 const ships=[...html.matchAll(/<svg class="ship([^"]*)"[\s\S]*?<\/svg>/g)].map(m=>m[0]);
 assert.equal(ships.length,2,'a profile above the plan');
 const [profile,plan]=ships;
 assert.match(profile,/class="ship ship-profile"/);
 for(const part of ['class="ship-hull"','class="ship-hatch"','class="ship-deckline"','class="hold-edge"','<clipPath id="hold-clip-0">'])assert.ok(profile.includes(part),part+' is missing from the profile');
 // The house is cut into the silhouette itself, as it is on the reference drawing, not pasted on top of it.
 assert.match(profile,/class="ship-hull" d="[^"]*H170 V50 H142 V36 H114 V22 H78/,'the accommodation steps down forward from the funnel, clear of the first hold at 180');
 // A hold in profile is the space a bulk carrier actually has: topside tanks cut its upper corners, hopper tanks its lower ones.
 const shape=profile.match(/<polygon class="hold-outline" points="([^"]*)"/)[1].split(' ').length;
 assert.equal(shape,8,'eight corners, not four');
 assert.match(profile,/<g clip-path="url\(#hold-clip-\d\)">/,'and the cargo in it is clipped to that shape');
 // Both views are drawn to the same length, so one stands over the other frame for frame.
 const span=v=>/class="ship-hull" d="M44 \d+ /.test(v)&&/1096/.test(v);
 assert.ok(span(profile)&&span(plan),'the two hulls start and end at the same x');
 // The profile carries the figures: how full, and how much.
 assert.match(profile,/<text class="profile-fill"[^>]*>55\.2 %<\/text>/);
 assert.match(profile,/<text class="profile-mass"[^>]*>6,000\.0 t<\/text>/);
 assert.match(profile,/<text class="profile-volume"[^>]*>9,782\.00 m³<\/text>/,'the size of the hold stands with them');
 assert.ok(!profile.includes('BULK SULPHUR'),'and nothing else');
 // The plan carries the cargo and the port it is loaded at.
 assert.match(plan,/<div>BULK SULPHUR APP C<small>Ust-Luga → Santos<\/small><\/div>/,'the cargo with the ports it moves between');
 for(const gone of ['profile-fill','hold-stat','HOLD №','m³'])assert.ok(!plan.includes(gone),gone+' is still in the plan; the hold is named and measured above it');
 // Holds stand at the same place in both, so one reads above the other.
 // A hatch coaming is inset 20 from its hold, so its x places the hold in the profile.
 const profileX=[...profile.matchAll(/<rect class="ship-hatch" x="(\d+)"/g)].map(m=>Number(m[1])-20);
 const planX=[...plan.matchAll(/<rect class="hold-outline" x="(\d+)"/g)].map(m=>Number(m[1]));
 assert.deepEqual(profileX,planX,'the two views line up hold for hold');
 // A hold nobody filled says so in both.
 assert.match(profile,/<text class="profile-fill"[^>]*>0\.0 %<\/text>/);
 assert.ok(plan.includes('<span class="muted">Empty</span>'));
});
test('A hold on the stowage diagram is a picture, not a button',()=>{
 const html=boot(JSON.stringify(M.demo())).elements.get('app').innerHTML;
 const ship=html.slice(html.indexOf('<svg class="ship" viewBox'),html.indexOf('</svg>',html.indexOf('<svg class="ship" viewBox')));
 assert.ok(ship.includes('class="hold '),'the holds are still drawn');
 for(const gone of ['data-hold-target','role="button"','tabindex="0"'])assert.ok(!ship.includes(gone),gone+' still makes a hold clickable');
 assert.ok(ship.includes('aria-label="Hold 1:'),'each hold is still described for a screen reader');
 assert.ok(!html.includes('Add maximum mass'),'the hold limit dialog is gone from PLANNER');
});

test('Estimated intake never labels missing cubics as a combined limit and retires legacy results',()=>{
 const s=M.demo();s.intakeShownFor=JSON.stringify([P.INTAKE_METHOD,37667,950,200,300,525,0]);s.holds[0].volume=null;
 let html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(html.includes('35,692.00 T DWT ONLY · CUBICS NOT CHECKED'));assert.ok(!html.includes('35,692.00 T ESTIMATED RESTRICTED INTAKE'));
 s.intakeShownFor=JSON.stringify([37667,950,200,300,525,0]);html=boot(JSON.stringify(s)).elements.get('app').innerHTML;assert.ok(html.includes('INTAKE NOT CALCULATED'));
 s.intakeShownFor=JSON.stringify([P.INTAKE_METHOD,37667,950,200,300,525,0]);s.portRecords.find(p=>p.name==='Santos').waterDensity=null;
 html=boot(JSON.stringify(s)).elements.get('app').innerHTML;assert.match(html,/Select water density.*Santos/);assert.match(html,/data-action="calc-intake" disabled/);
});
