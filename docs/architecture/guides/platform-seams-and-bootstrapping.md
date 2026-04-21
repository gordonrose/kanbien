# Platform Seams And Bootstrapping Guide

## Purpose

Define the platform-owned seams that every feature and vertical slice must fit
into.

This guide is intended to make the application recoverable from specs and
repeatable to extend without hidden coupling.

## Platform-Owned Entry Points

Platform seams are currently owned by:

- `src/server.ts`
  process startup and fail-fast dependency checks
- `src/app.ts`
  Express app construction, global middleware, and fallback error handling
- `src/routes/v1/index.ts`
  explicit versioned route registration
- `src/config/env.ts`
  environment parsing and required configuration
- `src/lib/*`
  shared infrastructure and cross-cutting behavior

## Rules

### 1. Keep platform seams explicit

- Features must not self-register through hidden discovery.
- Shared middleware order must be easy to find in one place.
- Platform bootstrap must stay deterministic and reviewable.

### 2. Keep the platform thin

- Platform code should orchestrate shared infrastructure.
- Feature-specific business logic must not migrate into platform bootstrap or
  route registration files.
- Shared infrastructure should stay generic and reusable.

### 3. Shared middleware belongs at known layers

Use platform-level middleware for:

- secure-by-default headers
- request parsing
- global error fallback
- route-class-based shared rate limiting
- request auth-context establishment

Do not bury cross-cutting behavior inside feature routers unless the behavior is
feature-specific.

### 4. Startup must fail fast

Before serving traffic, verify critical dependencies such as:

- required environment values
- database connectivity
- required shared runtime dependencies introduced by the current design

## Feature Integration Pattern

When adding a new feature:

1. create `src/features/<featureName>/`
2. create and maintain `feature.manifest.json`
3. expose a feature entry point from `index.ts`
4. wire dependencies in `integration.ts`
5. mount the feature explicitly in `src/routes/v1/index.ts`
6. regenerate `docs/architecture/generated/feature-dependency-graph.*`
7. update docs, tests, and externally visible artifacts

`feature.manifest.json` should declare:

- the feature's public seams exported through `index.ts`
- the feature's current cross-feature dependencies
- feature-specific breaking-change risk notes

## Build-From-Spec Expectations

A spec-driven implementation is not complete until it declares:

- which platform entry points are affected
- whether startup behavior changes
- which shared middleware layers are involved
- whether a new enduring platform seam is introduced
- whether an ADR is required under `docs/architecture/adr/`

## Documentation Rule

When platform seams change:

- update `docs/architecture/system-overview.md`
- update `docs/architecture/priniciples.md` if guardrails change
- add or supersede an ADR if the pattern is enduring

When runnable local setup, startup order, or helper-tool requirements change,
also update:

- `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md`
- `docs/architecture/build-from-spec-reconstruction-questionnaire.md` when the
  change adds a new interchangeable tool or deployer-local choice
