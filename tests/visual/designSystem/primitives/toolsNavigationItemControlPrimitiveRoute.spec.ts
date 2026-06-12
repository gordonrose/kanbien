import { expect, test } from "@playwright/test";

test.describe("tools-navigation-item-control primitive route", () => {
  test("renders active and unavailable named tool buttons", async ({ page }) => {
    await page.goto("/design-system/default/primitives/tools-navigation-item-control");

    await expect(page.getByRole("heading", { name: "Tools Navigation Item Control Primitive" })).toBeVisible();
    await expect(page.locator(".tools-navigation-item-control-proof-canvas")).toBeVisible();
    await expect(page.locator(".tools-navigation-item-control-proof-rail")).toBeVisible();
    await expect(page.locator(".tools-navigation-item-control-proof-inspector")).toBeVisible();
    const build = page.getByRole("button", { name: "Build" });
    const audit = page.getByRole("button", { name: "Audit unavailable" });
    await expect(build).toHaveAttribute("aria-pressed", "true");
    await expect(audit).toHaveAttribute("aria-disabled", "true");
    await expect(build).toHaveAttribute("data-icon-button-control", "");
    await expect
      .poll(async () => {
        return build.locator("svg.ds-icon-button-control-glyph").evaluate((icon) => {
          const rect = icon.getBoundingClientRect();
          const styles = getComputedStyle(icon);
          return {
            width: rect.width,
            height: rect.height,
            stroke: styles.stroke,
          };
        });
      })
      .toMatchObject({
        width: expect.any(Number),
        height: expect.any(Number),
      });
    await expect
      .poll(async () => {
        return build.locator("svg.ds-icon-button-control-glyph").evaluate((icon) => {
          const rect = icon.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
      })
      .toBe(true);
    await expect(page.getByText("Build").last()).toBeVisible();
    await expect(page.getByText("active").last()).toBeVisible();

    await page.getByRole("button", { name: "Reports" }).click();
    await expect(page.getByText("Activation log: reports")).toBeVisible();
    await audit.click({ force: true });
    await expect(page.getByText("Activation log: reports")).toBeVisible();
  });
});
