# 2026-04-18 Simple Select Canonical Breadcrumb Chain Gap

## Summary

The dedicated `Simple Select` canonical render page showed a broken breadcrumb
trail in the browser. Instead of a valid seam trail, the shell collapsed into
an ellipsis plus blank breadcrumb slot on the new canonical surface.

## User-Visible Symptom

- `/design-system/components/simple-select?...` rendered the canonical shell
  with a malformed breadcrumb row
- the launcher and render page existed, but the breadcrumb did not resolve to
  a readable `Home / Canonicals / Simple Select / Render`-style trail

## Root Cause

The shared canonical-shell breadcrumb builder in
`src/frontend/designSystem/assets/app.mjs` rebuilds breadcrumb markup from the
`designSystemBreadcrumbChains` registry at startup.

`Simple Select` was added as a new canonical launcher and dedicated render
surface, but its two routes were not added to that registry:

- `/design-system/canonicals/simple-select`
- `/design-system/components/simple-select`

Because the route registry was incomplete, the canonical shell tried to apply
its generic breadcrumb compaction behavior without a truthful seam-specific
chain for the new surface.

## Why The Existing Loop Missed It

This escaped because the first proof for `Simple Select` focused on:

- launcher presence
- direct scenario routing
- seam behavior inside the canonical surface

It did not include the shared canonical-shell navigation audit that already
checks breadcrumb truth for other canonical launchers and render surfaces.

## Classification

- missing coverage
- shared-seam blind spot
- missing regression scenario in the canonical shell suite

## Reconciliation Changes

- added `Simple Select` breadcrumb chains to
  `src/frontend/designSystem/assets/app.mjs`
- extended `tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts` to cover both:
  - the `Simple Select` canonical launcher
  - the `Simple Select` canonical render surface

## Prevention Lesson

For every new canonical family, the work is incomplete until the shared shell
registry is updated too:

1. launcher route
2. render route
3. canonical shell breadcrumb coverage

Adding a dedicated canonical surface without updating the shared breadcrumb
registry is not safe in this repo.

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts tests/visual/designSystem/canonicals/forms/simpleSelectCanonical.spec.ts tests/visual/designSystem/canonicals/forms/simpleSelect.spec.ts`

## Resolution Status

- candidate fix awaiting user confirmation
