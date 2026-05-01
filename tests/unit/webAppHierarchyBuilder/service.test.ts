import { describe, expect, it } from "vitest";
import { createWebAppHierarchyBuilderService } from "../../../src/features/webAppHierarchyBuilder/domain/service";
import {
  HierarchyCycleError,
  LiveRouteChangeBlockedError,
  RouteSegmentAlreadyExistsError,
  PageKeyAlreadyExistsError,
} from "../../../src/features/webAppHierarchyBuilder/contract/errors";
import {
  createInMemoryWebAppHierarchyRepository,
  createStubDesignSystemCanonicalsPublicSeam,
  createStubDesignSystemMaterializer,
  createStubWebAppSurfaceDiscoveryIntegrationSeam,
  createDiscoveryLinkRecord,
  createModuleRecord,
  createPageLocatorRecord,
  createPageRecord,
  refreshInMemoryResolvedPaths,
} from "../../helpers/webAppHierarchyBuilderHarness";
import { createDiscoveredSurfaceRecord } from "../../helpers/webAppSurfaceDiscoveryHarness";

describe("web app hierarchy builder service", () => {
  it("TC-WEB-APP-HIER-UNIT-001 creates a module-root page and derives its full route path", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    const created = await service.createWebAppPage({
      rootFamilyId: "root-admin",
      webAppModuleId: "11111111-1111-4111-8111-111111111111",
      pageKey: "catalog-settings",
      displayLabel: "Catalog Settings",
      routeSegment: "settings",
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(created.placementType).toBe("module-root");
    expect(created.resolvedFullRoutePath).toBe("/root-admin/settings");
  });

  it("TC-WEB-APP-HIER-UNIT-002 blocks route-affecting moves for live branches", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          pageKey: "catalog-root",
          routeSegment: "catalog",
          normalizedRouteSegment: "catalog",
          status: "live",
        }),
      ],
    });
    refreshInMemoryResolvedPaths(repository);
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    await expect(
      service.moveWebAppPage({
        webAppPageId: "33333333-3333-4333-8333-333333333333",
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        placementType: "orphaned",
      }),
    ).rejects.toBeInstanceOf(LiveRouteChangeBlockedError);
  });

  it("TC-WEB-APP-HIER-UNIT-003 rejects duplicate page keys during bootstrap and normal create flows", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [createPageRecord()],
    });
    refreshInMemoryResolvedPaths(repository);
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    await expect(
      service.createWebAppPage({
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        pageKey: "catalog-home",
        displayLabel: "Catalog Home 2",
        routeSegment: "catalog-2",
        createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      }),
    ).rejects.toBeInstanceOf(PageKeyAlreadyExistsError);
  });

  it("TC-WEB-APP-HIER-UNIT-004 updates page route metadata, refreshes descendants, and rejects unsafe route edits", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
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
        createPageRecord({
          webAppPageId: "44444444-4444-4444-8444-444444444444",
          pageKey: "catalog-settings",
          displayLabel: "Catalog Settings",
          routeSegment: "settings",
          normalizedRouteSegment: "settings",
          resolvedFullRoutePath: "/root-admin/settings",
        }),
      ],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    const updated = await service.updateWebAppPage({
      webAppPageId: "22222222-2222-4222-8222-222222222222",
      displayLabel: "Catalog Root",
      routeSegment: "catalog-root",
      status: "review",
      sortOrder: 4,
    });
    expect(updated).toMatchObject({
      displayLabel: "Catalog Root",
      routeSegment: "catalog-root",
      status: "review",
      sortOrder: 4,
      resolvedFullRoutePath: "/root-admin/catalog-root",
    });
    expect((await repository.findPageById("33333333-3333-4333-8333-333333333333"))?.resolvedFullRoutePath)
      .toBe("/root-admin/catalog-root/detail");

    await expect(
      service.updateWebAppPage({
        webAppPageId: "44444444-4444-4444-8444-444444444444",
        routeSegment: "catalog-root",
      }),
    ).rejects.toBeInstanceOf(RouteSegmentAlreadyExistsError);

    const liveRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [createPageRecord({ status: "live" })],
    });
    const liveService = createWebAppHierarchyBuilderService(
      liveRepository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );
    await expect(
      liveService.updateWebAppPage({
        webAppPageId: "22222222-2222-4222-8222-222222222222",
        routeSegment: "live-move",
      }),
    ).rejects.toBeInstanceOf(LiveRouteChangeBlockedError);
  });

  it("TC-WEB-APP-HIER-UNIT-005 moves hierarchy branches and rejects cycles, collisions, and live branch moves", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [
        createModuleRecord(),
        createModuleRecord({
          webAppModuleId: "99999999-1111-4111-8111-111111111111",
          moduleKey: "settings",
          displayLabel: "Settings",
        }),
      ],
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
        createPageRecord({
          webAppPageId: "44444444-4444-4444-8444-444444444444",
          webAppModuleId: "99999999-1111-4111-8111-111111111111",
          pageKey: "settings-other",
          displayLabel: "Settings Other",
          routeSegment: "other",
          normalizedRouteSegment: "other",
          resolvedFullRoutePath: "/root-admin/other",
        }),
      ],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    const moduleRoot = await service.moveWebAppPage({
      webAppPageId: "33333333-3333-4333-8333-333333333333",
      rootFamilyId: "root-admin",
      webAppModuleId: "99999999-1111-4111-8111-111111111111",
      placementType: "module-root",
      sortOrder: 7,
    });
    expect(moduleRoot).toMatchObject({
      webAppModuleId: "99999999-1111-4111-8111-111111111111",
      parentPageId: null,
      placementType: "module-root",
      resolvedFullRoutePath: "/root-admin/detail",
    });

    const orphaned = await service.moveWebAppPage({
      webAppPageId: "33333333-3333-4333-8333-333333333333",
      rootFamilyId: "root-admin",
      webAppModuleId: "99999999-1111-4111-8111-111111111111",
      placementType: "orphaned",
    });
    expect(orphaned).toMatchObject({
      placementType: "orphaned",
      resolvedFullRoutePath: null,
    });

    await expect(
      service.moveWebAppPage({
        webAppPageId: "22222222-2222-4222-8222-222222222222",
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        targetParentPageId: "22222222-2222-4222-8222-222222222222",
        placementType: "child-page",
      }),
    ).rejects.toBeInstanceOf(HierarchyCycleError);

    const liveRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [createPageRecord({ status: "live" })],
    });
    const liveService = createWebAppHierarchyBuilderService(
      liveRepository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );
    await expect(
      liveService.moveWebAppPage({
        webAppPageId: "22222222-2222-4222-8222-222222222222",
        rootFamilyId: "root-admin",
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        placementType: "orphaned",
      }),
    ).rejects.toBeInstanceOf(LiveRouteChangeBlockedError);
  });

  it("TC-WEB-APP-HIER-UNIT-006 returns deterministic tree truth with explicit inactive and orphan inclusion", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [
        createModuleRecord({ moduleKey: "zeta", displayLabel: "Zeta", sortOrder: 2 }),
        createModuleRecord({
          webAppModuleId: "99999999-1111-4111-8111-111111111111",
          moduleKey: "alpha",
          displayLabel: "Alpha",
          sortOrder: 1,
        }),
      ],
      pages: [
        createPageRecord({ pageKey: "zeta-live", sortOrder: 2 }),
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          pageKey: "zeta-inactive",
          status: "inactive",
          sortOrder: 1,
        }),
        createPageRecord({
          webAppPageId: "44444444-4444-4444-8444-444444444444",
          pageKey: "zeta-orphan",
          placementType: "orphaned",
          sortOrder: 0,
        }),
      ],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    const defaultTree = await service.getResolvedWebAppHierarchyTree({});
    const rootAdminModules = defaultTree.rootFamilies.find((item) => item.rootFamilyId === "root-admin")?.modules;
    expect(rootAdminModules?.map((item) => item.moduleKey)).toEqual(["alpha", "zeta"]);
    expect(rootAdminModules?.find((item) => item.moduleKey === "zeta")?.pages.map((item) => item.pageKey))
      .toEqual(["zeta-live"]);

    const inclusiveTree = await service.getResolvedWebAppHierarchyTree({
      includeInactive: true,
      includeOrphaned: true,
    });
    const zeta = inclusiveTree.rootFamilies
      .find((item) => item.rootFamilyId === "root-admin")
      ?.modules.find((item) => item.moduleKey === "zeta");
    expect(zeta?.pages.map((item) => item.pageKey)).toEqual(["zeta-inactive", "zeta-live"]);
    expect(zeta?.orphanedPages?.map((item) => item.pageKey)).toEqual(["zeta-orphan"]);
  });

  it("TC-WEB-APP-HIER-UNIT-007 projects planner selectable nodes from durable hierarchy truth", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord(),
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          pageKey: "catalog-inactive",
          status: "inactive",
        }),
        createPageRecord({
          webAppPageId: "44444444-4444-4444-8444-444444444444",
          pageKey: "catalog-orphan",
          placementType: "orphaned",
        }),
      ],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    const defaultNodes = await service.listPlannerSelectableHierarchyNodes({});
    expect(defaultNodes.map((item) => item.pageKey).filter(Boolean)).toEqual(["catalog-home"]);
    expect(defaultNodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nodeType: "module",
          rootFamilyId: "root-admin",
          moduleKey: "catalog",
        }),
        expect.objectContaining({
          nodeType: "page",
          pageKey: "catalog-home",
          placementType: "module-root",
          resolvedFullRoutePath: "/root-admin/catalog",
        }),
      ]),
    );

    const inclusiveNodes = await service.listPlannerSelectableHierarchyNodes({ includeInactive: true });
    expect(inclusiveNodes.map((item) => item.pageKey).filter(Boolean)).toEqual([
      "catalog-home",
      "catalog-inactive",
    ]);
  });

  it("TC-WEB-APP-HIER-UNIT-008 lists orphaned pages without re-inserting them into the active tree", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord(),
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          pageKey: "catalog-orphan",
          placementType: "orphaned",
          routeSegment: "orphan",
          normalizedRouteSegment: "orphan",
        }),
      ],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    expect((await service.listOrphanedWebAppPages({})).map((item) => item.pageKey)).toEqual(["catalog-orphan"]);
    const tree = await service.getResolvedWebAppHierarchyTree({});
    expect(tree.rootFamilies[0]?.modules[0]?.pages.map((item) => item.pageKey)).toEqual(["catalog-home"]);
  });

  it("TC-WEB-APP-HIER-UNIT-009 bootstraps approved current app truth without inventing missing pages", async () => {
    const repository = createInMemoryWebAppHierarchyRepository();
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    const tree = await service.bootstrapWebAppHierarchy({
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
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
    });

    expect(tree.rootFamilies.find((item) => item.rootFamilyId === "root-admin")?.modules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          moduleKey: "operators",
          status: "review",
          pages: [
            expect.objectContaining({
              pageKey: "operators-home",
              bootstrapSource: "current-navigable-pages",
              resolvedFullRoutePath: "/root-admin/operators",
            }),
          ],
        }),
      ]),
    );
    expect((await repository.listPages()).map((item) => item.pageKey)).toEqual(["operators-home"]);
  });

  it("TC-WEB-APP-HIER-UNIT-010 and TC-ROOT-PATH-UNIT-005 preview structure-aware reconcile for multi-segment paths and migrated root-admin path pages", async () => {
    const repository = createInMemoryWebAppHierarchyRepository();
    const service = createWebAppHierarchyBuilderService(
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
          ];
        },
      }),
      createStubDesignSystemMaterializer(),
    );

    const result = await service.previewStructureAwareWebAppHierarchySync({});

    expect(result.previewSummary).toMatchObject({
      createdModuleCount: 1,
      createdPageCount: 2,
      blockedItemCount: 0,
    });
    expect(result.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          itemType: "module",
          moduleKey: "components",
          plannedAction: "create",
        }),
        expect.objectContaining({
          itemType: "page",
          pageKey: "design-system-components-top-nav",
          canonicalLocator: "/design-system/components/top-nav",
          proposedLocatorType: "path",
        }),
        expect.objectContaining({
          itemType: "page",
          pageKey: "root-admin-users",
          canonicalLocator: "/root-admin/users",
          proposedLocatorType: "path",
        }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-EDGE-009 and TC-ROOT-PATH-UNIT-005 block conflicting migrated root-admin path locator ownership instead of widening route truth", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      pages: [
        createPageRecord({
          webAppPageId: "99999999-9999-4999-8999-999999999999",
          pageKey: "legacy-root-admin-users-owner",
          displayLabel: "Legacy Users Owner",
          resolvedFullRoutePath: "/root-admin/users",
          status: "live",
        }),
      ],
      pageLocators: [
        createPageLocatorRecord({
          webAppPageLocatorId: "88888888-8888-4888-8888-888888888888",
          webAppPageId: "99999999-9999-4999-8999-999999999999",
          canonicalLocator: "/root-admin/users",
          routePath: "/root-admin/users",
          routeHash: null,
          normalizedLocatorKey: "/root-admin/users",
          locatorType: "path",
          isActive: true,
        }),
      ],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
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
          ];
        },
      }),
      createStubDesignSystemMaterializer(),
    );

    const result = await service.previewStructureAwareWebAppHierarchySync({});

    expect(result.previewSummary.blockedItemCount).toBe(1);
    expect(result.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          itemType: "page",
          pageKey: "root-admin-users",
          canonicalLocator: "/root-admin/users",
          proposedLocatorType: "path",
          plannedAction: "blocked",
          blockedReason: "locator_conflict",
        }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-EDGE-007 blocks unresolvable discovered leaves instead of guessing a curated match", async () => {
    const repository = createInMemoryWebAppHierarchyRepository();
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam({
        async listDiscoveredWebAppStructureTree() {
          const now = new Date("2026-04-19T12:00:00.000Z");
          return [
            {
              discoveredWebAppStructureNodeId: "11111111-1111-4111-8111-111111111111",
              rootFamilyId: "root-admin",
              structureKey: "root-admin",
              parentStructureKey: null,
              parentDiscoveredWebAppStructureNodeId: null,
              nodeKey: "root-admin",
              nodeKind: "root",
              displayLabel: "Root Admin",
              depth: 0,
              linkedDiscoveredWebAppSurfaceId: null,
              providerKey: "test",
              implementationSourcePath: null,
              firstDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
              lastDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
              firstDiscoveredAt: now,
              lastDiscoveredAt: now,
              staleAt: null,
              createdAt: now,
              updatedAt: now,
            },
            {
              discoveredWebAppStructureNodeId: "22222222-2222-4222-8222-222222222222",
              rootFamilyId: "root-admin",
              structureKey: "root-admin/users",
              parentStructureKey: "root-admin",
              parentDiscoveredWebAppStructureNodeId: "11111111-1111-4111-8111-111111111111",
              nodeKey: "users",
              nodeKind: "page-surface",
              displayLabel: "Users",
              depth: 1,
              linkedDiscoveredWebAppSurfaceId: null,
              providerKey: "test",
              implementationSourcePath: null,
              firstDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
              lastDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
              firstDiscoveredAt: now,
              lastDiscoveredAt: now,
              staleAt: null,
              createdAt: now,
              updatedAt: now,
            },
          ];
        },
      }),
      createStubDesignSystemMaterializer(),
    );

    const preview = await service.previewStructureAwareWebAppHierarchySync({});
    expect(preview.previewSummary.blockedItemCount).toBe(1);
    expect(preview.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          itemType: "page",
          pageKey: "root-admin-users",
          plannedAction: "blocked",
          blockedReason: "missing_surface_link",
          driftStatus: "blocked-ambiguity",
        }),
      ]),
    );

    const applied = await service.applyStructureAwareWebAppHierarchySync({
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });
    expect(applied.applySummary.createdPageCount).toBe(0);
    expect(await repository.listPages()).toEqual([]);
  });

  it("TC-WEB-APP-HIER-EDGE-008 blocks support-only and review-required leaves from default curated imports", async () => {
    const repository = createInMemoryWebAppHierarchyRepository();
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam({
        async listDiscoveredWebAppSurfaces() {
          return [
            createDiscoveredSurfaceRecord({
              discoveredWebAppSurfaceId: "44444444-4444-4444-8444-444444444444",
              rootFamilyId: "root-admin",
              routePath: "/root-admin/debug",
              canonicalLocator: "/root-admin/debug",
              displayLabel: "Debug",
              surfaceKind: "support-route",
              locatorType: "path",
              userFacingDisposition: "support-only",
            }),
            createDiscoveredSurfaceRecord({
              discoveredWebAppSurfaceId: "55555555-5555-4555-8555-555555555555",
              rootFamilyId: "root-admin",
              routePath: "/root-admin/experimental",
              canonicalLocator: "/root-admin/experimental",
              displayLabel: "Experimental",
              surfaceKind: "review-required",
              locatorType: "path",
              userFacingDisposition: "review-required",
            }),
          ];
        },
      }),
      createStubDesignSystemMaterializer(),
    );

    const preview = await service.previewStructureAwareWebAppHierarchySync({});
    expect(preview.previewSummary).toMatchObject({
      createdPageCount: 0,
      blockedItemCount: 2,
    });
    expect(preview.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pageKey: "root-admin-debug",
          plannedAction: "blocked",
          blockedReason: "support_only_surface",
        }),
        expect.objectContaining({
          pageKey: "root-admin-experimental",
          plannedAction: "blocked",
          blockedReason: "review_required_surface",
        }),
      ]),
    );

    const applied = await service.applyStructureAwareWebAppHierarchySync({
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });
    expect(applied.applySummary.createdPageCount).toBe(0);
    expect(await repository.listPages()).toEqual([]);
  });

  it("TC-WEB-APP-HIER-UNIT-011 applies structure-aware sync and keeps migrated root-admin pages honest through active path locators", async () => {
    const repository = createInMemoryWebAppHierarchyRepository();
    const service = createWebAppHierarchyBuilderService(
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
          ];
        },
      }),
      createStubDesignSystemMaterializer(),
    );

    const result = await service.applyStructureAwareWebAppHierarchySync({
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      includeInactive: false,
      includeOrphaned: false,
    });

    expect(result.applySummary).toMatchObject({
      createdModuleCount: 2,
      createdPageCount: 2,
      refreshedLocatorCount: 2,
    });
    expect(result.tree.rootFamilies).toEqual(
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
                  activeLocator: expect.objectContaining({
                    locatorType: "path",
                  }),
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
                  resolvedFullRoutePath: "/root-admin/users",
                  activeLocator: expect.objectContaining({
                    locatorType: "path",
                    routePath: "/root-admin/users",
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

  it("TC-WEB-APP-HIER-UNIT-013 creates a module-root page when discovery finds a module route with child pages", async () => {
    const repository = createInMemoryWebAppHierarchyRepository();
    const service = createWebAppHierarchyBuilderService(
      repository,
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
      createStubDesignSystemMaterializer(),
    );

    const result = await service.applyStructureAwareWebAppHierarchySync({
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      includeInactive: false,
      includeOrphaned: false,
    });

    expect(result.applySummary).toMatchObject({
      createdModuleCount: 1,
      createdPageCount: 2,
      refreshedLocatorCount: 2,
    });
    expect(result.tree.rootFamilies).toEqual(
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

  it("TC-WEB-APP-HIER-UNIT-014 reports locator, placement, metadata, stale, and clean drift states", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [
        createModuleRecord({
          webAppModuleId: "99999999-1111-4111-8111-111111111111",
          rootFamilyId: "design-system",
          moduleKey: "components",
          displayLabel: "Components",
        }),
        createModuleRecord({
          webAppModuleId: "99999999-2222-4222-8222-222222222222",
          rootFamilyId: "design-system",
          moduleKey: "wrong",
          displayLabel: "Wrong",
        }),
      ],
      pages: [
        createPageRecord({
          webAppPageId: "99999999-3333-4333-8333-333333333333",
          rootFamilyId: "design-system",
          webAppModuleId: "99999999-1111-4111-8111-111111111111",
          pageKey: "design-system-components-clean",
          displayLabel: "Clean",
          routeSegment: "clean",
          normalizedRouteSegment: "clean",
          resolvedFullRoutePath: "/design-system/components/clean",
        }),
        createPageRecord({
          webAppPageId: "99999999-4444-4444-8444-444444444444",
          rootFamilyId: "design-system",
          webAppModuleId: "99999999-1111-4111-8111-111111111111",
          pageKey: "design-system-components-renamed",
          displayLabel: "Old Name",
          routeSegment: "renamed",
          normalizedRouteSegment: "renamed",
          resolvedFullRoutePath: "/design-system/components/renamed",
        }),
        createPageRecord({
          webAppPageId: "99999999-5555-4555-8555-555555555555",
          rootFamilyId: "design-system",
          webAppModuleId: "99999999-2222-4222-8222-222222222222",
          pageKey: "design-system-components-misplaced",
          displayLabel: "Misplaced",
          routeSegment: "misplaced",
          normalizedRouteSegment: "misplaced",
          resolvedFullRoutePath: "/design-system/components/misplaced",
        }),
        createPageRecord({
          webAppPageId: "99999999-6666-4666-8666-666666666666",
          rootFamilyId: "design-system",
          webAppModuleId: "99999999-1111-4111-8111-111111111111",
          pageKey: "design-system-components-locator",
          displayLabel: "Locator",
          routeSegment: "locator",
          normalizedRouteSegment: "locator",
          resolvedFullRoutePath: "/design-system/components/locator",
        }),
      ],
      pageLocators: [
        createPageLocatorRecord({
          webAppPageLocatorId: "99999999-7777-4777-8777-777777777777",
          webAppPageId: "99999999-6666-4666-8666-666666666666",
          rootFamilyId: "design-system",
          canonicalLocator: "/design-system/components/old-locator",
          routePath: "/design-system/components/old-locator",
          normalizedLocatorKey: "/design-system/components/old-locator",
        }),
      ],
    });
    const surfaces = [
      createDiscoveredSurfaceRecord({
        discoveredWebAppSurfaceId: "11111111-1111-4111-8111-111111111111",
        routePath: "/design-system/components/clean",
        canonicalLocator: "/design-system/components/clean",
        displayLabel: "Clean",
      }),
      createDiscoveredSurfaceRecord({
        discoveredWebAppSurfaceId: "22222222-2222-4222-8222-222222222222",
        routePath: "/design-system/components/renamed",
        canonicalLocator: "/design-system/components/renamed",
        displayLabel: "New Name",
      }),
      createDiscoveredSurfaceRecord({
        discoveredWebAppSurfaceId: "33333333-3333-4333-8333-333333333333",
        routePath: "/design-system/components/misplaced",
        canonicalLocator: "/design-system/components/misplaced",
        displayLabel: "Misplaced",
      }),
      createDiscoveredSurfaceRecord({
        discoveredWebAppSurfaceId: "44444444-4444-4444-8444-444444444444",
        routePath: "/design-system/components/locator",
        canonicalLocator: "/design-system/components/locator",
        displayLabel: "Locator",
      }),
      createDiscoveredSurfaceRecord({
        discoveredWebAppSurfaceId: "55555555-5555-4555-8555-555555555555",
        routePath: "/design-system/components/stale",
        canonicalLocator: "/design-system/components/stale",
        displayLabel: "Stale",
        staleAt: new Date("2026-04-20T00:00:00.000Z"),
      }),
    ];
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam({
        async listDiscoveredWebAppSurfaces() {
          return surfaces;
        },
      }),
      createStubDesignSystemMaterializer(),
    );

    const result = await service.previewStructureAwareWebAppHierarchySync({
      includeStaleDiscovered: true,
    });

    expect(result.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ pageKey: "design-system-components-clean", driftStatus: "none" }),
        expect.objectContaining({ pageKey: "design-system-components-renamed", driftStatus: "metadata-drift" }),
        expect.objectContaining({ pageKey: "design-system-components-misplaced", driftStatus: "placement-drift" }),
        expect.objectContaining({ pageKey: "design-system-components-locator", driftStatus: "locator-drift" }),
        expect.objectContaining({ pageKey: "design-system-components-stale", driftStatus: "stale-discovered" }),
      ]),
    );
  });

  it("TC-WEB-APP-HIER-UNIT-015 reads and filters durable discovery-link truth without private joins", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      discoveryLinks: [
        createDiscoveryLinkRecord({
          webAppDiscoveryLinkId: "77777777-1111-4777-8777-777777777777",
          rootFamilyId: "design-system",
          curatedTargetType: "page",
          linkStatus: "matched",
          driftStatus: "none",
        }),
        createDiscoveryLinkRecord({
          webAppDiscoveryLinkId: "77777777-2222-4777-8777-777777777777",
          rootFamilyId: "root-admin",
          curatedTargetType: "module",
          curatedWebAppModuleId: "11111111-1111-4111-8111-111111111111",
          curatedWebAppPageId: null,
          linkStatus: "blocked",
          driftStatus: "blocked-locator",
        }),
      ],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    const filtered = await service.listWebAppHierarchyDiscoveryLinks({
      rootFamilyId: "root-admin",
      linkStatus: "blocked",
      driftStatus: "blocked-locator",
      curatedTargetType: "module",
      page: 1,
      pageSize: 10,
    });

    expect(filtered).toMatchObject({
      totalMatchingRecords: 1,
      items: [
        expect.objectContaining({
          webAppDiscoveryLinkId: "77777777-2222-4777-8777-777777777777",
          rootFamilyId: "root-admin",
          curatedTargetType: "module",
          linkStatus: "blocked",
          driftStatus: "blocked-locator",
        }),
      ],
    });
  });

  it("TC-WEB-APP-HIER-EDGE-010 keeps stale discovered links queryable and does not delete curated pages", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [createPageRecord()],
      discoveryLinks: [
        createDiscoveryLinkRecord({
          webAppDiscoveryLinkId: "77777777-3333-4777-8777-777777777777",
          discoveredWebAppStructureNodeId: "33333333-3333-4333-8333-333333333333",
          discoveredWebAppSurfaceId: "44444444-4444-4444-8444-444444444444",
          rootFamilyId: "root-admin",
          curatedTargetType: "page",
          curatedWebAppPageId: "22222222-2222-4222-8222-222222222222",
          linkStatus: "stale-discovered",
          driftStatus: "stale-discovered",
          driftSummary: "stale-discovered",
          lastMatchedWebAppDiscoveryRunId: null,
        }),
      ],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam({
        async listDiscoveredWebAppSurfaces() {
          return [];
        },
      }),
      createStubDesignSystemMaterializer(),
    );

    const staleLinks = await service.listWebAppHierarchyDiscoveryLinks({
      linkStatus: "stale-discovered",
      driftStatus: "stale-discovered",
      page: 1,
      pageSize: 10,
    });
    expect(staleLinks).toMatchObject({
      totalMatchingRecords: 1,
      items: [
        expect.objectContaining({
          linkStatus: "stale-discovered",
          driftStatus: "stale-discovered",
          curatedWebAppPageId: "22222222-2222-4222-8222-222222222222",
        }),
      ],
    });

    const applied = await service.applyStructureAwareWebAppHierarchySync({
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      includeStaleDiscovered: true,
    });
    expect(applied.applySummary.createdPageCount).toBe(0);
    expect((await repository.listPages()).map((item) => item.pageKey)).toEqual(["catalog-home"]);
    expect((await repository.findPageById("22222222-2222-4222-8222-222222222222"))?.resolvedFullRoutePath)
      .toBe("/root-admin/catalog");
  });

  it("TC-WEB-APP-HIER-UNIT-012 updates module landing-page truth only for direct child pages", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord(),
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          parentPageId: "22222222-2222-4222-8222-222222222222",
          placementType: "child-page",
          pageKey: "catalog-home-child",
          displayLabel: "Catalog Home Child",
          routeSegment: "catalog-child",
          normalizedRouteSegment: "catalog-child",
          resolvedFullRoutePath: "/root-admin/catalog/catalog-child",
        }),
      ],
    });
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
    );

    const updated = await service.updateModuleLandingPage({
      webAppModuleId: "11111111-1111-4111-8111-111111111111",
      landingPageWebAppPageId: "22222222-2222-4222-8222-222222222222",
    });
    expect(updated.landingPageWebAppPageId).toBe("22222222-2222-4222-8222-222222222222");

    await expect(
      service.updateModuleLandingPage({
        webAppModuleId: "11111111-1111-4111-8111-111111111111",
        landingPageWebAppPageId: "33333333-3333-4333-8333-333333333333",
      }),
    ).rejects.toMatchObject({
      code: "WEB_APP_INVALID_MODULE_LANDING_PAGE",
    });
  });

  it("TC-DESIGN-SYS-TOPO-UNIT-001 creates a proposed design-system subpage and previews deterministic outputs", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
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
    });
    const materializer = createStubDesignSystemMaterializer();
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      materializer,
    );

    const proposal = await service.createDesignSystemSubpageProposal({
      parentPageId: "99999999-2222-4222-8222-222222222222",
      displayLabel: "New Pattern",
      routeSegment: "new-pattern",
      templateKey: "static-html-page",
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(proposal.proposalStatus).toBe("proposed");
    expect(proposal.proposalPage.topologyState).toBe("proposed");
    expect(proposal.proposalPage.pageKey).toBe("design-system-patterns-new-pattern");

    const preview = await service.previewDesignSystemMaterialization({
      proposalPageIds: [proposal.proposalPage.webAppPageId],
    });

    expect(preview.classification).toBe("additive");
    expect(preview.items).toEqual([
      expect.objectContaining({
        pageKey: "design-system-patterns-new-pattern",
        routePath: "/design-system/patterns/new-pattern",
        plannedOutputs: expect.objectContaining({
          indexHtmlPath:
            "src/frontend/designSystem/patterns/new-pattern/index.html",
          governanceStubPath:
            "docs/workspace/design-system/generated-pages/design-system-patterns-new-pattern.md",
        }),
      }),
    ]);
    expect(preview.previewHash).toMatch(/[a-f0-9]{64}/);
    expect(materializer.appliedPlans).toEqual([]);
  });

  it("TC-DESIGN-SYS-TOPO-UNIT-002 applies design-system materialization and marks the page applied", async () => {
    const repository = createInMemoryWebAppHierarchyRepository({
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
    });
    const materializer = createStubDesignSystemMaterializer();
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      materializer,
    );

    const proposal = await service.createDesignSystemSubpageProposal({
      parentPageId: "99999999-2222-4222-8222-222222222222",
      displayLabel: "New Pattern",
      routeSegment: "new-pattern",
      templateKey: "static-html-page",
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });
    const preview = await service.previewDesignSystemMaterialization({
      proposalPageIds: [proposal.proposalPage.webAppPageId],
    });

    const applied = await service.applyDesignSystemMaterialization({
      proposalPageIds: [proposal.proposalPage.webAppPageId],
      previewHash: preview.previewHash,
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(applied.appliedPageCount).toBe(1);
    expect(materializer.appliedPlans).toEqual([
      expect.objectContaining({
        indexHtmlPath: "src/frontend/designSystem/patterns/new-pattern/index.html",
      }),
    ]);
    const refreshedPage = await repository.findPageById(proposal.proposalPage.webAppPageId);
    expect(refreshedPage?.topologyState).toBe("applied");
    expect(refreshedPage?.materializedAt).toBeInstanceOf(Date);
    expect(refreshedPage?.activeLocator?.canonicalLocator).toBe("/design-system/patterns/new-pattern");
    expect(applied.tree.rootFamilies).toEqual([
      expect.objectContaining({
        rootFamilyId: "design-system",
      }),
    ]);
  });

  it("REG-WEB-APP-HIER-CANONICAL-RENDERINGS-TREE-001 syncs live canonical-rendering refs into durable hierarchy pages", async () => {
    const repository = createInMemoryWebAppHierarchyRepository();
    const service = createWebAppHierarchyBuilderService(
      repository,
      createStubWebAppSurfaceDiscoveryIntegrationSeam(),
      createStubDesignSystemMaterializer(),
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
                {
                  referenceId: "PSBR-002",
                  displayLabel: "Success state",
                  renderRoutePath: "/design-system/canonical-renderings/page-shell-banner/PSBR-002",
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
                  referenceId: "HTR-001",
                  displayLabel: "Reference posture",
                  renderRoutePath: "/design-system/canonical-renderings/hierarchy-tree/HTR-001",
                },
              ],
            },
          ];
        },
      }),
    );

    const firstSync = await service.syncDesignSystemCanonicalRenderingsIntoHierarchy({
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(firstSync.syncSummary).toMatchObject({
      liveFamilyCount: 2,
      liveReferenceCount: 3,
      createdModuleCount: 1,
      createdPageCount: 6,
      refreshedPageCount: 0,
      refreshedLocatorCount: 6,
    });
    expect(firstSync.tree.rootFamilies).toEqual([
      expect.objectContaining({
        rootFamilyId: "design-system",
        modules: expect.arrayContaining([
          expect.objectContaining({
            moduleKey: "canonical-renderings",
            pages: expect.arrayContaining([
              expect.objectContaining({
                pageKey: "design-system-canonical-renderings",
                templateKey: "launcher",
                resolvedFullRoutePath: "/design-system/canonical-renderings",
                activeLocator: expect.objectContaining({
                  routePath: "/design-system/canonical-renderings",
                }),
                children: expect.arrayContaining([
                  expect.objectContaining({
                    pageKey: "design-system-canonical-renderings-page-shell-banner",
                    templateKey: "launcher",
                    resolvedFullRoutePath: "/design-system/canonical-renderings/page-shell-banner",
                    children: expect.arrayContaining([
                      expect.objectContaining({
                        pageKey: "design-system-canonical-renderings-page-shell-banner-psbr-001",
                        routeSegment: "PSBR-001",
                        templateKey: "canonical-rendering",
                        resolvedFullRoutePath: "/design-system/canonical-renderings/page-shell-banner/PSBR-001",
                        activeLocator: expect.objectContaining({
                          routePath: "/design-system/canonical-renderings/page-shell-banner/PSBR-001",
                        }),
                      }),
                    ]),
                  }),
                  expect.objectContaining({
                    pageKey: "design-system-canonical-renderings-hierarchy-tree",
                    resolvedFullRoutePath: "/design-system/canonical-renderings/hierarchy-tree",
                    children: expect.arrayContaining([
                      expect.objectContaining({
                        pageKey: "design-system-canonical-renderings-hierarchy-tree-htr-001",
                        routeSegment: "HTR-001",
                        templateKey: "canonical-rendering",
                        resolvedFullRoutePath: "/design-system/canonical-renderings/hierarchy-tree/HTR-001",
                      }),
                    ]),
                  }),
                ]),
              }),
            ]),
          }),
        ]),
      }),
    ]);

    const secondSync = await service.syncDesignSystemCanonicalRenderingsIntoHierarchy({
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(secondSync.syncSummary).toMatchObject({
      liveFamilyCount: 2,
      liveReferenceCount: 3,
      createdModuleCount: 0,
      createdPageCount: 0,
      refreshedPageCount: 6,
      refreshedLocatorCount: 0,
    });
    expect((await repository.listPages()).filter((page) => page.pageKey.includes("canonical-renderings"))).toHaveLength(6);
  });
});
