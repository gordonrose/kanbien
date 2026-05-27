import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/resize-handle-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("resize handle control primitive route", () => {
  test("resizes with keyboard and clamps to supplied min and max", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Resize Handle Control Primitive", level: 1 })).toBeVisible();
    const handle = page.getByRole("separator", { name: "Resize sample panel" });
    const panel = page.locator("#resize-handle-proof-panel");
    const rail = page.locator(".ds-resize-handle-control-rail").first();

    await expect(handle).toHaveAttribute("aria-valuemin", "10rem");
    await expect(handle).toHaveAttribute("aria-valuemax", "32rem");
    await expect(rail).toHaveCSS("border-radius", "999px");

    await handle.focus();
    await page.keyboard.press("End");
    await expect(handle).toHaveAttribute("aria-valuenow", "512px");
    await expect.poll(() => panel.evaluate((element) => Math.round(element.getBoundingClientRect().width))).toBe(512);

    await page.keyboard.press("Home");
    await expect(handle).toHaveAttribute("aria-valuenow", "160px");
    await expect.poll(() => panel.evaluate((element) => Math.round(element.getBoundingClientRect().width))).toBe(160);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
