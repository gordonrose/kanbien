# Chat Workspace Shell Component

- Date: 2026-05-17
- Component family: `chat-workspace-shell`
- Status: draft component contract

## Purpose

The chat workspace shell defines the reusable frame for a right-docked chat
panel with an optional expanded workspace beside it.

## Shared Source

- `src/frontend/designSystem/assets/chatWorkspaceShellContract.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceShell.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceBootstrap.mjs`
- `src/frontend/designSystem/components/chat-workspace-shell.html`

## Consumer Rule

Consumer behavior is governed by
`chat-workspace-shell-consumer-adoption-contract.md`.

App consumers must use the shared render/controller seams and must not recreate
the shell locally.

## Current States

The dedicated canonical surface covers collapsed, expanded, history-open,
feature-flag, disabled-expansion, and mobile shell states. The component is
still in draft until the behavior lock, reference pack, canonical review, and
verification checklist are accepted.
