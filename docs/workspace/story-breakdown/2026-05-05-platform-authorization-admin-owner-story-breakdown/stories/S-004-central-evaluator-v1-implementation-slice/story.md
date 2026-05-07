# Story Breakdown Story: Central evaluator v1 implementation slice

## Story Detail

- Story ID:
  `S-004`
- Title:
  Central evaluator v1 implementation slice
- Context:
  This is its own story because every protected tenant action should be judged by the same clear rule set.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As protected tenant routes, we need the evaluator to enforce v1 layers consistently.
- Actor / System Perspective:
  backend platform
- Outcome:
  Evaluator supports tenant context, lifecycle/deletion, feature/config/entitlement, `adminOwner`, denial mapping, and proof.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-000, S-001, S-002, S-003

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because every protected tenant action should be judged by the same clear rule set.

**Goal**
Reviewers can understand what should be true afterward: Evaluator supports tenant context, lifecycle/deletion, feature/config/entitlement, the tenant admin owner role, denial mapping, and proof.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Central evaluator v1 implementation slice into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | S-004 | The evaluator v1 slice enforces exactly one tenant context before tenant-scoped authorization and denies cross-tenant access by default. | runtime-api | security; integration | implementation blueprint; API contracts |
| AC-S004-02 | S-004 | The evaluator v1 slice produces allow/deny decisions with denial category, public code/status mapping, internal reason, proof, and audit recommendation. | runtime-api | unit; integration; audit | implementation blueprint; API contracts |
| AC-S004-03 | S-004 | ABAC/ReBAC/object inputs are typed extension points only and are skipped explicitly unless a feature supplies approved facts. | source-level | unit; architecture review | implementation blueprint |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-004 | AC-S004-01 | evaluator.tenant-context.cross-tenant-deny | platform seam | create-or-refresh-required | Central evaluator. |
| S-004 | AC-S004-02 | evaluator.decision-proof | platform seam | create-or-refresh-required | Denial/proof output. |
| S-004 | AC-S004-03 | evaluator.abac-rebac.typed-extension | platform seam | create-or-refresh-required | Extension only. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | S-003/S-004/S-006/S-007 | `tenantAuth` session and tenant selection | pre-existing-capability | existing | Tenant session/current tenant context contract. | Tenant selection and invalid context integration tests. |
| D-002 | S-004/S-005 | `tenants` lifecycle/deletion facts | feature-public-seam | changed | ADR-0037-compatible data/API contract. | Lifecycle/deletion deny integration tests. |
| D-003 | S-004/S-006/S-007 | central authorization evaluator | feature-public-seam | new | Input/output and denial/proof contract. | Evaluator allow/deny unit and route integration tests. |
| D-007 | S-004/S-008 | platform authorization denial contract | pre-existing-capability | existing | Shared API denial contract adoption. | Route-family denial tests. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-004 | protected route; evaluator | authenticated tenant actor | selected tenant; selection required; wrong world | lifecycle states; feature unavailable; role missing | capability key; operation; proof fields | allow to deny by state change | resolver failure; stale policy | security; audit; resilience |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
