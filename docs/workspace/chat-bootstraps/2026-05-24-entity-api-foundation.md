# Chat Branch Bootstrap

- Date: 2026-05-24
- Chat Scope: Create the first root-only `/entity` backend API feature for entity CRUD.
- Chat Slug: entity-api-foundation
- Reason For Isolation: The main checkout contains unrelated dirty design-system work; this feature needs clean backend, migration, test, and artifact changes.

## Git Start Point

- Base Commit: adedfd7
- Base Ref: origin/main
- Source Branch At Bootstrap Time: design-system-structure-foundations
- Bootstrap Command Or Method: `git worktree add -b codex/entity-api-foundation /tmp/kanbien-entity origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/entity-api-foundation
- Dedicated Worktree Path: /tmp/kanbien-entity
- Preflight Command: `npm run git:preflight` passed after linking existing `node_modules`.
- Parallel Chats Known At Bootstrap Time: Existing dirty design-system work in `/home/gordon/kanbien`.

## Intended Scope

- Planned Write Set: `src/features/entity/**`, route mounting, migrations, focused tests, API/data-dictionary/feature docs, feature manifest, generated dependency graph if required.
- Expected Maintained Artifacts: API contract, data dictionary entry, feature docs/status notes as applicable, feature manifest, migration harness references, permission/capability records if new keys are added.
- Known Shared Seams: v1 router, root authz capabilities, Postgres migration harness, feature manifest dependency graph.
- Explicit Non-Goals: No frontend, no replacement or removal of `entityBuilder`, `webAppHierarchyBuilder`, `webAppSurfaceDiscovery`, or `webAppPageSettings`; no deterministic route/relationship/attribute generation yet.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only if needed after user approval or upstream conflict.
- Worktree Audit Result: Isolated worktree preflight safe.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push or open PR unless requested.
- Handoff Notes: Treat `/entity` as the platform self-definition seed; first version remains narrow CRUD with `draft`, `active`, `superseded`, and `archived` status.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
