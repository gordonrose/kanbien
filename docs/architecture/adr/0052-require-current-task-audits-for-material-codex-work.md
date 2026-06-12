# ADR-0052: Require Current Task Audits For Material Codex Work

- Status: Accepted
- Date: 2026-06-12
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

The trust harness already requires Codex to discover the evidence boundary
before claiming closure on governed work. In practice, Codex can still start
patching from memory, narrow the edit surface after the fact, or use completion
language before the evidence record is visible.

That failure mode is especially risky for harness and governance work because
the repo relies on executable gates, skills, ADRs, and workspace trust docs to
keep autonomous changes bounded.

ADR-0051 requires material harness-governance decisions to be recorded as ADRs
when they change evidence requirements, harness authority, incomplete-work
classification, or how a known Codex failure mode becomes impossible or loud.

## Decision

Require a visible current-task audit at:

- `docs/workspace/trust-harness/current-task-audit.md`

The file is a single-active-task artifact, not a running log. It must contain
exactly one `## Preflight Contract` section and exactly one
`## Post-Work Closure Record` section. Historical records belong under
`docs/workspace/trust-harness/audit-history/` or another approved history
location.

Before governed/material edits, the audit must record the task summary, mode,
governing sources, task risk class, discovered evidence boundary, intended edit
boundary, allowed files, explicitly out-of-scope files, required verification
commands, and allowed closure vocabulary.

After material work, the same file must record actual files edited, evidence
collected, commands run and results, missing or inferred evidence, whether user
confirmation is still required, and the final permitted closure state.

`npm run git:preflight` is the earliest pre-edit guardrail for this audit. The
repo-governance harness remains authoritative for focused executable fixture
coverage. These gates must fail or report loudly when:

- material governed paths are changed without a current task audit
- the current audit contains duplicate active preflight or closure sections
- changed material paths fall outside the declared edit boundary
- changed material paths hit explicitly out-of-scope paths
- detectable completion language appears without sufficient recorded evidence

Current-task audit validation is additive to existing git preflight behavior.
It must not mask or downgrade dirty-state blocking such as `DIRTY_BLOCK`.

## Trust Delta

This decision makes the following Codex default failure modes loud:

- starting material governed edits without a visible pre-edit contract
- allowing stale duplicate records to satisfy required current-audit fields
- widening the actual edit set beyond the declared task boundary
- using completion language when the audit has not recorded evidence

The earliest enforcing gate is:

```sh
npm run git:preflight
```

Focused fixture coverage remains in:

```sh
npm run check:repo-governance-harness
```

Negative fixtures under `tests/fixtures/repoGovernance/currentTaskAudit/`
represent missing-audit, duplicate-section, stale-duplicate-field,
outside-boundary, out-of-scope, and completion-without-evidence failure
classes.

## Consequences

### Positive

- The evidence boundary is visible before material edits begin.
- Future reviewers can compare intended edit scope against actual changed
  files.
- The trust harness no longer depends only on Codex remembering to narrate
  closure discipline.
- Dirty preflight remains strict while audit violations become visible earlier.

### Negative

- Material tasks carry one more maintained workspace artifact.
- A dirty worktree may need an explicitly acknowledged baseline so the gate can
  distinguish pre-existing changes from the current task's edit boundary.
- Current-task history must be moved intentionally instead of accumulated in
  place.

### Neutral / Follow-up

- This audit does not replace Product Discovery, Technical Steering, Story
  Breakdown, Task Breakdown, ADRs, PRDs, or feature manifests.
- The audit is a current-task record, not a permanent source of product or
  architecture truth.
- The gate can detect repository state and audit text, but it cannot inspect
  every final chat response. Completion-language enforcement is therefore
  limited to language recorded in the audit or other future machine-readable
  closure artifacts.
