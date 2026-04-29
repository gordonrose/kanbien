# QA Evidence Task Guardrail

Use for task type: `QA/evidence`

## Must Preserve

- proof layer matches the user-visible, runtime, contract, persistence, or
  standards risk
- runtime/browser evidence is required for visible runtime defects
- mock honesty against live data/API/projection shape
- no completion language outruns evidence

## Approval Evidence

- proof target and commands
- live data/API/browser evidence plan when relevant
- mock-honesty comparison
- blocked, partial, or passing evidence status

## Required Check IDs

- `qa-proof-target`
- `qa-command-plan`
- `qa-runtime-evidence`
- `qa-mock-honesty`
- `qa-evidence-status`
