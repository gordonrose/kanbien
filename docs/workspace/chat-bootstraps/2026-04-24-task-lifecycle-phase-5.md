# Chat Bootstrap

- Date: 2026-04-24
- Chat Scope: Build phase 5 of the task lifecycle workflow by adding a `codex:promote-task` helper that resolves a task id, runs the existing promotion guardrail, and reports the local-review file set.
- Chat Slug: task-lifecycle-phase-5
- Reason For Isolation: This is a material workflow slice touching the repo's promotion path, so it needs a dedicated branch and worktree from the current clean main baseline.

## Git Start Point

- Base Commit: `5a9ee24`
- Source Branch At Bootstrap Time: `main`
- Bootstrap Command Or Method: `git -C /home/gordon/kanbien worktree add -b codex/task-lifecycle-phase-5 /tmp/kanbien-task-lifecycle-phase-5 main`

## Dedicated Isolation

- Dedicated Branch: `codex/task-lifecycle-phase-5`
- Dedicated Worktree Path: `/tmp/kanbien-task-lifecycle-phase-5`
- Parallel Chats Known At Bootstrap Time:
  - `/home/gordon/kanbien-chat-bootstrap-automation` on `codex/chat-bootstrap-automation`
  - `/home/gordon/kanbien-traceability` on `codex/traceability-governance`

## Intended Scope

- Planned Write Set:
  - `package.json`
  - `src/scripts/codexPromoteTask.ts`
  - `src/scripts/gitPromote.ts`
  - `src/scripts/lib/codexTaskRegistry.ts`
  - `docs/workspace/task-registry/README.md`
- Expected Maintained Artifacts:
  - `docs/workspace/task-registry/current-tasks.generated.json` only if inventory-facing fields need to change
- Known Shared Seams:
  - task/worktree inventory classification
  - git promote guardrail integration
  - local-promotion review summary
- Explicit Non-Goals:
  - automated push
  - persistent task-state machine
  - GitHub PR flow

## Coordination Notes

- Rebase Policy For This Chat: Rebase only if `main` changes before promotion; otherwise keep this slice as a direct descendant of `5a9ee24`.
- Commit Approval Posture: Commit after implementation and verification, then review locally before push.
- Push Or PR Posture: Push `main` only after local-promotion review.
- Handoff Notes: Phase 5 should remain a task-aware wrapper around the existing promote flow, not a reinvention of the underlying git safety checks.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
