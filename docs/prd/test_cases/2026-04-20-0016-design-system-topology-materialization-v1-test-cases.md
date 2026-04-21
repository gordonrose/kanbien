# Design System Topology Materialization V1 Test Cases

## PRD Scope

- PRD:
  [docs/prd/2026-04-20-0016-design-system-topology-materialization-v1.md](/home/gordon/kanbien/docs/prd/2026-04-20-0016-design-system-topology-materialization-v1.md)
- Primary features involved:
  - `webAppHierarchyBuilder`
  - `webAppSurfaceDiscovery`
- Cross-feature seams:
  - shared root-user authenticated session middleware protects all protected API
    routes in this slice
  - shared root authorization gates enforce the new topology capabilities
  - `webAppHierarchyBuilder` must remain the owner of curated topology truth
    and materialization workflow
  - `webAppSurfaceDiscovery` remains the discovery-owned read seam for current
    design-system route truth
  - `design-system` route entry is implied primarily by file/folder structure
    and `index.html`
- Notes:
  - this file covers PRD-derived verification intent, not executable test
    implementation
  - this slice introduces both topology-state and repo-materialization behavior
  - executable hierarchy tests now cover the first backend create/preview/apply
    slice; remaining lifecycle entries below stay active for still-missing
    audit, broader edge/compatibility, and future browser wiring
  - Traceability Enforcement:
    partial and active for this slice
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - partial executable backend coverage with active remaining cases
- Overall execution status:
  - partially implemented
- Layer summary:
  - `UNIT`: implemented for the core preview/apply/materializer slice
  - `INT`: implemented for the happy-path create/preview/apply/read flow
  - `SEC`: implemented for capability-gated create/preview/apply denial
  - `FRONTEND`: implemented for the first root-admin browser-wired operator flow
  - `AUD`: still planned
  - `EDGE`: partially planned; some preview/apply mismatch handling is covered
  - `COMPAT`: partially planned; rename and broader blocked operations still
    need more explicit executable coverage
  - `CONCURRENCY/IDEMPOTENCY`: light planned
- Existing executable test impact:
  - `tests/unit/webAppHierarchyBuilder/service.test.ts`
    now includes additive design-system materialization cases for proposal
    create, deterministic preview, and apply/materialized output behavior
  - `tests/integration/webAppHierarchyBuilder/flow.test.ts`
    now includes route-level create, preview, apply, and post-apply tree
    refresh coverage for the applied-tree seam
  - `tests/security/webAppHierarchyBuilder/security.test.ts`
    now includes additive coverage for the new create/preview/apply
    capabilities
  - `tests/audit/webAppHierarchyBuilder/audit.test.ts`
    still needs additive visibility checks for denied topology-change attempts
  - `tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`
    now covers the first browser-wired design-system create/preview/apply flow
    inside the governed hierarchy-tree family

## QA Coverage Classification

- Change class:
  - privileged backend capability extension
  - governed frontend-topology materialization slice
  - compatibility-sensitive route-truth change
  - repo-materialization workflow
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - edge
  - compatibility/contract
  - frontend
- Additional required checks:
  - materialization honesty review
  - no-hidden-repo-mutation review
  - blocked folder-move handling review
  - route-segment rename compatibility review
- Not required in this slice:
  - dedicated resilience/failure-injection suite
  - dedicated performance suite
  - end-to-end journey beyond one focused operator workflow once the browser
    surface exists

## Unit Tests For Individual Capabilities

- Capability: create proposed design-system page
  Test Case ID: `TC-DESIGN-SYS-TOPO-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - creates a proposed page with required normalized route segment and parent
    placement
  - rejects duplicate sibling segment posture
  - rejects client-supplied system-managed fields
  Current lifecycle:
  - partially implemented in `tests/unit/webAppHierarchyBuilder/service.test.ts`
    through the current proposal create assertions; duplicate/system-managed
    field edges remain active

- Capability: create proposed design-system subpage
  Test Case ID: `TC-DESIGN-SYS-TOPO-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - creates a proposed child page under an allowed parent
  - preserves explicit parent-child placement
  - rejects invalid or missing parent placement
  Current lifecycle:
  - implemented in `tests/integration/webAppHierarchyBuilder/flow.test.ts`
    for the governed API flow; a narrower service-unit variant remains optional

- Capability: preview design-system materialization
  Test Case ID: `TC-DESIGN-SYS-TOPO-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - classifies create as additive
  - classifies route-segment rename as compatibility-sensitive
  - classifies blocked folder move requests honestly
  - returns deterministic planned repo outputs for new pages
  Current lifecycle:
  - partially implemented in `tests/unit/webAppHierarchyBuilder/service.test.ts`
    for additive preview and deterministic planned outputs; rename and blocked
    folder-move variants remain active

- Capability: apply design-system materialization
  Test Case ID: `TC-DESIGN-SYS-TOPO-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - updates applied topology only after a valid preview-approved change
  - creates the expected materialization plan outputs
  - refuses blocked or invalid apply inputs
  - returns updated applied tree truth
  Current lifecycle:
  - implemented in `tests/unit/webAppHierarchyBuilder/service.test.ts`

- Capability: blocked folder move handling
  Test Case ID: `TC-DESIGN-SYS-TOPO-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - rejects folder move requests in v1
  - explains the blocked reason through a feature-owned code
  - does not invent alternate repo relocation behavior
  Current lifecycle:
  - still planned

- Capability: shared-CSS default materialization
  Test Case ID: `TC-DESIGN-SYS-TOPO-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - does not generate page-local stylesheet stubs by default
  - requires the approved v1 template key `static-html-page`
  - does not generate a behavior module stub by default for that template
  - creates the expected lightweight documentation/governance stub at
    `docs/workspace/design-system/generated-pages/<page-slug>.md`
  Current lifecycle:
  - implemented in `tests/unit/webAppHierarchyBuilder/service.test.ts`

## Integration Tests For Features Working Together

- Flow: authenticated root operator creates a proposed design-system page,
  previews materialization, applies it, and reads the refreshed tree
  Test Case ID: `TC-DESIGN-SYS-TOPO-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: created proposed/applied topology records and any
  materialization metadata should be attributable to one test run
  Features:
  - `rootAuth`
  - root authorization
  - `webAppHierarchyBuilder`
  Coverage:
  - create succeeds for an approved `design-system` location
  - preview returns deterministic additive repo changes
  - apply succeeds after confirmation
  - the next read of
    `GET /v1/web-app-hierarchy/design-system/applied-tree`
    reflects applied truth immediately
  Current lifecycle:
  - implemented in `tests/integration/webAppHierarchyBuilder/flow.test.ts`

- Flow: authenticated root operator creates a design-system subpage and the
  resulting tree preserves parent-child placement
  Test Case ID: `TC-DESIGN-SYS-TOPO-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Features:
  - `webAppHierarchyBuilder`
  Coverage:
  - subpage creation is represented under the correct parent
  - materialization stays additive
  - no folder move is required for the first create flow
  Current lifecycle:
  - implemented in `tests/integration/webAppHierarchyBuilder/flow.test.ts`

- Flow: route-segment rename requires preview and explicit compatibility-aware
  apply
  Test Case ID: `TC-DESIGN-SYS-TOPO-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppHierarchyBuilder`
  Coverage:
  - rename is classified as compatibility-sensitive
  - apply is refused when required preview/approval posture is missing
  - no silent route rewrite occurs
  Current lifecycle:
  - still planned

- Flow: folder movement request is blocked honestly
  Test Case ID: `TC-DESIGN-SYS-TOPO-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppHierarchyBuilder`
  Coverage:
  - logical tree move may be previewed
  - physical folder move is blocked in v1
  - the repo-materialization plan does not invent relocation behavior
  Current lifecycle:
  - still planned

- Flow: apply remains aligned with current discovery truth for the
  `design-system` family
  Test Case ID: `TC-DESIGN-SYS-TOPO-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppHierarchyBuilder`
  - `webAppSurfaceDiscovery`
  Coverage:
  - the family is still recognized as file-routed path-backed topology
  - the workflow-specific applied-tree read remains compatible with discovered
    route posture without changing the broader `GET /v1/web-app-hierarchy/tree`
    contract
  - the slice does not reinterpret `design-system` as a different routing model
  Current lifecycle:
  - partially implemented through the current integration flow; a more explicit
    discovery comparison remains active

## NFR Security Tests

- Security: create, preview, and apply routes require authenticated root
  session
  Test Case ID: `TC-DESIGN-SYS-TOPO-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - unauthenticated callers cannot create preview or apply
  - tenant callers and unauthorized root sessions are denied
  Current lifecycle:
  - implemented in `tests/security/webAppHierarchyBuilder/security.test.ts`

- Security: backend remains authoritative for approval posture
  Test Case ID: `TC-DESIGN-SYS-TOPO-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - client input cannot bypass preview/apply sequencing
  - blocked folder moves and blocked destructive actions stay blocked even if
    requested directly at the API layer
  Current lifecycle:
  - partially implemented in `tests/security/webAppHierarchyBuilder/security.test.ts`
    for preview/apply capability enforcement; blocked destructive variants
    remain active

## NFR Audit Tests

- Audit: denied topology-change attempts remain audit-visible
  Test Case ID: `TC-DESIGN-SYS-TOPO-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - denied create preview and apply attempts produce the expected audit-visible
    events through the shared authz layer

- Audit: successful apply is operator-attributable if success-side audit is
  implemented in the slice
  Test Case ID: `TC-DESIGN-SYS-TOPO-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - success records, if adopted, include operator identity and apply summary
  - no misleading success-side audit is emitted for failed or blocked apply

## Edge Cases And Negative Tests

- Edge: duplicate sibling route segment rejected
  Test Case ID: `TC-DESIGN-SYS-TOPO-EDGE-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - duplicate segment under the same parent is rejected consistently

- Edge: stale preview token or stale preview posture rejected on apply
  Test Case ID: `TC-DESIGN-SYS-TOPO-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - apply refuses stale or mismatched preview assumptions
  - tree truth remains unchanged after refusal

- Edge: invalid parent placement rejected for subpage create
  Test Case ID: `TC-DESIGN-SYS-TOPO-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - invalid parent ids or unsupported parent kinds are rejected

- Edge: blocked delete/retire request remains explicitly unsupported
  Test Case ID: `TC-DESIGN-SYS-TOPO-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - delete/retire requests return explicit blocked/not-supported behavior
  - no repo or applied-tree mutation occurs

## Frontend Coverage Plan

- Frontend: governed hierarchy surface supports create, preview, apply, error,
  and post-apply tree refresh honestly
  Test Case ID: `TC-DESIGN-SYS-TOPO-INT-006`
  Recommended Test Layer: `frontend-integration` or `visual/browser`
  Suggested Test Folder:
  - `tests/visual/designSystem/`
  - or the approved browser/integration folder for the eventual operator
    surface
  Coverage:
  - create flow reaches preview before apply
  - blocked states are visible and understandable
  - successful apply refreshes the rendered tree from applied truth
  - the workflow does not rely on hidden page-local styling exceptions
  Current lifecycle:
  - implemented in `tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`

## Compatibility / Contract Checks

- Compatibility: route-segment rename stays explicitly classified and does not
  become a silent additive change
  Test Case ID: `TC-DESIGN-SYS-TOPO-EDGE-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - rename remains compatibility-sensitive
  - no redirect/alias behavior is invented implicitly
  - applied route truth changes only through explicit approved flow

## Discussion Notes

- Existing executable tests for `webAppHierarchyBuilder` now cover the first
  backend create/preview/apply slice, but the active cases above still matter
  for audit visibility, blocked folder-move behavior, and rename compatibility.
- If the first browser operator workflow is implemented on top of the governed
  `hierarchy-tree` family, the resulting frontend tests should remain
  screenshot- and behavior-driven rather than inventing a one-off admin UI
  surface outside the signed-off family.
