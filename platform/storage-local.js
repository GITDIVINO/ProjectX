(function(root){
'use strict';
// Browser-local adapter. Same durability as the current prototype — one browser, one origin —
// but in the split layout, behind the shared asynchronous contract so that swapping in the
// Supabase adapter is a configuration change and not a rewrite.

const Schema=typeof module!=='undefined'&&module.exports?require('./schema'):root.ProjectXSchema;

const CATALOG_KEY='projectx-catalogs-v3';
const SALES_KEY='projectx-sales-v3';
const INDEX_KEY='projectx-voyages-v3';
const VOYAGE_PREFIX='projectx-voyage-v3:';
const LEGACY_KEY='projectx-current-v2';   // the prototype's single save; never deleted here
const LEGACY_SEEN='projectx-legacy-seen-v3';

const now=()=>new Date().toISOString();
const id=()=>'v-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);

function create(options={}){
 const store=options.store||(typeof localStorage!=='undefined'?localStorage:null);
 if(!store)throw Error('No storage backend available');

 const read=key=>{const raw=store.getItem(key);if(raw===null||raw===undefined)return null;return JSON.parse(raw);};
 const write=(key,value)=>store.setItem(key,JSON.stringify(value));

 // The prototype's single save carries catalogs and voyage together. It is treated as an
 // inbox rather than a one-time migration: whenever its contents differ from what was last
 // imported, they are taken in again. That is what lets a calculation saved by an older
 // build, or by the offline page, be opened here. The original key is never written or
 // deleted by this adapter, so the older build keeps working on its own copy.
 function importLegacy(){
  const legacy=store.getItem(LEGACY_KEY);
  if(!legacy)return false;
  if(legacy===store.getItem(LEGACY_SEEN))return false;
  let state;
  try{state=JSON.parse(legacy);}
  catch{store.setItem(LEGACY_SEEN,legacy);return false;}   // unreadable: noted, so it is not retried
  if(!state||typeof state!=='object'){store.setItem(LEGACY_SEEN,legacy);return false;}
  store.setItem(LEGACY_SEEN,legacy);
  const parts=Schema.split(state);
  write(CATALOG_KEY,{document:parts.catalogs,revision:1,updatedAt:now()});
  const sales={};
  for(const sale of parts.sales.sales||[])if(sale&&sale.id)sales[sale.id]={document:sale,revision:1,updatedAt:now()};
  write(SALES_KEY,sales);
  const existing=index();
  const voyageId=existing[0]?existing[0].id:id();
  const revision=existing[0]?existing[0].revision+1:1;
  write(VOYAGE_PREFIX+voyageId,Schema.stamp(parts.voyage,1));
  write(INDEX_KEY,[{id:voyageId,name:existing[0]?existing[0].name:'Imported calculation',revision,catalogRevision:1,updatedAt:now()},
   ...existing.slice(1)]);
  return true;
 }

 const index=()=>read(INDEX_KEY)||[];
 const entry=voyageId=>index().find(x=>x.id===voyageId)||null;

 return {
  kind:'local',
  shared:false,
  async ready(){importLegacy();return {kind:'local',user:null};},
  async user(){return null;},

  // This adapter reads a synchronous store, so it can answer the whole workspace at once.
  // The page then renders the saved calculation on first paint instead of a loading state.
  // An adapter that has to cross a network does not offer this, and the caller awaits open().
  openSync(preferred){
   importLegacy();
   const list=index();
   const chosen=list.find(x=>x.id===preferred)||list[0];
   if(!chosen)return null;
   const document=read(VOYAGE_PREFIX+chosen.id);
   if(!document)return null;
   const sales=read(SALES_KEY)||{};
   return {
    catalogs:read(CATALOG_KEY)||{document:{},revision:0,updatedAt:null},
    sales:Object.entries(sales).map(([saleId,x])=>({id:saleId,document:x.document,revision:x.revision,updatedAt:x.updatedAt})),
    voyage:{...chosen,document}
   };
  },

  async loadCatalogs(){
   importLegacy();
   return read(CATALOG_KEY)||{document:{},revision:0,updatedAt:null};
  },
  async saveCatalogs(document,revision){
   const current=read(CATALOG_KEY)||{document:{},revision:0};
   if(revision!==undefined&&revision!==current.revision)return {ok:false,reason:'conflict',current};
   const next={document,revision:current.revision+1,updatedAt:now()};
   write(CATALOG_KEY,next);
   return {ok:true,revision:next.revision,updatedAt:next.updatedAt};
  },

  // Sales are one row per deal, so two traders editing different deals do not collide.
  async listSales(){
   importLegacy();
   const sales=read(SALES_KEY)||{};
   return Object.entries(sales).map(([saleId,x])=>({id:saleId,document:x.document,revision:x.revision,updatedAt:x.updatedAt}));
  },
  async saveSale(saleId,document,revision){
   const sales=read(SALES_KEY)||{};
   const current=sales[saleId];
   if(current&&revision!==undefined&&revision!==current.revision)return {ok:false,reason:'conflict',current:{id:saleId,...current}};
   const next={document,revision:(current?.revision||0)+1,updatedAt:now()};
   write(SALES_KEY,{...sales,[saleId]:next});
   return {ok:true,id:saleId,revision:next.revision,updatedAt:next.updatedAt};
  },
  async deleteSale(saleId){
   const sales=read(SALES_KEY)||{};
   if(!sales[saleId])return {ok:false,reason:'missing'};
   delete sales[saleId];
   write(SALES_KEY,sales);
   return {ok:true};
  },

  async listVoyages(){importLegacy();return index();},
  async loadVoyage(voyageId){
   const meta=entry(voyageId);
   if(!meta)return null;
   const document=read(VOYAGE_PREFIX+voyageId);
   if(!document)return null;
   return {...meta,document};
  },
  async createVoyage(name,document,catalogRevision=0){
   const voyageId=id();
   const meta={id:voyageId,name,revision:1,catalogRevision,updatedAt:now()};
   write(VOYAGE_PREFIX+voyageId,document);
   write(INDEX_KEY,[...index(),meta]);
   return {ok:true,...meta};
  },
  async saveVoyage(voyageId,document,revision){
   const meta=entry(voyageId);
   if(!meta)return {ok:false,reason:'missing'};
   if(revision!==undefined&&revision!==meta.revision)return {ok:false,reason:'conflict',current:meta};
   const next={...meta,revision:meta.revision+1,updatedAt:now()};
   write(VOYAGE_PREFIX+voyageId,document);
   write(INDEX_KEY,index().map(x=>x.id===voyageId?next:x));
   return {ok:true,...next};
  },
  async renameVoyage(voyageId,name){
   const meta=entry(voyageId);
   if(!meta)return {ok:false,reason:'missing'};
   write(INDEX_KEY,index().map(x=>x.id===voyageId?{...x,name,updatedAt:now()}:x));
   return {ok:true,id:voyageId,name};
  },
  async deleteVoyage(voyageId){
   if(!entry(voyageId))return {ok:false,reason:'missing'};
   store.removeItem(VOYAGE_PREFIX+voyageId);
   write(INDEX_KEY,index().filter(x=>x.id!==voyageId));
   return {ok:true};
  },

  // A snapshot pins inputs so a later engine or catalog version cannot restate an approved
  // package. Locally this is a copy; the shared adapter writes an append-only row.
  async snapshot(voyageId,label){
   const loaded=await this.loadVoyage(voyageId);
   if(!loaded)return {ok:false,reason:'missing'};
   const catalogs=await this.loadCatalogs();
   const key=VOYAGE_PREFIX+voyageId+':snapshots';
   const list=read(key)||[];
   const record={label:label||'',revision:loaded.revision,createdAt:now(),document:loaded.document,catalogs:catalogs.document,catalogRevision:catalogs.revision};
   write(key,[...list,record]);
   return {ok:true,...record};
  },
  async snapshots(voyageId){return read(VOYAGE_PREFIX+voyageId+':snapshots')||[];}
 };
}

const api={create,CATALOG_KEY,SALES_KEY,INDEX_KEY,VOYAGE_PREFIX,LEGACY_KEY,LEGACY_SEEN};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXStorageLocal=api;
})(globalThis);
