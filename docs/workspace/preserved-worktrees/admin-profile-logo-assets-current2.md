# Preserved Worktree

## Preserved Worktree Decision

- Worktree Path: /tmp/kanbien-admin-profile-logo-assets-current2
- Branch: codex/admin-profile-logo-assets-current2
- Owner/Purpose: Parked admin profile picture and tenant logo asset work that is separate from canonical rendering proof work.
- Base Commit: 633290d2014da53c62e1982fc43d4e55a6269501
- Preservation Decision Date: 2026-04-26
- Expected Resolution: Rebase, recover, promote, or intentionally discard this worktree before continuing the admin profile/logo asset task.
- Allowed To Block Unrelated Work: no

## Notes

- This marker does not make the worktree promotable.
- This marker only lets unrelated clean branches proceed while keeping the stale WIP visible in `npm run git:worktree-audit`.
- The worktree must still be reconciled before any further material work on the admin profile/logo asset task.
