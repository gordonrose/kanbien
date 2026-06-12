import { expect, test } from "@playwright/test";

test.describe("context-navigation-overflow-menu primitive route", () => {
  test("opens and closes the More menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/design-system/default/primitives/context-navigation-overflow-menu");

    await expect(page.getByRole("heading", { name: "Context Navigation Overflow Menu Primitive" })).toBeVisible();
    await page.getByRole("button", { name: "More" }).click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    const audit = page.getByRole("menuitem", { name: "Audit" });
    await expect(audit).toHaveClass(/menu-item/);
    await expect(audit.locator(".ds-context-navigation-item-control-icon")).toHaveCount(0);
    await expect(audit.locator(".ds-context-navigation-item-control-label")).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });
});
