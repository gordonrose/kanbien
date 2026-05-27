import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/panel-corner-radius";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("panel corner radius token route", () => {
  test("renders the flush panel radius proof without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Panel Corner Radius Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--panel-corner-radius-flush")).toBeVisible();
    await expect(page.getByText("flush panel corner radius")).toBeVisible();

    const sample = page.locator(".token-spec-radius-sample").first();
    await expect(sample).toBeVisible();
    await expect(sample).toHaveCSS("border-radius", "0px");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Panel Corner Radius Token", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-radius-sample").first()).toHaveCSS("border-radius", "0px");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
