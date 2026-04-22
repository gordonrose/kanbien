import { expect, test, type Page } from "@playwright/test";

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "2027-04-16T18:00:00.000Z",
};

function createRootAdminTopNavTree() {
  return {
    rootFamilies: [
      {
        rootFamilyId: "root-admin",
        displayLabel: "Root Admin",
        routePrefix: "/root-admin",
        sortOrder: 1,
        createdAt: "2026-04-16T10:00:00.000Z",
        updatedAt: "2026-04-16T18:00:00.000Z",
        modules: [
          {
            webAppModuleId: "module-root-admin",
            rootFamilyId: "root-admin",
            moduleKey: "root-admin-shell",
            displayLabel: "Root Admin Shell",
            landingPageWebAppPageId: "page-overview",
            status: "live",
            sortOrder: 1,
            createdAt: "2026-04-16T10:00:00.000Z",
            updatedAt: "2026-04-16T18:00:00.000Z",
            pages: [
              {
                webAppPageId: "page-overview",
                pageKey: "overview",
                displayLabel: "Overview",
                resolvedFullRoutePath: "/root-admin",
                children: [],
              },
              {
                webAppPageId: "page-users",
                pageKey: "users",
                displayLabel: "Users",
                resolvedFullRoutePath: "/root-admin/users",
                children: [],
              },
              {
                webAppPageId: "page-roles",
                pageKey: "roles",
                displayLabel: "Roles",
                resolvedFullRoutePath: "/root-admin/roles",
                children: [],
              },
              {
                webAppPageId: "page-tenants",
                pageKey: "tenants",
                displayLabel: "Tenants",
                resolvedFullRoutePath: "/root-admin/tenants",
                children: [],
              },
              {
                webAppPageId: "page-tenant-admins",
                pageKey: "tenant-admins",
                displayLabel: "Tenant Admins",
                resolvedFullRoutePath: "/root-admin/tenant-admins",
                children: [],
              },
              {
                webAppPageId: "page-web-app-hierarchy",
                pageKey: "web-app-hierarchy",
                displayLabel: "Web App Hierarchy",
                resolvedFullRoutePath: "/root-admin/web-app-hierarchy",
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

function createPageSettingsRecord(pageId: string) {
  const settingsByPageId: Record<string, { displayLabel: string; showInTopNav: boolean; topNavOrder: number | null }> = {
    "page-overview": { displayLabel: "Overview", showInTopNav: true, topNavOrder: 0 },
    "page-users": { displayLabel: "Users", showInTopNav: true, topNavOrder: 1 },
    "page-roles": { displayLabel: "Roles", showInTopNav: true, topNavOrder: 2 },
    "page-tenants": { displayLabel: "Tenants", showInTopNav: true, topNavOrder: 3 },
    "page-tenant-admins": { displayLabel: "Tenant Admins", showInTopNav: true, topNavOrder: 4 },
    "page-web-app-hierarchy": { displayLabel: "Web App Hierarchy", showInTopNav: true, topNavOrder: 5 },
  };

  const record = settingsByPageId[pageId];
  if (!record) {
    return null;
  }

  return {
    webAppPageId: pageId,
    rootFamilyId: "root-admin",
    displayLabel: record.displayLabel,
    hasStoredSettings: true,
    iconKey: "page-default",
    effectiveIconKey: "page-default",
    showInTopNav: record.showInTopNav,
    topNavOrder: record.topNavOrder,
    pageTemplateKey: null,
    effectivePageTemplateKey: null,
    contextNavItems: [],
    createdAt: "2026-04-16T10:00:00.000Z",
    updatedAt: "2026-04-16T18:00:00.000Z",
  };
}

function defaultContextNavProjectionStore() {
  return {
    overview: [],
    users: [
      {
        webAppPageId: "page-users",
        shellPageKey: "users",
        displayLabel: "Users",
        resolvedFullRoutePath: "/root-admin/users",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 0,
      },
      {
        webAppPageId: "page-roles",
        shellPageKey: "roles",
        displayLabel: "Roles",
        resolvedFullRoutePath: "/root-admin/roles",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 1,
      },
      {
        webAppPageId: "page-tenants",
        shellPageKey: "tenants",
        displayLabel: "Tenants",
        resolvedFullRoutePath: "/root-admin/tenants",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 2,
      },
    ],
    roles: [
      {
        webAppPageId: "page-users",
        shellPageKey: "users",
        displayLabel: "Users",
        resolvedFullRoutePath: "/root-admin/users",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 0,
      },
      {
        webAppPageId: "page-roles",
        shellPageKey: "roles",
        displayLabel: "Roles",
        resolvedFullRoutePath: "/root-admin/roles",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 1,
      },
    ],
    tenants: [
      {
        webAppPageId: "page-users",
        shellPageKey: "users",
        displayLabel: "Users",
        resolvedFullRoutePath: "/root-admin/users",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 0,
      },
      {
        webAppPageId: "page-tenants",
        shellPageKey: "tenants",
        displayLabel: "Tenants",
        resolvedFullRoutePath: "/root-admin/tenants",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 1,
      },
      {
        webAppPageId: "page-tenant-admins",
        shellPageKey: "tenant-admins",
        displayLabel: "Tenant Admins",
        resolvedFullRoutePath: "/root-admin/tenant-admins",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 2,
      },
    ],
    "tenant-admins": [
      {
        webAppPageId: "page-users",
        shellPageKey: "users",
        displayLabel: "Users",
        resolvedFullRoutePath: "/root-admin/users",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 0,
      },
      {
        webAppPageId: "page-roles",
        shellPageKey: "roles",
        displayLabel: "Roles",
        resolvedFullRoutePath: "/root-admin/roles",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 1,
      },
      {
        webAppPageId: "page-tenants",
        shellPageKey: "tenants",
        displayLabel: "Tenants",
        resolvedFullRoutePath: "/root-admin/tenants",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 2,
      },
      {
        webAppPageId: "page-tenant-admins",
        shellPageKey: "tenant-admins",
        displayLabel: "Tenant Admins",
        resolvedFullRoutePath: "/root-admin/tenant-admins",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 3,
      },
      {
        webAppPageId: "page-web-app-hierarchy",
        shellPageKey: "web-app-hierarchy",
        displayLabel: "Web App Hierarchy",
        resolvedFullRoutePath: "/root-admin/web-app-hierarchy",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 4,
      },
    ],
  };
}

type RootAdminContextNavStore = ReturnType<typeof defaultContextNavProjectionStore>;

async function bootstrapAuthenticatedShell(
  page: Page,
  route = "/root-admin",
  search = "",
  options: {
    contextNavByPageKey?: Record<string, unknown[]>;
  } = {},
) {
  const contextNavByPageKey = {
    ...defaultContextNavProjectionStore(),
    ...(options.contextNavByPageKey ?? {}),
  };

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
        items: [
          {
            rootUserId: "00000000-0000-4000-8000-000000000001",
            email: "root.admin@example.test",
            firstName: "Root",
            lastName: "Admin",
            anonymized: false,
            status: "active",
            createdAt: "2026-04-01T10:00:00.000Z",
            updatedAt: "2026-04-16T18:00:00.000Z",
            deletedAt: null,
          },
        ],
        page: 1,
        pageSize: 25,
        totalPages: 1,
        totalMatchingRecords: 1,
        totalSearchableRecords: 1,
      }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/tree", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(createRootAdminTopNavTree()),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/pages\/[^/]+$/, async (route) => {
    const pathSegments = route.request().url().split("/");
    const pageId = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] ?? "" : "";
    const settings = createPageSettingsRecord(pageId);
    if (!settings) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Page not found." }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(settings),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/root-families\/[^/]+\/pages\/[^/]+\/context-nav$/, async (route) => {
    const requestUrl = new URL(route.request().url());
    const pathSegments = requestUrl.pathname.split("/");
    const pageKey = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] ?? "overview" : "overview";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        rootFamilyId: "root-admin",
        shellPageKey: pageKey,
        items: contextNavByPageKey[pageKey as keyof RootAdminContextNavStore] ?? [],
      }),
    });
  });

  await page.goto(`${route}${search}`);
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator(".sub-nav").waitFor({ state: "visible" });
  await page.locator(".context-nav").waitFor({ state: "visible" });
}

test.describe("root-admin shell sub-nav and context-nav adoption", () => {
  test("direct path entry loads each migrated root-admin suite and keeps canonical path-backed nav links", async ({ page }) => {
    // TC-ROOT-PATH-INT-001
    // TC-ROOT-PATH-INT-004
    await page.setViewportSize({ width: 1560, height: 1400 });

    const cases = [
      { route: "/root-admin", currentLabel: null, activeLabel: null },
      { route: "/root-admin/users", currentLabel: "Users", activeLabel: "Users" },
      { route: "/root-admin/roles", currentLabel: "Roles", activeLabel: "Roles" },
      { route: "/root-admin/tenants", currentLabel: "Tenants", activeLabel: "Tenants" },
      { route: "/root-admin/tenant-admins", currentLabel: "Tenant Admins", activeLabel: "Tenant Admins" },
      { route: "/root-admin/web-app-hierarchy", currentLabel: "Web App Hierarchy", activeLabel: null },
    ];

    for (const testCase of cases) {
      await bootstrapAuthenticatedShell(page, testCase.route);
      const expectedPathPattern =
        testCase.route === "/root-admin/web-app-hierarchy"
          ? /\/root-admin\/web-app-hierarchy(\/pages\/[^/]+)?$/
          : new RegExp(`${testCase.route.replace(/\//g, "\\/")}$`);
      await expect(page).toHaveURL(expectedPathPattern);

      if (testCase.currentLabel) {
        await expect(page.locator("#breadcrumb-current-label")).toHaveText(testCase.currentLabel);
        if (testCase.activeLabel) {
          await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText(testCase.activeLabel);
        } else {
          await expect(page.locator('.context-nav .context-nav-item[aria-current="page"]')).toHaveCount(0);
        }
      } else {
        await expect(page.locator("#breadcrumb-current-item")).toBeHidden();
        await expect(page.locator('.context-nav .context-nav-item[aria-current="page"]')).toHaveCount(0);
      }

      await expect(page.locator('#primary-nav-links .nav-link[data-page-link="overview"]')).toHaveAttribute("href", "/root-admin");
      await expect(page.locator('#primary-nav-links .nav-link[data-page-link="users"]')).toHaveAttribute("href", "/root-admin/users");
      await expect(page.locator('#primary-nav-links .nav-link[data-page-link="roles"]')).toHaveAttribute("href", "/root-admin/roles");
      await expect(page.locator('#primary-nav-links .nav-link[data-page-link="tenants"]')).toHaveAttribute("href", "/root-admin/tenants");
      await expect(page.locator('#mobile-nav-menu .nav-link[data-page-link="tenant-admins"]')).toHaveAttribute("href", "/root-admin/tenant-admins");
      await expect(page.locator('#mobile-nav-menu .nav-link[data-page-link="web-app-hierarchy"]')).toHaveAttribute("href", "/root-admin/web-app-hierarchy");
    }
  });

  test("every post-login routed surface keeps the governed page-shell section posture", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });

    const cases = [
      { route: "/root-admin", pageSelector: "#page-overview" },
      { route: "/root-admin/users", pageSelector: "#page-users" },
      { route: "/root-admin/roles", pageSelector: "#page-roles" },
      { route: "/root-admin/tenants", pageSelector: "#page-tenants" },
      { route: "/root-admin/tenant-admins", pageSelector: "#page-tenant-admins" },
      { route: "/root-admin/web-app-hierarchy", pageSelector: "#page-web-app-hierarchy" },
    ];

    for (const testCase of cases) {
      await bootstrapAuthenticatedShell(page, testCase.route);

      const pageSection = page.locator(testCase.pageSelector);
      await expect(pageSection).toBeVisible();
      await expect(pageSection).toHaveClass(/component-catalog-section/);
      await expect(pageSection.locator(".component-catalog-section-header").first()).toBeVisible();
    }
  });

  test("overview keeps the shallow breadcrumb while exposing the governed section rail", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin");

    await expect(page.locator("#breadcrumb-home-link")).toHaveAttribute("aria-current", "page");
    await expect(page.locator("#breadcrumb-current-item")).toBeHidden();
    await expect(page.locator(".context-nav .context-nav-main .context-nav-item[data-page-link]")).toHaveCount(0);
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"]')).toHaveCount(0);
  });

  test("users uses the adopted breadcrumb and active context-nav state", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin/users");

    await expect(page.locator("#breadcrumb-current-label")).toHaveText("Users");
    await expect(page.locator("#shell-search-input")).toHaveAttribute(
      "placeholder",
      "Search root users by exact email or 3+ email prefix",
    );
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Users");

    const railBox = await page.locator(".context-nav").boundingBox();
    const mainBox = await page.locator(".design-system-page-main").boundingBox();
    expect(railBox).not.toBeNull();
    expect(mainBox).not.toBeNull();
    expect(mainBox!.x).toBeGreaterThanOrEqual((railBox?.x ?? 0) + (railBox?.width ?? 0) - 1);
  });

  test("desktop breadcrumb pressure truncates or collapses before chips overlap the search lane", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin/users");

    const compactVisible = await page.locator("#breadcrumb-compact").isVisible();
    const homeIconOnly = await page.locator("#breadcrumb-home-link").evaluate((node) =>
      node.classList.contains("breadcrumb-home-icon-only"),
    );
    const homeTooltip = await page.locator("#breadcrumb-home-link").getAttribute("data-tooltip");
    const currentTooltip = await page.locator("#breadcrumb-current-label").getAttribute("data-tooltip");

    expect(compactVisible || homeIconOnly || Boolean(homeTooltip) || Boolean(currentTooltip)).toBe(true);

    const breadcrumbNavBox = await page.locator(".breadcrumb-nav").boundingBox();
    const searchBox = await page.locator(".search-shell").boundingBox();
    expect(breadcrumbNavBox).not.toBeNull();
    expect(searchBox).not.toBeNull();
    expect((breadcrumbNavBox?.x ?? 0) + (breadcrumbNavBox?.width ?? 0)).toBeLessThanOrEqual((searchBox?.x ?? 0) + 1);
  });

  test("legacy root-user hashes still land on the users section and hand off to canonical path-backed navigation", async ({ page }) => {
    // TC-ROOT-PATH-INT-002
    // TC-ROOT-PATH-EDGE-003
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin#root-users");

    await expect(page).toHaveURL(/\/root-admin\/users$/);
    await expect(page.locator("#breadcrumb-current-label")).toHaveText("Users");
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Users");

    await page.locator('.context-nav .context-nav-item[data-page-link="tenants"]').click();

    await expect(page).toHaveURL(/\/root-admin\/tenants$/);
    await expect(page.locator("#breadcrumb-current-label")).toHaveText("Tenants");
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Tenants");
  });

  test("desktop context-nav hover uses the shared floating tooltip layer", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin/users");

    const rolesItem = page.locator('.context-nav .context-nav-item[data-page-link="roles"]');
    await rolesItem.hover();

    const tooltip = page.locator("#shared-floating-tooltip");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText("Roles");

    const itemBox = await rolesItem.boundingBox();
    const tooltipBox = await tooltip.boundingBox();
    expect(itemBox).not.toBeNull();
    expect(tooltipBox).not.toBeNull();
    expect((tooltipBox?.x ?? 0)).toBeGreaterThan((itemBox?.x ?? 0) + (itemBox?.width ?? 0) - 1);
  });

  test("loading tenants does not surface a breadcrumb tooltip before the pointer moves", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await page.goto("about:blank");
    await page.mouse.move(96, 170);
    await bootstrapAuthenticatedShell(page, "/root-admin/tenants");

    await expect(page.locator("#shared-floating-tooltip")).toBeHidden();
  });

  test("mobile web-app-hierarchy keeps the bottom bar to five visible controls by moving extra destinations into More", async ({ page }) => {
    await page.setViewportSize({ width: 560, height: 960 });
    await bootstrapAuthenticatedShell(page, "/root-admin/web-app-hierarchy", "", {
      contextNavByPageKey: {
        "web-app-hierarchy": [
          {
            webAppPageId: "page-roles",
            shellPageKey: "roles",
            displayLabel: "Roles",
            resolvedFullRoutePath: "/root-admin/roles",
            iconKey: "page-default",
            effectiveIconKey: "page-default",
            sortOrder: 0,
          },
          {
            webAppPageId: "page-tenant-admins",
            shellPageKey: "tenant-admins",
            displayLabel: "Tenant Admins",
            resolvedFullRoutePath: "/root-admin/tenant-admins",
            iconKey: "page-default",
            effectiveIconKey: "page-default",
            sortOrder: 1,
          },
          {
            webAppPageId: "page-tenants",
            shellPageKey: "tenants",
            displayLabel: "Tenants",
            resolvedFullRoutePath: "/root-admin/tenants",
            iconKey: "page-default",
            effectiveIconKey: "page-default",
            sortOrder: 2,
          },
          {
            webAppPageId: "page-web-app-hierarchy",
            shellPageKey: "web-app-hierarchy",
            displayLabel: "Web App Hierarchy",
            resolvedFullRoutePath: "/root-admin/web-app-hierarchy",
            iconKey: "page-default",
            effectiveIconKey: "page-default",
            sortOrder: 3,
          },
          {
            webAppPageId: "page-overview",
            shellPageKey: "overview",
            displayLabel: "Overview",
            resolvedFullRoutePath: "/root-admin",
            iconKey: "page-default",
            effectiveIconKey: "page-default",
            sortOrder: 4,
          },
          {
            webAppPageId: "page-users",
            shellPageKey: "users",
            displayLabel: "Users",
            resolvedFullRoutePath: "/root-admin/users",
            iconKey: "page-default",
            effectiveIconKey: "page-default",
            sortOrder: 5,
          },
        ],
      },
    });

    await expect(page.locator(".breadcrumb-nav")).toBeHidden();
    await expect(page.locator("#display-settings-button")).toBeHidden();
    await expect(page.locator(".context-nav .context-nav-item:visible .context-nav-label")).toHaveText([
      "Roles",
      "Tenant Admins",
      "Web App Hierarchy",
      "Hierarchy",
      "More",
    ]);
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Web App Hierarchy");
    await expect(page.locator(".context-nav .context-nav-item:visible")).toHaveCount(5);

    await page.locator("#context-nav-more-button").evaluate((button) => {
      if (button instanceof HTMLButtonElement) {
        button.click();
      }
    });
    await expect(page.locator("#context-nav-more-menu")).toBeVisible();
    await expect(page.locator('#context-nav-more-menu [data-page-link="overview"]')).toHaveText("Overview");
    await expect(page.locator('#context-nav-more-menu [data-page-link="users"]')).toHaveText("Users");
    await expect(page.locator('#context-nav-more-menu [data-page-link="tenants"]')).toHaveText("Tenants");

    const contextNavBox = await page.locator(".context-nav").boundingBox();
    expect(contextNavBox).not.toBeNull();
    expect(Math.abs((contextNavBox?.x ?? 0) - 0)).toBeLessThanOrEqual(2);
    expect(contextNavBox?.width ?? 0).toBeGreaterThanOrEqual(550);
  });

  test("rtl mirrors the rail to the right edge while keeping users active", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin/users", "?lang=ar");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#breadcrumb-current-label")).toHaveText("Users");

    const railBox = await page.locator(".context-nav").boundingBox();
    const viewport = page.viewportSize();
    expect(railBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(Math.abs((viewport?.width ?? 0) - ((railBox?.x ?? 0) + (railBox?.width ?? 0)))).toBeLessThanOrEqual(2);
  });

  test("shell search can route into the new tenant section", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin");

    const searchInput = page.locator("#shell-search-input");
    await searchInput.fill("tenants");
    await searchInput.press("Enter");

    await expect(page.locator("#breadcrumb-current-label")).toHaveText("Tenants");
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Tenants");
    await expect(page.locator("#shell-message")).toBeHidden();
  });

  test("real shell banners preserve spacing and clear on navigation by default", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin/tenant-admins");

    const searchInput = page.locator("#shell-search-input");
    await searchInput.fill("search");
    await searchInput.press("Enter");

    await expect(page.locator("#shell-message")).toContainText("No root-admin destination matched");
    await expect(page.locator("#shell-message .status-message-close")).toBeVisible();

    const geometry = await page.evaluate(() => {
      const bannerRoot = document.querySelector<HTMLElement>("#shell-message");
      const headerNode = document.querySelector<HTMLElement>("#page-tenant-admins .component-catalog-section-header");
      return {
        gapToHeader:
          bannerRoot && headerNode
            ? Math.round(headerNode.getBoundingClientRect().top - bannerRoot.getBoundingClientRect().bottom)
            : 0,
      };
    });

    expect(geometry.gapToHeader).toBeGreaterThanOrEqual(16);

    await page.locator('.context-nav .context-nav-item[data-page-link="users"]').click();

    await expect(page.locator("#page-users")).toBeVisible();
    await expect(page.locator("#shell-message")).toBeHidden();
    await expect(page.locator("#shell-message")).not.toContainText("No root-admin destination matched");
  });

  test("trailing-slash variants resolve consistently during the migration window", async ({ page }) => {
    // TC-ROOT-PATH-EDGE-002
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin/tenant-admins/");

    await expect(page).toHaveURL(/\/root-admin\/tenant-admins$/);
    await expect(page.locator("#breadcrumb-current-label")).toHaveText("Tenant Admins");
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Tenant Admins");
  });

  test("desktop display settings opens from the context-nav utility and keeps the approved app subset", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin");

    await page.locator("#display-settings-button").click();

    const drawer = page.locator("#display-settings-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer.locator("h2")).toHaveText("Display Settings");
    await expect(drawer.locator("[data-theme-option]")).toHaveCount(3);
    await expect(drawer.locator("[data-magnification-option]")).toHaveCount(5);
    await expect(drawer.locator("[data-accent-option]")).toHaveCount(0);
    await expect(drawer.locator("[data-direction-option]")).toHaveCount(0);

    const railBox = await page.locator(".context-nav").boundingBox();
    const drawerBox = await drawer.boundingBox();
    expect(railBox).not.toBeNull();
    expect(drawerBox).not.toBeNull();
    expect(Math.abs((drawerBox?.x ?? 0) - ((railBox?.x ?? 0) + (railBox?.width ?? 0)))).toBeLessThanOrEqual(2);
  });

  test("display settings controls stay open while applying app theme and magnification", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin");

    await page.locator("#display-settings-button").click();
    await page.locator('[data-theme-option="dark"]').click();
    await page.locator('[data-magnification-option="100"]').click();

    await expect(page.locator("#display-settings-drawer")).toBeVisible();
    await expect(page.locator('[data-theme-option="dark"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-magnification-option="100"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect.poll(async () => page.evaluate(() => document.documentElement.style.getPropertyValue("--ui-scale"))).toBe("1.5");
  });

  test("escape and outside click close display settings and return focus to the launcher", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin");

    const launcher = page.locator("#display-settings-button");
    await launcher.click();
    await page.keyboard.press("Escape");

    await expect(page.locator("#display-settings-drawer")).toBeHidden();
    await expect(launcher).toBeFocused();

    await launcher.click();
    await page.locator(".design-system-page-main").click();

    await expect(page.locator("#display-settings-drawer")).toBeHidden();
    await expect(launcher).toBeFocused();
  });

  test("mobile launches display settings through More and attaches the sheet above the bottom bar", async ({ page }) => {
    await page.setViewportSize({ width: 560, height: 960 });
    await bootstrapAuthenticatedShell(page, "/root-admin");

    await page.locator("#context-nav-more-button").click();
    await expect(page.locator("#context-nav-more-menu")).toBeVisible();
    await page.locator("#context-nav-more-display-settings").click();

    const drawer = page.locator("#display-settings-drawer");
    const bottomBar = page.locator(".context-nav");
    await expect(drawer).toBeVisible();

    const drawerBox = await drawer.boundingBox();
    const bottomBarBox = await bottomBar.boundingBox();
    expect(drawerBox).not.toBeNull();
    expect(bottomBarBox).not.toBeNull();
    expect(Math.abs(((drawerBox?.y ?? 0) + (drawerBox?.height ?? 0)) - (bottomBarBox?.y ?? 0))).toBeLessThanOrEqual(4);
  });

  test("rtl mirrors the display settings drawer and localizes the payload for Arabic readers", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "/root-admin", "?lang=ar");

    await page.locator("#display-settings-button").click();

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#display-settings-title")).toHaveText("إعدادات العرض");
    await expect(page.locator("#display-settings-theme-label")).toHaveText("المظهر");

    const railBox = await page.locator(".context-nav").boundingBox();
    const drawerBox = await page.locator("#display-settings-drawer").boundingBox();
    expect(railBox).not.toBeNull();
    expect(drawerBox).not.toBeNull();
    expect(Math.abs(((drawerBox?.x ?? 0) + (drawerBox?.width ?? 0)) - (railBox?.x ?? 0))).toBeLessThanOrEqual(2);
  });
});
