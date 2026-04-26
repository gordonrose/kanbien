# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-26
- Chat Scope: Teach the git worktree audit harness to distinguish intentionally preserved stale WIP from unknown dirty stale-base worktrees.
- Chat Slug: preserved-wip-worktree-audit
- Reason For Isolation: This changes repo guardrail behavior and should remain separate from the async activity drawer design-system slice.

## Git Start Point

- Base Commit: 899ff5d7f1ee3e7fef34bc9c073e04d660902659
- Base Ref: origin/main
- Source Branch At Bootstrap Time: codex/async-activity-drawer-generated-route-proof
- Bootstrap Command Or Method: `git checkout -b codex/preserved-wip-worktree-audit origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/preserved-wip-worktree-audit
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: `/tmp/kanbien-admin-profile-logo-assets` was dirty, stale against `origin/main`, and understood as a separate parked admin profile/logo assets line of work.

## Intended Scope

- Planned Write Set: `src/scripts/gitWorktreeAudit.ts`, `tests/unit/gitGuardrails/gitWorktreeAudit.test.ts`, `docs/standards/git-workflow-guardrails.md`, `docs/workspace/preserved-worktrees/*`, and this bootstrap record.
- Expected Maintained Artifacts: Git workflow guardrail docs and a preserved-worktree marker for the parked admin profile/logo assets worktree.
- Known Shared Seams: Git guardrail scripts used before material repo work.
- Explicit Non-Goals: Do not modify or promote the admin profile/logo assets worktree. Do not continue async activity drawer canonical proof in this branch.

## Coordination Notes

- Rebase Policy For This Chat: Rebase or restart from `origin/main` if `origin/main` advances before promotion.
- Worktree Audit Result: `npm run git:worktree-audit` currently blocks on `/tmp/kanbien-admin-profile-logo-assets`; this change updates that classification when an explicit preserved-worktree record exists.
- Commit Approval Posture: Wait for explicit user approval before committing.
- Push Or PR Posture: Promote and push `main` only when the user asks.
- Handoff Notes: After this harness slice, return to `codex/async-activity-drawer-generated-route-proof` or recreate it from the promoted main.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
