# ADR-0022: Add A Web App Surface Discovery Foundation With Explicit Provider Seams And Reconcile Links

- Status: Proposed
- Date: 2026-04-19
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The repo now has a durable curated hierarchy foundation in
`webAppHierarchyBuilder`, but the current app already contains real implemented
surfaces that the hierarchy should eventually import, refresh, and reconcile
against.

Today those implemented surfaces are split across materially different runtime
shapes:

- `/design-system`
  is largely file-backed and path-routed
- `/root-admin`
  is currently one served shell route with hash-backed section states
- `/login`
  is an approved hierarchy family and intended future tenant-admin then
  tenant-user entry family, but it does not currently appear as a mounted
  frontend route in `src/app.ts`

The platform needs a durable discovery seam that can answer:

- what was actually discovered in the implemented app
- what is user-facing versus support-only
- what was imported or linked into curated hierarchy truth
- what is unmatched
- what may be stale after later discovery runs

If the platform stores discovery results only as ephemeral scan output, or
collapses discovered truth into curated hierarchy rows, it will lose the
ability to reason honestly about bootstrap, reconcile, and drift.

At the same time, the discovery seam should not become tightly coupled to
brittle frontend implementation details such as CSS selectors, opportunistic
HTML scraping, or implicit startup behavior that mutates persistence whenever
the app boots.

## Decision

Add a new backend feature:

`src/features/webAppSurfaceDiscovery/`

This feature owns durable discovered web-app surface truth.

Current rules:

- discovery truth is modeled separately from curated hierarchy truth
- the discovery feature owns:
  - discovery-run records
  - discovered-surface lineages
  - per-run observation history
  - public read seams over discovered truth
- `webAppHierarchyBuilder` continues to own:
  - curated root-family truth
  - curated module truth
  - curated page truth
- import and reconcile decisions are not stored implicitly on either side
- import and reconcile require explicit bridge records such as a future
  `Web App Hierarchy Discovery Link`
- those bridge records belong to a reconcile subdomain inside
  `webAppHierarchyBuilder` because reconcile writes curated hierarchy truth
- discovery must support the currently approved root families:
  - `root-admin`
  - `login`
  - `design-system`
- discovery must support multiple locator shapes without flattening them into a
  fake common path model
- v1 locator support includes:
  - path-backed page routes
  - hash-backed shell states
  - support-only routes that are discovered but non-importable
- discovery should classify surfaces explicitly as one of:
  - user-facing page route
  - user-facing shell state
  - support-only route
  - review-required surface
- discovery must persist support-only surfaces as discovered truth rather than
  dropping them from the model
- discovery must not use ad hoc JSON blobs as the primary durable contract for
  stable identity, locator shape, or reconcile-relevant posture
- discovery should consume explicit provider seams from implemented route
  families rather than relying on broad DOM scraping or direct cross-feature
  persistence imports
- provider outputs are normalized into discovery-owned durable records
- the first implementation slice is explicit root-triggered sync only
- startup-triggered or hidden automatic persistence mutation is out of scope
  for v1
- later scheduled or event-driven refresh may be added, but only through an
  explicit trigger seam and not by changing discovery truth ownership

## Consequences

### Positive

- the platform gets one durable source of discovered app truth instead of
  transient scan output
- curated hierarchy truth remains distinct from discovery truth
- import, ignore, unmatched, stale, and conflicted posture can be modeled
  honestly through explicit reconcile links
- file-backed routes and hash-backed shell states can both be represented
  without pretending they are the same locator kind
- support-only routes remain visible for review and drift reasoning without
  becoming curated page candidates
- explicit provider seams reduce brittle coupling to frontend implementation
  details
- the architecture leaves room for later topic-based or event-driven refresh
  without redesigning truth ownership

### Negative

- the platform now has another durable backend feature rather than extending
  one existing feature only
- discovery and reconcile remain intentionally split across two features, which
  adds some integration overhead
- hash-backed shell states may remain blocked or review-required for some
  import paths until curated hierarchy locator support evolves further
- `/login` remains an approved family even before a mounted frontend route is
  implemented, which means discovery must handle a temporarily empty family
  honestly

### Neutral / Follow-up

- later work should define:
  - the first reconcile-link record and its exact lifecycle states
  - the initial provider contract for each approved root family
  - whether hash-backed shell states become first-class curated hierarchy
    targets or remain discovery-only until a later locator-model extension
  - the first event or topic-driven trigger design once the platform has an
    approved event layer
  - downstream drift-review operator surfaces
- if the platform later introduces a shared event or topic infrastructure, the
  discovery feature may consume it through explicit trigger adapters without
  changing the feature boundary
