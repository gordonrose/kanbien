# Test-Only Task Guardrail

Use for task type: `test-only`

## Must Preserve

- traceability to story acceptance criteria or approved `TC-*` IDs from
  `docs/prd/test_cases`
- proof layer that matches the risk being tested
- exact test file, scenario, or assertion target
- mock honesty against production persistence/API/browser shape
- no behavior changes hidden inside test-only work
- explicit actor, permission, object, boundary, and state coverage when the
  task is privileged, root-admin, tenant-boundary, authz, sensitive-rendering,
  asset, lifecycle, or security-sensitive

## Approval Evidence

- acceptance criteria or `TC-*` IDs covered
- test layer and proof target
- fixture source and mock-honesty check
- focused test command
- production behavior change posture
- permission/state matrix or concrete not-applicable rationale

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
- if the test reveals missing production behavior, stop and split the required
  implementation into the owning `backend`, `frontend`, `vertical-slice`, or
  other task type before continuing

## Required Check IDs

- `test-traceability`
- `test-proof-layer`
- `test-permission-state-matrix`
- `test-mock-honesty`
- `test-no-behavior-change`
- `test-command`
