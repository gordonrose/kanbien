# Repo Hooks

This repo ships a committed hooks path under `.githooks/`.

To enable it locally:

```bash
git config core.hooksPath .githooks
```

Current hook:

- `pre-commit`
  Runs the frontend architecture ADR guard for staged changes.

The guard checks architecture-sensitive frontend changes and expects the same
change to include:

- `docs/architecture/frontend-overview.md`
- at least one ADR update under `docs/architecture/adr/`

If a change is intentionally architecture-neutral, you may bypass the hook with
`git commit --no-verify` after reviewing the docs impact explicitly.
