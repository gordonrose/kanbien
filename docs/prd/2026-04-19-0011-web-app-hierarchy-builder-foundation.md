# Web App Hierarchy Builder Foundation Specification

## Implementation Status

- Status:
  partially implemented backend foundation slice as of 2026-04-19
- Implemented:
  - durable root-family, module, and page persistence
  - root-only protected routes under `/v1/web-app-hierarchy`
  - module create/update
  - page create/update
  - page move/orphaning
  - resolved hierarchy-tree read
  - planner-selectable hierarchy-node read
  - orphaned-page read
  - explicit-input bootstrap route
  - compatibility blocking for live route-affecting changes
- Not yet implemented:
  - automatic route discovery for bootstrap from the running app
  - downstream `pageShellPlanning` consumption
  - frontend hierarchy editor
  - redirect or alias support for live-route compatibility changes

## Purpose

Define the first backend foundation slice for the `webAppHierarchyBuilder`
feature.

This slice introduces a durable platform-owned hierarchy for the web app so the
system can stop depending on ad hoc or inferred page structure spread across
routes, planners, and implementation notes.

It provides the backend capabilities required for:

- create and update of top-level user-facing modules
- create and update of durable page nodes
- explicit page movement between module-root, child-page, and orphaned
  placement states
- resolved hierarchy-tree reads
- planner-facing selectable hierarchy reads
- explicit orphan review
- bootstrap from explicitly supplied observed browser-navigable pages that
  already exist in the app

It also establishes:

- a durable root-family layer for top-level app-entry families
- a durable strict general tree for page placement
- separation between page lifecycle state and page placement state
- canonical route-segment storage with derived full-route generation
- automatic descendant route refresh when placement or route-segment changes
  affect a branch
- a root-operated hierarchy source of truth that later planner, route, and
  frontend-generation loops will consume

---

## Scope

This phase includes:

- a new `webAppHierarchyBuilder` feature under `src/features/`
- durable storage for:
  - top-level web app root families
  - top-level web app modules
  - page nodes
- root-only backend routes under `/v1/web-app-hierarchy`
- module create and update
- page create and update
- page move and orphaning
- resolved hierarchy-tree read
- planner-selectable hierarchy-node read
- orphaned-page read
- bootstrap from explicitly supplied current app pages that can be navigated to
  in the browser
- compatibility-sensitive handling for route-affecting moves and
  route-segment edits
- exported read seams for downstream consumers such as `pageShellPlanning`

This phase does **not** include:

- frontend implementation for editing the hierarchy
- new unguided planner UI behavior
- route alias or redirect management
- page destroy or hard-delete behavior
- tenant-facing hierarchy editing
- tenant-specific visibility or approval workflows
- automatic code generation for routes or frontend files
- page-shell planning itself
- template-specific frontend planning

Those later concerns should build on this durable hierarchy seam rather than be
collapsed into it.

---

## Core Concepts

### Web app root family

A `webAppRootFamily` is the durable top-level app-entry family in the current
web app hierarchy.

Current approved families:

- `root-admin` at `/root-admin`
- `login` at `/login`
- `design-system` at `/design-system`

These behave like root directories in the app experience and should not be
flattened into ordinary business modules.

### Web app module

A `webAppModule` is the durable business-facing module in the app hierarchy.

Each module belongs to exactly one root family.

It is intentionally user-facing rather than tied 1:1 to a backend feature
folder.

Each module is expected to have at least:

- `rootFamilyId`
- `webAppModuleId`
- `moduleKey`
- `displayLabel`
- `status`
- `sortOrder`
- standard lifecycle timestamps

### Web app page

A `webAppPage` is the durable page node entity inside the hierarchy.

Each page is expected to have at least:

- `rootFamilyId`
- `webAppPageId`
- `webAppModuleId`
- optional `parentPageId`
- `placementType`
- `pageKey`
- `displayLabel`
- `routeSegment`
- derived `resolvedFullRoutePath`
- `status`
- `sortOrder`
- optional `bootstrapSource`
- standard lifecycle timestamps

### General tree

The hierarchy must be stored as a strict general tree rather than as a fixed
three-level schema.

Rules:

- every page belongs to exactly one root family at a time
- every page belongs to exactly one module at a time
- a page may have zero or one parent page
- a page may not appear in more than one place
- cycles are not allowed

The initial product surface may still focus on top-level, second-level, and
child-page placement, but storage must not hard-code that limitation.

### Placement state versus lifecycle state

Page placement is separate from page lifecycle.

Approved lifecycle states in this phase:

- `draft`
- `review`
- `live`
- `inactive`

Approved placement states in this phase:

- `module-root`
- `child-page`
- `orphaned`

This means a page may be `live` and `child-page`, or `review` and `orphaned`,
without mixing those concepts into one overloaded status field.

### Orphaned page

An orphaned page is a durable page record that no longer sits in the active
tree but has not been destroyed.

Rules:

- orphaning is an explicit placement change
- orphaning clears the current parent-page link
- orphaning must not destroy the page record
- orphaned pages are exposed through an explicit orphan-review capability
- later move capabilities may place the page back into the active tree

### Canonical route truth

`routeSegment` is the canonical route field stored on the page entity.

`resolvedFullRoutePath` is derived from root family, ancestry, and route
segments and must not become an independent editable source of truth in this
phase.

Why:

- page identity should not be a mutable full path
- route generation should follow durable hierarchy placement
- moves and route-segment edits should automatically refresh descendant routes

### Bootstrap honesty

Bootstrap must seed the durable hierarchy only from pages that already exist
and can actually be navigated to in the browser.

In the current implementation, that honesty rule is enforced by requiring the
caller to supply the observed navigable pages explicitly to the bootstrap
route. The backend does not yet auto-discover those routes from the running app
on its own.

This includes the currently approved bootstrap scope:

- the `root-admin` root family at `/root-admin`
- the `login` root family at `/login`
- the `design-system` root family at `/design-system`

Future tenant-side experience work will build on this model later rather than
being collapsed into this first root-family set.

This phase must not invent placeholder pages just to make the tree look
complete.

### Compatibility-sensitive hierarchy changes

Hierarchy moves and route-segment edits can change resolved routes for the page
being edited and for descendant pages.

Because backwards compatibility is required by default:

- route-affecting changes for `live` pages must be treated as compatibility-
  sensitive operations
- the first slice may block some moves or route changes when no approved
  compatibility path exists
- later route-alias or redirect support may relax those restrictions, but this
  phase must not silently break route truth

---

## Why This Slice Exists Before Later Frontend Planning

The repo already has downstream planning work such as `pageShellPlanning`, but
that planning depends on honest, durable hierarchy truth.

Without this slice:

- planners risk maintaining separate hierarchy catalogs
- route generation cannot rely on one durable source of truth
- frontend page-structure generation remains coupled to local implementation
  assumptions
- moving pages safely becomes ambiguous and hard to audit

This slice exists so later planning and generation work can consume one durable
root-family-aware hierarchy seam instead of recreating hierarchy meaning
feature by feature.

---

## Feature Name

Recommended feature folder:

`src/features/webAppHierarchyBuilder/`

This feature is separate from:

- `src/features/pageShellPlanning/`
- future route-generation or frontend-generation features
- shared root auth and root authorization infrastructure

`webAppHierarchyBuilder` owns durable hierarchy truth and exported hierarchy
reads.

Downstream features consume that truth through narrow public seams rather than
writing hierarchy rows directly.

---

## Trust Boundary And Privileged Actor

### Trust boundary

This phase establishes a privileged root-operator administrative boundary
around hierarchy truth.

- unauthenticated callers may not access hierarchy routes
- authenticated root users may access hierarchy routes only when they hold the
  required hierarchy capability
- the initial granting role is `RootUserAdmin`

This feature does not yet introduce tenant-scoped hierarchy actors.

### Future compatibility direction

Even though the first slice is root-scoped, row semantics and exported seams
should remain compatible with a later tenant-visible read or edit posture.

That means this phase should not:

- encode root-only assumptions into durable entity identity
- collapse future approval or visibility needs into one hard-coded root check
- make downstream planners depend on local root-only response quirks

---

## Capability Matrix

| Capability | Purpose | Request | Response | Rules | Persistence | Errors | Tests |
|---|---|---|---|---|---|---|---|
| `createWebAppModule` | Create a durable top-level module | stable module fields | created module summary | module id is stable; display name normalized for deterministic validation; system-managed fields rejected | insert module row | duplicate id/name, invalid input | valid create, duplicate rejection, ordering, authz |
| `updateWebAppModule` | Update module metadata lifecycle and ordering | exact module id plus changed fields | updated module summary | module id remains immutable; `updatedAt` refreshes; lifecycle remains separate from page placement | update module row | not found, invalid input, duplicate normalized name | valid update, immutable id, lifecycle update |
| `createWebAppPage` | Create a durable page node | page fields plus placement | created page summary | strict-tree rules apply; placement must be consistent; routeSegment is canonical; derived full route is server-managed | insert page row | invalid placement, duplicate id, sibling route collision | valid create, placement validation, route derivation |
| `updateWebAppPage` | Update page metadata lifecycle route segment and ordering | exact page id plus changed fields | updated page summary | placement changes are out of scope here; route changes refresh descendant resolved paths; lifecycle and placement stay separate | update page row and affected derived route values | not found, invalid input, collision, compatibility block | valid update, route refresh, blocked compatibility change |
| `moveWebAppPage` | Reparent move or orphan a page branch | exact page id plus target placement | moved page summary plus impact summary | no cycles; strict tree preserved; descendant route refresh required; live-route compatibility checks apply | update page branch placement and derived route values | cycle, collision, missing target, compatibility block | valid reparent, orphaning, cycle rejection, descendant refresh |
| `getResolvedWebAppHierarchyTree` | Read durable hierarchy truth as an ordered tree | optional exact filters | resolved ordered tree | no invented placeholders; deterministic root-family-aware order; suitable for downstream generation | read root-family, module, and page rows | invalid query, authz | tree read, ordering, filters |
| `listPlannerSelectableHierarchyNodes` | Expose planner-facing hierarchy values | optional exact filters | planner-oriented hierarchy options | planner reads come from durable hierarchy truth rather than a separate hand-maintained catalog | read projected hierarchy rows | invalid query, authz | planner projection, filter behavior, no stale choices |
| `listOrphanedWebAppPages` | Expose orphaned durable pages explicitly | optional exact filters | orphan-page list | orphan review is explicit and separate from active tree reads | read orphaned page rows | invalid query, authz | orphan visibility, filters, no silent deletion |
| `bootstrapWebAppHierarchyFromCurrentNavigablePages` | Seed durable hierarchy from current real app pages | explicit bootstrap scope | bootstrap summary | bootstrap only from real browser-navigable pages; no invented records; existing rows remain durable; conflicts must be explicit | insert missing root-family, module, and page rows plus bootstrap markers | invalid scope, conflicts, authz | honest bootstrap, duplicate handling, no invented pages |

---

## API Endpoints

Protected backend routes:

- `POST /v1/web-app-hierarchy/modules`
- `PATCH /v1/web-app-hierarchy/modules/:webAppModuleId`
- `POST /v1/web-app-hierarchy/pages`
- `PATCH /v1/web-app-hierarchy/pages/:webAppPageId`
- `POST /v1/web-app-hierarchy/pages/:webAppPageId/move`
- `GET /v1/web-app-hierarchy/tree`
- `GET /v1/web-app-hierarchy/planner-nodes`
- `GET /v1/web-app-hierarchy/orphaned-pages`
- `POST /v1/web-app-hierarchy/bootstrap`

Current boundary rules:

- all routes require a valid root-user authenticated session
- all routes are restricted to `RootUserAdmin` in the first slice through
  hierarchy capability gates
- all routes should use shared authenticated route protections unless a later
  explicit decision changes that

---

## Authorization Mapping Rules

The governing root authz capabilities for this slice are expected to include:

- `web-app-hierarchy.create-module`
- `web-app-hierarchy.update-module`
- `web-app-hierarchy.create-page`
- `web-app-hierarchy.update-page`
- `web-app-hierarchy.move-page`
- `web-app-hierarchy.read-tree`
- `web-app-hierarchy.read-planner-options`
- `web-app-hierarchy.list-orphans`
- `web-app-hierarchy.bootstrap`

Current root boundary expectations:

- `RootUserAdmin` is the initial granting role for all hierarchy capabilities
- bootstrap remains explicit and privileged rather than bundled into normal
  create or update behavior
- orphan visibility remains explicit rather than silently folded into normal
  tree reads

This PRD should remain consistent with:

- [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
- [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)

---

## Data Rules

- module ids and page ids must be stable machine identifiers
- root-family ids and base paths must be stable machine identifiers and route
  anchors
- display-name normalization should be explicit when deterministic search or
  uniqueness uses normalized values
- empty strings must be rejected, not silently converted to null
- client input must not set system-managed fields, including:
  - `createdAt`
  - `updatedAt`
  - derived `resolvedFullRoutePath`
  - internal audit or bootstrap metadata
- requests that supply unexpected or system-managed fields should be rejected
  explicitly with the repo-standard invalid-request error contract
- `routeSegment` is canonical on the page entity
- `resolvedFullRoutePath` is derived and refreshed server-side
- every successful module or page update must refresh `updatedAt`
- page placement and lifecycle must remain separate dimensions
- normal active-tree reads may exclude inactive or orphaned rows by default only
  when the capability contract says so; explicit reads must be honest about
  what is included
- exact route params must remain required
- representative invalid-request, not-found, authz, cycle, collision, and
  compatibility-block errors must return stable `code`, `message`, and
  relevant `details`

---

## Persistence Expectations

This slice should introduce durable storage for at least:

- web app modules
- web app root families
- web app pages

The storage model must preserve:

- stable module identity
- stable root-family identity
- stable page identity
- one-root-family ownership per module and per page
- one-module ownership per page
- optional single-parent self-reference for pages
- explicit placement type
- explicit lifecycle status
- deterministic sibling ordering
- canonical routeSegment storage
- automatically refreshed derived full-route values
- room for later support of:
  - tenant-visible readers or editors
  - route aliases or redirects
  - stronger approval workflows
  - richer planner and generation consumers

Recommended persistence behavior in this phase:

- indexes on module id, parent id, placement type, status, sort order, and
  resolved route reads
- uniqueness rules preventing sibling route collisions
- consistency rules tying placement type to parent presence
- cycle prevention at service and repository validation layers

---

## Security And Audit Expectations

This slice manages privileged platform information architecture truth.

Minimum expectations:

- shared root authentication must run before hierarchy routes
- shared root authorization must enforce explicit hierarchy capabilities
- create, update, move, orphan, and bootstrap operations should be auditable
- denied attempts against privileged routes should be auditable where the
  platform treats them as security-relevant
- bootstrap and move actions must not silently destroy existing durable rows
- planner-facing reads must not widen into unauthenticated or tenant visibility
  by accident

---

## Performance Expectations

This phase should include basic performance-safe structure rather than waiting
for later optimization.

Minimum expectations:

- deterministic ordering for modules and siblings
- indexed parent and module lookups for tree reads
- indexed placement and status filters for orphan review and planner reads
- automatic descendant route refresh implemented deterministically for one moved
  branch

This phase does **not** need to include:

- materialized read models
- route-generation code
- denormalized path storage beyond what is needed for practical tree reads

Those later optimizations can be layered in if real usage shows the need.

---

## Cross-Feature Rules

`webAppHierarchyBuilder` may depend on shared root auth and root authorization
only through approved platform seams.

`pageShellPlanning` and later planner-oriented features should consume
hierarchy truth only through exported `webAppHierarchyBuilder` reads rather
than maintaining separate hierarchy catalogs.

Future route-generation or frontend-generation work should consume resolved
hierarchy reads rather than reaching into `webAppHierarchyBuilder/persistence/*`
directly.

No downstream feature should mutate hierarchy rows except through explicit
`webAppHierarchyBuilder` capabilities.

---

## Compatibility And Migration Direction

This slice must stay compatible with:

- the repo default of backwards compatibility
- the new source-independent entity definitions for `webAppRootFamily`,
  `webAppModule`, and `webAppPage`
- later planner tooling that consumes hierarchy as platform truth
- later route-generation and frontend-structure generation flows
- later tenant-visible read or edit capabilities

This slice must **not**:

- treat full route path as the canonical editable identifier
- silently break live routes during page moves or route-segment changes
- destroy pages as part of hierarchy removal
- allow downstream planners to fork hierarchy truth into local catalogs
- invent hierarchy pages during bootstrap that are not real current
  browser-navigable surfaces

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the backend supports the documented protected
   `/v1/web-app-hierarchy` routes
2. modules and pages are stored as durable separate entities
3. page placement is modeled as a strict general tree without multi-parent
   placement or cycles
4. page lifecycle and page placement are treated as separate dimensions
5. routeSegment is canonical and derived full-route values are refreshed
   automatically after route-affecting edits
6. moving a page branch updates descendant route truth deterministically
7. orphaning preserves durable pages rather than destroying them
8. planner-facing hierarchy reads come from this feature rather than a
   separate hierarchy catalog
9. bootstrap creates records only from real current browser-navigable pages
10. bootstrap does not invent placeholder pages
11. route-affecting changes for live pages are treated as compatibility-
    sensitive operations rather than silent edits
12. shared root-session auth and capability gates protect the feature routes

---

## Risks And Open Questions

- whether some live-route compatibility rules should differ across root-admin,
  public-auth, tenant-side, and design-system surfaces
- whether route aliases or redirects are required before certain live-page
  moves should be allowed
- whether module ownership metadata needs to become a stronger durable contract
  than the current optional first-pass business-owner field
- how much bootstrap-review metadata is worth persisting in the first slice
  without overcomplicating the model
- whether inactive pages should remain visible to all planner-oriented reads or
  only through explicit filters

---

## Deferred Follow-On Work

This PRD intentionally defers:

- tenant-visible hierarchy readers and editors
- page destroy and retention policy
- redirects and route aliases
- hierarchy-editing frontend UI
- approval workflows beyond root-only administration
- downstream route-generation implementation
- downstream frontend-structure generation
- richer planner workflows beyond the hierarchy read seam

These should be future feature loops built on top of this durable hierarchy
foundation rather than reasons to overbuild the first slice.
