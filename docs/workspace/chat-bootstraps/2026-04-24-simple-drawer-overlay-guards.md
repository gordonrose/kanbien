# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-24
- Chat Scope: Simple Select and Drawer Select canonical overlay guards
- Chat Slug: simple-drawer-overlay-guards
- Reason For Isolation: Apply the shared canonical overlay containment and
  settled-ready standards to the next form-control overlay families without
  mixing changes into `main`.

## Git Start Point

- Base Commit: `0a3895c`
- Source Branch At Bootstrap Time: `main`
- Bootstrap Command Or Method: `npm run git:preflight`, then
  `git checkout -b codex/simple-drawer-overlay-guards`

## Dedicated Isolation

- Dedicated Branch: `codex/simple-drawer-overlay-guards`
- Dedicated Worktree Path: `/home/gordon/kanbien`
- Parallel Chats Known At Bootstrap Time: none explicitly declared in this chat

## Intended Scope

- Planned Write Set: simple-select and drawer-select canonical render scripts,
  visual canonical tests, shared overlay guard usage, and directly related
  verification/reconciliation notes if coverage exposes an escaped issue.
- Expected Maintained Artifacts: visual harness updates and design-system
  verification notes for overlay containment/readiness.
- Known Shared Seams: generated canonical render routing, canonical overlay
  guard helper, form control overlay/drawer behavior, canonical ready markers.
- Explicit Non-Goals: unrelated generated families, app adoption changes, or
  broad CSS refactors unless a reproduced issue requires a shared fix.

## Coordination Notes

- Rebase Policy For This Chat: keep based on `0a3895c` unless `origin/main`
  advances and the user approves rebase/promotion handling.
- Commit Approval Posture: wait for explicit user approval before committing
  this new Simple Select / Drawer Select slice.
- Push Or PR Posture: do not push unless requested.
- Handoff Notes:

## Outcome

- Final Branch Used: `codex/simple-drawer-overlay-guards`
- Final Base Commit If Changed: unchanged from `0a3895c`
- Follow-Up Integration Notes: shared overlay containment guard is now applied
  to simple-select open listboxes and representative drawer-select desktop,
  RTL, dark/magnified, and mobile overlay states; Simple Select now publishes
  ready only after settled owner-reserve synchronization.
