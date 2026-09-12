-- ProjectX — the reference registers, a row each.
--
-- 0001 stored CARGO, PORT and VESSEL as one document per organisation with a revision on it.
-- That is correct for one person and wrong for fifteen: two people editing different cargoes,
-- or one editing a port while another edits a vessel, write the same row, and the second is
-- refused as a conflict although nothing they touched overlapped.
--
-- Sales were already a row per deal for exactly this reason. The registers now match them.
-- What stays in catalogs is only the housekeeping the migrations use — seed markers and
-- revision stamps — which is written rarely and by one person at a time.

create table if not exists cargo_types (
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

create table if not exists port_records (
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

create table if not exists vessel_profiles (
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

create index if not exists cargo_types_org_idx     on cargo_types (org_id, updated_at desc);
create index if not exists port_records_org_idx    on port_records (org_id, updated_at desc);
create index if not exists vessel_profiles_org_idx on vessel_profiles (org_id, updated_at desc);

-- ---------------------------------------------------------------------------
-- Move what is already stored
-- ---------------------------------------------------------------------------

-- Each array in the existing catalogs document becomes rows. An entry without an id would
-- have no key, so it is skipped rather than stored under a made-up one: it stays in the
-- document until somebody gives it a name the application can key on.
insert into cargo_types (id, org_id, document)
select entry->>'id', c.org_id, entry
from catalogs c, jsonb_array_elements(coalesce(c.document->'cargoTypes','[]'::jsonb)) entry
where entry->>'id' is not null
on conflict (org_id, id) do nothing;

insert into port_records (id, org_id, document)
select entry->>'id', c.org_id, entry
from catalogs c, jsonb_array_elements(coalesce(c.document->'portRecords','[]'::jsonb)) entry
where entry->>'id' is not null
on conflict (org_id, id) do nothing;

insert into vessel_profiles (id, org_id, document)
select entry->>'id', c.org_id, entry
from catalogs c, jsonb_array_elements(coalesce(c.document->'vesselProfiles','[]'::jsonb)) entry
where entry->>'id' is not null
on conflict (org_id, id) do nothing;

-- The registers are rows now; the document keeps only the housekeeping markers.
update catalogs set document = document - 'cargoTypes' - 'portRecords' - 'vesselProfiles';

-- ---------------------------------------------------------------------------
-- Access
-- ---------------------------------------------------------------------------

alter table cargo_types     enable row level security;
alter table port_records    enable row level security;
alter table vessel_profiles enable row level security;

do $$
declare t text;
begin
  foreach t in array array['cargo_types','port_records','vessel_profiles'] loop
    execute format('drop policy if exists %I_select on %I', t, t);
    execute format('create policy %I_select on %I for select to authenticated using (is_member(org_id))', t, t);
    execute format('drop policy if exists %I_insert on %I', t, t);
    execute format('create policy %I_insert on %I for insert to authenticated with check (is_member(org_id))', t, t);
    execute format('drop policy if exists %I_update on %I', t, t);
    execute format('create policy %I_update on %I for update to authenticated using (is_member(org_id)) with check (is_member(org_id))', t, t);
    execute format('drop policy if exists %I_delete on %I', t, t);
    execute format('create policy %I_delete on %I for delete to authenticated using (is_member(org_id))', t, t);
    execute format('drop trigger if exists %I_touch on %I', t, t);
    execute format('create trigger %I_touch before insert or update on %I for each row execute function touch_row()', t, t);
  end loop;
end $$;
