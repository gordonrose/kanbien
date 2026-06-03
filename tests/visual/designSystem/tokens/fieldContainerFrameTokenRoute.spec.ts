import { expect, test } from "@playwright/test";

test.describe("field-container-frame token route", () => {
  test("renders token values and dependency mapping", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto("/design-system/default/tokens/field-container-frame");

    await expect(page.getByRole("heading", { name: "Field Container Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--body-region-frame")).toBeVisible();
    await expect(page.getByText("1rem", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("8.5rem", { exact: true })).toBeVisible();
    const preview = page.locator(".token-spec-field-container-frame-preview").first();
    await expect(preview.getByText("Field label")).toBeVisible();
    await expect(preview.getByText("Hosted field control")).toBeVisible();
    await expect(page.getByText("Hosted field content must still consume its own governed primitive")).toBeVisible();
  });
});
