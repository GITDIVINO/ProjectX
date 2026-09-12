(function(root){
'use strict';
// The dialogs: adding sales to the voyage, creating a sale, creating a bulk cargo, entering a
// price assessment, and the cargo particulars panel.
//
// They are the part of the interface that writes. The sale picker in particular commits a
// whole selection at once — it builds a candidate state, applies every chosen sale to it, and
// only then hands it over, so one invalid sale cannot leave the voyage half-changed. That is
// why this module is given a setter and not just a getter.
//
// Navigation belongs to the caller: openSale asks for the register to be opened and then
// finds its row, rather than knowing how tabs work.

function create(env){
 const {M,getState,setState,document,esc,fmt,numberFormat,input,select,field,table,changed,openTab,byId}=env;
 const state=getState;
 const $=byId;

 function shipmentWindow(sale){
  const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')&&Number.isFinite(Date.parse(value))
   ?new Date(value+'T00:00:00Z').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}):'—';
  if(!sale?.shipmentFrom&&!sale?.shipmentTo)return '—';
  return esc(date(sale.shipmentFrom)+' – '+date(sale.shipmentTo));
 }
 function openSale(saleId){
  if(!state().sales.some(s=>s.id===saleId))return;
  openTab('sale');
  const row=$('sale-row-'+saleId);
  row?.focus({preventScroll:true});row?.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
 }
 function showLotDialog(){
  const dialog=document.createElement('dialog'),selected=new Set(),added=new Set(state().lots.map(l=>l.saleId));
  dialog.className='sale-picker';dialog.setAttribute('aria-labelledby','sale-picker-title');
  const portOptions=field=>[...new Set(state().sales.map(s=>s[field]).filter(Boolean))].sort().map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('');
  // The picker is a filter over the sales register: search, the two ports and the shipment
  // window, then the result list. Nothing is added until something is selected.
  const filterField=(label,control)=>`<label class="field">${label}${control}</label>`;
  const portFilter=(id,field,all)=>filterField(id==='sale-load'?'Loading':'Discharge',
   `<select id="${id}"><option value="">${all}</option>${portOptions(field)}</select>`);
  dialog.innerHTML=`<form id="lot-form">`+
   `<div class="heading"><h2 id="sale-picker-title">Add sales</h2><button type="button" id="close-lot" aria-label="Close">×</button></div>`+
   `<div class="sale-picker-filters">`+
   `<label class="field sale-search-field">Search<input id="sale-search" type="search" placeholder="Sale number or cargo" autocomplete="off"></label>`+
   portFilter('sale-load','loadPort','All loading ports')+
   portFilter('sale-discharge','dischargePort','All discharge ports')+
   filterField('Shipment from','<input id="sale-from" type="date">')+
   filterField('Shipment to','<input id="sale-to" type="date">')+
   `</div>`+
   `<div id="sale-picker-results" class="sale-picker-results"></div>`+
   `<p id="lot-error" class="error" role="alert"></p>`+
   `<div class="sale-picker-footer">`+
   `<button type="button" id="sale-clear-filters">Clear filters</button>`+
   `<button type="submit" class="primary" id="sale-add-selected" disabled>Add selected</button>`+
   `</div></form>`;
  document.body.appendChild(dialog);
  const find=selector=>dialog.querySelector(selector),search=find('#sale-search'),load=find('#sale-load'),discharge=find('#sale-discharge'),from=find('#sale-from'),to=find('#sale-to'),results=find('#sale-picker-results'),submit=find('#sale-add-selected'),error=find('#lot-error');
  const updateButton=()=>{submit.disabled=!selected.size||!!(from.value&&to.value&&from.value>to.value);submit.textContent=selected.size?'Add selected ('+selected.size+')':'Add selected';};
  function filter(){
   error.textContent='';to.setCustomValidity('');
   if(from.value&&to.value&&from.value>to.value){error.textContent='Shipment from cannot be later than shipment to.';to.setCustomValidity(error.textContent);results.innerHTML='';updateButton();return;}
   const words=search.value.toLowerCase().trim().split(/\s+/).filter(Boolean),hasDates=!!(from.value||to.value);
   const visible=state().sales.filter(s=>words.every(word=>(s.id+' '+s.cargoName).toLowerCase().includes(word))&&(!load.value||s.loadPort===load.value)&&(!discharge.value||s.dischargePort===discharge.value)&&(!hasDates||(s.shipmentFrom&&s.shipmentTo&&(!from.value||s.shipmentTo>=from.value)&&(!to.value||s.shipmentFrom<=to.value))));
   const selectable=visible.filter(s=>!added.has(s.id));
   const rows=visible.map(s=>`<tr data-sale-id="${esc(s.id)}" class="${added.has(s.id)?'sale-already-added':selected.has(s.id)?'sale-picked':''}"><td>${added.has(s.id)?'<span class="muted">In voyage</span>':`<input type="checkbox" name="saleId" value="${esc(s.id)}" aria-label="Select ${esc(s.id)}" ${selected.has(s.id)?'checked':''}>`}</td><td class="name"><small>${esc(s.id)}</small><br>${esc(s.cargoName)}</td><td>${fmt(s.quantity,1)}</td><td>${esc(s.loadPort)}</td><td>${esc(s.dischargePort)}</td><td class="shipment-window">${shipmentWindow(s)}</td></tr>`);
   results.innerHTML=visible.length?table(['<input type="checkbox" id="sale-select-visible" aria-label="Select all available sales shown">','Sale / cargo','Quantity, MT','Loading','Discharge','Shipment'],rows,'sale-picker-table'):`<p class="empty">${state().sales.length?'No sales match these filters.':'No sales yet. Add a sale in SALE first.'}</p>`;
   const all=find('#sale-select-visible');if(all){const count=selectable.filter(s=>selected.has(s.id)).length;all.disabled=!selectable.length;all.checked=!!count&&count===selectable.length;all.indeterminate=count>0&&count<selectable.length;
    all.onchange=()=>{for(const s of selectable)all.checked?selected.add(s.id):selected.delete(s.id);filter();find('#sale-select-visible')?.focus();};
   }
   updateButton();
  }
  results.addEventListener('change',e=>{if(e.target.name!=='saleId')return;const el=e.target;el.checked?selected.add(el.value):selected.delete(el.value);const value=el.value;filter();[...results.querySelectorAll('input[name="saleId"]')].find(x=>x.value===value)?.focus();});
  search.addEventListener('input',filter);for(const el of [load,discharge,from,to])el.addEventListener('change',filter);
  find('#sale-clear-filters').onclick=()=>{for(const el of [search,load,discharge,from,to])el.value='';filter();search.focus();};
  find('#close-lot').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove());
  find('form').onsubmit=e=>{e.preventDefault();if(!selected.size)return;try{
   // Commit the complete selection together; an invalid sale must not leave a partial addition.
   const candidate=JSON.parse(JSON.stringify(state()));for(const s of state().sales.filter(s=>selected.has(s.id)))M.addSaleToPlanner(candidate,s.id);
   setState(candidate);dialog.close();changed();
  }catch(err){error.textContent=err.message;}};
  filter();dialog.showModal();search.focus();
 }
 // New sale. Every field is required, because a sale with a hole in it cannot be planned.
 const labelled=(label,control)=>`<label class="field">${label}${control}</label>`;
 const date=name=>labelled(name==='shipmentFrom'?'Shipment from':name==='shipmentTo'?'Shipment to':'Deal date',
  `<input name="${name}" type="date" required>`);
 const amount=(label,name,min)=>labelled(label,`<input name="${name}" type="number" min="${min}" step="any" required>`);
 // A berth belongs to its port, so its list stays empty until that port is chosen.
 const berth=(label,forPort)=>labelled(label,
  `<select name="${forPort}Id" data-berth-for="${forPort}"><option value="">Select a port first</option></select>`);

 function showSaleDialog(){
  const ports=[...new Set(state().portRecords.map(p=>p.name?.trim()).filter(Boolean))];
  const portOptions='<option value="">Select port</option>'+
   ports.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('');
  // Cargo is chosen from CARGO, and only what can actually be planned is offered.
  const cargoOptions=state().cargoTypes.filter(c=>M.isBulkCargo(c)&&M.ok(c.sf,true))
   .map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');

  const dialog=document.createElement('dialog');
  dialog.innerHTML=`<form id="sale-form">`+
   `<div class="heading"><h2>New sale</h2><button type="button" id="close-sale" aria-label="Close">×</button></div>`+
   `<div class="grid">`+
   date('dealDate')+
   labelled('Cargo',`<select name="cargoId" required>${cargoOptions}</select>`)+
   amount('Volume, MT','quantity','0.001')+
   labelled('Delivery basis',`<select name="priceBasis" required>`+
    M.PRICE_BASES.map(b=>`<option value="${esc(b)}" ${b==='FOB'?'selected':''}>${esc(b)}</option>`).join('')+`</select>`)+
   amount('Price, USD/MT','price','0')+
   labelled('Load port',`<select name="loadPort" required>${portOptions}</select>`)+
   berth('Load berth','loadPort')+
   labelled('Discharge port',`<select name="dischargePort" required>${portOptions}</select>`)+
   berth('Discharge berth','dischargePort')+
   date('shipmentFrom')+
   date('shipmentTo')+
   `</div>`+
   // Without ports there is nowhere to load or discharge, so the form says so and stays shut.
   `<p id="sale-error" class="error" role="alert">${ports.length?'':'First add ports in PORT.'}</p>`+
   `<button type="submit" class="primary" ${ports.length?'':'disabled'}>Add sale</button>`+
   `</form>`;
  document.body.appendChild(dialog);
  // The berth list belongs to the chosen port, so it is refilled whenever that port changes.
  for(const berth of dialog.querySelectorAll('[data-berth-for]')){const port=dialog.querySelector(`[name="${berth.dataset.berthFor}"]`);const fill=()=>{const rows=state().portRecords.filter(p=>p.name===port.value);berth.innerHTML=rows.length?rows.map(p=>`<option value="${esc(p.id)}">${esc(p.berth||p.name)}</option>`).join(''):'<option value="">Select a port first</option>';};port.addEventListener('change',fill);fill();}
  dialog.querySelector('#close-sale').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove());dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);try{M.addSale(state(),{dealDate:f.get('dealDate'),cargoId:f.get('cargoId'),quantity:Number(f.get('quantity')),price:Number(f.get('price')),priceBasis:String(f.get('priceBasis')||'FOB'),loadPort:f.get('loadPort'),dischargePort:f.get('dischargePort'),loadPortId:f.get('loadPortId'),dischargePortId:f.get('dischargePortId'),shipmentFrom:f.get('shipmentFrom'),shipmentTo:f.get('shipmentTo')});dialog.close();changed();}catch(error){dialog.querySelector('#sale-error').textContent=error.message;}};dialog.showModal();}
 function showCargoDialog(){
  const dialog=document.createElement('dialog');
  dialog.innerHTML='<form><div class="heading"><h2>New bulk cargo</h2><button type="button" data-close aria-label="Close">×</button></div><div class="grid"><label class="field">Cargo name<input name="name" required></label><label class="field">Planning SF, m³/t<input name="sf" type="number" min="0.000001" step="any" required></label><label class="field">IMSBC group<select name="group"><option value="">Pending</option><option>A</option><option>B</option><option>C</option><option>A &amp; B</option></select></label></div><p class="error" role="alert"></p><button type="submit">Add cargo</button></form>';
  document.body.appendChild(dialog);
  dialog.querySelector('[data-close]').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>dialog.remove());
  dialog.querySelector('form').onsubmit=e=>{
   e.preventDefault();const data=new FormData(e.target),name=String(data.get('name')).trim(),sf=Number(data.get('sf'));
   if(!name||!M.ok(sf,true)){dialog.querySelector('.error').textContent='Enter a cargo name and a positive SF';return;}
   if(state().cargoTypes.some(c=>c.name.toLowerCase()===name.toLowerCase())){dialog.querySelector('.error').textContent='This cargo name already exists';return;}
   let n=1;while(state().cargoTypes.some(c=>c.id==='cargo-'+n))n++;
   state().cargoTypes.push({id:'cargo-'+n,name,sf,physicalForm:'solid',group:data.get('group'),sfBasis:'user-entered',source:'User-entered'});
   dialog.close();changed();
  };dialog.showModal();
 }
 // New assessment. Every field is required: a price without the month it is for, the basis it
 // is quoted on, or the publication it came from cannot be netted against anything.
 function showAssessmentDialog(){
  const ports=[...new Set(state().portRecords.map(p=>p.name?.trim()).filter(Boolean))];
  const cargoes=state().cargoTypes.filter(c=>M.isBulkCargo(c)&&M.ok(c.sf,true));
  const options=(list,placeholder)=>`<option value="">${esc(placeholder)}</option>`+
   list.map(([id,name])=>`<option value="${esc(id)}">${esc(name)}</option>`).join('');
  const dialog=document.createElement('dialog');
  dialog.innerHTML=`<form id="assessment-form">`+
   `<div class="heading"><h2>New assessment</h2><button type="button" data-close aria-label="Close">×</button></div>`+
   `<div class="grid">`+
   labelled('Cargo',`<select name="cargoId" required>${options(cargoes.map(c=>[c.id,c.name]),'Select cargo')}</select>`)+
   labelled('Destination',`<select name="destination" required>${options(ports.map(p=>[p,p]),'Select port')}</select>`)+
   labelled('Month',`<input name="month" type="month" required>`)+
   labelled('Basis',`<select name="basis" required>`+
    M.PRICE_BASES.map(b=>`<option value="${esc(b)}" ${b==='CFR'?'selected':''}>${esc(b)}</option>`).join('')+`</select>`)+
   amount('Price, USD/MT','value','0.000001')+
   labelled('Source',`<input name="source" required placeholder="Profercy, ICIS, Argus…">`)+
   labelled('Published',`<input name="date" type="date" required>`)+
   `</div>`+
   // Without a cargo or a port there is nothing to assess, so the form says which is missing.
   `<p id="assessment-error" class="error" role="alert">${cargoes.length?(ports.length?'':'First add ports in PORTS.'):'First add a bulk cargo in CARGOES.'}</p>`+
   `<button type="submit" class="primary" ${cargoes.length&&ports.length?'':'disabled'}>Add assessment</button>`+
   `</form>`;
  document.body.appendChild(dialog);
  dialog.querySelector('[data-close]').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>dialog.remove());
  dialog.querySelector('form').onsubmit=e=>{
   e.preventDefault();
   const f=new FormData(e.target);
   try{
    M.addAssessment(state(),{cargoId:f.get('cargoId'),destination:f.get('destination'),
     month:String(f.get('month')||''),basis:String(f.get('basis')||''),
     value:Number(f.get('value')),source:String(f.get('source')||''),date:String(f.get('date')||'')});
    dialog.close();changed();
   }catch(error){dialog.querySelector('#assessment-error').textContent=error.message;}
  };
  dialog.showModal();
 }
 function cargoDetails(c){const range=v=>v?v.map(n=>numberFormat(0,4).format(Number(n))).join('–'):'SDS required';const link=(url,label)=>url&&/^https:\/\//.test(url)?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`:'';return `<details class="cargo-properties"><summary>${esc(c.propertyStatus||'Properties required')}</summary><dl><dt>BCSN</dt><dd>${esc(c.bcsn||'Shipper declaration required')}</dd><dt>Reference SF, m³/t</dt><dd>${esc(range(c.sfRange))}</dd><dt>Bulk density, kg/m³</dt><dd>${esc(range(c.bulkDensityRange))}</dd><dt>Angle of repose</dt><dd>${esc(c.angleOfRepose||'Not established')}</dd><dt>Applicability</dt><dd>${esc(c.propertyNote||'Confirm the exact product and shipping conditions.')}</dd></dl>${link(c.propertyUrl,'Property source')} ${link(c.sdsUrl,'SDS')} ${link(c.catalogUrl,'Product catalogue')}</details>`;}

 return {shipmentWindow,openSale,showLotDialog,showSaleDialog,showCargoDialog,showAssessmentDialog,cargoDetails};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXDialogs=api;
})(globalThis);
