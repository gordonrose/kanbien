# Chat Bootstrap

- Date: 2026-04-24
- Chat Scope: Build phase 4 of the task lifecycle workflow by adding a `codex:split` helper for explicit tangent handling and child-task isolation.
- Chat Slug: task-lifecycle-phase-4
- Reason For Isolation: This is a material workflow slice that changes how the repo handles tangents, so it needs a dedicated baseline and an honest bootstrap record before implementation.

## Git Start Point

- Base Commit: `075e239`
- Source Branch At Bootstrap Time: `main`
- Bootstrap Command Or Method: `git -C /home/gordon/kanbien worktree add -b codex/task-lifecycle-phase-4 /tmp/kanbien-task-lifecycle-phase-4 main`

## Dedicated Isolation

- Dedicated Branch: `codex/task-lifecycle-phase-4`
- Dedicated Worktree Path: `/tmp/kanbien-task-lifecycle-phase-4`
- Parallel Chats Known At Bootstrap Time:
  - `/home/gordon/kanbien-chat-bootstrap-automation` on `codex/chat-bootstrap-automation`
  - `/home/gordon/kanbien-traceability` on `codex/traceability-governance`

## Intended Scope

- Planned Write Set:
  - `package.json`
  - `src/scripts/codexSplit.ts`
  - `src/scripts/lib/codexTaskRegistry.ts`
  - `src/scripts/lib/*` helper seams needed to create and document split child tasks
  - `docs/workspace/task-registry/README.md`
- Expected Maintained Artifacts:
  - `docs/workspace/task-registry/current-tasks.generated.json` only if split metadata or dashboard-visible fields change
- Known Shared Seams:
  - task/worktree inventory classification
  - bootstrap note parsing and lifecycle metadata
  - worktree creation guardrails
- Explicit Non-Goals:
  - full task-state persistence
  - automatic promotion or retirement after split
  - arbitrary task creation outside explicit tangent splitting

## Coordination Notes

- Rebase Policy For This Chat: Rebase only if `main` moves before promotion; otherwise keep this slice as a direct descendant of `075e239`.
- Commit Approval Posture: Commit after implementation and verification, then review locally before push.
- Push Or PR Posture: Push `main` only after local-promotion review.
- Handoff Notes: Phase 4 should make tangent splitting explicit and safe without trying to solve the entire long-term task-state model in one pass.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
