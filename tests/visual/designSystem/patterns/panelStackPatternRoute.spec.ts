import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/panel-stack";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("panel-stack pattern route", () => {
  test("review controls prove desktop and mobile overlay stacking", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Panel Stack Pattern", level: 1 })).toBeVisible();
    await page.locator("[data-panel-stack-origin-control]").selectOption("left");
    await page.locator("[data-panel-stack-viewport-control]").selectOption("mobile");
    await page.locator("[data-panel-stack-count-control]").selectOption("2");
    await page.locator("[data-panel-stack-active-control]").selectOption("secondary");

    const stack = page.locator("[data-panel-stack]").first();
    await expect(stack).toHaveAttribute("data-panel-stack-origin", "left");
    await expect(stack).toHaveAttribute("data-panel-stack-viewport", "mobile");
    await expect(stack).toHaveAttribute("data-panel-stack-active-panel", "secondary");
    await expect(page.locator("[data-panel-surface-control]")).toHaveCount(2);

    const stackBox = await stack.boundingBox();
    expect(stackBox).not.toBeNull();
    expect(Math.round(stackBox?.width ?? 0)).toBeLessThanOrEqual(390);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
