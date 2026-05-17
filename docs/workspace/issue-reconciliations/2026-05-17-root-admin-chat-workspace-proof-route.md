# Root Admin Chat Workspace Proof Route Reconciliation

- Date: 2026-05-17
- Surface: `/root-admin/build/workspace`
- Status: fixed with focused browser regression coverage

## User-Visible Symptom

The first root-admin chat workspace proof route rendered as a floating page
body instead of replacing the existing Build chat component. It also failed to
fill the available page height, showed the Product Discovery packet download
banner for a new chat, and did not apply dark theme styling like the signed-off
canonical rendering.

A follow-up defect appeared after that correction: clicking the cube action in
the right tool rail either hid too much of the reusable rail or left the large
workspace panel visible as an empty canvas. The intended closed state is a
collapsed proof route that keeps only the cube action rail available.

## Root Cause

The route mounted `chatWorkspaceMockConsumer.mjs` into the root-admin page
section rather than the existing `root-admin-conversation-panel-mount` slot.
That bypassed the full-height conversation-panel host rules already defined in
the design-system CSS.

The proof state also used the mock consumer's default canonical ref, which
kept packet-ready state available, and it did not synchronize
`data-theme-scope` from the root display theme onto the chat workspace shell.

The cube defect was caused by shared chat workspace CSS treating
`panelOpen=false` as either a request to collapse the whole chat workspace
shell to zero width or, in the first correction, a request to hide only the
embedded chat while leaving the surrounding workspace panel visible. For the
root-admin proof route, that state should collapse the large panel to the
right-side cube action rail.

## Why The Feature Loop Missed It

The first browser test asserted route, attachment, and expansion state, but it
did not assert the human-visible contract:

- the shell must live in the existing chat-panel mount rather than the page
  body
- the shell must span the available fixed panel height
- new chat state must not render packet/download UI
- dark theme must affect the chat workspace shell and list surfaces

That was a browser-geometry and theme-propagation gap, not a unit-contract gap.

## Architectural-First Decision

Use the existing design-system-owned conversation-panel slot as the host for
the proof route. The root-admin route remains a thin consumer of the shared
chat workspace mock harness and does not add app-local CSS, shell markup, or
chat workspace controller behavior.

## Reconciliation Changes

- `src/frontend/rootAdminShell/routes/build/workspace/page.mjs`
  now mounts the shared mock consumer into `root-admin-conversation-panel-mount`
  when `/root-admin/build/workspace` is active.
- The proof route starts expanded, uses a new-chat message, suppresses packet
  state, and mirrors root display theme into the shell's `data-theme-scope`.
- `src/frontend/rootAdminShell/assets/app.mjs` skips the ordinary Build
  conversation panel while the chat workspace proof route owns that slot.
- `tests/visual/app/rootAdminShell/rootAdminBuildBacklog.spec.ts` now asserts
  panel-slot replacement, full-height/right-edge geometry, no packet banner,
  dark theme propagation, and cube-action behavior where the large panel
  collapses to the right-side cube action rail.
- `src/frontend/designSystem/assets/chatWorkspacePattern.css` now keeps the
  shared action rail visible when the embedded conversation panel is closed,
  while hiding the workspace body, headers, and layer switcher.

## Follow-Up Watch Items

This route remains a mocked in-app proof consumer. Production Build workspace
behavior still needs a product/API contract and real-data browser coverage
before replacing the mock harness.
