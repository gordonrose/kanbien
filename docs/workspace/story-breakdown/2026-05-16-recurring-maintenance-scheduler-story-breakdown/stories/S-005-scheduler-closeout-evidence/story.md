# S-005: Scheduler Closeout Evidence

## Story Detail

- Story ID:
  S-005
- Title:
  Scheduler closeout evidence
- Context:
  When the scheduler foundation becomes real, source-independent docs and ADRs
  must stop saying the platform scheduler itself is deferred while still
  making feature-consumer deferrals clear.
- Value Type:
  harness-value
- Delivery Shape:
  DOC:docs-artifact
- Job To Be Done:
  As the reviewer, I need the repo evidence refreshed so the implemented
  scheduler and its limits are easy to verify.
- Actor / System Perspective:
  reviewer
- Outcome:
  ADRs, docs, manifests, generated artifacts, and test evidence align with the
  implemented scheduler foundation and its deferred first-consumer boundary.
- Non-goals:
  No new scheduler behavior, API, UI, or feature expansion.

## Story Narrative

**Situation**
The repo currently records recurring scheduler cadence as deferred. After the
scheduler is implemented, leaving those words behind would make future
planning and operations unsafe.

**Goal**
The documentation trail clearly says what scheduler behavior exists, what is
still deferred, and which evidence proves the platform foundation.

**Decisions Needed**
Implementation closeout must decide whether ADR-0046 is promoted to Accepted
or superseded by a concrete scheduler ADR.

**Work That Follows**
The Organization server and platform loop can be reviewed for closeout with screen work still parked.

**Evidence Of Success**
Static gates pass, feature dependency artifacts are current, and docs point to
the scheduler implementation without claiming Organization export adoption.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| ADR-0046 | actual | docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md | Must be promoted or superseded. |
| jobProcessing README | actual | src/features/jobProcessing/README.md | Describes scheduler foundation and first-consumer deferral. |
| Bootstrap guide | actual | docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md | Mentions scheduler runtime command. |
| Dependency graph | actual | docs/architecture/generated/feature-dependency-graph.* | Generated artifact refreshed after manifests changed. |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S005-001 | S-005 | ADR-0046 is promoted to Accepted or superseded by a concrete scheduler ADR after implementation lands. | source-level | docs validation | ADR update |
| AC-S005-002 | S-005 | jobProcessing manifest and generated dependency graph reflect new scheduler seams/dependencies; Organization export manifest remains unchanged until the follow-on consumer slice. | source-level | static, dependency graph | manifests/generated graph |
| AC-S005-003 | S-005 | Docs describe scheduler foundation, failure evidence, and remaining first-consumer deferred behavior accurately. | source-level | docs validation | docs/runbook |
| AC-S005-004 | S-005 | Bootstrap, helper, or deployment docs mention the scheduler process when it becomes a normal runtime. | deployment-runtime-process | operational | bootstrap/runbook |
| AC-S005-005 | S-005 | Closeout records the exact tests/gates run after the final scheduler implementation change. | mixed | static, unit, integration, runtime as applicable | test-run summary |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-005 | AC-S005-001 | scheduler behavior map S-000 | docs/artifacts | closeout-control | Capability rows created by S-000. |
| S-005 | AC-S005-002 | scheduler behavior map S-000 | docs/artifacts | closeout-control | Capability rows created by S-000. |
| S-005 | AC-S005-003 | scheduler behavior map S-000 | docs/artifacts | closeout-control | Capability rows created by S-000. |
| S-005 | AC-S005-004 | scheduler behavior map S-000 | docs/artifacts | closeout-control | Capability rows created by S-000. |
| S-005 | AC-S005-005 | scheduler behavior map S-000 | docs/artifacts | closeout-control | Capability rows created by S-000. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-S005-000 | S-005 | maintained artifact set | docs seam | changed | story owns closeout evidence | yes |
| DEP-S005-001 | AC-S005-001 | ADR process | architecture docs | existing | ADR state is correct | no |
| DEP-S005-002 | AC-S005-002 | feature manifests and dependency graph | generated artifact seam | existing | graph validates | yes |
| DEP-S005-003 | AC-S005-003 | scheduler docs/runbook evidence | docs | existing | docs match source behavior | no |
| DEP-S005-004 | AC-S005-004 | bootstrap/deployment docs | operations docs | existing | runtime command documented | no |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| scheduler closeout trail | future platform/feature work | docs state what scheduler behavior exists and what remains deferred | stale deferred wording | static and dependency checks |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-005 | reviewer, operator | not applicable | reviewing, operating | docs stale/current, ADR proposed/accepted/superseded | links accurate, commands current | deferred to implemented or superseded | stale docs, missing graph | traceability, operability, compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S005-001 | reviewer / ADR state | S-000 behavior map | source-level | TC obligation: ADR closeout state | no |
| AC-S005-002 | reviewer / manifests graph | S-000 behavior map | source-level | TC obligation: dependency graph current | yes |
| AC-S005-003 | operator / runbook current | S-000 behavior map | source-level | TC obligation: docs match scheduler behavior | no |
| AC-S005-004 | operator / runtime command | S-000 behavior map | deployment-runtime-process | TC obligation: scheduler process documented | no |
| AC-S005-005 | reviewer / evidence summary | S-000 behavior map | mixed | TC obligation: final verification recorded | yes |
