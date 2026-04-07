# Root Authz Capability

## Summary

- Description: Durable catalog entry for one root-platform authorization
  capability key.
- Owning feature: `rootRoles`
- Primary source tables or records: `root_authz_capabilities`,
  `RootCapabilityCatalogItem`

## Storage Model

- Primary table or durable record: `root_authz_capabilities`
- Related durable records: `system_root_role_capability_grants`
- Primary key: `capability_key`
- Foreign key relationships: Referenced by
  `system_root_role_capability_grants.capability_key`

## Fields

- `capability_key`
  Type / Shape: `TEXT`
  Description: Stable machine-readable authorization capability key.
- `description`
  Type / Shape: `TEXT`
  Description: Human-readable explanation of the capability.
- `mandatory_for_root_user_admin`
  Type / Shape: `BOOLEAN`
  Description: Whether the capability is mandatory on the protected
  `RootUserAdmin` role.
- `protected_for_root_user_admin`
  Type / Shape: `BOOLEAN`
  Description: Whether the capability is protected on the protected
  `RootUserAdmin` role.
- `created_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Catalog lifecycle timestamps.

## Indexes And Constraints

- `root_authz_capabilities_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `capability_key`.
- No separate uniqueness rule beyond the primary key is required.

## Lifecycle Semantics

- Catalog entries are durable reference records, not ephemeral configuration.
- The current implementation seeds the root capability catalog in migration
  `0005_create_root_roles.sql`.

## Cross-Feature Read Seams

- Exported seam: root capability checker and role capability list routes
  Consumer: `rootAuth`, `rootUsers`, root-role administration routes
  Allowed read shape: capability key presence and human-readable description

## Migration Compatibility Notes

- Rebuild-from-spec should preserve seeded root capability keys because role
  grants and protected-route authz checks depend on exact string identity.
