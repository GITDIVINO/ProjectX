-- ProjectX — logins instead of addresses, and the owner who issues them.
--
-- The platform is closed. Nobody registers; the owner creates the account. Three things
-- follow from that, and they are what this migration does.
--
-- 1. A profile gains a `username` — what a person types to sign in. Supabase Auth knows a
--    password only against an address, so the account keeps a service address
--    `<username>@<login domain>` which is never shown and never receives anything. The login
--    is kept in profiles rather than read from auth.users: auth.users is not visible to a
--    colleague, and the list of people has to show who is who.
--
-- 2. A login is an identity, not a signature. Nobody changes their own: the right to update
--    is granted per column, and username is not one of them. Name and job title stay a
--    person's own to edit, as before.
--
-- 3. The role `owner` in memberships is the person who issues logins. It is tested by
--    is_owner, the way membership is tested by is_member: a policy that read memberships
--    directly would recurse.
--
-- An account cannot be created from the browser and never will be: that needs the service
-- key, which has no business being in a page. supabase/functions/admin-users holds it, and
-- Supabase puts it into that function's environment itself. This migration prepares what the
-- function writes to.

-- ---------------------------------------------------------------------------
-- The login
-- ---------------------------------------------------------------------------

alter table profiles add column if not exists username text;

-- For an account that already exists the login is the address up to the "@": that is what
-- the person was already called.
update profiles p
set username = split_part(u.email, '@', 1)
from auth.users u
where u.id = p.user_id and p.username is null;

-- One login per account, regardless of case: "Aldivino" and "aldivino" are one person.
create unique index if not exists profiles_username_key on profiles (lower(username));

-- What a login may be: lowercase letters, digits, dot, dash, underscore; 3 to 32 characters;
-- beginning with a letter or a digit. The constraint is `not valid`, so rows already stored
-- are not re-checked while everything new must conform — an address a login was derived from
-- could have held anything, and failing the migration over an old row would be wrong.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_username_shape') then
    alter table profiles add constraint profiles_username_shape
      check (username is null or username ~ '^[a-z0-9][a-z0-9._-]{2,31}$') not valid;
  end if;
end $$;

-- A login is set when the account is created and is not the profile owner's to change. The
-- write right is granted per column: the policy decides which row may be edited, the grant
-- decides which fields. The service key used by admin-users passes outside both.
revoke update on profiles from authenticated;
grant update (display_name, job_title, updated_at) on profiles to authenticated;

-- A new account gets its profile at once. The login comes from the metadata the creating
-- function sets, and from the address otherwise.
create or replace function profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (user_id, display_name, username, job_title)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1)),
    coalesce(nullif(new.raw_user_meta_data->>'username',''), split_part(new.email,'@',1)),
    nullif(new.raw_user_meta_data->>'job_title','')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- The owner
-- ---------------------------------------------------------------------------

-- Who in this organisation issues logins. Separate from is_member: membership opens the
-- calculations, ownership creates the people. The responsible specialist on a calculation is
-- unrelated to either and is not a permission (F-011).
create or replace function is_owner(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from memberships
    where memberships.org_id = target_org
      and memberships.user_id = auth.uid()
      and memberships.role = 'owner'
  );
$$;

revoke execute on function is_owner(uuid) from public;
grant execute on function is_owner(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Who is in the organisation
-- ---------------------------------------------------------------------------

-- The same list as before, plus the login and the date the person was added: the admin screen
-- shows who was issued a login and when. security_invoker keeps the policies in force — an
-- organisation somebody does not belong to stays invisible, logins included.
create or replace view organisation_members
with (security_invoker = true) as
select
  m.org_id,
  m.user_id,
  m.role,
  coalesce(p.display_name, '—') as display_name,
  p.job_title,
  p.username,
  m.created_at
from memberships m
left join profiles p on p.user_id = m.user_id;
