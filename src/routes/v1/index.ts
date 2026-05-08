import { Router } from "express";
import { createRootAuthFeature } from "../../features/rootAuth";
import { createRootRolesFeature } from "../../features/rootRoles";
import { createRootUserFeature } from "../../features/rootUsers";
import { createTenantsFeature } from "../../features/tenants";
import { createNotificationDeliveryFeature } from "../../features/notificationDelivery";
import { createHarnessChatFeature } from "../../features/harnessChat";
import { createTenantAdminsFeature } from "../../features/tenantAdmins";
import { createTenantAuthFeature } from "../../features/tenantAuth";
import { createTenantConfigurationFeature } from "../../features/tenantConfiguration";
import {
  createPublicWebAppHierarchyBuilderFeature,
  createWebAppHierarchyBuilderFeature,
} from "../../features/webAppHierarchyBuilder";
import {
  createPublicWebAppPageSettingsFeature,
  createWebAppPageSettingsFeature,
} from "../../features/webAppPageSettings";
import { createEntityBuilderFeature } from "../../features/entityBuilder";
import { createWebAppSurfaceDiscoveryFeature } from "../../features/webAppSurfaceDiscovery";
import { createDesignSystemCanonicalsFeature } from "../../features/designSystemCanonicals";
import { createCapabilityContractCatalogFeature } from "../../features/capabilityContractCatalog";
import { createAssetsFeature } from "../../features/assets";
import { createPostgresRootAuthRepository } from "../../features/rootAuth/persistence/postgresRepository";
import { createPostgresPlatformSecurityRepository } from "../../lib/security/postgresRepository";
import { dbPool } from "../../lib/db";
import { createRequireRootSession } from "../../lib/auth/middleware";
import { createRateLimitMiddleware } from "../../lib/security/rateLimit";
import { env } from "../../config/env";

export const v1Router = Router();
const rootAuthRepository = createPostgresRootAuthRepository(dbPool);
const platformSecurityRepository = createPostgresPlatformSecurityRepository(dbPool);
const requireRootSession = createRequireRootSession(rootAuthRepository, {
  allowBrowserCookie: true,
});
const rootRolesFeature = createRootRolesFeature(dbPool, platformSecurityRepository);
const tenantConfigurationFeature = createTenantConfigurationFeature(
  dbPool,
  rootRolesFeature.capabilityChecker,
  platformSecurityRepository,
);
const tenantAuthFeature = createTenantAuthFeature(
  dbPool,
  platformSecurityRepository,
  tenantConfigurationFeature.policyResolver,
);
const assetsFeature = createAssetsFeature(
  dbPool,
  rootRolesFeature.capabilityChecker,
  platformSecurityRepository,
);
const tenantAdminsFeature = createTenantAdminsFeature(
  dbPool,
  rootRolesFeature.capabilityChecker,
  platformSecurityRepository,
  tenantAuthFeature.onboardingProvisioner,
  assetsFeature.assetsService,
);
const publicReadRateLimit = createRateLimitMiddleware({
  enabled: env.platformSecurity.enabled,
  repository: platformSecurityRepository,
  policy: {
    endpointClass: "public-read",
    windowSeconds: env.platformSecurity.rateLimitPolicies.publicRead.windowSeconds,
    maxAttempts: env.platformSecurity.rateLimitPolicies.publicRead.maxAttempts,
    responseCode: "RATE_LIMITED",
    responseMessage: "Too many requests. Please wait and try again.",
  },
  subjectScope: "ip",
  getSubjectKey: (request) => request.ip ?? null,
});
const authenticatedGeneralRateLimit = createRateLimitMiddleware({
  enabled: env.platformSecurity.enabled,
  repository: platformSecurityRepository,
  policy: {
    endpointClass: "authenticated-general",
    windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
    maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
    responseCode: "RATE_LIMITED",
    responseMessage: "Too many requests. Please wait and try again.",
  },
  subjectScope: "auth_user",
  getSubjectKey: (request) =>
    request.rootSession ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}` : null,
});

v1Router.get("/health", publicReadRateLimit, (_request, response) => {
  response.status(200).json({ ok: true });
});

v1Router.use(
  "/root-auth",
  createRootAuthFeature(dbPool, platformSecurityRepository, rootRolesFeature.capabilityChecker),
);
v1Router.use(
  "/root-roles",
  requireRootSession,
  authenticatedGeneralRateLimit,
  rootRolesFeature.rootRolesRouter,
);
v1Router.use(
  "/root-users",
  requireRootSession,
  authenticatedGeneralRateLimit,
  rootRolesFeature.rootUserRoleAssignmentsRouter,
  createRootUserFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
    assetsFeature.assetsService,
  ),
);
v1Router.use(
  "/tenant-admin-verification",
  tenantAdminsFeature.tenantAdminVerificationRouter,
);
v1Router.use(
  "/tenant-auth",
  tenantAuthFeature.tenantAuthRouter,
);
v1Router.use(
  "/tenant/auth-policy",
  tenantConfigurationFeature.tenantTenantConfigurationRouter,
);
v1Router.use(
  "/tenants/:tenantId/auth-policy",
  requireRootSession,
  authenticatedGeneralRateLimit,
  tenantConfigurationFeature.rootTenantConfigurationRouter,
);
v1Router.use(
  "/tenants/:tenantId/admins",
  requireRootSession,
  authenticatedGeneralRateLimit,
  tenantAdminsFeature.tenantAdminsRouter,
);
v1Router.use(
  "/tenants",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createTenantsFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
  ),
);
v1Router.use(
  "/web-app-hierarchy/public",
  publicReadRateLimit,
  createPublicWebAppHierarchyBuilderFeature(
    dbPool,
  ),
);
v1Router.use(
  "/web-app-hierarchy",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createWebAppHierarchyBuilderFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
  ),
);
v1Router.use(
  "/web-app-page-settings/public",
  publicReadRateLimit,
  createPublicWebAppPageSettingsFeature(
    dbPool,
  ),
);
v1Router.use(
  "/web-app-page-settings",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createWebAppPageSettingsFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
  ),
);
v1Router.use(
  "/entity-definitions",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createEntityBuilderFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
  ),
);
v1Router.use(
  "/web-app-surface-discovery",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createWebAppSurfaceDiscoveryFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
  ),
);
v1Router.use(
  "/design-system-canonicals",
  createDesignSystemCanonicalsFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
  ),
);
v1Router.use(
  "/notification-delivery",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createNotificationDeliveryFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
  ),
);
v1Router.use(
  "/capability-contract-catalog",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createCapabilityContractCatalogFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
  ),
);
v1Router.use(
  "/root-admin/harness-chat",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createHarnessChatFeature(
    dbPool,
    rootRolesFeature.capabilityChecker,
    platformSecurityRepository,
  ),
);
v1Router.use(
  "/assets",
  requireRootSession,
  authenticatedGeneralRateLimit,
  assetsFeature.assetsRouter,
);
