# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-05-29
- Chat Scope: Govern the entity page header readiness/status primitive after the page-header structure token.
- Chat Slug: entity-page-header-status-primitive
- Reason For Isolation: Continue design-system header work as a separate checkpoint while another device may work on entity page form components.

## Git Start Point

- Base Commit: 52872bc
- Base Ref: origin/main
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git switch -c codex/entity-page-header-status-primitive origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/entity-page-header-status-primitive
- Dedicated Worktree Path: /home/gordo/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Entity page form component work on another device.

## Intended Scope

- Planned Write Set: Layer 3 readiness/status primitive contract, default proof, runtime seam, readiness index, focused tests, and route proof only.
- Expected Maintained Artifacts: `docs/design-system/03-primitive/**`, `src/frontend/designSystem/layers/03-primitive/**`, `src/frontend/designSystem/systems/default/primitives/**`, `src/frontend/designSystem/systems/default/assets/styles.css`, `tests/unit/designSystem/**`, and `tests/visual/designSystem/primitives/**`.
- Known Shared Seams: `entity-page-header` behavior rule, `page-header-structure` token, `label-text-style` token, and `truncating-label` primitive if later status text disclosure is needed.
- Explicit Non-Goals: Badge styling, coloured status chips, icons, app adoption, app-page CSS, form component work, backend behavior, persistence, and Layer 4 header composition.

## Coordination Notes

- Rebase Policy For This Chat: Fetch `origin/main` and rebase before each commit-sized checkpoint if remote main moves.
- Worktree Audit Result: Pending for this checkpoint after edits.
- Commit Approval Posture: Do not commit until the user approves the scoped chunk.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: Keep the first primitive text-backed so the populated header pattern can communicate status without inventing unsigned badge visuals.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
