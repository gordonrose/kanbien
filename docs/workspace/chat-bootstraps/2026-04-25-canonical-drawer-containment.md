# Chat Bootstrap

- Date: 2026-04-25
- Chat Scope: Fix canonical-rendering drawer containment so context-nav-derived drawers and async activity drawer render inside the review area instead of escaping to the page
- Chat Slug: canonical-drawer-containment
- Reason For Isolation: Material governed design-system visual behavior, tests, and issue-reconciliation artifacts must stay isolated from `main`.

## Git Start Point

- Base Commit: 216998121a7c9c801a73fc23a3b0f50e2ac03a6d
- Base Ref: origin/main
- Source Branch At Bootstrap Time: codex/canonical-drawer-containment
- Bootstrap Command Or Method: `git checkout -b codex/canonical-drawer-containment`

## Dedicated Isolation

- Dedicated Branch: codex/canonical-drawer-containment
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: `/tmp/kanbien-capability-catalog-export-refresh` existed as a clean stale-base worktree; no dirty stale-base blocker was reported.

## Intended Scope

- Planned Write Set: shared canonical render containment code, affected design-system assets, focused visual regression tests, and issue-reconciliation note.
- Expected Maintained Artifacts: issue reconciliation note and any directly affected design-system verification wording.
- Known Shared Seams: `/design-system/canonical-renderings/*`, context-nav drawer host behavior, async activity drawer render behavior, canonical overlay containment helpers.
- Explicit Non-Goals: real-app UI adoption, app-page CSS, unrelated restyling, and broad redesign of drawer semantics.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only if required by a later promoted dependency; record that decision here if it happens.
- Worktree Audit Result: `npm run git:worktree-audit` reported no dirty stale-base worktrees.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: Treat this as a candidate fix until the user confirms the rendered `:3000` surfaces now match the expected frame-contained behavior.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
