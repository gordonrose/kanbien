# List Form Drawer Document Scrollbar

## Summary

Switching the design-system list-page detail drawer into edit form mode caused
the outer page to expose a document scrollbar even though the form was meant to
scroll inside the drawer body.

## Root Cause

The edit form introduced enough vertical content for
`.list-page-form-drawer` to become an internal scroll lane. Browser scroll
geometry still counted the long form subtree toward the document scroll range,
so the page scrollbar appeared while the drawer itself remained visually
bounded.

## Why The Loop Missed It

The existing checks proved that the edit form opened, contained approved form
controls, and could save back into the list. They did not assert the human
visible scrollbar contract after the form mode transition or after an approved
picker opened inside the form.

## Reconciliation Changes Added

- Added a list-page document scroll lock while the split detail surface is open.
- Kept the date picker, time picker, and drawer select on their approved
  design-system implementations instead of adding local substitutes.
- Added a rendered regression check for edit-form overflow containment and
  date-picker visibility without a reserved page scrollbar.

## Coverage Lesson

For governed drawer surfaces with nested scroll lanes, interaction tests need a
browser-level overflow assertion. `toBeVisible()` is not enough when the escaped
failure is a scrollbar appearing outside the intended scroll context.
