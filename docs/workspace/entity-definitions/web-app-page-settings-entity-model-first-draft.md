# Web App Page Settings Entity Model First Draft

## Status

- Draft status:
  first draft
- Intended future owning feature:
  `webAppPageSettings`
- Related owning features:
  - `webAppHierarchyBuilder`
  - `webAppSurfaceDiscovery`
- Purpose:
  define the next durable settings layer for governed app pages without
  overloading curated topology truth

## Why This Loop Exists

The platform now has durable truth for:

- curated page hierarchy and locators through `webAppHierarchyBuilder`
- discovered implementation truth through `webAppSurfaceDiscovery`
- deterministic preview/apply materialization for the first governed
  `design-system` slice

What it still does not have is a durable, source-independent place to record
page-attached configuration such as:

- icon selection
- curated context-navigation membership
- top-navigation visibility
- page-template intent beyond the first materialization-specific exception

Those decisions are not the same thing as topology.

Without a separate settings layer, the platform would either:

- overload `webAppHierarchyBuilder` with presentation and shell concerns
- leave page-level configuration trapped in frontend-only runtime logic
- or invent one opaque metadata blob that is hard to validate, reconcile, and
  materialize safely

## Goal

Define a durable settings model that:

- attaches only to existing curated pages
- keeps page configuration separate from page placement and locator truth
- can be consumed by operator workspaces, shell navigation builders, and later
  materialization or runtime application seams
- preserves the current rule that modules stay structural in v1

## Consolidated Decisions

- curated topology remains owned by `webAppHierarchyBuilder`
- discovered implementation truth remains owned by `webAppSurfaceDiscovery`
- page settings belong in a sibling feature rather than inside
  `webAppHierarchyBuilder`
- `displayLabel` remains the canonical page name for this phase
- page settings do not introduce nav-title or page-title overrides by default
- context navigation is manually curated from available pages rather than
  inferred from placement
- the default context navigation fallback is a self-only entry pointing to the
  page itself
- icon selection uses an approved `iconKey` catalog with one default fallback
- modules remain structural only in v1
- module landing-page selection is topology truth, not settings truth
- a module landing page may reference only a direct child page of that module

## Refined Truth Layers

### Curated Topology Truth

Owned by `webAppHierarchyBuilder`.

Answers:

- what root families, modules, and pages exist
- how pages are placed in the hierarchy
- how each page is reached
- whether a module has a landing page
- whether a topology change is proposed, applied, additive, blocked, or
  compatibility-sensitive

### Page Settings Truth

Owned by the future `webAppPageSettings` feature.

Answers:

- which icon a page should use
- which pages appear in that page's context navigation
- whether the page should appear in top navigation
- which approved page template the page intends to use

### Observed App Truth

Owned by `webAppSurfaceDiscovery`.

Answers:

- what the implementation currently exposes
- which discovered surfaces and structure nodes align or drift from curated
  truth

### Preview / Apply Truth

Composed from governed topology and downstream materialization seams.

Answers:

- what repo or runtime changes would happen if approved truth is applied
- whether a proposal is additive, blocked, or otherwise constrained

Preview/apply is not itself the owning truth for page settings or topology.

## Recommended Durable Entities

### 1. Web App Page Settings

- Description:
  durable one-to-one settings record for one curated page
- Why it exists:
  keeps page presentation and shell configuration out of topology rows while
  remaining durable, queryable, and governable

Recommended durable fields:

- `webAppPageSettingsId`
  Type / Shape: `UUID`
- `webAppPageId`
  Type / Shape: `UUID`
  Description:
  references one curated page owned by `webAppHierarchyBuilder`
- `iconKey`
  Type / Shape: `TEXT | NULL`
  Description:
  approved icon-catalog key; null means use the governed default icon
- `showInTopNav`
  Type / Shape: `BOOLEAN`
  Description:
  whether the page should appear as a top-navigation destination
- `topNavOrder`
  Type / Shape: `INTEGER | NULL`
  Description:
  ordering hint for visible top-navigation pages; null when the page is not in
  top navigation or when ordering is not yet curated
- `pageTemplateKey`
  Type / Shape: `TEXT | NULL`
  Description:
  approved template intent for the page; null only if later rules permit a
  default-template posture
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

Important constraints:

- unique one-to-one record per `webAppPageId`
- clients must not set system-managed ids or timestamps
- `topNavOrder` should be null or ignored when `showInTopNav` is false
- `iconKey` must resolve through an approved icon catalog when not null
- `pageTemplateKey` must resolve through an approved template catalog when not
  null

Important modeling note:

This record intentionally does **not** own the canonical page name in v1.
The page's `displayLabel` remains topology truth.

### 2. Web App Page Context Nav Item

- Description:
  durable curated membership row representing one page that should appear in
  another page's context navigation
- Why it exists:
  context navigation is a manually curated relationship set, not just a flag or
  enum on the page-settings row

Recommended durable fields:

- `webAppPageContextNavItemId`
  Type / Shape: `UUID`
- `ownerWebAppPageId`
  Type / Shape: `UUID`
  Description:
  page whose context navigation is being configured
- `targetWebAppPageId`
  Type / Shape: `UUID`
  Description:
  page that should appear as a selectable destination in that context
  navigation
- `sortOrder`
  Type / Shape: `INTEGER`
  Description:
  display order within the context-navigation set
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

Important constraints:

- unique `(ownerWebAppPageId, targetWebAppPageId)` pair
- targets must resolve to currently available curated pages through an approved
  reader seam
- settings workflows must preserve a deterministic order

Recommended default posture:

- if no explicit context-nav items exist for a page, the effective context
  navigation should be one self-targeting item for that same page
- the operator workflow should materialize explicit rows only when the user
  curates beyond the fallback or when the platform later chooses to persist the
  fallback explicitly

Important modeling note:

This entity defines what appears in the context navigation.
It does not define discovery truth, route placement, or page reachability.

## Related Topology Exception

### Module Landing Page Selection

Module landing-page behavior should remain topology-owned.

Recommended posture:

- add nullable landing-page truth to the curated module seam in
  `webAppHierarchyBuilder`
- the selected landing page must be a direct child page of the module
- page settings must not own or override this behavior

Why it stays topology-owned:

- it determines how module entry resolves structurally
- it depends on direct child placement rules
- it should participate in the same integrity checks as moves and route
  changes

## Operator Workspace Mapping

The current operator-facing workspace labels align to these truth layers:

- `Hierarchy`
  topology-owned structural editing and read flows
- `Page Settings`
  settings-owned configuration flows for a selected page
- `Observed App`
  discovered implementation and drift context
- `Preview & Apply`
  governed preview/apply consequences derived from the selected truth

These labels are UI grouping names only.
They do not redefine feature ownership.

## Open Implementation Notes

- The existing `design-system` materialization slice still stores
  `templateKey` on topology rows for compatibility; a later migration should
  move broader template intent toward page-settings ownership.
- A future design-system loop may need an icon-grid selector built from an
  approved shared pattern family rather than a plain list picker.
- The exact read seam for "available pages" in the context-nav multi-select
  flow should come from governed hierarchy reads rather than from ad hoc
  frontend scanning.
