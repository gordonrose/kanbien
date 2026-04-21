# 2026-04-18 Drawer Select Dark Contrast Gap

## Summary

The dedicated `Drawer Select` dark-theme canonical exposed a contrast defect in
the compact attribute-card variant: selected cards and active available cards
used a light accent surface while still rendering key text in softened light
foreground tokens.

## User-Visible Symptom

- on `DSR-016` dark and magnified review, compact selected cards looked washed
  out
- the selected labels and active option labels did not read strongly enough
  against the bright lavender card surfaces
- the contrast issue was visible on the dedicated child render surface

## Root Cause

The compact attribute-card rules reused the general dark-theme foreground
tokens incorrectly.

- selected and active cards already used a bright accent-tinted background
- compact card labels still inherited `var(--ink-soft)` in places
- that combination produced low perceived contrast on the brightest compact
  states

## Why The Existing Loop Missed It

The current suite had dark-theme presence coverage, but not dark-theme
foreground-token proof for the compact selected and active cards.

It verified:

- the dark canonical route existed
- the correct child state was open
- theme and magnification attributes were applied

It did not verify the actual rendered foreground colors inside the high-risk
selected and active compact cards.

## Classification

- missing regression scenario
- dark-theme contrast gap
- child-state visual proof too shallow

## Reconciliation Changes

- added dark-theme overrides for compact selected and active drawer-select
  cards in `src/frontend/designSystem/assets/styles.css`
- promoted selected labels, active labels, and remove affordances to
  `var(--accent-text)` on the bright compact dark-theme card surfaces
- added an executable dark-theme foreground-color assertion to
  `tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts`

## Prevention Lesson

For dark-theme child canonicals, checking route presence is not enough when the
state uses bright accent surfaces.

The suite should assert at least one real foreground token outcome on the
highest-risk dark-theme state rather than only confirming that the route opens.

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts`

## Resolution Status

- candidate fix awaiting user confirmation
