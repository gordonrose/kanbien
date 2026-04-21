# Root Admin Root-Users `sr-only` Grid Drift

## Symptom

On `2026-04-21`, the real `/root-admin#users` page could render a broken desktop open-detail posture where the list lane appeared in the upper-right while the detail panel dropped into the lower-left instead of forming the signed-off two-lane split.

## Root Cause

The root-users list shell included an announcement node as the first child of the `list-page-shell-split` grid container:

- `#root-users-list-announcement`

That node still used the old `sr-only` class, but the shared design-system stylesheet only hides `.visually-hidden`.

Because the announcement node was not actually visually hidden, it remained a real grid item and occupied the first grid cell. The list column and detail panel then auto-placed into later cells, which broke the intended split layout.

The same stale class also existed on several hidden root-admin web-app-hierarchy support nodes. The shared design-system `formControls.mjs` icon-grid search label used the same stale class.

## Why The Loop Missed It

The existing root-admin root-users spec verified that the detail panel opened and that the split layout carried the `detail-open` class, but it did not assert the actual desktop lane geometry.

That meant the test suite could pass while a stray, supposedly hidden DOM node still participated in the grid and displaced the list/detail lanes.

## Prevention Added

- Replaced root-admin `sr-only` usages with `visually-hidden` in `src/frontend/rootAdminShell/index.html`.
- Replaced the stale shared design-system `sr-only` usage in `src/frontend/designSystem/assets/formControls.mjs`.
- Strengthened `tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts` so the desktop open-detail scenario now asserts:
  - the announcement node is hidden
  - the list lane remains left of the detail lane in LTR
  - both lanes stay top-aligned in the signed-off split posture

## Follow-up Expectation

Any future governed root-admin adoption work should treat legacy hidden-class names as structural risk, not only accessibility cleanup, because stale “hidden” helpers can still alter grid and flex layout when shared CSS no longer recognizes them.
