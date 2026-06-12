import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/sub-navigation";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function boxWithinStage(page: Page) {
  return page.evaluate(() => {
    const stage = document.querySelector(".sub-navigation-pattern-proof-stage");
    const menu = document.querySelector("[data-breadcrumb-trail-control-menu]:not([hidden])");
    if (!(stage instanceof HTMLElement) || !(menu instanceof HTMLElement)) {
      return false;
    }
    const stageBox = stage.getBoundingClientRect();
    const menuBox = menu.getBoundingClientRect();
    return menuBox.left >= stageBox.left - 1 && menuBox.right <= stageBox.right + 1;
  });
}

async function rtlHintMirrorsInsideSearch(page: Page) {
  return page.evaluate(() => {
    const slot = document.querySelector("[data-sub-navigation-slot]:not([hidden])");
    const search = slot?.querySelector("[data-search-shell-control]");
    const hint = search?.querySelector(".ds-search-shell-control-hint");
    const input = search?.querySelector("[data-search-field-control-input]");
    if (!(search instanceof HTMLElement) || !(hint instanceof HTMLElement) || !(input instanceof HTMLElement)) {
      return false;
    }
    const searchBox = search.getBoundingClientRect();
    const hintBox = hint.getBoundingClientRect();
    const inputBox = input.getBoundingClientRect();
    return (
      hintBox.left >= searchBox.left &&
      hintBox.right <= searchBox.right &&
      hintBox.left < inputBox.left + inputBox.width / 2
    );
  });
}

test.describe("sub-navigation pattern route", () => {
  test("renders canonical desktop, compressed, compact, mobile, theme, and direction states", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Sub Navigation Pattern", level: 1 })).toBeVisible();
    await expect(page.locator(".top-nav")).toHaveCSS("display", "grid");
    await expect(page.locator(".brand-mark")).toHaveCSS("width", "48px");
    const pattern = page.locator("[data-sub-navigation]");
    await expect(pattern).toBeVisible();
    await expect(pattern).toHaveAttribute("data-sub-navigation-mode", "auto");
    await expect(pattern.locator("[data-sub-navigation-slot='desktop']")).toBeVisible();
    await expect(pattern.locator("[data-breadcrumb-trail-control]:visible")).toHaveAttribute(
      "data-breadcrumb-trail-control-mode",
      "full",
    );
    await expect(pattern.locator("[data-search-shell-control]:visible")).toHaveAttribute(
      "data-search-shell-control-mode",
      "desktop",
    );

    await page.locator("[data-sub-navigation-mode-control]").selectOption("desktop");
    await expect(pattern.locator("[data-breadcrumb-trail-control]:visible")).toHaveAttribute(
      "data-breadcrumb-trail-control-mode",
      "full",
    );

    await page.locator("[data-sub-navigation-mode-control]").selectOption("compressed");
    await expect(pattern.locator("[data-breadcrumb-trail-control]:visible")).toHaveAttribute(
      "data-breadcrumb-trail-control-mode",
      "reduced-middle",
    );
    await expect(pattern.getByRole("button", { name: "Open hidden breadcrumb menu" })).toBeVisible();
    await expect(pattern.getByRole("link", { name: "Workspace" })).toHaveCount(0);
    await expect(pattern.getByRole("link", { name: "Projects" })).toHaveCount(0);
    await expect(pattern.getByRole("link", { name: "Design brief" })).toHaveCount(0);

    await page.locator("[data-sub-navigation-mode-control]").selectOption("compact");
    await expect(pattern.locator("[data-breadcrumb-trail-control]:visible")).toHaveAttribute(
      "data-breadcrumb-trail-control-mode",
      "compact",
    );
    await expect(pattern.getByRole("button", { name: "Open page structure menu" })).toBeVisible();
    await expect(pattern.locator(".ds-breadcrumb-trail-control-list:visible")).toHaveCount(0);

    await page.locator("[data-sub-navigation-mode-control]").selectOption("mobile");
    await expect(pattern.locator("[data-breadcrumb-trail-control]:visible")).toHaveCount(0);
    await expect(pattern.locator("[data-search-shell-control]:visible")).toHaveAttribute(
      "data-search-shell-control-mode",
      "mobile",
    );
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.locator("[data-sub-navigation-theme-control]").selectOption("dark");
    await expect(pattern).toHaveAttribute("data-sub-navigation-theme", "dark");
    await expect(pattern).toHaveAttribute("data-theme-scope", "dark");
    await expect(pattern).toHaveCSS("background-color", "rgb(16, 19, 24)");
    await page.locator("[data-sub-navigation-direction-control]").selectOption("rtl");
    await expect(pattern).toHaveAttribute("dir", "rtl");
  });

  test("auto mode responds to proof-stage width changes", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto(route);

    const pattern = page.locator("[data-sub-navigation]");
    await page.locator("[data-sub-navigation-mode-control]").selectOption("auto");
    await page.locator("[data-sub-navigation-width-control]").selectOption("wide");
    await expect(pattern).toHaveAttribute("data-sub-navigation-resolved-mode", "desktop");

    await page.locator("[data-sub-navigation-width-control]").selectOption("roomy");
    await expect(pattern).toHaveAttribute("data-sub-navigation-resolved-mode", "compressed");

    await page.locator("[data-sub-navigation-width-control]").selectOption("medium");
    await expect(pattern).toHaveAttribute("data-sub-navigation-resolved-mode", "compressed");

    await page.locator("[data-sub-navigation-width-control]").selectOption("compact");
    await expect(pattern).toHaveAttribute("data-sub-navigation-resolved-mode", "compact");
    await expect(pattern.getByRole("button", { name: "Open page structure menu" })).toBeVisible();

    await page.locator("[data-sub-navigation-width-control]").selectOption("mobile");
    await expect(pattern).toHaveAttribute("data-sub-navigation-resolved-mode", "mobile");
    await expect(pattern.locator("[data-search-shell-control]:visible")).toHaveAttribute(
      "data-search-shell-control-mode",
      "mobile",
    );
  });

  test("compact RTL mirrors breadcrumb menu and search hint inside the row", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);

    const pattern = page.locator("[data-sub-navigation]");
    await page.locator("[data-sub-navigation-width-control]").selectOption("compact");
    await page.locator("[data-sub-navigation-theme-control]").selectOption("dark");
    await page.locator("[data-sub-navigation-direction-control]").selectOption("rtl");
    await page.locator("[data-sub-navigation-search-state-control]").selectOption("active");

    await expect(pattern).toHaveAttribute("data-sub-navigation-resolved-mode", "compact");
    await expect(pattern.locator("[data-search-shell-control]:visible")).toHaveAttribute(
      "data-search-shell-control-mode",
      "compressed",
    );
    await expect(pattern.locator(".ds-search-shell-control-hint:visible")).toBeVisible();
    await expect.poll(() => rtlHintMirrorsInsideSearch(page)).toBe(true);

    await pattern.getByRole("button", { name: "Open page structure menu" }).click();
    await expect(pattern.locator("[data-breadcrumb-trail-control-menu]:visible")).toBeVisible();
    await expect.poll(() => boxWithinStage(page)).toBe(true);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
