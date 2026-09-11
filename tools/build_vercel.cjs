'use strict';
// Assembles the deployable site into public/ from platform/.
//
// Two things are deployment concerns and are injected here rather than committed into
// platform/index.html: the Supabase configuration, and the Supabase client library. Keeping
// them out of the source page is what lets the same page run with no backend at all — without
// configuration the application selects the browser-local adapter (see platform/storage.js).
//
// The anon key is injected into the page in clear text. That is how Supabase is designed to
// work: the key identifies the project, and which rows it can reach is decided by the
// row-level policies in supabase/migrations. Never inject the service role key here.

const fs=require('node:fs'),path=require('node:path');

const root=path.resolve(__dirname,'..');
const source=path.join(root,'platform');
const out=path.join(root,'public');

// Everything the page loads at runtime. Tests, browser checks and the offline bundle are not
// deployed: an explicit list keeps private or unintended files out of a public deployment.
const ASSETS=[
 'index.html','styles.css',
 'arithmetic.js','cargo-catalog.js','model.js','market.js','guide.js',
 'sea-data.js','sea-table.js','sea-route.js','planning.js','planner-ui.js',
 'schema.js','storage-local.js','storage-supabase.js','storage.js','session.js','app.js'
];

const CLIENT_CANDIDATES=[
 'node_modules/@supabase/supabase-js/dist/umd/supabase.js',
 'node_modules/@supabase/supabase-js/dist/umd/supabase.min.js'
];

function config(env){
 const url=env.SUPABASE_URL||'';
 const key=env.SUPABASE_ANON_KEY||'';
 const org=env.PROJECTX_ORG_ID||'';
 if(!url||!key)return null;
 if(/service_role/.test(key))throw Error('SUPABASE_ANON_KEY looks like a service role key. That key must never reach the browser.');
 return {supabaseUrl:url,supabaseAnonKey:key,orgId:org||null};
}

function findClient(){
 for(const candidate of CLIENT_CANDIDATES){
  const full=path.join(root,candidate);
  if(fs.existsSync(full))return full;
 }
 return null;
}

function build(env=process.env){
 // Validate before touching the output directory: a rejected key must not leave a
 // half-assembled public/ that a later step could mistake for a finished build.
 const settings=config(env);
 const client=settings?findClient():null;
 if(settings&&!client)throw Error('SUPABASE_URL is set but @supabase/supabase-js is not installed. Run: npm install @supabase/supabase-js');
 for(const name of ASSETS)if(!fs.existsSync(path.join(source,name)))throw Error('Missing deployable asset: platform/'+name);

 fs.rmSync(out,{recursive:true,force:true});
 fs.mkdirSync(out,{recursive:true});

 for(const name of ASSETS)fs.copyFileSync(path.join(source,name),path.join(out,name));

 let html=fs.readFileSync(path.join(out,'index.html'),'utf8');
 const injected=[];

 if(settings){
  fs.copyFileSync(client,path.join(out,'supabase-client.js'));
  // The configuration is its own file rather than an inline block, so the deployed
  // Content-Security-Policy can refuse inline script outright (see vercel.json).
  fs.writeFileSync(path.join(out,'config.js'),'window.PROJECTX_CONFIG='+JSON.stringify(settings)+';\n');
  injected.push('<script src="supabase-client.js"></script><script src="config.js"></script>');
 }

 if(injected.length){
  const anchor='<script src="schema.js"></script>';
  if(!html.includes(anchor))throw Error('Cannot place the deployment configuration: the script order in index.html changed');
  html=html.replace(anchor,injected.join('')+anchor);
 }
 fs.writeFileSync(path.join(out,'index.html'),html);

 return {assets:ASSETS.length,configured:!!settings,directory:out};
}

if(require.main===module){
 const result=build();
 console.log(`Built public/ — ${result.assets} assets, backend ${result.configured?'configured':'not configured (browser-local mode)'}`);
}

module.exports={build,config,ASSETS};
