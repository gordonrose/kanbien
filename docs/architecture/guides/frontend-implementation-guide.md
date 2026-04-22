# Frontend Implementation Guide

## Purpose

Define how browser surfaces should be added without collapsing backend feature
modularity or weakening browser security posture.

## Current Direction

The repo currently supports:

- same-origin browser delivery
- composed same-origin operational topology
- SPA-style admin surfaces
- cookie-backed browser sessions for browser surfaces

See ADRs `0013` and `0014` for the enduring architecture decisions behind the
current browser shape.

Use `docs/architecture/frontend-overview.md` as the maintained current-state
frontend map.

## Frontend Ownership Rules

- Frontend code should live in its own app area, not inside backend feature
  domain or persistence folders.
- Browser code may consume backend capabilities only through approved public
  HTTP/API contracts.
- Same-origin runtime does not mean shared code ownership boundaries.

## Governed UI Adoption Rule

When a frontend surface is supposed to come from the design system, do not
implement that UI in the real app before it has been signed off through the
`/design-system` loop unless the user has explicitly approved a one-off
exception.

Before app implementation begins for a governed family, the design-system
chain should already have the relevant:

- behavior lock
- canonical/reference truth
- verification artifact
- adoption contract or note

If those are missing, do the design-system governance work first instead of
using the app as the proving ground.

For governed frontend families, shared CSS imports alone do not count as
design-system adoption.

Governed app adoption must consume the design-system-owned source of truth for:

- visual styling
- render structure and markup
- interaction behavior
- accessibility and state semantics

Duplicating governed component markup in an app page is drift unless an
explicit exception is approved.

Duplicating governed interaction logic in an app page is drift unless an
explicit exception is approved.

First-consumer app adoption should prefer design-system-owned render and
controller seams instead of page-local HTML reconstruction plus shared CSS.

If a governed family does not yet expose a consumable shared render or
behavior seam, stop and raise the gap for human decision rather than copying
the family locally.

If the governed surface lives inside governed shell chrome, the shell itself
must also be treated as governed. Page-level family adoption does not count as
honest governed adoption when the real app still owns shell HTML, shell CSS,
or shell interaction behavior locally. For non-exception app surfaces, use the
signed-off design-system page-shell source of truth rather than a local shell
reconstruction.

Before a governed first-consumer app adoption starts, record a short preflight
note or equivalent artifact naming:

- the exact signed-off source route, reference pack, or canonical truth
- which parts of the visible surface are family-owned versus host-page-owned
- the required shared CSS, render, and controller seams
- any intentionally approved consumer differences
- the parity evidence the real app route will need before the work is treated
  as complete

Before doing further material work on an existing governed durable app page,
refresh the page implementation audit first. That audit must say whether the
page still owns local render or controller behavior, which DS seams it
actually consumes today, and what remediation is required before more page
work if local implementation still remains.

Do not rely on "we imported the shared CSS" or "the classes match" as proof
that the adoption is safe.

Use literal route comparison against the signed-off source truth for:

- shell posture
- drawer attachment versus modality
- section rhythm and framing
- launcher or utility-action placement
- app-local helper copy, counters, and wrappers

If the visible route still looks materially uncertain after one corrective
pass, stop and escalate the composition question instead of continuing to
guess locally.

Consumer verification for governed adoption should prove the real app route,
not only the isolated design-system family. At minimum, require:

- required row, state, or interaction grammar on the real consumer
- host or shell parity when the family sits inside governed chrome
- truthful affordance behavior when controls look interactive
- at least one direct human-visible regression guard for visually sensitive
  failure modes such as overlap, escape, collapsed icons, or contrast drift

When the real issue is shell drift rather than only child-family drift, add
shell-level parity checks against the signed-off page-shell source before
treating downstream page-level parity as trustworthy.

## Frontend Capability Checklist

Every frontend capability should define:

- route or launch surface
- page, modal, panel, or shell location
- required session/bootstrap behavior
- loading, empty, success, error, and expiry states
- client-side permission visibility rules
- backend fallback behavior for denied/expired/error states

## Browser Security Expectations

When a frontend capability changes browser behavior, review:

- CSP impact
- cookie/session implications
- CSRF implications
- localhost or privileged bridge behavior if applicable
- storage rules for sensitive state

## Recoverability Rule

To rebuild frontend behavior from specs, the docs must describe:

- route
- UI surface
- states
- permission visibility
- backend API dependency
- session/expiry behavior
- browser-security implications

## Maintenance Rule

When a change alters frontend architecture rather than only page-local behavior,
also update:

- `docs/architecture/frontend-overview.md` for the current-state map
- `docs/architecture/adr/` when the change introduces, clarifies, or replaces a
  lasting frontend architecture decision

Examples that should trigger this check:

- new frontend route families
- routing-model changes
- browser auth/session model changes
- frontend serving or build-posture changes
- new discovery or frontend-topology seams
