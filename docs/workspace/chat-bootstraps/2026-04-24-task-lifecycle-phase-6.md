# Chat Bootstrap

- Date: 2026-04-24
- Chat Scope: Build phase 6 of the task lifecycle workflow by adding explicit local-promotion review and reviewed-push helpers after `codex:promote-task`.
- Chat Slug: task-lifecycle-phase-6
- Reason For Isolation: This is a material workflow slice that extends the repo's post-promotion lifecycle, so it needs a dedicated branch and worktree from the current clean main baseline.

## Git Start Point

- Base Commit: `f1f7975`
- Source Branch At Bootstrap Time: `main`
- Bootstrap Command Or Method: `git -C /home/gordon/kanbien worktree add -b codex/task-lifecycle-phase-6 /tmp/kanbien-task-lifecycle-phase-6 main`

## Dedicated Isolation

- Dedicated Branch: `codex/task-lifecycle-phase-6`
- Dedicated Worktree Path: `/tmp/kanbien-task-lifecycle-phase-6`
- Parallel Chats Known At Bootstrap Time:
  - `/home/gordon/kanbien-chat-bootstrap-automation` on `codex/chat-bootstrap-automation`
  - `/home/gordon/kanbien-traceability` on `codex/traceability-governance`

## Intended Scope

- Planned Write Set:
  - `package.json`
  - `src/scripts/codexReviewPromotion.ts`
  - `src/scripts/codexPushReviewed.ts`
  - `src/scripts/codexPromoteTask.ts`
  - `docs/workspace/task-registry/README.md`
- Expected Maintained Artifacts:
  - no generated artifact changes expected unless the review summary contract needs to appear in the inventory docs
- Known Shared Seams:
  - task-aware promotion
  - local review summary
  - push-to-main workflow
- Explicit Non-Goals:
  - persistent task state storage
  - automatic retirement after push
  - GitHub PR workflow

## Coordination Notes

- Rebase Policy For This Chat: Rebase only if `main` changes before promotion; otherwise keep this slice as a direct descendant of `f1f7975`.
- Commit Approval Posture: Commit after implementation and verification, then review locally before push.
- Push Or PR Posture: Push `main` only after local-promotion review.
- Handoff Notes: Phase 6 should make the review-and-push path explicit without forcing persistent lifecycle state yet.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
