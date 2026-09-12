'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const Admin=require('./admin'),AdminView=require('./admin-view'),F=require('./ui-format');
const Supabase=require('./storage-supabase');

// A storage stand-in that records what would have been asked of the function, and answers
// whatever the test wants. Nothing here creates an account: only the deployed function can.
function desk(answer={ok:true,logins:[]}){
 const asked=[];
 const storage={adminUsers:async(action,payload)=>{asked.push([action,payload]);return answer;}};
 return {asked,admin:Admin.create({storage})};
}
const view=()=>AdminView.create({esc:F.esc,fmt:F.fmt,table:F.table});

test('A login is checked before anything is sent',async()=>{
 const {asked,admin}=desk();
 for(const bad of ['ab','al divino','al@divino','_aldivino','',null,'a'.repeat(33),'al/divino']){
  const result=await admin.add({login:bad,password:'correct-horse-battery'});
  assert.equal(result.ok,false,JSON.stringify(bad)+' is not a login');
  assert.match(result.error,/3 to 32 characters/);
 }
 assert.deepEqual(asked,[],'nothing reached the server: the form answers first');
 // Case is folded rather than refused: "Aldivino" is a way of typing aldivino, and the
 // login that gets stored is the same one either way.
 for(const good of ['aldivino','Aldivino','al.divino','al-divino','al_divino','a1b','pikul2026'])
  assert.equal((await admin.add({login:good,password:'correct-horse-battery'})).ok,true,good);
 assert.deepEqual(asked.map(x=>x[1].username).slice(0,2),['aldivino','aldivino']);
});

test('A short password is refused here, and again by the function and the database',async()=>{
 const {asked,admin}=desk();
 const short=await admin.add({login:'aldivino',password:'123456789'});
 assert.equal(short.ok,false);
 assert.match(short.error,/at least 10 characters/);
 assert.deepEqual(asked,[]);
 assert.equal((await admin.setPassword('user-1','12345')).ok,false,'and on a replacement too');
 // The same minimum stands in the function and as a rule in the database, on purpose.
 const fn=fs.readFileSync(__dirname+'/../supabase/functions/admin-users/index.ts','utf8');
 assert.match(fn,/const MIN_PASSWORD = 10;/,'the function holds the same minimum');
});

test('The login domain is one value, and both halves of the system use the same one',()=>{
 const fn=fs.readFileSync(__dirname+'/../supabase/functions/admin-users/index.ts','utf8');
 const inFunction=/'(?<domain>[a-z0-9.-]+)';\s*$/m.exec(
  /const LOGIN_DOMAIN = Deno\.env\.get\('LOGIN_DOMAIN'\) \|\| '([a-z0-9.-]+)';/.exec(fn)[0]);
 assert.equal(inFunction.groups.domain,Supabase.LOGIN_DOMAIN,
  'the page builds the address to sign in with and the function builds it to create the account: '+
  'two different domains would create an account nobody can reach');
});

test('A login is folded to one form before it is sent',async()=>{
 const {asked,admin}=desk();
 await admin.add({login:'  ALDIVINO  ',password:'correct-horse-battery',name:'Alexander Pikul'});
 assert.equal(asked[0][1].username,'aldivino');
 assert.equal(admin.normalise(' Al.Divino '),'al.divino');
});

test('Only the two roles exist',async()=>{
 const {asked,admin}=desk();
 assert.equal((await admin.add({login:'aldivino',password:'correct-horse-battery',role:'admin'})).ok,false);
 assert.equal((await admin.setRole('user-1','superuser')).ok,false);
 assert.deepEqual(asked,[]);
 assert.equal((await admin.setRole('user-1','owner')).ok,true);
 assert.deepEqual(asked[0],['role',{userId:'user-1',role:'owner'}]);
});

test('Every action names itself and the account it concerns',async()=>{
 const {asked,admin}=desk();
 await admin.list();
 await admin.add({login:'trader',password:'correct-horse-battery',name:'A Trader',title:'Trader',role:'member'});
 await admin.setPassword('user-2','another-long-password');
 await admin.remove('user-2');
 assert.deepEqual(asked.map(x=>x[0]),['list','create','password','remove']);
 assert.deepEqual(asked[1][1],{username:'trader',password:'correct-horse-battery',
  name:'A Trader',title:'Trader',role:'member'});
 assert.deepEqual(asked[3][1],{userId:'user-2'});
});

test('The organisation is named by the adapter, and no payload can move it',async()=>{
 // The function checks the right against the organisation it is given, so this is not the
 // defence. It is refusing to leave the question open on the way there.
 const sent=[];
 const client={from:()=>({select:()=>({eq:()=>({maybeSingle:()=>({then:r=>r({data:null,error:null})})})})}),
  auth:{getUser:async()=>({data:{user:{id:'user-1'}},error:null})},
  functions:{invoke:async(name,{body})=>{sent.push(body);return {data:{ok:true},error:null};}}};
 const storage=Supabase.create({client,orgId:'org-1'});
 await storage.adminUsers('remove',{userId:'user-2',orgId:'org-somebody-else'});
 assert.equal(sent[0].orgId,'org-1');
 assert.equal(sent[0].action,'remove');
});

test('A refusal from the function is passed on as it was said',async()=>{
 const {admin}=desk({ok:false,error:'The login "trader" is taken'});
 const result=await admin.add({login:'trader',password:'correct-horse-battery'});
 assert.equal(result.ok,false);
 assert.match(result.error,/is taken/,'the reason reaches the person, not a status code');
});

test('Without a shared deployment there are no accounts to manage, and it says so',async()=>{
 const admin=Admin.create({storage:{kind:'local',shared:false}});
 const result=await admin.add({login:'aldivino',password:'correct-horse-battery'});
 assert.equal(result.ok,false);
 assert.match(result.error,/one browser only/);
 assert.equal((await admin.list()).ok,false);
});

test('The page never holds the key that could create an account',()=>{
 // The service key bypasses every policy. If it were in any deployed file, everything else
 // in this system would be decoration.
 for(const name of ['admin.js','admin-view.js','storage-supabase.js','storage.js','app.js','sign-in.js']){
  const source=fs.readFileSync(__dirname+'/'+name,'utf8');
  assert.doesNotMatch(source,/service_role|sb_secret_|SERVICE_ROLE_KEY/,name);
  assert.doesNotMatch(source,/auth\.admin\./,name+' must not reach for the admin API');
 }
});

// ---------------------------------------------------------------------------
// The screen
// ---------------------------------------------------------------------------

const rows=[
 {id:'u1',username:'aldivino',name:'Alexander Pikul',title:'Owner',role:'owner',
  createdAt:'2026-09-01T10:00:00Z',lastSignInAt:'2026-09-12T08:00:00Z',self:true},
 {id:'u2',username:'trader',name:'A Trader',title:'Trader',role:'member',
  createdAt:'2026-09-10T10:00:00Z',lastSignInAt:null,self:false}
];

test('The screen lists who can sign in, and says the platform is closed',()=>{
 const html=view().render(rows,null,'ProjectX');
 assert.ok(html.includes('<h2>ADMIN</h2>'));
 assert.ok(html.includes('ProjectX'));
 assert.ok(html.includes('there is no registration'));
 assert.ok(html.includes('aldivino')&&html.includes('trader'));
 assert.deepEqual(view().COLUMNS,['','Login','Name','Job title','Role','Added','Last sign-in','']);
});

test('A login nobody has ever used is named, not left blank',()=>{
 const html=view().render(rows,null,'ProjectX');
 assert.ok(html.includes('Never'),'an unused login is what an owner needs to see');
 assert.ok(html.includes('12 Sept 2026'),'and a used one shows when');
});

test('The owner cannot demote or remove themselves from the screen',()=>{
 const html=view().render(rows,null,'ProjectX');
 assert.ok(!/data-action="remove-login" data-id="u1"/.test(html),'no Remove against your own login');
 assert.ok(!/data-action="set-login-role" data-id="u1"/.test(html));
 assert.ok(/data-action="remove-login" data-id="u2"/.test(html),'and both against somebody else');
 assert.ok(/data-action="set-login-role" data-id="u2" data-role="owner"/.test(html));
});

test('A password is set in the opened row and never shown',()=>{
 const closed=view().render(rows,null,'ProjectX');
 assert.ok(!closed.includes('login-editor'),'the field appears only when the row is opened');
 const open=view().render(rows,'u2','ProjectX');
 assert.ok(open.includes('<form class="login-editor" data-id="u2">'));
 assert.ok(open.includes('type="password"'),'typed hidden, as a password is');
 assert.ok(open.includes('New password for trader'));
 assert.ok(!/value="[^"]/.test(open.split('login-editor')[1].split('</form>')[0]),
  'nothing is prefilled: the old password is unknown and unknowable');
 assert.ok(open.includes('cannot be read back'));
});

test('Until the list has been read, the screen says so rather than showing nobody',()=>{
 const reading=view().render(null,null,'ProjectX');
 assert.ok(reading.includes('Reading the logins'));
 assert.ok(!reading.includes('<table'),'an empty table would read as "nobody is here"');
 const refused=view().render({ok:false,error:'Only the owner can manage logins'},null,'ProjectX');
 assert.ok(refused.includes('Only the owner can manage logins'));
 assert.ok(refused.includes('role="alert"'));
});

test('One owner and nobody else is stated under the table, not instead of it',()=>{
 const alone=view().render([rows[0]],null,'ProjectX');
 assert.ok(alone.includes('aldivino'),'the owner still sees their own login');
 assert.ok(alone.includes('You are the only login'));
 assert.ok(!view().render(rows,null,'ProjectX').includes('You are the only login'));
});

test('A name written by a person cannot become markup',()=>{
 const injection='<img src=x onerror=alert(1)>';
 const html=view().render([{...rows[1],username:injection,name:injection,title:injection}],null,injection);
 assert.ok(!html.includes('<img src=x'));
 assert.ok(html.includes('&lt;img src=x'));
});

test('The screen builds markup and reaches for nothing else',()=>{
 const source=fs.readFileSync(__dirname+'/admin-view.js','utf8');
 for(const forbidden of ['document.','innerHTML','getElementById','window.','fetch('])
  assert.ok(!source.includes(forbidden),`admin-view.js must not use ${forbidden}`);
});
