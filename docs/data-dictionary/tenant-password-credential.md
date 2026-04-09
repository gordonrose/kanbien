# Tenant Password Credential

## Summary

- Description: Durable password-credential record for one tenant auth principal.
- Owning feature: `tenantAuth`
- Primary source tables or records:
  `tenant_password_credential`, `TenantPasswordCredentialRecord`

## Storage Model

- Primary table or durable record: `tenant_password_credential`
- Related durable records: `tenant_auth_principal`
- Primary key: `tenant_password_credential_id`
- Foreign key relationships:
  - `auth_principal_id` references `tenant_auth_principal.auth_principal_id`

## Fields

- `tenant_password_credential_id`
  Type / Shape: `UUID`
  Description: Stable credential-row identifier.
  Constraints / Notes: Primary key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `auth_principal_id`
  Type / Shape: `UUID`
  Description: Owning tenant auth principal.
  Constraints / Notes: Required and unique.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `password_hash`
  Type / Shape: `TEXT`
  Description: BCrypt-compatible password hash stored in PostgreSQL.
  Constraints / Notes: Plaintext password is never persisted.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- `password_set_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Timestamp of most recent password set.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last credential mutation time.
  Constraints / Notes: Required. Refreshed on upsert.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`

## Indexes And Constraints

- `tenant_password_credential_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `tenant_password_credential_id`.
  Why It Matters: Gives the credential row a durable identity independent of
  later password rotations.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `tenant_password_credential.auth_principal_id UNIQUE`
  Type: `unique`
  Definition / Rule: At most one current password credential row per principal.
  Why It Matters: Keeps tenant-auth password verification one-to-one with the
  shared principal identity.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`

## Mutation Semantics

- Mutation rule: initial password setup inserts or upserts this record.
  Effect on stored fields: writes a hash of the submitted password and stamps
  `password_set_at`.
  Source: `src/features/tenantAuth/persistence/postgresRepository.ts`

## Related Errors

- `TENANT_AUTH_PASSWORD_SETUP_INVALID`
  Message: That password-setup proof is missing, invalid, or no longer accepted.
  Field: `bootstrapToken`
  Reason: `invalid`
  When It Happens: password setup cannot resolve a still-eligible setup token.
  Source: `src/features/tenantAuth/contract/errors.ts`,
  `src/features/tenantAuth/domain/service.ts`
- `TENANT_AUTH_PASSWORD_ALREADY_SET`
  Message: A password has already been set for that tenant-auth principal.
  Field: `bootstrapToken`
  Reason: `password_already_set`
  When It Happens: password setup is attempted again after the principal has
  already moved to `active`.
  Source: `src/features/tenantAuth/contract/errors.ts`,
  `src/features/tenantAuth/domain/service.ts`

## Source

- `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `src/features/tenantAuth/persistence/postgresRepository.ts`
