# Root Admin Frontend Cleanup Plan

## Purpose

Create one coordinated cleanup plan for the root-admin frontend so shell,
page-body, design-system adoption, and verification work move together instead
of drifting across separate partial efforts.

This plan is driven by the current-state evidence in
`docs/workspace/design-system/adoption/root-admin-governed-page-implementation-audit.md`.
The audit remains the source of truth for what is currently local versus
design-system-sourced. This plan is the delivery sequence for resolving that
audit.

## Scope

In scope:

- root-admin shell ownership cleanup
- root-admin page-body cleanup
- root-admin route/page/journey module cleanup
- design-system seam extraction or adoption needed by root-admin
- frontend architecture doc alignment
- governed root-admin verification and gate updates

Out of scope:

- changing root-admin auth/session behavior
- introducing a frontend framework
- moving backend feature logic into frontend seams
- adding app-page CSS to make root-admin pages work
- removing path-backed root-admin routes
- retiring legacy hash compatibility aliases

## Current Baseline

The root-admin frontend already consumes several design-system-owned seams:

- login template rendering and variant behavior
- page-shell controllers for breadcrumb, language, tooltip, and chrome behavior
- root-admin directory workspace pages for users, tenants, and tenant admins
- web-app hierarchy workspace rendering and controller behavior
- Build conversation panel rendering and controller behavior
- floating-tab header rendering and controller behavior for the Build backlog
  proof surface

The cleanup work remains necessary because `src/frontend/rootAdminShell` still
locally owns or orchestrates some governed frontend structure:

- top nav and mobile nav markup
- profile menu markup
- sub-nav, breadcrumb host, and search host markup
- context-nav, conversation-panel, and page-main mounting posture
- display-settings drawer markup
- language modal markup
- `/root-admin` overview/session placeholder body
- `/root-admin/roles` placeholder body
- `/root-admin/build/backlog` page wrapper around the floating-tab header
- shell-level DOM selection and orchestration against locally authored markup
- large shared `index.html` and `assets/app.mjs` surfaces that still combine
  shell markup, route registration, page composition, journey orchestration,
  and business-data wiring

## Governing Rules

- ADR 0028 requires governed app adoption to consume design-system-owned
  styling, render structure, interaction behavior, accessibility semantics, and
  state semantics.
- ADR 0029 requires governed app shells to consume a design-system-owned
  page-shell source of truth rather than locally reauthoring shell HTML, shell
  CSS, interaction grammar, or accessibility/state semantics.
- The root-admin governed page implementation audit is the hard gate before
  durable `/root-admin` page work.
- App consumers may own backend/data wiring, permission-driven visibility,
  route state, and composition of approved families.
- App consumers must not own governed family markup, ARIA semantics, state
  grammar, or controller behavior.
- Durable routes should be separated from journey-local and UI-local state.
  A stable product place may become a route module; transient drawers, tabs,
  filters, wizard steps, and modes should remain page-local or journey-local
  unless explicitly promoted.

## Target Repo Shape

The root-admin frontend should move toward this shape as cleanup proceeds:

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
    overview/
      page.mjs
      route.mjs

    users/
      page.mjs
      route.mjs

    tenants/
      page.mjs
      route.mjs

    tenant-admins/
      page.mjs
      route.mjs

    roles/
      page.mjs
      route.mjs

    web-app-hierarchy/
      page.mjs
      route.mjs
      journeys/
        page-settings/
          controller.mjs
          state.mjs
        materialization/
          controller.mjs
          state.mjs

    build/
      backlog/
        page.mjs
        route.mjs
```

Ownership targets:

- `index.html` should only provide the app root, minimal mount host, and script
  entrypoint.
- `assets/app.mjs` should bootstrap session restoration, shell mounting, route
  registry setup, and global event wiring.
- `assets/routeTopology.mjs` should keep durable path/hash compatibility
  mapping.
- `routes/**/route.mjs` should own route metadata, durable route key, path,
  label, search placeholder, required capability, and page mount function.
- `routes/**/page.mjs` should own page composition, DS seam mounting, API
  wiring, and page-level lifecycle.
- `routes/**/journeys/**` should own nested workflow controllers and state that
  are not durable product places.
- design-system modules should own governed shell, workspace, component,
  accessibility, and controller seams.

## Delivery Sequence

### RAF-001: Align The Baseline

Goal:

Bring source-independent docs into agreement before more implementation work.

Tasks:

- Refresh `docs/architecture/frontend-overview.md` so its root-admin adoption
  wording matches the current governed page audit.
- Confirm whether any root-admin local remnants are intentional exceptions or
  cleanup targets.
- Keep the governed page implementation audit linked as the evidence source.
- Add the target route/page/journey module shape to the cleanup plan before
  implementation begins.

Exit criteria:

- `frontend-overview.md` no longer contradicts the root-admin page audit.
- Local shell and page-body remnants are named as cleanup targets or explicit
  exceptions.
- The cleanup plan records that `index.html` and `app.mjs` should shrink into
  bootstrapping/orchestration rather than continuing to hold all pages and
  journeys.
- No source code changes are required for this step.

### RAF-002: Define The Route Module Boundary

Goal:

Define the route/page/journey module boundary before moving shell code, so the
refactor does not preserve a single large `app.mjs` as the durable frontend
shape.

Tasks:

- Define the root-admin route registry contract.
- Decide the minimal fields for `routes/**/route.mjs`, including route key,
  path, label, search placeholder, capability/visibility metadata, and mount
  function.
- Decide how page modules receive shared services such as `fetchJson`,
  `uploadFileBytes`, shell message handling, navigation helpers, and current
  route state.
- Classify existing shell states, page bodies, and nested journeys as:
  - durable route module
  - page-local journey module
  - UI-local state
  - support-only helper
- Confirm no transient state is promoted into durable topology by accident.

Exit criteria:

- `rootAdminShell` has an approved route-module target before source moves.
- The first code slice can move page composition out of `app.mjs` without
  changing rendered behavior.

### RAF-003: Define The DS-Owned Shell Render Seam

Goal:

Create the design-system-owned source of truth that can render the root-admin
shell host structure.

Tasks:

- Decide whether the shell render seam belongs in the existing page-shell
  module or in a dedicated root-admin shell module.
- Define the allowed consumer inputs for route links, profile labels, utility
  actions, mount slots, and shell-attached surfaces.
- Ensure the seam owns at minimum:
  - top nav
  - mobile nav
  - profile/menu shell controls
  - sub-nav row with breadcrumb and search shell hosts
  - context-nav host
  - conversation-panel host
  - shell-attached drawer hosts
  - language modal host
  - page-main framing and route mount slots
- Document the source route, canonical proof, or reference truth for the seam.

Exit criteria:

- The design system exposes a shell-owned style seam, render seam, controller
  seam, and explicit input contract.
- Backend/session/auth behavior remains owned by `rootAdminShell`.

### RAF-004: Adopt The Shell Render Seam In RootAdminShell

Goal:

Replace locally authored root-admin shell chrome with the DS-owned shell render
seam while preserving current behavior.

Tasks:

- Reduce `src/frontend/rootAdminShell/index.html` to the app root, minimal
  mount host, and script entrypoint needed to boot the authenticated app.
- Update `src/frontend/rootAdminShell/assets/app.mjs` to bind through the
  DS seam's declared host/query contract.
- Preserve path-backed root-admin routes and legacy hash compatibility aliases.
- Preserve root-admin auth/session bootstrap behavior.

Exit criteria:

- Top nav, mobile nav, profile controls, sub-nav, context-nav host,
  display-settings host, language modal host, conversation-panel host, and
  page-main framing are design-system-rendered.
- Root-admin app code owns data wiring and route state only.
- The visual shell output is intentionally unchanged except for approved parity
  corrections.

### RAF-005: Split Route And Page Modules

Goal:

Move durable route/page composition out of the root `index.html` and
`assets/app.mjs` surfaces after the shell mount contract is stable.

Tasks:

- Move overview, users, tenants, tenant-admins, roles, web-app hierarchy, and
  Build backlog page composition behind route modules.
- Keep `assets/app.mjs` as the bootstrap and registry orchestrator.
- Keep durable route topology in `routeTopology.mjs`.
- Keep journey-local state under page-owned `journeys/` modules unless a
  separate topology promotion decision exists.
- Preserve current path-backed route behavior and legacy hash alias handling.

Exit criteria:

- `rootAdminShell/index.html` contains no page bodies.
- `rootAdminShell/assets/app.mjs` no longer directly owns every page
  controller and page mount.
- Each durable root-admin product place has a narrow route module.
- Journey-local and UI-local state remain out of global topology.

### RAF-006: Close Shell-Attached Surface Gaps

Goal:

Remove remaining locally authored governed shell-attached surfaces.

Tasks:

- Move display-settings drawer render structure into a DS-owned seam if not
  already covered by the shell render seam.
- Move language modal render structure into a DS-owned seam if not already
  covered by the shell render seam.
- Confirm whether root-admin shell feedback/banner host ownership is fully
  DS-sourced.
- Classify SSH key option row rendering as either:
  - governed login UI that should move into the login template seam
  - auth-data rendering that may remain app-owned under an explicit exception

Exit criteria:

- `rootAdminShell` no longer creates governed shell-attached markup locally.
- Any remaining local DOM creation is documented as business-data wiring,
  file-download mechanics, auth-data rendering, or non-governed
  infrastructure.

### RAF-007: Close Page-Body Gaps

Goal:

Resolve local root-admin page bodies that are still placeholders or partial
first-consumer surfaces.

Tasks:

- `/root-admin`
  - decide whether the overview/session page becomes a signed-off DS summary
    page, a directory-style page, or an explicit exception.
  - do not extend the current placeholder as if it were governed adoption.
- `/root-admin/roles`
  - wait for or define the DS-owned roles workspace seam before building real
    route behavior.
  - remove or explicitly defer the local placeholder body.
- `/root-admin/build/backlog`
  - decide whether the Build backlog wrapper needs a full DS workspace seam
    before durable backlog data is connected.
  - keep floating-tab header behavior in its DS-owned seam.
- Keep users, tenants, tenant-admins, and web-app hierarchy page work routed
  through their existing DS workspace seams.

Exit criteria:

- The governed page audit shows no unplanned local page-body implementation.
- Placeholder content is either removed, replaced by a DS seam, or documented
  as an intentional exception.

### RAF-008: Update Verification And Gates

Goal:

Make the cleanup durable by catching root-admin frontend drift automatically.

Tasks:

- Add or refresh browser checks that compare the real root-admin shell against
  the signed-off design-system shell source truth.
- Keep route-level proof on `/root-admin`, not only isolated `/design-system`
  pages.
- Update the governed root-admin UI check so local shell markup regressions,
  app-page CSS regressions, and shell-host parity drift fail before review.
- Refresh the root-admin governed page implementation audit after each
  completed cleanup slice.

Exit criteria:

- Tests catch local shell markup reintroduction.
- Tests catch shell-host parity drift.
- Tests catch app-local CSS/layout drift for governed root-admin surfaces.
- `frontend-overview.md`, the governed page audit, and source all agree.

## Suggested Task Order

1. RAF-001: Align The Baseline
2. RAF-002: Define The Route Module Boundary
3. RAF-003: Define The DS-Owned Shell Render Seam
4. RAF-004: Adopt The Shell Render Seam In RootAdminShell
5. RAF-005: Split Route And Page Modules
6. RAF-006: Close Shell-Attached Surface Gaps
7. RAF-008: Add the first shell parity/gate coverage
8. RAF-007: Close Page-Body Gaps route by route
9. RAF-008: Refresh final verification and audit evidence

This order intentionally defines route modules before the shell implementation
slice, then fixes the shell before page bodies. Page-level adoption inside a
locally reconstructed shell still falls short of ADR 0029, so shell ownership
remains the first structural implementation target. Route-module cleanup keeps
the implementation from preserving a monolithic `app.mjs` behind a cleaner
shell facade.

## Open Decisions

- Should the root-admin shell render seam live in
  `pageShellController.mjs`, a new `rootAdminShell.mjs`, or another
  design-system module?
- Should route modules live under `src/frontend/rootAdminShell/routes/**`
  immediately, or should the first extraction use an intermediate registry
  while the shell seam lands?
- Which existing local states should be classified as journey-local modules
  rather than durable route modules?
- Should `/root-admin` overview/session become a small DS summary family or an
  explicit exception?
- Should `/root-admin/roles` wait for a real roles workspace seam?
- Should `/root-admin/build/backlog` get a full DS workspace seam before
  durable backlog data exists?
- Should SSH key option row rendering move into `loginTemplate.mjs` or remain
  auth-data rendering owned by root-admin auth?
