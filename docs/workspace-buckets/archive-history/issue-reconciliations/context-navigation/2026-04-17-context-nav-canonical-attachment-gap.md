# Context-Nav Canonical Attachment Gap

## Supersession Note

Archived on 2026-05-27 after the QA and issue-reconciliation freshness pass.
The context-nav attachment lesson is now represented by current context-nav
reference packs, verification checklists, and visual coverage. Treat this
record as historical escaped defect evidence, not current operating authority.

## Summary

After the magnification offset fix, the desktop context-nav drawer canonicals
still showed a thin visible gap between the rendered header edge and the top of
the rail/drawer.

The intended contract is flush attachment:

- when the sub-nav is present, the rail and drawer start exactly at its bottom
- when the sub-nav scrolls away, they reattach exactly to the sticky top-nav

## Root Cause

The canonical preview styles still added a hardcoded border compensation:

- `+ 0.0625rem` on the preview rail top
- `+ 0.0625rem` on the preview drawer top

That extra pixel-scale offset was originally helpful while debugging overlap,
but once the preview shell owned the attachment geometry correctly it became a
visible spacer instead of a guard.

## Why The Loop Missed It

The tests only proved:

- the drawer stayed below the rendered header edge
- the drawer was close to the rendered sub-nav bottom

They did not yet prove flush equality.

Classification:

- stale regression tolerance after an earlier geometry fix
- missing exact-edge assertion for the final attachment contract

## Reconciliation Changes

- removed the preview-only `+ 0.0625rem` top offset from the canonical rail
  and drawer
- tightened the desktop canonical checks so they now assert flush attachment
  within one pixel in both:
  - `CDR-001`
  - `CDR-005`

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts -g "CDR-001 desktop drawer stays below the rendered sub-nav after host-page scroll|CDR-005 dark theme with magnification" --workers=1`

Live geometry after the fix:

- rendered sub-nav bottom: `834.96875`
- rendered rail top: `834.96875`
- rendered drawer top: `834.96875`

## Resolution Status

- candidate fix awaiting user confirmation
