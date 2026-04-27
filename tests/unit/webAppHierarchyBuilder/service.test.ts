import { describe, expect, it } from "vitest";
import { createWebAppHierarchyBuilderService } from "../../../src/features/webAppHierarchyBuilder/domain/service";
import {
  LiveRouteChangeBlockedError,
  PageKeyAlreadyExistsError,
} from "../../../src/features/webAppHierarchyBuilder/contract/errors";
import {
  createInMemoryWebAppHierarchyRepository,
  createStubDesignSystemCanonicalsPublicSeam,
  createStubDesignSystemMaterializer,
  createStubWebAppSurfaceDiscoveryIntegrationSeam,
  createModuleRecord,
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

  it("TC-WEB-APP-HIER-UNIT-010 previews structure-aware reconcile for multi-segment paths and migrated root-admin path pages", async () => {
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
