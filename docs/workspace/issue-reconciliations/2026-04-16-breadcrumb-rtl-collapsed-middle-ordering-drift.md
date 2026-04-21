# Breadcrumb RTL Collapsed-Middle Ordering Drift

## Symptom

The locked RTL sub-nav canonical rendered the collapsed middle `...` signpost on
the wrong side of the `Previous` breadcrumb button, even after the wider RTL
full-width canonical and lane-stretch fixes were in place.

## Root Cause

The RTL breadcrumb layout still relied on an explicit `order` mapping in
`src/frontend/designSystem/assets/styles.css`, and that mapping placed the
collapsed middle segment after `Page -1` / `Previous` in RTL. The renderer was
stable, but the CSS ordering contract itself no longer matched the approved RTL
breadcrumb structure.

## Why The Loop Missed It

The existing breadcrumb audit checked that RTL ordering rules existed, but it
did not encode the approved relationship between the collapsed middle segment
and `Previous`. That meant we could drift to a syntactically valid but visually
wrong RTL ordering without tripping the prevention layer.

## Prevention Added

- Updated the RTL breadcrumb `order` rules so the collapsed middle segment and
  its separator are placed before `Previous` in the approved mirrored layout.
- Tightened `tests/audit/designSystem/breadcrumbOverflow.test.ts` to assert the
  corrected RTL order values for both the live breadcrumb and the sub-nav
  canonical preview breadcrumb.
