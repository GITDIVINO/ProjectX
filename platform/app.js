(function(){
'use strict';
const M=window.ProjectXModel,$=id=>document.getElementById(id),key='projectx-current-v2',backupKey=key+'-backup',currentKey='projectx-open-calculation',tabKey='projectx-current-tab',tabs=['planner','register','sale','cargo','ports','vessel','market','guide'];
let marketReport='',marketRegion='';
try{const view=JSON.parse(sessionStorage.getItem('projectx-market-view')||'null');if(view){marketReport=view.report;marketRegion=view.region;}}catch{}
function renderMarket(){
 $('app').innerHTML=window.ProjectXMarket.render(marketReport,marketRegion);
}
$('app').addEventListener('change',e=>{
 if(e.target.id!=='market-report'&&e.target.id!=='market-region')return;
 const focus=e.target.id;
 if(focus==='market-report'){marketReport=e.target.value;marketRegion='';}else marketRegion=e.target.value;
 try{sessionStorage.setItem('projectx-market-view',JSON.stringify({report:marketReport,region:marketRegion}));}catch{}
 renderMarket();$(focus)?.focus();
});
let currentTab='planner',startupMessage='';
const {esc,numberFormat,fmt,num,orDash,round,tonnage,sumOf,table,foldBlock,ringPath,linePath}=window.ProjectXFormat;
const P=window.ProjectXPlanning;
const plannerUI=window.ProjectXPlannerUI.create({M,P,getState:()=>state,changed,openTab:tab=>{currentTab=tab;syncWorkspace();render();}});
try{const savedTab=sessionStorage.getItem(tabKey);if(tabs.includes(savedTab))currentTab=savedTab;}catch{}
function readSave(text){return validateSave(JSON.parse(text));}
function validateSave(saved){
 if(!saved||saved.version!==2||!['lots','ports','holds','legs','allocations','costs'].every(k=>Array.isArray(saved[k]))||!['deductions','prices','ballast'].every(k=>saved[k]&&typeof saved[k]==='object'))throw Error('Invalid saved calculation');
 M.ensureCatalogs(saved);M.syncRoute(saved);M.compute(saved);
 return saved;
}
// The application works with one state; the session turns that into the stored documents and
// hides which adapter is behind them. A synchronous adapter answers at once and the saved
// calculation is on screen at first paint; anything else is awaited in start().
// The store, the configuration and the client factory are handed in rather than picked up
// from whatever global the storage module happens to see. That is what the page has, and it
// keeps the dependency visible instead of ambient.
const storage=window.ProjectXStorage.create({
 store:typeof localStorage!=='undefined'?localStorage:null,
 config:window.PROJECTX_CONFIG||null,
 createClient:window.supabase&&window.supabase.createClient
});
const session=window.ProjectXSession.create(storage,{fresh:()=>M.initial(),firstName:'Calculation 1'});
let state=M.initial(),voyage=null,pendingOpen=null,account=null;
const recall=()=>{try{return localStorage.getItem(currentKey);}catch{return null;}};
const remember=id=>{try{localStorage.setItem(currentKey,id);}catch{}};
function adopt(loaded){
 if(!loaded||!loaded.state)return false;
 try{validateSave(loaded.state);}catch{return false;}
 state=loaded.state;voyage=loaded.voyage||null;
 if(voyage)remember(voyage.id);
 return true;
}
try{
 if(!adopt(session.openSync(recall())))pendingOpen=session.open(recall());
 if(storage.degraded)startupMessage=storage.degraded;
}catch{startupMessage='Browser storage is unavailable. Changes cannot be saved in this browser.';}
function get(path){return path.split('.').reduce((a,k)=>a[k],state);}function set(path,value){const bits=path.split('.'),last=bits.pop();bits.reduce((a,k)=>a[k],state)[last]=value;}
function input(path,label,options={}){
 if(options.tonnage)return `<input aria-label="${esc(label)}" data-path="${path}" type="text" inputmode="decimal" data-format="tonnage" value="${esc(fmt(get(path),1))}" placeholder="—" ${options.disabled?'disabled':''}>`;
 return `<input aria-label="${esc(label)}" data-path="${path}" type="${options.type||'number'}" ${options.type?'':'min="0" step="any"'} value="${esc(get(path))}" placeholder="${esc(options.placeholder||'—')}" ${options.list?`list="${esc(options.list)}"`:''} ${options.disabled?'disabled':''}>`;}
function select(path,label,values){return `<select aria-label="${esc(label)}" data-path="${path}">${values.map(v=>{const [id,name]=Array.isArray(v)?v:[v,v];return `<option value="${esc(id)}" ${String(get(path)??'')===String(id)?'selected':''}>${esc(name)}</option>`;}).join('')}</select>`;}
function field(path,label,options){return `<label class="field">${label}${input(path,label,options)}</label>`;}
const chosen=()=>state.lots.filter(l=>l.selected);
// The particulars are one plate in upper case. The case is in the text, not in a style rule,
// so the line carries it wherever it goes: on screen, in print, and in a copy of it.

// The voyage on an equirectangular world. The drawn track is the check on the distance beside it:
// a leg that loops out to sea and back is visible long before the number looks wrong.
// The map is built by voyage-map.js; it needs the document only to measure what it drew.
const voyageMapView=window.ProjectXVoyageMap.create({M,getState:()=>state,document,esc,fmt,round,table,ringPath,linePath,
 Sea:typeof window!=='undefined'?window.ProjectXSeaRoute:null});
const {voyageLegs,syncRouteDistances,fitMapFrame,zoomMap,panMap,resetMap,mapPoint,paintMapView,voyageMap,voyageDistanceLine}=voyageMapView;
// Typing into a leg distance makes it the user's figure; clearing it hands the leg back to the estimate.
function noteManualEntry(path,value){
 if(path==='ballast.distance'){state.ballast.distanceSource=value===null?null:'entered';return;}
 const m=/^legs\.(\d+)\.distance$/.exec(path||'');
 if(m&&state.legs[m[1]])state.legs[m[1]].distanceSource=value===null?null:'entered';
}
// The voyage stated as the chain it is: time, then what it costs, then what it earns,
// then what is left. Every line is an equation with its own parts, so the total can be
// The PLANNER screen is built by planner-view.js; this hands it the computed result and
// does the document work around it: the animation snapshot, the open folds, the map frame.
const plannerView=window.ProjectXPlannerView.create({M,P,getState:()=>state,esc,fmt,num,orDash,round,
 table,foldBlock,sumOf,field,input,select,chosen,plannerUI,voyageMap,voyageDistanceLine,voyageLegs,
 shipmentWindow:x=>shipmentWindow(x),cargoDetails:x=>cargoDetails(x),portNames:()=>portNames()});
const {intakeKey}=plannerView;
function render(){if(currentTab==='market'){renderMarket();return;}if(currentTab==='register'){renderRegister();return;}if(currentTab==='guide'){$('app').innerHTML=window.ProjectXGuide.render();return;}if(currentTab!=='planner'){renderCatalog();return;}P.syncAutoDraftLoss(state);syncRouteDistances();const motion=plannerUI.motionSnapshot();const open=[...document.querySelectorAll('details[open]')].map(d=>d.id);const r=M.compute(state),b=r.budget,ship=r.ship;const lots=chosen();
 const html=plannerView.markup(r,b,ship,lots);
 $('app').innerHTML=html;plannerUI.animate(motion);open.forEach(id=>{if($(id))$(id).open=true;});fitMapFrame();}
function ensureLegs(){state.vesselId??='tbn-1';M.ensureCatalogs(state);M.anonymizeProfiles(state);M.migrateBaltic(state);M.syncRoute(state);P.ensure(state);P.syncAutoDraftLoss(state);}
function changed(){ensureLegs();$('status').textContent='';saveCalculation(false);render();}
function editableLotField(path){return !path?.startsWith('lots.')||/^lots\.\d+\.selected$/.test(path);}
$('app').addEventListener('change',e=>{const el=e.target;if(!editableLotField(el.dataset.path)){$('status').textContent='Cargo properties are read-only in PLANNER. Edit them in CARGO.';render();return;}if(el.dataset.path==='vesselId'){try{M.applyVessel(state,el.value);changed();}catch(error){$('status').textContent=error.message;render();}return;}if(el.dataset.path){let value=el.type==='checkbox'?el.checked:el.dataset.format==='tonnage'?(el.value.trim()===''?null:tonnage(el.value)):el.type==='number'?(el.value===''?null:Number(el.value)):el.value;noteManualEntry(el.dataset.path,value);if(el.dataset.path.startsWith('sales.')){
 const [,index,fieldName]=el.dataset.path.split('.');
 try{M.updateSale(state,state.sales[Number(index)].id,{[fieldName]:value});changed();}catch(error){render();$('status').textContent=error.message;}
 return;
}
if(el.dataset.path.startsWith('portRecords.')){
 const [,index,fieldName]=el.dataset.path.split('.');
 try{M.updatePortRecord(state,Number(index),fieldName,value);changed();}catch(error){render();$('status').textContent=error.message;}
 return;
}
if(el.dataset.path.startsWith('cargoTypes.')&&el.dataset.path.endsWith('.sf')&&!M.ok(value,true)){el.value=get(el.dataset.path);$('status').textContent='Enter a positive planning SF';return;}
if(/\.planning\.(arrival|departure)\.(aft|mid|fwd)$/.test(el.dataset.path)&&value!==null&&!M.ok(value,true)){el.value=get(el.dataset.path)??'';$('status').textContent='Enter a positive draft';return;}
if(/\.planning\.(arrival|departure)\.trim$/.test(el.dataset.path)&&value!==null&&(!Number.isFinite(value)||Math.abs(value)>10)){el.value=get(el.dataset.path)??'';$('status').textContent='Enter trim in metres, positive by the stern';return;}set(el.dataset.path,value);if(el.dataset.path.endsWith('.sf')){const prefix=el.dataset.path.slice(0,-3);set(prefix+'.sfBasis','user-entered');}if(el.dataset.path.endsWith('.selected'))state.allocations=state.allocations.filter(a=>chosen().some(l=>l.id===a.lot));if(el.dataset.path.startsWith('sales.'))M.syncSalesToLots(state);changed();}else if(el.dataset.lot){if(state.stage!=='load')return;const quantity=tonnage(el.value),lot=el.dataset.lot,hold=Number(el.dataset.hold);if(!M.ok(quantity)){el.value='';$('status').textContent='Enter non-negative tonnage';return;}state.allocations=state.allocations.filter(a=>!(a.lot===lot&&a.hold===hold));if(quantity>0)state.allocations.push({lot,hold,quantity});$('status').textContent='';saveCalculation(false);}});
$('app').addEventListener('toggle',e=>{
 if(e.target.id==='voyage-map'&&e.target.open)fitMapFrame();
},true);
$('app').addEventListener('wheel',e=>{
 const svg=e.target.closest?.('.voyage-map svg');if(!svg)return;
 e.preventDefault();zoomMap(e.deltaY<0?.85:1.18,mapPoint(svg,e));
},{passive:false});
$('app').addEventListener('pointerdown',e=>{
 const svg=e.target.closest?.('.voyage-map svg');if(!svg||e.button)return;
 let last=mapPoint(svg,e);if(!last)return;
 svg.setPointerCapture(e.pointerId);svg.classList.add('sea-dragging');
 const move=event=>{const now=mapPoint(svg,event);if(!now)return;panMap(now.x-last.x,now.y-last.y);last=mapPoint(svg,event);};
 const stop=()=>{svg.classList.remove('sea-dragging');svg.removeEventListener('pointermove',move);svg.removeEventListener('pointerup',stop);svg.removeEventListener('pointercancel',stop);};
 svg.addEventListener('pointermove',move);svg.addEventListener('pointerup',stop);svg.addEventListener('pointercancel',stop);
});
// The register's editor is a real form, so Enter submits it. Nothing is posted anywhere:
// the page handles it, and form-action in the deployed policy forbids the alternative.
$('app').addEventListener('submit',e=>{
 const form=e.target.closest&&e.target.closest('.register-editor');
 if(!form)return;
 e.preventDefault();
 saveCalculationRow(form.dataset.id);
});
$('app').addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;if(plannerUI.action(el.dataset.action,el))return;switch(el.dataset.action){case'open-sale':openSale(el.dataset.id);return;case'new-sale':showSaleDialog();return;
 case'open-calculation':openCalculation(el.dataset.id).then(()=>{currentTab='register'===currentTab?'planner':currentTab;syncWorkspace();render();});return;
 case'expand-calculation':toggleCalculation(el.dataset.id);return;
 case'save-calculation-row':saveCalculationRow(el.dataset.id);return;
 case'new-calculation-row':newCalculation().then(refreshRegister);return;
 case'delete-calculation-row':deleteCalculation(el.dataset.id).then(refreshRegister);return;
 case'map-zoom':zoomMap(Number(el.dataset.factor));return;
 case'map-reset':resetMap();return;
 case'new-port':state.portRecords.push({id:'P'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),name:'',country:'',terminal:'',berth:'Berth 1',notes:'',da:null,...Object.fromEntries(M.PORT_LIMIT_FIELDS.map(k=>[k,null]))});break;
 case'remove-sale':{const sale=state.sales[Number(el.dataset.index)];if(state.lots.some(l=>l.saleId===sale.id)){$('status').textContent='First remove the sale from PLANNER';return;}state.sales.splice(Number(el.dataset.index),1);break;}
 case'remove-port-record':try{M.removePortRecord(state,Number(el.dataset.index));}catch(error){$('status').textContent=error.message;return;}break;
 case'new-vessel':M.addVesselType(state);changed();$('status').textContent='';return;
 case'new-cargo':showCargoDialog();return;
 case'apply-cargo':try{M.applyCargo(state,el.dataset.id);changed();$('status').textContent='';}catch(error){$('status').textContent=error.message;}return;
 case'apply-vessel':try{M.applyVessel(state,el.dataset.id);changed();$('status').textContent='';}catch(error){$('status').textContent=error.message;}return;
 case'add-lot':showLotDialog();return;
 case'remove-lot':{const l=state.lots[Number(el.dataset.index)];state.allocations=state.allocations.filter(a=>a.lot!==l.id);state.lots.splice(Number(el.dataset.index),1);break;}
 case'move-port':M.moveCall(state,el.dataset.port,Number(el.dataset.direction));break;
 case'calc-intake':state.intakeShownFor=intakeKey();break;
 case'add-cost':state.costs.push({name:'Additional item',amount:null,days:0,burn:2.7,fuel:'main'});break;
 case'remove-cost':state.costs.splice(Number(el.dataset.index),1);break;}changed();});
// Saving is asynchronous now, and the session serialises the writes: the newest state
// replaces any older one still waiting, so typing cannot queue a hundred writes.
function saveCalculation(clearStatus=true){
 if(clearStatus)$('status').textContent='';
 session.save(state).then(result=>{
  if(result.ok)return;
  if(result.reason==='conflict')
   $('status').textContent='This calculation was changed elsewhere. Your edit was not saved. Reload to see the other version.';
  else if(result.reason==='no-calculation')
   $('status').textContent='No calculation is open. Your changes have not been saved.';
  else
   $('status').textContent='Your changes have not been saved. '+(result.error||'Storage is unavailable.');
 }).catch(()=>{$('status').textContent='Your changes have not been saved. Storage is unavailable.';});
 return true;
}
$('save').onclick=()=>saveCalculation(true);

$('reset').onclick=()=>{if(!confirm('Clear the current calculation and its local save?'))return;const catalogs={cargoTypes:state.cargoTypes,vesselProfiles:state.vesselProfiles,sales:state.sales,portRecords:state.portRecords};state=M.initial();Object.assign(state,catalogs);ensureLegs();saveCalculation(true);render();};
$('pdf').onclick=()=>{window.print();};
// The dialogs are built by dialogs.js. It is handed a setter as well as a getter: the sale
// picker swaps the whole state at once so a bad sale cannot leave the voyage half-changed.
const dialogs=window.ProjectXDialogs.create({M,getState:()=>state,setState:next=>{state=next;},
 document,esc,fmt,numberFormat,input,select,field,table,changed,byId:$,
 openTab:tab=>{currentTab=tab;try{sessionStorage.setItem(tabKey,currentTab);}catch{}syncWorkspace();render();}});
const {shipmentWindow,openSale,showLotDialog,showSaleDialog,showCargoDialog,cargoDetails}=dialogs;
const portNames=()=>[...new Set(state.portRecords.filter(p=>p.name.trim()).map(p=>p.name))].map(name=>[name,name]);
// A port with one registered row has nothing to choose; the row still carries the terminal and its limits.
// SALE, PORT, CARGO and VESSEL are built by catalog-views.js; this places what it returns.
const catalogViews=window.ProjectXCatalogViews.create({M,getState:()=>state,esc,fmt,input,select,field,table,portNames});
function renderCatalog(){M.ensureCatalogs(state);$('app').innerHTML=catalogViews.render(currentTab);}
function setupChrome(){if(document.documentElement)document.documentElement.lang='en';}
function syncWorkspace(){for(const name of tabs)$('tab-'+name).setAttribute('aria-selected',String(name===currentTab));const outsidePlanner=currentTab!=='planner';$('planner-actions').hidden=outsidePlanner;$('planner-footer').hidden=false;if($('reset-top'))$('reset-top').hidden=outsidePlanner;}
for(const tab of tabs)$('tab-'+tab).onclick=()=>{currentTab=tab;try{sessionStorage.setItem(tabKey,tab);}catch{}syncWorkspace();render();};
function filterCargo(){const q=($('cargo-search')?.value||'').toLowerCase().trim();const family=$('cargo-family')?.value||'';document.querySelectorAll('[data-catalog-name]').forEach(row=>row.hidden=!(q.split(/\s+/).every(word=>row.dataset.catalogName.includes(word))&&(!family||row.dataset.family===family)));}
$('app').addEventListener('input',e=>{
 const el=e.target;if(el.id==='cargo-search'){filterCargo();return;}
 if(currentTab!=='planner')return;
 if(el.dataset.path&&editableLotField(el.dataset.path)){
  const value=el.type==='checkbox'?el.checked:el.type==='number'?(el.value===''?null:Number(el.value)):el.value;
  noteManualEntry(el.dataset.path,value);set(el.dataset.path,value);saveCalculation(false);return;
 }
 if(el.dataset.lot){
  if(state.stage!=='load')return;
  const quantity=tonnage(el.value),hold=Number(el.dataset.hold);
  if(!M.ok(quantity))return;
  state.allocations=state.allocations.filter(a=>!(a.lot===el.dataset.lot&&a.hold===hold));
  if(quantity>0)state.allocations.push({lot:el.dataset.lot,hold,quantity});
  saveCalculation(false);plannerUI.refresh();
 }
});
$('app').addEventListener('change',e=>{if(e.target.id==='cargo-family')filterCargo();});

if(window.addEventListener)window.addEventListener('beforeprint',()=>document.querySelectorAll('.cargo-fill').forEach(el=>el.getAnimations?.().forEach(a=>a.finish())));
if(window.addEventListener)window.addEventListener('resize',fitMapFrame);
if(document.addEventListener){document.addEventListener('invalid',e=>{const el=e.target;if(el.setCustomValidity)el.setCustomValidity(el.validity.valueMissing?'Complete this field.':'Enter a valid value for this field.');},true);document.addEventListener('input',e=>{if(e.target.setCustomValidity)e.target.setCustomValidity('');},true);}
// The list of calculations. Names are the user's text, so every one is escaped.
async function refreshCalculations(){
 const select=$('calculation');
 if(!select)return;
 let list=[];
 try{list=await session.list();}catch{list=[];}
 const open=voyage&&voyage.id;
 select.innerHTML=list.map(item=>`<option value="${esc(item.id)}" ${item.id===open?'selected':''}>${esc(item.name)}</option>`).join('')
  ||'<option value="">No calculations</option>';
}
async function openCalculation(id){
 if(!id||(voyage&&voyage.id===id))return;
 const result=await session.switchTo(id);
 if(!result.ok||!adopt(result)){$('status').textContent='That calculation could not be opened.';return;}
 ensureLegs();syncWorkspace();render();await refreshCalculations();
}
// CALCULATIONS: the register of everything the organisation holds. It is read fresh each time
// the tab is drawn, because on a shared deployment a colleague may have added one since.
const registerView=window.ProjectXRegisterView.create({esc,fmt,table});
let registerRows=null,registerMembers=null,expandedCalculation=null;

const drawRegister=()=>{
 $('app').innerHTML=registerView.render(registerRows,voyage&&voyage.id,account,expandedCalculation,registerMembers);
};
function renderRegister(){
 drawRegister();
 if(registerRows===null)refreshRegister();
}
async function refreshRegister(){
 try{registerRows=await storage.listRegister();}
 catch(e){registerRows={ok:false,error:e.message};}
 await membersList();
 if(currentTab==='register')drawRegister();
}
async function membersList(){
 if(registerMembers)return registerMembers;
 try{const list=await storage.members();registerMembers=Array.isArray(list)?list:[];}
 catch{registerMembers=[];}
 return registerMembers;
}

// Opening a row out is a view state, not a stored one: it belongs to this screen and this
// person, and closing it changes nothing.
async function toggleCalculation(id){
 expandedCalculation=expandedCalculation===id?null:id;
 if(expandedCalculation)await membersList();
 drawRegister();
 const form=document.querySelector?.('.register-editor input[name="name"]');
 if(form&&form.focus)form.focus();
}

// The name and who is responsible are what the register owns. Everything else about a
// calculation is edited in the planner, which is why the form offers these and nothing more.
async function saveCalculationRow(id){
 const form=document.querySelector?.('.register-editor[data-id="'+id+'"]');
 if(!form)return;
 const rows=Array.isArray(registerRows)?registerRows:[];
 const row=rows.find(r=>r.id===id);
 if(!row)return;
 const name=(form.querySelector('[name="name"]')||{}).value||'';
 const responsible=(form.querySelector('[name="responsible"]')||{}).value||null;
 if(!name.trim()){$('status').textContent='A calculation needs a name.';return;}

 const changes=[];
 if(name.trim()!==row.name){
  const renamed=await session.rename(id,name.trim());
  if(!renamed.ok){$('status').textContent='The calculation could not be renamed.';return;}
  if(voyage&&voyage.id===id)voyage={...voyage,name:name.trim()};
  changes.push('renamed');
 }
 if(responsible&&responsible!==row.responsibleId){
  const handed=await storage.setResponsible(id,responsible);
  if(!handed.ok){$('status').textContent='The calculation could not be handed over.';return;}
  const to=(registerMembers||[]).find(m=>m.id===responsible);
  changes.push('now with '+(to?to.name:'somebody else'));
 }
 $('status').textContent=changes.length?'"'+name.trim()+'" '+changes.join(' and ')+'.':'Nothing to change.';
 expandedCalculation=null;
 await refreshCalculations();
 await refreshRegister();
}

// Creating, renaming and deleting a calculation are the same three operations whether they
// are reached from the picker beside the planner or from the register. They are named once.
async function newCalculation(){
 const name=prompt('Name for the new calculation','Calculation');
 if(!name||!name.trim())return false;
 // The registers stay shared; only the voyage starts empty.
 const blank=M.initial();
 for(const shared of ['cargoTypes','vesselProfiles','portRecords','sales'])blank[shared]=JSON.parse(JSON.stringify(state[shared]));
 const created=await session.createNamed(name.trim(),blank);
 if(created.ok===false){$('status').textContent='The calculation could not be created.';return false;}
 state=blank;voyage={id:created.id,name:created.name,revision:created.revision,catalogRevision:created.catalogRevision};
 remember(voyage.id);ensureLegs();saveCalculation(true);syncWorkspace();render();await refreshCalculations();
 return true;
}

async function renameCalculation(id){
 const target=id||(voyage&&voyage.id);
 if(!target)return false;
 const rows=Array.isArray(registerRows)?registerRows:[];
 const current=(rows.find(r=>r.id===target)||{}).name||(voyage&&voyage.id===target?voyage.name:'');
 const name=prompt('Rename this calculation',current);
 if(!name||!name.trim())return false;
 const result=await session.rename(target,name.trim());
 if(!result.ok){$('status').textContent='The calculation could not be renamed.';return false;}
 if(voyage&&voyage.id===target)voyage={...voyage,name:name.trim()};
 await refreshCalculations();
 return true;
}

async function deleteCalculation(id){
 const target=id||(voyage&&voyage.id);
 if(!target)return false;
 const list=await session.list();
 // The last calculation is kept: deleting it would leave the next edit with nowhere to go.
 if(list.length<2){$('status').textContent='This is the only calculation. Use Clear calculation to empty it.';return false;}
 const name=(list.find(x=>x.id===target)||{}).name||'this calculation';
 if(!confirm('Delete the calculation "'+name+'"? This cannot be undone.'))return false;
 const removed=await session.remove(target);
 if(!removed.ok){$('status').textContent='The calculation could not be deleted.';return false;}
 if(voyage&&voyage.id===target){voyage=null;await openCalculation(list.find(item=>item.id!==target).id);}
 await refreshCalculations();
 return true;
}

function setupCalculations(){
 const select=$('calculation');
 if(select)select.onchange=()=>{openCalculation(select.value);};
 if($('new-calculation'))$('new-calculation').onclick=()=>newCalculation();
 if($('rename-calculation'))$('rename-calculation').onclick=()=>renameCalculation();
 if($('delete-calculation'))$('delete-calculation').onclick=()=>deleteCalculation();
}

window.ProjectXApp={
 getState:()=>JSON.parse(JSON.stringify(state)),
 getResult:()=>M.compute(state),
 getPlanningResult:()=>P.check(state),
 getCalculation:()=>voyage&&{...voyage},
 listCalculations:()=>session.list(),
 storageKind:storage.kind,
 isShared:!!storage.shared,
 getAccount:()=>account&&{...account},
 signOut:async()=>{account=null;await signIn.signOut();}
};
ensureLegs();setupChrome();setupCalculations();syncWorkspace();render();if(startupMessage)$('status').textContent=startupMessage;

// A shared workspace belongs to an account. Until somebody is signed in the page shows the
// sign-in form and nothing else: no blank calculation that looks like lost work, and no
// planner chrome over data that has not been read.
// Who is working, and for which organisation, is sign-in.js. What happens once they are in
// stays here: the module refuses entry without knowing what a voyage is.
const signIn=window.ProjectXSignIn.create({storage,esc,byId:$,document,
 onSignedIn:async who=>{
  const loaded=await session.open(recall());
  if(loaded&&loaded.error){$('status').textContent=loaded.error;return;}
  if(!adopt(loaded)){$('status').textContent='The workspace could not be opened.';return;}
  account=who;
  ensureLegs();setupCalculations();syncWorkspace();render();
  $('status').textContent='Signed in as '+who.email+' · '+who.organisation;
  await refreshCalculations();
 }});
const startShared=()=>signIn.start();

// An adapter that had to be awaited finishes here and the page is drawn again with the
// workspace it found. A failure says so rather than leaving a blank calculation on screen.
window.ProjectXApp.ready=(storage.shared?startShared():Promise.resolve(pendingOpen).then(loaded=>{
 if(loaded&&loaded.error){$('status').textContent=loaded.error;return;}
 if(loaded&&adopt(loaded)){ensureLegs();syncWorkspace();render();}
}).then(refreshCalculations)).catch(()=>{$('status').textContent='The workspace could not be opened.';});
})();
