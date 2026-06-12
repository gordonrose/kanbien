import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/record-list-item-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("record-list-item-control primitive route", () => {
  test("proves dark theme, RTL, constrained width, and keyboard movement feedback", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Record List Item Control", level: 1 })).toBeVisible();
    await page.locator("[data-record-list-proof-control='theme']").selectOption("dark");
    await page.locator("[data-record-list-proof-control='direction']").selectOption("rtl");
    await page.locator("[data-record-list-proof-control='width']").selectOption("narrow");

    const stage = page.locator("[data-record-list-proof-width]").first();
    await expect(stage).toHaveAttribute("data-theme-scope", "dark");
    await expect(stage).toHaveAttribute("dir", "rtl");
    await expect(stage).toHaveAttribute("data-record-list-proof-width", "narrow");

    const item = page.getByRole("button", { name: /LedgerWorks Finance/ });
    await item.focus();
    await page.keyboard.press("Alt+ArrowDown");
    await expect(page.locator("[data-record-list-item-log]")).toContainText("move ledgerworks after atlas by keyboard");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
