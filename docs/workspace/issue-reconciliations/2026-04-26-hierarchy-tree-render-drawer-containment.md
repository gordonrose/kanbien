# Hierarchy Tree Render Drawer Containment Reconciliation

## Summary

Hierarchy-tree generated render pages showed the hierarchy drawer over the whole design-system page instead of contained inside the canonical preview area. The defect matched earlier drawer containment issues from other canonical families.

## Root Cause

The hierarchy-tree drawer, display drawer, scrim, and delete dialog stayed as top-level siblings of the page shell while the generated route marked the body as a canonical hierarchy-tree surface. The shared drawer CSS therefore used viewport/page-level positioning instead of positioning relative to the hierarchy-tree preview shell.

## Why It Escaped

- Existing hierarchy-tree tests proved generated route loading, mobile menu content, RTL geometry, dark readability, and long-title behavior.
- The tests did not assert overlay containment against the actual generated-route preview shell.
- The existing containment helper was used by other drawer families, but hierarchy-tree had not yet adopted that guard.

## Reconciliation Changes

- Canonical hierarchy-tree surfaces now move the hierarchy drawer, display drawer, scrim, and delete dialog into `.hierarchy-tree-preview-shell` at mount time.
- Canonical hierarchy-tree CSS now scopes those overlay surfaces to the preview shell.
- The hierarchy-tree Playwright spec now includes a rendered containment guard for `HTR-022` using the shared canonical overlay helper.

## Coverage Lesson

Every generated drawer-like canonical needs a geometry assertion that proves the drawer is contained by its render/preview surface, not merely visible with the right content.

## Watch Items

- Future hierarchy-tree destructive dialog proof should also assert the delete dialog remains contained when `HTR-023` or `HTR-014` is promoted into executable coverage.
- If the hierarchy-tree generated route is later migrated onto the generic canonical-render frame, keep the containment target explicit rather than relying on body-level drawer CSS.
