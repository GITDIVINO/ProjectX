// Isolated acceptance for ADMIN: never uses the user's browser profile or voyage.
//
// The real function that issues a login holds the service key and cannot run here, so the
// Supabase client is a stand-in: it records what the page asked for and answers as the
// deployed function would. What this proves is the page's half — who sees the screen, what it
// sends, what it does with a refusal — not the function's own checks, which are its to keep.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url'),{chromium}=require('playwright');

const artifact=path.resolve('platform/ProjectX.html');

function installStandIn(role){
 let user=null;
 const calls=[];
 const logins=[
  {id:'user-1',username:'aldivino',name:'Alexander Pikul',title:'Owner',role:'owner',
   createdAt:'2026-09-01T10:00:00Z',lastSignInAt:'2026-09-12T08:00:00Z',self:true},
  {id:'user-2',username:'trader',name:'A Trader',title:'Trader',role:'member',
   createdAt:'2026-09-10T10:00:00Z',lastSignInAt:null,self:false}
 ];
 const tables={
  organisations:[{id:'org-1',name:'ProjectX'}],
  memberships:[{org_id:'org-1',role,organisations:{id:'org-1',name:'ProjectX'}}],
  organisation_members:[],catalogs:[],sales:[],voyages:[],voyage_register:[],
  cargo_types:[],port_records:[],vessel_profiles:[],price_assessments:[],voyage_snapshots:[],
  profiles:[{user_id:'user-1',display_name:'Alexander Pikul',job_title:'Owner',username:'aldivino'}]
 };
 const builder=table=>{
  const state={table,op:'select',rows:[],filters:[],single:false};
  const api={
   select(){state.op=state.op==='select'?'select':state.op;return api;},
   insert(rows){state.op='insert';state.rows=[].concat(rows);return api;},
   update(row){state.op='update';state.rows=[row];return api;},
   delete(){state.op='delete';return api;},
   eq(column,value){state.filters.push([column,value]);return api;},
   order(){return api;},maybeSingle(){state.single=true;return api;},
   then(resolve){return Promise.resolve(run()).then(resolve);}
  };
  const match=row=>state.filters.every(([c,v])=>row[c]===v);
  function run(){
   const rows=tables[state.table]||[];
   if(state.op==='insert'){tables[state.table]=rows.concat(state.rows);return {data:state.rows,error:null};}
   if(state.op==='update'){
    const hit=rows.filter(match);hit.forEach(row=>Object.assign(row,state.rows[0]));
    return {data:state.single?(hit[0]||null):hit,error:null};
   }
   if(state.op==='delete'){tables[state.table]=rows.filter(row=>!match(row));return {data:null,error:null};}
   const hit=rows.filter(match);
   return {data:state.single?(hit[0]||null):hit,error:null};
  }
  return api;
 };
 window.__standIn={calls:()=>calls,logins:()=>logins};
 window.supabase={createClient:()=>({
  from:builder,
  auth:{
   getUser:async()=>({data:{user},error:null}),
   signInWithPassword:async({email,password})=>{
    if(password!=='correct-horse')return {data:null,error:{message:'Invalid login credentials'}};
    user={id:'user-1',email};
    return {data:{user},error:null};
   },
   signOut:async()=>{user=null;return {error:null};},
   onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})
  },
  // The deployed function, standing in. It answers the way the real one does, including its
  // refusals, so the page can be held to what it does with them.
  functions:{invoke:async(name,{body})=>{
   calls.push([name,body]);
   if(body.action==='list')return {data:{ok:true,logins},error:null};
   if(body.action==='create'){
    if(logins.some(l=>l.username===body.username))
     return {data:null,error:{message:'Edge Function returned a non-2xx status code',
      context:{json:async()=>({ok:false,error:'The login "'+body.username+'" is taken'})}}};
    logins.push({id:'user-'+(logins.length+1),username:body.username,name:body.name,
     title:body.title,role:body.role,createdAt:'2026-09-12T00:00:00Z',lastSignInAt:null,self:false});
    return {data:{ok:true,id:'user-'+logins.length,username:body.username},error:null};
   }
   if(body.action==='password')return {data:{ok:true,id:body.userId},error:null};
   if(body.action==='role'){
    const row=logins.find(l=>l.id===body.userId);if(row)row.role=body.role;
    return {data:{ok:true,id:body.userId,role:body.role},error:null};
   }
   if(body.action==='remove'){
    const at=logins.findIndex(l=>l.id===body.userId);if(at>=0)logins.splice(at,1);
    return {data:{ok:true,id:body.userId},error:null};
   }
   return {data:{ok:false,error:'Unknown action'},error:null};
  }}
 })};
 window.PROJECTX_CONFIG={supabaseUrl:'https://stand-in.supabase.co',supabaseAnonKey:'anon-stand-in'};
}

(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PROJECTX_CHROMIUM||undefined});
 const out=path.resolve(process.argv[2]||'tmp/admin-qa');fs.mkdirSync(out,{recursive:true});
 try{
  const context=await browser.newContext({locale:'en-GB',viewport:{width:1440,height:1000}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(installStandIn,'owner');
  await page.goto(pathToFileURL(artifact).href);
  await page.evaluate(()=>ProjectXApp.ready);

  // Signing in as the owner, by login.
  await page.locator('#sign-in-login').fill('aldivino');
  await page.locator('#sign-in-password').fill('correct-horse');
  await page.locator('#sign-in-submit').click();
  await page.waitForSelector('#planner-actions:not([hidden])',{timeout:10000});
  assert.equal((await page.evaluate(()=>ProjectXApp.getAccount())).role,'owner');
  assert.equal(await page.locator('#tab-admin').evaluate(el=>el.hidden),false,'the owner has the tab');

  // The screen lists who can sign in.
  await page.locator('#tab-admin').click();
  await page.waitForSelector('.login-table',{timeout:5000});
  assert.equal(await page.locator('.login-table .login-row').count(),2);
  assert.deepEqual(await page.locator('.login-table thead th').allTextContents(),
   ['','Login','Name','Job title','Role','Added','Last sign-in','']);
  assert.match(await page.locator('.login-table .login-row').first().textContent(),/aldivino/);
  assert.match(await page.locator('.login-table .login-row').first().textContent(),/You/);
  // A login nobody has used is what an owner needs to notice.
  assert.match(await page.locator('.login-table .login-row').nth(1).textContent(),/Never/);
  assert.equal(await page.locator('.notice-inline').count(),1);

  // The owner has no Remove against their own login: an organisation with no owner can issue
  // nothing, including the right back.
  const own=page.locator('.login-table .login-row').first();
  assert.equal(await own.locator('[data-action="remove-login"]').count(),0);
  assert.equal(await own.locator('[data-action="set-login-role"]').count(),0);

  // Issuing one. Every field goes, and the password is masked while it is typed.
  const form=page.locator('#new-login');
  assert.equal(await form.locator('[name="password"]').getAttribute('type'),'password');
  assert.equal(await form.locator('[name="password"]').getAttribute('autocomplete'),'new-password');
  await form.locator('[name="login"]').fill('Kuznetsov');
  await form.locator('[name="password"]').fill('correct-horse-battery');
  await form.locator('[name="name"]').fill('I Kuznetsov');
  await form.locator('[name="title"]').fill('Freight manager');
  await form.locator('[name="role"]').selectOption('member');
  await form.locator('button[type="submit"]').click();
  await page.waitForFunction(()=>document.querySelectorAll('.login-row').length===3,{timeout:5000});
  const created=(await page.evaluate(()=>window.__standIn.calls())).find(c=>c[1].action==='create');
  assert.equal(created[1].username,'kuznetsov','case is folded before it is sent, or one person becomes two');
  assert.equal(created[1].password,'correct-horse-battery');
  assert.equal(created[1].orgId,'org-1','and the organisation travels with it');
  assert.match(await page.locator('#status').textContent(),/Login "kuznetsov" added/);

  // A login that is checked in the page never leaves it.
  const before=(await page.evaluate(()=>window.__standIn.calls())).length;
  await form.locator('[name="login"]').fill('ab');
  await form.locator('[name="password"]').fill('correct-horse-battery');
  await form.locator('[name="name"]').fill('Too Short');
  await form.locator('button[type="submit"]').click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('3 to 32'),{timeout:5000});
  assert.equal((await page.evaluate(()=>window.__standIn.calls())).length,before,
   'the form answered without asking the server');
  await form.locator('[name="login"]').fill('trader');
  await form.locator('button[type="submit"]').click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('is taken'),{timeout:5000});
  assert.equal(await page.locator('.login-table .login-row').count(),3,'a refused login adds nobody');

  // A password is replaced in the opened row, and never shown.
  await page.locator('.login-table .login-row').nth(1).locator('[data-action="expand-login"]').click();
  await page.waitForSelector('.login-editor',{timeout:5000});
  const field=page.locator('.login-editor [name="password"]');
  assert.equal(await field.getAttribute('type'),'password');
  assert.equal(await field.inputValue(),'','nothing is prefilled: the old password is unknowable');
  assert.equal(await field.evaluate(el=>el===document.activeElement),true,'and the cursor is in it');
  await field.fill('another-long-password');
  await page.locator('.login-editor button[type="submit"]').click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('was replaced'),{timeout:5000});
  const reset=(await page.evaluate(()=>window.__standIn.calls())).find(c=>c[1].action==='password');
  assert.equal(reset[1].password,'another-long-password');
  assert.equal(await page.locator('.login-editor').count(),0,'the row closes once it is done');

  // A short password is refused in the page, as it is in the function and in the database.
  await page.locator('.login-table .login-row').nth(1).locator('[data-action="expand-login"]').click();
  await page.locator('.login-editor [name="password"]').fill('123456789');
  await page.locator('.login-editor button[type="submit"]').click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('at least 10'),{timeout:5000});

  // Making somebody an owner, and taking it back.
  await page.locator('.login-table .login-row').nth(1).locator('[data-action="set-login-role"]').click();
  await page.waitForFunction(()=>document.querySelectorAll('.login-row')[1].textContent.includes('Owner'),{timeout:5000});
  const promoted=(await page.evaluate(()=>window.__standIn.calls())).filter(c=>c[1].action==='role');
  assert.equal(promoted[promoted.length-1][1].role,'owner');

  // Removing one is irreversible, so it asks by name and stops if the answer is no.
  page.once('dialog',async d=>{assert.match(d.message(),/Remove the login "trader"/);await d.dismiss();});
  await page.locator('.login-table .login-row').nth(1).locator('[data-action="remove-login"]').click();
  await page.waitForTimeout(200);
  assert.equal(await page.locator('.login-table .login-row').count(),3,'a dismissed question removes nobody');
  page.once('dialog',async d=>{await d.accept();});
  await page.locator('.login-table .login-row').nth(1).locator('[data-action="remove-login"]').click();
  await page.waitForFunction(()=>document.querySelectorAll('.login-row').length===2,{timeout:5000});
  assert.match(await page.locator('#status').textContent(),/Login "trader" removed/);

  // The screen on a phone, and the tab reachable there.
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,
   'the page does not scroll sideways on a phone');
  await page.locator('#tab-admin').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('#tab-admin').isVisible(),true);
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:path.join(out,'admin.png'),fullPage:true});

  // Signing out puts the gate back, and the tab strip with it.
  await page.evaluate(()=>ProjectXApp.signOut());
  await page.waitForSelector('#sign-in-form',{timeout:5000});
  assert.equal(await page.locator('.workspace-tabs').evaluate(el=>el.hidden),true);

  assert.deepEqual(errors,[]);
  console.log('PASS: admin — the owner\'s tab, the list with logins and last sign-in, issuing one with case folded, refusals from the page and from the function, replacing a password without ever showing it, role changes, removal confirmed by name, phone and sign-out.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
