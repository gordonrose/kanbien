---
name: branch-and-commit-governor
description: Use when the user wants cleaner git hygiene for ongoing work, especially automatic task-branch creation for material changes, approval-gated commits, scoped commit splitting, or a safer default workflow that avoids large mixed worktrees.
---

# Branch And Commit Governor

Use this skill when the user wants Codex to keep git state cleaner by default,
or when repo instructions about branching, committing, and pushing need to be
created or updated.

## Purpose

Keep implementation work isolated and easier to review by defaulting to:

1. dedicated task branches for material work
2. explicit approval before commits
3. scoped commits instead of mixed dump commits
4. push only when asked

## Default Workflow

Before the normal branch/commit loop, use a chat bootstrap when the task is
material and there is any realistic chance of parallel chat activity.

For this repo, the workflow must run the executable guardrails first:

- `npm run git:preflight`
- `npm run git:promote -- --source <branch-or-commit>` before promotion work

### 1. Classify the task

Decide whether the current task is:

- read-only or inspection-only
- a tiny local edit
- a material change across code, tests, docs, migrations, or artifacts

Only the material class should trigger automatic branch creation by default.

If the task is material, also decide whether:

- a dedicated worktree is required immediately
- an explicit base commit must be captured before any branch is created

### 2. Inspect git state before editing

Check:

- current branch
- whether the worktree is clean
- whether the existing branch is already a dedicated scoped task branch
- whether local `main` matches `origin/main`

If the worktree already has unrelated changes, do not silently continue into a
new mixed branch. Surface the state and ask how to proceed when separation is
not obvious.

Also check whether the branch is merely "related" versus truly dedicated. If
the current branch has moved because of another chat's commits, treat it as an
unsafe ambient base until proven otherwise.

If `npm run git:preflight` returns a blocking state, do not continue with
material edits until the repo state is repaired.

### 2A. Capture a chat bootstrap

For material work that may overlap with other chats:

1. capture the explicit base commit
2. prefer a dedicated worktree
3. create the dedicated branch from that base commit, not ambient `HEAD`
4. record the result in a short artifact

Preferred record path:

- `docs/workspace/chat-bootstraps/<date>-<slug>.md`

Preferred template:

- `docs/templates/chat-branch-bootstrap-template.md`

Minimum fields to record:

- scope
- base commit
- source branch at bootstrap time
- dedicated branch
- worktree path
- intended write set
- known shared seams

### 3. Create a task branch when appropriate

For material work on a non-dedicated branch, create a branch before editing.

Preferred branch shape:

- `codex/<scope>-<short-slug>`

Examples:

- `codex/root-admin-hierarchy-landing-page`
- `codex/design-system-top-nav-governance`
- `codex/tenant-auth-policy-harness-fix`

Keep names short, descriptive, and task-scoped.

When parallel chats are active, prefer:

- one dedicated worktree per material chat
- one dedicated branch per worktree

Do not create the new branch from ambient `HEAD` unless the bootstrap explicitly
records that choice.

Do not continue material implementation directly on `main`.

### 4. Do the work without auto-committing

Implementation success does not itself authorize a commit.

After the work is verified, stop short of committing until the user explicitly
approves with language such as:

- "looks good"
- "commit this"
- "ship it"
- "push it"

### 5. Commit only on approval

When the user approves:

- review `git status --short`
- split the work into logical commits when the diff naturally breaks apart
- keep unrelated local changes out of the commit
- prefer concise, scope-first commit messages

If the user approves a commit but not a push, commit only.

### 6. Push only when asked

Do not push by default after committing.

Push when the user explicitly asks to:

- push
- open a PR
- publish the branch

## Decision Rules

### Branch creation is a default, not a trap

Do not create a new branch for:

- simple questions
- read-only repo inspection
- tiny edits the user clearly wants applied in-place

Do create a branch by default for:

- new feature work
- bug fixes with real code/test/docs scope
- migration or persistence changes
- design-system or app UI slices
- multi-file artifact updates

### Favor clarity over automation when git state is already messy

If the current worktree already contains unrelated changes, prefer a brief
state report and a recommendation rather than silently branching and risking
mixed history.

If the repo is under active parallel chat development, escalate from
"recommendation" to "bootstrap gate": stop, capture a base commit, and isolate
the chat before implementation.

If local `main` is stale relative to `origin/main`, treat that as a blocking
state for promotion work and a warning state for new material work.

### Keep commit authority with the user

This workflow is meant to reduce cleanup pain, not to hide git decisions from
the user. Explicit approval still gates commits.

## Typical Sequence

1. inspect `git status --short`
2. inspect `git branch --show-current`
3. inspect the explicit base commit to use
4. decide whether the task is material
5. create a bootstrap record if the task is material
6. create a dedicated worktree/branch if needed
7. implement and verify
8. wait for approval
9. create scoped commit(s)
10. push only if asked

## Promotion Guardrail

Before anything is described as "merge to main", run:

```bash
npm run git:promote -- --source <branch-or-commit>
```

Interpretation:

- `SAFE_FAST_FORWARD`
  promotion can happen on top of the current `origin/main` baseline
- `CHERRY_PICK_REQUIRED`
  the branch is not based on the true mainline and must be promoted by
  cherry-picking scoped commits onto a clean `origin/main` branch
- `TARGET_STALE_BLOCK`
  local `main` is stale and must be realigned before promotion work continues
- `DIRTY_BLOCK`
  promotion worktree is not clean enough to proceed honestly
