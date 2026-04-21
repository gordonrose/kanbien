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

function buildRootUsers(total = 30) {
  return Array.from({ length: total }, (_value, index) => {
    const number = index + 1;
    return {
      rootUserId: `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`,
      email: `root.user${number}@example.test`,
      firstName: "Root",
      lastName: `User ${number}`,
      anonymized: false,
      status: number % 6 === 0 ? "inactive" : "active",
      createdAt: `2026-03-${String(((number - 1) % 28) + 1).padStart(2, "0")}T10:00:00.000Z`,
      updatedAt: `2026-04-${String(((number - 1) % 17) + 1).padStart(2, "0")}T14:15:00.000Z`,
      deletedAt: null,
    };
  });
}

async function mockRootUsersRoutes(
  page: Page,
  options: { failInitialOnce?: boolean } = {},
) {
  const rootUsers = buildRootUsers();
  let initialFailed = false;
  const contextNavByPageKey = defaultContextNavProjectionStore();

  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSession),
    });
  });

  await page.route("**/v1/root-users**", async (route) => {
    const url = new URL(route.request().url());
    const email = url.searchParams.get("email")?.trim().toLowerCase() ?? "";
    const emailPrefix = url.searchParams.get("emailPrefix")?.trim().toLowerCase() ?? "";
    const pageValue = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "25");

    if (options.failInitialOnce && !initialFailed && !email && !emailPrefix && pageValue === 1) {
      initialFailed = true;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          code: "REQUEST_FAILED",
          message: "The request could not be completed.",
        }),
      });
      return;
    }

    if (email) {
      const match = rootUsers.find((rootUser) => rootUser.email === email);
      if (!match) {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({
            code: "ROOT_USER_NOT_FOUND",
            message: "That root user could not be found.",
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(match),
      });
      return;
    }

    const filtered = emailPrefix
      ? rootUsers.filter((rootUser) => rootUser.email.startsWith(emailPrefix))
      : rootUsers;
    const start = (pageValue - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items,
        page: pageValue,
        pageSize,
        totalPages,
        totalMatchingRecords: filtered.length,
        totalSearchableRecords: filtered.length,
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
        items: contextNavByPageKey[pageKey as keyof typeof contextNavByPageKey] ?? [],
      }),
    });
  });
}

async function bootstrapUsersPage(
  page: Page,
  options: { failInitialOnce?: boolean; search?: string } = {},
) {
  await mockRootUsersRoutes(page, options);
  const search = options.search ?? "";
  await page.goto(`/root-admin/users${search}`);
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator("#page-users").waitFor({ state: "visible" });
  await page.locator('[data-selectable-list-card]').first().waitFor({ state: "visible" });
}

test.describe("root-admin root-users list page adoption", () => {
  test("desktop uses the signed-off split layout and footer next can cross the current page boundary", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await expect(page.locator('[data-selectable-list-card]')).toHaveCount(25);
    await expect(page.locator("#root-users-detail-panel")).toBeHidden();

    await page.locator('[data-selectable-list-card]').nth(24).click();
    await expect(page.locator("#root-users-detail-panel")).toBeVisible();
    await expect(page.locator("#root-users-detail-title")).toHaveText("Root User 25");

    await page.locator("#root-users-detail-next").click();

    await expect(page.locator('[data-selectable-list-card]')).toHaveCount(30);
    await expect(page.locator("#root-users-detail-title")).toHaveText("Root User 26");
    await expect(page.locator(".list-page-shell-split")).toHaveClass(/detail-open/);
    const announcementState = await page.locator("#root-users-list-announcement").evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return {
        className: node.className,
        position: styles.position,
        width: styles.width,
        height: styles.height,
        clip: styles.clip,
      };
    });
    expect(announcementState).toMatchObject({
      className: "visually-hidden",
      position: "absolute",
      width: "1px",
      height: "1px",
      clip: "rect(0px, 0px, 0px, 0px)",
    });

    const listBox = await page.locator(".list-page-list-column").boundingBox();
    const detailBox = await page.locator("#root-users-detail-panel").boundingBox();
    expect(listBox).not.toBeNull();
    expect(detailBox).not.toBeNull();
    expect((listBox?.x ?? 0)).toBeLessThan((detailBox?.x ?? 0) - 1);
    expect(Math.abs((listBox?.y ?? 0) - (detailBox?.y ?? 0))).toBeLessThanOrEqual(2);
  });

  test("desktop closed users list uses browser scroll and lazy-loads from the page bottom", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 900 });
    await bootstrapUsersPage(page);

    const listColumn = page.locator(".list-page-list-column");
    const itemCards = page.locator('[data-selectable-list-card]');
    const initialCount = await itemCards.count();

    const closedState = await listColumn.evaluate((node) => {
      if (!(node instanceof HTMLElement)) {
        return null;
      }

      return {
        overflowY: getComputedStyle(node).overflowY,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
      };
    });

    expect(closedState).not.toBeNull();
    expect(closedState?.overflowY).toBe("visible");

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      window.dispatchEvent(new Event("scroll"));
    });

    await expect(itemCards).toHaveCount(30);
    expect(initialCount).toBe(25);
  });

  test("shell search narrows the users page honestly, closes stale detail, and supports clear-search recovery", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await page.locator('[data-selectable-list-card]').first().click();
    await expect(page.locator("#root-users-detail-title")).toHaveText("Root User 1");

    const searchInput = page.locator("#shell-search-input");
    await searchInput.fill("missing.root@example.test");
    await searchInput.press("Enter");

    await expect(page.locator("#root-users-detail-panel")).toBeHidden();
    await expect(searchInput).toBeFocused();
    await expect(page.locator('[data-selectable-list-no-results-state]')).toBeVisible();
    await expect(page.locator("#shell-message")).toContainText("No visible root users matched");

    await page.locator('[data-selectable-list-clear-search]').click();

    await expect(page.locator('[data-selectable-list-card]')).toHaveCount(25);
    await expect(searchInput).toBeFocused();
    await expect(page.locator('[data-selectable-list-no-results-state]')).toBeHidden();
  });

  test("mobile selection becomes a full-sheet detail overlay that stays above the bottom bar", async ({ page }) => {
    await page.setViewportSize({ width: 560, height: 960 });
    await bootstrapUsersPage(page);

    await page.locator('[data-selectable-list-card]').first().click();

    const detailPanel = page.locator("#root-users-detail-panel");
    const bottomBar = page.locator(".context-nav");

    await expect(detailPanel).toBeVisible();
    await expect(detailPanel).toHaveAttribute("role", "dialog");
    await expect(page.locator("#root-users-detail-title")).toBeFocused();

    const detailBox = await detailPanel.boundingBox();
    const bottomBarBox = await bottomBar.boundingBox();
    expect(detailBox).not.toBeNull();
    expect(bottomBarBox).not.toBeNull();
    expect((detailBox?.y ?? 0) + (detailBox?.height ?? 0)).toBeLessThanOrEqual((bottomBarBox?.y ?? 0) + 1);
  });

  test("initial directory failures stay scoped to the list region and recover through the local retry action", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await mockRootUsersRoutes(page, { failInitialOnce: true });

    await page.goto("/root-admin/users");
    await page.locator("#shell-view").waitFor({ state: "visible" });
    await expect(page.locator('[data-selectable-list-initial-error-state]')).toBeVisible();

    await page.locator('[data-selectable-list-initial-retry]').click();

    await expect(page.locator('[data-selectable-list-card]')).toHaveCount(25);
    await expect(page.locator('[data-selectable-list-initial-error-state]')).toBeHidden();
  });

  test("rtl mirrors the adopted split relationship while keeping the users detail flow intact", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page, { search: "?lang=ar" });

    await page.locator('[data-selectable-list-card]').first().click();

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#root-users-detail-panel")).toBeVisible();

    const listBox = await page.locator(".list-page-list-column").boundingBox();
    const detailBox = await page.locator("#root-users-detail-panel").boundingBox();
    expect(listBox).not.toBeNull();
    expect(detailBox).not.toBeNull();
    expect((detailBox?.x ?? 0) + (detailBox?.width ?? 0)).toBeLessThanOrEqual((listBox?.x ?? 0) + 1);
  });

  test("magnified users detail review keeps the panel readable and the footer navigation recoverable", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await page.locator("#display-settings-button").click();
    await page.locator('[data-magnification-option="100"]').click();
    await page.locator('[data-selectable-list-card]').first().click();

    await expect(page.locator("#root-users-detail-panel")).toBeVisible();
    await expect(page.locator("#root-users-detail-close")).toBeVisible();
    await expect(page.locator("#root-users-detail-next")).toBeVisible();
    await expect
      .poll(async () => page.evaluate(() => document.documentElement.style.getPropertyValue("--ui-scale")))
      .toBe("1.5");
  });
});
