// Isolated UI acceptance for the collapsible voyage map and quiet incomplete state.
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),{chromium}=require('playwright');
const artifact=path.resolve(process.argv[2]||path.join(__dirname,'ProjectX.html'));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(artifact).href);
  await page.evaluate(()=>{const s=ProjectXModel.demo();s.hire=null;localStorage.setItem('projectx-current-v2',JSON.stringify(s));});
  await page.reload();
  const panel=page.locator('#voyage-map'),summary=panel.locator('summary'),svg=panel.locator('svg');
  assert.equal(await panel.evaluate(el=>el.open),false);
  assert.equal(await svg.isVisible(),false);
  const body=await page.locator('body').innerText();
  for(const gone of ['The chain appears once','Complete the following','Vessel cost model · recalculated'])assert.ok(!body.includes(gone));
  assert.equal(await page.locator('#missing').count(),0);
  assert.equal(await page.evaluate(()=>ProjectXApp.getResult().budget),null);
  assert.ok(await page.evaluate(()=>ProjectXApp.getResult().errors.includes('Hire rate')));
  assert.ok(await page.locator('.sea-distances').isVisible());
  const before=await page.evaluate(()=>JSON.stringify(ProjectXApp.getState()));
  await summary.focus();await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('#voyage-map').open);
  async function fitted(){
   await page.waitForFunction(()=>{const s=document.querySelector('#voyage-map svg'),r=s.getBoundingClientRect(),v=s.viewBox.baseVal;return r.width>0&&r.height>0&&Math.abs(v.width/v.height-r.width/r.height)<.02;});
  }
  await fitted();assert.ok(await svg.isVisible());
  const originalBox=await svg.getAttribute('viewBox');
  await page.getByRole('button',{name:'Zoom in',exact:true}).click();
  const zoomedBox=await svg.getAttribute('viewBox');assert.notEqual(zoomedBox,originalBox);
  await summary.click();assert.equal(await svg.isVisible(),false);
  await summary.focus();await page.keyboard.press('Space');
  await page.waitForFunction(()=>document.querySelector('#voyage-map').open);
  assert.equal(await svg.getAttribute('viewBox'),zoomedBox);
  assert.equal(await page.evaluate(()=>JSON.stringify(ProjectXApp.getState())),before,'folding and zooming do not alter the voyage');
  await page.locator('[data-path="hire"]').fill('12000');
  await page.locator('[data-path="hire"]').blur();
  assert.equal(await panel.evaluate(el=>el.open),true,'normal recalculation preserves the open panel');
  assert.ok(await page.locator('.voyage-chain').isVisible());
  await page.setViewportSize({width:390,height:844});await fitted();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('button',{name:'Fit the voyage',exact:true}).click();await fitted();
  await summary.click();
  await page.locator('[data-path="hire"]').fill('13000');await page.locator('[data-path="hire"]').blur();
  assert.equal(await panel.evaluate(el=>el.open),false,'recalculation also preserves the closed panel');
  await page.reload();assert.equal(await panel.evaluate(el=>el.open),false);
  await page.evaluate(()=>localStorage.setItem('projectx-current-v2',JSON.stringify(ProjectXModel.initial())));
  await page.reload();await summary.click();
  assert.ok(await panel.locator('.voyage-map-empty').isVisible());
  assert.deepEqual(errors,[]);
  console.log('PASS: closed default, mouse/keyboard toggles, frame fitting, zoom/Fit, open/closed state through recalculation, reload, mobile, empty voyage and missing-hire validation.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
