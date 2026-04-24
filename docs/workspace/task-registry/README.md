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
npm run codex:retire -- --task <task-id>
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

## Retirement

Phase 2 adds a conservative retirement helper:

```bash
npm run codex:retire -- --task <task-id>
npm run codex:retire -- --task <task-id> --apply
```

Current phase-2 retirement statuses:

- `SAFE_TO_RETIRE`
  no unique patch content and no local dirty state remain
- `INSPECT_REQUIRED`
  no unique committed patch content remains, but local worktree changes still
  need a human decision
- `UNIQUE_CONTENT_BLOCK`
  the task still carries unique patch content and should not be retired yet
- `INTEGRATION_HOME_BLOCK`
  the integration home cannot be retired
- `CURRENT_WORKTREE_BLOCK`
  the requested task resolves to the current worktree, so retirement must be
  run from another checkout
- `TASK_NOT_FOUND`
  the requested task id or branch did not resolve

`--apply` only performs the retirement when the task is already classified as
`SAFE_TO_RETIRE`.
