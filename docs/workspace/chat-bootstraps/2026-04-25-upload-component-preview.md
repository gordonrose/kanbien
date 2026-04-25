# Chat Branch Bootstrap

## Chat Bootstrap

- Date: 2026-04-25
- Chat Scope: Add preview variations to the governed UploadFile design-system component.
- Chat Slug: upload-component-preview
- Reason For Isolation: Material design-system, canonical, test, migration, and documentation work needs a clean task branch separate from the dirty root worktree and other active chats.

## Git Start Point

- Base Commit: `72591e5cb928b8abe33beef61861d8ec4bb3e475`
- Source Branch At Bootstrap Time: `origin/main`
- Bootstrap Command Or Method: `git worktree add -b codex/upload-component-preview /tmp/kanbien-upload-component-preview origin/main`

## Dedicated Isolation

- Dedicated Branch: `codex/upload-component-preview`
- Dedicated Worktree Path: `/tmp/kanbien-upload-component-preview`
- Parallel Chats Known At Bootstrap Time: Existing dirty root branch `codex/production-readiness-roadmap-skill`; existing worktrees for asset foundation, form upload component, job-processing foundation/planning, and BullMQ adapter work.

## Intended Scope

- Planned Write Set: UploadFile design-system render/controller/CSS, generated upload-file canonical seed migration, visual tests, and UploadFile design-system artifacts.
- Expected Maintained Artifacts: UploadFile behavior lock, reference/verification wording where the preview contract changes, and this bootstrap record.
- Known Shared Seams: `src/frontend/designSystem/assets/formControls.mjs`, `src/frontend/designSystem/assets/styles.css`, generated design-system canonical seed migrations, and upload-file visual specs.
- Explicit Non-Goals: Backend asset upload APIs, object-storage provider behavior, malware scanning, durable asset records, or real-app adoption.

## Coordination Notes

- Rebase Policy For This Chat: Keep the branch based on the recorded `origin/main` unless an integration owner asks for a rebase.
- Commit Approval Posture: Do not commit until the user explicitly approves.
- Push Or PR Posture: Do not push or open a PR unless the user asks.
- Handoff Notes: The preview is design-system-local and does not approve production asset delivery policy.

## Outcome

- Final Branch Used: `codex/upload-component-preview`
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
