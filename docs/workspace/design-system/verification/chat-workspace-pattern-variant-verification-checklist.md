# Chat Workspace Pattern Variant Verification Checklist

Status: provisional demo evidence

## Required For This Demo Pass

- Render `/design-system/patterns/chat-workspace`.
- Verify the pattern starts in collapsed chat-only posture with the chat
  right-docked.
- Verify the chat widget exposes an expand/collapse control using the existing
  Build Work Panel header action treatment.
- Verify expansion uses a short transition and opens the workspace/list panel
  to the left of the right-docked chat on desktop width.
- Verify the expanded state uses one joint header bar across workspace and
  chat, with collapse, history, and close controls in that shared header.
- Verify the workspace restores the left-side Discovery, Design, and Delivery
  toolbar while the original chat toolbar remains inside the chat pane.
- Verify workspace floating tabs measure from the expanded layout width rather
  than the collapsed hidden width.
- Verify collapse hides the workspace from interaction and returns to the
  right-docked chat-only posture.
- Verify the chat pane preserves the signed-off Build Work Panel anatomy:
  conversation history, page-action rail, chat tools, packet status, composer,
  and panel controls remain visible instead of being locally hidden.
- Verify Discovery, Design, and Delivery are selected through the signed-off
  Build Work Panel page-action toolbar, with no separate vertical layer rail.
- Verify each layer switches the workspace `floating-tab-header` category
  drawer to the requested entity set.
- Verify the active workspace `floating-tab-header` renders the status cards
  for the active entity and keeps later statuses reachable through shared
  paging when measured space requires it.
- Verify the shared floating-tab card density is rendered-fit based: roomy
  cards fit when space allows, compact cards appear in tighter rails, and the
  rail has no horizontal overflow.
- Verify the active entity renders row-based content through the
  `floating-tab-header` list panel below the tab zone.
- Smoke-check mobile stacking so chat and workspace remain reachable.
- Smoke-check scoped dark, RTL, and magnified rendering without horizontal page
  overflow.
- Run the existing floating-tab-header canonical suite after seam changes.

## Not Yet Claimed

- Canonical rendering coverage.
- Behavior-lock signoff.
- App adoption readiness.
- Real data, row actions, loading, empty, error, or denied states.
