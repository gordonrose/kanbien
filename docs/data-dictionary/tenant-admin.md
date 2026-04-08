# Tenant Admin

## Summary

- Description: Durable tenant-scoped admin profile record owned by
  `tenantAdmins`.
- Owning feature: `tenantAdmins`
- Primary source tables or records: `tenant_admin`, `TenantAdminRecord`

## Storage Model

- Primary table or durable record: `tenant_admin`
- Related durable records:
  `tenant`, `root_users`, `tenant_admin_verification_token`
- Primary key: `tenant_admin_id`
- Foreign key relationships:
  - `tenant_id` references `tenant.tenant_id`
  - `created_by_root_admin_user_id` references `root_users.root_user_id`

## Capabilities That Rely On This Entity

- Create tenant admin
  Source: `src/features/tenantAdmins/domain/service.ts`
- Get tenant admin
  Source: `src/features/tenantAdmins/domain/service.ts`
- List tenant admins
  Source: `src/features/tenantAdmins/domain/service.ts`
- Update tenant-admin profile
  Source: `src/features/tenantAdmins/domain/service.ts`
- Send and resend tenant-admin verification email
  Source: `src/features/tenantAdmins/domain/service.ts`
- Redeem tenant-admin verification token
  Source: `src/features/tenantAdmins/domain/service.ts`
- Soft delete and reactivate tenant admin
  Source: `src/features/tenantAdmins/domain/service.ts`

## Fields

- `tenant_admin_id`
  Type / Shape: `UUID`
  Description: Stable tenant-admin identifier.
  Constraints / Notes: Primary key.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `tenant_id`
  Type / Shape: `UUID`
  Description: Owning tenant identifier.
  Constraints / Notes: Required foreign key to `tenant`.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `email`
  Type / Shape: `TEXT`
  Description: Display-preserved tenant-admin email address.
  Constraints / Notes: Required. Stored lowercase under the current contract.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`,
  `src/features/tenantAdmins/domain/service.ts`
- `normalized_email`
  Type / Shape: `TEXT`
  Description: Canonical lowercase tenant-admin email.
  Constraints / Notes: Required. Used for active uniqueness.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`,
  `src/features/tenantAdmins/persistence/postgresRepository.ts`
- `first_name`
  Type / Shape: `TEXT | NULL`
  Description: Optional tenant-admin first name.
  Constraints / Notes: Nullable editable profile field.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `last_name`
  Type / Shape: `TEXT | NULL`
  Description: Optional tenant-admin last name.
  Constraints / Notes: Nullable editable profile field.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `email_verification_status`
  Type / Shape: `'pending' | 'verified'`
  Description: Durable verification state for the stored email address.
  Constraints / Notes: Required. Email change, delete, and reactivate can
  return this state to `pending`.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`,
  `src/features/tenantAdmins/domain/service.ts`
- `email_verified_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Timestamp when the current stored email was verified.
  Constraints / Notes: Nullable. Cleared on email change, delete, and
  reactivation.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `last_verification_email_requested_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Most recent verification-email request time.
  Constraints / Notes: Nullable. Refreshed on send and resend.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`,
  `src/features/tenantAdmins/domain/service.ts`
- `created_by_root_admin_user_id`
  Type / Shape: `UUID`
  Description: Root-user actor who created the tenant-admin row.
  Constraints / Notes: Required foreign key to `root_users`.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: Required. Refreshed on update, send metadata stamping,
  verification completion, delete, and reactivate.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`,
  `src/features/tenantAdmins/persistence/postgresRepository.ts`
- `deleted_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Soft-delete marker.
  Constraints / Notes: Normal reads exclude non-null values.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`

## Indexes And Constraints

- `tenant_admin_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `tenant_admin_id`.
  Why It Matters: Establishes durable tenant-admin identity.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `uq_tenant_admin_active_email`
  Type: `partial unique`
  Definition / Rule: Unique on `(tenant_id, normalized_email)` where
  `deleted_at IS NULL`.
  Why It Matters: Prevents duplicate active tenant-admin email ownership within
  a tenant while allowing soft-deleted rows to remain durable.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`

## Normalization And Uniqueness Rules

- Rule: Tenant-admin email is trimmed and stored lowercase.
  Why It Matters: Active uniqueness and exact comparisons rely on the
  normalized value.
  Source: `src/features/tenantAdmins/domain/service.ts`,
  `src/features/tenantAdmins/persistence/postgresRepository.ts`

## Lifecycle Semantics

- State or lifecycle rule: Visible reads exclude rows where `deleted_at IS NOT NULL`.
  Meaning: Normal operator lookups and lists only return active visibility rows.
  Source: `src/features/tenantAdmins/persistence/postgresRepository.ts`
- State or lifecycle rule: Email verification applies to the currently stored email only.
  Meaning: Email changes reset verification state and clear prior verification evidence.
  Source: `src/features/tenantAdmins/domain/service.ts`
- State or lifecycle rule: Reactivation restores the row to visible state but resets verification to `pending`.
  Meaning: Reactivation is truthful about needing a fresh verification pass.
  Source: `src/features/tenantAdmins/domain/service.ts`,
  `src/features/tenantAdmins/persistence/postgresRepository.ts`

## Cross-Feature Read Seams

- Exported seam: pending future consumer seam from `tenantAdmins`
  Consumer: later shared tenant-auth feature
  Allowed read shape: verification-ready tenant-admin identity summary only
  Source: `docs/workspace/implementation-blueprints/2026-04-08-tenant-admins-auth-ready-foundation.md`
