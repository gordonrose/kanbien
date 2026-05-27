import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/index-nav-item-current-indicator";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav item current indicator token route", () => {
  test("renders the signed non-color current indicator proof", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Item Current Indicator Token", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-indicator-marker").first()).toBeVisible();
    await expect(page.getByText("aria-current remains owned by the primitive")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.locator(".token-spec-indicator-marker").first()).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
