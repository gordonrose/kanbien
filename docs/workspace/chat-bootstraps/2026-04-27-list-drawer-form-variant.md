# Chat Bootstrap

- Date: 2026-04-27
- Chat Scope: Add a design-system variation of the list drawer for create/edit entity forms.
- Chat Slug: list-drawer-form-variant
- Reason For Isolation: Material governed frontend design-system work should happen on a scoped branch with an explicit base.

## Git Start Point

- Base Commit: 0976da1499b70133223c70c1a390d649d0ea9bf4
- Base Ref: origin/main
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git checkout -b codex/list-drawer-form-variant origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/list-drawer-form-variant
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Worktree audit found separate clean and dirty worktrees, with no blocking dirty stale-base worktrees.

## Intended Scope

- Planned Write Set: Design-system list drawer source, canonical/reference artifacts, focused frontend tests, and maintained docs required by the design-system loop.
- Expected Maintained Artifacts: Behavior lock, reference/canonical surface or checklist updates for the new form-drawer variation, plus any impacted generated or manifest artifacts discovered during implementation.
- Known Shared Seams: Governed design-system drawer/list drawer family, design-system route registration, frontend visual verification.
- Explicit Non-Goals: Real app page adoption, backend route changes, persistence changes, public API changes, asset upload/read changes.

## Coordination Notes

- Rebase Policy For This Chat: Rebase or restart only after an explicit decision if another chat changes the same governed drawer seams.
- Worktree Audit Result: `npm run git:worktree-audit` reported no blocking dirty stale-base worktrees.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: Treat this as upstream design-system governance work before any app UI consumes the pattern.

## Outcome

- Final Branch Used: codex/list-drawer-form-variant
- Final Base Commit If Changed: unchanged
- Follow-Up Integration Notes: First governed preview implemented for list
  drawer create/edit form states. Additional RTL, mobile, magnified, error,
  and disabled captures remain follow-ups before sign-off-grade component
  promotion.
