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
 // The shared registers are rows, so each is tracked the way sales are: what was last written,
 // and what version each record was at. That is what lets a keystroke in one cargo leave the
 // other ninety-six untouched, and two people edit different records without colliding.
 const writtenRegisters=new Map();                // register name -> JSON of what was written
 const registerRevisions=new Map();               // register name -> Map(id -> version)
 let inFlight=null,queued=null;

 const assemble=(catalogs,sales,voyage,registers)=>Schema.merge({
  catalogs,
  sales:{sales},
  voyage,
  registers
 });

 function adopt(catalogs,rows,record,registers){
  const sales=salesOf(rows);
  catalogRevision=catalogs.revision;
  writtenCatalogs=stable(catalogs.document);
  writtenSales=stable(sales);
  saleRevisions.clear();
  if(Array.isArray(rows))for(const row of rows)saleRevisions.set(row.id,row.revision);

  // What writeOnce will send has to be what adopt recorded, or the first save rewrites the
  // catalogs document for no reason — and on a shared deployment collides with everyone else
  // doing the same. With per-row registers in use, only the markers travel in that document.
  if(registers){
   const markers={};
   for(const key of Schema.MARKER_KEYS)
    if(catalogs.document&&Object.hasOwn(catalogs.document,key))markers[key]=catalogs.document[key];
   writtenCatalogs=stable(markers);
  }

  writtenRegisters.clear();registerRevisions.clear();
  const held={};
  // An adapter that does not answer with registers leaves them alone. Absent and empty are
  // different: blanking a register because it was not read would erase the organisation's
  // catalogue on the next write.
  for(const name of Schema.REGISTER_KEYS){
   if(!registers||!Array.isArray(registers[name]))continue;
   const list=registers[name];
   held[name]=list.map(r=>r.document);
   writtenRegisters.set(name,stable(held[name]));
   registerRevisions.set(name,new Map(list.map(r=>[r.id,r.revision])));
  }

  current=record?{id:record.id,name:record.name,revision:record.revision,catalogRevision:record.catalogRevision}:null;
  return assemble(catalogs.document,sales,record?record.document:fresh(),held);
 }

 const salesOf=rows=>Array.isArray(rows)?rows.map(row=>row.document):[];

 // A blank workspace still needs one calculation to write into, otherwise the first edit has
 // nowhere to go and the user would have to know to create one.
 async function ensureVoyage(catalogs,rows,list,preferred,registers){
  const chosen=list.find(x=>x.id===preferred)||list[0];
  if(chosen){
   const record=await storage.loadVoyage(chosen.id);
   if(record)return adopt(catalogs,rows,record,registers);
  }
  // Nothing is stored yet, so the registers come from the model's seed rather than from
  // storage: empty rows here mean "not written", not "the organisation has no cargoes".
  const state=adopt(catalogs,rows,null,null);
  const parts=Schema.split(state);
  const created=await storage.createVoyage(options.firstName||'Calculation 1',parts.voyage,catalogs.revision);
  current={id:created.id,name:created.name,revision:created.revision,catalogRevision:created.catalogRevision??catalogs.revision};

  // A new workspace starts from the model's seeded registers. Store them now rather than on
  // whichever edit happens to come first, so what is on disk matches what is on screen.
  // A failure here leaves the workspace half-seeded, so it is reported rather than swallowed.
  const perRow=typeof storage.saveRegisterRow==='function';
  const catalogsDocument=perRow?parts.markers:parts.catalogs;
  if(stable(catalogsDocument)!==writtenCatalogs){
   const written=await storage.saveCatalogs(catalogsDocument,catalogRevision);
   if(!written.ok)throw Error(written.error||'The reference catalogs could not be stored');
   catalogRevision=written.revision;writtenCatalogs=stable(catalogsDocument);
  }

  if(perRow){
   for(const name of Schema.REGISTER_KEYS){
    const versions=new Map();
    for(const row of parts.registers[name]||[]){
     if(!row||!row.id)continue;
     const written=await storage.saveRegisterRow(name,row.id,row,0);
     if(!written.ok)throw Error(written.error||('The '+name+' register could not be stored'));
     versions.set(row.id,written.revision);
    }
    registerRevisions.set(name,versions);
    writtenRegisters.set(name,stable(parts.registers[name]||[]));
   }
   return state;
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
   return {state:adopt(opened.catalogs,opened.sales,opened.voyage,opened.registers),voyage:current};
  },

  async open(preferred){
   const catalogs=await storage.loadCatalogs();
   if(catalogs&&catalogs.ok===false)return {error:catalogs.error||'The workspace could not be opened'};
   const registers=typeof storage.loadRegisters==='function'?await storage.loadRegisters():null;
   if(registers&&registers.ok===false)return {error:registers.error||'The shared registers could not be opened'};
   const rows=registers&&registers.sales?registers.sales:await storage.listSales();
   if(rows&&rows.ok===false)return {error:rows.error||'The sales register could not be opened'};
   const list=await storage.listVoyages();
   if(list&&list.ok===false)return {error:list.error||'The calculations could not be listed'};
   const state=await ensureVoyage(catalogs,rows,list,preferred,registers);
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
   const registers=typeof storage.loadRegisters==='function'?await storage.loadRegisters():null;
   const rows=registers&&registers.sales?registers.sales:await storage.listSales();
   return {ok:true,state:adopt(catalogs,rows,record,registers),voyage:current};
  },

  async snapshot(label){
   if(!current)return {ok:false,reason:'no-calculation'};
   return storage.snapshot(current.id,label);
  }
 };

 // One write of one state. Shared registers are only sent when they actually changed, so a
 // keystroke in the voyage does not rewrite the organisation's catalogs.
 // One record of one register. Only what changed is sent, so a keystroke in one cargo leaves
 // the other ninety-six alone and two people editing different records never meet.
 async function writeRegister(name,rows){
  if(!writtenRegisters.has(name))return null;                 // not read, so not ours to write
  if(stable(rows)===writtenRegisters.get(name))return null;
  const previous=JSON.parse(writtenRegisters.get(name)||'[]');
  const versions=registerRevisions.get(name)||new Map();
  for(const row of rows){
   if(!row||!row.id)continue;                                 // no key, no row; reported by unkeyed()
   const before=previous.find(x=>x&&x.id===row.id);
   if(before&&stable(before)===stable(row))continue;
   const written=await storage.saveRegisterRow(name,row.id,row,versions.get(row.id)||0);
   if(!written.ok)return written;
   versions.set(row.id,written.revision);
  }
  for(const before of previous)if(before&&before.id&&!rows.some(x=>x&&x.id===before.id)){
   await storage.deleteRegisterRow(name,before.id);
   versions.delete(before.id);
  }
  registerRevisions.set(name,versions);
  writtenRegisters.set(name,stable(rows));
  return null;
 }

 async function writeOnce(state){
  const parts=Schema.split(state);
  const sales=parts.sales.sales||[];
  const perRow=typeof storage.saveRegisterRow==='function';

  // The catalogs document is the housekeeping markers once the registers are rows of their
  // own; on an adapter that has no per-row registers it is still everything.
  const catalogsDocument=perRow?parts.markers:parts.catalogs;
  if(stable(catalogsDocument)!==writtenCatalogs){
   const written=await storage.saveCatalogs(catalogsDocument,catalogRevision);
   if(!written.ok)return written;
   catalogRevision=written.revision;
   writtenCatalogs=stable(catalogsDocument);
  }

  if(perRow){
   for(const name of Schema.REGISTER_KEYS){
    const failed=await writeRegister(name,parts.registers[name]||[]);
    if(failed)return failed;
   }
  }

  // Sales predate the per-row registers and keep their own path for an adapter without them.
  if(!perRow&&stable(sales)!==writtenSales){
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
