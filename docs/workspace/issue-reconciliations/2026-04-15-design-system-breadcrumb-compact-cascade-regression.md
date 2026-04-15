# Design System Breadcrumb Compact Cascade Regression

## Summary

- Date found: `2026-04-15`
- User-visible symptom:
  in compressed desktop widths the compact breadcrumb signpost icon appeared,
  but the full breadcrumb row remained visible underneath it, producing a
  broken mixed state
- Affected surface:
  public `/design-system` breadcrumb overflow behavior

## Root Cause

The compact breadcrumb logic in `app.mjs` correctly added `.hidden` to the full
breadcrumb list when the compact mode engaged.

However, the stylesheet later assigned `.breadcrumb-list { display: flex; }`,
which overrode the generic `.hidden { display: none; }` because both selectors
had the same specificity and the breadcrumb rule appeared later in the file.

That meant the compact state partially activated:

- compact signpost button became visible
- full breadcrumb list stayed rendered

## Why The Feature Loop Missed It

- the current design-system audits verify that the compact-mode logic exists in
  the script and that the compact trigger conditions are present
- they do not currently verify the rendered CSS cascade outcome for the exact
  mixed state
- this was therefore a real browser-state regression that escaped a
  source-structure audit

This escaped because of:

- **missing coverage**
- **wrong-layer coverage**

## Reconciliation Changes Added

- hardened `.hidden` so it wins against later layout declarations by using
  `display: none !important`:
  [src/frontend/designSystem/assets/styles.css](/home/gordon/kanbien/src/frontend/designSystem/assets/styles.css:1)
- reran the focused design-system verification suite after the fix

## Coverage Lesson

For interactive overflow states, source-level audits are not enough on their
own. We still need at least one rendered frontend scenario for the compact
breadcrumb state so CSS cascade regressions are caught where they actually
occur.
