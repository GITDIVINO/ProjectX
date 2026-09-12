(function(root){
'use strict';
// Issuing logins, from the page's side.
//
// The platform is closed: nobody can register, and an account is created by the owner.
// Creating one needs the service key, which has no business being in a browser, so there is
// not a single account operation here — only a check of what was typed and a call to
// supabase/functions/admin-users, where Supabase holds that key. The database decides the
// right: the function asks it is_owner as the caller. A hidden tab is not protection, and
// nothing in this file treats it as any.
//
// The login rules and the password minimum are stated in three places — here, in the
// function and in the database — on purpose. A rule checked in one place is a rule somebody
// will eventually reach around.

function create(env){
 const {storage}=env;

 // A login: lowercase letters, digits, dot, dash, underscore; 3 to 32 characters.
 const USERNAME=/^[a-z0-9][a-z0-9._-]{2,31}$/;
 const MIN_PASSWORD=10;
 const ROLES=['member','owner'];

 const normalise=login=>String(login??'').trim().toLowerCase();

 // What is wrong with what was typed, in one sentence, or nothing. Separate from sending,
 // because the form should say it before anything leaves the page.
 function problemWith({login,password,role}={},{creating=true}={}){
  if(creating&&!USERNAME.test(normalise(login)))
   return 'A login is 3 to 32 characters: lowercase letters, digits, dot, dash or underscore.';
  if(password!==undefined&&String(password).length<MIN_PASSWORD)
   return 'A password needs at least '+MIN_PASSWORD+' characters.';
  if(role!==undefined&&!ROLES.includes(role))
   return 'A login is either a member or an owner.';
  return null;
 }

 // No operation without a transport: the browser-local mode has no accounts at all, and
 // saying so is better than failing on a method that is not there.
 async function call(action,payload){
  if(typeof storage.adminUsers!=='function')
   return {ok:false,error:'Logins are managed by the shared deployment. This page is running in one browser only.'};
  return storage.adminUsers(action,payload);
 }

 return {
  USERNAME,MIN_PASSWORD,ROLES,normalise,problemWith,

  list:()=>call('list',{}),

  add({login,password,name,title,role='member'}){
   const problem=problemWith({login,password,role});
   if(problem)return Promise.resolve({ok:false,error:problem});
   return call('create',{username:normalise(login),password,name:name||'',title:title||'',role});
  },

  // Setting a password is not reading the old one: nobody knows it and nobody can.
  setPassword(userId,password){
   const problem=problemWith({password},{creating:false});
   if(problem)return Promise.resolve({ok:false,error:problem});
   return call('password',{userId,password});
  },

  setRole(userId,role){
   const problem=problemWith({role},{creating:false});
   if(problem)return Promise.resolve({ok:false,error:problem});
   return call('role',{userId,role});
  },

  remove:userId=>call('remove',{userId})
 };
}

const api={create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXAdmin=api;
})(globalThis);
