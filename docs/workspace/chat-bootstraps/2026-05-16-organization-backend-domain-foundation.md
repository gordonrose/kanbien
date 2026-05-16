# Chat Branch Bootstrap: Organization Backend Domain Foundation

## Chat Bootstrap

- Date: 2026-05-16
- Chat Scope: Organization backend/domain foundation slice
- Chat Slug: organization-backend-domain-foundation
- Reason For Isolation: Main worktree contains mixed Organization, design-system, scheduler, and infrastructure work. This slice should promote backend/domain work only from a clean scheduler-merged base.

## Git Start Point

- Base Commit: `2fed4e65a92227d37e9e8a37282ab4d0e1316c63`
- Base Ref: `origin/main`
- Source Branch At Bootstrap Time: `/home/gordon/kanbien` local `main` was behind `origin/main` and dirty; this worktree was created directly from `origin/main`.
- Bootstrap Command Or Method: `git worktree add -b codex/organization-backend-domain-foundation /tmp/kanbien-organization-backend-domain-foundation origin/main`

## Dedicated Isolation

- Dedicated Branch: `codex/organization-backend-domain-foundation`
- Dedicated Worktree Path: `/tmp/kanbien-organization-backend-domain-foundation`
- Preflight Command: skipped in dirty main worktree; isolation uses fresh `origin/main` worktree instead.
- Parallel Chats Known At Bootstrap Time: main dirty worktree contains parked Organization planning/backend work, chat workspace/design-system work, local staging notes, and older product request cleanup.

## Intended Scope

- Planned Write Set: Organization backend/domain features, migrations, persistence, transport/API contracts, permission mapping, data dictionary/docs, feature manifests, focused tests, and required generated dependency artifacts.
- Expected Maintained Artifacts: Organization PRD/test cases, data dictionary, API contracts, permission mappings, feature manifests, dependency graph, implementation blueprint/story/task evidence, and test-run summary.
- Known Shared Seams: `jobProcessing` scheduler foundation, `assets`, `rootRoles` capability catalog, `src/routes/v1/index.ts`, Postgres migration harness, traceability harness.
- Explicit Non-Goals: frontend/admin UX implementation, design-system chat workspace work, local/AWS staging infrastructure, and Organization export scheduler adoption unless it is required by the backend/export slice and can remain feature-owned.

## Coordination Notes

- Rebase Policy For This Chat: keep branch based on `origin/main`; reconcile only scoped files from the dirty main worktree.
- Worktree Audit Result: dedicated worktree starts clean.
- Commit Approval Posture: do not commit without explicit approval after verification.
- Push Or PR Posture: push/open PR only after user approval.
- Handoff Notes: preserve the scheduler slice boundary by avoiding hidden Organization imports into `jobProcessing`.

## Outcome

- Final Branch Used: pending
- Final Base Commit If Changed: pending
- Follow-Up Integration Notes: pending
