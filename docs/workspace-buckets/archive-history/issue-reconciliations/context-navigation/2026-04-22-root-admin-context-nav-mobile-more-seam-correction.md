# Root Admin Context-Nav Mobile `More` Seam Correction

## Symptom

On `2026-04-22`, the root-admin mobile context-nav fix initially restored the
`More` collapse behavior, but it did so through route-local logic in
`rootAdminShell/assets/app.mjs` instead of through a design-system-owned seam.

That made the app behavior work, but it violated the governed adoption rule
that frontend behavior for signed-off families must come from `/design-system`
rather than being re-implemented inside the app.

## Root Cause

The signed-off `context-nav` family already owned the responsive mobile
overflow contract, but the repository did not yet expose a reusable shared
behavior helper for partitioning visible mobile items versus overflowed `More`
items.

That gap led to an app-local implementation attempt instead of a
design-system-owned controller seam.

## Why The Loop Missed It

The original repair focused on restoring user-visible behavior quickly and did
not stop to reconcile the governed-adoption rule from:

- `AGENTS.md`
- `docs/workspace/design-system/adoption/governed-app-component-adoption-contract.md`
- `docs/architecture/adr/0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`

So the first pass fixed the symptom but not the ownership boundary.

## Prevention Added

- Added a design-system-owned context-nav behavior seam in
  `src/frontend/designSystem/assets/contextNav.mjs` that now owns:
  - responsive mobile partitioning of visible versus overflowed context-nav
    items
  - shared `More` menu link rendering
- Updated `src/frontend/designSystem/assets/app.mjs` to consume that seam for
  the design-system preview runtime.
- Updated `src/frontend/rootAdminShell/assets/app.mjs` to consume that same
  design-system seam instead of deciding mobile overflow behavior locally.
- Updated `src/frontend/rootAdminShell/index.html` to host overflowed
  destinations inside `#context-nav-more-links`.
- Updated
  `docs/workspace/design-system/adoption/governed-app-component-adoption-contract.md`
  so the current audit now records the shared `context-nav` behavior seam and
  keeps the remaining markup-ownership gap honest.
- Strengthened
  `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts` so the mobile
  shell now proves:
  - current-page visibility survives the mobile conversion
  - overflowed destinations move into `More`
  - overflowed destinations remain reachable from the `More` sheet

## Follow-up Expectation

This corrects the behavior-ownership problem, but it does not yet mean
`rootAdminShell` has full governed `context-nav` adoption.

The app still owns host markup and part of the destination render structure, so
the remaining honest next step is a design-system-owned render seam for the
governed app consumer when that migration is approved.
