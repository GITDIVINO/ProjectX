(function(root){
'use strict';
// The register of calculations: every calculation the organisation holds, who answers for it,
// and when it was last touched.
//
// A dropdown is enough to switch between two calculations. It is not enough to run a desk:
// fifteen people need to see what exists, whose it is, and what it is about before opening it.
// That is why a row carries the vessel, the parcels and the ports — recognising a calculation
// should not require loading it.

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

 const COLUMNS=['Calculation','Responsible specialist','Vessel','Ports','Parcels','Last change',''];

 const responsibleCell=row=>{
  // An unassigned calculation is stated as unassigned rather than left blank: a blank cell
  // reads as a rendering fault, and this is a real condition somebody has to resolve.
  const name=row.responsible||'Unassigned';
  const title=row.responsibleTitle?`<small>${esc(row.responsibleTitle)}</small>`:'';
  return `<td class="responsible-cell"><strong>${esc(name)}</strong>${title}</td>`;
 };

 const registerRow=(row,openId)=>
  `<tr class="register-row ${row.id===openId?'register-row--open':''}" data-calculation="${esc(row.id)}">`+
  `<td class="name"><button class="text-action" data-action="open-calculation" data-id="${esc(row.id)}">${esc(row.name)}</button>`+
  (row.id===openId?'<small>Open</small>':'')+`</td>`+
  responsibleCell(row)+
  `<td>${row.vessel?esc(row.vessel):'—'}</td>`+
  `<td class="register-ports">${row.ports?esc(row.ports):'—'}</td>`+
  `<td>${row.parcels||'—'}</td>`+
  `<td>${esc(day(row.updatedAt))}<small>${esc(row.updatedBy||'')}</small></td>`+
  `<td class="register-actions">`+
  `<button data-action="assign-responsible" data-id="${esc(row.id)}">Hand over</button>`+
  `<button data-action="rename-calculation-row" data-id="${esc(row.id)}">Rename</button>`+
  `<button data-action="delete-calculation-row" data-id="${esc(row.id)}">Delete</button>`+
  `</td></tr>`;

 const EMPTY='<div class="empty-state"><strong>No calculations yet</strong><span>Create the first one, and it will be listed here with whoever is responsible for it.</span></div>';

 // A failed read is reported as a failure. An empty register and an unreadable one are not
 // the same thing, and a desk must not be told its work is gone when it is merely unreachable.
 function render(rows,openId,account){
  if(rows&&rows.ok===false)
   return `<section><div class="heading"><div><h2>CALCULATIONS</h2></div></div>`+
    `<p class="error">${esc(rows.error||'The register could not be read.')}</p></section>`;

  const list=Array.isArray(rows)?rows:[];
  const mine=account?list.filter(r=>r.responsibleId===account.id).length:0;
  const summary=list.length
   ? `${list.length} calculation${list.length===1?'':'s'}`+(account?` · ${mine} yours`:'')
   : '';

  return `<section>`+
   `<div class="heading"><div><h2>CALCULATIONS</h2>`+
   `<p class="section-intro">Every calculation in the organisation, and who answers for it. ${esc(summary)}</p></div>`+
   `<button data-action="new-calculation-row">+ New calculation</button></div>`+
   (list.length?table(COLUMNS,list.map(row=>registerRow(row,openId)),'register-table'):EMPTY)+
   `<p class="form-note">Responsibility records who holds the work. It does not restrict who may open or edit a calculation, and it is not the commercial approval, which stays with the head of freight.</p>`+
   `</section>`;
 }

 // The hand-over dialog's body. The list is the organisation's members, so a calculation
 // cannot be handed to somebody who is not in it.
 const handOver=(row,members,selectedId)=>
  `<p>Who answers for <strong>${esc(row.name)}</strong>?</p>`+
  `<label class="field">Responsible specialist<select name="responsible">`+
  members.map(m=>`<option value="${esc(m.id)}" ${m.id===selectedId?'selected':''}>${esc(m.name)}${m.title?' · '+esc(m.title):''}</option>`).join('')+
  `</select></label>`;

 return {render,handOver,day};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXRegisterView=api;
})(globalThis);
