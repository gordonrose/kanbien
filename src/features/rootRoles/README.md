# Root Roles

The `rootRoles` feature owns durable system root-role definitions, role grants,
and root-user role assignments.

It is the first executable slice of the platform authorization architecture.

It provides:

- system root-role CRUD with protected-role safety rules
- durable root-role-to-capability grant management
- durable root-user-to-root-role assignment management
- effective root-permission inspection
- the shared root capability checker used by protected `rootAuth` and
  `rootUsers` routes

Persistence is owned by:

- `root_authz_capabilities`
- `system_root_roles`
- `system_root_role_capability_grants`
- `root_user_role_assignments`
- `root_role_audit_events`

The feature currently seeds and protects `RootUserAdmin` as the bootstrap
platform operator role.
