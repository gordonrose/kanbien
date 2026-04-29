# Test-Only Task Guardrail

Use for task type: `test-only`

## Must Preserve

- traceability to story acceptance criteria or approved `TC-*` IDs
- proof layer that matches the risk being tested
- mock honesty against production persistence/API/browser shape
- no behavior changes hidden inside test-only work

## Approval Evidence

- acceptance criteria or `TC-*` IDs covered
- test layer and proof target
- fixture source and mock-honesty check
- focused test command

## Required Check IDs

- `test-traceability`
- `test-proof-layer`
- `test-mock-honesty`
- `test-no-behavior-change`
- `test-command`
