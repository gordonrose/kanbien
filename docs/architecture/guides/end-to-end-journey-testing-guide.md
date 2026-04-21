# End-To-End Journey Testing Guide

## Purpose

Define the repo-wide policy for end-to-end journey testing so customer-facing
flows are validated as real multi-step workflows rather than only as isolated
capabilities.

This guide exists to reduce surprise in production.

Operational placement, naming, and evidence rules live in:

- [End-To-End Journey Operations Guide](./end-to-end-journey-operations-guide.md)

The intended bar is:

- if a feature ships, the important user journeys should already have been
  exercised in deterministic tests
- workflow regressions, state-transition bugs, tenant/role variation mistakes,
  and common known pitfalls should be caught before release

## Core Principles

- every feature has end-to-end testing expectations
- end-to-end tests are for user journeys, not just route reachability
- authentication alone is not enough; workflow state, authorization,
  persistence, and cross-step behavior must be proven together
- legacy data and post-change data must both be exercised when behavior can
  differ between them
- tenant variation and role variation must be exercised when behavior can
  differ by tenant policy or actor boundary
- flaky end-to-end tests are defects in the test platform and block feature-loop
  completion until resolved or exceptionally approved

## What Counts As End-To-End In This Repo

An end-to-end journey test is a deterministic test that:

- drives the application through real HTTP boundaries
- uses real server wiring
- uses real persistence where the workflow depends on durable state
- covers multiple meaningful workflow steps or state transitions
- asserts user-visible or operator-visible workflow outcomes

Examples:

- first-time tenant-auth onboarding
- repeat login with unchanged policy
- login after tenant-policy change triggers remediation
- login after gaining access to a second tenant
- login plus tenant selection plus remediation
- authorization-sensitive root operator journey

End-to-end tests are not:

- unit tests for one function
- single-route happy-path checks that never exercise persisted workflow state
- duplicated lower-level tests with no journey/state-transition value

## Required Test Layers

The repo now recognizes these verification layers:

- unit
- integration
- end-to-end journey
- security
- audit
- edge
- frontend when a frontend surface exists

End-to-end journey coverage does not replace lower layers.
It complements them.

The full required layer set for a change should be chosen using:

- [QA Coverage Matrix Guide](./qa-coverage-matrix-guide.md)

## Journey Taxonomy

Features should classify journey scenarios at least across these dimensions when
relevant:

- first-time user
- repeat user
- legacy/pre-change state
- post-change/newly-created state
- one-tenant actor
- multi-tenant actor
- default-policy tenant
- tenant-override tenant
- role variation
- success path
- denial/failure path
- remediation/recovery path
- lifecycle edge path such as deleted, disabled, inactive, expired, revoked

Teams should not brute-force every permutation blindly.
They should identify the meaningful combinations that can change behavior and
cover those combinations intentionally.

## Tiering Model

Journey tests should be classified into three tiers:

- `Tier 0`
  Release-blocking critical platform journeys.
  Examples: authentication, authorization, tenant isolation, compliance,
  retention/deletion, billing-critical flows, irreversible operations.
- `Tier 1`
  Important customer workflows that materially affect successful product use.
- `Tier 2`
  Supporting workflows, secondary paths, and lower-risk experience flows.

Tiering must be declared in the planning artifacts, not assumed ad hoc.

## Coverage Policy

For every feature, the change artifacts must define:

- affected user journeys
- end-to-end journey scenarios
- journey tier
- required permutations
- relevant tenant and role variation
- legacy-data and post-change-data expectations when applicable

Minimum expectation:

- at least one happy path
- at least one meaningful failure or deny path
- meaningful edge and state-transition coverage where behavior can vary

For standards-sensitive or risk-sensitive features, include:

- deny-path coverage
- audit expectation coverage
- remediation/recovery coverage where applicable
- researched common production pitfalls for that feature domain

## Known-Pitfall Research Rule

For every feature, perform a focused sweep of common production issues relevant
to that feature domain and add missing journey coverage where those pitfalls are
credible for this repo.

Examples:

- auth lockout and stale-session edge cases
- tenant-switching inconsistencies
- policy-change legacy-data regressions
- duplicate-submission or retry hazards
- deleted/inactive actor leakage
- permission drift across role or tenant variation

This sweep should be recorded in the feature loop.

## Environment Model

Default environment posture:

- real application wiring
- real database
- real auth and session flows
- fake or stubbed external providers by default

Examples of providers normally stubbed in repository-level end-to-end tests:

- email providers
- SMS providers
- payment gateways
- SSO providers

Higher environments may later exercise customer-like journeys against approved
real providers as part of onboarding or staging, but repository-level
end-to-end tests should remain deterministic and low-leakage by default.

## Vertical-Slice Execution Model

The repo should favor vertical slicing during routine development feedback.

Preferred execution posture:

- PR or local affected-change run:
  - unit tests only for touched or directly affected code
  - integration tests only for touched or directly downstream code
  - end-to-end smoke only for features or journeys affected by the change
- broader validation runs:
  - scheduled or branch-level wider suites as needed
- production gate:
  - full unit suite
  - full integration suite
  - full `Tier 0` and `Tier 1` end-to-end suite by default
  - `Tier 2` may run on scheduled cadence or broader validation cadence unless
    the change specifically affects those journeys

If expediency ever forces production release without the default full run, that
must be explicit, exceptional, and approved by the responsible engineer for the
release or feature-loop stage.

## Deterministic Local Execution Rule

End-to-end journey tests must be runnable locally.

The repo should support:

- one-command deterministic local execution for the affected vertical slice
- one-command full local end-to-end run where feasible

Local execution must not depend on hidden manual steps.

## Scenario Builders And Fixtures

Prefer reusable seeded scenario builders over ad hoc handcrafted setup in each
test.

Examples:

- first-time tenant principal with one tenant
- repeat tenant principal with compliant password
- repeat tenant principal requiring password remediation
- tenant principal with two accessible tenants
- tenant principal with second tenant and stricter policy
- actor or tenant in disabled/deleted/inactive state

Benefits:

- lower setup drift
- cheaper permutation coverage
- clearer tests
- easier recreation of legacy versus new data states

## Flakiness Policy

- flaky end-to-end tests block feature-loop completion
- flaky end-to-end tests block their required gate until fixed or exceptionally
  approved
- flaky behavior should be treated as a defect in the test platform or the
  product, not as acceptable noise

Repo-wide blocking-suite flakiness rules are governed additionally by:

- [QA Release Gate](../../standards/QA-RELEASE-GATE.md)

Exceptional quarantine or bypass is allowed only in rare cases and only with
approval from the responsible engineer empowered for the current feature-loop or
deployment stage.

Such exceptions must be recorded durably with:

- reason
- owner
- affected journey tier
- mitigation
- expiration or review date

## Artifact And Traceability Rules

End-to-end journey coverage must be represented in the build-from-spec chain.

Required artifacts for affected features:

- capability matrix
- PRD
- PRD-derived test-case doc
- end-to-end journey scenario inventory
- executable tests
- traceability mapping

Traceability should link:

- capability matrix rows
- journey scenarios
- `TC-*` records where applicable
- executable tests

Feature loops must not silently change journey behavior without updating the
corresponding journey artifacts.

## Feature-Loop Integration

For every feature loop:

1. identify affected journeys
2. classify tier and risk
3. define required journey permutations
4. define known-pitfall research scope
5. define end-to-end scenario inventory before implementation
6. implement or refresh executable end-to-end coverage
7. run affected vertical-slice end-to-end coverage during development
8. run required broader suites at the appropriate gate
9. update traceability and audit artifacts before considering the loop complete

If the journey matrix changes but the end-to-end scenarios do not, the loop is
incomplete.

## Reporting And Audit Evidence

The repo should preserve both:

- CI-generated raw test evidence
- source-controlled curated test summaries

Recommended split:

- CI artifacts:
  - raw run evidence
  - detailed reports
  - environment/build metadata
  - machine-readable outputs
- source-controlled summaries:
  - critical journey posture
  - release or deployment validation summaries
  - exception and quarantine history
  - periodic verification-status snapshots where relevant

The reporting model should support:

- engineer-level diagnostic detail
- executive and audit-readable summary views

## Recoverability Rule

To rebuild end-to-end coverage from specs, the repo should describe:

- which journeys exist
- why they matter
- which permutations are mandatory
- which tiers they belong to
- what fixtures or scenario builders they need
- how they are executed locally and in CI
- which gates they block

## Completion Rule

A feature should not be considered complete when:

- the journey inventory changed but end-to-end scenarios were not updated
- required journey tiers were not executed at their required gates
- flakiness remains unresolved without approved exception
- traceability between feature behavior and end-to-end coverage is missing
