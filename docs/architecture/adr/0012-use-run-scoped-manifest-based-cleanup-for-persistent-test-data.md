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

Use run-scoped manifest-based cleanup for durable automated test data.

Current rules:

- each durable automated test run uses a unique `testRunId`
- durable records created by tests must be registered in a manifest as they are
  created
- the first implementation uses a manifest file rather than a database table
- cleanup runs separately from test execution so engineers can inspect rows,
  logs, and audit records before deletion
- cleanup must support dry-run mode
- cleanup must prefer exact ID deletion from the manifest rather than fuzzy
  matching on email, timestamp, or other heuristics
- cleanup must refuse unsafe environments such as production
- tests that create durable data should use shared helpers or factories so
  manifest registration is consistent
- if persistence-backed automated tests share one dedicated test database and
  perform schema resets or migration work, serialized execution is an acceptable
  implementation strategy to avoid cross-test interference

## Consequences

### Positive

- durable test data becomes attributable to a specific run
- cleanup can be precise and auditable
- debugging remains possible before cleanup occurs
- cleanup behavior aligns better with the platform's durable-data rules

### Negative

- test helpers and factories become more complex
- manifest management adds operational overhead
- tests that bypass shared helpers become unsafe and harder to support

### Neutral / Follow-up

- future ADRs may revisit manifest storage if distributed test execution grows
- retention rules for stale manifests may need a later decision
- cleanup ordering must evolve alongside new entity relationships
- if persistence-backed execution expands significantly, the platform may later
  revisit whether one shared serialized test database remains the right model
