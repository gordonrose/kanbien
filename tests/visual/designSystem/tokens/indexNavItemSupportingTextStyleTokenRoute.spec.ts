import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/index-nav-item-supporting-text-style";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav item supporting text style token route", () => {
  test("renders the signed supporting text typography proof", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Item Supporting Text Style Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--index-nav-item-supporting-text-style-default")).toBeVisible();
    await expect(page.getByText("Consumers must not use opacity")).toBeVisible();
    await expect(page.getByText("inherit foreground from the consuming item context")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Index Nav Item Supporting Text Style Token", level: 1 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
