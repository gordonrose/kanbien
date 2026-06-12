import { expect, test } from "@playwright/test";

test.describe("top-navigation-frame token route", () => {
  test("renders governed frame/state roles instead of the blocked inventory", async ({ page }) => {
    await page.goto("/design-system/default/tokens/top-navigation-frame");

    await expect(page.getByRole("heading", { name: "Top Navigation Frame Token" })).toBeVisible();
    await expect(page.locator(".token-spec-top-nav-frame-preview").first()).toBeVisible();
    await expect(page.locator(".token-spec-top-nav-frame-shell").first()).toBeVisible();
    await expect(page.locator(".token-spec-top-nav-frame-menu").first()).toBeVisible();

    await expect(page.getByText("top navigation chrome").first()).toBeVisible();
    await expect(page.getByText("top navigation current destination").first()).toBeVisible();
    await expect(page.getByText("top navigation trigger").first()).toBeVisible();
    await expect(page.getByText("top navigation open trigger").first()).toBeVisible();
    await expect(page.getByText("top navigation menu panel").first()).toBeVisible();
    await expect(page.getByText("Current-destination values must be paired with programmatic current semantics")).toBeVisible();
    await expect(page.getByText("Open-trigger values must be paired with programmatic expanded semantics")).toBeVisible();
  });
});
