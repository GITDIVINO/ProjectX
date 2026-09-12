(function(root){
'use strict';
// The register of calculations: every calculation the organisation holds, who answers for it,
// and — when a row is opened out — what is in it and how to change it.
//
// A dropdown is enough to switch between two calculations. It is not enough to run a desk:
// fifteen people need to see what exists, whose it is, and what it is about before opening it.
// A row carries enough to be recognised; opening it out answers the next question without
// leaving the screen, and the two things a register owns — the name and who is responsible —
// are edited there rather than through a browser prompt.

function create(env){
 const {esc,fmt,table}=env;

 // A date is shown as the day, because the question a register answers is "is this current",
 // not "at what second was it written".
 const day=value=>{
  if(!value)return '—';
  const d=new Date(value);
  return Number.isFinite(d.getTime())
   ? d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})
   : '—';
 };

 const COLUMNS=['','Calculation','Responsible specialist','Vessel','Ports','Parcels','Last change',''];

 const responsibleCell=row=>{
  // An unassigned calculation is stated as unassigned rather than left blank: a blank cell
  // reads as a rendering fault, and this is a real condition somebody has to resolve.
  const name=row.responsible||'Unassigned';
  const title=row.responsibleTitle?`<small>${esc(row.responsibleTitle)}</small>`:'';
  return `<td class="responsible-cell"><strong>${esc(name)}</strong>${title}</td>`;
 };

 const summaryRow=(row,openId,expandedId)=>{
  const expanded=row.id===expandedId;
  return `<tr class="register-row ${row.id===openId?'register-row--open':''}" data-calculation="${esc(row.id)}">`+
   `<td class="register-toggle">`+
   `<button data-action="expand-calculation" data-id="${esc(row.id)}" aria-expanded="${expanded}" `+
   `aria-label="${expanded?'Collapse':'Expand'} ${esc(row.name)}">${expanded?'▾':'▸'}</button></td>`+
   `<td class="name"><button class="text-action" data-action="open-calculation" data-id="${esc(row.id)}">${esc(row.name)}</button>`+
   (row.id===openId?'<small>Open</small>':'')+`</td>`+
   responsibleCell(row)+
   `<td>${row.vessel?esc(row.vessel):'—'}</td>`+
   `<td class="register-ports">${row.ports?esc(row.ports):'—'}</td>`+
   `<td>${row.parcels||'—'}</td>`+
   `<td>${esc(day(row.updatedAt))}<small>${esc(row.updatedBy||'')}</small></td>`+
   `<td class="register-actions">`+
   `<button data-action="open-calculation" data-id="${esc(row.id)}">Open</button>`+
   `<button data-action="delete-calculation-row" data-id="${esc(row.id)}">Delete</button>`+
   `</td></tr>`;
 };

 const fact=(label,value)=>`<div class="register-fact"><dt>${esc(label)}</dt><dd>${value}</dd></div>`;

 // What the calculation contains, read from what the register already carries. No extra query
 // is made to open a row: everything here came with the list.
 const particulars=row=>
  `<dl class="register-facts">`+
  fact('Cargo',row.cargoes?esc(row.cargoes):'—')+
  fact('Tonnage',row.tonnage===null||row.tonnage===undefined?'—':esc(fmt(row.tonnage,1))+' t')+
  fact('Vessel',row.vessel?esc(row.vessel):'—')+
  fact('Ports',row.ports?esc(row.ports):'—')+
  (row.deliveryPort?fact('Ballast from',esc(row.deliveryPort)):'')+
  fact('Created',esc(day(row.createdAt))+' · '+esc(row.createdBy||'—'))+
  fact('Last change',esc(day(row.updatedAt))+' · '+esc(row.updatedBy||'—'))+
  `</dl>`;

 // The two things the register owns. Everything else about a calculation is edited in the
 // planner, which is why this form offers these and nothing more.
 const editor=(row,members)=>{
  const options=(members||[]).map(m=>
   `<option value="${esc(m.id)}" ${m.id===row.responsibleId?'selected':''}>${esc(m.name)}${m.title?' · '+esc(m.title):''}</option>`).join('');
  return `<form class="register-editor" data-id="${esc(row.id)}">`+
   `<label class="field">Name<input name="name" type="text" value="${esc(row.name)}" required></label>`+
   (options
    ? `<label class="field">Responsible specialist<select name="responsible">${options}</select></label>`
    : `<p class="muted">No colleagues are listed for this organisation yet, so this calculation cannot be handed over.</p>`)+
   `<div class="button-row">`+
   `<button type="submit" class="primary" data-action="save-calculation-row" data-id="${esc(row.id)}">Save</button>`+
   `<button type="button" data-action="expand-calculation" data-id="${esc(row.id)}">Cancel</button>`+
   `</div></form>`;
 };

 const detailRow=(row,members)=>
  `<tr class="register-detail" data-detail="${esc(row.id)}">`+
  `<td colspan="${COLUMNS.length}"><div class="register-detail-body">`+
  particulars(row)+editor(row,members)+
  `</div></td></tr>`;

 const EMPTY='<div class="empty-state"><strong>No calculations yet</strong><span>Create the first one, and it will be listed here with whoever is responsible for it.</span></div>';

 // A failed read is reported as a failure. An empty register and an unreadable one are not
 // the same thing, and a desk must not be told its work is gone when it is merely unreachable.
 function render(rows,openId,account,expandedId,members){
  if(rows&&rows.ok===false)
   return `<section><div class="heading"><div><h2>CALCULATIONS</h2></div></div>`+
    `<p class="error">${esc(rows.error||'The register could not be read.')}</p></section>`;

  const list=Array.isArray(rows)?rows:[];
  const mine=account?list.filter(r=>r.responsibleId===account.id).length:0;
  const summary=list.length
   ? `${list.length} calculation${list.length===1?'':'s'}`+(account?` · ${mine} yours`:'')
   : '';

  const body=list.flatMap(row=>
   row.id===expandedId?[summaryRow(row,openId,expandedId),detailRow(row,members)]:[summaryRow(row,openId,expandedId)]);

  return `<section>`+
   `<div class="heading"><div><h2>CALCULATIONS</h2>`+
   `<p class="section-intro">Every calculation in the organisation, and who answers for it. ${esc(summary)}</p></div>`+
   `<button data-action="new-calculation-row">+ New calculation</button></div>`+
   (list.length?table(COLUMNS,body,'register-table'):EMPTY)+
   `<p class="form-note">Responsibility records who holds the work. It does not restrict who may open or edit a calculation, and it is not the commercial approval, which stays with the head of freight.</p>`+
   `</section>`;
 }

 return {render,particulars,editor,day};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXRegisterView=api;
})(globalThis);
