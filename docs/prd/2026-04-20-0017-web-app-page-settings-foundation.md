# Web App Page Settings Foundation Specification

## Implementation Status

- Status:
  planned first page-settings slice as of 2026-04-20
- Implemented already in related foundations:
  - durable curated hierarchy truth in `webAppHierarchyBuilder`
  - durable discovered route and structure truth in `webAppSurfaceDiscovery`
  - deterministic `design-system` preview/apply topology materialization
  - browser-wired root-admin hierarchy workspace under
    `/root-admin/web-app-hierarchy`
  - architecture rules for separating topology truth from settings truth
- Not yet implemented in this slice:
  - a sibling `webAppPageSettings` feature
  - durable page settings persistence keyed to curated pages
  - curated context-navigation membership persistence
  - approved settings-options read seams for icon/template catalogs
  - module landing-page selection inside the operator workspace
  - selected-page Page Settings panel in the real root-admin workspace

## Purpose

Define the first controlled page-settings slice so the platform can configure
durable app-surface presentation and navigation behavior without collapsing
that concern into curated topology truth.

The platform can now:

- model durable page hierarchy truth
- discover current implemented app surfaces
- preview/apply certain topology materialization flows
- render the hierarchy workspace as a real root-admin operator surface

What it still cannot do intentionally is:

- store icon choice durably per page
- store curated context-navigation membership durably per page
- store top-nav visibility durably per page
- represent general page-template intent outside the current
  materialization-specific exception
- set a module landing page through a governed operator workflow
- let an operator review and save those settings through the root-admin
  hierarchy workspace

This slice introduces the first durable page-settings foundation and the first
real operator workflow for selected-page settings.

It establishes:

- a sibling `webAppPageSettings` feature boundary
- separation between topology truth and settings truth
- a manually curated context-nav model with a self-only fallback
- a governed icon-catalog model with a default fallback icon
- topology-owned module landing-page selection as an explicit exception
- a unified root-admin workspace route with clearer operator-facing section
  labels

---

## Scope

This phase includes:

- a new feature under `src/features/webAppPageSettings/`
- durable storage for:
  - `webAppPageSettings`
  - `webAppPageContextNavItem`
- root-only protected read and write routes for page settings
- a root-only protected options/catalog read route for:
  - approved icon choices from the signed-off design-system icon catalog
    source when that pattern is ready
  - approved template choices
  - eligible context-nav target pages projected from curated hierarchy/tree
    truth
- a narrow `webAppHierarchyBuilder` extension for module landing-page
  selection
- a selected-page `Page Settings` section inside
  `/root-admin/web-app-hierarchy`
- a selected-module landing-page affordance inside the `Hierarchy` section

This phase does **not** include:

- page-label overrides separate from `displayLabel`
- uploaded or arbitrary custom icon assets
- discovery-owned drift or reconcile changes
- materialization changes beyond preserving current compatibility
- a new global workspace route family
- a new unapproved icon-grid real-app UI if the design-system family is not
  signed off yet
- tenant-facing settings editing

---

## Core Concepts

### Curated topology truth

Owned by `webAppHierarchyBuilder`.

Answers:

- what pages and modules exist
- where they sit in the durable tree
- how they are reached
- which direct child page is the landing page for a module

### Page settings truth

Owned by the future `webAppPageSettings` feature.

Answers:

- which icon a page uses
- which pages belong in that page's context navigation
- whether the page appears in the top nav
- which approved template the page intends to use

### Observed app truth

Owned by `webAppSurfaceDiscovery`.

Answers:

- what the current implementation exposes
- how discovered implementation aligns or drifts from curated truth

This slice consumes none of that truth as authority for settings.

### Manually curated context navigation

Context navigation is a curated page-to-page relationship set.

For v1:

- the operator chooses target pages manually from available curated pages
- the chosen targets are stored durably with deterministic order
- if no explicit targets exist, the effective context navigation is one
  self-targeting item that points to the page itself

This is intentionally not inferred from module membership or hierarchy
placement.

### Governed icon catalog

Icon choice uses approved catalog keys, not arbitrary payloads.

For v1:

- settings store an `iconKey`
- null means use the default fallback icon
- the backend returns approved icon choices through an options seam
- that icon catalog should come from the signed-off design-system icon
  catalog/icon-picker source when ready; until then, a governed checked-in
  manifest is acceptable

If a dedicated icon-grid selector is needed later, that remains a separate
design-system signoff concern rather than a blocker to durable settings
ownership.

### Module landing page

Modules remain structural containers in v1.

However:

- one direct child page may be designated as the module landing page
- that choice remains topology-owned
- the page-settings feature must not own or override it

### Unified workspace labels

`/root-admin/web-app-hierarchy` remains one operator workspace route.

The operator-facing section names are:

- `Hierarchy`
- `Page Settings`
- `Observed App`
- `Preview & Apply`

These are workspace labels only.
They do not redefine feature ownership.

---

## Recommended Feature Boundary

Create the owning backend feature:

`src/features/webAppPageSettings/`

This slice should own:

- settings persistence
- curated context-nav membership persistence
- options/catalog projection for the page-settings workflow
- selected-page settings reads and writes

This slice should not own:

- module landing-page selection
- page placement or locators
- discovery persistence
- repo materialization
- arbitrary icon assets or uploaded media

Related topology extension:

- `webAppHierarchyBuilder`
  keeps owning module landing-page selection and any structural integrity rules

Related frontend boundary:

- the root-admin workspace remains the real operator surface
- the `Page Settings` section must compose approved design-system families
  rather than inventing a page-local management form pattern

---

## Proposed Durable Entities

### Web App Page Settings

Expected minimum fields:

- `webAppPageSettingsId`
- `webAppPageId`
- `iconKey`
- `showInTopNav`
- `topNavOrder`
- `pageTemplateKey`
- `createdAt`
- `updatedAt`

Important rules:

- exactly one settings row per curated page
- `iconKey` must resolve through an approved icon catalog when present
- null `iconKey` means use the default fallback icon
- `pageTemplateKey` must resolve through an approved template catalog
- `displayLabel` remains topology-owned and is not duplicated here

### Web App Page Context Nav Item

Expected minimum fields:

- `webAppPageContextNavItemId`
- `ownerWebAppPageId`
- `targetWebAppPageId`
- `sortOrder`
- `createdAt`
- `updatedAt`

Important rules:

- unique target membership per owner page
- deterministic order per owner page
- target pages must come from approved curated page reads
- no explicit rows means effective self-only fallback

### Module landing-page truth

This slice should add or clarify one topology-owned field or child seam in
`webAppHierarchyBuilder` for:

- one nullable landing-page reference per module

Important rules:

- the landing page must be a direct child of that module
- descendant pages deeper than one level are invalid targets
- cross-module targets are invalid

---

## Proposed API Surface

### Page settings read

`GET /v1/web-app-page-settings/pages/:webAppPageId`

Rules:

- exact selected-page scope only
- returns explicit stored settings plus effective fallback values
- includes current curated context-nav targets in deterministic order

### Page settings update

`PUT /v1/web-app-page-settings/pages/:webAppPageId`

Rules:

- clients may submit only approved settings fields
- context-nav targets are replaced deterministically from the submitted exact
  set
- invalid icon keys, invalid template keys, duplicate targets, and
  nonexistent/ineligible target pages are rejected

### Settings options read

`GET /v1/web-app-page-settings/options?webAppPageId=:webAppPageId`

Rules:

- returns the approved icon catalog
- returns the approved template catalog
- returns eligible context-nav target pages for the selected page
- target-page options must be projected from `webAppHierarchyBuilder`
  curated tree truth or a narrow reader derived from that truth, not from a
  separate page-catalog feature
- does not rely on frontend hardcoded catalogs

### Module landing-page update

`PATCH /v1/web-app-hierarchy/modules/:webAppModuleId/landing-page`

Rules:

- accepts nullable `landingPageWebAppPageId`
- selected page must be a direct child of the module
- keeps this behavior topology-owned

---

## Validation And Defaults

### Canonical naming

- `displayLabel` stays on the topology side
- page settings do not introduce title or nav-label overrides in v1

### Icon defaults

- no selected icon resolves to the default fallback icon
- backend returns default-icon metadata through the options seam

### Context-nav defaults

- no explicit curated targets means effective self-only context navigation
- the fallback is truthful behavior, not merely a frontend placeholder

### Top-nav visibility

- `showInTopNav` governs whether a page should appear in top navigation
- `topNavOrder` matters only when the page is visible in top navigation

### Template compatibility

- page-template intent belongs with settings in the long-term model
- this slice must preserve compatibility with the current
  topology-owned `templateKey` posture already used by the `design-system`
  materialization flow

The first implementation must not silently break that coexistence.

---

## Frontend Workflow

### Selected-page Page Settings workflow

An authorized root operator can:

1. open `/root-admin/web-app-hierarchy`
2. select a page in the hierarchy tree
3. open or focus the `Page Settings` section
4. review current settings and approved options
5. change icon, context-nav targets, top-nav visibility, and template intent
6. save the settings
7. see truthful success, validation, denied, or failure states

### Selected-module landing-page workflow

An authorized root operator can:

1. select a module in the hierarchy tree
2. use the `Hierarchy` section to set or clear the module landing page
3. choose only from direct child pages of that module
4. save the change and see truthful success or validation errors

### Frontend constraints

- the route stays one workspace
- browser state such as open panel or selected node remains local workflow/UI
  state, not new durable topology
- real-app UI must use already governed design-system patterns unless a new
  required pattern is signed off first

---

## Security, Audit, And Standards Expectations

- all new routes remain root-only protected routes
- root-authenticated session context is required
- backend capability enforcement is mandatory even if the UI hides controls
- denied attempts should remain audit-visible through existing shared authz
  audit posture
- successful privileged mutations should be reviewed for explicit audit
  visibility in the implementation loop
- no secrets or sensitive user data are introduced; this slice stores
  operator-facing internal configuration only
- existing ASVS, QA release-gate, and anti-drift requirements remain in force

---

## Out-Of-Scope Follow-On Questions

- whether page settings later gain nav-label or page-title overrides
- whether top-nav membership needs richer grouping beyond visibility plus
  ordering
- whether icon-grid selection becomes a dedicated signed-off design-system
  family
- whether later route families beyond `root-admin` and `design-system` consume
  the same settings truth directly
- whether settings should later influence materialization outputs beyond
  current template compatibility
