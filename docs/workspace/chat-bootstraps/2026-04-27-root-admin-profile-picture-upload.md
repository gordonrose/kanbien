# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-27
- Chat Scope: Root-admin root-user profile-picture upload through the existing
  asset foundation.
- Chat Slug: `root-admin-profile-picture-upload`
- Reason For Isolation: Material multi-file change touching asset upload
  contracts, privileged root-admin UI, tests, and maintained artifacts while
  other repo work may exist in parallel.

## Git Start Point

- Base Commit: `93229b2f9bb214c99902a35b43c9dfdc56641653`
- Base Ref: `origin/main`
- Source Branch At Bootstrap Time: `codex/root-admin-list-form`
- Bootstrap Command Or Method: Cleared the stale dirty blocker in the root
  checkout by stashing unrelated WIP, verified worktree audit, then created
  `codex/root-admin-profile-picture-upload` in the existing
  `/tmp/kanbien-root-admin-list-form` worktree from the explicit base commit.

## Dedicated Isolation

- Dedicated Branch: `codex/root-admin-profile-picture-upload`
- Dedicated Worktree Path: `/tmp/kanbien-root-admin-list-form`
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: The root checkout had unrelated
  `codex/login-template-page` WIP, preserved in a stash before this branch was
  created.

## Intended Scope

- Planned Write Set:
  `src/features/assets`, `src/lib/storage`, root-admin frontend assets,
  focused tests, asset/API docs, Postman/OpenAPI, feature manifest wording,
  asset consumer decision record, review and test-summary artifacts.
- Expected Maintained Artifacts: Asset consumer decision record, API contract,
  OpenAPI, Postman collection, feature docs, feature manifest, feature
  dependency graph check, AI/standards review, and test-run summary.
- Known Shared Seams: `assets` public route contract, object storage adapter
  interface, root-admin governed drawer form, and shared HTTP test harness.
- Explicit Non-Goals: Public asset delivery, tenant-side self-service profile
  upload, document/audio/video upload, generic file library behavior, new
  object-storage provider assumptions, or new authz capability keys.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only after explicit review if
  `origin/main` moves in a way that affects asset, root-admin, or storage
  seams.
- Worktree Audit Result: Passed after preserving unrelated root-checkout WIP.
- Commit Approval Posture: Do not commit until the user explicitly approves.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: The branch contains implementation, tests, and maintained
  artifacts for root-operated profile-picture upload only.

## Outcome

- Final Branch Used: `codex/root-admin-profile-picture-upload`
- Final Base Commit If Changed: Not changed.
- Follow-Up Integration Notes: Run promotion guardrails after maintainer review
  and explicit commit approval.
