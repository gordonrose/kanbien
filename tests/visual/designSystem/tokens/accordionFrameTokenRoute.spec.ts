import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/accordion-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("accordion frame token route", () => {
  test("renders governed accordion-frame variants and source mapping", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Accordion Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--accordion-frame-original")).toBeVisible();
    await expect(page.getByText("--accordion-frame-dark")).toBeVisible();
    await expect(page.getByText("--accordion-frame-desert")).toBeVisible();
    await expect(page.getByText("--background-surface-dark").first()).toBeVisible();
    await expect(page.getByText("--icon-button-glyph-size").first()).toBeVisible();
    await expect(page.getByText("--target-size-interactive-min").first()).toBeVisible();
    await expect(page.getByText("header minimum height comes from minimum target size").first()).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps mobile proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Accordion Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--accordion-frame-desert")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
