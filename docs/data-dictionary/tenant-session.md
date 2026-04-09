# Tenant Session

## Summary

- Description: Server-backed authenticated session for one shared tenant auth
  principal.
- Owning feature: `tenantAuth`
- Primary source tables or records:
  `tenant_session`, `TenantSessionRecord`

## Storage Model

- Primary table or durable record: `tenant_session`
- Related durable records: `tenant_auth_principal`, `tenant`
- Primary key: `session_id`
- Foreign key relationships:
  - `auth_principal_id` references `tenant_auth_principal.auth_principal_id`
  - `active_tenant_id` references `tenant.tenant_id` when present

## Fields

- `session_id`
  Type / Shape: `UUID`
  Description: Opaque bearer-session identifier.
  Constraints / Notes: Primary key and current bearer token value.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `auth_principal_id`
  Type / Shape: `UUID`
  Description: Principal that owns the session.
  Constraints / Notes: Required foreign key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `active_tenant_id`
  Type / Shape: `UUID | NULL`
  Description: Currently selected tenant context.
  Constraints / Notes: Nullable when tenant selection is still required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `selection_required`
  Type / Shape: `BOOLEAN`
  Description: Whether the session still requires explicit tenant selection.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `authenticated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Session creation/authentication time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `expires_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Session expiry time.
  Constraints / Notes: Required. Derived from `TENANT_AUTH_SESSION_TTL_SECONDS`.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`,
  `src/config/env.ts`
- `revoked_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Revocation marker.
  Constraints / Notes: `NULL` means still eligible if other active-session
  rules pass.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`

## Indexes And Constraints

- `tenant_session_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `session_id`.
  Why It Matters: The session token is the durable server-side lookup key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `ix_tenant_session_auth_principal_active`
  Type: `other`
  Definition / Rule: Active-session lookup index by `auth_principal_id`.
  Why It Matters: Supports principal-scoped session reads and future revocation
  workflows.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `ix_tenant_session_expiry`
  Type: `other`
  Definition / Rule: Expiry-oriented secondary index on `expires_at`.
  Why It Matters: Supports active-session filtering and later maintenance jobs.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`

## Lifecycle Semantics

- State or lifecycle rule: active-session lookup requires `revoked_at IS NULL`,
  `expires_at > NOW()`, and an enabled principal.
  Meaning: expired, revoked, or disabled-principal sessions do not
  authenticate.
  Source: `src/features/tenantAuth/persistence/postgresRepository.ts`,
  `src/lib/auth/middleware.ts`
- State or lifecycle rule: session read may self-heal active-tenant selection
  when exactly one currently accessible tenant context remains.
  Meaning: session state stays aligned with current access rather than blindly
  preserving stale active-tenant values.
  Source: `src/features/tenantAuth/domain/service.ts`

## Mutation Semantics

- Mutation rule: password login inserts a new session row.
  Effect on stored fields: creates one durable authenticated session with
  either an auto-selected tenant or `selection_required = true`.
  Source: `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- Mutation rule: explicit tenant selection updates `active_tenant_id` and clears
  `selection_required`.
  Effect on stored fields: session becomes bound to the chosen tenant context
  until later context changes.
  Source: `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- Mutation rule: logout sets `revoked_at = COALESCE(revoked_at, NOW())`.
  Effect on stored fields: session is durably revoked while preserving the
  original revocation time on repeated logout/revoke attempts.
  Source: `src/features/tenantAuth/persistence/postgresRepository.ts`

## Cross-Feature Read Seams

- Exported seam: `TenantAuthSessionLookupRepository.findActiveSessionById`
  Consumer: shared tenant-session middleware and, through it, protected
  tenant-auth routes
  Allowed read shape: active session record with `session_id`,
  `auth_principal_id`, `active_tenant_id`, `selection_required`,
  `authenticated_at`, and `expires_at`
  Source: `src/features/tenantAuth/persistence/repository.ts`,
  `src/lib/auth/middleware.ts`

## Related Errors

- `INVALID_SESSION`
  Message: inferred middleware error
  Field: `Authorization` header or session token
  Reason: inferred
  When It Happens: shared tenant-session middleware rejects a missing, expired,
  revoked, unknown, or disabled-principal session.
  Source: `src/lib/auth/middleware.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- `UNAUTHORIZED`
  Message: inferred middleware error
  Field: `Authorization` header
  Reason: inferred
  When It Happens: protected tenant-auth request omits a usable bearer token.
  Source: `src/lib/auth/middleware.ts`

## Source

- `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `src/features/tenantAuth/domain/service.ts`
- `src/lib/auth/middleware.ts`
