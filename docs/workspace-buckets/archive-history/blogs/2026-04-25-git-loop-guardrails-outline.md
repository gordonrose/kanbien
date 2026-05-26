# Blog Outline: The Git Loop Needed Its Own Guardrails

## Working Title

The Git Loop Needed Its Own Guardrails

## Thesis

AI-assisted development does not only need code-quality guardrails; it needs
repo-state guardrails, because multi-chat speed can turn ordinary Git hygiene
problems into confusing branch and worktree drift.

## Audience

- technical founders using AI coding agents
- engineering leads experimenting with parallel agent workflows
- senior engineers responsible for repo hygiene and delivery process

## Story Frame

This is a process lesson, not a victory lap. The interesting part is that the
existing guardrails did catch the problem at promotion time, but they did not
prevent stale worktrees and patch-equivalent branches from accumulating. The
repo had a delivery loop; the loop itself needed tests.

## Concrete Repo Moment

- Asset foundation v1 was implemented in an isolated worktree and eventually
  merged into `main`.
- While that work was happening, other chats advanced `origin/main`.
- Promotion guardrails correctly reported `CHERRY_PICK_REQUIRED`, so the asset
  work had to be re-promoted onto the current mainline.
- After merge, cleanup revealed the deeper problem:
  - stale worktrees were still present
  - several branches were patch-equivalent but not ancestor-merged
  - one dirty job-processing planning worktree sat on a brochure/design-system
    commit while carrying job-processing docs
- The cleanup was not dangerous because Git failed; it was dangerous because
  the repo state was hard to reason about.

## What The Existing Guardrails Already Did Well

- `npm run git:preflight` caught unsafe starting states such as material work
  on `main` or a dirty worktree.
- `npm run git:promote -- --source <branch>` caught branches that no longer
  descended from current `origin/main`.
- The promotion rule forced cherry-pick recovery rather than pretending stale
  branches were fast-forward safe.

## What They Missed

- sibling worktrees were not audited before starting new material work
- bootstrap records were treated mostly as documentation, not executable truth
- a dirty worktree could sit on an unrelated branch/topic without becoming a
  loud blocker
- cleanup after merge was still too manual
- "push" and "merge" meant different things in the loop, which added
  ambiguity because this repo does not use a PR-first developer flow

## What Changed

Recent guardrail hardening added:

- `npm run git:worktree-audit`
  - audits all worktrees
  - blocks on dirty worktrees that do not descend from `origin/main`
  - warns when a dirty stale-base branch topic does not match its top commit
- stricter `git:preflight` bootstrap validation:
  - bootstrap file must exist when passed
  - bootstrap branch must match current branch
  - bootstrap worktree path must match current path
  - planned write set must be present
  - branch must descend from the selected base when `--require-base` is used
- updated repo policy, bootstrap template, and AGENTS instructions
- focused tests around bootstrap parsing and worktree-audit behavior
- an explicit loop convention:
  when the user says "push" in this repo, treat that as publish-and-merge to
  `main` unless they explicitly ask for branch-only publication.

## Practical Commands

Before material multi-chat work:

```bash
npm run git:worktree-audit
npm run git:preflight -- --bootstrap docs/workspace/chat-bootstraps/<date>-<slug>.md --require-base
```

Before merge/promotion:

```bash
npm run git:promote -- --source <branch-or-commit>
```

When cleanup feels confusing:

```bash
git worktree list
git branch -vv
git cherry main <branch>
npm run git:worktree-audit
```

## The Lesson

The point is not "use Git better." The point is that AI changes the failure
mode. More parallel work means more branch state, more partial recovery paths,
and more opportunities for a local workspace to quietly stop representing the
real base of the work. Human memory is not a reliable synchronization system.

## Draft Beats

1. I thought the repo already had decent Git guardrails.
2. The asset-foundation merge proved the promotion guardrail worked.
3. The cleanup afterward showed the loop still had a blind spot.
4. The scary artifact was not a conflict; it was a dirty worktree whose branch
   name and top commit told different stories.
5. The fix was to make repo state executable:
   worktree audit, bootstrap validation, and push-means-merge semantics.
6. The broader AI lesson: every repeated source of confusion deserves a
   durable guardrail, not just a better reminder.

## Possible Closing

The more I use AI agents as collaborators, the less I trust informal process.
Not because the agents are bad, but because the system moves too quickly for
memory and vibes to be the source of truth. If the loop matters, test the loop.

## Repo Anchors

- `src/scripts/gitPreflight.ts`
- `src/scripts/gitWorktreeAudit.ts`
- `tests/unit/gitGuardrails/`
- `docs/standards/git-workflow-guardrails.md`
- `docs/templates/chat-branch-bootstrap-template.md`
- `AGENTS.md`
- `docs/workspace/chat-bootstraps/2026-04-25-git-harness-stricter-worktree-guardrails.md`
