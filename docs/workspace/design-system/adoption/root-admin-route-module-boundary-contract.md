# Root Admin Route Module Boundary Contract

## Purpose

Define the route, page, and journey module boundary for `rootAdminShell` before
source is moved out of the current shared `index.html` and `assets/app.mjs`
surfaces.

This contract supports `RAF-002` in
`docs/workspace/design-system/adoption/root-admin-frontend-cleanup-plan.md`.
It is a structure contract only; it does not approve new app-local shell
markup, app-page CSS, or changes to root-admin auth/session behavior.

## Target Shape

```text
src/frontend/rootAdminShell/
  index.html
  router.ts
  discovery.ts

  assets/
    app.mjs
    apiClient.mjs
    routeTopology.mjs
    shellBootstrap.mjs
    state.mjs

  routes/
    <route-key>/
      route.mjs
      page.mjs
      journeys/
        <journey-key>/
          controller.mjs
          state.mjs
```

Nested durable routes may use nested folders, for example:

```text
routes/
  build/
    backlog/
      route.mjs
      page.mjs
```

## Module Responsibilities

### `index.html`

Owns only:

- document metadata
- app root
- minimal unauthenticated login mount host when still needed for bootstrap
- root-admin shell mount host
- script entrypoint

Must not own:

- protected shell chrome markup
- page bodies
- shell-attached drawers or modals
- governed component markup

### `assets/app.mjs`

Owns only:

- session restoration and auth bootstrap orchestration
- shell mount orchestration
- route registry loading
- current-route selection
- global event wiring that cannot belong to a page module
- delegation to page modules

Must not own:

- page body render structure
- page-local journey controllers
- governed shell markup
- governed component render/controller behavior

### `assets/routeTopology.mjs`

Owns:

- durable root-admin route keys
- canonical path-backed route mapping
- legacy hash alias compatibility mapping
- path-to-page and page-to-path normalization helpers

Must not own:

- page rendering
- API calls
- journey-local state
- transient UI state such as drawer posture, filter state, or selected tab

### `routes/**/route.mjs`

Each durable route module should export a route definition with this shape:

```js
export const route = {
  key: "users",
  canonicalPath: "/root-admin/users",
  label: "Users",
  title: "Users",
  searchPlaceholder: "Search users",
  surface: "root-admin",
  topologyClass: "durable-page",
  requiredCapability: null,
  aliases: [],
  mount,
};
```

Required fields:

- `key`
  stable root-admin route key used by route topology and page registry
- `canonicalPath`
  canonical path-backed URL for the durable route
- `label`
  short navigation label
- `title`
  page title or heading label for shell/page metadata
- `searchPlaceholder`
  shell search placeholder when the route participates in shell search
- `surface`
  root-admin route-family identifier
- `topologyClass`
  one of `durable-page`, `durable-subroute`, or `support-only`
- `requiredCapability`
  visibility or access capability when the route has one; `null` only when
  access is governed by the existing root-admin session boundary
- `aliases`
  compatibility aliases owned by the route, normally empty unless a migration
  requires explicit route-level compatibility
- `mount`
  function that mounts or returns the page controller

Optional fields:

- `description`
- `breadcrumb`
- `contextNavGroup`
- `supportsShellSearch`
- `supportOnlyReason`

## Page Module Contract

`routes/**/page.mjs` owns page composition, not durable shell structure.

Each page module should export either:

```js
export function mountPage(context) {
  return {
    syncPageState() {},
    handleShellSearchSubmit(query) {
      return false;
    },
    reset() {},
    destroy() {},
  };
}
```

or a page-specific named factory when the route benefits from explicit naming.

The `context` object may include:

- `root`
  route mount element
- `fetchJson`
  same-origin API client
- `uploadFileBytes`
  shared upload helper when the page owns upload behavior
- `setShellMessage`
  shell feedback callback
- `getCurrentPage`
  current route key getter
- `getCurrentPathname`
  current browser path getter
- `setCurrentPathname`
  path update callback
- `setPageLinkIcon`
  approved navigation icon update callback
- `refreshTopNav`
  approved shell nav refresh callback
- `refreshContextNav`
  approved context-nav refresh callback
- `services`
  optional named service bag for narrow, route-approved dependencies

Page modules may own:

- page composition
- DS workspace/component seam mounting
- route-specific API wiring
- page-level loading, empty, denied, degraded, and error handling
- page-local lifecycle
- page-local business callbacks passed into DS seams

Page modules must not own:

- global shell markup
- app-local CSS for governed presentation
- design-system component markup or controller behavior
- global durable route topology
- unrelated route state

## Journey Module Contract

Use `routes/**/journeys/**` for nested flows that belong to a page but are not
durable product places.

Examples:

- page settings editing inside web-app hierarchy
- materialization preview/apply flow inside web-app hierarchy
- local drawer flow for a page-owned task

Journey modules may own:

- journey-local state machines
- branch-specific controllers
- temporary UI state
- retry/error state for the nested flow
- business callbacks into the page module

Journey modules must not:

- add global route keys
- create path-backed URLs
- change curated topology
- serialize sensitive or unstable state into URLs
- become discoverable durable topology without an explicit promotion decision

## Current Route Classification

| Current route | Target module | Classification | Notes |
| --- | --- | --- | --- |
| `/root-admin` | `routes/overview/` | `durable-page` | Intentional placeholder for now; real page behavior needs DS summary seam or new explicit exception. |
| `/root-admin/users` | `routes/users/` | `durable-page` | Extracted; page body mounts through `rootAdminDirectoryWorkspace.mjs`. |
| `/root-admin/tenants` | `routes/tenants/` | `durable-page` | Extracted; page body mounts through `rootAdminDirectoryWorkspace.mjs`. |
| `/root-admin/tenant-admins` | `routes/tenant-admins/` | `durable-page` | Extracted; page body mounts through `rootAdminDirectoryWorkspace.mjs` with selected-tenant context preserved. |
| `/root-admin/roles` | `routes/roles/` | `durable-page` | Intentional placeholder for now; real behavior waits for a DS-owned roles workspace seam or new explicit exception. |
| `/root-admin/web-app-hierarchy` | `routes/web-app-hierarchy/` | `durable-page` | Extracted; page body mounts through the thin `webAppHierarchyPage.mjs` adapter and `webAppHierarchyWorkspace.mjs`. |
| `/root-admin/build/backlog` | `routes/build/backlog/` | `durable-page` | Proof route; floating-tab header is DS-owned, wrapper remains cleanup target. |
| `/root-admin/build/workspace` | `routes/build/workspace/` | `durable-page` | Proof route; mounts the DS-owned `chatWorkspaceMockConsumer.mjs` harness as the first mocked in-app chat workspace consumer. |
| root-admin helper downloads | no page route module | `support-only` | Keep in router/support helper handling, not normal user-facing topology. |
| legacy `#overview`, `#users`, etc. | `routeTopology.mjs` aliases | compatibility alias | Do not treat as canonical route truth. |

## Current Journey Classification

| Current behavior | Owner | Classification | Notes |
| --- | --- | --- | --- |
| Web-app hierarchy page settings drawer/editor | `routes/web-app-hierarchy/journeys/page-settings/` | `page-local journey` | Do not promote to durable route without explicit topology decision. |
| Web-app hierarchy materialization preview/apply | `routes/web-app-hierarchy/journeys/materialization/` | `page-local journey` | Durable materialization APIs remain backend-owned; browser journey state stays page-local. |
| Display settings drawer posture | DS shell seam | `ui-state` | Shell-attached, governed by DS shell seam; not a route. |
| Language modal posture | DS shell seam | `ui-state` | Shell-attached, governed by DS shell seam; not a route. |
| Context-nav overflow/menu posture | DS shell seam | `ui-state` | Not durable topology. |
| Build conversation panel open/history/composer state | Build panel/page module plus DS conversation seam | `page-local journey` | Do not serialize sensitive conversation state into route topology. |

## Registry Contract

The root-admin app bootstrap should assemble route modules through a narrow
registry. The registry should provide:

- ordered route definitions
- lookup by route key
- lookup by canonical path
- shell metadata projection
- page mount orchestration
- search delegation to the active page controller

The registry must preserve compatibility with `routeTopology.mjs` while route
modules are being extracted incrementally.

## First Extraction Candidate

The preferred first extraction is `/root-admin/build/backlog` because:

- it already has an isolated controller file
- it has an empty route mount in `index.html`
- its DS dependency is narrow: `floatingTabHeader.mjs`
- it is a proof surface with limited backend coupling

The remaining normal-page candidates are `/root-admin/overview` and
`/root-admin/roles`, which are intentionally retained as placeholders for now
and still need a DS-owned page body seam or new explicit exception before real
route behavior is added.

## Stop Conditions

Stop and revisit the plan if a proposed extraction would:

- add app-local CSS for governed layout
- copy design-system component markup into a page module
- promote a drawer, tab, filter, wizard step, or modal into durable topology
  without approval
- move backend feature logic into frontend modules
- break path-backed route compatibility
- remove legacy hash aliases without an explicit retirement decision
- change auth/session behavior while performing route cleanup
