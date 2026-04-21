# 2026-04-18 Simple Select Canonical Breadcrumb Collapse Gap

## Summary

The dedicated `Simple Select` canonical render page showed an unnecessary collapsed
breadcrumb trigger, rendering as `Home / ... / Simple Select / Render` even
though that route only has a three-step trail and no hidden middle path.

## Root Cause

The shared shell breadcrumb prioritization logic in
`src/frontend/designSystem/assets/app.mjs` treats canonical launcher and render
routes as `full-trail` surfaces. In that preservation branch, it was forcibly
unhiding both the Page `-1` segment and the collapsed `...` segment regardless
of whether the route actually had a collapsed middle path.

For `/design-system/components/simple-select`, the breadcrumb chain is:

- `Home`
- `Simple Select`
- `Render`

That chain has no collapsed middle items, but the shared seam still unhid the
collapsed slot, so the live shell displayed an empty recovery affordance that
did not correspond to any real hidden breadcrumb content.

## Why The Loop Missed It

This escaped because the new `Simple Select` canonical work had scenario tests
for launcher routing and seam behavior, but the shared shell regression layer
did not assert that three-step canonical routes keep the collapsed breadcrumb
slot hidden.

The gap was:

- coverage existed for the canonical route
- coverage existed for the shared shell
- but no shell assertion tied the `Simple Select` canonical routes to the
  expected non-collapsed breadcrumb structure

## Reconciliation Changes Added

- fixed the shared `full-trail` preservation branch so it only reveals the
  collapsed breadcrumb segment when that segment is actually allowed for the
  current chain
- extended `tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts` so the
  `Simple Select` launcher and dedicated render route explicitly assert that
  the collapsed breadcrumb item and its separator remain hidden

## Coverage Lesson

When a new canonical seam gets a dedicated render surface, the shell proof
cannot stop at “home link resolves” and “current label is visible.” The
breadcrumb structure itself needs a route-specific expectation for whether the
collapsed middle segment should exist at all.

## Follow-Up Watch Items

- other dedicated canonical render routes should continue to be reviewed for
  whether they genuinely need a collapsed middle segment or only a direct
  three-step trail
