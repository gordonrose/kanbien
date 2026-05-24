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
  it("returns public design-system top-nav projection in one service call", async () => {
    const now = new Date("2026-04-25T00:00:00.000Z");
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [
        createModuleRecord({
          rootFamilyId: "design-system",
          moduleKey: "design-system",
          displayLabel: "Design System",
        }),
      ],
      pages: [
        createPageRecord({
          webAppPageId: "22222222-2222-4222-8222-222222222222",
          rootFamilyId: "design-system",
          pageKey: "design-system",
          displayLabel: "Overview",
          routeSegment: "",
          normalizedRouteSegment: "",
          resolvedFullRoutePath: "/design-system",
          status: "live",
        }),
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          rootFamilyId: "design-system",
          pageKey: "design-system-components",
          displayLabel: "Components",
          routeSegment: "components",
          normalizedRouteSegment: "components",
          resolvedFullRoutePath: "/design-system/components",
          status: "live",
          sortOrder: 1,
        }),
        createPageRecord({
          webAppPageId: "55555555-5555-4555-8555-555555555555",
          rootFamilyId: "design-system",
          pageKey: "design-system-canonical-renderings",
          displayLabel: "Canonical Renderings",
          routeSegment: "canonical-renderings",
          normalizedRouteSegment: "canonical-renderings",
          resolvedFullRoutePath: "/design-system/canonical-renderings",
          status: "live",
          sortOrder: 2,
        }),
        createPageRecord({
          webAppPageId: "44444444-4444-4444-8444-444444444444",
          rootFamilyId: "design-system",
          pageKey: "design-system-canonicals",
          displayLabel: "Canonicals",
          routeSegment: "canonicals",
          normalizedRouteSegment: "canonicals",
          resolvedFullRoutePath: "/design-system/canonicals",
          status: "live",
          sortOrder: 3,
        }),
      ],
    });
    const repository = createInMemoryWebAppPageSettingsRepository({
      settings: [
        {
          webAppPageSettingsId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          parentPageId: null,
          iconKey: null,
          showInTopNav: true,
          topNavOrder: 2,
          pageTemplateKey: "static-html-page",
          createdAt: now,
          updatedAt: now,
        },
        {
          webAppPageSettingsId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3",
          webAppPageId: "55555555-5555-4555-8555-555555555555",
          parentPageId: null,
          iconKey: null,
          showInTopNav: true,
          topNavOrder: 1,
          pageTemplateKey: "static-html-page",
          createdAt: now,
          updatedAt: now,
        },
        {
          webAppPageSettingsId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
          webAppPageId: "44444444-4444-4444-8444-444444444444",
          parentPageId: null,
          iconKey: null,
          showInTopNav: true,
          topNavOrder: 3,
          pageTemplateKey: "static-html-page",
          createdAt: now,
          updatedAt: now,
        },
      ],
    });
    const service = createWebAppPageSettingsService(
      repository,
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );

    await expect(service.getPublicDesignSystemTopNav()).resolves.toEqual({
      items: [
        { href: "/design-system", label: "Overview" },
        { href: "/design-system/tokens", label: "Tokens" },
        { href: "/design-system/canonical-renderings", label: "Canonical Renderings" },
        { href: "/design-system/components", label: "Components" },
        { href: "/design-system/canonicals", label: "Canonicals" },
      ],
    });
  });

  it("TC-WEB-PAGE-SET-UNIT-001 returns fallback self navigation and topology template when no stored settings exist", async () => {
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

  it("TC-WEB-PAGE-SET-UNIT-002 saves durable settings and explicit context-nav membership deterministically", async () => {
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

  it("TC-WEB-PAGE-SET-UNIT-004 accepts governed design-system icon keys during page-settings saves", async () => {
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

  it("TC-WEB-PAGE-SET-UNIT-003 rejects duplicate and ineligible context-nav targets", async () => {
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

  it("TC-WEB-PAGE-SET-EDGE-005 returns parent-owned context-nav items for sibling child pages", async () => {
    const now = new Date("2026-04-28T01:00:00.000Z");
    const parentPageId = "22222222-2222-4222-8222-222222222222";
    const childOnePageId = "33333333-3333-4333-8333-333333333333";
    const childTwoPageId = "44444444-4444-4444-8444-444444444444";
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord({
          webAppPageId: parentPageId,
          pageKey: "settings-parent",
          displayLabel: "Settings Parent",
          routeSegment: "settings-parent",
          normalizedRouteSegment: "settings-parent",
          resolvedFullRoutePath: "/root-admin#parent",
          sortOrder: 0,
        }),
        createPageRecord({
          webAppPageId: childOnePageId,
          parentPageId,
          placementType: "child-page",
          pageKey: "settings-child-one",
          displayLabel: "Child One",
          routeSegment: "child-one",
          normalizedRouteSegment: "child-one",
          resolvedFullRoutePath: "/root-admin#child-one",
          sortOrder: 1,
        }),
        createPageRecord({
          webAppPageId: childTwoPageId,
          parentPageId,
          placementType: "child-page",
          pageKey: "settings-child-two",
          displayLabel: "Child Two",
          routeSegment: "child-two",
          normalizedRouteSegment: "child-two",
          resolvedFullRoutePath: "/root-admin#child-two",
          sortOrder: 2,
        }),
      ],
    });
    const repository = createInMemoryWebAppPageSettingsRepository({
      contextNavItems: [
        {
          webAppPageContextNavItemId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
          ownerWebAppPageId: parentPageId,
          targetWebAppPageId: childTwoPageId,
          sortOrder: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          webAppPageContextNavItemId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
          ownerWebAppPageId: parentPageId,
          targetWebAppPageId: childOnePageId,
          sortOrder: 0,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });
    const service = createWebAppPageSettingsService(
      repository,
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );

    await expect(
      service.getWebAppPageContextNavProjection({
        rootFamilyId: "root-admin",
        pageKey: "child-one",
      }),
    ).resolves.toMatchObject({
      rootFamilyId: "root-admin",
      shellPageKey: "child-one",
      items: [
        {
          webAppPageId: childOnePageId,
          shellPageKey: "child-one",
          displayLabel: "Child One",
          sortOrder: 0,
        },
        {
          webAppPageId: childTwoPageId,
          shellPageKey: "child-two",
          displayLabel: "Child Two",
          sortOrder: 1,
        },
      ],
    });

    await expect(
      service.getWebAppPageContextNavProjection({
        rootFamilyId: "root-admin",
        pageKey: "child-two",
      }),
    ).resolves.toMatchObject({
      items: [
        { webAppPageId: childOnePageId, shellPageKey: "child-one" },
        { webAppPageId: childTwoPageId, shellPageKey: "child-two" },
      ],
    });
  });

  it("TC-WEB-PAGE-SET-EDGE-006 uses the immediate parent page as context-nav owner for nested children", async () => {
    const now = new Date("2026-04-28T01:00:00.000Z");
    const parentPageId = "22222222-2222-4222-8222-222222222222";
    const childPageId = "33333333-3333-4333-8333-333333333333";
    const grandchildPageId = "44444444-4444-4444-8444-444444444444";
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord({
          webAppPageId: parentPageId,
          pageKey: "settings-parent",
          displayLabel: "Settings Parent",
          routeSegment: "settings-parent",
          normalizedRouteSegment: "settings-parent",
          resolvedFullRoutePath: "/root-admin#parent",
        }),
        createPageRecord({
          webAppPageId: childPageId,
          parentPageId,
          placementType: "child-page",
          pageKey: "settings-child",
          displayLabel: "Settings Child",
          routeSegment: "child",
          normalizedRouteSegment: "child",
          resolvedFullRoutePath: "/root-admin#child",
        }),
        createPageRecord({
          webAppPageId: grandchildPageId,
          parentPageId: childPageId,
          placementType: "child-page",
          pageKey: "settings-grandchild",
          displayLabel: "Settings Grandchild",
          routeSegment: "grandchild",
          normalizedRouteSegment: "grandchild",
          resolvedFullRoutePath: "/root-admin#grandchild",
        }),
      ],
    });
    const repository = createInMemoryWebAppPageSettingsRepository({
      contextNavItems: [
        {
          webAppPageContextNavItemId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
          ownerWebAppPageId: parentPageId,
          targetWebAppPageId: childPageId,
          sortOrder: 0,
          createdAt: now,
          updatedAt: now,
        },
        {
          webAppPageContextNavItemId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
          ownerWebAppPageId: childPageId,
          targetWebAppPageId: grandchildPageId,
          sortOrder: 0,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });
    const service = createWebAppPageSettingsService(
      repository,
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );

    await expect(
      service.getWebAppPageContextNavProjection({
        rootFamilyId: "root-admin",
        pageKey: "child",
      }),
    ).resolves.toMatchObject({
      items: [{ webAppPageId: childPageId, shellPageKey: "child" }],
    });

    await expect(
      service.getWebAppPageContextNavProjection({
        rootFamilyId: "root-admin",
        pageKey: "grandchild",
      }),
    ).resolves.toMatchObject({
      items: [{ webAppPageId: grandchildPageId, shellPageKey: "grandchild" }],
    });
  });

  it("TC-WEB-PAGE-SET-UNIT-005 derives root-admin hash-state shell keys from page keys when the stored route falls back to /root-admin", async () => {
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
          resolvedFullRoutePath: "/root-admin/overview/web-app-hierarchy",
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

  it("TC-WEB-PAGE-SET-EDGE-008 trusts root-admin page aliases before nested stored route paths", async () => {
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord({
          webAppPageId: "22222222-2222-4222-8222-222222222222",
          pageKey: "root-admin-overview",
          displayLabel: "Overview",
          routeSegment: "overview",
          normalizedRouteSegment: "overview",
          resolvedFullRoutePath: "/root-admin/overview",
          sortOrder: 0,
        }),
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          pageKey: "root-admin-users",
          displayLabel: "Root Users",
          routeSegment: "users",
          normalizedRouteSegment: "users",
          resolvedFullRoutePath: "/root-admin/overview/users",
          parentPageId: "22222222-2222-4222-8222-222222222222",
          sortOrder: 1,
        }),
        createPageRecord({
          webAppPageId: "44444444-4444-4444-8444-444444444444",
          pageKey: "root-admin-web-app-hierarchy",
          displayLabel: "Page Structure",
          routeSegment: "web-app-hierarchy",
          normalizedRouteSegment: "web-app-hierarchy",
          resolvedFullRoutePath: "/root-admin/overview/web-app-hierarchy",
          parentPageId: "22222222-2222-4222-8222-222222222222",
          sortOrder: 2,
        }),
      ],
    });
    const repository = createInMemoryWebAppPageSettingsRepository({
      contextNavItems: [
        {
          webAppPageContextNavItemId: "55555555-5555-4555-8555-555555555555",
          ownerWebAppPageId: "22222222-2222-4222-8222-222222222222",
          targetWebAppPageId: "33333333-3333-4333-8333-333333333333",
          sortOrder: 0,
          createdAt: new Date("2026-04-28T10:00:00.000Z"),
          updatedAt: new Date("2026-04-28T10:00:00.000Z"),
        },
        {
          webAppPageContextNavItemId: "66666666-6666-4666-8666-666666666666",
          ownerWebAppPageId: "22222222-2222-4222-8222-222222222222",
          targetWebAppPageId: "44444444-4444-4444-8444-444444444444",
          sortOrder: 1,
          createdAt: new Date("2026-04-28T10:00:00.000Z"),
          updatedAt: new Date("2026-04-28T10:00:00.000Z"),
        },
      ],
    });
    const service = createWebAppPageSettingsService(
      repository,
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );

    const result = await service.getWebAppPageContextNavProjection({
      rootFamilyId: "root-admin",
      pageKey: "overview",
    });

    expect(result.items).toEqual([
      expect.objectContaining({
        displayLabel: "Root Users",
        shellPageKey: "users",
        resolvedFullRoutePath: "/root-admin/overview/users",
        effectiveIconKey: "page-default",
      }),
      expect.objectContaining({
        displayLabel: "Page Structure",
        shellPageKey: "web-app-hierarchy",
        resolvedFullRoutePath: "/root-admin/overview/web-app-hierarchy",
        effectiveIconKey: "page-default",
      }),
    ]);
  });

  it("TC-WEB-PAGE-SET-EDGE-007 preserves target page keys and icons when dynamic root-admin routes are not fixed shell sections", async () => {
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [
        createPageRecord({
          webAppPageId: "22222222-2222-4222-8222-222222222222",
          pageKey: "overview",
          displayLabel: "Overview",
          routeSegment: "overview",
          normalizedRouteSegment: "overview",
          resolvedFullRoutePath: "/root-admin",
          sortOrder: 0,
        }),
        createPageRecord({
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          pageKey: "page-structure",
          displayLabel: "Page Structure",
          routeSegment: "page-structure",
          normalizedRouteSegment: "page-structure",
          resolvedFullRoutePath: "/root-admin/page-structure",
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
          createdAt: new Date("2026-04-28T10:00:00.000Z"),
          updatedAt: new Date("2026-04-28T10:00:00.000Z"),
        },
      ],
      settings: [
        {
          webAppPageSettingsId: "55555555-5555-4555-8555-555555555555",
          webAppPageId: "33333333-3333-4333-8333-333333333333",
          parentPageId: null,
          iconKey: "page-list",
          showInTopNav: false,
          topNavOrder: null,
          pageTemplateKey: "static-html-page",
          createdAt: new Date("2026-04-28T10:00:00.000Z"),
          updatedAt: new Date("2026-04-28T10:00:00.000Z"),
        },
      ],
    });
    const service = createWebAppPageSettingsService(
      repository,
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );

    const result = await service.getWebAppPageContextNavProjection({
      rootFamilyId: "root-admin",
      pageKey: "overview",
    });

    expect(result.items).toEqual([
      expect.objectContaining({
        webAppPageId: "33333333-3333-4333-8333-333333333333",
        shellPageKey: "page-structure",
        displayLabel: "Page Structure",
        resolvedFullRoutePath: "/root-admin/page-structure",
        iconKey: "page-list",
        effectiveIconKey: "page-list",
      }),
    ]);
  });
});
