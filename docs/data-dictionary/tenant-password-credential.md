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

## Compliance Classification And Governance

- Data classification: confidential security-sensitive data; may include authentication secret material or proof state
- Privacy / PII relevance: yes: sensitive operational metadata may reveal actor or access context
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Tenant Password Credential is documented as owned by `tenantAuth` with source record(s) `tenant_password_credential`, `TenantPasswordCredentialRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

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
