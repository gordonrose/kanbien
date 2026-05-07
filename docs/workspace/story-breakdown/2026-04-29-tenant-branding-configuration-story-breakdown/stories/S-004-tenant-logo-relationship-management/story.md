# Story Breakdown Story: Tenant logo relationship management

## Story Detail

- Story ID:
  `S-004`
- Title:
  Tenant logo relationship management
- Context:
  This is its own story because logo handling has safety, ownership, and accessibility expectations beyond text and color.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As a root admin, I need to create, replace, and consume a current tenant logo relationship only when the asset is ready and consumer metadata is present.
- Actor / System Perspective:
  root admin and asset system
- Outcome:
  Tenant branding owns the logo relationship while assets owns file safety, storage policy, and content delivery invariants.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on approved asset decision and assets public seams

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because logo handling has safety, ownership, and accessibility expectations beyond text and color.

**Goal**
Reviewers can understand what should be true afterward: Tenant branding owns the logo relationship while assets owns file safety, storage policy, and content delivery invariants.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Tenant logo relationship management into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S004-01 | S-004 | Logo upload or replacement creates a short-lived, single-use, actor-bound, scope-bound, storage-key-bound intent for exactly one selected tenant using only the approved MIME and size limits. | runtime-api | asset contract; validation; quota; authz | asset alignment note; capability matrix; API contract |
| AC-S004-02 | S-004 | The logo relationship can become consumer-ready only when the asset is ready, tenant scope matches, lifecycle state is allowed, and contextual alt text or decorative posture is recorded. | persistence-level | asset readiness; state transition; accessibility metadata | data dictionary; asset alignment note; capability matrix |
| AC-S004-03 | S-004 | Dashboard logo delivery uses same-origin authenticated streaming with `nosniff`, never raw bucket URLs, never public delivery, and never direct DOM injection of uploaded SVG markup. | runtime-api | asset content read; security headers; SVG safety | API contract; asset docs; security notes |
| AC-S004-04 | S-004 | Replacement uses a new asset or version with a new storage key and leaves prior bytes governed by approved retention, cleanup, quota, and audit behavior. | persistence-level | lifecycle transition; cleanup evidence; audit | data dictionary; asset alignment note; runbook note |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-004 | AC-S004-01 | root-admin.tenant-branding.logo.update; asset.create | asset relationship | create-or-refresh-required | Uses approved asset use case. |
| S-004 | AC-S004-02 | root-admin.tenant-branding.logo.update; asset.link | asset relationship | create-or-refresh-required | Consumer readiness includes accessibility metadata. |
| S-004 | AC-S004-03 | tenant-branding.logo.read; asset.content.read | asset delivery | create-or-refresh-required | Same-origin private content delivery only. |
| S-004 | AC-S004-04 | root-admin.tenant-branding.logo.update; asset.lifecycle.cleanup | asset lifecycle | create-or-refresh-required | Replacement and old-asset lifecycle need explicit rows. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-007 | S-004 / AC-S004-01 | assets upload-intent seam | feature-public-seam | existing or narrow extension | API contract proves actor, tenant scope, storage key, expiry, MIME, and size binding. | Asset integration tests cover allowed and denied upload-intent creation. |
| D-008 | S-004 / AC-S004-02 | assets readiness and lifecycle seam | feature-public-seam | existing or narrow extension | Contract proves ready, rejected, pending, deleted, tenant mismatch, and sanitizer states. | Integration tests cover consumer-ready and consumer-not-ready logo states. |
| D-009 | S-004 / AC-S004-03 | same-origin asset content-read route | feature-public-seam | existing or narrow extension | API contract proves authenticated content read, headers, and no raw bucket URL. | Runtime tests cover content-read authorization, headers, SVG image-resource posture. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-004 | root admin; asset system; tenant user as logo reader | root logo update; asset create/link/read/content-read; denied mismatch | authorized root; unauthorized actor; tenant user current context | pending asset; ready asset; rejected asset; deleted asset; tenant mismatch; missing alt metadata | approved MIME; size limit; SVG sanitizer; alt text or decorative posture | create intent; complete upload; link; replace; dereference prior logo; cleanup | quota denial; sanitizer failure; content-read deny; cleanup failure | security; privacy; accessibility; resilience; operational evidence |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
