import { expect, test } from "@playwright/test";

test.describe("textarea-growth token route", () => {
  test("renders textarea row presets and viewport caps", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto("/design-system/default/tokens/textarea-growth");

    await expect(page.getByRole("heading", { name: "Textarea Growth Token", level: 1 })).toBeVisible();
    await expect(page.getByText("1 initial rows / 50vh max block size")).toBeVisible();
    await expect(page.getByText("5 initial rows / 75vh max block size")).toBeVisible();
    await expect(page.getByText("15 initial rows / 90vh max block size")).toBeVisible();
    await expect(page.getByText("90vh", { exact: true })).toBeVisible();
  });
});
