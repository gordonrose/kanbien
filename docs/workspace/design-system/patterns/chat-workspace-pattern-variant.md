# Chat Workspace Pattern Variant

Status: provisional demo rendering for review

## Trigger

The expanded chat interface needs a design-system proving ground before any
real app route or logic is added. The requested shape keeps the current chat
widget in its normal right-docked posture and expands a workspace beside it
for build artifacts.

## Intent

Provide a chat-workspace variant where conversation remains the active
collaboration lane. The default view is the normal right-docked chat widget;
expanding it opens the workspace/list panel to the left while the chat remains
anchored on the right.

## Anatomy

- right chat pane: consumes the signed-off Build Work Panel chat renderer and
  preserves its conversation history, packet status, page-action rail, tools,
  composer, and panel controls inside the expanded workspace posture
- workspace toggle: reuses the Build Work Panel header action treatment to
  expand or collapse the workspace from inside the chat widget, shown as an
  icon-button `project` control with tooltip text
- secondary header: uses one shared header row across the available panels.
  In collapsed chat-only posture it shows the active chat name and the
  workspace controls; when the conversation index is open it spans the index
  and chat columns; when the workspace is fully expanded it spans the
  conversation index, list panel, and chat panel
- layer selector: appears in the secondary header over the index/list side in
  expanded workspace posture and selects Discovery, Design, and Delivery
- chat selector: the chat-name card in the secondary header opens the
  conversation index drawer on the left side of the chat screen; the drawer
  stays open until closed with its X control
- workspace focus navigation: repurposes the signed-off Build Work Panel
  page-action toolbar on the left of the workspace for layer-specific focus
  choices without changing toolbar styling
- chat action navigation: preserves the original Build Work Panel page-action
  rail inside the chat pane as a single Build action for opening and closing
  chat
- conversation history: docks to the left of the list panel in expanded mode
  and to the left of chat in index-only mode, so the expanded order is
  workspace toolbar, chat history, list panel, then chat interface; the
  history close control is an icon-button `index` control with tooltip text
- workspace tab header: consumes the signed-off `floating-tab-header` seam;
  its visible tab cards represent the status set for the active entity; the
  trailing category/filter button is hidden in this pattern so the status
  cards get the full rail width
- list header section: when the workspace is fully expanded, the secondary
  header includes a list-panel section that hosts the active entity selector
  and record count above the floating status bar
- entity selector dropdown: opens under the secondary-header entity trigger
  and lists the layer-specific build entities, replacing the earlier
  right-side drawer; each option shows the total entity count represented by
  that entity's displayed status-card counts
- row list: uses the `floating-tab-header` list panel row anatomy for the
  active entity and status, without the vertical status marker in this pattern
- status drag/drop: rows inside the `floating-tab-header` list can be dragged
  with the established list/kanban drag affordance and dropped on another
  status tab to move the row to that status and update the visible counts; the
  target status card shows a subtle drop overlay while it is eligible
- row reorder drag/drop: dragging a row over another row uses the shared list
  reorder marker and keeps the row inside the same status when dropped
- list detail drawer: selecting a row opens a scoped, full-height drawer inside
  the list panel; the row list keeps one third of the list-panel width while
  the drawer takes the remaining two thirds

## Header Layer Selector

- Discovery
- Design
- Delivery

## Toolbar Focus Map

- Discovery: Conversations, Questions
- Design: Conversations, Architecture Questions, Design Questions
- Delivery: Product Discovery Package, Epics, Stories, Tasks

## Entity Map

- Discovery: Product Discovery Package, Chat Session, Questions
- Design: Architecture Questions, Design Questions
- Delivery: Product Discovery Package, Epics, Stories, Tasks

## Layer Defaults

- Discovery opens conversation history and selects Questions in the floating
  tab entity switcher.
- Design opens Product Discovery as the first history item and selects
  Architecture Questions in the floating tab entity switcher.
- Delivery opens Epics as the first history item and selects Stories in the
  floating tab entity switcher.

## Status Map

- Product Discovery Package: Draft, In Refinement, Ready for Review, Done
- Chat Session: In Progress, Paused, Complete, Archived
- Questions, Architecture Questions, and Design Questions: Queued,
  In Progress, Paused, Blocked, Answered, Deferred, Archived
- Epics: Draft, Steering, Blocked, In Refinement, Ready for Delivery,
  In Delivery, Ready for Review, Ready for Deploy, Deployed
- Stories: Draft, Blocked, In Refinement, Ready for Review, Task Breakdown,
  Ready for Delivery, Ready for Deploy, Deployed
- Tasks: Draft, Blocked, In Refinement, Ready for Review, Ready for Delivery,
  Ready for Deploy, Deployed

## Boundaries

- This variant is demo-only and not app-consumable.
- Collapsed chat-only is the default posture; the chat is right-docked in that
  state.
- Expansion opens the workspace/list panel to the left of the right-docked
  chat, then refreshes the floating tab header measurements after the layout
  transition so tab density is based on the actual expanded width.
- Hiding conversation history keeps the chat interface width stable and gives
  the recovered width to the list panel.
- Opening a list detail drawer is scoped to the active list panel, fills the
  available list-panel height below the floating tabs, and does not change the
  chat width or global workspace columns.
- Workspace data loading, persistence, permissions, row actions, empty states,
  and error states are intentionally deferred.
- A behavior lock, reference pack, canonical renderings, and adoption contract
  are still required before real-app use.
- The shared `floating-tab-header` render/controller seam now supports scoped
  instance IDs so this pattern can reuse it for both layer and entity
  navigation without duplicate IDs.
- The shared `floating-tab-header` card treatment is measured by rendered fit:
  roomy cards are used when they fit, compact cards are used when the rail is
  tighter, and paging appears only when compact cards still need more room.

## Cross-Cutting Notes

- RTL: the demo supports scoped `dir=rtl` rendering through URL state.
- Theme: the demo supports a scoped dark rendering through URL state.
- Magnification: the demo supports scoped scale testing through URL state.
- Accessibility: layer and entity controls use tab semantics and visible focus;
  row content remains list-based for now.
