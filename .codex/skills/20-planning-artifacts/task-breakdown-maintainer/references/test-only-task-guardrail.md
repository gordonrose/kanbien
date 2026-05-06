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
- test change class: `prd-test-case`, `proof-gap`,
  `permission-state-matrix`, `security-boundary`, `e2e-journey`,
  `regression-lock`, or `fixture-honesty`

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
- interpret coverage-strength output by class: skipped/focused tests block,
  mock/stub-only signals require mock-honesty review, assertionless debug
  visual files require evidence-sweep ownership rather than automatic failure,
  escaped-defect signals should route to regression-lock proof, and e2e/browser
  tier gaps require a journey owner before being accepted
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

- `prd-test-case`: PRD-derived `TC-*` implementation
- `proof-gap`: isolated approved proof-gap coverage
- `permission-state-matrix`: actor/permission/object/boundary permutation
  coverage
- `security-boundary`: explicit security, authn/authz, tenant, asset, or
  sensitive-data boundary proof
- `e2e-journey`: browser or end-to-end journey proof
- `regression-lock`: escaped-defect or issue-reconciliation regression proof
- `fixture-honesty`: fixture, mock, or test-harness honesty proof against
  production contracts

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

## Worked Examples

| Scenario | Test Change Class | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| Approved PRD `TC-*` rows need executable coverage for an existing backend behavior. | `prd-test-case` | Name exact test-case doc, `TC-*` IDs, target test file, expected assertions, focused command, traceability, mock-honesty, and coverage-strength summary. | Missing behavior routes to owning DEV task; stale `TC-*` status routes to suite alignment. |
| A tenant-boundary permission matrix lacks denied and cross-tenant proof. | `permission-state-matrix` or `security-boundary` | Cover allowed, denied, expired/unauthenticated, cross-tenant, and object-level states with fixture/runtime honesty and safe denial expectations. | Missing permission mapping routes to `DOC:permission-mapping`; missing runtime denial routes to backend/platform work. |
| An escaped defect needs a regression lock. | `regression-lock` | Source is issue reconciliation; test fails or would have failed for the defect, names fixture/live shape, focused command, and no behavior-change posture. | Do not patch production code or weaken assertions inside the test-only task. |
| Coverage-strength output reports mock-only risk or single-layer e2e/browser breadth debt after the focused test passes. | `proof-gap` or `fixture-honesty` | Record the focused proof result plus coverage-strength class, decide whether the scoped debt is resolved, split, or accepted with owner, and name any e2e/browser journey tier owner. | Do not mark `debt-found` as `none`; coverage-strength debt is not behavior proof and cannot replace the focused test. |
| Fixture behavior may invent fallback fields production does not provide. | `fixture-honesty` | Compare fixture/mock source against API contract or live payload, update only approved test fixture/test harness expectations, and record honesty evidence. | If production contract is unclear, split to `DOC:api-contract` or `EVIDENCE:qa-evidence`. |

## Required Check IDs

- `test-source-authority`
- `test-change-class`
- `test-traceability`
- `test-proof-layer`
- `test-permission-state-matrix`
- `test-mock-honesty`
- `test-no-behavior-change`
- `test-sensitive-state-coverage`
- `test-focused-command`
- `test-coverage-strength`
- `test-split-boundary`
