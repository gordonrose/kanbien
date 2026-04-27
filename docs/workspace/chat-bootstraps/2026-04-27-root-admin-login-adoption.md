# Chat Branch Bootstrap Template

## Chat Bootstrap

- Date: 2026-04-27
- Chat Scope: Replace the legacy root-admin login surface with the governed design-system login behavior while preserving existing root-auth backend semantics.
- Chat Slug: root-admin-login-adoption
- Reason For Isolation: Root-admin app adoption touches governed frontend seams and may overlap with existing login-template and root-admin work in other worktrees.

## Git Start Point

- Base Commit: 6ba2ff44c9212149ed85b1b45683b324254a8612
- Base Ref: origin/main
- Source Branch At Bootstrap Time: codex/login-template-page
- Bootstrap Command Or Method: `git worktree add -b codex/root-admin-login-adoption /tmp/kanbien-root-admin-login-adoption origin/main`

## Dedicated Isolation

- Dedicated Branch: codex/root-admin-login-adoption
- Dedicated Worktree Path: /tmp/kanbien-root-admin-login-adoption
- Preflight Command: `npm run git:preflight`
- Parallel Chats Known At Bootstrap Time: Worktree audit reported dirty base-aligned worktrees for `codex/login-template-page` and `codex/root-admin-list-form`, plus two clean stale-base admin-profile-logo worktrees; no dirty stale-base blockers.

## Intended Scope

- Planned Write Set: Root-admin login markup and controller wiring, focused root-admin login adoption tests, and required design-system adoption or verification artifacts for the app consumer.
- Expected Maintained Artifacts: Login-template app adoption contract updates, root-admin consumer verification notes or tests, and any source-independent docs whose current-state wording changes.
- Known Shared Seams: `/root-admin` shell HTML and controller, existing root-auth browser login endpoints, design-system login-template render/controller seams, and governed frontend verification artifacts.
- Explicit Non-Goals: Changing root-auth API contracts, changing session/token semantics, adding new login providers, changing asset handling, or adopting app-page CSS outside an approved design-system seam.

## Coordination Notes

- Rebase Policy For This Chat: Rebase only with an explicit recorded decision if `origin/main` advances or another worktree becomes a dependency.
- Worktree Audit Result: `npm run git:worktree-audit` reported no dirty stale-base worktrees before this worktree was created.
- Commit Approval Posture: Do not commit without explicit user approval.
- Push Or PR Posture: Do not push or open a PR unless requested.
- Handoff Notes: If the design-system login-template source remains only in another dirty worktree, either integrate that source through an approved dependency decision or stop before duplicating governed markup/controller logic in root-admin.

## Outcome

- Final Branch Used: codex/root-admin-login-adoption
- Final Base Commit If Changed: unchanged
- Follow-Up Integration Notes: Root-admin login now consumes the design-system
  `loginTemplate.mjs` render/controller seam; focused integration and browser
  login adoption checks pass. Full root-admin parity spec still has unrelated
  authenticated shell/list-page failures in the existing file and should be
  reconciled separately.
