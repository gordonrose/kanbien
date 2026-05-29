import { expect, test } from "@playwright/test";

const route = "/design-system/default/tokens/error-text-style";

test("renders error text style token proof", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto(route);

  await expect(page.getByRole("heading", { name: "Error Text Style Token", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Field error text", level: 3 })).toBeVisible();
  await expect(page.getByText("#7a1f1f", { exact: true })).toBeVisible();
  await expect(page.getByText("Error text is wired to the field description.")).toBeVisible();
});
