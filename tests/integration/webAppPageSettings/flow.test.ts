import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryWebAppHierarchyRepository,
  createModuleRecord,
  createPageRecord,
  loginViaPasswordAndSsh,
} from "../../helpers/webAppHierarchyBuilderHarness";
import {
  createInMemoryWebAppPageSettingsRepository,
  createStubWebAppHierarchySettingsSeam,
  mountWebAppPageSettingsFeature,
} from "../../helpers/webAppPageSettingsHarness";

describe("web app page settings integration flows", () => {
  it("TC-WEB-PAGE-SET-INT-001 reads options updates settings and returns effective state for one curated page", async () => {
    const harness = createRootAuthIntegrationHarness();
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord(),
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          parentPageId: "22222222-2222-4222-8222-222222222222",
          placementType: "child-page",
          pageKey: "catalog-list",
          displayLabel: "Catalog List",
          routeSegment: "catalog-list",
          normalizedRouteSegment: "catalog-list",
          resolvedFullRoutePath: "/root-admin/web-app-hierarchy/catalog-list",
          sortOrder: 1,
        }),
      ],
    });
    mountWebAppPageSettingsFeature(
      harness.app,
      harness,
      createInMemoryWebAppPageSettingsRepository(),
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const options = await invokeJson<{
      parentPageId: string | null;
      defaultIconKey: string;
      currentTopologyTemplateKey: string | null;
      eligibleContextNavTargets: Array<{ webAppPageId: string; parentPageId: string | null }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-page-settings/options?webAppPageId=22222222-2222-4222-8222-222222222222",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(options.status).toBe(200);
    expect(options.body.parentPageId).toBeNull();
    expect(options.body.defaultIconKey).toBe("page-default");
    expect(options.body.eligibleContextNavTargets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          webAppPageId: "22222222-2222-4222-8222-222222222222",
          parentPageId: null,
        }),
        expect.objectContaining({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          parentPageId: "22222222-2222-4222-8222-222222222222",
        }),
      ]),
    );

    const updated = await invokeJson<{
      hasStoredSettings: boolean;
      parentPageId: string | null;
      effectiveIconKey: string;
      showInTopNav: boolean;
      contextNavItems: Array<{ targetWebAppPageId: string; source: string }>;
    }>(harness.app, {
      method: "PUT",
      path: "/v1/web-app-page-settings/pages/22222222-2222-4222-8222-222222222222",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        iconKey: "page-home",
        showInTopNav: true,
        topNavOrder: 2,
        pageTemplateKey: "static-html-page",
        contextNavTargetPageIds: [
          "22222222-2222-4222-8222-222222222222",
          "33333333-3333-4333-8333-333333333333",
        ],
      },
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      hasStoredSettings: true,
      parentPageId: null,
      effectiveIconKey: "page-home",
      showInTopNav: true,
    });
    expect(updated.body.contextNavItems).toEqual([
      expect.objectContaining({
        targetWebAppPageId: "22222222-2222-4222-8222-222222222222",
        source: "explicit",
      }),
      expect.objectContaining({
        targetWebAppPageId: "33333333-3333-4333-8333-333333333333",
        source: "explicit",
      }),
    ]);

    const readBack = await invokeJson<{
      parentPageId: string | null;
      iconKey: string | null;
      effectivePageTemplateKey: string | null;
    }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-page-settings/pages/22222222-2222-4222-8222-222222222222",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(readBack.status).toBe(200);
    expect(readBack.body).toMatchObject({
      parentPageId: null,
      iconKey: "page-home",
      effectivePageTemplateKey: "static-html-page",
    });
  });

  it("TC-WEB-PAGE-SET-INT-002 accepts governed design-system icon keys through the transport seam", async () => {
    const harness = createRootAuthIntegrationHarness();
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [createPageRecord()],
    });
    mountWebAppPageSettingsFeature(
      harness.app,
      harness,
      createInMemoryWebAppPageSettingsRepository(),
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const updated = await invokeJson<{
      iconKey: string | null;
      effectiveIconKey: string;
    }>(harness.app, {
      method: "PUT",
      path: "/v1/web-app-page-settings/pages/22222222-2222-4222-8222-222222222222",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        iconKey: "grid",
      },
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      iconKey: "grid",
      effectiveIconKey: "grid",
    });
  });
});
