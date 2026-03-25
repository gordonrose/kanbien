# System Overview

## Summary

The platform is currently a small TypeScript/Node.js backend built on Express
and PostgreSQL.
It follows a feature-bundle architecture with explicit platform integration.

Today the system has:

- one Express application
- one versioned API router under `/v1`
- two mounted features: `rootUsers` and `rootAuth`
- one shared PostgreSQL connection pool
- one migration runner that discovers feature-scoped SQL migrations

## Runtime Shape

### Startup

- `src/server.ts` verifies database connectivity before the server starts
- `src/app.ts` creates the Express app and mounts the versioned router
- `src/routes/v1/index.ts` mounts feature routers explicitly

### Request Flow

1. Requests enter the Express app in `src/app.ts`.
2. Requests are routed under `/v1`.
3. `src/routes/v1/index.ts` dispatches to explicitly registered feature routers.
4. Auth-protected routes pass through shared bearer-session middleware.
5. Feature transport code validates input and invokes feature services.
6. Feature services use repositories to talk to PostgreSQL.
7. Known feature errors are converted to JSON near the feature boundary.
8. Unknown errors fall through to the app-level JSON error middleware.

## Source Layout

### Platform

- `src/app.ts`
  Express app setup and global fallback error middleware.
- `src/server.ts`
  Startup entry point.
- `src/routes/v1/index.ts`
  Versioned route registration.
- `src/config/env.ts`
  Required environment parsing.
- `src/lib/db.ts`
  Shared PostgreSQL pool and connectivity check.
- `src/scripts/migrate.ts`
  Migration discovery and execution.
- `src/lib/auth/*`
  Shared root-session middleware and request auth context.

### Features

Each feature lives under `src/features/<featureName>`.

The active examples are `src/features/rootUsers` and `src/features/rootAuth`.
Each feature follows the same internal structure:

- `contract/`
  API-facing schemas, request/response types, and feature errors.
- `domain/`
  business logic and use-case orchestration.
- `persistence/`
  repository interfaces, DB types, and PostgreSQL implementation.
- `transport/`
  Express router and request handling.
- `integration.ts`
  feature entry point for platform wiring.
- `index.ts`
  exported public surface for the feature bundle.

### Feature Anatomy And Naming Discipline

Features are expected to split distinct units of utility into clear
capabilities rather than combining unrelated behavior into one module.

The current feature convention is:

- Platform-owned concerns remain outside the feature.
  Shared `dbPool`, environment loading, migration execution, and platform route
  registration stay in platform code.
- `contract/types.ts`
  Defines API-facing request and response types only.
  Prefer capability-oriented names such as
  `<CapabilityName>Request`, `<CapabilityName>Response`, and
  `<CapabilityName>Params`.
- `contract/schemas.ts`
  Exports first-class request validation schemas, including query schemas, body
  schemas, and params schemas.
  Exact route params must never be optional.
  List or search schemas must be separate from exact lookup schemas.
- `contract/errors.ts`
  Defines feature error classes with application error codes and HTTP status.
- `domain/types.ts`
  Defines domain entities and post-validation capability input and result types.
- `domain/<capabilityName>.ts`
  Implements one clear business capability per file.
  Exact lookup and list or search behavior must not be combined in the same
  capability.
- `domain/service.ts`
  Composes capabilities behind a feature service.
- `persistence/types.ts`
  Defines DB-facing record shapes and explicit persistence inputs.
- `persistence/repository.ts`
  Defines the repository seam using domain-safe inputs and explicit filter,
  sorting, pagination, and scope rules.
- `persistence/postgresRepository.ts`
  Implements the repository against PostgreSQL using injected shared
  infrastructure.
- `persistence/migrations/*.sql`
  Owns feature schema objects and must follow the shared migration runner
  conventions.
- `transport/router.ts`
  Defines the feature router and request handling.
- `integration.ts`
  Exports `create<FeatureName>Feature` and wires feature dependencies into the
  router.
- `index.ts`
  Re-exports the feature's public entry point.

This structure is intended to keep feature internals replaceable while making
feature creation repeatable.

### Authentication Shape

The current authentication layer is implemented as a feature rather than as
business logic embedded into `rootUsers`.

Current auth model:

- `rootAuth` owns root-user auth principals, SSH public keys, login challenges,
  sessions, and auth audit events
- `rootUsers` remains authoritative for root-user lifecycle state
- root-user authentication is password plus SSH proof
- authenticated requests use opaque bearer tokens backed by server-side session
  records
- request authentication is separate from future authorization and scope checks

## Integration Model

The architecture is optimized for adding new features with minimal platform
touchpoints, but not with automatic runtime discovery.

The current pattern is:

1. Create a new feature bundle under `src/features/<featureName>`.
2. Expose a clear feature entry point from that feature's `index.ts`.
3. Mount the feature explicitly in `src/routes/v1/index.ts`.
4. If the feature owns persistence, place SQL migrations under that feature's
   `persistence/migrations/` folder.
5. Update tests and public API artifacts for externally visible behavior.

Router registration remains explicit:

- app
- v1 router
- feature router

A feature folder alone is not considered integrated until it is mounted.

This keeps feature development fast while preserving explicit platform control.

## Data And Migrations

- The platform uses one shared PostgreSQL database connection pool.
- Features may own their own schema objects and SQL migrations.
- `src/scripts/migrate.ts` recursively scans `src/features/**/migrations/*.sql`.
- Migration identity is based on the migration file's relative path.
- Because identity is path-based, renaming a migration file changes how the
  runner sees it.

## API Conventions

- API routes are versioned under `/v1`.
- Health is exposed at `GET /v1/health`.
- Feature routes are mounted under a stable base path such as `/v1/root-users`.
- JSON is the default request and response format.
- Validation and domain errors should produce structured JSON responses.
- Unexpected failures should produce a generic JSON internal error response.
- Authenticated protected routes use bearer token transport with server-side
  session lookup.

## Current Strengths

- simple platform bootstrap
- explicit feature registration
- strong feature locality
- separate authentication feature and shared auth context seam
- feature-scoped migrations
- fail-fast environment and database startup checks

## Current Constraints

- route registration is manual rather than discoverable
- error handling is partly feature-local and partly app-global
- migration identity depends on path stability
- full authorization and scope evaluation are not yet implemented

## Near-Term Architectural Focus

The next stage of the architecture should preserve the current strengths while
hardening the shared seams:

- keep feature addition cheap
- avoid hidden coupling between features
- standardize error handling and API documentation patterns
- keep authentication reusable as a platform seam for later authorization work
- protect migration stability as more features are added
- expand tests around platform integration seams
