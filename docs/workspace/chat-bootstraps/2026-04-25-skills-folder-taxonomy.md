# Chat Bootstrap

- Date: 2026-04-25
- Chat Scope: Reorganize repo-local Codex skills into category folders and update references honestly.
- Chat Slug: skills-folder-taxonomy
- Reason For Isolation: Repo-governance refactor touches `.codex/skills/` and docs references while other chats have active worktrees.

## Git Start Point

- Base Commit: bf7a3b01ddb4ba9eab741976e060061f5521cded
- Base Ref: origin/main
- Source Branch At Bootstrap Time: origin/main
- Bootstrap Command Or Method: `git worktree add -b codex/skills-folder-taxonomy /tmp/kanbien-skills-folder-taxonomy origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/skills-folder-taxonomy
- Dedicated Worktree Path: /tmp/kanbien-skills-folder-taxonomy
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Dirty canonical renderings shell hardening worktree at `/home/gordon/kanbien`; dirty express4 characterization worktree at `/tmp/kanbien-express4-characterization`; additional clean task worktrees from audit output.

## Intended Scope

- Planned Write Set:
  - `.codex/skills/**`
  - `AGENTS.md`
  - docs that reference repo-local skill paths or skill organization
  - this bootstrap record
- Expected Maintained Artifacts: Repo-local skill paths, skill cross-references, relevant architecture/guide references, and workspace notes with durable path references.
- Known Shared Seams: Repo-local Codex skill discovery surface under `.codex/skills/`; `AGENTS.md` skill guidance references; architecture docs that describe the change harness.
- Explicit Non-Goals: No product runtime changes, no feature implementation, no frontend app or design-system work, no commit without explicit user approval.

## Coordination Notes

- Rebase Policy For This Chat: Rebase or recreate from `origin/main` if the branch falls behind before promotion.
- Worktree Audit Result: `npm run git:worktree-audit` reported no dirty stale-base worktrees before edits.
- Commit Approval Posture: Wait for explicit user approval before committing.
- Push Or PR Posture: Do not push unless requested.
- Handoff Notes: This refactor should preserve skill names and frontmatter names so trigger semantics remain stable after path moves.

## Outcome

- Final Branch Used: codex/skills-folder-taxonomy
- Final Base Commit If Changed: Not changed at bootstrap.
- Follow-Up Integration Notes: Repo-local skills were moved into category
  folders under `.codex/skills/`. `codex debug prompt-input` was used against
  this worktree to verify recursive discovery still lists the repo-local skills
  from their nested paths.
