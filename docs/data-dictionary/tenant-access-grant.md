# Tenant Access Grant

## Summary

- Description: Durable linkage between one shared tenant auth principal and one
  tenant-scoped access subject.
- Owning feature: `tenantAuth`
- Primary source tables or records:
  `tenant_access_grant`, `TenantAccessGrantRecord`

## Storage Model

- Primary table or durable record: `tenant_access_grant`
- Related durable records: `tenant_auth_principal`, `tenant`, `tenant_admin`
- Primary key: `tenant_access_grant_id`
- Foreign key relationships:
  - `auth_principal_id` references `tenant_auth_principal.auth_principal_id`
  - `tenant_id` references `tenant.tenant_id`
  - `subject_id` references `tenant_admin.tenant_admin_id` in the current
    slice when `subject_type = 'tenant_admin'`

## Fields

- `tenant_access_grant_id`
  Type / Shape: `UUID`
  Description: Stable access-grant identifier.
  Constraints / Notes: Primary key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `auth_principal_id`
  Type / Shape: `UUID`
  Description: Shared tenant auth principal that owns the access.
  Constraints / Notes: Required foreign key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `tenant_id`
  Type / Shape: `UUID`
  Description: Tenant context reachable through this grant.
  Constraints / Notes: Required foreign key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `subject_type`
  Type / Shape: `'tenant_admin'`
  Description: Current tenant-scoped subject type.
  Constraints / Notes: Kept explicit so future subject types can reuse the
  model without rewriting the contract.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `subject_id`
  Type / Shape: `UUID`
  Description: Tenant-scoped subject record identifier.
  Constraints / Notes: Currently references `tenant_admin.tenant_admin_id`.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Grant creation time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last grant mutation time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `revoked_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Revocation marker.
  Constraints / Notes: `NULL` means the grant is still eligible for
  resolution.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`

## Indexes And Constraints

- `uq_tenant_access_grant_active_subject`
  Type: `partial unique`
  Definition / Rule: Unique on
  `(auth_principal_id, tenant_id, subject_type, subject_id)` where
  `revoked_at IS NULL`.
  Why It Matters: Prevents duplicate active grants for the same shared
  principal into the same tenant-scoped subject.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `ix_tenant_access_grant_auth_principal`
  Type: `other`
  Definition / Rule: Index on `auth_principal_id` for active-grant lookups.
  Why It Matters: Login, session read, and tenant-context listing all begin
  from principal-scoped grant lookup.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`

## Lifecycle Semantics

- State or lifecycle rule: login and session read must re-resolve active tenant
  contexts against current subject and tenant visibility.
  Meaning: durable grants do not override later tenant-admin or tenant
  lifecycle changes.
  Source: `src/features/tenantAuth/domain/service.ts`

## Mutation Semantics

- Mutation rule: bootstrap creates any missing active grants for all verified
  active tenant-admin subjects that share the principal's normalized login
  email.
  Effect on stored fields: the shared principal can accumulate multiple tenant
  contexts over time without changing the login identity.
  Source: `src/features/tenantAuth/domain/service.ts`

## Source

- `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `src/features/tenantAuth/domain/service.ts`

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Tenant Access Grant is documented as owned by `tenantAuth` with source record(s) `tenant_access_grant`, `TenantAccessGrantRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
