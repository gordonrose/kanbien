# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-27
- Chat Scope: Extract and govern the shared hierarchy-tree drawer-host render seam.
- Chat Slug: hierarchy-tree-shared-render-seam
- Reason For Isolation: This is material design-system seam work touching shared frontend assets and adoption evidence.

## Git Start Point

- Base Commit: 981d320fa4e6fdc1f5ea81bfc60ddd0ec44b7a4f
- Base Ref: local `main` after fast-forwarding the approved hierarchy-tree generated render repair stack; `origin/main` remains 425a6f7 until the repaired stack is pushed.
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git checkout -b codex/hierarchy-tree-shared-render-seam`

## Dedicated Isolation

- Dedicated Branch: codex/hierarchy-tree-shared-render-seam
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Admin profile/logo asset worktrees remain parked preserved WIP and are outside this write set.

## Intended Scope

- Planned Write Set: `src/frontend/designSystem/assets/hierarchyTree.mjs`, `src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs`, hierarchy-tree adoption/reference/verification docs, targeted frontend tests, and this bootstrap record.
- Expected Maintained Artifacts: Hierarchy-tree adoption contract, reference pack or verification checklist if their current-state wording changes.
- Known Shared Seams: `hierarchy-tree`, `web-app-hierarchy workspace`, root-admin governed app adoption.
- Explicit Non-Goals: Do not implement new real-app UI. Do not change backend hierarchy APIs. Do not modify parked admin profile/logo worktrees.

## Coordination Notes

- Rebase Policy For This Chat: Rebase or restart from promoted `main` if another chat advances the hierarchy-tree seam before this branch is promoted.
- Worktree Audit Result: `npm run git:worktree-audit` reported no blocking dirty stale-base worktrees after the render repair checkpoint; preserved logo WIP remains non-blocking.
- Commit Approval Posture: Wait for explicit user approval before committing this seam slice.
- Push Or PR Posture: Promote and push `main` only when the user asks.
- Handoff Notes: Build on the already-verified hierarchy-tree render containment, mobile, dark-theme, breadcrumb, and magnification repairs.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
