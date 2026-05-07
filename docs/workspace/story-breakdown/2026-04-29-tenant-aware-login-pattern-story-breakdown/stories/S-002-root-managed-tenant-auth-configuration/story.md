# Story Breakdown Story: Root-managed tenant auth configuration

## Story Detail

- Story ID:
  `S-002`
- Title:
  Root-managed tenant auth configuration
- Context:
  This is its own story because operators need a clear way to decide which sign-in methods each tenant can use.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As a root operator, I need to configure enabled auth methods for exactly one tenant.
- Actor / System Perspective:
  root operator
- Outcome:
  Tenant auth method policy is durable, permissioned, auditable, and separate from mutable provider state.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-000 and S-001

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because operators need a clear way to decide which sign-in methods each tenant can use.

**Goal**
Reviewers can understand what should be true afterward: Tenant auth method policy is durable, permissioned, auditable, and separate from mutable provider state.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Root-managed tenant auth configuration into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S002-01 | S-002 | Root configuration writes require root authorization, exactly one target tenant, normalized configuration values, no client-supplied system-managed fields, and audit evidence. | runtime-api | authz; validation; audit | API contract; permission mapping; data dictionary |
| AC-S002-02 | S-002 | Tenant auth configuration persists enabled method set, provider reference metadata, policy version, timestamps, lifecycle state, and force-login posture without depending only on mutable provider state. | persistence-level | persistence integration; lifecycle review | data dictionary; migration plan |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-002 | AC-S002-01 | root.tenant-auth-configuration.manage | root selected tenant | create-or-refresh-required | Root-only configuration write. |
| S-002 | AC-S002-02 | tenant-auth-configuration.persist | tenant configuration | create-or-refresh-required | Durable method and provider policy facts. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-004 | S-002 / AC-S002-01 | root authz policy evaluation | authz-capability | existing or changed | Permission mapping names root manage/read grants and denies. | Authz tests cover root allow and non-root deny. |
| D-005 | S-002 / AC-S002-02 | tenant auth configuration persistence | persistence-table-or-index | existing or new | Migration and data dictionary define durable method and provider facts. | Persistence tests cover lifecycle, timestamps, and policy version. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-002 | root operator; unauthorized actor | root manage grant; denied non-root | active root session; expired session | tenant active; tenant disabled; config active; config soft-deleted | enabled method set; provider reference; force-login flag | create config; change config; force login | tenant missing; authz denial; persistence conflict | audit; security; durability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
