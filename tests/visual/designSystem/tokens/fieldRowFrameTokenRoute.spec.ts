import { expect, test } from "@playwright/test";

test.describe("field-row-frame token route", () => {
  test("renders token values and dependency mapping", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto("/design-system/default/tokens/field-row-frame");

    await expect(page.getByRole("heading", { name: "Field Row Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("body-region-frame + minimum-target-size")).toBeVisible();
    await expect(page.getByText("0.75rem row gap")).toBeVisible();
    await expect(page.getByText("44px control slot minimum height")).toBeVisible();
    await expect(page.getByText("Future hosted controls must consume their own signed tokens")).toBeVisible();
  });
});
