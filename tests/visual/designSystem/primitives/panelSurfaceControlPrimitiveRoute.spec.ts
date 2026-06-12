import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/panel-surface-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("panel-surface-control primitive route", () => {
  test("review controls prove state and width variants", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Panel Surface Control Primitive", level: 1 })).toBeVisible();
    const surface = page.locator("[data-panel-surface-control]").first();
    await expect(surface).toHaveAttribute("data-panel-surface-control-state", "active");

    await page.locator("[data-panel-surface-state-control]").selectOption("covered");
    await expect(surface).toHaveAttribute("data-panel-surface-control-state", "covered");

    await page.locator("[data-panel-surface-width-control]").selectOption("double");
    await expect(page.locator("[data-panel-surface-proof-width]")).toHaveAttribute("data-panel-surface-proof-width", "double");

    await page.locator("[data-panel-surface-state-control]").selectOption("hidden");
    await expect(surface).toHaveAttribute("data-panel-surface-control-state", "hidden");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
