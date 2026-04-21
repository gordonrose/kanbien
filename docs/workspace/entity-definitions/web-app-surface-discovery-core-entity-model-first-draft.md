# Web App Surface Discovery Core Entity Model First Draft

## Status

- Draft status:
  first draft
- Intended future owning feature:
  `webAppSurfaceDiscovery`
- Purpose:
  define durable discovered route and page truth before capability planning and
  implementation begin

## Goal

Create a durable discovery layer for real implemented web-app route and page
surfaces that can later support:

- accurate bootstrap and refresh of `webAppHierarchyBuilder`
- explicit distinction between discovered truth and curated hierarchy truth
- honest import and reconcile workflows that do not invent pages
- drift detection between the running app's implemented structure and curated
  hierarchy structure
- history-aware review of what was discovered, what changed, and what may now
  be stale

This model is intentionally not an ephemeral scan result.
It defines stable discovered-surface identity, run-level observation history,
clear user-facing versus non-user-facing classification, and a separate bridge
for later import or reconcile decisions.

## Consolidated Decisions

- discovery truth should not be stored inside `webAppHierarchyBuilder` page or
  module rows
- discovery truth and curated hierarchy truth must remain separate durable
  models
- import and reconcile decisions need an explicit bridge record rather than
  hidden inference
- discovery must support the currently approved root families:
  `root-admin`, `login`, and `design-system`
- discovery should inspect real implemented app surfaces, but should do so
  through explicit provider seams rather than brittle DOM scraping
- non-user-facing support routes must be classifiable without being promoted
  into user-facing page truth
- non-user-facing support routes should still be persisted as discovered truth
  so review and drift tooling can distinguish "exists technically" from
  "importable as a curated page"
- discovery must support both path-backed pages and hash-backed shell states
  without forcing either shape into a fake common path format
- drift should be detected through repeated runs and persisted observation
  history rather than by mutating curated hierarchy rows opportunistically
- durable explicit columns are preferred over ad hoc JSON blobs for stable
  identity, classification, and reconcile-relevant facts
- the first implementation slice should use explicit root-triggered discovery
  sync only
- later automation should prefer an explicit event or topic-driven trigger seam
  rather than hidden boot-time mutation

## Recommended Feature Boundary

The future `webAppSurfaceDiscovery` feature should own:

- durable discovery-run records
- durable discovered-surface lineages
- durable per-run observation records
- provider orchestration over approved app route families
- current discovered-surface reads and filtered review reads
- stale and unmatched discovery review reads
- exported public seams for downstream import and reconcile consumers

The future `webAppSurfaceDiscovery` feature should not own:

- curated hierarchy truth
- module or page curation decisions
- route-generation or redirect behavior
- downstream page-shell planning
- frontend rendering implementation details
- ad hoc crawling of arbitrary private app internals

Recommended ownership split:

- `webAppSurfaceDiscovery`
  owns discovered truth
- `webAppHierarchyBuilder`
  continues to own curated root-family, module, and page truth
- import and reconcile capabilities
  should live in a dedicated `webAppHierarchyBuilder` subdomain because those
  capabilities mutate curated hierarchy truth even though they read discovery
  truth from the separate feature

## Truth-Layer Separation

### Discovered Route Truth

Discovered truth answers:

- what implemented surface was found
- where it was found
- whether it is path-backed or hash-backed
- whether it appears user-facing, support-only, or review-required
- which discovery run last observed it
- when it first appeared, last appeared, or became stale

Discovered truth must not answer:

- what the curated business module should be
- whether the hierarchy should expose the surface
- whether the surface has been intentionally suppressed or remapped in curation

### Curated Hierarchy Truth

Curated hierarchy truth remains the durable operator-owned model already
introduced by `webAppHierarchyBuilder`.

Curated truth answers:

- which root families, modules, and pages the platform intends to treat as the
  governed hierarchy
- how pages are grouped, named, ordered, and lifecycle-managed
- what downstream planning and generation loops should consume

Curated truth must not claim to be the scan record of the current app.

### Import And Reconcile Truth

Import or reconcile truth is neither discovered truth nor curated truth.
It is a bridge layer that records curation decisions across the two models.

It should answer:

- which discovered surface was matched to which curated page or module
- whether the match was imported automatically, linked manually, intentionally
  ignored, or superseded
- whether later runs show the match as healthy, stale, unmatched, or conflicted

This bridge should be stored in an explicit relation such as a future
`Web App Hierarchy Discovery Link` record owned by the reconcile subdomain of
`webAppHierarchyBuilder`.

## Discovery Input Boundary

To avoid over-coupling discovery to frontend implementation details, discovery
should read from approved provider seams rather than from CSS selectors or
best-effort HTML scraping.

Recommended provider model:

- `src/frontend/designSystem`
  exposes a provider that resolves real file-backed HTML routes from the
  router's serving model and the actual frontend file tree
- `src/frontend/rootAdminShell`
  exposes a provider that returns the real hash-backed shell sections from the
  same page metadata or manifest the shell uses at runtime
- `login`
  should expose either a real provider when a frontend route exists or an
  explicit empty-provider declaration until it does

Provider outputs should be normalized into shared discovery records by the
backend feature.
The providers are implementation-coupled on purpose, but the coupling stays
behind explicit seams instead of leaking through discovery-wide heuristics.

## Route Exposure Classification

The model should explicitly distinguish:

- user-facing page surfaces
- user-facing shell-state surfaces
- support-only routes such as helper downloads or implementation assets
- review-required surfaces whose posture is not yet safe to infer

This keeps the discovery layer honest when a route exists technically but is
not meant to become a curated page.

Examples in the current repo:

- `/design-system/components/top-nav`
  likely a user-facing discovered page surface
- `/root-admin#users`
  likely a user-facing discovered shell-state surface
- `/root-admin/helper/download/root-auth-signer-helper.mjs`
  a non-user-facing support route and not a page candidate
- `/login`
  remains an approved root family and future tenant-admin then tenant-user
  entry family even though a mounted frontend route does not appear in
  `src/app.ts` today

## Drift Posture

Discovery drift should be detected by comparing repeated persisted runs rather
than by silently rewriting curated hierarchy.

Recommended posture:

- each run stores what was observed
- current discovered surfaces retain first-seen and last-seen timestamps
- a surface becomes `possibly-stale` only after it is absent from a newer
  successful run for the same discovery scope
- import or reconcile links become `stale` or `conflicted` when the linked
  discovered surface disappears, changes locator shape materially, or changes
  classification in a way that invalidates the original import assumption
- operator review should happen before destructive curated hierarchy changes

## Trigger Posture

The first slice should support explicit root-triggered sync only.

Why:

- discovery writes durable state and should not mutate persistence
  unexpectedly during startup
- stale reasoning is safer when runs happen through an explicit operator action
- provider failures are easier to review when tied to one requested run rather
  than hidden boot behavior

The model should still reserve future room for:

- scheduled refresh
- event-driven refresh
- topic-backed incremental synchronization once the platform has an approved
  event layer

That means trigger kinds may be broader in the durable catalog than the first
implementation exposes operationally.

## Proposed Durable Entities

### 1. Web App Discovery Run

- Description:
  one persisted execution of approved discovery providers over a declared scope
- Why it exists:
  preserves auditability, replay context, and safe stale-detection boundaries

Proposed durable fields:

- `webAppDiscoveryRunId`
  Type / Shape: `UUID`
- `scopeKey`
  Type / Shape: `TEXT`
  Description: stable key such as `current-approved-root-families`
- `status`
  Type / Shape:
  `'running' | 'succeeded' | 'failed' | 'partial'`
- `triggerKind`
  Type / Shape:
  `'manual' | 'scheduled' | 'bootstrap' | 'startup-sync'`
  Constraints / Notes: v1 implementation should expose root-triggered manual
  sync only even if later trigger kinds are reserved in the model
- `providerVersion`
  Type / Shape: `TEXT`
- `startedAt`
  Type / Shape: `TIMESTAMPTZ`
- `completedAt`
  Type / Shape: `TIMESTAMPTZ | NULL`
- `failureSummary`
  Type / Shape: `TEXT | NULL`
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

### 2. Discovered Web App Surface

- Description:
  stable current-state lineage for one discovered implemented app surface
- Why it exists:
  provides durable queryable discovery truth instead of one-off scan output

### 3. Discovered Web App Surface Observation

- Description:
  one run-specific observation of one discovered surface
- Why it exists:
  preserves history and supports safe stale detection without mutating the
  stable discovered-surface lineage into a full audit log

### 4. Web App Hierarchy Discovery Link

- Description:
  explicit reconcile bridge from one discovered surface to one curated
  hierarchy node
- Recommended owning feature:
  `webAppHierarchyBuilder` reconcile subdomain
- Why it exists:
  imported, unmatched, ignored, stale, and conflicted posture should not be
  hidden on either side of the truth boundary

## First Concrete Entity Definition

### Discovered Web App Surface

- Description:
  stable current-state lineage for one real implemented route or shell-state
  surface discovered in the app
- Why it exists:
  gives the platform one durable queryable source of discovered app truth that
  later runs can refresh and later reconcile flows can consume

Proposed durable fields:

- `discoveredWebAppSurfaceId`
  Type / Shape: `UUID`
  Description: internal durable identity for the discovered surface lineage
- `rootFamilyId`
  Type / Shape: `TEXT`
  Description: owning approved root family such as `root-admin`, `login`, or
  `design-system`
- `discoveryKey`
  Type / Shape: `TEXT`
  Description: stable normalized machine key for the discovered surface
  lineage
  Constraints / Notes: required, system-derived, unique
- `surfaceKind`
  Type / Shape:
  `'page-route' | 'shell-state' | 'support-route' | 'review-required'`
  Description: coarse discovered surface shape
- `locatorType`
  Type / Shape:
  `'path' | 'path-with-query-template' | 'hash-state'`
  Description: canonical locator kind for the surface
- `routePath`
  Type / Shape: `TEXT | NULL`
  Description: absolute path locator when the surface is path-backed
  Constraints / Notes: required when `locatorType` is path-based
- `routeHash`
  Type / Shape: `TEXT | NULL`
  Description: canonical hash state without the leading route family path when
  the surface is hash-backed
  Constraints / Notes: required when `locatorType='hash-state'`
- `canonicalLocator`
  Type / Shape: `TEXT`
  Description: stable normalized locator string such as
  `/design-system/components/top-nav` or `/root-admin#users`
  Constraints / Notes: required, unique
- `displayLabel`
  Type / Shape: `TEXT | NULL`
  Description: discovered human-readable label when an honest label exists
- `userFacingDisposition`
  Type / Shape:
  `'user-facing' | 'support-only' | 'review-required'`
  Description: whether the surface should be considered a page candidate for
  hierarchy import
- `providerKey`
  Type / Shape: `TEXT`
  Description: explicit provider seam that produced the record
- `implementationSourcePath`
  Type / Shape: `TEXT | NULL`
  Description: main file or provider source path that backs the discovery
  result
- `firstDiscoveredRunId`
  Type / Shape: `UUID`
  Description: first successful run that observed this lineage
- `lastDiscoveredRunId`
  Type / Shape: `UUID`
  Description: most recent successful run that observed this lineage
- `firstDiscoveredAt`
  Type / Shape: `TIMESTAMPTZ`
- `lastDiscoveredAt`
  Type / Shape: `TIMESTAMPTZ`
- `staleAt`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: marker set only after a later run establishes that the surface
  may no longer exist
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

Recommended constraints:

- primary key on `discoveredWebAppSurfaceId`
- unique index on `discoveryKey`
- unique index on `canonicalLocator`
- foreign key on `rootFamilyId`
- foreign keys on `firstDiscoveredRunId` and `lastDiscoveredRunId`
- check enforcing the allowed `surfaceKind` values
- check enforcing the allowed `locatorType` values
- check enforcing the allowed `userFacingDisposition` values
- check enforcing locator consistency:
  path-backed rows require `routePath` and forbid `routeHash`;
  hash-backed rows require `routeHash` and may reuse one base route path
- index on `(rootFamilyId, userFacingDisposition, staleAt, lastDiscoveredAt)`
- index on `(providerKey, surfaceKind, lastDiscoveredAt)`

Recommended normalization rules:

- `discoveryKey` should be derived server-side from stable family and locator
  facts rather than supplied by clients
- `canonicalLocator` should be normalized to one canonical representation per
  surface
- `routeHash` values should be normalized without the leading `#`
- `rootFamilyId` remains the family boundary even when multiple surfaces share
  one physical HTML file

Recommended mutation rules:

- successful discovery refreshes `lastDiscoveredRunId`, `lastDiscoveredAt`,
  `updatedAt`, and clears `staleAt` when the surface reappears
- discovery should not hard-delete old surfaces during a normal run
- meaningful locator-shape changes should create a new lineage when the old
  surface would no longer be the same import target
- cosmetic updates such as a changed discovered label may update the same
  lineage

## First-Pass Questions To Harden Before PRD Lock

1. Should hash-backed root-admin sections such as `/root-admin#users` become
   first-class curated page targets later, or should they remain discovery-only
   until `webAppHierarchyBuilder` gains an approved locator model beyond
   path segments?
2. Should `/login` remain an approved root family with zero discovered surfaces
   until a real frontend route exists, or should discovery also cover a
   different login surface not currently mounted in `src/app.ts`?
3. In the first slice, should support-only routes such as helper downloads be
   stored as non-importable discovered surfaces or excluded entirely from the
   persisted discovery layer?
4. Should automatic refresh run only through a root-triggered sync capability
   at first, or do you want startup or scheduled sync in scope for the first
   implementation loop?

## Current Answers Captured

The current requirement posture captured in this draft is:

- hash-backed `/root-admin` shell states are real discovered surfaces and may
  later become curated targets, but they should not be silently flattened into
  path routes in the first discovery loop
- `/login` remains an approved root family intended for tenant-admin and later
  tenant-user login surfaces
- support-only routes should be persisted in discovery as non-importable
  discovered truth
- v1 discovery sync should be explicit root-triggered only
- a later approved event layer may drive topic-based or similar refresh flows

## Recommended Downstream Artifact Sequence

1. capability matrix for discovery and reconcile boundaries
2. ADR for the new discovery-provider seam and reconcile-link pattern
3. PRD for the `webAppSurfaceDiscovery` foundation
4. PRD-derived test-case doc
5. implementation blueprint
6. implementation
