# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-25
- Chat Scope: Job-processing foundation first implementation slice
- Chat Slug: job-processing-foundation
- Reason For Isolation: Material multi-file feature, persistence, migration, runtime, test, and artifact work should start from current `origin/main` without mixing with the dirty root worktree state.

## Git Start Point

- Base Commit: `2f35ccd407738b4d8d273d11ca60c87db0f12be6`
- Source Branch At Bootstrap Time: `origin/main`
- Bootstrap Command Or Method: `git worktree add -b codex/job-processing-foundation /tmp/kanbien-job-processing-foundation origin/main`

## Dedicated Isolation

- Dedicated Branch: `codex/job-processing-foundation`
- Dedicated Worktree Path: `/tmp/kanbien-job-processing-foundation`
- Parallel Chats Known At Bootstrap Time: Root worktree `/home/gordon/kanbien` had an unrelated dirty asset ADR rename/delete pair.

## Intended Scope

- Planned Write Set: `src/features/jobProcessing`, migrations, job-processing runtime entrypoints, env parsing, package scripts, tests, feature manifests, generated feature dependency graph, and source-independent docs or artifacts required by the slice.
- Expected Maintained Artifacts: Feature manifest, generated feature dependency graph if manifest dependencies change, API/feature docs only where current truth changes, executable test mappings to `TC-JOB-PROC-*`.
- Known Shared Seams: v1 feature integration conventions, migration harness, env parsing, package scripts, runtime entrypoint conventions, feature dependency graph generation.
- Explicit Non-Goals: HTTP/operator APIs, recurring scheduling, notificationDelivery retry adoption, Redis-backed BullMQ adapter tests before provider adapter selection/integration.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only after explicit coordination if another chat lands shared-seam work first.
- Commit Approval Posture: Do not commit until user approval.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: Preserve tenant-boundary and payload-safety rules; keep provider-neutral seams testable with fake-provider contract tests.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
