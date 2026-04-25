# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-25
- Chat Scope: Prefer generated canonical-rendering URLs for already-generated design-system families.
- Chat Slug: canonical-renderings-link-migration
- Reason For Isolation: Material frontend/test/docs migration touching design-system static HTML, canonical-link tests, and maintained reconciliation notes.

## Git Start Point

- Base Commit: af0a3dd3d10afb7cc36fd575c3b5b638f3af3512
- Base Ref: origin/main
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git checkout -b codex/canonical-renderings-link-migration origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/canonical-renderings-link-migration
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: `npm run git:worktree-audit` reported no dirty stale-base worktrees.

## Intended Scope

- Planned Write Set: `src/frontend/designSystem/**/*.html`, relevant canonical-rendering tests, and workspace reconciliation/bootstrap docs.
- Expected Maintained Artifacts: Generated canonical-rendering route/link tests and migration/reconciliation notes.
- Known Shared Seams: Design-system canonical render link conventions and shared shell test coverage.
- Explicit Non-Goals: Removing or breaking legacy `/design-system/components/<family>?ref=...` compatibility routes.

## Coordination Notes

- Rebase Policy For This Chat: Rebase onto `origin/main` before promotion.
- Worktree Audit Result: Clean current worktree; no blocking dirty stale-base sibling worktrees.
- Commit Approval Posture: Commit only when the scoped migration and verification are ready.
- Push Or PR Posture: Promote and push only on explicit request.
- Handoff Notes: Keep persisted `showInTopNav` behavior authoritative; this slice only changes preferred canonical-render links.

## Outcome

- Final Branch Used: codex/canonical-renderings-link-migration
- Final Base Commit If Changed: unchanged; `af0a3dd3d10afb7cc36fd575c3b5b638f3af3512`
- Follow-Up Integration Notes: Preferred generated-family launcher links now target `/design-system/canonical-renderings/<family>/<ref>`; legacy component-query render URLs remain compatibility endpoints.
