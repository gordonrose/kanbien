# Chat Bootstrap

- Date: 2026-04-22
- Chat Scope: harden git guardrails so the harness blocks stale-main,
  dirty-worktree, and unsafe-promotion states before they spiral
- Chat Slug: `git-guardrails-hardening`
- Reason For Isolation:
  bake the recent branch, worktree, and stale-main lessons into executable
  repo checks rather than relying on soft process advice

## Git Start Point

- Base Commit: `90058e1`
- Source Branch At Bootstrap Time: `main`
- Bootstrap Command Or Method:
  created `codex/git-guardrails-hardening` from a clean synced `main`, then
  added script and standards updates in the main checkout

## Dedicated Isolation

- Dedicated Branch: `codex/git-guardrails-hardening`
- Dedicated Worktree Path: `/home/gordon/kanbien`
- Parallel Chats Known At Bootstrap Time:
  - residual root-admin shell work appears in the current worktree and should
    not be folded into this guardrails slice
  - previous blog/traceability backup preserved at
    `/tmp/kanbien-blog-traceability-backup`

## Intended Scope

- Planned Write Set:
  - `src/scripts/gitPreflight.ts`
  - `src/scripts/gitPromote.ts`
  - `package.json`
  - `.codex/skills/10-repo-governance/branch-and-commit-governor/SKILL.md`
  - `AGENTS.md`
  - `docs/standards/git-workflow-guardrails.md`
  - this bootstrap artifact
- Expected Maintained Artifacts:
  - repo git workflow standards
  - branch-and-commit skill behavior
  - chat bootstrap artifact
- Known Shared Seams:
  - repo-wide git workflow expectations
  - Codex harness behavior for material changes and promotion work
- Explicit Non-Goals:
  - changing existing feature code beyond what is necessary to wire the new
    guardrail scripts
  - cleaning up unrelated root-admin shell drift in the current worktree

## Coordination Notes

- Rebase Policy For This Chat:
  keep the branch on the current synced `main` baseline and do not rebase
  unless `origin/main` moves and promotion is explicitly requested
- Commit Approval Posture:
  approval-gated
- Push Or PR Posture:
  push only when asked
- Handoff Notes:
  the scripts are meant to be run directly by humans and by future Codex
  harness flows before material work and before promotion

## Outcome

- Final Branch Used: `codex/git-guardrails-hardening`
- Final Base Commit If Changed: `90058e1`
- Follow-Up Integration Notes:
  if adopted, the branch-and-commit workflow should treat these scripts as
  mandatory gates rather than optional advisory helpers
