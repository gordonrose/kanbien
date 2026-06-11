---
name: codex-trust-override
description: Use before any governed, material, user-visible, runtime, security, persistence, architecture, harness, or artifact work where Codex must not self-select evidence sufficiency; forces closure audit, evidence boundary discovery, incomplete-state vocabulary, and reconciliation mode after repeated corrections.
---

# Codex Trust Override

Use this skill before acting on governed or material work.

This skill exists because Codex's normal completion drive is unsafe when the
task requires evidence discipline.

## Authority Order

1. `AGENTS.md`
2. This skill
3. `docs/workspace/trust-harness/codex-trust-override.md`
4. Task-specific skills, standards, architecture docs, and harness gates

If this skill conflicts with a speed, autonomy, or progress impulse, this skill
wins.

## Completion Drive Override

Treat "I think this is basically done" as a stop signal, not a completion
signal.

For material work, evidence discipline outranks:

- speed
- helpfulness
- visible progress
- apparent task completion
- Codex confidence
- nearby passing tests

## Before Acting

Identify:

- governing instruction source
- task risk class
- allowed next action
- evidence contract required for that risk class
- whether user confirmation will be required before closure

If the allowed next action or evidence contract is unknown, inspect the
governing instructions before editing.

## Current Task Audit

Before governed or material edits, create or update:

- `docs/workspace/trust-harness/current-task-audit.md`

This file is a single-active-task artifact. It must contain exactly one
`## Preflight Contract` section and exactly one
`## Post-Work Closure Record` section. Move historical records to
`docs/workspace/trust-harness/audit-history/` instead of appending multiple
active records.

Record the pre-edit contract before patching:

- task summary
- mode: `inspect-only`, `plan-only`, `patch-only`, `verify-only`, or
  `reconcile-only`
- governing instruction sources
- task risk class
- discovered evidence boundary
- intended edit boundary
- files allowed to edit
- files explicitly out of scope
- required verification commands
- allowed closure vocabulary

After material work, update the same file with:

- actual files edited
- evidence collected
- commands run and results
- missing or inferred evidence
- whether user confirmation is still required
- final permitted closure state

`npm run git:preflight` and the repo-governance harness validate this audit.
If material governed paths changed without the audit, if the audit contains
multiple active task records, if changed paths fall outside the declared edit
boundary, or if detectable completion language outruns recorded evidence, the
gate must fail or report loudly. Current-task audit validation must not mask or
downgrade git dirty-state blocking.

## Evidence Boundary Rule

Do not self-select the proof boundary.

For runtime, frontend, persistence, API, security, migration, or artifact work,
discover the relevant surface first from the live runtime, source of truth,
schema, route contract, rendered DOM, maintained artifact, or governing docs.

Only then decide what evidence is enough.

## Closure Audit

Before any final response that implies material progress, answer:

- What governing instruction source applied?
- What task risk class applied?
- What surface of risk was discovered independently of the patch?
- What evidence was required?
- What evidence was collected?
- What evidence is missing or only inferred?
- What closure state is allowed?
- Is user confirmation still required?

If any answer is missing, do not use completion language.

## Closure Vocabulary

Use completion language only when the governing evidence contract is satisfied.

Completion language includes:

- fixed
- done
- complete
- working
- ready
- should be fixed
- should work

When evidence is incomplete, use one of:

- `candidate fix`
- `implementation-only`
- `partially verified`
- `blocked on verification`
- `pending user confirmation`

## Repeated Correction Mode

If the user corrects the same class of mistake:

1. Stop implementation.
2. Name the repeated mistake.
3. Name the instruction or evidence contract bypassed.
4. Explain how Codex's operating loop allowed the bypass.
5. Rebuild the evidence boundary before making another patch.

## Harness Change Rule

Any harness or governance change must state the trust delta:

- which Codex default failure mode it makes impossible or loud
- which command, gate, or artifact fails when the failure recurs
- which negative fixture, live route, or real incident represents the failure
  class

For material harness-governance changes, check ADR-0051:

- `docs/architecture/adr/0051-log-harness-governance-decisions-as-adrs.md`

If the change alters what evidence is required, which harness gate or skill is
authoritative, how incomplete work is classified, or how a known Codex failure
mode is made impossible or loud, either update/create the relevant ADR or state
why the change is too local to require one.

If the change only asks Codex to be more careful, it is not enough.

## Reference

For the durable project record and implementation roadmap, see:

- `docs/workspace/trust-harness/README.md`
- `docs/workspace/trust-harness/codex-trust-override.md`
