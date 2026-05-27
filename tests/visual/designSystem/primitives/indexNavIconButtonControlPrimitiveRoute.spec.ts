import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/index-nav-icon-button-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav icon button control primitive route", () => {
  test("renders accessible icon-only button with signed glyph and target sizing", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Icon Button Control Primitive", level: 1 })).toBeVisible();
    const button = page.getByRole("button", { name: "Add index item" });
    await expect(button).toBeVisible();
    const geometry = await button.evaluate((element) => {
      const glyph = element.querySelector("svg");
      const box = element.getBoundingClientRect();
      const glyphBox = glyph?.getBoundingClientRect();
      return {
        width: box.width,
        height: box.height,
        glyphWidth: glyphBox?.width ?? 0,
        ariaHidden: glyph?.getAttribute("aria-hidden") ?? "",
      };
    });
    expect(geometry.width).toBeGreaterThanOrEqual(44);
    expect(geometry.height).toBeGreaterThanOrEqual(44);
    expect(geometry.glyphWidth).toBeGreaterThanOrEqual(15);
    expect(geometry.glyphWidth).toBeLessThanOrEqual(17);
    expect(geometry.ariaHidden).toBe("true");

    await button.click();
    await expect(page.getByText("Activation log: add-index-item")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
