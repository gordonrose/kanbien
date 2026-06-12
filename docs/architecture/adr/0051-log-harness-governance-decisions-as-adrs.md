# ADR-0051: Log Harness Governance Decisions As ADRs

- Status: Accepted
- Date: 2026-06-11
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

The repository increasingly relies on harnesses, skills, executable audits,
rendered proofs, and evidence gates to decide whether Codex-assisted work is
trustworthy.

Those harness decisions can be as consequential as runtime architecture
decisions. A weak harness can let Codex overclaim, accept incomplete evidence,
or advance governed work past a gate that should have failed closed.

Before this decision, ADRs were described primarily as architecture records.
That left an ambiguity: important harness-governance changes could be recorded
only in workspace notes, skill files, or tests, even when they changed the
repo's trust model.

## Decision

Record material harness-governance decisions as ADRs in
`docs/architecture/adr/`.

A harness ADR is required when a change materially affects:

- what evidence is required before governed work may advance
- which harness gate, skill, audit, or rendered proof is authoritative
- how Codex or maintainers classify incomplete, partially verified, or blocked
  work
- how a known failure mode is made impossible, executable, or loud
- whether a harness change changes allowed behavior across multiple future
  tasks

Harness ADRs do not replace the operative harness artifacts. The executable or
procedural source of truth still belongs in the relevant skill, gate, test,
script, template, or standards document.

The ADR captures why the harness rule exists, what trust boundary it changes,
and what trade-offs future maintainers should preserve or intentionally
supersede.

## Consequences

### Positive

- Harness changes gain the same durable decision trail as architecture changes.
- Future Codex sessions and maintainers have a stable place to inspect why a
  trust gate exists before weakening or bypassing it.
- Workspace notes remain useful for active iteration, while accepted harness
  decisions become part of the repo's durable decision history.
- The Codex trust harness can evolve through explicit, reviewable decisions
  instead of accumulating hidden process rules.

### Negative

- Significant harness changes now carry documentation overhead.
- The ADR directory now covers both runtime architecture and harness
  governance, so ADR titles and context must stay clear about which kind of
  decision is being recorded.

### Neutral / Follow-up

- Existing harness notes do not automatically become ADRs; promote them when a
  decision changes durable trust posture.
- This ADR does not make every test or checklist change ADR-worthy. The change
  must materially alter the evidence boundary, authority model, or future
  allowed behavior.
- The operative trust override remains in
  `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md` and
  `docs/workspace/trust-harness/codex-trust-override.md`.
