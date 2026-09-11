-- ProjectX — initial shared schema.
--
-- Shape follows audit finding P-03: the reference catalogs, the sales register and a named
-- calculation are three different documents with three different lifetimes. The prototype
-- stored all three in one blob, which made 96 % of every saved calculation a private copy of
-- the catalogs and left a catalog correction invisible to calculations already saved.
--
-- Access is enforced here, in the database, not in the browser. The anon key is public by
-- design; these policies are what decides which rows it can reach.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Organisations and membership
-- ---------------------------------------------------------------------------

create table if not exists organisations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

-- Roles are recorded but not yet interpreted: the commercial approval role (F-011, head of
-- freight) is confirmed, the rest stay open under Q-009 and Q-018. Adding a role here does
-- not grant an approval right anywhere in the process.
create table if not exists memberships (
  org_id      uuid not null references organisations(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'member',
  created_at  timestamptz not null default now(),
  primary key (org_id, user_id)
);

-- A policy on memberships that reads memberships would recurse. This function runs as owner
-- with a fixed search_path and is the single membership test used by every policy below.
create or replace function is_member(target_org uuid)
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
  );
$$;

revoke execute on function is_member(uuid) from public;
grant execute on function is_member(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Shared reference catalogs — one row per organisation
-- ---------------------------------------------------------------------------

-- CARGO, PORT and VESSEL registers. One document because they are edited together and read
-- together, and because a voyage pins the revision it was planned against rather than the
-- individual rows it used.
create table if not exists catalogs (
  org_id      uuid primary key references organisations(id) on delete cascade,
  document    jsonb not null default '{}'::jsonb,
  revision    bigint not null default 1,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id)
);

-- ---------------------------------------------------------------------------
-- Sales register — one row per concluded deal
-- ---------------------------------------------------------------------------

-- A row per sale, not one document per organisation: two traders editing different deals must
-- not collide, and a sale outlives any single calculation that includes it.
create table if not exists sales (
  id          text not null,
  org_id      uuid not null references organisations(id) on delete cascade,
  document    jsonb not null,
  revision    bigint not null default 1,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id),
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id),
  primary key (org_id, id)
);

create index if not exists sales_org_updated_idx on sales (org_id, updated_at desc);

-- ---------------------------------------------------------------------------
-- Named calculations
-- ---------------------------------------------------------------------------

create table if not exists voyages (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references organisations(id) on delete cascade,
  name              text not null,
  document          jsonb not null,
  -- Which revision of the catalogs this calculation was planned against. A later correction
  -- to the catalogs is then detectable instead of being applied silently to past work.
  catalog_revision  bigint not null default 0,
  -- Bumped on every write. A write matches on the revision the client read; no matched row
  -- means somebody else wrote first, and the client resolves rather than overwrites.
  revision          bigint not null default 1,
  created_at        timestamptz not null default now(),
  created_by        uuid references auth.users(id),
  updated_at        timestamptz not null default now(),
  updated_by        uuid references auth.users(id)
);

create index if not exists voyages_org_updated_idx on voyages (org_id, updated_at desc);

-- ---------------------------------------------------------------------------
-- Approval snapshots — append only
-- ---------------------------------------------------------------------------

-- Inputs and catalogs are stored together with the result, so a later engine version or a
-- later catalog correction cannot restate a decision that was already taken. There is
-- deliberately no update and no delete policy on this table.
create table if not exists voyage_snapshots (
  id                uuid primary key default gen_random_uuid(),
  voyage_id         uuid not null references voyages(id) on delete cascade,
  org_id            uuid not null references organisations(id) on delete cascade,
  label             text not null default '',
  revision          bigint not null,
  document          jsonb not null,
  catalogs          jsonb not null,
  catalog_revision  bigint not null,
  created_at        timestamptz not null default now(),
  created_by        uuid references auth.users(id)
);

create index if not exists voyage_snapshots_voyage_idx on voyage_snapshots (voyage_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table organisations    enable row level security;
alter table memberships      enable row level security;
alter table catalogs         enable row level security;
alter table sales            enable row level security;
alter table voyages          enable row level security;
alter table voyage_snapshots enable row level security;

-- Organisations: a member sees their own organisation and nothing else. Creating an
-- organisation is an administrative step, performed with the service key, not from the page.
drop policy if exists organisations_select on organisations;
create policy organisations_select on organisations
  for select to authenticated using (is_member(id));

-- Membership: a member sees who else is in the organisation. Changing membership is an
-- administrative step; there is no insert, update or delete policy for the page.
drop policy if exists memberships_select on memberships;
create policy memberships_select on memberships
  for select to authenticated using (is_member(org_id));

drop policy if exists catalogs_select on catalogs;
create policy catalogs_select on catalogs
  for select to authenticated using (is_member(org_id));
drop policy if exists catalogs_insert on catalogs;
create policy catalogs_insert on catalogs
  for insert to authenticated with check (is_member(org_id));
drop policy if exists catalogs_update on catalogs;
create policy catalogs_update on catalogs
  for update to authenticated using (is_member(org_id)) with check (is_member(org_id));

drop policy if exists sales_select on sales;
create policy sales_select on sales
  for select to authenticated using (is_member(org_id));
drop policy if exists sales_insert on sales;
create policy sales_insert on sales
  for insert to authenticated with check (is_member(org_id));
drop policy if exists sales_update on sales;
create policy sales_update on sales
  for update to authenticated using (is_member(org_id)) with check (is_member(org_id));
drop policy if exists sales_delete on sales;
create policy sales_delete on sales
  for delete to authenticated using (is_member(org_id));

drop policy if exists voyages_select on voyages;
create policy voyages_select on voyages
  for select to authenticated using (is_member(org_id));
drop policy if exists voyages_insert on voyages;
create policy voyages_insert on voyages
  for insert to authenticated with check (is_member(org_id));
drop policy if exists voyages_update on voyages;
create policy voyages_update on voyages
  for update to authenticated using (is_member(org_id)) with check (is_member(org_id));
drop policy if exists voyages_delete on voyages;
create policy voyages_delete on voyages
  for delete to authenticated using (is_member(org_id));

-- Snapshots: readable and appendable by members, never updated and never deleted.
drop policy if exists voyage_snapshots_select on voyage_snapshots;
create policy voyage_snapshots_select on voyage_snapshots
  for select to authenticated using (is_member(org_id));
drop policy if exists voyage_snapshots_insert on voyage_snapshots;
create policy voyage_snapshots_insert on voyage_snapshots
  for insert to authenticated with check (is_member(org_id));

-- ---------------------------------------------------------------------------
-- Authorship and timestamps
-- ---------------------------------------------------------------------------

-- updated_at and updated_by are set by the database, so a client cannot claim another
-- author or an earlier time.
create or replace function touch_row()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  if tg_op = 'INSERT' then
    new.created_at := now();
    new.created_by := auth.uid();
  end if;
  return new;
end;
$$;

create or replace function stamp_author()
returns trigger
language plpgsql
as $$
begin
  new.created_at := now();
  new.created_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists catalogs_touch on catalogs;
create trigger catalogs_touch before insert or update on catalogs
  for each row execute function touch_row();

drop trigger if exists sales_touch on sales;
create trigger sales_touch before insert or update on sales
  for each row execute function touch_row();

drop trigger if exists voyages_touch on voyages;
create trigger voyages_touch before insert or update on voyages
  for each row execute function touch_row();

drop trigger if exists voyage_snapshots_stamp on voyage_snapshots;
create trigger voyage_snapshots_stamp before insert on voyage_snapshots
  for each row execute function stamp_author();
