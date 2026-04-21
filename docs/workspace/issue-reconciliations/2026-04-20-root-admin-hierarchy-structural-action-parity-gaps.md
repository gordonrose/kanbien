# Summary

The root-admin `web-app-hierarchy` page drifted from the signed-off
`hierarchy-tree` family in three user-visible ways:

- page-row structural actions were inconsistent across levels
- desktop drag-and-drop looked available but did not actually drive a move path
- the resize cursor sat inside the drawer’s scroll lane instead of on the true
  outer drawer edge

The live result felt incomplete and misleading even though the first
`design-system` create/preview/apply slice was wired.

## Root Cause

Three separate implementation gaps combined:

- the shared `mountRootAdminHierarchyTree(...)` consumer mount only wired a
  narrow subset of the family grammar:
  `add child` on some rows, `outdent`, and `orphan`
  It did not expose sibling creation, and it did not carry the full desktop
  drag/drop seam through to the root-admin consumer.
- the consumer mount treated any parent id as proof that a page could move to a
  parent level, which incorrectly surfaced `Move to parent level` for
  top-level module-root pages because module ownership was being mistaken for a
  page parent.
- the root-admin drawer used the outer `aside.side-panel` as the scroll
  container, so the resize handle sat inside the same scrollable box as the
  scrollbar. That placed the cursor lane visually to the left of the scrollbar
  instead of at the true drawer edge.

## Why The Loop Missed It

- the earlier root-admin browser suite focused on the first happy-path
  materialization flow:
  read applied tree, create proposal, preview, apply
- that coverage did not exercise nested page rows, sibling creation, or drag
  semantics on the real root-admin consumer
- the prior resize coverage proved that the drawer width changed, but it did
  not assert where the handle actually sat relative to the drawer edge and
  scroll lane

This was a wrong-layer gap more than a pure no-test gap:
the shared family already proved these behaviors on `/design-system`, but the
real root-admin adoption lacked consumer-parity assertions for them.

## Reconciliation Changes

- expanded `mountRootAdminHierarchyTree(...)` so the root-admin consumer now
  supports:
  - child creation on page rows
  - sibling creation on page rows
  - desktop drag-and-drop reparent requests
  - truthful mobile/desktop live-note messaging for create and move posture
- corrected module-row wording so container rows say `Add child page` instead
  of the more misleading `Add top-level page`
- tightened `Move to parent level` visibility so it appears only when the
  actual parent is another page, not merely a module container
- wired the root-admin controller through the new sibling-create and reparent
  callbacks
- moved the root-admin hierarchy drawer scroll behavior into an inner scroll
  wrapper so the resize handle sits on the real outer drawer edge instead of in
  the scrollbar lane
- extended the root-admin Playwright suite with:
  - nested page-row menu coverage for child/sibling/orphan/outdent visibility
  - desktop drag-and-drop request coverage
  - resize-handle edge-geometry coverage

## Coverage Lesson

When a signed-off design-system family is adopted into a real consumer, the
browser suite cannot stop at the first happy-path business flow. It also has to
prove the consumer still exposes the family’s full row grammar across nested
levels and that affordances which look interactive actually drive the real
callback path.

For drawer-hosted admin surfaces, width-resize tests should also assert handle
geometry, not only width changes.

## Watch Items

- the root-admin consumer still does not expose menu-based `move up` and
  `move down` reorder fallbacks, so keyboard-equivalent sibling reordering is
  still not fully at parity with the broader signed-off family
- design-system live-route moves may still be compatibility-blocked by backend
  route-safety rules on specific pages; this reconciliation fixed the consumer
  wiring and truthfulness, not the broader compatibility policy
- user confirmation is still needed that the localhost surface now feels right
  in the browser after these parity fixes
