import { expect, test } from "@playwright/test";

test.describe("top-navigation-base-tokens route", () => {
  test("renders blocked 41-token inventory and retired 40 variable groups", async ({ page }) => {
    await page.goto("/design-system/default/tokens/top-navigation-base-tokens");

    await expect(page.getByRole("heading", { name: "Top Navigation 41 Token Inventory" })).toBeVisible();
    await expect(page.locator(".token-spec-top-nav-base-preview").first()).toBeVisible();
    await expect(page.locator(".token-spec-top-nav-base-shell").first()).toBeVisible();
    await expect(page.getByText("mapped 41", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("background-color / primary-color-source / primary-tinted-* / focus-ring").first()).toBeVisible();
    await expect(page.getByText("resolved 41", { exact: true }).first()).toBeVisible();
    await expect(
      page.getByText("top-navigation-frame owns text / border / current state / menu elevation / non-flush radius").first(),
    ).toBeVisible();
    await expect(page.getByText("retired 40", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("--surface-* / --ink* / --line* / --accent* / --shadow* / --radius*").first()).toBeVisible();
    await expect(page.getByText("blocked inventory: downstream work must consume top-navigation-frame")).toBeVisible();
  });
});
