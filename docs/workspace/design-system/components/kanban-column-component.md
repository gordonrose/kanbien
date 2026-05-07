# Kanban Column Component Seam

## Scope

- Component name:
  `KanbanColumn`
- Status:
  signed-off shared render/controller seam; not yet app-adoptable
- Owner:
  Codex with user sign-off
- Source pattern artifact:
  `docs/workspace/design-system/patterns/kanban-column-pattern.md`
- Current design-system surface:
  `/design-system/patterns/kanban-column`
  `/design-system/canonical-renderings/kanban-column`
  `/design-system/canonical-renderings/kanban-column/:ref`
- Shared source seam:
  `src/frontend/designSystem/assets/kanbanColumnSeam.mjs`

## Purpose

- What reusable job does this seam perform?
  Render and govern a Trello-like board with visible-column management,
  recoverable column archive behavior, spatial column creation, inline card
  creation, and accessible card movement.
- Why is a shared implementation justified?
  The interaction spans column management, drag/drop, add flows, archive
  recovery, display strain, and non-drag movement. Keeping those behaviors in a
  design-system-owned seam reduces drift for future board-style consumers.

## Public API Candidate

- Inputs / props / attributes:
  column records, card records, visible column values, archived column values,
  card status field, card title/copy/tags, board strain configuration
- Current exports:
  `renderKanbanBoardSurface(...)`, `renderKanbanBoardItems(...)`,
  `renderKanbanColumn(...)`, `renderKanbanColumnCard(...)`,
  `renderKanbanDrawerCanonical(...)`, `renderKanbanArchivedColumnList(...)`,
  `createKanbanColumnController(...)`, and demo-data clone helpers
- Required inputs:
  column identity and label, card identity and status, card title
- Optional inputs:
  column description, card copy, card tags, archived-card count copy, empty-lane
  copy, archive-callout copy
- Supported variants:
  baseline desktop, mobile horizontal scrolling lanes, create-column mode, draft column,
  draft card, archived column drawer state, dense cards, long copy, dark theme,
  RTL
- Unsupported variants:
  swimlane grouping, WIP limits, server persistence, multi-select cards,
  destructive hard-delete, bulk card operations, app-specific workflow statuses
- Composition slots or extension points:
  future consumers may provide card body content, but movement, add, archive,
  and drawer-selection semantics should remain seam-owned unless explicitly
  extended.

## Behavior

- Default behavior:
  render the current visible columns and cards in board order
- Column visibility:
  reuse the drawer-select seam for visible-column selection
- Column creation:
  use a board-level create toggle that reveals insertion rails between columns;
  rail plus buttons create draft columns in place
- Card creation:
  use a subtle bottom add-card affordance in each visible column; activation
  creates a draft card in that column
- Column removal:
  archive columns by default and make them restorable from the drawer
- Card movement:
  support desktop drag/drop plus explicit left/right movement controls
- Loading / error / denied behavior:
  not yet modeled at the component seam

## Token Dependencies

- Token candidacy review outcome:
  not yet created
- Required semantic tokens:
  existing base tokens only:
  `--surface-1`, `--surface-2`, `--paper`, `--line`, `--line-strong`,
  `--ink`, `--ink-soft`, `--accent`, `--accent-soft`, `--accent-text`,
  `--error-ink`, `--radius`, `--radius-sm`
- Tokens that must not be bypassed:
  shared surface, border, text, accent, radius, and focus/hover tokens
- Theming or state considerations:
  count badges need explicit high-contrast dark-mode treatment until a broader
  badge token covers the state.

## Accessibility Contract

- Semantics:
  columns are sections; cards are draggable articles with button fallback
  controls; add/remove/restore controls are real buttons
- Keyboard interaction:
  card movement must remain available without drag; draft forms must support
  submit and Escape cancel
- Focus behavior:
  adding a column focuses the column-name input; adding a card focuses the
  card-title input
- Announcements / labels:
  live-region updates announce create, move, archive, restore, and cancel
  actions; add buttons include destination-specific accessible labels
- Known constraints:
  full keyboard drag/drop reordering beyond left/right movement is not modeled
  yet.

## Performance And Rendering

- Rendering expectations:
  board re-rendering is acceptable for the design-system proof; future app
  consumers should preserve stable identity and avoid unnecessary full-board
  churn when persistence is introduced
- Motion constraints:
  no decorative motion required; drag feedback must remain immediate and clear
- Large-content or overflow considerations:
  long titles and copy must remain readable under the long-copy strain state;
  mobile must keep columns side by side with horizontal board scrolling

## Adoption And Migration

- First consumers:
  none yet
- Existing local implementations to replace:
  none in real app surfaces yet
- Migration risks:
  copying the pattern markup and controller into an app page instead of
  consuming `kanbanColumnSeam.mjs` would violate governed adoption rules
- Compatibility notes:
  real consumers need a persistence and business-rule integration design before
  this becomes a product board component.

## Verification

- Current frontend tests:
  `tests/visual/designSystem/patterns/kanbanColumn.spec.ts`
- Visual checks:
  baseline board, display drawer strain, visible-column drawer, insertion-line
  column creation, add-card draft flow, archive/restore drawer spacing, archive
  callout, hidden-column preservation, restored-column outcome, drag/drop
  landing marker, non-drag movement result, mobile horizontal scroll, RTL,
  magnification, and accent/long-copy strain
- Responsive checks:
  desktop horizontal board and mobile horizontal-scrolling board
- Accessibility checks:
  focus on draft inputs, role-based add/restore controls, non-drag movement
  controls, live-region announcements

## Adoption And Extraction Readiness

- Component artifact promotion reason:
  the user has signed off the pattern interaction and asked to lock it as a
  design-system component seam
- What still remains before shared code extraction?
  shared code extraction is complete for the design-system route and canonical
  route; token candidacy review, a named first consumer, and product data/API
  integration boundaries remain before app adoption
- What is explicitly not blocked?
  documenting the signed-off behavior, preserving the current pattern route,
  using this seam as the source of truth for future canonical work, and writing
  the first-consumer adoption packet when a consuming app surface is named

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/components/kanban-column-component.md`
- Design-system route update required:
  complete:
  `/design-system/canonical-renderings/kanban-column`
  `/design-system/canonical-renderings/kanban-column/:ref`
- Frontend docs update required:
  complete for the shared source seam; refresh again when a real consumer is
  named
- Architecture-map update required:
  not yet
