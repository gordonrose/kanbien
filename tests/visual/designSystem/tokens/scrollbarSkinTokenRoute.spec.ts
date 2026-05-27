import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/scrollbar-skin";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("scrollbar skin token route", () => {
  test("renders the signed scrollbar skin token proof", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Scrollbar Skin Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--scrollbar-skin-primary")).toBeVisible();
    await expect(page.getByText("primary-color-source")).toBeVisible();
    await expect(page.getByText(/thumb mixes primary source/)).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Primary colour source" })).toBeVisible();

    const preview = page.locator(".token-spec-scrollbar-preview").first();
    await expect(preview).toBeVisible();
    await expect(preview).toHaveCSS("scrollbar-width", "thin");

    await page.getByRole("textbox", { name: "Primary colour source" }).fill("#008755");
    await expect(page.locator("[data-token-diagnostic-source-value]")).toHaveText("#008755");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Scrollbar Skin Token", level: 1 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
