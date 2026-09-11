(function(root){
'use strict';
// What the application works with is one state object. What is stored is three documents.
// The session is the only place that knows both, so app.js keeps handing a whole state
// around and never learns which adapter it is talking to.
//
// Writes are serialised rather than debounced: one save is in flight at a time and the
// newest pending state replaces any older one. A timer would make the behaviour depend on
// the clock; this does not, and it cannot interleave two writes of the same voyage.

const Schema=typeof module!=='undefined'&&module.exports?require('./schema'):root.ProjectXSchema;

const copy=x=>JSON.parse(JSON.stringify(x));
const stable=x=>JSON.stringify(x);

function create(storage,options={}){
 const fresh=options.fresh||(()=>({}));          // a blank state, supplied by the model
 let current=null;                                // {id,name,revision,catalogRevision}
 let catalogRevision=0;
 let writtenCatalogs=null;                        // last catalogs written, to avoid rewriting them
 let writtenSales=null;                           // last sale documents written, without their versions
 const saleRevisions=new Map();                   // sale id -> version last seen from storage
 let inFlight=null,queued=null;

 const assemble=(catalogs,sales,voyage)=>Schema.merge({
  catalogs,
  sales:{sales},
  voyage
 });

 function adopt(catalogs,rows,record){
  const sales=salesOf(rows);
  catalogRevision=catalogs.revision;
  writtenCatalogs=stable(catalogs.document);
  writtenSales=stable(sales);
  saleRevisions.clear();
  if(Array.isArray(rows))for(const row of rows)saleRevisions.set(row.id,row.revision);
  current=record?{id:record.id,name:record.name,revision:record.revision,catalogRevision:record.catalogRevision}:null;
  return assemble(catalogs.document,sales,record?record.document:fresh());
 }

 const salesOf=rows=>Array.isArray(rows)?rows.map(row=>row.document):[];

 // A blank workspace still needs one calculation to write into, otherwise the first edit has
 // nowhere to go and the user would have to know to create one.
 async function ensureVoyage(catalogs,rows,list,preferred){
  const chosen=list.find(x=>x.id===preferred)||list[0];
  if(chosen){
   const record=await storage.loadVoyage(chosen.id);
   if(record)return adopt(catalogs,rows,record);
  }
  const state=adopt(catalogs,rows,null);
  const parts=Schema.split(state);
  const created=await storage.createVoyage(options.firstName||'Calculation 1',parts.voyage,catalogs.revision);
  current={id:created.id,name:created.name,revision:created.revision,catalogRevision:created.catalogRevision??catalogs.revision};

  // A new workspace starts from the model's seeded registers. Store them now rather than on
  // whichever edit happens to come first, so what is on disk matches what is on screen.
  // A failure here leaves the workspace half-seeded, so it is reported rather than swallowed.
  if(stable(parts.catalogs)!==writtenCatalogs){
   const written=await storage.saveCatalogs(parts.catalogs,catalogRevision);
   if(!written.ok)throw Error(written.error||'The reference catalogs could not be stored');
   catalogRevision=written.revision;writtenCatalogs=stable(parts.catalogs);
  }
  for(const sale of parts.sales.sales||[]){
   const written=await storage.saveSale(sale.id,sale,0);
   if(!written.ok)throw Error(written.error||'The sales register could not be stored');
   saleRevisions.set(sale.id,written.revision);
  }
  writtenSales=stable(parts.sales.sales||[]);
  return state;
 }

 return {
  get current(){return current&&{...current};},
  get catalogRevision(){return catalogRevision;},
  get busy(){return !!inFlight;},

  // localStorage is synchronous, and pretending otherwise would make the page render a
  // loading state it never needs. An adapter that cannot answer at once returns nothing here
  // and the caller awaits open() instead.
  openSync(preferred){
   if(typeof storage.openSync!=='function')return null;
   const opened=storage.openSync(preferred);
   if(!opened)return null;
   return {state:adopt(opened.catalogs,opened.sales,opened.voyage),voyage:current};
  },

  async open(preferred){
   const catalogs=await storage.loadCatalogs();
   if(catalogs&&catalogs.ok===false)return {error:catalogs.error||'The workspace could not be opened'};
   const rows=await storage.listSales();
   if(rows&&rows.ok===false)return {error:rows.error||'The sales register could not be opened'};
   const list=await storage.listVoyages();
   if(list&&list.ok===false)return {error:list.error||'The calculations could not be listed'};
   const state=await ensureVoyage(catalogs,rows,list,preferred);
   return {state,voyage:current};
  },

  async list(){const rows=await storage.listVoyages();return Array.isArray(rows)?rows:[];},

  async save(state){
   if(!current)return {ok:false,reason:'no-calculation'};
   queued=copy(state);
   if(inFlight)return inFlight;
   inFlight=(async()=>{
    let result={ok:true};
    while(queued){
     const next=queued;queued=null;
     result=await writeOnce(next);
     if(!result.ok)break;
    }
    inFlight=null;
    return result;
   })();
   return inFlight;
  },

  async rename(id,name){
   const result=await storage.renameVoyage(id,name);
   if(result.ok&&current&&current.id===id)current={...current,name};
   return result;
  },

  async remove(id){return storage.deleteVoyage(id);},

  async createNamed(name,state){
   const parts=Schema.split(state);
   const created=await storage.createVoyage(name,parts.voyage,catalogRevision);
   if(created.ok===false)return created;
   current={id:created.id,name:created.name,revision:created.revision,catalogRevision:created.catalogRevision??catalogRevision};
   return created;
  },

  async switchTo(id){
   const record=await storage.loadVoyage(id);
   if(!record)return {ok:false,reason:'missing'};
   const catalogs=await storage.loadCatalogs();
   const rows=await storage.listSales();
   return {ok:true,state:adopt(catalogs,rows,record),voyage:current};
  },

  async snapshot(label){
   if(!current)return {ok:false,reason:'no-calculation'};
   return storage.snapshot(current.id,label);
  }
 };

 // One write of one state. Shared registers are only sent when they actually changed, so a
 // keystroke in the voyage does not rewrite the organisation's catalogs.
 async function writeOnce(state){
  const parts=Schema.split(state);
  const sales=parts.sales.sales||[];

  if(stable(parts.catalogs)!==writtenCatalogs){
   const written=await storage.saveCatalogs(parts.catalogs,catalogRevision);
   if(!written.ok)return written;
   catalogRevision=written.revision;
   writtenCatalogs=stable(parts.catalogs);
  }

  if(stable(sales)!==writtenSales){
   const previous=JSON.parse(writtenSales||'[]');
   for(const sale of sales){
    const before=previous.find(x=>x.id===sale.id);
    if(before&&stable(before)===stable(sale))continue;
    const written=await storage.saveSale(sale.id,sale,saleRevisions.get(sale.id)||0);
    if(!written.ok)return written;
    saleRevisions.set(sale.id,written.revision);
   }
   for(const before of previous)if(!sales.some(x=>x.id===before.id)){
    await storage.deleteSale(before.id);
    saleRevisions.delete(before.id);
   }
   writtenSales=stable(sales);
  }

  const written=await storage.saveVoyage(current.id,parts.voyage,current.revision);
  if(!written.ok)return written;
  current={...current,revision:written.revision};
  return {ok:true,revision:written.revision};
 }
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXSession=api;
})(globalThis);
