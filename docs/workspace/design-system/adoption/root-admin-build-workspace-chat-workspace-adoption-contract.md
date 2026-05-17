# Root Admin Build Workspace Chat Workspace Adoption Contract

- Date: 2026-05-17
- Family: `chat-workspace-shell`
- Consumer route: `/root-admin/build/workspace`
- Consumer source:
  `src/frontend/rootAdminShell/routes/build/workspace/page.mjs`
- Status: mocked in-app proof consumer, not production app-adoption signoff

## Purpose

Create a real root-admin route that proves the chat workspace seam can replace
the root-admin Build chat component through the existing conversation-panel
slot without copying shell markup, controller logic, ARIA behavior, or page CSS
into the app.

This route is intentionally a proof consumer. It does not introduce durable
Build workspace product behavior, new backend contracts, new permissions, or
new persistence.

## Shared Seams Consumed

- `src/frontend/designSystem/assets/chatWorkspaceMockConsumer.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceShellContract.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceBootstrap.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceShell.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceController.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceConversationIndex.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceEntityHost.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceEntitySelector.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceRowDrawer.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceSecondaryHeader.mjs`
- `src/frontend/designSystem/assets/chatWorkspacePattern.css`

## Consumer Rules

- The root-admin route module mounts the shared mock consumer controller.
- The route mounts into `root-admin-conversation-panel-mount`, not into the
  page body, so it proves the chat workspace as the in-app chat replacement.
- The route module must not recreate `.chat-workspace-shell` markup locally.
- The route module must not call `createChatWorkspaceBootstrap` directly.
- The route module must not add root-admin-local CSS.
- The mocked proof starts as a new chat, so packet/download UI must be hidden.
- The shell mirrors root display theme onto the chat workspace theme scope.
- The route remains representative until a product/API contract defines a real
  Build workspace.

## Evidence

- Unit guard:
  `tests/unit/designSystem/chatWorkspaceShellExtraction.test.ts`
- Browser proof:
  `tests/visual/app/rootAdminShell/rootAdminBuildBacklog.spec.ts`
- Topology and metadata coverage:
  `tests/unit/rootAdminShell/routeTopology.test.ts`
  and `tests/unit/rootAdminShell/pageMetadata.test.ts`

## Boundary

This contract satisfies the mocked in-app consumer step named by
`chat-workspace-shell-extraction-contract.md`. It does not supersede
`chat-workspace-shell-consumer-adoption-contract.md`, and it does not approve
production root-admin workspace behavior.
