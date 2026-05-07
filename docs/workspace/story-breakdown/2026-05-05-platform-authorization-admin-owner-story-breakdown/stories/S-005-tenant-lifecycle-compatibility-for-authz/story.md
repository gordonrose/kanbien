# Story Breakdown Story: Tenant lifecycle compatibility for authz

## Story Detail

- Story ID:
  `S-005`
- Title:
  Tenant lifecycle compatibility for authz
- Context:
  This is its own story because suspended, deleted, or changing tenants need predictable access behavior before role powers expand.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As tenant-scoped authz, I need lifecycle/deletion facts available without breaking current tenant status/deleted_at behavior.
- Actor / System Perspective:
  tenant lifecycle owner
- Outcome:
  Authz can deny or restrict by ADR-0037 lifecycle/deletion posture with a compatibility plan.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-000, S-001

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because suspended, deleted, or changing tenants need predictable access behavior before role powers expand.

**Goal**
Reviewers can understand what should be true afterward: access checking can deny or restrict by ADR-0037 lifecycle/deletion posture with a compatibility plan.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Tenant lifecycle compatibility for access checking into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | S-005 | Tenant lifecycle/deletion facts follow ADR-0037 and do not silently overload current tenant `status` or `deleted_at`. | persistence-level | migration; compatibility | data dictionary; migration plan |
| AC-S005-02 | S-005 | Tenant-admin login/use is denied or restricted for `inactive`, `softDeleted`, `hardDeletePending`, and `hardDeleted` states according to approved lifecycle/deletion posture. | runtime-api | lifecycle; security | API contracts; PRD-derived tests |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-005 | AC-S005-01 | tenant-lifecycle.authz-facts.compatibility | tenant lifecycle | create-or-refresh-required | ADR-0037 storage plan. |
| S-005 | AC-S005-02 | tenant-lifecycle.authz-denials | tenant lifecycle | create-or-refresh-required | Runtime denies. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-002 | S-004/S-005 | `tenants` lifecycle/deletion facts | feature-public-seam | changed | ADR-0037-compatible data/API contract. | Lifecycle/deletion deny integration tests. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-005 | tenant lifecycle owner | data contract author | tenant draft/live/disabled/inactive | active/softDeleted/hardDeletePending/hardDeleted | reason codes; recovery policy | status/posture transition | missing lifecycle facts | security; compatibility; audit |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
