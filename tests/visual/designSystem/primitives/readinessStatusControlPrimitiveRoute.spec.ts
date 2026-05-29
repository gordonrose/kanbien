import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/readiness-status-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("readiness status control primitive route", () => {
  test("renders text-backed status semantics without badge visuals", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Readiness Status Control", level: 1 })).toBeVisible();
    await expect(page.getByRole("status", { name: "Status: Ready" })).toBeVisible();
    await expect(page.getByRole("status", { name: "Status: Needs review" })).toBeVisible();
    await expect(page.getByRole("status", { name: "Status: Blocked" })).toBeVisible();
    await expect(page.getByRole("status", { name: "Status: Unknown" })).toBeVisible();
    await expect(page.getByText("No badge, icon, fill, border, or colour tone is approved by this primitive.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Readiness Status Control", level: 1 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
