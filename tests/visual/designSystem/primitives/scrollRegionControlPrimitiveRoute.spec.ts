import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/scroll-region-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("scroll region control primitive route", () => {
  test("renders a styled governed scroll region from signed tokens", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Scroll Region Control Primitive", level: 1 })).toBeVisible();
    const region = page.locator("[data-scroll-region-control]").first();
    await expect(region).toBeVisible();
    await expect(region).toHaveCSS("overflow-y", "auto");
    await expect(region).toHaveCSS("scrollbar-width", "thin");

    const scrollState = await region.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(scrollState.scrollHeight).toBeGreaterThan(scrollState.clientHeight);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(16);
  });

  test("keeps mobile page-scroll mode visibly distinct from internal-scroll mode", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const region = page.locator("[data-scroll-region-control]").first();
    await expect(region).toHaveAttribute("data-scroll-region-control-mobile-mode", "page-scroll");

    await page.locator("[data-index-nav-scroll-region-mobile-control]").selectOption("internal-scroll");
    await expect(region).toHaveAttribute("data-scroll-region-control-mobile-mode", "internal-scroll");
    await expect(region).toHaveCSS("overflow-y", "auto");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(16);
  });
});
