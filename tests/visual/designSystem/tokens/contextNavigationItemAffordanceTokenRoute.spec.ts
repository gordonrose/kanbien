import { expect, test } from "@playwright/test";

test.describe("context-navigation-item-affordance token route", () => {
  test("renders the governed item state preview", async ({ page }) => {
    await page.goto("/design-system/default/tokens/context-navigation-item-affordance");

    await expect(page.getByRole("heading", { name: "Context Navigation Item Affordance Token" })).toBeVisible();
    await expect(page.getByText("Rest", { exact: true })).toBeVisible();
    await expect(page.getByText("Hover", { exact: true })).toBeVisible();
    await expect(page.getByText("Current", { exact: true })).toBeVisible();
    await expect(page.getByText("Disabled", { exact: true })).toBeVisible();
  });
});
