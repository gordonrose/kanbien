# ADR-0011: Adopt PRD-Driven Traceable Test Coverage

- Status: Accepted
- Date: 2026-03-26
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform is beginning to derive test cases from PRDs rather than only from
implementation details. This creates two related needs:

1. planned coverage should remain visible in documentation
2. executable tests should be traceable back to that planned coverage

Without an explicit rule, PRD test cases and executable tests will drift,
coverage discussions will become anecdotal, and test placement across unit,
integration, security, and audit layers will become inconsistent.

## Decision

Adopt PRD-driven, traceable test coverage as a platform testing rule.

Current rules:

- PRD-derived test cases live under `docs/prd/test_cases/`
- each documented test case carries a stable `TC-*` ID
- executable tests should repeat the same `TC-*` ID in the test name or a
  nearby test comment
- traceability tooling may report coverage by PRD, by test type, and by
  combined PRD plus test type
- the repo may also use status terms such as `planned`, `traceable`,
  `runtime-tested`, `persistence-tested`, and `proven` when discussing PRD
  test-case execution state
- documented PRD test cases must state their recommended test layer and
  suggested target folder under `tests/`
- unit, integration, security, audit, and edge-case coverage should remain
  intentionally separated rather than merged into one undifferentiated list
- when PRD intent and current implementation diverge, PRD intent may still be
  documented and tested deliberately so failing tests can surface the conflict
  for resolution

## Consequences

### Positive

- planned and executable coverage become easier to compare
- coverage discussions can happen in PRD language rather than only in code terms
- missing test categories become visible by feature and by test type
- test placement becomes more consistent across the repo

### Negative

- test documentation now carries maintenance overhead
- executable tests must include additional identifiers for traceability
- PRD-intent-first tests may surface implementation conflicts earlier and more
  often

### Neutral / Follow-up

- future ADRs may refine executable test folder conventions as the suite grows
- traceability and status reporting may continue evolving, but the repo now
  distinguishes at least traceable, runtime-tested, and persistence-tested
  execution states in its test-case workflow
