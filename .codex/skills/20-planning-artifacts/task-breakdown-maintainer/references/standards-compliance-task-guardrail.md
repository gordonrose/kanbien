# Standards Compliance Task Guardrail

Use for task type: `DOC:standards-compliance`

## Must Preserve

- standards gate named before work begins
- pass, partial, fail, not-assessed, or not-applicable posture recorded
- no standards drift hidden as implementation cleanup
- existing standards are assessed as written; changing standards requires
  `GOV:standards-update`

## Approval Evidence

- standard or gate reviewed
- required command or review workflow
- affected status snapshot or standards artifact
- blocker or waiver posture when not passing

## Deep Delivery Standard

- one standards gate, posture snapshot, or compliance evidence target per queued
  task
- broad proof commands are acceptable when the named standard itself requires a
  broad gate, but the specific gate and output artifact must still be named
- do not hide implementation cleanup inside DOC:standards-compliance work
- do not change standards, gates, templates, or validator expectations inside
  DOC:standards-compliance work

## Ownership Boundary

`DOC:standards-compliance` owns compliance/status evidence against existing
standards. It may update standards status snapshots, review notes, and posture
evidence that say whether the repo or task currently passes, partially passes,
fails, is not assessed, or is not applicable.

It does not change the standards themselves. Standards language, gates,
checklists, templates, validator contracts, or rollout rules belong to
`GOV:standards-update`.

## Required Check IDs

- `standards-gate-named`
- `standards-posture-recorded`
- `standards-command`
- `standards-status-artifact`
