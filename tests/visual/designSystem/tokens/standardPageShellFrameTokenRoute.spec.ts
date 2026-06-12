import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/standard-page-shell-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("standard page shell frame token route", () => {
  test("renders signed shell frame values and mobile inset evidence", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Standard Page Shell Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--standard-page-shell-frame")).toBeVisible();
    await expect(page.locator(".token-spec-shell-frame-preview").first()).toBeVisible();
    await expect(page.locator(".token-spec-shell-frame-diagram--desktop").first()).toBeVisible();
    await expect(page.locator(".token-spec-shell-frame-diagram--mobile").first()).toBeVisible();
    await expect(page.getByText("Top nav").first()).toBeVisible();
    await expect(page.getByText("Sub nav").first()).toBeVisible();
    await expect(page.getByText("Context rail").first()).toBeVisible();
    await expect(page.getByText("Drawer").first()).toBeVisible();
    await expect(page.getByText("Tools zone").first()).toBeVisible();
    await expect(page.getByText("Bottom context bar").first()).toBeVisible();
    await expect(page.getByText("2147481000", { exact: true })).toBeVisible();
    await expect(page.getByText("2147483000", { exact: true })).toBeVisible();
    await expect(page.getByText("4.25rem", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("2.75rem", { exact: true })).toBeVisible();
    await expect(page.getByText("min(22rem, calc(100vw - 4.25rem))", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Tools navigation concrete sizing and placement must be governed").first()).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByText("5.75rem", { exact: true })).toBeVisible();
    await expect(page.getByText("calc(4.125rem + env(safe-area-inset-bottom, 0))", { exact: true })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
