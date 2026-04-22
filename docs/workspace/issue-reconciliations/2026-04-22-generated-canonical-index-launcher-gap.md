# Generated Canonical Index Launcher Gap

## Symptom

New canonical-renderings family work was described as launcher-wired even though
the user could not reach the new families from the top-level
`/design-system/canonical-renderings` index in the visible workspace.

## Root Cause

The validation loop proved only:

- family launcher to dedicated render route
- dedicated render route surface truth

It did not prove:

- top-level generated canonical-renderings index to family launcher
- visible-workspace family presence for the batch being described

That let a slice sound complete while the user-facing launcher seam still did
not expose the family.

## Why The Existing Loop Missed It

- family-local Playwright coverage started from `/design-system/canonical-renderings/<family>`
  instead of `/design-system/canonical-renderings`
- there was no shared shell-level spec asserting that the top-level generated
  index exposes every seeded family card and that each card opens a usable
  family launcher
- completion language was based on isolated-family proof rather than the full
  user click chain

## What Was Added

- a new generated-index browser spec at
  `tests/visual/designSystem/canonicals/shell/generatedCanonicalRenderingsIndex.spec.ts`
  that:
  - asserts the top-level index exposes the seeded family launcher cards
  - clicks each family card from the top-level index
  - clicks a sample reference from the family launcher
  - proves the dedicated render surface loads instead of a fallback shell
- a checklist update requiring top-level generated-index coverage before a new
  family batch is called complete

## Prevention Rule

Do not call a generated canonical-renderings batch launcher-wired unless the
browser proof starts at `/design-system/canonical-renderings` and confirms:

1. index card exists
2. index card opens the family launcher
3. family launcher opens a dedicated render route
4. the dedicated render route loads the intended specimen surface
