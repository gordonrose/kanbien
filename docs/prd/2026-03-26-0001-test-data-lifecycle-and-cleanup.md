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

- a run-scoped test data model for durable automated tests
- a manifest-based record of durable entities created by tests
- a separate cleanup command that runs after tests, not during test execution
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

### Test run ID

Every durable automated test run should have a unique `testRunId`.

Example shape:

- `tr_20260326_001`

This ID is used to:

- tag created test data where feasible
- group created records in a manifest
- drive later cleanup

### Manifest

Durable test-created records should be written to a manifest as they are
created.

The first implementation should use a manifest file rather than a database
table.

Reason:

- avoids schema changes
- keeps cleanup metadata outside domain data
- is easy to inspect during debugging

### Separate cleanup step

Cleanup must run separately from test execution.

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
3. run `npm test`
4. inspect failures, rows, and audit records if needed
5. run cleanup in dry-run mode first
6. run cleanup for the chosen `testRunId`

Example commands:

```bash
npm test
npm run test:traceability
npm run test:cleanup:dry -- --run-id tr_20260326_001
npm run test:cleanup -- --run-id tr_20260326_001
```

---

## Test Data Rules

### Creation rules

- durable test data must be created through shared helpers or factories
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

1. durable test-created records can be tied to a specific `testRunId`
2. tests that create durable data use shared helpers or factories
3. a manifest exists for each durable test run
4. cleanup can run separately from tests
5. cleanup supports dry-run mode
6. cleanup deletes only manifest-tracked records
7. cleanup refuses unsafe environments
8. PRD-derived test cases use stable `TC-*` IDs
9. the traceability checker can report coverage by PRD and test type
10. documented PRD test cases state their recommended test layer and folder

---

## Risks And Open Questions

- whether a manifest file remains sufficient if multi-process or distributed
  test execution grows significantly
- whether some migration-driven bootstrap checks should be treated differently
  from ordinary feature integration tests
- whether long-lived shared environments need retention policies for stale
  manifests in addition to cleanup commands
- how much PRD-intent-first testing should tolerate current code divergence
  before a discussion is required
