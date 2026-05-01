import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryWebAppHierarchyRepository,
  createStubDesignSystemCanonicalsPublicSeam,
  createStubWebAppSurfaceDiscoveryIntegrationSeam,
  createModuleRecord,
  createPageRecord,
  loginViaPasswordAndSsh,
  mountWebAppHierarchyBuilderFeature,
} from "../../helpers/webAppHierarchyBuilderHarness";
import { createDiscoveredSurfaceRecord } from "../../helpers/webAppSurfaceDiscoveryHarness";

describe("web app hierarchy builder integration flows", () => {
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

  it("TC-WEB-APP-HIER-INT-006 applies structure-aware reconcile and makes GetTree accurate for path and hash-state pages", async () => {
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
