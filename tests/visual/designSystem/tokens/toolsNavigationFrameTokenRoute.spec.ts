import { expect, test } from "@playwright/test";

test.describe("tools-navigation-frame token route", () => {
  test("renders desktop rail token and mobile-hidden posture", async ({ page }) => {
    await page.goto("/design-system/default/tokens/tools-navigation-frame");

    await expect(page.getByRole("heading", { name: "Tools Navigation Frame Token" })).toBeVisible();
    await expect(page.locator(".token-spec-tools-nav-frame-preview").first()).toBeVisible();
    await expect(page.locator(".token-spec-tools-nav-frame-rail").first()).toBeVisible();
    await expect(page.getByText("Tools hidden on mobile").first()).toBeVisible();
    await expect(page.getByText("fixed right rail")).toBeVisible();
    await expect(page.getByText("hidden", { exact: true })).toBeVisible();
    await expect(page.getByText("--tools-navigation-frame")).toBeVisible();
  });
});
