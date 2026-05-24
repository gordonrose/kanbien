# Role To Authorization Capability Mapping

## Purpose

Map authorization capabilities to the role or actor boundary that grants them.

This document is intentionally explicit about status.
It carries both:

- the currently implemented role-to-authz mapping baseline
- the approved target mapping for the next specified slice when a PRD exists
  but code has not landed yet
- approved architecture-target role/capability families for the platform
  authorization model before detailed Layer 3 story breakdown

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
- rows marked `architecture-target` describe approved Layer 2 direction that
  still needs PRD/capability-matrix/story breakdown before implementation
- rows marked `blocked` describe capabilities that must not be granted,
  selected, or used
- future tenant or business roles should not be added here until those feature
  sets are specified

## Expanded Role Mapping Schema For Platform Authorization

Future new or materially changed role rows must carry enough metadata to prove
the role belongs to the right authority world and is safe to expose.

| Field | Meaning |
| --- | --- |
| `authorityWorld` | Permission universe: `root`, `tenant`, or `system`. |
| `actorBoundary` | Role or actor boundary, such as `rootAdmin`, `rootSupport`, `adminOwner`, `systemJob`, or public entrypoint. |
| `authzCapability` | Capability key granted to the role/boundary. |
| `grantSourcePosture` | `documentation-only`, `seed-backed`, `corrective-migration-backed`, `runtime-enforced`, or `blocked`. |
| `grantModel` | How the role receives the grant, such as mandatory role capability, protected role capability, public route entrypoint, system authority, or future assignment. |
| `uiEligibility` | Whether the capability may appear as a usable admin/UI option. |
| `tenantContextRequired` | Whether the role can exercise the capability only inside one current tenant context. |
| `crossTenantPosture` | Whether cross-tenant access is denied by default, root-explicit-only, approved shared-cross-tenant, or not applicable. |
| `auditRequirement` | Required audit posture for allow/deny/mutation. |
| `sourceArtifact` | Approved source artifact for the row. |

Role rows must preserve the authority-world split:

- root roles grant root/operator capabilities only
- tenant roles grant tenant/account capabilities only
- system/job authority must preserve initiating actor and policy source
- public entrypoints are not roles

## Platform Authorization Target Role Families

These rows are architecture-target role/capability families. They are not
runtime grants and must not be exposed in UI until the grant source posture is
`runtime-enforced`.

| Role / Boundary | Authz Capability Family | Status | authorityWorld | actorBoundary | grantSourcePosture | Grant Model | UI Eligibility | Tenant Context Required | Cross-Tenant Posture | Audit Requirement | Source Artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `rootAdmin` | `root.tenant.setup.manage` | `architecture-target` | `root` | `rootAdmin` | `documentation-only` | future protected root capability | no | explicit tenant target | `root-explicit-only` | required-on-mutation | TS-2026-05-04 / ADR-0036 / ADR-0037 | Root owns tenant setup and branding. |
| `rootAdmin` | `root.tenant-admin.manage` | `architecture-target` | `root` | `rootAdmin` | `documentation-only` | future protected root capability | no | explicit tenant target | `root-explicit-only` | required | TS-2026-05-04 / Product Discovery | Root owns tenant admin management in v1. |
| `rootAdmin` | `root.commercial-entitlement.manage` | `architecture-target` | `root` | `rootAdmin` | `documentation-only` | future protected root capability | no | explicit tenant target when tenant-specific | `root-explicit-only` | required-on-mutation | TS-2026-05-04 / Product Discovery | Root owns pricing, tiers, limits, and entitlements. |
| `rootSupport` | `root.support.tenant.read` | `architecture-target` | `root` | `rootSupport` | `documentation-only` | future read-only support capability with reason/reference | no | explicit tenant target | `root-explicit-only` | required | TS-2026-05-04 audit taxonomy | Root support is read-only and internal-audit-visible in v1. |
| `rootAdmin` | `root.emergency.tenant.act` | `architecture-target` | `root` | `rootAdmin` | `documentation-only` | future emergency capability with reason/reference | no | explicit tenant target | `root-explicit-only` | required | TS-2026-05-04 audit taxonomy | Emergency powers allowed; formal review workflow deferred. |
| `adminOwner` | `admin.tenant-account.manage` | `architecture-target` | `tenant` | `adminOwner` | `documentation-only` | future mandatory tenant-admin capability | no | yes | `deny-default` | required-on-mutation | TS-2026-05-04 / Product Discovery | Tenant admins manage day-to-day account operation within root-approved availability. |
| `adminOwner` | `admin.tenant-data.export` | `architecture-target` | `tenant` | `adminOwner` | `documentation-only` | future protected tenant-admin capability | no | yes | `deny-default` | required | TS-2026-05-04 / ADR-0037 | Tenant admins can export tenant data/logs through approved reporting/export layers. |
| `systemJob` | `system.job.authz.execute` | `architecture-target` | `system` | `systemJob` | `documentation-only` | future system authority with initiating actor/policy source | no | tenant-specific when job is tenant-scoped | `deny-default` | required | TS-2026-05-04 audit taxonomy | Jobs must preserve initiating actor, tenant context, and policy source. |

## Blocked Or Deferred Role Families

| Role / Boundary | Capability Family | Status | authorityWorld | grantSourcePosture | UI Eligibility | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| `adminOwner` | tenant-created custom roles | `blocked` | `tenant` | `blocked` | no | Tenant-created custom roles are out of scope for v1. |
| `adminOwner` | tenant-specific role divergence | `blocked` | `tenant` | `blocked` | no | `adminOwner` is globally consistent in v1. |
| `adminOwner` | tenant self-service tenant-admin management | `blocked` | `tenant` | `blocked` | no | Root owns tenant admin management in v1. |
| root staff | tenant user impersonation | `blocked` | `root` | `blocked` | no | Support access is root-scoped read-only viewing, not impersonation. |
| `adminOwner` | ABAC/ReBAC tenant admin UI | `blocked` | `tenant` | `blocked` | no | ABAC/ReBAC are typed extension points only until future feature-specific steering approves them. |

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
| `RootUserAdmin` | `tenant-admin.onboarding.restart` | `current` | current root operator grant | yes | yes | restart tenant-auth onboarding for a verified tenant-admin |
| `RootUserAdmin` | `tenant-admin.delete` | `current` | current root operator grant | no | yes | soft-delete tenant-admin record |
| `RootUserAdmin` | `tenant-admin.reactivate` | `current` | current root operator grant | no | yes | reactivate deleted tenant-admin record with verification reset |
| `RootUserAdmin` | `web-app-hierarchy.create-module` | `current` | current root operator grant | yes | yes | create a curated web-app module |
| `RootUserAdmin` | `web-app-hierarchy.update-module` | `current` | current root operator grant | yes | yes | update editable curated module metadata |
| `RootUserAdmin` | `web-app-hierarchy.update-module-landing-page` | `current` | current root operator grant | yes | yes | update direct-child module landing-page truth |
| `RootUserAdmin` | `web-app-hierarchy.create-page` | `current` | current root operator grant | yes | yes | create a curated web-app page |
| `RootUserAdmin` | `web-app-hierarchy.create-design-system-page` | `current` | current root operator grant | yes | yes | create a proposed top-level design-system page |
| `RootUserAdmin` | `web-app-hierarchy.create-design-system-subpage` | `current` | current root operator grant | yes | yes | create a proposed design-system child page |
| `RootUserAdmin` | `web-app-hierarchy.update-page` | `current` | current root operator grant | yes | yes | update editable curated page metadata |
| `RootUserAdmin` | `web-app-hierarchy.move-page` | `current` | current root operator grant | yes | yes | move or orphan a curated page safely |
| `RootUserAdmin` | `web-app-hierarchy.read-tree` | `current` | current root operator grant | yes | yes | read the resolved curated tree |
| `RootUserAdmin` | `web-app-hierarchy.preview-design-system-materialization` | `current` | current root operator grant | yes | yes | preview deterministic design-system materialization |
| `RootUserAdmin` | `web-app-hierarchy.apply-design-system-materialization` | `current` | current root operator grant | yes | yes | apply approved design-system materialization |
| `RootUserAdmin` | `web-app-hierarchy.read-planner-options` | `current` | current root operator grant | yes | yes | read planner-selectable hierarchy nodes |
| `RootUserAdmin` | `web-app-hierarchy.list-orphans` | `current` | current root operator grant | yes | yes | list orphaned curated pages |
| `RootUserAdmin` | `web-app-hierarchy.bootstrap` | `current` | current root operator grant | yes | yes | explicit-input hierarchy bootstrap |
| `RootUserAdmin` | `web-app-hierarchy.sync-discovery` | `current` | current root operator grant | yes | yes | compatibility sync wrapper that returns the updated tree |
| `RootUserAdmin` | `web-app-hierarchy.preview-discovery-sync` | `current` | current root operator grant | yes | yes | preview structure-aware discovery reconcile |
| `RootUserAdmin` | `web-app-hierarchy.apply-discovery-sync` | `current` | current root operator grant | yes | yes | apply structure-aware discovery reconcile |
| `RootUserAdmin` | `web-app-hierarchy.read-discovery-link-status` | `current` | current root operator grant | yes | yes | inspect discovery-link and drift status |
| `RootUserAdmin` | `web-app-page-settings.read` | `current` | current root operator grant | yes | yes | exact read of durable page settings |
| `RootUserAdmin` | `web-app-page-settings.update` | `current` | current root operator grant | yes | yes | exact mutation of durable page settings |
| `RootUserAdmin` | `web-app-page-settings.read-options` | `current` | current root operator grant | yes | yes | read approved page-settings options and eligible target pages |
| `RootUserAdmin` | `web-app-surface-discovery.run` | `current` | current root operator grant | yes | yes | run approved-route web-app discovery |
| `RootUserAdmin` | `web-app-surface-discovery.read` | `current` | current root operator grant | yes | yes | read current discovered surfaces |
| `RootUserAdmin` | `web-app-surface-discovery.read-runs` | `current` | current root operator grant | yes | yes | read discovery run history |
| `RootUserAdmin` | `web-app-surface-discovery.read-structure` | `current` | current root operator grant | yes | yes | read current discovered structure trees and exact nodes |
| `RootUserAdmin` | `entity-builder.create` | `current` | current root operator grant | yes | yes | create entity-definition lineages or replacement versions |
| `RootUserAdmin` | `entity-builder.update` | `current` | current root operator grant | yes | yes | update draft entity-definition versions |
| `RootUserAdmin` | `entity-builder.read` | `current` | current root operator grant | yes | yes | current and exact historical entity-definition reads |
| `RootUserAdmin` | `entity-builder.catalog.read` | `current` | current root operator grant | yes | yes | approved attribute and form-pattern catalog reads |
| `RootUserAdmin` | `entity-builder.validate` | `current` | current root operator grant | yes | yes | validation readiness reads for activation and export |
| `RootUserAdmin` | `entity-builder.export` | `current` | current root operator grant | yes | yes | canonical derived export generation |
| `RootUserAdmin` | `entity.create` | `current` | current root operator grant | yes | yes | create root-managed platform self-definition seed records |
| `RootUserAdmin` | `entity.read` | `current` | current root operator grant | yes | yes | read and list current Entity records with explicit archived opt-in |
| `RootUserAdmin` | `entity.update` | `current` | current root operator grant | yes | yes | update editable Entity metadata and lifecycle status |
| `RootUserAdmin` | `entity.delete` | `current` | current root operator grant | no | yes | archive Entity records; first slice has no hard delete |
| `RootUserAdmin` | `capability-contract-catalog.read` | `current` | current root operator grant | no | yes | browse and inspect persisted capability catalog records |
| `RootUserAdmin` | `capability-contract-catalog.export` | `current` | current root operator grant | no | yes | export deterministic capability catalog snapshots |
| `RootUserAdmin` | `capability-contract-catalog.materialize` | `current` | current root operator grant | no | yes | materialize persisted capability catalog records from approved source truth |
| `RootUserAdmin` | `capability-contract-catalog.audit-drift` | `current` | current root operator grant | no | yes | inspect drift between persisted capability catalog truth and current approved sources |
| `RootUserAdmin` | `capability-contract-catalog.read` | `current` | current root operator grant | no | yes | browse and inspect persisted capability catalog records |
| `RootUserAdmin` | `capability-contract-catalog.export` | `current` | current root operator grant | no | yes | export deterministic capability catalog snapshots |
| `RootUserAdmin` | `capability-contract-catalog.materialize` | `current` | current root operator grant | no | yes | materialize persisted capability catalog records from approved source truth |
| `RootUserAdmin` | `capability-contract-catalog.audit-drift` | `current` | current root operator grant | no | yes | inspect drift between persisted capability catalog truth and current approved sources |
| `RootUserAdmin` | `asset.create` | `current` | current root operator grant | yes | yes | create upload intents and complete verified uploads |
| `RootUserAdmin` | `asset.read` | `current` | current root operator grant | no | yes | read ready asset metadata |
| `RootUserAdmin` | `asset.content.read` | `current` | current root operator grant | no | yes | stream ready private asset content |
| `RootUserAdmin` | `asset.delete` | `current` | current root operator grant | yes | yes | soft-delete assets |
| `RootUserAdmin` | `asset.link` | `current` | current root operator or feature-service grant | no | yes | validate assets for consuming feature relationships after entity authorization |
| `RootUserAdmin` | `asset.cleanup` | `current` | current root operator grant | yes | yes | run expired upload cleanup support seam |

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
