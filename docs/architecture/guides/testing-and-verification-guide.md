# Testing And Verification Guide

## Purpose

Explain how the repo turns PRD intent into executable proof without silent
coverage drift.

## Source Of Truth

The current testing model uses:

- PRDs for scope and requirements
- PRD-derived test-case docs for explicit planned coverage
- end-to-end journey scenario inventory for multi-step customer and operator workflows
- executable tests for proof
- traceability checks to ensure documented `TC-*` IDs stay mapped
- lifecycle review to prevent silent test-intent drift

## Test Layers

Features should use the layers appropriate to their risk and shape:

- unit
- integration
- end-to-end journey
- security
- audit
- edge
- frontend
- persistence-backed verification when durable storage behavior matters
- performance when latency, throughput, or scaling behavior matters
- resilience/failure-injection when degraded dependencies or retries matter
- concurrency/idempotency when race, replay, or duplicate-submission risk matters
- compatibility/contract when external or consumer-facing contracts can drift
- accessibility when frontend surfaces are implemented or materially changed

Concrete verification classes that planners and implementers should actively
consider when the workflow shape suggests them include:

- race-condition proof
- conflicting session or workflow writes
- duplicate-submission and replay safety
- stress or burst behavior verification
- soak or repeated-cycle verification
- conservative latency or throughput verification
- degraded dependency, retry, and fallback behavior
- compatibility or contract drift checks

See also:

- [End-To-End Journey Testing Guide](./end-to-end-journey-testing-guide.md)
- [End-To-End Journey Operations Guide](./end-to-end-journey-operations-guide.md)
- [QA Coverage Matrix Guide](./qa-coverage-matrix-guide.md)

## Persistence Modes

The current persistence-backed test model is:

- normal mode: reset-first for deterministic isolation
- preserve/debug mode: optional delayed cleanup and forensic inspection

When the dedicated Postgres test database is configured locally, `npm test`
now runs in two deliberate phases:

- the fast in-memory/app-level Vitest suite
- a second serialized Vitest run for persistence-backed proofs

Seeing two Vitest runs in that situation is expected and should not be treated
as accidental duplicate execution.

Manifest cleanup applies only to preserved durable workflows that actually
register run-scoped data.

## Anti-Drift Expectations

- PRD-derived test-case docs are the primary planned coverage record.
- Required test layers should be selected from the repo QA coverage matrix, not
  from ad hoc preference.
- PRD-derived test-case planning should explicitly consider the concrete test
  classes above rather than collapsing them into generic "edge" or thin
  integration coverage.
- End-to-end journey scenarios are required when behavior depends on multi-step
  state transitions, tenant or role variation, remediation or recovery paths,
  or other cross-capability workflows.
- Journey inventories live under `docs/prd/journey_inventories/`.
- Executable end-to-end journey tests live under `tests/e2e/`.
- Executable tests should carry stable `TC-*` references.
- Executable end-to-end tests should also carry stable `JY-*` references when
  they implement reviewed journey scenarios.
- Only active/current test intent should run in the normal loop.
- Superseded or archived test intent must be proposed and reviewed explicitly.
- Persistence-backed tests should seed their required fixtures explicitly
  rather than assuming prior bootstrap state is sufficient.
- Reusable seeded scenario builders are preferred over repeated ad hoc end-to-
  end setup when journey permutations matter.
- Features should define end-to-end journey coverage before implementation for
  meaningful customer or operator workflows.
- Journey inventories should classify behavior-changing dimensions explicitly
  and use equivalence classes plus pairwise-first coverage selection rather than
  naive full permutation expansion.
- Journey inventories should err on the side of including lifecycle,
  deletion/disablement, revocation, and credible operator-induced state changes
  unless they are explicitly deferred with rationale.
- Flaky tests in any blocking suite are blocking defects unless exceptionally
  approved and durably recorded.
- Vertical-slice execution is preferred for local and PR feedback, while broader
  suites should run at higher validation gates.
- Curated durable summaries for important runs should live under
  `docs/workspace/test-run-summaries/`, while CI keeps the raw machine evidence.
- High-risk feature classes should also record a structured exploratory QA note
  when deterministic automation alone is not sufficient.
- External integration seams should require contract or compatibility coverage,
  not only stubbed workflow tests.
- Reusable QA operating artifacts such as checklists, exploratory notes,
  escaped-defect reviews, and waiver/quarantine records should live under
  `docs/workspace/qa/`.
- When a feature adds persistence-owned tables or migration dependencies,
  refresh the shared migration harness, reset helpers, and persistence run
  scripts in the same loop.
- Tests for paginated catalogs or lists should avoid accidental assumptions
  about first-page contents unless that ordering is part of the documented
  contract.

## Recoverability Rule

To rebuild tests from specs, the repo should describe:

- required test layers by capability type
- harness expectations
- persistence-test rules
- traceability rules
- lifecycle status rules
- end-to-end journey tiering and execution rules
- standards and repo-health review expectations for material changes
