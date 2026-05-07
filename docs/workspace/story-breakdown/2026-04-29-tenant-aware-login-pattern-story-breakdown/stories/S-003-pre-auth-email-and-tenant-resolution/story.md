# Story Breakdown Story: Pre-auth email and tenant resolution

## Story Detail

- Story ID:
  `S-003`
- Title:
  Pre-auth email and tenant resolution
- Context:
  This is its own story because the first sign-in question should guide people safely without revealing too much.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As a tenant user, I need email entry and tenant resolution to reveal only safe next steps.
- Actor / System Perspective:
  tenant user
- Outcome:
  Email is normalized, no-match outcomes are generic, and multi-tenant choices appear only after approved resolution.
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
This is its own story because the first sign-in question should guide people safely without revealing too much.

**Goal**
Reviewers can understand what should be true afterward: Email is normalized, no-match outcomes are generic, and multi-tenant choices appear only after approved resolution.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Pre-auth email and tenant resolution into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S003-01 | S-003 | Email entry trims and lowercases email, rejects empty strings and invalid email format, and preserves generic no-match messaging for absent user, tenant, or membership states. | runtime-api | validation; security; enumeration resistance | API contract; capability matrix |
| AC-S003-02 | S-003 | Single-tenant and multi-tenant outcomes expose only approved tenant choice information after the pre-auth resolution threshold and never grant authority before method execution succeeds. | runtime-api | privacy; auth flow; tenant boundary | API contract; permission mapping |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-003 | AC-S003-01 | tenant-login.pre-auth-email.resolve | public pre-auth | create-or-refresh-required | Normalization and generic no-match. |
| S-003 | AC-S003-02 | tenant-login.tenant-choice.list | public pre-auth | create-or-refresh-required | Safe tenant choice disclosure. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-006 | S-003 / AC-S003-01 | pre-auth identity resolution seam | new-capability | new | API contract proves generic no-match and email normalization. | API tests cover invalid, absent, and eligible outcomes. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-003 | unauthenticated user | public pre-auth only | invalid email; valid email; no match; eligible single tenant; eligible multi-tenant | user active; user removed; membership active; tenant disabled | trimmed lowercase email; empty string rejection | email entry to tenant choice | enumeration attempt; identity seam unavailable | privacy; security; performance |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S003-01 | unauthenticated user; invalid email; valid email; no match; eligible single tenant; eligible multi-tenant; user active; user removed; membership active; tenant disabled | tenant-login.pre-auth-email.resolve | runtime-api | TC obligation: cover validation; security; enumeration resistance for Email entry trims and lowercases email, rejects empty strings and invalid email format, and preserves generic no-match messaging for absent user, tenant, or membership states. | yes |
| AC-S003-02 | unauthenticated user; invalid email; valid email; no match; eligible single tenant; eligible multi-tenant; user active; user removed; membership active; tenant disabled | tenant-login.tenant-choice.list | runtime-api | TC obligation: cover privacy; auth flow; tenant boundary for Single-tenant and multi-tenant outcomes expose only approved tenant choice information after the pre-auth resolution threshold and never grant authority before method execution succeeds. | yes |
