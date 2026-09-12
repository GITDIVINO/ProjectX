// Isolated acceptance: never uses the user's browser profile or saved voyage.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PROJECTX_CHROMIUM||undefined});
 const out=path.resolve(process.argv[2]||'tmp/sales-qa');fs.mkdirSync(out,{recursive:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'en-GB'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('platform/ProjectX.html')).href);
  async function seed(mode='normal'){
   await page.evaluate(mode=>{
    const M=ProjectXModel,s=M.demo();
    s.sales.forEach((x,i)=>Object.assign(x,{dealDate:'2026-09-01',shipmentFrom:i?'2026-09-10':'2026-09-01',shipmentTo:i?'2026-09-20':'2026-09-10',price:100,priceBasis:'FOB'}));
    const base={...s.sales[0],legacyLotId:undefined};
    M.addSale(s,{...base,quantity:2000,loadPort:'Murmansk',shipmentFrom:'2026-09-15',shipmentTo:'2026-09-25'});
    M.addSale(s,{...base,quantity:3000,shipmentFrom:'2026-10-01',shipmentTo:'2026-10-15'});
    s.lots=s.lots.slice(0,1);s.allocations=s.allocations.filter(x=>x.lot===s.lots[0].id);
    if(mode==='invalid')s.sales.find(x=>x.id==='SALE-2').price=-1;
    if(mode==='unknown')Object.assign(s.sales.find(x=>x.id==='SALE-S2'),{shipmentFrom:'',shipmentTo:'',dealDate:'',price:null});
    if(mode==='empty'){s.lots=[];s.sales=[];s.allocations=[];}
    localStorage.setItem('projectx-current-v2',JSON.stringify(s));sessionStorage.setItem('projectx-current-tab','planner');
   },mode);await page.reload();
  }
  const open=()=>page.locator('[data-action="add-lot"]').click();
  const box=id=>page.getByRole('checkbox',{name:'Select '+id,exact:true});
  const visibleIds=()=>page.locator('dialog tbody tr').evaluateAll(rows=>rows.map(r=>r.dataset.saleId));
  await seed();const original=await page.evaluate(()=>JSON.stringify(ProjectXApp.getState()));
  assert.equal(await page.locator('.voyage-sales-table th').nth(2).textContent(),'Quantity, MT');
  assert.equal(await page.locator('.voyage-sales-table th').nth(3).textContent(),'SF, m³/t');
  assert.equal(await page.locator('.voyage-sales-table th small').count(),0);
  assert.match(await page.locator('.voyage-sales-table .shipment-window').textContent(),/01 Sept? 2026.*10 Sept? 2026/);
  await open();assert.equal(await page.locator('#sale-search').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.locator('#sale-add-selected').isDisabled(),true);
  assert.equal(await page.locator('dialog input[name="saleId"]').count(),3);
  assert.equal(await page.locator('dialog tr[data-sale-id="SALE-S1"]').textContent().then(s=>s.includes('In voyage')),true);
  await box('SALE-S2').check();await page.locator('#sale-search').fill('sale-1');assert.deepEqual(await visibleIds(),['SALE-1']);await box('SALE-1').check();
  assert.equal(await page.locator('#sale-add-selected').textContent(),'Add selected (2)');
  await page.locator('#sale-clear-filters').click();assert.equal(await box('SALE-S2').isChecked(),true);
  await page.locator('#sale-load').selectOption('Murmansk');assert.deepEqual(await visibleIds(),['SALE-1']);
  await page.locator('#sale-clear-filters').click();await page.locator('#sale-discharge').selectOption('Paranaguá');assert.deepEqual(await visibleIds(),['SALE-S2']);
  await page.locator('#sale-clear-filters').click();await page.locator('#sale-search').fill('crushed sulphur');assert.deepEqual(await visibleIds(),['SALE-S2']);
  await page.locator('#sale-clear-filters').click();await page.locator('#sale-from').fill('2026-09-20');await page.locator('#sale-to').fill('2026-09-20');await page.locator('#sale-search').focus();
  assert.deepEqual(await visibleIds(),['SALE-S2','SALE-1'],'date filter uses inclusive window overlap');
  await page.locator('#sale-to').fill('2026-09-19');await page.locator('#sale-search').focus();assert.equal(await page.locator('#sale-add-selected').isDisabled(),true);
  await page.locator('#sale-clear-filters').click();assert.equal(await page.locator('#sale-add-selected').textContent(),'Add selected (2)');
  await page.locator('#sale-search').fill('no matching sale');assert.equal(await page.locator('dialog tbody tr').count(),0);assert.match(await page.locator('#sale-picker-results').textContent(),/No sales match/);
  assert.equal(await page.evaluate(()=>JSON.stringify(ProjectXApp.getState())),original,'selection and filtering do not change the voyage');
  await page.locator('#sale-clear-filters').click();await page.locator('dialog').screenshot({path:path.join(out,'picker-desktop.png')});
  await page.locator('#sale-add-selected').click();assert.equal(await page.locator('dialog').count(),0);
  assert.deepEqual(await page.evaluate(()=>ProjectXApp.getState().lots.map(x=>x.saleId)),['SALE-S1','SALE-S2','SALE-1']);
  await page.reload();assert.equal(await page.locator('.voyage-sales-table tbody tr').count(),3);
  await page.locator('[data-action="open-sale"][data-id="SALE-1"]').click();assert.equal(await page.locator('#tab-sale').getAttribute('aria-selected'),'true');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'sale-row-SALE-1');
  await page.locator('#sale-row-SALE-1 input[data-path$=".shipmentTo"]').fill('2026-09-28');await page.locator('#tab-planner').click();
  assert.match(await page.locator('.voyage-sales-table tbody tr').last().textContent(),/28 Sept? 2026/);
  await page.locator('.voyage-sales-table').screenshot({path:path.join(out,'planner-desktop.png')});
  await page.locator('[data-action="parcel-passport"]').first().click();assert.match(await page.locator('dialog').textContent(),/Shipment SF/);await page.keyboard.press('Escape');
  await open();assert.equal(await page.locator('dialog input[name="saleId"]').count(),1,'added sales cannot be added twice');
  await page.locator('#sale-select-visible').check();assert.equal(await box('SALE-2').isChecked(),true);await page.locator('#sale-select-visible').uncheck();assert.equal(await page.locator('#sale-add-selected').isDisabled(),true);
  await page.setViewportSize({width:390,height:844});await page.locator('dialog').screenshot({path:path.join(out,'picker-mobile.png')});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await page.locator('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth),true,'horizontal overflow is inside the table only');
  // Escape closes the dialog and its close handler removes it; those are two turns, so wait
  // for the removal rather than racing it. Asserting immediately made this check flaky.
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelectorAll('dialog').length===0,{timeout:5000});
  assert.equal(await page.locator('[data-action="add-lot"]').evaluate(el=>el===document.activeElement),true,'Escape restores trigger focus');
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.sale-link').first().isVisible(),true);await page.emulateMedia({media:'screen'});
  await seed('invalid');await open();await page.locator('#sale-select-visible').check();
  const before=await page.evaluate(()=>JSON.stringify(ProjectXApp.getState()));await page.locator('#sale-add-selected').click();
  assert.match(await page.locator('#lot-error').textContent(),/non-negative price/);assert.equal(await page.evaluate(()=>JSON.stringify(ProjectXApp.getState())),before,'invalid batch does not partially add valid sales');await page.keyboard.press('Escape');
  await seed('unknown');await open();assert.equal(await page.locator('dialog tr[data-sale-id="SALE-S2"] .shipment-window').textContent(),'—');
  await page.locator('#sale-from').fill('2026-09-01');await page.locator('#sale-search').focus();assert.ok(!(await visibleIds()).includes('SALE-S2'),'unknown windows are not claimed to match the period');await page.keyboard.press('Escape');
  await seed('empty');await open();assert.match(await page.locator('#sale-picker-results').textContent(),/No sales yet/);assert.equal(await page.locator('#sale-add-selected').isDisabled(),true);
  assert.deepEqual(errors,[]);console.log('PASS: sales multi-select, search/port/date filters, persistent selection, atomic addition, duplicate prevention, save/reload, direct SALE focus/edit, passport, single-line headings, desktop/mobile, print and empty states.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
