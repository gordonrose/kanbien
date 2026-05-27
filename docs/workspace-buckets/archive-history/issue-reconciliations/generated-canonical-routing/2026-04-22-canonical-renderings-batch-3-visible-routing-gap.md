# 2026-04-22 Canonical Renderings Batch 3 Visible Routing Gap

## Symptom

Direct generated canonical-rendering routes for the newer form-control families,
such as:

- `/design-system/canonical-renderings/choice-group/CGR-003`
- `/design-system/canonical-renderings/date-picker/DTPR-001`
- `/design-system/canonical-renderings/drawer-select/DSR-002`

loaded the generic design-system overview surface instead of the dedicated
render page, even after launcher pages had been updated to point at
`/design-system/canonical-renderings/...`.

## Root Cause

The visible workspace had only received the launcher-link updates. It had not
received the batch-3 route materialization slice:

- router mapping for `choice-group`, `date-picker`, and `drawer-select`
- persistence seed migrations `0035` through `0037`
- generated-route-aware canonical controllers for those families

That meant the direct render routes still fell through to
`src/frontend/designSystem/index.html`.

## Why The Existing Loop Missed It

The verification gap had two layers:

1. launcher coverage existed, but it over-weighted card/link truth and did not
   guarantee the direct render-route HTML resolved to the dedicated component
   page in the visible workspace.
2. the batch-3 implementation lived in an isolated worktree for a while, while
   the visible workspace only carried partial launcher updates.

## Prevention Added

- Ported the missing batch-3 canonical-rendering slice into the visible
  workspace.
- Added `tests/integration/frontend/designSystemCanonicalRouting.test.ts` to
  assert the direct generated canonical routes serve the correct component HTML
  and not the overview shell.

## Follow-Up Rule

For future canonical-rendering batches, a family is not considered wired until
all of the following are true in the visible workspace:

- the top-level launcher exposes the family
- the family launcher route resolves
- the dedicated render route resolves
- a direct server-side route test proves the render URL does not fall back to
  the overview shell
