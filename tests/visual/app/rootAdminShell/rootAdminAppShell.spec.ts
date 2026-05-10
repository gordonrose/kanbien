import { expect, test, type Page } from "@playwright/test";

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "9999-04-16T18:00:00.000Z",
};

function createRootAdminShellTree() {
  return {
    rootFamilies: [
      {
        rootFamilyId: "root-admin",
        displayLabel: "Root Admin",
        routePrefix: "/root-admin",
        modules: [
          {
            webAppModuleId: "module-root-admin",
            rootFamilyId: "root-admin",
            moduleKey: "root-admin-shell",
            displayLabel: "Root Admin Shell",
            landingPageWebAppPageId: "page-overview",
            status: "live",
            sortOrder: 1,
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
            ],
            orphanedPages: [],
          },
        ],
      },
    ],
  };
}

function pageSettingsRecord(pageId: string) {
  const settingsByPageId: Record<string, { displayLabel: string; showInTopNav: boolean; topNavOrder: number | null }> = {
    "page-overview": { displayLabel: "Overview", showInTopNav: true, topNavOrder: 0 },
    "page-users": { displayLabel: "Users", showInTopNav: true, topNavOrder: 1 },
    "page-roles": { displayLabel: "Roles", showInTopNav: true, topNavOrder: 2 },
  };
  const record = settingsByPageId[pageId];

  return {
    webAppPageId: pageId,
    rootFamilyId: "root-admin",
    displayLabel: record?.displayLabel ?? "Page",
    hasStoredSettings: true,
    iconKey: "page-default",
    effectiveIconKey: "page-default",
    showInTopNav: record?.showInTopNav === true,
    topNavOrder: record?.topNavOrder ?? null,
    pageTemplateKey: null,
    effectivePageTemplateKey: null,
    contextNavItems: [],
    createdAt: "2026-05-08T00:00:00.000Z",
    updatedAt: "2026-05-08T00:00:00.000Z",
  };
}

async function bootstrapAuthenticatedAppShell(page: Page) {
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
        totalPages: 0,
        totalMatchingRecords: 0,
        totalSearchableRecords: 0,
      }),
    });
  });

  await page.route(/.*\/v1\/root-admin\/harness-chat\/conversations(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [],
        page: 1,
        pageSize: 25,
        totalPages: 0,
        totalMatchingRecords: 0,
        totalSearchableRecords: 0,
      }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/tree", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(createRootAdminShellTree()),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/pages\/([^/?]+)$/, async (route) => {
    const pageId = route.request().url().match(/\/pages\/([^/?]+)$/)?.[1] ?? "page-overview";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(pageSettingsRecord(decodeURIComponent(pageId))),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/root-families\/root-admin\/pages\/[^/]+\/context-nav$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        rootFamilyId: "root-admin",
        shellPageKey: "overview",
        items: [],
      }),
    });
  });

  await page.goto("/root-admin");
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator("#page-overview").waitFor({ state: "visible" });
}

test("root-admin consumes the design-system app shell seam for core authenticated shell behavior", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await bootstrapAuthenticatedAppShell(page);

  await expect(page.locator("#auth-view")).toBeHidden();
  await expect(page.locator("#shell-view.design-system-shell")).toBeVisible();
  await expect(page.locator("#shell-view > .top-nav")).toBeVisible();
  await expect(page.locator("#brand-label")).toHaveText("Kanbien");
  await expect(page.locator("#breadcrumb-home-link")).toHaveText("Root Admin");
  await expect(page.locator("#shell-search-form")).toBeVisible();
  await expect(page.locator("#root-admin-context-nav-mount > .context-nav")).toBeVisible();
  await expect(page.locator("#root-admin-main.design-system-page-main")).toBeVisible();

  const stylesheetHrefs = await page.locator('link[rel="stylesheet"]').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("href")).filter(Boolean),
  );
  expect(stylesheetHrefs).toContain("/design-system/assets/styles.css");
  expect(stylesheetHrefs).not.toContain("/root-admin/assets/styles.css");
  expect(stylesheetHrefs).not.toContain("/root-admin/assets/login.css");

  await expect(page.locator('#primary-nav-links .nav-link[data-page-link="users"]')).toHaveAttribute(
    "href",
    "/root-admin/users",
  );
  await expect(page.locator('#primary-nav-links .nav-link[data-page-link="roles"]')).toHaveAttribute(
    "href",
    "/root-admin/roles",
  );

  await page.locator("#profile-menu-button").click();
  await expect(page.locator("#profile-menu")).toBeVisible();
  await expect(page.locator("#profile-logout-button")).toHaveText("Sign Out");
  await page.keyboard.press("Escape");
  await expect(page.locator("#profile-menu")).toBeHidden();

  await page.locator("#display-settings-button").click();
  await expect(page.locator("#display-settings-drawer")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#display-settings-drawer")).toBeHidden();

  await page.setViewportSize({ width: 640, height: 820 });
  await page.locator("#mobile-nav-button").click();
  await expect(page.locator("#mobile-nav-menu")).toBeVisible();
  await expect(page.locator("#mobile-nav-menu .nav-link[data-page-link='users']")).toHaveAttribute(
    "href",
    "/root-admin/users",
  );
});
