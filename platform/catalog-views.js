(function(root){
'use strict';
// The three register screens: SALE, PORT and CARGO.
//
// They were one function on one 4,627-character line holding all three, which is a line no
// review can read and no merge can resolve. The markup each screen produces is unchanged;
// only the shape of the source is. Each screen is a function, and each row of a table is a
// function of one record, so a column can be found by reading rather than by counting.
//
// Nothing here touches the document: each view returns markup and the caller places it.

function create(env){
 const {M,getState,esc,fmt,input,select,field,table,portNames}=env;
 const state=()=>getState();

 // ---- shared between the registers ------------------------------------------------------

 const berthOptions=name=>state().portRecords.filter(p=>p.name===name).map(p=>[p.id,p.berth||p.name]);
 const berthSelect=(path,label,name)=>{
  const options=berthOptions(name);
  return options.length?select(path,label,options):'';
 };

 const heading=(title,intro,action,label)=>
  `<div class="heading"><div><h2>${title}</h2><p class="section-intro">${intro}</p></div>`+
  `<button data-action="${action}">${label}</button></div>`;

 // ---- SALE ------------------------------------------------------------------------------

 const SALE_COLUMNS=['Deal','Date','Cargo','Volume, MT','Loading','Discharge','Shipment','Basis','Price, USD/MT',''];

 // A parcel already in the voyage carries its shipment source, so the button sits with the
 // price it was agreed at rather than in a screen of its own.
 const shipmentSources=saleId=>state().lots.filter(l=>l.saleId===saleId)
  .map(l=>`<button class="inline-action" data-action="edit-passport" data-id="${esc(l.id)}">Shipment source</button>`)
  .join('');

 const portCell=(path,label,berthPath,berthLabel,name)=>
  `<td><div class="port-cell">${select(path,label,portNames())}${berthSelect(berthPath,berthLabel,name)}</div></td>`;

 const saleRow=(s,i)=>
  `<tr id="${esc('sale-row-'+s.id)}" class="sale-record" tabindex="-1">`+
  `<td>${esc(s.id)}</td>`+
  `<td>${input('sales.'+i+'.dealDate','Deal date',{type:'date'})}</td>`+
  `<td class="name">${esc(s.cargoName)}</td>`+
  `<td>${input('sales.'+i+'.quantity','Sale quantity',{tonnage:true})}</td>`+
  portCell('sales.'+i+'.loadPort','Load port','sales.'+i+'.loadPortId','Load berth',s.loadPort)+
  portCell('sales.'+i+'.dischargePort','Discharge port','sales.'+i+'.dischargePortId','Discharge berth',s.dischargePort)+
  `<td><div class="date-range">${input('sales.'+i+'.shipmentFrom','Shipment from',{type:'date'})}${input('sales.'+i+'.shipmentTo','Shipment to',{type:'date'})}</div></td>`+
  // A price is quoted on a basis. FOB leaves the freight with the buyer; CFR and CIF leave
  // it with us, and only then does the voyage cost come off the netback.
  `<td>${select('sales.'+i+'.priceBasis','Delivery basis',M.PRICE_BASES)}</td>`+
  `<td>${input('sales.'+i+'.price','Price on the stated basis')}${shipmentSources(s.id)}</td>`+
  `<td><button data-action="remove-sale" data-index="${i}" aria-label="Remove sale ${esc(s.id)}">×</button></td>`+
  `</tr>`;

 const SALE_EMPTY='<div class="empty-state"><strong>No sales yet</strong><span>Add the first deal. Cargo is selected from CARGO only.</span></div>';

 function saleView(){
  const sales=state().sales;
  return `<section>`+
   heading('SALES','Register of concluded sales for voyage planning.','new-sale','+ Add sale')+
   (sales.length?table(SALE_COLUMNS,sales.map(saleRow)):SALE_EMPTY)+
   `<p class="form-note">A sale already added to PLANNER cannot be deleted until it is removed from the voyage.</p>`+
   `</section>`;
 }

 // ---- PORT ------------------------------------------------------------------------------

 // Published size limits. Every one is a single figure the register carries per berth; the
 // differing source terms behind them stay in the port research, not in the column name.
 const LIMIT_COLUMNS=[
  ['maxDraft','Max draft, m'],
  ['maxBeam','Max beam, m'],
  ['maxLoa','Max LOA, m'],
  ['maxAirDraft','Max air draft, m'],
  ['maxDwt','Max DWT']
 ];

 // Fresh water to sea water in thousandths, the range a berth is ever quoted in. The two
 // ends are named because those are the values entered when nothing was measured.
 const densityOptions=()=>[['','Not entered'],...Array.from({length:31},(_,j)=>{
  const v=(1+j/1000).toFixed(3);
  return [Number(v),v+(j===0?' · Fresh':j===25?' · Sea':'')];
 })];

 const portRow=(p,i)=>{
  const named=p.name||'new port';
  return `<tr>`+
   `<td>${input('portRecords.'+i+'.country','Country',{type:'text'})}</td>`+
   `<td>${input('portRecords.'+i+'.name','Port name',{type:'text'})}</td>`+
   `<td>${input('portRecords.'+i+'.terminal','Terminal',{type:'text'})}</td>`+
   `<td>${input('portRecords.'+i+'.berth','Berth',{type:'text'})}</td>`+
   `<td>${select('portRecords.'+i+'.waterDensity','Water density for '+named,densityOptions())}</td>`+
   LIMIT_COLUMNS.map(([key,label])=>`<td class="limit-cell">${input('portRecords.'+i+'.'+key,label+' for '+named)}</td>`).join('')+
   `<td><button data-action="remove-port-record" data-index="${i}" aria-label="Remove port ${esc(p.name)}">×</button></td>`+
   `</tr>`;
 };

 function portView(){
  const columns=['Country','Port','Terminal','Berth','Water density, t/m³',...LIMIT_COLUMNS.map(([,label])=>label),''];
  return `<section>`+
   heading('PORTS','Port and berth register with published size limits.','new-port','+ Add port')+
   table(columns,state().portRecords.map(portRow),'port-table')+
   `</section>`;
 }

 // ---- CARGO -----------------------------------------------------------------------------

 // Only bulk cargo with a planning SF can be put in a hold, so only that is offered here.
 // The rest of the catalogue is kept, not deleted: it is simply not plannable yet.
 const plannable=c=>M.isBulkCargo(c)&&M.ok(c.sf,true);
 const familyOf=c=>c.family||'Other cargoes';

 // Searched against name, grade, producer and family at once, lower-cased so the filter in
 // the page can compare without re-reading the record.
 const searchKey=c=>[c.name,c.aliases,c.producer,c.family].filter(Boolean).join(' ').toLowerCase();

 const cargoToolbar=()=>{
  const families=[...new Set(state().cargoTypes.filter(plannable).map(familyOf))];
  return `<div class="catalog-toolbar">`+
   `<input id="cargo-search" type="search" aria-label="Search cargo" placeholder="Name, grade, manufacturer" class="catalog-search">`+
   `<select id="cargo-family" aria-label="Cargo category"><option value="">All categories</option>`+
   families.map(f=>`<option>${esc(f)}</option>`).join('')+
   `</select></div>`;
 };

 const cargoRow=({c,i})=>
  `<tr data-family="${esc(familyOf(c))}" data-catalog-name="${esc(searchKey(c))}">`+
  `<td class="cargo-name-cell">${input('cargoTypes.'+i+'.name','Cargo name',{type:'text'})}</td>`+
  `<td class="cargo-sf-cell">${input('cargoTypes.'+i+'.sf','Planning stowage factor',{disabled:!M.isBulkCargo(c)})}</td>`+
  `<td class="cargo-group-cell">${select('cargoTypes.'+i+'.group','IMSBC group',[['',M.isBulkCargo(c)?'Pending':'N/A'],'A','B','C','A & B'])}</td>`+
  `</tr>`;

 function cargoView(){
  const rows=state().cargoTypes.map((c,i)=>({c,i})).filter(({c})=>plannable(c));
  return `<section>`+
   heading('CARGOES','Cargo register for creating sales.','new-cargo','+ Add cargo type')+
   cargoToolbar()+
   table(['Cargo','Planning SF, m³/t','IMSBC Group'],rows.map(cargoRow))+
   `<p class="form-note">Planning SF is a reference estimate and must be confirmed for the shipment. IMSBC Group must match the exact product.</p>`+
   `</section>`;
 }

 // ---- PRICES ----------------------------------------------------------------------------

 // The forward curve as it was published: what a tonne of a product is assessed at for a
 // destination and a month, and who assessed it when. The voyage engine answers what delivery
 // costs; this is the other half of a netback, and it is the one figure in the platform that
 // is bought rather than computed.
 //
 // Every field is editable, including the three that identify the cell. Moving a row onto a
 // cell that is taken is refused by the model, which is where that rule belongs.
 const PRICE_COLUMNS=['Cargo','Destination','Month','Basis','Price, USD/MT','Source','Published',''];

 const assessmentRow=({a,i})=>{
  const path='priceAssessments.'+i+'.';
  const cargoes=state().cargoTypes.filter(plannable).map(c=>[c.id,c.name]);
  return `<tr class="assessment-record">`+
   `<td class="name">${select(path+'cargoId','Cargo assessed',cargoes)}</td>`+
   `<td>${select(path+'destination','Destination assessed',portNames())}</td>`+
   `<td>${input(path+'month','Month assessed',{type:'month'})}</td>`+
   // A price cannot be netted without the basis it was quoted on: FOB leaves the freight with
   // the buyer, CFR and CIF leave it with us.
   `<td>${select(path+'basis','Price basis',M.PRICE_BASES)}</td>`+
   `<td>${input(path+'value','Assessed price')}</td>`+
   `<td>${input(path+'source','Assessment source',{type:'text'})}</td>`+
   `<td>${input(path+'date','Publication date',{type:'date'})}</td>`+
   `<td><button data-action="remove-assessment" data-id="${esc(a.id)}" `+
   `aria-label="Remove the ${esc(a.month)} assessment for ${esc(a.destination)}">×</button></td>`+
   `</tr>`;
 };

 const PRICE_EMPTY='<div class="empty-state"><strong>No assessments yet</strong>'+
  '<span>Enter the published price for a destination and a month. '+
  'Without it a netback cannot be compared across destinations.</span></div>';

 function assessmentView(){
  // Shown by cargo, destination and month, while each row keeps the index it is stored at:
  // the field paths address the register, not the sort.
  const rows=state().priceAssessments.map((a,i)=>({a,i}))
   .sort((x,y)=>String(x.a.cargoName).localeCompare(String(y.a.cargoName))
    ||String(x.a.destination).localeCompare(String(y.a.destination))
    ||String(x.a.month).localeCompare(String(y.a.month)));
  return `<section>`+
   heading('PRICES','Published market assessments by destination and month.','new-assessment','+ Add assessment')+
   (rows.length?table(PRICE_COLUMNS,rows.map(assessmentRow),'assessment-table'):PRICE_EMPTY)+
   `<p class="form-note">One figure per cargo, destination and month. These are market ` +
   `assessments as published, not our own prices: the source and the date are part of the figure.</p>`+
   `</section>`;
 }

 // ---- VESSEL ----------------------------------------------------------------------------

 // Particulars, grouped the way a vessel questionnaire presents them. Naming the groups here
 // rather than inline is what lets a field be found, moved or added by reading one list.
 const IDENTITY=[['name','Name'],['model','Project / model'],['source','Parameter source']];
 const PARTICULARS=[
  ['dwt','DWT, MT'],['draft','Draft SSW, m'],['tpc','TPC, t/cm'],['loa','LOA, m'],['beam','Beam, m'],
  ['airDraft','Air draft, m'],['grain','Grain capacity, m³'],['bale','Bale capacity, m³'],
  ['gt','GRT'],['nrt','NRT'],['cranes','Cranes, qty'],['craneSWL','Crane SWL, MT'],['tanktop','Tank top, t/m²']
 ];
 const CONSUMPTION=[
  ['speed','Laden speed, kn'],['burn','Laden main fuel, t/day'],
  ['ballastSpeed','Ballast speed, kn'],['ballastBurn','Ballast main fuel, t/day'],
  ['aux','Sea LSMGO, t/day'],['working','Port main working, t/day'],['idle','Port main idle, t/day'],
  ['auxWorking','Port LSMGO working, t/day'],['auxIdle','Port LSMGO idle, t/day'],
  ['boiler','Separate boiler, t/day'],['ecaBurn','ECA main fuel, t/day']
 ];

 const fields=(path,pairs,options)=>pairs.map(([k,l])=>field(path+'.'+k,l,options)).join('');

 const vesselCard=(v,i)=>{
  const path='vesselProfiles.'+i;
  return `<details class="vessel-card"><summary><strong>VESSEL · ${esc(v.name)}</strong><span>${esc(v.model)} · ${fmt(v.dwt,0)} DWT</span></summary>`+
   `<div class="vessel-card-body">`+
   `<div class="heading vessel-apply"><span></span><button data-action="apply-vessel" data-id="${esc(v.id)}">Apply to voyage</button></div>`+
   `<div class="grid">${fields(path,IDENTITY,{type:'text'})}${fields(path,PARTICULARS)}</div>`+
   `<h3>Speed and consumption</h3><div class="grid">${fields(path,CONSUMPTION)}</div>`+
   `<h3>Holds</h3><div class="grid holds-grid">`+
   v.holdData.map((h,j)=>field(path+'.holdData.'+j+'.volume','Hold №'+h.id+', m³')).join('')+
   `</div></div></details>`;
 };

 function vesselView(){
  return heading('VESSELS','Standard vessel types for cargo carriage.','new-vessel','+ Add vessel type')+
   state().vesselProfiles.map(vesselCard).join('');
 }

 // VESSEL is what the registers fall back to: it is the remaining tab this module owns.
 const VIEWS={sale:saleView,ports:portView,cargo:cargoView,prices:assessmentView};
 const render=tab=>(VIEWS[tab]||vesselView)();

 return {render,saleView,portView,cargoView,assessmentView,vesselView,berthSelect,berthOptions};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXCatalogViews=api;
})(globalThis);
