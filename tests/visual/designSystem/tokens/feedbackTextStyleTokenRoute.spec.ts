import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/feedback-text-style";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("feedback text style token route", () => {
  test("renders feedback text variants and their upstream token sources", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Feedback Text Style Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--feedback-text-style-neutral-dark")).toBeVisible();
    await expect(page.getByText("--feedback-text-style-warning-dark")).toBeVisible();
    await expect(page.getByText("--feedback-text-style-error-dark")).toBeVisible();
    await expect(page.getByText("--background-surface-dark")).toBeVisible();
    await expect(page.getByText("--status-color-warning-dark")).toBeVisible();
    await expect(page.getByText("--text-control-frame-error-dark")).toBeVisible();
    await expect(page.getByText("Short feedback text may wrap").first()).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Feedback Text Style Token", level: 1 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
