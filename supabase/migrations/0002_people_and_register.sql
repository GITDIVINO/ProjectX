-- ProjectX — people, and the register of calculations.
--
-- The first migration recorded who wrote a row, but only as an auth user id: a colleague's
-- name was not readable, because auth.users is not exposed to other accounts. A desk of
-- fifteen people needs to see who is responsible for a calculation, so a profile carries the
-- name and the organisation can read it.

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

-- One per account. The display name is what appears against a calculation; the job title is
-- optional and descriptive only — it grants nothing.
create table if not exists profiles (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  job_title     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table profiles enable row level security;

-- A profile is readable by anyone who shares an organisation with it, and writable only by
-- the person it describes. Nobody renames a colleague.
drop policy if exists profiles_select on profiles;
create policy profiles_select on profiles
  for select to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from memberships mine
      join memberships theirs on theirs.org_id = mine.org_id
      where mine.user_id = auth.uid() and theirs.user_id = profiles.user_id
    )
  );

drop policy if exists profiles_insert on profiles;
create policy profiles_insert on profiles
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists profiles_update on profiles;
create policy profiles_update on profiles
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- A new account gets a profile immediately, named from the address until the person edits it,
-- so a calculation never shows a bare identifier.
create or replace function profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (user_id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1)))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function profile_for_new_user();

-- Accounts that already exist get one too, so this migration is not only for the future.
insert into profiles (user_id, display_name)
select id, coalesce(nullif(raw_user_meta_data->>'display_name',''), split_part(email,'@',1))
from auth.users
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- The responsible specialist
-- ---------------------------------------------------------------------------

-- Who answers for this calculation. It defaults to whoever created it and can be handed over,
-- because work moves between people and the register has to keep saying who holds it now.
-- It records responsibility for the work; it is not a permission, and it does not decide who
-- may edit. The commercial approval role stays with the head of freight (F-011).
alter table voyages add column if not exists responsible_id uuid references auth.users(id);
update voyages set responsible_id = created_by where responsible_id is null;

create index if not exists voyages_responsible_idx on voyages (org_id, responsible_id);

-- A calculation opens in the name of whoever made it.
create or replace function voyage_responsible_default()
returns trigger
language plpgsql
as $$
begin
  if new.responsible_id is null then
    new.responsible_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists voyages_responsible on voyages;
create trigger voyages_responsible before insert on voyages
  for each row execute function voyage_responsible_default();

-- ---------------------------------------------------------------------------
-- The register
-- ---------------------------------------------------------------------------

-- What the register screen reads: one row per calculation with the names already resolved,
-- so the page does not join three tables itself and cannot show a bare uuid by accident.
-- security_invoker keeps every row-level policy in force: the view shows what the reader is
-- allowed to see, and nothing else.
create or replace view voyage_register
with (security_invoker = true) as
select
  v.id,
  v.org_id,
  v.name,
  v.revision,
  v.catalog_revision,
  v.created_at,
  v.updated_at,
  v.responsible_id,
  coalesce(responsible.display_name, 'Unassigned') as responsible_name,
  responsible.job_title                            as responsible_title,
  v.created_by,
  coalesce(author.display_name, '—')               as created_by_name,
  v.updated_by,
  coalesce(editor.display_name, '—')               as updated_by_name,
  -- A calculation is opened from its register row, so the row carries enough of the voyage
  -- to be recognised without loading the document: the vessel and the ports it calls at.
  v.document->'vesselSnapshot'->>'name'            as vessel_name,
  (select count(*) from jsonb_array_elements(coalesce(v.document->'lots','[]'::jsonb)) l
    where (l->>'selected')::boolean is true)       as parcels,
  (select string_agg(distinct p->>'name', ' · ' order by p->>'name')
     from jsonb_array_elements(coalesce(v.document->'ports','[]'::jsonb)) p) as ports
from voyages v
left join profiles responsible on responsible.user_id = v.responsible_id
left join profiles author      on author.user_id      = v.created_by
left join profiles editor      on editor.user_id      = v.updated_by;

-- ---------------------------------------------------------------------------
-- Who is in the organisation
-- ---------------------------------------------------------------------------

-- The list a person picks from when handing a calculation over. Same policies apply: it shows
-- the organisations the reader belongs to and the people in them.
create or replace view organisation_members
with (security_invoker = true) as
select
  m.org_id,
  m.user_id,
  m.role,
  coalesce(p.display_name, '—') as display_name,
  p.job_title
from memberships m
left join profiles p on p.user_id = m.user_id;
