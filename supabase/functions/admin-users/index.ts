// ProjectX — issuing logins. The only place an account is created.
//
// Why this is a function and not part of the page. Creating a user needs the service_role
// key, and that key must never be in a page: it bypasses every access policy, so anybody who
// opened the source would hold the whole database. Supabase puts the key into this function's
// environment itself, so nobody copies or stores it.
//
// Who decides. Not this function and not the page, but the database: the right is checked by
// calling is_owner as the caller. If they hold no owner role in that organisation Postgres
// answers false and nothing further happens. A tab hidden in the interface is not protection;
// this is.
//
// There is no registration. Self sign-up has to be turned off in the project settings
// (Authentication → Sign In / Providers → Email → Allow new users to sign up), or the
// anonymous key can create an account around this function. Such an account would see no
// calculation at all — the policies do not allow it — but in a closed platform it should not
// exist in the first place.

import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.58.0';

// The service domain of a login. Never shown, and not mail: Supabase Auth knows a password
// only against an address, so a login has one. The value must match LOGIN_DOMAIN in
// platform/storage-supabase.js, which platform/admin.test.js checks.
const LOGIN_DOMAIN = Deno.env.get('LOGIN_DOMAIN') || 'projectx.local';

// A login: lowercase letters, digits, dot, dash, underscore; 3 to 32 characters. The same
// rule stands as a constraint in the database, because a rule checked in one place is a rule
// somebody will eventually reach around.
const USERNAME = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const MIN_PASSWORD = 10;
const ROLES = ['member', 'owner'];

const CORS = {
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Headers': 'authorization, content-type',
 'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const reply = (body: unknown, status = 200) =>
 new Response(JSON.stringify(body), {status, headers: {...CORS, 'Content-Type': 'application/json'}});

const refuse = (error: string, status = 400) => reply({ok: false, error}, status);

const env = (...names: string[]) => {
 for (const name of names) {
  const value = Deno.env.get(name);
  if (value) return value;
 }
 return '';
};

Deno.serve(async request => {
 if (request.method === 'OPTIONS') return new Response('ok', {headers: CORS});
 if (request.method !== 'POST') return refuse('Only POST is accepted', 405);

 const url = env('SUPABASE_URL', 'SB_URL');
 const anonKey = env('SUPABASE_ANON_KEY', 'SB_ANON_KEY', 'SUPABASE_PUBLISHABLE_KEY');
 const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY', 'SB_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY');
 if (!url || !anonKey || !serviceKey)
  return refuse('The function is missing its Supabase environment', 500);

 const authorization = request.headers.get('Authorization') || '';
 if (!authorization) return refuse('Sign in first', 401);

 // A client acting as the caller: their token, the anonymous key, every policy in force.
 const asCaller = createClient(url, anonKey, {global: {headers: {Authorization: authorization}}});
 const {data: me, error: whoFailed} = await asCaller.auth.getUser();
 if (whoFailed || !me?.user) return refuse('Sign in first', 401);

 let body: Record<string, unknown>;
 try {
  body = await request.json();
 } catch {
  return refuse('Expected a JSON body');
 }

 const action = String(body.action || '');
 const orgId = String(body.orgId || '');
 if (!orgId) return refuse('Name the organisation');

 // The right is asked of the database, not of ourselves. is_owner runs as the caller.
 const {data: owns, error: checkFailed} = await asCaller.rpc('is_owner', {target_org: orgId});
 if (checkFailed) return refuse(checkFailed.message, 500);
 if (owns !== true) return refuse('Only the owner of this organisation can manage logins', 403);

 const admin = createClient(url, serviceKey, {auth: {persistSession: false}});

 // A member of this organisation is the only person an owner may change. An account in
 // another organisation is reachable with the service key, which is exactly why it is
 // checked here rather than assumed.
 const memberOfThisOrg = async (userId: string) => {
  const {data} = await admin.from('memberships').select('user_id, role')
   .eq('org_id', orgId).eq('user_id', userId).maybeSingle();
  return data || null;
 };
 const ownerCount = async () => {
  const {data} = await admin.from('memberships').select('user_id')
   .eq('org_id', orgId).eq('role', 'owner');
  return (data || []).length;
 };

 try {
  if (action === 'list') {
   // Who was issued a login, when, and when they last signed in. The last sign-in lives in
   // auth.users, which is not visible to a colleague, so the list is assembled here.
   const {data: members, error} = await admin.from('organisation_members')
    .select('user_id, role, display_name, job_title, username, created_at').eq('org_id', orgId);
   if (error) return refuse(error.message, 500);
   const {data: accounts} = await admin.auth.admin.listUsers({page: 1, perPage: 1000});
   const seen = new Map((accounts?.users || []).map(u => [u.id, u.last_sign_in_at]));
   return reply({
    ok: true,
    logins: (members || []).map(m => ({
     id: m.user_id,
     username: m.username,
     name: m.display_name,
     title: m.job_title,
     role: m.role,
     createdAt: m.created_at,
     lastSignInAt: seen.get(m.user_id) || null,
     self: m.user_id === me.user.id
    }))
   });
  }

  if (action === 'create') {
   const username = String(body.username || '').trim().toLowerCase();
   const password = String(body.password || '');
   const name = String(body.name || '').trim();
   const title = String(body.title || '').trim();
   const role = String(body.role || 'member');
   if (!USERNAME.test(username))
    return refuse('A login is 3 to 32 characters: lowercase letters, digits, dot, dash or underscore');
   if (password.length < MIN_PASSWORD)
    return refuse('A password needs at least ' + MIN_PASSWORD + ' characters');
   if (!ROLES.includes(role)) return refuse('A login is either a member or an owner');

   // A login already taken is refused, never overwritten with somebody else's password.
   const {data: taken} = await admin.from('profiles').select('user_id').ilike('username', username).maybeSingle();
   if (taken) return refuse('The login "' + username + '" is taken');

   const {data: created, error: createFailed} = await admin.auth.admin.createUser({
    email: username + '@' + LOGIN_DOMAIN,
    password,
    email_confirm: true,   // there is nothing to confirm: nobody receives mail at this address
    user_metadata: {username, display_name: name || username, job_title: title || null}
   });
   if (createFailed || !created?.user) return refuse(createFailed?.message || 'The login could not be created', 500);

   // The profile is created by the on_auth_user_created trigger. The membership is created
   // here: without it a person signs in and sees no calculation at all.
   const {error: joinFailed} = await admin.from('memberships')
    .insert({org_id: orgId, user_id: created.user.id, role});
   if (joinFailed) {
    // An account with no membership is useless and misleading, so what was created is
    // taken back rather than left behind.
    await admin.auth.admin.deleteUser(created.user.id);
    return refuse('The login was created but could not join the organisation: ' + joinFailed.message, 500);
   }
   return reply({ok: true, id: created.user.id, username});
  }

  if (action === 'password') {
   const userId = String(body.userId || '');
   const password = String(body.password || '');
   if (password.length < MIN_PASSWORD)
    return refuse('A password needs at least ' + MIN_PASSWORD + ' characters');
   if (!await memberOfThisOrg(userId)) return refuse('That login is not in this organisation', 404);
   const {error} = await admin.auth.admin.updateUserById(userId, {password});
   return error ? refuse(error.message, 500) : reply({ok: true, id: userId});
  }

  if (action === 'role') {
   const userId = String(body.userId || '');
   const role = String(body.role || '');
   if (!ROLES.includes(role)) return refuse('A login is either a member or an owner');
   const membership = await memberOfThisOrg(userId);
   if (!membership) return refuse('That login is not in this organisation', 404);
   // An organisation with no owner can issue no login at all — including the one that
   // would give the right back.
   if (membership.role === 'owner' && role !== 'owner' && await ownerCount() < 2)
    return refuse('This is the only owner. Make somebody else an owner first', 409);
   const {error} = await admin.from('memberships').update({role})
    .eq('org_id', orgId).eq('user_id', userId);
   return error ? refuse(error.message, 500) : reply({ok: true, id: userId, role});
  }

  if (action === 'remove') {
   const userId = String(body.userId || '');
   if (userId === me.user.id) return refuse('You cannot remove your own login', 409);
   const membership = await memberOfThisOrg(userId);
   if (!membership) return refuse('That login is not in this organisation', 404);
   if (membership.role === 'owner' && await ownerCount() < 2)
    return refuse('This is the only owner. Make somebody else an owner first', 409);
   // The account is deleted whole: the profile and the membership go with it. The
   // calculations stay, because they belong to the organisation, and whoever was
   // responsible for them has to be named again.
   const {error} = await admin.auth.admin.deleteUser(userId);
   return error ? refuse(error.message, 500) : reply({ok: true, id: userId});
  }

  return refuse('Unknown action: ' + action);
 } catch (error) {
  return refuse(error instanceof Error ? error.message : String(error), 500);
 }
});
