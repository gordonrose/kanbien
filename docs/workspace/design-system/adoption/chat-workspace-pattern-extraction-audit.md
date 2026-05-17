# Chat Workspace Pattern Extraction Audit

- Date: 2026-05-17
- Surface: `/design-system/patterns/chat-workspace`
- Source: `src/frontend/designSystem/assets/chatWorkspacePattern.mjs`
- Status: implementation-audit

## Purpose

Record the current extraction boundary for the chat workspace pattern while it
moves from a provisional demo toward reusable design-system-owned seams.

This audit does not mark the chat workspace shell as app-adoption-ready. Real
app adoption still requires the signed-off behavior lock, reference pack,
canonical render surface, verification checklist, and adoption artifact to stay
honest.

## Demo Data

The pattern keeps representative local data for layer, entity, conversation,
and row states. That demo data is allowed only inside the design-system proving
ground and must not become app authority.

Current shared data and contract candidates live in:

- `src/frontend/designSystem/assets/chatWorkspaceShellContract.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceConversationIndex.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceEntityHost.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceEntitySelector.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceRowDrawer.mjs`
- `src/frontend/designSystem/assets/chatWorkspaceSecondaryHeader.mjs`

## Preview Render Callbacks

The pattern now delegates orchestration through `chatWorkspaceBootstrap.mjs`.
The preview file should remain a thin host that supplies representative
callbacks, state, and render mounts rather than owning reusable controller
logic.

The preview host may still provide:

- static demo conversations and rows
- preview-only button handlers
- local refresh timing for the demo surface
- wiring that demonstrates the shared controller seams

The preview host should not own:

- workspace expansion controller behavior
- row reorder mechanics
- status-drop mechanics
- entity selector behavior
- layer selector behavior
- global click or keyboard routing that belongs in shared modules

## Remaining Shared-Seam Candidates

The current extraction still needs review before app adoption:

- a signed-off shell behavior lock for expanded, collapsed, history-open,
  mobile, and disabled-expansion states
- a reference pack that names the canonical state matrix and known responsive
  constraints
- a dedicated canonical render surface for `chat-workspace-shell`
- an adoption contract that states exactly which render/controller seams an app
  consumer may call
- a production adoption decision beyond the current mocked in-app proof
  consumer at `/root-admin/build/workspace`

## Current Risk

Root-admin app adoption remains blocked unless it consumes the signed-off
design-system-owned source of truth. Copying shell structure, interaction
logic, or page-local CSS into app code would be drift under the governed app UI
rules.
