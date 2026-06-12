import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/search-field-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("search-field-control primitive route", () => {
  test("renders a native search input with theme-specific text-control frame tokens", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Search Field Control Primitive", level: 1 })).toBeVisible();
    const input = page.getByRole("searchbox", { name: "Search options" });
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("type", "search");
    await expect(page.getByText("--text-control-frame-default-original")).toBeVisible();

    await page.locator("[data-search-field-theme-control]").selectOption("dark");
    await expect(page.getByText("--text-control-frame-default-dark")).toBeVisible();
    await expect(input).toHaveCSS("background-color", "rgb(23, 27, 34)");
    await expect(input).toHaveCSS("color", "rgb(244, 247, 251)");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("review controls prove state, label, value, direction, and width variants", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-search-field-state-control]").selectOption("disabled");
    await page.locator("[data-search-field-label-control]").selectOption("long");
    await page.locator("[data-search-field-value-control]").selectOption("long");
    await page.locator("[data-search-field-direction-control]").selectOption("rtl");
    await page.locator("[data-search-field-width-control]").selectOption("narrow");

    const input = page.getByRole("searchbox");
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue("record management page with long search query text");
    await expect(page.locator("[data-search-field-review-width]").first()).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-search-field-review-width]").first()).toHaveAttribute("data-search-field-review-width", "narrow");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
