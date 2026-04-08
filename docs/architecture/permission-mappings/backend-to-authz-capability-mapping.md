# Backend To Authorization Capability Mapping

## Purpose

Map backend capabilities to the authorization capabilities that govern them.

This document is intentionally explicit about status.
It now carries both:

- the backend/authz mappings the current repo can stand behind today
- approved target mappings for the next specified slice when a PRD has been
  accepted but implementation has not landed yet

That keeps the live baseline visible without losing the next agreed step in the
build-from-spec chain.

For now that means:

- public root-auth entrypoints
- the current root operator role
- the protected `rootAuth`, `rootUsers`, and root-admin browser-shell surface
- the implemented `rootRoles` slice
- the implemented root-only `tenants` administrative slice

## Current Role Baseline

The only explicit role captured here today is:

- `RootUserAdmin`

That role represents the current coarse authenticated root-user operator
boundary implemented by the repo.

## Mapping Rules

- every protected backend capability should map to one explicit authz
  capability
- public login/bootstrap entrypoints may remain public, but should still be
  documented explicitly
- rows marked `current` describe implemented repo truth
- rows marked `target` describe approved PRD-backed next-slice mappings that
  are not yet implemented
- future roles and permissions should still be added through the repo's normal
  specification loop, not predeclared speculatively

## Naming Rules

- `root-auth.*` is reserved for root credential and session management
- `root-user.*` is reserved for root-user lifecycle management
- `root-role.*` is reserved for system root-role definition, grant, and
  assignment management
- `tenant.*` is reserved for root-managed tenant lifecycle and metadata
  administration
- `notification.email.*` is reserved for root-managed outbound email delivery
  and operator-visible metadata retrieval
- `root-admin-shell.*` is reserved for cookie-backed browser-session shell
  behavior
- public entrypoints stay explicitly marked as public entrypoints rather than
  being modeled as normal role-granted capabilities

## Mapping

| Mapping Area | Backend Feature | Backend Capability | Current Status | Governing Authz Capability | Scope Type | Role / Boundary | Notes |
|---|---|---|---|---|---|---|---|
| root public login | `rootAuth` | `startRootUserPasswordLogin` | `current` | `public root login entrypoint` | `n/a` | public unauthenticated caller | password-stage public entrypoint plus abuse controls |
| root public login | `rootAuth` | `completeRootUserSshLogin` | `current` | `public root login entrypoint` | `n/a` | public unauthenticated caller | SSH-stage public entrypoint plus abuse controls |
| root browser login | `rootAdminShell` | `completeRootUserBrowserSshChallenge` | `current` | `public root browser login entrypoint` | `n/a` | public unauthenticated caller | browser SSH completion entrypoint plus abuse controls |
| root auth | `rootAuth` | `createRootAuthPrincipal` | `current` | `root-auth.principal.create` | `can(...)` | `RootUserAdmin` | create root auth principal for a root user |
| root auth | `rootAuth` | `changeRootAuthPassword` | `current` | `root-auth.password.change.own` | `can(...)` | `RootUserAdmin` | current implementation is ownership-scoped |
| root auth | `rootAuth` | `addRootUserSshPublicKey` | `current` | `root-auth.ssh-key.create.own` | `can(...)` | `RootUserAdmin` | current implementation is ownership-scoped |
| root auth | `rootAuth` | `listRootUserSshPublicKeys` | `current` | `root-auth.ssh-key.read.own` | `scope(...) and can(...)` | `RootUserAdmin` | current implementation is ownership-scoped |
| root auth | `rootAuth` | `revokeRootUserSshPublicKey` | `current` | `root-auth.ssh-key.revoke.own` | `can(...)` | `RootUserAdmin` | current implementation is ownership-scoped |
| root auth | `rootAuth` | `listRootUserSessions` | `current` | `root-auth.session.read.own` | `scope(...) and can(...)` | `RootUserAdmin` | current implementation is ownership-scoped |
| root auth | `rootAuth` | `revokeRootUserSession` | `current` | `root-auth.session.revoke.own` | `can(...)` | `RootUserAdmin` | current implementation is ownership-scoped |
| root auth | `rootAuth` | `logoutRootUserSession` | `current` | `root-auth.session.logout.own` | `can(...)` | `RootUserAdmin` | self-logout capability |
| root browser session | `rootAdminShell` | `getRootAdminBrowserSession` | `current` | `root-admin-shell.session.read.own` | `can(...)` | `RootUserAdmin` | cookie-backed browser session summary |
| root browser session | `rootAdminShell` | `logoutRootAdminBrowserSession` | `current` | `root-admin-shell.session.logout.own` | `can(...)` | `RootUserAdmin` | cookie-backed browser logout with trusted-origin rule |
| root users | `rootUsers` | `createRootUser` | `current` | `root-user.create` | `can(...)` | `RootUserAdmin` | create root user |
| root users | `rootUsers` | `getRootUser` | `current` | `root-user.read.visible` | `can(...)` | `RootUserAdmin` | visible-row exact lookup |
| root users | `rootUsers` | `getRootUserByEmail` | `current` | `root-user.read.visible` | `can(...)` | `RootUserAdmin` | exact visible email lookup |
| root users | `rootUsers` | `listRootUsers` | `current` | `root-user.read.visible` | `scope(...) and can(...)` | `RootUserAdmin` | visible root-user listing |
| root users | `rootUsers` | `listActiveRootUsers` | `current` | `root-user.read.active` | `scope(...)` | `RootUserAdmin` | active-only root-user listing |
| root users | `rootUsers` | `listDeletedRootUsers` | `current` | `root-user.read.deleted` | `scope(...)` | `RootUserAdmin` | deleted/anonymized visibility is explicit |
| root users | `rootUsers` | `updateRootUser` | `current` | `root-user.update` | `can(...)` | `RootUserAdmin` | root-user lifecycle update |
| root users | `rootUsers` | `deleteRootUser` | `current` | `root-user.delete` | `can(...)` | `RootUserAdmin` | soft-delete lifecycle action |
| root users | `rootUsers` | `removeRootUser` | `current` | `root-user.remove` | `can(...)` | `RootUserAdmin` | irreversible anonymized remove |
| root users | `rootUsers` | `reactivateRootUser` | `current` | `root-user.reactivate` | `can(...)` | `RootUserAdmin` | restore/reactivation action |
| root roles | `rootRoles` | `createSystemRootRole` | `current` | `root-role.create` | `can(...)` | `RootUserAdmin` | creates durable system root roles |
| root roles | `rootRoles` | `getSystemRootRole` | `current` | `root-role.read` | `can(...)` | `RootUserAdmin` | exact role lookup |
| root roles | `rootRoles` | `listSystemRootRoles` | `current` | `root-role.list` | `scope(...) and can(...)` | `RootUserAdmin` | paginated role listing |
| root roles | `rootRoles` | `updateSystemRootRole` | `current` | `root-role.update` | `can(...)` | `RootUserAdmin` | editable role metadata updates |
| root roles | `rootRoles` | `deleteSystemRootRole` | `current` | `root-role.delete` | `can(...)` | `RootUserAdmin` | deactivation from future assignment |
| root roles | `rootRoles` | `reactivateSystemRootRole` | `current` | `root-role.reactivate` | `can(...)` | `RootUserAdmin` | role reactivation |
| root roles | `rootRoles` | `listSystemRootRoleEligibleAuthzCapabilities` | `current` | `root-role.capability-catalog.read` | `scope(...) and can(...)` | `RootUserAdmin` | catalog-backed eligible capability inspection |
| root roles | `rootRoles` | `listSystemRootRoleCapabilityAssignments` | `current` | `root-role.capability-assignment.read` | `scope(...) and can(...)` | `RootUserAdmin` | assigned grant inspection |
| root roles | `rootRoles` | `updateSystemRootRoleCapabilityGrants` | `current` | `root-role.capability-assignment.update` | `can(...)` | `RootUserAdmin` | bulk-first grant management |
| root roles | `rootRoles` | `assignSystemRootRoleToRootUser` | `current` | `root-role.assignment.assign` | `can(...)` | `RootUserAdmin` | assigns active roles to root users |
| root roles | `rootRoles` | `unassignSystemRootRoleFromRootUser` | `current` | `root-role.assignment.unassign` | `can(...)` | `RootUserAdmin` | safe assignment removal |
| root roles | `rootRoles` | `listRootUserAssignedSystemRootRoles` | `current` | `root-role.assignment.list` | `scope(...) and can(...)` | `RootUserAdmin` | assignment inspection |
| root roles | `rootRoles` | `replaceRootUserSystemRootRole` | `current` | `root-role.assignment.replace` | `can(...)` | `RootUserAdmin` | atomic role replacement |
| root roles | `rootRoles` | `getEffectiveRootUserPermissions` | `current` | `root-role.effective-permissions.read` | `scope(...) and can(...)` | `RootUserAdmin` | effective-permission inspection with source attribution |
| tenants | `tenants` | `createTenant` | `current` | `tenant.create` | `can(...)` | `RootUserAdmin` | create durable tenant record with creator attribution |
| tenants | `tenants` | `getTenant` | `current` | `tenant.read` | `can(...)` | `RootUserAdmin` | exact visible tenant lookup |
| tenants | `tenants` | `listTenants` | `current` | `tenant.list` | `scope(...) and can(...)` | `RootUserAdmin` | visible tenant listing with approved filters |
| tenants | `tenants` | `updateTenant` | `current` | `tenant.update` | `can(...)` | `RootUserAdmin` | editable tenant metadata update |
| tenants | `tenants` | `getDeletedTenant` | `current` | `tenant.read.deleted` | `can(...)` | `RootUserAdmin` | explicit deleted-only tenant lookup |
| tenants | `tenants` | `listDeletedTenants` | `current` | `tenant.list.deleted` | `scope(...) and can(...)` | `RootUserAdmin` | explicit deleted-only tenant listing |
| tenants | `tenants` | `softDeleteTenant` | `current` | `tenant.delete` | `can(...)` | `RootUserAdmin` | soft-delete lifecycle action |
| tenants | `tenants` | `reactivateTenant` | `current` | `tenant.reactivate` | `can(...)` | `RootUserAdmin` | restore previously deleted tenant |
| tenants | `tenants` | `removeTenant` | `current` | `tenant.remove` | `can(...)` | `RootUserAdmin` | irreversible tenant remove while no dependent tenant-owned entities exist |
| notification delivery | `notificationDelivery` | `sendEmail` | `current` | `notification.email.send` | `can(...)` | `RootUserAdmin` | proof send and future operator-triggered outbound email send |
| notification delivery | `notificationDelivery` | `resendEmail` | `current` | `notification.email.resend` | `can(...)` | `RootUserAdmin` | explicit resend for one logical outbound email |
| notification delivery | `notificationDelivery` | `listOutboundEmails` | `current` | `notification.email.read` | `scope(...) and can(...)` | `RootUserAdmin` | root-only metadata list with approved filters |
| notification delivery | `notificationDelivery` | `getOutboundEmail` | `current` | `notification.email.read` | `can(...)` | `RootUserAdmin` | root-only exact read with attempt and content-version history |

## Deterministic Method For Future Roles

When a future feature set introduces new roles or permissions, define them in
this order:

1. add the feature capability rows to the capability matrix
2. add the feature PRD and any ADR needed for enduring authz rules
3. map backend capabilities to authz capabilities in this document
4. map authz capabilities to roles in the companion role-mapping document
5. only then implement code and tests

That keeps role and permission design deterministic and feature-led rather than
speculative.
