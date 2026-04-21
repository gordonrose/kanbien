## Summary

The root-admin hierarchy tree drawer stayed open when the user clicked outside it or pressed Escape.

## Root Cause

The shared hierarchy-tree mount in `src/frontend/designSystem/assets/hierarchyTree.mjs` only wired the explicit close button and the mobile scrim. It did not implement the normal dismiss contract for a governed drawer on desktop: outside click and Escape.

## Why The Loop Missed It

The hierarchy suite covered launcher open state, explicit close-button behavior, resize behavior, and shell placement, but it did not include a dismissal regression for outside click or keyboard Escape.

## Reconciliation Changes Added

- added shared drawer dismissal rules to the hierarchy-tree seam for outside click and Escape
- returned focus to the launcher on keyboard or explicit close dismissal
- added an app-level hierarchy regression that requires the drawer to close on outside click and Escape

## Coverage Lesson

Governed drawer verification has to cover the full dismissal contract, not just “it opens” and “the close button works.” Escape and outside click are part of the same behavioral promise.

## Follow-Up Watch Items

- when the design-system route adopts this same shared mount path, mirror the same dismissal regression at the design-system canonical layer too
