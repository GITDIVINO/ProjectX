(function(root){
'use strict';
// Who is working, and on behalf of which organisation.
//
// The screen and the conversation with the identity provider live here; what happens once
// somebody is in — opening their workspace, drawing the planner — stays with the caller and
// arrives as onSignedIn. That boundary is the point: this module can refuse entry without
// knowing what a voyage is.
//
// A login, not an address. The platform is closed: the owner issues accounts on the ADMIN
// tab, nobody can register, and a login has no mailbox — so there is no code by mail either.
// The password is read at the moment it is sent and kept nowhere: not in state, not in
// storage.
//
// What stopped somebody is said step by step. "That login and password were not accepted",
// "you are not in an organisation yet" and "the database cannot be reached" are three
// different things, and they need three different answers.

function create(env){
 const {storage,esc,byId,document,onSignedIn}=env;
 const $=byId;

 let signInLogin='';
 // The tab strip and the calculation controls are meaningless before anything has been read.
 function showChrome(visible){
  const actions=$('planner-actions');
  if(actions)actions.hidden=!visible;
  const tabList=typeof document.querySelector==='function'?document.querySelector('.workspace-tabs'):null;
  if(tabList)tabList.hidden=!visible;
 }
 function showSignIn(message){
  showChrome(false);
  $('app').innerHTML=`<section class="sign-in"><h2>Sign in</h2>`+
   `<p class="section-intro">Calculations are shared with your organisation.</p>`+
   `<form id="sign-in-form"><div class="grid">`+
   `<label>Login<input id="sign-in-login" type="text" autocomplete="username" spellcheck="false" `+
   `autocapitalize="none" required value="${esc(signInLogin)}"></label>`+
   `<label>Password<input id="sign-in-password" type="password" autocomplete="current-password"></label>`+
   `</div><div class="button-row"><button id="sign-in-submit" type="submit">Sign in</button></div></form>`+
   // There is no registration, and the sign-in screen says so rather than leaving somebody
   // hunting for a button that does not exist.
   `<p class="muted sign-in-note">This platform is closed. Logins are issued by the owner of `+
   `your organisation; there is no registration and no password reset by email.</p>`+
   `<p class="muted" id="sign-in-message">${esc(message||'')}</p></section>`;
  const say=text=>{const line=$('sign-in-message');if(line)line.textContent=text;};
  const login=()=>{signInLogin=($('sign-in-login')||{}).value||'';return signInLogin.trim();};
  // The password is read at the moment it is sent and is never stored, echoed or kept in state.
  const secret=()=>(($('sign-in-password')||{}).value||'');

  $('sign-in-form').onsubmit=async event=>{
   event.preventDefault();
   if(!login()||!secret()){say('Enter your login and password.');return;}
   say('Signing in…');
   const signedIn=await storage.signInWithLogin(login(),secret());
   // A wrong login and a wrong password answer identically on purpose: anything else turns
   // the sign-in form into a way of discovering which logins exist.
   if(!signedIn.ok){say(signedIn.error||'That login and password were not accepted.');return;}
   await start();
  };
 }

 // Identity, then membership, then the caller's workspace. Each step that fails says which
 // one it was, because "could not sign in" and "not a member yet" need different answers.
 async function start(){
  const who=await storage.ready();
  if(!who.ok){
   showSignIn(who.reason==='signed-out'?'':(who.error||'The workspace could not be reached.'));
   return {ok:false,reason:who.reason||'error'};
  }
  const organisations=await storage.organisations();
  if(organisations.ok===false){
   showSignIn(organisations.error||'Your organisations could not be read.');
   return {ok:false,reason:'organisations'};
  }
  if(!organisations.length){
   showSignIn('That login exists but belongs to no organisation yet. Ask the owner to add it.');
   return {ok:false,reason:'no-membership'};
  }
  // A configured organisation is a preference between several, not a requirement.
  const preferred=organisations.find(x=>x.id===storage.orgId)||organisations[0];
  storage.useOrganisation(preferred.id);
  showChrome(true);
  // The id travels with the account: the register counts what is yours by it, and a name
  // is not an identity. The role comes from the membership and gives the owner the ADMIN
  // tab — but the right to issue a login is checked by the database, not by this line.
  await onSignedIn({id:who.user.id,login:String(who.user.email||'').split('@')[0],
   organisation:preferred.name,organisationId:preferred.id,role:preferred.role||'member'});
  return {ok:true,user:who.user,organisation:preferred};
 }

 async function signOut(){
  if(storage.signOut)await storage.signOut();
  showSignIn('You have been signed out.');
 }

 return {start,signOut,showSignIn,showChrome};
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXSignIn=api;
})(globalThis);
