(function(root){
'use strict';
// Who is working, and on behalf of which organisation.
//
// The screen and the conversation with the identity provider live here; what happens once
// somebody is in — opening their workspace, drawing the planner — stays with the caller and
// arrives as onSignedIn. That boundary is the point: this module can refuse entry without
// knowing what a voyage is.
//
// A password is read at the moment it is sent and kept nowhere. Supabase's built-in mail is
// rate-limited and meant for trying things out, so the code route is folded away rather than
// offered first.

function create(env){
 const {storage,esc,byId,document,onSignedIn}=env;
 const $=byId;

 let signInAddress='';
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
   `<label>Work email<input id="sign-in-email" type="email" autocomplete="email" required value="${esc(signInAddress)}"></label>`+
   `<label>Password<input id="sign-in-password" type="password" autocomplete="current-password"></label>`+
   `</div><div class="button-row"><button id="sign-in-submit" type="submit">Sign in</button></div></form>`+
   `<details class="sign-in-alternative"><summary>Sign in with a code instead</summary>`+
   `<p class="muted">A code is sent to your address. Delivery depends on the mail service configured for this project.</p>`+
   `<div class="grid"><label>Sign-in code<input id="sign-in-code" type="text" inputmode="numeric" autocomplete="one-time-code"></label></div>`+
   `<div class="button-row"><button id="sign-in-send" type="button">Send code</button>`+
   `<button id="sign-in-verify" type="button">Use code</button></div></details>`+
   `<p class="muted" id="sign-in-message">${esc(message||'')}</p></section>`;
  const say=text=>{const line=$('sign-in-message');if(line)line.textContent=text;};
  const address=()=>{signInAddress=($('sign-in-email')||{}).value||'';return signInAddress.trim();};
  // The password is read at the moment it is sent and is never stored, echoed or kept in state.
  const secret=()=>(($('sign-in-password')||{}).value||'');

  $('sign-in-form').onsubmit=async event=>{
   event.preventDefault();
   if(!address()||!secret()){say('Enter your work email and password.');return;}
   say('Signing in…');
   const signedIn=await storage.signInWithPassword(address(),secret());
   if(!signedIn.ok){say(signedIn.error||'That email and password were not accepted.');return;}
   await start();
  };
  $('sign-in-send').onclick=async()=>{
   if(!address()){say('Enter your work email address.');return;}
   say('Sending…');
   const sent=await storage.signIn(address());
   say(sent.ok?'A sign-in code was sent to '+address()+'. Enter it below.':(sent.error||'The code could not be sent.'));
  };
  $('sign-in-verify').onclick=async()=>{
   const code=(($('sign-in-code')||{}).value||'').trim();
   if(!address()||!code){say('Enter the address and the code that was sent to it.');return;}
   say('Signing in…');
   const verified=await storage.verifyCode(address(),code);
   if(!verified.ok){say(verified.error||'That code was not accepted.');return;}
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
   showSignIn('Signed in as '+who.user.email+', but this account is not a member of any organisation yet. Ask an administrator to add it.');
   return {ok:false,reason:'no-membership'};
  }
  // A configured organisation is a preference between several, not a requirement.
  const preferred=organisations.find(x=>x.id===storage.orgId)||organisations[0];
  storage.useOrganisation(preferred.id);
  showChrome(true);
  // The id travels with the account: the register counts what is yours by it, and a name
  // is not an identity.
  await onSignedIn({id:who.user.id,email:who.user.email,organisation:preferred.name,organisationId:preferred.id});
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
