import { expect, test } from "@playwright/test";

test.describe("tools-navigation pattern route", () => {
  test("renders desktop right rail and hides it on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 760 });
    await page.goto("/design-system/default/patterns/tools-navigation");

    await expect(page.getByRole("heading", { name: "Tools Navigation Pattern" })).toBeVisible();
    const rail = page.locator("[data-tools-navigation-region='desktop-rail']");
    await expect(rail).toBeVisible();
    await expect(rail).toHaveCSS("position", "relative");
    await expect(page.getByRole("button", { name: "Build" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Build" })).toHaveAttribute("data-icon-button-control", "");
    await expect(rail.locator("[data-icon-button-control]")).toHaveCount(4);

    await page.locator("[data-tools-navigation-viewport-control]").selectOption("mobile");
    await expect(rail).toBeHidden();

    await page.locator("[data-tools-navigation-viewport-control]").selectOption("desktop");
    await expect(rail).toBeVisible();
    await page.getByRole("button", { name: "Support" }).click();
    await expect(page.getByText("Activation log: support")).toBeVisible();
  });
});
