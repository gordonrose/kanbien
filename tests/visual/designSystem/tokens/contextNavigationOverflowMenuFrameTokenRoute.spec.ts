import { expect, test } from "@playwright/test";

test.describe("context-navigation-overflow-menu-frame token route", () => {
  test("renders overflow menu frame token", async ({ page }) => {
    await page.goto("/design-system/default/tokens/context-navigation-overflow-menu-frame");

    await expect(page.getByRole("heading", { name: "Context Navigation Overflow Menu Frame Token" })).toBeVisible();
    await expect(page.getByText("--context-navigation-overflow-menu-frame")).toBeVisible();
  });
});
