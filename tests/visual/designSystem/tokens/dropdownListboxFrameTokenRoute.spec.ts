import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/dropdown-listbox-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("dropdown-listbox-frame token route", () => {
  test("renders themed listbox popup frame and scroll values", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Dropdown Listbox Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--dropdown-listbox-frame-original")).toBeVisible();
    await expect(page.getByText("--dropdown-listbox-frame-dark")).toBeVisible();
    await expect(page.getByText("min(70vh, 22rem)").first()).toBeVisible();
    await expect(page.getByText("internal block-axis scroll").first()).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
