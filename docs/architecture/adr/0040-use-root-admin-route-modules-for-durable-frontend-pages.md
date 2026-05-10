# ADR-0040: Use Root-Admin Route Modules For Durable Frontend Pages

- Status: Accepted
- Date: 2026-05-10
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

ADR 0024 established that durable frontend places should be modeled explicitly
and that repo structure should become a materialized artifact of curated
frontend topology rather than an ad hoc implementation detail.

The current `rootAdminShell` still carries too much route and page composition
inside shared root files:

- `src/frontend/rootAdminShell/index.html` still contains protected shell and
  page mount structure.
- `src/frontend/rootAdminShell/assets/app.mjs` still bootstraps auth, shell
  behavior, route state, page controllers, and some journey behavior in one
  large browser module.
- Some root-admin pages already consume design-system-owned page/workspace
  seams, but the app route-family structure does not yet make durable pages,
  page-local journeys, and UI-local state obvious.

This makes future frontend work more likely to:

- add behavior to a monolithic app module
- blur durable pages with journey-local state
- make governed design-system adoption harder to verify
- hide route ownership from discovery and topology-maintenance seams

## Decision

Adopt route modules for durable root-admin frontend pages.

The root-admin route family may serve browser modules from:

- `/root-admin/assets/*`
- `/root-admin/routes/*`

The source structure should move toward:

```text
src/frontend/rootAdminShell/
  assets/
    app.mjs
    routeTopology.mjs
  routes/
    <route-key>/
      route.mjs
      page.mjs
      journeys/
        <journey-key>/
          controller.mjs
          state.mjs
```

Route modules own durable route metadata and page mounting.
Page modules own page composition, design-system seam mounting, API wiring,
and page-level lifecycle.
Journey modules own nested workflow state that belongs to a page but is not a
durable product place.

The root `assets/app.mjs` should become a bootstrap and registry orchestrator
over time. It may keep auth/session bootstrap, shell mount orchestration,
current-route selection, global event wiring, and delegation to page modules.

The root-admin route module model does not replace design-system ownership.
Governed UI render structure, interaction behavior, accessibility semantics,
and state grammar must still come from approved design-system seams.

## Rules

- Durable product places should use route modules.
- Page-local journeys and UI-local state must not become global route modules
  unless a separate topology promotion decision approves that move.
- Root-admin route modules must preserve path-backed canonical route behavior.
- Legacy hash aliases remain compatibility aliases until an explicit retirement
  decision removes them.
- Browser route modules are same-origin app modules, not backend feature
  internals.
- Backend feature logic must stay behind HTTP/API seams.
- App-page CSS remains prohibited for governed root-admin surfaces unless an
  explicit design-system loop or exception approves it.

## Consequences

### Positive

- Future root-admin pages can be added without growing one large `app.mjs`.
- Durable route ownership becomes visible in source and discovery metadata.
- Page-local journey state has a clear home without being promoted into global
  topology.
- Design-system adoption checks can target page modules and shared seams more
  precisely.
- The browser route-family structure moves closer to ADR 0024's materialized
  topology direction.

### Negative

- The root-admin router must serve `/root-admin/routes/*` modules in addition
  to `/root-admin/assets/*`.
- Existing guards and source-independent tests need updates as route modules
  are extracted.
- During migration, root-admin will temporarily have both older app-level page
  composition and newer route modules.

### Neutral / Follow-up

- Start with `/root-admin/build/backlog` because it already has a narrow page
  controller and limited backend coupling.
- The first follow-on extractions are the directory pages:
  `/root-admin/users`, `/root-admin/tenants`, and
  `/root-admin/tenant-admins`, which now mount through route modules while
  continuing to consume the design-system-owned directory workspace seam.
- `/root-admin/web-app-hierarchy` now also mounts through a route module after
  the registry pattern was proven for both proof-route and directory-page
  consumers; its page adapter still owns the broader API and journey callbacks.
- Later work should define when the route registry is generated from curated
  topology instead of manually assembled.
