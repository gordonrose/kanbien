# Web App Surface Discovery Structure-Aware Extension Test Cases

## PRD Scope

- PRD:
  [docs/prd/2026-04-19-0014-web-app-surface-discovery-structure-aware-extension.md](/home/gordon/kanbien/docs/prd/2026-04-19-0014-web-app-surface-discovery-structure-aware-extension.md)
- Primary features involved:
  - `webAppSurfaceDiscovery`
- Cross-feature seams:
  - shared root-user authenticated session middleware protects all protected API
    routes in this slice
  - shared root authorization gates enforce discovery capabilities
  - approved frontend-family provider seams must now emit structure-aware
    discovery output
  - `webAppHierarchyBuilder` should later consume public discovered-tree reads
    rather than reconstructing hierarchy from flat path strings
- Notes:
  - this file covers PRD-derived verification intent, not executable test
    implementation
  - this extension is additive on top of the already-implemented discovery
    foundation
  - existing executable discovery tests will likely need additive updates, not
    wholesale replacement, because run summaries and provider harnesses will
    grow structure-aware behavior
  - Traceability Enforcement:
    planned and not yet implemented for this extension
  - Lifecycle metadata defaults currently apply:
    - `Version: v2`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - planned extension coverage on top of the existing discovery suite
- Overall execution status:
  - not yet implemented
- Layer summary:
  - `UNIT`: planned
  - `INT`: planned
  - `SEC`: planned
  - `AUD`: planned
  - `EDGE`: planned
  - `COMPAT`: planned
  - `CONCURRENCY/IDEMPOTENCY`: light planned
- Existing executable test impact:
  - `tests/unit/webAppSurfaceDiscovery/service.test.ts`
    will likely need additive cases or expectation updates because discovery
    runs will now persist structure truth as well as surface truth
  - `tests/integration/webAppSurfaceDiscovery/flow.test.ts`
    will likely need additive route-level coverage for structure-tree reads
  - `tests/security/webAppSurfaceDiscovery/security.test.ts`
    will likely need additive coverage for any new structure-read capability
  - `tests/audit/webAppSurfaceDiscovery/audit.test.ts`
    will likely need additive visibility checks for structure-aware runs
  - `tests/integration/webAppHierarchyBuilder/flow.test.ts`
    should not need behavior-changing edits yet unless a structure-aware
    hierarchy consumer is introduced in the same implementation loop

## QA Coverage Classification

- Change class:
  - privileged backend capability extension
  - persistence schema and durable workflow change
  - tree-structured discovery seam
  - compatibility-sensitive downstream read contract for later hierarchy
    reconcile work
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
  - self-referencing parent integrity review
  - structure stale-marking honesty review
  - provider-graph compatibility review
- Not required in this slice:
  - frontend
  - accessibility
  - end-to-end journey
  - dedicated performance suite
  - dedicated resilience/failure-injection suite

## Unit Tests For Individual Capabilities

- Capability: structure-aware discovery run normalization
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - normalizes discovered structure-node candidates alongside surface
    candidates
  - preserves explicit node kinds for root, group, and leaf nodes
  - links leaf structure nodes to discovered surfaces without collapsing the
    two models into one row shape
  - rejects invented or malformed client-supplied system-managed fields

- Capability: structure graph validation
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - root nodes require null parent and depth `0`
  - non-root nodes require valid parent ids and depth greater than `0`
  - duplicate sibling structure keys are rejected
  - leaf node kinds enforce legal linked-surface posture
  - group nodes do not require linked discovered surfaces

- Capability: merge discovered structure refresh
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - refreshes `lastDiscoveredRunId`, `lastDiscoveredAt`, and `updatedAt` for
    already-known structure nodes
  - clears `staleAt` when a previously stale structure node reappears
  - preserves stable structure lineage identity for cosmetic metadata changes
  - does not create duplicate current nodes for the same structure identity

- Capability: mark potentially stale discovered structure nodes
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - marks a structure node stale only after a newer successful run for the same
    scope fails to observe it
  - does not mark nodes stale after a failed run
  - preserves durable structure truth instead of deleting missing nodes

- Capability: list discovered web-app structure tree
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - returns parent-child discovered structure accurately
  - preserves explicit node kinds and linked discovered surface ids
  - filters by root family and stale posture without flattening the tree into
    path strings only
  - preserves deterministic child ordering

- Capability: get exact discovered structure node
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - returns stable node identity and linked leaf metadata
  - rejects missing node ids with a feature-owned not-found error

- Capability: preserve linked module-route truth when the route is also a
  parent structure node
  Test Case ID: `TC-WEB-APP-SURF-DISC-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - keeps a module route linked to its discovered surface when that same route
    also owns child routes
  - preserves the parent-child structure graph without dropping the module
    route's linked surface truth
  - avoids collapsing a selectable module route into a group-only node

## Integration Tests For Features Working Together

- Flow: root-authenticated operator triggers a structure-aware discovery run
  and reads the resulting discovered tree
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: discovery runs, discovered surfaces, structure nodes,
  and observations should be attributable to one test run when persisted
  Features:
  - `rootAuth`
  - root authorization
  - `webAppSurfaceDiscovery`
  Coverage:
  - authenticated root operator with capability can run structure-aware
    discovery
  - the resulting structure tree is readable through tree and exact-node reads
  - linked discovered surface ids and node kinds are exposed honestly

- Flow: repeated successful runs update current structure truth and stale
  posture deterministically
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Features:
  - `webAppSurfaceDiscovery` persistence
  - provider seams
  Coverage:
  - a second successful run refreshes `lastDiscoveredAt` for structure nodes
  - a structure node absent from the later successful run becomes stale
  - a reappearing structure node clears `staleAt`
  - run-history reads plus structure reads explain why stale posture is
    trustworthy

- Flow: structure-aware discovery preserves mixed group and leaf truth for
  multi-segment route families
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppSurfaceDiscovery`
  - structure-aware provider output
  Coverage:
  - `/design-system/components/top-nav` yields:
    - a root structure node
    - a group structure node
    - a leaf structure node linked to the discovered surface
  - the discovered surface row remains canonical leaf truth
  - grouping nodes are not flattened into fake page-surface rows

- Flow: hash-backed shell states become leaf structure nodes without fake path
  conversion
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppSurfaceDiscovery`
  - provider seam for `root-admin`
  Coverage:
  - `/root-admin#users` yields a root node plus a
    `shell-state-surface` leaf node
  - the linked discovered surface preserves hash-state locator truth

- Flow: structure reads provide the contract later hierarchy consumers need
  without private persistence access
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppSurfaceDiscovery`
  - later `webAppHierarchyBuilder` structure-aware consumer seam
  Coverage:
  - structure-tree reads expose stable ids, parent ids, node kinds, stale
    metadata, and linked discovered surface ids needed for future reconcile
  - no consumer must import provider internals or private discovery persistence
    to reconstruct the discovered tree

## NFR Security Tests

- Security: structure-aware discovery routes require authenticated root session
  Test Case ID: `TC-WEB-APP-SURF-DISC-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppSurfaceDiscovery/`
  Coverage:
  - unauthenticated callers cannot trigger structure-aware discovery or read
    discovered structure truth

- Security: explicit structure-read capability gates are enforced
  Test Case ID: `TC-WEB-APP-SURF-DISC-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppSurfaceDiscovery/`
  Coverage:
  - authenticated root users without the required structure-read capability are
    denied
  - run and structure-read capabilities map to the correct route surfaces

- Security: discovery cannot be abused as a raw structure import API
  Test Case ID: `TC-WEB-APP-SURF-DISC-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppSurfaceDiscovery/`
  Coverage:
  - clients cannot submit invented structure trees or discovered surfaces
    directly
  - sync accepts only approved scope controls

- Security: system-managed identity and stale markers remain server-owned for
  structure rows
  Test Case ID: `TC-WEB-APP-SURF-DISC-SEC-004`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppSurfaceDiscovery/`
  Coverage:
  - structure-node ids, parent ids, first-seen fields, last-seen fields, and
    stale markers cannot be overridden by client input

## NFR Logging And Audit Tests

- Audit: denied structure-tree reads are visible through platform security
  events
  Test Case ID: `TC-WEB-APP-SURF-DISC-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppSurfaceDiscovery/`
  Coverage:
  - denied structure-tree reads remain visible through shared authz audit
    posture

- Audit: successful structure-aware discovery runs remain operator-visible
  through deterministic responses
  Test Case ID: `TC-WEB-APP-SURF-DISC-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppSurfaceDiscovery/`
  Coverage:
  - successful run responses expose structure-aware summary fields needed for
    operator review

## Edge Cases And Negative Tests

- Edge: malformed provider graph output is rejected
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-001`
  Recommended Test Layer: `service-unit` or `feature-integration`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/` or
  `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - duplicate structure identity keys in one run are rejected
  - nonexistent parent references are rejected
  - impossible root/posture combinations are rejected

- Edge: empty approved family remains valid
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - current `login` provider may still yield zero discovered structure nodes or
    only a root node, depending on final implementation posture, without
    failing the run dishonestly

- Edge: mixed support-only and user-facing leaves under one group remain
  distinct
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - one group may contain both importable and non-importable discovered leaves
    without collapsing their node kinds or dispositions

- Edge: stale structure nodes remain queryable and linked to run history
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - stale structure nodes remain visible to explicit reads
  - the operator can still determine when they were last seen and by which run

## Persistence-Backed Verification

- Persistence: structure node identity and parent references are enforced by
  storage
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-006`
  Recommended Test Layer: `persistence-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Coverage:
  - unique structure identity keys hold
  - self-referencing parent foreign keys hold
  - linked discovered surface foreign keys hold when present

- Persistence: structure stale marking is additive and non-destructive
  Test Case ID: `TC-WEB-APP-SURF-DISC-INT-007`
  Recommended Test Layer: `persistence-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Coverage:
  - stale structure rows remain durable
  - later successful reappearance clears stale posture correctly

## Compatibility / Contract Tests

- Compatibility: existing discovered-surface reads remain stable after the
  structure-aware extension lands
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - the extension does not break existing discovered-surface read contracts
  - linked structure truth remains additive rather than a breaking replacement

- Compatibility: later hierarchy consumers can build a discovered tree without
  parsing raw paths
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-006`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Coverage:
  - a consumer can traverse the discovered tree using stable ids and parent
    links alone
  - raw path parsing is no longer required to recover discovered grouping
    posture

## Concurrency / Idempotency

- Concurrency/Idempotency: repeated unchanged structure-aware runs do not create
  duplicate current structure nodes
  Test Case ID: `TC-WEB-APP-SURF-DISC-EDGE-007`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - repeated unchanged runs behave idempotently for current structure truth
  - new observations may append while current structure-node identity remains
    unique

## Non-Goals For This Test-Case File

The following are intentionally deferred to later loops:

- structure-aware reconcile preview in `webAppHierarchyBuilder`
- structure-aware reconcile apply or sync behavior in
  `webAppHierarchyBuilder`
- frontend operator review UI
- event-driven refresh

## Proposed Initial Execution Command Shape

- `npx vitest run tests/unit/webAppSurfaceDiscovery/*.test.ts tests/integration/webAppSurfaceDiscovery/*.test.ts tests/security/webAppSurfaceDiscovery/*.test.ts tests/audit/webAppSurfaceDiscovery/*.test.ts`
- `RUN_POSTGRES_TESTS=true NODE_ENV=test npx vitest run --fileParallelism false tests/integration/webAppSurfaceDiscovery/persistence.test.ts`

## Traceability Notes

- Use the documented `TC-WEB-APP-SURF-DISC-*` IDs directly in executable test
  names
- Preserve the existing discovery foundation IDs and add new cases rather than
  renumbering prior implemented coverage
- If implementation changes the structure-read route family materially, refresh
  this document before treating the loop as complete
