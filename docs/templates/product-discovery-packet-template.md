# Product Discovery Packet Template

Do not use this template as the first response to a Product Discovery request.
The first response must be a plain-language summary and one focused question
before tool use, repo inspection, packet drafting, or file creation.

Use this template before Technical Steering, PRD, capability matrix, or
implementation planning begins.

The Product Discovery packet turns a raw change request or post-iteration
feedback signal into product intent, taxonomy classification, journeys,
job-to-be-done statements, use cases, product-level capability implications,
open business decisions, and handoff flags.

This template extends the Layer 1 Product Discovery harness. It does not
replace PRDs, capability matrices, Technical Steering packets, implementation
blueprints, API contracts, data dictionaries, or verification plans.

Draft packet fast path:

- Use only when the user explicitly asks for a draft Product Discovery packet,
  draft discovery packet, discovery pack, or product discovery packet.
- Fast path skips repo guardrails and broad sweeps; it does not skip discovery
  judgment. If important product questions are already known and the user has
  not explicitly asked to bypass the interview, ask before filling the packet.
- The preferred deterministic command is:
  `npm run product-discovery:draft -- --slug <slug> --title "<title>"`.
- Fast-path drafts intentionally skip git preflight, branch/bootstrap/worktree
  checks, maintained-artifact sweeps, broad architecture-doc inspection, and
  broad repo searches.
- Fast-path drafts are not validated, governed, complete,
  implementation-ready, artifact-complete, or promotion-ready.

## Status

- Discovery status:
  `ready-for-technical-steering | blocked-product-intent | blocked-new-template-approval | blocked-new-family-steering | discovery-only`
- Draft posture:
  `draft-fast-path | governed-discovery | not-a-draft`
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

- Do not hand off to Technical Steering below 95% confidence for the chosen
  scope.
- Do not hand off while high-impact product decisions remain unresolved unless
  the Layer 1 requester explicitly signed each one off as deferred until later.
- Technical questions should be packaged for technical stakeholders rather than
  treated as business-owner answers.
- Use `blocked-new-family-steering` when product intent is clear enough to know
  existing families or templates do not fit, but Technical Steering or
  design-system governance must decide how to create or extend the family
  before requirements lock.

## Discovery Interview Summary

Use this section to record the conversation path before the packet was filled.
The interview should feel like a guided business conversation, not form
completion. Ask one question at a time in plain language, summarize each answer
back, recommend the safest default when useful, and confirm whether the summary
should be treated as the rule before moving on.

- Initial understanding shared with requester:
- Interview cadence:
  `one-question-at-a-time-followed | exception-approved`
- If interview cadence exception was approved, why:
- Coverage areas tracked internally:
  `see Universal Coverage Matrix and Triggered Overlay Coverage below`
- Assumptions confirmed by requester:
- Business questions explicitly signed off as deferred until later:
- Technical questions packaged for technical stakeholder:
- Questions still blocking packet confidence:
- Scope cuts used to reach confidence:
- Confidence for chosen status:
  `<percent>; must be 95% or higher for ready-for-technical-steering`

## Discovery Complexity And Completion Gate

- Request complexity:
  `simple | moderate | complex/foundational`
- Complexity rationale:
- Draft-ready rationale:
- First-version path known:
  `yes | no`
- Deferred future support explored:
  `yes | no | not-applicable`
- Deferred future support summary:
- High-risk unknowns remain:
  `none | list below`
- Packet may proceed:
  `yes | no`

Completion rule:

- For `complex/foundational` discovery, knowing the first-version workflow is
  not enough. Deferred future support must be explored enough to classify it as
  `deferred-with-known-direction`, `deferred-open`, or `not-applicable`.
- Do not set `ready-for-technical-steering` until every universal coverage area
  and every triggered overlay area has been classified.
- Every `not-applicable` classification must include a reason.
- Every `deferred-open` item must be resolved, accepted as a blocker, or signed
  off by the requester as deferred before handoff.

## Universal Coverage Matrix

Use this matrix for every Product Discovery packet, regardless of topic.

Allowed status values:

- `answered`
- `assumed-baseline`
- `deferred-with-known-direction`
- `deferred-open`
- `not-applicable`

| Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- |
| Goal and success outcome |  |  |  |
| Primary users and actors |  |  |  |
| Normal first-version workflow |  |  |  |
| Authority and responsibility boundaries |  |  |  |
| Data created, changed, viewed, retained, or deleted |  |  |  |
| Lifecycle states and transitions |  |  |  |
| Exceptions, reversals, and recovery |  |  |  |
| Visibility, notifications, and user feedback |  |  |  |
| Security, privacy, audit, compliance, and abuse baseline |  |  |  |
| Business policy decisions |  |  |  |
| Configuration or customization |  |  |  |
| Billing, plan, quota, or entitlement impact |  |  |  |
| Operational and support needs |  |  |  |
| Reporting, history, and evidence needs |  |  |  |
| Compatibility with existing behavior |  |  |  |
| Future extensibility pressure |  |  |  |
| Explicit out of scope |  |  |  |
| Open blockers |  |  |  |

## Triggered Overlay Coverage

Select overlays from `docs/product-discovery/taxonomy.md`. Add one row per
topic-specific area that the selected overlays require.

| Overlay | Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Known Questions Gate

Use this section to prove that known product questions were asked before packet
status was assigned.

- Plain-language summary shown before drafting:
- First one question asked before drafting:
- Requester answered, corrected, or explicitly deferred first question:
  `yes | no`
- Known important product questions left unasked:
  `none | list below`
- For each unasked business question, requester signoff for "deferred until
  later":
  `none | list below`
- Technical questions not asked of business owner and packaged for technical
  stakeholder:
  `none | list below`
- If any known question was not asked, why was it safe to defer or package:
- Packet status allowed:
  `yes | no`

Gate rule:

- Do not set `ready-for-technical-steering` when known important product
  questions remain unasked, unanswered, unscoped, or unsigned-off as deferred
  until later.
- Do not set `ready-for-technical-steering` below 95% packet confidence.
- Do not ask a business owner to answer technical implementation questions;
  package those questions for technical stakeholders.
- Do not use a first-pass-draft-then-questions pattern.

## Product Intent

- Problem to solve:
- Business outcome:
- Primary user outcome:
- Why now:
- Success signal:
- Non-goal summary:

## Taxonomy Classification

Reference: `docs/product-discovery/taxonomy.md`.

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

## State-Based Journey Matrix

Use this section to identify actor/object lifecycle states, edge journeys,
configuration changes, and state transitions before Technical Steering.

For authentication/access, permission-sensitive, tenant-boundary,
lifecycle-heavy, or configuration-driven requests, the packet should not be
considered ready for Technical Steering unless this matrix is completed or
explicitly deferred with a reason.

Product posture values:

- `ready-for-signoff`
- `needs-product-answer`
- `defer-to-technical-steering`
- `out-of-scope`

### State Inventory

| Entity / object | States considered | Notes |
| --- | --- | --- |
|  |  |  |

### Journey Permutations

| Journey ID | Actor | Actor state | Object | Object state | Action | Outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-STATE-001 |  |  |  |  |  |  |  |

### State Transitions

| Transition ID | Actor | From state | To state | Object affected | Trigger | Expected outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 |  |  |  |  |  |  |  |

## Context Variation And Unhappy Path Coverage

Use this section to make meaningful variations explicit before capabilities are
locked. Mark each item as `in-scope`, `out-of-scope`,
`defer-to-technical-steering`, or `not-applicable`.

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
|  |  | yes/no |  |

## Specialized Product Template / Checklist Reference

Use this section when the taxonomy classification points to a reusable product
family template or specialized discovery checklist.

- Specialized template/checklist used:
- Required because:
- Checklist posture:
  `completed | partially-completed | deferred-with-reason | not-applicable`
- Product answers imported into this packet:
- Deferred checklist items and reason:
- Reference:

## Product Capability Breakdown

Capabilities should be derived from use cases and state-based journey rows. Do
not invent implementation tasks here.

| Capability | Derived from JTBD/use case | Derived from state journey / transition | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

## Business Questions Before Requirements Lock

| Question | Why it matters in plain language | Required before steering? | Current answer / owner | Deferred until later signed off by requester? |
| --- | --- | --- | --- | --- |
|  |  | yes/no |  | yes/no/not-applicable |

## Technical Questions For Technical Stakeholders

Use this section for questions the business owner should not be expected to
answer. Include enough plain-language context that a technical stakeholder can
decide without reopening product intent.

| Question | Plain-language context | Suggested technical owner | Blocks Technical Steering handoff? |
| --- | --- | --- | --- |
|  |  |  | yes/no |

## Explicitly Out Of Scope

- TBD

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed | Owner / signoff |
| --- | --- | --- | --- | --- | --- |
|  |  | high/medium/low |  | yes/no | confirmed / deferred by requester / technical owner / blocking |

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
- Business decisions intentionally deferred until later with requester signoff:
- Technical questions packaged for technical stakeholder:
- Packet confidence for handoff:
- Scope cuts made to reach confidence:
- Risk flags for Technical Steering:
  - permission-sensitive:
  - tenant-boundary:
  - state-based journey matrix:
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
