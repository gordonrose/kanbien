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
  expand or collapse the workspace from inside the chat widget
- joint header: expands the Build Work Panel header treatment across the
  workspace and chat columns while preserving collapse, history, and close
  controls as one shared header bar
- workspace layer navigation: repurposes the signed-off Build Work Panel
  page-action toolbar on the left of the workspace for Discovery, Design, and
  Delivery without changing toolbar styling
- chat layer navigation: preserves the original Build Work Panel page-action
  toolbar inside the chat pane
- workspace tab header: consumes the signed-off `floating-tab-header` seam;
  its category drawer switches the layer-specific build entity, and its visible
  tab cards represent the status set for the active entity
- row list: uses the `floating-tab-header` list panel row anatomy for the
  active entity and status

## Entity Map

- Discovery: Product Discovery Package, Chat Session, Questions
- Design: Architecture Questions, Design Questions
- Delivery: Epics, Stories, Tasks

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
