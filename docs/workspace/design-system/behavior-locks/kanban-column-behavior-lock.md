# Kanban Column Behavior Lock

## Purpose

Lock the signed-off behavior for the `KanbanColumn` design-system seam before
treating it as canonical-ready or app-adoptable.

This artifact governs the board, column, card, add, archive, and movement
behavior proven on the design-system pattern route. The visible-column selector
inherits its drawer behavior from:

- `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md`

## Review Status Legend

- `approved`:
  behavior should be preserved in reference packs, canonicals, and consumers
- `rejected`:
  behavior should not be treated as target behavior
- `undecided`:
  behavior still needs iteration before being locked

## Scope

- Family:
  `kanban-column`
- Current source surface:
  `/design-system/patterns/kanban-column`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/kanban-column-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/kanban-column-component.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/kanban-column-reference-pack.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `KCBL-001` | The board presents horizontal lanes on desktop and mobile, with mobile using horizontal board scrolling rather than stacked columns. | Preserves the kanban scan model consistently across widths and keeps lane comparison available on small screens. | Desktop and mobile both use a horizontal flex board; mobile narrows each column and relies on horizontal overflow. | `approved` | Mobile columns should scroll horizontally, not stack vertically. |
| `KCBL-002` | Visible columns are managed through the existing searchable drawer-select seam. | Reuses a signed-off picker instead of creating a competing local column visibility control. | The column manager consumes `formControls.mjs` drawer-select rendering and refresh behavior. | `approved` | Reuse the simple drawer-select approach. |
| `KCBL-003` | The board-level add-column button activates explicit insertion lines with plus buttons between visible columns. | Makes placement obvious without crowding the drawer tray or relying on vague hover zones. | Create mode reveals between-column rails; each rail uses an SVG plus glyph in a fixed centered icon container. | `approved` | The line-between-columns approach is the preferred UX. |
| `KCBL-004` | Clicking an insertion-line plus creates a draft column in that exact position and focuses the inline column-name field. | Keeps creation spatial, fast, and reversible. | Draft columns render in place with Save and Cancel controls. | `approved` | Inline naming after placement is the target behavior. |
| `KCBL-005` | Each visible column exposes a subtle bottom `Add card` control. | Keeps card creation local to the destination lane without adding toolbar clutter. | The add-card control sits at the bottom of the card stack and uses the same centered SVG plus-glyph approach as other icon buttons. | `approved` | Keep this subtle bottom-of-column affordance. |
| `KCBL-006` | Adding a card creates an inline draft card in the selected column and focuses its title field. | Matches the reversible draft posture used for columns and avoids modal interruption. | Draft cards render inside the lane with Add and Cancel controls. | `approved` | Inline card creation is preferred. |
| `KCBL-007` | Removing a column archives it instead of deleting it. | Protects cards and makes destructive-looking column removal recoverable. | Removed columns leave the visible set, keep their cards, and appear under Archived columns in the drawer. | `approved` | Deleted columns should be archived and restorable. |
| `KCBL-008` | Archived columns appear below the active drawer-select catalog and remain restorable with their card count. | Makes recovery discoverable while preserving active/available column separation. | The archived drawer section is separated from the active catalog and includes Restore actions. | `approved` | Archived drawer layout must not overlap or appear broken. |
| `KCBL-009` | The first archive action shows a board callout pointing users back to the column drawer with a `Don't show again` option. | Explains the archive model at the moment of risk without permanently adding noise. | The callout uses local storage to honor dismissal. | `approved` | Keep the explanatory callout with dismissal. |
| `KCBL-010` | Desktop cards can move by drag-and-drop with a visible source state and landing marker. | Preserves direct manipulation and makes the drop destination obvious. | Dragging uses a custom drag image, quieter source opacity, active-column emphasis, and a drop marker. | `approved` | Card should follow the cursor and show where it will land. |
| `KCBL-011` | Every card also exposes move-left and move-right controls. | Keeps movement available without drag and supports keyboard/button-based fallback. | Cards render left/right movement buttons based on visible-column position. | `approved` | Non-drag movement remains required. |
| `KCBL-012` | Hidden and archived columns do not delete their cards. | Preserves data continuity and makes visibility/archive actions reversible. | Cards reappear when their column becomes visible or restored. | `approved` | Cards survive column visibility and archive changes. |
| `KCBL-013` | Count badges must retain readable contrast in dark and strained display states. | Prevents status counts from becoming decorative or unreadable. | Dark theme explicitly uses a high-contrast badge treatment. | `approved` | Count contrast needed correction and is locked. |
| `KCBL-014` | The pattern must remain strain-reviewable through display settings for theme, magnification, accent, direction, dense cards, and long copy. | Keeps the seam honest under the same stressors used elsewhere in the design system. | The route includes the display settings drawer and board strain controls. | `approved` | Keep strained circumstances available on the pattern page. |

## Exit Criteria For This Step

This behavior lock is complete for the signed-off pattern seam when:

- `KCBL-*` rules are reflected in the reference pack
- the verification checklist includes rendered checks for the previously escaped
  plus-centering and archived-drawer defects
- dedicated canonical launcher and render states are created before any
  app-adoption claim
