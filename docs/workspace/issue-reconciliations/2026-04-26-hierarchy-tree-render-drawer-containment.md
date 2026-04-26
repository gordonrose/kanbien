# Hierarchy Tree Render Drawer Containment Reconciliation

## Summary

Hierarchy-tree generated render pages showed the hierarchy drawer over the whole design-system page instead of contained inside the canonical preview area. The defect matched earlier drawer containment issues from other canonical families.

## Root Cause

The generated canonical-render route registry mapped the `hierarchy-tree` family to `patterns/hierarchy-tree/index.html`, which is the reference/launcher page. That allowed the generated render URL to serve reference-surface copy such as "Review This Pattern" instead of the dedicated render template under `patterns/hierarchy-tree/render/index.html`.

The hierarchy-tree drawer, display drawer, scrim, and delete dialog also stayed as top-level siblings of the page shell while the generated route marked the body as a canonical hierarchy-tree surface. The shared drawer CSS therefore used viewport/page-level positioning instead of positioning relative to the hierarchy-tree preview shell.

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

## Coverage Lesson

Every generated drawer-like canonical needs a geometry assertion that proves the drawer is contained by its render/preview surface, not merely visible with the right content. Generated render route tests also need a render-template identity assertion that cannot pass on a launcher or reference page.

## Watch Items

- Future hierarchy-tree destructive dialog proof should also assert the delete dialog remains contained when `HTR-023` or `HTR-014` is promoted into executable coverage.
- If the hierarchy-tree generated route is later migrated onto the generic canonical-render frame, keep the containment target explicit rather than relying on body-level drawer CSS.
