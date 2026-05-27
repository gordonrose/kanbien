import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/index-nav-panel-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav panel frame token route", () => {
  test("renders governed panel frame token proof without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Panel Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--index-nav-panel-frame")).toBeVisible();
    await expect(page.getByText("--index-nav-panel-action-frame")).toBeVisible();
    await expect(page.getByText("10rem", { exact: true })).toBeVisible();
    await expect(page.getByText("13rem", { exact: true })).toBeVisible();
    await expect(page.getByText("26rem", { exact: true })).toBeVisible();
    await expect(page.getByText("32rem", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("--panel-corner-radius-flush")).toBeVisible();
    await expect(page.locator(".token-spec-surface-card-preview").first()).toHaveCSS("border-radius", "0px");
    const resizeInput = page.locator("[data-token-diagnostic-inline-size-input]");
    const resizePreview = page.locator("[data-token-diagnostic-inline-size-preview]");
    await expect(resizeInput).toHaveAttribute("min", "10");
    await expect(resizeInput).toHaveAttribute("max", "32");
    const initialWidth = await resizePreview.evaluate((element) => element.getBoundingClientRect().width);
    await resizeInput.fill("24");
    const resizedWidth = await resizePreview.evaluate((element) => element.getBoundingClientRect().width);
    expect(resizedWidth).toBeGreaterThan(initialWidth * 1.5);
    await expect(page.getByText("Rendered review width: 24rem")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Index Nav Panel Frame Token", level: 1 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
