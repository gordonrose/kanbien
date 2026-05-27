# Hierarchy Tree Render Drawer Containment Reconciliation

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/hierarchy-tree/`
after the hierarchy-tree generated render containment lesson was found in
active hierarchy-tree reference-pack, verification, routing, and visual-test
authority.

## Summary

Hierarchy-tree generated render pages showed the hierarchy drawer over the whole design-system page instead of contained inside the canonical preview area. The defect matched earlier drawer containment issues from other canonical families.

## Root Cause

The generated canonical-render route registry mapped the `hierarchy-tree` family to `patterns/hierarchy-tree/index.html`, which is the reference/launcher page. That allowed the generated render URL to serve reference-surface copy such as "Review This Pattern" instead of the dedicated render template under `patterns/hierarchy-tree/render/index.html`.

The hierarchy-tree drawer, display drawer, scrim, and delete dialog also stayed as top-level siblings of the page shell while the generated route marked the body as a canonical hierarchy-tree surface. The shared drawer CSS therefore used viewport/page-level positioning instead of positioning relative to the hierarchy-tree preview shell.

The paired display drawer then exposed a second containment bug: a later, more specific `#hierarchy-tree-display-drawer.side-panel-secondary` rule kept the app-shell rail offset, so HTR-020 showed a gap between the hierarchy drawer and display drawer inside the canonical preview shell.

The mobile generated states also depended on the outer browser viewport rather than the canonical review width. Opening HTR-021, HTR-022, or HTR-023 in a desktop browser therefore kept desktop drawer behavior even though the canonical state declares `width=390`.

The dark generated state applied `data-theme="dark"` to the root document, so HTR-026 changed the outer design-system chrome and metadata instead of scoping dark treatment to the rendered hierarchy-tree specimen.

The magnified generated state applied `--ui-scale` to the root document, so HTR-027 enlarged the outer shell, top nav, breadcrumb, and search row instead of only the rendered hierarchy-tree specimen. The same outer-shell pressure made the breadcrumb look unlike the signed-off sub-nav behavior.

## Why It Escaped

- Existing hierarchy-tree tests proved generated route loading, mobile menu content, RTL geometry, dark readability, and long-title behavior.
- The route registry signature accepted the broad tree element, which existed on both the reference page and the render page, so it did not distinguish the approved render template.
- The generated-route visual test did not assert that render-page-only chrome was present or that reference-page copy was absent.
- The tests did not assert overlay containment against the actual generated-route preview shell.
- The existing containment helper was used by other drawer families, but hierarchy-tree had not yet adopted that guard.

## Reconciliation Changes

- The `hierarchy-tree` generated-route registry now resolves to `patterns/hierarchy-tree/render/index.html` and uses a render-page-only signature.
- Routing and visual tests now assert that generated hierarchy-tree render URLs use the canonical render template and do not serve reference-page copy.
- Canonical hierarchy-tree surfaces now move the hierarchy drawer, display drawer, scrim, and delete dialog into `.hierarchy-tree-preview-shell` at mount time.
- Canonical hierarchy-tree CSS now scopes those overlay surfaces to the preview shell.
- The hierarchy-tree Playwright spec now includes a rendered containment guard for `HTR-022` using the shared canonical overlay helper.
- HTR-020 now has a browser geometry guard proving the display drawer's leading edge touches the hierarchy drawer's trailing edge inside the preview shell.
- HTR-021 now has a desktop-browser proof that `width=390` forces mobile drawer posture, hides desktop resize/inline actions, and constrains the drawer to the mobile preview shell.
- HTR-026 now scopes dark theme to the hierarchy-tree preview shell and asserts the outer top nav stays on the normal page theme.
- HTR-027 now scopes magnification to the hierarchy-tree preview shell and asserts the outer top nav, breadcrumb, and search row stay governed by the normal shell scale.

## Coverage Lesson

Every generated drawer-like canonical needs a geometry assertion that proves the drawer is contained by its render/preview surface, not merely visible with the right content. Generated render route tests also need a render-template identity assertion that cannot pass on a launcher or reference page.

## Watch Items

- Future hierarchy-tree destructive dialog proof should also assert the delete dialog remains contained when `HTR-023` or `HTR-014` is promoted into executable coverage.
- If the hierarchy-tree generated route is later migrated onto the generic canonical-render frame, keep the containment target explicit rather than relying on body-level drawer CSS.
