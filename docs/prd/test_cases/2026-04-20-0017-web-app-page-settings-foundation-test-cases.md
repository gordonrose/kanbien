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
  - this slice is a privileged backend-plus-frontend operator workflow
  - traceability enforcement should be treated as active from the start for
    this slice because the workflow is user-facing and permission-sensitive

## Current Status

- Overall traceability status:
  - planned
- Overall execution status:
  - not yet implemented
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

## Edge And Compatibility Tests

- Capability: self-only context-nav fallback remains honest
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-001`
  Recommended Test Layer: `service-unit` or `feature-integration`
  Suggested Test Folder: `tests/unit/webAppPageSettings/`
  Coverage:
  - no explicit target rows still produces a self-only effective context nav
  - saving an empty set does not produce a broken empty navigation model unless
    explicitly approved later

- Capability: deterministic replacement of explicit context-nav targets
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Coverage:
  - removing one target and adding another yields the exact new set
  - old target rows do not linger

- Capability: module landing-page integrity on later page moves
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - landing-page truth is updated, cleared, or blocked honestly when the
    chosen page is later moved out of direct-child eligibility

- Capability: settings/topology truth boundary remains explicit
  Test Case ID: `TC-WEB-PAGE-SET-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppPageSettings/`
  Coverage:
  - settings update does not mutate canonical page label, placement, module, or
    locator truth
  - module landing-page update does not write into the settings feature

## Frontend And Workspace Tests

- Flow: selected-page Page Settings panel loads and saves truthfully
  Test Case ID: `TC-WEB-PAGE-SET-INT-006`
  Recommended Test Layer: `frontend-visual/integration`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - selecting a page loads the Page Settings section
  - approved options load before form interaction
  - save success and validation failure states are rendered honestly

- Flow: module landing-page affordance remains inside the Hierarchy section
  Test Case ID: `TC-WEB-PAGE-SET-INT-007`
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

## Suggested Executable Test Layout

- `tests/unit/webAppPageSettings/service.test.ts`
- `tests/integration/webAppPageSettings/flow.test.ts`
- `tests/security/webAppPageSettings/security.test.ts`
- `tests/audit/webAppPageSettings/audit.test.ts`
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
