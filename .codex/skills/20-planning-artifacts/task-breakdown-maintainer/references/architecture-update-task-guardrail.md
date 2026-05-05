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
- architecture update class and architecture source of authority reviewed
- architecture artifact path being created or changed
- rationale, compatibility posture, downstream task impact, and consistency
  sweep inventory
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
- fill the Architecture Update Contract with the update class, concrete
  authority/consistency inventory, human-review boundary, and exact validation
  or review evidence

## Architecture Update Classes

Use the class as the task's script-facing contract:

- `adr-create`: create a new ADR from an approved decision source.
- `adr-amendment`: amend an existing ADR from an approved decision source.
- `system-overview-update`: update `docs/architecture/system-overview.md`.
- `frontend-topology-authority`: update durable frontend topology authority,
  route-family authority, locator policy, or materialization policy.
- `architecture-template-update`: update an architecture-owned template without
  changing standards authority.
- `architecture-map-update`: update architecture maps, dependency maps, or
  generated architecture summaries from approved authority.

Worked examples:

- ADR creation/amendment: target `docs/architecture/adr/`, review adjacent ADRs,
  and split implementation to `DEV:*`.
- system overview update: target `docs/architecture/system-overview.md`, sweep
  principles/change-control/ADR consistency, and preserve compatibility notes.
- frontend topology authority: target the architecture source that owns durable
  topology, route moves, locator policy, or materialization policy; route real
  app implementation to `DEV:frontend` or `DEV:platform-seam`.
- architecture-owned template change: target `docs/templates/`; route standards
  requirements to `GOV:standards-update` when the template change creates or
  changes a repo standard.

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
- `architecture-update-class`
- `architecture-authority-reviewed`
- `architecture-change-owner`
- `architecture-output-artifact`
- `architecture-consistency-inventory`
- `architecture-downstream-impact`
- `architecture-validation`
