# Tenant

## Summary

- Description: Durable platform tenant record and lifecycle root owned by
  `tenants`.
- Owning feature: `tenants`
- Primary source tables or records: `tenant`, `TenantRecord`

## Storage Model

- Primary table or durable record: `tenant`
- Related durable records:
  `root_authz_capabilities`, `system_root_role_capability_grants`
- Primary key: `tenant_id`
- Foreign key relationships:
  `created_by_root_admin_user_id` references `root_users.root_user_id`

## Capabilities That Rely On This Entity

- Create tenant
  Source: `src/features/tenants/domain/createTenant.ts`
- Get visible tenant by ID
  Source: `src/features/tenants/domain/getTenant.ts`
- List visible tenants
  Source: `src/features/tenants/domain/listTenants.ts`
- Update tenant metadata
  Source: `src/features/tenants/domain/updateTenant.ts`
- Get deleted tenant by ID
  Source: `src/features/tenants/domain/getDeletedTenant.ts`
- List deleted tenants
  Source: `src/features/tenants/domain/listDeletedTenants.ts`
- Soft delete tenant
  Source: `src/features/tenants/domain/softDeleteTenant.ts`
- Reactivate tenant
  Source: `src/features/tenants/domain/reactivateTenant.ts`
- Remove tenant
  Source: `src/features/tenants/domain/removeTenant.ts`

## Fields

- `tenant_id`
  Type / Shape: `UUID`
  Description: Stable tenant identifier.
  Constraints / Notes: Primary key. Remains the durable cross-feature tenant
  identity.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- `biz_id`
  Type / Shape: `TEXT`
  Description: Display-preserved tenant business identifier.
  Constraints / Notes: Required. Stored alongside `normalized_biz_id`; treated
  as immutable after create by the service contract.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`,
  `src/features/tenants/domain/updateTenant.ts`
- `normalized_biz_id`
  Type / Shape: `TEXT`
  Description: Canonical trimmed lowercase tenant business identifier.
  Constraints / Notes: Required. Used for active uniqueness and prefix search.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`,
  `src/features/tenants/persistence/postgresRepository.ts`
- `name`
  Type / Shape: `TEXT`
  Description: Tenant display or business name.
  Constraints / Notes: Required. Not unique. Stored alongside `normalized_name`
  for prefix search.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- `normalized_name`
  Type / Shape: `TEXT`
  Description: Trimmed lowercase tenant name used for prefix search.
  Constraints / Notes: Required.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`,
  `src/features/tenants/persistence/postgresRepository.ts`
- `category`
  Type / Shape: `'customer' | 'demo' | 'test'`
  Description: Durable tenant classification.
  Constraints / Notes: Required. Checked in storage. Mutable only through the
  privileged update path.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- `status`
  Type / Shape: `'draft' | 'live' | 'disabled' | 'inactive'`
  Description: Durable tenant lifecycle or business state.
  Constraints / Notes: Required. Checked in storage. Create defaults to
  `draft`. Soft delete forces visible `inactive`.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`,
  `src/features/tenants/domain/createTenant.ts`,
  `src/features/tenants/persistence/postgresRepository.ts`
- `pre_delete_status`
  Type / Shape: `'draft' | 'live' | 'disabled' | 'inactive' | NULL`
  Description: Preserved prior status used for deterministic reactivation.
  Constraints / Notes: Nullable. Set on soft delete and cleared on
  reactivation.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`,
  `src/features/tenants/persistence/postgresRepository.ts`
- `created_by_root_admin_user_id`
  Type / Shape: `UUID`
  Description: Durable creator attribution to the root user who created the
  tenant.
  Constraints / Notes: Required foreign key to `root_users`. Stamped from the
  authenticated root session rather than client input.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`,
  `src/features/tenants/domain/createTenant.ts`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: Required. Defaults to `NOW()`. Refreshed on update,
  soft delete, and reactivate.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`,
  `src/features/tenants/persistence/postgresRepository.ts`
- `deleted_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Soft-delete marker.
  Constraints / Notes: `NULL` means not soft-deleted. Visible reads exclude
  non-null values. Reactivation clears this field.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`,
  `src/features/tenants/persistence/postgresRepository.ts`

## Indexes And Constraints

- `tenant_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `tenant_id`.
  Why It Matters: Establishes the durable tenant identity used across the
  feature.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- `uq_tenant_normalized_biz_id_active`
  Type: `partial unique`
  Definition / Rule: Unique on `normalized_biz_id` where `deleted_at IS NULL`.
  Why It Matters: Prevents duplicate active business identifier ownership while
  allowing soft-deleted rows to remain durable.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- `category` check
  Type: `check`
  Definition / Rule: `category IN ('customer', 'demo', 'test')`.
  Why It Matters: Keeps tenant classification bounded to approved values.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- `status` check
  Type: `check`
  Definition / Rule: `status IN ('draft', 'live', 'disabled', 'inactive')`.
  Why It Matters: Keeps tenant lifecycle state bounded to approved values.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- `pre_delete_status` check
  Type: `check`
  Definition / Rule:
  `pre_delete_status IN ('draft', 'live', 'disabled', 'inactive')`.
  Why It Matters: Preserved lifecycle state remains bounded to the supported
  tenant status set.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- `ix_tenant_normalized_name`, `ix_tenant_category`, `ix_tenant_status`,
  `ix_tenant_deleted_at`, `ix_tenant_updated_at`
  Type: `other`
  Definition / Rule: Secondary indexes on approved search, lifecycle, and list
  fields.
  Why It Matters: Supports prefix filtering, lifecycle visibility, and paginated
  admin views.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`

## Normalization And Uniqueness Rules

- Rule: `bizId` is trimmed and lowercased into `normalized_biz_id`.
  Why It Matters: Validation, exact collision checks, and active uniqueness all
  depend on the normalized value rather than the display-preserved `biz_id`.
  Source: `src/features/tenants/persistence/postgresRepository.ts`,
  `src/features/tenants/domain/createTenant.ts`
- Rule: `name` is trimmed and lowercased into `normalized_name`.
  Why It Matters: Prefix filtering over tenant names is deterministic and does
  not depend on case or surrounding whitespace.
  Source: `src/features/tenants/persistence/postgresRepository.ts`
- Rule: Only non-deleted rows participate in active `bizId` uniqueness.
  Why It Matters: Soft-deleted tenants do not permanently block reuse, but
  reactivation must still re-check active uniqueness.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`,
  `src/features/tenants/domain/reactivateTenant.ts`

## Lifecycle Semantics

- State or lifecycle rule: Visible tenant reads exclude rows where
  `deleted_at IS NOT NULL`.
  Meaning: Normal API reads and list routes only return active visibility rows.
  Source: `src/features/tenants/persistence/postgresRepository.ts`
- State or lifecycle rule: Soft delete sets `status = 'inactive'`,
  `deleted_at` to a timestamp, and `pre_delete_status` to the prior status.
  Meaning: Deleted rows are durably retained, excluded from normal reads, and
  can later be reactivated with deterministic status restoration.
  Source: `src/features/tenants/persistence/postgresRepository.ts`
- State or lifecycle rule: Reactivate clears `deleted_at`, restores
  `pre_delete_status` into `status`, and clears `pre_delete_status`.
  Meaning: Reactivation is an explicit lifecycle operation rather than a side
  effect of generic update semantics.
  Source: `src/features/tenants/persistence/postgresRepository.ts`
- State or lifecycle rule: Remove hard-deletes the tenant row in the current
  slice.
  Meaning: This is intentionally temporary and must be revisited once
  tenant-owned durable entities exist.
  Source: `src/features/tenants/persistence/postgresRepository.ts`,
  `src/features/tenants/domain/removeTenant.ts`

## Mutation Semantics

- Mutation rule: Create writes both display and normalized identifier columns
  and stamps `created_by_root_admin_user_id`.
  Effect on stored fields: New rows are immediately visible with
  `status = draft` unless another allowed status is supplied.
  Source: `src/features/tenants/domain/createTenant.ts`,
  `src/features/tenants/persistence/postgresRepository.ts`
- Mutation rule: Update only applies to visible rows.
  Effect on stored fields: Only `name`, `category`, and `status` may change and
  `updated_at` is always refreshed.
  Source: `src/features/tenants/domain/updateTenant.ts`,
  `src/features/tenants/persistence/postgresRepository.ts`
- Mutation rule: Soft delete preserves the prior status in
  `pre_delete_status`, sets visible `status = inactive`, sets `deleted_at`, and
  refreshes `updated_at`.
  Effect on stored fields: The row remains durable but is hidden from normal
  visible reads and lists.
  Source: `src/features/tenants/persistence/postgresRepository.ts`
- Mutation rule: Reactivate only applies to deleted rows and re-checks active
  `bizId` uniqueness before restore.
  Effect on stored fields: Clears `deleted_at`, restores the prior status, and
  refreshes `updated_at`.
  Source: `src/features/tenants/domain/reactivateTenant.ts`,
  `src/features/tenants/persistence/postgresRepository.ts`
- Mutation rule: Remove deletes the row entirely after the service confirms the
  tenant exists.
  Effect on stored fields: The durable record is erased, which is why the
  current design treats remove as exceptional and temporary.
  Source: `src/features/tenants/domain/removeTenant.ts`,
  `src/features/tenants/persistence/postgresRepository.ts`

## Cross-Feature Read Seams

- Exported seam:
  none yet
  Consumer:
  n/a
  Allowed read shape:
  n/a
  Source:
  current implementation has no approved tenant cross-feature read seam

## Migration Compatibility Notes

- Note: Migration `0006_create_tenants.sql` introduces both the tenant table
  and the root authz capability registrations for the first tenant slice.
  Why It Matters For Rebuild Or Shared Environments: Rebuild safety requires
  both the table shape and the seeded tenant capability keys to stay aligned
  with runtime authorization behavior.
  Source: `src/features/tenants/persistence/migrations/0006_create_tenants.sql`
- Note: Migration identity is path-based under the shared runner.
  Why It Matters For Rebuild Or Shared Environments: Applied migration file
  names and paths should remain stable; corrections should land as additive new
  migrations rather than edits or renames of `0006_create_tenants.sql`.
  Source: `src/scripts/migrate.ts`,
  `docs/architecture/change-control.md`

## Related Errors

- `INVALID_REQUEST`
  Message: "Your request could not be accepted because one or more fields are
  missing or invalid."
  Field: varies
  Reason: varies
  When It Occurs: request validation rejects malformed IDs, illegal enum
  values, empty strings, or unexpected/system-managed fields.
  Source: `src/features/tenants/contract/errors.ts`,
  `src/features/tenants/transport/router.ts`
- `TENANT_NOT_FOUND`
  Message: "We could not find a tenant with that ID."
  Field: `tenantId`
  Reason: n/a
  When It Occurs: visible, deleted, update, delete, reactivate, or remove
  flows cannot find the expected tenant row.
  Source: `src/features/tenants/contract/errors.ts`,
  `src/features/tenants/domain/*.ts`
- `TENANT_BIZ_ID_ALREADY_EXISTS`
  Message: "That business identifier is already in use by another active tenant."
  Field: `bizId`
  Reason: `duplicate_active_biz_id`,
  `duplicate_active_biz_id_on_reactivation`
  When It Occurs: create or reactivate would violate active normalized business
  identifier uniqueness.
  Source: `src/features/tenants/contract/errors.ts`,
  `src/features/tenants/domain/createTenant.ts`,
  `src/features/tenants/domain/reactivateTenant.ts`
- `TENANT_ALREADY_DELETED`
  Message: "That tenant has already been deleted."
  Field: `tenantId`
  Reason: `already_deleted`
  When It Occurs: soft delete is requested for a tenant that is already
  deleted.
  Source: `src/features/tenants/contract/errors.ts`,
  `src/features/tenants/domain/softDeleteTenant.ts`
- `TENANT_NOT_DELETED`
  Message: "That tenant is not currently deleted."
  Field: `tenantId`
  Reason: `not_deleted`
  When It Occurs: reactivation is requested for a visible tenant row.
  Source: `src/features/tenants/contract/errors.ts`,
  `src/features/tenants/domain/reactivateTenant.ts`
