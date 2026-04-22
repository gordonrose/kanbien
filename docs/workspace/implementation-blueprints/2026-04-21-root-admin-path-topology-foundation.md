# Root Admin Path Topology Foundation Blueprint

## Summary

- Feature:
  root-admin durable route topology foundation across current operator suites
- Capability:
  establish a path-backed durable route model for selected root-admin suites,
  keep compatibility aliases for current hash entry points, and align repo
  structure plus maintained artifacts around the new topology
- Scope:
  first migration-planning slice for:
  - `/root-admin/web-app-hierarchy`
  - `/root-admin/users`
  - `/root-admin/tenants`
  - `/root-admin/tenant-admins`
  - `/root-admin/roles`
  - existing path-backed `/design-system`
- Phase:
  implemented foundation slice with follow-on route-promotion work still open

## Inputs

- Capability matrix reference:
  [2026-04-21-root-admin-path-topology-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-21-root-admin-path-topology-foundation-capability-matrix-first-draft.csv)
- PRD:
  [2026-04-21-0019-root-admin-path-topology-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-21-0019-root-admin-path-topology-foundation.md)
- ADR(s):
  - [0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md](/home/gordon/kanbien/docs/architecture/adr/0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md)
  - [0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md](/home/gordon/kanbien/docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md)
  - [0025-adopt-a-security-first-page-state-replay-model.md](/home/gordon/kanbien/docs/architecture/adr/0025-adopt-a-security-first-page-state-replay-model.md)
  - [0026-separate-durable-page-settings-from-curated-frontend-topology.md](/home/gordon/kanbien/docs/architecture/adr/0026-separate-durable-page-settings-from-curated-frontend-topology.md)
  - [0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md](/home/gordon/kanbien/docs/architecture/adr/0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md)
- PRD test-case doc:
  [2026-04-21-0019-root-admin-path-topology-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-21-0019-root-admin-path-topology-foundation-test-cases.md)
- Journey inventory:
  [2026-04-21-0019-root-admin-path-topology-foundation-journey-inventory.md](/home/gordon/kanbien/docs/prd/journey_inventories/2026-04-21-0019-root-admin-path-topology-foundation-journey-inventory.md)
- QA coverage matrix classification:
  shared platform or cross-feature seam change plus privileged real-app route
  migration
- QA release-gate expectation:
  truthful route entry, honest alias compatibility, no broken operator entry
  links, and deterministic behavior for path-backed durable places versus local
  journey state

## Scope Confirmation

This blueprint is for one coherent platform migration foundation:

- promote selected current root-admin shell pages into path-backed durable
  routes
- keep current `#` entry points working temporarily as compatibility aliases
- establish durable route grammar for future suites rather than solving only
  `web-app-hierarchy`
- preserve the distinction between:
  - durable route topology
  - page settings truth
  - discovered implementation truth
  - local journey and UI posture
- align repo planning artifacts, docs, and agent guidance around the new model

This blueprint does **not** include:

- full implementation of all future suites such as payroll, CRM, rostering, or
  annual leave
- immediate removal of all hash-backed entry points
- promotion of every current tab, drawer, or workflow step into a durable route
- design-system visual redesign work beyond what is required for route-host
  parity
- tenant-scoped app route migration
- stateless token or auth-model redesign

## Durable Route Model

### Initial Durable Pages

The first path-backed durable suite pages should be:

- `/root-admin`
- `/root-admin/web-app-hierarchy`
- `/root-admin/users`
- `/root-admin/tenants`
- `/root-admin/tenant-admins`
- `/root-admin/roles`
- `/design-system`

### Initial Durable Subroute Direction

The migration should keep deeper route promotion conservative in the first
implementation pass, but the durable grammar should allow later expansion such
as:

- `/root-admin/web-app-hierarchy/pages/:pageKey`
- `/root-admin/web-app-hierarchy/pages/:pageKey/template`
- `/root-admin/web-app-hierarchy/pages/:pageKey/analytics`
- `/root-admin/users/:rootUserId`
- `/root-admin/tenants/:tenantId`
- `/root-admin/tenant-admins/:tenantAdminId`
- `/root-admin/roles/:roleKey`

Only stable product places should become durable subroutes.

### Route Classification Defaults

- `durable-page`
  suite landing pages and stable operator destinations
- `durable-subroute`
  stable child areas with meaningful deep-linking, support, analytics,
  permission, or compatibility expectations
- `journey-state`
  wizard steps, draft workflow branches, temporary compare modes, and transient
  nested screens that do not need durable route identity
- `ui-state`
  drawers, modal posture, sort order, focus target, panel width, and similar
  presentational state
- `support-only`
  helper downloads, diagnostics, and non-normal user-facing routes

### Compatibility Alias Posture

During migration, the following legacy aliases should continue to resolve
honestly:

- `/root-admin#overview` -> `/root-admin`
- `/root-admin#web-app-hierarchy` -> `/root-admin/web-app-hierarchy`
- `/root-admin#users` -> `/root-admin/users`
- `/root-admin#tenants` -> `/root-admin/tenants`
- `/root-admin#tenant-admins` -> `/root-admin/tenant-admins`
- `/root-admin#roles` -> `/root-admin/roles`

Alias handling should be treated as an explicit compatibility seam, not a
permanent second topology model.

## Frontend Plan

- Route / surface:
  migrate `rootAdminShell` from one hash-state page host toward a shell that
  resolves durable path-backed suite destinations while preserving current
  same-origin auth and shell posture
- UI states:
  - path-backed suite landing state
  - legacy hash alias landing state
  - direct path entry refresh
  - unknown route fallback
  - compatibility warning or transparent redirect posture when needed
  - shell-local drawer and panel state that remains off-route
- Permission visibility behavior:
  suite links should remain capability-aware, but path entry must still defer
  authority to backend authn/authz and truthful denied states
- Session / expiry behavior:
  preserve the existing root-admin browser session, expiry overlay, and helper
  download posture
- Browser security considerations:
  preserve same-origin shell posture and keep ADR `0025` replay rules intact;
  route params and path selection must not become authority for tenant, role,
  or entity access

### Frontend Ownership Boundary

Expected frontend ownership split:

- `rootAdminShell`
  owns shell composition, route resolution, and suite-host integration
- suite controllers
  own route-local data loading and journey-local state inside each durable page
- design-system shared seams
  continue to own governed styling, render, and controller behavior where the
  route consumes governed families

### Suggested Frontend File Impact

Likely files to change or split:

- `src/frontend/rootAdminShell/index.html`
- `src/frontend/rootAdminShell/router.ts`
- `src/frontend/rootAdminShell/assets/app.mjs`
- `src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs`
- `src/frontend/designSystem/assets/rootUsersListWorkspace.mjs`
- `src/frontend/rootAdminShell/discovery.ts`
- `src/frontend/designSystem/router.ts`

Likely new frontend seams:

- path-based route resolution helpers for root-admin durable pages
- compatibility alias resolver for current `#` entry points
- suite-local route metadata registry instead of hard-coded shell-page-only
  assumptions

## Backend Plan

- Route(s):
  keep the same backend business APIs for now where possible, but add or extend
  route-topology and discovery seams so path-backed root-admin destinations are
  first-class discovered and curated truth
- Request/response/error contract:
  - topology and discovery contracts must represent path-backed root-admin
    routes honestly
  - alias handling must not masquerade as first-class durable canonical truth
  - compatibility-sensitive route moves must be classified explicitly
- Feature-local files expected:
  likely extend:
  - `src/features/webAppSurfaceDiscovery/contract/*`
  - `src/features/webAppSurfaceDiscovery/domain/*`
  - `src/features/webAppHierarchyBuilder/contract/*`
  - `src/features/webAppHierarchyBuilder/domain/*`
  - `src/features/webAppPageSettings/domain/*`
  - `src/routes/v1/index.ts` only if capability mounting changes are required
- Cross-feature seams:
  - `webAppHierarchyBuilder` remains authoritative for durable topology truth
  - `webAppPageSettings` remains a sibling page-settings truth layer and must
    not absorb route topology ownership
  - `webAppSurfaceDiscovery` remains authoritative for discovered runtime truth
  - do not let root-admin shell implementation become the only place route
    truth is inferred
- Authorization enforcement point:
  preserve current root-authenticated, root-capability-gated backend
  enforcement; route model changes must not weaken denied-path handling

### Capability And Permission Refactor Direction

Before implementation, create a capability matrix that confirms whether the
current capability keys remain stable or need route-family-aligned
reclassification.

Default direction:

- keep current business capability ownership where route changes do not alter
  the business seam
- introduce route-family-aware documentation and grouping where that improves
  operator comprehension
- avoid renaming stable backend capability keys solely to match new path
  strings unless an explicit compatibility strategy is approved

## Persistence Plan

- Entities / rows affected:
  likely no new core business entities are required for the first route-model
  migration, but existing topology and discovery rows may need additive locator
  posture updates
- Migration changes:
  additive only; do not rewrite or drop existing locator truth without a
  compatibility plan
- Index or uniqueness changes:
  verify canonical locator uniqueness and normalized locator-key handling for
  path-backed root-admin entries
- Search/filter implications:
  route-model changes should not introduce fuzzy or broad search changes in v1
- Compatibility notes:
  path-backed root-admin canonical locators and legacy hash aliases must
  coexist honestly during migration; do not silently reinterpret existing saved
  locator truth without explicit compatibility handling

## Verification Plan

- Journey tier / workflow scope:
  `Tier 0` direct entry to each migrated suite page; `Tier 1` alias and
  refresh-path compatibility; `Tier 1` denied and expired-session route entry
- Unit:
  route-resolution helpers, alias normalization, shell page-key derivation,
  discovery output classification
- Integration:
  `webAppSurfaceDiscovery`, `webAppHierarchyBuilder`, and page-settings
  projections for path-backed root-admin routes
- Security:
  path entry does not bypass auth, authz, or cross-tenant deny posture
- Audit:
  current protected operator actions remain audit-visible despite route-model
  change
- Edge:
  unknown route fallback, trailing slash normalization, direct refresh, and
  mixed alias/path linking
- Frontend:
  browser and visual coverage for each migrated suite destination plus at least
  one alias-entry proof per route
- Persistence-backed:
  locator canonicalization and compatibility reads where persistence truth is
  involved
- End-to-end:
  meaningful operator route-entry journeys under root-admin
- Concurrency / idempotency:
  not required beyond deterministic route-resolution behavior in v1
- Performance:
  ensure route resolution and shell bootstrap do not add meaningful overhead
- Resilience / failure-injection:
  route entry under expired session and failed initial data loads
- Compatibility / contract:
  explicit proof that legacy `#` links still land in the correct durable page
  during the migration window
- Accessibility:
  browser back/forward navigation, focus restoration, breadcrumb truth, and
  link semantics for path-backed suite entry
- Structured exploratory QA:
  recommended because this changes a privileged operator shell entry model
- QA checklist:
  recommended before retiring any hash alias
- Curated test-run summary:
  recommended because this is a platform topology migration
- Waiver / quarantine expectation:
  none expected; if a suite cannot migrate honestly, leave it on the legacy
  alias instead of pretending it is path-backed

## Documentation Plan

- PRD updates:
  create a dedicated PRD for the root-admin path topology foundation migration
- PRD test-case updates:
  create a dedicated PRD-derived test-case doc for route-model migration and
  compatibility coverage
- Feature docs:
  refresh:
  - `docs/featureDocs/rootAuth-feature.md`
  - `docs/featureDocs/web-app-hierarchy-builder-feature.md`
  - any root-users, tenants, tenant-admins, and roles feature docs whose route
    examples currently assume `#`
- API contract docs:
  refresh source-independent route and locator docs for any maintained
  contracts that describe root-admin operator entry or canonical locators
- OpenAPI:
  review whether route examples, descriptions, or operator workflow notes need
  refresh even if the protected backend endpoints themselves do not move
- Postman:
  refresh maintained collections and examples that reference root-admin route
  entry or canonical locator examples
- Data dictionary:
  review locator-related entries such as:
  - `docs/data-dictionary/web-app-page-locator.md`
  - `docs/data-dictionary/discovered-web-app-surface.md`
  - `docs/data-dictionary/web-app-page.md`
- Architecture map:
  refresh frontend topology and route-family status where current wording still
  describes root-admin as primarily hash-backed
- Standards platform-status snapshots:
  review current-state wording under `docs/standards/platform-status/` if the
  migration changes the platform's frontend governance evidence story
- Reconstruction questionnaire:
  review whether rebuild-from-spec docs need updated questions about path-backed
  versus hash-backed route families
- Bootstrap and helper docs:
  refresh root-admin helper and operator runbook docs where entry URL examples
  change
- Maintained-artifacts sweep:
  review and refresh older docs whose truth changes, including:
  - existing implementation blueprints for root-admin hierarchy and page
    settings
  - current retrospectives and issue reconciliations that reference
    `/root-admin#...`
  - capability matrices that describe the current operator route shape
  - frontend architecture current-state docs
  - repo-local skill instructions and AGENTS guidance that assume hash-backed
    root-admin destinations
- Runbook:
  refresh browser-auth and support-entry runbooks that tell operators where to
  enter root-admin
- Privacy note:
  review route and replay documentation for continued compliance with ADR `0025`
- Standards review:
  required because this is a shared platform seam change
- Repo health review:
  recommended after the first migrated suites land to detect drift between
  topology truth, discovery truth, docs, and agent guidance

## Codex And Agent Guidance Plan

Before or alongside implementation, update repo-local AI guidance so future
work builds on the durable topology rather than reintroducing shell-page-only
assumptions.

Review and update:

- `AGENTS.md`
  route-model examples, topology guardrails, and migration compatibility rules
- relevant repo-local skills under `.codex/skills/`
  especially:
  - `frontend-topology-governor`
  - `frontend-architecture-maintainer`
  - `implementation-blueprint-maintainer`
  - `issue-reconciliation-maintainer`
  - any frontend audit or design-system skills that reference root-admin route
    families
- any maintained agent-routing docs or architecture notes that classify current
  root-admin routes

Default agent guidance changes should state:

- root-admin suites are moving toward path-backed durable pages
- hash entry points are compatibility aliases during migration, not enduring
  canonical truth
- nested workflow and UI posture should not be promoted into durable routes by
  default
- future suites should reuse the new route grammar instead of creating new hash
  islands

## Completion Guardrails

- Blocking QA outcomes:
  no broken direct entry to migrated suites, no broken compatibility aliases,
  no stale docs that still claim canonical root-admin suite entry is hash-only
- Explicitly deferred verification layers and rationale:
  full future-suite rollout is intentionally deferred; this foundation defines
  the reusable model first
- Expected release-gate residual risk statement:
  until legacy aliases are retired, the platform will temporarily support both
  canonical path-backed routes and compatibility hash entry points; the risk is
  manageable only if docs, discovery truth, and tests clearly distinguish the
  two
