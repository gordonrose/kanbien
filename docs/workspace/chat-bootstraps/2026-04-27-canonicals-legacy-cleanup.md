# Chat Bootstrap

- Date: 2026-04-27
- Chat Scope: Mark legacy `/design-system/canonicals` routes as compatibility surfaces and keep `/design-system/canonical-renderings` as canonical truth.
- Chat Slug: canonicals-legacy-cleanup
- Reason For Isolation: Material design-system route, docs, and test cleanup after persistence-backed canonical-renderings became the durable source of truth.

## Git Start Point

- Base Commit: `c00fd89c7a6db4aa46fcf2feebf5d62de063ee96`
- Base Ref: `origin/main`
- Source Branch At Bootstrap Time: `main`
- Bootstrap Command Or Method: `git switch -c codex/canonicals-legacy-cleanup`

## Dedicated Isolation

- Dedicated Branch: `codex/canonicals-legacy-cleanup`
- Dedicated Worktree Path: `/home/gordon/kanbien`
- Preflight Command: `npm run git:preflight` returned `SAFE` after branch creation.
- Parallel Chats Known At Bootstrap Time: stale tenant logo WIP was stashed as `postponed tenant branding logo WIP`; remaining worktrees are clean.

## Intended Scope

- Planned Write Set: legacy `/design-system/canonicals` launcher copy and links, design-system canonical docs, and targeted tests that encode migration posture.
- Expected Maintained Artifacts: API contract, feature docs, design-system governance docs, and visual/integration test expectations touched by the route posture.
- Known Shared Seams: design-system router/navigation, generated canonical-renderings projection APIs, web app hierarchy canonical rendering sync.
- Explicit Non-Goals: removing legacy routes outright, changing generated canonical-renderings persistence, tenant branding work, app UI adoption changes, or committing without approval.

## Coordination Notes

- Rebase Policy For This Chat: Re-run preflight and worktree audit before promotion if baseline advances.
- Worktree Audit Result: `npm run git:worktree-audit` reported no dirty stale-base worktrees after stashing postponed tenant branding WIP.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push unless requested; follow repo promotion guardrails if asked to ship.
- Handoff Notes: Treat `/design-system/canonicals` as compatibility-only unless the user approves full route retirement.

## Outcome

- Final Branch Used: `codex/canonicals-legacy-cleanup`
- Final Base Commit If Changed: unchanged
- Follow-Up Integration Notes: Legacy `/design-system/canonicals` routes remain
  available, but the index and docs now classify them as compatibility-only.
  Generated canonical families should publish through
  `/design-system/canonical-renderings`.
