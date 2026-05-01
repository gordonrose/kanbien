# QA Evidence Task Guardrail

Use for task type: `EVIDENCE:qa-evidence`

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

## Deep Delivery Standard

- evidence capture, mock-honesty review, visual sweep, and runtime proof should
  normally be separate from implementation for complex work
- name exact evidence artifacts, scenarios, payload shapes, or audit outputs
- broad proof commands are acceptable only when the task is explicitly an
  evidence sweep and the task-specific evidence targets are still named
- do not change product behavior inside a EVIDENCE:qa-evidence task unless a separate
  implementation task authorizes it

## Required Check IDs

- `qa-proof-target`
- `qa-command-plan`
- `qa-runtime-evidence`
- `qa-mock-honesty`
- `qa-evidence-status`
