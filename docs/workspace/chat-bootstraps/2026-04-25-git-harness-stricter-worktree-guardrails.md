# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-25
- Chat Scope: stricter git/worktree guardrail harness
- Chat Slug: git-harness-stricter-worktree-guardrails
- Reason For Isolation: material script, standards, and test changes after a
  multi-worktree cleanup revealed stale dirty worktree and bootstrap-mismatch
  gaps

## Git Start Point

- Base Commit: 65e879dc47189d227be15e01b290cd94ed54a867
- Base Ref: origin/main
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git checkout -b codex/git-harness-stricter-worktree-guardrails`

## Dedicated Isolation

- Dedicated Branch: codex/git-harness-stricter-worktree-guardrails
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: job-processing planning worktree
  remains active separately

## Intended Scope

- Planned Write Set: `src/scripts/gitPreflight.ts`,
  `src/scripts/gitWorktreeAudit.ts`, package scripts, git guardrail docs,
  bootstrap template, and focused guardrail tests
- Expected Maintained Artifacts: git workflow standard, AGENTS repo
  constitution, bootstrap template, and this bootstrap record
- Known Shared Seams: repo-local git guardrail scripts and material-chat
  startup workflow
- Explicit Non-Goals: do not clean up the remaining job-processing planning
  worktree or resolve its content in this branch

## Coordination Notes

- Rebase Policy For This Chat: promote by cherry-pick if `origin/main` moves
  before merge
- Worktree Audit Result: expected to flag the existing dirty stale
  job-processing planning worktree until that separate chat is resolved
- Commit Approval Posture: wait for explicit approval before commit
- Push Or PR Posture: push only if requested
- Handoff Notes: use this change to catch future dirty stale-base sibling
  worktrees before starting more material chats

## Outcome

- Final Branch Used: codex/git-harness-stricter-worktree-guardrails
- Final Base Commit If Changed: unchanged
- Follow-Up Integration Notes: focused guardrail unit tests pass; full
  typecheck remains blocked by pre-existing design-system typing errors outside
  this guardrail change. `npm run git:worktree-audit` intentionally reports the
  dirty stale job-processing planning worktree until that separate chat is
  resolved.
