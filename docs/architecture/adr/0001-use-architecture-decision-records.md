# ADR-0001: Use Architecture Decision Records

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The repository is beginning to establish durable architectural patterns around
feature structure, platform integration, migrations, and error handling.
Without a decision log, those choices are easy to forget or accidentally
re-litigate during future changes.

## Decision

Use Architecture Decision Records in `docs/architecture/adr/` to capture
important architectural decisions and their trade-offs.

An ADR is expected when:

- a shared platform seam changes
- a lasting architectural pattern is introduced
- a public cross-cutting contract changes
- an existing architectural decision is intentionally replaced

## Consequences

### Positive

- architectural intent remains visible as the code evolves
- contributors and Codex have a stable place to look before changing shared seams
- historical trade-offs stay reviewable

### Negative

- maintainers must keep ADRs current
- some changes will require extra documentation work

### Neutral / Follow-up

- ADRs do not replace code comments, tests, or system-overview documentation
- later ADRs may supersede earlier ones when the architecture changes
