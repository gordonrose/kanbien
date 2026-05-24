import { expect, test } from "@playwright/test";

const shellContractRoutes = [
  "/design-system/tokens/list-page-structure",
  "/design-system/tokens/filter-panel-structure",
  "/design-system/canonicals/top-nav",
] as const;

test.describe("design-system page shell contract", () => {
  for (const route of shellContractRoutes) {
    test(`keeps breadcrumbs and a working display settings drawer on ${route}`, async ({ page }) => {
      await page.goto(route);

      const breadcrumb = page.locator(".design-system-shell > .sub-nav .breadcrumb-list");
      const currentBreadcrumb = page.locator(".design-system-shell > .sub-nav .breadcrumb-current");
      const settingsButton = page.locator("#accessibility-button");
      const settingsDrawer = page.locator("#accessibility-drawer");

      await expect(breadcrumb).toBeVisible();
      await expect(currentBreadcrumb).toBeVisible();
      await expect(currentBreadcrumb).toHaveAttribute("aria-current", "page");
      await expect(settingsButton).toBeVisible();
      await expect(settingsButton).toHaveAttribute("aria-controls", "accessibility-drawer");
      await expect(settingsButton).toHaveAttribute("aria-expanded", "false");
      await expect(settingsDrawer).toHaveAttribute("aria-hidden", "true");

      await settingsButton.click();

      await expect(settingsButton).toHaveAttribute("aria-expanded", "true");
      await expect(settingsDrawer).toBeVisible();
      await expect(settingsDrawer).toHaveAttribute("aria-hidden", "false");
      await expect(settingsDrawer.locator("[data-theme-option='dark']")).toBeVisible();
      await expect(settingsDrawer.locator("[data-magnification-option='100']")).toBeVisible();
      await expect(settingsDrawer.locator("[data-direction-option='rtl']")).toBeVisible();

      await settingsDrawer.locator("#accessibility-close").click();

      await expect(settingsButton).toHaveAttribute("aria-expanded", "false");
      await expect(settingsDrawer).toHaveAttribute("aria-hidden", "true");
    });
  }
});
