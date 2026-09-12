(function(root){
'use strict';
// FORWARD — what a tonne leaves, by destination and by month.
//
// The screen a trader looks at before deciding where the next parcel goes. Each row is a
// destination, each column a month, and each cell the assessed price less what delivering it
// costs. The costs are not read off an index: every one is a voyage costed by the same engine
// that costs a real one, on the vessel and the bunker prices of the calculation that is open.
// That is the exporter's advantage stated as a number — and the reason the assumptions behind
// it are on the same screen rather than hidden behind it.
//
// The view is given what forward.js prepared and does nothing else: the caller places the
// markup, and nothing here reads the state, writes to it, or reaches for a document of its own.

function create(env){
 const {M,esc,fmt,input,select,table}=env;

 const MONTH=/^\d{4}-(0[1-9]|1[0-2])$/;
 const day=value=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))return '—';
  const d=new Date(value+'T00:00:00Z');
  return Number.isFinite(d.getTime())
   ? d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}) : '—';
 };
 const monthName=value=>{
  if(!MONTH.test(String(value||'')))return esc(value);
  const d=new Date(value+'-01T00:00:00Z');
  return esc(d.toLocaleDateString('en-GB',{month:'short',year:'numeric',timeZone:'UTC'}));
 };

 const labelled=(label,control)=>`<label class="field">${esc(label)}${control}</label>`;

 // What the cost of every cell rests on. On the screen rather than in a footnote: a margin is
 // only as good as the hire and the bunker prices under it, and those belong to whichever
 // calculation happens to be open.
 const basisLine=b=>
  `<p class="section-intro forward-basis">Costed on <strong>${esc(b.vessel||'no vessel')}</strong>`+
  (M.ok(b.dwt,true)?` · ${fmt(b.dwt,0)} DWT`:'')+
  ` · hire ${fmt(b.hire,0)} USD/day · main fuel ${fmt(b.main,0)} · LSMGO ${fmt(b.aux,0)} USD/t,`+
  ` from the calculation that is open. Change the vessel or the prices in PLANNER and every`+
  ` figure here changes with them.</p>`;

 // ---- the matrix ---------------------------------------------------------------------------

 // The assessment behind a margin, so a figure on screen can be traced to the publication it
 // came from without leaving the screen.
 const provenance=a=>a
  ? fmt(a.value,2)+' '+a.basis+' · '+a.source+' · '+day(a.date)
  : 'No assessment entered for this destination and month';

 const marginCell=(cell,best)=>{
  if(cell.margin===null)
   return `<td class="forward-cell forward-cell--unknown">`+
    `<span class="muted">[${esc(cell.missing.join(', '))}]</span></td>`;
  const leader=best!==null&&Math.abs(cell.margin-best)<1e-9;
  return `<td class="forward-cell${leader?' forward-cell--best':''}" `+
   `title="${esc(provenance(cell.assessment))}">${fmt(cell.margin,2)}</td>`;
 };

 // A cost that could not be worked out names the input it wants, in the row it belongs to,
 // rather than leaving the row blank.
 const costCell=cost=>cost.ok
  ? `<td class="forward-cost">${fmt(cost.unit,2)}<small>${fmt(cost.days,1)} days</small></td>`
  : `<td class="forward-cost forward-cell--unknown"><span class="muted">[${esc(cost.missing.join(', '))}]</span></td>`;

 const distanceCell=cost=>cost.ok&&M.ok(cost.distance,true)
  ? `<td class="forward-distance">${fmt(cost.distance,0)}<small>${esc(cost.distanceSource||'')}</small></td>`
  : `<td class="forward-distance">—</td>`;

 const matrixRow=(row,best)=>
  `<tr>`+
  `<td class="name">${esc(row.destination)}</td>`+
  distanceCell(row.cost)+
  costCell(row.cost)+
  row.cells.map(cell=>marginCell(cell,best[cell.month])).join('')+
  `</tr>`;

 // The best margin in each month, so the leader of a column can be marked. It is the largest
 // of the figures actually shown, and nothing is inferred for a cell that has none.
 //
 // A month holding one figure has no leader: "best" is a claim about a comparison, and marking
 // the only number in a column says something the column does not support.
 function leaders(rows,months){
  const best={};
  for(const month of months){
   const values=rows.map(r=>r.cells.find(c=>c.month===month))
    .filter(c=>c&&c.margin!==null).map(c=>c.margin);
   best[month]=values.length>1?Math.max(...values):null;
  }
  return best;
 }

 const MATRIX_EMPTY='<div class="empty-state"><strong>Nothing to compare yet</strong>'+
  '<span>Enter published prices in PRICES. A destination appears here once an assessment '+
  'exists for it.</span></div>';

 function matrixTable(result){
  if(!result.rows.length)return MATRIX_EMPTY;
  const best=leaders(result.rows,result.months);
  return table(['Destination','Distance, nm','Cost, USD/MT',...result.months.map(monthName)],
   result.rows.map(row=>matrixRow(row,best)),'forward-matrix');
 }

 // ---- the assumptions ----------------------------------------------------------------------

 // Stated on the screen, beside what they produce. A handling rate and a disbursement for a
 // voyage nobody has fixed are assumptions, and they are labelled as assumptions: they are not
 // in PORTS, which carries terminals and published limits, and they are not the disbursement
 // of an actual call, which stays in the calculation that makes it.
 const assumptionRow=(p,i)=>
  `<tr>`+
  `<td class="name">${esc(p.name)}</td>`+
  `<td>${input('forward.ports.'+i+'.rate','Handling rate at '+p.name)}</td>`+
  `<td>${input('forward.ports.'+i+'.da','Port disbursement at '+p.name)}</td>`+
  `</tr>`;

 // Headed as PLANNER heads the same two figures, because they are the same two figures.
 const assumptionsTable=list=>list.length
  ? table(['Port','Handling rate, t/day','DA, USD'],
    list.map((p,i)=>assumptionRow(p,i)),'forward-assumptions')
  : '';

 // ---- the screen ---------------------------------------------------------------------------

 function markup(prepared){
  const {result,cargoes,loadPorts,assumptions,basis}=prepared;
  return `<section class="forward-screen">`+
   `<div class="heading"><div><h2>FORWARD</h2>`+
   `<p class="section-intro">Assessed price less the cost of delivering it, by destination and month.</p>`+
   `</div></div>`+
   `<div class="grid forward-controls">`+
   labelled('Cargo',select('forward.cargoId','Cargo compared',cargoes))+
   labelled('Loading from',select('forward.origin','Loading port',loadPorts))+
   labelled('Reference parcel, MT',input('forward.quantity','Reference parcel size',{tonnage:true}))+
   `</div>`+
   basisLine(basis)+
   matrixTable(result)+
   (result.rows.length
    ? `<p class="form-note">A cell is what a tonne leaves after the voyage that delivers it. `+
      `FOB assessments have no freight in them, so nothing is deducted from those. The best `+
      `figure in each month is marked; it is the best of what is entered, not of the market.</p>`
    : '')+
   `<h3>Assumptions</h3>`+
   `<p class="section-intro">The handling rate and disbursement each reference call is costed `+
   `on. These are assumptions for a voyage nobody has fixed — not register facts, and not the `+
   `disbursement of an actual call.</p>`+
   assumptionsTable(assumptions)+
   `<p class="form-note">Hire, bunker prices and the vessel come from the open calculation and `+
   `are the same in every month: this matrix compares destinations, and does not carry a `+
   `month-by-month freight curve.</p>`+
   `</section>`;
 }

 return {markup,matrixTable,assumptionsTable,leaders,monthName,provenance};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXForwardView=api;
})(globalThis);
