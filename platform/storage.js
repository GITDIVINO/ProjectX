(function(root){
'use strict';
// Chooses the storage adapter. The application asks for storage; it does not know which one
// it got. Without configuration the browser-local adapter is used and behaviour is the
// prototype's: one browser, one origin, no account.

const Local=typeof module!=='undefined'&&module.exports?require('./storage-local'):root.ProjectXStorageLocal;
const Supabase=typeof module!=='undefined'&&module.exports?require('./storage-supabase'):root.ProjectXStorageSupabase;

// Configuration reaches the page as a plain object written by the deployment, not as a build
// step: window.PROJECTX_CONFIG = {supabaseUrl, supabaseAnonKey, orgId}. The anon key is a
// public value by design — every row it can reach is decided by the policies in the database.
function configured(config){
 return !!(config&&config.supabaseUrl&&config.supabaseAnonKey);
}

function create(options={}){
 const config=options.config||(typeof root!=='undefined'?root.PROJECTX_CONFIG:null);
 if(options.client)return Supabase.create({client:options.client,orgId:options.orgId||config?.orgId||null});
 if(configured(config)){
  const factory=options.createClient||root.supabase?.createClient;
  if(!factory)return {...Local.create(options),degraded:'The Supabase client library did not load; working in this browser only.'};
  const client=factory(config.supabaseUrl,config.supabaseAnonKey);
  return Supabase.create({client,orgId:options.orgId||config.orgId||null});
 }
 return Local.create(options);
}

const api={create,configured};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXStorage=api;
})(globalThis);
