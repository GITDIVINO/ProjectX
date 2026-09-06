// Run against the actual offline artifact in an isolated Chromium context.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url'),{chromium}=require('playwright');
const artifact=path.resolve(process.argv[2]||path.join(__dirname,'ProjectX.html'));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({locale:'en-GB',viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
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
  async function tabs(){for(const tab of ['planner','sale','cargo','ports','vessel']){await page.locator('#tab-'+tab).click();await page.locator('details').evaluateAll(ds=>ds.forEach(d=>d.open=true));await scan();}}
  await tabs();
  await page.locator('#tab-cargo').click();assert.equal(await page.locator('[data-catalog-name]').count(),25);
  await page.locator('[data-action="new-cargo"]').click();await scan();
  await page.locator('dialog [name="name"]').fill('Audit bulk cargo');await page.locator('dialog [name="sf"]').fill('1.15');
  await page.locator('dialog button[type="submit"]').click();await page.locator('dialog').waitFor({state:'detached'});
  assert.equal(await page.locator('[data-catalog-name]').count(),26);
  const cargo=await page.evaluate(()=>ProjectXApp.getState().cargoTypes.find(c=>c.name==='Audit bulk cargo'));
  await page.locator('#tab-sale').click();await page.locator('[data-action="new-sale"]').click();await scan();await page.locator('#close-sale').click();assert.equal(await page.locator('dialog[open]').count(),0);
  await page.locator('[data-action="new-sale"]').click();
  for(const [name,value] of Object.entries({dealDate:'2026-09-01',quantity:'1000',fob:'250',shipmentFrom:'2026-09-10',shipmentTo:'2026-09-20'}))await page.locator(`dialog [name="${name}"]`).fill(value);
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
  await page.locator('#tab-planner').click();await page.locator('[data-action="add-lot"]').click();await scan();await page.locator('dialog button[type="submit"]').click();
  assert.equal(await page.evaluate(()=>ProjectXApp.getState().lots.length),1);
  await page.locator('#save').click();await page.reload();assert.equal(await page.evaluate(()=>ProjectXApp.getState().lots.length),1);
  await tabs();
  await page.locator('#tab-planner').click();await page.evaluate(()=>{window.auditPrintCalled=false;window.print=()=>{window.auditPrintCalled=true;};});await page.locator('#pdf').click();assert.equal(await page.evaluate(()=>window.auditPrintCalled),true);
  await page.emulateMedia({media:'print'});await scan();await page.emulateMedia({media:'screen'});
  // A fully populated case exercises totals, audit rows and technical warnings.
  await page.evaluate(()=>localStorage.setItem('projectx-current-v2',JSON.stringify(ProjectXModel.demo())));await page.reload();await tabs();
  await page.setViewportSize({width:390,height:844});await tabs();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('#tab-planner').click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1440,height:1000});
  await page.locator('#tab-planner').click();
  const confirmations=[];page.on('dialog',async d=>{confirmations.push(d.message());await d.dismiss();});await page.locator('#reset').click();await page.locator('[data-action="allocate"]').click();
  assert.equal(confirmations.length,2);assert.ok(confirmations.every(x=>!/[А-Яа-яЁё]/.test(x)));
  // User-entered text must be preserved, even if it is not English.
  await page.locator('#notes > summary').click();await page.locator('[data-path="notes"]').fill('User text: Груз клиента');await page.locator('[data-path="notes"]').dispatchEvent('change');await page.locator('#save').click();await page.reload();assert.equal(await page.evaluate(()=>ProjectXApp.getState().notes),'User text: Груз клиента');
  assert.deepEqual(errors,[]);
  await page.evaluate(()=>localStorage.setItem('projectx-current-v2','broken'));await page.reload();assert.match(await page.locator('#status').innerText(),/backup was restored/);assert.equal(await page.evaluate(()=>localStorage.getItem('projectx-current-v2')),'broken');
  await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('Unavailable');};});await page.locator('#save').click();assert.match(await page.locator('#status').innerText(),/have not been saved/);
  console.log('PASS: shipped HTML, five tabs, English text and attributes, CARGO creation, SALE validation, port tampering, planner, persistence, print action, confirmations and unchanged user text.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
