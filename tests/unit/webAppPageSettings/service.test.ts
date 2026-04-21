import { describe, expect, it } from "vitest";
import { createWebAppPageSettingsService } from "../../../src/features/webAppPageSettings/domain/service";
import {
  DuplicateContextNavTargetError,
  InvalidContextNavTargetError,
} from "../../../src/features/webAppPageSettings/contract/errors";
import {
  createInMemoryWebAppHierarchyRepository,
  createModuleRecord,
  createPageRecord,
} from "../../helpers/webAppHierarchyBuilderHarness";
import {
  createInMemoryWebAppPageSettingsRepository,
  createStubWebAppHierarchySettingsSeam,
} from "../../helpers/webAppPageSettingsHarness";

describe("web app page settings service", () => {
  it("TC-WEB-APP-PAGE-SETTINGS-UNIT-001 returns fallback self navigation and topology template when no stored settings exist", async () => {
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord({
          templateKey: "static-html-page",
        }),
      ],
    });
    const repository = createInMemoryWebAppPageSettingsRepository();
    const service = createWebAppPageSettingsService(
      repository,
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );

    const result = await service.getWebAppPageSettings({
      webAppPageId: "22222222-2222-4222-8222-222222222222",
    });

    expect(result.hasStoredSettings).toBe(false);
    expect(result.parentPageId).toBeNull();
    expect(result.effectiveIconKey).toBe("page-default");
    expect(result.effectivePageTemplateKey).toBe("static-html-page");
    expect(result.contextNavItems).toEqual([
      expect.objectContaining({
        targetWebAppPageId: "22222222-2222-4222-8222-222222222222",
        source: "fallback-self",
      }),
    ]);
  });

  it("TC-WEB-APP-PAGE-SETTINGS-UNIT-002 saves durable settings and explicit context-nav membership deterministically", async () => {
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
    const repository = createInMemoryWebAppPageSettingsRepository();
    const service = createWebAppPageSettingsService(
      repository,
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );

    const result = await service.updateWebAppPageSettings({
      webAppPageId: "22222222-2222-4222-8222-222222222222",
      iconKey: "page-home",
      showInTopNav: true,
      topNavOrder: 3,
      pageTemplateKey: "static-html-page",
      contextNavTargetPageIds: [
        "22222222-2222-4222-8222-222222222222",
        "33333333-3333-4333-8333-333333333333",
      ],
    });

    expect(result).toMatchObject({
      hasStoredSettings: true,
      parentPageId: null,
      iconKey: "page-home",
      effectiveIconKey: "page-home",
      showInTopNav: true,
      topNavOrder: 3,
      pageTemplateKey: "static-html-page",
      effectivePageTemplateKey: "static-html-page",
    });
    expect(result.contextNavItems).toEqual([
      expect.objectContaining({
        targetWebAppPageId: "22222222-2222-4222-8222-222222222222",
        sortOrder: 0,
        source: "explicit",
      }),
      expect.objectContaining({
        targetWebAppPageId: "33333333-3333-4333-8333-333333333333",
        sortOrder: 1,
        source: "explicit",
      }),
    ]);
  });

  it("TC-WEB-APP-PAGE-SETTINGS-UNIT-004 accepts governed design-system icon keys during page-settings saves", async () => {
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [createPageRecord()],
    });
    const repository = createInMemoryWebAppPageSettingsRepository();
    const service = createWebAppPageSettingsService(
      repository,
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );

    const result = await service.updateWebAppPageSettings({
      webAppPageId: "22222222-2222-4222-8222-222222222222",
      iconKey: "grid",
    });

    expect(result).toMatchObject({
      hasStoredSettings: true,
      parentPageId: null,
      iconKey: "grid",
      effectiveIconKey: "grid",
    });
  });

  it("TC-WEB-APP-PAGE-SETTINGS-UNIT-003 rejects duplicate and ineligible context-nav targets", async () => {
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [
        createModuleRecord(),
        createModuleRecord({
          webAppModuleId: "44444444-4444-4444-8444-444444444444",
          rootFamilyId: "login",
          moduleKey: "login",
          displayLabel: "Login",
        }),
      ],
      pages: [
        createPageRecord(),
        createPageRecord({
          webAppPageId: "55555555-5555-4555-8555-555555555555",
          rootFamilyId: "login",
          webAppModuleId: "44444444-4444-4444-8444-444444444444",
          pageKey: "login-home",
          displayLabel: "Login Home",
          routeSegment: "login-home",
          normalizedRouteSegment: "login-home",
          resolvedFullRoutePath: "/login/login-home",
        }),
      ],
    });
    const repository = createInMemoryWebAppPageSettingsRepository();
    const service = createWebAppPageSettingsService(
      repository,
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );

    await expect(
      service.updateWebAppPageSettings({
        webAppPageId: "22222222-2222-4222-8222-222222222222",
        contextNavTargetPageIds: [
          "22222222-2222-4222-8222-222222222222",
          "22222222-2222-4222-8222-222222222222",
        ],
      }),
    ).rejects.toBeInstanceOf(DuplicateContextNavTargetError);

    await expect(
      service.updateWebAppPageSettings({
        webAppPageId: "22222222-2222-4222-8222-222222222222",
        contextNavTargetPageIds: ["55555555-5555-4555-8555-555555555555"],
      }),
    ).rejects.toBeInstanceOf(InvalidContextNavTargetError);
  });

  it("TC-WEB-APP-PAGE-SETTINGS-UNIT-005 derives root-admin hash-state shell keys from page keys when the stored route falls back to /root-admin", async () => {
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord({
          webAppPageId: "22222222-2222-4222-8222-222222222222",
          pageKey: "overview",
          displayLabel: "Overview",
          routeSegment: "overview",
          normalizedRouteSegment: "overview",
          resolvedFullRoutePath: "/root-admin#overview",
          sortOrder: 0,
        }),
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          pageKey: "root-admin-web-app-hierarchy",
          displayLabel: "Web App Hierarchy",
          routeSegment: "web-app-hierarchy",
          normalizedRouteSegment: "web-app-hierarchy",
          resolvedFullRoutePath: "/root-admin",
          sortOrder: 1,
        }),
      ],
    });
    const repository = createInMemoryWebAppPageSettingsRepository({
      contextNavItems: [
        {
          webAppPageContextNavItemId: "44444444-4444-4444-8444-444444444444",
          ownerWebAppPageId: "22222222-2222-4222-8222-222222222222",
          targetWebAppPageId: "33333333-3333-4333-8333-333333333333",
          sortOrder: 0,
          createdAt: new Date("2026-04-20T01:00:00.000Z"),
          updatedAt: new Date("2026-04-20T01:00:00.000Z"),
        },
      ],
      settings: [
        {
          webAppPageSettingsId: "55555555-5555-4555-8555-555555555555",
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          parentPageId: null,
          iconKey: "page-default",
          showInTopNav: false,
          topNavOrder: null,
          pageTemplateKey: "static-html-page",
          createdAt: new Date("2026-04-20T01:00:00.000Z"),
          updatedAt: new Date("2026-04-20T01:00:00.000Z"),
        },
      ],
    });
    const service = createWebAppPageSettingsService(
      repository,
      {
        getPageById(webAppPageId) {
          return hierarchyRepository.findPageById(webAppPageId);
        },
        async listPagesByRootFamily(input) {
          const pages = await hierarchyRepository.listPages();
          return pages.filter((page) => page.rootFamilyId === input.rootFamilyId);
        },
        async listSelectablePagesForSettings(input) {
          const owner = await hierarchyRepository.findPageById(input.ownerWebAppPageId);
          if (!owner) {
            return [];
          }
          const pages = await hierarchyRepository.listPages();
          return pages.filter((page) => page.rootFamilyId === owner.rootFamilyId);
        },
      },
    );

    const result = await service.getWebAppPageContextNavProjection({
      rootFamilyId: "root-admin",
      pageKey: "overview",
    });

    expect(result.items).toEqual([
      expect.objectContaining({
        webAppPageId: "33333333-3333-4333-8333-333333333333",
        shellPageKey: "web-app-hierarchy",
        displayLabel: "Web App Hierarchy",
        effectiveIconKey: "page-default",
      }),
    ]);
  });
});
