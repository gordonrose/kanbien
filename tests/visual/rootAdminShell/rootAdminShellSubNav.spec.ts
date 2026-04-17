import { expect, test, type Page } from "@playwright/test";

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "2026-04-16T18:00:00.000Z",
};

async function bootstrapAuthenticatedShell(page: Page, hash = "#overview", search = "") {
  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSession),
    });
  });

  await page.goto(`/root-admin${search}${hash}`);
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator(".sub-nav-row").waitFor({ state: "visible" });
  await page.locator(".context-nav").waitFor({ state: "visible" });
}

test.describe("root-admin shell sub-nav and context-nav adoption", () => {
  test("overview keeps the shallow breadcrumb while exposing the governed section rail", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "#overview");

    await expect(page.locator("#breadcrumb-home-link")).toHaveAttribute("aria-current", "page");
    await expect(page.locator("#breadcrumb-current-item")).toBeHidden();
    await expect(page.locator(".context-nav .context-nav-item[data-page-link]")).toHaveCount(4);
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"]')).toHaveCount(0);
  });

  test("users uses the adopted breadcrumb and active context-nav state", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "#users");

    await expect(page.locator("#breadcrumb-current-label")).toHaveText("Users");
    await expect(page.locator("#shell-search-input")).toHaveAttribute(
      "placeholder",
      "Search users, routes, or shell guidance",
    );
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Users");

    const railBox = await page.locator(".context-nav").boundingBox();
    const mainBox = await page.locator(".root-admin-main").boundingBox();
    expect(railBox).not.toBeNull();
    expect(mainBox).not.toBeNull();
    expect(mainBox!.x).toBeGreaterThanOrEqual((railBox?.x ?? 0) + (railBox?.width ?? 0) - 1);
  });

  test("legacy root-user hashes still land on the users section", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "#root-users");

    await expect(page.locator("#breadcrumb-current-label")).toHaveText("Users");
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Users");
  });

  test("desktop context-nav hover uses the shared floating tooltip layer", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "#users");

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

  test("mobile fallback converts the context-nav into a bottom bar with visible labels", async ({ page }) => {
    await page.setViewportSize({ width: 560, height: 960 });
    await bootstrapAuthenticatedShell(page, "#tenant-admins");

    await expect(page.locator(".breadcrumb-nav")).toBeHidden();
    await expect(page.locator("#display-settings-button")).toBeHidden();
    await expect(page.locator(".context-nav .context-nav-item:visible .context-nav-label")).toHaveText([
      "Users",
      "Roles",
      "Tenants",
      "Tenant Admins",
      "More",
    ]);
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Tenant Admins");

    const contextNavBox = await page.locator(".context-nav").boundingBox();
    expect(contextNavBox).not.toBeNull();
    expect(Math.abs((contextNavBox?.x ?? 0) - 0)).toBeLessThanOrEqual(2);
    expect(contextNavBox?.width ?? 0).toBeGreaterThanOrEqual(550);
  });

  test("rtl mirrors the rail to the right edge while keeping users active", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "#users", "?lang=ar");

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
    await bootstrapAuthenticatedShell(page, "#overview");

    const searchInput = page.locator("#shell-search-input");
    await searchInput.fill("tenants");
    await searchInput.press("Enter");

    await expect(page.locator("#breadcrumb-current-label")).toHaveText("Tenants");
    await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Tenants");
    await expect(page.locator("#shell-message")).toContainText("Opened Tenants.");
  });

  test("desktop display settings opens from the context-nav utility and keeps the approved app subset", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "#overview");

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
    await bootstrapAuthenticatedShell(page, "#overview");

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
    await bootstrapAuthenticatedShell(page, "#overview");

    const launcher = page.locator("#display-settings-button");
    await launcher.click();
    await page.keyboard.press("Escape");

    await expect(page.locator("#display-settings-drawer")).toBeHidden();
    await expect(launcher).toBeFocused();

    await launcher.click();
    await page.locator(".root-admin-main").click();

    await expect(page.locator("#display-settings-drawer")).toBeHidden();
    await expect(launcher).toBeFocused();
  });

  test("mobile launches display settings through More and attaches the sheet above the bottom bar", async ({ page }) => {
    await page.setViewportSize({ width: 560, height: 960 });
    await bootstrapAuthenticatedShell(page, "#overview");

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
    expect(Math.abs(((drawerBox?.y ?? 0) + (drawerBox?.height ?? 0)) - (bottomBarBox?.y ?? 0))).toBeLessThanOrEqual(2);
  });

  test("rtl mirrors the display settings drawer and localizes the payload for Arabic readers", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapAuthenticatedShell(page, "#overview", "?lang=ar");

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
