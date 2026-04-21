# QA Release Gate

## Purpose

Define the repo-wide QA release expectations that sit above individual test
artifacts and prevent "tests exist" from being confused with "the change is
release-ready."

This gate applies to all material changes, not only frontend or end-to-end
workflows.

The recurring human review around this gate is described in:

- [QA Operating Cadence Guide](/home/gordon/kanbien/docs/architecture/guides/qa-operating-cadence-guide.md)

## Core Rule

A change is not release-ready unless the required verification layers have:

- the right planned coverage
- passing executable proof
- acceptable defect posture
- acceptable test reliability
- explicit treatment of residual risk

## Required QA Outcomes

Before a feature loop or release gate is considered complete, confirm:

- required test layers for the change class were identified
- required tests passed in the intended environment
- required static architecture and seam checks passed, including
  `npm run check:feature-dependencies` when feature seams or cross-feature
  dependencies changed
- no blocking defects remain open
- no blocking flaky tests remain unresolved
- no required coverage class was silently omitted
- any exception is explicit, time-bounded, owned, and approved

## Blocking Defect Rule

The following are blocking by default:

- any unresolved defect that breaks a `Tier 0` journey
- any unresolved defect in authentication, authorization, tenant isolation,
  billing-critical behavior, retention/deletion, or compliance-sensitive logic
- any unresolved defect that produces silent data loss, silent privilege
  escalation, or materially misleading system state
- any unresolved defect that invalidates a reviewed contract, migration, or
  security assumption

Default defect-severity interpretation:

- `critical`
  production safety, security, compliance, isolation, billing, or irreversible
  integrity risk
- `high`
  serious customer-impacting workflow breakage or incorrect system behavior
- `medium`
  meaningful but non-blocking defect with workaround or limited blast radius
- `low`
  minor defect, polish gap, or low-risk behavior issue

Release default:

- zero open `critical`
- zero open `high` for blocking change classes

## Blocking Flakiness Rule

Flakiness in any blocking suite is itself a blocking defect.

This applies to:

- unit
- integration
- end-to-end
- security
- audit
- persistence-backed
- frontend
- contract or compatibility suites when they are part of the gate

Exceptional quarantine is allowed only when:

- the business risk of delay is explicitly accepted
- the quarantine has an owner
- mitigation is documented
- expiration or review date is documented
- the affected feature or release gate records the deviation durably

Recommended template:

- [qa-waiver-or-quarantine-template.md](/home/gordon/kanbien/docs/workspace/qa/qa-waiver-or-quarantine-template.md)

## Required Layer Rule

The required test layers for a change must be selected from a deterministic
coverage matrix rather than personal preference.

At minimum, every material change must consider:

- unit
- integration
- end-to-end when workflow or state-machine behavior matters
- security when privilege, auth, or attack-surface behavior matters
- audit when durable audit obligations exist
- persistence-backed verification when durable storage behavior matters

Additional non-functional layers become mandatory when the change class
requires them:

- performance
- resilience/failure-injection
- concurrency/idempotency
- accessibility
- compatibility/contract

## Defect Feedback Rule

Every escaped production defect must trigger a QA feedback review.

Expected result:

- identify which coverage layer should have caught it
- add or strengthen the relevant automated or structured exploratory check
- update the coverage matrix, guide, or feature-loop rule if the miss exposed a
  policy gap

Do not close escaped defects as isolated events when they indicate a reusable
gap in the QA system.

Recommended template:

- [defect-feedback-review-template.md](/home/gordon/kanbien/docs/workspace/qa/defect-feedback-review-template.md)

## Structured Exploratory Rule

Automation-first does not remove the need for structured human review on
high-risk changes.

Structured exploratory QA is required by default for changes that are:

- auth or session critical
- authorization or tenant-isolation sensitive
- billing-critical
- deletion/retention/compliance sensitive
- externally integrated in ways that are hard to model perfectly in stubs
- operationally irreversible or customer-visible in complex ways

Minimum exploratory artifact:

- scope or charter
- areas exercised
- findings
- follow-up defects or explicit "no findings" note

Recommended template:

- [exploratory-qa-note-template.md](/home/gordon/kanbien/docs/workspace/qa/exploratory-qa-note-template.md)

## Contract And Compatibility Rule

When a change depends on an external provider, consumer contract, browser/API
contract, or integration boundary, QA coverage must include at least one of:

- executable contract tests
- compatibility tests against representative fixtures or schemas
- required higher-environment validation plan when deterministic repo-local
  proof is insufficient

Stubbed end-to-end coverage alone is not sufficient if the integration contract
itself can drift.

## Required QA Summary For A Blocking Gate

A blocking feature-loop or release summary should record:

- change scope
- required test layers
- static seam-check outcome, including feature-manifest and dependency-graph
  validation when relevant
- executed commands or suites
- pass/fail outcome by layer
- open defects by severity
- quarantines or exceptions
- residual risk
- approver when an exception exists

Supporting checklist template:

- [qa-checklist-template.md](/home/gordon/kanbien/docs/workspace/qa/qa-checklist-template.md)

## Waiver Rule

Any release or feature-loop waiver must be:

- explicit
- justified
- approved by the responsible engineer or release authority
- time-bounded
- recorded in the curated test summary or equivalent review artifact

Waivers are exceptions, not a parallel delivery path.

## Hard Rule

Do not treat artifact completeness, traceability completeness, or successful
unit-only execution as sufficient evidence for release readiness when the change
class requires broader QA proof.
