# List Detail Split Layout False Desktop Compression

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into the list-detail split
> layout behavior lock, reference pack, verification checklist, signed-off
> canonical tests, and component inventory. Keep future authority in those
> active design-system artifacts.

## Symptom

Desktop split canonicals such as `LDSL-003` claimed `1080px` review width at `0%` magnification, but the rendered split was visibly more compressed than a normal desktop lane and pushed header actions into a wrapped row sooner than the declared canonical circumstances implied.

## Root Cause

The split-layout preview shell used `width: min(requested-width, 100%)`. Inside the canonical page shell, that let the preview silently shrink to whatever width remained after surrounding chrome and gutters, so the canonical could claim a full desktop width while actually rendering a narrower impostor state.

## Why The Loop Missed It

The automated tests opened the page in a viewport wide enough to avoid the clamp, so they only verified the declared desktop width in favorable conditions. They did not force a narrower browser to prove the canonical preserved its requested width honestly.

## Prevention Added

- added the same fit-scale compensation pattern used by the sub-nav canonical surface and extended it to account for the canonical page losing width relative to the full browser viewport
- wrapped the preview in a canonical render scroller and moved width compensation into fitted frame width, fitted frame height, and fit-scale variables
- added a regression that opens `LDSL-002` in a narrower browser and verifies the canonical scales below `1` because the render frame is smaller than the full screen while keeping the short-header action row on a single line
