# Chat Workspace Pattern Variant Verification Checklist

Status: provisional demo evidence

## Required For This Demo Pass

- Render `/design-system/patterns/chat-workspace`.
- Verify the pattern starts in collapsed chat-only posture with the chat
  right-docked.
- Verify the chat widget exposes an expand/collapse control using the existing
  icon-button format with the `project` icon and tooltip text.
- Verify expansion uses a short transition and opens the workspace/list panel
  to the left of the right-docked chat on desktop width.
- Verify the collapsed chat-only state uses one secondary header with the chat
  name and workspace controls, without rendering the conversation index.
- Verify selecting the chat-name card opens the conversation index drawer on
  the left side of the chat screen.
- Verify the conversation index drawer stays open by default and closes only
  through its X control or the explicit history close action.
- Verify the expanded state uses one secondary header across conversation
  index, list panel, and chat panel.
- Verify the secondary header uses icon buttons for collapse/expand and
  history close: `project` for the workspace toggle and `index` for the
  history control.
- Verify the secondary header layer selector selects Discovery, Design, and
  Delivery.
- Verify the secondary header list section appears only when the list panel is
  visible and contains the active entity selector and record count above the
  floating status bar.
- Verify the left workspace toolbar renders layer-specific focus actions:
  Discovery has Conversations and Questions; Design has Conversations,
  Architecture Questions, and Design Questions; Delivery has Product Discovery
  Package, Epics, Stories, and Tasks.
- Verify selecting a toolbar focus action updates the active list entity when
  the action represents a build entity, and keeps conversation history open
  when the action is Conversations.
- Verify the original chat rail remains inside the chat pane as a single Build
  action.
- Verify expanded column order is workspace toolbar, conversation history, list
  panel, then chat interface.
- Verify hiding history keeps the chat interface width stable and lets the
  list panel take the extra width.
- Verify workspace floating tabs measure from the expanded layout width rather
  than the collapsed hidden width.
- Verify collapse hides the workspace from interaction and returns to the
  right-docked chat-only posture.
- Verify the chat pane preserves the signed-off Build Work Panel anatomy:
  conversation history, page-action rail, chat tools, packet status, composer,
  and panel controls remain visible instead of being locally hidden.
- Verify Discovery, Design, and Delivery are not duplicated as workspace
  toolbar actions.
- Verify Discovery opens history and defaults the floating tab entity to
  Questions.
- Verify Design defaults the first history item to Product Discovery and the
  floating tab entity to Architecture Questions.
- Verify Delivery defaults the first history item to Epics and the floating
  tab entity to Stories.
- Verify each layer switches the workspace `floating-tab-header` category
  drawer to the requested entity set.
- Verify the active workspace `floating-tab-header` renders the status cards
  for the active entity and keeps later statuses reachable through shared
  paging when measured space requires it.
- Verify the secondary-header list section appears above the floating status
  bar, the status bar appears underneath that header section, and the row list
  starts below the status bar.
- Verify the floating status bar no longer shows the trailing category/filter
  button in the chat workspace variant.
- Verify the secondary-header entity selector opens the entity dropdown,
  and each option shows the total entity count represented by the displayed
  status-card counts.
- Verify selecting an entity changes the active floating-tab entity without
  shifting the list header, status bar, or list panel.
- Verify the entity selector dropdown closes through selection, Escape, and
  outside click.
- Verify the shared floating-tab card density is rendered-fit based: roomy
  cards fit when space allows, compact cards appear in tighter rails, and the
  rail has no horizontal overflow.
- Verify the active entity renders row-based content through the
  `floating-tab-header` list panel below the tab zone.
- Verify dragging a list row with the established drag/drop affordance onto a
  status tab moves the row to that status and updates the source and target
  status counts.
- Verify an eligible status tab shows a subtle drop overlay during row drag.
- Verify dragging a list row over another list row shows the shared reorder
  marker and reorders without changing status counts.
- Verify the row list does not render the vertical status marker in this chat
  workspace variant.
- Verify selecting a list row opens the scoped list detail drawer inside the
  list panel, with the list side taking one third of the panel width and the
  drawer taking two thirds.
- Verify the scoped list detail drawer fills the available list-panel height
  below the floating tabs rather than shrinking to its content.
- Verify closing the drawer restores the full-width list panel and switching
  status/entity/layer clears the selected-row drawer state.
- Smoke-check mobile stacking so chat and workspace remain reachable.
- Smoke-check scoped dark, RTL, and magnified rendering without horizontal page
  overflow.
- Run the existing floating-tab-header canonical suite after seam changes.

## Not Yet Claimed

- Canonical rendering coverage.
- Behavior-lock signoff.
- App adoption readiness.
- Real data, row actions, loading, empty, error, or denied states.
