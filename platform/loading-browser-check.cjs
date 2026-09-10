// Isolated offline acceptance: fixtures never touch the user's browser profile or voyage.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PROJECTX_CHROMIUM||undefined});
 const out=path.resolve(process.argv[2]||'tmp/loading-qa');fs.mkdirSync(out,{recursive:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100},locale:'en-GB'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('platform/ProjectX.html')).href);
  async function seed(mode='forward'){
   await page.evaluate(mode=>{
    const M=ProjectXModel,P=ProjectXPlanning,s=M.demo();
    s.stage='load';s.holds=Array.from({length:5},(_,i)=>({id:i+1,volume:10000,massLimit:null}));
    s.vesselSnapshot={...s.vesselSnapshot,grain:50000,holdData:JSON.parse(JSON.stringify(s.holds))};
    s.lots.forEach((l,i)=>{
     l.quantity=i?4000:6000;l.sf=1;l.group='C';delete l.un;
     Object.assign(s.sales.find(x=>x.id===l.saleId),{quantity:l.quantity,fob:100});
    });
    const rows=mode==='deferred'?[[0,0,2000,2000,2000],[2000,2000,0,0,0]]
     :mode==='uniform'||mode==='incomplete'?[[1200,1200,1200,1200,1200],[800,800,800,800,800]]
     :[[3000,3000,0,0,0],[2000,2000,0,0,0]];
    s.allocations=rows.flatMap((values,i)=>values.flatMap((quantity,j)=>quantity?[{lot:s.lots[i].id,hold:j+1,quantity}]:[]));
    if(mode==='incomplete')s.allocations=s.allocations.filter(a=>!(a.lot==='S2'&&a.hold===1));
    if(mode==='empty'){s.lots=[];s.allocations=[];}
    P.ensure(s);localStorage.setItem('projectx-current-v2',JSON.stringify(s));sessionStorage.setItem('projectx-current-tab','planner');
   },mode);await page.reload();
  }
  const patterns=()=>page.evaluate(()=>ProjectXApp.getPlanningResult().loadingPatterns);
  const allocations=()=>page.evaluate(()=>JSON.stringify(ProjectXApp.getState().allocations));
  const stage=()=>page.locator('[data-path="stage"]');
  const highlighted=()=>page.locator('.hold-review').evaluateAll(els=>els.map(el=>Number(el.dataset.hold)).sort((a,b)=>a-b));
  const expectedHolds=row=>[...new Set(row.issues.flatMap(issue=>issue.holds))].sort((a,b)=>a-b);
  async function expandStates(){const details=page.locator('#loading-pattern-states');if(!await details.getAttribute('open').then(x=>x!==null))await details.locator('summary').click();}
  function stateRow(key){return page.locator('#loading-pattern-states tr').filter({has:page.locator('[data-action="loading-state"][data-id='+JSON.stringify(key)+']')});}
  async function finishMotion(){await page.locator('.cargo-fill').evaluateAll(els=>els.forEach(el=>el.getAnimations().forEach(animation=>animation.finish())));}

  // A recognisable forward concentration is visible in the edit plan and every affected departure.
  await seed();let result=await patterns();assert.equal(result.method,'cargo-pattern-2');assert.equal(result.plan.status,'attention');
  assert.ok(result.plan.issues.some(issue=>issue.code==='end-only-forward'));
  assert.deepEqual(await highlighted(),expectedHolds(result.plan));assert.deepEqual(await highlighted(),[1,2]);
  const firstDeparture=result.states.find(row=>row.call==='Ust-Luga'&&row.phase==='departure');
  assert.equal(firstDeparture.status,'attention');assert.equal(await page.locator('#loading-patterns').isVisible(),true);
  const before=await allocations();await expandStates();assert.ok((await stateRow(firstDeparture.key).innerText()).includes('Departure'));
  await stateRow(firstDeparture.key).locator('[data-action="loading-state"]').click();
  assert.equal(await stage().inputValue(),firstDeparture.key);assert.deepEqual(await highlighted(),[1,2]);
  assert.equal(await allocations(),before,'inspecting a warning must not alter cargo allocations');
  await page.reload();assert.equal(await stage().inputValue(),firstDeparture.key);assert.deepEqual(await highlighted(),[1,2]);
  await stage().selectOption('load');await finishMotion();await page.locator('#stowage-section').screenshot({path:path.join(out,'forward-desktop.png')});

  // The final loading plan can look even while a later discharge leaves a forward block.
  await seed('deferred');result=await patterns();assert.equal(result.plan.status,'no-pattern');assert.deepEqual(await highlighted(),[]);
  const afterDischarge=result.states.find(row=>row.call==='Santos'&&row.phase==='departure');assert.equal(afterDischarge.status,'attention');
  assert.ok(afterDischarge.issues.some(issue=>issue.code==='end-only-forward'));
  assert.equal(await stage().inputValue(),'load');assert.equal(await page.locator('#loading-patterns').isVisible(),true);
  assert.match(await page.locator('#loading-patterns').innerText(),/Santos/,'a later risky state remains apparent in the current edit plan');
  const deferredBefore=await allocations();await expandStates();
  await stateRow(afterDischarge.key).locator('[data-action="loading-state"]').click();
  assert.equal(await stage().inputValue(),afterDischarge.key);assert.deepEqual(await highlighted(),expectedHolds(afterDischarge));
  assert.deepEqual(await highlighted(),[1,2]);assert.equal(await allocations(),deferredBefore);
  await expandStates();assert.equal(await stateRow(afterDischarge.key).getAttribute('aria-current'),'true','the selected voyage state is identifiable');
  await finishMotion();await page.locator('#stowage-section').screenshot({path:path.join(out,'after-discharge-desktop.png')});

  // Distribution evidence remains legible in print even if its on-screen details were closed.
  if(await page.locator('#loading-pattern-states').getAttribute('open')!==null)await page.locator('#loading-pattern-states summary').click();
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('#loading-patterns').isVisible(),true);
  assert.equal(await page.locator('.print-evidence').isVisible(),true);
  assert.equal(await stateRow(afterDischarge.key).isVisible(),true,'the state warning table is included in print');
  assert.match(await stateRow(afterDischarge.key).innerText(),/Departure · Santos/);assert.match(await stateRow(afterDischarge.key).innerText(),/forward|fore/i);
  await page.pdf({path:path.join(out,'loading-patterns.pdf'),format:'A4',printBackground:true});
  await page.emulateMedia({media:'screen'});

  // Narrow screens scroll inside their tables, not the document.
  await page.setViewportSize({width:390,height:844});await expandStates();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no outer horizontal overflow at 390 px');
  await page.locator('#stowage-section').screenshot({path:path.join(out,'after-discharge-mobile.png')});
  await page.setViewportSize({width:1440,height:1100});

  // Live manual input updates warnings without losing the editing element or waiting for blur.
  await seed('forward');const cell=page.locator('input[data-lot="S1"][data-hold="1"]');
  await cell.fill('1200');assert.equal(await cell.inputValue(),'1200');
  assert.equal(await cell.evaluate(el=>el===document.activeElement),true);
  assert.equal((await patterns()).plan.status,'incomplete','a partially reworked plan must not be reported as a clear distribution');
  for(const [lot,mass] of [['S1',1200],['S2',800]])for(let hold=1;hold<=5;hold++)await page.locator('input[data-lot='+JSON.stringify(lot)+'][data-hold="'+hold+'"]').fill(String(mass));
  result=await patterns();assert.equal(result.plan.status,'no-pattern');assert.ok(result.states.every(row=>['no-pattern','empty'].includes(row.status)));
  assert.deepEqual(await highlighted(),[],'amber hold markers are removed immediately when the pattern is resolved');
  assert.match(await page.locator('#loading-patterns').innerText(),/stability.*not calculated|not.*(?:approval|confirm)|not checked|not verified|requires.*(?:technical|vessel)/i,'no pattern is not technical approval');
  const edited=await allocations();await page.reload();assert.equal(await allocations(),edited);assert.equal((await patterns()).plan.status,'no-pattern');
  await page.locator('#loading-patterns').screenshot({path:path.join(out,'uniform-not-approved.png')});

  // Missing tonnage and a zero-cargo state must never acquire an all-clear label.
  await seed('incomplete');result=await patterns();assert.equal(result.plan.status,'incomplete');
  assert.match(await page.locator('#loading-patterns').innerText(),/incomplete|unassigned|missing/i);
  await seed('uniform');result=await patterns();const emptyArrival=result.states.find(row=>row.call==='Ust-Luga'&&row.phase==='arrival');
  assert.equal(emptyArrival.status,'empty');await expandStates();await stateRow(emptyArrival.key).locator('[data-action="loading-state"]').click();
  assert.deepEqual(await highlighted(),[]);assert.match(await page.locator('#loading-patterns').innerText(),/no cargo|empty/i);
  await seed('empty');assert.equal((await patterns()).plan.status,'empty');assert.deepEqual(await highlighted(),[]);
  assert.doesNotMatch(await page.locator('#loading-patterns').innerText(),/stable|approved|no listed pattern/i,'an empty planner must not imply a technical or pattern all-clear');
  assert.deepEqual(errors,[]);
  console.log('PASS: cargo distribution — forward concentration, every voyage state, later discharge warning in edit plan, exact hold highlighting, read-only navigation/reload, live manual edits, incomplete/empty/no-pattern states without technical approval, desktop/mobile and print evidence.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
