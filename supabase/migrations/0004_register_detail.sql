-- ProjectX — what a register row shows when it is opened out.
--
-- The register listed enough to recognise a calculation. Opening a row should answer the next
-- question without leaving the screen: what is actually in it, and who set it up. These come
-- from the voyage document that is already being read, so a row costs no extra query.

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
  v.document->'vesselSnapshot'->>'name'            as vessel_name,
  (select count(*) from jsonb_array_elements(coalesce(v.document->'lots','[]'::jsonb)) l
    where (l->>'selected')::boolean is true)       as parcels,
  (select string_agg(distinct p->>'name', ' · ' order by p->>'name')
     from jsonb_array_elements(coalesce(v.document->'ports','[]'::jsonb)) p) as ports,

  -- What is being carried, and how much of it. Only the parcels actually in the voyage count:
  -- a deselected one is not part of this calculation.
  (select string_agg(distinct l->>'name', ' · ' order by l->>'name')
     from jsonb_array_elements(coalesce(v.document->'lots','[]'::jsonb)) l
    where (l->>'selected')::boolean is true)       as cargoes,
  (select sum((l->>'quantity')::numeric)
     from jsonb_array_elements(coalesce(v.document->'lots','[]'::jsonb)) l
    where (l->>'selected')::boolean is true
      and jsonb_typeof(l->'quantity') = 'number')  as tonnage,

  -- Where the ballast leg starts, when one is included: the position the vessel is delivered
  -- at is part of recognising which option a calculation is.
  case when (v.document->>'ballastEnabled')::boolean is true
       then nullif(v.document->>'deliveryPort','') end as delivery_port
from voyages v
left join profiles responsible on responsible.user_id = v.responsible_id
left join profiles author      on author.user_id      = v.created_by
left join profiles editor      on editor.user_id      = v.updated_by;
