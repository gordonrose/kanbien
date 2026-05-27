import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/icon-size";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("icon size token route", () => {
  test("renders governed icon-size proof without treating it as target size", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Icon Size Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--icon-button-glyph-size")).toBeVisible();
    await expect(page.getByText("1rem", { exact: true }).first()).toBeVisible();
    const glyph = page.locator(".token-spec-icon-size-sample").first();
    const glyphBox = await glyph.evaluate((element) => element.getBoundingClientRect());
    expect(glyphBox.width).toBeGreaterThanOrEqual(15);
    expect(glyphBox.width).toBeLessThanOrEqual(17);
    await expect(page.getByText("This token does not approve icon-button frame, focus, action semantics, or target size.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
