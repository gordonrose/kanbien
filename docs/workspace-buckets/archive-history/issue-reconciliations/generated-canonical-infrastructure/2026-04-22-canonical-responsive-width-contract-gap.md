# 2026-04-22 Canonical Responsive Width Contract Gap

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/generated-canonical-infrastructure/`
after the responsive width lesson was found in active canonical render-page
authority and integration audit coverage.

## Symptom

Dedicated canonical render pages could clip hosted fields and parent framing
copy against the viewport instead of shrinking responsively inside the review
lane.

## Root Cause

The `date-picker` canonical controller moved toward a width-variable model, but
the surrounding preview frame still sized off intrinsic content and the hosted
form card/header seam did not consistently allow children to shrink and wrap.

## Why The Loop Missed It

Earlier checks proved route truth, launcher truth, theme scope, and overlay
containment, but the repo still lacked a source-level audit for responsive
width negotiation inside canonical render frames.

## Prevention Added

- Pinned canonical frame width to a responsive `min(..., 100%)` contract driven
  by the render width variable.
- Required hosted form cards and section headers to allow shrink and wrap
  instead of clipping.
- Added `tests/integration/frontend/designSystemCanonicalResponsiveWidthAudit.test.ts`
  so future canonical controllers fail if they reintroduce hard inline widths
  or drop the responsive frame contract.

## Follow-Up Rule

Dedicated canonical render surfaces may declare an intended specimen width, but
they must negotiate that width through responsive CSS variables and shrink
inside the available viewport rather than clipping page-owned fields.
