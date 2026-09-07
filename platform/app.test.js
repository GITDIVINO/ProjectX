'use strict';const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),M=require('./model');
// Boot smoke test with a minimal document sink, not a browser or visual test.
test('PLANNER displays SF as text and preserves stored cargo properties',()=>{
 const s=M.demo();s.lots[0].sf=0.98765;
 const {app,elements}=boot(JSON.stringify(s));const html=elements.get('app').innerHTML;
 assert.ok(html.includes('<td>0.98765</td>'));
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
 assert.ok(html.includes('9 July 2026'));assert.ok(html.includes('not a live market feed'));
 assert.ok(html.includes('US Gulf'));assert.ok(html.includes('Outlook at publication'));
 elements.get('tab-planner').onclick();elements.get('tab-market').onclick();
 assert.equal(JSON.stringify(app.getState()),before);
 assert.equal(elements.get('planner-actions').hidden,true);
});
function boot(saved,savedTab=null){const elements=new Map(),tabWrites=[];const document={getElementById:id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',addEventListener(){},setAttribute(name,value){this[name]=value;}});return elements.get(id);},querySelectorAll:()=>[]};const context={window:{ProjectXModel:M,ProjectXMarket:require('./market')},document,localStorage:{getItem:()=>saved},sessionStorage:{getItem:()=>savedTab,setItem:(key,value)=>tabWrites.push([key,value])},console,Blob,URL,setTimeout};vm.runInNewContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);return {app:context.window.ProjectXApp,elements,tabWrites};}
test('App boots with a clean PLANNER and no saved calculation',()=>{const {app,elements}=boot(null);assert.equal(app.getResult().budget,null);assert.equal(app.getState().lots.length,0);assert.equal(app.getState().sales.length,0);assert.ok(elements.get('app').innerHTML.includes('Allocate by volume'));assert.ok(!elements.get('app').innerHTML.includes('SALE-S1'));});
test('Every accepted change is autosaved while manual Save remains available',()=>{
 const source=fs.readFileSync(__dirname+'/app.js','utf8');
 assert.match(source,/function changed\(\)\{ensureLegs\(\);\$\('status'\)\.textContent='';saveCalculation\(false\);render\(\);\}/);
 assert.match(source,/\$\('save'\)\.onclick=\(\)=>saveCalculation\(true\)/);
 assert.match(source,/currentTab!=='planner'/);assert.match(source,/saveCalculation\(false\)/);
});
test('App restores a saved voyage and the active workspace tab',()=>{const saved=M.demo();const {app,elements}=boot(JSON.stringify(saved),'cargo');assert.ok(app.getResult().budget);assert.equal(app.getState().lots.length,2);assert.equal(elements.get('tab-cargo')['aria-selected'],'true');assert.equal(elements.get('planner-actions').hidden,true);assert.ok(elements.get('app').innerHTML.includes('Planning SF, m³/t'));});
test('Corrupt or obsolete saved state falls back to blank',()=>{for(const value of ['{broken',JSON.stringify({version:1}),JSON.stringify({version:2,lots:[{},{}],ports:[{},{},{}]})])assert.equal(boot(value).app.getResult().budget,null);});

test('CARGO retains catalog records while rendering the simplified register',()=>{const {app,elements}=boot(null);elements.get('tab-cargo').onclick();const html=elements.get('app').innerHTML;assert.equal((html.match(/data-catalog-name=/g)||[]).length,25);assert.ok(app.getState().cargoTypes.length>=97);assert.ok(html.includes('Planning SF, m³/t'));assert.ok(html.includes('IMSBC Group'));for(const removed of ['Hold restriction','Properties / source','Apply to parcels','UN number','Transport hazard class','SDS / declaration required','Reference estimate','N/A to this carriage mode','cargo-meta'])assert.ok(!html.includes(removed));});
test('SALE and PORTS tabs render their business registers',()=>{const {elements}=boot(null);elements.get('tab-sale').onclick();assert.ok(elements.get('app').innerHTML.includes('Register of concluded sales'));assert.ok(elements.get('app').innerHTML.includes('Add the first deal'));elements.get('tab-ports').onclick();const ports=elements.get('app').innerHTML;assert.ok(ports.includes('Ust-Luga'));assert.ok(ports.includes('European Sulphur Terminal'));assert.ok(!ports.includes('DA, USD'));assert.ok(!ports.includes('Charterer port and terminal register'));assert.match(ports,/<th scope="col">Country<\/th><th scope="col">Port<\/th><th scope="col">Terminal<\/th><th scope="col">Berth<\/th><th scope="col">Max draft, m<\/th><th scope="col">Max beam, m<\/th><th scope="col">Max LOA, m<\/th><th scope="col">Max air draft, m<\/th><th scope="col">Max DWT<\/th>/,'columns follow the source table: draft, beam, LOA');assert.ok(ports.includes('value="Russia"')&&ports.includes('value="Brazil"'));assert.ok(!ports.includes('>Notes<'),'the Notes column is not rendered');assert.ok(!ports.includes('Compared with'),'no comparison line above the register');assert.ok(ports.includes('Berth 13'),'Murmansk berths are separate rows');assert.ok(!ports.includes('limit-exceeded')&&!ports.includes('limit-flag'),'PORT is a register only: breaches are shown in PLANNER');});

test('PLANNER lays hold volumes out as fields, not as a table',()=>{const html=boot(null).elements.get('app').innerHTML;
 assert.ok(html.includes('<h3>Holds</h3>'));
 assert.ok(html.includes('class="grid holds-grid"'));
 for(const n of [1,2,3,4,5])assert.ok(html.includes('Hold №'+n+', m³'),'missing hold '+n);
 assert.ok(!html.includes('Grain, m³'),'the one-row-per-hold table is gone');
 assert.match(html,/data-path="holds\.4\.volume"/,'each hold volume stays editable');
 assert.ok(!html.includes('massLimit'),'no mass limit input anywhere in PLANNER');});

test('VESSEL lays hold volumes out as fields, not as a table',()=>{const {elements}=boot(null);elements.get('tab-vessel').onclick();const html=elements.get('app').innerHTML;
 assert.ok(html.includes('<h3>Holds</h3>'));
 assert.ok(html.includes('class="grid holds-grid"'),'holds use the field grid used by the parameters above');
 for(const n of [1,2,3,4,5])assert.ok(html.includes('Hold №'+n+', m³'),'missing hold '+n);
 assert.ok(!html.includes('Grain volume, m³'),'the one-row-per-hold table is gone');
 assert.match(html,/data-path="vesselProfiles\.0\.holdData\.4\.volume"/,'each hold volume stays editable');
 assert.ok(html.includes('Air draft, m'),'air draft is editable on the vessel card');
 assert.match(html,/data-path="vesselProfiles\.0\.airDraft"/);});

test('ProjectX footer is shared across tabs; calculation controls remain in PLANNER',()=>{const html=fs.readFileSync(__dirname+'/index.html','utf8');assert.ok(html.includes('id="planner-actions"'));assert.ok(html.includes('id="planner-footer" class="projectx-footer"'));assert.ok(html.includes('Voyage Planner Prototype'));assert.ok(html.includes('id="pdf">Save PDF'));const {elements}=boot(null);for(const tab of ['planner','sale','cargo','ports','vessel','market']){elements.get('tab-'+tab).onclick();assert.equal(elements.get('planner-actions').hidden,tab!=='planner');assert.equal(elements.get('planner-footer').hidden,false);}});
test('Calculated blocks expose formulas, live values and cent reconciliation',()=>{
 const s=M.demo();s.costs=[{name:'Extra stop',amount:100,days:1,burn:2,fuel:'main'}];
 const {elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 for(const id of ['stowage','legs','ports','extras','totals','allocation'])assert.ok(html.includes('id="calc-'+id+'"'),id);
 assert.ok(!html.includes('id="calc-vessel"'),'section 2 has no How calculated block');
 for(const text of ['Distance / (speed × 24)','Model cost per tonne','Exact share in cents','Reconciliation:','Remainder correction','7200 NM','24000','automatic capacity'])assert.ok(html.includes(text),text);
 assert.ok(!html.includes('Break-even, USD/t'));assert.ok(!html.includes('reserves №4'));assert.ok(!html.includes('Tank top: 22'));
});
test('Calculation evidence escapes labels and updates when selected stage changes',()=>{
 const s=M.demo();s.costs=[{name:'<img src=x onerror=alert(1)>',amount:0,days:0,burn:0,fuel:'main'}];s.stage='Paranaguá';
 const {elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));
 const start=html.indexOf('id="calc-stowage"'),end=html.indexOf('id="technical"');const trace=html.slice(start,end);
 assert.ok(trace.includes('stage mass'));assert.ok(trace.includes('0 t'));assert.ok(trace.includes('unassigned in loading plan'));
});
