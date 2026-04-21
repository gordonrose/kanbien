import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryWebAppHierarchyRepository,
  createStubWebAppSurfaceDiscoveryIntegrationSeam,
  createModuleRecord,
  loginViaPasswordAndSsh,
  mountWebAppHierarchyBuilderFeature,
} from "../../helpers/webAppHierarchyBuilderHarness";
import { createDiscoveredSurfaceRecord } from "../../helpers/webAppSurfaceDiscoveryHarness";

interface PageResponse {
  webAppPageId: string;
  pageKey: string;
  createdByRootAdminUserId: string;
  resolvedFullRoutePath: string | null;
}

interface ErrorResponse {
  code: string;
}

describe("web app hierarchy builder audit visibility", () => {
  it("TC-WEB-APP-HIERARCHY-AUD-001 keeps successful hierarchy mutations operator-visible through backend responses", async () => {
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

    const created = await invokeJson<PageResponse>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/pages",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        pageKey: "catalog-settings",
        displayLabel: "Catalog Settings",
        routeSegment: "settings",
      },
    });

    expect(created.status).toBe(201);
    expect(created.body.createdByRootAdminUserId).toBe(identity.rootUserId);
    expect(created.body.resolvedFullRoutePath).toBe("/root-admin/settings");
  });

  it("TC-WEB-APP-HIERARCHY-AUD-002 keeps denied privileged actions visible through platform security audit events", async () => {
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

    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-hierarchy.read-tree"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/pages",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        pageKey: "catalog-settings",
        displayLabel: "Catalog Settings",
        routeSegment: "settings",
      },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "root_capability_denied",
          eventOutcome: "failure",
          rootUserId: identity.rootUserId,
          authPrincipalId: identity.authPrincipalId,
        }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-AUD-005 keeps successful structure-aware apply operator-visible through its summary response", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
      createStubWebAppSurfaceDiscoveryIntegrationSeam({
        async listDiscoveredWebAppSurfaces() {
          return [
            createDiscoveredSurfaceRecord({
              discoveredWebAppSurfaceId: "44444444-4444-4444-8444-444444444444",
              rootFamilyId: "design-system",
              routePath: "/design-system/components/top-nav",
              canonicalLocator: "/design-system/components/top-nav",
              displayLabel: "Top Nav",
              surfaceKind: "page-route",
              locatorType: "path",
              userFacingDisposition: "user-facing",
            }),
          ];
        },
      }),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<{
      applySummary: { createdPageCount: number; refreshedLocatorCount: number };
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/apply",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        includeInactive: false,
        includeOrphaned: false,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.applySummary).toMatchObject({
      createdPageCount: 1,
      refreshedLocatorCount: 1,
    });
  });

  it("TC-WEB-APP-HIER-AUD-006 keeps denied preview actions visible through platform security audit events", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-hierarchy.read-tree"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/preview",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "root_capability_denied",
          eventOutcome: "failure",
          rootUserId: identity.rootUserId,
          authPrincipalId: identity.authPrincipalId,
        }),
      ]),
    );
  });
});
