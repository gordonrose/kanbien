import { expect, test } from "@playwright/test";

test.describe("text field foundation token routes", () => {
  test("renders field value text style proof", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto("/design-system/default/tokens/field-value-text-style");

    await expect(page.getByRole("heading", { name: "Field Value Text Style Token", level: 1 })).toBeVisible();
    await expect(page.getByText("1rem / 1.4 at weight 400")).toBeVisible();
    await expect(page.getByText("Value text is tokenized separately from labels and helper text.")).toBeVisible();
  });

  test("renders text control frame proof", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto("/design-system/default/tokens/text-control-frame");

    await expect(page.getByRole("heading", { name: "Text Control Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("body-region-frame + minimum-target-size")).toHaveCount(5);
    await expect(page.getByText("text-control-frame-error")).toBeVisible();
    await expect(page.getByText("#fff7f7", { exact: true })).toBeVisible();
    await expect(page.getByText("#d94a4a", { exact: true })).toBeVisible();
    await expect(page.getByText("44px min height")).toHaveCount(5);
    await expect(page.getByText("Text-entry primitives must consume this token before rendering native controls.")).toBeVisible();
  });
});
