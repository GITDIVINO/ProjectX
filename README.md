# ProjectX

A voyage-planning prototype connecting fertilizer trading and chartering: select parcels, choose a vessel, arrange port calls, distribute cargo between holds, and estimate voyage costs.

[Open the planner](https://gitdivino.github.io/ProjectX/)

## Features

- **PLANNER** — multiple parcels, loading/discharge rotation, preliminary hold allocation and voyage cost allocation.
- **SALE** — create and edit sales, select registered ports, and add sales to PLANNER.
- **CARGO** — 25 bulk cargoes with a reference SF in the default working register; add bulk cargoes with a positive SF. Full reference records are retained internally.
- **PORT** — port names, terminals, restrictions and reference DA. Used ports cannot be removed or renamed until their sales are reassigned.
- **VESSEL** — TBN 1 · 33K plus editable reference profiles TBN 2 · 38K and TBN 3 · 57K. New reference profiles are incomplete: missing hold/performance parameters must be confirmed and entered before applying to a voyage. Unknown values are not assumed to be zero.
- Browser-local save, a previous valid backup, and Save PDF through the browser print dialog. No application backend, shared database, login or analytics.

Open `index.html` directly, or use the hosted link. Each visitor starts with their own calculation. Saving uses browser storage on the current device; it does not upload the calculation to this repository or share it with other visitors. Existing local-file calculations are not automatically transferred to the hosted site. JSON import is not implemented.

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

The current release passes 84 automated tests; the unchanged financial engine was previously checked against 120 independent rational-arithmetic fixtures. Browser acceptance checks the built HTML, five tabs, English labels and messages, cargo creation, sale validation, rejection of unregistered ports, planner persistence, print action and confirmations. User-entered text is preserved as entered. Validation against a complete real voyage remains outstanding.

## Calculation scope

This is a preliminary vessel cost model, not a certified loading computer or a contractual exporter budget. It does not calculate approved stability, longitudinal strength, port clearance or cargo compatibility. Reference SF values are estimates and need shipment confirmation. Some cargo properties remain unresolved; missing values are not proof of a non-hazardous classification.

The internal catalogue contains 25 numerical reference planning SF values and 26 IMSBC groups across 97 entries. The working CARGO view includes only bulk cargoes with a positive SF. Sources and applicability remain in the catalogue data; technical details are not shown in the simplified table. Exact-product SDS and shipper declarations are still needed for unresolved grades. Liquid, gaseous and packaged products remain outside the bulk-hold planning model.

No confidential voyage files, original vessel questionnaires, private working notes or saved user calculations are included in this public repository.
