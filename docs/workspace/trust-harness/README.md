# Codex Trust Harness

This workspace project exists to make Codex's default failure mode visible,
bounded, and eventually executable.

## North Star

The harness should make material Codex work trustworthy enough that corrections
are rare because the process fails closed before overclaiming.

Target posture:

- Codex does not choose its own evidence boundary for material work.
- The relevant runtime, source, data, or artifact surface is discovered before
  evidence is declared sufficient.
- Required evidence is mapped from the task risk class, not improvised from the
  nearest code change.
- Missing evidence blocks completion language.
- Harness changes make a real failure mode impossible or loud.

The governing override is:

- `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
- `codex-trust-override.md`

The visible per-task audit is:

- `current-task-audit.md`

The durable decision to record material harness-governance changes as ADRs is:

- `docs/architecture/adr/0051-log-harness-governance-decisions-as-adrs.md`

## Default Failure Model

Codex's dangerous default mode is to narrow the task to the nearest objective,
select an incomplete proof boundary, satisfy that boundary, and then describe
the narrowed result as if it proved the whole user-visible or system-visible
truth.

This can happen across:

- frontend rendered surfaces
- backend/API contracts
- persistence and migrations
- auth, tenant, and security boundaries
- documentation and artifact alignment
- tests, harnesses, and governance work

The trust harness must not rely on Codex remembering to be careful. It should
make careless narrowing fail a command, block a gate, or force a residual-risk
statement.

## Current Task Audit

Before material governed work starts, Codex must create or update
`docs/workspace/trust-harness/current-task-audit.md`.

The file is the visible pre-edit contract for the current task. It is not a
running log. It must contain exactly one `## Preflight Contract` section and
exactly one `## Post-Work Closure Record` section.

Move historical records to:

- `docs/workspace/trust-harness/audit-history/`

The active preflight contract must record:

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

After material work, Codex must update the same file with:

- actual files edited
- evidence collected
- commands run and results
- missing or inferred evidence
- whether user confirmation is still required
- final permitted closure state

The pre-edit git guardrail validates the current task audit through:

```sh
npm run git:preflight
```

This check is additive. It must not mask or downgrade existing dirty-state
blocking such as `DIRTY_BLOCK`.

The repo-governance harness also validates the current task audit through:

```sh
npm run check:repo-governance-harness
```

These gates must fail loudly when governed/material paths are changed without a
current task audit, when the current audit has multiple active task records,
when changed material paths fall outside the declared edit boundary, when
changed material paths hit explicitly out-of-scope paths, or when completion
language is recorded without evidence where the audit can detect it.

## Operating Rule

For material work, Codex must identify:

- the governing instruction source
- the task risk class
- the discovered surface of risk
- the required evidence
- what remains unchecked
- the allowed closure state

The trust override applies before Codex's normal completion drive:

- `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
- `codex-trust-override.md`

Do not accept "fixed", "done", "ready", "working", or equivalent closure when
the relevant evidence contract is incomplete.

Allowed incomplete states include:

- `candidate fix`
- `implementation-only`
- `partially verified`
- `blocked on runtime verification`
- `pending user confirmation`

## First Implementation Track

The first implementation track is frontend trust hardening:

- `frontend-visual-trust-contract.md`

That contract is required for governed frontend-visible proof work and should
be enforced through the `41-front-end` harness before broader repo-wide risk
classes are automated.
