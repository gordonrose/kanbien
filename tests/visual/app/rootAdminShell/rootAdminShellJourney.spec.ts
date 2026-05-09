import { expect, test, type Page } from "@playwright/test";

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "9999-04-16T18:00:00.000Z",
};

function createRootAdminTopNavTree() {
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

async function routeShellData(page: Page) {
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

  await page.route("**/v1/web-app-hierarchy/tree", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(createRootAdminTopNavTree()),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/pages\/[^/]+$/, async (route) => {
    const webAppPageId = route.request().url().split("/").pop() ?? "";
    const pageSettingsById: Record<
      string,
      { displayLabel: string; showInTopNav: boolean; topNavOrder: number }
    > = {
      "page-overview": { displayLabel: "Overview", showInTopNav: true, topNavOrder: 1 },
      "page-users": { displayLabel: "Users", showInTopNav: true, topNavOrder: 2 },
      "page-roles": { displayLabel: "Roles", showInTopNav: true, topNavOrder: 3 },
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(pageSettingsById[webAppPageId] ?? {
        displayLabel: webAppPageId,
        showInTopNav: false,
        topNavOrder: 99,
      }),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/root-families\/[^/]+\/pages\/[^/]+\/context-nav$/, async (route) => {
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
}

test("TC-ROOT-ADMIN-SHELL-E2E-001 and JY-ROOT-ADMIN-004 prove root-admin shell direct entry, bootstrap, and logout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await routeShellData(page);

  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSession),
    });
  });

  let logoutRequests = 0;
  await page.route("**/v1/root-auth/browser/logout", async (route) => {
    logoutRequests += 1;
    expect(route.request().method()).toBe("POST");
    expect(route.request().headers().origin).toBe("http://127.0.0.1:4317");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "logged-out" }),
    });
  });

  await page.goto("/root-admin");

  await expect(page).toHaveURL(/\/root-admin$/);
  await expect(page.locator("#shell-view")).toBeVisible();
  await expect(page.locator("#auth-view")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Root admin primary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Overview" }).first()).toHaveAttribute("href", "/root-admin");
  await expect(page.locator("#profile-menu-button")).toContainText("Root Admin");

  await page.locator("#profile-menu-button").click();
  await expect(page.locator("#profile-logout-button")).toBeVisible();
  await page.locator("#profile-logout-button").click();

  await expect(page).toHaveURL(/\/root-admin$/);
  await expect(page.locator("#auth-view")).toBeVisible();
  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "password");
  await expect(page.locator("#shell-view")).toBeHidden();
  expect(logoutRequests).toBe(1);
});

test("TC-ROOT-ADMIN-SHELL-E2E-001 keeps unauthenticated and expired bootstrap states out of the shell", async ({ browser }) => {
  const bootstrapCases = [
    {
      code: "UNAUTHORIZED",
      message: "Authentication required.",
    },
    {
      code: "INVALID_SESSION",
      message: "Session expired.",
    },
  ];

  for (const bootstrapCase of bootstrapCases) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await routeShellData(page);
    await page.route("**/v1/root-auth/browser/session", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify(bootstrapCase),
      });
    });

    await page.goto("/root-admin");

    await expect(page.locator("[data-login-template]")).toBeVisible();
    await expect(page.locator("#shell-view")).toBeHidden();
    await expect(page.getByRole("button", { name: /Sign in|Verify Password/ })).toBeVisible();
    await page.close();
  }
});

test("root-admin shell automatically returns to login when the active browser session expires", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await routeShellData(page);
  const browserNow = await page.evaluate(() => Date.now());

  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ...mockSession,
        expiresAt: new Date(browserNow + 2500).toISOString(),
      }),
    });
  });

  await page.goto("/root-admin");

  await expect(page.locator("#shell-view")).toBeVisible();
  await expect(page.locator("#auth-view")).toBeHidden();

  await expect(page.locator("#auth-view")).toBeVisible({ timeout: 4000 });
  await expect(page.locator("#shell-view")).toBeHidden();
  await expect(page.locator("#auth-message")).toContainText("Your session has expired. Please sign in again.");
});
