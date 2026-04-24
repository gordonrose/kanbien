# Chat Branch Bootstrap

- Date: 2026-04-24
- Chat Scope: Brochure pattern drawer display controls
- Chat Slug: brochure-drawer-display-controls
- Reason For Isolation: Material design-system refinement on an existing governed brochure pattern drawer.

## Git Start Point

- Base Commit: 0f6c31bd4c793371e4562ff5e7eb707d7e2b5482
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git checkout -b codex/brochure-drawer-display-controls`

## Dedicated Isolation

- Dedicated Branch: codex/brochure-drawer-display-controls
- Dedicated Worktree Path: /home/gordon/kanbien
- Parallel Chats Known At Bootstrap Time: Unknown; isolated from clean synced `main`.

## Intended Scope

- Planned Write Set: Brochure pattern design-system source, focused tests or verification artifacts if required.
- Expected Maintained Artifacts: Existing brochure pattern behavior/canonical artifacts only if the runtime control truth changes their documented contract.
- Known Shared Seams: `/design-system` brochure pattern route and existing drawer behavior.
- Explicit Non-Goals: New drawer creation, global theme configuration, app-page CSS, unrelated design-system cleanup.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only with explicit coordination if another chat lands overlapping design-system changes.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: Keep controls brochure-specific, runtime-backed by CSS variables on the brochure preview, and reversible.

## Outcome

- Final Branch Used: codex/brochure-drawer-display-controls
- Final Base Commit If Changed: unchanged
- Follow-Up Integration Notes: Brochure drawer controls remain design-system-only and scoped to `[data-brochure-preview]`; no global theme or app adoption work included.
