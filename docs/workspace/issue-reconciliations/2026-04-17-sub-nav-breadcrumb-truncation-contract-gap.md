# 2026-04-17 Sub-Nav Breadcrumb Truncation Contract Gap

## Summary

The governed `BCR-011` and `BCR-012` breadcrumb tooltip states regressed after
canonical-shell cleanup work. The breadcrumb preview could drop `Page -1`
instead of preserving the full trail and exposing tooltip recovery on the
truncated buttons.

## Root Cause

`applyResponsiveBreadcrumbPriority` only preserved a forced full-trail mode for
the outer canonical shell breadcrumb. The sub-nav preview breadcrumb lost its
equivalent preservation path, so the `button-truncation` canonical states fell
back to ordinary responsive priority reduction.

That meant the preview could:

- hide `Page -1`
- keep only the current label visible
- still pass the existing tooltip test because the current label still exposed a
  tooltip

## Why The Loop Missed It

The nearest executable coverage proved the wrong layer of truth.

`tests/visual/designSystem/canonicals/navigation/subNav.spec.ts` checked that:

- the shared tooltip could still appear
- the overlay layer stayed visible

But it did **not** prove that the canonical breadcrumb remained in the locked
`full trail + truncation + tooltip` state. The test hovered only the current
label, so it missed the fact that `Page -1` had already yielded out of the row.

## Reconciliation Changes

- restored the shared preservation rule for sub-nav breadcrumb
  `button-truncation` canonicals in
  `src/frontend/designSystem/assets/app.mjs`
- added a focused regression in
  `tests/visual/designSystem/canonicals/navigation/subNav.spec.ts` that verifies:
  - `Page -1` stays visible in `BCR-011` and `BCR-012`
  - both `Page -1` and current breadcrumb nodes retain tooltip data
  - hovering `Page -1` still reveals the shared tooltip

## Coverage Lesson

For governed truncation canonicals, tooltip visibility alone is not enough
proof. The suite also needs to assert that the intended structural state is
still present, especially when responsive priority logic can silently collapse
the row before tooltip behavior is exercised.

## Follow-Up Watch Items

- if more breadcrumb-specific canonicals are added later, extend the same
  structural assertion pattern rather than relying only on tooltip hover tests
- keep canonical-shell fixes separate from inner family preview behavior so
  full-trail preservation cannot drift again through shared cleanup
