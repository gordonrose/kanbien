# Design System Canonicals Foundation Test Cases

## PRD Scope

- PRD:
  [docs/prd/2026-04-21-0018-design-system-canonicals-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-21-0018-design-system-canonicals-foundation.md)
- Primary features involved:
  - `designSystemCanonicals`
  - `webAppHierarchyBuilder`
  - `webAppPageSettings`
  - `design-system` public frontend family
- Cross-feature seams:
  - shared root-user authenticated session middleware protects all protected
    governance, page-tree sync, and page-settings routes in this slice
  - shared root authorization gates enforce canonical-governance and
    page-tree-sync mutations
  - `designSystemCanonicals` owns family truth, ref truth, bounded payload
    truth, and public generated projections
  - `webAppHierarchyBuilder` remains authoritative for durable page-tree truth
  - `webAppPageSettings` remains authoritative for page-template intent
  - legacy `/design-system/canonicals/*` routes remain available during parity
    review and should act as the comparison seam rather than disappearing
    during the first slice
- Notes:
  - this file covers PRD-derived verification intent, not executable test
    implementation
  - this slice is both a privileged backend foundation and a new public route
    family
  - parity between legacy canonical surfaces and the new generated public route
    family is part of the verification story, not an optional convenience
  - Traceability Enforcement:
    active from the start for this slice because public signoff surfaces and
    privileged route governance are both in scope
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - implemented with residual promotion traceability
- Overall execution status:
  - backend foundation, public generated route family, hierarchy sync, and
    selected family visual proof implemented
- Layer summary:
  - `UNIT`: implemented for web-app hierarchy sync and page-template support;
    direct `designSystemCanonicals` service-unit coverage remains folded into
    integration and public-route tests rather than one-to-one TC ids
  - `INT`: implemented for public generated route resolution, launcher link
    audits, and hierarchy sync
  - `SEC`: partially implemented through protected capability middleware and
    existing web-app hierarchy/page-settings security suites; dedicated
    `designSystemCanonicals` security files remain a follow-up
  - `AUD`: partially implemented through shared authz audit posture; dedicated
    successful-governance audit events are not a current feature-local seam
  - `EDGE`: implemented for generated fallback avoidance, launcher visibility,
    route registration, idempotent hierarchy sync, theme scope, responsive
    width, and overlay containment
  - `FRONTEND`: implemented through generated route integration tests and
    family-specific visual specs under `tests/visual/designSystem/canonicals/`
  - `COMPAT`: implemented for additive generated routes alongside legacy
    canonical launcher routes
  - `CONCURRENCY/IDEMPOTENCY`: implemented for repeated hierarchy sync;
    repeated protected governance writes are bounded by uniqueness checks
- Existing executable test impact:
  - `tests/integration/frontend/designSystemCanonicalRouting.test.ts`
    verifies generated family publication, render registry alignment,
    fallback avoidance, family launcher routing, and unregistered-family 404
    posture.
  - `tests/integration/frontend/designSystemCanonicalLauncherLinkAudit.test.ts`
    verifies migrated launcher links prefer generated canonical-rendering
    URLs and that linked generated routes serve browser shells.
  - `tests/integration/frontend/designSystemCanonicalOverlayContainmentAudit.test.ts`,
    `tests/integration/frontend/designSystemCanonicalResponsiveWidthAudit.test.ts`,
    and `tests/integration/frontend/designSystemCanonicalThemeScopeAudit.test.ts`
    cover escaped issue classes from the canonical-rendering completion
    checklist.
  - `tests/unit/webAppHierarchyBuilder/service.test.ts` and
    `tests/integration/webAppHierarchyBuilder/flow.test.ts` cover
    canonical-renderings hierarchy sync, idempotency, active locators, and
    template-key preservation.
  - Family-specific generated-route visual proof lives under
    `tests/visual/designSystem/canonicals/`.
  - The executable test names do not consistently embed
    `TC-DESIGN-SYS-CANON-*` ids because much of the suite was implemented as
    regression and visual-governance evidence while the generated route family
    was being hardened. Treat the mappings in this file as coverage intent and
    current evidence pointers rather than exact test-name trace ids.

## QA Coverage Classification

- Change class:
  - privileged backend capability extension
  - public route-family addition
  - durability/persistence extension
  - compatibility-sensitive signoff-surface rollout
  - topology and page-template integration slice
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - edge
  - compatibility/contract
  - frontend
  - persistence-backed verification
- Additional required checks:
  - parity proof against the legacy canonical route family
  - deterministic route-state proof for generated canonical-rendering paths
  - page-tree sync honesty review
  - template-intent precision review for `canonical-rendering`
- Not required in this slice:
  - dedicated performance or soak suite unless the generated public route
    projections introduce measurable latency or heavy route-fanout behavior
  - dedicated resilience/failure-injection suite beyond focused projection and
    sync error-path verification

## Unit Tests For Individual Capabilities

- Capability: manage canonical family governance
  Test Case ID: `TC-DESIGN-SYS-CANON-UNIT-001`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/designSystemCanonicals/`
  Requires Shared Test Helper: yes
  Coverage:
  - creates a canonical family with normalized key and route posture
  - updates lifecycle, ordering, and featured posture
  - rejects duplicate family keys or duplicate generated launcher paths
  - rejects client-supplied system-managed fields

- Capability: manage canonical reference governance
  Test Case ID: `TC-DESIGN-SYS-CANON-UNIT-002`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/designSystemCanonicals/`
  Requires Shared Test Helper: yes
  Coverage:
  - creates a canonical ref inside an existing family
  - persists deterministic scalar render settings
  - persists bounded family payload with versioning
  - rejects duplicate ref ids within a family or duplicate generated render
    paths

- Capability: public launcher projection is family-scoped and lifecycle-gated
  Test Case ID: `TC-DESIGN-SYS-CANON-UNIT-003`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/designSystemCanonicals/`
  Requires Shared Test Helper: yes
  Coverage:
  - returns only live/public family metadata and ordered visible refs
  - omits inactive or draft refs from the public launcher projection
  - returns not-found or inactive posture honestly for non-public families
  - sets template intent to `launcher`

- Capability: public deterministic render projection is exact and non-mutable
  Test Case ID: `TC-DESIGN-SYS-CANON-UNIT-004`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/designSystemCanonicals/`
  Requires Shared Test Helper: yes
  Coverage:
  - resolves one exact family/ref pair
  - returns deterministic scalar settings and bounded payload
  - rejects missing, inactive, or mismatched family/ref combinations
  - does not allow mutable query params to redefine canonical state

- Capability: page-tree sync materializes launcher and render pages from
  canonical-governance truth
  Test Case ID: `TC-DESIGN-SYS-CANON-UNIT-005`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - creates or refreshes one launcher node per live family
  - creates or refreshes child render nodes per live ref
  - preserves explicit template keys
  - does not silently delete unrelated curated pages

- Capability: page-template settings support `canonical-rendering` precisely
  Test Case ID: `TC-DESIGN-SYS-CANON-UNIT-006`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Coverage:
  - accepts `canonical-rendering` as an approved template key
  - preserves `launcher` for canonical-launcher pages
  - rejects unsupported template substitutions for canonical pages
  - does not invent a separate `canonical-launcher` template key

## Integration Tests For Features Working Together

- Flow: privileged root operator governs a canonical family and rereads the
  stored result
  Test Case ID: `TC-DESIGN-SYS-CANON-INT-001`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/designSystemCanonicals/`
  Requires Shared Test Helper: yes
  Features:
  - `rootAuth`
  - root authorization
  - `designSystemCanonicals`
  Coverage:
  - family create succeeds for an authorized operator
  - reread returns the persisted route posture and lifecycle metadata
  - duplicate route posture is rejected consistently

- Flow: privileged root operator governs canonical refs with deterministic
  render settings and payload
  Test Case ID: `TC-DESIGN-SYS-CANON-INT-002`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/designSystemCanonicals/`
  Requires Shared Test Helper: yes
  Features:
  - `rootAuth`
  - root authorization
  - `designSystemCanonicals`
  Coverage:
  - ref create succeeds inside an approved family
  - reread returns scalar settings plus bounded payload
  - duplicate ref ids or duplicate generated render paths are rejected

- Flow: public generated launcher route renders from persisted family truth
  Test Case ID: `TC-DESIGN-SYS-CANON-INT-003`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/designSystem/`
  Requires Shared Test Helper: yes
  Features:
  - `designSystemCanonicals`
  - `design-system` public frontend family
  Coverage:
  - `/design-system/canonical-renderings/:familyKey` resolves and renders the
    launcher shell
  - live refs appear in deterministic order
  - inactive/draft refs are not exposed publicly
  - missing families return an honest non-success posture

- Flow: public deterministic render route resolves one exact canonical ref
  Test Case ID: `TC-DESIGN-SYS-CANON-INT-004`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/designSystem/`
  Requires Shared Test Helper: yes
  Features:
  - `designSystemCanonicals`
  - `design-system` public frontend family
  Coverage:
  - `/design-system/canonical-renderings/:familyKey/:referenceId` resolves one
    exact canonical state
  - returned render settings match the persisted ref definition
  - query params do not redefine canonical state
  - inactive refs are not exposed publicly

- Flow: page-tree sync refreshes durable design-system topology from canonical
  governance truth
  Test Case ID: `TC-DESIGN-SYS-CANON-INT-005`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Features:
  - `designSystemCanonicals`
  - `webAppHierarchyBuilder`
  Coverage:
  - sync reads live family/ref truth through the approved seam
  - launcher and render nodes are created or refreshed deterministically
  - the next page-tree read reflects the generated canonical routes as durable
    places
  - legacy `/canonicals` nodes are not silently repointed during the first
    slice

- Flow: page-template settings coexist with generated canonical routes
  Test Case ID: `TC-DESIGN-SYS-CANON-INT-006`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppPageSettings`
  - `webAppHierarchyBuilder`
  - `designSystemCanonicals`
  Coverage:
  - generated render pages can be represented as `canonical-rendering`
  - generated launcher pages remain `launcher`
  - unsupported template substitutions are rejected honestly

## Security Tests

- Capability: protected family, ref, and sync mutations deny missing or
  insufficient authorization
  Test Case ID: `TC-DESIGN-SYS-CANON-SEC-001`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/designSystemCanonicals/` and
  `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - unauthenticated callers are rejected
  - authenticated root users without canonical-governance capabilities are
    rejected
  - authenticated root users without page-tree sync capability are rejected

- Capability: public generated reads expose only live/public families and refs
  Test Case ID: `TC-DESIGN-SYS-CANON-SEC-002`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/designSystemCanonicals/`
  Coverage:
  - draft or inactive family routes do not leak governance-only metadata
  - draft or inactive refs do not render publicly
  - public routes do not become a backdoor to protected governance state

- Capability: generated canonical-rendering routes reject mutable query-state
  authority
  Test Case ID: `TC-DESIGN-SYS-CANON-SEC-003`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/designSystem/`
  Coverage:
  - appended query params do not override persisted canonical settings
  - unexpected parameters do not broaden public route authority

## Audit Tests

- Capability: denied canonical governance and page-tree sync attempts remain
  audit-visible
  Test Case ID: `TC-DESIGN-SYS-CANON-AUD-001`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/designSystemCanonicals/` and
  `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - denied family mutation is visible through the shared authz audit posture
  - denied reference mutation is visible through the shared authz audit posture
  - denied page-tree sync is visible through the shared authz audit posture

- Capability: successful privileged canonical-governance mutations are
  attributable
  Test Case ID: `TC-DESIGN-SYS-CANON-AUD-002`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/designSystemCanonicals/`
  Coverage:
  - successful family mutation captures actor and target identity
  - successful ref mutation captures actor, family, and ref identity
  - lifecycle or rollout-state transitions remain attributable

## Edge And Compatibility Tests

- Capability: generated route family remains additive alongside legacy
  canonical routes
  Test Case ID: `TC-DESIGN-SYS-CANON-EDGE-001`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/designSystem/`
  Coverage:
  - legacy `/design-system/canonicals/*` routes still resolve during the first
    slice
  - generated routes come online without replacing legacy routes
  - route authority is explicit rather than silently shifted

- Capability: parity harness can point legacy canonical assertions at generated
  routes
  Test Case ID: `TC-DESIGN-SYS-CANON-EDGE-002`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `frontend-visual` and `route-integration`
  Suggested Test Folder: `tests/visual/designSystem/` and
  `tests/integration/designSystem/`
  Coverage:
  - route-input plumbing allows the same launcher/render expectations to run
    against legacy and generated families where practical
  - parity failures identify real render or route differences rather than test
    harness drift
  Discussion note:
  - this likely requires restructuring some existing executable tests so route
    inputs become reusable; that should be discussed explicitly before broad
    churn lands

- Capability: generated page-tree nodes remain durable and deterministic
  Test Case ID: `TC-DESIGN-SYS-CANON-EDGE-003`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - sync remains deterministic across repeated runs
  - live nodes are refreshed rather than duplicated
  - inactive families or refs stop appearing only when lifecycle rules require
    it

- Capability: template precision remains stable across rollout
  Test Case ID: `TC-DESIGN-SYS-CANON-EDGE-004`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `service-unit` or `feature-integration`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Coverage:
  - generated render pages remain `canonical-rendering`
  - launcher pages remain `launcher`
  - rollout does not blur those template keys under migration pressure

- Capability: persisted seed truth stays aligned with executable current route
  behavior
  Test Case ID: `TC-DESIGN-SYS-CANON-EDGE-005`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/designSystemCanonicals/`
  Coverage:
  - seed/bootstrap data matches current executable canonical family/ref truth
  - when drift against source-independent docs exists, the mismatch is surfaced
    explicitly rather than silently normalized away

## Frontend And Visual Verification

- Capability: generated launcher routes satisfy launcher-template expectations
  Test Case ID: `TC-DESIGN-SYS-CANON-INT-007`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `frontend-visual`
  Suggested Test Folder: `tests/visual/designSystem/`
  Coverage:
  - generated canonical launcher pages still satisfy the shared launcher
    template contract
  - ordering, featured posture, and containment remain honest on generated
    launcher surfaces
  - existing launcher-template checks can be pointed at generated launcher
    routes for selected families

- Capability: generated render routes satisfy family-specific canonical visual
  expectations
  Test Case ID: `TC-DESIGN-SYS-CANON-INT-008`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `frontend-visual`
  Suggested Test Folder: `tests/visual/designSystem/`
  Coverage:
  - selected family-specific canonical expectations still pass on generated
    deterministic routes
  - the generated route family remains visually equivalent where parity is
    expected
  - signoff can move family-by-family once parity evidence is green

## Concurrency And Idempotency Notes

- Capability: repeated governance writes and repeated sync should remain
  deterministic
  Test Case ID: `TC-DESIGN-SYS-CANON-EDGE-006`
  Lifecycle Status: pending-review
  Reason: executable traceability has not landed yet; keep out of enforced active set until implementation or lifecycle review confirms this case remains current.
  Approval Note: approved during 2026-05-16 traceability cleanup to restore honest global gate behavior.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/designSystemCanonicals/` and
  `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - repeated identical family or ref mutations do not create duplicate durable
    rows
  - repeated page-tree sync does not create duplicate launcher or render nodes
  - final state remains deterministic after duplicate submissions

## Acceptance Notes

- This slice is acceptable when:
  - canonical-family and canonical-reference truth can be governed durably
  - public generated launcher and deterministic render routes resolve from
    persistence
  - generated render paths remain exact family/ref paths rather than mutable
    query-state routes
  - generated routes can be registered durably in the page tree
  - generated render pages can be represented precisely as
    `canonical-rendering`
  - parity can be proven family-by-family against the legacy canonical route
    family
