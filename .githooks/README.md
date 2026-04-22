# Repo Hooks

This repo ships a committed hooks path under `.githooks/`.

To enable it locally:

```bash
git config core.hooksPath .githooks
```

Current hook:

- `pre-commit`
  Blocks direct commits on `main`, then runs the frontend architecture ADR
  guard for staged changes.

The guard checks architecture-sensitive frontend changes and expects the same
change to include:

- `docs/architecture/frontend-overview.md`
- at least one ADR update under `docs/architecture/adr/`

If a change is intentionally architecture-neutral, you may bypass the hook with
`git commit --no-verify` after reviewing the docs impact explicitly.

## Guarded Codex Launcher

To make Codex run the repo preflight automatically before a session starts in
this repo, use the guarded launcher:

```bash
/home/gordon/kanbien/src/scripts/launchGuardedCodex.sh
```

The launcher runs:

```bash
npm run git:preflight
```

before delegating to the real `codex` binary. If the repo is in a blocked
state, Codex will not start for that session.

If you want that behavior by default in your shell, add a personal alias or
function that points your normal Codex launch command at this script.
