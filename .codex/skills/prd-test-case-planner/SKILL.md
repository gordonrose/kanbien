---
name: prd-test-case-planner
description: Use when the user wants Codex to read a PRD and derive test cases under docs/prd/test_cases, especially unit tests for individual capabilities and integration tests for features working together. Include NFR coverage for security and logging, plus important edge cases, and explicitly surface when existing executable tests would likely need discussion before being changed.
---

# PRD Test Case Planner

Use this skill when the user wants test cases derived from a PRD rather than
from an existing test file.

The output lives under `docs/prd/test_cases/`.

Every test case entry should carry a stable test-case ID so the documented
cases can be traced to executable tests later.

## Purpose

This skill reads a PRD, maps the requested behavior to the current repo
architecture, and produces test case documentation that covers:

- unit tests for individual capabilities
- integration tests for features that work together
- non-functional scenarios around security
- non-functional scenarios around logging or audit visibility
- important edge cases and negative cases

Each documented case should also say which test layer it belongs to and where
the executable test would likely live under `tests/`.

If the PRD suggests that existing executable tests would need expectation
changes, removal, or meaningful restructuring, do not silently assume those
changes are fine. Call that out explicitly and bring it up for discussion with
the user.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. the PRD the user named
4. current source in `src/`
5. existing files in `docs/prd/test_cases/`
6. relevant source-independent docs such as `docs/api-contracts/` and
   `docs/data-dictionary/` when they materially affect the scoped behavior

If the PRD and code differ, do not silently force one to match the other.
Report the mismatch.

## Where To Look

Primary sources:

- the target PRD under `docs/prd/`
- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- `docs/standards/change-artifact-requirements.md`
- relevant ADRs in `docs/architecture/adr/`
- feature routers, services, persistence seams, and contract errors in `src/`

Helpful secondary sources:

- `docs/featureDocs/*`
- `docs/api-contracts/*`
- `docs/data-dictionary/*`
- `docs/swagger/openapi.yaml`
- `docs/postman/*`
- existing tests, if present
- PRDs or ADRs that define shared testing-data lifecycle, traceability, or
  cleanup rules

## Output Location

Create or update test case files under `docs/prd/test_cases/`.

Suggested file naming:

- if the PRD is `docs/prd/2026-03-25-0001-root-auth.md`
- then the test case file should be
  `docs/prd/test_cases/2026-03-25-0001-root-auth-test-cases.md`

Use the template in `references/test-case-template.md`.

## ID Convention

Every documented test case must include a stable ID in backticks.

Use this format:

- `TC-<PRDKEY>-<SECTION>-NNN`

Where:

- `<PRDKEY>` is a short uppercase key derived from the PRD slug
- `<SECTION>` is one of:
  - `UNIT`
  - `INT`
  - `SEC`
  - `AUD`
  - `EDGE`
- `NNN` is a zero-padded sequence such as `001`, `002`, `003`

Example IDs:

- `TC-ROOT-AUTH-UNIT-001`
- `TC-ROOT-AUTH-INT-003`
- `TC-ROOT-AUTH-SEC-002`

When executable tests exist or are later written, include the same ID in the
test name or a nearby test comment.

Traceability means the documented case and the executable test share the same
ID. For example:

- documented case: `TC-ROOT-AUTH-UNIT-001`
- executable Vitest name: `it("TC-ROOT-AUTH-UNIT-001 creates auth principal", ...)`

This lets the checker report whether each planned case is represented in the
test suite.

## Workflow

1. Read the PRD and identify:
- capabilities
- API surfaces
- feature boundaries
- cross-feature interactions
- whether the change class carries explicit standards expectations for
  auth/authz, audit, or verification coverage
- required validations
- explicitly mentioned failure modes
- stated or implied security and logging expectations

2. Map PRD behavior to the current codebase.
Check:
- which feature owns each capability
- which capabilities are unit-testable in isolation
- which flows require multiple features or shared platform seams
- where logging, audit events, auth, rate limiting, or middleware matter
- whether the tests will create durable data and therefore need run-scoped
  helpers, manifest registration, and separate cleanup planning
- whether the PRD introduces or changes authentication, authorization, or other
  protected-route gates that mean pre-existing integration, security, or audit
  tests for already-protected features must be updated rather than left at the
  older boundary assumption

3. Build the test inventory in these sections:
- unit tests
- integration tests
- NFR security tests
- NFR logging or audit tests
- edge cases and negative tests

Assign an ID to every test case while building the inventory.
Assign a recommended test layer and target test folder to every case while
building the inventory.
If a case will create durable data, also note:

- whether shared test helpers or factories are required
- whether manifest registration is required
- whether post-test cleanup expectations should be called out

4. Compare to any existing file under `docs/prd/test_cases/` for the same PRD.
Summarize:
- new test cases
- removed test cases
- changed assumptions
- coverage gaps that still remain
- existing executable tests that would likely need to change if the PRD is
  implemented as written
- whether those likely test changes are additive, expectation-changing, or
  structure-changing

5. Surface existing-test impact before editing.
If the PRD-derived plan suggests changing existing executable tests, say so
explicitly before making doc updates. Keep it short but concrete:

- which current test areas would likely change
- whether this looks additive or expectation-changing
- whether the current tests appear to encode behavior that may conflict with
  the PRD

When a PRD adds role/capability gates or materially changes protected-route
access rules, explicitly call out affected pre-existing protected-feature test
areas, especially:

- integration tests that currently prove only authenticated-session access
- security tests that currently lack explicit deny coverage for missing
  capability grants
- audit tests that may need to prove gated denials or newly gated privileged
  mutations remain visible

6. Ask before updating the file if it already exists.
If no file exists yet, propose the initial file and then create it after user
approval.

## Test Case Rules

### Unit Tests

Focus on individual capabilities, usually from:

- `domain/service.ts`
- feature capability files under `domain/`
- validation and error behavior from `contract/schemas.ts` and
  `contract/errors.ts`

Unit cases should cover:

- happy path
- validation failure
- domain rule failure
- persistence edge case when relevant

Recommended layer label:

- `service-unit`

Recommended target folders:

- `tests/unit/<featureName>/`
- `tests/features/<featureName>/unit/`

When a unit test still creates durable data through repositories or helpers,
call out the required test-data lifecycle explicitly.

### Integration Tests

Use when the behavior crosses:

- two features
- shared middleware and a feature
- router to service to persistence seam
- auth/session setup plus protected capability

Examples:

- `rootAuth` establishing a session that unlocks `rootUsers`
- `rootUsers` lifecycle state blocking `rootAuth` sign-in
- shared rate limiting affecting feature routes

Recommended layer label:

- `feature-integration`

Recommended target folders:

- `tests/integration/`
- `tests/features/<featureName>/integration/`

If integration cases create durable records, document:

- required helper or factory usage
- expected manifest tracking
- whether later cleanup should be verified separately

### NFR Security Coverage

Always consider:

- authentication and authorization boundaries
- soft-delete and inactive-state behavior
- explicit allow/deny expectations when the capability is privileged or
  permission-sensitive
- invalid credential handling
- rate limiting or abuse controls when relevant
- sensitive input validation
- session revocation or expiry behavior when relevant
- safe handling of durable test data and cleanup guards when the PRD implies it
- whether older protected-feature security tests must be revised so they prove
  the new allow/deny gate model instead of only session presence

Recommended layer label:

- `security-integration` by default
- `service-unit` when the security rule is entirely local to one capability

Recommended target folders:

- `tests/security/`
- `tests/integration/security/`

### NFR Logging Or Audit Coverage

Always consider whether the PRD or code implies:

- audit event creation
- security-visible failure logging
- success and failure event coverage
- middleware-driven security event recording

If the system uses audit records instead of generic logs, prefer the audit
language used by the repo.

When newer source-independent docs such as `docs/api-contracts/` or
`docs/data-dictionary/` clarify the real contract, use them as helpful context
instead of re-deriving everything from raw implementation files alone.

If cleanup is intentionally separate from execution, include reporting or audit
visibility around what was created, skipped, deleted, or refused.

Recommended layer label:

- `audit-integration`

Recommended target folders:

- `tests/audit/`
- `tests/integration/audit/`

### Edge Cases

Always include meaningful edge coverage such as:

- empty or malformed input
- duplicate records
- missing related records
- already deleted or already used states
- expired time-based records
- repeated action or idempotency-like behavior
- conflicting lifecycle state
- malformed manifests, missing cleanup inputs, or unsafe cleanup contexts when
  the PRD implies testing-data lifecycle behavior

Recommended layer label:

- reuse the layer that best matches the behavior under test
- if the edge case crosses features or middleware, prefer integration over unit

## Reporting Format

When reporting before edits, use:

1. `PRD Scope`
2. `Proposed Test Coverage`
3. `Detected Changes`
4. `Existing Test Impact`
5. `Recommended Update`

When writing the file, keep the cases compact and scannable.
Prefer bullet lists over dense prose.
Include the test-case ID immediately under each case heading.
Also include:

- `Recommended Test Layer`
- `Suggested Test Folder`

## Guardrails

- Do not plan a thinner test inventory than the current repo standards require
  for the change class in `docs/standards/change-artifact-requirements.md`.
- Do not ignore source-independent API contract or persistence-contract docs
  when they materially clarify the expected behavior under test.

- `Requires Shared Test Helper`
- `Requires Manifest Tracking`
- `Cleanup Expectation`

## Guardrails

- Do not confuse implementation files with test cases; this skill produces test
  case documentation, not executable tests unless the user asks for that next.
- Keep unit and integration coverage separate.
- Do not skip NFR security or audit coverage even if the PRD emphasizes only
  functional behavior.
- If the PRD omits an edge case but the code or architecture makes it important,
  include it and label it as inferred from source.
- If logging is not explicit but durable audit events exist, document audit test
  cases instead of inventing generic logs.
- Do not omit IDs. The ID convention is part of the implementation contract for
  these files.
- Do not assign all cases to one layer by default. Choose the smallest test
  layer that still exercises the intended behavior honestly.
- If a newer PRD or ADR defines cross-cutting test-data lifecycle rules, apply
  those rules when updating older PRD test-case documents as well.
- If existing executable tests appear likely to need changes, call that out as
  part of the proposal instead of treating those future edits as implicit.

## Existing Test Impact Rule

Use this rule whenever the repo already has executable tests related to the
PRD:

- if the PRD can be satisfied by adding new documented cases only, proceed
  normally
- if the PRD suggests existing tests will need expectation changes, deletion,
  or meaningful restructuring, flag that before updating the test-case doc
- do not silently treat current conflicting tests as something that will simply
  be rewritten later
- frame the issue as a discussion point unless the conflict is severe enough to
  block sensible planning

## Trigger Phrases

Trigger this skill for prompts like:

- "derive test cases from this PRD"
- "create PRD test cases"
- "what tests should this PRD have?"
- "add unit and integration test cases for this PRD"
- "create docs/prd/test_cases from the PRD"
