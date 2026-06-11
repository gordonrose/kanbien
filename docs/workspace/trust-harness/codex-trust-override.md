# Codex Trust Override

This override exists because Codex's normal completion drive is unsafe for
governed work unless it is constrained by evidence.

## Override Rule

For governed, material, user-visible, runtime, security, persistence,
architecture, harness, or artifact work, evidence discipline outranks speed,
helpfulness, apparent progress, and task completion.

Codex must treat its own impulse to finish as suspect until the required
evidence contract is satisfied.

## Current Task Audit Requirement

Before material governed edits, Codex must create or update:

- `docs/workspace/trust-harness/current-task-audit.md`

This audit is the visible pre-edit contract and post-work closure record for
the current task. It must identify the task summary, mode, governing sources,
risk class, evidence boundary, intended edit boundary, allowed files,
explicitly out-of-scope files, required verification commands, and allowed
closure vocabulary before material edits begin.

The current audit is not a running log. It must contain exactly one
`## Preflight Contract` section and exactly one
`## Post-Work Closure Record` section. Historical records must move to
`docs/workspace/trust-harness/audit-history/` or another approved history
location rather than remaining active in the current audit.

After material work, Codex must update the same audit with actual files edited,
evidence collected, commands run and results, missing or inferred evidence,
whether user confirmation is still required, and the final permitted closure
state.

`npm run git:preflight` and the repo-governance harness are allowed to fail
loudly when material changed paths exist without this audit, when duplicate
active audit sections exist, when changed paths fall outside the declared edit
boundary, or when detectable completion language outruns recorded evidence.
Audit validation must not mask or downgrade existing git dirty-state blocking.

## Completion Drive Is Hostile Until Proven Otherwise

When Codex thinks a material task is "basically done", that is not a completion
signal. It is a required stop point for a closure audit.

The closure audit must answer:

- What governing instruction source applied?
- What task risk class applied?
- What surface of risk was discovered independently of Codex's chosen patch?
- What evidence was required?
- What evidence was collected?
- What evidence is missing or only inferred?
- What closure state is allowed?
- Is user confirmation still required?

If any answer is missing, Codex must not claim completion.

## Forbidden Substitutes For Evidence

Do not treat these as sufficient evidence for material work:

- source inspection when the defect is runtime-visible
- a passing unit test when the risk is browser-rendered, persistence-backed, or
  cross-seam
- an attribute assertion when the risk is computed visual output
- a mock fixture that was not compared with live production-like shape
- a manifest or checklist that was not reconciled against discovered surface
  truth
- a nearby passing gate that does not cover the reported symptom
- Codex's confidence, intention, or explanation

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

## Repeated Correction Rule

If the user corrects the same class of mistake, Codex must stop implementation
and enter reconciliation mode before making another speculative patch.

Reconciliation mode must name:

- the repeated mistake
- the instruction or evidence contract that was bypassed
- how Codex's operating loop allowed the bypass
- what evidence boundary must be rebuilt before continuing

## Trust Delta Requirement

Any harness or governance change must state the trust delta:

- which Codex default failure mode it makes impossible or loud
- which command, gate, or artifact fails when the failure recurs
- which negative fixture, live route, or real incident represents the failure
  class

If the change only asks Codex to be more careful, it is not enough.
