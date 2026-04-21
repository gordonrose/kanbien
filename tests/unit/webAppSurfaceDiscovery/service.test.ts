import { describe, expect, it } from "vitest";
import { createWebAppSurfaceDiscoveryService } from "../../../src/features/webAppSurfaceDiscovery/domain/service";
import {
  createInMemoryWebAppSurfaceDiscoveryRepository,
  createDiscoveredStructureNodeRecord,
  createStaticDiscoveryProvider,
  createDiscoveredSurfaceRecord,
} from "../../helpers/webAppSurfaceDiscoveryHarness";

describe("webAppSurfaceDiscovery service", () => {
  it("TC-WEB-APP-SURF-DISC-UNIT-001 persists support-only and path-backed discovered truth during a manual run", async () => {
    const repository = createInMemoryWebAppSurfaceDiscoveryRepository();
    const service = createWebAppSurfaceDiscoveryService(repository, [
      createStaticDiscoveryProvider("root-admin-shell", "root-admin", [
        {
          rootFamilyId: "root-admin",
          surfaceKind: "page-route",
          locatorType: "path",
          routePath: "/root-admin/users",
          routeHash: null,
          canonicalLocator: "/root-admin/users",
          displayLabel: "Users",
          userFacingDisposition: "user-facing",
          providerKey: "root-admin-shell",
          implementationSourcePath: "src/frontend/rootAdminShell/assets/app.mjs",
        },
        {
          rootFamilyId: "root-admin",
          surfaceKind: "support-route",
          locatorType: "path",
          routePath: "/root-admin/helper/download/root-auth-signer-helper.mjs",
          routeHash: null,
          canonicalLocator: "/root-admin/helper/download/root-auth-signer-helper.mjs",
          displayLabel: "Root Auth Signer Helper Download",
          userFacingDisposition: "support-only",
          providerKey: "root-admin-shell",
          implementationSourcePath: "src/frontend/rootAdminShell/router.ts",
        },
      ]),
      createStaticDiscoveryProvider("login-empty-provider", "login", []),
    ]);

    const run = await service.runWebAppSurfaceDiscovery({
      scopeKey: "current-approved-root-families",
      triggerKind: "manual",
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(run.status).toBe("succeeded");
    expect(run.createdCount).toBe(2);
    expect(run.supportOnlyCount).toBe(1);

    const surfaces = await service.listDiscoveredWebAppSurfaces({
      page: 1,
      pageSize: 25,
      filters: { staleStatus: "all" },
    });

    expect(surfaces.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          canonicalLocator: "/root-admin/users",
          locatorType: "path",
          userFacingDisposition: "user-facing",
        }),
        expect.objectContaining({
          canonicalLocator: "/root-admin/helper/download/root-auth-signer-helper.mjs",
          userFacingDisposition: "support-only",
        }),
      ]),
    );
  });

  it("TC-WEB-APP-SURF-DISC-UNIT-002 marks previously discovered surfaces stale after a later successful run no longer sees them", async () => {
    const repository = createInMemoryWebAppSurfaceDiscoveryRepository({
      runs: [createDiscoveryRun()],
      surfaces: [createDiscoveredSurfaceRecord()],
    });
    const service = createWebAppSurfaceDiscoveryService(repository, [
      createStaticDiscoveryProvider("login-empty-provider", "login", []),
    ]);

    const run = await service.runWebAppSurfaceDiscovery({
      scopeKey: "current-approved-root-families",
      triggerKind: "manual",
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(run.staleCount).toBe(1);
    const surface = await service.getDiscoveredWebAppSurface(
      "22222222-2222-4222-8222-222222222222",
    );
    expect(surface.staleAt).not.toBeNull();
  });

  it("TC-WEB-APP-SURF-DISC-UNIT-005 returns a discovered structure tree with explicit parent-child nodes and linked leaf truth", async () => {
    const repository = createInMemoryWebAppSurfaceDiscoveryRepository();
    const service = createWebAppSurfaceDiscoveryService(repository, [
      createStaticDiscoveryProvider("design-system-file-routes", "design-system", [
        {
          rootFamilyId: "design-system",
          surfaceKind: "page-route",
          locatorType: "path",
          routePath: "/design-system/components/top-nav",
          routeHash: null,
          canonicalLocator: "/design-system/components/top-nav",
          displayLabel: "Top Nav",
          userFacingDisposition: "user-facing",
          providerKey: "design-system-file-routes",
          implementationSourcePath: "src/frontend/designSystem/components/top-nav.html",
        },
      ]),
    ]);

    const run = await service.runWebAppSurfaceDiscovery({
      scopeKey: "current-approved-root-families",
      triggerKind: "manual",
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(run.structureCreatedCount).toBe(3);

    const tree = await service.listDiscoveredWebAppStructureTree({
      filters: {
        rootFamilyId: "design-system",
        staleStatus: "all",
      },
    });

    expect(tree.totalMatchingRecords).toBe(3);
    expect(tree.items).toEqual([
      expect.objectContaining({
        structureKey: "design-system",
        nodeKind: "root",
        children: [
          expect.objectContaining({
            structureKey: "design-system/components",
            nodeKind: "group",
            children: [
              expect.objectContaining({
                structureKey: "design-system/components/top-nav",
                nodeKind: "page-surface",
                linkedDiscoveredWebAppSurfaceId: expect.any(String),
              }),
            ],
          }),
        ],
      }),
    ]);
  });

  it("TC-WEB-APP-SURF-DISC-UNIT-007 keeps a module route linked when it is also the parent for child routes", async () => {
    const repository = createInMemoryWebAppSurfaceDiscoveryRepository();
    const service = createWebAppSurfaceDiscoveryService(repository, [
      createStaticDiscoveryProvider("design-system-file-routes", "design-system", [
        {
          rootFamilyId: "design-system",
          surfaceKind: "page-route",
          locatorType: "path",
          routePath: "/design-system/canonicals",
          routeHash: null,
          canonicalLocator: "/design-system/canonicals",
          displayLabel: "Canonicals",
          userFacingDisposition: "user-facing",
          providerKey: "design-system-file-routes",
          implementationSourcePath: "src/frontend/designSystem/canonicals/index.html",
        },
        {
          rootFamilyId: "design-system",
          surfaceKind: "page-route",
          locatorType: "path",
          routePath: "/design-system/canonicals/top-nav",
          routeHash: null,
          canonicalLocator: "/design-system/canonicals/top-nav",
          displayLabel: "Top Nav",
          userFacingDisposition: "user-facing",
          providerKey: "design-system-file-routes",
          implementationSourcePath: "src/frontend/designSystem/canonicals/top-nav/index.html",
        },
      ]),
    ]);

    const run = await service.runWebAppSurfaceDiscovery({
      scopeKey: "current-approved-root-families",
      triggerKind: "manual",
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(run.status).toBe("succeeded");

    const tree = await service.listDiscoveredWebAppStructureTree({
      filters: {
        rootFamilyId: "design-system",
        staleStatus: "all",
      },
    });

    expect(tree.items).toEqual([
      expect.objectContaining({
        structureKey: "design-system",
        children: [
          expect.objectContaining({
            structureKey: "design-system/canonicals",
            nodeKind: "group",
            linkedDiscoveredWebAppSurfaceId: expect.any(String),
            implementationSourcePath: "src/frontend/designSystem/canonicals/index.html",
            children: [
              expect.objectContaining({
                structureKey: "design-system/canonicals/top-nav",
                nodeKind: "page-surface",
                linkedDiscoveredWebAppSurfaceId: expect.any(String),
              }),
            ],
          }),
        ],
      }),
    ]);
  });

  it("TC-WEB-APP-SURF-DISC-UNIT-004 marks previously discovered structure nodes stale after a later successful run no longer sees them", async () => {
    const repository = createInMemoryWebAppSurfaceDiscoveryRepository({
      runs: [createDiscoveryRun()],
      surfaces: [createDiscoveredSurfaceRecord()],
      structureNodes: [
        createDiscoveredStructureNodeRecord({
          discoveredWebAppStructureNodeId: "33333333-3333-4333-8333-333333333333",
        }),
      ],
    });
    const service = createWebAppSurfaceDiscoveryService(repository, [
      createStaticDiscoveryProvider("login-empty-provider", "login", []),
    ]);

    const run = await service.runWebAppSurfaceDiscovery({
      scopeKey: "current-approved-root-families",
      triggerKind: "manual",
      createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

    expect(run.structureStaleCount).toBe(1);
    const node = await service.getDiscoveredWebAppStructureNode(
      "33333333-3333-4333-8333-333333333333",
    );
    expect(node.staleAt).not.toBeNull();
  });

  it("TC-WEB-APP-SURF-DISC-UNIT-006 returns one exact discovered structure node by id", async () => {
    const repository = createInMemoryWebAppSurfaceDiscoveryRepository({
      structureNodes: [
        createDiscoveredStructureNodeRecord({
          discoveredWebAppStructureNodeId: "33333333-3333-4333-8333-333333333333",
          structureKey: "design-system/components/top-nav",
          nodeKey: "top-nav",
          nodeKind: "page-surface",
        }),
      ],
    });
    const service = createWebAppSurfaceDiscoveryService(repository, []);

    const node = await service.getDiscoveredWebAppStructureNode(
      "33333333-3333-4333-8333-333333333333",
    );

    expect(node).toMatchObject({
      discoveredWebAppStructureNodeId: "33333333-3333-4333-8333-333333333333",
      structureKey: "design-system/components/top-nav",
      nodeKey: "top-nav",
      nodeKind: "page-surface",
    });
  });

  it("TC-WEB-APP-SURF-DISC-UNIT-003 rejects malformed provider locator output and records a failed run", async () => {
    const repository = createInMemoryWebAppSurfaceDiscoveryRepository();
    const service = createWebAppSurfaceDiscoveryService(repository, [
      createStaticDiscoveryProvider("bad-provider", "root-admin", [
        {
          rootFamilyId: "root-admin",
          surfaceKind: "shell-state",
          locatorType: "hash-state",
          routePath: null,
          routeHash: "users",
          canonicalLocator: "/root-admin#users",
          displayLabel: "Users",
          userFacingDisposition: "user-facing",
          providerKey: "bad-provider",
          implementationSourcePath: "src/frontend/rootAdminShell/assets/app.mjs",
        },
      ]),
    ]);

    await expect(
      service.runWebAppSurfaceDiscovery({
        scopeKey: "current-approved-root-families",
        triggerKind: "manual",
        createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      }),
    ).rejects.toMatchObject({
      code: "DISCOVERED_WEB_APP_SURFACE_LOCATOR_INVALID",
    });

    const runs = await service.listWebAppDiscoveryRuns({
      page: 1,
      pageSize: 25,
      filters: {},
    });
    expect(runs.items[0]?.status).toBe("failed");
  });
});

function createDiscoveryRun() {
  return {
    webAppDiscoveryRunId: "11111111-1111-4111-8111-111111111111",
    scopeKey: "current-approved-root-families" as const,
    status: "succeeded" as const,
    triggerKind: "manual" as const,
    providerVersion: "1",
    createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    startedAt: new Date("2026-04-19T12:00:00.000Z"),
    completedAt: new Date("2026-04-19T12:00:00.000Z"),
    failureSummary: null,
    createdCount: 1,
    refreshedCount: 0,
    unchangedCount: 0,
    staleCount: 0,
    supportOnlyCount: 0,
    reviewRequiredCount: 0,
    structureCreatedCount: 0,
    structureRefreshedCount: 0,
    structureUnchangedCount: 0,
    structureStaleCount: 0,
    createdAt: new Date("2026-04-19T12:00:00.000Z"),
    updatedAt: new Date("2026-04-19T12:00:00.000Z"),
  };
}
