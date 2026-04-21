# Web App Hierarchy Structure-Aware Reconcile Extension Specification

## Implementation Status

- Status:
  planned backend extension slice as of 2026-04-19
- Implemented already in the hierarchy and discovery foundations:
  - durable root-family, module, and page persistence
  - root-only protected hierarchy routes under `/v1/web-app-hierarchy`
  - resolved curated hierarchy-tree reads
  - root-triggered discovery runs
  - durable discovered surface truth
  - durable discovered structure truth
  - exported discovery seams for current discovered surfaces and current
    discovered structure nodes
  - a first chained discovery sync for a limited single-segment path subset
- Not yet implemented in this extension:
  - preview-first structure-aware reconcile in `webAppHierarchyBuilder`
  - apply-first structure-aware reconcile in `webAppHierarchyBuilder`
  - durable curated page-locator seam
  - durable discovery-to-curated link seam
  - structure-aware drift-status read seam
  - honest import of multi-segment path families into curated hierarchy
  - honest import of hash-state discovered pages into curated hierarchy

## Purpose

Define the next backend extension slice for `webAppHierarchyBuilder` so the
platform can intentionally reconcile discovered structure truth into curated
hierarchy truth and make `GET /v1/web-app-hierarchy/tree` accurate after sync.

The platform can now discover:

- what real implemented surfaces exist
- how those surfaces are grouped in the discovered tree
- whether discovered leaves are path-backed pages, hash-backed shell states,
  support-only routes, or stale

What it still cannot do honestly is:

- map multi-segment discovered structure into curated modules and pages
- represent hash-state pages such as `/root-admin#users` as real curated pages
- persist durable links between discovered truth and curated truth
- report drift programmatically through a first-class read seam
- let an operator preview reconcile outcomes before apply mutates the curated
  hierarchy

This extension introduces the hierarchy-side reconcile layer required for:

- structure-aware preview
- structure-aware apply
- durable page-locator truth
- durable discovery-link truth
- durable drift and match reporting

It also establishes:

- separation between discovered truth and curated truth
- durable linkage rather than ad hoc inferred matching
- honest treatment of hash-state pages through a locator seam
- preview-first operator safety before mutation

---

## Scope

This phase includes:

- an additive extension to `src/features/webAppHierarchyBuilder/`
- durable storage for:
  - `webAppPageLocator`
  - `webAppDiscoveryLink`
- root-only protected preview and apply routes under `/v1/web-app-hierarchy`
- a root-only drift and link-status read route
- structure-aware reconcile logic that consumes the public
  `webAppSurfaceDiscovery` seam
- explicit hash-state page support through the locator seam
- structure-aware module and page creation or reuse from discovered tree truth
- structure-aware sync summary and blocked or drifted result reporting

This phase does **not** include:

- frontend hierarchy editor UI
- tenant-facing hierarchy editing
- automated scheduled or event-driven reconcile
- silent live-route breaking changes
- redirect or alias support for breaking locator changes
- arbitrary automatic metadata overwrites
- deletion of curated pages or modules because discovery changed

Those later concerns should build on this durable reconcile seam rather than
being collapsed into it.

---

## Core Concepts

### Discovered truth

Owned by `webAppSurfaceDiscovery`.

Answers:

- what the implementation exposes right now
- how that implementation is grouped in the discovered tree
- what locator shape a discovered leaf uses
- whether a discovered item is current or stale

Examples:

- `/design-system/components/top-nav`
- `/design-system/patterns/hierarchy-tree/render`
- `/root-admin#users`

### Curated hierarchy truth

Owned by `webAppHierarchyBuilder`.

Answers:

- which modules and pages we intentionally maintain
- how they are placed in the curated tree
- what lifecycle and ordering posture they have
- how a curated page is actually reached

### Page locator truth

Also owned by `webAppHierarchyBuilder`.

This extension introduces `webAppPageLocator` so a curated page can be reached
honestly through:

- a `path` locator
- a `hash-state` locator

without overloading the page row itself with mutually exclusive route-shape
fields.

### Discovery link truth

Also owned by `webAppHierarchyBuilder`.

This extension introduces `webAppDiscoveryLink` so the system can persist:

- what discovered node maps to what curated module or page
- whether that relationship is currently matched, drifted, blocked, or stale
- when it was last compared or last matched

### Preview-first reconcile

Preview is a first-class capability in this slice.

Why:

- operators want to play around first
- reconcile should be inspectable before mutation
- preview is the safest place to surface:
  - module creates
  - page creates
  - locator posture
  - blocked hash or path cases
  - unmatched discovered truth
  - drift

### Apply reconcile

Apply is the intentional mutation step that:

- creates or reuses curated modules
- creates or reuses curated pages
- creates or refreshes page locators
- creates or refreshes discovery links
- returns the updated curated hierarchy tree

### Drift truth

Drift is not a single boolean.

This extension must support typed drift states such as:

- `locator-drift`
- `placement-drift`
- `metadata-drift`
- `lifecycle-drift`
- `stale-discovered`
- `blocked-locator`
- `blocked-ambiguity`

This is required so programmatic reads can answer what changed and why without
re-inferencing the relationship ad hoc.

---

## Recommended Feature Boundary

Keep the same hierarchy owner:

`src/features/webAppHierarchyBuilder/`

This extension should own:

- page-locator persistence
- discovery-link persistence
- preview and apply reconcile logic
- link and drift reads
- curated tree updates after apply

This extension should not own:

- discovered surface or structure persistence
- provider discovery logic
- event-driven sync orchestration
- frontend operator UI

Related feature boundary:

- `src/features/webAppSurfaceDiscovery/`
  remains the owner of discovered truth
- `webAppHierarchyBuilder`
  should consume only the public discovery seam, never discovery persistence
  files directly

---

## Proposed Durable Entities

### Web App Page Locator

Expected minimum fields:

- `webAppPageLocatorId`
- `webAppPageId`
- `locatorType`
  - `path`
  - `hash-state`
- `canonicalLocator`
- `routePath`
- `routeHash`
- `normalizedLocatorKey`
- `isActive`
- `createdByRootAdminUserId`
- `createdAt`
- `updatedAt`

Important rules:

- one active locator per curated page in this loop
- `path` requires `routePath` and null `routeHash`
- `hash-state` requires both `routePath` and `routeHash`
- active locator keys must remain unique under the approved route-identity rule

### Web App Discovery Link

Expected minimum fields:

- `webAppDiscoveryLinkId`
- `discoveredWebAppStructureNodeId`
- `discoveredWebAppSurfaceId`
- `rootFamilyId`
- `curatedTargetType`
  - `module`
  - `page`
- `webAppModuleId`
- `webAppPageId`
- `linkStatus`
  - `matched`
  - `imported`
  - `blocked`
  - `unmatched-discovered`
  - `unmatched-curated`
  - `stale-discovered`
  - `drifted`
- `driftStatus`
  - `none`
  - `locator-drift`
  - `placement-drift`
  - `metadata-drift`
  - `lifecycle-drift`
  - `stale-discovered`
  - `blocked-locator`
  - `blocked-ambiguity`
- `driftSummary`
- `lastComparedDiscoveryRunId`
- `lastMatchedAt`
- `blockedReason`
- `importSource`
- `createdAt`
- `updatedAt`

### Reconcile preview item

This may begin as a strongly shaped read model instead of a persisted table,
but it must be explicit in the contract.

Expected first-pass fields:

- `previewItemType`
- `discoveredWebAppStructureNodeId`
- `discoveredWebAppSurfaceId`
- `proposedCuratedTargetType`
- `existingWebAppModuleId`
- `existingWebAppPageId`
- `proposedPageLocatorType`
- `proposedCanonicalLocator`
- `status`
- `reasonCode`
- `summary`

---

## Mapping Rules

### Discovered root nodes

Discovered root nodes should map to existing root families only.

Rules:

- this slice must not create new root families automatically
- discovered root-family scope and curated root-family scope must match

### Discovered group nodes

Discovered `group` nodes should map to curated `modules` by default.

Rules:

- reuse an existing compatible module when the match is clear and safe
- otherwise create a new module when the approved apply posture allows it
- do not flatten a discovered group away silently

### Discovered leaf nodes

Discovered leaf nodes should map to curated `pages`.

Rules:

- path-backed discovered leaves should become path-backed curated pages through
  the locator seam
- hash-state discovered leaves should become hash-state curated pages through
  the locator seam
- support-only or review-required discovered leaves should remain blocked or
  explicitly skipped unless a later approved rule changes that posture

### Root index routes

Root index routes such as:

- `/design-system`
- `/login`

should import as curated pages only if the hierarchy plus locator model can
represent them honestly.

If not, preview must surface a blocked item with an explicit reason rather than
inventing a fake route segment.

### Existing curated node reuse

Existing curated nodes should be reused only when the match is clear and safe.

Examples of clear and safe:

- same root family
- compatible target type
- compatible module or page identity
- compatible locator posture where applicable

Ambiguous matches must remain blocked or drifted, not silently merged.

---

## Capability Definitions

### Preview structure-aware sync

Purpose:

- compare discovered structure truth to current curated hierarchy truth before
  mutation

This capability must:

- consume current discovered structure and discovered surface reads
- consume current curated modules and pages
- consume current page-locator truth
- consume current discovery-link truth when it exists
- return:
  - safe creates
  - safe matches
  - blocked items
  - unmatched items
  - drifted items

This capability must not:

- create modules
- create pages
- create locators
- write links

### Apply structure-aware sync

Purpose:

- intentionally mutate curated truth from the approved preview posture

This capability must:

- create or reuse modules
- create or reuse pages
- create or refresh one active locator per page
- create or refresh discovery-link rows
- return the updated curated hierarchy tree and sync summary

This capability must not:

- delete curated rows because discovery changed
- collapse discovered truth and curated truth into one record
- silently overwrite metadata drift unless explicitly approved in the request
  posture

### Read link and drift status

Purpose:

- expose the current match, block, stale, and drift posture through a stable
  read seam

This capability should support:

- `rootFamilyId`
- `linkStatus`
- `driftStatus`
- `curatedTargetType`
- exact discovered ids
- exact curated ids
- pagination

---

## API Direction

Recommended first-pass routes:

- `POST /v1/web-app-hierarchy/discovery-sync/preview`
- `POST /v1/web-app-hierarchy/discovery-sync/apply`
- `GET /v1/web-app-hierarchy/discovery-links`

Recommended current authz capabilities:

- `web-app-hierarchy.preview-discovery-sync`
- `web-app-hierarchy.apply-discovery-sync`
- `web-app-hierarchy.read-discovery-link-status`

The existing convenience sync route may later be rebuilt on top of preview plus
apply, but this extension should not treat the convenience route as the
architectural core.

---

## Persistence And Migration Impact

This extension will likely require a non-trivial migration because the current
implemented hierarchy model is path-segment-shaped.

Expected persistence changes:

- add `web_app_page_locators`
- add `web_app_discovery_links`
- update `web_app_pages` compatibility posture so existing rows can coexist
  with the new locator seam during migration

Expected migration questions:

- how existing path-backed pages populate their first active locator rows
- how `routeSegment` and `resolvedFullRoutePath` behave during transition
- whether `routeSegment` remains canonical for path pages temporarily
- how tree reads stay backwards compatible while locator truth moves into the
  child seam

This extension should prefer:

- additive migrations
- compatibility reads
- explicit later cleanup over one risky destructive reshape

---

## Drift Reporting Semantics

Programmatic drift should be typed.

Recommended first-pass drift types:

- `locator-drift`
- `placement-drift`
- `metadata-drift`
- `lifecycle-drift`
- `stale-discovered`
- `blocked-locator`
- `blocked-ambiguity`

Drift reporting should compare:

- current discovered structure truth
- current discovered surface truth
- current curated module and page truth
- current page-locator truth
- current discovery-link truth

This is how the system should later answer:

- what was discovered
- what was imported
- what is unmatched
- what may be stale
- what drifted

without one ambiguous combined model.

---

## Compatibility And Safety Rules

- backwards compatibility is required by default
- `GET /v1/web-app-hierarchy/tree` must remain a pure curated read
- preview must remain no-mutation
- apply must not delete curated hierarchy because discovery no longer sees a
  node
- support-only routes must not be silently imported as user-facing pages
- hash-state pages must be represented honestly through the locator seam
- metadata drift should be reported by default rather than silently overwritten
- live-route compatibility blockers remain relevant when apply would alter a
  live curated page’s locator posture

---

## Success Criteria

This extension is successful when:

- a privileged root operator can preview structure-aware reconcile outcomes
  before mutation
- a privileged root operator can apply structure-aware reconcile intentionally
- multi-segment discovered path families can become accurate curated modules
  and pages after apply
- hash-state discovered leaves can become real curated pages without being
  faked as path pages
- link and drift posture are explicitly queryable
- `GET /v1/web-app-hierarchy/tree` becomes accurate after apply because curated
  truth was updated from the discovered tree

---

## Out Of Scope For This PRD

- frontend operator UI for preview or apply
- scheduled or event-driven reconcile
- auto-apply without preview semantics
- redirect and alias management for breaking locator changes
- tenant-facing hierarchy editing
- soft-delete or destroy semantics for current hierarchy entities
- multiple active locators per page

Those may become follow-on loops once the structure-aware reconcile and
locator-link foundation exists.
