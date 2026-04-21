import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryWebAppSurfaceDiscoveryRepository,
  createStaticDiscoveryProvider,
  mountWebAppSurfaceDiscoveryFeature,
} from "../../helpers/webAppSurfaceDiscoveryHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

describe("webAppSurfaceDiscovery integration flows", () => {
  it("TC-WEB-APP-SURF-DISC-INT-001 lets an authorized root operator run discovery and read current discovered surfaces and run history", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppSurfaceDiscoveryFeature(
      harness.app,
      harness,
      createInMemoryWebAppSurfaceDiscoveryRepository(),
      [
        createStaticDiscoveryProvider("root-admin-shell", "root-admin", [
          {
            rootFamilyId: "root-admin",
            surfaceKind: "shell-state",
            locatorType: "hash-state",
            routePath: "/root-admin",
            routeHash: "users",
            canonicalLocator: "/root-admin#users",
            displayLabel: "Users",
            userFacingDisposition: "user-facing",
            providerKey: "root-admin-shell",
            implementationSourcePath: "src/frontend/rootAdminShell/assets/app.mjs",
          },
        ]),
        createStaticDiscoveryProvider("login-empty-provider", "login", []),
      ],
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const run = await invokeJson<{ webAppDiscoveryRunId: string; status: string }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-surface-discovery/runs",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeKey: "current-approved-root-families",
        triggerKind: "manual",
      },
    });

    expect(run.status).toBe(200);
    expect(run.body.status).toBe("succeeded");

    const surfaces = await invokeJson<{
      items: Array<{ canonicalLocator: string; locatorType: string; userFacingDisposition: string }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-surface-discovery/surfaces",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(surfaces.status).toBe(200);
    expect(surfaces.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          canonicalLocator: "/root-admin#users",
          locatorType: "hash-state",
          userFacingDisposition: "user-facing",
        }),
      ]),
    );

    const runs = await invokeJson<{ items: Array<{ webAppDiscoveryRunId: string; status: string }> }>(
      harness.app,
      {
        method: "GET",
        path: "/v1/web-app-surface-discovery/runs",
        headers: { authorization: `Bearer ${session.sessionId}` },
      },
    );

    expect(runs.status).toBe(200);
    expect(runs.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          webAppDiscoveryRunId: run.body.webAppDiscoveryRunId,
          status: "succeeded",
        }),
      ]),
    );
  });

  it("TC-WEB-APP-SURF-DISC-INT-003 persists and reads a discovered structure tree for multi-segment route families", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppSurfaceDiscoveryFeature(
      harness.app,
      harness,
      createInMemoryWebAppSurfaceDiscoveryRepository(),
      [
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
      ],
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/web-app-surface-discovery/runs",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeKey: "current-approved-root-families",
        triggerKind: "manual",
      },
    });

    const tree = await invokeJson<{
      items: Array<{
        structureKey: string;
        nodeKind: string;
        children: Array<{ structureKey: string; children: Array<{ structureKey: string }> }>;
      }>;
      totalMatchingRecords: number;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-surface-discovery/structure?rootFamilyId=design-system",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(tree.status).toBe(200);
    expect(tree.body.totalMatchingRecords).toBe(3);
    expect(tree.body.items).toEqual([
      expect.objectContaining({
        structureKey: "design-system",
        nodeKind: "root",
        children: [
          expect.objectContaining({
            structureKey: "design-system/components",
            children: [
              expect.objectContaining({
                structureKey: "design-system/components/top-nav",
              }),
            ],
          }),
        ],
      }),
    ]);
  });

  it("TC-WEB-APP-SURF-DISC-INT-004 preserves a linked module route when that route also has child pages", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppSurfaceDiscoveryFeature(
      harness.app,
      harness,
      createInMemoryWebAppSurfaceDiscoveryRepository(),
      [
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
      ],
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/web-app-surface-discovery/runs",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeKey: "current-approved-root-families",
        triggerKind: "manual",
      },
    });

    const tree = await invokeJson<{
      items: Array<{
        structureKey: string;
        linkedDiscoveredWebAppSurfaceId: string | null;
        children: Array<{ structureKey: string; linkedDiscoveredWebAppSurfaceId: string | null }>;
      }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-surface-discovery/structure?rootFamilyId=design-system",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(tree.status).toBe(200);
    expect(tree.body.items).toEqual([
      expect.objectContaining({
        structureKey: "design-system",
        children: [
          expect.objectContaining({
            structureKey: "design-system/canonicals",
            linkedDiscoveredWebAppSurfaceId: expect.any(String),
            children: [
              expect.objectContaining({
                structureKey: "design-system/canonicals/top-nav",
                linkedDiscoveredWebAppSurfaceId: expect.any(String),
              }),
            ],
          }),
        ],
      }),
    ]);
  });

  it("TC-WEB-APP-SURF-DISC-EDGE-005 preserves support-only routes as discovered but non-importable truth", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppSurfaceDiscoveryFeature(
      harness.app,
      harness,
      createInMemoryWebAppSurfaceDiscoveryRepository(),
      [
        createStaticDiscoveryProvider("root-admin-shell", "root-admin", [
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
      ],
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/web-app-surface-discovery/runs",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeKey: "current-approved-root-families",
        triggerKind: "manual",
      },
    });

    const response = await invokeJson<{
      items: Array<{ canonicalLocator: string; userFacingDisposition: string; surfaceKind: string }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-surface-discovery/surfaces?userFacingDisposition=support-only",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([
      expect.objectContaining({
        canonicalLocator: "/root-admin/helper/download/root-auth-signer-helper.mjs",
        userFacingDisposition: "support-only",
        surfaceKind: "support-route",
      }),
    ]);
  });
});
