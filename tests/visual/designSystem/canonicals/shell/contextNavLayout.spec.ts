import { expect, test } from "@playwright/test";

test("context-nav launcher content reserves the rail lane on desktop", async ({ page }) => {
  await page.goto("/design-system/canonicals/context-nav");

  const rail = page.locator(".context-nav");
  const main = page.locator(".design-system-page-main");

  await expect(rail).toBeVisible();
  await expect(main).toBeVisible();

  const railBox = await rail.boundingBox();
  const mainBox = await main.boundingBox();

  expect(railBox).not.toBeNull();
  expect(mainBox).not.toBeNull();

  if (!railBox || !mainBox) {
    return;
  }

  expect(mainBox.x).toBeGreaterThanOrEqual(railBox.x + railBox.width - 1);
});
