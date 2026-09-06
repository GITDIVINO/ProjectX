# ProjectX

A voyage-planning prototype connecting fertilizer trading and chartering: select parcels, choose a vessel, arrange port calls, distribute cargo between holds, and estimate voyage costs.

[Open the planner](https://gitdivino.github.io/ProjectX/)

## Features

- **PLANNER** — multiple parcels, loading/discharge rotation, preliminary hold allocation and voyage cost allocation.
- **CARGO** — 95 fertilizer/feedstock entries plus two sulphur types, English names, search, manufacturer links and transport-property references.
- **VESSEL** — a standard TBN 1 profile and editable vessel types.
- Browser-local save and JSON export. No application backend, shared database, login or analytics.

Open `index.html` directly, or use the hosted link. Each visitor starts with their own calculation. Saving uses browser storage on the current device; it does not upload the calculation to this repository or share it with other visitors. Existing local-file calculations are not automatically transferred to the hosted site. JSON import is not implemented.

## Development

Node.js 22 or later; no third-party npm dependencies.

```sh
npm test
npm run build
```

Edit the source in `platform/`, run the tests and build, and commit both the source and the regenerated root `index.html`. GitHub Pages publishes the `main` branch from the repository root. No custom workflow or deployment token is needed.

For the independent financial reference check, Python 3 is also required:

```sh
node platform/audit-fixtures.cjs /tmp/projectx-fixtures.json
python3 tools/check_math_reference.py /tmp/projectx-fixtures.json
```

The current release passes 71 automated tests and 120 independent rational-arithmetic fixtures. Browser acceptance and validation against a complete real voyage remain outstanding.

## Calculation scope

This is a preliminary vessel cost model, not a certified loading computer or a contractual exporter budget. It does not calculate approved stability, longitudinal strength, port clearance or cargo compatibility. Reference SF values are estimates and need shipment confirmation. Some cargo properties remain unresolved; missing values are not proof of a non-hazardous classification.

The application contains 25 numerical reference planning SF values and 26 IMSBC groups across 97 catalogue entries. Exact-product SDS and shipper declarations are still needed for unresolved grades. Cargo entries link to their sources and state applicability; IMSBC references use amendment 07-23. Liquid, gaseous and packaged products remain outside the bulk-hold planning model.

No confidential voyage files, original vessel questionnaires, private working notes or saved user calculations are included in this public repository.
