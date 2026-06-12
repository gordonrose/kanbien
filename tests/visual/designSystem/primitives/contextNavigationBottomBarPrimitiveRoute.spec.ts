import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/context-navigation-bottom-bar";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("context navigation bottom bar primitive route", () => {
  test("renders a viewport-pinned token-backed mobile bottom bar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Context Navigation Bottom Bar Primitive", level: 1 })).toBeVisible();
    const bar = page.locator("[data-context-navigation-bottom-bar]").first();
    await expect(bar).toBeVisible();
    await expect(bar).toHaveAttribute("aria-label", "Context navigation");
    await expect(bar).toHaveCSS("position", "fixed");
    await expect(page.getByText("--context-navigation-frame")).toBeVisible();
    await expect(page.getByText("bottom bar remains fixed to the visual viewport bottom during document scroll and page-end pressure")).toBeVisible();

    const topBox = await bar.boundingBox();
    await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight / 2)));
    const middleBox = await bar.boundingBox();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const bottomBox = await bar.boundingBox();
    expect(topBox?.y).toBeCloseTo(middleBox?.y ?? 0, 1);
    expect(topBox?.y).toBeCloseTo(bottomBox?.y ?? 0, 1);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
