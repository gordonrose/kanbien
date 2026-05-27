# Breadcrumb RTL Compact Row Split

## Supersession Note

Archived on 2026-05-27 after the RTL compact-row lesson was promoted into
the active breadcrumb/sub-nav behavior locks, reference packs, verification
artifacts, and design-system audit tests.

Use the active breadcrumb and sub-nav design-system artifacts as current
authority. Keep this record as provenance for the escaped drift.

## Symptom

The RTL compact breadcrumb state rendered the signpost trigger and the search
shell on two separate lines instead of keeping them on the same shared row.

## Root Cause

The RTL compact layout assigned the breadcrumb lane to grid column 2 but left
the search shell on auto-placement. Because the breadcrumb nav appears first in
DOM order, the grid auto-placement algorithm placed the search shell into the
next available slot, which became the next row instead of the first-row left
lane.

## Why The Loop Missed It

The existing audit asserted the RTL compact grid columns but not the row
placement. That allowed the layout to look structurally correct in the CSS
while still breaking onto two rows under real canonical rendering.

## Prevention Added

- Explicitly pinned both RTL compact participants to row 1 so the mirrored
  compact signpost and search shell remain on the same line.
- Tightened `tests/audit/designSystem/breadcrumbOverflow.test.ts` to assert the
  RTL compact grid-row placement directly.
