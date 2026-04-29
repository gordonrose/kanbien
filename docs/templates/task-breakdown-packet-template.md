# Task Breakdown Packet Template

Use this after a Story Breakdown packet has validated and at least one story is
marked `ready-for-task-breakdown`.

Task Breakdown converts one approved story, or a small explicitly related
story set, into isolated delivery tasks. It does not redefine story scope,
acceptance criteria, product intent, or Technical Steering architecture.

Do not describe a task as queued for Delivery unless
`npm run task-breakdown:validate -- <packet-path> --story <story-packet-path>`
passes, or every blocker is explicitly accepted by the requester.

## Status

- Packet status:
  `draft | blocked | ready-for-delivery-handoff | superseded`
- Packet date:
- Task Breakdown ID:
- Source Story Breakdown packet:
- Selected Story ID(s):
- Related Product Discovery packet:
- Related Technical Steering packet:
- Related PRD:
- Related capability matrix:
- Validation command:
- Validation status:
  `not-run | pass | blocked | not-applicable`

## Source Story Handoff

- Story packet validation status:
  `pass | blocked | not-run`
- Selected story handoff status:
  `ready-for-task-breakdown | blocked | control-story-only | superseded`
- Story scope preserved:
  `yes | no`
- Acceptance criteria preserved:
  `yes | no`
- Product intent preserved:
  `yes | no`
- Technical Steering architecture preserved:
  `yes | no`
- Architecture invention check:
  `consumes-story-and-steering-only | proposes-new-architecture | blocked`
- Capability rows complete for implementation tasks:
  `yes | no | not-applicable`
- Story blockers carried forward:

## Steering Classification Reconciliation

Layer 4 must reconcile tasks against the Layer 2 classifications preserved by
Story Breakdown. Do not create a task queue that contradicts steering.

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |

Allowed reconciliation statuses:

- `covered`
- `blocked`
- `deferred-with-owner`

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |

Every Layer 3 signal with `Present` set to `yes` or `blocked` must be covered,
blocked, or explicitly deferred before Delivery handoff.

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |

Use one story by default. Select a small story set only when the stories are
explicitly related and share a necessary delivery dependency.

## Story Acceptance Criteria Snapshot

Copy the approved story acceptance criteria exactly so the validator can detect
task-layer rewrites.

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |

## Task Queue

Allowed task types:

- `backend`
- `frontend`
- `vertical-slice`
- `docs-artifact`
- `test-only`
- `refactor-first`
- `architecture-foundation`
- `standards-compliance`
- `platform-seam`
- `migration/persistence`
- `design-system`
- `API-contract`
- `permission-mapping`
- `data-dictionary`
- `QA/evidence`

Allowed delivery handoff statuses:

- `draft`
- `blocked`
- `queued-for-delivery`
- `superseded`

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Use stable task IDs such as `T-S001-01`.

## Task-Type Approval Guardrails

Each task must route to the guardrail reference that matches its task type.
Load only the matching reference when preparing the task.

| Task ID | Task Type | Required Guardrail Reference | Approval Status | Evidence / Rationale |
| --- | --- | --- | --- | --- |

Allowed approval statuses:

- `approved`
- `blocked`

Every task has a task type, so every task must route to a matching guardrail.
Queued tasks must be `approved`.

Guardrail references live under:

- `.codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/`

## Task Guardrail Evidence

Use the exact required check IDs from the matching task-type guardrail
reference. This section turns task-type approval into structured evidence
rather than a single prose assertion.

| Task ID | Guardrail Check ID | Status | Evidence |
| --- | --- | --- | --- |

Allowed statuses:

- `pass`
- `not-applicable: <reason>`
- `blocked`

Queued tasks must have every required check ID for their task type marked
`pass` or `not-applicable: <reason>`. Unknown check IDs are blocked unless a
future template revision explicitly allows extensions.

## Code Placement And Extraction Review

Use this section to decide whether code belongs in a feature, a platform seam,
`src/lib`, or should remain behind an owning feature's public seam.

Allowed placement decisions:

- `feature-local`
- `platform-seam`
- `shared-lib`
- `stay-put`
- `blocked`

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Required Supplemental Guardrail References | Compatibility Proof | Approval Status |
| --- | --- | --- | --- | --- | --- | --- | --- |

Allowed extraction values:

- `yes`
- `no`

Rules:

- queued implementation tasks must have an approved placement row
- `shared-lib` requires evidence that the logic is generic, has no
  feature-specific contract/domain/persistence dependency, and preserves
  existing consumers
- extraction `yes` requires a separate `refactor-first` or `platform-seam`
  task and a `Task Dependencies` row that blocks the dependent task from
  queueing until extraction completes
- `shared-lib`, `stay-put`, and extraction `yes` require
  `shared-code-placement-task-guardrail.md` in the supplemental guardrail
  references
- feature-owned reusable logic should normally stay behind the owning feature's
  public seam instead of moving to `src/lib`

## Allowed Write Set Classification

Classify each allowed write path or path pattern so Delivery can later compare
the actual diff against the approved implementation envelope.

Allowed write classes:

- `feature-local`
- `platform-seam`
- `test`
- `docs-artifact`
- `generated-artifact`
- `config-script`
- `blocked`

| Task ID | Path Pattern | Write Class | Reason |
| --- | --- | --- | --- |

Queued tasks must not include `blocked` write classes.

## Forbidden Work

Convert non-goals into explicit forbidden work so opportunistic rewrites are
easier to catch during Delivery.

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |

## Task Acceptance Criteria Coverage

| Task ID | AC IDs Covered | Coverage Notes |
| --- | --- | --- |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) Covered | Capability Coverage Status | Notes |
| --- | --- | --- | --- |

Allowed capability coverage statuses:

- `approved`
- `not-capability-backed`
- `blocked-missing-row`

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |

Use `not-applicable: <reason>` when a task has no shared seam. Do not leave the
field blank.

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |

Use `not-applicable: <reason>` only for task types that truly touch no
source-independent or maintained artifacts.

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |

## Branch Worktree Bootstrap Strategy

| Task ID | Branch Name | Worktree Strategy | Bootstrap Artifact | Base Ref | Base Commit Policy | Promotion Target |
| --- | --- | --- | --- | --- | --- | --- |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

Allowed blocker types:

- `refactor-first`
- `architecture-foundation`
- `design-system-foundation`
- `asset-decision`
- `permission-model`
- `capability-matrix`
- `artifact-drift`
- `shared-seam-ownership`
- `runtime-evidence`

Refactor-first and architecture-foundation blockers must be split into their
own tasks. Do not hide them inside feature work.

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |

Allowed handoff statuses:

- `queued-for-delivery`
- `blocked`
- `draft`
- `superseded`

Only `queued-for-delivery` tasks may enter Layer 5 Delivery. A task with
remaining blockers must not be queued.
