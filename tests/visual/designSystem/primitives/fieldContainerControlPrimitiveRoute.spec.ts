import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/field-container-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("field-container-control primitive route", () => {
  test("renders a token-backed field container with a governed child boundary", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Field Container Control Primitive", level: 1 })).toBeVisible();
    const container = page.locator("[data-field-container-control]").first();
    await expect(container).toBeVisible();
    await expect(container).toHaveAttribute("data-field-container-control-slot", "provided");
    await expect(page.locator("[data-field-container-proof-child]")).toBeVisible();
    await expect(page.getByText("--field-container-frame")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("review controls change slot posture, direction, and constrained width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const host = page.locator("[data-field-container-review-width]").first();
    const container = page.locator("[data-field-container-control]").first();
    await page.locator("[data-field-container-slot-control]").selectOption("empty");
    await page.locator("[data-field-container-direction-control]").selectOption("rtl");
    await page.locator("[data-field-container-width-control]").selectOption("narrow");

    await expect(container).toHaveAttribute("data-field-container-control-slot", "empty");
    await expect(page.locator("[data-field-container-proof-child]")).toHaveCount(0);
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(host).toHaveAttribute("data-field-container-review-width", "narrow");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
