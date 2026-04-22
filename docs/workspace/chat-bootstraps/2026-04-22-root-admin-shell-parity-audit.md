# Chat Bootstrap

- Date:
  2026-04-22
- Chat Scope:
  Audit and correct governed post-login shell/page parity across the real app frontend, starting with `rootAdminShell`.
- Chat Slug:
  root-admin-shell-parity-audit
- Reason For Isolation:
  Material multi-file frontend and test work needs a dedicated GitHub-based branch and worktree so it does not build on dirty local `main`.

## Git Start Point

- Base Commit:
  `0d11aee4e052ba0a673383af8c648e07cb3e34d1`
- Source Branch At Bootstrap Time:
  `origin/main`
- Bootstrap Command Or Method:
  `git worktree add -b codex/root-admin-shell-parity-audit /home/gordon/kanbien-shell-parity-audit origin/main`

## Dedicated Isolation

- Dedicated Branch:
  `codex/root-admin-shell-parity-audit`
- Dedicated Worktree Path:
  `/home/gordon/kanbien-shell-parity-audit`
- Parallel Chats Known At Bootstrap Time:
  Unknown. Isolation chosen because the original checkout was on dirty local `main`.

## Intended Scope

- Planned Write Set:
  `src/frontend/rootAdminShell/**`, relevant shared design-system shell/page seams under `src/frontend/designSystem/assets/**` only if required for honest governed adoption, affected visual tests under `tests/visual/app/rootAdminShell/**`, and issue-reconciliation or parity docs under `docs/workspace/**`.
- Expected Maintained Artifacts:
  `docs/workspace/issue-reconciliations/*`, this chat bootstrap record, and any directly affected adoption/parity documentation if truth changes.
- Known Shared Seams:
  Signed-off page-shell and shell-chrome families, `rootAdminShell` route host framing, shared list-page/form-template adoption boundaries, and real-consumer parity coverage.
- Explicit Non-Goals:
  Backend contract changes, auth/session redesign, tenant-surface redesign, and unrelated design-system family iteration outside the shell/page parity defect.

## Coordination Notes

- Rebase Policy For This Chat:
  Stay on the recorded base unless a later explicit rebase onto newer GitHub truth is required and documented.
- Commit Approval Posture:
  No commits without explicit user approval.
- Push Or PR Posture:
  Do not push or open a PR unless explicitly requested.
- Handoff Notes:
  The original checkout `/home/gordon/kanbien` was blocked by `git:preflight` because it was dirty on local `main` and behind `origin/main`.

## Outcome

- Final Branch Used:
  `codex/root-admin-shell-parity-audit`
- Final Base Commit If Changed:
  `0d11aee4e052ba0a673383af8c648e07cb3e34d1`
- Follow-Up Integration Notes:
  Pending.
