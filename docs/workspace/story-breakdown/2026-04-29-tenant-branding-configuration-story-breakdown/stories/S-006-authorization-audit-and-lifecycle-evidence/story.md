# Story Breakdown Story: Authorization, audit, and lifecycle evidence

## Story Detail

- Story ID:
  `S-006`
- Title:
  Authorization, audit, and lifecycle evidence
- Context:
  This is its own story because branding and logo changes are sensitive enough to need reviewable decisions and cleanup behavior.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As platform governance, I need allow and deny decisions, audit events, lifecycle cleanup states, quota posture, and privacy exclusions recorded for branding and logo operations.
- Actor / System Perspective:
  security, audit, and operations
- Outcome:
  Permission-sensitive and asset-sensitive behavior has durable evidence and retryable failure visibility.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Cross-cuts S-003 through S-005

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because branding and logo changes are sensitive enough to need reviewable decisions and cleanup behavior.

**Goal**
Reviewers can understand what should be true afterward: Permission-sensitive and asset-sensitive behavior has durable evidence and retryable failure visibility.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Authorization, audit, and lifecycle evidence into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S006-01 | S-006 | Permission mapping defines root-admin manage and read capabilities, tenant-dashboard branding read capability, required asset capabilities, and cross-tenant deny rules. | contract-level | permission allow and deny; policy review | permission mapping; capability matrix |
| AC-S006-02 | S-006 | Audit evidence covers branding create, read deny, update, logo intent creation, upload completion, mismatch or failure, link or replacement, delete if approved, cleanup failure, quota denial, and cross-tenant denial without logging forbidden fields. | persistence-level | audit integration; privacy log review | audit docs; privacy note; capability matrix |
| AC-S006-03 | S-006 | Expired, abandoned, rejected, orphaned, and failed-cleanup logo states have owner, retry, quota, cost, and operational visibility semantics before implementation begins. | contract-level | lifecycle matrix; operational evidence review | PRD; asset alignment note; runbook note |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-006 | AC-S006-01 | root-admin.tenant-branding.read; root-admin.tenant-branding.manage; tenant-branding.dashboard.read; asset.create; asset.link; asset.read; asset.content.read | authz | create-or-refresh-required | Exact grants need permission mapping. |
| S-006 | AC-S006-02 | tenant-branding.audit.record | audit | create-or-refresh-required | Forbidden logged fields are part of proof. |
| S-006 | AC-S006-03 | asset.lifecycle.cleanup; tenant-branding.logo.lifecycle | lifecycle | create-or-refresh-required | Cleanup semantics block delivery planning. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-012 | S-006 / AC-S006-01 | rootRoles or central authz policy evaluation | authz-capability | existing or changed | Permission mapping names grants and deny rules. | Authz tests cover root read/manage, tenant read, non-root deny, cross-tenant deny. |
| D-013 | S-006 / AC-S006-02 | audit event writer | feature-public-seam | existing or changed | Audit artifact defines event names, fields, and forbidden fields. | Audit integration tests cover success and denial evidence. |
| D-014 | S-006 / AC-S006-03 | asset cleanup command or future scheduler seam | job-queue-or-worker | existing or future | Lifecycle plan defines owner, retry, quota, and failure evidence. | Cleanup tests cover expired, abandoned, orphaned, and failed-delete states. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-006 | security reviewer; audit reviewer; operations reviewer | policy review; audit read if approved | root actor; tenant actor; unauthorized actor | success event; denial event; failed cleanup; quota denial | forbidden log fields; event names; tenant IDs; asset IDs without secret values | allowed request; denied request; retryable cleanup failure | audit writer failure; policy misconfiguration; quota service failure | security; privacy; audit; resilience; operational evidence |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S006-01 | security reviewer; audit reviewer; operations reviewer; root actor; tenant actor; unauthorized actor; success event; denial event; failed cleanup; quota denial | root-admin.tenant-branding.read; root-admin.tenant-branding.manage; tenant-branding.dashboard.read; asset.create; asset.link; asset.read; asset.content.read | contract-level | TC obligation: cover permission allow and deny; policy review for Permission mapping defines root-admin manage and read capabilities, tenant-dashboard branding read capability, required asset capabilities, and cross-tenant deny rules. | yes |
| AC-S006-02 | security reviewer; audit reviewer; operations reviewer; root actor; tenant actor; unauthorized actor; success event; denial event; failed cleanup; quota denial | tenant-branding.audit.record | persistence-level | TC obligation: cover audit integration; privacy log review for Audit evidence covers branding create, read deny, update, logo intent creation, upload completion, mismatch or failure, link or replacement, delete if approved, cleanup failure, quota denial, and cross-tenant denial without logging forbidden fields. | yes |
| AC-S006-03 | security reviewer; audit reviewer; operations reviewer; root actor; tenant actor; unauthorized actor; success event; denial event; failed cleanup; quota denial | asset.lifecycle.cleanup; tenant-branding.logo.lifecycle | contract-level | TC obligation: cover lifecycle matrix; operational evidence review for Expired, abandoned, rejected, orphaned, and failed-cleanup logo states have owner, retry, quota, cost, and operational visibility semantics before implementation begins. | yes |
