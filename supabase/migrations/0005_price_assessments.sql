-- ProjectX — the price assessment register.
--
-- A netback cannot be compared across destinations without a price at each destination. The
-- voyage engine answers what delivery costs; this table holds what the market pays, by cargo,
-- destination and month, with the source and the publication date beside every figure.
--
-- One row per assessment, like the other registers: fifteen people entering a curve for
-- different destinations must not collide on a single document. The uniqueness rule that the
-- application enforces — one figure per cargo, destination and month — is enforced here too,
-- because a forward matrix that has to choose between two figures for one cell is worse than
-- one that shows nothing for it.

create table if not exists price_assessments (
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

create index if not exists price_assessments_org_idx on price_assessments (org_id, updated_at desc);

-- The cell an assessment is for. A second figure for the same cargo, destination and month is
-- refused rather than stored beside the first.
create unique index if not exists price_assessments_cell_idx on price_assessments (
  org_id,
  (document->>'cargoId'),
  (document->>'destination'),
  (document->>'month')
);

alter table price_assessments enable row level security;

drop policy if exists price_assessments_select on price_assessments;
create policy price_assessments_select on price_assessments
  for select to authenticated using (is_member(org_id));

drop policy if exists price_assessments_insert on price_assessments;
create policy price_assessments_insert on price_assessments
  for insert to authenticated with check (is_member(org_id));

drop policy if exists price_assessments_update on price_assessments;
create policy price_assessments_update on price_assessments
  for update to authenticated using (is_member(org_id)) with check (is_member(org_id));

drop policy if exists price_assessments_delete on price_assessments;
create policy price_assessments_delete on price_assessments
  for delete to authenticated using (is_member(org_id));

drop trigger if exists price_assessments_touch on price_assessments;
create trigger price_assessments_touch before insert or update on price_assessments
  for each row execute function touch_row();
