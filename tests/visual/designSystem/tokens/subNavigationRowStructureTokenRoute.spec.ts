import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/sub-navigation-row-structure";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("sub-navigation row structure token route", () => {
  test("renders the signed 24-column breadcrumb, gap, search, and reserve lane map", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Sub Navigation Row Structure Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--sub-navigation-row-structure")).toBeVisible();
    await expect(page.locator(".token-spec-sub-navigation-row-map-host").first()).toBeVisible();
    await expect(page.locator("[data-token-sub-navigation-row-lane='breadcrumb']").first()).toBeVisible();
    await expect(page.locator("[data-token-sub-navigation-row-lane='gap']").first()).toBeVisible();
    await expect(page.locator("[data-token-sub-navigation-row-lane='search']").first()).toBeVisible();
    await expect(page.locator("[data-token-sub-navigation-row-lane='reserve']").first()).toBeVisible();
    await expect(page.getByText("breadcrumb 1-7; gap 8; search 9-17; reserve 18-24")).toBeVisible();
    await expect(page.getByText("remove reserve columns 18-24 first")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
