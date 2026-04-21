# Tenant Auth Foundation Implementation Blueprint

## Summary

- Feature:
  `tenantAuth`
- Capability:
  shared non-root authentication with reusable principals, tenant access
  grants, server-backed sessions, and session-based active tenant selection
- Scope:
  backend feature slice only
- Phase:
  pre-implementation blueprint

## Inputs

- Capability matrix reference:
  [2026-04-09-tenant-auth-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-09-tenant-auth-foundation-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-09-tenant-auth-foundation-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-09-tenant-auth-foundation-capability-matrix-first-draft-notes.md)
- PRD:
  [2026-04-09-0009-tenant-auth-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-09-0009-tenant-auth-foundation.md)
- ADR(s):
  - [0009-separate-authentication-from-business-features.md](/home/gordon/kanbien/docs/architecture/adr/0009-separate-authentication-from-business-features.md)
  - [0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md](/home/gordon/kanbien/docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md)
  - [0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md](/home/gordon/kanbien/docs/architecture/adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md)
- PRD test-case doc:
  [2026-04-09-0009-tenant-auth-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-09-0009-tenant-auth-foundation-test-cases.md)
- Journey inventory:
  [2026-04-09-0009-tenant-auth-foundation-journey-inventory.md](/home/gordon/kanbien/docs/prd/journey_inventories/2026-04-09-0009-tenant-auth-foundation-journey-inventory.md)

## QA Coverage Classification

- Coverage matrix guide:
  [qa-coverage-matrix-guide.md](/home/gordon/kanbien/docs/architecture/guides/qa-coverage-matrix-guide.md)
- QA release gate:
  [QA-RELEASE-GATE.md](/home/gordon/kanbien/docs/standards/QA-RELEASE-GATE.md)
- Change-class classification:
  - auth, session, credential, or recovery flow
  - authorization and tenant-isolation sensitive workflow
  - persistence schema and durable workflow change
  - shared platform seam change for tenant-side auth/session behavior
- Required layers from the matrix:
  - unit
  - integration
  - end-to-end journey
  - security
  - audit
  - persistence-backed verification
- Additional required checks:
  - structured exploratory QA
  - deny-path review
  - migration safety review
- Current non-functional posture for this slice:
  - performance:
    not a primary gate for the foundation slice
  - resilience/failure-injection:
    review required when external providers or retry-sensitive dependencies are
    introduced later; not primary in this backend-only foundation
  - concurrency/idempotency:
    should be reviewed for bootstrap-proof reuse and session/selection
    mutation idempotency where implementation reaches that level
  - compatibility/contract:
    API contract stability matters and should be reflected in source-
    independent route contracts even before dedicated contract suites exist

## QA Release-Gate Expectations

For this slice, the default blocking posture should be:

- zero open `critical`
- zero open `high`
- zero flaky blocking-suite tests
- full pass of required unit, integration, security, audit, persistence-backed,
  and `Tier 0`/`Tier 1` end-to-end suites before production by default

Required curated summary once this slice is implemented and gated:

- one source-controlled test summary under
  `docs/workspace/test-run-summaries/`
  for the blocking feature-loop or release gate

Required structured exploratory QA artifact once this slice is implemented:

- a short exploratory note covering:
  - onboarding truthfulness
  - tenant-selection truthfulness
  - deny behavior for deleted principal and deleted tenant paths
  - session revocation and stale-session behavior

## Scope Confirmation

This blueprint is for one coherent backend slice:

- add a new `tenantAuth` feature under `src/features/tenantAuth/`
- introduce a shared non-root auth principal model
- bootstrap one shared principal from one verified active `tenantAdmin`
- persist one durable `tenantAccessGrant` for each principal-to-tenant-subject
  relationship
- provide public routes for:
  - principal bootstrap
  - initial password setup
  - password login
- provide authenticated tenant-session routes for:
  - current session read
  - available tenant-context list
  - active tenant selection
  - logout
- create server-backed tenant sessions
- auto-select the active tenant when exactly one context exists
- require explicit tenant selection when multiple contexts exist
- keep contracts frontend-ready without building frontend UI now

This blueprint does **not** include:

- forgot-password reset
- MFA
- broader tenant-user CRUD
- self-service profile editing
- browser-shell implementation
- cookie transport finalization
- advanced session/device management
- general invitation flows beyond verified tenant-admin bootstrap
- tenant role-assignment UI or tenant-user management surfaces

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states to support later:
  - onboarding required
  - invalid credentials
  - authenticated with one auto-selected tenant
  - authenticated with tenant selection required
  - invalid or expired session
- Permission visibility behavior:
  later frontend should treat tenant-auth routes as:
  - public for bootstrap/setup/login
  - authenticated for session read, tenant listing, tenant selection, and
    logout
- Session / expiry behavior:
  tenant-side sessions are server-backed in this slice and must return enough
  session metadata for a later browser shell to initialize safely
- Browser security considerations:
  keep contracts compatible with later browser-cookie transport, but do not
  require browser-shell work or cookie finalization now

## Backend Plan

- Public route(s):
  - `POST /v1/tenant-admin-verification/redeem`
  - `POST /v1/tenant-auth/password/setup`
  - `POST /v1/tenant-auth/login/password`
- Protected operator dependency route(s):
  - `POST /v1/tenants/:tenantId/admins/:tenantAdminId/onboarding/restart`
- Authenticated route(s):
  - `GET /v1/tenant-auth/session`
  - `GET /v1/tenant-auth/tenant-contexts`
  - `POST /v1/tenant-auth/tenant-selection`
  - `POST /v1/tenant-auth/logout`
- Request/response/error contract:
  - verification redemption accepts:
    - one single-use tenant-admin verification token
  - verification redemption returns:
    - verified tenant-admin summary
    - reusable tenant-auth onboarding payload
    - `PASSWORD_SETUP_REQUIRED` or `LOGIN_REQUIRED` next-step hint
  - protected onboarding restart returns:
    - the same reusable tenant-auth onboarding payload shape for already
      verified tenant-admins
  - password setup accepts:
    - single-use bootstrap/onboarding proof
    - `newPassword`
    - `repeatPassword`
  - password setup returns:
    - password-set confirmation
    - `LOGIN_REQUIRED` next-step hint
  - login accepts:
    - `email`
    - `password`
  - login returns one of:
    - `ONBOARDING_REQUIRED`
    - `AUTHENTICATED_SINGLE_TENANT`
    - `AUTHENTICATED_SELECTION_REQUIRED`
  - session read returns:
    - principal summary
    - active tenant context when present
    - available tenant contexts
    - `selectionRequired`
    - session metadata
  - tenant list returns deterministic context summaries
  - tenant selection accepts:
    - `tenantId`
  - logout accepts:
    - no body
  - use repo-standard validation/auth error shape and stable feature-owned
    codes such as:
    - `TENANT_ADMIN_VERIFICATION_TOKEN_INVALID`
    - `TENANT_AUTH_PRINCIPAL_ALREADY_EXISTS`
    - `TENANT_AUTH_PASSWORD_ALREADY_SET`
    - `TENANT_AUTH_ONBOARDING_REQUIRED`
    - `TENANT_AUTH_INVALID_CREDENTIALS`
    - `TENANT_AUTH_SESSION_INVALID`
    - `TENANT_AUTH_TENANT_SELECTION_REQUIRED`
    - `TENANT_AUTH_TENANT_NOT_ACCESSIBLE`
- Feature-local files expected:
  - `src/features/tenantAuth/index.ts`
  - `src/features/tenantAuth/integration.ts`
  - `src/features/tenantAuth/README.md`
  - `src/features/tenantAuth/contract/errors.ts`
  - `src/features/tenantAuth/contract/schemas.ts`
  - `src/features/tenantAuth/contract/types.ts`
  - capability-focused domain files, likely:
    - `provisionTenantAuthForVerifiedSubject.ts`
    - `setInitialPassword.ts`
    - `loginWithPassword.ts`
    - `readCurrentSession.ts`
    - `listTenantContexts.ts`
    - `selectTenantContext.ts`
    - `logoutSession.ts`
  - `src/features/tenantAuth/domain/presenters.ts`
  - `src/features/tenantAuth/domain/types.ts`
  - `src/features/tenantAuth/domain/service.ts`
  - `src/features/tenantAuth/persistence/types.ts`
  - `src/features/tenantAuth/persistence/repository.ts`
  - `src/features/tenantAuth/persistence/postgresRepository.ts`
  - `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
  - `src/features/tenantAuth/transport/router.ts`
- Cross-feature seams:
  - `tenantAdmins` public seam for verified source-actor lookup and later
    source-actor eligibility checks
  - `tenants` public seam for tenant display and visible-tenant resolution
  - shared platform security middleware for:
    - public-sensitive route protection on bootstrap/setup/login
    - authenticated tenant-session route protection on session read, tenant
      list, tenant selection, and logout
  - shared password hashing utilities or auth-safe library seam if one already
    exists
  - do not import `tenantAdmins/persistence/*` or `tenants/persistence/*`
    directly
- Authorization enforcement point:
  no tenant RBAC evaluation in this slice yet; enforce through:
  - valid bootstrap proof
  - valid tenant session
  - tenant-access ownership checks on selection and session state

## Repo File Layout Plan

- add a mounted feature under `src/features/tenantAuth/`
- follow the same feature shape used by `rootAuth`, `tenantAdmins`, and
  `notificationDelivery`
- keep `integration.ts` responsible for composing:
  - Postgres repository
  - `tenantAdmins` public seam dependency
  - `tenants` public seam dependency
  - password-hash helper dependency
  - domain service
  - transport router
- export a narrow public seam from `src/features/tenantAuth/index.ts` so later
  tenant authorization, tenant-user, and password-recovery slices can consume
  authenticated principal or session state safely without reaching into
  persistence or transport internals
- keep session and credential ownership inside the feature rather than moving
  it to `tenantAdmins`

## Integration Wiring Plan

- extend
  [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts)
  to mount `createTenantAuthFeature(...)` under `/tenant-auth`
- keep bootstrap/setup/login public, but place them behind the shared
  public-sensitive throttling posture
- keep session read, tenant list, tenant selection, and logout behind the
  shared authenticated tenant-session boundary once the feature introduces it
- if the repo does not yet have reusable non-root session middleware, add it
  as part of this slice without disturbing existing `rootAuth` behavior
- add or update any central auth context helpers needed so later tenant-scoped
  features can resolve:
  - `authPrincipalId`
  - tenant session identity
  - current active `tenantId` when selected

## Persistence Plan

- Entities / rows affected:
  - new durable `tenant_auth_principal` table
  - new durable `tenant_password_credential` table
  - new durable `tenant_access_grant` table
  - new durable `tenant_session` table
- Durable principal fields expected:
  - `auth_principal_id` UUID primary key
  - `login_email`
  - `normalized_login_email`
  - `password_state`
  - `created_at`
  - `updated_at`
  - `disabled_at` nullable
- Durable password-credential fields expected:
  - `tenant_password_credential_id` UUID primary key
  - `auth_principal_id` foreign key
  - `password_hash`
  - `password_set_at`
  - `created_at`
  - `updated_at`
- Durable tenant-access-grant fields expected:
  - `tenant_access_grant_id` UUID primary key
  - `auth_principal_id` foreign key
  - `tenant_id` foreign key
  - `subject_type`
  - `subject_id`
  - `created_at`
  - `updated_at`
  - `revoked_at` nullable
- Durable tenant-session fields expected:
  - `tenant_session_id` UUID primary key
  - `auth_principal_id` foreign key
  - `active_tenant_id` nullable
  - `selection_required`
  - `created_at`
  - `expires_at`
  - `revoked_at` nullable
  - optional minimal client metadata if the repo already persists it safely
- Migration changes:
  - create the four durable tenant-auth tables
  - persist normalized login email explicitly
  - persist one active password credential per principal
  - persist durable principal-to-tenant-subject linkage
  - persist active selected tenant on the session
  - keep the model open to future actor types by storing `subject_type` and
    `subject_id` explicitly on the grant
- Index or uniqueness changes:
  - primary keys on all four tables
  - unique global active `normalized_login_email` on principal rows
  - unique active password credential per principal
  - unique active `(auth_principal_id, tenant_id, subject_type, subject_id)` on
    access grants
  - lookup indexes on:
    - `auth_principal_id`
    - `tenant_id`
    - `subject_type`
    - `subject_id`
    - session `expires_at`
    - session `revoked_at`
- Search/filter implications:
  - no broad list/search surface is required in v1
  - login and exact session access are the only approved read paths in this
    slice
- Compatibility notes:
  - do not store password material on `tenant_admin`
  - do not make `tenant_admin` the authenticated session owner
  - preserve room for later password reset and broader tenant-user onboarding

## Test Plan

- Unit tests under:
  - `tests/unit/tenantAuth/`
- Integration tests under:
  - `tests/integration/tenantAuth/`
- Security tests under:
  - `tests/security/tenantAuth/`
- Audit tests under:
  - `tests/audit/tenantAuth/`
- Expected coverage:
  - verified source-actor bootstrap
  - password setup
  - login outcomes:
    - onboarding required
    - single-tenant auto-select
    - multi-tenant selection required
  - session read
  - tenant selection
  - logout
  - invalid credentials
  - invalid bootstrap proof
  - inaccessible tenant selection
  - audit visibility across bootstrap/login/selection/logout
- Shared test seams likely needed:
  - verified tenant-admin bootstrap fixture
  - principal/grant fixture helpers
  - tenant-session fixture helpers

## Source-Independent Artifact Plan

- API contract doc:
  add `docs/api-contracts/tenant-auth.md`
- OpenAPI:
  update `docs/swagger/openapi.yaml`
- Postman:
  add `docs/postman/collections/tenantAuth.postman_collection.json`
- Feature doc:
  add `docs/featureDocs/tenantAuth-feature.md`
- Data dictionary:
  add entries for:
  - `tenant_auth_principal`
  - `tenant_password_credential`
  - `tenant_access_grant`
  - `tenant_session`
- Permission mappings:
  no tenant RBAC capability surface is expected in this first auth slice, but
  update architecture docs if shared authenticated tenant-session boundaries
  introduce enduring policy semantics
- AI review note:
  expected if implementation remains materially AI-assisted

## Maintained-Artifacts Sweep Plan

- Check for standards or status docs affected by:
  - new non-root authentication processor/data model
  - new credential and session handling
  - new privacy or retention implications for tenant-side identity
- Check whether rebuild-readiness docs need updates for:
  - new runtime env vars
  - new bootstrap steps
  - new helper scripts or local auth flows
- Check whether older tenant-admin planning docs need wording updates once
  shared tenant auth is implemented

## Main Guardrails During Implementation

- do not smuggle tenant role assignment, membership management, or tenant-user
  CRUD into this slice
- do not collapse shared principal identity into `tenantAdmins`
- do not hard-code one-principal-one-tenant
- do not silently copy root-only SSH or administrative credential-exception
  behavior into tenant auth
- do not make tenant selection depend on tenant-admin-only response fields
- keep server-backed session semantics additive and compatible with later
  browser transport review
