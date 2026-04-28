# Chat Bootstrap

- Date: 2026-04-28
- Chat Scope: Make context-nav projection use the current page owner's settings so sibling pages inherit the same parent-owned nav, and expose top-level child assignment through the governed hierarchy workspace.
- Chat Slug: context-nav-parent-owner-settings
- Reason For Isolation: Material backend, test, and contract documentation change touching a governed navigation seam.

## Git Start Point

- Base Commit: 241f4e9e722b3b75ae067396bf5ba5ae7c1471a8
- Base Ref: origin/main
- Source Branch At Bootstrap Time: main
- Bootstrap Command Or Method: `git checkout -b codex/context-nav-parent-owner-settings`

## Dedicated Isolation

- Dedicated Branch: codex/context-nav-parent-owner-settings
- Dedicated Worktree Path: /home/gordon/kanbien
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: `npm run git:worktree-audit` reported no dirty stale-base worktrees; several clean stale-base worktrees exist under `/tmp`.

## Intended Scope

- Planned Write Set: `src/features/webAppPageSettings/domain/getWebAppPageContextNavProjection.ts`, `src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs`, focused web-app-page-settings and root-admin visual tests, API/feature docs, this bootstrap record.
- Expected Maintained Artifacts: Web app page settings API contract and feature documentation if endpoint semantics change.
- Known Shared Seams: `webAppPageSettings` projection endpoint, root-admin context-nav app consumption, web app hierarchy public seam.
- Explicit Non-Goals: Do not redesign context-nav visual behavior, add app-page CSS, or bypass the hierarchy move seam for topology changes.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only if promotion guardrails require it or if another chat lands a directly conflicting shared-seam change.
- Worktree Audit Result: No blocking dirty stale-base worktrees.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: The semantic change is compatibility-sensitive because existing page-owned context-nav rows may now be read through a parent-owned rule.

## Outcome

- Final Branch Used: codex/context-nav-parent-owner-settings
- Final Base Commit If Changed: unchanged; 241f4e9e722b3b75ae067396bf5ba5ae7c1471a8
- Follow-Up Integration Notes: Projection now reads context-nav rows from
  `currentPage.parentPageId ?? currentPage.webAppPageId`; focused unit,
  integration, frontend visual, and typecheck verification passed before
  handoff. Top-level child assignment uses the existing hierarchy move API
  from a separate structure-owned drawer-select.
