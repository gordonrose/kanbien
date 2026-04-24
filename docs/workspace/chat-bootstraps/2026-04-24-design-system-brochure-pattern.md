# Chat Bootstrap

- Date: 2026-04-24
- Chat Scope: Add a governed brochure pattern page to `/design-system`.
- Chat Slug: design-system-brochure-pattern
- Reason For Isolation: The primary worktree is dirty with unrelated icon-picker canonical work, so this chat uses a dedicated worktree from `origin/main`.

## Git Start Point

- Base Commit: 0745377
- Source Branch At Bootstrap Time: origin/main
- Bootstrap Command Or Method: `git worktree add -b codex/design-system-brochure-pattern /tmp/kanbien-design-system-brochure-pattern origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/design-system-brochure-pattern
- Dedicated Worktree Path: /tmp/kanbien-design-system-brochure-pattern
- Parallel Chats Known At Bootstrap Time: Existing dirty branch `codex/icon-picker-canonical-bugs` in `/home/gordon/kanbien`.

## Intended Scope

- Planned Write Set: Design-system brochure pattern route, shared design-system assets if needed, pattern index/discovery wiring, and targeted visual verification artifacts for the new pattern page.
- Expected Maintained Artifacts: This bootstrap record and any design-system pattern behavior/reference/verification artifacts required by the existing repo conventions for pattern pages.
- Known Shared Seams: `/design-system` router/discovery, design-system shared CSS, visual preview server routes.
- Explicit Non-Goals: Real app page adoption, app-page CSS, backend/API changes, migrations, and unrelated icon-picker canonical work.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only with explicit decision if another chat lands conflicting design-system changes.
- Commit Approval Posture: Do not commit until the user explicitly approves.
- Push Or PR Posture: Do not push or open a PR unless the user asks.
- Handoff Notes: Keep the brochure pattern isolated from existing icon-picker work.

## Outcome

- Final Branch Used: codex/design-system-brochure-pattern
- Final Base Commit If Changed: unchanged from 0745377
- Follow-Up Integration Notes: New brochure pattern page remains design-system-only and awaits human visual signoff before any app or public-page adoption.
