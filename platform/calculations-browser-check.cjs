// Named calculations in the built page: the picker, what is shared between them and what is
// not, and that each keeps its own figures across a switch and a reload.
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),{chromium}=require('playwright');
const artifact=path.resolve(process.argv[2]||path.join(__dirname,'ProjectX.html'));

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({locale:'en-GB',viewport:{width:1440,height:1000}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));

  let answer='Santos option';
  page.on('dialog',async d=>{await d.accept(d.type()==='prompt'?answer:undefined);});

  const reveal=selector=>page.evaluate(s=>{for(let n=document.querySelector(s);n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;},selector);
  const ready=()=>page.evaluate(()=>ProjectXApp.ready);
  const names=()=>page.locator('#calculation option').allTextContents();
  const ids=()=>page.locator('#calculation option').evaluateAll(o=>o.map(x=>x.value));
  const open=()=>page.evaluate(()=>ProjectXApp.getCalculation());
  const state=key=>page.evaluate(k=>ProjectXApp.getState()[k],key);
  const settle=()=>page.waitForTimeout(300);

  await page.goto(pathToFileURL(artifact).href);
  await ready();

  // A blank workspace still opens with somewhere to write.
  assert.equal((await names()).length,1,'an empty workspace opens with one calculation');
  assert.ok((await open()).id);

  // A calculation saved by the offline page is taken in, into the calculation already open.
  await page.evaluate(()=>localStorage.setItem('projectx-current-v2',JSON.stringify(ProjectXModel.demo())));
  await page.reload();await ready();
  assert.equal((await names()).length,1,'the import updates the open calculation rather than adding one');
  assert.equal((await state('lots')).length,2,'the imported parcels are there');

  await reveal('[data-path="hire"]');
  await page.locator('[data-path="hire"]').fill('11111');
  await page.locator('[data-path="hire"]').dispatchEvent('change');
  await settle();

  // A second calculation starts empty, but on the same registers.
  const sharedCargo=(await state('cargoTypes')).length;
  await page.locator('#new-calculation').click();await settle();
  assert.deepEqual(await names(),['Calculation 1','Santos option']);
  assert.equal((await state('lots')).length,0,'a new calculation starts with no parcels');
  assert.equal((await state('cargoTypes')).length,sharedCargo,'and with the organisation catalog already in place');
  assert.equal((await open()).name,'Santos option');

  // Each keeps its own figures.
  const [first,second]=await ids();
  await page.selectOption('#calculation',first);await settle();
  assert.equal(await state('hire'),11111,'the first calculation kept its hire');
  assert.equal((await state('lots')).length,2);

  await page.selectOption('#calculation',second);await settle();
  assert.equal((await state('lots')).length,0,'and the second kept its own emptiness');

  // A reload comes back to the calculation that was open.
  await page.reload();await ready();
  assert.equal((await open()).id,second,'the page reopens what was last open');
  assert.equal((await names()).length,2);

  // Renaming keeps the same calculation; the name is the user's text.
  answer='Paranagua <option> option';
  await page.locator('#rename-calculation').click();await settle();
  assert.equal((await open()).name,'Paranagua <option> option');
  assert.ok((await names()).includes('Paranagua <option> option'),'the name is shown as written');
  assert.equal((await ids()).length,2,'renaming does not create another calculation');

  // The last calculation cannot be deleted out from under the user.
  await page.locator('#delete-calculation').click();await settle();
  assert.equal((await names()).length,1);
  await page.locator('#delete-calculation').click();await settle();
  assert.equal((await names()).length,1,'the only calculation is kept');
  assert.match(await page.locator('#status').innerText(),/only calculation/);

  assert.deepEqual(errors,[]);
  console.log('PASS: calculations browser — blank workspace, import into the open calculation, shared registers with separate voyages, switching, reload, rename with escaped text and the last calculation kept.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
