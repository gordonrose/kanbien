# Root Admin Path Topology Foundation Test Cases

## PRD Scope

- PRD:
  [docs/prd/2026-04-21-0019-root-admin-path-topology-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-21-0019-root-admin-path-topology-foundation.md)
- Primary features involved:
  - `rootAdminShell`
  - `webAppSurfaceDiscovery`
  - `webAppHierarchyBuilder`
- Cross-feature seams:
  - shared root-user authenticated session middleware protects current
    protected root-admin operator APIs
  - shell route entry must remain separate from backend business authority
  - `webAppSurfaceDiscovery` and `webAppHierarchyBuilder` must align on
    canonical path-backed root-admin locator truth
  - maintained docs and agent guidance must be refreshed so future work adopts
    the new topology honestly
- Journey inventory required:
  [2026-04-21-0019-root-admin-path-topology-foundation-journey-inventory.md](/home/gordon/kanbien/docs/prd/journey_inventories/2026-04-21-0019-root-admin-path-topology-foundation-journey-inventory.md)
- Notes:
  - this file covers PRD-derived verification intent, not executable test
    implementation
  - this slice is a shared platform seam migration plus privileged real-app
    route migration
  - compatibility coverage is mandatory because old hash locators are expected
    to survive temporarily

## Current Status

- Overall traceability status:
  - partially implemented
- Overall execution status:
  - implementation-backed for current route foundation and browser parity
- Layer summary:
  - `UNIT`: partially implemented
  - `INT`: partially implemented
  - `SEC`: planned
  - `AUD`: planned
  - `EDGE`: partially implemented
  - `FRONTEND`: implemented for current route foundation and selected-page subroute support
  - `COMPAT`: partially implemented

## QA Coverage Classification

- Change class:
  - shared platform or cross-feature seam change
  - privileged real-app route migration
  - compatibility-sensitive topology change
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - edge
  - frontend
  - persistence-backed verification where locator truth is stored
  - end-to-end journey
- Additional required checks:
  - canonical-path versus compatibility-alias honesty review
  - discovery/truth alignment review
  - maintained-artifact drift review
- Not required in this slice:
  - dedicated high-volume performance suite unless route resolution becomes
    materially heavy
  - dedicated concurrency suite beyond deterministic alias-resolution checks

## Unit Tests For Individual Capabilities

- Capability: resolve canonical root-admin durable page from a path-backed URL
  Test Case ID: `TC-ROOT-PATH-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAdminShell/`
  Requires Shared Test Helper: no
  Coverage:
  - maps `/root-admin` to `overview`
  - maps `/root-admin/web-app-hierarchy` to the hierarchy suite page
  - maps `/root-admin/users`, `/tenants`, `/tenant-admins`, and `/roles` to
    the correct suite page
  - rejects unknown suite paths honestly

- Capability: resolve supported legacy hash aliases to the correct canonical
  durable page
  Test Case ID: `TC-ROOT-PATH-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAdminShell/`
  Requires Shared Test Helper: no
  Coverage:
  - maps `#overview`, `#web-app-hierarchy`, `#users`, `#tenants`,
    `#tenant-admins`, and `#roles` to the correct canonical page
  - rejects unsupported hash aliases honestly
  - does not let alias handling become the canonical route source

- Capability: derive canonical shell navigation hrefs
  Test Case ID: `TC-ROOT-PATH-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAdminShell/`
  Requires Shared Test Helper: no
  Coverage:
  - top-nav and breadcrumb links use path-backed canonical hrefs for migrated
    suites
  - compatibility aliases are not emitted as the default link target

- Capability: publish canonical path-backed route truth from discovery
  Test Case ID: `TC-ROOT-PATH-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppSurfaceDiscovery/`
  Requires Shared Test Helper: yes
  Coverage:
  - selected root-admin suites are represented with path-backed canonical
    locators
  - compatibility alias behavior is represented explicitly if surfaced
  - discovery output no longer treats hash-only locators as the durable
    canonical destination

- Capability: align curated root-admin locator truth with canonical paths
  Test Case ID: `TC-ROOT-PATH-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - selected root-admin pages can hold path-backed canonical locators
  - invalid or unsupported locator transitions are rejected honestly
  - additive migration posture is preserved

## Integration Tests For Features Working Together

- Flow: direct path entry into each migrated root-admin suite loads the correct
  operator page
  Test Case ID: `TC-ROOT-PATH-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAdminShell/`
  Requires Shared Test Helper: yes
  Features:
  - `rootAdminShell`
  - `rootAuth`
  Coverage:
  - direct path entry works for the listed migrated suites
  - browser refresh preserves the correct durable page
  - unknown suite paths fall back honestly

- Flow: legacy hash aliases still land in the correct canonical suite page
  during migration
  Test Case ID: `TC-ROOT-PATH-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAdminShell/`
  Requires Shared Test Helper: yes
  Features:
  - `rootAdminShell`
  - `rootAuth`
  Coverage:
  - each supported legacy alias resolves correctly
  - the shell continues using canonical path-backed navigation after entry

- Flow: discovery truth and curated topology truth remain aligned on migrated
  root-admin canonical locators
  Test Case ID: `TC-ROOT-PATH-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppSurfaceDiscovery/` and
  `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppSurfaceDiscovery`
  - `webAppHierarchyBuilder`
  Coverage:
  - selected root-admin suites are represented as path-backed canonical routes
    in both seams
  - compatibility posture is explicit rather than hidden

- Flow: shell navigation emits canonical path-backed links after migration
  Test Case ID: `TC-ROOT-PATH-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAdminShell/`
  Requires Shared Test Helper: yes
  Features:
  - `rootAdminShell`
  Coverage:
  - top-nav, breadcrumbs, and context entry links use path-backed canonical
    hrefs
  - emitted links remain permission-aware

## Security Tests

- Capability: path-backed route entry does not bypass current authn/authz
  boundaries
  Test Case ID: `TC-ROOT-PATH-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAdminShell/`
  Coverage:
  - direct path entry to migrated suites still requires valid root-admin
    session behavior for protected data
  - expired session posture remains truthful

- Capability: compatibility alias entry does not create an alternate authority
  path
  Test Case ID: `TC-ROOT-PATH-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAdminShell/`
  Coverage:
  - legacy alias entry does not bypass current protected backend enforcement
  - unsupported aliases do not resolve to unintended protected surfaces

## Audit Tests

- Capability: denied protected actions remain audit-visible after the route
  model changes
  Test Case ID: `TC-ROOT-PATH-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootAdminShell/`
  Coverage:
  - denied protected API calls from migrated suite entry remain audit-visible
  - the route-model migration does not remove current audit coverage

- Capability: topology/discovery mutation or sync actions remain audit-visible
  when the migration touches durable locator truth
  Test Case ID: `TC-ROOT-PATH-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/` and
  `tests/audit/webAppSurfaceDiscovery/`
  Coverage:
  - successful and denied protected locator-truth changes remain audit-visible

## Edge Cases And Negative Tests

- Edge: unknown path-backed suite route
  Test Case ID: `TC-ROOT-PATH-EDGE-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAdminShell/`
  Coverage:
  - unknown routes do not render the wrong suite page
  - shell fallback stays honest

- Edge: trailing slash and normalization behavior
  Test Case ID: `TC-ROOT-PATH-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAdminShell/`
  Coverage:
  - trailing slash or equivalent normalized forms resolve consistently

- Edge: mixed alias-plus-path entry posture during the migration window
  Test Case ID: `TC-ROOT-PATH-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAdminShell/`
  Coverage:
  - the shell remains oriented correctly when users arrive through old aliases
    and then navigate via canonical links

## Frontend And Browser Verification

- Frontend: path-backed route parity for migrated suite pages
  Test Case ID: `TC-ROOT-PATH-FRONTEND-001`
  Recommended Test Layer: `browser-visual`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - `/root-admin`
  - `/root-admin/web-app-hierarchy`
  - `/root-admin/users`
  - `/root-admin/tenants`
  - `/root-admin/tenant-admins`
  - `/root-admin/roles`
  - desktop and representative mobile coverage where required

- Frontend: legacy hash alias compatibility proof
  Test Case ID: `TC-ROOT-PATH-FRONTEND-002`
  Recommended Test Layer: `browser-visual`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Coverage:
  - supported legacy aliases still land on the correct durable page
  - shell navigation switches to canonical path-backed links after entry

## Compatibility And Maintained-Artifact Checks

- Compatibility: docs and maintained examples stop describing hash-only
  root-admin suite routes as canonical
  Test Case ID: `TC-ROOT-PATH-COMPAT-001`
  Recommended Test Layer: `artifact-review`
  Suggested Test Folder: `docs/` maintained-artifact sweep plus targeted audit
  checklist
  Coverage:
  - frontend architecture docs
  - feature docs
  - capability matrices
  - PRD/test-case/journey docs
  - repo-local agent guidance

- Compatibility: future route planning can rely on the durable path grammar
  without inventing new hash islands
  Test Case ID: `TC-ROOT-PATH-COMPAT-002`
  Recommended Test Layer: `artifact-review`
  Suggested Test Folder: `docs/workspace/` planning artifacts
  Coverage:
  - blueprint, PRD, and capability matrix all preserve the same durable route
    model

- Compatibility: nested durable routes expose breadcrumb hierarchy as separate
  nodes
  Test Case ID: `TC-ROOT-PATH-COMPAT-003`
  Recommended Test Layer: `artifact-review`
  Suggested Test Folder: `tests/audit/`
  Coverage:
  - nested root-admin route metadata exposes parent and current breadcrumb
    labels separately
  - visual proof targets separate breadcrumb nodes rather than combined labels
  - maintained route artifacts preserve nested path-backed topology
