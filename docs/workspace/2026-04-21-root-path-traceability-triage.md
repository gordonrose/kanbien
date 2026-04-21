# Root Path Traceability Triage

Date: 2026-04-21

Scope: triage the missing `TC-ROOT-PATH-*` mappings after orphan cleanup.

## Starting Point

- `ROOT-PATH` documented cases: `20`
- Traceable before this pass: `2`
- Missing before this pass: `18`
- Already traceable before this pass:
  - `TC-ROOT-PATH-FRONTEND-001`
  - `TC-ROOT-PATH-FRONTEND-002`

## Triage Summary

## Already Implemented Or Linkable In Current Executable Coverage

- `TC-ROOT-PATH-UNIT-004`
  - honest linkage to existing discovery unit coverage that already asserts
    canonical path-backed root-admin locators in discovered truth

- `TC-ROOT-PATH-INT-001`
  - covered by direct browser entry checks for:
    - `/root-admin`
    - `/root-admin/users`
    - `/root-admin/roles`
    - `/root-admin/tenants`
    - `/root-admin/tenant-admins`
    - `/root-admin/web-app-hierarchy`

- `TC-ROOT-PATH-INT-002`
  - covered by legacy hash alias entry proving `/root-admin#root-users`
    resolves into the `Users` suite and normalizes into canonical path-backed
    navigation

- `TC-ROOT-PATH-INT-004`
  - covered by explicit assertions that the shell nav emits canonical
    path-backed hrefs instead of hash aliases

- `TC-ROOT-PATH-EDGE-001`
- `TC-ROOT-PATH-EDGE-002`
  - covered by trailing-slash normalization for migrated suite routes

- `TC-ROOT-PATH-EDGE-003`
  - covered by alias entry handing off into canonical path-backed navigation
    after initial landing

## Still Missing Or Needing A More Deliberate Follow-Up

- `TC-ROOT-PATH-UNIT-001`
- `TC-ROOT-PATH-UNIT-002`
- `TC-ROOT-PATH-UNIT-003`
- `TC-ROOT-PATH-UNIT-005`
- `TC-ROOT-PATH-INT-003`
- `TC-ROOT-PATH-EDGE-001`
- `TC-ROOT-PATH-SEC-001`
- `TC-ROOT-PATH-SEC-002`
- `TC-ROOT-PATH-AUD-001`
- `TC-ROOT-PATH-AUD-002`
- `TC-ROOT-PATH-COMPAT-001`
- `TC-ROOT-PATH-COMPAT-002`

## Notes

- The remaining `UNIT` cases point at route-resolution and canonical-href
  helper behavior in `src/frontend/rootAdminShell/assets/app.mjs`, but that
  logic is not yet covered by focused service-unit tests.
- `TC-ROOT-PATH-INT-003` needs an honest cross-seam proof that discovery truth
  and curated topology truth are both path-backed for migrated root-admin
  suites. Current hierarchy integration coverage still includes older hash-state
  posture in places, so this should be handled carefully rather than linked
  optimistically.
- The `SEC`, `AUD`, and `COMPAT` items look like real remaining work, not mere
  linkage drift.
