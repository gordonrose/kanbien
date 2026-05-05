# Tenant Auth Policy

## Summary

- Description: Tenant-scoped password-policy override record used to resolve the
  effective tenant auth policy.
- Owning feature: `tenantConfiguration`
- Primary source tables or records:
  `tenant_auth_policy`, `TenantAuthPolicyRecord`

## Storage Model

- Primary table or durable record: `tenant_auth_policy`
- Related durable records:
  `tenant`, `tenant_session`
- Primary key: `tenant_id`
- Foreign key relationships:
  `tenant_id -> tenant.tenant_id`

## Fields

- `tenant_id`
  Type / Shape: `UUID`
  Description: Owning tenant identifier.
  Constraints / Notes: Primary key and foreign key to `tenant`.
  Source: `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`
- `min_length`, `max_length`, `min_uppercase`, `max_uppercase`, `min_lowercase`, `max_lowercase`, `min_numbers`, `max_numbers`, `min_symbols`, `max_symbols`
  Type / Shape: `INTEGER | NULL`
  Description: Tenant-specific override bounds for password composition rules.
  Constraints / Notes: `NULL` means inherit the system default for that field.
  Source: `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`,
  `src/features/tenantConfiguration/domain/policy.ts`
- `session_ttl_seconds`
  Type / Shape: `INTEGER | NULL`
  Description: Tenant-specific override for new tenant-session expiry in
  seconds.
  Constraints / Notes: `NULL` means inherit the platform default. Current hard
  bounds are `300` through `2592000`.
  Source:
  `src/features/tenantConfiguration/persistence/migrations/0012_add_session_ttl_to_tenant_auth_policy.sql`,
  `src/features/tenantConfiguration/domain/policy.ts`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time the tenant override row was first created.
  Constraints / Notes: Required.
  Source: `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time the tenant override row was last changed.
  Constraints / Notes: Required. Refreshed on every successful update.
  Source: `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`,
  `src/features/tenantConfiguration/persistence/postgresRepository.ts`

## Indexes And Constraints

- `tenant_auth_policy_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `tenant_id`.
  Why It Matters: Enforces one durable auth-policy override row per tenant.
  Source: `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`

## Mutation Semantics

- Mutation rule: updates replace the stored override columns for the target
  tenant.
  Effect on stored fields: the tenant's effective auth policy changes
  immediately for later reads and policy-aware tenant-auth flows, including the
  tenant-session TTL used for newly created sessions.
  Source: `src/features/tenantConfiguration/domain/service.ts`,
  `src/features/tenantConfiguration/persistence/postgresRepository.ts`

## Cross-Feature Read Seams

- Exported seam: `TenantAuthPolicyResolver`
  Consumer: `tenantAuth`
  Allowed read shape: effective tenant policy and aggregate shared-principal
  password policy resolution plus aggregate shared-principal session TTL
  resolution

## Compliance Classification And Governance

- Data classification: confidential platform metadata with access-control or actor-context relevance
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Tenant Auth Policy is documented as owned by `tenantConfiguration` with source record(s) `tenant_auth_policy`, `TenantAuthPolicyRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `TENANT_AUTH_POLICY_INVALID`
  Message: The tenant auth policy is missing one or more required bounds or violates the platform policy rules.
  Field: policy-specific
  Reason: validation specific
  When It Happens: a requested tenant override falls below platform floors,
  breaks a min/max pair, creates an impossible aggregate composition, or sets
  an unsupported tenant session TTL.
  Source: `src/features/tenantConfiguration/contract/errors.ts`,
  `src/features/tenantConfiguration/domain/policy.ts`
