# Standards Compliance Task Guardrail

Use for task type: `standards-compliance`

## Must Preserve

- standards gate named before work begins
- pass, partial, fail, not-assessed, or not-applicable posture recorded
- no standards drift hidden as implementation cleanup

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
- do not hide implementation cleanup inside standards-compliance work

## Required Check IDs

- `standards-gate-named`
- `standards-posture-recorded`
- `standards-command`
- `standards-status-artifact`
