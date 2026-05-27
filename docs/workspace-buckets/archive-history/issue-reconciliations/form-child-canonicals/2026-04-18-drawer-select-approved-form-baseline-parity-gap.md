# 2026-04-18 Drawer Select Approved Form Baseline Parity Gap

## Supersession Note

Archived on 2026-05-27 after the QA and issue-reconciliation freshness pass.
The approved-host parity lesson is now represented by current drawer-select
verification artifacts and visual tests. Treat this record as historical
escaped defect evidence, not current operating authority.

## Summary

The dedicated `Drawer Select` canonicals drifted far enough from the approved
`form-template` source surface that a human reviewer could see the drawer was
broken while the existing Playwright checks still passed.

## User-Visible Symptom

- the child canonical renders no longer looked like the signed-off
  `form-template` drawer-select seam
- desktop canonicals could slip into incorrect overlay posture or shortened
  review-slice rendering without the suite flagging it
- the issue was broad enough that the canonicals felt broken even though only a
  couple of narrow geometry checks had been failing previously

## Root Cause

The canonical renderer had become its own visual truth instead of staying tied
to the approved parent source surface.

Concretely:

- the renderer CSS introduced local overlay/layout behavior that could diverge
  from the approved `form-template` seam
- the suite still checked state, focus, contrast, and a few geometry rules, but
  it did not compare the canonical render back to the approved hosted source
  surface
- that left room for broad visual drift that was obvious to a person but not
  encoded in the tests

## Why The Existing Loop Missed It

The existing tests were honest about individual facts:

- drawer open state
- selected and available stack counts
- dark contrast on high-risk cards
- mobile overlay posture

But they did not ask the stronger question:

- does the canonical still look like the approved `form-template` seam?

Without that source-of-truth comparison, the suite could pass while the
canonical renderer gradually became its own variant.

## Classification

- wrong-layer frontend proof
- missing approved-source parity guard
- canonical renderer drift from signed-off parent surface

## Reconciliation Changes

- restored the desktop canonical panel to anchor and size against the canonical
  review shell rather than the tiny hosted field wrapper in
  `src/frontend/designSystem/assets/styles.css`
- narrowed an over-broad canonical-stage heading reset so it no longer changed
  drawer header title spacing inside the child seam
- added approved-form baseline parity checks to
  `tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts`
- those new checks now use the signed-off `form-template` page as the live
  source of truth for:
  - descriptive open desktop drawer
  - compact open desktop drawer
- the parity checks compare both:
  - screenshot-level panel rendering with pixel-diff tolerance
  - overlay relationship between trigger and panel

## Prevention Lesson

When a child canonical seam is derived from a signed-off parent page, narrow
geometry checks are not enough on their own.

The suite also needs at least one direct parity test against the approved host
surface so the child renderer cannot quietly become a different visual answer.

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts`

## Resolution Status

- candidate fix awaiting user confirmation

## Residual Risk

The new approved-form parity guard is currently strongest for the two desktop
open states that have the cleanest one-to-one source seam. Dark magnified and
mobile canonicals still rely on their narrower dedicated checks rather than a
full approved-form screenshot parity comparison.
