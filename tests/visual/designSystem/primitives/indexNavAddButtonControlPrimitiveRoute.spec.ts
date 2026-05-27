import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/index-nav-add-button-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav add button primitive route", () => {
  test("renders one governed add button and emits activation", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Add Button Control Primitive", level: 1 })).toBeVisible();
    const add = page.getByRole("button", { name: "Add" });
    await expect(add).toBeVisible();
    await add.focus();
    await add.click();
    await expect(page.getByText("Activation log: add-primary-index-item")).toBeVisible();

    const target = await add.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
