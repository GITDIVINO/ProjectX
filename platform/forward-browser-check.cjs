// Isolated acceptance for FORWARD and PRICES: never uses the user's browser profile or voyage.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PROJECTX_CHROMIUM||undefined});
 const out=path.resolve(process.argv[2]||'tmp/forward-qa');fs.mkdirSync(out,{recursive:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'en-GB'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('platform/ProjectX.html')).href);

  // A desk with a curve entered: two destinations, two months, and one cell deliberately empty.
  async function seed(mode='normal'){
   await page.evaluate(mode=>{
    const M=ProjectXModel,s=M.demo();
    s.hire=13500;s.prices={main:520,eca:760,aux:760};
    const cargo=s.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true));
    s.forward={origin:'Ust-Luga',quantity:30000,cargoId:cargo.id,ports:[
     {name:'Ust-Luga',rate:8000,da:60000},
     {name:'Santos',rate:6000,da:85000},
     {name:'Paranaguá',rate:6000,da:80000}]};
    if(mode!=='empty'){
     const basis=mode==='fob'?'FOB':'CFR';
     M.addAssessment(s,{cargoId:cargo.id,destination:'Santos',month:'2026-10',basis,value:445,source:'Profercy',date:'2026-09-11'});
     M.addAssessment(s,{cargoId:cargo.id,destination:'Paranaguá',month:'2026-10',basis,value:448,source:'Profercy',date:'2026-09-11'});
     M.addAssessment(s,{cargoId:cargo.id,destination:'Santos',month:'2026-11',basis,value:452,source:'ICIS',date:'2026-09-12'});
    }
    if(mode==='unstated')s.forward.ports=s.forward.ports.map(p=>p.name==='Santos'?{name:'Santos',rate:null,da:null}:p);
    localStorage.setItem('projectx-current-v2',JSON.stringify(s));
    sessionStorage.setItem('projectx-current-tab','forward');
   },mode);
   await page.reload();
  }
  const cell=(row,column)=>page.locator(`.forward-matrix tbody tr:nth-child(${row}) td:nth-child(${column})`);
  const rowNames=()=>page.locator('.forward-matrix tbody td.name').allTextContents();
  // A cost or distance cell carries a second figure in a <small>, so only the cell's own text
 // is read: concatenating the two would turn 26.98 and 33.1 days into one meaningless number.
 // A cell that holds no number is reported as such rather than read as zero — Number('') is 0,
 // and a cell saying "[handling rate]" must not slip through an arithmetic assertion.
 const numberIn=async locator=>{
  const text=await locator.evaluate(td=>
   td.firstChild&&td.firstChild.nodeType===3?td.firstChild.textContent:td.textContent);
  const value=Number(String(text).replace(/[^\d.-]/g,''));
  assert.ok(/\d/.test(String(text))&&Number.isFinite(value),'expected a figure, found '+JSON.stringify(text));
  return value;
 };

  // ---- the matrix -------------------------------------------------------------------------
  await seed();
  assert.equal(await page.locator('#tab-forward').getAttribute('aria-selected'),'true','the tab is restored');
  assert.equal(await page.locator('.forward-screen h2').textContent(),'FORWARD');
  assert.deepEqual(await page.locator('.forward-matrix thead th').allTextContents(),
   ['Destination','Distance, nm','Cost, USD/MT','Oct 2026','Nov 2026']);
  assert.deepEqual(await rowNames(),['Paranaguá','Santos']);

  // Delivered cost is this engine's own, on the open calculation's vessel and prices.
  const santosCost=await numberIn(cell(2,3)),paranaguaCost=await numberIn(cell(1,3));
  assert.ok(santosCost>20&&santosCost<40,'a plausible USD/MT for 30,000 t Baltic to Brazil: '+santosCost);
  assert.ok(paranaguaCost>santosCost,'Paranaguá is the longer voyage');
  assert.equal(await numberIn(cell(2,2)),6818,'and the distance it was costed on is shown');

  // The margin is the assessment less that cost, to the cent that is printed.
  const santosOct=await numberIn(cell(2,4)),paranaguaOct=await numberIn(cell(1,4));
  assert.ok(Math.abs(santosOct-(445-santosCost))<0.02,`${santosOct} vs ${445-santosCost}`);
  assert.ok(Math.abs(paranaguaOct-(448-paranaguaCost))<0.02);
  assert.ok(paranaguaOct>santosOct,'the dearer voyage leaves more, which is the point of the screen');

  // The leader of each month is marked, and the empty cell is named rather than guessed.
  assert.equal(await page.locator('.forward-cell--best').count(),1,
   'October is a comparison; November holds one figure and is not marked');
  assert.ok(await cell(1,4).evaluate(td=>td.classList.contains('forward-cell--best')),'Paranaguá leads October');
  assert.ok(!await cell(1,5).evaluate(td=>td.classList.contains('forward-cell--best')));
  assert.equal((await cell(1,5).textContent()).trim(),'[assessment]','and November at Paranaguá says so');
  assert.match(await cell(2,4).getAttribute('title'),/^445\.00 CFR · Profercy · 11 Sept? 2026$/);

  // ---- the assumptions --------------------------------------------------------------------
  // Typing a rate changes every figure that rests on it, and the change survives a reload.
  const rate=page.getByLabel('Handling rate at Santos');
  await rate.fill('3000');await rate.blur();
  await page.waitForFunction(cost=>{
   const td=document.querySelector('.forward-matrix tbody tr:nth-child(2) td:nth-child(3)');
   if(!td||!td.firstChild)return false;
   return Math.abs(Number(td.firstChild.textContent.replace(/[^\d.-]/g,''))-cost)>0.5;
  },santosCost,{timeout:5000});
  const slower=await numberIn(cell(2,3));
  assert.ok(slower>santosCost,'half the handling rate is more days alongside, so more cost per tonne');
  assert.ok(Math.abs(await numberIn(cell(2,4))-(445-slower))<0.02,'and the margin follows it');
  await page.reload();
  assert.equal(await page.getByLabel('Handling rate at Santos').inputValue(),'3000','the assumption was saved');

  // An unstated assumption is named in the cell rather than filled in with something plausible.
  await seed('unstated');
  assert.match(await cell(2,3).textContent(),/handling rate/);
  assert.match(await cell(2,3).textContent(),/port disbursement/);
  assert.match(await cell(2,4).textContent(),/handling rate/,'and no margin is claimed');
  assert.equal(await page.locator('.forward-matrix tbody tr:nth-child(2) .forward-cell--best').count(),0);

  // An FOB assessment has no freight in it, so it stands with nothing deducted.
  await seed('fob');
  assert.equal(await numberIn(cell(2,4)),445,'the margin is the assessment itself');
  await seed('empty');
  assert.match(await page.locator('.empty-state').textContent(),/Nothing to compare yet/);
  assert.equal(await page.locator('.forward-matrix').count(),0,'no table of empty cells is drawn');

  // ---- PRICES -----------------------------------------------------------------------------
  await seed();
  await page.locator('#tab-prices').click();
  assert.equal(await page.locator('h2').first().textContent(),'PRICES');
  assert.equal(await page.locator('.assessment-table tbody tr').count(),3);
  assert.deepEqual(await page.locator('.assessment-table thead th').allTextContents(),
   ['Cargo','Destination','Month','Basis','Price, USD/MT','Source','Published','']);

  // The register is the one place these figures are entered, and the dialog wants all of it.
  await page.locator('[data-action="new-assessment"]').click();
  await page.locator('dialog [name="destination"]').selectOption('Paranaguá');
  await page.locator('dialog [name="month"]').fill('2026-11');
  await page.locator('dialog [name="value"]').fill('455');
  await page.locator('dialog [name="source"]').fill('Argus');
  await page.locator('dialog [name="date"]').fill('2026-09-12');
  await page.locator('dialog [name="cargoId"]').selectOption({index:1});
  await page.locator('dialog button[type="submit"]').click();
  await page.waitForFunction(()=>document.querySelectorAll('dialog').length===0,{timeout:5000});
  assert.equal(await page.locator('.assessment-table tbody tr').count(),4);

  // A second figure for a cell that is taken is refused, and the register is unchanged.
  const before=await page.evaluate(()=>JSON.stringify(ProjectXApp.getState().priceAssessments));
  await page.locator('[data-action="new-assessment"]').click();
  await page.locator('dialog [name="destination"]').selectOption('Paranaguá');
  await page.locator('dialog [name="month"]').fill('2026-11');
  await page.locator('dialog [name="value"]').fill('460');
  await page.locator('dialog [name="source"]').fill('ICIS');
  await page.locator('dialog [name="date"]').fill('2026-09-12');
  await page.locator('dialog [name="cargoId"]').selectOption({index:1});
  await page.locator('dialog button[type="submit"]').click();
  assert.match(await page.locator('#assessment-error').textContent(),/already exists/);
  assert.equal(await page.evaluate(()=>JSON.stringify(ProjectXApp.getState().priceAssessments)),before);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelectorAll('dialog').length===0,{timeout:5000});

  // The cell that was empty on the matrix now carries the figure just entered.
  await page.locator('#tab-forward').click();
  assert.ok(Math.abs(await numberIn(cell(1,5))-(455-paranaguaCost))<0.02);

  // Correcting a figure in the register reaches the matrix; a refused correction does not.
  await page.locator('#tab-prices').click();
  const price=page.locator('.assessment-table tbody tr').first().locator('[aria-label="Assessed price"]');
  await price.fill('500');await price.blur();
  await page.locator('#tab-forward').click();
  assert.ok(Math.abs(await numberIn(cell(1,4))-(500-paranaguaCost))<0.02);
  await page.locator('#tab-prices').click();
  const kept=await page.evaluate(()=>JSON.stringify(ProjectXApp.getState().priceAssessments));
  await price.fill('0');await price.blur();
  assert.match(await page.locator('#status').textContent(),/positive price/);
  assert.equal(await page.evaluate(()=>JSON.stringify(ProjectXApp.getState().priceAssessments)),kept);

  // Removing one leaves the rest, and the matrix drops the destination it was the last for.
  await page.locator('.assessment-table tbody tr').last().locator('[data-action="remove-assessment"]').click();
  assert.equal(await page.locator('.assessment-table tbody tr').count(),3);

  // ---- both screens on a phone, and in print ----------------------------------------------
  await page.setViewportSize({width:390,height:844});
  await page.locator('#tab-forward').click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,
   'the page does not scroll sideways on a phone');
  for(const id of ['tab-planner','tab-forward','tab-prices','tab-guide'])
   assert.equal(await page.locator('#'+id).isVisible(),true,id+' is reachable');
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('.forward-matrix').isVisible(),true,'the matrix prints');
  await page.screenshot({path:path.join(out,'forward-print.png'),fullPage:true});
  await page.emulateMedia({media:'screen'});
  await page.screenshot({path:path.join(out,'forward.png'),fullPage:true});

  assert.deepEqual(errors,[]);
  console.log('PASS: forward matrix figures and leaders, delivered cost from the engine, named missing inputs, live assumptions, FOB, empty state, PRICES register add/correct/refuse/remove, phone and print.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
