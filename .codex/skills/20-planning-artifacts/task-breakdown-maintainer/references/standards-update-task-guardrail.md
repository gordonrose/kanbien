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
