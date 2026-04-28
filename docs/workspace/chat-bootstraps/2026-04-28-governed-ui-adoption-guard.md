# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-28
- Chat Scope: Add a governed UI adoption guard to the frontend harness and verify it.
- Chat Slug: governed-ui-adoption-guard
- Reason For Isolation: Material harness, docs, and package script changes should not mix with other design-system work.

## Git Start Point

- Base Commit: 4e8c616092e288a6e59c83e6afc7adb2edd10330
- Base Ref: origin/main
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git checkout -b codex/governed-ui-adoption-guard`

## Dedicated Isolation

- Dedicated Branch: codex/governed-ui-adoption-guard
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Earlier form-image-card work had been cleared from this worktree before this branch was created.

## Intended Scope

- Planned Write Set: `src/scripts/`, `package.json`, focused design-system adoption docs, and targeted tests if needed.
- Expected Maintained Artifacts: Bootstrap record and any governed adoption contract or harness documentation touched by the guard.
- Known Shared Seams: `check:static`, root-admin governed UI adoption checks, design-system-owned render/controller seam policy.
- Explicit Non-Goals: No real-app UI redesign, no visual baseline updates, no broad design-system family refactor.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only if the branch becomes stale before promotion, and record that decision here.
- Worktree Audit Result: Not run after branch creation; initial retry confirmed clean synced `main`.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push unless requested.
- Handoff Notes: Guard should prove source ownership, not just visual similarity.

## Outcome

- Final Branch Used: codex/governed-ui-adoption-guard
- Final Base Commit If Changed: N/A
- Follow-Up Integration Notes: Pending implementation and verification.
