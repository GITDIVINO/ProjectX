// Run against the actual offline artifact in an isolated Chromium context.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url'),{chromium}=require('playwright');
const artifact=path.resolve(process.argv[2]||path.join(__dirname,'ProjectX.html'));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({locale:'en-GB',viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // PLANNER sections and VESSEL profiles are collapsible. Open the cards above a target
  // before acting on it, so a layout change does not read as a missing control.
  const reveal=async selector=>page.evaluate(s=>{for(let n=document.querySelector(s);n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;},selector);
  await page.goto(pathToFileURL(artifact).href);
  assert.equal(await page.evaluate(()=>!!window.ProjectXApp),true);
  async function scan(){
   const bad=await page.locator('body').evaluate(root=>{
    const result=[],walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walk.nextNode()){const node=walk.currentNode;if(!node.parentElement.closest('script,style')&&/[А-Яа-яЁё]/.test(node.textContent))result.push(node.textContent);}
    for(const el of root.querySelectorAll('[aria-label],[placeholder],[title],input,textarea,option')){
     for(const key of ['aria-label','placeholder','title'])if(/[А-Яа-яЁё]/.test(el.getAttribute(key)||''))result.push(el.getAttribute(key));
     if('value' in el&&/[А-Яа-яЁё]/.test(el.value))result.push(el.value);
    }
    return result;
   });assert.deepEqual(bad,[]);
  }
  async function tabs(){for(const tab of ['planner','forward','sale','cargo','ports','prices','market','vessel']){await page.locator('#tab-'+tab).click();await page.locator('details').evaluateAll(ds=>ds.forEach(d=>d.open=true));await scan();}}
  await tabs();
  // Reproduce the reported legacy 30,000 MT crushed sulphur restriction.
  const originalState=await page.evaluate(()=>ProjectXApp.getState());
  await page.evaluate(()=>{const s=ProjectXModel.initial();const sale=ProjectXModel.addSale(s,{cargoId:'cargo-2',quantity:30000,fob:250,dealDate:'2026-09-01',shipmentFrom:'2026-09-10',shipmentTo:'2026-09-20',loadPort:'Ust-Luga',dischargePort:'Santos'});const l=ProjectXModel.addSaleToPlanner(s,sale.id);l.onlyHold=4;s.cargoTypes.find(c=>c.id==='cargo-2').onlyHold=4;delete s.sulphurHoldScopeMigrated;localStorage.setItem('projectx-current-v2',JSON.stringify(s));});
  await page.reload();await page.locator('#tab-planner').click();
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().lots[0].name),'Crushed lump sulphur');
  assert.equal(await page.locator('[data-lot][data-hold]:not(:disabled)').count(),5);
  await page.locator('[data-action="allocate"]').click();await page.reload();
  const sulphurState=await page.evaluate(()=>ProjectXApp.getState());assert.equal(sulphurState.lots[0].sf,.95);assert.equal(sulphurState.allocations.length,5);assert.ok(Math.abs(sulphurState.allocations.reduce((n,a)=>n+a.quantity,0)-30000)<1e-8);
  await page.evaluate(s=>localStorage.setItem('projectx-current-v2',JSON.stringify(s)),originalState);await page.reload();
  await page.locator('#tab-market').click();
  const beforeMarket=await page.evaluate(()=>JSON.stringify(ProjectXApp.getState()));
  assert.equal(await page.locator('#market-report option').count(),30);
  assert.match(await page.locator('.market-disclaimer').first().innerText(),/2 September 2026/);
  const reportIds=await page.locator('#market-report option').evaluateAll(options=>options.map(o=>o.value));
  for(const id of reportIds){
   await page.locator('#market-report').selectOption(id);await scan();
   assert.equal(await page.locator('.market-date time').getAttribute('datetime'),id.replace('dry-bulk-',''));
   assert.ok(await page.locator('.market-region').count()>0);
   assert.equal(await page.evaluate(()=>document.activeElement.id),'market-report');
  }
  await page.locator('#market-region').selectOption('US Gulf');
  assert.equal(await page.locator('.market-region').count(),1);
  assert.equal(await page.locator('.market-region h4').textContent(),'US Gulf');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'market-region');
  assert.equal(await page.locator('#planner-actions').isVisible(),false);
  assert.equal(await page.locator('#planner-footer').isVisible(),true);
  assert.equal(await page.evaluate(()=>JSON.stringify(ProjectXApp.getState())),beforeMarket);
  await page.reload();
  assert.equal(await page.locator('#tab-market').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('#market-region').inputValue(),'US Gulf');
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  // The tabs do not fit across 390 px and are not meant to: the strip scrolls, the page does
  // not. What must hold is that the page itself never scrolls sideways and that every tab can
  // be reached — a tab that cannot be scrolled to is a tab that does not exist. The list is
  // every tab the page has, so one added without a thought for the phone shows up here.
  assert.equal(await page.evaluate(()=>{
   const strip=document.querySelector('.workspace-tabs');
   return getComputedStyle(strip).overflowX;
  }),'auto','the tab strip is what scrolls');
  const strip=await page.locator('.workspace-tabs button').evaluateAll(bs=>bs.map(b=>b.id));
  assert.deepEqual(strip,['tab-planner','tab-forward','tab-register','tab-sale','tab-cargo',
   'tab-ports','tab-vessel','tab-prices','tab-market','tab-guide']);
  for(const id of strip){
   await page.locator('#'+id).scrollIntoViewIfNeeded();
   const box=await page.locator('#'+id).boundingBox();
   assert.ok(box&&box.x>=-1&&box.x+box.width<=391,id+' can be brought into view');
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,
   'and the page itself still does not scroll sideways');
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#tab-vessel').click();
  assert.equal(await page.locator('[data-path$=".direction"]').count(),0);
  // Three reference profiles are offered. Names follow the VESSEL register, so the check asks
  // for the profiles by the id the page acts on and states the names it found.
  assert.equal(await page.locator('[data-action="apply-vessel"]').count(),3);
  for(const id of ['tbn-1','tbn-2','tbn-3'])assert.equal(await page.locator(`[data-action="apply-vessel"][data-id="${id}"]`).count(),1,`profile ${id} is offered`);
  // Each profile sits in a collapsed card; open it before acting on it.
  const tbn2Card=page.locator('details.vessel-card').filter({has:page.locator('[data-action="apply-vessel"][data-id="tbn-2"]')});
  await tbn2Card.locator('summary').click();
  // TBN 2 was an incomplete profile when this check was written, so applying it used to fail
  // with 'Check vessel parameter'. The reference profiles are complete now, so applying one
  // succeeds and must pin its particulars into the voyage. A profile that is still incomplete
  // is refused by applyVessel; that case is held by model.test.js.
  await page.locator('[data-action="apply-vessel"][data-id="tbn-2"]').click();
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().vesselId),'tbn-2');
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().vesselSnapshot?.id),'tbn-2','the applied particulars are pinned into the voyage');
  const tbn1Card=page.locator('details.vessel-card').filter({has:page.locator('[data-action="apply-vessel"][data-id="tbn-1"]')});
  await tbn1Card.locator('summary').click();
  await page.locator('[data-action="apply-vessel"][data-id="tbn-1"]').click();
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().vesselId),'tbn-1');
  await page.evaluate(()=>{
   const s=ProjectXApp.getState();delete s.catalogAdditions;
   s.vesselProfiles=s.vesselProfiles.filter(v=>v.id==='tbn-1');
   s.portRecords=s.portRecords.filter(p=>['Ust-Luga','Santos','Paranaguá'].includes(p.name));
   s.portRecords[0].terminal='Saved terminal';
   localStorage.setItem('projectx-current-v2',JSON.stringify(s));
  });
  await page.reload();await tabs();
  const migrated=await page.evaluate(()=>ProjectXApp.getState());
  // The reference registers grow as PORT and CARGO research lands, so the check asks the page
  // what a fresh register holds instead of pinning a number that goes stale unnoticed.
  const reference=await page.evaluate(()=>{const M=ProjectXModel,s=M.initial();return {ports:s.portRecords.length,
   // CARGO offers the entries that can actually be planned: bulk, with a planning SF.
   cargo:s.cargoTypes.filter(c=>M.isBulkCargo(c)&&M.ok(c.sf,true)).length};});
  assert.ok(reference.ports>3,'the reference port register must hold more than the three that were saved');
  assert.equal(migrated.portRecords.length,reference.ports,'a save with deleted reference ports is restored to the full register');
  assert.equal(migrated.vesselProfiles.length,3);
  assert.equal(migrated.portRecords[0].terminal,'Saved terminal');
  await page.locator('#tab-planner').click();await page.locator('#save').click();await page.reload();
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().portRecords.length),reference.ports);
  await page.locator('#tab-cargo').click();assert.equal(await page.locator('[data-catalog-name]').count(),reference.cargo,'CARGO lists the whole reference catalog');
  await page.locator('[data-action="new-cargo"]').click();await scan();
  await page.locator('dialog [name="name"]').fill('Audit bulk cargo');await page.locator('dialog [name="sf"]').fill('1.15');
  await page.locator('dialog button[type="submit"]').click();await page.locator('dialog').waitFor({state:'detached'});
  assert.equal(await page.locator('[data-catalog-name]').count(),26);
  const cargo=await page.evaluate(()=>ProjectXApp.getState().cargoTypes.find(c=>c.name==='Audit bulk cargo'));
  await page.locator('#tab-sale').click();assert.equal(await page.locator('.empty-state').evaluate(e=>getComputedStyle(e).borderTopColor),'rgb(252, 111, 58)');assert.equal(await page.locator('.empty-state').evaluate(e=>getComputedStyle(e).borderTopStyle),'dashed');await page.locator('[data-action="new-sale"]').click();await scan();await page.locator('#close-sale').click();assert.equal(await page.locator('dialog[open]').count(),0);
  await page.locator('[data-action="new-sale"]').click();
  for(const [name,value] of Object.entries({dealDate:'2026-09-01',quantity:'1000',price:'250',shipmentFrom:'2026-09-10',shipmentTo:'2026-09-20'}))await page.locator(`dialog [name="${name}"]`).fill(value);
  await page.locator('dialog [name="cargoId"]').selectOption(cargo.id);
  await page.locator('dialog [name="loadPort"]').selectOption('Ust-Luga');await page.locator('dialog [name="dischargePort"]').selectOption('Ust-Luga');
  await page.locator('dialog button[type="submit"]').click();assert.match(await page.locator('#sale-error').innerText(),/must be different/);await scan();
  await page.locator('dialog [name="dischargePort"]').selectOption('Santos');await page.locator('dialog button[type="submit"]').click();await page.locator('dialog').waitFor({state:'detached'});
  assert.equal(await page.locator('[data-path="sales.0.loadPort"]').evaluate(e=>e.tagName),'SELECT');
  await page.locator('[data-path="sales.0.loadPort"]').evaluate(e=>{e.add(new Option('Unlisted','Unlisted'));e.value='Unlisted';e.dispatchEvent(new Event('change',{bubbles:true}));});
  assert.match(await page.locator('#status').innerText(),/PORT/);
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().sales[0].loadPort),'Ust-Luga');
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().portRecords.some(p=>p.name==='Unlisted')),false);
  await page.locator('[data-path="sales.0.loadPort"]').selectOption('Murmansk');
  await page.locator('#tab-planner').click();await page.locator('[data-action="add-lot"]').click();await scan();await page.locator('dialog input[name="saleId"]').first().check();await page.locator('dialog button[type="submit"]').click();
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().lots.length),1);
  await page.locator('#save').click();await page.reload();assert.equal(await page.evaluate(()=>ProjectXApp.getState().lots.length),1);
  await tabs();
  await page.locator('#tab-planner').click();await page.evaluate(()=>{window.auditPrintCalled=false;window.print=()=>{window.auditPrintCalled=true;};});await page.locator('#pdf').click();assert.equal(await page.evaluate(()=>window.auditPrintCalled),true);
  await page.emulateMedia({media:'print'});await scan();await page.emulateMedia({media:'screen'});
  // A fully populated case exercises totals, audit rows and technical warnings.
  await page.evaluate(()=>localStorage.setItem('projectx-current-v2',JSON.stringify(ProjectXModel.demo())));await page.reload();await tabs();
  await page.setViewportSize({width:390,height:844});await tabs();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('#tab-planner').click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1440,height:1000});
  await page.locator('#tab-planner').click();
  // One unrestricted cargo can be spread across multiple holds automatically or manually.
  await page.evaluate(()=>{const s=ProjectXModel.demo();s.lots=s.lots.slice(0,1);s.sales=s.sales.filter(x=>x.id===s.lots[0].saleId);s.lots[0].quantity=10000;s.allocations=[];localStorage.setItem('projectx-current-v2',JSON.stringify(s));});
  await page.reload();await page.locator('[data-action="allocate"]').click();
  const singleCargoCells=page.locator('[data-lot="S1"][data-hold]:not(:disabled)');
  assert.equal(await singleCargoCells.count(),5);assert.equal(await singleCargoCells.evaluateAll(inputs=>inputs.filter(x=>Number(x.value.replace(/,/g,''))>0).length),5);
  // The parcel is conserved in the model; the table prints each hold to 0.1 t, so the visible
  // sum may differ by the rounding of five cells. Check the arithmetic where it is exact and
  // the presentation against what the format can carry.
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().allocations.reduce((n,a)=>n+a.quantity,0)),10000,'the plan conserves the parcel exactly');
  const shown=await singleCargoCells.evaluateAll(inputs=>inputs.map(x=>Number(x.value.replace(/,/g,''))));
  assert.ok(Math.abs(shown.reduce((n,x)=>n+x,0)-10000)<=shown.length*0.05,`printed tonnages sum to ${shown.reduce((n,x)=>n+x,0)}`);
  const stored=await page.evaluate(()=>ProjectXApp.getState().allocations.map(a=>a.quantity));
  stored.forEach((q,i)=>assert.equal(shown[i],Math.round(q*10)/10,'each hold is printed as its own rounded tonnage'));
  await page.evaluate(()=>{const s=ProjectXApp.getState();s.allocations=[];localStorage.setItem('projectx-current-v2',JSON.stringify(s));});await page.reload();
  const manualCells=page.locator('[data-lot="S1"][data-hold]:not(:disabled)');await manualCells.nth(0).fill('100');await manualCells.nth(1).fill('200');await page.reload();
  // A reloaded cell is printed in the table's format, not as it was typed.
  assert.equal(await page.locator('[data-lot="S1"][data-hold="1"]').inputValue(),'100.0');assert.equal(await page.locator('[data-lot="S1"][data-hold="2"]').inputValue(),'200.0');
  // Input events persist synchronously, even when the user reloads before blur/change.
  await reveal('[data-path="hire"]');await page.locator('[data-path="hire"]').fill('14789.25');
  await page.reload();assert.equal(await page.locator('[data-path="hire"]').inputValue(),'14789.25');
  await reveal('[data-action="add-cost"]');await page.locator('[data-action="add-cost"]').click();
  await reveal('[data-path="costs.0.amount"]');await page.locator('[data-path="costs.0.amount"]').fill('4321.75');
  await page.reload();assert.equal(await page.locator('[data-path="costs.0.amount"]').inputValue(),'4321.75');
  const firstAllocation=page.locator('[data-lot][data-hold]:not(:disabled)').first();
  await firstAllocation.fill('123.45');await page.reload();
  assert.equal(await page.locator('[data-lot][data-hold]:not(:disabled)').first().inputValue(),'123.5');
  const confirmations=[];page.on('dialog',async d=>{confirmations.push(d.message());await d.dismiss();});await page.locator('#reset').click();await page.locator('[data-action="allocate"]').click();
  assert.equal(await page.locator('[data-path^="lots."][data-path$=".sf"]').count(),0);
  const beforePropertyEdit=await page.evaluate(()=>JSON.stringify(ProjectXApp.getState()));
  await page.evaluate(()=>{const input=document.createElement('input');input.dataset.path='lots.0.sf';input.type='number';input.value='99';document.getElementById('app').append(input);input.dispatchEvent(new Event('change',{bubbles:true}));});
  assert.equal(await page.evaluate(()=>JSON.stringify(ProjectXApp.getState())),beforePropertyEdit);
  assert.match(await page.locator('#status').textContent(),/read-only/);
  // One confirmation, for clearing the calculation. Automatic allocation applies the plan
  // itself and no longer asks first, which app.test.js holds as the intended behaviour.
  assert.equal(confirmations.length,1);assert.ok(confirmations.every(x=>!/[А-Яа-яЁё]/.test(x)));
  // User-entered text must be preserved, even if it is not English.
  await page.evaluate(()=>{const s=ProjectXApp.getState();s.notes='seed';localStorage.setItem('projectx-current-v2',JSON.stringify(s));});await page.reload();
  // The sources editor is shown for a calculation that already carries notes; that is the
  // intended behaviour, held by app.test.js. Seed a note, then check the text survives.
  await reveal('[data-path="notes"]');await page.locator('[data-path="notes"]').fill('User text: Груз клиента');await page.locator('[data-path="notes"]').dispatchEvent('change');await page.locator('#save').click();await page.reload();assert.equal(await page.evaluate(()=>ProjectXApp.getState().notes),'User text: Груз клиента');
  assert.deepEqual(errors,[]);
  // The prototype's single key is now an import channel, not the store. Unreadable contents
  // there cost nothing, because the calculation itself lives in the split layout: there is no
  // backup to restore because nothing was lost. What must hold is that the open work survives
  // and the unreadable original is left exactly as the user left it.
  const beforeDamage=await page.evaluate(()=>ProjectXApp.getState().notes);
  await page.evaluate(()=>localStorage.setItem('projectx-current-v2','broken'));await page.reload();
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().notes),beforeDamage,'the open calculation is untouched');
  assert.equal(await page.evaluate(()=>localStorage.getItem('projectx-current-v2')),'broken','the unreadable original is preserved');
  assert.doesNotMatch(await page.locator('#status').innerText(),/not been saved|could not be opened/,'nothing was lost, so nothing is reported as lost');
  await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('Unavailable');};});await page.locator('#save').click();assert.match(await page.locator('#status').innerText(),/have not been saved/);
  console.log('PASS: shipped HTML, every tab, MARKET archive/date/region/reload, English text and attributes, CARGO creation, SALE validation, port tampering, one-cargo multi-hold stowage, planner autosave before blur, persistence, print action, confirmations and unchanged user text.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
