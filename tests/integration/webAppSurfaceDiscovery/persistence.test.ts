import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresWebAppSurfaceDiscoveryRepository } from "../../../src/features/webAppSurfaceDiscovery/persistence/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("webAppSurfaceDiscovery postgres repository", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, [
      "rootUsers",
      "platformSecurity",
      "rootAuth",
      "rootRoles",
      "webAppSurfaceDiscovery",
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-WEB-APP-SURF-DISC-INT-005 enforces discovered-surface uniqueness and discovery-run foreign keys", async () => {
    const repository = createPostgresWebAppSurfaceDiscoveryRepository(pool);

    const run = await repository.createDiscoveryRun({
      webAppDiscoveryRunId: "11111111-1111-4111-8111-111111111111",
      scopeKey: "current-approved-root-families",
      status: "running",
      triggerKind: "manual",
      providerVersion: "1",
      createdByRootAdminUserId: null,
      startedAt: new Date("2026-04-19T12:00:00.000Z"),
    });

    const created = await repository.createDiscoveredSurface({
      discoveredWebAppSurfaceId: "22222222-2222-4222-8222-222222222222",
      rootFamilyId: "design-system",
      discoveryKey: "design-system:path:/design-system/components/top-nav",
      surfaceKind: "page-route",
      locatorType: "path",
      routePath: "/design-system/components/top-nav",
      routeHash: null,
      canonicalLocator: "/design-system/components/top-nav",
      displayLabel: "Top Nav",
      userFacingDisposition: "user-facing",
      providerKey: "design-system-file-routes",
      implementationSourcePath: "src/frontend/designSystem/components/top-nav.html",
      firstDiscoveredRunId: run.webAppDiscoveryRunId,
      lastDiscoveredRunId: run.webAppDiscoveryRunId,
      firstDiscoveredAt: new Date("2026-04-19T12:00:00.000Z"),
      lastDiscoveredAt: new Date("2026-04-19T12:00:00.000Z"),
    });

    expect(created.canonicalLocator).toBe("/design-system/components/top-nav");

    await expect(
      repository.createDiscoveredSurface({
        discoveredWebAppSurfaceId: "33333333-3333-4333-8333-333333333333",
        rootFamilyId: "design-system",
        discoveryKey: "duplicate",
        surfaceKind: "page-route",
        locatorType: "path",
        routePath: "/design-system/components/top-nav",
        routeHash: null,
        canonicalLocator: "/design-system/components/top-nav",
        displayLabel: "Top Nav",
        userFacingDisposition: "user-facing",
        providerKey: "design-system-file-routes",
        implementationSourcePath: "src/frontend/designSystem/components/top-nav.html",
        firstDiscoveredRunId: run.webAppDiscoveryRunId,
        lastDiscoveredRunId: run.webAppDiscoveryRunId,
        firstDiscoveredAt: new Date("2026-04-19T12:01:00.000Z"),
        lastDiscoveredAt: new Date("2026-04-19T12:01:00.000Z"),
      }),
    ).rejects.toBeTruthy();

    const structureNode = await repository.createDiscoveredStructureNode({
      discoveredWebAppStructureNodeId: "44444444-4444-4444-8444-444444444444",
      rootFamilyId: "design-system",
      structureKey: "design-system/components/top-nav",
      parentStructureKey: "design-system/components",
      parentDiscoveredWebAppStructureNodeId: null,
      nodeKey: "top-nav",
      nodeKind: "page-surface",
      displayLabel: "Top Nav",
      depth: 2,
      linkedDiscoveredWebAppSurfaceId: created.discoveredWebAppSurfaceId,
      providerKey: "design-system-file-routes",
      implementationSourcePath: "src/frontend/designSystem/components/top-nav.html",
      firstDiscoveredRunId: run.webAppDiscoveryRunId,
      lastDiscoveredRunId: run.webAppDiscoveryRunId,
      firstDiscoveredAt: new Date("2026-04-19T12:00:00.000Z"),
      lastDiscoveredAt: new Date("2026-04-19T12:00:00.000Z"),
    });

    expect(structureNode.structureKey).toBe("design-system/components/top-nav");

    await expect(
      repository.createDiscoveredStructureNode({
        discoveredWebAppStructureNodeId: "55555555-5555-4555-8555-555555555555",
        rootFamilyId: "design-system",
        structureKey: "design-system/components/top-nav",
        parentStructureKey: "design-system/components",
        parentDiscoveredWebAppStructureNodeId: null,
        nodeKey: "top-nav",
        nodeKind: "page-surface",
        displayLabel: "Top Nav",
        depth: 2,
        linkedDiscoveredWebAppSurfaceId: created.discoveredWebAppSurfaceId,
        providerKey: "design-system-file-routes",
        implementationSourcePath: "src/frontend/designSystem/components/top-nav.html",
        firstDiscoveredRunId: run.webAppDiscoveryRunId,
        lastDiscoveredRunId: run.webAppDiscoveryRunId,
        firstDiscoveredAt: new Date("2026-04-19T12:01:00.000Z"),
        lastDiscoveredAt: new Date("2026-04-19T12:01:00.000Z"),
      }),
    ).rejects.toBeTruthy();
  });

  it("TC-WEB-APP-SURF-DISC-INT-006 allows structure group nodes to retain a linked surface when they also own child routes", async () => {
    const repository = createPostgresWebAppSurfaceDiscoveryRepository(pool);

    const run = await repository.createDiscoveryRun({
      webAppDiscoveryRunId: "66666666-6666-4666-8666-666666666666",
      scopeKey: "current-approved-root-families",
      status: "running",
      triggerKind: "manual",
      providerVersion: "2",
      createdByRootAdminUserId: null,
      startedAt: new Date("2026-04-21T09:00:00.000Z"),
    });

    const created = await repository.createDiscoveredSurface({
      discoveredWebAppSurfaceId: "77777777-7777-4777-8777-777777777777",
      rootFamilyId: "design-system",
      discoveryKey: "design-system:path:/design-system/canonicals",
      surfaceKind: "page-route",
      locatorType: "path",
      routePath: "/design-system/canonicals",
      routeHash: null,
      canonicalLocator: "/design-system/canonicals",
      displayLabel: "Canonicals",
      userFacingDisposition: "user-facing",
      providerKey: "design-system-file-routes",
      implementationSourcePath: "src/frontend/designSystem/canonicals/index.html",
      firstDiscoveredRunId: run.webAppDiscoveryRunId,
      lastDiscoveredRunId: run.webAppDiscoveryRunId,
      firstDiscoveredAt: new Date("2026-04-21T09:00:00.000Z"),
      lastDiscoveredAt: new Date("2026-04-21T09:00:00.000Z"),
    });

    const structureNode = await repository.createDiscoveredStructureNode({
      discoveredWebAppStructureNodeId: "88888888-8888-4888-8888-888888888888",
      rootFamilyId: "design-system",
      structureKey: "design-system/canonicals",
      parentStructureKey: "design-system",
      parentDiscoveredWebAppStructureNodeId: null,
      nodeKey: "canonicals",
      nodeKind: "group",
      displayLabel: "Canonicals",
      depth: 1,
      linkedDiscoveredWebAppSurfaceId: created.discoveredWebAppSurfaceId,
      providerKey: "design-system-file-routes",
      implementationSourcePath: "src/frontend/designSystem/canonicals/index.html",
      firstDiscoveredRunId: run.webAppDiscoveryRunId,
      lastDiscoveredRunId: run.webAppDiscoveryRunId,
      firstDiscoveredAt: new Date("2026-04-21T09:00:00.000Z"),
      lastDiscoveredAt: new Date("2026-04-21T09:00:00.000Z"),
    });

    expect(structureNode).toMatchObject({
      structureKey: "design-system/canonicals",
      nodeKind: "group",
      linkedDiscoveredWebAppSurfaceId: created.discoveredWebAppSurfaceId,
    });
  });
});
