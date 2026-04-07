# System Root Role

## Summary

- Description: Durable definition of a system root role such as
  `RootUserAdmin`.
- Owning feature: `rootRoles`
- Primary source tables or records: `system_root_roles`, `RootRoleRecord`

## Storage Model

- Primary table or durable record: `system_root_roles`
- Related durable records: `system_root_role_capability_grants`,
  `root_user_role_assignments`, `root_role_audit_events`
- Primary key: `system_root_role_id`

## Fields

- `system_root_role_id`
  Type / Shape: `UUID`
  Description: Stable role identifier.
- `role_key`
  Type / Shape: `TEXT`
  Description: Stable machine key for the role.
- `normalized_role_key`
  Type / Shape: `TEXT`
  Description: Canonical lookup/uniqueness form of `role_key`.
- `display_name`
  Type / Shape: `TEXT`
  Description: Editable display label.
- `description`
  Type / Shape: `TEXT`
  Description: Editable operator-facing description.
- `is_protected`
  Type / Shape: `BOOLEAN`
  Description: Indicates whether the role is protected by platform safety
  rules.
- `created_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Role lifecycle timestamps.
- `deactivated_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Null when the role is assignable; non-null when retired from
  future assignment.

## Indexes And Constraints

- `system_root_roles_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `system_root_role_id`.
- `uq_system_root_roles_normalized_role_key_active`
  Type: `partial unique`
  Definition / Rule: Unique active `normalized_role_key` where
  `deactivated_at IS NULL`.
- `ix_system_root_roles_updated_at`
  Type: `other`
  Definition / Rule: Secondary index on `updated_at DESC`.

## Normalization And Uniqueness Rules

- `role_key` is normalized into `normalized_role_key` for durable lookup and
  active-role uniqueness.
- Deactivated roles preserve durable identity and historical assignments while
  no longer blocking future recreation/reactivation logic beyond the active-key
  rule.

## Lifecycle Semantics

- A role may be active/assignable or deactivated/not assignable.
- Deactivation preserves history and current assignments.
- Reactivation restores assignable status.
- Protected roles participate in additional safety checks.

## Mutation Semantics

- Create persists a new role with `deactivated_at = NULL`.
- Update may change `display_name` and `description`, but not `role_key`.
- Deactivate sets `deactivated_at` and `updated_at`.
- Reactivate clears `deactivated_at` and refreshes `updated_at`.

## Migration Compatibility Notes

- `RootUserAdmin` is seeded as the protected bootstrap role in
  `0005_create_root_roles.sql`.
- Rebuild-from-spec must preserve the protected bootstrap role and its durable
  identity semantics.
