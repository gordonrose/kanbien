# Design System Canonicals Foundation Specification

## Implementation Status

- Status:
  planned first canonical-governance foundation slice as of 2026-04-21
- Implemented already in related foundations:
  - public file-routed `design-system` frontend family under
    `src/frontend/designSystem/`
  - legacy canonical launcher and canonical render routes under
    `/design-system/canonicals/*` and existing component/template canonical
    routes
  - durable design-system topology and sync foundations in
    `webAppHierarchyBuilder`
  - durable page-template settings foundations in `webAppPageSettings`
  - durable discovered surface and structure truth in `webAppSurfaceDiscovery`
  - signed-off launcher-template and family-specific canonical reference packs
  - route and visual verification coverage for current canonical launcher and
    render surfaces
- Not yet implemented in this slice:
  - a dedicated `designSystemCanonicals` feature
  - durable canonical-family persistence
  - durable canonical-reference persistence
  - public generated canonical launcher routes under
    `/design-system/canonical-renderings/*`
  - public generated deterministic canonical render routes under
    `/design-system/canonical-renderings/:familyKey/:referenceId`
  - explicit page-tree sync for generated canonical routes
  - precise `canonical-rendering` page-template support in
    `webAppPageSettings`
  - parity-ready generated routes that can satisfy existing canonical route
    expectations family-by-family

## Purpose

Define the first persistence-backed canonical-governance slice so the platform
can stop depending on scattered hardcoded launcher pages, hardcoded render
config arrays, and route-local query conventions as the only source of
canonical truth.

The platform can now:

- serve public design-system routes
- render signed-off legacy canonical launchers
- render signed-off legacy canonical surfaces
- capture source-independent reference truth in reference packs and related
  docs
- maintain a durable design-system page tree and durable page-template
  settings

What it still cannot do intentionally is:

- persist canonical-family truth durably
- persist canonical-reference truth durably
- generate launcher pages from approved stored family and ref records
- generate deterministic ref-specific canonical-rendering pages from approved
  stored definitions
- treat generated canonical routes as durable topology rather than hidden
  route-family side effects
- represent generated canonical render pages precisely as
  `canonical-rendering` in page-template settings
- prove family-by-family parity on a new generated route family before
  replacing legacy canonical routes

This slice introduces the first durable canonical-governance foundation and
the first additive public generated route family:

- `/design-system/canonical-renderings/*`

It establishes:

- a new `designSystemCanonicals` feature boundary
- family-level and ref-level canonical truth in persistence
- generated public launcher pages that reuse the shared `launcher` template
- generated public deterministic render pages that use the distinct
  `canonical-rendering` template
- additive rollout instead of immediate route replacement
- family-by-family signoff and parity review
- explicit page-tree and page-template integration for generated canonical
  routes

---

## Scope

This phase includes:

- a new feature under `src/features/designSystemCanonicals/`
- durable storage for:
  - canonical families
  - canonical references
  - bounded reference payloads
  - rollout and lifecycle metadata
- root-only protected governance routes for:
  - family create/update/read
  - reference create/update/read
- public generated launcher projection and route support for:
  - `/design-system/canonical-renderings/:familyKey`
- public generated deterministic render projection and route support for:
  - `/design-system/canonical-renderings/:familyKey/:referenceId`
- a narrow `webAppHierarchyBuilder` extension that syncs generated canonical
  launcher and render routes into the durable `design-system` page tree
- a narrow `webAppPageSettings` extension that adds the precise
  `canonical-rendering` template key while preserving `launcher` for
  canonical-launcher pages
- family-by-family parity posture so existing Playwright route and visual
  expectations can be exercised against the new generated route family where
  practical

This phase does **not** include:

- immediate replacement or retirement of the legacy
  `/design-system/canonicals/*` route family
- broad governance UI inside `root-admin` before the backend seams exist
- mutable exploration-state behavior on generated canonical-rendering routes
- arbitrary query-param overrides of deterministic canonical-render settings
- silent promotion of the generated route family into the only source of truth
- automatic redirect or alias retirement for legacy canonical routes
- a new template key for canonical launchers separate from `launcher`

Those later concerns should build on this durable foundation rather than being
collapsed into the first slice.

---

## Core Concepts

### Canonical family truth

Owned by the future `designSystemCanonicals` feature.

Answers:

- which canonical families exist
- which family key and label they use
- which launcher metadata applies
- which generated route posture applies
- which lifecycle and parity status the family currently has

Examples:

- `page-shell-banner`
- `top-nav`
- `list-detail-panel`
- `launcher`

### Canonical reference truth

Also owned by `designSystemCanonicals`.

Answers:

- which deterministic ref ids exist inside a family
- which exact render settings define that ref
- which generated render path applies
- which bounded family-specific payload is required
- which lifecycle and parity status the ref currently has

Examples:

- `PSBR-003`
- `TRP-007`
- `LDP-005`

### Generated canonical launcher route

A public additive route family:

- `/design-system/canonical-renderings/:familyKey`

This route should:

- be driven from persisted family and ref truth
- use the shared `launcher` template
- expose only live approved families and refs
- remain deterministic in membership and ordering

It should **not**:

- behave like an exploration route
- infer its visible ref set from frontend files
- silently replace the legacy canonical launcher family during the first slice

### Generated canonical-rendering route

A public additive route family:

- `/design-system/canonical-renderings/:familyKey/:referenceId`

This route should:

- be ref-specific
- be deterministic
- hydrate from persisted scalar settings plus bounded payload
- use the distinct `canonical-rendering` template

It should **not**:

- accept arbitrary query-param overrides for canonical state
- act as an exploration surface
- rely on route-local hardcoded specimen arrays as the source of truth

If a new deterministic state is needed later, the correct action is to add a
new canonical reference and sign it off rather than broadening the route into a
preview surface.

### Legacy canonical parity posture

Legacy routes remain available during this slice.

This foundation assumes:

- generated routes are additive
- parity should be proven family-by-family
- generated routes may become the family signoff surface once a family passes
  parity review
- legacy routes are not silently redirected or retired in the first slice

### Page-tree integration

Generated canonical-launcher and canonical-rendering routes are durable
`design-system` places, not support-only transient paths.

This means:

- they should be representable in the durable design-system page tree
- `webAppHierarchyBuilder` should sync them through an approved seam from
  `designSystemCanonicals`
- the sync must not scrape frontend files directly as its source of truth

Recommended shape:

- one durable page-tree node for each generated launcher page
- child page-tree nodes for generated canonical-rendering routes beneath the
  corresponding launcher family

### Page-template intent

Canonical launcher pages intentionally reuse the existing `launcher` template.

Canonical render pages require a distinct precise template key:

- `canonical-rendering`

This precision matters because the page-settings system should not need to infer
whether a route is a launcher-style page or a deterministic ref-specific
rendering page.

---

## Recommended Feature Boundary

Create the owning backend feature:

`src/features/designSystemCanonicals/`

This slice should own:

- canonical-family persistence
- canonical-reference persistence
- bounded ref payload persistence
- protected governance routes
- public launcher/read projection
- public deterministic render/read projection

This slice should not own:

- durable page-tree truth
- page-template settings persistence
- frontend file-route discovery
- broad governance UI
- exploratory preview-state behavior

Related feature boundaries:

- `webAppHierarchyBuilder`
  keeps owning durable page-tree truth and any sync that registers generated
  routes as topology
- `webAppPageSettings`
  keeps owning durable page-template intent
- `webAppSurfaceDiscovery`
  remains the owner of discovered frontend route truth and should not become
  the canonical-governance source

Related frontend boundary:

- generated canonical launcher routes live in the public `design-system`
  frontend family and consume the shared `launcher` template
- generated canonical-rendering routes live in the same public family and
  consume a distinct `canonical-rendering` template
- no new route-local exploration behavior should be introduced on generated
  canonical-rendering routes

---

## Proposed Durable Behavior

### Govern canonical families

An authorized root operator can create and update canonical-family records.

Minimum governed fields:

- family key
- display label
- generated launcher route posture
- legacy launcher route posture when retained
- launcher metadata and descriptive copy
- ordering and featured posture
- lifecycle state
- parity rollout state

Expected validation:

- normalized family key uniqueness
- generated launcher path uniqueness
- stable route posture
- no client-supplied system-managed ids or timestamps

### Govern canonical references

An authorized root operator can create and update canonical-reference records
within a family.

Minimum governed fields:

- ref id
- display label
- descriptive circumstance
- generated deterministic render path
- scalar render settings such as width, theme, direction, zoom, fixture, and
  similar approved dimensions
- bounded family-specific payload
- ordering and featured posture
- lifecycle state

Expected validation:

- normalized ref id uniqueness within a family
- generated render path uniqueness
- payload version handling
- exact family membership validation
- no client-supplied system-managed ids or timestamps

### Read generated canonical launcher

A public visitor can load the generated launcher route for one family.

The response should include:

- template key `launcher`
- public family metadata
- ordered visible refs
- generated links to ref-specific render pages
- approved descriptive notes when public display is allowed

The route should return:

- truthful not-found or inactive results when the family is not public/live
- only live/public refs

### Read generated canonical rendering

A public visitor can load one deterministic generated canonical-rendering route.

The response should include:

- template key `canonical-rendering`
- exact deterministic scalar render settings
- bounded specimen payload
- descriptive and review metadata allowed for public display

The route should return:

- truthful not-found or inactive results when the ref is not public/live
- one exact family/ref pair only

The route should not accept mutable query params as authority for canonical
state.

### Sync generated routes into the page tree

An authorized root operator can sync generated canonical routes into the
durable design-system page tree.

The sync should:

- read live family and ref truth through a narrow public seam from
  `designSystemCanonicals`
- create or refresh launcher nodes
- create or refresh child render nodes
- preserve explicit template posture:
  - `launcher`
  - `canonical-rendering`
- remain additive by default

The sync should not:

- silently delete unrelated curated pages
- silently repoint legacy `/canonicals` nodes
- scrape frontend route files as its source of truth

### Support precise page-template intent

The page-settings system should be able to represent generated canonical pages
precisely.

For this slice:

- generated canonical launcher pages stay on `launcher`
- generated canonical render pages use `canonical-rendering`

The settings layer should reject unsupported substitutions that blur those
template boundaries.

---

## Public Route Direction

### Additive generated route family

The new generated route family is:

- `/design-system/canonical-renderings/:familyKey`
- `/design-system/canonical-renderings/:familyKey/:referenceId`

This family is public from day one.

### Legacy route preservation

The first slice preserves:

- `/design-system/canonicals/*`
- current legacy canonical render routes

Why:

- parity needs a stable comparison target
- family-by-family signoff may move to generated routes over time
- route replacement should be an explicit follow-up decision, not a hidden
  side effect of the foundation slice

### Deterministic path posture

Generated renderings should be path-identified by exact family and ref id.

That means:

- the path names the canonical state
- persistence defines the state
- mutable query params do not redefine the canonical

This keeps the generated route family precise and deterministic.

---

## Persistence Direction

Recommended durable entities:

- canonical family
- canonical reference
- canonical reference payload
- rollout/lifecycle metadata

Expected persistence properties:

- normalized family-key uniqueness
- normalized ref-id uniqueness within a family
- unique generated launcher path
- unique generated render path
- ordered family-scoped listing for launcher projection
- exact family/ref reads for render projection

Expected persistence boundaries:

- common deterministic review fields should live in normal scalar columns
- bounded family-specific specimen details may live in a controlled payload
  shape
- page-tree truth remains outside this feature
- page-template intent remains outside this feature

### Migration direction

The first migration posture is additive.

It should:

- create the durable canonical tables
- seed capability rows and grants for protected governance and sync work
- seed initial family and ref truth from current executable canonical behavior
- preserve legacy identities and route posture while generated routes come
  online

It should not:

- delete or rename legacy canonical routes
- silently collapse launcher and render templates into one page-template key
- depend on inferred frontend-file truth as the only seed source

---

## API Direction

Protected governance routes should support:

- create/update/read canonical family
- create/update/read canonical reference

Public projection routes should support:

- exact launcher projection by family key
- exact render projection by family key and ref id

Integration routes should support:

- topology sync of generated canonical routes into the design-system page tree
- existing page-settings option/update routes extended for
  `canonical-rendering`

Exact route names may still be refined in implementation, but the capability
boundaries should remain stable.

---

## Authorization And Visibility

### Protected governance

Protected canonical governance is root-only.

Recommended new authz capability keys:

- `design-system-canonicals.family.manage`
- `design-system-canonicals.reference.manage`

Recommended topology integration key:

- `web-app-hierarchy.sync-design-system-canonical-renderings`

Recommended grant posture:

- `RootUserAdmin`
- mandatory/protected grant posture for the protected new keys

### Public generated reads

Generated launcher and render reads are public route capabilities.

They should not require root grants.

However, they must still enforce:

- lifecycle gating
- exact route resolution
- no exposure of draft or inactive families/refs

---

## Compatibility And Rollout Rules

### Default compatibility posture

Backwards compatibility is required by default.

For this slice, that means:

- keep legacy canonical routes available
- keep legacy family and ref identity recognizable during seed and parity work
- do not silently flip route authority from old to new

### Family-by-family rollout

The rollout should support:

- family-by-family generated-route activation
- family-by-family parity review
- family-by-family signoff on generated surfaces

This avoids one large risky cutover.

### Route authority clarity

The platform should be able to answer for each family:

- is the generated route planned, live, parity-reviewing, or signoff-approved?
- is the legacy route still the active comparison surface?

That rollout posture should be durable, not implied only by implementation
state.

---

## Verification Expectations

This slice needs verification at multiple layers.

### Backend verification

- family and ref validation logic
- persistence reads and writes
- exact public projection behavior
- lifecycle gating
- sync behavior into the page tree
- precise `canonical-rendering` template validation in page settings

### Public route verification

- generated launcher routes render truthful family/ref data
- generated render routes resolve one exact ref-specific canonical state
- generated routes stay inside current design-system shell/CSP posture

### Parity verification

Where practical, existing route and visual assertions should be reusable
against the new generated route family.

The foundation should support a test posture where:

- old canonical checks can be pointed at new generated routes
- parity can be proven family-by-family

### Frontend verification

- launcher pages still satisfy launcher-template expectations
- deterministic render pages satisfy canonical-render expectations
- no route-local exploration drift is introduced on generated render pages

---

## Capability Matrix

Related capability matrix:

- [2026-04-21-design-system-canonicals-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-21-design-system-canonicals-foundation-capability-matrix-first-draft.csv)

Related capability notes:

- [2026-04-21-design-system-canonicals-foundation-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-21-design-system-canonicals-foundation-capability-matrix-first-draft-notes.md)

---

## Acceptance Direction

This foundation is acceptable when the platform can:

- store canonical-family and canonical-reference truth durably
- serve generated public launcher and deterministic render routes from that
  truth
- keep generated render routes ref-specific and deterministic
- sync generated routes into the durable design-system page tree
- represent generated render pages precisely as `canonical-rendering` in
  page-template settings
- preserve additive compatibility with the legacy canonical family while
  generated parity is proven one canonical group at a time
