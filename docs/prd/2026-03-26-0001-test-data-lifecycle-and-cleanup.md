# Test Data Lifecycle And Cleanup Framework

## Purpose

Introduce a safe and explicit framework for automated tests that create durable
data so teams can:

1. run tests without contaminating real data
2. inspect database state and audit records after failures
3. clean up test-created data later through a separate command
4. trace planned PRD coverage to executable tests

This work is intended to support trustworthy automated testing for features
with durable persistence, especially security-sensitive features such as
`rootAuth` and `rootUsers`.

---

## Scope

This phase includes:

- a clear split between normal reset-first persistence-backed tests and optional
  preserve/debug durable-test runs
- a run-scoped test data model for preserved durable automated tests
- a manifest-based record of durable entities created by preserved durable test
  runs
- a separate cleanup command that runs after preserved/debug tests, not during
  test execution
- dry-run cleanup support
- safety rules that prevent cleanup in unsafe environments
- test data conventions that make created records easy to identify during
  debugging
- traceability between PRD test cases and executable tests through stable
  `TC-*` IDs
- shared guidance for where unit, integration, security, audit, and edge-case
  tests should live under `tests/`

This phase does **not** include:

- automatic cleanup at the end of every test run
- production cleanup of data mixed with live business data
- a broad generic data-retention platform for all environments
- complete executable coverage for every existing PRD on day one
- replacement of PRDs or ADRs with test tooling alone

---

## Problem Statement

The platform is moving toward PRD-driven, traceable automated testing.
Some of those tests will create durable data such as:

- `root_users`
- `auth_principals`
- `auth_ssh_public_keys`
- `auth_login_challenges`
- `auth_sessions`
- `auth_audit_events`

If tests create durable records without a disciplined lifecycle, the system
risks:

- contamination of shared environments with test data
- ambiguous cleanup that may delete non-test data
- inability to inspect failure state before cleanup
- weak traceability between planned coverage and executable tests
- inconsistent placement of tests across unit, integration, and security layers

The platform needs a deliberate approach rather than ad hoc helper code.

---

## Design Goals

- make durable test data attributable to a specific test run
- allow post-failure inspection before cleanup happens
- make cleanup explicit, safe, and reversible in planning through dry-run mode
- avoid deleting non-test data through fuzzy matching
- support PRD-first test planning where PRD intent can be tested even when
  current code diverges
- keep test placement predictable by layer and feature

---

## Core Concepts

### Normal persistence mode

The default persistence-backed test mode is reset-first.

Current behavior:

- tests share one dedicated Postgres test database
- the persistence harness resets relevant tables before each test
- the suite runs serialized to avoid cross-test interference
- routine runs optimize for determinism and isolation rather than preserving
  failure state after the next test starts

This is the normal mode for `npm run test:persistence`.

### Preserve/debug mode

Some durable test workflows need post-failure inspection before cleanup.

Those workflows use an optional preserve/debug mode:

- the test run receives a unique `testRunId`
- helpers register created durable records in a manifest
- rows are intentionally preserved until an operator runs cleanup later
- cleanup remains separate from test execution

This mode is for debugging and targeted durable-test workflows, not the default
execution path for the whole persistence suite.

### Test run ID

Every preserved durable automated test run should have a unique `testRunId`.

Example shape:

- `tr_20260326_001`

This ID is used to:

- tag created test data where feasible
- group created records in a manifest
- drive later cleanup

### Manifest

Durable test-created records should be written to a manifest as they are
created when a test or helper is operating in preserve/debug mode.

The first implementation should use a manifest file rather than a database
table.

Reason:

- avoids schema changes
- keeps cleanup metadata outside domain data
- is easy to inspect during debugging

### Separate cleanup step

Cleanup must run separately from test execution for preserved/debug runs.

Reason:

- failures may require inspection of rows, sessions, challenges, and audit
  events
- logs and database state should still be available during troubleshooting

### Traceable PRD coverage

Documented PRD test cases should carry stable `TC-*` IDs.

Executable tests should repeat the same IDs in test names or nearby comments so
traceability tooling can report coverage.

---

## Proposed User Workflow

1. derive test cases from a PRD and assign `TC-*` IDs
2. implement executable tests by layer under `tests/`
3. choose the intended persistence mode:
   - normal reset-first mode for routine persistence-backed tests
   - preserve/debug mode when post-failure inspection is required
4. run the chosen test command
5. if preserve/debug mode was used, inspect failures, rows, and audit records
   as needed
6. if preserve/debug mode was used, run cleanup in dry-run mode first
7. if preserve/debug mode was used, run cleanup for the chosen `testRunId`

Example commands:

```bash
npm test
npm run test:traceability
npm run test:cleanup:dry -- --run-id tr_20260326_001
npm run test:cleanup -- --run-id tr_20260326_001
```

---

## Test Data Rules

### Normal-mode rules

- routine persistence-backed tests may rely on the dedicated reset-first test
  database model
- those tests do not need manifest registration if the intended lifecycle is
  full harness-driven reset
- their cleanup model is test-database reset, not later `testRunId` cleanup

### Preserve/debug creation rules

- durable preserved test data must be created through shared helpers or
  factories
- helpers must know the active `testRunId`
- helpers must register every created durable record in the manifest
- tests must not rely on manually seeded human-like shared records by default

### Identifiability rules

Where a human-readable field exists, test data should embed the `testRunId`.

Examples:

- test emails using a reserved test domain
- SSH key labels including the run ID
- display names or notes including the run ID where appropriate

This is for debugging convenience, not as the primary cleanup mechanism.

### Cleanup rules

- cleanup applies to preserve/debug runs, not to routine reset-first
  persistence runs
- cleanup must prefer exact ID deletion from the manifest
- cleanup must delete in dependency-safe order
- cleanup must support dry-run mode
- cleanup must refuse to run in unsafe environments
- cleanup must report what it deleted and what it skipped

### Safety rules

- cleanup must not rely only on fuzzy matching such as email prefix or timestamp
- cleanup must not run against production
- missing manifest data should fail closed rather than guessing

---

## Recommended Cleanup Order

For current `rootUsers` and `rootAuth` entities, cleanup should delete in this
order:

1. `auth_audit_events`
2. `auth_sessions`
3. `auth_login_challenges`
4. `auth_ssh_public_keys`
5. `auth_principal_root_user_links`
6. `auth_principals`
7. `root_users`

This order should be re-evaluated if new FK relationships are introduced.

---

## Test Layer Placement

Documented PRD test cases should state both:

- recommended test layer
- suggested target folder

Initial guidance:

- unit capability tests:
  - layer: `service-unit`
  - folder: `tests/unit/<featureName>/`
- feature integration tests:
  - layer: `feature-integration`
  - folder: `tests/integration/<featureName>/`
- security-focused NFR tests:
  - layer: `security-integration` by default
  - folder: `tests/security/<featureName>/`
- audit or logging tests:
  - layer: `audit-integration`
  - folder: `tests/audit/<featureName>/`

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the repo documents two explicit durable-test modes:
   - normal reset-first persistence-backed testing
   - optional preserve/debug testing with manifest cleanup
2. routine persistence-backed tests can continue using the dedicated
   reset-first test database model
3. preserved durable test-created records can be tied to a specific
   `testRunId`
4. preserve/debug tests that create durable data use shared helpers or
   factories
5. a manifest exists for each preserved durable test run
6. cleanup can run separately from preserved/debug tests
7. cleanup supports dry-run mode
8. cleanup deletes only manifest-tracked records
9. cleanup refuses unsafe environments
10. PRD-derived test cases use stable `TC-*` IDs
11. the traceability checker can report coverage by PRD and test type
12. documented PRD test cases state their recommended test layer and folder

---

## Risks And Open Questions

- whether a manifest file remains sufficient if preserve/debug execution grows
  beyond local serialized workflows
- whether some migration-driven bootstrap checks should be treated differently
  from ordinary feature integration tests
- whether long-lived shared environments need retention policies for stale
  manifests in addition to cleanup commands
- how much PRD-intent-first testing should tolerate current code divergence
  before a discussion is required
- whether preserve/debug mode should be exposed as a dedicated command,
  environment toggle, or harness-level option first
