import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/menu-simple-select-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("menu-simple-select-control primitive route", () => {
  test("proves theme variants and mobile menu overlay behavior", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Menu Simple Select Control", level: 1 })).toBeVisible();
    await page.locator("[data-menu-select-proof-control='theme']").selectOption("dark");
    await page.locator("[data-menu-select-proof-control='direction']").selectOption("rtl");
    await page.locator("[data-menu-select-proof-control='viewport']").selectOption("mobile");

    const proofStage = page.locator("[data-menu-select-proof-viewport]").first();
    await expect(proofStage).toHaveAttribute("data-theme-scope", "dark");
    await expect(proofStage).toHaveAttribute("dir", "rtl");
    await expect(proofStage).toHaveAttribute("data-menu-select-proof-viewport", "mobile");

    const trigger = page.locator("[data-menu-simple-select-trigger]").first();
    await trigger.click();
    const menu = page.locator("[data-menu-simple-select-menu]").first();
    await expect(menu).toBeVisible();
    await expect(menu).toHaveCSS("position", "fixed");
    const menuBox = await menu.boundingBox();
    expect(menuBox).not.toBeNull();
    expect(Math.round(menuBox?.width ?? 0)).toBe(390);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
