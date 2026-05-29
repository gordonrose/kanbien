import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/entity-body-panel";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("entity body panel pattern route", () => {
  test("renders the governed body panel pattern and width evidence", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Entity Body Panel Pattern", level: 1 })).toBeVisible();
    const panel = page.locator("[data-entity-body-panel]").first();
    const region = page.locator("[data-body-region-control]").first();
    await expect(panel).toHaveAttribute("data-entity-body-panel-state", "default");
    await expect(region).toHaveAttribute("aria-label", "Entity body content");
    await expect(page.getByText("body-region-control", { exact: true })).toBeVisible();
    await expect(page.getByText("--body-region-frame")).toBeVisible();
    await expect(page.getByText("26rem", { exact: true })).toBeVisible();

    await page.locator("[data-entity-body-panel-width-control]").selectOption("squeezed");
    await expect(page.locator("[data-entity-body-panel-proof-host]")).toHaveAttribute(
      "data-entity-body-panel-proof-width",
      "squeezed",
    );
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps empty, loading, and blocked states honest", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const panel = page.locator("[data-entity-body-panel]").first();
    const scrollRegion = page.locator("[data-body-region-control] [data-scroll-region-control]").first();

    await page.locator("[data-entity-body-panel-state-control]").selectOption("empty");
    await expect(panel).toHaveAttribute("data-entity-body-panel-state", "empty");
    await expect(page.locator("[data-entity-body-panel-state-evidence]")).toContainText("renders no body children");
    await expect.poll(() => scrollRegion.evaluate((element) => element.children.length)).toBe(0);

    await page.locator("[data-entity-body-panel-state-control]").selectOption("loading");
    await expect(page.locator("[data-body-region-control]").first()).toHaveAttribute("aria-busy", "true");
    await expect.poll(() => scrollRegion.evaluate((element) => element.children.length)).toBe(0);

    await page.locator("[data-entity-body-panel-state-control]").selectOption("blocked-foundation");
    await expect(page.locator("[data-entity-body-panel-state-evidence]")).toContainText("renders no body children");
    await expect.poll(() => scrollRegion.evaluate((element) => element.children.length)).toBe(0);

    await page.locator("[data-entity-body-panel-mobile-control]").selectOption("internal-scroll");
    await expect(scrollRegion).toHaveAttribute("data-scroll-region-control-mobile-mode", "internal-scroll");
    await page.locator("[data-entity-body-panel-direction-control]").selectOption("rtl");
    await expect(page.locator("[data-entity-body-panel-proof-host]")).toHaveAttribute("dir", "rtl");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
