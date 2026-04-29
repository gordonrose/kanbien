# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-29
- Chat Scope: Relax dirty worktree preflight blocking for explicitly disjoint same-worktree chat paths.
- Chat Slug: dirty-branch-collision-guard
- Reason For Isolation: The primary worktree has an unrelated untracked product-discovery artifact, so this guardrail change is isolated in a dedicated worktree from `origin/main`.

## Git Start Point

- Base Commit: 588131ccd32ec9f369a274a27ec0d62cd12cb954
- Base Ref: origin/main
- Source Branch At Bootstrap Time: codex/product-discovery-reporting-dashboard-template
- Bootstrap Command Or Method: `git worktree add -b codex/dirty-branch-collision-guard /tmp/kanbien-dirty-branch-collision-guard origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/dirty-branch-collision-guard
- Dedicated Worktree Path: /tmp/kanbien-dirty-branch-collision-guard
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Primary worktree `/home/gordon/kanbien` is dirty with `docs/workspace/product-discovery/2026-04-29-reporting-dashboard-template.md`; worktree audit reported no dirty stale-base blockers.

## Intended Scope

- Planned Write Set: src/scripts/gitPreflight.ts, tests/unit/gitGuardrails/gitPreflight.test.ts, docs/standards/git-workflow-guardrails.md, docs/workspace/chat-bootstraps/2026-04-29-dirty-branch-collision-guard.md
- Expected Maintained Artifacts: Git workflow guardrail standard and focused unit tests.
- Known Shared Seams: Repo git guardrail scripts and bootstrap validation behavior.
- Explicit Non-Goals: Promotion semantics, worktree audit stale-base classification, or changing default dirty-worktree safety without an explicit write set.

## Coordination Notes

- Rebase Policy For This Chat: Rebase or recreate from `origin/main` if baseline changes before commit.
- Worktree Audit Result: `npm run git:worktree-audit` reported no dirty stale-base worktrees before isolation.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push unless requested.
- Handoff Notes: This change should preserve strict default blocking when no planned write set is supplied.

## Outcome

- Final Branch Used: codex/dirty-branch-collision-guard
- Final Base Commit If Changed: N/A
- Follow-Up Integration Notes: Scoped implementation remains uncommitted pending user approval.
