(function(root){
'use strict';
// ADMIN — who can sign in.
//
// The owner's screen. The platform is closed: there is no registration, and the only way to
// appear in it is a login issued here. So the screen shows more than a list — it shows when
// each person last signed in, because a login nobody has ever used should be removed rather
// than forgotten.
//
// A password is set here and never shown: the old one is unknown and cannot be read back.
// The button says "Set password", not "Show password", and that is a fact about the system
// rather than a choice of words.
//
// Nothing here decides anything: it builds markup, and the database checks the right. A
// hidden tab is not protection, and this file holds no check worth relying on.

function create(env){
 const {esc,fmt,table}=env;

 const day=value=>{
  if(!value)return '—';
  const d=new Date(value);
  return Number.isFinite(d.getTime())
   ? d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';
 };

 const COLUMNS=['','Login','Name','Job title','Role','Added','Last sign-in',''];

 // The form that issues one. Every field is required except the job title: a login without
 // a password lets nobody in, and one without a name reaches colleagues as an identifier.
 const addForm=()=>
  `<form id="new-login" class="login-form"><div class="grid">`+
  `<label class="field">Login<input name="login" autocomplete="off" spellcheck="false" required placeholder="surname"></label>`+
  `<label class="field">Password<input name="password" type="password" autocomplete="new-password" required></label>`+
  `<label class="field">Name<input name="name" autocomplete="off" required placeholder="Alexander Pikul"></label>`+
  `<label class="field">Job title<input name="title" autocomplete="off" placeholder="Freight manager"></label>`+
  `<label class="field">Role<select name="role"><option value="member">Member</option>`+
  `<option value="owner">Owner — can issue logins</option></select></label>`+
  `</div><div class="button-row"><button type="submit" class="primary">Add login</button></div></form>`;

 // Setting a password lives in the opened-out row rather than a browser prompt: a password
 // typed into a prompt stands on the screen in full.
 const editorRow=row=>
  `<tr class="login-editor-row"><td></td><td colspan="7">`+
  `<form class="login-editor" data-id="${esc(row.id)}"><div class="grid">`+
  `<label class="field">New password for ${esc(row.username)}`+
  `<input name="password" type="password" autocomplete="new-password" required></label>`+
  `</div><div class="button-row">`+
  `<button type="submit" class="primary">Set password</button>`+
  `<button type="button" data-action="expand-login" data-id="${esc(row.id)}">Cancel</button>`+
  `</div></form></td></tr>`;

 const loginRow=(row,expandedId)=>{
  const expanded=row.id===expandedId;
  const owner=row.role==='owner';
  return `<tr class="login-row${row.self?' login-row--self':''}" data-login="${esc(row.id)}">`+
   `<td class="register-toggle"><button data-action="expand-login" data-id="${esc(row.id)}" `+
   `aria-expanded="${expanded}" aria-label="${expanded?'Close':'Set a password for'} ${esc(row.username)}">`+
   `${expanded?'▾':'▸'}</button></td>`+
   `<td class="name"><strong>${esc(row.username)}</strong>${row.self?'<small>You</small>':''}</td>`+
   `<td>${esc(row.name||'—')}</td>`+
   `<td>${esc(row.title||'—')}</td>`+
   `<td>${owner?'<strong>Owner</strong>':'Member'}</td>`+
   `<td>${esc(day(row.createdAt))}</td>`+
   // A login that has never been used says so plainly: that is the thing an owner needs to see.
   `<td>${row.lastSignInAt?esc(day(row.lastSignInAt)):'<span class="notice-inline">Never</span>'}</td>`+
   `<td class="register-actions">`+
   (row.self?''
    :`<button data-action="set-login-role" data-id="${esc(row.id)}" data-role="${owner?'member':'owner'}">`+
     `${owner?'Make member':'Make owner'}</button>`+
     `<button data-action="remove-login" data-id="${esc(row.id)}">Remove</button>`)+
   `</td></tr>`;
 };

 const EMPTY='<div class="empty-state"><strong>You are the only login</strong>'+
  '<span>Add one for each person who needs the platform. Nobody can create their own: '+
  'a login exists only if it was issued here.</span></div>';

 function render(rows,expandedId,organisation){
  const intro=`<div class="heading"><div><h2>ADMIN</h2>`+
   `<p class="section-intro">Who can sign in to ${esc(organisation||'this organisation')}. `+
   `The platform is closed: there is no registration, and a login exists only if it was issued here.</p>`+
   `</div></div>`;

  // Until the list has been read, that is what it says. An empty table reads as "nobody is
  // here", which is a different claim.
  if(rows===null)
   return `<section>${intro}<p class="muted">Reading the logins…</p></section>`;
  if(rows&&rows.ok===false)
   return `<section>${intro}<p class="error" role="alert">${esc(rows.error||'The logins could not be read.')}</p>`+
    addForm()+`</section>`;

  // One owner and nobody else is the ordinary state of a new deployment, and it is said
  // under the table rather than instead of it: the owner still has to see their own login.
  const list=Array.isArray(rows)?rows:[];
  const drawn=list.map(row=>loginRow(row,expandedId)+(row.id===expandedId?editorRow(row):''));
  const body=(list.length?table(COLUMNS,drawn,'login-table'):'')+(list.length<2?EMPTY:'');

  return `<section>`+intro+body+
   `<h3>Add a login</h3>`+
   `<p class="section-intro">The password is set here and cannot be read back afterwards — `+
   `only replaced. Pass it to the person by a route you trust, and change it if it went `+
   `anywhere you do not.</p>`+
   addForm()+
   `<p class="form-note">An owner can issue and remove logins. A member cannot, and sees no `+
   `such screen. Removing a login deletes the account; the calculations stay with the `+
   `organisation, and whoever was responsible for them has to be named again.</p>`+
   `</section>`;
 }

 return {render,day,loginRow:(row,expanded)=>loginRow(row,expanded),addForm,COLUMNS};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXAdminView=api;
})(globalThis);
