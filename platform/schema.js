(function(root){
'use strict';
// One in-memory state, three stored documents.
//
// Audit finding P-03: a saved calculation is 96 % a private copy of the shared reference
// catalogs (108 KB of catalogs around 4 KB of voyage). Storing that shape in a shared
// database would duplicate the catalog per calculation and would leave a catalog correction
// invisible to every calculation already saved.
//
// split() and merge() are the single place that decides which key belongs to which document.
// Every key the model adds later falls to the voyage unless it is named below, so a new field
// is never silently published into shared organisation data.

// Shared registers, edited in CARGO / PORT / VESSEL / SALE. Each is a list of records with
// an id, and each record is stored as its own row: fifteen people editing different cargoes,
// or one editing a port while another edits a vessel, must not collide. A single document per
// organisation would refuse the second writer although nothing they touched overlapped.
const REGISTER_KEYS=[
 'cargoTypes',            // reference cargo register with planning SF and IMSBC group
 'portRecords',           // port and berth register with published size limits
 'vesselProfiles',        // editable vessel particulars
 'sales',                 // concluded deals; a sale outlives any one voyage
 'priceAssessments'       // market prices by destination and month, with their source
];

// Housekeeping the migrations read: seed markers and revision stamps. One document per
// organisation is right for these — they are written rarely, and by one person at a time.
const MARKER_KEYS=[
 'importedCargoSeeds',
 'catalogAdditions',
 'portProfileRevision',
 'portBerthRevision',
 'tbnSourceRevision'
];

// Sales have always been their own document; the other registers and the markers are what
// "catalogs" means to the adapters. Sales must not appear in both, because split() decides by
// the first list that matches and would send them to the wrong place.
const SALES_KEYS=['sales'];
const CATALOG_KEYS=[...REGISTER_KEYS.filter(k=>!SALES_KEYS.includes(k)),...MARKER_KEYS];

// Everything else is the voyage document, including vesselSnapshot: the particulars pinned
// into this calculation stay with the calculation and are not re-read from the catalog.
const copy=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));

function split(state){
 const catalogs={},sales={},voyage={},registers={},markers={};
 for(const key of Object.keys(state)){
  const target=CATALOG_KEYS.includes(key)?catalogs:SALES_KEYS.includes(key)?sales:voyage;
  target[key]=copy(state[key]);
  if(REGISTER_KEYS.includes(key))registers[key]=copy(state[key])||[];
  else if(MARKER_KEYS.includes(key))markers[key]=copy(state[key]);
 }
 // Every register the state did not carry is an empty one, so a caller can write each of them
 // without first asking whether it exists.
 for(const key of REGISTER_KEYS)registers[key]??=[];
 return {catalogs,sales,voyage,registers,markers};
}

function merge(parts){
 const {catalogs={},sales={},voyage={},registers,markers}=parts||{};
 // Either shape may be handed in: the whole catalogs document, or the registers and markers
 // that replaced it. The registers win where both are given, because they are the stored form.
 return {...copy(voyage),...copy(catalogs),...copy(sales),...copy(markers||{}),...copy(registers||{})};
}

// A record that cannot be keyed cannot be stored as its own row. Reported rather than dropped:
// silently losing a catalogue entry is worse than refusing to write it.
function unkeyed(state){
 const parts=split(state);
 const out={};
 for(const key of REGISTER_KEYS){
  const missing=(parts.registers[key]||[]).filter(row=>!row||!row.id);
  if(missing.length)out[key]=missing;
 }
 return out;
}

// Bytes each document contributes, so the split stays measurable instead of asserted.
function sizes(state){
 const parts=split(state),measure=x=>JSON.stringify(x).length;
 return {
  catalogs:measure(parts.catalogs),
  sales:measure(parts.sales),
  voyage:measure(parts.voyage),
  total:measure(state)
 };
}

// A voyage is planned against one revision of the catalogs. Storing the revision with the
// voyage is what lets a later catalog correction be detected rather than applied silently.
function stamp(voyage,catalogRevision){return {...copy(voyage),catalogRevision};}

const api={CATALOG_KEYS,SALES_KEYS,REGISTER_KEYS,MARKER_KEYS,split,merge,sizes,stamp,unkeyed};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXSchema=api;
})(globalThis);
