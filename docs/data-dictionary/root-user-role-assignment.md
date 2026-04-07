# Root User Role Assignment

## Summary

- Description: Durable assignment of one system root role to one root user.
- Owning feature: `rootRoles`
- Primary source tables or records: `root_user_role_assignments`

## Storage Model

- Primary table or durable record: `root_user_role_assignments`
- Related durable records: `root_users`, `system_root_roles`,
  `root_role_audit_events`
- Primary key: `root_user_role_assignment_id`

## Fields

- `root_user_role_assignment_id`
  Type / Shape: `UUID`
- `root_user_id`
  Type / Shape: `UUID`
- `system_root_role_id`
  Type / Shape: `UUID`
- `assigned_by_root_user_id`
  Type / Shape: `UUID`
- `assigned_reason`
  Type / Shape: `TEXT | NULL`
- `assigned_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
- `unassigned_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
- `unassigned_by_root_user_id`
  Type / Shape: `UUID | NULL`
- `unassigned_reason`
  Type / Shape: `TEXT | NULL`

## Indexes And Constraints

- `uq_root_user_role_assignments_active_root_user_role`
  Type: `partial unique`
  Definition / Rule: Unique on `(root_user_id, system_root_role_id)` where
  `unassigned_at IS NULL`.
- `ix_root_user_role_assignments_active_root_user`
  Type: `other`
  Definition / Rule: Active assignment reads by `root_user_id`.
- `ix_root_user_role_assignments_active_role`
  Type: `other`
  Definition / Rule: Active assignment reads by `system_root_role_id`.

## Lifecycle Semantics

- Active assignments have `unassigned_at IS NULL`.
- Unassignment is a durable lifecycle transition, not hard deletion.
- Replacement is modeled as retiring one active assignment and creating another.

## Mutation Semantics

- New assignments take effect immediately in effective-permission reads.
- Unassignment preserves durable history.
- Safety rules prevent leaving a root user with zero roles or the platform with
  zero active `RootUserAdmin` assignments.

## Cross-Feature Read Seams

- Exported seam: effective capability checker
  Consumer: `rootAuth`, `rootUsers`
  Allowed read shape: whether a root user currently has a governing capability

## Migration Compatibility Notes

- Existing eligible root users are backfilled into `RootUserAdmin` assignments
  during `0005_create_root_roles.sql`.
- The same migration also installs the trigger that auto-assigns the bootstrap
  role to newly created eligible root users.
