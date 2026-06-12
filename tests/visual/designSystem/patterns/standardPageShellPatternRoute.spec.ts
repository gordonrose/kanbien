import { expect, test } from "@playwright/test";

const route = "/design-system/default/patterns/standard-page-shell";

test.describe("standard-page-shell pattern route", () => {
  test("renders shell by composing governed child pattern seams", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Standard Page Shell Pattern", level: 1 })).toBeVisible();
    await expect(page.locator(".top-nav")).toHaveCSS("display", "grid");
    await expect(page.locator(".brand-mark")).toHaveCSS("width", "48px");
    const shell = page.locator("[data-standard-page-shell]");
    await expect(shell).toBeVisible();
    await expect(shell.locator("[data-top-navigation]")).toHaveCount(1);
    await expect(shell.locator("[data-sub-navigation]")).toHaveCount(1);
    await expect(shell.locator("[data-context-navigation]")).toHaveCount(1);
    await expect(shell.locator("[data-tools-navigation]")).toHaveCount(1);
    await expect(shell.locator("[data-breadcrumb-trail-control]:visible")).toHaveCount(1);
    await expect(shell.locator("[data-search-shell-control]")).toHaveCount(4);

    await page.locator("[data-standard-page-shell-mode-control]").selectOption("compressed");
    await expect(shell).toHaveAttribute("data-standard-page-shell-mode", "compressed");
    await expect(shell.locator("[data-sub-navigation]")).toHaveAttribute("data-sub-navigation-mode", "compressed");

    await page.locator("[data-standard-page-shell-theme-control]").selectOption("desert");
    await expect(shell).toHaveAttribute("data-standard-page-shell-theme", "desert");
    await expect(shell.locator("[data-sub-navigation]")).toHaveAttribute("data-sub-navigation-theme", "desert");
    await page.locator("[data-standard-page-shell-direction-control]").selectOption("rtl");
    await expect(shell).toHaveAttribute("dir", "rtl");
    await expect(shell.locator("[data-sub-navigation]")).toHaveAttribute("dir", "rtl");
  });

  test("mobile shell keeps secondary search full width and tools navigation hidden", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.locator("[data-standard-page-shell-mode-control]").selectOption("mobile");
    await page.locator("[data-standard-page-shell-width-control]").selectOption("mobile");

    const shell = page.locator("[data-standard-page-shell]");
    await expect(shell).toHaveAttribute("data-standard-page-shell-mode", "mobile");
    await expect(shell.locator("[data-sub-navigation]")).toHaveAttribute("data-sub-navigation-mode", "mobile");
    await expect(shell.locator("[data-search-shell-control]:visible")).toHaveAttribute(
      "data-search-shell-control-mode",
      "mobile",
    );
    await expect(shell.locator("[data-tools-navigation-region='desktop-rail']")).toBeHidden();
  });
});
