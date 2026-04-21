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

### 1. Classify the task

Decide whether the current task is:

- read-only or inspection-only
- a tiny local edit
- a material change across code, tests, docs, migrations, or artifacts

Only the material class should trigger automatic branch creation by default.

### 2. Inspect git state before editing

Check:

- current branch
- whether the worktree is clean
- whether the existing branch is already a dedicated scoped task branch

If the worktree already has unrelated changes, do not silently continue into a
new mixed branch. Surface the state and ask how to proceed when separation is
not obvious.

### 3. Create a task branch when appropriate

For material work on a non-dedicated branch, create a branch before editing.

Preferred branch shape:

- `codex/<scope>-<short-slug>`

Examples:

- `codex/root-admin-hierarchy-landing-page`
- `codex/design-system-top-nav-governance`
- `codex/tenant-auth-policy-harness-fix`

Keep names short, descriptive, and task-scoped.

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

### Keep commit authority with the user

This workflow is meant to reduce cleanup pain, not to hide git decisions from
the user. Explicit approval still gates commits.

## Typical Sequence

1. inspect `git status --short`
2. inspect `git branch --show-current`
3. decide whether the task is material
4. create a task branch if needed
5. implement and verify
6. wait for approval
7. create scoped commit(s)
8. push only if asked
