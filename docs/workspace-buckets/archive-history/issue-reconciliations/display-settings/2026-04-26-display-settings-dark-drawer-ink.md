# Display Settings Dark Drawer Ink

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/display-settings/`
after the dark drawer ink lesson was found in active display-settings
design-system authority and dark-theme generated canonical coverage.

## Summary

During review of
`/design-system/canonical-renderings/display-settings/DSR-002`, the
dark-theme display-settings drawer still showed the `Display Settings` title
and nearby text in light-page ink. The dark drawer background was correct, but
some visible strings remained too dark to read.

## Root Cause

The display-settings drawer is a `.side-panel` rendered inside a locally scoped
dark canonical surface. The drawer background and tokens resolved from the
local dark scope, but `.side-panel` did not establish `color: var(--ink)` at
the component root. Headings and other inherited text could therefore keep the
ambient page text color instead of resolving foreground ink from the drawer's
dark token scope.

## Why It Escaped

The generated-route proof verified route ownership, drawer visibility,
selected state, magnification state, and a few structural conditions. It did
not assert the human-visible foreground color of the display-settings title,
eyebrow, group labels, or chips in the dark generated route.

Classification: missing human-visible dark-ink regression coverage. The suite
checked that dark theme was active, but not that all representative visible
strings used readable dark-scope ink.

## Reconciliation Changes

- `.side-panel` now establishes `color: var(--ink)` so drawer descendants
  inherit foreground ink from the active local theme scope.
- `DSR-002` generated-route coverage now asserts computed colors for:
  - `Display Settings`
  - `Display`
  - `Theme`
  - an inactive theme chip
  - the active dark chip
  - the active `+100%` magnification chip

## Coverage Lesson

For scoped dark canonical surfaces, state assertions such as
`aria-pressed="true"` and `data-theme-scope="dark"` are not enough. Each
high-risk dark route needs at least one computed-color assertion for
representative human-visible text that would become unreadable if foreground
inheritance drifts.

## Follow-Up Watch Items

- Continue adding direct dark-ink checks when migrating remaining generated
  canonical families.
- Treat repeated user-reported dark-theme ink misses as a signal to extract a
  shared visual helper for scoped foreground readability.
