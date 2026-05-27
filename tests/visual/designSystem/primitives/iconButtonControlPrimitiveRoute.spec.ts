import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/icon-button-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("icon button control primitive route", () => {
  test("renders accessible icon-only button with signed glyph and target sizing", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Icon Button Control Primitive", level: 1 })).toBeVisible();
    const button = page.getByRole("button", { name: "Add item" });
    await expect(button).toBeVisible();
    const geometry = await button.evaluate((element) => {
      const glyph = element.querySelector("svg");
      const box = element.getBoundingClientRect();
      const glyphBox = glyph?.getBoundingClientRect();
      const visualFrame = getComputedStyle(element, "::before");
      return {
        width: box.width,
        height: box.height,
        glyphWidth: glyphBox?.width ?? 0,
        ariaHidden: glyph?.getAttribute("aria-hidden") ?? "",
        visualInset: visualFrame.insetBlockStart,
        visualBackground: visualFrame.backgroundColor,
      };
    });
    expect(geometry.width).toBeGreaterThanOrEqual(44);
    expect(geometry.height).toBeGreaterThanOrEqual(44);
    expect(geometry.visualInset).toBe("4px");
    expect(geometry.visualBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(geometry.glyphWidth).toBeGreaterThanOrEqual(15);
    expect(geometry.glyphWidth).toBeLessThanOrEqual(17);
    expect(geometry.ariaHidden).toBe("true");

    await button.click();
    await expect(page.getByText("Activation log: add-item")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
