import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/index-nav-list-gap";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav list gap token route", () => {
  test("renders the signed list gap token proof", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav List Gap Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--index-nav-list-gap")).toBeVisible();
    await expect(page.getByText("This is list composition spacing, not internal item spacing.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Index Nav List Gap Token", level: 1 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
