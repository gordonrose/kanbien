# Story Breakdown Story: Tenant role and grant storage foundation

## Story Detail

- Story ID:
  `S-003`
- Title:
  Tenant role and grant storage foundation
- Context:
  This is its own story because the role should mean the same thing for every tenant and remain reviewable over time.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As the authz system, I need durable tenant role/grant truth for globally consistent `adminOwner` without tenant-specific divergence.
- Actor / System Perspective:
  authz platform
- Outcome:
  `adminOwner` grants can be resolved durably and audited without mixing with root roles.
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
This is its own story because the role should mean the same thing for every tenant and remain reviewable over time.

**Goal**
Reviewers can understand what should be true afterward: the tenant admin owner role grants can be resolved durably and audited without mixing with root roles.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Tenant role and grant storage foundation into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S003-01 | S-003 | Tenant role/grant storage distinguishes tenant `adminOwner` grants from root roles and records tenant context, grant source posture, and lifecycle-safe revocation behavior. | persistence-level | persistence; security | data dictionary; migration plan |
| AC-S003-02 | S-003 | Pending invited tenant admins have no authority until accepted and setup is complete; removal or suspension revokes authority immediately while preserving historical action records. | persistence-level | integration; audit; lifecycle | PRD; data dictionary |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-003 | AC-S003-01 | admin-owner.grant.storage | persistence | create-or-refresh-required | Tenant role/grant truth. |
| S-003 | AC-S003-02 | admin-owner.authority.lifecycle | tenant authz | create-or-refresh-required | Pending/removal rules. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | S-003/S-004/S-006/S-007 | `tenantAuth` session and tenant selection | pre-existing-capability | existing | Tenant session/current tenant context contract. | Tenant selection and invalid context integration tests. |
| D-005 | S-003/S-006/S-007 | tenant role/grant storage | persistence-table-or-index | new | Data dictionary and migration proof. | Persistence and revocation tests. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-003 | tenant authz platform | migration author | invited; setup complete; removed; suspended | grants absent; grant active; grant revoked | tenant ID; role key; grant posture | invited to active; active to revoked | migration conflict; stale grant read | audit; persistence; compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S003-01 | tenant authz platform; invited; setup complete; removed; suspended; grants absent; grant active; grant revoked | admin-owner.grant.storage | persistence-level | TC obligation: cover persistence; security for Tenant role/grant storage distinguishes tenant `adminOwner` grants from root roles and records tenant context, grant source posture, and lifecycle-safe revocation behavior. | yes |
| AC-S003-02 | tenant authz platform; invited; setup complete; removed; suspended; grants absent; grant active; grant revoked | admin-owner.authority.lifecycle | persistence-level | TC obligation: cover integration; audit; lifecycle for Pending invited tenant admins have no authority until accepted and setup is complete; removal or suspension revokes authority immediately while preserving historical action records. | yes |
