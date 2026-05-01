# Docs Artifact Task Guardrail

Use for task type: `docs-artifact`

## Must Preserve

- source-of-truth alignment with architecture, standards, PRD, contracts, and
  current implementation
- no source-independent docs describing stale platform behavior
- no artifact status promotion without validation or explicit blocker notes

## Approval Evidence

- source files or artifacts reviewed
- docs updated or intentionally not applicable
- validation or review command
- downstream stale-artifact sweep result

## Deep Delivery Standard

- one artifact family or source-truth alignment target per queued task
- separate decision/audit tasks from implementation or docs refresh tasks when
  the audit may change scope
- name the exact source files inspected, docs updated, and validation or review
  output

## Required Check IDs

- `docs-source-truth-reviewed`
- `docs-stale-artifact-sweep`
- `docs-status-posture`
- `docs-validation-command`
