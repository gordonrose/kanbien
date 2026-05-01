import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryWebAppHierarchyRepository,
  createStubDesignSystemCanonicalsPublicSeam,
  createStubWebAppSurfaceDiscoveryIntegrationSeam,
  createDiscoveryLinkRecord,
  createModuleRecord,
  createPageLocatorRecord,
  createPageRecord,
  loginViaPasswordAndSsh,
  mountWebAppHierarchyBuilderFeature,
} from "../../helpers/webAppHierarchyBuilderHarness";
import { createDiscoveredSurfaceRecord } from "../../helpers/webAppSurfaceDiscoveryHarness";

describe("web app hierarchy builder integration flows", () => {
  it("TC-WEB-APP-HIER-INT-001 lets a capable root operator manage modules and pages through protected routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const module = await invokeJson<{ webAppModuleId: string }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/modules",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        moduleKey: "operators",
        displayLabel: "Operators",
      },
    });
    expect(module.status).toBe(201);

    const page = await invokeJson<{ webAppPageId: string; resolvedFullRoutePath: string }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/pages",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        webAppModuleId: module.body.webAppModuleId,
        pageKey: "operators-home",
        displayLabel: "Operators Home",
        routeSegment: "operators",
      },
    });
    expect(page.status).toBe(201);
    expect(page.body.resolvedFullRoutePath).toBe("/root-admin/operators");

    const moved = await invokeJson<{ placementType: string; resolvedFullRoutePath: string | null }>(harness.app, {
      method: "POST",
      path: `/v1/web-app-hierarchy/pages/${page.body.webAppPageId}/move`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        webAppModuleId: module.body.webAppModuleId,
        placementType: "orphaned",
      },
    });
    expect(moved.status).toBe(200);
    expect(moved.body).toMatchObject({ placementType: "orphaned", resolvedFullRoutePath: null });

    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-hierarchy.read-tree"]);
    const denied = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/pages",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        webAppModuleId: module.body.webAppModuleId,
        pageKey: "blocked",
        displayLabel: "Blocked",
        routeSegment: "blocked",
      },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-WEB-APP-HIER-INT-002 keeps planner-selectable values aligned with durable hierarchy changes", async () => {
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

    const planner = await invokeJson<{ items?: unknown[] } | Array<{ pageKey: string | null }>>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/planner-nodes",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(planner.status).toBe(200);
    const nodes = Array.isArray(planner.body) ? planner.body : [];
    expect(nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nodeType: "page",
          pageKey: "catalog-home",
          resolvedFullRoutePath: "/root-admin/catalog",
        }),
      ]),
    );

    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/pages/22222222-2222-4222-8222-222222222222/move",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        placementType: "orphaned",
      },
    });
    const afterMove = await invokeJson<Array<{ pageKey: string | null }>>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/planner-nodes",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(afterMove.status).toBe(200);
    expect(afterMove.body.map((item) => item.pageKey)).not.toContain("catalog-home");
  });

  it("TC-WEB-APP-HIER-INT-003 keeps derived route truth synchronized after route edits and branch moves", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository({
        modules: [createModuleRecord()],
        pages: [
          createPageRecord(),
          createPageRecord({
            webAppPageId: "33333333-3333-4333-8333-333333333333",
            parentPageId: "22222222-2222-4222-8222-222222222222",
            placementType: "child-page",
            pageKey: "catalog-detail",
            displayLabel: "Catalog Detail",
            routeSegment: "detail",
            normalizedRouteSegment: "detail",
            resolvedFullRoutePath: "/root-admin/catalog/detail",
          }),
        ],
      }),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const updated = await invokeJson<{ resolvedFullRoutePath: string }>(harness.app, {
      method: "PATCH",
      path: "/v1/web-app-hierarchy/pages/22222222-2222-4222-8222-222222222222",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { routeSegment: "catalog-root" },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.resolvedFullRoutePath).toBe("/root-admin/catalog-root");

    const tree = await invokeJson<{
      rootFamilies: Array<{ modules: Array<{ pages: Array<{ children: Array<{ resolvedFullRoutePath: string }> }> }> }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(tree.body.rootFamilies[0]?.modules[0]?.pages[0]?.children[0]?.resolvedFullRoutePath)
      .toBe("/root-admin/catalog-root/detail");
  });

  it("TC-WEB-APP-HIER-INT-004 imports approved bootstrap truth without inventing browser-absent pages", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const bootstrapped = await invokeJson<{
      rootFamilies: Array<{ rootFamilyId: string; modules: Array<{ moduleKey: string; pages: Array<{ pageKey: string }> }> }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/bootstrap",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        observedRootFamilies: [
          {
            rootFamilyId: "root-admin",
            modules: [
              {
                moduleKey: "operators",
                displayLabel: "Operators",
                pages: [
                  {
                    pageKey: "operators-home",
                    displayLabel: "Operators Home",
                    routeSegment: "operators",
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
          rootFamilyId: "root-admin",
          modules: expect.arrayContaining([
            expect.objectContaining({
              moduleKey: "operators",
              pages: [expect.objectContaining({ pageKey: "operators-home" })],
            }),
          ]),
        }),
      ]),
    );
    expect(JSON.stringify(bootstrapped.body)).not.toContain("invented");
  });

  it("TC-WEB-APP-HIER-INT-005 previews structure-aware reconcile without mutating the curated tree", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
      createStubWebAppSurfaceDiscoveryIntegrationSeam({
        async listDiscoveredWebAppSurfaces(input) {
          if (input?.staleStatus === "stale") {
            return [];
          }
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
      previewSummary: { createdModuleCount: number; createdPageCount: number };
      items: Array<{ itemType: string; pageKey: string | null; moduleKey: string | null }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/preview",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    expect(response.status).toBe(200);
    expect(response.body.previewSummary).toMatchObject({
      createdModuleCount: 1,
      createdPageCount: 1,
    });
    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          itemType: "module",
          moduleKey: "components",
        }),
        expect.objectContaining({
          itemType: "page",
          pageKey: "design-system-components-top-nav",
        }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-INT-006, TC-WEB-APP-HIER-INT-011, and TC-WEB-APP-HIER-INT-012 apply structure-aware reconcile and keep tree consumers compatible", async () => {
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
            createDiscoveredSurfaceRecord({
              discoveredWebAppSurfaceId: "55555555-5555-4555-8555-555555555555",
              rootFamilyId: "root-admin",
              routePath: "/root-admin",
              routeHash: "users",
              canonicalLocator: "/root-admin#users",
              displayLabel: "Users",
              surfaceKind: "shell-state",
              locatorType: "hash-state",
              userFacingDisposition: "user-facing",
            }),
          ];
        },
      }),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const applied = await invokeJson<{ applySummary: { createdPageCount: number } }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/apply",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        includeInactive: false,
        includeOrphaned: false,
      },
    });
    expect(applied.status).toBe(200);
    expect(applied.body.applySummary.createdPageCount).toBe(2);

    const tree = await invokeJson<{
      rootFamilies: Array<{
        rootFamilyId: string;
        modules: Array<{
          moduleKey: string;
          pages: Array<{
            pageKey: string;
            resolvedFullRoutePath: string | null;
            activeLocator: { locatorType: string } | null;
          }>;
        }>;
      }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    const links = await invokeJson<{
      items: Array<{ curatedTargetType: string; driftStatus: string }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/discovery-links",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(tree.status).toBe(200);
    expect(links.status).toBe(200);
    expect(links.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          curatedTargetType: "page",
          driftStatus: "none",
        }),
      ]),
    );
    expect(tree.body.rootFamilies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rootFamilyId: "design-system",
          modules: expect.arrayContaining([
            expect.objectContaining({
              moduleKey: "components",
              pages: expect.arrayContaining([
                expect.objectContaining({
                  pageKey: "design-system-components-top-nav",
                  resolvedFullRoutePath: "/design-system/components/top-nav",
                  activeLocator: expect.objectContaining({ locatorType: "path" }),
                }),
              ]),
            }),
          ]),
        }),
        expect.objectContaining({
          rootFamilyId: "root-admin",
          modules: expect.arrayContaining([
            expect.objectContaining({
              moduleKey: "root-admin-discovered-routes",
              pages: expect.arrayContaining([
                expect.objectContaining({
                  pageKey: "root-admin-users",
                  resolvedFullRoutePath: "/root-admin#users",
                  activeLocator: expect.objectContaining({ locatorType: "hash-state" }),
                }),
              ]),
            }),
          ]),
        }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-INT-009 handles root index route discovery without inventing a fake route segment", async () => {
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
              routePath: "/design-system",
              canonicalLocator: "/design-system",
              displayLabel: "Design System",
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

    const preview = await invokeJson<{ previewSummary: { createdPageCount: number }; items: unknown[] }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/preview",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(preview.status).toBe(200);
    expect(preview.body.previewSummary.createdPageCount).toBe(0);
    expect(preview.body.items).toEqual([]);
  });

  it("TC-WEB-APP-HIER-INT-010 repeats apply without duplicating active locators or discovery links", async () => {
    const repository = createInMemoryWebAppHierarchyRepository();
    const harness = createRootAuthIntegrationHarness();
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

    const firstApply = await invokeJson<{ applySummary: { refreshedLocatorCount: number; refreshedLinkCount: number } }>(
      harness.app,
      {
        method: "POST",
        path: "/v1/web-app-hierarchy/discovery-sync/apply",
        headers: { authorization: `Bearer ${session.sessionId}` },
        body: {},
      },
    );
    expect(firstApply.status).toBe(200);
    const firstActiveLocatorCount = [...repository.pageLocators.values()].filter((item) => item.isActive).length;
    const firstDiscoveryLinkCount = repository.discoveryLinks.size;

    const secondApply = await invokeJson<{ applySummary: { refreshedLocatorCount: number; refreshedLinkCount: number } }>(
      harness.app,
      {
        method: "POST",
        path: "/v1/web-app-hierarchy/discovery-sync/apply",
        headers: { authorization: `Bearer ${session.sessionId}` },
        body: {},
      },
    );
    expect(secondApply.status).toBe(200);

    expect([...repository.pageLocators.values()].filter((item) => item.isActive)).toHaveLength(firstActiveLocatorCount);
    expect(repository.discoveryLinks.size).toBe(firstDiscoveryLinkCount);
  });

  it("TC-ROOT-PATH-INT-003 keeps discovery truth and curated topology truth aligned for migrated root-admin path locators", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
      createStubWebAppSurfaceDiscoveryIntegrationSeam({
        async listDiscoveredWebAppSurfaces() {
          return [
            createDiscoveredSurfaceRecord({
              discoveredWebAppSurfaceId: "55555555-5555-4555-8555-555555555555",
              rootFamilyId: "root-admin",
              routePath: "/root-admin/users",
              routeHash: null,
              canonicalLocator: "/root-admin/users",
              displayLabel: "Users",
              surfaceKind: "page-route",
              locatorType: "path",
              userFacingDisposition: "user-facing",
            }),
            createDiscoveredSurfaceRecord({
              discoveredWebAppSurfaceId: "66666666-6666-4666-8666-666666666666",
              rootFamilyId: "root-admin",
              routePath: "/root-admin/tenants",
              routeHash: null,
              canonicalLocator: "/root-admin/tenants",
              displayLabel: "Tenants",
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

    const preview = await invokeJson<{
      previewSummary: { createdPageCount: number; blockedItemCount: number };
      items: Array<{ canonicalLocator: string | null; proposedLocatorType: string | null }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/preview",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(preview.status).toBe(200);
    expect(preview.body.previewSummary).toMatchObject({
      createdPageCount: 2,
      blockedItemCount: 0,
    });
    expect(preview.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ canonicalLocator: "/root-admin/users", proposedLocatorType: "path" }),
        expect.objectContaining({ canonicalLocator: "/root-admin/tenants", proposedLocatorType: "path" }),
      ]),
    );

    const applied = await invokeJson<{
      tree: {
        rootFamilies: Array<{
          rootFamilyId: string;
          modules: Array<{
            moduleKey: string;
            pages: Array<{
              pageKey: string;
              resolvedFullRoutePath: string | null;
              activeLocator: { locatorType: string; canonicalLocator: string; routeHash: string | null } | null;
            }>;
          }>;
        }>;
      };
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/apply",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        includeInactive: false,
        includeOrphaned: false,
      },
    });

    expect(applied.status).toBe(200);
    expect(applied.body.tree.rootFamilies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rootFamilyId: "root-admin",
          modules: expect.arrayContaining([
            expect.objectContaining({
              moduleKey: "root-admin-discovered-routes",
              pages: expect.arrayContaining([
                expect.objectContaining({
                  pageKey: "root-admin-users",
                  resolvedFullRoutePath: "/root-admin/users",
                  activeLocator: expect.objectContaining({
                    locatorType: "path",
                    canonicalLocator: "/root-admin/users",
                    routeHash: null,
                  }),
                }),
                expect.objectContaining({
                  pageKey: "root-admin-tenants",
                  resolvedFullRoutePath: "/root-admin/tenants",
                  activeLocator: expect.objectContaining({
                    locatorType: "path",
                    canonicalLocator: "/root-admin/tenants",
                    routeHash: null,
                  }),
                }),
              ]),
            }),
          ]),
        }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-INT-014 syncs canonical-rendering registry pages into the tree route", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      undefined,
      createStubDesignSystemCanonicalsPublicSeam({
        async listLiveHierarchyNodes() {
          return [
            {
              familyKey: "page-shell-banner",
              familyDisplayLabel: "Page-Shell Banner",
              launcherRoutePath: "/design-system/canonical-renderings/page-shell-banner",
              rootRoutePath: "/design-system/canonical-renderings/page-shell-banner",
              launcherTemplateKey: "launcher",
              renderTemplateKey: "canonical-rendering",
              references: [
                {
                  referenceId: "PSBR-001",
                  displayLabel: "Full four-state stack",
                  renderRoutePath: "/design-system/canonical-renderings/page-shell-banner/PSBR-001",
                },
              ],
            },
            {
              familyKey: "hierarchy-tree",
              familyDisplayLabel: "Hierarchy Tree",
              launcherRoutePath: "/design-system/canonical-renderings/hierarchy-tree",
              rootRoutePath: "/design-system/canonical-renderings/hierarchy-tree",
              launcherTemplateKey: "launcher",
              renderTemplateKey: "canonical-rendering",
              references: [
                {
                  referenceId: "HTR-027",
                  displayLabel: "Magnified hierarchy review with row pressure",
                  renderRoutePath: "/design-system/canonical-renderings/hierarchy-tree/HTR-027",
                },
              ],
            },
          ];
        },
      }),
    );
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, [
      "web-app-hierarchy.read-tree",
      "web-app-hierarchy.sync-design-system-canonical-renderings",
    ]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const synced = await invokeJson<{
      syncSummary: { createdPageCount: number; liveReferenceCount: number };
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/design-system/canonical-renderings/sync",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    expect(synced.status).toBe(200);
    expect(synced.body.syncSummary).toMatchObject({
      createdPageCount: 5,
      liveReferenceCount: 2,
    });

    const tree = await invokeJson<{
      rootFamilies: Array<{
        rootFamilyId: string;
        modules: Array<{
          moduleKey: string;
          pages: Array<{
            pageKey: string;
            resolvedFullRoutePath: string | null;
            children: Array<{
              pageKey: string;
              resolvedFullRoutePath: string | null;
              children: Array<{ pageKey: string; routeSegment: string; resolvedFullRoutePath: string | null }>;
            }>;
          }>;
        }>;
      }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(tree.status).toBe(200);
    expect(tree.body.rootFamilies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rootFamilyId: "design-system",
          modules: expect.arrayContaining([
            expect.objectContaining({
              moduleKey: "canonical-renderings",
              pages: expect.arrayContaining([
                expect.objectContaining({
                  pageKey: "design-system-canonical-renderings",
                  children: expect.arrayContaining([
                    expect.objectContaining({
                      pageKey: "design-system-canonical-renderings-page-shell-banner",
                      resolvedFullRoutePath: "/design-system/canonical-renderings/page-shell-banner",
                      children: expect.arrayContaining([
                        expect.objectContaining({
                          pageKey: "design-system-canonical-renderings-page-shell-banner-psbr-001",
                          routeSegment: "PSBR-001",
                          resolvedFullRoutePath: "/design-system/canonical-renderings/page-shell-banner/PSBR-001",
                        }),
                      ]),
                    }),
                    expect.objectContaining({
                      pageKey: "design-system-canonical-renderings-hierarchy-tree",
                      children: expect.arrayContaining([
                        expect.objectContaining({
                          pageKey: "design-system-canonical-renderings-hierarchy-tree-htr-027",
                          routeSegment: "HTR-027",
                          resolvedFullRoutePath: "/design-system/canonical-renderings/hierarchy-tree/HTR-027",
                        }),
                      ]),
                    }),
                  ]),
                }),
              ]),
            }),
          ]),
        }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-INT-008 applies a module route plus child routes as a selectable module-root page", async () => {
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
              routePath: "/design-system/canonicals",
              canonicalLocator: "/design-system/canonicals",
              displayLabel: "Canonicals",
              surfaceKind: "page-route",
              locatorType: "path",
              userFacingDisposition: "user-facing",
            }),
            createDiscoveredSurfaceRecord({
              discoveredWebAppSurfaceId: "55555555-5555-4555-8555-555555555555",
              rootFamilyId: "design-system",
              routePath: "/design-system/canonicals/top-nav",
              canonicalLocator: "/design-system/canonicals/top-nav",
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

    const applied = await invokeJson<{ applySummary: { createdPageCount: number } }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/discovery-sync/apply",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        includeInactive: false,
        includeOrphaned: false,
      },
    });
    expect(applied.status).toBe(200);
    expect(applied.body.applySummary.createdPageCount).toBe(2);

    const tree = await invokeJson<{
      rootFamilies: Array<{
        rootFamilyId: string;
        modules: Array<{
          moduleKey: string;
          pages: Array<{
            pageKey: string;
            resolvedFullRoutePath: string | null;
            children: Array<{ pageKey: string; resolvedFullRoutePath: string | null }>;
          }>;
        }>;
      }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(tree.status).toBe(200);
    expect(tree.body.rootFamilies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rootFamilyId: "design-system",
          modules: expect.arrayContaining([
            expect.objectContaining({
              moduleKey: "canonicals",
              pages: expect.arrayContaining([
                expect.objectContaining({
                  pageKey: "design-system-canonicals",
                  resolvedFullRoutePath: "/design-system/canonicals",
                }),
                expect.objectContaining({
                  pageKey: "design-system-canonicals-top-nav",
                  resolvedFullRoutePath: "/design-system/canonicals/top-nav",
                }),
              ]),
            }),
          ]),
        }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-EDGE-002, TC-WEB-APP-HIER-EDGE-004, TC-WEB-APP-HIER-EDGE-005, and TC-WEB-APP-HIER-EDGE-006 preserve deterministic edge behavior for moves", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository({
        modules: [createModuleRecord()],
        pages: [
          createPageRecord({ sortOrder: 2 }),
          createPageRecord({
            webAppPageId: "33333333-3333-4333-8333-333333333333",
            pageKey: "alpha-page",
            displayLabel: "Alpha Page",
            routeSegment: "alpha",
            normalizedRouteSegment: "alpha",
            resolvedFullRoutePath: "/root-admin/alpha",
            sortOrder: 1,
          }),
          createPageRecord({
            webAppPageId: "44444444-4444-4444-8444-444444444444",
            pageKey: "live-page",
            displayLabel: "Live Page",
            routeSegment: "live",
            normalizedRouteSegment: "live",
            resolvedFullRoutePath: "/root-admin/live",
            status: "live",
            sortOrder: 3,
          }),
        ],
      }),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const liveMove = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/pages/44444444-4444-4444-8444-444444444444/move",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        placementType: "orphaned",
      },
    });
    expect(liveMove.status).toBe(409);
    expect(liveMove.body.code).toBe("WEB_APP_LIVE_ROUTE_CHANGE_BLOCKED");

    for (let index = 0; index < 2; index += 1) {
      const moved = await invokeJson<{ placementType: string; resolvedFullRoutePath: string | null }>(harness.app, {
        method: "POST",
        path: "/v1/web-app-hierarchy/pages/33333333-3333-4333-8333-333333333333/move",
        headers: { authorization: `Bearer ${session.sessionId}` },
        body: {
          rootFamilyId: "root-admin",
          webAppModuleId: "11111111-1111-4111-8111-111111111111",
          placementType: "orphaned",
        },
      });
      expect(moved.status).toBe(200);
      expect(moved.body).toMatchObject({ placementType: "orphaned", resolvedFullRoutePath: null });
    }

    const tree = await invokeJson<{
      rootFamilies: Array<{ modules: Array<{ pages: Array<{ pageKey: string }>; orphanedPages?: Array<{ pageKey: string }> }> }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree?includeOrphaned=true",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(tree.status).toBe(200);
    expect(tree.body.rootFamilies[0]?.modules[0]?.pages.map((item) => item.pageKey)).toEqual([
      "catalog-home",
      "live-page",
    ]);
    expect(tree.body.rootFamilies[0]?.modules[0]?.orphanedPages?.map((item) => item.pageKey)).toEqual([
      "alpha-page",
    ]);

    const orphans = await invokeJson<Array<{ pageKey: string }>>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/orphaned-pages",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(orphans.status).toBe(200);
    expect(orphans.body.map((item) => item.pageKey)).toEqual(["alpha-page"]);
  });

  it("TC-WEB-APP-HIER-EDGE-003 keeps special root families distinct in route reads", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppHierarchyBuilderFeature(
      harness.app,
      harness,
      createInMemoryWebAppHierarchyRepository(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const tree = await invokeJson<{ rootFamilies: Array<{ rootFamilyId: string; routePrefix: string }> }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/tree",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(tree.status).toBe(200);
    expect(tree.body.rootFamilies.map((item) => [item.rootFamilyId, item.routePrefix])).toEqual([
      ["root-admin", "/root-admin"],
      ["login", "/login"],
      ["design-system", "/design-system"],
    ]);
  });

  it("TC-DESIGN-SYS-TOPO-INT-001 creates previews applies and reads the refreshed applied design-system tree", async () => {
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
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    harness.setRootUserCapabilities(identity.rootUserId, [
      "web-app-hierarchy.read-tree",
      "web-app-hierarchy.create-design-system-subpage",
      "web-app-hierarchy.preview-design-system-materialization",
      "web-app-hierarchy.apply-design-system-materialization",
    ]);

    const proposed = await invokeJson<{
      proposalPage: { webAppPageId: string; topologyState: string; pageKey: string };
      proposalStatus: string;
    }>(harness.app, {
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
    expect(proposed.status).toBe(201);
    expect(proposed.body).toMatchObject({
      proposalStatus: "proposed",
      proposalPage: {
        topologyState: "proposed",
        pageKey: "design-system-patterns-new-pattern",
      },
    });

    const preview = await invokeJson<{
      classification: string;
      previewHash: string;
      items: Array<{ routePath: string }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/design-system/materialization/preview",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        proposalPageIds: [proposed.body.proposalPage.webAppPageId],
      },
    });
    expect(preview.status).toBe(200);
    expect(preview.body.classification).toBe("additive");
    expect(preview.body.items).toEqual([
      expect.objectContaining({
        routePath: "/design-system/patterns/new-pattern",
      }),
    ]);

    const applied = await invokeJson<{
      appliedPageCount: number;
      tree: {
        rootFamilies: Array<{
          rootFamilyId: string;
          modules: Array<{
            moduleKey: string;
            pages: Array<{
              pageKey: string;
              children: Array<{ pageKey: string; topologyState: string }>;
            }>;
          }>;
        }>;
      };
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-hierarchy/design-system/materialization/apply",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        proposalPageIds: [proposed.body.proposalPage.webAppPageId],
        previewHash: preview.body.previewHash,
      },
    });
    expect(applied.status).toBe(200);
    expect(applied.body.appliedPageCount).toBe(1);

    const appliedTree = await invokeJson<{
      rootFamilies: Array<{
        rootFamilyId: string;
        modules: Array<{
          moduleKey: string;
          pages: Array<{ pageKey: string; children: Array<{ pageKey: string }> }>;
        }>;
      }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-hierarchy/design-system/applied-tree",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(appliedTree.status).toBe(200);
    expect(appliedTree.body.rootFamilies).toEqual([
      expect.objectContaining({
        rootFamilyId: "design-system",
        modules: [
          expect.objectContaining({
            moduleKey: "patterns",
            pages: expect.arrayContaining([
              expect.objectContaining({
                pageKey: "design-system-patterns",
                children: expect.arrayContaining([
                  expect.objectContaining({
                    pageKey: "design-system-patterns-new-pattern",
                  }),
                ]),
              }),
            ]),
          }),
        ],
      }),
    ]);
  });

  it("TC-WEB-APP-HIER-INT-007 updates and clears a direct-child module landing page through the hierarchy route", async () => {
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

    const updated = await invokeJson<{ landingPageWebAppPageId: string | null }>(harness.app, {
      method: "PATCH",
      path: "/v1/web-app-hierarchy/modules/11111111-1111-4111-8111-111111111111/landing-page",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        landingPageWebAppPageId: "22222222-2222-4222-8222-222222222222",
      },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.landingPageWebAppPageId).toBe("22222222-2222-4222-8222-222222222222");

    const cleared = await invokeJson<{ landingPageWebAppPageId: string | null }>(harness.app, {
      method: "PATCH",
      path: "/v1/web-app-hierarchy/modules/11111111-1111-4111-8111-111111111111/landing-page",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        landingPageWebAppPageId: null,
      },
    });
    expect(cleared.status).toBe(200);
    expect(cleared.body.landingPageWebAppPageId).toBeNull();
  });
});
