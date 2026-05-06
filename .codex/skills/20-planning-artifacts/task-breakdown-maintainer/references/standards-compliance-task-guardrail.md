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
- control/evidence inventory for scriptable inspection
- required command or review workflow
- coverage summary command or explicit manual-review rationale
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

## Scriptable Compliance Inventory

For script-first execution, fill the Standards Compliance Contract with:

- concrete repo standard paths, external source references, evidence paths,
  test paths, command output names, or generated summaries reviewed
- the exact evidence artifact or control map target
- a focused review or summary command, such as a standards gate, traceability
  command, coverage-strength command, `rg` inventory, or explicit manual-review
  rationale when the conclusion depends on human control interpretation
- the human-review boundary, limited to compliance judgment, applicability, or
  waiver/blocker interpretation

Worked routing examples:

- WCAG accessibility control map: `external-standard-control-map`; inventory
  includes design-system behavior locks, browser tests, accessibility evidence,
  and any `npm run frontend:gate` or visual/a11y command output; missing proof
  routes to `TEST:test-only` or `EVIDENCE:qa-evidence`.
- GDPR privacy/control review: `external-standard-control-map`; inventory
  includes data dictionary, asset decision, permission mapping, audit, privacy,
  and retention docs; missing authority routes to `GOV:standards-update` or
  `GOV:architecture-update`.
- ISO/NIST/OWASP control map: inventory links each adopted control family to
  repo standards, security tests, CI gates, evidence artifacts, and blocker
  follow-ups without copying the external standard text.
- repo-only gate review: `repo-standard-gate` or `task-slice-gate-review`;
  inventory names the exact repo standard, gate command, affected packet, and
  evidence artifact.

## Worked Examples

| Scenario | Compliance Target | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| A release slice needs a repo-only QA gate review against `docs/standards/QA-RELEASE-GATE.md`. | `repo-standard-gate` or `task-slice-gate-review` | Source path names the gate; inventory names the task packet, proof commands, test output, and evidence artifact; review method is the focused gate or manual standards review; coverage summary names `npm run test:coverage-strength` when test strength is in scope; posture records pass, partial, fail, or blocked. | Do not add missing tests or change release standards in this task; route missing executable proof to `TEST:test-only` and standards language changes to `GOV:standards-update`. |
| A platform status snapshot such as `docs/standards/platform-status/OWASP-ASVS-STATUS.md` must be refreshed from current security evidence. | `platform-status-snapshot` | Inventory names `docs/standards/OWASP-ASVS-GATE.md`, security tests, relevant architecture/security docs, and command output; evidence target is the status file; follow-up routing records any partial/fail posture with owning task types. | Do not change authz, routing, middleware, or tests; route implementation to `DEV:*`, proof capture to `EVIDENCE:qa-evidence`, and missing tests to `TEST:test-only`. |
| An adopted external standard needs a control map under `docs/standards/control-maps/`, such as GDPR, ISO, NIST, OWASP, or WCAG. | `external-standard-control-map` | Source reference names the external authoritative source and repo gate; inventory links repo standards, data dictionary, permission mapping, tests, evidence, and decision sources; evidence target is one control-map file; human review owns applicability and compliance judgment. | Do not copy the external standard text or change repo standards; route standards changes to `GOV:standards-update` and architecture authority gaps to `GOV:architecture-update`. |
| A compliance review finds a known gap that has an approved waiver or blocker. | `waiver-or-blocker-review` | Inventory names the standard, waiver/blocker source, evidence artifact, and affected scope; posture is `waived-with-approval` or `blocked`; follow-up routing names the approved waiver, owning follow-up task, or blocker owner. | Do not present the gate as passing and do not implement the missing control inside the compliance task. |
| A task proposes to edit `docs/standards/change-artifact-requirements.md` while recording whether a slice complied. | blocked route-away | Compliance evidence can record that the current standard was reviewed, but changing standards authority is not allowed in `DOC:standards-compliance`. | Route standards language, gates, templates, validators, check IDs, or rollout rules to `GOV:standards-update`. |

## Deep Delivery Standard

- one standards gate, posture snapshot, or compliance evidence target per queued
  task
- one external standard family or one tightly scoped control family per
  external-control-map task
- broad proof commands are acceptable when the named standard itself requires a
  broad gate, but the specific gate and output artifact must still be named
- external-control-map tasks must summarize coverage against repo enforcement
  and evidence surfaces without duplicating external standard text
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
- `standards-control-evidence-inventory`
- `standards-posture-recorded`
- `standards-command`
- `standards-coverage-summary`
- `standards-status-artifact`
- `standards-follow-up-routing`
