# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-27
- Chat Scope: Implement canonical-renderings route sync into the durable web-app hierarchy tree.
- Chat Slug: canonical-renderings-tree-sync
- Reason For Isolation: This is material cross-feature topology work touching protected routes, domain logic, tests, and issue reconciliation evidence.

## Git Start Point

- Base Commit: 9b9c41fd0b65440a1536f173dd32f4507a92e0e9
- Base Ref: origin/main at 981d320fa4e6fdc1f5ea81bfc60ddd0ec44b7a4f plus the local hierarchy-tree shared render seam commit.
- Source Branch At Bootstrap Time: codex/hierarchy-tree-shared-render-seam
- Bootstrap Command Or Method: `git checkout -b codex/canonical-renderings-tree-sync`

## Dedicated Isolation

- Dedicated Branch: codex/canonical-renderings-tree-sync
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Admin profile/logo asset worktrees remain parked preserved WIP and are outside this write set.

## Intended Scope

- Planned Write Set: `src/features/webAppHierarchyBuilder`, `src/features/designSystemCanonicals` public seams if needed, tests covering canonical-renderings hierarchy sync, issue-reconciliation notes, and this bootstrap record.
- Expected Maintained Artifacts: Web-app hierarchy feature docs or manifests if public seams/dependencies change; issue reconciliation note for the escaped tree visibility gap.
- Known Shared Seams: `designSystemCanonicals` public projections, `webAppHierarchyBuilder` topology mutation, root-admin hierarchy workspace.
- Explicit Non-Goals: Do not scan frontend files for canonical route truth. Do not alter public canonical rendering routes. Do not modify parked admin profile/logo worktrees.

## Coordination Notes

- Rebase Policy For This Chat: Rebase or restart from `origin/main` if another chat changes canonical governance or hierarchy topology seams before promotion.
- Worktree Audit Result: `npm run git:worktree-audit` reported no blocking dirty stale-base worktrees; preserved logo WIP remains non-blocking.
- Commit Approval Posture: Wait for explicit user approval before committing this sync slice.
- Push Or PR Posture: Promote and push `main` only when the user asks.
- Handoff Notes: Root cause is that canonical families exist in the canonical registry but the planned hierarchy sync endpoint was not implemented.

## Outcome

- Final Branch Used: codex/canonical-renderings-tree-sync
- Final Base Commit If Changed: unchanged; implementation continues on the
  shared hierarchy-tree seam commit recorded above.
- Follow-Up Integration Notes: Candidate fix implemented with the dev server
  restarted on port 3000 for review. User confirmation is still required before
  commit/promotion.
