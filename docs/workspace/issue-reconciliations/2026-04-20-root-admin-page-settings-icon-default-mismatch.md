# Root Admin Page Settings Icon Default Mismatch

## Summary

The icon shown in the root-admin page-settings form could disagree with the
icon shown in the shell navigation for the same page.

## Root Cause

The page-settings backend still returned legacy keys such as `page-default`
while the governed form icon grid rendered only design-system icon keys such as
`home`, `grid`, and `hierarchy`.

Unknown keys fell through to the first design-system icon, so the form could
show `Home` even when the shell nav correctly showed the page's default icon.

## Why The Loop Missed It

- the hierarchy-page browser coverage exercised modern icon-grid interactions
  but did not include a legacy/default-key response case
- the shell nav icons were still hardcoded, so the form and nav were not forced
  through one shared display adapter
- no regression test compared the visible nav icon and the visible form icon
  for the same selected page

## Reconciliation Changes Added

- added a root-admin adapter that resolves legacy/default backend icon keys to
  the correct displayed design-system icon for known shell pages
- synced matching shell nav icons from the same resolved icon key when page
  settings are loaded
- preserved the original backend key on save when the user did not actually
  change the icon choice
- added a browser regression that covers the `page-default` case for
  `root-admin-web-app-hierarchy`

## Coverage Lesson

When a browser surface bridges older backend contract values into a newer
governed design-system picker, regression coverage must assert the rendered
result the operator sees, not only the stored payload shape.

## Follow-Up Watch Items

- the backend page-settings icon catalog still uses legacy `page-*` keys rather
  than the governed design-system icon keys used by the current picker, so that
  contract should be reconciled explicitly in a later slice
