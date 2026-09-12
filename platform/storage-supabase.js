(function(root){
'use strict';
// Shared adapter over Supabase Postgres. The client is injected rather than constructed here,
// so the query shapes, the concurrency rule and the error handling are testable without a
// project, a network or a key. See supabase/migrations for the tables and the row-level
// policies these calls rely on.
//
// Access is enforced by the policies in the database, not by this file. Nothing here is a
// permission check: an adapter that forgot a filter would still be refused by the server.

const TABLES={catalogs:'catalogs',sales:'sales',voyages:'voyages',snapshots:'voyage_snapshots',
 memberships:'memberships',profiles:'profiles',register:'voyage_register',members:'organisation_members'};

// The shared registers, a row each. Sales were always this shape; the other three joined
// them so that two people editing different records cannot collide.
const REGISTER_TABLES={cargoTypes:'cargo_types',portRecords:'port_records',vesselProfiles:'vessel_profiles',sales:'sales',priceAssessments:'price_assessments'};

// A deployment that has its keys but not its schema is the common first failure, and the
// raw PostgREST wording ("relation ... does not exist") does not say what to do about it.
const SCHEMA_MISSING=/does not exist|schema cache|PGRST205/i;

// Which migration creates which table, so a database missing one is told the file to apply
// rather than always the first migration: a project that already has 0001 and not 0005 must
// not be sent back to 0001. Anything unrecognised is the initial schema, which is the case
// when nothing has been applied at all.
const TABLE_MIGRATIONS=[
 [/price_assessments/,'0005_price_assessments.sql'],
 [/cargo_types|port_records|vessel_profiles/,'0003_registers_per_row.sql'],
 [/profiles|voyage_register|organisation_members/,'0002_people_and_register.sql']
];
const migrationFor=message=>{
 for(const [pattern,file] of TABLE_MIGRATIONS)if(pattern.test(message))return file;
 return '0001_initial_schema.sql';
};
const fail=(error,reason='error')=>{
 const message=error?.message||String(error||'Unknown storage error');
 if(SCHEMA_MISSING.test(message))
  return {ok:false,reason:'no-schema',
   error:'The database is reachable but a table this page needs is missing. Apply supabase/migrations/'+
    migrationFor(message)+' to the project, then reload.'};
 return {ok:false,reason,error:message};
};

function create(options={}){
 const client=options.client;
 if(!client)throw Error('A Supabase client is required');
 // The organisation is resolved from the signed-in user's membership, so a deployment does
 // not have to name one. A configured id is only a preference between several.
 let orgId=options.orgId||null;

 // Every read and write is scoped to one organisation. The policies repeat this server-side;
 // the filter here keeps a wrong-org row from being requested in the first place.
 const scoped=table=>client.from(table);
 const withOrg=q=>orgId?q.eq('org_id',orgId):q;   // reads orgId at call time, after sign-in resolved it

 return {
  kind:'supabase',
  shared:true,

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

  // A password goes straight to Supabase and is never held by this application: not in its
  // state, not in storage, not in a log. Supabase's built-in mail is rate-limited and meant
  // for trying things out, so the code route is the fallback rather than the main way in.
  async signInWithPassword(email,password){
   const {data,error}=await client.auth.signInWithPassword({email,password});
   if(error)return fail(error,'sign-in');
   return {ok:true,user:data?.user?{id:data.user.id,email:data.user.email}:null};
  },

  async signIn(email){
   const {error}=await client.auth.signInWithOtp({email});
   return error?fail(error,'sign-in'):{ok:true,sent:email};
  },
  async verifyCode(email,token){
   const {data,error}=await client.auth.verifyOtp({email,token,type:'email'});
   return error?fail(error,'sign-in'):{ok:true,user:data?.user?{id:data.user.id,email:data.user.email}:null};
  },
  async signOut(){
   const {error}=await client.auth.signOut();
   return error?fail(error):{ok:true};
  },
  onAuthChange(handler){
   if(typeof client.auth.onAuthStateChange!=='function')return ()=>{};
   const {data}=client.auth.onAuthStateChange((event,session)=>handler(event,session?.user||null));
   return ()=>data?.subscription?.unsubscribe?.();
  },

  // Which organisations this account belongs to. The policies decide what comes back; an
  // account that was never added sees an empty list rather than somebody else's data.
  async organisations(){
   const {data,error}=await client.from(TABLES.memberships).select('org_id,role,organisations(id,name)');
   if(error)return fail(error);
   return (data||[]).map(row=>({
    id:row.org_id,
    name:row.organisations?.name||row.org_id,
    role:row.role
   }));
  },
  useOrganisation(id){orgId=id;return orgId;},
  get orgId(){return orgId;},

  async loadCatalogs(){
   const {data,error}=await withOrg(scoped(TABLES.catalogs).select('document,revision,updated_at')).maybeSingle();
   if(error)return fail(error);
   if(!data)return {document:{},revision:0,updatedAt:null};
   return {document:data.document,revision:data.revision,updatedAt:data.updated_at};
  },
  // Optimistic concurrency: the update matches on the revision the caller read. No matched row
  // means somebody else wrote first, and the caller is handed the current record to resolve.
  //
  // Revision 0 means nothing has been read because nothing is there yet: a new organisation
  // has no catalogs row, and an update would match nothing and read as a conflict forever.
  // The first write creates the row, the same way a first sale does.
  async saveCatalogs(document,revision){
   if(!revision){
    const row={document,revision:1};
    if(orgId)row.org_id=orgId;
    const {data,error}=await scoped(TABLES.catalogs).insert(row).select('revision,updated_at').maybeSingle();
    // org_id is the primary key, so two people opening a brand-new organisation at the same
    // moment race here. The loser reads what the winner wrote and resolves it as a conflict
    // rather than reporting a database error the user cannot act on.
    if(error){const current=await this.loadCatalogs();return current&&current.revision?{ok:false,reason:'conflict',current}:fail(error);}
    return {ok:true,revision:data.revision,updatedAt:data.updated_at};
   }
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

  // Every shared register, read as rows. A caller gets the same shape for all four, so the
  // session does not need a special case for any of them.
  async loadRegisters(){
   const out={};
   for(const [name,tableName] of Object.entries(REGISTER_TABLES)){
    const {data,error}=await withOrg(scoped(tableName).select('id,document,revision,updated_at'))
     .order('updated_at',{ascending:false});
    if(error)return fail(error);
    out[name]=(data||[]).map(x=>({id:x.id,document:x.document,revision:x.revision,updatedAt:x.updated_at}));
   }
   return out;
  },

  // One record of one register. Revision 0 means it is new; anything else must match what was
  // read, so a record changed by somebody else is reported rather than overwritten.
  async saveRegisterRow(register,id,document,revision){
   const tableName=REGISTER_TABLES[register];
   if(!tableName)return {ok:false,reason:'unknown-register',error:'No register named '+register};
   if(!revision){
    const row={id,document,revision:1};
    if(orgId)row.org_id=orgId;
    const {data,error}=await scoped(tableName).insert(row).select('id,revision,updated_at').maybeSingle();
    if(error){
     // The primary key is (org_id, id), so a race on a new record lands here. The loser reads
     // what the winner wrote and resolves it, rather than reporting a database error.
     const rows=await this.loadRegisters();
     const current=rows&&rows[register]&&rows[register].find(x=>x.id===id);
     return current?{ok:false,reason:'conflict',current}:fail(error);
    }
    return {ok:true,id:data.id,revision:data.revision,updatedAt:data.updated_at};
   }
   const {data,error}=await withOrg(
    scoped(tableName).update({document,revision:revision+1}).eq('id',id).eq('revision',revision)
   ).select('id,revision,updated_at').maybeSingle();
   if(error)return fail(error);
   if(!data){
    const rows=await this.loadRegisters();
    const current=rows&&rows[register]&&rows[register].find(x=>x.id===id);
    return current?{ok:false,reason:'conflict',current}:{ok:false,reason:'missing'};
   }
   return {ok:true,id:data.id,revision:data.revision,updatedAt:data.updated_at};
  },

  async deleteRegisterRow(register,id){
   const tableName=REGISTER_TABLES[register];
   if(!tableName)return {ok:false,reason:'unknown-register'};
   const {error}=await withOrg(scoped(tableName).delete().eq('id',id));
   return error?fail(error):{ok:true};
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

  // The register: one row per calculation with the names already resolved, so a screen that
  // shows who is responsible cannot fall back to showing a bare identifier.
  async listRegister(){
   const {data,error}=await withOrg(scoped(TABLES.register).select(
    'id,name,revision,catalog_revision,created_at,updated_at,responsible_id,responsible_name,responsible_title,'+
    'created_by_name,updated_by_name,vessel_name,parcels,ports,cargoes,tonnage,delivery_port'))
    .order('updated_at',{ascending:false});
   if(error)return fail(error);
   return (data||[]).map(x=>({
    id:x.id,name:x.name,revision:x.revision,catalogRevision:x.catalog_revision,
    createdAt:x.created_at,updatedAt:x.updated_at,
    responsibleId:x.responsible_id,responsible:x.responsible_name,responsibleTitle:x.responsible_title,
    createdBy:x.created_by_name,updatedBy:x.updated_by_name,
    vessel:x.vessel_name,parcels:Number(x.parcels)||0,ports:x.ports||'',
    cargoes:x.cargoes||'',tonnage:x.tonnage===null||x.tonnage===undefined?null:Number(x.tonnage),
    deliveryPort:x.delivery_port||null
   }));
  },

  // Who is in the organisation, for handing a calculation over.
  async members(){
   const {data,error}=await withOrg(scoped(TABLES.members).select('user_id,role,display_name,job_title'))
    .order('display_name',{ascending:true});
   if(error)return fail(error);
   return (data||[]).map(x=>({id:x.user_id,role:x.role,name:x.display_name,title:x.job_title}));
  },

  // Handing over is a change of who answers for the work, not of who may edit it: the
  // row-level policies stay as they were, and any member can still open the calculation.
  async setResponsible(voyageId,userId){
   const {data,error}=await withOrg(scoped(TABLES.voyages).update({responsible_id:userId}).eq('id',voyageId))
    .select('id,responsible_id').maybeSingle();
   if(error)return fail(error);
   return data?{ok:true,id:data.id,responsibleId:data.responsible_id}:{ok:false,reason:'missing'};
  },

  // A person's own profile. Nobody renames a colleague; the policy enforces that.
  async profile(){
   const who=await this.user();
   if(!who)return null;
   const {data,error}=await scoped(TABLES.profiles).select('user_id,display_name,job_title').eq('user_id',who.id).maybeSingle();
   if(error)return fail(error);
   return data?{id:data.user_id,name:data.display_name,title:data.job_title,email:who.email}:null;
  },
  async saveProfile(name,title){
   const who=await this.user();
   if(!who)return {ok:false,reason:'signed-out'};
   const {data,error}=await scoped(TABLES.profiles)
    .update({display_name:name,job_title:title||null,updated_at:new Date().toISOString()})
    .eq('user_id',who.id).select('user_id,display_name,job_title').maybeSingle();
   if(error)return fail(error);
   return data?{ok:true,name:data.display_name,title:data.job_title}:{ok:false,reason:'missing'};
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
