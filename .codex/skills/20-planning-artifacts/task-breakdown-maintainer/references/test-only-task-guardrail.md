# Test-Only Task Guardrail

Use for task type: `TEST:test-only`

## Must Preserve

- traceability to story acceptance criteria or approved `TC-*` IDs from
  `docs/prd/test_cases`
- approved test source authority from PRD test cases, Story Breakdown proof
  obligations, issue reconciliation, QA backlog, standards, or an explicit
  proof-gap decision
- proof layer that matches the risk being tested
- exact test file, scenario, or assertion target
- mock honesty against production persistence/API/browser shape
- no behavior changes hidden inside TEST:test-only work
- no production source writes, schema changes, route contract changes, fixture
  convenience behavior, or app behavior changes to make the test pass
- explicit actor, permission, object, boundary, and state coverage when the
  task is privileged, root-admin, tenant-boundary, authz, sensitive-rendering,
  asset, lifecycle, or security-sensitive
- focused proof must fail or would have failed for the intended defect/proof
  gap before the implementation exists, unless the task is intentionally adding
  prospective coverage for an already-approved behavior

## Approval Evidence

- source authority and coverage source: `TC-*`, acceptance criterion, approved
  test plan, issue reconciliation, QA backlog, standard, or explicit proof-gap
  record
- acceptance criteria or `TC-*` IDs covered
- test layer, proof target, and expected assertion/observable behavior
- fixture source and mock-honesty check
- focused test command
- `npm run test:coverage-strength` output or a scoped equivalent showing
  coverage-strength/debt impact beyond traceability
- production behavior change posture
- permission/state matrix or concrete not-applicable rationale
- split decision when missing product, API, authz, lifecycle, data, UI,
  migration, or platform behavior is discovered

## Deep Delivery Standard

- one proof gap, fixture contract, or test-family target per queued task
- split fixture/data contract work from render, interaction, or runtime
  behavior implementation
- distinguish PRD-derived `TC-*` implementation from a local proof-gap test,
  security/permutation matrix test, or e2e journey test
- for PRD-derived tests, name the exact reviewed `TC-*` IDs and the
  `docs/prd/test_cases` source artifact before queueing
- for e2e tests, name the journey ID, real-vs-mocked boundary, runtime data
  source, and focused command
- for privileged or security-sensitive tests, cover allowed and denied states
  explicitly; do not let a happy-path-only test satisfy the task
- broad suites may supplement but cannot replace a named test scenario or
  expected failing/passing assertion
- use `npm run test:coverage-strength` as a non-traceability coverage-health
  summary after adding or materially changing tests; traceability alone does not
  prove coverage strength
- if the test reveals missing production behavior, stop and split the required
  implementation into the owning `DEV:backend`, `DEV:frontend`, `DEV:vertical-slice`, or
  other task type before continuing
- if the test reveals missing or stale test-case documentation, split
  reconciliation into `TEST:test-suite-alignment` instead of rewriting the task
  to fit current code
- if the task's main work is evidence capture, artifact sweep, screenshots,
  runtime proof collation, or coverage-health reporting, use
  `EVIDENCE:qa-evidence`

## Source Authority And Test Shape

TEST:test-only implements executable proof for an approved behavior or an
approved proof gap. It does not decide what the product, API, authz model,
storage model, lifecycle posture, or UI should do.

Allowed coverage sources:

- approved `TC-*` rows in `docs/prd/test_cases`
- Story Breakdown acceptance criteria and proof obligations
- approved issue-reconciliation findings
- approved QA backlog or standards coverage gap
- explicit Layer 4 proof-gap row tied to a source artifact

For each queued task, name whether the test is:

- PRD-derived `TC-*` implementation
- isolated proof-gap coverage
- security or permission permutation matrix
- persistence-backed proof
- browser/e2e journey proof
- regression test from issue reconciliation

If the expected assertion cannot be stated without inventing product behavior,
block the test task and route the missing decision to the owning artifact or
implementation task.

## No Behavior Change Boundary

TEST:test-only may add or update executable tests, approved fixtures, test
helpers, labels, and test documentation required by the proof. It must not:

- change production source under `src/` to satisfy the test
- change migrations, schemas, generated runtime wiring, or feature manifests
- change API contract, permission mapping, data dictionary, or standards truth
- add fixture fallback behavior that production does not have
- alter mocks to encode rejected, speculative, or convenience behavior
- relax assertions to match current incomplete implementation when the source
  artifact requires stronger behavior

If production behavior is wrong or missing, split to the owning `DEV:*`,
`DOC:*`, or `GOV:*` task and keep the test-only task blocked or dependent.

## Sensitive And Permission Proof

For privileged, tenant-boundary, root-admin, authz, support/emergency,
lifecycle/deletion, asset, billing, export, audit/proof, sensitive-rendering,
or security-sensitive tests, the task must name:

- allowed state
- denied/forbidden state
- unauthenticated or expired-session state when relevant
- cross-tenant denial state when tenant-scoped data or context is involved
- object/entity-level denial when an object rule is part of the source artifact
- fixture source and mock/runtime honesty evidence
- expected public denial category or safe fallback when the source artifact
  defines one

Happy-path-only proof cannot queue for sensitive work unless the task is
explicitly limited to a non-sensitive local unit rule and records why the
permission/state matrix is not applicable.

## Split Rules

Split or block when:

- source test cases, traceability labels, or executable/doc alignment are stale;
  create `TEST:test-suite-alignment`
- missing runtime behavior is discovered; create the owning `DEV:backend`,
  `DEV:frontend`, `DEV:platform-seam`, `DEV:migration-persistence`, or
  `DEV:vertical-slice`
- API contract truth is missing; create `DOC:api-contract`
- permission rows or authz posture are missing; create `DOC:permission-mapping`
- data dictionary/storage truth is missing; create `DOC:data-dictionary`
- architecture or standards authority is missing; create
  `GOV:architecture-update` or `GOV:standards-update`
- evidence capture, screenshots, runtime proof collation, or coverage-strength
  reporting is the main work; create `EVIDENCE:qa-evidence`

## Required Check IDs

- `test-source-authority`
- `test-traceability`
- `test-proof-layer`
- `test-permission-state-matrix`
- `test-mock-honesty`
- `test-no-behavior-change`
- `test-sensitive-state-coverage`
- `test-focused-command`
- `test-coverage-strength`
- `test-split-boundary`
