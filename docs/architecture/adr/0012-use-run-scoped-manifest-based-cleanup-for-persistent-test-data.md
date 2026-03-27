# ADR-0012: Use Run-Scoped Manifest-Based Cleanup For Persistent Test Data

- Status: Accepted
- Date: 2026-03-26
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

Some automated tests will create durable records in features such as
`rootUsers` and `rootAuth`. Those records may include security-sensitive or
audit-visible state such as sessions, login challenges, SSH keys, and auth
events.

If cleanup is handled informally or through fuzzy matching, the platform risks:

- contaminating shared environments with test data
- deleting non-test data by mistake
- losing useful failure evidence before debugging is complete

The platform needs a cleanup model that is safe, explicit, and compatible with
durable domain records.

## Decision

Adopt a hybrid durable-test lifecycle model:

- routine persistence-backed tests use a dedicated reset-first test database
  model
- optional preserve/debug durable-test runs use run-scoped manifest-based
  cleanup

Current rules:

- normal `npm run test:persistence` execution may reset relevant tables before
  each test and rely on serialized execution for deterministic isolation
- preserved durable automated test runs use a unique `testRunId`
- durable records created by preserved/debug runs must be registered in a
  manifest as they are created
- the first implementation uses a manifest file rather than a database table
- cleanup runs separately from preserved/debug test execution so engineers can
  inspect rows, logs, and audit records before deletion
- cleanup must support dry-run mode
- cleanup must prefer exact ID deletion from the manifest rather than fuzzy
  matching on email, timestamp, or other heuristics
- cleanup must refuse unsafe environments such as production
- tests that intentionally preserve durable data should use shared helpers or
  factories so manifest registration is consistent
- if persistence-backed automated tests share one dedicated test database and
  perform schema resets or migration work, serialized execution is an acceptable
  implementation strategy to avoid cross-test interference

## Consequences

### Positive

- durable test data becomes attributable to a specific run
- cleanup can be precise and auditable
- debugging remains possible before cleanup occurs
- cleanup behavior aligns better with the platform's durable-data rules
- routine persistence-backed tests keep their deterministic reset-first
  behavior without pretending they are manifest-managed

### Negative

- test helpers and factories become more complex
- manifest management adds operational overhead
- tests that bypass shared helpers become unsafe and harder to support
- the repo now has two deliberate test-data lifecycle modes that must be
  documented clearly to avoid confusion

### Neutral / Follow-up

- future ADRs may revisit manifest storage if distributed test execution grows
- retention rules for stale manifests may need a later decision
- cleanup ordering must evolve alongside new entity relationships
- if persistence-backed execution expands significantly, the platform may later
  revisit whether one shared serialized test database remains the right model
- future work may expose preserve/debug mode as a first-class command or
  harness option
