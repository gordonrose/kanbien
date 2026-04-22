# Git Workflow Guardrails

This standard exists to prevent the specific failure mode where:

- material work starts in a dirty mixed worktree
- branch identity no longer matches task identity
- local `main` silently drifts away from `origin/main`
- promotion or merge work happens against the wrong baseline
- the operator loses track of what is local-only, committed, merged, or pushed

Use these guardrails before material implementation, before committing scoped
work, and especially before any promotion or merge-to-main step.

## Baseline Truth

For promotion decisions, treat `origin/main` as the source of truth.

Do not assume local `main` is current just because the branch is named `main`.

If local `main` and `origin/main` differ:

- local `main` is stale until explicitly realigned
- no promotion or merge work should continue against local `main`
- use a clean branch or worktree based on `origin/main` instead

## Required Checks

Before material work begins, run:

```bash
npm run git:preflight
```

Before promotion or merge planning, run:

```bash
npm run git:promote -- --source <branch-or-commit>
```

These scripts are not optional advisory helpers. They are the required first
check when the task is material.

## Material-Work Start Gate

Material work must not begin until all of the following are true:

- the current worktree is clean, or the current dirty state is explicitly owned
  by the task
- the current task has a dedicated branch
- the current task has a bootstrap artifact when the task is large enough to
  overlap with other chats or shared seams
- local `main` matches `origin/main`, unless a clean `origin/main`-based
  worktree is being used for isolation

If `npm run git:preflight` returns a blocking status, stop and fix the repo
state before implementation continues.

## Bootstrap Requirement

For material work with any realistic overlap risk, create a bootstrap artifact
before editing:

- preferred path:
  `docs/workspace/chat-bootstraps/<date>-<slug>.md`
- preferred template:
  `docs/templates/chat-branch-bootstrap-template.md`

Minimum bootstrap fields:

- task scope
- explicit base commit
- source branch at bootstrap time
- dedicated branch
- worktree path
- intended write set
- known shared seams

## Dirty Worktree Rule

If unrelated dirty changes are present, do not silently continue with new
material work.

Allowed next actions:

- commit the existing work
- stash it
- back it up
- move to a dedicated worktree
- stop and ask for direction

Do not treat a dirty worktree as harmless background noise.

## Main Branch Rule

Do not perform material implementation directly on `main`.

If `npm run git:preflight` reports `MAIN_BRANCH_BLOCK`, create a dedicated task
branch before continuing.

## Promotion Rule

Promotion work must not proceed until:

- the promotion worktree is clean
- the target branch tip matches `origin/main`
- the source work is either:
  - a descendant of `origin/main`, so fast-forward is honest
  - or an explicitly scoped commit set ready for cherry-pick

If `npm run git:promote` returns:

- `TARGET_STALE_BLOCK`
  realign local `main` to `origin/main`
- `CHERRY_PICK_REQUIRED`
  promote with a clean `origin/main`-based branch and cherry-pick the scoped
  commit set
- `DIRTY_BLOCK`
  clean or isolate the current worktree first

## Human-Friendly Repo Check

When the repo feels confusing, stop and confirm:

- current branch
- whether the worktree is clean
- whether local `main` equals `origin/main`
- whether the current branch is really dedicated to the task
- whether the task’s bootstrap names the same intended write set you are
  actually editing

The fix for confusion is not more guessing. The fix is re-establishing the
baseline truth explicitly.
