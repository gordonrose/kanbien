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
  - `profile_picture_asset_id` optionally references `assets.asset_id`

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
- `profile_picture_asset_id`
  Type / Shape: `UUID | NULL`
  Description: Optional ready image asset linked as the tenant-admin profile
  picture.
  Constraints / Notes: Nullable foreign key to `assets.asset_id`. The service
  validates tenant scope, private visibility, image kind, readiness, and
  contextual accessibility before linking.
  Source: `src/features/tenantAdmins/persistence/migrations/0046_add_tenant_admin_profile_picture_asset.sql`,
  `src/features/tenantAdmins/domain/service.ts`
- `profile_picture_alt_text`
  Type / Shape: `TEXT | NULL`
  Description: Contextual alt text for the linked tenant-admin profile picture.
  Constraints / Notes: Required unless `profile_picture_decorative = true`
  when a profile picture asset is linked.
  Source: `src/features/tenantAdmins/persistence/migrations/0046_add_tenant_admin_profile_picture_asset.sql`,
  `src/features/tenantAdmins/domain/service.ts`
- `profile_picture_decorative`
  Type / Shape: `BOOLEAN`
  Description: Explicit decorative posture for the linked tenant-admin profile
  picture.
  Constraints / Notes: Defaults to `false`. Used as the accessibility
  alternative to contextual alt text.
  Source: `src/features/tenantAdmins/persistence/migrations/0046_add_tenant_admin_profile_picture_asset.sql`
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
- `idx_tenant_admin_profile_picture_asset_id`
  Type: `other`
  Definition / Rule: Partial index on `profile_picture_asset_id` where it is
  not null.
  Why It Matters: Supports maintenance and relationship lookups for linked
  profile-picture assets.
  Source: `src/features/tenantAdmins/persistence/migrations/0046_add_tenant_admin_profile_picture_asset.sql`

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

- Exported seam: `createTenantAdminsAuthBootstrapReader`
  Consumer: shared `tenantAuth` feature
  Allowed read shape:
  - consume verification proof through the feature-owned verification-token
    workflow
  - list verified active tenant-admin identity summaries by normalized email
  - exact verified active tenant-admin lookup by ID
  Source: `src/features/tenantAdmins/authBootstrapReader.ts`

## Compliance Classification And Governance

- Data classification: confidential business and identity data; may include personal data or operator/customer contact data
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
- Security relevance: yes: access control, tenant boundary, authentication, or security-sensitive metadata is present
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Tenant Admin is documented as owned by `tenantAdmins` with source record(s) `tenant_admin`, `TenantAdminRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | yes | enforced-in-code | Lifecycle and mutation sections in this page; repository/source references cited above | Normal read paths must exclude soft-deleted rows unless an explicit deleted/read capability is documented. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
