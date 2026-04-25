# Chat Bootstrap

- Date: 2026-04-25
- Chat Scope: Add a governed upload/drop field to the design-system form template.
- Chat Slug: form-upload-component
- Reason For Isolation: The main checkout was blocked by unrelated job-processing planning changes, so this chat uses a clean worktree from `origin/main`.

## Git Start Point

- Base Commit: `308d6702b111676fbab76c3be1486f55917b7aa8`
- Source Branch At Bootstrap Time: `origin/main`
- Bootstrap Command Or Method: `git worktree add -b codex/form-upload-component /tmp/kanbien-form-upload-component origin/main`

## Dedicated Isolation

- Dedicated Branch: `codex/form-upload-component`
- Dedicated Worktree Path: `/tmp/kanbien-form-upload-component`
- Parallel Chats Known At Bootstrap Time: Unrelated job-processing planning work in `/home/gordon/kanbien`.

## Intended Scope

- Planned Write Set: `src/frontend/designSystem/templates/form/index.html`, design-system form CSS/JS assets, form-template tests, and form-template design-system governance docs.
- Expected Maintained Artifacts: Form-template behavior lock, reference pack, verification checklist, and bootstrap note.
- Known Shared Seams: Design-system shared stylesheet, generated canonical render route for `form-template`, form-template parent behavior lock.
- Explicit Non-Goals: Backend asset upload APIs, real file persistence, root-admin app adoption, and a standalone child-seam extraction.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only with explicit coordination if another chat lands on the same design-system form-template seams.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: Treat this as parent-form-template design-system work until a later upload-field child seam is approved.

## Outcome

- Final Branch Used: `codex/form-upload-component`
- Final Base Commit If Changed: Base stayed `308d6702b111676fbab76c3be1486f55917b7aa8`; `origin/main` advanced during the chat and should be reviewed before promotion.
- Follow-Up Integration Notes: Upload field implementation, `FTR-020` / `FTR-021` canonical refs, and parent form-template artifact updates are in this worktree. Typecheck still reports pre-existing generated-canonical typing issues outside the upload write set.
