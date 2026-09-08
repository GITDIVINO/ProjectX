# ProjectX

A voyage-planning prototype connecting fertilizer trading and chartering: select parcels, choose a vessel, arrange port calls, distribute cargo between holds, and estimate voyage costs.

[Open the planner](https://gitdivino.github.io/ProjectX/)

## Features

- **PLANNER** — multiple parcels, loading/discharge rotation, preliminary hold allocation and voyage cost allocation. Each parcel carries a shipment passport (SF basis, source, date, BCSN) with its own version history; hold limits, cargo separation rules and technical review are recorded against their sources, and a plan version can be frozen and read back unchanged.
- **Intake and draft** — deductions and hold volumes fold into one expandable Intake Calculator whose collapsed line carries the result: calculated intake, hold count and grain capacity. `Loss due to draft` is calculated automatically from the load line: FWA, DWA, permissible draft and TPC in the water of the berth, against the registered draft limit of each loading call and the first discharge. The limiting call is named, and a zero result is stated as "no draft restriction" rather than left as a bare zero. Where the density correction cannot run, the reason is printed instead of a substituted value.
- **State drafts** — every call shows an arrival and a departure state, and the platform calculates the draft of each from that state's own deadweight: cargo from the stowage plan, bunkers chained from the intake figure through the voyage consumption, mean draft from the load line with the berth density correction. The table folds into one block whose collapsed line carries the deepest state and the tightest margin, or leads with any state over its berth limit; a state with no nominated berth counts as unchecked rather than clear. The berth limit is checked against the deepest of the three drafts, and a claim raised against a calculated figure says so. Fresh water, ballast and constant are held at the entered figure; they are not modelled along the voyage.
- **SALE** — create and edit sales, select registered ports, and add sales to PLANNER.
- **MARKET** — eight archived Market Sentiment reports (21 May–9 July 2026), with report dates, regional filtering, basin commentary and publication-time outlooks. Offline, read-only, explicitly not a live feed; no automatic updates or independent verification. Browsing does not change voyage inputs. Report and region selection persist for the browser session.
- **CARGO** — 25 bulk cargoes with a reference SF in the default working register; add bulk cargoes with a positive SF. Full reference records are retained internally.
- **PORT** — port names, terminals, restrictions and reference DA. Used ports cannot be removed or renamed until their sales are reassigned.
- **VESSEL** — TBN 1 · 33K plus editable reference profiles TBN 2 · 38K and TBN 3 · 57K. New reference profiles are incomplete: missing hold/performance parameters must be confirmed and entered before applying to a voyage. Unknown values are not assumed to be zero.
- Browser-local autosave on every accepted change (including calculation input before leaving the field), a previous valid backup, explicit Save, and Save PDF through the browser print dialog. No application backend, shared database, login or analytics.

Open `index.html` directly, or use the hosted link. Each visitor starts with their own calculation. Accepted edits are saved automatically in browser storage on the current device; the Save button remains available as an explicit action. Reloading the same URL in the same browser restores the calculation. This does not upload it to the repository or share it with other visitors. Existing local-file calculations are not automatically transferred to the hosted site because local and hosted pages use different storage origins. JSON import is not implemented.

The default PORT register contains 13 entries. A one-time migration adds the requested ports and reference vessels to older saves without overwriting user edits or the current voyage snapshot. Click Save in PLANNER to retain your own edits after reloading; there is no autosave or shared database.

## Development

Node.js 22 or later. The application has no runtime dependencies. Browser acceptance uses Playwright as a development dependency.

```sh
npm test
npm run build
npm install
npx playwright install chromium
npm run test:browser
```

Edit the source in `platform/`, run the tests and build, and commit both the source and the regenerated root `index.html`. GitHub Pages publishes the `main` branch from the repository root. No custom workflow or deployment token is needed.

For the independent financial reference check, Python 3 is also required:

```sh
node platform/audit-fixtures.cjs /tmp/projectx-fixtures.json
python3 tools/check_math_reference.py /tmp/projectx-fixtures.json
```

The current release passes 160 automated tests; the financial engine is checked against 240 independent rational-arithmetic fixtures generated outside the calculation code. Browser acceptance checks the built HTML, six tabs, all eight MARKET reports, region filters, session restoration, mobile layout, English labels and messages, cargo creation, sale validation, rejection of unregistered ports, planner autosave before blur, reload persistence, print action and confirmations. User-entered text is preserved as entered. Validation against a complete real voyage remains outstanding.

The bundled MARKET archive lives in `platform/market.js`. Only the selected published report content was imported; no source inbox files are included. New reports require an explicit content update and rebuild. The application contacts no server for it.

## Calculation scope

This is a preliminary vessel cost model, not a certified loading computer or a contractual exporter budget. It does not calculate approved stability, longitudinal strength, port clearance or cargo compatibility.

Draft figures are a linear TPC estimate from the load line, not hydrostatic tables. The platform holds no MCTC, LCF or LCB, so trim is not derived from the cargo distribution: aft and forward drafts split an entered trim about amidships, and a state whose draft is far from the reference draft is marked as an extrapolation. A surveyed or entered state draft always governs the berth check ahead of the calculated one. Under-keel clearance, squat and tide are not calculated. `Max draft` in PORT is used throughout as a single berth depth/draft limit; the differing source terms are kept in the port register. Reference SF values are estimates and need shipment confirmation. Some cargo properties remain unresolved; missing values are not proof of a non-hazardous classification.

The internal catalogue contains 25 numerical reference planning SF values and 26 IMSBC groups across 97 entries. The working CARGO view includes only bulk cargoes with a positive SF. Sources and applicability remain in the catalogue data; technical details are not shown in the simplified table. Exact-product SDS and shipper declarations are still needed for unresolved grades. Liquid, gaseous and packaged products remain outside the bulk-hold planning model.

No confidential voyage files, original vessel questionnaires, private working notes or saved user calculations are included in this public repository.
