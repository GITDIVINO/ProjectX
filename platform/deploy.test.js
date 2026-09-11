'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Deploy=require('../tools/build_vercel.cjs');

const root=path.resolve(__dirname,'..');
const out=path.join(root,'public');
const readOut=name=>fs.readFileSync(path.join(out,name),'utf8');
const clientInstalled=fs.existsSync(path.join(root,'node_modules/@supabase/supabase-js/dist/umd/supabase.js'))
 ||fs.existsSync(path.join(root,'node_modules/@supabase/supabase-js/dist/umd/supabase.min.js'));

test('Without configuration the deployed page runs in this browser and ships no key',()=>{
 const result=Deploy.build({});
 assert.equal(result.configured,false);
 assert.equal(fs.existsSync(path.join(out,'config.js')),false,'no configuration file is written');
 assert.equal(fs.existsSync(path.join(out,'supabase-client.js')),false);
 const html=readOut('index.html');
 assert.ok(html.includes('storage.js'),'the storage layer is deployed either way');
 assert.ok(!html.includes('PROJECTX_CONFIG'),'nothing claims a backend that is not there');
});

test('Every deployed asset is listed on purpose, and tests are not among them',()=>{
 Deploy.build({});
 const shipped=fs.readdirSync(out);
 for(const name of Deploy.ASSETS)assert.ok(shipped.includes(name),name+' is missing from the deployed site');
 for(const name of shipped){
  assert.ok(!/\.test\.js$/.test(name),name+' is a test and must not be deployed');
  assert.ok(!/browser-check/.test(name),name+' is a check and must not be deployed');
 }
 assert.ok(!shipped.includes('ProjectX.html'),'the offline bundle is not part of the hosted site');
});

test('A service role key is refused before anything is written',()=>{
 const before=fs.existsSync(out)?fs.readdirSync(out).length:0;
 assert.throws(
  ()=>Deploy.build({SUPABASE_URL:'https://demo.supabase.co',SUPABASE_ANON_KEY:'eyJ...service_role...'}),
  /service role key/
 );
 // The output directory is untouched: a rejected build leaves nothing half-assembled.
 assert.equal(fs.existsSync(out)?fs.readdirSync(out).length:0,before);
});

test('A URL without a key is not a configured backend',()=>{
 assert.equal(Deploy.config({SUPABASE_URL:'https://demo.supabase.co'}),null);
 assert.equal(Deploy.config({SUPABASE_ANON_KEY:'anon'}),null);
 assert.deepEqual(
  Deploy.config({SUPABASE_URL:'https://demo.supabase.co',SUPABASE_ANON_KEY:'anon',PROJECTX_ORG_ID:'org-7'}),
  {supabaseUrl:'https://demo.supabase.co',supabaseAnonKey:'anon',orgId:'org-7'}
 );
});

test('Configuration is deployed as its own file so inline script can stay forbidden',{skip:clientInstalled?false:'@supabase/supabase-js is not installed'},()=>{
 const result=Deploy.build({SUPABASE_URL:'https://demo.supabase.co',SUPABASE_ANON_KEY:'anon-key-123',PROJECTX_ORG_ID:'org-7'});
 assert.equal(result.configured,true);

 const config=readOut('config.js');
 assert.match(config,/window\.PROJECTX_CONFIG=/);
 assert.deepEqual(JSON.parse(config.replace('window.PROJECTX_CONFIG=','').trim().replace(/;$/,'')),
  {supabaseUrl:'https://demo.supabase.co',supabaseAnonKey:'anon-key-123',orgId:'org-7'});

 const html=readOut('index.html');
 assert.ok(html.includes('<script src="config.js"></script>'),'the configuration is a file, not an inline block');
 assert.ok(html.includes('<script src="supabase-client.js"></script>'));
 assert.ok(!/<script>[^<]/.test(html),'no inline script is introduced, so script-src can stay \'self\'');
 assert.ok(html.indexOf('config.js')<html.indexOf('storage.js'),'configuration is in place before the storage layer reads it');
});

test('The deployed policy allows the app and no more',()=>{
 const policy=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'))
  .headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
 assert.ok(policy.includes("script-src 'self'")&&!policy.includes("script-src 'self' 'unsafe-inline'"),
  'inline script stays forbidden; the page uses none');
 assert.ok(policy.includes('connect-src')&&policy.includes('https://*.supabase.co'),'the app may reach its own backend');
 assert.ok(policy.includes("frame-ancestors 'none'"),'the planner is not embeddable');
 assert.ok(policy.includes("form-action 'none'"),'every form is handled in the page; none may post elsewhere');
 assert.ok(policy.includes("object-src 'none'")&&policy.includes("base-uri 'none'"));
});

test('The build states which assets it deploys, and the offline bundle covers the same modules',()=>{
 const offline=fs.readFileSync(path.join(__dirname,'build.cjs'),'utf8');
 for(const name of ['schema.js','storage-local.js','storage-supabase.js','storage.js']){
  assert.ok(Deploy.ASSETS.includes(name),name+' must be deployed');
  assert.ok(offline.includes(`'${name}'`),name+' must also be in the offline bundle');
 }
});

test.after(()=>{fs.rmSync(out,{recursive:true,force:true});});
