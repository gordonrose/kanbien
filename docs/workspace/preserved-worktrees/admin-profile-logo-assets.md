# Preserved Worktree

## Preserved Worktree Decision

- Worktree Path: /tmp/kanbien-admin-profile-logo-assets
- Branch: codex/admin-profile-logo-assets
- Owner/Purpose: Parked admin profile picture and tenant logo asset work that is separate from canonical rendering proof work.
- Base Commit: 05af6a2345699f125572e167622d4afd2281ef4d
- Preservation Decision Date: 2026-04-26
- Expected Resolution: Rebase, recover, promote, or intentionally discard this worktree before continuing the admin profile/logo asset task.
- Allowed To Block Unrelated Work: no

## Notes

- This marker does not make the worktree promotable.
- This marker only lets unrelated clean branches proceed while keeping the stale WIP visible in `npm run git:worktree-audit`.
- The worktree must still be reconciled before any further material work on the admin profile/logo asset task.
