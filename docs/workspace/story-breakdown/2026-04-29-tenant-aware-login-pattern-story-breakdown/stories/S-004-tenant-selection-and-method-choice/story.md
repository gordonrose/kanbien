# Story Breakdown Story: Tenant selection and method choice

## Story Detail

- Story ID:
  `S-004`
- Title:
  Tenant selection and method choice
- Context:
  This is its own story because people who belong to more than one tenant need to choose the right place before signing in.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As a tenant user, I need to select exactly one tenant and choose among that tenant's enabled methods.
- Actor / System Perspective:
  tenant user
- Outcome:
  Auth method execution is bound to one selected tenant context and disabled methods redirect safely.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-003

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because people who belong to more than one tenant need to choose the right place before signing in.

**Goal**
Reviewers can understand what should be true afterward: Auth method execution is bound to one selected tenant context and disabled methods redirect safely.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Tenant selection and method choice into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | S-004 | Tenant selection binds exactly one selected tenant context before method execution and rejects request-body tenant inference where server-side selection state should own authority. | runtime-api | tenant authz; state transition; replay security | API contract; data dictionary |
| AC-S004-02 | S-004 | Method choice shows only enabled methods for the selected tenant, and a method disabled during login redirects to login with an approved next-step state. | runtime-api | state matrix; lifecycle transition | PRD; API contract; frontend scenarios |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-004 | AC-S004-01 | tenant-login.tenant.select | pre-auth selected tenant | create-or-refresh-required | Exactly one selected tenant context. |
| S-004 | AC-S004-02 | tenant-login.method.choose | selected tenant | create-or-refresh-required | Enabled-method choice and disabled-method redirect. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-007 | S-004 / AC-S004-01 | selected tenant state seam | new-capability | new | API contract binds method execution to one server-side selected tenant. | Runtime tests cover tenant mismatch and replay attempts. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-004 | tenant user | public pre-auth with selected tenant | no tenant selected; one tenant selected; stale selection | method enabled; method disabled; method unavailable | tenant selector; method key | select tenant; choose method; redirect on disabled method | replay attempt; tenant mismatch | security; compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | tenant user; no tenant selected; one tenant selected; stale selection; method enabled; method disabled; method unavailable | tenant-login.tenant.select | runtime-api | TC obligation: cover tenant authz; state transition; replay security for Tenant selection binds exactly one selected tenant context before method execution and rejects request-body tenant inference where server-side selection state should own authority. | yes |
| AC-S004-02 | tenant user; no tenant selected; one tenant selected; stale selection; method enabled; method disabled; method unavailable | tenant-login.method.choose | runtime-api | TC obligation: cover state matrix; lifecycle transition for Method choice shows only enabled methods for the selected tenant, and a method disabled during login redirects to login with an approved next-step state. | yes |
