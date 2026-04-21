# Web App Surface Discovery Foundation Specification

## Implementation Status

- Status:
  planned backend foundation slice as of 2026-04-19
- Implemented:
  - source-independent discovery entity-definition draft
  - first-pass capability matrix for discovery and reconcile boundaries
- Not yet implemented:
  - `webAppSurfaceDiscovery` backend feature
  - durable discovery-run persistence
  - durable discovered-surface persistence
  - durable discovery observation history
  - root-triggered discovery sync route
  - discovery reads for current surfaces and run history
  - reconcile-link persistence and preview or apply flows in
    `webAppHierarchyBuilder`
  - event or topic-driven discovery refresh

## Purpose

Define the first backend foundation slice for durable web-app surface
discovery.

This slice introduces a persistence-backed discovery layer for real implemented
app route and page surfaces so the platform can stop depending on ephemeral
scan output, manual bootstrap payloads, or inferred current app structure when
populating and reconciling `webAppHierarchyBuilder`.

It provides the backend capabilities required for:

- explicit root-triggered sync over approved web-app families
- durable storage of discovered current-surface truth
- durable storage of discovery-run history
- explicit classification of discovered surfaces as user-facing, support-only,
  or review-required
- read access to current discovered truth and recent run history
- a clean upstream seam for later hierarchy import and drift reconcile work

It also establishes:

- separation between discovered truth and curated hierarchy truth
- support for both path-backed page routes and hash-backed shell states
- safe stale reasoning through repeated persisted runs rather than implicit
  boot-time mutation
- a later-compatible path for scheduled or event-driven refresh without
  changing truth ownership

---

## Scope

This phase includes:

- a new `webAppSurfaceDiscovery` feature under `src/features/`
- durable storage for:
  - discovery runs
  - discovered web-app surfaces
  - discovered web-app surface observations
- root-only protected routes under `/v1/web-app-surface-discovery`
- explicit root-triggered discovery sync
- current discovered-surface reads
- discovery-run history reads
- provider seams for the current approved root families:
  - `root-admin`
  - `login`
  - `design-system`
- exported public discovery reads for downstream reconcile consumers

This phase does **not** include:

- frontend discovery review UI
- automatic startup-triggered sync
- scheduled sync
- event or topic-driven refresh
- direct mutation of curated hierarchy truth inside the discovery feature
- automatic bulk import into `webAppHierarchyBuilder`
- redirect or compatibility behavior for live curated routes
- arbitrary site crawling or DOM-scraping discovery heuristics

Those later concerns should build on this durable discovery seam rather than
being collapsed into the first foundation slice.

---

## Core Concepts

### Discovered web-app surface

A `discoveredWebAppSurface` is the durable current-state lineage for one real
implemented app surface found through an approved discovery provider.

It is not the curated hierarchy page itself.

It answers:

- what implemented surface was found
- where it was found
- whether it is path-backed or hash-backed
- whether it appears user-facing, support-only, or review-required
- when it was first seen, last seen, or marked stale

### Discovery run

A `webAppDiscoveryRun` is one persisted execution of approved providers over an
explicit scope.

The first slice is root-triggered only.

This record exists so the platform can distinguish:

- no recent run happened
- a run succeeded and something disappeared
- a run failed or was partial, so stale posture may not be trustworthy yet

### Discovery observation history

A `discoveredWebAppSurfaceObservation` is the per-run observation record for a
discovered surface.

It preserves history without forcing the current discovered-surface lineage to
also act as the full run history log.

### Locator shape

Discovery must preserve real locator posture instead of flattening all
surfaces into one fake path model.

Current supported locator kinds:

- path-backed page route
  example: `/design-system/components/top-nav`
- hash-backed shell state
  example: `/root-admin#users`
- support-only route
  example:
  `/root-admin/helper/download/root-auth-signer-helper.mjs`

### Support-only discovered truth

Some routes exist technically but should not become curated pages.

The first slice must persist these as discovered truth with explicit
non-importable posture rather than dropping them from the model entirely.

Why:

- operators need to know they exist
- later drift review should distinguish hidden technical routes from missing
  discovery coverage
- the platform should not silently treat every discovered route as a page
  candidate

### Root family scope

The discovery feature must support the currently approved root families:

- `root-admin`
- `login`
- `design-system`

Current repo reality:

- `root-admin`
  is mounted as one same-origin shell route with hash-backed internal states
- `design-system`
  is mounted as a file-backed path family
- `login`
  remains an approved future tenant-admin then tenant-user entry family even
  though a mounted frontend route does not appear in `src/app.ts` today

The discovery model must allow an approved root family to have zero current
discovered user-facing surfaces when that is the honest implemented posture.

### Provider seam

Discovery should not depend on brittle DOM scraping, CSS selectors, or hidden
frontend internals.

Instead, each approved route family should expose an explicit provider seam
that returns normalized implemented-surface observations.

The discovery feature then:

- invokes providers
- validates and normalizes provider output
- persists discovery truth

### Drift and stale posture

Drift should be detected through repeated persisted runs.

A discovered surface should not become stale merely because it is absent from
one failed run or because the app restarted.

Safe stale posture in the first slice means:

- a successful newer run for the same scope no longer observed the surface
- the surface remains durable in storage
- the stale marker is reviewable
- downstream reconcile consumers can reason about that stale signal explicitly

### Reconcile boundary

Import and reconcile are not part of the discovery feature itself.

Why:

- discovery owns discovered truth
- `webAppHierarchyBuilder` owns curated hierarchy truth
- reconcile mutates curated hierarchy truth and should therefore live in a
  dedicated `webAppHierarchyBuilder` subdomain

The discovery feature must export stable reads that later reconcile preview and
apply capabilities can consume.

---

## Recommended Feature Boundary

Add a new feature:

`src/features/webAppSurfaceDiscovery/`

This feature should own:

- durable discovery-run records
- durable discovered-surface lineages
- durable per-run observation rows
- provider orchestration and normalization
- root-only protected discovery routes
- exported read seams for downstream reconcile consumers

This feature should not own:

- curated hierarchy modules or pages
- import or reconcile writes into `webAppHierarchyBuilder`
- frontend authoring or review UI
- event infrastructure itself
- route-rendering implementation or redirect behavior

Related feature boundary:

- `src/features/webAppHierarchyBuilder/`
  remains the owner of curated hierarchy truth
- a later reconcile subdomain inside `webAppHierarchyBuilder`
  should own explicit bridge records and preview or apply capabilities using
  discovery reads from `webAppSurfaceDiscovery`

---

## Proposed Durable Entities

### Web App Discovery Run

Expected minimum fields:

- `webAppDiscoveryRunId`
- `scopeKey`
- `status`
- `triggerKind`
- `providerVersion`
- `startedAt`
- `completedAt`
- `failureSummary`
- standard lifecycle timestamps

### Discovered Web App Surface

Expected minimum fields:

- `discoveredWebAppSurfaceId`
- `rootFamilyId`
- `discoveryKey`
- `surfaceKind`
- `locatorType`
- `routePath`
- `routeHash`
- `canonicalLocator`
- `displayLabel`
- `userFacingDisposition`
- `providerKey`
- `implementationSourcePath`
- `firstDiscoveredRunId`
- `lastDiscoveredRunId`
- `firstDiscoveredAt`
- `lastDiscoveredAt`
- `staleAt`
- standard lifecycle timestamps

### Discovered Web App Surface Observation

Expected minimum fields:

- `discoveredWebAppSurfaceObservationId`
- `webAppDiscoveryRunId`
- `discoveredWebAppSurfaceId`
- `rootFamilyId`
- `surfaceKind`
- `locatorType`
- `canonicalLocator`
- `displayLabel`
- `userFacingDisposition`
- `providerKey`
- `observedAt`

### Future Reconcile Link

This PRD does not implement the link, but the discovery model must stay
compatible with a future explicit bridge record between one discovered surface
and one curated hierarchy node.

That later record should capture:

- matched discovered surface
- matched curated module or page
- match posture such as imported, linked, ignored, stale, conflicted, or
  superseded
- provenance timestamps and actor attribution

---

## Capability Outline

### Run web-app surface discovery

- `POST /v1/web-app-surface-discovery/runs`
- root-only protected capability
- explicit manual trigger in v1
- persists one run plus discovered-surface refresh results

### Read discovered surfaces

- `GET /v1/web-app-surface-discovery/surfaces`
- `GET /v1/web-app-surface-discovery/surfaces/:discoveredWebAppSurfaceId`
- root-only protected capability
- supports explicit filters such as:
  - `rootFamilyId`
  - `surfaceKind`
  - `userFacingDisposition`
  - `providerKey`
  - stale posture

### Read discovery runs

- `GET /v1/web-app-surface-discovery/runs`
- `GET /v1/web-app-surface-discovery/runs/:webAppDiscoveryRunId`
- root-only protected capability
- supports recent operational review

### Deferred reconcile capabilities

These are out of scope for this feature slice but should follow next:

- preview import of discovered surfaces into curated hierarchy
- apply import or link actions into curated hierarchy
- explicit link-state review for imported, unmatched, stale, and conflicted
  surfaces

---

## Provider Expectations

### Design system provider

The design-system provider should discover real file-backed HTML surfaces from
the same serving model the router uses today.

It should not invent routes that do not exist in the served tree.

### Root-admin provider

The root-admin provider should discover the real shell-state surfaces from the
same runtime metadata the shell uses for section switching.

It should preserve hash-backed posture honestly rather than pretending those
states are path pages.

### Login provider

The login provider should be explicit even if it currently yields zero
user-facing discovered surfaces.

That keeps the root-family contract honest until the route family is
implemented.

---

## Security And Authorization

The first slice is root-only.

Requirements:

- authenticated root session required
- explicit root capability required for discovery run and read operations
- denied access should remain audit-visible through existing platform
  mechanisms
- tenant actors and unauthenticated callers are denied

Suggested capability keys:

- `web-app-surface-discovery.run`
- `web-app-surface-discovery.read`
- `web-app-surface-discovery.read-runs`

The discovery feature does not widen the current tenant boundary model.

---

## Persistence And Migration Notes

This feature will require a new migration set.

Expected persistence requirements:

- unique identity for discovered-surface lineage
- unique canonical locator within the approved scope
- explicit locator-shape checks
- indexes for stale review and run-history reads
- foreign keys from discovered surfaces and observations into discovery runs
- explicit root-family scoping

The first slice should not hard-delete rows during normal refresh.

If a discovered surface disappears from a later successful run, the feature
should mark reviewable stale posture rather than silently removing the record.

---

## Compatibility Notes

Backwards compatibility is required by default.

This slice must not:

- silently reinterpret hash-backed shell states as path-backed pages
- silently drop support-only discovered truth just because it is
  non-importable
- mutate curated hierarchy truth as a side effect of discovery
- introduce hidden boot-time persistence mutation

Later event or topic-driven refresh should be additive and should reuse the
same discovery-run and discovered-surface ownership model rather than
redesigning the persisted truth layer.

---

## Downstream Consumers

Later consumers should read through explicit discovery seams rather than
reconstructing discovery from frontend code or provider internals.

Expected consumers:

- `webAppHierarchyBuilder` reconcile preview and apply capabilities
- later drift-review workflows
- later operator review or import UI

The discovery feature must not require downstream features to import its
private persistence files directly.

---

## Verification Expectations

This slice should expect:

- unit coverage for:
  - provider normalization
  - locator-shape validation
  - stale-marking rules
  - support-only classification behavior
- integration coverage for:
  - root-triggered discovery run
  - read filters and exact reads
  - successful repeated runs updating `lastDiscoveredAt`
  - stale posture after later successful runs
- security coverage for:
  - root-only enforcement on run and read routes
  - denial for unauthenticated callers
  - denial for authenticated callers lacking capability
- audit coverage for:
  - denied access visibility
  - successful run visibility if required by the platform audit posture
- Postgres-backed persistence coverage for:
  - locator uniqueness
  - root-family scoping
  - run and observation foreign keys

---

## Open Follow-On Questions

- whether hash-backed root-admin shell states should later become first-class
  curated hierarchy targets or remain discovery-only until a locator-model
  extension lands
- what the first explicit reconcile-link entity shape should be
- how import preview and apply should behave for empty `login` discovery scope
  while the root family remains approved
- what event or topic-driven trigger contract should look like once the
  platform has an approved event layer

---

## Summary

The first `webAppSurfaceDiscovery` slice should create one durable, honest, and
queryable discovery seam for real implemented app surfaces.

It should keep discovered truth separate from curated hierarchy truth, support
path-backed and hash-backed surfaces without flattening them, persist
support-only technical routes as non-importable truth, and ship only explicit
root-triggered sync in v1 while staying compatible with later event-driven
refresh.
