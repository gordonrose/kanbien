# Story Breakdown Story: Root-admin branding configuration record

## Story Detail

- Story ID:
  `S-003`
- Title:
  Root-admin branding configuration record
- Context:
  This is its own story because changing the display name and color is the simplest recognizable branding action for a root admin.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As a root admin, I need to read and save tenant branding display name and primary colour for exactly one selected tenant.
- Actor / System Perspective:
  root admin
- Outcome:
  Durable tenant branding facts are stored, validated, permissioned, and auditable.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-002 only for app UI, not backend delivery

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because changing the display name and color is the simplest recognizable branding action for a root admin.

**Goal**
Reviewers can understand what should be true afterward: Durable tenant branding facts are stored, validated, permissioned, and auditable.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Root-admin branding configuration record into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S003-01 | S-003 | Root-admin read returns exactly one selected tenant branding record or the approved absence state while excluding soft-deleted records from normal reads. | runtime-api | API contract; persistence integration; authz allow and deny | PRD; capability matrix; API contract; data dictionary |
| AC-S003-02 | S-003 | Root-admin save rejects client-supplied system-managed fields, empty display names, invalid primary-colour values, missing selected tenant, and unauthorized actors. | runtime-api | validation; authz; boundary values; API contract | PRD; capability matrix; API contract; permission mapping |
| AC-S003-03 | S-003 | Successful root-admin save persists durable display name and primary colour as tenant branding facts, refreshes `updatedAt`, records audit evidence, and does not overwrite the canonical tenant name. | persistence-level | persistence integration; audit; regression for canonical tenant isolation | data dictionary; API contract; audit artifact |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-003 | AC-S003-01 | root-admin.tenant-branding.read | root-admin selected tenant | create-or-refresh-required | Exact key may change in permission planning. |
| S-003 | AC-S003-02 | root-admin.tenant-branding.manage | root-admin selected tenant | create-or-refresh-required | Includes validation deny behavior. |
| S-003 | AC-S003-03 | root-admin.tenant-branding.manage; tenant-branding.audit.record | persistence and audit | create-or-refresh-required | Durable branding facts must not mutate tenant canonical name. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-005 | S-003 / AC-S003-01 | selected tenant lookup from tenants/root-admin | cross-feature-read | existing | API contract requires exact selected tenant parameter or context. | Runtime API tests cover missing, unauthorized, and valid selected tenant. |
| D-006 | S-003 / AC-S003-03 | tenant branding persistence table and indexes | persistence-table-or-index | new | Data dictionary and migration plan define durable fields, timestamps, soft delete, and uniqueness. | Persistence tests cover create, update, soft delete exclusion, and normalized validation. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-003 | root admin; unauthorized actor | root-admin read/manage; denied non-root | selected tenant present; missing selected tenant; unauthorized actor | no branding; active branding; soft-deleted branding | non-empty display name; approved hex; reject system fields | create branding; update branding; soft delete exclusion | persistence conflict; invalid tenant; authz denial | security; audit; compatibility with tenant canonical name |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
