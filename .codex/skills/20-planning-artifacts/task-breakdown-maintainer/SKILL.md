---
name: task-breakdown-maintainer
description: Use when validated Story Breakdown stories need to be converted into isolated delivery tasks before Layer 5 Delivery begins.
---

# Task Breakdown Maintainer

Use this skill to create or update Layer 4 / 4.1 Task Breakdown packets.

Task Breakdown consumes validated Story Breakdown packets and converts one
approved story, or a small explicitly related story set, into isolated delivery
tasks. It does not redefine story scope, acceptance criteria, product intent,
or Technical Steering architecture.

## Inputs

- validated Story Breakdown packet
- `docs/templates/task-breakdown-packet-template.md`
- story acceptance criteria, capability rows, proof obligations, dependencies,
  artifact ledger, and blockers from Layer 3
- relevant branch/worktree guardrails from
  `docs/standards/git-workflow-guardrails.md`

## Workflow

1. Validate the handoff.
   Confirm the source Story Breakdown packet passes validation and the selected
   story is `ready-for-task-breakdown`. Stop if the story is blocked,
   superseded, missing capability rows for implementation work, or requires
   architecture invention.

2. Select the scope.
   Use one story by default. Select a small story set only when the Layer 3
   packet explicitly shows the stories are related and share a necessary
   delivery dependency.

3. Snapshot story truth.
   Copy story ID, acceptance criteria IDs and text, capability rows, proof
   obligations, dependencies, artifact ledger, and blockers from the Story
   Breakdown packet. Do not edit these fields to make task planning easier.

4. Split into isolated tasks.
   Assign stable task IDs and one task type per task. Use separate tasks for
   backend, frontend, vertical-slice, docs-artifact, test-only, refactor-first,
   architecture-foundation, standards-compliance, platform-seam,
   migration/persistence, design-system, API-contract, permission-mapping,
   data-dictionary, and QA/evidence work when those concerns have distinct
   write sets or proof.

5. Define task boundaries.
   For every task, record parent story ID, acceptance criteria covered,
   capability rows covered, allowed write set, non-goals, dependencies, shared
   seams, required artifacts, required proof layers, and proof commands.

5A. Reconcile steering classifications.
   Reconcile the task queue against Layer 2 architecture classifications and
   Layer 3 task-type signals. Do not queue a task that contradicts the
   steering classification for shared versus feature-local work.

6. Route task-type guardrails.
   For each task, load only the reference file matching its task type from
   `references/`. Fill the Task-Type Approval Guardrails section before
   queueing the task. Then fill Task Guardrail Evidence with every required
   check ID from the matching reference.

7. Review code placement and extraction.
   Decide whether the task is feature-local, platform-seam, shared-lib,
   stay-put, or blocked. Do not move reusable legacy capability code into
   `src/lib` unless it is truly generic and compatibility proof for existing
   consumers is named. Prefer owning-feature public seams for domain-specific
   reuse. When placement is `shared-lib`, `stay-put`, or extraction is `yes`,
   require `shared-code-placement-task-guardrail.md` as a supplemental
   guardrail reference. Extraction `yes` must also have a separate
   `refactor-first` or `platform-seam` dependency before dependent
   implementation work can queue.

8. Set branch and bootstrap strategy.
   Give every task a deterministic branch, worktree, and bootstrap strategy.
   Use the story ID and task ID in branch names when practical. Do not broaden
   the branch scope beyond the approved task.

8A. Classify write sets and forbidden work.
   Classify each allowed write path or path pattern and convert non-goals into
   explicit forbidden-work rows before queueing.

9. Preserve blockers.
   Put refactor-first and architecture-foundation findings into their own
   tasks. Do not hide them inside feature work or mark dependent feature tasks
   queued while those blockers remain.

10. Set handoff status.
   Mark only isolated, unblocked tasks as `queued-for-delivery`. Blocked,
   draft, or superseded tasks do not enter Layer 5 Delivery.

11. Validate.
   Run or request:
   `npm run task-breakdown:validate -- <packet-path> --story <story-packet>`.
   If validation blocks, report the blockers and do not call the tasks queued.

## Guardrails

- Do not change story scope or acceptance criteria.
- Do not invent architecture outside Technical Steering and Story Breakdown.
- Do not use vague task scopes such as "implement feature", "wire up", "clean
  up", "handle errors", "add tests", "update docs", "as needed", or "etc.".
- Do not create broad cleanup tasks unless cleanup is the approved story or a
  separate refactor-first task.
- Do not let Delivery rediscover artifact obligations; carry the ledger into
  tasks.
- Do not queue implementation tasks when required capability rows are missing.
- Do not queue a task without an approved task-type guardrail row.
- Do not queue a task without required guardrail check IDs marked pass or
  not-applicable with rationale.
- Do not queue implementation work with a blocked code-placement decision.
- Do not treat `src/lib` as a place for feature-owned domain logic.

## Output

Write packets under:

- `docs/workspace/task-breakdown/`

Use:

- `docs/templates/task-breakdown-packet-template.md`
