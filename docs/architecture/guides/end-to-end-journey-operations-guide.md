# End-To-End Journey Operations Guide

## Purpose

Turn the repo-wide end-to-end journey policy into concrete operating steps:

- where journey artifacts live
- how journey scenarios are named and traced
- where executable end-to-end tests belong
- how engineers choose vertical-slice versus broader execution
- where raw and curated test evidence lives

Use this guide together with:

- [End-To-End Journey Testing Guide](./end-to-end-journey-testing-guide.md)
- [Testing And Verification Guide](./testing-and-verification-guide.md)
- [Change Artifact Requirements](../../standards/change-artifact-requirements.md)

## Required Durable Surfaces

When a feature has end-to-end journey obligations, the durable source-
independent and executable surfaces are:

- PRD in `docs/prd/`
- PRD-derived test cases in `docs/prd/test_cases/`
- journey inventory in `docs/prd/journey_inventories/`
- executable end-to-end tests in `tests/e2e/`
- raw machine evidence in CI artifacts
- curated source-controlled run summaries in
  `docs/workspace/test-run-summaries/`

Do not scatter journey inventories into ad hoc notes, PR comments, or issue
threads and treat those as the durable source of truth.

## Folder And File Placement

### Journey inventory documents

Store one journey inventory companion per feature or materially distinct PRD
slice under:

- `docs/prd/journey_inventories/`

Recommended naming:

- `<date>-<sequence>-<feature-slug>-journey-inventory.md`

Examples:

- `2026-04-09-0009-tenant-auth-foundation-journey-inventory.md`
- `2026-04-09-0010-tenant-auth-policy-foundation-journey-inventory.md`

When a journey inventory is tied tightly to an existing PRD, reuse the same
date/sequence stem where practical.

### Executable end-to-end tests

Store executable end-to-end journey tests under:

- `tests/e2e/<featureArea>/`

Examples:

- `tests/e2e/tenantAuth/`
- `tests/e2e/tenantAuthPolicy/`
- `tests/e2e/rootAuth/`

Keep end-to-end tests separate from integration tests when the primary value is
multi-step workflow proof rather than narrower feature composition.

### Curated run summaries

Store curated source-controlled test-run summaries under:

- `docs/workspace/test-run-summaries/`

Recommended naming:

- `<date>-<scope>-test-summary.md`

Examples:

- `2026-04-09-tenant-auth-policy-vertical-slice-test-summary.md`
- `2026-04-09-release-candidate-full-test-summary.md`

These summaries are not a replacement for CI artifacts.
They are the durable audit-readable memory of significant runs, exceptions, and
gates.

## Journey Inventory Contract

Each journey inventory should include at minimum:

- feature or slice name
- related PRD path
- related capability matrix path
- related blueprint path when one exists
- journey scope summary
- known-pitfall research summary
- scenario list with stable journey IDs
- tier per journey
- required permutations
- related `TC-*` test-case IDs where applicable
- planned executable test location
- execution expectations:
  vertical-slice, broader validation, production gate
- state-dimension review for permutation control
- explicit lifecycle and operator-change review

Recommended per-scenario fields:

- `Journey ID`
- `Journey Name`
- `Tier`
- `Primary Actor`
- `Tenant Variation`
- `Role Variation`
- `Legacy/Post-Change State`
- `Trigger`
- `Expected Outcome`
- `Related Capability Matrix Rows`
- `Related Test Cases`
- `Suggested Test Path`
- `Execution Gates`
- `Notes`

## Permutation Coverage Threshold Rule

The repo does not require brute-force coverage of every mathematical
permutation in a complex system.

The required threshold is:

- exhaustive coverage of behavior-changing state classes
- pairwise coverage across behavior-changing dimensions by default
- explicit higher-order coverage where risk, standards, or known defect
  patterns justify it

Any omitted permutation class must be explainable as one of:

- equivalent to an already-covered class
- unreachable by design
- intentionally deferred with an explicit risk note

Do not treat "too many combinations" as a reason to leave the threshold vague.

## State-Dimension Review Rule

Before journey scenarios are finalized, the journey inventory must identify the
meaningful state dimensions for the workflow.

Examples:

- actor lifecycle:
  first-time, repeat, disabled
- entity lifecycle:
  active, deleted, revoked
- tenant shape:
  one tenant, multiple tenants
- policy posture:
  default, override
- auth mode:
  password-only, SSO-only
- credential posture:
  compliant, remediation-required
- request posture:
  valid request, invalid request, denied request
- operator-induced state change:
  self-managed only, admin-reset, support-triggered invalidation

For each dimension, record:

- dimension name
- why it matters or does not matter
- whether it is:
  - behavior-changing
  - non-behavior-changing
  - pending-review
- its equivalence classes

Dimensions classified as non-behavior-changing do not need independent
permutation expansion unless a later review shows they alter outcome.

Default posture:

- if deletion, disablement, revocation, expiry, or operator-induced state change
  can credibly alter the workflow outcome, include it as a reviewed dimension
  rather than silently excluding it
- when in doubt, err on the side of inclusion and then collapse by equivalence
  class if the behavior is truly the same

## Equivalence-Class Rule

Use equivalence classes to collapse raw permutations into behaviorally distinct
groups.

Example:

- password length values of `12`, `16`, and `24` may belong to one class if
  they all behave identically under the same policy
- "two tenants" and "five tenants" may belong to one class if the workflow
  behavior only depends on whether tenant selection is required

Each behavior-changing dimension must declare its equivalence classes
explicitly in the journey inventory.

## Coverage-Selection Rule

For every journey inventory, determine coverage in this order:

1. Single-dimension coverage
   Cover every behavior-changing equivalence class at least once.
2. Pairwise coverage
   Cover every meaningful pairwise interaction across behavior-changing
   dimensions.
3. Higher-order coverage
   Add three-way or higher combinations only where:
   - standards-sensitive behavior is involved
   - tenant isolation or authorization outcomes can change
   - remediation/recovery behavior can change
   - legacy versus post-change data can interact with another dimension
   - lifecycle or operator-induced state can interact with another dimension
   - known industry or repo defect history justifies it

If a higher-order interaction is not required, say so explicitly rather than
leaving the rationale implicit.

## Step-State Matrix Rule

When a journey has multiple steps, do not expand permutations blindly across
all steps.

Instead:

- identify which dimensions can change behavior at each step
- carry forward only the state that remains relevant to later steps
- avoid multiplying dimensions that no longer affect outcome after a prior
  branch has collapsed

This keeps the model aligned to the actual state machine instead of a naive
Cartesian product.

## Required Inventory Review Table

Each journey inventory should include a compact review table or equivalent
section with:

- `Dimension`
- `Classification`
- `Equivalence Classes`
- `Affects Steps`
- `Required Coverage Level`
- `Reason`

Recommended coverage-level vocabulary:

- `single-class only`
- `pairwise`
- `higher-order required`
- `excluded`

## Tier-Based Threshold Rule

Apply the coverage threshold by tier:

- `Tier 0`
  Cover all behavior-changing classes, all meaningful pairwise interactions,
  and all identified high-risk higher-order interactions.
- `Tier 1`
  Cover all behavior-changing classes and meaningful pairwise interactions.
- `Tier 2`
  Cover the dominant behavior-changing classes and the primary happy, failure,
  or deny paths, with pairwise expansion where credible risk remains.

Tier does not remove the need for judgment.
It defines the default minimum scrutiny.

## Omission Review Rule

Every reviewed journey inventory should include an explicit omissions section
or equivalent notes for:

- excluded dimensions
- excluded combinations
- deferred combinations
- rationale for treating them as equivalent, unreachable, or low-risk

This makes the boundary of the tested space auditable instead of implicit.

Default omission posture:

- lifecycle, deletion, disablement, revocation, and operator-induced state
  changes should be assumed included unless the inventory explicitly explains
  why they are equivalent, unreachable, or governed by a different reviewed
  capability

## Journey ID Convention

Use stable `JY-*` IDs for journey scenarios.

Recommended format:

- `JY-<FEATURE>-001`

Examples:

- `JY-TENANT-AUTH-001`
- `JY-TENANT-AUTH-POLICY-004`

Rules:

- keep IDs stable once reviewed
- do not renumber surviving journeys casually
- supersede or retire journeys explicitly when intent changes materially
- do not infer tier from the ID itself; store tier as explicit metadata

## Traceability Pattern

End-to-end journey traceability should link:

- capability matrix rows
- PRD
- PRD-derived `TC-*` cases
- `JY-*` journey scenarios
- executable end-to-end tests
- significant run summaries when those runs are part of a gate or audit trail

Current repo minimum:

- executable tests should include the relevant `JY-*` IDs in the test name or a
  nearby executable comment
- executable tests should continue to include related `TC-*` IDs where the
  PRD-derived test-case plan covers the same workflow
- curated run summaries should list the executed journey IDs or the inventory
  file sections they cover

Until a dedicated `JY-*` traceability checker exists, this linkage must be kept
explicit in docs and test naming rather than treated as implied.

## Test Design Split

Use the following split when deciding whether a scenario belongs in integration
or end-to-end coverage:

- integration:
  cross-module proof for a capability or small feature seam
- end-to-end:
  multi-step customer or operator workflow where durable state, actor state,
  tenant state, remediation, or time-sequenced transitions are the main risk

If a test exists only to prove a real user journey works end to end, prefer
`tests/e2e/`.

## Scenario Builder Rule

When two or more journey scenarios share setup patterns, extract reusable
scenario builders or seeded factories instead of handcrafting every setup path.

Preferred locations:

- generic reusable builders:
  `tests/harness/`
- feature-focused journey builders:
  `tests/helpers/`

The goal is deterministic scenario creation, not hiding business rules in test
infrastructure.

## Execution Model

### Current baseline commands

The repo already provides:

- `npm test`
- `npm run test:persistence`
- `npm run test:persistence:preserve`
- `npm run test:traceability`
- `npm run test:lifecycle:report`

These remain the baseline proof commands for current layers.

### Current end-to-end execution posture

Until dedicated top-level end-to-end scripts are added, run end-to-end journey
tests through targeted Vitest file selection under `tests/e2e/`.

Example pattern:

```bash
npx vitest run tests/e2e/tenantAuth/*.test.ts
```

If the journey depends on the Postgres-backed test environment, run it using
the same dedicated test-database posture used by persistence-backed suites.

### Target command contract

As the end-to-end layer grows, the repo should converge on script support for:

- affected vertical-slice end-to-end runs
- full end-to-end suite runs
- tier-filtered end-to-end runs

Recommended future scripts:

- `npm run test:e2e`
- `npm run test:e2e:full`
- `npm run test:e2e:tier -- --tier=0`
- `npm run test:e2e:affected -- <feature-or-tag>`

Do not block journey adoption on those scripts existing first.
The immediate requirement is deterministic runnable tests, even if the first
execution surface is direct Vitest invocation.

## Vertical-Slice Selection Rule

For local development and PR feedback, define the affected vertical slice by:

- touched feature code
- touched shared seams
- directly downstream route or workflow surfaces
- changed role or tenant boundary behavior
- changed persistence or migration behavior
- changed PRD test cases or journey inventory

Minimum affected run expectation:

- touched unit tests
- directly affected integration tests
- affected security or audit tests when the slice changes those concerns
- affected end-to-end smoke journeys for the changed workflow
- traceability check when PRD-derived cases changed

If a shared seam changed, widen the vertical slice rather than pretending the
impact is purely feature-local.

## Production-Gate Rule

Before production by default, run:

- full unit suite
- full integration suite
- full `Tier 0` and `Tier 1` end-to-end suite
- required security, audit, and persistence-backed suites

`Tier 2` should run when:

- the change affects those journeys
- a broader validation gate is being exercised
- a scheduled full-sweep cadence is due

Any narrower release gate must be explicit, exceptional, and recorded.

## Curated Run Summary Contract

Curated run summaries should be written for at least:

- release-candidate or production-gate runs
- significant vertical-slice feature-loop completions
- approved exception or quarantine events
- major standards-sensitive slices

Each summary should include:

- date
- scope
- commit or branch reference when known
- environment
- commands executed
- relevant PRD, test-case, and journey inventory links
- journey tiers covered
- pass/fail summary
- exception or quarantine notes
- owner
- follow-up actions when applicable

## CI Artifact Rule

Every important automated run should keep raw machine evidence in CI artifacts,
including where available:

- command output
- JUnit or equivalent structured reports
- coverage summaries
- environment and build identifiers
- timestamps

The source-controlled run summary should point to the raw evidence location
when possible, but should remain understandable on its own.

## Feature-Loop Checklist

For a feature with journey obligations, do not consider the testing loop
complete until the change includes or intentionally updates:

- journey inventory file
- reviewed `JY-*` scenarios
- reviewed PRD-derived `TC-*` cases
- executable end-to-end tests or an explicitly reviewed deferred posture
- traceability references in the executable tests
- local execution notes or commands
- CI/raw evidence plan
- curated summary for the required gate when the slice reaches that gate

## Deferred Adoption Rule

If a pre-existing feature lacks the expected journey inventory or executable
end-to-end coverage, do not normalize that gap silently.

Record one of:

- added in this loop
- explicitly deferred with owner and follow-up date
- superseded by a newer feature path with rationale

This keeps historical gaps visible while the repo is being brought up to the
new standard.
