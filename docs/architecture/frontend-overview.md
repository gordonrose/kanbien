# Frontend Overview

## Purpose

Describe the frontend architecture that exists today so frontend runtime,
governance, and documentation decisions have one current-state reference.

Use this file for the frontend shape that is implemented now.
Use ADRs for enduring frontend architecture decisions and decision changes over
time.
Use `docs/architecture/guides/frontend-architecture-classification-model.md`
for the Layer 2 classification fields that decide frontend placement,
runtime shape, surface class, topology, locator, authority, state, shell,
design-system, materialization, browser-security, and artifact posture before
Task Breakdown packages implementation work.

## Current Summary

The platform currently uses a same-origin frontend architecture served by the
main Express application.

Today that means:

- browser/frontend route families are mounted in `src/app.ts`
- frontend code lives under `src/frontend/` rather than inside backend feature
  folders
- the active real app surface is the `rootAdminShell`
- the governed proving-ground surface is the file-routed `/design-system`
- frontend-to-backend integration happens through same-origin REST calls to
  `/v1/*`
- browser sessions for the root-admin shell use secure HTTP-only cookies backed
  by server-side session records
- the root-admin login flow uses a localhost signing-helper bridge for SSH
  proof
- `package.json` now also declares backend/platform job runtime commands such
  as `scheduler:jobs`; those commands do not change the browser delivery model
  or frontend route topology
- `package.json` also declares backend export-bundle support through
  `@zip.js/zip.js`; that dependency is used by server-side generated exports
  and does not introduce a frontend bundler, frontend framework, or browser
  package-delivery change
- `package.json` includes `check:design-system-registry` in the static gate to
  verify that switchable design-system registrations, manifests, contract
  modules, implementation exports, and served system-scoped routes stay aligned

Primary architecture decisions behind this shape live in:

- `docs/architecture/adr/0013-add-a-same-origin-root-admin-browser-auth-shell.md`
- `docs/architecture/adr/0014-use-a-local-ssh-signing-helper-for-root-user-browser-auth.md`
- `docs/architecture/adr/0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md`
- `docs/architecture/adr/0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md`
- `docs/architecture/adr/0032-promote-selected-root-admin-suites-from-hash-aliases-to-path-backed-canonical-routes.md`

## Runtime Shape

### App Composition

The Express app is the same-origin composition point.

Current mount posture:

- `/design-system` serves governed HTML reference and canonical routes
- `/root-admin` serves the root-admin browser shell, helper downloads, static
  app assets under `/root-admin/assets/*`, and route modules under
  `/root-admin/routes/*`
- `/v1` serves backend REST capabilities consumed by frontend surfaces

Shared browser security is applied at the app layer through `helmet`, including
the current CSP allowlist required for same-origin assets and the localhost
root-auth signer helper bridge.

### Frontend Delivery Model

Current delivery is intentionally lightweight:

- frontend assets are served directly by Express
- production build copies frontend folders into `dist/frontend/*`
- the repo does not currently use React, Next.js, Vite, or another SPA build
  framework for the active browser surfaces
- production runtime scripts execute compiled Node entrypoints from `dist/src`,
  while copied frontend assets remain served from `dist/frontend`

This means the runtime model is:

- TypeScript/Node for server and platform wiring
- static HTML, CSS, and ES modules for browser surfaces
- REST for browser/backend integration

## Frontend Families

### `designSystem`

The design system is the governed reference surface under
`src/frontend/designSystem`.

Current role:

- prove canonicals, patterns, templates, and shared page-shell behavior
- provide signed-off reference truth before governed real-app adoption
- expose file-routed HTML pages whose route topology comes from the folder
  structure
- expose generated canonical render routes through an explicit router registry
  when canonical truth is backed by design-system canonical metadata
- expose the first switchable-system contract boundary through
  `contracts/`, `registry/`, `shared/`, `layers/`, and
  `systems/<system-key>/`, with the default system currently proving the
  `background-color` token route
- expose governed source seams for new layered design-system work under
  `src/frontend/designSystem/layers/<layer-number>/`
- keep `systems/<system-key>/` as the selectable system implementation and
  rendered proof area for assets, manifests, proof modules, and review routes
- require switchable token proof modules to expose the Layer 2 token proof
  exports `tokenDefinitionV1`, `tokenTypeTemplate`, `variants`, and the manifest
  named system token spec export
- require later governed layers to consume token seams through
  `src/frontend/designSystem/layers/02-token/` rather than importing directly
  from `systems/<system-key>/tokens/proofs/`

Current route model:

- one HTML page per route or per `index.html` folder entry
- a router that resolves request paths directly to matching HTML files
- system-scoped token proof routes use `/design-system/<system-key>/tokens/*`
  so visual implementations can vary while the contract name and consumer
  obligations remain stable
- Layer 2 token proof modules live under
  `src/frontend/designSystem/systems/<system-key>/tokens/proofs/`; governed
  runtime imports for later layers live under
  `src/frontend/designSystem/layers/02-token/`
- Layer 3 primitive runtime seams live under
  `src/frontend/designSystem/layers/03-primitive/`; primitive code must consume
  Layer 2 tokens through the governed Layer 2 seam, not through system proof
  modules directly
- a design system is selectable only after its system key is registered in
  `src/frontend/designSystem/registry/designSystems.mjs` and its
  `systems/<system-key>/system.manifest.json` declares the contract
  implementations it owns
- discovery logic that walks the HTML tree and reports implemented routes as
  discovered frontend truth
- generated canonical route entries for approved or review-candidate governed
  component, pattern, or page-template child families that need stable
  canonical launcher/detail URLs in addition to their review route, such as
  `kanban-column` and the `entity-management-page-*` child matrices

### `rootAdminShell`

The root-admin shell is the active real browser app under
`src/frontend/rootAdminShell`.

Current role:

- root-user authentication and browser bootstrap
- authenticated operator shell chrome
- path-backed durable suite navigation inside one browser shell
- page-specific controllers mounted into the shell for concrete operator tasks

Current route model:

- one same-origin HTML shell served at `/root-admin`
- static assets served from `/root-admin/assets`
- canonical user-facing suite routes represented as path-backed pages such as
  `/root-admin`, `/root-admin/users`, and `/root-admin/web-app-hierarchy`
- legacy hash URLs such as `/root-admin#users` remain temporary compatibility
  aliases during the current migration window
- support-only helper download routes served alongside the shell

Current implementation model:

- vanilla browser ES modules
- shell-owned state, rendering, fetch/error handling, and navigation
- feature-like page controllers for deeper surfaces such as root-admin
  directory pages, web app hierarchy, and Build backlog proof routes
- route modules are starting under `src/frontend/rootAdminShell/routes/*` for
  durable root-admin product places, beginning with `/root-admin/build/backlog`
  and now including the directory pages: `/root-admin/users`,
  `/root-admin/tenants`, and `/root-admin/tenant-admins`, plus
  `/root-admin/web-app-hierarchy`
- current authenticated shell render structure now flows through the
  design-system-owned reusable `appShell.mjs` seam, with root-admin as the
  first governed consumer

Current governed-adoption posture inside `rootAdminShell` is not uniform yet:

- the authenticated root-admin shell now consumes
  `/design-system/assets/appShell.mjs` for shell render structure and shell
  controller composition while root-admin still owns route, session, and page
  body inputs
- the `Users`, `Tenants`, and `Tenant Admins` routes now consume the
  design-system-owned `rootAdminDirectoryWorkspace.mjs` render/controller seam
  for list-page and drawer-form behavior
- the `web-app-hierarchy` route now consumes the design-system-owned
  `webAppHierarchyWorkspace.mjs` render/controller seam through a thin
  root-admin route adapter
- the root-admin Build panel consumes the design-system-owned
  `conversationPanel.mjs` and `conversationPanel.css` seams for the live
  Product Discovery chat panel
- the `build/backlog` proof route consumes the design-system-owned
  `floatingTabHeader.mjs` seam, but still owns representative route wrapper
  copy and proof data locally
- the `build/workspace` proof route consumes the design-system-owned
  `chatWorkspaceMockConsumer.mjs` harness as a mocked in-app proof consumer of
  the chat workspace seam; it is not production Build workspace behavior
- the `/root-admin` overview/session body and `/root-admin/roles` body remain
  intentional local placeholder page bodies rather than page-family
  design-system adoption
- current governed adoption therefore proves partial behavior sharing in some
  places, but remaining placeholder page bodies still need either DS-backed
  page-family adoption or a new explicit exception before real product UI is
  added

ADR `0028` governs the stronger current rule: governed app adoption must
consume design-system-owned styling, render structure, and interaction seams.
ADR `0027` remains the narrower CSS-entrypoint prerequisite inside that broader
contract. ADR `0029` adds the next rule boundary: for non-exception governed
app surfaces, the page shell itself must also become a design-system-owned
artifact rather than a locally authored host.

### Governed Adoption Audit

Current audit of the active governed adoption seams:

- `app-shell`
  - shared render/controller seam exists through
    `/design-system/assets/appShell.mjs`
  - current first consumer is `rootAdminShell`
  - root-admin passes route, session, nav, breadcrumb, display, and page mount
    inputs while shell structure and page-shell controller composition stay in
    the design system
- `list-page`
  - shared CSS seam exists:
    `/design-system/assets/list-page-shared.css`
  - shared root-admin directory render/controller seam exists through
    `/design-system/assets/rootAdminDirectoryWorkspace.mjs`
  - current real consumers for `Users`, `Tenants`, and `Tenant Admins` consume
    the DS-owned directory workspace instead of duplicating app-side list-page
    markup or route-local list behavior
- `hierarchy-tree`
  - shared CSS seam exists:
    `/design-system/assets/hierarchy-tree-shared.css`
  - shared interaction/controller seam exists through
    `/design-system/assets/hierarchyTree.mjs`
  - current web-app hierarchy route consumes the broader
    `/design-system/assets/webAppHierarchyWorkspace.mjs` workspace seam instead
    of duplicating its page body in `rootAdminShell/index.html`
  - future hierarchy-tree-only app adoption should still confirm whether a
    narrower tree/drawer render seam is needed outside that workspace seam
- `icon-grid`
  - styling currently reaches the app through the parent
    `/design-system/assets/form-template-shared.css` family seam
  - shared render and interaction seam now exist through
    `/design-system/assets/formControls.mjs`
  - current real consumer now mounts DS-owned hosted field markup for the page
    settings icon selector rather than duplicating the field and modal DOM
- `drawer-select`
  - styling currently reaches the app through the parent
    `/design-system/assets/form-template-shared.css` family seam
  - shared render and interaction seam now exist through
    `/design-system/assets/formControls.mjs`
  - current real consumer now mounts DS-owned hosted trigger and drawer markup
    for the context-nav selector instead of duplicating the shell locally
- `form-image-card`
  - styling reaches app consumers through
    `/design-system/assets/form-template-shared.css`, which imports the shared
    form-control CSS entrypoint
  - shared render seam exists through
    `/design-system/assets/formControls.mjs`
  - no real app consumer has adopted the seam yet; consuming features must own
    upload, modal, alt-text, authorization, persistence, and asset lifecycle
    behavior outside the DS-owned card render
- `drawer-form`
  - styling reaches root-admin through
    `/design-system/assets/form-template-shared.css` and list-page drawer
    posture
  - root-admin directory create/edit flows now consume the shared
    `rootAdminDirectoryWorkspace.mjs` controller/render seam rather than
    adding app-local form markup
- `kanban-column`
  - shared source seam exists through
    `/design-system/assets/kanbanColumnSeam.mjs`
  - design-system review and canonical routes consume the shared
    render/controller seam
  - no real app consumer is approved yet; future app adoption requires a named
    first-consumer adoption contract and product data/API integration plan

## Target Governed Adoption Model

For a governed family to be honestly app-consumable, the design system should
publish all of these:

- shared CSS seam
- shared render or markup seam
- shared interaction or controller seam
- explicit allowed consumer inputs

Allowed consumer inputs should be narrow and family-owned, such as:

- labels and copy explicitly approved for that consumer
- field name or value inputs
- option records or tree data
- permission-driven action visibility
- event callbacks for approved business actions

The app consumer may still own route data fetching, backend wiring, and
composition of multiple approved families, but it should not re-author the
governed family markup, ARIA semantics, state grammar, or controller behavior
locally.

For governed app route families hosted inside shared shell chrome, the target
model is now stricter still:

- the real app shell should consume the signed-off design-system page-shell
  source of truth
- page-level family adoption should happen inside that governed shell, not
  inside a locally reconstructed host
- login may remain an explicitly approved exception surface

For first-consumer governed adoption, the current architecture also expects an
explicit preflight and parity posture before the work is treated as complete:

- identify the exact signed-off source route, reference pack, or canonical
  truth
- declare the family-owned versus host-owned visible boundary
- confirm required CSS, render, and controller seams exist
- define consumer-level executable proof on the real app route
- define whether app-consumption entrypoints must stay visually identical to
  the canonical `/design-system` entrypoint or are intentionally narrower

This means "shared CSS plus local reconstruction" should be described as
partial or transitional adoption rather than as honest governed adoption.

### `login`

`src/frontend/login` currently exists only as a discovery seam placeholder.

Current posture:

- no implemented login route family is reported yet
- discovery keeps the `login` root family explicit so later work can add it
  without inventing a new frontend-family concept

## Ownership And Integration Rules

Current repo rules for frontend ownership are:

- frontend source lives under `src/frontend/`
- backend features remain authoritative for backend behavior under
  `src/features/*`
- frontend code must consume backend capabilities through approved HTTP/API
  seams rather than importing backend internals directly
- same-origin runtime does not collapse ownership boundaries between browser
  code and backend features

The current frontend stack is therefore separate in ownership even though it is
composed into one Express runtime.

## Browser Security And Session Model

Current browser security posture includes:

- least-privilege CSP configured in `src/app.ts`
- same-origin asset and API delivery
- root-admin browser session bootstrap through server-backed root-auth session
  endpoints
- secure cookie transport for root-admin browser sessions
- localhost `127.0.0.1` helper connectivity only for the root-auth signer flow

The current root-admin auth path is browser-oriented rather than bearer-token
oriented, even though the backend still supports bearer-based protected API
flows for other surfaces.

## Frontend Discovery And Curated Topology

This repo has an additional frontend architecture layer beyond the served UI:
implemented frontend topology is also cataloged as durable discovered truth.

Current discovery posture:

- `/design-system` routes are discovered from HTML files
- selected `/root-admin` user-facing suite routes are discovered as canonical
  path-backed page surfaces
- legacy `/root-admin#...` links remain compatibility aliases during the
  migration window rather than canonical discovered route truth
- root-admin helper downloads are discovered as support-only routes
- discovered frontend truth is persisted through the
  `webAppSurfaceDiscovery` feature
- curated operator-facing hierarchy remains separate from raw discovered truth
  through the `webAppHierarchyBuilder` feature

This gives the repo both:

- implemented frontend runtime surfaces
- durable source-independent knowledge of those surfaces for review,
  reconciliation, and later automation

## Maintenance Rule

Keep this document current when a change affects frontend architecture rather
than only local page behavior or styling.

Typical update triggers:

- adding or removing a frontend route family
- changing how frontend routes are mounted in the Express app
- changing the browser auth/session model
- changing frontend routing style such as file-routed versus shell-state routed
- changing how frontend code is built, copied, or served
- introducing a new durable frontend discovery or topology-management seam
- changing the boundary between frontend runtime and backend feature seams
- adding generated canonical route registry entries for governed design-system
  component, pattern, or page-template child families

When the change is an enduring architectural decision rather than only a
current-state refresh, also create or update an ADR in `docs/architecture/adr/`.
