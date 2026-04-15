## Summary

At compressed desktop widths, the design-system top header allowed the logo
mark to become horizontally squashed and visually intruded upon by the primary
navigation. The brand shape was no longer stable under header compression.

## Root Cause

The top header grid in `src/frontend/designSystem/assets/styles.css` used a
fractional first column:

- `grid-template-columns: minmax(0, 1.2fr) auto auto;`

That allowed the brand column to shrink under pressure from the primary nav and
profile utility columns. At the same time, the brand mark itself was not
protected as a fixed-size flex item, so the logo square could compress instead
of holding its intended proportions.

## Why The Loop Missed It

The current executable checks covered:

- nav overflow behavior
- mobile takeover rules
- layering
- breadcrumb compaction

But they did not assert the header geometry contract:

- brand column should be content-sized, not fractional
- brand mark should keep a fixed square footprint

That made this a wrong-layer coverage miss. We had responsive behavior tests
around the nav, but no guard on the brand seam that the nav was allowed to
pressure.

## Reconciliation Changes Added

- changed `.top-nav` to use `grid-template-columns: auto minmax(0, 1fr) auto`
- made `.brand-mark` a fixed-size flex item with `flex: 0 0 3rem`
- added `aspect-ratio: 1 / 1` and `overflow: hidden` to keep the mark square
- added audit expectations in
  `tests/audit/designSystem/contextNavResponsive.test.ts` for the protected
  header geometry contract

## Coverage Lesson

Responsive header verification should not only test overflow behavior. It also
needs to protect fixed-geometry identity elements like brand marks and avatars,
because those elements should resist compression while flexible navigation
areas adapt around them.

## Follow-up Watch Items

- if the brand lockup becomes more sophisticated later, add a governed
  constrained-desktop visual state for header compression
- keep fixed-shape identity elements out of fractional tracks unless there is
  explicit squashing behavior by design
