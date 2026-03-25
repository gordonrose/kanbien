# ADR-0006: Standardize Feature-Internal Module Conventions

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform already uses a feature-bundle architecture, but feature bundles can
still drift internally if their module roles and naming conventions are left
implicit. That kind of drift makes autonomous changes riskier and makes new
features harder to add consistently.

## Decision

Standardize the internal structure and naming discipline used inside feature
bundles.

Current expectations:

- platform-owned concerns such as shared `dbPool`, environment loading,
  migration execution, and top-level route registration remain outside the
  feature
- `contract/types.ts` defines API-facing request, response, and params types
- `contract/schemas.ts` exports first-class query, body, and params schemas for
  request validation
- `contract/errors.ts` defines feature error classes with app codes and HTTP
  status
- `domain/types.ts` defines domain entities and post-validation capability input
  and result types
- `domain/<capabilityName>.ts` implements one clear business capability per file
- `domain/service.ts` composes capabilities behind the feature service
- `persistence/types.ts` defines DB-facing record types and persistence inputs
- `persistence/repository.ts` defines the repository seam with explicit filter,
  sorting, pagination, and scope contracts
- `persistence/postgresRepository.ts` implements the repository against
  PostgreSQL using injected shared infrastructure
- `transport/router.ts` defines HTTP routing and request handling
- `integration.ts` defines the feature factory used by the platform
- `index.ts` re-exports the feature's public entry point

Additional rules:

- contract code must not define DB record types
- domain input types must be post-validation, not raw transport strings
- exact lookup and list or search capabilities must remain separate
- exact route params must never be optional
- query schemas are first-class exports, not route-local details

## Consequences

### Positive

- feature creation becomes more repeatable
- naming and file-role discipline reduces drift across features
- Codex and other contributors can move faster inside clearer boundaries

### Negative

- feature authors have less freedom to improvise local structures
- some edge cases may need exceptions if the conventions prove too rigid

### Neutral / Follow-up

- these conventions should guide new features by default, not force unnatural
  abstractions
- if the platform adopts shared helpers for contracts or repositories later,
  this ADR can be superseded with a more evolved convention set
