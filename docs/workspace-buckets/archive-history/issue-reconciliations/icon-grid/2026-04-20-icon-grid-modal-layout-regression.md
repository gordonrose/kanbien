# 2026-04-20 Icon Grid Modal Layout Regression

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/icon-grid/`
after the icon-grid modal layout lesson was found in active icon-grid
behavior-lock, reference-pack, verification, and visual-test authority.

## Summary

- User-visible symptom:
  the `Icon Grid` modal looked visually broken in the hosted form route, with
  the search field and icon catalog appearing as a narrow split layout instead
  of one readable stacked modal
- Affected surfaces:
  `/design-system/templates/form`
  `/design-system/components/icon-grid`

## Root Cause

- The modal panel was implemented with a generic `display: grid` container but
  without an explicit single-column contract for the modal body.
- The icon matrix also used stretchable `1fr` columns, so once the modal body
  drifted into a narrower content lane the tiles expanded into oversized cards
  and the catalog no longer read as a dense icon grid.
- The icon-grid search input was also still inheriting the broader shared
  search-field right padding, which made the narrow broken state feel even more
  cramped.

## Why It Escaped

- The current executable coverage only checked:
  icon counts, search filtering, tooltip naming, focus handoff, and selection
  synchronization.
- That meant the suite proved the state model but not the user-visible layout
  contract.
- Classification:
  missing regression scenario
  wrong assertion layer for a human-visible layout bug

## Reconciliation Changes Added

- Locked `.form-icon-grid-panel` to an explicit stacked flex-column layout in
  `src/frontend/designSystem/assets/styles.css`
- Changed the icon matrix to fixed dense columns with left alignment so the
  catalog keeps its intended scan rhythm under desktop review
- Added an icon-grid-specific search-input padding override so the field stays
  readable in the modal
- Added a geometry-based browser assertion in
  `tests/visual/designSystem/canonicals/forms/iconGridCanonical.spec.ts` that
  checks the full-width stacked layout and a multi-column first row

## Coverage Lesson

- For governed frontend seams, count-only and focus-only assertions are not
  enough when the escaped bug is “this looks broken.”
- Child-family canonical coverage should include at least one geometry or
  visible-layout assertion for modal composition, not only state and behavior.

## Follow-Up Watch Items

- If the icon grid gains grouped sections or richer metadata, extend the child
  canonical suite with a screenshot or additional geometry guard for those new
  layouts as well.
