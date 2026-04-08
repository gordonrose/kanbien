# Role To Authorization Capability Mapping

## Purpose

Map authorization capabilities to the role or actor boundary that grants them.

This document is intentionally explicit about status.
It carries both:

- the currently implemented role-to-authz mapping baseline
- the approved target mapping for the next specified slice when a PRD exists
  but code has not landed yet

## Current Role Baseline

The only explicit implemented role captured here today is:

- `RootUserAdmin`

That role represents the current coarse authenticated root-user operator
boundary implemented by the repo.

Public unauthenticated login entrypoints are also listed explicitly, but they
are not a role.

## Current Mapping Rules

- `mandatory` means the capability belongs to the role identity and should
  always be present within that role definition
- `protected` means the capability should not be casually removed from the role
  definition
- rows marked `current` describe implemented repo truth
- rows marked `target` describe approved PRD-backed next-slice mappings that
  are not yet implemented
- future tenant or business roles should not be added here until those feature
  sets are specified

## Capability Mapping

| Role / Boundary | Authz Capability | Current Status | Grant Model | Mandatory | Protected | Notes |
|---|---|---|---|---|---|---|
| public unauthenticated caller | `public root login entrypoint` | `current` | public route access for password and SSH login entrypoints | yes | yes | constrained by abuse controls and sign-in eligibility checks |
| public unauthenticated caller | `public root browser login entrypoint` | `current` | public route access for browser SSH completion | yes | yes | constrained by abuse controls and browser-session transport rules |
| `RootUserAdmin` | `root-auth.principal.create` | `current` | current root operator grant | yes | yes | create root auth principal |
| `RootUserAdmin` | `root-auth.password.change.own` | `current` | current root operator grant with ownership semantics | yes | yes | current implementation is ownership-scoped |
| `RootUserAdmin` | `root-auth.ssh-key.create.own` | `current` | current root operator grant with ownership semantics | yes | yes | current implementation is ownership-scoped |
| `RootUserAdmin` | `root-auth.ssh-key.read.own` | `current` | current root operator grant with ownership semantics | yes | yes | current implementation is ownership-scoped |
| `RootUserAdmin` | `root-auth.ssh-key.revoke.own` | `current` | current root operator grant with ownership semantics | yes | yes | current implementation is ownership-scoped |
| `RootUserAdmin` | `root-auth.session.read.own` | `current` | current root operator grant with ownership semantics | yes | yes | current implementation is ownership-scoped |
| `RootUserAdmin` | `root-auth.session.revoke.own` | `current` | current root operator grant with ownership semantics | yes | yes | current implementation is ownership-scoped |
| `RootUserAdmin` | `root-auth.session.logout.own` | `current` | current root operator self-logout grant | yes | yes | explicit self-logout capability |
| `RootUserAdmin` | `root-admin-shell.session.read.own` | `current` | current root browser-session grant | yes | yes | cookie-backed browser session summary |
| `RootUserAdmin` | `root-admin-shell.session.logout.own` | `current` | current root browser-session grant with trusted-origin rule | yes | yes | cookie-backed browser logout |
| `RootUserAdmin` | `root-user.create` | `current` | current root operator grant | yes | yes | create root user |
| `RootUserAdmin` | `root-user.read.visible` | `current` | current root operator grant | yes | yes | exact lookup and visible listing |
| `RootUserAdmin` | `root-user.read.active` | `current` | current root operator grant | no | no | active-only list specialization |
| `RootUserAdmin` | `root-user.read.deleted` | `current` | current root operator grant | no | yes | deleted/anonymized visibility should stay explicit |
| `RootUserAdmin` | `root-user.update` | `current` | current root operator grant | yes | yes | lifecycle-safe update path |
| `RootUserAdmin` | `root-user.delete` | `current` | current root operator grant | no | yes | soft-delete action |
| `RootUserAdmin` | `root-user.remove` | `current` | current root operator grant | no | yes | irreversible anonymized remove |
| `RootUserAdmin` | `root-user.reactivate` | `current` | current root operator grant | no | yes | restore/reactivation action |
| `RootUserAdmin` | `root-role.create` | `current` | current root operator grant | yes | yes | create system root role |
| `RootUserAdmin` | `root-role.read` | `current` | current root operator grant | no | yes | exact role lookup; protected but intentionally not mandatory to leave room for future read-only root roles |
| `RootUserAdmin` | `root-role.list` | `current` | current root operator grant | no | yes | paginated role listing; protected but intentionally not mandatory |
| `RootUserAdmin` | `root-role.update` | `current` | current root operator grant | yes | yes | editable role metadata update |
| `RootUserAdmin` | `root-role.delete` | `current` | current root operator grant | yes | yes | deactivate role from future assignment |
| `RootUserAdmin` | `root-role.reactivate` | `current` | current root operator grant | yes | yes | reactivate durable role identity |
| `RootUserAdmin` | `root-role.capability-catalog.read` | `current` | current root operator grant | no | yes | eligible capability inspection for role editing |
| `RootUserAdmin` | `root-role.capability-assignment.read` | `current` | current root operator grant | no | yes | assigned grant inspection for role editing |
| `RootUserAdmin` | `root-role.capability-assignment.update` | `current` | current root operator grant | yes | yes | bulk-first role grant management |
| `RootUserAdmin` | `root-role.assignment.assign` | `current` | current root operator grant | yes | yes | assign active root role to root user |
| `RootUserAdmin` | `root-role.assignment.unassign` | `current` | current root operator grant | yes | yes | safe root-role assignment removal |
| `RootUserAdmin` | `root-role.assignment.list` | `current` | current root operator grant | no | yes | root-user assignment inspection |
| `RootUserAdmin` | `root-role.assignment.replace` | `current` | current root operator grant | yes | yes | atomic replacement workflow for evolving roles |
| `RootUserAdmin` | `root-role.effective-permissions.read` | `current` | current root operator grant | no | yes | effective-permission inspection with source attribution |
| `RootUserAdmin` | `tenant.create` | `current` | current root operator grant | yes | yes | create tenant |
| `RootUserAdmin` | `tenant.read` | `current` | current root operator grant | yes | yes | exact visible tenant lookup |
| `RootUserAdmin` | `tenant.list` | `current` | current root operator grant | yes | yes | visible tenant listing |
| `RootUserAdmin` | `tenant.update` | `current` | current root operator grant | yes | yes | editable tenant metadata update |
| `RootUserAdmin` | `tenant.read.deleted` | `current` | current root operator grant | no | yes | deleted tenant visibility remains explicit |
| `RootUserAdmin` | `tenant.list.deleted` | `current` | current root operator grant | no | yes | deleted tenant list remains explicit |
| `RootUserAdmin` | `tenant.delete` | `current` | current root operator grant | no | yes | soft-delete lifecycle action |
| `RootUserAdmin` | `tenant.reactivate` | `current` | current root operator grant | no | yes | restore deleted tenant |
| `RootUserAdmin` | `tenant.remove` | `current` | current root operator grant | no | yes | irreversible tenant remove while tenant-owned durable entities do not yet exist |
| `RootUserAdmin` | `notification.email.send` | `current` | current root operator grant | yes | yes | proof send and future operator-triggered outbound email send |
| `RootUserAdmin` | `notification.email.resend` | `current` | current root operator grant | yes | yes | explicit resend for one logical outbound email |
| `RootUserAdmin` | `notification.email.read` | `current` | current root operator grant | yes | yes | root-only metadata list and exact read |
| public unauthenticated caller | `public tenant-admin verification redemption entrypoint` | `current` | public route access for tenant-admin verification redemption | yes | yes | bounded public workflow route with public-write rate limiting |
| `RootUserAdmin` | `tenant-admin.create` | `current` | current root operator grant | yes | yes | create tenant-admin profile |
| `RootUserAdmin` | `tenant-admin.read` | `current` | current root operator grant | yes | yes | exact visible tenant-admin lookup |
| `RootUserAdmin` | `tenant-admin.list` | `current` | current root operator grant | yes | yes | visible tenant-admin listing |
| `RootUserAdmin` | `tenant-admin.update` | `current` | current root operator grant | yes | yes | editable tenant-admin profile update |
| `RootUserAdmin` | `tenant-admin.verification.send` | `current` | current root operator grant | yes | yes | initial verification send workflow |
| `RootUserAdmin` | `tenant-admin.verification.resend` | `current` | current root operator grant | yes | yes | fresh-token verification resend workflow |
| `RootUserAdmin` | `tenant-admin.delete` | `current` | current root operator grant | no | yes | soft-delete tenant-admin record |
| `RootUserAdmin` | `tenant-admin.reactivate` | `current` | current root operator grant | no | yes | reactivate deleted tenant-admin record with verification reset |

## Deterministic Method For Future Roles

When a future feature set introduces a new role, define it through the normal
specification loop:

1. define the feature capabilities in the capability matrix
2. define any enduring authz rules in the PRD and ADR layer
3. add backend-to-authz mappings
4. add role-to-authz mappings
5. then implement the feature

That keeps role design predictable, explicit, and tied to concrete feature
work instead of being predeclared too early.
