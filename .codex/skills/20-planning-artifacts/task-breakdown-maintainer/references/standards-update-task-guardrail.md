# Standards Update Task Guardrail

Use for task type: `GOV:standards-update`

## Must Preserve

- standards changes are explicit governance changes, not incidental doc cleanup
- existing task packets, templates, validators, and status snapshots are not
  silently invalidated without rollout notes
- standards wording remains consistent with AGENTS.md, architecture, and current
  change-control requirements

## Approval Evidence

- standard, gate, checklist, template, or validator surface being changed
- rationale for why the standard itself must change
- affected downstream task types, maintained artifacts, and validation commands
- compatibility or rollout posture for existing artifacts

## Deep Delivery Standard

- one standard family, gate, checklist, or validator contract per queued task
- split standards compliance/status review into `DOC:standards-compliance`
- split implementation or test changes needed to satisfy the standard into the
  owning task type
- name the exact standards files, templates, validators, and status artifacts
  affected

## Ownership Boundary

`GOV:standards-update` owns changes to repo standards authority. It may create
or update standards language, gate definitions, standard-owned templates,
validator expectations, and rollout notes.

It does not prove compliance with the standard for a feature slice, implement
runtime behavior, or add missing tests. Those belong to
`DOC:standards-compliance`, `DEV:*`, `TEST:*`, or `EVIDENCE:*` tasks.

## Required Check IDs

- `standards-change-owner`
- `standards-rationale`
- `standards-affected-surfaces`
- `standards-rollout-compatibility`
- `standards-validation`
