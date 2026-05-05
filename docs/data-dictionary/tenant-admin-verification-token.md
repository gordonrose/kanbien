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

## Compliance Classification And Governance

- Data classification: confidential security-sensitive data; may include authentication secret material or proof state
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Tenant Admin Verification Token is documented as owned by `tenantAdmins` with source record(s) `tenant_admin_verification_token`, `TenantAdminVerificationTokenRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
