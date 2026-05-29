import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/body-region-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("body region control primitive route", () => {
  test("renders a labelled token-backed body region with governed scroll composition", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Body Region Control Primitive", level: 1 })).toBeVisible();
    const region = page.locator("[data-body-region-control]").first();
    const scrollRegion = region.locator("[data-scroll-region-control]").first();
    await expect(region).toBeVisible();
    await expect(region).toHaveAttribute("aria-label", "Entity body content");
    await expect(region).toHaveAttribute("data-body-region-control-state", "default");
    await expect(scrollRegion).toBeVisible();
    await expect(scrollRegion).toHaveCSS("overflow-y", "auto");
    await expect(page.getByText("--body-region-frame")).toBeVisible();
    await expect(page.getByText("scroll-region-control", { exact: true })).toBeVisible();

    await expect
      .poll(() =>
        region.evaluate((element) => ({
          maxInlineSize: window.getComputedStyle(element).maxInlineSize,
          minInlineSize: window.getComputedStyle(element).minInlineSize,
        })),
      )
      .toMatchObject({ maxInlineSize: "100%", minInlineSize: "min(100%, 416px)" });
    await expect
      .poll(() =>
        scrollRegion.evaluate((element) => ({
          maxHeight: window.getComputedStyle(element).maxHeight,
          overflowY: window.getComputedStyle(element).overflowY,
        })),
      )
      .toMatchObject({ maxHeight: "512px", overflowY: "auto" });
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("exposes review controls for loading semantics and mobile scroll posture", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const region = page.locator("[data-body-region-control]").first();
    const scrollRegion = region.locator("[data-scroll-region-control]").first();
    await page.locator("[data-body-region-state-control]").selectOption("loading");
    await expect(region).toHaveAttribute("data-body-region-control-state", "loading");
    await expect(region).toHaveAttribute("aria-busy", "true");
    await expect(page.locator("[data-body-region-state-evidence]")).toContainText("sets aria-busy=true");
    await expect.poll(() => scrollRegion.evaluate((element) => element.children.length)).toBe(0);

    await page.locator("[data-body-region-state-control]").selectOption("blocked-foundation");
    await expect(region).toHaveAttribute("data-body-region-control-state", "blocked-foundation");
    await expect(page.locator("[data-body-region-state-evidence]")).toContainText("renders no child content");
    await expect.poll(() => scrollRegion.evaluate((element) => element.children.length)).toBe(0);

    await page.locator("[data-body-region-state-control]").selectOption("empty");
    await expect(region).toHaveAttribute("data-body-region-control-state", "empty");
    await expect(page.locator("[data-body-region-state-evidence]")).toContainText("renders no child content");
    await expect.poll(() => scrollRegion.evaluate((element) => element.children.length)).toBe(0);

    await page.locator("[data-body-region-mobile-control]").selectOption("internal-scroll");
    await expect(scrollRegion).toHaveAttribute("data-scroll-region-control-mobile-mode", "internal-scroll");
    await expect(scrollRegion).toHaveCSS("overflow-y", "auto");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
