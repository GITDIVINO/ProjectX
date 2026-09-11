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

const now=()=>new Date().toISOString();
const id=()=>'v-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);

function create(options={}){
 const store=options.store||(typeof localStorage!=='undefined'?localStorage:null);
 if(!store)throw Error('No storage backend available');

 const read=key=>{const raw=store.getItem(key);if(raw===null||raw===undefined)return null;return JSON.parse(raw);};
 const write=(key,value)=>store.setItem(key,JSON.stringify(value));

 // The prototype's single save carries catalogs and voyage together. Move it into the split
 // layout once, keeping the original key so an older build still opens the same calculation.
 function migrateLegacy(){
  if(read(INDEX_KEY))return false;
  const legacy=store.getItem(LEGACY_KEY);
  if(!legacy)return false;
  let state;
  try{state=JSON.parse(legacy);}catch{return false;}
  if(!state||typeof state!=='object')return false;
  const parts=Schema.split(state);
  write(CATALOG_KEY,{document:parts.catalogs,revision:1,updatedAt:now()});
  const sales={};
  for(const sale of parts.sales.sales||[])if(sale&&sale.id)sales[sale.id]={document:sale,revision:1,updatedAt:now()};
  write(SALES_KEY,sales);
  const voyageId=id();
  write(VOYAGE_PREFIX+voyageId,Schema.stamp(parts.voyage,1));
  write(INDEX_KEY,[{id:voyageId,name:'Imported calculation',revision:1,catalogRevision:1,updatedAt:now()}]);
  return true;
 }

 const index=()=>read(INDEX_KEY)||[];
 const entry=voyageId=>index().find(x=>x.id===voyageId)||null;

 return {
  kind:'local',
  shared:false,
  async ready(){migrateLegacy();return {kind:'local',user:null};},
  async user(){return null;},

  async loadCatalogs(){
   migrateLegacy();
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
   migrateLegacy();
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

  async listVoyages(){migrateLegacy();return index();},
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

const api={create,CATALOG_KEY,SALES_KEY,INDEX_KEY,VOYAGE_PREFIX,LEGACY_KEY};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXStorageLocal=api;
})(globalThis);
