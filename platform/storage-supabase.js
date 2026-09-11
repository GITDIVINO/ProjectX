(function(root){
'use strict';
// Shared adapter over Supabase Postgres. The client is injected rather than constructed here,
// so the query shapes, the concurrency rule and the error handling are testable without a
// project, a network or a key. See supabase/migrations for the tables and the row-level
// policies these calls rely on.
//
// Access is enforced by the policies in the database, not by this file. Nothing here is a
// permission check: an adapter that forgot a filter would still be refused by the server.

const TABLES={catalogs:'catalogs',sales:'sales',voyages:'voyages',snapshots:'voyage_snapshots'};

const fail=(error,reason='error')=>({ok:false,reason,error:error?.message||String(error||'Unknown storage error')});

function create(options={}){
 const client=options.client;
 if(!client)throw Error('A Supabase client is required');
 const orgId=options.orgId||null;

 // Every read and write is scoped to one organisation. The policies repeat this server-side;
 // the filter here keeps a wrong-org row from being requested in the first place.
 const scoped=table=>client.from(table);
 const withOrg=q=>orgId?q.eq('org_id',orgId):q;

 return {
  kind:'supabase',
  shared:true,
  orgId,

  async ready(){
   const {data,error}=await client.auth.getUser();
   if(error)return fail(error,'auth');
   if(!data?.user)return {ok:false,reason:'signed-out'};
   return {ok:true,kind:'supabase',user:{id:data.user.id,email:data.user.email}};
  },
  async user(){
   const {data}=await client.auth.getUser();
   return data?.user?{id:data.user.id,email:data.user.email}:null;
  },

  async loadCatalogs(){
   const {data,error}=await withOrg(scoped(TABLES.catalogs).select('document,revision,updated_at')).maybeSingle();
   if(error)return fail(error);
   if(!data)return {document:{},revision:0,updatedAt:null};
   return {document:data.document,revision:data.revision,updatedAt:data.updated_at};
  },
  // Optimistic concurrency: the update matches on the revision the caller read. No matched row
  // means somebody else wrote first, and the caller is handed the current record to resolve.
  async saveCatalogs(document,revision){
   const {data,error}=await withOrg(
    scoped(TABLES.catalogs).update({document,revision:revision+1}).eq('revision',revision)
   ).select('revision,updated_at').maybeSingle();
   if(error)return fail(error);
   if(!data){
    const current=await this.loadCatalogs();
    return {ok:false,reason:'conflict',current};
   }
   return {ok:true,revision:data.revision,updatedAt:data.updated_at};
  },

  // Sales are one row per deal, so two traders editing different deals do not collide.
  async listSales(){
   const {data,error}=await withOrg(scoped(TABLES.sales).select('id,document,revision,updated_at'))
    .order('updated_at',{ascending:false});
   if(error)return fail(error);
   return (data||[]).map(x=>({id:x.id,document:x.document,revision:x.revision,updatedAt:x.updated_at}));
  },
  async saveSale(saleId,document,revision){
   if(revision===undefined||revision===0){
    const row={id:saleId,document,revision:1};
    if(orgId)row.org_id=orgId;
    const {data,error}=await scoped(TABLES.sales).insert(row).select('id,revision,updated_at').maybeSingle();
    if(error)return fail(error);
    return {ok:true,id:data.id,revision:data.revision,updatedAt:data.updated_at};
   }
   const {data,error}=await withOrg(
    scoped(TABLES.sales).update({document,revision:revision+1}).eq('id',saleId).eq('revision',revision)
   ).select('id,revision,updated_at').maybeSingle();
   if(error)return fail(error);
   if(!data){
    const all=await this.listSales();
    const current=Array.isArray(all)?all.find(x=>x.id===saleId):null;
    return current?{ok:false,reason:'conflict',current}:{ok:false,reason:'missing'};
   }
   return {ok:true,id:data.id,revision:data.revision,updatedAt:data.updated_at};
  },
  async deleteSale(saleId){
   const {error}=await withOrg(scoped(TABLES.sales).delete().eq('id',saleId));
   return error?fail(error):{ok:true};
  },

  async listVoyages(){
   const {data,error}=await withOrg(scoped(TABLES.voyages).select('id,name,revision,catalog_revision,updated_at'))
    .order('updated_at',{ascending:false});
   if(error)return fail(error);
   return (data||[]).map(x=>({id:x.id,name:x.name,revision:x.revision,catalogRevision:x.catalog_revision,updatedAt:x.updated_at}));
  },
  async loadVoyage(voyageId){
   const {data,error}=await withOrg(scoped(TABLES.voyages).select('id,name,document,revision,catalog_revision,updated_at').eq('id',voyageId)).maybeSingle();
   if(error)return fail(error);
   if(!data)return null;
   return {id:data.id,name:data.name,document:data.document,revision:data.revision,catalogRevision:data.catalog_revision,updatedAt:data.updated_at};
  },
  async createVoyage(name,document,catalogRevision=0){
   const row={name,document,revision:1,catalog_revision:catalogRevision};
   if(orgId)row.org_id=orgId;
   const {data,error}=await scoped(TABLES.voyages).insert(row).select('id,name,revision,catalog_revision,updated_at').maybeSingle();
   if(error)return fail(error);
   return {ok:true,id:data.id,name:data.name,revision:data.revision,catalogRevision:data.catalog_revision,updatedAt:data.updated_at};
  },
  async saveVoyage(voyageId,document,revision){
   const {data,error}=await withOrg(
    scoped(TABLES.voyages).update({document,revision:revision+1}).eq('id',voyageId).eq('revision',revision)
   ).select('id,name,revision,catalog_revision,updated_at').maybeSingle();
   if(error)return fail(error);
   if(!data){
    const current=await this.loadVoyage(voyageId);
    return current?{ok:false,reason:'conflict',current}:{ok:false,reason:'missing'};
   }
   return {ok:true,id:data.id,name:data.name,revision:data.revision,catalogRevision:data.catalog_revision,updatedAt:data.updated_at};
  },
  async renameVoyage(voyageId,name){
   const {data,error}=await withOrg(scoped(TABLES.voyages).update({name}).eq('id',voyageId)).select('id,name').maybeSingle();
   if(error)return fail(error);
   return data?{ok:true,id:data.id,name:data.name}:{ok:false,reason:'missing'};
  },
  async deleteVoyage(voyageId){
   const {error}=await withOrg(scoped(TABLES.voyages).delete().eq('id',voyageId));
   return error?fail(error):{ok:true};
  },

  // Snapshots are append-only by policy: there is no update or delete path for them here,
  // because an approved package must not be restated by a later engine or catalog version.
  async snapshot(voyageId,label){
   const loaded=await this.loadVoyage(voyageId);
   if(!loaded)return {ok:false,reason:'missing'};
   const catalogs=await this.loadCatalogs();
   const row={voyage_id:voyageId,label:label||'',revision:loaded.revision,document:loaded.document,
    catalogs:catalogs.document,catalog_revision:catalogs.revision};
   if(orgId)row.org_id=orgId;
   const {data,error}=await scoped(TABLES.snapshots).insert(row).select('id,label,revision,created_at').maybeSingle();
   if(error)return fail(error);
   return {ok:true,id:data.id,label:data.label,revision:data.revision,createdAt:data.created_at};
  },
  async snapshots(voyageId){
   const {data,error}=await withOrg(scoped(TABLES.snapshots).select('id,label,revision,created_at').eq('voyage_id',voyageId))
    .order('created_at',{ascending:false});
   if(error)return fail(error);
   return (data||[]).map(x=>({id:x.id,label:x.label,revision:x.revision,createdAt:x.created_at}));
  }
 };
}

const api={create,TABLES};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXStorageSupabase=api;
})(globalThis);
