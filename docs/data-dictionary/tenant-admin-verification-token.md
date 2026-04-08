# Tenant Admin Verification Token

## Summary

- Description: Feature-owned durable verification token record for tenant-admin
  email verification.
- Owning feature: `tenantAdmins`
- Primary source tables or records:
  `tenant_admin_verification_token`, `TenantAdminVerificationTokenRecord`

## Storage Model

- Primary table or durable record: `tenant_admin_verification_token`
- Related durable records:
  `tenant_admin`, `outbound_email`
- Primary key: `tenant_admin_verification_token_id`
- Foreign key relationships:
  - `tenant_admin_id` references `tenant_admin.tenant_admin_id`
  - `outbound_email_id` optionally references `outbound_email.email_id`

## Fields

- `tenant_admin_verification_token_id`
  Type / Shape: `UUID`
  Description: Stable feature-owned token-row identifier.
  Constraints / Notes: Primary key.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `tenant_admin_id`
  Type / Shape: `UUID`
  Description: Owning tenant-admin subject.
  Constraints / Notes: Required foreign key.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `token_id`
  Type / Shape: `UUID`
  Description: Durable token identifier embedded in the opaque raw token.
  Constraints / Notes: Required and unique.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`,
  `src/lib/tokens/oneTimeToken.ts`
- `purpose`
  Type / Shape: `'email_verification'`
  Description: Bounded workflow purpose.
  Constraints / Notes: Checked in storage.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `secret_hash`
  Type / Shape: `TEXT`
  Description: SHA-256 hash of the token secret component.
  Constraints / Notes: Raw token secret is not stored durably.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`,
  `src/lib/tokens/oneTimeToken.ts`
- `expires_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Token expiry time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `used_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Token redemption marker.
  Constraints / Notes: Nullable. Set on successful verification redemption.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `invalidated_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Invalidation marker for superseded or no-longer-eligible tokens.
  Constraints / Notes: Nullable. Set when resend, email change, or delete invalidates earlier tokens.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`,
  `src/features/tenantAdmins/domain/service.ts`
- `outbound_email_id`
  Type / Shape: `UUID | NULL`
  Description: Correlated outbound-email thread when verification delivery occurred.
  Constraints / Notes: Nullable so token issuance can remain feature-owned even before delivery succeeds.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `requested_by_actor_type`
  Type / Shape: `TEXT`
  Description: Actor category that initiated issuance.
  Constraints / Notes: Current implementation uses `root_user`.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `requested_by_actor_id`
  Type / Shape: `TEXT`
  Description: Actor identifier that initiated issuance.
  Constraints / Notes: Current implementation stores root-user ID.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Token-row creation time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`

## Lifecycle Semantics

- State or lifecycle rule: Only one active verification token should remain eligible for a tenant admin at a time.
  Meaning: New sends and resends invalidate prior active tokens before issuing a fresh one.
  Source: `src/features/tenantAdmins/domain/service.ts`
- State or lifecycle rule: Verification-token mechanics are shared but workflow ownership is feature-local.
  Meaning: `tenantAdmins` owns subject linkage, invalidation, and redemption side effects while `src/lib/tokens` owns parsing and secret verification.
  Source: `docs/architecture/adr/0017-add-a-shared-one-time-token-library-for-feature-owned-verification-flows.md`,
  `src/features/tenantAdmins/domain/service.ts`
