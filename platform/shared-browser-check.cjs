// The shared path in the built page, without a Supabase project.
//
// A stand-in client is installed before the page's own scripts run, so the application takes
// exactly the route it takes against a real deployment: configuration present, client present,
// nobody signed in. What it cannot prove is that a real Supabase accepts these queries and
// that the row-level policies behave as written — only a live project can show that.
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),{chromium}=require('playwright');
const artifact=path.resolve(process.argv[2]||path.join(__dirname,'ProjectX.html'));

// Runs inside the page. An in-memory stand-in for supabase-js: the same builder chain, the
// same {data,error} envelope, and revisions that behave the way Postgres would under the
// update ... where revision = <read> rule.
function installStandIn(){
 const tables={catalogs:[],sales:[],voyages:[],voyage_snapshots:[],
  memberships:[{org_id:'org-1',role:'member',organisations:{id:'org-1',name:'Exporter'}}]};
 let user=null,sent=[];
 let sequence=0;
 const nextId=()=>'row-'+(++sequence);

 function builder(table){
  const q={table,op:'select',filters:[],payload:null,single:false};
  const chain={
   select(){return chain;},
   insert(row){q.op='insert';q.payload=row;return chain;},
   update(row){q.op='update';q.payload=row;return chain;},
   delete(){q.op='delete';return chain;},
   eq(column,value){q.filters.push([column,value]);return chain;},
   order(){return chain;},
   maybeSingle(){q.single=true;return chain;},
   then(resolve,reject){return Promise.resolve().then(()=>run(q)).then(resolve,reject);}
  };
  return chain;
 }
 const matches=(row,filters)=>filters.every(([c,v])=>row[c]===v);
 function run(q){
  if(!user)return {data:null,error:{message:'JWT expired or missing'}};
  const rows=tables[q.table]||(tables[q.table]=[]);
  if(q.op==='insert'){
   const row={id:q.payload.id||nextId(),updated_at:new Date().toISOString(),...q.payload};
   rows.push(row);
   return {data:q.single?row:[row],error:null};
  }
  const hit=rows.filter(r=>matches(r,q.filters));
  if(q.op==='update'){
   hit.forEach(r=>Object.assign(r,q.payload,{updated_at:new Date().toISOString()}));
   return {data:q.single?(hit[0]||null):hit,error:null};
  }
  if(q.op==='delete'){tables[q.table]=rows.filter(r=>!matches(r,q.filters));return {data:null,error:null};}
  return {data:q.single?(hit[0]||null):hit,error:null};
 }

 window.__standIn={tables,sentTo:()=>sent};
 window.supabase={createClient:()=>({
  from:builder,
  auth:{
   getUser:async()=>({data:{user},error:null}),
   signInWithOtp:async({email})=>{sent.push(email);return {error:null};},
   verifyOtp:async({email,token})=>{
    if(token!=='123456')return {data:null,error:{message:'Token has expired or is invalid'}};
    user={id:'user-1',email};
    return {data:{user},error:null};
   },
   signOut:async()=>{user=null;return {error:null};},
   onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})
  }
 })};
 window.PROJECTX_CONFIG={supabaseUrl:'https://stand-in.supabase.co',supabaseAnonKey:'anon-stand-in'};
}

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({locale:'en-GB',viewport:{width:1440,height:1000}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(installStandIn);
  await page.goto(pathToFileURL(artifact).href);
  await page.evaluate(()=>ProjectXApp.ready);

  // Nobody is signed in: the planner is not on screen at all.
  assert.equal(await page.evaluate(()=>ProjectXApp.isShared),true,'the shared adapter was selected from the configuration');
  assert.equal(await page.evaluate(()=>ProjectXApp.storageKind),'supabase');
  assert.equal(await page.locator('#sign-in-form').count(),1,'the sign-in form is shown');
  assert.equal(await page.locator('#planner-actions').evaluate(el=>el.hidden),true,'calculation controls are hidden');
  assert.equal(await page.locator('.workspace-tabs').evaluate(el=>el.hidden),true,'the tab strip is hidden');
  assert.equal(await page.evaluate(()=>ProjectXApp.getAccount()),null);
  assert.ok(!(await page.locator('#app').textContent()).includes('PLANNER'),'no planner chrome over data that was never read');

  // A password is never asked for.
  assert.equal(await page.locator('input[type="password"]').count(),0,'no password field anywhere on the sign-in screen');

  // A wrong code is refused and changes nothing.
  await page.locator('#sign-in-email').fill('planner@example.com');
  await page.locator('#sign-in-send').click();
  await page.waitForFunction(()=>document.getElementById('sign-in-message').textContent.includes('sent to'));
  assert.deepEqual(await page.evaluate(()=>window.__standIn.sentTo()),['planner@example.com']);

  await page.locator('#sign-in-code').fill('000000');
  await page.locator('#sign-in-verify').click();
  await page.waitForFunction(()=>document.getElementById('sign-in-message').textContent.includes('expired or is invalid'));
  assert.equal(await page.locator('#sign-in-form').count(),1,'still on the sign-in screen');
  assert.equal(await page.evaluate(()=>ProjectXApp.getAccount()),null);

  // The right code opens the organisation's workspace.
  await page.locator('#sign-in-code').fill('123456');
  await page.locator('#sign-in-verify').click();
  await page.waitForSelector('#planner-actions:not([hidden])',{timeout:10000});
  const account=await page.evaluate(()=>ProjectXApp.getAccount());
  assert.deepEqual(account,{email:'planner@example.com',organisation:'Exporter'},'the organisation came from membership');
  assert.match(await page.locator('#status').innerText(),/Signed in as planner@example.com/);

  // A first calculation exists and the registers were written to the database, not a browser key.
  assert.equal((await page.locator('#calculation option').allTextContents()).length,1);
  const stored=await page.evaluate(()=>({
   voyages:window.__standIn.tables.voyages.length,
   catalogs:window.__standIn.tables.catalogs.length,
   cargo:(window.__standIn.tables.catalogs[0]?.document?.cargoTypes||[]).length,
   orgOnVoyage:window.__standIn.tables.voyages[0]?.org_id
  }));
  assert.equal(stored.voyages,1,'the calculation is a row in the database');
  assert.equal(stored.catalogs,1,'the shared registers are stored once');
  assert.ok(stored.cargo>0,'and they carry the reference cargo register');
  assert.equal(stored.orgOnVoyage,'org-1','rows are written under the organisation that was resolved');

  // An edit reaches the database rather than a local key.
  await page.evaluate(()=>{for(let n=document.querySelector('[data-path="hire"]');n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;});
  await page.locator('[data-path="hire"]').fill('14250');
  await page.locator('[data-path="hire"]').dispatchEvent('change');
  await page.waitForFunction(()=>window.__standIn.tables.voyages[0]?.document?.hire===14250,{timeout:10000});
  const revision=await page.evaluate(()=>window.__standIn.tables.voyages[0].revision);
  assert.ok(revision>1,'the stored revision moved with the write');

  // A second calculation is a second row, on the same stored registers.
  page.on('dialog',async d=>{await d.accept(d.type()==='prompt'?'Santos option':undefined);});
  await page.locator('#new-calculation').click();
  await page.waitForFunction(()=>window.__standIn.tables.voyages.length===2,{timeout:10000});
  assert.equal(await page.evaluate(()=>window.__standIn.tables.catalogs.length),1,'the registers are still stored once for the organisation');

  // Nothing of substance was kept in the browser: no calculation blob under the old key.
  assert.equal(await page.evaluate(()=>localStorage.getItem('projectx-current-v2')),null,
   'the shared deployment does not write the prototype key');

  // Signing out puts the form back and takes the workspace off screen.
  await page.evaluate(()=>ProjectXApp.signOut());
  await page.waitForSelector('#sign-in-form');
  assert.equal(await page.evaluate(()=>ProjectXApp.getAccount()),null);
  assert.equal(await page.locator('.workspace-tabs').evaluate(el=>el.hidden),true);

  assert.deepEqual(errors,[]);
  console.log('PASS: shared browser — sign-in gate with no password field, code refused and accepted, organisation from membership, calculations and registers stored as rows, edits reaching the database, second calculation on one catalog, and sign-out.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
