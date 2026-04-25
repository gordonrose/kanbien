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
- `tenant-admin.*` is reserved for root-managed tenant-admin profile lifecycle
  and verification workflows
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
| tenant admins | `tenantAdmins` | `createTenantAdmin` | `current` | `tenant-admin.create` | `can(...)` | `RootUserAdmin` | create a tenant-scoped tenant-admin profile |
| tenant admins | `tenantAdmins` | `getTenantAdmin` | `current` | `tenant-admin.read` | `can(...)` | `RootUserAdmin` | exact visible tenant-admin lookup within a tenant |
| tenant admins | `tenantAdmins` | `listTenantAdmins` | `current` | `tenant-admin.list` | `scope(...) and can(...)` | `RootUserAdmin` | visible tenant-admin listing within one tenant |
| tenant admins | `tenantAdmins` | `updateTenantAdminProfile` | `current` | `tenant-admin.update` | `can(...)` | `RootUserAdmin` | editable tenant-admin profile update with reverification reset on email change |
| tenant admins | `tenantAdmins` | `sendTenantAdminVerificationEmail` | `current` | `tenant-admin.verification.send` | `can(...)` | `RootUserAdmin` | issue tenant-admin verification token and send verification email |
| tenant admins | `tenantAdmins` | `resendTenantAdminVerificationEmail` | `current` | `tenant-admin.verification.resend` | `can(...)` | `RootUserAdmin` | invalidate the prior active token and send fresh verification content |
| tenant admins | `tenantAdmins` | `restartTenantAdminOnboarding` | `current` | `tenant-admin.onboarding.restart` | `can(...)` | `RootUserAdmin` | restart tenant-auth onboarding for a verified tenant-admin without requiring a new verification email |
| tenant admins | `tenantAdmins` | `softDeleteTenantAdmin` | `current` | `tenant-admin.delete` | `can(...)` | `RootUserAdmin` | soft-delete tenant-admin record and invalidate active verification eligibility |
| tenant admins | `tenantAdmins` | `reactivateTenantAdmin` | `current` | `tenant-admin.reactivate` | `can(...)` | `RootUserAdmin` | reactivate deleted tenant-admin and restore verification state to pending |
| tenant admins | `tenantAdmins` | `redeemTenantAdminVerificationToken` | `current` | `public tenant-admin verification redemption entrypoint` | `n/a` | public unauthenticated caller | public token-redemption route verifies the tenant-admin and returns tenant-auth onboarding state without creating an authenticated session |
| web app hierarchy | `webAppHierarchyBuilder` | `createWebAppModule` | `current` | `web-app-hierarchy.create-module` | `can(...)` | `RootUserAdmin` | create a durable web-app module within one root family |
| web app hierarchy | `webAppHierarchyBuilder` | `updateWebAppModule` | `current` | `web-app-hierarchy.update-module` | `can(...)` | `RootUserAdmin` | update editable web-app module metadata |
| web app hierarchy | `webAppHierarchyBuilder` | `updateWebAppModuleLandingPage` | `current` | `web-app-hierarchy.update-module-landing-page` | `can(...)` | `RootUserAdmin` | set or clear the direct-child landing page for one curated module |
| web app hierarchy | `webAppHierarchyBuilder` | `createWebAppPage` | `current` | `web-app-hierarchy.create-page` | `can(...)` | `RootUserAdmin` | create a durable curated web-app page node |
| web app hierarchy | `webAppHierarchyBuilder` | `createDesignSystemPageProposal` | `current` | `web-app-hierarchy.create-design-system-page` | `can(...)` | `RootUserAdmin` | create a proposed top-level design-system page through the governed topology flow |
| web app hierarchy | `webAppHierarchyBuilder` | `createDesignSystemSubpageProposal` | `current` | `web-app-hierarchy.create-design-system-subpage` | `can(...)` | `RootUserAdmin` | create a proposed design-system child page beneath an applied parent page |
| web app hierarchy | `webAppHierarchyBuilder` | `updateWebAppPage` | `current` | `web-app-hierarchy.update-page` | `can(...)` | `RootUserAdmin` | update editable curated web-app page metadata |
| web app hierarchy | `webAppHierarchyBuilder` | `moveWebAppPage` | `current` | `web-app-hierarchy.move-page` | `can(...)` | `RootUserAdmin` | move or orphan a curated web-app page safely |
| web app hierarchy | `webAppHierarchyBuilder` | `getResolvedWebAppHierarchyTree` | `current` | `web-app-hierarchy.read-tree` | `can(...)` | `RootUserAdmin` | read the current curated hierarchy tree with active locator truth |
| web app hierarchy | `webAppHierarchyBuilder` | `readAppliedDesignSystemTopologyTree` | `current` | `web-app-hierarchy.read-tree` | `can(...)` | `RootUserAdmin` | read the applied-only design-system tree used by the materialization workflow |
| web app hierarchy | `webAppHierarchyBuilder` | `listPlannerSelectableHierarchyNodes` | `current` | `web-app-hierarchy.read-planner-options` | `scope(...) and can(...)` | `RootUserAdmin` | read planner-selectable hierarchy nodes |
| web app hierarchy | `webAppHierarchyBuilder` | `listOrphanedWebAppPages` | `current` | `web-app-hierarchy.list-orphans` | `scope(...) and can(...)` | `RootUserAdmin` | list orphaned curated pages for recovery workflows |
| web app hierarchy | `webAppHierarchyBuilder` | `bootstrapWebAppHierarchy` | `current` | `web-app-hierarchy.bootstrap` | `can(...)` | `RootUserAdmin` | explicit-input bootstrap of curated hierarchy truth |
| web app hierarchy | `webAppHierarchyBuilder` | `previewDesignSystemMaterialization` | `current` | `web-app-hierarchy.preview-design-system-materialization` | `can(...)` | `RootUserAdmin` | preview deterministic design-system repo materialization without mutating applied truth |
| web app hierarchy | `webAppHierarchyBuilder` | `applyDesignSystemMaterialization` | `current` | `web-app-hierarchy.apply-design-system-materialization` | `can(...)` | `RootUserAdmin` | apply approved design-system materialization, mark proposals applied, and refresh the applied tree |
| web app hierarchy | `webAppHierarchyBuilder` | `syncWebAppHierarchyFromDiscovery` | `current` | `web-app-hierarchy.sync-discovery` | `can(...)` | `RootUserAdmin` | compatibility wrapper that runs the structure-aware discovery sync and returns the updated tree |
| web app hierarchy | `webAppHierarchyBuilder` | `previewStructureAwareWebAppHierarchySync` | `current` | `web-app-hierarchy.preview-discovery-sync` | `can(...)` | `RootUserAdmin` | preview structure-aware reconcile without mutating curated hierarchy truth |
| web app hierarchy | `webAppHierarchyBuilder` | `applyStructureAwareWebAppHierarchySync` | `current` | `web-app-hierarchy.apply-discovery-sync` | `can(...)` | `RootUserAdmin` | apply structure-aware reconcile into curated hierarchy truth |
| web app hierarchy | `webAppHierarchyBuilder` | `listWebAppHierarchyDiscoveryLinks` | `current` | `web-app-hierarchy.read-discovery-link-status` | `scope(...) and can(...)` | `RootUserAdmin` | inspect durable discovery-link and drift posture |
| web app page settings | `webAppPageSettings` | `getWebAppPageSettings` | `current` | `web-app-page-settings.read` | `can(...)` | `RootUserAdmin` | exact read of durable page settings plus effective fallback posture |
| web app page settings | `webAppPageSettings` | `updateWebAppPageSettings` | `current` | `web-app-page-settings.update` | `can(...)` | `RootUserAdmin` | exact mutation of durable page settings and explicit context-nav membership |
| web app page settings | `webAppPageSettings` | `getWebAppPageSettingsOptions` | `current` | `web-app-page-settings.read-options` | `can(...)` | `RootUserAdmin` | read approved icon/template options and eligible curated target pages |
| web app surface discovery | `webAppSurfaceDiscovery` | `runWebAppSurfaceDiscovery` | `current` | `web-app-surface-discovery.run` | `can(...)` | `RootUserAdmin` | run root-triggered discovery over approved route-family providers |
| web app surface discovery | `webAppSurfaceDiscovery` | `getDiscoveredWebAppSurface` | `current` | `web-app-surface-discovery.read` | `can(...)` | `RootUserAdmin` | exact current discovered-surface read |
| web app surface discovery | `webAppSurfaceDiscovery` | `listDiscoveredWebAppSurfaces` | `current` | `web-app-surface-discovery.read` | `scope(...) and can(...)` | `RootUserAdmin` | paginated current discovered-surface read |
| web app surface discovery | `webAppSurfaceDiscovery` | `getDiscoveredWebAppStructureNode` | `current` | `web-app-surface-discovery.read-structure` | `can(...)` | `RootUserAdmin` | exact discovered structure-node read |
| web app surface discovery | `webAppSurfaceDiscovery` | `listDiscoveredWebAppStructureTree` | `current` | `web-app-surface-discovery.read-structure` | `scope(...) and can(...)` | `RootUserAdmin` | structure-aware discovered tree read |
| web app surface discovery | `webAppSurfaceDiscovery` | `getWebAppDiscoveryRun` | `current` | `web-app-surface-discovery.read-runs` | `can(...)` | `RootUserAdmin` | exact discovery-run read |
| web app surface discovery | `webAppSurfaceDiscovery` | `listWebAppDiscoveryRuns` | `current` | `web-app-surface-discovery.read-runs` | `scope(...) and can(...)` | `RootUserAdmin` | paginated discovery-run history read |
| entity definitions | `entityBuilder` | `createEntityDefinitionVersion` | `current` | `entity-builder.create` | `can(...)` | `RootUserAdmin` | creates a new lineage or replacement version under a stable `entityKey` |
| entity definitions | `entityBuilder` | `updateDraftEntityDefinitionVersion` | `current` | `entity-builder.update` | `can(...)` | `RootUserAdmin` | updates draft-only version content without mutating active history |
| entity definitions | `entityBuilder` | `getEntityDefinitionCurrent` | `current` | `entity-builder.read` | `can(...)` | `RootUserAdmin` | resolves current active version by stable `entityKey` |
| entity definitions | `entityBuilder` | `getEntityDefinitionVersion` | `current` | `entity-builder.read` | `can(...)` | `RootUserAdmin` | exact historical read by durable version id |
| entity definitions | `entityBuilder` | `listEntityDefinitions` | `current` | `entity-builder.read` | `scope(...) and can(...)` | `RootUserAdmin` | paginated lineage listing with current-version summary |
| entity definitions | `entityBuilder` | `listAttributeTypeCatalog` | `current` | `entity-builder.catalog.read` | `scope(...) and can(...)` | `RootUserAdmin` | bounded attribute catalog read |
| entity definitions | `entityBuilder` | `listApprovedFormPatterns` | `current` | `entity-builder.catalog.read` | `scope(...) and can(...)` | `RootUserAdmin` | bounded approved form-pattern catalog read |
| entity definitions | `entityBuilder` | `validateEntityDefinitionVersion` | `current` | `entity-builder.validate` | `can(...)` | `RootUserAdmin` | exact validation read for activation and export readiness |
| entity definitions | `entityBuilder` | `exportEntityDefinitionSnapshot` | `current` | `entity-builder.export` | `can(...)` | `RootUserAdmin` | canonical derived export generated on demand |
| capability contract catalog | `capabilityContractCatalog` | `listCapabilityCatalogEntries` | `current` | `capability-contract-catalog.read` | `scope(...) and can(...)` | `RootUserAdmin` | browse persisted capability-picker summaries |
| capability contract catalog | `capabilityContractCatalog` | `getCapabilityCatalogEntry` | `current` | `capability-contract-catalog.read` | `can(...)` | `RootUserAdmin` | exact read of one persisted capability record |
| capability contract catalog | `capabilityContractCatalog` | `exportCapabilityCatalogSnapshot` | `current` | `capability-contract-catalog.export` | `can(...)` | `RootUserAdmin` | export deterministic catalog snapshots from persisted truth |
| capability contract catalog | `capabilityContractCatalog` | `materializeCapabilityCatalog` | `current` | `capability-contract-catalog.materialize` | `can(...)` | `RootUserAdmin` | normalize approved source truth into persisted catalog records |
| capability contract catalog | `capabilityContractCatalog` | `auditCapabilityCatalogDrift` | `current` | `capability-contract-catalog.audit-drift` | `scope(...) and can(...)` | `RootUserAdmin` | inspect drift between persisted catalog truth and current approved sources |
| capability contract catalog | `capabilityContractCatalog` | `listCapabilityCatalogEntries` | `current` | `capability-contract-catalog.read` | `scope(...) and can(...)` | `RootUserAdmin` | browse persisted capability-picker summaries |
| capability contract catalog | `capabilityContractCatalog` | `getCapabilityCatalogEntry` | `current` | `capability-contract-catalog.read` | `can(...)` | `RootUserAdmin` | exact read of one persisted capability record |
| capability contract catalog | `capabilityContractCatalog` | `exportCapabilityCatalogSnapshot` | `current` | `capability-contract-catalog.export` | `can(...)` | `RootUserAdmin` | export deterministic catalog snapshots from persisted truth |
| capability contract catalog | `capabilityContractCatalog` | `materializeCapabilityCatalog` | `current` | `capability-contract-catalog.materialize` | `can(...)` | `RootUserAdmin` | normalize approved source truth into persisted catalog records |
| capability contract catalog | `capabilityContractCatalog` | `auditCapabilityCatalogDrift` | `current` | `capability-contract-catalog.audit-drift` | `scope(...) and can(...)` | `RootUserAdmin` | inspect drift between persisted catalog truth and current approved sources |
| assets | `assets` | `createAssetUploadIntent` | `current` | `asset.create` | `can(...)` | `RootUserAdmin` | create constrained upload intents and allocate generated storage keys |
| assets | `assets` | `completeAssetUpload` | `current` | `asset.create` | `can(...)` | `RootUserAdmin` | complete pending uploads after storage metadata and sanitizer verification |
| assets | `assets` | `readAssetMetadata` | `current` | `asset.read` | `can(...)` | `RootUserAdmin` | read safe ready asset metadata without exposing storage credentials |
| assets | `assets` | `readAssetContent` | `current` | `asset.content.read` | `can(...)` | `RootUserAdmin` | stream ready private asset bytes through same-origin policy |
| assets | `assets` | `deleteAsset` | `current` | `asset.delete` | `can(...)` | `RootUserAdmin` | soft-delete assets while preserving durable metadata |
| assets | `assets` | `validateAssetForSubject` | `current` | `asset.link` | `feature seam` | consuming feature service | validate asset invariants after consuming-feature entity authorization |
| assets | `assets` | `cleanupExpiredUploads` | `current` | `asset.cleanup` | `can(...)` | `RootUserAdmin` | run expired upload cleanup support seam |

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
