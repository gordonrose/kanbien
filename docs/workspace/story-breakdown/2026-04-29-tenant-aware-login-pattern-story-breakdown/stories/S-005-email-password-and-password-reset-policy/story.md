# Story Breakdown Story: Email-password and password-reset policy

## Story Detail

- Story ID:
  `S-005`
- Title:
  Email-password and password-reset policy
- Context:
  This is its own story because password sign-in and reset are familiar user moments with their own safety expectations.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As a tenant user, I need email-password login and reset only when enabled for the selected tenant.
- Actor / System Perspective:
  tenant user
- Outcome:
  Password reset cannot bypass tenant method policy and tokens remain tenant-bound, short-lived, and secret-safe.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-002 through S-004

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because password sign-in and reset are familiar user moments with their own safety expectations.

**Goal**
Reviewers can understand what should be true afterward: Password reset cannot bypass tenant method policy and tokens remain tenant-bound, short-lived, and secret-safe.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Email-password and password-reset policy into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | S-005 | Email-password login and password reset are available only when email-password is enabled for the selected tenant and the user membership is active. | runtime-api | auth; lifecycle; validation | API contract; capability matrix |
| AC-S005-02 | S-005 | Password reset tokens are tenant-bound, method-policy-bound, short-lived, single-use, audit-visible, and never logged or serialized into replay URLs. | persistence-level | token lifecycle; privacy; audit | data dictionary; API contract; runbook note |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-005 | AC-S005-01 | tenant-login.email-password.authenticate | selected tenant | create-or-refresh-required | Email-password policy binding. |
| S-005 | AC-S005-02 | tenant-login.password-reset.request | selected tenant | create-or-refresh-required | Tenant-bound reset token lifecycle. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-008 | S-005 / AC-S005-02 | one-time token library | feature-public-seam | existing or changed | Token contract proves tenant, method, expiry, single-use, and audit binding. | Token lifecycle tests cover expiry, reuse, wrong tenant, disabled method. |
| D-009 | S-005 / AC-S005-02 | notification delivery | feature-public-seam | existing or changed | Contract proves password reset delivery without token logging. | Integration tests cover reset request and delivery failure evidence. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-005 | tenant user; notification system | selected tenant auth method | active membership; reset requested; reset expired | email-password enabled; method disabled; token active; token used | password credential; reset token; email value | login; request reset; consume reset; expire token | delivery failure; token reuse; wrong tenant | privacy; audit; resilience |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | tenant user; notification system; active membership; reset requested; reset expired; email-password enabled; method disabled; token active; token used | tenant-login.email-password.authenticate | runtime-api | TC obligation: cover auth; lifecycle; validation for Email-password login and password reset are available only when email-password is enabled for the selected tenant and the user membership is active. | yes |
| AC-S005-02 | tenant user; notification system; active membership; reset requested; reset expired; email-password enabled; method disabled; token active; token used | tenant-login.password-reset.request | persistence-level | TC obligation: cover token lifecycle; privacy; audit for Password reset tokens are tenant-bound, method-policy-bound, short-lived, single-use, audit-visible, and never logged or serialized into replay URLs. | yes |
