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

## Task Start Recommendation

Phase 3 adds a conservative task-entry helper:

```bash
npm run codex:task -- --slug <task-slug> --scope "Short scope"
npm run codex:task -- --slug <task-slug> --write-set "src/scripts/**,docs/workspace/**"
npm run codex:task -- --slug <task-slug> --shared-seam "git workflow guardrails"
```

Current phase-3 recommendations:

- `REUSE_EXISTING_TASK`
  an attached task already exists for the same slug or overlapping seam
- `RESUME_EXISTING_TASK`
  an unattached branch already exists for the same slug or overlapping seam
- `INSPECT_OVERLAPPING_TASKS`
  multiple existing tasks overlap the requested seam, so a human decision is
  needed before creating anything new
- `RETIRE_STALE_FIRST`
  one or more finished task lines should be retired before creating another
- `CREATE_NEW_TASK`
  no exact or overlapping task was found, so a new isolated task would be
  reasonable
- `INPUT_BLOCK`
  the request did not provide enough information, currently a missing slug

## Tangent Split

Phase 4 adds an explicit tangent-splitting helper:

```bash
npm run codex:split -- --from <task-id> --slug <child-slug> --scope "Child scope"
npm run codex:split -- --from <task-id> --slug <child-slug> --reason "Why the tangent deserves its own line" --apply
```

Current phase-4 statuses:

- `READY_TO_SPLIT`
  the parent task resolved, the baseline is clean, and a child task can be
  created safely
- `SPLIT_CREATED`
  the child branch/worktree/bootstrap note were created
- `APPLY_FAILED`
  the split was valid in principle, but git or filesystem creation failed
- `INPUT_BLOCK`
  the request is missing `--from` or `--slug`
- `SOURCE_TASK_NOT_FOUND`
  the requested parent task was not found in the current inventory
- `SOURCE_TASK_BLOCK`
  the requested parent was invalid for splitting, currently the integration
  home
- `BASELINE_BLOCK`
  local `main` is not clean and synced with `origin/main`
- `CHILD_TASK_EXISTS_BLOCK`
  the requested child branch already exists
- `WORKTREE_PATH_BLOCK`
  the requested child worktree path already exists

`--apply` only creates the child task when the status is already
`READY_TO_SPLIT`.

## Task-Aware Promotion

Phase 5 adds a task-aware promotion helper:

```bash
npm run codex:promote-task -- --task <task-id>
npm run codex:promote-task -- --task <task-id> --apply
```

Current phase-5 statuses:

- `READY_TO_PROMOTE`
  the task resolved and the existing git promotion guardrail says it can be
  fast-forwarded onto local `main`
- `PROMOTED_LOCALLY`
  local `main` was fast-forwarded and the command reports the changed files and
  diff stat for review
- `APPLY_FAILED`
  the task was promotable in principle, but the local fast-forward failed
- `TASK_NOT_FOUND`
  the requested task id or branch did not resolve
- `TASK_BLOCK`
  the requested task is invalid for task-aware promotion, currently the
  integration home
- `PROMOTE_GUARDRAIL_BLOCK`
  the underlying git promotion guardrail blocked the promotion and its
  recommendations should be followed

`--apply` only performs the local promotion when the task is already
`READY_TO_PROMOTE`.

## Local Review And Push

Phase 6 adds explicit post-promotion helpers:

```bash
npm run codex:review-promotion -- --task <task-id>
npm run codex:push-reviewed -- --task <task-id>
npm run codex:push-reviewed -- --task <task-id> --apply
```

Current phase-6 review statuses:

- `READY_FOR_REVIEW`
  the task appears on local `main` ahead of `origin/main`, so the changed files
  and commits can be reviewed
- `NO_LOCAL_PROMOTION`
  the task is not currently represented by a local-only promotion on `main`
- `TASK_NOT_FOUND`
  the requested task id or branch did not resolve
- `TASK_BLOCK`
  the requested task is invalid for this command, currently the integration
  home

Current phase-6 push statuses:

- `READY_TO_PUSH`
  the task appears as a reviewed local-only promotion on `main`
- `PUSHED`
  local `main` was pushed to `origin/main`
- `APPLY_FAILED`
  the reviewed push failed during execution
- `TASK_NOT_FOUND`
  the requested task id or branch did not resolve
- `TASK_BLOCK`
  the requested task is invalid for this command, currently the integration
  home
- `REVIEW_BLOCK`
  the task does not currently appear as a reviewed local-only promotion on
  `main`

`codex:push-reviewed --apply` only pushes when the status is already
`READY_TO_PUSH`.
