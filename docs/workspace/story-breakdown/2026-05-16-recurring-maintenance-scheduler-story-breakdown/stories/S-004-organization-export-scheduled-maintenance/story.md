# S-004: Organization Export Schedule Adoption Deferral

## Story Detail

- Story ID:
  S-004
- Title:
  Organization export schedule adoption deferral
- Context:
  Organization exports are the intended first feature-owned recurring
  consumer, but this isolated slice is platform-only and must not import
  `organizationExports`.
- Value Type:
  system-value
- Delivery Shape:
  DEV:backend
- Job To Be Done:
  As the reviewer, I need the first-consumer boundary recorded so this branch
  proves the scheduler foundation without silently mixing in Organization
  export work.
- Actor / System Perspective:
  system
- Outcome:
  Export cleanup and stale-running reconciliation remain planned follow-on
  scheduler consumers, with no feature import or schedule registration in this
  slice.
- Non-goals:
  No new export product behavior, no export UI, no public logo scheduler
  adoption, and no changed requester authority.

## Story Narrative

**Situation**
Private export bundles can expire, be deleted, fail cleanup, or get stuck in a
running state. The backend needs recurring cleanup later, but this branch is
only the shared scheduler foundation.

**Goal**
The scheduler foundation lands without claiming Organization export cadence is
active. The Organization export slice can adopt the scheduler next and
keep ownership of status changes and generated-file cleanup.

**Decisions Needed**
No new cadence decision is made in this slice. The follow-on Organization
export task must set cadence and payload limits within the approved scheduler
model.

**Work That Follows**
The Organization export feature docs and runbook stay honest until the
follow-on schedule registration exists.

**Evidence Of Success**
Source and docs prove this branch has no `organizationExports` dependency and
the behavior map lists Organization export schedules as deferred follow-on
work.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Behavior map | actual | docs/workspace/capability-matrices/2026-05-16-recurring-maintenance-scheduler-behavior-proof-map.md | Lists Organization export scheduler adoption as deferred. |
| Scheduler entrypoint | actual | src/jobScheduler.ts | Must not import `organizationExports` in this platform-only slice. |
| jobProcessing manifest | actual | src/features/jobProcessing/feature.manifest.json | Declares scheduler seam without a consuming-feature dependency. |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S004-001 | S-004 | Organization export cleanup and timeout-sweep schedules are explicitly deferred to the Organization export slice. | source-level | docs validation | behavior map/story |
| AC-S004-002 | S-004 | Scheduler runtime and registry source do not import `organizationExports`. | source-level | static, unit | source/tests |
| AC-S004-003 | S-004 | The scheduler unit proof uses generic code-declared platform maintenance schedules rather than feature-owned Organization export schedules. | source-level | unit | tests |
| AC-S004-004 | S-004 | No Organization export manifest, docs, or runbook claims automatic scheduler cadence in this platform-only slice. | source-level | docs validation | docs/runbook |
| AC-S004-005 | S-004 | Closeout records that Organization export schedule adoption remains follow-on work. | source-level | docs validation | docs/runbook |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-004 | AC-S004-001 | scheduler behavior map S-000 | first-consumer deferral | docs-control | Capability rows created by S-000. |
| S-004 | AC-S004-002 | scheduler behavior map S-000 | platform-only source boundary | docs-control | Capability rows created by S-000. |
| S-004 | AC-S004-003 | scheduler behavior map S-000 | generic schedule proof | docs-control | Capability rows created by S-000. |
| S-004 | AC-S004-004 | scheduler behavior map S-000 | documentation honesty | docs-control | Capability rows created by S-000. |
| S-004 | AC-S004-005 | scheduler behavior map S-000 | follow-on adoption note | docs-control | Capability rows created by S-000. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-S004-000 | S-004 | jobProcessing scheduler registry/runtime | platform seam | new | feature dependency absent in this slice | yes |
| DEP-S004-001 | AC-S004-001 | Organization export follow-on slice | future feature seam | deferred | schedule adoption remains future work | no |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| scheduler first-consumer deferral | Organization exports | cleanup and timeout sweeps can adopt scheduler later without hidden coupling in this slice | implicit feature import or feature-local cron | static source check and follow-on scheduler/exports tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-004 | reviewer, scheduler | not applicable; platform-internal source only | reviewing, scheduler active | schedule definitions present/absent | no Organization export schedule registration in this slice | deferred to follow-on feature slice | stale docs, hidden feature import | traceability, compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S004-001 | reviewer / deferred consumer | S-000 behavior map | source-level | TC obligation: deferral recorded | no |
| AC-S004-002 | scheduler / source boundary | S-000 behavior map | source-level | TC obligation: no Organization export import | yes |
| AC-S004-003 | scheduler / generic schedule proof | S-000 behavior map | source-level | TC obligation: generic code-declared schedules validate | yes |
| AC-S004-004 | reviewer / docs truth | S-000 behavior map | source-level | TC obligation: no premature cadence docs | no |
| AC-S004-005 | reviewer / follow-on work | S-000 behavior map | source-level | TC obligation: adoption deferral remains visible | no |
