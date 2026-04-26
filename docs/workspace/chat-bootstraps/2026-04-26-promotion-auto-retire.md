# Chat Branch Bootstrap - Promotion Auto Retire

## Chat Bootstrap

- Date: 2026-04-26
- Chat Scope: Update the Codex promotion harness so successful task promotion
  retires the promoted task branch and worktree automatically.
- Chat Slug: promotion-auto-retire
- Reason For Isolation: Main repo worktree has active top-nav generated-route
  proof WIP; this harness change needs a clean isolated branch and worktree.

## Git Start Point

- Base Commit: `43f8b543486851ad8598e29549a642b9668a4e93`
- Base Ref: `origin/main`
- Source Branch At Bootstrap Time: `main`
- Bootstrap Command Or Method:
  `git worktree add -b codex/promotion-auto-retire /tmp/kanbien-promotion-auto-retire origin/main`

## Dedicated Isolation

- Dedicated Branch: `codex/promotion-auto-retire`
- Dedicated Worktree Path: `/tmp/kanbien-promotion-auto-retire`
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: `/home/gordon/kanbien` has active
  top-nav generated-route proof WIP on `codex/top-nav-generated-route-proof`.

## Intended Scope

- Planned Write Set:
  - `src/scripts/codexPromoteTask.ts`
  - `src/scripts/codexRetire.ts`
  - `src/scripts/lib/codexTaskRegistry.ts` if needed
  - relevant tests for the promotion/retirement harness
  - this bootstrap artifact
- Expected Maintained Artifacts: bootstrap note only unless executable harness
  behavior requires standards documentation updates.
- Known Shared Seams:
  - Codex task promotion helper
  - Codex task retirement helper
  - Git workflow guardrail scripts
- Explicit Non-Goals:
  - Do not modify active top-nav generated-route proof files.
  - Do not retire or clean the active top-nav task.

## Coordination Notes

- Rebase Policy For This Chat: stay based on `origin/main`; re-check before
  promotion.
- Worktree Audit Result: sibling top-nav worktree is dirty but descends from
  `origin/main`; no dirty stale-base blockers.
- Commit Approval Posture: no commit without explicit approval.
- Push Or PR Posture: no push unless requested.
- Handoff Notes: This change should make future successful `codex:promote-task
  -- --apply` runs retire source task branches/worktrees when no unique patch
  content remains.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
