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
function boot(saved,savedTab=null){const elements=new Map(),tabWrites=[];const document={getElementById:id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',addEventListener(){},setAttribute(name,value){this[name]=value;}});return elements.get(id);},querySelectorAll:()=>[]};const context={window:{ProjectXModel:M,ProjectXMarket:require('./market'),ProjectXGuide:require('./guide')},document,localStorage:{getItem:()=>saved},sessionStorage:{getItem:()=>savedTab,setItem:(key,value)=>tabWrites.push([key,value])},console,Blob,URL,setTimeout};vm.runInNewContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);return {app:context.window.ProjectXApp,elements,tabWrites};}
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
test('SALE and PORTS tabs render their business registers',()=>{const {elements}=boot(null);elements.get('tab-sale').onclick();assert.ok(elements.get('app').innerHTML.includes('Register of concluded sales'));assert.ok(elements.get('app').innerHTML.includes('Add the first deal'));elements.get('tab-ports').onclick();const ports=elements.get('app').innerHTML;assert.ok(ports.includes('Ust-Luga'));assert.ok(ports.includes('European Sulphur Terminal'));assert.ok(!ports.includes('DA, USD'));assert.match(ports,/<div class="heading"><div><h2>PORT<\/h2><p class="section-intro">Port and berth register with published size limits\.<\/p><\/div>/,'PORT is headed like the other registers');assert.ok(!ports.includes('Charterer port and terminal register'),'not the intro line the user removed earlier');assert.match(ports,/<th scope="col">Country<\/th><th scope="col">Port<\/th><th scope="col">Terminal<\/th><th scope="col">Berth<\/th><th scope="col">Max draft, m<\/th><th scope="col">Max beam, m<\/th><th scope="col">Max LOA, m<\/th><th scope="col">Max air draft, m<\/th><th scope="col">Max DWT<\/th>/,'columns follow the source table: draft, beam, LOA');assert.ok(ports.includes('value="Russia"')&&ports.includes('value="Brazil"'));assert.ok(!ports.includes('>Notes<'),'the Notes column is not rendered');assert.ok(!ports.includes('Compared with'),'no comparison line above the register');assert.ok(ports.includes('Berth 13'),'Murmansk berths are separate rows');assert.ok(!ports.includes('limit-exceeded')&&!ports.includes('limit-flag'),'PORT is a register only: breaches are shown in PLANNER');});

test('Preliminary intake appears only after Calculate intake and never outlives its inputs',()=>{
 const blank=boot(null).elements.get('app').innerHTML;
 for(const gone of ['Lubricants, t','Slops, t','deductions.lubes','deductions.slops'])assert.ok(!blank.includes(gone),gone+' is still in PLANNER');
 for(const kept of ['Fuel, t','Fresh water, t','Ballast, t','Constant, t'])assert.ok(blank.includes(kept),kept);
 assert.match(blank,/data-action="calc-intake" disabled/,'no deductions entered yet, so the button is disabled');
 const s=M.demo();
 assert.match(boot(JSON.stringify(s)).elements.get('app').innerHTML,/Preliminary intake: <strong>—<\/strong><button data-action="calc-intake" >/,'a complete voyage offers the button but shows no figure yet');
 s.intakeShownFor=JSON.stringify([37667,950,200,300,525]);
 const shown=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(shown.includes('Preliminary intake: <strong>35,692.00 t</strong>'),'the calculated figure is shown');
 assert.ok(!shown.includes('calc-intake'),'the button steps aside once the figure is shown');
 s.deductions.fuel=951;
 const stale=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(stale.includes('Preliminary intake: <strong>—</strong>'),'an edited deduction withdraws the figure');
 assert.ok(stale.includes('calc-intake'),'and brings the button back');
 assert.ok(!blank.includes('does not verify draft'),'the caveat line is replaced by the calculation');
 assert.ok(!blank.includes('intake-formula'),'no calculation before the figure is asked for');
 assert.ok(shown.includes('DWT 37,667 − fuel 950 − fresh water 200 − ballast 300 − constant 525 = 35,692.00 t'),'the calculation is written out with the entered values');});

test('Vessel particulars sit on the DWT line and drop bale capacity',()=>{const html=boot(null).elements.get('app').innerHTML;
 assert.match(html,/<span class="muted">33,465 DWT · 5 holds · HDD34 · LOA 180\.0 m · Beam 30\.0 m · Draft 9\.85 m · TPC 50\.7 · Grain 45,517 m³<\/span>/);
 assert.ok(!/Bale/.test(html),'bale capacity is not shown in PLANNER');
 assert.match(html,/deductions from DWT<\/summary><div class="grid">/,'no separate particulars paragraph is left inside the details');});

test('Cargo volume sits under Holds and is the tonnage times SF of the selected sales',()=>{
 const blank=boot(null).elements.get('app').innerHTML;
 assert.ok(blank.includes('Cargo volume: — · needs a selected sale with a quantity and an SF.'),'an empty voyage says why it cannot be computed');
 const s=M.demo();
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(html.includes('Cargo volume: 24,000 × 0.9 + 6,000 × 0.9 = <strong>27,000.00 m³</strong> · weighted SF 0.9 m³/t · 19,730.00 m³ free of 46,730 m³'),html.slice(html.indexOf('Cargo volume'),html.indexOf('Cargo volume')+220));
 assert.ok(html.indexOf('holds-grid')<html.indexOf('intake-line'),'intake follows the hold volumes');
 assert.ok(html.indexOf('intake-line')<html.indexOf('cargo-volume'),'cargo volume closes the block');
 const mixed=M.demo();mixed.lots[1].sf=1.2;
 const weighted=boot(JSON.stringify(mixed)).elements.get('app').innerHTML;
 assert.ok(weighted.includes('= <strong>28,800.00 m³</strong> · weighted SF 0.96 m³/t'),'a different SF per parcel is weighted by tonnage, not averaged');
 const unselected=M.demo();unselected.lots.forEach(l=>l.selected=false);
 assert.ok(boot(JSON.stringify(unselected)).elements.get('app').innerHTML.includes('Cargo volume: —'),'nothing selected, nothing claimed');});

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
