# Story Breakdown Story: Tenant dashboard branding projection

## Story Detail

- Story ID:
  `S-005`
- Title:
  Tenant dashboard branding projection
- Context:
  This is its own story because tenant users should see the approved branding after login or reload without needing admin context.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As a tenant user, I need the dashboard branding projection to return safe display name, primary colour, and logo content reference for my current tenant after login or reload.
- Actor / System Perspective:
  tenant user
- Outcome:
  The dashboard consumes authorized tenant branding without live push behavior or cross-tenant leakage.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-003 and S-004 backend outputs

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because tenant users should see the approved branding after login or reload without needing admin context.

**Goal**
Reviewers can understand what should be true afterward: The dashboard consumes authorized tenant branding without live push behavior or cross-tenant leakage.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Tenant dashboard branding projection into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | S-005 | Tenant dashboard branding read evaluates exactly one current tenant context and denies reads when the current tenant does not match the branding owner and asset tenant. | runtime-api | tenant authz; cross-tenant deny; integration | permission mapping; API contract; capability matrix |
| AC-S005-02 | S-005 | The projection returns display name, primary colour, logo URL or null, logo accessibility posture, fallback indicators, and reload/login timing metadata using approved fallback behavior. | contract-level | API contract; state matrix; compatibility | PRD; API contract; OpenAPI/Postman artifacts |
| AC-S005-03 | S-005 | Branding changes are visible after next login or dashboard reload and no v1 behavior promises live updates to already-open dashboards. | runtime-api | session or projection refresh; compatibility | PRD; API contract; frontend test-case plan |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-005 | AC-S005-01 | tenant-branding.dashboard.read | tenant current context | create-or-refresh-required | Cross-tenant denial must be covered. |
| S-005 | AC-S005-02 | tenant-branding.dashboard.read; tenant-branding.fallback.read | tenant dashboard projection | create-or-refresh-required | Projection shape and fallback indicators need rows. |
| S-005 | AC-S005-03 | tenant-branding.dashboard.read | tenant dashboard projection | create-or-refresh-required | Apply timing is reload/login, not live push. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-010 | S-005 / AC-S005-01 | tenant auth current-tenant context | pre-existing-capability | existing | API contract requires exactly one current tenant context. | Runtime API tests cover current-tenant allow and cross-tenant deny. |
| D-011 | S-005 / AC-S005-02 | tenant dashboard branding projection route | new-capability | new | API contract defines projection shape and fallback indicators. | Projection integration tests cover complete, partial, absent, and invalid states. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-005 | tenant user; unauthorized tenant actor | tenant dashboard branding read | current tenant selected; no tenant context; wrong tenant context | complete branding; partial branding; no branding; not-ready logo; denied logo | projection fields; fallback indicators; reload/login timing | branding saved to projection consumed after login or reload | stale projection; cross-tenant deny; asset provider failure | security; compatibility; performance for dashboard load |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
