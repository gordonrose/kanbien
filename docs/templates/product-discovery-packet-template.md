# Product Discovery Packet Template

Use this template before Technical Steering, PRD, capability matrix, or
implementation planning begins.

The Product Discovery packet turns a raw change request or post-iteration
feedback signal into product intent, taxonomy classification, journeys,
job-to-be-done statements, use cases, product-level capability implications,
open business decisions, and handoff flags.

This template extends the Layer 1 Product Discovery harness. It does not
replace PRDs, capability matrices, Technical Steering packets, implementation
blueprints, API contracts, data dictionaries, or verification plans.

## Status

- Discovery status:
  `ready-for-technical-steering | blocked-product-intent | blocked-new-template-approval | blocked-new-family-steering | discovery-only`
- Original request:
- Plain-language request summary:
- Packet date:
- Owner / requester:
- Related product template:
- Product template posture:
  `template-used | template-used-with-overrides | generic-template-used | new-template-needed | no-template-used`
- Taxonomy version:
- Prior packet or feedback reference:

Canonical Layer 1 stop condition:

- Do not hand off to Technical Steering while high-impact product decisions
  remain unresolved unless this packet explicitly marks them safe to defer.
- Use `blocked-new-family-steering` when product intent is clear enough to know
  existing families or templates do not fit, but Technical Steering or
  design-system governance must decide how to create or extend the family
  before requirements lock.

## Discovery Interview Summary

Use this section to record the conversation path before the packet was filled.
The interview should feel like product discovery, not form completion.

- Initial understanding shared with requester:
- Question groups covered:
  - product intent:
  - actors and governance:
  - journeys and jobs:
  - context variation:
  - unhappy paths:
  - scope boundaries:
  - Technical Steering deferrals:
- Assumptions confirmed by requester:
- Assumptions explicitly deferred:
- Questions still blocking packet confidence:
- Questions safe to defer to Technical Steering:
- Confidence for chosen status:
  `high | medium | low`

## Product Intent

- Problem to solve:
- Business outcome:
- Primary user outcome:
- Why now:
- Success signal:
- Non-goal summary:

## Taxonomy Classification

Reference: `docs/workspace/product-discovery/taxonomy.md`.

- Product feature type:
- UX pattern(s):
- Data ownership shape:
- Surface / management location:
- Actor and permission shape:
- Relationship shape:
- Reporting / read model shape:
- Lifecycle shape:
- Integration / externality shape:
- Evidence / compliance sensitivity:
- New taxonomy value needed:
- New taxonomy axis needed:

## Feature Family / Product Template Fit

- Existing feature family:
- Reusable product template used:
- Template overrides:
- New family or template needed:
- Reuse rationale:
- Existing families/templates considered:
- Why rejected:

## New Family Candidate

Fill this section when no existing family or product template fits the business
problem well enough for safe reuse.

- New family candidate needed:
- Proposed family name:
- Business problem it exists to solve:
- Why existing taxonomy values/templates do not fit:
- Reusable user/job pattern:
- Expected journeys:
- Expected capability groups:
- Expected actors / permissions:
- Expected data ownership shape:
- Expected relationship shape:
- Expected reporting / read model shape:
- Expected lifecycle shape:
- Product-template candidate needed:
- Approval needed before requirements lock:

## UX / Design-System Extension Signal

Use this section to flag possible UX or governed design-system gaps. Product
Discovery may identify the signal and frame the product reason, but Technical
Steering and design-system governance decide the architecture and pattern path.

- Existing signed-off UX family appears sufficient:
- Existing UX pattern likely needs extension:
- New UX pattern may be needed:
- Design-system extension may be needed:
- Affected surfaces:
- User workflow reason:
- Product constraints:
- Existing design-system references checked:
- Must stop before app UI implementation:
- Technical Steering / design-system questions:

## Users, Actors, And Context

- Primary actor:
- Secondary actors:
- Configuration / governance actors:
- Support / root / operator actors:
- System or external-provider actors:
- Affected modules / surfaces:
- Root / tenant / public posture:
- Permission-sensitive decisions still open:
- Current context:
- Trigger event:

## User Journey Flow

### Primary Journey

1. User starts from:
2. User wants to:
3. System helps by:
4. User completes when:

### Alternate / Edge Journeys

- TBD

### Denied, Empty, Failed, Or Degraded States

- TBD

## Job-To-Be-Done Bridge

Capture every actor perspective implied by the request. Do not limit JTBD to
the final end-user journey when admins, operators, support actors, system jobs,
or external providers configure, govern, support, or materially affect the
product behavior.

### Actor Perspective Map

| Perspective | Actor | Product responsibility | Included? | Why / why not |
| --- | --- | --- | --- | --- |
| End user journey |  | completes the product journey | yes/no |  |
| Admin / configuration |  | configures or governs rules | yes/no |  |
| Support / root / governance |  | supports, overrides, audits, or governs | yes/no |  |
| System / external provider |  | affects behavior, availability, or policy | yes/no |  |

### JTBD Statements

| JTBD ID | Actor perspective | User type | Needs to | So they can | Trigger / context | Success looks like |
| --- | --- | --- | --- | --- | --- | --- |
| JTBD-001 | end user journey |  |  |  |  |  |

### Epic-Level Job Summary

- User type:
- Needs to:
- So they can:
- Current context:
- Trigger event:
- Desired outcome:
- Success looks like:

### Current Satisfaction

They are currently happy with:

- TBD

They are currently unhappy with:

- TBD

### Proposed Product Idea

Their idea would:

- TBD

### Examples / Evidence

Examples involve:

- TBD

## Use Case Statements

| Use case | Derived from JTBD | User type | Action type | Goal | Example evidence | Product implication |
| --- | --- | --- | --- | --- | --- | --- |
| UC-001 | JTBD-001 |  |  |  |  |  |

## Context Variation And Unhappy Path Coverage

Use this section to make meaningful variations explicit before capabilities are
locked. Mark each item as `in-scope`, `out-of-scope`,
`defer-to-technical-steering`, or `not-applicable`.

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
|  |  | yes/no |  |

### Authentication / Login Request Coverage

Use this checklist when the request involves login, authentication,
tenant-aware sign-in, SSO, password authentication, invited users, auth policy,
or account recovery.

| Authentication context / edge case | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
| single-tenant user |  | yes/no |  |
| multi-tenant user |  | yes/no |  |
| no matching tenant |  | yes/no |  |
| email exists in more than one tenant |  | yes/no |  |
| invalid email |  | yes/no |  |
| unsupported auth method |  | yes/no |  |
| SSO failure or unavailable provider |  | yes/no |  |
| password reset / forgotten password when email/password is in scope |  | yes/no |  |
| tenant auth policy changes during in-progress login |  | yes/no |  |
| user removed, disabled, or invited-but-not-activated |  | yes/no |  |
| account enumeration / privacy posture |  | yes/no |  |
| actor who configures tenant auth rules |  | yes/no |  |
| tenants allow multiple methods or exactly one |  | yes/no |  |
| root override of tenant auth settings |  | yes/no |  |

## Product Capability Breakdown

Capabilities should be derived from use cases. Do not invent implementation
tasks here.

| Capability | Derived from use case | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Business Questions Before Requirements Lock

| Question | Why it matters | Required before steering? | Current answer / owner |
| --- | --- | --- | --- |
|  |  | yes/no |  |

## Explicitly Out Of Scope

- TBD

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed |
| --- | --- | --- | --- | --- |
|  |  | high/medium/low |  | yes/no |

## Discovery Feedback Loop

- Feedback status:
  `not-started | collecting | review-needed | incorporated | superseded`
- First iteration reference:
- Feedback sources:
  - user interview:
  - support issue:
  - analytics / usage signal:
  - runtime defect:
  - sales / stakeholder input:
  - internal operator note:
- Feedback review date:
- Decision owner:

| Feedback ID | Source | Observation | Affects JTBD / journey / capability / out-of-scope / assumption? | Decision | Follow-up |
| --- | --- | --- | --- | --- | --- |
| FDBK-001 |  |  |  | accept / reject / defer / needs-more-evidence |  |

## Discovery Revision Ledger

| Revision | Changed because | Product discovery impact | Downstream artifacts to revisit |
| --- | --- | --- | --- |
| R1 |  |  |  |

## Technical Steering Handoff

- Product decisions locked:
- Product decisions intentionally deferred:
- Risk flags for Technical Steering:
  - permission-sensitive:
  - tenant-boundary:
  - governed frontend:
  - new UX pattern:
  - design-system extension:
  - asset/user file:
  - reporting/read model:
  - migration/persistence:
  - async/job:
  - external provider:
  - privacy/compliance:
- Recommended next artifact:
- Stop condition triggered:
