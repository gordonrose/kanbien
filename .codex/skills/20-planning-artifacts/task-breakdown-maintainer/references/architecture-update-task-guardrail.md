# Architecture Update Task Guardrail

Use for task type: `GOV:architecture-update`

## Must Preserve

- durable architecture authority is updated only through explicit governance
  work
- ADRs, architecture maps, system overview, principles, and change-control docs
  remain internally consistent
- downstream implementation tasks stay inside the approved architecture envelope

## Approval Evidence

- approved decision source from Layer 2, ADR, existing architecture authority,
  or explicit recorded human approval
- architecture source of authority reviewed
- architecture artifact path being created or changed
- rationale, compatibility posture, and downstream task impact
- validation or review command

## Approved Decision Sources

`GOV:architecture-update` may only update durable architecture authority from
an approved decision source:

- `Layer-2-technical-steering`
- `ADR`
- `existing-architecture-source`
- `approved-architecture-foundation-output`
- `explicit-recorded-human-approval`

If options, trade-offs, risk, cost, compatibility, operability, security,
privacy, compliance, testability, reversibility, recommendation, rejected
alternatives, or signoff are unresolved, route back to
`DECISION:architecture-foundation` or Layer 2 Technical Steering.

## Deep Delivery Standard

- one architecture rule, ADR decision, topology rule, or authority update per
  queued task
- split unresolved decisions into `DECISION:architecture-foundation`
- split dependent implementation into the owning `DEV:*` task type
- name downstream tasks or artifact families affected by the architecture
  update

## Ownership Boundary

`GOV:architecture-update` owns durable architecture artifacts. It may create or
update ADRs, architecture maps, system-overview/principles/change-control
guidance, topology authority docs, or architecture-owned templates.

It does not implement product behavior or treat an unresolved decision as
approved. If the question is still open, use `DECISION:architecture-foundation`
first; if source implementation must change, split to the owning implementation
task.

## Required Check IDs

- `architecture-approved-decision-source`
- `architecture-authority-reviewed`
- `architecture-change-owner`
- `architecture-output-artifact`
- `architecture-downstream-impact`
- `architecture-validation`
