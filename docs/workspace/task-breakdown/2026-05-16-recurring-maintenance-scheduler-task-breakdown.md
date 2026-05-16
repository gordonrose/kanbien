# Task Breakdown

## Status

- Packet status:
  ready-for-delivery-handoff
- Packet date:
  2026-05-16
- Task Breakdown ID:
  TB-RECURRING-SCHEDULER-FOUNDATION
- Source Story Breakdown packet:
  docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown
- Selected Story ID(s):
  S-000, S-001, S-002, S-003, S-004, S-005
- Related Product Discovery packet:
  explicit platform exception
- Related Technical Steering packet:
  docs/workspace/technical-steering/2026-05-16-recurring-maintenance-scheduler-steering.md
- Related PRD:
  none; explicit platform exception
- Related capability matrix:
  scheduler behavior/proof map created by T-S000-01
- Validation command:
  npm run task-breakdown:validate -- docs/workspace/task-breakdown/2026-05-16-recurring-maintenance-scheduler-task-breakdown.md --story docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown
- Validation status:
  pass

## Source Story Handoff

- Story packet validation status:
  pass
- Selected story handoff status:
  ready-for-task-breakdown
- Story scope preserved:
  yes
- Acceptance criteria preserved:
  yes
- Product intent preserved:
  yes
- Technical Steering architecture preserved:
  yes
- Architecture invention check:
  consumes-story-and-steering-only
- Capability rows complete for implementation tasks:
  yes
- Story blockers carried forward:
  none; public logo scheduled jobs and operator UI/API remain deferred.

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TS-SCHED-001 | platform-seam | Story and task breakdown for platform scheduler foundation. | T-S003-01, T-S003-02, T-S003-03 | covered | Runtime scheduler work is split. |
| TS-SCHED-002 | platform-seam | Registry schema, validation, and tests. | T-S002-01, T-S002-02 | covered | Registry and validation are separate. |
| TS-SCHED-003 | architecture-foundation-required | Migration, platform persistence note, persistence-backed tests. | T-S001-01, T-S001-02 | covered | Storage is split by definition and run/lease records. |
| TS-SCHED-004 | feature-public-seam | Follow-on first-consumer story/task plus manifest/docs refresh. | T-S004-01, T-S004-02 | deferred-with-owner | Export adoption is deferred to the Organization export slice. |
| TS-SCHED-005 | feature-public-seam | Future story after concrete logo cleanup/cache job seams exist. | deferred | deferred-with-owner | Public logo scheduled jobs remain outside. |
| TS-SCHED-006 | platform-seam | Separate Product Discovery/Technical Steering if requested. | deferred | deferred-with-owner | Operator API/UI remains deferred. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-000 | DOC:docs-artifact | behavior/proof map missing | T-S000-01, T-S000-02 | none |
| S-001 | DEV:migration-persistence | durable schedule records | T-S001-01, T-S001-02 | none |
| S-002 | DEV:backend | reusable schedule registry | T-S002-01, T-S002-02 | none |
| S-003 | DEV:backend | scheduler runtime | T-S003-01, T-S003-02, T-S003-03 | none |
| S-004 | DEV:backend | first-consumer deferral | T-S004-01, T-S004-02, T-S004-03, T-S004-03 | Organization export schedule wiring is deferred to the owning feature slice. |
| S-005 | DOC:docs-artifact | artifact closeout | T-S005-02 | architecture update and evidence capture are split to GOV:architecture-update and EVIDENCE:qa-evidence. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Scheduler behavior and proof map | This is needed so reviewers can see the scheduler promises before delivery work starts. | planning reviewer | Split active map and deferral rows. |
| S-001 | ready-for-task-breakdown | system-value | DEV:backend | Durable schedule state | This is needed because repeated maintenance work must survive restarts and avoid duplicate runs. | system | Split definition storage from run/lease recovery. |
| S-002 | ready-for-task-breakdown | system-value | DEV:backend | Code-declared schedule registry | This is needed because the first scheduler should run only known maintenance work. | system | Split registry shape from rejection/validation. |
| S-003 | ready-for-task-breakdown | system-value | DEV:backend | Scheduler runtime enqueue loop | This is needed so due maintenance work happens without a person manually starting it. | system | Split due/lease, enqueue/outcomes, and process command. |
| S-004 | ready-for-task-breakdown | harness-value | DEV:backend | Organization export schedule adoption deferral | This is needed because expired files and stuck export work are intended consumers, but not part of the platform-only branch. | reviewer | Split source-boundary proof and follow-on adoption note. |
| S-005 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Scheduler closeout evidence | This is needed because repo guidance must change once scheduler foundation is real. | reviewer | Split architecture, docs, and evidence closeout. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-001 | S-000 | The scheduler behavior/proof map lists active v1 behaviors for schedule definitions, run records, leasing, due calculation, enqueue, missed-run handling, and generic code-declared schedule validation. | source-level | docs validation | behavior/proof map |
| AC-S000-002 | S-000 | The map lists deferred behaviors: Organization export first consumers, dynamic schedules, operator API/UI, public logo scheduled jobs, business workflow scheduling, and frontend surfaces. | source-level | docs validation | behavior/proof map |
| AC-S000-003 | S-000 | The map assigns each behavior to a later story and proof layer. | source-level | traceability | behavior/proof map |
| AC-S001-001 | S-001 | Scheduler persistence stores code-declared schedule state with schedule key, job type, cadence, enablement, next run, lease, failure, and timestamp fields. | persistence-level | persistence-backed | migration, persistence docs |
| AC-S001-002 | S-001 | Scheduler run history records scheduled slot status, linked job id when enqueued, attempts, safe error category/summary, and timestamps. | persistence-level | persistence-backed, audit | migration, persistence docs |
| AC-S001-003 | S-001 | Persistence enforces uniqueness for schedule keys and due slots and provides indexed due-schedule polling. | persistence-level | persistence-backed, performance | migration |
| AC-S001-004 | S-001 | Stale leases can expire and become eligible for retry without deleting run history. | persistence-level | concurrency, resilience | persistence tests |
| AC-S002-001 | S-002 | A code-declared registry accepts schedule definitions with stable key, job type, payload version, cadence, enablement, and payload factory. | source-level | unit | source |
| AC-S002-002 | S-002 | Registry validation rejects duplicate keys, invalid cadence, unknown job type, unsupported payload version, unsafe payloads, and forbidden secrets/session material. | source-level | unit, security | source/tests |
| AC-S002-003 | S-002 | Registry definitions can compute a due slot and deterministic idempotency key for enqueue. | source-level | unit | source/tests |
| AC-S002-004 | S-002 | Normal enqueue requests still reject recurringSchedule as deferred. | contract-level | compatibility, security | tests |
| AC-S003-001 | S-003 | Scheduler runtime finds due enabled schedules using bounded batch polling and indexed fields. | persistence-level | persistence-backed, performance | source/tests |
| AC-S003-002 | S-003 | Runtime acquires a lease before enqueue and prevents two scheduler processes from enqueueing the same due slot. | persistence-level | concurrency, resilience | source/tests |
| AC-S003-003 | S-003 | Runtime enqueues through the jobProcessing public seam with deterministic idempotency keys. | mixed | integration, compatibility | source/tests |
| AC-S003-004 | S-003 | Runtime records enqueued, skipped-overlap, retryable failure, and terminal failure outcomes with safe error summaries. | persistence-level | resilience, audit | source/tests |
| AC-S003-005 | S-003 | Package/runtime documentation provides a scheduler process command without changing the HTTP server into a worker. | deployment-runtime-process | operational | package/runbook docs |
| AC-S004-001 | S-004 | Organization export cleanup and timeout-sweep schedules are explicitly deferred to the Organization export slice. | source-level | docs validation | behavior map/story |
| AC-S004-002 | S-004 | Scheduler runtime and registry source do not import `organizationExports`. | source-level | static, unit | source/tests |
| AC-S004-003 | S-004 | The scheduler unit proof uses generic code-declared platform maintenance schedules rather than feature-owned Organization export schedules. | source-level | unit | tests |
| AC-S004-004 | S-004 | No Organization export manifest, docs, or runbook claims automatic scheduler cadence in this platform-only slice. | source-level | docs validation | docs/runbook |
| AC-S004-005 | S-004 | Closeout records that Organization export schedule adoption remains follow-on work. | source-level | docs validation | docs/runbook |
| AC-S005-001 | S-005 | ADR-0046 is promoted to Accepted or superseded by a concrete scheduler ADR after implementation lands. | source-level | docs validation | ADR update |
| AC-S005-002 | S-005 | jobProcessing manifest and generated dependency graph reflect new scheduler seams/dependencies; Organization export manifest remains unchanged until the follow-on consumer slice. | source-level | static, dependency graph | manifests/generated graph |
| AC-S005-003 | S-005 | Docs describe scheduler foundation, failure evidence, and remaining first-consumer deferred behavior accurately. | source-level | docs validation | docs/runbook |
| AC-S005-004 | S-005 | Bootstrap, helper, or deployment docs mention the scheduler process when it becomes a normal runtime. | deployment-runtime-process | operational | bootstrap/runbook |
| AC-S005-005 | S-005 | Closeout records the exact tests/gates run after the final scheduler implementation change. | mixed | static, unit, integration, runtime as applicable | test-run summary |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-001 | no scheduler matrix yet | planning | control-story | behavior/proof map |
| S-000 | AC-S000-002 | no scheduler matrix yet | planning | control-story | behavior/proof map |
| S-000 | AC-S000-003 | no scheduler matrix yet | planning | control-story | behavior/proof map |
| S-001 | AC-S001-001 | scheduler behavior map S-000 | jobProcessing persistence | new-platform-capability | migration, persistence docs |
| S-001 | AC-S001-002 | scheduler behavior map S-000 | jobProcessing persistence | new-platform-capability | migration, persistence docs |
| S-001 | AC-S001-003 | scheduler behavior map S-000 | jobProcessing persistence | new-platform-capability | migration |
| S-001 | AC-S001-004 | scheduler behavior map S-000 | jobProcessing persistence | new-platform-capability | persistence tests |
| S-002 | AC-S002-001 | scheduler behavior map S-000 | jobProcessing domain | new-platform-capability | source |
| S-002 | AC-S002-002 | scheduler behavior map S-000 | jobProcessing domain | new-platform-capability | source/tests |
| S-002 | AC-S002-003 | scheduler behavior map S-000 | jobProcessing domain | new-platform-capability | source/tests |
| S-002 | AC-S002-004 | scheduler behavior map S-000 | jobProcessing domain | new-platform-capability | tests |
| S-003 | AC-S003-001 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | source/tests |
| S-003 | AC-S003-002 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | source/tests |
| S-003 | AC-S003-003 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | source/tests |
| S-003 | AC-S003-004 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | source/tests |
| S-003 | AC-S003-005 | scheduler behavior map S-000 | jobProcessing runtime | new-platform-capability | package/runbook docs |
| S-004 | AC-S004-001 | scheduler behavior map S-000 | first-consumer deferral | docs-control | behavior map/story |
| S-004 | AC-S004-002 | scheduler behavior map S-000 | platform-only source boundary | docs-control | source/tests |
| S-004 | AC-S004-003 | scheduler behavior map S-000 | generic schedule proof | docs-control | tests |
| S-004 | AC-S004-004 | scheduler behavior map S-000 | documentation honesty | docs-control | docs/runbook |
| S-004 | AC-S004-005 | scheduler behavior map S-000 | follow-on adoption note | docs-control | docs/runbook |
| S-005 | AC-S005-001 | scheduler behavior map S-000 | docs/artifacts | closeout-control | ADR update |
| S-005 | AC-S005-002 | scheduler behavior map S-000 | docs/artifacts | closeout-control | manifests/generated graph |
| S-005 | AC-S005-003 | scheduler behavior map S-000 | docs/artifacts | closeout-control | docs/runbook |
| S-005 | AC-S005-004 | scheduler behavior map S-000 | docs/artifacts | closeout-control | bootstrap/runbook |
| S-005 | AC-S005-005 | scheduler behavior map S-000 | docs/artifacts | closeout-control | test-run summary |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S000-01 | S-000 | DOC:docs-artifact | Create scheduler active behavior map | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | validated story packet | docs chain | queued-for-delivery |
| T-S000-02 | S-000 | DOC:docs-artifact | Record scheduler deferrals | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | docs chain | queued-for-delivery |
| T-S001-01 | S-001 | DEV:migration-persistence | Add recurring schedule definition storage | src/features/jobProcessing/persistence/**; tests/integration/jobProcessing/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing and owning feature seams | queued-for-delivery |
| T-S001-02 | S-001 | DEV:migration-persistence | Add scheduler run and lease recovery storage | src/features/jobProcessing/persistence/**; tests/integration/jobProcessing/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing and owning feature seams | queued-for-delivery |
| T-S002-01 | S-002 | DEV:backend | Add code-declared recurring schedule registry | src/features/jobProcessing/domain/**; src/features/jobProcessing/index.ts; tests/unit/jobProcessing/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing and owning feature seams | queued-for-delivery |
| T-S002-02 | S-002 | DEV:backend | Validate schedule definitions and preserve enqueue rejection | src/features/jobProcessing/domain/**; tests/unit/jobProcessing/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing and owning feature seams | queued-for-delivery |
| T-S003-01 | S-003 | DEV:backend | Find due schedules and acquire scheduler leases | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing and owning feature seams | queued-for-delivery |
| T-S003-02 | S-003 | DEV:backend | Enqueue due schedules and record outcomes | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing and owning feature seams | queued-for-delivery |
| T-S003-03 | S-003 | DEV:backend | Add scheduler runtime command | src/jobScheduler.ts; package.json; src/features/jobProcessing/**; tests/unit/jobProcessing/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing and owning feature seams | queued-for-delivery |
| T-S004-01 | S-004 | DEV:backend | Record Organization export first-consumer deferral | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | No Organization export implementation, frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing source boundary | queued-for-delivery |
| T-S004-02 | S-004 | DEV:backend | Prove platform-only source boundary | src/jobScheduler.ts; src/features/jobProcessing/**; tests/unit/jobProcessing/** | No Organization export implementation, frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing source boundary | queued-for-delivery |
| T-S004-03 | S-004 | DEV:backend | Prove no Organization export import in scheduler source | src/jobScheduler.ts; src/features/jobProcessing/**; tests/unit/jobProcessing/** | No Organization export implementation, frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing source boundary | queued-for-delivery |
| T-S005-01 | S-005 | GOV:architecture-update | Close scheduler ADR and architecture evidence | docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md; docs/architecture/generated/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing and owning feature seams | queued-for-delivery |
| T-S005-02 | S-005 | DOC:docs-artifact | Refresh scheduler operations and verification docs | docs/architecture/guides/**; docs/workspace/implementation-blueprints/** | No frontend UI, operator API, dynamic schedules, Organization export scheduler adoption, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | docs chain | queued-for-delivery |
| T-S005-03 | S-005 | EVIDENCE:qa-evidence | Record scheduler final proof summary | docs/workspace/test-run-summaries/**; docs/workspace/qa-evidence/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | No frontend UI, operator API, dynamic schedules, or public logo scheduled jobs. | prior scheduler tasks named in Task Dependencies | jobProcessing and owning feature seams | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S000-01 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Create scheduler active behavior map | docs artifact | The scheduler behavior/proof map lists active v1 behaviors for schedule definitions, run records, leasing, due calculation, enqueue, missed-run handling, and generic code-declared schedule validation. / The map assigns each behavior to a later story and proof layer. | none | Inseparable because proof is one coherent slice. |
| T-S000-02 | single-behavior | 1 | One criterion only. | Record scheduler deferrals | docs artifact | The map lists deferred behaviors: Organization export first consumers, dynamic schedules, operator API/UI, public logo scheduled jobs, business workflow scheduling, and frontend surfaces. | none | Already smallest useful task. |
| T-S001-01 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Add recurring schedule definition storage | scheduler storage | Scheduler persistence stores code-declared schedule state with schedule key, job type, cadence, enablement, next run, lease, failure, and timestamp fields. / Persistence enforces uniqueness for schedule keys and due slots and provides indexed due-schedule polling. | none | Inseparable because proof is one coherent slice. |
| T-S001-02 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Add scheduler run and lease recovery storage | scheduler storage | Scheduler run history records scheduled slot status, linked job id when enqueued, attempts, safe error category/summary, and timestamps. / Stale leases can expire and become eligible for retry without deleting run history. | none | Inseparable because proof is one coherent slice. |
| T-S002-01 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Add code-declared recurring schedule registry | scheduler seam | A code-declared registry accepts schedule definitions with stable key, job type, payload version, cadence, enablement, and payload factory. / Registry definitions can compute a due slot and deterministic idempotency key for enqueue. | none | Inseparable because proof is one coherent slice. |
| T-S002-02 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Validate schedule definitions and preserve enqueue rejection | scheduler seam | Registry validation rejects duplicate keys, invalid cadence, unknown job type, unsupported payload version, unsafe payloads, and forbidden secrets/session material. / Normal enqueue requests still reject recurringSchedule as deferred. | none | Inseparable because proof is one coherent slice. |
| T-S003-01 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Find due schedules and acquire scheduler leases | scheduler seam | Scheduler runtime finds due enabled schedules using bounded batch polling and indexed fields. / Runtime acquires a lease before enqueue and prevents two scheduler processes from enqueueing the same due slot. | none | Inseparable because proof is one coherent slice. |
| T-S003-02 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Enqueue due schedules and record outcomes | scheduler seam | Runtime enqueues through the jobProcessing public seam with deterministic idempotency keys. / Runtime records enqueued, skipped-overlap, retryable failure, and terminal failure outcomes with safe error summaries. | none | Inseparable because proof is one coherent slice. |
| T-S003-03 | single-behavior | 1 | One criterion only. | Add scheduler runtime command | scheduler seam | Package/runtime documentation provides a scheduler process command without changing the HTTP server into a worker. | none | Already smallest useful task. |
| T-S004-01 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Record Organization export first-consumer deferral | scheduler seam | Organization export cleanup and timeout-sweep schedules are explicitly deferred to the Organization export slice. / The scheduler unit proof uses generic code-declared platform maintenance schedules rather than feature-owned Organization export schedules. | none | Inseparable because proof is one coherent slice. |
| T-S004-02 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Prove platform-only source boundary | scheduler seam | Scheduler runtime and registry source do not import `organizationExports`. / The scheduler unit proof uses generic code-declared platform maintenance schedules rather than feature-owned Organization export schedules. | none | Inseparable because proof is one coherent slice. |
| T-S004-03 | single-behavior | 1 | One criterion only. | Prove no Organization export import in scheduler source | scheduler seam | Scheduler runtime and registry source do not import `organizationExports`. | none | Already smallest useful task. |
| T-S005-01 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Close scheduler ADR and architecture evidence | scheduler seam | ADR-0046 is promoted to Accepted or superseded by a concrete scheduler ADR after implementation lands. / jobProcessing manifest and generated dependency graph reflect new scheduler seams/dependencies while Organization export remains unchanged. | none | Inseparable because proof is one coherent slice. |
| T-S005-02 | inseparable-two-ac-slice | 2 | Two criteria are inseparable for one proof target. | Refresh scheduler operations and verification docs | docs artifact | Docs describe scheduler foundation, failure evidence, and remaining first-consumer deferred behavior accurately. / Bootstrap, helper, or deployment docs mention the scheduler process when it becomes a normal runtime. | none | Inseparable because proof is one coherent slice. |
| T-S005-03 | single-behavior | 1 | One criterion only. | Record scheduler final proof summary | scheduler seam | Closeout records the exact tests/gates run after the final scheduler implementation change. | none | Already smallest useful task. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S000-01 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S000-02 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S001-01 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S001-02 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S002-01 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S002-02 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S003-01 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S003-02 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S003-03 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S004-01 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S004-02 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S004-03 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S005-01 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S005-02 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |
| T-S005-03 | source-truth-mismatch | If story, steering, blueprint, or existing code disagree, do not choose silently. | Stop and route to Technical Steering or story refinement. | no | Scheduler work is platform-sensitive. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S000-01 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S000-02 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S001-01 | src/features/jobProcessing/persistence/**; tests/integration/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S001-02 | src/features/jobProcessing/persistence/**; tests/integration/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S002-01 | src/features/jobProcessing/domain/**; src/features/jobProcessing/index.ts; tests/unit/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S002-02 | src/features/jobProcessing/domain/**; tests/unit/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S003-01 | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S003-02 | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S003-03 | src/jobScheduler.ts; package.json; src/features/jobProcessing/**; tests/unit/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S004-01 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S004-02 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S004-03 | src/jobScheduler.ts; src/features/jobProcessing/**; tests/unit/jobProcessing/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S005-01 | docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md; docs/architecture/generated/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S005-02 | docs/features/organization-exports.md; docs/workspace/runbooks/**; docs/architecture/guides/**; docs/workspace/implementation-blueprints/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |
| T-S005-03 | docs/workspace/test-run-summaries/**; docs/workspace/qa-evidence/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | jobProcessing enqueue, registry, repository, worker seams where relevant | scheduler steering, blueprint, ADR-0046, source story |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Frontend Change Class Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Frontend Performance Posture

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Design-System Seam Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Design-System Seam Class Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Frontend Adoption Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Frontend Security Evidence

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Frontend Permission Rendering Evidence

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Frontend Runtime Data And Mock Honesty

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Vertical Slice Coupling

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Vertical Slice Split Pressure

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Platform Seam Contract

| Task ID | Seam Kind | Compatibility Mode | Approved Authority Source | Seam Owner / Location | Seam Source Inventory | Seam Change Scope | Exact Write Envelope | Why Not Feature-Local | Current / Future / Unsupported Consumers | Compatibility Contract | Representative Consumer Proof | Runtime / Restart Impact | Rollout / Backout Posture | Artifact / Materialization Impact | Generated / Apply / Check Command | Expected Seam Output | Architecture / Standards Boundary | Split / Blocked Follow-Up | Proof Commands | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Platform Seam Class Contract

| Task ID | Platform Seam Class | Class-Specific Required Proof | Required Consumer Coverage | Runtime / Materialization Expectation | Forbidden Contamination / Split Notes |
| --- | --- | --- | --- | --- | --- |

## Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S002-01 | domain-behavior | scheduler story packet, Technical Steering, ADR-0046, and implementation blueprint | src/features/jobProcessing | new-capability-file | src/features/jobProcessing/domain/**; src/features/jobProcessing/index.ts; tests/unit/jobProcessing/** | src/features/jobProcessing/domain/**; src/features/jobProcessing/index.ts; tests/unit/jobProcessing/** | domain, persistence or integration, and tests as scoped | jobProcessing owns scheduler cadence; future consuming feature owns its own behavior and lifecycle | No public API route or wire contract change. | platform-internal jobs only; no Organization export authz, tenant, allow/deny, or lifecycle behavior changes in this platform-only slice | No schema change in this task; schema/index work is already split to DEV:migration-persistence. | Manifest impact handled in closeout if public seams change. | source, source/tests | not-applicable: no scaffold command | Add code-declared recurring schedule registry behavior | already split to DEV:migration-persistence where schema/index work is needed; DOC:api-contract, DOC:permission-mapping, DEV:platform-seam, TEST:test-only, and EVIDENCE:qa-evidence are not needed for this task | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing | Run formatter; generated dependency graph only if manifest changes. | Human review if authority or lifecycle changes. |
| T-S002-02 | domain-behavior | scheduler story packet, Technical Steering, ADR-0046, and implementation blueprint | src/features/jobProcessing | new-capability-file | src/features/jobProcessing/domain/**; tests/unit/jobProcessing/** | src/features/jobProcessing/domain/**; tests/unit/jobProcessing/** | domain, persistence or integration, and tests as scoped | jobProcessing owns scheduler cadence; future consuming feature owns its own behavior and lifecycle | No public API route or wire contract change. | platform-internal jobs only; no Organization export authz, tenant, allow/deny, or lifecycle behavior changes in this platform-only slice | No schema change in this task; schema/index work is already split to DEV:migration-persistence. | Manifest impact handled in closeout if public seams change. | source/tests, tests | not-applicable: no scaffold command | Validate schedule definitions and preserve enqueue rejection behavior | already split to DEV:migration-persistence where schema/index work is needed; DOC:api-contract, DOC:permission-mapping, DEV:platform-seam, TEST:test-only, and EVIDENCE:qa-evidence are not needed for this task | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing | Run formatter; generated dependency graph only if manifest changes. | Human review if authority or lifecycle changes. |
| T-S003-01 | background-job-handler | scheduler story packet, Technical Steering, ADR-0046, and implementation blueprint | src/features/jobProcessing | new-capability-file | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | domain, persistence or integration, and tests as scoped | jobProcessing owns scheduler cadence; future consuming feature owns its own behavior and lifecycle | No public API route or wire contract change. | platform-internal jobs only; no Organization export authz, tenant, allow/deny, or lifecycle behavior changes in this platform-only slice | Repository and persistence behavior consume scheduler storage from DEV:migration-persistence tasks. | Manifest impact handled in closeout if public seams change. | source/tests | not-applicable: no scaffold command | Find due schedules and acquire scheduler leases behavior | already split to DEV:migration-persistence where schema/index work is needed; DOC:api-contract, DOC:permission-mapping, DEV:platform-seam, TEST:test-only, and EVIDENCE:qa-evidence are not needed for this task | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing | Run formatter; generated dependency graph only if manifest changes. | Human review if authority or lifecycle changes. |
| T-S003-02 | background-job-handler | scheduler story packet, Technical Steering, ADR-0046, and implementation blueprint | src/features/jobProcessing | new-capability-file | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | domain, persistence or integration, and tests as scoped | jobProcessing owns scheduler cadence; future consuming feature owns its own behavior and lifecycle | No public API route or wire contract change. | platform-internal jobs only; no Organization export authz, tenant, allow/deny, or lifecycle behavior changes in this platform-only slice | Repository and persistence behavior consume scheduler storage from DEV:migration-persistence tasks. | Manifest impact handled in closeout if public seams change. | source/tests | not-applicable: no scaffold command | Enqueue due schedules and record outcomes behavior | already split to DEV:migration-persistence where schema/index work is needed; DOC:api-contract, DOC:permission-mapping, DEV:platform-seam, TEST:test-only, and EVIDENCE:qa-evidence are not needed for this task | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing | Run formatter; generated dependency graph only if manifest changes. | Human review if authority or lifecycle changes. |
| T-S003-03 | background-job-handler | scheduler story packet, Technical Steering, ADR-0046, and implementation blueprint | src/features/jobProcessing | new-capability-file | src/jobScheduler.ts; package.json; src/features/jobProcessing/**; tests/unit/jobProcessing/** | src/jobScheduler.ts; package.json; src/features/jobProcessing/**; tests/unit/jobProcessing/** | domain, persistence or integration, and tests as scoped | jobProcessing owns scheduler cadence; future consuming feature owns its own behavior and lifecycle | No public API route or wire contract change. | platform-internal jobs only; no Organization export authz, tenant, allow/deny, or lifecycle behavior changes in this platform-only slice | Repository and persistence behavior consume scheduler storage from DEV:migration-persistence tasks. | Manifest impact handled in closeout if public seams change. | package/runbook docs | not-applicable: no scaffold command | Add scheduler runtime command behavior | already split to DEV:migration-persistence where schema/index work is needed; DOC:api-contract, DOC:permission-mapping, DEV:platform-seam, TEST:test-only, and EVIDENCE:qa-evidence are not needed for this task | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing | Run formatter; generated dependency graph only if manifest changes. | Human review if authority or lifecycle changes. |
| T-S004-01 | domain-behavior | scheduler story packet, Technical Steering, ADR-0046, and implementation blueprint | src/features/jobProcessing plus scheduler deferral docs | existing-capability-file | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | domain, persistence or integration, and tests as scoped | jobProcessing owns scheduler cadence; future consuming feature owns its own behavior and lifecycle | No public API route or wire contract change. | platform-internal jobs only; no Organization export authz, tenant, allow/deny, or lifecycle behavior changes in this platform-only slice | No schema change in this task; schema/index work is already split to DEV:migration-persistence. | Manifest impact handled in closeout if public seams change. | source/tests, docs | not-applicable: no scaffold command | Record Organization export first-consumer deferral behavior | already split to DEV:migration-persistence where schema/index work is needed; DOC:api-contract, DOC:permission-mapping, DEV:platform-seam, TEST:test-only, and EVIDENCE:qa-evidence are not needed for this task | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing | Run formatter; generated dependency graph only if manifest changes. | Human review if authority or lifecycle changes. |
| T-S004-02 | domain-behavior | scheduler story packet, Technical Steering, ADR-0046, and implementation blueprint | src/features/jobProcessing plus scheduler deferral docs | existing-capability-file | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | domain, persistence or integration, and tests as scoped | jobProcessing owns scheduler cadence; future consuming feature owns its own behavior and lifecycle | No public API route or wire contract change. | platform-internal jobs only; no Organization export authz, tenant, allow/deny, or lifecycle behavior changes in this platform-only slice | No schema change in this task; schema/index work is already split to DEV:migration-persistence. | Manifest impact handled in closeout if public seams change. | source/tests, docs | not-applicable: no scaffold command | Prove platform-only source boundary behavior | already split to DEV:migration-persistence where schema/index work is needed; DOC:api-contract, DOC:permission-mapping, DEV:platform-seam, TEST:test-only, and EVIDENCE:qa-evidence are not needed for this task | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing | Run formatter; generated dependency graph only if manifest changes. | Human review if authority or lifecycle changes. |
| T-S004-03 | domain-behavior | scheduler story packet, Technical Steering, ADR-0046, and implementation blueprint | src/features/jobProcessing plus scheduler deferral docs | existing-capability-file | src/jobScheduler.ts; src/features/jobProcessing/**; tests/unit/jobProcessing/** | src/jobScheduler.ts; src/features/jobProcessing/**; tests/unit/jobProcessing/** | domain, persistence or integration, and tests as scoped | jobProcessing owns scheduler cadence; future consuming feature owns its own behavior and lifecycle | No public API route or wire contract change. | platform-internal jobs only; no Organization export authz, tenant, allow/deny, or lifecycle behavior changes in this platform-only slice | No schema change in this task; schema/index work is already split to DEV:migration-persistence. | Manifest impact handled in closeout if public seams change. | tests | not-applicable: no scaffold command | Prove no Organization export import in scheduler source behavior | already split to DEV:migration-persistence where schema/index work is needed; DOC:api-contract, DOC:permission-mapping, DEV:platform-seam, TEST:test-only, and EVIDENCE:qa-evidence are not needed for this task | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing | Run formatter; generated dependency graph only if manifest changes. | Human review if authority or lifecycle changes. |

## Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | new-migration | Inspect live schema, existing scheduler absence, and jobProcessing migrations before editing. | Validate source data shape from scheduler blueprint fields. | Per-row eligibility is new-record only; schedule key and due slot rows must satisfy constraints. | rejected-row behavior: invalid fixtures fail with no silent conversion. | new migration .sql with zero-padded name; do not edit applied migration files. | SQL semantics verify uniqueness, indexes, lease timestamps, and status checks. | representative read/write proof for schedule definition create/read/update and due polling. | Review Postgres harness if migration bootstrap changes. |
| T-S001-02 | new-migration | Inspect live schema, existing scheduler absence, and jobProcessing migrations before editing. | Validate source data shape from scheduler run and lease blueprint fields. | Per-row eligibility is new-record only; run slot and lease rows must satisfy constraints. | rejected-row behavior: invalid fixtures fail with no silent conversion. | new migration .sql with zero-padded name; do not edit applied migration files. | SQL semantics verify run status uniqueness, indexes, lease timestamps, and safe error columns. | representative read/write proof for run history create/read/write, lease recovery, and retry. | Review Postgres harness if migration bootstrap changes. |

## Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-S001-01 | new-migration | migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and read/write paths | schedule definitions, schedule keys, cadence, enablement, next run, lease, failure, timestamps, indexes, and uniqueness | read/write persistence-backed tests for create, read, update, due polling, and constraints | not-applicable: behavior work is split to DEV:backend tasks |
| T-S001-02 | new-migration | migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and read/write paths | run records, due slots, linked job id, attempts, safe errors, timestamps, lease expiry, indexes, and uniqueness | read/write persistence-backed tests for run create, lease acquisition, recovery, retry, and history retention | not-applicable: behavior work is split to DEV:backend tasks |

## Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S000-01 | narrow-pattern | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | not-applicable |
| T-S000-02 | narrow-pattern | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | not-applicable |
| T-S001-01 | narrow-pattern | src/features/jobProcessing/persistence/**; tests/integration/jobProcessing/** | not-applicable |
| T-S001-02 | narrow-pattern | src/features/jobProcessing/persistence/**; tests/integration/jobProcessing/** | not-applicable |
| T-S002-01 | narrow-pattern | src/features/jobProcessing/domain/**; src/features/jobProcessing/index.ts; tests/unit/jobProcessing/** | not-applicable |
| T-S002-02 | narrow-pattern | src/features/jobProcessing/domain/**; tests/unit/jobProcessing/** | not-applicable |
| T-S003-01 | narrow-pattern | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | not-applicable |
| T-S003-02 | narrow-pattern | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | not-applicable |
| T-S003-03 | narrow-pattern | src/jobScheduler.ts; package.json; src/features/jobProcessing/**; tests/unit/jobProcessing/** | not-applicable |
| T-S004-01 | narrow-pattern | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | not-applicable |
| T-S004-02 | narrow-pattern | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | not-applicable |
| T-S004-03 | narrow-pattern | src/jobScheduler.ts; src/features/jobProcessing/**; tests/unit/jobProcessing/** | not-applicable |
| T-S005-01 | narrow-pattern | docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md; docs/architecture/generated/** | not-applicable |
| T-S005-02 | narrow-pattern | docs/features/organization-exports.md; docs/workspace/runbooks/**; docs/architecture/guides/**; docs/workspace/implementation-blueprints/** | not-applicable |
| T-S005-03 | narrow-pattern | docs/workspace/test-run-summaries/**; docs/workspace/qa-evidence/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | not-applicable |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S000-01 | task-specific | Create scheduler active behavior map | Broad static gates supplement focused proof. |
| T-S000-02 | task-specific | Record scheduler deferrals | Broad static gates supplement focused proof. |
| T-S001-01 | task-specific | Add recurring schedule definition storage | Broad static gates supplement focused proof. |
| T-S001-02 | task-specific | Add scheduler run and lease recovery storage | Broad static gates supplement focused proof. |
| T-S002-01 | task-specific | Add code-declared recurring schedule registry | Broad static gates supplement focused proof. |
| T-S002-02 | task-specific | Validate schedule definitions and preserve enqueue rejection | Broad static gates supplement focused proof. |
| T-S003-01 | task-specific | Find due schedules and acquire scheduler leases | Broad static gates supplement focused proof. |
| T-S003-02 | task-specific | Enqueue due schedules and record outcomes | Broad static gates supplement focused proof. |
| T-S003-03 | task-specific | Add scheduler runtime command | Broad static gates supplement focused proof. |
| T-S004-01 | task-specific | Record Organization export first-consumer deferral | Broad static gates supplement focused proof. |
| T-S004-02 | task-specific | Prove platform-only source boundary | Broad static gates supplement focused proof. |
| T-S004-03 | task-specific | Prove no Organization export import in scheduler source | Broad static gates supplement focused proof. |
| T-S005-01 | task-specific | Close scheduler ADR and architecture evidence | Broad static gates supplement focused proof. |
| T-S005-02 | task-specific | Refresh scheduler operations and verification docs | Broad static gates supplement focused proof. |
| T-S005-03 | task-specific | Record scheduler final proof summary | Broad static gates supplement focused proof. |

## Refactor-First Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Architecture Foundation Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Standards Compliance Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Standards Update Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Permission Mapping Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## API Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Data Dictionary Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Test-Only Coverage Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Test Suite Alignment Contract

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Capability Permission / State Matrix

| Task ID | Not Applicable | Rationale | Evidence | Split Notes |
| --- | --- | --- | --- | --- |

## Architecture Update Contract

| Task ID | Architecture Update Class | Approved Decision Source | Decision Source Path / Reference | Decision Summary | Architecture Artifact Target | Consistency Sweep Targets | Authority / Consistency Inventory | Downstream Impact | Compatibility Posture | Forbidden Implementation / Standards Work | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-01 | adr-amendment | ADR | docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md | Promote or supersede deferred scheduler cadence decision after implementation evidence exists. | docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md | docs/architecture/adr/README.md; docs/architecture/generated/**; docs/features/organization-exports.md; docs/workspace/runbooks/** | docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md plus docs/architecture/generated/** source inventory for scheduler cadence truth | Scheduler cadence truth changes from deferred to implemented after the backend slice lands. | additive-compatible architecture documentation update | no implementation, no standards authority change, and no app/runtime code changes in this task | Human review if ADR decision conflicts with implementation evidence. | git diff --check; npm run check:static |

## Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff Check Command | Human Review Boundary | Validation Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S000-01 | workspace-status | stale-artifact-sweep | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; scheduler story and implementation diff | scheduler steering, story, implementation diff, and ADR-0046 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | current-state update | sweep docs/runbooks/ADR/implementation-blueprint scope and route API to DOC:api-contract, architecture to GOV:architecture-update, evidence to EVIDENCE:qa-evidence | not-applicable for API/data-dictionary/permission/design-system; GOV:architecture-update and EVIDENCE:qa-evidence are split where needed | git diff --check; npm run check:static | Human review if docs imply unimplemented cadence. | npm run check:static |
| T-S000-02 | workspace-status | stale-artifact-sweep | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; scheduler story and implementation diff | scheduler steering, story, implementation diff, and ADR-0046 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | current-state update | sweep docs/runbooks/ADR/implementation-blueprint scope and route API to DOC:api-contract, architecture to GOV:architecture-update, evidence to EVIDENCE:qa-evidence | not-applicable for API/data-dictionary/permission/design-system; GOV:architecture-update and EVIDENCE:qa-evidence are split where needed | git diff --check; npm run check:static | Human review if docs imply unimplemented cadence. | npm run check:static |
| T-S005-02 | ordinary-doc-sync | stale-artifact-sweep | docs/features/organization-exports.md; docs/workspace/runbooks/**; docs/architecture/guides/**; docs/workspace/implementation-blueprints/**; scheduler story and implementation diff | scheduler steering, story, implementation diff, and ADR-0046 | docs/features/organization-exports.md; docs/workspace/runbooks/**; docs/architecture/guides/**; docs/workspace/implementation-blueprints/** | current-state update | sweep docs/runbooks/ADR/implementation-blueprint scope and route API to DOC:api-contract, architecture to GOV:architecture-update, evidence to EVIDENCE:qa-evidence | not-applicable for API/data-dictionary/permission/design-system; GOV:architecture-update and EVIDENCE:qa-evidence are split where needed | git diff --check; npm run check:static | Human review if docs imply unimplemented cadence. | npm run check:static |

## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live / Runtime Payload Evidence | Mock-Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S005-03 | evidence-sweep | docs/workspace/test-run-summaries/**; docs/workspace/qa-evidence/**; command output from scheduler-focused tests and static gates | focused command plus static gate summary | runtime evidence required only if scheduler process command is exercised | fixtures must match production scheduler contracts | final scheduler proof summary under docs/workspace/test-run-summaries/** or docs/workspace/qa-evidence/** | none known before implementation | review if proof unavailable |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task Or Owner |
| --- | --- | --- | --- | --- | --- |
| T-S000-01 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S000-02 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S001-01 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S001-02 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S002-01 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S002-02 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S003-01 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S003-02 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S003-03 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S004-01 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S004-02 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S004-03 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S005-01 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S005-02 | not-run: not required for scoped task | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |
| T-S005-03 | npm run test:coverage-strength | not-run: not required for scoped task | none | not-applicable: no debt command required for this task | none |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Why Forbidden | Escalation Path |
| --- | --- | --- | --- |
| T-S000-01 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S000-02 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S001-01 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S001-02 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S002-01 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S002-02 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S003-01 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S003-02 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S003-03 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S004-01 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S004-02 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S004-03 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S005-01 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S005-02 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |
| T-S005-03 | Recurring cadence, operator UI, dynamic schedules, or public logo jobs may be added without explicit scope. | Steering defers these behaviors. | Stop and route to Technical Steering. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Reference | Approval Status | Evidence |
| --- | --- | --- | --- | --- |
| T-S000-01 | DOC:docs-artifact | docs-artifact-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S000-02 | DOC:docs-artifact | docs-artifact-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S001-01 | DEV:migration-persistence | migration-persistence-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S001-02 | DEV:migration-persistence | migration-persistence-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S002-01 | DEV:backend | backend-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S002-02 | DEV:backend | backend-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S003-01 | DEV:backend | backend-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S003-02 | DEV:backend | backend-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S003-03 | DEV:backend | backend-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S004-01 | DEV:backend | backend-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S004-02 | DEV:backend | backend-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S004-03 | DEV:backend | backend-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S005-01 | GOV:architecture-update | architecture-update-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S005-02 | DOC:docs-artifact | docs-artifact-task-guardrail.md | approved | Task follows matching guardrail reference. |
| T-S005-03 | EVIDENCE:qa-evidence | qa-evidence-task-guardrail.md | approved | Task follows matching guardrail reference. |

## Task Guardrail Evidence

| Task ID | Guardrail Check ID | Status | Evidence |
| --- | --- | --- | --- |
| T-S000-01 | docs-source-truth-reviewed | pass | docs-source-truth-reviewed covered by task packet row. |
| T-S000-01 | docs-artifact-class | pass | docs-artifact-class covered by task packet row. |
| T-S000-01 | docs-scriptable-source-inventory | pass | docs-scriptable-source-inventory covered by task packet row. |
| T-S000-01 | docs-stale-artifact-sweep | pass | docs-stale-artifact-sweep covered by task packet row. |
| T-S000-01 | docs-status-posture | pass | docs-status-posture covered by task packet row. |
| T-S000-01 | docs-validation-command | pass | docs-validation-command covered by task packet row. |
| T-S000-01 | docs-specialized-routing | pass | docs-specialized-routing covered by task packet row. |
| T-S000-02 | docs-source-truth-reviewed | pass | docs-source-truth-reviewed covered by task packet row. |
| T-S000-02 | docs-artifact-class | pass | docs-artifact-class covered by task packet row. |
| T-S000-02 | docs-scriptable-source-inventory | pass | docs-scriptable-source-inventory covered by task packet row. |
| T-S000-02 | docs-stale-artifact-sweep | pass | docs-stale-artifact-sweep covered by task packet row. |
| T-S000-02 | docs-status-posture | pass | docs-status-posture covered by task packet row. |
| T-S000-02 | docs-validation-command | pass | docs-validation-command covered by task packet row. |
| T-S000-02 | docs-specialized-routing | pass | docs-specialized-routing covered by task packet row. |
| T-S001-01 | migration-source-authority | pass | migration-source-authority covered by task packet row. |
| T-S001-01 | migration-change-class | pass | migration-change-class covered by task packet row. |
| T-S001-01 | migration-live-schema | pass | migration-live-schema covered by task packet row. |
| T-S001-01 | migration-storage-decision-boundary | pass | migration-storage-decision-boundary covered by task packet row. |
| T-S001-01 | migration-source-data-shape | pass | migration-source-data-shape covered by task packet row. |
| T-S001-01 | migration-per-row-eligibility | pass | migration-per-row-eligibility covered by task packet row. |
| T-S001-01 | migration-rejected-row-behavior | pass | migration-rejected-row-behavior covered by task packet row. |
| T-S001-01 | migration-compatibility-repair | pass | migration-compatibility-repair covered by task packet row. |
| T-S001-01 | migration-applied-file-safety | pass | migration-applied-file-safety covered by task packet row. |
| T-S001-01 | migration-index-normalization-uniqueness | pass | migration-index-normalization-uniqueness covered by task packet row. |
| T-S001-01 | migration-security-tenant-proof | pass | migration-security-tenant-proof covered by task packet row. |
| T-S001-01 | migration-read-write-proof | pass | migration-read-write-proof covered by task packet row. |
| T-S001-01 | migration-postgres-harness | pass | migration-postgres-harness covered by task packet row. |
| T-S001-02 | migration-source-authority | pass | migration-source-authority covered by task packet row. |
| T-S001-02 | migration-change-class | pass | migration-change-class covered by task packet row. |
| T-S001-02 | migration-live-schema | pass | migration-live-schema covered by task packet row. |
| T-S001-02 | migration-storage-decision-boundary | pass | migration-storage-decision-boundary covered by task packet row. |
| T-S001-02 | migration-source-data-shape | pass | migration-source-data-shape covered by task packet row. |
| T-S001-02 | migration-per-row-eligibility | pass | migration-per-row-eligibility covered by task packet row. |
| T-S001-02 | migration-rejected-row-behavior | pass | migration-rejected-row-behavior covered by task packet row. |
| T-S001-02 | migration-compatibility-repair | pass | migration-compatibility-repair covered by task packet row. |
| T-S001-02 | migration-applied-file-safety | pass | migration-applied-file-safety covered by task packet row. |
| T-S001-02 | migration-index-normalization-uniqueness | pass | migration-index-normalization-uniqueness covered by task packet row. |
| T-S001-02 | migration-security-tenant-proof | pass | migration-security-tenant-proof covered by task packet row. |
| T-S001-02 | migration-read-write-proof | pass | migration-read-write-proof covered by task packet row. |
| T-S001-02 | migration-postgres-harness | pass | migration-postgres-harness covered by task packet row. |
| T-S002-01 | backend-source-authority | pass | backend-source-authority covered by task packet row. |
| T-S002-01 | backend-change-class | pass | backend-change-class covered by task packet row. |
| T-S002-01 | backend-owning-feature | pass | backend-owning-feature covered by task packet row. |
| T-S002-01 | backend-source-inventory | pass | backend-source-inventory covered by task packet row. |
| T-S002-01 | backend-exact-write-envelope | pass | backend-exact-write-envelope covered by task packet row. |
| T-S002-01 | backend-layer-responsibilities | pass | backend-layer-responsibilities covered by task packet row. |
| T-S002-01 | backend-cross-feature-seams | pass | backend-cross-feature-seams covered by task packet row. |
| T-S002-01 | backend-authz-tenant-lifecycle | pass | backend-authz-tenant-lifecycle covered by task packet row. |
| T-S002-01 | backend-api-contract-boundary | pass | backend-api-contract-boundary covered by task packet row. |
| T-S002-01 | backend-persistence-migration-boundary | pass | backend-persistence-migration-boundary covered by task packet row. |
| T-S002-01 | backend-scripted-scaffold-posture | pass | backend-scripted-scaffold-posture covered by task packet row. |
| T-S002-01 | backend-artifact-obligations | pass | backend-artifact-obligations covered by task packet row. |
| T-S002-01 | backend-expected-output | pass | backend-expected-output covered by task packet row. |
| T-S002-01 | backend-split-routing | pass | backend-split-routing covered by task packet row. |
| T-S002-01 | backend-proof-commands | pass | backend-proof-commands covered by task packet row. |
| T-S002-01 | backend-human-review-boundary | pass | backend-human-review-boundary covered by task packet row. |
| T-S002-02 | backend-source-authority | pass | backend-source-authority covered by task packet row. |
| T-S002-02 | backend-change-class | pass | backend-change-class covered by task packet row. |
| T-S002-02 | backend-owning-feature | pass | backend-owning-feature covered by task packet row. |
| T-S002-02 | backend-source-inventory | pass | backend-source-inventory covered by task packet row. |
| T-S002-02 | backend-exact-write-envelope | pass | backend-exact-write-envelope covered by task packet row. |
| T-S002-02 | backend-layer-responsibilities | pass | backend-layer-responsibilities covered by task packet row. |
| T-S002-02 | backend-cross-feature-seams | pass | backend-cross-feature-seams covered by task packet row. |
| T-S002-02 | backend-authz-tenant-lifecycle | pass | backend-authz-tenant-lifecycle covered by task packet row. |
| T-S002-02 | backend-api-contract-boundary | pass | backend-api-contract-boundary covered by task packet row. |
| T-S002-02 | backend-persistence-migration-boundary | pass | backend-persistence-migration-boundary covered by task packet row. |
| T-S002-02 | backend-scripted-scaffold-posture | pass | backend-scripted-scaffold-posture covered by task packet row. |
| T-S002-02 | backend-artifact-obligations | pass | backend-artifact-obligations covered by task packet row. |
| T-S002-02 | backend-expected-output | pass | backend-expected-output covered by task packet row. |
| T-S002-02 | backend-split-routing | pass | backend-split-routing covered by task packet row. |
| T-S002-02 | backend-proof-commands | pass | backend-proof-commands covered by task packet row. |
| T-S002-02 | backend-human-review-boundary | pass | backend-human-review-boundary covered by task packet row. |
| T-S003-01 | backend-source-authority | pass | backend-source-authority covered by task packet row. |
| T-S003-01 | backend-change-class | pass | backend-change-class covered by task packet row. |
| T-S003-01 | backend-owning-feature | pass | backend-owning-feature covered by task packet row. |
| T-S003-01 | backend-source-inventory | pass | backend-source-inventory covered by task packet row. |
| T-S003-01 | backend-exact-write-envelope | pass | backend-exact-write-envelope covered by task packet row. |
| T-S003-01 | backend-layer-responsibilities | pass | backend-layer-responsibilities covered by task packet row. |
| T-S003-01 | backend-cross-feature-seams | pass | backend-cross-feature-seams covered by task packet row. |
| T-S003-01 | backend-authz-tenant-lifecycle | pass | backend-authz-tenant-lifecycle covered by task packet row. |
| T-S003-01 | backend-api-contract-boundary | pass | backend-api-contract-boundary covered by task packet row. |
| T-S003-01 | backend-persistence-migration-boundary | pass | backend-persistence-migration-boundary covered by task packet row. |
| T-S003-01 | backend-scripted-scaffold-posture | pass | backend-scripted-scaffold-posture covered by task packet row. |
| T-S003-01 | backend-artifact-obligations | pass | backend-artifact-obligations covered by task packet row. |
| T-S003-01 | backend-expected-output | pass | backend-expected-output covered by task packet row. |
| T-S003-01 | backend-split-routing | pass | backend-split-routing covered by task packet row. |
| T-S003-01 | backend-proof-commands | pass | backend-proof-commands covered by task packet row. |
| T-S003-01 | backend-human-review-boundary | pass | backend-human-review-boundary covered by task packet row. |
| T-S003-02 | backend-source-authority | pass | backend-source-authority covered by task packet row. |
| T-S003-02 | backend-change-class | pass | backend-change-class covered by task packet row. |
| T-S003-02 | backend-owning-feature | pass | backend-owning-feature covered by task packet row. |
| T-S003-02 | backend-source-inventory | pass | backend-source-inventory covered by task packet row. |
| T-S003-02 | backend-exact-write-envelope | pass | backend-exact-write-envelope covered by task packet row. |
| T-S003-02 | backend-layer-responsibilities | pass | backend-layer-responsibilities covered by task packet row. |
| T-S003-02 | backend-cross-feature-seams | pass | backend-cross-feature-seams covered by task packet row. |
| T-S003-02 | backend-authz-tenant-lifecycle | pass | backend-authz-tenant-lifecycle covered by task packet row. |
| T-S003-02 | backend-api-contract-boundary | pass | backend-api-contract-boundary covered by task packet row. |
| T-S003-02 | backend-persistence-migration-boundary | pass | backend-persistence-migration-boundary covered by task packet row. |
| T-S003-02 | backend-scripted-scaffold-posture | pass | backend-scripted-scaffold-posture covered by task packet row. |
| T-S003-02 | backend-artifact-obligations | pass | backend-artifact-obligations covered by task packet row. |
| T-S003-02 | backend-expected-output | pass | backend-expected-output covered by task packet row. |
| T-S003-02 | backend-split-routing | pass | backend-split-routing covered by task packet row. |
| T-S003-02 | backend-proof-commands | pass | backend-proof-commands covered by task packet row. |
| T-S003-02 | backend-human-review-boundary | pass | backend-human-review-boundary covered by task packet row. |
| T-S003-03 | backend-source-authority | pass | backend-source-authority covered by task packet row. |
| T-S003-03 | backend-change-class | pass | backend-change-class covered by task packet row. |
| T-S003-03 | backend-owning-feature | pass | backend-owning-feature covered by task packet row. |
| T-S003-03 | backend-source-inventory | pass | backend-source-inventory covered by task packet row. |
| T-S003-03 | backend-exact-write-envelope | pass | backend-exact-write-envelope covered by task packet row. |
| T-S003-03 | backend-layer-responsibilities | pass | backend-layer-responsibilities covered by task packet row. |
| T-S003-03 | backend-cross-feature-seams | pass | backend-cross-feature-seams covered by task packet row. |
| T-S003-03 | backend-authz-tenant-lifecycle | pass | backend-authz-tenant-lifecycle covered by task packet row. |
| T-S003-03 | backend-api-contract-boundary | pass | backend-api-contract-boundary covered by task packet row. |
| T-S003-03 | backend-persistence-migration-boundary | pass | backend-persistence-migration-boundary covered by task packet row. |
| T-S003-03 | backend-scripted-scaffold-posture | pass | backend-scripted-scaffold-posture covered by task packet row. |
| T-S003-03 | backend-artifact-obligations | pass | backend-artifact-obligations covered by task packet row. |
| T-S003-03 | backend-expected-output | pass | backend-expected-output covered by task packet row. |
| T-S003-03 | backend-split-routing | pass | backend-split-routing covered by task packet row. |
| T-S003-03 | backend-proof-commands | pass | backend-proof-commands covered by task packet row. |
| T-S003-03 | backend-human-review-boundary | pass | backend-human-review-boundary covered by task packet row. |
| T-S004-01 | backend-source-authority | pass | backend-source-authority covered by task packet row. |
| T-S004-01 | backend-change-class | pass | backend-change-class covered by task packet row. |
| T-S004-01 | backend-owning-feature | pass | backend-owning-feature covered by task packet row. |
| T-S004-01 | backend-source-inventory | pass | backend-source-inventory covered by task packet row. |
| T-S004-01 | backend-exact-write-envelope | pass | backend-exact-write-envelope covered by task packet row. |
| T-S004-01 | backend-layer-responsibilities | pass | backend-layer-responsibilities covered by task packet row. |
| T-S004-01 | backend-cross-feature-seams | pass | backend-cross-feature-seams covered by task packet row. |
| T-S004-01 | backend-authz-tenant-lifecycle | pass | backend-authz-tenant-lifecycle covered by task packet row. |
| T-S004-01 | backend-api-contract-boundary | pass | backend-api-contract-boundary covered by task packet row. |
| T-S004-01 | backend-persistence-migration-boundary | pass | backend-persistence-migration-boundary covered by task packet row. |
| T-S004-01 | backend-scripted-scaffold-posture | pass | backend-scripted-scaffold-posture covered by task packet row. |
| T-S004-01 | backend-artifact-obligations | pass | backend-artifact-obligations covered by task packet row. |
| T-S004-01 | backend-expected-output | pass | backend-expected-output covered by task packet row. |
| T-S004-01 | backend-split-routing | pass | backend-split-routing covered by task packet row. |
| T-S004-01 | backend-proof-commands | pass | backend-proof-commands covered by task packet row. |
| T-S004-01 | backend-human-review-boundary | pass | backend-human-review-boundary covered by task packet row. |
| T-S004-02 | backend-source-authority | pass | backend-source-authority covered by task packet row. |
| T-S004-02 | backend-change-class | pass | backend-change-class covered by task packet row. |
| T-S004-02 | backend-owning-feature | pass | backend-owning-feature covered by task packet row. |
| T-S004-02 | backend-source-inventory | pass | backend-source-inventory covered by task packet row. |
| T-S004-02 | backend-exact-write-envelope | pass | backend-exact-write-envelope covered by task packet row. |
| T-S004-02 | backend-layer-responsibilities | pass | backend-layer-responsibilities covered by task packet row. |
| T-S004-02 | backend-cross-feature-seams | pass | backend-cross-feature-seams covered by task packet row. |
| T-S004-02 | backend-authz-tenant-lifecycle | pass | backend-authz-tenant-lifecycle covered by task packet row. |
| T-S004-02 | backend-api-contract-boundary | pass | backend-api-contract-boundary covered by task packet row. |
| T-S004-02 | backend-persistence-migration-boundary | pass | backend-persistence-migration-boundary covered by task packet row. |
| T-S004-02 | backend-scripted-scaffold-posture | pass | backend-scripted-scaffold-posture covered by task packet row. |
| T-S004-02 | backend-artifact-obligations | pass | backend-artifact-obligations covered by task packet row. |
| T-S004-02 | backend-expected-output | pass | backend-expected-output covered by task packet row. |
| T-S004-02 | backend-split-routing | pass | backend-split-routing covered by task packet row. |
| T-S004-02 | backend-proof-commands | pass | backend-proof-commands covered by task packet row. |
| T-S004-02 | backend-human-review-boundary | pass | backend-human-review-boundary covered by task packet row. |
| T-S004-03 | backend-source-authority | pass | backend-source-authority covered by task packet row. |
| T-S004-03 | backend-change-class | pass | backend-change-class covered by task packet row. |
| T-S004-03 | backend-owning-feature | pass | backend-owning-feature covered by task packet row. |
| T-S004-03 | backend-source-inventory | pass | backend-source-inventory covered by task packet row. |
| T-S004-03 | backend-exact-write-envelope | pass | backend-exact-write-envelope covered by task packet row. |
| T-S004-03 | backend-layer-responsibilities | pass | backend-layer-responsibilities covered by task packet row. |
| T-S004-03 | backend-cross-feature-seams | pass | backend-cross-feature-seams covered by task packet row. |
| T-S004-03 | backend-authz-tenant-lifecycle | pass | backend-authz-tenant-lifecycle covered by task packet row. |
| T-S004-03 | backend-api-contract-boundary | pass | backend-api-contract-boundary covered by task packet row. |
| T-S004-03 | backend-persistence-migration-boundary | pass | backend-persistence-migration-boundary covered by task packet row. |
| T-S004-03 | backend-scripted-scaffold-posture | pass | backend-scripted-scaffold-posture covered by task packet row. |
| T-S004-03 | backend-artifact-obligations | pass | backend-artifact-obligations covered by task packet row. |
| T-S004-03 | backend-expected-output | pass | backend-expected-output covered by task packet row. |
| T-S004-03 | backend-split-routing | pass | backend-split-routing covered by task packet row. |
| T-S004-03 | backend-proof-commands | pass | backend-proof-commands covered by task packet row. |
| T-S004-03 | backend-human-review-boundary | pass | backend-human-review-boundary covered by task packet row. |
| T-S005-01 | architecture-approved-decision-source | pass | architecture-approved-decision-source covered by task packet row. |
| T-S005-01 | architecture-update-class | pass | architecture-update-class covered by task packet row. |
| T-S005-01 | architecture-authority-reviewed | pass | architecture-authority-reviewed covered by task packet row. |
| T-S005-01 | architecture-change-owner | pass | architecture-change-owner covered by task packet row. |
| T-S005-01 | architecture-output-artifact | pass | architecture-output-artifact covered by task packet row. |
| T-S005-01 | architecture-consistency-inventory | pass | architecture-consistency-inventory covered by task packet row. |
| T-S005-01 | architecture-downstream-impact | pass | architecture-downstream-impact covered by task packet row. |
| T-S005-01 | architecture-validation | pass | architecture-validation covered by task packet row. |
| T-S005-02 | docs-source-truth-reviewed | pass | docs-source-truth-reviewed covered by task packet row. |
| T-S005-02 | docs-artifact-class | pass | docs-artifact-class covered by task packet row. |
| T-S005-02 | docs-scriptable-source-inventory | pass | docs-scriptable-source-inventory covered by task packet row. |
| T-S005-02 | docs-stale-artifact-sweep | pass | docs-stale-artifact-sweep covered by task packet row. |
| T-S005-02 | docs-status-posture | pass | docs-status-posture covered by task packet row. |
| T-S005-02 | docs-validation-command | pass | docs-validation-command covered by task packet row. |
| T-S005-02 | docs-specialized-routing | pass | docs-specialized-routing covered by task packet row. |
| T-S005-03 | qa-proof-target | pass | qa-proof-target covered by task packet row. |
| T-S005-03 | qa-command-plan | pass | qa-command-plan covered by task packet row. |
| T-S005-03 | qa-evidence-class | pass | qa-evidence-class covered by task packet row. |
| T-S005-03 | qa-evidence-source-inventory | pass | qa-evidence-source-inventory covered by task packet row. |
| T-S005-03 | qa-evidence-instruments | pass | qa-evidence-instruments covered by task packet row. |
| T-S005-03 | qa-runtime-evidence | pass | qa-runtime-evidence covered by task packet row. |
| T-S005-03 | qa-mock-honesty | pass | qa-mock-honesty covered by task packet row. |
| T-S005-03 | qa-expected-output | pass | qa-expected-output covered by task packet row. |
| T-S005-03 | qa-evidence-status | pass | qa-evidence-status covered by task packet row. |
| T-S005-03 | qa-coverage-strength-summary | pass | qa-coverage-strength-summary covered by task packet row. |
| T-S005-03 | qa-human-review-boundary | pass | qa-human-review-boundary covered by task packet row. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Supplemental Guardrails | Compatibility Proof | Approval Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S000-01 | feature-local | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S000-02 | feature-local | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S001-01 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S001-02 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S002-01 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S002-02 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S003-01 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S003-02 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S003-03 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S004-01 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S004-02 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S004-03 | platform-seam | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S005-01 | feature-local | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S005-02 | feature-local | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |
| T-S005-03 | feature-local | jobProcessing / docs | same | no | not-applicable | additive compatible | approved |

## Allowed Write Set Classification

| Task ID | Allowed Path / Pattern | Write Class | Rationale |
| --- | --- | --- | --- |
| T-S000-01 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | docs-artifact | Matches task scope. |
| T-S000-02 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | docs-artifact | Matches task scope. |
| T-S001-01 | src/features/jobProcessing/persistence/**; tests/integration/jobProcessing/** | platform-seam | Matches task scope. |
| T-S001-02 | src/features/jobProcessing/persistence/**; tests/integration/jobProcessing/** | platform-seam | Matches task scope. |
| T-S002-01 | src/features/jobProcessing/domain/**; src/features/jobProcessing/index.ts; tests/unit/jobProcessing/** | platform-seam | Matches task scope. |
| T-S002-02 | src/features/jobProcessing/domain/**; tests/unit/jobProcessing/** | platform-seam | Matches task scope. |
| T-S003-01 | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | platform-seam | Matches task scope. |
| T-S003-02 | src/features/jobProcessing/domain/**; src/features/jobProcessing/persistence/**; tests/unit/jobProcessing/**; tests/integration/jobProcessing/** | platform-seam | Matches task scope. |
| T-S003-03 | src/jobScheduler.ts; package.json; src/features/jobProcessing/**; tests/unit/jobProcessing/** | platform-seam | Matches task scope. |
| T-S004-01 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | platform-seam | Matches task scope. |
| T-S004-02 | docs/workspace/capability-matrices/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/**; src/features/jobProcessing/**; tests/unit/jobProcessing/** | platform-seam | Matches task scope. |
| T-S004-03 | src/jobScheduler.ts; src/features/jobProcessing/**; tests/unit/jobProcessing/** | platform-seam | Matches task scope. |
| T-S005-01 | docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md; docs/architecture/generated/** | docs-artifact | Matches task scope. |
| T-S005-02 | docs/features/organization-exports.md; docs/workspace/runbooks/**; docs/architecture/guides/**; docs/workspace/implementation-blueprints/** | docs-artifact | Matches task scope. |
| T-S005-03 | docs/workspace/test-run-summaries/**; docs/workspace/qa-evidence/**; docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown/** | test | Matches task scope. |

## Forbidden Work

| Task ID | Forbidden Work | Reason | Route If Needed |
| --- | --- | --- | --- |
| T-S000-01 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S000-02 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S001-01 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S001-02 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S002-01 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S002-02 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S003-01 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S003-02 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S003-03 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S004-01 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S004-02 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S004-03 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S005-01 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S005-02 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |
| T-S005-03 | Frontend UI, operator API, dynamic schedules, public logo scheduled jobs. | Out of steering scope. | New Product Discovery or Technical Steering. |

## Task Acceptance Criteria Coverage

| Task ID | AC ID(s) |
| --- | --- |
| T-S000-01 | AC-S000-001, AC-S000-003 |
| T-S000-02 | AC-S000-002 |
| T-S001-01 | AC-S001-001, AC-S001-003 |
| T-S001-02 | AC-S001-002, AC-S001-004 |
| T-S002-01 | AC-S002-001, AC-S002-003 |
| T-S002-02 | AC-S002-002, AC-S002-004 |
| T-S003-01 | AC-S003-001, AC-S003-002 |
| T-S003-02 | AC-S003-003, AC-S003-004 |
| T-S003-03 | AC-S003-005 |
| T-S004-01 | AC-S004-001, AC-S004-003 |
| T-S004-02 | AC-S004-002, AC-S004-003 |
| T-S004-03 | AC-S004-004 |
| T-S005-01 | AC-S005-001, AC-S005-002 |
| T-S005-02 | AC-S005-003, AC-S005-004 |
| T-S005-03 | AC-S005-005 |

## Task Capability Coverage

| Task ID | Capability Row(s) | Coverage Status |
| --- | --- | --- |
| T-S000-01 | no scheduler matrix yet; no scheduler matrix yet | approved |
| T-S000-02 | no scheduler matrix yet | approved |
| T-S001-01 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S001-02 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S002-01 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S002-02 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S003-01 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S003-02 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S003-03 | scheduler behavior map S-000 | approved |
| T-S004-01 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S004-02 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S004-03 | scheduler behavior map S-000 | approved |
| T-S005-01 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S005-02 | scheduler behavior map S-000; scheduler behavior map S-000 | approved |
| T-S005-03 | scheduler behavior map S-000 | approved |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S000-01 | not-applicable: no prior task | Earlier scheduler facts needed. | no |
| T-S000-02 | not-applicable: no prior task | Earlier scheduler facts needed. | no |
| T-S001-01 | T-S000-01 | Earlier scheduler facts needed. | no |
| T-S001-02 | T-S000-01 | Earlier scheduler facts needed. | no |
| T-S002-01 | T-S001-01 | Earlier scheduler facts needed. | no |
| T-S002-02 | T-S001-01 | Earlier scheduler facts needed. | no |
| T-S003-01 | T-S001-01, T-S002-01 | Earlier scheduler facts needed. | no |
| T-S003-02 | T-S001-01, T-S002-01 | Earlier scheduler facts needed. | no |
| T-S003-03 | T-S001-01, T-S002-01 | Earlier scheduler facts needed. | no |
| T-S004-01 | T-S003-02 | Earlier scheduler facts needed. | no |
| T-S004-02 | T-S003-02 | Earlier scheduler facts needed. | no |
| T-S004-03 | T-S003-02 | Earlier scheduler facts needed. | no |
| T-S005-01 | T-S004-03 | Earlier scheduler facts needed. | no |
| T-S005-02 | T-S004-03 | Earlier scheduler facts needed. | no |
| T-S005-03 | T-S004-03 | Earlier scheduler facts needed. | no |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Proof |
| --- | --- | --- | --- | --- |
| T-S000-01 | maintained docs | platform seam | existing/planned | focused proof command |
| T-S000-02 | maintained docs | platform seam | existing/planned | focused proof command |
| T-S001-01 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S001-02 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S002-01 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S002-02 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S003-01 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S003-02 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S003-03 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S004-01 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S004-02 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S004-03 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S005-01 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |
| T-S005-02 | maintained docs | platform seam | existing/planned | focused proof command |
| T-S005-03 | jobProcessing scheduler | platform seam | existing/planned | focused proof command |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S000-01 | behavior/proof map | create or update as scoped | delivery implementer | no |
| T-S000-02 | behavior/proof map | create or update as scoped | delivery implementer | no |
| T-S001-01 | migration, persistence docs | create or update as scoped | delivery implementer | no |
| T-S001-02 | migration, persistence docs, persistence tests | create or update as scoped | delivery implementer | no |
| T-S002-01 | source, source/tests | create or update as scoped | delivery implementer | no |
| T-S002-02 | source/tests, tests | create or update as scoped | delivery implementer | no |
| T-S003-01 | source/tests | create or update as scoped | delivery implementer | no |
| T-S003-02 | source/tests | create or update as scoped | delivery implementer | no |
| T-S003-03 | package/runbook docs | create or update as scoped | delivery implementer | no |
| T-S004-01 | source/tests, docs | create or update as scoped | delivery implementer | no |
| T-S004-02 | source/tests, docs | create or update as scoped | delivery implementer | no |
| T-S004-03 | tests | create or update as scoped | delivery implementer | no |
| T-S005-01 | ADR update, manifests/generated graph | create or update as scoped | delivery implementer | no |
| T-S005-02 | docs/runbook, bootstrap/runbook | create or update as scoped | delivery implementer | no |
| T-S005-03 | test-run summary | create or update as scoped | delivery implementer | no |

## Proof And Command Plan

| Task ID | Proof Layer(s) | Command(s) | Evidence Notes |
| --- | --- | --- | --- |
| T-S000-01 | source-level | git diff --check; npm run check:static | Run focused commands after implementation. |
| T-S000-02 | source-level | git diff --check; npm run check:static | Run focused commands after implementation. |
| T-S001-01 | persistence-level | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S001-02 | persistence-level | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S002-01 | source-level | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S002-02 | source-level, contract-level | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S003-01 | persistence-level | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S003-02 | mixed, persistence-level | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S003-03 | deployment-runtime-process | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S004-01 | source-level, mixed | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S004-02 | source-level, mixed | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S004-03 | runtime-api | npx vitest run tests/unit/jobProcessing tests/integration/jobProcessing; npm run check:static | Run focused commands after implementation. |
| T-S005-01 | source-level | git diff --check; npm run check:static | Run focused commands after implementation. |
| T-S005-02 | source-level, deployment-runtime-process | git diff --check; npm run check:static | Run focused commands after implementation. |
| T-S005-03 | mixed | git diff --check; npm run check:static | Run focused commands after implementation. |

## Branch Worktree Bootstrap Strategy

| Task ID | Branch Name | Worktree Strategy | Bootstrap Artifact | Base Ref | Base Commit Policy | Promotion Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S000-01 | codex/scheduler-t-s000-01 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S000-02 | codex/scheduler-t-s000-02 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S001-01 | codex/scheduler-t-s001-01 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S001-02 | codex/scheduler-t-s001-02 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S002-01 | codex/scheduler-t-s002-01 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S002-02 | codex/scheduler-t-s002-02 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S003-01 | codex/scheduler-t-s003-01 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S003-02 | codex/scheduler-t-s003-02 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S003-03 | codex/scheduler-t-s003-03 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S004-01 | codex/scheduler-t-s004-01 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S004-02 | codex/scheduler-t-s004-02 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S004-03 | codex/scheduler-t-s004-03 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S005-01 | codex/scheduler-t-s005-01 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S005-02 | codex/scheduler-t-s005-02 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |
| T-S005-03 | codex/scheduler-t-s005-03 | current worktree unless user requests split | task breakdown packet | current branch | do not commit without approval | current feature branch |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution |
| --- | --- | --- | --- | --- | --- |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining |
| --- | --- | --- |
| T-S000-01 | queued-for-delivery | none |
| T-S000-02 | queued-for-delivery | none |
| T-S001-01 | queued-for-delivery | none |
| T-S001-02 | queued-for-delivery | none |
| T-S002-01 | queued-for-delivery | none |
| T-S002-02 | queued-for-delivery | none |
| T-S003-01 | queued-for-delivery | none |
| T-S003-02 | queued-for-delivery | none |
| T-S003-03 | queued-for-delivery | none |
| T-S004-01 | queued-for-delivery | none |
| T-S004-02 | queued-for-delivery | none |
| T-S004-03 | queued-for-delivery | none |
| T-S005-01 | queued-for-delivery | none |
| T-S005-02 | queued-for-delivery | none |
| T-S005-03 | queued-for-delivery | none |
