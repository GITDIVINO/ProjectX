'use strict';const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),M=require('./model'),P=require('./planning');
// Boot smoke test with a minimal document sink, not a browser or visual test.
test('PLANNER displays SF as text and preserves stored cargo properties',()=>{
 const s=M.demo();s.lots[0].sf=0.98765;
 const {app,elements}=boot(JSON.stringify(s));const html=elements.get('app').innerHTML;
 assert.match(html,/<td>0\.99<\/td>/,'the register column is uniform to two decimals');
 assert.ok(html.includes('24,000 × 0.98765'),'the calculation line keeps the exact stored value');
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
function boot(saved,savedTab=null){const elements=new Map(),tabWrites=[];const document={getElementById:id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',addEventListener(){},setAttribute(name,value){this[name]=value;}});return elements.get(id);},querySelectorAll:()=>[]};const context={window:{ProjectXModel:M,ProjectXPlanning:require('./planning'),ProjectXPlannerUI:require('./planner-ui'),ProjectXMarket:require('./market'),ProjectXGuide:require('./guide')},document,localStorage:{getItem:()=>saved},sessionStorage:{getItem:()=>savedTab,setItem:(key,value)=>tabWrites.push([key,value])},console,Blob,URL,setTimeout};vm.runInNewContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);return {app:context.window.ProjectXApp,elements,tabWrites};}
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

test('Restricted intake DWT appears only after Calculate intake and never outlives its inputs',()=>{
 const blank=boot(null).elements.get('app').innerHTML;
 for(const gone of ['Lubricants, t','Slops, t','deductions.lubes','deductions.slops'])assert.ok(!blank.includes(gone),gone+' is still in PLANNER');
 for(const kept of ['Fuel, t','Fresh water, t','Ballast, t','Constant, t','Loss due to draft, t'])assert.ok(blank.includes(kept),kept);
 assert.match(blank,/data-action="calc-intake" disabled/,'no deductions entered yet, so the button is disabled');
 const s=M.demo();
 assert.match(boot(JSON.stringify(s)).elements.get('app').innerHTML,/Restricted intake DWT: <strong>—<\/strong><button data-action="calc-intake" >/,'a complete voyage offers the button but shows no figure yet');
 s.intakeShownFor=JSON.stringify([37667,950,200,300,525,0]);
 const shown=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(shown.includes('− draft loss 0 = <strong>35,692.00 t</strong>'),'the calculated figure is shown');
 assert.ok(shown.includes('Restricted intake DWT/cubics: 46,730.00 m³ ÷ mix SF 0.90000 m³/t = <strong>51,922.22 t</strong>'),'the cubic limit is written out on its own line');
 assert.ok(!shown.includes('calc-intake'),'the button steps aside once the figure is shown');
 s.deductions.fuel=951;
 const stale=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(stale.includes('Restricted intake DWT: <strong>—</strong>'),'an edited deduction withdraws the figure');
 assert.ok(stale.includes('calc-intake'),'and brings the button back');
 assert.ok(!blank.includes('does not verify draft'),'the caveat line is replaced by the calculation');
 assert.ok(!blank.includes('− draft loss'),'no calculation before the figure is asked for');
 assert.ok(shown.includes('Restricted intake DWT: DWT 37,667 − fuel 950 − fresh water 200 − ballast 300 − constant 525 − draft loss 0 = <strong>35,692.00 t</strong>'),'the result carries its own substitution on one line');
 const restricted=M.demo();restricted.deductions.draftLoss=1200;restricted.intakeShownFor=JSON.stringify([37667,950,200,300,525,1200]);
 const less=boot(JSON.stringify(restricted)).elements.get('app').innerHTML;
 assert.ok(less.includes('Restricted intake DWT: <strong>—</strong>'),'old manual draft loss invalidates the displayed intake');assert.match(less,/aria-label="Loss due to draft, t" readonly value="0.0"/);assert.ok(!less.includes('data-action="draft-estimate"'));assert.ok(!less.includes('data-action="intake-basis"'));});

test('Vessel particulars sit on the DWT line and drop bale capacity',()=>{const html=boot(null).elements.get('app').innerHTML;
 assert.match(html,/<span class="muted">33,465 DWT · 5 holds · HDD34 · LOA 180\.0 m · Beam 30\.0 m · Draft 9\.85 m · TPC 50\.7 · Grain 45,517 m³<\/span>/);
 assert.ok(!/Bale/.test(html),'bale capacity is not shown in PLANNER');
 assert.match(html,/<h3>Deductions<\/h3>.*<div class="grid">/,'the block is a permanent heading, not a disclosure');
 assert.ok(!html.includes('id="vessel"'),'nothing left to collapse');});

test('Cargo volume sits under Holds and is the tonnage times SF of the selected sales',()=>{
 const blank=boot(null).elements.get('app').innerHTML;
 assert.ok(blank.includes('Cargo volume: — · needs a selected sale with a quantity and an SF.'),'an empty voyage says why it cannot be computed');
 assert.ok(blank.includes('Grain capacity: 7,781.4 + 9,489.1 + 9,484.5 + 9,487.6 + 9,274.2 = 45,516.80 m³'),'the hold volumes are summed even before any sale exists');
 assert.ok(blank.indexOf('grain-capacity')<blank.indexOf('cargo-volume'),'grain capacity comes first');
 const missing=M.demo();missing.holds[2].volume=null;
 assert.ok(boot(JSON.stringify(missing)).elements.get('app').innerHTML.includes('Grain capacity: — · enter every hold volume.'),'one empty hold makes the total unknown, not partial');
 const s=M.demo();
 const html=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.ok(html.includes('Cargo volume: 24,000 × 0.9 + 6,000 × 0.9 = 27,000.00 m³</small>'),html.slice(html.indexOf('Cargo volume'),html.indexOf('Cargo volume')+220));
 for(const gone of ['weighted SF','free of','hold volumes incomplete'])assert.ok(!html.includes(gone),gone+' should not be in the line');
 assert.ok(html.indexOf('intake-line')<html.indexOf('holds-grid'),'intake sits with the deductions it comes from');
 assert.ok(html.indexOf('holds-grid')<html.indexOf('cargo-volume'),'cargo volume follows the hold volumes it is compared against');
 const mixed=M.demo();mixed.lots[1].sf=1.2;
 const weighted=boot(JSON.stringify(mixed)).elements.get('app').innerHTML;
 assert.ok(weighted.includes('Cargo volume: 24,000 × 0.9 + 6,000 × 1.2 = 28,800.00 m³'),'each parcel keeps its own SF in the sum');
 const unselected=M.demo();unselected.lots.forEach(l=>l.selected=false);
 assert.ok(boot(JSON.stringify(unselected)).elements.get('app').innerHTML.includes('Cargo volume: —'),'nothing selected, nothing claimed');});

test('The draft loss calculation is printed and the field is not editable',()=>{
 const plain=M.demo();M.applyVessel(plain,'tbn-3');
 const html=boot(JSON.stringify(plain)).elements.get('app').innerHTML;
 assert.ok(html.includes('Draft loss: Santos 11.3 m · (12.8 − 11.3) m × 100 × TPC 58.8 = 8,820.0 t'),'the arithmetic is shown, not only the result');
 const formula=html.slice(html.indexOf('<small class="draft-formula"'),html.indexOf('</small>',html.indexOf('<small class="draft-formula"')));
 assert.ok(!formula.includes('Ust-Luga'),'only the binding call is printed; the calls that do not bind are left out');
 assert.match(html,/aria-label="Loss due to draft, t" readonly/,'the platform owns this figure');
 assert.ok(!html.includes('data-path="deductions.draftLoss"'),'no input path, so it cannot be typed into');
 const clear=M.demo();M.applyVessel(clear,'tbn-1');
 assert.ok(boot(JSON.stringify(clear)).elements.get('app').innerHTML.includes('permissible draft 9.85 m is inside the 11.3 m limit = 0.0 t'),'a voyage with room states it');
 const corrected=M.demo();M.applyVessel(corrected,'tbn-3');P.ensure(corrected);
 corrected.planning.vesselBasis={vesselKey:JSON.stringify(M.vesselOf(corrected)),kind:'reference',source:'P',date:'2026-09-08',dwtBasis:'Summer SW',density:1.025,lightship:10800,tpcRangeCm:200,tpcSource:'Hydro'};
 const dense=boot(JSON.stringify(corrected)).elements.get('app').innerHTML;
 assert.ok(dense.includes('FWA 28.6 cm → DWA 11.5 cm at ρ 1.015 · permissible 12.915 m − 11.3 m = 161.5 cm × TPC 58.23'),'the load-line terms are named: '+dense.slice(dense.indexOf('Draft loss'),dense.indexOf('Draft loss')+220));
 assert.ok(dense.includes('× TPC 58.23 = 9,401.0 t'));
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
test('Calculated blocks expose formulas, live values and cent reconciliation',()=>{
 const s=M.demo();s.costs=[{name:'Extra stop',amount:100,days:1,burn:2,fuel:'main'}];
 const {elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 for(const id of ['legs','ports','extras','totals','allocation'])assert.ok(html.includes('id="calc-'+id+'"'),id);
 assert.ok(!html.includes('id="calc-vessel"'),'section 2 has no How calculated block');
 for(const text of ['Distance / (speed × 24)','Model cost per tonne','Exact share in cents','Reconciliation:','Remainder correction','7200 NM','24000'])assert.ok(html.includes(text),text);
 assert.ok(!html.includes('Break-even, USD/t'));assert.ok(!html.includes('reserves №4'));assert.ok(!html.includes('Tank top: 22'));
});
test('Calculation evidence escapes labels and updates when selected stage changes',()=>{
 const s=M.demo();s.costs=[{name:'<img src=x onerror=alert(1)>',amount:0,days:0,burn:0,fuel:'main'}];s.stage='Paranaguá';
 const {elements}=boot(JSON.stringify(s)),html=elements.get('app').innerHTML;
 assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));
 for(const gone of ['id="calc-stowage"','id="technical"','Click a hold to edit','Cargo plan validation limits','Automatic suggestions above'])assert.ok(!html.includes(gone),gone+' should be gone from section 3');
 const legs=html.slice(html.indexOf('id="calc-legs"'),html.indexOf('id="calc-ports"'));
 assert.ok(legs.includes('Formula and values'),'the remaining disclosures still show their substitutions');
});

test('Deductions and holds fold into one Intake Calculator that keeps its result on the summary',()=>{
 const blank=boot(null).elements.get('app').innerHTML;
 const block=blank.slice(blank.indexOf('<details id="intake-calculator"'),blank.indexOf('rotation-grid'));
 for(const inside of ['<h3>Deductions</h3>','<h3>Holds</h3>','holds-grid','data-path="deductions.fuel"','data-path="holds.0.volume"','draft-formula','intake-line','grain-capacity','cargo-volume'])
  assert.ok(block.includes(inside),inside+' left the calculator');
 assert.ok(blank.indexOf('vessel-choice')<blank.indexOf('id="intake-calculator"'),'the vessel line stays above it');
 assert.ok(blank.indexOf('id="intake-calculator"')<blank.indexOf('rotation-grid'),'the rotation stays below it');
 assert.ok(block.includes('<summary><strong>Intake Calculator</strong>'),'the block names itself on the summary');
 assert.match(block,/<details id="intake-calculator" class="fold">/,'the calculator is folded on open even before intake is calculated');
 assert.ok(block.includes('Intake not calculated'),'the summary says so rather than showing a stale figure');
 const s=M.demo();s.intakeShownFor=JSON.stringify([37667,950,200,300,525,0]);
 const shown=boot(JSON.stringify(s)).elements.get('app').innerHTML;
 assert.match(shown,/<details id="intake-calculator" class="fold">/,'a settled intake remains folded by default');
 assert.match(shown,/<summary><strong>Intake Calculator<\/strong><span>35,692\.00 t restricted intake<\/span>/,'the result stays readable while collapsed');
});

test('Drafts stay hidden by default and the summary still names the binding state',()=>{
 const s=M.demo();P.ensure(s);
 for(const c of s.ports){const b=s.portRecords.find(p=>p.name===c.name);if(b)c.planning.berthId=b.id;}
 const tag=html=>html.slice(html.indexOf('<details id="drafts"'),html.indexOf('</summary>',html.indexOf('<details id="drafts"')));
 const settled=tag(boot(JSON.stringify(s)).elements.get('app').innerHTML);
 assert.match(settled,/^<details id="drafts" class="fold">/,'the table is folded away on open');
 assert.ok(settled.includes('<summary><strong>Drafts</strong>'),'the block names itself');
 assert.match(settled,/deepest <strong>8\.73 m<\/strong> at Departure · Ust-Luga/,'the deepest state stays readable while collapsed');
 assert.match(settled,/tightest margin 2\.65 m at Arrival · Santos/,'so does the state with the least room');
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

test('A hold on the stowage diagram is a picture, not a button',()=>{
 const html=boot(JSON.stringify(M.demo())).elements.get('app').innerHTML;
 const ship=html.slice(html.indexOf('<svg class="ship"'),html.indexOf('</svg>'));
 assert.ok(ship.includes('class="hold '),'the holds are still drawn');
 for(const gone of ['data-hold-target','role="button"','tabindex="0"'])assert.ok(!ship.includes(gone),gone+' still makes a hold clickable');
 assert.ok(ship.includes('aria-label="Hold 1:'),'each hold is still described for a screen reader');
 assert.ok(!html.includes('Add maximum mass'),'the hold limit dialog is gone from PLANNER');
});
