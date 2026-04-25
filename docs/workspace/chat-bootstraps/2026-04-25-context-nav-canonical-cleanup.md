# Chat Branch Bootstrap - Context Nav Canonical Cleanup

## Scope

Fix the existing context-nav canonical visual-contract failures for local theme
scope and RTL desktop content lane reservation.

## Base

- Base ref: `origin/main`
- Base commit: `07e7b581b4bc636e087d126ca8abac2d44a551a6`
- Source branch at bootstrap: `main`

## Branch And Worktree

- Dedicated branch: `codex/context-nav-canonical-cleanup`
- Worktree path: `/home/gordon/kanbien`

## Intended Write Set

- `src/frontend/designSystem/assets/styles.css`
- `src/frontend/designSystem/assets/contextNav*.mjs`
- `tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts`
- `docs/workspace/issue-reconciliations/`

## Shared Seams

- Design-system context-nav canonical render frame
- Generated context-nav/display-settings canonical routes
- Visual geometry tests for RTL, theme scope, and magnification

## Notes

No commits or promotion until user approval. Keep the fix scoped to the two
failing context-nav canonical contracts unless verification exposes a directly
related defect.
