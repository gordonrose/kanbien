# Story Breakdown Packet Template

Use this after Product Discovery and Technical Steering have approved the
direction for material work.

Story Breakdown converts an approved steering scope into the smallest
independently deliverable and verifiable stories. It does not replace PRDs,
capability matrices, PRD-derived test cases, implementation blueprints, API
contracts, data dictionaries, permission mappings, design-system governance,
or Delivery.

Do not describe a packet as ready for Task Breakdown unless
`npm run story-breakdown:validate -- <packet-path>` passes, or every blocker is
explicitly accepted by the requester.

## Status

- Packet status:
  `draft | blocked | ready-for-task-breakdown | superseded`
- Packet date:
- Epic ID:
- Epic title:
- Source Product Discovery packet:
- Source Technical Steering packet:
- Related PRD:
- Related capability matrix:
- Related design-system, asset, ADR, or architecture artifacts:
- Validation command:
- Validation status:
  `not-run | pass | blocked | not-applicable`

## Handoff Validation

- Product Discovery status:
- Technical Steering status:
- Steering non-goals preserved:
- Steering stop conditions resolved or carried as blockers:
- Architecture invention check:
  `consumes-steering-only | proposes-new-architecture | blocked`
- Governed frontend seam posture:
  `not-applicable | ready-seam | missing-seam | approved-exception | blocked`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
- Missing source-of-truth artifacts:

## Steering Architecture Classification Snapshot

Copy the approved Layer 2 architecture classification rows that affect the
story queue. Story Breakdown preserves and refines these decisions; it does not
re-decide whether work is feature-local, shared, platform-level,
design-system-owned, or blocked.

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |

Allowed classifications:

- `feature-local`
- `feature-public-seam`
- `platform-seam`
- `shared-lib-candidate`
- `design-system-seam`
- `architecture-foundation-required`
- `blocked`

## Task-Type Signal Matrix

Record the task-type signals implied by Layer 2 classifications and story
acceptance criteria. Layer 4 must reconcile its task queue against these
signals.

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |

Use `yes`, `no`, or `blocked` for `Present`.

## Epic Summary

- Epic job to be done:
- Epic outcome:
- Epic actors:
- Epic non-goals:
- Epic dependency summary:
- Epic-level proof target:
  `source-level | contract-level | persistence-level | runtime-api | rendered-browser | human-visible-parity | deployment-runtime-process | mixed`

## Story Queue

Allowed story statuses:

- `draft`
- `blocked`
- `needs-capability-matrix`
- `needs-prd-refinement`
- `ready-for-task-breakdown`
- `superseded`

Allowed value types:

- `user-value`
- `system-value`
- `harness-value`

Allowed delivery shapes:

- `backend`
- `frontend`
- `vertical-slice`
- `docs-artifact`
- `test-only`
- `refactor-first`
- `architecture-foundation`
- `standards-compliance`

| Story ID | Status | Value Type | Delivery Shape | Title | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | needs-capability-matrix | harness-value | docs-artifact | Capability matrix normalization | As the delivery harness, I need approved stories translated into explicit capability rows so implementation cannot proceed from vague value statements. | harness | Approved capability rows exist for every story acceptance criterion. |  |

## Acceptance Criteria

Use stable IDs such as `AC-S001-01`.

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |

## Capability Mapping

Use this section to record whether capability matrix coverage already exists or
must be created by a harness-value control story.

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |

Allowed capability posture values:

- `existing-approved`
- `create-or-refresh-required`
- `not-capability-backed`
- `blocked`

## Dependency And Seam Map

Allowed dependency types:

- `pre-existing-capability`
- `new-capability`
- `feature-public-seam`
- `cross-feature-read`
- `authz-capability`
- `persistence-table-or-index`
- `job-queue-or-worker`
- `design-system-seam`
- `frontend-topology-route`
- `asset-consumer-seam`
- `external-provider`

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

Use `not-applicable: <reason>` rather than leaving fields blank.

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Reference:
`docs/architecture/guides/story-breakdown-test-design-guide.md`

## Acceptance Criteria To Test Obligation Matrix

This records obligations for later detailed `TC-*` authoring. It does not
replace the PRD-derived test-case workflow.

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |

Allowed blocker types:

- `refactor-first`
- `architecture-foundation`
- `design-system-foundation`
- `asset-decision`
- `permission-model`
- `capability-matrix`
- `test-harness`
- `artifact-drift`

## Follow-Up Decision Questions

Use this section when blockers or newly discovered granular decisions affect
story scope, acceptance criteria, feature seams, permission posture, lifecycle
behavior, fallback behavior, proof layers, or whether Layer 3 can be completed.

Rows with `Required Before Layer 3 Completion` set to `yes` must be resolved
before the packet can be marked `ready-for-task-breakdown`.

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Layer 3 Unblock Queue

Use this section when Story Breakdown is valid but cannot hand stories to Task
Breakdown. Each unresolved required decision question and each blocking
artifact ledger row must map to at least one unblock row.

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Allowed unblock types:

- `human-decision`
- `artifact-creation`
- `technical-steering-revisit`
- `design-system-governance`
- `source-of-truth-inspection`
- `capability-matrix-required`
- `prd-required`
- `api-contract-required`
- `permission-mapping-required`
- `data-dictionary-required`

Allowed statuses:

- `needs-human-answer`
- `ready-to-create-artifact`
- `blocked-on-steering`
- `blocked-on-source-truth`
- `resolved`
- `deferred-with-owner`

Rules:

- use `yes` or `no` for `Can Auto-Create Artifact`
- `needs-human-answer` rows must ask the smallest concrete decision question
  and list viable options or explain why there is no safe default
- `ready-to-create-artifact` rows must name the exact artifact or workflow to
  run next
- do not mark a story `ready-for-task-breakdown` while an unresolved unblock
  row still blocks it

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |

## Story Readiness Summary

- Ready stories:
- Blocked stories:
- Stories needing capability matrix:
- Stories needing PRD refinement:
- Stories needing Technical Steering revisit:
- Broad cleanup or shortcut risk:
  `none | listed-below`
- Architecture invention risk:
  `none | listed-below`

## Layer 4 Handoff

A story may hand off to Task Breakdown only when:

- it has a value type and delivery shape
- it has a clear job to be done
- acceptance criteria are concrete and verifiable
- dependency and seam obligations are recorded
- capability matrix posture is recorded
- proof layers and test families are assigned
- required artifact obligations are recorded
- architecture invention check is not blocked
- blockers are resolved or intentionally carried as non-delivery control work

| Story ID | Handoff Status | Reason |
| --- | --- | --- |

Allowed handoff statuses:

- `ready-for-task-breakdown`
- `blocked`
- `control-story-only`
- `superseded`
