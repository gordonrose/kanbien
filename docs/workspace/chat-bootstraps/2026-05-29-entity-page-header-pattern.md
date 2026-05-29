# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-05-29
- Chat Scope: Govern the entity page header pattern from the existing page-header token evidence.
- Chat Slug: entity-page-header-pattern
- Reason For Isolation: Design-system work is also happening on another device, so this stream needs a narrow branch and frequent sync checks.

## Git Start Point

- Base Commit: 49a80de
- Base Ref: origin/main
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git switch -c codex/entity-page-header-pattern origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/entity-page-header-pattern
- Dedicated Worktree Path: /home/gordo/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Entity page form component work on another device.

## Intended Scope

- Planned Write Set: Layer 4 design-system pattern contract, default-system proof artifacts or route only if gates pass, focused tests, readiness indexes, and design-system documentation directly required for the entity page header pattern.
- Expected Maintained Artifacts: `docs/design-system/04-pattern-contract/**`, `docs/design-system/04-pattern-contract/pattern-readiness-index.md`, and any matching `src/frontend/designSystem/layers/04-pattern-contract/**` or `src/frontend/designSystem/systems/default/patterns/**` proof files if implementation proceeds.
- Known Shared Seams: `src/frontend/designSystem/tokens/page-header/index.html`, page-header token CSS, list-page pattern header slots, icon-button primitives, dropdown primitives, text/header tokens, and entity page outer behavior locks.
- Explicit Non-Goals: App adoption, app-page CSS, form component work, backend behavior, persistence, root-admin route changes, and redefining page-header token values.

## Coordination Notes

- Rebase Policy For This Chat: Fetch `origin/main` and rebase before each commit-sized checkpoint if remote main moves.
- Worktree Audit Result: `npm run git:worktree-audit` reported one clean worktree at base 49a80de.
- Commit Approval Posture: Do not commit until the user approves the finished scoped chunk.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: Start with the layer-work preflight and keep the first implementation boundary at Layer 4 unless a missing Layer 2 or Layer 3 seam blocks the work.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
