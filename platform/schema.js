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

// Shared across the organisation. Slowly changing, edited in CARGO / PORT / VESSEL.
const CATALOG_KEYS=[
 'cargoTypes',            // reference cargo register with planning SF and IMSBC group
 'portRecords',           // port and berth register with published size limits
 'vesselProfiles',        // editable vessel particulars
 'importedCargoSeeds',    // one-off import markers, kept with the catalog they seeded
 'catalogAdditions',
 'portProfileRevision',
 'portBerthRevision',
 'tbnSourceRevision'
];

// Concluded deals. Organisation-wide, but their own register: a sale outlives any one voyage.
const SALES_KEYS=['sales'];

// Everything else is the voyage document, including vesselSnapshot: the particulars pinned
// into this calculation stay with the calculation and are not re-read from the catalog.
const copy=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));

function split(state){
 const catalogs={},sales={},voyage={};
 for(const key of Object.keys(state)){
  const target=CATALOG_KEYS.includes(key)?catalogs:SALES_KEYS.includes(key)?sales:voyage;
  target[key]=copy(state[key]);
 }
 return {catalogs,sales,voyage};
}

function merge(parts){
 const {catalogs={},sales={},voyage={}}=parts||{};
 return {...copy(voyage),...copy(catalogs),...copy(sales)};
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

const api={CATALOG_KEYS,SALES_KEYS,split,merge,sizes,stamp};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXSchema=api;
})(globalThis);
