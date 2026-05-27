# Choice Group And List Detail Panel Canonical Ready Before Settle

> Archived on 2026-05-27 during the form-control canonical cleanup. The
> prevention lesson is now promoted into generated canonical ready-after-settle
> expectations, choice-group/list-detail verification artifacts, and visual
> tests.

## Summary

While extending the generated canonical guard pass to `choice-group` and
`list-detail-panel`, both renderers exposed ready-state sequencing that was
less strict than the newer canonical render standard.

Affected generated routes included:

- `/design-system/canonical-renderings/choice-group/CGR-010`
- `/design-system/canonical-renderings/choice-group/CGR-011`
- `/design-system/canonical-renderings/list-detail-panel/LDP-005`
- `/design-system/canonical-renderings/list-detail-panel/LDP-008`
- `/design-system/canonical-renderings/list-detail-panel/LDP-009`

## Root Cause

Choice Group published `data-render-status="ready"` immediately after applying
state, without a settled-frame boundary.

List Detail Panel published ready before the deferred tooltip, focus-entry, and
header-compaction pass had run. The visual state usually settled correctly, but
the ready marker allowed tests and reviewers to observe the surface before the
child render geometry and focus posture were final.

## Why The Loop Missed It

The existing suites already checked route loading, scoped theme/direction,
mobile posture, long-copy behavior, focus entry, and header compaction. They did
not require ready to mean the final settled browser geometry had completed, and
List Detail Panel did not use the shared route-surface truth helper.

Classification: shared-seam readiness blind spot with route-template coverage
that was weaker than newer generated canonical families.

## Reconciliation Changes

- `src/frontend/designSystem/assets/choiceGroupCanonical.mjs` now publishes
  ready only after a settled frame boundary.
- `src/frontend/designSystem/assets/listDetailPanelCanonical.mjs` now publishes
  ready only after tooltip recovery, focus-entry, and header-compaction sync
  have completed.
- `tests/visual/designSystem/canonicals/data-display/listDetailPanel.spec.ts`
  now uses `expectRouteSurfaceTruth(...)` for every generated render route.
- `tests/visual/designSystem/canonicals/data-display/listDetailPanel.spec.ts`
  now asserts representative detail panels remain contained by the dedicated
  canonical review frame.

## Coverage Lesson

Generated canonical readiness should consistently mean the route is ready for
human review, not merely that initial state data was applied. Even non-overlay
families need route-surface and containment proof when they own scroll,
compaction, focus, mobile, theme, or magnification behavior.

## Follow-Up Watch Items

- Apply the same ready-after-settle standard to future generated canonical
  families by default.
- Keep `list-detail-split-layout` as a separate pass because its split/overlay
  postures have higher layout risk than the standalone detail panel.
