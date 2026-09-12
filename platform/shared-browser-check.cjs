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
 const PEOPLE=[
  {user_id:'user-1',display_name:'A. Petrov',job_title:'Freight'},
  {user_id:'user-2',display_name:'M. Ivanova',job_title:'Trading'}
 ];
 const tables={catalogs:[],sales:[],cargo_types:[],port_records:[],vessel_profiles:[],
  voyages:[],voyage_snapshots:[],profiles:PEOPLE,
  memberships:[{org_id:'org-1',role:'member',organisations:{id:'org-1',name:'Exporter'}}],
  organisation_members:PEOPLE.map(p=>({org_id:'org-1',user_id:p.user_id,role:'member',
   display_name:p.display_name,job_title:p.job_title}))};
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
  if(q.table==='voyage_register'){
   const named=id=>(PEOPLE.find(p=>p.user_id===id)||{}).display_name;
   const view=tables.voyages.map(v=>({
    id:v.id,org_id:v.org_id,name:v.name,revision:v.revision,catalog_revision:v.catalog_revision,
    created_at:v.created_at,updated_at:v.updated_at,
    responsible_id:v.responsible_id||v.created_by||'user-1',
    responsible_name:named(v.responsible_id||v.created_by||'user-1')||'Unassigned',
    responsible_title:(PEOPLE.find(p=>p.user_id===(v.responsible_id||'user-1'))||{}).job_title,
    created_by_name:named(v.created_by)||'—',updated_by_name:named(v.updated_by)||'—',
    vessel_name:v.document?.vesselSnapshot?.name||null,
    parcels:(v.document?.lots||[]).filter(l=>l.selected).length,
    ports:[...new Set((v.document?.ports||[]).map(p=>p.name))].sort().join(' · ')
   }));
   const hit=view.filter(r=>matches(r,q.filters));
   return {data:q.single?(hit[0]||null):hit,error:null};
  }
  const rows=tables[q.table]||(tables[q.table]=[]);
  if(q.op==='insert'){
   const row={id:q.payload.id||nextId(),updated_at:new Date().toISOString(),
    created_at:new Date().toISOString(),created_by:user?.id,updated_by:user?.id,
    ...(q.table==='voyages'?{responsible_id:user?.id}:{}),...q.payload};
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
   signInWithPassword:async({email,password})=>{
    if(password!=='correct-horse')return {data:null,error:{message:'Invalid login credentials'}};
    user={id:'user-1',email};
    return {data:{user},error:null};
   },
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

  // The password is masked and offered as the browser's current password, never as plain text.
  const passwordField=page.locator('#sign-in-password');
  assert.equal(await passwordField.getAttribute('type'),'password','the password is masked');
  assert.equal(await passwordField.getAttribute('autocomplete'),'current-password');

  // A wrong password is refused and changes nothing.
  await page.locator('#sign-in-email').fill('planner@example.com');
  await passwordField.fill('wrong-password');
  await page.locator('#sign-in-submit').click();
  await page.waitForFunction(()=>document.getElementById('sign-in-message').textContent.includes('Invalid login credentials'));
  assert.equal(await page.locator('#sign-in-form').count(),1,'still on the sign-in screen');
  assert.equal(await page.evaluate(()=>ProjectXApp.getAccount()),null);

  // The code route is still there for a project whose mail is configured. It is folded away,
  // because Supabase's built-in mail is rate-limited and not the way most people will get in.
  assert.equal(await page.locator('details.sign-in-alternative').evaluate(el=>el.open),false,'the code route starts folded');
  await page.locator('details.sign-in-alternative summary').click();
  await page.locator('#sign-in-send').click();
  await page.waitForFunction(()=>document.getElementById('sign-in-message').textContent.includes('sent to'));
  assert.deepEqual(await page.evaluate(()=>window.__standIn.sentTo()),['planner@example.com']);
  await page.locator('#sign-in-code').fill('000000');
  await page.locator('#sign-in-verify').click();
  await page.waitForFunction(()=>document.getElementById('sign-in-message').textContent.includes('expired or is invalid'));

  // The right password opens the organisation's workspace.
  await passwordField.fill('correct-horse');
  await page.locator('#sign-in-submit').click();
  await page.waitForSelector('#planner-actions:not([hidden])',{timeout:10000});
  const account=await page.evaluate(()=>ProjectXApp.getAccount());
  assert.deepEqual(account,{id:'user-1',email:'planner@example.com',organisation:'Exporter',organisationId:'org-1'},
   'the account carries its id as well as its names: the register counts by id, and a name is not an identity');
  assert.match(await page.locator('#status').innerText(),/Signed in as planner@example.com/);

  // A first calculation exists and the registers were written to the database, not a browser key.
  assert.equal((await page.locator('#calculation option').allTextContents()).length,1);
  const stored=await page.evaluate(()=>({
   voyages:window.__standIn.tables.voyages.length,
   cargo:window.__standIn.tables.cargo_types.length,
   ports:window.__standIn.tables.port_records.length,
   vessels:window.__standIn.tables.vessel_profiles.length,
   orgOnVoyage:window.__standIn.tables.voyages[0]?.org_id,
   orgOnCargo:window.__standIn.tables.cargo_types[0]?.org_id,
   catalogHasRegisters:!!window.__standIn.tables.catalogs[0]?.document?.cargoTypes
  }));
  assert.equal(stored.voyages,1,'the calculation is a row in the database');
  // Each reference record is its own row, so two people editing different ones cannot collide.
  assert.ok(stored.cargo>0,'the cargo register is rows');
  assert.ok(stored.ports>0,'so is the port register');
  assert.ok(stored.vessels>0,'and the vessel register');
  assert.equal(stored.catalogHasRegisters,false,'and none of them travel in one document any more');
  assert.equal(stored.orgOnVoyage,'org-1','rows are written under the organisation that was resolved');
  assert.equal(stored.orgOnCargo,'org-1','including the register rows');

  // An edit reaches the database rather than a local key.
  await page.evaluate(()=>{for(let n=document.querySelector('[data-path="hire"]');n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;});
  await page.locator('[data-path="hire"]').fill('14250');
  await page.locator('[data-path="hire"]').dispatchEvent('change');
  await page.waitForFunction(()=>window.__standIn.tables.voyages[0]?.document?.hire===14250,{timeout:10000});
  const revision=await page.evaluate(()=>window.__standIn.tables.voyages[0].revision);
  assert.ok(revision>1,'the stored revision moved with the write');

  // A second calculation is a second row, on the same stored registers.
  page.on('dialog',async d=>{await d.accept(d.type()==='prompt'?'Santos option':undefined);});
  const cargoBefore=await page.evaluate(()=>window.__standIn.tables.cargo_types.length);
  await page.locator('#new-calculation').click();
  await page.waitForFunction(()=>window.__standIn.tables.voyages.length===2,{timeout:10000});
  assert.equal(await page.evaluate(()=>window.__standIn.tables.cargo_types.length),cargoBefore,
   'a second calculation does not duplicate the organisation register');

  // Nothing of substance was kept in the browser: no calculation blob under the old key.
  assert.equal(await page.evaluate(()=>localStorage.getItem('projectx-current-v2')),null,
   'the shared deployment does not write the prototype key');

  // The password went to the client and nowhere else: not into storage, not into app state.
  const leaked=await page.evaluate(()=>{
   const haystack=[...Object.keys(localStorage).map(k=>localStorage.getItem(k)),
                   ...Object.keys(sessionStorage).map(k=>sessionStorage.getItem(k)),
                   JSON.stringify(ProjectXApp.getState()),JSON.stringify(ProjectXApp.getAccount())].join('|');
   return haystack.includes('correct-horse');
  });
  assert.equal(leaked,false,'the password is not written to storage or held in the application state');

  // The register: everything the organisation holds, with the person who answers for it.
  await page.locator('#tab-register').click();
  await page.waitForFunction(()=>document.querySelector('.register-table'),{timeout:10000});
  const register=await page.locator('.register-table tbody tr').count();
  assert.equal(register,2,'both calculations are listed');
  const firstRow=await page.locator('.register-table tbody tr').first().innerText();
  assert.match(firstRow,/A\. Petrov/,'the responsible specialist is named, not shown as an id');
  assert.match(firstRow,/Freight/,'with their role beside them');
  assert.doesNotMatch(firstRow,/user-1/,'no bare identifier reaches the screen');
  assert.match(await page.locator('.section-intro').first().innerText(),/2 calculations · 2 yours/);

  // Handing over changes who answers for it; the register then says so.
  page.removeAllListeners('dialog');
  page.on('dialog',async d=>{await d.accept(d.type()==='prompt'?'2':undefined);});
  await page.locator('[data-action="assign-responsible"]').first().click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('is now with'),{timeout:10000});
  assert.match(await page.locator('#status').innerText(),/is now with M\. Ivanova/);
  await page.waitForFunction(()=>[...document.querySelectorAll('.register-table tbody tr')].some(r=>r.innerText.includes('M. Ivanova')),{timeout:10000});
  assert.match(await page.locator('.section-intro').first().innerText(),/2 calculations · 1 yours/,
   'handing one over leaves one of the two');

  // Opening from the register brings the planner up on that calculation.
  await page.locator('[data-action="open-calculation"]').first().click();
  await page.waitForFunction(()=>document.getElementById('tab-planner').getAttribute('aria-selected')==='true',{timeout:10000});

  // Signing out puts the form back and takes the workspace off screen.
  await page.evaluate(()=>ProjectXApp.signOut());
  await page.waitForSelector('#sign-in-form');
  assert.equal(await page.evaluate(()=>ProjectXApp.getAccount()),null);
  assert.equal(await page.locator('.workspace-tabs').evaluate(el=>el.hidden),true);

  assert.deepEqual(errors,[]);
  console.log('PASS: shared browser — sign-in gate, wrong password refused, wrong code refused, password accepted and never stored, organisation from membership, calculations and registers stored as rows, edits reaching the database, second calculation on one register, the register naming who is responsible, handing over, opening from the register, and sign-out.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
