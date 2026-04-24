# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-24
- Chat Scope: Port the next form/settings design-system canonical families to generated canonical renderings.
- Chat Slug: canonical-renderings-form-settings
- Reason For Isolation: Material frontend, migration, verification, and maintained-artifact work should stay isolated from the completed list-family rendering slice.

## Git Start Point

- Base Commit: 074537719f111b210e90eb15ee876f67228bec6b
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git checkout -b codex/canonical-renderings-form-settings`

## Dedicated Isolation

- Dedicated Branch: codex/canonical-renderings-form-settings
- Dedicated Worktree Path: /home/gordon/kanbien
- Parallel Chats Known At Bootstrap Time: None active in this workspace.

## Intended Scope

- Planned Write Set: Design-system canonical governance migration seed, generated route wiring, canonical launcher/render routing, family controllers for icon-grid/form-template/display-settings as applicable, focused visual/integration verification, and design-system verification notes.
- Expected Maintained Artifacts: Design-system canonical migration SQL, visual/integration tests, verification checklists, and this bootstrap record.
- Known Shared Seams: `/design-system/canonical-renderings` generated launcher, design-system router, governed shell/top-nav guard, design-system canonical public API payloads.
- Explicit Non-Goals: Do not touch navigation-shell/context-nav/sub-nav/hierarchy-tree canonical migrations in this slice; do not add app-page CSS or app adoption work.

## Coordination Notes

- Rebase Policy For This Chat: Re-run preflight before commit or promotion; rebase only if a later promoted task changes the shared design-system seams.
- Commit Approval Posture: Wait for explicit user approval before committing.
- Push Or PR Posture: Do not push unless requested.
- Handoff Notes: This slice starts after local `main` was fast-forwarded and pushed to `origin/main` at 074537719f111b210e90eb15ee876f67228bec6b.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
