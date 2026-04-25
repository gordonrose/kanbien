# System Overview

## Summary

The platform is currently a small TypeScript/Node.js backend built on Express
and PostgreSQL.
It follows a feature-bundle architecture with explicit platform integration.

Today the system has:

- one Express application
- one versioned API router under `/v1`
- fifteen mounted API features: `rootAuth`, `rootRoles`, `rootUsers`,
  `tenantAdmins`, `tenantAuth`, `tenantConfiguration`, `tenants`,
  `webAppHierarchyBuilder`, `webAppPageSettings`, `entityBuilder`,
  `webAppSurfaceDiscovery`, `designSystemCanonicals`,
  `notificationDelivery`, `capabilityContractCatalog`, and `assets`
- one unmounted backend foundation feature: `jobProcessing`
- two mounted browser/frontend route families:
  `/design-system` and `/root-admin`
- one shared PostgreSQL connection pool
- one migration runner that discovers feature-scoped SQL migrations
- one shared platform security layer for headers, rate limiting, and auth abuse
  controls

Frontend current-state detail lives in `docs/architecture/frontend-overview.md`.

## Runtime Shape

### Startup

- `src/server.ts` verifies database connectivity before the server starts
- `src/app.ts` creates the Express app and mounts the versioned router
- `src/routes/v1/index.ts` mounts feature routers explicitly

### Request Flow

1. Requests enter the Express app in `src/app.ts`.
2. Global security middleware applies shared headers and JSON parsing.
3. Browser/frontend route families such as `/design-system` and `/root-admin`
   are mounted explicitly in `src/app.ts`.
4. Versioned API requests are routed under `/v1`.
5. `src/routes/v1/index.ts` applies route-class-specific rate limiting and
   dispatches to explicitly registered feature routers.
6. Auth-protected routes pass through shared bearer-session middleware.
7. Feature transport code validates input and invokes feature services.
8. Feature services use repositories to talk to PostgreSQL.
9. Known feature errors are converted to JSON near the feature boundary.
10. Unknown errors fall through to the app-level JSON error middleware.

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
  Shared root-session and tenant-session middleware plus request auth context.
- `src/lib/security/*`
  Shared rate limiting, lock-down persistence, and root-auth abuse controls.
- `src/lib/tokens/*`
  Shared one-time token mechanics for feature-owned verification and recovery
  workflows.

### Frontend

- `src/frontend/designSystem/*`
  Governed design-system reference, canonical, pattern, and template surfaces.
  Governed app adoption is expected to consume design-system-owned styling,
  render, and interaction seams rather than app-local reconstructions. For
  governed app route families, the page shell itself is also now treated as a
  design-system-owned artifact rather than an app-local host.
- `src/frontend/rootAdminShell/*`
  Same-origin root-admin browser shell and helper-download surface. Current
  state remains locally owned shell structure and styling; accepted target
  architecture is migration toward a design-system-owned page shell for
  non-exception authenticated surfaces.
- `src/frontend/login/*`
  Reserved discovery seam for a later explicit login route family.

See `docs/architecture/frontend-overview.md` for the current frontend runtime,
route-family, and browser-boundary definition.

### Features

Each feature lives under `src/features/<featureName>`.

The active mounted API examples are `src/features/rootAuth`,
`src/features/rootRoles`, `src/features/rootUsers`,
`src/features/tenantAdmins`, `src/features/tenantAuth`,
`src/features/tenantConfiguration`, `src/features/tenants`,
`src/features/webAppHierarchyBuilder`, `src/features/webAppPageSettings`,
`src/features/entityBuilder`, `src/features/webAppSurfaceDiscovery`,
`src/features/designSystemCanonicals`, `src/features/notificationDelivery`,
`src/features/capabilityContractCatalog`, and `src/features/assets`.
The active unmounted backend foundation example is
`src/features/jobProcessing`.
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
  exported public surface for the feature bundle, including any approved
  cross-feature seams.
- the repo maintains generated feature dependency artifacts under
  `docs/architecture/generated/` so humans and automation can inspect current
  cross-feature coupling and private-seam drift quickly.
- each feature also maintains `feature.manifest.json` as the declared record of
  public seams, current downstream dependencies, and feature-specific
  breaking-change risks.

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
  For multi-capability features, this should remain a composition layer rather
  than becoming the only place where all capability logic is implemented.
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
  Re-exports the feature's public entry point and any approved narrow
  cross-feature seams.
- `feature.manifest.json`
  Declares the feature's public seams, current cross-feature dependencies, and
  breaking-change review notes.
- Cross-feature reads should happen through exported feature seams, not by
  importing another feature's private persistence adapter or DB record types.
- Current repo automation checks cross-feature imports against that rule and
  generates a dependency graph for the active feature catalog.

This structure is intended to keep feature internals replaceable while making
feature creation repeatable.

### Authentication Shape

The current authentication layer is implemented as a feature rather than as
business logic embedded into `rootUsers`.

Current auth model:

- `rootAuth` owns root-user auth principals, SSH public keys, login challenges,
  sessions, and auth audit events
- `tenantAuth` owns shared non-root tenant-side principals, password setup,
  password login, tenant sessions, and active tenant selection
- `tenantAdmins` remains authoritative for tenant-admin lifecycle state and
  verification state
- `notificationDelivery` owns outbound email delivery, durable outbound-email
  metadata, sanitized content versions, and attempt history for operator and
  future feature-owned workflows
- `jobProcessing` owns provider-neutral durable asynchronous job request,
  outbox dispatch, worker execution, retry/dead-letter, payload-safety, and
  attempt-history seams; concrete BullMQ adapter integration and operator APIs
  remain deferred
- `rootUsers` remains authoritative for root-user lifecycle state
- `rootAuth` reads root-user sign-in eligibility through an exported
  `rootUsers` auth-state reader rather than `rootUsers` private persistence
  internals
- `tenantAuth` reads verified tenant-admin onboarding proof and subject context
  through an exported `tenantAdmins` auth-bootstrap reader rather than
  `tenantAdmins` private persistence internals
- root-user authentication is password plus SSH proof
- tenant-side authentication is email plus password after verified onboarding
  proof
- authenticated API requests use opaque bearer tokens backed by server-side
  session records
- the root-admin browser shell uses the same server-side sessions through a
  secure HTTP-only cookie transport and a browser bootstrap endpoint
- tenant-side session APIs currently use bearer transport only, but their
  contracts are shaped to stay frontend-ready for a later browser transport
- request authentication is separate from future authorization and scope checks

### Platform Security Shape

The current platform security layer is shared middleware and shared persistence,
not feature-local logic duplicated across routers.

Current platform security model:

- `src/app.ts` applies `helmet` globally, disables `X-Powered-By`, and now
  enforces a least-privilege CSP for the served root-admin browser shell and
  same-origin frontend assets
- route classes such as `public-read`, `public-auth`,
  `authenticated-general`, and `authenticated-sensitive` use shared rate-limit
  middleware
- rate limits are backed by durable PostgreSQL state rather than in-memory
  counters
- root-auth login flows apply additional abuse checks and temporary lock-down
  rules on top of general rate limiting
- repeated failed auth behavior, rate limiting, and temporary lock-downs are
  written as audit-visible events
- the current design leaves room for future tenant-aware rate-limit keys and
  policy selection

## Integration Model

The architecture is optimized for adding new features with minimal platform
touchpoints, but not with automatic runtime discovery.

The current pattern is:

1. Create a new feature bundle under `src/features/<featureName>`.
2. Expose a clear feature entry point from that feature's `index.ts`.
3. Mount the feature explicitly in `src/routes/v1/index.ts`.
4. If the feature owns persistence, place SQL migrations under that feature's
   `persistence/migrations/` folder.
5. If another feature needs a durable cross-feature read, export a narrow seam
   from the owning feature's public surface rather than importing its private
   persistence files.
6. Update tests and public API artifacts for externally visible behavior.

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
- Shared platform security middleware may return `429` JSON responses for rate
  limiting or temporary auth lock-down behavior.
- the same Express app also serves governed browser/frontend route families
  such as `/design-system` and `/root-admin`

## Current Strengths

- simple platform bootstrap
- explicit feature registration
- strong feature locality
- separate authentication feature and shared auth context seam
- shared platform security middleware with durable rate-limit state
- feature-scoped migrations
- fail-fast environment and database startup checks

## Current Constraints

- route registration is manual rather than discoverable
- error handling is partly feature-local and partly app-global
- migration identity depends on path stability
- full authorization and scope evaluation are not yet implemented
- browser CSP must now evolve carefully as the root-admin shell grows because
  the service serves same-origin HTML

## Near-Term Architectural Focus

The next stage of the architecture should preserve the current strengths while
hardening the shared seams:

- keep feature addition cheap
- avoid hidden coupling between features
- standardize error handling and API documentation patterns
- keep authentication reusable as a platform seam for later authorization work
- keep platform hardening reusable as a shared seam for later tenant-aware
  controls
- protect migration stability as more features are added
- expand tests around platform integration seams
