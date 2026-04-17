# Canonical And Parity Conventions

## Purpose

Standardize how governed design-system families expose canonical states,
launcher routes, evidence IDs, and parity comparisons so future component loops
do not reinvent naming or evidence structure.

## Canonical Route Convention

- Use:
  `/design-system/canonicals/<family>`
- The route should:
  - list every canonical state for the family
  - provide one direct link per ref ID
  - support stepping through canonicals one at a time from the renderer itself
- highlight priority states without hiding the full set

Canonicals are evidence surfaces, not exploratory sandboxes. They should not
depend on interactive controls to settle into the named state.

## Canonical Host And Surface Isolation

The canonical host page and the rendered canonical surface must be treated as
separate layers with different responsibilities.

- the host page may provide:
  - review metadata
  - launcher chrome
  - breadcrumb framing
  - canonical stepper navigation
- the rendered canonical surface must own:
  - its own layout and geometry
  - its own viewport-driving state
  - its own shell offsets and attachment rules
  - its own direction, theme, magnification, and state variables
  - its own runtime event behavior relevant to the family under review

The host page must not silently alter the rendered surface through:

- inherited layout pressure
- host-page scroll position
- outer sticky-shell geometry
- document-level CSS variables that are not explicitly part of the canonical
  contract
- shared event listeners that mix host and rendered-surface geometry concerns

When a canonical host page also renders shared shell families in its own page
chrome, that host chrome must not express stale behavior relative to the
active signed-off shell families used by the rendered canonical surface.

Do not allow one canonical route to carry:

- an older host-shell behavior in page chrome
- and a newer signed-off shell behavior in the rendered surface

If host shell and rendered shell disagree about a shared family contract, treat
that as parity drift and reconcile it before further family rollout continues.

If a canonical surface cannot prove that the named parameters are the only
drivers of the rendered state, the canonical is not trustworthy enough for
sign-off.

Preferred implementation direction:

- strongest:
  render the canonical surface in an isolated document or equivalent boundary
- acceptable interim posture:
  keep a hard isolation seam inside the same document, with family-local CSS
  variables and geometry logic scoped to the rendered surface rather than the
  host page
- unacceptable posture:
  a canonical whose rendered state can drift because the host review page
  scrolls, collapses, or changes its own shell geometry

When an escaped issue reveals host/surface coupling, pause and reconcile the
canonical architecture before continuing broader family rollout work.

Canonical launchers should also inherit the approved public parent category for
the family they represent.

- component-owned families should frame under `Components`
- pattern-owned families should frame under `Patterns`
- mixed-maturity families should use the explicitly approved public parent from
  the loop artifacts rather than a guessed default

That framing should remain consistent across:

- top-nav active state
- breadcrumb parent step
- launcher-page copy when it references the owning catalog

## Canonical Ref IDs

- Use a stable prefix per family:
  - `TRP-*` for top-nav reference pack states
  - future families should use similarly stable family-specific prefixes
- Ref IDs must be:
  - unique within the family
  - durable across implementation refactors
  - descriptive enough to understand the state without reading code

## Canonical URL Contract

- Each ref ID must have one canonical route URL
- Canonical URLs should prefer query-driven state over manual setup
- The canonical URL must encode:
  - width or viewport-driving state when relevant
  - open/closed state when relevant
  - fixture or label variation when relevant
  - direction, theme, magnification, or accent when relevant

Canonical URLs must also be honest:

- the named state should be true on first open
- widths and fixtures must be large enough for the intended state to remain
  visible without silent degradation
- if a state still depends on post-load interaction to become correct, the
  canonical is not ready

Canonical renderers should expose a clear render-ready contract before visual
capture or parity comparison.

## Evidence Naming

- Screenshots should use the ref ID in the filename
- Machine-readable manifests should be family-scoped
- Example:
  - `tests/visual/designSystem/topNav.canonical.manifest.json`
  - `tests/visual/__snapshots__/designSystem/topNav.spec.ts/trp-001-desktop-default.png`

## Preview Route Contract

- Each governed family should have a dedicated preview route when practical
- The preview route should:
  - isolate the family from unrelated page noise
  - support deterministic URL-driven state
  - preserve the signed-off styling and behavior of the original family
  - not invent preview-only behavior that drifts from the real pattern

Preview and canonical routes should be separated by default when the family has
enough complexity that exploratory controls could compromise deterministic
rendering.

Every public preview, launcher, and canonical-render route under
`/design-system` should still live inside the governed shell trio. When the
page-level `context-nav` IA is not yet approved as a multi-item set, render the
single-item current-page fallback:

- `top-nav`
- `sub-nav`
- `context-nav`

The preview or canonical renderer may isolate the family inside the page, but
the page itself should not drop shell chrome by default. If broader truthful
`context-nav` destinations are not yet known for a page, stop and get them
approved instead of inventing them; until then, use only the current page as
the `context-nav` item.

## Parity Comparison Rules

- Compare new app consumers against the reference pack, not against memory
- Record parity outcomes as one of:
  - matches
  - intentional deviation
  - regression
  - still unproven
- If a consumer differs intentionally, record:
  - why
  - which state differs
  - whether the reference pack or pattern now needs to change

## App Consumer Parity Expectations

- The first consumer must preserve:
  - required behavior-lock rules
  - required canonical states relevant to the consumer
  - accessibility and responsive expectations already signed off
- The first consumer must also prove shell-parity when the family is used in
  shell chrome:
  - attached versus floating treatment
  - full-width versus contained behavior
  - gutter alignment with adjacent chrome
  - first-item or edge alignment when part of the contract
- Route-local placeholders are allowed for a POC if:
  - they do not change the shell contract
  - deferred behavior is documented in the adoption contract

Consumer parity should include real interactive states when relevant, not just
resting states. Examples:

- filled search inputs with native clear affordances visible
- truncation with tooltip recovery
- open menus or drawers
- RTL reduced and compact states

## Minimum Family Readiness For Reuse

Before a family is treated as repeatable repo practice, it should have:

- a behavior lock
- a reference pack
- canonical routes
- deterministic preview URLs
- human sign-off
- rendered evidence
- executable parity lock where practical
- one real consumer adoption note

## Follow-Up Rule

When a second real consumer is added:

- reuse the same canonical/parity conventions
- compare both consumers against the same reference pack
- only then decide whether extraction into a shared primitive is justified

When a family's public parent category changes, treat that as a docs-and-IA
change that must refresh the launcher framing and route tests in the same loop.
