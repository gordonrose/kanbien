# Chat Workspace Shell Extraction Contract

- Date: 2026-05-17
- Family: `chat-workspace-shell`
- Status: extraction contract

## Source Boundary

The provisional pattern may host representative data and demo callbacks, but
shared shell behavior belongs in design-system-owned modules.

Current shared seams:

- `src/frontend/designSystem/assets/chatWorkspaceShellContract.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceShell.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceBootstrap.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceController.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceConversationIndex.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceEntityHost.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceEntitySelector.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceRowDrawer.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceSecondaryHeader.mjs`

## Adoption Boundary

Consumer adoption is governed by
`chat-workspace-shell-consumer-adoption-contract.md`.

The pattern and canonical surfaces may prove the seam, but app routes must not
copy the shell structure or controller behavior from the pattern.

## Verification

The extraction is checked by unit and audit tests that assert:

- the pattern delegates through `createChatWorkspaceBootstrap`
- shell expansion/history behavior lives in `chatWorkspaceShell.mjs`
- resolver behavior is gated by the scoped shell contract
- root-admin mock adoption consumes the shared mock consumer harness
