import { afterEach, describe, expect, it } from "vitest";
import { env } from "../../../src/config/env";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryWebAppHierarchyRepository,
  createStubWebAppSurfaceDiscoveryIntegrationSeam,
  createModuleRecord,
  createPageRecord,
  loginViaPasswordAndSsh,
  mountWebAppHierarchyBuilderFeature,
} from "../../helpers/webAppHierarchyBuilderHarness";

interface ErrorResponse {
  code: string;
  details?: { field?: string; reason?: string };
}

function snapshotPlatformSecurityConfig() {
  return {
    enabled: env.platformSecurity.enabled,
    authenticatedGeneral: { ...env.platformSecurity.rateLimitPolicies.authenticatedGeneral },
  };
}

const originalPlatformSecurityConfig = snapshotPlatformSecurityConfig();
const mutablePlatformSecurity = env.platformSecurity as {
  enabled: boolean;
  rateLimitPolicies: {
    authenticatedGeneral: { windowSeconds: number; maxAttempts: number };
  };
};

function restorePlatformSecurityConfig() {
  mutablePlatformSecurity.enabled = originalPlatformSecurityConfig.enabled;
  Object.assign(
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral,
    originalPlatformSecurityConfig.authenticatedGeneral,
  );
}

afterEach(() => {
  restorePlatformSecurityConfig();
});

describe("web app hierarchy builder security flows", () => {
  it("TC-WEB-APP-HIER-SEC-001 rejects missing or invalid authenticated sessions", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
    );

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree",
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");
  });

  it("TC-WEB-APP-HIER-SEC-002 enforces per-route capability gates", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const allowed = await invokeJson<{ rootFamilies: unknown[] }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(allowed.status).toBe(200);

    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-hierarchy.list-orphans"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-WEB-APP-HIER-SEC-003 rejects unexpected system-managed fields on create", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository({
        modules: [createModuleRecord()],
      }),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const invalid = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/pages",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        pageKey: "catalog-settings",
        displayLabel: "Catalog Settings",
        routeSegment: "settings",
        createdByRootAdminUserId: identity.rootUserId,
      },
    });
    expect(invalid.status).toBe(400);
    expect(invalid.body).toMatchObject({
      code: "INVALID_REQUEST",
      details: {
        field: "createdByRootAdminUserId",
        reason: "unexpected_field",
      },
    });
  });

  it("TC-WEB-APP-HIER-SEC-006 enforces the dedicated preview, apply, and link-status capability gates", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-hierarchy.read-tree"]);

    const deniedPreview = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/preview",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(deniedPreview.status).toBe(403);
    expect(deniedPreview.body.code).toBe("FORBIDDEN");

    const deniedApply = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/apply",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        includeInactive: false,
        includeOrphaned: false,
      },
    });
    expect(deniedApply.status).toBe(403);
    expect(deniedApply.body.code).toBe("FORBIDDEN");

    const deniedLinks = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/discovery-links",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(deniedLinks.status).toBe(403);
    expect(deniedLinks.body.code).toBe("FORBIDDEN");
  });

  it("TC-DESIGN-SYS-TOPO-SEC-001 enforces the design-system create preview and apply capability gates", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository({
        modules: [
          createModuleRecord({
            webAppModuleId: "99999999-1111-4111-8111-111111111111",
            rootFamilyId: "design-system",
            moduleKey: "patterns",
            displayLabel: "Patterns",
          }),
        ],
        pages: [
          createPageRecord({
            webAppPageId: "99999999-2222-4222-8222-222222222222",
            rootFamilyId: "design-system",
            webAppModuleId: "99999999-1111-4111-8111-111111111111",
            pageKey: "design-system-patterns",
            displayLabel: "Patterns",
            routeSegment: "patterns",
            normalizedRouteSegment: "patterns",
            resolvedFullRoutePath: "/design-system/patterns",
            topologyState: "applied",
          }),
        ],
      }),
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-hierarchy.read-tree"]);

    const deniedCreate = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/design-system/subpages",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        parentPageId: "99999999-2222-4222-8222-222222222222",
        displayLabel: "New Pattern",
        routeSegment: "new-pattern",
        templateKey: "static-html-page",
      },
    });
    expect(deniedCreate.status).toBe(403);

    harness.setRootUserCapabilities(identity.rootUserId, [
      "web-app-hierarchy.read-tree",
      "web-app-hierarchy.create-design-system-subpage",
    ]);

    const created = await invokeJson<{ proposalPage: { webAppPageId: string } }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/design-system/subpages",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        parentPageId: "99999999-2222-4222-8222-222222222222",
        displayLabel: "New Pattern",
        routeSegment: "new-pattern",
        templateKey: "static-html-page",
      },
    });
    expect(created.status).toBe(201);

    const deniedPreview = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/design-system/materialization/preview",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        proposalPageIds: [created.body.proposalPage.webAppPageId],
      },
    });
    expect(deniedPreview.status).toBe(403);

    harness.setRootUserCapabilities(identity.rootUserId, [
      "web-app-hierarchy.read-tree",
      "web-app-hierarchy.create-design-system-subpage",
      "web-app-hierarchy.preview-design-system-materialization",
    ]);

    const preview = await invokeJson<{ previewHash: string }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/design-system/materialization/preview",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        proposalPageIds: [created.body.proposalPage.webAppPageId],
      },
    });
    expect(preview.status).toBe(200);

    const deniedApply = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/design-system/materialization/apply",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        proposalPageIds: [created.body.proposalPage.webAppPageId],
        previewHash: preview.body.previewHash,
      },
    });
    expect(deniedApply.status).toBe(403);
  });

  it("TC-WEB-APP-HIER-SEC-007 enforces the dedicated module landing-page capability and exact payload contract", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository({
        modules: [createModuleRecord()],
        pages: [createPageRecord()],
      }),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-hierarchy.update-module"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "PATCH",
      path: "/v1/web-app-hierarchy/modules/11111111-1111-4111-8111-111111111111/landing-page",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        landingPageWebAppPageId: "22222222-2222-4222-8222-222222222222",
      },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");

    harness.setRootUserCapabilities(identity.rootUserId, [
      "web-app-hierarchy.update-module-landing-page",
    ]);

    const invalid = await invokeJson<ErrorResponse>(harness.app, {
      method: "PATCH",
      path: "/v1/web-app-hierarchy/modules/11111111-1111-4111-8111-111111111111/landing-page",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        landingPageWebAppPageId: "22222222-2222-4222-8222-222222222222",
        updatedAt: "2026-04-20T00:00:00.000Z",
      },
    });
    expect(invalid.status).toBe(400);
    expect(invalid.body).toMatchObject({
      code: "INVALID_REQUEST",
      details: {
        field: "updatedAt",
        reason: "unexpected_field",
      },
    });
  });
});
