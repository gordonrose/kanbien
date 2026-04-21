# Web App Hierarchy Structure-Aware Reconcile Entity Model First Draft

## Status

- Draft status:
  first draft
- Intended future owning features:
  - `webAppHierarchyBuilder`
  - consuming `webAppSurfaceDiscovery` through its public seam
- Purpose:
  define the next durable entity layer needed so `webAppHierarchyBuilder` can
  reconcile against discovered structure truth and later return an accurate
  curated tree from `GetTree`

## Why This Loop Exists

The platform now has:

- durable discovered surface truth
- durable discovered structure truth
- current and stale discovery reads

That means the system can now answer:

- what implemented surfaces exist
- how those surfaces are grouped in the discovered app tree

What it still cannot do honestly is:

- map discovered structure into curated hierarchy truth for multi-segment route
  families
- represent hash-state pages such as `/root-admin#users` as first-class
  curated pages without pretending they are path pages
- explain, durably and programmatically:
  - what was imported
  - what was matched
  - what is unmatched
  - what is blocked
  - what drifted
  - what became stale

The current `webAppHierarchyBuilder` foundation is still path-segment-shaped:

- `webAppPage` stores `routeSegment`
- `resolvedFullRoutePath` is derived from page placement and ancestry
- the current chained discovery sync only supports simple single-segment path
  imports

That is no longer enough for the next loop, because discovery can now express
real structure for families such as:

- `/design-system/components/top-nav`
- `/design-system/patterns/hierarchy-tree/render`
- `/root-admin#users`

## Goal

Extend the `webAppHierarchyBuilder` entity model so it can durably store:

- curated page locator truth separate from the page row itself
- explicit discovery-to-curated link truth
- typed reconcile and drift posture derived from current discovery and current
  curated hierarchy

This should let the later capability loop support:

- structure-aware reconcile preview
- structure-aware reconcile apply
- honest import of path-backed pages and hash-state pages
- durable drift reporting without collapsing discovered truth into curated
  truth

## Consolidated Decisions

- discovered truth remains owned by `webAppSurfaceDiscovery`
- curated truth remains owned by `webAppHierarchyBuilder`
- discovered `group` nodes should map to curated `modules` by default in the
  next loop
- existing curated nodes should be reused only when the match is clear and
  safe
- root index routes should import when representable honestly; otherwise they
  should be blocked explicitly
- hash-state discovered leaves should be treated as real curated pages
- curated page locator truth should live in a separate child seam rather than
  being overloaded directly onto the page row
- discovery-to-curated linkage should be durable and explicit
- metadata drift should be reported rather than silently overwritten by default
- preview and apply should be modeled as distinct behaviors even if a
  convenience chained sync exists later

## Refined Truth Layers

### Discovered Truth

Owned by `webAppSurfaceDiscovery`.

Answers:

- what the implementation currently exposes
- how those surfaces are grouped in the discovered tree
- what locator shape the implemented leaf uses
- whether the discovered item is current or stale

Discovery is descriptive.

### Curated Hierarchy Truth

Owned by `webAppHierarchyBuilder`.

Answers:

- which root families, modules, and pages we intentionally maintain
- how they are placed in the curated tree
- what lifecycle or presentation metadata the curated node carries
- how a curated page is actually reached through its active locator

Curated hierarchy is intentional.

### Reconcile Truth

Jointly derived but owned durably by `webAppHierarchyBuilder` for the curated
side of the relationship.

Answers:

- which discovered nodes are linked to curated modules or pages
- whether a linked pair is still aligned
- what kind of drift exists
- what remains unmatched or blocked

Reconcile truth is comparative.

## Recommended Durable Entities

### 1. Web App Page Locator

- Description:
  durable locator record for one curated page
- Why it exists:
  prevents the `webAppPage` row from becoming an overloaded mix of path,
  hash-state, and future locator semantics

Recommended v1 posture:

- one curated page has exactly one active locator record
- future loops may permit multiple locators or historical locator versions,
  but this loop should not require that complexity

Recommended durable fields:

- `webAppPageLocatorId`
  Type / Shape: `UUID`
- `webAppPageId`
  Type / Shape: `UUID`
- `locatorType`
  Type / Shape:
  `'path' | 'hash-state'`
- `canonicalLocator`
  Type / Shape: `TEXT`
  Description: normalized canonical locator such as
  `/design-system/components/top-nav` or `/root-admin#users`
- `routePath`
  Type / Shape: `TEXT | NULL`
  Description:
  required for both `path` and `hash-state`
- `routeHash`
  Type / Shape: `TEXT | NULL`
  Description:
  required for `hash-state`, null for `path`
- `normalizedLocatorKey`
  Type / Shape: `TEXT`
  Description:
  stable normalized comparison key for uniqueness and drift checks
- `isActive`
  Type / Shape: `BOOLEAN`
  Description:
  exactly one active locator per page in this loop
- `createdByRootAdminUserId`
  Type / Shape: `UUID | NULL`
  Description:
  nullable for migration/bootstrap-created records
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

Important constraints:

- unique active locator per `webAppPageId`
- unique active `normalizedLocatorKey` across curated pages within the same
  root family or globally if the route model requires it
- check constraint:
  - `path` requires `routePath` and null `routeHash`
  - `hash-state` requires both `routePath` and `routeHash`

Important modeling note:

The current `webAppPage.routeSegment` and derived `resolvedFullRoutePath`
become insufficient as the only locator truth once hash-state pages are
first-class.

Recommended transition posture:

- keep current page fields temporarily for compatibility during migration
- move canonical page reachability truth into `webAppPageLocator`
- later decide whether `routeSegment` becomes a path-only convenience field,
  derived field, or is retired after compatibility work

### 2. Web App Discovery Link

- Description:
  durable explicit linkage between discovered truth and curated hierarchy truth
- Why it exists:
  lets the platform answer what was imported, matched, blocked, stale, or
  drifted without re-inferencing relationships every time

Recommended durable fields:

- `webAppDiscoveryLinkId`
  Type / Shape: `UUID`
- `discoveredWebAppStructureNodeId`
  Type / Shape: `UUID | NULL`
  Description:
  nullable only if a future exceptional link is leaf-only, but the normal
  posture should link structure truth
- `discoveredWebAppSurfaceId`
  Type / Shape: `UUID | NULL`
  Description:
  expected for leaf-backed discovered items
- `rootFamilyId`
  Type / Shape: `'root-admin' | 'login' | 'design-system'`
- `curatedTargetType`
  Type / Shape:
  `'module' | 'page'`
- `webAppModuleId`
  Type / Shape: `UUID | NULL`
- `webAppPageId`
  Type / Shape: `UUID | NULL`
- `linkStatus`
  Type / Shape:
  `'matched' | 'imported' | 'blocked' | 'unmatched-discovered' | 'unmatched-curated' | 'stale-discovered' | 'drifted'`
- `driftStatus`
  Type / Shape:
  `'none' | 'locator-drift' | 'placement-drift' | 'metadata-drift' | 'lifecycle-drift' | 'stale-discovered' | 'blocked-locator' | 'blocked-ambiguity'`
- `driftSummary`
  Type / Shape: `TEXT | NULL`
  Description:
  concise operator-facing summary of the most important drift or block reason
- `lastComparedDiscoveryRunId`
  Type / Shape: `UUID`
- `lastMatchedAt`
  Type / Shape: `TIMESTAMPTZ | NULL`
- `blockedReason`
  Type / Shape: `TEXT | NULL`
  Description:
  explicit machine-readable reason if current status is blocked
- `importSource`
  Type / Shape: `TEXT | NULL`
  Description:
  such as `discovery-preview-apply` or later chained sync marker
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

Important constraints:

- one active link per discovered structure node unless a later multi-target
  rule is explicitly approved
- target exclusivity:
  - `curatedTargetType = module` requires `webAppModuleId`
  - `curatedTargetType = page` requires `webAppPageId`
- discovered root-family scope and curated root-family scope must match

Why this entity is important:

Without this link seam the system would need to repeatedly guess whether:

- discovered `components` matches curated module `components`
- discovered `/root-admin#users` matches curated page `users`

That is brittle and makes drift detection hard to trust.

### 3. Web App Reconcile Preview Item

- Description:
  a durable or at least strongly shaped preview/read-model record describing
  what preview found before apply mutates curated truth
- Why it exists:
  the preview/apply model should have explicit comparison truth rather than a
  vague ad hoc response blob

Recommended first-pass posture:

- this may begin as a strongly shaped response model rather than a persisted
  table
- however, the entity-definition layer should still define it explicitly so
  the capability matrix and PRD can reference stable terms

Recommended fields:

- `previewItemType`
  Type / Shape:
  `'module-match' | 'module-create' | 'page-match' | 'page-create' | 'blocked' | 'unmatched' | 'drift'`
- `discoveredWebAppStructureNodeId`
  Type / Shape: `UUID`
- `discoveredWebAppSurfaceId`
  Type / Shape: `UUID | NULL`
- `proposedCuratedTargetType`
  Type / Shape:
  `'module' | 'page' | NULL`
- `existingWebAppModuleId`
  Type / Shape: `UUID | NULL`
- `existingWebAppPageId`
  Type / Shape: `UUID | NULL`
- `proposedPageLocatorType`
  Type / Shape:
  `'path' | 'hash-state' | NULL`
- `proposedCanonicalLocator`
  Type / Shape: `TEXT | NULL`
- `status`
  Type / Shape:
  `'safe-match' | 'safe-create' | 'blocked' | 'drift' | 'unmatched'`
- `reasonCode`
  Type / Shape: `TEXT | NULL`
- `summary`
  Type / Shape: `TEXT`

This entity definition is especially important because you want to:

- play around first
- see what would happen
- avoid mutating the underlying code base immediately

That means preview must be treated as a first-class domain capability, not as
an afterthought.

## Reconcile And Drift Semantics

### Programmatic Match States

Recommended current states:

- `matched`
  discovered and curated truth still align
- `imported`
  discovered truth was used to create curated truth
- `unmatched-discovered`
  discovered node exists with no curated link yet
- `unmatched-curated`
  curated node exists with no discovery link
- `blocked`
  discovered node cannot currently be reconciled automatically
- `stale-discovered`
  linked discovered truth is stale
- `drifted`
  a link exists but comparison no longer aligns

### Programmatic Drift Types

Recommended first-pass drift types:

- `locator-drift`
  locator changed between discovered and curated truth
- `placement-drift`
  parent/module position no longer aligns
- `metadata-drift`
  label or other safe metadata differs
- `lifecycle-drift`
  curated lifecycle posture no longer matches approved import expectations
- `stale-discovered`
  the discovered side is now stale
- `blocked-locator`
  discovered locator cannot be represented by the current curated rules
- `blocked-ambiguity`
  multiple plausible curated matches exist

Programmatic drift reporting should compare:

- current discovered structure truth
- current discovered surface truth
- current curated page locator truth
- current discovery link truth

That lets the system emit typed drift rather than one vague boolean.

## Recommended Entity Relationships

- `webAppModule`
  may be linked from one or more discovered `group` nodes over time through
  `webAppDiscoveryLink`
- `webAppPage`
  owns one active `webAppPageLocator`
- `webAppPage`
  may be linked from one discovered leaf structure node through
  `webAppDiscoveryLink`
- `webAppPageLocator`
  is compared directly to discovered surface locator truth for drift
- `webAppDiscoveryLink`
  references discovered structure truth and curated hierarchy truth explicitly

## Root Index Route Posture

Root index routes such as:

- `/design-system`
- `/login`

should import as curated pages only if the hierarchy model and locator seam
can represent them honestly.

If not, the preview layer should return a blocked item with an explicit reason
rather than silently inventing a fake route segment.

## Hash-State Page Posture

Hash-state discovered leaves such as:

- `/root-admin#users`

should be treated as real curated pages in this next loop.

That is why the locator seam exists:

- the page remains the hierarchy node
- the locator record expresses `hash-state` honestly

This avoids pretending a hash-backed shell state is a normal path page.

## Compatibility Notes

This loop will likely require a careful migration strategy because the current
implemented `webAppPage` model stores path-oriented route truth directly on the
page row.

Expected compatibility questions for the next artifacts:

- whether existing `routeSegment` remains canonical during a transition period
- whether `resolvedFullRoutePath` becomes path-locator-derived only
- how path-only pages migrate into `webAppPageLocator`
- how existing sync and read behavior stays backwards compatible while the new
  locator seam lands

Those questions should be made explicit in the next capability matrix and PRD,
not hidden inside implementation.

## What This Entity Layer Enables Next

With these entities in place, the next loop can define capabilities such as:

- `previewStructureAwareWebAppHierarchySync`
- `applyStructureAwareWebAppHierarchySync`
- later convenience `sync-discovery` built on preview plus apply

It also enables the future user-visible outcome you asked for:

- run root-driven discovery
- preview the resulting structure-aware reconcile plan
- apply it intentionally
- then have `GET /v1/web-app-hierarchy/tree` return curated truth that is
  accurately synchronized with the discovered app structure
