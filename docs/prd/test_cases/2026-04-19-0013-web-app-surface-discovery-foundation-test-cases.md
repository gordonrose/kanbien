# Web App Surface Discovery Foundation Test Cases

## PRD Scope

- PRD:
  [docs/prd/2026-04-19-0013-web-app-surface-discovery-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0013-web-app-surface-discovery-foundation.md)
- Primary features involved:
  - `webAppSurfaceDiscovery`
- Cross-feature seams:
  - shared root-user authenticated session middleware protects all protected API
    routes in this slice
  - shared root authorization gates enforce discovery capabilities
  - approved frontend-family provider seams supply discovery inputs for
    `root-admin`, `login`, and `design-system`
  - downstream reconcile work in `webAppHierarchyBuilder` is expected to
    consume exported discovery reads rather than re-reading frontend
    implementation directly
- Notes:
  - this file covers PRD-derived verification intent, not executable test
    implementation
  - there are no current executable tests for this planned feature yet, so this
    plan is additive rather than expectation-changing
  - Traceability Enforcement:
    planned and not yet implemented
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - planned only; no executable discovery-specific suite exists yet
- Overall execution status:
  - not yet implemented
- Layer summary:
  - `UNIT`: planned
  - `INT`: planned
  - `SEC`: planned
  - `AUD`: planned
  - `EDGE`: planned
  - `COMPAT`: planned
  - `CONCURRENCY/IDEMPOTENCY`: planned/light
- Existing executable test impact:
  - no current `webAppSurfaceDiscovery` executable suite exists
  - later reconcile work will likely add tests under
    `tests/integration/webAppHierarchyBuilder/` and
    `tests/security/webAppHierarchyBuilder/`, but this foundation slice does
    not require changing existing hierarchy tests yet

## QA Coverage Classification

- Change class:
  - privileged backend capability
  - persistence schema and durable workflow change
  - migration/bootstrap-adjacent discovery seam
  - compatibility-sensitive consumer contract for later reconcile/import work
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - persistence-backed verification
  - compatibility/contract
  - edge
- Additional required checks:
  - migration safety review
  - stale-marking honesty review
  - provider-seam compatibility review
- Not required in this slice:
  - frontend
  - accessibility
  - end-to-end journey
  - performance as a blocking dedicated suite
  - resilience/failure-injection as a blocking dedicated suite
  - structured exploratory QA by default, though a short focused QA note is
    still recommended because stale posture can mislead operators if wrong

## Unit Tests For Individual Capabilities

- Capability: `runWebAppSurfaceDiscovery`
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in
  persistence-backed execution
  Cleanup Expectation: created discovery runs and discovered surfaces should be
  attributable to one test run when persisted
  Coverage:
  - invokes approved providers for the explicit scope only
  - upserts discovered-surface lineages from provider outputs
  - creates one discovery-run summary with deterministic counts
  - persists support-only surfaces as discovered but non-importable truth
  - preserves hash-backed shell-state locator posture without flattening to
    fake path routes
  - keeps an approved root family such as `login` valid even when the provider
    returns zero user-facing surfaces
  - rejects client-supplied system-managed fields

- Capability: `normalizeProviderSurface`
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - normalizes canonical locator shape for path routes
  - normalizes canonical locator shape for hash-backed states
  - strips the leading `#` from stored `routeHash` while preserving the full
    `canonicalLocator`
  - derives stable `discoveryKey` server-side from family and locator facts
  - rejects inconsistent locator combinations such as path rows with hash-only
    posture or hash rows without a hash value

- Capability: `mergeDiscoveredSurfaceRefresh`
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - refreshes `lastDiscoveredRunId`, `lastDiscoveredAt`, and `updatedAt` for
    an already-known surface
  - clears `staleAt` when a previously stale surface reappears
  - preserves stable lineage identity for cosmetic metadata changes such as
    display-label updates
  - creates a new lineage rather than mutating the old one when the locator
    shape changes materially enough that reconcile targets should differ

- Capability: `markPotentiallyStaleDiscoveredSurfaces`
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - marks a surface stale only after a newer successful run for the same scope
    fails to observe it
  - does not mark surfaces stale after a failed run
  - does not mark surfaces stale after a partial run unless the approved
    policy explicitly allows that narrower provider conclusion
  - preserves durable discovered truth instead of deleting missing surfaces

- Capability: `listDiscoveredWebAppSurfaces`
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - returns explicit locator and classification fields
  - filters by `rootFamilyId`, `surfaceKind`, `userFacingDisposition`,
    `providerKey`, and stale posture
  - preserves deterministic ordering and pagination defaults
  - does not flatten discovered truth into curated hierarchy semantics

- Capability: `listWebAppDiscoveryRuns`
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - returns run status, trigger kind, scope, provider version, timestamps, and
    failure summary
  - preserves deterministic ordering
  - supports explicit status and trigger filters

## Integration Tests For Features Working Together

- Flow: root-authenticated operator triggers a discovery run and reads the
  resulting current discovered truth
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: discovery runs, discovered surfaces, and observations
  should be tied to one `testRunId`
  Features:
  - `rootAuth`
  - root authorization
  - `webAppSurfaceDiscovery`
  Coverage:
  - authenticated root operator with capability can run discovery
  - the resulting discovered surfaces are readable through list and exact reads
  - read responses preserve path-backed, hash-backed, and support-only
    classification honestly

- Flow: repeated successful runs update current truth and stale posture
  deterministically
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-002`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: repeated-run fixtures should be tied to one `testRunId`
  Features:
  - `webAppSurfaceDiscovery` persistence
  - provider seams
  Coverage:
  - a second successful run refreshes `lastDiscoveredAt`
  - a surface absent from the later successful run becomes stale
  - a reappearing surface clears `staleAt`
  - run-history reads explain why a stale posture is trustworthy

- Flow: failed or partial runs do not create misleading stale posture
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: failed-run fixtures should remain tied to one
  `testRunId`
  Features:
  - `webAppSurfaceDiscovery`
  - provider failure handling
  Coverage:
  - failed run records failure summary without deleting discovered truth
  - failed run does not mark unrelated surfaces stale
  - partial run remains visible in run history and does not silently masquerade
    as a clean full-scope success

- Flow: discovery reads provide the contract later reconcile consumers need
  without private persistence access
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Features:
  - `webAppSurfaceDiscovery`
  - later `webAppHierarchyBuilder` reconcile seam contract
  Coverage:
  - read responses expose stable ids, locator posture, family scope,
    classification, and stale metadata needed for reconcile preview
  - no consumer must import provider internals or discovery persistence files
    to reconstruct current discovered truth

## NFR Security Tests

- Security: discovery routes require authenticated root session
  Test Case ID: `TC-WEB-APP-SURF-DISC-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppSurfaceDiscovery/`
  Coverage:
  - unauthenticated callers cannot trigger discovery or read discovery truth

- Security: explicit discovery capability gates are enforced
  Test Case ID: `TC-WEB-APP-SURF-DISC-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppSurfaceDiscovery/`
  Coverage:
  - authenticated root users without the required capability are denied
  - run and read capabilities map to the correct route surfaces

- Security: discovery cannot be abused as a raw import or replacement API
  Test Case ID: `TC-WEB-APP-SURF-DISC-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppSurfaceDiscovery/`
  Coverage:
  - clients cannot submit invented discovered-surface payloads directly
  - sync accepts only approved scope and provider controls

- Security: system-managed identity and stale markers remain server-owned
  Test Case ID: `TC-WEB-APP-SURF-DISC-SEC-004`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/security/webAppSurfaceDiscovery/`
  Coverage:
  - client cannot set run ids, discovered surface ids, `discoveryKey`,
    `lastDiscoveredAt`, or `staleAt`

## NFR Logging Or Audit Tests

- Audit: successful discovery runs are audit-visible
  Test Case ID: `TC-WEB-APP-SURF-DISC-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppSurfaceDiscovery/`
  Coverage:
  - successful discovery run records or equivalent durable evidence include
    actor, scope, trigger posture, and created or refreshed counts

- Audit: denied discovery access is audit-visible through the existing platform
  posture
  Test Case ID: `TC-WEB-APP-SURF-DISC-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppSurfaceDiscovery/`
  Coverage:
  - denied run and read attempts create the expected audit-visible evidence

## Compatibility / Contract Tests

- Compatibility: provider seams preserve contract honesty across locator kinds
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-001`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `compatibility-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - design-system provider returns path-backed routes only for real file-backed
    surfaces
  - root-admin provider returns hash-backed states from approved runtime
    metadata rather than fake path routes
  - login provider can return an explicit empty result without making the run
    invalid

- Compatibility: read contract remains stable for later reconcile consumers
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-002`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `compatibility-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - exact and list reads preserve required fields for later reconcile preview
  - stale posture remains explicit instead of inferred by missing rows

## Edge Cases And Negative Tests

- Edge: duplicate discovered surfaces in one provider output are handled
  deterministically
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-003`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Coverage:
  - duplicate canonical locator entries from the same provider are rejected or
    de-duplicated according to the approved rule

- Edge: provider returns unsupported or malformed locator shape
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-004`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Coverage:
  - malformed provider output is rejected with a feature-owned validation error
  - the run result remains honest about failure or partial posture

- Edge: support-only routes remain visible but non-importable
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - support-only routes appear in discovery reads
  - support-only routes are clearly classified and never misreported as
    user-facing page candidates

- Edge: empty discovery for an approved family remains honest
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-006`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - a run can succeed with zero current user-facing discovered surfaces for an
    approved family such as `login`
  - the absence is represented as honest current truth rather than as a
    provider failure

## Persistence-Backed Verification

- Persistence: discovered-surface uniqueness and run foreign keys are enforced
  in Postgres
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-005`
  Recommended Test Layer: `persistence-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Coverage:
  - unique `discoveryKey` and `canonicalLocator` rules are enforced
  - surface and observation rows require valid run foreign keys
  - root-family scoping is preserved

- Persistence: stale-marking writes do not hard-delete discovery truth
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-006`
  Recommended Test Layer: `persistence-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Coverage:
  - later successful absence sets `staleAt`
  - the discovered surface row remains queryable
  - observation history remains intact

## Suggested Verification Commands

- `npx vitest run tests/unit/webAppSurfaceDiscovery/*.test.ts tests/integration/webAppSurfaceDiscovery/*.test.ts tests/security/webAppSurfaceDiscovery/*.test.ts tests/audit/webAppSurfaceDiscovery/*.test.ts`
- `RUN_POSTGRES_TESTS=true NODE_ENV=test npx vitest run --fileParallelism false tests/integration/webAppSurfaceDiscovery/persistence.test.ts`
- `npx tsc --noEmit`

## Required Follow-On QA Artifacts

- recommended focused QA note under `docs/workspace/qa/` covering:
  - locator-shape honesty
  - support-only route persistence
  - stale-marking honesty across success vs failed runs
- recommended curated test summary under `docs/workspace/test-run-summaries/`
  once implementation lands

## Coverage Gaps Still Expected After This Doc

- no end-to-end journey inventory is required yet because this is a backend
  foundation slice with no user-facing discovery UI
- event or topic-driven refresh is intentionally deferred and will require a
  future test-case refresh when that trigger model is approved
- reconcile preview and apply test cases are intentionally deferred to the
  later `webAppHierarchyBuilder` reconcile loop
