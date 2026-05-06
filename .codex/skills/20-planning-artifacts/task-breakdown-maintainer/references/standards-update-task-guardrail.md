# Standards Update Task Guardrail

Use for task type: `GOV:standards-update`

## Must Preserve

- standards changes are explicit governance changes, not incidental doc cleanup
- existing task packets, templates, validators, and status snapshots are not
  silently invalidated without rollout notes
- standards wording remains consistent with AGENTS.md, architecture, and current
  change-control requirements

## Approval Evidence

- approved standards change source, such as recorded human approval,
  standards-compliance audit, issue/escaped-defect reconciliation, harness
  retrospective, Layer 2 steering, or existing standards contradiction
- standards update class and matching enforcement posture
- standard, gate, checklist, template, or validator surface being changed
- rationale for why the standard itself must change
- affected downstream task types, maintained artifacts, invalidation sweep, and
  validation commands
- compatibility or rollout posture for existing artifacts

## Approved Standards Change Sources

`GOV:standards-update` may only change durable standards authority from an
approved source:

- `Layer-2-technical-steering`
- `standards-compliance-audit`
- `issue-reconciliation`
- `escaped-defect-reconciliation`
- `harness-retrospective`
- `existing-standards-contradiction`
- `explicit-recorded-human-approval`

If the source is only a hunch, convenience preference, broad cleanup desire, or
implementation pressure, block the task until the source is recorded.

## Enforcement And Debt Posture

Every standards update must choose an enforcement posture:

- `validator-or-gate-enforced-now`
- `template-required-now`
- `script-reported-debt`
- `advisory-with-approved-debt-route`

The default posture is enforcement now. Advisory standards are allowed only
when the task records why immediate enforcement is not possible, which debt
artifact or follow-up task owns cleanup, and what will make the advisory rule
enforceable later.

## Standards Update Classes

Use the class to make the standards update script-first and reviewable:

- `enforced-now`: changes a validator, gate, check ID, or proof script in the
  same task; enforcement posture must be `validator-or-gate-enforced-now`.
- `template-required`: changes a standards-owned template or required packet
  field; enforcement posture must be `template-required-now`.
- `script-reported-debt`: adds or changes a reporting script that surfaces debt
  without failing existing work; enforcement posture must be
  `script-reported-debt`.
- `advisory-approved-debt`: records an advisory rule with an approved cleanup
  route; enforcement posture must be `advisory-with-approved-debt-route`.
- `artifact-invalidation-sweep`: reviews which existing packets, templates,
  validators, status snapshots, examples, or generated artifacts are invalidated
  by the standard and records owner/routing outcomes.

Worked examples:

- enforced now: add a required check ID plus validator test coverage.
- advisory with approved debt route: add a rule that cannot yet fail because
  existing packets need a named cleanup task.
- script-reported debt: add a health/report command that lists debt without
  blocking until the debt policy is approved.
- existing-artifact invalidation sweep: review affected maintained artifacts
  and split specialized rewrites to their owning task types.

## Worked Examples

| Scenario | Update Class | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| A harness retrospective approves a new required Layer 4 check ID that can be validated immediately. | `enforced-now` | Source is the retrospective or recorded approval; target names the guardrail reference, `src/scripts/taskBreakdownValidate.ts`, `src/scripts/featureCompiler/contracts.ts`, and focused unit tests; enforcement posture is `validator-or-gate-enforced-now`; invalidation sweep names affected packet template/examples. | Do not update existing task packets for compliance inside this task; route packet remediation to `DOC:standards-compliance`, `DOC:docs-artifact`, or the owning task type. |
| A task-breakdown template field becomes mandatory for new packets but does not need runtime validator logic yet. | `template-required` | Source is Layer 2, standards audit, or explicit approval; target is `docs/templates/task-breakdown-packet-template.md` plus matching guardrail reference; enforcement posture is `template-required-now`; rollout says existing packets are reviewed or unaffected. | Do not change implementation behavior or architecture authority; route architecture-template authority changes to `GOV:architecture-update`. |
| A standards audit approves a debt summary command that reports residual gaps without failing current work. | `script-reported-debt` | Target names the reporting script and docs/standards guidance; enforcement posture is `script-reported-debt`; artifact invalidation sweep explains that current debt is surfaced but not blocking; validation names the report command and tests. | Do not silently turn reported debt into a failing gate until cleanup or exception posture is approved. |
| A new rule is correct but existing artifacts need cleanup before it can fail the gate. | `advisory-approved-debt` | Source records explicit approval and debt owner; target is the standard or guardrail reference; debt route names a follow-up task, cleanup artifact, or approved debt record; rollout says when enforcement can become validator-backed. | Do not label the rule enforced now; do not bury cleanup in the standards update. |
| A standards change may invalidate existing templates, validators, examples, generated artifacts, or status snapshots. | `artifact-invalidation-sweep` | Target is a bounded sweep note or standards-owned artifact; affected surfaces name exact paths; invalidation sweep records reviewed, invalidated, routed-away, or not-applicable outcomes; validation names `rg`, `git diff --check`, and any focused tests. | Do not rewrite specialized artifacts discovered by the sweep; route API, data, permission, architecture, design-system, test, and evidence updates to their owners. |
| A compliance review finds that a feature does not satisfy an existing gate. | blocked route-away | `GOV:standards-update` is not needed unless the standard itself is wrong or incomplete. | Record compliance posture in `DOC:standards-compliance`; route missing behavior, tests, or evidence to `DEV:*`, `TEST:*`, or `EVIDENCE:qa-evidence`. |

## Deep Delivery Standard

- one standard family, gate, checklist, or validator contract per queued task
- split standards compliance/status review into `DOC:standards-compliance`
- split implementation or test changes needed to satisfy the standard into the
  owning task type
- name the exact standards files, templates, validators, and status artifacts
  affected
- record the artifact invalidation sweep or an explicit not-applicable
  rationale before queueing

## Ownership Boundary

`GOV:standards-update` owns changes to repo standards authority. It may create
or update standards language, gate definitions, standard-owned templates,
validator expectations, registry/check-ID requirements, proof scripts,
validator tests, and rollout notes.

It does not prove compliance with the standard for a feature slice, implement
runtime behavior, or add missing tests. Those belong to
`DOC:standards-compliance`, `DEV:*`, `TEST:*`, or `EVIDENCE:*` tasks.

## Required Check IDs

- `standards-approved-change-source`
- `standards-update-class`
- `standards-change-owner`
- `standards-rationale`
- `standards-affected-surfaces`
- `standards-invalidation-sweep`
- `standards-enforcement-plan`
- `standards-rollout-compatibility`
- `standards-validation`
