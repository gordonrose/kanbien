# Preserved Worktrees

This folder stores explicit records for intentionally preserved worktrees.

Repo bucket classification: `shared-governance-kernel`.

Preserved-worktree records are active git/worktree coordination inputs consumed
by `src/scripts/gitWorktreeAudit.ts` and referenced by
`docs/standards/git-workflow-guardrails.md`.

A preserved-worktree marker means parked WIP is visible and intentionally kept
out of the current task. It does not make that work promotable, current, or
safe to merge.

Do not archive or move this folder without updating the git worktree audit
default path, tests, and git workflow standards.
