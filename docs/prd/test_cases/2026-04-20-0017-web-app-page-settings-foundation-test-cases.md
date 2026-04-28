# Web App Page Settings Foundation Test Cases

## PRD Scope

- PRD:
  [docs/prd/2026-04-20-0017-web-app-page-settings-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-20-0017-web-app-page-settings-foundation.md)
- Primary features involved:
  - `webAppPageSettings`
  - `webAppHierarchyBuilder`
  - `rootAdminShell`
- Cross-feature seams:
  - shared root-user authenticated session middleware protects all protected
    API routes in this slice
  - shared root authorization gates enforce page-settings and module-landing
    capabilities
  - `webAppHierarchyBuilder` remains authoritative for page identity, module
    identity, and module landing-page topology truth
  - `webAppPageSettings` owns durable page-settings and curated context-nav
    membership truth
  - `webAppSurfaceDiscovery` remains outside the authority boundary for
    settings writes
- Journey inventory required:
  [2026-04-20-0017-web-app-page-settings-foundation-journey-inventory.md](/home/gordon/kanbien/docs/prd/journey_inventories/2026-04-20-0017-web-app-page-settings-foundation-journey-inventory.md)
- Notes:
  - this file covers PRD-derived verification intent, not executable test
    implementation
  - this slice is a privileged backend-plus-frontend operator workflow on the
    canonical `/root-admin/web-app-hierarchy` workspace route
  - traceability enforcement should be treated as active from the start for
    this slice because the workflow is user-facing and permission-sensitive

## Current Status

- Overall traceability status:
  - active
- Overall execution status:
  - partially implemented; parent-owned context-nav projection coverage added
    on 2026-04-28
- Layer summary:
  - `UNIT`: planned
  - `INT`: planned
  - `SEC`: planned
  - `AUD`: planned
  - `EDGE`: planned
  - `FRONTEND`: planned
  - `COMPAT`: planned

## QA Coverage Classification

- Change class:
  - privileged backend capability extension
  - governed real-app operator workflow
  - durable configuration/persistence extension
  - topology-adjacent compatibility slice
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - edge
  - frontend
  - persistence-backed verification
  - end-to-end journey
- Additional required checks:
  - design-system adoption honesty review for the selected-page form surface
  - settings/topology boundary review
  - module-landing direct-child validation review
- Not required in this slice:
  - dedicated performance suite unless the implementation introduces a heavy
    selector or browser bottleneck
  - dedicated resilience/failure-injection suite beyond focused error-path
    verification

## Unit Tests For Individual Capabilities

- Capability: read page settings with effective fallback
  Test Case ID: `TC-WEB-PAGE-SET-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Coverage:
  - returns stored settings when a settings row exists
  - returns default fallback icon and self-only context-nav when no explicit
    settings or context-nav rows exist
  - rejects unknown page ids

- Capability: update page settings
  Test Case ID: `TC-WEB-PAGE-SET-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Coverage:
  - creates a settings row on first save
  - updates an existing settings row on later save
  - refreshes `updatedAt` on success
  - rejects client-supplied system-managed fields

- Capability: validate approved icon and template choices
  Test Case ID: `TC-WEB-PAGE-SET-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Coverage:
  - accepts approved icon keys
  - accepts null icon for fallback posture
  - rejects unknown icon keys
  - rejects unknown template keys

- Capability: replace curated context-nav membership deterministically
  Test Case ID: `TC-WEB-PAGE-SET-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Coverage:
  - replaces the current target set and order from an exact submitted list
  - rejects duplicate target page ids
  - rejects nonexistent target page ids
  - preserves self-only effective fallback when no explicit targets are saved

- Capability: read page-settings options
  Test Case ID: `TC-WEB-PAGE-SET-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Coverage:
  - returns approved icon catalog and default fallback metadata from the
    governed icon-catalog source
  - returns approved template catalog
  - returns eligible context-nav target pages for the selected page from
    curated hierarchy/tree truth
  - does not consult discovery-owned truth for options authority

- Capability: update module landing page
  Test Case ID: `TC-WEB-PAGE-SET-UNIT-006`
  Lifecycle Status: pending-review
  Reason: Module landing-page executable coverage is outside the 2026-04-28
    parent-owned context-nav projection slice and needs separate lifecycle
    review before being treated as an active gate here.
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - sets a direct child page as the landing page
  - clears an existing landing-page selection
  - rejects a descendant that is not a direct child
  - rejects a page from another module

## Integration Tests For Features Working Together

- Flow: root-authenticated operator reads settings for a selected page through
  protected routes
  Test Case ID: `TC-WEB-PAGE-SET-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Features:
  - `rootAuth`
  - root authorization
  - `webAppPageSettings`
  Coverage:
  - exact selected-page settings read succeeds for an authorized operator
  - default fallback values are projected honestly
  - missing page ids are rejected consistently

- Flow: root-authenticated operator saves page settings and rereads the updated
  state
  Test Case ID: `TC-WEB-PAGE-SET-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Features:
  - `rootAuth`
  - root authorization
  - `webAppPageSettings`
  - `webAppHierarchyBuilder`
  Coverage:
  - settings save succeeds for approved values
  - reread returns the saved values
  - context-nav target order remains deterministic

- Flow: options read projects approved choices and eligible target pages from
  governed seams
  Test Case ID: `TC-WEB-PAGE-SET-INT-003`
  Lifecycle Status: pending-review
  Reason: Existing options-read coverage inventory predates the parent-owned
    context-nav projection update and needs separate lifecycle review before
    being treated as an active gate here.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppPageSettings`
  - `webAppHierarchyBuilder`
  Coverage:
  - icon and template catalogs are returned from approved settings truth
  - eligible target pages come from curated page reads
  - ineligible or missing selected pages are rejected

- Flow: module landing-page update stays topology-owned
  Test Case ID: `TC-WEB-PAGE-SET-INT-004`
  Lifecycle Status: pending-review
  Reason: Module landing-page executable coverage is outside the 2026-04-28
    parent-owned context-nav projection slice and needs separate lifecycle
    review before being treated as an active gate here.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppHierarchyBuilder`
  Coverage:
  - direct-child target succeeds
  - descendant and cross-module targets fail
  - module read projection reflects updated landing-page truth

- Flow: page-settings save coexists with current topology-owned template
  posture during migration
  Test Case ID: `TC-WEB-PAGE-SET-INT-005`
  Lifecycle Status: pending-review
  Reason: Template coexistence coverage is outside the 2026-04-28 parent-owned
    context-nav projection slice and needs separate lifecycle review before
    being treated as an active gate here.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppPageSettings`
  - `webAppHierarchyBuilder`
  Coverage:
  - settings-owned page-template intent does not silently break current
    design-system topology/materialization assumptions
  - migration/coexistence posture is explicit and honest

- Flow: context-nav projection endpoint resolves owner rows from the viewed
  page parent
  Test Case ID: `TC-WEB-PAGE-SET-INT-009`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Requires Shared Test Helper: yes
  Features:
  - `rootAuth`
  - root authorization
  - `webAppPageSettings`
  - `webAppHierarchyBuilder`
  Coverage:
  - saving context-nav rows on a parent page makes those rows visible through
    the projection endpoint for a child page
  - the response keeps the viewed child page as `shellPageKey` while resolving
    items from the parent owner

## Security Tests

- Capability: protected read/update/options/module-landing routes deny missing
  or insufficient authorization
  Test Case ID: `TC-WEB-PAGE-SET-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppPageSettings/` and
  `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - unauthenticated callers are rejected
  - authenticated root users without page-settings capabilities are rejected
  - authenticated root users without module-landing capability are rejected

- Capability: client-side hidden UI does not become the authority boundary
  Test Case ID: `TC-WEB-PAGE-SET-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppPageSettings/`
  Coverage:
  - direct API calls remain denied when the actor lacks the governing
    capability even if the UI route is reachable

- Capability: parent-owned context-nav projection remains read-protected
  Test Case ID: `TC-WEB-PAGE-SET-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppPageSettings/`
  Coverage:
  - unauthenticated context-nav projection reads are rejected
  - authenticated root users without `web-app-page-settings.read` are rejected

## Audit Tests

- Capability: denied page-settings reads and writes remain audit-visible
  Test Case ID: `TC-WEB-PAGE-SET-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppPageSettings/`
  Coverage:
  - denied read is written to the shared authz audit posture
  - denied update is written to the shared authz audit posture

- Capability: denied module-landing updates remain audit-visible
  Test Case ID: `TC-WEB-PAGE-SET-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - denied landing-page updates are written to the shared authz audit posture

- Capability: denied context-nav projection reads remain audit-visible
  Test Case ID: `TC-WEB-PAGE-SET-AUD-003`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppPageSettings/`
  Coverage:
  - denied context-nav projection reads are written to the shared authz audit
    posture with the required read capability key

## Edge And Compatibility Tests

- Capability: self-only context-nav fallback remains honest
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-001`
  Lifecycle Status: pending-review
  Reason: Exact settings fallback coverage predates the parent-owned projection
    update and needs separate lifecycle review so exact-read fallback and
    projection-empty behavior are not conflated.
  Recommended Test Layer: `service-unit` or `feature-integration`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Coverage:
  - no explicit target rows still produces a self-only effective context nav
  - saving an empty set does not produce a broken empty navigation model unless
    explicitly approved later

- Capability: context-nav projection inherits from the immediate parent owner
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Coverage:
  - sibling child pages resolve the same ordered context-nav items from their
    immediate parent page's owner rows
  - child-owned empty rows do not override the parent-owned projection rule

- Capability: nested context-nav projection uses only the immediate parent
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Coverage:
  - a child page uses its parent page's context-nav owner rows
  - a grandchild page uses its immediate parent page's rows instead of the
    grandparent rows

- Capability: dynamic root-admin context-nav targets preserve their target
  page key and icon settings
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Coverage:
  - target pages that are not one of the fixed root-admin shell sections do not
    collapse to `overview` when their route path is root-admin-scoped
  - context-nav projection items carry the target page's own stored icon key
    and effective icon key

- Capability: fixed root-admin context-nav targets prefer page aliases over
  nested stored route paths
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Coverage:
  - root-admin target pages such as `root-admin-users` project as their fixed
    shell page keys even when stored under nested topology paths such as
    `/root-admin/overview/users`
  - mixed fixed-shell context-nav targets do not collapse to `overview`
    because of their shared parent route prefix

- Capability: deterministic replacement of explicit context-nav targets
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Coverage:
  - removing one target and adding another yields the exact new set
  - old target rows do not linger

- Capability: module landing-page integrity on later page moves
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-003`
  Lifecycle Status: pending-review
  Reason: Module landing-page move integrity is outside the 2026-04-28
    parent-owned context-nav projection slice and needs separate lifecycle
    review before being treated as an active gate here.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - landing-page truth is updated, cleared, or blocked honestly when the
    chosen page is later moved out of direct-child eligibility

- Capability: settings/topology truth boundary remains explicit
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-004`
  Lifecycle Status: pending-review
  Reason: Settings/topology boundary coverage is outside the 2026-04-28
    parent-owned context-nav projection slice and needs separate lifecycle
    review before being treated as an active gate here.
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Coverage:
  - settings update does not mutate canonical page label, placement, module, or
    locator truth
  - module landing-page update does not write into the settings feature

## Frontend And Workspace Tests

- Flow: selected-page Page Settings panel loads and saves truthfully
  Test Case ID: `TC-WEB-PAGE-SET-INT-006`
  Lifecycle Status: pending-review
  Reason: Full selected-page settings panel workflow coverage is outside the
    2026-04-28 parent-owned context-nav projection slice and needs separate
    lifecycle review before being treated as an active gate here.
  Recommended Test Layer: `frontend-visual/integration`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - selecting a page loads the Page Settings section
  - approved options load before form interaction
  - save success and validation failure states are rendered honestly

- Flow: module landing-page affordance remains inside the Hierarchy section
  Test Case ID: `TC-WEB-PAGE-SET-INT-007`
  Lifecycle Status: pending-review
  Reason: Module landing-page frontend affordance coverage is outside the
    2026-04-28 parent-owned context-nav projection slice and needs separate
    lifecycle review before being treated as an active gate here.
  Recommended Test Layer: `frontend-visual/integration`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - selecting a module reveals landing-page controls in `Hierarchy`, not
    `Page Settings`
  - only direct child pages are available for selection

- Flow: workspace labels and shell posture remain governed
  Test Case ID: `TC-WEB-PAGE-SET-INT-008`
  Recommended Test Layer: `frontend-visual/integration`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - the workspace uses the labels `Hierarchy`, `Page Settings`, `Observed App`,
    and `Preview & Apply`
  - the route remains the governed hierarchy workspace rather than a new
    route-local admin shell

- Flow: root-admin shell renders inherited context-nav for child pages
  Test Case ID: `TC-WEB-PAGE-SET-INT-010`
  Recommended Test Layer: `frontend-visual/integration`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - a child root-admin page renders the context-nav targets stored on its
    parent page
  - the child page's own empty target set does not replace the parent-owned
    projection

- Flow: Page Settings drawer-select explains inherited and child-owned roles
  Test Case ID: `TC-WEB-PAGE-SET-INT-011`
  Recommended Test Layer: `frontend-visual/integration`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - selecting a child page states that the displayed context-nav is inherited
    from its parent
  - the same drawer-select still edits the selected page's own context-nav
    rows for child pages that page owns
  - option metadata distinguishes selected, immediate-child, child-page, and
    top-level targets through the governed drawer-select option attribute slot

- Flow: top-level pages define direct children through a separate drawer-select
  Test Case ID: `TC-WEB-PAGE-SET-INT-012`
  Recommended Test Layer: `frontend-visual/integration`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - selecting a top-level page reveals a separate `Child pages` drawer-select
    in the structure-owned section rather than overloading context-nav editing
  - the drawer-select shows current direct children and available same-module
    pages with relationship metadata
  - saving newly selected child pages uses the hierarchy move seam so topology,
    route, cycle, and placement protections remain owned by
    `webAppHierarchyBuilder`

- Flow: root-admin context-nav uses target page icons and working links
  Test Case ID: `TC-WEB-PAGE-SET-INT-013`
  Recommended Test Layer: `frontend-visual/integration`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - context-nav buttons render the icon configured for each target page rather
    than inheriting one owner/current-page icon
  - fixed shell-section context-nav items retain canonical root-admin shell
    links
  - non-shell context-nav targets are not intercepted by shell-local page
    routing and can follow their rendered `href`

- Flow: root-admin nested overview route keeps explicit owner context-nav and
  route normalization aligned
  Test Case ID: `TC-WEB-PAGE-SET-INT-014`
  Recommended Test Layer: `frontend-visual/integration`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - a nested hierarchy-editor route for the root-admin overview page selects
    the matching overview page by route alias
  - root-admin context-nav renders explicit owner context-nav rows without
    inferring nav items from child topology
  - clicking the root-admin Overview top-nav item normalizes stale nested
    hierarchy URLs back to `/root-admin`

## Suggested Executable Test Layout

- `tests/unit/webAppPageSettings/service.test.ts`
- `tests/integration/webAppPageSettings/flow.test.ts`
- `tests/security/webAppPageSettings/security.test.ts`
- `tests/audit/webAppPageSettings/audit.test.ts`
- `tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`
- additive cases in:
  - `tests/unit/webAppHierarchyBuilder/service.test.ts`
  - `tests/integration/webAppHierarchyBuilder/flow.test.ts`
  - `tests/security/webAppHierarchyBuilder/security.test.ts`
  - `tests/audit/webAppHierarchyBuilder/audit.test.ts`
- `tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`

## Residual Planning Notes

- If the first real-app icon selector requires a new icon-grid design-system
  family, executable browser coverage for that UI should land only after the
  design-system signoff chain exists.
- If implementation reuses an already governed select or drawer pattern for
  icon choice in v1, the workspace tests above should still verify truthful
  options loading and save behavior.
