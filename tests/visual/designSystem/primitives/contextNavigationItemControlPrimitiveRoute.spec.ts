import { expect, test } from "@playwright/test";

test.describe("context-navigation-item-control primitive route", () => {
  test("renders destination and utility item semantics", async ({ page }) => {
    await page.goto("/design-system/default/primitives/context-navigation-item-control");

    await expect(page.getByRole("heading", { name: "Context Navigation Item Control Primitive" })).toBeVisible();
    const overview = page.getByRole("link", { name: "Overview" });
    await expect(overview).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("link", { name: "Patterns" })).toHaveAttribute("href", /\/design-system\/patterns$/);
    await expect
      .poll(async () => {
        return overview.locator("svg.ds-context-navigation-item-control-icon").evaluate((icon) => {
          const rect = icon.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
      })
      .toBe(true);
    await page.getByRole("button", { name: "More" }).click();
    await expect(page.getByText("Activation log: More")).toBeVisible();
    await expect(page.getByRole("button", { name: "Access" })).toBeDisabled();
  });
});
