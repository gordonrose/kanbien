# ADR-0002: Use Feature Bundle Architecture

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform needs to stay easy to extend as new business capabilities are
added. A file layout organized only by technical layer at the repo root would
make feature work increasingly scattered and would increase coupling between
unrelated parts of the system.

## Decision

Organize business capabilities as feature bundles under `src/features`.

Each feature bundle should own its:

- transport
- contract
- domain
- persistence
- integration entry point

The feature's public integration surface should be exported from the feature's
`index.ts`.

## Consequences

### Positive

- new functionality can be added with mostly feature-local changes
- boundaries between platform code and business code stay clearer
- the architecture scales better as more features are added

### Negative

- some shared patterns may be duplicated until deliberate shared modules are
  introduced
- contributors must avoid reaching across feature boundaries informally

### Neutral / Follow-up

- the platform still owns cross-cutting concerns such as startup, routing,
  environment loading, and shared infrastructure
- feature bundles may evolve internally without changing the platform contract
