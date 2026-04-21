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
