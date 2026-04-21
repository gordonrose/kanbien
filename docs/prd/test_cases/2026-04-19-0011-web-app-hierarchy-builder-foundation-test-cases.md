# Web App Hierarchy Builder Foundation Test Cases

## PRD Scope

- PRD:
  [docs/prd/2026-04-19-0011-web-app-hierarchy-builder-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0011-web-app-hierarchy-builder-foundation.md)
- Primary features involved: `webAppHierarchyBuilder`
- Cross-feature seams:
  - shared root-user authenticated session middleware protects all public API
    routes in this slice
  - shared root authorization gates enforce the hierarchy capabilities
  - downstream `pageShellPlanning` is expected to consume planner-selectable
    hierarchy reads from this feature rather than maintaining a separate
    hierarchy catalog
- Notes:
  - this file covers PRD-derived verification intent, not executable test
    implementation
  - executable tests now exist for focused unit, security, and audit coverage
  - Traceability Enforcement: partial and still deferred at the full-suite
    level
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - partially implemented; focused executable coverage exists but a full
    traceability sweep has not been completed yet
- Overall execution status:
  - runtime-tested in focused local suites
  - persistence-backed test file exists but local Postgres execution remained
    skipped in the latest turn
- Layer summary:
  - `UNIT`: partial
  - `INT`: partial
  - `SEC`: partial
  - `AUD`: partial
  - `EDGE`: planned/partial
- Latest executed verification commands:
  - `npx vitest run tests/unit/webAppHierarchyBuilder/service.test.ts tests/security/webAppHierarchyBuilder/security.test.ts tests/audit/webAppHierarchyBuilder/audit.test.ts tests/integration/webAppHierarchyBuilder/persistence.test.ts`
  - `npx tsc --noEmit`

## Unit Tests For Individual Capabilities

- Capability: `createWebAppModule`
  Test Case ID: `TC-WEB-APP-HIER-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in persistence
  Cleanup Expectation: created module rows should be attributable to the test
  run when persisted
  Coverage:
  - creates a module with stable machine id display name lifecycle state and
    sort order under one root family
  - rejects duplicate module id
  - rejects duplicate active normalized display name when that rule is enabled
  - rejects client-supplied system-managed fields
  - defaults or validates lifecycle state according to the PRD contract

- Capability: `updateWebAppModule`
  Test Case ID: `TC-WEB-APP-HIER-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in persistence
  Cleanup Expectation: mutated module rows should remain cleanup-addressable
  Coverage:
  - updates display metadata lifecycle and sort order
  - refreshes `updatedAt` on success
  - rejects module-id mutation
  - rejects update of missing module
  - rejects duplicate normalized display name on update

- Capability: `createWebAppPage`
  Test Case ID: `TC-WEB-APP-HIER-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in persistence
  Cleanup Expectation: created page rows and any related audit data should be
  cleanup-addressable
  Coverage:
  - creates a module-root page successfully under a resolved root family
  - creates a child-page successfully when the target parent exists
  - creates an orphaned page successfully with valid orphan placement
  - derives `resolvedFullRoutePath` from root family, placement, and
    `routeSegment`
  - rejects placement combinations inconsistent with parent presence
  - rejects duplicate page id
  - rejects sibling route collision under the same effective parent
  - rejects client-supplied derived full-route and system-managed fields

- Capability: `updateWebAppPage`
  Test Case ID: `TC-WEB-APP-HIER-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in persistence
  Cleanup Expectation: updated rows should remain cleanup-addressable
  Coverage:
  - updates display metadata lifecycle route segment and sort order
  - refreshes `updatedAt` on success
  - refreshes the page and descendant `resolvedFullRoutePath` values when
    `routeSegment` changes
  - rejects direct placement edits through the metadata-update capability
  - rejects sibling route collisions created by update
  - rejects route-affecting update when compatibility policy blocks a `live`
    page or descendant branch

- Capability: `moveWebAppPage`
  Test Case ID: `TC-WEB-APP-HIER-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in persistence
  Cleanup Expectation: moved branches should remain inspectable and
  cleanup-addressable
  Coverage:
  - reparents a page under a new valid parent
  - moves a page from child placement to module-root placement
  - orphans a page without destroying it
  - preserves or updates root-family ownership consistently when branch moves
    across valid target families are allowed
  - updates module ownership for the moved branch when crossing modules is
    allowed
  - refreshes derived route values for the moved page and all descendants
  - rejects cycles including moving a page under itself or its descendant
  - rejects sibling route collisions in the target placement
  - rejects blocked compatibility-sensitive move of a `live` branch

- Capability: `getResolvedWebAppHierarchyTree`
  Test Case ID: `TC-WEB-APP-HIER-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in persistence
  Cleanup Expectation: tree fixtures should be created through helpers so all
  rows are cleanup-addressable
  Coverage:
  - returns root families, modules, and pages in deterministic order
  - returns derived route values and placement metadata
  - excludes invented placeholder nodes
  - applies explicit include-orphaned or include-inactive behavior honestly
  - supports exact filtering without changing record truth

- Capability: `listPlannerSelectableHierarchyNodes`
  Test Case ID: `TC-WEB-APP-HIER-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in persistence
  Cleanup Expectation: planner-read fixtures should be helper-created and
  cleanup-addressable
  Coverage:
  - projects stable planner option values from durable root-family-aware
    hierarchy rows
  - excludes inactive pages by default
  - excludes inappropriate orphaned pages by default unless explicitly included
  - includes module context placement type lifecycle state and derived route
    context needed by downstream planners
  Notes:
  - this is the anti-drift seam that should prevent `pageShellPlanning` from
    maintaining a separate hierarchy catalog

- Capability: `listOrphanedWebAppPages`
  Test Case ID: `TC-WEB-APP-HIER-UNIT-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in persistence
  Cleanup Expectation: orphan fixtures should be helper-created and
  cleanup-addressable
  Coverage:
  - returns orphaned pages only
  - preserves page identity module context lifecycle state and route context
  - supports explicit filters and deterministic ordering
  - does not silently reinsert orphaned pages into the active tree

- Capability: `bootstrapWebAppHierarchyFromCurrentNavigablePages`
  Test Case ID: `TC-WEB-APP-HIER-UNIT-009`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created in persistence
  Cleanup Expectation: bootstrap-created rows should be attributable to the
  test run when persisted
  Coverage:
  - creates missing root-family, module, and page rows from approved bootstrap
    scope
  - marks bootstrap metadata when configured
  - skips or flags duplicate collisions deterministically
  - does not invent placeholder pages when the input set is incomplete
  - respects the special top-level root families `root-admin`, `login`, and
    `design-system`
  Notes:
  - ambiguity handling should match the approved default of landing ambiguous
    records in `review`

## Integration Tests For Features Working Together

- Flow: root-authenticated operator manages modules and pages through protected
  routes
  Test Case ID: `TC-WEB-APP-HIER-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: created modules pages and audit evidence should be tied
  to one `testRunId`
  Features: `rootAuth` + root authorization + `webAppHierarchyBuilder`
  Coverage:
  - authenticated root operator with capability can create module create page
    move page and read tree
  - missing or insufficient capability is rejected consistently

- Flow: planner-selectable hierarchy values remain aligned with durable
  hierarchy truth
  Test Case ID: `TC-WEB-APP-HIER-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: hierarchy fixtures and planner-read projections should be
  tied to one `testRunId`
  Features: `webAppHierarchyBuilder` + downstream planner-consumer seam
  Coverage:
  - created or moved hierarchy nodes appear correctly in planner-selectable read
  - inactive nodes stay excluded by default
  - orphaned nodes do not appear as active planner choices unless explicitly
    allowed

- Flow: derived route truth stays synchronized after route-segment edits and
  branch moves
  Test Case ID: `TC-WEB-APP-HIER-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: moved-branch fixtures should be tied to one `testRunId`
  Features: `webAppHierarchyBuilder` persistence + service + transport
  Coverage:
  - route-segment update refreshes descendant derived paths
  - move operation refreshes descendant derived paths
  - subsequent tree and orphan reads reflect the new truth consistently

- Flow: bootstrap imports current app truth without inventing pages
  Test Case ID: `TC-WEB-APP-HIER-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: bootstrap-created rows should be tied to one `testRunId`
  Features: `webAppHierarchyBuilder` + bootstrap source readers
  Coverage:
  - bootstrap imports approved current app families
  - bootstrap does not create pages absent from the browser-navigable input set
  - bootstrap records ambiguous cases in `review` rather than silently
    asserting a wrong final structure

## NFR Security Tests

- Security: protected routes require authenticated root session
  Test Case ID: `TC-WEB-APP-HIER-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - unauthenticated callers cannot access create update move read or bootstrap
    routes

- Security: explicit hierarchy capability gates are enforced
  Test Case ID: `TC-WEB-APP-HIER-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - authenticated root users without the required capability are denied
  - capability-specific grants map to the correct route surfaces

- Security: system-managed and derived fields cannot be client-controlled
  Test Case ID: `TC-WEB-APP-HIER-SEC-003`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - client cannot set `createdAt`, `updatedAt`, internal bootstrap metadata, or
    derived `resolvedFullRoutePath`

- Security: strict-tree validation blocks malicious or accidental cycle
  creation
  Test Case ID: `TC-WEB-APP-HIER-SEC-004`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - move and update paths reject self-parent and descendant-parent attempts

- Security: bootstrap cannot be abused as a raw hierarchy replacement API
  Test Case ID: `TC-WEB-APP-HIER-SEC-005`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - bootstrap accepts only approved scope controls
  - bootstrap rejects invented raw module or page replacement payloads

## NFR Logging Or Audit Tests

- Audit: successful module and page mutations are audit-visible
  Test Case ID: `TC-WEB-APP-HIER-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - create module create page update page move page and bootstrap actions emit
    the expected audit-visible records or equivalent durable evidence

- Audit: successful root-family-aware hierarchy mutations are audit-visible
  Test Case ID: `TC-WEB-APP-HIER-AUD-004`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - audit payloads capture root-family context alongside module/page context

- Audit: denied privileged actions are audit-visible where required
  Test Case ID: `TC-WEB-APP-HIER-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - denied create move bootstrap or privileged read attempts produce the
    expected security-visible evidence if the final implementation adopts that
    posture

- Audit: move and bootstrap audit evidence preserves before-and-after context
  Test Case ID: `TC-WEB-APP-HIER-AUD-003`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - move events capture prior placement target placement and affected route
    summaries
  - bootstrap events capture scope created counts skipped counts and conflicts

## Edge Cases And Negative Tests

- Edge: inactive pages are excluded from planner reads by default
  Test Case ID: `TC-WEB-APP-HIER-EDGE-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - inactive nodes require explicit inclusion and do not appear silently in the
    default planner projection

- Edge: orphaned pages remain durable after removal from the active tree
  Test Case ID: `TC-WEB-APP-HIER-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - orphaning removes the page from the active tree read
  - orphan review still exposes the page with stable identity

- Edge: special root families stay distinct during bootstrap and reads
  Test Case ID: `TC-WEB-APP-HIER-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - `/root-admin`, `/login`, and `/design-system` stay distinct durable
    root-family nodes and are not flattened into one generic business-module
    bucket

- Edge: compatibility-sensitive edits of live branches are blocked by default
  Test Case ID: `TC-WEB-APP-HIER-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - move or route change against a `live` branch fails when no approved
    compatibility path exists

- Edge: deterministic ordering survives repeated edits
  Test Case ID: `TC-WEB-APP-HIER-EDGE-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - repeated create update and move operations preserve explicit sibling and
    module ordering without nondeterministic drift

- Edge: duplicate or replayed move requests stay deterministic
  Test Case ID: `TC-WEB-APP-HIER-EDGE-006`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - duplicate submissions do not create duplicate rows or inconsistent branch
    placement
  Notes:
  - this is the first-pass idempotency and conflicting-write proof for the
    branch-move mutation path

## Additional Verification Notes

- Persistence-backed proof is expected for:
  - route-derivation refresh across descendant branches
  - uniqueness and collision behavior
  - bootstrap row creation and conflict handling
  - audit-visible mutation evidence when stored durably
- No separate end-to-end journey inventory is recommended for this backend
  foundation slice yet because the user-facing editor workflow is intentionally
  deferred. If a hierarchy-management UI is added later, create a journey
  inventory at that point.
- No existing executable tests appear to require modification yet because the
  feature does not exist in code. Revisit this assumption once implementation
  begins and route generation or planner consumers start depending on the new
  hierarchy seam.
