# Root Role Capability Grant

## Summary

- Description: Durable assignment of one authz capability to one system root
  role.
- Owning feature: `rootRoles`
- Primary source tables or records: `system_root_role_capability_grants`

## Storage Model

- Primary table or durable record: `system_root_role_capability_grants`
- Related durable records: `system_root_roles`, `root_authz_capabilities`
- Primary key: `system_root_role_capability_grant_id`

## Fields

- `system_root_role_capability_grant_id`
  Type / Shape: `UUID`
- `system_root_role_id`
  Type / Shape: `UUID`
- `capability_key`
  Type / Shape: `TEXT`
- `is_mandatory`
  Type / Shape: `BOOLEAN`
- `is_protected`
  Type / Shape: `BOOLEAN`
- `created_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
- `revoked_at`
  Type / Shape: `TIMESTAMPTZ | NULL`

## Indexes And Constraints

- `uq_system_root_role_capability_grants_role_capability`
  Type: `unique`
  Definition / Rule: Unique on `(system_root_role_id, capability_key)`.
- `ix_system_root_role_capability_grants_active_role`
  Type: `other`
  Definition / Rule: Secondary index for active grants by role and capability
  where `revoked_at IS NULL`.

## Lifecycle Semantics

- Active grants have `revoked_at IS NULL`.
- Replaced grant sets revoke obsolete rows rather than deleting history.
- Protected and mandatory flags become part of the durable grant contract for a
  role.

## Mutation Semantics

- Bulk replacement updates or revokes rows to converge to the desired grant set.
- Protected `RootUserAdmin` identity rules prevent removal of required grants.

## Migration Compatibility Notes

- Seeded `RootUserAdmin` grants are created during migration
  `0005_create_root_roles.sql`.
- Rebuild-from-spec must preserve protected/mandatory semantics, not only
  capability membership.
