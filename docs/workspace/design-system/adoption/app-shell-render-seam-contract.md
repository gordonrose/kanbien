# App Shell Render Seam Contract

## Purpose

Define the target design-system-owned app shell seam before root-admin shell
remediation moves local shell markup into shared code.

The shell is expected to be reused by more than root-admin. Root-admin is the
first governed consumer, not the owner of the primitive. Future tenant-admin,
tenant-user, or other app families should be able to consume the same shell
shape through approved inputs rather than inheriting root-admin-specific
markup, routes, or assumptions.

## Status

- Status: initial seam implemented for RAF-003/RAF-004
- First intended consumer: `src/frontend/rootAdminShell`
- Target implementation family:
  `src/frontend/designSystem/assets/appShell.mjs`
- Current implementation status:
  root-admin renders authenticated shell markup through
  `src/frontend/designSystem/assets/appShell.mjs`; root-admin still owns
  route/session inputs, route body mounting, and business orchestration in
  `src/frontend/rootAdminShell/assets/app.mjs`

The module name is intentionally `appShell.mjs` because the seam is an app-frame
primitive that should be reusable across root-admin, tenant-admin,
tenant-user, and future governed app families. Existing page-shell helpers may
remain dependencies of this seam, but they are not the public app-shell
entrypoint.

## Governing Rules

- ADR 0028 requires governed app adoption to consume design-system-owned
  styling, render structure, controller behavior, and accessibility/state
  semantics.
- ADR 0029 requires governed app route families to consume a
  design-system-owned page/app shell source of truth instead of locally
  reauthoring shell structure and behavior.
- Root-admin route modules may own app glue, but they must not become a local
  shared UI library.

## Shell-Owned Surface

The design-system seam should own the reusable shell structure for:

- brand/header frame
- top navigation host
- primary-nav overflow host
- mobile navigation host
- profile/menu host
- breadcrumb/sub-nav row host
- optional search-shell host
- context-nav host and overflow/menu host
- display-settings host
- shell-attached drawer/dialog host structure
- shared tooltip host
- page-main frame, page content slot, and shell gutters
- approved empty mount targets for shell-attached app surfaces such as a
  conversation panel slot

The seam should own the corresponding accessibility and state semantics:

- landmarks and region relationships
- nav/link/current-page semantics
- button/menu/drawer state attributes
- focus-return and escape behavior for shell-owned menus and drawers
- mobile and responsive shell posture
- RTL and display-setting posture
- tooltip ownership for shell controls

## Allowed Consumer Inputs

The app consumer may pass narrow, explicit inputs:

- app or product label
- brand/home destination
- current route/page key
- top-nav items
- mobile-nav items
- breadcrumb items
- context-nav items
- utility actions
- profile summary
- display-settings configuration
- locale/direction/display-state values
- approved slot content or mount targets
- callbacks for navigation, profile actions, logout, display settings, and
  route-specific shell actions

Inputs must describe app state and business callbacks. They must not require
the consumer to assemble shell-owned markup or recreate shell-owned controller
behavior.

## Public API Shape

`appShell.mjs` should expose one render seam and one controller seam.

Expected exports:

```js
export function renderAppShell(input) {}
export function createAppShellController(input) {}
```

Optional helper exports may exist only when they are stable shell-level
helpers, not app-family-specific shortcuts:

```js
export function buildAppShellBreadcrumbItems(input) {}
export function normalizeAppShellNavItems(input) {}
```

Do not export root-admin-specific helpers from `appShell.mjs`.

### `renderAppShell(input)`

Purpose:

- return authenticated shell markup as a string
- create stable shell-owned host IDs and data hooks
- create route-content mount sections from data, not from consumer-authored
  shell markup
- create approved slot mount points for shell-attached app surfaces

Required input shape:

```js
{
  appId: "root-admin",
  appLabel: "Root Admin",
  brand: {
    label: "Kanbien",
    href: "/root-admin",
    ariaLabel: "Kanbien root admin home",
    mark: "K"
  },
  currentPageKey: "overview",
  nav: {
    primary: [
      {
        key: "overview",
        label: "Overview",
        href: "/root-admin",
        title: "Overview"
      }
    ],
    mobile: "same-as-primary"
  },
  profile: {
    label: "Profile",
    initials: "RU",
    menuItems: [
      { key: "session", kind: "link", label: "My Session", href: "/root-admin" },
      { key: "language", kind: "button", label: "Language" },
      { key: "logout", kind: "button", label: "Sign Out" }
    ]
  },
  breadcrumbs: [
    { href: "/root-admin", label: "Root Admin" }
  ],
  search: {
    enabled: true,
    placeholder: "Search root admin sections",
    name: "q"
  },
  contextNav: {
    enabled: true
  },
  displaySettings: {
    enabled: true,
    themes: ["normal", "dark", "desert"],
    magnificationSteps: [-100, -50, 0, 50, 100]
  },
  slots: {
    shellMessage: true,
    contextNav: true,
    conversationPanel: true,
    languageModal: true
  },
  pages: [
    {
      key: "overview",
      sectionId: "page-overview",
      className: "component-catalog-section",
      initiallyVisible: true
    },
    {
      key: "users",
      sectionId: "page-users",
      initiallyVisible: false
    }
  ]
}
```

Allowed render output:

- shell frame
- nav/menu/drawer host structure
- breadcrumb/sub-nav host structure
- context-nav mount host
- display-settings host structure
- language modal host structure
- page-main frame
- empty route-content sections from `pages`
- shell-attached slot mounts requested through `slots`

Forbidden render output:

- root-admin business data
- hardcoded root-admin-only page bodies beyond explicitly supplied slot or page
  mount hosts
- API response data
- permission decisions
- route compatibility redirects

### `createAppShellController(input)`

Purpose:

- attach DS-owned shell behavior to a rendered shell root
- return an imperative shell controller for app state synchronization
- compose existing DS-owned controller helpers such as
  `pageShellController.mjs` rather than forcing consumers to wire those
  helpers directly

Required input shape:

```js
{
  root: HTMLElement,
  getCurrentPageKey: () => "overview",
  getCurrentPathname: () => "/root-admin",
  onNavigate: ({ pageKey, href, event }) => {},
  onSearchSubmit: async ({ query, event }) => false,
  onProfileAction: ({ key, event }) => {},
  onDisplaySettingsChange: ({ theme, magnification, direction }) => {},
  onLanguageChange: ({ languageCode }) => {},
  getDisplaySettingsState: () => ({
    theme: "normal",
    magnification: 0,
    direction: "ltr",
    languageCode: "en"
  })
}
```

Expected returned controller:

```js
{
  elements: {
    main: HTMLElement,
    shellMessage: HTMLElement | null,
    contextNavMount: HTMLElement | null,
    conversationPanelMount: HTMLElement | null,
    pageSections: Map<string, HTMLElement>
  },
  syncShellState(state) {},
  setNavItems(items) {},
  setBreadcrumbs(items) {},
  setContextNavItems(items) {},
  setProfileSummary(profile) {},
  setShellMessage(message, tone) {},
  clearShellMessage() {},
  closeTransientSurfaces() {},
  scheduleGeometrySync() {},
  destroy() {}
}
```

`syncShellState(state)` should accept app state as data:

```js
{
  currentPageKey: "users",
  currentPathname: "/root-admin/users",
  breadcrumbs: [
    { href: "/root-admin", label: "Root Admin" },
    { href: "/root-admin/users", label: "Users" }
  ],
  profile: {
    label: "Root Admin",
    initials: "RA"
  },
  displaySettings: {
    theme: "normal",
    magnification: 0,
    direction: "ltr",
    languageCode: "en"
  }
}
```

The controller may expose element references for app-owned page mounting, but
it must not require the consumer to query shell-owned internal IDs for normal
operation.

## Stable Host Contract

The first implementation should preserve or deliberately map the current
root-admin host IDs that tests and page adapters depend on:

- `shell-view`
- `root-admin-main` or a generic equivalent surfaced through
  `controller.elements.main`
- `shell-message`
- `root-admin-context-nav-mount`
- `root-admin-conversation-panel-mount`
- `page-overview`
- `page-users`
- `page-roles`
- `page-tenants`
- `page-tenant-admins`
- `page-web-app-hierarchy`
- `page-build-backlog`

If a generic ID replaces a root-admin-specific ID, RAF-004 must include a
compatibility strategy for tests and adapters. Prefer keeping current IDs in
the first adoption slice and making generic aliases later.

These root-admin-prefixed IDs are compatibility IDs, not the public app-shell
API. New consumers should use returned `controller.elements` handles and
approved input fields rather than depending on root-admin-specific IDs.

## First Consumer Input Mapping

For root-admin, the first `renderAppShell(...)` call should derive inputs from:

- `src/frontend/rootAdminShell/assets/pageMetadata.mjs`
- `src/frontend/rootAdminShell/assets/routeTopology.mjs`
- current top-nav/context-nav projection data from
  `GET /v1/web-app-hierarchy/tree` and page-settings APIs
- current root-auth session summary
- existing display-settings and language option constants

The first `createAppShellController(...)` call should replace direct local
composition of:

- `createPageShellChromeController(...)`
- `createPageShellBreadcrumbController(...)`
- `createPageShellLanguageController(...)`
- `createPageShellTooltipController(...)`

Root-admin may still call higher-level returned controller methods and pass
route/page data into them.

## Consumer-Owned Surface

Root-admin and future app families may own:

- auth/session state
- route registry and durable route modules
- current page resolution and compatibility redirects
- backend/API calls
- permission-aware filtering and disabled action rules
- business callbacks
- route body mounting into the shell content slot
- page-family data adapters
- feature-specific state machines behind route bodies

Root-admin may also continue to own root-admin-specific page metadata and page
labels, but those should be passed into the shell as data.

## Forbidden Consumer Ownership

Governed app consumers must not locally own:

- shell HTML copied from `/design-system`
- top-nav, mobile-nav, profile, breadcrumb, context-nav, display-settings, or
  shell drawer host markup
- shell ARIA/state grammar
- shell menu, drawer, tooltip, language, theme, or magnification controller
  behavior
- app-page CSS for shell layout, gutters, wrappers, or page framing
- root-admin-specific assumptions inside the shared shell primitive

Any exception must be explicit and documented for the surface.

## First-Consumer Root-Admin Migration Shape

RAF-003 should define the seam without moving route bodies.

RAF-004 should adopt the seam in root-admin by:

1. rendering the authenticated shell through the DS-owned app-shell seam
2. passing root-admin navigation, breadcrumb, context-nav, profile, and display
   settings inputs as data
3. preserving existing path-backed root-admin routes and hash compatibility
   aliases
4. preserving current browser auth/session behavior
5. preserving current page-body DS seam consumption for Users, Tenants, Tenant
   Admins, Web App Hierarchy, Conversation Panel, and Build Backlog
6. keeping login as its existing explicit DS template adoption path rather than
   folding unauthenticated login into the authenticated app shell

The migration should be compatibility-preserving. It should not change route
truth, backend contracts, permissions, session behavior, or page-body product
behavior.

## Verification Expectations

Before root-admin shell adoption is treated as complete, verification should
prove:

- root-admin no longer hosts governed authenticated shell markup locally
- root-admin imports the DS-owned app-shell render/controller seam
- root-admin does not introduce app-local shell CSS
- top-nav, mobile-nav, profile menu, breadcrumb/sub-nav, context-nav, display
  settings, and shell-attached surfaces still render and behave correctly
- path-backed canonical routes still resolve:
  - `/root-admin`
  - `/root-admin/users`
  - `/root-admin/tenants`
  - `/root-admin/tenant-admins`
  - `/root-admin/roles`
  - `/root-admin/web-app-hierarchy`
  - `/root-admin/build/backlog`
- legacy hash aliases still land on the same canonical destinations during the
  migration window
- app page bodies continue consuming their existing DS-owned seams

Expected checks:

- `npm run check:governed-root-admin-ui`
- `npm run check:governed-ui-adoption`
- `npm run check:frontend-architecture`
- focused root-admin browser-auth integration coverage
- shell parity Playwright coverage once the DS seam exists

## Open Questions For Implementation

- Whether the current `pageShellController.mjs` should remain controller-only
  or become a dependency of a new render/controller seam.
- Which shell slots are required for tenant-admin or tenant-user consumers in
  the first version.
- Whether profile, display settings, and language controls are always present
  or optional shell capabilities.
- Which app families, beyond root-admin, should be represented in canonical
  examples before the seam is signed off.
