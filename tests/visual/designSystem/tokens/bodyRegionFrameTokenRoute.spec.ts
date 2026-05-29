import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/body-region-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("body region frame token route", () => {
  test("renders signed body-region frame values and dependency evidence", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Body Region Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--body-region-frame")).toBeVisible();
    await expect(page.getByText("--panel-frame")).toBeVisible();
    await expect(page.getByText("1rem", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("0.75rem", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("26rem", { exact: true })).toBeVisible();
    await expect(page.getByText("100%", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("12rem", { exact: true })).toBeVisible();
    await expect(page.getByText("32rem", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Hosted controls still need their own governed token and primitive foundations")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Body Region Frame Token", level: 1 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
