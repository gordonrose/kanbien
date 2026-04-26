# Async Activity Waiting Progress Visual Reconciliation

## Summary

The `AADR-003` async activity drawer canonical showed queued/waiting work with a progress bar that could read as complete. Queued or pending work should remain visible, but it must not visually imply completion.

## Root Cause

The drawer encoded progress fill width as an inline `style` attribute. The repo's browser CSP does not allow that inline style to affect rendering, so the fill element's block layout expanded to the full track even when the DOM attribute said `18%`. The waiting-state demo also reused the determinate progress path, which made queued work look like completed work.

## Why It Escaped

- Existing coverage proved that `AADR-003` used the waiting state and that no completion result grid rendered.
- The test checked the inline `width` attribute, but did not compare the painted fill width to the progress track width.
- The harness therefore missed that the browser ignored the inline style under CSP.
- The missing layer was a human-visible regression guard for progress geometry in non-complete states.

## Reconciliation Changes

- Progress fill now uses CSP-safe SVG geometry instead of inline style width.
- Waiting jobs now render as not-started progress with the accessible label `waiting to start`.
- The async drawer Playwright spec now verifies actual rendered progress geometry for both:
  - `AADR-002` running progress, which must be partial and proportional.
  - `AADR-003` waiting progress, which must have no visible completion fill.
- The async activity drawer reference pack and verification checklist now describe rendered progress geometry as part of the proof.

## Coverage Lesson

For governed visual states, DOM state and inline styles are not enough when the reported issue is how the control looks. Progress, clipping, overlap, and contrast checks need rendered browser geometry or computed visual assertions.

## Watch Items

- Future pending/queued job variants should avoid determinate completion language unless backend progress truth can distinguish queued preparation from actual execution.
- If an indeterminate waiting treatment is later approved, add a separate canonical and visual guard rather than reusing the running progress semantics.
