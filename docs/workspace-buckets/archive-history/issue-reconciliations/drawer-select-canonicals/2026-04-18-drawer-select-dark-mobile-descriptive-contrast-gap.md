# Drawer Select Dark Mobile Descriptive Contrast Gap

> Archived on 2026-05-27 during the drawer-select canonical cleanup. The
> prevention lesson is now promoted into the drawer-select reference pack,
> verification checklist, dark mobile `DSR-*` states, contrast assertions, and
> visual tests.

## Symptom

`DSR-026` showed descriptive selected-card helper text that looked washed out on
the bright accent-tinted card background in dark mobile review.

## Root Cause

The shared dark-theme overrides only promoted foreground contrast for the
attribute-card variant. The descriptive selected-card helper copy and active
available-option helper copy kept using the softer `var(--ink-soft)` token even
when their surfaces switched to bright accent backgrounds in dark theme.

## Why The Loop Missed It

The existing dark contrast regression only covered `DSR-016`, which is the
compact attribute-card variant. That left the descriptive dark mobile state
without a human-visible foreground-color guard on its helper copy.

## Prevention Added

- shared dark-theme foreground override for descriptive selected and active
  helper copy on bright accent surfaces
- new executable regression in
  `tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts` for `DSR-026`
