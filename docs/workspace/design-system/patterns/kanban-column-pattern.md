# Kanban Column Pattern

## Purpose

Define the first review surface for a Trello-like `Kanban Column` pattern in the
design system.

This is now a signed-off design-system pattern seam. It locks the reviewed
interaction model and consumes the shared render/controller seam while any
real app adoption contract remains a future gate.

## Current Demo Surface

- Route:
  `/design-system/patterns/kanban-column`
- Status:
  signed-off pattern seam with dedicated canonical render states
- Reused governed seam:
  `drawer-select` for visible-column management
- Shared source seam:
  `src/frontend/designSystem/assets/kanbanColumnSeam.mjs`
- Related approved behavior:
  `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/hierarchy-tree-behavior-lock.md`

## Demo Rules

- The board presents horizontal kanban lanes on desktop and mobile. On mobile,
  columns remain side by side and the board scrolls horizontally.
- Visible columns are managed through the existing searchable `drawer-select`
  behavior instead of a page-local picker.
- The plus affordance beside the column-manager trigger stays available as the
  board-level create control. Activating it exposes visible insertion lines
  with plus buttons between visible columns.
- Clicking an insertion-line plus creates a draft column in that exact space
  and focuses its name field inline, so the reviewer can immediately name or
  cancel it without working inside the drawer tray.
- Each visible column exposes a subtle `Add card` control at the bottom of its
  card stack. Activating it creates an inline draft card in that column and
  focuses the card title field.
- Removing a column archives it instead of deleting it. Archived columns stay
  listed below the active drawer-select columns and can be restored with their
  cards still attached.
- After the first archive action, the board shows a small callout pointing back
  to the column drawer and includes a `Don't show again` flag for reviewers who
  understand the archive model.
- Desktop cards can move through drag-and-drop.
- Every card also exposes move-left and move-right controls so drag is not the
  only movement path.
- Mobile does not rely on drag-and-drop; card movement remains available through
  the non-drag controls.
- Hidden columns do not delete their cards. Cards reappear when the column is
  made visible again.
- The page includes the existing `Display Settings` drawer shell so reviewers
  can strain the board with theme, magnification, accent, direction, dense-card,
  and long-copy states before the behavior lock is drafted.

## Governance Notes

Created for seam lock:

- `docs/workspace/design-system/behavior-locks/kanban-column-behavior-lock.md`
- `docs/workspace/design-system/reference-packs/kanban-column-reference-pack.md`
- `docs/workspace/design-system/components/kanban-column-component.md`
- `docs/workspace/design-system/verification/kanban-column-verification-checklist.md`
- `docs/workspace/design-system/adoption/kanban-column-shared-seam-adoption-contract.md`
- `/design-system/canonical-renderings/kanban-column`
- `/design-system/canonical-renderings/kanban-column/:ref`

Before this pattern is treated as adoptable by a real app page, create or
refresh:

- an adoption contract for the first real consumer
