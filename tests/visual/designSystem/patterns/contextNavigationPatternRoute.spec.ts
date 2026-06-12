import { expect, test } from "@playwright/test";

test.describe("context-navigation pattern route", () => {
  test("renders desktop rail and mobile bottom-bar composition", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/design-system/default/patterns/context-navigation");

    await expect(page.getByRole("heading", { name: "Context Navigation Pattern" })).toBeVisible();
    await expect(page.locator("[data-context-navigation-region='desktop-rail']")).toBeVisible();
    await expect(page.locator("[data-context-navigation-bottom-bar]")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Overview" }).first()).toHaveAttribute("aria-current", "page");
    const desktopOverviewLabel = page
      .locator("[data-context-navigation-region='desktop-rail']")
      .getByRole("link", { name: "Overview" })
      .locator(".ds-context-navigation-item-control-label");
    const desktopOverviewItem = page
      .locator("[data-context-navigation-region='desktop-rail']")
      .getByRole("link", { name: "Overview" });
    await expect(desktopOverviewLabel).toHaveCSS("display", "none");
    await expect
      .poll(async () => {
        return desktopOverviewItem.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return Math.abs(rect.width - rect.height) <= 1 && rect.width >= 44;
        });
      })
      .toBe(true);

    await page.locator("[data-context-navigation-viewport-control]").selectOption("mobile");
    await expect(page.locator("[data-context-navigation-region='mobile-bottom-bar']")).toBeVisible();

    await page.getByRole("button", { name: "More" }).click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    const bottomBar = page.locator("[data-context-navigation-region='mobile-bottom-bar']");
    const menuItem = page.getByRole("menuitem", { name: "Tokens" });
    const [menuBox, barBox, menuItemBox, menuItemDisplay, menuItemPadding] = await Promise.all([
      menu.boundingBox(),
      bottomBar.boundingBox(),
      menuItem.boundingBox(),
      menuItem.evaluate((element) => getComputedStyle(element).display),
      menuItem.evaluate((element) => getComputedStyle(element).paddingBlockStart),
    ]);
    expect((menuBox?.y ?? 0) + (menuBox?.height ?? 0)).toBeLessThanOrEqual((barBox?.y ?? 0) + 4);
    expect(menuItemBox?.width ?? 0).toBeGreaterThan(120);
    expect(menuItemDisplay).toBe("block");
    expect(menuItemPadding).not.toBe("0px");
    await expect(menuItem.locator(".ds-context-navigation-item-control-icon")).toHaveCount(0);
    await expect(menuItem.locator(".ds-context-navigation-item-control-label")).toHaveCount(0);
    await page.getByRole("menuitem", { name: "Access" }).click();
    await expect(page.getByText("Activation log: accessibility")).toBeVisible();
  });
});
