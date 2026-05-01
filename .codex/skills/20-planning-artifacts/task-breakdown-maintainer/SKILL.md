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
   DEV:backend, DEV:frontend, DEV:vertical-slice, DOC:docs-artifact, TEST:test-only,
   TEST:test-suite-alignment, DECISION:refactor-first, DECISION:architecture-foundation,
   DOC:standards-compliance, DEV:platform-seam,
   DEV:migration-persistence, DEV:design-system, DOC:api-contract, DOC:permission-mapping,
   DOC:data-dictionary, and EVIDENCE:qa-evidence work when those concerns have distinct
   write sets or proof.

5. Define task boundaries.
   For every task, record parent story ID, acceptance criteria covered,
   capability rows covered, allowed write set, non-goals, dependencies, shared
   seams, required artifacts, required proof layers, and proof commands.

5B. Apply the deep-delivery task size guardrail.
   A queued task must be small enough for deep Layer 5 delivery. Prefer one
   durable behavior, decision, or proof target; one primary seam; one main proof
   story; and one acceptance criterion. Two acceptance criteria are allowed only
   when inseparable and justified. More than two acceptance criteria blocks
   queueing. Do not broaden acceptance criteria to satisfy task-size rules; if
   an acceptance criterion is too broad, block the task and route it back to
   Story Breakdown refinement.

5C. Record stop conditions and exact starting context.
   Every queued task must say what the implementer must inspect before editing,
   which existing seams must be consumed, which source artifacts govern the
   task, and which product, design, architecture, source-truth, or proof
   decisions must not be guessed.

5D. Split complex DEV:frontend and DEV:design-system work by sub-standard.
   When independently meaningful, split fixture/data contracts, visual
   rendering, interaction behavior, accessibility semantics, and evidence sweep
   into separate tasks. Each queued DEV:frontend, DEV:design-system, or frontend-facing
   DEV:vertical-slice task must name a primary sub-standard and the compliance proof
   expected for that sub-standard.

5E. Lock the design-system-to-frontend seam.
   A DEV:design-system task is not ready merely because it renders in
   `/design-system`; it must produce, refine, or prove a named consumable seam
   for future DEV:frontend tasks. A DEV:frontend task that touches governed UI must
   consume the signed-off DEV:design-system render, behavior, and accessibility seam
   or record an approved exception. If the seam does not exist, block the
   DEV:frontend task and create DEV:design-system work first. When a DEV:frontend task
   consumes an existing seam, fill the Frontend Adoption Contract with the
   consumed render, controller/behavior, accessibility, and style/CSS seams,
   allowed app-local composition/data binding, prohibited local reconstruction,
   and the adoption proof route or scenario.

5F. Package DEV:frontend security and runtime evidence.
   For queued `DEV:frontend`, `DEV:design-system`, and frontend-facing
   `DEV:vertical-slice` tasks, copy the relevant Layer 2/3 Browser Security
   Posture rows into Frontend Security Evidence. If Layer 2/3 says a browser
   security area is present, require the matching Layer 4 evidence row or block.
   Do not invent a security posture in Layer 4. For sensitive rendering,
   require allowed, denied/unauthorized, expired/unauthenticated, and
   tenant-scoped cross-tenant denial proof notes. For API/projection rendering,
   require the governing contract, fixture source, live/runtime payload
   evidence or explicit unavailable reason, and a mock-honesty statement.
   Rendered proof based only on mocks without contract/runtime tie blocks.

5G. Classify DEV:frontend performance posture.
   For queued `DEV:frontend`, `DEV:design-system`, and frontend-facing
   `DEV:vertical-slice` tasks, add a Frontend Performance Posture row. Layer 4
   classifies delivery proof posture only; it does not invent Layer 2 DEV:frontend
   architecture decisions or broaden task scope. `unknown-blocked` blocks
   queueing. Require posture-matched proof such as render-proof sufficiency,
   no repeated work/fetch loop, bounded data/list DOM proof, route init/load
   proof, bounded DOM/canvas proof, asset size/loading evidence, transition
   timing, reduced-motion behavior, or concrete not-applicable rationale.

5H. Gate vertical slices.
   Use `DEV:vertical-slice` only when one journey behavior requires DEV:backend and
   DEV:frontend proof together. Fill the Vertical Slice Coupling row before
   queueing. If DEV:backend/API, DEV:frontend render, DEV:design-system, migration,
   permission, runtime evidence, or artifact work can be proven separately,
   split it into the matching task type instead of hiding it in a vertical
   slice.

5I. Gate TEST:test-only tasks.
   Use `TEST:test-only` for PRD-derived `TC-*` implementation, isolated proof-gap
   tests, security/permutation matrix tests, or e2e journey tests. Fill the
   Test-Only Coverage Contract before queueing. If the task is privileged,
   root-admin, tenant-boundary, authz, sensitive-rendering, asset, lifecycle,
   or otherwise security-sensitive, also fill the Capability Permission / State
   Matrix with allowed and denied coverage. Do not use `TEST:test-only` when
   production behavior must change; split that work into the owning
   implementation task type.

5J. Gate test-suite alignment tasks.
   Use `TEST:test-suite-alignment` when existing tests, PRD test cases, QA backlog
   rows, journey IDs, traceability output, or standards expectations need to be
   reconciled without changing product behavior. Fill the Test Suite Alignment
   Contract before queueing. Keep the task to one feature, route family,
   test-case document, or mismatch family. If the task discovers missing
   executable proof, split that work into `TEST:test-only`; if it discovers missing
   product, design, architecture, permission, lifecycle, or security behavior,
   split to the owning task type instead of rewriting documentation to fit the
   current implementation.

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
   `DECISION:refactor-first` or `DEV:platform-seam` dependency before dependent
   implementation work can queue.

8. Set branch and bootstrap strategy.
   Give every task a deterministic branch, worktree, and bootstrap strategy.
   Use the story ID and task ID in branch names when practical. Do not broaden
   the branch scope beyond the approved task.

8A. Classify write sets and forbidden work.
   Classify each allowed write path or path pattern and convert non-goals into
   explicit forbidden-work rows before queueing.
   Prefer exact files or narrow path patterns. Broad DEV:frontend and DEV:design-system
   write envelopes block queued implementation tasks unless the task is
   explicitly a broad audit, migration, generated/canonical sweep, or otherwise
   has strong written rationale.

9. Preserve blockers.
   Put DECISION:refactor-first and DECISION:architecture-foundation findings into their own
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
  separate DECISION:refactor-first task.
- Do not let Delivery rediscover artifact obligations; carry the ledger into
  tasks.
- Do not queue implementation tasks when required capability rows are missing.
- Do not queue a task without an approved task-type guardrail row.
- Do not queue a task without required guardrail check IDs marked pass or
  not-applicable with rationale.
- Do not queue implementation work with a blocked code-placement decision.
- Do not treat `src/lib` as a place for feature-owned domain logic.
- Do not queue coarse tasks that combine a full component family, state matrix,
  interaction set, accessibility semantics, and evidence sweep.
- Do not let broad proof commands such as `npm test` be the only proof for a
  queued task unless the task is intentionally broad and the rationale says why.

## Harness Refinement Routing

When real Layer 5 delivery results show that the harness missed something,
classify the refinement before editing files. Every refinement must name:

1. what failed in delivery
2. which compiler layer should have caught it
3. which file or surface should have caught it
4. whether the miss was caused by a missing allowed value, packet field,
   validator rule, operator workflow, task-type standard, architecture or
   standards rule, example fixture, or delivery-conformance check
5. the single canonical source for the refinement
6. any supporting files that should reference that source without duplicating it
7. the test or fixture that proves the refinement works

Use this routing model:

- allowed values, check IDs, task types, statuses, and sub-standards belong in
  the compiler contract registry
- packet shape belongs in the Task Breakdown template
- executable enforcement belongs in `taskBreakdownValidate`
- operator workflow belongs in this skill
- task-type interpretation belongs in the matching reference guardrail
- durable repo-wide law belongs in `AGENTS.md`, architecture docs, or standards
- examples and regression proof belong in fixtures and tests

Do not copy the same refinement paragraph across multiple surfaces. If several
files change, each file must have a distinct job.

## Output

Write packets under:

- `docs/workspace/task-breakdown/`

Use:

- `docs/templates/task-breakdown-packet-template.md`
