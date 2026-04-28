# Chat Bootstrap

- Date: 2026-04-28
- Chat Scope: Form-family image card design-system component
- Chat Slug: form-image-card
- Reason For Isolation: Material governed design-system component work.

## Git Start Point

- Base Commit: 16ea6704bf19be8b4e6350e9c06a1af8f44cefcc
- Base Ref: origin/main
- Source Branch At Bootstrap Time: codex/upload-accessibility-modal
- Bootstrap Command Or Method: `git switch -c codex/form-image-card origin/main`; later reset to current `origin/main` and reapplied WIP after stale-base cleanup.

## Dedicated Isolation

- Dedicated Branch: codex/form-image-card
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Existing repo worktrees may be active; this slice is scoped to form-family design-system artifacts.

## Intended Scope

- Planned Write Set: form-family component renderer/styles, design-system component route or form-family preview surface, behavior/reference docs, focused visual tests.
- Expected Maintained Artifacts: child behavior lock and reference pack notes for the new form image card seam.
- Known Shared Seams: `src/frontend/designSystem/assets/formControls.mjs`, `src/frontend/designSystem/assets/styles.css`, form-template canonical tests.
- Explicit Non-Goals: no real-app adoption, no asset upload/read policy changes, no backend asset contract changes.

## Coordination Notes

- Rebase Policy For This Chat: Rebase or promote only through repo guardrails if upstream work lands first.
- Worktree Audit Result: Rerun during cleanup after upstream moved; stale-base WIP was preserved in a stash and reapplied onto current `origin/main`.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push unless requested.
- Handoff Notes: Keep this as a governed form-parent child component.

## Outcome

- Final Branch Used: codex/form-image-card
- Final Base Commit If Changed: 16ea6704bf19be8b4e6350e9c06a1af8f44cefcc
- Follow-Up Integration Notes: Pending implementation and verification.
