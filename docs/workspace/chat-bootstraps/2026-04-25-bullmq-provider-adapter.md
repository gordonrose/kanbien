# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-25
- Chat Scope: BullMQ/Redis provider adapter slice for the job-processing foundation, expanded to first notificationDelivery job adoption.
- Chat Slug: bullmq-provider-adapter
- Reason For Isolation: Material infrastructure slice touching job-processing code, tests, dependency metadata, and maintained docs/artifacts.

## Git Start Point

- Base Commit: 6ffb2bb8a3665bf44f2b6c663f3e371224c3d3c4
- Source Branch At Bootstrap Time: origin/main
- Bootstrap Command Or Method: `git worktree add -b codex/bullmq-provider-adapter /tmp/kanbien-bullmq-provider-adapter origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/bullmq-provider-adapter
- Dedicated Worktree Path: /tmp/kanbien-bullmq-provider-adapter
- Parallel Chats Known At Bootstrap Time: Existing worktrees for asset foundation, form upload component, job-processing foundation, and job-processing planning were present.

## Intended Scope

- Planned Write Set: BullMQ queue provider adapter, dispatcher/worker wiring, notificationDelivery job registration, explicit opt-in Redis provider tests, dependency metadata, and required docs/artifacts.
- Expected Maintained Artifacts: job-processing runbook, PRD/test-case/blueprint status notes, notificationDelivery docs/test-case status, package metadata, feature manifests, and generated feature dependency graph.
- Known Shared Seams: job-processing feature public provider-neutral seams, notificationDelivery public seams, top-level dispatcher/worker entrypoints, dependency metadata, and maintained architecture/workspace docs.
- Explicit Non-Goals: HTTP/operator APIs, recurring scheduling, and notificationDelivery retry adoption.

## Coordination Notes

- Rebase Policy For This Chat: Rebase or recreate only with an explicit recorded decision if origin/main moves materially during the slice.
- Commit Approval Posture: Do not commit until the user explicitly approves.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: Preserve provider-neutral feature-facing contracts and document any pre-existing repo-wide blockers separately from slice issues.

## Outcome

- Final Branch Used: codex/bullmq-provider-adapter
- Final Base Commit If Changed: unchanged; 6ffb2bb8a3665bf44f2b6c663f3e371224c3d3c4
- Follow-Up Integration Notes: `notificationDelivery` now declares a
  `jobProcessing` dependency and the generated feature dependency graph was
  regenerated. Redis-backed provider tests are present but require a local
  Redis listener and `RUN_REDIS_JOB_PROVIDER_TESTS=true`.
