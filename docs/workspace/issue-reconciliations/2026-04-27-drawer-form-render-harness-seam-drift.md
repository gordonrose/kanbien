# Drawer Form Render Harness Seam Drift

## Summary

The `drawer-form` generated render page looked close to the signed-off list
drawer, but it was locally reconstructing the list/detail shell instead of
consuming the list page's governed drawer seam. The browser screenshots exposed
RTL and layout drift because the child render page was proving a copied
approximation, not the shared parent seam.

## Root Cause

The first `drawer-form` implementation extracted the form body into
`drawerForm.mjs`, but the host drawer shell still lived as static markup in the
list-page template. Because there was no consumable list drawer shell renderer,
`components/drawer-form.html` copied `.list-page-shell-split`,
`.list-page-detail-panel`, the drawer header controls, and footer actions into
the child render page.

That made the canonical page vulnerable to parent-shell drift even though the
form body itself was shared.

## Why The Feature Loop Missed It

- The tests asserted rendered geometry and visible form controls, but not
  source-of-truth adoption.
- The canonical render-page checklist focused on page shape, stepper metadata,
  RTL scoping, and open child controls, but did not require proof that inherited
  parent anatomy came from the parent seam.
- The design-system loop guidance said app consumers must not copy governed
  seams, but did not make the same rule explicit for child canonical render
  pages inside `/design-system`.
- The absence of a consumable parent shell seam was treated as an
  implementation detail rather than a blocker.

## Reconciliation Changes

- Added `src/frontend/designSystem/assets/listDrawerShell.mjs` as the shared
  list drawer shell renderer.
- Updated the list-page template to hydrate the drawer panel through
  `data-list-drawer-shell-template="panel"`.
- Updated the drawer-form canonical render page to hydrate its host through
  `data-list-drawer-shell-template="split-layout"` instead of declaring drawer
  markup locally.
- Added visual-suite adoption coverage that reads the drawer-form render page
  source and fails if it reintroduces local list drawer shell anatomy.
- Added runtime adoption assertions that both list-page and drawer-form
  surfaces expose `data-list-drawer-shell-source="list-drawer-shell"`.
- Updated the design-system loop harness and skill instructions to require
  child render pages to consume signed-off parent seams or stop.

## Coverage Lesson

Visual similarity is not sufficient evidence for a governed design-system seam.
When a child family inherits a parent shell, the harness must prove shared
source-of-truth consumption as well as rendered geometry.

## Follow-Up Watch Items

- The broader list-detail-panel and list-detail-split-layout canonical render
  pages still have page-local shell markup. They predate this incident and
  should be audited before being used as proof for downstream app adoption.
- First real-app adoption of `drawer-form` should consume both the shared
  drawer shell and form body seams, or explicitly record why a narrower host
  adapter is approved.
- The `DF-021` dark drawer-select state exposed another harness gap: visibility
  and theme-scope assertions did not prove readable foreground contrast. The
  repair moved the default foreground rule to the generic theme-scope contract
  (`html[data-theme] body, [data-theme-scope]`) and added a shared
  `expectThemedScopeForegroundContract` helper so composed dark-theme surfaces
  can verify critical text without one-off drawer-specific color checks.
- The same `DF-021` state also exposed that the nested drawer-select panel was
  still using the wrong containing block inside the canonical specimen. The
  first containment repair caught viewport escape, but the panel could still
  resolve against the positioned drawer-select field wrapper and collapse into
  the middle of the form when the drawer lane scrolled. The repair now anchors
  drawer-hosted drawer-select panels to the signed-off list detail drawer lane,
  keeps the panel itself from becoming the scroll container, and avoids
  canonical auto-scroll for full-height nested drawer states. The drawer-form
  suite now applies the shared
  `expectCanonicalOverlayContainedInRenderSurface` helper to date, time, and
  drawer-select open states so `toBeVisible()` can no longer mask an escaped
  or wrongly anchored overlay. Canonical render frames provide the local
  positioning scope for fixed-style child drawers and mobile picker overlays
  rendered inside them, and drawer-hosted child drawers add a stricter
  containment proof against the actual detail drawer panel.
