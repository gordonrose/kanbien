# Design System Topology Materialization V1 Specification

## Implementation Status

- Status:
  planned first topology-materialization slice as of 2026-04-20
- Implemented already in related foundations:
  - durable curated hierarchy truth in `webAppHierarchyBuilder`
  - durable discovered route and structure truth in
    `webAppSurfaceDiscovery`
  - read-first hierarchy rendering in the governed `hierarchy-tree` family
  - architecture rules for durable topology, deterministic materialization,
    and security-first page-state replay
- Not yet implemented in this slice:
  - proposed versus applied topology state for governed page creation
  - preview-first design-system materialization
  - apply-first design-system materialization into repo files
  - deterministic creation of new `design-system` page folders and
    `index.html` entries from approved topology changes
  - lightweight documentation/governance stubs for materialized pages
  - explicit blocked handling for folder moves and page retirement in v1

## Purpose

Define the first controlled topology-materialization slice so the platform can
add new pages and subpages to `design-system` through curated topology truth
instead of relying on ad hoc repo edits.

The platform can now:

- model curated hierarchy truth
- discover current implemented design-system routes from the repo
- render a read-first page tree through the governed `hierarchy-tree` family

What it still cannot do intentionally is:

- create new design-system pages through approved backend capabilities
- preview which repo changes would occur before a page is materialized
- apply a confirmed topology change and create the corresponding repo scaffold
- keep proposed page-tree edits separate from applied route truth
- refresh the page tree immediately from applied truth after a successful
  change

This slice introduces the first deterministic preview/apply topology workflow
for one governed frontend family.

It establishes:

- `design-system` as the first governed materialization family
- proposed versus applied topology separation
- deterministic preview/apply behavior rather than silent repo mutation
- page creation through explicit capabilities only
- shared system CSS as the default styling posture for new pages
- folder creation without later folder moves in v1

---

## Scope

This phase includes:

- an additive extension to `src/features/webAppHierarchyBuilder/`
- one governed operator workflow for `design-system` page creation and subpage
  creation
- deterministic preview of repo changes before apply
- deterministic apply that creates:
  - the page folder
  - `index.html`
  - route-entry-equivalent file structure for `design-system`
  - no page behavior module stub by default for the approved v1 template
  - a lightweight documentation/governance stub at
    `docs/workspace/design-system/generated-pages/<page-slug>.md`
- immediate page-tree refresh from applied truth after successful apply
- explicit blocked behavior for folder moves and destructive route retirement
  in v1

This phase does **not** include:

- `root-admin` topology materialization
- folder moves or folder renames after creation
- page retirement or delete behavior that removes browser routes
- automatic alignment of folder structure to every later tree move
- page-local stylesheet generation by default
- promotion of journey-state into durable topology
- rich snapshot-backed page-state replay
- silent repo edits outside explicit preview/apply

---

## Core Concepts

### Curated topology truth

The curated topology model is the authoritative source of truth for durable
pages and subpages in the governed family.

For this slice, it answers:

- which `design-system` pages should exist
- how those pages are arranged in the durable page tree
- which changes are still proposed versus applied

### Proposed topology

Proposed topology is the draft state created by an operator before a repo
materialization apply occurs.

It must be:

- explicit
- reviewable
- previewable
- reversible before apply

### Applied topology

Applied topology is the durable state that has already been accepted and
materialized into the repo.

The page tree shown after successful apply should reflect applied truth, not an
optimistic client-side guess.

### Design-system materialization

In this route family, route entry is primarily implied by folder structure and
`index.html`.

For v1, materialization means:

- create the page folder
- create `index.html`
- require the approved v1 template key `static-html-page`
- do not create a behavior module stub by default for that template
- create a lightweight documentation/governance stub at
  `docs/workspace/design-system/generated-pages/<page-slug>.md`

It does **not** mean:

- moving folders after creation
- creating page-local CSS by default
- inventing functionality beyond scaffold creation

### Shared system CSS default

New pages should rely on shared system CSS by default.

Page-local stylesheets are considered an exception posture, not the normal
materialization output for this slice.

### Preview-first safety

No materialization should happen without:

- explicit proposed change
- deterministic preview classification
- human confirmation through an approved workflow

Preview must classify planned changes as:

- additive
- compatibility-sensitive
- blocked
- invalid

### Immediate tree refresh

After a successful apply:

- curated applied truth must be updated
- materialization must complete or fail honestly
- the page tree must refresh from the updated applied source of truth

This should not depend on hidden background LLM work or manual rescan steps in
the normal success path.

---

## Recommended Feature Boundary

Keep the owning backend feature:

`src/features/webAppHierarchyBuilder/`

This slice should own:

- proposed page and subpage creation records or fields
- preview classification for design-system materialization
- apply logic for design-system page materialization
- page-tree refresh reads from applied truth
- blocked handling for folder moves and retire/delete requests in v1

This slice should not own:

- discovery provider logic
- direct discovery persistence internals
- automatic folder/tree realignment refactors
- page-local business behavior inside created pages
- replay snapshot infrastructure

Related frontend boundary:

- the governed `hierarchy-tree` family should remain the UI surface where this
  workflow is eventually surfaced
- no ungoverned one-off frontend control path should bypass the approved
  preview/apply workflow

---

## Proposed Durable Behavior

### Create design-system page

An authorized root operator can create a new proposed `design-system` page.

Minimum input:

- parent topology node or approved location
- display label
- route segment
- selected page template key `static-html-page`

Expected outcomes:

- proposed topology row exists
- preview can classify the repo materialization
- apply can create the new page scaffold

### Create design-system subpage

An authorized root operator can create a new proposed child page beneath an
existing approved parent.

Expected outcomes are the same as page create, but with explicit parent-child
topology placement.

### Rename display label

Display-label change is allowed in v1 as a low-risk metadata update.

It should not by itself force folder movement.

### Rename route segment

Route-segment rename is allowed only through preview plus explicit human
confirmation.

It is compatibility-sensitive because it changes a browser address.

### Logical tree move

Logical tree moves may be previewed in v1, but they must not trigger folder
movement in this slice.

If the move requires physical repo relocation to remain honest, the preview
should return a blocked or deferred posture rather than making up a strategy.

### Delete or retire page

Retire/delete behavior is out of scope in v1.

The system should block it explicitly rather than pretending to support it.

---

## API And Workflow Expectations

This slice should use these protected routes:

- `POST /v1/web-app-hierarchy/design-system/pages`
- `POST /v1/web-app-hierarchy/design-system/subpages`
- `POST /v1/web-app-hierarchy/design-system/materialization/preview`
- `POST /v1/web-app-hierarchy/design-system/materialization/apply`
- `GET /v1/web-app-hierarchy/design-system/applied-tree`

Rules:

- all routes require authenticated root session
- all write routes require explicit root capabilities
- clients may not submit raw repo diffs or arbitrary file-write instructions
- the backend remains authoritative for preview classification and apply
  execution
- blocked operations must return explicit feature-owned blocked/conflict errors
- the workflow-specific applied-tree read must stay separate from the broader
  `GET /v1/web-app-hierarchy/tree` seam so this slice does not silently change
  an existing read contract

Exact new write capabilities for this slice are:

- `web-app-hierarchy.create-design-system-page`
- `web-app-hierarchy.create-design-system-subpage`
- `web-app-hierarchy.preview-design-system-materialization`
- `web-app-hierarchy.apply-design-system-materialization`

The applied-tree read should reuse the existing
`web-app-hierarchy.read-tree` capability.

All four new write capabilities should be introduced through an additive
migration and granted to `RootUserAdmin` with mandatory/protected posture.

---

## Repo Materialization Rules

For a newly created page, the first materialization slice may create:

- one folder in the approved `src/frontend/designSystem/` location
- one `index.html`
- no page behavior module stub by default for the approved v1 template
- one lightweight documentation/governance stub at
  `docs/workspace/design-system/generated-pages/<page-slug>.md`

The first slice must not create by default:

- page-local CSS files
- arbitrary placeholder feature logic
- fake full test implementations for empty pages

Folder creation is allowed.

Folder movement or rename after creation is blocked in v1.

That means curated page-tree truth and folder layout may temporarily diverge
under governed rules.

---

## Security And Authorization Expectations

- only authenticated root users with approved capabilities may create, preview,
  or apply topology changes
- client-side UI must not be treated as sufficient authorization
- replay/security rules from ADR `0025` still apply to any future page-state
  debugging tied to this workflow
- deterministic backend code must decide whether a change is additive,
  compatibility-sensitive, blocked, or invalid
- the system must not invent unapproved behavior without human confirmation

---

## Compatibility Posture

Defaults for v1:

- page create is additive
- subpage create is additive
- display-label rename is low risk
- route-segment rename is compatibility-sensitive
- folder move is blocked
- folder rename is blocked
- page retire/delete is blocked

The slice should not introduce redirects or alias handling yet unless the PRD
is later expanded explicitly.

---

## Verification Expectations

Required verification should cover:

- unit tests for preview classification and blocked-operation logic
- integration tests for create, preview, apply, and post-apply tree refresh
- security tests for authenticated/unauthorized access boundaries
- audit visibility for denied attempts and any approved success-side audit if
  the capability design requires it
- edge coverage for duplicate segments, invalid parent placement, blocked
  folder movement, and stale preview/apply sequencing
- frontend coverage once the browser workflow is implemented through the
  governed hierarchy surface
- compatibility-focused coverage for route-segment rename classification

---

## Documentation And Standards Expectations

Before implementation is considered complete, the change loop should refresh:

- PRD-derived test-case doc
- capability matrix
- implementation blueprint
- feature docs if public feature truth changes
- API contract docs for any new protected routes
- OpenAPI and Postman if maintained for the affected seam
- relevant platform-status snapshots if the slice changes current evidence or
  control posture

---

## Open Questions To Keep Explicit

These questions remain intentionally deferred and should not be silently solved
inside implementation:

- how and when folder/tree alignment should later be reconciled
- whether `root-admin` should remain hash-backed, partially path-backed, or
  migrate toward path-backed durable pages
- whether delete/retire behavior should later create redirects, aliases, or
  other compatibility support
- whether replay/snapshot support should later be added to the operator
  workflow
