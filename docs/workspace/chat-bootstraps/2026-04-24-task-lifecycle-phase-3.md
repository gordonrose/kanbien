# Chat Bootstrap

- Date: 2026-04-24
- Chat Scope: Build phase 3 of the task lifecycle workflow by adding a `codex:task` entrypoint that decides whether to reuse, resume, retire first, or create a new isolated task worktree.
- Chat Slug: task-lifecycle-phase-3
- Reason For Isolation: This is a material multi-file workflow change on top of phase 2, and it needs a dedicated baseline before any further lifecycle automation is added.

## Git Start Point

- Base Commit: `1a55c1d`
- Source Branch At Bootstrap Time: `main`
- Bootstrap Command Or Method: `git -C /home/gordon/kanbien worktree add -b codex/task-lifecycle-phase-3 /tmp/kanbien-task-lifecycle-phase-3 main`

## Dedicated Isolation

- Dedicated Branch: `codex/task-lifecycle-phase-3`
- Dedicated Worktree Path: `/tmp/kanbien-task-lifecycle-phase-3`
- Parallel Chats Known At Bootstrap Time:
  - `/home/gordon/kanbien-chat-bootstrap-automation` on `codex/chat-bootstrap-automation`
  - `/home/gordon/kanbien-traceability` on `codex/traceability-governance`

## Intended Scope

- Planned Write Set:
  - `package.json`
  - `src/scripts/codexTask.ts`
  - `src/scripts/lib/codexTaskRegistry.ts`
  - `src/scripts/lib/*` helper seams needed for task creation/reuse decisions
  - `docs/workspace/task-registry/README.md`
- Expected Maintained Artifacts:
  - `docs/workspace/task-registry/current-tasks.generated.json` only if the command contract or displayed statuses change and the generated snapshot needs refreshing
- Known Shared Seams:
  - task/worktree inventory classification
  - retirement flow states
  - git bootstrap and worktree creation guardrails
- Explicit Non-Goals:
  - tangent splitting
  - local-promotion review state tracking
  - automatic retirement after push

## Coordination Notes

- Rebase Policy For This Chat: Rebase only if `main` changes before promotion; otherwise keep this slice as a direct descendant of `1a55c1d`.
- Commit Approval Posture: Commit after implementation and verification, then review locally before push.
- Push Or PR Posture: Push `main` only after local-promotion review.
- Handoff Notes: Phase 3 should stop at a small, honest `codex:task` entrypoint rather than overreaching into later lifecycle states.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
