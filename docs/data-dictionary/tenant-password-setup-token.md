# Tenant Password Setup Token

## Summary

- Description: Single-use tenant-auth bootstrap token used to set the first
  password after verified onboarding proof.
- Owning feature: `tenantAuth`
- Primary source tables or records:
  `tenant_password_setup_token`, `TenantPasswordSetupTokenRecord`

## Storage Model

- Primary table or durable record: `tenant_password_setup_token`
- Related durable records: `tenant_auth_principal`, `tenant_admin`
- Primary key: `tenant_password_setup_token_id`
- Foreign key relationships:
  - `auth_principal_id` references `tenant_auth_principal.auth_principal_id`
  - `source_tenant_admin_id` references `tenant_admin.tenant_admin_id`

## Fields

- `tenant_password_setup_token_id`
  Type / Shape: `UUID`
  Description: Stable token-row identifier.
  Constraints / Notes: Primary key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `auth_principal_id`
  Type / Shape: `UUID`
  Description: Tenant auth principal that may use this proof.
  Constraints / Notes: Required foreign key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `source_tenant_admin_id`
  Type / Shape: `UUID`
  Description: Source verified tenant-admin subject that triggered bootstrap.
  Constraints / Notes: Required foreign key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `token_id`
  Type / Shape: `UUID`
  Description: Durable token identifier embedded in the opaque raw token.
  Constraints / Notes: Required and unique.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `purpose`
  Type / Shape: `'password_setup'`
  Description: Bounded workflow purpose.
  Constraints / Notes: Required. Must stay aligned with the shared
  one-time-token purpose contract.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`,
  `src/lib/tokens/types.ts`
- `secret_hash`
  Type / Shape: `TEXT`
  Description: SHA-256 hash of the token secret component.
  Constraints / Notes: Raw setup token material is never stored durably.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `expires_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Expiry time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `used_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Successful consumption marker.
  Constraints / Notes: `NULL` means not yet successfully used.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `invalidated_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Supersession or invalidation marker.
  Constraints / Notes: `NULL` means not superseded.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`

## Indexes And Constraints

- `tenant_password_setup_token_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `tenant_password_setup_token_id`.
  Why It Matters: Gives each issued setup proof durable identity.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `tenant_password_setup_token.token_id UNIQUE`
  Type: `unique`
  Definition / Rule: Unique on `token_id`.
  Why It Matters: Shared token verification resolves the durable setup record
  from the parsed token identifier.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `ix_tenant_password_setup_token_active`
  Type: `other`
  Definition / Rule: Index on `(auth_principal_id, created_at DESC)` where
  `used_at IS NULL AND invalidated_at IS NULL`.
  Why It Matters: Supports invalidating earlier still-active setup tokens when
  a new bootstrap proof is generated.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`

## Lifecycle Semantics

- State or lifecycle rule: only one active password-setup token should remain
  eligible per principal at a time.
  Meaning: bootstrap generation invalidates earlier active setup proofs.
  Source: `src/features/tenantAuth/domain/service.ts`

## Mutation Semantics

- Mutation rule: bootstrap invalidates older eligible setup tokens before
  issuing a new one.
  Effect on stored fields: earlier rows receive `invalidated_at`, while the
  newest row remains the only still-usable setup proof for that principal.
  Source: `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- Mutation rule: successful password setup stamps `used_at`.
  Effect on stored fields: setup proof becomes permanently non-reusable.
  Source: `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`

## Related Errors

- `TENANT_AUTH_PASSWORD_SETUP_EXPIRED`
  Message: That password-setup proof has expired.
  Field: `bootstrapToken`
  Reason: `expired`
  When It Happens: token record exists but shared token verification determines
  it is past `expires_at`.
  Source: `src/features/tenantAuth/contract/errors.ts`,
  `src/features/tenantAuth/domain/service.ts`

## Source

- `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `src/features/tenantAuth/domain/service.ts`
