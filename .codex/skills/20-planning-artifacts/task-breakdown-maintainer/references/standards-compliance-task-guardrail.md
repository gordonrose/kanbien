# Standards Compliance Task Guardrail

Use for task type: `DOC:standards-compliance`

## Must Preserve

- standards gate named before work begins
- pass, partial, fail, not-assessed, or not-applicable posture recorded
- external standards are mapped to repo enforcement and evidence without
  copying or reinterpreting the external standard text
- no standards drift hidden as implementation cleanup
- existing standards are assessed as written; changing standards requires
  `GOV:standards-update`

## Approval Evidence

- standard or gate reviewed
- source standard path or external authoritative source reference
- required command or review workflow
- affected status snapshot, compliance artifact, or external control map
- blocker or waiver posture when not passing

## Compliance Targets

`DOC:standards-compliance` may assess or record:

- `repo-standard-gate`
- `external-standard-control-map`
- `platform-status-snapshot`
- `task-slice-gate-review`
- `waiver-or-blocker-review`

External control maps belong under `docs/standards/control-maps/`. They are
indexes from adopted external requirements such as WCAG, GDPR, ISO, NIST, or
OWASP to repo standards, enforcement surfaces, tests, evidence, decision
sources, and gaps. They must not duplicate the external standard text.

## Deep Delivery Standard

- one standards gate, posture snapshot, or compliance evidence target per queued
  task
- one external standard family or one tightly scoped control family per
  external-control-map task
- broad proof commands are acceptable when the named standard itself requires a
  broad gate, but the specific gate and output artifact must still be named
- if a compliance review finds implementation, test, evidence, architecture, or
  standards-authority gaps, route follow-up work to the owning task type
- do not hide implementation cleanup inside DOC:standards-compliance work
- do not change standards, gates, templates, or validator expectations inside
  DOC:standards-compliance work

## Ownership Boundary

`DOC:standards-compliance` owns compliance/status evidence against existing
standards. It may update standards status snapshots, review notes, and posture
evidence that say whether the repo or task currently passes, partially passes,
fails, is not assessed, or is not applicable. It may also maintain external
control maps that connect adopted external standards to repo enforcement,
evidence, tests, and decision provenance.

It does not change the standards themselves. Standards language, gates,
checklists, templates, validator contracts, or rollout rules belong to
`GOV:standards-update`.

## Required Check IDs

- `standards-gate-named`
- `standards-source-path`
- `standards-posture-recorded`
- `standards-command`
- `standards-status-artifact`
- `standards-follow-up-routing`
