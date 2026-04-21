import { expect, test, type Page } from "@playwright/test";

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "2027-04-16T18:00:00.000Z",
};

const MODULE_PATTERNS_ID = "11111111-1111-4111-8111-111111111111";
const PAGE_HIERARCHY_ID = "22222222-2222-4222-8222-222222222222";
const PAGE_CHOICE_GROUP_ID = "33333333-3333-4333-8333-333333333333";
const PAGE_CHOICE_GROUP_BUILDER_ID = "44444444-4444-4444-8444-444444444444";
const PAGE_NEW_PATTERN_ID = "55555555-5555-4555-8555-555555555555";
const PROPOSAL_PAGE_ID = "66666666-6666-4666-8666-666666666666";
const MODULE_ROOT_ADMIN_DISCOVERED_ID = "77777777-7777-4777-8777-777777777777";
const PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID = "88888888-8888-4888-8888-888888888888";
const PAGE_ROOT_ADMIN_OVERVIEW_ID = "99999999-9999-4999-8999-999999999991";
const PAGE_ROOT_ADMIN_ROLES_ID = "99999999-9999-4999-8999-999999999992";
const PAGE_ROOT_ADMIN_TENANT_ADMINS_ID = "99999999-9999-4999-8999-999999999993";
const PAGE_ROOT_ADMIN_TENANTS_ID = "99999999-9999-4999-8999-999999999994";
const PAGE_ROOT_ADMIN_USERS_ID = "99999999-9999-4999-8999-999999999995";

const baseHierarchyTree = {
  rootFamilies: [
    {
      rootFamilyId: "design-system",
      displayLabel: "Design System",
      routePrefix: "/design-system",
      sortOrder: 2,
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-16T18:00:00.000Z",
      modules: [
        {
          webAppModuleId: MODULE_PATTERNS_ID,
          rootFamilyId: "design-system",
          moduleKey: "patterns",
          displayLabel: "Patterns",
          landingPageWebAppPageId: PAGE_HIERARCHY_ID,
          status: "live",
          sortOrder: 1,
          createdAt: "2026-04-01T10:00:00.000Z",
          updatedAt: "2026-04-16T18:00:00.000Z",
          pages: [
            {
              webAppPageId: PAGE_HIERARCHY_ID,
              rootFamilyId: "design-system",
              webAppModuleId: MODULE_PATTERNS_ID,
              parentPageId: null,
              placementType: "module-root",
              pageKey: "hierarchy-tree",
              displayLabel: "Hierarchy Tree",
              routeSegment: "hierarchy-tree",
              resolvedFullRoutePath: "/design-system/patterns/hierarchy-tree",
              status: "live",
              sortOrder: 1,
              createdByRootAdminUserId: "root_user_001",
              bootstrapSource: null,
              topologyState: "applied",
              templateKey: "static-html-page",
              materializedAt: "2026-04-16T18:00:00.000Z",
              createdAt: "2026-04-01T10:00:00.000Z",
              updatedAt: "2026-04-16T18:00:00.000Z",
              activeLocator: {
                webAppPageLocatorId: "locator-patterns-hierarchy-tree",
                webAppPageId: PAGE_HIERARCHY_ID,
                rootFamilyId: "design-system",
                locatorType: "path",
                canonicalLocator: "/design-system/patterns/hierarchy-tree",
                routePath: "/design-system/patterns/hierarchy-tree",
                routeHash: null,
                normalizedLocatorKey: "/design-system/patterns/hierarchy-tree",
                isActive: true,
                createdByRootAdminUserId: "root_user_001",
                createdAt: "2026-04-01T10:00:00.000Z",
                updatedAt: "2026-04-16T18:00:00.000Z",
              },
              children: [],
            },
          ],
          orphanedPages: [],
        },
      ],
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createMockHierarchyTree() {
  return clone(baseHierarchyTree);
}

function createRefreshReconciledHierarchyTree() {
  const tree = createMockHierarchyTree();
  tree.rootFamilies.unshift({
    rootFamilyId: "root-admin",
    displayLabel: "Root Admin",
    routePrefix: "/root-admin",
    sortOrder: 1,
    createdAt: "2026-04-20T11:00:00.000Z",
    updatedAt: "2026-04-20T11:30:00.000Z",
    modules: [
      {
        webAppModuleId: MODULE_ROOT_ADMIN_DISCOVERED_ID,
        rootFamilyId: "root-admin",
        moduleKey: "root-admin-discovered-routes",
        displayLabel: "Root Admin Discovered Pages",
        landingPageWebAppPageId: null,
        status: "review",
        sortOrder: 1,
        createdAt: "2026-04-20T11:00:00.000Z",
        updatedAt: "2026-04-20T11:30:00.000Z",
        pages: [
          {
            webAppPageId: PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID,
            rootFamilyId: "root-admin",
            webAppModuleId: MODULE_ROOT_ADMIN_DISCOVERED_ID,
            parentPageId: null,
            placementType: "module-root",
            pageKey: "root-admin-web-app-hierarchy",
            displayLabel: "Web App Hierarchy",
            routeSegment: "web-app-hierarchy",
            resolvedFullRoutePath: "/root-admin#web-app-hierarchy",
            status: "review",
            sortOrder: 1,
            createdByRootAdminUserId: "root_user_001",
            bootstrapSource: "structure-aware-discovery-sync",
            topologyState: "applied",
            templateKey: null,
            materializedAt: null,
            createdAt: "2026-04-20T11:00:00.000Z",
            updatedAt: "2026-04-20T11:30:00.000Z",
            activeLocator: {
              webAppPageLocatorId: "locator-root-admin-web-app-hierarchy",
              webAppPageId: PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID,
              rootFamilyId: "root-admin",
              locatorType: "hash-state",
              canonicalLocator: "/root-admin#web-app-hierarchy",
              routePath: "/root-admin",
              routeHash: "web-app-hierarchy",
              normalizedLocatorKey: "/root-admin#web-app-hierarchy",
              isActive: true,
              createdByRootAdminUserId: "root_user_001",
              createdAt: "2026-04-20T11:00:00.000Z",
              updatedAt: "2026-04-20T11:30:00.000Z",
            },
            children: [],
          },
        ],
        orphanedPages: [],
      },
    ],
  });

  return tree;
}

function createRootAdminCurrentPageSelectionTree() {
  return {
    rootFamilies: [
      {
        rootFamilyId: "root-admin",
        displayLabel: "Root Admin",
        routePrefix: "/root-admin",
        sortOrder: 1,
        createdAt: "2026-04-20T11:00:00.000Z",
        updatedAt: "2026-04-20T11:30:00.000Z",
        modules: [
          {
            webAppModuleId: "90000000-0000-4000-8000-000000000001",
            rootFamilyId: "root-admin",
            moduleKey: "catalog",
            displayLabel: "Catalog",
            landingPageWebAppPageId: "90000000-0000-4000-8000-000000000002",
            status: "live",
            sortOrder: 1,
            createdAt: "2026-04-20T11:00:00.000Z",
            updatedAt: "2026-04-20T11:30:00.000Z",
            pages: [
              {
                webAppPageId: "90000000-0000-4000-8000-000000000002",
                rootFamilyId: "root-admin",
                webAppModuleId: "90000000-0000-4000-8000-000000000001",
                parentPageId: null,
                placementType: "module-root",
                pageKey: "catalog-home",
                displayLabel: "Catalog Home",
                routeSegment: "catalog",
                resolvedFullRoutePath: "/root-admin/catalog",
                status: "live",
                sortOrder: 1,
                createdByRootAdminUserId: "root_user_001",
                bootstrapSource: null,
                topologyState: "applied",
                templateKey: "static-html-page",
                materializedAt: "2026-04-20T11:00:00.000Z",
                createdAt: "2026-04-20T11:00:00.000Z",
                updatedAt: "2026-04-20T11:30:00.000Z",
                activeLocator: {
                  webAppPageLocatorId: "locator-root-admin-catalog-home",
                  webAppPageId: "90000000-0000-4000-8000-000000000002",
                  rootFamilyId: "root-admin",
                  locatorType: "path",
                  canonicalLocator: "/root-admin/catalog",
                  routePath: "/root-admin/catalog",
                  routeHash: null,
                  normalizedLocatorKey: "/root-admin/catalog",
                  isActive: true,
                  createdByRootAdminUserId: "root_user_001",
                  createdAt: "2026-04-20T11:00:00.000Z",
                  updatedAt: "2026-04-20T11:30:00.000Z",
                },
                children: [],
              },
            ],
            orphanedPages: [],
          },
          {
            webAppModuleId: MODULE_ROOT_ADMIN_DISCOVERED_ID,
            rootFamilyId: "root-admin",
            moduleKey: "root-admin-discovered-routes",
            displayLabel: "Root Admin Discovered Pages",
            landingPageWebAppPageId: null,
            status: "review",
            sortOrder: 2,
            createdAt: "2026-04-20T11:00:00.000Z",
            updatedAt: "2026-04-20T11:30:00.000Z",
            pages: [
              {
                webAppPageId: PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID,
                rootFamilyId: "root-admin",
                webAppModuleId: MODULE_ROOT_ADMIN_DISCOVERED_ID,
                parentPageId: null,
                placementType: "module-root",
                pageKey: "root-admin-web-app-hierarchy",
                displayLabel: "Web App Hierarchy",
                routeSegment: "web-app-hierarchy",
                resolvedFullRoutePath: "/root-admin#web-app-hierarchy",
                status: "review",
                sortOrder: 1,
                createdByRootAdminUserId: "root_user_001",
                bootstrapSource: "structure-aware-discovery-sync",
                topologyState: "applied",
                templateKey: null,
                materializedAt: null,
                createdAt: "2026-04-20T11:00:00.000Z",
                updatedAt: "2026-04-20T11:30:00.000Z",
                activeLocator: {
                  webAppPageLocatorId: "locator-root-admin-web-app-hierarchy",
                  webAppPageId: PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID,
                  rootFamilyId: "root-admin",
                  locatorType: "hash-state",
                  canonicalLocator: "/root-admin#web-app-hierarchy",
                  routePath: "/root-admin",
                  routeHash: "web-app-hierarchy",
                  normalizedLocatorKey: "/root-admin#web-app-hierarchy",
                  isActive: true,
                  createdByRootAdminUserId: "root_user_001",
                  createdAt: "2026-04-20T11:00:00.000Z",
                  updatedAt: "2026-04-20T11:30:00.000Z",
                },
                children: [],
              },
            ],
            orphanedPages: [],
          },
        ],
      },
    ],
  };
}

function createRootAdminVisibleContextNavTree() {
  const tree = createRootAdminCurrentPageSelectionTree();
  const discoveredModule = tree.rootFamilies[0]?.modules?.find((module) => module.moduleKey === "root-admin-discovered-routes");
  if (!discoveredModule) {
    return tree;
  }

  discoveredModule.pages = [
    {
      webAppPageId: PAGE_ROOT_ADMIN_OVERVIEW_ID,
      rootFamilyId: "root-admin",
      webAppModuleId: MODULE_ROOT_ADMIN_DISCOVERED_ID,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "overview",
      displayLabel: "Overview",
      routeSegment: "overview",
      resolvedFullRoutePath: "/root-admin#overview",
      status: "review",
      sortOrder: 1,
      createdByRootAdminUserId: "root_user_001",
      bootstrapSource: "structure-aware-discovery-sync",
      topologyState: "applied",
      templateKey: null,
      materializedAt: null,
      createdAt: "2026-04-20T11:00:00.000Z",
      updatedAt: "2026-04-20T11:30:00.000Z",
      activeLocator: {
        webAppPageLocatorId: "locator-root-admin-overview",
        webAppPageId: PAGE_ROOT_ADMIN_OVERVIEW_ID,
        rootFamilyId: "root-admin",
        locatorType: "hash-state",
        canonicalLocator: "/root-admin#overview",
        routePath: "/root-admin",
        routeHash: "overview",
        normalizedLocatorKey: "/root-admin#overview",
        isActive: true,
        createdByRootAdminUserId: "root_user_001",
        createdAt: "2026-04-20T11:00:00.000Z",
        updatedAt: "2026-04-20T11:30:00.000Z",
      },
      children: [],
    },
    {
      webAppPageId: PAGE_ROOT_ADMIN_ROLES_ID,
      rootFamilyId: "root-admin",
      webAppModuleId: MODULE_ROOT_ADMIN_DISCOVERED_ID,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "roles",
      displayLabel: "Roles",
      routeSegment: "roles",
      resolvedFullRoutePath: "/root-admin/roles",
      status: "review",
      sortOrder: 2,
      createdByRootAdminUserId: "root_user_001",
      bootstrapSource: "structure-aware-discovery-sync",
      topologyState: "applied",
      templateKey: null,
      materializedAt: null,
      createdAt: "2026-04-20T11:00:00.000Z",
      updatedAt: "2026-04-20T11:30:00.000Z",
      activeLocator: {
        webAppPageLocatorId: "locator-root-admin-roles",
        webAppPageId: PAGE_ROOT_ADMIN_ROLES_ID,
        rootFamilyId: "root-admin",
        locatorType: "path",
        canonicalLocator: "/root-admin/roles",
        routePath: "/root-admin/roles",
        routeHash: null,
        normalizedLocatorKey: "/root-admin/roles",
        isActive: true,
        createdByRootAdminUserId: "root_user_001",
        createdAt: "2026-04-20T11:00:00.000Z",
        updatedAt: "2026-04-20T11:30:00.000Z",
      },
      children: [],
    },
    {
      webAppPageId: PAGE_ROOT_ADMIN_TENANT_ADMINS_ID,
      rootFamilyId: "root-admin",
      webAppModuleId: MODULE_ROOT_ADMIN_DISCOVERED_ID,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "tenant-admins",
      displayLabel: "Tenant Admins",
      routeSegment: "tenant-admins",
      resolvedFullRoutePath: "/root-admin/tenant-admins",
      status: "review",
      sortOrder: 3,
      createdByRootAdminUserId: "root_user_001",
      bootstrapSource: "structure-aware-discovery-sync",
      topologyState: "applied",
      templateKey: null,
      materializedAt: null,
      createdAt: "2026-04-20T11:00:00.000Z",
      updatedAt: "2026-04-20T11:30:00.000Z",
      activeLocator: {
        webAppPageLocatorId: "locator-root-admin-tenant-admins",
        webAppPageId: PAGE_ROOT_ADMIN_TENANT_ADMINS_ID,
        rootFamilyId: "root-admin",
        locatorType: "path",
        canonicalLocator: "/root-admin/tenant-admins",
        routePath: "/root-admin/tenant-admins",
        routeHash: null,
        normalizedLocatorKey: "/root-admin/tenant-admins",
        isActive: true,
        createdByRootAdminUserId: "root_user_001",
        createdAt: "2026-04-20T11:00:00.000Z",
        updatedAt: "2026-04-20T11:30:00.000Z",
      },
      children: [],
    },
    {
      webAppPageId: PAGE_ROOT_ADMIN_TENANTS_ID,
      rootFamilyId: "root-admin",
      webAppModuleId: MODULE_ROOT_ADMIN_DISCOVERED_ID,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "tenants",
      displayLabel: "Tenants",
      routeSegment: "tenants",
      resolvedFullRoutePath: "/root-admin/tenants",
      status: "review",
      sortOrder: 4,
      createdByRootAdminUserId: "root_user_001",
      bootstrapSource: "structure-aware-discovery-sync",
      topologyState: "applied",
      templateKey: null,
      materializedAt: null,
      createdAt: "2026-04-20T11:00:00.000Z",
      updatedAt: "2026-04-20T11:30:00.000Z",
      activeLocator: {
        webAppPageLocatorId: "locator-root-admin-tenants",
        webAppPageId: PAGE_ROOT_ADMIN_TENANTS_ID,
        rootFamilyId: "root-admin",
        locatorType: "path",
        canonicalLocator: "/root-admin/tenants",
        routePath: "/root-admin/tenants",
        routeHash: null,
        normalizedLocatorKey: "/root-admin/tenants",
        isActive: true,
        createdByRootAdminUserId: "root_user_001",
        createdAt: "2026-04-20T11:00:00.000Z",
        updatedAt: "2026-04-20T11:30:00.000Z",
      },
      children: [],
    },
    {
      webAppPageId: PAGE_ROOT_ADMIN_USERS_ID,
      rootFamilyId: "root-admin",
      webAppModuleId: MODULE_ROOT_ADMIN_DISCOVERED_ID,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "users",
      displayLabel: "Users",
      routeSegment: "users",
      resolvedFullRoutePath: "/root-admin/users",
      status: "review",
      sortOrder: 5,
      createdByRootAdminUserId: "root_user_001",
      bootstrapSource: "structure-aware-discovery-sync",
      topologyState: "applied",
      templateKey: null,
      materializedAt: null,
      createdAt: "2026-04-20T11:00:00.000Z",
      updatedAt: "2026-04-20T11:30:00.000Z",
      activeLocator: {
        webAppPageLocatorId: "locator-root-admin-users",
        webAppPageId: PAGE_ROOT_ADMIN_USERS_ID,
        rootFamilyId: "root-admin",
        locatorType: "path",
        canonicalLocator: "/root-admin/users",
        routePath: "/root-admin/users",
        routeHash: null,
        normalizedLocatorKey: "/root-admin/users",
        isActive: true,
        createdByRootAdminUserId: "root_user_001",
        createdAt: "2026-04-20T11:00:00.000Z",
        updatedAt: "2026-04-20T11:30:00.000Z",
      },
      children: [],
    },
    discoveredModule.pages[0],
  ];

  return tree;
}

function defaultPageSettings() {
  return {
    iconKey: "hierarchy",
    showInTopNav: false,
    topNavOrder: null,
    pageTemplateKey: "static-html-page",
    contextNavTargetPageIds: [],
    createdAt: "2026-04-20T10:00:00.000Z",
    updatedAt: "2026-04-20T10:00:00.000Z",
  };
}

function createNestedMockHierarchyTree() {
  const tree = createMockHierarchyTree();
  const module = tree.rootFamilies[0]?.modules?.[0];
  if (!module) {
    return tree;
  }

  module.pages = [
    {
      webAppPageId: PAGE_CHOICE_GROUP_ID,
      rootFamilyId: "design-system",
      webAppModuleId: module.webAppModuleId,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "choice-group",
      displayLabel: "Choice Group",
      routeSegment: "choice-group",
      resolvedFullRoutePath: "/design-system/patterns/choice-group",
      status: "draft",
      sortOrder: 1,
      createdByRootAdminUserId: "root_user_001",
      bootstrapSource: null,
      topologyState: "applied",
      templateKey: "static-html-page",
      materializedAt: "2026-04-16T18:00:00.000Z",
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-16T18:00:00.000Z",
      activeLocator: {
        webAppPageLocatorId: "locator-patterns-choice-group",
        webAppPageId: "page-patterns-choice-group",
        rootFamilyId: "design-system",
        locatorType: "path",
        canonicalLocator: "/design-system/patterns/choice-group",
        routePath: "/design-system/patterns/choice-group",
        routeHash: null,
        normalizedLocatorKey: "/design-system/patterns/choice-group",
        isActive: true,
        createdByRootAdminUserId: "root_user_001",
        createdAt: "2026-04-01T10:00:00.000Z",
        updatedAt: "2026-04-16T18:00:00.000Z",
      },
      children: [
        {
          webAppPageId: PAGE_CHOICE_GROUP_BUILDER_ID,
          rootFamilyId: "design-system",
          webAppModuleId: module.webAppModuleId,
          parentPageId: PAGE_CHOICE_GROUP_ID,
          placementType: "child-page",
          pageKey: "choice-group-builder",
          displayLabel: "Choice Group Builder",
          routeSegment: "builder",
          resolvedFullRoutePath: "/design-system/patterns/choice-group/builder",
          status: "draft",
          sortOrder: 1,
          createdByRootAdminUserId: "root_user_001",
          bootstrapSource: null,
          topologyState: "applied",
          templateKey: "static-html-page",
          materializedAt: "2026-04-16T18:00:00.000Z",
          createdAt: "2026-04-01T10:00:00.000Z",
          updatedAt: "2026-04-16T18:00:00.000Z",
          activeLocator: {
            webAppPageLocatorId: "locator-patterns-choice-group-builder",
            webAppPageId: PAGE_CHOICE_GROUP_BUILDER_ID,
            rootFamilyId: "design-system",
            locatorType: "path",
            canonicalLocator: "/design-system/patterns/choice-group/builder",
            routePath: "/design-system/patterns/choice-group/builder",
            routeHash: null,
            normalizedLocatorKey: "/design-system/patterns/choice-group/builder",
            isActive: true,
            createdByRootAdminUserId: "root_user_001",
            createdAt: "2026-04-01T10:00:00.000Z",
            updatedAt: "2026-04-16T18:00:00.000Z",
          },
          children: [],
        },
      ],
    },
    ...module.pages,
  ];

  return tree;
}

function findModule(tree, moduleId) {
  for (const rootFamily of tree.rootFamilies) {
    for (const module of rootFamily.modules ?? []) {
      if (module.webAppModuleId === moduleId) {
        return { rootFamily, module };
      }
    }
  }
  return null;
}

function findPageInNodes(nodes, pageId) {
  for (const page of nodes) {
    if (page.webAppPageId === pageId) {
      return page;
    }
    const nested = findPageInNodes(page.children ?? [], pageId);
    if (nested) {
      return nested;
    }
  }
  return null;
}

function findPage(tree, pageId) {
  for (const rootFamily of tree.rootFamilies) {
    for (const module of rootFamily.modules ?? []) {
      const page = findPageInNodes(module.pages ?? [], pageId);
      if (page) {
        return { rootFamily, module, page };
      }
    }
  }
  return null;
}

function listPages(tree) {
  const items = [];

  function walk(nodes) {
    for (const page of nodes ?? []) {
      items.push(page);
      walk(page.children);
    }
  }

  for (const rootFamily of tree.rootFamilies) {
    for (const module of rootFamily.modules ?? []) {
      walk(module.pages ?? []);
    }
  }

  return items;
}

function deriveShellPageKey(resolvedFullRoutePath: string | null) {
  if (!resolvedFullRoutePath) {
    return "overview";
  }

  const [pathname, hash = ""] = resolvedFullRoutePath.split("#", 2);
  if (hash.length > 0) {
    return hash;
  }

  const normalizedPath = pathname.replace(/\/+$/, "");
  if (normalizedPath === "/root-admin") {
    return "overview";
  }

  return normalizedPath.split("/").filter(Boolean).at(-1) ?? "overview";
}

function normalizeRootAdminShellPageKey(pageKey: string | null | undefined) {
  const allowedPageKeys = new Set([
    "overview",
    "users",
    "roles",
    "tenants",
    "tenant-admins",
    "web-app-hierarchy",
  ]);

  if (typeof pageKey !== "string" || pageKey.trim().length === 0) {
    return null;
  }

  const trimmed = pageKey.trim();
  if (allowedPageKeys.has(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("root-admin-")) {
    const stripped = trimmed.slice("root-admin-".length);
    if (allowedPageKeys.has(stripped)) {
      return stripped;
    }
  }

  return null;
}

function deriveShellPageKeyFromRecord(pageRecord: { pageKey: string; resolvedFullRoutePath: string | null }) {
  const normalizedPageKey = normalizeRootAdminShellPageKey(pageRecord.pageKey);
  if (!pageRecord.resolvedFullRoutePath) {
    return normalizedPageKey ?? "overview";
  }

  const [pathname, hash = ""] = pageRecord.resolvedFullRoutePath.split("#", 2);
  if (hash.length > 0) {
    return hash;
  }

  const normalizedPath = pathname.replace(/\/+$/, "");
  if (normalizedPath === "/root-admin") {
    return normalizedPageKey ?? "overview";
  }

  return normalizedPath.split("/").filter(Boolean).at(-1) ?? "overview";
}

async function bootstrapAuthenticatedHierarchy(page: Page, hash = "#web-app-hierarchy", search = "", options: {
  tree?: typeof baseHierarchyTree;
  reconciledTree?: typeof baseHierarchyTree;
  pageSettingsOverrides?: Record<string, Partial<ReturnType<typeof defaultPageSettings>>>;
} = {}) {
  let currentHierarchyTree = clone(options.tree ?? createMockHierarchyTree());
  let proposalCounter = 0;
  let latestPreviewHash = "";
  const pageSettingsStore = new Map(
    listPages(currentHierarchyTree).map((pageRecord) => [pageRecord.webAppPageId, defaultPageSettings()]),
  );
  const reconciledTree = clone(options.reconciledTree ?? currentHierarchyTree);
  for (const [pageId, override] of Object.entries(options.pageSettingsOverrides ?? {})) {
    pageSettingsStore.set(pageId, {
      ...defaultPageSettings(),
      ...override,
    });
  }

  function ensurePageSettingsRecords(tree) {
    for (const pageRecord of listPages(tree)) {
      if (!pageSettingsStore.has(pageRecord.webAppPageId)) {
        pageSettingsStore.set(pageRecord.webAppPageId, defaultPageSettings());
      }
    }
  }

  ensurePageSettingsRecords(reconciledTree);

  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSession),
    });
  });

  await page.route("**/v1/root-users**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [],
        page: 1,
        pageSize: 25,
        totalPages: 1,
        totalMatchingRecords: 0,
        totalSearchableRecords: 0,
      }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/tree", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(currentHierarchyTree),
    });
  });

  await page.route("**/v1/web-app-hierarchy/sync-discovery", async (route) => {
    currentHierarchyTree = clone(reconciledTree);
    ensurePageSettingsRecords(currentHierarchyTree);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        discoveryRun: {
          webAppDiscoveryRunId: "99999999-9999-4999-8999-999999999999",
          status: "succeeded",
          createdCount: 1,
          refreshedCount: 0,
          unchangedCount: 0,
          staleCount: 0,
          supportOnlyCount: 0,
          reviewRequiredCount: 0,
          startedAt: "2026-04-20T11:00:00.000Z",
          completedAt: "2026-04-20T11:00:01.000Z",
        },
        syncSummary: {
          currentDiscoveredSurfaceCount: 1,
          totalStaleDiscoveredSurfaceCount: 0,
          importCandidateCount: 1,
          createdModuleCount: 1,
          createdPageCount: 1,
          updatedPageCount: 0,
          unchangedMappedSurfaceCount: 0,
          blockedSurfaceCount: 0,
          supportOnlySkippedCount: 0,
          reviewRequiredSkippedCount: 0,
          nonPageSurfaceSkippedCount: 0,
        },
        blockedSurfaces: [],
        tree: currentHierarchyTree,
      }),
    });
  });

  await page.route(/.*\/v1\/web-app-hierarchy\/modules\/[^/]+\/landing-page$/, async (route) => {
    const moduleId = route.request().url().split("/").at(-2);
    const payload = JSON.parse(route.request().postData() ?? "{}");
    const record = findModule(currentHierarchyTree, moduleId ?? "");

    if (!record) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Module not found." }) });
      return;
    }

    record.module.landingPageWebAppPageId = payload.landingPageWebAppPageId ?? null;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ landingPageWebAppPageId: record.module.landingPageWebAppPageId }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/modules/*", async (route) => {
    const moduleId = route.request().url().split("/").at(-1);
    const payload = JSON.parse(route.request().postData() ?? "{}");
    const record = findModule(currentHierarchyTree, moduleId ?? "");

    if (!record) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Module not found." }) });
      return;
    }

    if (payload.displayLabel) {
      record.module.displayLabel = payload.displayLabel;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(record.module),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/pages\/[^/]+$/, async (route) => {
    const pageId = route.request().url().split("/").at(-1) ?? "";
    const record = findPage(currentHierarchyTree, pageId);
    const stored = pageSettingsStore.get(pageId);

    if (!record || !stored) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Page not found." }) });
      return;
    }

    if (route.request().method() === "PUT") {
      const payload = JSON.parse(route.request().postData() ?? "{}");
      stored.iconKey = payload.iconKey ?? stored.iconKey;
      stored.showInTopNav = payload.showInTopNav ?? stored.showInTopNav;
      stored.pageTemplateKey = payload.pageTemplateKey ?? stored.pageTemplateKey;
      stored.contextNavTargetPageIds = Array.isArray(payload.contextNavTargetPageIds)
        ? payload.contextNavTargetPageIds
        : stored.contextNavTargetPageIds;
      stored.updatedAt = "2026-04-20T10:30:00.000Z";
    }

    const contextNavItems = (stored.contextNavTargetPageIds.length > 0
      ? stored.contextNavTargetPageIds
      : [pageId]
    ).map((targetId, index) => {
      const targetRecord = findPage(currentHierarchyTree, targetId);
      return {
        targetWebAppPageId: targetId,
        displayLabel: targetRecord?.page.displayLabel ?? record.page.displayLabel,
        resolvedFullRoutePath: targetRecord?.page.resolvedFullRoutePath ?? record.page.resolvedFullRoutePath,
        sortOrder: index,
        source: stored.contextNavTargetPageIds.length > 0 ? "explicit" : "fallback-self",
      };
    });

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        webAppPageId: record.page.webAppPageId,
        rootFamilyId: record.page.rootFamilyId,
        displayLabel: record.page.displayLabel,
        hasStoredSettings: true,
        iconKey: stored.iconKey,
        effectiveIconKey: stored.iconKey ?? "grid",
        showInTopNav: stored.showInTopNav,
        topNavOrder: stored.topNavOrder,
        pageTemplateKey: stored.pageTemplateKey,
        effectivePageTemplateKey: stored.pageTemplateKey ?? record.page.templateKey,
        contextNavItems,
        createdAt: stored.createdAt,
        updatedAt: stored.updatedAt,
      }),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/root-families\/[^/]+\/pages\/[^/]+\/context-nav$/, async (route) => {
    const requestUrl = new URL(route.request().url());
    const shellPageKey = requestUrl.pathname.split("/").at(-2) ?? "";
    const ownerPage = listPages(currentHierarchyTree).find((pageRecord) =>
      deriveShellPageKeyFromRecord(pageRecord) === shellPageKey,
    );

    if (!ownerPage) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          rootFamilyId: "root-admin",
          shellPageKey,
          items: [],
        }),
      });
      return;
    }

    const ownerSettings = pageSettingsStore.get(ownerPage.webAppPageId) ?? defaultPageSettings();
    const items = ownerSettings.contextNavTargetPageIds.map((targetPageId, index) => {
      const targetPage = findPage(currentHierarchyTree, targetPageId)?.page;
      const targetSettings = pageSettingsStore.get(targetPageId) ?? defaultPageSettings();
      return {
        webAppPageId: targetPageId,
        shellPageKey: targetPage ? deriveShellPageKeyFromRecord(targetPage) : "overview",
        displayLabel: targetPage?.displayLabel ?? targetPageId,
        resolvedFullRoutePath: targetPage?.resolvedFullRoutePath ?? null,
        iconKey: targetSettings.iconKey,
        effectiveIconKey: targetSettings.iconKey ?? "page-default",
        sortOrder: index,
      };
    });

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        rootFamilyId: "root-admin",
        shellPageKey,
        items,
      }),
    });
  });

  await page.route("**/v1/web-app-page-settings/options?*", async (route) => {
    const requestUrl = new URL(route.request().url());
    const pageId = requestUrl.searchParams.get("webAppPageId") ?? "";
    const record = findPage(currentHierarchyTree, pageId);

    if (!record) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Page not found." }) });
      return;
    }

    const eligibleContextNavTargets = listPages(currentHierarchyTree).map((pageRecord) => ({
      webAppPageId: pageRecord.webAppPageId,
      displayLabel: pageRecord.displayLabel,
      resolvedFullRoutePath: pageRecord.resolvedFullRoutePath,
      pageKey: pageRecord.pageKey,
    }));

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        webAppPageId: pageId,
        defaultIconKey: "grid",
        currentTopologyTemplateKey: record.page.templateKey,
        icons: [
          { iconKey: "grid", label: "Grid", status: "approved" },
          { iconKey: "hierarchy", label: "Hierarchy", status: "approved" },
          { iconKey: "workspace", label: "Workspace", status: "approved" },
        ],
        pageTemplates: [
          { pageTemplateKey: "static-html-page", label: "Static HTML Page", status: "approved" },
        ],
        eligibleContextNavTargets,
      }),
    });
  });

  await page.route(/.*\/v1\/web-app-hierarchy\/pages\/[^/]+$/, async (route) => {
    const pageId = route.request().url().split("/").at(-1);
    const payload = JSON.parse(route.request().postData() ?? "{}");
    const record = findPage(currentHierarchyTree, pageId ?? "");

    if (!record) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Page not found." }) });
      return;
    }

    if (payload.displayLabel) {
      record.page.displayLabel = payload.displayLabel;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(record.page),
    });
  });

  await page.route(/.*\/v1\/web-app-hierarchy\/pages\/[^/]+\/move$/, async (route) => {
    const payload = JSON.parse(route.request().postData() ?? "{}");
    const pageId = route.request().url().split("/").at(-2);
    const record = findPage(currentHierarchyTree, pageId ?? "");

    if (!record) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Page not found." }) });
      return;
    }

    record.page.parentPageId = payload.targetParentPageId ?? null;
    record.page.placementType = payload.placementType;
    record.page.webAppModuleId = payload.webAppModuleId ?? record.page.webAppModuleId;
    if (typeof payload.sortOrder === "number") {
      record.page.sortOrder = payload.sortOrder;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(record.page),
    });
  });

  await page.route("**/v1/web-app-hierarchy/design-system/pages", async (route) => {
    const payload = JSON.parse(route.request().postData() ?? "{}");
    proposalCounter += 1;
    const moduleRecord = findModule(currentHierarchyTree, payload.webAppModuleId);

    if (!moduleRecord) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Module not found." }) });
      return;
    }

    const proposalPage = {
      webAppPageId: PROPOSAL_PAGE_ID,
      rootFamilyId: "design-system",
      webAppModuleId: payload.webAppModuleId,
      parentPageId: null,
      placementType: "module-root",
      pageKey: `design-system-${moduleRecord.module.moduleKey}-${payload.routeSegment}`,
      displayLabel: payload.displayLabel,
      routeSegment: payload.routeSegment,
      resolvedFullRoutePath: `${moduleRecord.rootFamily.routePrefix}/${moduleRecord.module.moduleKey}/${payload.routeSegment}`,
      status: "draft",
      sortOrder: payload.sortOrder ?? 0,
      createdByRootAdminUserId: "root_user_001",
      bootstrapSource: null,
      topologyState: "proposed",
      templateKey: payload.templateKey,
      materializedAt: null,
      createdAt: "2026-04-20T10:00:00.000Z",
      updatedAt: "2026-04-20T10:00:00.000Z",
      activeLocator: null,
      children: [],
    };

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        proposalPage,
        proposalStatus: "proposed",
      }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/design-system/subpages", async (route) => {
    const payload = JSON.parse(route.request().postData() ?? "{}");
    proposalCounter += 1;
    const parentRecord = findPage(currentHierarchyTree, payload.parentPageId);

    if (!parentRecord) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Page not found." }) });
      return;
    }

    const proposalPage = {
      webAppPageId: `${PROPOSAL_PAGE_ID}-${proposalCounter}`,
      rootFamilyId: "design-system",
      webAppModuleId: parentRecord.page.webAppModuleId,
      parentPageId: payload.parentPageId,
      placementType: "child-page",
      pageKey: `${parentRecord.page.pageKey}-${payload.routeSegment}`,
      displayLabel: payload.displayLabel,
      routeSegment: payload.routeSegment,
      resolvedFullRoutePath: `${parentRecord.page.resolvedFullRoutePath}/${payload.routeSegment}`,
      status: "draft",
      sortOrder: payload.sortOrder ?? 0,
      createdByRootAdminUserId: "root_user_001",
      bootstrapSource: null,
      topologyState: "proposed",
      templateKey: payload.templateKey,
      materializedAt: null,
      createdAt: "2026-04-20T10:00:00.000Z",
      updatedAt: "2026-04-20T10:00:00.000Z",
      activeLocator: null,
      children: [],
    };

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        proposalPage,
        proposalStatus: "proposed",
      }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/design-system/materialization/preview", async (route) => {
    const payload = JSON.parse(route.request().postData() ?? "{}");
    const proposalId = payload.proposalPageIds?.[0] ?? PROPOSAL_PAGE_ID;
    latestPreviewHash = `preview-hash-${proposalId}`;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        classification: "additive",
        previewHash: latestPreviewHash,
        proposalCount: payload.proposalPageIds?.length ?? 0,
        items: [
          {
            webAppPageId: proposalId,
            pageKey: "design-system-patterns-new-pattern",
            displayLabel: "New Pattern",
            routePath: "/design-system/patterns/new-pattern",
            templateKey: "static-html-page",
            plannedOutputs: {
              folderPath: "src/frontend/designSystem/patterns/new-pattern",
              indexHtmlPath: "src/frontend/designSystem/patterns/new-pattern/index.html",
              governanceStubPath: "docs/workspace/design-system/generated-pages/new-pattern.md",
            },
          },
        ],
      }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/design-system/materialization/apply", async (route) => {
    const payload = JSON.parse(route.request().postData() ?? "{}");

    if (payload.previewHash !== latestPreviewHash) {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ message: "Preview mismatch." }),
      });
      return;
    }

    const targetModule = currentHierarchyTree.rootFamilies[0]?.modules?.[0];
    if (targetModule) {
      targetModule.pages.push({
        webAppPageId: PAGE_NEW_PATTERN_ID,
        rootFamilyId: "design-system",
        webAppModuleId: targetModule.webAppModuleId,
        parentPageId: null,
        placementType: "module-root",
        pageKey: "design-system-patterns-new-pattern",
        displayLabel: "New Pattern",
        routeSegment: "new-pattern",
        resolvedFullRoutePath: "/design-system/patterns/new-pattern",
        status: "draft",
        sortOrder: 2,
        createdByRootAdminUserId: "root_user_001",
        bootstrapSource: null,
        topologyState: "applied",
        templateKey: "static-html-page",
        materializedAt: "2026-04-20T10:05:00.000Z",
        createdAt: "2026-04-20T10:00:00.000Z",
        updatedAt: "2026-04-20T10:05:00.000Z",
        activeLocator: {
          webAppPageLocatorId: "locator-patterns-new-pattern",
          webAppPageId: PAGE_NEW_PATTERN_ID,
          rootFamilyId: "design-system",
          locatorType: "path",
          canonicalLocator: "/design-system/patterns/new-pattern",
          routePath: "/design-system/patterns/new-pattern",
          routeHash: null,
          normalizedLocatorKey: "/design-system/patterns/new-pattern",
          isActive: true,
          createdByRootAdminUserId: "root_user_001",
          createdAt: "2026-04-20T10:05:00.000Z",
          updatedAt: "2026-04-20T10:05:00.000Z",
        },
        children: [],
      });
      pageSettingsStore.set(PAGE_NEW_PATTERN_ID, {
        iconKey: "workspace",
        showInTopNav: false,
        topNavOrder: null,
        pageTemplateKey: "static-html-page",
        contextNavTargetPageIds: [],
        createdAt: "2026-04-20T10:05:00.000Z",
        updatedAt: "2026-04-20T10:05:00.000Z",
      });
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        classification: "additive",
        previewHash: latestPreviewHash,
        appliedPageCount: payload.proposalPageIds?.length ?? 0,
        items: [
          {
            webAppPageId: PAGE_NEW_PATTERN_ID,
            pageKey: "design-system-patterns-new-pattern",
            displayLabel: "New Pattern",
            routePath: "/design-system/patterns/new-pattern",
            templateKey: "static-html-page",
            plannedOutputs: {
              folderPath: "src/frontend/designSystem/patterns/new-pattern",
              indexHtmlPath: "src/frontend/designSystem/patterns/new-pattern/index.html",
              governanceStubPath: "docs/workspace/design-system/generated-pages/new-pattern.md",
            },
          },
        ],
        tree: currentHierarchyTree,
      }),
    });
  });

  await page.goto(`/root-admin${search}${hash}`);
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator("#page-web-app-hierarchy").waitFor({ state: "visible" });
}

test("root-admin hierarchy page renders the applied design-system hierarchy inside the signed-off hierarchy-tree posture", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  await expect(page.locator("#breadcrumb-current-label")).toHaveText("Web App Hierarchy");
  await expect(page.locator(".context-nav .context-nav-main .context-nav-item")).toHaveCount(0);
  await expect(page.locator("#web-app-hierarchy-page-title")).toBeVisible();
  await expect(page.locator("#web-app-hierarchy-page-status")).toContainText("Curated hierarchy truth is loaded");
  await expect(page.locator("#web-app-hierarchy-refresh-button.accessibility-chip")).toBeVisible();
  await expect(page.locator("#web-app-hierarchy-apply-button.accessibility-chip.active")).toBeVisible();
  await expect(page.locator("#root-admin-web-app-hierarchy-detail-title")).toHaveText("Hierarchy Tree");
  await expect(page.locator("#hierarchy-tree-drawer")).toBeHidden();
  await page.locator("#hierarchy-tree-nav-button").click();
  await expect(page.locator("#hierarchy-tree-drawer")).toBeVisible();
  await expect(page.locator(".hierarchy-tree-row")).toHaveCount(3);
  await expect(page.locator(".hierarchy-tree-row").first()).toContainText("Design System");
  await expect(page.locator("#root-admin-web-app-hierarchy-summary")).toContainText("Root-admin consumer using the signed-off hierarchy-tree family");
  await expect(page.locator("#shell-message")).toBeHidden();
  await expect(page.locator(".hierarchy-tree-preview-shell")).toHaveCount(0);
  await expect(page.locator("#page-web-app-hierarchy.page-panel")).toHaveCount(0);
  await expect(page.locator("#page-web-app-hierarchy .hierarchy-tree-page")).toHaveCount(0);
  await expect(page.locator(".context-nav-bottom-group #hierarchy-tree-nav-button")).toHaveCount(1);
  await expect(page.locator("#web-app-page-settings-form.form-page-card")).toBeVisible();
  await expect(page.locator("#page-web-app-hierarchy .form-page-shell:visible")).toHaveCount(1);
  await expect(page.locator("#page-web-app-hierarchy .form-page-card:visible")).toHaveCount(1);
  await expect(page.locator("#web-app-page-settings-form .form-page-shell:visible")).toHaveCount(0);
  await expect(page.locator("#web-app-hierarchy-structure-state.form-page-section")).toBeVisible();
  await expect(page.locator("#web-app-hierarchy-structure-state .form-page-intro")).toBeVisible();
  await expect(page.locator("#web-app-hierarchy-structure-shell-title")).toHaveText("Edit selected app surface");
  await expect(page.locator("#web-app-page-settings-shell.form-page-section")).toBeVisible();
  await expect(page.locator("#web-app-page-settings-actions.form-page-footer")).toBeVisible();
  await expect(page.locator("#web-app-page-settings-save.accessibility-chip.active")).toBeVisible();
  await expect(page.locator("#page-web-app-hierarchy .form-page-shell")).toHaveAttribute("data-form-mobile-view", "false");
  await expect(page.locator("#web-app-page-settings-form.form-page-card")).toBeVisible();
  await expect(page.locator("#web-app-hierarchy-structure-state .form-page-section-header").nth(1).locator(".top-nav-preview-eyebrow")).toHaveText("Section 01");
  await expect(page.locator("#web-app-page-settings-shell .top-nav-preview-eyebrow")).toHaveText("Section 02");
  await expect(page.locator("#web-app-page-settings-display-label")).toHaveValue("Hierarchy Tree");
});

test("root-admin hierarchy refresh reconciles discovery before redrawing the curated tree", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createMockHierarchyTree(),
    reconciledTree: createRefreshReconciledHierarchyTree(),
  });

  await expect(page.locator(".hierarchy-tree-row").filter({ hasText: "Root Admin" })).toHaveCount(0);

  await page.getByRole("button", { name: "Refresh hierarchy" }).click();
  await page.locator("#hierarchy-tree-nav-button").click();

  const rootAdminRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Root Admin" }).first();
  await expect(rootAdminRow).toBeVisible();
  await rootAdminRow.getByRole("button", { name: "Expand Root Admin" }).click();

  const discoveredModuleRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Root Admin Discovered Pages" }).first();
  await expect(discoveredModuleRow).toBeVisible();
  await discoveredModuleRow.getByRole("button", { name: "Expand Root Admin Discovered Pages" }).click();

  await expect(page.locator(".hierarchy-tree-row").filter({ hasText: "Web App Hierarchy" })).toHaveCount(1);
  await expect(page.locator("#shell-message")).toContainText("Reconciled discovery and refreshed curated hierarchy.");
});

test("root-admin hierarchy page selects the current hash-backed page instead of the first page in the tree on initial load", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createRootAdminCurrentPageSelectionTree(),
  });

  await expect(page.locator("#web-app-page-settings-display-label")).toHaveValue("Web App Hierarchy");
  await expect(page.locator("#shell-message")).toBeHidden();
});

test("root-admin hierarchy page resolves legacy default icon keys to the matching nav icon without changing the stored backend value", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createRefreshReconciledHierarchyTree(),
    pageSettingsOverrides: {
      [PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID]: {
        iconKey: "page-default",
        contextNavTargetPageIds: [PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID],
      },
    },
  });

  const navIconPath = page.locator('.context-nav-item[data-page-link="web-app-hierarchy"] .context-nav-icon path');
  const formIconPath = page.locator("#web-app-page-settings-icon-trigger .form-icon-grid-trigger-glyph path");

  await expect(navIconPath).toHaveAttribute("d", "M4 6h8v4H4zm0 8h8v4H4zm10-4h6v4h-6zm-2-2h2v8h-2z");
  await expect(formIconPath).toHaveAttribute("d", "M4 6h8v4H4zm0 8h8v4H4zm10-4h6v4h-6zm-2-2h2v8h-2z");

  const saveRequest = page.waitForRequest((request) =>
    request.method() === "PUT" && request.url().includes(`/v1/web-app-page-settings/pages/${PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID}`),
  );
  await page.locator('label.form-toggle-row:has(#web-app-page-settings-show-in-top-nav)').click();
  await page.locator("#web-app-page-settings-save").click();

  expect(JSON.parse((await saveRequest).postData() ?? "{}")).toMatchObject({
    iconKey: "page-default",
  });
});

test("root-admin hierarchy page save refreshes the current context nav so explicit targets appear immediately", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createRefreshReconciledHierarchyTree(),
    pageSettingsOverrides: {
      [PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID]: {
        contextNavTargetPageIds: [],
      },
    },
  });

  await expect(page.locator(".context-nav .context-nav-main .context-nav-item")).toHaveCount(0);

  await page.locator("#web-app-page-settings-context-nav-trigger").click();
  await page.locator(`[data-form-drawer-select-option][data-value="${PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID}"]`).click();
  await page.getByRole("button", { name: "Close context-nav selector" }).click();
  await page.locator("#web-app-page-settings-save").click();

  await expect(page.locator('.context-nav .context-nav-item[data-page-link="web-app-hierarchy"]')).toBeVisible();
  await expect(page.locator('.context-nav .context-nav-item[data-page-link="web-app-hierarchy"] .context-nav-label')).toHaveText("Web App Hierarchy");
  await expect(page.locator("#hierarchy-tree-drawer")).toBeHidden();
});

test("root-admin hierarchy page keeps save blocked behind the shared context-nav selector until the selector closes", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createRefreshReconciledHierarchyTree(),
    pageSettingsOverrides: {
      [PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID]: {
        iconKey: "grid",
        contextNavTargetPageIds: [PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID],
      },
    },
  });

  await page.locator("#web-app-page-settings-context-nav-trigger").click();
  await page.locator(`[data-form-drawer-select-option][data-value="${PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID}"]`).click();
  await expect(page.locator("#web-app-page-settings-context-nav [data-form-drawer-select-panel]")).toBeVisible();
  await expect(page.locator("#web-app-page-settings-save")).toBeVisible();
  await expect(page.locator("#shell-message")).not.toContainText("Saved page settings for Web App Hierarchy.");

  const saveRequest = page.waitForRequest((request) =>
    request.method() === "PUT" && request.url().includes(`/v1/web-app-page-settings/pages/${PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID}`),
  );
  await page.getByRole("button", { name: "Close context-nav selector" }).click();
  await page.locator("#web-app-page-settings-save").click();

  expect(JSON.parse((await saveRequest).postData() ?? "{}")).toMatchObject({
    iconKey: "grid",
    contextNavTargetPageIds: [],
  });
  await expect(page.locator("#shell-message")).toContainText("Saved page settings for Web App Hierarchy.");
});

test("root-admin hierarchy page uses the eye action for open selected and external link for new-tab route launch", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);
  await page.locator("#hierarchy-tree-nav-button").click();

  const hierarchyRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Hierarchy Tree" }).first();

  await hierarchyRow.hover();

  const openButton = hierarchyRow.getByRole("button", {
    name: "Open Hierarchy Tree",
  });
  const newTabLink = hierarchyRow.getByRole("link", {
    name: "Open Hierarchy Tree in a new tab",
  });

  await expect(openButton).toBeVisible();
  await expect(newTabLink).toHaveAttribute("href", "/design-system/patterns/hierarchy-tree");
  await expect(newTabLink).toHaveAttribute("target", "_blank");
  await expect(newTabLink).toHaveAttribute("rel", "noopener noreferrer");

  await openButton.click();
  await expect(page.locator("#root-admin-web-app-hierarchy-detail-title")).toHaveText("Hierarchy Tree");
  await expect(page.locator("#shell-message")).toBeHidden();
});

test("root-admin hierarchy page keeps one governed form host while the hierarchy launcher stays in the context-nav bottom stack", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  await expect(page.locator(".context-nav-bottom-group")).toContainText("Hierarchy");
  await expect(page.locator(".context-nav-bottom-group #hierarchy-tree-nav-button")).toBeVisible();
  await expect(page.locator("#page-web-app-hierarchy .form-page-shell:visible")).toHaveCount(1);
  await expect(page.locator("#page-web-app-hierarchy .form-page-card:visible")).toHaveCount(1);
  await expect(page.locator("#web-app-page-settings-form .form-page-shell:visible")).toHaveCount(0);
  await expect(page.locator("#hierarchy-tree-drawer")).toBeHidden();
  await expect(page.locator("#hierarchy-tree-nav-button")).toHaveAttribute("aria-expanded", "false");
});

test("root-admin hierarchy drawer closes on outside click and Escape like a governed shell drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  const launcher = page.locator("#hierarchy-tree-nav-button");
  const drawer = page.locator("#hierarchy-tree-drawer");

  await launcher.click();
  await expect(drawer).toBeVisible();
  await page.locator(".design-system-page-main").click();
  await expect(drawer).toHaveAttribute("aria-hidden", "true");
  await expect(launcher).toHaveAttribute("aria-expanded", "false");

  await launcher.click();
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveAttribute("aria-hidden", "true");
  await expect(launcher).toHaveAttribute("aria-expanded", "false");
  await expect(launcher).toBeFocused();
});

test("root-admin hierarchy drawer can stay open beside display settings like the signed-off hierarchy pattern", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  const hierarchyDrawer = page.locator("#hierarchy-tree-drawer");
  const displayDrawer = page.locator("#display-settings-drawer");

  await page.locator("#hierarchy-tree-nav-button").click();
  await expect(hierarchyDrawer).toBeVisible();

  await page.locator("#display-settings-button").click();
  await expect(displayDrawer).toBeVisible();
  await expect(hierarchyDrawer).toBeVisible();

  const geometry = await page.evaluate(() => {
    const hierarchy = document.getElementById("hierarchy-tree-drawer");
    const display = document.getElementById("display-settings-drawer");
    if (!(hierarchy instanceof HTMLElement) || !(display instanceof HTMLElement)) {
      return null;
    }

    const hierarchyRect = hierarchy.getBoundingClientRect();
    const displayRect = display.getBoundingClientRect();

    return {
      hierarchyRight: hierarchyRect.right,
      displayLeft: displayRect.left,
      hierarchyVisible: !hierarchy.classList.contains("hidden"),
      displayVisible: !display.classList.contains("hidden"),
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry?.hierarchyVisible).toBe(true);
  expect(geometry?.displayVisible).toBe(true);
  expect((geometry?.displayLeft ?? 0)).toBeGreaterThanOrEqual((geometry?.hierarchyRight ?? 0) - 1);
});

test("root-admin hierarchy page shows saved explicit context-nav targets on reload without requiring the hierarchy drawer to be closed", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createRootAdminVisibleContextNavTree(),
    pageSettingsOverrides: {
      [PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID]: {
        contextNavTargetPageIds: [
          PAGE_ROOT_ADMIN_OVERVIEW_ID,
          PAGE_ROOT_ADMIN_ROLES_ID,
          PAGE_ROOT_ADMIN_TENANTS_ID,
          PAGE_ROOT_ADMIN_TENANT_ADMINS_ID,
          PAGE_ROOT_ADMIN_USERS_ID,
        ],
      },
    },
  });

  await expect(page.locator("#hierarchy-tree-drawer")).toBeHidden();
  await expect(page.locator(".context-nav .context-nav-main .context-nav-item[data-page-link]")).toHaveCount(5);
  await expect(page.locator('.context-nav .context-nav-item[data-page-link="overview"]')).toBeVisible();
  await expect(page.locator('.context-nav .context-nav-item[data-page-link="roles"]')).toBeVisible();
  await expect(page.locator('.context-nav .context-nav-item[data-page-link="tenants"]')).toBeVisible();
  await expect(page.locator('.context-nav .context-nav-item[data-page-link="tenant-admins"]')).toBeVisible();
  await expect(page.locator('.context-nav .context-nav-item[data-page-link="users"]')).toBeVisible();
});

test("root-admin overview context nav keeps the web-app-hierarchy icon and click target when the stored route falls back to /root-admin", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  const tree = createRootAdminVisibleContextNavTree();
  const hierarchyPage = tree.rootFamilies[0]?.modules?.[1]?.pages?.find(
    (entry) => entry.webAppPageId === PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID,
  );
  if (!hierarchyPage) {
    throw new Error("Expected web-app-hierarchy page fixture.");
  }

  hierarchyPage.resolvedFullRoutePath = "/root-admin";

  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree,
    pageSettingsOverrides: {
      [PAGE_ROOT_ADMIN_OVERVIEW_ID]: {
        contextNavTargetPageIds: [PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID],
      },
      [PAGE_ROOT_ADMIN_WEB_APP_HIERARCHY_ID]: {
        iconKey: "page-default",
      },
    },
  });

  await page.locator('.primary-nav .nav-link[data-page-link="overview"]').click();
  await expect(page.locator("#breadcrumb-home-link")).toHaveText("Root Admin");
  await expect(page.locator("#breadcrumb-current-item")).toBeHidden();

  const hierarchyLink = page.locator('.context-nav .context-nav-item[data-page-link="web-app-hierarchy"]');
  await expect(hierarchyLink).toBeVisible();
  await expect(hierarchyLink.locator(".context-nav-label")).toHaveText("Web App Hierarchy");
  await expect(hierarchyLink.locator(".context-nav-icon path")).toHaveAttribute(
    "d",
    "M4 6h8v4H4zm0 8h8v4H4zm10-4h6v4h-6zm-2-2h2v8h-2z",
  );

  await hierarchyLink.click();

  await expect(page.locator("#breadcrumb-current-label")).toHaveText("Web App Hierarchy");
  await expect(page.locator("#page-web-app-hierarchy")).toBeVisible();
});

test("root-admin hierarchy page shows the eye action across design-system family, module, and page rows", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);
  await page.locator("#hierarchy-tree-nav-button").click();

  const familyRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Design System" }).first();
  await familyRow.hover();
  await expect(familyRow.getByRole("button", { name: "Open Design System" })).toBeVisible();
  await expect(familyRow.getByRole("link", { name: "Open Design System in a new tab" })).toHaveAttribute("href", "/design-system");

  const moduleRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Patterns" }).first();
  await moduleRow.hover();
  await expect(moduleRow.getByRole("button", { name: "Open Patterns" })).toBeVisible();
  await expect(moduleRow.locator(".hierarchy-tree-inline-action")).toHaveCount(1);

  const pageRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Hierarchy Tree" }).first();
  await pageRow.hover();
  await expect(pageRow.getByRole("button", { name: "Open Hierarchy Tree" })).toBeVisible();
  await expect(pageRow.getByRole("link", { name: "Open Hierarchy Tree in a new tab" })).toHaveAttribute("href", "/design-system/patterns/hierarchy-tree");
});

test("root-admin hierarchy page adopts full-screen drawer posture on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 560, height: 960 });
  await bootstrapAuthenticatedHierarchy(page);

  const drawer = page.locator("#hierarchy-tree-drawer");
  await page.locator("#hierarchy-tree-nav-button").click();
  await expect(drawer).toBeVisible();

  const drawerBox = await drawer.boundingBox();
  expect(drawerBox).not.toBeNull();
  expect(drawerBox?.x ?? 0).toBeLessThanOrEqual(1);
  expect(drawerBox?.width ?? 0).toBeGreaterThanOrEqual(558);
});

test("root-admin hierarchy page supports desktop drawer width resizing", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  const drawer = page.locator("#hierarchy-tree-drawer");
  await page.locator("#hierarchy-tree-nav-button").click();

  const before = await drawer.boundingBox();
  expect(before).not.toBeNull();

  await page.evaluate(() => {
    const handle = document.getElementById("hierarchy-tree-drawer-resize");
    if (!(handle instanceof HTMLElement)) {
      return;
    }

    handle.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true,
      pointerId: 1,
      clientX: 448,
    }));

    window.dispatchEvent(new PointerEvent("pointermove", {
      bubbles: true,
      pointerId: 1,
      clientX: 588,
    }));

    window.dispatchEvent(new PointerEvent("pointerup", {
      bubbles: true,
      pointerId: 1,
      clientX: 588,
    }));
  });

  const after = await drawer.boundingBox();
  expect(after).not.toBeNull();
  expect((after?.width ?? 0) - (before?.width ?? 0)).toBeGreaterThan(100);
});

test("root-admin hierarchy page mirrors the hierarchy drawer correctly in rtl", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "?lang=ar");

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("#breadcrumb-current-label")).toHaveText("Web App Hierarchy");
  await page.locator("#hierarchy-tree-nav-button").click();

  const firstExpandableRow = page
    .locator(".hierarchy-tree-row")
    .filter({ has: page.locator(".hierarchy-tree-expander") })
    .first();
  const geometry = await firstExpandableRow.evaluate((row) => {
    const expander = row.querySelector(".hierarchy-tree-expander");
    const actions = row.querySelector(".hierarchy-tree-row-actions");
    const content = row.querySelector(".hierarchy-tree-content");

    if (!(expander instanceof HTMLElement) || !(actions instanceof HTMLElement) || !(content instanceof HTMLElement)) {
      return null;
    }

    const expanderRect = expander.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    return {
      expanderCenter: expanderRect.left + (expanderRect.width / 2),
      actionsCenter: actionsRect.left + (actionsRect.width / 2),
      contentCenter: contentRect.left + (contentRect.width / 2),
    };
  });

  expect(geometry).not.toBeNull();
  expect((geometry?.expanderCenter ?? 0)).toBeGreaterThan(geometry?.contentCenter ?? 0);
  expect((geometry?.contentCenter ?? 0)).toBeGreaterThan(geometry?.actionsCenter ?? 0);
});

test("root-admin hierarchy page records pending design-system proposals from the root menu without route-level preview controls", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);
  await page.locator("#hierarchy-tree-nav-button").click();

  const dialogResponses = [
    { expected: "Name the top-level page in Patterns", value: "New Pattern" },
    { expected: "Route segment", value: "new-pattern" },
  ];

  page.on("dialog", async (dialog) => {
    const response = dialogResponses.shift();
    expect(response).toBeTruthy();
    expect(dialog.message()).toContain(response?.expected ?? "");
    await dialog.accept(response?.value ?? "");
  });

  await page.locator("#hierarchy-tree-root-menu-button").click();
  await page.getByRole("menuitem", { name: "Add top-level page" }).click();

  await expect(page.locator("#root-admin-web-app-hierarchy-summary")).toContainText("1 pending design-system proposal");
  await expect(page.locator("#shell-message")).toContainText("Created proposed top-level page in Patterns New Pattern");
  await expect(page.locator("#root-admin-web-app-hierarchy-detail-title")).toHaveText("Hierarchy Tree");
});

test("root-admin hierarchy page exposes add-child-page on module rows", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);
  await page.locator("#hierarchy-tree-nav-button").click();

  const moduleRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Patterns" }).first();
  await moduleRow.getByRole("button", { name: "Open actions for Patterns" }).click();
  await expect(page.getByRole("menuitem", { name: "Add child page" })).toBeVisible();
});

test("root-admin hierarchy page exposes child, sibling, orphan, and outdent actions consistently on nested page rows", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createNestedMockHierarchyTree(),
  });
  await page.locator("#hierarchy-tree-nav-button").click();

  const parentRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Choice Group" }).first();
  await parentRow.getByRole("button", { name: "Expand Choice Group" }).click();

  await parentRow.getByRole("button", { name: "Open actions for Choice Group" }).click();
  const parentMenu = parentRow.locator(".hierarchy-tree-row-menu");
  await expect(parentMenu.getByRole("menuitem", { name: "Add child page" })).toBeVisible();
  await expect(parentMenu.getByRole("menuitem", { name: "Add sibling page" })).toBeVisible();
  await expect(parentMenu.getByRole("menuitem", { name: "Send to orphan pool" })).toBeVisible();
  await expect(parentMenu.getByRole("menuitem", { name: "Move to parent level" })).toHaveCount(0);
  await parentRow.getByRole("button", { name: "Open actions for Choice Group" }).click();

  const childRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Choice Group Builder" }).first();
  await childRow.getByRole("button", { name: "Open actions for Choice Group Builder" }).click();
  const childMenu = childRow.locator(".hierarchy-tree-row-menu");
  await expect(childMenu.getByRole("menuitem", { name: "Add child page" })).toBeVisible();
  await expect(childMenu.getByRole("menuitem", { name: "Add sibling page" })).toBeVisible();
  await expect(childMenu.getByRole("menuitem", { name: "Move to parent level" })).toBeVisible();
  await expect(childMenu.getByRole("menuitem", { name: "Send to orphan pool" })).toBeVisible();
});

test("root-admin hierarchy page sends a move request during desktop drag and drop", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createNestedMockHierarchyTree(),
  });
  await page.locator("#hierarchy-tree-nav-button").click();

  const parentRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Choice Group" }).first();
  await parentRow.getByRole("button", { name: "Expand Choice Group" }).click();

  const childRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Choice Group Builder" }).first();
  const moduleRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Patterns" }).first();

  const moveRequest = page.waitForRequest((request) =>
    request.method() === "POST" && /\/v1\/web-app-hierarchy\/pages\/[^/]+\/move$/.test(request.url()),
  );

  await childRow.dragTo(moduleRow);

  const request = await moveRequest;
  expect(JSON.parse(request.postData() ?? "{}")).toMatchObject({
    rootFamilyId: "design-system",
    webAppModuleId: MODULE_PATTERNS_ID,
    placementType: "module-root",
  });
});

test("root-admin hierarchy page saves page settings through the governed page settings form", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  await expect(page.locator("#hierarchy-tree-drawer")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("#web-app-page-settings-icon-grid-host > #web-app-page-settings-icon-grid[data-form-icon-grid]")).toHaveCount(1);
  await expect(page.locator("#web-app-page-settings-context-nav-host > #web-app-page-settings-context-nav[data-form-drawer-select]")).toHaveCount(1);

  const saveRequest = page.waitForRequest((request) =>
    request.method() === "PUT" && request.url().includes(`/v1/web-app-page-settings/pages/${PAGE_HIERARCHY_ID}`),
  );

  await page.locator('label.form-toggle-row:has(#web-app-page-settings-show-in-top-nav)').click();
  await expect(page.locator("#web-app-page-settings-show-in-top-nav")).toBeChecked();
  await page.locator("#web-app-page-settings-icon-trigger").click();
  await expect(page.locator("#web-app-page-settings-icon-grid .drawer-eyebrow")).toHaveText("Icon picker");
  await expect(page.locator("#web-app-page-settings-icon-modal-title")).toHaveText("Choose campaign icon");
  await expect(page.locator("#web-app-page-settings-icon-grid .form-icon-grid-trigger-meta")).toHaveText("Search approved design-system icons");
  await page.getByRole("button", { name: "Choose Workspace icon" }).click();
  await page.locator("#web-app-page-settings-context-nav-trigger").click();
  await expect(page.locator("#web-app-page-settings-context-nav .drawer-eyebrow")).toHaveText("Eligible Pages");
  await expect(page.locator("#web-app-page-settings-context-nav-modal-title")).toHaveText("Choose context-nav pages");
  await expect(page.locator("#web-app-page-settings-context-nav-options")).toBeVisible();
  const drawerGeometry = await page.evaluate(() => {
    const panel = document.querySelector("#web-app-page-settings-context-nav [data-form-drawer-select-panel]");
    if (!(panel instanceof HTMLElement)) {
      return null;
    }

    const rect = panel.getBoundingClientRect();
    const style = window.getComputedStyle(panel);
    return {
      top: rect.top,
      rightGap: window.innerWidth - rect.right,
      width: rect.width,
      position: style.position,
    };
  });
  expect(drawerGeometry).not.toBeNull();
  expect(drawerGeometry?.position).toBe("fixed");
  expect(drawerGeometry?.rightGap ?? 9999).toBeLessThanOrEqual(2);
  expect(drawerGeometry?.top ?? 0).toBeGreaterThan(60);
  await page.locator('[data-form-drawer-select-option][data-value="' + PAGE_HIERARCHY_ID + '"]').click();
  await page.getByRole("button", { name: "Close context-nav selector" }).click();
  await page.locator("#web-app-page-settings-save").click();

  expect(JSON.parse((await saveRequest).postData() ?? "{}")).toMatchObject({
    iconKey: "workspace",
    showInTopNav: true,
    pageTemplateKey: "static-html-page",
    contextNavTargetPageIds: [PAGE_HIERARCHY_ID],
  });
  await expect(page.locator("#web-app-page-settings-show-in-top-nav")).toBeChecked();
});

test("root-admin shell reloads top-nav buttons from saved page settings after refresh", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createRootAdminVisibleContextNavTree(),
  });

  await expect(page.locator('#primary-nav-links .nav-link[data-page-link="overview"]')).toHaveCount(1);
  await expect(page.locator('#primary-nav-links .nav-link[data-page-link="web-app-hierarchy"]')).toHaveCount(0);

  await page.locator('label.form-toggle-row:has(#web-app-page-settings-show-in-top-nav)').click();
  await page.locator("#web-app-page-settings-save").click();

  await expect(page.locator('#primary-nav-links .nav-link[data-page-link="web-app-hierarchy"]')).toHaveCount(1);
  await expect(page.locator('#primary-nav-links .nav-link[data-page-link="web-app-hierarchy"]')).toContainText("Web App Hierarchy");

  await page.reload({ waitUntil: "networkidle" });

  await expect(page.locator('#primary-nav-links .nav-link[data-page-link="web-app-hierarchy"]')).toHaveCount(1);
  await expect(page.locator('#mobile-nav-menu > .nav-link[data-page-link="web-app-hierarchy"]')).toHaveCount(1);
});

test("root-admin context-nav drawer keeps the governed selected-state treatment from the shared drawer-select seam", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "", {
    tree: createNestedMockHierarchyTree(),
  });

  await expect(page.locator("#web-app-page-settings-context-nav-trigger")).toBeVisible();
  await page.locator("#web-app-page-settings-context-nav-trigger").click();
  await page.locator('[data-form-drawer-select-option][data-value="' + PAGE_CHOICE_GROUP_ID + '"]').click();

  const selectedState = await page.evaluate(() => {
    const chip = document.querySelector("#web-app-page-settings-context-nav .form-drawer-select-selected-chip");
    const activeOption = document.querySelector("#web-app-page-settings-context-nav .form-drawer-select-option.active");

    if (!(chip instanceof HTMLElement) || !(activeOption instanceof HTMLElement)) {
      return null;
    }

    const chipStyle = window.getComputedStyle(chip);
    const activeStyle = window.getComputedStyle(activeOption);
    return {
      chipBackground: chipStyle.backgroundColor,
      chipBorder: chipStyle.borderColor,
      activeBackground: activeStyle.backgroundColor,
      activeBorder: activeStyle.borderColor,
    };
  });

  expect(selectedState).not.toBeNull();
  expect(selectedState?.chipBackground).not.toBe("rgb(255, 255, 255)");
  expect(selectedState?.chipBorder).toContain("99, 91, 255");
  expect(selectedState?.activeBorder).toContain("99, 91, 255");
});

test("root-admin hierarchy page saves module landing-page selection in the Hierarchy section", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);
  await page.locator("#hierarchy-tree-nav-button").click();

  const moduleRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Patterns" }).first();
  await moduleRow.click();

  await expect(page.locator("#web-app-module-landing-form")).toBeVisible();
  await page.locator("#web-app-module-landing-select").selectOption(PAGE_HIERARCHY_ID);
  await page.locator("#hierarchy-tree-drawer-close").click();
  await expect(page.locator("#hierarchy-tree-drawer")).toHaveAttribute("aria-hidden", "true");
  await page.locator("#web-app-module-landing-save").click();

  await expect(page.locator("#shell-message")).toContainText("Saved landing page for Patterns.");
});

test("root-admin hierarchy resize handle sits on the outer drawer edge instead of the inner scroll lane", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);
  await page.locator("#hierarchy-tree-nav-button").click();

  const geometry = await page.evaluate(() => {
    const drawer = document.getElementById("hierarchy-tree-drawer");
    const handle = document.getElementById("hierarchy-tree-drawer-resize");
    if (!(drawer instanceof HTMLElement) || !(handle instanceof HTMLElement)) {
      return null;
    }

    const drawerRect = drawer.getBoundingClientRect();
    const handleRect = handle.getBoundingClientRect();
    return {
      drawerRight: drawerRect.right,
      handleCenter: handleRect.left + (handleRect.width / 2),
    };
  });

  expect(geometry).not.toBeNull();
  expect(Math.abs((geometry?.drawerRight ?? 0) - (geometry?.handleCenter ?? 0))).toBeLessThanOrEqual(8);
});
