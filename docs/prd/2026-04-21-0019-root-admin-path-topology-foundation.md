# Root Admin Path Topology Foundation Specification

## Implementation Status

- Status:
  planned topology foundation as of 2026-04-21
- Implemented already in related foundations:
  - same-origin `rootAdminShell` served at `/root-admin`
  - hash-backed root-admin shell states such as `/root-admin#users` and
    `/root-admin#web-app-hierarchy`
  - durable curated hierarchy truth in `webAppHierarchyBuilder`
  - durable discovered route and structure truth in `webAppSurfaceDiscovery`
  - governed path-backed `design-system` family
- Not yet implemented in this slice:
  - path-backed durable suite routes for selected root-admin operator surfaces
  - explicit compatibility alias handling from legacy hash entry points to new
    path-backed canonical routes
  - durable route grammar for future root-admin suites
  - maintained-artifact alignment around path-backed root-admin topology

## Purpose

Define the first controlled root-admin route-model migration so the platform
stops treating durable operator destinations as shell-local hash states by
default.

The platform can already:

- serve one authenticated root-admin browser shell
- deep-link to shell states through hash locators
- model durable curated hierarchy truth separately from discovered truth
- govern public and design-system path-backed routes

What it still cannot do honestly is:

- treat selected root-admin suites as path-backed durable places
- support future complex suites such as payroll or CRM without multiplying
  hash-island route models
- distinguish clearly between:
  - durable route topology
  - local journey state
  - UI posture
  - compatibility aliases
- keep docs, discovery truth, and agent guidance aligned around a sustainable
  route model

This slice introduces the first durable path-backed root-admin topology
foundation and defines the compatibility window for the current hash posture.

It establishes:

- a path-backed canonical route for selected current root-admin suites
- explicit temporary compatibility aliases from `#` entry points
- a reusable route grammar for future suites and subroutes
- a maintained-artifact migration plan for docs, capability matrices, test
  cases, and agent guidance

---

## Scope

This phase includes:

- path-backed canonical routes for:
  - `/root-admin`
  - `/root-admin/web-app-hierarchy`
  - `/root-admin/users`
  - `/root-admin/tenants`
  - `/root-admin/tenant-admins`
  - `/root-admin/roles`
- continued support for legacy compatibility aliases:
  - `/root-admin#overview`
  - `/root-admin#web-app-hierarchy`
  - `/root-admin#users`
  - `/root-admin#tenants`
  - `/root-admin#tenant-admins`
  - `/root-admin#roles`
- root-admin shell route resolution that understands path-backed canonical
  suite entry
- discovery and topology truth updates so canonical root-admin locators are
  represented honestly
- documentation and agent-guidance updates required by the route-model change

This phase does **not** include:

- payroll, annual leave, rostering, or CRM implementation work
- immediate removal of the old hash aliases
- promotion of every existing nested screen or tab into a durable route
- tenant-scoped app-family route migration
- auth/session model redesign
- broad business-capability renaming only to mirror new path strings

---

## Core Concepts

### Canonical root-admin route

The canonical route is the durable path-backed URL that should appear in:

- discovery truth
- curated topology truth
- breadcrumbs and shell navigation
- documentation and support references
- future route planning artifacts

For this slice, selected root-admin suites gain path-backed canonical routes.

### Compatibility alias

A compatibility alias is a legacy root-admin hash entry point that continues to
land the user in the correct durable page during migration.

For this phase:

- aliases remain supported temporarily
- aliases are not canonical truth
- aliases must be documented honestly as compatibility behavior

### Durable page

A durable page is a stable operator destination that deserves:

- direct entry
- bookmarking
- QA and support deep-linking
- compatibility protection
- explicit route ownership in curated topology

For this slice, the root-admin suite landing pages listed in scope are durable
pages.

### Durable subroute

A durable subroute is a stable child address inside a larger suite that still
deserves direct linking and compatibility protection.

Examples that may be promoted later:

- `/root-admin/web-app-hierarchy/pages/:pageKey`
- `/root-admin/web-app-hierarchy/pages/:pageKey/template`
- `/root-admin/web-app-hierarchy/pages/:pageKey/analytics`
- `/root-admin/users/:rootUserId`
- `/root-admin/tenants/:tenantId`

This slice defines the grammar but does not require full implementation of all
such subroutes yet.

### Journey state and UI state

These remain feature-local by default.

Examples:

- active drawer posture
- unsaved filter state
- local compare mode
- tab emphasis that is not a durable product place

This slice must not flatten those states into fake durable routes.

---

## Recommended Route Model

### Canonical durable pages

The platform should treat these as path-backed durable pages:

- `/root-admin`
- `/root-admin/web-app-hierarchy`
- `/root-admin/users`
- `/root-admin/tenants`
- `/root-admin/tenant-admins`
- `/root-admin/roles`
- existing path-backed `/design-system`

### Compatibility aliases

During the migration window, these aliases should resolve to the canonical
durable pages:

- `/root-admin#overview` -> `/root-admin`
- `/root-admin#web-app-hierarchy` -> `/root-admin/web-app-hierarchy`
- `/root-admin#users` -> `/root-admin/users`
- `/root-admin#tenants` -> `/root-admin/tenants`
- `/root-admin#tenant-admins` -> `/root-admin/tenant-admins`
- `/root-admin#roles` -> `/root-admin/roles`

### Future durable grammar

Future root-admin suites should reuse this route grammar rather than inventing
new hash islands:

- `/root-admin/<suite>`
- `/root-admin/<suite>/<durable-subroute>`
- `/root-admin/<suite>/<entity-or-journey-anchor>`

---

## Functional Requirements

### Root-admin shell route resolution

The shell must:

- resolve the current durable page from the path-backed URL first
- resolve a legacy hash alias when present
- keep shell-local UI posture outside the durable route model
- render the correct suite page after direct path entry and browser refresh

### Compatibility handling

The migration must:

- support the listed legacy aliases during the compatibility window
- keep alias handling explicit and deterministic
- avoid treating alias locators as canonical topology truth
- provide a clear path for later alias retirement

### Discovery and topology truth

The platform must:

- represent selected root-admin suites as path-backed canonical locators in
  discovery truth
- keep curated topology truth aligned with that canonical posture
- classify the hash-based legacy entries as compatibility behavior rather than
  stable first-class route identity

### Shell navigation and breadcrumbs

The shell should:

- generate canonical path-backed links for migrated suites
- keep breadcrumb and top-level suite links aligned with the canonical routes
- preserve current permission-aware visibility posture

### Documentation and agent guidance

The maintained artifact set must be refreshed so future work does not continue
assuming hash-backed root-admin suites are canonical.

That includes:

- frontend architecture docs
- feature docs with route examples
- capability matrix wording
- PRD/test-case/journey artifacts for affected slices
- repo-local skills and agent guidance that classify current route topology

---

## Security And Compatibility Requirements

- existing root-admin authn/authz boundaries must remain authoritative
- route params or path entry must not become authority for tenant, role, or
  entity access
- compatibility aliases must not weaken current denied behavior
- path-backed migration must be additive first
- any future alias retirement requires explicit compatibility review

---

## Acceptance Markers

This slice is acceptable when:

- the selected root-admin suites have path-backed canonical durable routes
- current hash entry points still land in the correct canonical destination
  during migration
- discovery truth, topology truth, shell navigation, and docs all describe the
  same canonical route posture
- root-admin route planning for future suites can build on the same durable
  grammar without inventing new hash-only families
