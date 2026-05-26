# Test Traceability Orphan Triage

Date: 2026-04-21

Scope: triage the 26 orphaned executable `TC-*` IDs reported by
`npm run test:traceability` after the April 21 traceability-hardening work.

## Result

- Starting orphan baseline: `26`
- Updated orphan baseline after low-risk cleanup in this pass: `4`
- Final orphan baseline after reviewed doc alignment: `0`
- Updated traceability baseline:
  - tracked active enforced documented cases: `446`
  - traceable: `334`
  - missing mappings: `112`
  - orphaned executable IDs after cleanup pass: `4`
  - orphaned executable IDs after doc alignment: `0`

## Bucket 1: Acceptable Deferred Or Intentionally Out Of Scope

These should not be treated as repo drift in the current checker posture
because the governing PRD doc is explicitly deferred:

- `TC-ENTITY-BUILDER-UNIT-001`
- `TC-ENTITY-BUILDER-UNIT-002`
- `TC-ENTITY-BUILDER-UNIT-003`
- `TC-ENTITY-BUILDER-INT-001`
- `TC-ENTITY-BUILDER-INT-002`
- `TC-ENTITY-BUILDER-INT-003`
- `TC-ENTITY-BUILDER-INT-004`
- `TC-ENTITY-BUILDER-SEC-001`
- `TC-ENTITY-BUILDER-SEC-002`
- `TC-ENTITY-BUILDER-SEC-003`
- `TC-ENTITY-BUILDER-AUD-001`
- `TC-ENTITY-BUILDER-AUD-002`
- `TC-ENTITY-BUILDER-EDGE-001`

Justification:

- `docs/prd/test_cases/2026-04-19-0012-entity-builder-foundation-test-cases.md`
  explicitly declares `Traceability Enforcement: deferred`.
- Executable `ENTITY-BUILDER` IDs are acceptable during this deferred posture.
- The checker was updated to suppress orphan counting for any `TC-*` IDs
  mentioned inside deferred PRD docs, including summary-listed IDs that are not
  yet expanded into parsed case blocks.

## Bucket 2: Checker Or Test-Tooling Noise

These were traceability-tool fixture IDs or parser samples and should not count
as repo drift:

- `TC-BAD-ID`
- `TC-ROOT-AUTH-UNIT-000`
- `TC-ROOT-AUTH-UNIT-999`
- `TC-TEST-DATA-INT-005`
- `TC-TEST-DATA-UNIT-007`
- `TC-TEST-DATA-UNIT-008`

Cleanup completed in this pass:

- removed orphan-counting noise from traceability-tool tests by:
  - renaming non-governed test names so they no longer claim undocumented
    `TC-*` identities
  - building malformed/orphan fixture IDs from string parts so the repo-wide
    corpus scan does not mistake checker fixtures for governed executable
    coverage

## Bucket 3: True Repo Drift

These appeared as orphaned executable IDs after cleanup and required reviewed
doc alignment work:

- `TC-ROOT-ADMIN-SHELL-SEC-005`
  - present in `tests/integration/rootAdminShell/helperLauncher.test.ts`
  - current PRD doc only defines `SEC-001` through `SEC-004`
  - resolved by adding the reviewed PRD case to the root-admin-shell test-case
    doc

- `TC-ROOT-ADMIN-SHELL-EDGE-004`
  - present in `tests/integration/rootAdminShell/helperLauncher.test.ts`
  - current PRD doc only defines `EDGE-001` through `EDGE-003`
  - resolved by adding the reviewed PRD case to the root-admin-shell test-case
    doc

- `TC-TENANT-AUTH-UNIT-008`
  - present in `tests/unit/tenantAuth/service.test.ts`
  - current PRD doc defines `UNIT-001` through `UNIT-007` and then `UNIT-009`
  - resolved by adding the reviewed PRD case to the tenant-auth test-case doc

- `TC-WEB-APP-SURF-DISC-UNIT-007`
  - present in `tests/unit/webAppSurfaceDiscovery/service.test.ts`
  - current reviewed structure-aware extension doc defines `UNIT-001` through
    `UNIT-006`
  - resolved by adding the reviewed PRD case to the structure-aware discovery
    extension test-case doc

## Low-Risk Naming Or Alignment Cleanup Completed

These were obvious executable-name drift cases that mapped cleanly to existing
reviewed intent:

- `TC-ROOT-ROLES-INT-001A`
  - renamed to `TC-ROOT-ROLES-INT-001`

- `TC-TENANT-AUTH-AUD-PERSIST-001`
  - renamed to `TC-TENANT-AUTH-AUD-001`

- `TC-WEB-PAGE-SET-INT-009`
  - renamed to `TC-WEB-PAGE-SET-EDGE-002`

## Verification

- `npx vitest run tests/integration/traceability/report.test.ts tests/unit/traceability/testCaseLifecycle.test.ts tests/unit/traceability/traceability.test.ts`
  - passed

- `npx vitest run tests/integration/traceability/report.test.ts tests/unit/traceability/testCaseLifecycle.test.ts tests/unit/traceability/traceability.test.ts tests/integration/rootRoles/flow.test.ts tests/integration/tenantAuth/persistence.test.ts tests/integration/webAppPageSettings/persistence.test.ts`
  - passed for the runtime-enabled suites
  - Postgres-backed files were skipped in the current environment:
    - `tests/integration/tenantAuth/persistence.test.ts`
    - `tests/integration/webAppPageSettings/persistence.test.ts`

- `npm run test:traceability`
  - cleanup-pass rerun reduced orphaned executable IDs to `4`
  - doc-alignment rerun reduced orphaned executable IDs to `0`
  - the command still fails overall because documented missing mappings remain
