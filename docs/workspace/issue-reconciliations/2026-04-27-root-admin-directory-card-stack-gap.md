# Root Admin Directory Card Stack Gap

## Summary

The root-admin users, tenants, and tenant-admins directory pages rendered
record cards without the signed-off list-page vertical stack gap.

## Root Cause

`rootAdminDirectoryWorkspace.mjs` rendered the card container as
`data-directory-items` only. The governed list-page stylesheet applies the
card-stack grid and gap through `[data-selectable-list-items]`, so the cards
had the approved card anatomy but no approved parent stack spacing.

## Why The Loop Missed It

The existing checks proved that the app imported the design-system stylesheet
and that cards used the expected selectable-list classes. They did not assert
the rendered spacing between adjacent cards, so a missing parent seam attribute
escaped.

## Reconciliation Changes Added

- Added `data-selectable-list-items` to the directory item container.
- Added a rendered visual regression check that verifies the governed `16px`
  row gap and measured browser gap for users, tenants, and tenant-admins.

## Coverage Lesson

For governed list pages, card anatomy checks are not enough. The parent list
stack seam must also be asserted because the visible spacing contract lives on
the container, not on individual cards.
