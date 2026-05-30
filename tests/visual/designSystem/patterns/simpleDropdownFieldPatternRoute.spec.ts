import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/simple-dropdown-field";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("simple-dropdown-field pattern route", () => {
  test("renders a governed field row composed with a simple dropdown", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Simple Dropdown Field Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-truncating-label]").filter({ hasText: "Page template" }).first()).toBeVisible();
    await expect(page.getByText("Choose the page template used for this entity view route.")).toBeVisible();
    await page.getByRole("button", { name: "Record management page" }).click();
    await page.getByRole("option", { name: "Record management list centric" }).click();
    await expect(page.getByText("Selection log: record_management_list_centric")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("review controls change visible state, width, direction, and error wiring", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-simple-dropdown-field-option-length-control]").selectOption("long");
    await page.locator("[data-simple-dropdown-field-label-length-control]").selectOption("long");
    await page.locator("[data-simple-dropdown-field-width-control]").selectOption("narrow");
    await page.locator("[data-simple-dropdown-field-direction-control]").selectOption("rtl");
    await page.locator("[data-simple-dropdown-field-state-control]").selectOption("error");

    await expect(page.locator("[data-simple-dropdown-field-review-width]").first()).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("button")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("[data-field-row-control-message='error']")).toHaveText("Choose one page template before continuing.");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
