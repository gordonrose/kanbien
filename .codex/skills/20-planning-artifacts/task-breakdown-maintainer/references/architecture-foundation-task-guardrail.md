# Architecture Foundation Task Guardrail

Use for task type: `architecture-foundation`

## Must Preserve

- architecture decisions live in ADRs or architecture docs before implementation
- no Delivery work proceeds while the decision is unresolved
- compatibility and migration strategy for breaking decisions

## Approval Evidence

- exact ADRs or architecture docs reviewed
- decision needed and owner
- approved output path
- downstream tasks blocked until approval

## Deep Delivery Standard

- one architecture decision, ADR gap, or compatibility strategy per queued task
- do not combine architecture decision work with dependent implementation
- name the downstream tasks blocked until the decision is recorded

## Required Check IDs

- `architecture-adrs-reviewed`
- `architecture-decision-owner`
- `architecture-output-path`
- `architecture-downstream-block`
- `architecture-compatibility`
