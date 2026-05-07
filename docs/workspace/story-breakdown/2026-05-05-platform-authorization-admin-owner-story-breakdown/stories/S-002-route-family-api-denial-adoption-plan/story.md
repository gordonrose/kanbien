# Story Breakdown Story: Route-family API denial adoption plan

## Story Detail

- Story ID:
  `S-002`
- Title:
  Route-family API denial adoption plan
- Context:
  This is needed to make sure future tenant admin screens give consistent no-access answers.
- Value Type:
  `system-value`
- Delivery Shape:
  `DOC:docs-artifact`
- Job To Be Done:
  As API owners, we need future tenant-admin route families to adopt the shared denial contract or record compatibility exceptions.
- Actor / System Perspective:
  API owner
- Outcome:
  API contracts name status/code/reason behavior for tenant selection, lifecycle, feature, role, cross-tenant, and sensitive denials.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-001

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is needed to make sure future tenant admin screens give consistent no-access answers.

**Goal**
Reviewers can understand what should be true afterward: service answer contracts name status/code/reason behavior for tenant selection, lifecycle, feature, role, cross-tenant, and sensitive denials.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry service entry point-family service answer denial adoption plan into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S002-01 | S-002 | Tenant-admin route-family contracts consume `platform-authorization-denials.md` for unauthenticated, tenant selection, tenant context, lifecycle, feature, role, cross-tenant, object, attribute, and sensitive fallback denial categories. | contract-level | API contract review | API contracts |
| AC-S002-02 | S-002 | Existing root and tenant-auth route-family codes remain backwards compatible unless a route-family contract records an explicit migration. | contract-level | compatibility review | API contracts |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-002 | AC-S002-01 | platform-authz.denial-contract.adoption | API | create-or-refresh-required | Route-family adoption. |
| S-002 | AC-S002-02 | platform-authz.compatibility.root-tenant-auth | API | create-or-refresh-required | Existing code preservation. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-012 | S-002 | `platform-authorization-denials.md` | pre-existing-capability | existing | Route-family API contract work adopts the shared denial status/code/category contract or records an explicit exception. | API contract review now; route integration tests when runtime routes change. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-002 | API owner | contract author | existing route contract; future route contract | denial categories; compatibility exceptions | status code; public code; internal reason | no adoption to adoption | stale API contract | security; privacy; compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S002-01 | API owner; existing route contract; future route contract; denial categories; compatibility exceptions | platform-authz.denial-contract.adoption | contract-level | TC obligation: cover API contract review for Tenant-admin route-family contracts consume `platform-authorization-denials.md` for unauthenticated, tenant selection, tenant context, lifecycle, feature, role, cross-tenant, object, attribute, and sensitive fallback denial categories. | yes |
| AC-S002-02 | API owner; existing route contract; future route contract; denial categories; compatibility exceptions | platform-authz.compatibility.root-tenant-auth | contract-level | TC obligation: cover compatibility review for Existing root and tenant-auth route-family codes remain backwards compatible unless a route-family contract records an explicit migration. | yes |
