# Loop Observability And KPI Foundation Specification

## Implementation Status

- Status:
  draft PRD proposal as of 2026-05-02
- Implemented:
  - no dedicated loop observability feature yet
  - no durable loop KPI persistence yet
  - no loop-to-task-to-change traceability yet
- Not yet implemented:
  - Product Discovery packet
  - Technical Steering packet
  - capability matrix
  - implementation blueprint
  - PRD-derived test cases
  - `loopObservability` feature bundle
  - persistence migrations
  - API contracts
  - UI surfaces
  - OLAP export pipeline

This proposal is intended to preserve the product and implementation direction
while the KPI function and loop traceability model are designed. It is not yet
an implementation-ready artifact until the required upstream planning and
artifact chain is completed.

## Purpose

The platform needs a durable way to measure, explain, and improve delivery
loops so a completed loop can carry a high-confidence claim that little or no
rework should be required.

This foundation records:

- which loop was run
- which tasks belonged to the loop
- which code, docs, migrations, tests, generated artifacts, and other files
  changed for each task
- which events, defects, tests, standards checks, and improvement actions were
  recorded during the loop
- which KPI metrics were measured or assessed at closure
- which later regression or defect can be traced back to a suspected or
  confirmed causing loop, task, change set, or artifact

The first implementation should prioritize honest capture and traceability over
dashboards. API, UI, OLAP, analytics, and automation should build on the same
durable event and metric model rather than inventing separate reporting paths.

## Scope

This foundation includes:

- a persistence-backed `loopObservability` feature boundary
- durable loop run records
- durable task records linked to loop runs
- durable change set records linked to loop runs and tasks
- durable changed artifact records derived from git or PR metadata
- append-only loop event recording
- metric snapshot recording for objective measurements and rubric-based
  assessments
- scorecard projection for loop closure
- explicit lifecycle status for open, completed, blocked, cancelled, and
  reopened loops
- traceability from later defects or regressions to suspected and confirmed
  causing loop records
- API-ready read models for scorecards and artifact traceability
- outbox-ready export facts for future OLAP delivery
- governance hooks for standards maintenance and harness improvement actions

This foundation does **not** include in the first slice:

- full analytics dashboards
- customer-facing or tenant-facing visibility
- automatic root-cause proof for regressions
- automatic quality scoring that overrides human review
- generic project management or ticketing replacement behavior
- full deployment analytics
- full performance monitoring platform replacement
- browser UI for all loop data
- complete OLAP warehouse implementation
- automatic mutation of standards, skills, or docs based only on metrics

Later work should build those capabilities on top of the durable loop evidence
model rather than expanding the first slice beyond capture, traceability, and
scorecard reads.

## Core Concepts

### Loop run

A loop run is one bounded delivery, planning, audit, verification, or
maintenance loop.

It answers:

- what was requested
- when the loop started and ended
- what kind of loop it was
- how complex or risky it was assessed to be
- whether it completed, blocked, cancelled, or reopened
- whether rework was required
- what no-rework confidence was claimed at closure

The loop run is the durable parent for tasks, events, metrics, change sets,
changed artifacts, defects, regressions, and improvement actions.

### Loop task

A loop task is a specific unit of work inside a loop.

It answers:

- which part of the loop produced a change or evidence item
- which layer the task belonged to
- whether the task was implementation, testing, docs, artifact maintenance,
  standards maintenance, verification, or review
- whether the task completed, blocked, or was deferred

Tasks should be small enough that a later issue can be traced to a meaningful
piece of work rather than only to a large loop.

### Change set

A change set is a reviewable or commit-shaped batch of repository changes.

It answers:

- which branch, commit, pull request, or diff produced the changed artifacts
- which loop and task the changes belong to
- whether the change set is local, committed, pushed, reviewed, merged, or
  abandoned

The change set should carry git identity, but git remains the source of truth
for which paths changed.

### Changed artifact

A changed artifact is one file, generated artifact, migration, test, doc,
contract, visual baseline, script, or configuration item changed by a change
set.

The artifact record answers:

- what path changed
- what kind of artifact it is
- which feature or platform area likely owns it
- whether it is generated or maintained by policy
- which layer it belongs to
- whether it is part of a source-independent artifact chain

Changed artifact records should be derived from git or PR metadata first and
then enriched by the harness. They must not depend only on manual declaration.

### Loop event

A loop event is an append-only record of something meaningful that happened
during the loop.

Examples:

- ask received
- scope classified
- task started
- artifact checked
- defect raised
- test run completed
- runtime verification completed
- standard updated
- improvement action proposed
- loop completed
- rework opened

Events are the evidence trail. They should support recomputing scorecards and
metrics when scoring rules evolve.

### Metric snapshot

A metric snapshot is a query-friendly measured or assessed value captured at a
point in time.

Examples:

- ask-to-completion time
- token consumption
- defects raised
- defects by layer
- test strength score
- page load time
- API p99 latency
- artifact drift count
- no-rework confidence

Metric snapshots are projections, not the only source of truth. Objective
metrics may come from clocks, test output, runtime measurements, or GitHub.
Assessed metrics may come from a versioned rubric.

### Scorecard

A scorecard is the closure read model for one loop.

It summarizes:

- delivery efficiency
- quality and rework risk
- verification strength
- performance and operability evidence
- standards maintenance
- improvement actions
- explicit deferrals

The scorecard should be derived from loop runs, tasks, events, metrics, and
changed artifacts rather than manually written as narrative only.

Every completed loop should produce a closure scorecard that states:

- what was measured
- what was assessed
- what improved
- what standards were maintained
- what evidence supports the no-rework confidence claim
- what remains explicitly deferred

### Regression trace

A regression trace links a later defect to a suspected or confirmed causing
loop, task, change set, or changed artifact.

Suspected and confirmed causation must remain separate so the system does not
record guesses as truth.

## Implementation Stages

### Stage 0: Planning And Governance

Goal:
settle the product, architecture, and artifact obligations before code.

Expected outputs:

- Product Discovery packet for loop observability and KPI tracking
- Technical Steering packet deciding whether this is a feature bundle,
  platform seam, or hybrid governance foundation
- ADR if the steering decision creates an enduring platform observability
  pattern
- capability matrix for v0 capture and scorecard reads
- implementation blueprint
- PRD-derived test cases

Exit criteria:

- feature boundary and ownership are approved
- lifecycle and cleanup behavior for loop records is decided
- API exposure posture is approved
- OLAP export posture is approved or explicitly deferred
- permission model for internal/root visibility is approved

### Stage 1: Durable Capture Foundation

Goal:
record loop, task, event, metric, change set, and changed artifact data
durably.

Expected capabilities:

- create loop run
- update loop run status
- create loop task
- update loop task status
- record loop event
- record metric snapshot
- record change set
- derive changed artifacts from git or PR metadata
- enrich changed artifacts with artifact kind, layer, feature, and maintained
  artifact posture

Expected persistence:

- `loop_runs`
- `loop_tasks`
- `loop_events`
- `loop_metric_snapshots`
- `loop_change_sets`
- `loop_changed_artifacts`

Exit criteria:

- one loop can be captured from start to closure
- changed artifacts are derived from git or PR metadata
- loop records preserve system-managed timestamps
- normal reads exclude soft-deleted loop records if soft delete is introduced
- persistence-backed tests prove creation, update, event append, metric append,
  and changed artifact classification

### Stage 2: Closure Scorecard And KPI Rubrics

Goal:
turn captured loop evidence into a consistent closure scorecard.

Expected capabilities:

- read one loop scorecard
- compute delivery efficiency summary
- compute quality and rework summary
- compute verification strength summary
- compute standards maintenance summary
- compute improvement summary
- record explicit deferrals
- version rubric-based assessments

Expected KPI groups:

- delivery efficiency
- quality and rework
- verification strength
- performance and operability
- standards maintenance
- improvement and learning

Exit criteria:

- scorecard can be generated from persisted records
- scorecard distinguishes measured values from assessed values
- rubric version is stored with assessed metrics
- no-rework confidence is backed by recorded evidence and explicit deferrals
- tests cover scorecard projection for complete, blocked, and partially
  verified loops

### Stage 3: Traceability And Regression Linking

Goal:
make later defects traceable to the loop, task, change set, and artifact that
most likely caused them.

Expected capabilities:

- create loop defect record
- classify defect by layer
- create regression trace
- link suspected causing loop, task, change set, and artifact
- promote suspected cause to confirmed cause with confidence and summary
- search loops by changed artifact path
- search changed artifacts by loop or task

Expected persistence:

- `loop_defects`
- `loop_regressions`
- optional `loop_artifact_links` if artifact relationships need many-to-many
  modeling beyond changed artifacts

Exit criteria:

- a later defect can be linked to suspected and confirmed causes separately
- traceability reads can answer "which loop changed this file?"
- traceability reads can answer "which task changed this contract, migration,
  or test?"
- tests prove suspected cause does not automatically become confirmed cause

### Stage 4: Internal APIs And Harness Integration

Goal:
allow the harness and internal tools to record and read loop observability data
through stable seams.

Expected route families:

- create and update loop runs
- create and update loop tasks
- append events
- append metrics
- record change sets and changed artifacts
- read loop list
- read loop detail
- read loop scorecard
- read artifact traceability
- read defect and regression traceability

Expected integration:

- command or helper for opening a loop
- command or helper for closing a loop
- helper for recording test run evidence
- helper for importing git diff changed artifacts
- helper for attaching commit trailers or PR metadata when available

Exit criteria:

- API contract docs exist for exposed routes
- permission mapping exists for root/internal access
- harness helper can record at least one real loop without direct SQL
- read APIs return stable, paginated shapes
- integration tests cover write and read flows

### Stage 5: UI And Operational Review Surfaces

Goal:
make loop evidence inspectable by maintainers without requiring direct database
queries.

Expected surfaces:

- loop run list
- loop scorecard detail
- task and artifact trace view
- defect and regression trace view
- standards maintenance and improvement action view

Design-system posture:

- root/internal UI must use signed-off design-system seams
- app-page CSS must not be added for governed pages
- any new shared UI pattern must go through the design-system loop first

Exit criteria:

- UI consumes the same read APIs used by tests
- scorecard and traceability views do not invent data missing from persistence
- visual and accessibility verification exist for the governed surfaces

### Stage 6: OLAP Export And Analytics

Goal:
publish immutable loop facts to the analytics service without making OLAP the
system of record.

Expected capabilities:

- create export batch
- derive loop fact rows
- derive metric fact rows
- derive defect fact rows
- derive changed artifact fact rows
- derive improvement fact rows
- publish through transactional outbox or approved job-processing seam
- retry failed exports idempotently

Expected export facts:

- `loop_fact`
- `loop_task_fact`
- `loop_metric_fact`
- `loop_defect_fact`
- `loop_changed_artifact_fact`
- `loop_improvement_fact`

Exit criteria:

- every exported fact carries source record id, schema version, occurred time,
  exported time, and idempotency key
- failed exports are visible and retryable
- OLAP export can be replayed without duplicating facts
- analytics remains derived from app-owned persistent truth

### Stage 7: Continuous Improvement Automation

Goal:
use loop data to improve future loops without silently mutating standards or
code.

Expected capabilities:

- detect repeat defect patterns
- propose new guardrail candidates
- propose new tests or gate improvements
- identify standards that need maintenance
- identify high-risk artifact kinds or feature areas
- measure whether previous improvement actions reduced rework

Exit criteria:

- improvement suggestions are recorded separately from approved changes
- standards, skills, tests, and docs are not changed automatically without the
  normal change loop
- trend analytics can show whether rework and escaped defects are improving

## Proposed Durable Entities

### `loop_runs`

Suggested fields:

- `id`
- `loop_type`
- `source_ask_id`
- `title`
- `status`
- `primary_layer`
- `complexity_class`
- `risk_class`
- `started_at`
- `completed_at`
- `reopened_at`
- `rework_required`
- `no_rework_confidence`
- `outcome`
- `repo_ref`
- `branch_name`
- `base_commit_sha`
- `head_commit_sha`
- `created_at`
- `updated_at`
- `deleted_at`

### `loop_tasks`

Suggested fields:

- `id`
- `loop_run_id`
- `task_key`
- `title`
- `task_type`
- `layer`
- `status`
- `risk_class`
- `owner_actor_type`
- `started_at`
- `completed_at`
- `created_at`
- `updated_at`
- `deleted_at`

### `loop_change_sets`

Suggested fields:

- `id`
- `loop_run_id`
- `loop_task_id`
- `change_set_type`
- `repo_ref`
- `branch_name`
- `base_commit_sha`
- `head_commit_sha`
- `commit_sha`
- `pull_request_number`
- `status`
- `created_at`
- `updated_at`
- `merged_at`

### `loop_changed_artifacts`

Suggested fields:

- `id`
- `loop_run_id`
- `loop_task_id`
- `change_set_id`
- `artifact_path`
- `artifact_kind`
- `change_kind`
- `owning_feature`
- `layer`
- `is_generated`
- `is_maintained_artifact`
- `contract_surface`
- `risk_class`
- `created_at`

### `loop_events`

Suggested fields:

- `id`
- `loop_run_id`
- `loop_task_id`
- `event_type`
- `layer`
- `severity`
- `occurred_at`
- `actor_type`
- `actor_id`
- `summary`
- `payload_json`
- `created_at`

### `loop_metric_snapshots`

Suggested fields:

- `id`
- `loop_run_id`
- `loop_task_id`
- `metric_key`
- `metric_value`
- `metric_unit`
- `metric_scope`
- `layer`
- `sampled_at`
- `source`
- `confidence`
- `rubric_version`
- `metadata_json`
- `created_at`

### `loop_defects`

Suggested fields:

- `id`
- `loop_run_id`
- `loop_task_id`
- `defect_key`
- `layer`
- `severity`
- `status`
- `detected_at`
- `summary`
- `created_at`
- `updated_at`

### `loop_regressions`

Suggested fields:

- `id`
- `detected_loop_run_id`
- `suspected_causing_loop_run_id`
- `suspected_causing_task_id`
- `suspected_causing_change_set_id`
- `suspected_causing_artifact_id`
- `confirmed_causing_loop_run_id`
- `confirmed_causing_task_id`
- `confirmed_causing_change_set_id`
- `confirmed_causing_artifact_id`
- `confidence`
- `status`
- `detected_at`
- `confirmed_at`
- `root_cause_summary`
- `created_at`
- `updated_at`

### `loop_improvement_actions`

Suggested fields:

- `id`
- `loop_run_id`
- `loop_task_id`
- `action_type`
- `target_artifact_path`
- `status`
- `summary`
- `created_at`
- `updated_at`
- `completed_at`

## KPI Model

KPI records should be grouped into three classes.

### Measured KPIs

Measured KPIs come from objective evidence.

Examples:

- `ask_to_completion_time_ms`
- `active_work_time_ms`
- `blocked_time_ms`
- `rework_time_ms`
- `token_consumption_total`
- `context_reload_count`
- `changed_artifact_count`
- `test_count`
- `test_runtime_ms`
- `test_coverage_delta`
- `page_load_time_ms`
- `api_latency_p50_ms`
- `api_latency_p95_ms`
- `api_latency_p99_ms`
- `deploy_time_ms`

### Assessed KPIs

Assessed KPIs come from a versioned rubric.

Examples:

- `ask_complexity_class`
- `risk_class`
- `token_efficiency_score`
- `test_strength_score`
- `artifact_completeness_score`
- `runtime_evidence_strength`
- `contract_mismatch_count`
- `first_pass_acceptance_rate`
- `no_rework_confidence`
- `rework_risk`

### Improvement KPIs

Improvement KPIs capture whether the loop made later loops better.

Examples:

- `lesson_captured`
- `repeat_defect_detected`
- `defects_escaped_after_loop`
- `new_test_added_for_defect`
- `new_gate_added_or_proposed`
- `standard_maintenance_action_count`
- `automation_opportunity_count`
- `manual_step_reduction_count`

## Standard Maintenance Direction

The KPI function should explicitly check how the loop maintained or improved
the operating system around future loops, not only whether the immediate work
shipped.

Every material loop closure should record:

- which standards, guardrails, skills, templates, or harness checks were
  reviewed
- which standards, guardrails, skills, templates, or harness checks changed
- which recurring manual checks could become automated
- which new guardrail candidates were identified
- which defect classes should be caught earlier next time
- which maintained artifacts were intentionally deferred

This maintenance evidence should feed improvement KPIs without automatically
mutating standards or implementation artifacts outside the normal change loop.

## Artifact Classification Direction

Changed artifacts should use stable classification values so reporting and
artifact sweeps remain consistent.

Initial `artifact_kind` values:

- `source_code`
- `test`
- `migration`
- `api_contract`
- `prd`
- `product_discovery`
- `technical_steering`
- `capability_matrix`
- `implementation_blueprint`
- `feature_manifest`
- `architecture_doc`
- `permission_mapping`
- `data_dictionary`
- `generated_dependency_graph`
- `design_system_canonical`
- `visual_baseline`
- `runtime_config`
- `script`
- `standard`
- `skill`
- `unknown`

Initial `layer` values:

- `product_discovery`
- `technical_steering`
- `story_breakdown`
- `task_breakdown`
- `implementation`
- `testing`
- `runtime_verification`
- `docs`
- `standards`
- `release`
- `operations`

## API Direction

Expected v0 internal/root routes:

- `POST /v1/loop-observability/loop-runs`
- `PATCH /v1/loop-observability/loop-runs/:loopRunId`
- `POST /v1/loop-observability/loop-runs/:loopRunId/tasks`
- `PATCH /v1/loop-observability/tasks/:loopTaskId`
- `POST /v1/loop-observability/loop-runs/:loopRunId/events`
- `POST /v1/loop-observability/loop-runs/:loopRunId/metrics`
- `POST /v1/loop-observability/loop-runs/:loopRunId/change-sets`
- `GET /v1/loop-observability/loop-runs`
- `GET /v1/loop-observability/loop-runs/:loopRunId`
- `GET /v1/loop-observability/loop-runs/:loopRunId/scorecard`
- `GET /v1/loop-observability/artifacts`
- `GET /v1/loop-observability/regressions`

Route contracts must use the repo defaults for pagination, sorting,
system-managed fields, timestamp formatting, and exact route params.

## Security And Authorization

V0 should be root/internal only.

Default posture:

- no tenant-scoped or customer-facing visibility in v0
- no cross-tenant visibility concerns unless loop data later includes
  tenant/customer identifiers
- loop payloads must not store secrets, credentials, bearer tokens, private
  keys, or sensitive live session material
- event payloads should store safe summaries and stable references rather than
  raw confidential content
- read APIs should avoid exposing full prompts or internal sensitive material
  unless a later privacy decision approves that behavior
- export facts should be classified before OLAP integration

Permission mappings must be created before exposing routes beyond internal
helpers.

## Persistence And Lifecycle Direction

Loop observability records are durable operational evidence.

Defaults:

- event records are append-only
- metric snapshots are append-only
- loop runs and tasks may transition status, but history-sensitive facts should
  not be overwritten without preserving events
- changed artifacts are derived evidence and should not be silently deleted
- soft delete may hide cancelled or test records from normal reads, but audit
  and traceability behavior must be decided before deletion is implemented
- cleanup and retention rules must be defined before production use
- export state should be idempotent and retryable

Lifecycle questions that must be decided before implementation:

- retention period for loop events and metric snapshots
- retention period for raw event payload JSON
- whether local development loops are kept, soft-deleted, or marked as
  non-production evidence
- whether closed loop records may be corrected and how corrections are audited
- how reopened loops affect scorecards and OLAP facts

## OLAP Export Direction

The app database remains the system of record.

OLAP export should use immutable, versioned facts derived from app-owned
persistent records.

Required export properties:

- source record id
- loop run id
- schema version
- occurred time
- exported time
- idempotency key
- export batch id

Preferred export path:

- durable app record
- derived fact
- transactional outbox or approved job-processing seam
- OLAP delivery worker
- retryable export batch state

## UI Direction

The first UI should be an internal/root operational review surface.

Priority views:

- loop run list
- loop scorecard detail
- task timeline
- changed artifact trace
- defect and regression trace
- improvement action list

The UI must not be implemented before the governed design-system posture is
settled. If a new page family or reusable pattern is needed, complete the
design-system loop first.

## Acceptance Criteria

### Stage 1 Acceptance

- A loop can be created, updated, completed, and read from persistence.
- Tasks can be created, updated, and linked to a loop.
- Events and metrics are append-only.
- A change set can be linked to a loop and task.
- Changed artifacts can be derived from git or PR metadata and enriched.
- Persistence-backed tests cover the write and read model.

### Stage 2 Acceptance

- A scorecard can be generated from persisted loop evidence.
- Scorecard sections include delivery, quality, verification, standards, and
  improvement summaries.
- Metric snapshots distinguish measured, assessed, and improvement KPIs.
- Assessed KPIs carry a rubric version.
- Explicit deferrals appear in the scorecard and reduce confidence or block
  complete status according to the approved rubric.

### Stage 3 Acceptance

- Defects can be recorded by layer.
- Regressions can link detected loop, suspected cause, and confirmed cause
  separately.
- Artifact trace reads can answer which loop and task touched a file.
- Tests prove suspected causes are not treated as confirmed causes.

### Stage 4 Acceptance

- Internal/root APIs expose loop list, detail, scorecard, and artifact trace
  read models.
- API contract docs and permission mappings are maintained for exposed routes.
- Harness helpers use feature seams rather than direct database writes.
- Route tests cover pagination, sorting, validation, and system-managed field
  rejection.

### Stage 5 Acceptance

- Internal UI surfaces consume the read APIs.
- UI does not invent scorecard or traceability values missing from persistence.
- Governed design-system adoption and visual verification are complete.

### Stage 6 Acceptance

- Export facts are derived from persistent app records.
- Export is idempotent and retryable.
- Failed export batches are visible.
- OLAP is not required for normal loop scorecard reads.

## Maintained Artifact Expectations

Implementation will likely require updates to:

- Product Discovery packet
- Technical Steering packet
- capability matrix
- implementation blueprint
- PRD-derived test cases
- API contract docs
- OpenAPI and Postman artifacts if routes are exposed through maintained seams
- data dictionary
- permission mappings
- `feature.manifest.json`
- feature dependency graph artifacts if feature manifests change
- architecture docs or ADRs if this creates a new platform observability seam
- standards or harness docs if closure scorecards become required loop evidence

## Open Questions

- Should the first implementation track only Codex/harness-driven loops, or all
  human and automated delivery loops?
- Is `loopObservability` a normal feature bundle, a platform governance seam,
  or a hybrid foundation?
- Which actor model should be used for agent, human, system, GitHub, CI, and
  job worker actors?
- Which KPI rubric owns the first no-rework confidence calculation?
- Which loop data is safe to expose in root/internal UI without redaction?
- What is the retention period for loop payload metadata?
- Should commit trailers such as `Loop-Run` and `Loop-Task` be required?
- Which OLAP service is the first target, and what schema versioning convention
  should exports use?
- Should local development loops be stored in the same tables as governed
  production loop records?
- What is the minimum scorecard evidence needed before a loop may be marked
  complete rather than partially verified?
