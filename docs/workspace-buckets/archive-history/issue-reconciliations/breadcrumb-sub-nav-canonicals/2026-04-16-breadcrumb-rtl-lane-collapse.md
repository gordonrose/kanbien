# Breadcrumb RTL Lane Collapse

## Supersession Note

Archived on 2026-05-27 after the RTL lane-collapse lesson was promoted into
the active breadcrumb/sub-nav behavior locks, reference packs, verification
artifacts, and design-system audit tests.

Use the active breadcrumb and sub-nav design-system artifacts as current
authority. Keep this record as provenance for the escaped drift.

## Symptom

After recent RTL canonical work, the breadcrumb could render behind the search
field, the home icon fallback would not activate consistently, and item
ordering pressure felt wrong in RTL full-width states.

## Root Cause

The RTL override for `.breadcrumb-nav` used `justify-self: start`, which
stopped the breadcrumb container from stretching to the full width of its grid
lane. That made the breadcrumb measure against its content box instead of the
real lane width, which undermined the overflow/reduction logic and let the row
spill into the search area.

## Why The Loop Missed It

- Existing RTL checks covered directionality and menu anchoring, but not the
  breadcrumb lane-sizing rule itself.
- Follow-on fixes for reduction order and popover mirroring changed the
  symptoms, which made the underlying lane-measurement problem harder to spot.

## Prevention Added

- RTL breadcrumb lane styling now uses `justify-self: stretch` with
  `width: 100%` so the breadcrumb measures against its actual row lane.
- Breadcrumb audit coverage now checks the RTL lane-sizing rule directly.
