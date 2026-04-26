# Chat Bootstrap

- Date: 2026-04-26
- Chat Scope: Add root-operated profile picture asset links to root users and tenant admins
- Chat Slug: admin-profile-logo-assets
- Reason For Isolation: Material backend, persistence, API contract, asset-consumer, and maintained-artifact change while another worktree has unrelated frontend/design-system work.

## Git Start Point

- Base Commit: 05af6a2345699f125572e167622d4afd2281ef4d
- Base Ref: origin/main
- Source Branch At Bootstrap Time: codex/display-settings-generated-route-proof
- Bootstrap Command Or Method: `git worktree add -b codex/admin-profile-logo-assets /tmp/kanbien-admin-profile-logo-assets origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/admin-profile-logo-assets
- Dedicated Worktree Path: /tmp/kanbien-admin-profile-logo-assets
- Preflight Command: `npm run git:preflight` returned SAFE
- Parallel Chats Known At Bootstrap Time: `/home/gordon/kanbien` has unrelated display-settings/top-nav bootstrap work in progress.

## Intended Scope

- Planned Write Set: profile-picture asset consumer decision record, rootUsers/tenantAdmins contracts, domain, persistence, migrations, tests, API docs/OpenAPI, feature manifests, generated feature dependency graph if cross-feature dependencies change, and required QA/test summary artifacts.
- Expected Maintained Artifacts: asset consumer decisions, API contracts, OpenAPI, PRD/test-case refinements as needed, feature docs, feature manifests, dependency graph, test summaries or QA notes.
- Known Shared Seams: `assets` public validation seam, root-operated authz capability routing, persistence migrations, generated OpenAPI, feature dependency graph.
- Explicit Non-Goals: tenant-admin self-service profile editing, tenant logo or tenant-branding implementation, tenant-session asset upload routes, public asset delivery, generic asset library behavior, document/audio/video upload support, frontend app UI changes.

## Coordination Notes

- Rebase Policy For This Chat: Rebase or recreate from `origin/main` if the base changes before promotion; do not mix unrelated frontend/design-system work.
- Worktree Audit Result: `npm run git:worktree-audit` found no blocking dirty
  stale-base worktrees; two earlier preserved WIP worktrees remain recorded as
  non-blocking recovery cases.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push unless requested; follow repo promotion guardrails if asked to ship.
- Handoff Notes: Keep the implementation root-operated and use same-origin `/v1/assets/{assetId}/content` display URLs derived server-side.

## Outcome

- Final Branch Used: `codex/admin-profile-logo-assets-current2`
- Final Base Commit If Changed:
  `8b28507fefbf438b18c560c32578ad74614a7a6c`
- Follow-Up Integration Notes: The original isolated worktree was recreated on
  current `origin/main` after the display-settings/top-nav promotion advanced
  the baseline, then rebased again after `origin/main` advanced to `4c09ed7`
  and later to `8b28507`.
  Continue from `/tmp/kanbien-admin-profile-logo-assets-current2`.
