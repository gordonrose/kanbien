---
name: prd-test-case-implementer
description: Use when the user wants Codex to read a PRD-derived test-case document under docs/prd/test_cases and implement the executable tests under tests/. Preserve TC-* traceability, implement one layer at a time unless asked otherwise, and explicitly discuss non-trivial changes to existing tests before making them. Follow the repo's broader QA model, including end-to-end, persistence-backed, concurrency/idempotency, performance, resilience, and compatibility layers when the scoped change class requires them.
---

# PRD Test Case Implementer

Use this skill when the user wants executable tests written from an existing
PRD test-case document rather than just planning coverage.

The goal is to take a file under `docs/prd/test_cases/` and implement the
corresponding tests under `tests/` in the right layers, while preserving the
repo's traceability, cleanup, and persistence-testing conventions.

## Purpose

This skill reads a PRD-derived test-case doc, maps the cases to the current
test architecture, and implements executable tests under `tests/`.

It should:

- preserve `TC-*` IDs in test names
- implement one layer at a time unless the user explicitly asks otherwise
- use existing `tests/harness/*`, `tests/helpers/*`, and persistence-backed
  utilities where possible
- respect the test-data lifecycle and cleanup framework
- distinguish additive new tests from changes to existing tests
- pause for discussion when existing tests would need non-trivial expectation
  changes, deletion, or restructuring
- avoid silently narrowing execution to only thin unit/integration coverage
  when the PRD, coverage matrix, or journey inventory requires broader proof

Its core job is execution: turning a chosen slice of the PRD-derived test plan
into honest executable tests without taking over the wider change-loop process.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. the target file under `docs/prd/test_cases/`
4. the source PRD under `docs/prd/`
5. `docs/architecture/guides/testing-and-verification-guide.md`
6. `docs/architecture/guides/qa-coverage-matrix-guide.md`
7. `docs/architecture/guides/end-to-end-journey-testing-guide.md`
8. `docs/standards/QA-RELEASE-GATE.md`
9. current implementation in `src/`
10. current executable tests in `tests/`
11. relevant source-independent docs such as `docs/api-contracts/` and
   `docs/data-dictionary/` when they materially affect the scoped behavior

If the PRD-derived test-case doc and the code differ, prefer the documented PRD
intent for new tests, but surface meaningful conflicts rather than silently
rewriting existing expectations.

## Where To Look

Primary sources:

- the target file under `docs/prd/test_cases/`
- the source PRD under `docs/prd/`
- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- `docs/architecture/guides/testing-and-verification-guide.md`
- `docs/architecture/guides/qa-coverage-matrix-guide.md`
- `docs/architecture/guides/end-to-end-journey-testing-guide.md`
- `docs/standards/change-artifact-requirements.md`
- `docs/standards/QA-RELEASE-GATE.md`
- relevant ADRs in `docs/architecture/adr/`
- feature code in `src/features/`
- shared seams in `src/lib/`
- current tests under `tests/`
- `tests/README.md`
- `docs/testing/persistence-tests.md` when persistence-backed tests are needed

Helpful repo utilities:

- `tests/harness/`
- `tests/helpers/`
- `tests/setup/`
- `src/lib/testingData/`

Helpful supporting docs when relevant:

- `docs/api-contracts/*`
- `docs/data-dictionary/*`

## Workflow

1. Read the PRD test-case document.
Identify:
- which layer the user wants now, or infer the next unfinished layer if clear
- the `TC-*` IDs for that layer
- any cases marked or implied as persistence-backed
- any cases marked or implied as end-to-end, concurrency/idempotency,
  performance, resilience, or compatibility-oriented
- any cleanup/test-helper expectations
- any standards-driven allow/deny, audit, or privileged-capability expectations
  that must remain covered

2. Inspect existing tests before editing.
Check:
- whether the target layer already has tests for these capabilities
- whether the work is additive or would change existing expectations
- whether current tests already partially cover the case under another ID
- whether an existing persistence-backed test should be extended rather than
  duplicated
- whether the change introduces or tightens authz gates such that pre-existing
  protected-feature integration, security, or audit tests now need expectation
  updates rather than simple additive coverage
- whether the planned behavior requires real contention, stress, soak, or
  conflicting-write proof rather than another single-request happy-path test
- whether a journey inventory or curated QA artifact will need refresh because
  the implemented layer changes the reviewed verification story

3. Surface existing-test impact if it is non-trivial.
Discuss before editing when:
- an existing test's expected behavior would need to change
- an existing test would need to be deleted
- a current suite appears to encode behavior that conflicts with the PRD
- implementing the new case would require meaningful test harness restructuring
- a new role/capability gate means older protected-feature tests currently stop
  at authenticated-session access and must now prove gate success or denial

Simple additive edits do not need a pause.

4. Implement the selected layer under `tests/`.
Default to one layer at a time:
- `UNIT`
- `INT`
- `SEC`
- `AUD`
- `EDGE`

But do not silently stop at those five if the documented plan or QA coverage
matrix requires broader layers such as:

- `E2E`
- `PERSISTENCE`
- `CONCURRENCY`
- `PERF`
- `RESILIENCE`
- `COMPAT`
- `A11Y`

Follow the suggested folders from the PRD test-case doc unless the repo's
current test structure gives a better-established home.

Keep this as one integrated execution skill. It may implement different layers
over time, but it should not be split into separate skills for unit,
integration, end-to-end, performance, or security execution unless the repo
later develops clearly different workflows for those layers.

5. Preserve traceability.
For every implemented case:
- keep the `TC-*` ID in the Vitest test name, or
- add it in a nearby executable test comment if one test honestly covers
  multiple documented cases

Do not invent a new ID format.

6. Use the right test substrate.
- Use in-memory or harness-backed tests for runtime behavior when honest
- Use Postgres-backed persistence tests when the claim is about storage,
  migrations, or durable audit records
- Keep persistence-backed tests behind the repo's dedicated persistence flow
  when that convention already exists
- Use real contention-oriented execution when the claim is about races,
  one-time proof consumption, conflicting writes, or other concurrency truths
- Use performance-oriented suites when the claim is about latency, burst, or
  soak behavior
- Use compatibility or contract-oriented proof when the claim is about schema,
  provider, or consumer-boundary truth

7. Verify and report.
After implementation:
- run the narrowest relevant Vitest command first
- run broader verification if the change touches shared test infrastructure
- run `npm run test:traceability` when the implemented tests add or change
  `TC-*` coverage
- run the right specialized command or suite when the implemented claim is
  persistence-backed, end-to-end, concurrency-sensitive, performance-oriented,
  or compatibility-oriented
- report what passed
- report any remaining skipped persistence-backed cases honestly
- report any remaining not-yet-proven concurrency, conflicting-write, stress,
  soak, or performance cases honestly
- if the implemented cases exercise a privileged or security-sensitive
  capability, explicitly say whether the relevant allow/deny or audit cases are
  now covered

Use `docs/standards/change-artifact-requirements.md` and the QA guides as the
canonical source for any broader artifact or verification expectations beyond
the executable test work handled by this skill.

8. Update implementation status when appropriate.
If the repo uses the PRD test-case doc as a living status artifact, update the
relevant status section after implementation so it reflects:

- the layer that is now implemented
- whether it is runtime-tested
- whether it is persistence-tested where required
- any remaining not-yet-proven cases

## Implementation Rules

### Additive First

Prefer additive test changes when possible:

- add new tests before editing old ones
- extend existing tests only when the fit is natural and honest
- avoid refactoring unrelated test structure just because you are nearby

### Existing Test Change Rule

Bring the user into the loop before proceeding if:

- an existing test's assertions would need to change materially
- the PRD-intent-based test would cause an established test to fail and the
  resolution is not obvious
- a test harness must be reshaped in a way that changes multiple existing test
  files
- authz-gate rollout means pre-existing protected-feature integration,
  security, or audit tests need expectation changes rather than purely
  additive new tests

When surfacing this, be concrete:

- which file(s) are affected
- whether this is an additive change or an expectation change
- what conflict appears to exist between current tests and the PRD
- in authz-gate changes, explicitly name the affected existing suites such as
  `tests/integration/<feature>/`, `tests/security/<feature>/`, and
  `tests/audit/<feature>/`

### Layer Placement

Follow the repo conventions from `tests/README.md`:

- `tests/unit/<area>/`
- `tests/integration/<area>/`
- `tests/security/<area>/`
- `tests/audit/<area>/`
- `tests/harness/` for shared test infrastructure

Do not place test-only harness logic under `src/` unless it is truly runtime
framework code already intended for shared script use.

### Persistence-Backed Cases

When a case requires real Postgres-backed proof:

- use the existing persistence-backed harnesses under `tests/harness/postgres/`
- keep those tests compatible with `npm run test:persistence`
- do not silently make the normal `npm test` suite depend on a live database
- if DB-backed tests share one test database, keep file-level execution
  serialized if the repo already depends on that convention

### Concurrency, Race, And Conflicting-Write Cases

When a case makes a truth claim about races or concurrent mutation:

- prefer a real contention-oriented proof over a merely sequential test
- use durable atomicity proof when the correctness claim depends on storage
- test conflicting session or workflow writes explicitly when they can change
  visible system truth
- treat replay, duplicate submission, and one-time proof consumption as
  first-class concurrency concerns rather than generic edge cases

### Performance, Stress, And Soak Cases

When a case makes a truth claim about speed or sustained usage:

- use `tests/performance/` or the repo's current performance layer
- keep thresholds conservative and honest
- distinguish latency verification from burst stress and repeated-cycle soak
- report environment sensitivity and remaining limits honestly

## Reporting Format

When reporting before edits, use:

1. `PRD Test Case Scope`
2. `Planned Layer`
3. `Existing Test Impact`
4. `Implementation Plan`

When reporting after edits, use:

1. `Implemented`
2. `Verification`
3. `PRD Test Case Status`
4. `Remaining Gaps`

Keep the summary focused on:

- which `TC-*` IDs were implemented
- whether the work was additive or required existing-test discussion
- which commands were run
- whether the PRD test-case doc status was updated

## Guardrails

- Do not silently treat a PRD test-case doc as permission to rewrite existing
  tests without discussion when the changes are non-trivial.
- Do not claim a case is fully proven if it only has traceability but has not
  been executed in the right layer yet.
- Do not forget to refresh the PRD test-case status section when the repository
  is using those files as living execution-status artifacts.
- Do not move persistence-backed guarantees into in-memory tests just to make
  the suite simpler.
- Do not drop `TC-*` IDs from test names once present.
- Do not ignore the cleanup/test-data lifecycle conventions when adding tests
  that create durable data.
- Do not implement a thinner executable test set than the current repo
  standards require for the scoped change class.
- Do not reduce race, conflicting-write, stress, soak, performance, or
  compatibility claims to thin single-request tests when the reviewed plan
  requires stronger proof.
- Do not ignore source-independent API contract or persistence-contract docs
  when they materially clarify the expected behavior under test.

## Trigger Phrases

Trigger this skill for prompts like:

- "implement these PRD test cases"
- "turn this PRD test-case file into tests"
- "add the executable tests for this PRD"
- "implement the unit layer from docs/prd/test_cases"
- "read the PRD test-case doc and add tests under /tests"
- "use the prd-test-case-implementer skill"
