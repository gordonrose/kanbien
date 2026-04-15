## Summary

At compressed desktop widths, the design-system primary navigation stopped
collapsing into the `More` control soon enough. Instead, the header continued
to grow visually off-screen and the top-nav items overlapped or escaped the
available viewport width.

## Root Cause

The overflow logic in `src/frontend/designSystem/assets/app.mjs` measured
against `primaryNav.clientWidth`.

That was the wrong seam. The actual limit for the nav is the middle header
track left over after:

- the brand lockup takes its space
- the profile utility block takes its space
- the header grid gaps are applied

Because the logic measured the nav box rather than the real available header
slot, it could still believe more links fit even after the overall header had
already begun pushing off-screen.

## Why The Loop Missed It

This was wrong-layer coverage again.

The current audit verified:

- overflow logic existed
- `More` and `Navigation` affordances existed
- responsive nav machinery was wired

But it did not verify that the overflow calculation was based on the real
header slot bounded by the brand and profile columns.

## Reconciliation Changes Added

- replaced the brittle width-estimate approach with a rendered-fit loop in
  `src/frontend/designSystem/assets/app.mjs`
- the top-nav now follows the same honest pattern used successfully by the
  breadcrumb:
  - show the row
  - show `More`
  - hide trailing visible links one by one
  - stop only when the rendered nav actually fits
- added an explicit overlap guard so if the `More` button visually intrudes on
  the last visible nav button, that last button is also moved into overflow
- added a reserved-profile-area overlap guard so visual intrusion into the
  profile utility region also counts as overflow even if `scrollWidth` claims
  the nav still fits
- refined that overlap guard to inspect the escaping child controls
  themselves, especially the last visible nav button and the `More` button,
  rather than trusting only the parent nav container box
- prevented `.nav-link` controls from shrinking by adding
  `flex: 0 0 auto` and `white-space: nowrap`
- prevented `.profile-button` from shrinking by adding `flex: 0 0 auto`
- tightened `tests/audit/designSystem/contextNavResponsive.test.ts` to assert
  that top-nav overflow now uses rendered-fit logic and that header controls
  keep intrinsic widths instead of collapsing first

## Coverage Lesson

Responsive overflow behavior is more reliable when it follows the real rendered
layout state rather than inferred width arithmetic.

It also depends on honest intrinsic sizing. If responsive controls are allowed
to shrink, the layout can visually fail before overflow logic sees the real
problem.

Rendered fit also needs a visual-overlap guard in header controls. A row can
technically report as fitting while still producing a bad user-visible state if
the overflow affordance intrudes on the last visible item or the nav intrudes
into the reserved profile area.

That guard also has to check the child that is actually escaping. Parent
container geometry can still look acceptable while a visible button protrudes
past it into reserved space.

## Follow-up Watch Items

- add a rendered constrained-desktop scenario for the top header if header
  compression continues to evolve
- keep responsive calculations attached to the real grid/flex contract rather
  than inferred child widths
