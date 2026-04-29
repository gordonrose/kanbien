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

For material work with a bootstrap record, run preflight against the record:

```bash
npm run git:preflight -- --bootstrap docs/workspace/chat-bootstraps/<date>-<slug>.md --require-base
```

This validates that the bootstrap file exists, names the current branch,
names the current worktree path, includes a planned write set, and that the
branch descends from the baseline used for the check.

When multiple chats or worktrees are active, also run:

```bash
npm run git:worktree-audit
```

This checks sibling worktrees for dirty stale-base states and suspicious
branch/topic mismatches.

Before promotion or merge planning, run:

```bash
npm run git:promote -- --source <branch-or-commit>
```

These scripts are not optional advisory helpers. They are required start gates.

Material work means any non-trivial add, remove, or change to code, tests,
docs, migrations, maintained artifacts, workflow files, or committed repo
configuration.

Do not postpone `npm run git:preflight` until commit time. The point is to stop
bad repo state before the first material edit happens.

For repo-local Codex sessions, prefer launching through:

```bash
/home/gordon/kanbien/src/scripts/launchGuardedCodex.sh
```

That launcher runs `npm run git:preflight` before Codex starts, so blocked repo
states fail earlier instead of becoming mid-task surprises.

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

For Codex or other agent sessions, treat this as a pre-edit guard, not just a
pre-commit guard. Skills and agent workflows that modify the repo should assume
this check has already happened or should run it before the first material
edit.

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
- base ref used for the start gate, normally `origin/main`
- source branch at bootstrap time
- dedicated branch
- worktree path
- intended write set
- known shared seams

The bootstrap file is not just a note. When passed to `npm run git:preflight`
with `--bootstrap`, it is validated against the current branch and worktree.
If it points at a different branch or path, the worktree is not considered
isolated.

## Dirty Worktree Rule

If unrelated dirty changes are present, do not silently continue with new
material work.

Allowed next actions:

- commit the existing work
- stash it
- back it up
- move to a dedicated worktree
- run preflight with an explicit planned write set when the same worktree is
  intentionally hosting separate chats and the file sets are disjoint
- stop and ask for direction

Do not treat a dirty worktree as harmless background noise.

Same-worktree overlap is allowed only when the current task has an auditable
planned write set and the existing dirty paths do not collide with it. Use one
of these forms:

```bash
npm run git:preflight -- --bootstrap docs/workspace/chat-bootstraps/<date>-<slug>.md --allow-disjoint-dirty
npm run git:preflight -- --write-set src/scripts/gitPreflight.ts,tests/unit/gitGuardrails --allow-disjoint-dirty
```

If any dirty path exactly matches the planned write set, is inside a planned
directory, or contains a planned path, preflight must still return
`DIRTY_BLOCK`. If no planned write set is supplied, the old strict dirty block
remains in force.

If a worktree is dirty and its `HEAD` does not descend from the current
`origin/main`, treat it as a red-alert state. That usually means the task was
started from an old or unrelated ambient branch, and promotion will likely
require recovery instead of a normal merge.

Use `npm run git:worktree-audit` before starting a new material chat when other
worktrees are present. The audit blocks on dirty stale-base worktrees and warns
when a dirty branch name does not appear to match its top commit subject.

If a dirty stale-base sibling worktree is intentionally parked WIP for a
different line of work, record that decision under:

```text
docs/workspace/preserved-worktrees/<slug>.md
```

The record must name the exact worktree path, branch, expected resolution, and
`Allowed To Block Unrelated Work: no`. With that explicit marker,
`npm run git:worktree-audit` classifies the sibling as `preserved-stale-wip`
instead of `dirty-stale-base`: unrelated clean task branches may proceed, but
the parked worktree remains visible and must still be rebased, recovered,
promoted, or discarded before that task continues.

Do not use a preserved-worktree marker to hide unknown dirty state, mixed task
changes, or work that is about to be promoted. The marker is a temporary
coordination record for intentionally parked WIP, not a bypass for cleanup.

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

After `npm run git:promote -- --source <branch-or-commit>` reports
`SAFE_FAST_FORWARD`, repo-local requests such as "promote and push", "push",
"ship", or equivalent mean fast-forward/promote the scoped task to `main` and
push the promoted `main` to `origin/main`.

For task-registry workflows, prefer
`npm run codex:promote-task -- --task <task-id> --apply` over hand-running the
fast-forward merge. A successful apply promotes the task onto local `main` and
then automatically retires the source task branch and attached worktree once
the task has no remaining unique patch content or dirty local state.

If the source task worktree is dirty, promotion must stop before the merge.
Commit, discard, or move that WIP first; promotion must not delete or hide
uncommitted source-task changes. If the merge succeeds but automatic retirement
is blocked, treat the result as partially promoted and retire the task manually
before starting unrelated work.

Do not substitute branch-only publishing or a pull-request flow for that direct
remote-main workflow unless the user explicitly asks for branch-only publishing
or a PR.

## Human-Friendly Repo Check

When the repo feels confusing, stop and confirm:

- current branch
- whether the worktree is clean
- whether local `main` equals `origin/main`
- whether the current branch is really dedicated to the task
- whether the task’s bootstrap names the same intended write set you are
  actually editing
- whether `npm run git:worktree-audit` reports dirty stale-base sibling
  worktrees or branch/topic mismatches

The fix for confusion is not more guessing. The fix is re-establishing the
baseline truth explicitly.
