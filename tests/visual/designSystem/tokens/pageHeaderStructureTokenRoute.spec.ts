import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/page-header-structure";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("page header structure token route", () => {
  test("renders signed page-header region map values", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Page Header Structure Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--page-header-structure")).toBeVisible();
    await expect(page.getByText("24 columns", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("1, 2, 3-5, 6-8, 9-19, 20, 21, 22, 23, 24")).toBeVisible();
    await expect(page.getByText("context-title (9-19)")).toBeVisible();
    await expect(page.getByText("action-5 (24-24)")).toBeVisible();
    await expect(page.getByText("Do not copy the legacy /design-system/tokens/page-header route CSS into consumers.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Page Header Structure Token", level: 1 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
