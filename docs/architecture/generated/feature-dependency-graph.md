# Feature Dependency Graph

## Summary

- Features analyzed: 16
- Cross-feature edges: 13
- Validation violations: 0

Rule: Cross-feature imports in src/features must go through target feature index.ts seams, and each feature manifest must declare current downstream dependencies and public seams.

## By Feature

### assets

- Manifest: `src/features/assets/feature.manifest.json`
- Source files: 12
- Declared dependencies: none
- Current public dependencies: none
- Private seam violations: 0
- Depended on by: none
- Public seams:
  - `feature-factory` via `createAssetsFeature` in `index.ts` (feature-factory, stable)
  - `service` via `AssetsService` in `index.ts` (domain-service, stable)
- Breaking-change risks:
  - Changing asset lifecycle, upload-intent binding, or storage-key immutability semantics can make uploaded bytes usable without the approved verification path.
  - Changing same-origin private content-read behavior can leak storage authority or bypass asset-native authorization.
  - Changing validation seam semantics can let consuming features replace entity authorization with generic asset ownership.

### capabilityContractCatalog

- Manifest: `src/features/capabilityContractCatalog/feature.manifest.json`
- Source files: 14
- Declared dependencies: none
- Current public dependencies: none
- Private seam violations: 0
- Depended on by: none
- Public seams:
  - `feature-factory` via `createCapabilityContractCatalogFeature` in `index.ts` (feature-factory, stable)
- Breaking-change risks:
  - Changing capability ids or normalized field-path semantics can break downstream builder tooling that binds against catalog records.
  - Changing generated-artifact or persisted catalog truth semantics can break materialization and drift-audit trust posture for later frontend composition flows.

### designSystemCanonicals

- Manifest: `src/features/designSystemCanonicals/feature.manifest.json`
- Source files: 16
- Declared dependencies: none
- Current public dependencies: none
- Private seam violations: 0
- Depended on by: none
- Public seams:
  - `feature-factory` via `createDesignSystemCanonicalsFeature` in `index.ts` (feature-factory, stable)
  - `canonicals-integration-seam-factory` via `createDesignSystemCanonicalsIntegrationSeam` in `index.ts` (integration-seam-factory, stable)
  - `canonicals-integration-seam` via `DesignSystemCanonicalsPublicSeam` in `index.ts` (integration-seam, stable)
- Breaking-change risks:
  - Changing the public canonical launcher or rendering seam can break generated design-system routes and any feature that reads canonical family truth through this integration seam.
  - Changing canonical family persistence or lifecycle semantics can break public design-system route resolution and hierarchy projection.

### entityBuilder

- Manifest: `src/features/entityBuilder/feature.manifest.json`
- Source files: 23
- Declared dependencies: none
- Current public dependencies: none
- Private seam violations: 0
- Depended on by: none
- Public seams:
  - `feature-factory` via `createEntityBuilderFeature` in `index.ts` (feature-factory, stable)
  - `entity-definition-response-types` via `EntityDefinitionCurrentResponse | EntityDefinitionExportResponse | EntityDefinitionVersionResponse` in `index.ts` (contract-types, stable)
- Breaking-change risks:
  - Removing or renaming exported entity definition response types can break downstream consumers that compile against this contract surface.
  - Changing durable entity definition persistence or export semantics can invalidate snapshot tooling and compatibility assumptions.

### jobProcessing

- Manifest: `src/features/jobProcessing/feature.manifest.json`
- Source files: 20
- Declared dependencies: none
- Current public dependencies: none
- Private seam violations: 0
- Depended on by: notificationDelivery
- Public seams:
  - `enqueue-service` via `enqueueTransactionalJobRequest` in `index.ts` (service, experimental)
  - `job-registry` via `createJobTypeRegistry` in `index.ts` (registry, experimental)
  - `dispatcher-worker-runtime` via `createJobProcessingService` in `index.ts` (runtime, experimental)
- Breaking-change risks:
  - Changing job status, outbox, attempt, retry, or idempotency semantics can strand queued historical jobs or break at-least-once execution guarantees.
  - Changing payload safety, execution-scope, or tenant-context validation can weaken async authorization boundaries or make historical payload versions unexecutable.
  - Exposing provider-specific BullMQ or Redis types through public seams would break the planned provider-neutral compatibility boundary.

### notificationDelivery

- Manifest: `src/features/notificationDelivery/feature.manifest.json`
- Source files: 22
- Declared dependencies: jobProcessing
- Current public dependencies: jobProcessing
- Private seam violations: 0
- Depended on by: tenantAdmins
- Public seams:
  - `feature-factory` via `createNotificationDeliveryFeature` in `index.ts` (feature-factory, stable)
  - `notification-email-writer` via `createNotificationEmailWriter | NotificationEmailWriter` in `index.ts` (writer-seam, stable)
  - `notification-email-async-writer` via `createQueuedNotificationEmailWriter | createNotificationDeliveryJobTypesForRuntime` in `index.ts` (job-processing-adoption, experimental)
  - `notification-delivery-error` via `NotificationDeliveryError` in `index.ts` (error-type, stable)
- Breaking-change risks:
  - Changing the notification email writer contract can break features that delegate onboarding or verification email delivery through this seam.
  - Changing outbound email persistence or resend semantics can affect auditability and historical correctness for feature-owned workflows.
  - Queued email delivery must not send redacted durable snapshots as provider content; security-sensitive emails require owner-regenerated content or synchronous delivery until a richer async content model is approved.

### rootAuth

- Manifest: `src/features/rootAuth/feature.manifest.json`
- Source files: 15
- Declared dependencies: rootUsers
- Current public dependencies: rootUsers
- Private seam violations: 0
- Depended on by: none
- Public seams:
  - `feature-factory` via `createRootAuthFeature` in `index.ts` (feature-factory, stable)
- Breaking-change risks:
  - Changing root authentication route or session behavior is externally breaking for operator login and browser bootstrap flows.
  - Changing the expected root-user auth-state seam can break sign-in eligibility checks delegated to rootUsers.

### rootRoles

- Manifest: `src/features/rootRoles/feature.manifest.json`
- Source files: 12
- Declared dependencies: rootUsers
- Current public dependencies: rootUsers
- Private seam violations: 0
- Depended on by: none
- Public seams:
  - `feature-factory` via `createRootRolesFeature` in `index.ts` (feature-factory, stable)
  - `authorization-checker` via `createRootAuthorizationChecker` in `index.ts` (authorization-seam, stable)
- Breaking-change risks:
  - Changing the root authorization checker contract can break shared capability enforcement across the platform.
  - Changing role assignment persistence or effective-permission semantics can break downstream authorization assumptions.

### rootUsers

- Manifest: `src/features/rootUsers/feature.manifest.json`
- Source files: 23
- Declared dependencies: none
- Current public dependencies: none
- Private seam violations: 0
- Depended on by: rootAuth, rootRoles
- Public seams:
  - `feature-factory` via `createRootUserFeature` in `index.ts` (feature-factory, stable)
  - `auth-state-reader` via `createRootUsersAuthStateReader | RootUsersAuthStateReader` in `index.ts` (reader-seam, stable)
  - `browser-summary-reader` via `createRootUsersBrowserSummaryReader | RootUsersBrowserSummaryReader | RootUserBrowserSummary` in `index.ts` (reader-seam, stable)
  - `root-user-auth-state-type` via `RootUserAuthState` in `index.ts` (domain-type, stable)
- Breaking-change risks:
  - Changing root-user normalization, lifecycle, or soft-delete semantics can break authentication and authorization features that depend on stable operator identity facts.
  - Changing exported auth-state or browser-summary seams can break rootAuth and rootRoles integration.

### tenantAdmins

- Manifest: `src/features/tenantAdmins/feature.manifest.json`
- Source files: 13
- Declared dependencies: notificationDelivery, tenantAuth, tenants
- Current public dependencies: notificationDelivery, tenantAuth, tenants
- Private seam violations: 0
- Depended on by: tenantAuth
- Public seams:
  - `feature-factory` via `createTenantAdminsFeature` in `index.ts` (feature-factory, stable)
  - `auth-bootstrap-reader` via `createTenantAdminsAuthBootstrapReader | TenantAdminsAuthBootstrapReader` in `index.ts` (reader-seam, stable)
  - `tenant-admin-auth-bootstrap-subject` via `TenantAdminAuthBootstrapSubject` in `index.ts` (domain-type, stable)
- Breaking-change risks:
  - Changing tenant-admin verification or onboarding restart semantics can break the downstream tenant-auth onboarding flow.
  - Changing the auth bootstrap reader seam can break tenant-auth access grant and password setup flows.

### tenantAuth

- Manifest: `src/features/tenantAuth/feature.manifest.json`
- Source files: 13
- Declared dependencies: tenantAdmins, tenantConfiguration, tenants
- Current public dependencies: tenantAdmins, tenantConfiguration, tenants
- Private seam violations: 0
- Depended on by: tenantAdmins, tenantConfiguration
- Public seams:
  - `feature-factory` via `createTenantAuthFeature` in `index.ts` (feature-factory, stable)
  - `session-lookup-repository-factory` via `createTenantAuthSessionLookupRepository` in `index.ts` (repository-factory, stable)
  - `session-lookup-repository-type` via `TenantAuthSessionLookupRepository` in `index.ts` (repository-type, stable)
  - `onboarding-provisioner-type` via `TenantAuthOnboardingProvisioner` in `index.ts` (service-type, stable)
- Breaking-change risks:
  - Changing tenant-auth session or remediation semantics can break tenant-scoped browser and API authentication flows.
  - Changing exported onboarding or session lookup seams can break tenantAdmins and tenantConfiguration integration.

### tenantConfiguration

- Manifest: `src/features/tenantConfiguration/feature.manifest.json`
- Source files: 12
- Declared dependencies: tenantAuth, tenants
- Current public dependencies: tenantAuth, tenants
- Private seam violations: 0
- Depended on by: tenantAuth
- Public seams:
  - `feature-factory` via `createTenantConfigurationFeature` in `index.ts` (feature-factory, stable)
  - `tenant-auth-policy-resolver` via `TenantAuthPolicyResolver` in `index.ts` (policy-seam, stable)
  - `effective-tenant-auth-policy-type` via `EffectiveTenantAuthPolicy` in `index.ts` (contract-type, stable)
  - `effective-tenant-password-policy-type` via `EffectiveTenantPasswordPolicy` in `index.ts` (contract-type, stable)
  - `effective-tenant-session-policy-type` via `EffectiveTenantSessionPolicy` in `index.ts` (contract-type, stable)
  - `password-policy-floor-constants` via `HARD_PASSWORD_POLICY_FLOORS` in `index.ts` (constants, stable)
  - `session-ttl-limit-constants` via `SESSION_TTL_SECONDS_HARD_FLOOR | SESSION_TTL_SECONDS_HARD_CEILING` in `index.ts` (constants, stable)
  - `system-default-policy-constants` via `SYSTEM_DEFAULT_PASSWORD_POLICY | SYSTEM_DEFAULT_SESSION_POLICY` in `index.ts` (constants, stable)
- Breaking-change risks:
  - Changing tenant auth policy response or resolver semantics can break tenantAuth policy evaluation and remediation flows.
  - Changing tenant policy persistence or normalization rules can break durable configuration behavior across tenant-scoped authentication.

### tenants

- Manifest: `src/features/tenants/feature.manifest.json`
- Source files: 22
- Declared dependencies: none
- Current public dependencies: none
- Private seam violations: 0
- Depended on by: tenantAdmins, tenantAuth, tenantConfiguration
- Public seams:
  - `feature-factory` via `createTenantsFeature` in `index.ts` (feature-factory, stable)
  - `visible-tenants-reader` via `createVisibleTenantsReader | VisibleTenantsReader` in `index.ts` (reader-seam, stable)
  - `visible-tenant-summary-type` via `VisibleTenantSummary` in `index.ts` (domain-type, stable)
- Breaking-change risks:
  - Changing tenant visibility or lifecycle semantics can break tenant-admin, tenant-auth, and tenant-configuration flows that depend on current active tenant context.
  - Changing the visible-tenants reader contract can break every feature that validates tenant context through this shared seam.

### webAppHierarchyBuilder

- Manifest: `src/features/webAppHierarchyBuilder/feature.manifest.json`
- Source files: 28
- Declared dependencies: webAppSurfaceDiscovery
- Current public dependencies: webAppSurfaceDiscovery
- Private seam violations: 0
- Depended on by: webAppPageSettings
- Public seams:
  - `feature-factory` via `createWebAppHierarchyBuilderFeature` in `index.ts` (feature-factory, stable)
  - `hierarchy-integration-seam-factory` via `createWebAppHierarchyIntegrationSeam` in `index.ts` (integration-seam-factory, stable)
  - `hierarchy-integration-seam` via `WebAppHierarchyIntegrationSeam | WebAppHierarchySettingsSelectablePage` in `index.ts` (integration-seam, stable)
  - `hierarchy-contract-types` via `PlannerSelectableHierarchyNode | ResolvedWebAppHierarchyTree | WebAppModule | WebAppPage | WebAppPageLocator | WebAppRootFamily` in `index.ts` (contract-types, stable)
- Breaking-change risks:
  - Changing hierarchy integration seam behavior can break webAppPageSettings and any future feature that reads curated page topology through this seam.
  - Changing curated hierarchy persistence or locator semantics can break governed route compatibility and discovery reconciliation.

### webAppPageSettings

- Manifest: `src/features/webAppPageSettings/feature.manifest.json`
- Source files: 21
- Declared dependencies: webAppHierarchyBuilder
- Current public dependencies: webAppHierarchyBuilder
- Private seam violations: 0
- Depended on by: none
- Public seams:
  - `feature-factory` via `createWebAppPageSettingsFeature` in `index.ts` (feature-factory, stable)
  - `public-feature-factory` via `createPublicWebAppPageSettingsFeature` in `index.ts` (feature-factory, stable)
  - `page-settings-contract-types` via `ApprovedIconCatalogEntryResponse | ApprovedPageTemplateCatalogEntryResponse | PublicDesignSystemTopNavResponse | SelectablePageOptionResponse | WebAppPageContextNavProjectionResponse | WebAppPageSettingsResponse` in `index.ts` (contract-types, stable)
- Breaking-change risks:
  - Changing page settings response shape or context-nav projection semantics can break governed app surfaces that consume these durable settings.
  - Changing page settings behavior without compatibility planning can break curated hierarchy adoption flows that rely on stable page identifiers and relationships.

### webAppSurfaceDiscovery

- Manifest: `src/features/webAppSurfaceDiscovery/feature.manifest.json`
- Source files: 18
- Declared dependencies: none
- Current public dependencies: none
- Private seam violations: 0
- Depended on by: webAppHierarchyBuilder
- Public seams:
  - `feature-factory` via `createWebAppSurfaceDiscoveryFeature` in `index.ts` (feature-factory, stable)
  - `surface-discovery-integration-seam-factory` via `createWebAppSurfaceDiscoveryIntegrationSeam` in `index.ts` (integration-seam-factory, stable)
  - `surface-discovery-integration-seam` via `WebAppSurfaceDiscoveryIntegrationSeam` in `index.ts` (integration-seam, stable)
  - `discovery-contract-types` via `DiscoveredWebAppStructureNodeResponse | DiscoveredWebAppSurfaceResponse | WebAppDiscoveryRunResponse` in `index.ts` (contract-types, stable)
  - `discovery-data-types` via `DiscoveredWebAppSurfaceData | DiscoveredWebAppStructureNodeData | WebAppDiscoveryRunData` in `index.ts` (domain-types, stable)
- Breaking-change risks:
  - Changing discovery structure or discovered-surface data semantics can break webAppHierarchyBuilder reconciliation and preview logic.
  - Changing approved discovery run behavior can break operator workflows that depend on stable discovery scope and output shape.

## Dependency Edges

### notificationDelivery -> jobProcessing

- Declared in manifest: yes
- Declared seam ids: enqueue-service, job-registry
- Public imports: 2
- Private imports: 0

- `src/features/notificationDelivery/domain/jobTypes.ts:1` imports `../../jobProcessing` -> `src/features/jobProcessing/index.ts` (public)
- `src/features/notificationDelivery/emailWriter.ts:3` imports `../jobProcessing` -> `src/features/jobProcessing/index.ts` (public)

### rootAuth -> rootUsers

- Declared in manifest: yes
- Declared seam ids: auth-state-reader, browser-summary-reader, root-user-auth-state-type
- Public imports: 4
- Private imports: 0

- `src/features/rootAuth/domain/rootUserAccess.ts:2` imports `../../rootUsers` -> `src/features/rootUsers/index.ts` (public)
- `src/features/rootAuth/domain/service.ts:5` imports `../../rootUsers` -> `src/features/rootUsers/index.ts` (public)
- `src/features/rootAuth/integration.ts:2` imports `../rootUsers` -> `src/features/rootUsers/index.ts` (public)
- `src/features/rootAuth/transport/router.ts:32` imports `../../rootUsers` -> `src/features/rootUsers/index.ts` (public)

### rootRoles -> rootUsers

- Declared in manifest: yes
- Declared seam ids: auth-state-reader
- Public imports: 1
- Private imports: 0

- `src/features/rootRoles/integration.ts:2` imports `../rootUsers` -> `src/features/rootUsers/index.ts` (public)

### tenantAdmins -> notificationDelivery

- Declared in manifest: yes
- Declared seam ids: notification-email-writer, notification-delivery-error
- Public imports: 3
- Private imports: 0

- `src/features/tenantAdmins/domain/service.ts:4` imports `../../notificationDelivery` -> `src/features/notificationDelivery/index.ts` (public)
- `src/features/tenantAdmins/integration.ts:4` imports `../notificationDelivery` -> `src/features/notificationDelivery/index.ts` (public)
- `src/features/tenantAdmins/transport/router.ts:12` imports `../../notificationDelivery` -> `src/features/notificationDelivery/index.ts` (public)

### tenantAdmins -> tenantAuth

- Declared in manifest: yes
- Declared seam ids: onboarding-provisioner-type
- Public imports: 2
- Private imports: 0

- `src/features/tenantAdmins/domain/service.ts:25` imports `../../tenantAuth` -> `src/features/tenantAuth/index.ts` (public)
- `src/features/tenantAdmins/integration.ts:5` imports `../tenantAuth` -> `src/features/tenantAuth/index.ts` (public)

### tenantAdmins -> tenants

- Declared in manifest: yes
- Declared seam ids: visible-tenants-reader
- Public imports: 2
- Private imports: 0

- `src/features/tenantAdmins/domain/service.ts:5` imports `../../tenants` -> `src/features/tenants/index.ts` (public)
- `src/features/tenantAdmins/integration.ts:6` imports `../tenants` -> `src/features/tenants/index.ts` (public)

### tenantAuth -> tenantAdmins

- Declared in manifest: yes
- Declared seam ids: auth-bootstrap-reader, tenant-admin-auth-bootstrap-subject
- Public imports: 2
- Private imports: 0

- `src/features/tenantAuth/domain/service.ts:8` imports `../../tenantAdmins` -> `src/features/tenantAdmins/index.ts` (public)
- `src/features/tenantAuth/integration.ts:4` imports `../tenantAdmins` -> `src/features/tenantAdmins/index.ts` (public)

### tenantAuth -> tenantConfiguration

- Declared in manifest: yes
- Declared seam ids: tenant-auth-policy-resolver, effective-tenant-password-policy-type, password-policy-floor-constants, session-ttl-limit-constants, system-default-policy-constants
- Public imports: 5
- Private imports: 0

- `src/features/tenantAuth/contract/types.ts:1` imports `../../tenantConfiguration` -> `src/features/tenantConfiguration/index.ts` (public)
- `src/features/tenantAuth/domain/presenters.ts:8` imports `../../tenantConfiguration` -> `src/features/tenantConfiguration/index.ts` (public)
- `src/features/tenantAuth/domain/service.ts:10` imports `../../tenantConfiguration` -> `src/features/tenantConfiguration/index.ts` (public)
- `src/features/tenantAuth/domain/types.ts:11` imports `../../tenantConfiguration` -> `src/features/tenantConfiguration/index.ts` (public)
- `src/features/tenantAuth/integration.ts:3` imports `../tenantConfiguration` -> `src/features/tenantConfiguration/index.ts` (public)

### tenantAuth -> tenants

- Declared in manifest: yes
- Declared seam ids: visible-tenants-reader
- Public imports: 2
- Private imports: 0

- `src/features/tenantAuth/domain/service.ts:9` imports `../../tenants` -> `src/features/tenants/index.ts` (public)
- `src/features/tenantAuth/integration.ts:7` imports `../tenants` -> `src/features/tenants/index.ts` (public)

### tenantConfiguration -> tenantAuth

- Declared in manifest: yes
- Declared seam ids: session-lookup-repository-factory, session-lookup-repository-type
- Public imports: 2
- Private imports: 0

- `src/features/tenantConfiguration/integration.ts:4` imports `../tenantAuth` -> `src/features/tenantAuth/index.ts` (public)
- `src/features/tenantConfiguration/transport/router.ts:8` imports `../../tenantAuth` -> `src/features/tenantAuth/index.ts` (public)

### tenantConfiguration -> tenants

- Declared in manifest: yes
- Declared seam ids: visible-tenants-reader
- Public imports: 2
- Private imports: 0

- `src/features/tenantConfiguration/domain/service.ts:12` imports `../../tenants` -> `src/features/tenants/index.ts` (public)
- `src/features/tenantConfiguration/integration.ts:5` imports `../tenants` -> `src/features/tenants/index.ts` (public)

### webAppHierarchyBuilder -> webAppSurfaceDiscovery

- Declared in manifest: yes
- Declared seam ids: surface-discovery-integration-seam-factory, surface-discovery-integration-seam, discovery-data-types
- Public imports: 5
- Private imports: 0

- `src/features/webAppHierarchyBuilder/domain/service.ts:55` imports `../../webAppSurfaceDiscovery` -> `src/features/webAppSurfaceDiscovery/index.ts` (public)
- `src/features/webAppHierarchyBuilder/domain/structureAwareDiscoverySync.ts:1` imports `../../webAppSurfaceDiscovery` -> `src/features/webAppSurfaceDiscovery/index.ts` (public)
- `src/features/webAppHierarchyBuilder/domain/structureAwareDiscoverySync.ts:2` imports `../../webAppSurfaceDiscovery` -> `src/features/webAppSurfaceDiscovery/index.ts` (public)
- `src/features/webAppHierarchyBuilder/domain/syncWebAppHierarchyFromDiscovery.ts:1` imports `../../webAppSurfaceDiscovery` -> `src/features/webAppSurfaceDiscovery/index.ts` (public)
- `src/features/webAppHierarchyBuilder/integration.ts:4` imports `../webAppSurfaceDiscovery` -> `src/features/webAppSurfaceDiscovery/index.ts` (public)

### webAppPageSettings -> webAppHierarchyBuilder

- Declared in manifest: yes
- Declared seam ids: hierarchy-integration-seam-factory, hierarchy-integration-seam, hierarchy-contract-types
- Public imports: 9
- Private imports: 0

- `src/features/webAppPageSettings/domain/getPublicDesignSystemPageSettings.ts:5` imports `../../webAppHierarchyBuilder` -> `src/features/webAppHierarchyBuilder/index.ts` (public)
- `src/features/webAppPageSettings/domain/getPublicDesignSystemTopNav.ts:3` imports `../../webAppHierarchyBuilder` -> `src/features/webAppHierarchyBuilder/index.ts` (public)
- `src/features/webAppPageSettings/domain/getWebAppPageContextNavProjection.ts:4` imports `../../webAppHierarchyBuilder` -> `src/features/webAppHierarchyBuilder/index.ts` (public)
- `src/features/webAppPageSettings/domain/getWebAppPageSettings.ts:5` imports `../../webAppHierarchyBuilder` -> `src/features/webAppHierarchyBuilder/index.ts` (public)
- `src/features/webAppPageSettings/domain/getWebAppPageSettingsOptions.ts:5` imports `../../webAppHierarchyBuilder` -> `src/features/webAppHierarchyBuilder/index.ts` (public)
- `src/features/webAppPageSettings/domain/presenters.ts:12` imports `../../webAppHierarchyBuilder` -> `src/features/webAppHierarchyBuilder/index.ts` (public)
- `src/features/webAppPageSettings/domain/service.ts:18` imports `../../webAppHierarchyBuilder` -> `src/features/webAppHierarchyBuilder/index.ts` (public)
- `src/features/webAppPageSettings/domain/updateWebAppPageSettings.ts:12` imports `../../webAppHierarchyBuilder` -> `src/features/webAppHierarchyBuilder/index.ts` (public)
- `src/features/webAppPageSettings/integration.ts:4` imports `../webAppHierarchyBuilder` -> `src/features/webAppHierarchyBuilder/index.ts` (public)

## Violations

- None.

