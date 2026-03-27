# Test Data Lifecycle And Cleanup Framework Test Cases

## PRD Scope

- PRD: [`docs/prd/2026-03-26-0001-test-data-lifecycle-and-cleanup.md`](/home/gordon/kanbien/docs/prd/2026-03-26-0001-test-data-lifecycle-and-cleanup.md)
- Primary features involved:
  - test harness and helpers under `tests/`
  - traceability tooling
  - future cleanup tooling
  - PRD test-case documentation under `docs/prd/test_cases/`
- Cross-feature seams:
  - durable test-created records may span `rootUsers` and `rootAuth`
  - traceability ties PRD docs to executable tests
  - cleanup must interact safely with durable security and audit entities
- Notes:
  - this file plans test coverage for the testing-data framework itself
  - cleanup remains a separate operational step after preserve/debug tests, not part of test execution
  - routine persistence-backed tests may still use reset-first database cleanup instead of manifests

## Unit Tests For Individual Capabilities

- Capability: generate unique `testRunId`
  Test Case ID: `TC-TEST-DATA-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/testData/`
  Coverage:
  - generates expected `tr_*` format
  - generates unique IDs across calls
  - remains deterministic enough for later manifest linkage
  Notes:
  - this is a core primitive for all later cleanup and traceability work

- Capability: manifest writer records durable entities
  Test Case ID: `TC-TEST-DATA-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/testData/`
  Coverage:
  - creates a new manifest file for a run when absent
  - appends exact entity and ID entries
  - preserves earlier entries when writing multiple records
  - produces stable JSON shape
  Notes:
  - manifest fidelity is more important than convenience formatting

- Capability: manifest reader loads run-scoped records
  Test Case ID: `TC-TEST-DATA-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/testData/`
  Coverage:
  - reads valid manifest successfully
  - rejects malformed JSON
  - rejects incomplete or invalid record entries
  Notes:
  - should fail closed rather than guessing

- Capability: cleanup planner produces dependency-safe delete order
  Test Case ID: `TC-TEST-DATA-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/testData/`
  Coverage:
  - orders `auth_audit_events` before `auth_sessions`
  - orders parent entities after child entities
  - de-duplicates repeated entity and ID entries safely
  Notes:
  - current repo order should reflect `rootAuth` and `rootUsers` relationships

- Capability: PRD test-case ID parser classifies test metadata
  Test Case ID: `TC-TEST-DATA-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/traceability/`
  Coverage:
  - parses valid `TC-*` IDs
  - classifies `UNIT`, `INT`, `SEC`, `AUD`, and `EDGE`
  - handles malformed IDs as unknown without crashing
  Notes:
  - grouped coverage reporting depends on correct parsing

- Capability: grouped traceability summary generation
  Test Case ID: `TC-TEST-DATA-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/traceability/`
  Coverage:
  - reports coverage by PRD
  - reports coverage by test type
  - reports combined coverage by `PRD / test type`
  Notes:
  - keep reporting deterministic for automation and review

## Integration Tests For Features Working Together

- Flow: routine persistence-backed tests use reset-first cleanup instead of
  manifest cleanup
  Test Case ID: `TC-TEST-DATA-INT-000`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/testData/`
  Features:
  - Postgres persistence harness
  - reset-first test database lifecycle
  Coverage:
  - the persistence-backed harness resets relevant tables before each test
  - routine `npm run test:persistence` behavior does not require a manifest
  - docs and runtime behavior agree on this default lifecycle
  Notes:
  - this is the key regression guard for the clarified hybrid model

- Flow: test helpers create durable records and manifest captures exact IDs
  Test Case ID: `TC-TEST-DATA-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/testData/`
  Features:
  - test helpers
  - manifest recording
  - durable feature records
  Coverage:
  - helper-created records for `rootUsers` and `rootAuth` are registered immediately when preserve/debug mode is used
  - manifest contains exact IDs needed for later cleanup
  Notes:
  - this proves the framework can support preserved durable feature tests

- Flow: cleanup dry-run reports without deleting
  Test Case ID: `TC-TEST-DATA-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/testData/`
  Features:
  - cleanup command
  - manifest reader
  Coverage:
  - dry-run prints intended deletions
  - no durable records are removed
  - manifest remains available for inspection
  Notes:
  - dry-run is part of the required operator workflow

- Flow: cleanup deletes manifest-tracked durable records only
  Test Case ID: `TC-TEST-DATA-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/testData/`
  Features:
  - cleanup command
  - `rootAuth` and `rootUsers` durable entities
  Coverage:
  - deletes tracked audit events, sessions, challenges, keys, links, principals, and root users
  - leaves unrelated records untouched
  Notes:
  - exact-ID deletion is the core safety guarantee

- Flow: PRD test-case docs and traceability checker work together
  Test Case ID: `TC-TEST-DATA-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/traceability/`
  Features:
  - PRD test-case docs
  - traceability checker
  Coverage:
  - documented IDs are detected
  - uncovered IDs fail the checker
  - grouped summaries remain correct
  Notes:
  - ensures documentation and executable tests stay linked

## NFR Security Tests

- Scenario: cleanup refuses to run in unsafe environments
  Test Case ID: `TC-TEST-DATA-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/testData/`
  Coverage:
  - production-like environment is rejected
  - missing environment guard fails closed
  Notes:
  - this is a hard safety requirement, not a convenience feature

- Scenario: cleanup refuses fuzzy deletion without manifest-backed IDs
  Test Case ID: `TC-TEST-DATA-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/testData/`
  Coverage:
  - absent manifest does not trigger guessed deletes
  - partial manifest does not trigger heuristic deletes
  Notes:
  - protects non-test data from accidental deletion

- Scenario: cleanup requires explicit `testRunId`
  Test Case ID: `TC-TEST-DATA-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/testData/`
  Coverage:
  - missing `--run-id` is rejected
  - invalid run ID format is rejected safely
  Notes:
  - cleanup should never “guess the latest run”

- Scenario: traceability checker does not silently accept malformed IDs
  Test Case ID: `TC-TEST-DATA-SEC-004`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/traceability/`
  Coverage:
  - malformed IDs are surfaced
  - missing documented IDs fail the checker
  Notes:
  - traceability enforcement is part of quality control

## NFR Logging Or Audit Tests

- Scenario: cleanup command reports deleted and skipped records clearly
  Test Case ID: `TC-TEST-DATA-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/testData/`
  Coverage:
  - output includes deleted counts by entity
  - output includes skipped or missing records
  - dry-run output is distinct from real deletion output
  Notes:
  - reporting should support troubleshooting and operator confidence

- Scenario: traceability checker reports grouped coverage clearly
  Test Case ID: `TC-TEST-DATA-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/traceability/`
  Coverage:
  - output includes totals
  - output includes by-PRD summary
  - output includes by-test-type summary
  - output includes combined `PRD / type` summary
  Notes:
  - traceability reporting is the audit surface for planned vs implemented coverage

## Edge Cases And Negative Tests

- Scenario: malformed manifest file
  Test Case ID: `TC-TEST-DATA-EDGE-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/testData/`
  Coverage:
  - malformed JSON is rejected
  - incomplete manifest entries are rejected
  Notes:
  - cleanup should fail closed

- Scenario: duplicate entity and ID entries in manifest
  Test Case ID: `TC-TEST-DATA-EDGE-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/testData/`
  Coverage:
  - duplicate entries do not produce repeated unsafe deletes
  Notes:
  - idempotent cleanup planning matters

- Scenario: manifest contains already-deleted records
  Test Case ID: `TC-TEST-DATA-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/testData/`
  Coverage:
  - cleanup reports skipped or missing rows deterministically
  - cleanup continues safely where appropriate
  Notes:
  - separate troubleshooting and cleanup workflows make this realistic

- Scenario: multiple PRDs contribute test IDs
  Test Case ID: `TC-TEST-DATA-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/traceability/`
  Coverage:
  - grouped reporting remains correct across more than one PRD test-case file
  Notes:
  - future growth case for traceability tooling

- Scenario: helper-generated human-readable values include the `testRunId`
  Test Case ID: `TC-TEST-DATA-EDGE-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/testData/`
  Coverage:
  - emails, labels, or other helper-generated values embed the run ID consistently
  Notes:
  - improves debugging but is not the primary cleanup mechanism

- Scenario: preserve/debug cleanup expectations are not applied to routine
  reset-first persistence tests
  Test Case ID: `TC-TEST-DATA-EDGE-006`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/testData/`
  Coverage:
  - routine persistence-backed tests are documented and treated as reset-first
  - preserve/debug manifest expectations remain limited to preserved durable
    test runs
  Notes:
  - prevents docs and PRD assumptions from drifting ahead of implementation

## Coverage Gaps Or Open Questions

- Item:
  The PRD chooses a manifest file as the first implementation. If the suite
  later runs in parallel across processes or machines, test cases may need to
  expand to cover manifest coordination and merge behavior.

- Item:
  The cleanup workflow assumes tests that create durable records use shared
  helpers or factories. If some tests bypass those helpers, separate guardrails
  or enforcement may be needed.

- Item:
  This document covers the framework itself. Feature-specific PRDs will still
  need their own executable test rollout plans layered on top of it.
