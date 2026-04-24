# Task Registry

This directory is the machine-readable anchor for the repo's Codex task
lifecycle workflow.

Phase 1 does not yet automate task creation, promotion, or retirement. It
introduces:

- a generated inventory of currently live task worktrees and unattached
  `codex/*` branches
- a conservative state classifier
- a recommendation field that makes stale or merge-ready task lines visible

Current generated artifact:

- `current-tasks.generated.json`

The inventory is produced by:

```bash
npm run codex:tasks
npm run codex:tasks:write
```

Current phase-1 state values are intentionally narrow:

- `integration_home`
  `/home/gordon/kanbien` on `main`; this is the local integration home
- `active`
  the task still appears to carry unique patch content
- `inspect`
  the task has no unique patch content but still has local dirty state that
  needs review
- `retire_now`
  the task is clean and no longer carries unique patch content

This directory is expected to expand in later phases to include:

- explicit task records
- parked / blocked / promoted / retired lifecycle states
- task parent-child links for tangent splitting
- review-local-promotion state and metadata
