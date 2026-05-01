import { describe, expect, it } from "vitest";
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
  it("TC-WEB-APP-HIER-AUD-001 keeps successful hierarchy mutations durably queryable", async () => {
    const harness = createRootAuthIntegrationHarness();
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
    });
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      repository,
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

    expect(await repository.listAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorRootUserId: identity.rootUserId,
          eventType: "web_app_hierarchy.page_created",
          eventOutcome: "success",
          rootFamilyId: "root-admin",
          webAppModuleId: "11111111-1111-4111-8111-111111111111",
          webAppPageId: created.body.webAppPageId,
          afterState: expect.objectContaining({
            pageKey: "catalog-settings",
            resolvedFullRoutePath: "/root-admin/settings",
          }),
        }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-AUD-002 keeps denied privileged actions visible through platform security audit events", async () => {
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

  it("TC-WEB-APP-HIER-AUD-003 and TC-WEB-APP-HIER-AUD-004 keep move and bootstrap context operator-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [createPageRecord()],
    });
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      repository,
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const before = await invokeJson<{
      rootFamilies: Array<{ rootFamilyId: string; modules: Array<{ pages: Array<{ pageKey: string; resolvedFullRoutePath: string | null }> }> }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(before.body.rootFamilies[0]?.modules[0]?.pages[0]).toMatchObject({
      pageKey: "catalog-home",
      resolvedFullRoutePath: "/root-admin/catalog",
    });

    const moved = await invokeJson<PageResponse & { placementType: string; rootFamilyId: string }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/pages/22222222-2222-4222-8222-222222222222/move",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        placementType: "orphaned",
      },
    });
    expect(moved.status).toBe(200);
    expect(moved.body).toMatchObject({
      rootFamilyId: "root-admin",
      webAppPageId: "22222222-2222-4222-8222-222222222222",
      placementType: "orphaned",
      resolvedFullRoutePath: null,
    });
    expect(
      await repository.listAuditEvents({
        eventType: "web_app_hierarchy.page_moved",
        webAppPageId: "22222222-2222-4222-8222-222222222222",
      }),
    ).toEqual([
      expect.objectContaining({
        actorRootUserId: identity.rootUserId,
        rootFamilyId: "root-admin",
        beforeState: expect.objectContaining({
          placementType: "module-root",
          resolvedFullRoutePath: "/root-admin/catalog",
        }),
        afterState: expect.objectContaining({
          placementType: "orphaned",
          resolvedFullRoutePath: null,
        }),
      }),
    ]);

    const bootstrapped = await invokeJson<{
      rootFamilies: Array<{ rootFamilyId: string; modules: Array<{ moduleKey: string; pages: Array<{ pageKey: string }> }> }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/bootstrap",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        observedRootFamilies: [
          {
            rootFamilyId: "design-system",
            modules: [
              {
                moduleKey: "patterns",
                displayLabel: "Patterns",
                pages: [
                  {
                    pageKey: "patterns-home",
                    displayLabel: "Patterns Home",
                    routeSegment: "patterns",
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    expect(bootstrapped.status).toBe(200);
    expect(bootstrapped.body.rootFamilies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rootFamilyId: "design-system",
          modules: expect.arrayContaining([
            expect.objectContaining({
              moduleKey: "patterns",
              pages: [expect.objectContaining({ pageKey: "patterns-home" })],
            }),
          ]),
        }),
      ]),
    );
    expect(
      await repository.listAuditEvents({
        eventType: "web_app_hierarchy.bootstrap_applied",
        rootFamilyId: "design-system",
      }),
    ).toEqual([
      expect.objectContaining({
        actorRootUserId: identity.rootUserId,
        afterState: expect.objectContaining({
          rootFamilyIds: ["design-system"],
          moduleCount: expect.any(Number),
          pageCount: expect.any(Number),
        }),
      }),
    ]);
  });

  it("TC-WEB-APP-HIER-AUD-005 keeps successful structure-aware apply durably queryable with summary evidence", async () => {
    const harness = createRootAuthIntegrationHarness();
    const repository = createInMemoryWebAppHierarchyRepository();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      repository,
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
    expect(
      await repository.listAuditEvents({
        eventType: "web_app_hierarchy.discovery_sync_applied",
        rootFamilyId: "design-system",
      }),
    ).toEqual([
      expect.objectContaining({
        actorRootUserId: identity.rootUserId,
        afterState: expect.objectContaining({
          applySummary: expect.objectContaining({
            createdPageCount: 1,
            refreshedLocatorCount: 1,
          }),
          rootFamilyIds: ["design-system"],
        }),
      }),
    ]);
  });

  it("TC-WEB-APP-HIER-AUD-006 and TC-ROOT-PATH-AUD-002 keep denied preview actions visible through platform security audit events", async () => {
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
