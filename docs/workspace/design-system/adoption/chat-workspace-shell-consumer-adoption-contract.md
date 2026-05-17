# Chat Workspace Shell Consumer Adoption Contract

- Date: 2026-05-17
- Family: `chat-workspace-shell`
- Status: draft adoption contract, not app-adoption signoff

## Contract

Expansion is disabled unless the consumer explicitly sets
`expansion: "enabled"` through the shared shell configuration seam.

The reusable scope formula is:

`Layer + Entity Category + Chat = Scoped Entity List`

The shell must not call the scoped entity resolver unless all are true:

- expansion is enabled
- a resolver function is supplied
- the scope includes `{ layer, entityCategory, chatId }`

Consumers must use the shared design-system source:

- `src/frontend/designSystem/assets/chatWorkspaceShellContract.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceBootstrap.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceShell.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceController.mjs`

Consumers must not introduce app-local copies of the canonical shell markup, CSS, or controller logic.

## Required Consumer Evidence

Before a real app route may adopt this family, the consumer must provide:

- scoped tests for resolver calls using `{ layer, entityCategory, chatId }`
- browser evidence that collapsed, expanded, history-open, and mobile states
  consume the shared shell seams
- an adoption contract naming the exact shared modules consumed
- proof that app code does not reconstruct shell markup, ARIA state, CSS, or
  interaction behavior locally

## Current Boundary

This contract permits design-system proving-ground and mocked first-consumer
preview work. It does not by itself approve production root-admin app adoption.

The current mocked in-app proof consumer is
`/root-admin/build/workspace`, governed by
`root-admin-build-workspace-chat-workspace-adoption-contract.md`.
