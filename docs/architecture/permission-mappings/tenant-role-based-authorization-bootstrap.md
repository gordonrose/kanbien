# Tenant Role-Based Authorization Bootstrap Permission Mapping

## Purpose

Capture the initial source-independent permission mapping for the tenant-scoped
role-based authorization architecture.

This is a bootstrap artifact.
It defines the initial forward-looking role and capability expectations for the
tenant-scoped authorization architecture.

It is intentionally not exhaustive for every future business feature, and it is
not the live implemented permission catalog.

The current live mapping catalog remains intentionally limited to the current
implemented root boundary in:

- [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
- [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)

When tenant features are formally specified, their capabilities should be
promoted into the live mapping artifacts through the normal capability
matrix -> PRD/ADR -> mapping -> blueprint loop.

## Mapping Rules

- `rootUser` remains outside tenant authz and manages authorization
  administration as a platform operator.
- tenant-scoped grants are additive by union across assigned roles.
- explicit deny semantics are not used in this phase.
- tenant roles are copied from platform role templates and may later diverge by
  explicit root-user action for that tenant.
- backend remains the authoritative enforcement point.
- frontend visibility should follow the same intended model later, but hidden or
  disabled UI never replaces backend checks.

## Initial Role Templates

- `tenant_admin`
  Tenant-wide administrative role for managing tenant users, memberships, and
  tenant-wide business operations allowed by the feature capability catalog.
- `team_owner`
  Team-scoped management role for team membership and team-owned resources.
- `team_member`
  Normal team participant role with primarily own/team read and constrained
  write behavior.

## Root-Only Administrative Capabilities

| Feature | Capability | Allowed Roles | Minimum Role | Denied Roles | Frontend Visibility Rule | Backend Enforcement Rule | Audit Role Capture |
|---|---|---|---|---|---|---|---|
| `authorization` | `authorization.platform-role-template.create` | `rootUser` | `rootUser` | `N/A` | show only in root-admin authorization management surfaces | central authorization seam plus root-user-only backend guard | yes |
| `authorization` | `authorization.platform-role-template.update` | `rootUser` | `rootUser` | `N/A` | show only in root-admin authorization management surfaces | central authorization seam plus root-user-only backend guard | yes |
| `authorization` | `authorization.platform-role-template.copy-to-tenant` | `rootUser` | `rootUser` | `N/A` | show only in root-admin authorization management surfaces | central authorization seam plus root-user-only backend guard | yes |
| `authorization` | `authorization.tenant-role.update` | `rootUser` | `rootUser` | `N/A` | show only in root-admin authorization management surfaces | central authorization seam plus root-user-only backend guard | yes |
| `authorization` | `authorization.tenant-role.assign` | `rootUser` | `rootUser` | `N/A` | show only in root-admin authorization management surfaces | central authorization seam plus root-user-only backend guard | yes |
| `authorization` | `authorization.tenant-role.unassign` | `rootUser` | `rootUser` | `N/A` | show only in root-admin authorization management surfaces | central authorization seam plus root-user-only backend guard and last-admin safety rule | yes |
| `authorization` | `authorization.effective-access.read` | `rootUser` | `rootUser` | `N/A` | show only in root-admin authorization management surfaces | central authorization seam plus root-user-only backend guard | yes |

## Initial Tenant Runtime Capabilities

| Feature | Capability | Allowed Roles | Minimum Role | Denied Roles | Frontend Visibility Rule | Backend Enforcement Rule | Audit Role Capture |
|---|---|---|---|---|---|---|---|
| `tenantUsers` | `tenant.user.create` | `tenant_admin` | `tenant_admin` | `N/A` | show only to tenant admins in current tenant context | central authorization seam `can(...)` check in tenant context | yes |
| `tenantUsers` | `tenant.user.read.own` | `tenant_admin, team_owner, team_member` | `team_member` | `N/A` | show own-profile surfaces to all tenant members | central authorization seam `scope(...)` or `can(...)` check in tenant context | yes |
| `tenantUsers` | `tenant.user.read.team` | `tenant_admin, team_owner` | `team_owner` | `N/A` | show team-member listings only where team scope is present | central authorization seam `scope(...)` with dynamic team relation evaluation | yes |
| `tenantUsers` | `tenant.user.read.tenant` | `tenant_admin` | `tenant_admin` | `N/A` | show tenant-wide user management views only to tenant admins | central authorization seam `scope(...)` with tenant scope | yes |
| `tenantUsers` | `tenant.user.update.own` | `tenant_admin, team_owner, team_member` | `team_member` | `N/A` | show own-edit actions for all tenant members where business rules permit | central authorization seam `can(...)` or `scope(...)` check in tenant context | yes |
| `tenantUsers` | `tenant.user.update.team` | `tenant_admin, team_owner` | `team_owner` | `N/A` | show team-member edit actions only to team owners or tenant admins | central authorization seam `can(...)` with dynamic team relation evaluation | yes |
| `tenantUsers` | `tenant.user.update.tenant` | `tenant_admin` | `tenant_admin` | `N/A` | show tenant-wide edit actions only to tenant admins | central authorization seam `can(...)` in tenant context | yes |
| `tenantUsers` | `tenant.user.remove.tenant` | `tenant_admin` | `tenant_admin` | `N/A` | show tenant-wide remove actions only to tenant admins | central authorization seam `can(...)` plus tenant safety/business rules | yes |
| `teams` | `team.member.read.team` | `tenant_admin, team_owner, team_member` | `team_member` | `N/A` | show team member listings only inside current team surfaces | central authorization seam `scope(...)` with dynamic team relation evaluation | yes |
| `teams` | `team.member.assign` | `tenant_admin, team_owner` | `team_owner` | `N/A` | show membership assignment actions only to team owners or tenant admins | central authorization seam `can(...)` with dynamic team relation evaluation | yes |
| `teams` | `team.member.remove` | `tenant_admin, team_owner` | `team_owner` | `N/A` | show membership removal actions only to team owners or tenant admins | central authorization seam `can(...)` with dynamic team relation evaluation and safety rules | yes |

## Notes

- this mapping is the bootstrap set, not the full future catalog
- future features should register capabilities in the global capability catalog
  rather than inventing local ad hoc strings
- read/list capabilities should prefer explicit scope-bearing names where the
  scope matters to backend enforcement
- add allow and deny-path tests for each protected capability, even though
  explicit deny-role semantics are not part of the authorization model
- safety rules such as protected bootstrap roles and last-admin protection are
  enforced in the management backend, not only in UI
