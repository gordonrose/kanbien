import { expect, test } from "@playwright/test";

const route = "/design-system/default/patterns/top-navigation";

test.describe("top navigation pattern route", () => {
  test("defaults to auto resize and does not squeeze desktop items at review viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto(route);

    const pattern = page.locator("[data-top-navigation]");
    await expect(page.locator("[data-top-navigation-mode-control]")).toHaveValue("auto");
    await expect(pattern).not.toHaveAttribute("data-top-navigation-resolved-mode", "mobile");
    const proofStageBox = await page.locator(".top-navigation-pattern-proof-stage").evaluate((stage) => {
      const box = stage.getBoundingClientRect();
      return { left: Math.round(box.left), right: Math.round(box.right), width: Math.round(box.width) };
    });
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(proofStageBox.left).toBe(0);
    expect(Math.abs(proofStageBox.right - viewportWidth)).toBeLessThanOrEqual(1);
    await expect(pattern.locator("[data-top-navigation-region='primary'] [data-top-navigation-link-control]:visible")).toHaveCount(7);
    const primaryWidths = await pattern
      .locator("[data-top-navigation-region='primary'] [data-top-navigation-link-control]:visible")
      .evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().width)));
    expect(primaryWidths.every((width) => width >= 112)).toBe(true);
    await expect(pattern.locator("[data-top-navigation-region='utility'] [data-top-navigation-trigger-control]")).toHaveCount(1);
  });

  test("renders desktop, overflow, mobile, theme, and direction compositions from governed primitives", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 760 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Top Navigation Pattern", level: 1 })).toBeVisible();
    const pattern = page.locator("[data-top-navigation]");
    await expect(pattern).toBeVisible();
    await expect(pattern.locator("[data-top-navigation-brand-control]")).toHaveCount(1);
    await expect(pattern.locator("[data-top-navigation-region='primary'] [data-top-navigation-link-control]")).toHaveCount(7);
    await expect(pattern.locator("[data-top-navigation-region='utility'] [data-top-navigation-trigger-control]")).toHaveCount(1);
    await expect(pattern.getByRole("link", { name: "Build" })).toHaveAttribute("aria-current", "page");

    await page.locator("[data-top-navigation-mode-control]").selectOption("overflow");
    await expect(pattern.locator("[data-top-navigation-region='primary'] [data-top-navigation-link-control]")).toHaveCount(2);
    await expect(pattern.getByRole("button", { name: "More", exact: true })).toBeVisible();
    await expect(pattern.getByRole("button", { name: "More", exact: true })).toHaveAttribute("aria-expanded", "false");

    await page.locator("[data-top-navigation-open-control]").selectOption("overflow");
    await expect(pattern.getByRole("button", { name: "More", exact: true })).toHaveAttribute("aria-expanded", "true");
    const more = pattern.getByRole("button", { name: "More", exact: true });
    const overflowMenu = pattern.locator("[data-top-navigation-surface='overflow']");
    await expect(overflowMenu).toBeVisible();
    const alignment = await more.evaluate((button) => {
      const menu = button.closest("[data-top-navigation]")?.querySelector("[data-top-navigation-surface='overflow']");
      const buttonBox = button.getBoundingClientRect();
      const menuBox = menu?.getBoundingClientRect();
      return menuBox ? Math.abs(buttonBox.right - menuBox.right) : Number.POSITIVE_INFINITY;
    });
    expect(alignment).toBeLessThanOrEqual(2);

    await page.locator("[data-top-navigation-theme-control]").selectOption("dark");
    await expect(pattern).toHaveAttribute("data-top-navigation-theme", "dark");
    await page.locator("[data-top-navigation-direction-control]").selectOption("rtl");
    await expect(pattern).toHaveAttribute("dir", "rtl");

    await page.locator("[data-top-navigation-mode-control]").selectOption("mobile");
    await expect(pattern.locator("[data-top-navigation-region='primary']")).toBeHidden();
    await expect(pattern.getByRole("button", { name: "Menu", exact: true })).toBeVisible();
    await page.locator("[data-top-navigation-open-control]").selectOption("mobile");
    const mobileMenu = pattern.locator("[data-top-navigation-surface='mobile']");
    await expect(mobileMenu).toBeVisible();
    const mobileMenuBox = await mobileMenu.evaluate((menu) => {
      const box = menu.getBoundingClientRect();
      return { left: Math.round(box.left), right: Math.round(box.right), width: Math.round(box.width) };
    });
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(mobileMenuBox.left).toBe(0);
    expect(Math.abs(mobileMenuBox.right - viewportWidth)).toBeLessThanOrEqual(1);
    expect(Math.abs(mobileMenuBox.width - viewportWidth)).toBeLessThanOrEqual(1);
  });

  test("auto mode responds to proof-stage resize without manual mode switching", async ({ page }) => {
    await page.setViewportSize({ width: 2400, height: 760 });
    await page.goto(route);

    const pattern = page.locator("[data-top-navigation]");
    await page.locator("[data-top-navigation-mode-control]").selectOption("auto");
    await page.locator("[data-top-navigation-width-control]").selectOption("wide");
    await expect(pattern).toHaveAttribute("data-top-navigation-resolved-mode", "desktop");
    await expect(pattern.getByRole("button", { name: "More", exact: true })).toBeHidden();
    await expect(pattern.locator("[data-top-navigation-item-slot='primary']:visible")).toHaveCount(7);

    await page.locator("[data-top-navigation-width-control]").selectOption("roomy");
    await expect(pattern).toHaveAttribute("data-top-navigation-resolved-mode", "overflow");
    await expect(pattern.locator("[data-top-navigation-item-slot='primary']:visible")).toHaveCount(5);

    await page.locator("[data-top-navigation-width-control]").selectOption("medium");
    await expect(pattern).toHaveAttribute("data-top-navigation-resolved-mode", "overflow");
    await expect(pattern.getByRole("button", { name: "More", exact: true })).toBeVisible();
    await expect(pattern.locator("[data-top-navigation-item-slot='primary']:visible")).toHaveCount(4);
    await expect(pattern.locator("[data-top-navigation-region='primary'] [data-top-navigation-link-control]:visible")).toHaveCount(4);
    const primaryWidths = await pattern
      .locator("[data-top-navigation-region='primary'] [data-top-navigation-link-control]:visible")
      .evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().width)));
    expect(primaryWidths.every((width) => width >= 112)).toBe(true);

    await page.locator("[data-top-navigation-width-control]").selectOption("compact");
    await expect(pattern).toHaveAttribute("data-top-navigation-resolved-mode", "overflow");
    await expect(pattern.locator("[data-top-navigation-item-slot='primary']:visible")).toHaveCount(3);

    await page.locator("[data-top-navigation-width-control]").selectOption("tight");
    await expect(pattern).toHaveAttribute("data-top-navigation-resolved-mode", "overflow");
    await expect(pattern.locator("[data-top-navigation-item-slot='primary']:visible")).toHaveCount(2);
    await pattern.getByRole("button", { name: "More", exact: true }).click();
    await expect(pattern.locator("[data-top-navigation-surface='overflow']").getByRole("link", { name: "Imports" })).toBeVisible();
    await expect(pattern.locator("[data-top-navigation-surface='overflow']").getByRole("link", { name: "Administration" })).toBeVisible();

    await page.locator("[data-top-navigation-width-control]").selectOption("narrow");
    await expect(pattern).toHaveAttribute("data-top-navigation-resolved-mode", "mobile");
    await expect(pattern.locator("[data-top-navigation-region='primary']")).toBeHidden();
    await expect(pattern.getByRole("button", { name: "Menu", exact: true })).toBeVisible();
  });

  test("closes an open transient surface with Escape and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 760 });
    await page.goto(route);
    await page.locator("[data-top-navigation-mode-control]").selectOption("overflow");

    const more = page.getByRole("button", { name: "More", exact: true });
    await more.click();
    await expect(more).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(more).toHaveAttribute("aria-expanded", "false");
    await expect(more).toBeFocused();
  });
});
