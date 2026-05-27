import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/resize-handle";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("resize handle token route", () => {
  test("renders the governed resize-handle affordance values", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Resize Handle Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--resize-handle-inline-default")).toBeVisible();
    await expect(page.getByText("0.75rem hit area")).toBeVisible();
    await expect(page.getByText("999px", { exact: true })).toBeVisible();
    await expect(page.getByText("col-resize").first()).toBeVisible();
    await expect(page.getByText("primary source 36%").first()).toBeVisible();
    await expect(page.getByText("panel width constraints are inherited")).toBeVisible();
    await expect(page.locator(".token-spec-resize-hit-area").first()).toHaveCSS("cursor", "col-resize");
    await expect(page.locator(".token-spec-resize-rail").first()).toHaveCSS("border-radius", "999px");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
