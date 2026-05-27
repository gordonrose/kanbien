# Design System Primary Nav Overflow Menu Drift

## Supersession Note

Archived on 2026-05-27 after the overflow-menu derivation lesson was promoted
into the active top-nav verification checklist, top-nav `TRP-*` canonical
visual suite, source audits, and root-admin shell parity evidence.

Use the active top-nav design-system artifacts as current authority. Keep the
component-inventory adoption/parity and shared-seam extraction caveats visible
there rather than in this historical issue record.

## Summary

In compressed desktop widths, the top navigation started moving items into the
`More` affordance, but the dropdown still showed links that remained visible in
the main row. The overflow menu and visible desktop nav drifted apart.

## Root Cause

The desktop overflow logic in `src/frontend/designSystem/assets/app.mjs`
correctly hid trailing `.nav-link` elements based on available width, but the
contents of `#primary-nav-overflow-menu` were still the original hardcoded HTML
from `src/frontend/designSystem/index.html`.

That meant the row and the dropdown were driven by different sources of truth:

- visible buttons were controlled by runtime measurement
- overflow menu items were static markup

## Why The Loop Missed It

The current protection was wrong-layer coverage.

`tests/audit/designSystem/contextNavResponsive.test.ts` verified that:

- the overflow button existed
- the menu container existed
- the overflow update function existed

But it did not verify that the dropdown contents were derived from the hidden
links, so a static menu could still satisfy the audit even while the live UI
was wrong.

## Reconciliation Changes Added

- added `renderPrimaryNavOverflowMenu(links)` in
  `src/frontend/designSystem/assets/app.mjs`
- cleared and rebuilt the overflow menu during each nav overflow update
- populated the dropdown with only the hidden links in normal `More` mode
- populated the dropdown with the full nav set in `Navigation` fallback mode
- tightened `tests/audit/designSystem/contextNavResponsive.test.ts` to assert
  that the overflow menu is rendered from runtime link state rather than just
  existing as static scaffolding

## Coverage Lesson

For governed responsive UI, existence checks are not enough when the bug class
is state drift. The audit must assert the derivation path, not only the
presence of containers and handlers.

## Follow-up Watch Items

- if top-nav overflow behavior changes again, prefer a rendered frontend
  scenario that verifies visible vs overflowed items at a constrained desktop
  width
- keep static menu scaffolding out of dynamic overflow controls unless it is
  explicitly regenerated from the same runtime state
