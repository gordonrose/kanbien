# Tenant Auth Principal

## Summary

- Description: Shared non-root login identity for tenant-side actors.
- Owning feature: `tenantAuth`
- Primary source tables or records:
  `tenant_auth_principal`, `TenantAuthPrincipalRecord`

## Storage Model

- Primary table or durable record: `tenant_auth_principal`
- Related durable records:
  `tenant_password_credential`, `tenant_access_grant`,
  `tenant_password_setup_token`, `tenant_session`
- Primary key: `auth_principal_id`
- Foreign key relationships: none directly on this table; downstream tenant-auth
  records reference this principal as the owning login identity

## Fields

- `auth_principal_id`
  Type / Shape: `UUID`
  Description: Stable shared non-root principal identifier.
  Constraints / Notes: Primary key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `login_email`
  Type / Shape: `TEXT`
  Description: Stored login email.
  Constraints / Notes: Required. Current contract stores lowercase normalized
  email here.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`,
  `src/features/tenantAuth/domain/service.ts`
- `normalized_login_email`
  Type / Shape: `TEXT`
  Description: Canonical login lookup key.
  Constraints / Notes: Required. Unique across active tenant auth principals.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`,
  `src/features/tenantAuth/domain/service.ts`
- `password_state`
  Type / Shape: `'setup_required' | 'active'`
  Description: Credential lifecycle state for the principal.
  Constraints / Notes: Required bounded status for initial onboarding versus
  active login eligibility.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Principal creation time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last principal mutation time.
  Constraints / Notes: Required. Refreshed on credential state changes.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- `disabled_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Principal disable marker.
  Constraints / Notes: Active session lookup excludes disabled principals.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`

## Indexes And Constraints

- `tenant_auth_principal_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `auth_principal_id`.
  Why It Matters: Establishes the durable shared tenant-side identity.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `uq_tenant_auth_principal_active_login_email`
  Type: `partial unique`
  Definition / Rule: Unique on `normalized_login_email` where
  `disabled_at IS NULL`.
  Why It Matters: One login email maps to at most one active tenant-side
  principal even when that principal later holds multiple tenant access grants.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `password_state` check
  Type: `check`
  Definition / Rule: `password_state IN ('setup_required', 'active')`.
  Why It Matters: Prevents silent drift in credential-state semantics.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`

## Normalization And Uniqueness Rules

- Rule: Login email is trimmed and lowercased before principal lookup or
  creation.
  Why It Matters: Principal identity is email-based and must remain globally
  stable across onboarding, login, and later multi-tenant access.
  Source: `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantAuth/contract/schemas.ts`

## Lifecycle Semantics

- State or lifecycle rule: principals bootstrap into `setup_required`.
  Meaning: initial password setup must happen before normal login succeeds.
  Source: `src/features/tenantAuth/domain/service.ts`
- State or lifecycle rule: disabled principals do not authenticate through
  shared tenant-session middleware.
  Meaning: principal lifecycle can invalidate sessions without deleting rows.
  Source: `src/features/tenantAuth/persistence/postgresRepository.ts`,
  `src/lib/auth/middleware.ts`

## Mutation Semantics

- Mutation rule: bootstrap creates a principal only when the normalized login
  email does not already map to an active principal.
  Effect on stored fields: preserves the durable shared identity and lets later
  verified tenant-admin subjects with the same email attach through additional
  access grants rather than duplicate principals.
  Source: `src/features/tenantAuth/domain/service.ts`
- Mutation rule: password setup sets `password_state = 'active'`.
  Effect on stored fields: the principal moves from onboarding-only state to
  login-capable state once durable password credential state exists.
  Source: `src/features/tenantAuth/persistence/postgresRepository.ts`

## Cross-Feature Read Seams

- Exported seam: none yet
  Consumer: n/a
  Allowed read shape: tenant auth currently owns principals internally

## Related Errors

- `TENANT_AUTH_INVALID_CREDENTIALS`
  Message: The email address or password was not accepted.
  Field: `email`
  Reason: `invalid_credentials`
  When It Happens: login email is unknown, disabled, or paired with an invalid
  password.
  Source: `src/features/tenantAuth/contract/errors.ts`,
  `src/features/tenantAuth/domain/service.ts`
- `TENANT_AUTH_NO_TENANT_ACCESS`
  Message: That account does not currently have access to any active tenant context.
  Field: `authPrincipalId`
  Reason: `no_tenant_access`
  When It Happens: principal exists but no currently valid tenant access
  contexts remain at login or session-read time.
  Source: `src/features/tenantAuth/contract/errors.ts`,
  `src/features/tenantAuth/domain/service.ts`

## Source

- `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `src/features/tenantAuth/persistence/postgresRepository.ts`
